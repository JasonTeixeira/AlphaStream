"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  BookOpen, 
  PlayCircle, 
  FileText, 
  Search,
  Clock,
  ArrowRight,
  Star,
  Users,
  Zap
} from "lucide-react"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { cn } from "@/lib/utils"

const tutorials = [
  {
    id: 1,
    title: "Getting Started with AlphaStream",
    description: "Learn the basics of setting up your account and receiving your first signals",
    category: "beginner",
    duration: "5 min",
    type: "video",
    featured: true,
  },
  {
    id: 2,
    title: "Understanding Signal Confidence Scores",
    description: "Deep dive into how confidence scores are calculated and what they mean",
    category: "beginner",
    duration: "8 min",
    type: "video",
    featured: true,
  },
  {
    id: 3,
    title: "Setting Up Telegram Alerts",
    description: "Step-by-step guide to connecting Telegram for instant notifications",
    category: "beginner",
    duration: "4 min",
    type: "video",
    featured: false,
  },
  {
    id: 4,
    title: "Position Sizing Strategies",
    description: "Learn proper risk management and position sizing techniques",
    category: "intermediate",
    duration: "12 min",
    type: "video",
    featured: true,
  },
  {
    id: 5,
    title: "Using the Backtester",
    description: "How to test signals against historical data",
    category: "intermediate",
    duration: "15 min",
    type: "video",
    featured: false,
  },
  {
    id: 6,
    title: "API Integration Guide",
    description: "Technical guide for developers integrating with our API",
    category: "advanced",
    duration: "20 min",
    type: "article",
    featured: false,
  },
]

const guides = [
  {
    id: 1,
    title: "Complete Futures Trading Guide",
    description: "Everything you need to know about trading futures with AlphaStream signals",
    chapters: 12,
    readTime: "45 min",
    image: "/guides/futures.jpg",
  },
  {
    id: 2,
    title: "Risk Management Playbook",
    description: "Master the art of protecting your capital while maximizing returns",
    chapters: 8,
    readTime: "30 min",
    image: "/guides/risk.jpg",
  },
  {
    id: 3,
    title: "ML Models Explained",
    description: "Understand the machine learning algorithms powering our signals",
    chapters: 6,
    readTime: "25 min",
    image: "/guides/ml.jpg",
  },
]

const glossaryTerms = [
  { term: "Confidence Score", definition: "A percentage indicating the model's certainty in a signal" },
  { term: "Drawdown", definition: "The peak-to-trough decline during a specific period" },
  { term: "Sharpe Ratio", definition: "Risk-adjusted return measure comparing excess returns to volatility" },
  { term: "Win Rate", definition: "Percentage of trades that result in a profit" },
  { term: "Profit Factor", definition: "Gross profits divided by gross losses" },
  { term: "Position Sizing", definition: "Determining the number of units to trade based on risk tolerance" },
]

