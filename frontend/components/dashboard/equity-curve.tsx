"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts"
import { cn } from "@/lib/utils"

const timeframes = ["1W", "1M", "3M", "1Y", "All"]

// Seeded random for consistent SSR/client rendering
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

function generateData() {
  const data = []
  let strategy = 100
  let benchmark = 100

  for (let i = 90; i >= 0; i--) {
    const date = new Date(2026, 3, 30)
    date.setDate(date.getDate() - i)

    strategy *= 1 + (seededRandom(i * 7 + 1) * 0.04 - 0.015)
    benchmark *= 1 + (seededRandom(i * 7 + 2) * 0.02 - 0.008)

    data.push({
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      strategy: Math.round(strategy * 10) / 10,
      benchmark: Math.round(benchmark * 10) / 10,
    })
  }
  return data
}

const stats = [
  { label: "Total Return", value: "+18.4%", color: "text-success" },
  { label: "Max Drawdown", value: "-6.2%", color: "text-danger" },
  { label: "Sharpe", value: "1.72", color: "text-teal" },
  { label: "Best Day", value: "+3.1%", color: "text-success" },
  { label: "Worst Day", value: "-1.8%", color: "text-danger" },
]

export function EquityCurve() {
  const [activeTimeframe, setActiveTimeframe] = useState("3M")
  const data = useMemo(() => generateData(), [])

  return (
    <Card className="bg-[#18181B] border-[#27272A]">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg text-[#FAFAFA]">Strategy Performance</CardTitle>
        <div className="flex items-center bg-[#0A0A0B] rounded-lg p-1">
          {timeframes.map((tf) => (
            <button
              key={tf}
              onClick={() => setActiveTimeframe(tf)}
              className={cn(
                "px-3 py-1 text-xs font-medium rounded-md transition-colors",
                activeTimeframe === tf
                  ? "bg-teal text-[#09090B]"
                  : "text-[#A1A1AA] hover:text-[#FAFAFA]"
              )}
            >
              {tf}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="strategyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272A" />
              <XAxis 
                dataKey="date" 
                stroke="#71717A" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#71717A" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#18181B",
                  border: "1px solid #27272A",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "#FAFAFA" }}
                itemStyle={{ color: "#A1A1AA" }}
              />
              <ReferenceLine y={100} stroke="#27272A" strokeDasharray="3 3" />
              <Area
                type="monotone"
                dataKey="benchmark"
                stroke="#71717A"
                strokeDasharray="5 5"
                fillOpacity={0}
                name="Benchmark"
              />
              <Area
                type="monotone"
                dataKey="strategy"
                stroke="#06B6D4"
                fill="url(#strategyGradient)"
                strokeWidth={2}
                name="AlphaStream"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Stats Row */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-5 gap-4 pt-4 border-t border-[#27272A]">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className={cn("text-lg font-bold font-mono", stat.color)}>{stat.value}</p>
              <p className="text-xs text-[#71717A]">{stat.label}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
