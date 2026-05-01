"""
FastAPI server — real endpoints for AlphaStream.

Endpoints:
  GET  /v1/signals          — list latest signals
  GET  /v1/signals/{symbol} — signal for a specific symbol
  GET  /v1/models           — model performance metrics
  GET  /v1/prices/{symbol}  — latest price data
  POST /v1/backtest         — run a backtest
  GET  /health              — health check
"""

import asyncio
from contextlib import asynccontextmanager
from datetime import datetime, timezone
from typing import Optional

from fastapi import FastAPI, HTTPException, Query, Depends, Header, Request
from fastapi.middleware.cors import CORSMiddleware
from jose import jwt, JWTError
from loguru import logger
from pydantic import BaseModel
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address
from starlette.concurrency import run_in_threadpool
from supabase import create_client

from alphastream.config.settings import settings
from alphastream.data.fetcher import SUPPORTED_SYMBOLS, fetch_historical, fetch_latest
from alphastream.signals.generator import SignalGenerator

# Global signal generator (loaded on startup)
signal_gen: SignalGenerator | None = None
supabase_client = None
cached_signals: list[dict] = []
last_signal_time: datetime | None = None

# Lock to prevent race conditions on cached_signals
_signal_lock = asyncio.Lock()

# Rate limiter
limiter = Limiter(key_func=get_remote_address)


# --- Auth dependency ---

PUBLIC_PATHS = {"/health", "/docs", "/openapi.json", "/redoc"}


