import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  HardHat,
  ClipboardCheck,
  Wrench,
  Siren,
} from 'lucide-react'
import { safetyTopics } from '../safetyData'

export async function generateStaticParams() {
  return safetyTopics.map((topic) => ({
    slug: topic.slug,
  }))
}

export async function generateMetadata({ params }) {
  const topic = safetyTopics.find((item) => item.slug === params.slug)

  if (!topic) {
    return {
      title: 'Safety Hub | CivilCalc Pro',
    }
  }

  return {
    title: `${topic.title} | CivilCalc Pro Knowledge Hub`,
    description: topic.shortDesc,
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

export default function SafetyTopicDetailPage({ params }) {
  const topic = safetyTopics.find((item) => item.slug === params.slug)

  if (!topic) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-[#020B2D] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="mb-8 rounded-3xl border border-[#243250] bg-[#071432] p-6 sm:p-8">
          <Link
            href="/dashboard/knowledge-hub/safety"
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-orange-400 hover:text-orange-300"
          >
            <ArrowLeft size={16} />
            Back to Safety Hub
          </Link>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-sm text-orange-300">
                <ShieldCheck size={16} />
                Construction Safety Topic
              </div>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                {topic.title}
              </h1>

              <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-400 sm:text-base">
                {topic.purpose}
              </p>
            </div>

            <div className="rounded-2xl border border-orange-500/20 bg-orange-500/10 p-5">
              <p className="text-sm text-slate-300">Risk Level</p>
              <p className="mt-1 text-xl font-bold text-orange-400">
                {topic.level}
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-3xl border border-red-500/20 bg-red-500/10 p-6">
            <div className="mb-5 flex items-center gap-3">
              <AlertTriangle className="text-red-300" size={24} />
              <h2 className="text-2xl font-bold">Possible Hazards</h2>
            </div>

            <ul className="space-y-3">
              {topic.hazards.map((hazard) => (
                <li key={hazard} className="flex gap-3 text-slate-200">
                  <AlertTriangle className="mt-0.5 shrink-0 text-red-300" size={18} />
                  <span>{hazard}</span>
                </li>
              ))}
            </ul>
          </section>

          <InfoSection
            title="Required PPE"
            icon={HardHat}
            items={topic.requiredPPE}
          />

          <InfoSection
            title="Safe Work Practices"
            icon={ClipboardCheck}
            items={topic.safePractices}
          />

          <section className="rounded-3xl border border-yellow-500/20 bg-yellow-500/10 p-6">
            <div className="mb-5 flex items-center gap-3">
              <Wrench className="text-yellow-300" size={24} />
              <h2 className="text-2xl font-bold">Common Safety Mistakes</h2>
            </div>

            <ul className="space-y-3">
              {topic.commonMistakes.map((mistake) => (
                <li key={mistake} className="flex gap-3 text-yellow-100">
                  <AlertTriangle className="mt-0.5 shrink-0 text-yellow-300" size={18} />
                  <span>{mistake}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-3xl border border-orange-500/20 bg-orange-500/10 p-6 lg:col-span-2">
            <div className="mb-5 flex items-center gap-3">
              <Siren className="text-orange-300" size={24} />
              <h2 className="text-2xl font-bold">Emergency Action</h2>
            </div>

            <ul className="grid gap-3 md:grid-cols-2">
              {topic.emergencyAction.map((action) => (
                <li
                  key={action}
                  className="rounded-xl border border-orange-500/20 bg-[#081126] p-4 text-slate-200"
                >
                  {action}
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
                Practical Safety Note
              </h2>
              <p className="mt-2 text-sm leading-7 text-yellow-100">
                Site safety rules project condition, local regulation and work
                method ke hisab se change ho sakte hain. High-risk work ke liye
                trained supervisor, permit system and proper inspection zaroor
                follow karo.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
