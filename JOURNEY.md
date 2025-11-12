# AlphaStream: Build Journey

## Why I Built This

Got tired of reading research papers claiming 60-70% accuracy on stock price prediction with ML models. Everyone had perfect backtests, nobody shared their code. Decided to build the full pipeline myself to see if ML actually works for trading or if it's all overfitting.

Goal: Can I build a system that generates profitable trading signals using machine learning?

---

## Timeline

### Month 1: Data & Features

**Goal:** Get clean data and build feature engineering pipeline.

- Set up data pipeline with yfinance and Alpha Vantage
- Implemented 200+ technical indicators (price, volume, volatility, microstructure)
- Built validation layer to catch bad ticks, splits, dividends
- Added caching layer (Redis) because feature calculation is slow

**Problem I Hit:** Data quality was terrible. Bad ticks, missing data, incorrect split adjustments.

**Fix:** Wrote extensive validation logic. Cross-referenced multiple data sources. Added sanity checks (if daily return > 50%, flag it). Still not perfect but good enough.

### Month 2: Model Building

**Goal:** Implement multiple ML models and compare performance.

- Built 5 model types: Random Forest, XGBoost, LightGBM, LSTM, Transformer
- Implemented ensemble methods (voting, stacking, blending, Bayesian averaging)
- Added walk-forward validation (proper time-series cross-validation)
- Trained on 4 years of data (2020-2024)

**Problem I Hit:** LSTM and Transformer models were underwhelming. High compute cost, didn't beat simple XGBoost.

**Fix:** Realized deep learning needs way more data than I had. Focused on ensemble of traditional ML (RF + XGBoost + LightGBM). Simple voting worked best.

### Month 3: Backtesting

**Goal:** Build realistic backtesting engine with transaction costs.

- Implemented portfolio simulation with proper order execution
- Added transaction costs (0.1% per trade)
- Built walk-forward backtesting (train on past, test on future, repeat)
- Generated comprehensive metrics (Sharpe, max drawdown, win rate, profit factor)

**Problem I Hit:** Theoretical edge vanished with transaction costs. Model was trading too frequently.

**Fix:** Added confidence threshold filtering. Only trade when confidence > 0.65. Reduced trade frequency by 40%, improved Sharpe from 1.2 to 1.9.

### Month 4: Production & Monitoring

**Goal:** Deploy as API, add monitoring for model drift.

- Built FastAPI server with REST + WebSocket endpoints
- Added drift detection (KS test for data drift, rolling accuracy for concept drift)
- Implemented auto-retrain triggers when drift detected
- Dockerized everything for easy deployment

**Problem I Hit:** Model trained in 2022 stopped working in 2023. Regime change killed performance.

**Fix:** Added monitoring to catch drift early. Set up auto-retrain when rolling 30-day accuracy drops below 55%. Models now adapt to regime changes.

---

## Key Decisions

### Python + FastAPI

Could've used Java/C++ for speed, but Python has the ML ecosystem. FastAPI because it's fast and has built-in WebSocket support. No regrets here.

### 200+ Features

Started with 50 indicators. Accuracy was 52% (barely better than random). Added more features (volume, volatility, microstructure). Got to 62% accuracy but overfitting became an issue. Had to add regularization and feature selection.

### Ensemble Over Single Models

Single models are noisy. Tried:
- Random Forest alone: 58% accuracy
- XGBoost alone: 61% accuracy
- LSTM alone: 56% accuracy (compute-heavy, not worth it)
- Ensemble (RF + XGB + LGB voting): 64% accuracy

Simple voting worked better than fancy stacking. Sometimes simple wins.

### Walk-Forward Validation

Classic mistake: train on 2020-2022, test on 2023-2024. Results looked great (70% accuracy). Then deployed and it failed immediately. Why? Lookahead bias.

Fixed with walk-forward: train on month 1-12, test on month 13, retrain, repeat. Real accuracy: 62%. Painful but honest.

### Transaction Costs

Papers ignore transaction costs. I added 0.1% per trade (realistic for retail). Theoretical edge of 2.5 Sharpe dropped to 1.9 Sharpe. Still good, but way less impressive.

Had to optimize for fewer trades with higher confidence. Quality over quantity.

---

## What Was Hard

### Data Quality

Bad ticks everywhere. Yahoo Finance had incorrect splits. Alpha Vantage had missing data. Had to:
- Cross-reference multiple sources
- Write extensive validation (if daily return > 50%, investigate)
- Handle corporate actions (splits, dividends) manually
- Deal with delisted stocks (survivorship bias)

