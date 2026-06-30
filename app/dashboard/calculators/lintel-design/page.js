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

  openingWidth: 1.2,
  bearingLength: 150,
  wallThickness: 230,
  lintelDepth: 200,
  lintelWidth: 230,
  wallHeightAbove: 0.9,

  useArchingAction: true,

  masonryUnitWeight: 20,
  concreteUnitWeight: 25,
  plasterLoad: 0.5,
  additionalLineLoad: 0,

  slabLoadEnabled: false,
  slabLoadIntensity: 5,
  slabTributaryWidth: 1.0,

  pointLoadEnabled: false,
  pointLoad: 0,
  pointLoadPosition: 0.5,

  fck: 25,
  fy: 500,
  cover: 25,

  barDesignMode: 'auto',

  mainBarDia: 12,
  topBarDia: 10,
  stirrupDia: 8,
  stirrupLegs: 2,

  masonryAllowableBearing: 1.0,

  numberOfLintels: 1,
  concreteRate: 6500,
  steelRate: 65,
  shutteringRate: 550,
}

const imperialDefaults = {
  ...defaultInputs,
  unitSystem: 'imperial',

  openingWidth: 4,
  bearingLength: 6,
  wallThickness: 9,
  lintelDepth: 8,
  lintelWidth: 9,
  wallHeightAbove: 3,

  masonryUnitWeight: 125,
  concreteUnitWeight: 150,
  plasterLoad: 35,
  additionalLineLoad: 0,

  slabLoadIntensity: 100,
  slabTributaryWidth: 3,

  pointLoad: 0,
  pointLoadPosition: 0.5,
}

const MAIN_BAR_DIA_OPTIONS = [10, 12, 16, 20, 25]
const TOP_BAR_DIA_OPTIONS = [8, 10, 12, 16]
const STIRRUP_DIA_OPTIONS = [6, 8, 10, 12]

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
      openingWidth: input.openingWidth * 0.3048,
      bearingLength: input.bearingLength * 25.4,
      wallThickness: input.wallThickness * 25.4,
      lintelDepth: input.lintelDepth * 25.4,
      lintelWidth: input.lintelWidth * 25.4,
      wallHeightAbove: input.wallHeightAbove * 0.3048,

      masonryUnitWeight: input.masonryUnitWeight * 0.157087,
      concreteUnitWeight: input.concreteUnitWeight * 0.157087,
      plasterLoad: input.plasterLoad * 0.0145939,
      additionalLineLoad: input.additionalLineLoad * 0.0145939,

      slabLoadIntensity: input.slabLoadIntensity * 0.0478803,
      slabTributaryWidth: input.slabTributaryWidth * 0.3048,

      pointLoad: input.pointLoad * 4.44822,
      pointLoadPosition: input.pointLoadPosition,

      fck: input.fck,
      fy: input.fy,
      cover: input.cover,

      mainBarDia: input.mainBarDia,
      topBarDia: input.topBarDia,
      stirrupDia: input.stirrupDia,
      stirrupLegs: input.stirrupLegs,

      masonryAllowableBearing: input.masonryAllowableBearing,

      numberOfLintels: input.numberOfLintels,
      concreteRate: input.concreteRate,
      steelRate: input.steelRate,
      shutteringRate: input.shutteringRate,
    }
  }

  return {
    openingWidth: input.openingWidth,
    bearingLength: input.bearingLength,
    wallThickness: input.wallThickness,
    lintelDepth: input.lintelDepth,
    lintelWidth: input.lintelWidth,
    wallHeightAbove: input.wallHeightAbove,

    masonryUnitWeight: input.masonryUnitWeight,
    concreteUnitWeight: input.concreteUnitWeight,
    plasterLoad: input.plasterLoad,
    additionalLineLoad: input.additionalLineLoad,

    slabLoadIntensity: input.slabLoadIntensity,
    slabTributaryWidth: input.slabTributaryWidth,

    pointLoad: input.pointLoad,
    pointLoadPosition: input.pointLoadPosition,

    fck: input.fck,
    fy: input.fy,
    cover: input.cover,

    mainBarDia: input.mainBarDia,
    topBarDia: input.topBarDia,
    stirrupDia: input.stirrupDia,
    stirrupLegs: input.stirrupLegs,

    masonryAllowableBearing: input.masonryAllowableBearing,

    numberOfLintels: input.numberOfLintels,
    concreteRate: input.concreteRate,
    steelRate: input.steelRate,
    shutteringRate: input.shutteringRate,
  }
}

function getSteelDesign({ Mu, b, d, D, dia, fy }) {
  const effectiveD = Math.max(d, 50)
  const astCalc = (Mu * 1000000) / (0.87 * fy * 0.9 * effectiveD)
  const astMin = (0.85 * b * D) / fy
  const astReq = Math.max(astCalc, astMin)
  const bars = Math.max(2, Math.ceil(astReq / barArea(dia)))
  const astProvided = bars * barArea(dia)

  return {
    astCalc,
    astMin,
    astReq,
    bars,
    astProvided,
  }
}

