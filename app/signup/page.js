'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

import {
  Building2,
  User,
  Mail,
  Lock,
  Loader2,
  ArrowRight,
  Check,
  Chrome,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { useAuth } from '@/lib/auth-context'
import { toast } from 'sonner'

export default function SignupPage() {
  const router = useRouter()

  const {
    signup,
    signInWithGoogle,
  } = useAuth()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      await signup(name, email, password)

      toast.success(
        'Account created! Welcome to CivilCalc Pro.'
      )

      router.push('/dashboard')
    } catch (err) {
      toast.error(err.message || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignup = async () => {
    try {
      setLoading(true)

      await signInWithGoogle()

      toast.success('Signed in with Google')

      router.push('/dashboard')
    } catch (err) {
      toast.error(err.message || 'Google sign-in failed')
    } finally {
      setLoading(false)
    }
  }

  const perks = [
    'Access to 50+ engineering calculators',
    'AI Engineering Assistant powered by Claude',
    'IS 456, IS 875, IS 1893 reference library',
    'Save projects and generate PDF reports',
  ]

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.04)_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(249,115,22,0.1),transparent_50%)]" />

      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="hidden lg:block"
        >
          <Link
            href="/"
            className="flex items-center space-x-2 mb-8"
          >
            <div className="h-12 w-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
              <Building2 className="h-7 w-7 text-white" />
            </div>

            <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-orange-300 bg-clip-text text-transparent">
              CivilCalc Pro
            </span>
          </Link>

          <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
            Build with{' '}
            <span className="bg-gradient-to-r from-orange-500 to-orange-300 bg-clip-text text-transparent">
              precision.
            </span>
          </h2>

          <p className="text-lg text-slate-400 mb-8">
            Join engineers who design safer structures, faster.
          </p>

          <ul className="space-y-3">
            {perks.map((p, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * (i + 1) }}
                className="flex items-start text-slate-300"
              >
                <div className="mt-1 mr-3 h-5 w-5 rounded-full bg-orange-500/15 flex items-center justify-center flex-shrink-0">
                  <Check className="h-3 w-3 text-orange-400" />
                </div>

                {p}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md mx-auto lg:mx-0"
        >
          <Link
            href="/"
            className="flex lg:hidden items-center justify-center space-x-2 mb-6"
          >
            <div className="h-10 w-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <Building2 className="h-6 w-6 text-white" />
            </div>

            <span className="text-xl font-bold text-white">
              CivilCalc Pro
            </span>
          </Link>

          <Card className="bg-slate-900/60 backdrop-blur-xl border-slate-800 p-8">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-white mb-2">
                Create your account
              </h1>

              <p className="text-slate-400 text-sm">
                Start your engineering workspace.
              </p>
            </div>

            <Button
              onClick={handleGoogleSignup}
              disabled={loading}
              className="w-full bg-white text-black hover:bg-gray-200 h-11 mb-4"
            >
              <Chrome className="h-4 w-4 mr-2" />
              Continue with Google
            </Button>

            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-700" />
              </div>

              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-slate-900 px-2 text-slate-500">
                  Or continue with email
                </span>
              </div>
            </div>

            <form
              onSubmit={onSubmit}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-slate-300"
                >
                  Full name
                </Label>

                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />

                  <Input
                    id="name"
                    required
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                    placeholder="Arjun Sharma"
                    className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-slate-300"
                >
                  Email
                </Label>

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />

                  <Input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    placeholder="you@firm.com"
                    className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-slate-300"
                >
                  Password
                </Label>

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />

                  <Input
                    id="password"
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    placeholder="At least 6 characters"
                    className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-orange-500"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 h-11"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Create account
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-slate-400">
              Already have an account?{' '}
              <Link
                href="/login"
                className="text-orange-400 hover:text-orange-300 font-medium"
              >
                Sign in
              </Link>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Building2, User, Mail, Lock, Loader2, ArrowRight, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { useAuth } from '@/lib/auth-context'
import { toast } from 'sonner'

export default function SignupPage() {
  const router = useRouter()
  const { signup } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    try {
      await signup(name, email, password)
      toast.success('Account created! Welcome to CivilCalc Pro.')
      router.push('/dashboard')
    } catch (err) {
      toast.error(err.message || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  const perks = [
    'Access to 50+ engineering calculators',
    'AI Engineering Assistant powered by Claude',
    'IS 456, IS 875, IS 1893 reference library',
    'Save projects and generate PDF reports',
  ]

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.04)_1px,transparent_1px)] bg-[size:40px_40px]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(249,115,22,0.1),transparent_50%)]" />

      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 items-center relative z-10">
        {/* Left side - branding */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="hidden lg:block"
        >
          <Link href="/" className="flex items-center space-x-2 mb-8">
            <div className="h-12 w-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
              <Building2 className="h-7 w-7 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-orange-300 bg-clip-text text-transparent">
              CivilCalc Pro
            </span>
          </Link>
          <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
            Build with{' '}
            <span className="bg-gradient-to-r from-orange-500 to-orange-300 bg-clip-text text-transparent">
              precision.
            </span>
          </h2>
          <p className="text-lg text-slate-400 mb-8">
            Join engineers who design safer structures, faster.
          </p>
          <ul className="space-y-3">
            {perks.map((p, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * (i + 1) }}
                className="flex items-start text-slate-300"
              >
                <div className="mt-1 mr-3 h-5 w-5 rounded-full bg-orange-500/15 flex items-center justify-center flex-shrink-0">
                  <Check className="h-3 w-3 text-orange-400" />
                </div>
                {p}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Right side - form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md mx-auto lg:mx-0"
        >
          <Link href="/" className="flex lg:hidden items-center justify-center space-x-2 mb-6">
            <div className="h-10 w-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">CivilCalc Pro</span>
          </Link>

          <Card className="bg-slate-900/60 backdrop-blur-xl border-slate-800 p-8">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-white mb-2">Create your account</h1>
              <p className="text-slate-400 text-sm">Start your 14-day free trial. No card required.</p>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-300">Full name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input
                    id="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Arjun Sharma"
                    className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@firm.com"
                    className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-300">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input
                    id="password"
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-orange-500"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 h-11"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Create account <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-slate-400">
              Already have an account?{' '}
              <Link href="/login" className="text-orange-400 hover:text-orange-300 font-medium">
                Sign in
              </Link>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
