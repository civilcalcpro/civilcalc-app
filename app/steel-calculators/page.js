import Link from "next/link";
import {
  ArrowRight,
  Calculator,
  CheckCircle2,
  CircleDollarSign,
  HelpCircle,
  Layers,
  Ruler,
  ShieldCheck,
  Sparkles,
  Weight,
  Wrench,
} from "lucide-react";

export const metadata = {
  title: "Steel Calculators for Civil Engineering | BBS & Reinforcement Tools",
  description:
    "Use CivilCalc Pro steel calculators for steel weight, lap length, development length, hook length, stirrup length, bend deduction, cutting length, crank bar and steel cost summary.",
  alternates: {
    canonical: "https://www.civilcalcpro.in/steel-calculators",
  },
  openGraph: {
    title: "Steel Calculators for Civil Engineering",
    description:
      "Complete steel reinforcement calculator hub for BBS, bar cutting length, steel weight, stirrups, hooks, crank bars and cost summary.",
    url: "https://www.civilcalcpro.in/steel-calculators",
    siteName: "CivilCalc Pro",
    type: "website",
  },
};

const steelTools = [
  {
    title: "Steel Weight Calculator",
    href: "/steel-weight-calculator",
    calculatorHref: "/login?redirect=/dashboard/calculators/steel-weight",
    icon: Weight,
    desc: "Calculate steel bar weight using D²/162 formula with diameter, length and quantity.",
    keywords: "steel weight, rebar weight, D²/162",
  },
  {
    title: "Lap Length Calculator",
    href: "/lap-length-calculator",
    calculatorHref: "/login?redirect=/dashboard/calculators/lap-length",
    icon: Layers,
    desc: "Calculate lap length for reinforcement bars used in beam, slab, column and footing work.",
    keywords: "lap length, rebar lap, steel lapping",
  },
  {
    title: "Development Length Calculator",
    href: "/development-length-calculator",
    calculatorHref: "/login?redirect=/dashboard/calculators/development-length",
    icon: ShieldCheck,
    desc: "Calculate development length for RCC reinforcement anchorage and detailing.",
    keywords: "development length, anchorage length, Ld",
  },
  {
    title: "Hook Length Calculator",
    href: "/hook-length-calculator",
    calculatorHref: "/login?redirect=/dashboard/calculators/hook-length",
    icon: Wrench,
    desc: "Calculate hook length for reinforcement bars, stirrups and bend anchorage.",
    keywords: "hook length, 90 hook, 135 hook, 180 hook",
  },
  {
    title: "Stirrup Length Calculator",
    href: "/stirrup-length-calculator",
    calculatorHref: "/login?redirect=/dashboard/calculators/stirrup-length",
    icon: Ruler,
    desc: "Calculate rectangular, square, circular and diamond stirrup cutting length.",
    keywords: "stirrup length, stirrup cutting length, column ties",
  },
  {
    title: "Bend Deduction Calculator",
    href: "/bend-deduction-calculator",
    calculatorHref: "/login?redirect=/dashboard/calculators/bend-deduction",
    icon: Calculator,
    desc: "Calculate bend deduction for 45°, 90°, 135°, 180° and custom bends.",
    keywords: "bend deduction, BBS bend, reinforcement bend",
  },
  {
    title: "Cutting Length Calculator",
    href: "/cutting-length-calculator",
    calculatorHref: "/login?redirect=/dashboard/calculators/cutting-length",
    icon: Ruler,
    desc: "Calculate steel bar cutting length with hooks, lap, development length and bend deduction.",
    keywords: "cutting length, BBS cutting length, bar cutting",
  },
  {
    title: "Crank Bar Calculator",
    href: "/crank-bar-calculator",
    calculatorHref: "/login?redirect=/dashboard/calculators/crank-bar",
    icon: Wrench,
    desc: "Calculate crank bar or bent-up bar cutting length with crank height and angle.",
    keywords: "crank bar, bent up bar, 0.42H",
  },
  {
    title: "Steel Cost Summary Calculator",
    href: "/steel-cost-summary-calculator",
    calculatorHref: "/login?redirect=/dashboard/calculators/steel-cost-summary",
    icon: CircleDollarSign,
    desc: "Calculate steel weight, wastage, binding wire, transport, GST and final steel cost.",
    keywords: "steel cost, steel estimate, reinforcement cost",
  },
];

