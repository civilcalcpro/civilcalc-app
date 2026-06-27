import Link from 'next/link'

export const metadata = {
  title: 'Plaster Calculator Online | Cement Sand Quantity for Plaster',
  description:
    'Calculate plaster quantity, cement bags, sand quantity, plaster area, mortar volume and wall plaster material online with CivilCalc Pro Plaster Calculator.',
  keywords: [
    'plaster calculator',
    'cement sand calculator for plaster',
    'plaster quantity calculator',
    'wall plaster calculator',
    'cement quantity for plaster',
    'sand quantity for plaster',
    '12mm plaster calculator',
    'civil engineering calculator',
    'construction calculator India',
  ],
  alternates: {
    canonical: 'https://www.civilcalcpro.in/plaster-calculator',
  },
  openGraph: {
    title: 'Plaster Calculator Online | CivilCalc Pro',
    description:
      'Calculate plaster area, mortar volume, cement bags and sand quantity for internal and external wall plaster.',
    url: 'https://www.civilcalcpro.in/plaster-calculator',
    siteName: 'CivilCalc Pro',
    type: 'article',
  },
}

const faqs = [
  {
    q: 'What is a plaster calculator?',
    a: 'A plaster calculator is a civil engineering tool used to calculate plaster area, mortar volume, cement quantity and sand quantity required for wall plastering work.',
  },
  {
    q: 'What is the formula for plaster area?',
    a: 'The basic formula for plaster area is Length × Height. For multiple walls, the total area is calculated by adding all wall areas.',
  },
  {
    q: 'What is the common thickness of wall plaster?',
    a: 'Common plaster thickness is 12 mm for internal wall plaster, 15 mm for ceiling plaster and 20 mm for external wall plaster depending on project specification.',
  },
  {
    q: 'Which cement sand ratio is used for plaster?',
    a: 'Common cement sand ratios for plaster are 1:4, 1:5 and 1:6 depending on surface type, location and project specification.',
  },
]

