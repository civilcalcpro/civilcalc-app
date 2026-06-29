import Link from 'next/link'
import {
  BookOpen,
  Layers,
  Calculator,
  ClipboardCheck,
  Building2,
  FlaskConical,
  AlertTriangle,
  FileText,
  ShieldCheck,
  Wrench,
  GraduationCap,
  HardHat,
} from 'lucide-react'

export const metadata = {
  title: 'Civil Engineering Knowledge Hub Dashboard | CivilCalc Pro',
  description:
    'Access civil engineering materials, formulas, checklists, construction process guides, testing methods and practical site knowledge.',
}

const categories = [
  {
    title: 'Material Guide',
    desc: 'Cement, steel, sand, aggregate, bricks, blocks, concrete, fly ash and admixtures.',
    href: '/dashboard/knowledge-hub/materials',
    icon: Layers,
  },
  {
    title: 'Formula Library',
    desc: 'RCC, concrete, steel, estimation, soil, surveying, hydraulics and transportation formulas.',
    href: '/dashboard/knowledge-hub/formulas',
    icon: Calculator,
  },
  {
    title: 'Site Engineer Checklist',
    desc: 'Excavation, PCC, footing, column, beam, slab, brickwork, plaster and finishing checklists.',
    href: '/dashboard/knowledge-hub/checklists',
    icon: ClipboardCheck,
  },
  {
    title: 'Construction Process',
    desc: 'Complete building construction process from land planning to finishing work.',
    href:  '/dashboard/knowledge-hub',
    icon: Building2,
  },
  {
    title: 'Testing Guide',
    desc: 'Slump test, cube test, sieve analysis, core test, NDT tests and field quality checks.',
    href: '/dashboard/knowledge-hub',
    icon: FlaskConical,
  },
  {
    title: 'Construction Defects Library',
    desc: 'Honeycombing, cracks, dampness, segregation, efflorescence with causes and solutions.',
    href: '/dashboard/knowledge-hub',
    icon: AlertTriangle,
  },
  {
    title: 'BOQ Guide',
    desc: 'BOQ basics, item description, quantity takeoff, cost summary and estimation workflow.',
    href: '/dashboard/knowledge-hub',
    icon: FileText,
  },
  {
    title: 'Safety Hub',
    desc: 'PPE, toolbox talk, risk assessment, safety rules and construction site safety guidance.',
    href: '/dashboard/knowledge-hub',
    icon: ShieldCheck,
  },
  {
    title: 'Equipment Guide',
    desc: 'Excavator, transit mixer, vibrator, bar bending machine, total station and site equipment.',
    href: '/dashboard/knowledge-hub',
    icon: Wrench,
  },
  {
    title: 'Interview Preparation',
    desc: 'Civil engineering interview questions, answers, site concepts and practical knowledge.',
    href: '/dashboard/knowledge-hub',
    icon: GraduationCap,
  },
  {
    title: 'Building Components Guide',
    desc: 'Foundation, column, beam, slab, lintel, roof, staircase and other building components.',
    href: '/dashboard/knowledge-hub',
    icon: HardHat,
  },
  {
    title: 'IS Code Summary',
    desc: 'Important IS code summaries explained in simple practical language.',
    href: '/dashboard/knowledge-hub',
    icon: BookOpen,
  },
]

export default function DashboardKnowledgeHubPage() {
  return (
    <main className="min-h-screen bg-[#050B1F] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-400">
              <BookOpen size={26} />
            </div>

            <div>
              <p className="text-sm font-semibold text-orange-400">
                CivilCalc Pro
              </p>
              <h1 className="text-3xl font-bold sm:text-4xl">
                Civil Engineering Knowledge Hub
              </h1>
            </div>
          </div>

          <p className="max-w-4xl text-slate-300">
            Access civil engineering formulas, material guides, site engineer
            checklists, construction process, testing methods, defects library,
            BOQ guidance, safety knowledge and practical site references.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/dashboard"
              className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-orange-500/60 hover:text-orange-300"
            >
              ← Back to Dashboard
            </Link>

            <Link
              href="/dashboard/calculators/boq-generator"
              className="rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
            >
              Open BOQ Tool
            </Link>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((item) => {
            const Icon = item.icon

            return (
              <Link
                key={item.title}
                href={item.href}
                className="group rounded-2xl border border-slate-800 bg-slate-900/70 p-6 transition hover:-translate-y-1 hover:border-orange-500/50 hover:bg-slate-900"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400 transition group-hover:bg-orange-500 group-hover:text-white">
                  <Icon size={24} />
                </div>

                <h2 className="text-xl font-bold text-white">
                  {item.title}
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  {item.desc}
                </p>

                <p className="mt-5 text-sm font-semibold text-orange-400">
                  Open Section →
                </p>
              </Link>
            )
          })}
        </div>

        <div className="mt-10 rounded-3xl border border-orange-500/20 bg-orange-500/10 p-6">
          <h2 className="text-2xl font-bold text-white">
            More civil engineering resources coming soon
          </h2>
          <p className="mt-3 text-slate-300">
            We are improving this Knowledge Hub step by step with formulas,
            guides, checklists, tests, defects, IS code summaries and practical
            construction knowledge.
          </p>
        </div>
      </div>
    </main>
  )
}
