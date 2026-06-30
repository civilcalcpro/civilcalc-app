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
  title: "Hook Length Calculator for Steel Reinforcement | CivilCalc Pro",
  description:
    "Calculate hook length for reinforcement bars, stirrups, bend anchorage and BBS cutting length. Includes formulas, examples, Hindi explanation and calculator link.",
  alternates: {
    canonical: "https://www.civilcalcpro.in/hook-length-calculator",
  },
  openGraph: {
    title: "Hook Length Calculator for Steel Reinforcement",
    description:
      "Free hook length calculator for steel bars with formula, example and practical site use.",
    url: "https://www.civilcalcpro.in/hook-length-calculator",
    siteName: "CivilCalc Pro",
    type: "website",
  },
};

const calculatorHref = "/login?redirect=/dashboard/calculators/hook-length";

const formulas = [
  {
    title: "Standard Hook / U Hook",
    formula: "Hook Length = 16d",
    desc: "Used for standard 180° hook or U hook in reinforcement detailing.",
  },
  {
    title: "90° Hook",
    formula: "Hook Length = 8d",
    desc: "Used where 90° hook anchorage is required.",
  },
  {
    title: "135° Stirrup Hook",
    formula: "Hook Length = 6d",
    desc: "Commonly used in stirrups and ties, especially for ductile detailing.",
  },
  {
    title: "Custom Hook",
    formula: "Hook Length = Custom Multiplier × d",
    desc: "Use this when drawing or consultant note gives a project-specific value.",
  },
];

const inputs = [
  "Unit system: Metric or Imperial",
  "Calculation type: Standard hook, bend anchorage, stirrup hook or custom hook",
  "Hook type: 90°, 135°, 180° or custom multiplier",
  "Bar diameter",
  "Hooks per bar",
  "Number of bars",
  "Steel rate, optional",
  "Bar mark and member name, optional",
];

const outputs = [
  "Hook length per hook",
  "Hook length per bar",
  "Total hook length",
  "Extra steel weight",
  "Approximate steel cost",
  "Formula used",
  "Step-by-step solution",
  "Hook diagram",
];

const relatedTools = [
  {
    title: "Steel Weight Calculator",
    href: "/steel-weight-calculator",
  },
  {
    title: "Lap Length Calculator",
    href: "/lap-length-calculator",
  },
  {
    title: "Development Length Calculator",
    href: "/development-length-calculator",
  },
  {
    title: "Stirrup Length Calculator",
    href: "/stirrup-length-calculator",
  },
  {
    title: "Bend Deduction Calculator",
    href: "/bend-deduction-calculator",
  },
  {
    title: "Cutting Length Calculator",
    href: "/cutting-length-calculator",
  },
];

const faqs = [
  {
    q: "What is hook length in reinforcement?",
    a: "Hook length is the extra length provided at the end of a reinforcement bar to improve anchorage and holding inside concrete.",
  },
  {
    q: "What is the formula for hook length?",
    a: "A commonly used formula is Hook Length = Multiplier × Bar Diameter. For example, 180° hook is often taken as 16d.",
  },
  {
    q: "What does d mean in hook length formula?",
    a: "In hook length formulas, d means the diameter of the reinforcement bar.",
  },
  {
    q: "Where is hook length used?",
    a: "Hook length is used in beam bars, slab bars, stirrups, column ties, footing reinforcement and BBS cutting length.",
  },
  {
    q: "Can I calculate hook length for stirrups?",
    a: "Yes. The calculator supports stirrup hook options such as 90°, 135° and 180° hooks.",
  },
  {
    q: "Is hook length added in cutting length?",
    a: "Yes. Hook length is added to the basic bar length while calculating final cutting length.",
  },
];

