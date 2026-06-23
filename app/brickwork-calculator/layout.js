export const metadata = {
  title: 'Brickwork Calculator | CivilCalc Pro',
  description:
    'Free online brickwork calculator for civil engineers and contractors. Calculate number of bricks, mortar quantity, wall volume, and construction material estimation.',
  alternates: {
    canonical: 'https://civilcalcpro.in/brickwork-calculator',
  },
  openGraph: {
    title: 'Brickwork Calculator | CivilCalc Pro',
    description:
      'Free online brickwork calculator for civil engineers and contractors. Calculate number of bricks, mortar quantity, wall volume, and construction material estimation.',
    url: 'https://civilcalcpro.in/brickwork-calculator',
    siteName: 'CivilCalc Pro',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Brickwork Calculator | CivilCalc Pro',
    description:
      'Free online brickwork calculator for civil engineers and contractors. Calculate number of bricks, mortar quantity, wall volume, and construction material estimation.',
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

export default function Layout({ children }) {
  return children
}
