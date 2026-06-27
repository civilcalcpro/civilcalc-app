import Link from 'next/link'

export const metadata = {
  title: 'Quantity Estimation Calculator Online | Construction Material Calculator',
  description:
    'Calculate construction quantity estimation, cement, sand, aggregate, steel, bricks, plaster, tiles, paint, excavation and BOQ quantities online with CivilCalc Pro.',
  keywords: [
    'quantity estimation calculator',
    'construction quantity calculator',
    'civil quantity calculator',
    'construction material calculator',
    'building material calculator',
    'cement sand aggregate calculator',
    'steel quantity calculator',
    'brickwork quantity calculator',
    'civil engineering calculator',
    'construction calculator India',
  ],
  alternates: {
    canonical: 'https://www.civilcalcpro.in/quantity-estimation-calculator',
  },
  openGraph: {
    title: 'Quantity Estimation Calculator Online | CivilCalc Pro',
    description:
      'Calculate construction material quantities including concrete, steel, bricks, plaster, excavation, tiles, paint and BOQ items.',
    url: 'https://www.civilcalcpro.in/quantity-estimation-calculator',
    siteName: 'CivilCalc Pro',
    type: 'article',
  },
}

const faqs = [
  {
    q: 'What is quantity estimation in civil engineering?',
    a: 'Quantity estimation is the process of calculating construction quantities such as excavation, concrete, steel, bricks, plaster, tiles, paint and other materials required for a project.',
  },
  {
    q: 'Why is quantity estimation important in construction?',
    a: 'Quantity estimation is important for cost estimation, BOQ preparation, material planning, labour planning, contractor billing and reducing wastage on site.',
  },
  {
    q: 'Which materials are calculated in construction quantity estimation?',
    a: 'Common materials include cement, sand, aggregate, steel, bricks, concrete, mortar, plaster material, tiles, paint, excavation quantity and finishing materials.',
  },
  {
    q: 'Can this calculator be used for BOQ preparation?',
    a: 'Yes, quantity estimation results are useful for BOQ preparation, billing, tendering and construction cost estimation.',
  },
  {
    q: 'Who can use this quantity estimation calculator?',
    a: 'Civil engineers, contractors, site engineers, builders, estimators, architects and civil engineering students can use this calculator.',
  },
]

