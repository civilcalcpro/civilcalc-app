import Link from 'next/link'

export const metadata = {
  title: 'Steel Weight Calculator Online | TMT Bar Weight Calculator',
  description:
    'Calculate steel bar weight, TMT bar weight, rebar weight and reinforcement quantity online using CivilCalc Pro Steel Weight Calculator.',
  keywords: [
    'steel weight calculator',
    'TMT bar weight calculator',
    'rebar weight calculator',
    'steel bar weight calculator',
    'D2 by 162 formula',
    'steel quantity calculator',
    'civil engineering calculator',
    'construction calculator India',
  ],
  alternates: {
    canonical: 'https://www.civilcalcpro.in/steel-weight-calculator',
  },
  openGraph: {
    title: 'Steel Weight Calculator Online | CivilCalc Pro',
    description:
      'Calculate TMT bar weight, steel quantity and reinforcement weight online using standard D²/162 formula.',
    url: 'https://www.civilcalcpro.in/steel-weight-calculator',
    siteName: 'CivilCalc Pro',
    type: 'article',
  },
}

const faqs = [
  {
    q: 'What is a steel weight calculator?',
    a: 'A steel weight calculator is a civil engineering tool used to calculate the weight of steel bars or TMT bars used in RCC construction.',
  },
  {
    q: 'What is the formula for steel weight?',
    a: 'The common formula for steel weight is D²/162 × Length, where D is bar diameter in mm and length is in meter.',
  },
  {
    q: 'What is the weight of 12 mm steel bar per meter?',
    a: 'The approximate weight of 12 mm steel bar is 0.888 kg per meter.',
  },
  {
    q: 'Why is steel weight calculation important?',
    a: 'Steel weight calculation is important for material estimation, cost calculation, BOQ preparation, billing and reducing steel wastage on site.',
  },
]

