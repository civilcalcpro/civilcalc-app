import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ClipboardCheck,
  PackageCheck,
} from 'lucide-react'
import { boqGuideSections } from '../boqData'

export async function generateStaticParams() {
  return boqGuideSections.map((section) => ({
    slug: section.slug,
  }))
}

export async function generateMetadata({ params }) {
  const section = boqGuideSections.find((item) => item.slug === params.slug)

  if (!section) {
    return {
      title: 'BOQ Guide | CivilCalc Pro',
    }
  }

  return {
    title: `${section.title} | CivilCalc Pro Knowledge Hub`,
    description: section.shortDesc,
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

export default function BOQTopicDetailPage({ params }) {
  const section = boqGuideSections.find((item) => item.slug === params.slug)

  if (!section) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-[#020B2D] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="mb-8 rounded-3xl border border-[#243250] bg-[#071432] p-6 sm:p-8">
          <Link
            href="/dashboard/knowledge-hub/boq-guide"
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-orange-400 hover:text-orange-300"
          >
            <ArrowLeft size={16} />
            Back to BOQ Guide
          </Link>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-sm text-orange-300">
                <FileText size={16} />
                BOQ Topic
              </div>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                {section.title}
              </h1>

              <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-400 sm:text-base">
                {section.purpose}
              </p>
            </div>

            <div className="rounded-2xl border border-orange-500/20 bg-orange-500/10 p-5">
              <p className="text-sm text-slate-300">Topic Level</p>
              <p className="mt-1 text-xl font-bold text-orange-400">
                {section.level}
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <InfoSection
            title="What It Includes"
            icon={PackageCheck}
            items={section.includes}
          />

          <InfoSection
            title="Step-by-step Method"
            icon={ClipboardCheck}
            items={section.steps}
          />

          <section className="rounded-3xl border border-red-500/20 bg-red-500/10 p-6">
            <div className="mb-5 flex items-center gap-3">
              <AlertTriangle className="text-red-300" size={24} />
              <h2 className="text-2xl font-bold">Common Mistakes</h2>
            </div>

            <ul className="space-y-3">
              {section.commonMistakes.map((mistake) => (
                <li key={mistake} className="flex gap-3 text-slate-200">
                  <AlertTriangle className="mt-0.5 shrink-0 text-red-300" size={18} />
                  <span>{mistake}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-3xl border border-yellow-500/20 bg-yellow-500/10 p-6">
            <div className="mb-5 flex items-center gap-3">
              <Lightbulb className="text-yellow-300" size={24} />
              <h2 className="text-2xl font-bold">Professional Tips</h2>
            </div>

            <ul className="space-y-3">
              {section.proTips.map((tip) => (
                <li key={tip} className="flex gap-3 text-yellow-100">
                  <CheckCircle2 className="mt-0.5 shrink-0 text-yellow-300" size={18} />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </section>
        </section>

        {section.sampleRows?.length > 0 && (
          <section className="mt-8 rounded-3xl border border-[#243250] bg-[#071432] p-6">
            <div className="mb-5 flex items-center gap-3">
              <FileText className="text-orange-400" size={24} />
              <h2 className="text-2xl font-bold">Sample BOQ Rows</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-700 text-left text-slate-300">
                    <th className="py-3 pr-4">Item Description</th>
                    <th className="py-3 pr-4">Unit</th>
                    <th className="py-3 pr-4">Quantity</th>
                    <th className="py-3 pr-4">Rate</th>
                    <th className="py-3 pr-4">Amount</th>
                  </tr>
                </thead>

                <tbody>
                  {section.sampleRows.map((row) => (
                    <tr key={`${row.item}-${row.unit}`} className="border-b border-slate-800">
                      <td className="py-4 pr-4 text-white">{row.item}</td>
                      <td className="py-4 pr-4 text-slate-300">{row.unit}</td>
                      <td className="py-4 pr-4 text-slate-300">{row.qty}</td>
                      <td className="py-4 pr-4 text-slate-300">{row.rate}</td>
                      <td className="py-4 pr-4 font-semibold text-orange-300">
                        {row.amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        <section className="mt-8 rounded-3xl border border-orange-500/20 bg-orange-500/10 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">
                Want to prepare BOQ faster?
              </h2>
              <p className="mt-2 text-sm leading-7 text-slate-300">
                Use CivilCalc BOQ Generator to create project details, add BOQ
                items, calculate amount and prepare material summary.
              </p>
            </div>

            <Link
              href="/dashboard/calculators/boq-generator"
              className="rounded-xl bg-orange-500 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-orange-600"
            >
              Open BOQ Generator
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}
