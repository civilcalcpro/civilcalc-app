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
    <main className="min-h-screen bg-white text-black p-10">
      <h1 className="text-4xl font-bold mb-6">
        RCC Beam Design Calculator
      </h1>

      <p className="text-lg mb-6">
        Free online RCC beam design calculator for civil engineers and students.
        Calculate beam dimensions, reinforcement steel, loads, bending moments,
        and structural design as per IS codes.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">
        Features
      </h2>

      <ul className="list-disc pl-6 space-y-2">
        <li>Beam load calculations</li>
        <li>Bending moment calculation</li>
        <li>Steel reinforcement estimation</li>
        <li>IS 456 based RCC design</li>
        <li>Fast structural analysis</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-10 mb-4">
        Why Use CivilCalc Pro?
      </h2>

      <p>
        CivilCalc Pro helps civil engineers perform RCC beam design quickly
        using AI-powered engineering tools and structural calculations.
      </p>
    </main>
  )
}
