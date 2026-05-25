import './globals.css'
import { Toaster } from '@/components/ui/sonner'
import { AuthProvider } from '@/lib/auth-context'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from "@vercel/speed-insights/next"
export const metadata = {
  title: 'CivilCalc Pro - AI Civil Engineering Platform',
  
  description:
    'AI-powered civil engineering platform for RCC design, quantity estimation, IS code calculations, structural analysis, beam design, slab design, footing design, and project estimation.',

  keywords: [
    'civil engineering software',
    'RCC design',
    'beam design',
    'slab design',
    'footing design',
    'civil calculator',
    'quantity estimation',
    'structural analysis',
    'IS code calculations',
    'AI civil engineering',
    'construction estimation',
    'civil engineering tools',
    'civilcalc pro'
  ],

  authors: [{ name: 'CivilCalc Pro' }],

  creator: 'CivilCalc Pro',

  metadataBase: new URL('https://civilcalc-app.vercel.app'),
verification: {
  google: aOtPHDR5XdLr0qbTeQWhuBzmdNlJaO3qGZChVTUoqRE',
},
  openGraph: {
    title: 'CivilCalc Pro',
    description:
      'AI-powered civil engineering platform for RCC design and estimation.',
    url: 'https://civilcalc-app.vercel.app',
    siteName: 'CivilCalc Pro',
    locale: 'en_US',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'CivilCalc Pro',
    description:
      'AI-powered civil engineering platform for RCC design and estimation.',
  },

  robots: {
    index: true,
    follow: true,
  },
}
export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              'window.addEventListener("error",function(e){if(e.error instanceof DOMException&&e.error.name==="DataCloneError"&&e.message&&e.message.includes("PerformanceServerTiming")){e.stopImmediatePropagation();e.preventDefault()}},true);',
          }}
        />
      </head>
      <body className="bg-slate-950 text-white antialiased">
        <AuthProvider>
          {children}
          <Toaster theme="dark" position="top-right" />
           <Analytics />
          <SpeedInsights />
        </AuthProvider>
      </body>
    </html>
  )
}
