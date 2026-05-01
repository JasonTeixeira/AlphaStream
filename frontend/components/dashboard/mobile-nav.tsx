"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  LayoutDashboard,
  Signal,
  BarChart3,
  Key,
  Settings,
  Zap,
  Menu,
  Sparkles,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/signals", icon: Signal, label: "Signals" },
  { href: "/dashboard/backtester", icon: BarChart3, label: "Backtester" },
  { href: "/dashboard/api-keys", icon: Key, label: "API Keys" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
]

export function DashboardMobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="fixed top-0 left-0 right-0 h-16 bg-[#0A0A0B] border-b border-[#27272A] flex items-center justify-between px-4 md:hidden z-50">
      <Link href="/dashboard" className="flex items-center gap-2">
        <Zap className="h-6 w-6 text-teal" />
        <span className="font-bold text-[#FAFAFA]">AlphaStream</span>
      </Link>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="text-[#A1A1AA]">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 bg-[#0A0A0B] border-[#27272A] p-0">
          {/* Logo */}
          <div className="flex items-center gap-3 p-4 h-16 border-b border-[#27272A]">
            <Zap className="h-6 w-6 text-teal" />
            <span className="font-bold text-[#FAFAFA]">AlphaStream</span>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== "/dashboard" && pathname.startsWith(item.href))
              
              return (
                <Link 
                  key={item.href} 
                  href={item.href}
                  onClick={() => setOpen(false)}
                >
                  <div
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                      isActive
                        ? "bg-teal/10 text-teal"
                        : "text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-[#18181B]"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                </Link>
              )
            })}
          </nav>

          {/* User Section */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#27272A]">
            <div className="flex items-center gap-3 mb-4">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-[#27272A] text-teal">JT</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#FAFAFA] truncate">Jason T.</p>
                <Badge className="bg-violet/20 text-violet border-violet/30 text-xs">
                  Pro Plan
                </Badge>
              </div>
            </div>
            
            <Button className="w-full bg-violet hover:bg-violet/90 text-white">
              <Sparkles className="mr-2 h-4 w-4" />
              Upgrade
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
