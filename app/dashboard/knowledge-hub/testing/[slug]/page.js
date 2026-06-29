import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  FlaskConical,
  CheckCircle2,
  ClipboardCheck,
  AlertTriangle,
  ShieldCheck,
  Wrench,
  BookOpen,
} from 'lucide-react'
import { tests } from '../testingData'

export async function generateStaticParams() {
  return tests.map((test) => ({
    slug: test.slug,
  }))
}

export async function generateMetadata({ params }) {
  const test = tests.find((item) => item.slug === params.slug)

  if (!test) {
    return {
      title: 'Testing Guide | CivilCalc Pro',
    }
  }

  return {
    title: `${test.title} | CivilCalc Pro Knowledge Hub`,
    description: test.shortDesc,
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

export default function TestingDetailPage({ params }) {
  const test = tests.find((item) => item.slug === params.slug)

  if (!test) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-[#020B2D] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="mb-8 rounded-3xl border border-[#243250] bg-[#071432] p-6 sm:p-8">
          <Link
            href="/dashboard/knowledge-hub/testing"
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-orange-400 hover:text-orange-300"
          >
            <ArrowLeft size={16} />
            Back to Testing Guide
          </Link>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-sm text-orange-300">
                <FlaskConical size={16} />
                Testing Guide
              </div>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                {test.title}
              </h1>

              <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-400 sm:text-base">
                {test.purpose}
              </p>
            </div>

            <div className="rounded-2xl border border-orange-500/20 bg-orange-500/10 p-5">
              <p className="text-sm text-slate-300">Test Level</p>
              <p className="mt-1 text-xl font-bold text-orange-400">
                {test.level}
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <InfoSection
            title="Where It Is Used"
            icon={BookOpen}
            items={test.whereUsed}
          />

          <InfoSection
            title="Apparatus Required"
            icon={Wrench}
            items={test.apparatus}
          />

          <InfoSection
            title="Test Procedure"
            icon={ClipboardCheck}
            items={test.procedure}
          />

          <InfoSection
            title="Observations"
            icon={FlaskConical}
            items={test.observations}
          />

          <section className="rounded-3xl border border-orange-500/20 bg-orange-500/10 p-6 lg:col-span-2">
            <div className="mb-3 flex items-center gap-3">
              <CheckCircle2 className="text-orange-400" size={24} />
              <h2 className="text-2xl font-bold">Result / Interpretation</h2>
            </div>
            <p className="text-sm leading-7 text-slate-300 sm:text-base">
              {test.result}
            </p>
          </section>

          <section className="rounded-3xl border border-red-500/20 bg-red-500/10 p-6 lg:col-span-2">
            <div className="mb-5 flex items-center gap-3">
              <AlertTriangle className="text-red-300" size={24} />
              <h2 className="text-2xl font-bold">Common Testing Mistakes</h2>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {test.commonMistakes.map((mistake) => (
                <div
                  key={mistake}
                  className="rounded-xl border border-red-500/20 bg-slate-950/40 p-4 text-slate-200"
                >
                  {mistake}
                </div>
              ))}
            </div>
          </section>

          <InfoSection
            title="Safety Points"
            icon={ShieldCheck}
            items={test.safety}
          />
        </section>
      </div>
    </main>
  )
}
