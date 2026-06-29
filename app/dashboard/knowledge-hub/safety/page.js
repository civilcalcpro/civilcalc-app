import Link from 'next/link'
import {
  ArrowLeft,
  ShieldCheck,
  HardHat,
  AlertTriangle,
  ClipboardCheck,
  Zap,
  Flame,
} from 'lucide-react'
import { safetyTopics } from './safetyData'

export const metadata = {
  title: 'Safety Hub | CivilCalc Pro Knowledge Hub',
  description:
    'Construction site safety hub covering PPE, excavation safety, scaffolding, work at height, electrical safety, fire safety and concrete work safety.',
}

const levelClass = {
  Basic: 'border-slate-500/30 bg-slate-500/10 text-slate-200',
  High: 'border-orange-500/30 bg-orange-500/10 text-orange-200',
  Critical: 'border-red-500/30 bg-red-500/10 text-red-200',
}

export default function SafetyHubPage() {
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
                <ShieldCheck size={16} />
                Construction Site Safety
              </div>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                Safety Hub
              </h1>

              <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-400 sm:text-base">
                Practical construction safety guide for site engineers,
                contractors and workers. Covers PPE, excavation, scaffolding,
                work at height, electrical safety, fire safety, lifting and
                concrete work safety.
              </p>
            </div>

            <div className="rounded-2xl border border-orange-500/20 bg-orange-500/10 px-5 py-4">
              <p className="text-sm text-slate-300">Safety Topics</p>
              <p className="mt-1 text-3xl font-bold text-orange-400">
                {safetyTopics.length}
              </p>
            </div>
          </div>
        </section>

        <section className="mb-7 grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-[#243250] bg-[#071432] p-5">
            <HardHat className="mb-3 text-orange-400" size={24} />
            <h2 className="font-bold text-white">PPE Rules</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Helmet, shoes, gloves, goggles and harness.
            </p>
          </div>

          <div className="rounded-2xl border border-[#243250] bg-[#071432] p-5">
            <AlertTriangle className="mb-3 text-orange-400" size={24} />
            <h2 className="font-bold text-white">Hazard Control</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Risk identify karke accident prevent karo.
            </p>
          </div>

          <div className="rounded-2xl border border-[#243250] bg-[#071432] p-5">
            <Zap className="mb-3 text-orange-400" size={24} />
            <h2 className="font-bold text-white">Electrical Safety</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Temporary wiring, DB panel and power tools.
            </p>
          </div>

          <div className="rounded-2xl border border-[#243250] bg-[#071432] p-5">
            <Flame className="mb-3 text-orange-400" size={24} />
            <h2 className="font-bold text-white">Fire Safety</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Extinguisher, hot work and emergency plan.
            </p>
          </div>
        </section>

        <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {safetyTopics.map((topic) => (
            <Link
              key={topic.slug}
              href={`/dashboard/knowledge-hub/safety/${topic.slug}`}
              className="group rounded-3xl border border-[#243250] bg-[#071432] p-5 transition duration-200 hover:-translate-y-1 hover:border-orange-500/40 hover:shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-orange-500/30 bg-orange-500/10 text-orange-400">
                  <ShieldCheck size={20} />
                </div>

                <div
                  className={`rounded-full border px-3 py-1 text-[11px] font-semibold ${
                    levelClass[topic.level] ||
                    'border-slate-600 bg-[#081126] text-slate-200'
                  }`}
                >
                  {topic.level}
                </div>
              </div>

              <h2 className="text-xl font-bold tracking-tight text-white">
                {topic.title}
              </h2>

              <p className="mt-3 min-h-[68px] text-sm leading-6 text-slate-400">
                {topic.shortDesc}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {topic.tags.map((tag) => (
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
                  <span>Open Safety Guide</span>
                  <span className="transition group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </section>

        <section className="mt-10 rounded-3xl border border-yellow-500/20 bg-yellow-500/10 p-6">
          <div className="flex gap-3">
            <AlertTriangle className="mt-1 shrink-0 text-yellow-300" size={22} />
            <div>
              <h2 className="text-2xl font-bold text-white">
                Safety First Rule
              </h2>
              <p className="mt-3 max-w-4xl text-sm leading-7 text-yellow-100 sm:text-base">
                Construction site par kaam start karne se pehle hazard identify
                karo, correct PPE use karo, unsafe condition report karo aur
                emergency plan ready rakho.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
