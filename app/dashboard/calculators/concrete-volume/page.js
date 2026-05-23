'use client'

import { useState } from 'react'
import { Boxes } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { useAuth } from '@/lib/auth-context'
import { toast } from 'sonner'
import {
  CalcShell, NumField, RunButton, EmptyResult, ResultBlock, Row,
  DownloadPDFButton, ResultsMotion,
} from '@/components/calc-shell'

export default function ConcreteVolumePage() {
  const { authFetch } = useAuth()
  const [form, setForm] = useState({ length: 5000, width: 3000, thickness: 150 })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [calculationId, setCalculationId] = useState(null)
  const u = (k, v) => setForm((p) => ({ ...p, [k]: v }))

  const calculate = async () => {
    setLoading(true)
    try {
      const payload = {
        length: parseFloat(form.length),
        width: parseFloat(form.width),
        thickness: parseFloat(form.thickness),
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
    <CalcShell icon={Boxes} title="Concrete Volume & Materials" subtitle="Wet/dry volume + cement, sand & aggregate estimate (M20 — 1:1.5:3)" code="IS 10262">
      <div className="grid lg:grid-cols-5 gap-6">
        <Card className="lg:col-span-2 bg-slate-900/50 border-slate-800 p-6 h-fit">
          <h2 className="text-lg font-semibold text-white mb-1">Inputs</h2>
          <p className="text-xs text-slate-500 mb-5">All dimensions in millimetres</p>
          <div className="space-y-4">
            <NumField label="Length" id="length" value={form.length} onChange={(v) => u('length', v)} unit="mm" />
            <NumField label="Width" id="width" value={form.width} onChange={(v) => u('width', v)} unit="mm" />
            <NumField label="Thickness / Depth" id="thickness" value={form.thickness} onChange={(v) => u('thickness', v)} unit="mm" />
            <RunButton loading={loading} onClick={calculate} label="Calculate" />
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
                <ResultBlock title="Volume">
                  <Row k="Wet volume" v={`${result.wetVolume} m³`} />
                  <Row k="Dry volume (×1.54)" v={`${result.dryVolume} m³`} highlight />
                </ResultBlock>
                <ResultBlock title="Cement">
                  <Row k="Bags (50kg)" v={`${result.cement.bags} bags`} highlight />
                  <Row k="Weight" v={`${result.cement.kg} kg`} />
                </ResultBlock>
                <ResultBlock title="Sand (Fine Aggregate)">
                  <Row k="Volume" v={`${result.sand.cum} m³`} />
                  <Row k="Volume" v={`${result.sand.cft} cft`} />
                </ResultBlock>
                <ResultBlock title="Coarse Aggregate">
                  <Row k="Volume" v={`${result.aggregate.cum} m³`} />
                  <Row k="Volume" v={`${result.aggregate.cft} cft`} />
                </ResultBlock>
              </div>
            </ResultsMotion>
          )}
        </div>
      </div>
    </CalcShell>
  )
}
