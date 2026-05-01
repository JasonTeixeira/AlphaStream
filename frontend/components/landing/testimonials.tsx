"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Quote } from "lucide-react"

const testimonials = [
  {
    quote:
      "AlphaStream's ensemble model caught the NQ reversal at 18,200 that I completely missed. The confidence scoring helps me size positions intelligently.",
    author: "Active Futures Trader",
    role: "Day Trader",
  },
  {
    quote:
      "Finally a signal service that shows its methodology. I can see the walk-forward validation results and actually trust the numbers.",
    author: "Algorithmic Trader",
    role: "Quantitative Analyst",
  },
]

export function Testimonials() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-[#FAFAFA] mb-4">What Traders Say</h2>
          <p className="text-[#A1A1AA]">Real feedback from real traders</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
            >
            <Card
              className="bg-[#18181B] border-[#27272A] hover:border-teal/30 hover:shadow-[0_0_30px_-5px_rgba(6,182,212,0.15)] transition-all duration-300 h-full"
            >
              <CardContent className="p-8">
                <Quote className="h-8 w-8 text-teal mb-4" />
                <blockquote className="text-[#FAFAFA] text-lg leading-relaxed mb-6">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#27272A] flex items-center justify-center">
                    <span className="text-sm font-semibold text-teal">
                      {testimonial.author.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-[#FAFAFA]">{testimonial.author}</p>
                    <p className="text-sm text-[#71717A]">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
