import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, BookOpen, Code, Zap, Database, Brain, ExternalLink } from "lucide-react"

const sections = [
  {
    icon: BookOpen,
    title: "Getting Started",
    description: "Learn the basics of AlphaStream and how to integrate signals into your trading workflow.",
    href: "#getting-started",
  },
  {
    icon: Code,
    title: "API Reference",
    description: "Complete API documentation with endpoints, authentication, and code examples.",
    href: "#api-reference",
  },
  {
    icon: Brain,
    title: "ML Models",
    description: "Deep dive into our machine learning models, training methodology, and performance metrics.",
    href: "#models",
  },
  {
    icon: Database,
    title: "Data Sources",
    description: "Information about market data providers, indicators, and feature engineering.",
    href: "#data",
  },
]

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-[#09090B]">
      {/* Header */}
      <header className="border-b border-[#27272A]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Zap className="h-6 w-6 text-teal" />
              <span className="font-bold text-[#FAFAFA]">AlphaStream</span>
              <Badge variant="outline" className="ml-2 border-[#27272A] text-[#71717A]">Docs</Badge>
            </Link>
            <Button asChild className="bg-teal hover:bg-teal/90 text-[#09090B]">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <Link href="/" className="inline-flex items-center text-sm text-[#71717A] hover:text-teal mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-[#FAFAFA] mb-4">Documentation</h1>
          <p className="text-lg text-[#A1A1AA]">
            Everything you need to integrate AlphaStream signals into your trading systems.
          </p>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
          {sections.map((section) => (
            <Card key={section.title} className="bg-[#18181B] border-[#27272A] hover:border-teal/30 transition-colors">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <section.icon className="h-5 w-5 text-teal" />
                  <CardTitle className="text-lg text-[#FAFAFA]">{section.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-[#A1A1AA] text-sm">{section.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Getting Started */}
        <section id="getting-started" className="mb-16">
          <h2 className="text-2xl font-bold text-[#FAFAFA] mb-6">Getting Started</h2>
          
          <div className="prose prose-invert max-w-none">
            <Card className="bg-[#18181B] border-[#27272A] mb-6">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-[#FAFAFA] mb-4">1. Create an Account</h3>
                <p className="text-[#A1A1AA] mb-4">
                  Sign up for a free 14-day trial to access the dashboard and API. No credit card required.
                </p>
                <Button asChild className="bg-teal hover:bg-teal/90 text-[#09090B]">
                  <Link href="/dashboard">Start Free Trial</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-[#18181B] border-[#27272A] mb-6">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-[#FAFAFA] mb-4">2. Get Your API Key</h3>
                <p className="text-[#A1A1AA] mb-4">
                  Navigate to Settings → API Keys in the dashboard to generate your API key.
                </p>
                <pre className="p-4 bg-[#0A0A0B] border border-[#27272A] rounded-lg overflow-x-auto">
                  <code className="text-sm text-teal font-mono">Authorization: Bearer sk_live_your_key_here</code>
                </pre>
              </CardContent>
            </Card>

            <Card className="bg-[#18181B] border-[#27272A]">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-[#FAFAFA] mb-4">3. Make Your First Request</h3>
                <p className="text-[#A1A1AA] mb-4">
                  Fetch the latest trading signals with a simple HTTP request:
                </p>
                <pre className="p-4 bg-[#0A0A0B] border border-[#27272A] rounded-lg overflow-x-auto">
                  <code className="text-sm text-[#A1A1AA] font-mono">{`curl -H "Authorization: Bearer YOUR_API_KEY" \\
  https://api.alphastream.io/v1/signals`}</code>
                </pre>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* API Reference */}
        <section id="api-reference" className="mb-16">
          <h2 className="text-2xl font-bold text-[#FAFAFA] mb-6">API Reference</h2>
          <p className="text-[#A1A1AA] mb-6">
            Full API documentation is available in the dashboard for authenticated users.
          </p>
          <Button asChild variant="outline" className="border-[#27272A] text-[#A1A1AA] hover:text-[#FAFAFA]">
            <Link href="/dashboard/api-keys">
              View Full API Docs
              <ExternalLink className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </section>

        {/* Models */}
        <section id="models" className="mb-16">
          <h2 className="text-2xl font-bold text-[#FAFAFA] mb-6">ML Models</h2>
          <div className="space-y-4">
            {[
              { name: "XGBoost", accuracy: "74.2%", description: "Gradient boosted trees optimized for tabular financial data" },
              { name: "LightGBM", accuracy: "72.8%", description: "Fast gradient boosting with leaf-wise growth strategy" },
              { name: "LSTM", accuracy: "71.5%", description: "Recurrent neural network for sequential pattern recognition" },
              { name: "Random Forest", accuracy: "69.3%", description: "Ensemble of decision trees for robust predictions" },
              { name: "Ensemble", accuracy: "73.1%", description: "Meta-model combining predictions from all base models" },
            ].map((model) => (
              <Card key={model.name} className="bg-[#18181B] border-[#27272A]">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-[#FAFAFA]">{model.name}</h3>
                    <p className="text-sm text-[#71717A]">{model.description}</p>
                  </div>
                  <Badge className="bg-teal/20 text-teal border-teal/30 font-mono">{model.accuracy}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Support */}
        <section className="text-center py-12 border-t border-[#27272A]">
          <h2 className="text-xl font-semibold text-[#FAFAFA] mb-4">Need Help?</h2>
          <p className="text-[#A1A1AA] mb-6">
            Join our Discord community or reach out via email for support.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button variant="outline" className="border-[#27272A] text-[#A1A1AA] hover:text-[#FAFAFA]">
              Join Discord
            </Button>
            <Button variant="outline" className="border-[#27272A] text-[#A1A1AA] hover:text-[#FAFAFA]">
              Contact Support
            </Button>
          </div>
        </section>
      </main>
    </div>
  )
}
