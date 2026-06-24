import Link from "next/link";

export const metadata = {
  title:
    "Home Construction Cost Calculator | House Construction Estimate | CivilCalc Pro",
  description:
    "Use free home construction cost calculator to estimate house construction cost, built-up area cost, material quantity, labour cost, RCC work, brickwork, plaster, flooring and finishing cost.",
  alternates: {
    canonical: "https://civilcalcpro.in/home-construction-cost-calculator",
  },
  openGraph: {
    title:
      "Home Construction Cost Calculator | House Construction Estimate | CivilCalc Pro",
    description:
      "Estimate complete house construction cost with area, floors, quality type, material rates, labour cost and detailed cost breakdown.",
    url: "https://civilcalcpro.in/home-construction-cost-calculator",
    siteName: "CivilCalc Pro",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Home Construction Cost Calculator | CivilCalc Pro",
    description:
      "Calculate estimated house construction cost, material quantity and cost breakdown using CivilCalc Pro.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function HomeConstructionCostCalculatorPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-16">
      <div className="max-w-6xl mx-auto">
        <p className="text-orange-400 font-semibold mb-3">
          HOUSE CONSTRUCTION COST ESTIMATOR
        </p>

        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          Home Construction Cost Calculator
        </h1>

        <p className="text-slate-300 text-lg md:text-xl leading-8 max-w-4xl mb-10">
          Estimate complete house construction cost using built-up area, number
          of floors, construction quality, material rates, labour cost and
          detailed cost breakdown. CivilCalc Pro helps homeowners, contractors,
          civil engineers and students calculate approximate building
          construction cost quickly.
        </p>

        <div className="flex flex-wrap gap-4 mb-14">
          <Link
            href="/login?redirect=/dashboard/calculators/home-construction"
            className="bg-orange-500 hover:bg-orange-600 transition px-6 py-3 rounded-xl font-semibold"
          >
            Open Home Construction Cost Calculator
          </Link>

          <Link
            href="/quantity-estimation-calculators"
            className="border border-slate-700 hover:border-orange-500 transition px-6 py-3 rounded-xl font-semibold"
          >
            View Quantity Estimation Tools
          </Link>
        </div>
        <section className="rounded-2xl border border-orange-500/30 bg-orange-500/5 p-8 mb-12">
          <p className="text-orange-400 font-semibold mb-3">
            QUICK ANSWER
          </p>

          <h2 className="text-3xl font-bold mb-5">
            How much does it cost to build a house?
          </h2>

          <p className="text-slate-300 leading-8 mb-4">
            House construction cost is commonly estimated by multiplying the
            built-up area by the construction cost per square foot. The final
            cost depends on location, construction quality, material rates,
            labour charges, number of floors, structural design and finishing
            specifications.
          </p>

          <div className="overflow-x-auto mt-6">
            <table className="w-full border border-slate-800 text-left">
              <thead className="bg-slate-900">
                <tr>
                  <th className="border border-slate-800 p-3 text-white">
                    Construction Quality
                  </th>
                  <th className="border border-slate-800 p-3 text-white">
                    Approx. Cost per sq ft
                  </th>
                  <th className="border border-slate-800 p-3 text-white">
                    Suitable For
                  </th>
                </tr>
              </thead>

              <tbody className="text-slate-300">
                <tr>
                  <td className="border border-slate-800 p-3">
                    Economy
                  </td>
                  <td className="border border-slate-800 p-3">
                    ₹1,400 – ₹1,700 per sq ft
                  </td>
                  <td className="border border-slate-800 p-3">
                    Basic residential construction
                  </td>
                </tr>

                <tr>
                  <td className="border border-slate-800 p-3">
                    Standard
                  </td>
                  <td className="border border-slate-800 p-3">
                    ₹1,700 – ₹2,200 per sq ft
                  </td>
                  <td className="border border-slate-800 p-3">
                    Common house construction
                  </td>
                </tr>

                <tr>
                  <td className="border border-slate-800 p-3">
                    Premium
                  </td>
                  <td className="border border-slate-800 p-3">
                    ₹2,200 – ₹3,000+ per sq ft
                  </td>
                  <td className="border border-slate-800 p-3">
                    Better finishing and premium materials
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-slate-400 leading-7 mt-5">
            Example: If built-up area is 1,000 sq ft and construction quality is
            standard at ₹1,800 per sq ft, approximate construction cost will be
            around ₹18,00,000. This is only an estimate and should be checked
            with local rates and project drawings.
          </p>
        </section>
        <section className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-2xl font-bold mb-3">Area Based Estimate</h2>
            <p className="text-slate-300 leading-7">
              Calculate estimated construction cost using built-up area, plot
              size, number of floors and cost per square foot.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-2xl font-bold mb-3">Material Breakdown</h2>
            <p className="text-slate-300 leading-7">
              Estimate cement, sand, aggregate, steel, bricks, labour and major
              construction material requirements.
            </p>
          </div>

          <div className="rounded-2xl border border-orange-500/30 bg-orange-500/5 p-6">
            <h2 className="text-2xl font-bold mb-3 text-orange-400">
              Cost Summary
            </h2>
            <p className="text-slate-300 leading-7">
              Get approximate cost breakup for foundation, RCC, brickwork,
              plaster, flooring, painting, electrical and plumbing.
            </p>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-8 mb-10">
          <h2 className="text-3xl font-bold mb-5">
            What is a Home Construction Cost Calculator?
          </h2>

          <p className="text-slate-300 leading-8 mb-4">
            A home construction cost calculator is an online tool used to
            estimate the approximate cost of building a house. It considers
            built-up area, number of floors, construction quality, material
            rates, labour cost and common construction work categories.
          </p>

          <p className="text-slate-300 leading-8">
            This calculator is useful before starting house construction because
            it gives a quick idea of how much money may be required for civil
            work, RCC work, masonry, plaster, flooring, doors, windows,
            electrical, plumbing, painting and finishing.
          </p>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-8 mb-10">
          <h2 className="text-3xl font-bold mb-5">
            Common Cost Items in House Construction
          </h2>

          <ul className="list-disc pl-6 space-y-3 text-slate-300 leading-8">
            <li>Excavation and foundation work</li>
            <li>RCC footing, column, beam and slab work</li>
            <li>Brickwork and block masonry</li>
            <li>Internal and external plastering</li>
            <li>Flooring, tiles and skirting work</li>
            <li>Doors, windows and grill work</li>
            <li>Electrical and plumbing work</li>
            <li>Painting, waterproofing and finishing work</li>
            <li>Labour charges and material transportation</li>
          </ul>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-8 mb-10">
          <h2 className="text-3xl font-bold mb-5">
            Material Required for House Construction
          </h2>

          <p className="text-slate-300 leading-8 mb-4">
            A residential building usually requires cement, sand, aggregate,
            steel, bricks or blocks, tiles, plumbing materials, electrical
            materials, paint, doors, windows and finishing items. The exact
            quantity depends on building size, design, structural system,
            material specification and site conditions.
          </p>

          <p className="text-slate-300 leading-8">
            CivilCalc Pro helps users estimate major construction materials and
            cost components so they can plan budget, compare options and discuss
            requirements with contractors or engineers before starting work.
          </p>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-8 mb-10">
          <h2 className="text-3xl font-bold mb-5">
            Why Use CivilCalc Pro for House Construction Cost?
          </h2>

          <p className="text-slate-300 leading-8">
            CivilCalc Pro gives a simple and professional way to calculate
            approximate construction cost without creating manual spreadsheets.
            Users can enter house area, floors, quality type and material rates
            to understand expected construction cost, material quantity and cost
            distribution. Final project cost should always be verified with
            detailed drawings, local rates and professional estimation.
          </p>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-8 mb-10">
          <h2 className="text-3xl font-bold mb-6">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">
                How is home construction cost calculated?
              </h3>
              <p className="text-slate-300 leading-7">
                Home construction cost is commonly estimated by multiplying the
                built-up area by approximate cost per square foot and then
                adjusting it based on construction quality, material rates,
                labour charges and project requirements.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">
                What details are needed for house construction estimate?
              </h3>
              <p className="text-slate-300 leading-7">
                Basic details include built-up area, number of floors, location,
                construction quality, cement rate, sand rate, steel rate, brick
                rate, aggregate rate and labour cost.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">
                Is this calculator useful before building a house?
              </h3>
              <p className="text-slate-300 leading-7">
                Yes, it helps homeowners and engineers get an approximate budget
                idea before construction. Final cost should be checked with
                drawings, site conditions and current local market rates.
              </p>
            </div>
          </div>
        </section>

        <section className="text-center rounded-2xl border border-orange-500/30 bg-orange-500/5 p-10">
          <h2 className="text-3xl font-bold mb-4">
            Calculate Your House Construction Cost
          </h2>

          <p className="text-slate-300 max-w-3xl mx-auto leading-8 mb-8">
            Use CivilCalc Pro to estimate house construction cost, material
            quantity, labour cost and construction cost breakdown in one place.
          </p>

          <Link
            href="/login?redirect=/dashboard/calculators/home-construction"
            className="inline-block bg-orange-500 hover:bg-orange-600 transition px-8 py-4 rounded-xl font-semibold"
          >
            Open Home Construction Cost Calculator
          </Link>
        </section>
      </div>
    </main>
  );
}
