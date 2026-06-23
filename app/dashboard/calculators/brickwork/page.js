'use client'

import { useState } from 'react'
import { Layers, Plus, Trash2, FileDown } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { toast } from 'sonner'
import { useAuth } from '@/lib/auth-context'
import { saveCalculationHistory } from '@/lib/calculation-history'
import {
  CalcShell,
  NumField,
  SelField,
  RunButton,
  EmptyResult,
  ResultBlock,
  Row,
  ResultsMotion,
} from '@/components/calc-shell'

const BrickIc = Layers

const DOOR_PRESETS = {
  main: { label: 'Main Door - 3 ft × 7 ft', widthFt: 3, heightFt: 7 },
  room: { label: 'Room Door - 2.5 ft × 7 ft', widthFt: 2.5, heightFt: 7 },
  bathroom: { label: 'Bathroom Door - 2.25 ft × 7 ft', widthFt: 2.25, heightFt: 7 },
  custom: { label: 'Custom Door', widthFt: 3, heightFt: 7 },
}

const WINDOW_PRESETS = {
  standard: { label: 'Standard Window - 3 ft × 4 ft', widthFt: 3, heightFt: 4 },
  small: { label: 'Small Window - 2 ft × 3 ft', widthFt: 2, heightFt: 3 },
  large: { label: 'Large Window - 4 ft × 4 ft', widthFt: 4, heightFt: 4 },
  custom: { label: 'Custom Window', widthFt: 3, heightFt: 4 },
}

const CUSTOM_PRESETS = {
  ventilator: { label: 'Ventilator - 2 ft × 1.5 ft', widthFt: 2, heightFt: 1.5 },
  ac: { label: 'AC Opening - 2 ft × 2 ft', widthFt: 2, heightFt: 2 },
  niche: { label: 'Wall Niche - 1.5 ft × 1.5 ft', widthFt: 1.5, heightFt: 1.5 },
  custom: { label: 'Custom Opening', widthFt: 1, heightFt: 1 },
}

function ftToM(v) {
  return Number(v || 0) * 0.3048
}

function inchToM(v) {
  return Number(v || 0) * 0.0254
}

function mToFt(v) {
  return Number(v || 0) * 3.28084
}

function m3ToFt3(v) {
  return Number(v || 0) * 35.3147
}

function round(v, d = 2) {
  return Number(Number(v || 0).toFixed(d))
}

function inr(v) {
  return `Rs. ${Math.round(Number(v || 0)).toLocaleString('en-IN')}`
}

function getMetricFromFt(widthFt, heightFt) {
  return {
    widthM: ftToM(widthFt),
    heightM: ftToM(heightFt),
  }
}

function getDisplaySize(widthM, heightM, unitSystem) {
  if (unitSystem === 'imperial') {
    return `${round(mToFt(widthM), 2)} ft × ${round(mToFt(heightM), 2)} ft`
  }

  return `${round(widthM, 2)} m × ${round(heightM, 2)} m`
}

