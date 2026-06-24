import Link from "next/link";

export const metadata = {
  title: 'One Way Slab Calculator | RCC Slab Design | CivilCalc Pro',
  description:
    'Free online one way slab calculator for civil engineers and students. Calculate slab load, effective depth, bending moment, reinforcement steel and RCC slab design as per IS 456.',
  alternates: {
    canonical: 'https://civilcalcpro.in/one-way-slab-calculator',
  },
  openGraph: {
    title: 'One Way Slab Calculator | RCC Slab Design | CivilCalc Pro',
    description:
      'Free online one way slab calculator for civil engineers and students. Calculate slab load, effective depth, bending moment, reinforcement steel and RCC slab design as per IS 456.',
    url: 'https://civilcalcpro.in/one-way-slab-calculator',
    siteName: 'CivilCalc Pro',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'One Way Slab Calculator | RCC Slab Design | CivilCalc Pro',
    description:
      'Free online one way slab calculator for civil engineers and students. Calculate slab load, effective depth, bending moment, reinforcement steel and RCC slab design as per IS 456.',
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

export default function OneWaySlabCalculatorPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-16">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-5xl font-bold mb-6">
          One Way Slab Calculator
        </h1>

        <p className="text-slate-300 text-lg mb-10">
          Free online one way slab calculator for civil engineers and students.
          Calculate slab load, effective depth, bending moment, reinforcement
          steel, and RCC slab design as per IS 456 code.
        </p>

        <Link
          href="/login?redirect=/dashboard/calculators/slab"
          className="inline-block bg-orange-500 hover:bg-orange-600 transition px-6 py-3 rounded-xl font-semibold mb-16"
        >
          Open One Way Slab Calculator
        </Link>

        <div className="grid md:grid-cols-2 gap-10">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">Features</h2>

            <ul className="space-y-3 text-slate-300">
              <li>• One way slab design calculation</li>
              <li>• Slab load calculation</li>
              <li>• Bending moment calculation</li>
              <li>• Effective depth estimation</li>
              <li>• Steel reinforcement calculation</li>
              <li>• IS 456 based RCC slab design</li>
            </ul>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">
              Why Use CivilCalc Pro?
            </h2>

            <p className="text-slate-300 leading-8">
              CivilCalc Pro helps civil engineers design RCC slabs quickly using
              professional structural calculation tools. Useful for students,
              site engineers, structural consultants, and construction professionals.
            </p>
          </div>
        </div>
      </div>

      <section className="mt-16 space-y-8">
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4">
            One Way Slab Formula
          </h2>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-orange-400 font-mono text-lg">
            Ly / Lx ≥ 2
          </div>

          <p className="text-slate-300 mt-4">
            A slab is generally considered a one way slab when the longer span
            to shorter span ratio is greater than or equal to 2.
          </p>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4">
            What is One Way Slab?
          </h2>

          <p className="text-slate-300 leading-7 mb-4">
            A one way slab is an RCC slab that primarily transfers load in one
            direction. It is usually supported on two opposite sides and the main
            reinforcement is provided along the shorter span direction.
          </p>

          <p className="text-slate-300 leading-7">
            One way slabs are commonly used in residential buildings, corridors,
            balconies, small rooms, and slab panels where the longer span is much
            greater than the shorter span.
          </p>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4">
            Steps in One Way Slab Design
          </h2>

          <ul className="list-disc pl-6 space-y-2 text-slate-300">
            <li>Determine shorter span and longer span</li>
            <li>Check slab type using span ratio</li>
            <li>Calculate dead load and live load</li>
            <li>Calculate factored load</li>
            <li>Calculate bending moment</li>
            <li>Determine effective depth</li>
            <li>Design main reinforcement</li>
            <li>Provide distribution reinforcement</li>
            <li>Check shear and deflection limits</li>
          </ul>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4">
            One Way Slab Design Example
          </h2>

          <p className="text-slate-300 leading-7">
            Consider a slab panel with shorter span 3 m and longer span 7 m.
          </p>

          <p className="text-slate-300 leading-7 mt-4">
            Span Ratio = Ly / Lx
            <br />
            Span Ratio = 7 / 3
            <br />
            Span Ratio = 2.33
          </p>

          <p className="text-slate-300 leading-7 mt-4">
            Since the span ratio is greater than 2, the slab behaves as a one way slab.
          </p>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4">
            Main Reinforcement in One Way Slab
          </h2>

          <p className="text-slate-300 leading-7">
            In one way slab design, main reinforcement is provided along the
            shorter span because load is transferred mainly in that direction.
            Distribution reinforcement is provided along the longer span to
            control shrinkage and temperature stresses.
          </p>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4">
            Related Calculators
          </h2>

          <ul className="list-disc pl-6 space-y-2 text-slate-300">
            <li><a href="/two-way-slab-calculator">Two Way Slab Calculator</a></li>
            <li><a href="/beam-design">Beam Design Calculator</a></li>
            <li><a href="/column-design">Column Design Calculator</a></li>
            <li><a href="/footing-design">Footing Design Calculator</a></li>
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
