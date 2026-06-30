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
  title: "Crank Bar Calculator | Bent Up Bar Cutting Length Calculator",
  description:
    "Calculate crank bar or bent up bar cutting length with crank height, crank angle, extra length, hook length, lap length and bend deduction. Includes formula, example and Hindi explanation.",
  alternates: {
    canonical: "https://www.civilcalcpro.in/crank-bar-calculator",
  },
  openGraph: {
    title: "Crank Bar Calculator for Steel Reinforcement",
    description:
      "Calculate bent up bar and crank bar cutting length with formula, example, BBS explanation and calculator link.",
    url: "https://www.civilcalcpro.in/crank-bar-calculator",
    siteName: "CivilCalc Pro",
    type: "website",
  },
};

const calculatorHref = "/login?redirect=/dashboard/calculators/crank-bar";

const formulas = [
  {
    title: "Crank Extra Length",
    formula: "Extra Length per Crank = H × (cosecθ - cotθ)",
    desc: "General crank bar formula where H is crank height and θ is crank angle.",
  },
  {
    title: "45° Crank Approximation",
    formula: "Extra Length per Crank ≈ 0.42H",
    desc: "Common practical BBS formula for 45° crank bars.",
  },
  {
    title: "Inclined Length",
    formula: "Inclined Length = H / sinθ",
    desc: "Used to calculate the inclined portion of the bent-up bar.",
  },
  {
    title: "Horizontal Projection",
    formula: "Horizontal Projection = H / tanθ",
    desc: "Used to compare inclined portion with horizontal bar projection.",
  },
  {
    title: "Crank Bar Cutting Length",
    formula:
      "Cutting Length = Straight Length + Crank Extra Length + Hook Length + Lap Length - Bend Deduction",
    desc: "Final cutting length formula for crank bars in BBS.",
  },
  {
    title: "Steel Weight",
    formula: "Steel Weight = D² / 162 × Total Length in meter",
    desc: "Used to calculate total steel weight after crank bar cutting length is known.",
  },
];

const inputs = [
  "Unit system: Metric or Imperial",
  "Bar type: Single crank, double crank, crank with hooks, crank with lap or custom crank",
  "Main straight length",
  "Crank height or auto height from slab thickness and cover",
  "Crank angle: 30°, 45°, 60° or custom angle",
  "Bar diameter",
  "Number of cranks",
  "Bend deduction method",
  "Hook length, optional",
  "Lap length, optional",
  "Number of bars",
  "Steel rate, optional",
  "Bar mark, member name and remarks, optional",
];

const outputs = [
  "Crank extra length",
  "Inclined length per crank",
  "Horizontal projection",
  "Cutting length per bar",
  "Total cutting length",
  "Hook length added",
  "Lap length added",
  "Bend deduction",
  "Steel weight",
  "Approximate steel cost",
  "Step-by-step solution",
  "Crank bar diagram",
];

const relatedTools = [
  {
    title: "Cutting Length Calculator",
    href: "/cutting-length-calculator",
  },
  {
    title: "Bend Deduction Calculator",
    href: "/bend-deduction-calculator",
  },
  {
    title: "Hook Length Calculator",
    href: "/hook-length-calculator",
  },
  {
    title: "Stirrup Length Calculator",
    href: "/stirrup-length-calculator",
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
    q: "What is a crank bar?",
    a: "A crank bar, also called a bent-up bar, is a reinforcement bar bent upward or downward to resist negative moment, shear or support zone reinforcement requirements.",
  },
  {
    q: "What is the formula for crank bar extra length?",
    a: "The general formula is Extra Length per Crank = H × (cosecθ - cotθ), where H is crank height and θ is crank angle.",
  },
  {
    q: "What is the extra length for a 45° crank?",
    a: "For a 45° crank, the common practical BBS formula is Extra Length per Crank = 0.42H.",
  },
  {
    q: "Where is crank bar used?",
    a: "Crank bars are commonly used in slabs, beams, bent-up bars, negative reinforcement zones and BBS cutting length calculations.",
  },
  {
    q: "What is crank height?",
    a: "Crank height is the vertical distance through which the bar is bent up or bent down. It can be calculated from slab thickness, clear cover and bar diameter.",
  },
  {
    q: "Is bend deduction required in crank bar?",
    a: "Yes, if the BBS method or drawing requires bend deduction, it should be subtracted from the crank bar cutting length.",
  },
  {
    q: "Can lap length be added in crank bar cutting length?",
    a: "Yes. If a crank bar has lap requirement, lap length is added to the final cutting length.",
  },
  {
    q: "Can steel weight be calculated from crank bar length?",
    a: "Yes. After total crank bar length is calculated, steel weight can be calculated using D²/162 × total length in meter.",
  },
];

