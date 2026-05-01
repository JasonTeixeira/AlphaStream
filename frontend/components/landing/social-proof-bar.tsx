import { Database, Brain, Target, Shield } from "lucide-react"

const stats = [
  { icon: Database, label: "200+ Indicators", color: "text-teal" },
  { icon: Brain, label: "5 ML Models", color: "text-violet" },
  { icon: Target, label: "73% Accuracy", color: "text-success" },
  { icon: Shield, label: "Walk-Forward Validated", color: "text-warning" },
]

export function SocialProofBar() {
  return (
    <section className="py-12 border-y border-[#27272A] bg-[#0A0A0B]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="flex items-center justify-center gap-3">
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
              <span className="text-sm font-medium text-[#A1A1AA]">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
