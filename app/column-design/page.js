import Link from 'next/link'

export const metadata = {
  title: 'Column Design Calculator Online | RCC Column Design as per IS 456',
  description:
    'Calculate RCC column design, axial load capacity, steel area, concrete area, column size and reinforcement requirement online with CivilCalc Pro Column Design Calculator.',
  keywords: [
    'column design calculator',
    'RCC column design calculator',
    'column design as per IS 456',
    'RCC column calculator',
    'civil engineering column design',
    'short column design',
    'long column design',
    'column reinforcement calculator',
    'construction calculator India',
    'civil engineering calculator',
  ],
  alternates: {
    canonical: 'https://www.civilcalcpro.in/column-design-calculation',
  },
  openGraph: {
    title: 'Column Design Calculator Online | CivilCalc Pro',
    description:
      'Calculate RCC column design, axial load capacity and reinforcement requirement online using CivilCalc Pro.',
    url: 'https://www.civilcalcpro.in/column-design-calculation',
    siteName: 'CivilCalc Pro',
    type: 'article',
  },
}

const faqs = [
  {
    q: 'What is RCC column design?',
    a: 'RCC column design is the process of calculating column size, concrete area, steel reinforcement and load carrying capacity of a reinforced cement concrete column.',
  },
  {
    q: 'Which code is used for RCC column design in India?',
    a: 'In India, RCC column design is commonly done as per IS 456 guidelines along with structural engineering design requirements.',
  },
  {
    q: 'What is the formula for axial load capacity of a short RCC column?',
    a: 'For a short axially loaded RCC column, a commonly used design expression is Pu = 0.4 fck Ac + 0.67 fy Asc.',
  },
  {
    q: 'Can I use this calculator for final structural design?',
    a: 'This calculator is useful for estimation, learning and preliminary design. Final structural design should always be checked by a qualified structural engineer.',
  },
]

