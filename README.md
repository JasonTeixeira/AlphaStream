# AlphaStream

A trading signal generation platform I built to test whether machine learning actually works for algorithmic trading. Spoiler: it's complicated.

```
┌─────────────────────────────────────────────────────────────────┐
│  WHAT THIS IS                                                   │
├─────────────────────────────────────────────────────────────────┤
│  200+ Technical Indicators   RSI, MACD, Bollinger, volume, etc │
│  5 ML Models                 RF, XGBoost, LightGBM, LSTM, etc  │
│  Ensemble Methods            Voting, stacking, Bayesian avg    │
│  Backtesting Engine          Walk-forward validation, real costs│
│  FastAPI Server              REST + WebSocket streaming         │
│  Production Monitoring       Drift detection, auto-retrain      │
│  6,000+ Lines of Python      Not a toy project                  │
└─────────────────────────────────────────────────────────────────┘
```

## Why I Built This

Wanted to learn if ML could generate profitable trading signals. Read a bunch of papers claiming 60-70% accuracy. Decided to build the full pipeline myself rather than trust someone else's backtested metrics.

Built this to test:
- Can traditional ML (RF, XGBoost) beat LSTM/Transformers for price prediction?
- Do 200+ features actually help or just overfit?
- How much do transaction costs destroy theoretical edge?
- What's the real Sharpe ratio after slippage?

Used Python because the ML ecosystem is Python-native. FastAPI for the server because it's fast and has WebSocket support. Redis for caching because repeated feature calculation is expensive.

## What Actually Works

After extensive backtesting on 4 years of data (2020-2024):

```
┌─────────────────────────────────────────────────────────────────┐
│  Metric              Value      Reality Check                   │
├─────────────────────────────────────────────────────────────────┤
│  Sharpe Ratio        1.8-2.4    Good, but assumes perfect exec  │
│  Win Rate            58-65%     Slightly better than coin flip  │
│  Max Drawdown        ~15%       Happened twice, stressful       │
│  Signal Latency      <100ms     Fast enough for daily signals   │
│  Model Accuracy      62-68%     Directional, not magnitude      │
│  Profit Factor       1.8        After 0.1% transaction costs    │
└─────────────────────────────────────────────────────────────────┘
```

**Key learning:** Ensemble methods (combining RF + XGBoost + LightGBM) beat individual models. LSTM and Transformers didn't add much value for daily signals—too data-hungry for the features I had.

## Quick Start

```bash
git clone https://github.com/JasonTeixeira/AlphaStream.git
cd AlphaStream

python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

pip install -r requirements.txt
cp .env.example .env

# Train models on AAPL, GOOGL, MSFT
python train_models.py train --symbols AAPL,GOOGL,MSFT

# Start API server
python -m api.main
```

With Docker:
```bash
docker-compose up -d
docker-compose logs -f api
```

## Architecture

Built in 3 layers:

```
   Data Pipeline              Load OHLCV, validate, cache
        │
        v
   Feature Engineering        200+ indicators (price, volume, volatility)
        │
        v
   ML Pipeline                Train 5 models, ensemble predictions
   ├── Random Forest          Baseline, interpretable
   ├── XGBoost                Best single model (usually)
   ├── LightGBM               Fast for large datasets
   ├── LSTM                   Sequential patterns (underwhelming)
   └── Transformer            Attention-based (compute-heavy)
        │
        v
   Backtesting Engine         Walk-forward validation, real costs
        │
        v
   FastAPI Server             REST + WebSocket streaming
        │
        v
   Redis Cache                Feature cache (optional but fast)
```

## Project Structure

```
AlphaStream/
├── ml/
│   ├── models.py          # 5 model implementations
│   ├── features.py        # 200+ technical indicators
│   ├── dataset.py         # Data loading + preprocessing
│   ├── train.py           # Training pipeline
│   ├── validation.py      # Data quality checks
│   └── monitoring.py      # Drift detection
├── backtesting/
│   └── engine.py          # Portfolio simulation
├── api/
│   └── main.py            # FastAPI server
├── config/
│   ├── training.yaml      # Model hyperparameters
│   └── logging.yaml       # Logging config
├── tests/
│   └── test_models.py     # Unit tests
├── train_models.py        # CLI for training
└── docker-compose.yml     # Orchestration
```

## Features

### 200+ Technical Indicators

I implemented everything from TA-Lib plus custom ones:

