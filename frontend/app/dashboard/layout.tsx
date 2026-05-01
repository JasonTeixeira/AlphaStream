"use client"

import { useState } from "react"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardMobileNav } from "@/components/dashboard/mobile-nav"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#09090B]">
        {/* Desktop Sidebar */}
        <DashboardSidebar 
          collapsed={sidebarCollapsed} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
        />
        
        {/* Mobile Navigation */}
        <DashboardMobileNav />
        
        {/* Main Content */}
        <main 
          className={`transition-all duration-300 ${
            sidebarCollapsed ? "md:ml-20" : "md:ml-60"
          } pt-16 md:pt-0`}
        >
          {children}
        </main>
      </div>
    </ProtectedRoute>
  )
}
