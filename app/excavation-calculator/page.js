import Link from "next/link";

export const metadata = {
  title: 'Excavation Calculator | Earthwork Quantity | CivilCalc Pro',
  description:
    'Free online excavation calculator for civil engineers and contractors. Calculate earthwork quantity, excavation volume, cutting volume, filling volume and construction cost estimation.',
  alternates: {
    canonical: 'https://civilcalcpro.in/excavation-calculator',
  },
  openGraph: {
    title: 'Excavation Calculator | Earthwork Quantity | CivilCalc Pro',
    description:
      'Free online excavation calculator for civil engineers and contractors. Calculate earthwork quantity, excavation volume, cutting volume, filling volume and construction cost estimation.',
    url: 'https://civilcalcpro.in/excavation-calculator',
    siteName: 'CivilCalc Pro',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Excavation Calculator | Earthwork Quantity | CivilCalc Pro',
    description:
      'Free online excavation calculator for civil engineers and contractors. Calculate earthwork quantity, excavation volume, cutting volume, filling volume and construction cost estimation.',
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

export default function ExcavationCalculatorPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-16">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-5xl font-bold mb-6">
          Excavation Calculator
        </h1>

        <p className="text-slate-300 text-lg mb-10">
          Free online excavation calculator for civil engineers, contractors,
          and site engineers. Calculate earthwork quantity, excavation volume,
          cutting volume, filling volume, and construction cost estimation.
        </p>

        <Link
          href="/login?redirect=/dashboard/calculators/excavation"
          className="inline-block bg-orange-500 hover:bg-orange-600 transition px-6 py-3 rounded-xl font-semibold mb-16"
        >
          Open Excavation Calculator
        </Link>

        <div className="grid md:grid-cols-2 gap-10">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">Features</h2>

            <ul className="space-y-3 text-slate-300">
              <li>• Excavation volume calculation</li>
              <li>• Earthwork quantity estimation</li>
              <li>• Cutting and filling volume calculation</li>
              <li>• Foundation excavation planning</li>
              <li>• Construction cost estimation</li>
              <li>• Site quantity analysis</li>
            </ul>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">
              Why Use CivilCalc Pro?
            </h2>

            <p className="text-slate-300 leading-8">
              CivilCalc Pro helps engineers and contractors calculate excavation
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
            Excavation Volume Formula
          </h2>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-orange-400 font-mono text-lg">
            Volume = Length × Width × Depth
          </div>

          <p className="text-slate-300 mt-4">
            Excavation quantity is generally calculated by multiplying length,
            width, and depth of the excavated area.
          </p>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4">
            What is an Excavation Calculator?
          </h2>

          <p className="text-slate-300 leading-7 mb-4">
            An Excavation Calculator is used to estimate the quantity of earthwork
            required for foundations, trenches, basements, pits, roadwork, and
            site preparation. It helps civil engineers and contractors calculate
            excavation volume before starting construction work.
          </p>

          <p className="text-slate-300 leading-7">
            Accurate excavation quantity estimation helps control project cost,
            plan machinery, estimate labour, and reduce material handling errors
            at construction sites.
          </p>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4">
            Common Uses of Excavation Calculation
          </h2>

          <ul className="list-disc pl-6 space-y-2 text-slate-300">
            <li>Foundation excavation</li>
            <li>Trench excavation</li>
            <li>Basement excavation</li>
            <li>Road cutting and filling</li>
            <li>Pipeline trench work</li>
            <li>Site leveling and earthwork estimation</li>
          </ul>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4">
            Excavation Calculation Example
          </h2>

          <p className="text-slate-300 leading-7">
            Consider an excavation pit with:
          </p>

          <ul className="list-disc pl-6 space-y-2 text-slate-300 mt-4">
            <li>Length = 10 m</li>
            <li>Width = 5 m</li>
            <li>Depth = 2 m</li>
          </ul>

          <p className="text-slate-300 leading-7 mt-4">
            Excavation Volume = Length × Width × Depth
            <br />
            Volume = 10 × 5 × 2
            <br />
            Volume = 100 m³
          </p>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4">
            Benefits of Accurate Excavation Estimation
          </h2>

          <ul className="list-disc pl-6 space-y-2 text-slate-300">
            <li>Improves earthwork cost estimation</li>
            <li>Helps plan labour and machinery</li>
            <li>Reduces site measurement errors</li>
            <li>Supports contractor billing and BOQ preparation</li>
            <li>Improves project scheduling</li>
            <li>Reduces wastage and rework</li>
          </ul>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4">
            Related Calculators
          </h2>

          <ul className="list-disc pl-6 space-y-2 text-slate-300">
            <li><a href="/concrete-volume-calculator">Concrete Volume Calculator</a></li>
            <li><a href="/footing-design">Footing Design Calculator</a></li>
            <li><a href="/brickwork-calculator">Brickwork Calculator</a></li>
            <li><a href="/plaster-calculator">Plaster Calculator</a></li>
            <li><a href="/steel-weight-calculator">Steel Weight Calculator</a></li>
          </ul>
        </div>
                        <div className="mt-10 text-center">
            <Link
              href="/civil-engineering-calculators"
              className="inline-block border border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white transition px-6 py-3 rounded-xl font-semibold"
            >
              View All Civil Engineering Calculators
            </Link>
          </div>
      </section>
    </main>
  );
}
