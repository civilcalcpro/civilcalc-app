'use client'

import { useState } from 'react'
import { Shovel, Truck, IndianRupee, ShieldAlert, Clock, Ruler } from 'lucide-react'
import { Card } from '@/components/ui/card'
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

const M3_TO_FT3 = 35.3147
const FT3_TO_M3 = 1 / M3_TO_FT3

const soilData = {
  loose: {
    label: 'Loose Soil / ढीली मिट्टी',
    bulkingFactor: 1.15,
    slope: '1:1',
    productivity: 35,
  },
  medium: {
    label: 'Medium Soil / मध्यम मिट्टी',
    bulkingFactor: 1.25,
    slope: '1.5:1',
    productivity: 28,
  },
  hard: {
    label: 'Hard Soil / कठोर मिट्टी',
    bulkingFactor: 1.35,
    slope: '2:1',
    productivity: 20,
  },
  rock: {
    label: 'Rock / चट्टान',
    bulkingFactor: 1.55,
    slope: 'Special breaking required',
    productivity: 10,
  },
}

const excavationTypes = [
  'Open Excavation / खुली खुदाई',
  'Trench Excavation / खाई खुदाई',
  'Footing Excavation / फुटिंग खुदाई',
  'Basement Excavation / बेसमेंट खुदाई',
]

function money(n) {
  return `₹${Number(n || 0).toLocaleString('en-IN', {
    maximumFractionDigits: 0,
  })}`
}

