"""Tests for signal predictor."""
from alphastream.models.predictor import MODELS_DIR, SignalPredictor
import pytest

def test_no_models():
    p = SignalPredictor("NONEXISTENT")
    assert len(p.models) == 0

def test_no_models_returns_none(sample_ohlcv):
    assert SignalPredictor("NONEXISTENT").predict(sample_ohlcv) is None

@pytest.mark.skipif(not (MODELS_DIR / "ES").exists(), reason="ES models not trained")
def test_loads_models():
    assert len(SignalPredictor("ES").models) > 0

@pytest.mark.skipif(not (MODELS_DIR / "ES").exists(), reason="ES models not trained")
def test_signal_structure(sample_ohlcv):
    sig = SignalPredictor("ES").predict(sample_ohlcv)
    assert sig is not None
    for k in ("symbol", "direction", "confidence", "entry_price", "stop_loss", "take_profit"):
        assert k in sig

@pytest.mark.skipif(not (MODELS_DIR / "ES").exists(), reason="ES models not trained")
def test_signal_direction(sample_ohlcv):
    sig = SignalPredictor("ES").predict(sample_ohlcv)
    assert sig["direction"] in ("LONG", "SHORT", "NEUTRAL")

@pytest.mark.skipif(not (MODELS_DIR / "ES").exists(), reason="ES models not trained")
def test_signal_confidence(sample_ohlcv):
    sig = SignalPredictor("ES").predict(sample_ohlcv)
    assert 0 <= sig["confidence"] <= 100
