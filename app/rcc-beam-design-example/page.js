import Link from "next/link";

export const metadata = {
  title: "RCC Beam Design Example as per IS 456:2000 | CivilCalc Pro",
  description:
    "Learn RCC Beam Design with a complete worked example as per IS 456:2000 including bending moment calculation, reinforcement design and design procedure.",
};

export default function RCCBeamDesignExamplePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-16">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-5xl font-bold mb-6">
          RCC Beam Design Example as per IS 456:2000
        </h1>

        <p className="text-slate-300 text-lg mb-10">
          This article explains RCC beam design using a simple worked
          example following IS 456:2000 limit state design principles.
        </p>

        <section className="space-y-8">

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-4">
              Given Data
            </h2>

            <ul className="list-disc pl-6 text-slate-300 space-y-2">
              <li>Span = 5 m</li>
              <li>Factored Load = 25 kN/m</li>
              <li>Concrete Grade = M25</li>
              <li>Steel Grade = Fe500</li>
            </ul>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-4">
              Step 1: Calculate Bending Moment
            </h2>

            <p className="text-slate-300 leading-8">
              Maximum bending moment:
            </p>

            <div className="bg-slate-950 rounded-xl p-4 mt-4 text-orange-400 font-mono">
              Mu = wL² / 8
              <br />
              Mu = 25 × 5² / 8
              <br />
              Mu = 78.125 kNm
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-4">
              Step 2: Determine Effective Depth
            </h2>

            <p className="text-slate-300 leading-8">
              Effective depth is calculated based on bending moment,
              concrete grade and steel grade requirements.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-4">
              Step 3: Calculate Reinforcement
            </h2>

            <p className="text-slate-300 leading-8">
              Reinforcement steel is selected to safely resist the
              design bending moment while satisfying IS 456
              requirements.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-4">
              Step 4: Check Shear
            </h2>

            <p className="text-slate-300 leading-8">
              Shear capacity must be verified and stirrups should be
              provided if required.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-4">
              Conclusion
            </h2>

            <p className="text-slate-300 leading-8">
              RCC beam design requires bending moment calculations,
              reinforcement design, shear checks and serviceability
              verification. CivilCalc Pro automates these calculations
              for engineers and students.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-4">
              Related Calculator
            </h2>

            <Link
              href="/beam-design"
              className="text-orange-400 hover:text-orange-300"
            >
              RCC Beam Design Calculator
            </Link>
          </div>

        </section>
      </div>
    </main>
  );
}
