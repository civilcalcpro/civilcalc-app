'use client'

import { useEffect, useState } from 'react'
import {
  Shield,
  Users,
  Calculator,
  MessageSquare,
  IndianRupee,
} from 'lucide-react'

import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function AdminPage() {
  const [query, setQuery] = useState('')

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCalculations: 0,
    totalAISessions: 0,
    planBreakdown: {
      free: 0,
      pro: 0,
      enterprise: 0,
    },
  })

  const [users, setUsers] = useState([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const statsRes = await fetch('/api/admin/stats')
      const statsData = await statsRes.json()

      setStats(statsData)

      const usersRes = await fetch('/api/admin/users')
      const usersData = await usersRes.json()

      setUsers(usersData.users || [])
    } catch (err) {
      console.error(err)
      toast.error('Failed to load admin data')
    }
  }

  const changePlan = (userId, plan) => {
    setUsers((us) =>
      us.map((x) => (x.userId === userId ? { ...x, plan } : x))
    )

    toast.success(`Plan updated to ${plan.toUpperCase()}`)
  }

  const filtered = users.filter((u) => {
    if (!query) return true

    const q = query.toLowerCase()

    return (
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q)
    )
  })

  const planRevenue =
    (stats.planBreakdown?.pro || 0) * 499 +
    (stats.planBreakdown?.enterprise || 0) * 1999

  return (
    <div className="p-6 lg:p-10 max-w-7xl">
      <div className="mb-8">
        <div className="flex items-center text-xs uppercase tracking-wider text-red-400 font-semibold mb-2">
          <Shield className="h-3 w-3 mr-1.5" />
          Admin Console
        </div>

        <h1 className="text-3xl lg:text-4xl font-bold text-white">
          Admin Panel
        </h1>

        <p className="text-slate-400 mt-1">
          User management, subscription tracking & platform analytics.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Total users"
          value={stats.totalUsers}
          icon={Users}
        />

        <StatCard
          label="Calculations"
          value={stats.totalCalculations}
          icon={Calculator}
        />

        <StatCard
          label="AI sessions"
          value={stats.totalAISessions}
          icon={MessageSquare}
        />

        <StatCard
          label="MRR"
          value={`₹${planRevenue.toLocaleString('en-IN')}`}
          icon={IndianRupee}
        />
      </div>

      <Card className="bg-slate-900/50 border-slate-800 overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between gap-3">
          <div>
            <div className="text-base font-semibold text-white">
              Users
            </div>

            <div className="text-xs text-slate-500">
              {filtered.length} of {users.length} users
            </div>
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
                  <td className="px-5 py-3 text-white">
                    {u.name}
                  </td>

                  <td className="px-5 py-3 text-slate-300">
                    {u.email}
                  </td>

                  <td className="px-5 py-3 text-red-300">
                    {u.role}
                  </td>

                  <td className="px-5 py-3 text-orange-300">
                    {u.plan}
                  </td>

                  <td className="px-5 py-3 text-slate-500 text-xs">
                    {new Date(u.createdAt).toLocaleDateString('en-IN')}
                  </td>

                  <td className="px-5 py-3">
                    <Select
                      value={u.plan}
                      onValueChange={(v) => changePlan(u.userId, v)}
                    >
                      <SelectTrigger className="w-32 h-8 bg-slate-800 border-slate-700 text-white text-xs">
                        <SelectValue />
                      </SelectTrigger>

                      <SelectContent className="bg-slate-900 border-slate-700 text-white">
                        <SelectItem value="free">Free</SelectItem>
                        <SelectItem value="pro">Pro</SelectItem>
                        <SelectItem value="enterprise">
                          Enterprise
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

function StatCard({ label, value, icon: Icon }) {
  return (
    <Card className="bg-slate-900/50 border-slate-800 p-5">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs uppercase tracking-wider text-slate-500 mb-2">
            {label}
          </div>

          <div className="text-2xl font-bold text-white">
            {value}
          </div>
        </div>

        <div className="p-2 rounded-lg bg-orange-500/10 border border-orange-500/20">
          <Icon className="h-4 w-4 text-orange-400" />
        </div>
      </div>
    </Card>
  )
}
