"use client"

import { useState, Suspense } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { Activity, Lock, Eye, EyeOff, CheckCircle, AlertCircle, Check, X } from "lucide-react"
import { cn } from "@/lib/utils"

function ResetPasswordForm() {
  const { resetPassword } = useAuth()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")

  const passwordRequirements = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "Contains a number", met: /\d/.test(password) },
    { label: "Contains uppercase letter", met: /[A-Z]/.test(password) },
    { label: "Contains special character", met: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
  ]

  const allRequirementsMet = passwordRequirements.every((req) => req.met)
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!allRequirementsMet) {
      setError("Password does not meet requirements")
      return
    }

    if (!passwordsMatch) {
      setError("Passwords do not match")
      return
    }

    setIsLoading(true)
    try {
      await resetPassword(token || "", password)
      setIsSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reset password")
    }
    setIsLoading(false)
  }

  if (!token) {
    return (
      <div className="space-y-8">
        <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-teal/20 border border-teal/30">
            <Activity className="h-5 w-5 text-teal" />
          </div>
          <span className="text-xl font-bold text-[#FAFAFA]">AlphaStream</span>
        </div>

        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-danger/20 flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-danger" />
          </div>
          <h1 className="text-2xl font-bold text-[#FAFAFA]">Invalid reset link</h1>
          <p className="text-[#A1A1AA]">
            This password reset link is invalid or has expired.
          </p>
        </div>

        <Button asChild className="w-full bg-teal hover:bg-teal/90 text-[#09090B] font-semibold h-11">
          <Link href="/auth/forgot-password">Request new link</Link>
        </Button>
      </div>
    )
  }

  if (isSubmitted) {
    return (
      <div className="space-y-8">
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
          <h1 className="text-2xl font-bold text-[#FAFAFA]">Password reset successful</h1>
          <p className="text-[#A1A1AA]">
            Your password has been reset. You can now sign in with your new password.
          </p>
        </div>

        <Button asChild className="w-full bg-teal hover:bg-teal/90 text-[#09090B] font-semibold h-11">
          <Link href="/auth/login">Sign in</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-teal/20 border border-teal/30">
          <Activity className="h-5 w-5 text-teal" />
        </div>
        <span className="text-xl font-bold text-[#FAFAFA]">AlphaStream</span>
      </div>

      <div className="text-center lg:text-left">
        <h1 className="text-2xl font-bold text-[#FAFAFA]">Set new password</h1>
        <p className="text-[#A1A1AA] mt-2">
          Your new password must be different from previously used passwords.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="flex items-center gap-2 p-3 bg-danger/10 border border-danger/30 rounded-lg text-danger text-sm">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="password" className="text-[#FAFAFA]">New Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#71717A]" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 pr-10 bg-[#18181B] border-[#27272A] text-[#FAFAFA] placeholder:text-[#71717A] focus:border-teal focus:ring-teal"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#71717A] hover:text-[#FAFAFA] transition-colors"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          
          {password.length > 0 && (
            <div className="grid grid-cols-2 gap-2 mt-3">
              {passwordRequirements.map((req) => (
                <div key={req.label} className="flex items-center gap-2 text-xs">
                  {req.met ? (
                    <Check className="h-3 w-3 text-success" />
                  ) : (
                    <X className="h-3 w-3 text-[#71717A]" />
                  )}
                  <span className={cn(req.met ? "text-success" : "text-[#71717A]")}>
                    {req.label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-[#FAFAFA]">Confirm Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#71717A]" />
            <Input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              placeholder="Confirm your new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={cn(
                "pl-10 bg-[#18181B] border-[#27272A] text-[#FAFAFA] placeholder:text-[#71717A] focus:border-teal focus:ring-teal",
                confirmPassword.length > 0 && (passwordsMatch ? "border-success" : "border-danger")
              )}
            />
            {confirmPassword.length > 0 && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {passwordsMatch ? (
                  <Check className="h-4 w-4 text-success" />
                ) : (
                  <X className="h-4 w-4 text-danger" />
                )}
              </div>
            )}
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading || !allRequirementsMet || !passwordsMatch}
          className="w-full bg-teal hover:bg-teal/90 text-[#09090B] font-semibold h-11"
        >
          {isLoading ? (
            <>
              <Spinner className="mr-2 h-4 w-4" />
              Resetting...
            </>
          ) : (
            "Reset password"
          )}
        </Button>
      </form>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center">
        <Spinner className="h-8 w-8 text-teal" />
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  )
}
