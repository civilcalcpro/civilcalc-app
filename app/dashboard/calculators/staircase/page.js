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

const staircaseTypes = {
  straight: {
    label: 'Straight Flight Staircase',
    hindi: 'स्ट्रेट फ्लाइट स्टेयरकेस',
    flights: 1,
    designNote: 'Detailed design for straight flight staircase.',
  },
  doglegged: {
    label: 'Dog-Legged Staircase',
    hindi: 'डॉग-लेग्ड स्टेयरकेस',
    flights: 2,
    designNote: 'Detailed design for two-flight dog-legged staircase with mid landing.',
  },
  quarterTurn: {
    label: 'Quarter Turn Staircase',
    hindi: 'क्वार्टर टर्न स्टेयरकेस',
    flights: 2,
    designNote: 'Preliminary RCC design with landing and turn zone.',
  },
  openWell: {
    label: 'Open Well Staircase',
    hindi: 'ओपन वेल स्टेयरकेस',
    flights: 2,
    designNote: 'Preliminary RCC design for open well layout.',
  },
  cantilever: {
    label: 'Cantilever Staircase',
    hindi: 'कैंटिलीवर स्टेयरकेस',
    flights: 1,
    designNote: 'Preliminary cantilever stair design. Structural verification is mandatory.',
  },
}

const bondStressPlain = {
  M20: 1.2,
  M25: 1.4,
  M30: 1.5,
  M35: 1.7,
  M40: 1.9,
}

const barDiameters = [8, 10, 12, 16, 20]
const spacingOptions = [100, 125, 150, 175, 200, 225, 250, 300]

const defaultInputs = {
  unitSystem: 'metric',
  staircaseType: 'straight',

  floorHeight: 3.0,
  stairWidth: 1.0,
  availableLength: 4.8,

  riser: '',
  tread: '',
  numberOfRisers: '',
  landingLength: '',

  waistThickness: '',
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

  const coverBlank = isBlank(input.clearCover)
  const riserBlank = isBlank(input.riser)
  const treadBlank = isBlank(input.tread)
  const riserCountBlank = isBlank(input.numberOfRisers)
  const landingBlank = isBlank(input.landingLength)
  const waistBlank = isBlank(input.waistThickness)

  return {
    floorHeightM: lengthToM(input.floorHeight),
    stairWidthM: lengthToM(input.stairWidth),
    availableLengthM: lengthToM(input.availableLength),

    riserMm: riserBlank ? 0 : dimToMm(input.riser),
    riserMode: riserBlank ? 'Auto' : 'Manual',

    treadMm: treadBlank ? 0 : dimToMm(input.tread),
    treadMode: treadBlank ? 'Auto' : 'Manual',

    numberOfRisers: riserCountBlank ? 0 : Math.round(toNumber(input.numberOfRisers)),
    riserCountMode: riserCountBlank ? 'Auto' : 'Manual',

    landingLengthM: landingBlank ? 0 : lengthToM(input.landingLength),
    landingMode: landingBlank ? 'Auto' : 'Manual',

    waistThicknessMm: waistBlank ? 0 : dimToMm(input.waistThickness),
    waistMode: waistBlank ? 'Auto' : 'Manual',

    floorFinishKnM2: loadToKnM2(input.floorFinish, 1),
    liveLoadKnM2: loadToKnM2(input.liveLoad, 3),
    additionalLoadKnM2: loadToKnM2(input.additionalLoad, 0),

    clearCoverMm: coverBlank ? 25 : dimToMm(input.clearCover),
    coverMode: coverBlank ? 'Auto' : 'Manual',

    steelRate: isBlank(input.steelRate) ? 65 : toNumber(input.steelRate),
    steelRateMode: isBlank(input.steelRate) ? 'Default' : 'Manual',
  }
}

function getDevelopmentLength({ fy, concreteGrade, dia }) {
  const plainBond = bondStressPlain[concreteGrade] || 1.4
  const deformedBond = plainBond * 1.6
  return (0.87 * fy * dia) / (4 * deformedBond)
}

