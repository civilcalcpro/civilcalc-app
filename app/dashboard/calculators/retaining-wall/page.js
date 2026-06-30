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
  RotateCcw,
  Ruler,
  ShieldCheck,
} from 'lucide-react'

const defaultInputs = {
  unitSystem: 'metric',

  height: 3,
  toe: 0.9,
  heel: 1.4,
  stemTopThickness: 200,
  stemBaseThickness: 300,
  baseThickness: 350,
  embedmentDepth: 0.6,

  gammaSoil: 18,
  phi: 30,
  surcharge: 10,
  sbc: 180,
  friction: 0.5,

  drainageCondition: 'good',
  waterHeight: 0,
  gammaWater: 9.81,

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

      fck: input.fck,
      fy: input.fy,
      cover: input.cover,
      stemBarDia: input.stemBarDia,
      toeBarDia: input.toeBarDia,
      heelBarDia: input.heelBarDia,
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

    fck: input.fck,
    fy: input.fy,
    cover: input.cover,
    stemBarDia: input.stemBarDia,
    toeBarDia: input.toeBarDia,
    heelBarDia: input.heelBarDia,
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

export default function RetainingWallDesignPage() {
  const [inputs, setInputs] = useState(defaultInputs)

  const isMetric = inputs.unitSystem === 'metric'

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

    if (key === 'drainageCondition') {
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

  const results = useMemo(() => {
    const m = convertToMetric(inputs)

    const H = Math.max(m.H, 0.1)
    const toe = Math.max(m.toe, 0)
    const heel = Math.max(m.heel, 0)
    const stemTopT = Math.max(m.stemTopT / 1000, 0.05)
    const stemBaseT = Math.max(m.stemBaseT / 1000, 0.05)
    const baseT = Math.max(m.baseT / 1000, 0.05)
    const avgStemT = (stemTopT + stemBaseT) / 2
    const B = toe + stemBaseT + heel

    const phiRad = (m.phi * Math.PI) / 180
    const sinPhi = Math.sin(phiRad)
    const Ka = (1 - sinPhi) / (1 + sinPhi)
    const Kp = (1 + sinPhi) / (1 - sinPhi)

    const PaTri = 0.5 * Ka * m.gammaSoil * H * H
    const PaSurcharge = Ka * m.surcharge * H

    const waterHeight =
      inputs.drainageCondition === 'poor'
        ? Math.min(Math.max(m.waterHeight, 0), H)
        : 0

    const Pwater = 0.5 * m.gammaWater * waterHeight * waterHeight

    const PaTotal = PaTri + PaSurcharge + Pwater

    const Mo =
      PaTri * (baseT + H / 3) +
      PaSurcharge * (baseT + H / 2) +
      Pwater * (baseT + waterHeight / 3)

    const baseWeight = m.gammaConcrete * B * baseT
    const stemWeight = m.gammaConcrete * avgStemT * H
    const soilHeelWeight = m.gammaSoil * heel * H
    const surchargeHeelWeight = m.surcharge * heel

    const keyDepth = inputs.shearKeyEnabled ? Math.max(m.keyDepth, 0) : 0
    const keyT = inputs.shearKeyEnabled ? Math.max(m.keyThickness / 1000, 0) : 0
    const keyWeight = inputs.shearKeyEnabled
      ? m.gammaConcrete * keyDepth * keyT
      : 0

    const xBase = B / 2
    const xStem = toe + stemBaseT / 2
    const xHeel = toe + stemBaseT + heel / 2
    const xKey = toe + stemBaseT / 2

    const V =
      baseWeight +
      stemWeight +
      soilHeelWeight +
      surchargeHeelWeight +
      keyWeight

    const Mr =
      baseWeight * xBase +
      stemWeight * xStem +
      soilHeelWeight * xHeel +
      surchargeHeelWeight * xHeel +
      keyWeight * xKey

    const passiveDepth = inputs.passiveEnabled
      ? Math.max(m.embedment + keyDepth, 0)
      : 0

    const passiveResistance =
      inputs.passiveEnabled && passiveDepth > 0
        ? 0.5 * Kp * m.gammaSoil * passiveDepth * passiveDepth * m.passiveReduction
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

    const MstemService =
      PaTri * (H / 3) +
      PaSurcharge * (H / 2) +
      Pwater * (waterHeight / 3)

    const loadFactor = 1.5

    const MstemUltimate = MstemService * loadFactor
    const MtoeUltimate = MtoeService * loadFactor
    const MheelUltimate = MheelService * loadFactor

    const steelDesign = (Mu, d, D, dia) => {
      const effectiveD = Math.max(d, 50)
      const astCalc = (Mu * 1000000) / (0.87 * m.fy * 0.9 * effectiveD)
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

    const dStem = m.stemBaseT - m.cover - m.stemBarDia / 2
    const dBaseToe = m.baseT - m.cover - m.toeBarDia / 2
    const dBaseHeel = m.baseT - m.cover - m.heelBarDia / 2

    const stemSteel = steelDesign(
      MstemUltimate,
      dStem,
      m.stemBaseT,
      m.stemBarDia
    )

    const toeSteel = steelDesign(
      MtoeUltimate,
      dBaseToe,
      m.baseT,
      m.toeBarDia
    )

    const heelSteel = steelDesign(
      MheelUltimate,
      dBaseHeel,
      m.baseT,
      m.heelBarDia
    )

    const distributionAstStem = 0.0012 * 1000 * m.stemBaseT
    const distributionSpacingRaw =
      (barArea(m.distributionBarDia) * 1000) / distributionAstStem

    const distributionSpacing = Math.max(
      100,
      Math.min(300, Math.floor(distributionSpacingRaw / 25) * 25)
    )

    const concreteVolumePerM =
      B * baseT + avgStemT * H + (inputs.shearKeyEnabled ? keyT * keyDepth : 0)

    const concreteVolumeTotal = concreteVolumePerM * m.wallLength

    const excavationDepth = baseT + m.embedment
    const workingSpace = 0.45
    const excavationVolumePerM = (B + workingSpace * 2) * excavationDepth
    const excavationVolumeTotal = excavationVolumePerM * m.wallLength

    const backfillVolumePerM = heel * H
    const backfillVolumeTotal = backfillVolumePerM * m.wallLength

    const shutteringAreaPerM = 2 * H + 2 * baseT + H * 0.15
    const shutteringAreaTotal = shutteringAreaPerM * m.wallLength

    const stemBarsPerM = 1000 / stemSteel.spacing
    const toeBarsPerM = 1000 / toeSteel.spacing
    const heelBarsPerM = 1000 / heelSteel.spacing

    const stemMainLength = H + baseT + 0.45
    const toeBarLength = toe + stemBaseT + 0.3
    const heelBarLength = heel + stemBaseT + 0.3

    const stemSteelKgPerM =
      stemBarsPerM * stemMainLength * barWeight(m.stemBarDia)

    const toeSteelKgPerM =
      toeBarsPerM * toeBarLength * barWeight(m.toeBarDia)

    const heelSteelKgPerM =
      heelBarsPerM * heelBarLength * barWeight(m.heelBarDia)

    const horizontalBarsInStem =
      Math.ceil(H / (distributionSpacing / 1000)) + 1

    const stemDistributionKgPerM =
      horizontalBarsInStem * 1 * barWeight(m.distributionBarDia)

    const baseDistributionKgPerM =
      (1000 / 250) * B * barWeight(m.distributionBarDia)

    const steelKgPerM =
      stemSteelKgPerM +
      toeSteelKgPerM +
      heelSteelKgPerM +
      stemDistributionKgPerM +
      baseDistributionKgPerM

    const steelKgTotal = steelKgPerM * m.wallLength
    const steelWithWastage = steelKgTotal * 1.1

    const weepRows = Math.max(1, Math.floor(H / Math.max(m.weepV, 0.1)))
    const weepColumns = Math.ceil(m.wallLength / Math.max(m.weepH, 0.1))
    const totalWeepHoles = weepRows * weepColumns

    const concreteCost = concreteVolumeTotal * m.concreteRate
    const steelCost = steelWithWastage * m.steelRate
    const excavationCost = excavationVolumeTotal * m.excavationRate
    const backfillCost = backfillVolumeTotal * m.backfillRate
    const estimatedCost =
      concreteCost + steelCost + excavationCost + backfillCost

    const checks = {
      overturning: fsOverturning >= 1.5,
      sliding: fsSliding >= 1.5,
      eccentricity: Math.abs(e) <= B / 6,
      bearing: qMax <= m.sbc,
      noTension: qMin >= 0,
      drainage: inputs.drainageCondition === 'good' || waterHeight === 0,
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

    if (inputs.drainageCondition === 'poor' && waterHeight > 0) {
      recommendations.push(
        'Poor drainage me hydrostatic pressure dangerous hota hai. Weep holes, filter media aur drainage pipe compulsory rakho.'
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
      Ka,
      Kp,
      PaTri,
      PaSurcharge,
      Pwater,
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
      MtoeService,
      MheelService,
      MstemUltimate,
      MtoeUltimate,
      MheelUltimate,
      stemSteel,
      toeSteel,
      heelSteel,
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
  }, [inputs])

  const downloadPdf = async () => {
    try {
      const { default: jsPDF } = await import('jspdf')
      const doc = new jsPDF()

      doc.setFontSize(16)
      doc.text('Retaining Wall Design Report', 14, 18)

      doc.setFontSize(10)
      doc.text('CivilCalc Pro - Site Engineer Practical Summary', 14, 26)

      const lines = [
        `Wall Height: ${round(inputs.height)} ${unit.length}`,
        `Base Width: ${round(results.B)} m`,
        `Ka: ${round(results.Ka, 3)}`,
        `Total Active Pressure: ${round(results.PaTotal)} kN/m`,
        `Water Pressure: ${round(results.Pwater)} kN/m`,
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
        'Note: This is a preliminary calculation report. Final structural design must be verified by a qualified structural engineer.',
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
        <span className="flex min-w-[78px] items-center justify-center border-l border-slate-700 bg-slate-900 px-3 text-xs text-slate-300">
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

  const SteelRow = ({ part, moment, dia, spacing, ast }) => (
    <tr className="border-b border-slate-800">
      <td className="px-4 py-4 font-semibold text-white">{part}</td>
      <td className="px-4 py-4 text-slate-300">{round(moment)} kNm/m</td>
      <td className="px-4 py-4 text-slate-300">{round(ast)} mm²/m</td>
      <td className="px-4 py-4 text-orange-300">
        {dia} mm @ {spacing} mm c/c
      </td>
    </tr>
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
                Site Engineer Retaining Wall Tool
              </div>

              <h1 className="text-3xl font-black tracking-tight md:text-5xl">
                Retaining Wall Design Calculator
              </h1>

              <p className="mt-3 max-w-3xl text-slate-300">
                RCC cantilever retaining wall ka stability check, water pressure,
                shear key, steel design, quantity estimate, site checklist aur
                PDF report ek hi tool me.
              </p>

              <p className="mt-2 max-w-3xl text-sm text-slate-400">
                Site engineer ke liye practical retaining wall design, material
                quantity, reinforcement spacing aur construction guidance.
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

        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
              <h2 className="mb-5 flex items-center gap-2 text-xl font-black">
                <Calculator className="text-orange-400" size={22} />
                1. Wall Geometry
              </h2>

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
                3. Drainage & Water Pressure
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
              </div>

              <div className="mt-5 rounded-2xl border border-sky-500/20 bg-sky-500/10 p-4 text-sm text-sky-100">
                Good drainage me water pressure avoid hota hai. Poor drainage
                case me hydrostatic pressure add kiya gaya hai, jo retaining wall
                ke liye dangerous ho sakta hai.
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
                <svg viewBox="0 0 560 350" className="h-auto w-full">
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

                  <rect x="0" y="0" width="560" height="350" fill="#071027" />

                  <path
                    d="M270 45 L520 45 L520 275 L270 275 Z"
                    fill="url(#soilFill)"
                    stroke="#f59e0b"
                    strokeOpacity="0.35"
                  />

                  {inputs.drainageCondition === 'poor' && results.waterHeight > 0 && (
                    <rect
                      x="275"
                      y={275 - (results.waterHeight / results.H) * 230}
                      width="235"
                      height={(results.waterHeight / results.H) * 230}
                      fill="#0284c7"
                      opacity="0.28"
                    />
                  )}

                  <rect
                    x="70"
                    y="275"
                    width="385"
                    height="35"
                    rx="4"
                    fill="url(#concFill)"
                  />

                  <path
                    d="M190 75 L220 75 L235 275 L175 275 Z"
                    fill="url(#concFill)"
                  />

                  {inputs.shearKeyEnabled && (
                    <rect
                      x="198"
                      y="310"
                      width="30"
                      height="28"
                      rx="3"
                      fill="url(#concFill)"
                    />
                  )}

                  <polygon
                    points="238,80 350,275 238,275"
                    fill="#f97316"
                    opacity="0.22"
                  />

                  <line
                    x1="238"
                    y1="250"
                    x2="325"
                    y2="250"
                    stroke="#fb923c"
                    strokeWidth="3"
                  />

                  <text x="245" y="238" fill="#fb923c" fontSize="12">
                    Earth Pressure
                  </text>

                  <text x="305" y="60" fill="#fbbf24" fontSize="13">
                    Backfill Soil
                  </text>

                  {inputs.drainageCondition === 'poor' && results.waterHeight > 0 && (
                    <text x="335" y="255" fill="#7dd3fc" fontSize="12">
                      Water Pressure
                    </text>
                  )}

                  <line x1="70" y1="325" x2="455" y2="325" stroke="#38bdf8" />

                  <text x="215" y="342" fill="#93c5fd" fontSize="13">
                    B = {round(results.B)} m
                  </text>

                  <text
                    x="28"
                    y="185"
                    fill="#cbd5e1"
                    fontSize="13"
                    transform="rotate(-90 28 185)"
                  >
                    H = {round(results.H)} m
                  </text>

                  <text x="80" y="267" fill="#e2e8f0" fontSize="12">
                    Toe
                  </text>

                  <text x="325" y="267" fill="#e2e8f0" fontSize="12">
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

                <ResultCard
                  title="Base Width"
                  value={`${round(results.B)} m`}
                  subtitle="Toe + Stem + Heel"
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
            <table className="w-full min-w-[760px] overflow-hidden rounded-2xl text-left text-sm">
              <thead className="bg-slate-950 text-slate-300">
                <tr>
                  <th className="px-4 py-4">Member</th>
                  <th className="px-4 py-4">Ultimate Moment</th>
                  <th className="px-4 py-4">Ast Required</th>
                  <th className="px-4 py-4">Recommended Steel</th>
                </tr>
              </thead>

              <tbody>
                <SteelRow
                  part="Stem Main Steel"
                  moment={results.MstemUltimate}
                  dia={inputs.stemBarDia}
                  spacing={results.stemSteel.spacing}
                  ast={results.stemSteel.astReq}
                />

                <SteelRow
                  part="Toe Slab Steel"
                  moment={results.MtoeUltimate}
                  dia={inputs.toeBarDia}
                  spacing={results.toeSteel.spacing}
                  ast={results.toeSteel.astReq}
                />

                <SteelRow
                  part="Heel Slab Steel"
                  moment={results.MheelUltimate}
                  dia={inputs.heelBarDia}
                  spacing={results.heelSteel.spacing}
                  ast={results.heelSteel.astReq}
                />

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
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-950 p-4 text-sm text-slate-300">
            <strong className="text-white">Placement hint:</strong> Stem main
            reinforcement generally soil side face par critical hota hai. Heel
            slab main steel top face par aur toe slab main steel bottom face par
            provide kiya jata hai. Final detailing structural engineer verify
            kare.
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
              subtitle={`Includes approx 10% wastage`}
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
              value={`₹${round(results.estimatedCost, 0)}`}
              subtitle="Concrete + steel + excavation + backfill"
            />
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
          <h2 className="mb-5 text-xl font-black">
            BBS Style Approx Bar Summary
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] overflow-hidden rounded-2xl text-left text-sm">
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
                  <td className="px-4 py-4 text-slate-400">
                    Bottom face
                  </td>
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
                  <td className="px-4 py-4 text-slate-400">
                    Top face
                  </td>
                </tr>

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
                    Horizontal & temperature steel
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-orange-500/20 bg-orange-500/10 p-6 text-sm leading-7 text-orange-100">
          <strong>Important:</strong> Ye retaining wall tool site engineer ke
          preliminary design, checking, quantity aur site planning ke liye hai.
          Final design me soil report, drainage detail, seismic load, water
          pressure, crack control, development length, construction joint aur
          local code requirements verify karna zaroori hai.
        </div>
      </section>
    </main>
  )
}
