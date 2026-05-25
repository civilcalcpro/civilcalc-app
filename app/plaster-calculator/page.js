import Link from "next/link";

export const metadata = {
  title: "Plaster Work Calculator | CivilCalc Pro",
  description:
    "Free online plaster work calculator for civil engineers and contractors. Calculate plaster area, cement quantity, sand quantity, plaster thickness, and construction material estimation.",
};

export default function PlasterCalculatorPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-16">
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
    </main>
  );
}
