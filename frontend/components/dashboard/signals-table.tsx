"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { 
  ChevronDown, 
  ChevronUp, 
  ArrowUpDown, 
  Download, 
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Clock,
  Target,
  Shield
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface Signal {
  id: string
  symbol: string
  direction: "LONG" | "SHORT" | "NEUTRAL"
  confidence: number
  model: string
  entryPrice: string
  stopLoss: string | null
  takeProfit: string | null
  time: Date
  riskReward: number | null
  indicators: { name: string; value: string }[]
}

const signalsData: Signal[] = [
  { 
    id: "1",
    symbol: "NQ", 
    direction: "LONG", 
    confidence: 91, 
    model: "XGBoost", 
    entryPrice: "18,245.50", 
    stopLoss: "18,180.00", 
    takeProfit: "18,375.00", 
    time: new Date(Date.now() - 1000 * 60 * 2),
    riskReward: 2.0,
    indicators: [
      { name: "RSI", value: "34.2" },
      { name: "MACD", value: "Bullish Cross" },
      { name: "Volume", value: "+42% above avg" },
    ]
  },
  { 
    id: "2",
    symbol: "ES", 
    direction: "LONG", 
    confidence: 84, 
    model: "Ensemble", 
    entryPrice: "5,432.75", 
    stopLoss: "5,410.00", 
    takeProfit: "5,470.00", 
    time: new Date(Date.now() - 1000 * 60 * 5),
    riskReward: 1.6,
    indicators: [
      { name: "RSI", value: "42.8" },
      { name: "MACD", value: "Bullish" },
      { name: "Volume", value: "+18% above avg" },
    ]
  },
  { 
    id: "3",
    symbol: "CL", 
    direction: "SHORT", 
    confidence: 88, 
    model: "LightGBM", 
    entryPrice: "78.42", 
    stopLoss: "79.10", 
    takeProfit: "77.20", 
    time: new Date(Date.now() - 1000 * 60 * 8),
    riskReward: 1.8,
    indicators: [
      { name: "RSI", value: "72.1" },
      { name: "MACD", value: "Bearish Cross" },
      { name: "Volume", value: "+25% above avg" },
    ]
  },
  { 
    id: "4",
    symbol: "GC", 
    direction: "NEUTRAL", 
    confidence: 51, 
    model: "LSTM", 
    entryPrice: "2,345.80", 
    stopLoss: null, 
    takeProfit: null, 
    time: new Date(Date.now() - 1000 * 60 * 12),
    riskReward: null,
    indicators: [
      { name: "RSI", value: "48.5" },
      { name: "MACD", value: "Neutral" },
      { name: "Volume", value: "-5% below avg" },
    ]
  },
  { 
    id: "5",
    symbol: "BTC", 
    direction: "LONG", 
    confidence: 76, 
    model: "XGBoost", 
    entryPrice: "67,234.00", 
    stopLoss: "66,500.00", 
    takeProfit: "68,100.00", 
    time: new Date(Date.now() - 1000 * 60 * 15),
    riskReward: 1.2,
    indicators: [
      { name: "RSI", value: "38.9" },
      { name: "MACD", value: "Bullish" },
      { name: "Volume", value: "+65% above avg" },
    ]
  },
  { 
    id: "6",
    symbol: "ETH", 
    direction: "SHORT", 
    confidence: 82, 
    model: "LightGBM", 
    entryPrice: "3,456.20", 
    stopLoss: "3,510.00", 
    takeProfit: "3,380.00", 
    time: new Date(Date.now() - 1000 * 60 * 20),
    riskReward: 1.4,
    indicators: [
      { name: "RSI", value: "68.3" },
      { name: "MACD", value: "Bearish" },
      { name: "Volume", value: "+32% above avg" },
    ]
  },
  { 
    id: "7",
    symbol: "RTY", 
    direction: "LONG", 
    confidence: 69, 
    model: "RandomForest", 
    entryPrice: "2,087.40", 
    stopLoss: "2,075.00", 
    takeProfit: "2,105.00", 
    time: new Date(Date.now() - 1000 * 60 * 25),
    riskReward: 1.4,
    indicators: [
      { name: "RSI", value: "45.2" },
      { name: "MACD", value: "Bullish" },
      { name: "Volume", value: "+12% above avg" },
    ]
  },
  { 
    id: "8",
    symbol: "YM", 
    direction: "NEUTRAL", 
    confidence: 48, 
    model: "Ensemble", 
    entryPrice: "38,942.00", 
    stopLoss: null, 
    takeProfit: null, 
    time: new Date(Date.now() - 1000 * 60 * 30),
    riskReward: null,
    indicators: [
      { name: "RSI", value: "52.1" },
      { name: "MACD", value: "Neutral" },
      { name: "Volume", value: "-8% below avg" },
    ]
  },
]

