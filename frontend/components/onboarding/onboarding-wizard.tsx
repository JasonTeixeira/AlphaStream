"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/auth-context"
import {
  Activity,
  TrendingUp,
  Bell,
  Key,
  ChevronRight,
  ChevronLeft,
  Check,
  Sparkles,
} from "lucide-react"
import { cn } from "@/lib/utils"

const symbols = [
  { id: "nq", name: "NQ", fullName: "Nasdaq Futures" },
  { id: "es", name: "ES", fullName: "S&P 500 Futures" },
  { id: "cl", name: "CL", fullName: "Crude Oil" },
  { id: "gc", name: "GC", fullName: "Gold" },
  { id: "btc", name: "BTC", fullName: "Bitcoin" },
  { id: "eth", name: "ETH", fullName: "Ethereum" },
]

const notificationPrefs = [
  { id: "email", label: "Email notifications", description: "Receive signal alerts via email" },
  { id: "sms", label: "SMS notifications", description: "Get critical alerts via text" },
  { id: "webhook", label: "Webhook integration", description: "Push signals to your trading system" },
  { id: "daily", label: "Daily digest", description: "Summary of all signals each day" },
]

export function OnboardingWizard() {
  const { user, isAuthenticated } = useAuth()
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(0)
  const [selectedSymbols, setSelectedSymbols] = useState<string[]>(["nq", "es"])
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>(["email"])
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(true)

  useEffect(() => {
    if (isAuthenticated) {
      const completed = localStorage.getItem("alphastream_onboarding_complete")
      if (!completed) {
        setHasCompletedOnboarding(false)
        setOpen(true)
      }
    }
  }, [isAuthenticated])

  const completeOnboarding = () => {
    localStorage.setItem("alphastream_onboarding_complete", "true")
    setHasCompletedOnboarding(true)
    setOpen(false)
  }

  const steps = [
    {
      title: "Welcome to AlphaStream",
      description: "Let's get you set up in just a few steps",
      icon: Activity,
    },
    {
      title: "Select Your Symbols",
      description: "Choose which instruments you want to track",
      icon: TrendingUp,
    },
    {
      title: "Notification Preferences",
      description: "How do you want to receive signal alerts?",
      icon: Bell,
    },
    {
      title: "You're All Set!",
      description: "Start exploring your trading signals",
      icon: Sparkles,
    },
  ]

  const currentStep = steps[step]
  const Icon = currentStep.icon
  const isLastStep = step === steps.length - 1
  const isFirstStep = step === 0

  const toggleSymbol = (id: string) => {
    setSelectedSymbols((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    )
  }

  const toggleNotification = (id: string) => {
    setSelectedNotifications((prev) =>
      prev.includes(id) ? prev.filter((n) => n !== id) : [...prev, id]
    )
  }

  if (hasCompletedOnboarding) return null

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-[#18181B] border-[#27272A] p-0 max-w-lg overflow-hidden">
        {/* Progress Bar */}
        <div className="h-1 bg-[#27272A]">
          <div 
            className="h-full bg-teal transition-all duration-300"
            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
          />
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {steps.map((_, i) => (
              <div
                key={i}
                className={cn(
                  "w-2 h-2 rounded-full transition-colors",
                  i === step ? "bg-teal" : i < step ? "bg-teal/50" : "bg-[#27272A]"
                )}
              />
            ))}
          </div>

          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-teal/10 border border-teal/30 flex items-center justify-center">
              <Icon className="h-8 w-8 text-teal" />
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-[#FAFAFA]">{currentStep.title}</h2>
            <p className="text-[#A1A1AA] mt-1">{currentStep.description}</p>
          </div>

          {/* Step Content */}
          <div className="mb-8">
            {step === 0 && (
              <div className="text-center space-y-4">
                <p className="text-sm text-[#A1A1AA]">
                  Welcome, <span className="text-[#FAFAFA] font-medium">{user?.name || "Trader"}</span>!
                </p>
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="p-4 bg-[#27272A]/50 rounded-lg text-center">
                    <p className="text-2xl font-bold text-teal">73%</p>
                    <p className="text-xs text-[#71717A]">Accuracy</p>
                  </div>
                  <div className="p-4 bg-[#27272A]/50 rounded-lg text-center">
                    <p className="text-2xl font-bold text-teal">2.4</p>
                    <p className="text-xs text-[#71717A]">Sharpe</p>
                  </div>
                  <div className="p-4 bg-[#27272A]/50 rounded-lg text-center">
                    <p className="text-2xl font-bold text-teal">24/7</p>
                    <p className="text-xs text-[#71717A]">Signals</p>
                  </div>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="grid grid-cols-2 gap-3">
                {symbols.map((symbol) => (
                  <button
                    key={symbol.id}
                    onClick={() => toggleSymbol(symbol.id)}
                    className={cn(
                      "p-4 rounded-lg border text-left transition-all",
                      selectedSymbols.includes(symbol.id)
                        ? "bg-teal/10 border-teal"
                        : "bg-[#27272A]/50 border-[#27272A] hover:border-[#3F3F46]"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#FAFAFA]">{symbol.name}</span>
                      {selectedSymbols.includes(symbol.id) && (
                        <Check className="h-4 w-4 text-teal" />
                      )}
                    </div>
                    <p className="text-xs text-[#71717A] mt-1">{symbol.fullName}</p>
                  </button>
                ))}
              </div>
            )}

            {step === 2 && (
              <div className="space-y-3">
                {notificationPrefs.map((pref) => (
                  <div
                    key={pref.id}
                    className={cn(
                      "flex items-start gap-3 p-4 rounded-lg border transition-all",
                      selectedNotifications.includes(pref.id)
                        ? "bg-teal/10 border-teal"
                        : "bg-[#27272A]/50 border-[#27272A]"
                    )}
                  >
                    <Checkbox
                      id={pref.id}
                      checked={selectedNotifications.includes(pref.id)}
                      onCheckedChange={() => toggleNotification(pref.id)}
                      className="mt-0.5 border-[#3F3F46] data-[state=checked]:bg-teal data-[state=checked]:border-teal"
                    />
                    <div>
                      <Label htmlFor={pref.id} className="text-[#FAFAFA] cursor-pointer">
                        {pref.label}
                      </Label>
                      <p className="text-xs text-[#71717A] mt-0.5">{pref.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {step === 3 && (
              <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-success/10 border border-success/30 rounded-full">
                  <Check className="h-4 w-4 text-success" />
                  <span className="text-sm text-success font-medium">Setup Complete</span>
                </div>
                <div className="space-y-3 mt-6">
                  <div className="flex items-center gap-3 p-3 bg-[#27272A]/50 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-teal" />
                    <span className="text-sm text-[#FAFAFA]">
                      Tracking {selectedSymbols.length} symbol{selectedSymbols.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-[#27272A]/50 rounded-lg">
                    <Bell className="h-5 w-5 text-teal" />
                    <span className="text-sm text-[#FAFAFA]">
                      {selectedNotifications.length} notification channel{selectedNotifications.length !== 1 ? "s" : ""} enabled
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-[#27272A]/50 rounded-lg">
                    <Key className="h-5 w-5 text-teal" />
                    <span className="text-sm text-[#FAFAFA]">
                      API key ready to generate
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            {!isFirstStep ? (
              <Button
                variant="ghost"
                onClick={() => setStep(step - 1)}
                className="text-[#A1A1AA] hover:text-[#FAFAFA]"
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            ) : (
              <div />
            )}
            
            {isLastStep ? (
              <Button
                onClick={completeOnboarding}
                className="bg-teal hover:bg-teal/90 text-[#09090B] font-medium"
              >
                Get Started
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={() => setStep(step + 1)}
                className="bg-teal hover:bg-teal/90 text-[#09090B] font-medium"
              >
                Continue
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
