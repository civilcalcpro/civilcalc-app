export const metadata = {
  title: 'Contact Us | CivilCalc Pro',
  description:
    'Contact CivilCalc Pro for support, feedback, partnership, civil engineering calculator queries, and construction estimation tool assistance.',
  alternates: {
    canonical: 'https://civilcalcpro.in/contact-us',
  },
  openGraph: {
    title: 'Contact Us | CivilCalc Pro',
    description:
      'Contact CivilCalc Pro for support, feedback, partnership, civil engineering calculator queries, and construction estimation tool assistance.',
    url: 'https://civilcalcpro.in/contact-us',
    siteName: 'CivilCalc Pro',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us | CivilCalc Pro',
    description:
      'Contact CivilCalc Pro for support, feedback, partnership, civil engineering calculator queries, and construction estimation tool assistance.',
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

export default function ContactUsLayout({ children }) {
  return children
}
