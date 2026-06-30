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
  title: "Cutting Length Calculator | Steel Bar BBS Cutting Length",
  description:
    "Calculate cutting length of steel reinforcement bars with hook length, lap length, development length and bend deduction. Includes formula, example, Hindi explanation and calculator link.",
  alternates: {
    canonical: "https://www.civilcalcpro.in/cutting-length-calculator",
  },
  openGraph: {
    title: "Cutting Length Calculator for Steel Reinforcement",
    description:
      "Calculate reinforcement cutting length for straight bars, hook bars, L bars, U bars, lap bars and development bars.",
    url: "https://www.civilcalcpro.in/cutting-length-calculator",
    siteName: "CivilCalc Pro",
    type: "website",
  },
};

const calculatorHref = "/login?redirect=/dashboard/calculators/cutting-length";

const formulas = [
  {
    title: "Basic Cutting Length",
    formula:
      "Cutting Length = Straight Length + Hook Length + Lap Length + Development Length - Bend Deduction",
    desc: "This is the general formula used for steel reinforcement cutting length in BBS.",
  },
  {
    title: "Total Cutting Length",
    formula: "Total Cutting Length = Cutting Length per Bar × Number of Bars",
    desc: "Used to calculate total bar length required for all bars of the same mark.",
  },
  {
    title: "Steel Weight",
    formula: "Steel Weight = D² / 162 × Total Length in meter",
    desc: "Used to convert total cutting length into steel weight in kg.",
  },
  {
    title: "Hook Length Addition",
    formula: "Hook Length = Hook Multiplier × Bar Diameter × Number of Hooks",
    desc: "Used when hooks are provided at one or both ends of the reinforcement bar.",
  },
  {
    title: "Lap Length Addition",
    formula: "Lap Length = Lap Multiplier × Bar Diameter × Number of Laps",
    desc: "Used when two reinforcement bars are joined by overlapping.",
  },
  {
    title: "Bend Deduction",
    formula: "Bend Deduction = Bend Multiplier × Bar Diameter × Number of Bends",
    desc: "Used when bar cutting length includes bends such as 45°, 90°, 135° or 180°.",
  },
];

const inputs = [
  "Unit system: Metric or Imperial",
  "Bar type: Straight bar, hook bar, L bar, U bar, lap bar, development bar or custom BBS bar",
  "Straight length or base bar length",
  "Bar diameter",
  "Hook type and number of hooks, optional",
  "Bend deduction type and number of bends, optional",
  "Lap length type and number of laps, optional",
  "Development length type and side count, optional",
  "Number of bars",
  "Steel rate, optional",
  "Bar mark, member name and remarks, optional",
];

const outputs = [
  "Cutting length per bar",
  "Total cutting length",
  "Hook length added",
  "Lap length added",
  "Development length added",
  "Bend deduction",
  "Total steel weight",
  "Approximate steel cost",
  "Step-by-step solution",
  "Dynamic bar diagram",
];

const relatedTools = [
  {
    title: "Hook Length Calculator",
    href: "/hook-length-calculator",
  },
  {
    title: "Bend Deduction Calculator",
    href: "/bend-deduction-calculator",
  },
  {
    title: "Stirrup Length Calculator",
    href: "/stirrup-length-calculator",
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
    q: "What is cutting length of steel bar?",
    a: "Cutting length is the actual length of reinforcement bar required to be cut before bending and placing it at site.",
  },
  {
    q: "What is the formula for cutting length?",
    a: "A general formula is Cutting Length = Straight Length + Hook Length + Lap Length + Development Length - Bend Deduction.",
  },
  {
    q: "Why is hook length added in cutting length?",
    a: "Hook length is added because hooks require extra bar length at the end of reinforcement for anchorage.",
  },
  {
    q: "Why is bend deduction subtracted in cutting length?",
    a: "Bend deduction is subtracted because bending changes the effective length of the steel bar and helps calculate practical cutting length.",
  },
  {
    q: "Is lap length included in cutting length?",
    a: "Yes. If a reinforcement bar needs to be joined with another bar, lap length is added in cutting length calculation.",
  },
  {
    q: "Is development length included in cutting length?",
    a: "Yes. Development length is added when the bar needs anchorage inside support, beam, column, slab or footing zone.",
  },
  {
    q: "Where is cutting length used?",
    a: "Cutting length is used in BBS preparation, beam reinforcement, slab bars, column bars, footing bars, stirrups and crank bars.",
  },
  {
    q: "Can I calculate steel weight from cutting length?",
    a: "Yes. After cutting length is calculated, steel weight can be calculated using D²/162 × total length in meter.",
  },
];