export default function CrankBarSeoPage() {
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
                Crank Bar Calculator for Bent Up Bar Cutting Length
              </h1>

              <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
                Calculate crank bar or bent-up bar cutting length with crank
                height, crank angle, extra length, hook length, lap length, bend
                deduction, steel weight and cost.
              </p>

              <p className="mt-3 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
                Slab और beam में bent-up/crank bar की cutting length निकालें।
                Crank height, angle, bar diameter और number of bars डालकर
                BBS-ready result प्राप्त करें।
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={calculatorHref}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-500 px-6 py-4 text-base font-black text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600"
                >
                  Calculate Crank Bar Length
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
                    Extra Length = H × (cosecθ - cotθ)
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-orange-500/20 bg-orange-500/10 p-5">
                <p className="text-sm font-semibold text-orange-200">
                  45° Crank Example
                </p>
                <p className="mt-2 text-sm leading-7 text-slate-200">
                  Crank height = 150 mm
                </p>
                <p className="mt-2 text-2xl font-black text-orange-300">
                  Extra = 0.42 × 150 = 63 mm
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
            <Calculator className="mb-4 text-orange-400" size={30} />
            <h2 className="text-xl font-black text-white">
              What is Crank Bar?
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-400">
              A crank bar or bent-up bar is a reinforcement bar bent upward or
              downward in slab or beam reinforcement. The crank creates an
              inclined portion, so extra length is added in cutting length.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
            <ShieldCheck className="mb-4 text-orange-400" size={30} />
            <h2 className="text-xl font-black text-white">
              Hindi Explanation
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-400">
              Crank bar में reinforcement bar को ऊपर या नीचे bend किया जाता है।
              इस bend की वजह से inclined length बनती है, इसलिए final cutting
              length में extra length add होती है।
            </p>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
            <Info className="mb-4 text-orange-400" size={30} />
            <h2 className="text-xl font-black text-white">
              Where to Use?
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-400">
              Use it for slab bent-up bars, beam crank bars, negative
              reinforcement, support zone bars, BBS checking and site bar
              cutting work.
            </p>
          </div>
        </section>

        <section className="mt-8 rounded-[2rem] border border-slate-800 bg-slate-900/70 p-6 sm:p-8">
          <h2 className="text-2xl font-black text-white">
            Crank Bar Formula
          </h2>

          <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-400 sm:text-base">
            Crank bar cutting length depends on straight length, crank height,
            crank angle, number of cranks, hook length, lap length and bend
            deduction. For a 45° crank, many site BBS calculations use the
            practical extra length factor 0.42H.
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
            Example Crank Bar Calculation
          </h2>

          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            <div className="rounded-2xl border border-orange-500/20 bg-slate-950/70 p-5">
              <h3 className="font-black text-orange-200">Given Data</h3>
              <div className="mt-4 space-y-2 text-sm leading-7 text-slate-300">
                <p>Straight length = 3000 mm</p>
                <p>Crank height, H = 150 mm</p>
                <p>Crank angle = 45°</p>
                <p>Number of cranks = 2</p>
                <p>Bar diameter = 12 mm</p>
                <p>Number of bars = 10</p>
              </div>
            </div>

            <div className="rounded-2xl border border-orange-500/20 bg-slate-950/70 p-5">
              <h3 className="font-black text-orange-200">Calculation</h3>
              <div className="mt-4 space-y-2 text-sm leading-7 text-slate-300">
                <p>Extra length per crank = 0.42 × 150</p>
                <p>Extra length per crank = 63 mm</p>
                <p>Total crank extra length = 63 × 2 = 126 mm</p>
                <p>Cutting length per bar = 3000 + 126</p>
                <p className="font-black text-orange-300">
                  Cutting length per bar = 3126 mm
                </p>
                <p>Total length = 3126 × 10 = 31.26 m</p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <Link
              href={calculatorHref}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-500 px-6 py-4 font-black text-white transition hover:bg-orange-600"
            >
              Calculate Your Crank Bar Length
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
            Crank Bar in Slab and Beam BBS
          </h2>

          <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-400 sm:text-base">
            In Bar Bending Schedule, crank bars are used where reinforcement
            needs to change level, especially near supports, negative moment
            zones or bent-up bar detailing. Correct crank extra length helps
            avoid short cutting and steel wastage.
          </p>

          <div className="mt-5 grid gap-5 lg:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
              <h3 className="font-black text-white">Slab Bent-Up Bars</h3>
              <p className="mt-3 text-sm leading-7 text-slate-400">
                Slab bars may be cranked near supports or alternate positions
                depending on reinforcement detailing.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
              <h3 className="font-black text-white">Beam Crank Bars</h3>
              <p className="mt-3 text-sm leading-7 text-slate-400">
                Beam crank bars are used where bars are bent-up according to
                shear or moment requirements.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
              <h3 className="font-black text-white">BBS Checking</h3>
              <p className="mt-3 text-sm leading-7 text-slate-400">
                Crank length calculation helps verify bar mark quantity,
                cutting length, total length and steel weight in BBS.
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
            Crank Bar Calculator FAQs
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
            Start Crank Bar Calculation
          </h2>

          <p className="mx-auto mt-3 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
            Login ke baad aap direct Crank Bar Calculator page par redirect ho
            jaoge.
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
