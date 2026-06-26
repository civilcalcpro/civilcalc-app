import Link from 'next/link'

export const metadata = {
  title:
    'Structural Analysis Calculator | Beam, SFD, BMD & Reactions | CivilCalc Pro',
  description:
    'Use CivilCalc Pro Structural Analysis Calculator to understand beam reactions, shear force, bending moment, SFD, BMD, load types and structural analysis concepts for civil engineering students and engineers.',
  alternates: {
    canonical: 'https://civilcalcpro.in/structural-analysis-calculator',
  },
  openGraph: {
    title:
      'Structural Analysis Calculator | Beam, SFD, BMD & Reactions',
    description:
      'Learn structural analysis with beam reactions, shear force diagram, bending moment diagram, point load, UDL, support reactions and civil engineering examples.',
    url: 'https://civilcalcpro.in/structural-analysis-calculator',
    siteName: 'CivilCalc Pro',
    type: 'article',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title:
      'Structural Analysis Calculator | Beam, SFD, BMD & Reactions',
    description:
      'Structural analysis guide and calculator for civil engineering students and engineers. Learn reactions, SFD, BMD and beam analysis.',
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

const pageUrl = 'https://civilcalcpro.in/structural-analysis-calculator'

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is a structural analysis calculator?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'A structural analysis calculator helps calculate support reactions, shear force, bending moment, SFD and BMD for beams and structural members under different loading conditions.',
      },
    },
    {
      '@type': 'Question',
      name: 'What can be calculated in beam analysis?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'Beam analysis commonly includes support reactions, shear force, bending moment, maximum bending moment, shear force diagram and bending moment diagram.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is SFD in structural analysis?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'SFD stands for Shear Force Diagram. It shows the variation of shear force along the length of a beam.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is BMD in structural analysis?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'BMD stands for Bending Moment Diagram. It shows the variation of bending moment along the length of a beam.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is structural analysis useful for civil engineering students?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'Yes, structural analysis is one of the most important subjects for civil engineering students because it helps understand load transfer, support reactions, shear force, bending moment and structural behavior.',
      },
    },
  ],
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'TechArticle',
  headline:
    'Structural Analysis Calculator for Beam Reactions, SFD and BMD',
  description:
    'A practical structural analysis guide explaining support reactions, beam analysis, shear force diagram, bending moment diagram, load types and civil engineering examples.',
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
    'Structural analysis calculator',
    'Beam analysis',
    'Support reactions',
    'Shear force diagram',
    'Bending moment diagram',
    'Civil engineering calculator',
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
      name: 'Structural Analysis Calculator',
      item: pageUrl,
    },
  ],
}

export default function StructuralAnalysisCalculatorPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-16">
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
          STRUCTURAL ANALYSIS TOOL
        </p>

        <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
          Structural Analysis Calculator
        </h1>

        <p className="text-slate-300 text-lg lg:text-xl mb-8 leading-8 max-w-4xl">
          Use the Structural Analysis Calculator to understand beam reactions,
          shear force, bending moment, SFD, BMD, loading conditions and
          structural behavior. This guide is useful for civil engineering
          students, structural engineers, site engineers and exam preparation.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Link
            href="/dashboard/calculators/structural-analysis"
            className="bg-orange-500 hover:bg-orange-600 transition px-6 py-4 rounded-xl font-semibold text-center"
          >
            Open Structural Analysis Tool
          </Link>

          <Link
            href="/civil-engineering-calculators"
            className="bg-slate-900 hover:bg-slate-800 border border-slate-700 transition px-6 py-4 rounded-xl font-semibold text-center"
          >
            View All Civil Calculators
          </Link>
        </div>

        <section className="bg-orange-500/10 border border-orange-500/30 rounded-2xl p-6 lg:p-8 mb-10">
          <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">
            Quick Answer
          </h2>

          <p className="text-slate-200 leading-8 text-lg">
            A <strong>structural analysis calculator</strong> helps calculate
            support reactions, shear force, bending moment, SFD and BMD for
            beams under different loads such as point load, UDL and moment load.
            It is mainly used to understand how loads travel through a structure.
          </p>
        </section>

        <section className="space-y-8">
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              What is Structural Analysis?
            </h2>

            <p className="text-slate-300 leading-7">
              Structural analysis is the process of calculating the effect of
              loads on beams, columns, slabs, frames and other structural
              members. It helps engineers find support reactions, shear force,
              bending moment, deflection and internal forces so that a structure
              can be designed safely.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              What Can This Calculator Help With?
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              {[
                'Support reaction calculation',
                'Shear Force Diagram (SFD)',
                'Bending Moment Diagram (BMD)',
                'Maximum bending moment',
                'Point load analysis',
                'UDL load analysis',
                'Simply supported beam analysis',
                'Cantilever beam analysis',
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
              Common Structural Analysis Outputs
            </h2>

            <table className="w-full border-collapse text-left text-slate-300">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="py-3 pr-4 text-white">Output</th>
                  <th className="py-3 pr-4 text-white">Meaning</th>
                  <th className="py-3 pr-4 text-white">Use</th>
                </tr>
              </thead>

              <tbody>
                <tr className="border-b border-slate-800">
                  <td className="py-3 pr-4">Support Reaction</td>
                  <td className="py-3 pr-4">
                    Force developed at beam supports
                  </td>
                  <td className="py-3 pr-4">
                    Used for support and foundation design
                  </td>
                </tr>

                <tr className="border-b border-slate-800">
                  <td className="py-3 pr-4">Shear Force</td>
                  <td className="py-3 pr-4">
                    Internal vertical force in the beam
                  </td>
                  <td className="py-3 pr-4">
                    Used to check shear capacity
                  </td>
                </tr>

                <tr className="border-b border-slate-800">
                  <td className="py-3 pr-4">Bending Moment</td>
                  <td className="py-3 pr-4">
                    Internal moment causing bending
                  </td>
                  <td className="py-3 pr-4">
                    Used for flexural design
                  </td>
                </tr>

                <tr>
                  <td className="py-3 pr-4">SFD / BMD</td>
                  <td className="py-3 pr-4">
                    Diagram of shear force and bending moment
                  </td>
                  <td className="py-3 pr-4">
                    Used to locate critical points in the beam
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4">
                Simply Supported Beam Analysis
              </h2>

              <p className="text-slate-300 leading-7">
                A simply supported beam usually has a pin support at one end and
                a roller support at the other end. Structural analysis helps
                calculate reactions, shear force and bending moment for point
                loads, UDL and combined loads.
              </p>
            </div>

            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4">
                Cantilever Beam Analysis
              </h2>

              <p className="text-slate-300 leading-7">
                A cantilever beam is fixed at one end and free at the other end.
                It is commonly used in balconies, projections and brackets.
                Analysis helps calculate fixed-end reaction, shear force and
                bending moment.
              </p>
            </div>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Basic Example
            </h2>

            <p className="text-slate-300 leading-7 mb-4">
              Suppose a simply supported beam carries a point load at the center.
              In this case, the load is shared equally by both supports.
            </p>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
              <p className="text-slate-300 leading-8 font-mono">
                Total load = W
                <br />
                Left reaction = W / 2
                <br />
                Right reaction = W / 2
              </p>
            </div>

            <p className="text-slate-300 leading-7 mt-4">
              After finding reactions, shear force and bending moment values are
              calculated along the beam to prepare SFD and BMD.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-5">
              Frequently Asked Questions
            </h2>

            <div className="space-y-5">
              <div>
                <h3 className="font-semibold text-white mb-2">
                  What is a structural analysis calculator?
                </h3>
                <p className="text-slate-300 leading-7">
                  A structural analysis calculator helps calculate reactions,
                  shear force, bending moment, SFD and BMD for structural
                  members such as beams.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-2">
                  What is SFD?
                </h3>
                <p className="text-slate-300 leading-7">
                  SFD means Shear Force Diagram. It shows how shear force varies
                  along the length of a beam.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-2">
                  What is BMD?
                </h3>
                <p className="text-slate-300 leading-7">
                  BMD means Bending Moment Diagram. It shows how bending moment
                  changes along the beam length.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-2">
                  Is structural analysis important for civil engineering?
                </h3>
                <p className="text-slate-300 leading-7">
                  Yes, structural analysis is important because it helps
                  engineers understand load transfer, internal forces and
                  critical points in a structure.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Related Calculators
            </h2>

            <ul className="grid md:grid-cols-2 gap-3 text-slate-300">
              <li>
                <Link
                  href="/beam-design"
                  className="text-orange-400 hover:text-orange-300"
                >
                  Beam Design Calculator
                </Link>
              </li>
              <li>
                <Link
                  href="/one-way-slab-calculator"
                  className="text-orange-400 hover:text-orange-300"
                >
                  One-Way Slab Calculator
                </Link>
              </li>
              <li>
                <Link
                  href="/two-way-slab-calculator"
                  className="text-orange-400 hover:text-orange-300"
                >
                  Two-Way Slab Calculator
                </Link>
              </li>
              <li>
                <Link
                  href="/footing-design"
                  className="text-orange-400 hover:text-orange-300"
                >
                  Footing Design Calculator
                </Link>
              </li>
              <li>
                <Link
                  href="/steel-weight-calculator"
                  className="text-orange-400 hover:text-orange-300"
                >
                  Steel Weight Calculator
                </Link>
              </li>
              <li>
                <Link
                  href="/civil-engineering-calculators"
                  className="text-orange-400 hover:text-orange-300"
                >
                  All Civil Engineering Calculators
                </Link>
              </li>
            </ul>
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/dashboard/calculators/structural-analysis"
              className="inline-block border border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white transition px-6 py-3 rounded-xl font-semibold"
            >
              Open Structural Analysis Tool
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}
