'use client'

import { useState } from 'react'

const concreteGrades = {
  M20: 20,
  M25: 25,
  M30: 30,
  M35: 35,
  M40: 40,
}

const steelGrades = {
  Fe415: 415,
  Fe500: 500,
  Fe550: 550,
}

const footingTypes = {
  square: 'Square Isolated Footing',
  rectangular: 'Rectangular Isolated Footing',
  combined: 'Combined Footing',
  strap: 'Strap Footing',
  raft: 'Raft Footing',
}

const footingHindi = {
  square: 'स्क्वायर आइसोलेटेड फुटिंग',
  rectangular: 'रेक्टैंगुलर आइसोलेटेड फुटिंग',
  combined: 'कम्बाइंड फुटिंग',
  strap: 'स्ट्रैप फुटिंग',
  raft: 'राफ्ट फुटिंग',
}

const tauCMap = {
  M20: 0.36,
  M25: 0.42,
  M30: 0.48,
  M35: 0.52,
  M40: 0.56,
}

const bondStressPlain = {
  M20: 1.2,
  M25: 1.4,
  M30: 1.5,
  M35: 1.7,
  M40: 1.9,
}

const barDiameters = [10, 12, 16, 20, 25]
const spacingOptions = [100, 125, 150, 175, 200, 225, 250, 300]

const defaultInputs = {
  unitSystem: 'metric',
  footingType: 'square',

  columnWidth: 300,
  columnDepth: 300,
  serviceLoad: 900,
  sbc: 200,

  footingLength: '',
  footingWidth: '',
  footingDepth: '',

  column2Width: 300,
  column2Depth: 300,
  serviceLoad2: 700,
  columnSpacing: 3.5,

  exteriorColumnLoad: 700,
  interiorColumnLoad: 900,
  exteriorFootingLength: '',
  exteriorFootingWidth: '',
  interiorFootingLength: '',
  interiorFootingWidth: '',
  strapBeamWidth: '',
  strapBeamDepth: '',

  raftLength: 10,
  raftWidth: 8,
  totalColumnLoad: 5000,
  numberOfColumns: 9,
  raftPanelX: 3,
  raftPanelY: 3,

  concreteGrade: 'M25',
  steelGrade: 'Fe500',
  clearCover: '',
  steelRate: 65,
}

function toNumber(value, fallback = 0) {
  const num = Number(value)
  return Number.isFinite(num) ? num : fallback
}

function isBlank(value) {
  return value === '' || value === null || value === undefined || Number(value) <= 0
}

function formatNumber(value, digits = 2) {
  if (!Number.isFinite(value)) return '-'
  return value.toLocaleString('en-IN', {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  })
}

function formatPlain(value, digits = 0) {
  if (!Number.isFinite(value)) return '-'
  return value.toLocaleString('en-IN', {
    maximumFractionDigits: digits,
  })
}

function roundUp(value, step = 0.1) {
  return Math.ceil(value / step) * step
}

function roundDownTo25(value) {
  return Math.max(75, Math.floor(value / 25) * 25)
}

function barArea(dia) {
  return (Math.PI * dia * dia) / 4
}

function steelWeightPerMeter(dia) {
  return (dia * dia) / 162
}

function convertInputsToMetric(input) {
  const isMetric = input.unitSystem === 'metric'

  const dimToMm = (value) => (isMetric ? toNumber(value) : toNumber(value) * 25.4)
  const lengthToM = (value) => (isMetric ? toNumber(value) : toNumber(value) * 0.3048)
  const loadToKn = (value) => (isMetric ? toNumber(value) : toNumber(value) * 4.44822)
  const sbcToKnM2 = (value) => (isMetric ? toNumber(value) : toNumber(value) * 47.8803)

  const autoCover =
    input.footingType === 'raft' || input.footingType === 'combined' ? 75 : 50

  const coverBlank = isBlank(input.clearCover)

  return {
    columnWidthMm: dimToMm(input.columnWidth),
    columnDepthMm: dimToMm(input.columnDepth),
    serviceLoadKn: loadToKn(input.serviceLoad),
    sbcKnM2: sbcToKnM2(input.sbc),

    footingLengthM: isBlank(input.footingLength) ? 0 : lengthToM(input.footingLength),
    footingWidthM: isBlank(input.footingWidth) ? 0 : lengthToM(input.footingWidth),
    footingDepthMm: isBlank(input.footingDepth) ? 0 : dimToMm(input.footingDepth),

    column2WidthMm: dimToMm(input.column2Width),
    column2DepthMm: dimToMm(input.column2Depth),
    serviceLoad2Kn: loadToKn(input.serviceLoad2),
    columnSpacingM: lengthToM(input.columnSpacing),

    exteriorColumnLoadKn: loadToKn(input.exteriorColumnLoad),
    interiorColumnLoadKn: loadToKn(input.interiorColumnLoad),

    exteriorFootingLengthM: isBlank(input.exteriorFootingLength)
      ? 0
      : lengthToM(input.exteriorFootingLength),
    exteriorFootingWidthM: isBlank(input.exteriorFootingWidth)
      ? 0
      : lengthToM(input.exteriorFootingWidth),
    interiorFootingLengthM: isBlank(input.interiorFootingLength)
      ? 0
      : lengthToM(input.interiorFootingLength),
    interiorFootingWidthM: isBlank(input.interiorFootingWidth)
      ? 0
      : lengthToM(input.interiorFootingWidth),

    strapBeamWidthMm: isBlank(input.strapBeamWidth) ? 300 : dimToMm(input.strapBeamWidth),
    strapBeamDepthMm: isBlank(input.strapBeamDepth) ? 600 : dimToMm(input.strapBeamDepth),

    raftLengthM: lengthToM(input.raftLength),
    raftWidthM: lengthToM(input.raftWidth),
    totalColumnLoadKn: loadToKn(input.totalColumnLoad),
    raftPanelXM: lengthToM(input.raftPanelX),
    raftPanelYM: lengthToM(input.raftPanelY),
    numberOfColumns: Math.max(1, toNumber(input.numberOfColumns, 1)),

    clearCoverMm: coverBlank ? autoCover : dimToMm(input.clearCover),
    coverMode: coverBlank ? 'Auto' : 'Manual',
    steelRate: toNumber(input.steelRate),
  }
}

function getDevelopmentLength({ fy, concreteGrade, dia }) {
  const plainBond = bondStressPlain[concreteGrade] || 1.4
  const deformedBond = plainBond * 1.6
  return (0.87 * fy * dia) / (4 * deformedBond)
}

function selectRebarPerMeter(astRequired) {
  const options = []

  for (const dia of barDiameters) {
    for (const spacing of spacingOptions) {
      const astProvided = (barArea(dia) * 1000) / spacing
      if (astProvided >= astRequired) {
        options.push({
          dia,
          spacing,
          astProvided,
          excess: astProvided - astRequired,
        })
      }
    }
  }

  options.sort((a, b) => {
    if (a.spacing !== b.spacing) return b.spacing - a.spacing
    return a.excess - b.excess
  })

  return (
    options[0] || {
      dia: 12,
      spacing: 150,
      astProvided: (barArea(12) * 1000) / 150,
      excess: 0,
    }
  )
}

function calculateSteelQuantity({
  lengthM,
  widthM,
  coverMm,
  xDia,
  xSpacing,
  yDia,
  ySpacing,
  ldMm,
  raftExtraFactor = 1,
}) {
  const effectiveLengthX = Math.max(lengthM - (2 * coverMm) / 1000, 0.1)
  const effectiveLengthY = Math.max(widthM - (2 * coverMm) / 1000, 0.1)

  const barsX = Math.ceil((widthM * 1000 - 2 * coverMm) / xSpacing) + 1
  const barsY = Math.ceil((lengthM * 1000 - 2 * coverMm) / ySpacing) + 1

  const lengthEachX = effectiveLengthX + (2 * ldMm) / 1000
  const lengthEachY = effectiveLengthY + (2 * ldMm) / 1000

  const xWeight = barsX * lengthEachX * steelWeightPerMeter(xDia) * raftExtraFactor
  const yWeight = barsY * lengthEachY * steelWeightPerMeter(yDia) * raftExtraFactor

  return {
    barsX,
    barsY,
    lengthEachX,
    lengthEachY,
    xWeight,
    yWeight,
    totalWeight: xWeight + yWeight,
  }
}

