"""Tests for model training pipeline."""
import numpy as np
from alphastream.models.trainer import train_model, walk_forward_split

def test_no_overlap():
    for train_idx, val_idx in walk_forward_split(1000, n_splits=5, purge_gap=10):
        assert len(set(train_idx) & set(val_idx)) == 0

def test_purge_gap():
    for train_idx, val_idx in walk_forward_split(1000, n_splits=5, purge_gap=10):
        assert val_idx[0] - train_idx[-1] >= 10

def test_expanding():
    splits = walk_forward_split(1000, n_splits=5, purge_gap=10)
    sizes = [len(t) for t, _ in splits]
    for i in range(1, len(sizes)):
        assert sizes[i] >= sizes[i - 1]

def test_split_count():
    assert len(walk_forward_split(1000, n_splits=5, purge_gap=10)) == 5

def _make_data():
    np.random.seed(42)
    X = np.random.randn(500, 10)
    y = (X[:, 0] + X[:, 1] > 0).astype(int)
    s = int(len(X) * 0.8)
    return X[:s], y[:s], X[s:], y[s:]

def test_xgboost():
    model, m = train_model("xgboost", *_make_data())
    assert model is not None and hasattr(model, "predict")

def test_lightgbm():
    model, m = train_model("lightgbm", *_make_data())
    assert model is not None and hasattr(model, "predict")

def test_random_forest():
    model, m = train_model("random_forest", *_make_data())
    assert model is not None

def test_metrics_keys():
    _, m = train_model("random_forest", *_make_data())
    for k in ("accuracy", "precision", "recall", "f1", "auc"):
        assert k in m and 0 <= m[k] <= 1
