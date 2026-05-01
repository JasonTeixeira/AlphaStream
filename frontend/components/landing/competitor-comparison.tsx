"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, X, Minus, Crown, Trophy } from "lucide-react"
import { cn } from "@/lib/utils"

const features = [
  { name: "ML-Powered Signals", alphastream: true, competitorA: false, competitorB: "partial" },
  { name: "Walk-Forward Validation", alphastream: true, competitorA: false, competitorB: false },
  { name: "Real-Time API Access", alphastream: true, competitorA: true, competitorB: true },
  { name: "Backtesting Platform", alphastream: true, competitorA: false, competitorB: true },
  { name: "Multi-Asset Coverage", alphastream: true, competitorA: true, competitorB: "partial" },
  { name: "Telegram Integration", alphastream: true, competitorA: true, competitorB: false },
  { name: "TradingView Alerts", alphastream: true, competitorA: false, competitorB: true },
  { name: "Transparent Methodology", alphastream: true, competitorA: false, competitorB: false },
  { name: "Open Source Models", alphastream: true, competitorA: false, competitorB: false },
  { name: "No Lock-in Contract", alphastream: true, competitorA: false, competitorB: true },
]

const metrics = [
  { name: "Verified Win Rate", alphastream: "73%", competitorA: "Unknown", competitorB: "61%" },
  { name: "Avg Signal Latency", alphastream: "<50ms", competitorA: "2-5min", competitorB: "1-2min" },
  { name: "Price (Pro Plan)", alphastream: "$99/mo", competitorA: "$199/mo", competitorB: "$149/mo" },
  { name: "Free Trial", alphastream: "14 days", competitorA: "None", competitorB: "7 days" },
]

const FeatureCell = ({ value }: { value: boolean | string }) => {
  if (value === true) {
    return <Check className="h-5 w-5 text-success mx-auto" />
  }
  if (value === false) {
    return <X className="h-5 w-5 text-danger mx-auto" />
  }
  return <Minus className="h-5 w-5 text-warning mx-auto" />
}

export function CompetitorComparison() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0A0A0B]">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Badge className="mb-4 bg-warning/20 text-warning border-warning/30">
            <Trophy className="mr-1 h-3 w-3" />
            Comparison
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-[#FAFAFA] mb-4">
            How We Compare
          </h2>
          <p className="text-[#A1A1AA] max-w-xl mx-auto">
            See how AlphaStream stacks up against other signal providers in the market.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="bg-[#18181B] border-[#27272A] overflow-hidden">
            <CardContent className="p-0">
              {/* Header */}
              <div className="grid grid-cols-4 border-b border-[#27272A]">
                <div className="p-4 bg-[#0A0A0B]">
                  <p className="text-sm text-[#71717A]">Feature</p>
                </div>
                <div className="p-4 bg-teal/10 border-x border-teal/20">
                  <div className="flex items-center justify-center gap-2">
                    <Crown className="h-4 w-4 text-teal" />
                    <p className="font-semibold text-teal">AlphaStream</p>
                  </div>
                </div>
                <div className="p-4 bg-[#0A0A0B]">
                  <p className="text-center text-[#71717A]">Competitor A</p>
                </div>
                <div className="p-4 bg-[#0A0A0B]">
                  <p className="text-center text-[#71717A]">Competitor B</p>
                </div>
              </div>

              {/* Features */}
              {features.map((feature, index) => (
                <div
                  key={feature.name}
                  className={cn(
                    "grid grid-cols-4 border-b border-[#27272A]",
                    index % 2 === 0 ? "bg-[#18181B]" : "bg-[#0A0A0B]/50"
                  )}
                >
                  <div className="p-4">
                    <p className="text-sm text-[#FAFAFA]">{feature.name}</p>
                  </div>
                  <div className="p-4 bg-teal/5 border-x border-teal/10">
                    <FeatureCell value={feature.alphastream} />
                  </div>
                  <div className="p-4">
                    <FeatureCell value={feature.competitorA} />
                  </div>
                  <div className="p-4">
                    <FeatureCell value={feature.competitorB} />
                  </div>
                </div>
              ))}

              {/* Metrics header */}
              <div className="grid grid-cols-4 border-b border-[#27272A] bg-[#0A0A0B]">
                <div className="p-4" colSpan={4}>
                  <p className="text-sm font-semibold text-[#FAFAFA]">Key Metrics</p>
                </div>
              </div>

              {/* Metrics */}
              {metrics.map((metric, index) => (
                <div
                  key={metric.name}
                  className={cn(
                    "grid grid-cols-4 border-b border-[#27272A]",
                    index % 2 === 0 ? "bg-[#18181B]" : "bg-[#0A0A0B]/50"
                  )}
                >
                  <div className="p-4">
                    <p className="text-sm text-[#FAFAFA]">{metric.name}</p>
                  </div>
                  <div className="p-4 bg-teal/5 border-x border-teal/10">
                    <p className="text-center font-mono font-semibold text-teal">{metric.alphastream}</p>
                  </div>
                  <div className="p-4">
                    <p className="text-center font-mono text-[#71717A]">{metric.competitorA}</p>
                  </div>
                  <div className="p-4">
                    <p className="text-center font-mono text-[#71717A]">{metric.competitorB}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center text-xs text-[#71717A] mt-6"
        >
          Comparison based on publicly available information as of April 2025. Competitor names withheld.
        </motion.p>
      </div>
    </section>
  )
}