export default function CuttingLengthSeoPage() {
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
                Cutting Length Calculator for Steel Reinforcement
              </h1>

              <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
                Calculate steel bar cutting length for straight bars, hook bars,
                L bars, U bars, lap bars, development bars and custom BBS bars
                with hook length, bend deduction, lap length and steel weight.
              </p>

              <p className="mt-3 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
                Reinforcement bar की actual cutting length निकालें। Straight
                length, hook length, lap length, development length और bend
                deduction के साथ BBS-ready output पाएं।
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={calculatorHref}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-500 px-6 py-4 text-base font-black text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600"
                >
                  Calculate Cutting Length
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
                    CL = L + Hook + Lap + Ld - BD
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-orange-500/20 bg-orange-500/10 p-5">
                <p className="text-sm font-semibold text-orange-200">
                  Example
                </p>
                <p className="mt-2 text-sm leading-7 text-slate-200">
                  Straight length 3000 mm, hook 384 mm, bend deduction 48 mm:
                </p>
                <p className="mt-2 text-2xl font-black text-orange-300">
                  CL = 3336 mm
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
            <Calculator className="mb-4 text-orange-400" size={30} />
            <h2 className="text-xl font-black text-white">
              What is Cutting Length?
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-400">
              Cutting length is the actual length of reinforcement bar that
              needs to be cut before bending, placing and fixing at site. It is
              one of the most important calculations in BBS preparation.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
            <ShieldCheck className="mb-4 text-orange-400" size={30} />
            <h2 className="text-xl font-black text-white">
              Hindi Explanation
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-400">
              Cutting length steel bar की actual काटने वाली length होती है।
              इसमें straight length के साथ hook, lap और development length add
              होती है और bend deduction minus होता है।
            </p>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
            <Info className="mb-4 text-orange-400" size={30} />
            <h2 className="text-xl font-black text-white">
              Where to Use?
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-400">
              Use it for beam bars, slab bars, footing bars, column bars,
              stirrups, crank bars, L bars, U bars and bar bending schedule
              checking.
            </p>
          </div>
        </section>

        <section className="mt-8 rounded-[2rem] border border-slate-800 bg-slate-900/70 p-6 sm:p-8">
          <h2 className="text-2xl font-black text-white">
            Cutting Length Formula
          </h2>

          <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-400 sm:text-base">
            The cutting length of reinforcement depends on the bar type and
            detailing requirement. For a general BBS bar, hook length, lap
            length and development length are added, while bend deduction is
            subtracted from the final length.
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
            Example Cutting Length Calculation
          </h2>

          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            <div className="rounded-2xl border border-orange-500/20 bg-slate-950/70 p-5">
              <h3 className="font-black text-orange-200">Given Data</h3>
              <div className="mt-4 space-y-2 text-sm leading-7 text-slate-300">
                <p>Straight length = 3000 mm</p>
                <p>Bar diameter, d = 12 mm</p>
                <p>Hook type = 180° hook = 16d</p>
                <p>Number of hooks = 2</p>
                <p>Bend deduction = 90° bend = 2d</p>
                <p>Number of bends = 2</p>
                <p>Number of bars = 10</p>
              </div>
            </div>

            <div className="rounded-2xl border border-orange-500/20 bg-slate-950/70 p-5">
              <h3 className="font-black text-orange-200">Calculation</h3>
              <div className="mt-4 space-y-2 text-sm leading-7 text-slate-300">
                <p>Hook length = 16 × 12 × 2 = 384 mm</p>
                <p>Bend deduction = 2 × 12 × 2 = 48 mm</p>
                <p>Cutting length per bar = 3000 + 384 - 48</p>
                <p className="font-black text-orange-300">
                  Cutting length per bar = 3336 mm
                </p>
                <p>Total cutting length = 3336 × 10</p>
                <p className="font-black text-orange-300">
                  Total cutting length = 33360 mm = 33.36 m
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <Link
              href={calculatorHref}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-500 px-6 py-4 font-black text-white transition hover:bg-orange-600"
            >
              Calculate Your Cutting Length
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
            Cutting Length in Bar Bending Schedule
          </h2>

          <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-400 sm:text-base">
            In a Bar Bending Schedule, every reinforcement bar is listed with
            bar mark, diameter, shape, number of bars, cutting length, total
            length and steel weight. Correct cutting length helps reduce steel
            wastage, improves site execution and makes billing more accurate.
          </p>

          <div className="mt-5 grid gap-5 lg:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
              <h3 className="font-black text-white">Beam Bars</h3>
              <p className="mt-3 text-sm leading-7 text-slate-400">
                Beam reinforcement often includes straight bars, top bars,
                bottom bars, extra bars, hooks and anchorage lengths.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
              <h3 className="font-black text-white">Slab Bars</h3>
              <p className="mt-3 text-sm leading-7 text-slate-400">
                Slab bars may include straight distribution bars, main bars,
                crank bars, extra top bars and lap length requirements.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
              <h3 className="font-black text-white">Footing Bars</h3>
              <p className="mt-3 text-sm leading-7 text-slate-400">
                Footing reinforcement cutting length may include straight
                length, bend, hook and development length depending on drawing.
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
            Cutting Length Calculator FAQs
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
            Start Cutting Length Calculation
          </h2>

          <p className="mx-auto mt-3 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
            Login ke baad aap direct Cutting Length Calculator page par redirect
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
