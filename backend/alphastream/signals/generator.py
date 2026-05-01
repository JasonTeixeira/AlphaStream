"""
Signal generation service — runs inference on latest data and stores signals.
"""

import uuid
from datetime import datetime, timezone

from loguru import logger

from alphastream.data.fetcher import SUPPORTED_SYMBOLS, fetch_latest
from alphastream.models.predictor import SignalPredictor


class SignalGenerator:
    """Generates trading signals for all supported symbols."""

    def __init__(self, symbols: list[str] | None = None):
        self.symbols = symbols or SUPPORTED_SYMBOLS
        self.predictors = {}

        for symbol in self.symbols:
            try:
                predictor = SignalPredictor(symbol)
                if predictor.models:
                    self.predictors[symbol] = predictor
                    logger.info(f"Loaded predictor for {symbol}")
                else:
                    logger.warning(f"No trained models for {symbol}, skipping")
            except Exception as e:
                logger.error(f"Failed to load predictor for {symbol}: {e}")

    def generate_signal(self, symbol: str) -> dict | None:
        """Generate a signal for a single symbol."""
        predictor = self.predictors.get(symbol)
        if not predictor:
            return None

        df = fetch_latest(symbol)
        if df.empty or len(df) < 100:
            logger.warning(f"Insufficient data for {symbol}: {len(df)} bars")
            return None

        signal = predictor.predict(df)
        if signal is None:
            return None

        # Add metadata
        signal["id"] = str(uuid.uuid4())
        signal["timestamp"] = datetime.now(timezone.utc).isoformat()
        signal["status"] = "active"

        return signal

    def generate_all(self) -> list[dict]:
        """Generate signals for all symbols with loaded models."""
        signals = []

        for symbol in self.predictors:
            try:
                signal = self.generate_signal(symbol)
                if signal:
                    signals.append(signal)
                    logger.info(
                        f"Signal: {signal['symbol']} {signal['direction']} "
                        f"conf={signal['confidence']}%"
                    )
            except Exception as e:
                logger.error(f"Failed to generate signal for {symbol}: {e}")

        return signals