export default function QuantityEstimationCalculatorArticle() {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Quantity Estimation Calculator Online | Construction Material Calculator',
    description:
      'Complete guide to construction quantity estimation for concrete, steel, excavation, brickwork, plaster, tiles, paint and BOQ preparation.',
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
      '@id': 'https://www.civilcalcpro.in/quantity-estimation-calculator',
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

  const quantityItems = [
    ['Excavation Quantity', 'Length × Width × Depth', 'm³ or ft³'],
    ['Concrete Quantity', 'Length × Width × Depth', 'm³ or ft³'],
    ['Steel Quantity', 'D² / 162 × Length', 'kg'],
    ['Brickwork Quantity', 'Length × Height × Thickness', 'm³'],
    ['Plaster Quantity', 'Length × Height × Thickness', 'm³ or m²'],
    ['Tile Quantity', 'Total Area / One Tile Area', 'Nos'],
    ['Paint Quantity', 'Total Paint Area / Coverage', 'Litres'],
    ['Flooring Quantity', 'Length × Width', 'm² or sq ft'],
  ]

  const tools = [
    {
      title: 'Excavation Calculator',
      desc: 'Calculate earthwork quantity, trench excavation, foundation excavation and soil removal volume.',
      href: '/excavation-calculator',
    },
    {
      title: 'Concrete Calculator',
      desc: 'Calculate concrete volume, cement bags, sand quantity, aggregate quantity and concrete mix ratio.',
      href: '/concrete-calculator',
    },
    {
      title: 'Steel Weight Calculator',
      desc: 'Calculate TMT bar weight, reinforcement quantity and steel weight using D²/162 formula.',
      href: '/steel-weight-calculator',
    },
    {
      title: 'Brickwork Calculator',
      desc: 'Calculate number of bricks, mortar quantity, cement and sand for brick masonry work.',
      href: '/brickwork-calculator',
    },
    {
      title: 'Plaster Calculator',
      desc: 'Calculate plaster area, mortar volume, cement bags and sand quantity for wall plaster.',
      href: '/plaster-calculator',
    },
    {
      title: 'Tile Calculator',
      desc: 'Calculate floor tiles, wall tiles, tile area, number of tiles and wastage.',
      href: '/tile-calculator',
    },
    {
      title: 'Paint Calculator',
      desc: 'Calculate wall paint quantity, primer quantity, painting area and painting cost.',
      href: '/paint-calculator',
    },
    {
      title: 'BOQ Generator',
      desc: 'Prepare bill of quantities, item rates, material summary and construction project estimate.',
      href: '/boq-generator',
    },
  ]

  const useCases = [
    'Residential building quantity estimation',
    'Commercial building material estimation',
    'Construction cost estimation',
    'BOQ preparation',
    'Tender quantity checking',
    'Contractor billing',
    'Material purchase planning',
    'Site execution planning',
    'Civil engineering student practice',
    'Daily construction work estimation',
  ]

  const inputs = [
    'Project type',
    'Work item name',
    'Length',
    'Width',
    'Height or depth',
    'Number of items',
    'Material grade',
    'Unit of measurement',
    'Wastage percentage',
    'Material rate',
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
          Quantity Estimation Calculator Online – Construction Material Quantity Calculator
        </h1>

        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
          Use CivilCalc Pro Quantity Estimation Calculator to calculate construction
          quantities such as excavation, concrete, cement, sand, aggregate, steel,
          bricks, plaster, tiles, paint and BOQ material quantities for civil
          engineering projects.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/dashboard/calculators/quantity-estimation"
            className="rounded-xl bg-orange-500 px-6 py-3 font-bold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600"
          >
            Open Quantity Estimation Calculator
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
              What is Quantity Estimation in Civil Engineering?
            </h2>

            <p className="leading-8">
              Quantity estimation is the process of calculating the quantity of
              materials and work required for a construction project. It includes
              excavation quantity, concrete quantity, steel quantity, brickwork
              quantity, plaster quantity, tile quantity, paint quantity and finishing
              work quantities.
            </p>

            <p className="mt-4 leading-8">
              CivilCalc Pro Quantity Estimation Calculator helps civil engineers,
              contractors, builders, site engineers, estimators and students calculate
              construction quantities quickly and clearly for project planning, BOQ
              preparation and billing.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Why Quantity Estimation is Important
            </h2>

            <p className="leading-8">
              Quantity estimation is one of the most important parts of construction
              planning. Before starting any building work, engineers and contractors
              need to know how much material is required, how much labour is needed
              and what will be the approximate project cost.
            </p>

            <p className="mt-4 leading-8">
              Accurate quantity estimation helps reduce material wastage, avoid
              shortage on site, control construction cost, prepare BOQ, check
              contractor bills and manage project execution properly.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Construction Quantity Estimation Formula Table
            </h2>

            <p className="leading-8">
              Different construction items use different basic formulas for quantity
              calculation. Some common formulas are:
            </p>

            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-800">
              <table className="w-full border-collapse text-left">
                <thead className="bg-slate-900">
                  <tr>
                    <th className="border-b border-slate-800 px-4 py-3 text-white">
                      Work Item
                    </th>
                    <th className="border-b border-slate-800 px-4 py-3 text-white">
                      Basic Formula
                    </th>
                    <th className="border-b border-slate-800 px-4 py-3 text-white">
                      Unit
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {quantityItems.map((row) => (
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
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Materials Covered in Quantity Estimation
            </h2>

            <p className="leading-8">
              A complete construction quantity estimate should include all major
              materials and work items required from foundation to finishing.
            </p>

            <ul className="mt-4 list-disc space-y-2 pl-6 leading-8">
              <li>Excavation and earthwork quantity</li>
              <li>PCC and RCC concrete quantity</li>
              <li>Cement, sand and aggregate quantity</li>
              <li>Steel reinforcement quantity</li>
              <li>Brickwork and blockwork quantity</li>
              <li>Plaster and mortar quantity</li>
              <li>Flooring and tile quantity</li>
              <li>Paint and primer quantity</li>
              <li>Shuttering and formwork quantity</li>
              <li>BOQ item quantity and cost</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Quantity Calculators Included in CivilCalc Pro
            </h2>

            <p className="leading-8">
              CivilCalc Pro provides multiple quantity calculators for different
              construction activities. These tools help users calculate material
              quantities without manual spreadsheet work.
            </p>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {tools.map((tool) => (
                <Link
                  key={tool.title}
                  href={tool.href}
                  className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 transition hover:border-orange-500 hover:-translate-y-1"
                >
                  <h3 className="text-xl font-bold text-white">{tool.title}</h3>
                  <p className="mt-3 leading-7 text-slate-400">{tool.desc}</p>
                </Link>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Excavation Quantity Estimation
            </h2>

            <p className="leading-8">
              Excavation quantity is calculated before foundation work, basement work,
              trench work, drainage work or roadwork. The basic excavation formula is:
            </p>

            <div className="my-6 rounded-2xl border border-orange-500/30 bg-slate-900 p-5">
              <p className="text-xl font-bold text-orange-300">
                Excavation Volume = Length × Width × Depth
              </p>
            </div>

            <p className="leading-8">
              Excavation quantity is usually measured in cubic meter or cubic feet and
              is used for earthwork billing, machine planning and soil disposal.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Concrete Quantity Estimation
            </h2>

            <p className="leading-8">
              Concrete quantity estimation is required for RCC slabs, beams, columns,
              footings, PCC and flooring work. The basic formula is:
            </p>

            <div className="my-6 rounded-2xl border border-orange-500/30 bg-slate-900 p-5">
              <p className="text-xl font-bold text-orange-300">
                Concrete Volume = Length × Width × Depth
              </p>
            </div>

            <p className="leading-8">
              After concrete volume is calculated, cement bags, sand quantity and
              aggregate quantity can be estimated based on concrete grade and mix
              ratio.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Steel Quantity Estimation
            </h2>

            <p className="leading-8">
              Steel quantity is important for RCC beams, columns, slabs, footings and
              staircases. TMT bar weight is commonly calculated using:
            </p>

            <div className="my-6 rounded-2xl border border-orange-500/30 bg-slate-900 p-5">
              <p className="text-xl font-bold text-orange-300">
                Steel Weight = D² / 162 × Length
              </p>
            </div>

            <p className="leading-8">
              Steel estimation helps in reinforcement planning, steel purchase,
              contractor billing and bar bending schedule checking.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Brickwork Quantity Estimation
            </h2>

            <p className="leading-8">
              Brickwork quantity estimation helps calculate number of bricks, mortar
              quantity, cement and sand for masonry work. The basic formula is:
            </p>

            <div className="my-6 rounded-2xl border border-orange-500/30 bg-slate-900 p-5">
              <p className="text-xl font-bold text-orange-300">
                Brickwork Volume = Length × Height × Thickness
              </p>
            </div>

            <p className="leading-8">
              For standard modular brickwork, approximately 500 bricks are commonly
              considered for 1 cubic meter of brickwork, depending on brick size and
              mortar thickness.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Plaster Quantity Estimation
            </h2>

            <p className="leading-8">
              Plaster quantity estimation is required for internal wall plaster,
              external wall plaster and ceiling plaster. The basic plaster area
              formula is:
            </p>

            <div className="my-6 rounded-2xl border border-orange-500/30 bg-slate-900 p-5">
              <p className="text-xl font-bold text-orange-300">
                Plaster Area = Length × Height
              </p>
            </div>

            <p className="leading-8">
              Plaster mortar volume is calculated by multiplying plaster area by
              thickness. Cement and sand are calculated based on mortar ratio.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Tile and Paint Quantity Estimation
            </h2>

            <p className="leading-8">
              Finishing work quantities are also important in project estimation. Tile
              quantity is calculated using total floor or wall area divided by one
              tile area. Paint quantity is calculated using total paint area divided
              by paint coverage.
            </p>

            <div className="my-6 rounded-2xl border border-orange-500/30 bg-slate-900 p-5 space-y-3">
              <p className="text-lg font-bold text-orange-300">
                Number of Tiles = Total Area / Area of One Tile
              </p>
              <p className="text-lg font-bold text-orange-300">
                Paint Quantity = Total Paint Area / Paint Coverage
              </p>
            </div>

            <p className="leading-8">
              Wastage should be added for tile cutting, breakage, paint absorption and
              site handling.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Inputs Required for Quantity Estimation Calculator
            </h2>

            <p className="leading-8">
              To calculate construction quantity estimation properly, the following
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
              Example of Construction Quantity Estimation
            </h2>

            <p className="leading-8">
              Suppose a building slab has length 10 m, width 8 m and thickness 0.125 m.
            </p>

            <div className="my-6 rounded-2xl border border-slate-700 bg-slate-900 p-5 leading-8">
              <p>Concrete Volume = Length × Width × Thickness</p>
              <p>Concrete Volume = 10 × 8 × 0.125</p>
              <p>Concrete Volume = 10 m³</p>
            </div>

            <p className="leading-8">
              So, the slab requires approximately{' '}
              <strong className="text-white">10 cubic meter</strong> of concrete
              before adding wastage or design-specific adjustments.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Quantity Estimation for BOQ Preparation
            </h2>

            <p className="leading-8">
              BOQ preparation depends on accurate quantity estimation. Every work item
              in a BOQ needs a clear description, unit, quantity, rate and amount.
              Quantity estimation gives the base data required for BOQ calculation.
            </p>

            <p className="mt-4 leading-8">
              CivilCalc Pro helps users calculate item-wise quantities and then use
              them for BOQ preparation, material summary, contractor billing and
              project cost estimation.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Where Quantity Estimation Calculator is Used
            </h2>

            <ul className="list-disc space-y-2 pl-6 leading-8">
              {useCases.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Quantity Estimation Calculator for Civil Engineers and Contractors
            </h2>

            <p className="leading-8">
              Civil engineers and contractors need fast quantity estimation for daily
              construction work. CivilCalc Pro Quantity Estimation Calculator is
              designed for practical site use, BOQ preparation, material planning and
              construction cost estimation.
            </p>

            <p className="mt-4 leading-8">
              Whether you are calculating excavation, concrete, steel, brickwork,
              plaster, tiles, paint or complete building material quantity, CivilCalc
              Pro helps you get quick and clear results.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Benefits of CivilCalc Pro Quantity Estimation Calculator
            </h2>

            <ul className="list-disc space-y-2 pl-6 leading-8">
              <li>Fast construction quantity calculation</li>
              <li>Covers major civil engineering work items</li>
              <li>Useful for BOQ preparation and billing</li>
              <li>Helps in material purchase planning</li>
              <li>Reduces manual spreadsheet work</li>
              <li>Helps reduce material shortage and wastage</li>
              <li>Useful for engineers, contractors, builders and students</li>
            </ul>
          </section>

          <section className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-5">
            <h2 className="mb-3 text-2xl font-bold text-white">
              Important Estimation Note
            </h2>

            <p className="leading-8 text-slate-300">
              Quantity estimation depends on drawing dimensions, site condition,
              specification, wastage, material quality and construction method. Final
              project quantity and cost should always be checked with approved
              drawings, BOQ and project specifications.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">Conclusion</h2>

            <p className="leading-8">
              Quantity estimation is the foundation of construction cost estimation,
              BOQ preparation and site planning. CivilCalc Pro Quantity Estimation
              Calculator helps civil engineers, contractors, site engineers and
              students calculate excavation, concrete, steel, brickwork, plaster,
              tile, paint and other construction quantities quickly.
            </p>

            <p className="mt-4 leading-8">
              For better construction planning, material estimation, BOQ preparation
              and project cost control, use CivilCalc Pro Quantity Estimation
              Calculator.
            </p>
          </section>

          <div className="rounded-3xl border border-orange-500/30 bg-gradient-to-br from-orange-500/15 to-slate-900 p-6">
            <h2 className="text-2xl font-extrabold text-white">
              Calculate Construction Quantities Instantly
            </h2>

            <p className="mt-3 leading-8 text-slate-300">
              Open CivilCalc Pro tools and calculate concrete, steel, brickwork,
              plaster, tiles, paint, excavation and BOQ quantities for your project.
            </p>

            <div className="mt-5 flex flex-wrap gap-4">
              <Link
                href="/dashboard/calculators/quantity-estimation"
                className="inline-flex rounded-xl bg-orange-500 px-6 py-3 font-bold text-white transition hover:bg-orange-600"
              >
                Use Quantity Estimation Calculator
              </Link>

              <Link
                href="/boq-generator"
                className="inline-flex rounded-xl border border-orange-500 px-6 py-3 font-bold text-orange-300 transition hover:bg-orange-500 hover:text-white"
              >
                Read BOQ Generator Guide
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
