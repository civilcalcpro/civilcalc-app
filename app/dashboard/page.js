'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Calculator,
  FileText,
  Bot,
  Ruler,
  Boxes,
  HardHat,
  Building2,
  Sparkles,
  TrendingUp,
  ArrowUpRight,
  Clock,
  Activity,
  Grid3x3,
  Anchor,
  Layers,
  Shovel,
  Paintbrush,
  IndianRupee,
  ArrowLeftRight,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth-context'
import GlobalSettingsPanel from '@/components/settings/GlobalSettingsPanel'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'

const quickTools = [
  {
    name: 'RCC Beam Design',
    icon: Ruler,
    href: '/dashboard/calculators/beam',
    color: 'orange',
    desc: 'Singly/doubly reinforced beam per IS 456',
  },
  {
    name: 'Column Design',
    icon: Building2,
    href: '/dashboard/calculators/column',
    color: 'blue',
    desc: 'Axially loaded RCC column',
  },
  {
    name: 'One-Way Slab',
    icon: HardHat,
    href: '/dashboard/calculators/slab',
    color: 'yellow',
    desc: 'Simply-supported one-way slab',
  },
  {
    name: 'Two-Way Slab',
    icon: Grid3x3,
    href: '/dashboard/calculators/two-way-slab',
    color: 'red',
    desc: 'Simply-supported two-way slab Table 27',
  },
  {
    name: 'Footing Design',
    icon: Anchor,
    href: '/dashboard/calculators/footing',
    color: 'purple',
    desc: 'Isolated square footing',
  },
  {
    name: 'Concrete & Mix',
    icon: Boxes,
    href: '/dashboard/calculators/concrete-volume',
    color: 'green',
    desc: 'Nominal mix C : S : A per grade',
  },
  {
    name: 'Steel Weight',
    icon: Ruler,
    href: '/dashboard/calculators/steel-weight',
    color: 'orange',
    desc: 'D²/162 bar weight calculator',
  },
  {
    name: 'Brickwork',
    icon: Layers,
    href: '/dashboard/calculators/brickwork',
    color: 'red',
    desc: 'Brick count + mortar take-off',
  },
  {
    name: 'Plaster Work',
    icon: Paintbrush,
    href: '/dashboard/calculators/plaster',
    color: 'yellow',
    desc: 'Cement & sand for plaster',
  },
  {
    name: 'Tile Calculator',
    icon: Grid3x3,
    href: '/dashboard/calculators/tile',
    color: 'orange',
    desc: 'Tile calculation and cost estimation',
  },
  {
    name: 'Paint Calculator',
    icon: Paintbrush,
    href: '/dashboard/calculators/paint',
    color: 'yellow',
    desc: 'Paintwork calculation and cost estimation',
  },
  {
    name: 'Excavation',
    icon: Shovel,
    href: '/dashboard/calculators/excavation',
    color: 'blue',
    desc: 'Earthwork volume & truck loads',
  },
  {
    name: 'Rate Analysis',
    icon: IndianRupee,
    href: '/dashboard/calculators/rate-analysis',
    color: 'green',
    desc: 'Project cost estimation',
  },
  {
    name: 'Unit Converter',
    icon: ArrowLeftRight,
    href: '/dashboard/calculators/unit-converter',
    color: 'purple',
    desc: 'Length, force, pressure & more',
  },
  {
    name: 'AI Engineering Assistant',
    icon: Bot,
    href: '/dashboard/ai-assistant',
    color: 'purple',
    desc: 'HEllo engineers ',
  },
  {
  name:'BBS Genarator',
  icon: Ruler,
  href: '/dashboard/calculators/bbs-generator',
  color:'yellow',
  desc:'Smart BBS Calculator with detailed tables',
  },
  {
    name: 'BOQ Generator',
    icon: FileText,
    href: '/dashboard/calculators/boq-generator',
    color: 'green',
    desc: 'Professional Bill of Quantities',
  },
  {
    name: 'House Construction Cost',
    icon: Building2,
    href: '/dashboard/calculators/home-construction',
    color: 'orange',
    desc: 'Complete house construction cost estimation',
  },
  {
    name: 'IS Code Library',
    icon: FileText,
    href: '/dashboard/is-codes',
    color: 'red',
    desc: 'IS 456 / 875 / 1893 / 13920 references',
  },
]

