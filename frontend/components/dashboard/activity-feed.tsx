"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  TrendingUp, 
  TrendingDown, 
  Activity,
  Sparkles,
  Clock,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Signal {
  id: string
  symbol: string
  direction: "LONG" | "SHORT"
  confidence: number
  entryPrice: number
  model: string
  timestamp: Date
}

interface ActivityFeedProps {
  signals?: Signal[]
  isConnected?: boolean
}

// Generate some initial mock signals
const mockSignals: Signal[] = [
  { id: "1", symbol: "NQ", direction: "LONG", confidence: 91, entryPrice: 19245.50, model: "XGBoost", timestamp: new Date(Date.now() - 2 * 60000) },
  { id: "2", symbol: "ES", direction: "SHORT", confidence: 84, entryPrice: 5892.75, model: "LightGBM", timestamp: new Date(Date.now() - 15 * 60000) },
  { id: "3", symbol: "CL", direction: "LONG", confidence: 88, entryPrice: 82.45, model: "LSTM", timestamp: new Date(Date.now() - 32 * 60000) },
  { id: "4", symbol: "BTC", direction: "LONG", confidence: 79, entryPrice: 67245, model: "Ensemble", timestamp: new Date(Date.now() - 45 * 60000) },
]

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

export function ActivityFeed({ signals = mockSignals, isConnected = true }: ActivityFeedProps) {
  return (
    <Card className="bg-[#18181B] border-[#27272A] h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-[#FAFAFA] flex items-center gap-2">
            <Activity className="h-5 w-5 text-teal" />
            Live Activity
          </CardTitle>
          {isConnected && (
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
              </span>
              <span className="text-xs text-success">Live</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[340px]">
          {signals.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center px-4">
              <Sparkles className="h-8 w-8 text-[#3F3F46] mb-3" />
              <p className="text-sm text-[#71717A]">Waiting for new signals...</p>
              <p className="text-xs text-[#52525B] mt-1">Signals will appear here in real-time</p>
            </div>
          ) : (
            <div className="divide-y divide-[#27272A]">
              {signals.map((signal, index) => (
                <div
                  key={signal.id}
                  className={cn(
                    "p-4 hover:bg-[#0A0A0B]/50 transition-colors",
                    index === 0 && "bg-teal/5"
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                          signal.direction === "LONG"
                            ? "bg-success/20"
                            : "bg-danger/20"
                        )}
                      >
                        {signal.direction === "LONG" ? (
                          <TrendingUp className="h-5 w-5 text-success" />
                        ) : (
                          <TrendingDown className="h-5 w-5 text-danger" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-semibold text-[#FAFAFA]">
                            {signal.symbol}
                          </span>
                          <Badge
                            className={cn(
                              "text-xs",
                              signal.direction === "LONG"
                                ? "bg-success/20 text-success border-success/30"
                                : "bg-danger/20 text-danger border-danger/30"
                            )}
                          >
                            {signal.direction}
                          </Badge>
                          {index === 0 && (
                            <Badge className="bg-teal/20 text-teal border-teal/30 text-xs animate-pulse">
                              NEW
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-xs text-[#71717A]">
                          <span>
                            Entry: <span className="text-[#A1A1AA] font-mono">{signal.entryPrice.toLocaleString()}</span>
                          </span>
                          <span>
                            Confidence: <span className="text-teal font-mono">{signal.confidence}%</span>
                          </span>
                        </div>
                        <div className="flex items-center gap-1 mt-1 text-xs text-[#52525B]">
                          <Clock className="h-3 w-3" />
                          {formatTimeAgo(signal.timestamp)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <Badge
                        variant="outline"
                        className="border-[#27272A] text-[#71717A] text-xs"
                      >
                        {signal.model}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
