'use client'

import { useMemo, useState } from 'react'
import {
  AlertTriangle,
  Calculator,
  CheckCircle2,
  ClipboardList,
  Download,
  Droplets,
  Hammer,
  RefreshCcw,
  RotateCcw,
  Ruler,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'

const defaultInputs = {
  unitSystem: 'metric',
  wallType: 'cantilever',

  height: 3,
  toe: 0.9,
  heel: 1.4,
  stemTopThickness: 200,
  stemBaseThickness: 300,
  baseThickness: 350,
  embedmentDepth: 0.6,

  counterfortSpacing: 3,
  counterfortThickness: 250,
  counterfortProjection: 1.1,

  gammaSoil: 18,
  phi: 30,
  surcharge: 10,
  sbc: 180,
  friction: 0.5,

  drainageCondition: 'good',
  waterHeight: 0,
  gammaWater: 9.81,

  seismicEnabled: false,
  seismicCoefficient: 0.08,

  shearKeyEnabled: false,
  keyDepth: 0.45,
  keyThickness: 250,
  passiveEnabled: false,
  passiveReduction: 0.5,

  gammaConcrete: 25,
  fck: 25,
  fy: 500,
  cover: 50,
  stemBarDia: 12,
  toeBarDia: 12,
  heelBarDia: 12,
  counterfortBarDia: 12,
  distributionBarDia: 8,

  wallLength: 10,
  weepHoleHorizontalSpacing: 1.5,
  weepHoleVerticalSpacing: 1.0,

  concreteRate: 6500,
  steelRate: 65,
  excavationRate: 250,
  backfillRate: 180,
}

const imperialDefaults = {
  ...defaultInputs,
  unitSystem: 'imperial',

  height: 10,
  toe: 3,
  heel: 5,
  stemTopThickness: 8,
  stemBaseThickness: 12,
  baseThickness: 14,
  embedmentDepth: 2,

  counterfortSpacing: 10,
  counterfortThickness: 10,
  counterfortProjection: 4,

  gammaSoil: 115,
  surcharge: 200,
  sbc: 3750,
  gammaConcrete: 150,

  waterHeight: 0,
  wallLength: 30,
  weepHoleHorizontalSpacing: 5,
  weepHoleVerticalSpacing: 3,
}

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

function convertToMetric(input) {
  if (input.unitSystem === 'imperial') {
    return {
      H: input.height * 0.3048,
      toe: input.toe * 0.3048,
      heel: input.heel * 0.3048,
      stemTopT: input.stemTopThickness * 25.4,
      stemBaseT: input.stemBaseThickness * 25.4,
      baseT: input.baseThickness * 25.4,
      embedment: input.embedmentDepth * 0.3048,

      counterfortSpacing: input.counterfortSpacing * 0.3048,
      counterfortThickness: input.counterfortThickness * 25.4,
      counterfortProjection: input.counterfortProjection * 0.3048,

      gammaSoil: input.gammaSoil * 0.157087,
      surcharge: input.surcharge * 0.0478803,
      sbc: input.sbc * 0.0478803,
      gammaConcrete: input.gammaConcrete * 0.157087,

      waterHeight: input.waterHeight * 0.3048,
      wallLength: input.wallLength * 0.3048,
      weepH: input.weepHoleHorizontalSpacing * 0.3048,
      weepV: input.weepHoleVerticalSpacing * 0.3048,

      keyDepth: input.keyDepth * 0.3048,
      keyThickness: input.keyThickness * 25.4,

      phi: input.phi,
      friction: input.friction,
      gammaWater: input.gammaWater,
      passiveReduction: input.passiveReduction,
      seismicCoefficient: input.seismicCoefficient,

      fck: input.fck,
      fy: input.fy,
      cover: input.cover,
      stemBarDia: input.stemBarDia,
      toeBarDia: input.toeBarDia,
      heelBarDia: input.heelBarDia,
      counterfortBarDia: input.counterfortBarDia,
      distributionBarDia: input.distributionBarDia,

      concreteRate: input.concreteRate,
      steelRate: input.steelRate,
      excavationRate: input.excavationRate,
      backfillRate: input.backfillRate,
    }
  }

  return {
    H: input.height,
    toe: input.toe,
    heel: input.heel,
    stemTopT: input.stemTopThickness,
    stemBaseT: input.stemBaseThickness,
    baseT: input.baseThickness,
    embedment: input.embedmentDepth,

    counterfortSpacing: input.counterfortSpacing,
    counterfortThickness: input.counterfortThickness,
    counterfortProjection: input.counterfortProjection,

    gammaSoil: input.gammaSoil,
    surcharge: input.surcharge,
    sbc: input.sbc,
    gammaConcrete: input.gammaConcrete,

    waterHeight: input.waterHeight,
    wallLength: input.wallLength,
    weepH: input.weepHoleHorizontalSpacing,
    weepV: input.weepHoleVerticalSpacing,

    keyDepth: input.keyDepth,
    keyThickness: input.keyThickness,

    phi: input.phi,
    friction: input.friction,
    gammaWater: input.gammaWater,
    passiveReduction: input.passiveReduction,
    seismicCoefficient: input.seismicCoefficient,

    fck: input.fck,
    fy: input.fy,
    cover: input.cover,
    stemBarDia: input.stemBarDia,
    toeBarDia: input.toeBarDia,
    heelBarDia: input.heelBarDia,
    counterfortBarDia: input.counterfortBarDia,
    distributionBarDia: input.distributionBarDia,

    concreteRate: input.concreteRate,
    steelRate: input.steelRate,
    excavationRate: input.excavationRate,
    backfillRate: input.backfillRate,
  }
}

function statusClass(pass) {
  return pass
    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
    : 'border-red-500/30 bg-red-500/10 text-red-300'
}

function steelDesign({ Mu, d, D, dia, fy }) {
  const effectiveD = Math.max(d, 50)
  const astCalc = (Mu * 1000000) / (0.87 * fy * 0.9 * effectiveD)
  const astMin = 0.0012 * 1000 * D
  const astReq = Math.max(astCalc, astMin)
  const spacingRaw = (barArea(dia) * 1000) / astReq
  const maxSpacing = Math.min(3 * effectiveD, 300)
  const spacing = Math.max(
    75,
    Math.min(maxSpacing, Math.floor(spacingRaw / 25) * 25)
  )

  return {
    astCalc,
    astMin,
    astReq,
    spacing,
  }
}

function computeWall(input, override = {}) {
  const base = convertToMetric(input)
  const m = {
    ...base,
    ...override,
  }

  const H = Math.max(m.H, 0.1)
  const toe = Math.max(m.toe, 0.05)
  const heel = Math.max(m.heel, 0.05)
  const stemTopT = Math.max(m.stemTopT / 1000, 0.05)
  const stemBaseT = Math.max(m.stemBaseT / 1000, 0.05)
  const baseT = Math.max(m.baseT / 1000, 0.05)
  const avgStemT = (stemTopT + stemBaseT) / 2
  const B = toe + stemBaseT + heel

  const counterfortSpacing = Math.max(m.counterfortSpacing, 0.5)
  const counterfortThickness = Math.max(m.counterfortThickness / 1000, 0.05)
  const counterfortProjection = Math.max(m.counterfortProjection, 0.05)

  const phiRad = (m.phi * Math.PI) / 180
  const sinPhi = Math.sin(phiRad)
  const Ka = (1 - sinPhi) / (1 + sinPhi)
  const Kp = (1 + sinPhi) / (1 - sinPhi)

  const PaTri = 0.5 * Ka * m.gammaSoil * H * H
  const PaSurcharge = Ka * m.surcharge * H

  const waterHeight =
    input.drainageCondition === 'poor'
      ? Math.min(Math.max(m.waterHeight, 0), H)
      : 0

  const Pwater = 0.5 * m.gammaWater * waterHeight * waterHeight

  const Pseismic = input.seismicEnabled
    ? 0.5 * Math.max(m.seismicCoefficient, 0) * m.gammaSoil * H * H
    : 0

  const PaTotal = PaTri + PaSurcharge + Pwater + Pseismic

  const Mo =
    PaTri * (baseT + H / 3) +
    PaSurcharge * (baseT + H / 2) +
    Pwater * (baseT + waterHeight / 3) +
    Pseismic * (baseT + 0.6 * H)

  const baseWeight = m.gammaConcrete * B * baseT
  const stemWeight = m.gammaConcrete * avgStemT * H
  const soilHeelWeight = m.gammaSoil * heel * H
  const surchargeHeelWeight = m.surcharge * heel

  const isCounterfort = input.wallType === 'counterfort'

  const counterfortVolumePerM = isCounterfort
    ? (0.5 * counterfortProjection * H * counterfortThickness) /
      counterfortSpacing
    : 0

  const counterfortWeight = m.gammaConcrete * counterfortVolumePerM

  const keyDepth = input.shearKeyEnabled ? Math.max(m.keyDepth, 0) : 0
  const keyT = input.shearKeyEnabled ? Math.max(m.keyThickness / 1000, 0) : 0
  const keyWeight = input.shearKeyEnabled
    ? m.gammaConcrete * keyDepth * keyT
    : 0

  const xBase = B / 2
  const xStem = toe + stemBaseT / 2
  const xHeel = toe + stemBaseT + heel / 2
  const xKey = toe + stemBaseT / 2
  const xCounterfort = toe + stemBaseT + counterfortProjection / 3

  const V =
    baseWeight +
    stemWeight +
    soilHeelWeight +
    surchargeHeelWeight +
    keyWeight +
    counterfortWeight

  const Mr =
    baseWeight * xBase +
    stemWeight * xStem +
    soilHeelWeight * xHeel +
    surchargeHeelWeight * xHeel +
    keyWeight * xKey +
    counterfortWeight * xCounterfort

  const passiveDepth = input.passiveEnabled
    ? Math.max(m.embedment + keyDepth, 0)
    : 0

  const passiveResistance =
    input.passiveEnabled && passiveDepth > 0
      ? 0.5 *
        Kp *
        m.gammaSoil *
        passiveDepth *
        passiveDepth *
        m.passiveReduction
      : 0

  const slidingResistance = m.friction * V + passiveResistance
  const fsOverturning = Mr / Mo
  const fsSliding = slidingResistance / PaTotal

  const xResultant = (Mr - Mo) / V
  const e = B / 2 - xResultant

  const qAvg = V / B
  const qMax = qAvg * (1 + (6 * Math.abs(e)) / B)
  const qMin = qAvg * (1 - (6 * Math.abs(e)) / B)

  const qAt = (x) => {
    return qAvg * (1 + ((6 * e) / B) * (1 - (2 * x) / B))
  }

  const qToeAvg = (qAt(0) + qAt(toe)) / 2
  const toeNetPressure = Math.max(qToeAvg - m.gammaConcrete * baseT, 0)
  const MtoeService = toeNetPressure * toe * toe / 2

  const heelStart = toe + stemBaseT
  const qHeelAvg = (qAt(heelStart) + qAt(B)) / 2
  const heelDownPressure =
    m.gammaConcrete * baseT + m.gammaSoil * H + m.surcharge

  const MheelService = Math.abs(
    (heelDownPressure - qHeelAvg) * heel * heel / 2
  )

  const MstemCantileverService =
    PaTri * (H / 3) +
    PaSurcharge * (H / 2) +
    Pwater * (waterHeight / 3) +
    Pseismic * (0.6 * H)

  const pBase =
    Ka * m.gammaSoil * H +
    Ka * m.surcharge +
    (waterHeight > 0 ? m.gammaWater * waterHeight : 0) +
    (input.seismicEnabled ? m.seismicCoefficient * m.gammaSoil * H : 0)

  const MstemCounterfortPanelService =
    (pBase * counterfortSpacing * counterfortSpacing) / 10

  const MstemService = isCounterfort
    ? MstemCounterfortPanelService
    : MstemCantileverService

  const McounterfortService = isCounterfort
    ? (PaTotal * counterfortSpacing * H) / 12
    : 0

  const loadFactor = 1.5

  const MstemUltimate = MstemService * loadFactor
  const MtoeUltimate = MtoeService * loadFactor
  const MheelUltimate = MheelService * loadFactor
  const McounterfortUltimate = McounterfortService * loadFactor

  const dStem = m.stemBaseT - m.cover - m.stemBarDia / 2
  const dBaseToe = m.baseT - m.cover - m.toeBarDia / 2
  const dBaseHeel = m.baseT - m.cover - m.heelBarDia / 2
  const dCounterfort =
    Math.max(m.counterfortThickness, 150) - m.cover - m.counterfortBarDia / 2

  const stemSteel = steelDesign({
    Mu: MstemUltimate,
    d: dStem,
    D: m.stemBaseT,
    dia: m.stemBarDia,
    fy: m.fy,
  })

  const toeSteel = steelDesign({
    Mu: MtoeUltimate,
    d: dBaseToe,
    D: m.baseT,
    dia: m.toeBarDia,
    fy: m.fy,
  })

  const heelSteel = steelDesign({
    Mu: MheelUltimate,
    d: dBaseHeel,
    D: m.baseT,
    dia: m.heelBarDia,
    fy: m.fy,
  })

  const counterfortSteel = steelDesign({
    Mu: McounterfortUltimate,
    d: dCounterfort,
    D: Math.max(m.counterfortThickness, 150),
    dia: m.counterfortBarDia,
    fy: m.fy,
  })

  const distributionAstStem = 0.0012 * 1000 * m.stemBaseT
  const distributionSpacingRaw =
    (barArea(m.distributionBarDia) * 1000) / distributionAstStem

  const distributionSpacing = Math.max(
    100,
    Math.min(300, Math.floor(distributionSpacingRaw / 25) * 25)
  )

  const concreteVolumePerM =
    B * baseT +
    avgStemT * H +
    (input.shearKeyEnabled ? keyT * keyDepth : 0) +
    counterfortVolumePerM

  const concreteVolumeTotal = concreteVolumePerM * m.wallLength

  const excavationDepth = baseT + m.embedment
  const workingSpace = 0.45
  const excavationVolumePerM = (B + workingSpace * 2) * excavationDepth
  const excavationVolumeTotal = excavationVolumePerM * m.wallLength

  const backfillVolumePerM = heel * H
  const backfillVolumeTotal = backfillVolumePerM * m.wallLength

  const shutteringAreaPerM =
    2 * H +
    2 * baseT +
    H * 0.15 +
    (isCounterfort
      ? (2 * 0.5 * counterfortProjection * H) / counterfortSpacing
      : 0)

  const shutteringAreaTotal = shutteringAreaPerM * m.wallLength

  const stemBarsPerM = 1000 / stemSteel.spacing
  const toeBarsPerM = 1000 / toeSteel.spacing
  const heelBarsPerM = 1000 / heelSteel.spacing
  const counterfortsCount = isCounterfort
    ? Math.ceil(m.wallLength / counterfortSpacing) + 1
    : 0

  const stemMainLength = H + baseT + 0.45
  const toeBarLength = toe + stemBaseT + 0.3
  const heelBarLength = heel + stemBaseT + 0.3

  const stemSteelKgPerM =
    stemBarsPerM * stemMainLength * barWeight(m.stemBarDia)

  const toeSteelKgPerM = toeBarsPerM * toeBarLength * barWeight(m.toeBarDia)

  const heelSteelKgPerM = heelBarsPerM * heelBarLength * barWeight(m.heelBarDia)

  const horizontalBarsInStem =
    Math.ceil(H / (distributionSpacing / 1000)) + 1

  const stemDistributionKgPerM =
    horizontalBarsInStem * 1 * barWeight(m.distributionBarDia)

  const baseDistributionKgPerM =
    (1000 / 250) * B * barWeight(m.distributionBarDia)

  const counterfortSteelKgTotal = isCounterfort
    ? counterfortsCount *
      Math.max(4, Math.ceil(counterfortSteel.astReq / barArea(m.counterfortBarDia))) *
      (H + counterfortProjection + 0.8) *
      barWeight(m.counterfortBarDia)
    : 0

  const steelKgPerM =
    stemSteelKgPerM +
    toeSteelKgPerM +
    heelSteelKgPerM +
    stemDistributionKgPerM +
    baseDistributionKgPerM

  const steelKgTotal = steelKgPerM * m.wallLength + counterfortSteelKgTotal
  const steelWithWastage = steelKgTotal * 1.1

  const weepRows = Math.max(1, Math.floor(H / Math.max(m.weepV, 0.1)))
  const weepColumns = Math.ceil(m.wallLength / Math.max(m.weepH, 0.1))
  const totalWeepHoles = weepRows * weepColumns

  const concreteCost = concreteVolumeTotal * m.concreteRate
  const steelCost = steelWithWastage * m.steelRate
  const excavationCost = excavationVolumeTotal * m.excavationRate
  const backfillCost = backfillVolumeTotal * m.backfillRate
  const estimatedCost = concreteCost + steelCost + excavationCost + backfillCost

  const checks = {
    overturning: fsOverturning >= 1.5,
    sliding: fsSliding >= 1.5,
    eccentricity: Math.abs(e) <= B / 6,
    bearing: qMax <= m.sbc,
    noTension: qMin >= 0,
    drainage: input.drainageCondition === 'good' || waterHeight === 0,
  }

  const overallSafe =
    checks.overturning &&
    checks.sliding &&
    checks.eccentricity &&
    checks.bearing &&
    checks.noTension

  const recommendations = []

  if (!checks.overturning) {
    recommendations.push(
      'Overturning unsafe: heel length badhao, base width badhao, ya wall section heavy karo.'
    )
  }

  if (!checks.sliding) {
    recommendations.push(
      'Sliding unsafe: shear key add karo, base width badhao, friction improve karo, ya passive resistance consider karo.'
    )
  }

  if (!checks.bearing) {
    recommendations.push(
      'Bearing pressure high hai: base width increase karo ya soil SBC verify karo.'
    )
  }

  if (!checks.eccentricity || !checks.noTension) {
    recommendations.push(
      'Resultant middle-third ke bahar hai: base proportion revise karo, heel increase karna most effective rahega.'
    )
  }

  if (input.drainageCondition === 'poor' && waterHeight > 0) {
    recommendations.push(
      'Poor drainage me hydrostatic pressure dangerous hota hai. Weep holes, filter media aur drainage pipe compulsory rakho.'
    )
  }

  if (input.seismicEnabled) {
    recommendations.push(
      'Seismic pressure preliminary pseudo-static method se add kiya gaya hai. Final seismic design local code aur structural engineer se verify kare.'
    )
  }

  if (isCounterfort) {
    recommendations.push(
      'Counterfort wall high retaining height ke liye useful hai. Counterfort spacing, web thickness aur tension steel final detailing ke according verify kare.'
    )
  }

  if (recommendations.length === 0) {
    recommendations.push(
      'Preliminary checks safe hain. Final detailing, drainage, soil report aur reinforcement development length verify karo.'
    )
  }

  return {
    m,
    H,
    toe,
    heel,
    stemTopT,
    stemBaseT,
    baseT,
    avgStemT,
    B,
    counterfortSpacing,
    counterfortThickness,
    counterfortProjection,
    counterfortsCount,
    Ka,
    Kp,
    PaTri,
    PaSurcharge,
    Pwater,
    Pseismic,
    PaTotal,
    Mo,
    Mr,
    V,
    passiveResistance,
    slidingResistance,
    fsOverturning,
    fsSliding,
    xResultant,
    e,
    qAvg,
    qMax,
    qMin,
    qToeAvg,
    qHeelAvg,
    MstemService,
    MstemCantileverService,
    MstemCounterfortPanelService,
    MtoeService,
    MheelService,
    McounterfortService,
    MstemUltimate,
    MtoeUltimate,
    MheelUltimate,
    McounterfortUltimate,
    stemSteel,
    toeSteel,
    heelSteel,
    counterfortSteel,
    distributionSpacing,
    concreteVolumePerM,
    concreteVolumeTotal,
    excavationVolumeTotal,
    backfillVolumeTotal,
    shutteringAreaTotal,
    stemSteelKgPerM,
    toeSteelKgPerM,
    heelSteelKgPerM,
    stemDistributionKgPerM,
    baseDistributionKgPerM,
    counterfortSteelKgTotal,
    steelKgPerM,
    steelKgTotal,
    steelWithWastage,
    totalWeepHoles,
    weepRows,
    weepColumns,
    concreteCost,
    steelCost,
    excavationCost,
    backfillCost,
    estimatedCost,
    checks,
    overallSafe,
    recommendations,
    waterHeight,
  }
}

function findOptimizedGeometry(input) {
  const m = convertToMetric(input)
  const H = Math.max(m.H, 0.1)
  const isCounterfort = input.wallType === 'counterfort'

  const stemBaseStart = Math.max(250, Math.min(650, H * 90))
  const stemTop = Math.max(150, Math.min(300, H * 45))

  const baseMinRatio = isCounterfort ? 0.45 : 0.55
  const baseMaxRatio = isCounterfort ? 0.95 : 1.05

  let best = null

  for (let ratio = baseMinRatio; ratio <= baseMaxRatio; ratio += 0.025) {
    const B = H * ratio

    for (const heelPercent of [0.55, 0.6, 0.65, 0.7]) {
      for (let baseTmm = Math.max(300, H * 90); baseTmm <= Math.max(650, H * 160); baseTmm += 50) {
        for (let stemBaseMm = stemBaseStart; stemBaseMm <= stemBaseStart + 250; stemBaseMm += 50) {
          const stemBaseM = stemBaseMm / 1000
          const heel = Math.max(B * heelPercent, 0.25 * H)
          const toe = B - heel - stemBaseM

          if (toe < 0.15 * H || heel < 0.25 * H) continue

          const trial = computeWall(input, {
            toe,
            heel,
            stemTopT: stemTop,
            stemBaseT: stemBaseMm,
            baseT: baseTmm,
          })

          if (trial.overallSafe) {
            best = {
              toe,
              heel,
              stemTopT: stemTop,
              stemBaseT: stemBaseMm,
              baseT: baseTmm,
              B: trial.B,
              fsOverturning: trial.fsOverturning,
              fsSliding: trial.fsSliding,
              qMax: trial.qMax,
              qMin: trial.qMin,
              e: trial.e,
              results: trial,
            }
            return best
          }
        }
      }
    }
  }

  return best
}

export default function RetainingWallDesignPage() {
  const [inputs, setInputs] = useState(defaultInputs)

  const isMetric = inputs.unitSystem === 'metric'
  const isCounterfort = inputs.wallType === 'counterfort'

  const unit = {
    length: isMetric ? 'm' : 'ft',
    thickness: isMetric ? 'mm' : 'inch',
    soilUnit: isMetric ? 'kN/m³' : 'pcf',
    surcharge: isMetric ? 'kPa' : 'psf',
    sbc: isMetric ? 'kPa' : 'psf',
  }

  const updateInput = (key, value) => {
    if (key === 'unitSystem') {
      setInputs(value === 'metric' ? defaultInputs : imperialDefaults)
      return
    }

    if (['drainageCondition', 'wallType'].includes(key)) {
      setInputs((prev) => ({
        ...prev,
        [key]: value,
      }))
      return
    }

    if (typeof value === 'boolean') {
      setInputs((prev) => ({
        ...prev,
        [key]: value,
      }))
      return
    }

    setInputs((prev) => ({
      ...prev,
      [key]: safeNumber(value),
    }))
  }

  const results = useMemo(() => computeWall(inputs), [inputs])
  const optimized = useMemo(() => findOptimizedGeometry(inputs), [inputs])

  const applyOptimizedDesign = () => {
    if (!optimized) return

    if (isMetric) {
      setInputs((prev) => ({
        ...prev,
        toe: Number(round(optimized.toe, 2)),
        heel: Number(round(optimized.heel, 2)),
        stemTopThickness: Math.round(optimized.stemTopT),
        stemBaseThickness: Math.round(optimized.stemBaseT),
        baseThickness: Math.round(optimized.baseT),
      }))
    } else {
      setInputs((prev) => ({
        ...prev,
        toe: Number(round(optimized.toe / 0.3048, 2)),
        heel: Number(round(optimized.heel / 0.3048, 2)),
        stemTopThickness: Number(round(optimized.stemTopT / 25.4, 1)),
        stemBaseThickness: Number(round(optimized.stemBaseT / 25.4, 1)),
        baseThickness: Number(round(optimized.baseT / 25.4, 1)),
      }))
    }
  }

  const downloadPdf = async () => {
    try {
      const { default: jsPDF } = await import('jspdf')
      const doc = new jsPDF()

      doc.setFontSize(16)
      doc.text('Retaining Wall Design Report', 14, 18)

      doc.setFontSize(10)
      doc.text('CivilCalc Pro - Practical Site Engineer Summary', 14, 26)

      const lines = [
        `Wall Type: ${inputs.wallType}`,
        `Wall Height: ${round(inputs.height)} ${unit.length}`,
        `Base Width: ${round(results.B)} m`,
        `Ka: ${round(results.Ka, 3)}`,
        `Total Active Pressure: ${round(results.PaTotal)} kN/m`,
        `Water Pressure: ${round(results.Pwater)} kN/m`,
        `Seismic Pressure: ${round(results.Pseismic)} kN/m`,
        `FS Overturning: ${round(results.fsOverturning)}`,
        `FS Sliding: ${round(results.fsSliding)}`,
        `qmax: ${round(results.qMax)} kPa`,
        `qmin: ${round(results.qMin)} kPa`,
        `Stem Steel: ${inputs.stemBarDia} mm @ ${results.stemSteel.spacing} mm c/c`,
        `Toe Steel: ${inputs.toeBarDia} mm @ ${results.toeSteel.spacing} mm c/c`,
        `Heel Steel: ${inputs.heelBarDia} mm @ ${results.heelSteel.spacing} mm c/c`,
        `Concrete Quantity: ${round(results.concreteVolumeTotal)} m3`,
        `Steel Quantity With Wastage: ${round(results.steelWithWastage)} kg`,
        `Excavation Quantity: ${round(results.excavationVolumeTotal)} m3`,
        `Backfill Quantity: ${round(results.backfillVolumeTotal)} m3`,
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
        'Note: This is a preliminary design report. Final structural design must be verified by a qualified structural engineer.',
        14,
        285,
        { maxWidth: 180 }
      )

      doc.save('retaining-wall-design-report.pdf')
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

  const SteelRow = ({ part, moment, dia, spacing, ast, note }) => (
    <tr className="border-b border-slate-800">
      <td className="px-4 py-4 font-semibold text-white">{part}</td>
      <td className="px-4 py-4 text-slate-300">{round(moment)} kNm/m</td>
      <td className="px-4 py-4 text-slate-300">{round(ast)} mm²/m</td>
      <td className="px-4 py-4 text-orange-300">
        {dia} mm @ {spacing} mm c/c
      </td>
      <td className="px-4 py-4 text-slate-400">{note}</td>
    </tr>
  )

  return (
    <main className="min-h-screen bg-[#050B1F] px-4 py-6 text-white md:px-8 lg:px-12">
      <section className="mx-auto max-w-7xl">
        <div className="mb-8 overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-[#08142f] p-6 shadow-2xl md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-sm font-semibold text-orange-300">
                <Ruler size={16} />
                Advanced Retaining Wall Design
              </div>

              <h1 className="text-3xl font-black tracking-tight md:text-5xl">
                Retaining Wall Design Calculator
              </h1>

              <p className="mt-3 max-w-3xl text-slate-300">
                Cantilever aur counterfort retaining wall ke liye earth pressure,
                water pressure, seismic pressure, stability checks, optimizer,
                reinforcement, quantity, BBS aur PDF report.
              </p>

              <p className="mt-2 max-w-3xl text-sm text-slate-400">
                Site engineer ke liye practical design + safe correction +
                quantity estimate ek hi tool me.
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
                onClick={() =>
                  setInputs(isMetric ? defaultInputs : imperialDefaults)
                }
                className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-bold text-slate-300 hover:border-orange-500"
              >
                <RotateCcw size={16} />
                Reset
              </button>
            </div>
          </div>
        </div>

        <div className="mb-6 rounded-3xl border border-orange-500/20 bg-orange-500/10 p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="flex items-center gap-2 text-xl font-black text-white">
                <Sparkles className="text-orange-300" size={22} />
                Auto Safe Design Optimizer
              </h2>

              <p className="mt-2 text-sm text-orange-100">
                Ye tool current soil data ke basis par safe toe, heel, stem aur
                base thickness suggest karta hai.
              </p>
            </div>

            {optimized ? (
              <button
                onClick={applyOptimizedDesign}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-500 px-6 py-4 font-black text-white shadow-lg shadow-orange-500/20 hover:bg-orange-600"
              >
                <RefreshCcw size={18} />
                Apply Optimized Design
              </button>
            ) : (
              <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm font-bold text-red-200">
                No safe auto design found. Increase SBC, reduce height/load, or
                use counterfort.
              </div>
            )}
          </div>

          {optimized && (
            <div className="mt-5 grid gap-4 md:grid-cols-5">
              <QuantityCard
                title="Suggested Base Width"
                value={`${round(optimized.B)} m`}
                subtitle="Auto safe B"
              />
              <QuantityCard
                title="Suggested Toe"
                value={`${round(optimized.toe)} m`}
                subtitle="Front projection"
              />
              <QuantityCard
                title="Suggested Heel"
                value={`${round(optimized.heel)} m`}
                subtitle="Backfill side"
              />
              <QuantityCard
                title="Suggested Stem Base"
                value={`${round(optimized.stemBaseT, 0)} mm`}
                subtitle="Base stem thickness"
              />
              <QuantityCard
                title="Suggested Base Slab"
                value={`${round(optimized.baseT, 0)} mm`}
                subtitle="Base thickness"
              />
            </div>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
              <h2 className="mb-5 flex items-center gap-2 text-xl font-black">
                <Calculator className="text-orange-400" size={22} />
                1. Wall Type & Geometry
              </h2>

              <div className="mb-5">
                <label className="mb-2 block text-sm font-semibold text-slate-200">
                  Retaining Wall Type
                  <span className="block text-xs font-normal text-slate-400">
                    Wall type select karo
                  </span>
                </label>

                <select
                  value={inputs.wallType}
                  onChange={(e) => updateInput('wallType', e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none"
                >
                  <option value="cantilever">Cantilever Retaining Wall</option>
                  <option value="counterfort">Counterfort Retaining Wall</option>
                </select>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <Field
                  label="Retained Height"
                  labelHi="Retaining height / मिट्टी की ऊंचाई"
                  name="height"
                  suffix={unit.length}
                />

                <Field
                  label="Toe Projection"
                  labelHi="Front side base length"
                  name="toe"
                  suffix={unit.length}
                />

                <Field
                  label="Heel Projection"
                  labelHi="Backfill side base length"
                  name="heel"
                  suffix={unit.length}
                />

                <Field
                  label="Stem Top Thickness"
                  labelHi="Stem top thickness"
                  name="stemTopThickness"
                  suffix={unit.thickness}
                  step="1"
                />

                <Field
                  label="Stem Base Thickness"
                  labelHi="Stem base thickness"
                  name="stemBaseThickness"
                  suffix={unit.thickness}
                  step="1"
                />

                <Field
                  label="Base Slab Thickness"
                  labelHi="Base slab thickness"
                  name="baseThickness"
                  suffix={unit.thickness}
                  step="1"
                />

                <Field
                  label="Embedment Depth"
                  labelHi="Ground ke andar depth"
                  name="embedmentDepth"
                  suffix={unit.length}
                />

                <Field
                  label="Wall Length"
                  labelHi="Quantity estimate ke liye length"
                  name="wallLength"
                  suffix={unit.length}
                />
              </div>

              {isCounterfort && (
                <div className="mt-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-5">
                  <h3 className="mb-4 text-lg font-black text-emerald-200">
                    Counterfort Wall Inputs
                  </h3>

                  <div className="grid gap-5 md:grid-cols-3">
                    <Field
                      label="Counterfort Spacing"
                      labelHi="Counterfort to counterfort distance"
                      name="counterfortSpacing"
                      suffix={unit.length}
                    />

                    <Field
                      label="Counterfort Thickness"
                      labelHi="Web thickness"
                      name="counterfortThickness"
                      suffix={unit.thickness}
                      step="1"
                    />

                    <Field
                      label="Counterfort Projection"
                      labelHi="Heel side projection"
                      name="counterfortProjection"
                      suffix={unit.length}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
              <h2 className="mb-5 text-xl font-black">
                2. Soil, Surcharge & Bearing Data
              </h2>

              <div className="grid gap-5 md:grid-cols-2">
                <Field
                  label="Soil Unit Weight"
                  labelHi="Backfill soil unit weight"
                  name="gammaSoil"
                  suffix={unit.soilUnit}
                />

                <Field
                  label="Soil Friction Angle"
                  labelHi="Angle of internal friction"
                  name="phi"
                  suffix="degree"
                />

                <Field
                  label="Surcharge Load"
                  labelHi="Road/load/building load behind wall"
                  name="surcharge"
                  suffix={unit.surcharge}
                />

                <Field
                  label="Safe Bearing Capacity"
                  labelHi="Soil SBC"
                  name="sbc"
                  suffix={unit.sbc}
                />

                <Field
                  label="Base Friction Coefficient"
                  labelHi="Concrete-soil friction factor"
                  name="friction"
                  suffix="μ"
                  step="0.01"
                />
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
              <h2 className="mb-5 flex items-center gap-2 text-xl font-black">
                <Droplets className="text-sky-400" size={22} />
                3. Drainage, Water & Seismic Pressure
              </h2>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-200">
                    Drainage Condition
                    <span className="block text-xs font-normal text-slate-400">
                      Drainage अच्छा है या poor?
                    </span>
                  </label>

                  <select
                    value={inputs.drainageCondition}
                    onChange={(e) =>
                      updateInput('drainageCondition', e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none"
                  >
                    <option value="good">Good Drainage</option>
                    <option value="poor">Poor Drainage / Water Pressure</option>
                  </select>
                </div>

                <Field
                  label="Water Height Behind Wall"
                  labelHi="Poor drainage me पानी की height"
                  name="waterHeight"
                  suffix={unit.length}
                />

                <Field
                  label="Weep Hole Horizontal Spacing"
                  labelHi="Length direction me spacing"
                  name="weepHoleHorizontalSpacing"
                  suffix={unit.length}
                />

                <Field
                  label="Weep Hole Vertical Spacing"
                  labelHi="Height direction me spacing"
                  name="weepHoleVerticalSpacing"
                  suffix={unit.length}
                />

                <Toggle
                  label="Add Seismic Pressure"
                  labelHi="Earthquake lateral pressure add kare"
                  name="seismicEnabled"
                />

                {inputs.seismicEnabled && (
                  <Field
                    label="Seismic Coefficient Ah"
                    labelHi="Preliminary horizontal seismic coefficient"
                    name="seismicCoefficient"
                    suffix="Ah"
                    step="0.01"
                  />
                )}
              </div>

              <div className="mt-5 rounded-2xl border border-sky-500/20 bg-sky-500/10 p-4 text-sm text-sky-100">
                Good drainage me water pressure avoid hota hai. Poor drainage
                case me hydrostatic pressure add hota hai. Seismic option
                preliminary pseudo-static lateral pressure ke liye hai.
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
              <h2 className="mb-5 flex items-center gap-2 text-xl font-black">
                <ShieldCheck className="text-emerald-400" size={22} />
                4. Shear Key & Passive Resistance
              </h2>

              <div className="grid gap-5 md:grid-cols-2">
                <Toggle
                  label="Add Shear Key"
                  labelHi="Sliding resistance improve karne ke liye"
                  name="shearKeyEnabled"
                />

                <Toggle
                  label="Use Passive Resistance"
                  labelHi="Front soil resistance consider kare"
                  name="passiveEnabled"
                />

                {inputs.shearKeyEnabled && (
                  <>
                    <Field
                      label="Key Depth"
                      labelHi="Shear key depth"
                      name="keyDepth"
                      suffix={unit.length}
                    />

                    <Field
                      label="Key Thickness"
                      labelHi="Shear key thickness"
                      name="keyThickness"
                      suffix={unit.thickness}
                      step="1"
                    />
                  </>
                )}

                {inputs.passiveEnabled && (
                  <Field
                    label="Passive Reduction Factor"
                    labelHi="Conservative value 0.3 to 0.5"
                    name="passiveReduction"
                    suffix="factor"
                    step="0.01"
                  />
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
              <h2 className="mb-5 text-xl font-black">
                5. RCC & Reinforcement Data
              </h2>

              <div className="grid gap-5 md:grid-cols-2">
                <Field
                  label="Concrete Unit Weight"
                  labelHi="RCC unit weight"
                  name="gammaConcrete"
                  suffix={unit.soilUnit}
                />

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
                  labelHi="Retaining wall cover"
                  name="cover"
                  suffix="mm"
                  step="1"
                />

                <Field
                  label="Stem Main Bar Dia"
                  labelHi="Vertical main steel"
                  name="stemBarDia"
                  suffix="mm"
                  step="1"
                />

                <Field
                  label="Toe Main Bar Dia"
                  labelHi="Toe slab main steel"
                  name="toeBarDia"
                  suffix="mm"
                  step="1"
                />

                <Field
                  label="Heel Main Bar Dia"
                  labelHi="Heel slab main steel"
                  name="heelBarDia"
                  suffix="mm"
                  step="1"
                />

                {isCounterfort && (
                  <Field
                    label="Counterfort Bar Dia"
                    labelHi="Counterfort web steel"
                    name="counterfortBarDia"
                    suffix="mm"
                    step="1"
                  />
                )}

                <Field
                  label="Distribution Bar Dia"
                  labelHi="Horizontal/distribution steel"
                  name="distributionBarDia"
                  suffix="mm"
                  step="1"
                />
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
              <h2 className="mb-5 text-xl font-black">
                6. Site Rate Inputs
              </h2>

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
                  label="Excavation Rate"
                  labelHi="Excavation rate per m³"
                  name="excavationRate"
                  suffix="₹/m³"
                />

                <Field
                  label="Backfill Rate"
                  labelHi="Backfilling rate per m³"
                  name="backfillRate"
                  suffix="₹/m³"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-950 p-6">
              <div className="mb-4 flex items-center justify-between gap-4">
                <h2 className="text-xl font-black">Wall Diagram</h2>

                <span
                  className={`rounded-full border px-4 py-2 text-xs font-black ${
                    results.overallSafe
                      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                      : 'border-red-500/30 bg-red-500/10 text-red-300'
                  }`}
                >
                  {results.overallSafe ? 'OVERALL SAFE' : 'REVISION NEEDED'}
                </span>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-[#071027] p-4">
                <svg viewBox="0 0 600 370" className="h-auto w-full">
                  <defs>
                    <linearGradient id="soilFill" x1="0" x2="1">
                      <stop offset="0%" stopColor="#92400e" stopOpacity="0.55" />
                      <stop offset="100%" stopColor="#451a03" stopOpacity="0.8" />
                    </linearGradient>

                    <linearGradient id="concFill" x1="0" x2="1">
                      <stop offset="0%" stopColor="#94a3b8" />
                      <stop offset="100%" stopColor="#475569" />
                    </linearGradient>
                  </defs>

                  <rect x="0" y="0" width="600" height="370" fill="#071027" />

                  <path
                    d="M290 45 L555 45 L555 288 L290 288 Z"
                    fill="url(#soilFill)"
                    stroke="#f59e0b"
                    strokeOpacity="0.35"
                  />

                  {inputs.drainageCondition === 'poor' &&
                    results.waterHeight > 0 && (
                      <rect
                        x="295"
                        y={288 - (results.waterHeight / results.H) * 243}
                        width="245"
                        height={(results.waterHeight / results.H) * 243}
                        fill="#0284c7"
                        opacity="0.28"
                      />
                    )}

                  <rect
                    x="75"
                    y="288"
                    width="410"
                    height="38"
                    rx="4"
                    fill="url(#concFill)"
                  />

                  <path
                    d="M205 78 L238 78 L255 288 L185 288 Z"
                    fill="url(#concFill)"
                  />

                  {isCounterfort && (
                    <path
                      d="M238 95 L370 288 L238 288 Z"
                      fill="#64748b"
                      opacity="0.75"
                      stroke="#cbd5e1"
                      strokeOpacity="0.45"
                    />
                  )}

                  {inputs.shearKeyEnabled && (
                    <rect
                      x="211"
                      y="326"
                      width="34"
                      height="30"
                      rx="3"
                      fill="url(#concFill)"
                    />
                  )}

                  <polygon
                    points="260,82 380,288 260,288"
                    fill="#f97316"
                    opacity="0.22"
                  />

                  <line
                    x1="260"
                    y1="262"
                    x2="350"
                    y2="262"
                    stroke="#fb923c"
                    strokeWidth="3"
                  />

                  {inputs.seismicEnabled && (
                    <line
                      x1="260"
                      y1="150"
                      x2="370"
                      y2="150"
                      stroke="#ef4444"
                      strokeWidth="3"
                      strokeDasharray="8 5"
                    />
                  )}

                  <text x="267" y="250" fill="#fb923c" fontSize="12">
                    Earth Pressure
                  </text>

                  {inputs.seismicEnabled && (
                    <text x="377" y="155" fill="#fca5a5" fontSize="12">
                      Seismic
                    </text>
                  )}

                  <text x="330" y="62" fill="#fbbf24" fontSize="13">
                    Backfill Soil
                  </text>

                  {inputs.drainageCondition === 'poor' &&
                    results.waterHeight > 0 && (
                      <text x="370" y="270" fill="#7dd3fc" fontSize="12">
                        Water Pressure
                      </text>
                    )}

                  {isCounterfort && (
                    <text x="285" y="210" fill="#e2e8f0" fontSize="12">
                      Counterfort
                    </text>
                  )}

                  <line x1="75" y1="344" x2="485" y2="344" stroke="#38bdf8" />

                  <text x="235" y="361" fill="#93c5fd" fontSize="13">
                    B = {round(results.B)} m
                  </text>

                  <text
                    x="30"
                    y="195"
                    fill="#cbd5e1"
                    fontSize="13"
                    transform="rotate(-90 30 195)"
                  >
                    H = {round(results.H)} m
                  </text>

                  <text x="85" y="280" fill="#e2e8f0" fontSize="12">
                    Toe
                  </text>

                  <text x="350" y="280" fill="#e2e8f0" fontSize="12">
                    Heel
                  </text>
                </svg>
              </div>

              <button
                onClick={downloadPdf}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 px-5 py-4 font-black text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600"
              >
                <Download size={18} />
                Download Site Report PDF
              </button>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
              <h2 className="mb-4 text-xl font-black">Safety Summary</h2>

              <div className="grid gap-4 sm:grid-cols-2">
                <ResultCard
                  title="Total Active Pressure"
                  value={`${round(results.PaTotal)} kN/m`}
                  subtitle={`Ka = ${round(results.Ka, 3)}`}
                />

                <ResultCard
                  title="Seismic Pressure"
                  value={`${round(results.Pseismic)} kN/m`}
                  subtitle={
                    inputs.seismicEnabled
                      ? `Ah = ${inputs.seismicCoefficient}`
                      : 'Seismic OFF'
                  }
                />

                <ResultCard
                  title="Water Pressure"
                  value={`${round(results.Pwater)} kN/m`}
                  subtitle={
                    inputs.drainageCondition === 'good'
                      ? 'Good drainage selected'
                      : `Water height = ${round(results.waterHeight)} m`
                  }
                />

                <ResultCard
                  title="Overturning FS"
                  value={round(results.fsOverturning)}
                  subtitle="Required ≥ 1.50"
                  pass={results.checks.overturning}
                />

                <ResultCard
                  title="Sliding FS"
                  value={round(results.fsSliding)}
                  subtitle={`Passive resistance = ${round(
                    results.passiveResistance
                  )} kN/m`}
                  pass={results.checks.sliding}
                />

                <ResultCard
                  title="Bearing qmax"
                  value={`${round(results.qMax)} kPa`}
                  subtitle={`SBC = ${round(results.m.sbc)} kPa`}
                  pass={results.checks.bearing}
                />

                <ResultCard
                  title="Minimum Pressure"
                  value={`${round(results.qMin)} kPa`}
                  subtitle="qmin should be positive"
                  pass={results.checks.noTension}
                />

                <ResultCard
                  title="Eccentricity"
                  value={`${round(results.e, 3)} m`}
                  subtitle={`Limit B/6 = ${round(results.B / 6, 3)} m`}
                  pass={results.checks.eccentricity}
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
                <p>✓ Soil SBC report verify karo.</p>
                <p>✓ Backfill soil ka φ angle aur unit weight confirm karo.</p>
                <p>✓ Weep holes aur filter media provide karo.</p>
                <p>✓ Water pressure avoid karne ke liye drainage pipe lagao.</p>
                <p>✓ Stem main steel soil side face par place karo.</p>
                <p>✓ Heel main steel top face par aur toe main steel bottom face par check karo.</p>
                <p>✓ Development length, lap length aur cover site par maintain karo.</p>
                <p>✓ Seismic pressure final design me local code ke according verify karo.</p>
                {isCounterfort && (
                  <p>✓ Counterfort spacing, web reinforcement aur construction joint detailing check karo.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
          <h2 className="mb-5 flex items-center gap-2 text-xl font-black">
            <Hammer className="text-orange-400" size={22} />
            RCC Reinforcement Design Summary
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] overflow-hidden rounded-2xl text-left text-sm">
              <thead className="bg-slate-950 text-slate-300">
                <tr>
                  <th className="px-4 py-4">Member</th>
                  <th className="px-4 py-4">Ultimate Moment</th>
                  <th className="px-4 py-4">Ast Required</th>
                  <th className="px-4 py-4">Recommended Steel</th>
                  <th className="px-4 py-4">Site Note</th>
                </tr>
              </thead>

              <tbody>
                <SteelRow
                  part="Stem Main Steel"
                  moment={results.MstemUltimate}
                  dia={inputs.stemBarDia}
                  spacing={results.stemSteel.spacing}
                  ast={results.stemSteel.astReq}
                  note={isCounterfort ? 'Panel action between counterforts' : 'Soil side face'}
                />

                <SteelRow
                  part="Toe Slab Steel"
                  moment={results.MtoeUltimate}
                  dia={inputs.toeBarDia}
                  spacing={results.toeSteel.spacing}
                  ast={results.toeSteel.astReq}
                  note="Bottom face"
                />

                <SteelRow
                  part="Heel Slab Steel"
                  moment={results.MheelUltimate}
                  dia={inputs.heelBarDia}
                  spacing={results.heelSteel.spacing}
                  ast={results.heelSteel.astReq}
                  note="Top face"
                />

                {isCounterfort && (
                  <SteelRow
                    part="Counterfort Web Steel"
                    moment={results.McounterfortUltimate}
                    dia={inputs.counterfortBarDia}
                    spacing={results.counterfortSteel.spacing}
                    ast={results.counterfortSteel.astReq}
                    note="Inclined/web reinforcement"
                  />
                )}

                <tr className="border-b border-slate-800">
                  <td className="px-4 py-4 font-semibold text-white">
                    Distribution Steel
                  </td>
                  <td className="px-4 py-4 text-slate-300">Minimum steel</td>
                  <td className="px-4 py-4 text-slate-300">0.12%</td>
                  <td className="px-4 py-4 text-orange-300">
                    {inputs.distributionBarDia} mm @{' '}
                    {results.distributionSpacing} mm c/c
                  </td>
                  <td className="px-4 py-4 text-slate-400">
                    Horizontal and temperature steel
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-950 p-4 text-sm text-slate-300">
            <strong className="text-white">Placement hint:</strong> Stem main
            reinforcement generally soil side face par critical hota hai.
            Counterfort wall me stem panel action aur counterfort web tension
            reinforcement separately verify karna zaroori hai.
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
          <h2 className="mb-5 text-xl font-black">
            Quantity Estimate & Site Cost Summary
          </h2>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <QuantityCard
              title="Concrete Quantity"
              value={`${round(results.concreteVolumeTotal)} m³`}
              subtitle={`${round(results.concreteVolumePerM)} m³ per meter length`}
            />

            <QuantityCard
              title="Steel Quantity"
              value={`${round(results.steelWithWastage)} kg`}
              subtitle="Includes approx 10% wastage"
            />

            <QuantityCard
              title="Excavation Quantity"
              value={`${round(results.excavationVolumeTotal)} m³`}
              subtitle="Approx trench excavation"
            />

            <QuantityCard
              title="Backfill Quantity"
              value={`${round(results.backfillVolumeTotal)} m³`}
              subtitle="Behind wall backfilling"
            />

            <QuantityCard
              title="Shuttering Area"
              value={`${round(results.shutteringAreaTotal)} m²`}
              subtitle="Approx formwork area"
            />

            <QuantityCard
              title="Weep Holes"
              value={`${results.totalWeepHoles} Nos`}
              subtitle={`${results.weepRows} rows × ${results.weepColumns} columns`}
            />

            <QuantityCard
              title="Steel per Meter"
              value={`${round(results.steelKgPerM)} kg/m`}
              subtitle="Approx BBS based quantity"
            />

            <QuantityCard
              title="Estimated Cost"
              value={money(results.estimatedCost)}
              subtitle="Concrete + steel + excavation + backfill"
            />

            {isCounterfort && (
              <>
                <QuantityCard
                  title="Counterfort Count"
                  value={`${results.counterfortsCount} Nos`}
                  subtitle="Based on wall length and spacing"
                />

                <QuantityCard
                  title="Counterfort Steel"
                  value={`${round(results.counterfortSteelKgTotal)} kg`}
                  subtitle="Approx additional steel"
                />
              </>
            )}
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
          <h2 className="mb-5 text-xl font-black">
            BBS Style Approx Bar Summary
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] overflow-hidden rounded-2xl text-left text-sm">
              <thead className="bg-slate-950 text-slate-300">
                <tr>
                  <th className="px-4 py-4">Bar Type</th>
                  <th className="px-4 py-4">Dia</th>
                  <th className="px-4 py-4">Spacing</th>
                  <th className="px-4 py-4">Approx Steel</th>
                  <th className="px-4 py-4">Site Note</th>
                </tr>
              </thead>

              <tbody>
                <tr className="border-b border-slate-800">
                  <td className="px-4 py-4 font-semibold text-white">
                    Stem Main Vertical Bars
                  </td>
                  <td className="px-4 py-4 text-slate-300">
                    {inputs.stemBarDia} mm
                  </td>
                  <td className="px-4 py-4 text-orange-300">
                    {results.stemSteel.spacing} mm c/c
                  </td>
                  <td className="px-4 py-4 text-slate-300">
                    {round(results.stemSteelKgPerM)} kg/m
                  </td>
                  <td className="px-4 py-4 text-slate-400">
                    Soil side face
                  </td>
                </tr>

                <tr className="border-b border-slate-800">
                  <td className="px-4 py-4 font-semibold text-white">
                    Toe Main Bars
                  </td>
                  <td className="px-4 py-4 text-slate-300">
                    {inputs.toeBarDia} mm
                  </td>
                  <td className="px-4 py-4 text-orange-300">
                    {results.toeSteel.spacing} mm c/c
                  </td>
                  <td className="px-4 py-4 text-slate-300">
                    {round(results.toeSteelKgPerM)} kg/m
                  </td>
                  <td className="px-4 py-4 text-slate-400">Bottom face</td>
                </tr>

                <tr className="border-b border-slate-800">
                  <td className="px-4 py-4 font-semibold text-white">
                    Heel Main Bars
                  </td>
                  <td className="px-4 py-4 text-slate-300">
                    {inputs.heelBarDia} mm
                  </td>
                  <td className="px-4 py-4 text-orange-300">
                    {results.heelSteel.spacing} mm c/c
                  </td>
                  <td className="px-4 py-4 text-slate-300">
                    {round(results.heelSteelKgPerM)} kg/m
                  </td>
                  <td className="px-4 py-4 text-slate-400">Top face</td>
                </tr>

                {isCounterfort && (
                  <tr className="border-b border-slate-800">
                    <td className="px-4 py-4 font-semibold text-white">
                      Counterfort Bars
                    </td>
                    <td className="px-4 py-4 text-slate-300">
                      {inputs.counterfortBarDia} mm
                    </td>
                    <td className="px-4 py-4 text-orange-300">
                      {results.counterfortSteel.spacing} mm c/c
                    </td>
                    <td className="px-4 py-4 text-slate-300">
                      {round(results.counterfortSteelKgTotal)} kg total
                    </td>
                    <td className="px-4 py-4 text-slate-400">
                      Web and tension steel
                    </td>
                  </tr>
                )}

                <tr className="border-b border-slate-800">
                  <td className="px-4 py-4 font-semibold text-white">
                    Distribution Bars
                  </td>
                  <td className="px-4 py-4 text-slate-300">
                    {inputs.distributionBarDia} mm
                  </td>
                  <td className="px-4 py-4 text-orange-300">
                    {results.distributionSpacing} mm c/c
                  </td>
                  <td className="px-4 py-4 text-slate-300">
                    {round(
                      results.stemDistributionKgPerM +
                        results.baseDistributionKgPerM
                    )}{' '}
                    kg/m
                  </td>
                  <td className="px-4 py-4 text-slate-400">
                    Horizontal and temperature steel
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-orange-500/20 bg-orange-500/10 p-6 text-sm leading-7 text-orange-100">
          <strong>Important:</strong> Ye retaining wall tool preliminary design,
          checking, quantity aur site planning ke liye hai. Final design me soil
          report, drainage detail, seismic load, water pressure, crack control,
          development length, construction joint aur local code requirements
          structural engineer se verify karna zaroori hai.
        </div>
      </section>
    </main>
  )
}
