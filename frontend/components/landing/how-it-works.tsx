"use client"

import { motion } from "framer-motion"
import { Database, Brain, Zap } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const steps = [
  {
    number: 1,
    icon: Database,
    title: "Data Ingestion",
    description:
      "We pull OHLCV data from multiple sources and compute 200+ technical indicators across timeframes.",
  },
  {
    number: 2,
    icon: Brain,
    title: "ML Analysis",
    description:
      "5 independent models analyze the feature space. Walk-forward validation ensures no overfitting.",
  },
  {
    number: 3,
    icon: Zap,
    title: "Signal Delivery",
    description:
      "Receive signals via dashboard, API, WebSocket, email, or SMS. Act on high-confidence opportunities.",
  },
]

export function HowItWorks() {
  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold text-[#FAFAFA] mb-4">How It Works</h2>
          <p className="text-[#A1A1AA] max-w-2xl mx-auto">
            From raw market data to actionable signals in three simple steps
          </p>
        </motion.div>

        <div className="relative">
          {/* Connection Line - Desktop */}
          <div className="hidden md:block absolute top-1/2 left-[16.67%] right-[16.67%] h-px border-t-2 border-dashed border-[#27272A] -translate-y-1/2" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="relative"
              >
                <Card className="bg-[#18181B] border-[#27272A] hover:border-teal/30 transition-all duration-300">
                  <CardContent className="p-8 text-center">
                    {/* Number Badge */}
                    <div className="relative mb-6">
                      <div className="mx-auto w-12 h-12 rounded-full bg-teal/10 border border-teal/30 flex items-center justify-center">
                        <span className="text-lg font-bold text-teal font-mono">{step.number}</span>
                      </div>
                    </div>

                    {/* Icon */}
                    <div className="mb-4 flex justify-center">
                      <step.icon className="h-8 w-8 text-[#A1A1AA]" />
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-semibold text-[#FAFAFA] mb-3">{step.title}</h3>
                    <p className="text-[#A1A1AA] text-sm leading-relaxed">{step.description}</p>
                  </CardContent>
                </Card>

                {/* Arrow for mobile */}
                {index < steps.length - 1 && (
                  <div className="md:hidden flex justify-center my-4">
                    <div className="w-px h-8 border-l-2 border-dashed border-[#27272A]" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
