'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Shield, Users, TrendingUp, Calculator, MessageSquare, IndianRupee, ChevronDown, Loader2,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/lib/auth-context'
import { toast } from 'sonner'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'

export default function AdminPage() {
  const { user, authFetch, loading: authLoading } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [denied, setDenied] = useState(false)

  const load = async () => {
    try {
      const [s, u] = await Promise.all([
        authFetch('/api/admin/stats'),
        authFetch('/api/admin/users'),
      ])
      if (s.status === 403 || u.status === 403) {
        setDenied(true)
        return
      }
      if (s.ok) setStats(await s.json())
      if (u.ok) setUsers((await u.json()).users || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
   load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [])

  const changePlan = async (userId, plan) => {
    try {
      const r = await authFetch(`/api/admin/users/${userId}/plan`, {
        method: 'POST',
        body: JSON.stringify({ plan }),
      })
      const data = await r.json()
      if (!r.ok) throw new Error(data.error || 'Failed')
      setUsers((us) => us.map((x) => (x.userId === userId ? { ...x, plan } : x)))
      toast.success(`Plan updated to ${plan.toUpperCase()}`)
    } catch (e) {
      toast.error(e.message)
    }
  }

  if (loading) {
    return (
      <div className="p-10 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
      </div>
    )
  }


  const filtered = users.filter((u) => {
    if (!query) return true
    const q = query.toLowerCase()
    return u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q)
  })

  const planRevenue = stats
    ? (stats.planBreakdown?.pro || 0) * 499 + (stats.planBreakdown?.enterprise || 0) * 1999
    : 0

  return (
    <div className="p-6 lg:p-10 max-w-7xl">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-8">
        <div>
          <div className="flex items-center text-xs uppercase tracking-wider text-red-400 font-semibold mb-2">
            <Shield className="h-3 w-3 mr-1.5" /> Admin Console
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-white">Admin Panel</h1>
          <p className="text-slate-400 mt-1">User management, subscription tracking & platform analytics.</p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total users" value={stats?.totalUsers || 0} icon={Users} color="orange" />
        <StatCard label="Calculations" value={stats?.totalCalculations || 0} icon={Calculator} color="blue" />
        <StatCard label="AI sessions" value={stats?.totalAISessions || 0} icon={MessageSquare} color="purple" />
        <StatCard label="MRR (mocked)" value={`₹${planRevenue.toLocaleString('en-IN')}`} icon={IndianRupee} color="green" />
      </div>

      {/* Plan breakdown */}
      {stats?.planBreakdown && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          {Object.entries(stats.planBreakdown).map(([plan, count]) => (
            <Card key={plan} className="bg-slate-900/50 border-slate-800 p-4">
              <div className="text-xs uppercase tracking-wider text-slate-500">{plan} plan</div>
              <div className="text-2xl font-bold text-white mt-1">{count}</div>
              <div className="text-xs text-slate-500">users</div>
            </Card>
          ))}
        </div>
      )}

      {/* Users table */}
      <Card className="bg-slate-900/50 border-slate-800 overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="text-base font-semibold text-white">Users</div>
            <div className="text-xs text-slate-500">{filtered.length} of {users.length} users</div>
          </div>
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or email"
            className="w-72 bg-slate-800/60 border-slate-700 text-white"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-950/50 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="text-left px-5 py-3">Name</th>
                <th className="text-left px-5 py-3">Email</th>
                <th className="text-left px-5 py-3">Role</th>
                <th className="text-left px-5 py-3">Plan</th>
                <th className="text-left px-5 py-3">Joined</th>
                <th className="text-left px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.map((u) => (
                <tr key={u.userId} className="hover:bg-slate-800/30">
                  <td className="px-5 py-3 text-white">{u.name}</td>
                  <td className="px-5 py-3 text-slate-300">{u.email}</td>
                  <td className="px-5 py-3">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${u.role === 'admin' ? 'bg-red-500/15 text-red-300' : 'bg-slate-800 text-slate-400'}`}>
                      {u.role || 'user'}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${u.plan === 'pro' ? 'bg-orange-500/15 text-orange-300' : u.plan === 'enterprise' ? 'bg-purple-500/15 text-purple-300' : 'bg-slate-800 text-slate-400'}`}>
                      {u.plan || 'free'}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-slate-500 text-xs">
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-IN') : '—'}
                  </td>
                  <td className="px-5 py-3">
                    <Select value={u.plan || 'free'} onValueChange={(v) => changePlan(u.userId, v)}>
                      <SelectTrigger className="w-32 h-8 bg-slate-800 border-slate-700 text-white text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-slate-700 text-white">
                        <SelectItem value="free">Free</SelectItem>
                        <SelectItem value="pro">Pro</SelectItem>
                        <SelectItem value="enterprise">Enterprise</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="text-center py-10 text-slate-500">No users found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

function StatCard({ label, value, icon: Icon, color }) {
  return (
    <Card className="bg-slate-900/50 border-slate-800 p-5 relative overflow-hidden">
      <div className={`absolute -right-4 -top-4 h-20 w-20 rounded-full bg-${color}-500/10 blur-2xl`} />
      <div className="flex items-start justify-between relative">
        <div>
          <div className="text-xs uppercase tracking-wider text-slate-500 mb-2">{label}</div>
          <div className="text-2xl font-bold text-white">{value}</div>
        </div>
        <div className={`p-2 rounded-lg bg-${color}-500/10 border border-${color}-500/20`}>
          <Icon className={`h-4 w-4 text-${color}-400`} />
        </div>
      </div>
    </Card>
  )
}
