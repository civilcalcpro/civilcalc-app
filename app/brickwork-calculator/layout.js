export const metadata = {
  title: 'Brickwork Calculator Online | Brick Quantity Calculator',
  description:
    'Calculate brick quantity, mortar volume, cement bags and sand required for brick masonry walls using CivilCalc Pro.',
  alternates: {
    canonical: 'https://civilcalcpro.in/brickwork-calculator',
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
