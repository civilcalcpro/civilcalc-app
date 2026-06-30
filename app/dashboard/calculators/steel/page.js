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
  Weight,
} from 'lucide-react'

const liveTools = [
  {
    title: 'Steel Weight Calculator',
    titleHi: 'स्टील वेट कैलकुलेटर',
    href: '/dashboard/calculators/steel-weight',
    icon: Weight,
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
  {
    title: 'Hook Length Calculator',
    titleHi: 'हुक लेंथ कैलकुलेटर',
    href: '/dashboard/calculators/hook-length',
    icon: Wrench,
    badge: 'Live',
    desc: 'Calculate reinforcement hook length for standard hook, bend anchorage, stirrup hook and custom hook.',
    descHi: 'Standard hook, bend anchorage, stirrup hook और custom hook की hook length निकालने के लिए।',
    points: ['Hook length', 'Bend anchorage', 'Dynamic diagram'],
    useWhen: 'Use this when you need hook length for main bars, stirrups, ties, anchorage or BBS cutting length.',
    useWhenHi: 'जब main bar, stirrup, tie, anchorage या BBS cutting length में hook length चाहिए, तब use करें।',
    output: 'Hook length per hook, total hook length, steel weight, cost, formula and hook diagram.',
    outputHi: 'Hook length per hook, total hook length, steel weight, cost, formula और hook diagram मिलेगा।',
  },
  {
    title: 'Stirrup Length Calculator',
    titleHi: 'स्टिरप लेंथ कैलकुलेटर',
    href: '/dashboard/calculators/stirrup-length',
    icon: ShieldCheck,
    badge: 'Live',
    desc: 'Calculate rectangular, square, circular, diamond and custom stirrup cutting length.',
    descHi: 'Rectangular, square, circular, diamond और custom stirrup की cutting length निकालने के लिए।',
    points: ['Stirrup cutting length', 'Hook length', 'Bend deduction'],
    useWhen: 'Use this for beam stirrups, column ties, footing ties and seismic reinforcement detailing.',
    useWhenHi: 'Beam stirrup, column tie, footing tie और seismic reinforcement detailing में use करें।',
    output: 'Cutting length of one stirrup, total cutting length, hook length, bend deduction, steel weight and diagram.',
    outputHi: 'एक stirrup की cutting length, total cutting length, hook length, bend deduction, steel weight और diagram मिलेगा।',
  },
  {
    title: 'Bend Deduction Calculator',
    titleHi: 'बेंड डिडक्शन कैलकुलेटर',
    href: '/dashboard/calculators/bend-deduction',
    icon: Calculator,
    badge: 'Live',
    desc: 'Calculate bend deduction for 45°, 90°, 135°, 180° and custom reinforcement bends.',
    descHi: '45°, 90°, 135°, 180° और custom reinforcement bends की bend deduction निकालने के लिए।',
    points: ['45° to 180° bends', 'Total deduction', 'Bend diagram'],
    useWhen: 'Use this when calculating BBS cutting length where bend deduction needs to be subtracted.',
    useWhenHi: 'जब BBS cutting length में bend deduction minus करनी हो, तब इस tool का use करें।',
    output: 'Deduction per bend, total bend deduction, formula, step-by-step solution and bend diagram.',
    outputHi: 'Deduction per bend, total bend deduction, formula, step-by-step solution और bend diagram मिलेगा।',
  },
  {
    title: 'Cutting Length Calculator',
    titleHi: 'कटिंग लेंथ कैलकुलेटर',
    href: '/dashboard/calculators/cutting-length',
    icon: Ruler,
    badge: 'Live',
    desc: 'Calculate cutting length of straight bars, hook bars, L bars, U bars, lap bars and development bars.',
    descHi: 'Straight bars, hook bars, L bars, U bars, lap bars और development bars की cutting length निकालने के लिए।',
    points: ['Bar cutting length', 'Hook/lap/Ld addition', 'Bend deduction'],
    useWhen: 'Use this for general reinforcement cutting length calculation before preparing or checking BBS.',
    useWhenHi: 'BBS बनाने या check करने से पहले general reinforcement cutting length निकालने के लिए use करें।',
    output: 'Cutting length per bar, total length, hook/lap/development addition, bend deduction, steel weight and cost.',
    outputHi: 'Cutting length per bar, total length, hook/lap/development addition, bend deduction, steel weight और cost मिलेगा।',
  },
  {
    title: 'Crank Bar Calculator',
    titleHi: 'क्रैंक बार कैलकुलेटर',
    href: '/dashboard/calculators/crank-bar',
    icon: Wrench,
    badge: 'Live',
    desc: 'Calculate bent-up/crank bar cutting length with crank height, angle and extra length.',
    descHi: 'Crank height, angle और extra length के साथ bent-up/crank bar cutting length निकालने के लिए।',
    points: ['Crank extra length', 'Bent-up bar length', 'Crank diagram'],
    useWhen: 'Use this for slab bent-up bars, crank bars, negative reinforcement and BBS cutting length.',
    useWhenHi: 'Slab bent-up bars, crank bars, negative reinforcement और BBS cutting length में use करें।',
    output: 'Crank extra length, inclined length, cutting length, bend deduction, steel weight, cost and crank diagram.',
    outputHi: 'Crank extra length, inclined length, cutting length, bend deduction, steel weight, cost और crank diagram मिलेगा।',
  },
  {
    title: 'Steel Cost Summary',
    titleHi: 'स्टील कॉस्ट समरी',
    href: '/dashboard/calculators/steel-cost-summary',
    icon: Weight,
    badge: 'Live',
    desc: 'Prepare complete steel quantity and cost summary with wastage, binding wire, transport, bending charges and GST.',
    descHi: 'Wastage, binding wire, transport, bending charges और GST के साथ complete steel quantity और cost summary बनाने के लिए।',
    points: ['Diameter-wise summary', 'Steel cost', 'GST & wastage'],
    useWhen: 'Use this when you want final steel purchase, billing, quotation or project cost summary.',
    useWhenHi: 'जब final steel purchase, billing, quotation या project cost summary बनानी हो, तब use करें।',
    output: 'Raw steel weight, gross weight, diameter-wise summary, item-wise cost, wastage, GST and grand total.',
    outputHi: 'Raw steel weight, gross weight, diameter-wise summary, item-wise cost, wastage, GST और grand total मिलेगा।',
  },
]

const comingSoonTools = [ ] 

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

{comingSoonTools.length > 0 && (
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
)}

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
            Calculate steel weight, lap length, development length, hook length,
stirrup length, bend deduction, cutting length, crank bar length and
complete steel cost summary with practical site-focused outputs.
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
            Steel bar weight, lap length, development length, hook length, stirrup
length, bend deduction, cutting length, crank bar और steel cost summary
को आसानी से calculate करें और site work के लिए practical output पाएं।
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
               <p className="text-2xl font-black text-orange-400">
  9
</p>
                <p className="text-sm text-slate-400">
                  Live steel tools
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Weight, Lap, Ld, Hook, Stirrup, Bend, Cutting, Crank, Cost
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
             All steel calculation tools grouped in one professional section.
            </p>
            <p className="mt-1 text-sm text-slate-400">
             Steel weight, lap length, development length, hook, stirrup, bend deduction, cutting length, crank bar और steel cost summary tools एक ही जगह।
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
    Start with steel weight for basic quantity, use lap length and development
length for anchorage and joining, use hook length, stirrup length, bend
deduction, cutting length and crank bar calculators for BBS checking, then
prepare final steel cost summary for purchase, billing and quotation.
          </p>

          <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-300 sm:text-base">
            सबसे पहले basic quantity के लिए steel weight calculator use करें। Anchorage
और joining के लिए lap length और development length use करें। BBS checking
के लिए hook length, stirrup length, bend deduction, cutting length और crank
bar tools use करें। Finally purchase, billing और quotation के लिए steel cost
summary तैयार करें।
          </p>
        </section>
      </div>
    </main>
  )
}
