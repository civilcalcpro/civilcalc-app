'use client'

import { useMemo, useState } from 'react'

const topicCards = [
  'Influence Line Diagram',
  'Moving Loads',
  'Reaction ILD',
  'Shear Force ILD',
  'Bending Moment ILD',
  'Single Point Load',
  'Wheel Load Train',
  'Critical Position',
  'Maximum Reaction',
  'Maximum Shear',
  'Maximum BM',
  'Simply Supported Beam',
  'Overhanging Beam',
  'ILD Ordinates',
  'Step-by-step',
  'Print PDF',
]

const effectTypes = {
  RA: {
    title: 'Reaction at A',
    short: 'RA',
    unit: 'kN',
    ordinateUnit: '',
    desc: 'Influence line for left support reaction.',
  },
  RB: {
    title: 'Reaction at B',
    short: 'RB',
    unit: 'kN',
    ordinateUnit: '',
    desc: 'Influence line for right support reaction.',
  },
  SF: {
    title: 'Shear Force at Section',
    short: 'SF',
    unit: 'kN',
    ordinateUnit: '',
    desc: 'Influence line for shear force at selected section.',
  },
  BM: {
    title: 'Bending Moment at Section',
    short: 'BM',
    unit: 'kN·m',
    ordinateUnit: 'm',
    desc: 'Influence line for bending moment at selected section.',
  },
}

function toNum(value, fallback = 0) {
  const n = Number(value)
  return Number.isFinite(n) ? n : fallback
}

