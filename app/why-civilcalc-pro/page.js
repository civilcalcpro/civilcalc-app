import Link from "next/link";

export const metadata = {
  title: "Why CivilCalc Pro is Built for Indian Civil Engineers",
  description:
    "Learn why CivilCalc Pro is built for Indian civil engineers, contractors, students and site engineers with RCC calculators, BOQ generator, quantity estimation tools and AI civil engineering assistant.",
  alternates: {
    canonical: "https://civilcalcpro.in/why-civilcalc-pro",
  },
  openGraph: {
    title: "Why CivilCalc Pro is Built for Indian Civil Engineers",
    description:
      "CivilCalc Pro helps Indian civil engineers with RCC design calculators, BOQ generator, quantity estimation tools, home construction cost calculator and AI assistant.",
    url: "https://civilcalcpro.in/why-civilcalc-pro",
    siteName: "CivilCalc Pro",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Why CivilCalc Pro is Built for Indian Civil Engineers",
    description:
      "CivilCalc Pro helps Indian civil engineers, contractors and students with civil engineering calculators, BOQ tools and construction estimation.",
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

export default function WhyCivilCalcProPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is CivilCalc Pro?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "CivilCalc Pro is a civil engineering calculation platform built for engineers, contractors, students and construction professionals. It includes RCC design calculators, quantity estimation tools, BOQ generator, home construction cost calculator and AI civil engineering assistant.",
        },
      },
      {
        "@type": "Question",
        name: "Who can use CivilCalc Pro?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "CivilCalc Pro can be used by civil engineering students, site engineers, structural engineers, quantity surveyors, contractors and construction professionals.",
        },
      },
      {
        "@type": "Question",
        name: "Which calculators are available in CivilCalc Pro?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "CivilCalc Pro includes RCC beam design, column design, footing design, slab design, concrete volume calculator, steel weight calculator, brickwork calculator, plaster calculator, excavation calculator, BOQ generator and home construction cost calculator.",
        },
      },
      {
        "@type": "Question",
        name: "Is CivilCalc Pro useful for Indian civil engineers?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, CivilCalc Pro is useful for Indian civil engineers because it focuses on common site engineering calculations, RCC design workflows, quantity estimation, BOQ preparation and construction cost estimation used in Indian projects.",
        },
      },
    ],
  };

  const tools = [
    {
      title: "RCC Design Calculators",
      description:
        "Beam, column, footing and slab calculators for structural design learning and quick engineering checks.",
      href: "/rcc-design-calculators",
    },
    {
      title: "Quantity Estimation Tools",
      description:
        "Concrete, excavation, plaster, brickwork and construction material quantity calculators.",
      href: "/quantity-estimation-calculators",
    },
    {
      title: "BOQ Generator",
      description:
        "Create project-based bill of quantities with item details, rates, quantities and cost summary.",
      href: "/boq-generator",
    },
    {
      title: "Home Construction Cost Calculator",
      description:
        "Estimate house construction cost, material quantity and construction budget quickly.",
      href: "/home-construction-cost-calculator",
    },
    {
      title: "Steel & Reinforcement Tools",
      description:
        "Calculate steel bar weight, reinforcement quantity and support BBS preparation workflows.",
      href: "/reinforcement-calculators",
    },
    {
      title: "AI Civil Engineering Assistant",
      description:
        "Ask civil engineering questions and get quick explanations for formulas, materials and site work.",
      href: "/login",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />

      <div className="max-w-6xl mx-auto">
        <section className="text-center mb-16">
          <p className="text-orange-400 font-semibold mb-4">
            CIVILCALC PRO INDIA
          </p>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Why CivilCalc Pro is Built for Indian Civil Engineers
          </h1>

          <p className="text-slate-300 text-lg md:text-xl max-w-4xl mx-auto leading-8 mb-10">
            CivilCalc Pro is designed for civil engineering students, site
            engineers, contractors, quantity surveyors and construction
            professionals who need fast, practical and reliable civil
            engineering calculation tools.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/civil-engineering-calculators"
              className="bg-orange-500 hover:bg-orange-600 transition px-7 py-3 rounded-xl font-semibold"
            >
              Explore Calculators
            </Link>

            <Link
              href="/login"
              className="border border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white transition px-7 py-3 rounded-xl font-semibold"
            >
              Open Dashboard
            </Link>
          </div>
        </section>

        <section className="rounded-2xl border border-orange-500/30 bg-orange-500/5 p-8 mb-12">
          <p className="text-orange-400 font-semibold mb-3">
            QUICK ANSWER
          </p>

          <h2 className="text-3xl font-bold mb-5">
            What makes CivilCalc Pro useful?
          </h2>

          <p className="text-slate-300 leading-8 mb-5">
            CivilCalc Pro combines civil engineering calculators, quantity
            estimation tools, RCC design workflows, BOQ preparation and AI-based
            civil engineering help in one platform. It is useful for quick site
            calculations, student learning, material estimation and construction
            planning.
          </p>

          <div className="grid md:grid-cols-4 gap-4 mt-8">
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
              <p className="text-3xl font-bold text-orange-400">25+</p>
              <p className="text-slate-300 mt-2">Civil calculators</p>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
              <p className="text-3xl font-bold text-orange-400">RCC</p>
              <p className="text-slate-300 mt-2">Design tools</p>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
              <p className="text-3xl font-bold text-orange-400">BOQ</p>
              <p className="text-slate-300 mt-2">Generator</p>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
              <p className="text-3xl font-bold text-orange-400">AI</p>
              <p className="text-slate-300 mt-2">Engineering assistant</p>
            </div>
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-6 mb-16">
          {tools.map((tool) => (
            <Link
              key={tool.title}
              href={tool.href}
              className="bg-slate-900 border border-slate-800 hover:border-orange-500/60 transition rounded-2xl p-6"
            >
              <h2 className="text-xl font-bold mb-3">
                {tool.title}
              </h2>

              <p className="text-slate-300 leading-7">
                {tool.description}
              </p>
            </Link>
          ))}
        </section>

        <section className="bg-slate-900/70 border border-slate-800 rounded-2xl p-8 mb-12">
          <h2 className="text-3xl font-bold mb-6">
            CivilCalc Pro Feature Overview
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full border border-slate-800 text-left">
              <thead className="bg-slate-950">
                <tr>
                  <th className="border border-slate-800 p-3 text-white">
                    Feature
                  </th>
                  <th className="border border-slate-800 p-3 text-white">
                    How it helps engineers
                  </th>
                </tr>
              </thead>

              <tbody className="text-slate-300">
                <tr>
                  <td className="border border-slate-800 p-3">
                    RCC Beam, Column, Footing and Slab Calculators
                  </td>
                  <td className="border border-slate-800 p-3">
                    Helps with structural design calculations, reinforcement
                    estimation and design learning.
                  </td>
                </tr>

                <tr>
                  <td className="border border-slate-800 p-3">
                    Concrete, Brickwork, Plaster and Excavation Calculators
                  </td>
                  <td className="border border-slate-800 p-3">
                    Helps calculate material quantities for common construction
                    site work.
                  </td>
                </tr>

                <tr>
                  <td className="border border-slate-800 p-3">
                    Steel Weight Calculator
                  </td>
                  <td className="border border-slate-800 p-3">
                    Helps calculate TMT bar weight using the D² / 162 formula.
                  </td>
                </tr>

                <tr>
                  <td className="border border-slate-800 p-3">
                    BOQ Generator
                  </td>
                  <td className="border border-slate-800 p-3">
                    Helps prepare item-wise quantity and cost estimation for
                    construction projects.
                  </td>
                </tr>

                <tr>
                  <td className="border border-slate-800 p-3">
                    Home Construction Cost Calculator
                  </td>
                  <td className="border border-slate-800 p-3">
                    Helps estimate house construction cost, material quantity
                    and budget planning.
                  </td>
                </tr>

                <tr>
                  <td className="border border-slate-800 p-3">
                    AI Civil Engineering Assistant
                  </td>
                  <td className="border border-slate-800 p-3">
                    Helps users understand formulas, materials, construction
                    terms and engineering concepts.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">
              For Students
            </h2>

            <p className="text-slate-300 leading-8">
              Civil engineering students can use CivilCalc Pro to understand
              formulas, solve calculation examples, learn RCC design basics and
              practice quantity estimation with real construction use cases.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">
              For Site Engineers
            </h2>

            <p className="text-slate-300 leading-8">
              Site engineers can quickly calculate concrete volume, steel
              weight, plaster quantity, brickwork quantity, excavation quantity
              and other day-to-day construction quantities.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">
              For Contractors
            </h2>

            <p className="text-slate-300 leading-8">
              Contractors can use construction estimation tools for project
              planning, cost estimation, material procurement and BOQ
              preparation.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">
              For Quantity Surveyors
            </h2>

            <p className="text-slate-300 leading-8">
              Quantity surveyors can use calculators and BOQ workflows to
              prepare faster quantity checks, material estimates and item-wise
              cost summaries.
            </p>
          </div>
        </section>

        <section className="bg-slate-900/70 border border-slate-800 rounded-2xl p-8 mb-12">
          <h2 className="text-3xl font-bold mb-6">
            Popular CivilCalc Pro Tools
          </h2>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Link className="text-orange-400 hover:text-orange-300" href="/beam-design">
              RCC Beam Design Calculator
            </Link>
            <Link className="text-orange-400 hover:text-orange-300" href="/column-design">
              Column Design Calculator
            </Link>
            <Link className="text-orange-400 hover:text-orange-300" href="/footing-design">
              Footing Design Calculator
            </Link>
            <Link className="text-orange-400 hover:text-orange-300" href="/one-way-slab-calculator">
              One Way Slab Calculator
            </Link>
            <Link className="text-orange-400 hover:text-orange-300" href="/two-way-slab-calculator">
              Two Way Slab Calculator
            </Link>
            <Link className="text-orange-400 hover:text-orange-300" href="/steel-weight-calculator">
              Steel Weight Calculator
            </Link>
            <Link className="text-orange-400 hover:text-orange-300" href="/brickwork-calculator">
              Brickwork Calculator
            </Link>
            <Link className="text-orange-400 hover:text-orange-300" href="/plaster-calculator">
              Plaster Calculator
            </Link>
            <Link className="text-orange-400 hover:text-orange-300" href="/boq-generator">
              BOQ Generator
            </Link>
          </div>
        </section>

        <section className="text-center bg-gradient-to-r from-orange-500/20 to-orange-600/10 border border-orange-500/30 rounded-2xl p-10">
          <h2 className="text-3xl font-bold mb-4">
            Start Using CivilCalc Pro
          </h2>

          <p className="text-slate-300 max-w-3xl mx-auto leading-8 mb-8">
            Use CivilCalc Pro to calculate, estimate and plan civil engineering
            work faster with practical tools made for construction professionals.
          </p>

          <Link
            href="/civil-engineering-calculators"
            className="inline-block bg-orange-500 hover:bg-orange-600 transition px-7 py-3 rounded-xl font-semibold"
          >
            View All Civil Engineering Calculators
          </Link>
        </section>
      </div>
    </main>
  );
}
