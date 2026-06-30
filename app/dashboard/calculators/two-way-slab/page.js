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

const edgeConditions = {
  allDiscontinuous: {
    label: 'All Edges Discontinuous',
    hindi: 'सभी किनारे discontinuous',
    edges: { top: false, bottom: false, left: false, right: false },
    factor: 1.0,
    note: 'Corner torsion steel is critical at all corners.',
  },
  oneShortDiscontinuous: {
    label: 'One Short Edge Discontinuous',
    hindi: 'एक short edge discontinuous',
    edges: { top: true, bottom: true, left: false, right: true },
    factor: 0.95,
    note: 'Half torsion steel is required near affected corners.',
  },
  oneLongDiscontinuous: {
    label: 'One Long Edge Discontinuous',
    hindi: 'एक long edge discontinuous',
    edges: { top: false, bottom: true, left: true, right: true },
    factor: 0.95,
    note: 'Half torsion steel is required near affected corners.',
  },
  twoAdjacentDiscontinuous: {
    label: 'Two Adjacent Edges Discontinuous',
    hindi: 'दो adjacent edges discontinuous',
    edges: { top: false, bottom: true, left: false, right: true },
    factor: 0.98,
    note: 'One full torsion corner and half torsion at adjacent corners.',
  },
  twoShortDiscontinuous: {
    label: 'Two Short Edges Discontinuous',
    hindi: 'दो short edges discontinuous',
    edges: { top: true, bottom: true, left: false, right: false },
    factor: 0.9,
    note: 'Half torsion steel is required at corners.',
  },
  twoLongDiscontinuous: {
    label: 'Two Long Edges Discontinuous',
    hindi: 'दो long edges discontinuous',
    edges: { top: false, bottom: false, left: true, right: true },
    factor: 0.9,
    note: 'Half torsion steel is required at corners.',
  },
  threeDiscontinuous: {
    label: 'Three Edges Discontinuous',
    hindi: 'तीन edges discontinuous',
    edges: { top: false, bottom: false, left: false, right: true },
    factor: 1.0,
    note: 'Torsion steel is required at multiple discontinuous corners.',
  },
  fourContinuous: {
    label: 'Four Edges Continuous',
    hindi: 'चारों edges continuous',
    edges: { top: true, bottom: true, left: true, right: true },
    factor: 0.78,
    note: 'Corner torsion steel is generally not critical.',
  },
}

const twoWayBaseCoefficients = {
  1.0: { ax: 0.062, ay: 0.062 },
  1.1: { ax: 0.074, ay: 0.061 },
  1.2: { ax: 0.084, ay: 0.059 },
  1.3: { ax: 0.093, ay: 0.055 },
  1.4: { ax: 0.099, ay: 0.051 },
  1.5: { ax: 0.104, ay: 0.046 },
  1.75: { ax: 0.113, ay: 0.037 },
  2.0: { ax: 0.118, ay: 0.029 },
}

const bondStressPlain = {
  M20: 1.2,
  M25: 1.4,
  M30: 1.5,
  M35: 1.7,
  M40: 1.9,
}

const barDiameters = [8, 10, 12, 16]
const spacingOptions = [100, 125, 150, 175, 200, 225, 250, 300]

const defaultInputs = {
  unitSystem: 'metric',
  edgeCondition: 'allDiscontinuous',
  lx: 3,
  ly: 4.2,
  thickness: '',
  floorFinish: 1,
  liveLoad: 3,
  additionalLoad: 0,
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
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })
}

function formatPlain(value, digits = 0) {
  if (!Number.isFinite(value)) return '-'
  return value.toLocaleString('en-IN', {
    maximumFractionDigits: digits,
  })
}

function roundUpTo(value, step = 5) {
  return Math.ceil(value / step) * step
}

function barArea(dia) {
  return (Math.PI * dia * dia) / 4
}

function steelWeightPerMeter(dia) {
  return (dia * dia) / 162
}

function convertInputsToMetric(input) {
  const isMetric = input.unitSystem === 'metric'

  const lengthToM = (value) => (isMetric ? toNumber(value) : toNumber(value) * 0.3048)
  const dimToMm = (value) => (isMetric ? toNumber(value) : toNumber(value) * 25.4)
  const loadToKnM2 = (value, fallback) => {
    const baseValue = isBlank(value) ? fallback : toNumber(value)
    return isMetric ? baseValue : baseValue * 47.8803
  }

  const thicknessBlank = isBlank(input.thickness)
  const coverBlank = isBlank(input.clearCover)

  return {
    lxM: lengthToM(input.lx),
    lyM: lengthToM(input.ly),
    thicknessMm: thicknessBlank ? 0 : dimToMm(input.thickness),
    thicknessMode: thicknessBlank ? 'Auto' : 'Manual',
    floorFinishKnM2: loadToKnM2(input.floorFinish, 1),
    liveLoadKnM2: loadToKnM2(input.liveLoad, 3),
    additionalLoadKnM2: loadToKnM2(input.additionalLoad, 0),
    clearCoverMm: coverBlank ? 20 : dimToMm(input.clearCover),
    coverMode: coverBlank ? 'Auto' : 'Manual',
    steelRate: isBlank(input.steelRate) ? 65 : toNumber(input.steelRate),
  }
}

function interpolateCoefficient(ratio) {
  const clamped = Math.max(1, Math.min(2, ratio))
  const keys = Object.keys(twoWayBaseCoefficients).map(Number).sort((a, b) => a - b)

  let low = keys[0]
  let high = keys[keys.length - 1]

  for (let i = 0; i < keys.length - 1; i += 1) {
    if (clamped >= keys[i] && clamped <= keys[i + 1]) {
      low = keys[i]
      high = keys[i + 1]
      break
    }
  }

  const lowValue = twoWayBaseCoefficients[low]
  const highValue = twoWayBaseCoefficients[high]
  const t = high === low ? 0 : (clamped - low) / (high - low)

  return {
    ax: lowValue.ax + (highValue.ax - lowValue.ax) * t,
    ay: lowValue.ay + (highValue.ay - lowValue.ay) * t,
  }
}

