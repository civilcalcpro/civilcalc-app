import Link from "next/link";

export const metadata = {
  title: 'Steel Weight Calculator | Bar Weight Formula | CivilCalc Pro',
  description:
    'Free online steel weight calculator using D²/162 formula. Calculate reinforcement bar weight for 6mm, 8mm, 10mm, 12mm, 16mm, 20mm and more.',
  alternates: {
    canonical: 'https://civilcalcpro.in/steel-weight-calculator',
  },
  openGraph: {
    title: 'Steel Weight Calculator | Bar Weight Formula | CivilCalc Pro',
    description:
      'Free online steel weight calculator using D²/162 formula. Calculate reinforcement bar weight for 6mm, 8mm, 10mm, 12mm, 16mm, 20mm and more.',
    url: 'https://civilcalcpro.in/steel-weight-calculator',
    siteName: 'CivilCalc Pro',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Steel Weight Calculator | Bar Weight Formula | CivilCalc Pro',
    description:
      'Free online steel weight calculator using D²/162 formula. Calculate reinforcement bar weight for 6mm, 8mm, 10mm, 12mm, 16mm, 20mm and more.',
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

export default function SteelWeightCalculatorPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-16">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-5xl font-bold mb-6">
          Steel Weight Calculator
        </h1>

        <p className="text-slate-300 text-lg mb-10">
          Free online steel weight calculator for civil engineers,
          contractors, and students. Calculate TMT bar weight,
          reinforcement steel quantity, and steel estimation instantly.
        </p>

        <Link
          href="/login?redirect=/dashboard/calculators/steel-weight"
          className="inline-block bg-orange-500 hover:bg-orange-600 transition px-6 py-3 rounded-xl font-semibold mb-16"
        >
          Open Steel Weight Calculator
        </Link>

        <div className="grid md:grid-cols-2 gap-10">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">Features</h2>

            <ul className="space-y-3 text-slate-300">
              <li>• TMT bar weight calculation</li>
              <li>• Reinforcement steel estimation</li>
              <li>• Steel quantity analysis</li>
              <li>• Construction material estimation</li>
              <li>• Fast engineering calculations</li>
              <li>• Site quantity planning</li>
            </ul>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">
              Why Use CivilCalc Pro?
            </h2>

            <p className="text-slate-300 leading-8">
              CivilCalc Pro helps engineers and contractors calculate
              reinforcement steel quantities quickly using professional
              construction estimation tools. Ideal for quantity surveyors,
              site engineers, and students.
            </p>
          </div>
        </div>
      </div>

      <section className="mt-16">
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4">
            Steel Weight Formula
          </h2>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-orange-400 font-mono text-lg">
            Weight = D² / 162
          </div>

          <p className="text-slate-300 mt-4">
            Steel weight calculator is used for reinforcement quantity estimation.
          </p>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4">
            What is a Steel Weight Calculator?
          </h2>

          <p className="text-slate-300 leading-7 mb-4">
            A Steel Weight Calculator is used to determine the weight of
            reinforcement bars used in RCC construction. Civil engineers,
            contractors and quantity surveyors use steel weight calculations
            for estimation, procurement and project planning.
          </p>

          <p className="text-slate-300 leading-7">
            Accurate steel estimation helps reduce material wastage and improves
            project cost control.
          </p>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4">
            Common TMT Bar Sizes
          </h2>

          <ul className="list-disc pl-6 space-y-2 text-slate-300">
            <li>6 mm TMT Bar</li>
            <li>8 mm TMT Bar</li>
            <li>10 mm TMT Bar</li>
            <li>12 mm TMT Bar</li>
            <li>16 mm TMT Bar</li>
            <li>20 mm TMT Bar</li>
            <li>25 mm TMT Bar</li>
            <li>32 mm TMT Bar</li>
          </ul>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4">
            Steel Weight Calculation Example
          </h2>

          <p className="text-slate-300 leading-7">
            For a 12 mm diameter reinforcement bar:
          </p>

          <p className="text-slate-300 leading-7 mt-4">
            Weight per meter = D² / 162
            <br />
            = 12² / 162
            <br />
            = 0.89 kg/m
          </p>

          <p className="text-slate-300 leading-7 mt-4">
            Therefore a 12 mm bar of 10 m length weighs approximately 8.9 kg.
          </p>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4">
            Uses of Steel Weight Calculation
          </h2>

          <ul className="list-disc pl-6 space-y-2 text-slate-300">
            <li>RCC beam reinforcement estimation</li>
            <li>Column reinforcement calculation</li>
            <li>Footing reinforcement planning</li>
            <li>Slab steel quantity estimation</li>
            <li>Construction cost estimation</li>
            <li>Material procurement planning</li>
          </ul>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4">
            Related Calculators
          </h2>

          <ul className="list-disc pl-6 space-y-2 text-slate-300">
            <li><a href="/beam-design">Beam Design Calculator</a></li>
            <li><a href="/column-design">Column Design Calculator</a></li>
            <li><a href="/footing-design">Footing Design Calculator</a></li>
            <li><a href="/one-way-slab-calculator">One-Way Slab Calculator</a></li>
            <li><a href="/two-way-slab-calculator">Two-Way Slab Calculator</a></li>
          </ul>
        </div>
      </section>
    </main>
  );
}
