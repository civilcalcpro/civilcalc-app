import Link from "next/link";

export const metadata = {
  title: 'Development Length Calculation | Ld Formula | CivilCalc Pro',
  description:
    'Learn development length calculation in RCC design with formula, bond stress, bar diameter, design stress and practical examples as per IS 456.',
  alternates: {
    canonical: 'https://civilcalcpro.in/development-length-calculation',
  },
  openGraph: {
    title: 'Development Length Calculation | Ld Formula | CivilCalc Pro',
    description:
      'Learn development length calculation in RCC design with formula, bond stress, bar diameter, design stress and practical examples as per IS 456.',
    url: 'https://civilcalcpro.in/development-length-calculation',
    siteName: 'CivilCalc Pro',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Development Length Calculation | Ld Formula | CivilCalc Pro',
    description:
      'Learn development length calculation in RCC design with formula, bond stress, bar diameter, design stress and practical examples as per IS 456.',
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

export default function DevelopmentLengthCalculationPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-16">
      <div className="max-w-5xl mx-auto">
        <p className="text-orange-400 font-semibold mb-3">
          RCC DESIGN GUIDE
        </p>

        <h1 className="text-5xl font-bold mb-6">
          Development Length Calculation
        </h1>

        <p className="text-slate-300 text-lg mb-10">
          Learn how to calculate development length in RCC design using bar
          diameter, design stress, bond stress and IS 456 based formula.
          Development length is important for safe transfer of stress between
          steel reinforcement and concrete.
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
              Development Length Formula
            </h2>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-orange-400 font-mono text-lg">
              Ld = φ × σs / 4τbd
            </div>

            <p className="text-slate-300 mt-4 leading-7">
              Where φ is the diameter of reinforcement bar, σs is the stress in
              steel, and τbd is the design bond stress.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              What is Development Length?
            </h2>

            <p className="text-slate-300 leading-7 mb-4">
              Development length is the minimum length of reinforcement bar that
              must be embedded in concrete to develop the full design stress in
              steel. It ensures proper bond between concrete and reinforcement.
            </p>

            <p className="text-slate-300 leading-7">
              If development length is insufficient, the reinforcement may slip
              before reaching its required strength, which can reduce structural
              safety.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Importance of Development Length
            </h2>

            <ul className="list-disc pl-6 space-y-2 text-slate-300">
              <li>Ensures proper bond between concrete and steel</li>
              <li>Prevents bar slippage under load</li>
              <li>Helps transfer stress safely</li>
              <li>Improves structural safety</li>
              <li>Required in beams, slabs, columns and footings</li>
              <li>Important for RCC detailing and bar bending schedule</li>
            </ul>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Development Length Calculation Example
            </h2>

            <p className="text-slate-300 leading-7">
              Consider a 16 mm diameter reinforcement bar with steel stress of
              415 N/mm² and design bond stress of 1.6 N/mm².
            </p>

            <p className="text-slate-300 leading-7 mt-4">
              Ld = φ × σs / 4τbd
              <br />
              Ld = 16 × 415 / 4 × 1.6
              <br />
              Ld = 1037.5 mm
            </p>

            <p className="text-slate-300 leading-7 mt-4">
              Therefore, the required development length is approximately
              1038 mm.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Where Development Length is Used
            </h2>

            <ul className="list-disc pl-6 space-y-2 text-slate-300">
              <li>Beam reinforcement anchorage</li>
              <li>Column reinforcement detailing</li>
              <li>Slab reinforcement design</li>
              <li>Footing reinforcement anchorage</li>
              <li>Bar curtailment zones</li>
              <li>Lap splice and reinforcement joints</li>
            </ul>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Factors Affecting Development Length
            </h2>

            <ul className="list-disc pl-6 space-y-2 text-slate-300">
              <li>Diameter of reinforcement bar</li>
              <li>Grade of steel</li>
              <li>Grade of concrete</li>
              <li>Design bond stress</li>
              <li>Type of bar surface</li>
              <li>Stress developed in reinforcement</li>
            </ul>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Related Calculators
            </h2>

            <ul className="list-disc pl-6 space-y-2 text-slate-300">
              <li><a href="/lap-length-calculation">Lap Length Calculation</a></li>
              <li><a href="/bar-bending-schedule-guide">Bar Bending Schedule Guide</a></li>
              <li><a href="/steel-weight-calculator">Steel Weight Calculator</a></li>
              <li><a href="/beam-design">Beam Design Calculator</a></li>
              <li><a href="/column-design">Column Design Calculator</a></li>
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}
