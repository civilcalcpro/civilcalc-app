export const metadata = {
  title: 'RCC Beam Design Calculator as per IS 456:2000 | CivilCalc Pro',
  description:
    'Use CivilCalc Pro RCC Beam Design Calculator to calculate bending moment, beam dimensions, steel reinforcement, load analysis and RCC beam design as per IS 456:2000.',
  alternates: {
    canonical: 'https://civilcalcpro.in/beam-design',
  },
  openGraph: {
    title: 'RCC Beam Design Calculator as per IS 456:2000 | CivilCalc Pro',
    description:
      'Use CivilCalc Pro RCC Beam Design Calculator to calculate bending moment, beam dimensions, steel reinforcement, load analysis and RCC beam design as per IS 456:2000.',
    url: 'https://civilcalcpro.in/beam-design',
    siteName: 'CivilCalc Pro',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RCC Beam Design Calculator as per IS 456:2000 | CivilCalc Pro',
    description:
      'Use CivilCalc Pro RCC Beam Design Calculator to calculate bending moment, beam dimensions, steel reinforcement, load analysis and RCC beam design as per IS 456:2000.',
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
