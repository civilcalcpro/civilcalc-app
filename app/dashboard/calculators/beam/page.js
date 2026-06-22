'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Ruler, ChevronLeft, Loader2, Check, AlertTriangle, Calculator, Sparkles, Info } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAuth } from '@/lib/auth-context'
import { toast } from 'sonner'
import { DownloadPDFButton } from '@/components/calc-shell'
import { useGlobalSettings } from '@/components/settings/GlobalSettingsProvider'

export default function BeamDesignPage() {
  const { authFetch } = useAuth()
  const [form, setForm] = useState({
    span: 5,
    width: 230,
    depth: 450,
    deadLoad: 5,
    liveLoad: 10,
    grade: 'M25',
    steelGrade: 'Fe500',
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [calculationId, setCalculationId] = useState(null)

  const update = (k, v) => setForm((p) => ({ ...p, [k]: v }))
const { settings } = useGlobalSettings()

const isImperial =
  settings.unitSystem === 'imperial'
  const calculate = async () => {
  setLoading(true)

  try {

    const span = isImperial
      ? parseFloat(form.span) * 0.3048
      : parseFloat(form.span)

    const width = isImperial
      ? parseFloat(form.width) * 25.4
      : parseFloat(form.width)

    const depth = isImperial
      ? parseFloat(form.depth) * 25.4
      : parseFloat(form.depth)

    const deadLoad = isImperial
      ? parseFloat(form.deadLoad) * 0.0145939
      : parseFloat(form.deadLoad)

    const liveLoad = isImperial
      ? parseFloat(form.liveLoad) * 0.0145939
      : parseFloat(form.liveLoad)

    const payload = {
      span,
      width,
      depth,
      deadLoad,
      liveLoad,
      grade: form.grade,
      steelGrade: form.steelGrade,
    }

    const res = await authFetch('/api/calculate/beam', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Calculation failed')
      setResult(data.result)
      setCalculationId(data.calculationId)
      toast.success('Design completed')
    } catch (e) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 lg:p-10 max-w-7xl">
      <Link href="/dashboard" className="inline-flex items-center text-sm text-slate-400 hover:text-white mb-4">
        <ChevronLeft className="h-4 w-4 mr-1" /> Back to Dashboard
      </Link>

      <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
        <div>
          <div className="flex items-center text-xs uppercase tracking-wider text-orange-400 font-semibold mb-2">
            <Ruler className="h-3 w-3 mr-1.5" /> RCC Calculator
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-white">Beam Design</h1>
          <p className="text-slate-400 mt-1">
            Singly / doubly reinforced rectangular beam — limit state method per IS 456:2000
          </p>
        </div>
        <div className="text-xs text-slate-500 px-3 py-1.5 rounded-md bg-slate-900 border border-slate-800">
          <Info className="h-3 w-3 inline mr-1" /> Code: IS 456:2000
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Input form */}
        <Card className="lg:col-span-2 bg-slate-900/50 border-slate-800 p-6 h-fit">
          <h2 className="text-lg font-semibold text-white mb-1">Inputs</h2>
        <p className="text-xs text-slate-500 mb-5">
  {isImperial
    ? 'All dimensions in inches, loads in lb/ft, span in ft'
    : 'All dimensions in mm, loads in kN/m, span in m'}
</p>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
             <Field
  label={`Span (${isImperial ? 'ft' : 'm'})`} id="span" value={form.span} onChange={(v) => update('span', v)} type="number" step="0.1" />
              <Field
  label={`Width b (${isImperial ? 'in' : 'mm'})`} id="width" value={form.width} onChange={(v) => update('width', v)} />
            </div>

           <Field
  label={`Overall Depth D (${isImperial ? 'in' : 'mm'})`} id="depth" value={form.depth} onChange={(v) => update('depth', v)} />

            <div className="grid grid-cols-2 gap-3">
             <Field
  label={`Dead Load (${isImperial ? 'lb/ft' : 'kN/m'})`} id="deadLoad" value={form.deadLoad} onChange={(v) => update('deadLoad', v)} type="number" step="0.1" />
              <Field
  label={`Live Load (${isImperial ? 'lb/ft' : 'kN/m'})`} id="liveLoad" value={form.liveLoad} onChange={(v) => update('liveLoad', v)} type="number" step="0.1" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <SelectField label="Concrete grade" value={form.grade} onChange={(v) => update('grade', v)} options={['M15', 'M20', 'M25', 'M30', 'M35', 'M40']} />
              <SelectField label="Steel grade" value={form.steelGrade} onChange={(v) => update('steelGrade', v)} options={['Fe415', 'Fe500', 'Fe550']} />
            </div>

            <Button
              onClick={calculate}
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 h-11 mt-2"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Calculator className="h-4 w-4 mr-2" /> Run Design</>}
            </Button>
          </div>
        </Card>

        {/* Results */}
        <div className="lg:col-span-3 space-y-4">
          {!result && (
            <Card className="bg-slate-900/30 border-dashed border-slate-800 p-12 text-center">
              <div className="inline-flex p-3 rounded-full bg-orange-500/10 mb-4">
                <Ruler className="h-6 w-6 text-orange-400" />
              </div>
              <div className="text-white font-semibold mb-1">Run the design to see results</div>
              <div className="text-sm text-slate-500">
                Enter beam dimensions and loads on the left, then hit <span className="text-orange-400">Run Design</span>.
              </div>
            </Card>
          )}

          {result && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <Card className={`p-5 border ${result.isDesignSafe ? 'bg-green-500/5 border-green-500/30' : 'bg-yellow-500/5 border-yellow-500/30'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {result.isDesignSafe ? (
                      <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center mr-3">
                        <Check className="h-5 w-5 text-green-400" />
                      </div>
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-yellow-500/20 flex items-center justify-center mr-3">
                        <AlertTriangle className="h-5 w-5 text-yellow-400" />
                      </div>
                    )}
                    <div>
                      <div className="text-lg font-bold text-white">
                        {result.isDesignSafe ? 'Design is Safe' : 'Review Recommended'}
                      </div>
                      <div className="text-xs text-slate-400">
                        {result.moment.type} · isImperial
  ? `${mmToIn(result.design.beamWidth)} × ${mmToIn(result.design.beamDepth)} in`
  : `${result.design.beamWidth} × ${result.design.beamDepth} mm`
                      </div>
                    </div>
                  </div>
                  <Sparkles className="h-5 w-5 text-orange-400" />
                </div>
              </Card>

              <div className="flex justify-end">
                <DownloadPDFButton type="beam" inputs={form} result={result} calculationId={calculationId} />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <ResultBlock title="Geometry">
                 <ResultBlock title="Geometry">
  <Row
    k="Beam size"
    v={
      isImperial
        ? `${mmToIn(result.design.beamWidth)} × ${mmToIn(result.design.beamDepth)} in`
        : `${result.design.beamWidth} × ${result.design.beamDepth} mm`
    }
  />

<Row
k="Effective depth d"
v={
isImperial
? `${mmToIn(result.design.effectiveDepth)} in`
: `${result.design.effectiveDepth} mm`
}
/>

<Row
k="Effective span"
v={
isImperial
? `${mToFt(result.design.effectiveSpan)} ft`
: `${result.design.effectiveSpan} m`
}
/> </ResultBlock>

<ResultBlock title="Loading">
  <Row
    k="Self weight"
    v={
      isImperial
        ? `${kNmLoadToLbFt(result.loads.selfWeight)} lb/ft`
        : `${result.loads.selfWeight} kN/m`
    }
  />

<Row
k="Total dead load"
v={
isImperial
? `${kNmLoadToLbFt(result.loads.totalDeadLoad)} lb/ft`
: `${result.loads.totalDeadLoad} kN/m`
}
/>

<Row
k="Live load"
v={
isImperial
? `${kNmLoadToLbFt(result.loads.liveLoad)} lb/ft`
: `${result.loads.liveLoad} kN/m`
}
/>

<Row
k="Factored load"
v={
isImperial
? `${kNmLoadToLbFt(result.loads.factoredLoad)} lb/ft`
: `${result.loads.factoredLoad} kN/m`
}
highlight
/> </ResultBlock>

<ResultBlock title="Bending">
  <Row
    k="Max moment Mu"
    v={
      isImperial
        ? `${kNmToKipFt(result.moment.maximumMoment)} kip-ft`
        : `${result.moment.maximumMoment} kNm`
    }
    highlight
  />

<Row
k="Limiting moment"
v={
isImperial
? `${kNmToKipFt(result.moment.limitingMoment)} kip-ft`
: `${result.moment.limitingMoment} kNm`
}
/>

  <Row k="Section type" v={result.moment.type} />
</ResultBlock>

<ResultBlock title="Reinforcement">
  <Row
    k="Ast required"
    v={
      isImperial
        ? `${mm2ToIn2(result.steel.requiredAst)} in²`
        : `${result.steel.requiredAst} mm²`
    }
  />

<Row
k="Ast provided"
v={
isImperial
? `${mm2ToIn2(result.steel.providedAst)} in²`
: `${result.steel.providedAst} mm²`
}
/>

<Row
 k="Main steel"
 v={result.steel.reinforcement}
 highlight
/>

{result.steel.compressionSteel !== 'Not Required' && (
<Row
k="Compression steel"
v={
isImperial
? `${mm2ToIn2(result.steel.compressionSteel)} in²`
: `${result.steel.compressionSteel} mm²`
}
/>
)} </ResultBlock>

{result.sideFaceReinforcement && ( <ResultBlock title="Side Face Reinforcement" className="sm:col-span-2"> <Row
   k="Required"
   v={result.sideFaceReinforcement.required}
   highlight
 />

```
<Row
  k="IS Code Clause"
  v={result.sideFaceReinforcement.clause}
/>

<Row
  k="Total side face steel"
  v={
    isImperial
      ? `${mm2ToIn2(result.sideFaceReinforcement.requiredAstTotal)} in²`
      : `${result.sideFaceReinforcement.requiredAstTotal} mm²`
  }
/>

<Row
  k="Steel per face"
  v={
    isImperial
      ? `${mm2ToIn2(result.sideFaceReinforcement.requiredAstEachFace)} in²`
      : `${result.sideFaceReinforcement.requiredAstEachFace} mm²`
  }
/>

<Row
  k="Specification"
  v={result.sideFaceReinforcement.specification}
  highlight
/>

<Row
  k="Note"
  v={result.sideFaceReinforcement.note}
/>
```

  </ResultBlock>
)}

<ResultBlock title="Shear & Stirrups" className="sm:col-span-2">
  <div className="grid sm:grid-cols-2 gap-x-6">
    <div>
      <Row
        k="Max shear Vu"
        v={
          isImperial
            ? `${kNToKip(result.shear.maxShear)} kip`
            : `${result.shear.maxShear} kN`
        }
      />

```
  <Row
    k="Nominal shear stress"
    v={`${result.shear.nominalShear} N/mm²`}
  />
</div>

<div>
  <Row
    k="Permissible τc"
    v={`${result.shear.permissibleShear} N/mm²`}
  />

  <Row
    k="Stirrups"
    v={result.shear.stirrups}
    highlight
  />
</div>

                  </div>
                </ResultBlock>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
const mmToIn = (mm) => (mm / 25.4).toFixed(2)

const mm2ToIn2 = (mm2) => (mm2 / 645.16).toFixed(2)

const kNmToKipFt = (kNm) => (kNm * 0.73756).toFixed(2)

const kNToKip = (kN) => (kN * 0.224809).toFixed(2)
const mToFt = (m) => (m * 3.28084).toFixed(2)

const kNmLoadToLbFt = (value) =>
  (value * 68.5218).toFixed(2)
function Field({ label, id, value, onChange, type = 'number', step = '1' }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs text-slate-400">{label}</Label>
      <Input
        id={id}
        type={type}
        step={step}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-slate-800/60 border-slate-700 text-white focus:border-orange-500 h-10"
      />
    </div>
  )
}

function SelectField({ label, value, onChange, options }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-slate-400">{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="bg-slate-800/60 border-slate-700 text-white focus:border-orange-500 h-10">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-slate-900 border-slate-700 text-white">
          {options.map((o) => (
            <SelectItem key={o} value={o}>{o}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

function ResultBlock({ title, children, className = '' }) {
  return (
    <Card className={`bg-slate-900/50 border-slate-800 p-5 ${className}`}>
      <div className="text-xs uppercase tracking-wider text-orange-400 font-semibold mb-3">{title}</div>
      <div className="space-y-1.5">{children}</div>
    </Card>
  )
}

function Row({ k, v, highlight }) {
  return (
    <div className="flex items-center justify-between text-sm py-1.5 border-b border-slate-800/60 last:border-0">
      <span className="text-slate-400">{k}</span>
      <span className={`font-medium ${highlight ? 'text-orange-300' : 'text-white'}`}>{v}</span>
    </div>
  )
}
