'use client'

import { useState } from 'react'
import { Grid3x3, Boxes, IndianRupee, Ruler, Layers } from 'lucide-react'
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

const patternWaste = {
  Straight: 10,
  Diagonal: 15,
  'Brick Bond': 12,
  Herringbone: 18,
}

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

export default function TileCalculatorPage() {
  const [form, setForm] = useState({
    unitSystem: 'metric',
    areaType: 'Floor Tile / फ्लोर टाइल',
    roomLength: 10,
    roomWidth: 8,
    tileLength: 600,
    tileWidth: 600,
    groutGap: 3,
    pattern: 'Straight',
    wastePercent: 10,
    deductionArea: 0,
    tilesPerBox: 4,
    tilePrice: 300,
    priceType: 'per tile',
    labourRate: 30,
  })

  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [calculationId, setCalculationId] = useState(null)

  const u = (k, v) => {
    setForm((p) => {
      const next = { ...p, [k]: v }
      if (k === 'pattern') next.wastePercent = patternWaste[v] || 10
      return next
    })
  }

  const unit = form.unitSystem === 'imperial' ? 'ft' : 'm'
  const areaUnit = form.unitSystem === 'imperial' ? 'sq.ft' : 'sq.m'

  const calc = () => {
    setLoading(true)

    try {
      const roomLength = parseFloat(form.roomLength) || 0
      const roomWidth = parseFloat(form.roomWidth) || 0
      const tileLength = parseFloat(form.tileLength) || 0
      const tileWidth = parseFloat(form.tileWidth) || 0
      const groutGap = parseFloat(form.groutGap) || 0
      const wastePercent = parseFloat(form.wastePercent) || 0
      const deductionArea = parseFloat(form.deductionArea) || 0
      const tilesPerBox = parseFloat(form.tilesPerBox) || 1
      const tilePrice = parseFloat(form.tilePrice) || 0
      const labourRate = parseFloat(form.labourRate) || 0

      const grossArea = roomLength * roomWidth
      const netArea = Math.max(grossArea - deductionArea, 0)

      const netAreaSqM =
        form.unitSystem === 'imperial' ? netArea * SQFT_TO_SQM : netArea

      const tileAreaSqM =
        ((tileLength + groutGap) / 1000) * ((tileWidth + groutGap) / 1000)

      const baseTiles = Math.ceil(netAreaSqM / tileAreaSqM)
      const wasteTiles = Math.ceil(baseTiles * (wastePercent / 100))
      const finalTiles = baseTiles + wasteTiles
      const boxesRequired = Math.ceil(finalTiles / tilesPerBox)

      const tileCost =
        form.priceType === 'per box'
          ? boxesRequired * tilePrice
          : finalTiles * tilePrice

      const labourCost = grossArea * labourRate
      const totalCost = tileCost + labourCost

      const adhesiveBags = Math.ceil(netAreaSqM / 5)
      const groutKg = Math.ceil(netAreaSqM * 0.35)

      setResult({
        input: {
          areaType: form.areaType.split('/')[0].trim(),
          unitSystem: form.unitSystem,
          roomLength,
          roomWidth,
          tileSize: `${tileLength} × ${tileWidth} mm`,
          groutGap: `${groutGap} mm`,
          pattern: form.pattern,
          wastePercent: `${wastePercent}%`,
        },
        area: {
          totalArea: `${n2(grossArea)} ${areaUnit}`,
          deductionArea: `${n2(deductionArea)} ${areaUnit}`,
          netTilingArea: `${n2(netArea)} ${areaUnit}`,
          netAreaSqM: `${n2(netAreaSqM)} sq.m`,
          netAreaSqFt: `${n2(netAreaSqM * SQM_TO_SQFT)} sq.ft`,
        },
        tileRequirement: {
          tileSize: `${tileLength} × ${tileWidth} mm`,
          tileArea: `${n2(tileAreaSqM)} sq.m`,
          tilesRequired: `${baseTiles} Nos`,
          wasteAdded: `${wasteTiles} Nos`,
          finalTilesRequired: `${finalTiles} Nos`,
        },
        purchase: {
          tilesPerBox: `${tilesPerBox}`,
          boxesRequired: `${boxesRequired} Boxes`,
        },
        cost: {
          tileCost: money(tileCost),
          labourCost: money(labourCost),
          totalProjectCost: money(totalCost),
        },
        material: {
          adhesiveRequired: `${adhesiveBags} Bags`,
          groutRequired: `${groutKg} Kg`,
        },
        raw: {
          grossArea,
          deductionArea,
          netArea,
          baseTiles,
          wasteTiles,
          finalTiles,
          boxesRequired,
          tileCost,
          labourCost,
          totalCost,
          adhesiveBags,
          groutKg,
          areaUnit,
        },
      })

      setCalculationId(Date.now())
      toast.success('Tile quantity calculated')
    } catch (err) {
      toast.error('Calculation failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <CalcShell
      icon={Grid3x3}
      title="Tile Calculator / टाइल कैलकुलेटर"
      subtitle="Floor & wall tile quantity, boxes, wastage, adhesive, grout and cost estimation"
      code="Quantity Estimation"
    >
      <div className="grid lg:grid-cols-5 gap-6">
        <Card className="lg:col-span-2 bg-slate-900/50 border-slate-800 p-6 h-fit">
          <h2 className="text-lg font-semibold text-white mb-1">
            Inputs / इनपुट
          </h2>
          <p className="text-xs text-slate-500 mb-5">
            Enter area, tile size and installation settings.
          </p>

          <div className="space-y-4">
            <SelField
              label="Unit System / यूनिट"
              value={form.unitSystem}
              onChange={(v) => u('unitSystem', v)}
              options={['metric', 'imperial']}
            />

            <SelField
              label="Area Type / एरिया टाइप"
              value={form.areaType}
              onChange={(v) => u('areaType', v)}
              options={['Floor Tile / फ्लोर टाइल', 'Wall Tile / वॉल टाइल']}
            />

            <div className="border-t border-slate-800 pt-4">
              <h3 className="text-sm font-semibold text-white mb-3">
                Area Details / एरिया डिटेल्स
              </h3>

              <div className="space-y-4">
                <NumField
                  label="Room Length / लंबाई"
                  id="roomLength"
                  value={form.roomLength}
                  onChange={(v) => u('roomLength', v)}
                  unit={unit}
                  step="0.1"
                />

                <NumField
                  label="Room Width / चौड़ाई"
                  id="roomWidth"
                  value={form.roomWidth}
                  onChange={(v) => u('roomWidth', v)}
                  unit={unit}
                  step="0.1"
                />

                <NumField
                  label="Deduction Area / कटौती क्षेत्र"
                  id="deductionArea"
                  value={form.deductionArea}
                  onChange={(v) => u('deductionArea', v)}
                  unit={areaUnit}
                  step="0.1"
                />
              </div>
            </div>

            <div className="border-t border-slate-800 pt-4">
              <h3 className="text-sm font-semibold text-white mb-3">
                Tile Details / टाइल डिटेल्स
              </h3>

              <div className="space-y-4">
                <NumField
                  label="Tile Length / टाइल लंबाई"
                  id="tileLength"
                  value={form.tileLength}
                  onChange={(v) => u('tileLength', v)}
                  unit="mm"
                  step="1"
                />

                <NumField
                  label="Tile Width / टाइल चौड़ाई"
                  id="tileWidth"
                  value={form.tileWidth}
                  onChange={(v) => u('tileWidth', v)}
                  unit="mm"
                  step="1"
                />

                <NumField
                  label="Grout Gap / ग्राउट गैप"
                  id="groutGap"
                  value={form.groutGap}
                  onChange={(v) => u('groutGap', v)}
                  unit="mm"
                  step="1"
                />
              </div>
            </div>

            <div className="border-t border-slate-800 pt-4">
              <h3 className="text-sm font-semibold text-white mb-3">
                Installation Settings / इंस्टॉलेशन सेटिंग्स
              </h3>

              <div className="space-y-4">
                <SelField
                  label="Tile Pattern / पैटर्न"
                  value={form.pattern}
                  onChange={(v) => u('pattern', v)}
                  options={['Straight', 'Diagonal', 'Brick Bond', 'Herringbone']}
                />

                <NumField
                  label="Waste Factor / वेस्टेज"
                  id="wastePercent"
                  value={form.wastePercent}
                  onChange={(v) => u('wastePercent', v)}
                  unit="%"
                  step="1"
                />

                <NumField
                  label="Tiles per Box / प्रति बॉक्स टाइल"
                  id="tilesPerBox"
                  value={form.tilesPerBox}
                  onChange={(v) => u('tilesPerBox', v)}
                  step="1"
                />

                <SelField
                  label="Price Type / रेट टाइप"
                  value={form.priceType}
                  onChange={(v) => u('priceType', v)}
                  options={['per tile', 'per box']}
                />

                <NumField
                  label="Tile Price / टाइल रेट"
                  id="tilePrice"
                  value={form.tilePrice}
                  onChange={(v) => u('tilePrice', v)}
                  unit="Rs."
                  step="1"
                />

                <NumField
                  label="Labour Rate / मजदूरी दर"
                  id="labourRate"
                  value={form.labourRate}
                  onChange={(v) => u('labourRate', v)}
                  unit={`Rs./${areaUnit}`}
                  step="1"
                />
              </div>
            </div>

            <RunButton loading={loading} onClick={calc} label="Calculate / गणना करें" />
          </div>
        </Card>

        <div className="lg:col-span-3 space-y-4">
          {!result && <EmptyResult icon={Grid3x3} />}

          {result && (
            <ResultsMotion
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex justify-end">
                <DownloadPDFButton
                  type="tile"
                  inputs={form}
                  result={result}
                  calculationId={calculationId}
                />
              </div>

              <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <KpiCard icon={Ruler} title="Net Area / नेट एरिया" value={result.area.netTilingArea} />
                <KpiCard icon={Layers} title="Tiles Needed / टाइल्स" value={result.tileRequirement.finalTilesRequired} />
                <KpiCard icon={Boxes} title="Boxes Required / बॉक्स" value={result.purchase.boxesRequired} />
                <KpiCard icon={IndianRupee} title="Total Cost / कुल लागत" value={result.cost.totalProjectCost} />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <ResultBlock title="Area Summary / एरिया सारांश">
                  <Row k="Total Area" v={result.area.totalArea} />
                  <Row k="Deduction Area" v={result.area.deductionArea} />
                  <Row k="Net Tiling Area" v={result.area.netTilingArea} highlight />
                  <Row k="In sq.ft" v={result.area.netAreaSqFt} />
                  <Row k="In sq.m" v={result.area.netAreaSqM} />
                </ResultBlock>

                <ResultBlock title="Tile Requirement / टाइल आवश्यकता">
                  <Row k="Tile Size" v={result.tileRequirement.tileSize} />
                  <Row k="Tiles Required" v={result.tileRequirement.tilesRequired} />
                  <Row k="Waste Added" v={result.tileRequirement.wasteAdded} />
                  <Row k="Final Tiles Needed" v={result.tileRequirement.finalTilesRequired} highlight />
                </ResultBlock>

                <ResultBlock title="Purchase Summary / खरीद सारांश">
                  <Row k="Tiles per Box" v={result.purchase.tilesPerBox} />
                  <Row k="Boxes Required" v={result.purchase.boxesRequired} highlight />
                  <Row k="Pattern" v={result.input.pattern} />
                  <Row k="Waste Factor" v={result.input.wastePercent} />
                </ResultBlock>

                <ResultBlock title="Cost Estimation / लागत अनुमान">
                  <Row k="Tile Cost" v={result.cost.tileCost} />
                  <Row k="Labour Cost" v={result.cost.labourCost} />
                  <Row k="Total Project Cost" v={result.cost.totalProjectCost} highlight />
                </ResultBlock>

                <ResultBlock title="Material Summary / मटेरियल सारांश">
                  <Row k="Adhesive Required" v={result.material.adhesiveRequired} />
                  <Row k="Grout Required" v={result.material.groutRequired} />
                </ResultBlock>

                <ResultBlock title="Formula Used / इस्तेमाल किया गया फॉर्मूला">
                  <Row k="Area" v="Length × Width - Deduction Area" />
                  <Row k="Tile Area" v="Tile Length × Tile Width" />
                  <Row k="Tiles Required" v="Net Area ÷ Tile Area" />
                  <Row k="Final Tiles" v="Tiles Required + Wastage" highlight />
                </ResultBlock>
              </div>
            </ResultsMotion>
          )}
        </div>
      </div>
    </CalcShell>
  )
}
