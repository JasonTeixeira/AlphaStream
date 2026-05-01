"""
Model training pipeline with proper walk-forward validation.

No data leakage:
- Scaler fit ONLY on training data
- Walk-forward expanding window (train on [0..t], validate on [t+gap..t+gap+window])
- Purge gap between train/val to avoid autocorrelation
"""

import json
from datetime import datetime
from pathlib import Path

import joblib
import lightgbm as lgb
import numpy as np
import xgboost as xgb
from loguru import logger
from sklearn.ensemble import GradientBoostingClassifier, RandomForestClassifier
from sklearn.metrics import accuracy_score, f1_score, precision_score, recall_score, roc_auc_score
from sklearn.preprocessing import RobustScaler


MODELS_DIR = Path(__file__).parent.parent.parent / "models" / "trained"


def walk_forward_split(
    n_samples: int,
    n_splits: int = 5,
    train_min_pct: float = 0.3,
    val_size_pct: float = 0.1,
    purge_gap: int = 10,
) -> list[tuple[np.ndarray, np.ndarray]]:
    """Walk-forward expanding window splits with purge gap.

    Each split:
    - Train: [0 .. split_point]
    - Gap: [split_point .. split_point + purge_gap]  (discarded)
    - Val: [split_point + purge_gap .. split_point + purge_gap + val_size]
    """
    splits = []
    val_size = int(n_samples * val_size_pct)
    min_train = int(n_samples * train_min_pct)

    # Space split points evenly across the usable range
    max_split = n_samples - val_size - purge_gap
    split_points = np.linspace(min_train, max_split, n_splits, dtype=int)

    for sp in split_points:
        train_idx = np.arange(0, sp)
        val_start = sp + purge_gap
        val_end = min(val_start + val_size, n_samples)
        if val_end <= val_start:
            continue
        val_idx = np.arange(val_start, val_end)
        splits.append((train_idx, val_idx))

    return splits


def train_model(
    model_type: str,
    X_train: np.ndarray,
    y_train: np.ndarray,
    X_val: np.ndarray,
    y_val: np.ndarray,
):
    """Train a single model. Returns (model, metrics)."""

    if model_type == "xgboost":
        model = xgb.XGBClassifier(
            n_estimators=200,
            max_depth=6,
            learning_rate=0.05,
            subsample=0.8,
            colsample_bytree=0.8,
            reg_alpha=0.1,
            reg_lambda=1.0,
            random_state=42,
            eval_metric="logloss",
        )
        model.fit(X_train, y_train, eval_set=[(X_val, y_val)], verbose=False)

    elif model_type == "lightgbm":
        model = lgb.LGBMClassifier(
            n_estimators=200,
            max_depth=6,
            learning_rate=0.05,
            subsample=0.8,
            colsample_bytree=0.8,
            reg_alpha=0.1,
            reg_lambda=1.0,
            random_state=42,
            verbose=-1,
        )
        model.fit(X_train, y_train, eval_set=[(X_val, y_val)])

    elif model_type == "random_forest":
        model = RandomForestClassifier(
            n_estimators=200,
            max_depth=15,
            min_samples_split=30,
            min_samples_leaf=10,
            max_features="sqrt",
            random_state=42,
            n_jobs=-1,
        )
        model.fit(X_train, y_train)

    elif model_type == "gradient_boosting":
        model = GradientBoostingClassifier(
            n_estimators=200,
            max_depth=5,
            learning_rate=0.05,
            subsample=0.8,
            random_state=42,
        )
        model.fit(X_train, y_train)

    else:
        raise ValueError(f"Unknown model type: {model_type}")

    # Evaluate
    val_pred = model.predict(X_val)
    val_proba = model.predict_proba(X_val)[:, 1]

    metrics = {
        "accuracy": float(accuracy_score(y_val, val_pred)),
        "precision": float(precision_score(y_val, val_pred, zero_division=0)),
        "recall": float(recall_score(y_val, val_pred, zero_division=0)),
        "f1": float(f1_score(y_val, val_pred, zero_division=0)),
        "auc": float(
            roc_auc_score(y_val, val_proba) if len(np.unique(y_val)) > 1 else 0.5
        ),
    }

    return model, metrics


def train_pipeline(
    X: np.ndarray,
    y: np.ndarray,
    feature_names: list[str],
    symbol: str,
    horizon: int = 5,
    model_types: list[str] | None = None,
) -> dict:
    """Full training pipeline with walk-forward validation.

    Returns dict of {model_type: {model, scaler, metrics, metadata}}.
    """
    if model_types is None:
        model_types = ["xgboost", "lightgbm", "random_forest", "gradient_boosting"]

    output_dir = MODELS_DIR / symbol
    output_dir.mkdir(parents=True, exist_ok=True)

    # Walk-forward splits
    splits = walk_forward_split(len(X), n_splits=5, purge_gap=10)
    logger.info(f"Training {symbol} | {len(X)} samples | {len(splits)} walk-forward splits")

    results = {}

    for model_type in model_types:
        logger.info(f"Training {model_type} for {symbol}...")

        # Aggregate metrics across all walk-forward folds
        fold_metrics = []

        best_model = None
        best_scaler = None
        best_auc = -1

        for fold_idx, (train_idx, val_idx) in enumerate(splits):
            X_train_fold, X_val_fold = X[train_idx], X[val_idx]
            y_train_fold, y_val_fold = y[train_idx], y[val_idx]

            # Fit scaler ONLY on training fold
            scaler = RobustScaler()
            X_train_scaled = scaler.fit_transform(X_train_fold)
            X_val_scaled = scaler.transform(X_val_fold)

            model, metrics = train_model(model_type, X_train_scaled, y_train_fold, X_val_scaled, y_val_fold)
            fold_metrics.append(metrics)

            if metrics["auc"] > best_auc:
                best_auc = metrics["auc"]
                best_model = model
                best_scaler = scaler

            logger.info(
                f"  Fold {fold_idx + 1}: acc={metrics['accuracy']:.4f} "
                f"auc={metrics['auc']:.4f} f1={metrics['f1']:.4f}"
            )

        # Average metrics across folds
        avg_metrics = {}
        for key in fold_metrics[0]:
            values = [m[key] for m in fold_metrics]
            avg_metrics[key] = float(np.mean(values))
            avg_metrics[f"{key}_std"] = float(np.std(values))

        logger.info(
            f"{model_type} avg: acc={avg_metrics['accuracy']:.4f} "
            f"auc={avg_metrics['auc']:.4f} f1={avg_metrics['f1']:.4f}"
        )

        # Save best model
        model_path = output_dir / f"{model_type}.joblib"
        scaler_path = output_dir / f"{model_type}_scaler.joblib"
        joblib.dump(best_model, model_path)
        joblib.dump(best_scaler, scaler_path)

        metadata = {
            "model_type": model_type,
            "symbol": symbol,
            "horizon": horizon,
            "feature_names": feature_names,
            "training_date": datetime.utcnow().isoformat(),
            "n_samples": len(X),
            "n_features": X.shape[1],
            "n_folds": len(splits),
            "avg_metrics": avg_metrics,
            "version": 1,
        }

        meta_path = output_dir / f"{model_type}_metadata.json"
        with open(meta_path, "w") as f:
            json.dump(metadata, f, indent=2)

        results[model_type] = {
            "model_path": str(model_path),
            "scaler_path": str(scaler_path),
            "metadata": metadata,
        }

    return results
