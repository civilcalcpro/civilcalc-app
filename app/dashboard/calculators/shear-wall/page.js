'use client'

import { useMemo, useState } from 'react'
import {
  AlertTriangle,
  Calculator,
  ClipboardList,
  Download,
  Hammer,
  RotateCcw,
  Ruler,
  Sparkles,
} from 'lucide-react'

const defaultInputs = {
  unitSystem: 'metric',

  wallLength: 3.0,
  wallHeight: 3.2,
  thickness: 200,
  storeys: 1,
  wallCount: 1,

  axialLoad: 900,
  shearForce: 180,
  bendingMoment: 650,

  fck: 25,
  fy: 500,
  cover: 40,

  barDesignMode: 'auto',

  verticalBarDia: 12,
  horizontalBarDia: 10,
  boundaryBarDia: 16,
  minSteelRatio: 0.25,

  concreteRate: 6500,
  steelRate: 65,
  shutteringRate: 550,
}

const imperialDefaults = {
  ...defaultInputs,
  unitSystem: 'imperial',

  wallLength: 10,
  wallHeight: 10.5,
  thickness: 8,
  storeys: 1,
  wallCount: 1,

  axialLoad: 200,
  shearForce: 40,
  bendingMoment: 480,
}

const VERTICAL_BAR_DIA_OPTIONS = [10, 12, 16, 20, 25, 32]
const HORIZONTAL_BAR_DIA_OPTIONS = [8, 10, 12, 16]
const BOUNDARY_BAR_DIA_OPTIONS = [12, 16, 20, 25, 32]

const round = (value, digits = 2) => {
  if (!Number.isFinite(value)) return '—'
  return Number(value).toFixed(digits)
}

const safeNumber = (value) => {
  const n = Number(value)
  return Number.isFinite(n) ? n : 0
}

const money = (value) => {
  if (!Number.isFinite(value)) return '₹0'
  return `₹${Math.round(value).toLocaleString('en-IN')}`
}

const barArea = (dia) => (Math.PI * dia * dia) / 4
const barWeight = (dia) => (dia * dia) / 162

function statusClass(pass) {
  return pass
    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
    : 'border-red-500/30 bg-red-500/10 text-red-300'
}

function convertToMetric(input) {
  if (input.unitSystem === 'imperial') {
    return {
      wallLength: input.wallLength * 0.3048,
      wallHeight: input.wallHeight * 0.3048,
      thickness: input.thickness * 25.4,

      axialLoad: input.axialLoad * 4.44822,
      shearForce: input.shearForce * 4.44822,
      bendingMoment: input.bendingMoment * 1.35582,

      storeys: input.storeys,
      wallCount: input.wallCount,

      fck: input.fck,
      fy: input.fy,
      cover: input.cover,

      verticalBarDia: input.verticalBarDia,
      horizontalBarDia: input.horizontalBarDia,
      boundaryBarDia: input.boundaryBarDia,
      minSteelRatio: input.minSteelRatio,

      concreteRate: input.concreteRate,
      steelRate: input.steelRate,
      shutteringRate: input.shutteringRate,
    }
  }

  return {
    wallLength: input.wallLength,
    wallHeight: input.wallHeight,
    thickness: input.thickness,

    axialLoad: input.axialLoad,
    shearForce: input.shearForce,
    bendingMoment: input.bendingMoment,

    storeys: input.storeys,
    wallCount: input.wallCount,

    fck: input.fck,
    fy: input.fy,
    cover: input.cover,

    verticalBarDia: input.verticalBarDia,
    horizontalBarDia: input.horizontalBarDia,
    boundaryBarDia: input.boundaryBarDia,
    minSteelRatio: input.minSteelRatio,

    concreteRate: input.concreteRate,
    steelRate: input.steelRate,
    shutteringRate: input.shutteringRate,
  }
}

function getSpacing({ astPerMeter, dia, faces, maxSpacing = 300 }) {
  const area = barArea(dia)
  const spacingRaw = (faces * area * 1000) / Math.max(astPerMeter, 1)

  const spacing = Math.max(
    75,
    Math.min(maxSpacing, Math.floor(spacingRaw / 25) * 25)
  )

  return {
    spacing,
    spacingRaw,
  }
}

