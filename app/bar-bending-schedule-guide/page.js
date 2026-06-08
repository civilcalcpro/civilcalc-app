import Link from "next/link";

export const metadata = {
  title: "Bar Bending Schedule (BBS) Guide | CivilCalc Pro",
  description:
    "Learn Bar Bending Schedule (BBS), cutting length calculations, steel quantity estimation and its importance in RCC construction.",
};

export default function BBSGuidePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-16">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-5xl font-bold mb-6">
          Bar Bending Schedule (BBS) Guide
        </h1>

        <p className="text-slate-300 text-lg mb-10">
          A Bar Bending Schedule (BBS) is a detailed list of reinforcement
          bars used in RCC structures. It helps engineers estimate steel
          quantity, cutting lengths and project costs accurately.
        </p>

        <section className="space-y-8">

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-4">
              What is Bar Bending Schedule?
            </h2>

            <p className="text-slate-300 leading-8">
              BBS is a tabular representation of reinforcement details
              showing bar mark, diameter, shape, cutting length,
              quantity and total weight of steel required for a structure.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-4">
              Information Included in BBS
            </h2>

            <ul className="list-disc pl-6 text-slate-300 space-y-2">
              <li>Bar Mark Number</li>
              <li>Bar Diameter</li>
              <li>Bar Shape</li>
              <li>Cutting Length</li>
              <li>Number of Bars</li>
              <li>Total Weight</li>
            </ul>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-4">
              Steel Weight Formula
            </h2>

            <div className="bg-slate-950 rounded-xl p-4 text-orange-400 font-mono text-lg">
              Weight (kg/m) = D² / 162
            </div>

            <p className="text-slate-300 mt-4">
              Where D is the diameter of the reinforcement bar in mm.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-4">
              Advantages of BBS
            </h2>

            <ul className="list-disc pl-6 text-slate-300 space-y-2">
              <li>Accurate steel estimation</li>
              <li>Reduced material wastage</li>
              <li>Better procurement planning</li>
              <li>Improved project budgeting</li>
              <li>Easy site execution</li>
            </ul>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-4">
              Applications of BBS
            </h2>

            <ul className="list-disc pl-6 text-slate-300 space-y-2">
              <li>RCC Beams</li>
              <li>RCC Columns</li>
              <li>RCC Slabs</li>
              <li>Footings</li>
              <li>Retaining Walls</li>
            </ul>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-4">
              Related Articles
            </h2>

            <div className="flex flex-col gap-3">
              <Link
                href="/lap-length-calculation"
                className="text-orange-400 hover:text-orange-300"
              >
                Lap Length Calculation
              </Link>

              <Link
                href="/development-length-calculation"
                className="text-orange-400 hover:text-orange-300"
              >
                Development Length Calculation
              </Link>

              <Link
                href="/steel-weight-calculation-formula"
                className="text-orange-400 hover:text-orange-300"
              >
                Steel Weight Calculation Formula
              </Link>
            </div>
          </div>

        </section>

      </div>
    </main>
  );
}