export default function LearnPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")

  const filteredTutorials = tutorials.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = activeCategory === "all" || t.category === activeCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-[#09090B]">
      <Navbar />
      
      {/* Hero */}
      <section className="pt-32 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-4 bg-teal/20 text-teal border-teal/30">
            <BookOpen className="mr-2 h-3 w-3" />
            Learning Center
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-[#FAFAFA] mb-6">
            Master Trading with AlphaStream
          </h1>
          <p className="text-xl text-[#A1A1AA] mb-8">
            Video tutorials, guides, and resources to help you get the most out of our platform
          </p>
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#71717A]" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tutorials and guides..."
              className="pl-12 h-12 bg-[#18181B] border-[#27272A] text-[#FAFAFA]"
            />
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-8 border-y border-[#27272A]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-3xl font-bold text-[#FAFAFA]">25+</p>
              <p className="text-[#71717A]">Video Tutorials</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-[#FAFAFA]">10+</p>
              <p className="text-[#71717A]">Strategy Guides</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-[#FAFAFA]">50K+</p>
              <p className="text-[#71717A]">Students</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="tutorials" className="space-y-8">
            <TabsList className="bg-[#18181B] border border-[#27272A]">
              <TabsTrigger value="tutorials" className="data-[state=active]:bg-teal data-[state=active]:text-[#09090B]">
                <PlayCircle className="mr-2 h-4 w-4" />
                Video Tutorials
              </TabsTrigger>
              <TabsTrigger value="guides" className="data-[state=active]:bg-teal data-[state=active]:text-[#09090B]">
                <FileText className="mr-2 h-4 w-4" />
                Guides
              </TabsTrigger>
              <TabsTrigger value="glossary" className="data-[state=active]:bg-teal data-[state=active]:text-[#09090B]">
                <BookOpen className="mr-2 h-4 w-4" />
                Glossary
              </TabsTrigger>
            </TabsList>

            {/* Tutorials Tab */}
            <TabsContent value="tutorials" className="space-y-6">
              {/* Category Filter */}
              <div className="flex gap-2">
                {["all", "beginner", "intermediate", "advanced"].map((cat) => (
                  <Button
                    key={cat}
                    variant={activeCategory === cat ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveCategory(cat)}
                    className={cn(
                      activeCategory === cat 
                        ? "bg-teal text-[#09090B]" 
                        : "border-[#27272A] text-[#A1A1AA]"
                    )}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </Button>
                ))}
              </div>

              {/* Featured Tutorials */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTutorials.map((tutorial) => (
                  <Card key={tutorial.id} className="bg-[#18181B] border-[#27272A] hover:border-[#3F3F46] transition-colors cursor-pointer group">
                    <CardContent className="p-0">
                      {/* Video Thumbnail */}
                      <div className="relative aspect-video bg-[#27272A] rounded-t-lg overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-16 h-16 bg-teal/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                            <PlayCircle className="h-8 w-8 text-[#09090B]" />
                          </div>
                        </div>
                        {tutorial.featured && (
                          <Badge className="absolute top-3 left-3 bg-violet text-white border-0">
                            <Star className="mr-1 h-3 w-3" />
                            Featured
                          </Badge>
                        )}
                        <Badge className="absolute top-3 right-3 bg-[#09090B]/80 text-[#FAFAFA] border-0">
                          <Clock className="mr-1 h-3 w-3" />
                          {tutorial.duration}
                        </Badge>
                      </div>
                      
                      {/* Content */}
                      <div className="p-4">
                        <Badge 
                          variant="outline" 
                          className={cn(
                            "mb-2 text-xs",
                            tutorial.category === "beginner" && "border-success/30 text-success",
                            tutorial.category === "intermediate" && "border-warning/30 text-warning",
                            tutorial.category === "advanced" && "border-danger/30 text-danger",
                          )}
                        >
                          {tutorial.category}
                        </Badge>
                        <h3 className="font-semibold text-[#FAFAFA] mb-1 group-hover:text-teal transition-colors">
                          {tutorial.title}
                        </h3>
                        <p className="text-sm text-[#71717A]">{tutorial.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Guides Tab */}
            <TabsContent value="guides" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {guides.map((guide) => (
                  <Card key={guide.id} className="bg-[#18181B] border-[#27272A] hover:border-[#3F3F46] transition-colors cursor-pointer group">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 bg-teal/20 rounded-lg flex items-center justify-center mb-4">
                        <FileText className="h-6 w-6 text-teal" />
                      </div>
                      <h3 className="font-semibold text-lg text-[#FAFAFA] mb-2 group-hover:text-teal transition-colors">
                        {guide.title}
                      </h3>
                      <p className="text-sm text-[#71717A] mb-4">{guide.description}</p>
                      <div className="flex items-center gap-4 text-sm text-[#A1A1AA]">
                        <span>{guide.chapters} chapters</span>
                        <span>{guide.readTime} read</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Glossary Tab */}
            <TabsContent value="glossary" className="space-y-4">
              <Card className="bg-[#18181B] border-[#27272A]">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {glossaryTerms.map((item, index) => (
                      <div 
                        key={index}
                        className="flex flex-col md:flex-row md:items-start gap-2 pb-4 border-b border-[#27272A] last:border-0 last:pb-0"
                      >
                        <span className="font-semibold text-teal md:w-48 shrink-0">
                          {item.term}
                        </span>
                        <span className="text-[#A1A1AA]">
                          {item.definition}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Webinar CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-teal/10 to-violet/10 border-y border-[#27272A]">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-4 bg-violet/20 text-violet border-violet/30">
            <Users className="mr-2 h-3 w-3" />
            Live Webinars
          </Badge>
          <h2 className="text-3xl font-bold text-[#FAFAFA] mb-4">
            Join Our Weekly Market Analysis
          </h2>
          <p className="text-[#A1A1AA] mb-6">
            Every Wednesday at 4PM EST, our analysts review signals and discuss market conditions live.
          </p>
          <Button className="bg-violet hover:bg-violet/90 text-white">
            Register for Next Webinar
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  )
}