function computeShearWall(input, override = {}) {
  const base = convertToMetric(input)

  const m = {
    ...base,
    ...override,
  }

  const L = Math.max(m.wallLength, 0.5)
  const H = Math.max(m.wallHeight, 0.5)
  const t = Math.max(m.thickness, 100)

  const Lmm = L * 1000
  const Hmm = H * 1000
  const tmm = t

  const Pu = Math.max(m.axialLoad, 0)
  const Vu = Math.max(m.shearForce, 0)
  const Mu = Math.max(m.bendingMoment, 0)

  const A = tmm * Lmm
  const I = (tmm * Math.pow(Lmm, 3)) / 12

  const sigmaAxial = (Pu * 1000) / A
  const sigmaBending = (Mu * 1000000 * (Lmm / 2)) / I

  const edgeCompression = sigmaAxial + sigmaBending
  const edgeTension = sigmaAxial - sigmaBending

  const effectiveDepth = 0.8 * Lmm
  const shearStress = (Vu * 1000) / (tmm * effectiveDepth)

  const preliminaryShearLimit = 0.62 * Math.sqrt(m.fck)
  const maxShearLimit = 0.8 * Math.sqrt(m.fck)

  const aspectRatio = H / L
  const slenderness = H / (tmm / 1000)

  const faces = tmm >= 200 ? 2 : 1

  const minRatio = Math.max(m.minSteelRatio, 0.12) / 100
  const grossAreaPerMeter = tmm * 1000

  const minVerticalAstPerMeter = minRatio * grossAreaPerMeter
  const minHorizontalAstPerMeter = minRatio * grossAreaPerMeter

  const leverArm = 0.8 * Lmm

  const flexuralTensionForce = Math.max(
    (Mu * 1000000) / leverArm - (Pu * 1000) / 2,
    0
  )

  const flexuralAstTotal = flexuralTensionForce / (0.87 * m.fy)
  const flexuralAstPerMeter = flexuralAstTotal / L

  const requiredVerticalAstPerMeter = Math.max(
    minVerticalAstPerMeter,
    flexuralAstPerMeter
  )

  const extraHorizontalAst =
    shearStress > preliminaryShearLimit
      ? ((Vu * 1000) / (0.87 * m.fy * Lmm)) * 1000
      : 0

  const requiredHorizontalAstPerMeter = Math.max(
    minHorizontalAstPerMeter,
    extraHorizontalAst
  )

  const verticalSpacingData = getSpacing({
    astPerMeter: requiredVerticalAstPerMeter,
    dia: m.verticalBarDia,
    faces,
    maxSpacing: Math.min(300, 3 * tmm),
  })

  const horizontalSpacingData = getSpacing({
    astPerMeter: requiredHorizontalAstPerMeter,
    dia: m.horizontalBarDia,
    faces,
    maxSpacing: Math.min(300, 3 * tmm),
  })

  const boundaryRequired =
    edgeCompression > 0.2 * m.fck ||
    edgeTension < -0.1 * m.fck ||
    Mu > 0.4 * Math.max(Pu, 1) * L

  const boundaryLength = boundaryRequired ? Math.max(0.15 * L, 0.3) : 0
  const boundaryAreaEach = boundaryLength * 1000 * tmm
  const boundarySteelRatio = boundaryRequired ? 0.008 : 0
  const boundaryAstEach = boundaryAreaEach * boundarySteelRatio

  const boundaryBarsEach = boundaryRequired
    ? Math.max(4, Math.ceil(boundaryAstEach / barArea(m.boundaryBarDia)))
    : 0

  const boundaryAstProvided = boundaryBarsEach * barArea(m.boundaryBarDia)

  const verticalBarsPerLayer =
    Math.ceil((Lmm - 2 * m.cover) / verticalSpacingData.spacing) + 1

  const horizontalBarsPerLayer =
    Math.ceil((Hmm - 2 * m.cover) / horizontalSpacingData.spacing) + 1

  const verticalSteelKgPerWall =
    verticalBarsPerLayer * faces * H * barWeight(m.verticalBarDia)

  const horizontalSteelKgPerWall =
    horizontalBarsPerLayer * faces * L * barWeight(m.horizontalBarDia)

  const boundarySteelKgPerWall = boundaryRequired
    ? boundaryBarsEach * 2 * H * barWeight(m.boundaryBarDia)
    : 0

  const totalWallUnits = Math.max(m.storeys, 1) * Math.max(m.wallCount, 1)

  const steelKgTotal =
    (verticalSteelKgPerWall +
      horizontalSteelKgPerWall +
      boundarySteelKgPerWall) *
    totalWallUnits

  const steelWithWastage = steelKgTotal * 1.1

  const concreteVolumePerWall = L * (tmm / 1000) * H
  const concreteVolumeTotal = concreteVolumePerWall * totalWallUnits

  const shutteringAreaPerWall = 2 * L * H
  const shutteringAreaTotal = shutteringAreaPerWall * totalWallUnits

  const concreteCost = concreteVolumeTotal * m.concreteRate
  const steelCost = steelWithWastage * m.steelRate
  const shutteringCost = shutteringAreaTotal * m.shutteringRate
  const estimatedCost = concreteCost + steelCost + shutteringCost

  const checks = {
    axialStress: sigmaAxial <= 0.25 * m.fck,
    shearStress: shearStress <= preliminaryShearLimit,
    maxShear: shearStress <= maxShearLimit,
    edgeCompression: edgeCompression <= 0.45 * m.fck,
    slenderness: slenderness <= 35,
    minimumThickness: tmm >= 150,
  }

  const overallSafe =
    checks.axialStress &&
    checks.shearStress &&
    checks.maxShear &&
    checks.edgeCompression &&
    checks.minimumThickness

  const recommendations = []

  if (!checks.minimumThickness) {
    recommendations.push(
      'Wall thickness kam hai. Practical RCC shear wall ke liye thickness increase karo.'
    )
  }

  if (!checks.shearStress) {
    recommendations.push(
      'Shear stress high hai. Wall thickness ya wall length increase karo, ya additional horizontal shear reinforcement provide karo.'
    )
  }

  if (!checks.edgeCompression) {
    recommendations.push(
      'Edge compression high hai. Boundary element, thicker wall, longer wall ya load distribution revise karo.'
    )
  }

  if (boundaryRequired) {
    recommendations.push(
      'Boundary element recommended hai. Dono ends par confined boundary zone provide karo.'
    )
  }

  if (!checks.slenderness) {
    recommendations.push(
      'Wall slenderness high hai. Thickness badhao ya intermediate lateral restraint verify karo.'
    )
  }

  if (aspectRatio > 3) {
    recommendations.push(
      'Wall height-to-length ratio high hai. Flexural behaviour dominant hoga, boundary detailing important rahegi.'
    )
  }

  if (recommendations.length === 0) {
    recommendations.push(
      'Preliminary shear wall checks safe hain. Final detailing, ductility, openings, coupling beams aur load combinations structural engineer se verify karo.'
    )
  }

  return {
    m,
    L,
    H,
    tmm,
    Lmm,
    Hmm,
    Pu,
    Vu,
    Mu,
    A,
    I,
    sigmaAxial,
    sigmaBending,
    edgeCompression,
    edgeTension,
    shearStress,
    preliminaryShearLimit,
    maxShearLimit,
    aspectRatio,
    slenderness,
    faces,

    minVerticalAstPerMeter,
    minHorizontalAstPerMeter,
    flexuralAstTotal,
    flexuralAstPerMeter,
    requiredVerticalAstPerMeter,
    requiredHorizontalAstPerMeter,

    verticalSpacing: verticalSpacingData.spacing,
    verticalSpacingRaw: verticalSpacingData.spacingRaw,
    horizontalSpacing: horizontalSpacingData.spacing,
    horizontalSpacingRaw: horizontalSpacingData.spacingRaw,

    boundaryRequired,
    boundaryLength,
    boundaryAstEach,
    boundaryAstProvided,
    boundaryBarsEach,

    verticalBarsPerLayer,
    horizontalBarsPerLayer,
    verticalSteelKgPerWall,
    horizontalSteelKgPerWall,
    boundarySteelKgPerWall,

    steelKgTotal,
    steelWithWastage,
    concreteVolumePerWall,
    concreteVolumeTotal,
    shutteringAreaTotal,

    concreteCost,
    steelCost,
    shutteringCost,
    estimatedCost,

    checks,
    overallSafe,
    recommendations,
  }
}

