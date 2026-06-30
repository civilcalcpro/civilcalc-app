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
  title: "Stirrup Length Calculator | Beam & Column Stirrup Cutting Length",
  description:
    "Calculate stirrup cutting length for beam and column reinforcement with hooks, bends, clear cover, formula, example, Hindi explanation and calculator link.",
  alternates: {
    canonical: "https://www.civilcalcpro.in/stirrup-length-calculator",
  },
  openGraph: {
    title: "Stirrup Length Calculator for Beam and Column Reinforcement",
    description:
      "Calculate rectangular, square, circular and diamond stirrup cutting length with formulas and examples.",
    url: "https://www.civilcalcpro.in/stirrup-length-calculator",
    siteName: "CivilCalc Pro",
    type: "website",
  },
};

const calculatorHref = "/login?redirect=/dashboard/calculators/stirrup-length";

const formulas = [
  {
    title: "Rectangular Stirrup",
    formula: "Cutting Length = 2(A + B) + Hook Length - Bend Deduction",
    desc: "Used for most beam stirrups and rectangular column ties.",
  },
  {
    title: "Square Stirrup",
    formula: "Cutting Length = 4A + Hook Length - Bend Deduction",
    desc: "Used for square column ties and square reinforcement cages.",
  },
  {
    title: "Circular Stirrup",
    formula: "Cutting Length = πD + Hook Length",
    desc: "Used for circular columns, piles and circular reinforcement cages.",
  },
  {
    title: "Effective Size",
    formula: "A = Width - 2 × Clear Cover, B = Depth - 2 × Clear Cover",
    desc: "Effective stirrup dimensions are calculated after deducting clear cover from both sides.",
  },
];

const inputs = [
  "Unit system: Metric or Imperial",
  "Stirrup shape: Rectangular, square, circular, diamond or custom",
  "Beam or column width",
  "Beam or column depth",
  "Clear cover",
  "Stirrup bar diameter",
  "Hook type: 90°, 135°, 180° or seismic hook",
  "Number of stirrups or spacing-based quantity",
  "Steel rate, optional",
  "Bar mark and member name, optional",
];

const outputs = [
  "Cutting length of one stirrup",
  "Total cutting length",
  "Hook length added",
  "Bend deduction",
  "Number of stirrups",
  "Total steel weight",
  "Approximate steel cost",
  "Step-by-step solution",
  "Dynamic stirrup diagram",
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
    title: "Cutting Length Calculator",
    href: "/cutting-length-calculator",
  },
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
];

const faqs = [
  {
    q: "What is stirrup length?",
    a: "Stirrup length is the cutting length required to bend a reinforcement bar into a stirrup or tie shape for beams, columns or footings.",
  },
  {
    q: "What is the formula for rectangular stirrup cutting length?",
    a: "For a rectangular stirrup, a common formula is Cutting Length = 2(A + B) + Hook Length - Bend Deduction, where A and B are effective width and depth after clear cover deduction.",
  },
  {
    q: "How is clear cover used in stirrup length calculation?",
    a: "Clear cover is deducted from both sides of the member size. Effective width = Width - 2 × Clear Cover and effective depth = Depth - 2 × Clear Cover.",
  },
  {
    q: "Why is hook length added in stirrup cutting length?",
    a: "Hook length is added because stirrups usually have hooks at their ends to provide proper anchorage and confinement.",
  },
  {
    q: "Why is bend deduction subtracted?",
    a: "Bend deduction is subtracted because bending a bar changes the effective cutting length. It helps prepare a more practical BBS cutting length.",
  },
  {
    q: "Where is stirrup length calculation used?",
    a: "It is used in beam stirrups, column ties, footing reinforcement, seismic detailing and bar bending schedule preparation.",
  },
  {
    q: "Can this calculator be used for column ties?",
    a: "Yes. Stirrup length calculation is also used for column ties, especially rectangular and square column reinforcement.",
  },
];

