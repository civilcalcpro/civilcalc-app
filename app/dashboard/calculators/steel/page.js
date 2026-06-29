'use client'

import Link from 'next/link'
import {
  ArrowRight,
  BookOpen,
  Calculator,
  CheckCircle2,
  HelpCircle,
  Lock,
  Ruler,
  ShieldCheck,
  Sparkles,
  Wrench,
} from 'lucide-react'

const liveTools = [
  {
    title: 'Steel Weight Calculator',
    titleHi: 'स्टील वेट कैलकुलेटर',
    href: '/dashboard/calculators/steel-weight',
    icon: ruler,
    badge: 'Live',
    desc: 'Calculate steel bar weight by diameter, length and quantity with rate-based cost estimate.',
    descHi: 'Bar diameter, length और quantity के हिसाब से steel weight और cost निकालने के लिए।',
    points: ['Bar weight', 'Total steel kg', 'Cost estimate'],
    useWhen: 'Use this when you want to calculate steel weight for bars used in beam, column, slab, footing or site work.',
    useWhenHi: 'जब beam, column, slab, footing या site work में steel का total weight निकालना हो, तब इस tool का use करें।',
    output: 'Unit weight, total steel weight, number of bars, rate and total steel cost.',
    outputHi: 'Unit weight, total steel weight, bars quantity, rate और total steel cost मिलेगा।',
  },
  {
    title: 'Lap Length Calculator',
    titleHi: 'लैप लेंथ कैलकुलेटर',
    href: '/dashboard/calculators/lap-length',
    icon: Ruler,
    badge: 'Live',
    desc: 'Calculate required lap length for reinforcement bars based on diameter and member type.',
    descHi: 'Bar diameter और member type के हिसाब से reinforcement की lap length निकालने के लिए।',
    points: ['Lap length', 'Bar diameter', 'Member wise output'],
    useWhen: 'Use this when one reinforcement bar length is not enough and bars need to be joined by lapping.',
    useWhenHi: 'जब एक bar की length कम हो और दो bars को overlap करके join करना हो, तब lap length tool use करें।',
    output: 'Required lap length in mm/m, practical site guidance and reinforcement joining summary.',
    outputHi: 'Required lap length mm/m में, site guidance और reinforcement joining summary मिलेगी।',
  },
  {
    title: 'Development Length Calculator',
    titleHi: 'डेवलपमेंट लेंथ कैलकुलेटर',
    href: '/dashboard/calculators/development-length',
    icon: ShieldCheck,
    badge: 'Live',
    desc: 'Calculate development length required to safely anchor reinforcement bars in concrete.',
    descHi: 'Concrete में reinforcement bar को safely anchor करने के लिए required development length निकालने के लिए।',
    points: ['Ld calculation', 'Bond safety', 'Anchorage length'],
    useWhen: 'Use this when reinforcement needs proper anchorage inside beam, column, slab, footing or support zone.',
    useWhenHi: 'जब reinforcement को beam, column, slab, footing या support zone में proper anchorage देना हो, तब use करें।',
    output: 'Development length, bar anchorage requirement and design safety guidance.',
    outputHi: 'Development length, bar anchorage requirement और design safety guidance मिलेगी।',
  },
]

