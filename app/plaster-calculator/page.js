import Link from "next/link";

export const metadata = {
  title: 'Plaster Calculator | Cement Sand Quantity | CivilCalc Pro',
  description:
    'Free online plaster calculator to calculate plaster area, cement bags, sand quantity and cost for internal and external wall plaster work.',
  alternates: {
    canonical: 'https://civilcalcpro.in/plaster-calculator',
  },
  openGraph: {
    title: 'Plaster Calculator | Cement Sand Quantity | CivilCalc Pro',
    description:
      'Free online plaster calculator to calculate plaster area, cement bags, sand quantity and cost for internal and external wall plaster work.',
    url: 'https://civilcalcpro.in/plaster-calculator',
    siteName: 'CivilCalc Pro',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Plaster Calculator | Cement Sand Quantity | CivilCalc Pro',
    description:
      'Free online plaster calculator to calculate plaster area, cement bags, sand quantity and cost for internal and external wall plaster work.',
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

export default function PlasterCalculatorPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-16">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-5xl font-bold mb-6">
          Plaster Work Calculator
        </h1>

        <p className="text-slate-300 text-lg mb-10">
          Free online plaster work calculator for civil engineers,
          contractors, and students. Calculate plaster area, cement quantity,
          sand quantity, plaster thickness, and construction material estimation.
        </p>

        <Link
          href="/login?redirect=/dashboard/calculators/plaster"
          className="inline-block bg-orange-500 hover:bg-orange-600 transition px-6 py-3 rounded-xl font-semibold mb-16"
        >
          Open Plaster Calculator
        </Link>

        <div className="grid md:grid-cols-2 gap-10">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">Features</h2>

            <ul className="space-y-3 text-slate-300">
              <li>• Wall plaster area calculation</li>
              <li>• Cement quantity estimation</li>
              <li>• Sand quantity estimation</li>
              <li>• Plaster thickness calculation</li>
              <li>• Material quantity analysis</li>
              <li>• Construction cost planning</li>
            </ul>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">
              Why Use CivilCalc Pro?
            </h2>

            <p className="text-slate-300 leading-8">
              CivilCalc Pro helps engineers and contractors calculate plaster
              quantities quickly using professional construction estimation
              tools. Ideal for site engineers, quantity surveyors,
              contractors, and students.
            </p>
          </div>
        </div>
      </div>

      <section className="mt-16">
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4">
            Plaster Work Formula
          </h2>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-orange-400 font-mono text-lg">
            Area = Length × Height
          </div>

          <p className="text-slate-300 mt-4">
            Plaster calculator estimates cement and sand quantity for wall plastering.
          </p>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4">
            What is a Plaster Work Calculator?
          </h2>

          <p className="text-slate-300 leading-7 mb-4">
            A Plaster Work Calculator is used to estimate the quantity of cement,
            sand and mortar required for wall and ceiling plastering. Civil engineers,
            contractors and quantity surveyors use plaster calculations for accurate
            material estimation and project planning.
          </p>

          <p className="text-slate-300 leading-7">
            Accurate plaster estimation helps reduce material wastage and improves
            construction cost control.
          </p>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4">
            Types of Plaster Work
          </h2>

          <ul className="list-disc pl-6 space-y-2 text-slate-300">
            <li>Internal Wall Plaster</li>
            <li>External Wall Plaster</li>
            <li>Ceiling Plaster</li>
            <li>Cement Plaster</li>
            <li>Gypsum Plaster</li>
            <li>Decorative Plaster</li>
          </ul>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4">
            Plaster Quantity Calculation Example
          </h2>

          <p className="text-slate-300 leading-7">
            Consider a wall having:
          </p>

          <ul className="list-disc pl-6 space-y-2 text-slate-300 mt-4">
            <li>Length = 5 m</li>
            <li>Height = 3 m</li>
            <li>Thickness = 12 mm</li>
          </ul>

          <p className="text-slate-300 leading-7 mt-4">
            Area = Length × Height
            <br />
            Area = 5 × 3
            <br />
            Area = 15 m²
          </p>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4">
            Benefits of Accurate Plaster Estimation
          </h2>

          <ul className="list-disc pl-6 space-y-2 text-slate-300">
            <li>Reduces material wastage</li>
            <li>Improves project budgeting</li>
            <li>Speeds up site planning</li>
            <li>Supports quantity surveying</li>
            <li>Improves procurement planning</li>
            <li>Enhances construction efficiency</li>
          </ul>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4">
            Related Calculators
          </h2>

          <ul className="list-disc pl-6 space-y-2 text-slate-300">
            <li><a href="/brickwork-calculator">Brickwork Calculator</a></li>
            <li><a href="/excavation-calculator">Excavation Calculator</a></li>
            <li><a href="/concrete-volume-calculator">Concrete Volume Calculator</a></li>
            <li><a href="/steel-weight-calculator">Steel Weight Calculator</a></li>
            <li><a href="/footing-design">Footing Design Calculator</a></li>
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
