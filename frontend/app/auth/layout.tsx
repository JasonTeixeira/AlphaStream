import Link from "next/link"
import { Activity } from "lucide-react"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#09090B] flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal/20 via-[#09090B] to-violet/20" />
        
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-teal/20 border border-teal/30">
              <Activity className="h-5 w-5 text-teal" />
            </div>
            <span className="text-xl font-bold text-[#FAFAFA]">AlphaStream</span>
          </Link>
          
          {/* Testimonial */}
          <div className="max-w-md">
            <blockquote className="text-2xl font-medium text-[#FAFAFA] leading-relaxed mb-6">
              &ldquo;AlphaStream&apos;s ML signals have transformed how I approach the markets. The accuracy is remarkable.&rdquo;
            </blockquote>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal to-violet flex items-center justify-center text-white font-bold">
                MR
              </div>
              <div>
                <p className="font-semibold text-[#FAFAFA]">Michael Rodriguez</p>
                <p className="text-sm text-[#A1A1AA]">Quantitative Trader, 8 years experience</p>
              </div>
            </div>
          </div>
          
          {/* Stats */}
          <div className="flex gap-12">
            <div>
              <p className="text-3xl font-bold text-teal">73%</p>
              <p className="text-sm text-[#A1A1AA]">Signal Accuracy</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-teal">2.4</p>
              <p className="text-sm text-[#A1A1AA]">Sharpe Ratio</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-teal">12K+</p>
              <p className="text-sm text-[#A1A1AA]">Active Traders</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Panel - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  )
}
