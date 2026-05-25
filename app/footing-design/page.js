export const metadata = {
  title: 'RCC Footing Design Calculator | CivilCalc Pro',
  description:
    'Free RCC Footing Design Calculator for civil engineers. Calculate footing size, soil pressure, reinforcement steel, loads, bending moment, and IS code based footing design instantly.',
  keywords: [
    'RCC footing design',
    'footing design calculator',
    'civil engineering calculator',
    'isolated footing design',
    'IS 456 footing design',
    'structural design',
  ],
}

export default function FootingDesignPage() {
  return (
    <main className="min-h-screen bg-white text-black p-10">
      <h1 className="text-4xl font-bold mb-6">
        RCC Footing Design Calculator
      </h1>

      <p className="text-lg mb-6">
        Free online RCC footing design calculator for civil engineers and students.
        Calculate footing dimensions, soil pressure, reinforcement steel, loads,
        bending moments, and structural design as per IS codes.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">
        Features
      </h2>

      <ul className="list-disc pl-6 space-y-2">
        <li>Footing size calculation</li>
        <li>Soil pressure check</li>
        <li>Steel reinforcement estimation</li>
        <li>IS 456 based RCC footing design</li>
        <li>Fast structural analysis</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-10 mb-4">
        Why Use CivilCalc Pro?
      </h2>

      <p>
        CivilCalc Pro helps civil engineers perform RCC footing design quickly
        using AI-powered engineering tools and structural calculations.
      </p>
    </main>
  )
}
