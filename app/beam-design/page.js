import Link from "next/link";

export const metadata = {
  title: "RCC Beam Design Calculator as per IS 456:2000 | CivilCalc Pro",
  description:
    "Free online RCC beam design calculator for civil engineers and students. Calculate bending moment, shear force, effective depth, reinforcement steel and RCC beam design as per IS 456:2000.",
  alternates: {
    canonical: "https://civilcalcpro.in/beam-design",
  },
  openGraph: {
    title: "RCC Beam Design Calculator as per IS 456:2000 | CivilCalc Pro",
    description:
      "Free online RCC beam design calculator for civil engineers and students. Calculate bending moment, shear force, effective depth, reinforcement steel and RCC beam design as per IS 456:2000.",
    url: "https://civilcalcpro.in/beam-design",
    siteName: "CivilCalc Pro",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "RCC Beam Design Calculator as per IS 456:2000 | CivilCalc Pro",
    description:
      "Free online RCC beam design calculator for civil engineers and students. Calculate bending moment, shear force, effective depth, reinforcement steel and RCC beam design as per IS 456:2000.",
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

export default function BeamDesignPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How is RCC beam design calculated?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "RCC beam design is calculated by finding load on beam, bending moment, shear force, effective depth and required reinforcement. The design depends on span, load, support condition, concrete grade and steel grade.",
        },
      },
      {
        "@type": "Question",
        name: "What is the bending moment formula for RCC beam?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "For a simply supported RCC beam with uniformly distributed load, maximum bending moment is commonly calculated using Mu equals wu L squared divided by 8.",
        },
      },
      {
        "@type": "Question",
        name: "What is the shear force formula for RCC beam?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "For a simply supported RCC beam with uniformly distributed load, maximum shear force is commonly calculated using Vu equals wu L divided by 2.",
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
          RCC STRUCTURAL DESIGN TOOL
        </p>

        <h1 className="text-5xl font-bold mb-6">
          RCC Beam Design Calculator
        </h1>

        <p className="text-slate-300 text-lg mb-10">
          Free online RCC beam design calculator for civil engineers and
          students. Calculate bending moment, shear force, effective depth,
          reinforcement steel, and RCC beam design as per IS 456:2000.
        </p>

        <Link
          href="/login?redirect=/dashboard/calculators/beam"
          className="inline-block bg-orange-500 hover:bg-orange-600 transition px-6 py-3 rounded-xl font-semibold mb-16"
        >
          Open Beam Design Calculator
        </Link>

        <section className="rounded-2xl border border-orange-500/30 bg-orange-500/5 p-8 mb-12">
          <p className="text-orange-400 font-semibold mb-3">
            QUICK ANSWER
          </p>

          <h2 className="text-3xl font-bold mb-5">
            How to calculate RCC beam design?
          </h2>

          <p className="text-slate-300 leading-8 mb-4">
            RCC beam design is calculated by finding the load on beam, bending
            moment, shear force, effective depth and required reinforcement.
            For a simply supported beam with uniformly distributed load, maximum
            bending moment is calculated using Mu = wuL² / 8 and maximum shear
            force is calculated using Vu = wuL / 2.
          </p>

          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 my-6">
            <p className="text-xl font-bold text-white mb-2">
              Bending Moment = wuL² / 8
            </p>

            <p className="text-xl font-bold text-white mb-2">
              Shear Force = wuL / 2
            </p>

            <p className="text-slate-400">
              wu = factored load, L = effective span of beam.
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
                    25 × 4² / 8
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
                    25 × 4 / 2
                  </td>
                  <td className="border border-slate-800 p-3">
                    50 kN
                  </td>
                </tr>

                <tr>
                  <td className="border border-slate-800 p-3">
                    Required Checks
                  </td>
                  <td className="border border-slate-800 p-3">
                    Depth, steel and shear
                  </td>
                  <td className="border border-slate-800 p-3">
                    Checked as per design
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-slate-400 leading-7 mt-5">
            Example: For a simply supported RCC beam of 4 m span with 25 kN/m
            factored load, bending moment is 25 × 4² / 8 = 50 kNm and shear
            force is 25 × 4 / 2 = 50 kN. Reinforcement is then selected based on
            beam size, concrete grade, steel grade and design checks.
          </p>
        </section>

        <div className="grid md:grid-cols-2 gap-10">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">
              Features
            </h2>

            <ul className="space-y-3 text-slate-300">
              <li>• RCC beam design calculation</li>
              <li>• Bending moment calculation</li>
              <li>• Shear force calculation</li>
              <li>• Effective depth estimation</li>
              <li>• Steel reinforcement calculation</li>
              <li>• IS 456:2000 based beam design</li>
            </ul>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">
              Why Use CivilCalc Pro?
            </h2>

            <p className="text-slate-300 leading-8">
              CivilCalc Pro helps civil engineers design RCC beams quickly using
              professional structural calculation tools. Useful for students,
              site engineers, structural consultants, and construction
              professionals.
            </p>
          </div>
        </div>

        <section className="mt-16 space-y-8">
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
              What is RCC Beam Design?
            </h2>

            <p className="text-slate-300 leading-7 mb-4">
              RCC beam design is the process of designing a reinforced concrete
              beam to safely resist bending moment, shear force, dead load, live
              load and other structural loads. Concrete carries compression and
              steel reinforcement carries tension.
            </p>

            <p className="text-slate-300 leading-7">
              RCC beams are used in residential buildings, commercial buildings,
              structural frames, lintels, roof beams and floor beam systems.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Steps in RCC Beam Design
            </h2>

            <ul className="list-disc pl-6 space-y-2 text-slate-300">
              <li>Determine beam span and support condition</li>
              <li>Calculate dead load and live load</li>
              <li>Calculate factored load</li>
              <li>Calculate bending moment</li>
              <li>Calculate shear force</li>
              <li>Determine effective depth</li>
              <li>Design main reinforcement steel</li>
              <li>Design shear reinforcement or stirrups</li>
              <li>Check deflection, spacing and development length</li>
            </ul>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Beam Design Example
            </h2>

            <p className="text-slate-300 leading-7">
              Consider a simply supported RCC beam with span 4 m and factored
              load 25 kN/m.
            </p>

            <p className="text-slate-300 leading-7 mt-4">
              Maximum Bending Moment = wuL² / 8
              <br />
              Mu = 25 × 4² / 8
              <br />
              Mu = 50 kNm
            </p>

            <p className="text-slate-300 leading-7 mt-4">
              Shear Force = wuL / 2
              <br />
              Vu = 25 × 4 / 2
              <br />
              Vu = 50 kN
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Important Checks in Beam Design
            </h2>

            <ul className="list-disc pl-6 space-y-2 text-slate-300">
              <li>Bending moment capacity check</li>
              <li>Shear force check</li>
              <li>Minimum reinforcement check</li>
              <li>Maximum reinforcement limit</li>
              <li>Deflection check</li>
              <li>Development length check</li>
              <li>Clear cover and spacing check</li>
            </ul>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Related Calculators
            </h2>

            <ul className="list-disc pl-6 space-y-2 text-slate-300">
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
                <Link href="/one-way-slab-calculator">
                  One Way Slab Calculator
                </Link>
              </li>
              <li>
                <Link href="/two-way-slab-calculator">
                  Two Way Slab Calculator
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
