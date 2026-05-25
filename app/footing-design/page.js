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
    </main>
  );
}
