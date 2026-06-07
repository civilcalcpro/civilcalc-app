import Link from "next/link";

export const metadata = {
  title: "RCC Footing Design Calculator | CivilCalc Pro",
  description:
    "Free online RCC footing design calculator for civil engineers and students. Calculate footing size, soil pressure, reinforcement steel, loads, bending moments, and structural design as per IS 456.",
};

export default function FootingDesignPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-16">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-5xl font-bold mb-6">
          RCC Footing Design Calculator
        </h1>

        <p className="text-slate-300 text-lg mb-10">
          Free online RCC footing design calculator for civil engineers and students.
          Calculate footing dimensions, soil pressure, reinforcement steel,
          bending moments, and structural design as per IS 456 code.
        </p>

        <Link
          href="/login?redirect=/dashboard/calculators/footing"
          className="inline-block bg-orange-500 hover:bg-orange-600 transition px-6 py-3 rounded-xl font-semibold mb-16"
        >
          Open Footing Calculator
        </Link>

        <div className="grid md:grid-cols-2 gap-10">

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">Features</h2>

            <ul className="space-y-3 text-slate-300">
              <li>• Footing size calculation</li>
              <li>• Soil pressure check</li>
              <li>• Load and bearing capacity checks</li>
              <li>• Steel reinforcement estimation</li>
              <li>• IS 456 based RCC footing design</li>
              <li>• Fast structural analysis</li>
            </ul>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">
              Why Use CivilCalc Pro?
            </h2>

            <p className="text-slate-300 leading-8">
              CivilCalc Pro helps civil engineers perform RCC footing design
              quickly using AI-powered engineering tools and structural
              calculations. Useful for students, site engineers, consultants,
              and construction professionals.
            </p>
          </div>

        </div>
      </div>
                <section className="mt-16 space-y-8">
  <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
    <h2 className="text-2xl font-bold text-white mb-4">
      Footing Design Formula
    </h2>

    <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-orange-400 font-mono text-lg">
      Area = Load / SBC
    </div>

    <p className="text-slate-300 mt-4">
      Footing design is used to safely transfer structural loads to soil.
    </p>
  </div>
<div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
  <h2 className="text-2xl font-bold text-white mb-4">
    What is RCC Footing Design?
  </h2>

  <p className="text-slate-300 leading-7 mb-4">
    RCC Footing Design is the process of designing a reinforced concrete
    foundation that safely transfers structural loads from columns to the soil.
    Proper footing design prevents excessive settlement and ensures structural stability.
  </p>

  <p className="text-slate-300 leading-7">
    Footings are one of the most important structural elements because they
    support the entire building and distribute loads to the ground.
  </p>
</div>

<div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
  <h2 className="text-2xl font-bold text-white mb-4">
    Types of Footings
  </h2>

  <ul className="list-disc pl-6 space-y-2 text-slate-300">
    <li>Isolated Footing</li>
    <li>Combined Footing</li>
    <li>Strap Footing</li>
    <li>Raft Foundation</li>
    <li>Pile Foundation</li>
    <li>Wall Footing</li>
  </ul>
</div>

<div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
  <h2 className="text-2xl font-bold text-white mb-4">
    Steps in RCC Footing Design
  </h2>

  <ul className="list-disc pl-6 space-y-2 text-slate-300">
    <li>Determine column load</li>
    <li>Obtain safe bearing capacity of soil</li>
    <li>Calculate footing area</li>
    <li>Select footing dimensions</li>
    <li>Check bending moments</li>
    <li>Check shear forces</li>
    <li>Design reinforcement steel</li>
    <li>Verify settlement criteria</li>
  </ul>
</div>

<div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
  <h2 className="text-2xl font-bold text-white mb-4">
    Footing Design Example
  </h2>

  <p className="text-slate-300 leading-7">
    Assume a column load of 800 kN and soil bearing capacity of
    200 kN/m².
  </p>

  <p className="text-slate-300 leading-7 mt-4">
    Required Area = Load / SBC
    <br />
    Area = 800 / 200
    <br />
    Area = 4.0 m²
  </p>
</div>

<div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
  <h2 className="text-2xl font-bold text-white mb-4">
    Related Calculators
  </h2>

  <ul className="list-disc pl-6 space-y-2 text-slate-300">
    <li><a href="/beam-design">Beam Design Calculator</a></li>
    <li><a href="/column-design">Column Design Calculator</a></li>
    <li><a href="/one-way-slab-calculator">One Way Slab Calculator</a></li>
    <li><a href="/two-way-slab-calculator">Two Way Slab Calculator</a></li>
    <li><a href="/steel-weight-calculator">Steel Weight Calculator</a></li>
  </ul>
</div>

</section>
    </main>
  );
}
