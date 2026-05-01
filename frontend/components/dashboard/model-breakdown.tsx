import { Card, CardContent } from "@/components/ui/card"

const models = [
  { name: "XGBoost", accuracy: 74.2, signals: 12, retrained: "Apr 28" },
  { name: "LightGBM", accuracy: 72.8, signals: 14, retrained: "Apr 28" },
  { name: "LSTM", accuracy: 71.5, signals: 8, retrained: "Apr 27" },
  { name: "RandomForest", accuracy: 69.3, signals: 15, retrained: "Apr 28" },
  { name: "Ensemble", accuracy: 73.1, signals: 10, retrained: "Apr 28" },
]

function CircularProgress({ value, size = 60 }: { value: number; size?: number }) {
  const strokeWidth = 4
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (value / 100) * circumference

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#27272A"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#06B6D4"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-500"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-bold text-teal font-mono">{value}%</span>
      </div>
    </div>
  )
}

export function ModelBreakdown() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {models.map((model) => (
        <Card key={model.name} className="bg-[#18181B] border-[#27272A]">
          <CardContent className="p-4 text-center">
            <h3 className="font-semibold text-[#FAFAFA] mb-3">{model.name}</h3>
            <div className="flex justify-center mb-3">
              <CircularProgress value={model.accuracy} />
            </div>
            <p className="text-sm text-[#A1A1AA]">{model.signals} signals today</p>
            <p className="text-xs text-[#71717A] mt-1">Retrained: {model.retrained}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
