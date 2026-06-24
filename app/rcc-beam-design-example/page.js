import Link from "next/link";

export const metadata = {
  title: 'RCC Beam Design Example | IS 456 Beam Design | CivilCalc Pro',
  description:
    'Learn RCC beam design example as per IS 456 with load calculation, bending moment, shear force, effective depth, reinforcement design and practical steps.',
  alternates: {
    canonical: 'https://civilcalcpro.in/rcc-beam-design-example',
  },
  openGraph: {
    title: 'RCC Beam Design Example | IS 456 Beam Design | CivilCalc Pro',
    description:
      'Learn RCC beam design example as per IS 456 with load calculation, bending moment, shear force, effective depth, reinforcement design and practical steps.',
    url: 'https://civilcalcpro.in/rcc-beam-design-example',
    siteName: 'CivilCalc Pro',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RCC Beam Design Example | IS 456 Beam Design | CivilCalc Pro',
    description:
      'Learn RCC beam design example as per IS 456 with load calculation, bending moment, shear force, effective depth, reinforcement design and practical steps.',
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

export default function RCCBeamDesignExamplePage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How is an RCC beam designed?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "An RCC beam is designed by calculating loads, bending moment, shear force, effective depth and required reinforcement. The design depends on span, load, concrete grade, steel grade, cover and beam size.",
        },
      },
      {
        "@type": "Question",
        name: "What is the bending moment formula for a simply supported RCC beam?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "For a simply supported RCC beam carrying uniformly distributed load, maximum bending moment is commonly calculated using Mu equals wu L squared divided by 8.",
        },
      },
      {
        "@type": "Question",
        name: "What is the shear force formula for a simply supported beam?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "For a simply supported beam carrying uniformly distributed load, maximum shear force is commonly calculated using Vu equals wu L divided by 2.",
        },
      },
      {
        "@type": "Question",
        name: "Which inputs are required for RCC beam design?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Common inputs for RCC beam design include beam span, beam width, beam depth, concrete grade, steel grade, cover, dead load, live load and support condition.",
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
        <p className="text-orange-400 font-semibold mb-3">
          RCC BEAM DESIGN GUIDE
        </p>

        <h1 className="text-5xl font-bold mb-6">
          RCC Beam Design Example
        </h1>

        <p className="text-slate-300 text-lg mb-10">
          Learn RCC beam design with a practical example as per IS 456.
          Understand load calculation, bending moment, shear force, effective
          depth, reinforcement steel, and basic design steps for reinforced
          concrete beams.
        </p>

        <Link
          href="/beam-design"
          className="inline-block bg-orange-500 hover:bg-orange-600 transition px-6 py-3 rounded-xl font-semibold mb-16"
        >
          Open Beam Design Calculator
        </Link>
        <section className="rounded-2xl border border-orange-500/30 bg-orange-500/5 p-8 mb-12">
          <p className="text-orange-400 font-semibold mb-3">
            QUICK ANSWER
          </p>

          <h2 className="text-3xl font-bold mb-5">
            How to design an RCC beam?
          </h2>

          <p className="text-slate-300 leading-8 mb-4">
            RCC beam design is done by calculating loads, bending moment, shear
            force, effective depth and required reinforcement. For a simply
            supported RCC beam carrying uniformly distributed load, maximum
            bending moment is commonly calculated using Mu = wuL² / 8 and shear
            force is calculated using Vu = wuL / 2.
          </p>

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
                    Result
                  </th>
                </tr>
              </thead>

              <tbody className="text-slate-300">
                <tr>
                  <td className="border border-slate-800 p-3">
                    Beam Span
                  </td>
                  <td className="border border-slate-800 p-3">
                    L
                  </td>
                  <td className="border border-slate-800 p-3">
                    4 m
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
                    25 kN/m
                  </td>
                </tr>

                <tr>
                  <td className="border border-slate-800 p-3">
                    Bending Moment
                  </td>
                  <td className="border border-slate-800 p-3">
                    Mu = wuL² / 8
                  </td>
                  <td className="border border-slate-800 p-3">
                    50 kNm
                  </td>
                </tr>

                <tr>
                  <td className="border border-slate-800 p-3">
                    Shear Force
                  </td>
                  <td className="border border-slate-800 p-3">
                    Vu = wuL / 2
                  </td>
                  <td className="border border-slate-800 p-3">
                    50 kN
                  </td>
                </tr>

                <tr>
                  <td className="border border-slate-800 p-3">
                    Effective Depth
                  </td>
                  <td className="border border-slate-800 p-3">
                    Overall depth - cover - half bar diameter
                  </td>
                  <td className="border border-slate-800 p-3">
                    417 mm
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-slate-400 leading-7 mt-5">
            Example: For a simply supported beam of 4 m span with 25 kN/m
            factored load, bending moment is 25 × 4² / 8 = 50 kNm and shear
            force is 25 × 4 / 2 = 50 kN. After this, reinforcement is selected
            based on bending moment, effective depth, concrete grade and steel
            grade.
          </p>
        </section>
        <section className="space-y-8">
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              What is RCC Beam Design?
            </h2>

            <p className="text-slate-300 leading-7 mb-4">
              RCC beam design is the process of designing a reinforced concrete
              beam to safely resist bending moment, shear force, dead load, live
              load and other structural loads. Concrete resists compression and
              steel reinforcement resists tension.
            </p>

            <p className="text-slate-300 leading-7">
              RCC beam design is commonly used in residential buildings,
              commercial structures, slabs, frames, lintels and other structural
              systems.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              RCC Beam Design Formula
            </h2>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-orange-400 font-mono text-lg">
              Mu = wuL² / 8
            </div>

            <p className="text-slate-300 mt-4 leading-7">
              For a simply supported beam with uniformly distributed load,
              maximum bending moment is calculated using wuL² / 8.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Beam Design Data
            </h2>

            <ul className="list-disc pl-6 space-y-2 text-slate-300">
              <li>Beam span = 4 m</li>
              <li>Beam width = 230 mm</li>
              <li>Beam depth = 450 mm</li>
              <li>Concrete grade = M20</li>
              <li>Steel grade = Fe415</li>
              <li>Factored load = 25 kN/m</li>
            </ul>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Step 1: Calculate Bending Moment
            </h2>

            <p className="text-slate-300 leading-7">
              Maximum bending moment for a simply supported beam:
            </p>

            <p className="text-slate-300 leading-7 mt-4">
              Mu = wuL² / 8
              <br />
              Mu = 25 × 4² / 8
              <br />
              Mu = 50 kNm
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Step 2: Calculate Shear Force
            </h2>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-orange-400 font-mono text-lg">
              Vu = wuL / 2
            </div>

            <p className="text-slate-300 leading-7 mt-4">
              Vu = 25 × 4 / 2
              <br />
              Vu = 50 kN
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Step 3: Calculate Effective Depth
            </h2>

            <p className="text-slate-300 leading-7">
              Effective depth is calculated by subtracting clear cover and half
              bar diameter from overall depth.
            </p>

            <p className="text-slate-300 leading-7 mt-4">
              Effective Depth = Overall Depth - Cover - Half Bar Diameter
              <br />
              Effective Depth = 450 - 25 - 8
              <br />
              Effective Depth = 417 mm
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Step 4: Reinforcement Design
            </h2>

            <p className="text-slate-300 leading-7">
              Main reinforcement is designed to resist tensile stresses caused
              by bending moment. The required steel area depends on bending
              moment, effective depth, concrete grade and steel grade.
            </p>

            <p className="text-slate-300 leading-7 mt-4">
              In practical design, bottom reinforcement is provided in the
              tension zone and stirrups are provided to resist shear force.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Important Checks in Beam Design
            </h2>

            <ul className="list-disc pl-6 space-y-2 text-slate-300">
              <li>Depth and span check</li>
              <li>Bending moment capacity check</li>
              <li>Shear force check</li>
              <li>Minimum reinforcement check</li>
              <li>Maximum reinforcement limit</li>
              <li>Deflection check</li>
              <li>Development length check</li>
              <li>Spacing and cover requirements</li>
            </ul>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Uses of RCC Beam Design
            </h2>

            <ul className="list-disc pl-6 space-y-2 text-slate-300">
              <li>Residential building beams</li>
              <li>Commercial building frames</li>
              <li>Lintel beam design</li>
              <li>Roof beam design</li>
              <li>Floor beam design</li>
              <li>Structural design and quantity estimation</li>
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
              <li><a href="/steel-weight-calculator">Steel Weight Calculator</a></li>
              <li><a href="/development-length-calculation">Development Length Calculation</a></li>
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
