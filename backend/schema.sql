-- AlphaStream Supabase Schema
-- Run this in your Supabase SQL Editor

-- Profiles (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'starter', 'pro', 'premium')),
  stripe_customer_id TEXT UNIQUE,
  api_calls_today INTEGER DEFAULT 0,
  api_calls_reset_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', NEW.email));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT UNIQUE,
  plan TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Signals (the product)
CREATE TABLE IF NOT EXISTS signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol TEXT NOT NULL,
  direction TEXT NOT NULL CHECK (direction IN ('LONG', 'SHORT', 'NEUTRAL')),
  confidence REAL NOT NULL,
  entry_price REAL NOT NULL,
  stop_loss REAL,
  take_profit REAL,
  model_predictions JSONB,
  ensemble_score REAL,
  status TEXT DEFAULT 'active',
  closed_at TIMESTAMPTZ,
  actual_return REAL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_signals_symbol ON signals(symbol);
CREATE INDEX IF NOT EXISTS idx_signals_created ON signals(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_signals_status ON signals(status);

-- Models registry
CREATE TABLE IF NOT EXISTS models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol TEXT NOT NULL,
  model_type TEXT NOT NULL,
  version INTEGER DEFAULT 1,
  accuracy REAL,
  auc REAL,
  f1 REAL,
  n_samples INTEGER,
  artifact_url TEXT,
  is_active BOOLEAN DEFAULT true,
  trained_at TIMESTAMPTZ DEFAULT now(),
  metadata JSONB
);

CREATE INDEX IF NOT EXISTS idx_models_symbol ON models(symbol);

-- API keys
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  key_hash TEXT NOT NULL,
  key_prefix TEXT NOT NULL,
  name TEXT NOT NULL,
  permissions TEXT[] DEFAULT ARRAY['read'],
  rate_limit INTEGER DEFAULT 1000,
  last_used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_api_keys_user ON api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_hash ON api_keys(key_hash);

-- User watchlists
CREATE TABLE IF NOT EXISTS watchlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  symbols TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMPTZ DEFAULT now()
);

-- User alerts
CREATE TABLE IF NOT EXISTS alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  symbol TEXT NOT NULL,
  alert_type TEXT NOT NULL,
  config JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Signal history (track record)
CREATE TABLE IF NOT EXISTS signal_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  signal_id UUID REFERENCES signals(id),
  event_type TEXT NOT NULL,
  data JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_signal_history_signal ON signal_history(signal_id);

-- RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE watchlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

-- Users can read/update their own profile
CREATE POLICY profiles_select ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY profiles_update ON profiles FOR UPDATE USING (auth.uid() = id);

-- Users can read their own subscriptions
CREATE POLICY subs_select ON subscriptions FOR SELECT USING (auth.uid() = user_id);

-- Users can manage their own API keys
CREATE POLICY keys_select ON api_keys FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY keys_insert ON api_keys FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY keys_delete ON api_keys FOR DELETE USING (auth.uid() = user_id);

-- Users can manage their own watchlists
CREATE POLICY watch_select ON watchlists FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY watch_insert ON watchlists FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY watch_update ON watchlists FOR UPDATE USING (auth.uid() = user_id);

-- Users can manage their own alerts
CREATE POLICY alerts_select ON alerts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY alerts_insert ON alerts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY alerts_update ON alerts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY alerts_delete ON alerts FOR DELETE USING (auth.uid() = user_id);

-- Signals are public read (the product)
ALTER TABLE signals ENABLE ROW LEVEL SECURITY;
CREATE POLICY signals_select ON signals FOR SELECT TO authenticated USING (true);

-- Models are public read
ALTER TABLE models ENABLE ROW LEVEL SECURITY;
CREATE POLICY models_select ON models FOR SELECT TO authenticated USING (true);

-- Signal history is public read
ALTER TABLE signal_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY history_select ON signal_history FOR SELECT TO authenticated USING (true);
