import Link from "next/link";

export const metadata = {
  title:
    "BOQ Generator | Bill of Quantities for Construction | CivilCalc Pro",
  description:
    "Create professional BOQ for construction projects with project details, item quantity, unit rate, amount, material summary, cost summary and report export using CivilCalc Pro BOQ Generator.",
  alternates: {
    canonical: "https://civilcalcpro.in/boq-generator",
  },
  openGraph: {
    title:
      "BOQ Generator | Bill of Quantities for Construction | CivilCalc Pro",
    description:
      "Prepare construction BOQ with item details, quantities, rates, amount, GST, wastage, material summary and professional report output.",
    url: "https://civilcalcpro.in/boq-generator",
    siteName: "CivilCalc Pro",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BOQ Generator | CivilCalc Pro",
    description:
      "Create professional Bill of Quantities for construction projects using CivilCalc Pro BOQ Generator.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function BOQGeneratorPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is a BOQ Generator?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A BOQ Generator is an online tool used to create a Bill of Quantities for construction projects. It helps calculate item quantities, unit rates, item amounts and project cost summary.",
        },
      },
      {
        "@type": "Question",
        name: "What is BOQ in construction?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "BOQ stands for Bill of Quantities. It is a construction document that lists work item descriptions, units, quantities, rates and amounts for project cost estimation, tendering and billing.",
        },
      },
      {
        "@type": "Question",
        name: "Who uses BOQ in civil engineering?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "BOQ is commonly used by civil engineers, contractors, quantity surveyors, estimators, site engineers and construction companies for quantity estimation, tendering, billing and project cost planning.",
        },
      },
      {
        "@type": "Question",
        name: "How is BOQ amount calculated?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "BOQ amount is calculated by multiplying item quantity by unit rate. For example, if quantity is 12.5 cubic meters and rate is 6500 per cubic meter, amount will be 81250.",
        },
      },
    ],
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-16">
          <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />
      <div className="max-w-6xl mx-auto">
        <p className="text-orange-400 font-semibold mb-3">
          BILL OF QUANTITIES GENERATOR
        </p>

        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          BOQ Generator for Construction Projects
        </h1>

        <p className="text-slate-300 text-lg md:text-xl leading-8 max-w-4xl mb-10">
          Create professional Bill of Quantities for construction projects with
          project details, item categories, item description, quantity, unit,
          rate, amount, GST, wastage, material summary and cost summary.
          CivilCalc Pro BOQ Generator helps civil engineers, contractors,
          estimators and construction professionals prepare BOQ faster.
        </p>

        <div className="flex flex-wrap gap-4 mb-14">
          <Link
            href="/login?redirect=/dashboard/calculators/boq-generator"
            className="bg-orange-500 hover:bg-orange-600 transition px-6 py-3 rounded-xl font-semibold"
          >
            Open BOQ Generator
          </Link>

          <Link
            href="/quantity-estimation-calculators"
            className="border border-slate-700 hover:border-orange-500 transition px-6 py-3 rounded-xl font-semibold"
          >
            View Quantity Estimation Tools
          </Link>
        </div>
        <section className="rounded-2xl border border-orange-500/30 bg-orange-500/5 p-8 mb-12">
          <p className="text-orange-400 font-semibold mb-3">
            QUICK ANSWER
          </p>

          <h2 className="text-3xl font-bold mb-5">
            What is a BOQ Generator?
          </h2>

          <p className="text-slate-300 leading-8 mb-4">
            A BOQ Generator is an online tool used to create a Bill of
            Quantities for construction projects. It helps engineers,
            contractors and estimators add work items, calculate quantities,
            enter unit rates, calculate item amounts and prepare a structured
            project cost summary.
          </p>

          <div className="overflow-x-auto mt-6">
            <table className="w-full border border-slate-800 text-left">
              <thead className="bg-slate-900">
                <tr>
                  <th className="border border-slate-800 p-3 text-white">
                    BOQ Field
                  </th>
                  <th className="border border-slate-800 p-3 text-white">
                    Meaning
                  </th>
                  <th className="border border-slate-800 p-3 text-white">
                    Example
                  </th>
                </tr>
              </thead>

              <tbody className="text-slate-300">
                <tr>
                  <td className="border border-slate-800 p-3">
                    Item Description
                  </td>
                  <td className="border border-slate-800 p-3">
                    Work item details
                  </td>
                  <td className="border border-slate-800 p-3">
                    RCC M20 concrete in footing
                  </td>
                </tr>

                <tr>
                  <td className="border border-slate-800 p-3">
                    Unit
                  </td>
                  <td className="border border-slate-800 p-3">
                    Measurement unit
                  </td>
                  <td className="border border-slate-800 p-3">
                    m³, m², kg, nos
                  </td>
                </tr>

                <tr>
                  <td className="border border-slate-800 p-3">
                    Quantity
                  </td>
                  <td className="border border-slate-800 p-3">
                    Measured work quantity
                  </td>
                  <td className="border border-slate-800 p-3">
                    12.50 m³
                  </td>
                </tr>

                <tr>
                  <td className="border border-slate-800 p-3">
                    Rate
                  </td>
                  <td className="border border-slate-800 p-3">
                    Cost per unit
                  </td>
                  <td className="border border-slate-800 p-3">
                    ₹6,500 per m³
                  </td>
                </tr>

                <tr>
                  <td className="border border-slate-800 p-3">
                    Amount
                  </td>
                  <td className="border border-slate-800 p-3">
                    Quantity × Rate
                  </td>
                  <td className="border border-slate-800 p-3">
                    ₹81,250
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-slate-400 leading-7 mt-5">
            Example: If RCC concrete quantity is 12.5 m³ and rate is ₹6,500 per
            m³, the BOQ amount will be 12.5 × 6,500 = ₹81,250. This helps in
            construction cost estimation, tendering, billing and project
            planning.
          </p>
        </section>
        <section className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-2xl font-bold mb-3">Project Details</h2>
            <p className="text-slate-300 leading-7">
              Add project name, client name, project location, project type,
              prepared by, date and revision details before preparing BOQ.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-2xl font-bold mb-3">Item Quantity</h2>
            <p className="text-slate-300 leading-7">
              Add BOQ items with category, description, unit, length, width,
              height, number, quantity, rate and amount calculation.
            </p>
          </div>

          <div className="rounded-2xl border border-orange-500/30 bg-orange-500/5 p-6">
            <h2 className="text-2xl font-bold mb-3 text-orange-400">
              Cost Summary
            </h2>
            <p className="text-slate-300 leading-7">
              Calculate subtotal, GST, wastage, grand total and material
              summary for better construction cost planning.
            </p>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-8 mb-10">
          <h2 className="text-3xl font-bold mb-5">
            What is a BOQ in Construction?
          </h2>

          <p className="text-slate-300 leading-8 mb-4">
            BOQ means Bill of Quantities. It is a construction document that
            lists all project work items with description, unit, quantity, rate
            and amount. A BOQ helps engineers, contractors and clients understand
            the scope of work and estimated project cost.
          </p>

          <p className="text-slate-300 leading-8">
            BOQ is commonly used for residential buildings, commercial projects,
            industrial work, infrastructure projects, tendering, contractor
            billing, material planning and construction cost estimation.
          </p>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-8 mb-10">
          <h2 className="text-3xl font-bold mb-5">
            Common BOQ Categories
          </h2>

          <ul className="list-disc pl-6 space-y-3 text-slate-300 leading-8">
            <li>Earthwork and excavation</li>
            <li>PCC and RCC work</li>
            <li>Footing, column, beam and slab items</li>
            <li>Brickwork and blockwork</li>
            <li>Internal and external plaster</li>
            <li>Flooring and tile work</li>
            <li>Painting and finishing work</li>
            <li>Waterproofing and roof treatment</li>
            <li>Steel work, doors, windows and miscellaneous items</li>
          </ul>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-8 mb-10">
          <h2 className="text-3xl font-bold mb-5">
            Why Use CivilCalc Pro BOQ Generator?
          </h2>

          <p className="text-slate-300 leading-8 mb-4">
            Manual BOQ preparation in spreadsheets can take time and may lead to
            mistakes in quantity, rate, amount and summary calculations.
            CivilCalc Pro BOQ Generator helps users create structured BOQ items,
            calculate amount automatically and manage project cost summary in a
            clean workflow.
          </p>

          <p className="text-slate-300 leading-8">
            The BOQ Generator is useful for civil engineers, quantity surveyors,
            contractors, site engineers, estimators, students and construction
            companies who need a faster way to prepare construction quantity and
            cost documents.
          </p>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-8 mb-10">
          <h2 className="text-3xl font-bold mb-5">
            BOQ Generator Features
          </h2>

          <ul className="list-disc pl-6 space-y-3 text-slate-300 leading-8">
            <li>Project detail entry before BOQ preparation</li>
            <li>Category-wise BOQ item selection</li>
            <li>Editable item description and unit</li>
            <li>Length, width, height and number based quantity calculation</li>
            <li>Rate and amount calculation</li>
            <li>GST, wastage and grand total summary</li>
            <li>Material summary for cement, sand, aggregate, steel and bricks</li>
            <li>Professional workflow for construction estimation</li>
          </ul>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-8 mb-10">
          <h2 className="text-3xl font-bold mb-6">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">
                What is the full form of BOQ?
              </h3>
              <p className="text-slate-300 leading-7">
                BOQ stands for Bill of Quantities. It is a detailed document
                that contains work item description, unit, quantity, rate and
                amount for construction projects.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">
                Who uses a BOQ Generator?
              </h3>
              <p className="text-slate-300 leading-7">
                Civil engineers, contractors, quantity surveyors, estimators,
                site engineers and construction companies use BOQ tools for
                quantity estimation, tendering and project cost planning.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">
                Can BOQ help in construction cost estimation?
              </h3>
              <p className="text-slate-300 leading-7">
                Yes, BOQ helps estimate project cost by calculating quantity,
                rate and amount for each construction item. It also helps in
                material planning, contractor billing and project budgeting.
              </p>
            </div>
          </div>
        </section>

        <section className="text-center rounded-2xl border border-orange-500/30 bg-orange-500/5 p-10">
          <h2 className="text-3xl font-bold mb-4">
            Create Your Construction BOQ Online
          </h2>

          <p className="text-slate-300 max-w-3xl mx-auto leading-8 mb-8">
            Use CivilCalc Pro BOQ Generator to prepare project BOQ, calculate
            quantities, rates, amount, material summary and construction cost
            breakdown in one professional workflow.
          </p>

          <Link
            href="/login?redirect=/dashboard/calculators/boq-generator"
            className="inline-block bg-orange-500 hover:bg-orange-600 transition px-8 py-4 rounded-xl font-semibold"
          >
            Open BOQ Generator
          </Link>
        </section>
      </div>
    </main>
  );
}
