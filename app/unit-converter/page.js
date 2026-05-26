export const metadata = {
  title: 'Engineering Unit Converter | CivilCalc Pro',
  description:
    'Free engineering unit converter for civil engineering calculations.',
}

export default function UnitConverterPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-16">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            Engineering Unit Converter
          </h1>

          <p className="text-slate-400 text-lg leading-8">
            Convert engineering units including length, area,
            volume, pressure and weight.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4">
            Common Unit Conversions
          </h2>

          <ul className="list-disc pl-6 space-y-3 text-slate-300">
            <li>Meter to Feet</li>
            <li>Square Meter to Square Feet</li>
            <li>Cubic Meter to Cubic Feet</li>
            <li>Kilogram to Ton</li>
            <li>MPa to kN/m²</li>
          </ul>
        </div>

        <div className="mt-10 bg-slate-900 border border-slate-800 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4">
            Why Unit Conversion Matters
          </h2>

          <p className="text-slate-300 leading-8">
            Accurate unit conversion is essential in structural
            design, quantity estimation and construction planning.
          </p>
        </div>

        <div className="mt-10 bg-slate-900 border border-slate-800 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6 text-slate-300">
            <div>
              <h3 className="font-semibold text-white">
                Which units are commonly used in civil engineering?
              </h3>

              <p>
                Meter, feet, cubic meter, ton and MPa are widely used.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-white">
                Why is engineering unit conversion important?
              </h3>

              <p>
                It prevents calculation mistakes during design and estimation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
