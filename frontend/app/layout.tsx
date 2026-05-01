import type { Metadata, Viewport } from 'next'
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'sonner'
import { AuthProvider } from '@/contexts/auth-context'
import { NetworkError } from '@/components/network-error'
import { CommandPalette } from '@/components/command-palette'
import { KeyboardShortcuts } from '@/components/keyboard-shortcuts'
import { OnboardingWizard } from '@/components/onboarding/onboarding-wizard'
import { SkipLink } from '@/components/accessibility/skip-link'
import { CookieConsent } from '@/components/legal/cookie-consent'
import './globals.css'

const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"],
  variable: '--font-space-grotesk'
});

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ["latin"],
  variable: '--font-jetbrains-mono'
});

export const metadata: Metadata = {
  title: 'AlphaStream | ML-Powered Trading Signals',
  description: 'XGBoost, LightGBM, and LSTM models analyze 200+ technical indicators to generate high-confidence trading signals. Walk-forward validated. No look-ahead bias.',
  keywords: ['trading signals', 'machine learning', 'algorithmic trading', 'XGBoost', 'LSTM', 'technical analysis'],
  authors: [{ name: 'AlphaStream' }],
  openGraph: {
    title: 'AlphaStream | ML-Powered Trading Signals',
    description: 'Trading signals powered by machine learning. 73% accuracy with walk-forward validation.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#09090B',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark bg-[#09090B]">
      <body className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans antialiased bg-[#09090B] text-[#FAFAFA]`}>
        <AuthProvider>
          <SkipLink />
          <NetworkError />
          <CommandPalette />
          <KeyboardShortcuts />
          <OnboardingWizard />
          {children}
          <Toaster theme="dark" position="bottom-right" />
          <CookieConsent />
        </AuthProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
