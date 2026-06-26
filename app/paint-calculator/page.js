import Link from 'next/link'

export const metadata = {
  title:
    'Paint Calculator | Wall Paint Quantity & Cost Calculator | CivilCalc Pro',
  description:
    'Use CivilCalc Pro Paint Calculator to estimate wall paint quantity, paintable area, primer, putty, number of paint buckets, wastage and painting cost for interior and exterior walls.',
  alternates: {
    canonical: 'https://civilcalcpro.in/paint-calculator',
  },
  openGraph: {
    title: 'Paint Calculator | Wall Paint Quantity & Cost Calculator',
    description:
      'Calculate wall paint quantity, paintable area, primer, putty, paint buckets and painting cost for house construction and finishing work.',
    url: 'https://civilcalcpro.in/paint-calculator',
    siteName: 'CivilCalc Pro',
    type: 'article',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Paint Calculator | Wall Paint Quantity & Cost Calculator',
    description:
      'Estimate paint quantity for interior and exterior walls with area, coats, coverage, primer and wastage.',
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

const pageUrl = 'https://civilcalcpro.in/paint-calculator'

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is a paint calculator?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'A paint calculator helps estimate paint quantity required for walls, ceilings or surfaces based on paintable area, number of coats, paint coverage, primer and wastage.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do you calculate paint quantity?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'Paint quantity is calculated by dividing total paintable area by paint coverage per litre and multiplying by the number of coats. Wastage can be added for practical site use.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the formula for paint quantity?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'Paint quantity formula is: Paint required = Total paintable area × Number of coats / Paint coverage per litre.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much paint is required for 1000 square feet?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'Paint required for 1000 square feet depends on paint coverage and number of coats. If coverage is 100 square feet per litre per coat and two coats are required, then approximately 20 litres of paint are needed before wastage.',
      },
    },
    {
      '@type': 'Question',
      name: 'Should primer be calculated separately?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'Yes, primer should be calculated separately because primer coverage and application requirements may be different from wall paint.',
      },
    },
  ],
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'TechArticle',
  headline: 'Paint Calculator for Wall Paint Quantity and Cost Estimation',
  description:
    'A practical guide to wall paint quantity calculation including paintable area, number of coats, coverage, primer, putty, wastage and painting cost.',
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
    'Paint calculator',
    'Wall paint quantity',
    'Painting cost calculator',
    'Primer calculation',
    'Construction finishing work',
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
      name: 'Paint Calculator',
      item: pageUrl,
    },
  ],
}

