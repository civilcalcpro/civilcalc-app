import Link from 'next/link'

export const metadata = {
  title: 'Concrete Calculator Online | Concrete Volume and Mix Calculator',
  description:
    'Calculate concrete volume, cement, sand, aggregate quantity, RCC concrete, PCC concrete and M10 M15 M20 M25 mix ratio online with CivilCalc Pro Concrete Calculator.',
  keywords: [
    'concrete calculator',
    'concrete volume calculator',
    'concrete mix calculator',
    'cement sand aggregate calculator',
    'RCC concrete calculator',
    'PCC concrete calculator',
    'M20 concrete mix calculator',
    'M25 concrete mix calculator',
    'construction calculator India',
    'civil engineering calculator',
  ],
  alternates: {
    canonical: 'https://www.civilcalcpro.in/concrete-calculator',
  },
  openGraph: {
    title: 'Concrete Calculator Online | CivilCalc Pro',
    description:
      'Calculate concrete volume, cement bags, sand, aggregate and concrete mix ratio for RCC, PCC, slab, beam, column and footing.',
    url: 'https://www.civilcalcpro.in/concrete-calculator',
    siteName: 'CivilCalc Pro',
    type: 'article',
  },
}

const faqs = [
  {
    q: 'What is a concrete calculator?',
    a: 'A concrete calculator is a civil engineering tool used to calculate concrete volume, cement quantity, sand quantity, aggregate quantity and concrete mix requirement for construction work.',
  },
  {
    q: 'What is the formula for concrete volume?',
    a: 'The basic formula for concrete volume is Length × Width × Depth or Thickness. The answer is usually measured in cubic meter or cubic feet.',
  },
  {
    q: 'What is concrete mix ratio?',
    a: 'Concrete mix ratio is the proportion of cement, sand and aggregate used to prepare concrete. For example, M20 nominal mix is commonly taken as 1:1.5:3.',
  },
  {
    q: 'How many cement bags are required for 1 cubic meter concrete?',
    a: 'Cement bags depend on concrete grade and mix ratio. For nominal M20 concrete, approximately 8 bags of cement may be required for 1 cubic meter, depending on method and wastage.',
  },
  {
    q: 'Can this calculator be used for RCC and PCC work?',
    a: 'Yes, this concrete calculator can be used for RCC beams, columns, slabs, footings, PCC work, flooring and other concrete quantity calculations.',
  },
]

