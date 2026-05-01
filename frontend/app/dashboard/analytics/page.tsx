"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Target, 
  Activity,
  Download,
  Calendar,
  Filter,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react"
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area,
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart as RechartsPie,
  Pie,
  Cell
} from "recharts"
import { cn } from "@/lib/utils"
import { api, type ModelInfo } from "@/lib/api"

// Mock analytics data (used as fallback when API is unavailable)
const equityData = [
  { date: "Jan", equity: 100000, pnl: 0 },
  { date: "Feb", equity: 104500, pnl: 4500 },
  { date: "Mar", equity: 108200, pnl: 3700 },
  { date: "Apr", equity: 103800, pnl: -4400 },
  { date: "May", equity: 112450, pnl: 8650 },
  { date: "Jun", equity: 118900, pnl: 6450 },
  { date: "Jul", equity: 125340, pnl: 6440 },
  { date: "Aug", equity: 131200, pnl: 5860 },
]

const monthlyPnL = [
  { month: "Jan", pnl: 0, trades: 0 },
  { month: "Feb", pnl: 4500, trades: 12 },
  { month: "Mar", pnl: 3700, trades: 15 },
  { month: "Apr", pnl: -4400, trades: 18 },
  { month: "May", pnl: 8650, trades: 22 },
  { month: "Jun", pnl: 6450, trades: 19 },
  { month: "Jul", pnl: 6440, trades: 21 },
  { month: "Aug", pnl: 5860, trades: 17 },
]

const symbolBreakdown = [
  { symbol: "NQ", pnl: 18500, trades: 42, winRate: 71.4 },
  { symbol: "ES", pnl: 8200, trades: 35, winRate: 68.6 },
  { symbol: "GC", pnl: 4500, trades: 28, winRate: 64.3 },
  { symbol: "CL", pnl: -2100, trades: 19, winRate: 47.4 },
]

const pieData = [
  { name: "NQ", value: 18500, color: "#06B6D4" },
  { name: "ES", value: 8200, color: "#8B5CF6" },
  { name: "GC", value: 4500, color: "#F59E0B" },
  { name: "Other", value: 2000, color: "#3F3F46" },
]

const tradeHistory = [
  { id: 1, date: "2024-08-15", symbol: "NQ", direction: "Long", entry: 18245.50, exit: 18312.25, pnl: 1335, status: "win" },
  { id: 2, date: "2024-08-14", symbol: "ES", direction: "Long", entry: 5285.00, exit: 5298.75, pnl: 687.50, status: "win" },
  { id: 3, date: "2024-08-14", symbol: "GC", direction: "Short", entry: 2345.80, exit: 2338.20, pnl: 760, status: "win" },
  { id: 4, date: "2024-08-13", symbol: "CL", direction: "Long", entry: 78.45, exit: 77.82, pnl: -630, status: "loss" },
  { id: 5, date: "2024-08-12", symbol: "NQ", direction: "Short", entry: 18150.00, exit: 18092.50, pnl: 1150, status: "win" },
]

