'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Sparkles, Loader2, X, CreditCard, ShieldCheck, ChevronLeft, Building2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { useAuth } from '@/lib/auth-context'
import { toast } from 'sonner'

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    period: 'forever',
    tagline: 'Get started with essential calculators',
    features: [
      '5 calculations / month',
      'Basic RCC tools',
      'Unit converter',
      'Community support',
    ],
    cta: 'Current plan',
    highlighted: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 499,
    period: 'month',
    tagline: 'For practicing engineers and small firms',
    features: [
      'Unlimited calculations',
      'AI Engineering Assistant (Claude)',
      'All RCC design tools',
      'PDF report generation',
      'Quantity estimation suite',
      'IS Code Library',
      'Priority support',
    ],
    cta: 'Upgrade to Pro',
    highlighted: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 1999,
    period: 'month',
    tagline: 'For consultancies and contracting firms',
    features: [
      'Everything in Pro',
      'Team workspaces (up to 10 seats)',
      'Project sharing & version control',
      'Custom IS code uploads',
      'API access',
      'Dedicated account manager',
    ],
    cta: 'Contact Sales',
    highlighted: false,
  },
]

export default function PricingPage() {
  const { user, authFetch } = useAuth()
  const router = useRouter()
  const [billing, setBilling] = useState('monthly') // 'monthly' or 'yearly'
  const [selected, setSelected] = useState(null)
  const [state, setState] = useState('idle') // idle | processing | success | failure

  const currentPlan = (user?.plan || 'free').toLowerCase()

  const startUpgrade = (plan) => {
    if (plan.id === 'free') return
    if (plan.id === 'enterprise') {
      toast.message('Our team will reach out shortly.', { description: 'Sales contact form coming soon.' })
      return
    }
    setSelected(plan)
    setState('idle')
  }

  const processPayment = async () => {
    if (!selected) return
    setState('processing')
    try {
      // MOCKED Razorpay checkout: create order on backend
      const res = await authFetch('/api/payments/create-order', {
        method: 'POST',
        body: JSON.stringify({ planId: selected.id, billing, amount: priceFor(selected) }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Order failed')

      // Simulate Razorpay UI delay
      await new Promise((r) => setTimeout(r, 1800))

      // MOCK: 90% success path
      const success = Math.random() < 0.9
      if (!success) {
        setState('failure')
        return
      }

      // Verify (mocked)
      const verifyRes = await authFetch('/api/payments/verify', {
        method: 'POST',
        body: JSON.stringify({
          orderId: data.orderId,
          paymentId: 'pay_mock_' + Math.random().toString(36).slice(2, 10),
          planId: selected.id,
        }),
      })
      if (verifyRes.ok) {
        setState('success')
        // refresh user
        const me = await authFetch('/api/auth/me')
        if (me.ok) {
          const u = await me.json()
          localStorage.setItem('cc_user', JSON.stringify({ ...user, plan: u.plan }))
        }
      } else {
        setState('failure')
      }
    } catch (e) {
      setState('failure')
    }
  }

  const priceFor = (plan) => {
    if (plan.price === 0) return 0
    return billing === 'yearly' ? plan.price * 10 : plan.price // 2 months free yearly
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white relative overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.04)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="relative">
        {/* Top nav */}
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <Link href={user ? '/dashboard' : '/'} className="flex items-center space-x-2">
            <div className="h-10 w-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold">CivilCalc Pro</span>
          </Link>
          <Link href={user ? '/dashboard' : '/'} className="inline-flex items-center text-sm text-slate-400 hover:text-white">
            <ChevronLeft className="h-4 w-4 mr-1" /> {user ? 'Back to Dashboard' : 'Back to Home'}
          </Link>
        </div>

        {/* Hero */}
        <div className="container mx-auto px-4 pt-8 pb-16 text-center">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full text-xs font-semibold text-orange-300 uppercase tracking-wider mb-4">
              <Sparkles className="h-3 w-3 mr-1.5" /> Plans & Pricing
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Engineering tools at the{' '}
              <span className="bg-gradient-to-r from-orange-500 to-orange-300 bg-clip-text text-transparent">
                right scale
              </span>
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-8">
              Start free. Upgrade when your projects do.
            </p>

            {/* Billing toggle */}
            <div className="inline-flex p-1 rounded-full bg-slate-900/80 border border-slate-800">
              <button
                onClick={() => setBilling('monthly')}
                className={`px-5 py-1.5 text-sm rounded-full transition ${
                  billing === 'monthly' ? 'bg-orange-500 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBilling('yearly')}
                className={`px-5 py-1.5 text-sm rounded-full transition flex items-center ${
                  billing === 'yearly' ? 'bg-orange-500 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Yearly <span className="ml-2 text-[10px] px-1.5 py-0.5 bg-green-500/20 text-green-400 rounded">Save 17%</span>
              </button>
            </div>
          </motion.div>
        </div>

        {/* Pricing cards */}
        <div className="container mx-auto px-4 pb-16">
          <div className="grid lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {PLANS.map((plan, idx) => {
              const isCurrent = currentPlan === plan.id
              const price = priceFor(plan)
              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card
                    className={`relative p-8 h-full overflow-hidden ${
                      plan.highlighted
                        ? 'bg-gradient-to-br from-orange-500/10 via-slate-900 to-slate-900 border-orange-500/40 shadow-xl shadow-orange-500/10'
                        : 'bg-slate-900/50 border-slate-800'
                    }`}
                  >
                    {plan.highlighted && (
                      <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent" />
                    )}
                    {plan.highlighted && (
                      <div className="inline-block px-2.5 py-1 bg-orange-500 text-white text-[10px] font-bold rounded-full mb-3 uppercase tracking-wider">
                        Most Popular
                      </div>
                    )}
                    <h3 className="text-2xl font-bold text-white mb-1">{plan.name}</h3>
                    <p className="text-sm text-slate-400 mb-6">{plan.tagline}</p>
                    <div className="mb-6">
                      <span className="text-4xl font-bold text-white">₹{price.toLocaleString('en-IN')}</span>
                      {plan.price > 0 && (
                        <span className="text-slate-500 text-sm ml-1">
                          /{billing === 'yearly' ? 'year' : 'month'}
                        </span>
                      )}
                      {plan.price === 0 && <span className="text-slate-500 text-sm ml-1">forever</span>}
                    </div>

                    <ul className="space-y-3 mb-8">
                      {plan.features.map((f, i) => (
                        <li key={i} className="flex items-start text-sm">
                          <Check className="h-4 w-4 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                          <span className="text-slate-300">{f}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      onClick={() => startUpgrade(plan)}
                      disabled={isCurrent}
                      className={`w-full h-11 ${
                        plan.highlighted
                          ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700'
                          : 'bg-slate-800 hover:bg-slate-700'
                      } ${isCurrent ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {isCurrent ? 'Current plan' : plan.cta}
                    </Button>
                  </Card>
                </motion.div>
              )
            })}
          </div>

          {/* Trust badges (product/quality based, no fake logos) */}
          <div className="mt-12 max-w-3xl mx-auto grid sm:grid-cols-3 gap-6 text-center">
            <TrustBadge title="Cancel anytime" desc="No commitments — cancel from your account in one click." />
            <TrustBadge title="Secure payments" desc="Razorpay-powered checkout with end-to-end encryption." />
            <TrustBadge title="Built for IS codes" desc="Calculations follow IS 456, IS 875, IS 1893 and more." />
          </div>
        </div>
      </div>

      {/* Checkout Dialog */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="bg-slate-950 border-slate-800 text-white max-w-md">
          <AnimatePresence mode="wait">
            {state === 'idle' && selected && (
              <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <DialogHeader>
                  <DialogTitle>Confirm upgrade to {selected.name}</DialogTitle>
                  <DialogDescription className="text-slate-400">
                    Secure checkout via Razorpay (test mode).
                  </DialogDescription>
                </DialogHeader>

                <div className="my-4 p-4 rounded-lg bg-slate-900 border border-slate-800">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Plan</span>
                    <span className="font-semibold">CivilCalc Pro — {selected.name}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="text-slate-400">Billing</span>
                    <span className="capitalize">{billing}</span>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-800">
                    <span className="text-slate-400">Total</span>
                    <span className="text-2xl font-bold text-orange-400">₹{priceFor(selected).toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="flex items-center text-xs text-slate-500 mb-4">
                  <ShieldCheck className="h-3.5 w-3.5 mr-1.5 text-green-400" />
                  Test mode — no real charge will occur
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setSelected(null)} className="border-slate-700 hover:bg-slate-800 text-white flex-1">
                    Cancel
                  </Button>
                  <Button onClick={processPayment} className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
                    <CreditCard className="h-4 w-4 mr-2" /> Pay ₹{priceFor(selected).toLocaleString('en-IN')}
                  </Button>
                </div>
              </motion.div>
            )}

            {state === 'processing' && (
              <motion.div key="proc" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-10 text-center">
                <Loader2 className="h-10 w-10 animate-spin text-orange-500 mx-auto mb-4" />
                <div className="text-lg font-semibold">Processing payment…</div>
                <div className="text-sm text-slate-400 mt-1">Please don’t close this window</div>
              </motion.div>
            )}

            {state === 'success' && (
              <motion.div key="ok" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 12 }}
                  className="h-16 w-16 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center mx-auto mb-4"
                >
                  <Check className="h-8 w-8 text-green-400" />
                </motion.div>
                <div className="text-xl font-bold">Payment successful!</div>
                <div className="text-sm text-slate-400 mt-1">Your plan has been upgraded.</div>
                <Button
                  onClick={() => {
                    setSelected(null)
                    router.push('/dashboard')
                  }}
                  className="mt-6 bg-gradient-to-r from-orange-500 to-orange-600"
                >
                  Go to Dashboard
                </Button>
              </motion.div>
            )}

            {state === 'failure' && (
              <motion.div key="fail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-8 text-center">
                <div className="h-16 w-16 rounded-full bg-red-500/15 border border-red-500/30 flex items-center justify-center mx-auto mb-4">
                  <X className="h-8 w-8 text-red-400" />
                </div>
                <div className="text-xl font-bold">Payment failed</div>
                <div className="text-sm text-slate-400 mt-1">Don’t worry, you weren’t charged.</div>
                <div className="flex gap-3 mt-6">
                  <Button variant="outline" onClick={() => setSelected(null)} className="border-slate-700 text-white flex-1">
                    Close
                  </Button>
                  <Button onClick={() => setState('idle')} className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600">
                    Try again
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function TrustBadge({ title, desc }) {
  return (
    <div>
      <div className="text-sm font-semibold text-white mb-1">{title}</div>
      <div className="text-xs text-slate-500">{desc}</div>
    </div>
  )
}
