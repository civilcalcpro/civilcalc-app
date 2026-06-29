import Link from 'next/link'
import {
  ArrowLeft,
  FlaskConical,
  ShieldCheck,
  ClipboardCheck,
  Activity,
} from 'lucide-react'
import { tests } from './testingData'

export const metadata = {
  title: 'Testing Guide | CivilCalc Pro Knowledge Hub',
  description:
    'Civil engineering testing guide for slump test, cube test, sieve analysis, core test, rebound hammer, UPV, plate load and field density test.',
}

export default function TestingGuidePage() {
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
                <FlaskConical size={16} />
                Civil Engineering Tests
              </div>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                Testing Guide
              </h1>

              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-400 sm:text-base">
                Learn important civil engineering tests like slump test, cube
                test, sieve analysis, core test, rebound hammer test, UPV test,
                plate load test and field density test with purpose, apparatus,
                procedure, result and common mistakes.
              </p>
            </div>

            <div className="rounded-2xl border border-orange-500/20 bg-orange-500/10 px-5 py-4">
              <p className="text-sm text-slate-300">Total Tests</p>
              <p className="mt-1 text-3xl font-bold text-orange-400">
                {tests.length}
              </p>
            </div>
          </div>
        </section>

        <section className="mb-7 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-[#243250] bg-[#071432] p-5">
            <FlaskConical className="mb-3 text-orange-400" size={24} />
            <h2 className="font-bold text-white">Lab + Field Tests</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Concrete, aggregate and soil tests explained in simple steps.
            </p>
          </div>

          <div className="rounded-2xl border border-[#243250] bg-[#071432] p-5">
            <ClipboardCheck className="mb-3 text-orange-400" size={24} />
            <h2 className="font-bold text-white">Procedure Based</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Apparatus, procedure, observations and result format included.
            </p>
          </div>

          <div className="rounded-2xl border border-[#243250] bg-[#071432] p-5">
            <ShieldCheck className="mb-3 text-orange-400" size={24} />
            <h2 className="font-bold text-white">Mistakes + Safety</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Common testing errors and safety points for practical site use.
            </p>
          </div>
        </section>

        <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {tests.map((test) => (
            <Link
              key={test.slug}
              href={`/dashboard/knowledge-hub/testing/${test.slug}`}
              className="group rounded-3xl border border-[#243250] bg-[#071432] p-5 transition duration-200 hover:-translate-y-1 hover:border-orange-500/40 hover:shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-orange-500/30 bg-orange-500/10 text-orange-400">
                  <Activity size={20} />
                </div>

                <div className="rounded-full border border-slate-600 bg-[#081126] px-3 py-1 text-[11px] font-semibold text-slate-200">
                  {test.level}
                </div>
              </div>

              <h2 className="text-xl font-bold tracking-tight text-white">
                {test.title}
              </h2>

              <p className="mt-3 min-h-[68px] text-sm leading-6 text-slate-400">
                {test.shortDesc}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {test.tags.map((tag) => (
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
                  <span>Open Test Guide</span>
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
