import Link from "next/link";

export const metadata = {
  title: "Steel Weight Calculator | CivilCalc Pro",
  description:
    "Free online steel weight calculator for civil engineers and contractors. Calculate TMT bar weight, reinforcement steel quantity, and steel estimation instantly.",
};

export default function SteelWeightCalculatorPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-16">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-5xl font-bold mb-6">
          Steel Weight Calculator
        </h1>

        <p className="text-slate-300 text-lg mb-10">
          Free online steel weight calculator for civil engineers,
          contractors, and students. Calculate TMT bar weight,
          reinforcement steel quantity, and steel estimation instantly.
        </p>

        <Link
          href="/login?redirect=/dashboard/calculators/steel-weight"
          className="inline-block bg-orange-500 hover:bg-orange-600 transition px-6 py-3 rounded-xl font-semibold mb-16"
        >
          Open Steel Weight Calculator
        </Link>

        <div className="grid md:grid-cols-2 gap-10">

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">Features</h2>

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
              construction estimation tools. Ideal for quantity surveyors,
              site engineers, and students.
            </p>
          </div>

        </div>
      </div>
                <section className="mt-16">
  <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
    <h2 className="text-2xl font-bold text-white mb-4">
      Steel Weight Formula
    </h2>

    <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-orange-400 font-mono text-lg">
      Weight = D² / 162
    </div>

    <p className="text-slate-300 mt-4">
      Steel weight calculator is used for reinforcement quantity estimation.
    </p>
  </div>
</section>
    </main>
  );
}
