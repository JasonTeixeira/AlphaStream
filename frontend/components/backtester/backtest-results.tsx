"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts"
import { Download, Save, Share2, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

// Generate equity curve data
const generateEquityData = (seed = 1) => {
  const data = []
  let value = 100000
  let valueB = 100000
  const now = new Date()
  
  for (let i = 365; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    value *= 1 + (Math.random() * 0.02 - 0.007)
    valueB *= 1 + (Math.random() * 0.018 - 0.006) * seed
    
    data.push({
      date: date.toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
      value: Math.round(value),
      valueB: Math.round(valueB),
      benchmark: Math.round(100000 * (1 + (365 - i) * 0.0003)),
    })
  }
  return data
}

const equityData = generateEquityData()

const metrics = [
  { label: "Total Return", value: "+47.3%", color: "text-success" },
  { label: "Sharpe Ratio", value: "1.72", color: "text-teal" },
  { label: "Max Drawdown", value: "-12.1%", color: "text-danger" },
  { label: "Win Rate", value: "59.5%", color: "text-success" },
  { label: "Total Trades", value: "342", color: "text-[#FAFAFA]" },
  { label: "Profit Factor", value: "1.85", color: "text-success" },
]

const riskMetrics = [
  { label: "Sharpe Ratio", value: "1.72" },
  { label: "Sortino Ratio", value: "2.14" },
  { label: "Calmar Ratio", value: "3.91" },
  { label: "Information Ratio", value: "0.89" },
  { label: "Max Drawdown", value: "-12.1%" },
  { label: "Avg Drawdown", value: "-4.3%" },
  { label: "Max DD Duration", value: "18 days" },
  { label: "Recovery Time", value: "12 days" },
]

const trades = [
  { id: 1, date: "2025-07-15", symbol: "NQ", direction: "LONG", entry: "18,245.50", exit: "18,375.00", pnl: "+$2,590.00", pnlPct: "+0.71%", duration: "4h 22m", model: "XGBoost", confidence: 91 },
  { id: 2, date: "2025-07-15", symbol: "CL", direction: "SHORT", entry: "78.42", exit: "77.20", pnl: "+$1,220.00", pnlPct: "+1.56%", duration: "2h 10m", model: "LightGBM", confidence: 88 },
  { id: 3, date: "2025-07-14", symbol: "ES", direction: "LONG", entry: "5,432.75", exit: "5,398.25", pnl: "-$862.50", pnlPct: "-0.63%", duration: "6h 45m", model: "Ensemble", confidence: 72 },
  { id: 4, date: "2025-07-14", symbol: "GC", direction: "LONG", entry: "2,352.40", exit: "2,378.60", pnl: "+$2,620.00", pnlPct: "+1.11%", duration: "8h 15m", model: "LSTM", confidence: 84 },
  { id: 5, date: "2025-07-13", symbol: "BTC", direction: "SHORT", entry: "67,234.00", exit: "68,100.00", pnl: "-$866.00", pnlPct: "-1.29%", duration: "3h 30m", model: "XGBoost", confidence: 67 },
  { id: 6, date: "2025-07-13", symbol: "NQ", direction: "SHORT", entry: "18,310.25", exit: "18,210.00", pnl: "+$2,005.00", pnlPct: "+0.55%", duration: "5h 12m", model: "LightGBM", confidence: 85 },
  { id: 7, date: "2025-07-12", symbol: "ETH", direction: "LONG", entry: "3,380.00", exit: "3,456.20", pnl: "+$1,524.00", pnlPct: "+2.25%", duration: "1d 2h", model: "Ensemble", confidence: 79 },
  { id: 8, date: "2025-07-12", symbol: "CL", direction: "LONG", entry: "77.85", exit: "78.90", pnl: "+$1,050.00", pnlPct: "+1.35%", duration: "7h 45m", model: "XGBoost", confidence: 73 },
]

// Monthly returns heatmap data
const monthlyReturns = [
  { year: "2025", months: [2.1, -0.8, 3.4, 1.2, -1.5, 4.2, 2.8, 0.5, -0.3, 1.9, 3.1, 2.4] },
  { year: "2024", months: [1.5, 2.3, -1.2, 0.8, 3.5, -0.5, 2.1, 1.8, -0.9, 2.7, 1.4, 3.2] },
]

// Generate drawdown data
const generateDrawdownData = () => {
  const data = []
  const now = new Date()
  let maxValue = 100000
  let currentValue = 100000
  
  for (let i = 365; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    currentValue *= 1 + (Math.random() * 0.02 - 0.007)
    maxValue = Math.max(maxValue, currentValue)
    const drawdown = ((currentValue - maxValue) / maxValue) * 100
    
    data.push({
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      drawdown: Math.round(drawdown * 100) / 100,
    })
  }
  return data
}

const drawdownData = generateDrawdownData()

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

interface BacktestResultsProps {
  compareMode?: boolean
}

export function BacktestResults({ compareMode = false }: BacktestResultsProps) {
  const [tradeFilter, setTradeFilter] = useState<"all" | "winners" | "losers">("all")
  const [currentPage, setCurrentPage] = useState(1)
  const tradesPerPage = 8

  const filteredTrades = trades.filter((trade) => {
    if (tradeFilter === "winners") return trade.pnl.startsWith("+")
    if (tradeFilter === "losers") return trade.pnl.startsWith("-")
    return true
  })

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Summary Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {metrics.map((metric) => (
          <Card key={metric.label} className="bg-[#18181B] border-[#27272A]">
            <CardContent className="p-4 text-center">
              <p className={cn("text-2xl font-bold font-mono", metric.color)}>{metric.value}</p>
              <p className="text-sm text-[#71717A] mt-1">{metric.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <Button variant="outline" className="border-[#27272A] text-[#A1A1AA] hover:text-[#FAFAFA]">
          <Download className="mr-2 h-4 w-4" />
          Export Results
        </Button>
        <Button variant="ghost" className="text-[#A1A1AA] hover:text-[#FAFAFA]">
          <Save className="mr-2 h-4 w-4" />
          Save Backtest
        </Button>
        <Button variant="ghost" className="text-[#A1A1AA] hover:text-[#FAFAFA]">
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
      </div>

      {/* Equity Curve */}
      <Card className="bg-[#18181B] border-[#27272A]">
        <CardHeader>
          <CardTitle className="text-lg text-[#FAFAFA]">Portfolio Value Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={equityData}>
                <defs>
                  <linearGradient id="equityGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="equityGradientB" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272A" />
                <XAxis dataKey="date" stroke="#71717A" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#71717A" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#18181B", border: "1px solid #27272A", borderRadius: "8px" }}
                  labelStyle={{ color: "#FAFAFA" }}
                  formatter={(value: number, name: string) => [`$${value.toLocaleString()}`, name]}
                />
                <ReferenceLine y={100000} stroke="#27272A" strokeDasharray="3 3" />
                <Area type="monotone" dataKey="benchmark" stroke="#71717A" strokeDasharray="5 5" fillOpacity={0} name="Benchmark" />
                <Area type="monotone" dataKey="value" stroke="#06B6D4" fill="url(#equityGradient)" strokeWidth={2} name="Strategy A" />
                {compareMode && (
                  <Area type="monotone" dataKey="valueB" stroke="#8B5CF6" fill="url(#equityGradientB)" strokeWidth={2} name="Strategy B" />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Drawdown Chart and Monthly Returns side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Drawdown Chart */}
        <Card className="bg-[#18181B] border-[#27272A]">
          <CardHeader>
            <CardTitle className="text-lg text-[#FAFAFA]">Drawdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={drawdownData}>
                  <defs>
                    <linearGradient id="drawdownGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272A" />
                  <XAxis dataKey="date" stroke="#71717A" fontSize={10} tickLine={false} axisLine={false} interval={60} />
                  <YAxis
                    stroke="#71717A"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `${v}%`}
                    domain={[-15, 0]}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#18181B", border: "1px solid #27272A", borderRadius: "8px" }}
                    labelStyle={{ color: "#FAFAFA" }}
                    formatter={(value: number) => [`${value.toFixed(2)}%`, "Drawdown"]}
                  />
                  <ReferenceLine y={-12.1} stroke="#EF4444" strokeDasharray="3 3" label={{ value: "Max DD -12.1%", fill: "#EF4444", fontSize: 10, position: "right" }} />
                  <Area type="monotone" dataKey="drawdown" stroke="#EF4444" fill="url(#drawdownGradient)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

      {/* Monthly Returns Heatmap */}
      <Card className="bg-[#18181B] border-[#27272A]">
        <CardHeader>
          <CardTitle className="text-lg text-[#FAFAFA]">Monthly Returns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left text-sm text-[#71717A] pb-2 pr-4">Year</th>
                  {monthNames.map((month) => (
                    <th key={month} className="text-center text-xs text-[#71717A] pb-2 px-1">{month}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {monthlyReturns.map((row) => (
                  <tr key={row.year}>
                    <td className="text-sm text-[#FAFAFA] font-mono pr-4 py-1">{row.year}</td>
                    {row.months.map((value, i) => (
                      <td key={i} className="px-1 py-1">
                        <div
                          className={cn(
                            "text-xs font-mono text-center py-2 px-1 rounded",
                            value > 3 && "bg-success/30 text-success",
                            value > 0 && value <= 3 && "bg-success/10 text-success",
                            value <= 0 && value >= -1 && "bg-[#27272A] text-[#A1A1AA]",
                            value < -1 && value >= -3 && "bg-danger/10 text-danger",
                            value < -3 && "bg-danger/30 text-danger"
                          )}
                        >
                          {value > 0 ? "+" : ""}{value.toFixed(1)}%
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      </div>

      {/* Risk Metrics */}
      <Card className="bg-[#18181B] border-[#27272A]">
        <CardHeader>
          <CardTitle className="text-lg text-[#FAFAFA]">Risk Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {riskMetrics.map((metric) => (
              <div key={metric.label}>
                <p className="text-sm text-[#71717A]">{metric.label}</p>
                <p className="text-lg font-bold font-mono text-[#FAFAFA]">{metric.value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Trade Log */}
      <Card className="bg-[#18181B] border-[#27272A]">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <CardTitle className="text-lg text-[#FAFAFA]">Trade History</CardTitle>
            <Badge variant="outline" className="border-[#27272A] text-[#A1A1AA]">342 trades</Badge>
          </div>
          <div className="flex items-center gap-2">
            {(["all", "winners", "losers"] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setTradeFilter(filter)}
                className={cn(
                  "px-3 py-1 text-sm rounded-md transition-colors capitalize",
                  tradeFilter === filter
                    ? "bg-teal text-[#09090B]"
                    : "text-[#A1A1AA] hover:text-[#FAFAFA]"
                )}
              >
                {filter}
              </button>
            ))}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-[#27272A] bg-[#0A0A0B]">
                  <TableHead className="text-[#A1A1AA]">#</TableHead>
                  <TableHead className="text-[#A1A1AA]">Date</TableHead>
                  <TableHead className="text-[#A1A1AA]">Symbol</TableHead>
                  <TableHead className="text-[#A1A1AA]">Direction</TableHead>
                  <TableHead className="text-[#A1A1AA] text-right">Entry</TableHead>
                  <TableHead className="text-[#A1A1AA] text-right">Exit</TableHead>
                  <TableHead className="text-[#A1A1AA] text-right">P&L ($)</TableHead>
                  <TableHead className="text-[#A1A1AA] text-right">P&L (%)</TableHead>
                  <TableHead className="text-[#A1A1AA]">Duration</TableHead>
                  <TableHead className="text-[#A1A1AA]">Model</TableHead>
                  <TableHead className="text-[#A1A1AA] text-right">Conf</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTrades.map((trade) => (
                  <TableRow key={trade.id} className="border-[#27272A] hover:bg-[#27272A]/50">
                    <TableCell className="text-[#71717A] font-mono">{trade.id}</TableCell>
                    <TableCell className="text-[#A1A1AA] font-mono">{trade.date}</TableCell>
                    <TableCell className="font-bold text-[#FAFAFA] font-mono">{trade.symbol}</TableCell>
                    <TableCell>
                      <Badge className={trade.direction === "LONG" ? "bg-success/20 text-success" : "bg-danger/20 text-danger"}>
                        {trade.direction}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono text-[#A1A1AA]">{trade.entry}</TableCell>
                    <TableCell className="text-right font-mono text-[#A1A1AA]">{trade.exit}</TableCell>
                    <TableCell className={cn("text-right font-mono font-semibold", trade.pnl.startsWith("+") ? "text-success" : "text-danger")}>
                      {trade.pnl}
                    </TableCell>
                    <TableCell className={cn("text-right font-mono", trade.pnlPct.startsWith("+") ? "text-success" : "text-danger")}>
                      {trade.pnlPct}
                    </TableCell>
                    <TableCell className="text-[#71717A]">{trade.duration}</TableCell>
                    <TableCell className="text-[#A1A1AA] font-mono text-sm">{trade.model}</TableCell>
                    <TableCell className="text-right font-mono text-teal">{trade.confidence}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="p-4 border-t border-[#27272A] flex items-center justify-between">
            <span className="text-sm text-[#71717A]">
              Showing {(currentPage - 1) * tradesPerPage + 1}-{Math.min(currentPage * tradesPerPage, 342)} of 342 trades
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="border-[#27272A] text-[#A1A1AA] hover:text-[#FAFAFA] disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {[1, 2, 3].map(page => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className={cn(
                    currentPage === page
                      ? "bg-teal text-[#09090B]"
                      : "border-[#27272A] text-[#A1A1AA] hover:text-[#FAFAFA]"
                  )}
                >
                  {page}
                </Button>
              ))}
              <span className="text-[#71717A]">...</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(43)}
                className="border-[#27272A] text-[#A1A1AA] hover:text-[#FAFAFA]"
              >
                43
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.min(43, p + 1))}
                disabled={currentPage === 43}
                className="border-[#27272A] text-[#A1A1AA] hover:text-[#FAFAFA] disabled:opacity-50"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
