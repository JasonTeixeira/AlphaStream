import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"

export function SignalsEmptyState() {
  return (
    <Card className="bg-[#18181B] border-[#27272A]">
      <CardContent className="py-16">
        <div className="flex flex-col items-center justify-center text-center">
          {/* Animated illustration */}
          <div className="relative mb-6">
            <div className="h-20 w-20 rounded-full bg-teal/10 flex items-center justify-center">
              <TrendingUp className="h-10 w-10 text-teal animate-pulse" />
            </div>
            {/* Orbiting dots */}
            <div className="absolute inset-0 animate-spin" style={{ animationDuration: "3s" }}>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 h-2 w-2 rounded-full bg-teal/50" />
            </div>
            <div className="absolute inset-0 animate-spin" style={{ animationDuration: "4s", animationDirection: "reverse" }}>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1 h-2 w-2 rounded-full bg-violet/50" />
            </div>
          </div>
          
          <h3 className="text-lg font-semibold text-[#FAFAFA] mb-2">No signals yet</h3>
          <p className="text-[#71717A] max-w-sm">
            Models are analyzing market data. New signals will appear here when high-confidence opportunities are detected.
          </p>
          
          {/* Subtle loading animation */}
          <div className="mt-6 flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-teal animate-bounce" style={{ animationDelay: "0ms" }} />
            <div className="h-2 w-2 rounded-full bg-teal animate-bounce" style={{ animationDelay: "150ms" }} />
            <div className="h-2 w-2 rounded-full bg-teal animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
