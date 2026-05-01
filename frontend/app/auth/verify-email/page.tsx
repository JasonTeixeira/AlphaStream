"use client"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Activity, Mail, RefreshCw } from "lucide-react"
import { toast } from "sonner"

export default function VerifyEmailPage() {
  const { user } = useAuth()
  const [isResending, setIsResending] = useState(false)

  const handleResend = async () => {
    setIsResending(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsResending(false)
    toast.success("Verification email sent!")
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

      {/* Icon */}
      <div className="flex justify-center">
        <div className="w-20 h-20 rounded-full bg-teal/20 flex items-center justify-center">
          <Mail className="h-10 w-10 text-teal" />
        </div>
      </div>

      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-[#FAFAFA]">Verify your email</h1>
        <p className="text-[#A1A1AA] mt-2">
          We&apos;ve sent a verification link to{" "}
          <span className="text-[#FAFAFA] font-medium">{user?.email || "your email"}</span>
        </p>
      </div>

      {/* Instructions */}
      <div className="bg-[#18181B] border border-[#27272A] rounded-lg p-4 space-y-3">
        <p className="text-sm text-[#A1A1AA]">
          Click the link in the email to verify your account. If you don&apos;t see it:
        </p>
        <ul className="text-sm text-[#71717A] space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-teal mt-0.5">1.</span>
            Check your spam or junk folder
          </li>
          <li className="flex items-start gap-2">
            <span className="text-teal mt-0.5">2.</span>
            Make sure you entered the correct email
          </li>
          <li className="flex items-start gap-2">
            <span className="text-teal mt-0.5">3.</span>
            Wait a few minutes and try again
          </li>
        </ul>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <Button
          onClick={handleResend}
          disabled={isResending}
          variant="outline"
          className="w-full border-[#27272A] text-[#FAFAFA] hover:bg-[#18181B] h-11"
        >
          {isResending ? (
            <>
              <Spinner className="mr-2 h-4 w-4" />
              Sending...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Resend verification email
            </>
          )}
        </Button>

        <Button asChild className="w-full bg-teal hover:bg-teal/90 text-[#09090B] font-semibold h-11">
          <Link href="/dashboard">Continue to dashboard</Link>
        </Button>
      </div>

      {/* Footer */}
      <p className="text-center text-sm text-[#71717A]">
        Wrong email?{" "}
        <Link href="/auth/signup" className="text-teal hover:text-teal/80">
          Sign up again
        </Link>
      </p>
    </div>
  )
}