function isolatedCoreDesign({
  input,
  metric,
  footingType,
  serviceLoadKn,
  colWidthMm,
  colDepthMm,
  lengthOverrideM,
  widthOverrideM,
  depthOverrideMm,
  autoShape = 'square',
  preliminary = false,
  raftMode = false,
  raftPanelX = 3,
  raftPanelY = 3,
}) {
  const fck = concreteGrades[input.concreteGrade]
  const fy = steelGrades[input.steelGrade]
  const tauC = tauCMap[input.concreteGrade] || 0.42

  if (serviceLoadKn <= 0 || metric.sbcKnM2 <= 0) {
    throw new Error('Please enter valid load and SBC.')
  }

  if (colWidthMm <= 0 || colDepthMm <= 0) {
    throw new Error('Please enter valid column size.')
  }

  const requiredArea = serviceLoadKn / metric.sbcKnM2

  let lengthM = lengthOverrideM
  let widthM = widthOverrideM

  if (raftMode) {
    if (lengthM <= 0 || widthM <= 0) {
      throw new Error('Please enter valid raft length and width.')
    }
  } else if (lengthM > 0 && widthM > 0) {
    lengthM = lengthOverrideM
    widthM = widthOverrideM
  } else if (autoShape === 'square') {
    const side = roundUp(Math.sqrt(requiredArea * 1.1), 0.1)
    lengthM = side
    widthM = side
  } else {
    const ratio = Math.max(1.1, Math.min(1.6, colDepthMm / colWidthMm + 0.25))
    lengthM = roundUp(Math.sqrt(requiredArea * ratio * 1.1), 0.1)
    widthM = roundUp((requiredArea * 1.1) / lengthM, 0.1)
  }

  if (lengthM <= colDepthMm / 1000 || widthM <= colWidthMm / 1000) {
    throw new Error('Footing size must be larger than column size.')
  }

  const coverMm = metric.clearCoverMm

  function checkForDepth(depthMm) {
    const effectiveDepthMm = Math.max(depthMm - coverMm - 6, 50)
    const effectiveDepthM = effectiveDepthMm / 1000

    const areaM2 = lengthM * widthM
    const selfWeightKn = areaM2 * (depthMm / 1000) * 25
    const totalServiceKn = serviceLoadKn + selfWeightKn
    const soilPressure = totalServiceKn / areaM2
    const factoredLoadKn = 1.5 * totalServiceKn
    const factoredPressure = factoredLoadKn / areaM2

    const projectionX = Math.max((lengthM - colDepthMm / 1000) / 2, 0)
    const projectionY = Math.max((widthM - colWidthMm / 1000) / 2, 0)

    let momentX
    let momentY

    if (raftMode) {
      momentX = (factoredPressure * raftPanelX * raftPanelX) / 8
      momentY = (factoredPressure * raftPanelY * raftPanelY) / 8
    } else {
      momentX = (factoredPressure * projectionX * projectionX) / 2
      momentY = (factoredPressure * projectionY * projectionY) / 2
    }

    const zMm = 0.9 * effectiveDepthMm

    const astXFlexure = (momentX * 1000000) / (0.87 * fy * zMm)
    const astYFlexure = (momentY * 1000000) / (0.87 * fy * zMm)

    const minAst = 0.0012 * 1000 * depthMm

    const astX = Math.max(astXFlexure, minAst)
    const astY = Math.max(astYFlexure, minAst)

    const xBars = selectRebarPerMeter(astX)
    const yBars = selectRebarPerMeter(astY)

    const oneWayVx = factoredPressure * Math.max(projectionX - effectiveDepthM, 0)
    const oneWayVy = factoredPressure * Math.max(projectionY - effectiveDepthM, 0)

    const tauVx = (oneWayVx * 1000) / (1000 * effectiveDepthMm)
    const tauVy = (oneWayVy * 1000) / (1000 * effectiveDepthMm)
    const oneWayTau = Math.max(tauVx, tauVy)
    const oneWaySafe = oneWayTau <= tauC

    const innerArea =
      (colDepthMm / 1000 + effectiveDepthM) *
      (colWidthMm / 1000 + effectiveDepthM)

    const punchingVu = Math.max(1.5 * serviceLoadKn - factoredPressure * innerArea, 0)

    const punchingPerimeterM =
      2 * (colDepthMm / 1000 + colWidthMm / 1000 + 2 * effectiveDepthM)

    const punchingTau =
      (punchingVu * 1000) / (punchingPerimeterM * 1000 * effectiveDepthMm)

    const punchingAllow = 0.25 * Math.sqrt(fck)
    const punchingSafe = punchingTau <= punchingAllow

    const soilSafe = soilPressure <= metric.sbcKnM2

    const ldMm = getDevelopmentLength({
      fy,
      concreteGrade: input.concreteGrade,
      dia: Math.max(xBars.dia, yBars.dia),
    })

    const availableLd = Math.min(projectionX, projectionY) * 1000 - coverMm
    const ldSafe = availableLd >= ldMm

    const steelQty = calculateSteelQuantity({
      lengthM,
      widthM,
      coverMm,
      xDia: xBars.dia,
      xSpacing: xBars.spacing,
      yDia: yBars.dia,
      ySpacing: yBars.spacing,
      ldMm,
      raftExtraFactor: raftMode ? 2 : 1,
    })

    const steelCost =
      input.unitSystem === 'imperial'
        ? steelQty.totalWeight * 2.20462 * metric.steelRate
        : steelQty.totalWeight * metric.steelRate

    const status =
      soilSafe && oneWaySafe && punchingSafe && ldSafe
        ? 'Safe'
        : 'Check Required'

    return {
      footingType,
      preliminary,
      raftMode,
      fck,
      fy,
      lengthM,
      widthM,
      depthMm,
      effectiveDepthMm,
      areaM2,
      requiredArea,
      selfWeightKn,
      totalServiceKn,
      factoredLoadKn,
      soilPressure,
      factoredPressure,
      serviceLoadKn,
      colWidthMm,
      colDepthMm,
      projectionX,
      projectionY,
      momentX,
      momentY,
      astX,
      astY,
      astXFlexure,
      astYFlexure,
      minAst,
      xBars,
      yBars,
      oneWayVx,
      oneWayVy,
      tauVx,
      tauVy,
      oneWayTau,
      tauC,
      oneWaySafe,
      punchingVu,
      punchingPerimeterM,
      punchingTau,
      punchingAllow,
      punchingSafe,
      soilSafe,
      ldMm,
      availableLd,
      ldSafe,
      steelQty,
      steelCost,
      status,
      coverMm,
      coverMode: metric.coverMode,
    }
  }

  if (depthOverrideMm > 0) {
    return checkForDepth(depthOverrideMm)
  }

  let startDepth = raftMode ? 250 : preliminary ? 450 : 300
  let finalDesign = null

  for (let d = startDepth; d <= 1600; d += 25) {
    const design = checkForDepth(d)
    finalDesign = design

    if (design.oneWaySafe && design.punchingSafe && design.soilSafe) {
      return design
    }
  }

  return finalDesign
}

function calculateSquare(input, metric) {
  const sideOverride =
    metric.footingLengthM > 0
      ? metric.footingLengthM
      : metric.footingWidthM > 0
        ? metric.footingWidthM
        : 0

  return isolatedCoreDesign({
    input,
    metric,
    footingType: 'square',
    serviceLoadKn: metric.serviceLoadKn,
    colWidthMm: metric.columnWidthMm,
    colDepthMm: metric.columnDepthMm,
    lengthOverrideM: sideOverride,
    widthOverrideM: sideOverride,
    depthOverrideMm: metric.footingDepthMm,
    autoShape: 'square',
  })
}

