'use client'

import { useState } from 'react'
import {
  Settings as SettingsIcon,
  User,
  Lock,
  Loader2,
  Save,
} from 'lucide-react'

import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

import { useAuth } from '@/lib/auth-context'
import { toast } from 'sonner'

export default function SettingsPage() {
  const {
    user,
    authFetch,
    updateProfileLocal,
  } = useAuth()

  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [savingProfile, setSavingProfile] = useState(false)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [changing, setChanging] = useState(false)

  const saveProfile = async (e) => {
    e.preventDefault()

    setSavingProfile(true)

    try {
      const r = await authFetch('/api/auth/update-profile', {
        method: 'POST',
        body: JSON.stringify({
          name,
          email,
        }),
      })

      const data = await r.json()

      if (!r.ok) {
        throw new Error(data.error || 'Failed')
      }

      localStorage.setItem(
        'cc_name',
        name || 'Engineer'
      )

      updateProfileLocal(name, email)

      toast.success('Profile updated successfully')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSavingProfile(false)
    }
  }

  const changePassword = async (e) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      return toast.error('Passwords do not match')
    }

    if (newPassword.length < 6) {
      return toast.error('New password must be at least 6 chars')
    }

    setChanging(true)

    try {
      const r = await authFetch('/api/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      })

      const data = await r.json()

      if (!r.ok) {
        throw new Error(data.error || 'Failed')
      }

      toast.success('Password changed')

      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setChanging(false)
    }
  }

  return (
    <div className="p-6 lg:p-10 max-w-4xl">
      <div className="mb-8">
        <div className="flex items-center text-xs uppercase tracking-wider text-orange-400 font-semibold mb-2">
          <SettingsIcon className="h-3 w-3 mr-1.5" />
          Account
        </div>

        <h1 className="text-3xl lg:text-4xl font-bold text-white">
          Settings
        </h1>

        <p className="text-slate-400 mt-1">
          Manage your profile and account security.
        </p>
      </div>

      <div className="space-y-6">
        {/* Profile */}
        <Card className="bg-slate-900/50 border-slate-800 p-6">
          <div className="flex items-center mb-5">
            <div className="p-2 rounded-lg bg-orange-500/10 border border-orange-500/20 mr-3">
              <User className="h-4 w-4 text-orange-400" />
            </div>

            <div>
              <div className="text-base font-semibold text-white">
                Profile
              </div>

              <div className="text-xs text-slate-500">
                Update your display name and email
              </div>
            </div>
          </div>

          <form
            onSubmit={saveProfile}
            className="space-y-4 max-w-xl"
          >
            <div className="space-y-2">
              <Label className="text-xs text-slate-400">
                Full name
              </Label>

              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-slate-800/60 border-slate-700 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-slate-400">
                Email
              </Label>

              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-800/60 border-slate-700 text-white"
              />
            </div>

            <Button
              type="submit"
              disabled={savingProfile}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
            >
              {savingProfile ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save changes
                </>
              )}
            </Button>
          </form>
        </Card>

        {/* Password */}
        <Card className="bg-slate-900/50 border-slate-800 p-6">
          <div className="flex items-center mb-5">
            <div className="p-2 rounded-lg bg-orange-500/10 border border-orange-500/20 mr-3">
              <Lock className="h-4 w-4 text-orange-400" />
            </div>

            <div>
              <div className="text-base font-semibold text-white">
                Change password
              </div>

              <div className="text-xs text-slate-500">
                Use a strong password you don’t reuse
              </div>
            </div>
          </div>

          <form
            onSubmit={changePassword}
            className="space-y-4 max-w-xl"
          >
            <div className="space-y-2">
              <Label className="text-xs text-slate-400">
                Current password
              </Label>

              <Input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="bg-slate-800/60 border-slate-700 text-white"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-xs text-slate-400">
                  New password
                </Label>

                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                  className="bg-slate-800/60 border-slate-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-slate-400">
                  Confirm new password
                </Label>

                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  className="bg-slate-800/60 border-slate-700 text-white"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={changing}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
            >
              {changing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Lock className="h-4 w-4 mr-2" />
                  Update password
                </>
              )}
            </Button>
          </form>
        </Card>

        {/* Free access */}
        <Card className="bg-gradient-to-br from-green-500/10 to-slate-900 border-green-500/30 p-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <div className="text-base font-semibold text-white">
                All features unlocked
              </div>

              <div className="text-xs text-slate-400">
                CivilCalc Pro is{' '}
                <span className="text-green-400 font-semibold">
                  100% free
                </span>
                — every calculator, AI assistant and IS code library are open to you.
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
