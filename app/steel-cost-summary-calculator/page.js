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
  title: "Steel Cost Summary Calculator | Steel Weight & Cost Estimator",
  description:
    "Calculate steel weight, total steel cost, wastage, binding wire, bending charges, transport, GST and diameter-wise steel summary for construction projects.",
  alternates: {
    canonical: "https://www.civilcalcpro.in/steel-cost-summary-calculator",
  },
  openGraph: {
    title: "Steel Cost Summary Calculator for Construction",
    description:
      "Estimate total reinforcement steel quantity and cost with wastage, GST, binding wire, transport and diameter-wise summary.",
    url: "https://www.civilcalcpro.in/steel-cost-summary-calculator",
    siteName: "CivilCalc Pro",
    type: "website",
  },
};

const calculatorHref =
  "/login?redirect=/dashboard/calculators/steel-cost-summary";

const formulas = [
  {
    title: "Steel Weight Formula",
    formula: "Steel Weight = D² / 162 × Length",
    desc: "Used to calculate steel weight in kg when bar diameter is in mm and length is in meter.",
  },
  {
    title: "Item Steel Cost",
    formula: "Item Cost = Steel Weight × Rate per kg",
    desc: "Used to calculate material cost for each bar diameter or bar mark.",
  },
  {
    title: "Wastage Steel Weight",
    formula: "Wastage Weight = Raw Steel Weight × Wastage %",
    desc: "Used to include cutting, bending and site handling wastage.",
  },
  {
    title: "Gross Steel Weight",
    formula: "Gross Weight = Raw Steel Weight + Wastage Weight",
    desc: "Used to calculate final steel quantity after adding wastage.",
  },
  {
    title: "Binding Wire Cost",
    formula: "Binding Wire Cost = Gross Weight × Binding Wire % × Rate",
    desc: "Used to estimate binding wire quantity and cost for reinforcement fixing.",
  },
  {
    title: "Grand Total Cost",
    formula:
      "Grand Total = Steel Cost + Wastage Cost + Binding Wire + Bending Charges + Transport + GST",
    desc: "Used to calculate final reinforcement steel cost summary for the project.",
  },
];

const inputs = [
  "Bar mark or item name",
  "Member name: Beam, slab, column, footing or custom",
  "Bar diameter",
  "Length per bar",
  "Number of bars",
  "Steel rate per kg",
  "Wastage percentage",
  "Binding wire percentage and rate",
  "Bending and cutting charge per kg",
  "Transport charge per kg",
  "GST percentage",
  "Multiple steel items with add, duplicate and delete option",
];

const outputs = [
  "Item-wise steel weight",
  "Diameter-wise steel summary",
  "Raw steel weight",
  "Wastage steel weight",
  "Gross steel weight",
  "Steel material cost",
  "Binding wire cost",
  "Bending and cutting charges",
  "Transport charges",
  "GST amount",
  "Grand total steel cost",
  "Copy and print friendly summary",
];

const relatedTools = [
  {
    title: "Steel Weight Calculator",
    href: "/steel-weight-calculator",
  },
  {
    title: "Cutting Length Calculator",
    href: "/cutting-length-calculator",
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
    title: "Bend Deduction Calculator",
    href: "/bend-deduction-calculator",
  },
  {
    title: "Crank Bar Calculator",
    href: "/crank-bar-calculator",
  },
];

const faqs = [
  {
    q: "What is a steel cost summary calculator?",
    a: "A steel cost summary calculator estimates total reinforcement steel weight and cost for construction work using diameter, length, quantity, rate, wastage, binding wire, transport and GST.",
  },
  {
    q: "How is steel weight calculated?",
    a: "Steel weight is commonly calculated using D²/162 × length, where D is bar diameter in mm and length is in meter.",
  },
  {
    q: "Why is wastage added in steel cost?",
    a: "Wastage is added because steel cutting, bending, lapping, handling and site execution usually create extra consumption.",
  },
  {
    q: "What is binding wire in steel cost?",
    a: "Binding wire is used to tie reinforcement bars at site. Its cost is usually estimated as a small percentage of total steel weight.",
  },
  {
    q: "Can this calculator calculate diameter-wise steel cost?",
    a: "Yes. The calculator can summarize steel quantity and cost by bar diameter such as 8 mm, 10 mm, 12 mm, 16 mm and 20 mm.",
  },
  {
    q: "Where is steel cost summary used?",
    a: "It is used in BOQ preparation, BBS checking, site material planning, contractor billing, steel purchase planning and construction cost estimation.",
  },
  {
    q: "Does steel cost summary include GST?",
    a: "Yes. GST can be added as a percentage to calculate the final steel cost including tax.",
  },
  {
    q: "Can I use this for beam, slab, column and footing steel?",
    a: "Yes. You can add separate items for beam steel, slab steel, column steel, footing steel and other reinforcement items.",
  },
];

