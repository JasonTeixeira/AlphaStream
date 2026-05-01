import { DashboardTopBar } from "@/components/dashboard/top-bar"
import { SignalFilters } from "@/components/dashboard/signal-filters"
import { SignalsTable } from "@/components/dashboard/signals-table"

export default function SignalsPage() {
  return (
    <div className="min-h-screen bg-[#09090B]">
      <div className="border-b border-[#27272A] bg-[#09090B]/80 backdrop-blur-lg">
        <div className="px-4 md:px-6 py-6">
          <h1 className="text-2xl font-bold text-[#FAFAFA]">All Signals</h1>
          <p className="text-[#A1A1AA] mt-1">View and filter all trading signals</p>
        </div>
      </div>
      
      <div className="p-4 md:p-6 space-y-6">
        <SignalFilters />
        <SignalsTable />
      </div>
    </div>
  )
}
