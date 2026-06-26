import './globals.css'

import { Toaster } from '@/components/ui/sonner'
import { AuthProvider } from '@/lib/auth-context'
import GlobalSettingsProvider from '@/components/settings/GlobalSettingsProvider'  
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import Script from 'next/script'

export const metadata = {
  metadataBase: new URL('https://civilcalcpro.in'),

  verification: {
    google: '-39KadMQidRHVAfg4YFM1we0tudJtd9k8MrIM0j5Mz4',
  },

    title: {
    default: 'CivilCalc Pro | Civil Engineering Calculators, BOQ & RCC Design Tools',
    template: '%s',
  },
    description:
    'CivilCalc Pro is an India-focused civil engineering calculator platform for RCC design, BOQ generation, quantity estimation, steel weight, brickwork, concrete volume, home construction cost, PDF reports, IS code learning and AI civil engineering assistance.',

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
        'civilcalc pro',
    'civilcalcpro',
    'civil calc pro',
    'civilcalcpro india',
    'civil engineering calculator india',
    'civil engineering calculators online',
    'civil engineer calculator',
    'construction calculator',
    'quantity estimation calculator',
    'BOQ generator online',
    'home construction cost calculator',
    'AI civil engineering assistant',
    'civil engineering PDF reports',
  ],

  authors: [{ name: 'CivilCalc Pro' }],
  creator: 'CivilCalc Pro',
  publisher: 'CivilCalc Pro',


    openGraph: {
    title: 'CivilCalc Pro | Civil Engineering Calculators, BOQ & RCC Design Tools',
    description:
      'India-focused civil engineering calculator platform with RCC design tools, BOQ generator, quantity estimation calculators, PDF reports, IS code learning and AI civil engineering assistant.',
    url: 'https://civilcalcpro.in',
    siteName: 'CivilCalc Pro',
    locale: 'en_US',
    type: 'website',
  },

    twitter: {
    card: 'summary_large_image',
    title: 'CivilCalc Pro | Civil Engineering Calculators, BOQ & RCC Design Tools',
    description:
      'Use CivilCalc Pro for RCC design, BOQ generation, quantity estimation, construction calculators, PDF reports and AI civil engineering assistance.',
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
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'CivilCalc Pro',
  alternateName: ['CivilCalcPro', 'Civil Calc Pro', 'CivilCalc Pro India'],
  url: 'https://civilcalcpro.in',
  logo: 'https://civilcalcpro.in/og-image.png',
  description:
    'CivilCalc Pro is an India-focused civil engineering calculator platform for RCC design, BOQ generation, quantity estimation, PDF reports, IS code learning and AI civil engineering assistance.',
  sameAs: ['https://www.linkedin.com/in/civilcalc-pro-6ba230411'],
}

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'CivilCalc Pro',
  alternateName: ['CivilCalcPro', 'Civil Calc Pro'],
  url: 'https://civilcalcpro.in',
  potentialAction: {
    '@type': 'SearchAction',
    target:
      'https://civilcalcpro.in/civil-engineering-calculators?search={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
}
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-white antialiased">
            <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
        <GlobalSettingsProvider>
    <AuthProvider>
          {children}

          <Toaster
            theme="dark"
            position="top-right"
          />

          <Analytics />
          <SpeedInsights />
        </AuthProvider>
</GlobalSettingsProvider>
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
