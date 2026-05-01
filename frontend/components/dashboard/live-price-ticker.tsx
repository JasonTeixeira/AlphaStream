"use client"

import { useRealtime } from "@/contexts/realtime-context"
import { motion, AnimatePresence } from "framer-motion"
import { TrendingUp, TrendingDown, Wifi, WifiOff } from "lucide-react"
import { cn } from "@/lib/utils"

export function LivePriceTicker() {
  const { prices, isConnected, lastUpdate } = useRealtime()

  const priceArray = Array.from(prices.values())

  return (
    <div className="bg-[#0A0A0B] border-b border-[#27272A] px-4 py-2">
      <div className="flex items-center justify-between gap-4 overflow-x-auto scrollbar-hide">
        <div className="flex items-center gap-6 shrink-0">
          {priceArray.map((tick) => (
            <motion.div
              key={tick.symbol}
              layout
              className="flex items-center gap-2 shrink-0"
            >
              <span className="font-mono font-semibold text-[#FAFAFA] text-sm">
                {tick.symbol}
              </span>
              <AnimatePresence mode="wait">
                <motion.span
                  key={tick.price}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="font-mono text-sm text-[#FAFAFA]"
                >
                  {tick.symbol === "BTC" || tick.symbol === "ETH"
                    ? `$${tick.price.toLocaleString()}`
                    : tick.price.toLocaleString()}
                </motion.span>
              </AnimatePresence>
              <span
                className={cn(
                  "flex items-center gap-0.5 text-xs font-mono",
                  tick.changePercent >= 0 ? "text-success" : "text-danger"
                )}
              >
                {tick.changePercent >= 0 ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {tick.changePercent >= 0 ? "+" : ""}
                {tick.changePercent.toFixed(2)}%
              </span>
            </motion.div>
          ))}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {isConnected ? (
            <div className="flex items-center gap-1.5">
              <Wifi className="h-3 w-3 text-success" />
              <span className="text-xs text-[#71717A]">Live</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <WifiOff className="h-3 w-3 text-danger" />
              <span className="text-xs text-danger">Disconnected</span>
            </div>
          )}
          {lastUpdate && (
            <span className="text-xs text-[#71717A]">
              {lastUpdate.toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
