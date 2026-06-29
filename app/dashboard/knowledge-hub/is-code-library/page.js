import Link from 'next/link'
import {
  ArrowLeft,
  BookOpen,
  ShieldCheck,
  Building2,
  Waves,
  FlaskConical,
  CheckCircle2,
} from 'lucide-react'
import { isCodes, isCodeCategories } from './isCodeData'

export const metadata = {
  title: 'IS Code Summary | CivilCalc Pro Knowledge Hub',
  description:
    'Practical IS code summary for civil engineers covering IS 456, IS 10262, IS 1893, IS 13920, IS 875, IS 800, IS 1786, IS 383 and other important Indian Standards.',
}

const categoryIconMap = {
  'Concrete & RCC': Building2,
  'Loads & Earthquake': Waves,
  'Steel Structures': ShieldCheck,
  'Soil & Foundation': Building2,
  'Materials & Testing': FlaskConical,
  Masonry: Building2,
  'Construction Practice': CheckCircle2,
}

export default function ISCodeLibraryPage() {
  const verifiedCount = isCodes.filter((item) => item.verifiedFromUpload).length

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
                <BookOpen size={16} />
                Indian Standards for Civil Engineers
              </div>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                IS Code Summary
              </h1>

              <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-400 sm:text-base">
                Practical summary of important Indian Standards used in civil
                engineering. This library covers RCC, concrete mix design,
                earthquake design, dead loads, steel, foundation, materials,
                testing and masonry codes.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-orange-500/20 bg-orange-500/10 px-5 py-4">
                <p className="text-sm text-slate-300">Total Codes</p>
                <p className="mt-1 text-3xl font-bold text-orange-400">
                  {isCodes.length}
                </p>
              </div>

              <div className="rounded-2xl border border-green-500/20 bg-green-500/10 px-5 py-4">
                <p className="text-sm text-slate-300">PDF Verified</p>
                <p className="mt-1 text-3xl font-bold text-green-400">
                  {verifiedCount}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-7 grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-[#243250] bg-[#071432] p-5">
            <Building2 className="mb-3 text-orange-400" size={24} />
            <h2 className="font-bold text-white">RCC + Concrete</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              IS 456, IS 10262, IS 13920 and related concrete codes.
            </p>
          </div>

          <div className="rounded-2xl border border-[#243250] bg-[#071432] p-5">
            <Waves className="mb-3 text-orange-400" size={24} />
            <h2 className="font-bold text-white">Loads + Earthquake</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              IS 875, IS 1893 and seismic design references.
            </p>
          </div>

          <div className="rounded-2xl border border-[#243250] bg-[#071432] p-5">
            <FlaskConical className="mb-3 text-orange-400" size={24} />
            <h2 className="font-bold text-white">Testing Codes</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Concrete, soil, aggregate and brick testing references.
            </p>
          </div>

          <div className="rounded-2xl border border-[#243250] bg-[#071432] p-5">
            <ShieldCheck className="mb-3 text-orange-400" size={24} />
            <h2 className="font-bold text-white">Practical Use</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Code purpose, use, mistakes and related CivilCalc tools.
            </p>
          </div>
        </section>

        {isCodeCategories.map((category) => {
          const codes = isCodes.filter((item) => item.category === category)
          const Icon = categoryIconMap[category] || BookOpen

          if (codes.length === 0) return null

          return (
            <section key={category} className="mb-10">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-orange-500/30 bg-orange-500/10 text-orange-400">
                  <Icon size={21} />
                </div>
                <h2 className="text-2xl font-bold">{category}</h2>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {codes.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/dashboard/knowledge-hub/is-code-library/${item.slug}`}
                    className="group rounded-3xl border border-[#243250] bg-[#071432] p-5 transition duration-200 hover:-translate-y-1 hover:border-orange-500/40 hover:shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
                  >
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-orange-500/30 bg-orange-500/10 text-orange-400">
                        <BookOpen size={20} />
                      </div>

                      <div
                        className={`rounded-full border px-3 py-1 text-[11px] font-semibold ${
                          item.verifiedFromUpload
                            ? 'border-green-500/30 bg-green-500/10 text-green-300'
                            : 'border-slate-600 bg-[#081126] text-slate-200'
                        }`}
                      >
                        {item.verifiedFromUpload ? 'PDF Added' : item.level}
                      </div>
                    </div>

                    <p className="text-sm font-semibold text-orange-300">
                      {item.code}
                    </p>

                    <h3 className="mt-2 text-xl font-bold tracking-tight text-white">
                      {item.title}
                    </h3>

                    <p className="mt-3 min-h-[72px] text-sm leading-6 text-slate-400">
                      {item.shortDesc}
                    </p>

                    <div className="mt-5 border-t border-slate-800 pt-4">
                      <div className="flex items-center justify-between text-sm font-semibold text-orange-400">
                        <span>Open Code Summary</span>
                        <span className="transition group-hover:translate-x-1">
                          →
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )
        })}

        <section className="rounded-3xl border border-yellow-500/20 bg-yellow-500/10 p-6">
          <h2 className="text-2xl font-bold text-white">
            Important legal and engineering note
          </h2>
          <p className="mt-3 max-w-4xl text-sm leading-7 text-yellow-100 sm:text-base">
            This section gives simplified educational summaries only. It does
            not reproduce full BIS standards, clauses or tables. For final
            design, approval, tender or site execution, always refer the latest
            official BIS standard and project specifications.
          </p>
        </section>
      </div>
    </main>
  )
}
