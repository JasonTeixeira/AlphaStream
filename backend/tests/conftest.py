import numpy as np
import pandas as pd
import pytest

@pytest.fixture
def sample_ohlcv():
    np.random.seed(42)
    n = 200
    dates = pd.date_range("2024-01-01", periods=n, freq="h")
    close = 5000 + np.cumsum(np.random.randn(n) * 10)
    return pd.DataFrame({
        "timestamp": dates,
        "open": close + np.random.randn(n),
        "high": close + abs(np.random.randn(n) * 5),
        "low": close - abs(np.random.randn(n) * 5),
        "close": close,
        "volume": np.random.randint(1000, 10000, n).astype(float),
    })
