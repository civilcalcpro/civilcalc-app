import Link from "next/link";

export const metadata = {
  title:
    "Development Length Calculator | RCC Bar Anchorage Length Formula | CivilCalc Pro",
  description:
    "Learn development length formula for RCC reinforcement bars, anchorage length calculation, bond stress, steel grade, concrete grade and step-by-step Ld calculation with CivilCalc Pro.",
  keywords: [
    "development length calculator",
    "development length formula",
    "development length in RCC",
    "development length of bars",
    "anchorage length calculator",
    "RCC bar development length",
    "Ld calculation",
    "bond stress in RCC",
    "development length for beam",
    "development length for column",
    "development length for slab",
    "development length for footing",
    "CivilCalc Pro",
  ],
  alternates: {
    canonical: "https://civilcalcpro.in/development-length-calculation",
  },
  openGraph: {
    title: "Development Length Calculator for RCC Bars | CivilCalc Pro",
    description:
      "Calculate RCC reinforcement development length using bar diameter, steel grade, concrete grade, bond stress and stress condition.",
    url: "https://civilcalcpro.in/development-length-calculation",
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

const examples = [
  ["12 mm", "Fe415", "M20", "Tension", "Approx. 564 mm"],
  ["16 mm", "Fe415", "M20", "Tension", "Approx. 752 mm"],
  ["20 mm", "Fe500", "M25", "Tension", "Approx. 971 mm"],
  ["25 mm", "Fe500", "M25", "Tension", "Approx. 1214 mm"],
];

const bondStressRows = [
  ["M15", "1.0 N/mm²"],
  ["M20", "1.2 N/mm²"],
  ["M25", "1.4 N/mm²"],
  ["M30", "1.5 N/mm²"],
  ["M35", "1.7 N/mm²"],
  ["M40", "1.9 N/mm²"],
];

const faqs = [
  {
    q: "What is development length in RCC?",
    a:
      "Development length is the minimum length of reinforcement bar required to be embedded in concrete so that the bar can develop its full design stress safely without slipping.",
  },
  {
    q: "What is the formula for development length?",
    a:
      "The commonly used formula is Ld = φ × σs / 4τbd, where φ is bar diameter, σs is steel stress and τbd is design bond stress.",
  },
  {
    q: "Why is development length important?",
    a:
      "Development length is important because insufficient anchorage can cause bar slip, cracking, poor load transfer and unsafe RCC detailing.",
  },
  {
    q: "Where is development length used?",
    a:
      "Development length is used in RCC beams, columns, slabs, footings, staircases, beam-column joints and footing-column dowel anchorage.",
  },
  {
    q: "Does concrete grade affect development length?",
    a:
      "Yes. Higher concrete grade usually provides better bond stress, which can reduce the required development length.",
  },
  {
    q: "Can CivilCalc Pro calculate development length?",
    a:
      "Yes. CivilCalc Pro provides a Development Length Calculator where users can select bar diameter, steel grade, concrete grade, bar type and stress condition to calculate Ld.",
  },
];

const relatedTools = [
  ["Open Development Length Calculator", "/login?redirect=/dashboard/calculators/development-length"],
  ["Lap Length Calculator", "/login?redirect=/dashboard/calculators/lap-length"],
  ["BBS Generator", "/login?redirect=/dashboard/calculators/bbs-generator"],
  ["Steel Weight Calculator", "/login?redirect=/dashboard/calculators/steel-weight"],
  ["BOQ Generator", "/boq-generator"],
  ["Home Construction Cost Calculator", "/home-construction-cost-calculator"],
];

export default function DevelopmentLengthArticlePage() {
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
    headline: "Development Length Calculator for RCC Bars",
    description:
      "Complete guide to RCC development length, anchorage length formula, bond stress, bar diameter and step-by-step calculation.",
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
      "@id": "https://civilcalcpro.in/development-length-calculation",
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
        name: "Development Length Calculation",
        item: "https://civilcalcpro.in/development-length-calculation",
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
          Development Length Calculator for RCC Bars
        </h1>

        <p className="text-slate-300 text-lg mt-6 leading-8 max-w-4xl">
          Development length is one of the most important reinforcement detailing
          calculations in RCC work. It helps engineers calculate how much length
          of steel bar must be embedded in concrete for proper anchorage and safe
          load transfer.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Link
            href="/login?redirect=/dashboard/calculators/development-length"
            className="bg-orange-500 hover:bg-orange-600 transition px-6 py-4 rounded-xl font-black text-center"
          >
            Open Development Length Calculator
          </Link>

          <Link
            href="/login?redirect=/dashboard/calculators/lap-length"
            className="border border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white transition px-6 py-4 rounded-xl font-black text-center"
          >
            Open Lap Length Calculator
          </Link>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 md:px-6 pb-20 space-y-8">
        <section className="rounded-3xl border border-orange-500/30 bg-orange-500/5 p-6 md:p-8">
          <p className="text-orange-400 font-black mb-3">QUICK ANSWER</p>

          <h2 className="text-2xl md:text-3xl font-black mb-5">
            What is Development Length?
          </h2>

          <p className="text-slate-300 leading-8 mb-5">
            Development length is the minimum embedded length required for a
            reinforcement bar inside concrete so that the bar can safely develop
            its design stress without slipping. In simple words, it is the
            anchorage length needed to hold the steel bar properly inside RCC.
          </p>

          <FormulaBox>Ld = φ × σs / 4τbd</FormulaBox>

          <p className="text-slate-300 leading-8 mt-5">
            Where Ld is development length, φ is bar diameter, σs is steel stress
            and τbd is design bond stress.
          </p>
        </section>

        <ArticleCard title="Why Development Length is Important">
          Development length is important because RCC members transfer force
          between steel and concrete through bond. If the bar does not have
          enough anchorage length, the reinforcement may slip before reaching its
          full strength. This can affect beams, columns, slabs, footings and
          other RCC members.
        </ArticleCard>

        <ArticleCard title="Development Length Formula Explanation">
          <p className="mb-4">
            The standard development length formula is:
          </p>

          <FormulaBox>Ld = φ × σs / 4τbd</FormulaBox>

          <div className="grid sm:grid-cols-2 gap-4 mt-6">
            <MiniBox label="Ld" value="Development length" />
            <MiniBox label="φ" value="Bar diameter" />
            <MiniBox label="σs" value="0.87 × fy" />
            <MiniBox label="τbd" value="Design bond stress" />
          </div>
        </ArticleCard>

        <ArticleCard title="Design Bond Stress Values">
          <p className="text-slate-300 leading-8 mb-6">
            Bond stress depends on concrete grade. Higher concrete grade usually
            gives better bond between steel and concrete.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full border border-slate-800 text-left">
              <thead className="bg-slate-900">
                <tr>
                  <TableHead>Concrete Grade</TableHead>
                  <TableHead>Design Bond Stress</TableHead>
                </tr>
              </thead>
              <tbody>
                {bondStressRows.map(([grade, stress]) => (
                  <tr key={grade}>
                    <TableCell strong>{grade}</TableCell>
                    <TableCell>{stress}</TableCell>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-slate-400 text-sm mt-4">
            Note: Deformed bars and compression condition may use increased bond
            stress as per detailing practice.
          </p>
        </ArticleCard>

        <ArticleCard title="How to Calculate Development Length Step by Step">
          <ol className="list-decimal pl-6 space-y-3 text-slate-300 leading-7">
            <li>Select bar diameter, for example 12 mm, 16 mm or 20 mm.</li>
            <li>Select steel grade such as Fe415 or Fe500.</li>
            <li>Select concrete grade such as M20, M25 or M30.</li>
            <li>Calculate steel stress using σs = 0.87 × fy.</li>
            <li>Find design bond stress according to concrete grade.</li>
            <li>Apply formula Ld = φ × σs / 4τbd.</li>
            <li>Round the final result to a practical site length.</li>
          </ol>
        </ArticleCard>

        <ArticleCard title="Development Length Example">
          <p className="text-slate-300 leading-8 mb-5">
            Suppose bar diameter is 12 mm, steel grade is Fe415 and concrete
            grade is M20.
          </p>

          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 text-slate-300 leading-8">
            <p>Bar diameter = 12 mm</p>
            <p>Steel grade = Fe415</p>
            <p>Steel stress = 0.87 × 415 = 361.05 N/mm²</p>
            <p>Bond stress for M20 = 1.2 N/mm²</p>
            <p>For deformed bars, bond stress = 1.2 × 1.6 = 1.92 N/mm²</p>
            <p>Ld = 12 × 361.05 / 4 × 1.92</p>
            <p className="text-orange-400 font-black mt-3">
              Development Length ≈ 564 mm
            </p>
          </div>
        </ArticleCard>

        <ArticleCard title="Common Development Length Results">
          <div className="overflow-x-auto">
            <table className="w-full border border-slate-800 text-left">
              <thead className="bg-slate-900">
                <tr>
                  <TableHead>Bar Diameter</TableHead>
                  <TableHead>Steel Grade</TableHead>
                  <TableHead>Concrete Grade</TableHead>
                  <TableHead>Condition</TableHead>
                  <TableHead>Approx. Ld</TableHead>
                </tr>
              </thead>
              <tbody>
                {examples.map((row) => (
                  <tr key={row.join("-")}>
                    {row.map((cell, index) => (
                      <TableCell key={cell} strong={index === 0}>
                        {cell}
                      </TableCell>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ArticleCard>

        <ArticleCard title="Development Length in Beam">
          In beams, development length is required near supports, critical
          sections and anchorage zones. Bottom bars, top bars and extra bars must
          be developed properly as per reinforcement detailing. Insufficient
          development length in beams can reduce anchorage safety.
        </ArticleCard>

        <ArticleCard title="Development Length in Column">
          In columns, development length is important for vertical bars,
          footing-column dowels and beam-column joint regions. Column bars must
          have proper anchorage and continuation as per structural drawings.
        </ArticleCard>

        <ArticleCard title="Development Length in Slab and Footing">
          In slabs, reinforcement must be anchored properly into beams, walls or
          supports. In footings, column dowels and footing reinforcement need
          proper development length to transfer load safely from column to
          footing.
        </ArticleCard>

        <ArticleCard title="Development Length vs Lap Length">
          Development length and lap length are related but different
          calculations. Development length is required for anchorage of a bar
          into concrete, while lap length is required when two bars are overlapped
          or spliced together.
        </ArticleCard>

        <ArticleCard title="How CivilCalc Pro Helps">
          CivilCalc Pro provides a dedicated Development Length Calculator where
          users can select bar diameter, steel grade, concrete grade, bar type,
          stress condition and member type. The tool gives Ld in mm, meter, bar
          diameter multiple, recommended site length, formula, step-by-step
          calculation and PDF report.
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
            href="/login?redirect=/dashboard/calculators/development-length"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white transition px-8 py-4 rounded-xl font-black"
          >
            Calculate Development Length Now
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
