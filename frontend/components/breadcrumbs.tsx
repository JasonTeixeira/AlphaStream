"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import { cn } from "@/lib/utils"

interface BreadcrumbsProps {
  className?: string
}

const pathNameMap: Record<string, string> = {
  dashboard: "Dashboard",
  signals: "Signals",
  backtester: "Backtester",
  "api-keys": "API Keys",
  settings: "Settings",
  auth: "Auth",
  login: "Login",
  signup: "Sign Up",
  "forgot-password": "Forgot Password",
  "reset-password": "Reset Password",
  "verify-email": "Verify Email",
  docs: "Documentation",
}

export function Breadcrumbs({ className }: BreadcrumbsProps) {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)

  if (segments.length === 0) return null

  const breadcrumbs = segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/")
    const name = pathNameMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1)
    const isLast = index === segments.length - 1

    return {
      name,
      href,
      isLast,
    }
  })

  return (
    <nav className={cn("flex items-center text-sm", className)} aria-label="Breadcrumb">
      <ol className="flex items-center gap-1">
        <li>
          <Link 
            href="/" 
            className="text-[#71717A] hover:text-[#FAFAFA] transition-colors p-1"
            aria-label="Home"
          >
            <Home className="h-4 w-4" />
          </Link>
        </li>
        
        {breadcrumbs.map((crumb, index) => (
          <li key={crumb.href} className="flex items-center gap-1">
            <ChevronRight className="h-4 w-4 text-[#3F3F46]" />
            {crumb.isLast ? (
              <span className="text-[#FAFAFA] font-medium px-1">
                {crumb.name}
              </span>
            ) : (
              <Link
                href={crumb.href}
                className="text-[#71717A] hover:text-[#FAFAFA] transition-colors px-1"
              >
                {crumb.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
