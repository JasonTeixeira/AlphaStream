"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  Users, 
  MessageCircle, 
  Trophy, 
  Star,
  ArrowRight,
  ExternalLink,
  TrendingUp,
  Crown
} from "lucide-react"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { cn } from "@/lib/utils"

const leaderboard = [
  { rank: 1, name: "CryptoKing_42", returns: 847.2, trades: 234, winRate: 78.5, badge: "crown" },
  { rank: 2, name: "FuturesTrader", returns: 623.8, trades: 189, winRate: 72.3, badge: "star" },
  { rank: 3, name: "AlphaHunter", returns: 512.4, trades: 156, winRate: 69.8, badge: "star" },
  { rank: 4, name: "NQMaster", returns: 445.1, trades: 201, winRate: 67.4, badge: null },
  { rank: 5, name: "SwingTraderPro", returns: 398.7, trades: 98, winRate: 75.2, badge: null },
  { rank: 6, name: "ESWarrior", returns: 356.2, trades: 167, winRate: 64.1, badge: null },
  { rank: 7, name: "GoldBug2024", returns: 312.5, trades: 112, winRate: 68.9, badge: null },
  { rank: 8, name: "TechTrader", returns: 289.3, trades: 145, winRate: 62.4, badge: null },
  { rank: 9, name: "MomentumKing", returns: 267.8, trades: 178, winRate: 61.2, badge: null },
  { rank: 10, name: "ValueHunter", returns: 245.1, trades: 89, winRate: 70.5, badge: null },
]

const achievements = [
  { name: "First Trade", description: "Execute your first signal", icon: Star, earned: true },
  { name: "Winning Streak", description: "5 profitable trades in a row", icon: TrendingUp, earned: true },
  { name: "Top Performer", description: "Reach top 100 on leaderboard", icon: Trophy, earned: false },
  { name: "Community Helper", description: "Help 10 traders in Discord", icon: Users, earned: false },
]

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-[#09090B]">
      <Navbar />
      
      {/* Hero */}
      <section className="pt-32 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-4 bg-violet/20 text-violet border-violet/30">
            <Users className="mr-2 h-3 w-3" />
            Community
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-[#FAFAFA] mb-6">
            Join 50,000+ Traders
          </h1>
          <p className="text-xl text-[#A1A1AA] mb-8">
            Connect with fellow traders, share strategies, and learn from the best in our active community
          </p>
          <div className="flex justify-center gap-4">
            <Button className="bg-[#5865F2] hover:bg-[#5865F2]/90 text-white" asChild>
              <a href="https://discord.gg/alphastream" target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2 h-5 w-5" />
                Join Discord
              </a>
            </Button>
            <Button variant="outline" className="border-[#27272A] text-[#A1A1AA]" asChild>
              <a href="https://t.me/alphastream" target="_blank" rel="noopener noreferrer">
                Join Telegram
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8 border-y border-[#27272A]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl font-bold text-[#FAFAFA]">50K+</p>
              <p className="text-[#71717A]">Members</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-[#FAFAFA]">24/7</p>
              <p className="text-[#71717A]">Active Chat</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-[#FAFAFA]">100+</p>
              <p className="text-[#71717A]">Daily Discussions</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-[#FAFAFA]">5</p>
              <p className="text-[#71717A]">Weekly Events</p>
            </div>
          </div>
        </div>
      </section>

      {/* Leaderboard */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-[#FAFAFA]">Top Performers</h2>
              <p className="text-[#71717A]">Monthly leaderboard based on verified returns</p>
            </div>
            <Badge className="bg-warning/20 text-warning border-warning/30">
              August 2024
            </Badge>
          </div>

          <Card className="bg-[#18181B] border-[#27272A]">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#27272A]">
                      <th className="text-left py-4 px-6 text-sm font-medium text-[#71717A]">Rank</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-[#71717A]">Trader</th>
                      <th className="text-right py-4 px-6 text-sm font-medium text-[#71717A]">Returns</th>
                      <th className="text-right py-4 px-6 text-sm font-medium text-[#71717A]">Trades</th>
                      <th className="text-right py-4 px-6 text-sm font-medium text-[#71717A]">Win Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.map((trader) => (
                      <tr key={trader.rank} className="border-b border-[#27272A]/50 hover:bg-[#27272A]/30 transition-colors">
                        <td className="py-4 px-6">
                          <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center font-bold",
                            trader.rank === 1 && "bg-warning/20 text-warning",
                            trader.rank === 2 && "bg-[#A1A1AA]/20 text-[#A1A1AA]",
                            trader.rank === 3 && "bg-[#CD7F32]/20 text-[#CD7F32]",
                            trader.rank > 3 && "bg-[#27272A] text-[#71717A]"
                          )}>
                            {trader.rank}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className="bg-teal/20 text-teal">
                                {trader.name.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-[#FAFAFA]">{trader.name}</span>
                              {trader.badge === "crown" && <Crown className="h-4 w-4 text-warning" />}
                              {trader.badge === "star" && <Star className="h-4 w-4 text-violet" />}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <span className="font-semibold text-success font-mono">+{trader.returns}%</span>
                        </td>
                        <td className="py-4 px-6 text-right text-[#A1A1AA] font-mono">{trader.trades}</td>
                        <td className="py-4 px-6 text-right">
                          <span className={cn(
                            "font-mono",
                            trader.winRate >= 70 ? "text-success" : "text-[#A1A1AA]"
                          )}>
                            {trader.winRate}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-16 px-4 bg-[#0A0A0B]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-[#FAFAFA] mb-2">Earn Achievements</h2>
            <p className="text-[#71717A]">Complete challenges and earn badges to showcase your trading journey</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {achievements.map((achievement) => (
              <Card 
                key={achievement.name}
                className={cn(
                  "bg-[#18181B] border-[#27272A]",
                  achievement.earned && "border-teal/30"
                )}
              >
                <CardContent className="p-6 text-center">
                  <div className={cn(
                    "w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4",
                    achievement.earned ? "bg-teal/20" : "bg-[#27272A]"
                  )}>
                    <achievement.icon className={cn(
                      "h-8 w-8",
                      achievement.earned ? "text-teal" : "text-[#71717A]"
                    )} />
                  </div>
                  <h3 className={cn(
                    "font-semibold mb-1",
                    achievement.earned ? "text-[#FAFAFA]" : "text-[#71717A]"
                  )}>
                    {achievement.name}
                  </h3>
                  <p className="text-xs text-[#71717A]">{achievement.description}</p>
                  {achievement.earned && (
                    <Badge className="mt-3 bg-success/20 text-success border-success/30 text-xs">
                      Earned
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Join CTA */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-[#FAFAFA] mb-4">
            Ready to Join the Community?
          </h2>
          <p className="text-[#A1A1AA] mb-8">
            Get instant access to our Discord server, exclusive channels, and connect with traders worldwide
          </p>
          <Button className="bg-[#5865F2] hover:bg-[#5865F2]/90 text-white" size="lg" asChild>
            <a href="https://discord.gg/alphastream" target="_blank" rel="noopener noreferrer">
              <MessageCircle className="mr-2 h-5 w-5" />
              Join Discord Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  )
}
