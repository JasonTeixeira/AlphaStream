"use client"

import { motion } from "framer-motion"
import { ExternalLink } from "lucide-react"

const pressItems = [
  {
    publication: "Bloomberg",
    quote: "AlphaStream represents the next generation of retail trading tools",
    date: "March 2025",
  },
  {
    publication: "TechCrunch",
    quote: "ML-powered signals that actually work - a rarity in fintech",
    date: "February 2025",
  },
  {
    publication: "Forbes",
    quote: "Democratizing quantitative trading for everyday investors",
    date: "January 2025",
  },
  {
    publication: "WSJ",
    quote: "The startup bringing hedge fund technology to retail traders",
    date: "December 2024",
  },
]

export function PressMentions() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#0A0A0B]">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-sm text-[#71717A] mb-2">AS FEATURED IN</p>
          <div className="flex items-center justify-center gap-8 flex-wrap">
            {["Bloomberg", "TechCrunch", "Forbes", "WSJ", "Reuters"].map((pub, index) => (
              <motion.span
                key={pub}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="text-xl font-semibold text-[#3F3F46] hover:text-[#71717A] transition-colors cursor-pointer"
              >
                {pub}
              </motion.span>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {pressItems.map((item, index) => (
            <motion.div
              key={item.publication}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="p-6 rounded-lg bg-[#18181B] border border-[#27272A] hover:border-[#3F3F46] transition-colors group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-[#FAFAFA]">{item.publication}</span>
                <ExternalLink className="h-4 w-4 text-[#71717A] opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-sm text-[#A1A1AA] italic mb-2">&quot;{item.quote}&quot;</p>
              <p className="text-xs text-[#71717A]">{item.date}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
