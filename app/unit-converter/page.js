import Link from 'next/link'

export const metadata = {
  title: 'Unit Converter Online | Civil Engineering Unit Conversion Calculator',
  description:
    'Convert length, area, volume, weight, steel, concrete and construction units online with CivilCalc Pro Unit Converter for civil engineers.',
  keywords: [
    'unit converter',
    'civil engineering unit converter',
    'construction unit converter',
    'length unit converter',
    'area unit converter',
    'volume unit converter',
    'civil calculator',
    'construction calculator India',
    'engineering unit conversion',
  ],
  alternates: {
    canonical: 'https://www.civilcalcpro.in/unit-converter',
  },
  openGraph: {
    title: 'Unit Converter Online | CivilCalc Pro',
    description:
      'Convert civil engineering units like meter, feet, square meter, square feet, cubic meter, cubic feet, kg, ton and more.',
    url: 'https://www.civilcalcpro.in/unit-converter',
    siteName: 'CivilCalc Pro',
    type: 'article',
  },
}

const faqs = [
  {
    q: 'What is a unit converter?',
    a: 'A unit converter is a calculator used to convert one unit into another unit, such as meter to feet, square feet to square meter, cubic meter to cubic feet and kg to ton.',
  },
  {
    q: 'Why is unit conversion important in civil engineering?',
    a: 'Unit conversion is important because civil engineering drawings, estimates, BOQs and site measurements may use different units such as meter, feet, inch, mm, square feet, cubic meter and kg.',
  },
  {
    q: 'Can this unit converter be used for construction work?',
    a: 'Yes, this unit converter can be used for construction measurements, quantity estimation, BOQ preparation, billing and civil engineering calculations.',
  },
  {
    q: 'Which units are commonly used in construction in India?',
    a: 'Common construction units in India include meter, feet, inch, mm, square feet, square meter, cubic feet, cubic meter, kg, ton, bags and numbers.',
  },
]

