import Link from 'next/link'

export const metadata = {
  title: 'Paint Calculator Online | Wall Paint Quantity Calculator',
  description:
    'Calculate wall paint quantity, paint area, primer quantity, number of paint liters and painting cost online with CivilCalc Pro Paint Calculator.',
  keywords: [
    'paint calculator',
    'wall paint calculator',
    'paint quantity calculator',
    'painting cost calculator',
    'wall painting calculator',
    'primer calculator',
    'paint litres calculator',
    'civil engineering calculator',
    'construction calculator India',
  ],
  alternates: {
    canonical: 'https://www.civilcalcpro.in/paint-calculator',
  },
  openGraph: {
    title: 'Paint Calculator Online | CivilCalc Pro',
    description:
      'Calculate wall paint quantity, paint area, primer quantity, paint litres and painting cost for construction projects.',
    url: 'https://www.civilcalcpro.in/paint-calculator',
    siteName: 'CivilCalc Pro',
    type: 'article',
  },
}

const faqs = [
  {
    q: 'What is a paint calculator?',
    a: 'A paint calculator is a construction tool used to calculate paint quantity, wall painting area, primer quantity and approximate paint cost for interior and exterior painting work.',
  },
  {
    q: 'What is the formula for paint area?',
    a: 'The basic formula for paint area is Length × Height for each wall. Total paint area is calculated by adding all wall areas and deducting doors and windows if required.',
  },
  {
    q: 'How much area does 1 litre of paint cover?',
    a: 'Paint coverage depends on paint type, surface condition and number of coats. Common practical coverage is around 100 to 120 sq ft per litre per coat for many interior paints.',
  },
  {
    q: 'How many coats of paint are required?',
    a: 'Usually one coat of primer and two coats of paint are used for good finishing, but the actual requirement depends on wall surface and paint quality.',
  },
]

