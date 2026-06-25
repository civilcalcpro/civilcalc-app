import Link from "next/link";

export const metadata = {
  title:
    "Home Construction Cost Calculator in India | House Building Estimate | CivilCalc Pro",
  description:
    "Calculate home construction cost in India with built-up area, floors, material quantity, staircase, shuttering, BOQ, hidden costs and PDF report using CivilCalc Pro.",
  keywords: [
    "home construction cost calculator",
    "house construction cost calculator",
    "construction cost per sq ft in India",
    "building cost calculator India",
    "house building estimate",
    "home building cost calculator",
    "900 sq ft house construction cost",
    "1200 sq ft house construction cost",
    "construction material calculator",
    "cement steel sand brick calculator",
    "home construction BOQ",
    "staircase cost calculator",
    "shuttering material calculator",
    "civil engineering calculator",
    "CivilCalc Pro",
  ],
  alternates: {
    canonical: "https://civilcalcpro.in/home-construction-cost-calculator",
  },
  openGraph: {
    title:
      "Home Construction Cost Calculator in India | House Building Estimate",
    description:
      "Estimate house construction cost, material quantity, BOQ, staircase, shuttering, hidden costs and PDF report with CivilCalc Pro.",
    url: "https://civilcalcpro.in/home-construction-cost-calculator",
    siteName: "CivilCalc Pro",
    type: "article",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Home Construction Cost Calculator in India | CivilCalc Pro",
    description:
      "Calculate house construction cost with area, floors, materials, staircase, shuttering, BOQ and PDF report.",
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

const costBreakdownRows = [
  ["Excavation", "Site cutting, soil removal and excavation work", "3% to 5%"],
  ["Foundation", "Footing, PCC, RCC and foundation work", "10% to 15%"],
  ["RCC Work", "Beams, columns, slabs and structural concrete", "20% to 25%"],
  ["Brickwork", "Wall construction using bricks or blocks", "8% to 12%"],
  ["Plaster", "Internal and external plastering work", "7% to 10%"],
  ["Flooring", "Tiles, stone, bedding and finishing", "8% to 12%"],
  ["Doors and Windows", "Frames, shutters, windows and fittings", "7% to 10%"],
  ["Electrical", "Wiring, switches, DB, conduits and fittings", "5% to 8%"],
  ["Plumbing", "Water supply, drainage, pipes and sanitary lines", "5% to 8%"],
  ["Painting", "Primer, putty and paint work", "4% to 6%"],
  ["Finishing", "Final finishing, cleaning and minor works", "5% to 8%"],
];

const materialRows = [
  ["Cement", "Bags", "Used in RCC, PCC, brickwork and plaster"],
  ["Steel", "Kg", "Used in footing, columns, beams, slabs and staircase"],
  ["Sand", "Cft", "Used in concrete, mortar and plaster"],
  ["Aggregate", "Cft", "Used in RCC, PCC and concrete work"],
  ["Bricks / Blocks", "Nos", "Used for wall construction"],
  ["Plywood Sheets", "Sheets", "Used for shuttering and formwork"],
  ["Timber / Battens", "Cft", "Used to support shuttering"],
  ["Nails", "Kg", "Used for fixing formwork"],
  ["Form Oil", "Litre", "Used to release shuttering from concrete"],
  ["Props / Supports", "Nos", "Used below slab and beam formwork"],
];

const exampleRows = [
  {
    area: "900 sq ft",
    rate: "Rs. 1,800 / sq ft",
    base: "Rs. 16,20,000",
    hidden: "Rs. 2,00,000 to Rs. 4,00,000",
    total: "Approx. Rs. 18 lakh to Rs. 22 lakh",
  },
  {
    area: "1200 sq ft",
    rate: "Rs. 1,800 / sq ft",
    base: "Rs. 21,60,000",
    hidden: "Rs. 2,50,000 to Rs. 5,00,000",
    total: "Approx. Rs. 24 lakh to Rs. 28 lakh",
  },
  {
    area: "1500 sq ft",
    rate: "Rs. 2,000 / sq ft",
    base: "Rs. 30,00,000",
    hidden: "Rs. 3,00,000 to Rs. 6,00,000",
    total: "Approx. Rs. 33 lakh to Rs. 36 lakh",
  },
];

const faqs = [
  {
    q: "How do I calculate home construction cost?",
    a:
      "Home construction cost can be calculated by multiplying total built-up area by construction rate per square foot. Additional costs such as approvals, design fees, water connection, electricity connection, staircase, boundary wall and finishing should also be considered.",
  },
  {
    q: "What is the construction cost per sq ft in India?",
    a:
      "Construction cost per sq ft in India depends on city, labour rate, material quality and design. Economy construction may start around Rs. 1400 per sq ft, standard construction may be around Rs. 1800 per sq ft, and premium construction can be Rs. 2400 per sq ft or higher.",
  },
  {
    q: "Is staircase included in built-up area?",
    a:
      "In many residential estimates, staircase area is already included in built-up area. If staircase is already included in built-up area, it should not be added again in total cost. If staircase is separate, it can be added as extra cost.",
  },
  {
    q: "Which materials are required for house construction?",
    a:
      "Main materials include cement, steel, sand, aggregate, bricks or blocks, tiles, paint, pipes, electrical fittings, shuttering plywood, timber, nails, form oil and props.",
  },
  {
    q: "Does CivilCalc Pro generate PDF report?",
    a:
      "Yes. CivilCalc Pro can generate a PDF estimate report with construction cost, material quantity, BOQ, hidden costs, staircase estimate and shuttering requirement.",
  },
  {
    q: "Can this calculator be used by homeowners?",
    a:
      "Yes. Homeowners can use it to get an approximate idea of house construction cost before speaking with engineers, architects or contractors.",
  },
];

export default function HomeConstructionCostCalculatorPage() {
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
    headline: "Home Construction Cost Calculator in India",
    description:
      "Complete guide to estimate home construction cost with area, material quantity, BOQ, staircase, shuttering and hidden costs.",
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
      "@id": "https://civilcalcpro.in/home-construction-cost-calculator",
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
        name: "Home Construction Cost Calculator",
        item: "https://civilcalcpro.in/home-construction-cost-calculator",
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
          HOME CONSTRUCTION COST GUIDE
        </p>

        <h1 className="text-4xl md:text-6xl font-black mt-4 leading-tight">
          Home Construction Cost Calculator in India
        </h1>

        <p className="text-slate-300 text-lg mt-6 leading-8 max-w-4xl">
          Estimate house construction cost with built-up area, number of floors,
          construction quality, material quantity, staircase, shuttering,
          formwork, BOQ, hidden costs and PDF report using CivilCalc Pro.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Link
            href="/login?redirect=/dashboard/calculators/home-construction"
            className="bg-orange-500 hover:bg-orange-600 transition px-6 py-4 rounded-xl font-black text-center"
          >
            Open Home Cost Calculator
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
            How to Calculate Home Construction Cost?
          </h2>

          <p className="text-slate-300 leading-8 mb-5">
            The simplest way to calculate home construction cost is to multiply
            the total built-up area by the construction rate per square foot.
            For example, if the built-up area is 900 sq ft and the construction
            rate is Rs. 1,800 per sq ft, the base construction cost is:
          </p>

          <FormulaBox>
            Home Construction Cost = Built-up Area × Cost per Sq Ft
          </FormulaBox>

          <p className="text-slate-300 leading-8 mt-5">
            Example: 900 × 1,800 = Rs. 16,20,000. After adding hidden costs,
            approvals, design fees, staircase, boundary wall and finishing
            variations, the final project budget may be higher.
          </p>
        </section>

        <ArticleCard title="What is Home Construction Cost?">
          Home construction cost is the total estimated amount required to build
          a residential house. It includes excavation, foundation, RCC work,
          brickwork, plaster, flooring, doors, windows, electrical, plumbing,
          painting, finishing, staircase, shuttering, labour and hidden costs.
          A proper estimate helps homeowners and contractors plan the project
          before construction starts.
        </ArticleCard>

        <ArticleCard title="Construction Cost per Sq Ft in India">
          Construction cost per sq ft in India depends on city, material rates,
          labour charges, quality of construction and design complexity. Economy
          quality construction may be lower, standard quality is usually suitable
          for normal residential houses, and premium quality includes better
          flooring, fixtures, doors, windows and finishing.
          <div className="grid sm:grid-cols-3 gap-4 mt-6">
            <MiniBox label="Economy" value="Approx. Rs. 1400 / sq ft" />
            <MiniBox label="Standard" value="Approx. Rs. 1800 / sq ft" />
            <MiniBox label="Premium" value="Approx. Rs. 2400 / sq ft" />
          </div>
        </ArticleCard>

        <ArticleCard title="House Construction Cost Formula">
          <FormulaBox>
            Total Cost = Construction Area × Rate per Sq Ft + Hidden Costs
          </FormulaBox>

          <p className="text-slate-300 mt-4 leading-8">
            Construction area is calculated by multiplying built-up area by the
            number of floors. Hidden costs may include architect fees, structural
            design, approvals, water connection, electricity connection,
            borewell, boundary wall and other site-specific expenses.
          </p>
        </ArticleCard>

        <ArticleCard title="Work-wise Cost Breakdown for House Construction">
          <div className="overflow-x-auto">
            <table className="w-full border border-slate-800 text-left">
              <thead className="bg-slate-900">
                <tr>
                  <TableHead>Work Item</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Approx. Share</TableHead>
                </tr>
              </thead>

              <tbody className="text-slate-300">
                {costBreakdownRows.map(([item, desc, share]) => (
                  <tr key={item}>
                    <TableCell strong>{item}</TableCell>
                    <TableCell>{desc}</TableCell>
                    <TableCell>{share}</TableCell>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ArticleCard>

        <ArticleCard title="Material Required for House Construction">
          <p className="text-slate-300 leading-8 mb-6">
            A good house construction estimate should include both cost and
            material quantity. CivilCalc Pro helps estimate cement, steel, sand,
            aggregate, bricks and shuttering-related materials like plywood,
            timber, nails, form oil and props.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full border border-slate-800 text-left">
              <thead className="bg-slate-900">
                <tr>
                  <TableHead>Material</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Use</TableHead>
                </tr>
              </thead>

              <tbody className="text-slate-300">
                {materialRows.map(([material, unit, use]) => (
                  <tr key={material}>
                    <TableCell strong>{material}</TableCell>
                    <TableCell>{unit}</TableCell>
                    <TableCell>{use}</TableCell>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ArticleCard>

        <ArticleCard title="Staircase Cost in Home Construction">
          Staircase is an important part of G+1, G+2 and duplex houses. If the
          staircase area is already included in built-up area, the cost should
          not be added again separately. If the staircase is separate from the
          entered built-up area, it can be added as extra cost. A professional
          estimate should still show staircase concrete, steel and shuttering
          quantity in the BOQ.
        </ArticleCard>

        <ArticleCard title="Shuttering and Formwork Material Requirement">
          Shuttering is required for RCC footing, columns, beams, slabs and
          staircases. In normal per sq ft construction rates, shuttering cost is
          often included. However, for BOQ and material planning, shuttering area
          and materials should be shown separately.
          <div className="grid sm:grid-cols-2 gap-4 mt-6">
            <MiniBox label="Plywood Sheets" value="For slab, beam and column formwork" />
            <MiniBox label="Timber / Battens" value="For shuttering support" />
            <MiniBox label="Nails" value="For fixing formwork" />
            <MiniBox label="Form Oil" value="For easy shuttering removal" />
          </div>
        </ArticleCard>

        <ArticleCard title="Hidden Costs in House Construction">
          Many homeowners only calculate basic construction cost and forget
          hidden expenses. These hidden costs can change the final budget
          significantly.
          <ul className="list-disc pl-6 space-y-3 text-slate-300 leading-7 mt-5">
            <li>Architect and planning fees</li>
            <li>Structural design fees</li>
            <li>Government approval and permission charges</li>
            <li>Water and electricity connection</li>
            <li>Borewell and underground water tank</li>
            <li>Boundary wall and gate</li>
            <li>Transportation and site handling</li>
            <li>Contingency for rate changes and wastage</li>
          </ul>
        </ArticleCard>

        <ArticleCard title="Home Construction Cost Examples">
          <div className="overflow-x-auto">
            <table className="w-full border border-slate-800 text-left">
              <thead className="bg-slate-900">
                <tr>
                  <TableHead>House Area</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead>Base Cost</TableHead>
                  <TableHead>Hidden Cost</TableHead>
                  <TableHead>Total Estimate</TableHead>
                </tr>
              </thead>

              <tbody className="text-slate-300">
                {exampleRows.map((row) => (
                  <tr key={row.area}>
                    <TableCell strong>{row.area}</TableCell>
                    <TableCell>{row.rate}</TableCell>
                    <TableCell>{row.base}</TableCell>
                    <TableCell>{row.hidden}</TableCell>
                    <TableCell>{row.total}</TableCell>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ArticleCard>

        <ArticleCard title="How CivilCalc Pro Home Construction Calculator Helps">
          CivilCalc Pro helps homeowners, civil engineers, contractors and site
          engineers calculate house construction cost in a more organized way.
          It provides total cost, material requirement, staircase estimate,
          shuttering material, hidden costs, BOQ and PDF report in one place.
          <div className="grid sm:grid-cols-2 gap-4 mt-6">
            <MiniBox label="Input" value="Area, floors, quality and rates" />
            <MiniBox label="Output" value="Cost, materials, BOQ and PDF" />
            <MiniBox label="Useful For" value="Homeowners and contractors" />
            <MiniBox label="Future Scope" value="Area-based contractor connect" />
          </div>
        </ArticleCard>

        <ArticleCard title="Future: Area-based Construction Company Connect">
          In the future, CivilCalc Pro can help users enter their city or area
          name and connect with construction companies, contractors, engineers
          and material suppliers available in that location. This can turn a
          simple cost calculator into a complete construction planning platform.
        </ArticleCard>

        <ArticleCard title="Related Civil Engineering Tools">
          <div className="grid sm:grid-cols-2 gap-3">
            <LinkCard href="/login?redirect=/dashboard/calculators/home-construction">
              Home Construction Cost Calculator
            </LinkCard>
            <LinkCard href="/login?redirect=/dashboard/calculators/boq-generator">
              BOQ Generator
            </LinkCard>
            <LinkCard href="/bar-bending-schedule-guide">
              Bar Bending Schedule Guide
            </LinkCard>
            <LinkCard href="/steel-weight-calculator">
              Steel Weight Calculator
            </LinkCard>
            <LinkCard href="/brickwork-calculator">
              Brickwork Calculator
            </LinkCard>
            <LinkCard href="/plaster-calculator">
              Plaster Calculator
            </LinkCard>
          </div>
        </ArticleCard>

        <FAQSection />

        <div className="mt-10 text-center">
          <Link
            href="/login?redirect=/dashboard/calculators/home-construction"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white transition px-8 py-4 rounded-xl font-black"
          >
            Start Home Construction Estimate
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