export default function UnitConverterArticle() {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Unit Converter Online | Civil Engineering Unit Conversion Calculator',
    description:
      'Complete guide to civil engineering unit conversion for length, area, volume, weight and construction measurements.',
    author: {
      '@type': 'Organization',
      name: 'CivilCalc Pro',
    },
    publisher: {
      '@type': 'Organization',
      name: 'CivilCalc Pro',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': 'https://www.civilcalcpro.in/unit-converter',
    },
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  }

  const conversionTypes = [
    'Length conversion',
    'Area conversion',
    'Volume conversion',
    'Weight conversion',
    'Concrete quantity conversion',
    'Steel quantity conversion',
    'Construction material conversion',
    'Site measurement conversion',
  ]

  const useCases = [
    'Meter to feet conversion',
    'Feet to meter conversion',
    'Square feet to square meter conversion',
    'Square meter to square feet conversion',
    'Cubic meter to cubic feet conversion',
    'Cubic feet to cubic meter conversion',
    'Kg to ton conversion',
    'Mm to inch conversion',
    'BOQ unit conversion',
    'Civil engineering student practice',
  ]

  const conversionTable = [
    ['1 meter', '3.28084 feet'],
    ['1 feet', '0.3048 meter'],
    ['1 square meter', '10.7639 square feet'],
    ['1 square feet', '0.092903 square meter'],
    ['1 cubic meter', '35.3147 cubic feet'],
    ['1 cubic feet', '0.0283168 cubic meter'],
    ['1 ton', '1000 kg'],
    ['1 inch', '25.4 mm'],
  ]

  return (
    <main className="min-h-screen bg-[#050B1F] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <section className="mx-auto max-w-5xl px-5 py-16">
        <p className="mb-3 text-sm font-bold uppercase tracking-wider text-orange-400">
          Civil Engineering Article
        </p>

        <h1 className="max-w-4xl text-4xl font-extrabold leading-tight md:text-5xl">
          Unit Converter Online – Civil Engineering Unit Conversion Calculator
        </h1>

        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
          Use CivilCalc Pro Unit Converter to convert civil engineering and
          construction units such as meter, feet, inch, mm, square feet, square
          meter, cubic feet, cubic meter, kg and ton.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/dashboard/calculators/unit-converter"
            className="rounded-xl bg-orange-500 px-6 py-3 font-bold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600"
          >
            Open Unit Converter
          </Link>

          <Link
            href="/"
            className="rounded-xl border border-slate-700 px-6 py-3 font-bold text-slate-200 transition hover:border-orange-400 hover:text-orange-300"
          >
            Back to Home
          </Link>
        </div>

        <article className="mt-12 space-y-10 text-slate-300">
          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              What is a Unit Converter?
            </h2>

            <p className="leading-8">
              A Unit Converter is an online calculator used to convert one unit into
              another unit. In civil engineering and construction work, measurements
              are often used in different unit systems such as meter, feet, inch,
              millimeter, square feet, square meter, cubic feet, cubic meter, kg and
              ton.
            </p>

            <p className="mt-4 leading-8">
              CivilCalc Pro Unit Converter helps civil engineers, contractors, site
              engineers, builders, estimators and students convert construction units
              quickly and accurately without manual conversion mistakes.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Why Unit Conversion is Important in Civil Engineering
            </h2>

            <p className="leading-8">
              Unit conversion is important because construction drawings, BOQs,
              estimates, site measurements and material calculations may use different
              units. For example, room dimensions may be measured in feet, concrete
              quantity may be calculated in cubic meter, steel may be calculated in kg
              and flooring may be measured in square feet.
            </p>

            <p className="mt-4 leading-8">
              Wrong unit conversion can create quantity mistakes, billing errors,
              material shortage, extra cost and site confusion. Accurate unit
              conversion helps in better estimation, billing, BOQ preparation and
              construction planning.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Common Construction Unit Conversions
            </h2>

            <p className="leading-8">
              Civil engineers commonly use the following conversions in daily site
              work and quantity estimation.
            </p>

            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-800">
              <table className="w-full border-collapse text-left">
                <thead className="bg-slate-900">
                  <tr>
                    <th className="border-b border-slate-800 px-4 py-3 text-white">
                      Unit
                    </th>
                    <th className="border-b border-slate-800 px-4 py-3 text-white">
                      Conversion
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {conversionTable.map((row) => (
                    <tr key={row[0]} className="bg-slate-900/40">
                      <td className="border-b border-slate-800 px-4 py-3">
                        {row[0]}
                      </td>
                      <td className="border-b border-slate-800 px-4 py-3">
                        {row[1]}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Length Unit Conversion
            </h2>

            <p className="leading-8">
              Length conversion is used for converting meter, feet, inch, millimeter
              and centimeter. It is useful for drawings, site measurements, room
              dimensions, column size, beam size, slab thickness and footing
              dimensions.
            </p>

            <div className="my-6 rounded-2xl border border-orange-500/30 bg-slate-900 p-5">
              <p className="text-xl font-bold text-orange-300">
                1 meter = 3.28084 feet
              </p>
            </div>

            <div className="my-6 rounded-2xl border border-orange-500/30 bg-slate-900 p-5">
              <p className="text-xl font-bold text-orange-300">
                1 feet = 0.3048 meter
              </p>
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Area Unit Conversion
            </h2>

            <p className="leading-8">
              Area conversion is used for flooring, plaster, painting, tile work,
              shuttering, land area and built-up area calculation. In India, square
              feet and square meter are both commonly used in construction and real
              estate work.
            </p>

            <div className="my-6 rounded-2xl border border-orange-500/30 bg-slate-900 p-5">
              <p className="text-xl font-bold text-orange-300">
                1 square meter = 10.7639 square feet
              </p>
            </div>

            <div className="my-6 rounded-2xl border border-orange-500/30 bg-slate-900 p-5">
              <p className="text-xl font-bold text-orange-300">
                1 square feet = 0.092903 square meter
              </p>
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Volume Unit Conversion
            </h2>

            <p className="leading-8">
              Volume conversion is used for concrete quantity, excavation, brickwork,
              PCC, RCC, mortar and material estimation. Cubic meter and cubic feet
              are the most common volume units used in construction.
            </p>

            <div className="my-6 rounded-2xl border border-orange-500/30 bg-slate-900 p-5">
              <p className="text-xl font-bold text-orange-300">
                1 cubic meter = 35.3147 cubic feet
              </p>
            </div>

            <div className="my-6 rounded-2xl border border-orange-500/30 bg-slate-900 p-5">
              <p className="text-xl font-bold text-orange-300">
                1 cubic feet = 0.0283168 cubic meter
              </p>
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Weight Unit Conversion
            </h2>

            <p className="leading-8">
              Weight conversion is used for steel, cement, aggregate, sand, material
              delivery and billing. Steel is commonly measured in kg or ton, while
              cement is commonly measured in bags and kg.
            </p>

            <div className="my-6 rounded-2xl border border-orange-500/30 bg-slate-900 p-5">
              <p className="text-xl font-bold text-orange-300">
                1 ton = 1000 kg
              </p>
            </div>

            <div className="my-6 rounded-2xl border border-orange-500/30 bg-slate-900 p-5">
              <p className="text-xl font-bold text-orange-300">
                1 cement bag = 50 kg
              </p>
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Types of Unit Conversion Available
            </h2>

            <p className="leading-8">
              CivilCalc Pro Unit Converter can be used for different construction
              and civil engineering unit conversion needs.
            </p>

            <ul className="list-disc space-y-2 pl-6 leading-8">
              {conversionTypes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Example of Unit Conversion
            </h2>

            <p className="leading-8">
              Suppose a room area is 500 square feet and you want to convert it into
              square meter.
            </p>

            <div className="my-6 rounded-2xl border border-slate-700 bg-slate-900 p-5 leading-8">
              <p>1 square feet = 0.092903 square meter</p>
              <p>Area in square meter = 500 × 0.092903</p>
              <p>Area in square meter = 46.45 m²</p>
            </div>

            <p className="leading-8">
              So, <strong className="text-white">500 sq ft</strong> is approximately{' '}
              <strong className="text-white">46.45 m²</strong>.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              How to Use CivilCalc Pro Unit Converter
            </h2>

            <p className="leading-8">
              Select the conversion type, enter the value and choose the unit you want
              to convert from and convert to. The tool will instantly show the
              converted result.
            </p>

            <p className="mt-4 leading-8">
              This makes civil engineering unit conversion faster and easier for site
              engineers, contractors, estimators and students.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Where Unit Converter is Used
            </h2>

            <ul className="list-disc space-y-2 pl-6 leading-8">
              {useCases.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Unit Converter for Civil Engineers and Contractors
            </h2>

            <p className="leading-8">
              Civil engineers and contractors need quick unit conversion during site
              work, estimation, measurement, billing and BOQ preparation. CivilCalc
              Pro Unit Converter is designed for practical construction use and helps
              users avoid manual conversion mistakes.
            </p>

            <p className="mt-4 leading-8">
              Whether you are converting square feet to square meter, cubic meter to
              cubic feet, meter to feet or kg to ton, this tool helps you get quick
              and accurate results.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Benefits of CivilCalc Pro Unit Converter
            </h2>

            <ul className="list-disc space-y-2 pl-6 leading-8">
              <li>Fast civil engineering unit conversion</li>
              <li>Useful for length, area, volume and weight conversion</li>
              <li>Helps in BOQ and billing work</li>
              <li>Reduces manual conversion mistakes</li>
              <li>Useful for construction site measurements</li>
              <li>Helpful for civil engineers, contractors and students</li>
              <li>Simple input and instant output</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">Conclusion</h2>

            <p className="leading-8">
              Unit conversion is a basic but very important part of civil engineering
              and construction work. CivilCalc Pro Unit Converter helps civil
              engineers, contractors, estimators and students convert length, area,
              volume and weight units quickly.
            </p>

            <p className="mt-4 leading-8">
              For accurate construction measurement, quantity estimation, BOQ
              preparation and billing, use CivilCalc Pro Unit Converter.
            </p>
          </section>

          <div className="rounded-3xl border border-orange-500/30 bg-gradient-to-br from-orange-500/15 to-slate-900 p-6">
            <h2 className="text-2xl font-extrabold text-white">
              Convert Civil Engineering Units Instantly
            </h2>

            <p className="mt-3 leading-8 text-slate-300">
              Open CivilCalc Pro Unit Converter and convert meter, feet, square feet,
              square meter, cubic meter, cubic feet, kg, ton and more.
            </p>

            <Link
              href="/dashboard/calculators/unit-converter"
              className="mt-5 inline-flex rounded-xl bg-orange-500 px-6 py-3 font-bold text-white transition hover:bg-orange-600"
            >
              Use Unit Converter
            </Link>
          </div>

          <section>
            <h2 className="mb-6 text-3xl font-bold text-white">FAQs</h2>

            <div className="space-y-5">
              {faqs.map((item) => (
                <div
                  key={item.q}
                  className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5"
                >
                  <h3 className="text-xl font-bold text-white">{item.q}</h3>
                  <p className="mt-2 leading-8 text-slate-300">{item.a}</p>
                </div>
              ))}
            </div>
          </section>
        </article>
      </section>
    </main>
  )
}
