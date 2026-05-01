# AlphaStream

ML-powered trading signals for futures markets. Real models, real data, no fake metrics.

## Architecture

```
AlphaStream/
├── backend/          # Python FastAPI + ML pipeline
│   ├── alphastream/
│   │   ├── api/      # FastAPI server
│   │   ├── data/     # Market data fetcher (yfinance)
│   │   ├── features/ # Feature engineering (45 features, no leakage)
│   │   ├── models/   # Training + inference
│   │   ├── signals/  # Signal generation
│   │   └── config/   # Settings
│   ├── models/       # Trained model artifacts (.joblib)
│   ├── train.py      # Training CLI
│   ├── schema.sql    # Supabase database schema
│   └── Dockerfile    # Railway deployment
└── frontend/         # Next.js 16 + React 19
    ├── app/          # 33 pages (landing, dashboard, auth, settings)
    ├── components/   # 122 components
    ├── contexts/     # Auth + realtime (connected to real API)
    └── lib/          # API client, types, utilities
```

## What's Real

- **7 symbols**: ES, NQ, CL, GC, BTC, ETH, RTY
- **4 model types per symbol**: XGBoost, LightGBM, Random Forest, Gradient Boosting
- **28 trained models** with walk-forward validation (5 folds, purge gap)
- **45 technical features** — all backward-looking, zero data leakage
- **11,400+ hourly bars per symbol** (2 years of data)
- **FastAPI server** with real endpoints: signals, models, prices, backtest

## Quick Start

### Backend

```bash
cd backend
python -m venv .venv
source .venv/Scripts/activate  # Windows
pip install pandas numpy scikit-learn xgboost lightgbm joblib yfinance fastapi uvicorn pydantic python-dotenv loguru httpx

# Train models
PYTHONPATH=. python train.py

# Start API server
PYTHONPATH=. uvicorn alphastream.api.server:app --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Visit http://localhost:3000 (frontend) and http://localhost:8000/docs (API docs)

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /health | Health check + model status |
| GET | /v1/signals | Latest signals (all symbols) |
| GET | /v1/signals/{symbol} | Signal for specific symbol |
| GET | /v1/models | Model performance metrics |
| GET | /v1/prices/{symbol} | Historical price data |
| POST | /v1/backtest | Run backtest on historical data |

## Deployment

- **Frontend**: Vercel (auto-deploy from GitHub)
- **Backend**: Railway (Docker)
- **Database**: Supabase (run schema.sql)

## Honest Performance

Models achieve ~50% directional accuracy on hourly futures data with basic technical features. This is realistic — futures markets are highly efficient at this timeframe. Edge comes from:
- Ensemble consensus (4 models voting)
- Confidence-weighted signals
- Risk management (ATR-based stops)

## Tech Stack

**Backend**: Python 3.12, FastAPI, scikit-learn, XGBoost, LightGBM, yfinance
**Frontend**: Next.js 16, React 19, TypeScript, Tailwind 4, Recharts, Framer Motion, Radix UI
**Infrastructure**: Vercel, Railway, Supabase, Stripe
