import Link from "next/link";

export const metadata = {
  title: 'How to Calculate Brickwork Quantity | Brick Calculation Guide | CivilCalc Pro',
  description:
    'Learn how to calculate brickwork quantity, number of bricks, wall volume, mortar quantity, cement and sand requirement with practical examples.',
  alternates: {
    canonical: 'https://civilcalcpro.in/how-to-calculate-brickwork-quantity',
  },
  openGraph: {
    title: 'How to Calculate Brickwork Quantity | Brick Calculation Guide | CivilCalc Pro',
    description:
      'Learn how to calculate brickwork quantity, number of bricks, wall volume, mortar quantity, cement and sand requirement with practical examples.',
    url: 'https://civilcalcpro.in/how-to-calculate-brickwork-quantity',
    siteName: 'CivilCalc Pro',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How to Calculate Brickwork Quantity | Brick Calculation Guide | CivilCalc Pro',
    description:
      'Learn how to calculate brickwork quantity, number of bricks, wall volume, mortar quantity, cement and sand requirement with practical examples.',
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

export default function HowToCalculateBrickworkQuantityPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How do you calculate brickwork quantity?",
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
          text: "The approximate number of bricks is calculated by multiplying brickwork volume by 500. For example, if brickwork volume is 3.45 cubic meters, bricks required are 3.45 multiplied by 500, which equals 1725 bricks.",
        },
      },
      {
        "@type": "Question",
        name: "What thickness is used for a 230 mm brick wall?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "For a 230 mm brick wall, wall thickness is usually taken as 0.23 meter while calculating brickwork volume.",
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
          BRICKWORK QUANTITY GUIDE
        </p>

        <h1 className="text-5xl font-bold mb-6">
          How to Calculate Brickwork Quantity
        </h1>

        <p className="text-slate-300 text-lg mb-10">
          Learn how to calculate brickwork quantity, number of bricks, wall
          volume, mortar quantity, cement requirement, sand requirement and
          brickwork material estimation with practical construction examples.
        </p>

        <Link
          href="/brickwork-calculator"
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
            approximate number of bricks can be calculated by multiplying the
            volume by 500 bricks per cubic meter for standard modular bricks.
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
              </tbody>
            </table>
          </div>

          <p className="text-slate-400 leading-7 mt-5">
            Example: For a wall of 5 m length, 3 m height and 230 mm thickness,
            brickwork volume is 5 × 3 × 0.23 = 3.45 m³. Approximate bricks
            required are 3.45 × 500 = 1,725 bricks. Wastage can be added
            separately based on site condition.
          </p>
        </section>
        <section className="space-y-8">
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Brickwork Quantity Formula
            </h2>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-orange-400 font-mono text-lg">
              Wall Volume = Length × Height × Thickness
            </div>

            <p className="text-slate-300 mt-4 leading-7">
              Brickwork quantity is calculated using wall volume, brick size,
              mortar thickness, openings deduction and wastage allowance.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              What is Brickwork Quantity Calculation?
            </h2>

            <p className="text-slate-300 leading-7 mb-4">
              Brickwork quantity calculation is the process of estimating the
              number of bricks, mortar volume, cement and sand required for wall
              construction. It is commonly used by civil engineers, contractors,
              quantity surveyors and site engineers.
            </p>

            <p className="text-slate-300 leading-7">
              Accurate brickwork estimation helps reduce material wastage,
              improve construction budgeting and prepare BOQ for masonry work.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Steps to Calculate Brickwork Quantity
            </h2>

            <ul className="list-disc pl-6 space-y-2 text-slate-300">
              <li>Measure wall length</li>
              <li>Measure wall height</li>
              <li>Select wall thickness</li>
              <li>Calculate gross wall volume</li>
              <li>Deduct openings for doors and windows</li>
              <li>Calculate brick volume with mortar</li>
              <li>Calculate number of bricks</li>
              <li>Calculate mortar quantity</li>
              <li>Estimate cement and sand requirement</li>
            </ul>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Standard Brick Size
            </h2>

            <p className="text-slate-300 leading-7">
              Standard modular brick size is commonly taken as 190 mm × 90 mm ×
              90 mm without mortar. With mortar, the nominal brick size is often
              considered as 200 mm × 100 mm × 100 mm.
            </p>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-orange-400 font-mono text-lg mt-4">
              Nominal Brick Volume = 0.2 × 0.1 × 0.1 = 0.002 m³
            </div>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Brickwork Calculation Example
            </h2>

            <p className="text-slate-300 leading-7">
              Consider a wall with:
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
              Number of Bricks Calculation
            </h2>

            <p className="text-slate-300 leading-7">
              Number of bricks can be calculated by dividing wall volume by
              nominal brick volume.
            </p>

            <p className="text-slate-300 leading-7 mt-4">
              Number of Bricks = Wall Volume / Brick Volume
              <br />
              Number of Bricks = 3.45 / 0.002
              <br />
              Number of Bricks = 1725 bricks
            </p>

            <p className="text-slate-300 leading-7 mt-4">
              Add 5% to 10% wastage depending on site condition and brick quality.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Mortar Quantity for Brickwork
            </h2>

            <p className="text-slate-300 leading-7">
              Mortar quantity is calculated by subtracting total brick volume
              from wall volume. Cement and sand are then calculated based on the
              selected mortar ratio such as 1:4, 1:5 or 1:6.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Benefits of Brickwork Quantity Estimation
            </h2>

            <ul className="list-disc pl-6 space-y-2 text-slate-300">
              <li>Helps calculate exact number of bricks</li>
              <li>Improves cement and sand estimation</li>
              <li>Reduces material wastage</li>
              <li>Supports contractor billing</li>
              <li>Useful for BOQ preparation</li>
              <li>Improves project cost control</li>
            </ul>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Related Calculators
            </h2>

            <ul className="list-disc pl-6 space-y-2 text-slate-300">
              <li><a href="/brickwork-calculator">Brickwork Calculator</a></li>
              <li><a href="/plaster-calculator">Plaster Calculator</a></li>
              <li><a href="/concrete-volume-calculator">Concrete Volume Calculator</a></li>
              <li><a href="/excavation-calculator">Excavation Calculator</a></li>
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
      </div>
    </main>
  );
}
