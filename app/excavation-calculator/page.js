import Link from 'next/link'

export const metadata = {
  title: 'Excavation Calculator Online | Earthwork Quantity Calculator',
  description:
    'Use CivilCalc Pro Excavation Calculator to calculate earthwork quantity, excavation volume, trench excavation, foundation excavation and construction earthwork in m³ or ft³.',
  keywords: [
    'excavation calculator',
    'earthwork calculator',
    'earthwork quantity calculator',
    'excavation quantity calculator',
    'foundation excavation calculator',
    'trench excavation calculator',
    'civil engineering calculator',
    'construction calculator India',
  ],
  alternates: {
    canonical: 'https://www.civilcalcpro.in/excavation-calculator',
  },
  openGraph: {
    title: 'Excavation Calculator Online | CivilCalc Pro',
    description:
      'Calculate excavation quantity, earthwork volume, foundation excavation and trench excavation online with CivilCalc Pro.',
    url: 'https://www.civilcalcpro.in/excavation-calculator',
    siteName: 'CivilCalc Pro',
    type: 'article',
  },
}

const faqs = [
  {
    q: 'What is an excavation calculator?',
    a: 'An excavation calculator is a civil engineering tool used to calculate the quantity of earthwork required for foundation, trench, basement, roadwork and other construction activities.',
  },
  {
    q: 'What is the formula for excavation quantity?',
    a: 'The basic excavation formula is Length × Width × Depth. The answer is usually measured in cubic meter or cubic feet.',
  },
  {
    q: 'In which unit is excavation measured?',
    a: 'Excavation is generally measured in cubic meter, cubic feet or brass depending on the project and local measurement practice.',
  },
  {
    q: 'Who can use this excavation calculator?',
    a: 'Civil engineers, contractors, site engineers, estimators, builders and civil engineering students can use this excavation calculator.',
  },
]

