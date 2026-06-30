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

const endConditions = {
  hinged_hinged: {
    label: 'Both Ends Hinged',
    hindi: 'दोनों सिरों पर हिंग्ड',
    factor: 1.0,
  },
  fixed_fixed: {
    label: 'Both Ends Fixed',
    hindi: 'दोनों सिरों पर फिक्स्ड',
    factor: 0.65,
  },
  fixed_hinged: {
    label: 'One End Fixed, One End Hinged',
    hindi: 'एक सिरा फिक्स्ड, एक सिरा हिंग्ड',
    factor: 0.8,
  },
  fixed_free: {
    label: 'One End Fixed, One End Free',
    hindi: 'एक सिरा फिक्स्ड, एक सिरा फ्री',
    factor: 2.0,
  },
}

const longitudinalBarDia = [12, 16, 20, 25, 32]
const tieDiaOptions = [8, 10, 12]

const defaultInputs = {
  unitSystem: 'metric',
  columnShape: 'rectangular',
  width: 300,
  depth: 300,
  diameter: 450,
  unsupportedHeight: 3,
  endCondition: 'hinged_hinged',
  axialLoad: 600,
  mux: 0,
  muy: 0,
  concreteGrade: 'M25',
  steelGrade: 'Fe500',
  clearCover: '',
  steelRate: 65,
}

