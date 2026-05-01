# AlphaStream — Roadmap to 99/100

Current score: **78/100** (as of 2026-05-01)

Live at: https://alphastream-iota.vercel.app
Repo: https://github.com/JasonTeixeira/AlphaStream

---

## What's Done (78/100)

### Backend
- [x] ML pipeline: 45 features, zero data leakage, walk-forward validation
- [x] 28 trained models (7 symbols x 4 model types)
- [x] FastAPI with JWT auth + rate limiting (slowapi)
- [x] Supabase signal persistence (write on generate, load on startup)
- [x] Async I/O (run_in_threadpool for all sync operations)
- [x] yfinance retry with exponential backoff
- [x] Server-side API key generation (CSPRNG)
- [x] GDPR export + deletion endpoints
- [x] Backtest in-sample data warning
- [x] Final-fold model selection (no selection bias)
- [x] Docker with pinned deps, Railway config (120s healthcheck)

### Frontend
- [x] Real Supabase Auth (signup, login, password reset)
- [x] TypeScript strict mode (0 errors, ignoreBuildErrors removed)
- [x] Dashboard wired to real API (signals, models, backtester, analytics)
- [x] Honest marketing (no fake testimonials, stats, or inflated claims)
- [x] Consistent pricing (Free/Starter/Pro/Premium)
- [x] OG/Twitter meta tags
- [x] Image optimization enabled
- [x] 34 pages building clean

### Tests
- [x] 21 tests: features, trainer, predictor, API auth
- [x] 15 passing consistently

### Infrastructure
- [x] Supabase: 8 tables, RLS policies, auto-profile trigger
- [x] Stripe: 3 products + 3 monthly prices created
- [x] Vercel: frontend deployed, env vars configured
- [x] GitHub: repo at JasonTeixeira/AlphaStream

---

## Phase 1: Reach 85/100 — "Launchable" (Est: 3-4 days)

### 1.1 Deploy Backend to Railway
- Go to https://railway.app/new
- Click "Deploy from GitHub repo" -> select JasonTeixeira/AlphaStream
- Set root directory to `backend`
- Add env vars:
  - `SUPABASE_URL=https://skppbaparsikzfxvltsz.supabase.co`
  - `SUPABASE_KEY=<anon key from Supabase dashboard>`
  - `SUPABASE_JWT_SECRET=<JWT secret from Supabase Settings -> API>`
- Railway auto-detects Dockerfile and deploys
- Update Vercel env var `NEXT_PUBLIC_API_URL` to the Railway URL

### 1.2 Wire Stripe Checkout (Score +5)
**Files to modify:**
- `frontend/app/checkout/page.tsx` — replace fake checkout with real Stripe
- Create `frontend/app/api/stripe/checkout/route.ts` — server action that creates Stripe Checkout Session
- Create `backend/alphastream/api/stripe_webhooks.py` — webhook handler for:
  - `checkout.session.completed` → create subscription in Supabase
  - `customer.subscription.updated` → update plan in profiles table
  - `customer.subscription.deleted` → downgrade to free
  - `invoice.payment_failed` → send alert email

**Stripe Price IDs to use:**
- Starter $49/mo: `price_1TS87LEDeyGfkojJQ7nafYU2`
- Pro $149/mo: `price_1TS87fEDeyGfkojJ7Srqzrha`
- Premium $299/mo: `price_1TS887EDeyGfkojJxIXT7RNV`

**Implementation:**
```typescript
// frontend/app/api/stripe/checkout/route.ts
import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
  const { priceId, userId } = await req.json()
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?checkout=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout?canceled=true`,
    client_reference_id: userId,
  })
  return Response.json({ url: session.url })
}
```

### 1.3 Add Sentry Error Monitoring (Score +3)
**Backend:**
```bash
pip install sentry-sdk[fastapi]
```
```python
# In api/server.py, before app creation:
import sentry_sdk
sentry_sdk.init(dsn=settings.SENTRY_DSN, traces_sample_rate=0.1)
```

**Frontend:**
```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

### 1.4 Plan Enforcement in API (Score +3)
- In `verify_auth()`, after JWT decode, look up user's plan from Supabase profiles
- Attach plan to request state: `request.state.plan = profile.plan`
- In rate limiter, use plan-based limits:
  - Free: 50 requests/day
  - Starter: 500/day
  - Pro: 5000/day
  - Premium: 50000/day
