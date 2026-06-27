import Link from 'next/link'

export const metadata = {
  title: 'Rate Analysis Calculator Online | Construction Rate Analysis',
  description:
    'Calculate construction rate analysis, material cost, labour cost, machinery cost, overhead, profit and unit rate online with CivilCalc Pro Rate Analysis Calculator.',
  keywords: [
    'rate analysis calculator',
    'construction rate analysis',
    'civil rate analysis calculator',
    'rate analysis of RCC',
    'rate analysis of brickwork',
    'rate analysis of plaster',
    'material labour cost calculator',
    'civil engineering calculator',
    'construction calculator India',
  ],
  alternates: {
    canonical: 'https://www.civilcalcpro.in/rate-analysis-calculator',
  },
  openGraph: {
    title: 'Rate Analysis Calculator Online | CivilCalc Pro',
    description:
      'Calculate material cost, labour cost, machinery cost, overhead, profit and final unit rate for construction work.',
    url: 'https://www.civilcalcpro.in/rate-analysis-calculator',
    siteName: 'CivilCalc Pro',
    type: 'article',
  },
}

const faqs = [
  {
    q: 'What is rate analysis in civil engineering?',
    a: 'Rate analysis is the process of calculating the cost of one unit of construction work by considering material cost, labour cost, machinery cost, overhead, profit and wastage.',
  },
  {
    q: 'What is the formula for rate analysis?',
    a: 'The basic formula is Unit Rate = Total Cost / Quantity. Total cost includes material, labour, machinery, overhead, profit and other charges.',
  },
  {
    q: 'Why is rate analysis important?',
    a: 'Rate analysis is important for cost estimation, tendering, BOQ preparation, contractor billing and checking whether a construction item rate is reasonable.',
  },
  {
    q: 'Can this calculator be used for RCC, brickwork and plaster?',
    a: 'Yes, this calculator can be used for RCC work, brickwork, plaster, flooring, excavation, PCC and other construction items.',
  },
]

