import Link from 'next/link'

export const metadata = {
  title: 'Site Diary Tool Online | Construction Daily Progress Report',
  description:
    'Create construction site diary, daily progress report, labour report, material tracking, work progress, site engineer diary and PDF reports online with CivilCalc Pro.',
  keywords: [
    'site diary tool',
    'construction site diary',
    'site engineer diary',
    'daily progress report',
    'construction daily report',
    'civil site diary',
    'site diary app',
    'material tracking construction',
    'labour report construction',
    'construction management tool India',
  ],
  alternates: {
    canonical: 'https://www.civilcalcpro.in/site-diary-tool',
  },
  openGraph: {
    title: 'Site Diary Tool Online | CivilCalc Pro',
    description:
      'Create construction site diary, daily progress report, labour report, material tracking and PDF site reports online.',
    url: 'https://www.civilcalcpro.in/site-diary-tool',
    siteName: 'CivilCalc Pro',
    type: 'article',
  },
}

const faqs = [
  {
    q: 'What is a site diary in construction?',
    a: 'A site diary is a daily construction record used to note work progress, labour attendance, material usage, machinery, weather, issues, instructions and daily site activities.',
  },
  {
    q: 'Why is a site diary important for civil engineers?',
    a: 'A site diary helps civil engineers maintain daily records, track site progress, verify labour and material usage, prepare reports and avoid disputes in construction projects.',
  },
  {
    q: 'What should be included in a construction site diary?',
    a: 'A construction site diary should include project details, date, weather, work completed, labour count, material received, material used, machinery, site photos, issues and remarks.',
  },
  {
    q: 'Can a site diary be used for daily progress reports?',
    a: 'Yes, site diary data can be used to create daily progress reports, weekly summaries, monthly reports, contractor reports and owner updates.',
  },
  {
    q: 'Who can use CivilCalc Pro Site Diary Tool?',
    a: 'Civil engineers, site engineers, contractors, builders, supervisors, project managers and construction companies can use CivilCalc Pro Site Diary Tool.',
  },
]

