"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface Signal {
  symbol: string
  name: string
  direction: "LONG" | "SHORT" | "NEUTRAL"
  confidence: number
  model: string
  updated: string
}

const signals: Signal[] = [
  {
    symbol: "NQ",
    name: "Nasdaq Futures",
    direction: "LONG",
    confidence: 87,
    model: "XGBoost",
    updated: "2m ago",
  },
  {
    symbol: "ES",
    name: "S&P 500 Futures",
    direction: "NEUTRAL",
    confidence: 52,
    model: "Ensemble",
    updated: "5m ago",
  },
  {
    symbol: "CL",
    name: "Crude Oil",
    direction: "SHORT",
    confidence: 91,
    model: "LightGBM",
    updated: "1m ago",
  },
  {
    symbol: "GC",
    name: "Gold",
    direction: "LONG",
    confidence: 78,
    model: "LSTM",
    updated: "3m ago",
  },
]

function SignalCard({ signal, index }: { signal: Signal; index: number }) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), index * 100)
    return () => clearTimeout(timer)
  }, [index])

  return (
    <Card
      className={cn(
        "bg-[#18181B] border-[#27272A] hover:border-teal/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_-5px_rgba(6,182,212,0.2)]",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      )}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-[#FAFAFA] font-mono">{signal.symbol}</h3>
            <p className="text-sm text-[#71717A]">{signal.name}</p>
          </div>
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
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-[#A1A1AA]">Confidence</span>
              <span className="text-sm font-mono font-semibold text-teal animate-pulse-glow">
                {signal.confidence}%
              </span>
            </div>
            <Progress
              value={signal.confidence}
              className="h-2 bg-[#27272A]"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-[#71717A]">Model</span>
            <span className="text-[#A1A1AA] font-mono">{signal.model}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-[#71717A]">Updated</span>
            <span className="text-[#A1A1AA]">{signal.updated}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function LiveSignalPreview() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center justify-center gap-2 mb-12"
        >
          <h2 className="text-2xl font-bold text-[#FAFAFA]">Signal Preview (Demo)</h2>
          <p className="text-sm text-[#71717A]">Sample signals shown for demonstration. Real signals available after signup.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {signals.map((signal, index) => (
            <motion.div
              key={signal.symbol}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <SignalCard signal={signal} index={index} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
