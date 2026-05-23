'use client'

import Link from 'next/link'
import { ChevronLeft, Info, Loader2, Calculator, Check, AlertTriangle, FileDown, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { motion } from 'framer-motion'
import { generateCalculationPDF } from '@/lib/pdf-generator'
import { useAuth } from '@/lib/auth-context'

export function CalcShell({ icon: Icon, title, subtitle, code = 'IS 456:2000', children }) {
  return (
    <div className="p-6 lg:p-10 max-w-7xl">
      <Link href="/dashboard" className="inline-flex items-center text-sm text-slate-400 hover:text-white mb-4">
        <ChevronLeft className="h-4 w-4 mr-1" /> Back to Dashboard
      </Link>
      <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
        <div>
          <div className="flex items-center text-xs uppercase tracking-wider text-orange-400 font-semibold mb-2">
            <Icon className="h-3 w-3 mr-1.5" /> RCC Calculator
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-white">{title}</h1>
          <p className="text-slate-400 mt-1">{subtitle}</p>
        </div>
        <div className="text-xs text-slate-500 px-3 py-1.5 rounded-md bg-slate-900 border border-slate-800">
          <Info className="h-3 w-3 inline mr-1" /> Code: {code}
        </div>
      </div>
      {children}
    </div>
  )
}

export function NumField({ label, id, value, onChange, step = '1', unit }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs text-slate-400">{label}{unit ? ` (${unit})` : ''}</Label>
      <Input
        id={id}
        type="number"
        step={step}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-slate-800/60 border-slate-700 text-white focus:border-orange-500 h-10"
      />
    </div>
  )
}

export function SelField({ label, value, onChange, options }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-slate-400">{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="bg-slate-800/60 border-slate-700 text-white focus:border-orange-500 h-10">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-slate-900 border-slate-700 text-white">
          {options.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  )
}

export function RunButton({ loading, onClick, label = 'Run Design' }) {
  return (
    <Button onClick={onClick} disabled={loading} className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 h-11 mt-2">
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Calculator className="h-4 w-4 mr-2" /> {label}</>}
    </Button>
  )
}

export function EmptyResult({ icon: Icon = Calculator, hint = 'Enter inputs on the left and run the calculation.' }) {
  return (
    <Card className="bg-slate-900/30 border-dashed border-slate-800 p-12 text-center">
      <div className="inline-flex p-3 rounded-full bg-orange-500/10 mb-4">
        <Icon className="h-6 w-6 text-orange-400" />
      </div>
      <div className="text-white font-semibold mb-1">Results will appear here</div>
      <div className="text-sm text-slate-500">{hint}</div>
    </Card>
  )
}

export function SafetyBanner({ safe, subtitle }) {
  if (typeof safe !== 'boolean') return null
  return (
    <Card className={`p-5 border ${safe ? 'bg-green-500/5 border-green-500/30' : 'bg-yellow-500/5 border-yellow-500/30'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={`h-10 w-10 rounded-full ${safe ? 'bg-green-500/20' : 'bg-yellow-500/20'} flex items-center justify-center mr-3`}>
            {safe ? <Check className="h-5 w-5 text-green-400" /> : <AlertTriangle className="h-5 w-5 text-yellow-400" />}
          </div>
          <div>
            <div className="text-lg font-bold text-white">{safe ? 'Design is Safe' : 'Review Recommended'}</div>
            <div className="text-xs text-slate-400">{subtitle}</div>
          </div>
        </div>
        <Sparkles className="h-5 w-5 text-orange-400" />
      </div>
    </Card>
  )
}

export function ResultBlock({ title, children, className = '' }) {
  return (
    <Card className={`bg-slate-900/50 border-slate-800 p-5 ${className}`}>
      <div className="text-xs uppercase tracking-wider text-orange-400 font-semibold mb-3">{title}</div>
      <div className="space-y-1.5">{children}</div>
    </Card>
  )
}

export function Row({ k, v, highlight }) {
  return (
    <div className="flex items-center justify-between text-sm py-1.5 border-b border-slate-800/60 last:border-0">
      <span className="text-slate-400">{k}</span>
      <span className={`font-medium ${highlight ? 'text-orange-300' : 'text-white'}`}>{v}</span>
    </div>
  )
}

export function DownloadPDFButton({ type, inputs, result, calculationId }) {
  const { user } = useAuth()
  const onClick = () => {
    generateCalculationPDF({ type, inputs, result, user, calculationId })
  }
  return (
    <Button onClick={onClick} variant="outline" className="border-slate-700 bg-slate-900/40 hover:bg-slate-800 text-white">
      <FileDown className="h-4 w-4 mr-2" /> Download PDF Report
    </Button>
  )
}

export const M_GRADES = ['M15', 'M20', 'M25', 'M30', 'M35', 'M40']
export const FE_GRADES = ['Fe415', 'Fe500', 'Fe550']
export const ResultsMotion = motion.div
