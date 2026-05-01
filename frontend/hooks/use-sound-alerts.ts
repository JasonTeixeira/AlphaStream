"use client"

import { useCallback, useRef, useState } from "react"

interface SoundAlertSettings {
  enabled: boolean
  volume: number
  newSignal: boolean
  highConfidence: boolean
  priceAlert: boolean
}

const defaultSettings: SoundAlertSettings = {
  enabled: true,
  volume: 0.5,
  newSignal: true,
  highConfidence: true,
  priceAlert: false,
}

export function useSoundAlerts() {
  const [settings, setSettings] = useState<SoundAlertSettings>(defaultSettings)
  const audioContextRef = useRef<AudioContext | null>(null)

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    }
    return audioContextRef.current
  }, [])

  const playTone = useCallback(
    (frequency: number, duration: number, type: OscillatorType = "sine") => {
      if (!settings.enabled) return

      try {
        const audioContext = getAudioContext()
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)

        oscillator.type = type
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime)
        gainNode.gain.setValueAtTime(settings.volume, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration)

        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + duration)
      } catch (error) {
        console.error("Error playing sound:", error)
      }
    },
    [settings.enabled, settings.volume, getAudioContext]
  )

  const playNewSignalSound = useCallback(() => {
    if (!settings.newSignal) return
    // Rising two-tone chime
    playTone(880, 0.15, "sine")
    setTimeout(() => playTone(1174.66, 0.2, "sine"), 100)
  }, [settings.newSignal, playTone])

  const playHighConfidenceSound = useCallback(() => {
    if (!settings.highConfidence) return
    // Triple ascending chime
    playTone(523.25, 0.1, "sine")
    setTimeout(() => playTone(659.25, 0.1, "sine"), 100)
    setTimeout(() => playTone(783.99, 0.15, "sine"), 200)
  }, [settings.highConfidence, playTone])

  const playPriceAlertSound = useCallback(() => {
    if (!settings.priceAlert) return
    // Alert beep
    playTone(1000, 0.1, "square")
    setTimeout(() => playTone(1000, 0.1, "square"), 150)
  }, [settings.priceAlert, playTone])

  const playErrorSound = useCallback(() => {
    // Descending tone for errors
    playTone(400, 0.2, "sawtooth")
    setTimeout(() => playTone(300, 0.3, "sawtooth"), 150)
  }, [playTone])

  const updateSettings = useCallback((newSettings: Partial<SoundAlertSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }))
  }, [])

  return {
    settings,
    updateSettings,
    playNewSignalSound,
    playHighConfidenceSound,
    playPriceAlertSound,
    playErrorSound,
    playTone,
  }
}
