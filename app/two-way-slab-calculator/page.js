import Link from "next/link";

export const metadata = {
  title: "Two Way Slab Calculator | RCC Slab Design | CivilCalc Pro",
  description:
    "Free online two way slab calculator for civil engineers and students. Calculate slab load, bending moment, effective depth, reinforcement steel and RCC two way slab design as per IS 456.",
  alternates: {
    canonical: "https://civilcalcpro.in/two-way-slab-calculator",
  },
  openGraph: {
    title: "Two Way Slab Calculator | RCC Slab Design | CivilCalc Pro",
    description:
      "Free online two way slab calculator for civil engineers and students. Calculate slab load, bending moment, effective depth, reinforcement steel and RCC two way slab design as per IS 456.",
    url: "https://civilcalcpro.in/two-way-slab-calculator",
    siteName: "CivilCalc Pro",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Two Way Slab Calculator | RCC Slab Design | CivilCalc Pro",
    description:
      "Free online two way slab calculator for civil engineers and students. Calculate slab load, bending moment, effective depth, reinforcement steel and RCC two way slab design as per IS 456.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
};

export default function TwoWaySlabCalculatorPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is a two way slab?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A two way slab is an RCC slab in which load is transferred in both directions. It usually occurs when the longer span divided by the shorter span is less than 2.",
        },
      },
      {
        "@type": "Question",
        name: "How do you identify a two way slab?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A slab is generally considered a two way slab when the longer span to shorter span ratio is less than 2. Reinforcement is provided in both directions.",
        },
      },
      {
        "@type": "Question",
        name: "Where is reinforcement provided in two way slab?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "In a two way slab, reinforcement is provided in both shorter span and longer span directions because load is transferred in both directions.",
        },
      },
      {
        "@type": "Question",
        name: "Which inputs are required for two way slab design?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Common inputs for two way slab design include shorter span, longer span, slab thickness, concrete grade, steel grade, dead load, live load, support condition and clear cover.",
        },
      },
    ],
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />

      <div className="max-w-5xl mx-auto">
        <h1 className="text-5xl font-bold mb-6">
          Two Way Slab Calculator
        </h1>

        <p className="text-slate-300 text-lg mb-10">
          Free online two way slab calculator for civil engineers and students.
          Calculate slab load, bending moment, effective depth, reinforcement
          steel, and RCC two way slab design as per IS 456 code.
        </p>

        <Link
          href="/login?redirect=/dashboard/calculators/two-way-slab"
          className="inline-block bg-orange-500 hover:bg-orange-600 transition px-6 py-3 rounded-xl font-semibold mb-16"
        >
          Open Two Way Slab Calculator
        </Link>

        <section className="rounded-2xl border border-orange-500/30 bg-orange-500/5 p-8 mb-12">
          <p className="text-orange-400 font-semibold mb-3">
            QUICK ANSWER
          </p>

          <h2 className="text-3xl font-bold mb-5">
            What is a two way slab?
          </h2>

          <p className="text-slate-300 leading-8 mb-4">
            A two way slab is a reinforced concrete slab in which the load is
            transferred in both directions. Generally, when the longer span
            divided by the shorter span is less than 2, the slab behaves as a
            two way slab. Main reinforcement is provided in both directions.
          </p>

          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 my-6">
            <p className="text-xl font-bold text-white mb-2">
              Two Way Slab Condition = Longer Span / Shorter Span &lt; 2
            </p>

            <p className="text-xl font-bold text-white mb-2">
              Moment in Short Span = αx × wu × Lx²
            </p>

            <p className="text-xl font-bold text-white mb-2">
              Moment in Long Span = αy × wu × Lx²
            </p>

            <p className="text-slate-400">
              Lx = shorter span, Ly = longer span, wu = factored load, αx and
              αy = moment coefficients.
            </p>
          </div>

          <div className="overflow-x-auto mt-6">
            <table className="w-full border border-slate-800 text-left">
              <thead className="bg-slate-900">
                <tr>
                  <th className="border border-slate-800 p-3 text-white">
                    Design Item
                  </th>
                  <th className="border border-slate-800 p-3 text-white">
                    Formula / Value
                  </th>
                  <th className="border border-slate-800 p-3 text-white">
                    Example Result
                  </th>
                </tr>
              </thead>

              <tbody className="text-slate-300">
                <tr>
                  <td className="border border-slate-800 p-3">
                    Shorter Span
                  </td>
                  <td className="border border-slate-800 p-3">
                    Lx
                  </td>
                  <td className="border border-slate-800 p-3">
                    4 m
                  </td>
                </tr>

                <tr>
                  <td className="border border-slate-800 p-3">
                    Longer Span
                  </td>
                  <td className="border border-slate-800 p-3">
                    Ly
                  </td>
                  <td className="border border-slate-800 p-3">
                    6 m
                  </td>
                </tr>

                <tr>
                  <td className="border border-slate-800 p-3">
                    Span Ratio
                  </td>
                  <td className="border border-slate-800 p-3">
                    Ly / Lx = 6 / 4
                  </td>
                  <td className="border border-slate-800 p-3">
                    1.5, so two way slab
                  </td>
                </tr>

                <tr>
                  <td className="border border-slate-800 p-3">
                    Factored Load
                  </td>
                  <td className="border border-slate-800 p-3">
                    wu
                  </td>
                  <td className="border border-slate-800 p-3">
                    10 kN/m²
                  </td>
                </tr>

                <tr>
                  <td className="border border-slate-800 p-3">
                    Reinforcement
                  </td>
                  <td className="border border-slate-800 p-3">
                    Provided in both directions
                  </td>
                  <td className="border border-slate-800 p-3">
                    Short span and long span steel
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-slate-400 leading-7 mt-5">
            Example: If shorter span is 4 m and longer span is 6 m, span ratio
            is 6 / 4 = 1.5. Since the ratio is less than 2, the slab behaves as
            a two way slab. Reinforcement is provided in both directions because
            load is transferred along both spans.
          </p>
        </section>

        <div className="grid md:grid-cols-2 gap-10">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">
              Features
            </h2>

            <ul className="space-y-3 text-slate-300">
              <li>• Two way slab design calculation</li>
              <li>• Slab load calculation</li>
              <li>• Moment coefficient based calculation</li>
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
              CivilCalc Pro helps civil engineers design RCC two way slabs
              quickly using professional structural calculation tools. Useful
              for students, site engineers, structural consultants, and
              construction professionals.
            </p>
          </div>
        </div>

        <section className="mt-16 space-y-8">
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Two Way Slab Formula
            </h2>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-orange-400 font-mono text-lg">
              Ly / Lx &lt; 2
            </div>

            <p className="text-slate-300 mt-4">
              A slab is generally considered a two way slab when the longer span
              to shorter span ratio is less than 2.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              What is Two Way Slab?
            </h2>

            <p className="text-slate-300 leading-7 mb-4">
              A two way slab is an RCC slab that transfers load in both
              directions. It is usually supported on all four sides and main
              reinforcement is provided in both shorter and longer span
              directions.
            </p>

            <p className="text-slate-300 leading-7">
              Two way slabs are commonly used in square or nearly square rooms,
              floor panels, commercial buildings, residential slabs, and
              structural systems where the load is distributed in two
              directions.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Steps in Two Way Slab Design
            </h2>

            <ul className="list-disc pl-6 space-y-2 text-slate-300">
              <li>Determine shorter span and longer span</li>
              <li>Check slab type using span ratio</li>
              <li>Calculate dead load and live load</li>
              <li>Calculate factored load</li>
              <li>Calculate bending moment in both directions</li>
              <li>Determine effective depth</li>
              <li>Design reinforcement along shorter span</li>
              <li>Design reinforcement along longer span</li>
              <li>Check shear and deflection limits</li>
            </ul>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Two Way Slab Design Example
            </h2>

            <p className="text-slate-300 leading-7">
              Consider a slab panel with shorter span 4 m and longer span 6 m.
            </p>

            <p className="text-slate-300 leading-7 mt-4">
              Span Ratio = Ly / Lx
              <br />
              Span Ratio = 6 / 4
              <br />
              Span Ratio = 1.5
            </p>

            <p className="text-slate-300 leading-7 mt-4">
              Since the span ratio is less than 2, the slab behaves as a two
              way slab.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Reinforcement in Two Way Slab
            </h2>

            <p className="text-slate-300 leading-7">
              In two way slab design, reinforcement is provided in both
              directions because the slab transfers load along both shorter and
              longer spans. The amount of steel depends on bending moment, slab
              thickness, support condition, concrete grade and steel grade.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Related Calculators
            </h2>

            <ul className="list-disc pl-6 space-y-2 text-slate-300">
              <li>
                <Link href="/one-way-slab-calculator">
                  One Way Slab Calculator
                </Link>
              </li>
              <li>
                <Link href="/beam-design">
                  Beam Design Calculator
                </Link>
              </li>
              <li>
                <Link href="/column-design">
                  Column Design Calculator
                </Link>
              </li>
              <li>
                <Link href="/footing-design">
                  Footing Design Calculator
                </Link>
              </li>
              <li>
                <Link href="/steel-weight-calculator">
                  Steel Weight Calculator
                </Link>
              </li>
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
