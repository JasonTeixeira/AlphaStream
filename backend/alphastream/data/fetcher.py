"""
Market data fetcher — uses yfinance for free historical data.

Symbol mapping for futures (yfinance continuous contracts):
ES -> ES=F (S&P 500 E-mini)
NQ -> NQ=F (Nasdaq 100 E-mini)
CL -> CL=F (Crude Oil)
GC -> GC=F (Gold)
SI -> SI=F (Silver)
HG -> HG=F (Copper)
ZB -> ZB=F (30-Year Treasury Bond)
RTY -> RTY=F (Russell 2000 E-mini)
"""

import time

import pandas as pd
import yfinance as yf
from loguru import logger

# Map our symbol names to yfinance tickers
SYMBOL_MAP = {
    "ES": "ES=F",
    "NQ": "NQ=F",
    "CL": "CL=F",
    "GC": "GC=F",
    "SI": "SI=F",
    "HG": "HG=F",
    "ZB": "ZB=F",
    "RTY": "RTY=F",
    # Crypto
    "BTC": "BTC-USD",
    "ETH": "ETH-USD",
}

SUPPORTED_SYMBOLS = list(SYMBOL_MAP.keys())


def fetch_historical(
    symbol: str,
    period: str = "2y",
    interval: str = "1h",
) -> pd.DataFrame:
    """Fetch historical OHLCV data from yfinance.

    Args:
        symbol: Our symbol name (ES, NQ, CL, etc.)
        period: How far back (1mo, 3mo, 6mo, 1y, 2y, 5y, max)
        interval: Bar size (1m, 5m, 15m, 1h, 1d)
            Note: 1m data only available for last 7 days
                  5m/15m data only available for last 60 days
                  1h data available for last 730 days

    Returns:
        DataFrame with columns: timestamp, open, high, low, close, volume, symbol
    """
    yf_ticker = SYMBOL_MAP.get(symbol, symbol)
    logger.info(f"Fetching {symbol} ({yf_ticker}) | period={period} interval={interval}")

    df = pd.DataFrame()
    max_retries = 3
    for attempt in range(1, max_retries + 1):
        try:
            df = yf.download(yf_ticker, period=period, interval=interval, progress=False, timeout=30)
            if not df.empty:
                break
        except Exception as e:
            logger.warning(f"yfinance attempt {attempt}/{max_retries} failed for {symbol}: {e}")
        if attempt < max_retries:
            backoff = 2 ** (attempt - 1)  # 1s, 2s
            logger.info(f"Retrying in {backoff}s...")
            time.sleep(backoff)

    if df.empty:
        logger.warning(f"No data returned for {symbol} after {max_retries} attempts")
        return pd.DataFrame()

    # Normalize columns — yfinance 1.x uses MultiIndex columns
    if isinstance(df.columns, pd.MultiIndex):
        df.columns = df.columns.get_level_values(0)

    df = df.reset_index()
    col_map = {
        "Date": "timestamp",
        "Datetime": "timestamp",
        "Open": "open",
        "High": "high",
        "Low": "low",
        "Close": "close",
        "Volume": "volume",
    }
    df = df.rename(columns=col_map)

    # Keep only what we need
    keep_cols = ["timestamp", "open", "high", "low", "close", "volume"]
    df = df[[c for c in keep_cols if c in df.columns]]

    # Add symbol
    df["symbol"] = symbol

    # Ensure timestamp is datetime
    df["timestamp"] = pd.to_datetime(df["timestamp"])

    # Drop rows with missing data
    df = df.dropna(subset=["open", "high", "low", "close"])

    logger.info(f"Fetched {len(df)} bars for {symbol}")
    return df


def fetch_latest(symbol: str, bars: int = 300) -> pd.DataFrame:
    """Fetch latest data for inference (enough bars to compute all indicators)."""
    # For hourly data, 300 bars = ~12 trading days
    return fetch_historical(symbol, period="1mo", interval="1h")


def fetch_all_symbols(period: str = "2y", interval: str = "1h") -> dict[str, pd.DataFrame]:
    """Fetch data for all supported symbols."""
    data = {}
    for symbol in SUPPORTED_SYMBOLS:
        try:
            df = fetch_historical(symbol, period=period, interval=interval)
            if not df.empty:
                data[symbol] = df
        except Exception as e:
            logger.error(f"Failed to fetch {symbol}: {e}")
    return data
