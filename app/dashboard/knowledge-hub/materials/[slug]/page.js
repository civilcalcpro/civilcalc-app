import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  Layers,
  CheckCircle2,
  AlertTriangle,
  FlaskConical,
  ClipboardCheck,
  PackageCheck,
  BookOpen,
  HelpCircle,
  Wrench,
} from 'lucide-react'
import { materials } from '../materialsData'

export async function generateStaticParams() {
  return materials.map((material) => ({
    slug: material.slug,
  }))
}

export async function generateMetadata({ params }) {
  const material = materials.find((item) => item.slug === params.slug)

  if (!material) {
    return {
      title: 'Material Guide | CivilCalc Pro',
    }
  }

  return {
    title: `${material.title} Guide | CivilCalc Pro Knowledge Hub`,
    description: material.shortDesc,
  }
}

function Section({ title, icon: Icon, children }) {
  return (
    <section className="rounded-3xl border border-[#243250] bg-[#071432] p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-orange-500/30 bg-orange-500/10 text-orange-400">
          <Icon size={22} />
        </div>
        <h2 className="text-2xl font-bold text-white">{title}</h2>
      </div>

      {children}
    </section>
  )
}

function BulletList({ items = [] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-slate-300">
          <CheckCircle2 className="mt-0.5 shrink-0 text-orange-400" size={18} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

export default function MaterialDetailPage({ params }) {
  const material = materials.find((item) => item.slug === params.slug)

  if (!material) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-[#020B2D] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 rounded-3xl border border-[#243250] bg-[#071432] p-6 sm:p-8">
          <Link
            href="/dashboard/knowledge-hub/materials"
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-orange-400 hover:text-orange-300"
          >
            <ArrowLeft size={16} />
            Back to Material Guide
          </Link>

          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-sm text-orange-300">
                <Layers size={16} />
                Material Guide
              </div>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                {material.title}
              </h1>

              <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-400 sm:text-base">
                {material.intro}
              </p>
            </div>

            <div className="rounded-2xl border border-orange-500/20 bg-orange-500/10 p-5">
              <p className="text-sm text-slate-300">Guide Type</p>
              <p className="mt-1 text-xl font-bold text-orange-400">
                Construction Material
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Section title="Types" icon={Layers}>
            <BulletList items={material.types} />
          </Section>

          <Section title="Properties" icon={PackageCheck}>
            <BulletList items={material.properties} />
          </Section>

          <Section title="Uses" icon={Wrench}>
            <BulletList items={material.uses} />
          </Section>

          <Section title="Advantages" icon={CheckCircle2}>
            <BulletList items={material.advantages} />
          </Section>

          <Section title="Disadvantages" icon={AlertTriangle}>
            <BulletList items={material.disadvantages} />
          </Section>

          <Section title="Storage Method" icon={PackageCheck}>
            <BulletList items={material.storage} />
          </Section>

          <Section title="Quality Checks" icon={ClipboardCheck}>
            <BulletList items={material.qualityChecks} />
          </Section>

          <Section title="Laboratory Tests" icon={FlaskConical}>
            <BulletList items={material.labTests} />
          </Section>

          <Section title="Field Tests" icon={ClipboardCheck}>
            <BulletList items={material.fieldTests} />
          </Section>

          <Section title="IS Code References" icon={BookOpen}>
            <BulletList items={material.isCodes} />

            <p className="mt-4 rounded-xl border border-yellow-500/20 bg-yellow-500/10 p-4 text-sm text-yellow-100">
              Note: IS code summaries are for learning and practical reference.
              For final design, execution and approval, always verify the latest
              official BIS standard and project specification.
            </p>
          </Section>

          <section className="rounded-3xl border border-red-500/20 bg-red-500/10 p-6 lg:col-span-2">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-300">
                <AlertTriangle size={22} />
              </div>
              <h2 className="text-2xl font-bold">Common Site Mistakes</h2>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {(material.commonMistakes || []).map((mistake) => (
                <div
                  key={mistake}
                  className="rounded-xl border border-red-500/20 bg-slate-950/40 p-4 text-slate-200"
                >
                  {mistake}
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-[#243250] bg-[#071432] p-6 lg:col-span-2">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-orange-500/30 bg-orange-500/10 text-orange-400">
                <HelpCircle size={22} />
              </div>
              <h2 className="text-2xl font-bold">FAQs</h2>
            </div>

            <div className="space-y-4">
              {(material.faqs || []).map((faq) => (
                <div
                  key={faq.q}
                  className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5"
                >
                  <h3 className="font-bold text-white">{faq.q}</h3>
                  <p className="mt-2 text-slate-400">{faq.a}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-orange-500/20 bg-orange-500/10 p-6 lg:col-span-2">
            <h2 className="text-2xl font-bold">Related CivilCalc Tools</h2>

            <div className="mt-5 flex flex-wrap gap-3">
              {(material.relatedTools || []).map((tool) => (
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
        </div>
      </div>
    </main>
  )
}
