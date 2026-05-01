import { Navbar } from "@/components/landing/navbar"
import { Hero } from "@/components/landing/hero"
import { LiveStatsTicker } from "@/components/landing/live-stats-ticker"
import { LiveSignalPreview } from "@/components/landing/live-signal-preview"
import { LogoWall } from "@/components/landing/logo-wall"
import { DemoVideo } from "@/components/landing/demo-video"
import { InteractiveDemo } from "@/components/landing/interactive-demo"
import { HowItWorks } from "@/components/landing/how-it-works"
import { ModelPerformance } from "@/components/landing/model-performance"
import { ROICalculator } from "@/components/landing/roi-calculator"
import { TestimonialsEnhanced } from "@/components/landing/testimonials-enhanced"
import { CompetitorComparison } from "@/components/landing/competitor-comparison"
import { TrustBadges } from "@/components/landing/trust-badges"
import { Pricing } from "@/components/landing/pricing"
import { MoneyBackGuarantee } from "@/components/landing/money-back-guarantee"
import { PressMentions } from "@/components/landing/press-mentions"
import { OpenSourceSection } from "@/components/landing/open-source-section"
import { FAQ } from "@/components/landing/faq"
import { FooterCTA } from "@/components/landing/footer-cta"
import { Footer } from "@/components/landing/footer"
import { ExitIntentPopup } from "@/components/exit-intent-popup"
import { LiveChatWidget } from "@/components/live-chat-widget"

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#09090B]">
      <Navbar />
      <Hero />
      <LiveStatsTicker />
      <LiveSignalPreview />
      <LogoWall />
      <DemoVideo />
      <InteractiveDemo />
      <HowItWorks />
      <ModelPerformance />
      <ROICalculator />
      <TestimonialsEnhanced />
      <CompetitorComparison />
      <TrustBadges />
      <Pricing />
      <MoneyBackGuarantee />
      <PressMentions />
      <OpenSourceSection />
      <FAQ />
      <FooterCTA />
      <Footer />
      <ExitIntentPopup />
      <LiveChatWidget />
    </main>
  )
}
