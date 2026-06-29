import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  Calculator,
  CheckCircle2,
  BookOpen,
  Ruler,
  HelpCircle,
  AlertTriangle,
} from 'lucide-react'
import { formulaCategories } from '../formulasData'

export async function generateStaticParams() {
  return formulaCategories.map((category) => ({
    slug: category.slug,
  }))
}

export async function generateMetadata({ params }) {
  const category = formulaCategories.find((item) => item.slug === params.slug)

  if (!category) {
    return {
      title: 'Formula Guide | CivilCalc Pro',
    }
  }

  return {
    title: `${category.title} | CivilCalc Pro Knowledge Hub`,
    description: category.shortDesc,
  }
}

const relatedToolMap = {
  rcc: [
    { name: 'RCC Beam Design', href: '/dashboard/calculators/beam' },
    { name: 'Footing Design', href: '/dashboard/calculators/footing' },
  ],
  concrete: [
    { name: 'Concrete Calculator', href: '/dashboard/calculators/concrete-volume' },
    { name: 'BOQ Generator', href: '/dashboard/calculators/boq-generator' },
  ],
  steel: [
    { name: 'Steel Weight Calculator', href: '/dashboard/calculators/steel-weight' },
    { name: 'BBS Generator', href: '/dashboard/calculators/bbs-generator' },
  ],
  estimation: [
    { name: 'BOQ Generator', href: '/dashboard/calculators/boq-generator' },
    { name: 'Brickwork Calculator', href: '/dashboard/calculators/brickwork' },
  ],
  soil: [
    { name: 'Footing Design', href: '/dashboard/calculators/footing' },
  ],
  surveying: [
    { name: 'CivilCalc Dashboard', href: '/dashboard' },
  ],
  hydraulics: [
    { name: 'CivilCalc Dashboard', href: '/dashboard' },
  ],
  transportation: [
    { name: 'Excavation Calculator', href: '/dashboard/calculators/excavation' },
  ],
  'structural-analysis': [
    { name: 'Structural Analysis', href: '/dashboard/calculators/structural-analysis' },
    { name: 'Moment Distribution', href: '/dashboard/calculators/moment-distribution' },
  ],
}

function getFormulaDetails(slug, formula) {
  const details = {
    rcc: {
      explanation:
        'RCC formulas are used for reinforced concrete beams, slabs, columns, footings and reinforcement detailing.',
      variables:
        'Common variables include load, span, effective depth, concrete grade, steel grade and reinforcement area.',
      unit:
        'Usually N, kN, mm, m, N/mm², kN/m and mm² depending on the formula.',
      example:
        'For RCC beam design, bending moment and effective depth are used to estimate required reinforcement.',
    },
    concrete: {
      explanation:
        'Concrete formulas are used to calculate volume, dry volume, cement, sand, aggregate and water requirement.',
      variables:
        'Common variables include length, width, depth, wet volume, dry volume, mix ratio and density.',
      unit:
        'Usually m³, ft³, kg, bags, cft and litres.',
      example:
        'For concrete volume, multiply length × width × depth to get wet volume.',
    },
    steel: {
      explanation:
        'Steel formulas are used for bar weight, cutting length, bend deduction, hook length and BBS preparation.',
      variables:
        'Common variables include bar diameter, length, number of bars, bend angle, lap length and hook length.',
      unit:
        'Usually mm, m, kg/m and kg.',
      example:
        'For steel weight, D²/162 gives approximate weight in kg per meter, where D is bar diameter in mm.',
    },
    estimation: {
      explanation:
        'Estimation formulas are used to calculate quantities of excavation, concrete, brickwork, plaster, flooring and painting.',
      variables:
        'Common variables include length, width, height, area, volume, quantity, rate and amount.',
      unit:
        'Usually m³, m², running meter, Nos and ₹.',
      example:
        'For plaster area, multiply wall length × wall height and subtract openings if required.',
    },
    soil: {
      explanation:
        'Soil mechanics formulas are used to understand soil density, water content, void ratio, porosity and bearing capacity.',
      variables:
        'Common variables include water weight, dry weight, volume of voids, volume of solids and unit weight.',
      unit:
        'Usually %, kN/m³, g/cc and kN/m².',
      example:
        'Water content is calculated using weight of water divided by dry weight of soil.',
    },
    surveying: {
      explanation:
        'Surveying formulas are used for levelling, area calculation, bearings, traverse correction and field measurements.',
      variables:
        'Common variables include reduced level, staff reading, bearing, distance, latitude and departure.',
      unit:
        'Usually m, degree, minutes, seconds and m².',
      example:
        'In height of instrument method, RL of point = HI - staff reading.',
    },
    hydraulics: {
      explanation:
        'Hydraulics formulas are used for water flow, pressure, velocity, pipe flow and open channel flow.',
      variables:
        'Common variables include discharge, area, velocity, pressure, head and hydraulic radius.',
      unit:
        'Usually m³/s, m/s, N/m², m and kN/m².',
      example:
        'Discharge is calculated as Q = A × V, where A is area and V is velocity.',
    },
    transportation: {
      explanation:
        'Transportation formulas are used in highway design, camber, gradient, sight distance and road earthwork.',
      variables:
        'Common variables include speed, reaction time, friction coefficient, gradient and road width.',
      unit:
        'Usually m, km/h, %, degree and m³.',
      example:
        'Stopping sight distance depends on vehicle speed, reaction time and braking distance.',
    },
    'structural-analysis': {
      explanation:
        'Structural analysis formulas are used for reactions, shear force, bending moment, slope, deflection and member forces.',
      variables:
        'Common variables include load, span, support reaction, EI, moment, shear force and deflection.',
      unit:
        'Usually kN, kN/m, kNm, mm and radian.',
      example:
        'For simply supported beam with central point load, maximum bending moment is W×L/4.',
    },
  }

  return {
    name: formula,
    ...(details[slug] || details.rcc),
  }
}

