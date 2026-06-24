import Link from "next/link";

export const metadata = {
  title: "Civil Engineering Calculators | Free Online Civil Tools | CivilCalc Pro",
  description:
    "Use free online civil engineering calculators for RCC beam design, column design, footing design, slab design, concrete volume, steel weight, brickwork, plaster, excavation and construction estimation.",
  alternates: {
    canonical: "https://civilcalcpro.in/civil-engineering-calculators",
  },
  openGraph: {
    title: "Civil Engineering Calculators | Free Online Civil Tools | CivilCalc Pro",
    description:
      "Free online civil engineering calculators for structural design, quantity estimation, construction materials, RCC design and site engineering calculations.",
    url: "https://civilcalcpro.in/civil-engineering-calculators",
    siteName: "CivilCalc Pro",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Civil Engineering Calculators | CivilCalc Pro",
    description:
      "Free civil engineering calculators for RCC design, steel weight, concrete volume, brickwork, plaster, excavation and construction estimation.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const calculators = [
  {
    title: "RCC Beam Design Calculator",
    desc: "Calculate bending moment, shear force, effective depth and reinforcement for RCC beams.",
    href: "/beam-design",
    category: "Structural Design",
  },
  {
    title: "RCC Column Design Calculator",
    desc: "Design RCC columns with axial load, slenderness ratio and reinforcement checks.",
    href: "/column-design",
    category: "Structural Design",
  },
  {
    title: "RCC Footing Design Calculator",
    desc: "Calculate footing size, soil pressure, concrete volume and reinforcement requirement.",
    href: "/footing-design",
    category: "Structural Design",
  },
  {
    title: "One Way Slab Calculator",
    desc: "Calculate slab design values, load distribution and reinforcement for one-way slabs.",
    href: "/one-way-slab-calculator",
    category: "Slab Design",
  },
  {
    title: "Two Way Slab Calculator",
    desc: "Calculate two-way slab design values, aspect ratio and reinforcement requirements.",
    href: "/two-way-slab-calculator",
    category: "Slab Design",
  },
  {
    title: "Concrete Volume Calculator",
    desc: "Calculate concrete quantity for slabs, beams, columns, footings and construction work.",
    href: "/concrete-volume-calculator",
    category: "Quantity Estimation",
  },
  {
    title: "Steel Weight Calculator",
    desc: "Calculate steel bar weight using diameter, length and standard steel weight formula.",
    href: "/steel-weight-calculator",
    category: "Quantity Estimation",
  },
  {
    title: "Brickwork Calculator",
    desc: "Estimate bricks, mortar, cement and sand quantity required for brick masonry work.",
    href: "/brickwork-calculator",
    category: "Masonry Work",
  },
  {
    title: "Plaster Calculator",
    desc: "Calculate cement and sand quantity required for wall plastering and ceiling plastering.",
    href: "/plaster-calculator",
    category: "Finishing Work",
  },
  {
    title: "Excavation Calculator",
    desc: "Calculate earthwork excavation quantity, volume and approximate excavation cost.",
    href: "/excavation-calculator",
    category: "Earthwork",
  },
  {
    title: "Development Length Calculation",
    desc: "Understand development length formula, importance and reinforcement anchorage concept.",
    href: "/development-length-calculation",
    category: "Reinforcement",
  },
  {
    title: "Lap Length Calculation",
    desc: "Learn lap length calculation for reinforcement bars in RCC construction work.",
    href: "/lap-length-calculation",
    category: "Reinforcement",
  },
  {
    title: "Bar Bending Schedule Guide",
    desc: "Learn BBS preparation, bar mark, cutting length and reinforcement scheduling basics.",
    href: "/bar-bending-schedule-guide",
    category: "Reinforcement",
  },
  {
    title: "M20 Concrete Mix Ratio",
    desc: "Learn M20 concrete mix ratio, cement, sand and aggregate quantity for nominal mix.",
    href: "/m20-concrete-mix-ratio",
    category: "Concrete Mix",
  },
];

const categories = [
  "Structural Design",
  "Slab Design",
  "Quantity Estimation",
  "Masonry Work",
  "Finishing Work",
  "Earthwork",
  "Reinforcement",
  "Concrete Mix",
];

export default function CivilEngineeringCalculatorsPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <p className="text-orange-400 font-semibold mb-3">
            CIVIL ENGINEERING CALCULATORS
          </p>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Free Online Civil Engineering Calculators
          </h1>

          <p className="text-slate-300 text-lg md:text-xl leading-8 max-w-4xl mb-10">
            CivilCalc Pro provides free online civil engineering calculators for
            RCC design, construction estimation, quantity calculation, steel
            weight, concrete volume, brickwork, plaster, excavation and
            reinforcement calculations.
          </p>

          <div className="flex flex-wrap gap-4 mb-14">
            <Link
              href="/login"
              className="bg-orange-500 hover:bg-orange-600 transition px-6 py-3 rounded-xl font-semibold"
            >
              Open Dashboard
            </Link>

            <Link
              href="/beam-design"
              className="border border-slate-700 hover:border-orange-500 transition px-6 py-3 rounded-xl font-semibold"
            >
              Start With Beam Design
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-2xl font-bold mb-3">Structural Design</h2>
              <p className="text-slate-300 leading-7">
                RCC beam, column, footing and slab design tools for students,
                engineers and construction professionals.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-2xl font-bold mb-3">Quantity Estimation</h2>
              <p className="text-slate-300 leading-7">
                Calculate concrete volume, steel weight, brickwork, plaster and
                excavation quantities quickly.
              </p>
            </div>

            <div className="rounded-2xl border border-orange-500/30 bg-orange-500/5 p-6">
              <h2 className="text-2xl font-bold mb-3 text-orange-400">
                PDF Reports
              </h2>
              <p className="text-slate-300 leading-7">
                Generate professional calculation outputs and use them for
                project planning, estimation and site work.
              </p>
            </div>
          </div>

          {categories.map((category) => (
            <section key={category} className="mb-14">
              <h2 className="text-3xl font-bold mb-6">{category}</h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {calculators
                  .filter((item) => item.category === category)
                  .map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="group rounded-2xl border border-slate-800 bg-slate-900 hover:border-orange-500 transition p-6"
                    >
                      <p className="text-sm text-orange-400 font-semibold mb-3">
                        {item.category}
                      </p>

                      <h3 className="text-xl font-bold mb-3 group-hover:text-orange-400 transition">
                        {item.title}
                      </h3>

                      <p className="text-slate-300 leading-7">{item.desc}</p>

                      <p className="mt-5 text-orange-400 font-semibold">
                        Open Calculator →
                      </p>
                    </Link>
                  ))}
              </div>
            </section>
          ))}

          <section className="mt-20 rounded-2xl border border-slate-800 bg-slate-900 p-8">
            <h2 className="text-3xl font-bold mb-5">
              Why Use CivilCalc Pro Calculators?
            </h2>

            <div className="grid md:grid-cols-2 gap-6 text-slate-300 leading-8">
              <div>
                <p>
                  CivilCalc Pro helps civil engineers, contractors, students and
                  site engineers perform common construction calculations faster.
                  Instead of using manual spreadsheets for every small
                  calculation, users can open a calculator, enter project values
                  and get estimated results instantly.
                </p>
              </div>

              <div>
                <p>
                  The platform is useful for RCC design assistance, construction
                  material estimation, site planning, project reports, BOQ
                  preparation and quick engineering checks during practical site
                  work.
                </p>
              </div>
            </div>
          </section>

          <section className="mt-14 rounded-2xl border border-slate-800 bg-slate-900 p-8">
            <h2 className="text-3xl font-bold mb-6">
              Frequently Asked Questions
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  What is a civil engineering calculator?
                </h3>
                <p className="text-slate-300 leading-7">
                  A civil engineering calculator is an online tool used to
                  calculate engineering values such as concrete volume, steel
                  weight, RCC design values, brickwork quantity, plaster
                  quantity and excavation volume.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Are CivilCalc Pro calculators free?
                </h3>
                <p className="text-slate-300 leading-7">
                  CivilCalc Pro provides free online civil engineering
                  calculator pages and professional tools for engineers,
                  students, contractors and construction professionals.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Can I use these results directly for construction?
                </h3>
                <p className="text-slate-300 leading-7">
                  Calculator results should be used for estimation, planning and
                  engineering assistance. Final structural design and site
                  execution should always be verified by a qualified civil or
                  structural engineer.
                </p>
              </div>
            </div>
          </section>

          <section className="mt-14 text-center rounded-2xl border border-orange-500/30 bg-orange-500/5 p-10">
            <h2 className="text-3xl font-bold mb-4">
              Start Civil Engineering Calculations Online
            </h2>

            <p className="text-slate-300 max-w-3xl mx-auto leading-8 mb-8">
              Use CivilCalc Pro to calculate RCC design values, quantities,
              construction materials and estimation reports from one professional
              civil engineering dashboard.
            </p>

            <Link
              href="/login"
              className="inline-block bg-orange-500 hover:bg-orange-600 transition px-8 py-4 rounded-xl font-semibold"
            >
              Open CivilCalc Pro Dashboard
            </Link>
          </section>
        </div>
      </section>
    </main>
  );
}