function getMomentCoefficients(ratio, edgeCondition) {
  const base = interpolateCoefficient(ratio)
  const condition = edgeConditions[edgeCondition] || edgeConditions.allDiscontinuous
  const factor = condition.factor

  return {
    ax: base.ax * factor,
    ay: base.ay * factor,
    baseAx: base.ax,
    baseAy: base.ay,
    factor,
  }
}

function getAutoThickness(lxM, edgeCondition) {
  const spanMm = lxM * 1000
  const isContinuous = edgeCondition === 'fourContinuous'
  const approximate = isContinuous ? spanMm / 32 : spanMm / 30
  return Math.max(100, roundUpTo(approximate, 5))
}

function solveAstSingly(MuKnM, bMm, dMm, fck, fy) {
  const Mu = MuKnM * 1000000
  const denominator = fck * bMm * dMm * dMm
  const ratio = (4.6 * Mu) / denominator

  if (ratio >= 1) {
    return -1
  }

  const root = Math.sqrt(1 - ratio)
  const ast = ((0.5 * fck * bMm * dMm) / fy) * (1 - root)
  return Math.max(0, ast)
}

function getTauC(concreteGrade, steelPercent) {
  const fck = concreteGrades[concreteGrade]
  const p = Math.max(0.15, Math.min(3, steelPercent || 0.15))
  const beta = Math.max(1, (0.8 * fck) / (6.89 * p))
  return (0.85 * Math.sqrt(0.8 * fck) * (Math.sqrt(1 + 5 * beta) - 1)) / (6 * beta)
}

function getDevelopmentLength({ fy, concreteGrade, dia }) {
  const plainBond = bondStressPlain[concreteGrade] || 1.4
  const deformedBond = plainBond * 1.6
  return (0.87 * fy * dia) / (4 * deformedBond)
}

function selectSlabBars({ astRequired, maxSpacing, minDia = 8 }) {
  const options = []

  for (const dia of barDiameters) {
    if (dia < minDia) continue

    for (const spacing of spacingOptions) {
      if (spacing > maxSpacing) continue

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
      dia: 10,
      spacing: 150,
      astProvided: (barArea(10) * 1000) / 150,
      excess: 0,
    }
  )
}

function getTorsionCorners(edgeCondition) {
  const condition = edgeConditions[edgeCondition] || edgeConditions.allDiscontinuous
  const e = condition.edges

  const corners = [
    { name: 'Top Left', edges: ['top', 'left'] },
    { name: 'Top Right', edges: ['top', 'right'] },
    { name: 'Bottom Left', edges: ['bottom', 'left'] },
    { name: 'Bottom Right', edges: ['bottom', 'right'] },
  ]

  let full = 0
  let half = 0
  let none = 0

  const cornerDetails = corners.map((corner) => {
    const continuousCount = corner.edges.filter((edge) => e[edge]).length

    if (continuousCount === 0) {
      full += 1
      return { ...corner, type: 'Full Torsion' }
    }

    if (continuousCount === 1) {
      half += 1
      return { ...corner, type: 'Half Torsion' }
    }

    none += 1
    return { ...corner, type: 'No Torsion' }
  })

  return {
    full,
    half,
    none,
    cornerDetails,
    torsionRequired: full > 0 || half > 0,
  }
}

function calculateSteelQuantity({
  lxM,
  lyM,
  coverMm,
  xDia,
  xSpacing,
  yDia,
  ySpacing,
  ldMm,
  torsion = null,
}) {
  const clearLx = Math.max(lxM - (2 * coverMm) / 1000, 0.1)
  const clearLy = Math.max(lyM - (2 * coverMm) / 1000, 0.1)

  const xBarCount = Math.ceil((lyM * 1000 - 2 * coverMm) / xSpacing) + 1
  const yBarCount = Math.ceil((lxM * 1000 - 2 * coverMm) / ySpacing) + 1

  const xBarLength = clearLx + (2 * ldMm) / 1000
  const yBarLength = clearLy + (2 * ldMm) / 1000

  const xWeight = xBarCount * xBarLength * steelWeightPerMeter(xDia)
  const yWeight = yBarCount * yBarLength * steelWeightPerMeter(yDia)

  let torsionWeight = 0

  if (torsion && torsion.required) {
    const intensity = torsion.fullCorners + 0.5 * torsion.halfCorners
    const barsPerLayer = Math.ceil((torsion.lengthM * 1000) / torsion.spacing) + 1
    torsionWeight =
      intensity *
      4 *
      barsPerLayer *
      torsion.lengthM *
      steelWeightPerMeter(torsion.dia)
  }

  return {
    xBarCount,
    yBarCount,
    xBarLength,
    yBarLength,
    xWeight,
    yWeight,
    torsionWeight,
    totalWeight: xWeight + yWeight + torsionWeight,
  }
}

