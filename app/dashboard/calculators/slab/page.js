'use client'

import { useState } from 'react'
import { HardHat } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { useAuth } from '@/lib/auth-context'
import { toast } from 'sonner'
import {
  CalcShell, NumField, SelField, RunButton, EmptyResult, SafetyBanner,
  ResultBlock, Row, DownloadPDFButton, ResultsMotion, M_GRADES, FE_GRADES,
} from '@/components/calc-shell'

export default function SlabDesignPage() {
  const { authFetch } = useAuth()
  const [form, setForm] = useState({ length: 4, width: 3, liveLoad: 3, floorFinish: 1, grade: 'M20', steelGrade: 'Fe415' })
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
        liveLoad: parseFloat(form.liveLoad),
        floorFinish: parseFloat(form.floorFinish),
        grade: form.grade,
        steelGrade: form.steelGrade,
      }
      const r = await authFetch('/api/calculate/slab', { method: 'POST', body: JSON.stringify(payload) })
      const data = await r.json()
      if (!r.ok) throw new Error(data.error || 'Failed')
      setResult(data.result)
      setCalculationId(data.calculationId)
      toast.success('Slab design completed')
    } catch (e) { toast.error(e.message) } finally { setLoading(false) }
  }

  return (
    <CalcShell icon={HardHat} title="One-Way Slab Design" subtitle="Simply-supported one-way RCC slab per IS 456:2000">
      <div className="grid lg:grid-cols-5 gap-6">
        <Card className="lg:col-span-2 bg-slate-900/50 border-slate-800 p-6 h-fit">
          <h2 className="text-lg font-semibold text-white mb-1">Inputs</h2>
          <p className="text-xs text-slate-500 mb-5">Lengths in m, loads in kN/m²</p>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <NumField label="Length" id="length" value={form.length} onChange={(v) => u('length', v)} unit="m" step="0.1" />
              <NumField label="Width" id="width" value={form.width} onChange={(v) => u('width', v)} unit="m" step="0.1" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <NumField label="Live load" id="liveLoad" value={form.liveLoad} onChange={(v) => u('liveLoad', v)} unit="kN/m²" step="0.1" />
              <NumField label="Floor finish" id="floorFinish" value={form.floorFinish} onChange={(v) => u('floorFinish', v)} unit="kN/m²" step="0.1" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <SelField label="Concrete grade" value={form.grade} onChange={(v) => u('grade', v)} options={M_GRADES} />
              <SelField label="Steel grade" value={form.steelGrade} onChange={(v) => u('steelGrade', v)} options={FE_GRADES} />
            </div>
            <RunButton loading={loading} onClick={calculate} />
          </div>
        </Card>

        <div className="lg:col-span-3 space-y-4">
          {!result && <EmptyResult icon={HardHat} />}
          {result && (
            <ResultsMotion initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <SafetyBanner safe={result.isDesignSafe} subtitle={`Slab ${result.design.slabThickness}mm · Span ${result.design.effectiveSpan}m`} />
              <div className="flex justify-end">
                <DownloadPDFButton type="one-way-slab" inputs={form} result={result} calculationId={calculationId} />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <ResultBlock title="Geometry">
                  <Row k="Slab thickness" v={`${result.design.slabThickness} mm`} highlight />
                  <Row k="Effective depth" v={`${result.design.effectiveDepth} mm`} />
                  <Row k="Effective span" v={`${result.design.effectiveSpan} m`} />
                </ResultBlock>
                <ResultBlock title="Loading">
                  <Row k="Self weight" v={`${result.loads.selfWeight} kN/m²`} />
                  <Row k="Dead load" v={`${result.loads.deadLoad} kN/m²`} />
                  <Row k="Live load" v={`${result.loads.liveLoad} kN/m²`} />
                  <Row k="Factored load" v={`${result.loads.factoredLoad} kN/m²`} highlight />
                </ResultBlock>
                <ResultBlock title="Bending">
                  <Row k="Bending moment" v={`${result.moment.bendingMoment} kNm/m`} />
                  <Row k="Limiting moment" v={`${result.moment.limitingMoment} kNm/m`} />
                </ResultBlock>
                <ResultBlock title="Reinforcement">
                  <Row k="Required Ast" v={`${result.steel.requiredAst} mm²/m`} />
                  <Row k="Provided Ast" v={`${result.steel.providedAst} mm²/m`} />
                  <Row k="Main steel" v={result.steel.mainSteel} highlight />
                  <Row k="Distribution" v={result.steel.distributionSteel} />
                </ResultBlock>
                <ResultBlock title="Shear Check" className="sm:col-span-2">
                  <div className="grid sm:grid-cols-2 gap-x-6">
                    <div>
                      <Row k="Shear force" v={`${result.shear.shearForce} kN/m`} />
                      <Row k="Nominal shear" v={`${result.shear.nominalShear} N/mm²`} />
                    </div>
                    <div>
                      <Row k="Permissible τc" v={`${result.shear.permissibleShear} N/mm²`} />
                      <Row k="Safe in shear" v={result.shear.safe ? 'Yes' : 'No'} />
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
