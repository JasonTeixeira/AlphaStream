/**
 * AlphaStream API client — connects to the real FastAPI backend.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export interface Signal {
  id: string
  symbol: string
  direction: "LONG" | "SHORT" | "NEUTRAL"
  confidence: number
  entry_price: number
  stop_loss: number
  take_profit: number
  timestamp: string
  model_predictions: Record<string, number>
  ensemble_score: number
  status: string
}

export interface ModelInfo {
  symbol: string
  model_type: string
  accuracy: number
  auc: number
  f1: number
  precision: number
  recall: number
  training_date: string
  n_samples: number
  version: number
}

export interface PriceBar {
  timestamp: string
  open: number
  high: number
  low: number
  close: number
  volume: number
  symbol: string
}

export interface BacktestResult {
  symbol: string
  total_signals: number
  accuracy: number
  total_return: number
  sharpe_ratio: number
  max_drawdown: number
  win_rate: number
  avg_win: number
  avg_loss: number
}

export interface HealthStatus {
  status: string
  models_loaded: number
  supported_symbols: string[]
  cached_signals: number
  timestamp: string
}

class AlphaStreamAPI {
  private base: string

  constructor(baseUrl?: string) {
    this.base = baseUrl || API_BASE
  }

  private async get<T>(path: string): Promise<T> {
    const res = await fetch(`${this.base}${path}`)
    if (!res.ok) {
      throw new Error(`API error: ${res.status} ${res.statusText}`)
    }
    return res.json()
  }

  private async post<T>(path: string, body: unknown): Promise<T> {
    const res = await fetch(`${this.base}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    if (!res.ok) {
      throw new Error(`API error: ${res.status} ${res.statusText}`)
    }
    return res.json()
  }

  async health(): Promise<HealthStatus> {
    return this.get("/health")
  }

  async getSignals(symbol?: string, limit = 20): Promise<Signal[]> {
    const params = new URLSearchParams()
    if (symbol) params.set("symbol", symbol)
    params.set("limit", limit.toString())
    return this.get(`/v1/signals?${params}`)
  }

  async getSignal(symbol: string): Promise<Signal> {
    return this.get(`/v1/signals/${symbol}`)
  }

  async getModels(): Promise<ModelInfo[]> {
    return this.get("/v1/models")
  }

  async getPrices(symbol: string, period = "1mo", interval = "1h"): Promise<PriceBar[]> {
    return this.get(`/v1/prices/${symbol}?period=${period}&interval=${interval}`)
  }

  async runBacktest(symbol: string, period = "1y", interval = "1h"): Promise<BacktestResult> {
    return this.post("/v1/backtest", { symbol, period, interval })
  }
}

export const api = new AlphaStreamAPI()
