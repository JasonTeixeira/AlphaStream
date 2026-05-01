/**
 * Shared types for AlphaStream frontend.
 */

export interface Signal {
  id: string
  symbol: string
  direction: "LONG" | "SHORT" | "NEUTRAL"
  confidence: number
  entryPrice: number
  stopLoss: number | null
  takeProfit: number | null
  model: string
  timestamp: Date
  reasoning?: string
  status?: string
}

export interface PriceTick {
  symbol: string
  price: number
  change: number
  changePercent: number
  volume: number
  high: number
  low: number
  timestamp: Date
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

export type Plan = "free" | "starter" | "pro" | "premium"

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  plan: Plan
  emailVerified: boolean
  createdAt: Date
}
