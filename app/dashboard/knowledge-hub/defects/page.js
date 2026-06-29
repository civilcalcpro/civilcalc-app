import Link from 'next/link'
import {
  ArrowLeft,
  AlertTriangle,
  ShieldCheck,
  Wrench,
  SearchCheck,
} from 'lucide-react'
import { defects } from './defectsData'

export const metadata = {
  title: 'Construction Defects Library | CivilCalc Pro Knowledge Hub',
  description:
    'Construction defects library with causes, prevention, repair methods and severity for honeycombing, cracks, dampness, efflorescence, corrosion and more.',
}

const severityClass = {
  Critical: 'border-red-500/30 bg-red-500/10 text-red-200',
  High: 'border-orange-500/30 bg-orange-500/10 text-orange-200',
  Medium: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-100',
  'Low to Medium': 'border-slate-500/30 bg-slate-500/10 text-slate-200',
}

export default function ConstructionDefectsPage() {
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
                <AlertTriangle size={16} />
                Defects, Causes & Solutions
              </div>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                Construction Defects Library
              </h1>

              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-400 sm:text-base">
                Learn common construction defects with causes, prevention,
                repair methods and severity. This library helps site engineers,
                contractors and students identify defects before they become
                major problems.
              </p>
            </div>

            <div className="rounded-2xl border border-orange-500/20 bg-orange-500/10 px-5 py-4">
              <p className="text-sm text-slate-300">Total Defects</p>
              <p className="mt-1 text-3xl font-bold text-orange-400">
                {defects.length}
              </p>
            </div>
          </div>
        </section>

        <section className="mb-7 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-[#243250] bg-[#071432] p-5">
            <SearchCheck className="mb-3 text-orange-400" size={24} />
            <h2 className="font-bold text-white">Identify Defects</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Defect kya hai, kaise dikhta hai aur kis stage par hota hai.
            </p>
          </div>

          <div className="rounded-2xl border border-[#243250] bg-[#071432] p-5">
            <ShieldCheck className="mb-3 text-orange-400" size={24} />
            <h2 className="font-bold text-white">Causes + Prevention</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Defect hone ke reason aur usko site par prevent kaise kare.
            </p>
          </div>

          <div className="rounded-2xl border border-[#243250] bg-[#071432] p-5">
            <Wrench className="mb-3 text-orange-400" size={24} />
            <h2 className="font-bold text-white">Repair Guidance</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Minor repair, serious repair aur engineer consultation points.
            </p>
          </div>
        </section>

        <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {defects.map((defect) => (
            <Link
              key={defect.slug}
              href={`/dashboard/knowledge-hub/defects/${defect.slug}`}
              className="group overflow-hidden rounded-3xl border border-[#243250] bg-[#071432] transition duration-200 hover:-translate-y-1 hover:border-orange-500/40 hover:shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
            >
              <div className="flex h-44 items-center justify-center border-b border-[#243250] bg-gradient-to-br from-slate-900 via-[#081126] to-orange-950/30">
                {defect.image ? (
                  <img
                    src={defect.image}
                    alt={defect.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="text-center">
                    <AlertTriangle className="mx-auto text-orange-400" size={42} />
                    <p className="mt-3 text-sm font-semibold text-slate-300">
                      Defect Photo Slot
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Add real site image later
                    </p>
                  </div>
                )}
              </div>

              <div className="p-5">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-orange-500/30 bg-orange-500/10 text-orange-400">
                    <AlertTriangle size={20} />
                  </div>

                  <div
                    className={`rounded-full border px-3 py-1 text-[11px] font-semibold ${
                      severityClass[defect.level] ||
                      'border-slate-600 bg-[#081126] text-slate-200'
                    }`}
                  >
                    {defect.level}
                  </div>
                </div>

                <h2 className="text-xl font-bold tracking-tight text-white">
                  {defect.title}
                </h2>

                <p className="mt-3 min-h-[68px] text-sm leading-6 text-slate-400">
                  {defect.shortDesc}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {defect.tags.map((tag) => (
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
                    <span>Open Defect Guide</span>
                    <span className="transition group-hover:translate-x-1">
                      →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </section>
      </div>
    </main>
  )
}