export default function PaintCalculatorPage() {
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
          PAINTING ESTIMATION TOOL
        </p>

        <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
          Paint Calculator
        </h1>

        <p className="text-slate-300 text-lg lg:text-xl mb-8 leading-8 max-w-4xl">
          Use the Paint Calculator to estimate wall paint quantity, primer,
          paintable area, number of coats, paint buckets, wastage and painting
          cost for interior walls, exterior walls, ceilings and finishing work.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Link
            href="/dashboard/calculators/paint"
            className="bg-orange-500 hover:bg-orange-600 transition px-6 py-4 rounded-xl font-semibold text-center"
          >
            Open Paint Calculator Tool
          </Link>

          <Link
            href="/home-construction-cost-calculator"
            className="bg-slate-900 hover:bg-slate-800 border border-slate-700 transition px-6 py-4 rounded-xl font-semibold text-center"
          >
            Home Construction Cost Calculator
          </Link>
        </div>

        <section className="bg-orange-500/10 border border-orange-500/30 rounded-2xl p-6 lg:p-8 mb-10">
          <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">
            Quick Answer
          </h2>

          <p className="text-slate-200 leading-8 text-lg">
            A <strong>paint calculator</strong> estimates paint quantity by
            calculating the total paintable area, number of coats and paint
            coverage per litre. The basic formula is{' '}
            <strong>
              Paint Required = Paintable Area × Number of Coats / Coverage
            </strong>
            .
          </p>
        </section>

        <section className="space-y-8">
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              What is a Paint Calculator?
            </h2>

            <p className="text-slate-300 leading-7">
              A paint calculator is a construction finishing estimation tool
              used to calculate how much paint is required for walls, ceilings,
              rooms, exterior surfaces and interior painting work. It helps
              estimate paint quantity before purchasing material and reduces
              shortage, excess purchase and cost mistakes.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Paint Quantity Formula
            </h2>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 mb-5">
              <p className="text-slate-200 font-mono leading-8">
                Paintable Area = Wall Area - Opening Area
                <br />
                Paint Required = Paintable Area × Number of Coats / Paint
                Coverage
                <br />
                Final Paint = Paint Required + Wastage
              </p>
            </div>

            <p className="text-slate-300 leading-7">
              Paint coverage depends on paint type, wall surface, brand,
              application method and number of coats. Primer and putty should be
              estimated separately when required.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 overflow-x-auto">
            <h2 className="text-2xl font-bold text-white mb-4">
              Common Paint Calculation Inputs
            </h2>

            <table className="w-full border-collapse text-left text-slate-300">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="py-3 pr-4 text-white">Input</th>
                  <th className="py-3 pr-4 text-white">Meaning</th>
                  <th className="py-3 pr-4 text-white">Example</th>
                </tr>
              </thead>

              <tbody>
                <tr className="border-b border-slate-800">
                  <td className="py-3 pr-4">Wall Length</td>
                  <td className="py-3 pr-4">Length of wall surface</td>
                  <td className="py-3 pr-4">12 ft</td>
                </tr>

                <tr className="border-b border-slate-800">
                  <td className="py-3 pr-4">Wall Height</td>
                  <td className="py-3 pr-4">Height of wall surface</td>
                  <td className="py-3 pr-4">10 ft</td>
                </tr>

                <tr className="border-b border-slate-800">
                  <td className="py-3 pr-4">Openings</td>
                  <td className="py-3 pr-4">
                    Door and window area to be deducted
                  </td>
                  <td className="py-3 pr-4">Door, window, ventilator</td>
                </tr>

                <tr className="border-b border-slate-800">
                  <td className="py-3 pr-4">Number of Coats</td>
                  <td className="py-3 pr-4">Paint layers required</td>
                  <td className="py-3 pr-4">2 coats</td>
                </tr>

                <tr>
                  <td className="py-3 pr-4">Coverage</td>
                  <td className="py-3 pr-4">
                    Area covered by 1 litre of paint
                  </td>
                  <td className="py-3 pr-4">100 sq ft / litre / coat</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4">
                Interior Paint Calculation
              </h2>

              <p className="text-slate-300 leading-7">
                Interior paint calculation is used for bedrooms, halls,
                kitchens, bathrooms, offices and internal wall surfaces. It
                usually includes wall area, ceiling area, primer, putty and two
                coats of paint depending on finish requirement.
              </p>
            </div>

            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4">
                Exterior Paint Calculation
              </h2>

              <p className="text-slate-300 leading-7">
                Exterior paint calculation is used for outer walls, elevation
                surfaces and weather-exposed areas. Exterior paint quantity may
                vary because of surface texture, plaster finish, weather coat
                requirement and paint absorption.
              </p>
            </div>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Practical Example
            </h2>

            <p className="text-slate-300 leading-7 mb-4">
              Suppose total paintable wall area is 1000 sq ft, paint coverage is
              100 sq ft per litre per coat and two coats are required.
            </p>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
              <p className="text-slate-300 leading-8 font-mono">
                Paintable Area = 1000 sq ft
                <br />
                Number of Coats = 2
                <br />
                Coverage = 100 sq ft/litre/coat
                <br />
                Paint Required = 1000 × 2 / 100
                <br />
                Paint Required = 20 litres
              </p>
            </div>

            <p className="text-slate-300 leading-7 mt-4">
              If 10% wastage is added, final paint quantity becomes 22 litres.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Primer, Putty and Paint
            </h2>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
                <h3 className="font-semibold text-orange-400 mb-2">Putty</h3>
                <p className="text-slate-300 leading-7 text-sm">
                  Used to smooth wall surface before primer and paint.
                </p>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
                <h3 className="font-semibold text-orange-400 mb-2">Primer</h3>
                <p className="text-slate-300 leading-7 text-sm">
                  Used as base coat to improve paint bonding and finish.
                </p>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
                <h3 className="font-semibold text-orange-400 mb-2">Paint</h3>
                <p className="text-slate-300 leading-7 text-sm">
                  Final finishing coat used for colour, protection and look.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-5">
              Frequently Asked Questions
            </h2>

            <div className="space-y-5">
              <div>
                <h3 className="font-semibold text-white mb-2">
                  What is a paint calculator?
                </h3>
                <p className="text-slate-300 leading-7">
                  A paint calculator estimates paint quantity required for wall,
                  ceiling, interior or exterior painting work based on area,
                  coverage and number of coats.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-2">
                  How do you calculate paint quantity?
                </h3>
                <p className="text-slate-300 leading-7">
                  Multiply paintable area by number of coats and divide by paint
                  coverage per litre. Add wastage for practical site use.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-2">
                  How much wastage should be added for paint?
                </h3>
                <p className="text-slate-300 leading-7">
                  Usually 5% to 10% wastage can be added depending on wall
                  surface, absorption, texture and application method.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-2">
                  Is primer included in paint quantity?
                </h3>
                <p className="text-slate-300 leading-7">
                  Primer is generally calculated separately because primer and
                  wall paint have different coverage and application purposes.
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
                  href="/tile-calculator"
                  className="text-orange-400 hover:text-orange-300"
                >
                  Tile Calculator
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
                  href="/home-construction-cost-calculator"
                  className="text-orange-400 hover:text-orange-300"
                >
                  Home Construction Cost Calculator
                </Link>
              </li>
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
                  href="/unit-converter"
                  className="text-orange-400 hover:text-orange-300"
                >
                  Unit Converter
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
              href="/dashboard/calculators/paint"
              className="inline-block border border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white transition px-6 py-3 rounded-xl font-semibold"
            >
              Open Paint Calculator Tool
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}
