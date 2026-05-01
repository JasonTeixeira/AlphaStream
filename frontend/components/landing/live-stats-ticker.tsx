"use client"

import { motion } from "framer-motion"
import { Activity, Layers, Signal, TrendingUp } from "lucide-react"

const statItems = [
  {
    icon: Signal,
    label: "Markets Tracked",
    value: "7",
    color: "text-teal",
  },
  {
    icon: Layers,
    label: "ML Models Active",
    value: "28",
    color: "text-violet",
  },
  {
    icon: TrendingUp,
    label: "Technical Features",
    value: "45",
    color: "text-success",
  },
  {
    icon: Activity,
    label: "Model Types",
    value: "4",
    color: "text-warning",
  },
]

export function LiveStatsTicker() {
  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 bg-[#18181B]/50 border-y border-[#27272A]">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between flex-wrap gap-6">
          {statItems.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="flex items-center gap-3"
            >
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
              <div>
                <p className={`font-mono font-bold text-lg ${stat.color}`}>
                  {stat.value}
                </p>
                <p className="text-xs text-[#71717A]">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
