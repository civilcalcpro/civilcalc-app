import Link from "next/link";

export const metadata = {
  title: "How to Calculate Brickwork Quantity | CivilCalc Pro",
  description:
    "Learn how to calculate brickwork quantity, number of bricks, cement and sand required with formulas and practical examples.",
};

export default function BrickworkQuantityPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-16">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-5xl font-bold mb-6">
          How to Calculate Brickwork Quantity
        </h1>

        <p className="text-slate-300 text-lg mb-10">
          Brickwork quantity calculation is one of the most important
          tasks in construction estimation. This guide explains how to
          calculate bricks, cement and sand required for a wall.
        </p>

        <section className="space-y-8">

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-4">
              Step 1: Calculate Wall Volume
            </h2>

            <div className="bg-slate-950 rounded-xl p-4 text-orange-400 font-mono">
              Volume = Length × Height × Thickness
            </div>

            <p className="text-slate-300 mt-4">
              Example:
              Length = 5 m,
              Height = 3 m,
              Thickness = 0.23 m
            </p>

            <p className="text-slate-300 mt-2">
              Volume = 5 × 3 × 0.23 = 3.45 m³
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-4">
              Step 2: Calculate Number of Bricks
            </h2>

            <p className="text-slate-300 leading-8">
              For standard brickwork, approximately 500 bricks are
              required for 1 m³ of brickwork. :contentReference[oaicite:0]{index=0}
            </p>

            <div className="bg-slate-950 rounded-xl p-4 text-orange-400 font-mono">
              Number of Bricks = Volume × 500
            </div>

            <p className="text-slate-300 mt-4">
              Bricks Required = 3.45 × 500 = 1725 Bricks
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-4">
              Step 3: Calculate Mortar Quantity
            </h2>

            <p className="text-slate-300 leading-8">
              Mortar quantity is generally taken as approximately
              25–30% of brickwork volume. :contentReference[oaicite:1]{index=1}
            </p>

            <div className="bg-slate-950 rounded-xl p-4 text-orange-400 font-mono">
              Mortar Volume = Brickwork Volume × 30%
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-4">
              Materials Required for 1 m³ Brickwork
            </h2>

            <ul className="list-disc pl-6 text-slate-300 space-y-2">
              <li>Bricks ≈ 500 Nos</li>
              <li>Mortar ≈ 0.30 m³</li>
              <li>Cement (1:6 mix) ≈ 1.26 Bags</li>
              <li>Sand ≈ 0.30 m³</li>
            </ul>

            <p className="text-slate-300 mt-4">
              These are commonly used estimation values for Indian
              brickwork calculations. :contentReference[oaicite:2]{index=2}
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-4">
              Why Accurate Brickwork Estimation Matters
            </h2>

            <ul className="list-disc pl-6 text-slate-300 space-y-2">
              <li>Reduces material wastage</li>
              <li>Improves project budgeting</li>
              <li>Helps quantity surveyors</li>
              <li>Improves procurement planning</li>
              <li>Avoids material shortages on site</li>
            </ul>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-4">
              Related Calculator
            </h2>

            <Link
              href="/brickwork-calculator"
              className="text-orange-400 hover:text-orange-300"
            >
              Brickwork Calculator
            </Link>
          </div>

        </section>

      </div>
    </main>
  );
}
