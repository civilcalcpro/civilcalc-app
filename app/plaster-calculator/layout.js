export const metadata = {
  title: 'Plaster Calculator | Cement Sand Quantity | CivilCalc Pro',
  description:
    'Free online plaster calculator to calculate plaster area, cement bags, sand quantity and cost for internal and external wall plaster work.',
  alternates: {
    canonical: 'https://civilcalcpro.in/plaster-calculator',
  },
  openGraph: {
    title: 'Plaster Calculator | Cement Sand Quantity | CivilCalc Pro',
    description:
      'Free online plaster calculator to calculate plaster area, cement bags, sand quantity and cost for internal and external wall plaster work.',
    url: 'https://civilcalcpro.in/plaster-calculator',
    siteName: 'CivilCalc Pro',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Plaster Calculator | Cement Sand Quantity | CivilCalc Pro',
    description:
      'Free online plaster calculator to calculate plaster area, cement bags, sand quantity and cost for internal and external wall plaster work.',
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