export default function ColumnDesignCalculationArticle() {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Column Design Calculator Online | RCC Column Design as per IS 456',
    description:
      'Complete guide to RCC column design calculation, axial load capacity, column size and reinforcement requirement.',
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
      '@id': 'https://www.civilcalcpro.in/column-design-calculation',
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

  const designInputs = [
    'Column length',
    'Column width',
    'Column height',
    'Concrete grade',
    'Steel grade',
    'Axial load',
    'Steel percentage',
    'Effective length',
    'Column type',
  ]

  const useCases = [
    'RCC column design',
    'Short column design',
    'Long column checking',
    'Axial load capacity calculation',
    'Column reinforcement calculation',
    'Residential building column design',
    'Commercial building column estimation',
    'Civil engineering student practice',
    'Site engineer design checking',
    'Preliminary structural estimation',
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
          Column Design Calculator Online – RCC Column Design as per IS 456
        </h1>

        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
          Use CivilCalc Pro Column Design Calculator to calculate RCC column size,
          axial load capacity, concrete area, steel reinforcement and preliminary
          column design values for construction projects.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/dashboard/calculators/column"
            className="rounded-xl bg-orange-500 px-6 py-3 font-bold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600"
          >
            Open Column Design Calculator
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
              What is a Column Design Calculator?
            </h2>

            <p className="leading-8">
              A Column Design Calculator is a civil engineering tool used to calculate
              the design values of RCC columns. Columns are vertical structural
              members that transfer load from beams, slabs and upper floors to the
              foundation.
            </p>

            <p className="mt-4 leading-8">
              CivilCalc Pro Column Design Calculator helps civil engineers,
              contractors, site engineers and students calculate column size,
              concrete area, reinforcement area and axial load capacity quickly.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Why RCC Column Design is Important
            </h2>

            <p className="leading-8">
              RCC columns are one of the most important structural elements in any
              building. A column carries load from the structure and safely transfers
              it to the footing or foundation. If column design is not done properly,
              it can affect the safety, serviceability and stability of the building.
            </p>

            <p className="mt-4 leading-8">
              Proper column design helps in selecting correct column size,
              reinforcement percentage, concrete grade, steel grade and load capacity.
              It also helps engineers avoid under-design, over-design and unnecessary
              material wastage.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              RCC Column Design Formula
            </h2>

            <p className="leading-8">
              For a short axially loaded RCC column, the commonly used design
              expression is:
            </p>

            <div className="my-6 rounded-2xl border border-orange-500/30 bg-slate-900 p-5">
              <p className="text-xl font-bold text-orange-300">
                Pu = 0.4 fck Ac + 0.67 fy Asc
              </p>
            </div>

            <ul className="list-disc space-y-2 pl-6 leading-8">
              <li>Pu = Ultimate axial load capacity of column</li>
              <li>fck = Characteristic compressive strength of concrete</li>
              <li>fy = Yield strength of steel</li>
              <li>Ac = Area of concrete</li>
              <li>Asc = Area of steel reinforcement</li>
            </ul>

            <p className="mt-4 leading-8">
              This formula is used for understanding axial load carrying capacity of
              RCC columns. Actual structural design may also include slenderness,
              moment, eccentricity, load combination and detailing checks.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Short Column and Long Column
            </h2>

            <p className="leading-8">
              RCC columns are generally checked as short columns or long columns
              depending on effective length and cross-sectional dimensions. A short
              column mainly fails by crushing, while a long column may be affected by
              buckling and slenderness effects.
            </p>

            <p className="mt-4 leading-8">
              CivilCalc Pro Column Design Calculator helps users understand basic
              column design values and preliminary column capacity. For long columns
              and complex loading conditions, detailed structural design checks are
              required.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Inputs Required for Column Design Calculator
            </h2>

            <p className="leading-8">
              To calculate RCC column design values, the following inputs are
              commonly required:
            </p>

            <ul className="list-disc space-y-2 pl-6 leading-8">
              {designInputs.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Example of RCC Column Design Calculation
            </h2>

            <p className="leading-8">
              Suppose an RCC column has size 300 mm × 300 mm, concrete grade M25,
              steel grade Fe500 and provided steel area of 1800 mm².
            </p>

            <div className="my-6 rounded-2xl border border-slate-700 bg-slate-900 p-5 leading-8">
              <p>Gross area = 300 × 300 = 90,000 mm²</p>
              <p>Steel area = 1,800 mm²</p>
              <p>Concrete area = 90,000 - 1,800 = 88,200 mm²</p>
              <p>Pu = 0.4 × 25 × 88,200 + 0.67 × 500 × 1,800</p>
              <p>Pu = 882,000 + 603,000</p>
              <p>Pu = 1,485,000 N</p>
              <p>Pu = 1485 kN</p>
            </div>

            <p className="leading-8">
              So, the approximate axial load capacity of the column is{' '}
              <strong className="text-white">1485 kN</strong>.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              How to Use CivilCalc Pro Column Design Calculator
            </h2>

            <p className="leading-8">
              Enter column dimensions, concrete grade, steel grade, axial load and
              reinforcement details. After entering the values, click on calculate.
              The tool will show important column design results such as area of
              concrete, area of steel, load capacity and design status.
            </p>

            <p className="mt-4 leading-8">
              This helps civil engineers, site engineers and students understand RCC
              column design quickly without doing repeated manual calculations.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Where Column Design Calculator is Used
            </h2>

            <ul className="list-disc space-y-2 pl-6 leading-8">
              {useCases.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Column Design Calculator for Civil Engineers
            </h2>

            <p className="leading-8">
              Civil engineers need quick design checking tools for daily engineering
              work. CivilCalc Pro Column Design Calculator is useful for preliminary
              column design, educational calculation, RCC design checking and
              construction estimation.
            </p>

            <p className="mt-4 leading-8">
              It is especially useful for civil engineering students, site engineers,
              contractors and professionals who want to understand column capacity and
              reinforcement requirement in a simple way.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Benefits of CivilCalc Pro Column Design Calculator
            </h2>

            <ul className="list-disc space-y-2 pl-6 leading-8">
              <li>Quick RCC column design calculation</li>
              <li>Useful for axial load capacity checking</li>
              <li>Helps calculate concrete area and steel area</li>
              <li>Supports civil engineering learning</li>
              <li>Useful for preliminary design and estimation</li>
              <li>Reduces repeated manual calculation</li>
              <li>Helpful for students, engineers and contractors</li>
            </ul>
          </section>

          <section className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5">
            <h2 className="mb-3 text-2xl font-bold text-white">
              Important Design Note
            </h2>

            <p className="leading-8 text-slate-300">
              RCC column design is a structural safety-related calculation. This
              article and calculator are useful for learning, estimation and
              preliminary design. Final structural design should always be verified by
              a qualified structural engineer as per applicable codes and project
              conditions.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">Conclusion</h2>

            <p className="leading-8">
              RCC column design is a critical part of building construction.
              CivilCalc Pro Column Design Calculator helps civil engineers,
              contractors, site engineers and students calculate column design values
              quickly and clearly.
            </p>

            <p className="mt-4 leading-8">
              For preliminary RCC column design, axial load capacity calculation and
              reinforcement checking, use CivilCalc Pro Column Design Calculator.
            </p>
          </section>

          <div className="rounded-3xl border border-orange-500/30 bg-gradient-to-br from-orange-500/15 to-slate-900 p-6">
            <h2 className="text-2xl font-extrabold text-white">
              Calculate RCC Column Design Instantly
            </h2>

            <p className="mt-3 leading-8 text-slate-300">
              Open CivilCalc Pro Column Design Calculator and calculate column size,
              load capacity and reinforcement requirement for your project.
            </p>

            <Link
              href="/dashboard/calculators/column"
              className="mt-5 inline-flex rounded-xl bg-orange-500 px-6 py-3 font-bold text-white transition hover:bg-orange-600"
            >
              Use Column Design Calculator
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