function calculateTwoWaySlab(input) {
  const metric = convertInputsToMetric(input)

  if (metric.lxM <= 0 || metric.lyM <= 0) {
    throw new Error('Please enter valid slab spans.')
  }

  const shortSpanM = Math.min(metric.lxM, metric.lyM)
  const longSpanM = Math.max(metric.lxM, metric.lyM)
  const spanWasSwapped = metric.lxM > metric.lyM

  const ratio = longSpanM / shortSpanM
  const behaviourOk = ratio <= 2
  const slabBehaviour = behaviourOk ? 'Two Way Slab' : 'One Way Slab Behaviour'

  const fck = concreteGrades[input.concreteGrade]
  const fy = steelGrades[input.steelGrade]

  const thicknessMm =
    metric.thicknessMm > 0
      ? metric.thicknessMm
      : getAutoThickness(shortSpanM, input.edgeCondition)

  let assumedXDia = 10
  let assumedYDia = 8
  let finalResult = null

  for (let i = 0; i < 3; i += 1) {
    const effectiveDepthX = thicknessMm - metric.clearCoverMm - assumedXDia / 2
    const effectiveDepthY = effectiveDepthX - assumedXDia

    if (effectiveDepthX <= 40 || effectiveDepthY <= 35) {
      throw new Error('Effective depth is too low. Increase slab thickness.')
    }

    const selfWeight = (thicknessMm / 1000) * 25
    const totalServiceLoad =
      selfWeight +
      metric.floorFinishKnM2 +
      metric.liveLoadKnM2 +
      metric.additionalLoadKnM2

    const factoredLoad = 1.5 * totalServiceLoad

    const coefficients = getMomentCoefficients(ratio, input.edgeCondition)
    const momentX = coefficients.ax * factoredLoad * shortSpanM * shortSpanM
    const momentY = coefficients.ay * factoredLoad * shortSpanM * shortSpanM

    const astXFlexure = solveAstSingly(
      momentX,
      1000,
      effectiveDepthX,
      fck,
      fy
    )

    const astYFlexure = solveAstSingly(
      momentY,
      1000,
      effectiveDepthY,
      fck,
      fy
    )

    const minAst = 0.0012 * 1000 * thicknessMm

    const astX = Math.max(astXFlexure > 0 ? astXFlexure : minAst, minAst)
    const astY = Math.max(astYFlexure > 0 ? astYFlexure : minAst, minAst)

    const maxSpacingX = Math.min(3 * effectiveDepthX, 300)
    const maxSpacingY = Math.min(3 * effectiveDepthY, 300)

    const xBars = selectSlabBars({
      astRequired: astX,
      maxSpacing: maxSpacingX,
      minDia: 8,
    })

    const yBars = selectSlabBars({
      astRequired: astY,
      maxSpacing: maxSpacingY,
      minDia: 8,
    })

    assumedXDia = xBars.dia
    assumedYDia = yBars.dia

    const ptX = (xBars.astProvided / (1000 * effectiveDepthX)) * 100
    const tauC = getTauC(input.concreteGrade, ptX)

    const shearForce = (factoredLoad * shortSpanM) / 2
    const shearStress = (shearForce * 1000) / (1000 * effectiveDepthX)
    const shearSafe = shearStress <= tauC

    const allowLd = input.edgeCondition === 'fourContinuous' ? 26 : 20
    const actualLdRatio = (shortSpanM * 1000) / effectiveDepthX
    const deflectionSafe = actualLdRatio <= allowLd

    const ldMm = getDevelopmentLength({
      fy,
      concreteGrade: input.concreteGrade,
      dia: Math.max(xBars.dia, yBars.dia),
    })

    const availableLd = Math.max(0.25 * shortSpanM * 1000, 300)
    const ldSafe = availableLd >= ldMm

    const torsion = getTorsionCorners(input.edgeCondition)
    const maxAst = Math.max(astX, astY)

    const torsionFullAst = 0.75 * maxAst
    const torsionHalfAst = 0.5 * torsionFullAst
    const torsionLengthM = shortSpanM / 5

    const torsionBars = selectSlabBars({
      astRequired: torsionFullAst,
      maxSpacing: Math.min(3 * effectiveDepthX, 300),
      minDia: 8,
    })

    const steelQuantity = calculateSteelQuantity({
      lxM: shortSpanM,
      lyM: longSpanM,
      coverMm: metric.clearCoverMm,
      xDia: xBars.dia,
      xSpacing: xBars.spacing,
      yDia: yBars.dia,
      ySpacing: yBars.spacing,
      ldMm,
      torsion: {
        required: torsion.torsionRequired,
        fullCorners: torsion.full,
        halfCorners: torsion.half,
        dia: torsionBars.dia,
        spacing: torsionBars.spacing,
        lengthM: torsionLengthM,
      },
    })

    const steelCost =
      input.unitSystem === 'imperial'
        ? steelQuantity.totalWeight * 2.20462 * metric.steelRate
        : steelQuantity.totalWeight * metric.steelRate

    const status =
      behaviourOk && shearSafe && deflectionSafe && ldSafe
        ? 'Safe'
        : 'Check Required'

    finalResult = {
      input,
      metric,
      fck,
      fy,
      shortSpanM,
      longSpanM,
      spanWasSwapped,
      ratio,
      slabBehaviour,
      behaviourOk,
      edgeCondition: edgeConditions[input.edgeCondition],
      thicknessMm,
      thicknessMode: metric.thicknessMode,
      effectiveDepthX,
      effectiveDepthY,
      selfWeight,
      totalServiceLoad,
      factoredLoad,
      coefficients,
      momentX,
      momentY,
      astXFlexure,
      astYFlexure,
      minAst,
      astX,
      astY,
      xBars,
      yBars,
      maxSpacingX,
      maxSpacingY,
      shearForce,
      shearStress,
      tauC,
      shearSafe,
      actualLdRatio,
      allowLd,
      deflectionSafe,
      ldMm,
      availableLd,
      ldSafe,
      torsion,
      torsionFullAst,
      torsionHalfAst,
      torsionLengthM,
      torsionBars,
      steelQuantity,
      steelCost,
      status,
      coverMm: metric.clearCoverMm,
      coverMode: metric.coverMode,
    }
  }

  return finalResult
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

function TwoWaySlabPlanDiagram({ result }) {
  const edges = result.edgeCondition.edges

  function edgeText(isContinuous) {
    return isContinuous ? 'Continuous Edge' : 'Discontinuous Edge'
  }

  function cornerColor(type) {
    if (type === 'Full Torsion') return '#ef4444'
    if (type === 'Half Torsion') return '#facc15'
    return '#22c55e'
  }

  return (
    <div className="rounded-2xl bg-slate-950/60 border border-slate-800 p-5 overflow-hidden">
      <h3 className="text-lg font-bold text-white">Two Way Slab Plan Diagram</h3>
      <p className="text-xs text-slate-500 mb-4">टू-वे स्लैब प्लान डायग्राम</p>

      <svg viewBox="0 0 920 560" className="w-full h-auto">
        <rect x="0" y="0" width="920" height="560" rx="20" fill="#020617" />

        <text x="40" y="44" fill="#f97316" fontSize="21" fontWeight="700">
          Two Way Slab Plan
        </text>
        <text x="40" y="72" fill="#94a3b8" fontSize="14">
          Edge Condition: {result.edgeCondition.label}
        </text>

        <rect
          x="260"
          y="125"
          width="430"
          height="260"
          rx="12"
          fill="#0f172a"
          stroke="#f97316"
          strokeWidth="3"
        />

        <rect
          x="260"
          y="108"
          width="430"
          height="12"
          rx="3"
          fill={edges.top ? '#334155' : '#7f1d1d'}
        />
        <rect
          x="260"
          y="390"
          width="430"
          height="12"
          rx="3"
          fill={edges.bottom ? '#334155' : '#7f1d1d'}
        />
        <rect
          x="240"
          y="125"
          width="12"
          height="260"
          rx="3"
          fill={edges.left ? '#334155' : '#7f1d1d'}
        />
        <rect
          x="698"
          y="125"
          width="12"
          height="260"
          rx="3"
          fill={edges.right ? '#334155' : '#7f1d1d'}
        />

        <text x="405" y="100" fill="#cbd5e1" fontSize="13">
          {edgeText(edges.top)}
        </text>
        <text x="405" y="424" fill="#cbd5e1" fontSize="13">
          {edgeText(edges.bottom)}
        </text>
        <text x="115" y="255" fill="#cbd5e1" fontSize="13">
          {edgeText(edges.left)}
        </text>
        <text x="720" y="255" fill="#cbd5e1" fontSize="13">
          {edgeText(edges.right)}
        </text>

        {Array.from({ length: 11 }).map((_, index) => (
          <line
            key={`x-${index}`}
            x1={290 + index * 36}
            y1="140"
            x2={290 + index * 36}
            y2="370"
            stroke="#f97316"
            strokeWidth="2.4"
          />
        ))}

        {Array.from({ length: 8 }).map((_, index) => (
          <line
            key={`y-${index}`}
            x1="275"
            y1={155 + index * 29}
            x2="675"
            y2={155 + index * 29}
            stroke="#38bdf8"
            strokeWidth="2.2"
          />
        ))}

        {result.torsion.cornerDetails.map((corner) => {
          const pos = {
            'Top Left': { x: 260, y: 125 },
            'Top Right': { x: 690, y: 125 },
            'Bottom Left': { x: 260, y: 385 },
            'Bottom Right': { x: 690, y: 385 },
          }[corner.name]

          return (
            <g key={corner.name}>
              <circle
                cx={pos.x}
                cy={pos.y}
                r="16"
                fill={cornerColor(corner.type)}
                opacity="0.9"
              />
              <text
                x={pos.x - 8}
                y={pos.y + 5}
                fill="#020617"
                fontSize="12"
                fontWeight="700"
              >
                T
              </text>
            </g>
          )
        })}

        <line x1="260" y1="465" x2="690" y2="465" stroke="#94a3b8" strokeWidth="2" />
        <line x1="260" y1="457" x2="260" y2="473" stroke="#94a3b8" strokeWidth="2" />
        <line x1="690" y1="457" x2="690" y2="473" stroke="#94a3b8" strokeWidth="2" />
        <text x="395" y="493" fill="#e2e8f0" fontSize="15">
          Long Span Ly = {formatNumber(result.longSpanM, 2)} m
        </text>

        <line x1="755" y1="125" x2="755" y2="385" stroke="#94a3b8" strokeWidth="2" />
        <line x1="747" y1="125" x2="763" y2="125" stroke="#94a3b8" strokeWidth="2" />
        <line x1="747" y1="385" x2="763" y2="385" stroke="#94a3b8" strokeWidth="2" />
        <text x="770" y="250" fill="#e2e8f0" fontSize="15">
          Short Span Lx
        </text>
        <text x="770" y="270" fill="#e2e8f0" fontSize="15">
          = {formatNumber(result.shortSpanM, 2)} m
        </text>

        <rect x="40" y="120" width="170" height="220" rx="12" fill="#0b1220" stroke="#334155" />
        <text x="55" y="148" fill="#f97316" fontSize="16" fontWeight="700">
          Reinforcement
        </text>
        <text x="55" y="180" fill="#cbd5e1" fontSize="14">
          Short Span Steel:
        </text>
        <text x="55" y="202" fill="#cbd5e1" fontSize="14">
          {result.xBars.dia} mm Ø @ {result.xBars.spacing} mm c/c
        </text>
        <text x="55" y="238" fill="#38bdf8" fontSize="14">
          Long Span Steel:
        </text>
        <text x="55" y="260" fill="#cbd5e1" fontSize="14">
          {result.yBars.dia} mm Ø @ {result.yBars.spacing} mm c/c
        </text>
        <text x="55" y="296" fill="#e2e8f0" fontSize="14">
          Ly/Lx = {formatNumber(result.ratio, 2)}
        </text>
        <text x="55" y="318" fill="#e2e8f0" fontSize="14">
          Torsion: {result.torsion.torsionRequired ? 'Required' : 'Not Required'}
        </text>

        <rect x="40" y="365" width="170" height="110" rx="12" fill="#0b1220" stroke="#334155" />
        <text x="55" y="392" fill="#ef4444" fontSize="13">
          Red: Full torsion
        </text>
        <text x="55" y="418" fill="#facc15" fontSize="13">
          Yellow: Half torsion
        </text>
        <text x="55" y="444" fill="#22c55e" fontSize="13">
          Green: No torsion
        </text>
      </svg>
    </div>
  )
}

function TwoWaySlabSectionDiagram({ result }) {
  return (
    <div className="rounded-2xl bg-slate-950/60 border border-slate-800 p-5 overflow-hidden">
      <h3 className="text-lg font-bold text-white">Slab Section Diagram</h3>
      <p className="text-xs text-slate-500 mb-4">स्लैब सेक्शन डायग्राम</p>

      <svg viewBox="0 0 920 430" className="w-full h-auto">
        <rect x="0" y="0" width="920" height="430" rx="20" fill="#020617" />

        <text x="40" y="44" fill="#f97316" fontSize="21" fontWeight="700">
          Two Way Slab Section
        </text>
        <text x="40" y="72" fill="#94a3b8" fontSize="14">
          Bottom steel in both directions with different effective depths
        </text>

        <rect
          x="205"
          y="170"
          width="500"
          height="80"
          rx="8"
          fill="#0f172a"
          stroke="#f97316"
          strokeWidth="3"
        />

        {Array.from({ length: 12 }).map((_, index) => (
          <circle
            key={`x-${index}`}
            cx={235 + index * 38}
            cy="230"
            r="5"
            fill="#f97316"
          />
        ))}

        {Array.from({ length: 10 }).map((_, index) => (
          <circle
            key={`y-${index}`}
            cx={250 + index * 45}
            cy="210"
            r="4.5"
            fill="#38bdf8"
          />
        ))}

        {result.torsion.torsionRequired && (
          <>
            <line x1="230" y1="182" x2="330" y2="182" stroke="#ef4444" strokeWidth="3" />
            <line x1="580" y1="182" x2="680" y2="182" stroke="#ef4444" strokeWidth="3" />
            <text x="575" y="160" fill="#ef4444" fontSize="13">
              Top torsion steel near corners
            </text>
          </>
        )}

        {Array.from({ length: 9 }).map((_, index) => (
          <g key={`load-${index}`}>
            <line
              x1={240 + index * 50}
              y1="95"
              x2={240 + index * 50}
              y2="158"
              stroke="#e2e8f0"
              strokeWidth="2"
            />
            <polygon
              points={`${240 + index * 50},158 ${235 + index * 50},148 ${245 + index * 50},148`}
              fill="#e2e8f0"
            />
          </g>
        ))}
        <text x="720" y="112" fill="#e2e8f0" fontSize="13">
          Factored Load
        </text>

        <line x1="750" y1="170" x2="750" y2="250" stroke="#94a3b8" strokeWidth="2" />
        <line x1="742" y1="170" x2="758" y2="170" stroke="#94a3b8" strokeWidth="2" />
        <line x1="742" y1="250" x2="758" y2="250" stroke="#94a3b8" strokeWidth="2" />
        <text x="770" y="215" fill="#e2e8f0" fontSize="15">
          t = {formatPlain(result.thicknessMm)} mm
        </text>

        <line x1="800" y1="170" x2="800" y2="230" stroke="#22c55e" strokeWidth="2" />
        <line x1="792" y1="170" x2="808" y2="170" stroke="#22c55e" strokeWidth="2" />
        <line x1="792" y1="230" x2="808" y2="230" stroke="#22c55e" strokeWidth="2" />
        <text x="815" y="236" fill="#22c55e" fontSize="14">
          dx = {formatPlain(result.effectiveDepthX)} mm
        </text>

        <line x1="835" y1="170" x2="835" y2="210" stroke="#38bdf8" strokeWidth="2" />
        <line x1="827" y1="170" x2="843" y2="170" stroke="#38bdf8" strokeWidth="2" />
        <line x1="827" y1="210" x2="843" y2="210" stroke="#38bdf8" strokeWidth="2" />
        <text x="850" y="210" fill="#38bdf8" fontSize="14">
          dy = {formatPlain(result.effectiveDepthY)} mm
        </text>

        <rect x="40" y="285" width="330" height="105" rx="12" fill="#0b1220" stroke="#334155" />
        <text x="55" y="313" fill="#f97316" fontSize="15" fontWeight="700">
          Section Notes
        </text>
        <text x="55" y="338" fill="#cbd5e1" fontSize="14">
          Short Span Steel: {result.xBars.dia} mm Ø @ {result.xBars.spacing} mm c/c
        </text>
        <text x="55" y="362" fill="#cbd5e1" fontSize="14">
          Long Span Steel: {result.yBars.dia} mm Ø @ {result.yBars.spacing} mm c/c
        </text>
        <text x="55" y="386" fill="#cbd5e1" fontSize="14">
          Clear Cover: {formatPlain(result.coverMm)} mm ({result.coverMode})
        </text>
      </svg>
    </div>
  )
}

export default function TwoWaySlabDesignPage() {
  const [input, setInput] = useState(defaultInputs)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const isMetric = input.unitSystem === 'metric'
  const lengthUnit = isMetric ? 'm' : 'ft'
  const dimensionUnit = isMetric ? 'mm' : 'in'
  const loadUnit = isMetric ? 'kN/m²' : 'kip/ft²'
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
      const data = calculateTwoWaySlab(input)
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
    doc.text('Two Way Slab Design Report', 14, 20)

    doc.setTextColor(100, 116, 139)
    doc.setFontSize(9)
    doc.text(`Generated: ${new Date().toLocaleString('en-IN')}`, 145, 12)
    doc.text(`Unit System: ${input.unitSystem === 'metric' ? 'Metric' : 'Imperial'}`, 145, 18)

    doc.setTextColor(15, 23, 42)
    doc.setFontSize(14)
    doc.text('Input Summary', 14, 38)

    const inputRows = [
      ['Edge Condition', edgeConditions[input.edgeCondition].label],
      ['Short Span Lx', `${input.lx} ${lengthUnit}`],
      ['Long Span Ly', `${input.ly} ${lengthUnit}`],
      ['Slab Thickness', input.thickness === '' ? 'Auto' : `${input.thickness} ${dimensionUnit}`],
      ['Floor Finish Load', input.floorFinish === '' ? `Default 1 ${loadUnit}` : `${input.floorFinish} ${loadUnit}`],
      ['Live Load', input.liveLoad === '' ? `Default 3 ${loadUnit}` : `${input.liveLoad} ${loadUnit}`],
      ['Additional Load', input.additionalLoad === '' ? `Default 0 ${loadUnit}` : `${input.additionalLoad} ${loadUnit}`],
      ['Concrete Grade', input.concreteGrade],
      ['Steel Grade', input.steelGrade],
      ['Clear Cover', input.clearCover === '' ? 'Auto' : `${input.clearCover} ${dimensionUnit}`],
      ['Steel Rate', input.steelRate === '' ? `Default 65 ${steelRateUnit}` : `${input.steelRate} ${steelRateUnit}`],
    ]

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
      ['Slab Behaviour', result.slabBehaviour],
      ['Ly/Lx Ratio', formatNumber(result.ratio, 2)],
      ['Adopt Thickness', `${formatPlain(result.thicknessMm)} mm (${result.thicknessMode})`],
      ['Effective Depth X', `${formatPlain(result.effectiveDepthX)} mm`],
      ['Effective Depth Y', `${formatPlain(result.effectiveDepthY)} mm`],
      ['Coefficient ax', formatNumber(result.coefficients.ax, 4)],
      ['Coefficient ay', formatNumber(result.coefficients.ay, 4)],
      ['Short Span Steel', `${result.xBars.dia} mm dia @ ${result.xBars.spacing} mm c/c`],
      ['Long Span Steel', `${result.yBars.dia} mm dia @ ${result.yBars.spacing} mm c/c`],
      ['Shear Check', result.shearSafe ? 'Safe' : 'Check Required'],
      ['Deflection Check', result.deflectionSafe ? 'Safe' : 'Check Required'],
      ['Development Length', `${formatPlain(result.ldMm)} mm - ${result.ldSafe ? 'OK' : 'Check Required'}`],
      ['Torsion Steel', result.torsion.torsionRequired ? 'Required' : 'Not Required'],
      ['Total Steel Weight', `${formatNumber(result.steelQuantity.totalWeight, 2)} kg`],
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

    if (y > 220) {
      doc.addPage()
      y = 18
    }

    doc.setFontSize(14)
    doc.setTextColor(15, 23, 42)
    doc.text('Slab Reinforcement Diagram', 14, y)

    drawPdfTwoWaySlabDiagram(doc, result, y + 8)

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

    doc.save('CivilCalc-Pro-Two-Way-Slab-Design.pdf')
  }

  return (
    <main className="min-h-screen bg-[#050B1F] text-white px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <p className="text-orange-500 text-sm font-semibold tracking-wide uppercase">
            RCC Calculator
          </p>
          <h1 className="text-3xl md:text-5xl font-extrabold mt-2">
            Two Way Slab Design
          </h1>
          <p className="text-slate-400 mt-3 max-w-3xl">
            Two way slab design with edge condition, auto thickness, short span steel,
            long span steel, torsion corner reinforcement, checks and diagrams.
          </p>
          <p className="text-slate-500 text-sm mt-1">
            Two Way Slab design — edge condition, torsion steel, reinforcement और diagram के साथ.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 items-start">
          <section className="rounded-3xl bg-slate-900/70 border border-slate-800 p-6">
            <h2 className="text-2xl font-bold mb-1">Inputs</h2>
            <p className="text-sm text-slate-500 mb-6">
              जिन values का पता न हो उन्हें blank छोड़ दें, tool auto calculate करेगा.
            </p>

            <div className="grid md:grid-cols-2 gap-5">
              <Field label="Unit System" hindi="यूनिट सिस्टम">
                <SelectBox
                  value={input.unitSystem}
                  onChange={(e) => updateInput('unitSystem', e.target.value)}
                >
                  <option value="metric">Metric - m, mm, kN/m²</option>
                  <option value="imperial">Imperial - ft, in, kip/ft²</option>
                </SelectBox>
              </Field>

              <Field label="Edge Condition" hindi="एज कंडीशन">
                <SelectBox
                  value={input.edgeCondition}
                  onChange={(e) => updateInput('edgeCondition', e.target.value)}
                >
                  {Object.entries(edgeConditions).map(([key, item]) => (
                    <option key={key} value={key}>
                      {item.label}
                    </option>
                  ))}
                </SelectBox>
              </Field>

              <Field label={`Short Span Lx (${lengthUnit})`} hindi="छोटा स्पैन">
                <InputBox
                  type="number"
                  value={input.lx}
                  onChange={(e) => updateInput('lx', e.target.value)}
                />
              </Field>

              <Field label={`Long Span Ly (${lengthUnit})`} hindi="लंबा स्पैन">
                <InputBox
                  type="number"
                  value={input.ly}
                  onChange={(e) => updateInput('ly', e.target.value)}
                />
              </Field>

              <Field label={`Slab Thickness Optional (${dimensionUnit})`} hindi="खाली छोड़ें तो auto">
                <InputBox
                  type="number"
                  placeholder="Auto"
                  value={input.thickness}
                  onChange={(e) => updateInput('thickness', e.target.value)}
                />
              </Field>

              <Field label={`Floor Finish Load Optional (${loadUnit})`} hindi="खाली छोड़ें तो default 1">
                <InputBox
                  type="number"
                  placeholder="Default 1"
                  value={input.floorFinish}
                  onChange={(e) => updateInput('floorFinish', e.target.value)}
                />
              </Field>

              <Field label={`Live Load Optional (${loadUnit})`} hindi="खाली छोड़ें तो default 3">
                <InputBox
                  type="number"
                  placeholder="Default 3"
                  value={input.liveLoad}
                  onChange={(e) => updateInput('liveLoad', e.target.value)}
                />
              </Field>

              <Field label={`Additional Load Optional (${loadUnit})`} hindi="खाली छोड़ें तो 0">
                <InputBox
                  type="number"
                  placeholder="Default 0"
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

              <Field label={`Clear Cover Optional (${dimensionUnit})`} hindi="खाली छोड़ें तो auto">
                <InputBox
                  type="number"
                  placeholder="Auto"
                  value={input.clearCover}
                  onChange={(e) => updateInput('clearCover', e.target.value)}
                />
              </Field>

              <Field label={`Steel Rate Optional (${steelRateUnit})`} hindi="खाली छोड़ें तो default 65">
                <InputBox
                  type="number"
                  placeholder="Default 65"
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
                  <span className="text-3xl">🏢</span>
                </div>
                <h2 className="text-2xl font-bold">Output will appear here</h2>
                <p className="text-slate-400 mt-2 max-w-md">
                  Fill slab inputs and click Run Design to generate two way slab
                  reinforcement, torsion steel, checks and diagrams.
                </p>
                <p className="text-slate-500 text-sm mt-2">
                  Run Design click करने के बाद ही output आएगा.
                </p>
              </div>
            ) : (
              <>
                <ResultCard title="Design Status" hindi="डिज़ाइन स्टेटस" highlight>
                  <Row label="Status" value={result.status} strong />
                  <Row label="Slab Behaviour" value={result.slabBehaviour} />
                  <Row label="Edge Condition" value={result.edgeCondition.label} />
                  <Row label="Ly/Lx Ratio" value={formatNumber(result.ratio, 2)} />
                  <Row
                    label="Two Way Check"
                    value={result.behaviourOk ? 'OK' : 'Use One Way Slab Design'}
                    strong
                  />
                  {result.spanWasSwapped && (
                    <Row
                      label="Span Note"
                      value="Input spans were swapped internally so Lx is the shorter span."
                    />
                  )}
                </ResultCard>

                <ResultCard title="Final Recommendation" hindi="अंतिम सुझाव" highlight>
                  <Row
                    label="Adopt Thickness"
                    value={`${formatPlain(result.thicknessMm)} mm (${result.thicknessMode})`}
                    strong
                  />
                  <Row
                    label="Short Span Steel"
                    value={`${result.xBars.dia} mm dia @ ${result.xBars.spacing} mm c/c`}
                    strong
                  />
                  <Row
                    label="Long Span Steel"
                    value={`${result.yBars.dia} mm dia @ ${result.yBars.spacing} mm c/c`}
                    strong
                  />
                  <Row
                    label="Torsion Steel"
                    value={result.torsion.torsionRequired ? 'Required at discontinuous corners' : 'Not required'}
                  />
                  <Row
                    label="Clear Cover"
                    value={`${formatPlain(result.coverMm)} mm (${result.coverMode})`}
                  />
                </ResultCard>

                <ResultCard title="Geometry" hindi="ज्योमेट्री">
                  <Row label="Short Span Lx" value={`${formatNumber(result.shortSpanM, 2)} m`} />
                  <Row label="Long Span Ly" value={`${formatNumber(result.longSpanM, 2)} m`} />
                  <Row label="Ly/Lx Ratio" value={formatNumber(result.ratio, 2)} />
                  <Row label="Slab Thickness" value={`${formatPlain(result.thicknessMm)} mm`} />
                  <Row label="Effective Depth X" value={`${formatPlain(result.effectiveDepthX)} mm`} />
                  <Row label="Effective Depth Y" value={`${formatPlain(result.effectiveDepthY)} mm`} />
                </ResultCard>

                <ResultCard title="Loading" hindi="लोडिंग">
                  <Row label="Self Weight" value={`${formatNumber(result.selfWeight, 2)} kN/m²`} />
                  <Row label="Total Service Load" value={`${formatNumber(result.totalServiceLoad, 2)} kN/m²`} />
                  <Row label="Factored Load" value={`${formatNumber(result.factoredLoad, 2)} kN/m²`} strong />
                </ResultCard>

                <ResultCard title="Moment Coefficients" hindi="मोमेंट कोएफिशिएंट">
                  <Row label="Base αx" value={formatNumber(result.coefficients.baseAx, 4)} />
                  <Row label="Base αy" value={formatNumber(result.coefficients.baseAy, 4)} />
                  <Row label="Edge Factor" value={formatNumber(result.coefficients.factor, 2)} />
                  <Row label="Used αx" value={formatNumber(result.coefficients.ax, 4)} strong />
                  <Row label="Used αy" value={formatNumber(result.coefficients.ay, 4)} strong />
                </ResultCard>

                <ResultCard title="Bending" hindi="बेंडिंग">
                  <Row label="Moment Mx Short Span" value={`${formatNumber(result.momentX, 2)} kNm/m`} strong />
                  <Row label="Moment My Long Span" value={`${formatNumber(result.momentY, 2)} kNm/m`} strong />
                  <Row label="Required Ast X" value={`${formatNumber(result.astX, 2)} mm²/m`} />
                  <Row label="Required Ast Y" value={`${formatNumber(result.astY, 2)} mm²/m`} />
                  <Row label="Minimum Ast" value={`${formatNumber(result.minAst, 2)} mm²/m`} />
                </ResultCard>

                <ResultCard title="Reinforcement" hindi="रिइनफोर्समेंट">
                  <Row
                    label="Short Span Steel"
                    value={`${result.xBars.dia} mm Ø @ ${result.xBars.spacing} mm c/c`}
                    strong
                  />
                  <Row
                    label="Provided Ast X"
                    value={`${formatNumber(result.xBars.astProvided, 2)} mm²/m`}
                  />
                  <Row
                    label="Long Span Steel"
                    value={`${result.yBars.dia} mm Ø @ ${result.yBars.spacing} mm c/c`}
                    strong
                  />
                  <Row
                    label="Provided Ast Y"
                    value={`${formatNumber(result.yBars.astProvided, 2)} mm²/m`}
                  />
                </ResultCard>

                <ResultCard title="Shear Check" hindi="शियर चेक">
                  <Row label="Shear Force Vu" value={`${formatNumber(result.shearForce, 2)} kN/m`} />
                  <Row label="Nominal Shear Stress" value={`${formatNumber(result.shearStress, 3)} N/mm²`} strong />
                  <Row label="Permissible Shear Stress" value={`${formatNumber(result.tauC, 3)} N/mm²`} />
                  <Row label="Status" value={result.shearSafe ? 'Safe' : 'Check Required'} strong />
                </ResultCard>

                <ResultCard title="Deflection Check" hindi="डिफ्लेक्शन चेक">
                  <Row label="Actual L/d" value={formatNumber(result.actualLdRatio, 2)} />
                  <Row label="Allowable L/d" value={formatNumber(result.allowLd, 2)} />
                  <Row label="Status" value={result.deflectionSafe ? 'Safe' : 'Check Required'} strong />
                  <Row
                    label="Recommendation"
                    value={
                      result.deflectionSafe
                        ? 'Slab thickness is adequate.'
                        : 'Increase slab thickness.'
                    }
                  />
                </ResultCard>

                <ResultCard title="Development Length" hindi="डेवलपमेंट लेंथ">
                  <Row label="Required Ld" value={`${formatPlain(result.ldMm)} mm`} />
                  <Row label="Available Length Assumed" value={`${formatPlain(result.availableLd)} mm`} />
                  <Row label="Status" value={result.ldSafe ? 'OK' : 'Check Required'} strong />
                </ResultCard>

                <ResultCard title="Torsion Corner Steel" hindi="कॉर्नर टॉर्शन स्टील">
                  <Row label="Torsion Required" value={result.torsion.torsionRequired ? 'Yes' : 'No'} strong />
                  <Row label="Full Torsion Corners" value={result.torsion.full} />
                  <Row label="Half Torsion Corners" value={result.torsion.half} />
                  <Row label="Torsion Length" value={`${formatNumber(result.torsionLengthM, 2)} m from corner`} />
                  <Row
                    label="Torsion Steel"
                    value={
                      result.torsion.torsionRequired
                        ? `${result.torsionBars.dia} mm Ø @ ${result.torsionBars.spacing} mm c/c`
                        : 'Not required'
                    }
                  />
                  <Row label="Note" value={result.edgeCondition.note} />
                </ResultCard>

                <ResultCard title="Steel Quantity" hindi="स्टील क्वांटिटी">
                  <Row label="Short Span Bar Count" value={`${result.steelQuantity.xBarCount} nos`} />
                  <Row label="Long Span Bar Count" value={`${result.steelQuantity.yBarCount} nos`} />
                  <Row label="Short Span Steel Weight" value={`${formatNumber(result.steelQuantity.xWeight, 2)} kg`} />
                  <Row label="Long Span Steel Weight" value={`${formatNumber(result.steelQuantity.yWeight, 2)} kg`} />
                  <Row label="Torsion Steel Weight" value={`${formatNumber(result.steelQuantity.torsionWeight, 2)} kg`} />
                  <Row label="Total Steel Weight" value={`${formatNumber(result.steelQuantity.totalWeight, 2)} kg`} strong />
                  <Row label="Approx Steel Cost" value={`₹${formatNumber(result.steelCost, 0)}`} strong />
                </ResultCard>

                <TwoWaySlabPlanDiagram result={result} />
                <TwoWaySlabSectionDiagram result={result} />

                <div className="rounded-2xl border border-yellow-500/40 bg-yellow-500/10 p-5 text-sm text-yellow-100">
                  <p className="font-bold mb-2">Disclaimer / अस्वीकरण</p>
                  <p>
                    This slab design is for preliminary design, educational and site estimation purposes.
                    Before construction, verify it with a qualified site engineer or structural engineer
                    as per actual support condition, load combination and applicable IS codes.
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

function drawPdfTwoWaySlabDiagram(doc, result, startY) {
  const y = startY

  doc.setDrawColor(249, 115, 22)
  doc.roundedRect(14, y, 182, 95, 3, 3, 'S')

  doc.setFontSize(10)
  doc.setTextColor(15, 23, 42)
  doc.text('Plan Detail', 18, y + 7)

  doc.rect(30, y + 18, 75, 45)

  doc.setDrawColor(249, 115, 22)
  for (let i = 0; i < 8; i += 1) {
    doc.line(38 + i * 8, y + 20, 38 + i * 8, y + 61)
  }

  doc.setDrawColor(56, 189, 248)
  for (let i = 0; i < 5; i += 1) {
    doc.line(32, y + 25 + i * 8, 103, y + 25 + i * 8)
  }

  if (result.torsion.torsionRequired) {
    doc.setFillColor(239, 68, 68)
    doc.circle(30, y + 18, 2, 'F')
    doc.circle(105, y + 18, 2, 'F')
    doc.circle(30, y + 63, 2, 'F')
    doc.circle(105, y + 63, 2, 'F')
  }

  doc.setTextColor(15, 23, 42)
  doc.setFontSize(7)
  doc.text(`Lx = ${formatNumber(result.shortSpanM, 2)} m`, 18, y + 72)
  doc.text(`Ly = ${formatNumber(result.longSpanM, 2)} m`, 18, y + 78)
  doc.text(`Ly/Lx = ${formatNumber(result.ratio, 2)}`, 18, y + 84)
  doc.text(`X: ${result.xBars.dia} mm @ ${result.xBars.spacing} mm c/c`, 18, y + 90)

  doc.setFontSize(10)
  doc.text('Section Detail', 118, y + 7)

  doc.rect(125, y + 36, 58, 12)

  doc.setFillColor(249, 115, 22)
  for (let i = 0; i < 7; i += 1) {
    doc.circle(130 + i * 8, y + 45, 1.1, 'F')
  }

  doc.setFillColor(56, 189, 248)
  for (let i = 0; i < 5; i += 1) {
    doc.circle(134 + i * 10, y + 41, 1.0, 'F')
  }

  if (result.torsion.torsionRequired) {
    doc.setDrawColor(239, 68, 68)
    doc.line(128, y + 38, 145, y + 38)
    doc.line(163, y + 38, 180, y + 38)
  }

  doc.setTextColor(15, 23, 42)
  doc.setFontSize(7)
  doc.text(`Thickness = ${formatPlain(result.thicknessMm)} mm`, 118, y + 66)
  doc.text(`dx = ${formatPlain(result.effectiveDepthX)} mm`, 118, y + 72)
  doc.text(`dy = ${formatPlain(result.effectiveDepthY)} mm`, 118, y + 78)
  doc.text(`Y: ${result.yBars.dia} mm @ ${result.yBars.spacing} mm c/c`, 118, y + 84)
  doc.text(
    `Torsion: ${result.torsion.torsionRequired ? 'Required' : 'Not Required'}`,
    118,
    y + 90
  )
}
