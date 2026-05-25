import './globals.css'
import { Toaster } from '@/components/ui/sonner'
import { AuthProvider } from '@/lib/auth-context'
import { Analytics } from '@vercel/analytics/react'
export const metadata = {
  title: 'CivilCalc Pro - AI-Powered Civil Engineering Platform',
  description:
    'Design RCC structures, estimate quantities, generate structural reports, and automate civil engineering workflows with AI assistance.',
  keywords:
    'civil engineering, RCC design, structural analysis, quantity estimation, IS codes, civil calculator',
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
        </AuthProvider>
      </body>
    </html>
  )
}
