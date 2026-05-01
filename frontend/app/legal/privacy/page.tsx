import Link from "next/link"
import { Zap, ArrowLeft } from "lucide-react"

export const metadata = {
  title: "Privacy Policy | AlphaStream",
  description: "Learn how AlphaStream collects, uses, and protects your personal information.",
}

export default function PrivacyPolicyPage() {
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
        <h1 className="text-4xl font-bold text-[#FAFAFA] mb-4">Privacy Policy</h1>
        <p className="text-[#71717A] mb-8">Last updated: April 30, 2025</p>

        <div className="prose prose-invert prose-zinc max-w-none">
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-[#FAFAFA] mb-4">1. Introduction</h2>
            <p className="text-[#A1A1AA] mb-4">
              AlphaStream (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy 
              explains how we collect, use, disclose, and safeguard your information when you use our website, 
              applications, and services (collectively, the &quot;Services&quot;).
            </p>
            <p className="text-[#A1A1AA]">
              Please read this privacy policy carefully. If you do not agree with the terms of this privacy 
              policy, please do not access the Services.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-[#FAFAFA] mb-4">2. Information We Collect</h2>
            
            <h3 className="text-xl font-medium text-[#FAFAFA] mb-3">Personal Information</h3>
            <p className="text-[#A1A1AA] mb-4">We may collect personal information that you voluntarily provide, including:</p>
            <ul className="list-disc list-inside text-[#A1A1AA] mb-4 space-y-2">
              <li>Name and email address</li>
              <li>Billing and payment information</li>
              <li>Account credentials</li>
              <li>Communication preferences</li>
              <li>Any other information you choose to provide</li>
            </ul>

            <h3 className="text-xl font-medium text-[#FAFAFA] mb-3">Automatically Collected Information</h3>
            <p className="text-[#A1A1AA] mb-4">When you access our Services, we automatically collect:</p>
            <ul className="list-disc list-inside text-[#A1A1AA] mb-4 space-y-2">
              <li>Device information (type, operating system, unique identifiers)</li>
              <li>IP address and location data</li>
              <li>Browser type and settings</li>
              <li>Usage data and interaction with our Services</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-[#FAFAFA] mb-4">3. How We Use Your Information</h2>
            <p className="text-[#A1A1AA] mb-4">We use the information we collect to:</p>
            <ul className="list-disc list-inside text-[#A1A1AA] mb-4 space-y-2">
              <li>Provide, maintain, and improve our Services</li>
              <li>Process transactions and send related information</li>
              <li>Send administrative information, updates, and security alerts</li>
              <li>Respond to your comments, questions, and requests</li>
              <li>Monitor and analyze usage trends and preferences</li>
              <li>Detect, prevent, and address fraud and security issues</li>
              <li>Personalize and improve your experience</li>
              <li>Send marketing communications (with your consent)</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-[#FAFAFA] mb-4">4. Information Sharing</h2>
            <p className="text-[#A1A1AA] mb-4">We may share your information with:</p>
            <ul className="list-disc list-inside text-[#A1A1AA] mb-4 space-y-2">
              <li><strong>Service Providers:</strong> Third parties that perform services on our behalf</li>
              <li><strong>Business Partners:</strong> Partners with whom we offer co-branded services</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
              <li><strong>Business Transfers:</strong> In connection with any merger or acquisition</li>
            </ul>
            <p className="text-[#A1A1AA]">
              We do not sell your personal information to third parties.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-[#FAFAFA] mb-4">5. Data Security</h2>
            <p className="text-[#A1A1AA] mb-4">
              We implement appropriate technical and organizational security measures to protect your 
              personal information, including:
            </p>
            <ul className="list-disc list-inside text-[#A1A1AA] mb-4 space-y-2">
              <li>256-bit SSL/TLS encryption for data in transit</li>
              <li>AES-256 encryption for data at rest</li>
              <li>Regular security assessments and penetration testing</li>
              <li>Access controls and authentication measures</li>
              <li>SOC 2 Type II compliance</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-[#FAFAFA] mb-4">6. Your Rights (GDPR)</h2>
            <p className="text-[#A1A1AA] mb-4">If you are in the European Economic Area, you have the right to:</p>
            <ul className="list-disc list-inside text-[#A1A1AA] mb-4 space-y-2">
              <li><strong>Access:</strong> Request access to your personal data</li>
              <li><strong>Rectification:</strong> Request correction of inaccurate data</li>
              <li><strong>Erasure:</strong> Request deletion of your data (&quot;right to be forgotten&quot;)</li>
              <li><strong>Portability:</strong> Request transfer of your data</li>
              <li><strong>Restriction:</strong> Request restriction of processing</li>
              <li><strong>Objection:</strong> Object to certain processing activities</li>
              <li><strong>Withdraw Consent:</strong> Withdraw consent at any time</li>
            </ul>
            <p className="text-[#A1A1AA]">
              To exercise these rights, please contact us at privacy@alphastream.ai
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-[#FAFAFA] mb-4">7. Data Retention</h2>
            <p className="text-[#A1A1AA] mb-4">
              We retain your personal information for as long as necessary to fulfill the purposes 
              outlined in this Privacy Policy, unless a longer retention period is required or 
              permitted by law. When we no longer need your information, we will securely delete 
              or anonymize it.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-[#FAFAFA] mb-4">8. Cookies</h2>
            <p className="text-[#A1A1AA] mb-4">
              We use cookies and similar tracking technologies to collect and track information 
              about your activity on our Services. You can control cookies through your browser 
              settings. For more information, see our Cookie Policy.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-[#FAFAFA] mb-4">9. Children&apos;s Privacy</h2>
            <p className="text-[#A1A1AA] mb-4">
              Our Services are not intended for individuals under the age of 18. We do not 
              knowingly collect personal information from children. If you become aware that 
              a child has provided us with personal information, please contact us.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-[#FAFAFA] mb-4">10. Changes to This Policy</h2>
            <p className="text-[#A1A1AA] mb-4">
              We may update this Privacy Policy from time to time. We will notify you of any 
              changes by posting the new Privacy Policy on this page and updating the 
              &quot;Last updated&quot; date. Your continued use of our Services after any changes 
              constitutes acceptance of the new Privacy Policy.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-[#FAFAFA] mb-4">11. Contact Us</h2>
            <p className="text-[#A1A1AA] mb-4">
              If you have any questions about this Privacy Policy, please contact us:
            </p>
            <ul className="list-none text-[#A1A1AA] space-y-2">
              <li>Email: privacy@alphastream.ai</li>
              <li>Address: 123 Market Street, San Francisco, CA 94105</li>
            </ul>
          </section>
        </div>
      </main>
    </div>
  )
}
