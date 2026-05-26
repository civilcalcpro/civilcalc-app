import Link from "next/link";

export const metadata = {
  title: "Brickwork Calculator | CivilCalc Pro",
  description:
    "Free online brickwork calculator for civil engineers and contractors. Calculate number of bricks, mortar quantity, wall volume, and construction material estimation.",
};

export default function BrickworkCalculatorPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-16">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-5xl font-bold mb-6">
          Brickwork Calculator
        </h1>

        <p className="text-slate-300 text-lg mb-10">
          Free online brickwork calculator for civil engineers,
          contractors, and students. Calculate brick quantity,
          mortar quantity, wall volume, and construction materials instantly.
        </p>

        <Link
          href="/login?redirect=/dashboard/calculators/brickwork"
          className="inline-block bg-orange-500 hover:bg-orange-600 transition px-6 py-3 rounded-xl font-semibold mb-16"
        >
          Open Brickwork Calculator
        </Link>

        <div className="grid md:grid-cols-2 gap-10">

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">Features</h2>

            <ul className="space-y-3 text-slate-300">
              <li>• Brick quantity calculations</li>
              <li>• Mortar estimation</li>
              <li>• Wall volume calculations</li>
              <li>• Material estimation</li>
              <li>• Fast quantity analysis</li>
              <li>• Construction planning support</li>
            </ul>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">
              Why Use CivilCalc Pro?
            </h2>

            <p className="text-slate-300 leading-8">
              CivilCalc Pro helps engineers and contractors estimate
              brickwork quantities quickly using professional construction
              tools and quantity calculations. Ideal for site engineers,
              estimators, and students.
            </p>
          </div>

        </div>
      </div>
        <section className="mt-16">
  <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
    <h2 className="text-2xl font-bold text-white mb-4">
      Brickwork Calculation
    </h2>

    <p className="text-slate-300">
      Brickwork calculator estimates bricks, cement and sand required for masonry work.
    </p>
  </div>
</section>        
    </main>
  );
}
