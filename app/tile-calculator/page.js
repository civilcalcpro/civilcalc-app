import Link from 'next/link'

export const metadata = {
  title: 'Tile Calculator Online | Floor and Wall Tile Quantity Calculator',
  description:
    'Calculate floor tiles, wall tiles, tile area, number of tiles, wastage and tile quantity online with CivilCalc Pro Tile Calculator.',
  keywords: [
    'tile calculator',
    'floor tile calculator',
    'wall tile calculator',
    'tile quantity calculator',
    'tiles calculator India',
    'construction tile calculator',
    'flooring calculator',
    'civil engineering calculator',
    'construction calculator India',
  ],
  alternates: {
    canonical: 'https://www.civilcalcpro.in/tile-calculator',
  },
  openGraph: {
    title: 'Tile Calculator Online | CivilCalc Pro',
    description:
      'Calculate number of tiles, flooring area, wall tile area, wastage and tile quantity for construction work.',
    url: 'https://www.civilcalcpro.in/tile-calculator',
    siteName: 'CivilCalc Pro',
    type: 'article',
  },
}

const faqs = [
  {
    q: 'What is a tile calculator?',
    a: 'A tile calculator is a construction calculator used to calculate the number of tiles required for floor tiles, wall tiles, bathroom tiles, kitchen tiles and other tiling work.',
  },
  {
    q: 'What is the formula for tile quantity?',
    a: 'Tile quantity is calculated by dividing total area by one tile area. Number of tiles = Total area / Area of one tile.',
  },
  {
    q: 'How much wastage should be added for tiles?',
    a: 'Usually 5% to 10% wastage is added for tile cutting, breakage and fitting. For diagonal patterns or complex layouts, wastage can be higher.',
  },
  {
    q: 'Can this calculator be used for floor and wall tiles?',
    a: 'Yes, this tile calculator can be used for floor tiles, wall tiles, bathroom tiles, kitchen tiles and general construction tiling work.',
  },
]

