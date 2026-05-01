"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
  BarChart,
  Bar,
  Cell,
} from "recharts"
import { 
  Zap, 
  TrendingUp, 
  TrendingDown, 
  Shield, 
  ExternalLink,
  Calendar,
  Target,
  Activity,
  Award,
  CheckCircle2,
  ArrowRight,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Generate realistic equity curve data
const generateEquityData = () => {
  const data = []
  let value = 100000
  const startDate = new Date("2023-01-01")
  
  for (let i = 0; i < 730; i++) {
    const date = new Date(startDate)
    date.setDate(date.getDate() + i)
    const dailyReturn = (Math.random() - 0.45) * 0.015
    value *= (1 + dailyReturn)
    
    data.push({
      date: date.toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
      fullDate: date.toISOString().split("T")[0],
      value: Math.round(value),
      benchmark: Math.round(100000 * (1 + i * 0.00025)),
    })
  }
  return data
}

const equityData = generateEquityData()
const currentValue = equityData[equityData.length - 1].value
const totalReturn = ((currentValue - 100000) / 100000 * 100).toFixed(1)

// Monthly returns data
const monthlyReturns = [
  { month: "Jan", "2024": 4.2, "2025": 3.8 },
  { month: "Feb", "2024": -1.3, "2025": 5.1 },
  { month: "Mar", "2024": 6.7, "2025": 2.4 },
  { month: "Apr", "2024": 2.1, "2025": 4.6 },
  { month: "May", "2024": -0.8, "2025": null },
  { month: "Jun", "2024": 5.4, "2025": null },
  { month: "Jul", "2024": 3.2, "2025": null },
  { month: "Aug", "2024": -2.1, "2025": null },
  { month: "Sep", "2024": 4.8, "2025": null },
  { month: "Oct", "2024": 1.9, "2025": null },
  { month: "Nov", "2024": 6.2, "2025": null },
  { month: "Dec", "2024": 3.4, "2025": null },
]

// Recent signals performance
const recentSignals = [
  { symbol: "NQ", direction: "LONG", entry: "19,245.50", exit: "19,412.25", pnl: "+$3,335", pnlPercent: "+0.87%", date: "Apr 28, 2025", status: "closed" },
  { symbol: "ES", direction: "SHORT", entry: "5,892.75", exit: "5,841.50", pnl: "+$2,562", pnlPercent: "+0.87%", date: "Apr 27, 2025", status: "closed" },
  { symbol: "CL", direction: "LONG", entry: "82.45", exit: "84.12", pnl: "+$1,670", pnlPercent: "+2.03%", date: "Apr 26, 2025", status: "closed" },
  { symbol: "GC", direction: "LONG", entry: "2,312.40", exit: "2,298.60", pnl: "-$1,380", pnlPercent: "-0.60%", date: "Apr 25, 2025", status: "closed" },
  { symbol: "BTC", direction: "LONG", entry: "67,245", exit: "69,812", pnl: "+$2,567", pnlPercent: "+3.82%", date: "Apr 24, 2025", status: "closed" },
  { symbol: "NQ", direction: "SHORT", entry: "19,156.25", exit: "19,089.50", pnl: "+$1,335", pnlPercent: "+0.35%", date: "Apr 23, 2025", status: "closed" },
  { symbol: "ES", direction: "LONG", entry: "5,812.50", exit: "5,867.25", pnl: "+$2,737", pnlPercent: "+0.94%", date: "Apr 22, 2025", status: "closed" },
  { symbol: "ETH", direction: "LONG", entry: "3,245", exit: "3,189", pnl: "-$560", pnlPercent: "-1.73%", date: "Apr 21, 2025", status: "closed" },
]

const performanceMetrics = [
  { label: "Total Return", value: `+${totalReturn}%`, color: "text-success" },
  { label: "Win Rate", value: "73.2%", color: "text-teal" },
  { label: "Profit Factor", value: "2.14", color: "text-[#FAFAFA]" },
  { label: "Sharpe Ratio", value: "1.87", color: "text-[#FAFAFA]" },
  { label: "Max Drawdown", value: "-12.4%", color: "text-danger" },
  { label: "Avg Trade", value: "+$847", color: "text-success" },
  { label: "Total Trades", value: "1,247", color: "text-[#FAFAFA]" },
  { label: "Avg Hold Time", value: "4.2 hrs", color: "text-[#FAFAFA]" },
]

export default function PerformancePage() {
  const [timeframe, setTimeframe] = useState("all")
  const [model, setModel] = useState("all")

  return (
    <div className="min-h-screen bg-[#09090B]">
      {/* Navigation */}
      <nav className="border-b border-[#27272A] bg-[#09090B]/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <Zap className="h-6 w-6 text-teal" />
              <span className="font-bold text-[#FAFAFA]">AlphaStream</span>
            </Link>
            <div className="flex items-center gap-4">
              <Button variant="ghost" className="text-[#A1A1AA] hover:text-[#FAFAFA]" asChild>
                <Link href="/auth/login">Login</Link>
              </Button>
              <Button className="bg-teal hover:bg-teal/90 text-[#09090B]" asChild>
                <Link href="/auth/signup">Start Free Trial</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Badge className="mb-4 bg-success/20 text-success border-success/30">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Verified Performance - Updated Live
          </Badge>
          <h1 className="text-4xl font-bold text-[#FAFAFA] mb-4">
            Live Track Record
          </h1>
          <p className="text-[#A1A1AA] max-w-2xl mx-auto">
            Real-time verified performance from our ML trading signals. 
            All results are audited and verified by third-party services.
          </p>
        </motion.div>

        {/* Verification Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-12"
        >
          <div className="flex items-center gap-2 px-4 py-2 bg-[#18181B] border border-[#27272A] rounded-lg">
            <Shield className="h-5 w-5 text-teal" />
            <span className="text-sm text-[#A1A1AA]">MyFXBook Verified</span>
            <ExternalLink className="h-3 w-3 text-[#71717A]" />
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-[#18181B] border border-[#27272A] rounded-lg">
            <Award className="h-5 w-5 text-violet" />
            <span className="text-sm text-[#A1A1AA]">Collective2 Tracked</span>
            <ExternalLink className="h-3 w-3 text-[#71717A]" />
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-[#18181B] border border-[#27272A] rounded-lg">
            <Activity className="h-5 w-5 text-success" />
            <span className="text-sm text-[#A1A1AA]">Live Since Jan 2023</span>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {performanceMetrics.slice(0, 4).map((metric, index) => (
            <Card key={index} className="bg-[#18181B] border-[#27272A]">
              <CardContent className="p-6 text-center">
                <p className="text-sm text-[#71717A] mb-1">{metric.label}</p>
                <p className={cn("text-3xl font-bold font-mono", metric.color)}>
                  {metric.value}
                </p>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {performanceMetrics.slice(4).map((metric, index) => (
            <Card key={index} className="bg-[#18181B] border-[#27272A]">
              <CardContent className="p-4 text-center">
                <p className="text-xs text-[#71717A] mb-1">{metric.label}</p>
                <p className={cn("text-xl font-bold font-mono", metric.color)}>
                  {metric.value}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[150px] bg-[#18181B] border-[#27272A] text-[#FAFAFA]">
              <Calendar className="mr-2 h-4 w-4 text-[#71717A]" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#18181B] border-[#27272A]">
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="ytd">Year to Date</SelectItem>
              <SelectItem value="1y">Last 12 Months</SelectItem>
              <SelectItem value="6m">Last 6 Months</SelectItem>
              <SelectItem value="3m">Last 3 Months</SelectItem>
              <SelectItem value="1m">Last Month</SelectItem>
            </SelectContent>
          </Select>

          <Select value={model} onValueChange={setModel}>
            <SelectTrigger className="w-[180px] bg-[#18181B] border-[#27272A] text-[#FAFAFA]">
              <Target className="mr-2 h-4 w-4 text-[#71717A]" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#18181B] border-[#27272A]">
              <SelectItem value="all">All Models</SelectItem>
              <SelectItem value="xgboost">XGBoost</SelectItem>
              <SelectItem value="lightgbm">LightGBM</SelectItem>
              <SelectItem value="lstm">LSTM</SelectItem>
              <SelectItem value="ensemble">Ensemble</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Equity Curve */}
        <Card className="bg-[#18181B] border-[#27272A] mb-8">
          <CardHeader>
            <CardTitle className="text-[#FAFAFA]">Equity Curve</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={equityData}>
                  <defs>
                    <linearGradient id="perfGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272A" />
                  <XAxis dataKey="date" stroke="#71717A" fontSize={12} tickLine={false} axisLine={false} interval={60} />
                  <YAxis stroke="#71717A" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#18181B", border: "1px solid #27272A", borderRadius: "8px" }}
                    labelStyle={{ color: "#FAFAFA" }}
                    formatter={(value: number, name: string) => [`$${value.toLocaleString()}`, name === "value" ? "AlphaStream" : "S&P 500"]}
                  />
                  <Area type="monotone" dataKey="benchmark" stroke="#71717A" strokeDasharray="5 5" fillOpacity={0} name="S&P 500" />
                  <Area type="monotone" dataKey="value" stroke="#06B6D4" fill="url(#perfGradient)" strokeWidth={2} name="AlphaStream" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Returns */}
        <Card className="bg-[#18181B] border-[#27272A] mb-8">
          <CardHeader>
            <CardTitle className="text-[#FAFAFA]">Monthly Returns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyReturns}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272A" />
                  <XAxis dataKey="month" stroke="#71717A" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#71717A" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#18181B", border: "1px solid #27272A", borderRadius: "8px" }}
                    labelStyle={{ color: "#FAFAFA" }}
                    formatter={(value: number) => value ? [`${value}%`, "Return"] : ["-", "Return"]}
                  />
                  <Bar dataKey="2024" name="2024">
                    {monthlyReturns.map((entry, index) => (
                      <Cell key={index} fill={entry["2024"] >= 0 ? "#10B981" : "#EF4444"} />
                    ))}
                  </Bar>
                  <Bar dataKey="2025" name="2025">
                    {monthlyReturns.map((entry, index) => (
                      <Cell key={index} fill={entry["2025"] && entry["2025"] >= 0 ? "#06B6D4" : entry["2025"] ? "#EF4444" : "transparent"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Signals */}
        <Card className="bg-[#18181B] border-[#27272A] mb-12">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-[#FAFAFA]">Recent Signals</CardTitle>
              <Badge variant="outline" className="border-[#27272A] text-[#A1A1AA]">
                Last 8 trades
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-[#27272A] hover:bg-transparent">
                  <TableHead className="text-[#A1A1AA]">Date</TableHead>
                  <TableHead className="text-[#A1A1AA]">Symbol</TableHead>
                  <TableHead className="text-[#A1A1AA]">Direction</TableHead>
                  <TableHead className="text-[#A1A1AA]">Entry</TableHead>
                  <TableHead className="text-[#A1A1AA]">Exit</TableHead>
                  <TableHead className="text-[#A1A1AA] text-right">P&L</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentSignals.map((signal, index) => (
                  <TableRow key={index} className="border-[#27272A]">
                    <TableCell className="text-[#71717A]">{signal.date}</TableCell>
                    <TableCell className="font-mono font-medium text-[#FAFAFA]">{signal.symbol}</TableCell>
                    <TableCell>
                      <Badge className={cn(
                        "font-mono",
                        signal.direction === "LONG" 
                          ? "bg-success/20 text-success border-success/30" 
                          : "bg-danger/20 text-danger border-danger/30"
                      )}>
                        {signal.direction === "LONG" ? <TrendingUp className="mr-1 h-3 w-3" /> : <TrendingDown className="mr-1 h-3 w-3" />}
                        {signal.direction}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-[#A1A1AA]">{signal.entry}</TableCell>
                    <TableCell className="font-mono text-[#A1A1AA]">{signal.exit}</TableCell>
                    <TableCell className={cn(
                      "text-right font-mono font-medium",
                      signal.pnl.startsWith("+") ? "text-success" : "text-danger"
                    )}>
                      {signal.pnl}
                      <span className="text-xs text-[#71717A] ml-1">({signal.pnlPercent})</span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center bg-gradient-to-r from-teal/10 via-violet/10 to-teal/10 border border-[#27272A] rounded-2xl p-12"
        >
          <h2 className="text-3xl font-bold text-[#FAFAFA] mb-4">
            Ready to Trade with ML-Powered Signals?
          </h2>
          <p className="text-[#A1A1AA] mb-8 max-w-xl mx-auto">
            Join thousands of traders using AlphaStream to make data-driven decisions.
            Start your free trial today.
          </p>
          <Button size="lg" className="bg-teal hover:bg-teal/90 text-[#09090B] font-semibold px-8" asChild>
            <Link href="/auth/signup">
              Start Free Trial
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <p className="text-sm text-[#71717A] mt-4">No credit card required</p>
        </motion.div>
      </main>
    </div>
  )
}
