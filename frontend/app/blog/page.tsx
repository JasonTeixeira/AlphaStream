"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Calendar, Clock, ArrowRight, TrendingUp } from "lucide-react"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"

const featuredPost = {
  title: "How Our ML Models Predicted the August Rally",
  excerpt: "A deep dive into how AlphaStream's machine learning algorithms identified key market signals that led to profitable positions during the recent market rally.",
  date: "Aug 15, 2024",
  readTime: "8 min read",
  category: "Analysis",
  image: "/blog/featured.jpg",
  slug: "ml-models-august-rally",
}

const posts = [
  {
    title: "Understanding Market Microstructure for Better Signals",
    excerpt: "How order flow and market microstructure data improves our signal accuracy.",
    date: "Aug 12, 2024",
    readTime: "6 min read",
    category: "Education",
    slug: "market-microstructure",
  },
  {
    title: "Risk Management: The Key to Long-Term Success",
    excerpt: "Why proper position sizing matters more than win rate.",
    date: "Aug 10, 2024",
    readTime: "5 min read",
    category: "Strategy",
    slug: "risk-management",
  },
  {
    title: "New Feature: TradingView Integration",
    excerpt: "Announcing seamless integration with TradingView for real-time alerts.",
    date: "Aug 8, 2024",
    readTime: "3 min read",
    category: "Product",
    slug: "tradingview-integration",
  },
  {
    title: "Backtesting Strategies: What Works and What Doesn't",
    excerpt: "Common pitfalls in backtesting and how to avoid overfitting.",
    date: "Aug 5, 2024",
    readTime: "7 min read",
    category: "Education",
    slug: "backtesting-strategies",
  },
  {
    title: "Monthly Performance Review: July 2024",
    excerpt: "Detailed breakdown of our signal performance across all markets.",
    date: "Aug 1, 2024",
    readTime: "10 min read",
    category: "Performance",
    slug: "july-2024-review",
  },
  {
    title: "The Psychology of Following Signals",
    excerpt: "How to maintain discipline when trading with algorithmic signals.",
    date: "Jul 28, 2024",
    readTime: "6 min read",
    category: "Psychology",
    slug: "trading-psychology",
  },
]

const categories = ["All", "Analysis", "Education", "Strategy", "Product", "Performance", "Psychology"]

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[#09090B]">
      <Navbar />
      
      {/* Hero */}
      <section className="pt-32 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
            <div>
              <Badge className="mb-4 bg-teal/20 text-teal border-teal/30">
                <TrendingUp className="mr-2 h-3 w-3" />
                Insights & Analysis
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-[#FAFAFA]">
                AlphaStream Blog
              </h1>
              <p className="text-[#A1A1AA] mt-2">
                Market insights, product updates, and trading education
              </p>
            </div>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#71717A]" />
              <Input
                placeholder="Search articles..."
                className="pl-10 bg-[#18181B] border-[#27272A] text-[#FAFAFA]"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="flex gap-2 flex-wrap mb-8">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant="outline"
                size="sm"
                className={cat === "All" 
                  ? "bg-teal text-[#09090B] border-teal" 
                  : "border-[#27272A] text-[#A1A1AA]"
                }
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="px-4 pb-16">
        <div className="max-w-6xl mx-auto">
          <Card className="bg-[#18181B] border-[#27272A] overflow-hidden group cursor-pointer">
            <CardContent className="p-0">
              <div className="grid md:grid-cols-2">
                <div className="aspect-[4/3] md:aspect-auto bg-gradient-to-br from-teal/20 to-violet/20 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <TrendingUp className="h-24 w-24 text-teal/30" />
                  </div>
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <Badge className="w-fit mb-4 bg-teal/20 text-teal border-teal/30">
                    {featuredPost.category}
                  </Badge>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#FAFAFA] mb-4 group-hover:text-teal transition-colors">
                    {featuredPost.title}
                  </h2>
                  <p className="text-[#A1A1AA] mb-6">{featuredPost.excerpt}</p>
                  <div className="flex items-center gap-4 text-sm text-[#71717A]">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {featuredPost.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {featuredPost.readTime}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* All Posts Grid */}
      <section className="px-4 pb-24">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-[#FAFAFA] mb-8">Latest Articles</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Card key={post.slug} className="bg-[#18181B] border-[#27272A] hover:border-[#3F3F46] transition-colors cursor-pointer group">
                <CardContent className="p-6">
                  <Badge variant="outline" className="mb-3 border-[#27272A] text-[#71717A]">
                    {post.category}
                  </Badge>
                  <h3 className="font-semibold text-lg text-[#FAFAFA] mb-2 group-hover:text-teal transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-[#71717A] mb-4 line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-sm text-[#A1A1AA]">
                    <span>{post.date}</span>
                    <span>{post.readTime}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" className="border-[#27272A] text-[#A1A1AA]">
              Load More Articles
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
