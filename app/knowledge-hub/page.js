import Link from 'next/link'
import {
  BookOpen,
  Layers,
  ClipboardCheck,
  Building2,
  FlaskConical,
  AlertTriangle,
  Calculator,
  HardHat,
  FileText,
  ShieldCheck,
  Wrench,
  GraduationCap,
} from 'lucide-react'

const hubCategories = [
  {
    title: 'Material Guide',
    desc: 'Cement, steel, sand, aggregate, bricks, concrete and construction materials explained.',
    href: '/dashboard/knowledge-hub/materials',
    icon: Layers,
  },
  {
    title: 'Formula Library',
    desc: 'RCC, concrete, estimation, steel, soil, surveying and hydraulics formulas.',
    href: '/dashboard/knowledge-hub/formulas',
    icon: Calculator,
  },
  {
    title: 'Site Engineer Checklist',
    desc: 'Excavation, PCC, footing, column, beam, slab, plaster and finishing checklists.',
    href: '/dashboard/knowledge-hub/checklists',
    icon: ClipboardCheck,
  },
  {
    title: 'Construction Process',
    desc: 'Step-by-step building construction process from land planning to finishing.',
    href: '/dashboard/knowledge-hub/construction-process',
    icon: Building2,
  },
  {
    title: 'Testing Guide',
    desc: 'Slump test, cube test, sieve analysis, core test and other site/lab tests.',
    href: '/dashboard/knowledge-hub/testing',
    icon: FlaskConical,
  },
  {
    title: 'Construction Defects Library',
    desc: 'Honeycombing, cracks, dampness, segregation and common defects with solutions.',
    href: '/dashboard/knowledge-hub/defects',
    icon: AlertTriangle,
  },
  {
    title: 'BOQ Guide',
    desc: 'Learn BOQ basics, quantity takeoff, item description and cost summary.',
    href: '/dashboard/knowledge-hub/boq-guide',
    icon: FileText,
  },
  {
    title: 'Safety Hub',
    desc: 'PPE, toolbox talk, risk assessment and construction site safety basics.',
    href: '/dashboard/knowledge-hub/safety',
    icon: ShieldCheck,
  },
  {
    title: 'Equipment Guide',
    desc: 'Excavator, transit mixer, vibrator, total station and site equipment usage.',
    href: '/dashboard/knowledge-hub/equipment',
    icon: Wrench,
  },
  {
    title: 'Interview Preparation',
    desc: 'Civil engineering interview questions, answers and practical site concepts.',
    href: '/dashboard/knowledge-hub/interview-preparation',
    icon: GraduationCap,
  },
]

export const metadata = {
  title: 'Civil Engineering Knowledge Hub | CivilCalc Pro',
  description:
    'Civil engineering formulas, materials guide, site engineer checklists, construction process, testing guide, defects library and practical civil knowledge.',
}

export default function KnowledgeHubPage() {
  return (
    <main className="min-h-screen bg-[#050B1F] text-white">
      <section className="relative overflow-hidden px-4 py-16 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-blue-500/10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,122,0,0.16),transparent_35%)]" />

        <div className="relative mx-auto max-w-7xl">
          <div className="mb-12 max-w-4xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-sm text-orange-300">
              <BookOpen size={16} />
              CivilCalc Pro Knowledge Hub
            </div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Civil Engineering Knowledge Hub
            </h1>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
              Learn civil engineering formulas, material properties, site
              checklists, construction stages, testing methods, common defects
              and practical site knowledge in one place.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/dashboard"
                className="rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600"
              >
                Open Calculators
              </Link>

              <Link
  href="/dashboard/knowledge-hub"
  className="rounded-xl border border-slate-700 px-6 py-3 font-semibold text-slate-200 transition hover:border-orange-500/60 hover:text-orange-300"
>
  Login to Explore Full Hub
</Link>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {hubCategories.map((item) => {
              const Icon = item.icon

              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className="group rounded-2xl border border-slate-800 bg-slate-900/70 p-6 transition hover:-translate-y-1 hover:border-orange-500/50 hover:bg-slate-900"
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400 group-hover:bg-orange-500 group-hover:text-white">
                    <Icon size={24} />
                  </div>

                  <h2 className="text-xl font-bold text-white">
                    {item.title}
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    {item.desc}
                  </p>

                  <p className="mt-5 text-sm font-semibold text-orange-400">
                    Login to Continue →
                  </p>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-3xl border border-slate-800 bg-slate-900/70 p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-2xl font-bold">
                Built for Students, Site Engineers and Contractors
              </h2>
              <p className="mt-3 max-w-3xl text-slate-400">
                This hub connects practical civil engineering knowledge with
                CivilCalc Pro tools, so users can learn concepts and calculate
                quantities, costs and design values easily.
              </p>
            </div>

            <Link
              href="/dashboard"
              className="rounded-xl bg-white px-6 py-3 text-center font-semibold text-slate-950 transition hover:bg-orange-100"
            >
              Use CivilCalc Tools
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
