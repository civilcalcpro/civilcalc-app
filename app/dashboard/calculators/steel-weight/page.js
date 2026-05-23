'use client'

import { useState } from 'react'
import { BarChart3 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { useAuth } from '@/lib/auth-context'
import { toast } from 'sonner'
import {
  CalcShell, NumField, RunButton, EmptyResult, ResultBlock, Row,
  DownloadPDFButton, ResultsMotion, SelField,
} from '@/components/calc-shell'

export default function SteelWeightPage() {
  const { authFetch } = useAuth()
  const [form, setForm] = useState({ diameter: 16, length: 12 })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [calculationId, setCalculationId] = useState(null)
  const u = (k, v) => setForm((p) => ({ ...p, [k]: v }))

  const calculate = async () => {
    setLoading(true)
    try {
      const payload = { diameter: parseFloat(form.diameter), length: parseFloat(form.length) }
      const r = await authFetch('/api/calculate/steel-weight', { method: 'POST', body: JSON.stringify(payload) })
      const data = await r.json()
      if (!r.ok) throw new Error(data.error || 'Failed')
      setResult(data.result)
      setCalculationId(data.calculationId)
      toast.success('Calculated')
    } catch (e) { toast.error(e.message) } finally { setLoading(false) }
  }

  return (
    <CalcShell icon={BarChart3} title="Steel Weight Calculator" subtitle="Unit weight of reinforcement bars (D²/162 formula)" code="IS 1786">
      <div className="grid lg:grid-cols-5 gap-6">
        <Card className="lg:col-span-2 bg-slate-900/50 border-slate-800 p-6 h-fit">
          <h2 className="text-lg font-semibold text-white mb-1">Inputs</h2>
          <p className="text-xs text-slate-500 mb-5">Diameter in mm, length in metres</p>
          <div className="space-y-4">
            <SelField
              label="Bar diameter"
              value={String(form.diameter)}
              onChange={(v) => u('diameter', v)}
              options={['8', '10', '12', '16', '20', '25', '28', '32']}
            />
            <NumField label="Total length" id="length" value={form.length} onChange={(v) => u('length', v)} unit="m" step="0.1" />
            <RunButton loading={loading} onClick={calculate} label="Calculate" />
          </div>
          <div className="mt-6 p-3 rounded-lg bg-slate-800/40 border border-slate-700 text-xs text-slate-400">
            <span className="text-orange-400 font-semibold">Formula:</span> Weight (kg/m) = D² / 162
          </div>
        </Card>

        <div className="lg:col-span-3 space-y-4">
          {!result && <EmptyResult icon={BarChart3} />}
          {result && (
            <ResultsMotion initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="flex justify-end">
                <DownloadPDFButton type="steel-weight" inputs={form} result={result} calculationId={calculationId} />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <ResultBlock title="Bar Properties">
                  <Row k="Diameter" v={`${result.diameter} mm`} />
                  <Row k="Total length" v={`${result.length} m`} />
                  <Row k="Formula" v={result.formula} />
                </ResultBlock>
                <ResultBlock title="Weight">
                  <Row k="Per metre" v={`${result.weightPerMeter} kg/m`} />
                  <Row k="Total weight" v={`${result.totalWeight} kg`} highlight />
                </ResultBlock>
              </div>
            </ResultsMotion>
          )}
        </div>
      </div>
    </CalcShell>
  )
}
