'use client'

import { useMemo, useState } from 'react'
import {
  AlertTriangle,
  Calculator,
  CheckCircle2,
  Download,
  RotateCcw,
  Ruler,
} from 'lucide-react'

const defaultInputs = {
  unitSystem: 'metric',

  height: 3,
  toe: 0.9,
  heel: 1.4,
  stemThickness: 300,
  baseThickness: 350,

  gammaSoil: 18,
  phi: 30,
  surcharge: 10,
  sbc: 180,
  friction: 0.5,

  gammaConcrete: 25,
  fck: 25,
  fy: 500,
  cover: 50,
  barDia: 12,
}

const imperialDefaults = {
  unitSystem: 'imperial',

  height: 10,
  toe: 3,
  heel: 5,
  stemThickness: 12,
  baseThickness: 14,

  gammaSoil: 115,
  phi: 30,
  surcharge: 200,
  sbc: 3750,
  friction: 0.5,

  gammaConcrete: 150,
  fck: 25,
  fy: 500,
  cover: 50,
  barDia: 12,
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

function convertToMetric(input) {
  if (input.unitSystem === 'imperial') {
    return {
      H: input.height * 0.3048,
      toe: input.toe * 0.3048,
      heel: input.heel * 0.3048,
      stemT: input.stemThickness * 25.4,
      baseT: input.baseThickness * 25.4,
      gammaSoil: input.gammaSoil * 0.157087,
      surcharge: input.surcharge * 0.0478803,
      sbc: input.sbc * 0.0478803,
      gammaConcrete: input.gammaConcrete * 0.157087,
      phi: input.phi,
      friction: input.friction,
      fck: input.fck,
      fy: input.fy,
      cover: input.cover,
      barDia: input.barDia,
    }
  }

  return {
    H: input.height,
    toe: input.toe,
    heel: input.heel,
    stemT: input.stemThickness,
    baseT: input.baseThickness,
    gammaSoil: input.gammaSoil,
    surcharge: input.surcharge,
    sbc: input.sbc,
    gammaConcrete: input.gammaConcrete,
    phi: input.phi,
    friction: input.friction,
    fck: input.fck,
    fy: input.fy,
    cover: input.cover,
    barDia: input.barDia,
  }
}

function getStatus(pass) {
  return pass
    ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
    : 'bg-red-500/10 text-red-300 border-red-500/30'
}

function statusText(pass) {
  return pass ? 'SAFE' : 'CHECK'
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
    const stemT = Math.max(m.stemT / 1000, 0.05)
    const baseT = Math.max(m.baseT / 1000, 0.05)

    const B = toe + stemT + heel

    const phiRad = (m.phi * Math.PI) / 180
    const sinPhi = Math.sin(phiRad)
    const Ka = (1 - sinPhi) / (1 + sinPhi)

    const PaTri = 0.5 * Ka * m.gammaSoil * H * H
    const PaSurcharge = Ka * m.surcharge * H
    const Pa = PaTri + PaSurcharge

    const Mo =
      PaTri * (baseT + H / 3) +
      PaSurcharge * (baseT + H / 2)

    const baseWeight = m.gammaConcrete * B * baseT
    const stemWeight = m.gammaConcrete * stemT * H
    const soilHeelWeight = m.gammaSoil * heel * H
    const surchargeHeelWeight = m.surcharge * heel

    const xBase = B / 2
    const xStem = toe + stemT / 2
    const xHeel = toe + stemT + heel / 2

    const V =
      baseWeight +
      stemWeight +
      soilHeelWeight +
      surchargeHeelWeight

    const Mr =
      baseWeight * xBase +
      stemWeight * xStem +
      soilHeelWeight * xHeel +
      surchargeHeelWeight * xHeel

    const netMoment = Mr - Mo
    const xResultant = netMoment / V
    const e = B / 2 - xResultant

    const fsOverturning = Mr / Mo
    const fsSliding = (m.friction * V) / Pa

    const qAvg = V / B
    const qMax = qAvg * (1 + (6 * Math.abs(e)) / B)
    const qMin = qAvg * (1 - (6 * Math.abs(e)) / B)

    const qAt = (x) => {
      return qAvg * (1 + ((6 * e) / B) * (1 - (2 * x) / B))
    }

    const qToeAvg = (qAt(0) + qAt(toe)) / 2
    const toeNetPressure = Math.max(qToeAvg - m.gammaConcrete * baseT, 0)
    const MtoeService = toeNetPressure * toe * toe / 2

    const heelStart = toe + stemT
    const qHeelAvg = (qAt(heelStart) + qAt(B)) / 2
    const heelDownPressure =
      m.gammaConcrete * baseT + m.gammaSoil * H + m.surcharge
    const MheelService = Math.abs((heelDownPressure - qHeelAvg) * heel * heel / 2)

    const MstemService =
      PaTri * (H / 3) +
      PaSurcharge * (H / 2)

    const loadFactor = 1.5

    const MstemUltimate = MstemService * loadFactor
    const MtoeUltimate = MtoeService * loadFactor
    const MheelUltimate = MheelService * loadFactor

    const dStem = Math.max(m.stemT - m.cover - m.barDia / 2, 50)
    const dBase = Math.max(m.baseT - m.cover - m.barDia / 2, 50)

    const steelDesign = (Mu, d, D) => {
      const astCalc = (Mu * 1000000) / (0.87 * m.fy * 0.9 * d)
      const astMin = 0.0012 * 1000 * D
      const astReq = Math.max(astCalc, astMin)
      const spacingRaw = (barArea(m.barDia) * 1000) / astReq
      const maxSpacing = Math.min(3 * d, 300)
      const spacing = Math.max(
        75,
        Math.min(maxSpacing, Math.floor(spacingRaw / 25) * 25)
      )

      return {
        astCalc,
        astMin,
        astReq,
        spacing,
        spacingRaw,
      }
    }

    const stemSteel = steelDesign(MstemUltimate, dStem, m.stemT)
    const toeSteel = steelDesign(MtoeUltimate, dBase, m.baseT)
    const heelSteel = steelDesign(MheelUltimate, dBase, m.baseT)

    const checks = {
      overturning: fsOverturning >= 1.5,
      sliding: fsSliding >= 1.5,
      eccentricity: Math.abs(e) <= B / 6,
      bearing: qMax <= m.sbc,
      noTension: qMin >= 0,
    }

    const passCount = Object.values(checks).filter(Boolean).length
    const overallSafe = passCount === Object.values(checks).length

    return {
      m,
      H,
      toe,
      heel,
      stemT,
      baseT,
      B,
      Ka,
      PaTri,
      PaSurcharge,
      Pa,
      Mo,
      Mr,
      V,
      e,
      xResultant,
      fsOverturning,
      fsSliding,
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
      checks,
      overallSafe,
      passCount,
    }
  }, [inputs])

  const downloadPdf = async () => {
    try {
      const { default: jsPDF } = await import('jspdf')
      const doc = new jsPDF()

      doc.setFontSize(16)
      doc.text('Retaining Wall Design Summary', 14, 18)

      doc.setFontSize(10)
      doc.text('CivilCalc Pro - Preliminary Cantilever Retaining Wall Check', 14, 26)

      const lines = [
        `Wall Height: ${round(inputs.height)} ${unit.length}`,
        `Base Width: ${round(results.B)} m`,
        `Ka: ${round(results.Ka, 3)}`,
        `Active Earth Pressure: ${round(results.Pa)} kN/m`,
        `FS Against Overturning: ${round(results.fsOverturning)}`,
        `FS Against Sliding: ${round(results.fsSliding)}`,
        `Eccentricity: ${round(results.e, 3)} m`,
        `Bearing qmax: ${round(results.qMax)} kPa`,
        `Bearing qmin: ${round(results.qMin)} kPa`,
        `Stem Mu: ${round(results.MstemUltimate)} kNm/m`,
        `Toe Mu: ${round(results.MtoeUltimate)} kNm/m`,
        `Heel Mu: ${round(results.MheelUltimate)} kNm/m`,
        `Stem Steel: ${round(results.stemSteel.astReq)} mm2/m, ${inputs.barDia} mm @ ${results.stemSteel.spacing} mm c/c`,
        `Toe Steel: ${round(results.toeSteel.astReq)} mm2/m, ${inputs.barDia} mm @ ${results.toeSteel.spacing} mm c/c`,
        `Heel Steel: ${round(results.heelSteel.astReq)} mm2/m, ${inputs.barDia} mm @ ${results.heelSteel.spacing} mm c/c`,
        `Overall Status: ${results.overallSafe ? 'SAFE' : 'NEEDS REVISION'}`,
      ]

      let y = 38
      lines.forEach((line) => {
        doc.text(line, 14, y)
        y += 8
      })

      doc.setFontSize(9)
      doc.text(
        'Note: This is a preliminary calculation tool. Final design must be verified by a licensed structural engineer.',
        14,
        y + 8,
        { maxWidth: 180 }
      )

      doc.save('retaining-wall-design-summary.pdf')
    } catch (error) {
      alert('PDF export failed. Please check if jspdf is installed.')
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
        <span className="flex min-w-[72px] items-center justify-center border-l border-slate-700 bg-slate-900 px-3 text-xs text-slate-300">
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
          <span className={`rounded-full border px-3 py-1 text-xs font-bold ${getStatus(pass)}`}>
            {statusText(pass)}
          </span>
        )}
      </div>
      <h3 className="text-2xl font-black text-white">{value}</h3>
      {subtitle && <p className="mt-2 text-sm text-slate-400">{subtitle}</p>}
    </div>
  )

  const SteelRow = ({ part, moment, steel }) => (
    <tr className="border-b border-slate-800">
      <td className="px-4 py-4 font-semibold text-white">{part}</td>
      <td className="px-4 py-4 text-slate-300">{round(moment)} kNm/m</td>
      <td className="px-4 py-4 text-slate-300">{round(steel.astReq)} mm²/m</td>
      <td className="px-4 py-4 text-orange-300">
        {inputs.barDia} mm @ {steel.spacing} mm c/c
      </td>
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
                RCC Retaining Wall Design
              </div>

              <h1 className="text-3xl font-black tracking-tight md:text-5xl">
                Retaining Wall Design Calculator
              </h1>

              <p className="mt-3 max-w-3xl text-slate-300">
                Cantilever retaining wall ke liye active earth pressure,
                overturning, sliding, bearing pressure, stem, toe aur heel slab
                ka preliminary RCC design calculate kare.
              </p>

              <p className="mt-2 max-w-3xl text-sm text-slate-400">
                रिटेनिंग वॉल की stability check, base pressure और steel
                reinforcement का quick design summary.
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
                onClick={() => setInputs(isMetric ? defaultInputs : imperialDefaults)}
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
                1. Wall Geometry / वॉल Geometry
              </h2>

              <div className="grid gap-5 md:grid-cols-2">
                <Field
                  label="Retained Height"
                  labelHi="मिट्टी की ऊंचाई"
                  name="height"
                  suffix={unit.length}
                />
                <Field
                  label="Toe Projection"
                  labelHi="Toe की लंबाई"
                  name="toe"
                  suffix={unit.length}
                />
                <Field
                  label="Heel Projection"
                  labelHi="Heel की लंबाई"
                  name="heel"
                  suffix={unit.length}
                />
                <Field
                  label="Stem Thickness at Base"
                  labelHi="Stem की base thickness"
                  name="stemThickness"
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
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
              <h2 className="mb-5 text-xl font-black">
                2. Soil & Loading / Soil और Load
              </h2>

              <div className="grid gap-5 md:grid-cols-2">
                <Field
                  label="Soil Unit Weight"
                  labelHi="मिट्टी का unit weight"
                  name="gammaSoil"
                  suffix={unit.soilUnit}
                />
                <Field
                  label="Angle of Internal Friction"
                  labelHi="Soil friction angle"
                  name="phi"
                  suffix="degree"
                />
                <Field
                  label="Surcharge Load"
                  labelHi="ऊपर का extra load"
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
                  labelHi="Base friction coefficient"
                  name="friction"
                  suffix="μ"
                  step="0.01"
                />
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
              <h2 className="mb-5 text-xl font-black">
                3. RCC Design Inputs / RCC Design Data
              </h2>

              <div className="grid gap-5 md:grid-cols-2">
                <Field
                  label="Concrete Unit Weight"
                  labelHi="Concrete unit weight"
                  name="gammaConcrete"
                  suffix={unit.soilUnit}
                />
                <Field
                  label="Concrete Grade"
                  labelHi="Concrete grade"
                  name="fck"
                  suffix="MPa"
                />
                <Field
                  label="Steel Grade"
                  labelHi="Steel grade"
                  name="fy"
                  suffix="MPa"
                />
                <Field
                  label="Clear Cover"
                  labelHi="Nominal cover"
                  name="cover"
                  suffix="mm"
                  step="1"
                />
                <Field
                  label="Main Bar Diameter"
                  labelHi="Main reinforcement dia"
                  name="barDia"
                  suffix="mm"
                  step="1"
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
                <svg viewBox="0 0 520 330" className="h-auto w-full">
                  <defs>
                    <linearGradient id="soil" x1="0" x2="1">
                      <stop offset="0%" stopColor="#92400e" stopOpacity="0.55" />
                      <stop offset="100%" stopColor="#451a03" stopOpacity="0.75" />
                    </linearGradient>
                    <linearGradient id="conc" x1="0" x2="1">
                      <stop offset="0%" stopColor="#94a3b8" />
                      <stop offset="100%" stopColor="#475569" />
                    </linearGradient>
                  </defs>

                  <rect x="0" y="0" width="520" height="330" fill="#071027" />

                  <path
                    d="M255 42 L485 42 L485 260 L255 260 Z"
                    fill="url(#soil)"
                    stroke="#f59e0b"
                    strokeOpacity="0.45"
                  />

                  <rect x="65" y="260" width="365" height="34" rx="4" fill="url(#conc)" />
                  <rect x="178" y="65" width="40" height="195" rx="4" fill="url(#conc)" />

                  <line x1="218" y1="75" x2="485" y2="75" stroke="#f97316" strokeDasharray="6 6" />
                  <line x1="218" y1="130" x2="440" y2="130" stroke="#f97316" strokeDasharray="6 6" />
                  <line x1="218" y1="190" x2="385" y2="190" stroke="#f97316" strokeDasharray="6 6" />

                  <polygon points="220,65 335,260 220,260" fill="#f97316" opacity="0.22" />
                  <line x1="235" y1="240" x2="315" y2="240" stroke="#fb923c" strokeWidth="3" markerEnd="url(#arrow)" />

                  <line x1="65" y1="304" x2="430" y2="304" stroke="#38bdf8" />
                  <text x="210" y="322" fill="#93c5fd" fontSize="13">
                    Base width B = {round(results.B)} m
                  </text>

                  <text x="25" y="168" fill="#cbd5e1" fontSize="13" transform="rotate(-90 25 168)">
                    H = {round(results.H)} m
                  </text>

                  <text x="70" y="252" fill="#e2e8f0" fontSize="12">
                    Toe
                  </text>
                  <text x="305" y="252" fill="#e2e8f0" fontSize="12">
                    Heel
                  </text>
                  <text x="245" y="55" fill="#fbbf24" fontSize="13">
                    Backfill Soil
                  </text>
                  <text x="235" y="225" fill="#fb923c" fontSize="12">
                    Active Pressure
                  </text>
                </svg>
              </div>

              <button
                onClick={downloadPdf}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 px-5 py-4 font-black text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600"
              >
                <Download size={18} />
                Download PDF Summary
              </button>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
              <h2 className="mb-4 text-xl font-black">Final Safety Summary</h2>

              <div className="grid gap-4 sm:grid-cols-2">
                <ResultCard
                  title="Active Pressure"
                  value={`${round(results.Pa)} kN/m`}
                  subtitle={`Ka = ${round(results.Ka, 3)}`}
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
                  subtitle="Required ≥ 1.50"
                  pass={results.checks.sliding}
                />
                <ResultCard
                  title="Bearing Pressure"
                  value={`${round(results.qMax)} kPa`}
                  subtitle={`SBC = ${round(results.m.sbc)} kPa`}
                  pass={results.checks.bearing}
                />
                <ResultCard
                  title="Eccentricity"
                  value={`${round(results.e, 3)} m`}
                  subtitle={`Limit B/6 = ${round(results.B / 6, 3)} m`}
                  pass={results.checks.eccentricity}
                />
                <ResultCard
                  title="Minimum Pressure"
                  value={`${round(results.qMin)} kPa`}
                  subtitle="qmin should be ≥ 0"
                  pass={results.checks.noTension}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
          <h2 className="mb-5 text-xl font-black">
            RCC Reinforcement Design / Steel Summary
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] overflow-hidden rounded-2xl text-left text-sm">
              <thead className="bg-slate-950 text-slate-300">
                <tr>
                  <th className="px-4 py-4">Member</th>
                  <th className="px-4 py-4">Ultimate Moment</th>
                  <th className="px-4 py-4">Ast Required</th>
                  <th className="px-4 py-4">Recommended Bar</th>
                </tr>
              </thead>
              <tbody>
                <SteelRow
                  part="Stem Main Steel"
                  moment={results.MstemUltimate}
                  steel={results.stemSteel}
                />
                <SteelRow
                  part="Toe Slab Steel"
                  moment={results.MtoeUltimate}
                  steel={results.toeSteel}
                />
                <SteelRow
                  part="Heel Slab Steel"
                  moment={results.MheelUltimate}
                  steel={results.heelSteel}
                />
              </tbody>
            </table>
          </div>

          <div className="mt-5 rounded-2xl border border-orange-500/20 bg-orange-500/10 p-4 text-sm text-orange-100">
            <strong>Note:</strong> Ye preliminary design calculator hai. Drainage,
            water pressure, seismic pressure, key, passive pressure, detailing,
            development length, crack control aur site soil report ke basis par
            final design structural engineer se verify karna zaroori hai.
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
            <h3 className="mb-3 flex items-center gap-2 text-lg font-black">
              <CheckCircle2 className="text-emerald-400" size={20} />
              Step 1: Earth Pressure
            </h3>
            <p className="text-sm leading-6 text-slate-300">
              Rankine theory se active earth pressure coefficient Ka calculate
              hota hai. Soil pressure triangular load aur surcharge pressure
              rectangular load ke form me consider kiya gaya hai.
            </p>
            <div className="mt-4 rounded-xl bg-slate-950 p-4 text-sm text-slate-300">
              Ka = {round(results.Ka, 3)}
              <br />
              Pa = {round(results.Pa)} kN/m
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
            <h3 className="mb-3 flex items-center gap-2 text-lg font-black">
              <CheckCircle2 className="text-emerald-400" size={20} />
              Step 2: Stability Check
            </h3>
            <p className="text-sm leading-6 text-slate-300">
              Wall ko overturning aur sliding ke against check kiya gaya hai.
              Base pressure qmax SBC se kam hona chahiye aur qmin positive
              rehna chahiye.
            </p>
            <div className="mt-4 rounded-xl bg-slate-950 p-4 text-sm text-slate-300">
              FS OT = {round(results.fsOverturning)}
              <br />
              FS Sliding = {round(results.fsSliding)}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
            <h3 className="mb-3 flex items-center gap-2 text-lg font-black">
              <AlertTriangle className="text-orange-400" size={20} />
              Step 3: RCC Design
            </h3>
            <p className="text-sm leading-6 text-slate-300">
              Stem, toe aur heel ko cantilever action me design kiya gaya hai.
              Ultimate moment ke basis par required Ast aur practical bar spacing
              diya gaya hai.
            </p>
            <div className="mt-4 rounded-xl bg-slate-950 p-4 text-sm text-slate-300">
              Stem Mu = {round(results.MstemUltimate)} kNm/m
              <br />
              Heel Mu = {round(results.MheelUltimate)} kNm/m
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