export default function FormulaDetailPage({ params }) {
  const category = formulaCategories.find((item) => item.slug === params.slug)

  if (!category) {
    notFound()
  }

  const relatedTools = relatedToolMap[category.slug] || [
    { name: 'CivilCalc Dashboard', href: '/dashboard' },
  ]

  return (
    <main className="min-h-screen bg-[#020B2D] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="mb-8 rounded-3xl border border-[#243250] bg-[#071432] p-6 sm:p-8">
          <Link
            href="/dashboard/knowledge-hub/formulas"
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-orange-400 hover:text-orange-300"
          >
            <ArrowLeft size={16} />
            Back to Formula Library
          </Link>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-sm text-orange-300">
                <Calculator size={16} />
                Formula Guide
              </div>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                {category.title}
              </h1>

              <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-400 sm:text-base">
                {category.shortDesc}
              </p>
            </div>

            <div className="rounded-2xl border border-orange-500/20 bg-orange-500/10 p-5">
              <p className="text-sm text-slate-300">Difficulty Level</p>
              <p className="mt-1 text-xl font-bold text-orange-400">
                {category.level}
              </p>
            </div>
          </div>
        </section>

        <section className="mb-7 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-[#243250] bg-[#071432] p-5">
            <Calculator className="mb-3 text-orange-400" size={24} />
            <h2 className="font-bold text-white">Formula Explanation</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Har formula ka purpose, use case aur meaning simple language me.
            </p>
          </div>

          <div className="rounded-2xl border border-[#243250] bg-[#071432] p-5">
            <Ruler className="mb-3 text-orange-400" size={24} />
            <h2 className="font-bold text-white">Variables & Units</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Formula me use hone wale symbols, units aur input values.
            </p>
          </div>

          <div className="rounded-2xl border border-[#243250] bg-[#071432] p-5">
            <BookOpen className="mb-3 text-orange-400" size={24} />
            <h2 className="font-bold text-white">Practical Example</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Site aur exam-style use ke liye short example explanation.
            </p>
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-2">
          {category.formulas.map((formula) => {
            const item = getFormulaDetails(category.slug, formula)

            return (
              <div
                key={formula}
                className="rounded-3xl border border-[#243250] bg-[#071432] p-6"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-orange-500/30 bg-orange-500/10 text-orange-400">
                    <Calculator size={20} />
                  </div>

                  <span className="rounded-full border border-slate-600 bg-[#081126] px-3 py-1 text-[11px] font-semibold text-slate-200">
                    Formula
                  </span>
                </div>

                <h2 className="text-xl font-bold text-white">{item.name}</h2>

                <div className="mt-5 space-y-4">
                  <div>
                    <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-orange-300">
                      <CheckCircle2 size={16} />
                      Explanation
                    </h3>
                    <p className="text-sm leading-6 text-slate-400">
                      {item.explanation}
                    </p>
                  </div>

                  <div>
                    <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-orange-300">
                      <Ruler size={16} />
                      Variables
                    </h3>
                    <p className="text-sm leading-6 text-slate-400">
                      {item.variables}
                    </p>
                  </div>

                  <div>
                    <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-orange-300">
                      <BookOpen size={16} />
                      Units
                    </h3>
                    <p className="text-sm leading-6 text-slate-400">
                      {item.unit}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-orange-500/20 bg-orange-500/10 p-4">
                    <h3 className="mb-2 text-sm font-semibold text-orange-300">
                      Example Use
                    </h3>
                    <p className="text-sm leading-6 text-slate-300">
                      {item.example}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </section>

        <section className="mt-8 rounded-3xl border border-yellow-500/20 bg-yellow-500/10 p-6">
          <div className="flex gap-3">
            <AlertTriangle className="mt-1 shrink-0 text-yellow-300" size={22} />
            <div>
              <h2 className="text-xl font-bold text-white">
                Engineering Note
              </h2>
              <p className="mt-2 text-sm leading-7 text-yellow-100">
                These formulas are for learning, estimation and practical
                reference. For final structural design, always follow latest IS
                codes, project drawings and approval requirements.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-orange-500/20 bg-orange-500/10 p-6">
          <div className="mb-5 flex items-center gap-3">
            <HelpCircle className="text-orange-400" size={24} />
            <h2 className="text-2xl font-bold">Related CivilCalc Tools</h2>
          </div>

          <div className="flex flex-wrap gap-3">
            {relatedTools.map((tool) => (
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
    </main>
  )
}
