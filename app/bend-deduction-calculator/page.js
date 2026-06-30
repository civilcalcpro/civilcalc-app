import Link from "next/link";
import {
  ArrowRight,
  Calculator,
  CheckCircle2,
  HelpCircle,
  Info,
  Ruler,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export const metadata = {
  title: "Bend Deduction Calculator | Steel Bar BBS Bend Deduction",
  description:
    "Calculate bend deduction for steel reinforcement bars for 45°, 90°, 135°, 180° and custom bends. Includes BBS formula, example, Hindi explanation and calculator link.",
  alternates: {
    canonical: "https://www.civilcalcpro.in/bend-deduction-calculator",
  },
  openGraph: {
    title: "Bend Deduction Calculator for Steel Reinforcement",
    description:
      "Calculate reinforcement bend deduction with formula, example, BBS explanation and practical site guidance.",
    url: "https://www.civilcalcpro.in/bend-deduction-calculator",
    siteName: "CivilCalc Pro",
    type: "website",
  },
};

const calculatorHref = "/login?redirect=/dashboard/calculators/bend-deduction";

const formulas = [
  {
    title: "45° Bend Deduction",
    formula: "Bend Deduction = 1d",
    desc: "Commonly used deduction for 45° reinforcement bend in BBS calculations.",
  },
  {
    title: "90° Bend Deduction",
    formula: "Bend Deduction = 2d",
    desc: "Commonly used for L bars, crank bars, stirrups and 90° bent reinforcement.",
  },
  {
    title: "135° Bend Deduction",
    formula: "Bend Deduction = 3d",
    desc: "Useful for stirrup hooks, ties and ductile detailing cases.",
  },
  {
    title: "180° Bend Deduction",
    formula: "Bend Deduction = 4d",
    desc: "Used for U hooks, 180° bends and bar anchorage detailing.",
  },
  {
    title: "Total Bend Deduction",
    formula: "Total Deduction = Deduction per Bend × Number of Bends",
    desc: "Used when a bar has multiple bends in BBS cutting length calculation.",
  },
  {
    title: "Custom Bend Deduction",
    formula: "Total Deduction = Custom Multiplier × d × Number of Bends",
    desc: "Use this when drawing, site practice or consultant note gives custom deduction.",
  },
];

const inputs = [
  "Unit system: Metric or Imperial",
  "Bar diameter",
  "Bend angle: 45°, 90°, 135°, 180° or custom angle",
  "Number of bends",
  "Deduction method: Standard BBS, angle based, custom or no deduction",
  "Custom multiplier, if required",
  "Steel rate, optional",
  "Bar mark and member name, optional",
];

const outputs = [
  "Deduction per bend",
  "Total bend deduction",
  "Selected bend formula",
  "Number of bends",
  "Steel weight equivalent",
  "Cost equivalent",
  "Step-by-step solution",
  "Dynamic bend diagram",
];

const relatedTools = [
  {
    title: "Hook Length Calculator",
    href: "/hook-length-calculator",
  },
  {
    title: "Stirrup Length Calculator",
    href: "/stirrup-length-calculator",
  },
  {
    title: "Cutting Length Calculator",
    href: "/cutting-length-calculator",
  },
  {
    title: "Crank Bar Calculator",
    href: "/crank-bar-calculator",
  },
  {
    title: "Steel Weight Calculator",
    href: "/steel-weight-calculator",
  },
  {
    title: "Steel Cost Summary Calculator",
    href: "/steel-cost-summary-calculator",
  },
];

const faqs = [
  {
    q: "What is bend deduction in reinforcement?",
    a: "Bend deduction is the length deducted from reinforcement cutting length because bending a steel bar changes its effective length.",
  },
  {
    q: "Why is bend deduction required in BBS?",
    a: "Bend deduction is required in Bar Bending Schedule to calculate practical cutting length of reinforcement bars after considering bends.",
  },
  {
    q: "What is the bend deduction for 90° bend?",
    a: "A commonly used BBS deduction for a 90° bend is 2d, where d is the diameter of the bar.",
  },
  {
    q: "What is the bend deduction for 45° bend?",
    a: "A commonly used bend deduction for a 45° bend is 1d.",
  },
  {
    q: "What is the bend deduction for 135° bend?",
    a: "A commonly used bend deduction for a 135° bend is 3d.",
  },
  {
    q: "What does d mean in bend deduction formula?",
    a: "In bend deduction formulas, d means the diameter of the reinforcement bar.",
  },
  {
    q: "Where is bend deduction used?",
    a: "Bend deduction is used in stirrups, crank bars, L bars, U bars, hooks, beam bars, column ties and BBS cutting length calculations.",
  },
  {
    q: "Is bend deduction always required?",
    a: "Bend deduction is required when cutting length is calculated from external dimensions or centerline assumptions. If drawing already gives adjusted cutting length, deduction may not be required.",
  },
];

export default function BendDeductionSeoPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <main className="min-h-screen bg-[#050B1F] px-4 py-6 text-white sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="mx-auto max-w-7xl">
        <section className="relative overflow-hidden rounded-[2rem] border border-orange-500/20 bg-gradient-to-br from-slate-950 via-slate-900 to-[#07112c] p-6 shadow-2xl shadow-black/30 sm:p-8 lg:p-10">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-orange-500/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative z-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-sm font-semibold text-orange-300">
                <Sparkles size={16} />
                Steel BBS Calculator
              </div>

              <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
                Bend Deduction Calculator for Steel Reinforcement
              </h1>

              <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
                Calculate bend deduction for reinforcement bars for 45°, 90°,
                135°, 180° and custom bends. Use it for BBS, stirrup length,
                crank bar length and cutting length calculations.
              </p>

              <p className="mt-3 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
                Bar diameter, bend angle और number of bends डालकर bend
                deduction निकालें। यह tool BBS cutting length, stirrup, crank
                bar और bent reinforcement के लिए useful है।
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={calculatorHref}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-500 px-6 py-4 text-base font-black text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600"
                >
                  Calculate Bend Deduction
                  <ArrowRight size={20} />
                </Link>

                <Link
                  href="/steel-calculators"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-950/60 px-6 py-4 text-base font-bold text-slate-200 transition hover:border-orange-400 hover:text-orange-300"
                >
                  View Steel Calculators
                </Link>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-400 ring-1 ring-orange-500/20">
                  <Ruler size={30} />
                </div>

                <div>
                  <h2 className="text-xl font-black text-white">
                    Formula Preview
                  </h2>
                  <p className="text-sm text-slate-400">
                    Total Deduction = Multiplier × d × Bends
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-orange-500/20 bg-orange-500/10 p-5">
                <p className="text-sm font-semibold text-orange-200">
                  Example
                </p>
                <p className="mt-2 text-sm leading-7 text-slate-200">
                  For 12 mm bar, 90° bend and 4 bends:
                </p>
                <p className="mt-2 text-2xl font-black text-orange-300">
                  2 × 12 × 4 = 96 mm
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
            <Calculator className="mb-4 text-orange-400" size={30} />
            <h2 className="text-xl font-black text-white">
              What is Bend Deduction?
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-400">
              Bend deduction is the length adjustment applied while calculating
              the cutting length of bent reinforcement bars. It helps prepare a
              practical and accurate Bar Bending Schedule.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
            <ShieldCheck className="mb-4 text-orange-400" size={30} />
            <h2 className="text-xl font-black text-white">
              Hindi Explanation
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-400">
              Bend deduction steel bar के bend होने पर cutting length में किया
              जाने वाला adjustment है। BBS में सही cutting length निकालने के
              लिए bend deduction minus किया जाता है।
            </p>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
            <Info className="mb-4 text-orange-400" size={30} />
            <h2 className="text-xl font-black text-white">
              Where to Use?
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-400">
              Use it in stirrups, column ties, beam bars, crank bars, L bars, U
              bars, hooks and all BBS cutting length calculations involving
              bends.
            </p>
          </div>
        </section>

        <section className="mt-8 rounded-[2rem] border border-slate-800 bg-slate-900/70 p-6 sm:p-8">
          <h2 className="text-2xl font-black text-white">
            Bend Deduction Formula
          </h2>

          <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-400 sm:text-base">
            Bend deduction is commonly calculated as a multiple of bar diameter.
            The multiplier depends on bend angle and project-specific BBS
            practice. In practical site calculations, 45°, 90°, 135° and 180°
            bends are usually handled with standard multipliers.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {formulas.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5"
              >
                <h3 className="font-black text-white">{item.title}</h3>
                <p className="mt-2 text-xl font-black text-orange-300">
                  {item.formula}
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-400">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-[2rem] border border-orange-500/20 bg-orange-500/10 p-6 sm:p-8">
          <h2 className="text-2xl font-black text-white">
            Example Bend Deduction Calculation
          </h2>

          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            <div className="rounded-2xl border border-orange-500/20 bg-slate-950/70 p-5">
              <h3 className="font-black text-orange-200">Given Data</h3>
              <div className="mt-4 space-y-2 text-sm leading-7 text-slate-300">
                <p>Bar diameter, d = 12 mm</p>
                <p>Bend angle = 90°</p>
                <p>Deduction for 90° bend = 2d</p>
                <p>Number of bends = 4</p>
              </div>
            </div>

            <div className="rounded-2xl border border-orange-500/20 bg-slate-950/70 p-5">
              <h3 className="font-black text-orange-200">Calculation</h3>
              <div className="mt-4 space-y-2 text-sm leading-7 text-slate-300">
                <p>Deduction per bend = 2 × 12</p>
                <p>Deduction per bend = 24 mm</p>
                <p>Total deduction = 24 × 4</p>
                <p className="font-black text-orange-300">
                  Total Bend Deduction = 96 mm
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <Link
              href={calculatorHref}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-500 px-6 py-4 font-black text-white transition hover:bg-orange-600"
            >
              Calculate Your Bend Deduction
              <ArrowRight size={20} />
            </Link>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-slate-800 bg-slate-900/70 p-6 sm:p-8">
            <h2 className="text-2xl font-black text-white">
              Inputs Required
            </h2>

            <div className="mt-5 space-y-3">
              {inputs.map((item) => (
                <div key={item} className="flex gap-3 text-sm text-slate-300">
                  <CheckCircle2
                    size={18}
                    className="mt-0.5 shrink-0 text-orange-400"
                  />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-800 bg-slate-900/70 p-6 sm:p-8">
            <h2 className="text-2xl font-black text-white">
              Output You Get
            </h2>

            <div className="mt-5 space-y-3">
              {outputs.map((item) => (
                <div key={item} className="flex gap-3 text-sm text-slate-300">
                  <CheckCircle2
                    size={18}
                    className="mt-0.5 shrink-0 text-orange-400"
                  />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-[2rem] border border-slate-800 bg-slate-900/70 p-6 sm:p-8">
          <h2 className="text-2xl font-black text-white">
            Bend Deduction in BBS Cutting Length
          </h2>

          <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-400 sm:text-base">
            In Bar Bending Schedule, cutting length is calculated by adding
            required straight lengths, hook lengths, lap lengths and development
            lengths, then subtracting bend deductions. This prevents over-cutting
            and helps maintain consistent reinforcement quantity.
          </p>

          <div className="mt-5 grid gap-5 lg:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
              <h3 className="font-black text-white">Stirrups</h3>
              <p className="mt-3 text-sm leading-7 text-slate-400">
                Stirrups have multiple bends, so bend deduction is important for
                practical cutting length and steel wastage control.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
              <h3 className="font-black text-white">Crank Bars</h3>
              <p className="mt-3 text-sm leading-7 text-slate-400">
                Crank bars or bent-up bars include inclined parts and bends, so
                bend deduction helps refine final cutting length.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
              <h3 className="font-black text-white">L Bars and U Bars</h3>
              <p className="mt-3 text-sm leading-7 text-slate-400">
                L bars and U bars are common in beams, footings and anchorage
                detailing where bend deduction is required.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-[2rem] border border-slate-800 bg-slate-900/70 p-6 sm:p-8">
          <h2 className="text-2xl font-black text-white">
            Related Steel Calculators
          </h2>

          <p className="mt-2 text-sm leading-7 text-slate-400">
            Use these related tools for complete steel reinforcement and BBS
            calculation workflow.
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {relatedTools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="group flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-sm font-bold text-slate-200 transition hover:border-orange-400 hover:text-orange-300"
              >
                <span>{tool.title}</span>
                <ArrowRight
                  size={18}
                  className="transition group-hover:translate-x-1"
                />
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-[2rem] border border-slate-800 bg-slate-900/70 p-6 sm:p-8">
          <h2 className="text-2xl font-black text-white">
            Bend Deduction Calculator FAQs
          </h2>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {faqs.map((item) => (
              <div
                key={item.q}
                className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5"
              >
                <div className="mb-3 flex items-start gap-3">
                  <HelpCircle
                    size={20}
                    className="mt-0.5 shrink-0 text-orange-400"
                  />
                  <h3 className="font-black text-white">{item.q}</h3>
                </div>
                <p className="text-sm leading-7 text-slate-400">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-[2rem] border border-orange-500/20 bg-gradient-to-br from-orange-500/15 to-slate-900 p-6 text-center sm:p-8">
          <h2 className="text-2xl font-black text-white">
            Start Bend Deduction Calculation
          </h2>

          <p className="mx-auto mt-3 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
            Login ke baad aap direct Bend Deduction Calculator page par redirect
            ho jaoge.
          </p>

          <Link
            href={calculatorHref}
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-500 px-7 py-4 font-black text-white transition hover:bg-orange-600"
          >
            Calculate Now
            <ArrowRight size={20} />
          </Link>
        </section>
      </div>
    </main>
  );
}
