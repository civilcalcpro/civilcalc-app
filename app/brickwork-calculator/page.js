import Link from "next/link";

export const metadata = {
  title: "Brickwork Calculator | Brick Quantity & Mortar Estimation | CivilCalc Pro",
  description:
    "Free online brickwork calculator for civil engineers and contractors. Calculate number of bricks, wall volume, mortar quantity, cement, sand and brickwork material estimation.",
  alternates: {
    canonical: "https://civilcalcpro.in/brickwork-calculator",
  },
  openGraph: {
    title: "Brickwork Calculator | Brick Quantity & Mortar Estimation | CivilCalc Pro",
    description:
      "Free online brickwork calculator for civil engineers and contractors. Calculate number of bricks, wall volume, mortar quantity, cement, sand and brickwork material estimation.",
    url: "https://civilcalcpro.in/brickwork-calculator",
    siteName: "CivilCalc Pro",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Brickwork Calculator | Brick Quantity & Mortar Estimation | CivilCalc Pro",
    description:
      "Free online brickwork calculator for civil engineers and contractors. Calculate number of bricks, wall volume, mortar quantity, cement, sand and brickwork material estimation.",
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

export default function BrickworkCalculatorPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How is brickwork quantity calculated?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Brickwork quantity is calculated by multiplying wall length, wall height and wall thickness. The formula is length multiplied by height multiplied by thickness.",
        },
      },
      {
        "@type": "Question",
        name: "How many bricks are required in 1 cubic meter of brickwork?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Approximately 500 standard modular bricks are required for 1 cubic meter of brickwork, including mortar joints.",
        },
      },
      {
        "@type": "Question",
        name: "What is the formula for number of bricks?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The approximate number of bricks is calculated by multiplying brickwork volume by 500. For example, if brickwork volume is 3.45 cubic meters, bricks required are 1725 bricks.",
        },
      },
      {
        "@type": "Question",
        name: "Where is brickwork calculation used?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Brickwork calculation is used for wall construction, brick quantity estimation, mortar calculation, BOQ preparation, billing and construction material planning.",
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
          Brickwork Calculator
        </h1>

        <p className="text-slate-300 text-lg mb-10">
          Free online brickwork calculator for civil engineers, contractors,
          and students. Calculate number of bricks, wall volume, mortar
          quantity, cement, sand, and brickwork material estimation.
        </p>

        <Link
          href="/login?redirect=/dashboard/calculators/brickwork"
          className="inline-block bg-orange-500 hover:bg-orange-600 transition px-6 py-3 rounded-xl font-semibold mb-16"
        >
          Open Brickwork Calculator
        </Link>

        <section className="rounded-2xl border border-orange-500/30 bg-orange-500/5 p-8 mb-12">
          <p className="text-orange-400 font-semibold mb-3">
            QUICK ANSWER
          </p>

          <h2 className="text-3xl font-bold mb-5">
            How to calculate brickwork quantity?
          </h2>

          <p className="text-slate-300 leading-8 mb-4">
            Brickwork quantity is calculated by multiplying wall length, wall
            height and wall thickness. After calculating brickwork volume, the
            approximate number of bricks is calculated by multiplying volume by
            500 bricks per cubic meter for standard modular bricks.
          </p>

          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 my-6">
            <p className="text-xl font-bold text-white mb-2">
              Brickwork Volume = Length × Height × Thickness
            </p>

            <p className="text-xl font-bold text-white mb-2">
              Number of Bricks = Brickwork Volume × 500
            </p>

            <p className="text-slate-400">
              For a 230 mm wall, thickness is usually taken as 0.23 m.
            </p>
          </div>

          <div className="overflow-x-auto mt-6">
            <table className="w-full border border-slate-800 text-left">
              <thead className="bg-slate-900">
                <tr>
                  <th className="border border-slate-800 p-3 text-white">
                    Item
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
                    Wall Length
                  </td>
                  <td className="border border-slate-800 p-3">
                    L
                  </td>
                  <td className="border border-slate-800 p-3">
                    5 m
                  </td>
                </tr>

                <tr>
                  <td className="border border-slate-800 p-3">
                    Wall Height
                  </td>
                  <td className="border border-slate-800 p-3">
                    H
                  </td>
                  <td className="border border-slate-800 p-3">
                    3 m
                  </td>
                </tr>

                <tr>
                  <td className="border border-slate-800 p-3">
                    Wall Thickness
                  </td>
                  <td className="border border-slate-800 p-3">
                    T
                  </td>
                  <td className="border border-slate-800 p-3">
                    0.23 m
                  </td>
                </tr>

                <tr>
                  <td className="border border-slate-800 p-3">
                    Brickwork Volume
                  </td>
                  <td className="border border-slate-800 p-3">
                    5 × 3 × 0.23
                  </td>
                  <td className="border border-slate-800 p-3">
                    3.45 m³
                  </td>
                </tr>

                <tr>
                  <td className="border border-slate-800 p-3">
                    Number of Bricks
                  </td>
                  <td className="border border-slate-800 p-3">
                    3.45 × 500
                  </td>
                  <td className="border border-slate-800 p-3">
                    1,725 bricks
                  </td>
                </tr>

                <tr>
                  <td className="border border-slate-800 p-3">
                    With 5% Wastage
                  </td>
                  <td className="border border-slate-800 p-3">
                    1,725 × 1.05
                  </td>
                  <td className="border border-slate-800 p-3">
                    1,811 bricks
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-slate-400 leading-7 mt-5">
            Example: For a wall of 5 m length, 3 m height and 230 mm thickness,
            brickwork volume is 5 × 3 × 0.23 = 3.45 m³. Approximate bricks
            required are 3.45 × 500 = 1,725 bricks. With 5% wastage, total
            bricks required are approximately 1,811 bricks.
          </p>
        </section>

        <div className="grid md:grid-cols-2 gap-10">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">
              Features
            </h2>

            <ul className="space-y-3 text-slate-300">
              <li>• Brick quantity calculation</li>
              <li>• Wall volume calculation</li>
              <li>• Mortar quantity estimation</li>
              <li>• Cement and sand estimation</li>
              <li>• Brickwork material analysis</li>
              <li>• Construction cost planning</li>
            </ul>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">
              Why Use CivilCalc Pro?
            </h2>

            <p className="text-slate-300 leading-8">
              CivilCalc Pro helps engineers and contractors calculate brickwork
              quantities quickly using professional construction estimation
              tools. Useful for site engineers, quantity surveyors, contractors,
              and construction professionals.
            </p>
          </div>
        </div>

        <section className="mt-16 space-y-8">
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Brickwork Volume Formula
            </h2>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-orange-400 font-mono text-lg">
              Wall Volume = Length × Height × Thickness
            </div>

            <p className="text-slate-300 mt-4">
              Brickwork quantity is calculated from wall volume, brick size,
              mortar thickness, and wastage allowance.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              What is a Brickwork Calculator?
            </h2>

            <p className="text-slate-300 leading-7 mb-4">
              A Brickwork Calculator is used to estimate the number of bricks,
              mortar quantity, cement, and sand required for wall construction.
              Civil engineers and contractors use brickwork calculations for
              quantity estimation, billing, procurement, and BOQ preparation.
            </p>

            <p className="text-slate-300 leading-7">
              Accurate brickwork estimation helps reduce material wastage,
              improve project budgeting, and plan construction work more
              efficiently.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Brickwork Calculation Steps
            </h2>

            <ul className="list-disc pl-6 space-y-2 text-slate-300">
              <li>Measure wall length</li>
              <li>Measure wall height</li>
              <li>Select wall thickness</li>
              <li>Calculate total wall volume</li>
              <li>Deduct openings such as doors and windows</li>
              <li>Calculate number of bricks</li>
              <li>Calculate mortar quantity</li>
              <li>Estimate cement and sand requirement</li>
            </ul>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Brickwork Calculation Example
            </h2>

            <p className="text-slate-300 leading-7">
              Consider a brick wall with:
            </p>

            <ul className="list-disc pl-6 space-y-2 text-slate-300 mt-4">
              <li>Length = 5 m</li>
              <li>Height = 3 m</li>
              <li>Thickness = 0.23 m</li>
            </ul>

            <p className="text-slate-300 leading-7 mt-4">
              Wall Volume = Length × Height × Thickness
              <br />
              Wall Volume = 5 × 3 × 0.23
              <br />
              Wall Volume = 3.45 m³
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Benefits of Brickwork Estimation
            </h2>

            <ul className="list-disc pl-6 space-y-2 text-slate-300">
              <li>Reduces brick and mortar wastage</li>
              <li>Improves construction budgeting</li>
              <li>Helps in material procurement</li>
              <li>Supports contractor billing</li>
              <li>Useful for BOQ preparation</li>
              <li>Improves site planning and execution</li>
            </ul>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Related Calculators
            </h2>

            <ul className="list-disc pl-6 space-y-2 text-slate-300">
              <li>
                <Link href="/plaster-calculator">
                  Plaster Calculator
                </Link>
              </li>
              <li>
                <Link href="/concrete-volume-calculator">
                  Concrete Volume Calculator
                </Link>
              </li>
              <li>
                <Link href="/excavation-calculator">
                  Excavation Calculator
                </Link>
              </li>
              <li>
                <Link href="/steel-weight-calculator">
                  Steel Weight Calculator
                </Link>
              </li>
              <li>
                <Link href="/footing-design">
                  Footing Design Calculator
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
