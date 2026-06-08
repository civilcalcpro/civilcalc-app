import Link from "next/link";

export const metadata = {
  title: "Steel Weight Calculation Formula | TMT Bar Weight Formula",
  description:
    "Learn the steel weight calculation formula for TMT bars with examples. Calculate reinforcement steel weight per meter using D²/162 formula.",
};

export default function SteelWeightFormulaPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-16">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-5xl font-bold mb-6">
          Steel Weight Calculation Formula
        </h1>

        <p className="text-slate-300 text-lg mb-10">
          Learn how to calculate TMT bar weight using the standard steel
          weight formula used by civil engineers, contractors and quantity
          surveyors.
        </p>

        <section className="space-y-8">

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-4">
              Steel Weight Formula
            </h2>

            <div className="bg-slate-950 rounded-xl p-4 text-orange-400 font-mono">
              Weight (kg/m) = D² / 162
            </div>

            <p className="text-slate-300 mt-4">
              Where D = Diameter of steel bar in millimeters.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-4">
              12 mm Bar Example
            </h2>

            <div className="bg-slate-950 rounded-xl p-4 text-orange-400 font-mono">
              Weight = 12² / 162
              <br />
              Weight = 144 / 162
              <br />
              Weight = 0.89 kg/m
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-4">
              Common TMT Bar Weights
            </h2>

            <table className="w-full">
              <tbody>
                <tr><td>8 mm</td><td>0.395 kg/m</td></tr>
                <tr><td>10 mm</td><td>0.617 kg/m</td></tr>
                <tr><td>12 mm</td><td>0.888 kg/m</td></tr>
                <tr><td>16 mm</td><td>1.58 kg/m</td></tr>
                <tr><td>20 mm</td><td>2.47 kg/m</td></tr>
                <tr><td>25 mm</td><td>3.85 kg/m</td></tr>
              </tbody>
            </table>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-4">
              Why Steel Weight Calculation is Important
            </h2>

            <ul className="list-disc pl-6 text-slate-300 space-y-2">
              <li>Material estimation</li>
              <li>Cost calculation</li>
              <li>Procurement planning</li>
              <li>Quantity surveying</li>
              <li>RCC design calculations</li>
            </ul>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-4">
              Related Calculator
            </h2>

            <Link
              href="/steel-weight-calculator"
              className="text-orange-400 hover:text-orange-300"
            >
              Steel Weight Calculator
            </Link>
          </div>

        </section>

      </div>
    </main>
  );
}
