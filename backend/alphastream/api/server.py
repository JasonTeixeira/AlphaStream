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

from contextlib import asynccontextmanager
from datetime import datetime, timezone

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from loguru import logger
from pydantic import BaseModel

from alphastream.config.settings import settings
from alphastream.data.fetcher import SUPPORTED_SYMBOLS, fetch_historical, fetch_latest
from alphastream.signals.generator import SignalGenerator

# Global signal generator (loaded on startup)
signal_gen: SignalGenerator | None = None
cached_signals: list[dict] = []
last_signal_time: datetime | None = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load models on startup."""
    global signal_gen
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
)

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
async def get_signals(
    symbol: str | None = Query(None, description="Filter by symbol"),
    limit: int = Query(20, ge=1, le=100),
):
    """Get latest trading signals."""
    global cached_signals, last_signal_time

    # Refresh signals if stale (older than 5 minutes)
    now = datetime.now(timezone.utc)
    if not last_signal_time or (now - last_signal_time).seconds > 300:
        if signal_gen:
            new_signals = signal_gen.generate_all()
            if new_signals:
                cached_signals = new_signals + cached_signals
                # Keep last 500 signals
                cached_signals = cached_signals[:500]
                last_signal_time = now

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

    signal = signal_gen.generate_signal(symbol)
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
async def get_prices(
    symbol: str,
    period: str = Query("1mo", description="1d, 5d, 1mo, 3mo, 6mo, 1y, 2y"),
    interval: str = Query("1h", description="1m, 5m, 15m, 1h, 1d"),
):
    """Get historical price data."""
    symbol = symbol.upper()

    if symbol not in SUPPORTED_SYMBOLS:
        raise HTTPException(404, f"Symbol {symbol} not supported")

    df = fetch_historical(symbol, period=period, interval=interval)
    if df.empty:
        raise HTTPException(404, f"No data for {symbol}")

    records = df.to_dict(orient="records")
    for r in records:
        r["timestamp"] = str(r["timestamp"])

    return records


@app.post("/v1/backtest", response_model=BacktestResult)
async def run_backtest(req: BacktestRequest):
    """Run a simple backtest on historical data."""
    import numpy as np

    symbol = req.symbol.upper()
    if symbol not in SUPPORTED_SYMBOLS:
        raise HTTPException(404, f"Symbol {symbol} not supported")

    if not signal_gen or symbol not in signal_gen.predictors:
        raise HTTPException(503, f"No models loaded for {symbol}")

    # Fetch historical data
    df = fetch_historical(symbol, period=req.period, interval=req.interval)
    if df.empty or len(df) < 200:
        raise HTTPException(400, f"Insufficient data for backtest: {len(df)} bars")

    predictor = signal_gen.predictors[symbol]

    # Walk through data generating signals
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

    total = wins + losses
    if total == 0:
        raise HTTPException(400, "No signals generated during backtest period")

    returns_arr = np.array(returns)
    cumulative = np.cumprod(1 + returns_arr)
    peak = np.maximum.accumulate(cumulative)
    drawdowns = (cumulative - peak) / peak

    win_returns = returns_arr[returns_arr > 0]
    loss_returns = returns_arr[returns_arr <= 0]

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
    )
