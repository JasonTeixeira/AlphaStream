"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Activity, Home, ArrowLeft, Search } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#09090B] flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div 
        className="fixed inset-0 opacity-30"
        style={{
          backgroundImage: `linear-gradient(rgba(6, 182, 212, 0.03) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(6, 182, 212, 0.03) 1px, transparent 1px)`,
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

        {/* 404 Graphic */}
        <div className="relative mb-8">
          <div className="text-[150px] font-bold text-[#18181B] leading-none select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-teal/10 border border-teal/30 flex items-center justify-center">
              <Search className="h-10 w-10 text-teal" />
            </div>
          </div>
        </div>

        {/* Message */}
        <h1 className="text-2xl font-bold text-[#FAFAFA] mb-3">Page not found</h1>
        <p className="text-[#A1A1AA] mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved. 
          Let&apos;s get you back on track.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button asChild className="bg-teal hover:bg-teal/90 text-[#09090B] font-medium">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Go to Homepage
            </Link>
          </Button>
          <Button 
            variant="outline" 
            onClick={() => window.history.back()}
            className="border-[#27272A] text-[#FAFAFA] hover:bg-[#18181B]"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>

        {/* Help Link */}
        <p className="mt-8 text-sm text-[#71717A]">
          Need help?{" "}
          <Link href="/docs" className="text-teal hover:text-teal/80">
            Check our documentation
          </Link>
        </p>
      </div>
    </div>
  )
}
