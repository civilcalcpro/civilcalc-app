import Link from "next/link";

export const metadata = {
  title: "Reinforcement Calculators | Steel Bar BBS Lap Length | CivilCalc Pro",
  description:
    "Use reinforcement calculators for steel weight, development length, lap length, bar bending schedule, RCC reinforcement and construction steel calculations.",
  alternates: {
    canonical: "https://civilcalcpro.in/reinforcement-calculators",
  },
  openGraph: {
    title: "Reinforcement Calculators | CivilCalc Pro",
    description:
      "Free reinforcement calculators and guides for steel weight, development length, lap length, BBS and RCC steel calculations.",
    url: "https://civilcalcpro.in/reinforcement-calculators",
    siteName: "CivilCalc Pro",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Reinforcement Calculators | CivilCalc Pro",
    description:
      "Calculate steel weight, lap length, development length and bar bending schedule values using CivilCalc Pro.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const tools = [
  {
    title: "Steel Weight Calculator",
    desc: "Calculate reinforcement steel bar weight using diameter, length and standard steel weight formula.",
    href: "/steel-weight-calculator",
    action: "Open Calculator →",
  },
  {
    title: "Bar Bending Schedule Generator",
    desc: "Create professional BBS reports with bar mark, diameter, cutting length, quantity, steel weight and reinforcement schedule.",
    href: "/login?redirect=/dashboard/calculators/bbs-generator",
    action: "Open BBS Generator →",
  },
  {
    title: "Steel Weight Calculation Formula",
    desc: "Learn the steel weight formula D²/162 and how to calculate bar weight for RCC work.",
    href: "/steel-weight-calculation-formula",
    action: "Read Guide →",
  },
  {
    title: "Development Length Guide",
    desc: "Understand development length formula, anchorage length and RCC reinforcement bond requirements.",
    href: "/development-length-calculation",
    action: "Read Guide →",
  },
  {
    title: "Lap Length Guide",
    desc: "Learn lap length requirements for reinforcement bars in beams, columns, slabs and RCC members.",
    href: "/lap-length-calculation",
    action: "Read Guide →",
  },
  {
    title: "RCC Beam Design Calculator",
    desc: "Calculate RCC beam design values including bending moment, shear force and reinforcement steel.",
    href: "/beam-design",
    action: "Open Calculator →",
  },
];

export default function ReinforcementCalculatorsPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-16">
      <div className="max-w-6xl mx-auto">
        <p className="text-orange-400 font-semibold mb-3">
          REINFORCEMENT CALCULATORS
        </p>

        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          Reinforcement Calculators for Steel, BBS, Lap Length and Development Length
        </h1>

        <p className="text-slate-300 text-lg md:text-xl leading-8 max-w-4xl mb-10">
          CivilCalc Pro provides reinforcement calculators and guides for civil
          engineers, site engineers, contractors and students. Calculate steel
          weight, understand development length, lap length, bar bending
          schedule, RCC reinforcement and construction steel requirements.
        </p>

        <div className="flex flex-wrap gap-4 mb-14">
          <Link
            href="/steel-weight-calculator"
            className="bg-orange-500 hover:bg-orange-600 transition px-6 py-3 rounded-xl font-semibold"
          >
            Start Steel Weight Calculation
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
  {tool.action}
</p>
            </Link>
          ))}
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-8 mb-10">
          <h2 className="text-3xl font-bold mb-5">
            What is Reinforcement in RCC Construction?
          </h2>

          <p className="text-slate-300 leading-8 mb-4">
            Reinforcement means steel bars provided inside concrete to resist
            tension, bending, shear and other structural forces. In RCC
            construction, concrete carries compression and steel reinforcement
            carries tension.
          </p>

          <p className="text-slate-300 leading-8">
            Reinforcement calculations are important for beams, columns, slabs,
            footings, staircases and other RCC members. Correct steel quantity,
            bar length, lap length, development length and spacing help improve
            structural safety and reduce material wastage.
          </p>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-8 mb-10">
          <h2 className="text-3xl font-bold mb-5">
            Common Reinforcement Calculations
          </h2>

          <ul className="list-disc pl-6 space-y-3 text-slate-300 leading-8">
            <li>Steel bar weight calculation using diameter and length</li>
            <li>Development length calculation for reinforcement anchorage</li>
            <li>Lap length calculation for RCC bars</li>
            <li>Bar bending schedule preparation for beams, slabs and columns</li>
            <li>Cutting length calculation for reinforcement bars</li>
            <li>Reinforcement quantity estimation for RCC members</li>
            <li>Steel wastage and bar scheduling for construction planning</li>
          </ul>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-8 mb-10">
          <h2 className="text-3xl font-bold mb-5">
            Why Use CivilCalc Pro for Reinforcement Calculations?
          </h2>

          <p className="text-slate-300 leading-8">
            CivilCalc Pro helps engineers and construction professionals perform
            common reinforcement-related calculations quickly. These tools are
            useful for steel quantity estimation, RCC detailing, BOQ preparation,
            project planning, site checking and learning reinforcement concepts.
            Final structural reinforcement design should always be verified by a
            qualified civil or structural engineer.
          </p>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-8 mb-10">
          <h2 className="text-3xl font-bold mb-6">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">
                Which reinforcement calculators are available?
              </h3>
              <p className="text-slate-300 leading-7">
                CivilCalc Pro includes steel weight calculator, development
                length guide, lap length guide, steel weight formula page and bar
                bending schedule guide.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">
                What is the formula for steel weight?
              </h3>
              <p className="text-slate-300 leading-7">
                The common formula for steel bar weight is D²/162 kg per meter,
                where D is the bar diameter in millimeters.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">
                Why are lap length and development length important?
              </h3>
              <p className="text-slate-300 leading-7">
                Lap length is used when two reinforcement bars are joined, and
                development length is required to safely transfer stress between
                steel and concrete through bond.
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
            quantity estimation, concrete volume, steel weight, brickwork,
            plaster, excavation and reinforcement calculations.
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
