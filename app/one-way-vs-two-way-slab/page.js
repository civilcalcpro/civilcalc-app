import Link from 'next/link'

export const metadata = {
  title:
    'One-Way Slab vs Two-Way Slab | Difference, Formula & Design Guide | CivilCalc Pro',
  description:
    'Learn the difference between one-way slab and two-way slab with span ratio formula, load transfer direction, reinforcement details, comparison table, examples, FAQs and slab calculators.',
  alternates: {
    canonical: 'https://civilcalcpro.in/one-way-vs-two-way-slab',
  },
  openGraph: {
    title:
      'One-Way Slab vs Two-Way Slab | Difference, Formula & Design Guide',
    description:
      'Complete comparison of one-way slab and two-way slab with span ratio, load transfer, reinforcement direction, examples and slab design calculators.',
    url: 'https://civilcalcpro.in/one-way-vs-two-way-slab',
    siteName: 'CivilCalc Pro',
    type: 'article',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title:
      'One-Way Slab vs Two-Way Slab | Difference, Formula & Design Guide',
    description:
      'Compare one-way and two-way slabs with formula, span ratio, reinforcement direction, practical examples and slab calculators.',
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

const pageUrl = 'https://civilcalcpro.in/one-way-vs-two-way-slab'

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is the main difference between one-way slab and two-way slab?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'The main difference is the direction of load transfer. A one-way slab transfers load mainly in one direction, while a two-way slab transfers load in both directions.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the formula to identify one-way slab and two-way slab?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'Use the span ratio Ly/Lx, where Ly is the longer span and Lx is the shorter span. If Ly/Lx is greater than or equal to 2, it is generally treated as a one-way slab. If Ly/Lx is less than 2, it is generally treated as a two-way slab.',
      },
    },
    {
      '@type': 'Question',
      name: 'In which direction is main reinforcement provided in one-way slab?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'In a one-way slab, main reinforcement is provided along the shorter span direction because load is mainly transferred in one direction.',
      },
    },
    {
      '@type': 'Question',
      name: 'In which direction is reinforcement provided in two-way slab?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'In a two-way slab, reinforcement is provided in both directions because bending moment develops along both spans.',
      },
    },
    {
      '@type': 'Question',
      name: 'Which slab is better, one-way slab or two-way slab?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'Neither slab is universally better. A one-way slab is suitable for long and narrow panels, while a two-way slab is suitable for square or nearly square panels supported on all four sides.',
      },
    },
  ],
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'TechArticle',
  headline:
    'One-Way Slab vs Two-Way Slab: Difference, Formula and Design Guide',
  description:
    'A practical civil engineering guide explaining one-way slab and two-way slab differences, span ratio formula, load transfer direction, reinforcement detailing and examples.',
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
    'One-way slab',
    'Two-way slab',
    'RCC slab design',
    'Civil engineering calculator',
    'Reinforced concrete design',
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
      name: 'One-Way Slab vs Two-Way Slab',
      item: pageUrl,
    },
  ],
}