export default function RateAnalysisCalculatorArticle() {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Rate Analysis Calculator Online | Construction Rate Analysis',
    description:
      'Complete guide to construction rate analysis, material cost, labour cost, machinery cost, overhead, profit and unit rate calculation.',
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
      '@id': 'https://www.civilcalcpro.in/rate-analysis-calculator',
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
    'Work item name',
    'Quantity of work',
    'Unit of measurement',
    'Material quantity',
    'Material rate',
    'Labour cost',
    'Machinery cost',
    'Transportation cost',
    'Wastage percentage',
    'Overhead percentage',
    'Contractor profit percentage',
  ]

  const useCases = [
    'Rate analysis of RCC work',
    'Rate analysis of brickwork',
    'Rate analysis of plaster work',
    'Rate analysis of PCC work',
    'Rate analysis of excavation',
    'Rate analysis of flooring',
    'Construction cost estimation',
    'BOQ preparation',
    'Tender rate checking',
    'Contractor billing',
  ]

  const componentTable = [
    ['Material Cost', 'Cement, sand, aggregate, steel, bricks, tiles, paint and other materials'],
    ['Labour Cost', 'Mason, helper, bar bender, carpenter, painter, tile worker and other labour'],
    ['Machinery Cost', 'Mixer, vibrator, cutting machine, scaffolding, tools and equipment'],
    ['Transportation', 'Material loading, unloading and transport charges'],
    ['Overhead', 'Site management, supervision, electricity, water and indirect expenses'],
    ['Profit', 'Contractor margin or business profit added to final rate'],
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
          Rate Analysis Calculator Online – Construction Material, Labour and Unit Rate
        </h1>

        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
          Use CivilCalc Pro Rate Analysis Calculator to calculate material cost,
          labour cost, machinery cost, overhead, profit and final unit rate for
          construction work such as RCC, brickwork, plaster, excavation, PCC and flooring.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/dashboard/calculators/rate-analysis"
            className="rounded-xl bg-orange-500 px-6 py-3 font-bold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600"
          >
            Open Rate Analysis Calculator
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
              What is Rate Analysis in Civil Engineering?
            </h2>

            <p className="leading-8">
              Rate analysis is the process of calculating the cost of one unit of
              construction work. It includes material cost, labour cost, machinery
              cost, transportation, wastage, overhead and contractor profit.
            </p>

            <p className="mt-4 leading-8">
              CivilCalc Pro Rate Analysis Calculator helps civil engineers,
              contractors, estimators, builders and students calculate construction
              item rates quickly and clearly for BOQ, tendering, estimation and billing.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Why Rate Analysis is Important
            </h2>

            <p className="leading-8">
              Rate analysis is important because every construction item has a unit
              rate. For example, RCC may be measured in cubic meter, brickwork in
              cubic meter, plaster in square meter, flooring in square meter and
              excavation in cubic meter.
            </p>

            <p className="mt-4 leading-8">
              Accurate rate analysis helps in preparing BOQ, checking contractor
              rates, preparing tender documents, estimating construction cost and
              avoiding underpricing or overpricing of civil work.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Rate Analysis Formula
            </h2>

            <p className="leading-8">
              The basic formula for rate analysis is:
            </p>

            <div className="my-6 rounded-2xl border border-orange-500/30 bg-slate-900 p-5">
              <p className="text-xl font-bold text-orange-300">
                Unit Rate = Total Cost / Quantity
              </p>
            </div>

            <p className="leading-8">
              Total cost is calculated by adding all direct and indirect expenses.
            </p>

            <div className="my-6 rounded-2xl border border-orange-500/30 bg-slate-900 p-5">
              <p className="text-xl font-bold text-orange-300">
                Total Cost = Material Cost + Labour Cost + Machinery Cost + Overhead + Profit
              </p>
            </div>

            <ul className="list-disc space-y-2 pl-6 leading-8">
              <li>Material cost = quantity of materials × material rate</li>
              <li>Labour cost = labour requirement × labour rate</li>
              <li>Machinery cost = machine usage cost</li>
              <li>Overhead = indirect project expenses</li>
              <li>Profit = contractor margin added to final rate</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Components of Construction Rate Analysis
            </h2>

            <p className="leading-8">
              A proper rate analysis should include all major cost components so that
              the final rate is practical for real site work.
            </p>

            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-800">
              <table className="w-full border-collapse text-left">
                <thead className="bg-slate-900">
                  <tr>
                    <th className="border-b border-slate-800 px-4 py-3 text-white">
                      Component
                    </th>
                    <th className="border-b border-slate-800 px-4 py-3 text-white">
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {componentTable.map((row) => (
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
              Inputs Required for Rate Analysis Calculator
            </h2>

            <p className="leading-8">
              To calculate construction rate analysis accurately, the following inputs
              are commonly required:
            </p>

            <ul className="list-disc space-y-2 pl-6 leading-8">
              {inputs.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Example of Rate Analysis Calculation
            </h2>

            <p className="leading-8">
              Suppose total material cost is ₹4,000, labour cost is ₹1,500, machinery
              cost is ₹500 and overhead plus profit is ₹1,000 for 1 cubic meter of work.
            </p>

            <div className="my-6 rounded-2xl border border-slate-700 bg-slate-900 p-5 leading-8">
              <p>Total Cost = Material + Labour + Machinery + Overhead/Profit</p>
              <p>Total Cost = 4000 + 1500 + 500 + 1000</p>
              <p>Total Cost = ₹7,000</p>
              <p>Quantity = 1 m³</p>
              <p>Unit Rate = 7000 / 1</p>
              <p>Unit Rate = ₹7,000 per m³</p>
            </div>

            <p className="leading-8">
              So, the final rate for this work item is{' '}
              <strong className="text-white">₹7,000 per m³</strong>.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Rate Analysis of RCC Work
            </h2>

            <p className="leading-8">
              RCC rate analysis usually includes cement, sand, aggregate, steel,
              shuttering, labour, machinery, curing, wastage, overhead and contractor
              profit. RCC is usually measured in cubic meter, while steel and
              shuttering may be calculated separately depending on BOQ format.
            </p>

            <p className="mt-4 leading-8">
              CivilCalc Pro helps users understand the cost structure of RCC work and
              calculate item rate in a practical way.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Rate Analysis of Brickwork
            </h2>

            <p className="leading-8">
              Brickwork rate analysis includes brick cost, cement, sand, water,
              labour, scaffolding, wastage, overhead and profit. Brickwork is commonly
              measured in cubic meter or square meter depending on project
              specification.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Rate Analysis of Plaster Work
            </h2>

            <p className="leading-8">
              Plaster rate analysis includes cement, sand, labour, scaffolding,
              curing, surface preparation, wastage, overhead and profit. Plaster work
              is usually measured in square meter.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              How to Use CivilCalc Pro Rate Analysis Calculator
            </h2>

            <p className="leading-8">
              Enter the work item name, quantity, unit, material cost, labour cost,
              machinery cost, overhead percentage and profit percentage. After entering
              the values, click on calculate. The tool will show total cost and final
              unit rate.
            </p>

            <p className="mt-4 leading-8">
              This makes construction rate analysis faster and easier for civil
              engineers, contractors, estimators and site engineers.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Where Rate Analysis Calculator is Used
            </h2>

            <ul className="list-disc space-y-2 pl-6 leading-8">
              {useCases.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Rate Analysis Calculator for Civil Engineers and Contractors
            </h2>

            <p className="leading-8">
              Civil engineers and contractors need quick and practical rate analysis
              for daily estimation work. CivilCalc Pro Rate Analysis Calculator is
              designed for construction professionals who want to calculate item rates
              without complex spreadsheets.
            </p>

            <p className="mt-4 leading-8">
              Whether you are preparing BOQ, checking tender rates, verifying
              contractor bills or estimating project cost, this calculator helps you
              calculate construction unit rates quickly.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Benefits of CivilCalc Pro Rate Analysis Calculator
            </h2>

            <ul className="list-disc space-y-2 pl-6 leading-8">
              <li>Fast construction rate calculation</li>
              <li>Includes material, labour and machinery cost</li>
              <li>Supports overhead and contractor profit</li>
              <li>Useful for BOQ and tender preparation</li>
              <li>Helps check contractor billing</li>
              <li>Reduces manual spreadsheet work</li>
              <li>Useful for civil engineers, contractors and estimators</li>
            </ul>
          </section>

          <section className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-5">
            <h2 className="mb-3 text-2xl font-bold text-white">
              Important Rate Note
            </h2>

            <p className="leading-8 text-slate-300">
              Construction rates vary by city, material quality, labour availability,
              project size and site condition. This calculator helps with practical
              estimation, but final rates should be checked with local market rates
              and project specifications.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">Conclusion</h2>

            <p className="leading-8">
              Rate analysis is an important part of civil engineering estimation.
              CivilCalc Pro Rate Analysis Calculator helps civil engineers,
              contractors, estimators and students calculate material cost, labour
              cost, overhead, profit and final unit rate quickly.
            </p>

            <p className="mt-4 leading-8">
              For better BOQ preparation, tender checking, contractor billing and
              construction cost estimation, use CivilCalc Pro Rate Analysis Calculator.
            </p>
          </section>

          <div className="rounded-3xl border border-orange-500/30 bg-gradient-to-br from-orange-500/15 to-slate-900 p-6">
            <h2 className="text-2xl font-extrabold text-white">
              Calculate Construction Rate Analysis Instantly
            </h2>

            <p className="mt-3 leading-8 text-slate-300">
              Open CivilCalc Pro Rate Analysis Calculator and calculate material,
              labour, machinery, overhead, profit and final unit rate for your project.
            </p>

            <Link
              href="/dashboard/calculators/rate-analysis"
              className="mt-5 inline-flex rounded-xl bg-orange-500 px-6 py-3 font-bold text-white transition hover:bg-orange-600"
            >
              Use Rate Analysis Calculator
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
