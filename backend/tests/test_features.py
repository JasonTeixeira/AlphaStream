"""Tests for feature engineering — verify zero data leakage."""
import numpy as np
from alphastream.features.engineering import create_features, create_targets, get_feature_columns

def test_no_future_data(sample_ohlcv):
    df = create_features(sample_ohlcv)
    future_cols = [c for c in df.columns if "future" in c or "target" in c]
    assert future_cols == [], f"Features contain future data: {future_cols}"

def test_expected_columns(sample_ohlcv):
    df = create_features(sample_ohlcv)
    for col in ["sma_5", "ema_20", "rsi_14", "macd", "bb_width_20", "atr_14", "volatility_10"]:
        assert col in df.columns, f"Missing: {col}"

def test_backward_looking(sample_ohlcv):
    df = create_features(sample_ohlcv)
    feature_cols = get_feature_columns(df)
    last_row = df.iloc[-1][feature_cols]
    assert last_row.notna().sum() / len(last_row) > 0.9

def test_targets_separate(sample_ohlcv):
    df = create_targets(sample_ohlcv, horizon=5)
    assert "future_return_5" in df.columns
    assert "target_5" in df.columns

def test_excludes_raw(sample_ohlcv):
    df = create_features(sample_ohlcv)
    df = create_targets(df, horizon=5)
    feature_cols = get_feature_columns(df)
    for col in ["timestamp", "open", "high", "low", "close", "volume", "target_5"]:
        assert col not in feature_cols

def test_handles_zero_close(sample_ohlcv):
    sample_ohlcv.loc[5, "close"] = 0
    df = create_features(sample_ohlcv)  # should not crash

def test_feature_count(sample_ohlcv):
    df = create_features(sample_ohlcv)
    feature_cols = get_feature_columns(df)
    assert 40 <= len(feature_cols) <= 60, f"Got {len(feature_cols)} features"
