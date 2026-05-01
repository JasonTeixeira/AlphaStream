"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertTriangle, Shield } from "lucide-react"

export function RiskDisclaimerModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [hasAccepted, setHasAccepted] = useState(false)
  const [checked, setChecked] = useState({
    understand: false,
    notAdvice: false,
    responsible: false,
  })

  useEffect(() => {
    // Check if user has already accepted
    const accepted = localStorage.getItem("riskDisclaimerAccepted")
    if (accepted) {
      setHasAccepted(true)
    } else {
      // Show modal after a short delay
      const timer = setTimeout(() => {
        setIsOpen(true)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  const allChecked = checked.understand && checked.notAdvice && checked.responsible

  const handleAccept = () => {
    localStorage.setItem("riskDisclaimerAccepted", "true")
    localStorage.setItem("riskDisclaimerDate", new Date().toISOString())
    setHasAccepted(true)
    setIsOpen(false)
  }

  if (hasAccepted) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[100]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] w-full max-w-lg"
          >
            <div className="bg-[#18181B] border border-warning/30 rounded-2xl overflow-hidden shadow-2xl">
              {/* Header */}
              <div className="bg-warning/10 border-b border-warning/30 p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-warning/20 flex items-center justify-center">
                    <AlertTriangle className="h-6 w-6 text-warning" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[#FAFAFA]">Risk Disclaimer</h2>
                    <p className="text-sm text-[#A1A1AA]">Please read before continuing</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                <div className="text-sm text-[#A1A1AA] space-y-4">
                  <p>
                    <strong className="text-[#FAFAFA]">Trading involves substantial risk.</strong> The 
                    trading signals provided by AlphaStream are for informational purposes only and 
                    should not be considered as financial advice.
                  </p>
                  <p>
                    Past performance of our signals does not guarantee future results. You could 
                    lose some or all of your invested capital. Only trade with money you can afford 
                    to lose.
                  </p>
                  <p>
                    AlphaStream is not a registered investment advisor, broker-dealer, or financial 
                    planner. We do not provide personalized investment advice.
                  </p>
                </div>

                {/* Checkboxes */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="understand"
                      checked={checked.understand}
                      onCheckedChange={(v) => setChecked((prev) => ({ ...prev, understand: !!v }))}
                      className="mt-1 border-[#3F3F46] data-[state=checked]:bg-teal data-[state=checked]:border-teal"
                    />
                    <label htmlFor="understand" className="text-sm text-[#A1A1AA] cursor-pointer">
                      I understand that trading involves significant risk and may result in the 
                      loss of my capital.
                    </label>
                  </div>

                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="notAdvice"
                      checked={checked.notAdvice}
                      onCheckedChange={(v) => setChecked((prev) => ({ ...prev, notAdvice: !!v }))}
                      className="mt-1 border-[#3F3F46] data-[state=checked]:bg-teal data-[state=checked]:border-teal"
                    />
                    <label htmlFor="notAdvice" className="text-sm text-[#A1A1AA] cursor-pointer">
                      I acknowledge that AlphaStream&apos;s signals are not financial advice and I should 
                      consult a qualified financial advisor for personalized guidance.
                    </label>
                  </div>

                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="responsible"
                      checked={checked.responsible}
                      onCheckedChange={(v) => setChecked((prev) => ({ ...prev, responsible: !!v }))}
                      className="mt-1 border-[#3F3F46] data-[state=checked]:bg-teal data-[state=checked]:border-teal"
                    />
                    <label htmlFor="responsible" className="text-sm text-[#A1A1AA] cursor-pointer">
                      I am solely responsible for my trading decisions and will not hold AlphaStream 
                      liable for any losses incurred.
                    </label>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-[#27272A] p-6">
                <Button
                  onClick={handleAccept}
                  disabled={!allChecked}
                  className="w-full bg-teal hover:bg-teal/90 text-[#09090B] font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Shield className="mr-2 h-4 w-4" />
                  I Understand and Accept
                </Button>
                <p className="text-xs text-[#71717A] text-center mt-4">
                  By clicking accept, you agree to our{" "}
                  <a href="/legal/terms" className="text-teal hover:underline">Terms of Service</a>
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