const benefits = [
  "Complete steel reinforcement calculation workflow",
  "Useful for BBS, BOQ, site execution and quantity estimation",
  "Separate calculator pages for better accuracy and faster use",
  "Hindi and English explanation for students and site engineers",
  "Login-based calculator access with public SEO pages",
  "Internal linking between all steel tools for better SEO structure",
];

const formulas = [
  {
    title: "Steel Weight",
    formula: "Weight = D² / 162 × Length",
  },
  {
    title: "Hook Length",
    formula: "Hook Length = Multiplier × d",
  },
  {
    title: "Stirrup Length",
    formula: "CL = 2(A + B) + Hook - Bend Deduction",
  },
  {
    title: "Bend Deduction",
    formula: "BD = Bend Multiplier × d × No. of Bends",
  },
  {
    title: "Cutting Length",
    formula: "CL = Straight Length + Hook + Lap + Ld - BD",
  },
  {
    title: "Crank Extra Length",
    formula: "Extra Length = H × (cosecθ - cotθ)",
  },
];

const faqs = [
  {
    q: "What are steel calculators in civil engineering?",
    a: "Steel calculators are tools used to calculate reinforcement steel weight, cutting length, lap length, development length, hook length, stirrup length, bend deduction, crank bar length and steel cost.",
  },
  {
    q: "Which steel calculator is used for BBS?",
    a: "For BBS work, cutting length calculator, stirrup length calculator, bend deduction calculator, hook length calculator and steel weight calculator are commonly used.",
  },
  {
    q: "What is the formula for steel weight?",
    a: "The common formula for steel weight is D²/162 × length, where D is the bar diameter in mm and length is in meter.",
  },
  {
    q: "Which calculator should I use for stirrups?",
    a: "Use the Stirrup Length Calculator to calculate rectangular, square, circular or diamond stirrup cutting length with hooks and bend deduction.",
  },
  {
    q: "Which calculator should I use for crank bars?",
    a: "Use the Crank Bar Calculator to calculate bent-up bar or crank bar cutting length using crank height, crank angle and number of cranks.",
  },
  {
    q: "Can these tools be used for beams, slabs, columns and footings?",
    a: "Yes. These steel calculators can be used for beam reinforcement, slab bars, column ties, footing bars, stirrups, crank bars and BBS checking.",
  },
  {
    q: "Do users need login to calculate?",
    a: "The SEO pages are public, but when users click Calculate Now, they go to login first and then redirect to the actual calculator page.",
  },
];

