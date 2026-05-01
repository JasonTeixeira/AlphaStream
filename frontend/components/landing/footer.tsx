import Link from "next/link"
import { Zap, Github, Twitter } from "lucide-react"

const footerLinks = [
  { label: "GitHub", href: "https://github.com" },
  { label: "Twitter", href: "https://twitter.com" },
  { label: "Discord", href: "https://discord.com" },
  { label: "Docs", href: "/docs" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
]

export function Footer() {
  return (
    <footer className="border-t border-[#27272A] bg-[#0A0A0B]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-teal" />
            <span className="font-bold text-[#FAFAFA]">AlphaStream</span>
          </Link>

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-6">
            {footerLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm text-[#71717A] hover:text-[#FAFAFA] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 pt-8 border-t border-[#27272A]">
          <p className="text-xs text-[#71717A] text-center leading-relaxed max-w-4xl mx-auto">
            AlphaStream provides algorithmic trading signals for educational and informational
            purposes only. This is not financial advice. AlphaStream is not a registered
            investment advisor, broker-dealer, or financial planner. Trading futures, options,
            and cryptocurrencies involves substantial risk of loss and is not suitable for all
            investors. Past performance, whether actual or indicated by historical tests of
            strategies, is not indicative of future results. Always do your own research before
            making trading decisions.
          </p>
          <p className="text-xs text-[#71717A] text-center mt-4">
            © {new Date().getFullYear()} AlphaStream. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
