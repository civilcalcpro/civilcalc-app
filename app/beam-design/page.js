export const metadata = {
  title: 'RCC Beam Design Calculator | CivilCalc Pro',
  description:
    'Free RCC Beam Design Calculator for civil engineers. Calculate beam size, steel reinforcement, loads, bending moment, and IS code based RCC beam design instantly.',
  keywords: [
    'RCC beam design',
    'beam design calculator',
    'civil engineering calculator',
    'beam analysis',
    'IS 456 beam design',
    'structural design',
  ],
}

export default function BeamDesignPage() {
  return (
<main className="min-h-screen bg-slate-950 text-white p-10">
  <div className="max-w-6xl mx-auto">
    <p className="text-orange-400 font-semibold mb-2">RCC CALCULATOR</p>

    <h1 className="text-5xl font-bold mb-4">Beam Design</h1>

    <p className="text-slate-400 text-lg mb-8">
      Singly / doubly reinforced rectangular beam — limit state method per IS 456:2000
    </p>

    <div className="grid md:grid-cols-2 gap-8">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-2xl font-semibold mb-4">
          RCC Beam Design Calculator
        </h2>

        <p className="text-slate-300 mb-4">
          Calculate beam dimensions, reinforcement steel, loads, bending moments,
          and structural design as per IS codes.
        </p>

        <ul className="list-disc pl-6 space-y-2 text-slate-300">
          <li>Beam load calculations</li>
          <li>Bending moment calculation</li>
          <li>Steel reinforcement estimation</li>
          <li>IS 456 based RCC design</li>
          <li>Fast structural analysis</li>
        </ul>
      </div>

      <div className="bg-slate-900 border border-dashed border-slate-700 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
        <div className="text-orange-400 font-semibold mb-3">
          FULL CALCULATOR ACCESS
        </div>

        <h2 className="text-2xl font-bold mb-4">
          Login to use the real Beam Design Calculator
        </h2>

        <p className="text-slate-400 mb-6">
          Run design checks, calculate reinforcement, view results,
          and generate PDF reports.
        </p>

        <a
          href="/login"
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold"
        >
          Login to Use Calculator
        </a>
      </div>
    </div>
  </div>
<section className="mt-16 space-y-8">
  <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
    <h2 className="text-2xl font-bold text-white mb-4">
      RCC Beam Design Formula
    </h2>

    <p className="text-slate-300 leading-7 mb-4">
      RCC beam design is used to calculate bending moment, shear force,
      effective depth and reinforcement required for a reinforced concrete beam.
    </p>

    <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-orange-400 font-mono text-lg">
      Mu = 1.5 × w × L² / 8
    </div>
  </div>

  <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
    <h2 className="text-2xl font-bold text-white mb-4">
      IS Code Used for Beam Design
    </h2>

    <p className="text-slate-300 leading-7">
      This RCC beam design calculator follows the limit state design method
      based on IS 456:2000. Civil engineers use this code for reinforced
      concrete beam design, slab design, column design and footing design.
    </p>
  </div>

  <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
    <h2 className="text-2xl font-bold text-white mb-4">
      Frequently Asked Questions
    </h2>

    <div className="space-y-5 text-slate-300">
      <div>
        <h3 className="font-semibold text-white">
          What is RCC beam design?
        </h3>
        <p>
          RCC beam design is the process of selecting beam dimensions and
          steel reinforcement to safely resist bending and shear forces.
        </p>
      </div>

      <div>
        <h3 className="font-semibold text-white">
          Which IS code is used for RCC beam design?
        </h3>
        <p>
          IS 456:2000 is commonly used for reinforced concrete beam design
          in India.
        </p>
      </div>

      <div>
        <h3 className="font-semibold text-white">
          What is bending moment in beam design?
        </h3>
        <p>
          Bending moment is the internal moment developed in a beam due to
          applied loads. It is used to calculate required steel reinforcement.
        </p>
      </div>
    </div>
  </div>
</section>
            </main>
  )
}