async def verify_auth(
    request: Request,
    authorization: Optional[str] = Header(None),
    x_api_key: Optional[str] = Header(None),
):
    """Validate JWT or API key for protected endpoints."""
    # Allow public endpoints without auth
    if request.url.path in PUBLIC_PATHS:
        return None

    # Skip auth for non-v1 endpoints
    if not request.url.path.startswith("/v1/"):
        return None

    # Try JWT first
    if authorization and authorization.startswith("Bearer "):
        token = authorization.removeprefix("Bearer ")
        try:
            payload = jwt.decode(
                token,
                settings.SUPABASE_JWT_SECRET,
                algorithms=["HS256"],
                options={"verify_aud": False},
            )
            return payload
        except JWTError as e:
            logger.warning(f"JWT validation failed: {e}")

    # Fall back to API key
    if x_api_key:
        # TODO: validate against stored API keys in supabase
        return {"api_key": x_api_key}

    raise HTTPException(
        status_code=401,
        detail="Missing or invalid authentication. Provide Authorization: Bearer <token> or X-API-Key header.",
    )


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load models and supabase client on startup."""
    global signal_gen, supabase_client, cached_signals

    # Initialize Supabase client
    if settings.SUPABASE_URL and settings.SUPABASE_KEY:
        supabase_client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
        logger.info("Supabase client initialized")

        # Load last 100 signals from supabase
        try:
            result = supabase_client.table("signals").select("*").order(
                "timestamp", desc=True
            ).limit(100).execute()
            if result.data:
                cached_signals = result.data
                logger.info(f"Loaded {len(cached_signals)} cached signals from Supabase")
        except Exception as e:
            logger.warning(f"Failed to load signals from Supabase: {e}")
    else:
        logger.warning("Supabase credentials not configured — signal persistence disabled")

    # Load models
    logger.info("Loading signal generator...")
    signal_gen = SignalGenerator()
    logger.info(f"Loaded {len(signal_gen.predictors)} symbol predictors")

    yield
    logger.info("Shutting down")


app = FastAPI(
    title="AlphaStream API",
    version="1.0.0",
    description="ML-powered trading signals for futures markets",
    lifespan=lifespan,
    dependencies=[Depends(verify_auth)],
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- Models ---

class SignalResponse(BaseModel):
    id: str
    symbol: str
    direction: str
    confidence: float
    entry_price: float
    stop_loss: float
    take_profit: float
    timestamp: str
    model_predictions: dict
    ensemble_score: float
    status: str


class PriceBar(BaseModel):
    timestamp: str
    open: float
    high: float
    low: float
    close: float
    volume: float


class BacktestRequest(BaseModel):
    symbol: str
    period: str = "1y"
    interval: str = "1h"


class BacktestResult(BaseModel):
    symbol: str
    total_signals: int
    accuracy: float
    total_return: float
    sharpe_ratio: float
    max_drawdown: float
    win_rate: float
    avg_win: float
    avg_loss: float
    warning: str | None = None


# --- Endpoints ---

@app.get("/health")
async def health():
    return {
        "status": "ok",
        "models_loaded": len(signal_gen.predictors) if signal_gen else 0,
        "supported_symbols": SUPPORTED_SYMBOLS,
        "cached_signals": len(cached_signals),
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


@app.get("/v1/signals", response_model=list[SignalResponse])
@limiter.limit("30/minute")
async def get_signals(
    request: Request,
    symbol: str | None = Query(None, description="Filter by symbol"),
    limit: int = Query(20, ge=1, le=100),
):
    """Get latest trading signals."""
    global cached_signals, last_signal_time

    # Refresh signals if stale (older than 5 minutes)
    async with _signal_lock:
        now = datetime.now(timezone.utc)
        if not last_signal_time or (now - last_signal_time).total_seconds() > 300:
            if signal_gen:
                new_signals = await run_in_threadpool(signal_gen.generate_all)
                if new_signals:
                    cached_signals = new_signals + cached_signals
                    # Keep last 500 signals
                    cached_signals = cached_signals[:500]
                    last_signal_time = now

                    # Persist new signals to Supabase
                    if supabase_client:
                        try:
                            supabase_client.table("signals").insert(new_signals).execute()
                        except Exception as e:
                            logger.error(f"Failed to persist signals to Supabase: {e}")

    results = cached_signals
    if symbol:
        results = [s for s in results if s["symbol"] == symbol.upper()]

    return results[:limit]


@app.get("/v1/signals/{symbol}", response_model=SignalResponse)
async def get_signal(symbol: str):
    """Get latest signal for a specific symbol."""
    symbol = symbol.upper()

    if symbol not in SUPPORTED_SYMBOLS:
        raise HTTPException(404, f"Symbol {symbol} not supported")

    if not signal_gen:
        raise HTTPException(503, "Models not loaded")

    signal = await run_in_threadpool(signal_gen.generate_signal, symbol)
    if not signal:
        raise HTTPException(404, f"No signal available for {symbol}")

    return signal


@app.get("/v1/models")
async def get_models():
    """Get model performance metrics."""
    if not signal_gen:
        return []

    models_info = []
    for symbol, predictor in signal_gen.predictors.items():
        for model_type, metadata in predictor.metadata.items():
            avg = metadata.get("avg_metrics", {})
            models_info.append({
                "symbol": symbol,
                "model_type": model_type,
                "accuracy": avg.get("accuracy", 0),
                "auc": avg.get("auc", 0),
                "f1": avg.get("f1", 0),
                "precision": avg.get("precision", 0),
                "recall": avg.get("recall", 0),
                "training_date": metadata.get("training_date", ""),
                "n_samples": metadata.get("n_samples", 0),
                "version": metadata.get("version", 0),
            })

    return models_info


@app.get("/v1/prices/{symbol}")
@limiter.limit("60/minute")
async def get_prices(
    request: Request,
    symbol: str,
    period: str = Query("1mo", description="1d, 5d, 1mo, 3mo, 6mo, 1y, 2y"),
    interval: str = Query("1h", description="1m, 5m, 15m, 1h, 1d"),
):
    """Get historical price data."""
    symbol = symbol.upper()

    if symbol not in SUPPORTED_SYMBOLS:
        raise HTTPException(404, f"Symbol {symbol} not supported")

    df = await run_in_threadpool(fetch_historical, symbol, period, interval)
    if df.empty:
        raise HTTPException(404, f"No data for {symbol}")

    records = df.to_dict(orient="records")
    for r in records:
        r["timestamp"] = str(r["timestamp"])

    return records


@app.post("/v1/backtest", response_model=BacktestResult)
@limiter.limit("5/minute")
async def run_backtest(request: Request, req: BacktestRequest):
    """Run a simple backtest on historical data."""
    import numpy as np

    symbol = req.symbol.upper()
    if symbol not in SUPPORTED_SYMBOLS:
        raise HTTPException(404, f"Symbol {symbol} not supported")

    if not signal_gen or symbol not in signal_gen.predictors:
        raise HTTPException(503, f"No models loaded for {symbol}")

    # Fetch historical data
    df = await run_in_threadpool(fetch_historical, symbol, req.period, req.interval)
    if df.empty or len(df) < 200:
        raise HTTPException(400, f"Insufficient data for backtest: {len(df)} bars")

    predictor = signal_gen.predictors[symbol]

    def _run_backtest():
        wins = 0
        losses = 0
        returns = []
        window = 200  # minimum bars for features

        for i in range(window, len(df) - 5, 5):  # step by 5 bars
            chunk = df.iloc[i - window : i]
            signal = predictor.predict(chunk)
            if not signal or signal["direction"] == "NEUTRAL":
                continue

            # Check actual outcome (5 bars ahead)
            entry = df.iloc[i]["close"]
            exit_price = df.iloc[min(i + 5, len(df) - 1)]["close"]
            actual_return = (exit_price - entry) / entry

            if signal["direction"] == "SHORT":
                actual_return = -actual_return

            returns.append(actual_return)
            if actual_return > 0:
                wins += 1
            else:
                losses += 1

        return wins, losses, returns

    wins, losses, returns = await run_in_threadpool(_run_backtest)

    total = wins + losses
    if total == 0:
        raise HTTPException(400, "No signals generated during backtest period")

    returns_arr = np.array(returns)
    cumulative = np.cumprod(1 + returns_arr)
    peak = np.maximum.accumulate(cumulative)
    drawdowns = (cumulative - peak) / peak

    win_returns = returns_arr[returns_arr > 0]
    loss_returns = returns_arr[returns_arr <= 0]

    # Warn if backtest period overlaps training data
    warning = None
    if req.period in ("2y", "5y", "max"):
        warning = (
            "Results may include in-sample data. Models were trained on 2 years of history. "
            "Use period='6mo' or shorter for out-of-sample results."
        )

    return BacktestResult(
        symbol=symbol,
        total_signals=total,
        accuracy=round(wins / total, 4) if total else 0,
        total_return=round(float(cumulative[-1] - 1), 4) if len(cumulative) else 0,
        sharpe_ratio=round(
            float(returns_arr.mean() / (returns_arr.std() + 1e-10) * np.sqrt(252)), 2
        ),
        max_drawdown=round(float(drawdowns.min()), 4) if len(drawdowns) else 0,
        win_rate=round(wins / total, 4) if total else 0,
        avg_win=round(float(win_returns.mean()), 4) if len(win_returns) else 0,
        avg_loss=round(float(loss_returns.mean()), 4) if len(loss_returns) else 0,
        warning=warning,
    )


# --- API Key Management ---

class CreateApiKeyRequest(BaseModel):
    name: str


class ApiKeyResponse(BaseModel):
    key: str
    key_prefix: str
    name: str
    message: str


@app.post("/v1/api-keys", response_model=ApiKeyResponse)
async def create_api_key(req: CreateApiKeyRequest, request: Request):
    """Generate a secure API key (server-side CSPRNG)."""
    import hashlib
    import secrets

    # Generate cryptographically secure key
    raw_key = f"sk_live_{secrets.token_urlsafe(32)}"
    key_prefix = raw_key[:12] + "..."
    key_hash = hashlib.sha256(raw_key.encode()).hexdigest()

    # Store hash in Supabase (never store raw key)
    if supabase_client:
        try:
            supabase_client.table("api_keys").insert({
                "key_hash": key_hash,
                "key_prefix": key_prefix,
                "name": req.name,
                "permissions": ["read"],
                "rate_limit": 1000,
            }).execute()
        except Exception as e:
            logger.error(f"Failed to store API key: {e}")

    return ApiKeyResponse(
        key=raw_key,
        key_prefix=key_prefix,
        name=req.name,
        message="Store this key securely — it cannot be retrieved again.",
    )


# --- GDPR Data Export/Deletion ---

@app.get("/v1/account/export")
async def export_user_data(request: Request):
    """Export all user data (GDPR Article 15)."""
    if not supabase_client:
        raise HTTPException(503, "Database not configured")

    # Auth payload should contain user ID
    auth = request.state.__dict__.get("auth")
    if not auth or "sub" not in (auth if isinstance(auth, dict) else {}):
        raise HTTPException(401, "Authentication required")

    user_id = auth["sub"]

    profile = supabase_client.table("profiles").select("*").eq("id", user_id).execute()
    api_keys = supabase_client.table("api_keys").select("key_prefix, name, created_at").eq("user_id", user_id).execute()
    watchlists = supabase_client.table("watchlists").select("*").eq("user_id", user_id).execute()
    alerts = supabase_client.table("alerts").select("*").eq("user_id", user_id).execute()

    return {
        "profile": profile.data,
        "api_keys": api_keys.data,
        "watchlists": watchlists.data,
        "alerts": alerts.data,
        "exported_at": datetime.now(timezone.utc).isoformat(),
    }


@app.delete("/v1/account")
async def delete_user_data(request: Request):
    """Delete all user data (GDPR Article 17 - Right to Erasure)."""
    if not supabase_client:
        raise HTTPException(503, "Database not configured")

    auth = request.state.__dict__.get("auth")
    if not auth or "sub" not in (auth if isinstance(auth, dict) else {}):
        raise HTTPException(401, "Authentication required")

    user_id = auth["sub"]

    try:
        supabase_client.table("api_keys").delete().eq("user_id", user_id).execute()
        supabase_client.table("watchlists").delete().eq("user_id", user_id).execute()
        supabase_client.table("alerts").delete().eq("user_id", user_id).execute()
        supabase_client.table("subscriptions").delete().eq("user_id", user_id).execute()
        supabase_client.table("profiles").delete().eq("id", user_id).execute()
        logger.info(f"Deleted all data for user {user_id}")
    except Exception as e:
        logger.error(f"Failed to delete user data: {e}")
        raise HTTPException(500, "Failed to delete user data")

    return {"status": "deleted", "message": "All your data has been permanently removed."}
