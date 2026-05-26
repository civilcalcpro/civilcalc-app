import Link from "next/link";

export const metadata = {
  title: "RCC Column Design Calculator | CivilCalc Pro",
  description:
    "Free online RCC column design calculator for civil engineers and students. Calculate column dimensions, axial loads, reinforcement steel, bending moments, and structural design as per IS 456.",
};

export default function ColumnDesignPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-16">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-5xl font-bold mb-6">
          RCC Column Design Calculator
        </h1>

        <p className="text-slate-300 text-lg mb-10">
          Free online RCC column design calculator for civil engineers and students.
          Calculate column dimensions, axial loads, reinforcement steel,
          bending moments, and structural design as per IS 456 code.
        </p>

        <Link
          href="/login?redirect=/dashboard/calculators/column"
          className="inline-block bg-orange-500 hover:bg-orange-600 transition px-6 py-3 rounded-xl font-semibold mb-16"
        >
          Open Column Calculator
        </Link>

        <div className="grid md:grid-cols-2 gap-10">

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">Features</h2>

            <ul className="space-y-3 text-slate-300">
              <li>• Axial load calculations</li>
              <li>• Column sizing calculations</li>
              <li>• Steel reinforcement estimation</li>
              <li>• Bending moment checks</li>
              <li>• IS 456 based RCC column design</li>
              <li>• Fast structural analysis</li>
            </ul>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">
              Why Use CivilCalc Pro?
            </h2>

            <p className="text-slate-300 leading-8">
              CivilCalc Pro helps civil engineers perform RCC column design
              quickly using AI-powered engineering tools and structural
              calculations. Suitable for students, site engineers,
              consultants, and construction professionals.
            </p>
          </div>

        </div>
      </div>
                <section className="mt-16 space-y-8">
  <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
    <h2 className="text-2xl font-bold text-white mb-4">
      RCC Column Design Formula
    </h2>

    <p className="text-slate-300 leading-7 mb-4">
      RCC column design is used to calculate axial load capacity,
      reinforcement requirements and safe concrete dimensions.
    </p>

    <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-orange-400 font-mono text-lg">
      Pu = 0.4 × fck × Ac + 0.67 × fy × Asc
    </div>
  </div>

  <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
    <h2 className="text-2xl font-bold text-white mb-4">
      IS Code Used for RCC Column Design
    </h2>

    <p className="text-slate-300 leading-7">
      This RCC column design calculator follows IS 456:2000 for
      reinforced concrete column analysis and design.
    </p>
  </div>

  <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
    <h2 className="text-2xl font-bold text-white mb-4">
      Frequently Asked Questions
    </h2>

    <div className="space-y-5 text-slate-300">
      <div>
        <h3 className="font-semibold text-white">
          What is RCC column design?
        </h3>
        <p>
          RCC column design determines safe column size and steel
          reinforcement for axial loads.
        </p>
      </div>

      <div>
        <h3 className="font-semibold text-white">
          Which IS code is used for RCC columns?
        </h3>
        <p>
          IS 456:2000 is commonly used for reinforced concrete
          column design in India.
        </p>
      </div>

      <div>
        <h3 className="font-semibold text-white">
          What is axial load in column design?
        </h3>
        <p>
          Axial load is the vertical compressive load acting on
          a reinforced concrete column.
        </p>
      </div>
    </div>
  </div>
</section>
    </main>
  );
}
