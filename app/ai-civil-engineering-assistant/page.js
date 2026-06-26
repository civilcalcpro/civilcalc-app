import Link from 'next/link'

export const metadata = {
  title:
    'AI Civil Engineering Assistant | Civil Engineering AI Tool | CivilCalc Pro',
  description:
    'Use CivilCalc Pro AI Civil Engineering Assistant to get help with RCC design, BOQ, quantity estimation, construction calculations, IS code learning, formulas and civil engineering doubts.',
  alternates: {
    canonical: 'https://civilcalcpro.in/ai-civil-engineering-assistant',
  },
  openGraph: {
    title:
      'AI Civil Engineering Assistant | Civil Engineering AI Tool',
    description:
      'AI-powered civil engineering assistant for RCC design, BOQ, quantity estimation, formulas, IS code learning and construction calculation support.',
    url: 'https://civilcalcpro.in/ai-civil-engineering-assistant',
    siteName: 'CivilCalc Pro',
    type: 'article',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title:
      'AI Civil Engineering Assistant | Civil Engineering AI Tool',
    description:
      'Get AI help for civil engineering calculations, RCC design, BOQ, estimation, formulas and engineering doubts.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
}

const pageUrl = 'https://civilcalcpro.in/ai-civil-engineering-assistant'

const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'CivilCalc Pro AI Civil Engineering Assistant',
  applicationCategory: 'EngineeringApplication',
  operatingSystem: 'Web',
  url: pageUrl,
  description:
    'AI civil engineering assistant for RCC design, BOQ generation, quantity estimation, civil engineering formulas, construction calculations and IS code learning.',
  brand: {
    '@type': 'Brand',
    name: 'CivilCalc Pro',
  },
  publisher: {
    '@type': 'Organization',
    name: 'CivilCalc Pro',
    url: 'https://civilcalcpro.in',
  },
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'INR',
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is an AI civil engineering assistant?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'An AI civil engineering assistant is a digital tool that helps civil engineers, students, site engineers and contractors understand calculations, formulas, BOQ, RCC design concepts, quantity estimation and construction-related doubts.',
      },
    },
    {
      '@type': 'Question',
      name: 'How can AI help civil engineers?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'AI can help civil engineers by explaining formulas, checking calculation logic, assisting with BOQ and quantity estimation, summarizing civil engineering concepts and providing step-by-step guidance for common engineering problems.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can AI replace a civil engineer?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'No, AI cannot replace a qualified civil engineer. AI can assist with learning, calculation support and productivity, but final engineering decisions must be checked by a qualified professional as per applicable codes and site conditions.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I use AI for RCC design doubts?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'Yes, AI can help explain RCC design concepts such as beam design, column design, slab design, footing design, reinforcement basics and design formulas. However, final structural design should always be verified by a qualified structural engineer.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is CivilCalc Pro useful for civil engineering students?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'Yes, CivilCalc Pro is useful for civil engineering students because it provides calculators, formulas, step-by-step explanations, BOQ tools, quantity estimation support and AI-based civil engineering assistance.',
      },
    },
  ],
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'TechArticle',
  headline:
    'AI Civil Engineering Assistant for Calculations, BOQ and RCC Design Support',
  description:
    'A practical guide explaining how AI can help civil engineers with RCC design, BOQ generation, quantity estimation, formulas, IS code learning and construction calculation support.',
  mainEntityOfPage: pageUrl,
  url: pageUrl,
  author: {
    '@type': 'Organization',
    name: 'CivilCalc Pro',
    url: 'https://civilcalcpro.in',
  },
  publisher: {
    '@type': 'Organization',
    name: 'CivilCalc Pro',
    url: 'https://civilcalcpro.in',
  },
  about: [
    'AI civil engineering assistant',
    'Civil engineering AI tool',
    'AI for civil engineers',
    'BOQ AI assistant',
    'RCC design assistant',
    'Quantity estimation assistant',
  ],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://civilcalcpro.in',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Civil Engineering Calculators',
      item: 'https://civilcalcpro.in/civil-engineering-calculators',
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'AI Civil Engineering Assistant',
      item: pageUrl,
    },
  ],
}

export default function AiCivilEngineeringAssistantPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareSchema),
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
          __html: JSON.stringify(faqSchema),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      <div className="max-w-6xl mx-auto">
        <p className="text-orange-400 font-semibold mb-3">
          AI CIVIL ENGINEERING TOOL
        </p>

        <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
          AI Civil Engineering Assistant
        </h1>

        <p className="text-slate-300 text-lg lg:text-xl mb-8 leading-8 max-w-4xl">
          CivilCalc Pro AI Civil Engineering Assistant helps civil engineers,
          students, site engineers, quantity surveyors and contractors understand
          RCC design, BOQ, quantity estimation, civil engineering formulas,
          construction calculations and IS code concepts faster.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Link
            href="/login?redirect=/dashboard/ai-assistant"
            className="bg-orange-500 hover:bg-orange-600 transition px-6 py-4 rounded-xl font-semibold text-center"
          >
            Open AI Assistant
          </Link>

          <Link
            href="/civil-engineering-calculators"
            className="bg-slate-900 hover:bg-slate-800 border border-slate-700 transition px-6 py-4 rounded-xl font-semibold text-center"
          >
            Explore Civil Engineering Tools
          </Link>
        </div>

        <section className="bg-orange-500/10 border border-orange-500/30 rounded-2xl p-6 lg:p-8 mb-10">
          <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">
            Quick Answer
          </h2>

          <p className="text-slate-200 leading-8 text-lg">
            An <strong>AI civil engineering assistant</strong> helps engineers
            and students understand calculations, formulas, BOQ, quantity
            estimation, RCC design concepts and construction-related doubts. It
            is useful for learning and productivity, but final engineering work
            should always be verified by a qualified professional.
          </p>
        </section>

        <section className="space-y-8">
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              What is an AI Civil Engineering Assistant?
            </h2>

            <p className="text-slate-300 leading-7">
              An AI Civil Engineering Assistant is a smart digital assistant
              designed to help with civil engineering questions, calculation
              logic, formulas, estimation methods, RCC design concepts,
              construction material quantities, BOQ preparation and site-related
              engineering doubts.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              What Can CivilCalc Pro AI Assistant Help With?
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              {[
                'RCC beam, slab, column and footing concepts',
                'BOQ and quantity estimation guidance',
                'Steel weight and reinforcement calculation support',
                'Concrete volume and material quantity explanation',
                'Brickwork, plaster, paint and tile calculation doubts',
                'Civil engineering formulas and unit conversions',
                'IS code learning and concept explanation',
                'Step-by-step civil engineering problem solving',
              ].map((item) => (
                <div
                  key={item}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-4"
                >
                  <p className="text-slate-200">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 overflow-x-auto">
            <h2 className="text-2xl font-bold text-white mb-4">
              AI Assistant Use Cases for Civil Engineers
            </h2>

            <table className="w-full border-collapse text-left text-slate-300">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="py-3 pr-4 text-white">Use Case</th>
                  <th className="py-3 pr-4 text-white">How It Helps</th>
                  <th className="py-3 pr-4 text-white">Example</th>
                </tr>
              </thead>

              <tbody>
                <tr className="border-b border-slate-800">
                  <td className="py-3 pr-4">RCC Design Learning</td>
                  <td className="py-3 pr-4">
                    Explains design concepts and formulas
                  </td>
                  <td className="py-3 pr-4">
                    Beam, slab, column and footing basics
                  </td>
                </tr>

                <tr className="border-b border-slate-800">
                  <td className="py-3 pr-4">Quantity Estimation</td>
                  <td className="py-3 pr-4">
                    Helps understand measurement logic
                  </td>
                  <td className="py-3 pr-4">
                    Concrete, brickwork, plaster and steel
                  </td>
                </tr>

                <tr className="border-b border-slate-800">
                  <td className="py-3 pr-4">BOQ Preparation</td>
                  <td className="py-3 pr-4">
                    Helps with item descriptions and estimation flow
                  </td>
                  <td className="py-3 pr-4">
                    RCC item, plaster item, flooring item
                  </td>
                </tr>

                <tr className="border-b border-slate-800">
                  <td className="py-3 pr-4">Formula Explanation</td>
                  <td className="py-3 pr-4">
                    Explains formulas in simple language
                  </td>
                  <td className="py-3 pr-4">
                    Steel weight, concrete volume, development length
                  </td>
                </tr>

                <tr>
                  <td className="py-3 pr-4">Student Doubts</td>
                  <td className="py-3 pr-4">
                    Helps students revise civil engineering topics
                  </td>
                  <td className="py-3 pr-4">
                    SFD, BMD, RCC, estimation and costing
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4">
                AI for Civil Engineering Students
              </h2>

              <p className="text-slate-300 leading-7">
                Civil engineering students can use the AI assistant to understand
                concepts such as RCC design, structural analysis, estimation,
                costing, concrete technology, steel calculation, unit conversion
                and construction material quantity calculation.
              </p>
            </div>

            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4">
                AI for Site Engineers and Contractors
              </h2>

              <p className="text-slate-300 leading-7">
                Site engineers and contractors can use the AI assistant to get
                quick help with quantity estimation logic, BOQ item explanation,
                construction formulas, material calculations and practical site
                measurement questions.
              </p>
            </div>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Example Questions You Can Ask
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              {[
                'How to calculate steel weight for 12 mm bar?',
                'How to prepare BOQ for RCC beam?',
                'Explain one-way slab and two-way slab difference.',
                'How to calculate brickwork quantity?',
                'What is development length in RCC?',
                'How to calculate concrete volume for footing?',
                'Explain SFD and BMD in simple language.',
                'How to estimate home construction cost?',
              ].map((question) => (
                <div
                  key={question}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-4"
                >
                  <p className="text-slate-200">{question}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Important Engineering Note
            </h2>

            <p className="text-slate-300 leading-7">
              AI assistance is helpful for learning, productivity and checking
              calculation logic. However, final structural design, safety
              decisions, site execution decisions and code compliance should
              always be verified by a qualified civil or structural engineer.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-5">
              Frequently Asked Questions
            </h2>

            <div className="space-y-5">
              <div>
                <h3 className="font-semibold text-white mb-2">
                  What is an AI civil engineering assistant?
                </h3>
                <p className="text-slate-300 leading-7">
                  It is an AI-powered tool that helps explain civil engineering
                  calculations, concepts, formulas, BOQ, estimation methods and
                  construction-related doubts.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-2">
                  Can AI help with RCC design?
                </h3>
                <p className="text-slate-300 leading-7">
                  Yes, AI can help explain RCC design concepts, formulas and
                  calculation steps. Final design should be checked by a
                  qualified structural engineer.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-2">
                  Can AI help with BOQ preparation?
                </h3>
                <p className="text-slate-300 leading-7">
                  Yes, AI can help understand BOQ item descriptions, quantity
                  measurement logic, estimation methods and item-wise calculation
                  flow.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-2">
                  Is CivilCalc Pro useful for students?
                </h3>
                <p className="text-slate-300 leading-7">
                  Yes, students can use CivilCalc Pro for calculators, formulas,
                  examples, civil engineering concepts and AI-based learning
                  support.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Related Tools
            </h2>

            <ul className="grid md:grid-cols-2 gap-3 text-slate-300">
              <li>
                <Link
                  href="/civil-engineering-calculators"
                  className="text-orange-400 hover:text-orange-300"
                >
                  Civil Engineering Calculators
                </Link>
              </li>
              <li>
                <Link
                  href="/boq-generator"
                  className="text-orange-400 hover:text-orange-300"
                >
                  BOQ Generator
                </Link>
              </li>
              <li>
                <Link
                  href="/rcc-design-calculators"
                  className="text-orange-400 hover:text-orange-300"
                >
                  RCC Design Calculators
                </Link>
              </li>
              <li>
                <Link
                  href="/quantity-estimation-calculators"
                  className="text-orange-400 hover:text-orange-300"
                >
                  Quantity Estimation Calculators
                </Link>
              </li>
              <li>
                <Link
                  href="/is-code-library"
                  className="text-orange-400 hover:text-orange-300"
                >
                  IS Code Library
                </Link>
              </li>
              <li>
                <Link
                  href="/civil-engineering-pdf-reports"
                  className="text-orange-400 hover:text-orange-300"
                >
                  Civil Engineering PDF Reports
                </Link>
              </li>
            </ul>
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/login?redirect=/dashboard/ai-assistant"
              className="inline-block border border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white transition px-6 py-3 rounded-xl font-semibold"
            >
              Open AI Civil Engineering Assistant
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}
