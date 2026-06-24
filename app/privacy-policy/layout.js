export const metadata = {
  title: 'Privacy Policy | CivilCalc Pro',
  description:
    'Read the CivilCalc Pro Privacy Policy to understand how we handle user data, account information, analytics, cookies, and website usage information.',
  alternates: {
    canonical: 'https://civilcalcpro.in/privacy-policy',
  },
  openGraph: {
    title: 'Privacy Policy | CivilCalc Pro',
    description:
      'Read the CivilCalc Pro Privacy Policy to understand how we handle user data, account information, analytics, cookies, and website usage information.',
    url: 'https://civilcalcpro.in/privacy-policy',
    siteName: 'CivilCalc Pro',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy Policy | CivilCalc Pro',
    description:
      'Read the CivilCalc Pro Privacy Policy to understand how we handle user data, account information, analytics, cookies, and website usage information.',
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

export default function PrivacyPolicyLayout({ children }) {
  return children
}