export default function SteelCalculatorsHubPage() {
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
                Civil Engineering Steel Calculator Hub
              </div>

              <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
                Steel Calculators for BBS, Reinforcement and Construction Cost
              </h1>

              <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
                Use CivilCalc Pro steel calculators to calculate steel weight,
                lap length, development length, hook length, stirrup length,
                bend deduction, cutting length, crank bar length and steel cost
                summary.
              </p>

              <p className="mt-3 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
                यह steel calculator hub civil engineers, site engineers,
                contractors और students के लिए बनाया गया है। BBS, BOQ, site
                execution और reinforcement quantity checking के लिए सभी
                important steel tools एक जगह मिलेंगे।
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#steel-tools"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-500 px-6 py-4 text-base font-black text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600"
                >
                  View All Steel Tools
                  <ArrowRight size={20} />
                </a>

                <Link
                  href="/login?redirect=/dashboard/calculators/steel-weight"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-950/60 px-6 py-4 text-base font-bold text-slate-200 transition hover:border-orange-400 hover:text-orange-300"
                >
                  Start Calculating
                </Link>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5">
              <h2 className="text-xl font-black text-white">
                Steel Tools Included
              </h2>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-orange-500/20 bg-orange-500/10 p-4">
                  <p className="text-3xl font-black text-orange-300">9</p>
                  <p className="mt-1 text-sm text-slate-300">Steel Tools</p>
                </div>

                <div className="rounded-2xl border border-orange-500/20 bg-orange-500/10 p-4">
                  <p className="text-3xl font-black text-orange-300">BBS</p>
                  <p className="mt-1 text-sm text-slate-300">Ready Flow</p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                  <p className="text-3xl font-black text-white">SEO</p>
                  <p className="mt-1 text-sm text-slate-300">Public Pages</p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                  <p className="text-3xl font-black text-white">Login</p>
                  <p className="mt-1 text-sm text-slate-300">Calculator Use</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="steel-tools" className="mt-8">
          <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-2xl font-black text-white">
                All Steel Calculators
              </h2>
              <p className="mt-2 text-sm leading-7 text-slate-400">
                हर calculator का SEO page public रहेगा, और Calculate button
                login के बाद actual dashboard calculator पर redirect करेगा।
              </p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {steelTools.map((tool) => {
              const Icon = tool.icon;

              return (
                <div
                  key={tool.href}
                  className="rounded-[1.5rem] border border-slate-800 bg-slate-900/70 p-5 transition hover:border-orange-500/50 hover:bg-slate-900"
                >
                  <div className="mb-5 flex items-start justify-between gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-400 ring-1 ring-orange-500/20">
                      <Icon size={28} />
                    </div>

                    <span className="rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1 text-xs font-bold text-orange-300">
                      SEO + Tool
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-white">
                    {tool.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-400">
                    {tool.desc}
                  </p>

                  <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {tool.keywords}
                  </p>

                  <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                    <Link
                      href={tool.href}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm font-bold text-slate-200 transition hover:border-orange-400 hover:text-orange-300"
                    >
                      Read Page
                    </Link>

                    <Link
                      href={tool.calculatorHref}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-black text-white transition hover:bg-orange-600"
                    >
                      Calculate
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-slate-800 bg-slate-900/70 p-6 sm:p-8">
            <h2 className="text-2xl font-black text-white">
              Why Use This Steel Calculator Hub?
            </h2>

            <div className="mt-5 space-y-3">
              {benefits.map((item) => (
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
              Best Workflow for BBS
            </h2>

            <div className="mt-5 space-y-4 text-sm leading-7 text-slate-400">
              <p>
                1. पहले drawing से member size, bar diameter और bar shape note
                करें।
              </p>
              <p>
                2. Hook, lap, development length, stirrup length और bend
                deduction calculate करें।
              </p>
              <p>
                3. Cutting length निकालकर total length और steel weight calculate
                करें।
              </p>
              <p>
                4. Last में Steel Cost Summary Calculator से wastage, GST और
                final cost estimate करें।
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-[2rem] border border-slate-800 bg-slate-900/70 p-6 sm:p-8">
          <h2 className="text-2xl font-black text-white">
            Important Steel Formulas
          </h2>

          <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-400 sm:text-base">
            These are commonly used practical formulas for reinforcement steel
            quantity, BBS checking and construction site estimation.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {formulas.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5"
              >
                <h3 className="font-black text-white">{item.title}</h3>
                <p className="mt-3 text-lg font-black text-orange-300">
                  {item.formula}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-[2rem] border border-orange-500/20 bg-orange-500/10 p-6 sm:p-8">
          <h2 className="text-2xl font-black text-white">
            Steel Calculator Use in Civil Engineering
          </h2>

          <div className="mt-5 grid gap-5 lg:grid-cols-3">
            <div className="rounded-2xl border border-orange-500/20 bg-slate-950/70 p-5">
              <h3 className="font-black text-orange-200">For Students</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Students can use these pages to understand formulas, examples,
                BBS concepts and Hindi explanations before solving exam or
                assignment problems.
              </p>
            </div>

            <div className="rounded-2xl border border-orange-500/20 bg-slate-950/70 p-5">
              <h3 className="font-black text-orange-200">For Site Engineers</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Site engineers can quickly verify bar cutting length, stirrup
                length, steel weight and purchase quantity during execution.
              </p>
            </div>

            <div className="rounded-2xl border border-orange-500/20 bg-slate-950/70 p-5">
              <h3 className="font-black text-orange-200">For Contractors</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Contractors can estimate steel quantity, wastage, binding wire,
                transport, GST and final reinforcement cost for billing and BOQ.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-[2rem] border border-slate-800 bg-slate-900/70 p-6 sm:p-8">
          <h2 className="text-2xl font-black text-white">
            Steel Calculators FAQs
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
            Start Steel Calculation
          </h2>

          <p className="mx-auto mt-3 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
            Formula और theory public page पर देख सकते हो. Calculate करने के लिए
            login के बाद direct selected calculator open होगा.
          </p>

          <Link
            href="/login?redirect=/dashboard/calculators/steel-weight"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-500 px-7 py-4 font-black text-white transition hover:bg-orange-600"
          >
            Start With Steel Weight Calculator
            <ArrowRight size={20} />
          </Link>
        </section>
      </div>
    </main>
  );
}
