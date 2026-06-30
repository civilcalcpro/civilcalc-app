'use client'

import Link from 'next/link'
import {
  ArrowRight,
  Building2,
  Calculator,
  CheckCircle2,
  Hammer,
  Layers,
  Lock,
  Ruler,
  ShieldCheck,
  Sparkles,
  BookOpen,
  HelpCircle,
} from 'lucide-react'

const liveTools = [
  {
    title: 'RCC Beam Design',
    titleHi: 'RCC बीम डिज़ाइन',
    href: '/dashboard/calculators/beam',
    icon: Ruler,
    badge: 'Live',
    desc: 'Design RCC beams with bending moment, shear, reinforcement and final design summary.',
    descHi: 'RCC बीम का bending moment, shear, steel reinforcement और final design निकालने के लिए।',
    points: ['Beam design', 'Steel calculation', 'PDF report'],
    useWhen: 'Use this when you want to design RCC beams for slabs, rooms, residential buildings or framed structures.',
    useWhenHi: 'जब आपको slab या building frame की RCC beam design करनी हो, तब इस tool का use करें।',
    output: 'Beam size, effective depth, main steel, shear check and design summary.',
    outputHi: 'Beam size, effective depth, main steel, shear check और design summary मिलेगी।',
  },
  {
    title: 'RCC Column Design',
    titleHi: 'RCC कॉलम डिज़ाइन',
    href: '/dashboard/calculators/column',
    icon: Building2,
    badge: 'Live',
    desc: 'Design RCC columns with axial load, size, reinforcement and safety checks.',
    descHi: 'Column load, size, reinforcement और safety check निकालने के लिए।',
    points: ['Axial load check', 'Column steel', 'Design output'],
    useWhen: 'Use this when vertical load from beams and slabs is transferred to a column.',
    useWhenHi: 'जब beam और slab का load column पर आता है, तब column design tool use करें।',
    output: 'Column size, steel percentage, number of bars and basic design check.',
    outputHi: 'Column size, steel percentage, bar quantity और basic design check मिलेगा।',
  },
  {
    title: 'RCC Footing Design',
    titleHi: 'RCC फुटिंग डिज़ाइन',
    href: '/dashboard/calculators/footing',
    icon: ShieldCheck,
    badge: 'Live',
    desc: 'Design isolated footing with soil pressure, depth, steel and quantity output.',
    descHi: 'Isolated footing का size, depth, soil pressure और steel निकालने के लिए।',
    points: ['Footing size', 'Soil pressure', 'Steel details'],
    useWhen: 'Use this when column load needs to be safely transferred to soil through footing.',
    useWhenHi: 'जब column का load soil में safely transfer करना हो, तब footing design tool use करें।',
    output: 'Footing area, depth, soil pressure, reinforcement and quantity summary.',
    outputHi: 'Footing area, depth, soil pressure, reinforcement और quantity summary मिलेगी।',
  },
 {
  title: 'One Way Slab Design',
  titleHi: 'वन वे स्लैब डिज़ाइन',
  href: '/dashboard/calculators/slab',
  icon: Layers,
  badge: 'Live',
  desc: 'Design one way RCC slab with span, load, effective depth, main steel and distribution steel.',
  descHi: 'One way RCC slab की span, load, depth, main steel और distribution steel निकालने के लिए।',
  points: ['One way slab', 'Main steel', 'Distribution steel'],
  useWhen: 'Use this when the slab is supported mainly in one direction and the longer span is more than twice the shorter span.',
  useWhenHi: 'जब slab mostly एक direction में bend करती हो और longer span, shorter span से 2 times से ज्यादा हो, तब One Way Slab tool use करें।',
  output: 'Slab thickness, effective depth, load calculation, main reinforcement, distribution reinforcement and design summary.',
  outputHi: 'Slab thickness, effective depth, load calculation, main reinforcement, distribution reinforcement और design summary मिलेगी।',
},
{
  title: 'Two Way Slab Design',
  titleHi: 'टू वे स्लैब डिज़ाइन',
  href: '/dashboard/calculators/two-way-slab',
  icon: Layers,
  badge: 'Live',
  desc: 'Design two way RCC slab with panel size, load, moments, reinforcement in both directions and final summary.',
  descHi: 'Two way RCC slab की panel size, load, moments और दोनों direction में reinforcement निकालने के लिए।',
  points: ['Two way slab', 'Steel in both directions', 'Panel design'],
  useWhen: 'Use this when the slab is supported on all four sides and the longer span is less than or equal to twice the shorter span.',
  useWhenHi: 'जब slab चारों side से supported हो और longer span, shorter span के 2 times से कम या बराबर हो, तब Two Way Slab tool use करें।',
  output: 'Moment in both directions, slab depth, reinforcement along short span and long span, and design summary.',
  outputHi: 'दोनों direction का moment, slab depth, short span steel, long span steel और design summary मिलेगी।',
},
]

