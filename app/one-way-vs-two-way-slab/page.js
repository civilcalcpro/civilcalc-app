import Link from "next/link";

export const metadata = {
  title: "One-Way Slab vs Two-Way Slab | Complete Comparison | CivilCalc Pro",
  description:
    "Learn the difference between one-way slab and two-way slab with span ratio, reinforcement details, design criteria, advantages, disadvantages and practical examples.",
};

export default function OneWayVsTwoWaySlabPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-16">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-5xl font-bold mb-6">
          One-Way Slab vs Two-Way Slab
        </h1>

        <p className="text-slate-300 text-lg mb-10">
          Understanding the difference between one-way slabs and two-way
          slabs is essential for civil engineers, structural engineers and
          engineering students. This guide explains design principles,
          reinforcement requirements and practical applications.
        </p>

        <div className="space-y-8">

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-4">
              What is a One-Way Slab?
            </h2>

            <p className="text-slate-300 leading-8">
              A one-way slab transfers load primarily in one direction.
              It is generally used when the longer span to shorter span
              ratio is greater than 2. Main reinforcement is provided
              along the shorter span direction.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-4">
              What is a Two-Way Slab?
            </h2>

            <p className="text-slate-300 leading-8">
              A two-way slab transfers load in both directions.
              It is commonly used when the ratio of longer span to
              shorter span is less than 2. Reinforcement is provided
              in both directions.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 overflow-x-auto">
            <h2 className="text-3xl font-bold mb-6">
              Difference Between One-Way and Two-Way Slab
            </h2>

            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3">Feature</th>
                  <th className="text-left py-3">One-Way Slab</th>
                  <th className="text-left py-3">Two-Way Slab</th>
                </tr>
              </thead>

              <tbody className="text-slate-300">
                <tr className="border-b border-slate-800">
                  <td className="py-3">Load Transfer</td>
                  <td>One Direction</td>
                  <td>Both Directions</td>
                </tr>

                <tr className="border-b border-slate-800">
                  <td className="py-3">Span Ratio</td>
                  <td>Greater than 2</td>
                  <td>Less than 2</td>
                </tr>

                <tr className="border-b border-slate-800">
                  <td className="py-3">Reinforcement</td>
                  <td>Main steel in one direction</td>
                  <td>Main steel in both directions</td>
                </tr>

                <tr className="border-b border-slate-800">
                  <td className="py-3">Cost</td>
                  <td>Lower</td>
                  <td>Slightly Higher</td>
                </tr>

                <tr>
                  <td className="py-3">Structural Efficiency</td>
                  <td>Moderate</td>
                  <td>Higher</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-4">
              Reinforcement Details
            </h2>

            <p className="text-slate-300 leading-8">
              In one-way slabs, main reinforcement is provided in the
              shorter span direction. In two-way slabs, reinforcement
              is provided in both directions because the slab carries
              load along both axes.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-4">
              Which Slab Should You Use?
            </h2>

            <p className="text-slate-300 leading-8">
              The selection depends on span ratio, loading conditions,
              architectural requirements and construction cost. For
              nearly square panels, two-way slabs are generally more
              efficient. For rectangular panels, one-way slabs are
              usually preferred.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-4">
              Related Calculators
            </h2>

            <div className="flex flex-col gap-4">
              <Link
                href="/one-way-slab-calculator"
                className="text-orange-400 hover:text-orange-300"
              >
                One-Way Slab Calculator
              </Link>

              <Link
                href="/two-way-slab-calculator"
                className="text-orange-400 hover:text-orange-300"
              >
                Two-Way Slab Calculator
              </Link>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