function n2(n) {
  return Number(n || 0).toFixed(2)
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

export default function ExcavationPage() {
  const [form, setForm] = useState({
    unitSystem: 'metric',
    excavationType: 'Open Excavation / खुली खुदाई',
    length: 10,
    width: 8,
    depth: 1.5,
    soilType: 'medium',
    truckCapacity: 4,
    excavationRate: 180,
    loadingRate: 60,
    transportRate: 120,
  })

  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [calculationId, setCalculationId] = useState(null)

  const u = (k, v) => setForm((p) => ({ ...p, [k]: v }))

  const unit = form.unitSystem === 'imperial' ? 'ft' : 'm'
  const volumeUnit = form.unitSystem === 'imperial' ? 'ft³' : 'm³'
  const rateUnit = form.unitSystem === 'imperial' ? '₹/ft³' : '₹/m³'

  const calc = () => {
    setLoading(true)

    try {
      const length = parseFloat(form.length) || 0
      const width = parseFloat(form.width) || 0
      const depth = parseFloat(form.depth) || 0
      const truckCapacity = parseFloat(form.truckCapacity) || 1

      const soil = soilData[form.soilType] || soilData.medium

      const displayBankVolume = length * width * depth
      const bankVolumeM3 =
        form.unitSystem === 'imperial'
          ? displayBankVolume * FT3_TO_M3
          : displayBankVolume

      const loosenedVolumeM3 = bankVolumeM3 * soil.bulkingFactor
      const displayLoosenedVolume =
        form.unitSystem === 'imperial'
          ? loosenedVolumeM3 * M3_TO_FT3
          : loosenedVolumeM3

      const trips = Math.ceil(displayLoosenedVolume / truckCapacity)

      const excavationCost = displayBankVolume * (parseFloat(form.excavationRate) || 0)
      const loadingCost = displayBankVolume * (parseFloat(form.loadingRate) || 0)
      const transportCost = displayLoosenedVolume * (parseFloat(form.transportRate) || 0)
      const totalCost = excavationCost + loadingCost + transportCost

      const requiredHours = bankVolumeM3 / soil.productivity

      const safetyStatus =
        depth >= 3
          ? 'High Risk / अधिक जोखिम'
          : depth >= 1.5
            ? 'Moderate Risk / मध्यम जोखिम'
            : 'Low Risk / कम जोखिम'

      const shoringRequired =
        depth >= 1.5 ? 'Required / जरूरी' : 'Usually not required / सामान्यतः जरूरी नहीं'

      const safetyNotes = [
        depth >= 1.5
          ? 'Provide shoring or proper side slope. / शोरिंग या सही साइड स्लोप रखें।'
          : 'Maintain safe working edge distance. / किनारे से सुरक्षित दूरी रखें।',
        'Provide barricading around excavation. / खुदाई के चारों ओर बैरिकेडिंग लगाएं।',
        'Use PPE: helmet, safety shoes and reflective jacket. / PPE का उपयोग करें।',
        'Avoid water accumulation inside excavation. / खुदाई में पानी जमा न होने दें।',
      ]

      setResult({
        site: {
          length,
          width,
          depth,
          soilType: soil.label,
          excavationType: form.excavationType,
          unitSystem: form.unitSystem,
        },
        volume: {
          bankVolume: n2(displayBankVolume),
          loosenedVolume: n2(displayLoosenedVolume),
          bankVolumeM3: n2(bankVolumeM3),
          loosenedVolumeM3: n2(loosenedVolumeM3),
          cft: n2(bankVolumeM3 * M3_TO_FT3),
          bulkingFactor: soil.bulkingFactor,
        },
        disposal: {
          truckCapacity,
          totalTrips: trips,
        },
        cost: {
          excavationCost,
          loadingCost,
          transportCost,
          totalCost,
          rateUnit,
        },
        equipment: {
          productivity: soil.productivity,
          requiredHours: n2(requiredHours),
          requiredDays: n2(requiredHours / 8),
        },
        notes: {
          shoringRequired,
          safetySlope: soil.slope,
          safetyStatus,
          safetyNotes,
        },
      })

      setCalculationId(Date.now())
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <CalcShell
      icon={Shovel}
      title="Excavation Quantity / खुदाई मात्रा"
      subtitle="Earthwork volume, truck trips, cost and safety estimation / खुदाई मात्रा, ट्रक चक्कर, लागत और सुरक्षा अनुमान"
      code="IS 1200 (Part 1)"
    >
      <div className="grid lg:grid-cols-5 gap-6">
        <Card className="lg:col-span-2 bg-slate-900/50 border-slate-800 p-6 h-fit">
          <h2 className="text-lg font-semibold text-white mb-1">Inputs / इनपुट</h2>
          <p className="text-xs text-slate-500 mb-5">
            Select unit system and enter excavation dimensions.
          </p>

          <div className="space-y-4">
            <SelField
              label="Unit System / यूनिट सिस्टम"
              value={form.unitSystem}
              onChange={(v) => u('unitSystem', v)}
              options={['metric', 'imperial']}
            />

            <SelField
              label="Excavation Type / खुदाई प्रकार"
              value={form.excavationType}
              onChange={(v) => u('excavationType', v)}
              options={excavationTypes}
            />

            <NumField
              label="Length / लंबाई"
              id="length"
              value={form.length}
              onChange={(v) => u('length', v)}
              unit={unit}
              step="0.1"
            />

            <NumField
              label="Width / चौड़ाई"
              id="width"
              value={form.width}
              onChange={(v) => u('width', v)}
              unit={unit}
              step="0.1"
            />

            <NumField
              label="Depth / गहराई"
              id="depth"
              value={form.depth}
              onChange={(v) => u('depth', v)}
              unit={unit}
              step="0.1"
            />

            <SelField
              label="Soil Type / मिट्टी प्रकार"
              value={form.soilType}
              onChange={(v) => u('soilType', v)}
              options={['loose', 'medium', 'hard', 'rock']}
            />

            <NumField
              label="Truck Capacity / ट्रक क्षमता"
              id="truckCapacity"
              value={form.truckCapacity}
              onChange={(v) => u('truckCapacity', v)}
              unit={volumeUnit}
              step="0.5"
            />

            <div className="border-t border-slate-800 pt-4">
              <h3 className="text-sm font-semibold text-white mb-3">
                Cost Inputs / लागत इनपुट
              </h3>

              <div className="space-y-4">
                <NumField
                  label="Excavation Rate / खुदाई दर"
                  id="excavationRate"
                  value={form.excavationRate}
                  onChange={(v) => u('excavationRate', v)}
                  unit={rateUnit}
                  step="1"
                />

                <NumField
                  label="Loading Rate / लोडिंग दर"
                  id="loadingRate"
                  value={form.loadingRate}
                  onChange={(v) => u('loadingRate', v)}
                  unit={rateUnit}
                  step="1"
                />

                <NumField
                  label="Transport Rate / ट्रांसपोर्ट दर"
                  id="transportRate"
                  value={form.transportRate}
                  onChange={(v) => u('transportRate', v)}
                  unit={rateUnit}
                  step="1"
                />
              </div>
            </div>

            <RunButton loading={loading} onClick={calc} label="Calculate / गणना करें" />
          </div>
        </Card>

        <div className="lg:col-span-3 space-y-4">
          {!result && <EmptyResult icon={Shovel} />}

          {result && (
            <ResultsMotion
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex justify-end">
                <DownloadPDFButton
                  type="excavation"
                  inputs={form}
                  result={result}
                  calculationId={calculationId}
                />
              </div>

              <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <KpiCard
                  icon={Ruler}
                  title="Excavation Volume / खुदाई आयतन"
                  value={`${result.volume.bankVolume} ${volumeUnit}`}
                  sub="Bank volume"
                />
                <KpiCard
                  icon={Truck}
                  title="Truck Trips / ट्रक चक्कर"
                  value={`${result.disposal.totalTrips}`}
                  sub={`${result.disposal.truckCapacity} ${volumeUnit} capacity`}
                />
                <KpiCard
                  icon={IndianRupee}
                  title="Total Cost / कुल लागत"
                  value={money(result.cost.totalCost)}
                  sub="Excavation + Loading + Transport"
                />
                <KpiCard
                  icon={ShieldAlert}
                  title="Safety / सुरक्षा"
                  value={result.notes.safetyStatus}
                  sub={`Slope: ${result.notes.safetySlope}`}
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <ResultBlock title="Site Geometry / साइट ज्योमेट्री">
                  <Row k="Excavation type" v={result.site.excavationType} />
                  <Row k="Length / लंबाई" v={`${result.site.length} ${unit}`} />
                  <Row k="Width / चौड़ाई" v={`${result.site.width} ${unit}`} />
                  <Row k="Depth / गहराई" v={`${result.site.depth} ${unit}`} />
                  <Row k="Soil type / मिट्टी" v={result.site.soilType} />
                </ResultBlock>

                <ResultBlock title="Volume / आयतन">
                  <Row
                    k="Bank volume / मूल आयतन"
                    v={`${result.volume.bankVolume} ${volumeUnit}`}
                    highlight
                  />
                  <Row
                    k="Loosened volume / ढीला आयतन"
                    v={`${result.volume.loosenedVolume} ${volumeUnit}`}
                  />
                  <Row k="Bulking factor / बल्किंग फैक्टर" v={`×${result.volume.bulkingFactor}`} />
                  <Row k="Metric volume" v={`${result.volume.bankVolumeM3} m³`} />
                  <Row k="Imperial volume" v={`${result.volume.cft} ft³`} />
                </ResultBlock>

                <ResultBlock title="Cost Estimation / लागत अनुमान">
                  <Row k="Excavation cost / खुदाई लागत" v={money(result.cost.excavationCost)} />
                  <Row k="Loading cost / लोडिंग लागत" v={money(result.cost.loadingCost)} />
                  <Row k="Transport cost / ट्रांसपोर्ट लागत" v={money(result.cost.transportCost)} />
                  <Row k="Total cost / कुल लागत" v={money(result.cost.totalCost)} highlight />
                </ResultBlock>

                <ResultBlock title="Equipment Productivity / मशीन उत्पादकता">
                  <Row
                    k="Productivity / उत्पादकता"
                    v={`${result.equipment.productivity} m³/hr`}
                  />
                  <Row
                    k="Required hours / आवश्यक घंटे"
                    v={`${result.equipment.requiredHours} hr`}
                    highlight
                  />
                  <Row
                    k="Required days / आवश्यक दिन"
                    v={`${result.equipment.requiredDays} days`}
                  />
                  <Row k="Working day assumed" v="8 hr/day" />
                </ResultBlock>

                <ResultBlock title="Disposal / मिट्टी हटाना">
                  <Row
                    k="Truck capacity / ट्रक क्षमता"
                    v={`${result.disposal.truckCapacity} ${volumeUnit}`}
                  />
                  <Row
                    k="Number of trips / चक्कर"
                    v={`${result.disposal.totalTrips} loads`}
                    highlight
                  />
                  <Row k="Shoring / शोरिंग" v={result.notes.shoringRequired} />
                  <Row k="Safety slope / सुरक्षित ढलान" v={result.notes.safetySlope} />
                </ResultBlock>

                <ResultBlock title="Formula Used / इस्तेमाल किया गया फॉर्मूला">
                  <Row k="Volume" v="Length × Width × Depth" />
                  <Row
                    k="Calculation"
                    v={`${result.site.length} × ${result.site.width} × ${result.site.depth}`}
                  />
                  <Row
                    k="Bank volume"
                    v={`${result.volume.bankVolume} ${volumeUnit}`}
                    highlight
                  />
                  <Row
                    k="Loose volume"
                    v={`${result.volume.bankVolume} × ${result.volume.bulkingFactor} = ${result.volume.loosenedVolume} ${volumeUnit}`}
                  />
                </ResultBlock>

                <ResultBlock title="Safety Recommendations / सुरक्षा सुझाव" className="sm:col-span-2">
                  <div className="space-y-2">
                    {result.notes.safetyNotes.map((note, i) => (
                      <div
                        key={i}
                        className="rounded-lg border border-slate-800 bg-slate-950/40 p-3 text-sm text-slate-300"
                      >
                        {note}
                      </div>
                    ))}
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
