import Link from "next/link";

export const metadata = {
  title: "Lap Length Calculation | RCC Lap Length Formula",
  description:
    "Learn lap length calculation for reinforcement bars in RCC structures with formulas, examples and practical guidelines.",
};

export default function LapLengthCalculationPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-16">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-5xl font-bold mb-6">
          Lap Length Calculation
        </h1>

        <p className="text-slate-300 text-lg mb-10">
          Lap length is the overlap length provided between two reinforcing
          bars to safely transfer load from one bar to another.
        </p>

        <section className="space-y-8">

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-4">
              What is Lap Length?
            </h2>

            <p className="text-slate-300 leading-8">
              When a single reinforcement bar is not long enough,
              another bar is overlapped with it. The overlapping
              portion is called lap length.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-4">
              Lap Length Formula
            </h2>

            <div className="bg-slate-950 rounded-xl p-4 text-orange-400 font-mono text-lg">
              Lap Length = 50D
            </div>

            <p className="text-slate-300 mt-4">
              Where D is the diameter of the reinforcement bar.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-4">
              Example
            </h2>

            <p className="text-slate-300">
              For a 16 mm bar:
            </p>

            <div className="bg-slate-950 rounded-xl p-4 text-orange-400 font-mono mt-4">
              Lap Length = 50 × 16
              <br />
              = 800 mm
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-4">
              Common Lap Length Values
            </h2>

            <table className="w-full">
              <tbody>
                <tr><td>10 mm Bar</td><td>500 mm</td></tr>
                <tr><td>12 mm Bar</td><td>600 mm</td></tr>
                <tr><td>16 mm Bar</td><td>800 mm</td></tr>
                <tr><td>20 mm Bar</td><td>1000 mm</td></tr>
                <tr><td>25 mm Bar</td><td>1250 mm</td></tr>
              </tbody>
            </table>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-4">
              Related Articles
            </h2>

            <div className="flex flex-col gap-3">
              <Link
                href="/development-length-calculation"
                className="text-orange-400 hover:text-orange-300"
              >
                Development Length Calculation
              </Link>

              <Link
                href="/rcc-beam-design-example"
                className="text-orange-400 hover:text-orange-300"
              >
                RCC Beam Design Example
              </Link>
            </div>
          </div>

        </section>

      </div>
    </main>
  );
}
