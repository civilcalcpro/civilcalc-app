import Link from "next/link";

export const metadata = {
  title: "Excavation Calculator | CivilCalc Pro",
  description:
    "Free online excavation calculator for civil engineers and contractors. Calculate excavation volume, earthwork quantity, trench excavation, and construction material estimation instantly.",
};

export default function ExcavationCalculatorPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-16">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-5xl font-bold mb-6">
          Excavation Calculator
        </h1>

        <p className="text-slate-300 text-lg mb-10">
          Free online excavation calculator for civil engineers,
          contractors, and students. Calculate excavation volume,
          earthwork quantity, trench excavation, and site estimation instantly.
        </p>

        <Link
          href="/login?redirect=/dashboard/calculators/excavation"
          className="inline-block bg-orange-500 hover:bg-orange-600 transition px-6 py-3 rounded-xl font-semibold mb-16"
        >
          Open Excavation Calculator
        </Link>

        <div className="grid md:grid-cols-2 gap-10">

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">Features</h2>

            <ul className="space-y-3 text-slate-300">
              <li>• Excavation volume calculation</li>
              <li>• Earthwork quantity estimation</li>
              <li>• Trench excavation analysis</li>
              <li>• Site quantity planning</li>
              <li>• Fast construction calculations</li>
              <li>• Material estimation support</li>
            </ul>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">
              Why Use CivilCalc Pro?
            </h2>

            <p className="text-slate-300 leading-8">
              CivilCalc Pro helps engineers and contractors calculate
              excavation quantities quickly using professional construction
              estimation tools. Ideal for site engineers, quantity surveyors,
              and students.
            </p>
          </div>

        </div>
      </div>
    </main>
  );
}
