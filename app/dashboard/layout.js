'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Building2,
  LayoutDashboard,
  Bot,
  BookOpen,
  Settings,
  LogOut,
  Menu,
  Ruler,
  Boxes,
  HardHat,
  Shield,
  Grid3x3,
  Anchor,
  Layers,
  Shovel,
  Paintbrush,
  IndianRupee,
  ArrowLeftRight,
  Linkedin,
  Activity,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth-context'

const navGroups = [
  {
    label: 'Overview',
    items: [
      { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ],
  },
  {
    label: 'Structural Design',
    items: [
      { href: '/dashboard/calculators/beam', label: 'RCC Beam', icon: Ruler },
      { href: '/dashboard/calculators/column', label: 'Column', icon: Building2 },
      { href: '/dashboard/calculators/slab', label: 'One-Way Slab', icon: HardHat },
      { href: '/dashboard/calculators/two-way-slab', label: 'Two-Way Slab', icon: Grid3x3 },
      { href: '/dashboard/calculators/footing', label: 'Footing', icon: Anchor },
      {
        href: '/dashboard/calculators/structural-analysis',
        label: 'Structural Analysis',
        icon: Activity,
      },
    ],
  },
  {
    label: 'Estimation',
    items: [
      { href: '/dashboard/calculators/concrete-volume', label: 'Concrete & Mix', icon: Boxes },
      { href: '/dashboard/calculators/steel-weight', label: 'Steel Weight', icon: Ruler },
      { href: '/dashboard/calculators/brickwork', label: 'Brickwork', icon: Layers },
      { href: '/dashboard/calculators/plaster', label: 'Plaster Work', icon: Paintbrush },
      { href: '/dashboard/calculators/excavation', label: 'Excavation', icon: Shovel },
      { href: '/dashboard/calculators/tile', label: 'Tile Calculator', icon: Grid3x3 },
      { href: '/dashboard/calculators/rate-analysis', label: 'Rate Analysis', icon: IndianRupee },
    ],
  },
  {
    label: 'Tools & Intelligence',
    items: [
      { href: '/dashboard/calculators/unit-converter', label: 'Unit Converter', icon: ArrowLeftRight },
      { href: '/dashboard/ai-assistant', label: 'AI Assistant', icon: Bot },
      { href: '/dashboard/is-codes', label: 'IS Code Library', icon: BookOpen },
    ],
  },
  {
    label: 'Account',
    items: [
      { href: '/dashboard/settings', label: 'Settings', icon: Settings },
    ],
  },
]

const LINKEDIN_URL =  'https://www.linkedin.com/in/civilcalc-pro-6ba230411/'

export default function DashboardLayout({ children }) {
  const { user, loading, logout } = useAuth()

  const router = useRouter()
  const pathname = usePathname()

  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login')
    }
  }, [user, loading, router])

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="h-10 w-10 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const Sidebar = (
    <aside className="flex flex-col h-full bg-slate-950/80 backdrop-blur-xl border-r border-slate-800">
      <div className="p-5 border-b border-slate-800">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <div className="h-9 w-9 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
            <Building2 className="h-5 w-5 text-white" />
          </div>

          <div>
            <div className="text-base font-bold text-white">
              CivilCalc Pro
            </div>

            <div className="text-[10px] text-slate-500 uppercase tracking-wider">
              Engineering Workspace
            </div>
          </div>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {navGroups.map((group) => (
          <div key={group.label}>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 px-3 mb-2">
              {group.label}
            </div>

            <div className="space-y-1">
              {group.items.map((item) => {
                const active = pathname === item.href
                const Icon = item.icon

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center px-3 py-2 rounded-lg text-sm transition ${
                      active
                        ? 'bg-orange-500/10 text-orange-300 border border-orange-500/20'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-3" />
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}

        {user?.email === 'admin@civilcalc.in' && (
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-red-400 px-3 mb-2">
              Admin
            </div>

            <Link
              href="/dashboard/admin"
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition ${
                pathname === '/dashboard/admin'
                  ? 'bg-red-500/10 text-red-300 border border-red-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <span className="flex items-center">
                <Shield className="h-4 w-4 mr-3" />
                Admin Panel
              </span>

              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-red-500/15 text-red-300">
                ADMIN
              </span>
            </Link>
          </div>
        )}
      </nav>

      <div className="p-3 border-t border-slate-800 space-y-2">
     <a
  href={LINKEDIN_URL}
  target="_blank"
  rel="noopener noreferrer"
  className="flex items-center justify-center gap-2 w-full border border-slate-700 rounded-lg py-3 text-slate-300 hover:text-[#70b5f9] hover:border-[#70b5f9] transition"
>
  <Linkedin className="h-4 w-4" />
  Follow on LinkedIn
</a>
        <div className="flex items-center justify-between px-2 py-2 rounded-lg bg-slate-900/50">
          <div className="flex items-center">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center text-sm font-bold">
              {(user.email || 'A').slice(0, 1).toUpperCase()}
            </div>

            <div className="ml-2">
              <div className="text-sm font-medium text-white">
                {user.email}
              </div>
            </div>
          </div>

          <Button
            size="icon"
            variant="ghost"
            className="text-slate-400 hover:text-white h-8 w-8"
            onClick={logout}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </aside>
  )

  return (
    <div className="min-h-screen flex bg-slate-950 text-white">
      <div className="hidden lg:flex w-72 flex-shrink-0">
        {Sidebar}
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            />

            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="fixed inset-y-0 left-0 w-72 z-50 lg:hidden"
            >
              {Sidebar}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950">
          <button onClick={() => setMobileOpen(true)}>
            <Menu className="h-6 w-6 text-white" />
          </button>

          <span className="font-bold text-white">
            CivilCalc Pro
          </span>

          <div className="w-6" />
        </header>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
