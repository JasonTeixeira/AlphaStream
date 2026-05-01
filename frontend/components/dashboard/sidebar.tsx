"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  LayoutDashboard,
  Signal,
  BarChart3,
  Key,
  Settings,
  Zap,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  LogOut,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { NotificationCenter } from "@/components/notifications/notification-center"

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/signals", icon: Signal, label: "Signals" },
  { href: "/dashboard/backtester", icon: BarChart3, label: "Backtester" },
  { href: "/dashboard/api-keys", icon: Key, label: "API Keys" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
]

interface DashboardSidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export function DashboardSidebar({ collapsed, onToggle }: DashboardSidebarProps) {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  
  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase()
    : "U"

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 bottom-0 z-40 hidden md:flex flex-col bg-[#0A0A0B] border-r border-[#27272A] transition-all duration-300",
        collapsed ? "w-20" : "w-60"
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between p-4 h-16 border-b border-[#27272A]">
        <div className="flex items-center gap-3">
          <Zap className="h-6 w-6 text-teal shrink-0" />
          {!collapsed && (
            <span className="font-bold text-[#FAFAFA] whitespace-nowrap">AlphaStream</span>
          )}
        </div>
        {!collapsed && <NotificationCenter />}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== "/dashboard" && pathname.startsWith(item.href))
          
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                  isActive
                    ? "bg-teal/10 text-teal"
                    : "text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-[#18181B]"
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
              </div>
            </Link>
          )
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-[#27272A]">
        {!collapsed ? (
          <div className="flex items-center gap-3 mb-4">
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-[#27272A] text-teal">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#FAFAFA] truncate">{user?.name || "User"}</p>
              <Badge className="bg-violet/20 text-violet border-violet/30 text-xs capitalize">
                {user?.plan || "Free"} Plan
              </Badge>
            </div>
          </div>
        ) : (
          <Avatar className="h-9 w-9 mx-auto mb-4">
            <AvatarFallback className="bg-[#27272A] text-teal">{initials}</AvatarFallback>
          </Avatar>
        )}
        
        <div className={cn("space-y-2", collapsed && "space-y-2")}>
          {user?.plan !== "enterprise" && (
            <Button
              className={cn(
                "bg-violet hover:bg-violet/90 text-white",
                collapsed ? "w-full px-2" : "w-full"
              )}
              size={collapsed ? "icon" : "default"}
            >
              {collapsed ? <Sparkles className="h-4 w-4" /> : "Upgrade"}
            </Button>
          )}
          
          <Button
            variant="ghost"
            onClick={logout}
            className={cn(
              "text-[#A1A1AA] hover:text-danger hover:bg-danger/10",
              collapsed ? "w-full px-2" : "w-full justify-start"
            )}
            size={collapsed ? "icon" : "default"}
          >
            <LogOut className={cn("h-4 w-4", !collapsed && "mr-2")} />
            {!collapsed && "Logout"}
          </Button>
        </div>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={onToggle}
        className="absolute top-20 -right-3 w-6 h-6 rounded-full bg-[#18181B] border border-[#27272A] flex items-center justify-center text-[#A1A1AA] hover:text-[#FAFAFA] hover:border-[#3F3F46] transition-colors"
      >
        {collapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </button>
    </aside>
  )
}
