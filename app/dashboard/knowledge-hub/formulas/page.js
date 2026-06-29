import Link from 'next/link'
import {
  ArrowLeft,
  Calculator,
  Building2,
  Layers,
  Ruler,
  Mountain,
  Compass,
  Droplets,
  Truck,
  Network,
} from 'lucide-react'
import { formulaCategories } from './formulasData'

export const metadata = {
  title: 'Formula Library | CivilCalc Pro Knowledge Hub',
  description:
    'Civil engineering formula library for RCC, concrete, steel, estimation, soil mechanics, surveying, hydraulics, transportation and structural analysis.',
}

const iconMap = {
  rcc: Building2,
  concrete: Layers,
  steel: Ruler,
  estimation: Calculator,
  soil: Mountain,
  surveying: Compass,
  hydraulics: Droplets,
  transportation: Truck,
  'structural-analysis': Network,
}

export default function FormulaLibraryPage() {
  return (
    <main className="min-h-screen bg-[#020B2D] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="mb-8 rounded-3xl border border-[#243250] bg-[#071432] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] sm:p-8">
          <Link
            href="/dashboard/knowledge-hub"
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-orange-400 hover:text-orange-300"
          >
            <ArrowLeft size={16} />
            Back to Knowledge Hub
          </Link>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-sm text-orange-300">
                <Calculator size={16} />
                Civil Engineering Formulas
              </div>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                Formula Library
              </h1>

              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-400 sm:text-base">
                Access important civil engineering formulas for RCC, concrete,
                steel, estimation, soil mechanics, surveying, hydraulics,
                transportation and structural analysis with practical use cases.
              </p>
            </div>

            <div className="rounded-2xl border border-orange-500/20 bg-orange-500/10 px-5 py-4">
              <p className="text-sm text-slate-300">Formula Categories</p>
              <p className="mt-1 text-3xl font-bold text-orange-400">
                {formulaCategories.length}
              </p>
            </div>
          </div>
        </section>

        <section className="mb-7 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-[#243250] bg-[#071432] p-5">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl border border-orange-500/30 bg-orange-500/10 text-orange-400">
              <Calculator size={22} />
            </div>
            <h2 className="font-bold text-white">Formula + Meaning</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Formula ke saath uska purpose, variables aur unit explanation
              milega.
            </p>
          </div>

          <div className="rounded-2xl border border-[#243250] bg-[#071432] p-5">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl border border-orange-500/30 bg-orange-500/10 text-orange-400">
              <Ruler size={22} />
            </div>
            <h2 className="font-bold text-white">Practical Examples</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Har formula ko site aur exam-style example ke saath explain
              karenge.
            </p>
          </div>

          <div className="rounded-2xl border border-[#243250] bg-[#071432] p-5">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl border border-orange-500/30 bg-orange-500/10 text-orange-400">
              <Building2 size={22} />
            </div>
            <h2 className="font-bold text-white">Related Tools</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Formula pages ko CivilCalc calculators ke saath connect karenge.
            </p>
          </div>
        </section>

        <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {formulaCategories.map((category) => {
            const Icon = iconMap[category.slug] || Calculator

            return (
              <Link
                key={category.slug}
                href={`/dashboard/knowledge-hub/formulas/${category.slug}`}
                className="group rounded-3xl border border-[#243250] bg-[#071432] p-5 transition duration-200 hover:-translate-y-1 hover:border-orange-500/40 hover:shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-orange-500/30 bg-orange-500/10 text-orange-400">
                    <Icon size={20} />
                  </div>

                  <div className="rounded-full border border-slate-600 bg-[#081126] px-3 py-1 text-[11px] font-semibold text-slate-200">
                    {category.level}
                  </div>
                </div>

                <h2 className="text-xl font-bold tracking-tight text-white">
                  {category.title}
                </h2>

                <p className="mt-3 min-h-[68px] text-sm leading-6 text-slate-400">
                  {category.shortDesc}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {category.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-orange-500/25 bg-orange-500/10 px-3 py-1 text-[11px] font-medium text-orange-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-5 rounded-2xl border border-slate-800 bg-[#081126] p-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Includes
                  </p>

                  <ul className="space-y-2">
                    {category.formulas.slice(0, 4).map((formula) => (
                      <li
                        key={formula}
                        className="text-sm leading-5 text-slate-300"
                      >
                        • {formula}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-5 border-t border-slate-800 pt-4">
                  <div className="flex items-center justify-between text-sm font-semibold text-orange-400">
                    <span>Open Formula Guide</span>
                    <span className="transition group-hover:translate-x-1">
                      →
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </section>

        <section className="mt-10 rounded-3xl border border-orange-500/20 bg-orange-500/10 p-6">
          <h2 className="text-2xl font-bold text-white">
            Formula Library is connected with CivilCalc tools
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
            Formula pages will gradually include detailed explanation,
            variables, units, solved examples, common mistakes and direct links
            to related CivilCalc calculators.
          </p>
        </section>
      </div>
    </main>
  )
}
