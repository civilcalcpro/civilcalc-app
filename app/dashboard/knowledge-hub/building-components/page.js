import Link from 'next/link'
import {
  ArrowLeft,
  Building2,
  Home,
  Layers,
  ShieldCheck,
  ClipboardCheck,
} from 'lucide-react'
import { buildingComponents } from './componentsData'

export const metadata = {
  title: 'Building Components | CivilCalc Pro Knowledge Hub',
  description:
    'Building components guide covering foundation, plinth, column, beam, slab, wall, staircase, lintel, chajja, parapet, flooring and roof.',
}

export default function BuildingComponentsPage() {
  return (
    <main className="min-h-screen bg-[#020B2D] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="mb-8 rounded-3xl border border-[#243250] bg-[#071432] p-6 sm:p-8">
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
                <Building2 size={16} />
                Civil Building Elements
              </div>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                Building Components
              </h1>

              <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-400 sm:text-base">
                Learn important building components like foundation, plinth,
                column, beam, slab, wall, staircase, lintel, chajja, parapet,
                flooring and roof with purpose, function, materials, site
                checks and common mistakes.
              </p>
            </div>

            <div className="rounded-2xl border border-orange-500/20 bg-orange-500/10 px-5 py-4">
              <p className="text-sm text-slate-300">Components</p>
              <p className="mt-1 text-3xl font-bold text-orange-400">
                {buildingComponents.length}
              </p>
            </div>
          </div>
        </section>

        <section className="mb-7 grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-[#243250] bg-[#071432] p-5">
            <Home className="mb-3 text-orange-400" size={24} />
            <h2 className="font-bold text-white">Substructure</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Foundation, plinth and ground-level components.
            </p>
          </div>

          <div className="rounded-2xl border border-[#243250] bg-[#071432] p-5">
            <Building2 className="mb-3 text-orange-400" size={24} />
            <h2 className="font-bold text-white">Superstructure</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Column, beam, slab, wall and staircase.
            </p>
          </div>

          <div className="rounded-2xl border border-[#243250] bg-[#071432] p-5">
            <Layers className="mb-3 text-orange-400" size={24} />
            <h2 className="font-bold text-white">Finishing</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Flooring, roof, plaster and protection items.
            </p>
          </div>

          <div className="rounded-2xl border border-[#243250] bg-[#071432] p-5">
            <ShieldCheck className="mb-3 text-orange-400" size={24} />
            <h2 className="font-bold text-white">Site Checks</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Quality checks and common mistakes for each component.
            </p>
          </div>
        </section>

        <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {buildingComponents.map((component) => (
            <Link
              key={component.slug}
              href={`/dashboard/knowledge-hub/building-components/${component.slug}`}
              className="group rounded-3xl border border-[#243250] bg-[#071432] p-5 transition duration-200 hover:-translate-y-1 hover:border-orange-500/40 hover:shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-orange-500/30 bg-orange-500/10 text-orange-400">
                  <Building2 size={20} />
                </div>

                <div className="rounded-full border border-slate-600 bg-[#081126] px-3 py-1 text-[11px] font-semibold text-slate-200">
                  {component.level}
                </div>
              </div>

              <h2 className="text-xl font-bold tracking-tight text-white">
                {component.title}
              </h2>

              <p className="mt-3 min-h-[68px] text-sm leading-6 text-slate-400">
                {component.shortDesc}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {component.tags.map((tag) => (
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
                  Main Site Check
                </p>

                <div className="flex gap-2 text-sm text-slate-300">
                  <ClipboardCheck className="mt-0.5 shrink-0 text-orange-400" size={15} />
                  <span>{component.siteChecks[0]}</span>
                </div>
              </div>

              <div className="mt-5 border-t border-slate-800 pt-4">
                <div className="flex items-center justify-between text-sm font-semibold text-orange-400">
                  <span>Open Component Guide</span>
                  <span className="transition group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </section>
      </div>
    </main>
  )
}
