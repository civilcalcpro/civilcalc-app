import Link from "next/link";

export const metadata = {
  title:
    "Lap Length Calculator | RCC Bar Overlap Length Formula | CivilCalc Pro",
  description:
    "Learn lap length formula for RCC reinforcement bars, bar overlap rules, tension lap, compression lap, development length reference and step-by-step lap length calculation with CivilCalc Pro.",
  keywords: [
    "lap length calculator",
    "lap length formula",
    "lap length in RCC",
    "lap length of reinforcement bars",
    "bar overlap length calculator",
    "RCC bar lap length",
    "lap length for column",
    "lap length for beam",
    "lap length for slab",
    "lap length for footing",
    "steel bar lap length",
    "reinforcement lap length",
    "tension lap length",
    "compression lap length",
    "bar splicing length",
    "lap length in civil engineering",
    "lap length calculation in Hindi",
    "CivilCalc Pro",
  ],
  alternates: {
    canonical: "https://civilcalcpro.in/lap-length-calculation",
  },
  openGraph: {
    title: "Lap Length Calculator for RCC Bars | CivilCalc Pro",
    description:
      "Calculate RCC bar lap length for tension, compression, beams, columns, slabs and footings with step-by-step formula.",
    url: "https://civilcalcpro.in/lap-length-calculation",
    siteName: "CivilCalc Pro",
    type: "article",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
};

const lapRules = [
  [
    "Flexural Tension",
    "Lap length should not be less than development length or 30D",
    "Beam bottom/top bars, slab tension bars",
  ],
  [
    "Direct Tension",
    "Lap length should be higher because direct tension is more critical",
    "Tie members, direct tension reinforcement",
  ],
  [
    "Compression",
    "Lap length should not be less than compression development length or 24D",
    "Column bars, compression reinforcement",
  ],
];

const examples = [
  ["12 mm", "Fe415", "M20", "Flexural Tension", "Approx. 564 mm"],
  ["16 mm", "Fe415", "M20", "Flexural Tension", "Approx. 752 mm"],
  ["20 mm", "Fe415", "M20", "Compression", "Approx. 752 mm"],
  ["20 mm", "Fe500", "M25", "Flexural Tension", "Approx. 971 mm"],
  ["20 mm", "Fe500", "M25", "Direct Tension", "Approx. 1942 mm"],
];

const memberUses = [
  {
    title: "Lap Length in Column",
    text:
      "Column vertical bars are often lapped floor-wise. Laps should be staggered and should not be placed carelessly in beam-column joint zones. Structural drawing and detailing notes should always be followed.",
  },
  {
    title: "Lap Length in Beam",
    text:
      "Beam bars should not be lapped in highly stressed zones wherever possible. Top bars, bottom bars and extra bars should be lapped according to bending moment zone and structural drawing.",
  },
  {
    title: "Lap Length in Slab",
    text:
      "Slab reinforcement lap should be provided with proper overlap, spacing and cover. Alternate staggering is preferred so that all bars do not lap at the same section.",
  },
  {
    title: "Lap Length in Footing",
    text:
      "Footing reinforcement and column dowels require proper lap and anchorage. Column dowels should be checked carefully with footing depth and structural detailing.",
  },
];

const faqs = [
  {
    q: "What is lap length in RCC?",
    a:
      "Lap length is the overlap length provided when two reinforcement bars are joined together to transfer stress safely from one bar to another.",
  },
  {
    q: "Why is lap length required?",
    a:
      "Lap length is required because reinforcement bars are available in limited lengths. When bars need to be continued, they are overlapped for safe force transfer.",
  },
  {
    q: "What is the difference between lap length and development length?",
    a:
      "Development length is used for anchorage of a single bar inside concrete, while lap length is used when two bars are overlapped or spliced together.",
  },
  {
    q: "How is lap length calculated?",
    a:
      "Lap length is generally calculated based on development length, bar diameter, steel grade, concrete grade and whether the bar is in tension or compression.",
  },
  {
    q: "Can lap length be provided anywhere?",
    a:
      "No. Lap should be avoided in highly stressed zones and should be staggered. Final lap location should follow structural drawings and engineer instructions.",
  },
  {
    q: "Can CivilCalc Pro calculate lap length?",
    a:
      "Yes. CivilCalc Pro provides a Lap Length Calculator where users can select bar diameter, steel grade, concrete grade, lap condition, member type and output unit.",
  },
];

const relatedTools = [
  ["Open Lap Length Calculator", "/login?redirect=/dashboard/calculators/lap-length"],
  ["Development Length Calculator", "/login?redirect=/dashboard/calculators/development-length"],
  ["BBS Generator", "/login?redirect=/dashboard/calculators/bbs-generator"],
  ["Steel Weight Calculator", "/login?redirect=/dashboard/calculators/steel-weight"],
  ["BOQ Generator", "/boq-generator"],
  ["Home Construction Cost Calculator", "/home-construction-cost-calculator"],
  ["Bar Bending Schedule Guide", "/bar-bending-schedule-guide"],
];

export default function LapLengthArticlePage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Lap Length Calculator for RCC Bars",
    description:
      "Complete guide to RCC lap length, reinforcement overlap length, tension lap, compression lap and step-by-step lap length calculation.",
    author: {
      "@type": "Organization",
      name: "CivilCalc Pro",
    },
    publisher: {
      "@type": "Organization",
      name: "CivilCalc Pro",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://civilcalcpro.in/lap-length-calculation",
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "CivilCalc Pro",
        item: "https://civilcalcpro.in",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Lap Length Calculation",
        item: "https://civilcalcpro.in/lap-length-calculation",
      },
    ],
  };

  return (
    <main className="min-h-screen bg-[#050B1F] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <section className="max-w-5xl mx-auto px-4 md:px-6 pt-16 pb-10">
        <p className="text-orange-400 font-black text-sm tracking-wide">
          RCC REINFORCEMENT DETAILING GUIDE
        </p>

        <h1 className="text-4xl md:text-6xl font-black mt-4 leading-tight">
          Lap Length Calculator for RCC Bars
        </h1>

        <p className="text-slate-300 text-lg mt-6 leading-8 max-w-4xl">
          Lap length is one of the most important RCC reinforcement detailing
          calculations. It helps engineers calculate how much overlap is required
          when two steel bars are joined together in beams, columns, slabs,
          footings and staircases.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Link
            href="/login?redirect=/dashboard/calculators/lap-length"
            className="bg-orange-500 hover:bg-orange-600 transition px-6 py-4 rounded-xl font-black text-center"
          >
            Open Lap Length Calculator
          </Link>

          <Link
            href="/login?redirect=/dashboard/calculators/development-length"
            className="border border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white transition px-6 py-4 rounded-xl font-black text-center"
          >
            Open Development Length Calculator
          </Link>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 md:px-6 pb-20 space-y-8">
        <section className="rounded-3xl border border-orange-500/30 bg-orange-500/5 p-6 md:p-8">
          <p className="text-orange-400 font-black mb-3">QUICK ANSWER</p>

          <h2 className="text-2xl md:text-3xl font-black mb-5">
            What is Lap Length?
          </h2>

          <p className="text-slate-300 leading-8 mb-5">
            Lap length is the overlap length provided between two reinforcement
            bars when one bar is not long enough to continue through the full
            member. In simple Hindi, jab do steel bars ko overlap karke join
            kiya jata hai, us overlap ki required length ko lap length kehte
            hain.
          </p>

          <FormulaBox>
            Lap Length = Based on Development Length, Bar Diameter and Stress Condition
          </FormulaBox>

          <p className="text-slate-300 leading-8 mt-5">
            Lap length depends on bar diameter, steel grade, concrete grade,
            tension/compression condition, member type and lap location.
          </p>
        </section>

        <ArticleCard title="Why Lap Length is Important">
          Lap length is important because reinforcement bars need proper overlap
          to transfer force safely from one bar to another. If lap length is
          insufficient, the bar may slip, cracks may develop and reinforcement
          continuity can fail. Proper lap length improves RCC detailing safety
          and site execution quality.
        </ArticleCard>

        <ArticleCard title="Lap Length Formula and Rules">
          <p className="mb-4">
            Lap length is usually checked with development length and minimum
            diameter-based rules.
          </p>

          <div className="grid sm:grid-cols-3 gap-4">
            <MiniBox label="Flexural Tension" value="max(Ld, 30D)" />
            <MiniBox label="Direct Tension" value="max(2Ld, 30D)" />
            <MiniBox label="Compression" value="max(Ld, 24D)" />
          </div>

          <p className="text-slate-400 text-sm mt-5">
            D means bar diameter and Ld means development length. Final detailing
            should be verified with structural drawing and project requirements.
          </p>
        </ArticleCard>

        <ArticleCard title="Lap Length Rule Table">
          <div className="overflow-x-auto">
            <table className="w-full border border-slate-800 text-left">
              <thead className="bg-slate-900">
                <tr>
                  <TableHead>Condition</TableHead>
                  <TableHead>General Rule</TableHead>
                  <TableHead>Common Use</TableHead>
                </tr>
              </thead>

              <tbody>
                {lapRules.map(([condition, rule, use]) => (
                  <tr key={condition}>
                    <TableCell strong>{condition}</TableCell>
                    <TableCell>{rule}</TableCell>
                    <TableCell>{use}</TableCell>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ArticleCard>

        <ArticleCard title="How to Calculate Lap Length Step by Step">
          <ol className="list-decimal pl-6 space-y-3 text-slate-300 leading-7">
            <li>Select the bar diameter, for example 12 mm, 16 mm or 20 mm.</li>
            <li>Select steel grade such as Fe415 or Fe500.</li>
            <li>Select concrete grade such as M20, M25 or M30.</li>
            <li>Select lap condition: flexural tension, direct tension or compression.</li>
            <li>Calculate development length using bar diameter, steel stress and bond stress.</li>
            <li>Apply lap rule according to tension or compression condition.</li>
            <li>Round the result to a practical site value such as nearest 25 mm or 50 mm.</li>
            <li>Check lap location with structural drawing before site execution.</li>
          </ol>
        </ArticleCard>

        <ArticleCard title="Lap Length Example">
          <p className="text-slate-300 leading-8 mb-5">
            Suppose bar diameter is 16 mm, steel grade is Fe415, concrete grade
            is M20 and condition is flexural tension.
          </p>

          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 text-slate-300 leading-8">
            <p>Bar diameter = 16 mm</p>
            <p>Steel grade = Fe415</p>
            <p>Concrete grade = M20</p>
            <p>Steel stress = 0.87 × 415 = 361.05 N/mm²</p>
            <p>Development length in tension ≈ 752 mm</p>
            <p>Minimum 30D = 30 × 16 = 480 mm</p>
            <p>Lap length = max(752 mm, 480 mm)</p>
            <p className="text-orange-400 font-black mt-3">
              Required Lap Length ≈ 752 mm
            </p>
          </div>
        </ArticleCard>

        <ArticleCard title="Common Lap Length Results">
          <div className="overflow-x-auto">
            <table className="w-full border border-slate-800 text-left">
              <thead className="bg-slate-900">
                <tr>
                  <TableHead>Bar Diameter</TableHead>
                  <TableHead>Steel Grade</TableHead>
                  <TableHead>Concrete Grade</TableHead>
                  <TableHead>Condition</TableHead>
                  <TableHead>Approx. Lap Length</TableHead>
                </tr>
              </thead>

              <tbody>
                {examples.map((row) => (
                  <tr key={row.join("-")}>
                    {row.map((cell, index) => (
                      <TableCell key={`${row[0]}-${index}`} strong={index === 0}>
                        {cell}
                      </TableCell>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ArticleCard>

        <section className="grid md:grid-cols-2 gap-6">
          {memberUses.map((item) => (
            <div
              key={item.title}
              className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6"
            >
              <h2 className="text-2xl font-black text-white mb-4">
                {item.title}
              </h2>
              <p className="text-slate-300 leading-8">{item.text}</p>
            </div>
          ))}
        </section>

        <ArticleCard title="Lap Length vs Development Length">
          Lap length and development length are related but not the same.
          Development length is required to anchor a bar inside concrete, while
          lap length is required to join two bars together by overlap. In many
          RCC detailing cases, lap length is calculated using development length
          as reference.
        </ArticleCard>

        <ArticleCard title="Common Mistakes in Lap Length">
          <ul className="list-disc pl-6 space-y-3 text-slate-300 leading-7">
            <li>Providing lap length without checking tension or compression condition.</li>
            <li>Placing all laps at the same section.</li>
            <li>Providing lap in highly stressed zones.</li>
            <li>Ignoring structural drawing and bar bending schedule notes.</li>
            <li>Using same lap rule for beam, column, slab and footing without checking details.</li>
            <li>Not rounding lap length properly for practical site execution.</li>
          </ul>
        </ArticleCard>

        <ArticleCard title="Practical Site Notes for Lap Length">
          <p className="text-slate-300 leading-8">
            Site par lap length provide karte time bars ko properly tie karo,
            cover maintain karo, lap ko stagger karo aur ek hi section par sabhi
            bars ko lap mat karo. Beam-column joint, maximum bending moment zone
            and congested reinforcement areas me lap location carefully check
            karni chahiye.
          </p>
        </ArticleCard>

        <ArticleCard title="How CivilCalc Pro Helps">
          CivilCalc Pro provides a dedicated Lap Length Calculator where users
          can select bar diameter, steel grade, concrete grade, lap condition,
          member type, lap location and output unit. The tool gives lap length in
          mm, cm, meter, inch and feet with step-by-step calculation, site notes,
          warnings and PDF report.
        </ArticleCard>

        <ArticleCard title="Related Civil Engineering Tools">
          <div className="grid sm:grid-cols-2 gap-3">
            {relatedTools.map(([label, href]) => (
              <LinkCard key={label} href={href}>
                {label}
              </LinkCard>
            ))}
          </div>
        </ArticleCard>

        <FAQSection />

        <div className="text-center pt-4">
          <Link
            href="/login?redirect=/dashboard/calculators/lap-length"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white transition px-8 py-4 rounded-xl font-black"
          >
            Calculate Lap Length Now
          </Link>
        </div>
      </section>
    </main>
  );
}

function ArticleCard({ title, children }) {
  return (
    <section className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
      <h2 className="text-2xl font-black text-white mb-4">{title}</h2>
      <div className="text-slate-300 leading-8">{children}</div>
    </section>
  );
}

function FormulaBox({ children }) {
  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-orange-400 font-mono text-base md:text-lg overflow-x-auto">
      {children}
    </div>
  );
}

function MiniBox({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-white font-black mt-1">{value}</p>
    </div>
  );
}

function LinkCard({ href, children }) {
  return (
    <Link
      href={href}
      className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-300 hover:border-orange-500 hover:text-orange-400 transition"
    >
      {children}
    </Link>
  );
}

function TableHead({ children }) {
  return (
    <th className="border border-slate-800 p-3 text-white font-black">
      {children}
    </th>
  );
}

function TableCell({ children, strong = false }) {
  return (
    <td
      className={`border border-slate-800 p-3 text-slate-300 ${
        strong ? "font-bold text-white" : ""
      }`}
    >
      {children}
    </td>
  );
}

function FAQSection() {
  return (
    <section className="rounded-2xl border border-orange-500/30 bg-orange-500/10 p-6">
      <h2 className="text-2xl font-black text-white mb-6">
        Frequently Asked Questions
      </h2>

      <div className="space-y-5">
        {faqs.map((faq) => (
          <div key={faq.q}>
            <h3 className="font-black text-orange-400">{faq.q}</h3>
            <p className="text-slate-300 mt-2 leading-7">{faq.a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
