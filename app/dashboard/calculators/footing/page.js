'use client'
import { useState } from 'react'
import { Anchor } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { useAuth } from '@/lib/auth-context'
import { toast } from 'sonner'
import {
  CalcShell, NumField, SelField, RunButton, EmptyResult, SafetyBanner,
  ResultBlock, Row, DownloadPDFButton, ResultsMotion, M_GRADES, FE_GRADES,
} from '@/components/calc-shell'

export default function FootingDesignPage() {
  const { authFetch } = useAuth()
  const [form, setForm] = useState({ columnLoad: 1500, sbc: 200, columnSize: 400, grade: 'M25', steelGrade: 'Fe500' })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [calculationId, setCalculationId] = useState(null)
  const u = (k, v) => setForm((p) => ({ ...p, [k]: v }))
  const calc = async () => {
    setLoading(true)
    try {
      const r = await authFetch('/api/calculate/footing', { method: 'POST', body: JSON.stringify({
        columnLoad: parseFloat(form.columnLoad), sbc: parseFloat(form.sbc),
        columnSize: parseFloat(form.columnSize), grade: form.grade, steelGrade: form.steelGrade,
      })})
      const d = await r.json()
      if (!r.ok) throw new Error(d.error || 'Failed')
      setResult(d.result); setCalculationId(d.calculationId)
      toast.success('Design completed')
    } catch (e) { toast.error(e.message) } finally { setLoading(false) }
  }
  return (
    <CalcShell icon={Anchor} title="Isolated Footing Design" subtitle="Square footing under axial load (IS 456 Cl. 34)">
      <div className="grid lg:grid-cols-5 gap-6">
        <Card className="lg:col-span-2 bg-slate-900/50 border-slate-800 p-6 h-fit">
          <h2 className="text-lg font-semibold text-white mb-1">Inputs</h2>
          <p className="text-xs text-slate-500 mb-5">Loads in kN, SBC in kN/m²</p>
          <div className="space-y-4">
            <NumField label="Factored column load" id="columnLoad" value={form.columnLoad} onChange={(v) => u('columnLoad', v)} unit="kN" />
            <NumField label="Safe bearing capacity (SBC)" id="sbc" value={form.sbc} onChange={(v) => u('sbc', v)} unit="kN/m²" />
            <NumField label="Column size (square)" id="columnSize" value={form.columnSize} onChange={(v) => u('columnSize', v)} unit="mm" />
            <div className="grid grid-cols-2 gap-3">
              <SelField label="Concrete grade" value={form.grade} onChange={(v) => u('grade', v)} options={M_GRADES} />
              <SelField label="Steel grade" value={form.steelGrade} onChange={(v) => u('steelGrade', v)} options={FE_GRADES} />
            </div>
            <RunButton loading={loading} onClick={calc} />
          </div>
        </Card>
        <div className="lg:col-span-3 space-y-4">
          {!result && <EmptyResult icon={Anchor} />}
          {result && (
            <ResultsMotion initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <SafetyBanner safe={result.isDesignSafe} subtitle={`${result.design.footingSize} · ${result.design.footingDepth}mm thick`} />
              <div className="flex justify-end"><DownloadPDFButton type="footing" inputs={form} result={result} calculationId={calculationId} /></div>
              <div className="grid sm:grid-cols-2 gap-4">
                <ResultBlock title="Footing Geometry">
                  <Row k="Footing size" v={result.design.footingSize} highlight />
                  <Row k="Footing depth (D)" v={`${result.design.footingDepth} mm`} />
                  <Row k="Effective depth (d)" v={`${result.design.effectiveDepth} mm`} />
                  <Row k="Column size" v={result.design.columnSize} />
                </ResultBlock>
                <ResultBlock title="Bearing Check">
                  <Row k="Applied load" v={`${result.bearing.appliedLoad} kN`} />
                  <Row k="Required area" v={`${result.bearing.requiredArea} m²`} />
                  <Row k="Provided area" v={`${result.bearing.providedArea} m²`} />
                  <Row k="Bearing pressure" v={`${result.bearing.bearingPressure} kN/m²`} highlight />
                  <Row k="SBC" v={`${result.bearing.sbc} kN/m²`} />
                  <Row k="Safe" v={result.bearing.safe ? 'Yes' : 'No'} />
                </ResultBlock>
                <ResultBlock title="Bending">
                  <Row k="Cantilever projection" v={`${result.bending.cantileverProjection} mm`} />
                  <Row k="Net upward pressure" v={`${result.bending.netUpwardPressure} kN/m²`} />
                  <Row k="Bending moment" v={`${result.bending.bendingMoment} kNm/m`} />
                </ResultBlock>
                <ResultBlock title="Reinforcement">
                  <Row k="Required Ast" v={`${result.reinforcement.requiredAst} mm²/m`} />
                  <Row k="Bar diameter" v={`${result.reinforcement.barDiameter} mm`} />
                  <Row k="Steel layout" v={result.reinforcement.specification} highlight />
                  <Row k="Approx steel" v={`${result.reinforcement.steelWeight} kg`} />
                </ResultBlock>
              </div>
            </ResultsMotion>
          )}
        </div>
      </div>
    </CalcShell>
  )
}