export default function SiteDiaryToolArticle() {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Site Diary Tool Online | Construction Daily Progress Report',
    description:
      'Complete guide to construction site diary, daily progress report, labour report, material tracking and site documentation.',
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
      '@id': 'https://www.civilcalcpro.in/site-diary-tool',
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

  const diarySections = [
    ['Project Details', 'Project name, client name, location, date and site engineer details'],
    ['Daily Work Progress', 'Work completed today, activity description and work location'],
    ['Labour Report', 'Mason, helper, carpenter, bar bender, electrician, plumber and other labour count'],
    ['Material Report', 'Material received, material used and remaining stock on site'],
    ['Machinery Report', 'Mixer, vibrator, JCB, crane, cutting machine and other equipment usage'],
    ['Site Issues', 'Delay reasons, site problems, safety issues and pending work'],
    ['Photos and Remarks', 'Site photos, engineer remarks, owner notes and contractor instructions'],
    ['PDF Report', 'Daily, weekly or custom date range report for owner and project records'],
  ]

  const useCases = [
    'Daily construction progress report',
    'Site engineer daily diary',
    'Labour attendance record',
    'Material usage tracking',
    'Owner daily project update',
    'Contractor work verification',
    'Weekly construction summary',
    'PDF site report generation',
    'Construction dispute record',
    'Project documentation and monitoring',
  ]

  const inputs = [
    'Project name',
    'Site location',
    'Date',
    'Work completed today',
    'Labour category and count',
    'Material received',
    'Material used',
    'Remaining material stock',
    'Machinery used',
    'Site issues or remarks',
    'Site photos',
    'Prepared by',
  ]

  const benefits = [
    'Keeps daily construction records organized',
    'Helps owner understand site progress clearly',
    'Tracks labour, material and work progress',
    'Reduces manual diary and WhatsApp confusion',
    'Helps generate professional PDF reports',
    'Improves contractor and site engineer communication',
    'Useful for billing, verification and project history',
    'Saves time for site engineers and project managers',
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
          Construction Management Article
        </p>

        <h1 className="max-w-4xl text-4xl font-extrabold leading-tight md:text-5xl">
          Site Diary Tool Online – Construction Daily Progress Report and Material Tracking
        </h1>

        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
          Use CivilCalc Pro Site Diary Tool to create construction site diary,
          daily progress report, labour report, material tracking, machinery record,
          site remarks and PDF reports for civil engineering projects.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/dashboard/calculators/site-diary"
            className="rounded-xl bg-orange-500 px-6 py-3 font-bold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600"
          >
            Open Site Diary Tool
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
              What is a Site Diary in Construction?
            </h2>

            <p className="leading-8">
              A site diary is a daily construction record used by site engineers,
              supervisors, contractors and project managers to record what happened
              on site each day. It includes work progress, labour attendance, material
              received, material used, machinery, weather condition, site issues and
              important remarks.
            </p>

            <p className="mt-4 leading-8">
              CivilCalc Pro Site Diary Tool helps construction teams maintain site
              records digitally instead of using manual notebooks, scattered photos
              and WhatsApp messages. It makes daily site reporting faster, cleaner
              and more professional.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Why Site Diary is Important for Civil Engineers
            </h2>

            <p className="leading-8">
              In construction projects, daily records are very important. A site diary
              helps engineers track work completed, labour strength, material usage,
              site problems and project progress. It also helps owners understand
              what is happening on site without calling the site engineer again and
              again.
            </p>

            <p className="mt-4 leading-8">
              A proper site diary can help in billing verification, contractor
              discussion, project delay tracking, material reconciliation and future
              reference. It also works as a professional record if there is any
              dispute about work progress or material usage.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              What CivilCalc Pro Site Diary Tool Can Record
            </h2>

            <p className="leading-8">
              A good construction site diary should cover all important daily site
              activities. CivilCalc Pro Site Diary Tool is designed to help users
              record the following details:
            </p>

            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-800">
              <table className="w-full border-collapse text-left">
                <thead className="bg-slate-900">
                  <tr>
                    <th className="border-b border-slate-800 px-4 py-3 text-white">
                      Section
                    </th>
                    <th className="border-b border-slate-800 px-4 py-3 text-white">
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {diarySections.map((row) => (
                    <tr key={row[0]} className="bg-slate-900/40">
                      <td className="border-b border-slate-800 px-4 py-3">
                        {row[0]}
                      </td>
                      <td className="border-b border-slate-800 px-4 py-3">
                        {row[1]}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Daily Progress Report for Construction Site
            </h2>

            <p className="leading-8">
              A daily progress report shows what work was completed on a particular
              day. For example, excavation completed, PCC done, footing reinforcement
              placed, column shuttering completed, slab concrete poured, brickwork
              completed or plaster work started.
            </p>

            <p className="mt-4 leading-8">
              CivilCalc Pro Site Diary Tool helps site engineers prepare daily
              progress reports in a structured format. This makes it easier to share
              project updates with owners, contractors, project managers and office
              teams.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Labour Report and Attendance Tracking
            </h2>

            <p className="leading-8">
              Labour tracking is one of the most important parts of site management.
              The site engineer can record how many masons, helpers, carpenters, bar
              benders, electricians, plumbers, painters or tile workers were present
              on site.
            </p>

            <p className="mt-4 leading-8">
              This helps in labour cost control, contractor verification, productivity
              checking and daily work planning. Labour records are also useful for
              billing and monthly labour summary.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Material Tracking in Site Diary
            </h2>

            <p className="leading-8">
              Material tracking helps users record material received, material used
              and remaining material stock on site. Materials like cement bags, sand,
              aggregate, steel, bricks, tiles, paint, shuttering items and scaffolding
              items can be tracked daily.
            </p>

            <p className="mt-4 leading-8">
              This is useful for owners and contractors because they can understand
              how much material came to site, how much was used and how much is still
              available. It also helps reduce material wastage and misuse.
            </p>

            <div className="my-6 rounded-2xl border border-orange-500/30 bg-slate-900 p-5">
              <p className="text-xl font-bold text-orange-300">
                Current Stock = Opening Stock + Material Received - Material Used
              </p>
            </div>

            <p className="leading-8">
              This simple tracking system can make construction material management
              much clearer for daily site work.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Inputs Required in Site Diary Tool
            </h2>

            <p className="leading-8">
              To create a proper site diary or daily progress report, the following
              inputs are commonly required:
            </p>

            <ul className="list-disc space-y-2 pl-6 leading-8">
              {inputs.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Example of Construction Site Diary Entry
            </h2>

            <p className="leading-8">
              A simple site diary entry may look like this:
            </p>

            <div className="my-6 rounded-2xl border border-slate-700 bg-slate-900 p-5 leading-8">
              <p>Project: Residential Building</p>
              <p>Date: 27 June</p>
              <p>Work Completed: Ground floor column shuttering completed</p>
              <p>Labour: 2 carpenters, 3 helpers, 1 site engineer</p>
              <p>Material Used: Shuttering plates, props, binding wire</p>
              <p>Issue: Rain delay for 1 hour</p>
              <p>Remark: Concrete planned for next morning</p>
            </div>

            <p className="leading-8">
              This type of daily entry helps maintain a clean record of site progress
              and construction activity.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              PDF Report for Owner and Project Records
            </h2>

            <p className="leading-8">
              One of the most useful features of a digital site diary is PDF report
              generation. Site engineers can create a daily report, weekly report or
              custom date range report and share it with the owner or project team.
            </p>

            <p className="mt-4 leading-8">
              A PDF site report makes the project record professional. It can include
              work progress, labour count, material report, remarks and summary. This
              helps owners check project progress clearly.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Where Site Diary Tool is Used
            </h2>

            <ul className="list-disc space-y-2 pl-6 leading-8">
              {useCases.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Site Diary Tool for Owners, Contractors and Site Engineers
            </h2>

            <p className="leading-8">
              CivilCalc Pro Site Diary Tool is useful for all construction project
              stakeholders. Site engineers can record daily progress, contractors can
              verify work and labour, and owners can understand site status without
              depending only on calls or photos.
            </p>

            <p className="mt-4 leading-8">
              It helps bring transparency between owner, contractor and site team. A
              digital site diary also saves time and keeps every important site record
              in one place.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Benefits of CivilCalc Pro Site Diary Tool
            </h2>

            <ul className="list-disc space-y-2 pl-6 leading-8">
              {benefits.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-5">
            <h2 className="mb-3 text-2xl font-bold text-white">
              Important Site Record Note
            </h2>

            <p className="leading-8 text-slate-300">
              Site diary records should be filled honestly and regularly. For
              important projects, records should be checked with drawings,
              measurements, contractor bills, site photos and project specifications.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-white">Conclusion</h2>

            <p className="leading-8">
              A site diary is an essential tool for construction site management.
              CivilCalc Pro Site Diary Tool helps civil engineers, contractors, site
              engineers, supervisors and owners record daily work progress, labour,
              material usage, machinery, issues and remarks in a professional way.
            </p>

            <p className="mt-4 leading-8">
              For better site documentation, progress tracking, material control and
              PDF reporting, use CivilCalc Pro Site Diary Tool for your construction
              project.
            </p>
          </section>

          <div className="rounded-3xl border border-orange-500/30 bg-gradient-to-br from-orange-500/15 to-slate-900 p-6">
            <h2 className="text-2xl font-extrabold text-white">
              Create Construction Site Diary Instantly
            </h2>

            <p className="mt-3 leading-8 text-slate-300">
              Open CivilCalc Pro Site Diary Tool and record daily progress, labour,
              material usage, machinery, site issues and owner-ready PDF reports.
            </p>

            <Link
              href="/dashboard/calculators/site-diary"
              className="mt-5 inline-flex rounded-xl bg-orange-500 px-6 py-3 font-bold text-white transition hover:bg-orange-600"
            >
              Use Site Diary Tool
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
