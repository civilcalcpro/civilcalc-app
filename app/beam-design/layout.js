export const metadata = {
  title: 'RCC Beam Design Calculator Online | CivilCalc Pro',
  description:
    'Use CivilCalc Pro RCC Beam Design Calculator to calculate beam design, steel reinforcement, bending moment, shear force and design safety checks.',
  alternates: {
    canonical: 'https://civilcalcpro.in/beam-design',
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
