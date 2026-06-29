import Link from 'next/link'
import {
  ArrowLeft,
  Wrench,
  Truck,
  Hammer,
  Settings,
  ShieldCheck,
  ClipboardCheck,
} from 'lucide-react'
import { equipmentList } from './equipmentData'

export const metadata = {
  title: 'Equipment Guide | CivilCalc Pro Knowledge Hub',
  description:
    'Construction equipment guide covering excavator, JCB, concrete mixer, vibrator, concrete pump, transit mixer, bar bending machine, plate compactor, scaffolding and tower crane.',
}

const levelClass = {
  'Heavy Equipment': 'border-orange-500/30 bg-orange-500/10 text-orange-200',
  'Site Equipment': 'border-slate-500/30 bg-slate-500/10 text-slate-200',
  'Concrete Equipment': 'border-blue-500/30 bg-blue-500/10 text-blue-200',
  'Steel Equipment': 'border-purple-500/30 bg-purple-500/10 text-purple-200',
  'Temporary Works': 'border-yellow-500/30 bg-yellow-500/10 text-yellow-100',
  'Heavy Lifting': 'border-red-500/30 bg-red-500/10 text-red-200',
  'Survey Equipment': 'border-green-500/30 bg-green-500/10 text-green-200',
}

export default function EquipmentGuidePage() {
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
                <Wrench size={16} />
                Construction Machines & Tools
              </div>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                Equipment Guide
              </h1>

              <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-400 sm:text-base">
                Practical construction equipment guide for site engineers,
                contractors and students. Learn equipment purpose, uses, main
                parts, pre-use checks, operating tips, maintenance, common
                mistakes and safety points.
              </p>
            </div>

            <div className="rounded-2xl border border-orange-500/20 bg-orange-500/10 px-5 py-4">
              <p className="text-sm text-slate-300">Equipment Topics</p>
              <p className="mt-1 text-3xl font-bold text-orange-400">
                {equipmentList.length}
              </p>
            </div>
          </div>
        </section>

        <section className="mb-7 grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-[#243250] bg-[#071432] p-5">
            <Truck className="mb-3 text-orange-400" size={24} />
            <h2 className="font-bold text-white">Heavy Machines</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Excavator, JCB, crane, pump and transit mixer.
            </p>
          </div>

          <div className="rounded-2xl border border-[#243250] bg-[#071432] p-5">
            <Hammer className="mb-3 text-orange-400" size={24} />
            <h2 className="font-bold text-white">Site Tools</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Concrete mixer, vibrator, compactor and steel machines.
            </p>
          </div>

          <div className="rounded-2xl border border-[#243250] bg-[#071432] p-5">
            <ClipboardCheck className="mb-3 text-orange-400" size={24} />
            <h2 className="font-bold text-white">Pre-use Checks</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Machine start karne se pehle kya check karna hai.
            </p>
          </div>

          <div className="rounded-2xl border border-[#243250] bg-[#071432] p-5">
            <ShieldCheck className="mb-3 text-orange-400" size={24} />
            <h2 className="font-bold text-white">Safety Guide</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Machine safety, operator safety and site precautions.
            </p>
          </div>
        </section>

        <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {equipmentList.map((equipment) => (
            <Link
              key={equipment.slug}
              href={`/dashboard/knowledge-hub/equipment/${equipment.slug}`}
              className="group rounded-3xl border border-[#243250] bg-[#071432] p-5 transition duration-200 hover:-translate-y-1 hover:border-orange-500/40 hover:shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-orange-500/30 bg-orange-500/10 text-orange-400">
                  <Settings size={20} />
                </div>

                <div
                  className={`rounded-full border px-3 py-1 text-[11px] font-semibold ${
                    levelClass[equipment.level] ||
                    'border-slate-600 bg-[#081126] text-slate-200'
                  }`}
                >
                  {equipment.level}
                </div>
              </div>

              <h2 className="text-xl font-bold tracking-tight text-white">
                {equipment.title}
              </h2>

              <p className="mt-3 min-h-[68px] text-sm leading-6 text-slate-400">
                {equipment.shortDesc}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {equipment.tags.map((tag) => (
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
                  <span>Open Equipment Guide</span>
                  <span className="transition group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </section>

        <section className="mt-10 rounded-3xl border border-yellow-500/20 bg-yellow-500/10 p-6">
          <h2 className="text-2xl font-bold text-white">
            Equipment selection directly affects speed, safety and quality
          </h2>
          <p className="mt-3 max-w-4xl text-sm leading-7 text-yellow-100 sm:text-base">
            Construction equipment ko work type, site condition, quantity,
            access space, operator skill aur safety requirement ke hisab se
            select karna chahiye. Wrong equipment productivity, cost aur safety
            dono ko affect karta hai.
          </p>
        </section>
      </div>
    </main>
  )
}
