import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  ClipboardCheck,
  Lightbulb,
  Wrench,
  ShieldCheck,
} from 'lucide-react'
import { isCodes } from '../isCodeData'

export async function generateStaticParams() {
  return isCodes.map((item) => ({
    slug: item.slug,
  }))
}

export async function generateMetadata({ params }) {
  const code = isCodes.find((item) => item.slug === params.slug)

  if (!code) {
    return {
      title: 'IS Code Summary | CivilCalc Pro',
    }
  }

  return {
    title: `${code.code} - ${code.title} | CivilCalc Pro Knowledge Hub`,
    description: code.shortDesc,
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

export default function ISCodeDetailPage({ params }) {
  const code = isCodes.find((item) => item.slug === params.slug)

  if (!code) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-[#020B2D] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="mb-8 rounded-3xl border border-[#243250] bg-[#071432] p-6 sm:p-8">
          <Link
            href="/dashboard/knowledge-hub/is-code-library"
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-orange-400 hover:text-orange-300"
          >
            <ArrowLeft size={16} />
            Back to IS Code Summary
          </Link>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-sm text-orange-300">
                <BookOpen size={16} />
                Indian Standard Summary
              </div>

              <p className="text-lg font-semibold text-orange-300">
                {code.code}
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                {code.title}
              </h1>

              <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-400 sm:text-base">
                {code.purpose}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-2xl border border-orange-500/20 bg-orange-500/10 p-5">
                <p className="text-sm text-slate-300">Category</p>
                <p className="mt-1 text-xl font-bold text-orange-400">
                  {code.category}
                </p>
              </div>

              <div
                className={`rounded-2xl border p-5 ${
                  code.verifiedFromUpload
                    ? 'border-green-500/20 bg-green-500/10'
                    : 'border-slate-700 bg-[#081126]'
                }`}
              >
                <p className="text-sm text-slate-300">Source Status</p>
                <p
                  className={`mt-1 text-xl font-bold ${
                    code.verifiedFromUpload ? 'text-green-400' : 'text-slate-300'
                  }`}
                >
                  {code.verifiedFromUpload ? 'PDF Added' : 'Summary Only'}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <InfoSection
            title="Where This Code Is Used"
            icon={ClipboardCheck}
            items={code.whereUsed}
          />

          <InfoSection
            title="Important Topics"
            icon={BookOpen}
            items={code.importantTopics}
          />

          <InfoSection
            title="Practical Use"
            icon={Lightbulb}
            items={code.practicalUse}
          />

          <section className="rounded-3xl border border-red-500/20 bg-red-500/10 p-6">
            <div className="mb-5 flex items-center gap-3">
              <AlertTriangle className="text-red-300" size={24} />
              <h2 className="text-2xl font-bold">Common Mistakes</h2>
            </div>

            <ul className="space-y-3">
              {code.commonMistakes.map((mistake) => (
                <li key={mistake} className="flex gap-3 text-slate-200">
                  <AlertTriangle className="mt-0.5 shrink-0 text-red-300" size={18} />
                  <span>{mistake}</span>
                </li>
              ))}
            </ul>
          </section>
        </section>

        {code.relatedTools?.length > 0 && (
          <section className="mt-8 rounded-3xl border border-orange-500/20 bg-orange-500/10 p-6">
            <div className="mb-5 flex items-center gap-3">
              <Wrench className="text-orange-300" size={24} />
              <h2 className="text-2xl font-bold">Related CivilCalc Tools</h2>
            </div>

            <div className="flex flex-wrap gap-3">
              {code.relatedTools.map((tool) => (
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
        )}

        <section className="mt-8 rounded-3xl border border-yellow-500/20 bg-yellow-500/10 p-6">
          <div className="flex gap-3">
            <ShieldCheck className="mt-1 shrink-0 text-yellow-300" size={22} />
            <div>
              <h2 className="text-xl font-bold text-white">
                Official Code Note
              </h2>
              <p className="mt-2 text-sm leading-7 text-yellow-100">
                {code.note}
              </p>
              <p className="mt-3 text-sm leading-7 text-yellow-100">
                This CivilCalc page is an educational summary only. It does not
                replace official BIS standards, structural design responsibility
                or project-specific engineering judgement.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
