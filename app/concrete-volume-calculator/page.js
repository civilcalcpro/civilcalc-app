import Link from "next/link";

export const metadata = {
  title: "Concrete Volume Calculator | Cement Sand Aggregate | CivilCalc Pro",
  description:
    "Free online concrete volume calculator to calculate wet volume, dry volume, cement bags, sand and aggregate quantity for construction work.",
  alternates: {
    canonical: "https://civilcalcpro.in/concrete-volume-calculator",
  },
  openGraph: {
    title: "Concrete Volume Calculator | Cement Sand Aggregate | CivilCalc Pro",
    description:
      "Free online concrete volume calculator to calculate wet volume, dry volume, cement bags, sand and aggregate quantity for construction work.",
    url: "https://civilcalcpro.in/concrete-volume-calculator",
    siteName: "CivilCalc Pro",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Concrete Volume Calculator | Cement Sand Aggregate | CivilCalc Pro",
    description:
      "Free online concrete volume calculator to calculate wet volume, dry volume, cement bags, sand and aggregate quantity for construction work.",
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

export default function ConcreteVolumeCalculatorPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How is concrete volume calculated?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Concrete volume is calculated by multiplying length, width and depth or thickness of the structural member. The formula is length multiplied by width multiplied by depth.",
        },
      },
      {
        "@type": "Question",
        name: "What is the formula for concrete volume?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The basic concrete volume formula is length multiplied by width multiplied by depth. When dimensions are entered in meters, the result is obtained in cubic meters.",
        },
      },
      {
        "@type": "Question",
        name: "What is dry volume of concrete?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Dry volume of concrete is used to estimate cement, sand and aggregate quantity. It is commonly calculated by multiplying wet concrete volume by 1.54.",
        },
      },
      {
        "@type": "Question",
        name: "Where is concrete volume calculation used?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Concrete volume calculation is used for slabs, beams, columns, footings, PCC work, RCC work and other construction quantity estimation.",
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
          Concrete Volume Calculator
        </h1>

        <p className="text-slate-300 text-lg mb-10">
          Free online concrete volume calculator for civil engineers,
          contractors, and students. Calculate concrete quantity for slabs,
          beams, columns, footings, and construction projects instantly.
        </p>

        <Link
          href="/login?redirect=/dashboard/calculators/concrete-volume"
          className="inline-block bg-orange-500 hover:bg-orange-600 transition px-6 py-3 rounded-xl font-semibold mb-16"
        >
          Open Concrete Calculator
        </Link>

        <section className="rounded-2xl border border-orange-500/30 bg-orange-500/5 p-8 mb-12">
          <p className="text-orange-400 font-semibold mb-3">
            QUICK ANSWER
          </p>

          <h2 className="text-3xl font-bold mb-5">
            How to calculate concrete volume?
          </h2>

          <p className="text-slate-300 leading-8 mb-4">
            Concrete volume is calculated by multiplying length, width and
            depth or thickness of the structural member. The result gives wet
            concrete volume in cubic meters. This formula is commonly used for
            slabs, beams, columns, footings and PCC work.
          </p>

          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 my-6">
            <p className="text-xl font-bold text-white mb-2">
              Concrete Volume = Length × Width × Depth
            </p>

            <p className="text-xl font-bold text-white mb-2">
              Dry Volume = Wet Volume × 1.54
            </p>

            <p className="text-slate-400">
              All dimensions should be entered in meters to get volume in m³.
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
                    Length
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
                    Width
                  </td>
                  <td className="border border-slate-800 p-3">
                    W
                  </td>
                  <td className="border border-slate-800 p-3">
                    3 m
                  </td>
                </tr>

                <tr>
                  <td className="border border-slate-800 p-3">
                    Depth / Thickness
                  </td>
                  <td className="border border-slate-800 p-3">
                    D
                  </td>
                  <td className="border border-slate-800 p-3">
                    0.15 m
                  </td>
                </tr>

                <tr>
                  <td className="border border-slate-800 p-3">
                    Wet Concrete Volume
                  </td>
                  <td className="border border-slate-800 p-3">
                    5 × 3 × 0.15
                  </td>
                  <td className="border border-slate-800 p-3">
                    2.25 m³
                  </td>
                </tr>

                <tr>
                  <td className="border border-slate-800 p-3">
                    Dry Volume
                  </td>
                  <td className="border border-slate-800 p-3">
                    2.25 × 1.54
                  </td>
                  <td className="border border-slate-800 p-3">
                    3.47 m³
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-slate-400 leading-7 mt-5">
            Example: For a slab of 5 m length, 3 m width and 150 mm thickness,
            concrete volume is 5 × 3 × 0.15 = 2.25 m³. Dry volume is commonly
            taken as 2.25 × 1.54 = 3.47 m³ for cement, sand and aggregate
            calculation.
          </p>
        </section>

        <div className="grid md:grid-cols-2 gap-10">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">
              Features
            </h2>

            <ul className="space-y-3 text-slate-300">
              <li>• Slab concrete calculation</li>
              <li>• Beam concrete estimation</li>
              <li>• Column concrete volume</li>
              <li>• Footing quantity calculation</li>
              <li>• Wet volume and dry volume calculation</li>
              <li>• Cement, sand and aggregate estimation</li>
            </ul>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">
              Why Use CivilCalc Pro?
            </h2>

            <p className="text-slate-300 leading-8">
              CivilCalc Pro helps engineers and contractors calculate concrete
              quantities quickly using professional construction tools and
              estimation workflows. Ideal for quantity surveyors, site
              engineers, contractors and civil engineering students.
            </p>
          </div>
        </div>

        <section className="mt-16 space-y-8">
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Concrete Volume Formula
            </h2>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-orange-400 font-mono text-lg">
              Volume = Length × Width × Depth
            </div>

            <p className="text-slate-300 mt-4">
              Concrete volume is generally calculated by multiplying length,
              width and depth or thickness of the structural member.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              What is a Concrete Volume Calculator?
            </h2>

            <p className="text-slate-300 leading-7 mb-4">
              A Concrete Volume Calculator is used to estimate the quantity of
              concrete required for slabs, beams, columns, footings and other
              structural elements. Civil engineers and contractors use concrete
              calculations for material estimation and project planning.
            </p>

            <p className="text-slate-300 leading-7">
              Accurate concrete quantity estimation helps reduce material
              wastage, improve budgeting and optimize construction operations.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Wet Volume and Dry Volume
            </h2>

            <p className="text-slate-300 leading-7 mb-4">
              Wet volume is the actual volume of concrete required for the
              structural member. Dry volume is used to calculate cement, sand
              and aggregate quantity.
            </p>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-orange-400 font-mono text-lg">
              Dry Volume = Wet Volume × 1.54
            </div>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Concrete Calculation Example
            </h2>

            <p className="text-slate-300 leading-7">
              Consider a slab with:
            </p>

            <ul className="list-disc pl-6 space-y-2 text-slate-300 mt-4">
              <li>Length = 5 m</li>
              <li>Width = 4 m</li>
              <li>Thickness = 0.15 m</li>
            </ul>

            <p className="text-slate-300 leading-7 mt-4">
              Volume = 5 × 4 × 0.15
              <br />
              Volume = 3.0 m³
              <br />
              Dry Volume = 3.0 × 1.54 = 4.62 m³
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Uses of Concrete Volume Calculation
            </h2>

            <ul className="list-disc pl-6 space-y-2 text-slate-300">
              <li>Slab concrete estimation</li>
              <li>Beam concrete calculation</li>
              <li>Column volume estimation</li>
              <li>Footing quantity calculation</li>
              <li>PCC and RCC work estimation</li>
              <li>Material procurement planning</li>
            </ul>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Related Calculators
            </h2>

            <ul className="list-disc pl-6 space-y-2 text-slate-300">
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
              <li>
                <Link href="/excavation-calculator">
                  Excavation Calculator
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
