'use client'
import { useState } from 'react'
import { Paintbrush } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { useAuth } from '@/lib/auth-context'
import { toast } from 'sonner'
import {
  CalcShell, NumField, SelField, RunButton, EmptyResult,
  ResultBlock, Row, DownloadPDFButton, ResultsMotion,
} from '@/components/calc-shell'

export default function PlasterPage() {
  const { authFetch } = useAuth()
  const [form, setForm] = useState({ length: 4, height: 3, thickness: 12, mortarRatio: '1:6', sides: 1 })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [calculationId, setCalculationId] = useState(null)
  const u = (k, v) => setForm((p) => ({ ...p, [k]: v }))
  const calc = async () => {
    setLoading(true)
    try {
      const r = await authFetch('/api/calculate/plaster', { method: 'POST', body: JSON.stringify({
        length: parseFloat(form.length), height: parseFloat(form.height),
        thickness: parseFloat(form.thickness), mortarRatio: form.mortarRatio, sides: parseInt(form.sides),
      })})
      const d = await r.json()
      if (!r.ok) throw new Error(d.error || 'Failed')
      setResult(d.result); setCalculationId(d.calculationId)
      toast.success('Calculated')
    } catch (e) { toast.error(e.message) } finally { setLoading(false) }
  }
  return (
    <CalcShell icon={Paintbrush} title="Plaster Work" subtitle="Cement-sand plaster (12mm internal / 15-20mm external) material take-off" code="Standard practice">
      <div className="grid lg:grid-cols-5 gap-6">
        <Card className="lg:col-span-2 bg-slate-900/50 border-slate-800 p-6 h-fit">
          <h2 className="text-lg font-semibold text-white mb-1">Inputs</h2>
          <p className="text-xs text-slate-500 mb-5">Wall dimensions in metres, thickness in mm</p>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <NumField label="Wall length" id="length" value={form.length} onChange={(v) => u('length', v)} unit="m" step="0.1" />
              <NumField label="Wall height" id="height" value={form.height} onChange={(v) => u('height', v)} unit="m" step="0.1" />
            </div>
            <NumField label="Plaster thickness" id="thickness" value={form.thickness} onChange={(v) => u('thickness', v)} unit="mm" step="1" />
            <SelField label="Sides" value={String(form.sides)} onChange={(v) => u('sides', v)} options={['1', '2']} />
            <SelField label="Mortar ratio (C : S)" value={form.mortarRatio} onChange={(v) => u('mortarRatio', v)} options={['1:3', '1:4', '1:5', '1:6']} />
            <RunButton loading={loading} onClick={calc} label="Calculate" />
          </div>
        </Card>
        <div className="lg:col-span-3 space-y-4">
          {!result && <EmptyResult icon={Paintbrush} />}
          {result && (
            <ResultsMotion initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="flex justify-end"><DownloadPDFButton type="plaster" inputs={form} result={result} calculationId={calculationId} /></div>
              <div className="grid sm:grid-cols-2 gap-4">
                <ResultBlock title="Plastering Area">
                  <Row k="Area" v={`${result.inputs.area} m²`} highlight />
                  <Row k="Thickness" v={`${result.inputs.thickness} mm`} />
                  <Row k="Sides plastered" v={result.inputs.sides} />
                  <Row k="Mortar mix" v={result.inputs.mortarMix} />
                </ResultBlock>
                <ResultBlock title="Volume">
                  <Row k="Wet volume" v={`${result.volume.wetVolume} m³`} />
                  <Row k="Dry volume" v={`${result.volume.dryVolume} m³`} highlight />
                </ResultBlock>
                <ResultBlock title="Cement">
                  <Row k="Bags (50 kg)" v={`${result.cement.bags} bags`} highlight />
                  <Row k="Weight" v={`${result.cement.kg} kg`} />
                </ResultBlock>
                <ResultBlock title="Sand">
                  <Row k="Volume" v={`${result.sand.cum} m³`} highlight />
                  <Row k="Volume" v={`${result.sand.cft} cft`} />
                </ResultBlock>
              </div>
            </ResultsMotion>
          )}
        </div>
      </div>
    </CalcShell>
  )
}