export default function ConcreteCalculatorArticle() {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Concrete Calculator Online | Concrete Volume and Mix Calculator',
    description:
      'Complete guide to calculate concrete volume, concrete mix ratio, cement bags, sand quantity and aggregate quantity for construction work.',
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
      '@id': 'https://www.civilcalcpro.in/concrete-calculator',
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

  const mixRatioTable = [
    ['M5', '1 : 5 : 10', 'Levelling course, non-structural work'],
    ['M7.5', '1 : 4 : 8', 'PCC and bedding concrete'],
    ['M10', '1 : 3 : 6', 'PCC, floor base and low strength work'],
    ['M15', '1 : 2 : 4', 'PCC and small construction work'],
    ['M20', '1 : 1.5 : 3', 'RCC work and general structural concrete'],
    ['M25', '1 : 1 : 2', 'RCC work with higher strength requirement'],
  ]

  const memberTable = [
    ['Slab Concrete', 'Length × Width × Thickness'],
    ['Beam Concrete', 'Length × Width × Depth'],
    ['Column Concrete', 'Length × Width × Height'],
    ['Footing Concrete', 'Length × Width × Depth'],
    ['PCC Concrete', 'Length × Width × Thickness'],
    ['Floor Concrete', 'Length × Width × Thickness'],
  ]

  const inputs = [
    'Concrete member type',
    'Length',
    'Width',
    'Depth or thickness',
    'Number of members',
    'Concrete grade',
    'Mix ratio',
    'Wastage percentage',
    'Unit system',
  ]

  const useCases = [
    'RCC slab concrete quantity',
    'RCC beam concrete quantity',
    'RCC column concrete quantity',
    'RCC footing concrete quantity',
    'PCC concrete calculation',
    'Floor concrete quantity',
    'Cement sand aggregate calculation',
    'BOQ preparation',
    'Material purchase planning',
    'Civil engineering student practice',
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
          Concrete Calculator Online – Calculate Concrete Volume, Cement, Sand and Aggregate
        </h1>

        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
          Use CivilCalc Pro Concrete Calculator to calculate concrete volume,
          concrete mix ratio, cement bags, sand quantity and aggregate quantity for
          RCC slab, beam, column, footing, PCC and construction work.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/dashboard/calculators/concrete-volume"
            className="rounded-xl bg-orange-500 px-6 py-3 font-bold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600"
          >
            Open Concrete Volume Calculator
          </Link>

          <Link
            href="/dashboard/calculators/concrete-mix"
            className="rounded-xl border border-orange-500 px-6 py-3 font-bold text-orange-300 transition hover:bg-orange-500 hover:text-white"
          >
            Open Concrete Mix Calculator
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
              What is a Concrete Calculator?
            </h2>

            <p className="leading-8">
              A Concrete Calculator is an online civil engineering tool used to
              calculate concrete quantity and concrete material requirement for
              construction work. It helps calculate concrete volume, cement bags,
              sand quantity, aggregate quantity and concrete mix ratio.
            </p>

            <p className="mt-4 leading-8">
              CivilCalc Pro Concrete Calculator is useful for civil engineers,
              contractors, site engineers, builders, estimators and students who need
              quick concrete quantity calculation for RCC and PCC work.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Why Concrete Calculation is Important
            </h2>

            <p className="leading-8">
              Concrete is one of the most important materials in construction.
              Accurate concrete calculation is required before ordering ready-mix
              concrete or preparing site-mixed concrete. It helps in material
              planning, cost estimation, labour planning, BOQ preparation and
              contractor billing.
            </p>

            <p className="mt-4 leading-8">
              Wrong concrete quantity can create material shortage, excess wastage,
              increased cost and delay in construction work. That is why civil
              engineers and contractors calculate concrete volume before starting
              RCC, PCC, slab, beam, column or footing work.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Concrete Volume Formula
            </h2>

            <p className="leading-8">
              The basic formula for concrete volume is:
            </p>

            <div className="my-6 rounded-2xl border border-orange-500/30 bg-slate-900 p-5">
              <p className="text-xl font-bold text-orange-300">
                Concrete Volume = Length × Width × Depth
              </p>
            </div>

            <ul className="list-disc space-y-2 pl-6 leading-8">
              <li>Length = length of concrete member</li>
              <li>Width = width of concrete member</li>
              <li>Depth or thickness = depth, height or slab thickness</li>
              <li>Concrete volume = total quantity of concrete required</li>
            </ul>

            <p className="mt-4 leading-8">
              Concrete volume is usually measured in cubic meter or cubic feet. For
              RCC slabs, thickness is used. For beams, columns and footings, depth or
              height is used based on the member type.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Concrete Volume Formula for Different Members
            </h2>

            <p className="leading-8">
              Different RCC and PCC members use similar volume formulas, but the
              input meaning changes according to the member.
            </p>

            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-800">
              <table className="w-full border-collapse text-left">
                <thead className="bg-slate-900">
                  <tr>
                    <th className="border-b border-slate-800 px-4 py-3 text-white">
                      Concrete Member
                    </th>
                    <th className="border-b border-slate-800 px-4 py-3 text-white">
                      Formula
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {memberTable.map((row) => (
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
              What is Concrete Mix Ratio?
            </h2>

            <p className="leading-8">
              Concrete mix ratio is the proportion of cement, sand and aggregate used
              to prepare concrete. For example, in M20 nominal concrete mix ratio
              1:1.5:3, one part cement, 1.5 parts sand and 3 parts aggregate are used
              by volume.
            </p>

            <p className="mt-4 leading-8">
              Mix ratio is important because it affects concrete strength, workability
              and material quantity. Different concrete grades are used for different
              construction purposes.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Concrete Mix Ratio Table
            </h2>

            <p className="leading-8">
              Common nominal concrete mix ratios used in construction are:
            </p>

            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-800">
              <table className="w-full border-collapse text-left">
                <thead className="bg-slate-900">
                  <tr>
                    <th className="border-b border-slate-800 px-4 py-3 text-white">
                      Grade
                    </th>
                    <th className="border-b border-slate-800 px-4 py-3 text-white">
                      Mix Ratio
                    </th>
                    <th className="border-b border-slate-800 px-4 py-3 text-white">
                      Common Use
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {mixRatioTable.map((row) => (
                    <tr key={row[0]} className="bg-slate-900/40">
                      <td className="border-b border-slate-800 px-4 py-3">
                        {row[0]}
                      </td>
                      <td className="border-b border-slate-800 px-4 py-3">
                        {row[1]}
                      </td>
                      <td className="border-b border-slate-800 px-4 py-3">
                        {row[2]}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-4 leading-8">
              For important structural work, design mix should be used as per project
              specification and engineering requirements.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Dry Volume for Concrete Material Calculation
            </h2>

            <p className="leading-8">
              When calculating cement, sand and aggregate from wet concrete volume,
              dry volume is generally considered higher because dry materials have
              voids and volume changes after mixing.
            </p>

            <div className="my-6 rounded-2xl border border-orange-500/30 bg-slate-900 p-5">
              <p className="text-xl font-bold text-orange-300">
                Dry Volume = Wet Concrete Volume × 1.54
              </p>
            </div>

            <p className="leading-8">
              This dry volume is then divided according to the selected mix ratio to
              estimate cement, sand and aggregate quantity.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Cement, Sand and Aggregate Calculation Formula
            </h2>

            <p className="leading-8">
              For a mix ratio of 1:1.5:3, total ratio parts are:
            </p>

            <div className="my-6 rounded-2xl border border-slate-700 bg-slate-900 p-5 leading-8">
              <p>Total parts = 1 + 1.5 + 3</p>
              <p>Total parts = 5.5</p>
            </div>

            <p className="leading-8">
              Material quantities are calculated as:
            </p>

            <div className="my-6 rounded-2xl border border-orange-500/30 bg-slate-900 p-5 space-y-3">
              <p className="text-lg font-bold text-orange-300">
                Cement Volume = Dry Volume × Cement Part / Total Parts
              </p>
              <p className="text-lg font-bold text-orange-300">
                Sand Volume = Dry Volume × Sand Part / Total Parts
              </p>
              <p className="text-lg font-bold text-orange-300">
                Aggregate Volume = Dry Volume × Aggregate Part / Total Parts
              </p>
            </div>

            <p className="leading-8">
              Cement bags are calculated by converting cement volume into cement
              weight and then dividing by 50 kg per bag.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Example of Concrete Volume Calculation
            </h2>

            <p className="leading-8">
              Suppose an RCC slab has length 5 m, width 4 m and thickness 0.125 m.
            </p>

            <div className="my-6 rounded-2xl border border-slate-700 bg-slate-900 p-5 leading-8">
              <p>Concrete Volume = Length × Width × Thickness</p>
              <p>Concrete Volume = 5 × 4 × 0.125</p>
              <p>Concrete Volume = 2.5 m³</p>
            </div>

            <p className="leading-8">
              So, the concrete required for this slab is{' '}
              <strong className="text-white">2.5 cubic meter</strong>.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Example of M20 Concrete Material Calculation
            </h2>

            <p className="leading-8">
              Suppose wet concrete volume is 1 m³ and concrete grade is M20 with
              nominal mix ratio 1:1.5:3.
            </p>

            <div className="my-6 rounded-2xl border border-slate-700 bg-slate-900 p-5 leading-8">
              <p>Wet Volume = 1 m³</p>
              <p>Dry Volume = 1 × 1.54 = 1.54 m³</p>
              <p>Total Ratio = 1 + 1.5 + 3 = 5.5</p>
              <p>Cement Volume = 1.54 × 1 / 5.5 = 0.28 m³</p>
              <p>Sand Volume = 1.54 × 1.5 / 5.5 = 0.42 m³</p>
              <p>Aggregate Volume = 1.54 × 3 / 5.5 = 0.84 m³</p>
            </div>

            <p className="leading-8">
              So, for 1 m³ of nominal M20 concrete, approximate materials are cement,
              sand and aggregate as per 1:1.5:3 ratio. Actual site quantity may vary
              based on design mix, moisture, bulking, wastage and project
              specification.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Inputs Required for Concrete Calculator
            </h2>

            <p className="leading-8">
              To calculate concrete quantity and material requirement, the following
              inputs are commonly required:
            </p>

            <ul className="list-disc space-y-2 pl-6 leading-8">
              {inputs.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              How to Use CivilCalc Pro Concrete Calculator
            </h2>

            <p className="leading-8">
              Select the concrete member type such as slab, beam, column, footing or
              PCC. Enter length, width, depth or thickness, number of members and
              concrete grade. After entering the values, click on calculate.
            </p>

            <p className="mt-4 leading-8">
              The tool will show concrete volume, dry volume, cement bags, sand
              quantity, aggregate quantity and material requirement based on the
              selected concrete mix ratio.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Where Concrete Calculator is Used
            </h2>

            <ul className="list-disc space-y-2 pl-6 leading-8">
              {useCases.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Concrete Calculator for Civil Engineers and Contractors
            </h2>

            <p className="leading-8">
              Civil engineers and contractors need quick concrete calculation during
              site work, estimation, BOQ preparation and billing. CivilCalc Pro
              Concrete Calculator is designed for practical construction use and helps
              users calculate concrete quantity without repeated manual calculations.
            </p>

            <p className="mt-4 leading-8">
              Whether you are calculating RCC slab concrete, footing concrete, PCC
              quantity, cement bags or sand and aggregate requirement, this calculator
              helps you get quick and clear results.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Benefits of CivilCalc Pro Concrete Calculator
            </h2>

            <ul className="list-disc space-y-2 pl-6 leading-8">
              <li>Fast concrete volume calculation</li>
              <li>Calculates cement, sand and aggregate quantity</li>
              <li>Supports RCC and PCC concrete work</li>
              <li>Useful for slab, beam, column and footing</li>
              <li>Helps in BOQ preparation and billing</li>
              <li>Reduces material shortage and wastage</li>
              <li>Useful for civil engineers, contractors and students</li>
            </ul>
          </section>

          <section className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-5">
            <h2 className="mb-3 text-2xl font-bold text-white">
              Important Concrete Mix Note
            </h2>

            <p className="leading-8 text-slate-300">
              Nominal concrete mix ratios are useful for estimation and learning.
              For structural RCC work, concrete grade, mix design, durability,
              exposure condition and project specification should be checked by a
              qualified engineer.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">Conclusion</h2>

            <p className="leading-8">
              Concrete quantity calculation is one of the most important parts of
              civil engineering estimation. CivilCalc Pro Concrete Calculator helps
              civil engineers, contractors, site engineers and students calculate
              concrete volume, cement bags, sand and aggregate quickly.
            </p>

            <p className="mt-4 leading-8">
              For accurate construction estimation, material planning, BOQ preparation
              and site work, use CivilCalc Pro Concrete Calculator before starting RCC
              or PCC work.
            </p>
          </section>

          <div className="rounded-3xl border border-orange-500/30 bg-gradient-to-br from-orange-500/15 to-slate-900 p-6">
            <h2 className="text-2xl font-extrabold text-white">
              Calculate Concrete Quantity Instantly
            </h2>

            <p className="mt-3 leading-8 text-slate-300">
              Open CivilCalc Pro Concrete Calculator and calculate concrete volume,
              cement, sand and aggregate for your construction project.
            </p>

            <div className="mt-5 flex flex-wrap gap-4">
              <Link
                href="/dashboard/calculators/concrete-volume"
                className="inline-flex rounded-xl bg-orange-500 px-6 py-3 font-bold text-white transition hover:bg-orange-600"
              >
                Use Concrete Volume Calculator
              </Link>

              <Link
                href="/dashboard/calculators/concrete-mix"
                className="inline-flex rounded-xl border border-orange-500 px-6 py-3 font-bold text-orange-300 transition hover:bg-orange-500 hover:text-white"
              >
                Use Concrete Mix Calculator
              </Link>
            </div>
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
