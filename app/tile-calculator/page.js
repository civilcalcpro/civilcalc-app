import Link from 'next/link'

export const metadata = {
  title:
    'Tile Calculator | Floor & Wall Tile Quantity Calculator | CivilCalc Pro',
  description:
    'Use CivilCalc Pro Tile Calculator to estimate floor tiles, wall tiles, tile area, number of tiles, wastage, boxes and material quantity for construction and interior work.',
  alternates: {
    canonical: 'https://civilcalcpro.in/tile-calculator',
  },
  openGraph: {
    title: 'Tile Calculator | Floor & Wall Tile Quantity Calculator',
    description:
      'Calculate floor and wall tile quantity with area, tile size, wastage, boxes and practical construction examples.',
    url: 'https://civilcalcpro.in/tile-calculator',
    siteName: 'CivilCalc Pro',
    type: 'article',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tile Calculator | Floor & Wall Tile Quantity Calculator',
    description:
      'Estimate tiles required for floors and walls with tile size, room area, wastage and box quantity.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
}

const pageUrl = 'https://civilcalcpro.in/tile-calculator'

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is a tile calculator?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'A tile calculator helps estimate the number of tiles required for floor or wall work based on room area, tile size, wastage percentage and tile box quantity.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do you calculate number of tiles required?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'Number of tiles required is calculated by dividing the total area by the area of one tile. Wastage is then added for cutting, breakage and site adjustment.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the formula for tile quantity?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'Tile quantity formula is: Number of tiles = Total area / Area of one tile. Final quantity = Number of tiles + wastage percentage.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much tile wastage should be added?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'For normal tile work, 5% to 10% wastage is commonly added. For diagonal patterns, complex layouts or small cut pieces, higher wastage may be required.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can tile calculator be used for wall tiles?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'Yes, a tile calculator can be used for both floor tiles and wall tiles by entering the correct length, height or area of the surface.',
      },
    },
  ],
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'TechArticle',
  headline: 'Tile Calculator for Floor and Wall Tile Quantity Estimation',
  description:
    'A practical guide to tile quantity calculation for floors and walls including area calculation, tile size, wastage, boxes and civil engineering examples.',
  mainEntityOfPage: pageUrl,
  url: pageUrl,
  author: {
    '@type': 'Organization',
    name: 'CivilCalc Pro',
    url: 'https://civilcalcpro.in',
  },
  publisher: {
    '@type': 'Organization',
    name: 'CivilCalc Pro',
    url: 'https://civilcalcpro.in',
  },
  about: [
    'Tile calculator',
    'Floor tile quantity',
    'Wall tile quantity',
    'Construction material estimation',
    'Interior work estimation',
  ],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://civilcalcpro.in',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Civil Engineering Calculators',
      item: 'https://civilcalcpro.in/civil-engineering-calculators',
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'Tile Calculator',
      item: pageUrl,
    },
  ],
}

