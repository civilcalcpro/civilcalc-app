import Link from 'next/link'

export const metadata = {
  title: 'IS Code Library for Civil Engineering | Indian Standard Codes',
  description:
    'Access civil engineering IS codes reference for RCC, steel, concrete, loads, earthquake design, mix design, reinforcement and construction standards with CivilCalc Pro.',
  keywords: [
    'IS code library',
    'civil engineering IS codes',
    'Indian standard codes civil engineering',
    'IS 456',
    'IS 800',
    'IS 875',
    'IS 1893',
    'IS 13920',
    'IS 10262',
    'civil engineering code book',
    'construction standards India',
  ],
  alternates: {
    canonical: 'https://www.civilcalcpro.in/is-code-library',
  },
  openGraph: {
    title: 'IS Code Library for Civil Engineering | CivilCalc Pro',
    description:
      'Find important Indian Standard codes used in civil engineering design, RCC, steel, concrete, loads and construction work.',
    url: 'https://www.civilcalcpro.in/is-code-library',
    siteName: 'CivilCalc Pro',
    type: 'article',
  },
}

const faqs = [
  {
    q: 'What is an IS Code Library?',
    a: 'An IS Code Library is a reference collection of Indian Standard codes used by civil engineers for design, construction, testing and quality control.',
  },
  {
    q: 'Which IS code is used for RCC design?',
    a: 'IS 456 is commonly used for plain and reinforced concrete design in India.',
  },
  {
    q: 'Which IS code is used for steel design?',
    a: 'IS 800 is commonly used for general steel structure design in India.',
  },
  {
    q: 'Which IS code is used for earthquake design?',
    a: 'IS 1893 is commonly used for earthquake resistant design criteria in India.',
  },
  {
    q: 'Can I use this library as a replacement for official IS codes?',
    a: 'No. CivilCalc Pro IS Code Library is a reference guide. For final design and legal use, engineers should verify details from official BIS publications and project specifications.',
  },
]