const comingSoonTools = [
  {
    title: 'RCC Staircase Design',
    titleHi: 'RCC सीढ़ी डिज़ाइन',
    icon: Hammer,
    desc: 'Waist slab, steps, loads, steel and complete staircase design calculation.',
    descHi: 'Staircase waist slab, steps, load और steel calculation के लिए।',
  },
  {
    title: 'Retaining Wall Design',
    titleHi: 'Retaining Wall डिज़ाइन',
    icon: ShieldCheck,
    desc: 'Earth pressure, stability check, overturning, sliding and reinforcement design.',
    descHi: 'Earth pressure, sliding, overturning और stability check के लिए।',
  },
  {
    title: 'Lintel Design',
    titleHi: 'Lintel डिज़ाइन',
    icon: Ruler,
    desc: 'Opening width, wall load, lintel depth, steel and design summary.',
    descHi: 'Door/window opening के ऊपर lintel size और steel निकालने के लिए।',
  },
  {
    title: 'Shear Wall Design',
    titleHi: 'Shear Wall डिज़ाइन',
    icon: Building2,
    desc: 'Vertical load, lateral load, wall thickness and reinforcement design.',
    descHi: 'High-rise buildings में lateral load resist करने वाली wall design के लिए।',
  },
  {
    title: 'Water Tank Design',
    titleHi: 'Water Tank डिज़ाइन',
    icon: Layers,
    desc: 'Tank capacity, wall design, base slab, roof slab and reinforcement.',
    descHi: 'Water tank capacity, wall, base slab और reinforcement calculation के लिए।',
  },
  {
    title: 'Combined Footing Design',
    titleHi: 'Combined Footing डिज़ाइन',
    icon: Calculator,
    desc: 'Two-column footing, pressure distribution, depth and reinforcement design.',
    descHi: 'जब दो columns की footing combined करनी हो, तब इस tool का use होगा।',
  },
]

