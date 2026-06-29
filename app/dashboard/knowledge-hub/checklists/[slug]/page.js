import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  ClipboardCheck,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  HardHat,
  FileCheck2,
} from 'lucide-react'
import { checklists } from '../checklistsData'
import PrintButton from './PrintButton'

export async function generateStaticParams() {
  return checklists.map((item) => ({
    slug: item.slug,
  }))
}

export async function generateMetadata({ params }) {
  const checklist = checklists.find((item) => item.slug === params.slug)

  if (!checklist) {
    return {
      title: 'Site Engineer Checklist | CivilCalc Pro',
    }
  }

  return {
    title: `${checklist.title} | CivilCalc Pro Knowledge Hub`,
    description: checklist.shortDesc,
  }
}

function ChecklistSection({ title, icon: Icon, items }) {
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

export default function ChecklistDetailPage({ params }) {
  const checklist = checklists.find((item) => item.slug === params.slug)

  if (!checklist) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-[#020B2D] px-4 py-8 text-white print:bg-white print:text-black sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="mb-8 rounded-3xl border border-[#243250] bg-[#071432] p-6 print:border-gray-300 print:bg-white sm:p-8">
          <Link
            href="/dashboard/knowledge-hub/checklists"
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-orange-400 hover:text-orange-300 print:hidden"
          >
            <ArrowLeft size={16} />
            Back to Site Engineer Checklist
          </Link>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-sm text-orange-300 print:border-gray-300 print:bg-white print:text-black">
                <ClipboardCheck size={16} />
                Site Engineer Checklist
              </div>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                {checklist.title}
              </h1>

              <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-400 print:text-gray-700 sm:text-base">
                {checklist.purpose}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <PrintButton />

              <Link
                href="/dashboard"
                className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-orange-500/60 hover:text-orange-300 print:hidden"
              >
                Open Dashboard
              </Link>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <ChecklistSection
            title="Before Work"
            icon={HardHat}
            items={checklist.beforeWork}
          />

          <ChecklistSection
            title="During Work"
            icon={ClipboardCheck}
            items={checklist.duringWork}
          />

          <ChecklistSection
            title="After Work"
            icon={FileCheck2}
            items={checklist.afterWork}
          />

          <ChecklistSection
            title="Quality Checks"
            icon={CheckCircle2}
            items={checklist.qualityChecks}
          />

          <section className="rounded-3xl border border-red-500/20 bg-red-500/10 p-6 lg:col-span-2 print:border-gray-300 print:bg-white">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-300 print:text-black">
                <AlertTriangle size={22} />
              </div>
              <h2 className="text-2xl font-bold">Common Mistakes</h2>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {checklist.commonMistakes.map((mistake) => (
                <div
                  key={mistake}
                  className="rounded-xl border border-red-500/20 bg-slate-950/40 p-4 text-slate-200 print:border-gray-300 print:bg-white print:text-black"
                >
                  {mistake}
                </div>
              ))}
            </div>
          </section>

          <ChecklistSection
            title="Safety Points"
            icon={ShieldCheck}
            items={checklist.safety}
          />
        </section>
      </div>
    </main>
  )
}