function toNumber(value, fallback = 0) {
  const num = Number(value)
  return Number.isFinite(num) ? num : fallback
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

function barArea(dia) {
  return (Math.PI * dia * dia) / 4
}

function steelWeightPerMeter(dia) {
  return (dia * dia) / 162
}

function getShapeLabel(shape) {
  if (shape === 'square') return 'Square Column'
  if (shape === 'circular') return 'Circular Column'
  return 'Rectangular Column'
}

function getShapeHindi(shape) {
  if (shape === 'square') return 'वर्गाकार कॉलम'
  if (shape === 'circular') return 'गोल कॉलम'
  return 'आयताकार कॉलम'
}

function roundDownTo25(value) {
  return Math.max(75, Math.floor(value / 25) * 25)
}

function convertInputsToMetric(input) {
  const isMetric = input.unitSystem === 'metric'

  const dimToMm = (value) => (isMetric ? toNumber(value) : toNumber(value) * 25.4)
  const heightToM = (value) => (isMetric ? toNumber(value) : toNumber(value) * 0.3048)
  const loadToKn = (value) => (isMetric ? toNumber(value) : toNumber(value) * 4.44822)
  const momentToKnM = (value) => (isMetric ? toNumber(value) : toNumber(value) * 1.35582)

  const clearCoverBlank =
    input.clearCover === '' ||
    input.clearCover === null ||
    input.clearCover === undefined ||
    Number(input.clearCover) <= 0

  const autoCoverMm = 40

  return {
    widthMm: dimToMm(input.width),
    depthMm: input.columnShape === 'square' ? dimToMm(input.width) : dimToMm(input.depth),
    diameterMm: dimToMm(input.diameter),
    unsupportedHeightM: heightToM(input.unsupportedHeight),
    axialLoadKn: loadToKn(input.axialLoad),
    muxKnM: momentToKnM(input.mux),
    muyKnM: momentToKnM(input.muy),
    clearCoverMm: clearCoverBlank ? autoCoverMm : dimToMm(input.clearCover),
    coverMode: clearCoverBlank ? 'Auto' : 'Manual',
    steelRate: toNumber(input.steelRate),
  }
}

function getTieDia(mainDia) {
  const required = Math.max(6, mainDia / 4)
  return tieDiaOptions.find((dia) => dia >= required) || 12
}

function getPerimeterSpacing({ shape, width, depth, diameter, cover, count }) {
  if (shape === 'circular') {
    const coreDiameter = Math.max(diameter - 2 * cover, 1)
    return (Math.PI * coreDiameter) / count
  }

  const coreWidth = Math.max(width - 2 * cover, 1)
  const coreDepth = Math.max(depth - 2 * cover, 1)
  return (2 * (coreWidth + coreDepth)) / count
}

function selectColumnBars({ requiredArea, ag, shape, width, depth, diameter, cover }) {
  const minBars = shape === 'circular' ? 6 : 4
  const possibleCounts =
    shape === 'circular'
      ? [6, 8, 10, 12, 16, 20]
      : [4, 6, 8, 10, 12, 16, 20]

  const options = []

  for (const dia of longitudinalBarDia) {
    for (const count of possibleCounts) {
      if (count < minBars) continue

      const providedArea = count * barArea(dia)
      const steelPercent = (providedArea / ag) * 100
      const spacing = getPerimeterSpacing({
        shape,
        width,
        depth,
        diameter,
        cover,
        count,
      })

      const fits = steelPercent <= 6 && spacing <= 300

      if (providedArea >= requiredArea) {
        options.push({
          dia,
          count,
          providedArea,
          steelPercent,
          spacing,
          fits,
          excess: providedArea - requiredArea,
        })
      }
    }
  }

  const fittingOptions = options.filter((option) => option.fits)
  const list = fittingOptions.length > 0 ? fittingOptions : options

  list.sort((a, b) => {
    if (a.fits !== b.fits) return a.fits ? -1 : 1
    if (a.count !== b.count) return a.count - b.count
    return a.excess - b.excess
  })

  return (
    list[0] || {
      dia: 16,
      count: minBars,
      providedArea: minBars * barArea(16),
      steelPercent: ((minBars * barArea(16)) / ag) * 100,
      spacing: 0,
      fits: false,
      excess: 0,
    }
  )
}

function calculateTieDetails({ leastDimension, mainDia }) {
  const tieDia = getTieDia(mainDia)
  const spacingLimit = Math.min(leastDimension, 16 * mainDia, 300)
  const spacing = roundDownTo25(Math.min(150, spacingLimit))

  return {
    tieDia,
    spacing,
    spacingLimit,
    status: spacing <= spacingLimit ? 'OK' : 'Check Required',
  }
}

function calculateSteelQuantity({
  shape,
  width,
  depth,
  diameter,
  heightM,
  cover,
  mainDia,
  mainCount,
  tieDia,
  tieSpacing,
}) {
  const mainBarLengthM = heightM + 0.6
  const mainBarWeight = mainCount * mainBarLengthM * steelWeightPerMeter(mainDia)

  const tieCount = Math.ceil((heightM * 1000) / tieSpacing) + 1

  let tieCutLengthM = 0

  if (shape === 'circular') {
    const coreDiameter = Math.max(diameter - 2 * cover, 1)
    tieCutLengthM = (Math.PI * coreDiameter + 20 * tieDia) / 1000
  } else {
    const coreWidth = Math.max(width - 2 * cover, 1)
    const coreDepth = Math.max(depth - 2 * cover, 1)
    tieCutLengthM = (2 * (coreWidth + coreDepth) + 20 * tieDia) / 1000
  }

  const tieWeight = tieCount * tieCutLengthM * steelWeightPerMeter(tieDia)

  return {
    mainBarLengthM,
    mainBarWeight,
    tieCount,
    tieCutLengthM,
    tieWeight,
    totalWeight: mainBarWeight + tieWeight,
  }
}

function calculateColumn(input) {
  const metric = convertInputsToMetric(input)

  const fck = concreteGrades[input.concreteGrade]
  const fy = steelGrades[input.steelGrade]
  const endCondition = endConditions[input.endCondition]

  const shape = input.columnShape

  const width =
    shape === 'circular' ? metric.diameterMm : metric.widthMm

  const depth =
    shape === 'square'
      ? metric.widthMm
      : shape === 'circular'
        ? metric.diameterMm
        : metric.depthMm

  const diameter = metric.diameterMm

  if (metric.unsupportedHeightM <= 0 || metric.axialLoadKn <= 0) {
    throw new Error('Please enter valid unsupported height and axial load.')
  }

  if (shape !== 'circular' && (width <= 0 || depth <= 0)) {
    throw new Error('Please enter valid column width and depth.')
  }

  if (shape === 'circular' && diameter <= 0) {
    throw new Error('Please enter valid column diameter.')
  }

  const ag =
    shape === 'circular'
      ? (Math.PI * diameter * diameter) / 4
      : width * depth

  const leastDimension = shape === 'circular' ? diameter : Math.min(width, depth)

  const effectiveLengthMm = metric.unsupportedHeightM * 1000 * endCondition.factor
  const slendernessRatio = effectiveLengthMm / leastDimension
  const columnType = slendernessRatio <= 12 ? 'Short Column' : 'Slender Column'

  const minSteelArea = 0.008 * ag
  const maxSteelArea = 0.06 * ag

  const hasMoment = Math.abs(metric.muxKnM) > 0 || Math.abs(metric.muyKnM) > 0

  const eMinX = Math.max(effectiveLengthMm / 500 + depth / 30, 20)
  const eMinY = Math.max(effectiveLengthMm / 500 + width / 30, 20)

  const appliedEx =
    metric.axialLoadKn > 0 ? (Math.abs(metric.muxKnM) / metric.axialLoadKn) * 1000 : 0

  const appliedEy =
    metric.axialLoadKn > 0 ? (Math.abs(metric.muyKnM) / metric.axialLoadKn) * 1000 : 0

  const usedEx = hasMoment ? Math.max(appliedEx, eMinX) : eMinX
  const usedEy = hasMoment ? Math.max(appliedEy, eMinY) : eMinY

  const eccentricityFactor = hasMoment
    ? Math.min(3, 1 + 1.5 * (usedEx / depth) + 1.5 * (usedEy / width))
    : 1

  const designPu = metric.axialLoadKn * eccentricityFactor

  const denominator = 0.67 * fy - 0.4 * fck

  let requiredSteelArea =
    (designPu * 1000 - 0.4 * fck * ag) / denominator

  requiredSteelArea = Math.max(requiredSteelArea, minSteelArea)

  const barSelection = selectColumnBars({
    requiredArea: requiredSteelArea,
    ag,
    shape,
    width,
    depth,
    diameter,
    cover: metric.clearCoverMm,
  })

  const asc = barSelection.providedArea
  const ac = ag - asc

  const axialCapacityKn = (0.4 * fck * ac + 0.67 * fy * asc) / 1000

  const tie = calculateTieDetails({
    leastDimension,
    mainDia: barSelection.dia,
  })

  const steelQuantity = calculateSteelQuantity({
    shape,
    width,
    depth,
    diameter,
    heightM: metric.unsupportedHeightM,
    cover: metric.clearCoverMm,
    mainDia: barSelection.dia,
    mainCount: barSelection.count,
    tieDia: tie.tieDia,
    tieSpacing: tie.spacing,
  })

  const steelCost =
    input.unitSystem === 'imperial'
      ? steelQuantity.totalWeight * 2.20462 * metric.steelRate
      : steelQuantity.totalWeight * metric.steelRate

  const loadSafe = axialCapacityKn >= designPu
  const minSteelSafe = asc >= minSteelArea
  const maxSteelSafe = asc <= maxSteelArea
  const spacingSafe = barSelection.spacing <= 300

  const status =
    loadSafe &&
    minSteelSafe &&
    maxSteelSafe &&
    spacingSafe &&
    tie.status === 'OK' &&
    columnType === 'Short Column'
      ? 'Safe'
      : 'Check Required'

  return {
    input,
    metric,
    shape,
    fck,
    fy,
    width,
    depth,
    diameter,
    ag,
    leastDimension,
    effectiveLengthMm,
    slendernessRatio,
    columnType,
    endCondition,
    minSteelArea,
    maxSteelArea,
    requiredSteelArea,
    barSelection,
    axialCapacityKn,
    appliedLoadKn: metric.axialLoadKn,
    designPu,
    hasMoment,
    eMinX,
    eMinY,
    appliedEx,
    appliedEy,
    usedEx,
    usedEy,
    eccentricityFactor,
    tie,
    steelQuantity,
    steelCost,
    loadSafe,
    minSteelSafe,
    maxSteelSafe,
    spacingSafe,
    status,
  }
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

function getRectBarPoints(x, y, w, h, count) {
  const points = []
  const perimeter = 2 * (w + h)

  for (let i = 0; i < count; i += 1) {
    const s = (i / count) * perimeter

    if (s <= w) {
      points.push({ x: x + s, y })
    } else if (s <= w + h) {
      points.push({ x: x + w, y: y + (s - w) })
    } else if (s <= 2 * w + h) {
      points.push({ x: x + w - (s - w - h), y: y + h })
    } else {
      points.push({ x, y: y + h - (s - 2 * w - h) })
    }
  }

  return points
}

function ColumnSectionDiagram({ result }) {
  const isCircular = result.shape === 'circular'

  const barText = `${result.barSelection.count}-${result.barSelection.dia} mm Ø Main Bars`
  const tieText = `${result.tie.tieDia} mm Ø Ties @ ${result.tie.spacing} mm c/c`
  const coverText = `Cover = ${formatPlain(result.metric.clearCoverMm)} mm (${result.metric.coverMode})`

  return (
    <div className="rounded-2xl bg-slate-950/60 border border-slate-800 p-5 overflow-hidden">
      <h3 className="text-lg font-bold text-white">Column Section Diagram</h3>
      <p className="text-xs text-slate-500 mb-4">कॉलम सेक्शन डायग्राम</p>

      <svg viewBox="0 0 640 430" className="w-full h-auto">
        <rect x="0" y="0" width="640" height="430" rx="18" fill="#020617" />

        {!isCircular ? (
          <>
            <rect
              x="210"
              y="70"
              width="220"
              height="270"
              rx="6"
              fill="#0f172a"
              stroke="#f97316"
              strokeWidth="3"
            />
            <rect
              x="240"
              y="100"
              width="160"
              height="210"
              rx="4"
              fill="none"
              stroke="#94a3b8"
              strokeWidth="3"
            />

            {getRectBarPoints(
              255,
              115,
              130,
              180,
              Math.min(result.barSelection.count, 16)
            ).map((point, index) => (
              <circle
                key={index}
                cx={point.x}
                cy={point.y}
                r="8"
                fill="#f97316"
              />
            ))}

            <line x1="210" y1="370" x2="430" y2="370" stroke="#64748b" strokeWidth="2" />
            <line x1="210" y1="362" x2="210" y2="378" stroke="#64748b" strokeWidth="2" />
            <line x1="430" y1="362" x2="430" y2="378" stroke="#64748b" strokeWidth="2" />
            <text x="265" y="398" fill="#e2e8f0" fontSize="16">
              b = {formatPlain(result.width)} mm
            </text>

            <line x1="460" y1="70" x2="460" y2="340" stroke="#64748b" strokeWidth="2" />
            <line x1="452" y1="70" x2="468" y2="70" stroke="#64748b" strokeWidth="2" />
            <line x1="452" y1="340" x2="468" y2="340" stroke="#64748b" strokeWidth="2" />
            <text x="480" y="210" fill="#e2e8f0" fontSize="16">
              D = {formatPlain(result.depth)} mm
            </text>
          </>
        ) : (
          <>
            <circle
              cx="320"
              cy="205"
              r="125"
              fill="#0f172a"
              stroke="#f97316"
              strokeWidth="3"
            />
            <circle
              cx="320"
              cy="205"
              r="95"
              fill="none"
              stroke="#94a3b8"
              strokeWidth="3"
            />

            {Array.from({
              length: Math.min(result.barSelection.count, 20),
            }).map((_, index) => {
              const angle =
                (2 * Math.PI * index) / Math.min(result.barSelection.count, 20)
              const cx = 320 + 82 * Math.cos(angle)
              const cy = 205 + 82 * Math.sin(angle)

              return (
                <circle key={index} cx={cx} cy={cy} r="8" fill="#f97316" />
              )
            })}

            <line x1="195" y1="360" x2="445" y2="360" stroke="#64748b" strokeWidth="2" />
            <line x1="195" y1="352" x2="195" y2="368" stroke="#64748b" strokeWidth="2" />
            <line x1="445" y1="352" x2="445" y2="368" stroke="#64748b" strokeWidth="2" />
            <text x="250" y="388" fill="#e2e8f0" fontSize="16">
              Dia = {formatPlain(result.diameter)} mm
            </text>
          </>
        )}

        <text x="30" y="80" fill="#f97316" fontSize="16" fontWeight="700">
          {barText}
        </text>
        <text x="30" y="110" fill="#cbd5e1" fontSize="15">
          {tieText}
        </text>
        <text x="30" y="140" fill="#cbd5e1" fontSize="15">
          {coverText}
        </text>

        <line x1="185" y1="105" x2="250" y2="130" stroke="#f97316" strokeWidth="2" />
      </svg>
    </div>
  )
}

function ColumnElevationDiagram({ result }) {
  return (
    <div className="rounded-2xl bg-slate-950/60 border border-slate-800 p-5 overflow-hidden">
      <h3 className="text-lg font-bold text-white">Column Elevation Diagram</h3>
      <p className="text-xs text-slate-500 mb-4">कॉलम एलिवेशन डायग्राम</p>

      <svg viewBox="0 0 640 420" className="w-full h-auto">
        <rect x="0" y="0" width="640" height="420" rx="18" fill="#020617" />

        <rect
          x="250"
          y="60"
          width="140"
          height="290"
          rx="8"
          fill="#0f172a"
          stroke="#334155"
          strokeWidth="3"
        />

        <line x1="280" y1="70" x2="280" y2="340" stroke="#f97316" strokeWidth="5" />
        <line x1="360" y1="70" x2="360" y2="340" stroke="#f97316" strokeWidth="5" />

        {Array.from({ length: 13 }).map((_, index) => {
          const y = 75 + index * 22
          return (
            <rect
              key={index}
              x="265"
              y={y}
              width="110"
              height="14"
              rx="2"
              fill="none"
              stroke="#94a3b8"
              strokeWidth="2"
            />
          )
        })}

        <line x1="420" y1="60" x2="420" y2="350" stroke="#64748b" strokeWidth="2" />
        <line x1="412" y1="60" x2="428" y2="60" stroke="#64748b" strokeWidth="2" />
        <line x1="412" y1="350" x2="428" y2="350" stroke="#64748b" strokeWidth="2" />

        <text x="440" y="210" fill="#e2e8f0" fontSize="16">
          H = {formatNumber(result.metric.unsupportedHeightM, 2)} m
        </text>

        <text x="45" y="85" fill="#f97316" fontSize="16" fontWeight="700">
          {result.barSelection.count}-{result.barSelection.dia} mm Ø Main Bars
        </text>
        <text x="45" y="115" fill="#cbd5e1" fontSize="15">
          {result.tie.tieDia} mm Ø ties @ {result.tie.spacing} mm c/c
        </text>
        <text x="45" y="145" fill="#cbd5e1" fontSize="15">
          Effective Length = {formatNumber(result.effectiveLengthMm / 1000, 2)} m
        </text>
      </svg>
    </div>
  )
}

export default function RCCColumnDesignPage() {
  const [input, setInput] = useState(defaultInputs)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const isMetric = input.unitSystem === 'metric'
  const dimensionUnit = isMetric ? 'mm' : 'in'
  const heightUnit = isMetric ? 'm' : 'ft'
  const loadUnit = isMetric ? 'kN' : 'kip'
  const momentUnit = isMetric ? 'kNm' : 'kip-ft'
  const steelRateUnit = isMetric ? '₹/kg' : '₹/lb'

  const isCircular = input.columnShape === 'circular'
  const isSquare = input.columnShape === 'square'

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
      const data = calculateColumn(input)
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
    doc.text('RCC Column Design Report', 14, 20)

    doc.setTextColor(100, 116, 139)
    doc.setFontSize(9)
    doc.text(`Generated: ${new Date().toLocaleString('en-IN')}`, 145, 12)
    doc.text(`Unit System: ${input.unitSystem === 'metric' ? 'Metric' : 'Imperial'}`, 145, 18)

    doc.setTextColor(15, 23, 42)
    doc.setFontSize(14)
    doc.text('Input Summary', 14, 38)

    const inputRows = [
      ['Column Shape', getShapeLabel(input.columnShape)],
      ['Unsupported Height', `${input.unsupportedHeight} ${heightUnit}`],
      ['End Condition', endConditions[input.endCondition].label],
      !isCircular && ['Width b', `${input.width} ${dimensionUnit}`],
      !isCircular && !isSquare && ['Depth D', `${input.depth} ${dimensionUnit}`],
      isCircular && ['Diameter', `${input.diameter} ${dimensionUnit}`],
      ['Axial Load Pu', `${input.axialLoad} ${loadUnit}`],
      ['Moment Mux', `${input.mux} ${momentUnit}`],
      ['Moment Muy', `${input.muy} ${momentUnit}`],
      ['Concrete Grade', input.concreteGrade],
      ['Steel Grade', input.steelGrade],
      [
        'Clear Cover',
        input.clearCover === '' ? 'Auto' : `${input.clearCover} ${dimensionUnit}`,
      ],
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
      ['Column Type', result.columnType],
      ['Column Shape', getShapeLabel(result.shape)],
      ['Column Size', getPdfColumnSize(result)],
      ['Effective Length', `${formatNumber(result.effectiveLengthMm / 1000, 2)} m`],
      ['Slenderness Ratio', formatNumber(result.slendernessRatio, 2)],
      ['Applied Load Pu', `${formatNumber(result.appliedLoadKn, 2)} kN`],
      ['Design Load Used', `${formatNumber(result.designPu, 2)} kN`],
      ['Axial Capacity', `${formatNumber(result.axialCapacityKn, 2)} kN`],
      ['Required Steel Area', `${formatNumber(result.requiredSteelArea, 2)} mm²`],
      ['Provided Steel Area', `${formatNumber(result.barSelection.providedArea, 2)} mm²`],
      ['Steel Percentage', `${formatNumber(result.barSelection.steelPercent, 2)} %`],
      [
        'Main Bars',
        `${result.barSelection.count} bars of ${result.barSelection.dia} mm dia`,
      ],
      [
        'Ties',
        `${result.tie.tieDia} mm dia @ ${result.tie.spacing} mm c/c`,
      ],
      ['Clear Cover Used', `${formatNumber(result.metric.clearCoverMm, 0)} mm (${result.metric.coverMode})`],
      ['Tie Count', `${result.steelQuantity.tieCount} nos`],
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

    y = doc.lastAutoTable.finalY + 12

    if (y > 220) {
      doc.addPage()
      y = 18
    }

    doc.setFontSize(14)
    doc.setTextColor(15, 23, 42)
    doc.text('Column Reinforcement Diagram', 14, y)

    drawPdfColumnDiagram(doc, result, y + 8)

    doc.setFontSize(8)
    doc.setTextColor(100, 116, 139)
    doc.text('Generated by CivilCalc Pro', 14, 288)

    doc.save('CivilCalc-Pro-RCC-Column-Design.pdf')
  }

  return (
    <main className="min-h-screen bg-[#050B1F] text-white px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <p className="text-orange-500 text-sm font-semibold tracking-wide uppercase">
            RCC Calculator
          </p>
          <h1 className="text-3xl md:text-5xl font-extrabold mt-2">
            Column Design
          </h1>
          <p className="text-slate-400 mt-3 max-w-3xl">
            RCC column design with auto bar selection, tie spacing, slenderness check,
            steel quantity and labelled reinforcement diagram.
          </p>
          <p className="text-slate-500 text-sm mt-1">
            RCC कॉलम डिज़ाइन, बार डिटेल, टाई स्पेसिंग और diagram के साथ.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 items-start">
          <section className="rounded-3xl bg-slate-900/70 border border-slate-800 p-6">
            <h2 className="text-2xl font-bold mb-1">Inputs</h2>
            <p className="text-sm text-slate-500 mb-6">
              पहले input डालें, फिर Calculate पर click करें.
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

              <Field label="Column Shape" hindi="कॉलम शेप">
                <SelectBox
                  value={input.columnShape}
                  onChange={(e) => updateInput('columnShape', e.target.value)}
                >
                  <option value="rectangular">Rectangular Column</option>
                  <option value="square">Square Column</option>
                  <option value="circular">Circular Column</option>
                </SelectBox>
              </Field>

              {!isCircular && (
                <Field
                  label={isSquare ? `Side a (${dimensionUnit})` : `Width b (${dimensionUnit})`}
                  hindi={isSquare ? 'साइड' : 'चौड़ाई'}
                >
                  <InputBox
                    type="number"
                    value={input.width}
                    onChange={(e) => updateInput('width', e.target.value)}
                  />
                </Field>
              )}

              {!isCircular && !isSquare && (
                <Field label={`Depth D (${dimensionUnit})`} hindi="गहराई">
                  <InputBox
                    type="number"
                    value={input.depth}
                    onChange={(e) => updateInput('depth', e.target.value)}
                  />
                </Field>
              )}

              {isCircular && (
                <Field label={`Diameter (${dimensionUnit})`} hindi="व्यास">
                  <InputBox
                    type="number"
                    value={input.diameter}
                    onChange={(e) => updateInput('diameter', e.target.value)}
                  />
                </Field>
              )}

              <Field label={`Unsupported Height H (${heightUnit})`} hindi="असमर्थित ऊंचाई">
                <InputBox
                  type="number"
                  value={input.unsupportedHeight}
                  onChange={(e) => updateInput('unsupportedHeight', e.target.value)}
                />
              </Field>

              <Field label="End Condition" hindi="एंड कंडीशन">
                <SelectBox
                  value={input.endCondition}
                  onChange={(e) => updateInput('endCondition', e.target.value)}
                >
                  {Object.entries(endConditions).map(([key, item]) => (
                    <option key={key} value={key}>
                      {item.label}
                    </option>
                  ))}
                </SelectBox>
              </Field>

              <Field label={`Axial Load Pu (${loadUnit})`} hindi="अक्षीय भार">
                <InputBox
                  type="number"
                  value={input.axialLoad}
                  onChange={(e) => updateInput('axialLoad', e.target.value)}
                />
              </Field>

              <Field label={`Moment Mux (${momentUnit})`} hindi="मोमेंट Mux">
                <InputBox
                  type="number"
                  value={input.mux}
                  onChange={(e) => updateInput('mux', e.target.value)}
                />
              </Field>

              <Field label={`Moment Muy (${momentUnit})`} hindi="मोमेंट Muy">
                <InputBox
                  type="number"
                  value={input.muy}
                  onChange={(e) => updateInput('muy', e.target.value)}
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

              <Field
                label={`Clear Cover Optional (${dimensionUnit})`}
                hindi="क्लीयर कवर - खाली छोड़ें तो auto"
              >
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
                  <span className="text-3xl">🏛️</span>
                </div>
                <h2 className="text-2xl font-bold">Output will appear here</h2>
                <p className="text-slate-400 mt-2 max-w-md">
                  Fill the input values and click Run Design to generate column
                  design output, reinforcement and diagram.
                </p>
                <p className="text-slate-500 text-sm mt-2">
                  Input डालने और Run Design click करने के बाद ही output आएगा.
                </p>
              </div>
            ) : (
              <>
                <ResultCard title="Design Status" hindi="डिज़ाइन स्टेटस" highlight>
                  <Row label="Status" value={result.status} strong />
                  <Row label="Column Shape" value={getShapeLabel(result.shape)} />
                  <Row label="Column Type" value={result.columnType} />
                  <Row
                    label="Cover Used"
                    value={`${formatPlain(result.metric.clearCoverMm)} mm (${result.metric.coverMode})`}
                  />
                </ResultCard>

                <ResultCard title="Final Recommendation" hindi="अंतिम सुझाव" highlight>
                  <Row
                    label="Main Bars"
                    value={`${result.barSelection.count} bars of ${result.barSelection.dia} mm dia`}
                    strong
                  />
                  <Row
                    label="Lateral Ties"
                    value={`${result.tie.tieDia} mm dia @ ${result.tie.spacing} mm c/c`}
                    strong
                  />
                  <Row
                    label="Provided Steel"
                    value={`${formatNumber(result.barSelection.providedArea, 2)} mm²`}
                  />
                  <Row
                    label="Steel Percentage"
                    value={`${formatNumber(result.barSelection.steelPercent, 2)} %`}
                  />
                </ResultCard>

                <ResultCard title="Geometry" hindi="ज्योमेट्री">
                  <Row label="Column Size" value={getColumnSize(result)} />
                  <Row label="Gross Area" value={`${formatNumber(result.ag, 0)} mm²`} />
                  <Row
                    label="Unsupported Height"
                    value={`${formatNumber(result.metric.unsupportedHeightM, 2)} m`}
                  />
                  <Row
                    label="Effective Length"
                    value={`${formatNumber(result.effectiveLengthMm / 1000, 2)} m`}
                  />
                  <Row
                    label="Slenderness Ratio"
                    value={formatNumber(result.slendernessRatio, 2)}
                  />
                  <Row label="Type" value={result.columnType} strong />
                </ResultCard>

                <ResultCard title="Loading" hindi="लोडिंग">
                  <Row
                    label="Applied Load Pu"
                    value={`${formatNumber(result.appliedLoadKn, 2)} kN`}
                    strong
                  />
                  <Row
                    label="Design Load Used"
                    value={`${formatNumber(result.designPu, 2)} kN`}
                  />
                  <Row
                    label="Column Capacity"
                    value={`${formatNumber(result.axialCapacityKn, 2)} kN`}
                    strong
                  />
                  <Row label="Load Safe" value={result.loadSafe ? 'Yes' : 'Check Required'} />
                  <Row
                    label="Moment Condition"
                    value={result.hasMoment ? 'Axial + Moment' : 'Axial Load'}
                  />
                </ResultCard>

                <ResultCard title="Eccentricity Check" hindi="एक्सेंट्रिसिटी चेक">
                  <Row label="Minimum ex" value={`${formatNumber(result.eMinX, 1)} mm`} />
                  <Row label="Minimum ey" value={`${formatNumber(result.eMinY, 1)} mm`} />
                  <Row label="Used ex" value={`${formatNumber(result.usedEx, 1)} mm`} />
                  <Row label="Used ey" value={`${formatNumber(result.usedEy, 1)} mm`} />
                </ResultCard>

                <ResultCard title="Reinforcement" hindi="रिइनफोर्समेंट">
                  <Row
                    label="Required Steel Area"
                    value={`${formatNumber(result.requiredSteelArea, 2)} mm²`}
                  />
                  <Row
                    label="Provided Steel Area"
                    value={`${formatNumber(result.barSelection.providedArea, 2)} mm²`}
                  />
                  <Row
                    label="Required Steel %"
                    value={`${formatNumber((result.requiredSteelArea / result.ag) * 100, 2)} %`}
                  />
                  <Row
                    label="Provided Steel %"
                    value={`${formatNumber(result.barSelection.steelPercent, 2)} %`}
                  />
                  <Row
                    label="Main Bars"
                    value={`${result.barSelection.count}-${result.barSelection.dia} mm Ø`}
                    strong
                  />
                  <Row
                    label="Spacing Check"
                    value={result.spacingSafe ? 'OK' : 'Check Required'}
                  />
                </ResultCard>

                <ResultCard title="Ties / Lateral Reinforcement" hindi="टाई / लेटरल रिइनफोर्समेंट">
                  <Row label="Tie Diameter" value={`${result.tie.tieDia} mm`} />
                  <Row label="Tie Spacing" value={`${result.tie.spacing} mm c/c`} />
                  <Row
                    label="Spacing Limit"
                    value={`${formatNumber(result.tie.spacingLimit, 0)} mm`}
                  />
                  <Row label="Tie Status" value={result.tie.status} />
                </ResultCard>

                <ResultCard title="Steel Quantity" hindi="स्टील क्वांटिटी">
                  <Row
                    label="Main Bar Length Each"
                    value={`${formatNumber(result.steelQuantity.mainBarLengthM, 2)} m`}
                  />
                  <Row
                    label="Main Bar Weight"
                    value={`${formatNumber(result.steelQuantity.mainBarWeight, 2)} kg`}
                  />
                  <Row label="Tie Count" value={`${result.steelQuantity.tieCount} nos`} />
                  <Row
                    label="Tie Weight"
                    value={`${formatNumber(result.steelQuantity.tieWeight, 2)} kg`}
                  />
                  <Row
                    label="Total Steel Weight"
                    value={`${formatNumber(result.steelQuantity.totalWeight, 2)} kg`}
                    strong
                  />
                  <Row
                    label="Approx Steel Cost"
                    value={`₹${formatNumber(result.steelCost, 0)}`}
                    strong
                  />
                </ResultCard>

                <ColumnSectionDiagram result={result} />
                <ColumnElevationDiagram result={result} />

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

function getColumnSize(result) {
  if (result.shape === 'circular') {
    return `${formatPlain(result.diameter)} mm dia`
  }

  return `${formatPlain(result.width)} mm × ${formatPlain(result.depth)} mm`
}

function getPdfColumnSize(result) {
  if (result.shape === 'circular') {
    return `${formatPlain(result.diameter)} mm diameter`
  }

  return `${formatPlain(result.width)} mm x ${formatPlain(result.depth)} mm`
}

function drawPdfColumnDiagram(doc, result, startY) {
  const y = startY

  doc.setDrawColor(249, 115, 22)
  doc.roundedRect(14, y, 85, 78, 3, 3, 'S')

  doc.setFontSize(10)
  doc.setTextColor(15, 23, 42)
  doc.text('Section Detail', 18, y + 7)

  if (result.shape === 'circular') {
    doc.circle(56, y + 38, 22, 'S')
    doc.circle(56, y + 38, 17, 'S')

    for (let i = 0; i < Math.min(result.barSelection.count, 12); i += 1) {
      const angle = (2 * Math.PI * i) / Math.min(result.barSelection.count, 12)
      const cx = 56 + 14 * Math.cos(angle)
      const cy = y + 38 + 14 * Math.sin(angle)
      doc.circle(cx, cy, 1.5, 'F')
    }
  } else {
    doc.rect(38, y + 18, 34, 42)
    doc.rect(43, y + 23, 24, 32)

    const points = [
      [45, y + 25],
      [65, y + 25],
      [65, y + 53],
      [45, y + 53],
      [55, y + 25],
      [65, y + 39],
      [55, y + 53],
      [45, y + 39],
    ]

    points.slice(0, Math.min(result.barSelection.count, points.length)).forEach((point) => {
      doc.circle(point[0], point[1], 1.5, 'F')
    })
  }

  doc.setFontSize(7)
  doc.text(`${result.barSelection.count}-${result.barSelection.dia} mm dia main bars`, 18, y + 67)
  doc.text(`${result.tie.tieDia} mm dia ties @ ${result.tie.spacing} mm c/c`, 18, y + 72)

  doc.roundedRect(110, y, 85, 78, 3, 3, 'S')

  doc.setFontSize(10)
  doc.text('Elevation Detail', 114, y + 7)

  doc.rect(145, y + 16, 22, 48)
  doc.line(150, y + 18, 150, y + 62)
  doc.line(162, y + 18, 162, y + 62)

  for (let i = 0; i <= 8; i += 1) {
    doc.rect(148, y + 20 + i * 5, 16, 3)
  }

  doc.setFontSize(7)
  doc.text(`Height = ${formatNumber(result.metric.unsupportedHeightM, 2)} m`, 114, y + 67)
  doc.text(`Cover = ${formatNumber(result.metric.clearCoverMm, 0)} mm (${result.metric.coverMode})`, 114, y + 72)
}
