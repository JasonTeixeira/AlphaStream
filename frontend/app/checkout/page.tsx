"use client"

import { useState, Suspense } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Zap, ArrowLeft, CreditCard, Lock, Check, Shield } from "lucide-react"
import { toast } from "sonner"

const plans = {
  pro: {
    name: "Pro",
    price: 49,
    yearlyPrice: 39,
    features: ["All 8 symbols", "5 ML models", "1,000 API calls/hr", "Email & SMS alerts", "Backtester access"],
  },
  enterprise: {
    name: "Enterprise",
    price: 199,
    yearlyPrice: 159,
    features: ["Unlimited symbols", "All models + custom", "Unlimited API calls", "Priority support", "White-label options"],
  },
}

export default function CheckoutPageWrapper() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#09090B] flex items-center justify-center"><div className="text-[#A1A1AA]">Loading checkout...</div></div>}>
      <CheckoutPage />
    </Suspense>
  )
}

function CheckoutPage() {
  const searchParams = useSearchParams()
  const planId = (searchParams.get("plan") as "pro" | "enterprise") || "pro"
  const billingCycle = searchParams.get("billing") || "monthly"
  const plan = plans[planId]
  
  const [isProcessing, setIsProcessing] = useState(false)
  const [cardNumber, setCardNumber] = useState("")
  const [expiry, setExpiry] = useState("")
  const [cvc, setCvc] = useState("")
  const [name, setName] = useState("")
  const [country, setCountry] = useState("us")
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  const price = billingCycle === "yearly" ? plan.yearlyPrice : plan.price
  const total = billingCycle === "yearly" ? price * 12 : price

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    return parts.length ? parts.join(" ") : value
  }

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4)
    }
    return v
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!agreedToTerms) {
      toast.error("Please agree to the terms and conditions")
      return
    }

    setIsProcessing(true)
    
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))
    
    toast.success("Payment successful! Welcome to AlphaStream Pro.")
    setIsProcessing(false)
    
    // Redirect to dashboard
    window.location.href = "/dashboard"
  }

  return (
    <div className="min-h-screen bg-[#09090B]">
      {/* Header */}
      <header className="border-b border-[#27272A] bg-[#09090B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Zap className="h-6 w-6 text-teal" />
              <span className="font-bold text-[#FAFAFA]">AlphaStream</span>
            </Link>
            <Button variant="ghost" asChild className="text-[#A1A1AA] hover:text-[#FAFAFA]">
              <Link href="/dashboard/billing">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Billing
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#FAFAFA] mb-2">Complete Your Purchase</h1>
            <p className="text-[#A1A1AA]">You are upgrading to the {plan.name} plan</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Payment Form */}
            <Card className="bg-[#18181B] border-[#27272A]">
              <CardHeader>
                <CardTitle className="text-lg text-[#FAFAFA] flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-teal" />
                  Payment Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Card Number */}
                  <div className="space-y-2">
                    <Label className="text-[#FAFAFA]">Card Number</Label>
                    <div className="relative">
                      <Input
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        className="bg-[#0A0A0B] border-[#27272A] text-[#FAFAFA] pl-10"
                      />
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#71717A]" />
                    </div>
                  </div>

                  {/* Expiry & CVC */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[#FAFAFA]">Expiry Date</Label>
                      <Input
                        value={expiry}
                        onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                        placeholder="MM/YY"
                        maxLength={5}
                        className="bg-[#0A0A0B] border-[#27272A] text-[#FAFAFA]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[#FAFAFA]">CVC</Label>
                      <Input
                        value={cvc}
                        onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
                        placeholder="123"
                        maxLength={4}
                        type="password"
                        className="bg-[#0A0A0B] border-[#27272A] text-[#FAFAFA]"
                      />
                    </div>
                  </div>

                  {/* Cardholder Name */}
                  <div className="space-y-2">
                    <Label className="text-[#FAFAFA]">Cardholder Name</Label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="bg-[#0A0A0B] border-[#27272A] text-[#FAFAFA]"
                    />
                  </div>

                  {/* Country */}
                  <div className="space-y-2">
                    <Label className="text-[#FAFAFA]">Country</Label>
                    <Select value={country} onValueChange={setCountry}>
                      <SelectTrigger className="bg-[#0A0A0B] border-[#27272A] text-[#FAFAFA]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#18181B] border-[#27272A]">
                        <SelectItem value="us">United States</SelectItem>
                        <SelectItem value="ca">Canada</SelectItem>
                        <SelectItem value="uk">United Kingdom</SelectItem>
                        <SelectItem value="de">Germany</SelectItem>
                        <SelectItem value="fr">France</SelectItem>
                        <SelectItem value="au">Australia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Terms */}
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="terms"
                      checked={agreedToTerms}
                      onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                      className="mt-1 border-[#27272A] data-[state=checked]:bg-teal data-[state=checked]:border-teal"
                    />
                    <label htmlFor="terms" className="text-sm text-[#A1A1AA] leading-relaxed">
                      I agree to the{" "}
                      <Link href="/terms" className="text-teal hover:underline">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy" className="text-teal hover:underline">
                        Privacy Policy
                      </Link>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full bg-teal hover:bg-teal/90 text-[#09090B] h-12 text-base font-semibold"
                  >
                    {isProcessing ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-[#09090B] border-t-transparent" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Lock className="mr-2 h-4 w-4" />
                        Pay ${billingCycle === "yearly" ? total.toFixed(2) : price.toFixed(2)}
                        {billingCycle === "yearly" ? "/year" : "/month"}
                      </>
                    )}
                  </Button>

                  {/* Security Note */}
                  <div className="flex items-center justify-center gap-2 text-xs text-[#71717A]">
                    <Shield className="h-4 w-4" />
                    <span>Secured with 256-bit SSL encryption</span>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Order Summary */}
            <div className="space-y-6">
              <Card className="bg-[#18181B] border-[#27272A]">
                <CardHeader>
                  <CardTitle className="text-lg text-[#FAFAFA]">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Plan Details */}
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[#FAFAFA]">{plan.name} Plan</span>
                        {billingCycle === "yearly" && (
                          <Badge className="bg-success/20 text-success border-success/30">
                            Save 20%
                          </Badge>
                        )}
                      </div>
                      <span className="text-sm text-[#71717A] capitalize">
                        Billed {billingCycle}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-[#FAFAFA]">${price}</span>
                      <span className="text-[#71717A]">/mo</span>
                    </div>
                  </div>

                  <Separator className="bg-[#27272A]" />

                  {/* Features */}
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-[#A1A1AA]">Includes:</p>
                    {plan.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-success" />
                        <span className="text-sm text-[#FAFAFA]">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Separator className="bg-[#27272A]" />

                  {/* Total */}
                  <div className="flex items-center justify-between">
                    <span className="text-[#A1A1AA]">
                      {billingCycle === "yearly" ? "Total (billed annually)" : "Total due today"}
                    </span>
                    <span className="text-xl font-bold text-[#FAFAFA]">
                      ${billingCycle === "yearly" ? total.toFixed(2) : price.toFixed(2)}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Guarantees */}
              <Card className="bg-[#18181B]/50 border-[#27272A]">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-success/10">
                        <Check className="h-4 w-4 text-success" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#FAFAFA]">7-day money-back guarantee</p>
                        <p className="text-xs text-[#71717A]">Not satisfied? Get a full refund.</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-teal/10">
                        <Zap className="h-4 w-4 text-teal" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#FAFAFA]">Instant access</p>
                        <p className="text-xs text-[#71717A]">Start using all features immediately.</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
