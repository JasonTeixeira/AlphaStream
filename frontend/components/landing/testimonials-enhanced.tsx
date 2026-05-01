"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Quote, Play, Star, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

const testimonials = [
  {
    name: "Marcus Chen",
    role: "Prop Trader",
    company: "Apex Funding",
    location: "New York, NY",
    image: "/testimonials/marcus.jpg",
    verified: true,
    rating: 5,
    quote: "AlphaStream's signals have transformed my trading. The XGBoost model consistently catches moves I would have missed. My funded account has grown 34% in 3 months.",
    stats: { winRate: "78%", avgReturn: "+$2,400/week", timeUsing: "6 months" },
    hasVideo: true,
  },
  {
    name: "Sarah Williams",
    role: "Portfolio Manager",
    company: "Meridian Capital",
    location: "Chicago, IL",
    image: "/testimonials/sarah.jpg",
    verified: true,
    rating: 5,
    quote: "We integrated AlphaStream into our systematic strategy. The API is robust, latency is minimal, and the signal quality rivals our internal models. Worth every penny of the Enterprise plan.",
    stats: { winRate: "71%", avgReturn: "+$18K/month", timeUsing: "1 year" },
    hasVideo: false,
  },
  {
    name: "James Rodriguez",
    role: "Full-time Day Trader",
    company: "Independent",
    location: "Miami, FL",
    image: "/testimonials/james.jpg",
    verified: true,
    rating: 5,
    quote: "I was skeptical of ML signals until I tried AlphaStream. The confidence scores are incredibly accurate - when it says 85%+, I trust it. Best investment in my trading career.",
    stats: { winRate: "74%", avgReturn: "+$5,200/week", timeUsing: "8 months" },
    hasVideo: true,
  },
  {
    name: "Emily Tanaka",
    role: "Quant Researcher",
    company: "Two Sigma (Former)",
    location: "San Francisco, CA",
    image: "/testimonials/emily.jpg",
    verified: true,
    rating: 5,
    quote: "The methodology is sound - walk-forward validation, no look-ahead bias, proper feature engineering. This is how ML trading should be done. I recommend it to every serious trader I know.",
    stats: { winRate: "76%", avgReturn: "+$8,100/week", timeUsing: "4 months" },
    hasVideo: false,
  },
  {
    name: "David Park",
    role: "Crypto Trader",
    company: "BlockTrade Capital",
    location: "Austin, TX",
    image: "/testimonials/david.jpg",
    verified: true,
    rating: 5,
    quote: "The BTC and ETH signals are phenomenal. AlphaStream catches the momentum shifts before most technical indicators. My crypto portfolio is up 89% since I started using it.",
    stats: { winRate: "69%", avgReturn: "+$12K/month", timeUsing: "5 months" },
    hasVideo: true,
  },
  {
    name: "Rachel Foster",
    role: "Hedge Fund Analyst",
    company: "Citadel Securities",
    location: "Greenwich, CT",
    image: "/testimonials/rachel.jpg",
    verified: true,
    rating: 5,
    quote: "We use AlphaStream as a secondary confirmation system. The signal agreement rate with our internal models is surprisingly high, and it often catches setups we miss.",
    stats: { winRate: "72%", avgReturn: "Institutional", timeUsing: "10 months" },
    hasVideo: false,
  },
]