function computeLintel(input, override = {}) {
  const base = convertToMetric(input)

  const m = {
    ...base,
    ...override,
  }

  const clearSpan = Math.max(m.openingWidth, 0.3)
  const bearing = Math.max(m.bearingLength, 75)
  const wallT = Math.max(m.wallThickness, 75)
  const b = Math.max(m.lintelWidth, 75)
  const D = Math.max(m.lintelDepth, 100)

  const bearingM = bearing / 1000
  const bM = b / 1000
  const dM = D / 1000

  const effectiveDepth = Math.max(D - m.cover - m.mainBarDia / 2, 50)

  const effectiveSpan = Math.min(
    clearSpan + effectiveDepth / 1000,
    clearSpan + 2 * bearingM
  )

  const totalLength = clearSpan + 2 * bearingM

  const effectiveWallHeight = input.useArchingAction
    ? Math.min(m.wallHeightAbove, clearSpan / 2)
    : m.wallHeightAbove

  const masonryLoad =
    m.masonryUnitWeight * (wallT / 1000) * Math.max(effectiveWallHeight, 0)

  const selfWeight = m.concreteUnitWeight * bM * dM

  const slabLineLoad = input.slabLoadEnabled
    ? m.slabLoadIntensity * m.slabTributaryWidth
    : 0

  const plasterLineLoad = m.plasterLoad
  const additionalLineLoad = m.additionalLineLoad

  const totalServiceUdl =
    masonryLoad + selfWeight + slabLineLoad + plasterLineLoad + additionalLineLoad

  const wu = 1.5 * totalServiceUdl

  const pointLoadService = input.pointLoadEnabled ? Math.max(m.pointLoad, 0) : 0
  const pointLoadUltimate = 1.5 * pointLoadService
  const pointPositionRatio = Math.min(Math.max(m.pointLoadPosition, 0.05), 0.95)
  const a = pointPositionRatio * effectiveSpan
  const bPoint = effectiveSpan - a

  const momentUdl = (wu * effectiveSpan * effectiveSpan) / 8
  const momentPoint = (pointLoadUltimate * a * bPoint) / effectiveSpan
  const Mu = momentUdl + momentPoint

  const reactionUdlService = (totalServiceUdl * effectiveSpan) / 2
  const reactionPointLeftService =
    pointLoadService * (effectiveSpan - a) / effectiveSpan
  const reactionPointRightService = pointLoadService * a / effectiveSpan

  const reactionService = Math.max(
    reactionUdlService + reactionPointLeftService,
    reactionUdlService + reactionPointRightService
  )

  const reactionUltimate = 1.5 * reactionService
  const Vu = reactionUltimate

  const steel = getSteelDesign({
    Mu,
    b,
    d: effectiveDepth,
    D,
    dia: m.mainBarDia,
    fy: m.fy,
  })

  const tauV = (Vu * 1000) / (b * effectiveDepth)
  const shearLimit = 0.62 * Math.sqrt(m.fck)
  const maxShearLimit = 0.8 * Math.sqrt(m.fck)

  const asv = m.stirrupLegs * barArea(m.stirrupDia)

  const excessShear = Math.max(
    Vu * 1000 - shearLimit * b * effectiveDepth,
    0
  )

  const stirrupSpacingRaw =
    excessShear > 0
      ? (0.87 * m.fy * asv * effectiveDepth) / excessShear
      : Math.min(0.75 * effectiveDepth, 300)

  const stirrupSpacing = Math.max(
    75,
    Math.min(
      Math.min(0.75 * effectiveDepth, 300),
      Math.floor(stirrupSpacingRaw / 25) * 25
    )
  )

  const bearingArea = bearing * wallT
  const bearingStress = (reactionService * 1000) / bearingArea

  const spanDepthRatio = (effectiveSpan * 1000) / effectiveDepth

  const topBars = D > 300 ? 3 : 2
  const topAstProvided = topBars * barArea(m.topBarDia)

  const checks = {
    moment: steel.astProvided >= steel.astReq,
    shear: tauV <= shearLimit,
    maxShear: tauV <= maxShearLimit,
    bearing: bearingStress <= m.masonryAllowableBearing,
    deflection: spanDepthRatio <= 20,
    minimumBearing: bearing >= 150,
    practicalDepth: D >= Math.max(150, clearSpan * 1000 / 12),
  }

  const overallSafe =
    checks.moment &&
    checks.maxShear &&
    checks.bearing &&
    checks.minimumBearing &&
    checks.deflection

  const mainBarLength = totalLength + 0.45
  const topBarLength = totalLength + 0.3

  const mainSteelKg = steel.bars * mainBarLength * barWeight(m.mainBarDia)
  const topSteelKg = topBars * topBarLength * barWeight(m.topBarDia)

  const stirrupCount = Math.ceil((totalLength * 1000) / stirrupSpacing) + 1

  const stirrupCutLength =
    2 * ((b - 2 * m.cover) + (D - 2 * m.cover)) / 1000 + 0.18

  const stirrupSteelKg =
    stirrupCount * stirrupCutLength * barWeight(m.stirrupDia)

  const steelKgPerLintel = mainSteelKg + topSteelKg + stirrupSteelKg
  const steelKgTotal = steelKgPerLintel * Math.max(m.numberOfLintels, 1)
  const steelWithWastage = steelKgTotal * 1.08

  const concreteVolumePerLintel = bM * dM * totalLength
  const concreteVolumeTotal =
    concreteVolumePerLintel * Math.max(m.numberOfLintels, 1)

  const shutteringAreaPerLintel = 2 * dM * totalLength + bM * totalLength
  const shutteringAreaTotal =
    shutteringAreaPerLintel * Math.max(m.numberOfLintels, 1)

  const concreteCost = concreteVolumeTotal * m.concreteRate
  const steelCost = steelWithWastage * m.steelRate
  const shutteringCost = shutteringAreaTotal * m.shutteringRate
  const estimatedCost = concreteCost + steelCost + shutteringCost

  const recommendations = []

  if (!checks.minimumBearing) {
    recommendations.push(
      'Bearing length kam hai. Dono side minimum 150 mm ya drawing ke according bearing provide karo.'
    )
  }

  if (!checks.bearing) {
    recommendations.push(
      'Masonry bearing stress high hai. Bearing length badhao ya bearing pad / RCC jamb detail verify karo.'
    )
  }

  if (!checks.shear) {
    recommendations.push(
      'Shear stress high hai. Lintel depth badhao ya closer stirrups provide karo.'
    )
  }

  if (!checks.maxShear) {
    recommendations.push(
      'Maximum shear limit exceed ho raha hai. Section depth/width increase karna zaroori hai.'
    )
  }

  if (!checks.deflection) {
    recommendations.push(
      'Span/depth ratio high hai. Lintel depth increase karo for better stiffness.'
    )
  }

  if (!checks.practicalDepth) {
    recommendations.push(
      'Practical depth low lag rahi hai. Site execution aur deflection control ke liye depth increase karna better rahega.'
    )
  }

  if (input.slabLoadEnabled) {
    recommendations.push(
      'Slab/roof load selected hai. Confirm karo ki slab actually lintel par transfer ho rahi hai ya nahi.'
    )
  }

  if (input.pointLoadEnabled && pointLoadService > 0) {
    recommendations.push(
      'Point load selected hai. Concentrated load ke neeche bearing/crushing aur local reinforcement verify karo.'
    )
  }

  if (recommendations.length === 0) {
    recommendations.push(
      'Preliminary lintel design safe hai. Final reinforcement detailing, cover, bar anchorage aur site bearing condition verify karo.'
    )
  }

  return {
    m,
    clearSpan,
    bearing,
    wallT,
    b,
    D,
    effectiveDepth,
    effectiveSpan,
    totalLength,
    effectiveWallHeight,

    masonryLoad,
    selfWeight,
    slabLineLoad,
    plasterLineLoad,
    additionalLineLoad,
    totalServiceUdl,
    wu,

    pointLoadService,
    pointLoadUltimate,
    pointPositionRatio,
    a,
    bPoint,

    momentUdl,
    momentPoint,
    Mu,
    reactionService,
    reactionUltimate,
    Vu,

    steel,
    tauV,
    shearLimit,
    maxShearLimit,
    asv,
    stirrupSpacing,
    stirrupSpacingRaw,
    bearingStress,
    spanDepthRatio,

    topBars,
    topAstProvided,

    checks,
    overallSafe,
    recommendations,

    mainBarLength,
    topBarLength,
    stirrupCount,
    stirrupCutLength,

    mainSteelKg,
    topSteelKg,
    stirrupSteelKg,
    steelKgPerLintel,
    steelKgTotal,
    steelWithWastage,

    concreteVolumePerLintel,
    concreteVolumeTotal,
    shutteringAreaPerLintel,
    shutteringAreaTotal,

    concreteCost,
    steelCost,
    shutteringCost,
    estimatedCost,
  }
}