export default function TileCalculatorArticle() {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Tile Calculator Online | Floor and Wall Tile Quantity Calculator',
    description:
      'Complete guide to calculate tile quantity, tile area, number of tiles and wastage for floor and wall tiling work.',
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
      '@id': 'https://www.civilcalcpro.in/tile-calculator',
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
    'Room length',
    'Room width',
    'Wall height',
    'Tile length',
    'Tile width',
    'Number of rooms or walls',
    'Wastage percentage',
    'Unit system',
  ]

  const useCases = [
    'Floor tile quantity calculation',
    'Wall tile quantity calculation',
    'Bathroom tile estimation',
    'Kitchen wall tile estimation',
    'Room flooring calculation',
    'Commercial flooring estimation',
    'Tile purchase planning',
    'BOQ preparation',
    'Contractor billing',
    'Civil engineering student practice',
  ]

  const tileSizes = [
    ['300 mm × 300 mm', 'Small floor or wall tiles'],
    ['600 mm × 600 mm', 'Common floor tile size'],
    ['600 mm × 1200 mm', 'Large format floor or wall tiles'],
    ['300 mm × 600 mm', 'Wall tiles and bathroom tiles'],
    ['800 mm × 800 mm', 'Premium flooring tiles'],
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
          Tile Calculator Online – Calculate Floor and Wall Tile Quantity
        </h1>

        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
          Use CivilCalc Pro Tile Calculator to calculate number of tiles, floor tile
          quantity, wall tile quantity, tile area and wastage for construction,
          flooring, bathroom and kitchen tiling work.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/dashboard/calculators/tile"
            className="rounded-xl bg-orange-500 px-6 py-3 font-bold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600"
          >
            Open Tile Calculator
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
              What is a Tile Calculator?
            </h2>

            <p className="leading-8">
              A Tile Calculator is an online construction calculator used to calculate
              the number of tiles required for flooring, wall tiling, bathroom tiles,
              kitchen tiles and other finishing work. It helps users estimate tile
              quantity before purchasing tiles for a project.
            </p>

            <p className="mt-4 leading-8">
              CivilCalc Pro Tile Calculator helps civil engineers, contractors,
              builders, interior workers, site engineers and homeowners calculate
              tile quantity quickly by entering room size, tile size and wastage
              percentage.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Why Tile Quantity Calculation is Important
            </h2>

            <p className="leading-8">
              Tile quantity calculation is important because flooring and wall tiling
              work requires accurate material planning. If tile quantity is calculated
              incorrectly, the project may face shortage, extra wastage, wrong purchase
              quantity or delay in finishing work.
            </p>

            <p className="mt-4 leading-8">
              Accurate tile calculation helps in material purchase, cost estimation,
              BOQ preparation, contractor billing and reducing tile wastage on site.
              It also helps users decide how many boxes of tiles are required for a
              room or wall.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Tile Area Formula
            </h2>

            <p className="leading-8">
              The first step in tile calculation is calculating total floor or wall
              area.
            </p>

            <div className="my-6 rounded-2xl border border-orange-500/30 bg-slate-900 p-5">
              <p className="text-xl font-bold text-orange-300">
                Total Area = Length × Width
              </p>
            </div>

            <ul className="list-disc space-y-2 pl-6 leading-8">
              <li>Length = length of room, floor or wall</li>
              <li>Width = width of floor or height of wall</li>
              <li>Total Area = area where tiles will be installed</li>
            </ul>

            <p className="mt-4 leading-8">
              For wall tiles, wall length and wall height are used. For floor tiles,
              room length and room width are used.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Tile Quantity Formula
            </h2>

            <p className="leading-8">
              After calculating total area, tile quantity is calculated using area of
              one tile.
            </p>

            <div className="my-6 rounded-2xl border border-orange-500/30 bg-slate-900 p-5">
              <p className="text-xl font-bold text-orange-300">
                Number of Tiles = Total Area / Area of One Tile
              </p>
            </div>

            <p className="leading-8">
              Area of one tile is calculated as:
            </p>

            <div className="my-6 rounded-2xl border border-orange-500/30 bg-slate-900 p-5">
              <p className="text-xl font-bold text-orange-300">
                Tile Area = Tile Length × Tile Width
              </p>
            </div>

            <p className="leading-8">
              After calculating tile quantity, wastage is added for cutting, breakage,
              edge fitting and site handling.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Tile Wastage Calculation
            </h2>

            <p className="leading-8">
              Tile wastage is added because tiles need cutting near corners, edges,
              doors, columns and wall junctions. Some tiles may also break during
              handling and installation.
            </p>

            <div className="my-6 rounded-2xl border border-orange-500/30 bg-slate-900 p-5">
              <p className="text-xl font-bold text-orange-300">
                Final Tiles = Number of Tiles + Wastage
              </p>
            </div>

            <p className="leading-8">
              For normal tile work, 5% to 10% wastage is commonly considered. For
              diagonal patterns, complex layouts or large cutting areas, wastage may
              be higher.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Common Tile Sizes Used in Construction
            </h2>

            <p className="leading-8">
              Tile size depends on design, location, flooring type and project
              requirement. Some common tile sizes are:
            </p>

            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-800">
              <table className="w-full border-collapse text-left">
                <thead className="bg-slate-900">
                  <tr>
                    <th className="border-b border-slate-800 px-4 py-3 text-white">
                      Tile Size
                    </th>
                    <th className="border-b border-slate-800 px-4 py-3 text-white">
                      Common Use
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tileSizes.map((row) => (
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
              Inputs Required for Tile Calculator
            </h2>

            <p className="leading-8">
              To calculate tile quantity accurately, the following inputs are commonly
              required:
            </p>

            <ul className="list-disc space-y-2 pl-6 leading-8">
              {inputs.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Example of Tile Quantity Calculation
            </h2>

            <p className="leading-8">
              Suppose a room has length 12 ft and width 10 ft. Tile size is 2 ft × 2 ft.
            </p>

            <div className="my-6 rounded-2xl border border-slate-700 bg-slate-900 p-5 leading-8">
              <p>Total floor area = 12 × 10</p>
              <p>Total floor area = 120 sq ft</p>
              <p>Area of one tile = 2 × 2</p>
              <p>Area of one tile = 4 sq ft</p>
              <p>Number of tiles = 120 / 4</p>
              <p>Number of tiles = 30 tiles</p>
              <p>Adding 10% wastage = 30 + 3</p>
              <p>Final tiles required = 33 tiles</p>
            </div>

            <p className="leading-8">
              So, approximately{' '}
              <strong className="text-white">33 tiles</strong> are required for this
              room after adding 10% wastage.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              How to Use CivilCalc Pro Tile Calculator
            </h2>

            <p className="leading-8">
              Enter room length, room width, tile length, tile width and wastage
              percentage. After entering the values, click on calculate. The tool will
              show total area, area of one tile, number of tiles and final tile
              quantity including wastage.
            </p>

            <p className="mt-4 leading-8">
              This makes tile estimation faster and easier for civil engineers,
              contractors, interior workers and construction professionals.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Where Tile Calculator is Used
            </h2>

            <ul className="list-disc space-y-2 pl-6 leading-8">
              {useCases.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Tile Calculator for Civil Engineers and Contractors
            </h2>

            <p className="leading-8">
              Civil engineers and contractors need quick quantity calculation for
              flooring and finishing work. CivilCalc Pro Tile Calculator is designed
              for practical construction use. It helps users calculate tile quantity,
              floor area and wastage without using repeated manual calculations.
            </p>

            <p className="mt-4 leading-8">
              Whether you are preparing BOQ, checking contractor bills, planning tile
              purchase or estimating flooring cost, this calculator helps you get
              quick and clear results.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Benefits of CivilCalc Pro Tile Calculator
            </h2>

            <ul className="list-disc space-y-2 pl-6 leading-8">
              <li>Fast floor tile quantity calculation</li>
              <li>Useful for wall tile and bathroom tile estimation</li>
              <li>Calculates total tile area and number of tiles</li>
              <li>Adds wastage for cutting and breakage</li>
              <li>Useful for BOQ preparation and billing</li>
              <li>Reduces material shortage and extra wastage</li>
              <li>Helpful for engineers, contractors and homeowners</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">Conclusion</h2>

            <p className="leading-8">
              Tile quantity calculation is an important part of flooring and finishing
              work. CivilCalc Pro Tile Calculator helps civil engineers, contractors,
              builders and homeowners calculate number of tiles, total area and
              wastage quickly.
            </p>

            <p className="mt-4 leading-8">
              For better tile purchase planning, BOQ preparation and flooring
              estimation, use CivilCalc Pro Tile Calculator before starting tile work
              on site.
            </p>
          </section>

          <div className="rounded-3xl border border-orange-500/30 bg-gradient-to-br from-orange-500/15 to-slate-900 p-6">
            <h2 className="text-2xl font-extrabold text-white">
              Calculate Tile Quantity Instantly
            </h2>

            <p className="mt-3 leading-8 text-slate-300">
              Open CivilCalc Pro Tile Calculator and calculate floor tiles, wall
              tiles, total area and wastage for your construction project.
            </p>

            <Link
              href="/dashboard/calculators/tile"
              className="mt-5 inline-flex rounded-xl bg-orange-500 px-6 py-3 font-bold text-white transition hover:bg-orange-600"
            >
              Use Tile Calculator
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
