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
<div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
  <h2 className="text-2xl font-bold text-white mb-4">
    What is a Brickwork Calculator?
  </h2>

  <p className="text-slate-300 leading-7 mb-4">
    A Brickwork Calculator is used to estimate the number of bricks,
    cement and sand required for masonry construction. Civil engineers,
    contractors and quantity surveyors use brickwork calculations for
    planning and material estimation.
  </p>

  <p className="text-slate-300 leading-7">
    Accurate brickwork estimation helps reduce wastage, improve cost
    control and simplify construction planning.
  </p>
</div>

<div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
  <h2 className="text-2xl font-bold text-white mb-4">
    Types of Brickwork
  </h2>

  <ul className="list-disc pl-6 space-y-2 text-slate-300">
    <li>English Bond Brickwork</li>
    <li>Flemish Bond Brickwork</li>
    <li>Stretcher Bond Brickwork</li>
    <li>Header Bond Brickwork</li>
    <li>Garden Wall Bond</li>
    <li>Facing Brickwork</li>
  </ul>
</div>

<div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
  <h2 className="text-2xl font-bold text-white mb-4">
    Brickwork Calculation Example
  </h2>

  <p className="text-slate-300 leading-7">
    Consider a wall with:
  </p>

  <ul className="list-disc pl-6 space-y-2 text-slate-300 mt-4">
    <li>Length = 5 m</li>
    <li>Height = 3 m</li>
    <li>Thickness = 0.23 m</li>
  </ul>

  <p className="text-slate-300 leading-7 mt-4">
    Wall Volume = Length × Height × Thickness
    <br />
    = 5 × 3 × 0.23
    <br />
    = 3.45 m³
  </p>
</div>

<div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
  <h2 className="text-2xl font-bold text-white mb-4">
    Benefits of Brickwork Estimation
  </h2>

  <ul className="list-disc pl-6 space-y-2 text-slate-300">
    <li>Improves material planning</li>
    <li>Reduces wastage</li>
    <li>Supports cost estimation</li>
    <li>Improves procurement planning</li>
    <li>Helps quantity surveyors</li>
    <li>Improves project budgeting</li>
  </ul>
</div>

<div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
  <h2 className="text-2xl font-bold text-white mb-4">
    Related Calculators
  </h2>

  <ul className="list-disc pl-6 space-y-2 text-slate-300">
    <li><a href="/plaster-calculator">Plaster Calculator</a></li>
    <li><a href="/excavation-calculator">Excavation Calculator</a></li>
    <li><a href="/concrete-volume-calculator">Concrete Volume Calculator</a></li>
    <li><a href="/steel-weight-calculator">Steel Weight Calculator</a></li>
    <li><a href="/footing-design">Footing Design Calculator</a></li>
  </ul>
</div>

</section>        
    </main>
  );
}
