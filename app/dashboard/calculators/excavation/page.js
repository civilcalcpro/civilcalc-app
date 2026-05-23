'use client'
import { useState } from 'react'
import { Shovel } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { useAuth } from '@/lib/auth-context'
import { toast } from 'sonner'
import {
  CalcShell, NumField, SelField, RunButton, EmptyResult,
  ResultBlock, Row, DownloadPDFButton, ResultsMotion,
} from '@/components/calc-shell'

export default function ExcavationPage() {
  const { authFetch } = useAuth()
  const [form, setForm] = useState({ length: 10, width: 8, depth: 1.5, soilType: 'medium', truckCapacity: 4 })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [calculationId, setCalculationId] = useState(null)
  const u = (k, v) => setForm((p) => ({ ...p, [k]: v }))
  const calc = async () => {
    setLoading(true)
    try {
      const r = await authFetch('/api/calculate/excavation', { method: 'POST', body: JSON.stringify({
        length: parseFloat(form.length), width: parseFloat(form.width),
        depth: parseFloat(form.depth), soilType: form.soilType, truckCapacity: parseFloat(form.truckCapacity),
      })})
      const d = await r.json()
      if (!r.ok) throw new Error(d.error || 'Failed')
      setResult(d.result); setCalculationId(d.calculationId)
      toast.success('Calculated')
    } catch (e) { toast.error(e.message) } finally { setLoading(false) }
  }
  return (
    <CalcShell icon={Shovel} title="Excavation Quantity" subtitle="Earthwork volume + truck/load estimation with bulking allowance" code="IS 1200 (Part 1)">
      <div className="grid lg:grid-cols-5 gap-6">
        <Card className="lg:col-span-2 bg-slate-900/50 border-slate-800 p-6 h-fit">
          <h2 className="text-lg font-semibold text-white mb-1">Inputs</h2>
          <p className="text-xs text-slate-500 mb-5">Dimensions in metres</p>
          <div className="space-y-4">
            <NumField label="Length" id="length" value={form.length} onChange={(v) => u('length', v)} unit="m" step="0.1" />
            <NumField label="Width" id="width" value={form.width} onChange={(v) => u('width', v)} unit="m" step="0.1" />
            <NumField label="Depth" id="depth" value={form.depth} onChange={(v) => u('depth', v)} unit="m" step="0.1" />
            <SelField label="Soil type" value={form.soilType} onChange={(v) => u('soilType', v)} options={['loose', 'medium', 'hard', 'rock']} />
            <NumField label="Truck capacity" id="truckCapacity" value={form.truckCapacity} onChange={(v) => u('truckCapacity', v)} unit="m³" step="0.5" />
            <RunButton loading={loading} onClick={calc} label="Calculate" />
          </div>
        </Card>
        <div className="lg:col-span-3 space-y-4">
          {!result && <EmptyResult icon={Shovel} />}
          {result && (
            <ResultsMotion initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="flex justify-end"><DownloadPDFButton type="excavation" inputs={form} result={result} calculationId={calculationId} /></div>
              <div className="grid sm:grid-cols-2 gap-4">
                <ResultBlock title="Site Geometry">
                  <Row k="Length" v={`${result.site.length} m`} />
                  <Row k="Width" v={`${result.site.width} m`} />
                  <Row k="Depth" v={`${result.site.depth} m`} />
                  <Row k="Soil type" v={result.site.soilType} />
                </ResultBlock>
                <ResultBlock title="Volume">
                  <Row k="In-situ (bank) volume" v={`${result.volume.bankVolume} m³`} highlight />
                  <Row k="Loosened volume" v={`${result.volume.loosenedVolume} m³`} />
                  <Row k="Bulking factor" v={`×${result.volume.bulkingFactor}`} />
                  <Row k="In cft" v={`${result.volume.cft} cft`} />
                </ResultBlock>
                <ResultBlock title="Disposal" className="sm:col-span-2">
                  <div className="grid sm:grid-cols-2 gap-x-6">
                    <div>
                      <Row k="Truck capacity" v={`${result.disposal.truckCapacity} m³`} />
                      <Row k="Number of trips" v={`${result.disposal.totalTrips} loads`} highlight />
                    </div>
                    <div>
                      <Row k="Shoring" v={result.notes.shoringRequired} />
                      <Row k="Safety slope" v={result.notes.safetySlope} />
                    </div>
                  </div>
                </ResultBlock>
              </div>
            </ResultsMotion>
          )}
        </div>
      </div>
    </CalcShell>
  )
}