Still not perfect but production-grade.

### Feature Engineering

200+ features is too many. Led to overfitting despite regularization. Tried:
- PCA (lost interpretability)
- Feature importance from RF (helped but not enough)
- Recursive feature elimination (slow but worked)

Ended up with 80 core features that actually matter.

### Lookahead Bias

So easy to accidentally leak future data into training:
- Using close price at time T to predict at time T (obvious leak)
- Feature normalization using full dataset (subtle leak)
- Target definition using forward-looking windows (common mistake)

Walk-forward validation caught all of this. If you don't have walk-forward, your backtest is lying.

### Model Drift

Models degrade fast in finance. Market regimes change. What worked in 2022 (low vol, Fed easing) failed in 2023 (high vol, Fed tightening).

Solution: Monitor everything. Track feature distributions (KS test). Track prediction accuracy (rolling windows). Trigger retrain when drift detected.

### Transaction Costs

Ignored in research, critical in practice. 0.1% per trade doesn't sound like much but:
- 100 trades/year = 10% in costs
- Theoretical Sharpe 2.5 → Real Sharpe 1.9

Had to optimize for fewer, higher-conviction trades. Added confidence thresholds. Reduced trading frequency.

---

## What Actually Works

After 12 months of building and testing:

**Models:**
- Ensemble of RF + XGBoost + LightGBM (simple voting)
- Don't bother with LSTM/Transformers unless you have 10+ years of data
- Feature importance from RF tells you what matters

**Features:**
- Price: RSI, MACD, Bollinger (classics work)
- Volume: VWAP, OBV (volume matters)
- Volatility: ATR, historical vol (regime indicator)
- 80 features is enough, 200 is too many

**Backtesting:**
- Walk-forward validation (no other way is honest)
- Include transaction costs (0.1% minimum)
- Test across multiple regimes (2020-2024 had 3 different regimes)

**Production:**
- Monitor everything (data drift, concept drift)
- Retrain when accuracy drops (don't wait for disaster)
- Cache features (10x speedup with Redis)

**Reality Check:**
- Sharpe 1.8-2.4 is good (better than buy-and-hold)
- Win rate 58-65% (barely better than coin flip)
- Max drawdown 15% (happened twice, stressful)
- Not a get-rich-quick scheme

---

## What I'd Do Differently

- **Start with fewer features:** 200 was overkill. 50-80 is the sweet spot.
- **Skip LSTM/Transformers:** Not worth the compute for daily signals. Maybe for intraday.
- **More alternative data:** Sentiment, news, options flow (but expensive).
- **Reinforcement learning:** Try RL for position sizing and timing, not just direction.
- **Multi-timeframe:** Combine daily + hourly signals for better entries/exits.

---

## Stats

- Total Code: 6,000+ lines of Python
- Technical Indicators: 200+ implemented, 80 used in production
- Models Trained: 50+ experiments, 5 model types in production
- Backtest Period: 4 years (2020-2024)
- Symbols Tested: 50+ (S&P 500 components)
- Compute Time: ~2 hours to train full ensemble
- Deployment: Docker + FastAPI + Redis

---

## Tools I Used

- Python 3.11 (type hints everywhere)
- scikit-learn (RF, traditional ML)
- XGBoost, LightGBM (gradient boosting)
- PyTorch (LSTM, Transformers)
- FastAPI (API server)
- Redis (feature caching)
- yfinance, Alpha Vantage (market data)
- TA-Lib (technical indicators)
- Docker (deployment)
- Weights & Biases (experiment tracking)

---

## What I Learned

- ML works for trading, but edge is small (1-2% annual alpha)
- Transaction costs matter way more than papers suggest
- Model drift is the real enemy (retrain often)
- Simple ensembles beat fancy deep learning for daily signals
- Data quality is 80% of the work
- Walk-forward validation is the only honest backtest
- 200 features is too many, 80 is enough
- LSTM/Transformers are overhyped for daily price prediction

---

## Does It Work?

Depends on your definition of "work":
- Can you beat buy-and-hold? Yes (Sharpe 1.9 vs 0.8)
- Can you quit your job? No (returns are volatile, drawdowns are real)
- Is it better than nothing? Yes (but not by much)
- Would I trade this with real money? Maybe with 5-10% of portfolio

---

Coffee consumed: Way too much.

Times I thought "this is impossible": 5.

Times I almost gave up: 2.

Times models failed spectacularly: 3 (regime changes are brutal).

Worth it? Yes. Learned more building this than reading 100 papers.
