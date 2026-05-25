export const metadata = {
  title: 'Excavation Calculator | CivilCalc Pro',
  description:
    'Free Excavation Calculator for civil engineers. Calculate excavation volume, earthwork quantity, trench excavation, and soil removal estimation instantly.',
  keywords: [
    'excavation calculator',
    'earthwork calculator',
    'soil excavation calculator',
    'trench excavation',
    'civil engineering calculator',
    'construction quantity estimation',
  ],
}

export default function ExcavationCalculatorPage() {
  return (
    <main className="min-h-screen bg-white text-black p-10">
      <h1 className="text-4xl font-bold mb-6">
        Excavation Calculator
      </h1>

      <p className="text-lg mb-6">
        Free online excavation calculator for civil engineers,
        contractors, and students. Calculate excavation volume,
        earthwork quantity, trench excavation, and soil removal instantly.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">
        Features
      </h2>

      <ul className="list-disc pl-6 space-y-2">
        <li>Excavation volume calculation</li>
        <li>Earthwork quantity estimation</li>
        <li>Trench excavation calculation</li>
        <li>Soil removal estimation</li>
        <li>Construction quantity estimation</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-10 mb-4">
        Why Use CivilCalc Pro?
      </h2>

      <p>
        CivilCalc Pro helps civil engineers estimate excavation quantities
        quickly using engineering formulas and AI-powered construction tools.
      </p>
    </main>
  )
}
