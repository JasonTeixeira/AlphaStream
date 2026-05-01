"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Cpu } from "lucide-react"
import { cn } from "@/lib/utils"

const features = [
  {
    title: "Walk-Forward Validated ML",
    description: "AlphaStream's ML models analyze futures markets using walk-forward validated XGBoost and LightGBM ensemble predictions. No look-ahead bias, no overfitting to historical data.",
    highlights: ["XGBoost", "LightGBM", "Walk-Forward Validation"],
  },
  {
    title: "45 Technical Features per Symbol",
    description: "Each prediction is built from 45 engineered features including momentum oscillators, volume profile metrics, volatility measures, and multi-timeframe trend indicators.",
    highlights: ["Momentum", "Volume Profile", "Volatility", "Multi-Timeframe"],
  },
  {
    title: "7 Futures Markets Covered",
    description: "Signals generated for ES, NQ, CL, GC, BTC, ETH, and RTY futures contracts. Each market has independently trained models tuned to its unique characteristics.",
    highlights: ["ES", "NQ", "CL", "GC", "BTC", "ETH", "RTY"],
  },
]

export function TestimonialsEnhanced() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0A0A0B]">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge className="mb-4 bg-teal/20 text-teal border-teal/30">
            <Cpu className="mr-1 h-3 w-3" />
            Methodology
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-[#FAFAFA] mb-4">
            How It Works
          </h2>
          <p className="text-[#A1A1AA] max-w-2xl mx-auto">
            Transparent ML methodology built on sound quantitative principles.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="bg-[#18181B] border-[#27272A] hover:border-teal/30 transition-all h-full">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-[#FAFAFA] mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-[#A1A1AA] text-sm mb-4">
                    {feature.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {feature.highlights.map((tag) => (
                      <Badge
                        key={tag}
                        className="bg-teal/10 text-teal border-teal/20 text-xs"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
