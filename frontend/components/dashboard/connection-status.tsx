"use client"

import { useRealtime } from "@/contexts/realtime-context"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Wifi, 
  WifiOff, 
  Loader2, 
  RefreshCw,
  CheckCircle2,
  AlertCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function ConnectionStatus() {
  const { connectionStatus, lastUpdate } = useRealtime()

  const statusConfig = {
    connecting: {
      icon: Loader2,
      color: "text-warning",
      bgColor: "bg-warning/20",
      label: "Connecting...",
      animate: true,
    },
    connected: {
      icon: Wifi,
      color: "text-success",
      bgColor: "bg-success/20",
      label: "Live",
      animate: false,
    },
    disconnected: {
      icon: WifiOff,
      color: "text-danger",
      bgColor: "bg-danger/20",
      label: "Disconnected",
      animate: false,
    },
    reconnecting: {
      icon: RefreshCw,
      color: "text-warning",
      bgColor: "bg-warning/20",
      label: "Reconnecting...",
      animate: true,
    },
  }

  const config = statusConfig[connectionStatus]
  const Icon = config.icon

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-full border transition-colors",
              config.bgColor,
              connectionStatus === "connected" 
                ? "border-success/30" 
                : connectionStatus === "disconnected"
                  ? "border-danger/30"
                  : "border-warning/30"
            )}
          >
            <Icon
              className={cn(
                "h-3.5 w-3.5",
                config.color,
                config.animate && "animate-spin"
              )}
            />
            <span className={cn("text-xs font-medium", config.color)}>
              {config.label}
            </span>
            {connectionStatus === "connected" && (
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
              </span>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="bg-[#18181B] border-[#27272A]">
          <div className="text-sm">
            <p className="font-medium text-[#FAFAFA]">Connection Status: {config.label}</p>
            {lastUpdate && (
              <p className="text-[#71717A] text-xs mt-1">
                Last update: {lastUpdate.toLocaleTimeString()}
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export function ConnectionStatusBanner() {
  const { connectionStatus } = useRealtime()

  return (
    <AnimatePresence>
      {connectionStatus !== "connected" && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className={cn(
            "overflow-hidden",
            connectionStatus === "disconnected" ? "bg-danger/10" : "bg-warning/10"
          )}
        >
          <div className="flex items-center justify-center gap-2 py-2 px-4">
            {connectionStatus === "connecting" && (
              <>
                <Loader2 className="h-4 w-4 text-warning animate-spin" />
                <span className="text-sm text-warning">Connecting to real-time server...</span>
              </>
            )}
            {connectionStatus === "reconnecting" && (
              <>
                <RefreshCw className="h-4 w-4 text-warning animate-spin" />
                <span className="text-sm text-warning">Connection lost. Reconnecting...</span>
              </>
            )}
            {connectionStatus === "disconnected" && (
              <>
                <AlertCircle className="h-4 w-4 text-danger" />
                <span className="text-sm text-danger">
                  Unable to connect. Data may be outdated.
                </span>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
