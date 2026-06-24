import Link from "next/link";

export const metadata = {
  title:
    "Construction Material Calculators | Concrete Steel Brick Plaster | CivilCalc Pro",
  description:
    "Use construction material calculators for concrete, steel, brickwork, plaster, excavation, cement, sand, aggregate and building material quantity estimation.",
  alternates: {
    canonical: "https://civilcalcpro.in/construction-material-calculators",
  },
  openGraph: {
    title: "Construction Material Calculators | CivilCalc Pro",
    description:
      "Free construction material calculators for concrete volume, steel weight, brickwork, plaster, excavation, cement, sand and aggregate estimation.",
    url: "https://civilcalcpro.in/construction-material-calculators",
    siteName: "CivilCalc Pro",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Construction Material Calculators | CivilCalc Pro",
    description:
      "Calculate concrete, steel, bricks, plaster, cement, sand, aggregate and excavation quantities using CivilCalc Pro.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const tools = [
  {
    title: "Concrete Volume Calculator",
    desc: "Calculate concrete quantity for slabs, beams, columns, footings and RCC construction members.",
    href: "/concrete-volume-calculator",
  },
  {
    title: "M20 Concrete Mix Ratio",
    desc: "Learn M20 concrete mix ratio and estimate cement, sand and aggregate quantity for nominal mix concrete.",
    href: "/m20-concrete-mix-ratio",
  },
  {
    title: "Steel Weight Calculator",
    desc: "Calculate steel bar weight using diameter, length and standard reinforcement steel formula.",
    href: "/steel-weight-calculator",
  },
  {
    title: "Brickwork Calculator",
    desc: "Estimate number of bricks, mortar quantity, cement and sand required for brick masonry work.",
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
];

export default function ConstructionMaterialCalculatorsPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-16">
      <div className="max-w-6xl mx-auto">
        <p className="text-orange-400 font-semibold mb-3">
          CONSTRUCTION MATERIAL CALCULATORS
        </p>

        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          Construction Material Calculators for Concrete, Steel, Brickwork and
          Plaster
        </h1>

        <p className="text-slate-300 text-lg md:text-xl leading-8 max-w-4xl mb-10">
          CivilCalc Pro provides free construction material calculators for civil
          engineers, contractors, estimators, students and site engineers.
          Calculate concrete volume, steel weight, brick quantity, plaster
          materials, cement, sand, aggregate and excavation quantity for
          construction planning.
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
            What is Construction Material Estimation?
          </h2>

          <p className="text-slate-300 leading-8 mb-4">
            Construction material estimation is the process of calculating the
            quantity of materials required for a construction project. It
            includes concrete, cement, sand, aggregate, steel, bricks, plaster
            materials and excavation volume.
          </p>

          <p className="text-slate-300 leading-8">
            Proper material estimation helps engineers and contractors plan
            project cost, order materials correctly, reduce wastage, prepare BOQ
            items and manage site work more efficiently.
          </p>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-8 mb-10">
          <h2 className="text-3xl font-bold mb-5">
            Common Building Material Calculations
          </h2>

          <ul className="list-disc pl-6 space-y-3 text-slate-300 leading-8">
            <li>Concrete volume calculation for RCC members</li>
            <li>Cement, sand and aggregate quantity calculation</li>
            <li>Steel reinforcement weight calculation</li>
            <li>Brick quantity and mortar quantity calculation</li>
            <li>Plaster cement and sand quantity calculation</li>
            <li>Excavation volume calculation for foundations and trenches</li>
            <li>Material quantity estimation for BOQ and project planning</li>
          </ul>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-8 mb-10">
          <h2 className="text-3xl font-bold mb-5">
            Why Use CivilCalc Pro for Material Calculation?
          </h2>

          <p className="text-slate-300 leading-8">
            CivilCalc Pro helps users calculate common building material
            quantities quickly without preparing manual spreadsheets for every
            task. These calculators are useful for site engineers, civil
            engineering students, contractors, estimators and construction
            professionals during planning, estimation and site execution.
          </p>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-8 mb-10">
          <h2 className="text-3xl font-bold mb-6">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">
                Which construction material calculators are available?
              </h3>
              <p className="text-slate-300 leading-7">
                CivilCalc Pro includes concrete volume, steel weight, brickwork,
                plaster, excavation and concrete mix ratio calculators.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">
                Can these calculators help reduce material wastage?
              </h3>
              <p className="text-slate-300 leading-7">
                Yes, material calculators help estimate required quantities
                before ordering materials. This can support better planning and
                reduce unnecessary wastage on site.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">
                Are material calculator results final?
              </h3>
              <p className="text-slate-300 leading-7">
                These calculators provide estimation and planning assistance.
                Final quantities should be checked with project drawings, site
                conditions, material specifications and professional judgement.
              </p>
            </div>
          </div>
        </section>

        <section className="text-center rounded-2xl border border-orange-500/30 bg-orange-500/5 p-10">
          <h2 className="text-3xl font-bold mb-4">
            Explore All Civil Engineering Calculators
          </h2>

          <p className="text-slate-300 max-w-3xl mx-auto leading-8 mb-8">
            View all CivilCalc Pro calculators for RCC design, quantity
            estimation, construction materials, concrete volume, steel weight,
            brickwork, plaster, excavation and reinforcement calculations.
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
