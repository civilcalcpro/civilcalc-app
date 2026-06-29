'use client'

import Link from 'next/link'
import {
  ArrowRight,
  BookOpen,
  Calculator,
  CheckCircle2,
  FileText,
  Hammer,
  HelpCircle,
  Home,
  Layers,
  Lock,
  Ruler,
  Sparkles,
} from 'lucide-react'

const liveTools = [
  {
    title: 'Concrete & Mix Calculator',
    titleHi: 'कंक्रीट और मिक्स कैलकुलेटर',
    href: '/dashboard/calculators/concrete-volume',
    icon: Calculator,
    badge: 'Live',
    desc: 'Calculate concrete quantity, cement, sand, aggregate and total material cost.',
    descHi: 'Concrete quantity, cement, sand, aggregate और total material cost निकालने के लिए।',
    points: ['Concrete quantity', 'Material takeoff', 'Rate calculation'],
    useWhen: 'Use this for RCC work, PCC work, slab, beam, column, footing and concrete volume estimation.',
    useWhenHi: 'RCC, PCC, slab, beam, column और footing में concrete quantity और material estimate के लिए use करें।',
    output: 'Wet volume, dry volume, cement bags, sand, aggregate, rate and total cost.',
    outputHi: 'Wet volume, dry volume, cement bags, sand, aggregate, rate और total cost मिलेगा।',
  },
  {
    title: 'Brickwork Calculator',
    titleHi: 'ब्रिकवर्क कैलकुलेटर',
    href: '/dashboard/calculators/brickwork',
    icon: Layers,
    badge: 'Live',
    desc: 'Calculate brick count, mortar quantity, cement, sand and brickwork cost.',
    descHi: 'Brick count, mortar quantity, cement, sand और brickwork cost निकालने के लिए।',
    points: ['Brick count', 'Mortar takeoff', 'Cost estimate'],
    useWhen: 'Use this for wall masonry, partition walls, 230mm walls and 115mm walls.',
    useWhenHi: 'Wall masonry, partition wall, 230mm wall और 115mm wall के estimate के लिए use करें।',
    output: 'Number of bricks, mortar volume, cement bags, sand quantity, rate and total cost.',
    outputHi: 'Bricks की संख्या, mortar volume, cement bags, sand quantity, rate और total cost मिलेगा।',
  },
  {
    title: 'Plaster Work Calculator',
    titleHi: 'प्लास्टर वर्क कैलकुलेटर',
    href: '/dashboard/calculators/plaster',
    icon: Hammer,
    badge: 'Live',
    desc: 'Calculate plaster area, cement, sand and plastering cost.',
    descHi: 'Plaster area, cement, sand और plastering cost निकालने के लिए।',
    points: ['Plaster area', 'Cement & sand', 'Rate calculation'],
    useWhen: 'Use this for internal plaster, external plaster, wall plaster and ceiling plaster.',
    useWhenHi: 'Internal plaster, external plaster, wall plaster और ceiling plaster के लिए use करें।',
    output: 'Plaster area, mortar volume, cement bags, sand quantity, rate and total cost.',
    outputHi: 'Plaster area, mortar volume, cement bags, sand quantity, rate और total cost मिलेगा।',
  },
  {
    title: 'Tile Calculator',
    titleHi: 'टाइल कैलकुलेटर',
    href: '/dashboard/calculators/tile',
    icon: Ruler,
    badge: 'Live',
    desc: 'Calculate tile quantity, area, wastage and total tile work cost.',
    descHi: 'Tile quantity, area, wastage और total tile work cost निकालने के लिए।',
    points: ['Tile quantity', 'Wastage', 'Cost estimate'],
    useWhen: 'Use this for flooring tiles, wall tiles, bathroom tiles and kitchen tiles.',
    useWhenHi: 'Flooring tiles, wall tiles, bathroom tiles और kitchen tiles के लिए use करें।',
    output: 'Total area, number of tiles, wastage quantity, rate and total cost.',
    outputHi: 'Total area, tiles quantity, wastage quantity, rate और total cost मिलेगा।',
  },
  {
    title: 'Paint Calculator',
    titleHi: 'पेंट कैलकुलेटर',
    href: '/dashboard/calculators/paint',
    icon: FileText,
    badge: 'Live',
    desc: 'Calculate paintable area, paint quantity, coats and total painting cost.',
    descHi: 'Paintable area, paint quantity, coats और painting cost निकालने के लिए।',
    points: ['Paint area', 'Paint quantity', 'Painting cost'],
    useWhen: 'Use this for interior painting, exterior painting, wall painting and ceiling painting.',
    useWhenHi: 'Interior painting, exterior painting, wall painting और ceiling painting के लिए use करें।',
    output: 'Paint area, required paint, number of coats, rate and total cost.',
    outputHi: 'Paint area, required paint, coats, rate और total cost मिलेगा।',
  },
  {
    title: 'Excavation Calculator',
    titleHi: 'खुदाई कैलकुलेटर',
    href: '/dashboard/calculators/excavation',
    icon: Home,
    badge: 'Live',
    desc: 'Calculate excavation quantity, earthwork volume and excavation cost.',
    descHi: 'Excavation quantity, earthwork volume और excavation cost निकालने के लिए।',
    points: ['Earthwork volume', 'Excavation quantity', 'Cost estimate'],
    useWhen: 'Use this for foundation excavation, trench excavation, footing excavation and site earthwork.',
    useWhenHi: 'Foundation excavation, trench excavation, footing excavation और site earthwork के लिए use करें।',
    output: 'Excavation volume, quantity in m³/cft, rate and total excavation cost.',
    outputHi: 'Excavation volume, quantity in m³/cft, rate और total excavation cost मिलेगा।',
  },
]