function calculateRectangular(input, metric) {
  return isolatedCoreDesign({
    input,
    metric,
    footingType: 'rectangular',
    serviceLoadKn: metric.serviceLoadKn,
    colWidthMm: metric.columnWidthMm,
    colDepthMm: metric.columnDepthMm,
    lengthOverrideM: metric.footingLengthM,
    widthOverrideM: metric.footingWidthM,
    depthOverrideMm: metric.footingDepthMm,
    autoShape: 'rectangular',
  })
}

function calculateCombined(input, metric) {
  const totalLoad = metric.serviceLoadKn + metric.serviceLoad2Kn

  if (metric.columnSpacingM <= 0) {
    throw new Error('Please enter valid distance between columns.')
  }

  const resultantFromColumn1 =
    (metric.serviceLoad2Kn * metric.columnSpacingM) / totalLoad

  const requiredArea = totalLoad / metric.sbcKnM2

  let lengthM = metric.footingLengthM
  let widthM = metric.footingWidthM

  if (lengthM <= 0 || widthM <= 0) {
    const leftOverhang = Math.max(0.6, resultantFromColumn1)
    const rightOverhang = Math.max(0.6, metric.columnSpacingM - resultantFromColumn1)
    lengthM = roundUp(leftOverhang + metric.columnSpacingM + rightOverhang, 0.1)
    widthM = roundUp((requiredArea * 1.15) / lengthM, 0.1)
    widthM = Math.max(widthM, 1.2)
  }

  const design = isolatedCoreDesign({
    input,
    metric,
    footingType: 'combined',
    serviceLoadKn: totalLoad,
    colWidthMm: Math.max(metric.columnWidthMm, metric.column2WidthMm),
    colDepthMm: Math.max(metric.columnDepthMm, metric.column2DepthMm),
    lengthOverrideM: lengthM,
    widthOverrideM: widthM,
    depthOverrideMm: metric.footingDepthMm,
    autoShape: 'rectangular',
    preliminary: true,
  })

  design.resultantFromColumn1 = resultantFromColumn1
  design.columnSpacingM = metric.columnSpacingM
  design.serviceLoad2Kn = metric.serviceLoad2Kn
  design.col2WidthMm = metric.column2WidthMm
  design.col2DepthMm = metric.column2DepthMm

  return design
}

function calculateRaft(input, metric) {
  const avgColumnLoad = metric.totalColumnLoadKn / metric.numberOfColumns

  return isolatedCoreDesign({
    input,
    metric,
    footingType: 'raft',
    serviceLoadKn: metric.totalColumnLoadKn,
    colWidthMm: metric.columnWidthMm,
    colDepthMm: metric.columnDepthMm,
    lengthOverrideM: metric.raftLengthM,
    widthOverrideM: metric.raftWidthM,
    depthOverrideMm: metric.footingDepthMm,
    autoShape: 'rectangular',
    preliminary: true,
    raftMode: true,
    raftPanelX: metric.raftPanelXM,
    raftPanelY: metric.raftPanelYM,
  })
}

function calculateStrap(input, metric) {
  const exteriorArea = (metric.exteriorColumnLoadKn / metric.sbcKnM2) * 1.15
  const interiorArea = (metric.interiorColumnLoadKn / metric.sbcKnM2) * 1.15

  const exteriorSide =
    metric.exteriorFootingLengthM > 0 && metric.exteriorFootingWidthM > 0
      ? 0
      : roundUp(Math.sqrt(exteriorArea), 0.1)

  const interiorSide =
    metric.interiorFootingLengthM > 0 && metric.interiorFootingWidthM > 0
      ? 0
      : roundUp(Math.sqrt(interiorArea), 0.1)

  const exterior = isolatedCoreDesign({
    input,
    metric,
    footingType: 'strap',
    serviceLoadKn: metric.exteriorColumnLoadKn,
    colWidthMm: metric.columnWidthMm,
    colDepthMm: metric.columnDepthMm,
    lengthOverrideM: metric.exteriorFootingLengthM || exteriorSide,
    widthOverrideM: metric.exteriorFootingWidthM || exteriorSide,
    depthOverrideMm: metric.footingDepthMm,
    autoShape: 'square',
    preliminary: true,
  })

  const interior = isolatedCoreDesign({
    input,
    metric,
    footingType: 'strap',
    serviceLoadKn: metric.interiorColumnLoadKn,
    colWidthMm: metric.column2WidthMm,
    colDepthMm: metric.column2DepthMm,
    lengthOverrideM: metric.interiorFootingLengthM || interiorSide,
    widthOverrideM: metric.interiorFootingWidthM || interiorSide,
    depthOverrideMm: metric.footingDepthMm,
    autoShape: 'square',
    preliminary: true,
  })

  const strapMoment = (metric.exteriorColumnLoadKn * metric.columnSpacingM) / 8
  const fck = concreteGrades[input.concreteGrade]
  const fy = steelGrades[input.steelGrade]

  const strapD = metric.strapBeamDepthMm
  const strapB = metric.strapBeamWidthMm
  const strapEffectiveD = Math.max(strapD - metric.clearCoverMm - 8, 100)
  const strapAst = Math.max(
    (strapMoment * 1000000) / (0.87 * fy * 0.9 * strapEffectiveD),
    0.0012 * strapB * strapD
  )

  const strapBars = selectRebarPerMeter(strapAst)
  const strapSteelWeight =
    metric.columnSpacingM * (1000 / strapBars.spacing) * steelWeightPerMeter(strapBars.dia)

  const result = {
    ...exterior,
    footingType: 'strap',
    preliminary: true,
    exterior,
    interior,
    strapMoment,
    strapBeamWidthMm: strapB,
    strapBeamDepthMm: strapD,
    strapAst,
    strapBars,
    strapSteelWeight,
    lengthM:
      exterior.lengthM / 2 + metric.columnSpacingM + interior.lengthM / 2,
    widthM: Math.max(exterior.widthM, interior.widthM),
    serviceLoadKn: metric.exteriorColumnLoadKn + metric.interiorColumnLoadKn,
    totalServiceKn: exterior.totalServiceKn + interior.totalServiceKn,
    steelQty: {
      totalWeight:
        exterior.steelQty.totalWeight + interior.steelQty.totalWeight + strapSteelWeight,
      xWeight: exterior.steelQty.xWeight + interior.steelQty.xWeight,
      yWeight: exterior.steelQty.yWeight + interior.steelQty.yWeight,
      barsX: exterior.steelQty.barsX + interior.steelQty.barsX,
      barsY: exterior.steelQty.barsY + interior.steelQty.barsY,
    },
    status:
      exterior.status === 'Safe' && interior.status === 'Safe'
        ? 'Safe'
        : 'Check Required',
  }

  result.steelCost =
    input.unitSystem === 'imperial'
      ? result.steelQty.totalWeight * 2.20462 * metric.steelRate
      : result.steelQty.totalWeight * metric.steelRate

  return result
}

function calculateFooting(input) {
  const metric = convertInputsToMetric(input)

  if (input.footingType === 'square') return calculateSquare(input, metric)
  if (input.footingType === 'rectangular') return calculateRectangular(input, metric)
  if (input.footingType === 'combined') return calculateCombined(input, metric)
  if (input.footingType === 'strap') return calculateStrap(input, metric)
  if (input.footingType === 'raft') return calculateRaft(input, metric)

  return calculateSquare(input, metric)
}

function Field({ label, hindi, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-2">
        {label}
        <span className="block text-xs text-slate-500">{hindi}</span>
      </label>
      {children}
    </div>
  )
}

function InputBox(props) {
  return (
    <input
      {...props}
      className="w-full rounded-xl bg-slate-950/70 border border-slate-700 px-4 py-3 text-white outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition"
    />
  )
}

function SelectBox(props) {
  return (
    <select
      {...props}
      className="w-full rounded-xl bg-slate-950/70 border border-slate-700 px-4 py-3 text-white outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition"
    />
  )
}

