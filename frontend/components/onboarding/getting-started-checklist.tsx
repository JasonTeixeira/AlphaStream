"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  Check,
  ChevronRight,
  X,
  TrendingUp,
  Bell,
  Key,
  BarChart3,
  Settings,
  Rocket,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface ChecklistItem {
  id: string
  title: string
  description: string
  href: string
  icon: React.ElementType
  completed: boolean
}

const defaultChecklist: ChecklistItem[] = [
  {
    id: "explore-signals",
    title: "Explore trading signals",
    description: "View real-time ML-generated trading signals",
    href: "/dashboard/signals",
    icon: TrendingUp,
    completed: false,
  },
  {
    id: "run-backtest",
    title: "Run your first backtest",
    description: "Test strategies on historical data",
    href: "/dashboard/backtester",
    icon: BarChart3,
    completed: false,
  },
  {
    id: "generate-api-key",
    title: "Generate an API key",
    description: "Connect signals to your trading system",
    href: "/dashboard/api-keys",
    icon: Key,
    completed: false,
  },
  {
    id: "configure-alerts",
    title: "Configure alerts",
    description: "Set up notifications for new signals",
    href: "/dashboard/settings?tab=alerts",
    icon: Bell,
    completed: false,
  },
  {
    id: "customize-settings",
    title: "Customize your preferences",
    description: "Personalize your trading experience",
    href: "/dashboard/settings",
    icon: Settings,
    completed: false,
  },
]

export function GettingStartedChecklist() {
  const [checklist, setChecklist] = useState<ChecklistItem[]>(defaultChecklist)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("alphastream_checklist")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setChecklist(parsed.items)
        setIsDismissed(parsed.dismissed)
      } catch {
        // Use default
      }
    }
  }, [])

  const saveChecklist = (items: ChecklistItem[], dismissed: boolean) => {
    localStorage.setItem("alphastream_checklist", JSON.stringify({ items, dismissed }))
  }

  const toggleItem = (id: string) => {
    const updated = checklist.map((item) =>
      item.id === id ? { ...item, completed: !item.completed } : item
    )
    setChecklist(updated)
    saveChecklist(updated, isDismissed)
  }

  const dismiss = () => {
    setIsDismissed(true)
    saveChecklist(checklist, true)
  }

  const completedCount = checklist.filter((item) => item.completed).length
  const progress = (completedCount / checklist.length) * 100
  const allCompleted = completedCount === checklist.length

  if (isDismissed) return null

  return (
    <Card className="bg-[#18181B] border-[#27272A]">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-teal/10 border border-teal/30 flex items-center justify-center">
              <Rocket className="h-5 w-5 text-teal" />
            </div>
            <div>
              <CardTitle className="text-[#FAFAFA]">Getting Started</CardTitle>
              <p className="text-sm text-[#A1A1AA] mt-0.5">
                {allCompleted 
                  ? "Congratulations! You've completed all steps."
                  : `${completedCount} of ${checklist.length} completed`
                }
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={dismiss}
            className="text-[#71717A] hover:text-[#FAFAFA] h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <Progress 
          value={progress} 
          className="h-1.5 mt-4 bg-[#27272A]"
        />
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          {checklist.map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.id}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg border transition-all",
                  item.completed
                    ? "bg-success/5 border-success/30"
                    : "bg-[#27272A]/30 border-[#27272A] hover:border-[#3F3F46]"
                )}
              >
                <button
                  onClick={() => toggleItem(item.id)}
                  className={cn(
                    "w-6 h-6 rounded-full border flex items-center justify-center shrink-0 transition-all",
                    item.completed
                      ? "bg-success border-success"
                      : "border-[#3F3F46] hover:border-teal"
                  )}
                >
                  {item.completed && <Check className="h-3.5 w-3.5 text-white" />}
                </button>
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    "text-sm font-medium",
                    item.completed ? "text-[#A1A1AA] line-through" : "text-[#FAFAFA]"
                  )}>
                    {item.title}
                  </p>
                  <p className="text-xs text-[#71717A] truncate">{item.description}</p>
                </div>
                <Link href={item.href}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[#71717A] hover:text-teal"
                  >
                    <Icon className="h-4 w-4 mr-1" />
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            )
          })}
        </div>
        
        {allCompleted && (
          <div className="mt-4 p-4 bg-success/10 border border-success/30 rounded-lg text-center">
            <p className="text-sm text-success font-medium">
              You&apos;re all set! Start trading with confidence.
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={dismiss}
              className="text-success/80 hover:text-success mt-2"
            >
              Dismiss checklist
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
