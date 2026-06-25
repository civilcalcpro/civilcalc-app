import Link from "next/link";

export const metadata = {
  title:
    "BOQ Generator for Civil Engineering | Bill of Quantities Calculator | CivilCalc Pro",
  description:
    "Create BOQ for construction projects with item-wise quantity, unit, rate, amount, material summary, cost estimate, PDF report and Excel-style BOQ format using CivilCalc Pro.",
  keywords: [
    "BOQ Generator",
    "BOQ Calculator",
    "Bill of Quantities",
    "Bill of Quantities generator",
    "BOQ format",
    "BOQ format for building construction",
    "Civil engineering BOQ",
    "Construction BOQ",
    "Building BOQ",
    "Quantity estimation",
    "Construction estimate calculator",
    "BOQ PDF report",
    "BOQ Excel format",
    "BOQ for civil work",
    "BOQ for building construction",
    "Earthwork BOQ",
    "RCC BOQ",
    "Brickwork BOQ",
    "Plaster BOQ",
    "Flooring BOQ",
    "CivilCalc Pro",
  ],
  alternates: {
    canonical: "https://civilcalcpro.in/boq-generator",
  },
  openGraph: {
    title: "BOQ Generator for Civil Engineering | CivilCalc Pro",
    description:
      "Learn how to prepare BOQ for construction projects with item-wise quantity, rate, amount, material summary and PDF report.",
    url: "https://civilcalcpro.in/boq-generator",
    siteName: "CivilCalc Pro",
    type: "article",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "BOQ Generator for Civil Engineering | CivilCalc Pro",
    description:
      "Prepare Bill of Quantities for construction with quantity, rate, amount, material summary and PDF report.",
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

const boqFormatRows = [
  ["Item No.", "Serial number of BOQ item", "1, 2, 3"],
  ["Category", "Work category or trade", "Earthwork, RCC, Brickwork"],
  ["Description", "Detailed item description", "RCC M20 concrete in beam"],
  ["Unit", "Measurement unit", "m3, m2, kg, nos"],
  ["Quantity", "Calculated work quantity", "12.50 m3"],
  ["Rate", "Unit rate of item", "Rs. 6500 / m3"],
  ["Amount", "Quantity multiplied by rate", "Rs. 81,250"],
];

const boqCategories = [
  {
    title: "Earthwork BOQ",
    text:
      "Earthwork BOQ includes excavation, backfilling, soil disposal, dressing and compaction. Quantity is usually measured in cubic meter based on length, width and depth.",
  },
  {
    title: "PCC BOQ",
    text:
      "PCC BOQ includes plain cement concrete below footing, flooring base and leveling work. Quantity is calculated in cubic meter using length, breadth and thickness.",
  },
  {
    title: "RCC BOQ",
    text:
      "RCC BOQ includes footing, column, beam, slab, staircase and other reinforced concrete members. It may include concrete volume, reinforcement steel and shuttering/formwork details.",
  },
  {
    title: "Brickwork BOQ",
    text:
      "Brickwork BOQ includes wall masonry, partition wall, half-brick wall and full-brick wall. Quantity can be measured in cubic meter or square meter depending on wall thickness.",
  },
  {
    title: "Plaster BOQ",
    text:
      "Plaster BOQ includes internal plaster, external plaster, ceiling plaster and different plaster thicknesses. Quantity is usually measured in square meter.",
  },
  {
    title: "Flooring BOQ",
    text:
      "Flooring BOQ includes tiles, stone, bedding mortar, skirting and finishing. Quantity is measured in square meter with wastage consideration.",
  },
];

const exampleBoqRows = [
  ["1", "Earthwork", "Excavation for foundation", "m3", "18.00", "Rs. 250", "Rs. 4,500"],
  ["2", "PCC", "PCC 1:4:8 below footing", "m3", "3.50", "Rs. 5,500", "Rs. 19,250"],
  ["3", "RCC", "RCC M20 for footing, beam and slab", "m3", "12.00", "Rs. 7,500", "Rs. 90,000"],
  ["4", "Steel", "Reinforcement steel Fe500", "kg", "850", "Rs. 65", "Rs. 55,250"],
  ["5", "Brickwork", "230 mm brick masonry wall", "m3", "8.00", "Rs. 6,000", "Rs. 48,000"],
  ["6", "Plaster", "12 mm internal plaster", "m2", "250", "Rs. 180", "Rs. 45,000"],
  ["7", "Flooring", "Tile flooring work", "m2", "90", "Rs. 850", "Rs. 76,500"],
];

const benefits = [
  "Helps prepare accurate construction cost estimates",
  "Makes quantity estimation organized and professional",
  "Useful for contractor quotation and tendering",
  "Helps compare rates from different contractors",
  "Supports material planning and procurement",
  "Improves billing, measurement and project tracking",
  "Reduces manual spreadsheet errors",
  "Creates professional PDF reports for client submission",
];

const faqs = [
  {
    q: "What is BOQ in civil engineering?",
    a:
      "BOQ stands for Bill of Quantities. It is a detailed document that lists construction work items, units, quantities, rates and amounts required for a project.",
  },
  {
    q: "How do I prepare a BOQ for building construction?",
    a:
      "To prepare a BOQ, divide the project into work categories, add item descriptions, calculate quantities, enter units and rates, and calculate amount for each item.",
  },
  {
    q: "What are the main items in a building BOQ?",
    a:
      "Common BOQ items include earthwork, PCC, RCC, reinforcement steel, shuttering, brickwork, plaster, flooring, painting, doors, windows, electrical and plumbing work.",
  },
  {
    q: "Can BOQ be generated automatically?",
    a:
      "Yes, a BOQ generator can calculate quantities and amounts based on user inputs. CivilCalc Pro helps create BOQ with project details, item-wise quantities, material summary and PDF report.",
  },
  {
    q: "Is BOQ useful for contractors?",
    a:
      "Yes, BOQ is useful for contractors because it helps prepare quotations, calculate material requirement, estimate labour cost and track project billing.",
  },
  {
    q: "Does CivilCalc Pro provide BOQ PDF report?",
    a:
      "Yes. CivilCalc Pro can generate a professional BOQ report with item details, quantity, rate, amount, cost summary and material summary.",
  },
];

const relatedTools = [
  ["BOQ Generator", "/login?redirect=/dashboard/calculators/boq-generator"],
  ["Home Construction Cost Calculator", "/home-construction-cost-calculator"],
  ["Bar Bending Schedule Guide", "/bar-bending-schedule-guide"],
  ["Steel Weight Calculator", "/steel-weight-calculator"],
  ["Concrete Calculator", "/concrete-calculator"],
  ["Brickwork Calculator", "/brickwork-calculator"],
  ["Plaster Calculator", "/plaster-calculator"],
  ["Flooring Calculator", "/flooring-calculator"],
];

export default function BOQGeneratorPage() {
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
    headline: "BOQ Generator for Civil Engineering",
    description:
      "Complete guide to Bill of Quantities, BOQ format, construction quantity estimation, BOQ items, material summary and PDF report.",
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
      "@id": "https://civilcalcpro.in/boq-generator",
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
        name: "BOQ Generator",
        item: "https://civilcalcpro.in/boq-generator",
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
          BOQ ESTIMATION GUIDE
        </p>

        <h1 className="text-4xl md:text-6xl font-black mt-4 leading-tight">
          BOQ Generator for Civil Engineering
        </h1>

        <p className="text-slate-300 text-lg mt-6 leading-8 max-w-4xl">
          Learn how to prepare a professional Bill of Quantities for construction
          projects with item-wise quantity, unit, rate, amount, material summary,
          cost estimate, BOQ format and PDF report using CivilCalc Pro.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Link
            href="/login?redirect=/dashboard/calculators/boq-generator"
            className="bg-orange-500 hover:bg-orange-600 transition px-6 py-4 rounded-xl font-black text-center"
          >
            Open BOQ Generator
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
            What is BOQ in Civil Engineering?
          </h2>

          <p className="text-slate-300 leading-8 mb-5">
            BOQ means Bill of Quantities. It is a detailed construction document
            that lists all work items, descriptions, units, quantities, rates and
            amounts required for a project. A BOQ helps engineers, contractors
            and clients understand the complete project cost before construction
            starts.
          </p>

          <FormulaBox>
            BOQ Amount = Quantity × Rate
          </FormulaBox>

          <p className="text-slate-300 leading-8 mt-5">
            Example: If RCC concrete quantity is 12 m3 and rate is Rs. 7,500 per
            m3, then BOQ amount is 12 × 7,500 = Rs. 90,000.
          </p>
        </section>

        <ArticleCard title="What is a Bill of Quantities?">
          Bill of Quantities is a structured estimate document used in civil
          engineering and construction projects. It breaks the project into
          measurable work items such as excavation, PCC, RCC, brickwork,
          plaster, flooring, painting, electrical and plumbing. Each item has a
          description, unit, quantity, rate and amount.
        </ArticleCard>

        <ArticleCard title="Why BOQ is Important in Construction">
          BOQ is important because it creates a common document for client,
          engineer and contractor. It helps in tendering, quotation comparison,
          cost control, material planning, billing and project tracking. Without
          a clear BOQ, project cost can become confusing and disputes may occur
          during execution.
        </ArticleCard>

        <ArticleCard title="Standard BOQ Format for Building Construction">
          <div className="overflow-x-auto">
            <table className="w-full border border-slate-800 text-left">
              <thead className="bg-slate-900">
                <tr>
                  <TableHead>BOQ Column</TableHead>
                  <TableHead>Meaning</TableHead>
                  <TableHead>Example</TableHead>
                </tr>
              </thead>

              <tbody className="text-slate-300">
                {boqFormatRows.map(([field, meaning, example]) => (
                  <tr key={field}>
                    <TableCell strong>{field}</TableCell>
                    <TableCell>{meaning}</TableCell>
                    <TableCell>{example}</TableCell>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ArticleCard>

        <ArticleCard title="How to Prepare BOQ Step by Step">
          <ul className="list-disc pl-6 space-y-3 text-slate-300 leading-7">
            <li>Read architectural and structural drawings carefully.</li>
            <li>Divide the project into work categories like earthwork, PCC, RCC and brickwork.</li>
            <li>Write item descriptions clearly with specification and grade.</li>
            <li>Select the correct unit such as m3, m2, kg, meter or nos.</li>
            <li>Calculate quantity from drawing dimensions.</li>
            <li>Enter current market rate or contractor rate for each item.</li>
            <li>Calculate item amount using quantity multiplied by rate.</li>
            <li>Add material summary for cement, steel, sand, aggregate and bricks.</li>
            <li>Prepare final BOQ report for client, tender or site execution.</li>
          </ul>
        </ArticleCard>

        <section className="grid md:grid-cols-2 gap-6">
          {boqCategories.map((item) => (
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

        <ArticleCard title="Example BOQ for Building Construction">
          <p className="text-slate-300 leading-8 mb-6">
            Below is a simple BOQ example for a small building project. Actual
            BOQ values depend on project drawings, site conditions, material
            specifications and local rates.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full border border-slate-800 text-left">
              <thead className="bg-slate-900">
                <tr>
                  <TableHead>No.</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead>Amount</TableHead>
                </tr>
              </thead>

              <tbody className="text-slate-300">
                {exampleBoqRows.map((row) => (
                  <tr key={row[0]}>
                    {row.map((cell, index) => (
                      <TableCell key={`${row[0]}-${index}`} strong={index === 1}>
                        {cell}
                      </TableCell>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ArticleCard>

        <ArticleCard title="BOQ Items Included in Civil Construction">
          <p className="text-slate-300 leading-8">
            A good construction BOQ should include both structural and finishing
            work. Common items include earthwork, PCC, RCC, reinforcement steel,
            shuttering, brickwork, blockwork, plaster, flooring, skirting,
            waterproofing, painting, doors, windows, electrical, plumbing and
            finishing work.
          </p>
        </ArticleCard>

        <ArticleCard title="Material Summary in BOQ">
          BOQ should not only show cost; it should also help with material
          planning. A professional BOQ can include cement bags, steel quantity,
          sand, aggregate, bricks, tiles, paint, shuttering plywood, timber,
          nails, form oil and props. This helps site engineers and contractors
          plan procurement before work starts.
        </ArticleCard>

        <ArticleCard title="BOQ PDF Report and Excel Format">
          A BOQ report should be easy to share with clients, contractors and site
          teams. A professional BOQ PDF should include project details, item-wise
          cost, category-wise summary, material summary, grand total and notes.
          Excel-style BOQ format is useful for editing rates, comparing
          contractors and maintaining project records.
        </ArticleCard>

        <ArticleCard title="How CivilCalc Pro BOQ Generator Helps">
          CivilCalc Pro BOQ Generator helps users create project details, add BOQ
          items, select categories, calculate quantities, generate cost summary,
          prepare material summary and export professional reports. It is useful
          for civil engineers, contractors, site engineers, quantity surveyors
          and construction students.
          <div className="grid sm:grid-cols-2 gap-4 mt-6">
            <MiniBox label="Input" value="Project + BOQ items + rates" />
            <MiniBox label="Output" value="Quantity + amount + total" />
            <MiniBox label="Reports" value="PDF / BOQ summary" />
            <MiniBox label="Useful For" value="Engineers + contractors" />
          </div>
        </ArticleCard>

        <ArticleCard title="Future: Contractor and Construction Company Connect">
          In the future, CivilCalc Pro can help users calculate BOQ and then
          connect with construction companies, contractors, engineers and
          material suppliers available in their area. This can help users move
          from estimate to execution faster.
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

        <div className="mt-10 text-center">
          <Link
            href="/login?redirect=/dashboard/calculators/boq-generator"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white transition px-8 py-4 rounded-xl font-black"
          >
            Start BOQ Calculation
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
      className={`border border-slate-800 p-3 ${
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
