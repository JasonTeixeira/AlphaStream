"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Bell, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  Settings,
  Check,
  ExternalLink
} from "lucide-react"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"

interface Notification {
  id: string
  type: "signal" | "alert" | "success" | "info" | "warning"
  title: string
  message: string
  timestamp: Date
  read: boolean
  href?: string
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "signal",
    title: "New BUY Signal: NQ",
    message: "XGBoost Ensemble generated a high-confidence BUY signal for NQ with 87% confidence.",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    read: false,
    href: "/dashboard/signals",
  },
  {
    id: "2",
    type: "alert",
    title: "Stop Loss Triggered",
    message: "Your ES position hit the stop loss at 4,520.25.",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    read: false,
    href: "/dashboard",
  },
  {
    id: "3",
    type: "success",
    title: "Backtest Complete",
    message: "Your NQ backtest finished with +47.2% total return.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    read: true,
    href: "/dashboard/backtester",
  },
  {
    id: "4",
    type: "info",
    title: "Model Retrained",
    message: "LSTM model has been retrained with the latest market data.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
    read: true,
  },
  {
    id: "5",
    type: "warning",
    title: "API Rate Limit",
    message: "You're approaching your hourly API rate limit (850/1000).",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8),
    read: true,
    href: "/dashboard/api-keys",
  },
]

const typeConfig = {
  signal: { icon: TrendingUp, color: "text-teal", bg: "bg-teal/10" },
  alert: { icon: TrendingDown, color: "text-danger", bg: "bg-danger/10" },
  success: { icon: CheckCircle, color: "text-success", bg: "bg-success/10" },
  info: { icon: Info, color: "text-[#A1A1AA]", bg: "bg-[#27272A]" },
  warning: { icon: AlertTriangle, color: "text-warning", bg: "bg-warning/10" },
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [open, setOpen] = useState(false)

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-[#27272A]"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal opacity-75" />
              <span className="relative flex h-4 w-4 items-center justify-center rounded-full bg-teal text-[10px] font-bold text-[#09090B]">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-96 p-0 bg-[#18181B] border-[#27272A]" 
        align="end"
        sideOffset={8}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#27272A]">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-[#FAFAFA]">Notifications</h3>
            {unreadCount > 0 && (
              <Badge className="bg-teal/20 text-teal border-teal/30 text-xs">
                {unreadCount} new
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-xs text-[#A1A1AA] hover:text-[#FAFAFA] h-7"
              >
                <Check className="mr-1 h-3 w-3" />
                Mark all read
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-[#A1A1AA] hover:text-[#FAFAFA]"
              asChild
            >
              <Link href="/dashboard/settings?tab=alerts">
                <Settings className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Notifications List */}
        <ScrollArea className="h-[400px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-12 h-12 rounded-full bg-[#27272A] flex items-center justify-center mb-3">
                <Bell className="h-6 w-6 text-[#71717A]" />
              </div>
              <p className="text-sm text-[#A1A1AA]">No notifications yet</p>
              <p className="text-xs text-[#71717A] mt-1">
                We&apos;ll notify you when something important happens.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#27272A]">
              {notifications.map((notification) => {
                const config = typeConfig[notification.type]
                const Icon = config.icon

                return (
                  <div
                    key={notification.id}
                    className={cn(
                      "p-4 hover:bg-[#27272A]/50 transition-colors cursor-pointer",
                      !notification.read && "bg-teal/5"
                    )}
                    onClick={() => {
                      markAsRead(notification.id)
                      if (notification.href) {
                        setOpen(false)
                      }
                    }}
                  >
                    {notification.href ? (
                      <Link href={notification.href} className="block">
                        <NotificationContent 
                          notification={notification} 
                          config={config} 
                          Icon={Icon} 
                        />
                      </Link>
                    ) : (
                      <NotificationContent 
                        notification={notification} 
                        config={config} 
                        Icon={Icon} 
                      />
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        <div className="p-3 border-t border-[#27272A]">
          <Button
            variant="ghost"
            className="w-full text-sm text-[#A1A1AA] hover:text-[#FAFAFA]"
            asChild
          >
            <Link href="/dashboard/notifications">
              View all notifications
              <ExternalLink className="ml-2 h-3 w-3" />
            </Link>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

function NotificationContent({
  notification,
  config,
  Icon,
}: {
  notification: Notification
  config: { icon: React.ElementType; color: string; bg: string }
  Icon: React.ElementType
}) {
  return (
    <div className="flex gap-3">
      <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0", config.bg)}>
        <Icon className={cn("h-4 w-4", config.color)} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={cn(
            "text-sm font-medium",
            notification.read ? "text-[#A1A1AA]" : "text-[#FAFAFA]"
          )}>
            {notification.title}
          </p>
          {!notification.read && (
            <span className="w-2 h-2 rounded-full bg-teal shrink-0 mt-1.5" />
          )}
        </div>
        <p className="text-xs text-[#71717A] mt-0.5 line-clamp-2">
          {notification.message}
        </p>
        <p className="text-xs text-[#3F3F46] mt-1">
          {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
        </p>
      </div>
    </div>
  )
}
