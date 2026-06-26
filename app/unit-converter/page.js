import Link from 'next/link'

export const metadata = {
  title:
    'Civil Engineering Unit Converter | Length, Area, Volume & Weight | CivilCalc Pro',
  description:
    'Use CivilCalc Pro Unit Converter to convert civil engineering units including length, area, volume, weight, concrete volume, steel weight and construction measurement units.',
  alternates: {
    canonical: 'https://civilcalcpro.in/unit-converter',
  },
  openGraph: {
    title:
      'Civil Engineering Unit Converter | Length, Area, Volume & Weight',
    description:
      'Convert civil engineering units for length, area, volume, weight, concrete, steel and construction measurement with CivilCalc Pro.',
    url: 'https://civilcalcpro.in/unit-converter',
    siteName: 'CivilCalc Pro',
    type: 'article',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title:
      'Civil Engineering Unit Converter | Length, Area, Volume & Weight',
    description:
      'Convert civil engineering units such as meter, feet, inch, square feet, cubic meter, kg, ton and more.',
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

const pageUrl = 'https://civilcalcpro.in/unit-converter'

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is a civil engineering unit converter?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'A civil engineering unit converter helps convert construction units such as length, area, volume, weight, steel quantity and material measurement units used in site work and estimation.',
      },
    },
    {
      '@type': 'Question',
      name: 'Which units are commonly used in civil engineering?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'Common civil engineering units include meter, feet, inch, millimeter, square feet, square meter, cubic meter, cubic feet, kilogram, ton, cement bags and steel weight units.',
      },
    },
    {
      '@type': 'Question',
      name: 'Why is unit conversion important in construction?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'Unit conversion is important because drawings, site measurements, material rates and BOQ quantities may use different unit systems. Correct conversion helps avoid quantity and cost errors.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do you convert square feet to square meter?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'To convert square feet to square meter, multiply square feet by 0.092903. For example, 1000 square feet is approximately 92.90 square meter.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do you convert cubic meter to cubic feet?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'To convert cubic meter to cubic feet, multiply cubic meter by 35.3147. For example, 1 cubic meter is approximately 35.31 cubic feet.',
      },
    },
  ],
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'TechArticle',
  headline:
    'Civil Engineering Unit Converter for Construction Measurements',
  description:
    'A practical civil engineering unit conversion guide covering length, area, volume, weight, steel, concrete and construction measurement units.',
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
    'Civil engineering unit converter',
    'Construction unit conversion',
    'Length conversion',
    'Area conversion',
    'Volume conversion',
    'Weight conversion',
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
      name: 'Unit Converter',
      item: pageUrl,
    },
  ],
}

