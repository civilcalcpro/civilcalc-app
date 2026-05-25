export const metadata = {
  title: 'Steel Weight Calculator | CivilCalc Pro',
  description:
    'Free Steel Weight Calculator for civil engineers. Calculate TMT bar weight, steel quantity, reinforcement weight, and construction steel estimation instantly.',
  keywords: [
    'steel weight calculator',
    'TMT bar weight calculator',
    'reinforcement steel calculator',
    'civil engineering calculator',
    'steel quantity calculator',
    'construction steel calculator',
  ],
}

export default function SteelWeightCalculatorPage() {
  return (
    <main className="min-h-screen bg-white text-black p-10">
      <h1 className="text-4xl font-bold mb-6">
        Steel Weight Calculator
      </h1>

      <p className="text-lg mb-6">
        Free online steel weight calculator for civil engineers, contractors,
        and students. Calculate TMT bar weight, reinforcement quantity, and
        construction steel estimation quickly.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">
        Features
      </h2>

      <ul className="list-disc pl-6 space-y-2">
        <li>TMT bar weight calculation</li>
        <li>Reinforcement steel quantity estimation</li>
        <li>Steel weight per meter calculation</li>
        <li>Construction steel estimation</li>
        <li>Useful for RCC beams, slabs, columns, and footings</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-10 mb-4">
        Why Use CivilCalc Pro?
      </h2>

      <p>
        CivilCalc Pro helps civil engineers calculate steel weight and
        reinforcement quantities quickly using engineering formulas and
        AI-powered construction tools.
      </p>
    </main>
  )
}