export default function HookLengthSeoPage() {
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
                Steel Reinforcement Calculator
              </div>

              <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
                Hook Length Calculator for Steel Reinforcement
              </h1>

              <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
                Calculate hook length for reinforcement bars, stirrups, bend
                anchorage and BBS cutting length using bar diameter, hook type
                and number of bars.
              </p>

              <p className="mt-3 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
                Bar diameter और hook type के हिसाब से reinforcement की hook
                length निकालें। यह tool beam, slab, column, stirrup और BBS work
                में useful है।
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={calculatorHref}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-500 px-6 py-4 text-base font-black text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600"
                >
                  Calculate Hook Length
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
                    Hook Length = Multiplier × d
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-orange-500/20 bg-orange-500/10 p-5">
                <p className="text-sm font-semibold text-orange-200">
                  Example
                </p>
                <p className="mt-2 text-sm leading-7 text-slate-200">
                  For 12 mm bar and 180° hook:
                </p>
                <p className="mt-2 text-2xl font-black text-orange-300">
                  16 × 12 = 192 mm
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
            <Calculator className="mb-4 text-orange-400" size={30} />
            <h2 className="text-xl font-black text-white">
              What is Hook Length?
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-400">
              Hook length is the additional length provided at the end of a
              reinforcement bar to improve anchorage inside concrete. It is
              commonly shown in BBS and reinforcement detailing drawings.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
            <ShieldCheck className="mb-4 text-orange-400" size={30} />
            <h2 className="text-xl font-black text-white">
              Hindi Explanation
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-400">
              Hook length bar के end पर दी जाने वाली extra length होती है,
              जिससे bar concrete में अच्छे से anchor हो सके। इसे BBS cutting
              length में add किया जाता है।
            </p>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
            <Info className="mb-4 text-orange-400" size={30} />
            <h2 className="text-xl font-black text-white">
              Where to Use?
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-400">
              Use it for beam bars, slab bars, footing bars, column ties,
              stirrups, anchorage detailing and bar bending schedule checking.
            </p>
          </div>
        </section>

        <section className="mt-8 rounded-[2rem] border border-slate-800 bg-slate-900/70 p-6 sm:p-8">
          <h2 className="text-2xl font-black text-white">
            Hook Length Formula
          </h2>

          <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-400 sm:text-base">
            Hook length is generally calculated as a multiple of bar diameter.
            The multiplier depends on hook angle, reinforcement detailing
            requirement and project specification.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {formulas.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5"
              >
                <h3 className="font-black text-white">{item.title}</h3>
                <p className="mt-2 text-2xl font-black text-orange-300">
                  {item.formula}
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-400">
                  {item.desc}
                </p>
              </div>
            ))}
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

        <section className="mt-8 rounded-[2rem] border border-orange-500/20 bg-orange-500/10 p-6 sm:p-8">
          <h2 className="text-2xl font-black text-white">
            Example Hook Length Calculation
          </h2>

          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            <div className="rounded-2xl border border-orange-500/20 bg-slate-950/70 p-5">
              <h3 className="font-black text-orange-200">Given Data</h3>
              <div className="mt-4 space-y-2 text-sm leading-7 text-slate-300">
                <p>Bar diameter, d = 12 mm</p>
                <p>Hook type = 180° standard hook</p>
                <p>Hook multiplier = 16d</p>
                <p>Number of hooks = 2</p>
              </div>
            </div>

            <div className="rounded-2xl border border-orange-500/20 bg-slate-950/70 p-5">
              <h3 className="font-black text-orange-200">Calculation</h3>
              <div className="mt-4 space-y-2 text-sm leading-7 text-slate-300">
                <p>Hook length per hook = 16 × 12</p>
                <p>Hook length per hook = 192 mm</p>
                <p>Total hook length = 192 × 2</p>
                <p className="font-black text-orange-300">
                  Total hook length = 384 mm
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <Link
              href={calculatorHref}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-500 px-6 py-4 font-black text-white transition hover:bg-orange-600"
            >
              Calculate Your Hook Length
              <ArrowRight size={20} />
            </Link>
          </div>
        </section>

        <section className="mt-8 rounded-[2rem] border border-slate-800 bg-slate-900/70 p-6 sm:p-8">
          <h2 className="text-2xl font-black text-white">
            Related Steel Calculators
          </h2>

          <p className="mt-2 text-sm leading-7 text-slate-400">
            Use these related reinforcement calculators for BBS checking and
            site steel calculation.
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
            Hook Length Calculator FAQs
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
            Start Hook Length Calculation
          </h2>

          <p className="mx-auto mt-3 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
            Login ke baad aap direct Hook Length Calculator page par redirect
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
