"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Play } from "lucide-react"

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
}

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272A_1px,transparent_1px),linear-gradient(to_bottom,#27272A_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-teal/5 via-transparent to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge
              variant="outline"
              className="mb-6 border-[#27272A] bg-[#18181B]/50 text-[#A1A1AA] px-4 py-2"
            >
              <span className="text-teal">200+ Indicators</span>
              <span className="mx-2 text-[#3F3F46]">·</span>
              <span>5 ML Models</span>
              <span className="mx-2 text-[#3F3F46]">·</span>
              <span className="text-success">73% Accuracy</span>
            </Badge>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="max-w-4xl text-4xl font-bold tracking-tight text-[#FAFAFA] sm:text-5xl md:text-6xl text-balance"
          >
            Trading Signals Powered by{" "}
            <span className="text-teal">Machine Learning</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 max-w-2xl text-lg text-[#A1A1AA] text-pretty"
          >
            XGBoost, LightGBM, and LSTM models analyze 200+ technical indicators
            to generate high-confidence trading signals. Walk-forward validated.
            No look-ahead bias.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center gap-4"
          >
            <Button
              size="lg"
              className="bg-teal hover:bg-teal/90 text-[#09090B] font-semibold px-8 h-12"
              asChild
            >
              <Link href="/dashboard">
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-[#27272A] bg-transparent text-[#FAFAFA] hover:bg-[#18181B] hover:border-[#3F3F46] px-8 h-12"
              asChild
            >
              <Link href="/dashboard">
                <Play className="mr-2 h-4 w-4" />
                View Live Demo
              </Link>
            </Button>
          </motion.div>

          {/* Trust Text */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-6 text-sm text-[#71717A]"
          >
            No credit card required · Cancel anytime
          </motion.p>
        </div>
      </div>
    </section>
  )
}