export default function OneWayVsTwoWaySlabPage() {
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
          RCC SLAB DESIGN GUIDE
        </p>

        <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
          One-Way Slab vs Two-Way Slab
        </h1>

        <p className="text-slate-300 text-lg lg:text-xl mb-8 leading-8 max-w-4xl">
          Learn the difference between one-way slab and two-way slab with span
          ratio formula, load transfer direction, reinforcement detailing,
          comparison table, practical examples, FAQs and slab design
          calculators.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Link
            href="/one-way-slab-calculator"
            className="bg-orange-500 hover:bg-orange-600 transition px-6 py-4 rounded-xl font-semibold text-center"
          >
            Open One-Way Slab Calculator
          </Link>

          <Link
            href="/two-way-slab-calculator"
            className="bg-slate-900 hover:bg-slate-800 border border-slate-700 transition px-6 py-4 rounded-xl font-semibold text-center"
          >
            Open Two-Way Slab Calculator
          </Link>
        </div>

        <section className="bg-orange-500/10 border border-orange-500/30 rounded-2xl p-6 lg:p-8 mb-10">
          <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">
            Quick Answer
          </h2>

          <p className="text-slate-200 leading-8 text-lg">
            A <strong>one-way slab</strong> transfers load mainly in one
            direction and is generally used when{' '}
            <strong>Ly / Lx ≥ 2</strong>. A <strong>two-way slab</strong>{' '}
            transfers load in both directions and is generally used when{' '}
            <strong>Ly / Lx &lt; 2</strong>. Here, Ly is the longer span and Lx
            is the shorter span.
          </p>
        </section>

        <section className="space-y-8">
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Main Difference Between One-Way Slab and Two-Way Slab
            </h2>

            <p className="text-slate-300 leading-7">
              The main difference between one-way slab and two-way slab is the
              direction of load transfer. A one-way slab transfers load mainly
              in one direction, while a two-way slab transfers load in both
              directions. The slab type is commonly decided using the span ratio
              of longer span to shorter span.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Slab Type Formula
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
                <h3 className="font-semibold text-orange-400 mb-2">
                  One-Way Slab
                </h3>
                <p className="text-slate-200 font-mono text-2xl">
                  Ly / Lx ≥ 2
                </p>
                <p className="text-slate-400 mt-3 text-sm">
                  Load mainly transfers in one direction.
                </p>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
                <h3 className="font-semibold text-orange-400 mb-2">
                  Two-Way Slab
                </h3>
                <p className="text-slate-200 font-mono text-2xl">
                  Ly / Lx &lt; 2
                </p>
                <p className="text-slate-400 mt-3 text-sm">
                  Load transfers in both directions.
                </p>
              </div>
            </div>

            <p className="text-slate-300 leading-7 mt-5">
              Here, <strong>Ly</strong> is the longer span and{' '}
              <strong>Lx</strong> is the shorter span of the slab panel.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 overflow-x-auto">
            <h2 className="text-2xl font-bold text-white mb-4">
              One-Way Slab vs Two-Way Slab Comparison Table
            </h2>

            <table className="w-full border-collapse text-left text-slate-300">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="py-3 pr-4 text-white">Point</th>
                  <th className="py-3 pr-4 text-white">One-Way Slab</th>
                  <th className="py-3 pr-4 text-white">Two-Way Slab</th>
                </tr>
              </thead>

              <tbody>
                <tr className="border-b border-slate-800">
                  <td className="py-3 pr-4">Span Ratio</td>
                  <td className="py-3 pr-4">Ly / Lx ≥ 2</td>
                  <td className="py-3 pr-4">Ly / Lx &lt; 2</td>
                </tr>

                <tr className="border-b border-slate-800">
                  <td className="py-3 pr-4">Load Transfer</td>
                  <td className="py-3 pr-4">Mainly one direction</td>
                  <td className="py-3 pr-4">Both directions</td>
                </tr>

                <tr className="border-b border-slate-800">
                  <td className="py-3 pr-4">Support Condition</td>
                  <td className="py-3 pr-4">Usually two opposite sides</td>
                  <td className="py-3 pr-4">Usually all four sides</td>
                </tr>

                <tr className="border-b border-slate-800">
                  <td className="py-3 pr-4">Main Reinforcement</td>
                  <td className="py-3 pr-4">Shorter span direction</td>
                  <td className="py-3 pr-4">Both directions</td>
                </tr>

                <tr className="border-b border-slate-800">
                  <td className="py-3 pr-4">Common Use</td>
                  <td className="py-3 pr-4">
                    Corridors, balconies, verandahs and rectangular panels
                  </td>
                  <td className="py-3 pr-4">
                    Square rooms, floor panels and slabs supported on four sides
                  </td>
                </tr>

                <tr>
                  <td className="py-3 pr-4">Reinforcement Detailing</td>
                  <td className="py-3 pr-4">
                    Main bars in shorter span, distribution bars in longer span
                  </td>
                  <td className="py-3 pr-4">
                    Main reinforcement is required in both directions
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4">
                What is One-Way Slab?
              </h2>

              <p className="text-slate-300 leading-7 mb-4">
                A one-way slab is a reinforced concrete slab that bends and
                transfers load mainly in one direction. It is generally used
                when the longer span is at least twice the shorter span.
              </p>

              <p className="text-slate-300 leading-7">
                In one-way slab design, main reinforcement is provided along the
                shorter span direction, and distribution reinforcement is
                provided along the longer span direction.
              </p>
            </div>

            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4">
                What is Two-Way Slab?
              </h2>

              <p className="text-slate-300 leading-7 mb-4">
                A two-way slab is a reinforced concrete slab that transfers load
                in both directions. It is generally used when the longer span to
                shorter span ratio is less than 2.
              </p>

              <p className="text-slate-300 leading-7">
                In two-way slab design, main reinforcement is provided in both
                directions because bending moment develops along both spans.
              </p>
            </div>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Practical Example
            </h2>

            <p className="text-slate-300 leading-7">
              Suppose a slab panel has shorter span 3 m and longer span 7 m.
            </p>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 my-5">
              <p className="text-slate-300 leading-8 font-mono">
                Span Ratio = Ly / Lx
                <br />
                Span Ratio = 7 / 3
                <br />
                Span Ratio = 2.33
              </p>
            </div>

            <p className="text-slate-300 leading-7">
              Since the span ratio is greater than 2, this slab behaves as a
              one-way slab.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Which Slab Should You Use?
            </h2>

            <p className="text-slate-300 leading-7">
              Use a one-way slab when the slab panel is long and narrow, where
              the longer span is at least twice the shorter span. Use a two-way
              slab when the slab panel is square or nearly square and supported
              on all four sides.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-5">
              Frequently Asked Questions
            </h2>

            <div className="space-y-5">
              <div>
                <h3 className="font-semibold text-white mb-2">
                  What is the main difference between one-way slab and two-way
                  slab?
                </h3>
                <p className="text-slate-300 leading-7">
                  The main difference is the direction of load transfer. A
                  one-way slab transfers load mainly in one direction, while a
                  two-way slab transfers load in both directions.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-2">
                  What is the formula to identify one-way slab and two-way slab?
                </h3>
                <p className="text-slate-300 leading-7">
                  Use the span ratio Ly/Lx. If Ly/Lx is greater than or equal
                  to 2, it is generally considered a one-way slab. If Ly/Lx is
                  less than 2, it is generally considered a two-way slab.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-2">
                  Which direction is main reinforcement provided in one-way
                  slab?
                </h3>
                <p className="text-slate-300 leading-7">
                  In a one-way slab, main reinforcement is provided along the
                  shorter span direction because the slab primarily bends in one
                  direction.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-2">
                  Which slab is better for square rooms?
                </h3>
                <p className="text-slate-300 leading-7">
                  A two-way slab is generally more suitable for square or nearly
                  square rooms because the load is transferred in both
                  directions.
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
                  href="/beam-design"
                  className="text-orange-400 hover:text-orange-300"
                >
                  Beam Design Calculator
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
                  href="/concrete-volume-calculator"
                  className="text-orange-400 hover:text-orange-300"
                >
                  Concrete Volume Calculator
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
              href="/civil-engineering-calculators"
              className="inline-block border border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white transition px-6 py-3 rounded-xl font-semibold"
            >
              View All Civil Engineering Calculators
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}
