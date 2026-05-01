"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight } from "lucide-react"
import { toast } from "sonner"

export function FooterCTA() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    toast.success("Welcome to AlphaStream! Check your email to get started.")
    setEmail("")
    setIsLoading(false)
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold text-[#FAFAFA] mb-4">Ready to trade smarter?</h2>
        <p className="text-[#A1A1AA] mb-8">
          Start your 14-day free trial today. No credit card required.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 bg-[#18181B] border-[#27272A] text-[#FAFAFA] placeholder:text-[#71717A] focus:border-teal focus:ring-teal"
            required
          />
          <Button
            type="submit"
            className="bg-teal hover:bg-teal/90 text-[#09090B] font-semibold"
            disabled={isLoading}
          >
            {isLoading ? (
              "Starting..."
            ) : (
              <>
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      </div>
    </section>
  )
}