type SortField = "symbol" | "direction" | "confidence" | "time"
type SortOrder = "asc" | "desc"

export function SignalsTable() {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [sortField, setSortField] = useState<SortField>("time")
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc")
  const [pageSize, setPageSize] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [lastUpdated, setLastUpdated] = useState(new Date())

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortOrder("desc")
    }
  }

  const sortedSignals = useMemo(() => {
    return [...signalsData].sort((a, b) => {
      let comparison = 0
      switch (sortField) {
        case "symbol":
          comparison = a.symbol.localeCompare(b.symbol)
          break
        case "direction":
          comparison = a.direction.localeCompare(b.direction)
          break
        case "confidence":
          comparison = a.confidence - b.confidence
          break
        case "time":
          comparison = a.time.getTime() - b.time.getTime()
          break
      }
      return sortOrder === "asc" ? comparison : -comparison
    })
  }, [sortField, sortOrder])

  const totalPages = Math.ceil(sortedSignals.length / pageSize)
  const paginatedSignals = sortedSignals.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  const exportToCsv = () => {
    const headers = ["Symbol", "Direction", "Confidence", "Model", "Entry", "Stop Loss", "Take Profit", "Time"]
    const rows = signalsData.map((s) => [
      s.symbol,
      s.direction,
      s.confidence,
      s.model,
      s.entryPrice,
      s.stopLoss || "",
      s.takeProfit || "",
      s.time.toISOString(),
    ])
    
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `signals-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.success("Signals exported to CSV")
  }

  const refresh = () => {
    setLastUpdated(new Date())
    toast.success("Signals refreshed")
  }

  const SortIcon = ({ field }: { field: SortField }) => (
    <ArrowUpDown className={cn(
      "ml-1 h-3 w-3",
      sortField === field ? "text-teal" : "text-[#71717A]"
    )} />
  )

  return (
    <Card className="bg-[#18181B] border-[#27272A]">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <CardTitle className="text-lg text-[#FAFAFA]">Live Signals</CardTitle>
            <div className="flex items-center gap-2 text-xs text-[#71717A]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
              </span>
              Updated {formatDistanceToNow(lastUpdated, { addSuffix: true })}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={refresh}
              className="border-[#27272A] text-[#A1A1AA] hover:text-[#FAFAFA]"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={exportToCsv}
              className="border-[#27272A] text-[#A1A1AA] hover:text-[#FAFAFA]"
            >
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-[#27272A] bg-[#0A0A0B]">
                <TableHead className="w-8"></TableHead>
                <TableHead 
                  className="text-[#A1A1AA] font-semibold cursor-pointer hover:text-[#FAFAFA]"
                  onClick={() => handleSort("symbol")}
                >
                  <div className="flex items-center">
                    Symbol
                    <SortIcon field="symbol" />
                  </div>
                </TableHead>
                <TableHead 
                  className="text-[#A1A1AA] font-semibold cursor-pointer hover:text-[#FAFAFA]"
                  onClick={() => handleSort("direction")}
                >
                  <div className="flex items-center">
                    Direction
                    <SortIcon field="direction" />
                  </div>
                </TableHead>
                <TableHead 
                  className="text-[#A1A1AA] font-semibold cursor-pointer hover:text-[#FAFAFA]"
                  onClick={() => handleSort("confidence")}
                >
                  <div className="flex items-center">
                    Confidence
                    <SortIcon field="confidence" />
                  </div>
                </TableHead>
                <TableHead className="text-[#A1A1AA] font-semibold">Model</TableHead>
                <TableHead className="text-[#A1A1AA] font-semibold text-right">Entry</TableHead>
                <TableHead className="text-[#A1A1AA] font-semibold text-right">Stop Loss</TableHead>
                <TableHead className="text-[#A1A1AA] font-semibold text-right">Take Profit</TableHead>
                <TableHead 
                  className="text-[#A1A1AA] font-semibold text-right cursor-pointer hover:text-[#FAFAFA]"
                  onClick={() => handleSort("time")}
                >
                  <div className="flex items-center justify-end">
                    Time
                    <SortIcon field="time" />
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedSignals.map((signal) => (
                <Collapsible
                  key={signal.id}
                  open={expandedRows.has(signal.id)}
                  onOpenChange={() => toggleRow(signal.id)}
                  asChild
                >
                  <>
                    <CollapsibleTrigger asChild>
                      <TableRow className="border-[#27272A] hover:bg-[#27272A]/50 cursor-pointer">
                        <TableCell className="w-8">
                          {expandedRows.has(signal.id) ? (
                            <ChevronUp className="h-4 w-4 text-[#71717A]" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-[#71717A]" />
                          )}
                        </TableCell>
                        <TableCell className="font-bold text-[#FAFAFA] font-mono">{signal.symbol}</TableCell>
                        <TableCell>
                          <Badge
                            className={cn(
                              "font-semibold",
                              signal.direction === "LONG" && "bg-success/20 text-success border-success/30",
                              signal.direction === "SHORT" && "bg-danger/20 text-danger border-danger/30",
                              signal.direction === "NEUTRAL" && "bg-[#71717A]/20 text-[#71717A] border-[#71717A]/30"
                            )}
                          >
                            {signal.direction}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3 min-w-[120px]">
                            <Progress value={signal.confidence} className="h-2 flex-1 bg-[#27272A]" />
                            <span className="text-sm font-mono text-teal">{signal.confidence}%</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-[#A1A1AA] font-mono text-sm">{signal.model}</TableCell>
                        <TableCell className="text-right font-mono text-[#FAFAFA]">{signal.entryPrice}</TableCell>
                        <TableCell className="text-right font-mono text-danger">{signal.stopLoss || "—"}</TableCell>
                        <TableCell className="text-right font-mono text-success">{signal.takeProfit || "—"}</TableCell>
                        <TableCell className="text-right font-mono text-[#71717A]">
                          {formatDistanceToNow(signal.time, { addSuffix: true })}
                        </TableCell>
                      </TableRow>
                    </CollapsibleTrigger>
                    <CollapsibleContent asChild>
                      <tr className="border-[#27272A] bg-[#0A0A0B]/50">
                        <td colSpan={9} className="p-4">
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {/* Signal Details */}
                            <div className="space-y-3">
                              <h4 className="text-sm font-medium text-[#FAFAFA] flex items-center gap-2">
                                <BarChart3 className="h-4 w-4 text-teal" />
                                Signal Details
                              </h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-[#71717A]">Model</span>
                                  <span className="text-[#FAFAFA]">{signal.model}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-[#71717A]">Confidence</span>
                                  <span className="text-teal">{signal.confidence}%</span>
                                </div>
                                {signal.riskReward && (
                                  <div className="flex justify-between">
                                    <span className="text-[#71717A]">Risk/Reward</span>
                                    <span className="text-[#FAFAFA]">1:{signal.riskReward}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Price Levels */}
                            <div className="space-y-3">
                              <h4 className="text-sm font-medium text-[#FAFAFA] flex items-center gap-2">
                                <Target className="h-4 w-4 text-teal" />
                                Price Levels
                              </h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-[#71717A]">Entry</span>
                                  <span className="text-[#FAFAFA] font-mono">{signal.entryPrice}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-[#71717A]">Stop Loss</span>
                                  <span className="text-danger font-mono">{signal.stopLoss || "N/A"}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-[#71717A]">Take Profit</span>
                                  <span className="text-success font-mono">{signal.takeProfit || "N/A"}</span>
                                </div>
                              </div>
                            </div>

                            {/* Technical Indicators */}
                            <div className="space-y-3">
                              <h4 className="text-sm font-medium text-[#FAFAFA] flex items-center gap-2">
                                {signal.direction === "LONG" ? (
                                  <TrendingUp className="h-4 w-4 text-success" />
                                ) : signal.direction === "SHORT" ? (
                                  <TrendingDown className="h-4 w-4 text-danger" />
                                ) : (
                                  <Shield className="h-4 w-4 text-[#71717A]" />
                                )}
                                Technical Indicators
                              </h4>
                              <div className="space-y-2 text-sm">
                                {signal.indicators.map((ind) => (
                                  <div key={ind.name} className="flex justify-between">
                                    <span className="text-[#71717A]">{ind.name}</span>
                                    <span className="text-[#FAFAFA]">{ind.value}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Timing */}
                            <div className="space-y-3">
                              <h4 className="text-sm font-medium text-[#FAFAFA] flex items-center gap-2">
                                <Clock className="h-4 w-4 text-teal" />
                                Timing
                              </h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-[#71717A]">Generated</span>
                                  <span className="text-[#FAFAFA]">
                                    {signal.time.toLocaleTimeString()}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-[#71717A]">Age</span>
                                  <span className="text-[#FAFAFA]">
                                    {formatDistanceToNow(signal.time)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    </CollapsibleContent>
                  </>
                </Collapsible>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border-t border-[#27272A]">
          <div className="flex items-center gap-2 text-sm text-[#71717A]">
            <span>Rows per page:</span>
            <Select
              value={String(pageSize)}
              onValueChange={(value) => {
                setPageSize(Number(value))
                setCurrentPage(1)
              }}
            >
              <SelectTrigger className="w-16 h-8 bg-[#27272A] border-[#3F3F46]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#18181B] border-[#27272A]">
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-[#71717A]">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 border-[#27272A]"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 border-[#27272A]"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
