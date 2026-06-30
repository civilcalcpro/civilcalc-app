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

const barDiameters = [10, 12, 16, 20, 25, 32]

const bondStressPlain = {
  M20: 1.2,
  M25: 1.4,
  M30: 1.5,
  M35: 1.7,
  M40: 1.9,
}

const defaultInputs = {
  unitSystem: 'metric',
  sectionType: 'rectangular',
  supportType: 'simply',
  span: 4.5,
  width: 230,
  webWidth: 230,
  flangeWidth: 1000,
  flangeThickness: 120,
  depth: 450,
  deadLoad: 5,
  liveLoad: 3,
  additionalLoad: 0,
  concreteGrade: 'M25',
  steelGrade: 'Fe500',
  clearCover: 25,
  supportWidth: 230,
  steelRate: 65,
}

function toNumber(value, fallback = 0) {
  const num = Number(value)
  return Number.isFinite(num) ? num : fallback
}

function convertInputsToMetric(input) {
  if (input.unitSystem === 'metric') {
    return {
      spanM: toNumber(input.span),
      widthMm: toNumber(input.width),
      webWidthMm: toNumber(input.webWidth),
      flangeWidthMm: toNumber(input.flangeWidth),
      flangeThicknessMm: toNumber(input.flangeThickness),
      depthMm: toNumber(input.depth),
      deadLoadKnM: toNumber(input.deadLoad),
      liveLoadKnM: toNumber(input.liveLoad),
      additionalLoadKnM: toNumber(input.additionalLoad),
      clearCoverMm: toNumber(input.clearCover),
      supportWidthMm: toNumber(input.supportWidth),
      steelRate: toNumber(input.steelRate),
    }
  }

  return {
    spanM: toNumber(input.span) * 0.3048,
    widthMm: toNumber(input.width) * 25.4,
    webWidthMm: toNumber(input.webWidth) * 25.4,
    flangeWidthMm: toNumber(input.flangeWidth) * 25.4,
    flangeThicknessMm: toNumber(input.flangeThickness) * 25.4,
    depthMm: toNumber(input.depth) * 25.4,
    deadLoadKnM: toNumber(input.deadLoad) * 14.5939,
    liveLoadKnM: toNumber(input.liveLoad) * 14.5939,
    additionalLoadKnM: toNumber(input.additionalLoad) * 14.5939,
    clearCoverMm: toNumber(input.clearCover) * 25.4,
    supportWidthMm: toNumber(input.supportWidth) * 25.4,
    steelRate: toNumber(input.steelRate),
  }
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

function getXuMaxFactor(fy) {
  if (fy <= 250) return 0.53
  if (fy <= 415) return 0.48
  if (fy <= 500) return 0.46
  return 0.44
}

function steelArea(dia) {
  return (Math.PI * dia * dia) / 4
}

function steelWeightPerMeter(dia) {
  return (dia * dia) / 162
}

function calculateMomentCapacity({ ast, sectionType, bw, bf, df, d, fck, fy }) {
  const xuMax = getXuMaxFactor(fy) * d
  const tensionForce = 0.87 * fy * ast

  if (sectionType === 'rectangular') {
    const xu = tensionForce / (0.36 * fck * bw)
    const limitedXu = Math.min(xu, xuMax)
    const momentNmm = 0.36 * fck * bw * limitedXu * (d - 0.42 * limitedXu)

    return {
      xu,
      limitedXu,
      momentNmm,
      neutralAxis: 'Rectangular Section',
      behaviour: 'Rectangular RCC Beam',
    }
  }

  const xuAsFlange = tensionForce / (0.36 * fck * bf)

  if (xuAsFlange <= df) {
    const limitedXu = Math.min(xuAsFlange, xuMax)
    const momentNmm = 0.36 * fck * bf * limitedXu * (d - 0.42 * limitedXu)

    return {
      xu: xuAsFlange,
      limitedXu,
      momentNmm,
      neutralAxis: 'Within Flange',
      behaviour: 'Acts like rectangular flange section',
    }
  }

  const flangeExtraWidth = Math.max(bf - bw, 0)
  const xu = (tensionForce / (0.36 * fck) - flangeExtraWidth * df) / bw
  const limitedXu = Math.min(Math.max(xu, df), xuMax)

  const webMoment =
    0.36 * fck * bw * limitedXu * (d - 0.42 * limitedXu)

  const flangeMoment =
    0.36 * fck * flangeExtraWidth * df * (d - 0.42 * df)

  return {
    xu,
    limitedXu,
    momentNmm: webMoment + flangeMoment,
    neutralAxis: 'Within Web',
    behaviour:
      sectionType === 'tbeam'
        ? 'True T-Beam Behaviour'
        : 'L-Beam / Edge Beam Behaviour',
  }
}

function findRequiredAst(params) {
  const { bw, depth, d, fck, fy, muNmm } = params
  const xuMax = getXuMaxFactor(fy) * d
  const astLimit = (0.36 * fck * bw * xuMax) / (0.87 * fy)

  const limitCapacity = calculateMomentCapacity({
    ...params,
    ast: astLimit,
  }).momentNmm

  let designType = 'Singly Reinforced'
  let compressionSteel = 0

  if (muNmm > limitCapacity) {
    designType = 'Doubly Reinforced'
    const extraMoment = muNmm - limitCapacity
    const dDash = Math.max(params.clearCover + 8 + 8, 40)
    compressionSteel = extraMoment / (0.87 * fy * Math.max(d - dDash, 1))
  }

  let low = 0
  let high = Math.max(100, 0.04 * bw * depth)

  for (let i = 0; i < 80; i += 1) {
    const mid = (low + high) / 2
    const cap = calculateMomentCapacity({
      ...params,
      ast: mid,
    }).momentNmm

    if (cap >= Math.min(muNmm, limitCapacity)) {
      high = mid
    } else {
      low = mid
    }
  }

  const ast = high + compressionSteel

  return {
    ast,
    astLimit,
    compressionSteel,
    designType,
    limitCapacity,
  }
}

function selectBarCombination({ astRequired, bw, clearCover, stirrupDia }) {
  const minClearSpacing = 25
  const options = []

  for (const dia of barDiameters) {
    for (let count = 2; count <= 10; count += 1) {
      const astProvided = count * steelArea(dia)
      if (astProvided < astRequired) continue

      const availableWidth = bw - 2 * (clearCover + stirrupDia)
      const requiredWidth = count * dia + (count - 1) * Math.max(minClearSpacing, dia)

      const fits = requiredWidth <= availableWidth
      const excess = astProvided - astRequired

      options.push({
        dia,
        count,
        astProvided,
        fits,
        excess,
        requiredWidth,
        availableWidth,
      })
    }
  }

  const fittingOptions = options.filter((item) => item.fits)
  const list = fittingOptions.length > 0 ? fittingOptions : options

  list.sort((a, b) => {
    if (a.fits !== b.fits) return a.fits ? -1 : 1
    if (a.count !== b.count) return a.count - b.count
    return a.excess - b.excess
  })

  return (
    list[0] || {
      dia: 16,
      count: Math.ceil(astRequired / steelArea(16)),
      astProvided: Math.ceil(astRequired / steelArea(16)) * steelArea(16),
      fits: false,
      excess: 0,
      requiredWidth: 0,
      availableWidth: bw,
    }
  )
}

function getShearDesign({ vuKn, bw, d, concreteGrade }) {
  const tauV = (vuKn * 1000) / (bw * d)

  const tauCMap = {
    M20: 0.36,
    M25: 0.42,
    M30: 0.48,
    M35: 0.52,
    M40: 0.56,
  }

  const tauC = tauCMap[concreteGrade] || 0.42

  let stirrupDia = 8
  let legs = 2
  let supportSpacing = 150
  let midSpacing = 200

  if (tauV > tauC * 1.25) {
    supportSpacing = 125
    midSpacing = 175
  }

  if (tauV > tauC * 1.75) {
    stirrupDia = 10
    supportSpacing = 100
    midSpacing = 150
  }

  if (bw > 300 || tauV > tauC * 1.75) {
    legs = 4
  }

  const maxSpacing = Math.min(0.75 * d, 300)
  supportSpacing = Math.min(supportSpacing, maxSpacing)
  midSpacing = Math.min(midSpacing, maxSpacing)

  return {
    tauV,
    tauC,
    stirrupDia,
    legs,
    supportSpacing: Math.round(supportSpacing / 25) * 25,
    midSpacing: Math.round(midSpacing / 25) * 25,
    status: tauV <= 2.8 ? 'Safe' : 'Unsafe',
  }
}

function calculateDevelopmentLength({ fy, concreteGrade, mainDia }) {
  const plainBond = bondStressPlain[concreteGrade] || 1.4
  const deformedBond = plainBond * 1.6
  return (0.87 * fy * mainDia) / (4 * deformedBond)
}

function calculateSteelQuantity({
  spanM,
  bw,
  depth,
  cover,
  mainDia,
  mainCount,
  topDia,
  topCount,
  stirrupDia,
  supportSpacing,
  midSpacing,
  supportType,
  ldMm,
}) {
  const mainLengthM =
    supportType === 'cantilever'
      ? spanM + ldMm / 1000
      : spanM + (2 * ldMm) / 1000

  const topLengthM = spanM

  const supportZoneLengthM =
    supportType === 'cantilever' ? spanM * 0.35 : spanM * 0.25 * 2

  const midZoneLengthM = Math.max(spanM - supportZoneLengthM, 0)

  const supportStirrups = Math.ceil((supportZoneLengthM * 1000) / supportSpacing)
  const midStirrups = Math.ceil((midZoneLengthM * 1000) / midSpacing)
  const totalStirrups = Math.max(supportStirrups + midStirrups + 1, 1)

  const stirrupCutLengthM =
    (2 * (bw - 2 * cover) + 2 * (depth - 2 * cover) + 20 * stirrupDia) / 1000

  const mainWeight = mainCount * mainLengthM * steelWeightPerMeter(mainDia)
  const topWeight = topCount * topLengthM * steelWeightPerMeter(topDia)
  const stirrupWeight =
    totalStirrups * stirrupCutLengthM * steelWeightPerMeter(stirrupDia)

  return {
    mainLengthM,
    topLengthM,
    stirrupCutLengthM,
    supportStirrups,
    midStirrups,
    totalStirrups,
    mainWeight,
    topWeight,
    stirrupWeight,
    totalWeight: mainWeight + topWeight + stirrupWeight,
  }
}

function calculateBeam(input) {
  const metric = convertInputsToMetric(input)

  const fck = concreteGrades[input.concreteGrade]
  const fy = steelGrades[input.steelGrade]

  const isRectangular = input.sectionType === 'rectangular'
  const bw = isRectangular ? metric.widthMm : metric.webWidthMm
  const bf = isRectangular ? metric.widthMm : metric.flangeWidthMm
  const df = isRectangular ? 0 : metric.flangeThicknessMm
  const depth = metric.depthMm

  if (metric.spanM <= 0 || bw <= 0 || depth <= 0) {
    throw new Error('Please enter valid beam dimensions.')
  }

  if (!isRectangular && (bf <= bw || df <= 0)) {
    throw new Error('For T-Beam / L-Beam, flange width must be greater than web width and flange thickness must be valid.')
  }

  let assumedMainDia = 16
  let assumedStirrupDia = 8
  let finalData = null

  for (let i = 0; i < 3; i += 1) {
    const effectiveDepth =
      depth - metric.clearCoverMm - assumedStirrupDia - assumedMainDia / 2

    const sectionAreaM2 = isRectangular
      ? (bw / 1000) * (depth / 1000)
      : ((bw * (depth - df) + bf * df) / 1000000)

    const selfWeight = sectionAreaM2 * 25
    const totalServiceLoad =
      selfWeight +
      metric.deadLoadKnM +
      metric.liveLoadKnM +
      metric.additionalLoadKnM

    const factoredLoad = 1.5 * totalServiceLoad

    const momentKnM =
      input.supportType === 'cantilever'
        ? (factoredLoad * metric.spanM * metric.spanM) / 2
        : (factoredLoad * metric.spanM * metric.spanM) / 8

    const shearKn =
      input.supportType === 'cantilever'
        ? factoredLoad * metric.spanM
        : (factoredLoad * metric.spanM) / 2

    const muNmm = momentKnM * 1000000

    const astData = findRequiredAst({
      sectionType: input.sectionType,
      bw,
      bf,
      df,
      depth,
      d: effectiveDepth,
      fck,
      fy,
      muNmm,
      clearCover: metric.clearCoverMm,
    })

    const shear = getShearDesign({
      vuKn: shearKn,
      bw,
      d: effectiveDepth,
      concreteGrade: input.concreteGrade,
    })

    const barSelection = selectBarCombination({
      astRequired: astData.ast,
      bw,
      clearCover: metric.clearCoverMm,
      stirrupDia: shear.stirrupDia,
    })

    assumedMainDia = barSelection.dia
    assumedStirrupDia = shear.stirrupDia

    const capacity = calculateMomentCapacity({
      sectionType: input.sectionType,
      bw,
      bf,
      df,
      d: effectiveDepth,
      fck,
      fy,
      ast: barSelection.astProvided,
    })

    const ldMm = calculateDevelopmentLength({
      fy,
      concreteGrade: input.concreteGrade,
      mainDia: barSelection.dia,
    })

    const availableLd =
      input.supportType === 'cantilever'
        ? metric.supportWidthMm + 12 * barSelection.dia
        : metric.supportWidthMm + 12 * barSelection.dia

    const allowableLd =
      input.supportType === 'cantilever' ? 7 : 20

    const actualLdRatio = (metric.spanM * 1000) / effectiveDepth

    const topDia = bw <= 230 ? 10 : 12
    const topCount = 2

    const steelQuantity = calculateSteelQuantity({
      spanM: metric.spanM,
      bw,
      depth,
      cover: metric.clearCoverMm,
      mainDia: barSelection.dia,
      mainCount: barSelection.count,
      topDia,
      topCount,
      stirrupDia: shear.stirrupDia,
      supportSpacing: shear.supportSpacing,
      midSpacing: shear.midSpacing,
      supportType: input.supportType,
      ldMm,
    })

    const steelCost =
      input.unitSystem === 'imperial'
        ? steelQuantity.totalWeight * 2.20462 * metric.steelRate
        : steelQuantity.totalWeight * metric.steelRate

    finalData = {
      input,
      metric,
      fck,
      fy,
      bw,
      bf,
      df,
      depth,
      effectiveDepth,
      selfWeight,
      totalServiceLoad,
      factoredLoad,
      momentKnM,
      shearKn,
      astRequired: astData.ast,
      astLimit: astData.astLimit,
      astProvided: barSelection.astProvided,
      compressionSteel: astData.compressionSteel,
      designType: astData.designType,
      momentCapacityKnM: capacity.momentNmm / 1000000,
      neutralAxis: capacity.neutralAxis,
      behaviour: capacity.behaviour,
      xu: capacity.xu,
      barSelection,
      shear,
      ldMm,
      availableLd,
      actualLdRatio,
      allowableLd,
      deflectionStatus: actualLdRatio <= allowableLd ? 'Safe' : 'Check Required',
      ldStatus: availableLd >= ldMm ? 'OK' : 'Check Required',
      topDia,
      topCount,
      steelQuantity,
      steelCost,
      status:
        capacity.momentNmm >= muNmm &&
        shear.status === 'Safe' &&
        actualLdRatio <= allowableLd
          ? 'Safe'
          : 'Check Required',
      mainSteelLocation:
        input.supportType === 'cantilever' ? 'Top' : 'Bottom',
      nominalSteelLocation:
        input.supportType === 'cantilever' ? 'Bottom' : 'Top',
    }
  }

  return finalData
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
          ? 'bg-orange-500/10 border-orange-500/50'
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

function BeamCrossSectionDiagram({ result }) {
  const mainAtTop = result.mainSteelLocation === 'Top'
  const bLabel =
    result.input.sectionType === 'rectangular'
      ? `b = ${formatPlain(result.bw)} mm`
      : `bw = ${formatPlain(result.bw)} mm`

  const mainText = `${result.barSelection.count}-${result.barSelection.dia} mm Ø ${result.mainSteelLocation} Bars`
  const nominalText = `${result.topCount}-${result.topDia} mm Ø ${result.nominalSteelLocation} Bars`
  const stirrupText = `${result.shear.stirrupDia} mm Ø ${result.shear.legs}-Legged Stirrups`

  const topBars = mainAtTop ? result.barSelection.count : result.topCount
  const bottomBars = mainAtTop ? result.topCount : result.barSelection.count

  return (
    <div className="rounded-2xl bg-slate-950/60 border border-slate-800 p-5 overflow-hidden">
      <h3 className="text-lg font-bold text-white">Cross Section Diagram</h3>
      <p className="text-xs text-slate-500 mb-4">क्रॉस सेक्शन डायग्राम</p>

      <svg viewBox="0 0 620 430" className="w-full h-auto">
        <rect x="0" y="0" width="620" height="430" rx="18" fill="#020617" />

        <rect
          x="185"
          y="70"
          width="250"
          height="285"
          rx="6"
          fill="#0f172a"
          stroke="#f97316"
          strokeWidth="3"
        />

        <rect
          x="215"
          y="100"
          width="190"
          height="225"
          rx="4"
          fill="none"
          stroke="#94a3b8"
          strokeWidth="3"
        />

        {Array.from({ length: Math.min(topBars, 6) }).map((_, index) => {
          const gap = 150 / Math.max(Math.min(topBars, 6) - 1, 1)
          return (
            <circle
              key={`top-${index}`}
              cx={235 + index * gap}
              cy="120"
              r="9"
              fill={mainAtTop ? '#f97316' : '#38bdf8'}
            />
          )
        })}

        {Array.from({ length: Math.min(bottomBars, 6) }).map((_, index) => {
          const gap = 150 / Math.max(Math.min(bottomBars, 6) - 1, 1)
          return (
            <circle
              key={`bottom-${index}`}
              cx={235 + index * gap}
              cy="305"
              r="9"
              fill={mainAtTop ? '#38bdf8' : '#f97316'}
            />
          )
        })}

        <line x1="185" y1="380" x2="435" y2="380" stroke="#64748b" strokeWidth="2" />
        <line x1="185" y1="372" x2="185" y2="388" stroke="#64748b" strokeWidth="2" />
        <line x1="435" y1="372" x2="435" y2="388" stroke="#64748b" strokeWidth="2" />
        <text x="258" y="405" fill="#e2e8f0" fontSize="16">
          {bLabel}
        </text>

        <line x1="465" y1="70" x2="465" y2="355" stroke="#64748b" strokeWidth="2" />
        <line x1="457" y1="70" x2="473" y2="70" stroke="#64748b" strokeWidth="2" />
        <line x1="457" y1="355" x2="473" y2="355" stroke="#64748b" strokeWidth="2" />
        <text x="485" y="220" fill="#e2e8f0" fontSize="16">
          D = {formatPlain(result.depth)} mm
        </text>

        <text x="25" y="90" fill="#f97316" fontSize="15" fontWeight="700">
          {mainAtTop ? mainText : nominalText}
        </text>
        <line x1="165" y1="92" x2="245" y2="120" stroke="#f97316" strokeWidth="2" />

        <text x="25" y="320" fill="#f97316" fontSize="15" fontWeight="700">
          {mainAtTop ? nominalText : mainText}
        </text>
        <line x1="165" y1="315" x2="245" y2="305" stroke="#f97316" strokeWidth="2" />

        <text x="390" y="45" fill="#cbd5e1" fontSize="15">
          {stirrupText}
        </text>

        <text x="390" y="385" fill="#cbd5e1" fontSize="15">
          Cover = {formatPlain(result.metric.clearCoverMm)} mm
        </text>
      </svg>
    </div>
  )
}

function BeamLongitudinalDiagram({ result }) {
  const mainLocation = result.mainSteelLocation
  const mainText = `${result.barSelection.count}-${result.barSelection.dia} mm Ø Main Bars`
  const nominalText = `${result.topCount}-${result.topDia} mm Ø ${result.nominalSteelLocation} Bars`

  return (
    <div className="rounded-2xl bg-slate-950/60 border border-slate-800 p-5 overflow-hidden">
      <h3 className="text-lg font-bold text-white">Longitudinal Diagram</h3>
      <p className="text-xs text-slate-500 mb-4">लॉन्गिट्यूडिनल डायग्राम</p>

      <svg viewBox="0 0 720 360" className="w-full h-auto">
        <rect x="0" y="0" width="720" height="360" rx="18" fill="#020617" />

        <rect
          x="75"
          y="125"
          width="570"
          height="90"
          rx="8"
          fill="#0f172a"
          stroke="#334155"
          strokeWidth="3"
        />

        {result.input.supportType === 'simply' ? (
          <>
            <polygon points="90,230 130,230 110,270" fill="#64748b" />
            <polygon points="590,230 630,230 610,270" fill="#64748b" />
          </>
        ) : (
          <>
            <rect x="60" y="95" width="35" height="150" fill="#64748b" />
            <line x1="95" y1="95" x2="95" y2="245" stroke="#94a3b8" strokeWidth="3" />
          </>
        )}

        <line
          x1="95"
          y1={mainLocation === 'Top' ? 145 : 195}
          x2="625"
          y2={mainLocation === 'Top' ? 145 : 195}
          stroke="#f97316"
          strokeWidth="6"
          strokeLinecap="round"
        />

        <line
          x1="95"
          y1={mainLocation === 'Top' ? 195 : 145}
          x2="625"
          y2={mainLocation === 'Top' ? 195 : 145}
          stroke="#38bdf8"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {Array.from({ length: 17 }).map((_, index) => {
          const x = 100 + index * 32
          const isSupportZone =
            result.input.supportType === 'cantilever'
              ? index < 7
              : index < 4 || index > 12

          return (
            <line
              key={index}
              x1={x}
              y1="128"
              x2={x}
              y2="212"
              stroke={isSupportZone ? '#f97316' : '#94a3b8'}
              strokeWidth="2"
            />
          )
        })}

        <text x="90" y="60" fill="#f97316" fontSize="16" fontWeight="700">
          {mainText} at {mainLocation}
        </text>

        <text x="90" y="85" fill="#38bdf8" fontSize="15">
          {nominalText}
        </text>

        <text x="90" y="300" fill="#e2e8f0" fontSize="15">
          Support Zone: {result.shear.stirrupDia} mm Ø @{' '}
          {result.shear.supportSpacing} mm c/c
        </text>

        <text x="395" y="300" fill="#e2e8f0" fontSize="15">
          Mid Zone: {result.shear.stirrupDia} mm Ø @ {result.shear.midSpacing}{' '}
          mm c/c
        </text>

        <line x1="75" y1="245" x2="645" y2="245" stroke="#64748b" strokeWidth="2" />
        <line x1="75" y1="238" x2="75" y2="252" stroke="#64748b" strokeWidth="2" />
        <line x1="645" y1="238" x2="645" y2="252" stroke="#64748b" strokeWidth="2" />

        <text x="300" y="270" fill="#cbd5e1" fontSize="15">
          Span = {formatNumber(result.metric.spanM, 2)} m
        </text>
      </svg>
    </div>
  )
}

export default function RCCBeamDesignPage() {
  const [input, setInput] = useState(defaultInputs)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const isMetric = input.unitSystem === 'metric'
  const isRectangular = input.sectionType === 'rectangular'

  const lengthUnit = isMetric ? 'm' : 'ft'
  const dimensionUnit = isMetric ? 'mm' : 'in'
  const loadUnit = isMetric ? 'kN/m' : 'kip/ft'
  const steelRateUnit = isMetric ? '₹/kg' : '₹/lb'

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
      const data = calculateBeam(input)
      setResult(data)
    } catch (err) {
      setResult(null)
      setError(err.message || 'Something went wrong. Please check inputs.')
    }
  }

  async function handleDownloadPDF() {
    if (!result) return

    const { default: jsPDF } = await import('jspdf')
    const autoTable = (await import('jspdf-autotable')).default

    const doc = new jsPDF('p', 'mm', 'a4')

    doc.setFillColor(5, 11, 31)
    doc.rect(0, 0, 210, 28, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(18)
    doc.text('CivilCalc Pro', 14, 12)
    doc.setFontSize(12)
    doc.text('RCC Beam Design Report', 14, 20)

    doc.setTextColor(100, 116, 139)
    doc.setFontSize(9)
    doc.text(`Generated: ${new Date().toLocaleString('en-IN')}`, 145, 12)
    doc.text(`Unit System: ${input.unitSystem === 'metric' ? 'Metric' : 'Imperial'}`, 145, 18)

    doc.setTextColor(15, 23, 42)
    doc.setFontSize(14)
    doc.text('Input Summary', 14, 38)

    const inputRows = [
      ['Beam Section Type', getSectionLabel(input.sectionType)],
      ['Support Type', getSupportLabel(input.supportType)],
      ['Span', `${input.span} ${lengthUnit}`],
      [
        isRectangular ? 'Width' : 'Web Width',
        `${isRectangular ? input.width : input.webWidth} ${dimensionUnit}`,
      ],
      !isRectangular && ['Flange Width', `${input.flangeWidth} ${dimensionUnit}`],
      !isRectangular && ['Flange Thickness', `${input.flangeThickness} ${dimensionUnit}`],
      ['Overall Depth', `${input.depth} ${dimensionUnit}`],
      ['Dead Load', `${input.deadLoad} ${loadUnit}`],
      ['Live Load', `${input.liveLoad} ${loadUnit}`],
      ['Additional Load', `${input.additionalLoad} ${loadUnit}`],
      ['Concrete Grade', input.concreteGrade],
      ['Steel Grade', input.steelGrade],
      ['Clear Cover', `${input.clearCover} ${dimensionUnit}`],
      ['Support Width', `${input.supportWidth} ${dimensionUnit}`],
      ['Steel Rate', `${input.steelRate} ${steelRateUnit}`],
    ].filter(Boolean)

    autoTable(doc, {
      startY: 43,
      head: [['Input', 'Value']],
      body: inputRows,
      theme: 'grid',
      headStyles: { fillColor: [249, 115, 22] },
      styles: { fontSize: 9 },
    })

    let y = doc.lastAutoTable.finalY + 12
    doc.setFontSize(14)
    doc.setTextColor(15, 23, 42)
    doc.text('Output Summary', 14, y)

    const outputRows = [
      ['Design Status', result.status],
      ['Design Type', result.designType],
      ['Main Reinforcement', `${result.barSelection.count} bars of ${result.barSelection.dia} mm dia at ${result.mainSteelLocation}`],
      ['Nominal / Hanger Bars', `${result.topCount} bars of ${result.topDia} mm dia at ${result.nominalSteelLocation}`],
      ['Stirrups', `${result.shear.stirrupDia} mm dia, ${result.shear.legs}-legged`],
      ['Support Zone Spacing', `${result.shear.supportSpacing} mm c/c`],
      ['Mid Zone Spacing', `${result.shear.midSpacing} mm c/c`],
      ['Required Ast', `${formatNumber(result.astRequired, 2)} mm²`],
      ['Provided Ast', `${formatNumber(result.astProvided, 2)} mm²`],
      ['Effective Depth', `${formatNumber(result.effectiveDepth, 1)} mm`],
      ['Maximum Moment', `${formatNumber(result.momentKnM, 2)} kNm`],
      ['Shear Force', `${formatNumber(result.shearKn, 2)} kN`],
      ['Section Behaviour', result.behaviour],
      ['Development Length', `${formatNumber(result.ldMm, 0)} mm - ${result.ldStatus}`],
      ['Deflection Check', `${formatNumber(result.actualLdRatio, 2)} - ${result.deflectionStatus}`],
      ['Total Steel Weight', `${formatNumber(result.steelQuantity.totalWeight, 2)} kg`],
      ['Approx Steel Cost', `${input.unitSystem === 'metric' ? '₹' : '₹'}${formatNumber(result.steelCost, 0)}`],
    ]

    autoTable(doc, {
      startY: y + 5,
      head: [['Output', 'Value']],
      body: outputRows,
      theme: 'grid',
      headStyles: { fillColor: [15, 23, 42] },
      styles: { fontSize: 8.5 },
    })

    y = doc.lastAutoTable.finalY + 12

    if (y > 220) {
      doc.addPage()
      y = 18
    }

    doc.setFontSize(14)
    doc.setTextColor(15, 23, 42)
    doc.text('Reinforcement Diagrams', 14, y)

    drawPdfDiagrams(doc, result, y + 8)

    doc.setFontSize(8)
    doc.setTextColor(100, 116, 139)
    doc.text('Generated by CivilCalc Pro', 14, 288)

    doc.save('CivilCalc-Pro-RCC-Beam-Design.pdf')
  }

  return (
    <main className="min-h-screen bg-[#050B1F] text-white px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <p className="text-orange-500 text-sm font-semibold tracking-wide uppercase">
            CivilCalc Pro
          </p>
          <h1 className="text-3xl md:text-5xl font-extrabold mt-2">
            RCC Beam Design
          </h1>
          <p className="text-slate-400 mt-3 max-w-3xl">
            Rectangular, T-Beam and L-Beam design with auto reinforcement,
            stirrup spacing, steel quantity and labelled diagrams.
          </p>
          <p className="text-slate-500 text-sm mt-1">
            Rectangular, T-Beam और L-Beam के लिए automatic reinforcement और diagram.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 items-start">
          <section className="rounded-3xl bg-slate-900/70 border border-slate-800 p-6">
            <h2 className="text-2xl font-bold mb-1">Input Details</h2>
            <p className="text-sm text-slate-500 mb-6">इनपुट डिटेल्स</p>

            <div className="grid md:grid-cols-2 gap-5">
              <Field label="Unit System" hindi="यूनिट सिस्टम">
                <SelectBox
                  value={input.unitSystem}
                  onChange={(e) => updateInput('unitSystem', e.target.value)}
                >
                  <option value="metric">Metric - m, mm, kN</option>
                  <option value="imperial">Imperial - ft, in, kip</option>
                </SelectBox>
              </Field>

              <Field label="Beam Section Type" hindi="बीम सेक्शन टाइप">
                <SelectBox
                  value={input.sectionType}
                  onChange={(e) => updateInput('sectionType', e.target.value)}
                >
                  <option value="rectangular">Rectangular Beam</option>
                  <option value="tbeam">T-Beam</option>
                  <option value="lbeam">L-Beam / Edge Beam</option>
                </SelectBox>
              </Field>

              <Field label="Support Type" hindi="सपोर्ट टाइप">
                <SelectBox
                  value={input.supportType}
                  onChange={(e) => updateInput('supportType', e.target.value)}
                >
                  <option value="simply">Simply Supported Beam</option>
                  <option value="cantilever">Cantilever Beam</option>
                </SelectBox>
              </Field>

              <Field label={`Effective Span (${lengthUnit})`} hindi="प्रभावी स्पैन">
                <InputBox
                  type="number"
                  value={input.span}
                  onChange={(e) => updateInput('span', e.target.value)}
                />
              </Field>

              {isRectangular ? (
                <Field label={`Width b (${dimensionUnit})`} hindi="चौड़ाई">
                  <InputBox
                    type="number"
                    value={input.width}
                    onChange={(e) => updateInput('width', e.target.value)}
                  />
                </Field>
              ) : (
                <>
                  <Field label={`Web Width bw (${dimensionUnit})`} hindi="वेब चौड़ाई">
                    <InputBox
                      type="number"
                      value={input.webWidth}
                      onChange={(e) => updateInput('webWidth', e.target.value)}
                    />
                  </Field>

                  <Field label={`Flange Width bf (${dimensionUnit})`} hindi="फ्लेंज चौड़ाई">
                    <InputBox
                      type="number"
                      value={input.flangeWidth}
                      onChange={(e) => updateInput('flangeWidth', e.target.value)}
                    />
                  </Field>

                  <Field label={`Flange Thickness Df (${dimensionUnit})`} hindi="फ्लेंज मोटाई">
                    <InputBox
                      type="number"
                      value={input.flangeThickness}
                      onChange={(e) => updateInput('flangeThickness', e.target.value)}
                    />
                  </Field>
                </>
              )}

              <Field label={`Overall Depth D (${dimensionUnit})`} hindi="कुल गहराई">
                <InputBox
                  type="number"
                  value={input.depth}
                  onChange={(e) => updateInput('depth', e.target.value)}
                />
              </Field>

              <Field label={`Dead Load (${loadUnit})`} hindi="डेड लोड">
                <InputBox
                  type="number"
                  value={input.deadLoad}
                  onChange={(e) => updateInput('deadLoad', e.target.value)}
                />
              </Field>

              <Field label={`Live Load (${loadUnit})`} hindi="लाइव लोड">
                <InputBox
                  type="number"
                  value={input.liveLoad}
                  onChange={(e) => updateInput('liveLoad', e.target.value)}
                />
              </Field>

              <Field label={`Additional / Wall Load (${loadUnit})`} hindi="अतिरिक्त / दीवार लोड">
                <InputBox
                  type="number"
                  value={input.additionalLoad}
                  onChange={(e) => updateInput('additionalLoad', e.target.value)}
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

              <Field label={`Clear Cover (${dimensionUnit})`} hindi="क्लीयर कवर">
                <InputBox
                  type="number"
                  value={input.clearCover}
                  onChange={(e) => updateInput('clearCover', e.target.value)}
                />
              </Field>

              <Field label={`Support Width (${dimensionUnit})`} hindi="सपोर्ट चौड़ाई">
                <InputBox
                  type="number"
                  value={input.supportWidth}
                  onChange={(e) => updateInput('supportWidth', e.target.value)}
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
              Calculate RCC Beam Design
            </button>
          </section>

          <section className="space-y-5">
            {!result ? (
              <div className="rounded-3xl bg-slate-900/70 border border-slate-800 p-8 text-center min-h-[420px] flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-orange-500/10 border border-orange-500/30 flex items-center justify-center mb-4">
                  <span className="text-3xl">🏗️</span>
                </div>
                <h2 className="text-2xl font-bold">Result will appear here</h2>
                <p className="text-slate-400 mt-2 max-w-md">
                  Enter beam details and click Calculate to generate output,
                  reinforcement recommendation and diagrams.
                </p>
                <p className="text-slate-500 text-sm mt-2">
                  Calculate button दबाने के बाद ही output आएगा.
                </p>
              </div>
            ) : (
              <>
                <ResultCard title="Design Status" hindi="डिज़ाइन स्टेटस" highlight>
                  <Row
                    label="Status"
                    value={result.status}
                    strong
                  />
                  <Row
                    label="Beam Section"
                    value={getSectionLabel(result.input.sectionType)}
                  />
                  <Row
                    label="Support Type"
                    value={getSupportLabel(result.input.supportType)}
                  />
                  <Row label="Design Type" value={result.designType} />
                </ResultCard>

                <ResultCard title="Final Recommendation" hindi="अंतिम सुझाव" highlight>
                  <Row
                    label="Main Reinforcement"
                    value={`${result.barSelection.count} bars of ${result.barSelection.dia} mm dia at ${result.mainSteelLocation}`}
                    strong
                  />
                  <Row
                    label="Top / Nominal Bars"
                    value={`${result.topCount} bars of ${result.topDia} mm dia at ${result.nominalSteelLocation}`}
                  />
                  <Row
                    label="Stirrups"
                    value={`${result.shear.stirrupDia} mm dia, ${result.shear.legs}-legged`}
                  />
                  <Row
                    label="Support Zone"
                    value={`${result.shear.stirrupDia} mm dia @ ${result.shear.supportSpacing} mm c/c`}
                  />
                  <Row
                    label="Mid Zone"
                    value={`${result.shear.stirrupDia} mm dia @ ${result.shear.midSpacing} mm c/c`}
                  />
                </ResultCard>

                <ResultCard title="Geometry Result" hindi="ज्योमेट्री रिजल्ट">
                  <Row label="Effective Span" value={`${formatNumber(result.metric.spanM, 2)} m`} />
                  <Row label="Width / Web Width" value={`${formatNumber(result.bw, 0)} mm`} />
                  {!isRectangular && (
                    <>
                      <Row label="Flange Width" value={`${formatNumber(result.bf, 0)} mm`} />
                      <Row label="Flange Thickness" value={`${formatNumber(result.df, 0)} mm`} />
                    </>
                  )}
                  <Row label="Overall Depth" value={`${formatNumber(result.depth, 0)} mm`} />
                  <Row label="Effective Depth" value={`${formatNumber(result.effectiveDepth, 1)} mm`} />
                </ResultCard>

                <ResultCard title="Loading Result" hindi="लोडिंग रिजल्ट">
                  <Row label="Self Weight" value={`${formatNumber(result.selfWeight, 2)} kN/m`} />
                  <Row label="Total Service Load" value={`${formatNumber(result.totalServiceLoad, 2)} kN/m`} />
                  <Row label="Factored Load" value={`${formatNumber(result.factoredLoad, 2)} kN/m`} />
                  <Row label="Maximum Moment" value={`${formatNumber(result.momentKnM, 2)} kNm`} />
                  <Row label="Shear Force" value={`${formatNumber(result.shearKn, 2)} kN`} />
                </ResultCard>

                <ResultCard title="Section Behaviour" hindi="सेक्शन बिहेवियर">
                  <Row label="Neutral Axis" value={result.neutralAxis} />
                  <Row label="Behaviour" value={result.behaviour} />
                </ResultCard>

                <ResultCard title="Reinforcement Result" hindi="रिइनफोर्समेंट रिजल्ट">
                  <Row label="Required Ast" value={`${formatNumber(result.astRequired, 2)} mm²`} />
                  <Row label="Provided Ast" value={`${formatNumber(result.astProvided, 2)} mm²`} />
                  <Row
                    label="Bar Arrangement"
                    value={`${result.barSelection.count}-${result.barSelection.dia} mm Ø`}
                    strong
                  />
                  <Row
                    label="Spacing Check"
                    value={result.barSelection.fits ? 'OK' : 'Check beam width / bar congestion'}
                  />
                </ResultCard>

                <ResultCard title="Shear & Stirrups" hindi="शियर और स्टिरप्स">
                  <Row label="Nominal Shear Stress" value={`${formatNumber(result.shear.tauV, 3)} N/mm²`} />
                  <Row label="Concrete Shear Capacity" value={`${formatNumber(result.shear.tauC, 3)} N/mm²`} />
                  <Row label="Shear Status" value={result.shear.status} />
                  <Row
                    label="Stirrup Details"
                    value={`${result.shear.stirrupDia} mm Ø, ${result.shear.legs}-legged`}
                  />
                </ResultCard>

                <ResultCard title="Deflection Check" hindi="डिफ्लेक्शन चेक">
                  <Row label="Actual L/d" value={formatNumber(result.actualLdRatio, 2)} />
                  <Row label="Allowable L/d" value={formatNumber(result.allowableLd, 2)} />
                  <Row label="Status" value={result.deflectionStatus} />
                </ResultCard>

                <ResultCard title="Development Length" hindi="डेवलपमेंट लेंथ">
                  <Row label="Required Ld" value={`${formatNumber(result.ldMm, 0)} mm`} />
                  <Row label="Available Anchorage" value={`${formatNumber(result.availableLd, 0)} mm`} />
                  <Row label="Status" value={result.ldStatus} />
                </ResultCard>

                <ResultCard title="Steel Quantity" hindi="स्टील क्वांटिटी">
                  <Row label="Main Bar Weight" value={`${formatNumber(result.steelQuantity.mainWeight, 2)} kg`} />
                  <Row label="Top / Nominal Bar Weight" value={`${formatNumber(result.steelQuantity.topWeight, 2)} kg`} />
                  <Row label="Stirrup Count" value={`${result.steelQuantity.totalStirrups} nos`} />
                  <Row label="Stirrup Weight" value={`${formatNumber(result.steelQuantity.stirrupWeight, 2)} kg`} />
                  <Row label="Total Steel Weight" value={`${formatNumber(result.steelQuantity.totalWeight, 2)} kg`} strong />
                  <Row label="Approx Steel Cost" value={`₹${formatNumber(result.steelCost, 0)}`} strong />
                </ResultCard>

                <BeamCrossSectionDiagram result={result} />
                <BeamLongitudinalDiagram result={result} />

                <button
                  onClick={handleDownloadPDF}
                  className="w-full rounded-2xl bg-white text-slate-950 hover:bg-slate-200 font-bold py-4 transition"
                >
                  Download Professional PDF
                </button>
              </>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}

function getSectionLabel(sectionType) {
  if (sectionType === 'tbeam') return 'T-Beam'
  if (sectionType === 'lbeam') return 'L-Beam / Edge Beam'
  return 'Rectangular Beam'
}

function getSupportLabel(supportType) {
  if (supportType === 'cantilever') return 'Cantilever Beam'
  return 'Simply Supported Beam'
}

function drawPdfDiagrams(doc, result, startY) {
  let y = startY

  doc.setDrawColor(249, 115, 22)
  doc.setFillColor(245, 245, 245)
  doc.roundedRect(14, y, 80, 75, 3, 3, 'S')

  doc.setFontSize(10)
  doc.setTextColor(15, 23, 42)
  doc.text('Cross Section', 18, y + 7)

  doc.setDrawColor(15, 23, 42)
  doc.rect(42, y + 15, 28, 45)
  doc.rect(46, y + 19, 20, 37)

  const mainAtTop = result.mainSteelLocation === 'Top'
  const topCount = mainAtTop ? result.barSelection.count : result.topCount
  const bottomCount = mainAtTop ? result.topCount : result.barSelection.count

  for (let i = 0; i < Math.min(topCount, 4); i += 1) {
    doc.circle(49 + i * 5, y + 23, 1.5, 'F')
  }

  for (let i = 0; i < Math.min(bottomCount, 4); i += 1) {
    doc.circle(49 + i * 5, y + 52, 1.5, 'F')
  }

  doc.setFontSize(7)
  doc.text(`${result.barSelection.count}-${result.barSelection.dia} mm dia main bars`, 18, y + 66)
  doc.text(`${result.shear.stirrupDia} mm dia stirrups`, 18, y + 71)

  doc.setDrawColor(249, 115, 22)
  doc.roundedRect(108, y, 88, 75, 3, 3, 'S')

  doc.setFontSize(10)
  doc.setTextColor(15, 23, 42)
  doc.text('Longitudinal Detail', 112, y + 7)

  doc.setDrawColor(15, 23, 42)
  doc.rect(118, y + 25, 65, 16)

  doc.setDrawColor(249, 115, 22)
  doc.line(120, y + (mainAtTop ? 29 : 38), 181, y + (mainAtTop ? 29 : 38))
  doc.setDrawColor(56, 189, 248)
  doc.line(120, y + (mainAtTop ? 38 : 29), 181, y + (mainAtTop ? 38 : 29))

  doc.setDrawColor(100, 116, 139)
  for (let i = 0; i <= 12; i += 1) {
    doc.line(121 + i * 5, y + 26, 121 + i * 5, y + 40)
  }

  doc.setFontSize(7)
  doc.setTextColor(15, 23, 42)
  doc.text(`${result.barSelection.count}-${result.barSelection.dia} mm dia at ${result.mainSteelLocation}`, 112, y + 52)
  doc.text(`${result.shear.stirrupDia} mm dia @ ${result.shear.supportSpacing} mm c/c support zone`, 112, y + 58)
  doc.text(`${result.shear.stirrupDia} mm dia @ ${result.shear.midSpacing} mm c/c mid zone`, 112, y + 64)
}
