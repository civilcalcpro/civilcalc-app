import Link from "next/link";

export const metadata = {
  title: "Concrete Volume Calculator | CivilCalc Pro",
  description:
    "Free online concrete volume calculator for civil engineers and contractors. Calculate concrete quantity for slabs, beams, columns, footings, and construction works instantly.",
};

export default function ConcreteVolumeCalculatorPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-16">
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

        <div className="grid md:grid-cols-2 gap-10">

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">Features</h2>

            <ul className="space-y-3 text-slate-300">
              <li>• Slab concrete calculation</li>
              <li>• Beam concrete estimation</li>
              <li>• Column concrete volume</li>
              <li>• Footing quantity calculation</li>
              <li>• Fast material estimation</li>
              <li>• Construction quantity analysis</li>
            </ul>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">
              Why Use CivilCalc Pro?
            </h2>

            <p className="text-slate-300 leading-8">
              CivilCalc Pro helps engineers and contractors calculate
              concrete quantities quickly using professional construction
              tools and estimation workflows. Ideal for quantity surveyors,
              site engineers, and students.
            </p>
          </div>

        </div>
      </div>
    </main>
  );
}