function fmt(value, digits = 4) {
  const n = Number(value)
  if (!Number.isFinite(n)) return '0'
  return n.toFixed(digits).replace(/\.?0+$/, '')
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function cleanHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function createWheel(P = 80, spacing = 3) {
  return {
    id: `wheel-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    P,
    spacing,
  }
}

function defaultForm() {
  return {
    reportTitle: 'Influence Line & Moving Load Analysis',
    preparedBy: '',
    beamType: 'simply',
    supportSpan: 20,
    leftOverhang: 0,
    rightOverhang: 0,
    sectionFromA: 8,
    targetEffect: 'BM',
    loadMode: 'wheelTrain',
    singleLoad: 100,
    wheels: [
      createWheel(80, 3),
      createWheel(120, 3),
      createWheel(120, 0),
    ],
  }
}

function getModel(form) {
  const supportSpan = Math.max(toNum(form.supportSpan, 20), 0.001)
  const leftOverhang = form.beamType === 'overhang' ? Math.max(toNum(form.leftOverhang, 0), 0) : 0
  const rightOverhang = form.beamType === 'overhang' ? Math.max(toNum(form.rightOverhang, 0), 0) : 0
  const totalLength = leftOverhang + supportSpan + rightOverhang
  const A = leftOverhang
  const B = leftOverhang + supportSpan
  const sectionFromA = clamp(toNum(form.sectionFromA, supportSpan / 2), 0, supportSpan)
  const sectionX = A + sectionFromA

  return {
    supportSpan,
    leftOverhang,
    rightOverhang,
    totalLength,
    A,
    B,
    sectionFromA,
    sectionX,
  }
}

function getWheels(form) {
  if (form.loadMode === 'single') {
    return [
      {
        id: 'single-wheel',
        P: Math.max(toNum(form.singleLoad, 100), 0),
        spacing: 0,
        offset: 0,
      },
    ]
  }

  let offset = 0

  return form.wheels.map((wheel, index) => {
    const item = {
      ...wheel,
      P: Math.max(toNum(wheel.P, 0), 0),
      spacing: Math.max(toNum(wheel.spacing, 0), 0),
      offset,
      index,
    }

    offset += item.spacing

    return item
  }).filter((wheel) => wheel.P > 0)
}

function getTrainLength(wheels) {
  if (!wheels.length) return 0
  return Math.max(...wheels.map((wheel) => wheel.offset))
}

function ordinateAt(effect, z, model) {
  const { A, B, supportSpan, sectionX, sectionFromA, totalLength } = model

  if (z < -1e-9 || z > totalLength + 1e-9) return 0

  const RB = (z - A) / supportSpan
  const RA = 1 - RB

  if (effect === 'RA') return RA
  if (effect === 'RB') return RB

  if (effect === 'SF') {
    return z <= sectionX ? RA - 1 : RA
  }

  if (effect === 'BM') {
    return RA * sectionFromA - (z <= sectionX ? sectionX - z : 0)
  }

  return 0
}

function effectAtTrain(effect, frontX, model, wheels) {
  let value = 0
  const active = []

  wheels.forEach((wheel) => {
    const x = frontX + wheel.offset

    if (x >= 0 - 1e-9 && x <= model.totalLength + 1e-9) {
      const ordinate = ordinateAt(effect, x, model)
      const contribution = wheel.P * ordinate

      value += contribution

      active.push({
        ...wheel,
        x,
        ordinate,
        contribution,
      })
    }
  })

  return { value, active }
}

function getCandidatePositions(model, wheels) {
  const trainLength = getTrainLength(wheels)
  const start = -trainLength
  const end = model.totalLength
  const eps = Math.max(model.totalLength, 1) / 100000

  const keys = [
    0,
    model.A,
    model.sectionX - eps,
    model.sectionX,
    model.sectionX + eps,
    model.B,
    model.totalLength,
  ]

  const candidates = []

  const grid = 900
  for (let i = 0; i <= grid; i += 1) {
    candidates.push(start + ((end - start) * i) / grid)
  }

  wheels.forEach((wheel) => {
    keys.forEach((key) => {
      candidates.push(key - wheel.offset)
    })
  })

  return [...new Set(candidates.map((x) => Number(x.toFixed(6))))]
    .filter((x) => x >= start - 1e-9 && x <= end + 1e-9)
    .sort((a, b) => a - b)
}

function findCriticalEffect(effect, model, wheels) {
  const candidates = getCandidatePositions(model, wheels)
  let max = { value: -Infinity, frontX: 0, active: [] }
  let min = { value: Infinity, frontX: 0, active: [] }

  candidates.forEach((frontX) => {
    const calc = effectAtTrain(effect, frontX, model, wheels)

    if (calc.value > max.value) {
      max = {
        value: calc.value,
        frontX,
        active: calc.active,
      }
    }

    if (calc.value < min.value) {
      min = {
        value: calc.value,
        frontX,
        active: calc.active,
      }
    }
  })

  const abs = Math.abs(max.value) >= Math.abs(min.value) ? max : min

  return {
    effect,
    label: effectTypes[effect].title,
    unit: effectTypes[effect].unit,
    max,
    min,
    abs,
  }
}

function buildIldValues(effect, model) {
  const values = []
  const eps = Math.max(model.totalLength, 1) / 100000

  for (let i = 0; i <= 500; i += 1) {
    const x = (model.totalLength * i) / 500
    values.push({
      x,
      ordinate: ordinateAt(effect, x, model),
    })
  }

  ;[
    0,
    model.A,
    model.sectionX - eps,
    model.sectionX,
    model.sectionX + eps,
    model.B,
    model.totalLength,
  ].forEach((x) => {
    if (x >= 0 && x <= model.totalLength) {
      values.push({
        x,
        ordinate: ordinateAt(effect, x, model),
      })
    }
  })

  return values
    .sort((a, b) => a.x - b.x)
    .filter((item, index, arr) => index === 0 || Math.abs(item.x - arr[index - 1].x) > 1e-8)
}

function getImportantOrdinates(effect, model) {
  const eps = Math.max(model.totalLength, 1) / 100000

  const rows = [
    { label: 'Left end of beam', x: 0 },
    { label: 'Support A', x: model.A },
    { label: 'Section left ordinate', x: clamp(model.sectionX - eps, 0, model.totalLength) },
    { label: 'Section right ordinate', x: clamp(model.sectionX + eps, 0, model.totalLength) },
    { label: 'Support B', x: model.B },
    { label: 'Right end of beam', x: model.totalLength },
  ]

  return rows.map((row) => ({
    ...row,
    ordinate: ordinateAt(effect, row.x, model),
  }))
}

function solveInfluenceLine(form) {
  const model = getModel(form)
  const wheels = getWheels(form)

  if (!wheels.length) {
    throw new Error('Add at least one moving load.')
  }

  const allEffects = ['RA', 'RB', 'SF', 'BM'].map((effect) =>
    findCriticalEffect(effect, model, wheels)
  )

  const target = allEffects.find((item) => item.effect === form.targetEffect) || allEffects[3]
  const ildValues = buildIldValues(form.targetEffect, model)
  const ordinateRows = getImportantOrdinates(form.targetEffect, model)

  const maxOrdinate = ildValues.reduce((best, item) =>
    Math.abs(item.ordinate) > Math.abs(best.ordinate) ? item : best
  )

  const trainLength = getTrainLength(wheels)

  const summary = [
    { label: 'Target Effect', value: effectTypes[form.targetEffect].title },
    { label: 'Support Span', value: `${fmt(model.supportSpan, 3)} m` },
    { label: 'Section from A', value: `${fmt(model.sectionFromA, 3)} m` },
    { label: 'Max Positive', value: `${fmt(target.max.value, 3)} ${target.unit}` },
    { label: 'Max Negative', value: `${fmt(target.min.value, 3)} ${target.unit}` },
    { label: 'Critical Front Position', value: `${fmt(target.abs.frontX, 3)} m` },
  ]

  const formulas = [
    'For a unit load at position z, RB = (z - A) / L and RA = 1 - RB.',
    'ILD ordinate for reaction RA is RA.',
    'ILD ordinate for reaction RB is RB.',
    'ILD ordinate for shear at section x: V = RA - 1 when load is left of section, and V = RA when load is right of section.',
    'ILD ordinate for bending moment at section x: M = RA × x - 1 × (x - z) when load is left of section.',
    'Effect due to wheel load train = Σ(Pᵢ × ILD ordinate under that wheel).',
    'Critical position is found by moving the wheel train across the beam and checking all important positions.',
  ]

  const steps = [
    `Beam support span AB = ${fmt(model.supportSpan, 3)} m.`,
    `Section is located at ${fmt(model.sectionFromA, 3)} m from support A.`,
    `Selected target effect: ${effectTypes[form.targetEffect].title}.`,
    `Moving load system has ${wheels.length} wheel load(s) and train length = ${fmt(trainLength, 3)} m.`,
    `Influence line ordinates are generated along the full beam length.`,
    `For every critical wheel position, effect is calculated as Σ(P × ordinate).`,
    `Maximum positive ${effectTypes[form.targetEffect].short} = ${fmt(target.max.value, 3)} ${target.unit}.`,
    `Maximum negative ${effectTypes[form.targetEffect].short} = ${fmt(target.min.value, 3)} ${target.unit}.`,
    `Critical absolute value occurs when front wheel position = ${fmt(target.abs.frontX, 3)} m.`,
    `Maximum ILD ordinate magnitude = ${fmt(maxOrdinate.ordinate, 4)} at x = ${fmt(maxOrdinate.x, 3)} m.`,
  ]

  const activeText = target.abs.active.length
    ? target.abs.active
        .map(
          (wheel, index) =>
            `Wheel ${index + 1}: P = ${fmt(wheel.P, 3)} kN at x = ${fmt(wheel.x, 3)} m`
        )
        .join(', ')
    : 'No wheel is on the beam at the critical position.'

  const finalAnswer = `For ${effectTypes[form.targetEffect].title}, maximum positive value is ${fmt(
    target.max.value,
    3
  )} ${target.unit}, maximum negative value is ${fmt(target.min.value, 3)} ${
    target.unit
  }. Critical absolute value occurs when front wheel position is ${fmt(
    target.abs.frontX,
    3
  )} m. Active wheel positions: ${activeText}.`

  return {
    model,
    wheels,
    allEffects,
    target,
    ildValues,
    ordinateRows,
    summary,
    formulas,
    steps,
    finalAnswer,
  }
}

function solveSafely(form) {
  try {
    return solveInfluenceLine(form)
  } catch (error) {
    return {
      error: error.message || 'Unable to solve.',
      model: getModel(form),
      wheels: [],
      allEffects: [],
      target: {
        effect: form.targetEffect,
        label: effectTypes[form.targetEffect]?.title || 'Target',
        unit: effectTypes[form.targetEffect]?.unit || '',
        max: { value: 0, frontX: 0, active: [] },
        min: { value: 0, frontX: 0, active: [] },
        abs: { value: 0, frontX: 0, active: [] },
      },
      ildValues: [{ x: 0, ordinate: 0 }],
      ordinateRows: [],
      summary: [
        { label: 'Status', value: 'Check Input' },
        { label: 'Issue', value: error.message || 'Unable to solve' },
      ],
      formulas: ['Check span length, section position and moving load values.'],
      steps: ['Correct the input and try again.'],
      finalAnswer: 'Unable to solve this influence line problem with the current input.',
    }
  }
}

function buildPlainReport(result, form) {
  const effects = result.allEffects
    .map(
      (effect) =>
        `${effect.label}: Max +ve = ${fmt(effect.max.value, 3)} ${effect.unit}, Max -ve = ${fmt(
          effect.min.value,
          3
        )} ${effect.unit}, Critical front x = ${fmt(effect.abs.frontX, 3)} m`
    )
    .join('\n')

  const ordinates = result.ordinateRows
    .map((row) => `${row.label}: x = ${fmt(row.x, 3)} m, ordinate = ${fmt(row.ordinate, 4)}`)
    .join('\n')

  return `
${form.reportTitle || 'Influence Line Report'}
Prepared By: ${form.preparedBy || '-'}

RESULT SUMMARY
${result.summary.map((item) => `${item.label}: ${item.value}`).join('\n')}

ALL EFFECT RESULTS
${effects}

IMPORTANT ILD ORDINATES
${ordinates}

FORMULAS USED
${result.formulas.map((item, index) => `${index + 1}. ${item}`).join('\n')}

STEP-BY-STEP SOLUTION
${result.steps.map((item, index) => `${index + 1}. ${item}`).join('\n')}

FINAL ANSWER
${result.finalAnswer}
`.trim()
}

function copyToClipboard(text, message) {
  if (typeof window === 'undefined') return

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text)
    alert(message)
    return
  }

  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.style.position = 'fixed'
  textarea.style.left = '-9999px'
  document.body.appendChild(textarea)
  textarea.focus()
  textarea.select()
  document.execCommand('copy')
  document.body.removeChild(textarea)
  alert(message)
}

function buildReportHtml(result, form) {
  const summaryRows = result.summary
    .map(
      (item) => `
        <tr>
          <td>${cleanHtml(item.label)}</td>
          <td><strong>${cleanHtml(item.value)}</strong></td>
        </tr>
      `
    )
    .join('')

  const effectRows = result.allEffects
    .map(
      (effect) => `
        <tr>
          <td>${cleanHtml(effect.label)}</td>
          <td>${fmt(effect.max.value, 3)} ${cleanHtml(effect.unit)}</td>
          <td>${fmt(effect.min.value, 3)} ${cleanHtml(effect.unit)}</td>
          <td>${fmt(effect.abs.frontX, 3)} m</td>
        </tr>
      `
    )
    .join('')

  const ordinateRows = result.ordinateRows
    .map(
      (row) => `
        <tr>
          <td>${cleanHtml(row.label)}</td>
          <td>${fmt(row.x, 3)} m</td>
          <td>${fmt(row.ordinate, 4)}</td>
        </tr>
      `
    )
    .join('')

  const formulas = result.formulas.map((item) => `<li>${cleanHtml(item)}</li>`).join('')
  const steps = result.steps
    .map((item, index) => `<li><strong>Step ${index + 1}:</strong> ${cleanHtml(item)}</li>`)
    .join('')

  return `
<!doctype html>
<html>
<head>
  <title>${cleanHtml(form.reportTitle || 'Influence Line Report')}</title>
  <meta charset="utf-8" />
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 28px; color: #111827; background: #fff; }
    .page { max-width: 980px; margin: 0 auto; }
    .header { border-bottom: 4px solid #f97316; padding-bottom: 16px; margin-bottom: 24px; }
    h1 { margin: 0; color: #0f172a; font-size: 30px; }
    .sub { margin-top: 8px; color: #475569; font-size: 14px; line-height: 1.6; }
    h2 { margin-top: 28px; border-left: 5px solid #f97316; padding-left: 10px; color: #0f172a; font-size: 20px; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; margin-top: 12px; }
    td, th { padding: 10px; border: 1px solid #cbd5e1; text-align: left; }
    th { background: #0f172a; color: white; }
    li { margin-bottom: 8px; line-height: 1.6; }
    .answer { background: #fff7ed; border: 1px solid #fdba74; border-radius: 10px; padding: 14px; line-height: 1.7; font-weight: 600; }
    .footer { margin-top: 30px; padding-top: 12px; border-top: 1px solid #cbd5e1; color: #64748b; font-size: 12px; }
  </style>
</head>
<body>
  <div class="page">
    <div class="header">
      <h1>${cleanHtml(form.reportTitle || 'Influence Line Report')}</h1>
      <div class="sub">
        Prepared By: ${cleanHtml(form.preparedBy || '-')}<br/>
        Method: Influence Line Diagram and Moving Load Analysis<br/>
        Generated using CivilCalc Pro
      </div>
    </div>

    <h2>Result Summary</h2>
    <table><tbody>${summaryRows}</tbody></table>

    <h2>All Effect Results</h2>
    <table>
      <thead>
        <tr>
          <th>Effect</th>
          <th>Max Positive</th>
          <th>Max Negative</th>
          <th>Critical Front Position</th>
        </tr>
      </thead>
      <tbody>${effectRows}</tbody>
    </table>

    <h2>Important ILD Ordinates</h2>
    <table>
      <thead>
        <tr>
          <th>Point</th>
          <th>x</th>
          <th>Ordinate</th>
        </tr>
      </thead>
      <tbody>${ordinateRows}</tbody>
    </table>

    <h2>Formulas Used</h2>
    <ol>${formulas}</ol>

    <h2>Step-by-Step Solution</h2>
    <ol>${steps}</ol>

    <h2>Final Answer</h2>
    <div class="answer">${cleanHtml(result.finalAnswer)}</div>

    <div class="footer">Generated using CivilCalc Pro Influence Line Calculator.</div>
  </div>
</body>
</html>
`
}

function printReport(result, form) {
  if (typeof window === 'undefined') return

  const reportWindow = window.open('', '_blank', 'width=1000,height=800')

  if (!reportWindow) {
    alert('Popup blocked. Please allow popups for this site and try again.')
    return
  }

  reportWindow.document.open()
  reportWindow.document.write(buildReportHtml(result, form))
  reportWindow.document.close()

  setTimeout(() => {
    reportWindow.focus()
    reportWindow.print()
  }, 500)
}

function NumberField({ label, value, onChange, suffix, helper, min = 0, step = 'any' }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-300">{label}</span>

      <div className="flex overflow-hidden rounded-xl border border-slate-700 bg-slate-950">
        <input
          type="number"
          min={min}
          step={step}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent px-4 py-3 text-white outline-none placeholder:text-slate-500"
        />

        {suffix && (
          <span className="flex items-center border-l border-slate-700 px-4 text-sm font-bold text-orange-300">
            {suffix}
          </span>
        )}
      </div>

      {helper && <p className="mt-2 text-xs leading-5 text-slate-500">{helper}</p>}
    </label>
  )
}

function TextField({ label, value, onChange, placeholder, helper }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-300">{label}</span>

      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-500"
      />

      {helper && <p className="mt-2 text-xs leading-5 text-slate-500">{helper}</p>}
    </label>
  )
}

function SelectField({ label, value, onChange, children, helper }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-300">{label}</span>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none"
      >
        {children}
      </select>

      {helper && <p className="mt-2 text-xs leading-5 text-slate-500">{helper}</p>}
    </label>
  )
}

function WheelEditor({ wheels, onChange, onAdd, onDelete }) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black text-white">Wheel Load Train</h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Spacing means distance from this wheel to the next wheel.
          </p>
        </div>

        <button
          type="button"
          onClick={onAdd}
          className="rounded-xl bg-orange-500 px-4 py-3 text-sm font-black text-white hover:bg-orange-600"
        >
          + Add
        </button>
      </div>

      <div className="mt-6 space-y-4">
        {wheels.map((wheel, index) => (
          <div key={wheel.id} className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
            <div className="mb-4 flex items-center justify-between">
              <p className="font-black text-orange-300">Wheel {index + 1}</p>

              <button
                type="button"
                onClick={() => onDelete(wheel.id)}
                className="rounded-lg border border-red-500/30 px-3 py-2 text-xs font-bold text-red-300 hover:bg-red-500/10"
              >
                Delete
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <NumberField
                label="Wheel Load"
                value={wheel.P}
                onChange={(value) => onChange(wheel.id, 'P', value)}
                suffix="kN"
                min="0"
              />

              <NumberField
                label="Spacing to Next"
                value={wheel.spacing}
                onChange={(value) => onChange(wheel.id, 'spacing', value)}
                suffix="m"
                helper={index === wheels.length - 1 ? 'Last wheel spacing can be 0.' : ''}
                min="0"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function BeamAndLoadDiagram({ result }) {
  const { model, target } = result
  const x0 = 70
  const x1 = 570
  const y = 145
  const L = Math.max(model.totalLength, 0.001)
  const mapX = (x) => x0 + (x / L) * (x1 - x0)

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-950 p-4">
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-lg font-black text-white">Beam & Critical Load Position</h3>
          <p className="mt-1 text-xs leading-5 text-slate-400">
            Active wheel loads are shown at the critical absolute position for selected effect.
          </p>
        </div>

        <span className="rounded-xl border border-orange-500/20 bg-orange-500/10 px-3 py-2 text-xs font-bold text-orange-200">
          Critical front x = {fmt(target.abs.frontX, 3)} m
        </span>
      </div>

      <svg viewBox="0 0 640 300" className="h-auto w-full">
        <line x1={x0} y1={y} x2={x1} y2={y} stroke="#cbd5e1" strokeWidth="7" strokeLinecap="round" />

        <g>
          <polygon points={`${mapX(model.A) - 18},${y + 35} ${mapX(model.A) + 18},${y + 35} ${mapX(model.A)},${y + 6}`} fill="#38bdf8" />
          <line x1={mapX(model.A) - 30} y1={y + 38} x2={mapX(model.A) + 30} y2={y + 38} stroke="#38bdf8" strokeWidth="3" />
          <text x={mapX(model.A) - 8} y={y + 66} fill="#e2e8f0" fontSize="13" fontWeight="900">
            A
          </text>
        </g>

        <g>
          <circle cx={mapX(model.B)} cy={y + 24} r="12" fill="none" stroke="#38bdf8" strokeWidth="3" />
          <line x1={mapX(model.B) - 30} y1={y + 38} x2={mapX(model.B) + 30} y2={y + 38} stroke="#38bdf8" strokeWidth="3" />
          <text x={mapX(model.B) - 8} y={y + 66} fill="#e2e8f0" fontSize="13" fontWeight="900">
            B
          </text>
        </g>

        <line
          x1={mapX(model.sectionX)}
          y1="45"
          x2={mapX(model.sectionX)}
          y2="238"
          stroke="#facc15"
          strokeWidth="2"
          strokeDasharray="6 6"
        />
        <text x={mapX(model.sectionX) + 8} y="255" fill="#facc15" fontSize="13" fontWeight="900">
          Section x = {fmt(model.sectionFromA, 2)} m from A
        </text>

        {target.abs.active.map((wheel, index) => {
          const wx = mapX(wheel.x)

          return (
            <g key={`${wheel.id}-${index}`}>
              <line x1={wx} y1="45" x2={wx} y2={y - 10} stroke="#f97316" strokeWidth="4" />
              <polygon points={`${wx - 9},${y - 20} ${wx + 9},${y - 20} ${wx},${y - 7}`} fill="#f97316" />
              <text x={wx - 28} y="32" fill="#fed7aa" fontSize="13" fontWeight="900">
                {fmt(wheel.P, 0)}
              </text>
              <text x={wx - 23} y={y - 28} fill="#facc15" fontSize="11" fontWeight="800">
                x={fmt(wheel.x, 2)}
              </text>
            </g>
          )
        })}

        <line x1={x0} y1={y + 110} x2={x1} y2={y + 110} stroke="#64748b" strokeWidth="2" />
        <text x={(x0 + x1) / 2 - 45} y={y + 136} fill="#f97316" fontSize="14" fontWeight="900">
          Moving Load Position
        </text>
      </svg>
    </div>
  )
}

function InfluenceDiagram({ result }) {
  const { model, ildValues, target } = result
  const x0 = 70
  const x1 = 570
  const yBase = 130
  const amp = 80
  const L = Math.max(model.totalLength, 0.001)
  const mapX = (x) => x0 + (x / L) * (x1 - x0)

  const rawMaxAbs = Math.max(...ildValues.map((item) => Math.abs(item.ordinate)), 0)
  const maxAbs = rawMaxAbs > 1e-12 ? rawMaxAbs : 1

  const points = ildValues
    .map((item) => `${mapX(item.x)},${yBase - (item.ordinate / maxAbs) * amp}`)
    .join(' ')

  const maxPoint = ildValues.reduce((best, item) => (item.ordinate > best.ordinate ? item : best), ildValues[0])
  const minPoint = ildValues.reduce((best, item) => (item.ordinate < best.ordinate ? item : best), ildValues[0])
  const absPoint = ildValues.reduce(
    (best, item) => (Math.abs(item.ordinate) > Math.abs(best.ordinate) ? item : best),
    ildValues[0]
  )

  const pointY = (item) => yBase - (item.ordinate / maxAbs) * amp

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-950 p-4">
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-lg font-black text-white">Influence Line Diagram</h3>
          <p className="mt-1 text-xs leading-5 text-slate-400">
            Target: {effectTypes[target.effect].title}. Ordinates are used for moving load calculation.
          </p>
        </div>

        <span className="rounded-xl border border-orange-500/20 bg-orange-500/10 px-3 py-2 text-xs font-bold text-orange-200">
          Max ordinate = {fmt(absPoint.ordinate, 4)}
        </span>
      </div>

      <svg viewBox="0 0 640 300" className="h-auto w-full">
        <line x1={x0} y1={yBase} x2={x1} y2={yBase} stroke="#64748b" strokeWidth="2" strokeDasharray="6 6" />
        <line x1={mapX(model.A)} y1="38" x2={mapX(model.A)} y2="222" stroke="#334155" strokeWidth="2" />
        <line x1={mapX(model.B)} y1="38" x2={mapX(model.B)} y2="222" stroke="#334155" strokeWidth="2" />
        <line x1={mapX(model.sectionX)} y1="38" x2={mapX(model.sectionX)} y2="222" stroke="#facc15" strokeWidth="2" strokeDasharray="6 6" />

        <polyline points={points} fill="none" stroke="#38bdf8" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" />

        <circle cx={mapX(maxPoint.x)} cy={pointY(maxPoint)} r="4" fill="#22c55e" stroke="#020617" strokeWidth="2" />
        <circle cx={mapX(minPoint.x)} cy={pointY(minPoint)} r="4" fill="#f97316" stroke="#020617" strokeWidth="2" />

        <text x={mapX(model.A) - 8} y="245" fill="#e2e8f0" fontSize="13" fontWeight="900">
          A
        </text>
        <text x={mapX(model.B) - 8} y="245" fill="#e2e8f0" fontSize="13" fontWeight="900">
          B
        </text>
        <text x={mapX(model.sectionX) + 6} y="265" fill="#facc15" fontSize="13" fontWeight="900">
          Section
        </text>

        <text x="18" y="260" fill="#94a3b8" fontSize="13">
          Max ordinate = {fmt(maxPoint.ordinate, 4)} at x = {fmt(maxPoint.x, 3)} m
        </text>

        <text x="18" y="280" fill="#94a3b8" fontSize="13">
          Min ordinate = {fmt(minPoint.ordinate, 4)} at x = {fmt(minPoint.x, 3)} m
        </text>
      </svg>
    </div>
  )
}

function AllEffectsTable({ result }) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
      <h2 className="text-2xl font-black text-white">Maximum Effect Results</h2>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-800">
        <table className="w-full min-w-[900px] border-collapse text-left">
          <thead className="bg-slate-950">
            <tr>
              <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">Effect</th>
              <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">Max Positive</th>
              <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">Max Negative</th>
              <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">Critical Front x</th>
              <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">Active Wheels</th>
            </tr>
          </thead>

          <tbody>
            {result.allEffects.map((effect) => (
              <tr key={effect.effect} className="bg-slate-900/50">
                <td className="border-b border-slate-800 px-4 py-3 text-sm font-bold text-orange-300">
                  {effect.label}
                </td>
                <td className="border-b border-slate-800 px-4 py-3 text-sm text-slate-300">
                  {fmt(effect.max.value, 3)} {effect.unit}
                </td>
                <td className="border-b border-slate-800 px-4 py-3 text-sm text-slate-300">
                  {fmt(effect.min.value, 3)} {effect.unit}
                </td>
                <td className="border-b border-slate-800 px-4 py-3 text-sm text-slate-300">
                  {fmt(effect.abs.frontX, 3)} m
                </td>
                <td className="border-b border-slate-800 px-4 py-3 text-sm text-slate-300">
                  {effect.abs.active.length
                    ? effect.abs.active.map((wheel) => `${fmt(wheel.P, 0)} kN @ ${fmt(wheel.x, 2)} m`).join(', ')
                    : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function OrdinateTable({ result }) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
      <h2 className="text-2xl font-black text-white">Important ILD Ordinates</h2>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-800">
        <table className="w-full min-w-[650px] border-collapse text-left">
          <thead className="bg-slate-950">
            <tr>
              <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">Point</th>
              <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">Position x</th>
              <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">Ordinate</th>
            </tr>
          </thead>

          <tbody>
            {result.ordinateRows.map((row) => (
              <tr key={`${row.label}-${row.x}`} className="bg-slate-900/50">
                <td className="border-b border-slate-800 px-4 py-3 text-sm font-bold text-orange-300">
                  {row.label}
                </td>
                <td className="border-b border-slate-800 px-4 py-3 text-sm text-slate-300">
                  {fmt(row.x, 3)} m
                </td>
                <td className="border-b border-slate-800 px-4 py-3 text-sm text-slate-300">
                  {fmt(row.ordinate, 5)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function FormulaAndSteps({ result }) {
  return (
    <>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
          <h2 className="text-2xl font-black text-white">Formula Used</h2>

          <div className="mt-5 space-y-3">
            {result.formulas.map((formula) => (
              <div key={formula} className="rounded-xl border border-orange-500/20 bg-orange-500/10 px-4 py-3 text-sm font-bold text-orange-200">
                {formula}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
          <h2 className="text-2xl font-black text-white">Exam-Style Final Answer</h2>

          <p className="mt-5 rounded-2xl border border-slate-800 bg-slate-950 p-5 leading-8 text-slate-200">
            {result.finalAnswer}
          </p>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
        <h2 className="text-2xl font-black text-white">Step-by-Step Solution</h2>

        <div className="mt-6 space-y-4">
          {result.steps.map((step, index) => (
            <div key={`${step}-${index}`} className="flex gap-4 rounded-2xl border border-slate-800 bg-slate-950 p-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-500 text-sm font-black text-white">
                {index + 1}
              </div>
              <p className="leading-8 text-slate-300">{step}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

function ActionButtons({ result, form }) {
  const plainReport = buildPlainReport(result, form)

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-black text-white">Export & Share</h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Copy final answer, copy full solution, or print/save the report as PDF.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <button
            type="button"
            onClick={() => copyToClipboard(result.finalAnswer, 'Final answer copied.')}
            className="rounded-xl border border-sky-500/30 bg-sky-500/10 px-4 py-3 text-sm font-black text-sky-200 hover:bg-sky-500/20"
          >
            Copy Answer
          </button>

          <button
            type="button"
            onClick={() => copyToClipboard(plainReport, 'Full solution copied.')}
            className="rounded-xl border border-orange-500/30 bg-orange-500/10 px-4 py-3 text-sm font-black text-orange-200 hover:bg-orange-500/20"
          >
            Copy Solution
          </button>

          <button
            type="button"
            onClick={() => printReport(result, form)}
            className="rounded-xl bg-orange-500 px-4 py-3 text-sm font-black text-white hover:bg-orange-600"
          >
            Print / Save PDF
          </button>
        </div>
      </div>
    </div>
  )
}

export default function InfluenceLinePage() {
  const [form, setForm] = useState(defaultForm)
  const result = useMemo(() => solveSafely(form), [form])

  const updateForm = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const updateWheel = (id, key, value) => {
    setForm((prev) => ({
      ...prev,
      wheels: prev.wheels.map((wheel) =>
        wheel.id === id ? { ...wheel, [key]: value } : wheel
      ),
    }))
  }

  const addWheel = () => {
    setForm((prev) => ({
      ...prev,
      wheels: [...prev.wheels, createWheel(80, 0)],
    }))
  }

  const deleteWheel = (id) => {
    setForm((prev) => ({
      ...prev,
      wheels: prev.wheels.length > 1 ? prev.wheels.filter((wheel) => wheel.id !== id) : prev.wheels,
    }))
  }

  const resetExample = () => {
    setForm(defaultForm())
  }

  return (
    <main className="min-h-screen bg-[#050B1F] px-4 py-8 text-white md:px-8">
      <section className="mx-auto max-w-7xl">
        <div className="mb-8 rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 md:p-8">
          <p className="mb-3 text-sm font-extrabold uppercase tracking-widest text-orange-400">
            Structural Analysis Moving Load Solver
          </p>

          <h1 className="text-3xl font-black leading-tight md:text-5xl">
            Influence Line & Moving Load Calculator
          </h1>

          <p className="mt-4 max-w-4xl text-base leading-8 text-slate-300 md:text-lg">
            Generate ILD for reactions, shear force and bending moment. Solve moving point load and wheel load train
            questions with critical position, maximum reaction, maximum shear and maximum bending moment.
          </p>
        </div>

        <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {topicCards.map((topic) => (
            <div key={topic} className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
              <p className="text-sm font-bold text-slate-200">{topic}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-[430px_1fr]">
          <aside className="space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
              <h2 className="text-2xl font-black text-white">Problem Setup</h2>

              <div className="mt-6 space-y-5">
                <TextField
                  label="Question / Report Title"
                  value={form.reportTitle}
                  onChange={(value) => updateForm('reportTitle', value)}
                  placeholder="Example: ILD for BM at Section"
                />

                <TextField
                  label="Prepared By"
                  value={form.preparedBy}
                  onChange={(value) => updateForm('preparedBy', value)}
                  placeholder="Your name"
                />

                <SelectField
                  label="Beam Type"
                  value={form.beamType}
                  onChange={(value) => updateForm('beamType', value)}
                >
                  <option value="simply">Simply Supported Beam</option>
                  <option value="overhang">Overhanging Beam Basic</option>
                </SelectField>

                <SelectField
                  label="Target ILD / Effect"
                  value={form.targetEffect}
                  onChange={(value) => updateForm('targetEffect', value)}
                  helper={effectTypes[form.targetEffect]?.desc}
                >
                  <option value="RA">Reaction at A</option>
                  <option value="RB">Reaction at B</option>
                  <option value="SF">Shear Force at Section</option>
                  <option value="BM">Bending Moment at Section</option>
                </SelectField>
              </div>

              <button
                type="button"
                onClick={resetExample}
                className="mt-6 w-full rounded-xl border border-slate-700 px-5 py-3 font-bold text-slate-200 transition hover:border-orange-400 hover:text-orange-300"
              >
                Reset Example
              </button>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
              <h2 className="text-2xl font-black text-white">Beam Geometry</h2>

              <div className="mt-6 space-y-5">
                {form.beamType === 'overhang' && (
                  <NumberField
                    label="Left Overhang"
                    value={form.leftOverhang}
                    onChange={(value) => updateForm('leftOverhang', value)}
                    suffix="m"
                    min="0"
                  />
                )}

                <NumberField
                  label="Support Span AB"
                  value={form.supportSpan}
                  onChange={(value) => updateForm('supportSpan', value)}
                  suffix="m"
                  helper="Distance between support A and support B."
                  min="0.1"
                />

                {form.beamType === 'overhang' && (
                  <NumberField
                    label="Right Overhang"
                    value={form.rightOverhang}
                    onChange={(value) => updateForm('rightOverhang', value)}
                    suffix="m"
                    min="0"
                  />
                )}

                <NumberField
                  label="Section Distance from A"
                  value={form.sectionFromA}
                  onChange={(value) => updateForm('sectionFromA', value)}
                  suffix="m"
                  helper="For SF/BM ILD, section must be between A and B."
                  min="0"
                />
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
              <h2 className="text-2xl font-black text-white">Moving Load</h2>

              <div className="mt-6 space-y-5">
                <SelectField
                  label="Load Type"
                  value={form.loadMode}
                  onChange={(value) => updateForm('loadMode', value)}
                >
                  <option value="single">Single Moving Point Load</option>
                  <option value="wheelTrain">Wheel Load Train</option>
                </SelectField>

                {form.loadMode === 'single' && (
                  <NumberField
                    label="Moving Point Load"
                    value={form.singleLoad}
                    onChange={(value) => updateForm('singleLoad', value)}
                    suffix="kN"
                    min="0"
                  />
                )}
              </div>
            </div>

            {form.loadMode === 'wheelTrain' && (
              <WheelEditor
                wheels={form.wheels}
                onChange={updateWheel}
                onAdd={addWheel}
                onDelete={deleteWheel}
              />
            )}

            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
              <h2 className="text-xl font-black text-white">What This Tool Covers</h2>

              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
                <li>✓ ILD for RA and RB</li>
                <li>✓ ILD for SF at section</li>
                <li>✓ ILD for BM at section</li>
                <li>✓ Moving point load</li>
                <li>✓ Multiple wheel loads</li>
                <li>✓ Critical wheel position</li>
                <li>✓ Maximum positive and negative effect</li>
                <li>✓ Simply supported and overhanging beam</li>
                <li>✓ ILD ordinate table</li>
                <li>✓ Copy / Print / Save PDF</li>
              </ul>
            </div>
          </aside>

          <section className="space-y-6">
            {result.error && (
              <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-6">
                <h2 className="text-2xl font-black text-red-200">Input Error</h2>
                <p className="mt-3 leading-7 text-red-100">{result.error}</p>
              </div>
            )}

            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
              <h2 className="text-2xl font-black text-white">Result Summary</h2>

              <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {result.summary.map((item) => (
                  <div key={item.label} className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                    <p className="text-sm text-slate-400">{item.label}</p>
                    <p className="mt-2 text-xl font-black text-orange-300">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <ActionButtons result={result} form={form} />
            <BeamAndLoadDiagram result={result} />
            <InfluenceDiagram result={result} />
            <AllEffectsTable result={result} />
            <OrdinateTable result={result} />
            <FormulaAndSteps result={result} />
          </section>
        </div>
      </section>
    </main>
  )
}