const comingSoonTools = [
  {
    title: 'Shuttering Area Calculator',
    titleHi: 'शटरिंग एरिया कैलकुलेटर',
    icon: Ruler,
    desc: 'Calculate shuttering area for beam, column, slab and footing.',
    descHi: 'Beam, column, slab और footing की shuttering area calculation के लिए।',
  },
  {
    title: 'Scaffolding Calculator',
    titleHi: 'स्कैफोल्डिंग कैलकुलेटर',
    icon: Layers,
    desc: 'Calculate scaffolding quantity and estimated cost for site work.',
    descHi: 'Site work के लिए scaffolding quantity और cost estimate के लिए।',
  },
  {
    title: 'PCC Quantity Calculator',
    titleHi: 'PCC क्वांटिटी कैलकुलेटर',
    icon: Calculator,
    desc: 'Calculate PCC volume, cement, sand, aggregate and cost.',
    descHi: 'PCC volume, cement, sand, aggregate और cost calculation के लिए।',
  },
  {
    title: 'Rate Analysis Tool',
    titleHi: 'रेट एनालिसिस टूल',
    icon: FileText,
    desc: 'Calculate final rate per unit using material, labour, machinery, overhead and profit.',
    descHi: 'Material, labour, machinery, overhead और profit से final rate per unit निकालने के लिए।',
  },
  {
    title: 'Material Wastage Calculator',
    titleHi: 'मटेरियल वेस्टेज कैलकुलेटर',
    icon: Hammer,
    desc: 'Calculate wastage percentage and extra material requirement.',
    descHi: 'Wastage percentage और extra material requirement निकालने के लिए।',
  },
  {
    title: 'Labour Cost Calculator',
    titleHi: 'लेबर कॉस्ट कैलकुलेटर',
    icon: Home,
    desc: 'Calculate labour cost by area, quantity, labour rate and work type.',
    descHi: 'Area, quantity, labour rate और work type के हिसाब से labour cost निकालने के लिए।',
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

export default function QuantityCostPage() {
  return (
    <main className="min-h-screen bg-[#050B1F] px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="relative overflow-hidden rounded-[2rem] border border-orange-500/20 bg-gradient-to-br from-slate-950 via-slate-900 to-[#07112c] p-6 shadow-2xl shadow-black/30 sm:p-8 lg:p-10">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-orange-500/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative z-10 max-w-4xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-sm font-semibold text-orange-300">
              <Sparkles size={16} />
              Quantity & Cost Tools / क्वांटिटी और कॉस्ट टूल्स
            </div>

            <h1 className="mb-4 text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
              Quantity & Cost Estimation Tools
            </h1>

            <p className="max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
              Calculate material quantity, takeoff, rates and total construction
              cost for concrete, brickwork, plaster, tiles, paint and excavation.
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
              Concrete, brickwork, plaster, tile, paint और excavation की quantity,
              material requirement और cost estimate आसानी से निकालें।
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-2xl font-black text-orange-400">
                  6
                </p>
                <p className="text-sm text-slate-400">
                  Live quantity tools
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  अभी available tools
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-2xl font-black text-orange-400">
                  Rate
                </p>
                <p className="text-sm text-slate-400">
                  Cost calculation included
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Quantity + Rate + Amount
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-2xl font-black text-orange-400">
                  PDF
                </p>
                <p className="text-sm text-slate-400">
                  Report-ready output
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Estimate summary
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-5">
            <h2 className="text-2xl font-black text-white">
              Available Quantity & Cost Tools
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Material quantity, rate calculation and total cost estimation tools in one section.
            </p>
            <p className="mt-1 text-sm text-slate-400">
              Material quantity, rate और total cost estimate के लिए सभी tools एक जगह।
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {liveTools.map((tool) => (
              <LiveToolCard key={tool.title} tool={tool} />
            ))}
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-5">
            <h2 className="text-2xl font-black text-white">
              Which Quantity Tool Should You Use?
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              कौन सा quantity tool कब use करना है, यह guide user को सही calculator select करने में help करेगी।
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
              Upcoming Quantity & Cost Tools
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              These tools can be added slowly to make CivilCalc a complete estimation platform.
            </p>
            <p className="mt-1 text-sm text-slate-400">
              इन tools को add करके CivilCalc को complete estimation platform बनाया जा सकता है।
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
            Recommended Quantity Estimation Workflow
          </h2>

          <p className="max-w-4xl text-sm leading-7 text-slate-300 sm:text-base">
            First select the work type, enter dimensions, select unit, add material
            rates, check quantity and cost, then download the estimate report.
            Later this section can connect with BOQ, Home Cost, Site Diary and Inventory.
          </p>

          <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-300 sm:text-base">
            सबसे पहले work type select करें, dimensions भरें, unit select करें,
            material rates add करें, quantity और cost check करें, फिर final estimate
            report download करें। आगे चलकर इस section को BOQ, Home Cost, Site Diary
            और Inventory के साथ connect किया जा सकता है।
          </p>
        </section>
      </div>
    </main>
  )
}