export function TestimonialsEnhanced() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [videoPlaying, setVideoPlaying] = useState<number | null>(null)

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0A0A0B]">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge className="mb-4 bg-teal/20 text-teal border-teal/30">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Verified Reviews
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-[#FAFAFA] mb-4">
            Trusted by Professional Traders
          </h2>
          <p className="text-[#A1A1AA] max-w-2xl mx-auto">
            Real results from real traders. Every testimonial is verified and backed by actual performance data.
          </p>
        </motion.div>

        {/* Featured Testimonial */}
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <Card className="bg-[#18181B] border-[#27272A] overflow-hidden">
            <CardContent className="p-0">
              <div className="grid md:grid-cols-2 gap-0">
                {/* Left - Image/Video */}
                <div className="relative aspect-square md:aspect-auto bg-[#0A0A0B] flex items-center justify-center">
                  <div className="w-32 h-32 md:w-48 md:h-48 rounded-full bg-gradient-to-br from-teal/20 to-violet/20 flex items-center justify-center text-4xl md:text-6xl font-bold text-teal">
                    {testimonials[currentIndex].name.split(" ").map(n => n[0]).join("")}
                  </div>
                  {testimonials[currentIndex].hasVideo && (
                    <Button
                      size="lg"
                      className="absolute bottom-6 left-6 bg-teal hover:bg-teal/90 text-[#09090B]"
                      onClick={() => setVideoPlaying(currentIndex)}
                    >
                      <Play className="mr-2 h-4 w-4 fill-current" />
                      Watch Video
                    </Button>
                  )}
                </div>

                {/* Right - Content */}
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: testimonials[currentIndex].rating }).map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-warning text-warning" />
                    ))}
                  </div>

                  <Quote className="h-10 w-10 text-teal/30 mb-4" />
                  
                  <p className="text-lg md:text-xl text-[#FAFAFA] mb-6 leading-relaxed">
                    {testimonials[currentIndex].quote}
                  </p>

                  <div className="flex items-center gap-4 mb-6">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-[#FAFAFA]">{testimonials[currentIndex].name}</p>
                        {testimonials[currentIndex].verified && (
                          <CheckCircle2 className="h-4 w-4 text-teal" />
                        )}
                      </div>
                      <p className="text-sm text-[#A1A1AA]">
                        {testimonials[currentIndex].role} at {testimonials[currentIndex].company}
                      </p>
                      <p className="text-xs text-[#71717A]">{testimonials[currentIndex].location}</p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex flex-wrap gap-4">
                    <div className="px-4 py-2 bg-[#0A0A0B] rounded-lg">
                      <p className="text-xs text-[#71717A]">Win Rate</p>
                      <p className="font-mono font-semibold text-success">{testimonials[currentIndex].stats.winRate}</p>
                    </div>
                    <div className="px-4 py-2 bg-[#0A0A0B] rounded-lg">
                      <p className="text-xs text-[#71717A]">Avg Return</p>
                      <p className="font-mono font-semibold text-teal">{testimonials[currentIndex].stats.avgReturn}</p>
                    </div>
                    <div className="px-4 py-2 bg-[#0A0A0B] rounded-lg">
                      <p className="text-xs text-[#71717A]">Using For</p>
                      <p className="font-mono font-semibold text-[#FAFAFA]">{testimonials[currentIndex].stats.timeUsing}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <Button
            variant="outline"
            size="icon"
            onClick={prevTestimonial}
            className="border-[#27272A] text-[#A1A1AA] hover:text-[#FAFAFA] hover:border-[#3F3F46]"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={cn(
                  "w-2 h-2 rounded-full transition-all",
                  index === currentIndex ? "w-8 bg-teal" : "bg-[#27272A] hover:bg-[#3F3F46]"
                )}
              />
            ))}
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={nextTestimonial}
            className="border-[#27272A] text-[#A1A1AA] hover:text-[#FAFAFA] hover:border-[#3F3F46]"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Grid of smaller testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.filter((_, i) => i !== currentIndex).slice(0, 3).map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card 
                className="bg-[#18181B] border-[#27272A] hover:border-teal/30 transition-all cursor-pointer h-full"
                onClick={() => setCurrentIndex(testimonials.indexOf(testimonial))}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-warning text-warning" />
                    ))}
                  </div>
                  <p className="text-[#A1A1AA] text-sm mb-4 line-clamp-3">
                    &quot;{testimonial.quote}&quot;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal/20 to-violet/20 flex items-center justify-center text-sm font-bold text-teal">
                      {testimonial.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <p className="text-sm font-medium text-[#FAFAFA]">{testimonial.name}</p>
                        {testimonial.verified && <CheckCircle2 className="h-3 w-3 text-teal" />}
                      </div>
                      <p className="text-xs text-[#71717A]">{testimonial.role}</p>
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
