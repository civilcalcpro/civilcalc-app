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

const supportTypes = {
  simply: 'Simply Supported Slab',
  continuous: 'Continuous Slab',
  cantilever: 'Cantilever Slab',
}

const supportHindi = {
  simply: 'सिम्पली सपोर्टेड स्लैब',
  continuous: 'कंटीन्यूअस स्लैब',
  cantilever: 'कैंटिलीवर स्लैब',
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
  supportType: 'simply',
  lx: 3,
  ly: 7,
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
  const loadToKnM2 = (value) => (isMetric ? toNumber(value) : toNumber(value) * 47.8803)

  const coverBlank = isBlank(input.clearCover)
  const thicknessBlank = isBlank(input.thickness)

  return {
    lxM: lengthToM(input.lx),
    lyM: lengthToM(input.ly),
    thicknessMm: thicknessBlank ? 0 : dimToMm(input.thickness),
    thicknessMode: thicknessBlank ? 'Auto' : 'Manual',
    floorFinishKnM2: loadToKnM2(input.floorFinish),
    liveLoadKnM2: loadToKnM2(input.liveLoad),
    additionalLoadKnM2: loadToKnM2(input.additionalLoad),
    clearCoverMm: coverBlank ? 20 : dimToMm(input.clearCover),
    coverMode: coverBlank ? 'Auto' : 'Manual',
    steelRate: toNumber(input.steelRate),
  }
}

function getAutoThickness({ lxM, supportType }) {
  const spanMm = lxM * 1000

  let basicThickness = 125

  if (supportType === 'cantilever') {
    basicThickness = spanMm / 7
  } else if (supportType === 'continuous') {
    basicThickness = spanMm / 30
  } else {
    basicThickness = spanMm / 25
  }

  const rounded = roundUpTo(basicThickness, 5)

  if (supportType === 'cantilever') return Math.max(125, rounded)
  return Math.max(100, rounded)
}

function getMomentAndShear({ supportType, factoredLoad, lxM }) {
  if (supportType === 'cantilever') {
    return {
      momentKnM: (factoredLoad * lxM * lxM) / 2,
      shearKn: factoredLoad * lxM,
      mainSteelLocation: 'Top',
      momentType: 'Cantilever negative moment',
    }
  }

  if (supportType === 'continuous') {
    return {
      momentKnM: (factoredLoad * lxM * lxM) / 10,
      shearKn: (factoredLoad * lxM) / 2,
      mainSteelLocation: 'Bottom + Top over supports',
      momentType: 'Continuous slab coefficient moment',
    }
  }

  return {
    momentKnM: (factoredLoad * lxM * lxM) / 8,
    shearKn: (factoredLoad * lxM) / 2,
    mainSteelLocation: 'Bottom',
    momentType: 'Simply supported mid-span moment',
  }
}

