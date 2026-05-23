'use client'
import { useState, useMemo } from 'react'
import { ArrowLeftRight, RefreshCw } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CalcShell } from '@/components/calc-shell'

// All conversion categories — defined as factor relative to a base unit per category
const CATEGORIES = {
  Length: {
    base: 'm',
    units: {
      mm: 0.001, cm: 0.01, m: 1, km: 1000,
      inch: 0.0254, ft: 0.3048, yard: 0.9144, mile: 1609.344,
    },
  },
  Area: {
    base: 'm²',
    units: {
      'mm²': 0.000001, 'cm²': 0.0001, 'm²': 1, 'km²': 1_000_000,
      'in²': 0.00064516, 'ft²': 0.092903, 'yd²': 0.836127, acre: 4046.86, hectare: 10000,
    },
  },
  Volume: {
    base: 'm³',
    units: {
      'cm³': 0.000001, 'm³': 1, litre: 0.001, 'ft³ (CFT)': 0.0283168, 'in³': 0.0000163871, 'gallon (US)': 0.00378541,
    },
  },
  Mass: {
    base: 'kg',
    units: {
      g: 0.001, kg: 1, ton: 1000, lb: 0.453592, oz: 0.0283495, quintal: 100,
    },
  },
  Force: {
    base: 'N',
    units: {
      N: 1, kN: 1000, MN: 1_000_000, 'kgf': 9.80665, 'tonne-force': 9806.65,
    },
  },
  Pressure: {
    base: 'N/mm² (MPa)',
    units: {
      'Pa': 0.000001, 'kPa': 0.001, 'MPa': 1, 'N/mm² (MPa)': 1, 'GPa': 1000,
      'bar': 0.1, 'psi': 0.00689476, 'kgf/cm²': 0.0980665,
    },
  },
  Moment: {
    base: 'kN·m',
    units: { 'N·m': 0.001, 'kN·m': 1, 'N·mm': 0.000001, 'lb·ft': 0.00135582 },
  },
  Temperature: {
    base: '°C',
    units: { '°C': 'C', '°F': 'F', K: 'K' },
    special: true,
  },
}

function convertTemp(value, from, to) {
  const v = parseFloat(value) || 0
  let c
  if (from === '°C') c = v
  else if (from === '°F') c = (v - 32) * 5 / 9
  else c = v - 273.15
  if (to === '°C') return c
  if (to === '°F') return c * 9 / 5 + 32
  return c + 273.15
}

export default function UnitConverterPage() {
  const [category, setCategory] = useState('Length')
  const [fromUnit, setFromUnit] = useState('m')
  const [toUnit, setToUnit] = useState('ft')
  const [value, setValue] = useState('1')

  const units = useMemo(() => Object.keys(CATEGORIES[category].units), [category])

  // Recalculate from/to when category changes
  const swap = () => { const t = fromUnit; setFromUnit(toUnit); setToUnit(t) }

  const setCat = (c) => {
    setCategory(c)
    const u = Object.keys(CATEGORIES[c].units)
    setFromUnit(u[0])
    setToUnit(u[1] || u[0])
  }

  const result = useMemo(() => {
    const v = parseFloat(value)
    if (isNaN(v)) return ''
    const cat = CATEGORIES[category]
    if (cat.special) return convertTemp(v, fromUnit, toUnit).toFixed(4)
    const inBase = v * cat.units[fromUnit]
    const out = inBase / cat.units[toUnit]
    return out.toFixed(6).replace(/\.?0+$/, '')
  }, [category, fromUnit, toUnit, value])

  // Quick-pick presets
  const presets = [
    { from: 'm', to: 'ft', label: 'm → ft', cat: 'Length' },
    { from: 'm²', to: 'ft²', label: 'm² → ft²', cat: 'Area' },
    { from: 'm³', to: 'ft³ (CFT)', label: 'm³ → CFT', cat: 'Volume' },
    { from: 'kN', to: 'kgf', label: 'kN → kg-force', cat: 'Force' },
    { from: 'N/mm² (MPa)', to: 'MPa', label: 'N/mm² → MPa', cat: 'Pressure' },
    { from: 'N/mm² (MPa)', to: 'kPa', label: 'N/mm² → kPa', cat: 'Pressure' },
  ]

  return (
    <CalcShell icon={ArrowLeftRight} title="Unit Converter" subtitle="Quick conversions for length, area, volume, force, pressure, moment & more" code="SI · Imperial">
      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <Card className="bg-slate-900/50 border-slate-800 p-6">
            <div className="mb-5">
              <Label className="text-xs text-slate-400">Category</Label>
              <Select value={category} onValueChange={setCat}>
                <SelectTrigger className="bg-slate-800/60 border-slate-700 text-white mt-1.5 h-11"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700 text-white">
                  {Object.keys(CATEGORIES).map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="grid sm:grid-cols-[1fr_auto_1fr] gap-3 items-end">
              <div>
                <Label className="text-xs text-slate-400">From</Label>
                <Input type="number" value={value} onChange={(e) => setValue(e.target.value)} className="bg-slate-800/60 border-slate-700 text-white h-11 mt-1.5 text-lg" />
                <Select value={fromUnit} onValueChange={setFromUnit}>
                  <SelectTrigger className="bg-slate-800/60 border-slate-700 text-white mt-2"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-700 text-white max-h-72">
                    {units.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={swap} size="icon" variant="outline" className="border-slate-700 bg-slate-800 hover:bg-slate-700 text-orange-400 h-11 w-11 mb-[3rem]">
                <RefreshCw className="h-4 w-4" />
              </Button>
              <div>
                <Label className="text-xs text-slate-400">To</Label>
                <Input value={result} readOnly className="bg-slate-800/60 border-slate-700 text-orange-300 h-11 mt-1.5 text-lg font-semibold" />
                <Select value={toUnit} onValueChange={setToUnit}>
                  <SelectTrigger className="bg-slate-800/60 border-slate-700 text-white mt-2"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-700 text-white max-h-72">
                    {units.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-6 p-4 rounded-lg bg-gradient-to-br from-orange-500/10 to-transparent border border-orange-500/20">
              <div className="text-xs uppercase tracking-wider text-orange-400 font-semibold mb-1">Result</div>
              <div className="text-2xl font-bold text-white">{value || 0} {fromUnit} <span className="text-slate-500 mx-2">=</span> {result || '0'} {toUnit}</div>
            </div>
          </Card>
        </div>

        <Card className="lg:col-span-2 bg-slate-900/50 border-slate-800 p-6">
          <div className="text-xs uppercase tracking-wider text-orange-400 font-semibold mb-3">Quick conversions</div>
          <div className="space-y-2">
            {presets.map((p, i) => (
              <button key={i} onClick={() => { setCategory(p.cat); setFromUnit(p.from); setToUnit(p.to); setValue('1') }}
                className="w-full text-left px-3 py-2 rounded-lg bg-slate-800/40 border border-slate-800 hover:border-orange-500/40 hover:bg-slate-800/80 transition text-sm text-slate-300 hover:text-white">
                {p.label}
              </button>
            ))}
          </div>
          <div className="mt-5 pt-5 border-t border-slate-800 text-xs text-slate-500">
            Tip: Use the ⇄ swap button to flip From / To instantly.
          </div>
        </Card>
      </div>
    </CalcShell>
  )
}
