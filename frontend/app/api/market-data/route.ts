import { NextResponse } from "next/server"

// Simulated market data - in production, this would connect to real market data providers
const symbols = ["NQ", "ES", "CL", "GC", "BTC", "ETH"]

function generateMarketData() {
  return symbols.map((symbol) => {
    const basePrice = {
      NQ: 19200,
      ES: 5880,
      CL: 82,
      GC: 2340,
      BTC: 67000,
      ETH: 3400,
    }[symbol] || 100

    const volatility = symbol === "BTC" || symbol === "ETH" ? 0.02 : 0.005
    const change = (Math.random() - 0.5) * 2 * volatility * basePrice
    const price = basePrice + change
    const changePercent = (change / basePrice) * 100

    return {
      symbol,
      price: parseFloat(price.toFixed(2)),
      change: parseFloat(change.toFixed(2)),
      changePercent: parseFloat(changePercent.toFixed(2)),
      volume: Math.floor(Math.random() * 1000000) + 100000,
      high: parseFloat((price * 1.01).toFixed(2)),
      low: parseFloat((price * 0.99).toFixed(2)),
      timestamp: new Date().toISOString(),
    }
  })
}

function generateSignal() {
  const symbol = symbols[Math.floor(Math.random() * symbols.length)]
  const direction = Math.random() > 0.5 ? "LONG" : "SHORT"
  const models = ["XGBoost", "LightGBM", "LSTM", "Transformer", "Ensemble"]
  const model = models[Math.floor(Math.random() * models.length)]
  
  const basePrice = {
    NQ: 19200,
    ES: 5880,
    CL: 82,
    GC: 2340,
    BTC: 67000,
    ETH: 3400,
  }[symbol] || 100

  return {
    id: crypto.randomUUID(),
    symbol,
    direction,
    confidence: Math.floor(Math.random() * 20) + 75, // 75-95
    entryPrice: parseFloat((basePrice + (Math.random() - 0.5) * basePrice * 0.01).toFixed(2)),
    stopLoss: direction === "LONG" 
      ? parseFloat((basePrice * 0.98).toFixed(2))
      : parseFloat((basePrice * 1.02).toFixed(2)),
    takeProfit: direction === "LONG"
      ? parseFloat((basePrice * 1.03).toFixed(2))
      : parseFloat((basePrice * 0.97).toFixed(2)),
    model,
    timestamp: new Date().toISOString(),
    reasoning: `${model} model detected ${direction.toLowerCase()} opportunity based on momentum indicators and volume analysis.`,
  }
}

export async function GET() {
  // Return current market data and any new signals
  const marketData = generateMarketData()
  
  // 30% chance of generating a new signal
  const signal = Math.random() > 0.7 ? generateSignal() : null

  return NextResponse.json({
    marketData,
    signal,
    timestamp: new Date().toISOString(),
  })
}

export async function POST(request: Request) {
  const body = await request.json()
  const { action } = body

  if (action === "generate-signal") {
    const signal = generateSignal()
    return NextResponse.json({ signal })
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 })
}
