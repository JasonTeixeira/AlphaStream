"use client"

import { motion } from "framer-motion"
import { Shield, CheckCircle2 } from "lucide-react"

export function MoneyBackGuarantee() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-teal/10 via-transparent to-teal/10 rounded-2xl blur-xl" />
          
          <div className="relative bg-[#18181B] border border-[#27272A] rounded-2xl p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
              {/* Badge */}
              <div className="relative shrink-0">
                <div className="absolute inset-0 bg-teal/20 rounded-full blur-xl" />
                <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-teal bg-[#0A0A0B] flex flex-col items-center justify-center">
                  <Shield className="h-8 w-8 md:h-10 md:w-10 text-teal mb-1" />
                  <span className="text-xs md:text-sm font-bold text-teal">30-DAY</span>
                  <span className="text-[10px] md:text-xs text-[#A1A1AA]">GUARANTEE</span>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl md:text-2xl font-bold text-[#FAFAFA] mb-3">
                  30-Day Money-Back Guarantee
                </h3>
                <p className="text-[#A1A1AA] mb-4">
                  Try AlphaStream risk-free. If you&apos;re not completely satisfied with our signals 
                  within the first 30 days, we&apos;ll refund 100% of your payment. No questions asked.
                </p>
                
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm">
                  <div className="flex items-center gap-2 text-[#A1A1AA]">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    <span>No questions asked</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#A1A1AA]">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    <span>Full refund</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#A1A1AA]">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    <span>Cancel anytime</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
