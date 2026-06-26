import Link from 'next/link'

export const metadata = {
  title:
    'Rate Analysis Calculator | Construction Item Rate Analysis | CivilCalc Pro',
  description:
    'Use CivilCalc Pro Rate Analysis Calculator to understand construction item rate analysis, material cost, labour cost, equipment cost, overheads, profit and final item rate for civil engineering works.',
  alternates: {
    canonical: 'https://civilcalcpro.in/rate-analysis-calculator',
  },
  openGraph: {
    title:
      'Rate Analysis Calculator | Construction Item Rate Analysis',
    description:
      'Learn rate analysis for civil engineering works including material cost, labour cost, equipment cost, overheads, contractor profit and final item rate.',
    url: 'https://civilcalcpro.in/rate-analysis-calculator',
    siteName: 'CivilCalc Pro',
    type: 'article',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title:
      'Rate Analysis Calculator | Construction Item Rate Analysis',
    description:
      'Calculate and understand construction item rate analysis with material, labour, equipment, overhead and profit components.',
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

const pageUrl = 'https://civilcalcpro.in/rate-analysis-calculator'

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is rate analysis in civil engineering?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'Rate analysis in civil engineering is the process of calculating the cost of one unit of construction work by considering material cost, labour cost, equipment cost, transportation, overheads, wastage and contractor profit.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is included in construction rate analysis?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'Construction rate analysis generally includes materials, labour, machinery, tools, transportation, wastage, overheads, taxes and contractor profit.',
      },
    },
    {
      '@type': 'Question',
      name: 'Why is rate analysis important?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'Rate analysis is important because it helps estimate the correct unit rate of construction items, prepare BOQ rates, compare contractor quotations and control project cost.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the formula for rate analysis?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'A basic rate analysis formula is: Final Rate = Material Cost + Labour Cost + Equipment Cost + Overheads + Wastage + Profit.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can rate analysis be used for BOQ preparation?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'Yes, rate analysis is commonly used for BOQ preparation because BOQ amount depends on item quantity multiplied by item rate.',
      },
    },
  ],
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'TechArticle',
  headline:
    'Rate Analysis Calculator for Civil Engineering Construction Works',
  description:
    'A practical guide to construction rate analysis covering material cost, labour cost, machinery, overheads, wastage, profit and BOQ item rates.',
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
    'Rate analysis calculator',
    'Construction rate analysis',
    'Civil engineering estimation',
    'BOQ rate calculation',
    'Quantity surveying',
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
      name: 'Rate Analysis Calculator',
      item: pageUrl,
    },
  ],
}

export default function RateAnalysisCalculatorPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-16">
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
          CONSTRUCTION ESTIMATION TOOL
        </p>

        <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
          Rate Analysis Calculator
        </h1>

        <p className="text-slate-300 text-lg lg:text-xl mb-8 leading-8 max-w-4xl">
          Use the Rate Analysis Calculator to understand item-wise construction
          rates with material cost, labour cost, equipment cost, overheads,
          wastage, profit and final BOQ item rate. This guide is useful for
          civil engineers, contractors, quantity surveyors and site engineers.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Link
            href="/dashboard/calculators/rate-analysis"
            className="bg-orange-500 hover:bg-orange-600 transition px-6 py-4 rounded-xl font-semibold text-center"
          >
            Open Rate Analysis Tool
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
            <strong>Rate analysis</strong> is the calculation of the cost of one
            unit of construction work. It includes material cost, labour cost,
            equipment cost, transportation, wastage, overheads and contractor
            profit. The final item rate is commonly used in BOQ preparation and
            project estimation.
          </p>
        </section>

        <section className="space-y-8">
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              What is Rate Analysis in Civil Engineering?
            </h2>

            <p className="text-slate-300 leading-7">
              Rate analysis in civil engineering is the process of calculating
              the unit rate of a construction item. For example, the rate of
              brickwork per cubic meter, plaster per square meter, concrete per
              cubic meter or excavation per cubic meter can be calculated using
              rate analysis.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Rate Analysis Formula
            </h2>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 mb-5">
              <p className="text-slate-200 font-mono leading-8">
                Final Rate = Material Cost + Labour Cost + Equipment Cost +
                Transportation + Wastage + Overheads + Profit
              </p>
            </div>

            <p className="text-slate-300 leading-7">
              The exact formula may change depending on the item type, project
              location, labour rate, material rate, machinery requirement and
              contractor margin.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 overflow-x-auto">
            <h2 className="text-2xl font-bold text-white mb-4">
              Components of Rate Analysis
            </h2>

            <table className="w-full border-collapse text-left text-slate-300">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="py-3 pr-4 text-white">Component</th>
                  <th className="py-3 pr-4 text-white">Meaning</th>
                  <th className="py-3 pr-4 text-white">Example</th>
                </tr>
              </thead>

              <tbody>
                <tr className="border-b border-slate-800">
                  <td className="py-3 pr-4">Material Cost</td>
                  <td className="py-3 pr-4">
                    Cost of materials used in the item
                  </td>
                  <td className="py-3 pr-4">
                    Cement, sand, aggregate, bricks, steel
                  </td>
                </tr>

                <tr className="border-b border-slate-800">
                  <td className="py-3 pr-4">Labour Cost</td>
                  <td className="py-3 pr-4">
                    Cost of workers required for execution
                  </td>
                  <td className="py-3 pr-4">
                    Mason, helper, bar bender, carpenter
                  </td>
                </tr>

                <tr className="border-b border-slate-800">
                  <td className="py-3 pr-4">Equipment Cost</td>
                  <td className="py-3 pr-4">
                    Machinery or tool cost used for work
                  </td>
                  <td className="py-3 pr-4">
                    Mixer, vibrator, cutting machine
                  </td>
                </tr>

                <tr className="border-b border-slate-800">
                  <td className="py-3 pr-4">Overheads</td>
                  <td className="py-3 pr-4">
                    Indirect project expenses
                  </td>
                  <td className="py-3 pr-4">
                    Site management, supervision, office cost
                  </td>
                </tr>

                <tr>
                  <td className="py-3 pr-4">Profit</td>
                  <td className="py-3 pr-4">
                    Contractor margin
                  </td>
                  <td className="py-3 pr-4">
                    Usually added as percentage
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4">
                Rate Analysis for BOQ
              </h2>

              <p className="text-slate-300 leading-7">
                In BOQ preparation, every construction item requires a rate.
                Rate analysis helps calculate this rate accurately by breaking
                down material, labour, machinery, overhead and profit. The BOQ
                amount is then calculated as quantity multiplied by item rate.
              </p>
            </div>

            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4">
                Rate Analysis for Contractors
              </h2>

              <p className="text-slate-300 leading-7">
                Contractors use rate analysis to prepare quotations, compare
                tender rates, estimate project cost and maintain profitability.
                It also helps identify whether an item rate is realistic or
                underpriced.
              </p>
            </div>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Simple Example
            </h2>

            <p className="text-slate-300 leading-7 mb-4">
              Suppose the total cost for one unit of work is calculated as:
            </p>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
              <p className="text-slate-300 leading-8 font-mono">
                Material Cost = ₹700
                <br />
                Labour Cost = ₹200
                <br />
                Equipment Cost = ₹50
                <br />
                Overheads = ₹50
                <br />
                Profit = ₹100
                <br />
                Final Rate = ₹1100 per unit
              </p>
            </div>

            <p className="text-slate-300 leading-7 mt-4">
              This final rate can be used in the BOQ item rate column.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-5">
              Frequently Asked Questions
            </h2>

            <div className="space-y-5">
              <div>
                <h3 className="font-semibold text-white mb-2">
                  What is rate analysis in civil engineering?
                </h3>
                <p className="text-slate-300 leading-7">
                  Rate analysis is the process of finding the unit cost of a
                  construction item by adding material, labour, equipment,
                  overhead and profit components.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-2">
                  Why is rate analysis important?
                </h3>
                <p className="text-slate-300 leading-7">
                  It helps prepare accurate BOQ rates, compare quotations,
                  estimate project cost and control construction expenses.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-2">
                  What is the formula for rate analysis?
                </h3>
                <p className="text-slate-300 leading-7">
                  Final Rate = Material Cost + Labour Cost + Equipment Cost +
                  Transportation + Wastage + Overheads + Profit.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-2">
                  Is rate analysis useful for BOQ?
                </h3>
                <p className="text-slate-300 leading-7">
                  Yes, BOQ amount depends on quantity and item rate. Rate
                  analysis helps calculate the item rate correctly.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Related Calculators
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
                  href="/brickwork-calculator"
                  className="text-orange-400 hover:text-orange-300"
                >
                  Brickwork Calculator
                </Link>
              </li>
              <li>
                <Link
                  href="/plaster-calculator"
                  className="text-orange-400 hover:text-orange-300"
                >
                  Plaster Calculator
                </Link>
              </li>
              <li>
                <Link
                  href="/concrete-volume-calculator"
                  className="text-orange-400 hover:text-orange-300"
                >
                  Concrete Volume Calculator
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
              href="/dashboard/calculators/rate-analysis"
              className="inline-block border border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white transition px-6 py-3 rounded-xl font-semibold"
            >
              Open Rate Analysis Tool
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}
