"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Bell, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  Check,
  Trash2,
  Filter
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
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "signal",
    title: "New BUY Signal: NQ",
    message: "XGBoost Ensemble generated a high-confidence BUY signal for NQ with 87% confidence.",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    read: false,
  },
  {
    id: "2",
    type: "alert",
    title: "Stop Loss Triggered",
    message: "Your ES position hit the stop loss at 4,520.25. The position has been closed automatically.",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    read: false,
  },
  {
    id: "3",
    type: "success",
    title: "Backtest Complete",
    message: "Your NQ backtest finished with +47.2% total return over the test period.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    read: true,
  },
  {
    id: "4",
    type: "info",
    title: "Model Retrained",
    message: "LSTM model has been retrained with the latest market data. Performance metrics have been updated.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
    read: true,
  },
  {
    id: "5",
    type: "warning",
    title: "API Rate Limit Warning",
    message: "You're approaching your hourly API rate limit (850/1000). Consider upgrading your plan.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8),
    read: true,
  },
  {
    id: "6",
    type: "signal",
    title: "New SELL Signal: ES",
    message: "LightGBM model detected a SELL opportunity for ES with 82% confidence.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12),
    read: true,
  },
  {
    id: "7",
    type: "success",
    title: "Weekly Report Ready",
    message: "Your weekly performance report is ready. View your trading summary and metrics.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    read: true,
  },
]

const typeConfig = {
  signal: { icon: TrendingUp, color: "text-teal", bg: "bg-teal/10", label: "Signal" },
  alert: { icon: TrendingDown, color: "text-danger", bg: "bg-danger/10", label: "Alert" },
  success: { icon: CheckCircle, color: "text-success", bg: "bg-success/10", label: "Success" },
  info: { icon: Info, color: "text-[#A1A1AA]", bg: "bg-[#27272A]", label: "Info" },
  warning: { icon: AlertTriangle, color: "text-warning", bg: "bg-warning/10", label: "Warning" },
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [filter, setFilter] = useState<string>("all")

  const unreadCount = notifications.filter((n) => !n.read).length

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "all") return true
    if (filter === "unread") return !n.read
    return n.type === filter
  })

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id))
  }

  const clearAll = () => {
    setNotifications([])
  }

  return (
    <div className="min-h-screen bg-[#09090B]">
      {/* Header */}
      <div className="border-b border-[#27272A] bg-[#09090B]/80 backdrop-blur-lg">
        <div className="px-4 md:px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#FAFAFA]">Notifications</h1>
              <p className="text-[#A1A1AA] mt-1">
                {unreadCount > 0 
                  ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
                  : "You're all caught up!"
                }
              </p>
            </div>
            <div className="flex items-center gap-3">
              {unreadCount > 0 && (
                <Button
                  variant="outline"
                  onClick={markAllAsRead}
                  className="border-[#27272A] text-[#A1A1AA] hover:text-[#FAFAFA]"
                >
                  <Check className="mr-2 h-4 w-4" />
                  Mark all as read
                </Button>
              )}
              <Button
                variant="outline"
                onClick={clearAll}
                className="border-[#27272A] text-danger hover:text-danger hover:bg-danger/10"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Clear all
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="px-4 md:px-6 py-4 border-b border-[#27272A]">
        <div className="flex items-center gap-3">
          <Filter className="h-4 w-4 text-[#71717A]" />
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-40 bg-[#18181B] border-[#27272A] text-[#FAFAFA]">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent className="bg-[#18181B] border-[#27272A]">
              <SelectItem value="all">All notifications</SelectItem>
              <SelectItem value="unread">Unread only</SelectItem>
              <SelectItem value="signal">Signals</SelectItem>
              <SelectItem value="alert">Alerts</SelectItem>
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="warning">Warnings</SelectItem>
              <SelectItem value="info">Info</SelectItem>
            </SelectContent>
          </Select>
          <Badge className="bg-[#27272A] text-[#A1A1AA] border-0">
            {filteredNotifications.length} notification{filteredNotifications.length !== 1 ? "s" : ""}
          </Badge>
        </div>
      </div>

      {/* Notifications List */}
      <div className="p-4 md:p-6">
        {filteredNotifications.length === 0 ? (
          <Card className="bg-[#18181B] border-[#27272A]">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 rounded-full bg-[#27272A] flex items-center justify-center mb-4">
                <Bell className="h-8 w-8 text-[#71717A]" />
              </div>
              <h3 className="text-lg font-semibold text-[#FAFAFA] mb-2">No notifications</h3>
              <p className="text-sm text-[#A1A1AA] text-center max-w-sm">
                {filter === "all" 
                  ? "You don't have any notifications yet. We'll notify you when something important happens."
                  : `No ${filter} notifications found.`
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => {
              const config = typeConfig[notification.type]
              const Icon = config.icon

              return (
                <Card 
                  key={notification.id}
                  className={cn(
                    "bg-[#18181B] border-[#27272A] hover:border-[#3F3F46] transition-colors",
                    !notification.read && "border-l-2 border-l-teal"
                  )}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0", config.bg)}>
                        <Icon className={cn("h-5 w-5", config.color)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className={cn(
                                "font-medium",
                                notification.read ? "text-[#A1A1AA]" : "text-[#FAFAFA]"
                              )}>
                                {notification.title}
                              </h3>
                              {!notification.read && (
                                <Badge className="bg-teal/20 text-teal border-teal/30 text-xs">New</Badge>
                              )}
                            </div>
                            <p className="text-sm text-[#71717A] mt-1">
                              {notification.message}
                            </p>
                            <div className="flex items-center gap-3 mt-2">
                              <Badge variant="outline" className="border-[#27272A] text-[#71717A] text-xs">
                                {config.label}
                              </Badge>
                              <span className="text-xs text-[#3F3F46]">
                                {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markAsRead(notification.id)}
                                className="text-[#A1A1AA] hover:text-[#FAFAFA]"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteNotification(notification.id)}
                              className="text-[#A1A1AA] hover:text-danger"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
