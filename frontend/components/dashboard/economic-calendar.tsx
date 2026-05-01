"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

const events = [
  {
    time: "08:30",
    event: "Non-Farm Payrolls",
    country: "USD",
    impact: "high",
    forecast: "180K",
    previous: "175K",
    actual: null,
  },
  {
    time: "10:00",
    event: "ISM Manufacturing PMI",
    country: "USD",
    impact: "high",
    forecast: "48.5",
    previous: "46.8",
    actual: "49.2",
  },
  {
    time: "14:00",
    event: "FOMC Meeting Minutes",
    country: "USD",
    impact: "high",
    forecast: null,
    previous: null,
    actual: null,
  },
  {
    time: "15:30",
    event: "Crude Oil Inventories",
    country: "USD",
    impact: "medium",
    forecast: "-2.1M",
    previous: "-3.4M",
    actual: null,
  },
]

const impactColors = {
  high: "bg-danger text-danger",
  medium: "bg-warning text-warning",
  low: "bg-success text-success",
}

export function EconomicCalendar() {
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'short', 
    day: 'numeric' 
  })

  return (
    <Card className="bg-[#18181B] border-[#27272A]">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-teal" />
            <CardTitle className="text-base text-[#FAFAFA]">Economic Calendar</CardTitle>
          </div>
          <span className="text-xs text-[#71717A]">{today}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {events.map((event, index) => (
          <div
            key={index}
            className="flex items-start gap-3 p-3 bg-[#0A0A0B] rounded-lg border border-[#27272A]"
          >
            <div className="flex flex-col items-center">
              <Clock className="h-4 w-4 text-[#71717A] mb-1" />
              <span className="text-xs font-mono text-[#A1A1AA]">{event.time}</span>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-[#FAFAFA] truncate">{event.event}</span>
                <Badge 
                  variant="outline" 
                  className={cn(
                    "text-xs border-0 bg-opacity-20",
                    impactColors[event.impact as keyof typeof impactColors]
                  )}
                >
                  {event.impact}
                </Badge>
              </div>
              
              <div className="flex items-center gap-4 text-xs">
                {event.forecast && (
                  <span className="text-[#71717A]">
                    Forecast: <span className="text-[#A1A1AA] font-mono">{event.forecast}</span>
                  </span>
                )}
                {event.previous && (
                  <span className="text-[#71717A]">
                    Previous: <span className="text-[#A1A1AA] font-mono">{event.previous}</span>
                  </span>
                )}
                {event.actual && (
                  <span className="text-[#71717A]">
                    Actual: <span className={cn(
                      "font-mono font-medium",
                      parseFloat(event.actual) > parseFloat(event.forecast || "0") 
                        ? "text-success" 
                        : "text-danger"
                    )}>{event.actual}</span>
                  </span>
                )}
              </div>
            </div>

            <Badge variant="outline" className="border-[#27272A] text-[#71717A] text-xs shrink-0">
              {event.country}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
