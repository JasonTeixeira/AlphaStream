"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Activity, Home, RefreshCw, AlertTriangle } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-[#09090B] flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div 
        className="fixed inset-0 opacity-30"
        style={{
          backgroundImage: `linear-gradient(rgba(239, 68, 68, 0.03) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(239, 68, 68, 0.03) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />
      
      <div className="relative z-10 text-center max-w-md">
        {/* Logo */}
        <Link href="/" className="inline-flex items-center gap-2 mb-8">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-teal/20 border border-teal/30">
            <Activity className="h-5 w-5 text-teal" />
          </div>
          <span className="text-xl font-bold text-[#FAFAFA]">AlphaStream</span>
        </Link>

        {/* Error Icon */}
        <div className="mb-8 flex justify-center">
          <div className="w-24 h-24 rounded-full bg-danger/10 border border-danger/30 flex items-center justify-center">
            <AlertTriangle className="h-12 w-12 text-danger" />
          </div>
        </div>

        {/* Message */}
        <h1 className="text-2xl font-bold text-[#FAFAFA] mb-3">Something went wrong</h1>
        <p className="text-[#A1A1AA] mb-2">
          We encountered an unexpected error. Our team has been notified.
        </p>
        {error.digest && (
          <p className="text-xs text-[#71717A] font-mono mb-8">
            Error ID: {error.digest}
          </p>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button 
            onClick={reset}
            className="bg-teal hover:bg-teal/90 text-[#09090B] font-medium"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
          <Button 
            variant="outline" 
            asChild
            className="border-[#27272A] text-[#FAFAFA] hover:bg-[#18181B]"
          >
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Go to Homepage
            </Link>
          </Button>
        </div>

        {/* Help Link */}
        <p className="mt-8 text-sm text-[#71717A]">
          If this persists,{" "}
          <Link href="mailto:support@alphastream.io" className="text-teal hover:text-teal/80">
            contact support
          </Link>
        </p>
      </div>
    </div>
  )
}
