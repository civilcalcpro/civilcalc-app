import Link from "next/link";

export const metadata = {
  title: 'M20 Concrete Mix Ratio | Cement Sand Aggregate | CivilCalc Pro',
  description:
    'Learn M20 concrete mix ratio, cement sand aggregate quantity, nominal mix proportion, water cement ratio and practical calculation example for construction work.',
  alternates: {
    canonical: 'https://civilcalcpro.in/m20-concrete-mix-ratio',
  },
  openGraph: {
    title: 'M20 Concrete Mix Ratio | Cement Sand Aggregate | CivilCalc Pro',
    description:
      'Learn M20 concrete mix ratio, cement sand aggregate quantity, nominal mix proportion, water cement ratio and practical calculation example for construction work.',
    url: 'https://civilcalcpro.in/m20-concrete-mix-ratio',
    siteName: 'CivilCalc Pro',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'M20 Concrete Mix Ratio | Cement Sand Aggregate | CivilCalc Pro',
    description:
      'Learn M20 concrete mix ratio, cement sand aggregate quantity, nominal mix proportion, water cement ratio and practical calculation example for construction work.',
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

export default function M20ConcreteMixRatioPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is the mix ratio of M20 concrete?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The nominal mix ratio of M20 concrete is 1:1.5:3, which means 1 part cement, 1.5 parts sand and 3 parts coarse aggregate.",
        },
      },
      {
        "@type": "Question",
        name: "What is the strength of M20 concrete?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "M20 concrete has a characteristic compressive strength of 20 N/mm² after 28 days of proper curing.",
        },
      },
      {
        "@type": "Question",
        name: "How much cement is required for 1 cubic meter of M20 concrete?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "For 1 cubic meter of M20 concrete, approximately 8.06 bags of cement are required when dry volume is taken as 1.54 cubic meters.",
        },
      },
      {
        "@type": "Question",
        name: "Where is M20 concrete used?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "M20 concrete is commonly used in RCC slabs, beams, columns, footings and residential building construction where normal structural strength is required.",
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
          CONCRETE MIX DESIGN GUIDE
        </p>

        <h1 className="text-5xl font-bold mb-6">
          M20 Concrete Mix Ratio
        </h1>

        <p className="text-slate-300 text-lg mb-10">
          Learn M20 concrete mix ratio, cement sand aggregate quantity,
          nominal mix proportion, water cement ratio, and practical concrete
          quantity calculation for construction work.
        </p>

        <Link
          href="/concrete-volume-calculator"
          className="inline-block bg-orange-500 hover:bg-orange-600 transition px-6 py-3 rounded-xl font-semibold mb-16"
        >
          Open Concrete Volume Calculator
        </Link>
        <section className="rounded-2xl border border-orange-500/30 bg-orange-500/5 p-8 mb-12">
          <p className="text-orange-400 font-semibold mb-3">
            QUICK ANSWER
          </p>

          <h2 className="text-3xl font-bold mb-5">
            What is the M20 concrete mix ratio?
          </h2>

          <p className="text-slate-300 leading-8 mb-4">
            The nominal mix ratio of M20 concrete is 1 : 1.5 : 3. It means
            1 part cement, 1.5 parts sand and 3 parts coarse aggregate. M20
            concrete has a characteristic compressive strength of 20 N/mm²
            after 28 days of curing.
          </p>

          <div className="overflow-x-auto mt-6">
            <table className="w-full border border-slate-800 text-left">
              <thead className="bg-slate-900">
                <tr>
                  <th className="border border-slate-800 p-3 text-white">
                    Material
                  </th>
                  <th className="border border-slate-800 p-3 text-white">
                    Ratio
                  </th>
                  <th className="border border-slate-800 p-3 text-white">
                    Approx. Quantity for 1 m³ Concrete
                  </th>
                </tr>
              </thead>

              <tbody className="text-slate-300">
                <tr>
                  <td className="border border-slate-800 p-3">
                    Cement
                  </td>
                  <td className="border border-slate-800 p-3">
                    1
                  </td>
                  <td className="border border-slate-800 p-3">
                    8.06 bags
                  </td>
                </tr>

                <tr>
                  <td className="border border-slate-800 p-3">
                    Sand
                  </td>
                  <td className="border border-slate-800 p-3">
                    1.5
                  </td>
                  <td className="border border-slate-800 p-3">
                    0.42 m³
                  </td>
                </tr>

                <tr>
                  <td className="border border-slate-800 p-3">
                    Coarse Aggregate
                  </td>
                  <td className="border border-slate-800 p-3">
                    3
                  </td>
                  <td className="border border-slate-800 p-3">
                    0.84 m³
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-slate-400 leading-7 mt-5">
            Example: For 1 m³ of M20 concrete, dry volume is usually taken as
            1.54 m³. Using ratio 1 : 1.5 : 3, approximate materials required are
            8.06 cement bags, 0.42 m³ sand and 0.84 m³ coarse aggregate.
          </p>
        </section>
        <section className="space-y-8">
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              M20 Concrete Mix Ratio
            </h2>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-orange-400 font-mono text-lg">
              M20 Mix Ratio = 1 : 1.5 : 3
            </div>

            <p className="text-slate-300 mt-4 leading-7">
              In M20 concrete, the nominal mix ratio is 1 part cement, 1.5 parts
              sand, and 3 parts coarse aggregate.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              What is M20 Concrete?
            </h2>

            <p className="text-slate-300 leading-7 mb-4">
              M20 concrete is a commonly used concrete grade in residential and
              general construction. The letter M stands for mix and 20 represents
              the characteristic compressive strength of concrete after 28 days,
              measured in N/mm².
            </p>

            <p className="text-slate-300 leading-7">
              M20 concrete is commonly used for slabs, beams, columns, footings,
              lintels, staircases and general RCC construction.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 overflow-x-auto">
            <h2 className="text-2xl font-bold text-white mb-4">
              M20 Concrete Material Ratio
            </h2>

            <table className="w-full border-collapse text-left text-slate-300">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="py-3 pr-4 text-white">Material</th>
                  <th className="py-3 pr-4 text-white">Ratio</th>
                  <th className="py-3 pr-4 text-white">Meaning</th>
                </tr>
              </thead>

              <tbody>
                <tr className="border-b border-slate-800">
                  <td className="py-3 pr-4">Cement</td>
                  <td className="py-3 pr-4">1</td>
                  <td className="py-3 pr-4">One part cement</td>
                </tr>

                <tr className="border-b border-slate-800">
                  <td className="py-3 pr-4">Sand</td>
                  <td className="py-3 pr-4">1.5</td>
                  <td className="py-3 pr-4">One and half part fine aggregate</td>
                </tr>

                <tr className="border-b border-slate-800">
                  <td className="py-3 pr-4">Aggregate</td>
                  <td className="py-3 pr-4">3</td>
                  <td className="py-3 pr-4">Three parts coarse aggregate</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              M20 Concrete Quantity Calculation
            </h2>

            <p className="text-slate-300 leading-7">
              For 1 m³ of wet concrete, dry volume is generally taken as:
            </p>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-orange-400 font-mono text-lg mt-4">
              Dry Volume = Wet Volume × 1.54
            </div>

            <p className="text-slate-300 leading-7 mt-4">
              For 1 m³ concrete:
              <br />
              Dry Volume = 1 × 1.54 = 1.54 m³
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Cement Quantity for M20 Concrete
            </h2>

            <p className="text-slate-300 leading-7">
              Total ratio = 1 + 1.5 + 3 = 5.5
            </p>

            <p className="text-slate-300 leading-7 mt-4">
              Cement volume = 1 / 5.5 × 1.54
              <br />
              Cement volume = 0.28 m³
              <br />
              Cement weight = 0.28 × 1440 = 403 kg
              <br />
              Cement bags = 403 / 50 = 8.06 bags
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Sand and Aggregate Quantity for M20
            </h2>

            <p className="text-slate-300 leading-7">
              Sand volume = 1.5 / 5.5 × 1.54 = 0.42 m³
              <br />
              Aggregate volume = 3 / 5.5 × 1.54 = 0.84 m³
            </p>

            <p className="text-slate-300 leading-7 mt-4">
              Approximate material requirement for 1 m³ M20 concrete:
            </p>

            <ul className="list-disc pl-6 space-y-2 text-slate-300 mt-4">
              <li>Cement = 8.06 bags</li>
              <li>Sand = 0.42 m³</li>
              <li>Aggregate = 0.84 m³</li>
            </ul>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Uses of M20 Concrete
            </h2>

            <ul className="list-disc pl-6 space-y-2 text-slate-300">
              <li>Residential building slabs</li>
              <li>RCC beams and columns</li>
              <li>Isolated footings</li>
              <li>Lintels and chajjas</li>
              <li>Staircase concrete</li>
              <li>General RCC construction work</li>
            </ul>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Related Calculators
            </h2>

            <ul className="list-disc pl-6 space-y-2 text-slate-300">
              <li><a href="/concrete-volume-calculator">Concrete Volume Calculator</a></li>
              <li><a href="/beam-design">Beam Design Calculator</a></li>
              <li><a href="/column-design">Column Design Calculator</a></li>
              <li><a href="/footing-design">Footing Design Calculator</a></li>
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