function chooseMainBarDia(input) {
  const trials = MAIN_BAR_DIA_OPTIONS.map((dia) => {
    const trialInput = {
      ...input,
      mainBarDia: dia,
    }

    const result = computeLintel(trialInput)

    return {
      dia,
      bars: result.steel.bars,
      astReq: result.steel.astReq,
      astProvided: result.steel.astProvided,
      safe: result.steel.astProvided >= result.steel.astReq,
    }
  })

  const practical = trials.find(
    (item) => item.safe && item.bars >= 2 && item.bars <= 4
  )

  if (practical) return practical.dia

  const next = trials.find((item) => item.safe && item.bars <= 6)

  return next?.dia || trials[trials.length - 1].dia
}

function chooseTopBarDia(input) {
  const trial = computeLintel(input)

  if (trial.D <= 200) return 8
  if (trial.D <= 300) return 10
  if (trial.D <= 450) return 12

  return 16
}

function chooseStirrupDia(input) {
  const trials = STIRRUP_DIA_OPTIONS.map((dia) => {
    const trialInput = {
      ...input,
      stirrupDia: dia,
    }

    const result = computeLintel(trialInput)

    return {
      dia,
      spacing: result.stirrupSpacing,
      shearSafe: result.checks.maxShear,
    }
  })

  const practical = trials.find(
    (item) =>
      item.shearSafe &&
      item.spacing >= 100 &&
      item.spacing <= 250
  )

  if (practical) return practical.dia

  const closest = [...trials].sort(
    (a, b) =>
      Math.abs(a.spacing - 150) -
      Math.abs(b.spacing - 150)
  )[0]

  return closest?.dia || 8
}

function autoFillBarDiameters(input) {
  if (input.barDesignMode !== 'auto') return input

  let draft = {
    ...input,
  }

  const mainBarDia = chooseMainBarDia(draft)

  draft = {
    ...draft,
    mainBarDia,
  }

  const topBarDia = chooseTopBarDia(draft)

  draft = {
    ...draft,
    topBarDia,
  }

  const stirrupDia = chooseStirrupDia(draft)

  draft = {
    ...draft,
    stirrupDia,
  }

  return draft
}

