import Link from "next/link";

export const metadata = {
  title: "Quantity Estimation Calculators | Construction Material Calculator | CivilCalc Pro",
  description:
    "Use free quantity estimation calculators for concrete volume, steel weight, brickwork, plaster, excavation and construction material estimation.",
  alternates: {
    canonical: "https://civilcalcpro.in/quantity-estimation-calculators",
  },
  openGraph: {
    title: "Quantity Estimation Calculators | CivilCalc Pro",
    description:
      "Free online construction quantity estimation calculators for concrete, steel, brickwork, plaster, excavation and civil engineering materials.",
    url: "https://civilcalcpro.in/quantity-estimation-calculators",
    siteName: "CivilCalc Pro",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Quantity Estimation Calculators | CivilCalc Pro",
    description:
      "Calculate construction quantities for concrete, steel, brickwork, plaster and excavation using CivilCalc Pro.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const tools = [
  {
    title: "Concrete Volume Calculator",
    desc: "Calculate concrete quantity for slabs, beams, columns, footings and construction members.",
    href: "/concrete-volume-calculator",
  },
  {
    title: "Home Construction Cost Calculator",
    desc: "Estimate complete house construction cost using built-up area, number of floors, construction quality, material rates, labour cost and detailed cost breakdown.",
    href: "/home-construction-cost-calculator",
  },
  {
    title: "Brickwork Calculator",
    desc: "Estimate number of bricks, mortar quantity, cement and sand required for brick masonry.",
    href: "/brickwork-calculator",
  },
  {
    title: "Plaster Calculator",
    desc: "Calculate cement and sand quantity required for wall plastering and ceiling plastering.",
    href: "/plaster-calculator",
  },
  {
    title: "Excavation Calculator",
    desc: "Calculate earthwork excavation volume, quantity and approximate excavation cost.",
    href: "/excavation-calculator",
  },
  {
    title: "M20 Concrete Mix Ratio",
    desc: "Learn M20 concrete mix ratio and estimate cement, sand and aggregate for nominal mix concrete.",
    href: "/m20-concrete-mix-ratio",
  },
];
export default function QuantityEstimationCalculatorsPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-16">
      <div className="max-w-6xl mx-auto">
        <p className="text-orange-400 font-semibold mb-3">
          QUANTITY ESTIMATION CALCULATORS
        </p>

        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          Construction Quantity Estimation Calculators
        </h1>

        <p className="text-slate-300 text-lg md:text-xl leading-8 max-w-4xl mb-10">
          CivilCalc Pro provides free online quantity estimation calculators for
          civil engineers, contractors, estimators, students and site engineers.
          Calculate concrete volume, steel weight, brickwork quantity, plaster
          quantity, excavation volume and construction material requirements.
        </p>

        <div className="flex flex-wrap gap-4 mb-14">
          <Link
            href="/concrete-volume-calculator"
            className="bg-orange-500 hover:bg-orange-600 transition px-6 py-3 rounded-xl font-semibold"
          >
            Start Concrete Calculation
          </Link>

          <Link
            href="/civil-engineering-calculators"
            className="border border-slate-700 hover:border-orange-500 transition px-6 py-3 rounded-xl font-semibold"
          >
            View All Civil Calculators
          </Link>
        </div>

        <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {tools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="group rounded-2xl border border-slate-800 bg-slate-900 hover:border-orange-500 transition p-6"
            >
              <h2 className="text-xl font-bold mb-3 group-hover:text-orange-400 transition">
                {tool.title}
              </h2>

              <p className="text-slate-300 leading-7">{tool.desc}</p>

              <p className="mt-5 text-orange-400 font-semibold">
                Open Calculator →
              </p>
            </Link>
          ))}
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-8 mb-10">
          <h2 className="text-3xl font-bold mb-5">
            What is Quantity Estimation in Civil Engineering?
          </h2>

          <p className="text-slate-300 leading-8 mb-4">
            Quantity estimation is the process of calculating the amount of
            construction materials required for a project. It includes concrete,
            steel, bricks, cement, sand, aggregate, plaster materials,
            excavation volume and other construction items.
          </p>

          <p className="text-slate-300 leading-8">
            Accurate quantity estimation helps in cost planning, material
            ordering, BOQ preparation, project budgeting and reducing material
            wastage on site.
          </p>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-8 mb-10">
          <h2 className="text-3xl font-bold mb-5">
            Common Quantity Estimation Calculations
          </h2>

          <ul className="list-disc pl-6 space-y-3 text-slate-300 leading-8">
            <li>Concrete volume calculation for RCC members</li>
            <li>Steel bar weight calculation using diameter and length</li>
            <li>Brick quantity calculation for masonry walls</li>
            <li>Cement and sand quantity calculation for plaster</li>
            <li>Excavation volume calculation for foundations and trenches</li>
            <li>Concrete mix material calculation for M20 and other grades</li>
            <li>Construction material estimation for planning and BOQ work</li>
          </ul>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-8 mb-10">
          <h2 className="text-3xl font-bold mb-5">
            Why Use CivilCalc Pro for Quantity Estimation?
          </h2>

          <p className="text-slate-300 leading-8">
            CivilCalc Pro helps users calculate common civil engineering
            quantities quickly without preparing manual spreadsheets for every
            calculation. These tools are useful for site engineers, contractors,
            estimators, students and construction professionals during planning,
            estimation and practical site work.
          </p>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-8 mb-10">
          <h2 className="text-3xl font-bold mb-6">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">
                Which quantity calculators are available?
              </h3>
              <p className="text-slate-300 leading-7">
                CivilCalc Pro includes concrete volume, steel weight, brickwork,
                plaster, excavation and concrete mix ratio calculators.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">
                Can these calculators help in BOQ preparation?
              </h3>
              <p className="text-slate-300 leading-7">
                Yes, quantity estimation calculators help calculate material
                quantities that can be used for BOQ preparation, cost estimation
                and construction planning.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">
                Are these quantity results final?
              </h3>
              <p className="text-slate-300 leading-7">
                These results are useful for estimation and planning. Final
                quantities should be checked according to project drawings, site
                conditions and professional engineering judgement.
              </p>
            </div>
          </div>
        </section>

        <section className="text-center rounded-2xl border border-orange-500/30 bg-orange-500/5 p-10">
          <h2 className="text-3xl font-bold mb-4">
            Explore All Civil Engineering Calculators
          </h2>

          <p className="text-slate-300 max-w-3xl mx-auto leading-8 mb-8">
            View all CivilCalc Pro calculators for RCC design, construction
            estimation, material quantity calculation, reinforcement,
            brickwork, plaster and excavation.
          </p>

          <Link
            href="/civil-engineering-calculators"
            className="inline-block bg-orange-500 hover:bg-orange-600 transition px-8 py-4 rounded-xl font-semibold"
          >
            View All Civil Engineering Calculators
          </Link>
        </section>
      </div>
    </main>
  );
}
