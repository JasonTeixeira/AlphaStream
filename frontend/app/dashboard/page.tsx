"use client"

import { useState, useEffect } from "react"
import { DashboardTopBar } from "@/components/dashboard/top-bar"
import { PortfolioSummary } from "@/components/dashboard/portfolio-summary"
import { SignalFilters } from "@/components/dashboard/signal-filters"
import { SignalsTable } from "@/components/dashboard/signals-table"
import { EquityCurve } from "@/components/dashboard/equity-curve"
import { ModelBreakdown } from "@/components/dashboard/model-breakdown"
import { ActivityFeed } from "@/components/dashboard/activity-feed"
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton"
import { GettingStartedChecklist } from "@/components/onboarding/getting-started-checklist"

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate initial data loading
    const timer = setTimeout(() => setIsLoading(false), 1500)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <DashboardSkeleton />
  }

  return (
    <div className="min-h-screen bg-[#09090B]">
      <DashboardTopBar />
      
      <div className="p-4 md:p-6 space-y-6">
        <GettingStartedChecklist />
        <PortfolioSummary />
        <SignalFilters />
        <SignalsTable />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <EquityCurve />
          </div>
          <div>
            <ActivityFeed />
          </div>
        </div>
        
        <ModelBreakdown />
      </div>
    </div>
  )
}
