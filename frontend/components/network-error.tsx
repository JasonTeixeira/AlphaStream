"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { WifiOff, RefreshCw, X } from "lucide-react"
import { cn } from "@/lib/utils"

export function NetworkError() {
  const [isOffline, setIsOffline] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => {
      setIsOffline(true)
      setIsDismissed(false)
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // Check initial state
    setIsOffline(!navigator.onLine)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  if (!isOffline || isDismissed) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-danger/90 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <WifiOff className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">
                You&apos;re offline
              </p>
              <p className="text-xs text-white/80">
                Check your internet connection and try again.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => window.location.reload()}
              className="bg-white/20 hover:bg-white/30 text-white border-0"
            >
              <RefreshCw className="mr-2 h-3 w-3" />
              Retry
            </Button>
            <button
              onClick={() => setIsDismissed(true)}
              className="p-1 hover:bg-white/20 rounded transition-colors"
            >
              <X className="h-4 w-4 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

interface NetworkAwareProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function NetworkAware({ children, fallback }: NetworkAwareProps) {
  const [isOffline, setIsOffline] = useState(false)

  useEffect(() => {
    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)
    setIsOffline(!navigator.onLine)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  if (isOffline && fallback) {
    return <>{fallback}</>
  }

  return (
    <>
      {isOffline && (
        <div className={cn(
          "mb-4 p-3 bg-warning/10 border border-warning/30 rounded-lg",
          "flex items-center gap-3"
        )}>
          <WifiOff className="h-4 w-4 text-warning shrink-0" />
          <p className="text-sm text-warning">
            You&apos;re offline. Some features may be unavailable.
          </p>
        </div>
      )}
      {children}
    </>
  )
}
