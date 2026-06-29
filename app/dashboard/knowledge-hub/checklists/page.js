import Link from 'next/link'
import {
  ArrowLeft,
  ClipboardCheck,
  ShieldCheck,
  HardHat,
  CheckCircle2,
} from 'lucide-react'
import { checklists } from './checklistsData'

export const metadata = {
  title: 'Site Engineer Checklist | CivilCalc Pro Knowledge Hub',
  description:
    'Practical site engineer checklist for excavation, PCC, footing, column, beam, slab, brickwork, plaster, waterproofing, painting and finishing work.',
}

export default function SiteEngineerChecklistPage() {
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
                <ClipboardCheck size={16} />
                Practical Site Checklists
              </div>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                Site Engineer Checklist
              </h1>

              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-400 sm:text-base">
                Stage-wise checklist for excavation, PCC, footing, column,
                beam, slab, brickwork, plaster, waterproofing, painting and
                finishing work. Useful for site engineers, contractors and civil
                students.
              </p>
            </div>

            <div className="rounded-2xl border border-orange-500/20 bg-orange-500/10 px-5 py-4">
              <p className="text-sm text-slate-300">Total Checklists</p>
              <p className="mt-1 text-3xl font-bold text-orange-400">
                {checklists.length}
              </p>
            </div>
          </div>
        </section>

        <section className="mb-7 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-[#243250] bg-[#071432] p-5">
            <HardHat className="mb-3 text-orange-400" size={24} />
            <h2 className="font-bold text-white">Before Work</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Drawing, material, manpower, safety and site readiness checks.
            </p>
          </div>

          <div className="rounded-2xl border border-[#243250] bg-[#071432] p-5">
            <CheckCircle2 className="mb-3 text-orange-400" size={24} />
            <h2 className="font-bold text-white">During Work</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Line, level, quality, workmanship and execution checks.
            </p>
          </div>

          <div className="rounded-2xl border border-[#243250] bg-[#071432] p-5">
            <ShieldCheck className="mb-3 text-orange-400" size={24} />
            <h2 className="font-bold text-white">Safety + Quality</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Common mistakes, quality checks and site safety points.
            </p>
          </div>
        </section>

        <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {checklists.map((item) => (
            <Link
              key={item.slug}
              href={`/dashboard/knowledge-hub/checklists/${item.slug}`}
              className="group rounded-3xl border border-[#243250] bg-[#071432] p-5 transition duration-200 hover:-translate-y-1 hover:border-orange-500/40 hover:shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-orange-500/30 bg-orange-500/10 text-orange-400">
                  <ClipboardCheck size={20} />
                </div>

                <div className="rounded-full border border-slate-600 bg-[#081126] px-3 py-1 text-[11px] font-semibold text-slate-200">
                  {item.level}
                </div>
              </div>

              <h2 className="text-xl font-bold tracking-tight text-white">
                {item.title}
              </h2>

              <p className="mt-3 min-h-[68px] text-sm leading-6 text-slate-400">
                {item.shortDesc}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-orange-500/25 bg-orange-500/10 px-3 py-1 text-[11px] font-medium text-orange-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-5 border-t border-slate-800 pt-4">
                <div className="flex items-center justify-between text-sm font-semibold text-orange-400">
                  <span>Open Checklist</span>
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
