import Link from 'next/link'
import {
  ArrowLeft,
  FileText,
  Calculator,
  ClipboardCheck,
  IndianRupee,
  PackageCheck,
  CheckCircle2,
} from 'lucide-react'
import { boqGuideSections } from './boqData'

export const metadata = {
  title: 'BOQ Guide | CivilCalc Pro Knowledge Hub',
  description:
    'Complete BOQ guide for civil engineers covering quantity takeoff, BOQ format, rate analysis, material breakdown, RCC BOQ, contractor billing and BOQ checking.',
}

export default function BOQGuidePage() {
  const sampleRows = [
    {
      item: 'Excavation for foundation',
      unit: 'm³',
      qty: '24.50',
      rate: '₹250',
      amount: '₹6,125',
    },
    {
      item: 'RCC M20 in footing',
      unit: 'm³',
      qty: '5.40',
      rate: '₹7,500',
      amount: '₹40,500',
    },
    {
      item: 'Reinforcement steel Fe500',
      unit: 'kg',
      qty: '920',
      rate: '₹72',
      amount: '₹66,240',
    },
  ]

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
                <FileText size={16} />
                Bill of Quantities Guide
              </div>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                BOQ Guide
              </h1>

              <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-400 sm:text-base">
                Complete practical BOQ guide for civil engineers, contractors,
                quantity surveyors and students. Learn BOQ format, quantity
                takeoff, rate analysis, material breakdown, GST, RCC BOQ,
                contractor billing and BOQ checking.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/dashboard/calculators/boq-generator"
                  className="rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
                >
                  Open BOQ Generator
                </Link>

                <Link
                  href="/dashboard/knowledge-hub"
                  className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-orange-500/60 hover:text-orange-300"
                >
                  Knowledge Hub
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-orange-500/20 bg-orange-500/10 px-5 py-4">
              <p className="text-sm text-slate-300">BOQ Topics</p>
              <p className="mt-1 text-3xl font-bold text-orange-400">
                {boqGuideSections.length}
              </p>
            </div>
          </div>
        </section>

        <section className="mb-7 grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-[#243250] bg-[#071432] p-5">
            <Calculator className="mb-3 text-orange-400" size={24} />
            <h2 className="font-bold text-white">Quantity Takeoff</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Drawing se quantity calculate karna.
            </p>
          </div>

          <div className="rounded-2xl border border-[#243250] bg-[#071432] p-5">
            <IndianRupee className="mb-3 text-orange-400" size={24} />
            <h2 className="font-bold text-white">Rate Analysis</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Material, labour, wastage aur profit.
            </p>
          </div>

          <div className="rounded-2xl border border-[#243250] bg-[#071432] p-5">
            <PackageCheck className="mb-3 text-orange-400" size={24} />
            <h2 className="font-bold text-white">Material Summary</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Cement, sand, steel, bricks planning.
            </p>
          </div>

          <div className="rounded-2xl border border-[#243250] bg-[#071432] p-5">
            <ClipboardCheck className="mb-3 text-orange-400" size={24} />
            <h2 className="font-bold text-white">Billing Check</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Contractor bill aur BOQ verification.
            </p>
          </div>
        </section>

        <section className="mb-8 rounded-3xl border border-[#243250] bg-[#071432] p-6">
          <div className="mb-5 flex items-center gap-3">
            <FileText className="text-orange-400" size={24} />
            <h2 className="text-2xl font-bold">Sample BOQ Format</h2>
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
                {sampleRows.map((row) => (
                  <tr key={row.item} className="border-b border-slate-800">
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

        <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {boqGuideSections.map((section) => (
            <Link
              key={section.slug}
              href={`/dashboard/knowledge-hub/boq-guide/${section.slug}`}
              className="group rounded-3xl border border-[#243250] bg-[#071432] p-5 transition duration-200 hover:-translate-y-1 hover:border-orange-500/40 hover:shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-orange-500/30 bg-orange-500/10 text-orange-400">
                  <FileText size={20} />
                </div>

                <div className="rounded-full border border-slate-600 bg-[#081126] px-3 py-1 text-[11px] font-semibold text-slate-200">
                  {section.level}
                </div>
              </div>

              <h2 className="text-xl font-bold tracking-tight text-white">
                {section.title}
              </h2>

              <p className="mt-3 min-h-[68px] text-sm leading-6 text-slate-400">
                {section.shortDesc}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {section.tags.map((tag) => (
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
                  <span>Open BOQ Topic</span>
                  <span className="transition group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </section>

        <section className="mt-10 rounded-3xl border border-orange-500/20 bg-orange-500/10 p-6">
          <h2 className="text-2xl font-bold text-white">
            BOQ connects estimation, material planning and billing
          </h2>
          <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-300 sm:text-base">
            A proper BOQ helps calculate project cost, compare contractors,
            prepare quotations, plan material purchase and verify contractor
            bills. For faster work, use CivilCalc BOQ Generator from the
            dashboard.
          </p>
        </section>
      </div>
    </main>
  )
}
