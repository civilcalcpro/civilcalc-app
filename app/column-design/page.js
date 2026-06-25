import Link from "next/link";

export const metadata = {
  title: "RCC Column Design Calculator | CivilCalc Pro",
  description:
    "Free online RCC column design calculator for civil engineers and students. Calculate axial load, column size, reinforcement steel, slenderness ratio and RCC column design as per IS 456.",
  alternates: {
    canonical: "https://civilcalcpro.in/column-design",
  },
  openGraph: {
    title: "RCC Column Design Calculator | CivilCalc Pro",
    description:
      "Free online RCC column design calculator for civil engineers and students. Calculate axial load, column size, reinforcement steel, slenderness ratio and RCC column design as per IS 456.",
    url: "https://civilcalcpro.in/column-design",
    siteName: "CivilCalc Pro",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "RCC Column Design Calculator | CivilCalc Pro",
    description:
      "Free online RCC column design calculator for civil engineers and students. Calculate axial load, column size, reinforcement steel, slenderness ratio and RCC column design as per IS 456.",
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

export default function ColumnDesignPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How is an RCC column designed?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "RCC column design is done by calculating axial load, selecting column size, checking slenderness ratio, choosing concrete grade and steel grade, and designing longitudinal reinforcement and lateral ties.",
        },
      },
      {
        "@type": "Question",
        name: "What is the formula for RCC column load capacity?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "For a short axially loaded RCC column, load capacity is commonly checked using Pu equals 0.4 fck Ac plus 0.67 fy Asc, where fck is concrete grade, fy is steel grade, Ac is concrete area and Asc is steel area.",
        },
      },
      {
        "@type": "Question",
        name: "What is the minimum reinforcement in RCC column?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The minimum longitudinal reinforcement in an RCC column is commonly taken as 0.8 percent of the gross cross sectional area, subject to structural design code requirements.",
        },
      },
      {
        "@type": "Question",
        name: "Which inputs are required for RCC column design?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Common inputs for RCC column design include axial load, column size, effective length, concrete grade, steel grade, clear cover, bar diameter and support condition.",
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
          RCC Column Design Calculator
        </h1>

        <p className="text-slate-300 text-lg mb-10">
          Free online RCC column design calculator for civil engineers and
          students. Calculate axial load, column size, reinforcement steel,
          slenderness ratio, and RCC column design as per IS 456.
        </p>

        <Link
          href="/login?redirect=/dashboard/calculators/column"
          className="inline-block bg-orange-500 hover:bg-orange-600 transition px-6 py-3 rounded-xl font-semibold mb-16"
        >
          Open Column Design Calculator
        </Link>

        <section className="rounded-2xl border border-orange-500/30 bg-orange-500/5 p-8 mb-12">
          <p className="text-orange-400 font-semibold mb-3">
            QUICK ANSWER
          </p>

          <h2 className="text-3xl font-bold mb-5">
            How to design an RCC column?
          </h2>

          <p className="text-slate-300 leading-8 mb-4">
            RCC column design is done by calculating axial load, checking column
            size, selecting concrete grade and steel grade, and designing
            longitudinal reinforcement and lateral ties. For a short axially
            loaded RCC column, load capacity is commonly checked using concrete
            area and steel area.
          </p>

          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 my-6">
            <p className="text-xl font-bold text-white mb-2">
              Pu = 0.4 fck Ac + 0.67 fy Asc
            </p>

            <p className="text-slate-400">
              Pu = axial load capacity, fck = concrete grade, fy = steel grade,
              Ac = concrete area, Asc = steel area.
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
                    Example
                  </th>
                </tr>
              </thead>

              <tbody className="text-slate-300">
                <tr>
                  <td className="border border-slate-800 p-3">
                    Column Size
                  </td>
                  <td className="border border-slate-800 p-3">
                    Width × Depth
                  </td>
                  <td className="border border-slate-800 p-3">
                    300 mm × 300 mm
                  </td>
                </tr>

                <tr>
                  <td className="border border-slate-800 p-3">
                    Concrete Grade
                  </td>
                  <td className="border border-slate-800 p-3">
                    fck
                  </td>
                  <td className="border border-slate-800 p-3">
                    M25
                  </td>
                </tr>

                <tr>
                  <td className="border border-slate-800 p-3">
                    Steel Grade
                  </td>
                  <td className="border border-slate-800 p-3">
                    fy
                  </td>
                  <td className="border border-slate-800 p-3">
                    Fe500
                  </td>
                </tr>

                <tr>
                  <td className="border border-slate-800 p-3">
                    Longitudinal Steel
                  </td>
                  <td className="border border-slate-800 p-3">
                    0.8% to 6% of gross area
                  </td>
                  <td className="border border-slate-800 p-3">
                    4 bars of 16 mm
                  </td>
                </tr>

                <tr>
                  <td className="border border-slate-800 p-3">
                    Lateral Ties
                  </td>
                  <td className="border border-slate-800 p-3">
                    Based on bar diameter and column size
                  </td>
                  <td className="border border-slate-800 p-3">
                    8 mm ties
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-slate-400 leading-7 mt-5">
            Example: For a 300 mm × 300 mm RCC column with M25 concrete and
            Fe500 steel, column design includes checking axial load capacity,
            steel percentage, longitudinal bars and tie spacing. Final column
            design should always be checked as per structural design code and
            actual project loads.
          </p>
        </section>

        <div className="grid md:grid-cols-2 gap-10">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">
              Features
            </h2>

            <ul className="space-y-3 text-slate-300">
              <li>• RCC column design calculation</li>
              <li>• Axial load calculation</li>
              <li>• Column size estimation</li>
              <li>• Longitudinal steel calculation</li>
              <li>• Slenderness ratio check</li>
              <li>• IS 456 based column design</li>
            </ul>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">
              Why Use CivilCalc Pro?
            </h2>

            <p className="text-slate-300 leading-8">
              CivilCalc Pro helps civil engineers design RCC columns quickly
              using professional structural calculation tools. Useful for
              students, site engineers, structural consultants, and construction
              professionals.
            </p>
          </div>
        </div>

        <section className="mt-16 space-y-8">
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              RCC Column Design Formula
            </h2>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-orange-400 font-mono text-lg">
              Pu = 0.4fckAc + 0.67fyAsc
            </div>

            <p className="text-slate-300 mt-4 leading-7">
              This formula is commonly used for the axial load capacity of a
              short RCC column under compression.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              What is RCC Column Design?
            </h2>

            <p className="text-slate-300 leading-7 mb-4">
              RCC column design is the process of designing a reinforced
              concrete compression member to safely carry axial loads and
              moments from beams, slabs and upper floors to the foundation.
            </p>

            <p className="text-slate-300 leading-7">
              Columns are one of the most critical structural members in a
              building. Correct column design is important for load transfer,
              stability and overall structural safety.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Steps in RCC Column Design
            </h2>

            <ul className="list-disc pl-6 space-y-2 text-slate-300">
              <li>Calculate axial load on column</li>
              <li>Select column size</li>
              <li>Choose concrete grade and steel grade</li>
              <li>Check slenderness ratio</li>
              <li>Calculate required longitudinal reinforcement</li>
              <li>Provide lateral ties or stirrups</li>
              <li>Check minimum and maximum steel percentage</li>
              <li>Verify spacing, cover and detailing requirements</li>
            </ul>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Column Design Example
            </h2>

            <p className="text-slate-300 leading-7">
              Consider a short RCC column with factored axial load of 1000 kN,
              concrete grade M20 and steel grade Fe415.
            </p>

            <p className="text-slate-300 leading-7 mt-4">
              The column should be designed by selecting suitable column
              dimensions, calculating concrete area and steel area, and checking
              the load capacity using IS 456 column design provisions.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Important Checks in Column Design
            </h2>

            <ul className="list-disc pl-6 space-y-2 text-slate-300">
              <li>Axial load capacity check</li>
              <li>Short column or slender column check</li>
              <li>Minimum reinforcement check</li>
              <li>Maximum reinforcement check</li>
              <li>Lateral tie spacing check</li>
              <li>Clear cover check</li>
              <li>Column size and stability check</li>
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