export default function BrickworkPage() {
    const { authFetch } = useAuth()
  const [form, setForm] = useState({
    unitSystem: 'metric',
    length: 4,
    height: 3,
    thicknessType: '0.23',
    customThickness: 0.23,
    mortarRatio: '1:6',
    brickType: 'modular',
    brickLength: 190,
    brickWidth: 90,
    brickHeight: 90,
    wastage: 5,
    brickRate: 8,
    cementRate: 420,
    sandRate: 1800,
  })

  const [doors, setDoors] = useState([])
  const [windows, setWindows] = useState([])
  const [customOpenings, setCustomOpenings] = useState([])
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [calculationId, setCalculationId] = useState(null)
  const updateForm = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const wallLengthM =
    form.unitSystem === 'imperial' ? ftToM(form.length) : Number(form.length || 0)

  const wallHeightM =
    form.unitSystem === 'imperial' ? ftToM(form.height) : Number(form.height || 0)

  const wallThicknessM =
    form.thicknessType === 'custom'
      ? form.unitSystem === 'imperial'
        ? inchToM(form.customThickness)
        : Number(form.customThickness || 0)
      : Number(form.thicknessType || 0)

  const getOpeningVolume = (item) => {
    return Number(item.qty || 0) * Number(item.widthM || 0) * Number(item.heightM || 0) * wallThicknessM
  }

  const addDoor = () => {
    const p = DOOR_PRESETS.main
    const m = getMetricFromFt(p.widthFt, p.heightFt)

    setDoors((prev) => [
      ...prev,
      {
        id: Date.now(),
        type: 'main',
        name: 'Main Door',
        qty: 1,
        ...m,
      },
    ])
  }

  const addWindow = () => {
    const p = WINDOW_PRESETS.standard
    const m = getMetricFromFt(p.widthFt, p.heightFt)

    setWindows((prev) => [
      ...prev,
      {
        id: Date.now(),
        type: 'standard',
        name: 'Standard Window',
        qty: 1,
        ...m,
      },
    ])
  }

  const addCustomOpening = () => {
    const p = CUSTOM_PRESETS.ventilator
    const m = getMetricFromFt(p.widthFt, p.heightFt)

    setCustomOpenings((prev) => [
      ...prev,
      {
        id: Date.now(),
        type: 'ventilator',
        name: 'Ventilator',
        qty: 1,
        ...m,
      },
    ])
  }

  const updateOpening = (setter, id, key, value) => {
    setter((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item

        if (key === 'type') {
          let preset = DOOR_PRESETS[value] || WINDOW_PRESETS[value] || CUSTOM_PRESETS[value]
          let m = getMetricFromFt(preset.widthFt, preset.heightFt)

          return {
            ...item,
            type: value,
            name: preset.label.split(' - ')[0],
            ...m,
          }
        }

        if (key === 'width') {
          return {
            ...item,
            widthM: form.unitSystem === 'imperial' ? ftToM(value) : Number(value || 0),
          }
        }

        if (key === 'height') {
          return {
            ...item,
            heightM: form.unitSystem === 'imperial' ? ftToM(value) : Number(value || 0),
          }
        }

        return { ...item, [key]: value }
      })
    )
  }

  const removeOpening = (setter, id) => {
    setter((prev) => prev.filter((item) => item.id !== id))
  }

  const calculate = () => {
    setLoading(true)

    try {
      const grossVolume = wallLengthM * wallHeightM * wallThicknessM
      const wallArea = wallLengthM * wallHeightM

      const doorDeduction = doors.reduce((sum, item) => sum + getOpeningVolume(item), 0)
      const windowDeduction = windows.reduce((sum, item) => sum + getOpeningVolume(item), 0)
      const customDeduction = customOpenings.reduce((sum, item) => sum + getOpeningVolume(item), 0)

      const totalDeduction = doorDeduction + windowDeduction + customDeduction
      const netVolume = Math.max(grossVolume - totalDeduction, 0)

      let brickL = 0.19
      let brickW = 0.09
      let brickH = 0.09

      if (form.brickType === 'nonModular') {
        brickL = 0.23
        brickW = 0.11
        brickH = 0.07
      }

      if (form.brickType === 'custom') {
        brickL = Number(form.brickLength || 0) / 1000
        brickW = Number(form.brickWidth || 0) / 1000
        brickH = Number(form.brickHeight || 0) / 1000
      }

      const nominalBrickVolume = (brickL + 0.01) * (brickW + 0.01) * (brickH + 0.01)
      const bricksWithoutWastage = netVolume / nominalBrickVolume
      const bricksWithWastage = bricksWithoutWastage * (1 + Number(form.wastage || 0) / 100)

      const mortarWetVolume = netVolume * 0.3
      const mortarDryVolume = mortarWetVolume * 1.33

      const ratioParts = form.mortarRatio.split(':').map(Number)
      const cementPart = ratioParts[0]
      const sandPart = ratioParts[1]
      const totalParts = cementPart + sandPart

      const cementVolume = mortarDryVolume * (cementPart / totalParts)
      const sandVolume = mortarDryVolume * (sandPart / totalParts)

      const cementKg = cementVolume * 1440
      const cementBags = cementKg / 50
      const sandCft = sandVolume * 35.3147

      const brickCost = bricksWithWastage * Number(form.brickRate || 0)
      const cementCost = cementBags * Number(form.cementRate || 0)
      const sandCost = sandVolume * Number(form.sandRate || 0)
      const totalCost = brickCost + cementCost + sandCost

      const openingSchedule = [
        ...doors.map((item) => ({ ...item, category: 'Door' })),
        ...windows.map((item) => ({ ...item, category: 'Window' })),
        ...customOpenings.map((item) => ({ ...item, category: 'Custom Opening' })),
      ].map((item) => ({
        ...item,
        size: getDisplaySize(item.widthM, item.heightM, form.unitSystem),
        deduction: getOpeningVolume(item),
      }))

           const finalResult = {
        unitSystem: form.unitSystem,
        wall: {
          area: round(wallArea, 3),
          grossVolume: round(grossVolume, 3),
          grossVolumeFt3: round(m3ToFt3(grossVolume), 2),
          lengthM: round(wallLengthM, 3),
          heightM: round(wallHeightM, 3),
          thicknessM: round(wallThicknessM, 3),
        },
        deductions: {
          door: round(doorDeduction, 3),
          window: round(windowDeduction, 3),
          custom: round(customDeduction, 3),
          total: round(totalDeduction, 3),
        },
        net: {
          volume: round(netVolume, 3),
          volumeFt3: round(m3ToFt3(netVolume), 2),
        },
        bricks: {
          count: Math.ceil(bricksWithWastage),
          withoutWastage: Math.ceil(bricksWithoutWastage),
          wastage: Number(form.wastage || 0),
        },
        mortar: {
          wetVolume: round(mortarWetVolume, 3),
          dryVolume: round(mortarDryVolume, 3),
        },
        cement: {
          bags: Math.ceil(cementBags),
          exactBags: round(cementBags, 2),
          kg: round(cementKg, 1),
        },
        sand: {
          cum: round(sandVolume, 3),
          cft: round(sandCft, 2),
        },
        cost: {
          brickCost,
          cementCost,
          sandCost,
          totalCost,
        },
        openingSchedule,
        formula: {
          gross: 'Gross Volume = Wall Length × Wall Height × Wall Thickness',
          net: 'Net Volume = Gross Volume - Door Deduction - Window Deduction - Custom Deduction',
          bricks: 'Brick Quantity = Net Volume / Nominal Brick Volume + Wastage',
          mortar: 'Mortar Wet Volume = Net Brickwork Volume × 30%',
        },
      }

      setResult(finalResult)

      saveCalculationHistory(
        authFetch,
        'brickwork',
        {
          form,
          doors,
          windows,
          customOpenings,
        },
        finalResult
      )

      toast.success('Brickwork calculated successfully')
    } catch (error) {
      toast.error('Calculation failed')
    } finally {
      setLoading(false)
    }
  }

  const generatePDF = async () => {
    if (!result) {
      toast.error('Please calculate first')
      return
    }

    try {
      const { jsPDF } = await import('jspdf')
      await import('jspdf-autotable')

      const doc = new jsPDF()
      const date = new Date().toLocaleString('en-IN')

      doc.setFontSize(18)
      doc.text('CivilCalc Pro', 14, 18)

      doc.setFontSize(14)
      doc.text('Brickwork Estimation Report', 14, 28)

      doc.setFontSize(9)
      doc.text(`Generated on: ${date}`, 14, 36)
      doc.text(`Unit System: ${form.unitSystem === 'imperial' ? 'Imperial' : 'Metric'}`, 14, 42)

      doc.autoTable({
        startY: 50,
        head: [['Wall Details', 'Value']],
        body: [
          ['Wall Length', form.unitSystem === 'imperial' ? `${form.length} ft` : `${form.length} m`],
          ['Wall Height', form.unitSystem === 'imperial' ? `${form.height} ft` : `${form.height} m`],
          [
            'Wall Thickness',
            form.thicknessType === 'custom'
              ? `${form.customThickness} ${form.unitSystem === 'imperial' ? 'inch' : 'm'}`
              : `${result.wall.thicknessM} m`,
          ],
          ['Mortar Ratio', form.mortarRatio],
          ['Brick Type', form.brickType],
        ],
      })

      doc.autoTable({
        startY: doc.lastAutoTable.finalY + 8,
        head: [['Quantity Summary', 'Value']],
        body: [
          ['Wall Area', `${result.wall.area} m2`],
          ['Gross Volume', `${result.wall.grossVolume} m3 / ${result.wall.grossVolumeFt3} ft3`],
          ['Door Deduction', `${result.deductions.door} m3`],
          ['Window Deduction', `${result.deductions.window} m3`],
          ['Custom Deduction', `${result.deductions.custom} m3`],
          ['Total Deduction', `${result.deductions.total} m3`],
          ['Net Brickwork Volume', `${result.net.volume} m3 / ${result.net.volumeFt3} ft3`],
        ],
      })

      if (result.openingSchedule.length > 0) {
        doc.autoTable({
          startY: doc.lastAutoTable.finalY + 8,
          head: [['Type', 'Name', 'Qty', 'Size', 'Deduction']],
          body: result.openingSchedule.map((item) => [
            item.category,
            item.name,
            item.qty,
            item.size,
            `${round(item.deduction, 3)} m3`,
          ]),
        })
      }

      doc.autoTable({
        startY: doc.lastAutoTable.finalY + 8,
        head: [['Material Summary', 'Quantity']],
        body: [
          ['Bricks', `${result.bricks.count.toLocaleString('en-IN')} Nos`],
          ['Cement', `${result.cement.bags} Bags (${result.cement.kg} kg)`],
          ['Sand', `${result.sand.cum} m3 / ${result.sand.cft} cft`],
          ['Wet Mortar', `${result.mortar.wetVolume} m3`],
          ['Dry Mortar', `${result.mortar.dryVolume} m3`],
        ],
      })

      doc.autoTable({
        startY: doc.lastAutoTable.finalY + 8,
        head: [['Cost Summary', 'Amount']],
        body: [
          ['Bricks Cost', inr(result.cost.brickCost)],
          ['Cement Cost', inr(result.cost.cementCost)],
          ['Sand Cost', inr(result.cost.sandCost)],
          ['Total Estimated Material Cost', inr(result.cost.totalCost)],
        ],
      })

      doc.setFontSize(9)
      doc.text('Generated by CivilCalc Pro - www.civilcalcpro.in', 14, 285)

      doc.save('CivilCalc-Pro-Brickwork-Report.pdf')
      toast.success('PDF downloaded')
    } catch (error) {
      toast.error('PDF generation failed. Please check jspdf and jspdf-autotable installation.')
    }
  }

  const renderOpeningList = (title, subtitle, items, setter, presets, addFn) => (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h3 className="text-sm font-semibold text-white">{title}</h3>
          <p className="text-xs text-slate-500">{subtitle}</p>
        </div>

        <button
          type="button"
          onClick={addFn}
          className="inline-flex items-center gap-1 rounded-lg bg-orange-500 px-3 py-2 text-xs font-semibold text-white hover:bg-orange-600"
        >
          <Plus className="h-3.5 w-3.5" />
          Add
        </button>
      </div>

      {items.length === 0 && (
        <p className="rounded-xl border border-dashed border-slate-800 p-3 text-xs text-slate-500">
          No deduction added. If wall has no door/window, keep this empty.
        </p>
      )}

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400">Type / प्रकार</label>
                <select
                  value={item.type}
                  onChange={(e) => updateOpening(setter, item.id, 'type', e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none"
                >
                  {Object.entries(presets).map(([key, preset]) => (
                    <option key={key} value={key}>
                      {preset.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400">Quantity / संख्या</label>
                <input
                  type="number"
                  min="0"
                  value={item.qty}
                  onChange={(e) => updateOpening(setter, item.id, 'qty', e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400">
                  Width / चौड़ाई ({form.unitSystem === 'imperial' ? 'ft' : 'm'})
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={form.unitSystem === 'imperial' ? round(mToFt(item.widthM), 2) : round(item.widthM, 2)}
                  onChange={(e) => updateOpening(setter, item.id, 'width', e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400">
                  Height / ऊंचाई ({form.unitSystem === 'imperial' ? 'ft' : 'm'})
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={form.unitSystem === 'imperial' ? round(mToFt(item.heightM), 2) : round(item.heightM, 2)}
                  onChange={(e) => updateOpening(setter, item.id, 'height', e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none"
                />
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <p className="text-xs text-slate-400">
                Deduction: <span className="text-orange-400">{round(getOpeningVolume(item), 3)} m³</span>
              </p>

              <button
                type="button"
                onClick={() => removeOpening(setter, item.id)}
                className="inline-flex items-center gap-1 rounded-lg border border-red-500/40 px-3 py-2 text-xs text-red-300 hover:bg-red-500/10"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <CalcShell
      icon={BrickIc}
      title="Brickwork Calculator"
      subtitle="Brick quantity, mortar, cement, sand, opening deductions and professional PDF report"
      code="Standard practice"
    >
      <div className="grid lg:grid-cols-5 gap-6">
        <Card className="lg:col-span-2 bg-slate-900/50 border-slate-800 p-6 h-fit">
          <h2 className="text-lg font-semibold text-white mb-1">Inputs / इनपुट</h2>
          <p className="text-xs text-slate-500 mb-5">
            Door, window and custom opening deductions are optional.
          </p>

          <div className="space-y-4">
            <SelField
              label="Unit System / यूनिट सिस्टम"
              value={form.unitSystem}
              onChange={(v) => updateForm('unitSystem', v)}
              options={['metric', 'imperial']}
            />

            <NumField
              label="Wall Length / दीवार की लंबाई"
              id="length"
              value={form.length}
              onChange={(v) => updateForm('length', v)}
              unit={form.unitSystem === 'imperial' ? 'ft' : 'm'}
              step="0.1"
            />

            <NumField
              label="Wall Height / दीवार की ऊंचाई"
              id="height"
              value={form.height}
              onChange={(v) => updateForm('height', v)}
              unit={form.unitSystem === 'imperial' ? 'ft' : 'm'}
              step="0.1"
            />

            <SelField
              label="Wall Thickness / दीवार की मोटाई"
              value={String(form.thicknessType)}
              onChange={(v) => updateForm('thicknessType', v)}
              options={['0.115', '0.23', '0.34', 'custom']}
            />

            {form.thicknessType === 'custom' && (
              <NumField
                label="Custom Thickness / कस्टम मोटाई"
                id="customThickness"
                value={form.customThickness}
                onChange={(v) => updateForm('customThickness', v)}
                unit={form.unitSystem === 'imperial' ? 'inch' : 'm'}
                step="0.01"
              />
            )}

            <SelField
              label="Mortar Ratio / मोर्टार अनुपात"
              value={form.mortarRatio}
              onChange={(v) => updateForm('mortarRatio', v)}
              options={['1:3', '1:4', '1:5', '1:6']}
            />

            <SelField
              label="Brick Type / ईंट का प्रकार"
              value={form.brickType}
              onChange={(v) => updateForm('brickType', v)}
              options={['modular', 'nonModular', 'custom']}
            />

            {form.brickType === 'custom' && (
              <div className="grid grid-cols-3 gap-3">
                <NumField label="L" id="brickLength" value={form.brickLength} onChange={(v) => updateForm('brickLength', v)} unit="mm" />
                <NumField label="W" id="brickWidth" value={form.brickWidth} onChange={(v) => updateForm('brickWidth', v)} unit="mm" />
                <NumField label="H" id="brickHeight" value={form.brickHeight} onChange={(v) => updateForm('brickHeight', v)} unit="mm" />
              </div>
            )}

            <NumField
              label="Wastage / वेस्टेज"
              id="wastage"
              value={form.wastage}
              onChange={(v) => updateForm('wastage', v)}
              unit="%"
              step="1"
            />

            <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
              <h3 className="text-sm font-semibold text-white mb-3">
                Material Rates / मटेरियल रेट
              </h3>

              <div className="space-y-3">
                <NumField label="Brick Rate" id="brickRate" value={form.brickRate} onChange={(v) => updateForm('brickRate', v)} unit="Rs/Nos" />
                <NumField label="Cement Rate" id="cementRate" value={form.cementRate} onChange={(v) => updateForm('cementRate', v)} unit="Rs/Bag" />
                <NumField label="Sand Rate" id="sandRate" value={form.sandRate} onChange={(v) => updateForm('sandRate', v)} unit="Rs/m³" />
              </div>
            </div>

            {renderOpeningList(
              'Doors / दरवाजे',
              'Default value is zero. Add only if wall has door opening.',
              doors,
              setDoors,
              DOOR_PRESETS,
              addDoor
            )}

            {renderOpeningList(
              'Windows / खिड़कियां',
              'Default value is zero. Add only if wall has window opening.',
              windows,
              setWindows,
              WINDOW_PRESETS,
              addWindow
            )}

            {renderOpeningList(
              'Custom Openings / कस्टम कटआउट',
              'Ventilator, AC opening, niche, shaft or any custom deduction.',
              customOpenings,
              setCustomOpenings,
              CUSTOM_PRESETS,
              addCustomOpening
            )}

            <RunButton loading={loading} onClick={calculate} label="Calculate Brickwork" />
          </div>
        </Card>

        <div className="lg:col-span-3 space-y-4">
          {!result && <EmptyResult icon={BrickIc} />}

          {result && (
            <ResultsMotion
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={generatePDF}
                  className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600"
                >
                  <FileDown className="h-4 w-4" />
                  Download Professional PDF
                </button>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <ResultBlock title="Wall Summary">
                  <Row k="Wall Area" v={`${result.wall.area} m²`} />
                  <Row k="Gross Volume" v={`${result.wall.grossVolume} m³ / ${result.wall.grossVolumeFt3} ft³`} />
                  <Row k="Mortar Mix" v={form.mortarRatio} />
                </ResultBlock>

                <ResultBlock title="Opening Deductions">
                  <Row k="Door Deduction" v={`${result.deductions.door} m³`} />
                  <Row k="Window Deduction" v={`${result.deductions.window} m³`} />
                  <Row k="Custom Deduction" v={`${result.deductions.custom} m³`} />
                  <Row k="Total Deduction" v={`${result.deductions.total} m³`} highlight />
                </ResultBlock>

                <ResultBlock title="Net Brickwork">
                  <Row k="Net Volume" v={`${result.net.volume} m³`} highlight />
                  <Row k="Net Volume" v={`${result.net.volumeFt3} ft³`} />
                </ResultBlock>

                <ResultBlock title="Bricks">
                  <Row k="Without Wastage" v={`${result.bricks.withoutWastage.toLocaleString('en-IN')} nos`} />
                  <Row k={`With ${result.bricks.wastage}% Wastage`} v={`${result.bricks.count.toLocaleString('en-IN')} nos`} highlight />
                </ResultBlock>

                <ResultBlock title="Mortar">
                  <Row k="Wet Mortar" v={`${result.mortar.wetVolume} m³`} />
                  <Row k="Dry Mortar" v={`${result.mortar.dryVolume} m³`} highlight />
                </ResultBlock>

                <ResultBlock title="Materials">
                  <Row k="Cement" v={`${result.cement.bags} bags (${result.cement.kg} kg)`} highlight />
                  <Row k="Sand" v={`${result.sand.cum} m³ / ${result.sand.cft} cft`} />
                </ResultBlock>

                <ResultBlock title="Cost Summary">
                  <Row k="Brick Cost" v={inr(result.cost.brickCost)} />
                  <Row k="Cement Cost" v={inr(result.cost.cementCost)} />
                  <Row k="Sand Cost" v={inr(result.cost.sandCost)} />
                  <Row k="Total Material Cost" v={inr(result.cost.totalCost)} highlight />
                </ResultBlock>

              </div>

              {result.openingSchedule.length > 0 && (
                <Card className="bg-slate-900/50 border-slate-800 p-5">
                  <h3 className="text-lg font-semibold text-white mb-1">
                    Opening Schedule / कटआउट डिटेल
                  </h3>
                  <p className="text-xs text-slate-500 mb-4">
                    Door, window and custom deduction summary
                  </p>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-800 text-left text-slate-400">
                          <th className="py-2 pr-3">Type</th>
                          <th className="py-2 pr-3">Name</th>
                          <th className="py-2 pr-3">Qty</th>
                          <th className="py-2 pr-3">Size</th>
                          <th className="py-2 pr-3">Deduction</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.openingSchedule.map((item, index) => (
                          <tr key={`${item.id}-${index}`} className="border-b border-slate-800/70 text-slate-300">
                            <td className="py-2 pr-3">{item.category}</td>
                            <td className="py-2 pr-3">{item.name}</td>
                            <td className="py-2 pr-3">{item.qty}</td>
                            <td className="py-2 pr-3">{item.size}</td>
                            <td className="py-2 pr-3 text-orange-400">{round(item.deduction, 3)} m³</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              )}
            </ResultsMotion>
          )}
        </div>
      </div>
    </CalcShell>
  )
}
