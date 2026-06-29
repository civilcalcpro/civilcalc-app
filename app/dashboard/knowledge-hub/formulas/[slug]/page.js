import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  Calculator,
  CheckCircle2,
  BookOpen,
  Ruler,
  HelpCircle,
  AlertTriangle,
} from 'lucide-react'
import { formulaCategories } from '../formulasData'

export async function generateStaticParams() {
  return formulaCategories.map((category) => ({
    slug: category.slug,
  }))
}

export async function generateMetadata({ params }) {
  const category = formulaCategories.find((item) => item.slug === params.slug)

  if (!category) {
    return {
      title: 'Formula Guide | CivilCalc Pro',
    }
  }

  return {
    title: `${category.title} | CivilCalc Pro Knowledge Hub`,
    description: category.shortDesc,
  }
}

const relatedToolMap = {
  rcc: [
    { name: 'RCC Beam Design', href: '/dashboard/calculators/beam' },
    { name: 'Footing Design', href: '/dashboard/calculators/footing' },
  ],
  concrete: [
    { name: 'Concrete Calculator', href: '/dashboard/calculators/concrete-volume' },
    { name: 'BOQ Generator', href: '/dashboard/calculators/boq-generator' },
  ],
  steel: [
    { name: 'Steel Weight Calculator', href: '/dashboard/calculators/steel-weight' },
    { name: 'BBS Generator', href: '/dashboard/calculators/bbs-generator' },
  ],
  estimation: [
    { name: 'BOQ Generator', href: '/dashboard/calculators/boq-generator' },
    { name: 'Brickwork Calculator', href: '/dashboard/calculators/brickwork' },
  ],
  'structural-analysis': [
    { name: 'Structural Analysis', href: '/dashboard/calculators/structural-analysis' },
    { name: 'Moment Distribution', href: '/dashboard/calculators/moment-distribution' },
  ],
}

export default function FormulaDetailPage({ params }) {
  const category = formulaCategories.find((item) => item.slug === params.slug)

  if (!category) {
    notFound()
  }

  const relatedTools = relatedToolMap[category.slug] || [
    { name: 'CivilCalc Dashboard', href: '/dashboard' },
  ]

  return (
    <main className="min-h-screen bg-[#020B2D] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="mb-8 rounded-3xl border border-[#243250] bg-[#071432] p-6 sm:p-8">
          <Link
            href="/dashboard/knowledge-hub/formulas"
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-orange-400 hover:text-orange-300"
          >
            <ArrowLeft size={16} />
            Back to Formula Library
          </Link>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-sm text-orange-300">
                <Calculator size={16} />
                Formula Guide
              </div>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                {category.title}
              </h1>

              <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-400 sm:text-base">
                {category.shortDesc}
              </p>
            </div>

            <div className="rounded-2xl border border-orange-500/20 bg-orange-500/10 p-5">
              <p className="text-sm text-slate-300">Total Formulas</p>
              <p className="mt-1 text-3xl font-bold text-orange-400">
                {category.formulas.length}
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-2">
          {category.formulas.map((item) => (
            <div
              key={item.name}
              className="rounded-3xl border border-[#243250] bg-[#071432] p-6"
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-orange-500/30 bg-orange-500/10 text-orange-400">
                  <Calculator size={20} />
                </div>

                <span className="rounded-full border border-slate-600 bg-[#081126] px-3 py-1 text-[11px] font-semibold text-slate-200">
                  Formula
                </span>
              </div>

              <h2 className="text-xl font-bold text-white">
                {item.name}
              </h2>

              <div className="mt-4 rounded-2xl border border-orange-500/25 bg-orange-500/10 p-4">
                <p className="text-sm font-semibold text-orange-300">
                  Formula
                </p>
                <p className="mt-2 text-lg font-bold leading-8 text-white">
                  {item.formula}
                </p>
              </div>

              <div className="mt-5 space-y-4">
                <div>
                  <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-orange-300">
                    <CheckCircle2 size={16} />
                    Explanation
                  </h3>
                  <p className="text-sm leading-6 text-slate-400">
                    {item.explanation}
                  </p>
                </div>

                <div>
                  <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-orange-300">
                    <Ruler size={16} />
                    Variables
                  </h3>
                  <p className="text-sm leading-6 text-slate-400">
                    {item.variables}
                  </p>
                </div>

                <div>
                  <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-orange-300">
                    <BookOpen size={16} />
                    Units
                  </h3>
                  <p className="text-sm leading-6 text-slate-400">
                    {item.unit}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-700 bg-[#081126] p-4">
                  <h3 className="mb-2 text-sm font-semibold text-orange-300">
                    Example Use
                  </h3>
                  <p className="text-sm leading-6 text-slate-300">
                    {item.example}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </section>

        <section className="mt-8 rounded-3xl border border-yellow-500/20 bg-yellow-500/10 p-6">
          <div className="flex gap-3">
            <AlertTriangle className="mt-1 shrink-0 text-yellow-300" size={22} />
            <div>
              <h2 className="text-xl font-bold text-white">
                Engineering Note
              </h2>
              <p className="mt-2 text-sm leading-7 text-yellow-100">
                These formulas are for learning, estimation and practical
                reference. For final structural design, always follow latest IS
                codes, project drawings and approval requirements.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-orange-500/20 bg-orange-500/10 p-6">
          <div className="mb-5 flex items-center gap-3">
            <HelpCircle className="text-orange-400" size={24} />
            <h2 className="text-2xl font-bold">Related CivilCalc Tools</h2>
          </div>

          <div className="flex flex-wrap gap-3">
            {relatedTools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
              >
                {tool.name}
              </Link>
            ))}

            <Link
              href="/dashboard"
              className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-orange-500/60 hover:text-orange-300"
            >
              Open Dashboard
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}
