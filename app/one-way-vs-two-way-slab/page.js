import Link from "next/link";

export const metadata = {
  title: 'One-Way Slab vs Two-Way Slab | Complete Comparison | CivilCalc Pro',
  description:
    'Learn the difference between one-way slab and two-way slab with span ratio, reinforcement details, design criteria, advantages, disadvantages and practical examples.',
  alternates: {
    canonical: 'https://civilcalcpro.in/one-way-vs-two-way-slab',
  },
  openGraph: {
    title: 'One-Way Slab vs Two-Way Slab | Complete Comparison | CivilCalc Pro',
    description:
      'Learn the difference between one-way slab and two-way slab with span ratio, reinforcement details, design criteria, advantages, disadvantages and practical examples.',
    url: 'https://civilcalcpro.in/one-way-vs-two-way-slab',
    siteName: 'CivilCalc Pro',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'One-Way Slab vs Two-Way Slab | Complete Comparison | CivilCalc Pro',
    description:
      'Learn the difference between one-way slab and two-way slab with span ratio, reinforcement details, design criteria, advantages, disadvantages and practical examples.',
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

export default function OneWayVsTwoWaySlabPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-16">
      <div className="max-w-5xl mx-auto">
        <p className="text-orange-400 font-semibold mb-3">
          RCC SLAB DESIGN GUIDE
        </p>

        <h1 className="text-5xl font-bold mb-6">
          One-Way Slab vs Two-Way Slab
        </h1>

        <p className="text-slate-300 text-lg mb-10">
          Learn the difference between one-way slab and two-way slab with span
          ratio, load transfer direction, reinforcement detailing, design
          criteria, advantages, disadvantages, and practical examples.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-16">
          <Link
            href="/one-way-slab-calculator"
            className="bg-orange-500 hover:bg-orange-600 transition px-6 py-4 rounded-xl font-semibold text-center"
          >
            Open One Way Slab Calculator
          </Link>

          <Link
            href="/two-way-slab-calculator"
            className="bg-slate-900 hover:bg-slate-800 border border-slate-700 transition px-6 py-4 rounded-xl font-semibold text-center"
          >
            Open Two Way Slab Calculator
          </Link>
        </div>

        <section className="space-y-8">
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Main Difference Between One-Way Slab and Two-Way Slab
            </h2>

            <p className="text-slate-300 leading-7">
              The main difference between one-way slab and two-way slab is the
              direction of load transfer. A one-way slab transfers load mainly in
              one direction, while a two-way slab transfers load in both
              directions. The slab type is usually decided using the span ratio
              of longer span to shorter span.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Slab Type Formula
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                <h3 className="font-semibold text-orange-400 mb-2">
                  One-Way Slab
                </h3>

                <p className="text-slate-300 font-mono text-lg">
                  Ly / Lx ≥ 2
                </p>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                <h3 className="font-semibold text-orange-400 mb-2">
                  Two-Way Slab
                </h3>

                <p className="text-slate-300 font-mono text-lg">
                  Ly / Lx &lt; 2
                </p>
              </div>
            </div>

            <p className="text-slate-300 leading-7 mt-4">
              Here, Ly is the longer span and Lx is the shorter span of the slab
              panel.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 overflow-x-auto">
            <h2 className="text-2xl font-bold text-white mb-4">
              One-Way Slab vs Two-Way Slab Comparison Table
            </h2>

            <table className="w-full border-collapse text-left text-slate-300">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="py-3 pr-4 text-white">Point</th>
                  <th className="py-3 pr-4 text-white">One-Way Slab</th>
                  <th className="py-3 pr-4 text-white">Two-Way Slab</th>
                </tr>
              </thead>

              <tbody>
                <tr className="border-b border-slate-800">
                  <td className="py-3 pr-4">Span Ratio</td>
                  <td className="py-3 pr-4">Ly / Lx ≥ 2</td>
                  <td className="py-3 pr-4">Ly / Lx &lt; 2</td>
                </tr>

                <tr className="border-b border-slate-800">
                  <td className="py-3 pr-4">Load Transfer</td>
                  <td className="py-3 pr-4">Mainly one direction</td>
                  <td className="py-3 pr-4">Both directions</td>
                </tr>

                <tr className="border-b border-slate-800">
                  <td className="py-3 pr-4">Support Condition</td>
                  <td className="py-3 pr-4">Usually two opposite sides</td>
                  <td className="py-3 pr-4">Usually all four sides</td>
                </tr>

                <tr className="border-b border-slate-800">
                  <td className="py-3 pr-4">Main Reinforcement</td>
                  <td className="py-3 pr-4">Shorter span direction</td>
                  <td className="py-3 pr-4">Both directions</td>
                </tr>

                <tr className="border-b border-slate-800">
                  <td className="py-3 pr-4">Common Use</td>
                  <td className="py-3 pr-4">Corridors, balconies, rectangular rooms</td>
                  <td className="py-3 pr-4">Square rooms, floor panels, slabs supported on four sides</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              What is One-Way Slab?
            </h2>

            <p className="text-slate-300 leading-7 mb-4">
              A one-way slab is a reinforced concrete slab that bends and
              transfers load mainly in one direction. It is generally used when
              the longer span is at least twice the shorter span.
            </p>

            <p className="text-slate-300 leading-7">
              In one-way slab design, main reinforcement is provided along the
              shorter span direction, and distribution reinforcement is provided
              along the longer span direction.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              What is Two-Way Slab?
            </h2>

            <p className="text-slate-300 leading-7 mb-4">
              A two-way slab is a reinforced concrete slab that transfers load in
              both directions. It is generally used when the longer span to
              shorter span ratio is less than 2.
            </p>

            <p className="text-slate-300 leading-7">
              In two-way slab design, main reinforcement is provided in both
              directions because bending moment develops along both spans.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Practical Example
            </h2>

            <p className="text-slate-300 leading-7">
              Suppose a slab panel has shorter span 3 m and longer span 7 m.
            </p>

            <p className="text-slate-300 leading-7 mt-4">
              Span Ratio = Ly / Lx
              <br />
              Span Ratio = 7 / 3
              <br />
              Span Ratio = 2.33
            </p>

            <p className="text-slate-300 leading-7 mt-4">
              Since the span ratio is greater than 2, this slab behaves as a
              one-way slab.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Which Slab Should You Use?
            </h2>

            <p className="text-slate-300 leading-7">
              Use a one-way slab when the slab panel is long and narrow, where
              the longer span is at least twice the shorter span. Use a two-way
              slab when the slab panel is square or nearly square and supported
              on all four sides.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Related Calculators
            </h2>

            <ul className="list-disc pl-6 space-y-2 text-slate-300">
              <li><a href="/one-way-slab-calculator">One Way Slab Calculator</a></li>
              <li><a href="/two-way-slab-calculator">Two Way Slab Calculator</a></li>
              <li><a href="/beam-design">Beam Design Calculator</a></li>
              <li><a href="/steel-weight-calculator">Steel Weight Calculator</a></li>
              <li><a href="/concrete-volume-calculator">Concrete Volume Calculator</a></li>
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
      </div>
    </main>
  );
}
