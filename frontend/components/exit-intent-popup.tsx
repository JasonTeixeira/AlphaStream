"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Gift, ArrowRight, Zap } from "lucide-react"

export function ExitIntentPopup() {
  const [isOpen, setIsOpen] = useState(false)
  const [hasShown, setHasShown] = useState(false)
  const [email, setEmail] = useState("")

  useEffect(() => {
    // Check if already shown in this session
    const shown = sessionStorage.getItem("exitIntentShown")
    if (shown) {
      setHasShown(true)
      return
    }

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasShown) {
        setIsOpen(true)
        setHasShown(true)
        sessionStorage.setItem("exitIntentShown", "true")
      }
    }

    document.addEventListener("mouseleave", handleMouseLeave)
    return () => document.removeEventListener("mouseleave", handleMouseLeave)
  }, [hasShown])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle email submission
    setIsOpen(false)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg"
          >
            <div className="bg-[#18181B] border border-[#27272A] rounded-2xl overflow-hidden shadow-2xl">
              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 text-[#71717A] hover:text-[#FAFAFA] transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Content */}
              <div className="p-8">
                {/* Icon */}
                <div className="flex items-center justify-center mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-teal/20 rounded-full blur-xl" />
                    <div className="relative w-16 h-16 bg-teal/20 rounded-full flex items-center justify-center">
                      <Gift className="h-8 w-8 text-teal" />
                    </div>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-[#FAFAFA] text-center mb-2">
                  Wait! Here&apos;s a Special Offer
                </h2>
                <p className="text-[#A1A1AA] text-center mb-6">
                  Get <span className="text-teal font-semibold">30% off</span> your first 3 months 
                  when you sign up today.
                </p>

                {/* Offer Details */}
                <div className="bg-[#0A0A0B] rounded-lg p-4 mb-6 border border-[#27272A]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[#A1A1AA]">Pro Plan</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[#71717A] line-through">$99/mo</span>
                      <span className="font-bold text-teal text-xl">$69/mo</span>
                    </div>
                  </div>
                  <p className="text-xs text-[#71717A]">
                    Includes all features • Cancel anytime • 30-day money-back guarantee
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 bg-[#0A0A0B] border-[#27272A] text-[#FAFAFA] placeholder:text-[#71717A]"
                      required
                    />
                    <Button type="submit" className="bg-teal hover:bg-teal/90 text-[#09090B] font-semibold">
                      Claim Offer
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </form>

                <div className="flex items-center justify-center gap-4 mt-6">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-sm text-[#71717A] hover:text-[#A1A1AA] transition-colors"
                  >
                    No thanks, I&apos;ll pay full price
                  </button>
                </div>

                {/* Trust */}
                <div className="flex items-center justify-center gap-2 mt-6 text-xs text-[#71717A]">
                  <Zap className="h-3 w-3 text-teal" />
                  <span>Used by 8,700+ traders worldwide</span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
