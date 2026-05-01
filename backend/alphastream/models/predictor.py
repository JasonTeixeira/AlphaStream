"""
Model inference — loads trained models and generates signals.
"""

import json
from pathlib import Path

import joblib
import numpy as np
from loguru import logger

from alphastream.features.engineering import create_features, get_feature_columns

MODELS_DIR = Path(__file__).parent.parent.parent / "models" / "trained"

MODEL_TYPES = ["xgboost", "lightgbm", "random_forest", "gradient_boosting"]


class SignalPredictor:
    """Loads trained models and generates trading signals."""

    def __init__(self, symbol: str):
        self.symbol = symbol
        self.models = {}
        self.scalers = {}
        self.metadata = {}
        self._load_models()

    def _load_models(self):
        model_dir = MODELS_DIR / self.symbol
        if not model_dir.exists():
            logger.warning(f"No models found for {self.symbol}")
            return

        for mt in MODEL_TYPES:
            model_path = model_dir / f"{mt}.joblib"
            scaler_path = model_dir / f"{mt}_scaler.joblib"
            meta_path = model_dir / f"{mt}_metadata.json"

            if model_path.exists() and scaler_path.exists():
                self.models[mt] = joblib.load(model_path)
                self.scalers[mt] = joblib.load(scaler_path)
                if meta_path.exists():
                    with open(meta_path) as f:
                        self.metadata[mt] = json.load(f)
                logger.info(f"Loaded {mt} for {self.symbol}")

    def predict(self, df) -> dict | None:
        """Generate ensemble signal from latest data.

        Args:
            df: DataFrame with OHLCV data (at least 200 rows for indicators)

        Returns:
            Signal dict or None if models aren't loaded
        """
        if not self.models:
            return None

        # Create features
        featured = create_features(df)
        feature_cols = get_feature_columns(featured)

        # Use the last row (most recent)
        latest = featured.iloc[-1:]
        X = latest[feature_cols].fillna(0).replace([np.inf, -np.inf], 0).values

        # Get predictions from each model
        predictions = {}
        confidences = {}

        for mt, model in self.models.items():
            scaler = self.scalers[mt]

            # Ensure feature alignment
            meta = self.metadata.get(mt, {})
            expected_features = meta.get("feature_names", feature_cols)

            # Align columns — use expected features, fill missing with 0
            X_aligned = np.zeros((1, len(expected_features)))
            for i, feat in enumerate(expected_features):
                if feat in feature_cols:
                    col_idx = feature_cols.index(feat)
                    if col_idx < X.shape[1]:
                        X_aligned[0, i] = X[0, col_idx]

            X_scaled = scaler.transform(X_aligned)
            pred = model.predict(X_scaled)[0]
            proba = model.predict_proba(X_scaled)[0]

            predictions[mt] = int(pred)
            confidences[mt] = float(max(proba))

        # Ensemble: weighted average by model AUC performance
        weights = {}
        for mt in predictions:
            meta = self.metadata.get(mt, {})
            avg_metrics = meta.get("avg_metrics", {})
            weights[mt] = avg_metrics.get("auc", 0.5)

        total_weight = sum(weights.values())
        if total_weight == 0:
            total_weight = 1

        # Weighted vote
        weighted_sum = sum(predictions[mt] * weights[mt] for mt in predictions)
        ensemble_score = weighted_sum / total_weight

        # Direction
        if ensemble_score > 0.6:
            direction = "LONG"
        elif ensemble_score < 0.4:
            direction = "SHORT"
        else:
            direction = "NEUTRAL"

        # Confidence
        avg_confidence = np.mean(list(confidences.values()))

        # Current price
        current_price = float(df.iloc[-1]["close"])
        atr_raw = featured.iloc[-1].get("atr_14")
        if atr_raw is None or np.isnan(atr_raw) or atr_raw <= 0:
            logger.warning(f"ATR fallback for {self.symbol} — insufficient data for ATR calculation")
            atr = current_price * 0.005  # Conservative 0.5% fallback
        else:
            atr = float(atr_raw)

        signal = {
            "symbol": self.symbol,
            "direction": direction,
            "confidence": round(avg_confidence * 100, 1),
            "entry_price": current_price,
            "stop_loss": round(current_price - (atr * 2 if direction == "LONG" else -atr * 2), 2),
            "take_profit": round(current_price + (atr * 3 if direction == "LONG" else -atr * 3), 2),
            "model_predictions": predictions,
            "model_confidences": confidences,
            "ensemble_score": round(ensemble_score, 4),
        }

        return signal