export default function PlasterCalculatorArticle() {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Plaster Calculator Online | Cement Sand Quantity for Plaster',
    description:
      'Complete guide to calculate plaster area, mortar volume, cement bags and sand quantity for wall plastering work.',
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
      '@id': 'https://www.civilcalcpro.in/plaster-calculator',
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

  const inputs = [
    'Wall length',
    'Wall height',
    'Number of walls',
    'Plaster thickness',
    'Cement sand ratio',
    'Door and window deduction',
    'Wastage percentage',
    'Unit system',
  ]

  const useCases = [
    'Internal wall plaster calculation',
    'External wall plaster calculation',
    'Ceiling plaster calculation',
    'Residential building plaster estimation',
    'Commercial building plaster estimation',
    'Cement and sand material planning',
    'Contractor billing',
    'BOQ preparation',
    'Site quantity checking',
    'Civil engineering student practice',
  ]

  const thicknessTable = [
    ['12 mm', 'Internal wall plaster'],
    ['15 mm', 'Ceiling plaster or smoother surface work'],
    ['20 mm', 'External wall plaster or rough surface plaster'],
  ]

  const ratioTable = [
    ['1:4', 'Strong plaster mortar for higher strength requirement'],
    ['1:5', 'Common plaster mortar for general construction work'],
    ['1:6', 'Economical plaster mortar for normal wall plaster as per specification'],
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
          Plaster Calculator Online – Calculate Cement and Sand for Wall Plaster
        </h1>

        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
          Use CivilCalc Pro Plaster Calculator to calculate plaster area, mortar
          volume, cement bags, sand quantity and material requirement for internal
          wall plaster, external plaster and ceiling plaster.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/dashboard/calculators/plaster"
            className="rounded-xl bg-orange-500 px-6 py-3 font-bold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600"
          >
            Open Plaster Calculator
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
              What is a Plaster Calculator?
            </h2>

            <p className="leading-8">
              A Plaster Calculator is an online civil engineering tool used to
              calculate the quantity of cement, sand and mortar required for wall
              plastering work. Plastering is done to provide a smooth, protective and
              finished surface on brickwork, blockwork and concrete surfaces.
            </p>

            <p className="mt-4 leading-8">
              CivilCalc Pro Plaster Calculator helps civil engineers, contractors,
              builders, site engineers and students calculate plaster material quickly
              by entering wall length, height, plaster thickness and mortar ratio.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Why Plaster Quantity Calculation is Important
            </h2>

            <p className="leading-8">
              Plaster quantity calculation is required before starting plastering work
              because it helps estimate cement bags, sand quantity, mortar volume,
              labour cost and total plastering cost.
            </p>

            <p className="mt-4 leading-8">
              If plaster quantity is not calculated properly, the site may face
              material shortage, excess wastage, wrong billing or delay in finishing
              work. Accurate plaster calculation helps in material planning, BOQ
              preparation and contractor billing.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Plaster Area Formula
            </h2>

            <p className="leading-8">
              The basic formula for plaster area calculation is:
            </p>

            <div className="my-6 rounded-2xl border border-orange-500/30 bg-slate-900 p-5">
              <p className="text-xl font-bold text-orange-300">
                Plaster Area = Length × Height
              </p>
            </div>

            <ul className="list-disc space-y-2 pl-6 leading-8">
              <li>Length = length of wall</li>
              <li>Height = height of wall</li>
              <li>Plaster Area = total surface area to be plastered</li>
            </ul>

            <p className="mt-4 leading-8">
              For multiple walls, calculate each wall area separately and add them
              together. Door and window openings should be deducted if required.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Plaster Volume Formula
            </h2>

            <p className="leading-8">
              After calculating plaster area, wet plaster volume is calculated using
              plaster thickness.
            </p>

            <div className="my-6 rounded-2xl border border-orange-500/30 bg-slate-900 p-5">
              <p className="text-xl font-bold text-orange-300">
                Wet Mortar Volume = Plaster Area × Thickness
              </p>
            </div>

            <p className="leading-8">
              Dry mortar volume is generally taken higher than wet volume because
              cement and sand have voids and shrinkage. A practical conversion factor
              is commonly used for dry volume calculation.
            </p>

            <div className="my-6 rounded-2xl border border-orange-500/30 bg-slate-900 p-5">
              <p className="text-xl font-bold text-orange-300">
                Dry Mortar Volume = Wet Volume × 1.33
              </p>
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Common Plaster Thickness
            </h2>

            <p className="leading-8">
              Plaster thickness depends on wall surface, internal or external work
              and project specification.
            </p>

            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-800">
              <table className="w-full border-collapse text-left">
                <thead className="bg-slate-900">
                  <tr>
                    <th className="border-b border-slate-800 px-4 py-3 text-white">
                      Thickness
                    </th>
                    <th className="border-b border-slate-800 px-4 py-3 text-white">
                      Common Use
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {thicknessTable.map((row) => (
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
              Cement Sand Ratio for Plaster
            </h2>

            <p className="leading-8">
              Mortar ratio means the proportion of cement and sand used for plaster
              work. In a 1:6 ratio, 1 part cement and 6 parts sand are used by
              volume.
            </p>

            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-800">
              <table className="w-full border-collapse text-left">
                <thead className="bg-slate-900">
                  <tr>
                    <th className="border-b border-slate-800 px-4 py-3 text-white">
                      Ratio
                    </th>
                    <th className="border-b border-slate-800 px-4 py-3 text-white">
                      Common Use
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {ratioTable.map((row) => (
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
              Inputs Required for Plaster Calculator
            </h2>

            <p className="leading-8">
              To calculate plaster quantity accurately, the following inputs are
              commonly required:
            </p>

            <ul className="list-disc space-y-2 pl-6 leading-8">
              {inputs.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Example of Plaster Calculation
            </h2>

            <p className="leading-8">
              Suppose a wall has length 10 m, height 3 m and plaster thickness is
              12 mm.
            </p>

            <div className="my-6 rounded-2xl border border-slate-700 bg-slate-900 p-5 leading-8">
              <p>Plaster Area = Length × Height</p>
              <p>Plaster Area = 10 × 3</p>
              <p>Plaster Area = 30 m²</p>
              <p>Thickness = 12 mm = 0.012 m</p>
              <p>Wet Mortar Volume = 30 × 0.012</p>
              <p>Wet Mortar Volume = 0.36 m³</p>
              <p>Dry Mortar Volume = 0.36 × 1.33</p>
              <p>Dry Mortar Volume = 0.479 m³</p>
            </div>

            <p className="leading-8">
              So, for this wall, the plaster area is{' '}
              <strong className="text-white">30 m²</strong> and approximate dry
              mortar volume is <strong className="text-white">0.479 m³</strong>.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              How to Use CivilCalc Pro Plaster Calculator
            </h2>

            <p className="leading-8">
              Enter wall length, wall height, number of walls, plaster thickness,
              mortar ratio and wastage percentage. After entering the values, click
              on calculate. The tool will show plaster area, wet mortar volume, dry
              mortar volume, cement bags and sand quantity.
            </p>

            <p className="mt-4 leading-8">
              This makes plaster estimation faster and easier for civil engineers,
              site engineers, contractors and construction professionals.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Where Plaster Calculator is Used
            </h2>

            <ul className="list-disc space-y-2 pl-6 leading-8">
              {useCases.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Plaster Calculator for Civil Engineers and Contractors
            </h2>

            <p className="leading-8">
              Civil engineers and contractors need quick material calculation for
              daily site work. CivilCalc Pro Plaster Calculator is designed for
              practical construction use. It helps users calculate cement, sand and
              mortar quantity without repeated manual calculations.
            </p>

            <p className="mt-4 leading-8">
              Whether you are preparing BOQ, checking contractor bills, planning
              material purchase or estimating plastering cost, this calculator helps
              you get quick and clear results.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Benefits of CivilCalc Pro Plaster Calculator
            </h2>

            <ul className="list-disc space-y-2 pl-6 leading-8">
              <li>Fast plaster quantity calculation</li>
              <li>Calculates plaster area and mortar volume</li>
              <li>Helps estimate cement and sand for plaster</li>
              <li>Useful for internal and external plaster work</li>
              <li>Supports BOQ preparation and billing</li>
              <li>Reduces manual calculation mistakes</li>
              <li>Useful for civil engineers, contractors and students</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">Conclusion</h2>

            <p className="leading-8">
              Plaster quantity calculation is an important part of construction
              estimation and finishing work. CivilCalc Pro Plaster Calculator helps
              civil engineers, contractors, site engineers and students calculate
              plaster area, mortar volume, cement and sand quickly.
            </p>

            <p className="mt-4 leading-8">
              For better material planning, BOQ preparation and plaster work billing,
              use CivilCalc Pro Plaster Calculator before starting plastering work on
              site.
            </p>
          </section>

          <div className="rounded-3xl border border-orange-500/30 bg-gradient-to-br from-orange-500/15 to-slate-900 p-6">
            <h2 className="text-2xl font-extrabold text-white">
              Calculate Plaster Quantity Instantly
            </h2>

            <p className="mt-3 leading-8 text-slate-300">
              Open CivilCalc Pro Plaster Calculator and calculate plaster area,
              cement bags and sand quantity for your construction project.
            </p>

            <Link
              href="/dashboard/calculators/plaster"
              className="mt-5 inline-flex rounded-xl bg-orange-500 px-6 py-3 font-bold text-white transition hover:bg-orange-600"
            >
              Use Plaster Calculator
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
