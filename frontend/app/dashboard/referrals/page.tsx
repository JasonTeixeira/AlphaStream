"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { 
  Gift, 
  Users, 
  DollarSign, 
  Copy, 
  Share2,
  Twitter,
  Mail,
  Check,
  ArrowRight,
  Star
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const referralStats = {
  totalReferrals: 12,
  activeReferrals: 8,
  pendingReferrals: 4,
  totalEarnings: 480,
  pendingEarnings: 120,
  referralCode: "YOUR-CODE-HERE",
  referralLink: "https://alphastream-iota.vercel.app/ref/your-code",
}

const referredUsers = [
  { name: "Mike T.", date: "Aug 12, 2024", status: "active", earnings: 40 },
  { name: "Sarah K.", date: "Aug 10, 2024", status: "active", earnings: 40 },
  { name: "David L.", date: "Aug 8, 2024", status: "active", earnings: 40 },
  { name: "Emily R.", date: "Aug 5, 2024", status: "pending", earnings: 0 },
  { name: "James W.", date: "Aug 3, 2024", status: "active", earnings: 40 },
]

const rewards = [
  { tier: 1, referrals: 5, reward: "1 Month Free", achieved: true },
  { tier: 2, referrals: 10, reward: "3 Months Free", achieved: true },
  { tier: 3, referrals: 25, reward: "1 Year Free", achieved: false },
  { tier: 4, referrals: 50, reward: "Lifetime Access", achieved: false },
]

export default function ReferralsPage() {
  const [copied, setCopied] = useState(false)

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    toast.success("Copied to clipboard!")
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = (platform: string) => {
    const text = `Join AlphaStream and get ML-powered trading signals! Use my referral link: ${referralStats.referralLink}`
    
    if (platform === "twitter") {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank")
    } else if (platform === "email") {
      window.open(`mailto:?subject=Check out AlphaStream&body=${encodeURIComponent(text)}`, "_blank")
    }
  }

  const nextTier = rewards.find(r => !r.achieved)
  const progressToNextTier = nextTier 
    ? (referralStats.totalReferrals / nextTier.referrals) * 100 
    : 100

  return (
    <div className="min-h-screen bg-[#09090B]">
      <div className="border-b border-[#27272A] bg-[#09090B]/80 backdrop-blur-lg">
        <div className="px-4 md:px-6 py-6">
          <h1 className="text-2xl font-bold text-[#FAFAFA]">Referral Program</h1>
          <p className="text-[#A1A1AA] mt-1">Invite friends and earn rewards</p>
        </div>
      </div>

      <div className="p-4 md:p-6 space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-[#18181B] border-[#27272A]">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-[#71717A] text-sm mb-1">
                <Users className="h-4 w-4" />
                Total Referrals
              </div>
              <p className="text-2xl font-bold text-[#FAFAFA] font-mono">
                {referralStats.totalReferrals}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#18181B] border-[#27272A]">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-[#71717A] text-sm mb-1">
                <Check className="h-4 w-4" />
                Active
              </div>
              <p className="text-2xl font-bold text-success font-mono">
                {referralStats.activeReferrals}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#18181B] border-[#27272A]">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-[#71717A] text-sm mb-1">
                <DollarSign className="h-4 w-4" />
                Total Earned
              </div>
              <p className="text-2xl font-bold text-teal font-mono">
                ${referralStats.totalEarnings}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#18181B] border-[#27272A]">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-[#71717A] text-sm mb-1">
                <Gift className="h-4 w-4" />
                Pending
              </div>
              <p className="text-2xl font-bold text-warning font-mono">
                ${referralStats.pendingEarnings}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Referral Link */}
          <Card className="bg-[#18181B] border-[#27272A]">
            <CardHeader>
              <CardTitle className="text-lg text-[#FAFAFA]">Your Referral Link</CardTitle>
              <CardDescription className="text-[#71717A]">
                Share this link to earn $40 for every friend who subscribes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={referralStats.referralLink}
                  readOnly
                  className="bg-[#0A0A0B] border-[#27272A] text-[#FAFAFA] font-mono text-sm"
                />
                <Button 
                  onClick={() => handleCopy(referralStats.referralLink)}
                  className="bg-teal hover:bg-teal/90 text-[#09090B] shrink-0"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>

              <div className="p-3 bg-[#0A0A0B] rounded-lg border border-[#27272A]">
                <p className="text-sm text-[#71717A]">Referral Code</p>
                <p className="font-mono font-semibold text-teal">{referralStats.referralCode}</p>
              </div>

              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => handleShare("twitter")}
                  className="flex-1 border-[#27272A] text-[#A1A1AA]"
                >
                  <Twitter className="mr-2 h-4 w-4" />
                  Twitter
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => handleShare("email")}
                  className="flex-1 border-[#27272A] text-[#A1A1AA]"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Email
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 border-[#27272A] text-[#A1A1AA]"
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Rewards Tiers */}
          <Card className="bg-[#18181B] border-[#27272A]">
            <CardHeader>
              <CardTitle className="text-lg text-[#FAFAFA]">Reward Tiers</CardTitle>
              <CardDescription className="text-[#71717A]">
                Unlock exclusive rewards as you refer more friends
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {nextTier && (
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-[#A1A1AA]">Progress to next tier</span>
                    <span className="text-[#FAFAFA]">{referralStats.totalReferrals}/{nextTier.referrals}</span>
                  </div>
                  <Progress value={progressToNextTier} className="h-2 bg-[#27272A]" />
                </div>
              )}

              <div className="space-y-3">
                {rewards.map((reward) => (
                  <div 
                    key={reward.tier}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-lg border",
                      reward.achieved 
                        ? "bg-teal/10 border-teal/30" 
                        : "bg-[#0A0A0B] border-[#27272A]"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center",
                        reward.achieved ? "bg-teal/20" : "bg-[#27272A]"
                      )}>
                        {reward.achieved ? (
                          <Check className="h-4 w-4 text-teal" />
                        ) : (
                          <Star className="h-4 w-4 text-[#71717A]" />
                        )}
                      </div>
                      <div>
                        <p className={cn(
                          "font-medium",
                          reward.achieved ? "text-[#FAFAFA]" : "text-[#A1A1AA]"
                        )}>
                          {reward.referrals} Referrals
                        </p>
                        <p className="text-sm text-[#71717A]">{reward.reward}</p>
                      </div>
                    </div>
                    {reward.achieved && (
                      <Badge className="bg-success/20 text-success border-success/30">
                        Unlocked
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Referred Users */}
        <Card className="bg-[#18181B] border-[#27272A]">
          <CardHeader>
            <CardTitle className="text-lg text-[#FAFAFA]">Your Referrals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {referredUsers.map((user, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 bg-[#0A0A0B] rounded-lg border border-[#27272A]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#27272A] rounded-full flex items-center justify-center">
                      <span className="text-[#FAFAFA] font-medium">
                        {user.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-[#FAFAFA]">{user.name}</p>
                      <p className="text-sm text-[#71717A]">Joined {user.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge className={cn(
                      "text-xs",
                      user.status === "active" 
                        ? "bg-success/20 text-success border-success/30"
                        : "bg-warning/20 text-warning border-warning/30"
                    )}>
                      {user.status}
                    </Badge>
                    {user.earnings > 0 && (
                      <span className="font-mono text-teal">+${user.earnings}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
