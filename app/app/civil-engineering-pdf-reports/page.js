import Link from 'next/link'

export const metadata = {
  title:
    'Civil Engineering PDF Reports | BOQ, RCC & Quantity Reports | CivilCalc Pro',
  description:
    'Generate civil engineering PDF reports for BOQ, RCC design, quantity estimation, steel weight, concrete volume, home construction cost and construction calculations with CivilCalc Pro.',
  alternates: {
    canonical: 'https://civilcalcpro.in/civil-engineering-pdf-reports',
  },
  openGraph: {
    title:
      'Civil Engineering PDF Reports | BOQ, RCC & Quantity Reports',
    description:
      'Create professional PDF reports for civil engineering calculations, BOQ, RCC design, quantity estimation and construction cost estimates.',
    url: 'https://civilcalcpro.in/civil-engineering-pdf-reports',
    siteName: 'CivilCalc Pro',
    type: 'article',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title:
      'Civil Engineering PDF Reports | BOQ, RCC & Quantity Reports',
    description:
      'Generate professional civil engineering calculation PDF reports with CivilCalc Pro.',
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

const pageUrl = 'https://civilcalcpro.in/civil-engineering-pdf-reports'

const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'CivilCalc Pro Civil Engineering PDF Reports',
  applicationCategory: 'EngineeringApplication',
  operatingSystem: 'Web',
  url: pageUrl,
  description:
    'Civil engineering PDF report generation for BOQ, RCC design, quantity estimation, steel weight, concrete volume and construction calculation reports.',
  brand: {
    '@type': 'Brand',
    name: 'CivilCalc Pro',
  },
  publisher: {
    '@type': 'Organization',
    name: 'CivilCalc Pro',
    url: 'https://civilcalcpro.in',
  },
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'INR',
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is a civil engineering PDF report?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'A civil engineering PDF report is a professional calculation document that includes project details, input values, calculation results, material quantities, cost summary and engineering output in a shareable PDF format.',
      },
    },
    {
      '@type': 'Question',
      name: 'Which reports can be generated in CivilCalc Pro?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'CivilCalc Pro can help generate reports for BOQ, RCC design, quantity estimation, concrete volume, steel weight, brickwork, plaster, excavation, home construction cost and other construction calculations.',
      },
    },
    {
      '@type': 'Question',
      name: 'Why are PDF reports useful for civil engineers?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'PDF reports are useful because they make calculations easy to save, print, share with clients, submit to teams and maintain as project records.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can PDF reports be used for BOQ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'Yes, BOQ PDF reports can include project details, item descriptions, units, quantities, rates, amounts, GST, wastage and grand total.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can students use civil engineering PDF reports?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'Yes, students can use calculation PDF reports for learning, assignments, estimation practice, RCC design examples and project documentation.',
      },
    },
  ],
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'TechArticle',
  headline:
    'Civil Engineering PDF Reports for BOQ, RCC Design and Quantity Estimation',
  description:
    'A practical guide explaining how civil engineering PDF reports help with BOQ, RCC design, quantity estimation, construction calculations, project documentation and client-ready reports.',
  mainEntityOfPage: pageUrl,
  url: pageUrl,
  author: {
    '@type': 'Organization',
    name: 'CivilCalc Pro',
    url: 'https://civilcalcpro.in',
  },
  publisher: {
    '@type': 'Organization',
    name: 'CivilCalc Pro',
    url: 'https://civilcalcpro.in',
  },
  about: [
    'Civil engineering PDF reports',
    'BOQ PDF report',
    'RCC design report',
    'Quantity estimation report',
    'Construction calculation report',
    'Civil engineering documentation',
  ],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://civilcalcpro.in',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Civil Engineering Calculators',
      item: 'https://civilcalcpro.in/civil-engineering-calculators',
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'Civil Engineering PDF Reports',
      item: pageUrl,
    },
  ],
}

export default function CivilEngineeringPdfReportsPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareSchema),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      <div className="max-w-6xl mx-auto">
        <p className="text-orange-400 font-semibold mb-3">
          PROFESSIONAL CIVIL ENGINEERING REPORTS
        </p>

        <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
          Civil Engineering PDF Reports
        </h1>

        <p className="text-slate-300 text-lg lg:text-xl mb-8 leading-8 max-w-4xl">
          CivilCalc Pro helps civil engineers, contractors, quantity surveyors,
          students and site engineers generate professional PDF reports for BOQ,
          RCC design, quantity estimation, steel weight, concrete volume, home
          construction cost and other construction calculations.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Link
            href="/civil-engineering-calculators"
            className="bg-orange-500 hover:bg-orange-600 transition px-6 py-4 rounded-xl font-semibold text-center"
          >
            Explore Calculators with PDF Reports
          </Link>

          <Link
            href="/boq-generator"
            className="bg-slate-900 hover:bg-slate-800 border border-slate-700 transition px-6 py-4 rounded-xl font-semibold text-center"
          >
            Open BOQ Generator
          </Link>
        </div>

        <section className="bg-orange-500/10 border border-orange-500/30 rounded-2xl p-6 lg:p-8 mb-10">
          <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">
            Quick Answer
          </h2>

          <p className="text-slate-200 leading-8 text-lg">
            A <strong>civil engineering PDF report</strong> is a professional
            calculation document that includes project details, inputs, formulas,
            results, material quantities, cost summary and engineering outputs
            in a clean shareable format. It helps engineers save, print, submit
            and share calculation results easily.
          </p>
        </section>

        <section className="space-y-8">
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Why PDF Reports Matter in Civil Engineering
            </h2>

            <p className="text-slate-300 leading-7">
              Civil engineering calculations are not useful only on screen.
              Engineers often need to share outputs with clients, contractors,
              site teams, supervisors, college faculty or project records. PDF
              reports make calculations more professional, readable and easy to
              store for future reference.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              What Can Be Included in a Civil Engineering PDF Report?
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              {[
                'Project name and project details',
                'Client name and project location',
                'Input values used in calculation',
                'Final calculated output',
                'Material quantity summary',
                'Cost summary and grand total',
                'BOQ item table',
                'Date, prepared by and report reference',
              ].map((item) => (
                <div
                  key={item}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-4"
                >
                  <p className="text-slate-200">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 overflow-x-auto">
            <h2 className="text-2xl font-bold text-white mb-4">
              Types of PDF Reports in CivilCalc Pro
            </h2>

            <table className="w-full border-collapse text-left text-slate-300">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="py-3 pr-4 text-white">Report Type</th>
                  <th className="py-3 pr-4 text-white">Useful For</th>
                  <th className="py-3 pr-4 text-white">Common Output</th>
                </tr>
              </thead>

              <tbody>
                <tr className="border-b border-slate-800">
                  <td className="py-3 pr-4">BOQ PDF Report</td>
                  <td className="py-3 pr-4">
                    Quantity surveyors and contractors
                  </td>
                  <td className="py-3 pr-4">
                    Items, quantity, rate, amount and total cost
                  </td>
                </tr>

                <tr className="border-b border-slate-800">
                  <td className="py-3 pr-4">RCC Design Report</td>
                  <td className="py-3 pr-4">
                    Civil and structural engineers
                  </td>
                  <td className="py-3 pr-4">
                    Beam, slab, column and footing calculation results
                  </td>
                </tr>

                <tr className="border-b border-slate-800">
                  <td className="py-3 pr-4">Quantity Estimation Report</td>
                  <td className="py-3 pr-4">
                    Site engineers and estimators
                  </td>
                  <td className="py-3 pr-4">
                    Concrete, brickwork, plaster, excavation quantities
                  </td>
                </tr>

                <tr className="border-b border-slate-800">
                  <td className="py-3 pr-4">Material Report</td>
                  <td className="py-3 pr-4">
                    Site procurement and planning
                  </td>
                  <td className="py-3 pr-4">
                    Cement, sand, aggregate, steel and bricks
                  </td>
                </tr>

                <tr>
                  <td className="py-3 pr-4">Cost Estimate Report</td>
                  <td className="py-3 pr-4">
                    Homeowners and contractors
                  </td>
                  <td className="py-3 pr-4">
                    Estimated cost, material cost and work breakdown
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4">
                BOQ PDF Reports
              </h2>

              <p className="text-slate-300 leading-7">
                BOQ PDF reports help present item-wise construction quantities,
                rates, amounts, GST, wastage and grand total in a professional
                format. This is useful for contractors, estimators, clients and
                quantity surveyors.
              </p>
            </div>

            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4">
                RCC Design PDF Reports
              </h2>

              <p className="text-slate-300 leading-7">
                RCC design PDF reports help save beam, slab, column and footing
                design outputs in a structured format. These reports are useful
                for study, review, documentation and engineering reference.
              </p>
            </div>

            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4">
                Quantity Estimation PDF Reports
              </h2>

              <p className="text-slate-300 leading-7">
                Quantity estimation reports help document concrete volume, steel
                weight, brickwork, plaster, excavation, flooring, paint and
                other construction material quantities.
              </p>
            </div>

            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4">
                Home Construction Cost PDF Reports
              </h2>

              <p className="text-slate-300 leading-7">
                Home construction cost reports help homeowners, contractors and
                engineers understand estimated cost, material breakup, work
                stages and budget planning before construction starts.
              </p>
            </div>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Benefits of CivilCalc Pro PDF Reports
            </h2>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
                <h3 className="font-semibold text-orange-400 mb-2">
                  Professional Output
                </h3>
                <p className="text-slate-300 leading-7 text-sm">
                  Clean and structured report format for civil engineering
                  calculations.
                </p>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
                <h3 className="font-semibold text-orange-400 mb-2">
                  Easy Sharing
                </h3>
                <p className="text-slate-300 leading-7 text-sm">
                  Share calculation reports with clients, site teams and project
                  members.
                </p>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
                <h3 className="font-semibold text-orange-400 mb-2">
                  Project Records
                </h3>
                <p className="text-slate-300 leading-7 text-sm">
                  Save reports for future reference, checking and project
                  documentation.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Example PDF Report Flow
            </h2>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
              <p className="text-slate-300 leading-8 font-mono">
                Step 1: Select calculator or BOQ tool
                <br />
                Step 2: Enter project details and input values
                <br />
                Step 3: Generate calculation result
                <br />
                Step 4: Review material quantity or cost summary
                <br />
                Step 5: Download professional PDF report
              </p>
            </div>
          </div>

          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Important Engineering Note
            </h2>

            <p className="text-slate-300 leading-7">
              PDF reports are useful for documentation, estimation and
              calculation sharing. However, final structural design, safety
              decisions and code compliance should always be checked by a
              qualified civil or structural engineer before execution.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-5">
              Frequently Asked Questions
            </h2>

            <div className="space-y-5">
              <div>
                <h3 className="font-semibold text-white mb-2">
                  What is a civil engineering PDF report?
                </h3>
                <p className="text-slate-300 leading-7">
                  It is a downloadable report that contains civil engineering
                  calculation inputs, outputs, project details, material
                  quantities and summary in PDF format.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-2">
                  Can I generate BOQ PDF reports?
                </h3>
                <p className="text-slate-300 leading-7">
                  Yes, BOQ reports can include item descriptions, units,
                  quantities, rates, amounts, GST, wastage and total project
                  cost.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-2">
                  Are PDF reports useful for site engineers?
                </h3>
                <p className="text-slate-300 leading-7">
                  Yes, site engineers can use PDF reports to save calculations,
                  share outputs, check quantities and maintain project records.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-2">
                  Can students use these reports?
                </h3>
                <p className="text-slate-300 leading-7">
                  Yes, students can use reports for learning, assignments,
                  project documentation and understanding civil engineering
                  calculations.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Related Tools
            </h2>

            <ul className="grid md:grid-cols-2 gap-3 text-slate-300">
              <li>
                <Link
                  href="/boq-generator"
                  className="text-orange-400 hover:text-orange-300"
                >
                  BOQ Generator
                </Link>
              </li>
              <li>
                <Link
                  href="/home-construction-cost-calculator"
                  className="text-orange-400 hover:text-orange-300"
                >
                  Home Construction Cost Calculator
                </Link>
              </li>
              <li>
                <Link
                  href="/rcc-design-calculators"
                  className="text-orange-400 hover:text-orange-300"
                >
                  RCC Design Calculators
                </Link>
              </li>
              <li>
                <Link
                  href="/quantity-estimation-calculators"
                  className="text-orange-400 hover:text-orange-300"
                >
                  Quantity Estimation Calculators
                </Link>
              </li>
              <li>
                <Link
                  href="/ai-civil-engineering-assistant"
                  className="text-orange-400 hover:text-orange-300"
                >
                  AI Civil Engineering Assistant
                </Link>
              </li>
              <li>
                <Link
                  href="/civil-engineering-calculators"
                  className="text-orange-400 hover:text-orange-300"
                >
                  All Civil Engineering Calculators
                </Link>
              </li>
            </ul>
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/civil-engineering-calculators"
              className="inline-block border border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white transition px-6 py-3 rounded-xl font-semibold"
            >
              Explore Calculators with PDF Reports
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}