function chooseDiaBySpacing({
  input,
  fieldName,
  getSpacingResult,
  candidates,
  minSpacing = 100,
  maxSpacing = 250,
  targetSpacing = 150,
}) {
  const trials = candidates
    .map((dia) => {
      const trialInput = {
        ...input,
        [fieldName]: dia,
      }

      const result = computeShearWall(trialInput)
      const spacing = getSpacingResult(result)

      return {
        dia,
        spacing,
      }
    })
    .filter((item) => Number.isFinite(item.spacing) && item.spacing > 0)

  const practical = trials.find(
    (item) => item.spacing >= minSpacing && item.spacing <= maxSpacing
  )

  if (practical) return practical.dia

  const closest = [...trials].sort(
    (a, b) =>
      Math.abs(a.spacing - targetSpacing) -
      Math.abs(b.spacing - targetSpacing)
  )[0]

  return closest?.dia || candidates[0]
}

function chooseBoundaryDia(input) {
  const firstTrial = computeShearWall(input)

  if (!firstTrial.boundaryRequired) {
    return 16
  }

  const trials = BOUNDARY_BAR_DIA_OPTIONS.map((dia) => {
    const trialInput = {
      ...input,
      boundaryBarDia: dia,
    }

    const result = computeShearWall(trialInput)

    return {
      dia,
      bars: result.boundaryBarsEach,
      astProvided: result.boundaryAstProvided,
      astRequired: result.boundaryAstEach,
    }
  })

  const practical = trials.find(
    (item) => item.bars >= 4 && item.bars <= 10 && item.astProvided >= item.astRequired
  )

  if (practical) return practical.dia

  const closest = [...trials].sort((a, b) => a.bars - b.bars)[0]

  return closest?.dia || 16
}

function autoFillBarDiameters(input) {
  if (input.barDesignMode !== 'auto') return input

  let draft = {
    ...input,
  }

  const verticalDia = chooseDiaBySpacing({
    input: draft,
    fieldName: 'verticalBarDia',
    getSpacingResult: (result) => result.verticalSpacing,
    candidates: VERTICAL_BAR_DIA_OPTIONS,
    minSpacing: 100,
    maxSpacing: 250,
    targetSpacing: 150,
  })

  draft = {
    ...draft,
    verticalBarDia: verticalDia,
  }

  const horizontalDia = chooseDiaBySpacing({
    input: draft,
    fieldName: 'horizontalBarDia',
    getSpacingResult: (result) => result.horizontalSpacing,
    candidates: HORIZONTAL_BAR_DIA_OPTIONS,
    minSpacing: 100,
    maxSpacing: 250,
    targetSpacing: 150,
  })

  draft = {
    ...draft,
    horizontalBarDia: horizontalDia,
  }

  const boundaryDia = chooseBoundaryDia(draft)

  draft = {
    ...draft,
    boundaryBarDia: boundaryDia,
  }

  return draft
}

function findOptimizedWall(input) {
  const m = convertToMetric(input)
  const currentL = Math.max(m.wallLength, 0.5)

  for (let t = 150; t <= 500; t += 25) {
    const trialInput = autoFillBarDiameters({
      ...input,
      thickness: t,
    })

    const trial = computeShearWall(trialInput)

    if (trial.overallSafe) {
      return {
        thickness: t,
        wallLength: currentL,
        trialInput,
        results: trial,
      }
    }
  }

  for (let L = currentL + 0.25; L <= currentL + 3; L += 0.25) {
    for (let t = 200; t <= 600; t += 25) {
      const trialInput = autoFillBarDiameters({
        ...input,
        wallLength: L,
        thickness: t,
      })

      const trial = computeShearWall(trialInput)

      if (trial.overallSafe) {
        return {
          thickness: t,
          wallLength: L,
          trialInput,
          results: trial,
        }
      }
    }
  }

  return null
}

