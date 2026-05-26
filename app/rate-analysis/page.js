export const metadata = {
  title: 'Construction Rate Analysis Calculator | CivilCalc Pro',
  description:
    'Free construction rate analysis calculator for civil engineering projects.',
}

export default function RateAnalysisPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-16">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            Construction Rate Analysis Calculator
          </h1>

          <p className="text-slate-400 text-lg leading-8">
            Calculate construction rate analysis including material,
            labour and contractor costs for civil engineering works.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4">
            What is Rate Analysis?
          </h2>

          <p className="text-slate-300 leading-8">
            Rate analysis is the process of estimating the per unit
            cost of construction work by considering material,
            labour, transportation and equipment expenses.
          </p>
        </div>

        <div className="mt-10 bg-slate-900 border border-slate-800 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4">
            Components of Rate Analysis
          </h2>

          <ul className="list-disc pl-6 space-y-3 text-slate-300">
            <li>Material Cost</li>
            <li>Labour Cost</li>
            <li>Transportation Cost</li>
            <li>Equipment Charges</li>
            <li>Contractor Profit</li>
          </ul>
        </div>

        <div className="mt-10 bg-slate-900 border border-slate-800 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6 text-slate-300">
            <div>
              <h3 className="font-semibold text-white">
                Why is rate analysis important?
              </h3>

              <p>
                It helps estimate project cost and prepare accurate
                construction budgets.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-white">
                What is included in construction rate analysis?
              </h3>

              <p>
                Materials, labour, transport, machinery and contractor profit.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
