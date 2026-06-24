import Link from "next/link";

export const metadata = {
  title: "RCC Design Calculators | Beam Column Slab Footing | CivilCalc Pro",
  description:
    "Use RCC design calculators for beam design, column design, footing design, one way slab, two way slab, reinforcement and concrete design calculations.",
  alternates: {
    canonical: "https://civilcalcpro.in/rcc-design-calculators",
  },
  openGraph: {
    title: "RCC Design Calculators | CivilCalc Pro",
    description:
      "Free RCC design calculators for beam, column, footing, slab and reinforcement calculations for civil engineers and students.",
    url: "https://civilcalcpro.in/rcc-design-calculators",
    siteName: "CivilCalc Pro",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RCC Design Calculators | CivilCalc Pro",
    description:
      "Online RCC beam, column, footing and slab design calculators for civil engineering calculations.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const tools = [
  {
    title: "RCC Beam Design Calculator",
    desc: "Calculate bending moment, shear force, effective depth and steel reinforcement for RCC beams.",
    href: "/beam-design",
  },
  {
    title: "RCC Column Design Calculator",
    desc: "Calculate axial load, column size, slenderness ratio and reinforcement for RCC columns.",
    href: "/column-design",
  },
  {
    title: "RCC Footing Design Calculator",
    desc: "Calculate footing size, soil pressure, concrete volume and footing reinforcement.",
    href: "/footing-design",
  },
  {
    title: "One Way Slab Calculator",
    desc: "Calculate slab design values and reinforcement for one-way RCC slabs.",
    href: "/one-way-slab-calculator",
  },
  {
    title: "Two Way Slab Calculator",
    desc: "Calculate two-way slab aspect ratio, design values and reinforcement requirements.",
    href: "/two-way-slab-calculator",
  },
  {
    title: "Steel Weight Calculator",
    desc: "Calculate reinforcement steel weight using diameter, length and standard bar weight formula.",
    href: "/steel-weight-calculator",
  },
];

export default function RCCDesignCalculatorsPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-16">
      <div className="max-w-6xl mx-auto">
        <p className="text-orange-400 font-semibold mb-3">
          RCC DESIGN CALCULATORS
        </p>

        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          RCC Design Calculators for Beam, Column, Slab and Footing
        </h1>

        <p className="text-slate-300 text-lg md:text-xl leading-8 max-w-4xl mb-10">
          CivilCalc Pro provides RCC design calculators for civil engineers,
          students, contractors and construction professionals. Use these tools
          for RCC beam design, column design, footing design, slab design,
          reinforcement calculation and structural design assistance.
        </p>

        <div className="flex flex-wrap gap-4 mb-14">
          <Link
            href="/beam-design"
            className="bg-orange-500 hover:bg-orange-600 transition px-6 py-3 rounded-xl font-semibold"
          >
            Start RCC Beam Design
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
            What is RCC Design?
          </h2>

          <p className="text-slate-300 leading-8 mb-4">
            RCC design means reinforced cement concrete design. In RCC
            structures, concrete is used to resist compression and steel
            reinforcement is used to resist tension. RCC design is required for
            beams, columns, slabs, footings, staircases and other structural
            members.
          </p>

          <p className="text-slate-300 leading-8">
            RCC design calculations usually include load calculation, bending
            moment, shear force, effective depth, reinforcement area, spacing,
            cover, development length and structural safety checks.
          </p>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-8 mb-10">
          <h2 className="text-3xl font-bold mb-5">
            Common RCC Design Calculations
          </h2>

          <ul className="list-disc pl-6 space-y-3 text-slate-300 leading-8">
            <li>RCC beam bending moment and shear force calculation</li>
            <li>Column axial load and reinforcement calculation</li>
            <li>Footing size and soil pressure calculation</li>
            <li>One way slab and two way slab design calculation</li>
            <li>Steel bar weight and reinforcement quantity calculation</li>
            <li>Concrete volume calculation for RCC members</li>
            <li>Development length and lap length checks</li>
          </ul>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-8 mb-10">
          <h2 className="text-3xl font-bold mb-5">
            RCC Design Tools in CivilCalc Pro
          </h2>

          <p className="text-slate-300 leading-8">
            CivilCalc Pro helps users perform RCC-related calculations faster by
            connecting important design tools in one place. These calculators are
            useful for estimation, learning, checking, project planning and site
            engineering work. Final structural design should always be verified
            by a qualified civil or structural engineer before real construction
            use.
          </p>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-8 mb-10">
          <h2 className="text-3xl font-bold mb-6">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">
                Which RCC calculators are available?
              </h3>
              <p className="text-slate-300 leading-7">
                CivilCalc Pro includes RCC beam design, column design, footing
                design, one way slab, two way slab and steel weight calculators.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">
                Can RCC calculator results be used directly on site?
              </h3>
              <p className="text-slate-300 leading-7">
                These calculators are useful for estimation and design
                assistance. Final design should be checked by a qualified civil
                or structural engineer according to local codes and project
                requirements.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">
                Who can use RCC design calculators?
              </h3>
              <p className="text-slate-300 leading-7">
                Civil engineering students, site engineers, contractors,
                estimators and construction professionals can use RCC design
                calculators for quick engineering checks and planning.
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
            estimation, concrete volume, steel weight, brickwork, plaster,
            excavation and reinforcement calculations.
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
