"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Activity, Users, Signal, TrendingUp } from "lucide-react"

const baseStats = {
  signalsDelivered: 127482,
  activeTraders: 8742,
  avgWinRate: 73.2,
  totalProfit: 14.7, // millions
}

export function LiveStatsTicker() {
  const [stats, setStats] = useState(baseStats)
  const [lastUpdate, setLastUpdate] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        signalsDelivered: prev.signalsDelivered + Math.floor(Math.random() * 3),
        activeTraders: prev.activeTraders + (Math.random() > 0.7 ? 1 : 0),
        avgWinRate: 73.2 + (Math.random() - 0.5) * 0.2,
        totalProfit: prev.totalProfit + Math.random() * 0.001,
      }))
      setLastUpdate(new Date())
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const statItems = [
    {
      icon: Signal,
      label: "Signals Delivered",
      value: stats.signalsDelivered.toLocaleString(),
      color: "text-teal",
    },
    {
      icon: Users,
      label: "Active Traders",
      value: stats.activeTraders.toLocaleString(),
      color: "text-violet",
    },
    {
      icon: TrendingUp,
      label: "Avg Win Rate",
      value: `${stats.avgWinRate.toFixed(1)}%`,
      color: "text-success",
    },
    {
      icon: Activity,
      label: "Total Profit Generated",
      value: `$${stats.totalProfit.toFixed(1)}M+`,
      color: "text-warning",
    },
  ]

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
                <AnimatePresence mode="wait">
                  <motion.p
                    key={stat.value}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className={`font-mono font-bold text-lg ${stat.color}`}
                  >
                    {stat.value}
                  </motion.p>
                </AnimatePresence>
                <p className="text-xs text-[#71717A]">{stat.label}</p>
              </div>
            </motion.div>
          ))}
          
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
            </span>
            <span className="text-xs text-[#71717A]">
              Live • Updated {lastUpdate.toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
