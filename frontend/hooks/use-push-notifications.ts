"use client"

import { useState, useEffect, useCallback } from "react"

interface PushNotificationState {
  isSupported: boolean
  permission: NotificationPermission
  isSubscribed: boolean
}

export function usePushNotifications() {
  const [state, setState] = useState<PushNotificationState>({
    isSupported: false,
    permission: "default",
    isSubscribed: false,
  })

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setState((prev) => ({
        ...prev,
        isSupported: true,
        permission: Notification.permission,
      }))
    }
  }, [])

  const requestPermission = useCallback(async () => {
    if (!state.isSupported) return false

    try {
      const permission = await Notification.requestPermission()
      setState((prev) => ({ ...prev, permission }))
      return permission === "granted"
    } catch (error) {
      console.error("Error requesting notification permission:", error)
      return false
    }
  }, [state.isSupported])

  const sendNotification = useCallback(
    (title: string, options?: NotificationOptions) => {
      if (!state.isSupported || state.permission !== "granted") {
        console.warn("Notifications not available or not permitted")
        return null
      }

      try {
        const notification = new Notification(title, {
          icon: "/icon-192.png",
          badge: "/icon-72.png",
          ...options,
        })

        notification.onclick = () => {
          window.focus()
          notification.close()
        }

        return notification
      } catch (error) {
        console.error("Error sending notification:", error)
        return null
      }
    },
    [state.isSupported, state.permission]
  )

  const sendSignalNotification = useCallback(
    (signal: {
      symbol: string
      direction: "LONG" | "SHORT"
      confidence: number
      entryPrice: number
    }) => {
      return sendNotification(`New ${signal.direction} Signal: ${signal.symbol}`, {
        body: `Confidence: ${signal.confidence}% | Entry: ${signal.entryPrice}`,
        tag: `signal-${signal.symbol}-${Date.now()}`,
        requireInteraction: true,
        silent: false,
      })
    },
    [sendNotification]
  )

  return {
    ...state,
    requestPermission,
    sendNotification,
    sendSignalNotification,
  }
}
