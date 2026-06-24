import Link from "next/link";

export const metadata = {
  title: 'Lap Length Calculation | Steel Reinforcement Lap Formula | CivilCalc Pro',
  description:
    'Learn lap length calculation for steel reinforcement in RCC design with formula, bar diameter, tension lap, compression lap and practical examples as per IS 456.',
  alternates: {
    canonical: 'https://civilcalcpro.in/lap-length-calculation',
  },
  openGraph: {
    title: 'Lap Length Calculation | Steel Reinforcement Lap Formula | CivilCalc Pro',
    description:
      'Learn lap length calculation for steel reinforcement in RCC design with formula, bar diameter, tension lap, compression lap and practical examples as per IS 456.',
    url: 'https://civilcalcpro.in/lap-length-calculation',
    siteName: 'CivilCalc Pro',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lap Length Calculation | Steel Reinforcement Lap Formula | CivilCalc Pro',
    description:
      'Learn lap length calculation for steel reinforcement in RCC design with formula, bar diameter, tension lap, compression lap and practical examples as per IS 456.',
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

export default function LapLengthCalculationPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-16">
      <div className="max-w-5xl mx-auto">
        <p className="text-orange-400 font-semibold mb-3">
          RCC DESIGN GUIDE
        </p>

        <h1 className="text-5xl font-bold mb-6">
          Lap Length Calculation
        </h1>

        <p className="text-slate-300 text-lg mb-10">
          Learn how to calculate lap length for reinforcement bars in RCC
          structures. Lap length is required when two steel bars are joined
          together to safely transfer stress from one bar to another.
        </p>

        <Link
          href="/login?redirect=/dashboard/calculators/lap-length"
          className="inline-block bg-orange-500 hover:bg-orange-600 transition px-6 py-3 rounded-xl font-semibold mb-16"
        >
          Open Lap Length Calculator
        </Link>

        <section className="space-y-8">
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Lap Length Formula
            </h2>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-orange-400 font-mono text-lg">
              Lap Length = 50d for tension bars
            </div>

            <p className="text-slate-300 mt-4 leading-7">
              Here, d is the diameter of the reinforcement bar. Lap length can
              vary depending on bar diameter, stress condition, concrete grade,
              steel grade, and code requirements.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              What is Lap Length?
            </h2>

            <p className="text-slate-300 leading-7 mb-4">
              Lap length is the overlapping length provided between two
              reinforcement bars when the available bar length is not sufficient.
              It helps transfer force safely from one steel bar to another
              through bond with concrete.
            </p>

            <p className="text-slate-300 leading-7">
              Proper lap length is important in RCC beams, columns, slabs,
              footings and other reinforced concrete members.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Common Lap Length Rules
            </h2>

            <ul className="list-disc pl-6 space-y-2 text-slate-300">
              <li>Lap length in tension is commonly taken as 50d</li>
              <li>Lap length in compression is commonly taken as 40d</li>
              <li>Lap should not be provided at maximum stress zones</li>
              <li>Lap should be staggered where possible</li>
              <li>Lap length must satisfy development length requirements</li>
              <li>Bars of different diameters should be checked carefully</li>
            </ul>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Lap Length Calculation Example
            </h2>

            <p className="text-slate-300 leading-7">
              Consider a 16 mm diameter reinforcement bar in tension.
            </p>

            <p className="text-slate-300 leading-7 mt-4">
              Lap Length = 50d
              <br />
              Lap Length = 50 × 16
              <br />
              Lap Length = 800 mm
            </p>

            <p className="text-slate-300 leading-7 mt-4">
              Therefore, the required lap length for a 16 mm bar in tension is
              approximately 800 mm.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Where Lap Length is Used
            </h2>

            <ul className="list-disc pl-6 space-y-2 text-slate-300">
              <li>Beam reinforcement joints</li>
              <li>Column vertical bar lapping</li>
              <li>Slab reinforcement continuation</li>
              <li>Footing reinforcement joints</li>
              <li>Construction joint locations</li>
              <li>Bar bending schedule preparation</li>
            </ul>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Difference Between Lap Length and Development Length
            </h2>

            <p className="text-slate-300 leading-7">
              Development length is the embedded length required for a bar to
              develop its design stress in concrete. Lap length is the overlap
              provided when two bars are joined. Both are related to bond between
              steel and concrete, but they are used for different detailing
              purposes.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Related Calculators
            </h2>

            <ul className="list-disc pl-6 space-y-2 text-slate-300">
              <li><a href="/development-length-calculation">Development Length Calculation</a></li>
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
