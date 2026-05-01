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
import { api, type Signal, type HealthStatus } from "@/lib/api"

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [signals, setSignals] = useState<Signal[]>([])
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetchData() {
      try {
        const [health, signalsData] = await Promise.all([
          api.health(),
          api.getSignals(),
        ])
        if (!cancelled) {
          setHealthStatus(health)
          setSignals(signalsData)
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    fetchData()
    return () => { cancelled = true }
  }, [])

  if (isLoading) {
    return <DashboardSkeleton />
  }

  return (
    <div className="min-h-screen bg-[#09090B]">
      <DashboardTopBar />
      
      <div className="p-4 md:p-6 space-y-6">
        <GettingStartedChecklist />
        <PortfolioSummary
          activeSignals={signals.length}
          avgConfidence={signals.length > 0 ? Math.round(signals.reduce((sum, s) => sum + s.confidence, 0) / signals.length * 10) / 10 : undefined}
        />
        <SignalFilters />
        <SignalsTable signals={signals} />
        
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
