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
                  <section className="mt-16 space-y-8">
  <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
    <h2 className="text-2xl font-bold text-white mb-4">
      One-Way Slab Design Formula
    </h2>

    <p className="text-slate-300 leading-7 mb-4">
      One-way slab design is used when the slab bends mainly in one direction.
      It helps calculate bending moment, effective depth and steel reinforcement.
    </p>

    <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-orange-400 font-mono text-lg">
      Mu = w × L² / 8
    </div>
  </div>

  <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
    <h2 className="text-2xl font-bold text-white mb-4">
      IS Code Used for One-Way Slab
    </h2>

    <p className="text-slate-300 leading-7">
      This one-way slab calculator follows IS 456:2000 for reinforced concrete
      slab design and limit state method calculations.
    </p>
  </div>

  <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
    <h2 className="text-2xl font-bold text-white mb-4">
      Frequently Asked Questions
    </h2>

    <div className="space-y-5 text-slate-300">
      <div>
        <h3 className="font-semibold text-white">
          What is a one-way slab?
        </h3>
        <p>
          A one-way slab is a slab supported on two opposite sides where load
          is mainly transferred in one direction.
        </p>
      </div>

      <div>
        <h3 className="font-semibold text-white">
          When is a slab considered one-way?
        </h3>
        <p>
          A slab is generally considered one-way when the longer span to shorter
          span ratio is greater than 2.
        </p>
      </div>

      <div>
        <h3 className="font-semibold text-white">
          Which IS code is used for slab design?
        </h3>
        <p>
          IS 456:2000 is commonly used for reinforced concrete slab design in India.
        </p>
      </div>
    </div>
  </div>
<div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
  <h2 className="text-2xl font-bold text-white mb-4">
    What is a One-Way Slab?
  </h2>

  <p className="text-slate-300 leading-7 mb-4">
    A one-way slab is a reinforced concrete slab that transfers load
    primarily in one direction. It is commonly used in residential,
    commercial and industrial buildings where the longer span is more
    than twice the shorter span.
  </p>

  <p className="text-slate-300 leading-7">
    One-way slabs are economical, easy to construct and widely used in
    RCC building structures.
  </p>
</div>

<div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
  <h2 className="text-2xl font-bold text-white mb-4">
    Steps in One-Way Slab Design
  </h2>

  <ul className="list-disc pl-6 space-y-2 text-slate-300">
    <li>Determine slab span</li>
    <li>Calculate dead load and live load</li>
    <li>Compute design load</li>
    <li>Calculate bending moment</li>
    <li>Select slab thickness</li>
    <li>Design reinforcement steel</li>
    <li>Check shear capacity</li>
    <li>Verify deflection limits</li>
  </ul>
</div>

<div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
  <h2 className="text-2xl font-bold text-white mb-4">
    One-Way Slab Design Example
  </h2>

  <p className="text-slate-300 leading-7">
    Consider a one-way slab with a span of 4 m carrying a factored load
    of 12 kN/m².
  </p>

  <p className="text-slate-300 leading-7 mt-4">
    Mu = w × L² / 8
    <br />
    Mu = 12 × 4² / 8
    <br />
    Mu = 24 kNm
  </p>
</div>

<div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
  <h2 className="text-2xl font-bold text-white mb-4">
    Advantages of One-Way Slabs
  </h2>

  <ul className="list-disc pl-6 space-y-2 text-slate-300">
    <li>Simple design process</li>
    <li>Economical construction</li>
    <li>Easy reinforcement detailing</li>
    <li>Suitable for smaller spans</li>
    <li>Widely used in residential buildings</li>
    <li>Fast construction speed</li>
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
    <li><a href="/two-way-slab-calculator">Two-Way Slab Calculator</a></li>
    <li><a href="/steel-weight-calculator">Steel Weight Calculator</a></li>
  </ul>
</div>

</section>
    </main>
  );
}
