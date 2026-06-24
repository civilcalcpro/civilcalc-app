import Link from "next/link";

export const metadata = {
  title: 'How to Calculate Brickwork Quantity | Brick Calculation Guide | CivilCalc Pro',
  description:
    'Learn how to calculate brickwork quantity, number of bricks, wall volume, mortar quantity, cement and sand requirement with practical examples.',
  alternates: {
    canonical: 'https://civilcalcpro.in/how-to-calculate-brickwork-quantity',
  },
  openGraph: {
    title: 'How to Calculate Brickwork Quantity | Brick Calculation Guide | CivilCalc Pro',
    description:
      'Learn how to calculate brickwork quantity, number of bricks, wall volume, mortar quantity, cement and sand requirement with practical examples.',
    url: 'https://civilcalcpro.in/how-to-calculate-brickwork-quantity',
    siteName: 'CivilCalc Pro',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How to Calculate Brickwork Quantity | Brick Calculation Guide | CivilCalc Pro',
    description:
      'Learn how to calculate brickwork quantity, number of bricks, wall volume, mortar quantity, cement and sand requirement with practical examples.',
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

export default function HowToCalculateBrickworkQuantityPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-16">
      <div className="max-w-5xl mx-auto">
        <p className="text-orange-400 font-semibold mb-3">
          BRICKWORK QUANTITY GUIDE
        </p>

        <h1 className="text-5xl font-bold mb-6">
          How to Calculate Brickwork Quantity
        </h1>

        <p className="text-slate-300 text-lg mb-10">
          Learn how to calculate brickwork quantity, number of bricks, wall
          volume, mortar quantity, cement requirement, sand requirement and
          brickwork material estimation with practical construction examples.
        </p>

        <Link
          href="/brickwork-calculator"
          className="inline-block bg-orange-500 hover:bg-orange-600 transition px-6 py-3 rounded-xl font-semibold mb-16"
        >
          Open Brickwork Calculator
        </Link>

        <section className="space-y-8">
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Brickwork Quantity Formula
            </h2>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-orange-400 font-mono text-lg">
              Wall Volume = Length × Height × Thickness
            </div>

            <p className="text-slate-300 mt-4 leading-7">
              Brickwork quantity is calculated using wall volume, brick size,
              mortar thickness, openings deduction and wastage allowance.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              What is Brickwork Quantity Calculation?
            </h2>

            <p className="text-slate-300 leading-7 mb-4">
              Brickwork quantity calculation is the process of estimating the
              number of bricks, mortar volume, cement and sand required for wall
              construction. It is commonly used by civil engineers, contractors,
              quantity surveyors and site engineers.
            </p>

            <p className="text-slate-300 leading-7">
              Accurate brickwork estimation helps reduce material wastage,
              improve construction budgeting and prepare BOQ for masonry work.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Steps to Calculate Brickwork Quantity
            </h2>

            <ul className="list-disc pl-6 space-y-2 text-slate-300">
              <li>Measure wall length</li>
              <li>Measure wall height</li>
              <li>Select wall thickness</li>
              <li>Calculate gross wall volume</li>
              <li>Deduct openings for doors and windows</li>
              <li>Calculate brick volume with mortar</li>
              <li>Calculate number of bricks</li>
              <li>Calculate mortar quantity</li>
              <li>Estimate cement and sand requirement</li>
            </ul>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Standard Brick Size
            </h2>

            <p className="text-slate-300 leading-7">
              Standard modular brick size is commonly taken as 190 mm × 90 mm ×
              90 mm without mortar. With mortar, the nominal brick size is often
              considered as 200 mm × 100 mm × 100 mm.
            </p>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-orange-400 font-mono text-lg mt-4">
              Nominal Brick Volume = 0.2 × 0.1 × 0.1 = 0.002 m³
            </div>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Brickwork Calculation Example
            </h2>

            <p className="text-slate-300 leading-7">
              Consider a wall with:
            </p>

            <ul className="list-disc pl-6 space-y-2 text-slate-300 mt-4">
              <li>Length = 5 m</li>
              <li>Height = 3 m</li>
              <li>Thickness = 0.23 m</li>
            </ul>

            <p className="text-slate-300 leading-7 mt-4">
              Wall Volume = Length × Height × Thickness
              <br />
              Wall Volume = 5 × 3 × 0.23
              <br />
              Wall Volume = 3.45 m³
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Number of Bricks Calculation
            </h2>

            <p className="text-slate-300 leading-7">
              Number of bricks can be calculated by dividing wall volume by
              nominal brick volume.
            </p>

            <p className="text-slate-300 leading-7 mt-4">
              Number of Bricks = Wall Volume / Brick Volume
              <br />
              Number of Bricks = 3.45 / 0.002
              <br />
              Number of Bricks = 1725 bricks
            </p>

            <p className="text-slate-300 leading-7 mt-4">
              Add 5% to 10% wastage depending on site condition and brick quality.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Mortar Quantity for Brickwork
            </h2>

            <p className="text-slate-300 leading-7">
              Mortar quantity is calculated by subtracting total brick volume
              from wall volume. Cement and sand are then calculated based on the
              selected mortar ratio such as 1:4, 1:5 or 1:6.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Benefits of Brickwork Quantity Estimation
            </h2>

            <ul className="list-disc pl-6 space-y-2 text-slate-300">
              <li>Helps calculate exact number of bricks</li>
              <li>Improves cement and sand estimation</li>
              <li>Reduces material wastage</li>
              <li>Supports contractor billing</li>
              <li>Useful for BOQ preparation</li>
              <li>Improves project cost control</li>
            </ul>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Related Calculators
            </h2>

            <ul className="list-disc pl-6 space-y-2 text-slate-300">
              <li><a href="/brickwork-calculator">Brickwork Calculator</a></li>
              <li><a href="/plaster-calculator">Plaster Calculator</a></li>
              <li><a href="/concrete-volume-calculator">Concrete Volume Calculator</a></li>
              <li><a href="/excavation-calculator">Excavation Calculator</a></li>
              <li><a href="/steel-weight-calculator">Steel Weight Calculator</a></li>
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}
