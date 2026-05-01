"""
Feature engineering pipeline — NO data leakage.

Rules enforced:
1. All features use ONLY past data (no .shift(-n), no future rolling)
2. Scaler is fit ONLY on training data
3. Target variables are created separately and never included as features
"""

import numpy as np
import pandas as pd


def create_features(df: pd.DataFrame) -> pd.DataFrame:
    """Create technical indicator features from OHLCV data.

    All features are backward-looking only — no future data leakage.
    Expects columns: open, high, low, close, volume, timestamp
    """
    df = df.copy()
    df = df.sort_values("timestamp").reset_index(drop=True)

    close = df["close"]
    high = df["high"]
    low = df["low"]
    volume = df["volume"]

    # --- Price-based ---
    df["returns"] = close.pct_change()
    df["log_returns"] = np.log(close / close.shift(1))
    df["price_range"] = (high - low) / close
    df["price_position"] = (close - low) / (high - low + 1e-10)

    # --- Moving averages (backward-looking only) ---
    for p in [5, 10, 20, 50]:
        df[f"sma_{p}"] = close.rolling(p).mean()
        df[f"ema_{p}"] = close.ewm(span=p, adjust=False).mean()
        df[f"price_to_sma_{p}"] = close / df[f"sma_{p}"]

    # --- RSI ---
    for p in [7, 14, 21]:
        delta = close.diff()
        gain = delta.clip(lower=0).rolling(p).mean()
        loss = (-delta.clip(upper=0)).rolling(p).mean()
        rs = gain / (loss + 1e-10)
        df[f"rsi_{p}"] = 100 - (100 / (1 + rs))

    # --- MACD ---
    ema_12 = close.ewm(span=12, adjust=False).mean()
    ema_26 = close.ewm(span=26, adjust=False).mean()
    df["macd"] = ema_12 - ema_26
    df["macd_signal"] = df["macd"].ewm(span=9, adjust=False).mean()
    df["macd_hist"] = df["macd"] - df["macd_signal"]

    # --- Bollinger Bands ---
    for p in [20]:
        sma = close.rolling(p).mean()
        std = close.rolling(p).std()
        df[f"bb_upper_{p}"] = sma + 2 * std
        df[f"bb_lower_{p}"] = sma - 2 * std
        df[f"bb_width_{p}"] = (df[f"bb_upper_{p}"] - df[f"bb_lower_{p}"]) / (sma + 1e-10)
        df[f"bb_position_{p}"] = (close - df[f"bb_lower_{p}"]) / (
            df[f"bb_upper_{p}"] - df[f"bb_lower_{p}"] + 1e-10
        )

    # --- ATR ---
    for p in [14]:
        tr = pd.concat(
            [
                high - low,
                (high - close.shift(1)).abs(),
                (low - close.shift(1)).abs(),
            ],
            axis=1,
        ).max(axis=1)
        df[f"atr_{p}"] = tr.rolling(p).mean()
        df[f"atr_ratio_{p}"] = df[f"atr_{p}"] / (close + 1e-10)

    # --- Stochastic ---
    for p in [14]:
        low_min = low.rolling(p).min()
        high_max = high.rolling(p).max()
        df[f"stoch_k_{p}"] = 100 * (close - low_min) / (high_max - low_min + 1e-10)
        df[f"stoch_d_{p}"] = df[f"stoch_k_{p}"].rolling(3).mean()

    # --- Volume features ---
    df["volume_sma_20"] = volume.rolling(20).mean()
    df["volume_ratio"] = volume / (df["volume_sma_20"] + 1e-10)
    df["volume_trend"] = volume.rolling(5).mean() / (volume.rolling(20).mean() + 1e-10)

    # --- Volatility ---
    for p in [5, 10, 20]:
        df[f"volatility_{p}"] = df["returns"].rolling(p).std()

    # --- Momentum ---
    for p in [5, 10, 20]:
        df[f"momentum_{p}"] = close / close.shift(p) - 1

    # --- Mean reversion ---
    df["z_score_20"] = (close - close.rolling(20).mean()) / (close.rolling(20).std() + 1e-10)
    df["z_score_50"] = (close - close.rolling(50).mean()) / (close.rolling(50).std() + 1e-10)

    # --- Time features (cyclical) ---
    if "timestamp" in df.columns:
        ts = pd.to_datetime(df["timestamp"])
        hour = ts.dt.hour + ts.dt.minute / 60
        dow = ts.dt.dayofweek
        df["hour_sin"] = np.sin(2 * np.pi * hour / 24)
        df["hour_cos"] = np.cos(2 * np.pi * hour / 24)
        df["dow_sin"] = np.sin(2 * np.pi * dow / 7)
        df["dow_cos"] = np.cos(2 * np.pi * dow / 7)

    return df


def create_targets(df: pd.DataFrame, horizon: int = 5) -> pd.DataFrame:
    """Create target variable — SEPARATE from features to prevent leakage.

    This uses future data (shift(-horizon)) which is ONLY used as the label,
    NEVER as a feature column.
    """
    df = df.copy()
    df[f"future_return_{horizon}"] = df["close"].shift(-horizon) / df["close"] - 1
    df[f"target_{horizon}"] = (df[f"future_return_{horizon}"] > 0).astype(int)
    return df


# Columns that are NEVER features
NON_FEATURE_COLS = {
    "timestamp", "symbol", "open", "high", "low", "close", "volume",
    "future_return_1", "future_return_5", "future_return_15",
    "target_1", "target_5", "target_15",
}


def get_feature_columns(df: pd.DataFrame) -> list[str]:
    """Return only valid feature columns — excludes raw OHLCV and targets."""
    return [c for c in df.columns if c not in NON_FEATURE_COLS and not c.startswith("future_")]
