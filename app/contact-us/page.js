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

export default function ContactUsPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <p className="text-orange-400 font-semibold mb-3">
          CONTACT CIVILCALC PRO
        </p>

        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Contact Us
        </h1>

        <p className="text-slate-400 mb-10 text-lg leading-8">
          Have questions, feedback, feature suggestions, technical issues, or
          partnership opportunities? We&apos;d love to hear from you.
        </p>

        <div className="grid gap-6">
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold mb-3">
              General Support
            </h2>

            <p className="text-slate-300 leading-7">
              Need help using CivilCalc Pro or facing a technical issue with any
              civil engineering calculator, PDF report, dashboard, or estimation tool?
            </p>

            <div className="mt-4">
              <p className="text-slate-400 mb-1">Email</p>

              <a
                href="mailto:civilcalc592005@gmail.com"
                className="text-orange-400 hover:text-orange-300 font-medium"
              >
                civilcalc592005@gmail.com
              </a>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold mb-3">
              Feature Requests
            </h2>

            <p className="text-slate-300 leading-7">
              Have an idea for a new calculator, construction tool, estimation
              feature, BOQ workflow, AI assistant feature, or project management
              improvement? Send us your suggestion.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold mb-3">
              Bug Reports
            </h2>

            <p className="text-slate-300 leading-7">
              Found an issue or incorrect calculation? Please report it with
              calculator name, input values, expected result, and screenshot if
              possible so we can investigate and improve the platform.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold mb-3">
              Business & Partnerships
            </h2>

            <p className="text-slate-300 leading-7">
              Interested in collaboration, sponsorships, civil engineering
              education partnerships, construction software partnerships, or
              business opportunities? Contact us directly.
            </p>
          </div>

          <div className="rounded-xl border border-orange-500/20 bg-orange-500/5 p-6">
            <h2 className="text-xl font-semibold mb-3 text-orange-400">
              About CivilCalc Pro
            </h2>

            <p className="text-slate-300 leading-7">
              CivilCalc Pro is an AI-powered civil engineering platform designed
              for engineers, contractors, students, and construction professionals.
              Our mission is to simplify engineering calculations, construction
              estimation, structural design workflows, BOQ preparation, PDF
              reports, and project planning.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
