  export const metadata = {
  title: 'Plaster Calculator | CivilCalc Pro',
  description:
    'Free Plaster Calculator for civil engineers. Calculate plaster quantity, cement sand ratio, wall plaster area, and material estimation instantly.',
  keywords: [
    'plaster calculator',
    'wall plaster calculator',
    'cement sand ratio calculator',
    'civil engineering calculator',
    'construction material estimation',
    'plaster quantity calculator',
  ],
}

export default function PlasterCalculatorPage() {
  return (
    <main className="min-h-screen bg-white text-black p-10">
      <h1 className="text-4xl font-bold mb-6">
        Plaster Calculator
      </h1>

      <p className="text-lg mb-6">
        Free online plaster calculator for civil engineers,
        contractors, and students. Calculate plaster quantity,
        cement sand ratio, wall plaster area, and material estimation instantly.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">
        Features
      </h2>

      <ul className="list-disc pl-6 space-y-2">
        <li>Wall plaster quantity calculation</li>
        <li>Cement sand ratio estimation</li>
        <li>Material quantity estimation</li>
        <li>Surface area calculation</li>
        <li>Construction material planning</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-10 mb-4">
        Why Use CivilCalc Pro?
      </h2>

      <p>
        CivilCalc Pro helps civil engineers estimate plaster quantities
        quickly using engineering formulas and AI-powered construction tools.
      </p>
    </main>
  )
}
