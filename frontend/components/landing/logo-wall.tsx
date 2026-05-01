"use client"

import { motion } from "framer-motion"

const logos = [
  { name: "Bloomberg", width: 120 },
  { name: "Reuters", width: 100 },
  { name: "TradingView", width: 130 },
  { name: "Interactive Brokers", width: 140 },
  { name: "TD Ameritrade", width: 130 },
  { name: "Binance", width: 110 },
  { name: "Coinbase", width: 120 },
  { name: "MetaTrader", width: 120 },
]

export function LogoWall() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 border-y border-[#27272A] bg-[#0A0A0B]/50">
      <div className="mx-auto max-w-7xl">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-sm text-[#71717A] mb-8"
        >
          Integrates with leading trading platforms and data providers
        </motion.p>
        
        <div className="relative overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-12 flex-wrap"
          >
            {logos.map((logo, index) => (
              <motion.div
                key={logo.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="flex items-center justify-center h-12 px-4 grayscale hover:grayscale-0 opacity-50 hover:opacity-100 transition-all duration-300"
              >
                <span className="text-[#71717A] font-semibold text-lg tracking-wide">
                  {logo.name}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