function getTauC(concreteGrade, steelPercent) {
  const fck = concreteGrades[concreteGrade]

  let base = 0.28
  if (fck >= 25) base = 0.32
  if (fck >= 30) base = 0.36
  if (fck >= 35) base = 0.40
  if (fck >= 40) base = 0.44

  const ptFactor = Math.min(1.35, Math.max(1, steelPercent / 0.25))
  return base * ptFactor
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

function calculateSteelQuantity({
  lxM,
  lyM,
  coverMm,
  mainDia,
  mainSpacing,
  distDia,
  distSpacing,
  ldMm,
}) {
  const clearLx = Math.max(lxM - (2 * coverMm) / 1000, 0.1)
  const clearLy = Math.max(lyM - (2 * coverMm) / 1000, 0.1)

  const mainBarCount = Math.ceil((lyM * 1000 - 2 * coverMm) / mainSpacing) + 1
  const distributionBarCount = Math.ceil((lxM * 1000 - 2 * coverMm) / distSpacing) + 1

  const mainBarLength = clearLx + (2 * ldMm) / 1000
  const distributionBarLength = clearLy + (2 * ldMm) / 1000

  const mainSteelWeight =
    mainBarCount * mainBarLength * steelWeightPerMeter(mainDia)

  const distributionSteelWeight =
    distributionBarCount * distributionBarLength * steelWeightPerMeter(distDia)

  return {
    mainBarCount,
    distributionBarCount,
    mainBarLength,
    distributionBarLength,
    mainSteelWeight,
    distributionSteelWeight,
    totalSteelWeight: mainSteelWeight + distributionSteelWeight,
  }
}

function calculateOneWaySlab(input) {
  const metric = convertInputsToMetric(input)

  if (metric.lxM <= 0 || metric.lyM <= 0) {
    throw new Error('Please enter valid short span and long span.')
  }

  const fck = concreteGrades[input.concreteGrade]
  const fy = steelGrades[input.steelGrade]

  const lyLxRatio = metric.lyM / metric.lxM
  const slabBehaviour = lyLxRatio >= 2 ? 'One Way Slab' : 'Two Way Slab Behaviour'

  const thicknessMm =
    metric.thicknessMm > 0
      ? metric.thicknessMm
      : getAutoThickness({
          lxM: metric.lxM,
          supportType: input.supportType,
        })

  let assumedMainDia = 10
  let finalResult = null

  for (let i = 0; i < 3; i += 1) {
    const effectiveDepthMm =
      thicknessMm - metric.clearCoverMm - assumedMainDia / 2

    if (effectiveDepthMm <= 40) {
      throw new Error('Effective depth is too low. Increase slab thickness.')
    }

    const selfWeight = (thicknessMm / 1000) * 25

    const totalServiceLoad =
      selfWeight +
      metric.floorFinishKnM2 +
      metric.liveLoadKnM2 +
      metric.additionalLoadKnM2

    const factoredLoad = 1.5 * totalServiceLoad

    const action = getMomentAndShear({
      supportType: input.supportType,
      factoredLoad,
      lxM: metric.lxM,
    })

    const zMm = 0.9 * effectiveDepthMm
    const astFlexure =
      (action.momentKnM * 1000000) / (0.87 * fy * zMm)

    const minAst = 0.0012 * 1000 * thicknessMm
    const astRequired = Math.max(astFlexure, minAst)

    const maxMainSpacing = Math.min(3 * effectiveDepthMm, 300)
    const maxDistSpacing = Math.min(5 * effectiveDepthMm, 450)

    const mainBars = selectSlabBars({
      astRequired,
      maxSpacing: maxMainSpacing,
      minDia: 8,
    })

    const distributionAstRequired = minAst
    const distributionBars = selectSlabBars({
      astRequired: distributionAstRequired,
      maxSpacing: maxDistSpacing,
      minDia: 8,
    })

    assumedMainDia = mainBars.dia

    const steelPercent =
      (mainBars.astProvided / (1000 * effectiveDepthMm)) * 100

    const tauC = getTauC(input.concreteGrade, steelPercent)
    const shearStress =
      (action.shearKn * 1000) / (1000 * effectiveDepthMm)

    const shearSafe = shearStress <= tauC

    let allowableLd = 20
    if (input.supportType === 'continuous') allowableLd = 26
    if (input.supportType === 'cantilever') allowableLd = 7

    const actualLdRatio = (metric.lxM * 1000) / effectiveDepthMm
    const deflectionSafe = actualLdRatio <= allowableLd

    const ldMm = getDevelopmentLength({
      fy,
      concreteGrade: input.concreteGrade,
      dia: mainBars.dia,
    })

    const availableLd = Math.max(0.25 * metric.lxM * 1000, 300)
    const ldSafe = availableLd >= ldMm

    const steelQuantity = calculateSteelQuantity({
      lxM: metric.lxM,
      lyM: metric.lyM,
      coverMm: metric.clearCoverMm,
      mainDia: mainBars.dia,
      mainSpacing: mainBars.spacing,
      distDia: distributionBars.dia,
      distSpacing: distributionBars.spacing,
      ldMm,
    })

    const steelCost =
      input.unitSystem === 'imperial'
        ? steelQuantity.totalSteelWeight * 2.20462 * metric.steelRate
        : steelQuantity.totalSteelWeight * metric.steelRate

    const behaviourOk = lyLxRatio >= 2
    const status =
      behaviourOk && shearSafe && deflectionSafe && ldSafe
        ? 'Safe'
        : 'Check Required'

    finalResult = {
      input,
      metric,
      fck,
      fy,
      lyLxRatio,
      slabBehaviour,
      behaviourOk,
      supportLabel: supportTypes[input.supportType],
      thicknessMm,
      thicknessMode: metric.thicknessMode,
      effectiveDepthMm,
      selfWeight,
      totalServiceLoad,
      factoredLoad,
      momentKnM: action.momentKnM,
      shearKn: action.shearKn,
      momentType: action.momentType,
      mainSteelLocation: action.mainSteelLocation,
      astFlexure,
      minAst,
      astRequired,
      mainBars,
      distributionAstRequired,
      distributionBars,
      maxMainSpacing,
      maxDistSpacing,
      steelPercent,
      shearStress,
      tauC,
      shearSafe,
      actualLdRatio,
      allowableLd,
      deflectionSafe,
      ldMm,
      availableLd,
      ldSafe,
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

function SlabPlanDiagram({ result }) {
  const isCantilever = result.input.supportType === 'cantilever'
  const isContinuous = result.input.supportType === 'continuous'

  return (
    <div className="rounded-2xl bg-slate-950/60 border border-slate-800 p-5 overflow-hidden">
      <h3 className="text-lg font-bold text-white">Slab Plan Diagram</h3>
      <p className="text-xs text-slate-500 mb-4">स्लैब प्लान डायग्राम</p>

      <svg viewBox="0 0 860 520" className="w-full h-auto">
        <rect x="0" y="0" width="860" height="520" rx="20" fill="#020617" />

        <text x="40" y="42" fill="#f97316" fontSize="20" fontWeight="700">
          One Way Slab Plan
        </text>
        <text x="40" y="68" fill="#94a3b8" fontSize="14">
          Support Type: {result.supportLabel}
        </text>

        {/* Slab panel */}
        <rect
          x="220"
          y="110"
          width="470"
          height="230"
          rx="12"
          fill="#0f172a"
          stroke="#f97316"
          strokeWidth="3"
        />

        {/* Support representation */}
        {!isCantilever && (
          <>
            <rect x="220" y="88" width="470" height="16" rx="4" fill="#334155" />
            <rect x="220" y="346" width="470" height="16" rx="4" fill="#334155" />
            <text x="705" y="100" fill="#cbd5e1" fontSize="13">
              Support
            </text>
            <text x="705" y="358" fill="#cbd5e1" fontSize="13">
              Support
            </text>
          </>
        )}

        {isCantilever && (
          <>
            <rect x="196" y="110" width="18" height="230" fill="#475569" />
            {Array.from({ length: 11 }).map((_, i) => (
              <line
                key={i}
                x1="196"
                y1={110 + i * 21}
                x2="165"
                y2={125 + i * 21}
                stroke="#64748b"
                strokeWidth="2"
              />
            ))}
            <text x="110" y="95" fill="#cbd5e1" fontSize="13">
              Fixed Support
            </text>
          </>
        )}

        {/* Main bars - along short span */}
        {Array.from({ length: 12 }).map((_, index) => (
          <line
            key={`main-${index}`}
            x1={248 + index * 36}
            y1="122"
            x2={248 + index * 36}
            y2="328"
            stroke="#f97316"
            strokeWidth="2.4"
          />
        ))}

        {/* Distribution bars - along long span */}
        {Array.from({ length: 7 }).map((_, index) => (
          <line
            key={`dist-${index}`}
            x1="232"
            y1={132 + index * 30}
            x2="678"
            y2={132 + index * 30}
            stroke="#38bdf8"
            strokeWidth="2"
          />
        ))}

        {/* Main steel direction arrow */}
        <line x1="735" y1="155" x2="735" y2="295" stroke="#f97316" strokeWidth="3" />
        <polygon points="735,145 728,158 742,158" fill="#f97316" />
        <polygon points="735,305 728,292 742,292" fill="#f97316" />
        <text x="748" y="225" fill="#f97316" fontSize="14" fontWeight="700">
          Main Steel
        </text>
        <text x="748" y="243" fill="#f97316" fontSize="13">
          along Short Span
        </text>

        {/* Distribution direction arrow */}
        <line x1="315" y1="390" x2="575" y2="390" stroke="#38bdf8" strokeWidth="3" />
        <polygon points="305,390 318,383 318,397" fill="#38bdf8" />
        <polygon points="585,390 572,383 572,397" fill="#38bdf8" />
        <text x="365" y="418" fill="#38bdf8" fontSize="14" fontWeight="700">
          Distribution Steel along Long Span
        </text>

        {/* Long span dimension */}
        <line x1="220" y1="445" x2="690" y2="445" stroke="#94a3b8" strokeWidth="2" />
        <line x1="220" y1="437" x2="220" y2="453" stroke="#94a3b8" strokeWidth="2" />
        <line x1="690" y1="437" x2="690" y2="453" stroke="#94a3b8" strokeWidth="2" />
        <text x="380" y="470" fill="#e2e8f0" fontSize="15">
          Long Span Ly = {formatNumber(result.metric.lyM, 2)} m
        </text>

        {/* Short span dimension */}
        <line x1="740" y1="110" x2="740" y2="340" stroke="#94a3b8" strokeWidth="2" />
        <line x1="732" y1="110" x2="748" y2="110" stroke="#94a3b8" strokeWidth="2" />
        <line x1="732" y1="340" x2="748" y2="340" stroke="#94a3b8" strokeWidth="2" />
        <text x="755" y="228" fill="#e2e8f0" fontSize="15">
          Short Span Lx
        </text>
        <text x="755" y="247" fill="#e2e8f0" fontSize="15">
          = {formatNumber(result.metric.lxM, 2)} m
        </text>

        {/* Reinforcement notes */}
        <rect x="40" y="110" width="150" height="185" rx="12" fill="#0b1220" stroke="#334155" strokeWidth="1.5" />
        <text x="55" y="136" fill="#f97316" fontSize="16" fontWeight="700">
          Reinforcement
        </text>
        <text x="55" y="168" fill="#cbd5e1" fontSize="14">
          Main Steel:
        </text>
        <text x="55" y="190" fill="#cbd5e1" fontSize="14">
          {result.mainBars.dia} mm Ø
        </text>
        <text x="55" y="210" fill="#cbd5e1" fontSize="14">
          @ {result.mainBars.spacing} mm c/c
        </text>

        <text x="55" y="245" fill="#38bdf8" fontSize="14">
          Distribution:
        </text>
        <text x="55" y="267" fill="#cbd5e1" fontSize="14">
          {result.distributionBars.dia} mm Ø
        </text>
        <text x="55" y="287" fill="#cbd5e1" fontSize="14">
          @ {result.distributionBars.spacing} mm c/c
        </text>

        <text x="55" y="322" fill="#e2e8f0" fontSize="14">
          Ly/Lx = {formatNumber(result.lyLxRatio, 2)}
        </text>

        {isContinuous && (
          <text x="300" y="92" fill="#f8fafc" fontSize="12">
            Continuous support line
          </text>
        )}
      </svg>
    </div>
  )
}

function SlabSectionDiagram({ result }) {
  const supportType = result.input.supportType
  const isCantilever = supportType === 'cantilever'
  const isContinuous = supportType === 'continuous'
  const mainAtTop = isCantilever

  return (
    <div className="rounded-2xl bg-slate-950/60 border border-slate-800 p-5 overflow-hidden">
      <h3 className="text-lg font-bold text-white">Slab Section Diagram</h3>
      <p className="text-xs text-slate-500 mb-4">स्लैब सेक्शन डायग्राम</p>

      <svg viewBox="0 0 860 420" className="w-full h-auto">
        <rect x="0" y="0" width="860" height="420" rx="20" fill="#020617" />

        <text x="40" y="42" fill="#f97316" fontSize="20" fontWeight="700">
          Slab Section
        </text>
        <text x="40" y="68" fill="#94a3b8" fontSize="14">
          Support Type: {result.supportLabel}
        </text>

        {/* Supports */}
        {!isCantilever ? (
          <>
            <rect x="170" y="265" width="90" height="70" rx="6" fill="#334155" />
            <rect x="600" y="265" width="90" height="70" rx="6" fill="#334155" />
          </>
        ) : (
          <>
            <rect x="130" y="120" width="45" height="200" fill="#475569" />
            {Array.from({ length: 10 }).map((_, i) => (
              <line
                key={i}
                x1="130"
                y1={125 + i * 18}
                x2="95"
                y2={140 + i * 18}
                stroke="#64748b"
                strokeWidth="2"
              />
            ))}
          </>
        )}

        {/* Slab body */}
        <rect
          x={isCantilever ? 170 : 210}
          y="180"
          width={isCantilever ? 470 : 380}
          height="65"
          rx="6"
          fill="#0f172a"
          stroke="#f97316"
          strokeWidth="3"
        />

        {/* Main bars */}
        {Array.from({ length: 11 }).map((_, index) => (
          <circle
            key={`main-${index}`}
            cx={(isCantilever ? 195 : 235) + index * 34}
            cy={mainAtTop ? 196 : 228}
            r="5"
            fill="#f97316"
          />
        ))}

        {/* Distribution bars layer */}
        {Array.from({ length: 8 }).map((_, index) => (
          <circle
            key={`dist-${index}`}
            cx={(isCantilever ? 210 : 250) + index * 42}
            cy={mainAtTop ? 228 : 196}
            r="4"
            fill="#38bdf8"
          />
        ))}

        {/* Top extra steel over supports for continuous */}
        {isContinuous && (
          <>
            {Array.from({ length: 4 }).map((_, index) => (
              <line
                key={`top-left-${index}`}
                x1={220 + index * 12}
                y1="188"
                x2={280 + index * 12}
                y2="188"
                stroke="#fb7185"
                strokeWidth="3"
              />
            ))}
            {Array.from({ length: 4 }).map((_, index) => (
              <line
                key={`top-right-${index}`}
                x1={520 + index * 12}
                y1="188"
                x2={580 + index * 12}
                y2="188"
                stroke="#fb7185"
                strokeWidth="3"
              />
            ))}
            <text x="610" y="170" fill="#fb7185" fontSize="13">
              Top steel over supports
            </text>
          </>
        )}

        {/* Load arrows */}
        {Array.from({ length: 8 }).map((_, index) => (
          <g key={`load-${index}`}>
            <line
              x1={(isCantilever ? 205 : 245) + index * 42}
              y1="115"
              x2={(isCantilever ? 205 : 245) + index * 42}
              y2="170"
              stroke="#e2e8f0"
              strokeWidth="2"
            />
            <polygon
              points={`${(isCantilever ? 205 : 245) + index * 42},170 ${(isCantilever ? 200 : 240) + index * 42},160 ${(isCantilever ? 210 : 250) + index * 42},160`}
              fill="#e2e8f0"
            />
          </g>
        ))}
        <text x="650" y="118" fill="#e2e8f0" fontSize="13">
          Uniform Load
        </text>

        {/* Thickness dimension */}
        <line x1="715" y1="180" x2="715" y2="245" stroke="#94a3b8" strokeWidth="2" />
        <line x1="707" y1="180" x2="723" y2="180" stroke="#94a3b8" strokeWidth="2" />
        <line x1="707" y1="245" x2="723" y2="245" stroke="#94a3b8" strokeWidth="2" />
        <text x="730" y="208" fill="#e2e8f0" fontSize="15">
          t = {formatPlain(result.thicknessMm)} mm
        </text>

        {/* Effective depth dimension */}
        <line x1="750" y1={mainAtTop ? 196 : 180} x2="750" y2={mainAtTop ? 245 : 228} stroke="#22c55e" strokeWidth="2" />
        <line x1="742" y1={mainAtTop ? 196 : 180} x2="758" y2={mainAtTop ? 196 : 180} stroke="#22c55e" strokeWidth="2" />
        <line x1="742" y1={mainAtTop ? 245 : 228} x2="758" y2={mainAtTop ? 245 : 228} stroke="#22c55e" strokeWidth="2" />
        <text x="765" y="255" fill="#22c55e" fontSize="14">
          d = {formatPlain(result.effectiveDepthMm)} mm
        </text>

        {/* Cover note */}
        <text x="40" y="110" fill="#cbd5e1" fontSize="15">
          Clear Cover = {formatPlain(result.coverMm)} mm ({result.coverMode})
        </text>

        {/* Notes box */}
        <rect x="40" y="265" width="260" height="110" rx="12" fill="#0b1220" stroke="#334155" strokeWidth="1.5" />
        <text x="55" y="292" fill="#f97316" fontSize="15" fontWeight="700">
          Section Notes
        </text>
        <text x="55" y="317" fill="#cbd5e1" fontSize="14">
          Main Steel:
        </text>
        <text x="150" y="317" fill="#cbd5e1" fontSize="14">
          {result.mainBars.dia} mm Ø @ {result.mainBars.spacing} mm c/c
        </text>
        <text x="55" y="340" fill="#cbd5e1" fontSize="14">
          Distribution:
        </text>
        <text x="150" y="340" fill="#cbd5e1" fontSize="14">
          {result.distributionBars.dia} mm Ø @ {result.distributionBars.spacing} mm c/c
        </text>
        <text x="55" y="363" fill="#cbd5e1" fontSize="14">
          Main Steel Location:
        </text>
        <text x="190" y="363" fill="#cbd5e1" fontSize="14">
          {result.mainSteelLocation}
        </text>
      </svg>
    </div>
  )
}

export default function OneWaySlabDesignPage() {
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
      const data = calculateOneWaySlab(input)
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
    doc.text('One Way Slab Design Report', 14, 20)

    doc.setTextColor(100, 116, 139)
    doc.setFontSize(9)
    doc.text(`Generated: ${new Date().toLocaleString('en-IN')}`, 145, 12)
    doc.text(`Unit System: ${input.unitSystem === 'metric' ? 'Metric' : 'Imperial'}`, 145, 18)

    doc.setTextColor(15, 23, 42)
    doc.setFontSize(14)
    doc.text('Input Summary', 14, 38)

    const inputRows = [
      ['Support Type', supportTypes[input.supportType]],
      ['Short Span Lx', `${input.lx} ${lengthUnit}`],
      ['Long Span Ly', `${input.ly} ${lengthUnit}`],
      ['Slab Thickness', input.thickness === '' ? 'Auto' : `${input.thickness} ${dimensionUnit}`],
      ['Floor Finish Load', `${input.floorFinish} ${loadUnit}`],
      ['Live Load', `${input.liveLoad} ${loadUnit}`],
      ['Additional Load', `${input.additionalLoad} ${loadUnit}`],
      ['Concrete Grade', input.concreteGrade],
      ['Steel Grade', input.steelGrade],
      ['Clear Cover', input.clearCover === '' ? 'Auto' : `${input.clearCover} ${dimensionUnit}`],
      ['Steel Rate', `${input.steelRate} ${steelRateUnit}`],
    ]

    autoTable(doc, {
      startY: 43,
      head: [['Input', 'Value']],
      body: inputRows,
      theme: 'grid',
      headStyles: { fillColor: [249, 115, 22] },
      styles: { fontSize: 9 },
    })

    let y = doc.lastAutoTable.finalY + 10
    doc.setFontSize(14)
    doc.setTextColor(15, 23, 42)
    doc.text('Output Summary', 14, y)

    const outputRows = [
      ['Design Status', result.status],
      ['Slab Behaviour', result.slabBehaviour],
      ['Ly/Lx Ratio', formatNumber(result.lyLxRatio, 2)],
      ['Adopt Thickness', `${formatPlain(result.thicknessMm)} mm (${result.thicknessMode})`],
      ['Effective Depth', `${formatPlain(result.effectiveDepthMm)} mm`],
      ['Main Steel', `${result.mainBars.dia} mm dia @ ${result.mainBars.spacing} mm c/c`],
      ['Distribution Steel', `${result.distributionBars.dia} mm dia @ ${result.distributionBars.spacing} mm c/c`],
      ['Main Steel Location', result.mainSteelLocation],
      ['Maximum Moment', `${formatNumber(result.momentKnM, 2)} kNm/m`],
      ['Shear Stress', `${formatNumber(result.shearStress, 3)} N/mm²`],
      ['Shear Check', result.shearSafe ? 'Safe' : 'Check Required'],
      ['Deflection Check', result.deflectionSafe ? 'Safe' : 'Check Required'],
      ['Development Length', `${formatPlain(result.ldMm)} mm - ${result.ldSafe ? 'OK' : 'Check Required'}`],
      ['Total Steel Weight', `${formatNumber(result.steelQuantity.totalSteelWeight, 2)} kg`],
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

    drawPdfSlabDiagram(doc, result, y + 8)

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

    doc.save('CivilCalc-Pro-One-Way-Slab-Design.pdf')
  }

  return (
    <main className="min-h-screen bg-[#050B1F] text-white px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <p className="text-orange-500 text-sm font-semibold tracking-wide uppercase">
            RCC Calculator
          </p>
          <h1 className="text-3xl md:text-5xl font-extrabold mt-2">
            One Way Slab Design
          </h1>
          <p className="text-slate-400 mt-3 max-w-3xl">
            One way slab design with auto thickness, main reinforcement,
            distribution steel, shear check, deflection check and labelled diagrams.
          </p>
          <p className="text-slate-500 text-sm mt-1">
            One Way Slab design — auto thickness, reinforcement, shear check और diagram के साथ.
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
                  <option value="metric">Metric - m, mm, kN/m²</option>
                  <option value="imperial">Imperial - ft, in, kip/ft²</option>
                </SelectBox>
              </Field>

              <Field label="Support Type" hindi="सपोर्ट टाइप">
                <SelectBox
                  value={input.supportType}
                  onChange={(e) => updateInput('supportType', e.target.value)}
                >
                  <option value="simply">Simply Supported Slab</option>
                  <option value="continuous">Continuous Slab</option>
                  <option value="cantilever">Cantilever Slab</option>
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

              <Field label={`Floor Finish Load (${loadUnit})`} hindi="फ्लोर फिनिश लोड">
                <InputBox
                  type="number"
                  value={input.floorFinish}
                  onChange={(e) => updateInput('floorFinish', e.target.value)}
                />
              </Field>

              <Field label={`Live Load (${loadUnit})`} hindi="लाइव लोड">
                <InputBox
                  type="number"
                  value={input.liveLoad}
                  onChange={(e) => updateInput('liveLoad', e.target.value)}
                />
              </Field>

              <Field label={`Additional Load (${loadUnit})`} hindi="अतिरिक्त लोड">
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
                  <span className="text-3xl">🏢</span>
                </div>
                <h2 className="text-2xl font-bold">Output will appear here</h2>
                <p className="text-slate-400 mt-2 max-w-md">
                  Fill slab inputs and click Run Design to generate slab thickness,
                  reinforcement, checks and diagrams.
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
                  <Row label="Support Type" value={result.supportLabel} />
                  <Row label="Ly/Lx Ratio" value={formatNumber(result.lyLxRatio, 2)} />
                  <Row
                    label="One Way Check"
                    value={result.behaviourOk ? 'OK' : 'Use Two Way Slab Design'}
                    strong
                  />
                </ResultCard>

                <ResultCard title="Final Recommendation" hindi="अंतिम सुझाव" highlight>
                  <Row
                    label="Adopt Thickness"
                    value={`${formatPlain(result.thicknessMm)} mm (${result.thicknessMode})`}
                    strong
                  />
                  <Row
                    label="Main Steel"
                    value={`${result.mainBars.dia} mm dia @ ${result.mainBars.spacing} mm c/c`}
                    strong
                  />
                  <Row
                    label="Distribution Steel"
                    value={`${result.distributionBars.dia} mm dia @ ${result.distributionBars.spacing} mm c/c`}
                    strong
                  />
                  <Row label="Main Steel Location" value={result.mainSteelLocation} />
                  <Row label="Clear Cover" value={`${formatPlain(result.coverMm)} mm (${result.coverMode})`} />
                </ResultCard>

                <ResultCard title="Geometry" hindi="ज्योमेट्री">
                  <Row label="Short Span Lx" value={`${formatNumber(result.metric.lxM, 2)} m`} />
                  <Row label="Long Span Ly" value={`${formatNumber(result.metric.lyM, 2)} m`} />
                  <Row label="Ly/Lx Ratio" value={formatNumber(result.lyLxRatio, 2)} />
                  <Row label="Slab Thickness" value={`${formatPlain(result.thicknessMm)} mm`} />
                  <Row label="Effective Depth" value={`${formatPlain(result.effectiveDepthMm)} mm`} />
                </ResultCard>

                <ResultCard title="Loading" hindi="लोडिंग">
                  <Row label="Self Weight" value={`${formatNumber(result.selfWeight, 2)} kN/m²`} />
                  <Row label="Total Service Load" value={`${formatNumber(result.totalServiceLoad, 2)} kN/m²`} />
                  <Row label="Factored Load" value={`${formatNumber(result.factoredLoad, 2)} kN/m²`} strong />
                </ResultCard>

                <ResultCard title="Bending" hindi="बेंडिंग">
                  <Row label="Moment Type" value={result.momentType} />
                  <Row label="Maximum Moment" value={`${formatNumber(result.momentKnM, 2)} kNm/m`} strong />
                  <Row label="Ast for Flexure" value={`${formatNumber(result.astFlexure, 2)} mm²/m`} />
                  <Row label="Minimum Ast" value={`${formatNumber(result.minAst, 2)} mm²/m`} />
                  <Row label="Required Ast" value={`${formatNumber(result.astRequired, 2)} mm²/m`} strong />
                </ResultCard>

                <ResultCard title="Reinforcement" hindi="रिइनफोर्समेंट">
                  <Row
                    label="Main Steel"
                    value={`${result.mainBars.dia} mm Ø @ ${result.mainBars.spacing} mm c/c`}
                    strong
                  />
                  <Row
                    label="Provided Main Ast"
                    value={`${formatNumber(result.mainBars.astProvided, 2)} mm²/m`}
                  />
                  <Row
                    label="Distribution Steel"
                    value={`${result.distributionBars.dia} mm Ø @ ${result.distributionBars.spacing} mm c/c`}
                    strong
                  />
                  <Row
                    label="Provided Distribution Ast"
                    value={`${formatNumber(result.distributionBars.astProvided, 2)} mm²/m`}
                  />
                </ResultCard>

                <ResultCard title="Shear Check" hindi="शियर चेक">
                  <Row label="Shear Force Vu" value={`${formatNumber(result.shearKn, 2)} kN/m`} />
                  <Row label="Nominal Shear Stress" value={`${formatNumber(result.shearStress, 3)} N/mm²`} strong />
                  <Row label="Permissible Shear Stress" value={`${formatNumber(result.tauC, 3)} N/mm²`} />
                  <Row label="Status" value={result.shearSafe ? 'Safe' : 'Check Required'} strong />
                </ResultCard>

                <ResultCard title="Deflection Check" hindi="डिफ्लेक्शन चेक">
                  <Row label="Actual L/d" value={formatNumber(result.actualLdRatio, 2)} />
                  <Row label="Allowable L/d" value={formatNumber(result.allowableLd, 2)} />
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

                <ResultCard title="Steel Quantity" hindi="स्टील क्वांटिटी">
                  <Row label="Main Bar Count" value={`${result.steelQuantity.mainBarCount} nos`} />
                  <Row label="Distribution Bar Count" value={`${result.steelQuantity.distributionBarCount} nos`} />
                  <Row label="Main Steel Weight" value={`${formatNumber(result.steelQuantity.mainSteelWeight, 2)} kg`} />
                  <Row label="Distribution Steel Weight" value={`${formatNumber(result.steelQuantity.distributionSteelWeight, 2)} kg`} />
                  <Row label="Total Steel Weight" value={`${formatNumber(result.steelQuantity.totalSteelWeight, 2)} kg`} strong />
                  <Row label="Approx Steel Cost" value={`₹${formatNumber(result.steelCost, 0)}`} strong />
                </ResultCard>

                <SlabPlanDiagram result={result} />
                <SlabSectionDiagram result={result} />

                <div className="rounded-2xl border border-yellow-500/40 bg-yellow-500/10 p-5 text-sm text-yellow-100">
                  <p className="font-bold mb-2">Disclaimer / अस्वीकरण</p>
                  <p>
                    This slab design is for preliminary design, educational and site estimation purposes.
                    Before construction, verify it with a qualified site engineer or structural engineer.
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

function drawPdfSlabDiagram(doc, result, startY) {
  const y = startY
  const supportType = result.input.supportType
  const isCantilever = supportType === 'cantilever'
  const isContinuous = supportType === 'continuous'

  doc.setDrawColor(249, 115, 22)
  doc.roundedRect(14, y, 182, 95, 3, 3, 'S')

  doc.setFontSize(10)
  doc.setTextColor(15, 23, 42)
  doc.text('Plan Detail', 18, y + 7)

  // Plan rectangle
  doc.rect(28, y + 18, 78, 38)

  // Supports in plan
  if (!isCantilever) {
    doc.setFillColor(100, 116, 139)
    doc.rect(28, y + 15, 78, 3, 'F')
    doc.rect(28, y + 56, 78, 3, 'F')
  } else {
    doc.setFillColor(100, 116, 139)
    doc.rect(24, y + 18, 4, 38, 'F')
  }

  // Main steel lines
  for (let i = 0; i < 8; i += 1) {
    doc.setDrawColor(249, 115, 22)
    doc.line(36 + i * 8, y + 20, 36 + i * 8, y + 54)
  }

  // Distribution steel lines
  for (let i = 0; i < 5; i += 1) {
    doc.setDrawColor(56, 189, 248)
    doc.line(30, y + 24 + i * 7, 104, y + 24 + i * 7)
  }

  doc.setTextColor(15, 23, 42)
  doc.setFontSize(7)
  doc.text(`Lx = ${formatNumber(result.metric.lxM, 2)} m`, 18, y + 66)
  doc.text(`Ly = ${formatNumber(result.metric.lyM, 2)} m`, 18, y + 72)
  doc.text(`Ly/Lx = ${formatNumber(result.lyLxRatio, 2)}`, 18, y + 78)

  doc.text(`Main: ${result.mainBars.dia} mm @ ${result.mainBars.spacing} mm c/c`, 18, y + 85)
  doc.text(`Dist: ${result.distributionBars.dia} mm @ ${result.distributionBars.spacing} mm c/c`, 18, y + 91)

  // Section title
  doc.setFontSize(10)
  doc.text('Section Detail', 118, y + 7)

  // Supports in section
  doc.setFillColor(71, 85, 105)
  if (!isCantilever) {
    doc.rect(124, y + 42, 14, 16, 'F')
    doc.rect(173, y + 42, 14, 16, 'F')
    doc.rect(132, y + 32, 47, 10)
  } else {
    doc.rect(118, y + 24, 6, 35, 'F')
    doc.rect(124, y + 32, 55, 10)
  }

  // Main steel
  doc.setFillColor(249, 115, 22)
  for (let i = 0; i < 7; i += 1) {
    const cx = 136 + i * 6
    const cy = isCantilever ? y + 35 : y + 40
    doc.circle(cx, cy, 1.2, 'F')
  }

  // Distribution steel
  doc.setFillColor(56, 189, 248)
  for (let i = 0; i < 5; i += 1) {
    const cx = 140 + i * 8
    const cy = isCantilever ? y + 40 : y + 35
    doc.circle(cx, cy, 1.0, 'F')
  }

  // Continuous top support steel
  if (isContinuous) {
    doc.setDrawColor(251, 113, 133)
    doc.line(134, y + 33, 144, y + 33)
    doc.line(166, y + 33, 176, y + 33)
  }

  doc.setTextColor(15, 23, 42)
  doc.setFontSize(7)
  doc.text(`Thickness = ${formatPlain(result.thicknessMm)} mm`, 118, y + 66)
  doc.text(`Effective depth = ${formatPlain(result.effectiveDepthMm)} mm`, 118, y + 72)
  doc.text(`Cover = ${formatPlain(result.coverMm)} mm`, 118, y + 78)
  doc.text(`Main steel location: ${result.mainSteelLocation}`, 118, y + 85)
  doc.text(`Support: ${result.supportLabel}`, 118, y + 91)
}
