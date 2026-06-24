export const metadata = {
  title: 'Pricing | CivilCalc Pro',
  description:
    'View CivilCalc Pro pricing plans for civil engineering calculators, construction estimation tools, AI assistant, project saving, and professional PDF reports.',
  alternates: {
    canonical: 'https://civilcalcpro.in/pricing',
  },
  openGraph: {
    title: 'Pricing | CivilCalc Pro',
    description:
      'View CivilCalc Pro pricing plans for civil engineering calculators, construction estimation tools, AI assistant, project saving, and professional PDF reports.',
    url: 'https://civilcalcpro.in/pricing',
    siteName: 'CivilCalc Pro',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pricing | CivilCalc Pro',
    description:
      'View CivilCalc Pro pricing plans for civil engineering calculators, construction estimation tools, AI assistant, project saving, and professional PDF reports.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
}

export default function PricingLayout({ children }) {
  return children
}