export default function SteelCostSummarySeoPage() {
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
                Steel Cost Estimation Tool
              </div>

              <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
                Steel Cost Summary Calculator for Construction Projects
              </h1>

              <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
                Calculate total reinforcement steel weight and cost with
                diameter-wise summary, wastage, binding wire, bending charges,
                transport charges, GST and final project steel cost.
              </p>

              <p className="mt-3 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
                Construction site के लिए steel quantity और steel cost summary
                निकालें। Bar diameter, length, quantity, rate, wastage, binding
                wire और GST डालकर complete steel cost report बनाएं।
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={calculatorHref}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-500 px-6 py-4 text-base font-black text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600"
                >
                  Calculate Steel Cost
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
                    Steel Weight = D² / 162 × Length
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-orange-500/20 bg-orange-500/10 p-5">
                <p className="text-sm font-semibold text-orange-200">
                  Example
                </p>
                <p className="mt-2 text-sm leading-7 text-slate-200">
                  12 mm bar, 100 m total length:
                </p>
                <p className="mt-2 text-2xl font-black text-orange-300">
                  12² / 162 × 100 = 88.89 kg
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
            <Calculator className="mb-4 text-orange-400" size={30} />
            <h2 className="text-xl font-black text-white">
              What is Steel Cost Summary?
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-400">
              Steel cost summary is a complete calculation of reinforcement
              steel quantity and cost. It includes bar diameter, bar length,
              quantity, rate, wastage, binding wire, cutting charges, transport
              and GST.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
            <ShieldCheck className="mb-4 text-orange-400" size={30} />
            <h2 className="text-xl font-black text-white">
              Hindi Explanation
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-400">
              Steel cost summary में project की total reinforcement quantity और
              total cost निकाली जाती है। इसमें steel weight, wastage, binding
              wire, transport, bending charges और GST शामिल होते हैं।
            </p>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
            <Info className="mb-4 text-orange-400" size={30} />
            <h2 className="text-xl font-black text-white">
              Where to Use?
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-400">
              Use it for BOQ, BBS, steel purchase planning, contractor billing,
              site material planning, project cost estimation and reinforcement
              quantity checking.
            </p>
          </div>
        </section>

        <section className="mt-8 rounded-[2rem] border border-slate-800 bg-slate-900/70 p-6 sm:p-8">
          <h2 className="text-2xl font-black text-white">
            Steel Cost Summary Formula
          </h2>

          <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-400 sm:text-base">
            Steel cost summary starts with the steel weight calculation. After
            raw steel weight is calculated, wastage, binding wire, bending and
            cutting charges, transport charges and GST are added to estimate the
            final project steel cost.
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
            Example Steel Cost Summary Calculation
          </h2>

          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            <div className="rounded-2xl border border-orange-500/20 bg-slate-950/70 p-5">
              <h3 className="font-black text-orange-200">Given Data</h3>
              <div className="mt-4 space-y-2 text-sm leading-7 text-slate-300">
                <p>Bar diameter = 12 mm</p>
                <p>Total length = 100 m</p>
                <p>Steel rate = ₹60 per kg</p>
                <p>Wastage = 5%</p>
                <p>Binding wire = 1%</p>
                <p>GST = 18%</p>
              </div>
            </div>

            <div className="rounded-2xl border border-orange-500/20 bg-slate-950/70 p-5">
              <h3 className="font-black text-orange-200">Calculation</h3>
              <div className="mt-4 space-y-2 text-sm leading-7 text-slate-300">
                <p>Steel weight = 12² / 162 × 100</p>
                <p>Steel weight = 88.89 kg</p>
                <p>Steel cost = 88.89 × 60 = ₹5,333.40</p>
                <p>Wastage weight = 88.89 × 5% = 4.44 kg</p>
                <p>Gross steel weight = 93.33 kg</p>
                <p className="font-black text-orange-300">
                  Final cost is calculated after adding binding wire, charges
                  and GST.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <Link
              href={calculatorHref}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-500 px-6 py-4 font-black text-white transition hover:bg-orange-600"
            >
              Calculate Your Steel Cost
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
            Steel Cost Summary in BOQ and BBS
          </h2>

          <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-400 sm:text-base">
            In BOQ and BBS work, steel cost summary helps engineers and
            contractors understand how much steel is required, which bar
            diameters are used, how much wastage should be considered and what
            will be the final reinforcement cost for the project.
          </p>

          <div className="mt-5 grid gap-5 lg:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
              <h3 className="font-black text-white">BOQ Estimation</h3>
              <p className="mt-3 text-sm leading-7 text-slate-400">
                Steel cost summary helps prepare BOQ steel items with quantity,
                rate and total cost for beams, slabs, columns and footings.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
              <h3 className="font-black text-white">Site Purchase Planning</h3>
              <p className="mt-3 text-sm leading-7 text-slate-400">
                Diameter-wise steel summary helps plan how much 8 mm, 10 mm, 12
                mm, 16 mm and 20 mm bars should be ordered at site.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
              <h3 className="font-black text-white">Contractor Billing</h3>
              <p className="mt-3 text-sm leading-7 text-slate-400">
                Steel weight and cost summary helps verify reinforcement billing
                and compare estimated steel against actual site consumption.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-[2rem] border border-slate-800 bg-slate-900/70 p-6 sm:p-8">
          <h2 className="text-2xl font-black text-white">
            Related Steel Calculators
          </h2>

          <p className="mt-2 text-sm leading-7 text-slate-400">
            Use these related tools for complete reinforcement calculation,
            BBS checking and site steel planning.
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
            Steel Cost Summary Calculator FAQs
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
            Start Steel Cost Calculation
          </h2>

          <p className="mx-auto mt-3 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
            Login ke baad aap direct Steel Cost Summary Calculator page par
            redirect ho jaoge.
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
