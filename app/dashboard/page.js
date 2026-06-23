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
  { name: 'RCC Beam Design', icon: Ruler, href: '/dashboard/calculators/beam', color: 'orange', desc: 'Singly/doubly reinforced beam per IS 456' },
  { name: 'Column Design', icon: Building2, href: '/dashboard/calculators/column', color: 'blue', desc: 'Axially loaded RCC column' },
  { name: 'One-Way Slab', icon: HardHat, href: '/dashboard/calculators/slab', color: 'yellow', desc: 'Simply-supported one-way slab' },
  { name: 'Two-Way Slab', icon: Grid3x3, href: '/dashboard/calculators/two-way-slab', color: 'red', desc: 'Simply-supported two-way slab (Table 27)' },
  { name: 'Footing Design', icon: Anchor, href: '/dashboard/calculators/footing', color: 'purple', desc: 'Isolated square footing' },
  { name: 'Concrete & Mix', icon: Boxes, href: '/dashboard/calculators/concrete-volume', color: 'green', desc: 'Nominal mix C : S : A per grade' },
  { name: 'Steel Weight', icon: Ruler, href: '/dashboard/calculators/steel-weight', color: 'orange', desc: 'D²/162 bar weight calculator' },
  { name: 'Brickwork', icon: Layers, href: '/dashboard/calculators/brickwork', color: 'red', desc: 'Brick count + mortar take-off' },
  { name: 'Plaster Work', icon: Paintbrush, href: '/dashboard/calculators/plaster', color: 'yellow', desc: 'Cement & sand for plaster' },
  {name : 'Tile calculator ', icon : Grid3x3 , href: '/dashboard/calculators/tile' , color: 'orange', desc: 'tile calculation and cost estimation ' },
  {name : 'paint calculator ', icon : paintroller , href:'/dashboard/calculators/paint', color : 'yellow' ,desc : 'Paintwork calculation and cost estimation' } ,
  { name: 'Excavation', icon: Shovel, href: '/dashboard/calculators/excavation', color: 'blue', desc: 'Earthwork volume & truck loads' },
  { name: 'Rate Analysis', icon: IndianRupee, href: '/dashboard/calculators/rate-analysis', color: 'green', desc: 'Project cost estimation' },
  { name: 'Unit Converter', icon: ArrowLeftRight, href: '/dashboard/calculators/unit-converter', color: 'purple', desc: 'Length, force, pressure & more' },
  { name: 'AI Engineering Assistant', icon: Bot, href: '/dashboard/ai-assistant', color: 'purple', desc: 'Powered by Claude — ask anything' },
  {
  name: 'BOQ Generator',
  icon: FileText,
  href: '/dashboard/calculators/boq-generator',
  color: 'green',
  desc: 'Professional Bill of Quantities'
},
  {
  name: 'House Construction Cost',
  icon: Building2,
  href: '/dashboard/calculators/home-construction',
  color: 'orange',
  desc: 'Complete house construction cost estimation'
},
  { name: 'IS Code Library', icon: FileText, href: '/dashboard/is-codes', color: 'red', desc: 'IS 456 / 875 / 1893 / 13920 references' },
]

export default function DashboardPage() {
  const { user, authFetch } = useAuth()
  const [stats, setStats] = useState({ projectCount: 0, calculationCount: 0, recentProjects: [] })
  const [calcs, setCalcs] = useState([])

  useEffect(() => {
    ;(async () => {
      try {
        const [s, c] = await Promise.all([
          authFetch('/api/dashboard/stats'),
          authFetch('/api/calculations'),
        ])
        if (s.ok) setStats(await s.json())
        if (c.ok) setCalcs((await c.json()).calculations || [])
      } catch (e) {}
    })()
  }, [authFetch])

  // Build a small activity chart from recent calculations
  const chartData = (() => {
    const days = 14
    const today = new Date()
    const buckets = Array.from({ length: days }, (_, i) => {
      const d = new Date(today)
      d.setDate(d.getDate() - (days - 1 - i))
      d.setHours(0, 0, 0, 0)
      return { date: d, label: d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }), count: 0 }
    })
    calcs.forEach((c) => {
      const t = new Date(c.createdAt).getTime()
      const bucket = buckets.find((b) => {
        const start = b.date.getTime()
        return t >= start && t < start + 24 * 60 * 60 * 1000
      })
      if (bucket) bucket.count++
    })
    return buckets.map(({ label, count }) => ({ label, count }))
  })()

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-7xl">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
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
              <Calculator className="h-4 w-4 mr-2" /> New Calculation
            </Button>
          </Link>
        </div>
      </motion.div>