export default function StirrupLengthSeoPage() {
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
                Stirrup Length Calculator for Beam and Column Reinforcement
              </h1>

              <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
                Calculate stirrup cutting length for rectangular, square,
                circular, diamond and custom stirrups using member size, clear
                cover, bar diameter, hook length and bend deduction.
              </p>

              <p className="mt-3 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
                Beam और column stirrup की cutting length निकालें। Width, depth,
                clear cover, bar diameter और hook type डालकर practical BBS
                output प्राप्त करें।
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={calculatorHref}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-500 px-6 py-4 text-base font-black text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600"
                >
                  Calculate Stirrup Length
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
                    CL = 2(A + B) + Hook - Bend Deduction
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-orange-500/20 bg-orange-500/10 p-5">
                <p className="text-sm font-semibold text-orange-200">
                  Example
                </p>
                <p className="mt-2 text-sm leading-7 text-slate-200">
                  For 230 × 450 mm beam, 25 mm cover:
                </p>
                <p className="mt-2 text-2xl font-black text-orange-300">
                  A = 180 mm, B = 400 mm
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
            <Calculator className="mb-4 text-orange-400" size={30} />
            <h2 className="text-xl font-black text-white">
              What is Stirrup Length?
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-400">
              Stirrup length is the total cutting length of a reinforcement bar
              required to form a stirrup or tie. It includes effective perimeter,
              hook length and bend deduction.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
            <ShieldCheck className="mb-4 text-orange-400" size={30} />
            <h2 className="text-xl font-black text-white">
              Hindi Explanation
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-400">
              Stirrup length bar की actual cutting length होती है जिससे beam या
              column में stirrup बनाया जाता है। इसमें clear cover, hook length
              और bend deduction का ध्यान रखा जाता है।
            </p>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
            <Info className="mb-4 text-orange-400" size={30} />
            <h2 className="text-xl font-black text-white">
              Where to Use?
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-400">
              Use it for beam stirrups, column ties, footing ties, lintel bars,
              seismic reinforcement, confinement reinforcement and BBS checking.
            </p>
          </div>
        </section>

        <section className="mt-8 rounded-[2rem] border border-slate-800 bg-slate-900/70 p-6 sm:p-8">
          <h2 className="text-2xl font-black text-white">
            Stirrup Length Formula
          </h2>

          <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-400 sm:text-base">
            The stirrup cutting length depends on the shape of the stirrup,
            clear cover, bar diameter, hook type and bend deduction. For
            rectangular beam stirrups, effective dimensions are first calculated
            after deducting clear cover from both sides.
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
            Example Stirrup Length Calculation
          </h2>

          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            <div className="rounded-2xl border border-orange-500/20 bg-slate-950/70 p-5">
              <h3 className="font-black text-orange-200">Given Data</h3>
              <div className="mt-4 space-y-2 text-sm leading-7 text-slate-300">
                <p>Beam width = 230 mm</p>
                <p>Beam depth = 450 mm</p>
                <p>Clear cover = 25 mm</p>
                <p>Stirrup bar diameter = 8 mm</p>
                <p>Hook type = 135° hook = 6d</p>
                <p>Hook ends = 2</p>
                <p>Bend deduction = 3 × 2d</p>
              </div>
            </div>

            <div className="rounded-2xl border border-orange-500/20 bg-slate-950/70 p-5">
              <h3 className="font-black text-orange-200">Calculation</h3>
              <div className="mt-4 space-y-2 text-sm leading-7 text-slate-300">
                <p>A = 230 - 2 × 25 = 180 mm</p>
                <p>B = 450 - 2 × 25 = 400 mm</p>
                <p>Perimeter = 2(180 + 400) = 1160 mm</p>
                <p>Hook length = 2 × 6 × 8 = 96 mm</p>
                <p>Bend deduction = 3 × 2 × 8 = 48 mm</p>
                <p className="font-black text-orange-300">
                  Cutting Length = 1160 + 96 - 48 = 1208 mm
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <Link
              href={calculatorHref}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-500 px-6 py-4 font-black text-white transition hover:bg-orange-600"
            >
              Calculate Your Stirrup Length
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
            Stirrup Length in BBS
          </h2>

          <div className="mt-5 grid gap-5 lg:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
              <h3 className="font-black text-white">Beam Stirrups</h3>
              <p className="mt-3 text-sm leading-7 text-slate-400">
                Beam stirrups are used to resist shear and hold main bars in
                position. Correct cutting length helps reduce wastage.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
              <h3 className="font-black text-white">Column Ties</h3>
              <p className="mt-3 text-sm leading-7 text-slate-400">
                Column ties provide confinement to vertical bars. Tie length
                depends on column size, clear cover and hook requirement.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
              <h3 className="font-black text-white">Seismic Detailing</h3>
              <p className="mt-3 text-sm leading-7 text-slate-400">
                In ductile detailing, 135° hooks are commonly used in ties and
                stirrups for better confinement and anchorage.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-[2rem] border border-slate-800 bg-slate-900/70 p-6 sm:p-8">
          <h2 className="text-2xl font-black text-white">
            Related Steel Calculators
          </h2>

          <p className="mt-2 text-sm leading-7 text-slate-400">
            Use these related tools for complete reinforcement and BBS checking.
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
            Stirrup Length Calculator FAQs
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
            Start Stirrup Length Calculation
          </h2>

          <p className="mx-auto mt-3 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
            Login ke baad aap direct Stirrup Length Calculator page par redirect
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
