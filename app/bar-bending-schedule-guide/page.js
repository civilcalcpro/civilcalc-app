import Link from "next/link";

export const metadata = {
  title: 'Bar Bending Schedule Guide | BBS Calculation | CivilCalc Pro',
  description:
    'Learn bar bending schedule calculation for RCC structures with BBS format, cutting length, bend deduction, hook length, steel weight and practical examples.',
  alternates: {
    canonical: 'https://civilcalcpro.in/bar-bending-schedule-guide',
  },
  openGraph: {
    title: 'Bar Bending Schedule Guide | BBS Calculation | CivilCalc Pro',
    description:
      'Learn bar bending schedule calculation for RCC structures with BBS format, cutting length, bend deduction, hook length, steel weight and practical examples.',
    url: 'https://civilcalcpro.in/bar-bending-schedule-guide',
    siteName: 'CivilCalc Pro',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bar Bending Schedule Guide | BBS Calculation | CivilCalc Pro',
    description:
      'Learn bar bending schedule calculation for RCC structures with BBS format, cutting length, bend deduction, hook length, steel weight and practical examples.',
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

export default function BarBendingScheduleGuidePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-16">
      <div className="max-w-5xl mx-auto">
        <p className="text-orange-400 font-semibold mb-3">
          RCC STEEL DETAILING GUIDE
        </p>

        <h1 className="text-5xl font-bold mb-6">
          Bar Bending Schedule Guide
        </h1>

        <p className="text-slate-300 text-lg mb-10">
          Learn bar bending schedule calculation for RCC structures with BBS
          format, cutting length, bend deduction, hook length, steel quantity,
          reinforcement details, and practical examples.
        </p>

                <Link
          href="/login?redirect=/dashboard/calculators/bbs-generator"
          className="inline-block bg-orange-500 hover:bg-orange-600 transition px-6 py-3 rounded-xl font-semibold mb-16"
        >
          Open BBS Generator
        </Link>

        <section className="space-y-8">
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              What is Bar Bending Schedule?
            </h2>

            <p className="text-slate-300 leading-7 mb-4">
              Bar Bending Schedule, also called BBS, is a detailed list of
              reinforcement bars used in RCC work. It includes bar mark,
              diameter, shape, number of bars, cutting length, total length,
              unit weight, and total steel weight.
            </p>

            <p className="text-slate-300 leading-7">
              BBS helps engineers, contractors, quantity surveyors, and site
              teams estimate steel quantity accurately before cutting and placing
              reinforcement bars on site.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Bar Bending Schedule Formula
            </h2>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-orange-400 font-mono text-lg">
              Steel Weight = D² / 162 × Length
            </div>

            <p className="text-slate-300 mt-4 leading-7">
              Here, D is the diameter of the bar in mm and length is measured in
              meters. This formula gives approximate reinforcement steel weight
              in kg.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 overflow-x-auto">
            <h2 className="text-2xl font-bold text-white mb-4">
              Standard BBS Format
            </h2>

            <table className="w-full border-collapse text-left text-slate-300">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="py-3 pr-4 text-white">Column</th>
                  <th className="py-3 pr-4 text-white">Description</th>
                </tr>
              </thead>

              <tbody>
                <tr className="border-b border-slate-800">
                  <td className="py-3 pr-4">Bar Mark</td>
                  <td className="py-3 pr-4">Identification number of reinforcement bar</td>
                </tr>

                <tr className="border-b border-slate-800">
                  <td className="py-3 pr-4">Diameter</td>
                  <td className="py-3 pr-4">Bar diameter such as 8mm, 10mm, 12mm, 16mm</td>
                </tr>

                <tr className="border-b border-slate-800">
                  <td className="py-3 pr-4">Shape</td>
                  <td className="py-3 pr-4">Straight bar, bent bar, stirrup or hook bar</td>
                </tr>

                <tr className="border-b border-slate-800">
                  <td className="py-3 pr-4">No. of Bars</td>
                  <td className="py-3 pr-4">Total number of bars required</td>
                </tr>

                <tr className="border-b border-slate-800">
                  <td className="py-3 pr-4">Cutting Length</td>
                  <td className="py-3 pr-4">Final length of bar after bend deduction and hooks</td>
                </tr>

                <tr className="border-b border-slate-800">
                  <td className="py-3 pr-4">Total Weight</td>
                  <td className="py-3 pr-4">Total steel quantity in kg</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Steps to Prepare Bar Bending Schedule
            </h2>

            <ul className="list-disc pl-6 space-y-2 text-slate-300">
              <li>Read structural drawing and reinforcement details</li>
              <li>Identify member type such as beam, slab, column or footing</li>
              <li>List bar diameter and spacing</li>
              <li>Calculate number of bars</li>
              <li>Calculate cutting length of each bar</li>
              <li>Apply bend deduction and hook length</li>
              <li>Calculate total length of steel</li>
              <li>Calculate steel weight using D²/162 formula</li>
              <li>Prepare final BBS table for site execution</li>
            </ul>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Cutting Length Formula
            </h2>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-orange-400 font-mono text-lg">
              Cutting Length = Total Length + Hook Length - Bend Deduction
            </div>

            <p className="text-slate-300 mt-4 leading-7">
              Cutting length depends on member dimensions, concrete cover, bar
              shape, bends, hooks, stirrups, and reinforcement detailing shown in
              structural drawings.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              BBS Calculation Example
            </h2>

            <p className="text-slate-300 leading-7">
              Consider 10 bars of 12 mm diameter and 5 m cutting length each.
            </p>

            <p className="text-slate-300 leading-7 mt-4">
              Unit Weight = D² / 162
              <br />
              Unit Weight = 12² / 162
              <br />
              Unit Weight = 0.89 kg/m
            </p>

            <p className="text-slate-300 leading-7 mt-4">
              Total Length = 10 × 5 = 50 m
              <br />
              Total Steel Weight = 0.89 × 50 = 44.5 kg
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Benefits of Bar Bending Schedule
            </h2>

            <ul className="list-disc pl-6 space-y-2 text-slate-300">
              <li>Improves steel quantity estimation</li>
              <li>Reduces reinforcement wastage</li>
              <li>Helps in material procurement</li>
              <li>Supports contractor billing</li>
              <li>Improves site execution speed</li>
              <li>Helps prepare accurate BOQ and cost estimation</li>
            </ul>
          </div>

                    <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Related Tools
            </h2>

            <ul className="list-disc pl-6 space-y-2 text-slate-300">
              <li><a href="/steel-weight-calculator">Steel Weight Calculator</a></li>
              <li><a href="/reinforcement-calculators">Reinforcement Calculators</a></li>
              <li><a href="/rcc-design-calculators">RCC Design Calculators</a></li>
              <li><a href="/beam-design">Beam Design Calculator</a></li>
              <li><a href="/column-design">Column Design Calculator</a></li>
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