function ResultCard({ title, hindi, children, highlight = false }) {
  return (
    <div
      className={`rounded-2xl border p-5 ${
        highlight
          ? 'bg-emerald-500/10 border-emerald-500/50'
          : 'bg-slate-950/60 border-slate-800'
      }`}
    >
      <h3 className="text-lg font-bold text-white">{title}</h3>
      {hindi && <p className="text-xs text-slate-500 mb-4">{hindi}</p>}
      <div className="space-y-3">{children}</div>
    </div>
  )
}

function Row({ label, value, strong = false }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-800/70 pb-2 last:border-b-0 last:pb-0">
      <span className="text-sm text-slate-400">{label}</span>
      <span
        className={`text-sm text-right ${
          strong ? 'text-white font-bold' : 'text-slate-200'
        }`}
      >
        {value}
      </span>
    </div>
  )
}

function FootingPlanDiagram({ result }) {
  const isStrap = result.footingType === 'strap'
  const isRaft = result.footingType === 'raft'
  const isCombined = result.footingType === 'combined'

  return (
    <div className="rounded-2xl bg-slate-950/60 border border-slate-800 p-5 overflow-hidden">
      <h3 className="text-lg font-bold text-white">Footing Plan Diagram</h3>
      <p className="text-xs text-slate-500 mb-4">फुटिंग प्लान डायग्राम</p>

      <svg viewBox="0 0 760 460" className="w-full h-auto">
        <rect x="0" y="0" width="760" height="460" rx="18" fill="#020617" />

        {!isStrap ? (
          <>
            <rect
              x="155"
              y="80"
              width="450"
              height="260"
              rx="10"
              fill="#0f172a"
              stroke="#f97316"
              strokeWidth="3"
            />

            {isRaft ? (
              <>
                {Array.from({ length: 4 }).map((_, i) => (
                  <line
                    key={`gx-${i}`}
                    x1={190 + i * 95}
                    y1="90"
                    x2={190 + i * 95}
                    y2="330"
                    stroke="#334155"
                    strokeWidth="2"
                  />
                ))}
                {Array.from({ length: 3 }).map((_, i) => (
                  <line
                    key={`gy-${i}`}
                    x1="165"
                    y1={145 + i * 70}
                    x2="595"
                    y2={145 + i * 70}
                    stroke="#334155"
                    strokeWidth="2"
                  />
                ))}
                {Array.from({ length: 9 }).map((_, i) => {
                  const cx = 230 + (i % 3) * 130
                  const cy = 140 + Math.floor(i / 3) * 80
                  return (
                    <rect
                      key={i}
                      x={cx}
                      y={cy}
                      width="35"
                      height="35"
                      fill="#f97316"
                      opacity="0.9"
                    />
                  )
                })}
              </>
            ) : isCombined ? (
              <>
                <rect x="250" y="185" width="50" height="50" fill="#f97316" />
                <rect x="460" y="185" width="50" height="50" fill="#f97316" />
                <text x="228" y="170" fill="#e2e8f0" fontSize="14">
                  Column 1
                </text>
                <text x="438" y="170" fill="#e2e8f0" fontSize="14">
                  Column 2
                </text>
              </>
            ) : (
              <rect x="355" y="185" width="50" height="50" fill="#f97316" />
            )}

            {Array.from({ length: 10 }).map((_, i) => (
              <line
                key={`x-${i}`}
                x1="180"
                y1={105 + i * 23}
                x2="580"
                y2={105 + i * 23}
                stroke="#38bdf8"
                strokeWidth="1.5"
              />
            ))}

            {Array.from({ length: 14 }).map((_, i) => (
              <line
                key={`y-${i}`}
                x1={185 + i * 30}
                y1="100"
                x2={185 + i * 30}
                y2="320"
                stroke="#f97316"
                strokeWidth="1.5"
              />
            ))}

            <text x="70" y="70" fill="#f97316" fontSize="16" fontWeight="700">
              {footingTypes[result.footingType]}
            </text>
            <text x="70" y="100" fill="#cbd5e1" fontSize="15">
              Size: {formatNumber(result.lengthM, 2)} m × {formatNumber(result.widthM, 2)} m
            </text>
            <text x="70" y="130" fill="#cbd5e1" fontSize="15">
              X Bars: {result.xBars.dia} mm Ø @ {result.xBars.spacing} mm c/c
            </text>
            <text x="70" y="160" fill="#cbd5e1" fontSize="15">
              Y Bars: {result.yBars.dia} mm Ø @ {result.yBars.spacing} mm c/c
            </text>
            <text x="70" y="190" fill="#cbd5e1" fontSize="15">
              One-Way Shear: {result.oneWaySafe ? 'Safe' : 'Check Required'}
            </text>
            <text x="70" y="220" fill="#cbd5e1" fontSize="15">
              Two-Way Shear: {result.punchingSafe ? 'Safe' : 'Check Required'}
            </text>

            <line x1="155" y1="370" x2="605" y2="370" stroke="#64748b" strokeWidth="2" />
            <line x1="155" y1="362" x2="155" y2="378" stroke="#64748b" strokeWidth="2" />
            <line x1="605" y1="362" x2="605" y2="378" stroke="#64748b" strokeWidth="2" />
            <text x="310" y="400" fill="#e2e8f0" fontSize="15">
              Length = {formatNumber(result.lengthM, 2)} m
            </text>
          </>
        ) : (
          <>
            <rect x="100" y="140" width="170" height="150" rx="10" fill="#0f172a" stroke="#f97316" strokeWidth="3" />
            <rect x="500" y="140" width="170" height="150" rx="10" fill="#0f172a" stroke="#f97316" strokeWidth="3" />
            <rect x="250" y="195" width="270" height="40" rx="6" fill="#1e293b" stroke="#38bdf8" strokeWidth="3" />
            <rect x="165" y="195" width="40" height="40" fill="#f97316" />
            <rect x="565" y="195" width="40" height="40" fill="#f97316" />

            <text x="85" y="95" fill="#f97316" fontSize="16" fontWeight="700">
              Strap Footing
            </text>
            <text x="85" y="125" fill="#cbd5e1" fontSize="15">
              Exterior Footing: {formatNumber(result.exterior.lengthM, 2)} m × {formatNumber(result.exterior.widthM, 2)} m
            </text>
            <text x="85" y="325" fill="#cbd5e1" fontSize="15">
              Interior Footing: {formatNumber(result.interior.lengthM, 2)} m × {formatNumber(result.interior.widthM, 2)} m
            </text>
            <text x="300" y="185" fill="#38bdf8" fontSize="15">
              Strap Beam
            </text>
            <text x="285" y="255" fill="#cbd5e1" fontSize="14">
              {formatPlain(result.strapBeamWidthMm)} × {formatPlain(result.strapBeamDepthMm)} mm
            </text>
            <text x="85" y="355" fill="#cbd5e1" fontSize="15">
              Footing Bars: {result.xBars.dia} mm Ø @ {result.xBars.spacing} mm c/c
            </text>
          </>
        )}
      </svg>
    </div>
  )
}

