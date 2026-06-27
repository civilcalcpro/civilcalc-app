import Link from 'next/link'

export const metadata = {
  title: 'Brickwork Calculator Online | Brick Quantity and Mortar Calculator',
  description:
    'Calculate brickwork quantity, number of bricks, mortar volume, cement and sand requirement online with CivilCalc Pro Brickwork Calculator.',
  keywords: [
    'brickwork calculator',
    'brick quantity calculator',
    'brick calculator',
    'masonry calculator',
    'cement sand calculator for brickwork',
    'brick wall calculator',
    'civil engineering calculator',
    'construction calculator India',
    'brickwork quantity calculator',
  ],
  alternates: {
    canonical: 'https://www.civilcalcpro.in/brickwork-calculator',
  },
  openGraph: {
    title: 'Brickwork Calculator Online | CivilCalc Pro',
    description:
      'Calculate number of bricks, brickwork volume, mortar quantity, cement and sand for brick masonry work.',
    url: 'https://www.civilcalcpro.in/brickwork-calculator',
    siteName: 'CivilCalc Pro',
    type: 'article',
  },
}

const faqs = [
  {
    q: 'What is a brickwork calculator?',
    a: 'A brickwork calculator is a civil engineering tool used to calculate number of bricks, brickwork volume, mortar quantity, cement and sand required for brick masonry work.',
  },
  {
    q: 'How many bricks are required in 1 cubic meter of brickwork?',
    a: 'For standard modular bricks with mortar, approximately 500 bricks are required for 1 cubic meter of brickwork. Actual quantity may vary based on brick size and mortar thickness.',
  },
  {
    q: 'What is the formula for brickwork volume?',
    a: 'Brickwork volume is calculated as Length × Height × Thickness of the wall.',
  },
  {
    q: 'Which mortar ratio is commonly used for brickwork?',
    a: 'Common mortar ratios for brickwork are 1:4, 1:5 and 1:6 depending on project specification and structural requirement.',
  },
]

