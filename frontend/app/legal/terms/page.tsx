import Link from "next/link"
import { Zap, ArrowLeft } from "lucide-react"

export const metadata = {
  title: "Terms of Service | AlphaStream",
  description: "Read the terms and conditions for using AlphaStream services.",
}

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-[#09090B]">
      {/* Navigation */}
      <nav className="border-b border-[#27272A] bg-[#09090B]/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <Zap className="h-6 w-6 text-teal" />
              <span className="font-bold text-[#FAFAFA]">AlphaStream</span>
            </Link>
            <Link 
              href="/" 
              className="flex items-center gap-2 text-sm text-[#A1A1AA] hover:text-[#FAFAFA] transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-[#FAFAFA] mb-4">Terms of Service</h1>
        <p className="text-[#71717A] mb-8">Last updated: April 30, 2025</p>

        <div className="prose prose-invert prose-zinc max-w-none">
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-[#FAFAFA] mb-4">1. Acceptance of Terms</h2>
            <p className="text-[#A1A1AA] mb-4">
              By accessing or using AlphaStream&apos;s website, applications, and services (collectively, 
              the &quot;Services&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you 
              do not agree to these Terms, do not use our Services.
            </p>
            <p className="text-[#A1A1AA]">
              We reserve the right to modify these Terms at any time. Your continued use of the 
              Services after any changes constitutes acceptance of the new Terms.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-[#FAFAFA] mb-4">2. Description of Services</h2>
            <p className="text-[#A1A1AA] mb-4">
              AlphaStream provides machine learning-powered trading signals, market analysis, 
              backtesting tools, and related financial technology services. Our Services include:
            </p>
            <ul className="list-disc list-inside text-[#A1A1AA] mb-4 space-y-2">
              <li>Real-time trading signals for various financial instruments</li>
              <li>Historical performance data and analytics</li>
              <li>API access for programmatic signal delivery</li>
              <li>Backtesting and strategy validation tools</li>
              <li>Educational resources and market insights</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-[#FAFAFA] mb-4">3. Account Registration</h2>
            <p className="text-[#A1A1AA] mb-4">
              To access certain features, you must register for an account. You agree to:
            </p>
            <ul className="list-disc list-inside text-[#A1A1AA] mb-4 space-y-2">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and update your information to keep it accurate</li>
              <li>Keep your password secure and confidential</li>
              <li>Be responsible for all activity under your account</li>
              <li>Notify us immediately of any unauthorized access</li>
            </ul>
            <p className="text-[#A1A1AA]">
              We reserve the right to suspend or terminate accounts that violate these Terms.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-[#FAFAFA] mb-4">4. Subscription and Payment</h2>
            <p className="text-[#A1A1AA] mb-4">
              Certain Services require a paid subscription. By subscribing, you agree to:
            </p>
            <ul className="list-disc list-inside text-[#A1A1AA] mb-4 space-y-2">
              <li>Pay all applicable fees as described at the time of purchase</li>
              <li>Authorize us to charge your payment method on a recurring basis</li>
              <li>Provide accurate and complete billing information</li>
            </ul>
            <p className="text-[#A1A1AA] mb-4">
              <strong>Refund Policy:</strong> We offer a 30-day money-back guarantee for new 
              subscribers. Refund requests must be submitted within 30 days of initial purchase.
            </p>
            <p className="text-[#A1A1AA]">
              <strong>Cancellation:</strong> You may cancel your subscription at any time. 
              Cancellation takes effect at the end of the current billing period.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-[#FAFAFA] mb-4">5. Acceptable Use</h2>
            <p className="text-[#A1A1AA] mb-4">You agree NOT to:</p>
            <ul className="list-disc list-inside text-[#A1A1AA] mb-4 space-y-2">
              <li>Use the Services for any unlawful purpose</li>
              <li>Share, resell, or redistribute signals or content without authorization</li>
              <li>Attempt to reverse engineer our algorithms or models</li>
              <li>Interfere with or disrupt the Services</li>
              <li>Circumvent any access controls or usage limits</li>
              <li>Use automated systems to access the Services beyond authorized API limits</li>
              <li>Impersonate any person or entity</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-[#FAFAFA] mb-4">6. Intellectual Property</h2>
            <p className="text-[#A1A1AA] mb-4">
              All content, features, and functionality of our Services, including but not limited 
              to software, algorithms, text, graphics, logos, and trademarks, are owned by 
              AlphaStream and protected by intellectual property laws.
            </p>
            <p className="text-[#A1A1AA]">
              You are granted a limited, non-exclusive, non-transferable license to use our 
              Services for your personal, non-commercial trading activities.
            </p>
          </section>

          <section className="mb-12 p-6 bg-warning/10 border border-warning/30 rounded-lg">
            <h2 className="text-2xl font-semibold text-warning mb-4">7. Risk Disclaimer</h2>
            <p className="text-[#A1A1AA] mb-4">
              <strong>IMPORTANT:</strong> Trading financial instruments involves substantial risk 
              of loss and is not suitable for all investors. Past performance is not indicative 
              of future results.
            </p>
            <ul className="list-disc list-inside text-[#A1A1AA] mb-4 space-y-2">
              <li>Our signals are not financial advice or recommendations</li>
              <li>You are solely responsible for your trading decisions</li>
              <li>Never trade with money you cannot afford to lose</li>
              <li>You should consult with a qualified financial advisor</li>
              <li>We do not guarantee any specific results or profits</li>
            </ul>
            <p className="text-[#A1A1AA]">
              By using our Services, you acknowledge and accept these risks.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-[#FAFAFA] mb-4">8. Limitation of Liability</h2>
            <p className="text-[#A1A1AA] mb-4">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, ALPHASTREAM SHALL NOT BE LIABLE FOR:
            </p>
            <ul className="list-disc list-inside text-[#A1A1AA] mb-4 space-y-2">
              <li>Any indirect, incidental, special, or consequential damages</li>
              <li>Any loss of profits, revenue, or data</li>
              <li>Any trading losses resulting from use of our signals</li>
              <li>Any interruption or unavailability of Services</li>
            </ul>
            <p className="text-[#A1A1AA]">
              Our total liability shall not exceed the amount paid by you for the Services 
              in the twelve (12) months preceding the claim.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-[#FAFAFA] mb-4">9. Disclaimer of Warranties</h2>
            <p className="text-[#A1A1AA] mb-4">
              THE SERVICES ARE PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY 
              KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
            </p>
            <ul className="list-disc list-inside text-[#A1A1AA] mb-4 space-y-2">
              <li>Implied warranties of merchantability</li>
              <li>Fitness for a particular purpose</li>
              <li>Non-infringement</li>
              <li>Accuracy, reliability, or completeness of information</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-[#FAFAFA] mb-4">10. Indemnification</h2>
            <p className="text-[#A1A1AA]">
              You agree to indemnify and hold harmless AlphaStream, its affiliates, officers, 
              directors, employees, and agents from any claims, damages, losses, liabilities, 
              and expenses arising from your use of the Services or violation of these Terms.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-[#FAFAFA] mb-4">11. Governing Law</h2>
            <p className="text-[#A1A1AA]">
              These Terms shall be governed by and construed in accordance with the laws of 
              the State of Delaware, without regard to its conflict of law provisions. Any 
              disputes arising from these Terms shall be resolved in the courts of Delaware.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-[#FAFAFA] mb-4">12. Contact Us</h2>
            <p className="text-[#A1A1AA] mb-4">
              If you have any questions about these Terms, please contact us:
            </p>
            <ul className="list-none text-[#A1A1AA] space-y-2">
              <li>Email: legal@alphastream.ai</li>
              <li>Address: 123 Market Street, San Francisco, CA 94105</li>
            </ul>
          </section>
        </div>
      </main>
    </div>
  )
}
