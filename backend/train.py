"""
Train models for all supported symbols.

Usage:
    python train.py                    # Train all symbols
    python train.py --symbol ES NQ     # Train specific symbols
    python train.py --period 1y        # Use 1 year of data
"""

import argparse

import numpy as np
from loguru import logger

from alphastream.data.fetcher import SUPPORTED_SYMBOLS, fetch_historical
from alphastream.features.engineering import (
    create_features,
    create_targets,
    get_feature_columns,
)
from alphastream.models.trainer import train_pipeline


def train_symbol(symbol: str, period: str = "2y", interval: str = "1h", horizon: int = 5):
    """Train all models for a single symbol."""
    logger.info(f"{'='*60}")
    logger.info(f"Training models for {symbol}")
    logger.info(f"{'='*60}")

    # Fetch data
    df = fetch_historical(symbol, period=period, interval=interval)
    if df.empty:
        logger.error(f"No data for {symbol}, skipping")
        return None

    logger.info(f"Fetched {len(df)} bars for {symbol}")

    # Create features (backward-looking only)
    df = create_features(df)

    # Create targets (uses future data — only for labels)
    df = create_targets(df, horizon=horizon)

    # Drop rows with NaN (from rolling windows and future shift)
    target_col = f"target_{horizon}"
    df = df.dropna(subset=[target_col])

    # Get feature columns
    feature_cols = get_feature_columns(df)
    X = df[feature_cols].fillna(0).replace([np.inf, -np.inf], 0).values
    y = df[target_col].values

    logger.info(f"Training data: {X.shape[0]} samples, {X.shape[1]} features")
    logger.info(f"Target distribution: {np.bincount(y.astype(int))}")

    # Train
    results = train_pipeline(
        X=X,
        y=y,
        feature_names=feature_cols,
        symbol=symbol,
        horizon=horizon,
    )

    # Summary
    for model_type, result in results.items():
        metrics = result["metadata"]["avg_metrics"]
        logger.info(
            f"  {model_type}: acc={metrics['accuracy']:.4f} "
            f"auc={metrics['auc']:.4f} f1={metrics['f1']:.4f}"
        )

    return results


def main():
    parser = argparse.ArgumentParser(description="Train AlphaStream models")
    parser.add_argument("--symbol", nargs="+", default=None, help="Symbols to train")
    parser.add_argument("--period", default="2y", help="Data period (1y, 2y, 5y)")
    parser.add_argument("--interval", default="1h", help="Bar interval (1h, 1d)")
    parser.add_argument("--horizon", type=int, default=5, help="Prediction horizon in bars")
    args = parser.parse_args()

    symbols = args.symbol or SUPPORTED_SYMBOLS

    logger.info(f"Training AlphaStream models")
    logger.info(f"Symbols: {symbols}")
    logger.info(f"Period: {args.period} | Interval: {args.interval} | Horizon: {args.horizon}")

    all_results = {}
    for symbol in symbols:
        try:
            result = train_symbol(symbol, args.period, args.interval, args.horizon)
            if result:
                all_results[symbol] = result
        except Exception as e:
            logger.error(f"Failed to train {symbol}: {e}")

    logger.info(f"\n{'='*60}")
    logger.info(f"TRAINING COMPLETE")
    logger.info(f"Trained {len(all_results)} symbols: {list(all_results.keys())}")
    logger.info(f"Models saved to models/trained/")
    logger.info(f"{'='*60}")


if __name__ == "__main__":
    main()
