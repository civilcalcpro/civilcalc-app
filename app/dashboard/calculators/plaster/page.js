'use client'

import { useState } from 'react'
import { Paintbrush } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { toast } from 'sonner'
import {
  CalcShell,
  NumField,
  SelField,
  RunButton,
  EmptyResult,
  ResultBlock,
  Row,
  DownloadPDFButton,
  ResultsMotion,
} from '@/components/calc-shell'

export default function PlasterPage() {
  const [form, setForm] = useState({
    length: 4,
    height: 3,
    walls: 1,
    thickness: 12,
    mortarRatio: '1:6',
    sides: 1,
    doorArea: 0,
    windowArea: 0,
    wastage: 5,
    cementRate: 400,
    sandRate: 45,
    labourRate: 80,
    unitSystem: 'metric',
  })

  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [calculationId, setCalculationId] = useState(null)

  const u = (k, v) => setForm((p) => ({ ...p, [k]: v }))

  const n = (v) => {
    const x = parseFloat(v)
    return Number.isFinite(x) ? x : 0
  }

  const round = (v, d = 2) => Number(v || 0).toFixed(d)
  const ftToM = (ft) => ft * 0.3048
const m2ToFt2 = (m2) => m2 * 10.7639
const m3ToFt3 = (m3) => m3 * 35.3147

  const calc = () => {
    setLoading(true)

    try {
      let length = n(form.length)
let height = n(form.height)

if (form.unitSystem === 'imperial') {
  length = ftToM(length)
  height = ftToM(height)
}
      const walls = n(form.walls)
      const sides = n(form.sides)
      const thickness = n(form.thickness)
      let doorArea = n(form.doorArea)
let windowArea = n(form.windowArea)

if (form.unitSystem === 'imperial') {
  doorArea = doorArea / 10.7639
  windowArea = windowArea / 10.7639
}
      const wastage = n(form.wastage)

      if (length <= 0 || height <= 0 || walls <= 0 || sides <= 0 || thickness <= 0) {
        throw new Error('Please enter valid wall dimensions')
      }

      const grossArea = length * height * walls * sides
      const deductionArea = doorArea + windowArea
      const netArea = Math.max(grossArea - deductionArea, 0)

      if (netArea <= 0) {
        throw new Error('Net plaster area must be greater than 0')
      }

      const thicknessM = thickness / 1000
      const wetVolume = netArea * thicknessM
      const dryVolume = wetVolume * 1.33
      const dryVolumeWithWastage = dryVolume * (1 + wastage / 100)

      const [cementPart, sandPart] = form.mortarRatio.split(':').map(Number)
      const totalPart = cementPart + sandPart

      const cementVolume = dryVolumeWithWastage * (cementPart / totalPart)
      const sandVolume = dryVolumeWithWastage * (sandPart / totalPart)

      const cementKg = cementVolume * 1440
      const cementBags = cementKg / 50
      const sandCft = sandVolume * 35.3147

      const cementCost = cementBags * n(form.cementRate)
      const sandCost = sandCft * n(form.sandRate)
      const labourCost = netArea * n(form.labourRate)
      const totalCost = cementCost + sandCost + labourCost

      const finalResult = {
        inputs: {
          area: round(netArea),
          grossArea: round(grossArea),
          deductionArea: round(deductionArea),
          netArea: round(netArea),
          thickness: round(thickness, 0),
          sides,
          walls,
          mortarMix: form.mortarRatio,
          wastage: round(wastage, 0),
        },
        area: {
          gross: round(grossArea),
          deduction: round(deductionArea),
          net: round(netArea),
        },
        volume: {
          wetVolume: round(wetVolume),
          dryVolume: round(dryVolume),
          dryVolumeWithWastage: round(dryVolumeWithWastage),
        },
        cement: {
          bags: round(cementBags),
          kg: round(cementKg),
          cost: round(cementCost),
        },
        sand: {
          cum: round(sandVolume),
          cft: round(sandCft),
          cost: round(sandCost),
        },
        cost: {
          cementCost: round(cementCost),
          sandCost: round(sandCost),
          labourCost: round(labourCost),
          totalCost: round(totalCost),
        },
      }

      setResult(finalResult)
      setCalculationId(null)
      toast.success('Calculated')
    } catch (e) {
      toast.error(e.message || 'Calculation failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <CalcShell
      icon={Paintbrush}
      title="Plaster Work"
      subtitle="Cement-sand plaster material, area, deduction and cost estimation"
      code="Standard practice"
    >
      <div className="grid lg:grid-cols-5 gap-6">
        <Card className="lg:col-span-2 bg-slate-900/50 border-slate-800 p-6 h-fit">
          <h2 className="text-lg font-semibold text-white mb-1">Inputs</h2>
          <p className="text-xs text-slate-500 mb-5">
            Wall dimensions in metres, thickness in mm
          </p>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <NumField
                label="Wall length"
                id="length"
                value={form.length}
                onChange={(v) => u('length', v)}
                unit={form.unitSystem === 'imperial' ? 'ft' : 'm'}
                step="0.1"
              />

              <NumField
                label="Wall height"
                id="height"
                value={form.height}
                onChange={(v) => u('height', v)}
                unit={form.unitSystem === 'imperial' ? 'ft' : 'm'}
                step="0.1"
              />
            </div>
<SelField
  label="Unit System"
  value={form.unitSystem}
  onChange={(v) => u('unitSystem', v)}
  options={['metric', 'imperial']}
/>
            <div className="grid grid-cols-2 gap-3">
              <NumField
                label="No. of walls"
                id="walls"
                value={form.walls}
                onChange={(v) => u('walls', v)}
                unit="nos"
                step="1"
              />

              <SelField
                label="Sides"
                value={String(form.sides)}
                onChange={(v) => u('sides', v)}
                options={['1', '2']}
              />
            </div>

            <NumField
              label="Plaster thickness"
              id="thickness"
              value={form.thickness}
              onChange={(v) => u('thickness', v)}
              unit={form.unitSystem === 'imperial' ? 'mm' : 'in'}
              step="1"
            />

            <SelField
              label="Mortar ratio (C : S)"
              value={form.mortarRatio}
              onChange={(v) => u('mortarRatio', v)}
              options={['1:3', '1:4', '1:5', '1:6']}
            />

            <div className="grid grid-cols-2 gap-3">
              <NumField
                label="Door area"
                id="doorArea"
                value={form.doorArea}
                onChange={(v) => u('doorArea', v)}
                unit={form.unitSystem === 'imperial' ? 'ft²' : 'm²'}
                step="0.1"
              />

              <NumField
                label="Window area"
                id="windowArea"
                value={form.windowArea}
                onChange={(v) => u('windowArea', v)}
                unit="m²"
                step="0.1"
              />
            </div>

            <NumField
              label="Wastage"
              id="wastage"
              value={form.wastage}
              onChange={(v) => u('wastage', v)}
              unit="%"
              step="1"
            />

            <div className="border-t border-slate-800 pt-4">
              <h3 className="text-sm font-semibold text-white mb-3">
                Cost Estimation
              </h3>

              <div className="grid grid-cols-1 gap-3">
                <NumField
                  label="Cement rate"
                  id="cementRate"
                  value={form.cementRate}
                  onChange={(v) => u('cementRate', v)}
                  unit="₹/bag"
                  step="1"
                />

                <NumField
                  label="Sand rate"
                  id="sandRate"
                  value={form.sandRate}
                  onChange={(v) => u('sandRate', v)}
                  unit="₹/cft"
                  step="1"
                />

                <NumField
                  label="Labour rate"
                  id="labourRate"
                  value={form.labourRate}
                  onChange={(v) => u('labourRate', v)}
                  unit="₹/m²"
                  step="1"
                />
              </div>
            </div>

            <RunButton loading={loading} onClick={calc} label="Calculate" />
          </div>
        </Card>

        <div className="lg:col-span-3 space-y-4">
          {!result && <EmptyResult icon={Paintbrush} />}

          {result && (
            <ResultsMotion
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex justify-end">
                <DownloadPDFButton
                  type="plaster"
                  inputs={form}
                  result={result}
                  calculationId={calculationId}
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <ResultBlock title="Area Summary">
                  <Row
  k="Gross Area"
  v={
    form.unitSystem === 'imperial'
      ? `${m2ToFt2(Number(result.area.gross)).toFixed(2)} ft²`
      : `${result.area.gross} m²`
  }
/>

<Row
  k="Deductions"
  v={
    form.unitSystem === 'imperial'
      ? `${m2ToFt2(Number(result.area.deduction)).toFixed(2)} ft²`
      : `${result.area.deduction} m²`
  }
/>

<Row
  k="Net Plaster Area"
  v={
    form.unitSystem === 'imperial'
      ? `${m2ToFt2(Number(result.area.net)).toFixed(2)} ft²`
      : `${result.area.net} m²`
  }
  highlight
/>
                  <Row k="Sides plastered" v={result.inputs.sides} />
                </ResultBlock>

                <ResultBlock title="Volume">
                 <Row
  k="Wet volume"
  v={
    form.unitSystem === 'imperial'
      ? `${m3ToFt3(Number(result.volume.wetVolume)).toFixed(2)} ft³`
      : `${result.volume.wetVolume} m³`
  }
/>

<Row
  k="Dry volume"
  v={
    form.unitSystem === 'imperial'
      ? `${m3ToFt3(Number(result.volume.dryVolume)).toFixed(2)} ft³`
      : `${result.volume.dryVolume} m³`
  }
/>

<Row
  k="Dry volume with wastage"
  v={
    form.unitSystem === 'imperial'
      ? `${m3ToFt3(Number(result.volume.dryVolumeWithWastage)).toFixed(2)} ft³`
      : `${result.volume.dryVolumeWithWastage} m³`
  }
  highlight
/>
                </ResultBlock>

                <ResultBlock title="Cement">
                  <Row k="Bags (50 kg)" v={`${result.cement.bags} bags`} highlight />
                  <Row k="Weight" v={`${result.cement.kg} kg`} />
                  <Row k="Cost" v={`₹${result.cement.cost}`} />
                </ResultBlock>

                <ResultBlock title="Sand">
                  <Row
  k="Volume"
  v={
    form.unitSystem === 'imperial'
      ? `${result.sand.cft} cft`
      : `${result.sand.cum} m³`
  }
  highlight
/>
                  <Row k="Cost" v={`₹${result.sand.cost}`} />
                </ResultBlock>

                <ResultBlock title="Cost Estimate">
                  <Row k="Cement Cost" v={`₹${result.cost.cementCost}`} />
                  <Row k="Sand Cost" v={`₹${result.cost.sandCost}`} />
                  <Row k="Labour Cost" v={`₹${result.cost.labourCost}`} />
                  <Row k="Total Cost" v={`₹${result.cost.totalCost}`} highlight />
                </ResultBlock>

                <ResultBlock title="Formula Used">
                  <Row k="Gross Area" v="Length × Height × Walls × Sides" />
                  <Row k="Net Area" v="Gross Area - Door/Window Deductions" />
                  <Row k="Wet Volume" v="Net Area × Thickness" />
                  <Row k="Dry Volume" v="Wet Volume × 1.33" />
                  <Row k="Cement Bags" v="(Cement Volume × 1440) / 50" />
                </ResultBlock>
              </div>
            </ResultsMotion>
          )}
        </div>
      </div>
    </CalcShell>
  )
}
