import Link from 'next/link'
import {
  ArrowLeft,
  Layers,
  ShieldCheck,
  FlaskConical,
  PackageCheck,
  Droplets,
  Hammer,
} from 'lucide-react'
import { materials } from './materialsData'

export const metadata = {
  title: 'Material Guide | CivilCalc Pro Knowledge Hub',
  description:
    'Civil engineering material guide for cement, steel, sand, aggregate, bricks, blocks, concrete, fly ash, admixture and waterproofing.',
}

const iconMap = {
  cement: PackageCheck,
  steel: Hammer,
  sand: Droplets,
  aggregate: Layers,
  bricks: PackageCheck,
  blocks: PackageCheck,
  concrete: PackageCheck,
  'fly-ash': Layers,
  admixture: FlaskConical,
  waterproofing: ShieldCheck,
}

const levelMap = {
  cement: 'Basic to Advanced',
  steel: 'Basic to Advanced',
  sand: 'Basic',
  aggregate: 'Intermediate',
  bricks: 'Basic',
  blocks: 'Intermediate',
  concrete: 'Basic to Advanced',
  'fly-ash': 'Intermediate',
  admixture: 'Intermediate',
  waterproofing: 'Intermediate to Advanced',
}

const tagMap = {
  cement: ['Types', 'Storage', 'Lab tests', 'IS codes'],
  steel: ['Bar types', 'Quality check', 'Tests', 'IS codes'],
  sand: ['Silt check', 'Bulking', 'Uses', 'Field tests'],
  aggregate: ['Grading', 'Size', 'Quality check', 'Tests'],
  bricks: ['Brick types', 'Water absorption', 'Field tests', 'IS codes'],
  blocks: ['AAC blocks', 'Concrete blocks', 'Checks', 'Uses'],
  concrete: ['Grades', 'Workability', 'Curing', 'Tests'],
  'fly-ash': ['Uses', 'Advantages', 'Tests', 'Precautions'],
  admixture: ['Types', 'Dosage', 'Trial mix', 'Checks'],
  waterproofing: ['Methods', 'Ponding test', 'Applications', 'Mistakes'],
}

export default function MaterialGuidePage() {
  return (
    <main className="min-h-screen bg-[#020B2D] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="mb-8 rounded-3xl border border-[#243250] bg-[#071432] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] sm:p-8">
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
                <Layers size={16} />
                Civil Engineering Materials
              </div>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                Material Guide
              </h1>

              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-400 sm:text-base">
                Learn about cement, steel, sand, aggregate, bricks, blocks,
                concrete, fly ash, admixture and waterproofing with uses,
                quality checks, storage methods, laboratory tests, field tests,
                IS code references and common site mistakes.
              </p>
            </div>

            <div className="rounded-2xl border border-orange-500/20 bg-orange-500/10 px-5 py-4">
              <p className="text-sm text-slate-300">Total Materials</p>
              <p className="mt-1 text-3xl font-bold text-orange-400">
                {materials.length}
              </p>
            </div>
          </div>
        </section>

        <section className="mb-7 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-[#243250] bg-[#071432] p-5">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl border border-orange-500/30 bg-orange-500/10 text-orange-400">
              <Layers size={22} />
            </div>
            <h2 className="font-bold text-white">Material Basics</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Types, properties, uses, advantages and disadvantages in simple
              language.
            </p>
          </div>

          <div className="rounded-2xl border border-[#243250] bg-[#071432] p-5">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl border border-orange-500/30 bg-orange-500/10 text-orange-400">
              <ShieldCheck size={22} />
            </div>
            <h2 className="font-bold text-white">Site Quality Checks</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Field checks, storage method and common mistakes before using
              material on site.
            </p>
          </div>

          <div className="rounded-2xl border border-[#243250] bg-[#071432] p-5">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl border border-orange-500/30 bg-orange-500/10 text-orange-400">
              <FlaskConical size={22} />
            </div>
            <h2 className="font-bold text-white">Tests & IS Codes</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Laboratory tests, field tests and important IS code references for
              practical use.
            </p>
          </div>
        </section>

        <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {materials.map((material) => {
            const Icon = iconMap[material.slug] || Layers
            const level = levelMap[material.slug] || 'Material Guide'
            const tags = tagMap[material.slug] || [
              'Types',
              'Uses',
              'Tests',
              'IS Codes',
            ]

            return (
              <Link
                key={material.slug}
                href={`/dashboard/knowledge-hub/materials/${material.slug}`}
                className="group rounded-3xl border border-[#243250] bg-[#071432] p-5 transition duration-200 hover:-translate-y-1 hover:border-orange-500/40 hover:shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-orange-500/30 bg-orange-500/10 text-orange-400">
                    <Icon size={20} />
                  </div>

                  <div className="rounded-full border border-slate-600 bg-[#081126] px-3 py-1 text-[11px] font-semibold text-slate-200">
                    {level}
                  </div>
                </div>

                <h2 className="text-xl font-bold tracking-tight text-white">
                  {material.title}
                </h2>

                <p className="mt-3 min-h-[68px] text-sm leading-6 text-slate-400">
                  {material.shortDesc}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {tags.map((tag) => (
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
                    <span>Open Guide</span>
                    <span className="transition group-hover:translate-x-1">
                      →
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </section>

        <section className="mt-10 rounded-3xl border border-orange-500/20 bg-orange-500/10 p-6">
          <h2 className="text-2xl font-bold text-white">
            Material knowledge built for practical construction work
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
            This section is being improved step by step to give students, site
            engineers and contractors a strong practical reference for material
            selection, testing, storage and quality control.
          </p>
        </section>
      </div>
    </main>
  )
}
