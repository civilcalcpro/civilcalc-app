'use client'

import { useState } from 'react'
import { Building2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { useAuth } from '@/lib/auth-context'
import { toast } from 'sonner'
import {
  CalcShell, NumField, SelField, RunButton, EmptyResult, SafetyBanner,
  ResultBlock, Row, DownloadPDFButton, ResultsMotion, M_GRADES, FE_GRADES,
} from '@/components/calc-shell'

export default function ColumnDesignPage() {
  const { authFetch } = useAuth()
  const [form, setForm] = useState({ width: 300, depth: 300, height: 3, axialLoad: 600, grade: 'M25', steelGrade: 'Fe500' })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [calculationId, setCalculationId] = useState(null)

  const u = (k, v) => setForm((p) => ({ ...p, [k]: v }))

  const calculate = async () => {
    setLoading(true)
    try {
      const payload = {
        width: parseFloat(form.width),
        depth: parseFloat(form.depth),
        height: parseFloat(form.height),
        axialLoad: parseFloat(form.axialLoad),
        grade: form.grade,
        steelGrade: form.steelGrade,
      }
      const r = await authFetch('/api/calculate/column', { method: 'POST', body: JSON.stringify(payload) })
      const data = await r.json()
      if (!r.ok) throw new Error(data.error || 'Failed')
      setResult(data.result)
      setCalculationId(data.calculationId)
      toast.success('Design completed')
    } catch (e) { toast.error(e.message) } finally { setLoading(false) }
  }

  return (
    <CalcShell icon={Building2} title="Column Design" subtitle="Axially loaded rectangular RCC column — IS 456:2000">
      <div className="grid lg:grid-cols-5 gap-6">
        <Card className="lg:col-span-2 bg-slate-900/50 border-slate-800 p-6 h-fit">
          <h2 className="text-lg font-semibold text-white mb-1">Inputs</h2>
          <p className="text-xs text-slate-500 mb-5">Width/depth in mm, height in m, axial load in kN</p>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <NumField label="Width b" id="width" value={form.width} onChange={(v) => u('width', v)} unit="mm" />
              <NumField label="Depth D" id="depth" value={form.depth} onChange={(v) => u('depth', v)} unit="mm" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <NumField label="Unsupported height" id="height" value={form.height} onChange={(v) => u('height', v)} unit="m" step="0.1" />
              <NumField label="Axial load Pu" id="axialLoad" value={form.axialLoad} onChange={(v) => u('axialLoad', v)} unit="kN" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <SelField label="Concrete grade" value={form.grade} onChange={(v) => u('grade', v)} options={M_GRADES} />
              <SelField label="Steel grade" value={form.steelGrade} onChange={(v) => u('steelGrade', v)} options={FE_GRADES} />
            </div>
            <RunButton loading={loading} onClick={calculate} />
          </div>
        </Card>

        <div className="lg:col-span-3 space-y-4">
          {!result && <EmptyResult icon={Building2} />}
          {result && (
            <ResultsMotion initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <SafetyBanner safe={result.isDesignSafe} subtitle={`${result.design.columnType} · ${result.design.columnSize}`} />
              <div className="flex justify-end">
                <DownloadPDFButton type="column" inputs={form} result={result} calculationId={calculationId} />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <ResultBlock title="Geometry">
                  <Row k="Column size" v={result.design.columnSize} />
                  <Row k="Height" v={`${result.design.height} m`} />
                  <Row k="Effective length" v={`${result.design.effectiveLength} m`} />
                  <Row k="Slenderness ratio" v={result.design.slendernessRatio} />
                  <Row k="Type" v={result.design.columnType} />
                </ResultBlock>
                <ResultBlock title="Loading">
                  <Row k="Applied load Pu" v={`${(result.loading.appliedLoad / 1000).toFixed(2)} kN`} highlight />
                  <Row k="Section capacity" v={`${result.loading.capacity} kN`} />
                  <Row k="Load safe" v={result.loading.loadSafe ? 'Yes' : 'No'} />
                </ResultBlock>
                <ResultBlock title="Reinforcement" className="sm:col-span-2">
                  <div className="grid sm:grid-cols-2 gap-x-6">
                    <div>
                      <Row k="Required % steel" v={`${result.steel.requiredPercentage} %`} />
                      <Row k="Provided % steel" v={`${result.steel.providedPercentage} %`} />
                      <Row k="Required area" v={`${result.steel.requiredArea} mm²`} />
                    </div>
                    <div>
                      <Row k="Provided area" v={`${result.steel.providedArea} mm²`} />
                      <Row k="Main bars" v={result.steel.reinforcement} highlight />
                      <Row k="Ties" v={result.ties.specification} />
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
