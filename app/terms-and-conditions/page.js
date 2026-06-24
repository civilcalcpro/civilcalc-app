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

export default function TermsAndConditionsPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <p className="text-orange-400 font-semibold mb-3">
          CIVILCALC PRO TERMS
        </p>

        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Terms and Conditions
        </h1>

        <p className="text-slate-400 mb-10 text-lg leading-8">
          These Terms and Conditions explain the rules for using CivilCalc Pro,
          including our civil engineering calculators, dashboard, AI assistant,
          project tools, PDF reports, and related services.
        </p>

        <div className="space-y-6">
          <section className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-2xl font-semibold mb-3">
              1. Acceptance of Terms
            </h2>

            <p className="text-slate-300 leading-7">
              By accessing or using CivilCalc Pro, you agree to follow these
              Terms and Conditions. If you do not agree with these terms, you
              should stop using the website and its services.
            </p>
          </section>

          <section className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-2xl font-semibold mb-3">
              2. Use of CivilCalc Pro
            </h2>

            <p className="text-slate-300 leading-7">
              CivilCalc Pro provides civil engineering calculators, construction
              estimation tools, structural design assistance, project saving,
              AI-based support, and professional report generation. The platform
              is intended for educational, estimation, planning, and professional
              assistance purposes.
            </p>
          </section>

          <section className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-2xl font-semibold mb-3">
              3. Engineering Disclaimer
            </h2>

            <p className="text-slate-300 leading-7">
              CivilCalc Pro calculations are provided as engineering assistance
              tools. Users must verify all results before applying them to real
              construction work. Final design decisions should be reviewed by a
              qualified civil engineer, structural engineer, or responsible
              professional according to local codes and project requirements.
            </p>
          </section>

          <section className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-2xl font-semibold mb-3">
              4. User Responsibility
            </h2>

            <p className="text-slate-300 leading-7">
              Users are responsible for entering correct input values, selecting
              appropriate units, checking calculation results, verifying reports,
              and ensuring that outputs are suitable for their project. CivilCalc
              Pro is not responsible for losses caused by incorrect input,
              misuse, or unverified engineering decisions.
            </p>
          </section>

          <section className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-2xl font-semibold mb-3">
              5. Account and Project Data
            </h2>

            <p className="text-slate-300 leading-7">
              Users may create accounts, save projects, store calculation
              history, and generate reports. Users are responsible for protecting
              their login credentials and ensuring that saved project information
              is accurate and appropriate.
            </p>
          </section>

          <section className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-2xl font-semibold mb-3">
              6. PDF Reports and Outputs
            </h2>

            <p className="text-slate-300 leading-7">
              PDF reports, calculator results, material estimates, BOQ outputs,
              and project summaries generated by CivilCalc Pro are provided for
              planning and assistance. Users must review and validate all reports
              before submitting, sharing, or using them for official work.
            </p>
          </section>

          <section className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-2xl font-semibold mb-3">
              7. Prohibited Use
            </h2>

            <p className="text-slate-300 leading-7">
              Users must not misuse CivilCalc Pro, attempt unauthorized access,
              interfere with platform security, copy the platform illegally,
              upload harmful content, abuse AI features, or use the service for
              unlawful activities.
            </p>
          </section>

          <section className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-2xl font-semibold mb-3">
              8. Service Availability
            </h2>

            <p className="text-slate-300 leading-7">
              We try to keep CivilCalc Pro available and reliable, but we do not
              guarantee uninterrupted access. The website may be unavailable due
              to maintenance, updates, hosting issues, technical problems, or
              third-party service interruptions.
            </p>
          </section>

          <section className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-2xl font-semibold mb-3">
              9. Changes to Terms
            </h2>

            <p className="text-slate-300 leading-7">
              CivilCalc Pro may update these Terms and Conditions from time to
              time. Updated terms will be posted on this page. Continued use of
              the platform means you accept the updated terms.
            </p>
          </section>

          <section className="rounded-xl border border-orange-500/20 bg-orange-500/5 p-6">
            <h2 className="text-2xl font-semibold mb-3 text-orange-400">
              Contact
            </h2>

            <p className="text-slate-300 leading-7">
              For questions about these Terms and Conditions, contact us at:
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
