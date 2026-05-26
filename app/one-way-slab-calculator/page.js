import Link from "next/link";

export const metadata = {
  title: "One Way Slab Design Calculator | CivilCalc Pro",
  description:
    "Free online one way slab design calculator for civil engineers and students. Calculate slab thickness, reinforcement steel, bending moments, and structural design as per IS 456.",
};

export default function OneWaySlabPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-16">
      <div className="max-w-5xl mx-auto">

        <p className="text-orange-400 font-semibold mb-3">
          RCC CALCULATOR
        </p>

        <h1 className="text-5xl font-bold mb-4">
          One Way Slab Design
        </h1>

        <p className="text-slate-300 text-lg mb-10">
          One way reinforced concrete slab — limit state method per IS 456:2000
        </p>

        <div className="grid md:grid-cols-2 gap-8">

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">
              One Way Slab Design Calculator
            </h2>

            <p className="text-slate-300 mb-5">
              Calculate slab thickness, reinforcement steel, loads, bending
              moments, and structural design as per IS codes.
            </p>

            <ul className="space-y-3 text-slate-300">
              <li>• Slab thickness calculation</li>
              <li>• Bending moment calculation</li>
              <li>• Steel reinforcement estimation</li>
              <li>• IS 456 based RCC slab design</li>
              <li>• Fast structural analysis</li>
            </ul>
          </div>

          <div className="bg-slate-900/60 border border-dashed border-slate-700 rounded-2xl p-8 flex items-center justify-center text-center">
            <div>
              <p className="text-orange-400 font-semibold mb-4">
                FULL CALCULATOR ACCESS
              </p>

              <h2 className="text-2xl font-bold mb-5">
                Login to use the real One Way Slab Calculator
              </h2>

              <p className="text-slate-400 mb-6">
                Run slab design checks, calculate reinforcement, view results,
                and generate PDF reports.
              </p>

              <Link
                href="/login?redirect=/dashboard/calculators/slab"
                className="inline-block bg-orange-500 hover:bg-orange-600 transition px-6 py-3 rounded-xl font-semibold"
              >
                Login to Use Calculator
              </Link>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
