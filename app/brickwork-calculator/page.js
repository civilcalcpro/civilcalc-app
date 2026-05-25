export const metadata = {
  title: 'Brickwork Calculator | CivilCalc Pro',
  description:
    'Free Brickwork Calculator for civil engineers. Calculate number of bricks, mortar quantity, wall volume, and brickwork estimation instantly.',
  keywords: [
    'brickwork calculator',
    'brick quantity calculator',
    'brick estimation',
    'wall brick calculator',
    'civil engineering calculator',
    'construction material calculator',
  ],
}

export default function BrickworkCalculatorPage() {
  return (
    <main className="min-h-screen bg-white text-black p-10">
      <h1 className="text-4xl font-bold mb-6">
        Brickwork Calculator
      </h1>

      <p className="text-lg mb-6">
        Free online brickwork calculator for civil engineers, contractors,
        and students. Calculate number of bricks, mortar quantity,
        wall volume, and construction material estimation instantly.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">
        Features
      </h2>

      <ul className="list-disc pl-6 space-y-2">
        <li>Brick quantity calculation</li>
        <li>Mortar quantity estimation</li>
        <li>Wall volume calculation</li>
        <li>Construction material estimation</li>
        <li>Useful for residential and commercial projects</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-10 mb-4">
        Why Use CivilCalc Pro?
      </h2>

      <p>
        CivilCalc Pro helps civil engineers estimate brickwork quantities
        quickly using engineering formulas and AI-powered construction tools.
      </p>
    </main>
  )
}
