export const metadata = {
  title: 'RCC Column Design Calculator | CivilCalc Pro',
  description:
    'Free online RCC column design calculator for civil engineers and students. Calculate column dimensions, axial loads, reinforcement steel, bending moments, and structural design as per IS 456.',
  alternates: {
    canonical: 'https://civilcalcpro.in/column-design',
  },
  openGraph: {
    title: 'RCC Column Design Calculator | CivilCalc Pro',
    description:
      'Free online RCC column design calculator for civil engineers and students. Calculate column dimensions, axial loads, reinforcement steel, bending moments, and structural design as per IS 456.',
    url: 'https://civilcalcpro.in/column-design',
    siteName: 'CivilCalc Pro',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RCC Column Design Calculator | CivilCalc Pro',
    description:
      'Free online RCC column design calculator for civil engineers and students. Calculate column dimensions, axial loads, reinforcement steel, bending moments, and structural design as per IS 456.',
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
