import Link from "next/link";

export const metadata = {
  title: "RCC Footing Design Calculator | CivilCalc Pro",
  description:
    "Free online RCC footing design calculator for civil engineers and students. Calculate footing size, soil pressure, reinforcement steel, loads, bending moments, and structural design as per IS 456.",
  alternates: {
    canonical: "https://civilcalcpro.in/footing-design",
  },
  openGraph: {
    title: "RCC Footing Design Calculator | CivilCalc Pro",
    description:
      "Free online RCC footing design calculator for civil engineers and students. Calculate footing size, soil pressure, reinforcement steel, loads, bending moments, and structural design as per IS 456.",
    url: "https://civilcalcpro.in/footing-design",
    siteName: "CivilCalc Pro",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "RCC Footing Design Calculator | CivilCalc Pro",
    description:
      "Free online RCC footing design calculator for civil engineers and students. Calculate footing size, soil pressure, reinforcement steel, loads, bending moments, and structural design as per IS 456.",
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

export default function FootingDesignPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How is isolated footing size calculated?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Isolated footing size is commonly calculated by dividing column load by safe bearing capacity of soil. The required footing area is then used to select footing length and width.",
        },
      },
      {
        "@type": "Question",
        name: "What is the formula for footing area?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The basic footing area formula is column load divided by safe bearing capacity of soil. Area equals load divided by SBC.",
        },
      },
      {
        "@type": "Question",
        name: "What checks are required in RCC footing design?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Common RCC footing design checks include soil pressure, bending moment, one-way shear, punching shear, effective depth and reinforcement steel.",
        },
      },
      {
        "@type": "Question",
        name: "Which inputs are required for footing design?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Common inputs for footing design include column load, safe bearing capacity of soil, column size, concrete grade, steel grade, clear cover and footing dimensions.",
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
          RCC Footing Design Calculator
        </h1>

        <p className="text-slate-300 text-lg mb-10">
          Free online RCC footing design calculator for civil engineers and
          students. Calculate footing dimensions, soil pressure, reinforcement
          steel, bending moments, and structural design as per IS 456 code.
        </p>

        <Link
          href="/login?redirect=/dashboard/calculators/footing"
          className="inline-block bg-orange-500 hover:bg-orange-600 transition px-6 py-3 rounded-xl font-semibold mb-16"
        >
          Open Footing Design Calculator
        </Link>

        <section className="rounded-2xl border border-orange-500/30 bg-orange-500/5 p-8 mb-12">
          <p className="text-orange-400 font-semibold mb-3">
            QUICK ANSWER
          </p>

          <h2 className="text-3xl font-bold mb-5">
            How to design an isolated footing?
          </h2>

          <p className="text-slate-300 leading-8 mb-4">
            Isolated footing design is done by calculating the required footing
            area from column load and safe bearing capacity of soil. After
            footing size is selected, depth, bending moment, shear force and
            reinforcement are checked based on concrete grade, steel grade and
            soil pressure.
          </p>

          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 my-6">
            <p className="text-xl font-bold text-white mb-2">
              Required Footing Area = Column Load / Safe Bearing Capacity
            </p>

            <p className="text-xl font-bold text-white mb-2">
              Square Footing Side = √Required Area
            </p>

            <p className="text-slate-400">
              Column load is usually taken in kN and safe bearing capacity in
              kN/m².
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
                    Column Load
                  </td>
                  <td className="border border-slate-800 p-3">
                    P
                  </td>
                  <td className="border border-slate-800 p-3">
                    800 kN
                  </td>
                </tr>

                <tr>
                  <td className="border border-slate-800 p-3">
                    Safe Bearing Capacity
                  </td>
                  <td className="border border-slate-800 p-3">
                    SBC
                  </td>
                  <td className="border border-slate-800 p-3">
                    200 kN/m²
                  </td>
                </tr>

                <tr>
                  <td className="border border-slate-800 p-3">
                    Required Area
                  </td>
                  <td className="border border-slate-800 p-3">
                    800 / 200
                  </td>
                  <td className="border border-slate-800 p-3">
                    4 m²
                  </td>
                </tr>

                <tr>
                  <td className="border border-slate-800 p-3">
                    Square Footing Size
                  </td>
                  <td className="border border-slate-800 p-3">
                    √4
                  </td>
                  <td className="border border-slate-800 p-3">
                    2 m × 2 m
                  </td>
                </tr>

                <tr>
                  <td className="border border-slate-800 p-3">
                    Design Checks
                  </td>
                  <td className="border border-slate-800 p-3">
                    Bending, shear and reinforcement
                  </td>
                  <td className="border border-slate-800 p-3">
                    Checked after sizing
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-slate-400 leading-7 mt-5">
            Example: If column load is 800 kN and soil safe bearing capacity is
            200 kN/m², required footing area is 800 / 200 = 4 m². For a square
            isolated footing, footing size can be taken as 2 m × 2 m before
            checking depth, bending, shear and reinforcement.
          </p>
        </section>

        <div className="grid md:grid-cols-2 gap-10">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">
              Features
            </h2>

            <ul className="space-y-3 text-slate-300">
              <li>• Footing size calculation</li>
              <li>• Soil pressure check</li>
              <li>• Load and bearing capacity checks</li>
              <li>• Steel reinforcement estimation</li>
              <li>• IS 456 based RCC footing design</li>
              <li>• Fast structural analysis</li>
            </ul>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">
              Why Use CivilCalc Pro?
            </h2>

            <p className="text-slate-300 leading-8">
              CivilCalc Pro helps civil engineers perform RCC footing design
              quickly using engineering tools and structural calculations.
              Useful for students, site engineers, consultants, and construction
              professionals.
            </p>
          </div>
        </div>

        <section className="mt-16 space-y-8">
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Footing Design Formula
            </h2>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-orange-400 font-mono text-lg">
              Area = Load / SBC
            </div>

            <p className="text-slate-300 mt-4">
              Footing design is used to safely transfer structural loads to
              soil. The required footing area depends on column load and safe
              bearing capacity of soil.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              What is RCC Footing Design?
            </h2>

            <p className="text-slate-300 leading-7 mb-4">
              RCC Footing Design is the process of designing a reinforced
              concrete foundation that safely transfers structural loads from
              columns to the soil. Proper footing design helps prevent excessive
              settlement and improves structural stability.
            </p>

            <p className="text-slate-300 leading-7">
              Footings are one of the most important structural elements because
              they support the entire building and distribute loads to the
              ground.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Types of Footings
            </h2>

            <ul className="list-disc pl-6 space-y-2 text-slate-300">
              <li>Isolated Footing</li>
              <li>Combined Footing</li>
              <li>Strap Footing</li>
              <li>Raft Foundation</li>
              <li>Pile Foundation</li>
              <li>Wall Footing</li>
            </ul>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Steps in RCC Footing Design
            </h2>

            <ul className="list-disc pl-6 space-y-2 text-slate-300">
              <li>Determine column load</li>
              <li>Obtain safe bearing capacity of soil</li>
              <li>Calculate footing area</li>
              <li>Select footing dimensions</li>
              <li>Check soil pressure</li>
              <li>Check bending moments</li>
              <li>Check one-way shear and punching shear</li>
              <li>Design reinforcement steel</li>
            </ul>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Footing Design Example
            </h2>

            <p className="text-slate-300 leading-7">
              Assume a column load of 800 kN and soil bearing capacity of
              200 kN/m².
            </p>

            <p className="text-slate-300 leading-7 mt-4">
              Required Area = Load / SBC
              <br />
              Area = 800 / 200
              <br />
              Area = 4.0 m²
              <br />
              Square footing size = √4 = 2 m × 2 m
            </p>
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
