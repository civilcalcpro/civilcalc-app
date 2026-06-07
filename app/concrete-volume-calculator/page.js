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
                <section className="mt-16">
  <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
    <h2 className="text-2xl font-bold text-white mb-4">
      Concrete Volume Formula
    </h2>

    <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-orange-400 font-mono text-lg">
      Volume = Length × Width × Depth
    </div>

    <p className="text-slate-300 mt-4">
      Calculate wet volume, dry volume and material quantities for concrete mix.
    </p>
  </div>
<div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
  <h2 className="text-2xl font-bold text-white mb-4">
    What is a Concrete Volume Calculator?
  </h2>

  <p className="text-slate-300 leading-7 mb-4">
    A Concrete Volume Calculator is used to estimate the quantity of
    concrete required for slabs, beams, columns, footings and other
    structural elements. Civil engineers and contractors use concrete
    calculations for material estimation and project planning.
  </p>

  <p className="text-slate-300 leading-7">
    Accurate concrete quantity estimation helps reduce material wastage,
    improve budgeting and optimize construction operations.
  </p>
</div>

<div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
  <h2 className="text-2xl font-bold text-white mb-4">
    Concrete Volume Formula
  </h2>

  <p className="text-slate-300 leading-7">
    Concrete volume is generally calculated using:
  </p>

  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-orange-400 font-mono text-lg mt-4">
    Volume = Length × Width × Depth
  </div>
</div>

<div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
  <h2 className="text-2xl font-bold text-white mb-4">
    Concrete Calculation Example
  </h2>

  <p className="text-slate-300 leading-7">
    Consider a slab with:
  </p>

  <ul className="list-disc pl-6 space-y-2 text-slate-300 mt-4">
    <li>Length = 5 m</li>
    <li>Width = 4 m</li>
    <li>Thickness = 0.15 m</li>
  </ul>

  <p className="text-slate-300 leading-7 mt-4">
    Volume = 5 × 4 × 0.15
    <br />
    Volume = 3.0 m³
  </p>
</div>

<div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
  <h2 className="text-2xl font-bold text-white mb-4">
    Uses of Concrete Volume Calculation
  </h2>

  <ul className="list-disc pl-6 space-y-2 text-slate-300">
    <li>Slab concrete estimation</li>
    <li>Beam concrete calculation</li>
    <li>Column volume estimation</li>
    <li>Footing quantity calculation</li>
    <li>Construction cost estimation</li>
    <li>Material procurement planning</li>
  </ul>
</div>

<div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
  <h2 className="text-2xl font-bold text-white mb-4">
    Related Calculators
  </h2>

  <ul className="list-disc pl-6 space-y-2 text-slate-300">
    <li><a href="/beam-design">Beam Design Calculator</a></li>
    <li><a href="/column-design">Column Design Calculator</a></li>
    <li><a href="/footing-design">Footing Design Calculator</a></li>
    <li><a href="/steel-weight-calculator">Steel Weight Calculator</a></li>
    <li><a href="/excavation-calculator">Excavation Calculator</a></li>
  </ul>
</div>

</section>
    </main>
  );
}
