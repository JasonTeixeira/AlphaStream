"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Cookie, X, Settings } from "lucide-react"

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: true,
    marketing: false,
  })

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent")
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 2000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAcceptAll = () => {
    localStorage.setItem("cookieConsent", JSON.stringify({
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString(),
    }))
    setIsVisible(false)
  }

  const handleAcceptSelected = () => {
    localStorage.setItem("cookieConsent", JSON.stringify({
      ...preferences,
      timestamp: new Date().toISOString(),
    }))
    setIsVisible(false)
  }

  const handleRejectAll = () => {
    localStorage.setItem("cookieConsent", JSON.stringify({
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString(),
    }))
    setIsVisible(false)
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
        >
          <div className="max-w-4xl mx-auto bg-[#18181B] border border-[#27272A] rounded-2xl shadow-2xl overflow-hidden">
            {!showSettings ? (
              /* Simple View */
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-10 h-10 rounded-lg bg-teal/20 flex items-center justify-center">
                    <Cookie className="h-5 w-5 text-teal" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-[#FAFAFA] mb-2">We Value Your Privacy</h3>
                    <p className="text-sm text-[#A1A1AA] mb-4">
                      We use cookies to enhance your browsing experience, analyze site traffic, and 
                      personalize content. By clicking &quot;Accept All&quot;, you consent to our use of cookies.{" "}
                      <Link href="/legal/privacy" className="text-teal hover:underline">Learn more</Link>
                    </p>
                    <div className="flex flex-wrap items-center gap-3">
                      <Button
                        onClick={handleAcceptAll}
                        className="bg-teal hover:bg-teal/90 text-[#09090B] font-semibold"
                      >
                        Accept All
                      </Button>
                      <Button
                        onClick={handleRejectAll}
                        variant="outline"
                        className="border-[#27272A] text-[#A1A1AA] hover:text-[#FAFAFA]"
                      >
                        Reject All
                      </Button>
                      <Button
                        onClick={() => setShowSettings(true)}
                        variant="ghost"
                        className="text-[#A1A1AA] hover:text-[#FAFAFA]"
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        Customize
                      </Button>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsVisible(false)}
                    className="shrink-0 text-[#71717A] hover:text-[#FAFAFA]"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ) : (
              /* Settings View */
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-[#FAFAFA]">Cookie Preferences</h3>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="text-[#71717A] hover:text-[#FAFAFA]"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-4 mb-6">
                  {/* Necessary */}
                  <div className="flex items-center justify-between p-4 rounded-lg bg-[#0A0A0B] border border-[#27272A]">
                    <div>
                      <p className="font-medium text-[#FAFAFA]">Necessary Cookies</p>
                      <p className="text-xs text-[#71717A]">Required for the website to function properly</p>
                    </div>
                    <div className="text-sm text-[#71717A]">Always on</div>
                  </div>

                  {/* Analytics */}
                  <div className="flex items-center justify-between p-4 rounded-lg bg-[#0A0A0B] border border-[#27272A]">
                    <div>
                      <p className="font-medium text-[#FAFAFA]">Analytics Cookies</p>
                      <p className="text-xs text-[#71717A]">Help us understand how visitors use our site</p>
                    </div>
                    <button
                      onClick={() => setPreferences(p => ({ ...p, analytics: !p.analytics }))}
                      className={`relative w-12 h-6 rounded-full transition-colors ${preferences.analytics ? 'bg-teal' : 'bg-[#3F3F46]'}`}
                    >
                      <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${preferences.analytics ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>

                  {/* Marketing */}
                  <div className="flex items-center justify-between p-4 rounded-lg bg-[#0A0A0B] border border-[#27272A]">
                    <div>
                      <p className="font-medium text-[#FAFAFA]">Marketing Cookies</p>
                      <p className="text-xs text-[#71717A]">Used to deliver personalized advertisements</p>
                    </div>
                    <button
                      onClick={() => setPreferences(p => ({ ...p, marketing: !p.marketing }))}
                      className={`relative w-12 h-6 rounded-full transition-colors ${preferences.marketing ? 'bg-teal' : 'bg-[#3F3F46]'}`}
                    >
                      <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${preferences.marketing ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    onClick={handleAcceptSelected}
                    className="bg-teal hover:bg-teal/90 text-[#09090B] font-semibold"
                  >
                    Save Preferences
                  </Button>
                  <Button
                    onClick={handleAcceptAll}
                    variant="outline"
                    className="border-[#27272A] text-[#A1A1AA] hover:text-[#FAFAFA]"
                  >
                    Accept All
                  </Button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