export default function ISCodeLibraryArticle() {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'IS Code Library for Civil Engineering | Indian Standard Codes',
    description:
      'Complete guide to important IS codes used in civil engineering, RCC design, steel design, concrete mix design, loads and earthquake resistant construction.',
    author: {
      '@type': 'Organization',
      name: 'CivilCalc Pro',
    },
    publisher: {
      '@type': 'Organization',
      name: 'CivilCalc Pro',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': 'https://www.civilcalcpro.in/is-code-library',
    },
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  }

  const codeTable = [
    ['IS 456', 'Plain and reinforced concrete design', 'RCC beams, slabs, columns, footings and concrete structures'],
    ['IS 800', 'General construction in steel', 'Steel structure design and steel member checking'],
    ['IS 875', 'Design loads for buildings and structures', 'Dead load, live load, wind load and other building loads'],
    ['IS 1893', 'Earthquake resistant design criteria', 'Seismic design and earthquake load calculation'],
    ['IS 13920', 'Ductile detailing of reinforced concrete structures', 'Earthquake resistant RCC detailing'],
    ['IS 10262', 'Concrete mix design guidelines', 'Concrete mix proportioning and mix design'],
    ['IS 383', 'Coarse and fine aggregate specification', 'Aggregate quality and grading for concrete'],
    ['IS 1786', 'High strength deformed steel bars', 'TMT bars and reinforcement steel'],
    ['IS 516', 'Concrete strength testing', 'Concrete cube testing and strength testing reference'],
    ['IS 1199', 'Fresh concrete testing', 'Workability and fresh concrete tests'],
    ['IS 3370', 'Concrete structures for retaining aqueous liquids', 'Water tanks and liquid retaining structures'],
    ['IS 1343', 'Prestressed concrete', 'Prestressed concrete design reference'],
  ]

  const categories = [
    {
      title: 'RCC Design Codes',
      desc: 'Codes used for reinforced concrete design, detailing, concrete strength, durability and structural design checks.',
      items: ['IS 456', 'IS 13920', 'IS 3370', 'IS 1343'],
    },
    {
      title: 'Steel Design Codes',
      desc: 'Codes used for steel structures, steel sections, member design and structural steel construction.',
      items: ['IS 800', 'IS 808', 'IS 875'],
    },
    {
      title: 'Load Calculation Codes',
      desc: 'Codes used for dead load, live load, wind load, earthquake load and load combinations.',
      items: ['IS 875', 'IS 1893'],
    },
    {
      title: 'Concrete Material Codes',
      desc: 'Codes used for concrete mix design, cement, aggregate, reinforcement and testing.',
      items: ['IS 10262', 'IS 383', 'IS 1786', 'IS 516', 'IS 1199'],
    },
  ]

  const useCases = [
    'RCC beam design reference',
    'RCC column design reference',
    'Slab design and detailing',
    'Footing and foundation design',
    'Steel structure design',
    'Concrete mix design',
    'Dead load and live load calculation',
    'Wind load reference',
    'Earthquake resistant design',
    'Civil engineering exam and study reference',
    'Site engineering quality checking',
    'Construction specification reference',
  ]

  const benefits = [
    'Find important civil engineering IS codes in one place',
    'Useful for RCC, steel, concrete and load references',
    'Helps students understand which code is used for which topic',
    'Useful for civil engineers during design checking',
    'Helps site engineers connect calculations with relevant standards',
    'Improves professional workflow for civil engineering tools',
    'Supports construction estimation, design and learning',
  ]

  return (
    <main className="min-h-screen bg-[#050B1F] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <section className="mx-auto max-w-5xl px-5 py-16">
        <p className="mb-3 text-sm font-bold uppercase tracking-wider text-orange-400">
          Civil Engineering Reference
        </p>

        <h1 className="max-w-4xl text-4xl font-extrabold leading-tight md:text-5xl">
          IS Code Library for Civil Engineering – Indian Standard Codes Reference
        </h1>

        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
          Use CivilCalc Pro IS Code Library to understand important Indian Standard
          codes used in civil engineering for RCC design, steel design, concrete mix
          design, load calculation, earthquake resistant design and construction
          quality control.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/dashboard/calculators/is-code-library"
            className="rounded-xl bg-orange-500 px-6 py-3 font-bold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600"
          >
            Open IS Code Library
          </Link>

          <Link
            href="/"
            className="rounded-xl border border-slate-700 px-6 py-3 font-bold text-slate-200 transition hover:border-orange-400 hover:text-orange-300"
          >
            Back to Home
          </Link>
        </div>

        <article className="mt-12 space-y-10 text-slate-300">
          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              What is an IS Code Library?
            </h2>

            <p className="leading-8">
              An IS Code Library is a reference collection of Indian Standard codes
              used in civil engineering design, construction, testing, quality control
              and site execution. Civil engineers use IS codes to follow standard
              design methods, material specifications and construction practices.
            </p>

            <p className="mt-4 leading-8">
              CivilCalc Pro IS Code Library helps civil engineers, site engineers,
              contractors, students and construction professionals quickly identify
              which IS code is commonly used for RCC design, steel design, concrete
              mix design, load calculation and earthquake resistant design.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Why IS Codes are Important in Civil Engineering
            </h2>

            <p className="leading-8">
              IS codes are important because civil engineering design and construction
              work must follow standard rules for safety, durability, quality and
              serviceability. Without proper code reference, structural design and
              site execution can become unsafe or inconsistent.
            </p>

            <p className="mt-4 leading-8">
              IS codes help engineers design RCC members, steel structures,
              foundations, concrete mixes, load combinations and earthquake resistant
              structures. They are also useful for material testing, site quality
              control, tender specifications and engineering education.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Important IS Codes for Civil Engineering
            </h2>

            <p className="leading-8">
              The following table gives a quick reference of commonly used IS codes in
              civil engineering. This table is for learning and reference purpose, and
              final details should be verified from official publications.
            </p>

            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-800">
              <table className="w-full border-collapse text-left">
                <thead className="bg-slate-900">
                  <tr>
                    <th className="border-b border-slate-800 px-4 py-3 text-white">
                      IS Code
                    </th>
                    <th className="border-b border-slate-800 px-4 py-3 text-white">
                      Topic
                    </th>
                    <th className="border-b border-slate-800 px-4 py-3 text-white">
                      Common Use
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {codeTable.map((row) => (
                    <tr key={row[0]} className="bg-slate-900/40">
                      <td className="border-b border-slate-800 px-4 py-3 font-bold text-orange-300">
                        {row[0]}
                      </td>
                      <td className="border-b border-slate-800 px-4 py-3">
                        {row[1]}
                      </td>
                      <td className="border-b border-slate-800 px-4 py-3">
                        {row[2]}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              IS 456 for RCC Design
            </h2>

            <p className="leading-8">
              IS 456 is one of the most important IS codes for civil engineers. It is
              commonly used for plain and reinforced concrete design. RCC beams,
              columns, slabs, footings and many concrete structures are designed with
              reference to this code.
            </p>

            <p className="mt-4 leading-8">
              CivilCalc Pro tools such as RCC Beam Design, Column Design, Footing
              Design and Slab Design are connected with practical RCC design concepts
              that civil engineers commonly study with IS 456 reference.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              IS 800 for Steel Structure Design
            </h2>

            <p className="leading-8">
              IS 800 is commonly used for general construction in steel. It is useful
              for steel beams, columns, connections, compression members, tension
              members and steel structure design checks.
            </p>

            <p className="mt-4 leading-8">
              Steel design requires checking strength, stability, slenderness,
              buckling, connections and serviceability. IS 800 is an important
              reference for structural steel design in India.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              IS 875 for Building Loads
            </h2>

            <p className="leading-8">
              IS 875 is used for design loads on buildings and structures. Load
              calculation is required before structural design because beams, columns,
              slabs and foundations must safely carry dead load, live load, wind load
              and other applicable loads.
            </p>

            <p className="mt-4 leading-8">
              Civil engineers use load calculation for RCC design, steel design,
              foundation design and structural analysis. Correct load assessment is
              one of the first steps in safe structural design.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              IS 1893 and IS 13920 for Earthquake Resistant Design
            </h2>

            <p className="leading-8">
              IS 1893 is commonly used for earthquake resistant design criteria, while
              IS 13920 is used for ductile detailing of reinforced concrete
              structures. These codes are important for seismic design and detailing
              in earthquake-prone regions.
            </p>

            <p className="mt-4 leading-8">
              Earthquake resistant design is not only about member size. Proper
              detailing, ductility, reinforcement anchorage and load path are also
              important for structural safety.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              IS 10262 for Concrete Mix Design
            </h2>

            <p className="leading-8">
              IS 10262 is commonly used for concrete mix proportioning. Concrete mix
              design helps engineers decide cement, water, fine aggregate, coarse
              aggregate and admixture proportions for a required concrete grade and
              workability.
            </p>

            <p className="mt-4 leading-8">
              CivilCalc Pro Concrete Calculator and Concrete Mix tools help users
              understand practical concrete quantity and mix proportion concepts.
              Final mix design should be checked with project specifications and
              laboratory trial results.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              IS Code Categories in Civil Engineering
            </h2>

            <div className="grid gap-5 md:grid-cols-2">
              {categories.map((category) => (
                <div
                  key={category.title}
                  className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5"
                >
                  <h3 className="text-xl font-bold text-white">{category.title}</h3>
                  <p className="mt-3 leading-7 text-slate-400">{category.desc}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {category.items.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-sm font-bold text-orange-300"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Where IS Code Library is Used
            </h2>

            <ul className="list-disc space-y-2 pl-6 leading-8">
              {useCases.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              IS Code Library for Civil Engineering Students
            </h2>

            <p className="leading-8">
              Civil engineering students often study RCC design, steel design,
              geotechnical engineering, concrete technology, structural analysis and
              earthquake engineering. IS Code Library helps students understand which
              standard is connected with which topic.
            </p>

            <p className="mt-4 leading-8">
              This makes learning easier because students can connect formulas,
              design steps and practical construction topics with the relevant Indian
              Standard code.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              IS Code Library for Site Engineers and Contractors
            </h2>

            <p className="leading-8">
              Site engineers and contractors can use an IS Code Library as a quick
              reference to understand which standards are commonly connected with
              materials, RCC work, reinforcement, concrete testing, loads and
              construction quality.
            </p>

            <p className="mt-4 leading-8">
              It helps improve communication between design engineers, site teams,
              contractors and project owners because everyone can refer to standard
              construction terminology and code references.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Benefits of CivilCalc Pro IS Code Library
            </h2>

            <ul className="list-disc space-y-2 pl-6 leading-8">
              {benefits.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-5">
            <h2 className="mb-3 text-2xl font-bold text-white">
              Important IS Code Note
            </h2>

            <p className="leading-8 text-slate-300">
              CivilCalc Pro IS Code Library is a learning and reference guide. It does
              not replace official BIS standards, licensed code books, approved
              drawings or structural engineer verification. For final design,
              construction approval and legal use, always check the latest official
              standard and project specification.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">Conclusion</h2>

            <p className="leading-8">
              IS codes are essential for civil engineering design, construction and
              quality control. CivilCalc Pro IS Code Library helps civil engineers,
              site engineers, contractors and students understand important Indian
              Standard codes used for RCC design, steel design, concrete mix design,
              load calculation and earthquake resistant design.
            </p>

            <p className="mt-4 leading-8">
              For better engineering reference, construction learning and design
              awareness, use CivilCalc Pro IS Code Library along with official
              standards and professional engineering judgment.
            </p>
          </section>

          <div className="rounded-3xl border border-orange-500/30 bg-gradient-to-br from-orange-500/15 to-slate-900 p-6">
            <h2 className="text-2xl font-extrabold text-white">
              Explore Civil Engineering IS Codes
            </h2>

            <p className="mt-3 leading-8 text-slate-300">
              Open CivilCalc Pro IS Code Library and find important code references
              for RCC, steel, concrete, loads, earthquake design and construction.
            </p>

            <Link
              href="/dashboard/calculators/is-code-library"
              className="mt-5 inline-flex rounded-xl bg-orange-500 px-6 py-3 font-bold text-white transition hover:bg-orange-600"
            >
              Use IS Code Library
            </Link>
          </div>

          <section>
            <h2 className="mb-6 text-3xl font-bold text-white">FAQs</h2>

            <div className="space-y-5">
              {faqs.map((item) => (
                <div
                  key={item.q}
                  className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5"
                >
                  <h3 className="text-xl font-bold text-white">{item.q}</h3>
                  <p className="mt-2 leading-8 text-slate-300">{item.a}</p>
                </div>
              ))}
            </div>
          </section>
        </article>
      </section>
    </main>
  )
}
