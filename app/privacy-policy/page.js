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

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <p className="text-orange-400 font-semibold mb-3">
          CIVILCALC PRO PRIVACY POLICY
        </p>

        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Privacy Policy
        </h1>

        <p className="text-slate-400 mb-10 text-lg leading-8">
          This Privacy Policy explains how CivilCalc Pro collects, uses, protects,
          and manages information when you use our website, civil engineering
          calculators, dashboard, AI assistant, project tools, and related services.
        </p>

        <div className="space-y-6">
          <section className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-2xl font-semibold mb-3">
              1. Information We Collect
            </h2>

            <p className="text-slate-300 leading-7">
              CivilCalc Pro may collect basic account information, calculator
              inputs, project details, saved calculation data, analytics data,
              device information, browser information, and usage activity to
              provide and improve our services.
            </p>
          </section>

          <section className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-2xl font-semibold mb-3">
              2. How We Use Information
            </h2>

            <p className="text-slate-300 leading-7">
              We use collected information to operate the platform, provide
              engineering calculators, save user projects, generate reports,
              improve website performance, enhance user experience, detect
              technical issues, and improve CivilCalc Pro features.
            </p>
          </section>

          <section className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-2xl font-semibold mb-3">
              3. Calculator and Project Data
            </h2>

            <p className="text-slate-300 leading-7">
              When users create projects or perform calculations, the entered
              values and generated results may be stored to provide project
              history, saved reports, dashboard insights, and continuity across
              sessions.
            </p>
          </section>

          <section className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-2xl font-semibold mb-3">
              4. Cookies and Analytics
            </h2>

            <p className="text-slate-300 leading-7">
              CivilCalc Pro may use cookies, analytics tools, and performance
              tracking services to understand website usage, monitor traffic,
              improve page speed, fix errors, and enhance product experience.
            </p>
          </section>

          <section className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-2xl font-semibold mb-3">
              5. Data Security
            </h2>

            <p className="text-slate-300 leading-7">
              We take reasonable technical and organizational measures to protect
              user information. However, no online platform can guarantee complete
              security, and users should avoid submitting highly sensitive
              information unless required.
            </p>
          </section>

          <section className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-2xl font-semibold mb-3">
              6. Third-Party Services
            </h2>

            <p className="text-slate-300 leading-7">
              CivilCalc Pro may use third-party services for hosting, analytics,
              authentication, database storage, email delivery, payments, and
              performance monitoring. These services may process limited data
              according to their own privacy policies.
            </p>
          </section>

          <section className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-2xl font-semibold mb-3">
              7. User Responsibility
            </h2>

            <p className="text-slate-300 leading-7">
              Users are responsible for the accuracy of the information they
              enter into calculators and project forms. CivilCalc Pro provides
              engineering assistance tools, but professional judgement and
              verification are required before using results in real construction
              work.
            </p>
          </section>

          <section className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-2xl font-semibold mb-3">
              8. Changes to This Policy
            </h2>

            <p className="text-slate-300 leading-7">
              We may update this Privacy Policy from time to time to reflect
              changes in our platform, features, legal requirements, or business
              operations. Updated versions will be posted on this page.
            </p>
          </section>

          <section className="rounded-xl border border-orange-500/20 bg-orange-500/5 p-6">
            <h2 className="text-2xl font-semibold mb-3 text-orange-400">
              Contact
            </h2>

            <p className="text-slate-300 leading-7">
              For privacy-related questions or support, contact us at:
            </p>

            <a
              href="mailto:civilcalc592005@gmail.com"
              className="inline-block mt-3 text-orange-400 hover:text-orange-300 font-medium"
            >
              civilcalc592005@gmail.com
            </a>
          </section>
        </div>
      </div>
    </main>
  )
}
