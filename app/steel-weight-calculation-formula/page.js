import Link from "next/link";

export const metadata = {
  title: 'Steel Weight Calculation Formula | D²/162 Formula | CivilCalc Pro',
  description:
    'Learn steel weight calculation formula D²/162 with TMT bar unit weight, reinforcement weight chart, bar diameter calculation and practical examples.',
  alternates: {
    canonical: 'https://civilcalcpro.in/steel-weight-calculation-formula',
  },
  openGraph: {
    title: 'Steel Weight Calculation Formula | D²/162 Formula | CivilCalc Pro',
    description:
      'Learn steel weight calculation formula D²/162 with TMT bar unit weight, reinforcement weight chart, bar diameter calculation and practical examples.',
    url: 'https://civilcalcpro.in/steel-weight-calculation-formula',
    siteName: 'CivilCalc Pro',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Steel Weight Calculation Formula | D²/162 Formula | CivilCalc Pro',
    description:
      'Learn steel weight calculation formula D²/162 with TMT bar unit weight, reinforcement weight chart, bar diameter calculation and practical examples.',
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

export default function SteelWeightCalculationFormulaPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-16">
      <div className="max-w-5xl mx-auto">
        <p className="text-orange-400 font-semibold mb-3">
          RCC STEEL CALCULATION GUIDE
        </p>

        <h1 className="text-5xl font-bold mb-6">
          Steel Weight Calculation Formula
        </h1>

        <p className="text-slate-300 text-lg mb-10">
          Learn steel weight calculation formula for TMT bars and reinforcement
          steel. Use the D²/162 formula to calculate unit weight of steel bars
          for RCC beams, columns, slabs, footings and construction estimation.
        </p>

        <Link
          href="/steel-weight-calculator"
          className="inline-block bg-orange-500 hover:bg-orange-600 transition px-6 py-3 rounded-xl font-semibold mb-16"
        >
          Open Steel Weight Calculator
        </Link>

        <section className="space-y-8">
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Steel Weight Formula
            </h2>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-orange-400 font-mono text-lg">
              Weight per meter = D² / 162
            </div>

            <p className="text-slate-300 mt-4 leading-7">
              Here, D is the diameter of the steel bar in millimeters. The result
              gives approximate steel weight in kg per meter.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              What is Steel Weight Calculation?
            </h2>

            <p className="text-slate-300 leading-7 mb-4">
              Steel weight calculation is used to estimate the quantity of
              reinforcement steel required in RCC construction. Civil engineers,
              contractors and quantity surveyors use steel weight calculation for
              beams, columns, slabs, footings and bar bending schedule work.
            </p>

            <p className="text-slate-300 leading-7">
              Accurate steel quantity estimation helps reduce wastage, improve
              procurement planning and control construction cost.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 overflow-x-auto">
            <h2 className="text-2xl font-bold text-white mb-4">
              Steel Bar Weight Chart
            </h2>

            <table className="w-full border-collapse text-left text-slate-300">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="py-3 pr-4 text-white">Bar Diameter</th>
                  <th className="py-3 pr-4 text-white">Weight per Meter</th>
                </tr>
              </thead>

              <tbody>
                <tr className="border-b border-slate-800">
                  <td className="py-3 pr-4">6 mm</td>
                  <td className="py-3 pr-4">0.22 kg/m</td>
                </tr>

                <tr className="border-b border-slate-800">
                  <td className="py-3 pr-4">8 mm</td>
                  <td className="py-3 pr-4">0.40 kg/m</td>
                </tr>

                <tr className="border-b border-slate-800">
                  <td className="py-3 pr-4">10 mm</td>
                  <td className="py-3 pr-4">0.62 kg/m</td>
                </tr>

                <tr className="border-b border-slate-800">
                  <td className="py-3 pr-4">12 mm</td>
                  <td className="py-3 pr-4">0.89 kg/m</td>
                </tr>

                <tr className="border-b border-slate-800">
                  <td className="py-3 pr-4">16 mm</td>
                  <td className="py-3 pr-4">1.58 kg/m</td>
                </tr>

                <tr className="border-b border-slate-800">
                  <td className="py-3 pr-4">20 mm</td>
                  <td className="py-3 pr-4">2.47 kg/m</td>
                </tr>

                <tr className="border-b border-slate-800">
                  <td className="py-3 pr-4">25 mm</td>
                  <td className="py-3 pr-4">3.86 kg/m</td>
                </tr>

                <tr className="border-b border-slate-800">
                  <td className="py-3 pr-4">32 mm</td>
                  <td className="py-3 pr-4">6.32 kg/m</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Steel Weight Calculation Example
            </h2>

            <p className="text-slate-300 leading-7">
              Consider a 12 mm diameter steel bar with length of 10 meters.
            </p>

            <p className="text-slate-300 leading-7 mt-4">
              Weight per meter = D² / 162
              <br />
              Weight per meter = 12² / 162
              <br />
              Weight per meter = 0.89 kg/m
            </p>

            <p className="text-slate-300 leading-7 mt-4">
              Total weight = 0.89 × 10 = 8.9 kg
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Formula for Total Steel Weight
            </h2>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-orange-400 font-mono text-lg">
              Total Weight = D² / 162 × Length × Number of Bars
            </div>

            <p className="text-slate-300 mt-4 leading-7">
              This formula is useful when calculating reinforcement quantity for
              multiple bars of the same diameter and length.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Uses of Steel Weight Formula
            </h2>

            <ul className="list-disc pl-6 space-y-2 text-slate-300">
              <li>RCC beam reinforcement estimation</li>
              <li>Column vertical bar calculation</li>
              <li>Slab reinforcement quantity</li>
              <li>Footing steel calculation</li>
              <li>Bar bending schedule preparation</li>
              <li>Construction cost estimation</li>
              <li>Material procurement planning</li>
            </ul>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Related Calculators
            </h2>

            <ul className="list-disc pl-6 space-y-2 text-slate-300">
              <li><a href="/steel-weight-calculator">Steel Weight Calculator</a></li>
              <li><a href="/bar-bending-schedule-guide">Bar Bending Schedule Guide</a></li>
              <li><a href="/development-length-calculation">Development Length Calculation</a></li>
              <li><a href="/lap-length-calculation">Lap Length Calculation</a></li>
              <li><a href="/beam-design">Beam Design Calculator</a></li>
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}
