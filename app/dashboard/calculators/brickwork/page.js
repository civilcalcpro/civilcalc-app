'use client'
import { useState } from 'react'
import { Layers } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { useAuth } from '@/lib/auth-context'
import { toast } from 'sonner'
import {
  CalcShell, NumField, SelField, RunButton, EmptyResult,
  ResultBlock, Row, DownloadPDFButton, ResultsMotion,
} from '@/components/calc-shell'

const BrickIc = Layers
export default function BrickworkPage() {
  const { authFetch } = useAuth()
  const [form, setForm] = useState({ length: 4, height: 3, thickness: 0.23, mortarRatio: '1:6' })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [calculationId, setCalculationId] = useState(null)
  const u = (k, v) => setForm((p) => ({ ...p, [k]: v }))
  const calc = async () => {
    setLoading(true)
    try {
      const r = await authFetch('/api/calculate/brickwork', { method: 'POST', body: JSON.stringify({
        length: parseFloat(form.length), height: parseFloat(form.height),
        thickness: parseFloat(form.thickness), mortarRatio: form.mortarRatio,
      })})
      const d = await r.json()
      if (!r.ok) throw new Error(d.error || 'Failed')
      setResult(d.result); setCalculationId(d.calculationId)
      toast.success('Calculated')
    } catch (e) { toast.error(e.message) } finally { setLoading(false) }
  }
  return (
    <CalcShell icon={BrickIc} title="Brickwork Calculator" subtitle="Brick count + cement & sand for mortar (standard 190×90×90 mm)" code="Standard practice">
      <div className="grid lg:grid-cols-5 gap-6">
        <Card className="lg:col-span-2 bg-slate-900/50 border-slate-800 p-6 h-fit">
          <h2 className="text-lg font-semibold text-white mb-1">Inputs</h2>
          <p className="text-xs text-slate-500 mb-5">Dimensions in metres</p>
          <div className="space-y-4">
            <NumField label="Wall length" id="length" value={form.length} onChange={(v) => u('length', v)} unit="m" step="0.1" />
            <NumField label="Wall height" id="height" value={form.height} onChange={(v) => u('height', v)} unit="m" step="0.1" />
            <SelField label="Wall thickness" value={String(form.thickness)} onChange={(v) => u('thickness', v)} options={['0.115', '0.23', '0.34']} />
            <SelField label="Mortar ratio (C : S)" value={form.mortarRatio} onChange={(v) => u('mortarRatio', v)} options={['1:3', '1:4', '1:5', '1:6']} />
            <RunButton loading={loading} onClick={calc} label="Calculate" />
          </div>
        </Card>
        <div className="lg:col-span-3 space-y-4">
          {!result && <EmptyResult icon={BrickIc} />}
          {result && (
            <ResultsMotion initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="flex justify-end"><DownloadPDFButton type="brickwork" inputs={form} result={result} calculationId={calculationId} /></div>
              <div className="grid sm:grid-cols-2 gap-4">
                <ResultBlock title="Wall">
                  <Row k="Wall area" v={`${result.inputs.wallArea} m²`} />
                  <Row k="Wall volume" v={`${result.inputs.wallVolume} m³`} />
                  <Row k="Mortar mix" v={result.inputs.mortarMix} />
                </ResultBlock>
                <ResultBlock title="Bricks">
                  <Row k="Brick count (incl. 5% wastage)" v={`${result.bricks.count} nos`} highlight />
                </ResultBlock>
                <ResultBlock title="Mortar Volume">
                  <Row k="Wet volume" v={`${result.mortar.wetVolume} m³`} />
                  <Row k="Dry volume" v={`${result.mortar.dryVolume} m³`} highlight />
                </ResultBlock>
                <ResultBlock title="Materials">
                  <Row k="Cement" v={`${result.cement.bags} bags (${result.cement.kg} kg)`} highlight />
                  <Row k="Sand" v={`${result.sand.cum} m³ / ${result.sand.cft} cft`} />
                </ResultBlock>
              </div>
            </ResultsMotion>
          )}
        </div>
      </div>
    </CalcShell>
  )
}