export default function SteelWeightCalculatorArticle() {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Steel Weight Calculator Online | TMT Bar Weight Calculator',
    description:
      'Complete guide to calculate steel bar weight, TMT bar weight and reinforcement quantity for construction projects.',
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
      '@id': 'https://www.civilcalcpro.in/steel-weight-calculator',
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

  const steelTable = [
    ['8 mm', '0.395 kg/m'],
    ['10 mm', '0.617 kg/m'],
    ['12 mm', '0.888 kg/m'],
    ['16 mm', '1.58 kg/m'],
    ['20 mm', '2.47 kg/m'],
    ['25 mm', '3.86 kg/m'],
    ['32 mm', '6.32 kg/m'],
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
          Steel Weight Calculator Online – Calculate TMT Bar Weight for Construction
        </h1>

        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
          Use CivilCalc Pro Steel Weight Calculator to calculate steel bar weight,
          TMT bar weight, rebar weight and reinforcement quantity for RCC beams,
          columns, slabs, footings and other construction work.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/dashboard/calculators/steel-weight"
            className="rounded-xl bg-orange-500 px-6 py-3 font-bold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600"
          >
            Open Steel Weight Calculator
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
              What is a Steel Weight Calculator?
            </h2>
            <p className="leading-8">
              A Steel Weight Calculator is an online civil engineering tool used to
              calculate the weight of steel bars used in construction. Steel is one
              of the most important materials in RCC work, and accurate steel
              quantity calculation is required for estimation, billing and material
              planning.
            </p>
            <p className="mt-4 leading-8">
              CivilCalc Pro Steel Weight Calculator helps civil engineers,
              contractors, site engineers, estimators and students calculate TMT bar
              weight quickly by entering bar diameter, bar length and number of bars.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Why Steel Weight Calculation is Important
            </h2>
            <p className="leading-8">
              Steel cost is a major part of construction cost. In RCC beams,
              columns, slabs, footings, staircases and other structural members,
              reinforcement quantity must be calculated correctly before execution.
            </p>
            <p className="mt-4 leading-8">
              Wrong steel calculation can increase project cost, create material
              shortage, cause wastage on site and affect billing accuracy. That is
              why every civil engineer and contractor should calculate steel weight
              before ordering or placing reinforcement.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Steel Weight Formula
            </h2>
            <p className="leading-8">
              The standard formula commonly used for steel bar weight calculation is:
            </p>

            <div className="my-6 rounded-2xl border border-orange-500/30 bg-slate-900 p-5">
              <p className="text-xl font-bold text-orange-300">
                Steel Weight = D² / 162 × Length
              </p>
            </div>

            <ul className="list-disc space-y-2 pl-6 leading-8">
              <li>D = Diameter of steel bar in mm</li>
              <li>Length = Length of steel bar in meter</li>
              <li>Steel weight = Weight in kg</li>
            </ul>

            <p className="mt-4 leading-8">
              This formula gives the approximate weight of steel bars in kilograms.
              It is widely used for TMT bar weight and rebar quantity calculation in
              construction estimation.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Common Steel Bar Weight Per Meter
            </h2>

            <div className="overflow-hidden rounded-2xl border border-slate-800">
              <table className="w-full border-collapse text-left">
                <thead className="bg-slate-900">
                  <tr>
                    <th className="border-b border-slate-800 px-4 py-3 text-white">
                      Bar Diameter
                    </th>
                    <th className="border-b border-slate-800 px-4 py-3 text-white">
                      Approx. Weight
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {steelTable.map((row) => (
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
              Example of Steel Weight Calculation
            </h2>
            <p className="leading-8">
              Suppose bar diameter is 12 mm, bar length is 10 m and number of bars
              is 5.
            </p>

            <div className="my-6 rounded-2xl border border-slate-700 bg-slate-900 p-5 leading-8">
              <p>Weight of one bar = 12² / 162 × 10</p>
              <p>Weight of one bar = 144 / 162 × 10</p>
              <p>Weight of one bar = 8.88 kg</p>
              <p>Total weight = 8.88 × 5</p>
              <p>Total weight = 44.4 kg</p>
            </div>

            <p className="leading-8">
              So, the total steel weight is{' '}
              <strong className="text-white">44.4 kg</strong>.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              How to Use CivilCalc Pro Steel Weight Calculator
            </h2>
            <p className="leading-8">
              Enter the steel bar diameter, length of bar and number of bars. After
              entering the values, click on calculate. The tool will instantly show
              total steel weight in kilograms.
            </p>
            <p className="mt-4 leading-8">
              This makes reinforcement estimation faster and easier for civil
              engineers, contractors and site engineers.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Where Steel Weight Calculator is Used
            </h2>
            <ul className="list-disc space-y-2 pl-6 leading-8">
              <li>RCC beam steel calculation</li>
              <li>RCC column steel calculation</li>
              <li>Slab reinforcement quantity</li>
              <li>Footing steel calculation</li>
              <li>Staircase reinforcement</li>
              <li>Bar bending schedule checking</li>
              <li>Steel purchase planning</li>
              <li>Contractor billing</li>
              <li>BOQ preparation</li>
              <li>Civil engineering student learning</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Steel Weight Calculator for Civil Engineers
            </h2>
            <p className="leading-8">
              Civil engineers need accurate and fast reinforcement calculation for
              daily site work. CivilCalc Pro Steel Weight Calculator is designed for
              practical construction use. It helps users calculate steel weight
              without manual formula work or spreadsheet dependency.
            </p>
            <p className="mt-4 leading-8">
              Whether you are preparing BOQ, checking BBS, ordering steel, verifying
              contractor bills or calculating RCC quantity, this tool can help you
              calculate steel weight quickly.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Benefits of CivilCalc Pro Steel Weight Calculator
            </h2>
            <ul className="list-disc space-y-2 pl-6 leading-8">
              <li>Fast steel weight calculation</li>
              <li>Simple input and clear output</li>
              <li>Uses standard D²/162 formula</li>
              <li>Useful for TMT bars and reinforcement work</li>
              <li>Helps in BOQ and billing</li>
              <li>Reduces manual calculation mistakes</li>
              <li>Useful for civil engineers, contractors and students</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">Conclusion</h2>
            <p className="leading-8">
              Steel weight calculation is one of the most important calculations in
              RCC construction. CivilCalc Pro Steel Weight Calculator helps civil
              engineers, contractors, site engineers and students calculate TMT bar
              weight quickly and accurately.
            </p>
            <p className="mt-4 leading-8">
              For better reinforcement estimation, steel ordering, BOQ preparation
              and contractor billing, use CivilCalc Pro Steel Weight Calculator.
            </p>
          </section>

          <div className="rounded-3xl border border-orange-500/30 bg-gradient-to-br from-orange-500/15 to-slate-900 p-6">
            <h2 className="text-2xl font-extrabold text-white">
              Calculate Steel Weight Instantly
            </h2>
            <p className="mt-3 leading-8 text-slate-300">
              Open CivilCalc Pro Steel Weight Calculator and calculate TMT bar
              weight for your construction project.
            </p>
            <Link
              href="/dashboard/calculators/steel-weight"
              className="mt-5 inline-flex rounded-xl bg-orange-500 px-6 py-3 font-bold text-white transition hover:bg-orange-600"
            >
              Use Steel Weight Calculator
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