const comingSoonTools = [
  {
    title: 'Hook Length Calculator',
    titleHi: 'हुक लेंथ कैलकुलेटर',
    icon: Wrench,
    desc: 'Calculate hook length for reinforcement bars based on bar diameter and bend requirement.',
    descHi: 'Bar diameter और bend requirement के हिसाब से hook length निकालने के लिए।',
  },
  {
    title: 'Bend Deduction Calculator',
    titleHi: 'बेंड डिडक्शन कैलकुलेटर',
    icon: Calculator,
    desc: 'Calculate bend deduction for reinforcement bars during cutting length calculation.',
    descHi: 'Reinforcement cutting length में bend deduction निकालने के लिए।',
  },
  {
    title: 'Cutting Length Calculator',
    titleHi: 'कटिंग लेंथ कैलकुलेटर',
    icon: Ruler,
    desc: 'Calculate cutting length of straight, bent-up and crank reinforcement bars.',
    descHi: 'Straight, bent-up और crank bars की cutting length निकालने के लिए।',
  },
  {
    title: 'Crank Bar Calculator',
    titleHi: 'क्रैंक बार कैलकुलेटर',
    icon: Wrench,
    desc: 'Calculate crank length, extra length and reinforcement requirement for slab bars.',
    descHi: 'Slab bars की crank length, extra length और reinforcement requirement निकालने के लिए।',
  },
  {
    title: 'Stirrup Length Calculator',
    titleHi: 'स्टिरप लेंथ कैलकुलेटर',
    icon: ShieldCheck,
    desc: 'Calculate stirrup cutting length with hooks, bends and clear cover.',
    descHi: 'Hooks, bends और clear cover के साथ stirrup cutting length निकालने के लिए।',
  },
  {
    title: 'Steel Cost Summary',
    titleHi: 'स्टील कॉस्ट समरी',
    icon: Weight,
    desc: 'Prepare steel quantity and cost summary for different bar diameters.',
    descHi: 'Different bar diameters के लिए steel quantity और cost summary बनाने के लिए।',
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

export default function SteelToolsPage() {
  return (
    <main className="min-h-screen bg-[#050B1F] px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="relative overflow-hidden rounded-[2rem] border border-orange-500/20 bg-gradient-to-br from-slate-950 via-slate-900 to-[#07112c] p-6 shadow-2xl shadow-black/30 sm:p-8 lg:p-10">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-orange-500/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative z-10 max-w-4xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-sm font-semibold text-orange-300">
              <Sparkles size={16} />
              Steel Calculation Tools / स्टील कैलकुलेशन टूल्स
            </div>

            <h1 className="mb-4 text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
              Steel Calculation Tools
            </h1>

            <p className="max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
              Calculate steel weight, lap length and development length with
              practical site-focused outputs and cost estimation.
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
              Steel bar weight, lap length और development length को आसानी से
              calculate करें और site work के लिए practical output पाएं।
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-2xl font-black text-orange-400">
                  3
                </p>
                <p className="text-sm text-slate-400">
                  Live steel tools
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Weight, Lap Length, Development Length
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-2xl font-black text-orange-400">
                  Site
                </p>
                <p className="text-sm text-slate-400">
                  Practical field use
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  साइट पर useful calculation
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-2xl font-black text-orange-400">
                  Cost
                </p>
                <p className="text-sm text-slate-400">
                  Steel rate calculation
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Quantity + Rate + Amount
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-5">
            <h2 className="text-2xl font-black text-white">
              Available Steel Tools
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Steel weight, lap length and development length tools grouped in one section.
            </p>
            <p className="mt-1 text-sm text-slate-400">
              Steel weight, lap length और development length tools एक ही जगह।
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
              Which Steel Tool Should You Use?
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              कौन सा steel tool कब use करना है, यह guide user को सही calculator select करने में help करेगी।
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
              Upcoming Steel Tools
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              These tools can be added slowly. BBS will remain a separate category.
            </p>
            <p className="mt-1 text-sm text-slate-400">
              ये tools धीरे-धीरे add कर सकते हैं। BBS को separate category में ही रखेंगे।
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
            Recommended Steel Calculation Workflow
          </h2>

          <p className="max-w-4xl text-sm leading-7 text-slate-300 sm:text-base">
            First select the steel calculation type, enter bar diameter, length,
            quantity or design requirement, then check the final steel quantity,
            lap length or development length. BBS will remain separate for detailed
            bar bending schedules.
          </p>

          <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-300 sm:text-base">
            सबसे पहले steel calculation type select करें, फिर bar diameter, length,
            quantity या design requirement भरें। उसके बाद final steel quantity,
            lap length या development length check करें। Detailed bar bending schedule
            के लिए BBS को separate ही रखा जाएगा।
          </p>
        </section>
      </div>
    </main>
  )
}
