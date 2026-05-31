import './globals.css'

import { Toaster } from '@/components/ui/sonner'
import { AuthProvider } from '@/lib/auth-context'

import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import Script from 'next/script'

export const metadata = {
  metadataBase: new URL('https://civilcalcpro.in'),

  verification: {
    google: '-39KadMQidRHVAfg4YFM1we0tudJtd9k8MrIM0j5Mz4',
  },

  title: {
    default: 'CivilCalc Pro — Civil Engineering Calculators & Structural Analysis',
    template: '%s | CivilCalc Pro',
  },

  description:
    'CivilCalc Pro is a professional civil engineering platform featuring RCC beam design, column design, slab design, footing design, structural analysis, IS code tools, estimation calculators, PDF reports, and AI-powered engineering assistance.',

  keywords: [
    'civil engineering calculator',
    'civil engineering software',
    'RCC beam design',
    'column design calculator',
    'footing design',
    'slab design',
    'structural analysis',
    'SFD calculator',
    'BMD calculator',
    'steel weight calculator',
    'concrete volume calculator',
    'brickwork calculator',
    'excavation calculator',
    'rate analysis',
    'IS 456',
    'IS code calculator',
    'civil engineering tools',
    'CivilCalc Pro',
  ],

  authors: [{ name: 'CivilCalc Pro' }],
  creator: 'CivilCalc Pro',
  publisher: 'CivilCalc Pro',

  alternates: {
    canonical: 'https://civilcalcpro.in',
  },

  openGraph: {
    title: 'CivilCalc Pro',
    description:
      'Professional Civil Engineering Platform for RCC Design, Structural Analysis, IS Code Calculations and AI Engineering Assistance.',
    url: 'https://civilcalcpro.in',
    siteName: 'CivilCalc Pro',
    locale: 'en_US',
    type: 'website',

    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CivilCalc Pro',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'CivilCalc Pro',
    description:
      'Professional Civil Engineering Calculators and Structural Analysis Platform.',
    images: ['/og-image.png'],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
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

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-WY9TW5Y54J"
          strategy="afterInteractive"
        />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-WY9TW5Y54J');
          `}
        </Script>

        {/* Microsoft Clarity */}
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];
              y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "wzivn1hsg7");
          `}
        </Script>
      </body>
    </html>
  )
}
