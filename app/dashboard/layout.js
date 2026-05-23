'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Building2,
  LayoutDashboard,
  Calculator,
  Bot,
  BookOpen,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  X,
  Ruler,
  Boxes,
  HardHat,
  ChevronRight,
  Shield,
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
    label: 'Calculators',
    items: [
      { href: '/dashboard/calculators/beam', label: 'RCC Beam Design', icon: Ruler },
      { href: '/dashboard/calculators/column', label: 'Column Design', icon: Building2 },
      { href: '/dashboard/calculators/slab', label: 'One-Way Slab', icon: HardHat },
      { href: '/dashboard/calculators/concrete-volume', label: 'Concrete Volume', icon: Boxes },
      { href: '/dashboard/calculators/steel-weight', label: 'Steel Weight', icon: Ruler },
    ],
  },
  {
    label: 'Intelligence',
    items: [
      { href: '/dashboard/ai-assistant', label: 'AI Assistant', icon: Bot, badge: 'Claude' },
      { href: '/dashboard/is-codes', label: 'IS Code Library', icon: BookOpen },
    ],
  },
  {
    label: 'Account',
    items: [
      { href: '/pricing', label: 'Plans & Billing', icon: CreditCard },
      { href: '/dashboard/settings', label: 'Settings', icon: Settings },
    ],
  },
]

const adminItem = { href: '/dashboard/admin', label: 'Admin Panel', icon: Shield, badge: 'ADMIN' }

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
          <div className="h-9 w-9 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/20">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="text-base font-bold text-white leading-none">CivilCalc Pro</div>
            <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">Engineering Workspace</div>
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
                    href={item.soon ? '#' : item.href}
                    onClick={(e) => {
                      if (item.soon) e.preventDefault()
                      setMobileOpen(false)
                    }}
                    className={`group flex items-center justify-between px-3 py-2 rounded-lg text-sm transition ${
                      active
                        ? 'bg-orange-500/10 text-orange-300 border border-orange-500/20'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50 border border-transparent'
                    } ${item.soon ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <span className="flex items-center">
                      <Icon className={`h-4 w-4 mr-3 ${active ? 'text-orange-400' : ''}`} />
                      {item.label}
                    </span>
                    {item.badge && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-orange-500/15 text-orange-300">
                        {item.badge}
                      </span>
                    )}
                    {item.soon && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-500">
                        SOON
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}

        {/* Admin section — only visible to admin role */}
        {user?.role === 'admin' && (
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-red-400 px-3 mb-2">
              Admin
            </div>
            <div className="space-y-1">
              <Link
                href={adminItem.href}
                onClick={() => setMobileOpen(false)}
                className={`group flex items-center justify-between px-3 py-2 rounded-lg text-sm transition ${
                  pathname === adminItem.href
                    ? 'bg-red-500/10 text-red-300 border border-red-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50 border border-transparent'
                }`}
              >
                <span className="flex items-center">
                  <adminItem.icon className="h-4 w-4 mr-3" />
                  {adminItem.label}
                </span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-red-500/15 text-red-300">
                  {adminItem.badge}
                </span>
              </Link>
            </div>
          </div>
        )}
      </nav>

      <div className="p-3 border-t border-slate-800">
        <div className="flex items-center justify-between px-2 py-2 rounded-lg bg-slate-900/50">
          <div className="flex items-center min-w-0">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center text-sm font-bold flex-shrink-0">
              {(user.name || user.email).slice(0, 1).toUpperCase()}
            </div>
            <div className="ml-2 min-w-0">
              <div className="text-sm font-medium text-white truncate">{user.name}</div>
              <div className="text-[11px] text-slate-500 truncate uppercase tracking-wide">{user.plan} plan</div>
            </div>
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="text-slate-400 hover:text-white h-8 w-8"
            onClick={logout}
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </aside>
  )

  return (
    <div className="min-h-screen flex bg-slate-950 text-white">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex w-72 flex-shrink-0">{Sidebar}</div>

      {/* Mobile sidebar */}
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
              transition={{ type: 'spring', damping: 25 }}
              className="fixed inset-y-0 left-0 w-72 z-50 lg:hidden"
            >
              {Sidebar}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <header className="lg:hidden flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-30">
          <button onClick={() => setMobileOpen(true)} className="text-white">
            <Menu className="h-6 w-6" />
          </button>
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <Building2 className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold">CivilCalc Pro</span>
          </Link>
          <div className="w-6" />
        </header>

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