const colorStyles = {
  orange: {
    glow: 'bg-orange-500/10',
    box: 'bg-orange-500/10 border-orange-500/20',
    icon: 'text-orange-400',
  },
  blue: {
    glow: 'bg-blue-500/10',
    box: 'bg-blue-500/10 border-blue-500/20',
    icon: 'text-blue-400',
  },
  yellow: {
    glow: 'bg-yellow-500/10',
    box: 'bg-yellow-500/10 border-yellow-500/20',
    icon: 'text-yellow-400',
  },
  red: {
    glow: 'bg-red-500/10',
    box: 'bg-red-500/10 border-red-500/20',
    icon: 'text-red-400',
  },
  purple: {
    glow: 'bg-purple-500/10',
    box: 'bg-purple-500/10 border-purple-500/20',
    icon: 'text-purple-400',
  },
  green: {
    glow: 'bg-green-500/10',
    box: 'bg-green-500/10 border-green-500/20',
    icon: 'text-green-400',
  },
}

const calculationMeta = {
  'beam-design': {
    label: 'RCC Beam Design',
    category: 'design',
  },
  'column-design': {
    label: 'Column Design',
    category: 'design',
  },
  'one-way-slab': {
    label: 'One-Way Slab',
    category: 'design',
  },
  slab: {
    label: 'One-Way Slab',
    category: 'design',
  },
  'two-way-slab': {
    label: 'Two-Way Slab',
    category: 'design',
  },
  footing: {
    label: 'Footing Design',
    category: 'design',
  },
  'concrete-volume': {
    label: 'Concrete Volume',
    category: 'calculation',
  },
  'steel-weight': {
    label: 'Steel Weight',
    category: 'calculation',
  },
  brickwork: {
    label: 'Brickwork Calculator',
    category: 'calculation',
  },
  'plaster-work': {
    label: 'Plaster Calculator',
    category: 'calculation',
  },
  plaster: {
    label: 'Plaster Calculator',
    category: 'calculation',
  },
  excavation: {
    label: 'Excavation Calculator',
    category: 'calculation',
  },
  'tile-calculator': {
    label: 'Tile Calculator',
    category: 'calculation',
  },
  'paint-calculator': {
    label: 'Paint Calculator',
    category: 'calculation',
  },
  'home-construction': {
    label: 'Home Construction Cost',
    category: 'estimate',
  },
  'rate-analysis': {
    label: 'Rate Analysis',
    category: 'estimate',
  },
}