export default function PaintCalculatorArticle() {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Paint Calculator Online | Wall Paint Quantity Calculator',
    description:
      'Complete guide to calculate paint quantity, wall paint area, primer quantity and painting cost for construction projects.',
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
      '@id': 'https://www.civilcalcpro.in/paint-calculator',
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
    'Door and window deduction',
    'Paint coverage per litre',
    'Number of coats',
    'Primer requirement',
    'Paint rate per litre',
    'Wastage percentage',
    'Unit system',
  ]

  const useCases = [
    'Interior wall painting calculation',
    'Exterior wall painting calculation',
    'Room paint quantity estimation',
    'Primer quantity calculation',
    'Painting cost estimation',
    'Material purchase planning',
    'Contractor billing',
    'BOQ preparation',
    'Site finishing work estimation',
    'Civil engineering student practice',
  ]

  const coverageTable = [
    ['Interior wall paint', '100 to 120 sq ft/litre/coat'],
    ['Exterior wall paint', '80 to 100 sq ft/litre/coat'],
    ['Primer', '90 to 110 sq ft/litre/coat'],
    ['Texture paint', 'Lower coverage depending on texture design'],
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
          Paint Calculator Online – Calculate Wall Paint Quantity and Painting Cost
        </h1>

        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
          Use CivilCalc Pro Paint Calculator to calculate wall painting area,
          paint quantity, primer quantity, number of paint litres, wastage and
          approximate painting cost for construction and finishing work.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/dashboard/calculators/paint"
            className="rounded-xl bg-orange-500 px-6 py-3 font-bold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600"
          >
            Open Paint Calculator
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
              What is a Paint Calculator?
            </h2>

            <p className="leading-8">
              A Paint Calculator is an online construction calculator used to
              calculate the amount of paint required for wall painting, ceiling
              painting, interior painting and exterior painting work. It helps users
              estimate paint quantity before purchasing paint for a project.
            </p>

            <p className="mt-4 leading-8">
              CivilCalc Pro Paint Calculator helps civil engineers, contractors,
              builders, painters, site engineers and homeowners calculate paint
              quantity quickly by entering wall dimensions, paint coverage, number of
              coats and paint rate.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Why Paint Quantity Calculation is Important
            </h2>

            <p className="leading-8">
              Paint quantity calculation is important because painting is one of the
              final finishing activities in construction. If paint quantity is
              calculated incorrectly, the project may face paint shortage, extra
              material wastage, wrong purchase quantity or increased finishing cost.
            </p>

            <p className="mt-4 leading-8">
              Accurate paint calculation helps in material purchase, painting cost
              estimation, BOQ preparation, contractor billing and reducing paint
              wastage on site. It also helps users decide how many litres of paint
              and primer are required for a room, house or building.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Paint Area Formula
            </h2>

            <p className="leading-8">
              The first step in paint calculation is calculating the wall painting
              area.
            </p>

            <div className="my-6 rounded-2xl border border-orange-500/30 bg-slate-900 p-5">
              <p className="text-xl font-bold text-orange-300">
                Paint Area = Wall Length × Wall Height
              </p>
            </div>

            <ul className="list-disc space-y-2 pl-6 leading-8">
              <li>Wall Length = length of the wall</li>
              <li>Wall Height = height of the wall</li>
              <li>Paint Area = total area to be painted</li>
            </ul>

            <p className="mt-4 leading-8">
              For multiple walls, calculate each wall area and add them together.
              Doors, windows and openings can be deducted from total painting area.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Paint Quantity Formula
            </h2>

            <p className="leading-8">
              After calculating total paint area, paint quantity is calculated using
              paint coverage.
            </p>

            <div className="my-6 rounded-2xl border border-orange-500/30 bg-slate-900 p-5">
              <p className="text-xl font-bold text-orange-300">
                Paint Quantity = Total Paint Area / Paint Coverage
              </p>
            </div>

            <p className="leading-8">
              If more than one coat is required, multiply the paint quantity by the
              number of coats.
            </p>

            <div className="my-6 rounded-2xl border border-orange-500/30 bg-slate-900 p-5">
              <p className="text-xl font-bold text-orange-300">
                Final Paint Quantity = Paint Quantity × Number of Coats
              </p>
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Paint Coverage Table
            </h2>

            <p className="leading-8">
              Paint coverage depends on paint quality, surface condition, wall
              smoothness, primer use and number of coats. Common practical coverage
              values are:
            </p>

            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-800">
              <table className="w-full border-collapse text-left">
                <thead className="bg-slate-900">
                  <tr>
                    <th className="border-b border-slate-800 px-4 py-3 text-white">
                      Paint Type
                    </th>
                    <th className="border-b border-slate-800 px-4 py-3 text-white">
                      Approx. Coverage
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {coverageTable.map((row) => (
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

            <p className="mt-4 leading-8">
              Actual coverage may vary depending on brand, surface absorption,
              application method and site condition.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Primer Quantity Calculation
            </h2>

            <p className="leading-8">
              Primer is applied before paint to improve paint adhesion, reduce wall
              absorption and improve finishing quality. Primer quantity is calculated
              in the same way as paint quantity.
            </p>

            <div className="my-6 rounded-2xl border border-orange-500/30 bg-slate-900 p-5">
              <p className="text-xl font-bold text-orange-300">
                Primer Quantity = Total Area / Primer Coverage
              </p>
            </div>

            <p className="leading-8">
              Usually one coat of primer is applied before two coats of paint, but
              actual requirement depends on surface condition and project
              specification.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Inputs Required for Paint Calculator
            </h2>

            <p className="leading-8">
              To calculate paint quantity accurately, the following inputs are
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
              Example of Paint Quantity Calculation
            </h2>

            <p className="leading-8">
              Suppose a wall has length 12 ft and height 10 ft. Paint coverage is
              100 sq ft per litre per coat and 2 coats are required.
            </p>

            <div className="my-6 rounded-2xl border border-slate-700 bg-slate-900 p-5 leading-8">
              <p>Paint Area = 12 × 10</p>
              <p>Paint Area = 120 sq ft</p>
              <p>Paint Quantity for 1 coat = 120 / 100</p>
              <p>Paint Quantity for 1 coat = 1.2 litres</p>
              <p>For 2 coats = 1.2 × 2</p>
              <p>Total Paint Quantity = 2.4 litres</p>
            </div>

            <p className="leading-8">
              So, approximately{' '}
              <strong className="text-white">2.4 litres</strong> of paint are
              required for this wall before adding wastage.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              How to Use CivilCalc Pro Paint Calculator
            </h2>

            <p className="leading-8">
              Enter wall length, wall height, number of walls, paint coverage, number
              of coats, paint rate and wastage percentage. After entering the values,
              click on calculate. The tool will show total painting area, paint
              quantity, primer quantity and approximate painting cost.
            </p>

            <p className="mt-4 leading-8">
              This makes painting estimation faster and easier for civil engineers,
              contractors, painters, builders and homeowners.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Where Paint Calculator is Used
            </h2>

            <ul className="list-disc space-y-2 pl-6 leading-8">
              {useCases.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Paint Calculator for Civil Engineers and Contractors
            </h2>

            <p className="leading-8">
              Civil engineers and contractors need quick quantity calculation for
              finishing work. CivilCalc Pro Paint Calculator is designed for practical
              construction use. It helps users calculate paint quantity, primer
              quantity, total painting area and cost without repeated manual
              calculations.
            </p>

            <p className="mt-4 leading-8">
              Whether you are preparing BOQ, checking contractor bills, planning paint
              purchase or estimating finishing cost, this calculator helps you get
              quick and clear results.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Benefits of CivilCalc Pro Paint Calculator
            </h2>

            <ul className="list-disc space-y-2 pl-6 leading-8">
              <li>Fast wall paint quantity calculation</li>
              <li>Calculates total paint area</li>
              <li>Helps estimate paint litres and primer quantity</li>
              <li>Useful for interior and exterior painting work</li>
              <li>Supports BOQ preparation and billing</li>
              <li>Reduces paint shortage and wastage</li>
              <li>Helpful for engineers, contractors and homeowners</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">Conclusion</h2>

            <p className="leading-8">
              Paint quantity calculation is an important part of finishing work.
              CivilCalc Pro Paint Calculator helps civil engineers, contractors,
              builders, painters and homeowners calculate wall paint area, paint
              quantity, primer quantity and painting cost quickly.
            </p>

            <p className="mt-4 leading-8">
              For better paint purchase planning, BOQ preparation and finishing work
              estimation, use CivilCalc Pro Paint Calculator before starting painting
              work on site.
            </p>
          </section>

          <div className="rounded-3xl border border-orange-500/30 bg-gradient-to-br from-orange-500/15 to-slate-900 p-6">
            <h2 className="text-2xl font-extrabold text-white">
              Calculate Paint Quantity Instantly
            </h2>

            <p className="mt-3 leading-8 text-slate-300">
              Open CivilCalc Pro Paint Calculator and calculate wall paint quantity,
              primer quantity and painting cost for your construction project.
            </p>

            <Link
              href="/dashboard/calculators/paint"
              className="mt-5 inline-flex rounded-xl bg-orange-500 px-6 py-3 font-bold text-white transition hover:bg-orange-600"
            >
              Use Paint Calculator
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
