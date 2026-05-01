"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Building2, 
  Shield, 
  Zap, 
  Users,
  Check,
  ArrowRight,
  Phone,
  Mail
} from "lucide-react"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { toast } from "sonner"

const enterpriseFeatures = [
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "SOC 2 compliant, SSO integration, audit logs, and dedicated security review"
  },
  {
    icon: Users,
    title: "Team Management",
    description: "Unlimited seats, role-based access, team analytics, and shared watchlists"
  },
  {
    icon: Zap,
    title: "Priority Infrastructure",
    description: "Dedicated servers, 99.99% uptime SLA, and priority signal delivery"
  },
  {
    icon: Building2,
    title: "Custom Integration",
    description: "Custom API limits, webhook configurations, and dedicated support engineer"
  },
]

const trustedBy = [
  "Hedge Fund Alpha",
  "Trading Corp",
  "Capital Partners",
  "Investment Group",
  "Quant Strategies",
  "Global Markets",
]

export default function EnterprisePage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    size: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    toast.success("Thank you! Our enterprise team will contact you within 24 hours.")
    setFormData({ name: "", email: "", company: "", size: "", message: "" })
    setIsSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-[#09090B]">
      <Navbar />
      
      {/* Hero */}
      <section className="pt-32 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-4 bg-violet/20 text-violet border-violet/30">
            <Building2 className="mr-2 h-3 w-3" />
            Enterprise Solutions
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-[#FAFAFA] mb-6">
            AlphaStream for Enterprise
          </h1>
          <p className="text-xl text-[#A1A1AA] mb-8">
            Institutional-grade signal infrastructure for hedge funds, prop firms, and trading desks
          </p>
          <div className="flex justify-center gap-4">
            <Button className="bg-violet hover:bg-violet/90 text-white" size="lg">
              <Phone className="mr-2 h-5 w-5" />
              Schedule a Demo
            </Button>
            <Button variant="outline" className="border-[#27272A] text-[#A1A1AA]" size="lg">
              <Mail className="mr-2 h-5 w-5" />
              Contact Sales
            </Button>
          </div>
        </div>
      </section>

      {/* Trusted By */}
      <section className="py-8 border-y border-[#27272A]">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-center text-[#71717A] mb-6">Trusted by leading trading firms</p>
          <div className="flex justify-center gap-8 flex-wrap">
            {trustedBy.map((company) => (
              <div key={company} className="text-[#3F3F46] font-semibold text-lg">
                {company}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#FAFAFA] mb-4">Enterprise Features</h2>
            <p className="text-[#A1A1AA]">Everything you need to power institutional trading</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {enterpriseFeatures.map((feature) => (
              <Card key={feature.title} className="bg-[#18181B] border-[#27272A]">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-violet/20 rounded-lg flex items-center justify-center shrink-0">
                      <feature.icon className="h-6 w-6 text-violet" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-[#FAFAFA] mb-2">{feature.title}</h3>
                      <p className="text-[#71717A]">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise Benefits */}
      <section className="py-16 px-4 bg-[#0A0A0B]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-[#FAFAFA] mb-6">
                Why Enterprise Teams Choose AlphaStream
              </h2>
              <div className="space-y-4">
                {[
                  "Custom API rate limits up to 10,000 requests/minute",
                  "Dedicated account manager and 24/7 phone support",
                  "On-premise deployment options available",
                  "Custom model training on proprietary data",
                  "White-label solutions for client-facing products",
                  "Comprehensive compliance and audit support",
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-teal/20 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="h-3 w-3 text-teal" />
                    </div>
                    <span className="text-[#A1A1AA]">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <Card className="bg-[#18181B] border-[#27272A]">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-[#FAFAFA] mb-6">Get in Touch</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[#FAFAFA]">Name</Label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="bg-[#0A0A0B] border-[#27272A] text-[#FAFAFA]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[#FAFAFA]">Work Email</Label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="bg-[#0A0A0B] border-[#27272A] text-[#FAFAFA]"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[#FAFAFA]">Company</Label>
                    <Input
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      required
                      className="bg-[#0A0A0B] border-[#27272A] text-[#FAFAFA]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[#FAFAFA]">Company Size</Label>
                    <Select 
                      value={formData.size} 
                      onValueChange={(v) => setFormData({ ...formData, size: v })}
                    >
                      <SelectTrigger className="bg-[#0A0A0B] border-[#27272A] text-[#FAFAFA]">
                        <SelectValue placeholder="Select company size" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#18181B] border-[#27272A]">
                        <SelectItem value="1-10">1-10 employees</SelectItem>
                        <SelectItem value="11-50">11-50 employees</SelectItem>
                        <SelectItem value="51-200">51-200 employees</SelectItem>
                        <SelectItem value="201-500">201-500 employees</SelectItem>
                        <SelectItem value="500+">500+ employees</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[#FAFAFA]">How can we help?</Label>
                    <Textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us about your trading infrastructure needs..."
                      className="bg-[#0A0A0B] border-[#27272A] text-[#FAFAFA] min-h-[100px]"
                    />
                  </div>

                  <Button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-violet hover:bg-violet/90 text-white"
                  >
                    {isSubmitting ? "Sending..." : "Request Demo"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
