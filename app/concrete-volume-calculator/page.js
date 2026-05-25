export const metadata = {
  title: 'Concrete Volume Calculator | CivilCalc Pro',
  description:
    'Free Concrete Volume Calculator for civil engineers. Calculate concrete quantity for slabs, beams, columns, footings, and construction projects instantly.',
  keywords: [
    'concrete volume calculator',
    'concrete quantity calculator',
    'RCC concrete calculator',
    'civil engineering calculator',
    'construction quantity estimation',
    'concrete estimation tool',
  ],
}

export default function ConcreteVolumeCalculatorPage() {
  return (
    <main className="min-h-screen bg-white text-black p-10">
      <h1 className="text-4xl font-bold mb-6">
        Concrete Volume Calculator
      </h1>

      <p className="text-lg mb-6">
        Free online concrete volume calculator for civil engineers,
        contractors, and students. Calculate concrete quantity for slabs,
        beams, columns, footings, and construction work instantly.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">
        Features
      </h2>

      <ul className="list-disc pl-6 space-y-2">
        <li>Concrete quantity calculation</li>
        <li>RCC slab concrete estimation</li>
        <li>Beam and column volume calculation</li>
        <li>Footing concrete estimation</li>
        <li>Construction material quantity estimation</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-10 mb-4">
        Why Use CivilCalc Pro?
      </h2>

      <p>
        CivilCalc Pro helps civil engineers estimate concrete quantities
        quickly using engineering formulas and AI-powered construction tools.
      </p>
    </main>
  )
}