export default function UnitConverterPage() {
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
          CIVIL ENGINEERING UNIT CONVERSION
        </p>

        <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
          Civil Engineering Unit Converter
        </h1>

        <p className="text-slate-300 text-lg lg:text-xl mb-8 leading-8 max-w-4xl">
          Use the Civil Engineering Unit Converter to convert common construction
          units such as meter, feet, inch, square feet, square meter, cubic
          meter, cubic feet, kilogram, ton and other civil engineering
          measurement units.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Link
            href="/dashboard/calculators/unit-converter"
            className="bg-orange-500 hover:bg-orange-600 transition px-6 py-4 rounded-xl font-semibold text-center"
          >
            Open Unit Converter Tool
          </Link>

          <Link
            href="/civil-engineering-calculators"
            className="bg-slate-900 hover:bg-slate-800 border border-slate-700 transition px-6 py-4 rounded-xl font-semibold text-center"
          >
            View All Civil Calculators
          </Link>
        </div>

        <section className="bg-orange-500/10 border border-orange-500/30 rounded-2xl p-6 lg:p-8 mb-10">
          <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">
            Quick Answer
          </h2>

          <p className="text-slate-200 leading-8 text-lg">
            A <strong>civil engineering unit converter</strong> helps convert
            construction measurements such as length, area, volume and weight.
            It is useful when drawings, BOQ items, material rates and site
            measurements are given in different units.
          </p>
        </section>

        <section className="space-y-8">
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Why Unit Conversion is Important in Civil Engineering
            </h2>

            <p className="text-slate-300 leading-7">
              In civil engineering, measurements are often used in different
              unit systems. A drawing may show dimensions in millimeters, site
              work may be measured in feet, and BOQ quantities may be prepared
              in square meter or cubic meter. Correct unit conversion helps
              reduce estimation errors, material wastage and cost mistakes.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 overflow-x-auto">
            <h2 className="text-2xl font-bold text-white mb-4">
              Common Civil Engineering Unit Conversions
            </h2>

            <table className="w-full border-collapse text-left text-slate-300">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="py-3 pr-4 text-white">Conversion</th>
                  <th className="py-3 pr-4 text-white">Formula</th>
                  <th className="py-3 pr-4 text-white">Use</th>
                </tr>
              </thead>

              <tbody>
                <tr className="border-b border-slate-800">
                  <td className="py-3 pr-4">Meter to Feet</td>
                  <td className="py-3 pr-4">1 m = 3.28084 ft</td>
                  <td className="py-3 pr-4">Length measurement</td>
                </tr>

                <tr className="border-b border-slate-800">
                  <td className="py-3 pr-4">Feet to Meter</td>
                  <td className="py-3 pr-4">1 ft = 0.3048 m</td>
                  <td className="py-3 pr-4">Site dimension conversion</td>
                </tr>

                <tr className="border-b border-slate-800">
                  <td className="py-3 pr-4">Square Feet to Square Meter</td>
                  <td className="py-3 pr-4">1 sq ft = 0.092903 sq m</td>
                  <td className="py-3 pr-4">Area calculation</td>
                </tr>

                <tr className="border-b border-slate-800">
                  <td className="py-3 pr-4">Cubic Meter to Cubic Feet</td>
                  <td className="py-3 pr-4">1 m³ = 35.3147 ft³</td>
                  <td className="py-3 pr-4">Concrete and excavation volume</td>
                </tr>

                <tr>
                  <td className="py-3 pr-4">Ton to Kilogram</td>
                  <td className="py-3 pr-4">1 ton = 1000 kg</td>
                  <td className="py-3 pr-4">Steel and material weight</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4">
                Length Unit Conversion
              </h2>

              <p className="text-slate-300 leading-7">
                Length unit conversion is used for beams, columns, slabs,
                footings, walls and site measurements. Common length units
                include millimeter, centimeter, meter, inch and feet.
              </p>
            </div>

            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4">
                Area Unit Conversion
              </h2>

              <p className="text-slate-300 leading-7">
                Area conversion is used in flooring, plaster, painting,
                shuttering and built-up area calculations. Common area units
                include square feet, square meter and square yard.
              </p>
            </div>

            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4">
                Volume Unit Conversion
              </h2>

              <p className="text-slate-300 leading-7">
                Volume conversion is used for concrete, excavation, PCC, RCC,
                backfilling and material estimation. Common volume units include
                cubic meter and cubic feet.
              </p>
            </div>

            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4">
                Weight Unit Conversion
              </h2>

              <p className="text-slate-300 leading-7">
                Weight conversion is used for steel, cement, aggregate and other
                construction materials. Common weight units include kilogram,
                metric ton and gram.
              </p>
            </div>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Practical Example
            </h2>

            <p className="text-slate-300 leading-7 mb-4">
              Suppose a room area is 1000 square feet and you want to convert it
              into square meter.
            </p>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
              <p className="text-slate-300 leading-8 font-mono">
                Area in square meter = Area in square feet × 0.092903
                <br />
                Area = 1000 × 0.092903
                <br />
                Area = 92.90 sq m
              </p>
            </div>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-5">
              Frequently Asked Questions
            </h2>

            <div className="space-y-5">
              <div>
                <h3 className="font-semibold text-white mb-2">
                  What is a civil engineering unit converter?
                </h3>
                <p className="text-slate-300 leading-7">
                  It is a tool that converts civil engineering measurements such
                  as length, area, volume and weight from one unit to another.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-2">
                  Why is unit conversion important in construction?
                </h3>
                <p className="text-slate-300 leading-7">
                  It helps avoid mistakes when drawings, BOQ quantities, site
                  measurements and material rates use different units.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-2">
                  How do you convert square feet to square meter?
                </h3>
                <p className="text-slate-300 leading-7">
                  Multiply square feet by 0.092903. For example, 1000 square
                  feet is approximately 92.90 square meter.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-2">
                  How do you convert cubic meter to cubic feet?
                </h3>
                <p className="text-slate-300 leading-7">
                  Multiply cubic meter by 35.3147. For example, 1 cubic meter is
                  approximately 35.31 cubic feet.
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
                  href="/concrete-volume-calculator"
                  className="text-orange-400 hover:text-orange-300"
                >
                  Concrete Volume Calculator
                </Link>
              </li>
              <li>
                <Link
                  href="/steel-weight-calculator"
                  className="text-orange-400 hover:text-orange-300"
                >
                  Steel Weight Calculator
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
              href="/dashboard/calculators/unit-converter"
              className="inline-block border border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white transition px-6 py-3 rounded-xl font-semibold"
            >
              Open Unit Converter Tool
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}
