"use client"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { Activity, Mail, ArrowLeft, CheckCircle } from "lucide-react"

export default function ForgotPasswordPage() {
  const { forgotPassword } = useAuth()
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsLoading(true)
    await forgotPassword(email)
    setIsLoading(false)
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <div className="space-y-8">
        {/* Mobile Logo */}
        <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-teal/20 border border-teal/30">
            <Activity className="h-5 w-5 text-teal" />
          </div>
          <span className="text-xl font-bold text-[#FAFAFA]">AlphaStream</span>
        </div>

        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-success/20 flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-success" />
          </div>
          <h1 className="text-2xl font-bold text-[#FAFAFA]">Check your email</h1>
          <p className="text-[#A1A1AA]">
            We&apos;ve sent password reset instructions to{" "}
            <span className="text-[#FAFAFA] font-medium">{email}</span>
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-center text-sm text-[#71717A]">
            Didn&apos;t receive the email? Check your spam folder or{" "}
            <button
              onClick={() => setIsSubmitted(false)}
              className="text-teal hover:text-teal/80"
            >
              try another email
            </button>
          </p>

          <Button
            variant="outline"
            asChild
            className="w-full border-[#27272A] text-[#FAFAFA] hover:bg-[#18181B] h-11"
          >
            <Link href="/auth/login">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to sign in
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Mobile Logo */}
      <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-teal/20 border border-teal/30">
          <Activity className="h-5 w-5 text-teal" />
        </div>
        <span className="text-xl font-bold text-[#FAFAFA]">AlphaStream</span>
      </div>

      {/* Header */}
      <div className="text-center lg:text-left">
        <h1 className="text-2xl font-bold text-[#FAFAFA]">Forgot your password?</h1>
        <p className="text-[#A1A1AA] mt-2">
          No worries, we&apos;ll send you reset instructions.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-[#FAFAFA]">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#71717A]" />
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 bg-[#18181B] border-[#27272A] text-[#FAFAFA] placeholder:text-[#71717A] focus:border-teal focus:ring-teal"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading || !email}
          className="w-full bg-teal hover:bg-teal/90 text-[#09090B] font-semibold h-11"
        >
          {isLoading ? (
            <>
              <Spinner className="mr-2 h-4 w-4" />
              Sending...
            </>
          ) : (
            "Reset password"
          )}
        </Button>
      </form>

      {/* Footer */}
      <Button
        variant="ghost"
        asChild
        className="w-full text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-transparent"
      >
        <Link href="/auth/login">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to sign in
        </Link>
      </Button>
    </div>
  )
}
