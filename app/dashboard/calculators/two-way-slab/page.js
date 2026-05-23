'use client'
import { useState } from 'react'
import { Grid3x3 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { useAuth } from '@/lib/auth-context'
import { toast } from 'sonner'
import {
  CalcShell, NumField, SelField, RunButton, EmptyResult, SafetyBanner,
  ResultBlock, Row, DownloadPDFButton, ResultsMotion, M_GRADES, FE_GRADES,
} from '@/components/calc-shell'

export default function TwoWaySlabPage() {
  const { authFetch } = useAuth()
  const [form, setForm] = useState({ length: 5, width: 4, liveLoad: 3, floorFinish: 1, grade: 'M20', steelGrade: 'Fe415' })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [calculationId, setCalculationId] = useState(null)
  const u = (k, v) => setForm((p) => ({ ...p, [k]: v }))
  const calc = async () => {
    setLoading(true)
    try {
      const r = await authFetch('/api/calculate/two-way-slab', { method: 'POST', body: JSON.stringify({
        length: parseFloat(form.length), width: parseFloat(form.width),
        liveLoad: parseFloat(form.liveLoad), floorFinish: parseFloat(form.floorFinish),
        grade: form.grade, steelGrade: form.steelGrade,
      })})
      const d = await r.json()
      if (!r.ok) throw new Error(d.error || 'Failed')
      setResult(d.result); setCalculationId(d.calculationId)
      toast.success('Design completed')
    } catch (e) { toast.error(e.message) } finally { setLoading(false) }
  }
  return (
    <CalcShell icon={Grid3x3} title="Two-Way Slab Design" subtitle="Simply-supported two-way RCC slab (IS 456 Annex D, Table 27)">
      <div className="grid lg:grid-cols-5 gap-6">
        <Card className="lg:col-span-2 bg-slate-900/50 border-slate-800 p-6 h-fit">
          <h2 className="text-lg font-semibold text-white mb-1">Inputs</h2>
          <p className="text-xs text-slate-500 mb-5">Spans in m, loads in kN/m²</p>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <NumField label="Long span (Ly)" id="length" value={form.length} onChange={(v) => u('length', v)} unit="m" step="0.1" />
              <NumField label="Short span (Lx)" id="width" value={form.width} onChange={(v) => u('width', v)} unit="m" step="0.1" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <NumField label="Live load" id="liveLoad" value={form.liveLoad} onChange={(v) => u('liveLoad', v)} unit="kN/m²" step="0.1" />
              <NumField label="Floor finish" id="floorFinish" value={form.floorFinish} onChange={(v) => u('floorFinish', v)} unit="kN/m²" step="0.1" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <SelField label="Concrete grade" value={form.grade} onChange={(v) => u('grade', v)} options={M_GRADES} />
              <SelField label="Steel grade" value={form.steelGrade} onChange={(v) => u('steelGrade', v)} options={FE_GRADES} />
            </div>
            <RunButton loading={loading} onClick={calc} />
          </div>
        </Card>
        <div className="lg:col-span-3 space-y-4">
          {!result && <EmptyResult icon={Grid3x3} />}
          {result && (
            <ResultsMotion initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <SafetyBanner safe={result.isDesignSafe} subtitle={`${result.design.type} · ${result.design.slabThickness}mm`} />
              <div className="flex justify-end"><DownloadPDFButton type="two-way-slab" inputs={form} result={result} calculationId={calculationId} /></div>
              <div className="grid sm:grid-cols-2 gap-4">
                <ResultBlock title="Geometry">
                  <Row k="Slab thickness" v={`${result.design.slabThickness} mm`} highlight />
                  <Row k="d (short span)" v={`${result.design.effectiveDepthX} mm`} />
                  <Row k="d (long span)" v={`${result.design.effectiveDepthY} mm`} />
                  <Row k="Ly/Lx" v={result.design.lyByLx} />
                </ResultBlock>
                <ResultBlock title="Loading">
                  <Row k="Self weight" v={`${result.loads.selfWeight} kN/m²`} />
                  <Row k="Total load" v={`${result.loads.totalLoad} kN/m²`} />
                  <Row k="Factored load" v={`${result.loads.factoredLoad} kN/m²`} highlight />
                </ResultBlock>
                <ResultBlock title="Moments (per m)">
                  <Row k="αx · αy" v={`${result.moments.coefficientAx} / ${result.moments.coefficientAy}`} />
                  <Row k="Mux (short)" v={`${result.moments.shortSpanMoment} kNm/m`} highlight />
                  <Row k="Muy (long)" v={`${result.moments.longSpanMoment} kNm/m`} />
                </ResultBlock>
                <ResultBlock title="Reinforcement">
                  <Row k="Short span bars" v={result.reinforcement.shortSpanSpec} highlight />
                  <Row k="Long span bars" v={result.reinforcement.longSpanSpec} highlight />
                  <Row k="Ast (short)" v={`${result.reinforcement.shortSpanProvided} mm²/m`} />
                  <Row k="Ast (long)" v={`${result.reinforcement.longSpanProvided} mm²/m`} />
                </ResultBlock>
              </div>
            </ResultsMotion>
          )}
        </div>
      </div>
    </CalcShell>
  )
}