function solveAstSingly(MuKnM, bMm, dMm, fck, fy) {
  const Mu = MuKnM * 1000000
  const denominator = fck * bMm * dMm * dMm
  const ratio = (4.6 * Mu) / denominator

  if (ratio >= 1) return -1

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

function getAutoGeometry(metric, staircaseType) {
  const floorHeightMm = metric.floorHeightM * 1000
  const stairType = staircaseTypes[staircaseType]
  const flights = stairType.flights

  let totalRisers

  if (metric.numberOfRisers > 0) {
    totalRisers = metric.numberOfRisers
  } else if (metric.riserMm > 0) {
    totalRisers = Math.max(1, Math.round(floorHeightMm / metric.riserMm))
  } else {
    totalRisers = Math.max(1, Math.round(floorHeightMm / 165))
  }

  const riserMm = floorHeightMm / totalRisers

  const risersPerFlight =
    flights === 1 ? totalRisers : Math.ceil(totalRisers / flights)

  const treadsPerFlight =
    staircaseType === 'cantilever'
      ? totalRisers
      : Math.max(1, risersPerFlight - 1)

  const totalTreads =
    staircaseType === 'straight' || staircaseType === 'cantilever'
      ? treadsPerFlight
      : treadsPerFlight * flights

  let treadMm = metric.treadMm

  if (treadMm <= 0) {
    if (metric.availableLengthM > 0) {
      const availablePerFlight =
        flights === 1
          ? metric.availableLengthM
          : Math.max(metric.availableLengthM / 2, 1)

      treadMm = (availablePerFlight * 1000) / treadsPerFlight
      treadMm = Math.max(250, Math.min(300, treadMm))
    } else {
      treadMm = 275
    }
  }

  const goingPerFlightM = (treadsPerFlight * treadMm) / 1000
  const risePerFlightM = (risersPerFlight * riserMm) / 1000
  const slopingLengthM = Math.sqrt(
    goingPerFlightM * goingPerFlightM + risePerFlightM * risePerFlightM
  )

  const angleDeg = (Math.atan(riserMm / treadMm) * 180) / Math.PI
  const comfortValue = 2 * riserMm + treadMm

  let landingLengthM = metric.landingLengthM

  if (landingLengthM <= 0) {
    if (staircaseType === 'straight' || staircaseType === 'cantilever') {
      landingLengthM = 0
    } else {
      landingLengthM = Math.max(metric.stairWidthM, 1.0)
    }
  }

  return {
    flights,
    totalRisers,
    risersPerFlight,
    treadsPerFlight,
    totalTreads,
    riserMm,
    treadMm,
    goingPerFlightM,
    risePerFlightM,
    slopingLengthM,
    angleDeg,
    comfortValue,
    landingLengthM,
  }
}

function getComfortStatus(geometry) {
  const riserOk = geometry.riserMm >= 140 && geometry.riserMm <= 180
  const treadOk = geometry.treadMm >= 240 && geometry.treadMm <= 320
  const comfortOk = geometry.comfortValue >= 550 && geometry.comfortValue <= 700
  const angleOk = geometry.angleDeg >= 25 && geometry.angleDeg <= 40

  const status = riserOk && treadOk && comfortOk && angleOk ? 'Comfortable' : 'Check Required'

  const notes = []

  if (!riserOk) notes.push('Riser should preferably be between 140 mm and 180 mm.')
  if (!treadOk) notes.push('Tread should preferably be between 240 mm and 320 mm.')
  if (!comfortOk) notes.push('Comfort value 2R + T should be around 550 mm to 700 mm.')
  if (!angleOk) notes.push('Stair angle should preferably be between 25° and 40°.')

  if (notes.length === 0) notes.push('Riser, tread and stair angle are comfortable.')

  return {
    riserOk,
    treadOk,
    comfortOk,
    angleOk,
    status,
    notes,
  }
}

function getAutoWaistThickness({ spanM, staircaseType }) {
  const spanMm = spanM * 1000

  if (staircaseType === 'cantilever') {
    return Math.max(175, roundUpTo(spanMm / 7, 5))
  }

  return Math.max(150, roundUpTo(spanMm / 22, 5))
}

function getMomentAndShear({ staircaseType, factoredLoad, spanM }) {
  if (staircaseType === 'cantilever') {
    return {
      momentKnM: (factoredLoad * spanM * spanM) / 2,
      shearKn: factoredLoad * spanM,
      momentType: 'Cantilever staircase moment',
      mainSteelLocation: 'Top steel near fixed support',
    }
  }

  return {
    momentKnM: (factoredLoad * spanM * spanM) / 8,
    shearKn: (factoredLoad * spanM) / 2,
    momentType: 'Simply supported waist slab moment',
    mainSteelLocation: 'Bottom steel along slope',
  }
}

function calculateSteelQuantity({
  geometry,
  stairWidthM,
  coverMm,
  mainBars,
  distributionBars,
  landingBars,
  ldMm,
  staircaseType,
}) {
  const clearWidthM = Math.max(stairWidthM - (2 * coverMm) / 1000, 0.1)
  const clearSlopeM = Math.max(geometry.slopingLengthM - (2 * coverMm) / 1000, 0.1)

  const mainBarCount = Math.ceil((stairWidthM * 1000 - 2 * coverMm) / mainBars.spacing) + 1
  const mainBarLength = clearSlopeM + (2 * ldMm) / 1000
  const mainSteelWeight =
    mainBarCount *
    mainBarLength *
    steelWeightPerMeter(mainBars.dia) *
    geometry.flights

  const distributionBarCount =
    Math.ceil((geometry.slopingLengthM * 1000 - 2 * coverMm) / distributionBars.spacing) + 1

  const distributionBarLength = clearWidthM
  const distributionSteelWeight =
    distributionBarCount *
    distributionBarLength *
    steelWeightPerMeter(distributionBars.dia) *
    geometry.flights

  let landingSteelWeight = 0
  let landingBarCount = 0

  if (geometry.landingLengthM > 0 && staircaseType !== 'cantilever') {
    landingBarCount =
      Math.ceil((geometry.landingLengthM * 1000 - 2 * coverMm) / landingBars.spacing) + 1

    landingSteelWeight =
      landingBarCount *
      clearWidthM *
      steelWeightPerMeter(landingBars.dia)
  }

  return {
    mainBarCount,
    mainBarLength,
    mainSteelWeight,
    distributionBarCount,
    distributionBarLength,
    distributionSteelWeight,
    landingBarCount,
    landingSteelWeight,
    totalSteelWeight: mainSteelWeight + distributionSteelWeight + landingSteelWeight,
  }
}

function calculateConcreteQuantity({
  geometry,
  stairWidthM,
  waistThicknessMm,
  staircaseType,
}) {
  const waistVolume =
    geometry.slopingLengthM *
    stairWidthM *
    (waistThicknessMm / 1000) *
    geometry.flights

  const stepsVolume =
    0.5 *
    (geometry.riserMm / 1000) *
    (geometry.treadMm / 1000) *
    stairWidthM *
    geometry.totalTreads

  const landingCount =
    geometry.landingLengthM > 0 && staircaseType !== 'cantilever' ? 1 : 0

  const landingVolume =
    landingCount *
    geometry.landingLengthM *
    stairWidthM *
    (waistThicknessMm / 1000)

  return {
    waistVolume,
    stepsVolume,
    landingVolume,
    totalConcreteVolume: waistVolume + stepsVolume + landingVolume,
  }
}

function calculateStaircase(input) {
  const metric = convertInputsToMetric(input)

  if (metric.floorHeightM <= 0 || metric.stairWidthM <= 0) {
    throw new Error('Please enter valid floor height and stair width.')
  }

  const fck = concreteGrades[input.concreteGrade]
  const fy = steelGrades[input.steelGrade]

  const geometry = getAutoGeometry(metric, input.staircaseType)
  const comfort = getComfortStatus(geometry)

  const waistThicknessMm =
    metric.waistThicknessMm > 0
      ? metric.waistThicknessMm
      : getAutoWaistThickness({
          spanM: geometry.slopingLengthM,
          staircaseType: input.staircaseType,
        })

  let assumedMainDia = 10
  let finalResult = null

  for (let i = 0; i < 3; i += 1) {
    const effectiveDepthMm = waistThicknessMm - metric.clearCoverMm - assumedMainDia / 2

    if (effectiveDepthMm <= 60) {
      throw new Error('Effective depth is too low. Increase waist slab thickness.')
    }

    const waistSelfWeight =
      25 * (waistThicknessMm / 1000) * Math.sqrt(1 + (geometry.riserMm / geometry.treadMm) ** 2)

    const stepSelfWeight = 25 * (geometry.riserMm / 1000) / 2

    const totalServiceLoad =
      waistSelfWeight +
      stepSelfWeight +
      metric.floorFinishKnM2 +
      metric.liveLoadKnM2 +
      metric.additionalLoadKnM2

    const factoredLoad = 1.5 * totalServiceLoad

    const action = getMomentAndShear({
      staircaseType: input.staircaseType,
      factoredLoad,
      spanM: geometry.slopingLengthM,
    })

    const astFlexure = solveAstSingly(
      action.momentKnM,
      1000,
      effectiveDepthMm,
      fck,
      fy
    )

    const minAst = 0.0012 * 1000 * waistThicknessMm
    const astRequired = Math.max(astFlexure > 0 ? astFlexure : minAst, minAst)

    const maxMainSpacing = Math.min(3 * effectiveDepthMm, 300)
    const maxDistributionSpacing = Math.min(5 * effectiveDepthMm, 450)

    const mainBars = selectSlabBars({
      astRequired,
      maxSpacing: maxMainSpacing,
      minDia: 8,
    })

    const distributionAst = minAst
    const distributionBars = selectSlabBars({
      astRequired: distributionAst,
      maxSpacing: maxDistributionSpacing,
      minDia: 8,
    })

    const landingBars = selectSlabBars({
      astRequired: astRequired,
      maxSpacing: maxMainSpacing,
      minDia: 8,
    })

    assumedMainDia = mainBars.dia

    const steelPercent = (mainBars.astProvided / (1000 * effectiveDepthMm)) * 100
    const tauC = getTauC(input.concreteGrade, steelPercent)

    const shearStress = (action.shearKn * 1000) / (1000 * effectiveDepthMm)
    const shearSafe = shearStress <= tauC

    const allowableLdRatio = input.staircaseType === 'cantilever' ? 7 : 20
    const actualLdRatio = (geometry.slopingLengthM * 1000) / effectiveDepthMm
    const deflectionSafe = actualLdRatio <= allowableLdRatio

    const ldMm = getDevelopmentLength({
      fy,
      concreteGrade: input.concreteGrade,
      dia: mainBars.dia,
    })

    const availableLd = Math.max(0.25 * geometry.slopingLengthM * 1000, 300)
    const ldSafe = availableLd >= ldMm

    const steelQuantity = calculateSteelQuantity({
      geometry,
      stairWidthM: metric.stairWidthM,
      coverMm: metric.clearCoverMm,
      mainBars,
      distributionBars,
      landingBars,
      ldMm,
      staircaseType: input.staircaseType,
    })

    const concreteQuantity = calculateConcreteQuantity({
      geometry,
      stairWidthM: metric.stairWidthM,
      waistThicknessMm,
      staircaseType: input.staircaseType,
    })

    const steelCost =
      input.unitSystem === 'imperial'
        ? steelQuantity.totalSteelWeight * 2.20462 * metric.steelRate
        : steelQuantity.totalSteelWeight * metric.steelRate

    const concreteCost = concreteQuantity.totalConcreteVolume * 6500
    const totalApproxCost = steelCost + concreteCost

    const detailedDesign =
      input.staircaseType === 'straight' || input.staircaseType === 'doglegged'

    const status =
      comfort.status === 'Comfortable' &&
      shearSafe &&
      deflectionSafe &&
      ldSafe
        ? 'Safe'
        : 'Check Required'

    finalResult = {
      input,
      metric,
      fck,
      fy,
      stairType: staircaseTypes[input.staircaseType],
      detailedDesign,
      geometry,
      comfort,
      waistThicknessMm,
      waistMode: metric.waistMode,
      effectiveDepthMm,
      waistSelfWeight,
      stepSelfWeight,
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
      distributionBars,
      landingBars,
      distributionAst,
      maxMainSpacing,
      maxDistributionSpacing,
      steelPercent,
      tauC,
      shearStress,
      shearSafe,
      actualLdRatio,
      allowableLdRatio,
      deflectionSafe,
      ldMm,
      availableLd,
      ldSafe,
      steelQuantity,
      concreteQuantity,
      steelCost,
      concreteCost,
      totalApproxCost,
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

function StaircaseGeometryDiagram({ result }) {
  const g = result.geometry
  const isDogLeg =
    result.input.staircaseType === 'doglegged' ||
    result.input.staircaseType === 'quarterTurn' ||
    result.input.staircaseType === 'openWell'

  return (
    <div className="rounded-2xl bg-slate-950/60 border border-slate-800 p-5 overflow-hidden">
      <h3 className="text-lg font-bold text-white">Staircase Geometry Diagram</h3>
      <p className="text-xs text-slate-500 mb-4">स्टेयरकेस ज्योमेट्री डायग्राम</p>

      <svg viewBox="0 0 950 560" className="w-full h-auto">
        <rect x="0" y="0" width="950" height="560" rx="20" fill="#020617" />

        <text x="40" y="45" fill="#f97316" fontSize="22" fontWeight="700">
          {result.stairType.label}
        </text>
        <text x="40" y="75" fill="#94a3b8" fontSize="14">
          Riser, tread, flight length, landing and stair angle
        </text>

        <line x1="115" y1="455" x2="810" y2="455" stroke="#475569" strokeWidth="3" />
        <line x1="115" y1="140" x2="810" y2="140" stroke="#475569" strokeWidth="3" />

        <line x1="115" y1="455" x2="115" y2="140" stroke="#64748b" strokeWidth="2" />
        <line x1="105" y1="455" x2="125" y2="455" stroke="#64748b" strokeWidth="2" />
        <line x1="105" y1="140" x2="125" y2="140" stroke="#64748b" strokeWidth="2" />
        <text x="45" y="300" fill="#e2e8f0" fontSize="15">
          Floor Height
        </text>
        <text x="45" y="320" fill="#e2e8f0" fontSize="15">
          {formatNumber(result.metric.floorHeightM, 2)} m
        </text>

        <polyline
          points="165,455 205,435 245,415 285,395 325,375 365,355 405,335 445,315 485,295 525,275 565,255 605,235 645,215 685,195 725,175 765,155"
          fill="none"
          stroke="#f97316"
          strokeWidth="4"
        />

        {Array.from({ length: 13 }).map((_, i) => {
          const x = 165 + i * 40
          const y = 455 - i * 20
          return (
            <g key={i}>
              <line x1={x} y1={y} x2={x + 40} y2={y} stroke="#334155" strokeWidth="2" />
              <line x1={x + 40} y1={y} x2={x + 40} y2={y - 20} stroke="#334155" strokeWidth="2" />
            </g>
          )
        })}

        <line x1="205" y1="495" x2="245" y2="495" stroke="#38bdf8" strokeWidth="2" />
        <line x1="205" y1="487" x2="205" y2="503" stroke="#38bdf8" strokeWidth="2" />
        <line x1="245" y1="487" x2="245" y2="503" stroke="#38bdf8" strokeWidth="2" />
        <text x="195" y="525" fill="#38bdf8" fontSize="14">
          Tread = {formatPlain(g.treadMm)} mm
        </text>

        <line x1="785" y1="435" x2="785" y2="455" stroke="#22c55e" strokeWidth="2" />
        <line x1="777" y1="435" x2="793" y2="435" stroke="#22c55e" strokeWidth="2" />
        <line x1="777" y1="455" x2="793" y2="455" stroke="#22c55e" strokeWidth="2" />
        <text x="800" y="450" fill="#22c55e" fontSize="14">
          Riser = {formatPlain(g.riserMm)} mm
        </text>

        <text x="520" y="500" fill="#e2e8f0" fontSize="15">
          Flight Going = {formatNumber(g.goingPerFlightM, 2)} m
        </text>
        <text x="520" y="525" fill="#e2e8f0" fontSize="15">
          Stair Angle = {formatNumber(g.angleDeg, 1)}°
        </text>

        {isDogLeg && (
          <>
            <rect x="550" y="130" width="160" height="55" rx="8" fill="#0f172a" stroke="#38bdf8" strokeWidth="3" />
            <text x="575" y="165" fill="#38bdf8" fontSize="15" fontWeight="700">
              Mid Landing
            </text>
          </>
        )}

        <rect x="40" y="105" width="230" height="190" rx="12" fill="#0b1220" stroke="#334155" />
        <text x="60" y="135" fill="#f97316" fontSize="16" fontWeight="700">
          Geometry Summary
        </text>
        <text x="60" y="165" fill="#cbd5e1" fontSize="14">
          Risers: {g.totalRisers}
        </text>
        <text x="60" y="190" fill="#cbd5e1" fontSize="14">
          Treads: {g.totalTreads}
        </text>
        <text x="60" y="215" fill="#cbd5e1" fontSize="14">
          Flight Span: {formatNumber(g.slopingLengthM, 2)} m
        </text>
        <text x="60" y="240" fill="#cbd5e1" fontSize="14">
          Stair Width: {formatNumber(result.metric.stairWidthM, 2)} m
        </text>
        <text x="60" y="265" fill="#cbd5e1" fontSize="14">
          Landing: {formatNumber(g.landingLengthM, 2)} m
        </text>
      </svg>
    </div>
  )
}

function StaircaseReinforcementDiagram({ result }) {
  const isCantilever = result.input.staircaseType === 'cantilever'

  return (
    <div className="rounded-2xl bg-slate-950/60 border border-slate-800 p-5 overflow-hidden">
      <h3 className="text-lg font-bold text-white">RCC Reinforcement Diagram</h3>
      <p className="text-xs text-slate-500 mb-4">RCC रिइनफोर्समेंट डायग्राम</p>

      <svg viewBox="0 0 950 460" className="w-full h-auto">
        <rect x="0" y="0" width="950" height="460" rx="20" fill="#020617" />

        <text x="40" y="45" fill="#f97316" fontSize="22" fontWeight="700">
          Staircase Waist Slab Reinforcement
        </text>
        <text x="40" y="75" fill="#94a3b8" fontSize="14">
          Main steel, distribution steel, waist slab thickness and support condition
        </text>

        {isCantilever ? (
          <>
            <rect x="130" y="135" width="45" height="220" fill="#475569" />
            <text x="85" y="120" fill="#cbd5e1" fontSize="14">
              Fixed Support
            </text>
            <polygon
              points="175,165 720,300 720,345 175,210"
              fill="#0f172a"
              stroke="#f97316"
              strokeWidth="3"
            />
          </>
        ) : (
          <>
            <rect x="145" y="325" width="80" height="70" rx="6" fill="#334155" />
            <rect x="700" y="325" width="80" height="70" rx="6" fill="#334155" />
            <polygon
              points="185,315 730,160 750,205 205,360"
              fill="#0f172a"
              stroke="#f97316"
              strokeWidth="3"
            />
            <text x="135" y="415" fill="#cbd5e1" fontSize="13">
              Landing Beam
            </text>
            <text x="695" y="415" fill="#cbd5e1" fontSize="13">
              Landing Beam
            </text>
          </>
        )}

        {Array.from({ length: 8 }).map((_, i) => (
          <line
            key={`main-${i}`}
            x1={isCantilever ? 190 + i * 55 : 210 + i * 60}
            y1={isCantilever ? 178 + i * 14 : 335 - i * 17}
            x2={isCantilever ? 235 + i * 55 : 255 + i * 60}
            y2={isCantilever ? 190 + i * 14 : 322 - i * 17}
            stroke="#f97316"
            strokeWidth="4"
          />
        ))}

        {Array.from({ length: 9 }).map((_, i) => (
          <circle
            key={`dist-${i}`}
            cx={240 + i * 55}
            cy={isCantilever ? 245 + i * 7 : 270 - i * 12}
            r="5"
            fill="#38bdf8"
          />
        ))}

        {Array.from({ length: 7 }).map((_, i) => (
          <g key={`load-${i}`}>
            <line
              x1={260 + i * 70}
              y1="105"
              x2={260 + i * 70}
              y2={isCantilever ? 165 + i * 17 : 185 - i * 12}
              stroke="#e2e8f0"
              strokeWidth="2"
            />
            <polygon
              points={`${260 + i * 70},${isCantilever ? 165 + i * 17 : 185 - i * 12} ${255 + i * 70},${isCantilever ? 155 + i * 17 : 175 - i * 12} ${265 + i * 70},${isCantilever ? 155 + i * 17 : 175 - i * 12}`}
              fill="#e2e8f0"
            />
          </g>
        ))}
        <text x="710" y="100" fill="#e2e8f0" fontSize="13">
          Loads
        </text>

        <line x1="790" y1="185" x2="810" y2="240" stroke="#94a3b8" strokeWidth="2" />
        <text x="820" y="218" fill="#e2e8f0" fontSize="14">
          Waist = {formatPlain(result.waistThicknessMm)} mm
        </text>

        <text x="40" y="115" fill="#f97316" fontSize="15" fontWeight="700">
          Main Steel:
        </text>
        <text x="145" y="115" fill="#cbd5e1" fontSize="15">
          {result.mainBars.dia} mm Ø @ {result.mainBars.spacing} mm c/c
        </text>

        <text x="40" y="145" fill="#38bdf8" fontSize="15" fontWeight="700">
          Distribution:
        </text>
        <text x="145" y="145" fill="#cbd5e1" fontSize="15">
          {result.distributionBars.dia} mm Ø @ {result.distributionBars.spacing} mm c/c
        </text>

        <text x="40" y="175" fill="#cbd5e1" fontSize="15">
          Main Steel Location: {result.mainSteelLocation}
        </text>

        <text x="40" y="205" fill="#cbd5e1" fontSize="15">
          Effective Depth: {formatPlain(result.effectiveDepthMm)} mm
        </text>

        <text x="40" y="235" fill="#cbd5e1" fontSize="15">
          Clear Cover: {formatPlain(result.coverMm)} mm ({result.coverMode})
        </text>
      </svg>
    </div>
  )
}

export default function StaircaseCalculatorPage() {
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
      const data = calculateStaircase(input)
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
    doc.text('Staircase Design Report', 14, 20)

    doc.setTextColor(100, 116, 139)
    doc.setFontSize(9)
    doc.text(`Generated: ${new Date().toLocaleString('en-IN')}`, 145, 12)
    doc.text(`Unit System: ${input.unitSystem === 'metric' ? 'Metric' : 'Imperial'}`, 145, 18)

    doc.setTextColor(15, 23, 42)
    doc.setFontSize(14)
    doc.text('Input Summary', 14, 38)

    const inputRows = [
      ['Staircase Type', staircaseTypes[input.staircaseType].label],
      ['Floor to Floor Height', `${input.floorHeight} ${lengthUnit}`],
      ['Stair Width', `${input.stairWidth} ${lengthUnit}`],
      ['Available Length', `${input.availableLength} ${lengthUnit}`],
      ['Riser', input.riser === '' ? 'Auto' : `${input.riser} ${dimensionUnit}`],
      ['Tread', input.tread === '' ? 'Auto' : `${input.tread} ${dimensionUnit}`],
      ['Number of Risers', input.numberOfRisers === '' ? 'Auto' : input.numberOfRisers],
      ['Landing Length', input.landingLength === '' ? 'Auto' : `${input.landingLength} ${lengthUnit}`],
      ['Waist Slab Thickness', input.waistThickness === '' ? 'Auto' : `${input.waistThickness} ${dimensionUnit}`],
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
      styles: { fontSize: 8 },
    })

    let y = doc.lastAutoTable.finalY + 10

    if (y > 205) {
      doc.addPage()
      y = 18
    }

    doc.setFontSize(14)
    doc.setTextColor(15, 23, 42)
    doc.text('Output Summary', 14, y)

    const outputRows = [
      ['Design Status', result.status],
      ['Staircase Type', result.stairType.label],
      ['Riser', `${formatNumber(result.geometry.riserMm, 1)} mm (${result.metric.riserMode})`],
      ['Tread', `${formatNumber(result.geometry.treadMm, 1)} mm (${result.metric.treadMode})`],
      ['Total Risers', result.geometry.totalRisers],
      ['Total Treads', result.geometry.totalTreads],
      ['Stair Angle', `${formatNumber(result.geometry.angleDeg, 1)}°`],
      ['Comfort Status', result.comfort.status],
      ['Waist Slab Thickness', `${formatPlain(result.waistThicknessMm)} mm (${result.waistMode})`],
      ['Main Steel', `${result.mainBars.dia} mm dia @ ${result.mainBars.spacing} mm c/c`],
      ['Distribution Steel', `${result.distributionBars.dia} mm dia @ ${result.distributionBars.spacing} mm c/c`],
      ['Shear Check', result.shearSafe ? 'Safe' : 'Check Required'],
      ['Deflection Check', result.deflectionSafe ? 'Safe' : 'Check Required'],
      ['Development Length', `${formatPlain(result.ldMm)} mm - ${result.ldSafe ? 'OK' : 'Check Required'}`],
      ['Concrete Quantity', `${formatNumber(result.concreteQuantity.totalConcreteVolume, 2)} m³`],
      ['Steel Quantity', `${formatNumber(result.steelQuantity.totalSteelWeight, 2)} kg`],
      ['Approx Cost', `₹${formatNumber(result.totalApproxCost, 0)}`],
    ]

    autoTable(doc, {
      startY: y + 5,
      head: [['Output', 'Value']],
      body: outputRows,
      theme: 'grid',
      headStyles: { fillColor: [15, 23, 42] },
      styles: { fontSize: 8 },
    })

    y = doc.lastAutoTable.finalY + 10

    if (y > 218) {
      doc.addPage()
      y = 18
    }

    doc.setFontSize(14)
    doc.setTextColor(15, 23, 42)
    doc.text('Staircase Diagram', 14, y)

    drawPdfStaircaseDiagram(doc, result, y + 8)

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

    doc.save('CivilCalc-Pro-Staircase-Design.pdf')
  }

  return (
    <main className="min-h-screen bg-[#050B1F] text-white px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <p className="text-orange-500 text-sm font-semibold tracking-wide uppercase">
            RCC Calculator
          </p>
          <h1 className="text-3xl md:text-5xl font-extrabold mt-2">
            Staircase Calculator
          </h1>
          <p className="text-slate-400 mt-3 max-w-3xl">
            User-friendly staircase calculator with auto riser, tread, waist slab thickness,
            RCC reinforcement, quantity, cost, diagrams and PDF report.
          </p>
          <p className="text-slate-500 text-sm mt-1">
            Staircase design — riser, tread, waist slab, reinforcement, quantity और diagram के साथ.
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

              <Field label="Staircase Type" hindi="स्टेयरकेस टाइप">
                <SelectBox
                  value={input.staircaseType}
                  onChange={(e) => updateInput('staircaseType', e.target.value)}
                >
                  {Object.entries(staircaseTypes).map(([key, item]) => (
                    <option key={key} value={key}>
                      {item.label}
                    </option>
                  ))}
                </SelectBox>
              </Field>

              <Field label={`Floor to Floor Height (${lengthUnit})`} hindi="फ्लोर टू फ्लोर हाइट">
                <InputBox
                  type="number"
                  value={input.floorHeight}
                  onChange={(e) => updateInput('floorHeight', e.target.value)}
                />
              </Field>

              <Field label={`Stair Width (${lengthUnit})`} hindi="स्टेयर चौड़ाई">
                <InputBox
                  type="number"
                  value={input.stairWidth}
                  onChange={(e) => updateInput('stairWidth', e.target.value)}
                />
              </Field>

              <Field label={`Available Stair Length (${lengthUnit})`} hindi="उपलब्ध लंबाई">
                <InputBox
                  type="number"
                  value={input.availableLength}
                  onChange={(e) => updateInput('availableLength', e.target.value)}
                />
              </Field>

              <Field label={`Riser Optional (${dimensionUnit})`} hindi="खाली छोड़ें तो auto">
                <InputBox
                  type="number"
                  placeholder="Auto"
                  value={input.riser}
                  onChange={(e) => updateInput('riser', e.target.value)}
                />
              </Field>

              <Field label={`Tread Optional (${dimensionUnit})`} hindi="खाली छोड़ें तो auto">
                <InputBox
                  type="number"
                  placeholder="Auto"
                  value={input.tread}
                  onChange={(e) => updateInput('tread', e.target.value)}
                />
              </Field>

              <Field label="Number of Risers Optional" hindi="खाली छोड़ें तो auto">
                <InputBox
                  type="number"
                  placeholder="Auto"
                  value={input.numberOfRisers}
                  onChange={(e) => updateInput('numberOfRisers', e.target.value)}
                />
              </Field>

              <Field label={`Landing Length Optional (${lengthUnit})`} hindi="खाली छोड़ें तो auto">
                <InputBox
                  type="number"
                  placeholder="Auto"
                  value={input.landingLength}
                  onChange={(e) => updateInput('landingLength', e.target.value)}
                />
              </Field>

              <Field label={`Waist Slab Thickness Optional (${dimensionUnit})`} hindi="खाली छोड़ें तो auto">
                <InputBox
                  type="number"
                  placeholder="Auto"
                  value={input.waistThickness}
                  onChange={(e) => updateInput('waistThickness', e.target.value)}
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
                  <span className="text-3xl">🪜</span>
                </div>
                <h2 className="text-2xl font-bold">Output will appear here</h2>
                <p className="text-slate-400 mt-2 max-w-md">
                  Fill staircase inputs and click Run Design to generate geometry,
                  RCC reinforcement, quantity, cost, diagrams and PDF.
                </p>
                <p className="text-slate-500 text-sm mt-2">
                  Run Design click करने के बाद ही output आएगा.
                </p>
              </div>
            ) : (
              <>
                <ResultCard title="Design Status" hindi="डिज़ाइन स्टेटस" highlight>
                  <Row label="Status" value={result.status} strong />
                  <Row label="Staircase Type" value={result.stairType.label} />
                  <Row label="Design Level" value={result.detailedDesign ? 'Detailed RCC design' : 'Preliminary RCC design'} />
                  <Row label="Comfort Status" value={result.comfort.status} strong />
                  <Row label="Note" value={result.stairType.designNote} />
                </ResultCard>

                <ResultCard title="Final Recommendation" hindi="अंतिम सुझाव" highlight>
                  <Row label="Adopt Riser" value={`${formatNumber(result.geometry.riserMm, 1)} mm (${result.metric.riserMode})`} strong />
                  <Row label="Adopt Tread" value={`${formatNumber(result.geometry.treadMm, 1)} mm (${result.metric.treadMode})`} strong />
                  <Row label="No. of Risers" value={result.geometry.totalRisers} />
                  <Row label="No. of Treads" value={result.geometry.totalTreads} />
                  <Row label="Waist Slab Thickness" value={`${formatPlain(result.waistThicknessMm)} mm (${result.waistMode})`} strong />
                  <Row label="Main Steel" value={`${result.mainBars.dia} mm dia @ ${result.mainBars.spacing} mm c/c`} strong />
                  <Row label="Distribution Steel" value={`${result.distributionBars.dia} mm dia @ ${result.distributionBars.spacing} mm c/c`} strong />
                </ResultCard>

                <ResultCard title="Stair Geometry" hindi="स्टेयर ज्योमेट्री">
                  <Row label="Floor Height" value={`${formatNumber(result.metric.floorHeightM, 2)} m`} />
                  <Row label="Stair Width" value={`${formatNumber(result.metric.stairWidthM, 2)} m`} />
                  <Row label="Flights" value={result.geometry.flights} />
                  <Row label="Risers per Flight" value={result.geometry.risersPerFlight} />
                  <Row label="Treads per Flight" value={result.geometry.treadsPerFlight} />
                  <Row label="Flight Going" value={`${formatNumber(result.geometry.goingPerFlightM, 2)} m`} />
                  <Row label="Sloping Length" value={`${formatNumber(result.geometry.slopingLengthM, 2)} m`} />
                  <Row label="Landing Length" value={`${formatNumber(result.geometry.landingLengthM, 2)} m`} />
                </ResultCard>

                <ResultCard title="Comfort Check" hindi="कम्फर्ट चेक">
                  <Row label="Riser" value={`${formatNumber(result.geometry.riserMm, 1)} mm`} />
                  <Row label="Tread" value={`${formatNumber(result.geometry.treadMm, 1)} mm`} />
                  <Row label="2R + T" value={`${formatNumber(result.geometry.comfortValue, 1)} mm`} />
                  <Row label="Stair Angle" value={`${formatNumber(result.geometry.angleDeg, 1)}°`} />
                  <Row label="Status" value={result.comfort.status} strong />
                  <Row label="Recommendation" value={result.comfort.notes.join(' ')} />
                </ResultCard>

                <ResultCard title="Loading" hindi="लोडिंग">
                  <Row label="Waist Slab Self Weight" value={`${formatNumber(result.waistSelfWeight, 2)} kN/m²`} />
                  <Row label="Step Self Weight" value={`${formatNumber(result.stepSelfWeight, 2)} kN/m²`} />
                  <Row label="Total Service Load" value={`${formatNumber(result.totalServiceLoad, 2)} kN/m²`} />
                  <Row label="Factored Load" value={`${formatNumber(result.factoredLoad, 2)} kN/m²`} strong />
                </ResultCard>

                <ResultCard title="Waist Slab Design" hindi="वेस्ट स्लैब डिजाइन">
                  <Row label="Waist Thickness" value={`${formatPlain(result.waistThicknessMm)} mm`} />
                  <Row label="Effective Depth" value={`${formatPlain(result.effectiveDepthMm)} mm`} />
                  <Row label="Clear Cover" value={`${formatPlain(result.coverMm)} mm (${result.coverMode})`} />
                  <Row label="Main Steel Location" value={result.mainSteelLocation} />
                </ResultCard>

                <ResultCard title="Bending Moment" hindi="बेंडिंग मोमेंट">
                  <Row label="Moment Type" value={result.momentType} />
                  <Row label="Maximum Moment" value={`${formatNumber(result.momentKnM, 2)} kNm/m`} strong />
                  <Row label="Ast for Flexure" value={`${formatNumber(result.astFlexure, 2)} mm²/m`} />
                  <Row label="Minimum Ast" value={`${formatNumber(result.minAst, 2)} mm²/m`} />
                  <Row label="Required Ast" value={`${formatNumber(result.astRequired, 2)} mm²/m`} strong />
                </ResultCard>

                <ResultCard title="Reinforcement" hindi="रिइनफोर्समेंट">
                  <Row label="Main Steel" value={`${result.mainBars.dia} mm Ø @ ${result.mainBars.spacing} mm c/c`} strong />
                  <Row label="Provided Main Ast" value={`${formatNumber(result.mainBars.astProvided, 2)} mm²/m`} />
                  <Row label="Distribution Steel" value={`${result.distributionBars.dia} mm Ø @ ${result.distributionBars.spacing} mm c/c`} strong />
                  <Row label="Landing Steel" value={`${result.landingBars.dia} mm Ø @ ${result.landingBars.spacing} mm c/c`} />
                </ResultCard>

                <ResultCard title="Shear Check" hindi="शियर चेक">
                  <Row label="Shear Force Vu" value={`${formatNumber(result.shearKn, 2)} kN/m`} />
                  <Row label="Nominal Shear Stress" value={`${formatNumber(result.shearStress, 3)} N/mm²`} strong />
                  <Row label="Permissible Shear Stress" value={`${formatNumber(result.tauC, 3)} N/mm²`} />
                  <Row label="Status" value={result.shearSafe ? 'Safe' : 'Check Required'} strong />
                </ResultCard>

                <ResultCard title="Deflection Check" hindi="डिफ्लेक्शन चेक">
                  <Row label="Actual L/d" value={formatNumber(result.actualLdRatio, 2)} />
                  <Row label="Allowable L/d" value={formatNumber(result.allowableLdRatio, 2)} />
                  <Row label="Status" value={result.deflectionSafe ? 'Safe' : 'Check Required'} strong />
                  <Row label="Recommendation" value={result.deflectionSafe ? 'Waist slab thickness is adequate.' : 'Increase waist slab thickness.'} />
                </ResultCard>

                <ResultCard title="Development Length" hindi="डेवलपमेंट लेंथ">
                  <Row label="Required Ld" value={`${formatPlain(result.ldMm)} mm`} />
                  <Row label="Available Length Assumed" value={`${formatPlain(result.availableLd)} mm`} />
                  <Row label="Status" value={result.ldSafe ? 'OK' : 'Check Required'} strong />
                </ResultCard>

                <ResultCard title="Concrete Quantity" hindi="कंक्रीट क्वांटिटी">
                  <Row label="Waist Slab Concrete" value={`${formatNumber(result.concreteQuantity.waistVolume, 3)} m³`} />
                  <Row label="Steps Concrete" value={`${formatNumber(result.concreteQuantity.stepsVolume, 3)} m³`} />
                  <Row label="Landing Concrete" value={`${formatNumber(result.concreteQuantity.landingVolume, 3)} m³`} />
                  <Row label="Total Concrete" value={`${formatNumber(result.concreteQuantity.totalConcreteVolume, 3)} m³`} strong />
                </ResultCard>

                <ResultCard title="Steel Quantity" hindi="स्टील क्वांटिटी">
                  <Row label="Main Steel Weight" value={`${formatNumber(result.steelQuantity.mainSteelWeight, 2)} kg`} />
                  <Row label="Distribution Steel Weight" value={`${formatNumber(result.steelQuantity.distributionSteelWeight, 2)} kg`} />
                  <Row label="Landing Steel Weight" value={`${formatNumber(result.steelQuantity.landingSteelWeight, 2)} kg`} />
                  <Row label="Total Steel Weight" value={`${formatNumber(result.steelQuantity.totalSteelWeight, 2)} kg`} strong />
                  <Row label="Approx Steel Cost" value={`₹${formatNumber(result.steelCost, 0)}`} strong />
                </ResultCard>

                <ResultCard title="Cost Summary" hindi="कॉस्ट समरी">
                  <Row label="Approx Concrete Cost" value={`₹${formatNumber(result.concreteCost, 0)}`} />
                  <Row label="Approx Steel Cost" value={`₹${formatNumber(result.steelCost, 0)}`} />
                  <Row label="Approx Total Cost" value={`₹${formatNumber(result.totalApproxCost, 0)}`} strong />
                </ResultCard>

                <StaircaseGeometryDiagram result={result} />
                <StaircaseReinforcementDiagram result={result} />

                <div className="rounded-2xl border border-yellow-500/40 bg-yellow-500/10 p-5 text-sm text-yellow-100">
                  <p className="font-bold mb-2">Disclaimer / अस्वीकरण</p>
                  <p>
                    This staircase design is for preliminary design, educational and site estimation purposes.
                    Before construction, verify it with a qualified site engineer or structural engineer as per
                    actual support condition, load combination and applicable IS codes.
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

function drawPdfStaircaseDiagram(doc, result, startY) {
  const y = startY

  doc.setDrawColor(249, 115, 22)
  doc.roundedRect(14, y, 182, 95, 3, 3, 'S')

  doc.setFontSize(10)
  doc.setTextColor(15, 23, 42)
  doc.text('Geometry + Reinforcement Detail', 18, y + 7)

  doc.setDrawColor(100, 116, 139)
  doc.line(28, y + 70, 102, y + 70)
  doc.line(28, y + 28, 102, y + 28)
  doc.line(28, y + 70, 28, y + 28)

  doc.setDrawColor(249, 115, 22)
  doc.line(38, y + 68, 92, y + 34)

  for (let i = 0; i < 6; i += 1) {
    doc.setDrawColor(100, 116, 139)
    doc.line(38 + i * 9, y + 68 - i * 6, 47 + i * 9, y + 68 - i * 6)
    doc.line(47 + i * 9, y + 68 - i * 6, 47 + i * 9, y + 62 - i * 6)
  }

  doc.setFontSize(7)
  doc.setTextColor(15, 23, 42)
  doc.text(`Riser = ${formatNumber(result.geometry.riserMm, 1)} mm`, 18, y + 78)
  doc.text(`Tread = ${formatNumber(result.geometry.treadMm, 1)} mm`, 18, y + 84)
  doc.text(`Risers = ${result.geometry.totalRisers}`, 18, y + 90)

  doc.rect(120, y + 48, 58, 12)

  doc.setFillColor(249, 115, 22)
  for (let i = 0; i < 7; i += 1) {
    doc.circle(126 + i * 8, y + 57, 1.1, 'F')
  }

  doc.setFillColor(56, 189, 248)
  for (let i = 0; i < 5; i += 1) {
    doc.circle(130 + i * 10, y + 53, 1.0, 'F')
  }

  doc.setTextColor(15, 23, 42)
  doc.setFontSize(7)
  doc.text(`Waist = ${formatPlain(result.waistThicknessMm)} mm`, 112, y + 68)
  doc.text(`Main: ${result.mainBars.dia} mm @ ${result.mainBars.spacing} mm`, 112, y + 76)
  doc.text(`Dist: ${result.distributionBars.dia} mm @ ${result.distributionBars.spacing} mm`, 112, y + 84)
  doc.text(`Concrete = ${formatNumber(result.concreteQuantity.totalConcreteVolume, 2)} m3`, 112, y + 90)
}
