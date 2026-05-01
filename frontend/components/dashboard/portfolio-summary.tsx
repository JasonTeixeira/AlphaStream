import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, Target, Gauge, BarChart } from "lucide-react"

interface PortfolioSummaryProps {
  activeSignals?: number
  winRate?: number
  avgConfidence?: number
  signalsToday?: number
}

const defaultMetrics = {
  activeSignals: 8,
  winRate: 61.2,
  avgConfidence: 79.4,
  signalsToday: 14,
}

export function PortfolioSummary(props: PortfolioSummaryProps) {
  const activeSignals = props.activeSignals ?? defaultMetrics.activeSignals
  const winRate = props.winRate ?? defaultMetrics.winRate
  const avgConfidence = props.avgConfidence ?? defaultMetrics.avgConfidence
  const signalsToday = props.signalsToday ?? defaultMetrics.signalsToday

  const metrics = [
    {
      icon: TrendingUp,
      label: "Active Signals",
      value: String(activeSignals),
      change: null,
      changeType: "positive" as const,
    },
    {
      icon: Target,
      label: "Win Rate (30d)",
      value: `${winRate}%`,
      change: null,
      changeType: "positive" as const,
    },
    {
      icon: Gauge,
      label: "Avg Confidence",
      value: `${avgConfidence}%`,
      change: null,
      changeType: "neutral" as const,
    },
    {
      icon: BarChart,
      label: "Signals Today",
      value: String(signalsToday),
      change: null,
      changeType: "neutral" as const,
    },
  ]
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric) => (
        <Card key={metric.label} className="bg-[#18181B] border-[#27272A]">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <metric.icon className="h-5 w-5 text-teal" />
              {metric.change && (
                <span className="text-xs text-success font-medium">{metric.change}</span>
              )}
            </div>
            <div className="mt-3">
              <p className="text-2xl font-bold text-[#FAFAFA] font-mono">{metric.value}</p>
              <p className="text-sm text-[#71717A] mt-1">{metric.label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
