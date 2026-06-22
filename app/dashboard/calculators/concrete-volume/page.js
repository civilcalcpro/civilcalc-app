'use client'

import { useState } from 'react'
import { Boxes } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { useAuth } from '@/lib/auth-context'
import { toast } from 'sonner'
import {
  CalcShell, NumField, SelField, RunButton, EmptyResult, ResultBlock, Row,
  DownloadPDFButton, ResultsMotion,
} from '@/components/calc-shell'
import { useGlobalSettings } from '@/components/settings/GlobalSettingsProvider'
const GRADES = ['M5', 'M7.5', 'M10', 'M15', 'M20', 'M25']

export default function ConcreteVolumePage() {
  const { authFetch } = useAuth()
  const { settings } = useGlobalSettings()
const isImperial = settings.unitSystem === 'imperial'
const [form, setForm] = useState({
  length: 5000,
  width: 3000,
  thickness: 150,
  grade: 'M20',
  wastage: 5,
  dryFactor: 1.54,
})
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [calculationId, setCalculationId] = useState(null)
  const u = (k, v) => setForm((p) => ({ ...p, [k]: v }))

  const calculate = async () => {
    setLoading(true)
    try {
     const length = isImperial
  ? parseFloat(form.length) * 304.8
  : parseFloat(form.length)

const width = isImperial
  ? parseFloat(form.width) * 304.8
  : parseFloat(form.width)

const thickness = isImperial
  ? parseFloat(form.thickness) * 25.4
  : parseFloat(form.thickness)

const payload = {
  length,
  width,
  thickness,
  grade: form.grade,
}
      const r = await authFetch('/api/calculate/concrete-volume', { method: 'POST', body: JSON.stringify(payload) })
      const data = await r.json()
      if (!r.ok) throw new Error(data.error || 'Failed')
      setResult(data.result)
      setCalculationId(data.calculationId)
      toast.success('Calculated')
    } catch (e) { toast.error(e.message) } finally { setLoading(false) }
  }

  return (
    <CalcShell icon={Boxes} title="Concrete Volume & Mix" subtitle="Wet/dry volume + cement, sand, aggregate & water using nominal mix" code="IS 456 Table 9">
      <div className="grid lg:grid-cols-5 gap-6">
        <Card className="lg:col-span-2 bg-slate-900/50 border-slate-800 p-6 h-fit">
          <h2 className="text-lg font-semibold text-white mb-1">Inputs</h2>
         <p className="text-xs text-slate-500 mb-5">
  {isImperial
    ? 'Length/width in ft, thickness in inches'
    : 'Dimensions in millimetres'}
</p>
          <div className="space-y-4">
          <NumField label="Length" id="length" value={form.length} onChange={(v) => u('length', v)} unit={isImperial ? 'ft' : 'mm'} />
            <NumField label="Width" id="width" value={form.width} onChange={(v) => u('width', v)} unit={isImperial ? 'ft' : 'mm'} />
           <NumField label="Thickness / Depth" id="thickness" value={form.thickness} onChange={(v) => u('thickness', v)} unit={isImperial ? 'in' : 'mm'} />

            <SelField label="Concrete grade" value={form.grade} onChange={(v) => u('grade', v)} options={GRADES} />
            <RunButton loading={loading} onClick={calculate} label="Calculate" />
          </div>
          <div className="mt-6 p-3 rounded-lg bg-slate-800/40 border border-slate-700 text-xs text-slate-400">
            <span className="text-orange-400 font-semibold">Nominal mix ratios (IS 456):</span>
            <div className="mt-1 grid grid-cols-2 gap-x-3 gap-y-0.5">
              <span>M5 — 1:5:10</span>
              <span>M7.5 — 1:4:8</span>
              <span>M10 — 1:3:6</span>
              <span>M15 — 1:2:4</span>
              <span>M20 — 1:1.5:3</span>
              <span>M25 — 1:1:2</span>
            </div>
          </div>
        </Card>

        <div className="lg:col-span-3 space-y-4">
          {!result && <EmptyResult icon={Boxes} />}
          {result && (
            <ResultsMotion initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="flex justify-end">
                <DownloadPDFButton type="concrete-volume" inputs={form} result={result} calculationId={calculationId} />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <ResultBlock title="Mix" className="sm:col-span-2">
                  <div className="grid sm:grid-cols-3 gap-x-6">
                    <Row k="Grade" v={result.mix.grade} highlight />
                    <Row k="Ratio (C : S : A)" v={result.mix.ratio} />
                    <Row k="Water / Cement" v={result.mix.waterCementRatio} />
                  </div>
                </ResultBlock>
                <ResultBlock title="Volume">
                  <Row k="Wet volume" v={`${result.wetVolume} m³`} />
                  <Row k="Dry volume (×1.54)" v={`${result.dryVolume} m³`} highlight />
                </ResultBlock>
                <ResultBlock title="Cement">
                  <Row k="Bags (50 kg)" v={`${result.cement.bags} bags`} highlight />
                  <Row k="Weight" v={`${result.cement.kg} kg`} />
                  <Row k="Volume" v={`${result.cement.cum} m³`} />
                </ResultBlock>
                <ResultBlock title="Sand (Fine Aggregate)">
                  <Row k="Volume" v={`${result.sand.cum} m³`} highlight />
                  <Row k="Volume" v={`${result.sand.cft} cft`} />
                </ResultBlock>
                <ResultBlock title="Coarse Aggregate">
                  <Row k="Volume" v={`${result.aggregate.cum} m³`} highlight />
                  <Row k="Volume" v={`${result.aggregate.cft} cft`} />
                </ResultBlock>
                <ResultBlock title="Water" className="sm:col-span-2">
                  <Row k="Water required" v={`${result.water.litres} litres`} highlight />
                </ResultBlock>
              </div>
            </ResultsMotion>
          )}
        </div>
      </div>
    </CalcShell>
  )
}
