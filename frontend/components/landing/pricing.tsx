"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

const plans = [
  {
    name: "Starter",
    description: "For hobbyist traders getting started",
    monthlyPrice: 49,
    yearlyPrice: 470,
    features: [
      "5 symbols",
      "Daily signals",
      "Email alerts",
      "Dashboard access",
      "30-day signal history",
      "Community support",
    ],
    popular: false,
  },
  {
    name: "Pro",
    description: "For active traders who need real-time data",
    monthlyPrice: 149,
    yearlyPrice: 1430,
    features: [
      "25 symbols",
      "Real-time signals",
      "API access (REST)",
      "SMS + email alerts",
      "90-day signal history",
      "Backtesting tools",
      "Priority support",
    ],
    popular: true,
  },
  {
    name: "Premium",
    description: "For serious traders who need everything",
    monthlyPrice: 299,
    yearlyPrice: 2870,
    features: [
      "Unlimited symbols",
      "WebSocket streaming",
      "Full API access",
      "All alert channels",
      "Unlimited history",
      "Advanced backtesting",
      "Custom model requests",
      "Dedicated support",
    ],
    popular: false,
  },
]

export function Pricing() {
  const [isYearly, setIsYearly] = useState(false)

  return (
    <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0A0A0B]">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-[#FAFAFA] mb-4">Simple, Transparent Pricing</h2>
          <p className="text-[#A1A1AA] mb-8">Start free, upgrade when you need more</p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span className={cn("text-sm", !isYearly ? "text-[#FAFAFA]" : "text-[#71717A]")}>
              Monthly
            </span>
            <Switch
              checked={isYearly}
              onCheckedChange={setIsYearly}
              className="data-[state=checked]:bg-teal"
            />
            <span className={cn("text-sm", isYearly ? "text-[#FAFAFA]" : "text-[#71717A]")}>
              Yearly
            </span>
            <Badge className="bg-success/20 text-success border-success/30 ml-2">
              Save 20%
            </Badge>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
            <Card
              className={cn(
                "bg-[#18181B] border-[#27272A] relative h-full",
                plan.popular && "border-violet ring-1 ring-violet"
              )}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-violet text-white">
                  Most Popular
                </Badge>
              )}
              <CardHeader className="pb-4">
                <CardTitle className="text-xl text-[#FAFAFA]">{plan.name}</CardTitle>
                <CardDescription className="text-[#71717A]">{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-[#FAFAFA]">
                    ${isYearly ? Math.round(plan.yearlyPrice / 12) : plan.monthlyPrice}
                  </span>
                  <span className="text-[#71717A]">/mo</span>
                  {isYearly && (
                    <p className="text-sm text-[#71717A] mt-1">
                      ${plan.yearlyPrice} billed annually
                    </p>
                  )}
                </div>

                <Button
                  className={cn(
                    "w-full mb-6",
                    plan.popular
                      ? "bg-teal hover:bg-teal/90 text-[#09090B]"
                      : "bg-[#27272A] hover:bg-[#3F3F46] text-[#FAFAFA]"
                  )}
                  asChild
                >
                  <Link href="/dashboard">Start Free Trial</Link>
                </Button>

                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-teal shrink-0 mt-0.5" />
                      <span className="text-sm text-[#A1A1AA]">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            </motion.div>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-[#71717A]">
          All plans include 14-day free trial. No credit card required.
        </p>
      </div>
    </section>
  )
}
