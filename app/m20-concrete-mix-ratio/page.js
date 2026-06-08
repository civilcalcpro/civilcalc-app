import Link from "next/link";

export const metadata = {
  title: "M20 Concrete Mix Ratio | CivilCalc Pro",
  description:
    "Learn M20 concrete mix ratio, cement sand aggregate proportion, quantity calculations and practical examples used in construction.",
};

export default function M20ConcreteMixRatioPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-16">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-5xl font-bold mb-6">
          M20 Concrete Mix Ratio
        </h1>

        <p className="text-slate-300 text-lg mb-10">
          M20 concrete is one of the most commonly used concrete grades
          in residential and commercial construction projects.
        </p>

        <section className="space-y-8">

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-4">
              What is M20 Concrete?
            </h2>

            <p className="text-slate-300 leading-8">
              M20 concrete indicates a characteristic compressive strength
              of 20 MPa after 28 days of curing. It is widely used for slabs,
              beams, columns and footings.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-4">
              M20 Concrete Mix Ratio
            </h2>

            <div className="bg-slate-950 rounded-xl p-4 text-orange-400 font-mono">
              1 : 1.5 : 3
            </div>

            <p className="text-slate-300 mt-4">
              Cement : Sand : Aggregate
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-4">
              Material Requirement for 1 m³ Concrete
            </h2>

            <ul className="list-disc pl-6 text-slate-300 space-y-2">
              <li>Cement ≈ 8 Bags</li>
              <li>Sand ≈ 0.42 m³</li>
              <li>Aggregate ≈ 0.84 m³</li>
            </ul>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-4">
              Applications of M20 Concrete
            </h2>

            <ul className="list-disc pl-6 text-slate-300 space-y-2">
              <li>RCC Slabs</li>
              <li>RCC Beams</li>
              <li>Columns</li>
              <li>Footings</li>
              <li>Residential Buildings</li>
            </ul>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-4">
              Related Calculators
            </h2>

            <div className="flex flex-col gap-3">
              <Link
                href="/concrete-volume-calculator"
                className="text-orange-400 hover:text-orange-300"
              >
                Concrete Volume Calculator
              </Link>

              <Link
                href="/footing-design"
                className="text-orange-400 hover:text-orange-300"
              >
                Footing Design Calculator
              </Link>
            </div>
          </div>

        </section>

      </div>
    </main>
  );
}
