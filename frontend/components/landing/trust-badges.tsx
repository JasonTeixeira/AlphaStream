"use client"

import { motion } from "framer-motion"
import { Shield, Lock, Award, CheckCircle2, CreditCard, Globe } from "lucide-react"

const badges = [
  {
    icon: Shield,
    label: "Bank-Level Security",
    description: "256-bit SSL encryption",
  },
  {
    icon: Lock,
    label: "SOC 2 Compliant",
    description: "Enterprise security standards",
  },
  {
    icon: Award,
    label: "Verified Performance",
    description: "Third-party audited results",
  },
  {
    icon: CheckCircle2,
    label: "99.9% Uptime",
    description: "Reliable signal delivery",
  },
  {
    icon: CreditCard,
    label: "Secure Payments",
    description: "Stripe & PayPal protected",
  },
  {
    icon: Globe,
    label: "GDPR Compliant",
    description: "Data privacy guaranteed",
  },
]

export function TrustBadges() {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
        >
          {badges.map((badge, index) => (
            <motion.div
              key={badge.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="flex flex-col items-center text-center p-4 rounded-lg bg-[#18181B]/50 border border-[#27272A] hover:border-[#3F3F46] transition-colors"
            >
              <badge.icon className="h-6 w-6 text-teal mb-2" />
              <p className="text-xs font-medium text-[#FAFAFA] mb-1">{badge.label}</p>
              <p className="text-[10px] text-[#71717A]">{badge.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
