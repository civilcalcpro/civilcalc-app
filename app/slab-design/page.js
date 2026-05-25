export const metadata = {
  title: 'RCC Slab Design Calculator | CivilCalc Pro',
  description:
    'Free RCC slab design calculator for civil engineers. Calculate slab thickness, reinforcement steel, loads, bending moment, and IS code based slab design instantly.',
  keywords: [
    'RCC slab design',
    'slab design calculator',
    'civil engineering calculator',
    'slab analysis',
    'IS 456 slab design',
    'structural design',
  ],
}

export default function SlabDesignPage() {
  return (
    <main className="min-h-screen bg-white text-black p-10">
      <h1 className="text-4xl font-bold mb-6">
        RCC Slab Design Calculator
      </h1>

      <p className="text-lg mb-6">
        Free online RCC slab design calculator for civil engineers and students.
        Calculate slab thickness, reinforcement steel, loads, bending moments,
        and structural design as per IS codes.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">
        Features
      </h2>

      <ul className="list-disc pl-6 space-y-2">
        <li>Slab thickness calculations</li>
        <li>Bending moment calculation</li>
        <li>Steel reinforcement estimation</li>
        <li>IS 456 based RCC slab design</li>
        <li>Fast structural analysis</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-10 mb-4">
        Why Use CivilCalc Pro?
      </h2>

      <p>
        CivilCalc Pro helps civil engineers perform RCC slab design quickly
        using AI-powered engineering tools and structural calculations.
      </p>
    </main>
  )
}
