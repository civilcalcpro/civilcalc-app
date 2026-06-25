import Link from "next/link";

export const metadata = {
  title: 'Plaster Calculator | Cement Sand Quantity | CivilCalc Pro',
  description:
    'Free online plaster calculator to calculate plaster area, cement bags, sand quantity and cost for internal and external wall plaster work.',
  alternates: {
    canonical: 'https://civilcalcpro.in/plaster-calculator',
  },
  openGraph: {
    title: 'Plaster Calculator | Cement Sand Quantity | CivilCalc Pro',
    description:
      'Free online plaster calculator to calculate plaster area, cement bags, sand quantity and cost for internal and external wall plaster work.',
    url: 'https://civilcalcpro.in/plaster-calculator',
    siteName: 'CivilCalc Pro',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Plaster Calculator | Cement Sand Quantity | CivilCalc Pro',
    description:
      'Free online plaster calculator to calculate plaster area, cement bags, sand quantity and cost for internal and external wall plaster work.',
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

export default function PlasterCalculatorPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How is plaster quantity calculated?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Plaster quantity is calculated by multiplying wall length and height to get plaster area. Then plaster area is multiplied by plaster thickness to get wet mortar volume.",
        },
      },
      {
        "@type": "Question",
        name: "What is the formula for plaster calculation?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The basic plaster calculation formula is plaster area equals length multiplied by height. Wet volume equals plaster area multiplied by plaster thickness. Dry volume is commonly taken as wet volume multiplied by 1.33.",
        },
      },
      {
        "@type": "Question",
        name: "What thickness is used for wall plaster?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "For common internal wall plaster, 12 mm thickness is often used, which is taken as 0.012 meter in plaster quantity calculation.",
        },
      },
      {
        "@type": "Question",
        name: "How much cement and sand is required for plaster?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Cement and sand quantity for plaster depends on plaster area, thickness and mortar ratio such as 1:4, 1:5 or 1:6. First calculate dry volume, then divide materials according to the selected ratio.",
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
          Plaster Work Calculator
        </h1>

        <p className="text-slate-300 text-lg mb-10">
          Free online plaster work calculator for civil engineers,
          contractors, and students. Calculate plaster area, cement quantity,
          sand quantity, plaster thickness, and construction material estimation.
        </p>

        <Link
          href="/login?redirect=/dashboard/calculators/plaster"
          className="inline-block bg-orange-500 hover:bg-orange-600 transition px-6 py-3 rounded-xl font-semibold mb-16"
        >
          Open Plaster Calculator
        </Link>
        <section className="rounded-2xl border border-orange-500/30 bg-orange-500/5 p-8 mb-12">
          <p className="text-orange-400 font-semibold mb-3">
            QUICK ANSWER
          </p>

          <h2 className="text-3xl font-bold mb-5">
            How to calculate plaster quantity?
          </h2>

          <p className="text-slate-300 leading-8 mb-4">
            Plaster quantity is calculated by multiplying wall length and wall
            height to get plaster area. After calculating plaster area, mortar
            volume is calculated using plaster thickness. Cement and sand
            quantities are then calculated based on the selected mortar ratio,
            such as 1:4, 1:5 or 1:6.
          </p>

          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 my-6">
            <p className="text-xl font-bold text-white mb-2">
              Plaster Area = Length × Height
            </p>
            <p className="text-xl font-bold text-white mb-2">
              Wet Volume = Area × Thickness
            </p>
            <p className="text-xl font-bold text-white mb-2">
              Dry Volume = Wet Volume × 1.33
            </p>
            <p className="text-slate-400">
              For 12 mm plaster, thickness is taken as 0.012 m.
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
                    10 m
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
                    Plaster Area
                  </td>
                  <td className="border border-slate-800 p-3">
                    10 × 3
                  </td>
                  <td className="border border-slate-800 p-3">
                    30 m²
                  </td>
                </tr>

                <tr>
                  <td className="border border-slate-800 p-3">
                    Plaster Thickness
                  </td>
                  <td className="border border-slate-800 p-3">
                    12 mm
                  </td>
                  <td className="border border-slate-800 p-3">
                    0.012 m
                  </td>
                </tr>

                <tr>
                  <td className="border border-slate-800 p-3">
                    Wet Volume
                  </td>
                  <td className="border border-slate-800 p-3">
                    30 × 0.012
                  </td>
                  <td className="border border-slate-800 p-3">
                    0.36 m³
                  </td>
                </tr>

                <tr>
                  <td className="border border-slate-800 p-3">
                    Dry Volume
                  </td>
                  <td className="border border-slate-800 p-3">
                    0.36 × 1.33
                  </td>
                  <td className="border border-slate-800 p-3">
                    0.48 m³
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-slate-400 leading-7 mt-5">
            Example: For a wall of 10 m length and 3 m height, plaster area is
            30 m². For 12 mm plaster thickness, wet volume is 0.36 m³ and dry
            volume is approximately 0.48 m³. Cement and sand are then calculated
            based on mortar ratio.
          </p>
        </section>
        <div className="grid md:grid-cols-2 gap-10">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">Features</h2>

            <ul className="space-y-3 text-slate-300">
              <li>• Wall plaster area calculation</li>
              <li>• Cement quantity estimation</li>
              <li>• Sand quantity estimation</li>
              <li>• Plaster thickness calculation</li>
              <li>• Material quantity analysis</li>
              <li>• Construction cost planning</li>
            </ul>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">
              Why Use CivilCalc Pro?
            </h2>

            <p className="text-slate-300 leading-8">
              CivilCalc Pro helps engineers and contractors calculate plaster
              quantities quickly using professional construction estimation
              tools. Ideal for site engineers, quantity surveyors,
              contractors, and students.
            </p>
          </div>
        </div>
      </div>

      <section className="mt-16">
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4">
            Plaster Work Formula
          </h2>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-orange-400 font-mono text-lg">
            Area = Length × Height
          </div>

          <p className="text-slate-300 mt-4">
            Plaster calculator estimates cement and sand quantity for wall plastering.
          </p>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4">
            What is a Plaster Work Calculator?
          </h2>

          <p className="text-slate-300 leading-7 mb-4">
            A Plaster Work Calculator is used to estimate the quantity of cement,
            sand and mortar required for wall and ceiling plastering. Civil engineers,
            contractors and quantity surveyors use plaster calculations for accurate
            material estimation and project planning.
          </p>

          <p className="text-slate-300 leading-7">
            Accurate plaster estimation helps reduce material wastage and improves
            construction cost control.
          </p>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4">
            Types of Plaster Work
          </h2>

          <ul className="list-disc pl-6 space-y-2 text-slate-300">
            <li>Internal Wall Plaster</li>
            <li>External Wall Plaster</li>
            <li>Ceiling Plaster</li>
            <li>Cement Plaster</li>
            <li>Gypsum Plaster</li>
            <li>Decorative Plaster</li>
          </ul>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4">
            Plaster Quantity Calculation Example
          </h2>

          <p className="text-slate-300 leading-7">
            Consider a wall having:
          </p>

          <ul className="list-disc pl-6 space-y-2 text-slate-300 mt-4">
            <li>Length = 5 m</li>
            <li>Height = 3 m</li>
            <li>Thickness = 12 mm</li>
          </ul>

          <p className="text-slate-300 leading-7 mt-4">
            Area = Length × Height
            <br />
            Area = 5 × 3
            <br />
            Area = 15 m²
          </p>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4">
            Benefits of Accurate Plaster Estimation
          </h2>

          <ul className="list-disc pl-6 space-y-2 text-slate-300">
            <li>Reduces material wastage</li>
            <li>Improves project budgeting</li>
            <li>Speeds up site planning</li>
            <li>Supports quantity surveying</li>
            <li>Improves procurement planning</li>
            <li>Enhances construction efficiency</li>
          </ul>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4">
            Related Calculators
          </h2>

          <ul className="list-disc pl-6 space-y-2 text-slate-300">
            <li><a href="/brickwork-calculator">Brickwork Calculator</a></li>
            <li><a href="/excavation-calculator">Excavation Calculator</a></li>
            <li><a href="/concrete-volume-calculator">Concrete Volume Calculator</a></li>
            <li><a href="/steel-weight-calculator">Steel Weight Calculator</a></li>
            <li><a href="/footing-design">Footing Design Calculator</a></li>
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