<GlobalSettingsPanel />
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Calculations', value: stats.calculationCount || 0, icon: Calculator, color: 'orange' },
          { label: 'Projects', value: stats.projectCount || 0, icon: FileText, color: 'blue' },
          { label: 'AI Sessions', value: 0, icon: Bot, color: 'purple' },
          { label: 'Tools', value: '14+', icon: Sparkles, color: 'green' },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="bg-slate-900/50 border-slate-800 p-5 relative overflow-hidden">
              <div className={`absolute -right-4 -top-4 h-20 w-20 rounded-full bg-${s.color}-500/10 blur-2xl`} />
              <div className="flex items-start justify-between relative">
                <div>
                  <div className="text-xs uppercase tracking-wider text-slate-500 mb-2">{s.label}</div>
                  <div className="text-2xl font-bold text-white">{s.value}</div>
                </div>
                <div className={`p-2 rounded-lg bg-${s.color}-500/10 border border-${s.color}-500/20`}>
                  <s.icon className={`h-4 w-4 text-${s.color}-400`} />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Activity chart */}
        <Card className="lg:col-span-2 bg-slate-900/50 border-slate-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center text-sm text-slate-400">
                <Activity className="h-4 w-4 mr-2" /> Activity — Last 14 days
              </div>
              <div className="text-2xl font-bold text-white mt-1">{calcs.length} calculations</div>
            </div>
            <div className="text-sm text-green-400 flex items-center">
              <TrendingUp className="h-4 w-4 mr-1" /> Live
            </div>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="orangeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f97316" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="label" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} allowDecimals={false} />
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

        {/* Recent calculations */}
        <Card className="bg-slate-900/50 border-slate-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center text-sm text-slate-400">
              <Clock className="h-4 w-4 mr-2" /> Recent
            </div>
          </div>
          <div className="space-y-3">
            {calcs.slice(0, 5).map((c) => (
              <div key={c.calculationId} className="flex items-center justify-between py-2 border-b border-slate-800/80 last:border-0">
                <div className="min-w-0">
                  <div className="text-sm text-white capitalize truncate">{c.type.replace(/-/g, ' ')}</div>
                  <div className="text-xs text-slate-500">{new Date(c.createdAt).toLocaleString('en-IN')}</div>
                </div>
                <div className={`text-xs font-medium ${c.results?.isDesignSafe === false ? 'text-red-400' : 'text-green-400'}`}>
                  {c.results?.isDesignSafe === false ? 'Review' : 'Safe'}
                </div>
              </div>
            ))}
            {calcs.length === 0 && (
              <div className="text-sm text-slate-500 py-8 text-center">
                No calculations yet.
                <br />
                <Link href="/dashboard/calculators/beam" className="text-orange-400 hover:underline">
                  Start your first design →
                </Link>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Quick tools grid */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Quick Tools</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickTools.map((t, i) => {
            const Icon = t.icon
            const content = (
              <Card
                className={`group bg-slate-900/50 border-slate-800 p-5 transition-all ${
                  t.soon ? 'opacity-60' : 'hover:border-orange-500/40 hover:bg-slate-900/80 cursor-pointer'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2.5 rounded-lg bg-${t.color}-500/10 border border-${t.color}-500/20`}>
                    <Icon className={`h-5 w-5 text-${t.color}-400`} />
                  </div>
                  {!t.soon && (
                    <ArrowUpRight className="h-4 w-4 text-slate-600 group-hover:text-orange-400 transition" />
                  )}
                </div>
                <div className="text-sm font-semibold text-white">{t.name}</div>
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
