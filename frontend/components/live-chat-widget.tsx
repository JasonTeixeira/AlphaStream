"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MessageCircle, X, Send, Minus, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

const quickReplies = [
  "How does the free trial work?",
  "What&apos;s the win rate?",
  "Which markets do you cover?",
  "How do I connect to TradingView?",
]

const initialMessages = [
  {
    id: 1,
    type: "bot",
    message: "Hey there! I'm here to help you learn about AlphaStream. What would you like to know?",
    time: "Just now",
  },
]

export function LiveChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState(initialMessages)
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  const handleSend = (text?: string) => {
    const messageText = text || inputValue
    if (!messageText.trim()) return

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      type: "user",
      message: messageText,
      time: "Just now",
    }
    setMessages((prev) => [...prev, userMessage])
    setInputValue("")

    // Simulate bot typing
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      const botResponse = {
        id: messages.length + 2,
        type: "bot",
        message: getBotResponse(messageText),
        time: "Just now",
      }
      setMessages((prev) => [...prev, botResponse])
    }, 1500)
  }

  const getBotResponse = (question: string): string => {
    const q = question.toLowerCase()
    if (q.includes("free trial") || q.includes("trial")) {
      return "Our free trial gives you 14 days of full access to all Pro features. No credit card required to start!"
    }
    if (q.includes("win rate") || q.includes("accuracy")) {
      return "Our verified win rate is 73.2% across all signals. You can see our full track record on our public performance page."
    }
    if (q.includes("market") || q.includes("cover") || q.includes("asset")) {
      return "We cover futures (NQ, ES, CL, GC), crypto (BTC, ETH), and more. Our Pro plan includes all markets."
    }
    if (q.includes("tradingview") || q.includes("trading view")) {
      return "You can export our signals as TradingView alerts with one click. We also support webhooks for custom integrations."
    }
    if (q.includes("price") || q.includes("cost") || q.includes("pricing")) {
      return "We have three plans: Starter (free), Pro ($99/mo), and Enterprise (custom). The Pro plan is most popular."
    }
    return "Great question! For more detailed info, I'd recommend starting a free trial or reaching out to our team at support@alphastream.ai"
  }

  return (
    <>
      {/* Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              onClick={() => setIsOpen(true)}
              className="h-14 w-14 rounded-full bg-teal hover:bg-teal/90 text-[#09090B] shadow-lg"
            >
              <MessageCircle className="h-6 w-6" />
            </Button>
            {/* Notification dot */}
            <span className="absolute top-0 right-0 w-3 h-3 bg-danger rounded-full animate-pulse" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: isMinimized ? "auto" : "500px"
            }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] bg-[#18181B] border border-[#27272A] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#27272A] bg-[#0A0A0B]">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="h-10 w-10 border-2 border-teal">
                    <AvatarFallback className="bg-teal/20 text-teal">
                      <Sparkles className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-[#0A0A0B]" />
                </div>
                <div>
                  <p className="font-semibold text-[#FAFAFA]">AlphaStream Support</p>
                  <p className="text-xs text-success">Online now</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="text-[#71717A] hover:text-[#FAFAFA]"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="text-[#71717A] hover:text-[#FAFAFA]"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={cn(
                        "flex",
                        msg.type === "user" ? "justify-end" : "justify-start"
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[80%] rounded-2xl px-4 py-2",
                          msg.type === "user"
                            ? "bg-teal text-[#09090B] rounded-br-sm"
                            : "bg-[#27272A] text-[#FAFAFA] rounded-bl-sm"
                        )}
                      >
                        <p className="text-sm">{msg.message}</p>
                        <p className={cn(
                          "text-[10px] mt-1",
                          msg.type === "user" ? "text-[#09090B]/60" : "text-[#71717A]"
                        )}>
                          {msg.time}
                        </p>
                      </div>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-[#27272A] rounded-2xl rounded-bl-sm px-4 py-3">
                        <div className="flex items-center gap-1">
                          <span className="w-2 h-2 bg-[#71717A] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                          <span className="w-2 h-2 bg-[#71717A] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                          <span className="w-2 h-2 bg-[#71717A] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick Replies */}
                {messages.length === 1 && (
                  <div className="px-4 pb-2 flex flex-wrap gap-2">
                    {quickReplies.map((reply, index) => (
                      <button
                        key={index}
                        onClick={() => handleSend(reply.replace(/&apos;/g, "'"))}
                        className="text-xs px-3 py-1.5 rounded-full bg-[#27272A] text-[#A1A1AA] hover:bg-[#3F3F46] hover:text-[#FAFAFA] transition-colors"
                      >
                        {reply.replace(/&apos;/g, "'")}
                      </button>
                    ))}
                  </div>
                )}

                {/* Input */}
                <div className="p-4 border-t border-[#27272A]">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      handleSend()
                    }}
                    className="flex items-center gap-2"
                  >
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 bg-[#0A0A0B] border-[#27272A] text-[#FAFAFA] placeholder:text-[#71717A]"
                    />
                    <Button
                      type="submit"
                      size="icon"
                      className="bg-teal hover:bg-teal/90 text-[#09090B]"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
