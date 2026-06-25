import Link from "next/link";

export const metadata = {
  title: "Steel Weight Calculator | Bar Weight Formula | CivilCalc Pro",
  description:
    "Free online steel weight calculator using D²/162 formula. Calculate reinforcement bar weight for 6mm, 8mm, 10mm, 12mm, 16mm, 20mm and more.",
  alternates: {
    canonical: "https://civilcalcpro.in/steel-weight-calculator",
  },
  openGraph: {
    title: "Steel Weight Calculator | Bar Weight Formula | CivilCalc Pro",
    description:
      "Free online steel weight calculator using D²/162 formula. Calculate reinforcement bar weight for 6mm, 8mm, 10mm, 12mm, 16mm, 20mm and more.",
    url: "https://civilcalcpro.in/steel-weight-calculator",
    siteName: "CivilCalc Pro",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Steel Weight Calculator | Bar Weight Formula | CivilCalc Pro",
    description:
      "Free online steel weight calculator using D²/162 formula. Calculate reinforcement bar weight for 6mm, 8mm, 10mm, 12mm, 16mm, 20mm and more.",
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

export default function SteelWeightCalculatorPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How is steel weight calculated?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Steel weight is calculated using D squared divided by 162 multiplied by length. D is the bar diameter in millimeters and length is in meters.",
        },
      },
      {
        "@type": "Question",
        name: "What is the formula for steel bar weight?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The commonly used steel bar weight formula is D squared divided by 162 multiplied by length. The result gives approximate weight in kilograms.",
        },
      },
      {
        "@type": "Question",
        name: "What is the weight of 12 mm steel bar per meter?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The approximate weight of 12 mm steel bar is 0.889 kg per meter, calculated using 12 squared divided by 162.",
        },
      },
      {
        "@type": "Question",
        name: "Where is steel weight calculation used?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Steel weight calculation is used in RCC beams, columns, slabs, footings, bar bending schedules, BOQ preparation and construction material estimation.",
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
          Steel Weight Calculator
        </h1>

        <p className="text-slate-300 text-lg mb-10">
          Free online steel weight calculator for civil engineers, contractors,
          and students. Calculate TMT bar weight, reinforcement steel quantity,
          and steel estimation instantly.
        </p>

        <Link
          href="/login?redirect=/dashboard/calculators/steel-weight"
          className="inline-block bg-orange-500 hover:bg-orange-600 transition px-6 py-3 rounded-xl font-semibold mb-16"
        >
          Open Steel Weight Calculator
        </Link>

        <section className="rounded-2xl border border-orange-500/30 bg-orange-500/5 p-8 mb-12">
          <p className="text-orange-400 font-semibold mb-3">
            QUICK ANSWER
          </p>

          <h2 className="text-3xl font-bold mb-5">
            How to calculate steel weight?
          </h2>

          <p className="text-slate-300 leading-8 mb-4">
            Steel weight is calculated using the formula D² / 162 × length,
            where D is the diameter of the steel bar in millimeters and length
            is in meters. This formula gives the approximate weight of steel
            reinforcement bars in kilograms.
          </p>

          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 my-6">
            <p className="text-xl font-bold text-white mb-2">
              Steel Weight = D² / 162 × Length
            </p>

            <p className="text-slate-400">
              D = bar diameter in mm, Length = bar length in meter.
            </p>
          </div>

          <div className="overflow-x-auto mt-6">
            <table className="w-full border border-slate-800 text-left">
              <thead className="bg-slate-900">
                <tr>
                  <th className="border border-slate-800 p-3 text-white">
                    Bar Diameter
                  </th>
                  <th className="border border-slate-800 p-3 text-white">
                    Weight per Meter Formula
                  </th>
                  <th className="border border-slate-800 p-3 text-white">
                    Approx. Weight
                  </th>
                </tr>
              </thead>

              <tbody className="text-slate-300">
                <tr>
                  <td className="border border-slate-800 p-3">8 mm</td>
                  <td className="border border-slate-800 p-3">8² / 162</td>
                  <td className="border border-slate-800 p-3">0.395 kg/m</td>
                </tr>

                <tr>
                  <td className="border border-slate-800 p-3">10 mm</td>
                  <td className="border border-slate-800 p-3">10² / 162</td>
                  <td className="border border-slate-800 p-3">0.617 kg/m</td>
                </tr>

                <tr>
                  <td className="border border-slate-800 p-3">12 mm</td>
                  <td className="border border-slate-800 p-3">12² / 162</td>
                  <td className="border border-slate-800 p-3">0.889 kg/m</td>
                </tr>

                <tr>
                  <td className="border border-slate-800 p-3">16 mm</td>
                  <td className="border border-slate-800 p-3">16² / 162</td>
                  <td className="border border-slate-800 p-3">1.580 kg/m</td>
                </tr>

                <tr>
                  <td className="border border-slate-800 p-3">20 mm</td>
                  <td className="border border-slate-800 p-3">20² / 162</td>
                  <td className="border border-slate-800 p-3">2.469 kg/m</td>
                </tr>

                <tr>
                  <td className="border border-slate-800 p-3">25 mm</td>
                  <td className="border border-slate-800 p-3">25² / 162</td>
                  <td className="border border-slate-800 p-3">3.858 kg/m</td>
                </tr>

                <tr>
                  <td className="border border-slate-800 p-3">32 mm</td>
                  <td className="border border-slate-800 p-3">32² / 162</td>
                  <td className="border border-slate-800 p-3">6.321 kg/m</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-slate-400 leading-7 mt-5">
            Example: For a 12 mm diameter steel bar of 10 m length, steel
            weight is 12² / 162 × 10 = 8.89 kg approximately.
          </p>
        </section>

        <div className="grid md:grid-cols-2 gap-10">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">
              Features
            </h2>

            <ul className="space-y-3 text-slate-300">
              <li>• TMT bar weight calculation</li>
              <li>• Reinforcement steel estimation</li>
              <li>• Steel quantity analysis</li>
              <li>• Construction material estimation</li>
              <li>• Fast engineering calculations</li>
              <li>• Site quantity planning</li>
            </ul>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">
              Why Use CivilCalc Pro?
            </h2>

            <p className="text-slate-300 leading-8">
              CivilCalc Pro helps engineers and contractors calculate
              reinforcement steel quantities quickly using professional
              construction estimation tools. Ideal for quantity surveyors, site
              engineers, contractors and students.
            </p>
          </div>
        </div>

        <section className="mt-16 space-y-8">
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Steel Weight Formula
            </h2>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-orange-400 font-mono text-lg">
              Weight = D² / 162 × Length
            </div>

            <p className="text-slate-300 mt-4">
              Steel weight calculator is used for reinforcement quantity
              estimation in RCC construction work.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              What is a Steel Weight Calculator?
            </h2>

            <p className="text-slate-300 leading-7 mb-4">
              A Steel Weight Calculator is used to determine the weight of
              reinforcement bars used in RCC construction. Civil engineers,
              contractors and quantity surveyors use steel weight calculations
              for estimation, procurement and project planning.
            </p>

            <p className="text-slate-300 leading-7">
              Accurate steel estimation helps reduce material wastage and
              improves project cost control.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Common TMT Bar Sizes
            </h2>

            <ul className="list-disc pl-6 space-y-2 text-slate-300">
              <li>6 mm TMT Bar</li>
              <li>8 mm TMT Bar</li>
              <li>10 mm TMT Bar</li>
              <li>12 mm TMT Bar</li>
              <li>16 mm TMT Bar</li>
              <li>20 mm TMT Bar</li>
              <li>25 mm TMT Bar</li>
              <li>32 mm TMT Bar</li>
            </ul>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Steel Weight Calculation Example
            </h2>

            <p className="text-slate-300 leading-7">
              For a 12 mm diameter reinforcement bar:
            </p>

            <p className="text-slate-300 leading-7 mt-4">
              Weight per meter = D² / 162
              <br />
              = 12² / 162
              <br />
              = 0.889 kg/m
            </p>

            <p className="text-slate-300 leading-7 mt-4">
              Therefore, a 12 mm bar of 10 m length weighs approximately
              8.89 kg.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Uses of Steel Weight Calculation
            </h2>

            <ul className="list-disc pl-6 space-y-2 text-slate-300">
              <li>RCC beam reinforcement estimation</li>
              <li>Column reinforcement calculation</li>
              <li>Footing reinforcement planning</li>
              <li>Slab steel quantity estimation</li>
              <li>BOQ and BBS preparation</li>
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
                <Link href="/one-way-slab-calculator">
                  One-Way Slab Calculator
                </Link>
              </li>
              <li>
                <Link href="/two-way-slab-calculator">
                  Two-Way Slab Calculator
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