function FootingSectionDiagram({ result }) {
  return (
    <div className="rounded-2xl bg-slate-950/60 border border-slate-800 p-5 overflow-hidden">
      <h3 className="text-lg font-bold text-white">Footing Section Diagram</h3>
      <p className="text-xs text-slate-500 mb-4">फुटिंग सेक्शन डायग्राम</p>

      <svg viewBox="0 0 760 360" className="w-full h-auto">
        <rect x="0" y="0" width="760" height="360" rx="18" fill="#020617" />

        <rect x="145" y="185" width="470" height="85" rx="8" fill="#0f172a" stroke="#f97316" strokeWidth="3" />
        <rect x="335" y="95" width="90" height="90" rx="6" fill="#f97316" opacity="0.9" />

        {Array.from({ length: 12 }).map((_, i) => (
          <circle
            key={i}
            cx={175 + i * 38}
            cy="245"
            r="5"
            fill="#38bdf8"
          />
        ))}

        <line x1="635" y1="185" x2="635" y2="270" stroke="#64748b" strokeWidth="2" />
        <line x1="627" y1="185" x2="643" y2="185" stroke="#64748b" strokeWidth="2" />
        <line x1="627" y1="270" x2="643" y2="270" stroke="#64748b" strokeWidth="2" />
        <text x="650" y="232" fill="#e2e8f0" fontSize="15">
          D = {formatPlain(result.depthMm)} mm
        </text>

        <text x="70" y="80" fill="#f97316" fontSize="16" fontWeight="700">
          Depth = {formatPlain(result.depthMm)} mm
        </text>
        <text x="70" y="110" fill="#cbd5e1" fontSize="15">
          Effective Depth = {formatPlain(result.effectiveDepthMm)} mm
        </text>
        <text x="70" y="140" fill="#cbd5e1" fontSize="15">
          Clear Cover = {formatPlain(result.coverMm)} mm ({result.coverMode})
        </text>
        <text x="70" y="310" fill="#cbd5e1" fontSize="15">
          Bottom Reinforcement: {result.xBars.dia} mm Ø @ {result.xBars.spacing} mm c/c and {result.yBars.dia} mm Ø @ {result.yBars.spacing} mm c/c
        </text>

        <line x1="335" y1="290" x2="335" y2="180" stroke="#ef4444" strokeWidth="2" strokeDasharray="5 5" />
        <line x1="425" y1="290" x2="425" y2="180" stroke="#ef4444" strokeWidth="2" strokeDasharray="5 5" />
        <text x="455" y="170" fill="#ef4444" fontSize="14">
          Punching shear zone
        </text>

        <line x1="505" y1="185" x2="505" y2="270" stroke="#22c55e" strokeWidth="2" strokeDasharray="5 5" />
        <text x="515" y="285" fill="#22c55e" fontSize="14">
          One-way shear section
        </text>
      </svg>
    </div>
  )
}

