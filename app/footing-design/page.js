import Link from 'next/link'

export const metadata = {
  title: 'Footing Design Calculator Online | RCC Footing Design as per IS 456',
  description:
    'Calculate RCC footing design, footing size, soil bearing capacity, load, reinforcement and concrete quantity online with CivilCalc Pro Footing Design Calculator.',
  keywords: [
    'footing design calculator',
    'RCC footing design calculator',
    'isolated footing design',
    'footing size calculator',
    'foundation design calculator',
    'soil bearing capacity calculator',
    'RCC footing reinforcement calculator',
    'civil engineering calculator',
    'construction calculator India',
  ],
  alternates: {
    canonical: 'https://www.civilcalcpro.in/footing-design-calculation',
  },
  openGraph: {
    title: 'Footing Design Calculator Online | CivilCalc Pro',
    description:
      'Calculate RCC footing size, soil pressure, reinforcement and foundation design values online.',
    url: 'https://www.civilcalcpro.in/footing-design-calculation',
    siteName: 'CivilCalc Pro',
    type: 'article',
  },
}

const faqs = [
  {
    q: 'What is footing design?',
    a: 'Footing design is the process of calculating the size, thickness, reinforcement and load distribution of a foundation element that transfers column load safely to the soil.',
  },
  {
    q: 'What is the basic formula for footing area?',
    a: 'The basic footing area formula is Required Area = Total Load / Safe Bearing Capacity of Soil.',
  },
  {
    q: 'Which footing is commonly used for building columns?',
    a: 'Isolated footing is commonly used below individual RCC columns in residential and commercial buildings when soil bearing capacity is adequate.',
  },
  {
    q: 'Can this calculator be used for final structural design?',
    a: 'This calculator is useful for learning, estimation and preliminary design. Final footing design should always be verified by a qualified structural engineer.',
  },
]