function findOptimizedLintel(input) {
  const m = convertToMetric(input)
  const wallT = Math.max(m.wallThickness, 75)

  for (let D = 150; D <= 600; D += 25) {
    for (let bearing = 150; bearing <= 300; bearing += 25) {
      const trialInput = autoFillBarDiameters({
        ...input,
        lintelDepth: D,
        lintelWidth: Math.max(wallT, 150),
        bearingLength: bearing,
      })

      const trial = computeLintel(trialInput)

      if (trial.overallSafe) {
        return {
          depth: D,
          width: Math.max(wallT, 150),
          bearing,
          effectiveSpan: trial.effectiveSpan,
          ast: trial.steel.astReq,
          bars: trial.steel.bars,
          stirrupSpacing: trial.stirrupSpacing,
          trialInput,
          results: trial,
        }
      }
    }
  }

  for (let D = 625; D <= 900; D += 25) {
    for (
      let width = Math.max(wallT, 150);
      width <= Math.max(wallT + 250, 300);
      width += 25
    ) {
      const trialInput = autoFillBarDiameters({
        ...input,
        lintelDepth: D,
        lintelWidth: width,
        bearingLength: 200,
      })

      const trial = computeLintel(trialInput)

      if (trial.overallSafe) {
        return {
          depth: D,
          width,
          bearing: 200,
          effectiveSpan: trial.effectiveSpan,
          ast: trial.steel.astReq,
          bars: trial.steel.bars,
          stirrupSpacing: trial.stirrupSpacing,
          trialInput,
          results: trial,
        }
      }
    }
  }

  return null
}

