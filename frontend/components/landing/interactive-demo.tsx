"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  TrendingUp, 
  TrendingDown, 
  ArrowRight,
  Sparkles,
  Bell,
  MousePointerClick,
} from "lucide-react"
import { cn } from "@/lib/utils"

const demoSignals = [
  { symbol: "NQ", name: "Nasdaq Futures", direction: "LONG", confidence: 87, price: "19,245.50", change: "+1.2%", model: "XGBoost" },
  { symbol: "ES", name: "S&P 500 Futures", direction: "SHORT", confidence: 82, price: "5,892.75", change: "-0.4%", model: "Ensemble" },
  { symbol: "BTC", name: "Bitcoin", direction: "LONG", confidence: 91, price: "67,245", change: "+2.8%", model: "LSTM" },
]

export function InteractiveDemo() {
  const [selectedSignal, setSelectedSignal] = useState(0)
  const [showNotification, setShowNotification] = useState(false)
  const [autoRotate, setAutoRotate] = useState(true)

  useEffect(() => {
    if (!autoRotate) return
    
    const interval = setInterval(() => {
      setSelectedSignal((prev) => (prev + 1) % demoSignals.length)
      setShowNotification(true)
      setTimeout(() => setShowNotification(false), 2000)
    }, 4000)

    return () => clearInterval(interval)
  }, [autoRotate])

  const signal = demoSignals[selectedSignal]

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#0A0A0B] to-[#09090B]">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Badge className="mb-4 bg-teal/20 text-teal border-teal/30">
            <MousePointerClick className="mr-1 h-3 w-3" />
            Interactive Preview
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-[#FAFAFA] mb-4">
            Try It Before You Sign Up
          </h2>
          <p className="text-[#A1A1AA] max-w-xl mx-auto">
            Click on signals to see detailed analysis. This is exactly what you&apos;ll get with your account.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Signal List */}
          <div className="space-y-3">
            <p className="text-sm text-[#71717A] mb-4">Live Signals (Demo Data)</p>
            {demoSignals.map((s, index) => (
              <motion.div
                key={s.symbol}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card
                  className={cn(
                    "cursor-pointer transition-all duration-300",
                    selectedSignal === index
                      ? "bg-[#18181B] border-teal ring-1 ring-teal"
                      : "bg-[#18181B]/50 border-[#27272A] hover:border-[#3F3F46]"
                  )}
                  onClick={() => {
                    setSelectedSignal(index)
                    setAutoRotate(false)
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center",
                          s.direction === "LONG" ? "bg-success/20" : "bg-danger/20"
                        )}>
                          {s.direction === "LONG" 
                            ? <TrendingUp className="h-5 w-5 text-success" />
                            : <TrendingDown className="h-5 w-5 text-danger" />
                          }
                        </div>
                        <div>
                          <p className="font-mono font-semibold text-[#FAFAFA]">{s.symbol}</p>
                          <p className="text-xs text-[#71717A]">{s.name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={cn(
                          "font-mono",
                          s.direction === "LONG"
                            ? "bg-success/20 text-success border-success/30"
                            : "bg-danger/20 text-danger border-danger/30"
                        )}>
                          {s.direction}
                        </Badge>
                        <p className="text-xs text-[#71717A] mt-1">{s.confidence}% conf</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Signal Detail */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedSignal}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="bg-[#18181B] border-[#27272A] h-full">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-14 h-14 rounded-xl flex items-center justify-center",
                          signal.direction === "LONG" ? "bg-success/20" : "bg-danger/20"
                        )}>
                          {signal.direction === "LONG" 
                            ? <TrendingUp className="h-7 w-7 text-success" />
                            : <TrendingDown className="h-7 w-7 text-danger" />
                          }
                        </div>
                        <div>
                          <CardTitle className="text-2xl text-[#FAFAFA]">{signal.symbol}</CardTitle>
                          <p className="text-[#A1A1AA]">{signal.name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-mono font-bold text-[#FAFAFA]">{signal.price}</p>
                        <p className={cn(
                          "text-sm font-mono",
                          signal.change.startsWith("+") ? "text-success" : "text-danger"
                        )}>
                          {signal.change}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Confidence */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-[#A1A1AA]">Model Confidence</span>
                        <span className="font-mono font-semibold text-teal">{signal.confidence}%</span>
                      </div>
                      <Progress value={signal.confidence} className="h-3 bg-[#27272A]" />
                    </div>

                    {/* Model Info */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg bg-[#0A0A0B] border border-[#27272A]">
                        <p className="text-xs text-[#71717A] mb-1">Signal Type</p>
                        <Badge className={cn(
                          "text-sm",
                          signal.direction === "LONG"
                            ? "bg-success/20 text-success border-success/30"
                            : "bg-danger/20 text-danger border-danger/30"
                        )}>
                          {signal.direction === "LONG" ? "BUY" : "SELL"}
                        </Badge>
                      </div>
                      <div className="p-4 rounded-lg bg-[#0A0A0B] border border-[#27272A]">
                        <p className="text-xs text-[#71717A] mb-1">ML Model</p>
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-violet" />
                          <span className="font-medium text-[#FAFAFA]">{signal.model}</span>
                        </div>
                      </div>
                    </div>

                    {/* Fake analysis */}
                    <div className="p-4 rounded-lg bg-[#0A0A0B] border border-[#27272A]">
                      <p className="text-xs text-[#71717A] mb-2">Key Indicators</p>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <p className="text-xs text-[#71717A]">RSI</p>
                          <p className="font-mono text-sm text-success">62.4</p>
                        </div>
                        <div>
                          <p className="text-xs text-[#71717A]">MACD</p>
                          <p className="font-mono text-sm text-success">Bullish</p>
                        </div>
                        <div>
                          <p className="text-xs text-[#71717A]">Volume</p>
                          <p className="font-mono text-sm text-teal">+24%</p>
                        </div>
                      </div>
                    </div>

                    {/* CTA */}
                    <Button className="w-full bg-teal hover:bg-teal/90 text-[#09090B] font-semibold" asChild>
                      <Link href="/auth/signup">
                        Get Real-Time Signals
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Notification Toast Demo */}
        <AnimatePresence>
          {showNotification && (
            <motion.div
              initial={{ opacity: 0, y: 50, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: 50, x: "-50%" }}
              className="fixed bottom-8 left-1/2 z-50"
            >
              <div className="flex items-center gap-3 px-4 py-3 bg-[#18181B] border border-teal/30 rounded-lg shadow-xl">
                <Bell className="h-5 w-5 text-teal animate-pulse" />
                <div>
                  <p className="text-sm font-medium text-[#FAFAFA]">New Signal: {demoSignals[selectedSignal].symbol}</p>
                  <p className="text-xs text-[#71717A]">{demoSignals[selectedSignal].direction} • {demoSignals[selectedSignal].confidence}% confidence</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