const stats = {
  totalPnL: 31200,
  totalTrades: 124,
  winRate: 68.5,
  avgWin: 845,
  avgLoss: -412,
  profitFactor: 2.04,
  sharpeRatio: 1.87,
  maxDrawdown: -4.2,
}

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState("ytd")
  const [selectedSymbol, setSelectedSymbol] = useState("all")
  const [models, setModels] = useState<ModelInfo[]>([])

  useEffect(() => {
    let cancelled = false
    async function fetchModels() {
      try {
        const data = await api.getModels()
        if (!cancelled) setModels(data)
      } catch (err) {
        console.error("Failed to fetch model data:", err)
      }
    }
    fetchModels()
    return () => { cancelled = true }
  }, [])

  return (
    <div className="min-h-screen bg-[#09090B]">
      <div className="border-b border-[#27272A] bg-[#09090B]/80 backdrop-blur-lg">
        <div className="px-4 md:px-6 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#FAFAFA]">Analytics</h1>
            <p className="text-[#A1A1AA] mt-1">Track your trading performance</p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-32 bg-[#18181B] border-[#27272A] text-[#FAFAFA]">
                <Calendar className="mr-2 h-4 w-4 text-[#71717A]" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#18181B] border-[#27272A]">
                <SelectItem value="7d">7 Days</SelectItem>
                <SelectItem value="30d">30 Days</SelectItem>
                <SelectItem value="90d">90 Days</SelectItem>
                <SelectItem value="ytd">Year to Date</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="border-[#27272A] text-[#A1A1AA]">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-6 space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          <Card className="bg-[#18181B] border-[#27272A] col-span-2">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-[#71717A] text-sm mb-1">
                <DollarSign className="h-4 w-4" />
                Total P&L
              </div>
              <p className="text-3xl font-bold text-success font-mono">
                +${stats.totalPnL.toLocaleString()}
              </p>
              <div className="flex items-center gap-1 text-success text-sm mt-1">
                <ArrowUpRight className="h-4 w-4" />
                +31.2%
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#18181B] border-[#27272A]">
            <CardContent className="p-4">
              <div className="text-[#71717A] text-sm mb-1">Trades</div>
              <p className="text-2xl font-bold text-[#FAFAFA] font-mono">{stats.totalTrades}</p>
            </CardContent>
          </Card>

          <Card className="bg-[#18181B] border-[#27272A]">
            <CardContent className="p-4">
              <div className="text-[#71717A] text-sm mb-1">Win Rate</div>
              <p className="text-2xl font-bold text-teal font-mono">{stats.winRate}%</p>
            </CardContent>
          </Card>

          <Card className="bg-[#18181B] border-[#27272A]">
            <CardContent className="p-4">
              <div className="text-[#71717A] text-sm mb-1">Avg Win</div>
              <p className="text-2xl font-bold text-success font-mono">${stats.avgWin}</p>
            </CardContent>
          </Card>

          <Card className="bg-[#18181B] border-[#27272A]">
            <CardContent className="p-4">
              <div className="text-[#71717A] text-sm mb-1">Avg Loss</div>
              <p className="text-2xl font-bold text-danger font-mono">${Math.abs(stats.avgLoss)}</p>
            </CardContent>
          </Card>

          <Card className="bg-[#18181B] border-[#27272A]">
            <CardContent className="p-4">
              <div className="text-[#71717A] text-sm mb-1">Profit Factor</div>
              <p className="text-2xl font-bold text-[#FAFAFA] font-mono">{stats.profitFactor}</p>
            </CardContent>
          </Card>

          <Card className="bg-[#18181B] border-[#27272A]">
            <CardContent className="p-4">
              <div className="text-[#71717A] text-sm mb-1">Max DD</div>
              <p className="text-2xl font-bold text-danger font-mono">{stats.maxDrawdown}%</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Equity Curve */}
          <Card className="bg-[#18181B] border-[#27272A] lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg text-[#FAFAFA]">Equity Curve</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={equityData}>
                    <defs>
                      <linearGradient id="equityGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272A" />
                    <XAxis dataKey="date" stroke="#71717A" fontSize={12} />
                    <YAxis stroke="#71717A" fontSize={12} tickFormatter={(v) => `$${(v/1000)}k`} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#18181B', 
                        border: '1px solid #27272A',
                        borderRadius: '8px'
                      }}
                      formatter={(value: number) => [`$${value.toLocaleString()}`, 'Equity']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="equity" 
                      stroke="#06B6D4" 
                      fill="url(#equityGradient)" 
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* P&L by Symbol Pie */}
          <Card className="bg-[#18181B] border-[#27272A]">
            <CardHeader>
              <CardTitle className="text-lg text-[#FAFAFA]">P&L by Symbol</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPie>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#18181B', 
                        border: '1px solid #27272A',
                        borderRadius: '8px'
                      }}
                      formatter={(value: number) => [`$${value.toLocaleString()}`, 'P&L']}
                    />
                  </RechartsPie>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {pieData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-[#A1A1AA]">{item.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Monthly P&L Bar Chart */}
        <Card className="bg-[#18181B] border-[#27272A]">
          <CardHeader>
            <CardTitle className="text-lg text-[#FAFAFA]">Monthly P&L</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyPnL}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272A" />
                  <XAxis dataKey="month" stroke="#71717A" fontSize={12} />
                  <YAxis stroke="#71717A" fontSize={12} tickFormatter={(v) => `$${v/1000}k`} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#18181B', 
                      border: '1px solid #27272A',
                      borderRadius: '8px'
                    }}
                    formatter={(value: number) => [`$${value.toLocaleString()}`, 'P&L']}
                  />
                  <Bar 
                    dataKey="pnl" 
                    radius={[4, 4, 0, 0]}
                    fill="#06B6D4"
                  >
                    {monthlyPnL.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.pnl >= 0 ? '#10B981' : '#EF4444'} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Symbol Breakdown Table */}
        <Card className="bg-[#18181B] border-[#27272A]">
          <CardHeader>
            <CardTitle className="text-lg text-[#FAFAFA]">Performance by Symbol</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#27272A]">
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#71717A]">Symbol</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-[#71717A]">Trades</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-[#71717A]">Win Rate</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-[#71717A]">P&L</th>
                  </tr>
                </thead>
                <tbody>
                  {symbolBreakdown.map((row) => (
                    <tr key={row.symbol} className="border-b border-[#27272A]/50">
                      <td className="py-3 px-4">
                        <span className="font-semibold text-[#FAFAFA]">{row.symbol}</span>
                      </td>
                      <td className="py-3 px-4 text-right text-[#A1A1AA] font-mono">{row.trades}</td>
                      <td className="py-3 px-4 text-right">
                        <span className={cn(
                          "font-mono",
                          row.winRate >= 60 ? "text-success" : row.winRate >= 50 ? "text-warning" : "text-danger"
                        )}>
                          {row.winRate}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className={cn(
                          "font-semibold font-mono",
                          row.pnl >= 0 ? "text-success" : "text-danger"
                        )}>
                          {row.pnl >= 0 ? "+" : ""}${row.pnl.toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Model Performance (real API data) */}
        {models.length > 0 && (
          <Card className="bg-[#18181B] border-[#27272A]">
            <CardHeader>
              <CardTitle className="text-lg text-[#FAFAFA]">Model Performance</CardTitle>
              <CardDescription className="text-[#71717A]">Real-time metrics from trained models</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#27272A]">
                      <th className="text-left py-3 px-4 text-sm font-medium text-[#71717A]">Model</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-[#71717A]">Symbol</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-[#71717A]">Accuracy</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-[#71717A]">AUC</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-[#71717A]">F1</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-[#71717A]">Precision</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-[#71717A]">Recall</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-[#71717A]">Samples</th>
                    </tr>
                  </thead>
                  <tbody>
                    {models.map((model, idx) => (
                      <tr key={`${model.symbol}-${model.model_type}-${idx}`} className="border-b border-[#27272A]/50 hover:bg-[#27272A]/30 transition-colors">
                        <td className="py-3 px-4 font-semibold text-[#FAFAFA]">{model.model_type}</td>
                        <td className="py-3 px-4 font-mono text-[#A1A1AA]">{model.symbol}</td>
                        <td className="py-3 px-4 text-right">
                          <span className={cn("font-mono", model.accuracy >= 0.6 ? "text-success" : model.accuracy >= 0.5 ? "text-warning" : "text-danger")}>
                            {(model.accuracy * 100).toFixed(1)}%
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-teal">{model.auc.toFixed(3)}</td>
                        <td className="py-3 px-4 text-right font-mono text-[#FAFAFA]">{model.f1.toFixed(3)}</td>
                        <td className="py-3 px-4 text-right font-mono text-[#A1A1AA]">{model.precision.toFixed(3)}</td>
                        <td className="py-3 px-4 text-right font-mono text-[#A1A1AA]">{model.recall.toFixed(3)}</td>
                        <td className="py-3 px-4 text-right font-mono text-[#71717A]">{model.n_samples.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Trades */}
        <Card className="bg-[#18181B] border-[#27272A]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-[#FAFAFA]">Trade Journal</CardTitle>
              <Button variant="outline" size="sm" className="border-[#27272A] text-[#A1A1AA]">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#27272A]">
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#71717A]">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#71717A]">Symbol</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#71717A]">Direction</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-[#71717A]">Entry</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-[#71717A]">Exit</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-[#71717A]">P&L</th>
                  </tr>
                </thead>
                <tbody>
                  {tradeHistory.map((trade) => (
                    <tr key={trade.id} className="border-b border-[#27272A]/50 hover:bg-[#27272A]/30 transition-colors">
                      <td className="py-3 px-4 text-[#A1A1AA] text-sm">{trade.date}</td>
                      <td className="py-3 px-4 font-semibold text-[#FAFAFA]">{trade.symbol}</td>
                      <td className="py-3 px-4">
                        <Badge 
                          variant="outline" 
                          className={cn(
                            "text-xs",
                            trade.direction === "Long" 
                              ? "border-success/30 text-success" 
                              : "border-danger/30 text-danger"
                          )}
                        >
                          {trade.direction}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-[#A1A1AA]">${trade.entry}</td>
                      <td className="py-3 px-4 text-right font-mono text-[#A1A1AA]">${trade.exit}</td>
                      <td className="py-3 px-4 text-right">
                        <span className={cn(
                          "font-semibold font-mono",
                          trade.pnl >= 0 ? "text-success" : "text-danger"
                        )}>
                          {trade.pnl >= 0 ? "+" : ""}${trade.pnl.toFixed(2)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
