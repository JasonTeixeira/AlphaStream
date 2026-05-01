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
import { type Signal as ApiSignal } from "@/lib/api"
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

/** Map API signals to the table's internal display format */
function mapApiSignals(apiSignals: ApiSignal[]): Signal[] {
  return apiSignals.map((s) => {
    const sl = s.stop_loss
    const tp = s.take_profit
    const entry = s.entry_price
    const riskReward = sl && tp && entry
      ? Math.abs(tp - entry) / Math.abs(entry - sl) || null
      : null

    // Derive the top model from model_predictions
    const topModel = Object.entries(s.model_predictions || {}).sort(
      (a, b) => b[1] - a[1]
    )[0]

    return {
      id: s.id,
      symbol: s.symbol,
      direction: s.direction,
      confidence: Math.round(s.confidence * (s.confidence <= 1 ? 100 : 1)),
      model: topModel ? topModel[0] : "Ensemble",
      entryPrice: entry.toLocaleString(undefined, { minimumFractionDigits: 2 }),
      stopLoss: sl ? sl.toLocaleString(undefined, { minimumFractionDigits: 2 }) : null,
      takeProfit: tp ? tp.toLocaleString(undefined, { minimumFractionDigits: 2 }) : null,
      time: new Date(s.timestamp),
      riskReward: riskReward ? Math.round(riskReward * 10) / 10 : null,
      indicators: Object.entries(s.model_predictions || {}).map(([name, value]) => ({
        name,
        value: `${(value * 100).toFixed(1)}%`,
      })),
    }
  })
}

interface SignalsTableProps {
  signals?: ApiSignal[]
}

type SortField = "symbol" | "direction" | "confidence" | "time"
type SortOrder = "asc" | "desc"

export function SignalsTable({ signals: apiSignals }: SignalsTableProps) {
  const signalsData = useMemo(
    () => (apiSignals && apiSignals.length > 0 ? mapApiSignals(apiSignals) : []),
    [apiSignals]
  )
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
  }, [signalsData, sortField, sortOrder])

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
