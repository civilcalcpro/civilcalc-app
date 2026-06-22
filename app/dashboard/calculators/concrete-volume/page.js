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

  cementRate: 420,
  sandRate: 1800,
  aggregateRate: 1400,

  supplyType: 'site',
  concreteType: 'Slab',
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
  <NumField
  label="Wastage"
  id="wastage"
  value={form.wastage}
  onChange={(v) => u('wastage', v)}
  unit="%"
/>

<NumField
  label="Cement Rate"
  id="cementRate"
  value={form.cementRate}
  onChange={(v) => u('cementRate', v)}
  unit="₹/bag"
/>

<NumField
  label="Sand Rate"
  id="sandRate"
  value={form.sandRate}
  onChange={(v) => u('sandRate', v)}
  unit="₹/m³"
/>

<NumField
  label="Aggregate Rate"
  id="aggregateRate"
  value={form.aggregateRate}
  onChange={(v) => u('aggregateRate', v)}
  unit="₹/m³"
/>

<SelField
  label="Supply Type"
  value={form.supplyType}
  onChange={(v) => u('supplyType', v)}
  options={[
    'site',
    'rmc',
  ]}
/>
    <SelField
  label="Concrete Type"
  value={form.concreteType}
  onChange={(v) => u('concreteType', v)}
  options={[
    'Slab',
    'Beam',
    'Column',
    'Footing',
    'PCC',
    'Custom',
  ]}
/>
  
            <RunButton 
    loading={loading} onClick={calculate} label="Calculate" />
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
      <ResultBlock title="Recommendation">
  <Row
    k="Concrete Type"
    v={form.concreteType}
  />

  <Row
    k="Recommended Grade"
    v={
      form.concreteType === 'PCC'
        ? 'M10'
        : form.concreteType === 'Slab'
        ? 'M20'
        : form.concreteType === 'Beam'
        ? 'M25'
        : form.concreteType === 'Column'
        ? 'M25'
        : form.concreteType === 'Footing'
        ? 'M20'
        : 'User Choice'
    }
    highlight
  />
</ResultBlock>
                title="Volume">
  <Row
    k="Wet volume"
    v={
      isImperial
        ? `${m3ToFt3(result.wetVolume)} ft³`
        : `${result.wetVolume} m³`
    }
  />

  <Row
    k="Dry volume (×1.54)"
    v={
      isImperial
        ? `${m3ToFt3(result.dryVolume)} ft³`
        : `${result.dryVolume} m³`
    }
    highlight
  />
</ResultBlock>

<ResultBlock title="Cement">
  <Row k="Bags (50 kg)" v={`${result.cement.bags} bags`} highlight />

  <Row
    k="Weight"
    v={
      isImperial
        ? `${kgToLb(result.cement.kg)} lb`
        : `${result.cement.kg} kg`
    }
  />

  <Row
    k="Volume"
    v={
      isImperial
        ? `${m3ToFt3(result.cement.cum)} ft³`
        : `${result.cement.cum} m³`
    }
  />
</ResultBlock>

<ResultBlock title="Sand (Fine Aggregate)">
  <Row
    k="Volume"
    v={
      isImperial
        ? `${m3ToFt3(result.sand.cum)} ft³`
        : `${result.sand.cum} m³`
    }
    highlight
  />

</ResultBlock>

<ResultBlock title="Coarse Aggregate">
  <Row
    k="Volume"
    v={
      isImperial
        ? `${m3ToFt3(result.aggregate.cum)} ft³`
        : `${result.aggregate.cum} m³`
    }
    highlight
  />

</ResultBlock>

<ResultBlock title="Water" className="sm:col-span-2">
  <Row
    k="Water required"
    v={
      isImperial
        ? `${litreToGal(result.water.litres)} gallons`
        : `${result.water.litres} litres`
    }
    highlight
  />
</ResultBlock>
      <ResultBlock title="Order Summary" className="sm:col-span-2">
  <Row
    k="Concrete Required"
    v={
      isImperial
        ? `${m3ToFt3(result.wetVolume)} ft³`
        : `${result.wetVolume} m³`
    }
  />
    <ResultBlock title="Material Cost" className="sm:col-span-2">
  <Row
    k="Cement Cost"
    v={`₹ ${(
      Number(result.cement.bags) *
      Number(form.cementRate)
    ).toFixed(0)}`}
  />

  <Row
    k="Sand Cost"
    v={`₹ ${(
      Number(result.sand.cum) *
      Number(form.sandRate)
    ).toFixed(0)}`}
  />

  <Row
    k="Aggregate Cost"
    v={`₹ ${(
      Number(result.aggregate.cum) *
      Number(form.aggregateRate)
    ).toFixed(0)}`}
  />

  <Row
    k="Total Material Cost"
    v={`₹ ${(
      Number(result.cement.bags) *
      Number(form.cementRate) +
      Number(result.sand.cum) *
      Number(form.sandRate) +
      Number(result.aggregate.cum) *
      Number(form.aggregateRate)
    ).toFixed(0)}`}
    highlight
  />
</ResultBlock>

  <Row
    k="Wastage"
    v={`${form.wastage || 5}%`}
  />

  <Row
    k="Final Quantity"
    v={
      isImperial
        ? `${m3ToFt3(
            parseFloat(result.wetVolume) *
            (1 + (form.wastage || 5) / 100)
          )} ft³`
        : `${(
            parseFloat(result.wetVolume) *
            (1 + (form.wastage || 5) / 100)
          ).toFixed(2)} m³`
    }
    highlight
  />
</ResultBlock>
      {form.supplyType === 'rmc' && (
  <ResultBlock title="RMC Order">
    <Row
      k="Recommended Order"
      v={`${(
        parseFloat(result.wetVolume) *
        (1 + form.wastage / 100)
      ).toFixed(2)} m³`}
      highlight
    />

    <Row
      k="Note"
      v="Includes wastage allowance for site conditions"
    />
  </ResultBlock>
)}
              </div>
            </ResultsMotion>
          )}
        </div>
      </div>
    </CalcShell>
  )
}
const m3ToFt3 = (m3) =>
  (parseFloat(m3) * 35.3147).toFixed(2)

const kgToLb = (kg) =>
  (parseFloat(kg) * 2.20462).toFixed(2)

const litreToGal = (litre) =>
  (parseFloat(litre) * 0.264172).toFixed(2)
