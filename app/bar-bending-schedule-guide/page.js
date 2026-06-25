import Link from "next/link";

export const metadata = {
  title: "Bar Bending Schedule Guide | BBS Calculator & Formula | CivilCalc Pro",
  description:
    "Learn Bar Bending Schedule calculation for beam, column, slab, footing and staircase. Understand BBS format, cutting length formula, bend deduction, hook length, steel weight and PDF report.",
  keywords: [
    "BBS calculator",
    "Bar Bending Schedule",
    "BBS generator",
    "Bar bending schedule calculator",
    "BBS formula",
    "Cutting length formula",
    "Steel weight calculator",
    "BBS for beam",
    "BBS for column",
    "BBS for slab",
    "BBS for footing",
    "Reinforcement calculator",
    "Civil engineering calculator",
  ],
  alternates: {
    canonical: "https://civilcalcpro.in/bar-bending-schedule-guide",
  },
  openGraph: {
    title: "Bar Bending Schedule Guide | BBS Calculator & Formula",
    description:
      "Complete BBS guide for civil engineers with formula, format, examples, beam BBS, column BBS, slab BBS, footing BBS and staircase BBS.",
    url: "https://civilcalcpro.in/bar-bending-schedule-guide",
    siteName: "CivilCalc Pro",
    type: "article",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bar Bending Schedule Guide | BBS Calculator & Formula",
    description:
      "Learn BBS calculation, cutting length, bend deduction, hook length and steel weight for RCC construction.",
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

const bbsFields = [
  ["Bar Mark", "Identification code for each bar type", "B1, B2, C1"],
  ["Member", "Structural member where bar is used", "Beam, Column, Slab"],
  ["Diameter", "Reinforcement bar diameter", "8 mm, 10 mm, 12 mm, 16 mm"],
  ["Shape", "Bar shape or bending pattern", "Straight, Bent-up, Stirrup"],
  ["No. of Bars", "Total number of bars required", "6 bars"],
  ["Cutting Length", "Final length after bends and hooks", "4.25 m"],
  ["Total Length", "Cutting length multiplied by quantity", "25.5 m"],
  ["Steel Weight", "Total reinforcement weight", "22.67 kg"],
];

const bbsSteps = [
  "Read the structural drawing and reinforcement details carefully.",
  "Identify the RCC member such as beam, column, slab, footing or staircase.",
  "Note bar diameter, spacing, cover, hooks, bends and member dimensions.",
  "Calculate number of bars required for each bar mark.",
  "Calculate cutting length for every bar type.",
  "Apply bend deduction and hook length wherever required.",
  "Calculate total length of each bar mark.",
  "Calculate unit weight using D²/162 formula.",
  "Prepare final BBS table with bar mark, diameter, quantity, length and weight.",
  "Use the final BBS for steel procurement, site cutting, billing and BOQ.",
];

const memberGuides = [
  {
    title: "BBS for Beam",
    text:
      "Beam BBS usually includes main bottom bars, top bars, extra bars near supports, stirrups and side-face reinforcement if required. Stirrups are calculated based on beam length, spacing and hook length.",
  },
  {
    title: "BBS for Column",
    text:
      "Column BBS includes longitudinal bars, lateral ties, lap length, development length and tie spacing. Column reinforcement should follow structural drawings and code requirements.",
  },
  {
    title: "BBS for Slab",
    text:
      "Slab BBS includes main bars, distribution bars, extra top bars and crank bars if provided. One-way slab and two-way slab reinforcement detailing are different.",
  },
  {
    title: "BBS for Footing",
    text:
      "Footing BBS includes bottom reinforcement in both directions, dowel bars, development length and cover. Footing steel quantity depends on footing size and spacing of bars.",
  },
  {
    title: "BBS for Staircase",
    text:
      "Staircase BBS includes waist slab reinforcement, distribution bars, landing bars and extra reinforcement near supports. Staircase reinforcement is important for safe load transfer.",
  },
];

const benefits = [
  "Reduces reinforcement steel wastage",
  "Improves steel quantity estimation",
  "Helps in bar cutting and bending work",
  "Supports contractor billing and site checking",
  "Improves BOQ and material planning accuracy",
  "Helps site engineers verify reinforcement before concreting",
  "Saves time during procurement and execution",
];

const relatedTools = [
  ["BBS Generator", "/login?redirect=/dashboard/calculators/bbs-generator"],
  ["Steel Weight Calculator", "/steel-weight-calculator"],
  ["RCC Beam Design Calculator", "/beam-design"],
  ["Column Design Calculator", "/column-design"],
  ["Slab Design Calculator", "/slab-design"],
  ["Footing Design Calculator", "/footing-design"],
  ["BOQ Generator", "/login?redirect=/dashboard/calculators/boq-generator"],
];

export default function BarBendingScheduleGuidePage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is Bar Bending Schedule?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Bar Bending Schedule, also called BBS, is a reinforcement schedule used in RCC construction. It lists bar mark, diameter, shape, cutting length, number of bars and total steel weight required for structural members.",
        },
      },
      {
        "@type": "Question",
        name: "Why is BBS important in construction?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "BBS is important because it helps calculate reinforcement quantity, reduce steel wastage, plan cutting and bending work, prepare estimates, manage site reinforcement and improve construction accuracy.",
        },
      },
      {
        "@type": "Question",
        name: "What is the steel weight formula in BBS?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Steel weight is commonly calculated using D squared divided by 162 multiplied by total length. Here D is bar diameter in millimeters and length is in meters.",
        },
      },
      {
        "@type": "Question",
        name: "Which details are included in a BBS table?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "A BBS table usually includes bar mark, member name, bar diameter, number of bars, shape, cutting length, total length, unit weight and total steel weight.",
        },
      },
      {
        "@type": "Question",
        name: "Can BBS be prepared for beam, column, slab and footing?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Yes, BBS can be prepared for beams, columns, slabs, footings, staircases and other RCC members based on structural drawing and reinforcement detailing.",
        },
      },
    ],
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Bar Bending Schedule Guide",
    description:
      "Complete guide to Bar Bending Schedule calculation, BBS format, cutting length formula, steel weight and reinforcement detailing.",
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
      "@id": "https://civilcalcpro.in/bar-bending-schedule-guide",
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
        name: "Bar Bending Schedule Guide",
        item: "https://civilcalcpro.in/bar-bending-schedule-guide",
      },
    ],
  };

  return (
    <main className="min-h-screen bg-[#050B1F] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      <section className="max-w-5xl mx-auto px-4 md:px-6 pt-16 pb-10">
        <p className="text-orange-400 font-black text-sm tracking-wide">
          RCC STEEL DETAILING GUIDE
        </p>

        <h1 className="text-4xl md:text-6xl font-black mt-4 leading-tight">
          Bar Bending Schedule Guide
        </h1>

        <p className="text-slate-300 text-lg mt-6 leading-8 max-w-4xl">
          Learn Bar Bending Schedule calculation for RCC structures with BBS
          format, cutting length, bend deduction, hook length, steel quantity,
          reinforcement detailing and practical examples for beams, columns,
          slabs, footings and staircases.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Link
            href="/login?redirect=/dashboard/calculators/bbs-generator"
            className="bg-orange-500 hover:bg-orange-600 transition px-6 py-4 rounded-xl font-black text-center"
          >
            Open BBS Generator
          </Link>

          <Link
            href="/civil-engineering-calculators"
            className="border border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white transition px-6 py-4 rounded-xl font-black text-center"
          >
            View All Calculators
          </Link>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 md:px-6 pb-20 space-y-8">
        <section className="rounded-3xl border border-orange-500/30 bg-orange-500/5 p-6 md:p-8">
          <p className="text-orange-400 font-black mb-3">QUICK ANSWER</p>

          <h2 className="text-2xl md:text-3xl font-black mb-5">
            What is a Bar Bending Schedule?
          </h2>

          <p className="text-slate-300 leading-8 mb-4">
            Bar Bending Schedule, also called BBS, is a detailed reinforcement
            schedule used in RCC construction. It shows bar mark, bar diameter,
            shape, number of bars, cutting length, total length and total steel
            weight required for beams, columns, slabs, footings, staircases and
            other RCC members.
          </p>

          <p className="text-slate-300 leading-8">
            BBS helps civil engineers, site engineers, bar benders and
            contractors reduce steel wastage, plan reinforcement cutting,
            prepare steel quantity estimates and manage site work more
            accurately.
          </p>

          <div className="overflow-x-auto mt-8">
            <table className="w-full border border-slate-800 text-left">
              <thead className="bg-slate-900">
                <tr>
                  <TableHead>BBS Field</TableHead>
                  <TableHead>Meaning</TableHead>
                  <TableHead>Example</TableHead>
                </tr>
              </thead>

              <tbody className="text-slate-300">
                {bbsFields.map(([field, meaning, example]) => (
                  <tr key={field}>
                    <TableCell strong>{field}</TableCell>
                    <TableCell>{meaning}</TableCell>
                    <TableCell>{example}</TableCell>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <ArticleCard title="What is Bar Bending Schedule in Civil Engineering?">
          Bar Bending Schedule is a tabular reinforcement document used to
          calculate, organize and communicate steel requirements for RCC work. It
          is prepared from structural drawings and reinforcement details. A good
          BBS helps site teams understand which bar is required, where it should
          be placed, how long it should be cut and how much steel will be used.
        </ArticleCard>

        <ArticleCard title="Bar Bending Schedule Formula">
          <FormulaBox>Steel Weight = D² / 162 × Length</FormulaBox>

          <p className="text-slate-300 mt-4 leading-8">
            Here, D is the diameter of the reinforcement bar in mm and length is
            measured in meters. This formula gives approximate reinforcement
            steel weight in kg. For example, 12 mm bar has unit weight of
            12²/162 = 0.89 kg/m.
          </p>
        </ArticleCard>

        <ArticleCard title="Cutting Length Formula">
          <FormulaBox>Cutting Length = Total Length + Hook Length - Bend Deduction</FormulaBox>

          <p className="text-slate-300 mt-4 leading-8">
            Cutting length depends on member dimensions, clear cover, bar shape,
            hooks, bends and development length. For stirrups and bent-up bars,
            bend deduction and hook length should be carefully considered.
          </p>
        </ArticleCard>

        <ArticleCard title="Standard BBS Format">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-slate-300">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="py-3 pr-4 text-white">Column</th>
                  <th className="py-3 pr-4 text-white">Description</th>
                </tr>
              </thead>

              <tbody>
                {[
                  ["Bar Mark", "Identification number of reinforcement bar"],
                  ["Member", "Beam, column, slab, footing or staircase"],
                  ["Diameter", "Bar diameter such as 8mm, 10mm, 12mm, 16mm"],
                  ["Shape", "Straight bar, bent bar, stirrup or hook bar"],
                  ["No. of Bars", "Total number of bars required"],
                  ["Cutting Length", "Final length after bend deduction and hooks"],
                  ["Total Length", "Cutting length multiplied by number of bars"],
                  ["Unit Weight", "Weight of bar per meter"],
                  ["Total Weight", "Total steel quantity in kg"],
                ].map(([col, desc]) => (
                  <tr key={col} className="border-b border-slate-800">
                    <td className="py-3 pr-4 font-bold text-white">{col}</td>
                    <td className="py-3 pr-4">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ArticleCard>

        <ArticleCard title="Steps to Prepare Bar Bending Schedule">
          <ul className="list-disc pl-6 space-y-3 text-slate-300 leading-7">
            {bbsSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ul>
        </ArticleCard>

        <section className="grid md:grid-cols-2 gap-6">
          {memberGuides.map((item) => (
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

        <ArticleCard title="BBS Calculation Example">
          <p className="text-slate-300 leading-8">
            Consider 10 bars of 12 mm diameter and 5 m cutting length each.
          </p>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 mt-5 text-slate-300 leading-8">
            Unit Weight = D² / 162
            <br />
            Unit Weight = 12² / 162
            <br />
            Unit Weight = 0.89 kg/m
            <br />
            <br />
            Total Length = 10 × 5 = 50 m
            <br />
            Total Steel Weight = 0.89 × 50 = 44.5 kg
          </div>
        </ArticleCard>

        <ArticleCard title="Bend Deduction and Hook Length in BBS">
          <p className="text-slate-300 leading-8">
            Bend deduction is used because the bar length changes when steel is
            bent. Hook length is added where hooks are provided at the ends of
            bars or stirrups. These values depend on bar diameter, bend angle and
            reinforcement detailing practice.
          </p>

          <div className="grid sm:grid-cols-3 gap-4 mt-5">
            <MiniBox label="45° Bend" value="Approx. 1D deduction" />
            <MiniBox label="90° Bend" value="Approx. 2D deduction" />
            <MiniBox label="135° Bend" value="Approx. 3D deduction" />
          </div>

          <p className="text-xs text-slate-500 mt-4">
            Note: Always verify bend deductions and detailing requirements with
            applicable design codes and project drawings.
          </p>
        </ArticleCard>

        <ArticleCard title="Benefits of Bar Bending Schedule">
          <ul className="list-disc pl-6 space-y-3 text-slate-300 leading-7">
            {benefits.map((benefit) => (
              <li key={benefit}>{benefit}</li>
            ))}
          </ul>
        </ArticleCard>

        <ArticleCard title="How CivilCalc Pro BBS Generator Helps">
          <p className="text-slate-300 leading-8">
            CivilCalc Pro BBS Generator helps engineers calculate bar quantities,
            cutting length, total length and steel weight faster. It is useful
            for preparing reinforcement estimates, site steel planning,
            contractor billing, PDF reports and BOQ support.
          </p>

          <div className="grid sm:grid-cols-2 gap-4 mt-6">
            <MiniBox label="Members" value="Beam, Column, Slab, Footing" />
            <MiniBox label="Output" value="Cutting Length + Steel Weight" />
            <MiniBox label="Use Case" value="Site + Estimation + BOQ" />
            <MiniBox label="Report" value="PDF / Quantity Summary" />
          </div>
        </ArticleCard>

        <ArticleCard title="Related Civil Engineering Tools">
          <div className="grid sm:grid-cols-2 gap-3">
            {relatedTools.map(([label, href]) => (
              <Link
                key={label}
                href={href}
                className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-300 hover:border-orange-500 hover:text-orange-400 transition"
              >
                {label}
              </Link>
            ))}
          </div>
        </ArticleCard>

        <FAQSection />

        <div className="mt-10 text-center">
          <Link
            href="/login?redirect=/dashboard/calculators/bbs-generator"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white transition px-8 py-4 rounded-xl font-black"
          >
            Start BBS Calculation
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
      className={`border border-slate-800 p-3 ${
        strong ? "font-bold text-white" : ""
      }`}
    >
      {children}
    </td>
  );
}

function FAQSection() {
  const faqs = [
    {
      q: "What is BBS in civil engineering?",
      a:
        "BBS means Bar Bending Schedule. It is a reinforcement schedule that shows bar mark, diameter, cutting length, number of bars and steel weight for RCC members.",
    },
    {
      q: "What is the formula for steel weight?",
      a:
        "The common formula is D²/162 × Length, where D is bar diameter in mm and length is in meters.",
    },
    {
      q: "Why is cutting length important?",
      a:
        "Cutting length is important because bars must be cut to correct length before bending and placing at site. Wrong cutting length can cause steel wastage and site errors.",
    },
    {
      q: "Can BBS be used for BOQ?",
      a:
        "Yes. BBS gives steel quantity, which can be used in BOQ, material planning, contractor billing and cost estimation.",
    },
    {
      q: "Does CivilCalc Pro provide BBS calculation?",
      a:
        "Yes. CivilCalc Pro provides a BBS Generator to calculate reinforcement quantity, cutting length and steel weight for civil engineering work.",
    },
  ];

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