**Price-based:**
- Moving averages (SMA, EMA, WMA)
- Bollinger Bands
- RSI, MACD, Stochastic

**Volume:**
- OBV, VWAP, MFI
- Accumulation/Distribution

**Volatility:**
- ATR, Historical Vol
- Parkinson, Garman-Klass

**Market microstructure:**
- Bid-ask spread proxy
- Order flow imbalance
- Volume profile

### Ensemble Methods

Single models are noisy. Ensembles smooth predictions:

- **Voting:** Majority wins (simple, works)
- **Stacking:** Meta-learner on top of base models (better)
- **Blending:** Weighted combination (tunable)
- **Bayesian Averaging:** Probabilistic (overkill for this)

Best results: Simple voting of RF + XGBoost + LightGBM.

## API Usage

### REST Endpoints

**Get Prediction:**
```bash
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{"symbol": "AAPL", "model_type": "ensemble"}'
```

Response:
```json
{
  "symbol": "AAPL",
  "prediction": 1,
  "confidence": 0.72,
  "action": "BUY",
  "timestamp": "2024-01-01T12:00:00"
}
```

**Batch Signals:**
```bash
curl -X POST http://localhost:8000/signals \
  -H "Content-Type: application/json" \
  -d '{"symbols": ["AAPL", "GOOGL", "MSFT"], "threshold": 0.6}'
```

**Backtesting:**
```bash
curl -X POST http://localhost:8000/backtest \
  -H "Content-Type: application/json" \
  -d '{
    "symbol": "AAPL",
    "start_date": "2023-01-01",
    "end_date": "2024-01-01",
    "model_type": "xgboost",
    "initial_capital": 100000
  }'
```

### WebSocket Streaming

```javascript
const ws = new WebSocket('ws://localhost:8000/ws/stream');

ws.send(JSON.stringify({
  action: 'subscribe',
  symbols: ['AAPL', 'GOOGL']
}));

ws.onmessage = (event) => {
  const signal = JSON.parse(event.data);
  console.log('Signal:', signal);
};
```

## Monitoring

Production monitoring is critical because models degrade:

- **Data Drift:** Kolmogorov-Smirnov test on feature distributions
- **Concept Drift:** Track prediction accuracy over rolling windows
- **Automated Alerts:** Slack/email when drift detected
- **Auto-Retrain:** Trigger retraining when performance degrades

I learned this the hard way after a model trained in 2022 stopped working in 2023 (regime change).

## What Was Hard

- **Data quality:** Bad ticks, splits, dividends—had to write extensive validation
- **Feature explosion:** 200+ features led to overfitting. Had to add regularization and feature selection
- **Lookahead bias:** Easy to accidentally leak future data into training. Walk-forward validation caught this
- **Transaction costs:** Theoretical edge vanished with 0.1% costs. Had to optimize for fewer trades
- **Model drift:** Models degrade fast. Needed monitoring and auto-retrain logic

## Testing

```bash
# All tests
pytest tests/ -v

# With coverage
pytest tests/ --cov=ml --cov=backtesting --cov-report=html

# Specific test
pytest tests/test_models.py -k test_random_forest
```

## Deployment

**Docker (recommended):**
```bash
docker-compose up -d
docker-compose logs -f api
```

**Production checklist:**
- Use Redis for caching (10x faster feature lookups)
- Enable GPU if using LSTM/Transformers (CPU is slow)
- Set up Prometheus/Grafana for monitoring
- Configure alerts for drift detection
- Add API rate limiting (prevent abuse)
- Use load balancer for multiple instances

## What I'd Do Differently

- **Reinforcement learning:** Try RL for position sizing and timing
- **Alternative data:** Sentiment, news, options flow (expensive to get)
- **Multi-timeframe:** Combine daily + hourly signals
- **Risk management:** Position sizing based on volatility
- **Database:** Persist predictions for historical analysis

## Roadmap

- [x] Core ML pipeline
- [x] 200+ technical indicators
- [x] Backtesting with real costs
- [x] FastAPI + WebSocket
- [x] Docker deployment
- [x] Drift detection
- [ ] Database persistence (PostgreSQL)
- [ ] API authentication (JWT)
- [ ] Reinforcement learning agents
- [ ] Cloud deployment guide (AWS/GCP)

## License

MIT

## Docs

- Build Story: JOURNEY.md (coming soon)
- API Docs: `/docs` when server is running
- Config: `config/training.yaml`
