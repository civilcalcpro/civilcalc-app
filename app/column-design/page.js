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
          href="/dashboard/calculators/column"
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
    </main>
  );
}
