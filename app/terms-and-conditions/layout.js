export const metadata = {
  title: 'Terms and Conditions | CivilCalc Pro',
  description:
    'Read the CivilCalc Pro Terms and Conditions for website usage, calculator usage, account access, limitations, responsibilities, and service policies.',
  alternates: {
    canonical: 'https://civilcalcpro.in/terms-and-conditions',
  },
  openGraph: {
    title: 'Terms and Conditions | CivilCalc Pro',
    description:
      'Read the CivilCalc Pro Terms and Conditions for website usage, calculator usage, account access, limitations, responsibilities, and service policies.',
    url: 'https://civilcalcpro.in/terms-and-conditions',
    siteName: 'CivilCalc Pro',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terms and Conditions | CivilCalc Pro',
    description:
      'Read the CivilCalc Pro Terms and Conditions for website usage, calculator usage, account access, limitations, responsibilities, and service policies.',
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

export default function TermsAndConditionsLayout({ children }) {
  return children
}
