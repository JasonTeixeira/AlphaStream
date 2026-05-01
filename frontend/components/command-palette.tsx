"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { useAuth } from "@/contexts/auth-context"
import {
  LayoutDashboard,
  Signal,
  BarChart3,
  Key,
  Settings,
  Home,
  FileText,
  Search,
  TrendingUp,
  TrendingDown,
  LogOut,
  User,
  CreditCard,
  Bell,
  HelpCircle,
  Keyboard,
} from "lucide-react"

const pages = [
  { name: "Home", href: "/", icon: Home, group: "Navigation" },
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, group: "Navigation" },
  { name: "Signals", href: "/dashboard/signals", icon: Signal, group: "Navigation" },
  { name: "Backtester", href: "/dashboard/backtester", icon: BarChart3, group: "Navigation" },
  { name: "API Keys", href: "/dashboard/api-keys", icon: Key, group: "Navigation" },
  { name: "Settings", href: "/dashboard/settings", icon: Settings, group: "Navigation" },
  { name: "Documentation", href: "/docs", icon: FileText, group: "Navigation" },
]

const symbols = [
  { name: "NQ (Nasdaq Futures)", symbol: "NQ", icon: TrendingUp },
  { name: "ES (S&P 500 Futures)", symbol: "ES", icon: TrendingUp },
  { name: "CL (Crude Oil)", symbol: "CL", icon: TrendingDown },
  { name: "GC (Gold)", symbol: "GC", icon: TrendingUp },
  { name: "BTC (Bitcoin)", symbol: "BTC", icon: TrendingUp },
  { name: "ETH (Ethereum)", symbol: "ETH", icon: TrendingDown },
]

const actions = [
  { name: "Profile Settings", action: "profile", icon: User },
  { name: "Billing & Subscription", action: "billing", icon: CreditCard },
  { name: "Notification Preferences", action: "notifications", icon: Bell },
  { name: "Help & Support", action: "help", icon: HelpCircle },
  { name: "Keyboard Shortcuts", action: "shortcuts", icon: Keyboard },
]

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const { logout, isAuthenticated } = useAuth()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const runCommand = useCallback((command: () => void) => {
    setOpen(false)
    command()
  }, [])

  const handlePageSelect = (href: string) => {
    runCommand(() => router.push(href))
  }

  const handleSymbolSelect = (symbol: string) => {
    runCommand(() => router.push(`/dashboard/signals?symbol=${symbol}`))
  }

  const handleActionSelect = (action: string) => {
    runCommand(() => {
      switch (action) {
        case "profile":
          router.push("/dashboard/settings?tab=profile")
          break
        case "billing":
          router.push("/dashboard/settings?tab=subscription")
          break
        case "notifications":
          router.push("/dashboard/settings?tab=alerts")
          break
        case "help":
          window.open("/docs", "_blank")
          break
        case "shortcuts":
          // Could open a shortcuts modal
          break
        default:
          break
      }
    })
  }

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput 
        placeholder="Search pages, symbols, actions..." 
        className="border-0"
      />
      <CommandList>
        <CommandEmpty>
          <div className="py-6 text-center">
            <Search className="mx-auto h-8 w-8 text-[#71717A] mb-2" />
            <p className="text-sm text-[#A1A1AA]">No results found.</p>
            <p className="text-xs text-[#71717A] mt-1">Try searching for something else.</p>
          </div>
        </CommandEmpty>

        <CommandGroup heading="Pages">
          {pages.map((page) => (
            <CommandItem
              key={page.href}
              onSelect={() => handlePageSelect(page.href)}
              className="flex items-center gap-3 cursor-pointer"
            >
              <page.icon className="h-4 w-4 text-[#71717A]" />
              <span>{page.name}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Symbols">
          {symbols.map((symbol) => (
            <CommandItem
              key={symbol.symbol}
              onSelect={() => handleSymbolSelect(symbol.symbol)}
              className="flex items-center gap-3 cursor-pointer"
            >
              <symbol.icon className={`h-4 w-4 ${symbol.icon === TrendingUp ? "text-success" : "text-danger"}`} />
              <span>{symbol.name}</span>
              <span className="ml-auto text-xs text-[#71717A] font-mono">{symbol.symbol}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Quick Actions">
          {actions.map((action) => (
            <CommandItem
              key={action.action}
              onSelect={() => handleActionSelect(action.action)}
              className="flex items-center gap-3 cursor-pointer"
            >
              <action.icon className="h-4 w-4 text-[#71717A]" />
              <span>{action.name}</span>
            </CommandItem>
          ))}
          {isAuthenticated && (
            <CommandItem
              onSelect={() => runCommand(logout)}
              className="flex items-center gap-3 cursor-pointer text-danger"
            >
              <LogOut className="h-4 w-4" />
              <span>Log out</span>
            </CommandItem>
          )}
        </CommandGroup>
      </CommandList>
      
      {/* Footer */}
      <div className="border-t border-[#27272A] px-3 py-2 flex items-center justify-between text-xs text-[#71717A]">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-[#27272A] rounded text-[10px]">Enter</kbd>
            <span>to select</span>
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-[#27272A] rounded text-[10px]">Esc</kbd>
            <span>to close</span>
          </span>
        </div>
        <span className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 bg-[#27272A] rounded text-[10px]">Cmd</kbd>
          <span>+</span>
          <kbd className="px-1.5 py-0.5 bg-[#27272A] rounded text-[10px]">K</kbd>
        </span>
      </div>
    </CommandDialog>
  )
}
