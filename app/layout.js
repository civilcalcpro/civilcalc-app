import './globals.css'

import { Toaster } from '@/components/ui/sonner'
import { AuthProvider } from '@/lib/auth-context'

import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

export const metadata = {
  metadataBase: new URL('https://civilcalcpro.in'),

  title: {
    default: 'CivilCalc Pro — Civil Engineering Calculators',
    template: '%s | CivilCalc Pro',
  },

  description:
    'Professional civil engineering calculators, RCC design, structural analysis, IS code tools, estimation calculators and AI assistant.',

  keywords: [
    'civil engineering calculator',
    'RCC beam design',
    'column design calculator',
    'slab design',
    'footing design',
    'structural analysis',
    'SFD BMD calculator',
    'steel weight calculator',
    'brickwork calculator',
    'excavation calculator',
    'rate analysis',
    'IS 456 calculator',
    'civil engineering tools',
    'CivilCalc Pro',
  ],

  authors: [{ name: 'CivilCalc Pro' }],

  creator: 'CivilCalc Pro',
  publisher: 'CivilCalc Pro',

  openGraph: {
    title: 'CivilCalc Pro',
    description:
      'Professional civil engineering calculators, RCC design and structural analysis tools.',
    url: 'https://civilcalcpro.in',
    siteName: 'CivilCalc Pro',
    locale: 'en_US',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'CivilCalc Pro',
    description:
      'Professional civil engineering calculators and structural analysis tools.',
  },

  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-white antialiased">
        <AuthProvider>
          {children}

          <Toaster
            theme="dark"
            position="top-right"
          />

          <Analytics />
          <SpeedInsights />
        </AuthProvider>
      </body>
    </html>
  )
}
