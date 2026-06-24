import Link from "next/link";

export const metadata = {
  title: 'Brickwork Calculator | Brick Quantity & Mortar Estimation | CivilCalc Pro',
  description:
    'Free online brickwork calculator for civil engineers and contractors. Calculate number of bricks, wall volume, mortar quantity, cement, sand and brickwork material estimation.',
  alternates: {
    canonical: 'https://civilcalcpro.in/brickwork-calculator',
  },
  openGraph: {
    title: 'Brickwork Calculator | Brick Quantity & Mortar Estimation | CivilCalc Pro',
    description:
      'Free online brickwork calculator for civil engineers and contractors. Calculate number of bricks, wall volume, mortar quantity, cement, sand and brickwork material estimation.',
    url: 'https://civilcalcpro.in/brickwork-calculator',
    siteName: 'CivilCalc Pro',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Brickwork Calculator | Brick Quantity & Mortar Estimation | CivilCalc Pro',
    description:
      'Free online brickwork calculator for civil engineers and contractors. Calculate number of bricks, wall volume, mortar quantity, cement, sand and brickwork material estimation.',
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

export default function BrickworkCalculatorPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-16">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-5xl font-bold mb-6">
          Brickwork Calculator
        </h1>

        <p className="text-slate-300 text-lg mb-10">
          Free online brickwork calculator for civil engineers, contractors,
          and students. Calculate number of bricks, wall volume, mortar quantity,
          cement, sand, and brickwork material estimation.
        </p>

        <Link
          href="/login?redirect=/dashboard/calculators/brickwork"
          className="inline-block bg-orange-500 hover:bg-orange-600 transition px-6 py-3 rounded-xl font-semibold mb-16"
        >
          Open Brickwork Calculator
        </Link>

        <div className="grid md:grid-cols-2 gap-10">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">Features</h2>

            <ul className="space-y-3 text-slate-300">
              <li>• Brick quantity calculation</li>
              <li>• Wall volume calculation</li>
              <li>• Mortar quantity estimation</li>
              <li>• Cement and sand estimation</li>
              <li>• Brickwork material analysis</li>
              <li>• Construction cost planning</li>
            </ul>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">
              Why Use CivilCalc Pro?
            </h2>

            <p className="text-slate-300 leading-8">
              CivilCalc Pro helps engineers and contractors calculate brickwork
              quantities quickly using professional construction estimation
              tools. Useful for site engineers, quantity surveyors, contractors,
              and construction professionals.
            </p>
          </div>
        </div>
      </div>

      <section className="mt-16 space-y-8">
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4">
            Brickwork Volume Formula
          </h2>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-orange-400 font-mono text-lg">
            Wall Volume = Length × Height × Thickness
          </div>

          <p className="text-slate-300 mt-4">
            Brickwork quantity is calculated from wall volume, brick size, mortar
            thickness, and wastage allowance.
          </p>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4">
            What is a Brickwork Calculator?
          </h2>

          <p className="text-slate-300 leading-7 mb-4">
            A Brickwork Calculator is used to estimate the number of bricks,
            mortar quantity, cement, and sand required for wall construction.
            Civil engineers and contractors use brickwork calculations for
            quantity estimation, billing, procurement, and BOQ preparation.
          </p>

          <p className="text-slate-300 leading-7">
            Accurate brickwork estimation helps reduce material wastage, improve
            project budgeting, and plan construction work more efficiently.
          </p>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4">
            Brickwork Calculation Steps
          </h2>

          <ul className="list-disc pl-6 space-y-2 text-slate-300">
            <li>Measure wall length</li>
            <li>Measure wall height</li>
            <li>Select wall thickness</li>
            <li>Calculate total wall volume</li>
            <li>Deduct openings such as doors and windows</li>
            <li>Calculate number of bricks</li>
            <li>Calculate mortar quantity</li>
            <li>Estimate cement and sand requirement</li>
          </ul>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4">
            Brickwork Calculation Example
          </h2>

          <p className="text-slate-300 leading-7">
            Consider a brick wall with:
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
            Benefits of Brickwork Estimation
          </h2>

          <ul className="list-disc pl-6 space-y-2 text-slate-300">
            <li>Reduces brick and mortar wastage</li>
            <li>Improves construction budgeting</li>
            <li>Helps in material procurement</li>
            <li>Supports contractor billing</li>
            <li>Useful for BOQ preparation</li>
            <li>Improves site planning and execution</li>
          </ul>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4">
            Related Calculators
          </h2>

          <ul className="list-disc pl-6 space-y-2 text-slate-300">
            <li><a href="/plaster-calculator">Plaster Calculator</a></li>
            <li><a href="/concrete-volume-calculator">Concrete Volume Calculator</a></li>
            <li><a href="/excavation-calculator">Excavation Calculator</a></li>
            <li><a href="/steel-weight-calculator">Steel Weight Calculator</a></li>
            <li><a href="/footing-design">Footing Design Calculator</a></li>
          </ul>
        </div>
      </section>
    </main>
  );
}
