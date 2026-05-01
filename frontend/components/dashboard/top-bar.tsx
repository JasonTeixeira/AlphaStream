"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Bell } from "lucide-react"
import { cn } from "@/lib/utils"

const timeframes = ["1D", "1W", "1M", "3M"]

export function DashboardTopBar() {
  const [activeTimeframe, setActiveTimeframe] = useState("1D")
  const [isConnected] = useState(true)

  return (
    <div className="sticky top-0 z-30 bg-[#09090B]/80 backdrop-blur-lg border-b border-[#27272A]">
      <div className="flex items-center justify-between px-4 md:px-6 h-16">
        {/* Page Title */}
        <h1 className="text-xl font-bold text-[#FAFAFA]">Dashboard</h1>

        {/* Center - Connection Status */}
        <div className="hidden md:flex items-center gap-2">
          <span className={cn(
            "relative flex h-2 w-2",
          )}>
            <span className={cn(
              "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
              isConnected ? "bg-success" : "bg-danger"
            )}></span>
            <span className={cn(
              "relative inline-flex rounded-full h-2 w-2",
              isConnected ? "bg-success" : "bg-danger"
            )}></span>
          </span>
          <span className="text-sm text-[#A1A1AA]">
            {isConnected ? "Connected" : "Disconnected"}
          </span>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {/* Timeframe Selector */}
          <div className="hidden sm:flex items-center bg-[#18181B] rounded-lg p-1">
            {timeframes.map((tf) => (
              <button
                key={tf}
                onClick={() => setActiveTimeframe(tf)}
                className={cn(
                  "px-3 py-1 text-sm font-medium rounded-md transition-colors",
                  activeTimeframe === tf
                    ? "bg-teal text-[#09090B]"
                    : "text-[#A1A1AA] hover:text-[#FAFAFA]"
                )}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative text-[#A1A1AA] hover:text-[#FAFAFA]">
            <Bell className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-danger text-white text-xs">
              3
            </Badge>
          </Button>

          {/* User Avatar */}
          <Avatar className="h-8 w-8 hidden md:flex">
            <AvatarFallback className="bg-[#27272A] text-teal text-sm">JT</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  )
}