function formatCalculationName(type) {
  if (!type) return 'Calculation'

  if (calculationMeta[type]?.label) {
    return calculationMeta[type].label
  }

  return type
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

function getCalculationStatus(calculation) {
  const type = calculation?.type
  const meta = calculationMeta[type]
  const results = calculation?.results || {}

  if (meta?.category === 'estimate') {
    return {
      label: 'Estimated',
      className: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    }
  }

  if (meta?.category === 'calculation') {
    return {
      label: 'Completed',
      className: 'text-green-400 bg-green-500/10 border-green-500/20',
    }
  }

  if (results?.isDesignSafe === false) {
    return {
      label: 'Review',
      className: 'text-red-400 bg-red-500/10 border-red-500/20',
    }
  }

  if (results?.isDesignSafe === true) {
    return {
      label: 'Safe',
      className: 'text-green-400 bg-green-500/10 border-green-500/20',
    }
  }

  return {
    label: 'Completed',
    className: 'text-green-400 bg-green-500/10 border-green-500/20',
  }
}

export default function DashboardPage() {
  const { user, authFetch } = useAuth()
  const [stats, setStats] = useState({
    projectCount: 0,
    calculationCount: 0,
    recentProjects: [],
  })
  const [calcs, setCalcs] = useState([])

  useEffect(() => {
    ;(async () => {
      try {
        const [s, c] = await Promise.all([
          authFetch('/api/dashboard/stats'),
          authFetch('/api/calculations'),
        ])

        if (s.ok) {
          setStats(await s.json())
        }

        if (c.ok) {
          const data = await c.json()
          setCalcs(data.calculations || [])
        }
      } catch (error) {
        console.error('Dashboard load error:', error)
      }
    })()
  }, [authFetch])

  const chartData = (() => {
    const days = 14
    const today = new Date()

    const buckets = Array.from({ length: days }, (_, i) => {
      const d = new Date(today)
      d.setDate(d.getDate() - (days - 1 - i))
      d.setHours(0, 0, 0, 0)

      return {
        date: d,
        label: d.toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
        }),
        count: 0,
      }
    })

    calcs.forEach((c) => {
      const t = new Date(c.createdAt).getTime()

      const bucket = buckets.find((b) => {
        const start = b.date.getTime()
        return t >= start && t < start + 24 * 60 * 60 * 1000
      })

      if (bucket) {
        bucket.count += 1
      }
    })

    return buckets.map(({ label, count }) => ({
      label,
      count,
    }))
  })()

  const statCards = [
    {
      label: 'Calculations',
      value: stats.calculationCount || calcs.length || 0,
      icon: Calculator,
      color: 'orange',
    },
    {
      label: 'Projects',
      value: stats.projectCount || 0,
      icon: FileText,
      color: 'blue',
    },
    {
      label: 'AI Sessions',
      value: 0,
      icon: Bot,
      color: 'purple',
    },
    {
      label: 'Tools',
      value: `${quickTools.length}+`,
      icon: Sparkles,
      color: 'green',
    },
  ]

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-orange-400 font-semibold mb-1">
              Engineering Workspace
            </div>

            <h1 className="text-3xl lg:text-4xl font-bold text-white">
              Welcome back, {user?.name?.split(' ')[0] || 'Engineer'}
            </h1>

            <p className="text-slate-400 mt-1">
              Design safer, faster. Run calculations or ask the AI assistant.
            </p>
          </div>

          <Link href="/dashboard/calculators/beam">
            <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
              <Calculator className="h-4 w-4 mr-2" />
              New Calculation
            </Button>
          </Link>
        </div>
      </motion.div>

      <GlobalSettingsPanel />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s, i) => {
          const StatIcon = s.icon
          const style = colorStyles[s.color] || colorStyles.orange

          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="bg-slate-900/50 border-slate-800 p-5 relative overflow-hidden">
                <div
                  className={`absolute -right-4 -top-4 h-20 w-20 rounded-full ${style.glow} blur-2xl`}
                />

                <div className="flex items-start justify-between relative">
                  <div>
                    <div className="text-xs uppercase tracking-wider text-slate-500 mb-2">
                      {s.label}
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {s.value}
                    </div>
                  </div>

                  <div className={`p-2 rounded-lg border ${style.box}`}>
                    <StatIcon className={`h-4 w-4 ${style.icon}`} />
                  </div>
                </div>
              </Card>
            </motion.div>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-slate-900/50 border-slate-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center text-sm text-slate-400">
                <Activity className="h-4 w-4 mr-2" />
                Activity — Last 14 days
              </div>

              <div className="text-2xl font-bold text-white mt-1">
                {calcs.length} calculations
              </div>
            </div>

            <div className="text-sm text-green-400 flex items-center">
              <TrendingUp className="h-4 w-4 mr-1" />
              Live
            </div>
          </div>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="orangeGrad"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#f97316" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis
                  dataKey="label"
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    background: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: 8,
                    color: '#fff',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#f97316"
                  strokeWidth={2}
                  fill="url(#orangeGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center text-sm text-slate-400">
              <Clock className="h-4 w-4 mr-2" />
              Recent
            </div>
          </div>

          <div className="space-y-3">
            {calcs.slice(0, 5).map((c, index) => {
              const status = getCalculationStatus(c)

              return (
                <div
                  key={c.calculationId || c._id || index}
                  className="flex items-center justify-between gap-3 py-3 border-b border-slate-800/80 last:border-0"
                >
                  <div className="min-w-0">
                    <div className="text-sm text-white font-medium truncate">
                      {formatCalculationName(c.type)}
                    </div>

                    <div className="text-xs text-slate-500 mt-0.5">
                      {new Date(c.createdAt).toLocaleString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>

                  <div
                    className={`shrink-0 text-[11px] px-2.5 py-1 rounded-full border font-semibold ${status.className}`}
                  >
                    {status.label}
                  </div>
                </div>
              )
            })}

            {calcs.length === 0 && (
              <div className="text-sm text-slate-500 py-8 text-center">
                No calculations yet.
                <br />

                <Link
                  href="/dashboard/calculators/beam"
                  className="text-orange-400 hover:underline"
                >
                  Start your first design →
                </Link>
              </div>
            )}
          </div>
        </Card>
      </div>

      <div>
        <h2 className="text-xl font-bold text-white mb-4">Quick Tools</h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickTools.map((t, i) => {
            const Icon = t.icon
            const style = colorStyles[t.color] || colorStyles.orange

            const content = (
              <Card
                className={`group bg-slate-900/50 border-slate-800 p-5 transition-all ${
                  t.soon
                    ? 'opacity-60'
                    : 'hover:border-orange-500/40 hover:bg-slate-900/80 cursor-pointer'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2.5 rounded-lg border ${style.box}`}>
                    <Icon className={`h-5 w-5 ${style.icon}`} />
                  </div>

                  {!t.soon && (
                    <ArrowUpRight className="h-4 w-4 text-slate-600 group-hover:text-orange-400 transition" />
                  )}
                </div>

                <div className="text-sm font-semibold text-white">
                  {t.name}
                </div>

                <div className="text-xs text-slate-500 mt-1">{t.desc}</div>
              </Card>
            )

            return t.soon ? (
              <div key={i}>{content}</div>
            ) : (
              <Link key={i} href={t.href}>
                {content}
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
