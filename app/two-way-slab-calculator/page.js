import Link from "next/link";

export const metadata = {
  title: "Two Way Slab Design Calculator | CivilCalc Pro",
  description:
    "Free online two way slab design calculator for civil engineers and students. Calculate slab thickness, reinforcement steel, bending moments, and structural design as per IS 456.",
};

export default function TwoWaySlabPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-16">
      <div className="max-w-5xl mx-auto">

        <p className="text-orange-400 font-semibold mb-3">
          RCC CALCULATOR
        </p>

        <h1 className="text-5xl font-bold mb-4">
          Two Way Slab Design
        </h1>

        <p className="text-slate-300 text-lg mb-10">
          Two way reinforced concrete slab — limit state method per IS 456:2000
        </p>

        <div className="grid md:grid-cols-2 gap-8">

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">
              Two Way Slab Design Calculator
            </h2>

            <p className="text-slate-300 mb-5">
              Calculate slab thickness, reinforcement steel, loads, bending
              moments, and structural design as per IS codes.
            </p>

            <ul className="space-y-3 text-slate-300">
              <li>• Two way slab thickness calculation</li>
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
                Login to use the real Two Way Slab Calculator
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
                  <section className="mt-16 space-y-8">
  <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
    <h2 className="text-2xl font-bold text-white mb-4">
      Two-Way Slab Design Formula
    </h2>

    <p className="text-slate-300 leading-7 mb-4">
      Two-way slab design is used when slabs transfer load in both directions.
    </p>

    <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-orange-400 font-mono text-lg">
      Mu = α × w × L²
    </div>
  </div>

  <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
    <h2 className="text-2xl font-bold text-white mb-4">
      FAQ
    </h2>

    <p className="text-slate-300">
      IS 456:2000 is commonly used for RCC two-way slab design.
    </p>
  </div>
<div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
  <h2 className="text-2xl font-bold text-white mb-4">
    What is a Two-Way Slab?
  </h2>

  <p className="text-slate-300 leading-7 mb-4">
    A two-way slab is a reinforced concrete slab that transfers load
    in both directions. It is commonly used when the ratio of longer
    span to shorter span is less than 2.
  </p>

  <p className="text-slate-300 leading-7">
    Two-way slabs provide better load distribution and are widely used
    in residential buildings, commercial buildings and multi-storey
    structures.
  </p>
</div>

<div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
  <h2 className="text-2xl font-bold text-white mb-4">
    Steps in Two-Way Slab Design
  </h2>

  <ul className="list-disc pl-6 space-y-2 text-slate-300">
    <li>Determine slab dimensions</li>
    <li>Calculate dead load and live load</li>
    <li>Calculate design load</li>
    <li>Determine moment coefficients</li>
    <li>Calculate bending moments in both directions</li>
    <li>Design reinforcement steel</li>
    <li>Check shear capacity</li>
    <li>Verify deflection requirements</li>
  </ul>
</div>

<div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
  <h2 className="text-2xl font-bold text-white mb-4">
    Two-Way Slab Design Example
  </h2>

  <p className="text-slate-300 leading-7">
    Consider a slab measuring 5 m × 4 m carrying a design load
    of 10 kN/m².
  </p>

  <p className="text-slate-300 leading-7 mt-4">
    Using IS 456 moment coefficients, bending moments are calculated
    in both directions and reinforcement is designed accordingly.
  </p>
</div>

<div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
  <h2 className="text-2xl font-bold text-white mb-4">
    Advantages of Two-Way Slabs
  </h2>

  <ul className="list-disc pl-6 space-y-2 text-slate-300">
    <li>Better load distribution</li>
    <li>Reduced slab thickness</li>
    <li>Improved structural efficiency</li>
    <li>Suitable for larger panel sizes</li>
    <li>Enhanced stability</li>
    <li>Economical reinforcement layout</li>
  </ul>
</div>

<div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
  <h2 className="text-2xl font-bold text-white mb-4">
    Difference Between One-Way and Two-Way Slabs
  </h2>

  <p className="text-slate-300 leading-7">
    One-way slabs transfer load primarily in one direction, while
    two-way slabs transfer load in both directions. Two-way slabs
    generally provide better structural efficiency for square and
    nearly square slab panels.
  </p>
</div>

<div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
  <h2 className="text-2xl font-bold text-white mb-4">
    Related Calculators
  </h2>

  <ul className="list-disc pl-6 space-y-2 text-slate-300">
    <li><a href="/one-way-slab-calculator">One-Way Slab Calculator</a></li>
    <li><a href="/beam-design">Beam Design Calculator</a></li>
    <li><a href="/column-design">Column Design Calculator</a></li>
    <li><a href="/footing-design">Footing Design Calculator</a></li>
    <li><a href="/steel-weight-calculator">Steel Weight Calculator</a></li>
  </ul>
</div>

</section>
    </main>
  );
}
