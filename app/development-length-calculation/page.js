import Link from "next/link";

export const metadata = {
  title: "Development Length Calculation | Ld Formula in RCC",
  description:
    "Learn development length calculation, Ld formula, importance in RCC design and worked examples as per IS 456.",
};

export default function DevelopmentLengthPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-16">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-5xl font-bold mb-6">
          Development Length Calculation
        </h1>

        <p className="text-slate-300 text-lg mb-10">
          Development Length (Ld) is one of the most important concepts
          in reinforced concrete design. It ensures that reinforcement
          bars develop their full strength before slipping from concrete.
        </p>

        <section className="space-y-8">

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-4">
              What is Development Length?
            </h2>

            <p className="text-slate-300 leading-8">
              Development length is the minimum length of reinforcement
              required to transfer stress from steel to concrete through
              bond action.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-4">
              Development Length Formula
            </h2>

            <div className="bg-slate-950 rounded-xl p-4 text-orange-400 font-mono text-lg">
              Ld = (Φ × 0.87fy) / (4 × τbd)
            </div>

            <p className="text-slate-300 mt-4">
              Where:
            </p>

            <ul className="list-disc pl-6 text-slate-300 mt-2 space-y-2">
              <li>Φ = Bar Diameter</li>
              <li>fy = Yield Strength of Steel</li>
              <li>τbd = Design Bond Stress</li>
            </ul>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-4">
              Development Length Example
            </h2>

            <p className="text-slate-300 leading-8">
              Consider:
            </p>

            <ul className="list-disc pl-6 text-slate-300 mt-4 space-y-2">
              <li>Bar Diameter = 16 mm</li>
              <li>Steel Grade = Fe500</li>
              <li>Concrete Grade = M20</li>
            </ul>

            <p className="text-slate-300 mt-4">
              Substitute values into the formula to determine the
              required anchorage length.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-4">
              Why Development Length is Important
            </h2>

            <ul className="list-disc pl-6 text-slate-300 space-y-2">
              <li>Prevents bar slippage</li>
              <li>Improves structural safety</li>
              <li>Ensures full stress transfer</li>
              <li>Required by IS 456</li>
              <li>Critical in beam-column joints</li>
            </ul>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-4">
              Related Articles
            </h2>

            <div className="flex flex-col gap-3">
              <Link
                href="/rcc-beam-design-example"
                className="text-orange-400 hover:text-orange-300"
              >
                RCC Beam Design Example
              </Link>

              <Link
                href="/m20-concrete-mix-ratio"
                className="text-orange-400 hover:text-orange-300"
              >
                M20 Concrete Mix Ratio
              </Link>
            </div>
          </div>

        </section>

      </div>
    </main>
  );
}