function LiveToolCard({ tool }) {
  const Icon = tool.icon

  return (
    <Link
      href={tool.href}
      className="group rounded-3xl border border-orange-500/20 bg-slate-900/80 p-5 shadow-lg shadow-black/20 transition-all duration-300 hover:-translate-y-1 hover:border-orange-400/60 hover:bg-slate-900"
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-400 ring-1 ring-orange-500/20">
          <Icon size={28} />
        </div>

        <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
          {tool.badge}
        </span>
      </div>

      <h3 className="text-xl font-black text-white">
        {tool.title}
      </h3>

      <p className="mt-1 text-sm font-semibold text-orange-300">
        {tool.titleHi}
      </p>

      <p className="mt-4 text-sm leading-6 text-slate-400">
        {tool.desc}
      </p>

      <p className="mt-2 text-sm leading-6 text-slate-400">
        {tool.descHi}
      </p>

      <div className="my-5 space-y-2">
        {tool.points.map((point) => (
          <div key={point} className="flex items-center gap-2 text-sm text-slate-300">
            <CheckCircle2 size={16} className="text-orange-400" />
            <span>{point}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between rounded-2xl bg-slate-950/80 px-4 py-3 text-sm font-semibold text-orange-300">
        <span>Open Tool / टूल खोलें</span>
        <ArrowRight
          size={18}
          className="transition-transform duration-300 group-hover:translate-x-1"
        />
      </div>
    </Link>
  )
}

function ComingSoonCard({ tool }) {
  const Icon = tool.icon

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-5 opacity-90">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800 text-slate-300 ring-1 ring-slate-700">
          <Icon size={28} />
        </div>

        <span className="flex items-center gap-1 rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-xs font-semibold text-slate-400">
          <Lock size={12} />
          Soon
        </span>
      </div>

      <h3 className="text-lg font-black text-white">
        {tool.title}
      </h3>

      <p className="mt-1 text-sm font-semibold text-orange-300">
        {tool.titleHi}
      </p>

      <p className="mt-4 text-sm leading-6 text-slate-400">
        {tool.desc}
      </p>

      <p className="mt-2 text-sm leading-6 text-slate-400">
        {tool.descHi}
      </p>
    </div>
  )
}

function ToolGuideCard({ tool }) {
  const Icon = tool.icon

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-400">
          <Icon size={24} />
        </div>

        <div>
          <h3 className="font-black text-white">
            {tool.title}
          </h3>
          <p className="text-sm font-semibold text-orange-300">
            {tool.titleHi}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-2xl bg-slate-950/70 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-bold text-white">
            <HelpCircle size={16} className="text-orange-400" />
            <span>Where to use? / कहाँ use करें?</span>
          </div>

          <p className="text-sm leading-6 text-slate-400">
            {tool.useWhen}
          </p>

          <p className="mt-2 text-sm leading-6 text-slate-400">
            {tool.useWhenHi}
          </p>
        </div>

        <div className="rounded-2xl bg-slate-950/70 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-bold text-white">
            <BookOpen size={16} className="text-orange-400" />
            <span>What output you get? / क्या result मिलेगा?</span>
          </div>

          <p className="text-sm leading-6 text-slate-400">
            {tool.output}
          </p>

          <p className="mt-2 text-sm leading-6 text-slate-400">
            {tool.outputHi}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function RCCDesignPage() {
  return (
    <main className="min-h-screen bg-[#050B1F] px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="relative overflow-hidden rounded-[2rem] border border-orange-500/20 bg-gradient-to-br from-slate-950 via-slate-900 to-[#07112c] p-6 shadow-2xl shadow-black/30 sm:p-8 lg:p-10">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-orange-500/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative z-10 max-w-4xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-sm font-semibold text-orange-300">
              <Sparkles size={16} />
              RCC Design Suite / RCC डिज़ाइन टूल्स
            </div>

            <h1 className="mb-4 text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
              RCC Design Tools for Civil Engineers
            </h1>

            <p className="max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
              Design RCC beams, columns, slabs and footings with step-by-step
              calculations, reinforcement details and professional report-ready output.
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
              RCC beam, column, slab और footing की design calculation, steel details
              और final report एक ही जगह आसानी से निकालें।
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-2xl font-black text-orange-400">
                  4
                </p>
                <p className="text-sm text-slate-400">
                  Live RCC tools
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  अभी available tools
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-2xl font-black text-orange-400">
                  IS Code
                </p>
                <p className="text-sm text-slate-400">
                  Design focused workflow
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Code based design approach
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-2xl font-black text-orange-400">
                  PDF
                </p>
                <p className="text-sm text-slate-400">
                  Professional output
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Report-ready result
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-black text-white">
                Available RCC Design Tools
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Existing CivilCalc RCC tools grouped in one professional section.
              </p>
              <p className="mt-1 text-sm text-slate-400">
                CivilCalc के existing RCC tools को एक ही जगह group किया गया है।
              </p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {liveTools.map((tool) => (
              <LiveToolCard key={tool.title} tool={tool} />
            ))}
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-5">
            <h2 className="text-2xl font-black text-white">
              Which RCC Tool Should You Use?
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              कौन सा RCC tool कब use करना है, यह guide user को सही calculator select करने में help करेगी।
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {liveTools.map((tool) => (
              <ToolGuideCard key={tool.title} tool={tool} />
            ))}
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-5">
            <h2 className="text-2xl font-black text-white">
              Upcoming RCC Tools
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              These tools can be added slowly without disturbing existing calculators.
            </p>
            <p className="mt-1 text-sm text-slate-400">
              इन tools को धीरे-धीरे add कर सकते हैं, existing tools खराब नहीं होंगे।
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {comingSoonTools.map((tool) => (
              <ComingSoonCard key={tool.title} tool={tool} />
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-[2rem] border border-orange-500/20 bg-orange-500/10 p-6 sm:p-8">
          <h2 className="mb-3 text-2xl font-black text-white">
            Recommended RCC Design Workflow
          </h2>

          <p className="max-w-4xl text-sm leading-7 text-slate-300 sm:text-base">
            First select the RCC member, enter project and design inputs, check
            reinforcement details, then download the final report. Later this section
            can connect with Project Save, BOQ, BBS and Site Diary.
          </p>

          <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-300 sm:text-base">
            सबसे पहले RCC member select करें, फिर design inputs भरें, steel और safety
            checks देखें, और final PDF report download करें। आगे चलकर इस section को
            Project Save, BOQ, BBS और Site Diary के साथ connect किया जा सकता है।
          </p>
        </section>
      </div>
    </main>
  )
}