export default function TileCalculatorPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      <div className="max-w-6xl mx-auto">
        <p className="text-orange-400 font-semibold mb-3">
          FLOORING ESTIMATION TOOL
        </p>

        <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
          Tile Calculator
        </h1>

        <p className="text-slate-300 text-lg lg:text-xl mb-8 leading-8 max-w-4xl">
          Use the Tile Calculator to estimate floor tile and wall tile quantity
          with room area, tile size, wastage percentage, number of tiles and tile
          boxes. This guide is useful for civil engineers, contractors,
          interior contractors, site engineers and homeowners.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Link
            href="/dashboard/calculators/tile"
            className="bg-orange-500 hover:bg-orange-600 transition px-6 py-4 rounded-xl font-semibold text-center"
          >
            Open Tile Calculator Tool
          </Link>

          <Link
            href="/home-construction-cost-calculator"
            className="bg-slate-900 hover:bg-slate-800 border border-slate-700 transition px-6 py-4 rounded-xl font-semibold text-center"
          >
            Home Construction Cost Calculator
          </Link>
        </div>

        <section className="bg-orange-500/10 border border-orange-500/30 rounded-2xl p-6 lg:p-8 mb-10">
          <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">
            Quick Answer
          </h2>

          <p className="text-slate-200 leading-8 text-lg">
            A <strong>tile calculator</strong> estimates the number of tiles
            required by dividing the total surface area by the area of one tile.
            After that, wastage is added for cutting, breakage and site
            adjustment. It can be used for both floor tiles and wall tiles.
          </p>
        </section>

        <section className="space-y-8">
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              What is a Tile Calculator?
            </h2>

            <p className="text-slate-300 leading-7">
              A tile calculator is a construction estimation tool used to
              calculate how many tiles are required for a floor, wall, bathroom,
              kitchen, parking area, balcony or any tiled surface. It helps
              reduce material shortage, over-ordering and cost estimation errors
              before starting tile work.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Tile Quantity Formula
            </h2>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 mb-5">
              <p className="text-slate-200 font-mono leading-8">
                Total Area = Length × Width
                <br />
                Area of One Tile = Tile Length × Tile Width
                <br />
                Number of Tiles = Total Area / Area of One Tile
                <br />
                Final Tiles = Number of Tiles + Wastage
              </p>
            </div>

            <p className="text-slate-300 leading-7">
              For wall tiles, use wall length and wall height to calculate wall
              area. For floor tiles, use room length and room width to calculate
              floor area.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 overflow-x-auto">
            <h2 className="text-2xl font-bold text-white mb-4">
              Common Tile Calculation Inputs
            </h2>

            <table className="w-full border-collapse text-left text-slate-300">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="py-3 pr-4 text-white">Input</th>
                  <th className="py-3 pr-4 text-white">Meaning</th>
                  <th className="py-3 pr-4 text-white">Example</th>
                </tr>
              </thead>

              <tbody>
                <tr className="border-b border-slate-800">
                  <td className="py-3 pr-4">Surface Length</td>
                  <td className="py-3 pr-4">Length of floor or wall</td>
                  <td className="py-3 pr-4">Room length = 12 ft</td>
                </tr>

                <tr className="border-b border-slate-800">
                  <td className="py-3 pr-4">Surface Width / Height</td>
                  <td className="py-3 pr-4">
                    Width for floor or height for wall
                  </td>
                  <td className="py-3 pr-4">Room width = 10 ft</td>
                </tr>

                <tr className="border-b border-slate-800">
                  <td className="py-3 pr-4">Tile Size</td>
                  <td className="py-3 pr-4">Length and width of one tile</td>
                  <td className="py-3 pr-4">2 ft × 2 ft</td>
                </tr>

                <tr className="border-b border-slate-800">
                  <td className="py-3 pr-4">Wastage</td>
                  <td className="py-3 pr-4">
                    Extra tiles for cutting and breakage
                  </td>
                  <td className="py-3 pr-4">5% to 10%</td>
                </tr>

                <tr>
                  <td className="py-3 pr-4">Tiles per Box</td>
                  <td className="py-3 pr-4">Number of tiles in one box</td>
                  <td className="py-3 pr-4">4 tiles per box</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4">
                Floor Tile Calculation
              </h2>

              <p className="text-slate-300 leading-7">
                Floor tile calculation is used for bedrooms, halls, kitchens,
                bathrooms, balconies, parking areas and commercial spaces. The
                floor area is calculated using length and width, then divided by
                the area of one tile.
              </p>
            </div>

            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4">
                Wall Tile Calculation
              </h2>

              <p className="text-slate-300 leading-7">
                Wall tile calculation is commonly used for bathrooms, kitchens
                and dado work. The wall area is calculated using wall length and
                height. Door and window openings can be deducted if required.
              </p>
            </div>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Practical Example
            </h2>

            <p className="text-slate-300 leading-7 mb-4">
              Suppose a room size is 12 ft × 10 ft and tile size is 2 ft × 2 ft.
            </p>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
              <p className="text-slate-300 leading-8 font-mono">
                Floor Area = 12 × 10 = 120 sq ft
                <br />
                One Tile Area = 2 × 2 = 4 sq ft
                <br />
                Tiles Required = 120 / 4 = 30 tiles
                <br />
                Add 10% Wastage = 3 tiles
                <br />
                Final Quantity = 33 tiles
              </p>
            </div>

            <p className="text-slate-300 leading-7 mt-4">
              If one box contains 4 tiles, then boxes required = 33 / 4 = 8.25,
              so you should order 9 boxes.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Recommended Wastage for Tile Work
            </h2>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
                <h3 className="font-semibold text-orange-400 mb-2">
                  Simple Layout
                </h3>
                <p className="text-slate-200 text-2xl font-bold">5%</p>
                <p className="text-slate-400 mt-2 text-sm">
                  Normal rectangular room
                </p>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
                <h3 className="font-semibold text-orange-400 mb-2">
                  Normal Work
                </h3>
                <p className="text-slate-200 text-2xl font-bold">10%</p>
                <p className="text-slate-400 mt-2 text-sm">
                  Common site practice
                </p>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
                <h3 className="font-semibold text-orange-400 mb-2">
                  Complex Layout
                </h3>
                <p className="text-slate-200 text-2xl font-bold">12%–15%</p>
                <p className="text-slate-400 mt-2 text-sm">
                  Diagonal pattern or many cuts
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-5">
              Frequently Asked Questions
            </h2>

            <div className="space-y-5">
              <div>
                <h3 className="font-semibold text-white mb-2">
                  What is a tile calculator?
                </h3>
                <p className="text-slate-300 leading-7">
                  A tile calculator estimates the number of tiles required for a
                  floor or wall surface based on area, tile size and wastage.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-2">
                  How do you calculate tiles required?
                </h3>
                <p className="text-slate-300 leading-7">
                  Calculate total area, calculate one tile area, then divide
                  total area by one tile area. Add wastage to get final
                  quantity.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-2">
                  How much wastage should be added for tiles?
                </h3>
                <p className="text-slate-300 leading-7">
                  Usually 5% to 10% wastage is added. For diagonal or complex
                  layouts, 12% to 15% may be required.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-2">
                  Can this be used for wall tiles?
                </h3>
                <p className="text-slate-300 leading-7">
                  Yes, the same method can be used for wall tiles by calculating
                  wall area using wall length and height.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Related Calculators
            </h2>

            <ul className="grid md:grid-cols-2 gap-3 text-slate-300">
              <li>
                <Link
                  href="/home-construction-cost-calculator"
                  className="text-orange-400 hover:text-orange-300"
                >
                  Home Construction Cost Calculator
                </Link>
              </li>
              <li>
                <Link
                  href="/plaster-calculator"
                  className="text-orange-400 hover:text-orange-300"
                >
                  Plaster Calculator
                </Link>
              </li>
              <li>
                <Link
                  href="/paint-calculator"
                  className="text-orange-400 hover:text-orange-300"
                >
                  Paint Calculator
                </Link>
              </li>
              <li>
                <Link
                  href="/unit-converter"
                  className="text-orange-400 hover:text-orange-300"
                >
                  Unit Converter
                </Link>
              </li>
              <li>
                <Link
                  href="/boq-generator"
                  className="text-orange-400 hover:text-orange-300"
                >
                  BOQ Generator
                </Link>
              </li>
              <li>
                <Link
                  href="/civil-engineering-calculators"
                  className="text-orange-400 hover:text-orange-300"
                >
                  All Civil Engineering Calculators
                </Link>
              </li>
            </ul>
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/dashboard/calculators/tile"
              className="inline-block border border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white transition px-6 py-3 rounded-xl font-semibold"
            >
              Open Tile Calculator Tool
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}