export default function LintelDesignPage() {
  const [inputs, setInputs] = useState(defaultInputs)
  const [calculatedInputs, setCalculatedInputs] = useState(null)
  const [hasCalculated, setHasCalculated] = useState(false)

  const isMetric = inputs.unitSystem === 'metric'

  const unit = {
    length: isMetric ? 'm' : 'ft',
    thickness: isMetric ? 'mm' : 'inch',
    loadDensity: isMetric ? 'kN/m³' : 'pcf',
    lineLoad: isMetric ? 'kN/m' : 'plf',
    areaLoad: isMetric ? 'kN/m²' : 'psf',
    pointLoad: isMetric ? 'kN' : 'kip',
  }

  const resultInput = calculatedInputs || inputs

  const results = useMemo(() => computeLintel(resultInput), [resultInput])

  const optimized = useMemo(() => {
    if (!hasCalculated) return null
    return findOptimizedLintel(resultInput)
  }, [hasCalculated, resultInput])

  const bottomBarDots = Array.from(
    { length: Math.min(results.steel.bars, 8) },
    (_, index) => index
  )

  const topBarDots = Array.from(
    { length: Math.min(results.topBars, 4) },
    (_, index) => index
  )

  const stirrupMarks = Array.from({ length: 7 }, (_, index) => index)

  const updateInput = (key, value) => {
    if (key === 'unitSystem') {
      const freshInputs = value === 'metric' ? defaultInputs : imperialDefaults
      setInputs(freshInputs)
      setCalculatedInputs(null)
      setHasCalculated(false)
      return
    }

    if (typeof value === 'boolean') {
      setInputs((prev) => ({
        ...prev,
        [key]: value,
      }))

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
        .getElementById('lintel-results')
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
        lintelDepth: Math.round(optimized.depth),
        lintelWidth: Math.round(optimized.width),
        bearingLength: Math.round(optimized.bearing),
      }
    } else {
      updatedInputs = {
        ...inputs,
        lintelDepth: Number(round(optimized.depth / 25.4, 1)),
        lintelWidth: Number(round(optimized.width / 25.4, 1)),
        bearingLength: Number(round(optimized.bearing / 25.4, 1)),
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
      doc.text('RCC Lintel Design Report', 14, 18)

      doc.setFontSize(10)
      doc.text('CivilCalc Pro - Practical Site Engineer Summary', 14, 26)

      const lines = [
        `Opening Width: ${round(resultInput.openingWidth)} ${unit.length}`,
        `Bearing Length: ${round(resultInput.bearingLength)} ${unit.thickness}`,
        `Lintel Size: ${round(resultInput.lintelWidth)} x ${round(resultInput.lintelDepth)} ${unit.thickness}`,
        `Effective Span: ${round(results.effectiveSpan)} m`,
        `Effective Depth: ${round(results.effectiveDepth, 0)} mm`,
        `Total Service UDL: ${round(results.totalServiceUdl)} kN/m`,
        `Ultimate Moment Mu: ${round(results.Mu)} kNm`,
        `Ultimate Shear Vu: ${round(results.Vu)} kN`,
        `Ast Required: ${round(results.steel.astReq)} mm2`,
        `Ast Provided: ${round(results.steel.astProvided)} mm2`,
        `Bottom Main Steel: ${results.steel.bars} bars of ${resultInput.mainBarDia} mm`,
        `Top Hanger Steel: ${results.topBars} bars of ${resultInput.topBarDia} mm`,
        `Stirrups: ${resultInput.stirrupDia} mm, ${resultInput.stirrupLegs} legged @ ${results.stirrupSpacing} mm c/c`,
        `Bearing Stress: ${round(results.bearingStress)} N/mm2`,
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
        'Note: This is a preliminary design report. Final lintel design must be verified by a qualified structural engineer.',
        14,
        285,
        { maxWidth: 180 }
      )

      doc.save('lintel-design-report.pdf')
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

  const Toggle = ({ label, labelHi, name }) => (
    <button
      type="button"
      onClick={() => updateInput(name, !inputs[name])}
      className={`rounded-2xl border p-4 text-left transition ${
        inputs[name]
          ? 'border-orange-500 bg-orange-500/10'
          : 'border-slate-700 bg-slate-950'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-bold text-white">{label}</p>
          <p className="text-xs text-slate-400">{labelHi}</p>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-black ${
            inputs[name]
              ? 'bg-orange-500 text-white'
              : 'bg-slate-800 text-slate-400'
          }`}
        >
          {inputs[name] ? 'ON' : 'OFF'}
        </span>
      </div>
    </button>
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
                RCC Lintel Design
              </div>

              <h1 className="text-3xl font-black tracking-tight md:text-5xl">
                Lintel Design Calculator
              </h1>

              <p className="mt-3 max-w-3xl text-slate-300">
                Door/window opening ke liye RCC lintel ka load calculation,
                bending moment, shear, bearing pressure, auto bar dia, Ast
                required/provided, quantity aur PDF report calculate kare.
              </p>

              <p className="mt-2 max-w-3xl text-sm text-slate-400">
                Diagram me bottom main bars, top hanger bars aur stirrups clear
                placement ke sath show honge.
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
                  Auto Lintel Depth Optimizer
                </h2>

                <p className="mt-2 text-sm text-orange-100">
                  Current opening, load aur material ke basis par safe lintel
                  depth, bearing length aur bar arrangement suggest karta hai.
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
                  No safe design found. Increase width/depth or reduce load.
                </div>
              )}
            </div>

            {optimized && (
              <div className="mt-5 grid gap-4 md:grid-cols-5">
                <QuantityCard
                  title="Suggested Depth"
                  value={`${round(optimized.depth, 0)} mm`}
                  subtitle="Auto safe depth"
                />

                <QuantityCard
                  title="Suggested Width"
                  value={`${round(optimized.width, 0)} mm`}
                  subtitle="Usually wall thickness"
                />

                <QuantityCard
                  title="Suggested Bearing"
                  value={`${round(optimized.bearing, 0)} mm`}
                  subtitle="Each side"
                />

                <QuantityCard
                  title="Main Bars"
                  value={`${optimized.bars} bars`}
                  subtitle={`${resultInput.mainBarDia} mm dia`}
                />

                <QuantityCard
                  title="Stirrups"
                  value={`${optimized.stirrupSpacing} mm c/c`}
                  subtitle={`${resultInput.stirrupDia} mm stirrups`}
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
                1. Opening & Lintel Geometry
              </h2>

              <div className="grid gap-5 md:grid-cols-2">
                <Field
                  label="Opening Width"
                  labelHi="Door/window clear opening"
                  name="openingWidth"
                  suffix={unit.length}
                />

                <Field
                  label="Bearing Length"
                  labelHi="Dono side support bearing"
                  name="bearingLength"
                  suffix={unit.thickness}
                  step="1"
                />

                <Field
                  label="Wall Thickness"
                  labelHi="Brick/block wall thickness"
                  name="wallThickness"
                  suffix={unit.thickness}
                  step="1"
                />

                <Field
                  label="Lintel Width"
                  labelHi="Generally wall thickness ke equal"
                  name="lintelWidth"
                  suffix={unit.thickness}
                  step="1"
                />

                <Field
                  label="Lintel Depth"
                  labelHi="RCC lintel depth"
                  name="lintelDepth"
                  suffix={unit.thickness}
                  step="1"
                />

                <Field
                  label="Wall Height Above Lintel"
                  labelHi="Lintel ke upar masonry height"
                  name="wallHeightAbove"
                  suffix={unit.length}
                />

                <Field
                  label="Number of Similar Lintels"
                  labelHi="Quantity estimate ke liye"
                  name="numberOfLintels"
                  suffix="Nos"
                  step="1"
                />

                <Toggle
                  label="Use 45° Arching Action"
                  labelHi="Effective wall height = min(actual height, span/2)"
                  name="useArchingAction"
                />
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
              <h2 className="mb-5 text-xl font-black">2. Load Inputs</h2>

              <div className="grid gap-5 md:grid-cols-2">
                <Field
                  label="Masonry Unit Weight"
                  labelHi="Brick/block masonry density"
                  name="masonryUnitWeight"
                  suffix={unit.loadDensity}
                />

                <Field
                  label="Concrete Unit Weight"
                  labelHi="RCC unit weight"
                  name="concreteUnitWeight"
                  suffix={unit.loadDensity}
                />

                <Field
                  label="Plaster/Finish Line Load"
                  labelHi="Optional finish load"
                  name="plasterLoad"
                  suffix={unit.lineLoad}
                />

                <Field
                  label="Additional Line Load"
                  labelHi="Extra load if any"
                  name="additionalLineLoad"
                  suffix={unit.lineLoad}
                />

                <Toggle
                  label="Add Slab/Roof Load"
                  labelHi="Slab load lintel par aa rahi ho toh ON"
                  name="slabLoadEnabled"
                />

                {inputs.slabLoadEnabled && (
                  <>
                    <Field
                      label="Slab Load Intensity"
                      labelHi="Dead + live load intensity"
                      name="slabLoadIntensity"
                      suffix={unit.areaLoad}
                    />

                    <Field
                      label="Slab Tributary Width"
                      labelHi="Load transfer width"
                      name="slabTributaryWidth"
                      suffix={unit.length}
                    />
                  </>
                )}

                <Toggle
                  label="Add Point Load"
                  labelHi="Concentrated load on lintel"
                  name="pointLoadEnabled"
                />

                {inputs.pointLoadEnabled && (
                  <>
                    <Field
                      label="Point Load"
                      labelHi="Concentrated load"
                      name="pointLoad"
                      suffix={unit.pointLoad}
                    />

                    <Field
                      label="Point Load Position"
                      labelHi="0.5 means mid span"
                      name="pointLoadPosition"
                      suffix="ratio"
                      step="0.01"
                    />
                  </>
                )}
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
                  labelHi="Lintel clear cover"
                  name="cover"
                  suffix="mm"
                  step="1"
                />

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-200">
                    Bar Diameter Mode
                    <span className="block text-xs font-normal text-slate-400">
                      Auto mode me main bar, top bar aur stirrup dia khud select
                      hoga
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
                    Auto mode ON hai. Calculate click karne par tool bottom main
                    bar, top hanger bar aur stirrup dia automatically select
                    karega.
                  </div>
                )}

                <Field
                  label="Main Bar Diameter"
                  labelHi={
                    inputs.barDesignMode === 'auto'
                      ? 'Auto mode me calculate ke baad update hoga'
                      : 'Bottom main steel'
                  }
                  name="mainBarDia"
                  suffix="mm"
                  step="1"
                />

                <Field
                  label="Top Bar Diameter"
                  labelHi={
                    inputs.barDesignMode === 'auto'
                      ? 'Auto mode me calculate ke baad update hoga'
                      : 'Top hanger bars'
                  }
                  name="topBarDia"
                  suffix="mm"
                  step="1"
                />

                <Field
                  label="Stirrup Diameter"
                  labelHi={
                    inputs.barDesignMode === 'auto'
                      ? 'Auto mode me calculate ke baad update hoga'
                      : 'Shear reinforcement'
                  }
                  name="stirrupDia"
                  suffix="mm"
                  step="1"
                />

                <Field
                  label="Stirrup Legs"
                  labelHi="Usually 2-legged stirrups"
                  name="stirrupLegs"
                  suffix="legs"
                  step="1"
                />

                <Field
                  label="Allowable Masonry Bearing"
                  labelHi="Support bearing limit"
                  name="masonryAllowableBearing"
                  suffix="N/mm²"
                  step="0.01"
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
                Calculate Lintel Design
              </button>

              <p className="mt-3 text-center text-xs text-slate-400">
                Input fill karne ke baad calculate click karo. Auto mode ON hoga
                toh bar dia bhi automatically select hoga.
              </p>
            </div>
          </div>

          <div id="lintel-results" className="space-y-6">
            {!hasCalculated ? (
              <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 text-center">
                <Calculator className="mx-auto mb-4 text-orange-400" size={46} />

                <h2 className="text-2xl font-black text-white">
                  Fill Inputs & Click Calculate
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Lintel diagram, bottom bars, top bars, stirrups, Ast required,
                  Ast provided, quantity aur PDF report calculate button click
                  karne ke baad show hoga.
                </p>
              </div>
            ) : (
              <>
                <div className="rounded-3xl border border-slate-800 bg-slate-950 p-6">
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <h2 className="text-xl font-black">Lintel Bar Placement Diagram</h2>

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
                    <svg viewBox="0 0 680 430" className="h-auto w-full">
                      <rect x="0" y="0" width="680" height="430" fill="#071027" />

                      <rect
                        x="120"
                        y="260"
                        width="440"
                        height="65"
                        rx="7"
                        fill="#64748b"
                        stroke="#cbd5e1"
                        strokeOpacity="0.45"
                      />

                      <rect
                        x="95"
                        y="325"
                        width="82"
                        height="62"
                        fill="#92400e"
                        opacity="0.78"
                      />

                      <rect
                        x="503"
                        y="325"
                        width="82"
                        height="62"
                        fill="#92400e"
                        opacity="0.78"
                      />

                      <rect
                        x="177"
                        y="108"
                        width="326"
                        height="152"
                        fill="#92400e"
                        opacity="0.34"
                        stroke="#f59e0b"
                        strokeDasharray="6 6"
                      />

                      {resultInput.useArchingAction && (
                        <path
                          d="M177 260 L340 108 L503 260"
                          fill="none"
                          stroke="#f97316"
                          strokeWidth="3"
                          strokeDasharray="8 6"
                        />
                      )}

                      {[210, 260, 310, 360, 410, 460].map((x) => (
                        <line
                          key={x}
                          x1={x}
                          y1="130"
                          x2={x}
                          y2="240"
                          stroke="#fbbf24"
                          strokeWidth="3"
                          opacity="0.75"
                        />
                      ))}

                      <line
                        x1="145"
                        y1="306"
                        x2="535"
                        y2="306"
                        stroke="#fb923c"
                        strokeWidth="5"
                      />

                      {bottomBarDots.map((_, index) => {
                        const spacing = 360 / Math.max(bottomBarDots.length - 1, 1)
                        const x = 160 + index * spacing

                        return (
                          <circle
                            key={`bottom-${index}`}
                            cx={x}
                            cy="306"
                            r="8"
                            fill="#fb923c"
                            stroke="#fed7aa"
                            strokeWidth="2"
                          />
                        )
                      })}

                      <line
                        x1="145"
                        y1="274"
                        x2="535"
                        y2="274"
                        stroke="#fbbf24"
                        strokeWidth="3"
                      />

                      {topBarDots.map((_, index) => {
                        const spacing = 340 / Math.max(topBarDots.length - 1, 1)
                        const x = 170 + index * spacing

                        return (
                          <circle
                            key={`top-${index}`}
                            cx={x}
                            cy="274"
                            r="6"
                            fill="#fbbf24"
                            stroke="#fef3c7"
                            strokeWidth="2"
                          />
                        )
                      })}

                      {stirrupMarks.map((_, index) => {
                        const x = 155 + index * 62

                        return (
                          <rect
                            key={`stirrup-${index}`}
                            x={x}
                            y="268"
                            width="24"
                            height="48"
                            rx="3"
                            fill="none"
                            stroke="#38bdf8"
                            strokeWidth="3"
                            opacity="0.95"
                          />
                        )
                      })}

                      <line
                        x1="150"
                        y1="392"
                        x2="530"
                        y2="392"
                        stroke="#93c5fd"
                      />

                      <text x="235" y="414" fill="#93c5fd" fontSize="13">
                        Clear Opening = {round(results.clearSpan)} m
                      </text>

                      <line
                        x1="120"
                        y1="358"
                        x2="560"
                        y2="358"
                        stroke="#38bdf8"
                        strokeDasharray="6 5"
                      />

                      <text x="245" y="352" fill="#7dd3fc" fontSize="13">
                        Total Length = {round(results.totalLength)} m
                      </text>

                      <text x="252" y="96" fill="#fbbf24" fontSize="13">
                        Masonry Load Above Lintel
                      </text>

                      <text x="155" y="253" fill="#e2e8f0" fontSize="13">
                        RCC Lintel {round(results.b, 0)} × {round(results.D, 0)} mm
                      </text>

                      <text x="38" y="352" fill="#fcd34d" fontSize="12">
                        Bearing
                      </text>

                      <text x="590" y="352" fill="#fcd34d" fontSize="12">
                        Bearing
                      </text>

                      <text x="150" y="340" fill="#fb923c" fontSize="13">
                        Bottom main steel: {results.steel.bars} bars of{' '}
                        {resultInput.mainBarDia} mm
                      </text>

                      <text x="150" y="246" fill="#fbbf24" fontSize="13">
                        Top hanger steel: {results.topBars} bars of{' '}
                        {resultInput.topBarDia} mm
                      </text>

                      <text x="395" y="340" fill="#7dd3fc" fontSize="13">
                        Stirrups: {resultInput.stirrupDia} mm @{' '}
                        {results.stirrupSpacing} mm c/c
                      </text>

                      <text x="445" y="82" fill="#86efac" fontSize="12">
                        Ast req = {round(results.steel.astReq)} mm²
                      </text>

                      <text x="445" y="102" fill="#86efac" fontSize="12">
                        Ast prov = {round(results.steel.astProvided)} mm²
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
                      <p>Bottom Main Bar: {calculatedInputs.mainBarDia} mm</p>
                      <p>Top Hanger Bar: {calculatedInputs.topBarDia} mm</p>
                      <p>Stirrup Bar: {calculatedInputs.stirrupDia} mm</p>
                    </div>
                  </div>
                )}

                <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
                  <h2 className="mb-4 text-xl font-black">
                    Design Check Summary
                  </h2>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <ResultCard
                      title="Ast Required"
                      value={`${round(results.steel.astReq)} mm²`}
                      subtitle="Bottom tension steel required"
                    />

                    <ResultCard
                      title="Ast Provided"
                      value={`${round(results.steel.astProvided)} mm²`}
                      subtitle={`${results.steel.bars} bars of ${resultInput.mainBarDia} mm`}
                      pass={results.checks.moment}
                    />

                    <ResultCard
                      title="Total Service UDL"
                      value={`${round(results.totalServiceUdl)} kN/m`}
                      subtitle={`Ultimate UDL = ${round(results.wu)} kN/m`}
                    />

                    <ResultCard
                      title="Ultimate Moment"
                      value={`${round(results.Mu)} kNm`}
                      subtitle={`UDL moment = ${round(results.momentUdl)} kNm`}
                    />

                    <ResultCard
                      title="Ultimate Shear"
                      value={`${round(results.Vu)} kN`}
                      subtitle="Maximum support shear"
                    />

                    <ResultCard
                      title="Shear Stress"
                      value={`${round(results.tauV)} N/mm²`}
                      subtitle={`Limit ${round(results.shearLimit)} N/mm²`}
                      pass={results.checks.shear}
                    />

                    <ResultCard
                      title="Bearing Stress"
                      value={`${round(results.bearingStress)} N/mm²`}
                      subtitle={`Limit ${round(results.m.masonryAllowableBearing)} N/mm²`}
                      pass={results.checks.bearing}
                    />

                    <ResultCard
                      title="Span/Depth Ratio"
                      value={round(results.spanDepthRatio)}
                      subtitle="Recommended ≤ 20"
                      pass={results.checks.deflection}
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
                    <p>✓ Dono side proper bearing length provide karo.</p>
                    <p>✓ Bottom main bars tension face par place karo.</p>
                    <p>✓ Top hanger bars cage hold karne ke liye provide karo.</p>
                    <p>✓ Stirrups support ke paas closer spacing me maintain karo.</p>
                    <p>✓ Bottom bar anchorage bearing ke andar properly extend karo.</p>
                    <p>✓ Lintel width usually wall thickness ke equal rakho.</p>
                    <p>✓ Slab load actually lintel par aa rahi ho tabhi slab load add karo.</p>
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
                <table className="w-full min-w-[900px] overflow-hidden rounded-2xl text-left text-sm">
                  <thead className="bg-slate-950 text-slate-300">
                    <tr>
                      <th className="px-4 py-4">Reinforcement</th>
                      <th className="px-4 py-4">Required</th>
                      <th className="px-4 py-4">Provided</th>
                      <th className="px-4 py-4">Bar Placement</th>
                      <th className="px-4 py-4">Approx Weight</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr className="border-b border-slate-800">
                      <td className="px-4 py-4 font-semibold text-white">
                        Bottom Main Steel
                      </td>
                      <td className="px-4 py-4 text-slate-300">
                        Ast req = {round(results.steel.astReq)} mm²
                      </td>
                      <td className="px-4 py-4 text-orange-300">
                        Ast prov = {round(results.steel.astProvided)} mm²
                        <br />
                        {results.steel.bars} bars of {resultInput.mainBarDia} mm
                      </td>
                      <td className="px-4 py-4 text-slate-300">
                        Bottom tension face
                      </td>
                      <td className="px-4 py-4 text-slate-300">
                        {round(results.mainSteelKg)} kg/lintel
                      </td>
                    </tr>

                    <tr className="border-b border-slate-800">
                      <td className="px-4 py-4 font-semibold text-white">
                        Top Hanger Bars
                      </td>
                      <td className="px-4 py-4 text-slate-300">
                        Minimum practical
                      </td>
                      <td className="px-4 py-4 text-orange-300">
                        Ast prov = {round(results.topAstProvided)} mm²
                        <br />
                        {results.topBars} bars of {resultInput.topBarDia} mm
                      </td>
                      <td className="px-4 py-4 text-slate-300">
                        Top face, stirrup cage holding
                      </td>
                      <td className="px-4 py-4 text-slate-300">
                        {round(results.topSteelKg)} kg/lintel
                      </td>
                    </tr>

                    <tr className="border-b border-slate-800">
                      <td className="px-4 py-4 font-semibold text-white">
                        Stirrups
                      </td>
                      <td className="px-4 py-4 text-slate-300">
                        Shear reinforcement
                      </td>
                      <td className="px-4 py-4 text-orange-300">
                        {resultInput.stirrupDia} mm, {resultInput.stirrupLegs}
                        -legged @ {results.stirrupSpacing} mm c/c
                      </td>
                      <td className="px-4 py-4 text-slate-300">
                        Along lintel length
                      </td>
                      <td className="px-4 py-4 text-slate-300">
                        {round(results.stirrupSteelKg)} kg/lintel
                        <br />
                        {results.stirrupCount} stirrups approx
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
              <h2 className="mb-5 text-xl font-black">Load Breakdown</h2>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                <QuantityCard
                  title="Masonry Load"
                  value={`${round(results.masonryLoad)} kN/m`}
                  subtitle="Wall load above lintel"
                />

                <QuantityCard
                  title="Self Weight"
                  value={`${round(results.selfWeight)} kN/m`}
                  subtitle="RCC lintel self weight"
                />

                <QuantityCard
                  title="Slab Line Load"
                  value={`${round(results.slabLineLoad)} kN/m`}
                  subtitle={
                    resultInput.slabLoadEnabled ? 'Slab load ON' : 'Slab load OFF'
                  }
                />

                <QuantityCard
                  title="Additional Load"
                  value={`${round(results.additionalLineLoad)} kN/m`}
                  subtitle="Extra line load"
                />

                <QuantityCard
                  title="Point Load"
                  value={`${round(results.pointLoadService)} kN`}
                  subtitle={
                    resultInput.pointLoadEnabled ? 'Point load ON' : 'Point load OFF'
                  }
                />
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
                  subtitle={`${round(results.concreteVolumePerLintel)} m³ per lintel`}
                />

                <QuantityCard
                  title="Steel Quantity"
                  value={`${round(results.steelWithWastage)} kg`}
                  subtitle="Includes approx 8% wastage"
                />

                <QuantityCard
                  title="Shuttering Area"
                  value={`${round(results.shutteringAreaTotal)} m²`}
                  subtitle="Bottom + side shuttering"
                />

                <QuantityCard
                  title="Estimated Cost"
                  value={money(results.estimatedCost)}
                  subtitle="Concrete + steel + shuttering"
                />

                <QuantityCard
                  title="Total Length"
                  value={`${round(results.totalLength)} m`}
                  subtitle="Opening + bearing"
                />

                <QuantityCard
                  title="Main Bar Length"
                  value={`${round(results.mainBarLength)} m`}
                  subtitle="Approx per bar"
                />

                <QuantityCard
                  title="Stirrup Cut Length"
                  value={`${round(results.stirrupCutLength)} m`}
                  subtitle="Approx per stirrup"
                />

                <QuantityCard
                  title="Similar Lintels"
                  value={`${resultInput.numberOfLintels} Nos`}
                  subtitle="Quantity multiplier"
                />
              </div>
            </div>

            <div className="mt-6 rounded-3xl border border-orange-500/20 bg-orange-500/10 p-6 text-sm leading-7 text-orange-100">
              <strong>Important:</strong> Ye lintel calculator preliminary design,
              site checking, reinforcement planning aur quantity estimate ke liye
              hai. Final design me structural drawings, actual load path, masonry
              strength, bearing condition, bar anchorage aur local code
              requirements verify karna zaroori hai.
            </div>
          </>
        )}
      </section>
    </main>
  )
}
