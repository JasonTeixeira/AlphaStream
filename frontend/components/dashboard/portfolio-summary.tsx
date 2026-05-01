import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, Target, Gauge, BarChart } from "lucide-react"

const metrics = [
  {
    icon: TrendingUp,
    label: "Active Signals",
    value: "8",
    change: "+3 today",
    changeType: "positive" as const,
  },
  {
    icon: Target,
    label: "Win Rate (30d)",
    value: "61.2%",
    change: null,
    changeType: "positive" as const,
  },
  {
    icon: Gauge,
    label: "Avg Confidence",
    value: "79.4%",
    change: null,
    changeType: "neutral" as const,
  },
  {
    icon: BarChart,
    label: "Signals Today",
    value: "14",
    change: null,
    changeType: "neutral" as const,
  },
]

export function PortfolioSummary() {
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