export default function FootingDesignPage() {
  const [input, setInput] = useState(defaultInputs)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const isMetric = input.unitSystem === 'metric'
  const lengthUnit = isMetric ? 'm' : 'ft'
  const dimensionUnit = isMetric ? 'mm' : 'in'
  const loadUnit = isMetric ? 'kN' : 'kip'
  const sbcUnit = isMetric ? 'kN/m²' : 'kip/ft²'
  const steelRateUnit = isMetric ? '₹/kg' : '₹/lb'

  const isSingle = input.footingType === 'square' || input.footingType === 'rectangular'
  const isCombined = input.footingType === 'combined'
  const isStrap = input.footingType === 'strap'
  const isRaft = input.footingType === 'raft'

  function updateInput(key, value) {
    setInput((prev) => ({
      ...prev,
      [key]: value,
    }))
    setResult(null)
    setError('')
  }

  function handleCalculate() {
    try {
      setError('')
      const data = calculateFooting(input)
      setResult(data)
    } catch (err) {
      setResult(null)
      setError(err.message || 'Something went wrong. Please check inputs.')
    }
  }

  async function handleDownloadPDF() {
    if (!result) return

    const { default: jsPDF } = await import('jspdf')
    const autoTableModule = await import('jspdf-autotable')
    const autoTable = autoTableModule.default || autoTableModule

    const doc = new jsPDF('p', 'mm', 'a4')

    doc.setFillColor(5, 11, 31)
    doc.rect(0, 0, 210, 28, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(18)
    doc.text('CivilCalc Pro', 14, 12)
    doc.setFontSize(12)
    doc.text('RCC Footing Design Report', 14, 20)

    doc.setTextColor(100, 116, 139)
    doc.setFontSize(9)
    doc.text(`Generated: ${new Date().toLocaleString('en-IN')}`, 145, 12)
    doc.text(`Unit System: ${input.unitSystem === 'metric' ? 'Metric' : 'Imperial'}`, 145, 18)

    doc.setTextColor(15, 23, 42)
    doc.setFontSize(14)
    doc.text('Input Summary', 14, 38)

    const inputRows = buildPdfInputRows(input, result, {
      lengthUnit,
      dimensionUnit,
      loadUnit,
      sbcUnit,
      steelRateUnit,
    })

    autoTable(doc, {
      startY: 43,
      head: [['Input', 'Value']],
      body: inputRows,
      theme: 'grid',
      headStyles: { fillColor: [249, 115, 22] },
      styles: { fontSize: 8.5 },
    })

    let y = doc.lastAutoTable.finalY + 10
    doc.setFontSize(14)
    doc.setTextColor(15, 23, 42)
    doc.text('Output Summary', 14, y)

    const outputRows = [
      ['Design Status', result.status],
      ['Footing Type', footingTypes[result.footingType]],
      ['Footing Size', getFootingSizeText(result)],
      ['Depth', `${formatPlain(result.depthMm)} mm`],
      ['Effective Depth', `${formatPlain(result.effectiveDepthMm)} mm`],
      ['Soil Pressure', `${formatNumber(result.soilPressure, 2)} kN/m²`],
      ['SBC', `${formatNumber(result.input ? 0 : 0, 0)}`],
      ['One-Way Shear', result.oneWaySafe ? 'Safe' : 'Check Required'],
      ['Two-Way / Punching Shear', result.punchingSafe ? 'Safe' : 'Check Required'],
      ['X Direction Steel', `${result.xBars.dia} mm dia @ ${result.xBars.spacing} mm c/c`],
      ['Y Direction Steel', `${result.yBars.dia} mm dia @ ${result.yBars.spacing} mm c/c`],
      ['Development Length', `${formatPlain(result.ldMm)} mm - ${result.ldSafe ? 'OK' : 'Check Required'}`],
      ['Total Steel Weight', `${formatNumber(result.steelQty.totalWeight, 2)} kg`],
      ['Approx Steel Cost', `₹${formatNumber(result.steelCost, 0)}`],
    ]

    autoTable(doc, {
      startY: y + 5,
      head: [['Output', 'Value']],
      body: outputRows,
      theme: 'grid',
      headStyles: { fillColor: [15, 23, 42] },
      styles: { fontSize: 8.5 },
    })

    y = doc.lastAutoTable.finalY + 10

    if (y > 215) {
      doc.addPage()
      y = 18
    }

    doc.setFontSize(14)
    doc.setTextColor(15, 23, 42)
    doc.text('Footing Diagram', 14, y)

    drawPdfFootingDiagram(doc, result, y + 8)

    doc.setFontSize(8)
    doc.setTextColor(100, 116, 139)
    doc.text(
      'Disclaimer: Preliminary design only. Verify with qualified site/structural engineer before execution.',
      14,
      282
    )
    doc.text(
      'Construction se pehle qualified site engineer / structural engineer se design verify jarur karwaye.',
      14,
      287
    )

    doc.save('CivilCalc-Pro-RCC-Footing-Design.pdf')
  }

  return (
    <main className="min-h-screen bg-[#050B1F] text-white px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <p className="text-orange-500 text-sm font-semibold tracking-wide uppercase">
            RCC Calculator
          </p>
          <h1 className="text-3xl md:text-5xl font-extrabold mt-2">
            Footing Design
          </h1>
          <p className="text-slate-400 mt-3 max-w-3xl">
            RCC footing design with square, rectangular, combined, strap and raft footing,
            soil pressure, one-way shear, punching shear, reinforcement and diagram.
          </p>
          <p className="text-slate-500 text-sm mt-1">
            Square, Rectangular, Combined, Strap और Raft footing design — shear check और diagram के साथ.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 items-start">
          <section className="rounded-3xl bg-slate-900/70 border border-slate-800 p-6">
            <h2 className="text-2xl font-bold mb-1">Inputs</h2>
            <p className="text-sm text-slate-500 mb-6">
              पहले input डालें, फिर Run Design पर click करें.
            </p>

            <div className="grid md:grid-cols-2 gap-5">
              <Field label="Unit System" hindi="यूनिट सिस्टम">
                <SelectBox
                  value={input.unitSystem}
                  onChange={(e) => updateInput('unitSystem', e.target.value)}
                >
                  <option value="metric">Metric - mm, m, kN</option>
                  <option value="imperial">Imperial - in, ft, kip</option>
                </SelectBox>
              </Field>

              <Field label="Footing Type" hindi="फुटिंग टाइप">
                <SelectBox
                  value={input.footingType}
                  onChange={(e) => updateInput('footingType', e.target.value)}
                >
                  <option value="square">Square Isolated Footing</option>
                  <option value="rectangular">Rectangular Isolated Footing</option>
                  <option value="combined">Combined Footing</option>
                  <option value="strap">Strap Footing</option>
                  <option value="raft">Raft Footing</option>
                </SelectBox>
              </Field>

              {!isRaft && (
                <>
                  <Field label={`Column Width (${dimensionUnit})`} hindi="कॉलम चौड़ाई">
                    <InputBox
                      type="number"
                      value={input.columnWidth}
                      onChange={(e) => updateInput('columnWidth', e.target.value)}
                    />
                  </Field>

                  <Field label={`Column Depth (${dimensionUnit})`} hindi="कॉलम गहराई">
                    <InputBox
                      type="number"
                      value={input.columnDepth}
                      onChange={(e) => updateInput('columnDepth', e.target.value)}
                    />
                  </Field>
                </>
              )}

              {isRaft && (
                <>
                  <Field label={`Raft Length (${lengthUnit})`} hindi="राफ्ट लंबाई">
                    <InputBox
                      type="number"
                      value={input.raftLength}
                      onChange={(e) => updateInput('raftLength', e.target.value)}
                    />
                  </Field>

                  <Field label={`Raft Width (${lengthUnit})`} hindi="राफ्ट चौड़ाई">
                    <InputBox
                      type="number"
                      value={input.raftWidth}
                      onChange={(e) => updateInput('raftWidth', e.target.value)}
                    />
                  </Field>

                  <Field label={`Total Column Load (${loadUnit})`} hindi="कुल कॉलम लोड">
                    <InputBox
                      type="number"
                      value={input.totalColumnLoad}
                      onChange={(e) => updateInput('totalColumnLoad', e.target.value)}
                    />
                  </Field>

                  <Field label="Number of Columns" hindi="कॉलम की संख्या">
                    <InputBox
                      type="number"
                      value={input.numberOfColumns}
                      onChange={(e) => updateInput('numberOfColumns', e.target.value)}
                    />
                  </Field>

                  <Field label={`Column Width (${dimensionUnit})`} hindi="औसत कॉलम चौड़ाई">
                    <InputBox
                      type="number"
                      value={input.columnWidth}
                      onChange={(e) => updateInput('columnWidth', e.target.value)}
                    />
                  </Field>

                  <Field label={`Column Depth (${dimensionUnit})`} hindi="औसत कॉलम गहराई">
                    <InputBox
                      type="number"
                      value={input.columnDepth}
                      onChange={(e) => updateInput('columnDepth', e.target.value)}
                    />
                  </Field>

                  <Field label={`Panel Span X (${lengthUnit})`} hindi="पैनल स्पैन X">
                    <InputBox
                      type="number"
                      value={input.raftPanelX}
                      onChange={(e) => updateInput('raftPanelX', e.target.value)}
                    />
                  </Field>

                  <Field label={`Panel Span Y (${lengthUnit})`} hindi="पैनल स्पैन Y">
                    <InputBox
                      type="number"
                      value={input.raftPanelY}
                      onChange={(e) => updateInput('raftPanelY', e.target.value)}
                    />
                  </Field>
                </>
              )}

              {isSingle && (
                <Field label={`Service Load (${loadUnit})`} hindi="सर्विस लोड">
                  <InputBox
                    type="number"
                    value={input.serviceLoad}
                    onChange={(e) => updateInput('serviceLoad', e.target.value)}
                  />
                </Field>
              )}

              {isCombined && (
                <>
                  <Field label={`Column 1 Load (${loadUnit})`} hindi="कॉलम 1 लोड">
                    <InputBox
                      type="number"
                      value={input.serviceLoad}
                      onChange={(e) => updateInput('serviceLoad', e.target.value)}
                    />
                  </Field>

                  <Field label={`Column 2 Load (${loadUnit})`} hindi="कॉलम 2 लोड">
                    <InputBox
                      type="number"
                      value={input.serviceLoad2}
                      onChange={(e) => updateInput('serviceLoad2', e.target.value)}
                    />
                  </Field>

                  <Field label={`Column 2 Width (${dimensionUnit})`} hindi="कॉलम 2 चौड़ाई">
                    <InputBox
                      type="number"
                      value={input.column2Width}
                      onChange={(e) => updateInput('column2Width', e.target.value)}
                    />
                  </Field>

                  <Field label={`Column 2 Depth (${dimensionUnit})`} hindi="कॉलम 2 गहराई">
                    <InputBox
                      type="number"
                      value={input.column2Depth}
                      onChange={(e) => updateInput('column2Depth', e.target.value)}
                    />
                  </Field>

                  <Field label={`Column Spacing (${lengthUnit})`} hindi="कॉलम के बीच दूरी">
                    <InputBox
                      type="number"
                      value={input.columnSpacing}
                      onChange={(e) => updateInput('columnSpacing', e.target.value)}
                    />
                  </Field>
                </>
              )}

              {isStrap && (
                <>
                  <Field label={`Exterior Column Load (${loadUnit})`} hindi="बाहरी कॉलम लोड">
                    <InputBox
                      type="number"
                      value={input.exteriorColumnLoad}
                      onChange={(e) => updateInput('exteriorColumnLoad', e.target.value)}
                    />
                  </Field>

                  <Field label={`Interior Column Load (${loadUnit})`} hindi="अंदरूनी कॉलम लोड">
                    <InputBox
                      type="number"
                      value={input.interiorColumnLoad}
                      onChange={(e) => updateInput('interiorColumnLoad', e.target.value)}
                    />
                  </Field>

                  <Field label={`Interior Column Width (${dimensionUnit})`} hindi="अंदरूनी कॉलम चौड़ाई">
                    <InputBox
                      type="number"
                      value={input.column2Width}
                      onChange={(e) => updateInput('column2Width', e.target.value)}
                    />
                  </Field>

                  <Field label={`Interior Column Depth (${dimensionUnit})`} hindi="अंदरूनी कॉलम गहराई">
                    <InputBox
                      type="number"
                      value={input.column2Depth}
                      onChange={(e) => updateInput('column2Depth', e.target.value)}
                    />
                  </Field>

                  <Field label={`Column Spacing (${lengthUnit})`} hindi="कॉलम के बीच दूरी">
                    <InputBox
                      type="number"
                      value={input.columnSpacing}
                      onChange={(e) => updateInput('columnSpacing', e.target.value)}
                    />
                  </Field>
                </>
              )}

              <Field label={`SBC (${sbcUnit})`} hindi="मिट्टी की bearing capacity">
                <InputBox
                  type="number"
                  value={input.sbc}
                  onChange={(e) => updateInput('sbc', e.target.value)}
                />
              </Field>

              {!isStrap && !isRaft && (
                <>
                  <Field
                    label={`Footing Length Optional (${lengthUnit})`}
                    hindi="खाली छोड़ें तो auto"
                  >
                    <InputBox
                      type="number"
                      placeholder="Auto"
                      value={input.footingLength}
                      onChange={(e) => updateInput('footingLength', e.target.value)}
                    />
                  </Field>

                  <Field
                    label={`Footing Width Optional (${lengthUnit})`}
                    hindi="खाली छोड़ें तो auto"
                  >
                    <InputBox
                      type="number"
                      placeholder="Auto"
                      value={input.footingWidth}
                      onChange={(e) => updateInput('footingWidth', e.target.value)}
                    />
                  </Field>
                </>
              )}

              {isStrap && (
                <>
                  <Field label={`Exterior Footing Length (${lengthUnit})`} hindi="Optional - auto">
                    <InputBox
                      type="number"
                      placeholder="Auto"
                      value={input.exteriorFootingLength}
                      onChange={(e) => updateInput('exteriorFootingLength', e.target.value)}
                    />
                  </Field>

                  <Field label={`Exterior Footing Width (${lengthUnit})`} hindi="Optional - auto">
                    <InputBox
                      type="number"
                      placeholder="Auto"
                      value={input.exteriorFootingWidth}
                      onChange={(e) => updateInput('exteriorFootingWidth', e.target.value)}
                    />
                  </Field>

                  <Field label={`Interior Footing Length (${lengthUnit})`} hindi="Optional - auto">
                    <InputBox
                      type="number"
                      placeholder="Auto"
                      value={input.interiorFootingLength}
                      onChange={(e) => updateInput('interiorFootingLength', e.target.value)}
                    />
                  </Field>

                  <Field label={`Interior Footing Width (${lengthUnit})`} hindi="Optional - auto">
                    <InputBox
                      type="number"
                      placeholder="Auto"
                      value={input.interiorFootingWidth}
                      onChange={(e) => updateInput('interiorFootingWidth', e.target.value)}
                    />
                  </Field>

                  <Field label={`Strap Beam Width (${dimensionUnit})`} hindi="Optional - auto">
                    <InputBox
                      type="number"
                      placeholder="Auto"
                      value={input.strapBeamWidth}
                      onChange={(e) => updateInput('strapBeamWidth', e.target.value)}
                    />
                  </Field>

                  <Field label={`Strap Beam Depth (${dimensionUnit})`} hindi="Optional - auto">
                    <InputBox
                      type="number"
                      placeholder="Auto"
                      value={input.strapBeamDepth}
                      onChange={(e) => updateInput('strapBeamDepth', e.target.value)}
                    />
                  </Field>
                </>
              )}

              <Field label={`Footing Depth Optional (${dimensionUnit})`} hindi="खाली छोड़ें तो auto">
                <InputBox
                  type="number"
                  placeholder="Auto"
                  value={input.footingDepth}
                  onChange={(e) => updateInput('footingDepth', e.target.value)}
                />
              </Field>

              <Field label="Concrete Grade" hindi="कंक्रीट ग्रेड">
                <SelectBox
                  value={input.concreteGrade}
                  onChange={(e) => updateInput('concreteGrade', e.target.value)}
                >
                  {Object.keys(concreteGrades).map((grade) => (
                    <option key={grade} value={grade}>
                      {grade}
                    </option>
                  ))}
                </SelectBox>
              </Field>

              <Field label="Steel Grade" hindi="स्टील ग्रेड">
                <SelectBox
                  value={input.steelGrade}
                  onChange={(e) => updateInput('steelGrade', e.target.value)}
                >
                  {Object.keys(steelGrades).map((grade) => (
                    <option key={grade} value={grade}>
                      {grade}
                    </option>
                  ))}
                </SelectBox>
              </Field>

              <Field label={`Clear Cover Optional (${dimensionUnit})`} hindi="खाली छोड़ें तो auto">
                <InputBox
                  type="number"
                  placeholder="Auto"
                  value={input.clearCover}
                  onChange={(e) => updateInput('clearCover', e.target.value)}
                />
              </Field>

              <Field label={`Steel Rate (${steelRateUnit})`} hindi="स्टील रेट">
                <InputBox
                  type="number"
                  value={input.steelRate}
                  onChange={(e) => updateInput('steelRate', e.target.value)}
                />
              </Field>
            </div>

            {error && (
              <div className="mt-5 rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-red-300 text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handleCalculate}
              className="w-full mt-7 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 transition shadow-lg shadow-orange-500/20"
            >
              Run Design
            </button>
          </section>

          <section className="space-y-5">
            {!result ? (
              <div className="rounded-3xl bg-slate-900/70 border border-slate-800 p-8 text-center min-h-[420px] flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-orange-500/10 border border-orange-500/30 flex items-center justify-center mb-4">
                  <span className="text-3xl">🏗️</span>
                </div>
                <h2 className="text-2xl font-bold">Output will appear here</h2>
                <p className="text-slate-400 mt-2 max-w-md">
                  Fill footing inputs and click Run Design to generate footing size,
                  shear checks, reinforcement and diagrams.
                </p>
                <p className="text-slate-500 text-sm mt-2">
                  Run Design click करने के बाद ही output आएगा.
                </p>
              </div>
            ) : (
              <>
                <ResultCard title="Design Status" hindi="डिज़ाइन स्टेटस" highlight>
                  <Row label="Status" value={result.status} strong />
                  <Row label="Footing Type" value={footingTypes[result.footingType]} />
                  <Row label="Footing Size" value={getFootingSizeText(result)} />
                  <Row label="Depth" value={`${formatPlain(result.depthMm)} mm`} />
                  <Row
                    label="Design Note"
                    value={result.preliminary ? 'Preliminary design - engineer verification required' : 'Detailed isolated footing check'}
                  />
                </ResultCard>

                <ResultCard title="Final Recommendation" hindi="अंतिम सुझाव" highlight>
                  <Row label="Adopt Size" value={getFootingSizeText(result)} strong />
                  <Row label="Adopt Depth" value={`${formatPlain(result.depthMm)} mm`} strong />
                  <Row
                    label="X Direction Steel"
                    value={`${result.xBars.dia} mm dia @ ${result.xBars.spacing} mm c/c`}
                    strong
                  />
                  <Row
                    label="Y Direction Steel"
                    value={`${result.yBars.dia} mm dia @ ${result.yBars.spacing} mm c/c`}
                    strong
                  />
                  <Row
                    label="Clear Cover"
                    value={`${formatPlain(result.coverMm)} mm (${result.coverMode})`}
                  />
                </ResultCard>

                <ResultCard title="Geometry" hindi="ज्योमेट्री">
                  <Row label="Required Area" value={`${formatNumber(result.requiredArea, 2)} m²`} />
                  <Row label="Provided Area" value={`${formatNumber(result.areaM2, 2)} m²`} />
                  <Row label="Column Size" value={`${formatPlain(result.colWidthMm)} × ${formatPlain(result.colDepthMm)} mm`} />
                  <Row label="Projection X" value={`${formatNumber(result.projectionX, 2)} m`} />
                  <Row label="Projection Y" value={`${formatNumber(result.projectionY, 2)} m`} />
                  <Row label="Effective Depth" value={`${formatPlain(result.effectiveDepthMm)} mm`} />
                </ResultCard>

                <ResultCard title="Soil Pressure Check" hindi="सॉइल प्रेशर चेक">
                  <Row label="Actual Soil Pressure" value={`${formatNumber(result.soilPressure, 2)} kN/m²`} strong />
                  <Row label="Allowable SBC" value={`${formatNumber(convertInputsToMetric(input).sbcKnM2, 2)} kN/m²`} />
                  <Row label="Soil Status" value={result.soilSafe ? 'Safe' : 'Check Required'} />
                </ResultCard>

                <ResultCard title="Loading" hindi="लोडिंग">
                  <Row label="Column / Total Load" value={`${formatNumber(result.serviceLoadKn, 2)} kN`} />
                  <Row label="Footing Self Weight" value={`${formatNumber(result.selfWeightKn, 2)} kN`} />
                  <Row label="Total Service Load" value={`${formatNumber(result.totalServiceKn, 2)} kN`} />
                  <Row label="Factored Load" value={`${formatNumber(result.factoredLoadKn, 2)} kN`} strong />
                </ResultCard>

                <ResultCard title="Bending" hindi="बेंडिंग">
                  <Row label="Moment X Direction" value={`${formatNumber(result.momentX, 2)} kNm/m`} />
                  <Row label="Moment Y Direction" value={`${formatNumber(result.momentY, 2)} kNm/m`} />
                  <Row label="Required Ast X" value={`${formatNumber(result.astX, 2)} mm²/m`} />
                  <Row label="Required Ast Y" value={`${formatNumber(result.astY, 2)} mm²/m`} />
                </ResultCard>

                <ResultCard title="One-Way Shear Check" hindi="वन-वे शियर चेक">
                  <Row label="Shear Stress X" value={`${formatNumber(result.tauVx, 3)} N/mm²`} />
                  <Row label="Shear Stress Y" value={`${formatNumber(result.tauVy, 3)} N/mm²`} />
                  <Row label="Maximum Shear Stress" value={`${formatNumber(result.oneWayTau, 3)} N/mm²`} strong />
                  <Row label="Allowable Shear" value={`${formatNumber(result.tauC, 3)} N/mm²`} />
                  <Row label="Status" value={result.oneWaySafe ? 'Safe' : 'Check Required'} strong />
                </ResultCard>

                <ResultCard title="Two-Way / Punching Shear" hindi="टू-वे / पंचिंग शियर">
                  <Row label="Punching Shear Vu" value={`${formatNumber(result.punchingVu, 2)} kN`} />
                  <Row label="Critical Perimeter" value={`${formatNumber(result.punchingPerimeterM, 2)} m`} />
                  <Row label="Punching Shear Stress" value={`${formatNumber(result.punchingTau, 3)} N/mm²`} strong />
                  <Row label="Allowable Punching Shear" value={`${formatNumber(result.punchingAllow, 3)} N/mm²`} />
                  <Row label="Status" value={result.punchingSafe ? 'Safe' : 'Check Required'} strong />
                </ResultCard>

                <ResultCard title="Reinforcement" hindi="रिइनफोर्समेंट">
                  <Row
                    label="X Direction Bars"
                    value={`${result.xBars.dia} mm Ø @ ${result.xBars.spacing} mm c/c`}
                    strong
                  />
                  <Row
                    label="Y Direction Bars"
                    value={`${result.yBars.dia} mm Ø @ ${result.yBars.spacing} mm c/c`}
                    strong
                  />
                  <Row label="Provided Ast X" value={`${formatNumber(result.xBars.astProvided, 2)} mm²/m`} />
                  <Row label="Provided Ast Y" value={`${formatNumber(result.yBars.astProvided, 2)} mm²/m`} />
                  <Row label="Development Length" value={`${formatPlain(result.ldMm)} mm`} />
                  <Row label="Ld Status" value={result.ldSafe ? 'OK' : 'Check Required'} />
                </ResultCard>

                <ResultCard title="Steel Quantity" hindi="स्टील क्वांटिटी">
                  <Row label="X Direction Weight" value={`${formatNumber(result.steelQty.xWeight, 2)} kg`} />
                  <Row label="Y Direction Weight" value={`${formatNumber(result.steelQty.yWeight, 2)} kg`} />
                  {result.footingType === 'strap' && (
                    <Row label="Strap Beam Steel" value={`${formatNumber(result.strapSteelWeight, 2)} kg`} />
                  )}
                  <Row label="Total Steel Weight" value={`${formatNumber(result.steelQty.totalWeight, 2)} kg`} strong />
                  <Row label="Approx Steel Cost" value={`₹${formatNumber(result.steelCost, 0)}`} strong />
                </ResultCard>

                <FootingPlanDiagram result={result} />
                <FootingSectionDiagram result={result} />

                <div className="rounded-2xl border border-yellow-500/40 bg-yellow-500/10 p-5 text-sm text-yellow-100">
                  <p className="font-bold mb-2">Disclaimer / अस्वीकरण</p>
                  <p>
                    This footing design is for preliminary design, educational and site estimation purposes.
                    Before construction, verify it with a qualified site engineer or structural engineer as per
                    actual soil report, load combination, site condition and applicable IS codes.
                  </p>
                  <p className="mt-2">
                    Construction शुरू करने से पहले qualified site engineer / structural engineer से design
                    जरूर check करवाएं.
                  </p>
                </div>

                <button
                  onClick={handleDownloadPDF}
                  className="w-full rounded-2xl bg-white text-slate-950 hover:bg-slate-200 font-bold py-4 transition"
                >
                  Generate PDF
                </button>
              </>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}

function getFootingSizeText(result) {
  if (result.footingType === 'strap' && result.exterior && result.interior) {
    return `Ext: ${formatNumber(result.exterior.lengthM, 2)} × ${formatNumber(result.exterior.widthM, 2)} m, Int: ${formatNumber(result.interior.lengthM, 2)} × ${formatNumber(result.interior.widthM, 2)} m`
  }

  return `${formatNumber(result.lengthM, 2)} m × ${formatNumber(result.widthM, 2)} m`
}

function buildPdfInputRows(input, result, units) {
  const rows = [
    ['Footing Type', footingTypes[input.footingType]],
    ['SBC', `${input.sbc} ${units.sbcUnit}`],
    ['Concrete Grade', input.concreteGrade],
    ['Steel Grade', input.steelGrade],
    ['Clear Cover', input.clearCover === '' ? 'Auto' : `${input.clearCover} ${units.dimensionUnit}`],
    ['Steel Rate', `${input.steelRate} ${units.steelRateUnit}`],
  ]

  if (input.footingType === 'raft') {
    rows.push(
      ['Raft Length', `${input.raftLength} ${units.lengthUnit}`],
      ['Raft Width', `${input.raftWidth} ${units.lengthUnit}`],
      ['Total Column Load', `${input.totalColumnLoad} ${units.loadUnit}`],
      ['Number of Columns', input.numberOfColumns],
      ['Panel Span X', `${input.raftPanelX} ${units.lengthUnit}`],
      ['Panel Span Y', `${input.raftPanelY} ${units.lengthUnit}`]
    )
    return rows
  }

  rows.push(
    ['Column Width', `${input.columnWidth} ${units.dimensionUnit}`],
    ['Column Depth', `${input.columnDepth} ${units.dimensionUnit}`]
  )

  if (input.footingType === 'combined') {
    rows.push(
      ['Column 1 Load', `${input.serviceLoad} ${units.loadUnit}`],
      ['Column 2 Load', `${input.serviceLoad2} ${units.loadUnit}`],
      ['Column Spacing', `${input.columnSpacing} ${units.lengthUnit}`]
    )
  } else if (input.footingType === 'strap') {
    rows.push(
      ['Exterior Column Load', `${input.exteriorColumnLoad} ${units.loadUnit}`],
      ['Interior Column Load', `${input.interiorColumnLoad} ${units.loadUnit}`],
      ['Column Spacing', `${input.columnSpacing} ${units.lengthUnit}`]
    )
  } else {
    rows.push(['Service Load', `${input.serviceLoad} ${units.loadUnit}`])
  }

  return rows
}

function drawPdfFootingDiagram(doc, result, startY) {
  const y = startY

  doc.setDrawColor(249, 115, 22)
  doc.roundedRect(14, y, 182, 80, 3, 3, 'S')

  doc.setFontSize(10)
  doc.setTextColor(15, 23, 42)
  doc.text('Footing Plan + Section', 18, y + 7)

  doc.rect(35, y + 18, 55, 38)
  doc.rect(58, y + 30, 10, 10)

  for (let i = 0; i < 6; i += 1) {
    doc.line(38, y + 23 + i * 5, 87, y + 23 + i * 5)
  }

  for (let i = 0; i < 7; i += 1) {
    doc.line(40 + i * 7, y + 20, 40 + i * 7, y + 54)
  }

  doc.rect(115, y + 35, 58, 14)
  doc.rect(137, y + 20, 14, 15)
  doc.line(118, y + 44, 170, y + 44)

  doc.setFontSize(7)
  doc.text(`Size: ${getFootingSizeText(result)}`, 18, y + 64)
  doc.text(`Depth: ${formatPlain(result.depthMm)} mm`, 18, y + 70)
  doc.text(`X: ${result.xBars.dia} mm @ ${result.xBars.spacing} mm c/c`, 105, y + 64)
  doc.text(`Y: ${result.yBars.dia} mm @ ${result.yBars.spacing} mm c/c`, 105, y + 70)
  doc.text(`One-way shear: ${result.oneWaySafe ? 'Safe' : 'Check'}`, 18, y + 76)
  doc.text(`Punching shear: ${result.punchingSafe ? 'Safe' : 'Check'}`, 105, y + 76)
}
