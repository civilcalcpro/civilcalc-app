import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  AlertTriangle,
  ClipboardCheck,
  PackageCheck,
  ShieldCheck,
} from 'lucide-react'
import { constructionStages } from '../processData'

export async function generateStaticParams() {
  return constructionStages.map((stage) => ({
    slug: stage.slug,
  }))
}

export async function generateMetadata({ params }) {
  const stage = constructionStages.find((item) => item.slug === params.slug)

  if (!stage) {
    return {
      title: 'Construction Process | CivilCalc Pro',
    }
  }

  return {
    title: `${stage.title} | CivilCalc Pro Knowledge Hub`,
    description: stage.shortDesc,
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

export default function ConstructionStageDetailPage({ params }) {
  const stage = constructionStages.find((item) => item.slug === params.slug)

  if (!stage) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-[#020B2D] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="mb-8 rounded-3xl border border-[#243250] bg-[#071432] p-6 sm:p-8">
          <Link
            href="/dashboard/knowledge-hub/construction-process"
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-orange-400 hover:text-orange-300"
          >
            <ArrowLeft size={16} />
            Back to Construction Process
          </Link>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-sm text-orange-300">
                <Building2 size={16} />
                Construction Stage
              </div>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                {stage.title}
              </h1>

              <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-400 sm:text-base">
                {stage.purpose}
              </p>
            </div>

            <div className="rounded-2xl border border-orange-500/20 bg-orange-500/10 p-5">
              <p className="text-sm text-slate-300">Stage Type</p>
              <p className="mt-1 text-xl font-bold text-orange-400">
                {stage.level}
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <InfoSection
            title="Materials / Documents Required"
            icon={PackageCheck}
            items={stage.materials}
          />

          <InfoSection
            title="Stage Checklist"
            icon={ClipboardCheck}
            items={stage.checklist}
          />

          <InfoSection
            title="Quality Checks"
            icon={ShieldCheck}
            items={stage.qualityChecks}
          />

          <section className="rounded-3xl border border-red-500/20 bg-red-500/10 p-6">
            <div className="mb-5 flex items-center gap-3">
              <AlertTriangle className="text-red-300" size={24} />
              <h2 className="text-2xl font-bold">Common Mistakes</h2>
            </div>

            <ul className="space-y-3">
              {stage.commonMistakes.map((mistake) => (
                <li key={mistake} className="flex gap-3 text-slate-200">
                  <AlertTriangle className="mt-0.5 shrink-0 text-red-300" size={18} />
                  <span>{mistake}</span>
                </li>
              ))}
            </ul>
          </section>
        </section>

        <section className="mt-8 rounded-3xl border border-yellow-500/20 bg-yellow-500/10 p-6">
          <div className="flex gap-3">
            <AlertTriangle className="mt-1 shrink-0 text-yellow-300" size={22} />
            <div>
              <h2 className="text-xl font-bold text-white">
                Practical Site Note
              </h2>
              <p className="mt-2 text-sm leading-7 text-yellow-100">
                Construction sequence may change depending on project type,
                structural system, local authority approval and site conditions.
                Always follow approved drawings, specifications and engineer
                instructions.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
