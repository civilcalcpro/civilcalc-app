import Link from "next/link";

export const metadata = {
  title: "Excavation Calculator | Earthwork Quantity | CivilCalc Pro",
  description:
    "Free online excavation calculator for civil engineers and contractors. Calculate earthwork quantity, excavation volume, cutting volume, filling volume and construction cost estimation.",
  alternates: {
    canonical: "https://civilcalcpro.in/excavation-calculator",
  },
  openGraph: {
    title: "Excavation Calculator | Earthwork Quantity | CivilCalc Pro",
    description:
      "Free online excavation calculator for civil engineers and contractors. Calculate earthwork quantity, excavation volume, cutting volume, filling volume and construction cost estimation.",
    url: "https://civilcalcpro.in/excavation-calculator",
    siteName: "CivilCalc Pro",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Excavation Calculator | Earthwork Quantity | CivilCalc Pro",
    description:
      "Free online excavation calculator for civil engineers and contractors. Calculate earthwork quantity, excavation volume, cutting volume, filling volume and construction cost estimation.",
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

export default function ExcavationCalculatorPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How is excavation quantity calculated?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Excavation quantity is calculated by multiplying excavation length, width and depth. The formula is length multiplied by width multiplied by depth.",
        },
      },
      {
        "@type": "Question",
        name: "What is the formula for excavation volume?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The basic excavation volume formula is length multiplied by width multiplied by depth. The result gives excavation quantity in cubic meters when dimensions are entered in meters.",
        },
      },
      {
        "@type": "Question",
        name: "How do you calculate earthwork quantity?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Earthwork quantity is calculated by measuring the length, width and depth of excavation or filling and multiplying these dimensions to get volume.",
        },
      },
      {
        "@type": "Question",
        name: "Where is excavation calculation used?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Excavation calculation is used for foundation excavation, trench work, basement excavation, road cutting and filling, pipeline work and site leveling.",
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
          Excavation Calculator
        </h1>

        <p className="text-slate-300 text-lg mb-10">
          Free online excavation calculator for civil engineers, contractors,
          and site engineers. Calculate earthwork quantity, excavation volume,
          cutting volume, filling volume, and construction cost estimation.
        </p>

        <Link
          href="/login?redirect=/dashboard/calculators/excavation"
          className="inline-block bg-orange-500 hover:bg-orange-600 transition px-6 py-3 rounded-xl font-semibold mb-16"
        >
          Open Excavation Calculator
        </Link>

        <section className="rounded-2xl border border-orange-500/30 bg-orange-500/5 p-8 mb-12">
          <p className="text-orange-400 font-semibold mb-3">
            QUICK ANSWER
          </p>

          <h2 className="text-3xl font-bold mb-5">
            How to calculate excavation quantity?
          </h2>

          <p className="text-slate-300 leading-8 mb-4">
            Excavation quantity is calculated by multiplying excavation length,
            width and depth. The result gives earthwork excavation volume in
            cubic meters. For trenches, footings and foundation pits, the same
            basic formula is used with the required dimensions.
          </p>

          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 my-6">
            <p className="text-xl font-bold text-white mb-2">
              Excavation Volume = Length × Width × Depth
            </p>

            <p className="text-slate-400">
              Length, width and depth should be entered in the same unit.
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
                    Excavation Length
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
                    Excavation Width
                  </td>
                  <td className="border border-slate-800 p-3">
                    W
                  </td>
                  <td className="border border-slate-800 p-3">
                    1.2 m
                  </td>
                </tr>

                <tr>
                  <td className="border border-slate-800 p-3">
                    Excavation Depth
                  </td>
                  <td className="border border-slate-800 p-3">
                    D
                  </td>
                  <td className="border border-slate-800 p-3">
                    1.5 m
                  </td>
                </tr>

                <tr>
                  <td className="border border-slate-800 p-3">
                    Excavation Volume
                  </td>
                  <td className="border border-slate-800 p-3">
                    10 × 1.2 × 1.5
                  </td>
                  <td className="border border-slate-800 p-3">
                    18 m³
                  </td>
                </tr>

                <tr>
                  <td className="border border-slate-800 p-3">
                    With 10% Extra
                  </td>
                  <td className="border border-slate-800 p-3">
                    18 × 1.10
                  </td>
                  <td className="border border-slate-800 p-3">
                    19.8 m³
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-slate-400 leading-7 mt-5">
            Example: If excavation length is 10 m, width is 1.2 m and depth is
            1.5 m, excavation quantity is 10 × 1.2 × 1.5 = 18 m³. Extra quantity
            can be added for working space, side slope, soil bulking or site
            condition.
          </p>
        </section>

        <div className="grid md:grid-cols-2 gap-10">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">
              Features
            </h2>

            <ul className="space-y-3 text-slate-300">
              <li>• Excavation volume calculation</li>
              <li>• Earthwork quantity estimation</li>
              <li>• Cutting and filling volume calculation</li>
              <li>• Foundation excavation planning</li>
              <li>• Construction cost estimation</li>
              <li>• Site quantity analysis</li>
            </ul>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">
              Why Use CivilCalc Pro?
            </h2>

            <p className="text-slate-300 leading-8">
              CivilCalc Pro helps engineers and contractors calculate excavation
              quantities quickly using professional construction estimation
              tools. Useful for site engineers, quantity surveyors, contractors,
              and construction professionals.
            </p>
          </div>
        </div>

        <section className="mt-16 space-y-8">
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Excavation Volume Formula
            </h2>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-orange-400 font-mono text-lg">
              Volume = Length × Width × Depth
            </div>

            <p className="text-slate-300 mt-4">
              Excavation quantity is generally calculated by multiplying length,
              width, and depth of the excavated area.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              What is an Excavation Calculator?
            </h2>

            <p className="text-slate-300 leading-7 mb-4">
              An Excavation Calculator is used to estimate the quantity of
              earthwork required for foundations, trenches, basements, pits,
              roadwork, and site preparation. It helps civil engineers and
              contractors calculate excavation volume before starting
              construction work.
            </p>

            <p className="text-slate-300 leading-7">
              Accurate excavation quantity estimation helps control project
              cost, plan machinery, estimate labour, and reduce material
              handling errors at construction sites.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Common Uses of Excavation Calculation
            </h2>

            <ul className="list-disc pl-6 space-y-2 text-slate-300">
              <li>Foundation excavation</li>
              <li>Trench excavation</li>
              <li>Basement excavation</li>
              <li>Road cutting and filling</li>
              <li>Pipeline trench work</li>
              <li>Site leveling and earthwork estimation</li>
            </ul>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Excavation Calculation Example
            </h2>

            <p className="text-slate-300 leading-7">
              Consider an excavation pit with:
            </p>

            <ul className="list-disc pl-6 space-y-2 text-slate-300 mt-4">
              <li>Length = 10 m</li>
              <li>Width = 5 m</li>
              <li>Depth = 2 m</li>
            </ul>

            <p className="text-slate-300 leading-7 mt-4">
              Excavation Volume = Length × Width × Depth
              <br />
              Volume = 10 × 5 × 2
              <br />
              Volume = 100 m³
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Benefits of Accurate Excavation Estimation
            </h2>

            <ul className="list-disc pl-6 space-y-2 text-slate-300">
              <li>Improves earthwork cost estimation</li>
              <li>Helps plan labour and machinery</li>
              <li>Reduces site measurement errors</li>
              <li>Supports contractor billing and BOQ preparation</li>
              <li>Improves project scheduling</li>
              <li>Reduces wastage and rework</li>
            </ul>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Related Calculators
            </h2>

            <ul className="list-disc pl-6 space-y-2 text-slate-300">
              <li>
                <Link href="/concrete-volume-calculator">
                  Concrete Volume Calculator
                </Link>
              </li>
              <li>
                <Link href="/footing-design">
                  Footing Design Calculator
                </Link>
              </li>
              <li>
                <Link href="/brickwork-calculator">
                  Brickwork Calculator
                </Link>
              </li>
              <li>
                <Link href="/plaster-calculator">
                  Plaster Calculator
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
