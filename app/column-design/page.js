export const metadata = {
  title: 'RCC Column Design Calculator | CivilCalc Pro',
  description:
    'Free RCC Column Design Calculator for civil engineers. Calculate column size, steel reinforcement, axial load, bending moment, and IS code based RCC column design instantly.',
  keywords: [
    'RCC column design',
    'column design calculator',
    'civil engineering calculator',
    'column analysis',
    'IS 456 column design',
    'structural design',
  ],
}

export default function ColumnDesignPage() {
  return (
    <main className="min-h-screen bg-white text-black p-10">
      <h1 className="text-4xl font-bold mb-6">
        RCC Column Design Calculator
      </h1>

      <p className="text-lg mb-6">
        Free online RCC column design calculator for civil engineers and students.
        Calculate column dimensions, reinforcement steel, axial loads, bending moments,
        and structural design as per IS codes.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">
        Features
      </h2>

      <ul className="list-disc pl-6 space-y-2">
        <li>Axial load calculations</li>
        <li>Column sizing</li>
        <li>Steel reinforcement estimation</li>
        <li>IS 456 based RCC column design</li>
        <li>Fast structural analysis</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-10 mb-4">
        Why Use CivilCalc Pro?
      </h2>

      <p>
        CivilCalc Pro helps civil engineers perform RCC column design quickly
        using AI-powered engineering tools and structural calculations.
      </p>
    </main>
  )
}
