import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  Wrench,
  SearchCheck,
} from 'lucide-react'
import { defects } from '../defectsData'

export async function generateStaticParams() {
  return defects.map((defect) => ({
    slug: defect.slug,
  }))
}

export async function generateMetadata({ params }) {
  const defect = defects.find((item) => item.slug === params.slug)

  if (!defect) {
    return {
      title: 'Construction Defects Library | CivilCalc Pro',
    }
  }

  return {
    title: `${defect.title} | CivilCalc Pro Knowledge Hub`,
    description: defect.shortDesc,
  }
}

function InfoSection({ title, icon: Icon, items }) {
  return (
    <section className="rounded-3xl border border-[#243250] bg-[#071432] p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-orange-500/30 bg-orange-500/10 text-orange-400">
          <Icon size={22} />
        </div>
        <h2 className="text-2xl font-bold text-white">{title}</h2>
      </div>

      <ul className="space-y-3">
        {items.map((point) => (
          <li key={point} className="flex gap-3 text-slate-300">
            <CheckCircle2 className="mt-0.5 shrink-0 text-orange-400" size={18} />
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default function DefectDetailPage({ params }) {
  const defect = defects.find((item) => item.slug === params.slug)

  if (!defect) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-[#020B2D] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="mb-8 overflow-hidden rounded-3xl border border-[#243250] bg-[#071432]">
          <div className="flex h-64 items-center justify-center border-b border-[#243250] bg-gradient-to-br from-slate-900 via-[#081126] to-orange-950/30">
            {defect.image ? (
              <img
                src={defect.image}
                alt={defect.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="text-center">
                <AlertTriangle className="mx-auto text-orange-400" size={56} />
                <p className="mt-4 text-base font-semibold text-slate-300">
                  Defect Photo Slot
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Add real site image in public/defects folder
                </p>
              </div>
            )}
          </div>

          <div className="p-6 sm:p-8">
            <Link
              href="/dashboard/knowledge-hub/defects"
              className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-orange-400 hover:text-orange-300"
            >
              <ArrowLeft size={16} />
              Back to Defects Library
            </Link>

            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-sm text-orange-300">
                  <AlertTriangle size={16} />
                  Construction Defect
                </div>

                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                  {defect.title}
                </h1>

                <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-400 sm:text-base">
                  {defect.whatIsIt}
                </p>
              </div>

              <div className="rounded-2xl border border-orange-500/20 bg-orange-500/10 p-5">
                <p className="text-sm text-slate-300">Severity</p>
                <p className="mt-1 text-xl font-bold text-orange-400">
                  {defect.level}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <InfoSection title="Main Causes" icon={SearchCheck} items={defect.causes} />

          <InfoSection
            title="Prevention on Site"
            icon={ShieldCheck}
            items={defect.prevention}
          />

          <InfoSection title="Repair Method" icon={Wrench} items={defect.repair} />

          <section className="rounded-3xl border border-red-500/20 bg-red-500/10 p-6">
            <div className="mb-3 flex items-center gap-3">
              <AlertTriangle className="text-red-300" size={24} />
              <h2 className="text-2xl font-bold">Severity Note</h2>
            </div>
            <p className="text-sm leading-7 text-slate-200 sm:text-base">
              {defect.severity}
            </p>
          </section>
        </section>

        <section className="mt-8 rounded-3xl border border-yellow-500/20 bg-yellow-500/10 p-6">
          <div className="flex gap-3">
            <AlertTriangle className="mt-1 shrink-0 text-yellow-300" size={22} />
            <div>
              <h2 className="text-xl font-bold text-white">
                Practical Note
              </h2>
              <p className="mt-2 text-sm leading-7 text-yellow-100">
                Minor finishing defects can be repaired by standard methods, but
                structural defects like deep cracks, corrosion, spalling,
                settlement cracks or major honeycombing should be checked by a
                qualified structural engineer before repair.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