export default function BrickworkCalculatorArticle() {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Brickwork Calculator Online | Brick Quantity and Mortar Calculator',
    description:
      'Complete guide to calculate brick quantity, brickwork volume, mortar, cement and sand requirement for brick masonry construction.',
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
      '@id': 'https://www.civilcalcpro.in/brickwork-calculator',
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
    'Wall thickness',
    'Brick size',
    'Mortar thickness',
    'Mortar ratio',
    'Wastage percentage',
    'Unit system',
  ]

  const useCases = [
    'Brick wall quantity calculation',
    'Residential building brickwork',
    'Partition wall estimation',
    'External wall estimation',
    'Masonry work billing',
    'BOQ preparation',
    'Cement and sand estimation',
    'Site material planning',
    'Contractor quantity checking',
    'Civil engineering student practice',
  ]

  const ratios = [
    ['1:4', 'Strong brickwork mortar for higher strength requirement'],
    ['1:5', 'Common mortar ratio for general brick masonry work'],
    ['1:6', 'Economical mortar ratio for normal brickwork as per specification'],
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
          Brickwork Calculator Online – Calculate Bricks, Mortar, Cement and Sand
        </h1>

        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
          Use CivilCalc Pro Brickwork Calculator to calculate number of bricks,
          brickwork volume, mortar quantity, cement bags and sand required for
          brick masonry construction work.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/dashboard/calculators/brickwork"
            className="rounded-xl bg-orange-500 px-6 py-3 font-bold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600"
          >
            Open Brickwork Calculator
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
              What is a Brickwork Calculator?
            </h2>

            <p className="leading-8">
              A Brickwork Calculator is an online civil engineering tool used to
              calculate the quantity of bricks, mortar, cement and sand required for
              brick masonry work. Brickwork is one of the most common activities in
              residential, commercial and industrial construction.
            </p>

            <p className="mt-4 leading-8">
              CivilCalc Pro Brickwork Calculator helps civil engineers, contractors,
              builders, site engineers and students calculate brick quantity quickly
              by entering wall length, height, thickness, brick size and mortar ratio.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Why Brickwork Quantity Calculation is Important
            </h2>

            <p className="leading-8">
              Brickwork quantity calculation is required before starting masonry work
              because it helps estimate the number of bricks, mortar volume, cement
              bags, sand quantity, labour cost and total construction cost.
            </p>

            <p className="mt-4 leading-8">
              If brick quantity is not calculated correctly, the project may face
              material shortage, extra wastage, wrong billing or delay in construction
              work. Accurate brickwork calculation helps in better site planning,
              BOQ preparation and contractor billing.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Brickwork Volume Formula
            </h2>

            <p className="leading-8">
              The basic formula for brickwork volume is:
            </p>

            <div className="my-6 rounded-2xl border border-orange-500/30 bg-slate-900 p-5">
              <p className="text-xl font-bold text-orange-300">
                Brickwork Volume = Length × Height × Thickness
              </p>
            </div>

            <ul className="list-disc space-y-2 pl-6 leading-8">
              <li>Length = length of brick wall</li>
              <li>Height = height of brick wall</li>
              <li>Thickness = wall thickness</li>
              <li>Brickwork volume = total masonry volume</li>
            </ul>

            <p className="mt-4 leading-8">
              The final brickwork volume is generally measured in cubic meter or
              cubic feet depending on the unit system used on site.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Number of Bricks Formula
            </h2>

            <p className="leading-8">
              After calculating brickwork volume, the number of bricks can be
              calculated using the volume of one brick with mortar.
            </p>

            <div className="my-6 rounded-2xl border border-orange-500/30 bg-slate-900 p-5">
              <p className="text-xl font-bold text-orange-300">
                Number of Bricks = Brickwork Volume / Volume of One Brick with Mortar
              </p>
            </div>

            <p className="leading-8">
              For standard modular bricks with 10 mm mortar thickness, approximately
              500 bricks are required for 1 cubic meter of brickwork. Wastage is
              usually added separately depending on site condition.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Mortar Calculation for Brickwork
            </h2>

            <p className="leading-8">
              Mortar is required to bind bricks together. Mortar quantity depends on
              brick size, wall thickness, joint thickness and mortar ratio.
            </p>

            <p className="mt-4 leading-8">
              Common mortar ratios used in brickwork are 1:4, 1:5 and 1:6. In a 1:6
              ratio, 1 part cement and 6 parts sand are used by volume.
            </p>

            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-800">
              <table className="w-full border-collapse text-left">
                <thead className="bg-slate-900">
                  <tr>
                    <th className="border-b border-slate-800 px-4 py-3 text-white">
                      Mortar Ratio
                    </th>
                    <th className="border-b border-slate-800 px-4 py-3 text-white">
                      Common Use
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {ratios.map((row) => (
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
              Inputs Required for Brickwork Calculator
            </h2>

            <p className="leading-8">
              To calculate brickwork quantity accurately, the following inputs are
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
              Example of Brickwork Calculation
            </h2>

            <p className="leading-8">
              Suppose a wall has length 10 m, height 3 m and thickness 0.23 m.
            </p>

            <div className="my-6 rounded-2xl border border-slate-700 bg-slate-900 p-5 leading-8">
              <p>Brickwork Volume = Length × Height × Thickness</p>
              <p>Brickwork Volume = 10 × 3 × 0.23</p>
              <p>Brickwork Volume = 6.9 m³</p>
              <p>Approximate bricks = 6.9 × 500</p>
              <p>Approximate bricks = 3450 bricks</p>
            </div>

            <p className="leading-8">
              So, approximately{' '}
              <strong className="text-white">3450 bricks</strong> are required before
              adding wastage. If 5% wastage is considered, the final quantity will be
              higher.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              How to Use CivilCalc Pro Brickwork Calculator
            </h2>

            <p className="leading-8">
              Enter wall length, height, thickness, brick size, mortar ratio and
              wastage percentage. After entering the values, click on calculate. The
              tool will show brickwork volume, number of bricks, mortar quantity,
              cement requirement and sand requirement.
            </p>

            <p className="mt-4 leading-8">
              This makes masonry estimation faster and easier for civil engineers,
              site engineers, contractors and construction professionals.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Where Brickwork Calculator is Used
            </h2>

            <ul className="list-disc space-y-2 pl-6 leading-8">
              {useCases.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Brickwork Calculator for Civil Engineers and Contractors
            </h2>

            <p className="leading-8">
              Civil engineers and contractors need quick quantity calculation for
              daily site work. CivilCalc Pro Brickwork Calculator is designed for
              practical construction use. It helps users calculate brick quantity,
              cement, sand and mortar without using repeated manual formulas.
            </p>

            <p className="mt-4 leading-8">
              Whether you are preparing BOQ, checking contractor bills, planning
              material purchase or estimating brick masonry cost, this calculator
              helps you get quick and clear results.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Benefits of CivilCalc Pro Brickwork Calculator
            </h2>

            <ul className="list-disc space-y-2 pl-6 leading-8">
              <li>Fast brick quantity calculation</li>
              <li>Calculates brickwork volume</li>
              <li>Helps estimate cement and sand for mortar</li>
              <li>Useful for masonry work billing</li>
              <li>Supports BOQ preparation</li>
              <li>Reduces manual calculation mistakes</li>
              <li>Useful for civil engineers, contractors and students</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">Conclusion</h2>

            <p className="leading-8">
              Brickwork quantity calculation is an important part of construction
              estimation. CivilCalc Pro Brickwork Calculator helps civil engineers,
              contractors, site engineers and students calculate bricks, mortar,
              cement and sand quickly and accurately.
            </p>

            <p className="mt-4 leading-8">
              For better material planning, BOQ preparation and masonry billing, use
              CivilCalc Pro Brickwork Calculator before starting brickwork on site.
            </p>
          </section>

          <div className="rounded-3xl border border-orange-500/30 bg-gradient-to-br from-orange-500/15 to-slate-900 p-6">
            <h2 className="text-2xl font-extrabold text-white">
              Calculate Brickwork Quantity Instantly
            </h2>

            <p className="mt-3 leading-8 text-slate-300">
              Open CivilCalc Pro Brickwork Calculator and calculate bricks, mortar,
              cement and sand required for your construction project.
            </p>

            <Link
              href="/dashboard/calculators/brickwork"
              className="mt-5 inline-flex rounded-xl bg-orange-500 px-6 py-3 font-bold text-white transition hover:bg-orange-600"
            >
              Use Brickwork Calculator
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
