"use client"

import { createContext, useContext, useEffect, useState, useCallback, useRef, type ReactNode } from "react"

interface Signal {
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
}

interface PriceTick {
  symbol: string
  price: number
  change: number
  changePercent: number
  volume: number
  high: number
  low: number
  timestamp: Date
}

interface RealtimeContextValue {
  isConnected: boolean
  connectionStatus: "connecting" | "connected" | "disconnected" | "reconnecting"
  signals: Signal[]
  prices: Map<string, PriceTick>
  lastUpdate: Date | null
  subscribe: (symbols: string[]) => void
  unsubscribe: (symbols: string[]) => void
}

const RealtimeContext = createContext<RealtimeContextValue | null>(null)

export function useRealtime() {
  const context = useContext(RealtimeContext)
  if (!context) {
    throw new Error("useRealtime must be used within a RealtimeProvider")
  }
  return context
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

interface RealtimeProviderProps {
  children: ReactNode
}

export function RealtimeProvider({ children }: RealtimeProviderProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<RealtimeContextValue["connectionStatus"]>("disconnected")
  const [signals, setSignals] = useState<Signal[]>([])
  const [prices, setPrices] = useState<Map<string, PriceTick>>(new Map())
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const subscribedSymbols = useRef<Set<string>>(new Set(["NQ", "ES", "CL", "GC", "BTC", "ETH"]))

  // Fetch real signals from API
  const fetchSignals = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/v1/signals?limit=20`)
      if (!res.ok) return

      const data = await res.json()
      const mapped: Signal[] = data.map((s: Record<string, unknown>) => ({
        id: s.id,
        symbol: s.symbol,
        direction: s.direction,
        confidence: s.confidence,
        entryPrice: s.entry_price,
        stopLoss: s.stop_loss,
        takeProfit: s.take_profit,
        model: "Ensemble",
        timestamp: new Date(s.timestamp as string),
      }))

      setSignals(mapped)
      setLastUpdate(new Date())
    } catch {
      // API not available — will retry
    }
  }, [])

  // Fetch real prices from API
  const fetchPrices = useCallback(async () => {
    const symbols = Array.from(subscribedSymbols.current)
    const newPrices = new Map<string, PriceTick>(prices)

    for (const symbol of symbols) {
      try {
        const res = await fetch(`${API_BASE}/v1/prices/${symbol}?period=5d&interval=1h`)
        if (!res.ok) continue

        const data = await res.json()
        if (data.length < 2) continue

        const latest = data[data.length - 1]
        const prev = data[data.length - 2]
        const change = latest.close - prev.close
        const changePct = (change / prev.close) * 100

        newPrices.set(symbol, {
          symbol,
          price: latest.close,
          change: Math.round(change * 100) / 100,
          changePercent: Math.round(changePct * 100) / 100,
          volume: latest.volume || 0,
          high: latest.high,
          low: latest.low,
          timestamp: new Date(latest.timestamp),
        })
      } catch {
        // Skip failed symbol
      }
    }

    setPrices(newPrices)
    setLastUpdate(new Date())
  }, [prices])

  // Connect and start polling
  useEffect(() => {
    let signalInterval: NodeJS.Timeout
    let priceInterval: NodeJS.Timeout

    const connect = async () => {
      setConnectionStatus("connecting")

      try {
        const res = await fetch(`${API_BASE}/health`)
        if (res.ok) {
          setIsConnected(true)
          setConnectionStatus("connected")

          // Initial fetch
          await fetchSignals()
          await fetchPrices()

          // Poll signals every 30 seconds
          signalInterval = setInterval(fetchSignals, 30_000)
          // Poll prices every 10 seconds
          priceInterval = setInterval(fetchPrices, 10_000)
        } else {
          setConnectionStatus("disconnected")
        }
      } catch {
        setConnectionStatus("disconnected")
        // Retry connection every 10 seconds
        setTimeout(connect, 10_000)
      }
    }

    connect()

    return () => {
      clearInterval(signalInterval)
      clearInterval(priceInterval)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const subscribe = useCallback((symbols: string[]) => {
    symbols.forEach(s => subscribedSymbols.current.add(s))
  }, [])

  const unsubscribe = useCallback((symbols: string[]) => {
    symbols.forEach(s => subscribedSymbols.current.delete(s))
  }, [])

  return (
    <RealtimeContext.Provider
      value={{
        isConnected,
        connectionStatus,
        signals,
        prices,
        lastUpdate,
        subscribe,
        unsubscribe,
      }}
    >
      {children}
    </RealtimeContext.Provider>
  )
}