export default function ShearWallDesignPage() {
  const [inputs, setInputs] = useState(defaultInputs)
  const [calculatedInputs, setCalculatedInputs] = useState(null)
  const [hasCalculated, setHasCalculated] = useState(false)

  const isMetric = inputs.unitSystem === 'metric'

  const unit = {
    length: isMetric ? 'm' : 'ft',
    thickness: isMetric ? 'mm' : 'inch',
    load: isMetric ? 'kN' : 'kip',
    shear: isMetric ? 'kN' : 'kip',
    moment: isMetric ? 'kNm' : 'kip-ft',
  }

  const resultInput = calculatedInputs || inputs

  const results = useMemo(() => computeShearWall(resultInput), [resultInput])

  const optimized = useMemo(() => {
    if (!hasCalculated) return null
    return findOptimizedWall(resultInput)
  }, [hasCalculated, resultInput])

  const updateInput = (key, value) => {
    if (key === 'unitSystem') {
      const freshInputs = value === 'metric' ? defaultInputs : imperialDefaults
      setInputs(freshInputs)
      setCalculatedInputs(null)
      setHasCalculated(false)
      return
    }

    if (key === 'barDesignMode') {
      setInputs((prev) => ({
        ...prev,
        [key]: value,
      }))

      setCalculatedInputs(null)
      setHasCalculated(false)
      return
    }

    setInputs((prev) => ({
      ...prev,
      [key]: safeNumber(value),
    }))

    setCalculatedInputs(null)
    setHasCalculated(false)
  }

  const handleCalculate = () => {
    const preparedInputs = autoFillBarDiameters(inputs)

    setInputs(preparedInputs)
    setCalculatedInputs(preparedInputs)
    setHasCalculated(true)

    setTimeout(() => {
      document
        .getElementById('shear-wall-results')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  const resetAll = () => {
    const freshInputs = isMetric ? defaultInputs : imperialDefaults

    setInputs(freshInputs)
    setCalculatedInputs(null)
    setHasCalculated(false)
  }

  const applyOptimizedDesign = () => {
    if (!optimized) return

    let updatedInputs

    if (isMetric) {
      updatedInputs = {
        ...inputs,
        thickness: Math.round(optimized.thickness),
        wallLength: Number(round(optimized.wallLength, 2)),
      }
    } else {
      updatedInputs = {
        ...inputs,
        thickness: Number(round(optimized.thickness / 25.4, 1)),
        wallLength: Number(round(optimized.wallLength / 0.3048, 2)),
      }
    }

    const preparedInputs = autoFillBarDiameters(updatedInputs)

    setInputs(preparedInputs)
    setCalculatedInputs(preparedInputs)
    setHasCalculated(true)
  }

  const downloadPdf = async () => {
    try {
      const { default: jsPDF } = await import('jspdf')
      const doc = new jsPDF()

      doc.setFontSize(16)
      doc.text('Shear Wall Design Report', 14, 18)

      doc.setFontSize(10)
      doc.text('CivilCalc Pro - Practical RCC Shear Wall Summary', 14, 26)

      const lines = [
        `Wall Length: ${round(resultInput.wallLength)} ${unit.length}`,
        `Storey Height: ${round(resultInput.wallHeight)} ${unit.length}`,
        `Wall Thickness: ${round(resultInput.thickness)} ${unit.thickness}`,
        `Axial Load Pu: ${round(resultInput.axialLoad)} ${unit.load}`,
        `Shear Force Vu: ${round(resultInput.shearForce)} ${unit.shear}`,
        `Moment Mu: ${round(resultInput.bendingMoment)} ${unit.moment}`,
        `Axial Stress: ${round(results.sigmaAxial)} N/mm2`,
        `Edge Compression: ${round(results.edgeCompression)} N/mm2`,
        `Edge Tension: ${round(results.edgeTension)} N/mm2`,
        `Shear Stress: ${round(results.shearStress)} N/mm2`,
        `Vertical Steel: ${resultInput.verticalBarDia} mm @ ${results.verticalSpacing} mm c/c`,
        `Horizontal Steel: ${resultInput.horizontalBarDia} mm @ ${results.horizontalSpacing} mm c/c`,
        `Boundary Element: ${results.boundaryRequired ? 'Required' : 'Not Required'}`,
        `Boundary Bars: ${results.boundaryRequired ? `${results.boundaryBarsEach} bars of ${resultInput.boundaryBarDia} mm each end` : 'Not Required'}`,
        `Concrete Quantity: ${round(results.concreteVolumeTotal)} m3`,
        `Steel Quantity With Wastage: ${round(results.steelWithWastage)} kg`,
        `Estimated Cost: Rs ${round(results.estimatedCost, 0)}`,
        `Overall Status: ${results.overallSafe ? 'SAFE' : 'REVISION REQUIRED'}`,
      ]

      let y = 38
      lines.forEach((line) => {
        doc.text(line, 14, y)
        y += 7
      })

      y += 5
      doc.setFontSize(12)
      doc.text('Recommendations:', 14, y)
      y += 7

      doc.setFontSize(9)
      results.recommendations.forEach((item, index) => {
        doc.text(`${index + 1}. ${item}`, 14, y, { maxWidth: 180 })
        y += 10
      })

      doc.setFontSize(8)
      doc.text(
        'Note: This is a preliminary design report. Final shear wall design must be verified by a qualified structural engineer.',
        14,
        285,
        { maxWidth: 180 }
      )

      doc.save('shear-wall-design-report.pdf')
    } catch (error) {
      alert('PDF export failed. Please install jspdf.')
    }
  }

  const Field = ({
    label,
    labelHi,
    name,
    suffix,
    step = '0.01',
    min = '0',
  }) => (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-200">
        {label}
        <span className="block text-xs font-normal text-slate-400">
          {labelHi}
        </span>
      </label>

      <div className="flex overflow-hidden rounded-xl border border-slate-700 bg-slate-950">
        <input
          type="number"
          min={min}
          step={step}
          value={inputs[name]}
          onChange={(e) => updateInput(name, e.target.value)}
          className="w-full bg-transparent px-4 py-3 text-white outline-none placeholder:text-slate-500"
        />
        <span className="flex min-w-[82px] items-center justify-center border-l border-slate-700 bg-slate-900 px-3 text-xs text-slate-300">
          {suffix}
        </span>
      </div>
    </div>
  )

  const ResultCard = ({ title, value, subtitle, pass }) => (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-sm text-slate-400">{title}</p>

        {typeof pass === 'boolean' && (
          <span
            className={`rounded-full border px-3 py-1 text-xs font-bold ${statusClass(
              pass
            )}`}
          >
            {pass ? 'SAFE' : 'CHECK'}
          </span>
        )}
      </div>

      <h3 className="text-2xl font-black text-white">{value}</h3>
      {subtitle && <p className="mt-2 text-sm text-slate-400">{subtitle}</p>}
    </div>
  )

  const QuantityCard = ({ title, value, subtitle }) => (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
      <p className="text-sm text-slate-400">{title}</p>
      <h3 className="mt-2 text-2xl font-black text-white">{value}</h3>
      {subtitle && <p className="mt-2 text-xs text-slate-400">{subtitle}</p>}
    </div>
  )

  return (
    <main className="min-h-screen bg-[#050B1F] px-4 py-6 text-white md:px-8 lg:px-12">
      <section className="mx-auto max-w-7xl">
        <div className="mb-8 overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-[#08142f] p-6 shadow-2xl md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-sm font-semibold text-orange-300">
                <Ruler size={16} />
                RCC Shear Wall Design
              </div>

              <h1 className="text-3xl font-black tracking-tight md:text-5xl">
                Shear Wall Design Calculator
              </h1>

              <p className="mt-3 max-w-3xl text-slate-300">
                RCC shear wall ke liye axial load, bending moment, shear force,
                auto bar dia, vertical steel, horizontal steel, boundary element,
                quantity, cost aur PDF report calculate kare.
              </p>

              <p className="mt-2 max-w-3xl text-sm text-slate-400">
                Site engineer ke liye practical shear wall checking, steel
                spacing, boundary zone recommendation aur BBS-style summary.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => updateInput('unitSystem', 'metric')}
                className={`rounded-xl px-5 py-3 text-sm font-bold transition ${
                  isMetric
                    ? 'bg-orange-500 text-white'
                    : 'border border-slate-700 bg-slate-900 text-slate-300'
                }`}
              >
                Metric
              </button>

              <button
                onClick={() => updateInput('unitSystem', 'imperial')}
                className={`rounded-xl px-5 py-3 text-sm font-bold transition ${
                  !isMetric
                    ? 'bg-orange-500 text-white'
                    : 'border border-slate-700 bg-slate-900 text-slate-300'
                }`}
              >
                Imperial
              </button>

              <button
                onClick={resetAll}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-bold text-slate-300 hover:border-orange-500"
              >
                <RotateCcw size={16} />
                Reset
              </button>
            </div>
          </div>
        </div>

        {hasCalculated && (
          <div className="mb-6 rounded-3xl border border-orange-500/20 bg-orange-500/10 p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="flex items-center gap-2 text-xl font-black text-white">
                  <Sparkles className="text-orange-300" size={22} />
                  Auto Thickness Optimizer
                </h2>

                <p className="mt-2 text-sm text-orange-100">
                  Current load ke basis par safe wall thickness aur required wall
                  length suggest karta hai.
                </p>
              </div>

              {optimized ? (
                <button
                  onClick={applyOptimizedDesign}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-500 px-6 py-4 font-black text-white shadow-lg shadow-orange-500/20 hover:bg-orange-600"
                >
                  Apply Optimized Design
                </button>
              ) : (
                <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm font-bold text-red-200">
                  No safe design found. Increase wall length, reduce load, or
                  use stronger section.
                </div>
              )}
            </div>

            {optimized && (
              <div className="mt-5 grid gap-4 md:grid-cols-4">
                <QuantityCard
                  title="Suggested Thickness"
                  value={`${round(optimized.thickness, 0)} mm`}
                  subtitle="Auto safe thickness"
                />

                <QuantityCard
                  title="Suggested Wall Length"
                  value={`${round(optimized.wallLength)} m`}
                  subtitle="Required length"
                />

                <QuantityCard
                  title="Optimized Shear Stress"
                  value={`${round(optimized.results.shearStress)} N/mm²`}
                  subtitle={`Limit ${round(
                    optimized.results.preliminaryShearLimit
                  )} N/mm²`}
                />

                <QuantityCard
                  title="Boundary Element"
                  value={
                    optimized.results.boundaryRequired
                      ? 'Required'
                      : 'Not Required'
                  }
                  subtitle="Based on edge stress"
                />
              </div>
            )}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
              <h2 className="mb-5 flex items-center gap-2 text-xl font-black">
                <Calculator className="text-orange-400" size={22} />
                1. Wall Geometry
              </h2>

              <div className="grid gap-5 md:grid-cols-2">
                <Field
                  label="Wall Length"
                  labelHi="Shear wall horizontal length"
                  name="wallLength"
                  suffix={unit.length}
                />

                <Field
                  label="Storey Height"
                  labelHi="Floor to floor wall height"
                  name="wallHeight"
                  suffix={unit.length}
                />

                <Field
                  label="Wall Thickness"
                  labelHi="Shear wall thickness"
                  name="thickness"
                  suffix={unit.thickness}
                  step="1"
                />

                <Field
                  label="Number of Storeys"
                  labelHi="Quantity estimate ke liye"
                  name="storeys"
                  suffix="Nos"
                  step="1"
                />

                <Field
                  label="Number of Similar Walls"
                  labelHi="Same type walls count"
                  name="wallCount"
                  suffix="Nos"
                  step="1"
                />
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
              <h2 className="mb-5 text-xl font-black">2. Design Loads</h2>

              <div className="grid gap-5 md:grid-cols-2">
                <Field
                  label="Factored Axial Load Pu"
                  labelHi="Wall par vertical load"
                  name="axialLoad"
                  suffix={unit.load}
                />

                <Field
                  label="Factored Shear Force Vu"
                  labelHi="Lateral shear force"
                  name="shearForce"
                  suffix={unit.shear}
                />

                <Field
                  label="Factored Bending Moment Mu"
                  labelHi="In-plane bending moment"
                  name="bendingMoment"
                  suffix={unit.moment}
                />
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
              <h2 className="mb-5 text-xl font-black">3. RCC Design Data</h2>

              <div className="grid gap-5 md:grid-cols-2">
                <Field
                  label="Concrete Grade"
                  labelHi="fck"
                  name="fck"
                  suffix="MPa"
                />

                <Field
                  label="Steel Grade"
                  labelHi="fy"
                  name="fy"
                  suffix="MPa"
                />

                <Field
                  label="Clear Cover"
                  labelHi="Wall clear cover"
                  name="cover"
                  suffix="mm"
                  step="1"
                />

                <Field
                  label="Minimum Steel Ratio"
                  labelHi="Vertical/horizontal minimum steel %"
                  name="minSteelRatio"
                  suffix="%"
                  step="0.01"
                />

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-slate-200">
                    Bar Diameter Mode
                    <span className="block text-xs font-normal text-slate-400">
                      Auto mode me tool vertical, horizontal aur boundary bar dia
                      khud select karega
                    </span>
                  </label>

                  <select
                    value={inputs.barDesignMode}
                    onChange={(e) =>
                      updateInput('barDesignMode', e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none"
                  >
                    <option value="auto">Auto Calculate Bar Dia</option>
                    <option value="manual">Manual Bar Dia</option>
                  </select>
                </div>

                {inputs.barDesignMode === 'auto' && (
                  <div className="md:col-span-2 rounded-2xl border border-orange-500/20 bg-orange-500/10 p-4 text-sm text-orange-100">
                    Auto mode ON hai. Calculate click karne par tool practical
                    spacing ke basis par vertical, horizontal aur boundary bar
                    dia automatically select karega.
                  </div>
                )}

                <Field
                  label="Vertical Bar Dia"
                  labelHi={
                    inputs.barDesignMode === 'auto'
                      ? 'Auto mode me calculate ke baad update hoga'
                      : 'Main vertical reinforcement'
                  }
                  name="verticalBarDia"
                  suffix="mm"
                  step="1"
                />

                <Field
                  label="Horizontal Bar Dia"
                  labelHi={
                    inputs.barDesignMode === 'auto'
                      ? 'Auto mode me calculate ke baad update hoga'
                      : 'Horizontal reinforcement'
                  }
                  name="horizontalBarDia"
                  suffix="mm"
                  step="1"
                />

                <Field
                  label="Boundary Bar Dia"
                  labelHi={
                    inputs.barDesignMode === 'auto'
                      ? 'Auto mode me calculate ke baad update hoga'
                      : 'Boundary element vertical bars'
                  }
                  name="boundaryBarDia"
                  suffix="mm"
                  step="1"
                />
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
              <h2 className="mb-5 text-xl font-black">4. Rate Inputs</h2>

              <div className="grid gap-5 md:grid-cols-2">
                <Field
                  label="Concrete Rate"
                  labelHi="RCC rate per m³"
                  name="concreteRate"
                  suffix="₹/m³"
                />

                <Field
                  label="Steel Rate"
                  labelHi="Steel rate per kg"
                  name="steelRate"
                  suffix="₹/kg"
                />

                <Field
                  label="Shuttering Rate"
                  labelHi="Formwork rate per m²"
                  name="shutteringRate"
                  suffix="₹/m²"
                />
              </div>
            </div>

            <div className="sticky bottom-4 z-20 rounded-3xl border border-orange-500/30 bg-slate-950/95 p-4 shadow-2xl backdrop-blur">
              <button
                onClick={handleCalculate}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 px-6 py-4 text-lg font-black text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600"
              >
                <Calculator size={20} />
                Calculate Shear Wall Design
              </button>

              <p className="mt-3 text-center text-xs text-slate-400">
                Input fill karne ke baad calculate click karo. Auto bar dia mode
                ON hoga toh dia bhi automatically select hoga.
              </p>
            </div>
          </div>

          <div id="shear-wall-results" className="space-y-6">
            {!hasCalculated ? (
              <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 text-center">
                <Calculator className="mx-auto mb-4 text-orange-400" size={46} />

                <h2 className="text-2xl font-black text-white">
                  Fill Inputs & Click Calculate
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Shear wall ka diagram, design check, auto bar dia,
                  reinforcement, boundary element, quantity, BBS aur PDF report
                  calculate button click karne ke baad show hoga.
                </p>
              </div>
            ) : (
              <>
                <div className="rounded-3xl border border-slate-800 bg-slate-950 p-6">
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <h2 className="text-xl font-black">Shear Wall Diagram</h2>

                    <span
                      className={`rounded-full border px-4 py-2 text-xs font-black ${
                        results.overallSafe
                          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                          : 'border-red-500/30 bg-red-500/10 text-red-300'
                      }`}
                    >
                      {results.overallSafe
                        ? 'OVERALL SAFE'
                        : 'REVISION NEEDED'}
                    </span>
                  </div>

                  <div className="rounded-2xl border border-slate-800 bg-[#071027] p-4">
                    <svg viewBox="0 0 560 360" className="h-auto w-full">
                      <rect
                        x="0"
                        y="0"
                        width="560"
                        height="360"
                        fill="#071027"
                      />

                      <rect
                        x="225"
                        y="45"
                        width="110"
                        height="245"
                        rx="8"
                        fill="#475569"
                        stroke="#cbd5e1"
                        strokeOpacity="0.45"
                        strokeWidth="2"
                      />

                      <rect
                        x="238"
                        y="60"
                        width="14"
                        height="215"
                        rx="4"
                        fill="#f97316"
                        opacity="0.95"
                      />

                      <rect
                        x="308"
                        y="60"
                        width="14"
                        height="215"
                        rx="4"
                        fill="#f97316"
                        opacity="0.95"
                      />

                      {[80, 115, 150, 185, 220, 255].map((y) => (
                        <line
                          key={y}
                          x1="238"
                          y1={y}
                          x2="322"
                          y2={y}
                          stroke="#fbbf24"
                          strokeWidth="3"
                        />
                      ))}

                      {results.boundaryRequired && (
                        <>
                          <rect
                            x="225"
                            y="45"
                            width="32"
                            height="245"
                            fill="#ef4444"
                            opacity="0.22"
                          />
                          <rect
                            x="303"
                            y="45"
                            width="32"
                            height="245"
                            fill="#ef4444"
                            opacity="0.22"
                          />
                          <text x="360" y="95" fill="#fca5a5" fontSize="13">
                            Boundary Zone
                          </text>
                        </>
                      )}

                      <line
                        x1="150"
                        y1="168"
                        x2="218"
                        y2="168"
                        stroke="#38bdf8"
                        strokeWidth="4"
                      />
                      <text x="92" y="160" fill="#7dd3fc" fontSize="13">
                        Vu
                      </text>

                      <path
                        d="M344 75 C430 120 430 230 344 275"
                        fill="none"
                        stroke="#fb923c"
                        strokeWidth="4"
                        strokeDasharray="8 6"
                      />
                      <text x="420" y="185" fill="#fdba74" fontSize="13">
                        Mu
                      </text>

                      <line
                        x1="225"
                        y1="315"
                        x2="335"
                        y2="315"
                        stroke="#93c5fd"
                      />
                      <text x="242" y="337" fill="#93c5fd" fontSize="13">
                        Lw = {round(results.L)} m
                      </text>

                      <text
                        x="42"
                        y="185"
                        fill="#cbd5e1"
                        fontSize="13"
                        transform="rotate(-90 42 185)"
                      >
                        H = {round(results.H)} m
                      </text>

                      <text x="350" y="60" fill="#e2e8f0" fontSize="12">
                        t = {round(results.tmm, 0)} mm
                      </text>

                      <text x="225" y="30" fill="#e2e8f0" fontSize="13">
                        RCC Shear Wall
                      </text>
                    </svg>
                  </div>

                  <button
                    onClick={downloadPdf}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 px-5 py-4 font-black text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600"
                  >
                    <Download size={18} />
                    Download PDF Report
                  </button>
                </div>

                {calculatedInputs?.barDesignMode === 'auto' && (
                  <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-6">
                    <h3 className="mb-4 text-xl font-black text-emerald-200">
                      Auto Selected Bar Diameters
                    </h3>

                    <div className="grid gap-3 text-sm text-emerald-100 sm:grid-cols-3">
                      <p>Vertical Bar: {calculatedInputs.verticalBarDia} mm</p>
                      <p>
                        Horizontal Bar: {calculatedInputs.horizontalBarDia} mm
                      </p>
                      <p>Boundary Bar: {calculatedInputs.boundaryBarDia} mm</p>
                    </div>
                  </div>
                )}

                <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
                  <h2 className="mb-4 text-xl font-black">
                    Design Check Summary
                  </h2>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <ResultCard
                      title="Shear Stress"
                      value={`${round(results.shearStress)} N/mm²`}
                      subtitle={`Limit ${round(
                        results.preliminaryShearLimit
                      )} N/mm²`}
                      pass={results.checks.shearStress}
                    />

                    <ResultCard
                      title="Maximum Shear Limit"
                      value={`${round(results.maxShearLimit)} N/mm²`}
                      subtitle="Absolute preliminary limit"
                      pass={results.checks.maxShear}
                    />

                    <ResultCard
                      title="Axial Stress"
                      value={`${round(results.sigmaAxial)} N/mm²`}
                      subtitle={`Limit approx ${round(
                        0.25 * results.m.fck
                      )} N/mm²`}
                      pass={results.checks.axialStress}
                    />

                    <ResultCard
                      title="Edge Compression"
                      value={`${round(results.edgeCompression)} N/mm²`}
                      subtitle={`Limit approx ${round(
                        0.45 * results.m.fck
                      )} N/mm²`}
                      pass={results.checks.edgeCompression}
                    />

                    <ResultCard
                      title="Edge Tension"
                      value={`${round(results.edgeTension)} N/mm²`}
                      subtitle="Negative means tension at edge"
                    />

                    <ResultCard
                      title="Aspect Ratio"
                      value={round(results.aspectRatio)}
                      subtitle="H / Lw"
                    />

                    <ResultCard
                      title="Slenderness"
                      value={round(results.slenderness)}
                      subtitle="H / thickness"
                      pass={results.checks.slenderness}
                    />

                    <ResultCard
                      title="Boundary Element"
                      value={
                        results.boundaryRequired
                          ? 'Required'
                          : 'Not Required'
                      }
                      subtitle={
                        results.boundaryRequired
                          ? `Zone length ${round(
                              results.boundaryLength
                            )} m each end`
                          : 'Normal end zone ok'
                      }
                    />
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
                  <h2 className="mb-4 flex items-center gap-2 text-xl font-black">
                    <AlertTriangle className="text-orange-400" size={22} />
                    Practical Recommendations
                  </h2>

                  <div className="space-y-3">
                    {results.recommendations.map((item, index) => (
                      <div
                        key={index}
                        className="rounded-2xl border border-orange-500/20 bg-orange-500/10 p-4 text-sm leading-6 text-orange-100"
                      >
                        {index + 1}. {item}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
                  <h2 className="mb-4 flex items-center gap-2 text-xl font-black">
                    <ClipboardList className="text-emerald-400" size={22} />
                    Site Checklist
                  </h2>

                  <div className="space-y-3 text-sm text-slate-300">
                    <p>✓ Wall thickness site drawing ke according verify karo.</p>
                    <p>
                      ✓ Vertical bars dono faces par proper spacing me place
                      karo.
                    </p>
                    <p>
                      ✓ Horizontal bars continuous rakho aur lap location stagger
                      karo.
                    </p>
                    <p>
                      ✓ Boundary element required ho toh extra confinement
                      provide karo.
                    </p>
                    <p>
                      ✓ Openings, door cut-outs aur coupling beams separately
                      design karo.
                    </p>
                    <p>
                      ✓ Foundation connection me dowel bars aur development
                      length verify karo.
                    </p>
                    <p>
                      ✓ Concrete cover, chair support aur bar alignment site par
                      check karo.
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {hasCalculated && (
          <>
            <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
              <h2 className="mb-5 flex items-center gap-2 text-xl font-black">
                <Hammer className="text-orange-400" size={22} />
                Reinforcement Design Summary
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[860px] overflow-hidden rounded-2xl text-left text-sm">
                  <thead className="bg-slate-950 text-slate-300">
                    <tr>
                      <th className="px-4 py-4">Reinforcement</th>
                      <th className="px-4 py-4">Required Ast</th>
                      <th className="px-4 py-4">Recommended Bars</th>
                      <th className="px-4 py-4">Quantity</th>
                      <th className="px-4 py-4">Site Note</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr className="border-b border-slate-800">
                      <td className="px-4 py-4 font-semibold text-white">
                        Vertical Main Steel
                      </td>
                      <td className="px-4 py-4 text-slate-300">
                        {round(results.requiredVerticalAstPerMeter)} mm²/m
                      </td>
                      <td className="px-4 py-4 text-orange-300">
                        {resultInput.verticalBarDia} mm @{' '}
                        {results.verticalSpacing} mm c/c
                      </td>
                      <td className="px-4 py-4 text-slate-300">
                        {round(results.verticalSteelKgPerWall)} kg/wall
                      </td>
                      <td className="px-4 py-4 text-slate-400">
                        {results.faces} face reinforcement
                      </td>
                    </tr>

                    <tr className="border-b border-slate-800">
                      <td className="px-4 py-4 font-semibold text-white">
                        Horizontal Steel
                      </td>
                      <td className="px-4 py-4 text-slate-300">
                        {round(results.requiredHorizontalAstPerMeter)} mm²/m
                      </td>
                      <td className="px-4 py-4 text-orange-300">
                        {resultInput.horizontalBarDia} mm @{' '}
                        {results.horizontalSpacing} mm c/c
                      </td>
                      <td className="px-4 py-4 text-slate-300">
                        {round(results.horizontalSteelKgPerWall)} kg/wall
                      </td>
                      <td className="px-4 py-4 text-slate-400">
                        Distributed along height
                      </td>
                    </tr>

                    <tr className="border-b border-slate-800">
                      <td className="px-4 py-4 font-semibold text-white">
                        Boundary Element Steel
                      </td>
                      <td className="px-4 py-4 text-slate-300">
                        {results.boundaryRequired
                          ? `${round(results.boundaryAstEach)} mm² each end`
                          : 'Not required'}
                      </td>
                      <td className="px-4 py-4 text-orange-300">
                        {results.boundaryRequired
                          ? `${results.boundaryBarsEach} bars of ${resultInput.boundaryBarDia} mm each end`
                          : '—'}
                      </td>
                      <td className="px-4 py-4 text-slate-300">
                        {round(results.boundarySteelKgPerWall)} kg/wall
                      </td>
                      <td className="px-4 py-4 text-slate-400">
                        Confined end zone
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-950 p-4 text-sm text-slate-300">
                <strong className="text-white">Placement hint:</strong> Thickness
                200 mm ya usse zyada ho toh generally reinforcement dono faces
                par dena practical hota hai. Boundary required ho toh end zone par
                closely tied vertical bars aur confinement provide karo.
              </div>
            </div>

            <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
              <h2 className="mb-5 text-xl font-black">
                Quantity Estimate & Cost Summary
              </h2>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <QuantityCard
                  title="Concrete Quantity"
                  value={`${round(results.concreteVolumeTotal)} m³`}
                  subtitle={`${round(
                    results.concreteVolumePerWall
                  )} m³ per wall per storey`}
                />

                <QuantityCard
                  title="Steel Quantity"
                  value={`${round(results.steelWithWastage)} kg`}
                  subtitle="Includes approx 10% wastage"
                />

                <QuantityCard
                  title="Shuttering Area"
                  value={`${round(results.shutteringAreaTotal)} m²`}
                  subtitle="Both faces considered"
                />

                <QuantityCard
                  title="Estimated Cost"
                  value={money(results.estimatedCost)}
                  subtitle="Concrete + steel + shuttering"
                />

                <QuantityCard
                  title="Vertical Bars"
                  value={`${results.verticalBarsPerLayer} Nos/layer`}
                  subtitle={`${results.faces} face system`}
                />

                <QuantityCard
                  title="Horizontal Bars"
                  value={`${results.horizontalBarsPerLayer} Nos/layer`}
                  subtitle="Along height"
                />

                <QuantityCard
                  title="Boundary Bars"
                  value={
                    results.boundaryRequired
                      ? `${results.boundaryBarsEach} Nos each end`
                      : 'Not required'
                  }
                  subtitle="Boundary element check"
                />

                <QuantityCard
                  title="Total Wall Units"
                  value={`${inputs.storeys * inputs.wallCount} Nos`}
                  subtitle="Storeys × wall count"
                />
              </div>
            </div>

            <div className="mt-6 rounded-3xl border border-orange-500/20 bg-orange-500/10 p-6 text-sm leading-7 text-orange-100">
              <strong>Important:</strong> Ye shear wall calculator preliminary
              design, site checking, quantity aur reinforcement planning ke liye
              hai. Final design me load combinations, ductile detailing, boundary
              element, coupling beam, openings, foundation connection aur
              applicable code requirements structural engineer se verify karna
              zaroori hai.
            </div>
          </>
        )}
      </section>
    </main>
  )
}
