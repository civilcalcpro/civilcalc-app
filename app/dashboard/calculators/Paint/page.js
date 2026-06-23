'use client'

import { useState } from 'react'
import { Paintbrush, Ruler, IndianRupee, Layers, Boxes } from 'lucide-react'
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

const SQM_TO_SQFT = 10.7639
const SQFT_TO_SQM = 1 / SQM_TO_SQFT

function n2(v) {
  return Number(v || 0).toFixed(2)
}

function money(v) {
  return `Rs. ${Number(v || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`
}

function KpiCard({ icon: Icon, title, value, sub }) {
  return (
    <Card className="bg-slate-900/70 border-slate-800 p-4">
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-orange-500/10 p-2 text-orange-400">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs text-slate-400">{title}</p>
          <p className="text-xl font-bold text-white">{value}</p>
          {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
        </div>
      </div>
    </Card>
  )
}

export default function PaintCalculatorPage() {
  const [form, setForm] = useState({
    unitSystem: 'metric',
    paintType: 'Interior Wall / अंदर की दीवार',
    length: 10,
    height: 3,
    walls: 4,
    deductionArea: 4,
    coats: 2,
    paintCoverage: 10,
    primerCoverage: 12,
    puttyCoverage: 1.5,
    paintRate: 250,
    primerRate: 180,
    puttyRate: 35,
    labourRate: 20,
  })

  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [calculationId, setCalculationId] = useState(null)

  const u = (k, v) => setForm((p) => ({ ...p, [k]: v }))

  const unit = form.unitSystem === 'imperial' ? 'ft' : 'm'
  const areaUnit = form.unitSystem === 'imperial' ? 'sq.ft' : 'sq.m'

  const calc = () => {
    setLoading(true)

    try {
      const length = parseFloat(form.length) || 0
      const height = parseFloat(form.height) || 0
      const walls = parseFloat(form.walls) || 1
      const deductionArea = parseFloat(form.deductionArea) || 0
      const coats = parseFloat(form.coats) || 1

      const paintCoverage = parseFloat(form.paintCoverage) || 1
      const primerCoverage = parseFloat(form.primerCoverage) || 1
      const puttyCoverage = parseFloat(form.puttyCoverage) || 1

      const paintRate = parseFloat(form.paintRate) || 0
      const primerRate = parseFloat(form.primerRate) || 0
      const puttyRate = parseFloat(form.puttyRate) || 0
      const labourRate = parseFloat(form.labourRate) || 0

      const grossArea = length * height * walls
      const netArea = Math.max(grossArea - deductionArea, 0)

      const netAreaSqM =
        form.unitSystem === 'imperial' ? netArea * SQFT_TO_SQM : netArea

      const paintLitres = Math.ceil((netAreaSqM * coats) / paintCoverage)
      const primerLitres = Math.ceil(netAreaSqM / primerCoverage)
      const puttyKg = Math.ceil(netAreaSqM * puttyCoverage)

      const paintCost = paintLitres * paintRate
      const primerCost = primerLitres * primerRate
      const puttyCost = puttyKg * puttyRate
      const labourCost = netArea * labourRate
      const totalCost = paintCost + primerCost + puttyCost + labourCost

      setResult({
        input: {
          paintType: form.paintType.split('/')[0].trim(),
          unitSystem: form.unitSystem,
          length: `${length} ${unit}`,
          height: `${height} ${unit}`,
          walls,
          coats,
        },
        area: {
          grossArea: `${n2(grossArea)} ${areaUnit}`,
          deductionArea: `${n2(deductionArea)} ${areaUnit}`,
          netPaintArea: `${n2(netArea)} ${areaUnit}`,
          netAreaSqM: `${n2(netAreaSqM)} sq.m`,
          netAreaSqFt: `${n2(netAreaSqM * SQM_TO_SQFT)} sq.ft`,
        },
        material: {
          paintRequired: `${paintLitres} Litres`,
          primerRequired: `${primerLitres} Litres`,
          puttyRequired: `${puttyKg} Kg`,
        },
        cost: {
          paintCost: money(paintCost),
          primerCost: money(primerCost),
          puttyCost: money(puttyCost),
          labourCost: money(labourCost),
          totalCost: money(totalCost),
        },
        raw: {
          grossArea,
          deductionArea,
          netArea,
          paintLitres,
          primerLitres,
          puttyKg,
          paintCost,
          primerCost,
          puttyCost,
          labourCost,
          totalCost,
          areaUnit,
        },
      })

      setCalculationId(Date.now())
      toast.success('Paint quantity calculated')
    } catch (err) {
      toast.error('Calculation failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <CalcShell
      icon={Paintbrush}
      title="Paint Calculator / पेंट कैलकुलेटर"
      subtitle="Paint, primer, putty, labour and total painting cost estimation"
      code="Quantity Estimation"
    >
      <div className="grid lg:grid-cols-5 gap-6">
        <Card className="lg:col-span-2 bg-slate-900/50 border-slate-800 p-6 h-fit">
          <h2 className="text-lg font-semibold text-white mb-1">Inputs / इनपुट</h2>
          <p className="text-xs text-slate-500 mb-5">
            Enter wall dimensions, coats, coverage and rates.
          </p>

          <div className="space-y-4">
            <SelField
              label="Unit System / यूनिट"
              value={form.unitSystem}
              onChange={(v) => u('unitSystem', v)}
              options={['metric', 'imperial']}
            />

            <SelField
              label="Paint Type / पेंट प्रकार"
              value={form.paintType}
              onChange={(v) => u('paintType', v)}
              options={[
                'Interior Wall / अंदर की दीवार',
                'Exterior Wall / बाहरी दीवार',
                'Ceiling / छत',
              ]}
            />

            <div className="border-t border-slate-800 pt-4">
              <h3 className="text-sm font-semibold text-white mb-3">
                Area Details / एरिया डिटेल्स
              </h3>

              <div className="space-y-4">
                <NumField label="Wall Length / लंबाई" id="length" value={form.length} onChange={(v) => u('length', v)} unit={unit} step="0.1" />
                <NumField label="Wall Height / ऊंचाई" id="height" value={form.height} onChange={(v) => u('height', v)} unit={unit} step="0.1" />
                <NumField label="Number of Walls / दीवारों की संख्या" id="walls" value={form.walls} onChange={(v) => u('walls', v)} step="1" />
                <NumField label="Deduction Area / कटौती क्षेत्र" id="deductionArea" value={form.deductionArea} onChange={(v) => u('deductionArea', v)} unit={areaUnit} step="0.1" />
              </div>
            </div>

            <div className="border-t border-slate-800 pt-4">
              <h3 className="text-sm font-semibold text-white mb-3">
                Paint Settings / पेंट सेटिंग्स
              </h3>

              <div className="space-y-4">
                <NumField label="Number of Coats / कोट्स" id="coats" value={form.coats} onChange={(v) => u('coats', v)} step="1" />
                <NumField label="Paint Coverage / पेंट कवरेज" id="paintCoverage" value={form.paintCoverage} onChange={(v) => u('paintCoverage', v)} unit="sq.m/L" step="0.5" />
                <NumField label="Primer Coverage / प्राइमर कवरेज" id="primerCoverage" value={form.primerCoverage} onChange={(v) => u('primerCoverage', v)} unit="sq.m/L" step="0.5" />
                <NumField label="Putty Consumption / पुट्टी खपत" id="puttyCoverage" value={form.puttyCoverage} onChange={(v) => u('puttyCoverage', v)} unit="kg/sq.m" step="0.1" />
              </div>
            </div>

            <div className="border-t border-slate-800 pt-4">
              <h3 className="text-sm font-semibold text-white mb-3">
                Cost Inputs / लागत इनपुट
              </h3>

              <div className="space-y-4">
                <NumField label="Paint Rate / पेंट रेट" id="paintRate" value={form.paintRate} onChange={(v) => u('paintRate', v)} unit="Rs./L" step="1" />
                <NumField label="Primer Rate / प्राइमर रेट" id="primerRate" value={form.primerRate} onChange={(v) => u('primerRate', v)} unit="Rs./L" step="1" />
                <NumField label="Putty Rate / पुट्टी रेट" id="puttyRate" value={form.puttyRate} onChange={(v) => u('puttyRate', v)} unit="Rs./kg" step="1" />
                <NumField label="Labour Rate / मजदूरी दर" id="labourRate" value={form.labourRate} onChange={(v) => u('labourRate', v)} unit={`Rs./${areaUnit}`} step="1" />
              </div>
            </div>

            <RunButton loading={loading} onClick={calc} label="Calculate / गणना करें" />
          </div>
        </Card>

        <div className="lg:col-span-3 space-y-4">
          {!result && <EmptyResult icon={Paintbrush} />}

          {result && (
            <ResultsMotion initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="flex justify-end">
                <DownloadPDFButton type="paint" inputs={form} result={result} calculationId={calculationId} />
              </div>

              <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <KpiCard icon={Ruler} title="Net Area / नेट एरिया" value={result.area.netPaintArea} />
                <KpiCard icon={Paintbrush} title="Paint Required / पेंट" value={result.material.paintRequired} />
                <KpiCard icon={Boxes} title="Putty Required / पुट्टी" value={result.material.puttyRequired} />
                <KpiCard icon={IndianRupee} title="Total Cost / कुल लागत" value={result.cost.totalCost} />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <ResultBlock title="Area Summary / एरिया सारांश">
                  <Row k="Gross Area" v={result.area.grossArea} />
                  <Row k="Deduction Area" v={result.area.deductionArea} />
                  <Row k="Net Paint Area" v={result.area.netPaintArea} highlight />
                  <Row k="In sq.ft" v={result.area.netAreaSqFt} />
                  <Row k="In sq.m" v={result.area.netAreaSqM} />
                </ResultBlock>

                <ResultBlock title="Material Summary / मटेरियल सारांश">
                  <Row k="Paint Required" v={result.material.paintRequired} highlight />
                  <Row k="Primer Required" v={result.material.primerRequired} />
                  <Row k="Putty Required" v={result.material.puttyRequired} />
                </ResultBlock>

                <ResultBlock title="Cost Estimation / लागत अनुमान">
                  <Row k="Paint Cost" v={result.cost.paintCost} />
                  <Row k="Primer Cost" v={result.cost.primerCost} />
                  <Row k="Putty Cost" v={result.cost.puttyCost} />
                  <Row k="Labour Cost" v={result.cost.labourCost} />
                  <Row k="Total Cost" v={result.cost.totalCost} highlight />
                </ResultBlock>

                <ResultBlock title="Formula Used / इस्तेमाल किया गया फॉर्मूला">
                  <Row k="Paint Area" v="Length × Height × Walls - Deduction" />
                  <Row k="Paint Required" v="Area × Coats ÷ Coverage" />
                  <Row k="Primer Required" v="Area ÷ Primer Coverage" />
                  <Row k="Putty Required" v="Area × Putty Consumption" />
                </ResultBlock>
              </div>
            </ResultsMotion>
          )}
        </div>
      </div>
    </CalcShell>
  )
}