export default function FootingDesignCalculationArticle() {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Footing Design Calculator Online | RCC Footing Design as per IS 456',
    description:
      'Complete guide to RCC footing design calculation, footing area, soil bearing capacity, reinforcement and foundation design.',
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
      '@id': 'https://www.civilcalcpro.in/footing-design-calculation',
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
    'Column load',
    'Safe bearing capacity of soil',
    'Column size',
    'Concrete grade',
    'Steel grade',
    'Footing length',
    'Footing width',
    'Footing thickness',
    'Reinforcement details',
    'Soil pressure',
  ]

  const useCases = [
    'Isolated footing design',
    'RCC foundation design',
    'Column footing size calculation',
    'Soil bearing pressure checking',
    'Footing reinforcement calculation',
    'Residential building foundation design',
    'Commercial building foundation estimation',
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
          Footing Design Calculator Online – RCC Footing Design for Construction
        </h1>

        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
          Use CivilCalc Pro Footing Design Calculator to calculate footing size,
          required footing area, soil bearing pressure, reinforcement requirement and
          preliminary RCC foundation design values.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/dashboard/calculators/footing"
            className="rounded-xl bg-orange-500 px-6 py-3 font-bold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600"
          >
            Open Footing Design Calculator
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
              What is a Footing Design Calculator?
            </h2>

            <p className="leading-8">
              A Footing Design Calculator is a civil engineering tool used to calculate
              footing size, footing area, soil pressure, concrete quantity and
              reinforcement requirement for RCC foundations. Footings are structural
              elements that transfer column loads safely to the soil.
            </p>

            <p className="mt-4 leading-8">
              CivilCalc Pro Footing Design Calculator helps civil engineers,
              contractors, site engineers and students calculate preliminary footing
              design values quickly by entering load, safe bearing capacity, column
              size and material details.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Why Footing Design is Important
            </h2>

            <p className="leading-8">
              Footing design is one of the most important parts of building
              construction because the footing transfers the load of the structure to
              the ground. If footing size or reinforcement is not proper, it can lead
              to excessive settlement, cracks, structural damage or unsafe foundation
              performance.
            </p>

            <p className="mt-4 leading-8">
              Proper footing design helps in selecting correct footing area, thickness,
              reinforcement, concrete grade and safe soil pressure. It also helps
              avoid under-design, over-design and unnecessary material wastage.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Basic Footing Design Formula
            </h2>

            <p className="leading-8">
              The basic formula used to calculate required footing area is:
            </p>

            <div className="my-6 rounded-2xl border border-orange-500/30 bg-slate-900 p-5">
              <p className="text-xl font-bold text-orange-300">
                Required Footing Area = Total Load / Safe Bearing Capacity
              </p>
            </div>

            <ul className="list-disc space-y-2 pl-6 leading-8">
              <li>Total Load = Load transferred from column to footing</li>
              <li>Safe Bearing Capacity = Safe load carrying capacity of soil</li>
              <li>Required Footing Area = Minimum area required to safely transfer load</li>
            </ul>

            <p className="mt-4 leading-8">
              After calculating footing area, engineers check footing length, width,
              soil pressure, bending moment, shear force, punching shear and
              reinforcement requirement.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Important Checks in RCC Footing Design
            </h2>

            <p className="leading-8">
              RCC footing design is not limited to only footing area. A proper footing
              design generally includes multiple safety and serviceability checks.
            </p>

            <ul className="mt-4 list-disc space-y-2 pl-6 leading-8">
              <li>Soil bearing pressure check</li>
              <li>Footing area calculation</li>
              <li>Footing depth calculation</li>
              <li>One-way shear check</li>
              <li>Punching shear check</li>
              <li>Bending moment calculation</li>
              <li>Main reinforcement calculation</li>
              <li>Distribution reinforcement calculation</li>
              <li>Development length and anchorage check</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Inputs Required for Footing Design Calculator
            </h2>

            <p className="leading-8">
              To calculate RCC footing design values, the following inputs are
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
              Example of Footing Area Calculation
            </h2>

            <p className="leading-8">
              Suppose total column load is 900 kN and safe bearing capacity of soil is
              200 kN/m².
            </p>

            <div className="my-6 rounded-2xl border border-slate-700 bg-slate-900 p-5 leading-8">
              <p>Required Area = Total Load / Safe Bearing Capacity</p>
              <p>Required Area = 900 / 200</p>
              <p>Required Area = 4.5 m²</p>
            </div>

            <p className="leading-8">
              So, the required footing area is{' '}
              <strong className="text-white">4.5 m²</strong>. Based on this area, an
              engineer may select a suitable footing size such as 2.2 m × 2.1 m or
              another practical size depending on site and design conditions.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Types of Footings Used in Construction
            </h2>

            <p className="leading-8">
              Different types of footings are used depending on soil condition,
              structural load, column spacing and project requirement.
            </p>

            <ul className="mt-4 list-disc space-y-2 pl-6 leading-8">
              <li>Isolated footing</li>
              <li>Combined footing</li>
              <li>Strip footing</li>
              <li>Raft foundation</li>
              <li>Stepped footing</li>
              <li>Sloped footing</li>
              <li>Wall footing</li>
              <li>Pile cap foundation</li>
            </ul>

            <p className="mt-4 leading-8">
              Isolated footing is one of the most commonly used footing types below
              individual RCC columns in residential and small commercial buildings.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              How to Use CivilCalc Pro Footing Design Calculator
            </h2>

            <p className="leading-8">
              Enter the column load, safe bearing capacity of soil, column size,
              footing dimensions, concrete grade and steel grade. After entering the
              values, click on calculate. The tool will show important footing design
              results such as required area, soil pressure, footing size and design
              values.
            </p>

            <p className="mt-4 leading-8">
              This helps civil engineers, contractors and students understand footing
              design quickly without doing repeated manual calculations.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Where Footing Design Calculator is Used
            </h2>

            <ul className="list-disc space-y-2 pl-6 leading-8">
              {useCases.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Footing Design Calculator for Civil Engineers
            </h2>

            <p className="leading-8">
              Civil engineers need quick and practical design tools for foundation
              work. CivilCalc Pro Footing Design Calculator is useful for preliminary
              footing design, learning, estimation and site checking.
            </p>

            <p className="mt-4 leading-8">
              It is useful for civil engineering students, site engineers, contractors
              and construction professionals who want to calculate footing design
              values in a simple and clear way.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Benefits of CivilCalc Pro Footing Design Calculator
            </h2>

            <ul className="list-disc space-y-2 pl-6 leading-8">
              <li>Quick RCC footing design calculation</li>
              <li>Useful for footing area calculation</li>
              <li>Helps check soil bearing pressure</li>
              <li>Useful for foundation estimation</li>
              <li>Supports civil engineering learning</li>
              <li>Reduces repeated manual calculation</li>
              <li>Helpful for engineers, contractors and students</li>
            </ul>
          </section>

          <section className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5">
            <h2 className="mb-3 text-2xl font-bold text-white">
              Important Design Note
            </h2>

            <p className="leading-8 text-slate-300">
              RCC footing design is directly related to structural safety and soil
              conditions. This article and calculator are useful for learning,
              estimation and preliminary design. Final foundation design should always
              be verified by a qualified structural engineer based on soil report,
              building load and applicable design codes.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">Conclusion</h2>

            <p className="leading-8">
              Footing design is a critical part of every construction project.
              CivilCalc Pro Footing Design Calculator helps civil engineers,
              contractors, site engineers and students calculate footing area,
              soil pressure and foundation design values quickly.
            </p>

            <p className="mt-4 leading-8">
              For preliminary RCC footing design, foundation estimation and soil
              pressure checking, use CivilCalc Pro Footing Design Calculator.
            </p>
          </section>

          <div className="rounded-3xl border border-orange-500/30 bg-gradient-to-br from-orange-500/15 to-slate-900 p-6">
            <h2 className="text-2xl font-extrabold text-white">
              Calculate RCC Footing Design Instantly
            </h2>

            <p className="mt-3 leading-8 text-slate-300">
              Open CivilCalc Pro Footing Design Calculator and calculate footing size,
              soil pressure and foundation design values for your project.
            </p>

            <Link
              href="/dashboard/calculators/footing"
              className="mt-5 inline-flex rounded-xl bg-orange-500 px-6 py-3 font-bold text-white transition hover:bg-orange-600"
            >
              Use Footing Design Calculator
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
