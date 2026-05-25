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
</main>
  )
}
