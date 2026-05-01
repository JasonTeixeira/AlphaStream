"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Check, AlertTriangle, ArrowRight, ArrowDown } from "lucide-react"
import { toast } from "sonner"

interface PlanChangeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentPlan: "free" | "pro" | "enterprise"
  newPlan: "free" | "pro" | "enterprise"
  currentPrice: number
  newPrice: number
  billingCycle: "monthly" | "yearly"
}

const planFeatures = {
  free: ["3 symbols", "XGBoost only", "100 API calls/hr", "Email alerts"],
  pro: ["All 8 symbols", "5 ML models", "1,000 API calls/hr", "Email & SMS alerts", "Backtester"],
  enterprise: ["Unlimited symbols", "All models + custom", "Unlimited API", "Priority support", "White-label"],
}

export function PlanChangeModal({
  open,
  onOpenChange,
  currentPlan,
  newPlan,
  currentPrice,
  newPrice,
  billingCycle,
}: PlanChangeModalProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  
  const isUpgrade = newPrice > currentPrice
  const priceDiff = Math.abs(newPrice - currentPrice)
  const prorationAmount = isUpgrade ? (priceDiff * 0.5).toFixed(2) : "0.00" // Simplified proration

  const handleConfirm = async () => {
    setIsProcessing(true)
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    
    toast.success(
      isUpgrade
        ? `Successfully upgraded to ${newPlan.charAt(0).toUpperCase() + newPlan.slice(1)}!`
        : `Plan changed to ${newPlan.charAt(0).toUpperCase() + newPlan.slice(1)}`
    )
    
    setIsProcessing(false)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#18181B] border-[#27272A] max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[#FAFAFA] flex items-center gap-2">
            {isUpgrade ? (
              <>
                <ArrowRight className="h-5 w-5 text-success" />
                Upgrade Plan
              </>
            ) : (
              <>
                <ArrowDown className="h-5 w-5 text-warning" />
                Downgrade Plan
              </>
            )}
          </DialogTitle>
          <DialogDescription className="text-[#A1A1AA]">
            {isUpgrade
              ? "You are about to upgrade your plan. The change will take effect immediately."
              : "You are about to downgrade your plan. The change will take effect at the end of your current billing period."}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          {/* Plan Comparison */}
          <div className="grid grid-cols-2 gap-4">
            {/* Current Plan */}
            <div className="p-4 rounded-lg bg-[#0A0A0B] border border-[#27272A]">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-[#71717A]">Current</span>
                <Badge variant="outline" className="border-[#27272A] text-[#A1A1AA] text-xs">
                  {currentPlan}
                </Badge>
              </div>
              <p className="text-lg font-semibold text-[#FAFAFA]">
                ${currentPrice}
                <span className="text-sm text-[#71717A]">/mo</span>
              </p>
            </div>

            {/* New Plan */}
            <div className={`p-4 rounded-lg border ${isUpgrade ? "bg-success/5 border-success/30" : "bg-warning/5 border-warning/30"}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-[#71717A]">New</span>
                <Badge className={isUpgrade ? "bg-success/20 text-success border-success/30" : "bg-warning/20 text-warning border-warning/30"}>
                  {newPlan}
                </Badge>
              </div>
              <p className="text-lg font-semibold text-[#FAFAFA]">
                ${newPrice}
                <span className="text-sm text-[#71717A]">/mo</span>
              </p>
            </div>
          </div>

          {/* Features Change */}
          <div className="p-4 rounded-lg bg-[#0A0A0B] border border-[#27272A]">
            <p className="text-sm font-medium text-[#A1A1AA] mb-3">
              {isUpgrade ? "You will gain access to:" : "You will lose access to:"}
            </p>
            <div className="space-y-2">
              {(isUpgrade ? planFeatures[newPlan] : planFeatures[currentPlan])
                .filter((f) => !planFeatures[isUpgrade ? currentPlan : newPlan].includes(f))
                .map((feature) => (
                  <div key={feature} className="flex items-center gap-2">
                    {isUpgrade ? (
                      <Check className="h-4 w-4 text-success" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-warning" />
                    )}
                    <span className="text-sm text-[#FAFAFA]">{feature}</span>
                  </div>
                ))}
            </div>
          </div>

          {/* Proration Notice */}
          {isUpgrade && (
            <div className="p-3 rounded-lg bg-teal/10 border border-teal/30">
              <p className="text-sm text-teal">
                <strong>Prorated charge:</strong> You will be charged ${prorationAmount} today for the remainder of your billing period.
              </p>
            </div>
          )}

          {!isUpgrade && (
            <div className="p-3 rounded-lg bg-warning/10 border border-warning/30">
              <p className="text-sm text-warning">
                <strong>Note:</strong> Your current plan features will remain active until the end of your billing period.
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-[#27272A] text-[#A1A1AA] hover:text-[#FAFAFA]"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isProcessing}
            className={isUpgrade ? "bg-success hover:bg-success/90" : "bg-warning hover:bg-warning/90 text-[#09090B]"}
          >
            {isProcessing ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Processing...
              </>
            ) : (
              <>Confirm {isUpgrade ? "Upgrade" : "Downgrade"}</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