export default function ExcavationCalculatorArticle() {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Excavation Calculator Online | Earthwork Quantity Calculator',
    description:
      'Complete guide to calculate excavation quantity and earthwork volume for construction projects.',
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
      '@id': 'https://www.civilcalcpro.in/excavation-calculator',
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
        <div className="mb-8">
          <p className="mb-3 text-sm font-bold uppercase tracking-wider text-orange-400">
            Civil Engineering Article
          </p>

          <h1 className="max-w-4xl text-4xl font-extrabold leading-tight md:text-5xl">
            Excavation Calculator Online – Calculate Earthwork Quantity for Construction
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
            Use CivilCalc Pro Excavation Calculator to calculate excavation quantity,
            earthwork volume, foundation excavation, trench excavation and construction
            earthwork in cubic meter or cubic feet.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/dashboard/calculators/excavation"
              className="rounded-xl bg-orange-500 px-6 py-3 font-bold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600"
            >
              Open Excavation Calculator
            </Link>

            <Link


              href="/articles"
              className="rounded-xl border border-slate-700 px-6 py-3 font-bold text-slate-200 transition hover:border-orange-400 hover:text-orange-300"
            >
              View More Articles
            </Link>
          </div>
        </div>

        <article className="prose prose-invert prose-slate max-w-none">
          <h2>What is an Excavation Calculator?</h2>

          <p>
            An Excavation Calculator is an online civil engineering tool used to
            calculate the quantity of earthwork required for construction work. In
            any building, road, drainage, foundation or infrastructure project,
            excavation is one of the first activities on site.
          </p>

          <p>
            CivilCalc Pro Excavation Calculator helps civil engineers, contractors,
            estimators, builders and site engineers calculate excavation volume
            quickly by entering length, width and depth.
          </p>

          <h2>Why Excavation Quantity Calculation is Important</h2>

          <p>
            Excavation quantity calculation is required before starting foundation
            work, footing work, basement work, trench work or roadwork. Accurate
            earthwork quantity helps in cost estimation, labour planning, machine
            planning, truck load planning and contractor billing.
          </p>

          <p>
            If excavation quantity is calculated incorrectly, the project may face
            extra cost, soil disposal issues, wrong billing or delay in construction
            work. That is why every civil engineer and contractor should calculate
            earthwork quantity before execution.
          </p>

          <h2>Excavation Formula</h2>

          <p>The basic formula for excavation quantity is:</p>

          <div className="my-6 rounded-2xl border border-orange-500/30 bg-slate-900 p-5">
            <p className="text-xl font-bold text-orange-300">
              Excavation Volume = Length × Width × Depth
            </p>
          </div>

          <p>Where:</p>

          <ul>
            <li>
              <strong>Length</strong> = total excavation length
            </li>
            <li>
              <strong>Width</strong> = excavation width
            </li>
            <li>
              <strong>Depth</strong> = excavation depth
            </li>
            <li>
              <strong>Excavation Volume</strong> = final earthwork quantity
            </li>
          </ul>

          <p>
            The final answer is usually shown in cubic meter, cubic feet or brass
            depending on site requirement.
          </p>

          <h2>Example of Excavation Calculation</h2>

          <p>
            Suppose excavation length is 10 m, width is 4 m and depth is 1.5 m.
          </p>

          <div className="my-6 rounded-2xl border border-slate-700 bg-slate-900 p-5">
            <p>Excavation Volume = 10 × 4 × 1.5</p>
            <p>Excavation Volume = 60 m³</p>
          </div>

          <p>
            So, the total excavation quantity is <strong>60 cubic meter</strong>.
          </p>

          <h2>How to Use CivilCalc Pro Excavation Calculator</h2>

          <p>
            Using the Excavation Calculator is simple. Enter the length, width and
            depth of the excavation area. Select the required unit and click on the
            calculate button. The tool will instantly show total excavation quantity.
          </p>

          <p>
            This helps site engineers and contractors avoid repeated manual
            calculation and reduces mistakes in site estimation.
          </p>

          <h2>Where Excavation Calculator is Used</h2>

          <ul>
            <li>Foundation excavation</li>
            <li>Footing excavation</li>
            <li>Trench excavation</li>
            <li>Basement excavation</li>
            <li>Roadwork earthwork</li>
            <li>Drainage and pipeline excavation</li>
            <li>Site quantity estimation</li>
            <li>Contractor billing</li>
            <li>BOQ preparation</li>
            <li>Civil engineering student practice</li>
          </ul>

          <h2>Excavation Calculator for Civil Engineers and Contractors</h2>

          <p>
            Civil engineers and contractors need fast and accurate quantity
            calculation on site. CivilCalc Pro Excavation Calculator is designed for
            practical construction use. It helps users calculate excavation quantity
            without complex formulas or spreadsheet work.
          </p>

          <p>
            Whether you are working on a residential building, commercial project,
            roadwork, drainage work or foundation work, this tool can help you
            calculate earthwork quantity quickly.
          </p>

          <h2>Benefits of CivilCalc Pro Excavation Calculator</h2>

          <ul>
            <li>Fast earthwork quantity calculation</li>
            <li>Simple input and clear output</li>
            <li>Useful for site engineers and contractors</li>
            <li>Helps in project cost estimation</li>
            <li>Reduces manual calculation mistakes</li>
            <li>Useful for billing and BOQ preparation</li>
            <li>Works for foundation, trench and basement excavation</li>
          </ul>

          <h2>Conclusion</h2>

          <p>
            Excavation calculation is one of the most important steps in
            construction estimation. CivilCalc Pro Excavation Calculator helps civil
            engineers, contractors, site engineers and students calculate earthwork
            quantity quickly and accurately.
          </p>

          <p>
            For better site planning, cost estimation and billing, use CivilCalc Pro
            Excavation Calculator before starting excavation work.
          </p>

          <div className="not-prose my-10 rounded-3xl border border-orange-500/30 bg-gradient-to-br from-orange-500/15 to-slate-900 p-6">
            <h2 className="text-2xl font-extrabold text-white">
              Calculate Excavation Quantity Instantly
            </h2>
            <p className="mt-3 text-slate-300">
              Open CivilCalc Pro Excavation Calculator and calculate earthwork
              quantity for your construction project.
            </p>
            <Link
              href="/dashboard/calculators/excavation"
              className="mt-5 inline-flex rounded-xl bg-orange-500 px-6 py-3 font-bold text-white transition hover:bg-orange-600"
            >
              Use Excavation Calculator
            </Link>
          </div>

          <h2>FAQs</h2>

          {faqs.map((item) => (
            <div key={item.q}>
              <h3>{item.q}</h3>
              <p>{item.a}</p>
            </div>
          ))}
        </article>
      </section>
    </main>
  )
}