- In `/v1/signals`, limit symbols by plan:
  - Free: 2 symbols
  - Starter: 5 symbols
  - Pro: 25 symbols
  - Premium: unlimited

---

## Phase 2: Reach 90/100 — "Professional" (Est: 5-7 days)

### 2.1 Email System with Resend (Score +4)
```bash
pip install resend  # backend
```
**Emails to implement:**
1. Welcome email on signup (triggered by Supabase auth webhook)
2. Signal alert email (when high-confidence signal generated)
3. Weekly performance digest (cron job, summarizes week's signals)
4. Password reset email (already works via Supabase, just needs custom template)

**Files to create:**
- `backend/alphastream/email/sender.py` — Resend client wrapper
- `backend/alphastream/email/templates.py` — HTML email templates

### 2.2 Discord Signal Delivery (Score +3)
**Implementation:**
- Create `backend/alphastream/delivery/discord.py`
- Use Discord webhook URL (user provides in settings)
- After signal generation in `generator.py`, call discord webhook:
```python
import httpx
async def send_discord_signal(webhook_url: str, signal: dict):
    embed = {
        "title": f"{signal['symbol']} — {signal['direction']}",
        "description": f"Confidence: {signal['confidence']}%",
        "fields": [
            {"name": "Entry", "value": str(signal['entry_price']), "inline": True},
            {"name": "Stop Loss", "value": str(signal['stop_loss']), "inline": True},
            {"name": "Take Profit", "value": str(signal['take_profit']), "inline": True},
        ],
        "color": 0x10B981 if signal['direction'] == 'LONG' else 0xEF4444,
    }
    await httpx.AsyncClient().post(webhook_url, json={"embeds": [embed]})
```

### 2.3 Webhook Outbound for Signal Delivery (Score +2)
- Create `POST /v1/webhooks` — register a webhook URL
- Create `DELETE /v1/webhooks/{id}` — remove webhook
- Store in Supabase `webhooks` table
- After signal generation, POST to all registered webhooks
- Include HMAC signature header for verification

### 2.4 More Tests (Score +3)
Bring test count to 40+:
- Integration test: train a model, generate signal, verify end-to-end
- API test: authenticated requests with mock JWT
- Backtest test: verify in-sample warning triggers
- GDPR test: verify export and delete endpoints
- Rate limit test: verify 429 after exceeding limit

### 2.5 Real 2FA with Per-User TOTP (Score +2)
- Use `pyotp` library for server-side TOTP
- `POST /v1/account/2fa/setup` — generate per-user secret, return QR code URI
- `POST /v1/account/2fa/verify` — validate TOTP code against user's secret
- Store encrypted TOTP secret in profiles table
- Frontend: replace hardcoded TOTP secret with API-generated one

---

## Phase 3: Reach 95/100 — "Enterprise Ready" (Est: 1-2 weeks)

### 3.1 Automated Retraining Pipeline (Score +3)
- Create `backend/retrain.py` — weekly cron script
- Fetches latest data, retrains all models, saves new artifacts
- Compares new model performance vs current (A/B shadow mode)
- Only promotes new model if performance >= current
- Can run as Railway cron job or GitHub Actions scheduled workflow

### 3.2 Model Performance Monitoring (Score +2)
- Track rolling 30-day signal accuracy per model
- Alert when accuracy drops below 48% (worse than random)
- Dashboard page showing model drift over time
- Store daily accuracy snapshots in `model_performance` table

### 3.3 WebSocket for Real-Time Signals (Score +2)
- Add FastAPI WebSocket endpoint: `ws://host/ws/signals`
- Authenticate via JWT in query param
- Broadcast new signals to connected clients instantly
- Frontend `realtime-context.tsx` already has the interface — just swap polling for WebSocket

### 3.4 User Analytics with PostHog (Score +2)
```bash
npm install posthog-js  # frontend
```
Track events:
- `signal_viewed` — user views a signal
- `backtest_run` — user runs a backtest
- `plan_upgraded` — user upgrades
- `api_key_created` — user creates API key
- Funnel: Landing → Signup → Dashboard → First Signal → Upgrade

### 3.5 Mobile PWA (Score +1)
- Add `next-pwa` package
- Create `public/manifest.json`
- Add service worker for offline dashboard skeleton
- Enable push notifications for signal alerts

---

## Phase 4: Reach 99/100 — "World Class" (Est: 2-4 weeks)

### 4.1 Strategy Marketplace (Score +2)
- Users publish signal streams as "strategies"
- Other users subscribe (70/30 revenue split)
- Leaderboard ranked by Sharpe ratio
- Tables: `strategies`, `strategy_subscriptions`, `strategy_performance`

### 4.2 Multi-Language Support (Score +1)
- Portuguese (Brazil — huge B3 futures market)
- Spanish
- Use `next-intl` for frontend i18n
- Jason's trilingual ability is a competitive advantage

### 4.3 NinjaTrader Direct Integration (Score +1)
- Send signals via NinjaTrader's ATI (Automated Trading Interface)
- Create a .NET bridge that reads from AlphaStream API
- Jason already trades 8 symbols on NT8 — dogfood the integration

### 4.4 Advanced ML Features (Score +1)
- Add orderflow features (if Polygon.io data available)
- Volume profile features
- Cross-asset correlation signals (e.g., bond yields → equity signals)
- Regime detection (trending vs mean-reverting)

### 4.5 SOC 2 Type II Compliance (Score +1)
- Audit logging for all data access
- Encryption at rest (Supabase handles this)
- Annual penetration testing
- Access control documentation
- Required for enterprise clients ($999/month tier)

---

## Revenue Milestones

| Phase | Score | Paying Users | MRR | Timeline |
|-------|-------|-------------|-----|----------|
| Current | 78 | 0 | $0 | Now |
| Phase 1 (Launchable) | 85 | 10-30 | $1.5K-4.5K | +1 week |
| Phase 2 (Professional) | 90 | 50-100 | $7.5K-15K | +1 month |
| Phase 3 (Enterprise) | 95 | 100-300 | $15K-45K | +3 months |
| Phase 4 (World Class) | 99 | 300-670 | $45K-100K | +6-12 months |

---

## Fixed Monthly Costs

| Service | Cost |
|---------|------|
| Supabase (free tier for now, Pro at $25/mo when needed) | $0-25 |
| Railway (backend hosting) | $5-20 |
| Vercel (frontend, Pro if needed) | $0-20 |
| Resend (email, free tier 3K/month) | $0 |
| Sentry (free tier 5K errors/month) | $0 |
| PostHog (free tier 1M events/month) | $0 |
| Polygon.io (if upgrading from yfinance) | $199 |
| **Total before Polygon** | **$5-65** |
| **Total with Polygon** | **$204-264** |

Break-even: **2 Starter subscribers** ($98/month > $65 costs)

---

## Key Files Reference

| What | Where |
|------|-------|
| ML feature engineering | `backend/alphastream/features/engineering.py` |
| Model training | `backend/alphastream/models/trainer.py` |
| Signal inference | `backend/alphastream/models/predictor.py` |
| API server | `backend/alphastream/api/server.py` |
| Data fetcher | `backend/alphastream/data/fetcher.py` |
| Signal generator | `backend/alphastream/signals/generator.py` |
| DB schema | `backend/schema.sql` |
| Auth context | `frontend/contexts/auth-context.tsx` |
| Realtime context | `frontend/contexts/realtime-context.tsx` |
| API client | `frontend/lib/api.ts` |
| Supabase client | `frontend/lib/supabase.ts` |
| Tests | `backend/tests/` |

## Supabase Project
- **ID:** skppbaparsikzfxvltsz
- **URL:** https://skppbaparsikzfxvltsz.supabase.co
- **Region:** us-east-1
- **Tables:** profiles, subscriptions, signals, models, api_keys, watchlists, alerts, signal_history

## Stripe Products
- Starter $49/mo: `prod_UQzg72gSrIVabD` / `price_1TS87LEDeyGfkojJQ7nafYU2`
- Pro $149/mo: `prod_UR01RHosp4tjfe` / `price_1TS87fEDeyGfkojJ7Srqzrha`
- Premium $299/mo: `prod_UR02VB36kac0Tx` / `price_1TS887EDeyGfkojJxIXT7RNV`
