"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, X, Volume2, VolumeX, Maximize2 } from "lucide-react"

export function DemoVideo() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Badge className="mb-4 bg-violet/20 text-violet border-violet/30">
            <Play className="mr-1 h-3 w-3" />
            2 Minute Demo
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-[#FAFAFA] mb-4">
            See AlphaStream in Action
          </h2>
          <p className="text-[#A1A1AA] max-w-xl mx-auto">
            Watch how our ML models analyze markets and deliver high-confidence trading signals in real-time.
          </p>
        </motion.div>

        {/* Video Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative aspect-video rounded-2xl overflow-hidden border border-[#27272A] bg-[#0A0A0B] shadow-2xl"
        >
          {/* Thumbnail/Preview */}
          {!isPlaying && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#18181B] to-[#0A0A0B]">
              {/* Fake Dashboard Preview */}
              <div className="absolute inset-4 opacity-20">
                <div className="h-full w-full border border-[#27272A] rounded-lg p-4">
                  <div className="flex gap-4 mb-4">
                    <div className="h-20 w-1/4 bg-[#27272A] rounded-lg animate-pulse" />
                    <div className="h-20 w-1/4 bg-[#27272A] rounded-lg animate-pulse" />
                    <div className="h-20 w-1/4 bg-[#27272A] rounded-lg animate-pulse" />
                    <div className="h-20 w-1/4 bg-[#27272A] rounded-lg animate-pulse" />
                  </div>
                  <div className="h-40 bg-[#27272A] rounded-lg animate-pulse mb-4" />
                  <div className="h-32 bg-[#27272A] rounded-lg animate-pulse" />
                </div>
              </div>

              {/* Play Button */}
              <button
                onClick={() => setIsPlaying(true)}
                className="relative z-10 group"
              >
                <div className="absolute inset-0 bg-teal/20 rounded-full blur-xl group-hover:bg-teal/30 transition-all" />
                <div className="relative flex items-center justify-center w-20 h-20 bg-teal rounded-full group-hover:scale-110 transition-transform">
                  <Play className="h-8 w-8 text-[#09090B] ml-1 fill-current" />
                </div>
              </button>
              
              <p className="relative z-10 mt-6 text-sm text-[#A1A1AA]">
                Click to play • No sound by default
              </p>
            </div>
          )}

          {/* Video Player (simulated) */}
          <AnimatePresence>
            {isPlaying && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-[#09090B] flex items-center justify-center"
              >
                {/* Simulated video content - in production, use actual video */}
                <div className="w-full h-full p-8">
                  <div className="h-full border border-[#27272A] rounded-lg overflow-hidden">
                    {/* Fake dashboard animation */}
                    <div className="h-12 bg-[#18181B] border-b border-[#27272A] flex items-center px-4 gap-2">
                      <div className="w-3 h-3 rounded-full bg-danger" />
                      <div className="w-3 h-3 rounded-full bg-warning" />
                      <div className="w-3 h-3 rounded-full bg-success" />
                      <span className="ml-4 text-sm text-[#71717A]">AlphaStream Dashboard</span>
                    </div>
                    <div className="p-4 space-y-4">
                      <div className="flex gap-4">
                        <motion.div 
                          className="h-24 w-1/4 bg-[#18181B] rounded-lg border border-[#27272A] p-4"
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <p className="text-xs text-[#71717A]">Active Signals</p>
                          <p className="text-2xl font-bold text-teal mt-2">12</p>
                        </motion.div>
                        <motion.div 
                          className="h-24 w-1/4 bg-[#18181B] rounded-lg border border-[#27272A] p-4"
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                        >
                          <p className="text-xs text-[#71717A]">Win Rate</p>
                          <p className="text-2xl font-bold text-success mt-2">73%</p>
                        </motion.div>
                        <motion.div 
                          className="h-24 w-1/4 bg-[#18181B] rounded-lg border border-[#27272A] p-4"
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                        >
                          <p className="text-xs text-[#71717A]">Today&apos;s P&L</p>
                          <p className="text-2xl font-bold text-success mt-2">+$2,847</p>
                        </motion.div>
                        <motion.div 
                          className="h-24 w-1/4 bg-[#18181B] rounded-lg border border-[#27272A] p-4"
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
                        >
                          <p className="text-xs text-[#71717A]">Avg Confidence</p>
                          <p className="text-2xl font-bold text-violet mt-2">84%</p>
                        </motion.div>
                      </div>
                      <motion.div 
                        className="h-40 bg-gradient-to-r from-teal/10 to-transparent rounded-lg border border-[#27272A]"
                        animate={{ backgroundPosition: ["0%", "100%", "0%"] }}
                        transition={{ duration: 5, repeat: Infinity }}
                      />
                    </div>
                  </div>
                </div>

                {/* Controls */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsMuted(!isMuted)}
                      className="text-[#A1A1AA] hover:text-[#FAFAFA]"
                    >
                      {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-[#A1A1AA] hover:text-[#FAFAFA]"
                    >
                      <Maximize2 className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsPlaying(false)}
                      className="text-[#A1A1AA] hover:text-[#FAFAFA]"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Video highlights */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          {[
            { time: "0:15", label: "Real-time signal generation" },
            { time: "0:45", label: "Model confidence scoring" },
            { time: "1:30", label: "Backtesting walkthrough" },
          ].map((item, index) => (
            <button
              key={index}
              onClick={() => setIsPlaying(true)}
              className="p-3 rounded-lg bg-[#18181B] border border-[#27272A] hover:border-teal/30 transition-colors text-left"
            >
              <p className="text-xs text-teal font-mono">{item.time}</p>
              <p className="text-sm text-[#A1A1AA]">{item.label}</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
