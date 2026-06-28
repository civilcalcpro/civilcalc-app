'use client'

import { useMemo, useState } from 'react'

const topicCards = [
  'Clapeyron Theorem',
  'Continuous Beam',
  '2 to 4 Spans',
  'Different EI',
  'UDL',
  'Point Load',
  'Support Settlement',
  'Three Moment Equations',
  'Support Moments',
  'Support Reactions',
  'SFD',
  'BMD',
  'Step-by-step',
  'Exam Answer',
  'Copy Solution',
  'Print PDF',
]

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

function jointName(index) {
  return String.fromCharCode(65 + index)
}

function cleanHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function getDefaults(spanCount = 2) {
  const spans = [
    { L: 4, EI: 1, udl: 5, pointLoad: 0, pointPosition: 2 },
    { L: 4, EI: 1, udl: 0, pointLoad: 20, pointPosition: 2 },
    { L: 4, EI: 1, udl: 6, pointLoad: 0, pointPosition: 2 },
    { L: 4, EI: 1, udl: 4, pointLoad: 0, pointPosition: 2 },
  ]

  return {
    spanCount,
    leftEnd: 'pin',
    rightEnd: 'pin',
    spans,
    settlements: [0, 0, 0, 0, 0],
  }
}

function getJointPositions(spans, spanCount) {
  const positions = [0]
  let x = 0

  for (let i = 0; i < spanCount; i += 1) {
    x += Math.max(toNum(spans[i]?.L, 0), 0)
    positions.push(x)
  }

  return positions
}

function integrateSpanLoad(span) {
  const L = Math.max(toNum(span.L, 1), 0.001)
  const w = Math.max(toNum(span.udl, 0), 0)
  const P = Math.max(toNum(span.pointLoad, 0), 0)
  const a = clamp(toNum(span.pointPosition, L / 2), 0, L)
  const b = L - a

  const RA0 = (w * L) / 2 + (P * b) / L
  const totalLoad = w * L + P
  const loadMomentAboutLeft = w * L * (L / 2) + P * a

  const m0 = (x) => {
    const udlMoment = RA0 * x - (w * x * x) / 2
    const pointMoment = x >= a ? P * (x - a) : 0
    return udlMoment - pointMoment
  }

  let area = 0
  let ix = 0
  let iLminusX = 0
  const n = 240
  const h = L / n

  for (let i = 0; i <= n; i += 1) {
    const x = i * h
    const coeff = i === 0 || i === n ? 1 : i % 2 === 0 ? 2 : 4
    const m = m0(x)

    area += coeff * m
    ix += coeff * m * x
    iLminusX += coeff * m * (L - x)
  }

  area *= h / 3
  ix *= h / 3
  iLminusX *= h / 3

  return {
    L,
    w,
    P,
    a,
    b,
    totalLoad,
    loadMomentAboutLeft,
    RA0,
    area,
    ix,
    iLminusX,
    m0,
  }
}

function gaussianSolve(A, b) {
  const n = A.length
  const M = A.map((row, i) => [...row, b[i]])

  for (let k = 0; k < n; k += 1) {
    let pivot = k

    for (let i = k + 1; i < n; i += 1) {
      if (Math.abs(M[i][k]) > Math.abs(M[pivot][k])) {
        pivot = i
      }
    }

    if (Math.abs(M[pivot][k]) < 1e-12) {
      throw new Error('Equations are unstable. Check end conditions, span lengths and EI values.')
    }

    if (pivot !== k) {
      const temp = M[k]
      M[k] = M[pivot]
      M[pivot] = temp
    }

    const div = M[k][k]

    for (let j = k; j <= n; j += 1) {
      M[k][j] /= div
    }

    for (let i = 0; i < n; i += 1) {
      if (i === k) continue

      const factor = M[i][k]

      for (let j = k; j <= n; j += 1) {
        M[i][j] -= factor * M[k][j]
      }
    }
  }

  return M.map((row) => row[n])
}

function buildEquationText(row, rhs, spanCount) {
  const parts = []

  for (let i = 0; i <= spanCount; i += 1) {
    const c = row[i]
    if (Math.abs(c) < 1e-10) continue
    parts.push(`${fmt(c, 6)}M${jointName(i)}`)
  }

  return `${parts.join(' + ') || '0'} = ${fmt(rhs, 6)}`
}

function solveThreeMoment(form) {
  const spanCount = clamp(toNum(form.spanCount, 2), 1, 4)
  const spans = form.spans.slice(0, spanCount).map((span) => ({
    L: Math.max(toNum(span.L, 1), 0.001),
    EI: Math.max(toNum(span.EI, 1), 0.001),
    udl: Math.max(toNum(span.udl, 0), 0),
    pointLoad: Math.max(toNum(span.pointLoad, 0), 0),
    pointPosition: clamp(toNum(span.pointPosition, toNum(span.L, 1) / 2), 0, Math.max(toNum(span.L, 1), 0.001)),
  }))

  const settlements = Array.from({ length: spanCount + 1 }, (_, i) => toNum(form.settlements[i], 0) / 1000)
  const loadIntegrals = spans.map(integrateSpanLoad)
  const unknownCount = spanCount + 1
  const A = Array.from({ length: unknownCount }, () => Array(unknownCount).fill(0))
  const B = Array(unknownCount).fill(0)
  const equationRows = []

  const leftSpan = spans[0]
  const leftLoad = loadIntegrals[0]
  const chordLeft = (settlements[1] - settlements[0]) / leftSpan.L

  if (form.leftEnd === 'fixed') {
    A[0][0] = leftSpan.L / (3 * leftSpan.EI)
    A[0][1] = leftSpan.L / (6 * leftSpan.EI)
    B[0] = chordLeft - leftLoad.iLminusX / (leftSpan.L * leftSpan.EI)

    equationRows.push({
      label: `Fixed end condition at ${jointName(0)}`,
      equation: buildEquationText(A[0], B[0], spanCount),
      note: `Rotation at ${jointName(0)} is zero.`,
    })
  } else {
    A[0][0] = 1
    B[0] = 0

    equationRows.push({
      label: `Pin/roller end condition at ${jointName(0)}`,
      equation: buildEquationText(A[0], B[0], spanCount),
      note: `Moment at pin/roller support is zero.`,
    })
  }

  for (let j = 1; j < spanCount; j += 1) {
    const rowIndex = j
    const left = spans[j - 1]
    const right = spans[j]
    const leftLoad = loadIntegrals[j - 1]
    const rightLoad = loadIntegrals[j]

    const chord1 = (settlements[j] - settlements[j - 1]) / left.L
    const chord2 = (settlements[j + 1] - settlements[j]) / right.L

    A[rowIndex][j - 1] = left.L / (6 * left.EI)
    A[rowIndex][j] = left.L / (3 * left.EI) + right.L / (3 * right.EI)
    A[rowIndex][j + 1] = right.L / (6 * right.EI)

    B[rowIndex] =
      chord2 -
      chord1 -
      leftLoad.ix / (left.L * left.EI) -
      rightLoad.iLminusX / (right.L * right.EI)

    equationRows.push({
      label: `Three moment equation at joint ${jointName(j)}`,
      equation: buildEquationText(A[rowIndex], B[rowIndex], spanCount),
      note: `Slope compatibility between span ${jointName(j - 1)}${jointName(j)} and ${jointName(j)}${jointName(j + 1)}.`,
    })
  }

  const last = spanCount
  const rightSpan = spans[spanCount - 1]
  const rightLoad = loadIntegrals[spanCount - 1]
  const chordRight = (settlements[spanCount] - settlements[spanCount - 1]) / rightSpan.L

  if (form.rightEnd === 'fixed') {
    A[last][last - 1] = rightSpan.L / (6 * rightSpan.EI)
    A[last][last] = rightSpan.L / (3 * rightSpan.EI)
    B[last] = -chordRight - rightLoad.ix / (rightSpan.L * rightSpan.EI)

    equationRows.push({
      label: `Fixed end condition at ${jointName(last)}`,
      equation: buildEquationText(A[last], B[last], spanCount),
      note: `Rotation at ${jointName(last)} is zero.`,
    })
  } else {
    A[last][last] = 1
    B[last] = 0

    equationRows.push({
      label: `Pin/roller end condition at ${jointName(last)}`,
      equation: buildEquationText(A[last], B[last], spanCount),
      note: `Moment at pin/roller support is zero.`,
    })
  }

  const moments = gaussianSolve(A, B)

  const positions = getJointPositions(spans, spanCount)
  const totalLength = positions[positions.length - 1]

  const spanResults = spans.map((span, i) => {
    const load = loadIntegrals[i]
    const ML = moments[i]
    const MR = moments[i + 1]

    const rightReaction = (load.loadMomentAboutLeft + ML - MR) / span.L
    const leftReaction = load.totalLoad - rightReaction

    return {
      span: `${jointName(i)}${jointName(i + 1)}`,
      index: i,
      L: span.L,
      EI: span.EI,
      w: span.udl,
      P: span.pointLoad,
      a: span.pointPosition,
      ML,
      MR,
      leftReaction,
      rightReaction,
      totalLoad: load.totalLoad,
    }
  })

  const supportReactions = Array.from({ length: spanCount + 1 }, (_, i) => ({
    joint: jointName(i),
    x: positions[i],
    moment: moments[i],
    vertical: 0,
    settlementMm: toNum(form.settlements[i], 0),
    type: i === 0 ? form.leftEnd : i === spanCount ? form.rightEnd : 'continuous',
  }))

  spanResults.forEach((span, i) => {
    supportReactions[i].vertical += span.leftReaction
    supportReactions[i + 1].vertical += span.rightReaction
  })

  const diagramValues = []

  spanResults.forEach((span, i) => {
    const startX = positions[i]
    const samples = 140

    for (let s = 0; s <= samples; s += 1) {
      const x = (span.L * s) / samples
      const shear = span.leftReaction - span.w * x - (x >= span.a ? span.P : 0)
      const loadMoment = (span.w * x * x) / 2 + (x >= span.a ? span.P * (x - span.a) : 0)
      const moment = span.ML + span.leftReaction * x - loadMoment

      diagramValues.push({
        x: startX + x,
        localX: x,
        spanIndex: i,
        shear,
        moment,
      })
    }
  })

  const maxSF = diagramValues.reduce((best, item) =>
    Math.abs(item.shear) > Math.abs(best.shear) ? item : best
  )

  const maxBM = diagramValues.reduce((best, item) =>
    Math.abs(item.moment) > Math.abs(best.moment) ? item : best
  )

  const momentRows = moments.map((moment, i) => ({
    joint: jointName(i),
    x: positions[i],
    moment,
    settlementMm: toNum(form.settlements[i], 0),
  }))

  const summary = [
    { label: 'Number of Spans', value: `${spanCount}` },
    { label: 'Total Length', value: `${fmt(totalLength, 3)} m` },
    { label: 'Max |SF|', value: `${fmt(maxSF.shear, 3)} kN` },
    { label: 'Max |BM|', value: `${fmt(maxBM.moment, 3)} kN·m` },
    { label: 'Max BM Location', value: `${fmt(maxBM.x, 3)} m` },
    { label: 'Method', value: 'Three Moment Theorem' },
  ]

  const formulas = [
    'Clapeyron’s three moment theorem is used for continuous beams.',
    'For an internal support: M₁L₁/6EI₁ + M₂(L₁/3EI₁ + L₂/3EI₂) + M₃L₂/6EI₂ = RHS',
    'RHS includes load-area terms from the simply supported bending moment diagram.',
    'For span load term: ∫M₀x dx and ∫M₀(L-x) dx are used.',
    'Pin or roller end condition: end moment = 0.',
    'Fixed end condition: end rotation = 0.',
    'Support settlement is included through chord rotation terms.',
    'Final reactions are calculated using final support moments and span equilibrium.',
  ]

  const steps = [
    `Number of spans selected = ${spanCount}.`,
    `Joint names are ${Array.from({ length: spanCount + 1 }, (_, i) => jointName(i)).join(', ')}.`,
    `For each span, load-area terms are calculated from simply supported bending moment diagram.`,
    `End conditions are applied: left end = ${form.leftEnd}, right end = ${form.rightEnd}.`,
    `Three moment compatibility equations are formed for internal supports.`,
    `The simultaneous equation system [A]{M} = {B} is solved for support moments.`,
    `Support moments obtained: ${momentRows.map((m) => `M${m.joint} = ${fmt(m.moment, 3)} kN·m`).join(', ')}.`,
    `Span reactions are calculated using equilibrium of each span.`,
    `SFD and BMD are generated using final reactions and support moments.`,
    `Maximum bending moment = ${fmt(maxBM.moment, 3)} kN·m at x = ${fmt(maxBM.x, 3)} m.`,
  ]

  const finalAnswer = `Using Clapeyron’s Three Moment Theorem, the support moments are ${momentRows
    .map((m) => `M${m.joint} = ${fmt(m.moment, 3)} kN·m`)
    .join(', ')}. Maximum bending moment is ${fmt(maxBM.moment, 3)} kN·m at x = ${fmt(maxBM.x, 3)} m and maximum shear force is ${fmt(maxSF.shear, 3)} kN. Support reactions, equations, SFD and BMD are shown in the result tables.`

  return {
    spanCount,
    spans,
    settlements,
    positions,
    totalLength,
    loadIntegrals,
    A,
    B,
    moments,
    equationRows,
    momentRows,
    spanResults,
    supportReactions,
    diagramValues,
    maxSF,
    maxBM,
    summary,
    formulas,
    steps,
    finalAnswer,
  }
}

function solveSafely(form) {
  try {
    return solveThreeMoment(form)
  } catch (error) {
    return {
      error: error.message || 'Unable to solve.',
      summary: [
        { label: 'Status', value: 'Check Input' },
        { label: 'Issue', value: error.message || 'Invalid model' },
      ],
      formulas: ['Check span lengths, EI values, end conditions and loading.'],
      steps: ['Correct the input and try again.'],
      finalAnswer: 'Unable to solve this beam with the current input.',
      equationRows: [],
      momentRows: [],
      spanResults: [],
      supportReactions: [],
      diagramValues: [],
      totalLength: 1,
      spanCount: 1,
      positions: [0, 1],
      spans: [],
    }
  }
}

function buildPlainReport(result, form) {
  const moments = result.momentRows
    .map((row) => `M${row.joint} = ${fmt(row.moment, 3)} kN·m at x = ${fmt(row.x, 3)} m`)
    .join('\n')

  const equations = result.equationRows
    .map((row, i) => `${i + 1}. ${row.label}\n${row.equation}\n${row.note}`)
    .join('\n\n')

  const reactions = result.supportReactions
    .map(
      (row) =>
        `${row.joint}: V = ${fmt(row.vertical, 3)} kN, M = ${fmt(row.moment, 3)} kN·m, settlement = ${fmt(row.settlementMm, 3)} mm`
    )
    .join('\n')

  return `
${form.reportTitle || 'Three Moment Theorem Report'}
Prepared By: ${form.preparedBy || '-'}

RESULT SUMMARY
${result.summary.map((item) => `${item.label}: ${item.value}`).join('\n')}

THREE MOMENT EQUATIONS
${equations}

SUPPORT MOMENTS
${moments}

SUPPORT REACTIONS
${reactions}

FORMULAS USED
${result.formulas.map((item, i) => `${i + 1}. ${item}`).join('\n')}

STEP-BY-STEP SOLUTION
${result.steps.map((item, i) => `${i + 1}. ${item}`).join('\n')}

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

  const momentRows = result.momentRows
    .map(
      (row) => `
        <tr>
          <td>${cleanHtml(row.joint)}</td>
          <td>${fmt(row.x, 3)} m</td>
          <td>${fmt(row.moment, 3)} kN·m</td>
          <td>${fmt(row.settlementMm, 3)} mm</td>
        </tr>
      `
    )
    .join('')

  const reactionRows = result.supportReactions
    .map(
      (row) => `
        <tr>
          <td>${cleanHtml(row.joint)}</td>
          <td>${fmt(row.x, 3)} m</td>
          <td>${cleanHtml(row.type)}</td>
          <td>${fmt(row.vertical, 3)} kN</td>
          <td>${fmt(row.moment, 3)} kN·m</td>
        </tr>
      `
    )
    .join('')

  const formulas = result.formulas.map((item) => `<li>${cleanHtml(item)}</li>`).join('')
  const steps = result.steps.map((item, i) => `<li><strong>Step ${i + 1}:</strong> ${cleanHtml(item)}</li>`).join('')

  return `
<!doctype html>
<html>
<head>
  <title>${cleanHtml(form.reportTitle || 'Three Moment Theorem Report')}</title>
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
      <h1>${cleanHtml(form.reportTitle || 'Three Moment Theorem Report')}</h1>
      <div class="sub">
        Prepared By: ${cleanHtml(form.preparedBy || '-')}<br/>
        Method: Clapeyron’s Three Moment Theorem
      </div>
    </div>

    <h2>Result Summary</h2>
    <table><tbody>${summaryRows}</tbody></table>

    <h2>Support Moments</h2>
    <table>
      <thead><tr><th>Joint</th><th>x</th><th>Moment</th><th>Settlement</th></tr></thead>
      <tbody>${momentRows}</tbody>
    </table>

    <h2>Support Reactions</h2>
    <table>
      <thead><tr><th>Joint</th><th>x</th><th>Type</th><th>Vertical Reaction</th><th>Moment</th></tr></thead>
      <tbody>${reactionRows}</tbody>
    </table>

    <h2>Formulas Used</h2>
    <ol>${formulas}</ol>

    <h2>Step-by-Step Solution</h2>
    <ol>${steps}</ol>

    <h2>Final Answer</h2>
    <div class="answer">${cleanHtml(result.finalAnswer)}</div>

    <div class="footer">Generated using CivilCalc Pro Three Moment Theorem Calculator.</div>
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

function SpanEditor({ span, index, onChange }) {
  const update = (key, value) => onChange(index, key, value)

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
      <p className="mb-4 font-black text-orange-300">
        Span {index + 1}: {jointName(index)}{jointName(index + 1)}
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <NumberField label="Span Length L" value={span.L} onChange={(v) => update('L', v)} suffix="m" min="0.1" />
        <NumberField label="EI Factor" value={span.EI} onChange={(v) => update('EI', v)} suffix="EI" helper="Use 1 if EI is same." min="0.001" />
        <NumberField label="UDL w" value={span.udl} onChange={(v) => update('udl', v)} suffix="kN/m" min="0" />
        <NumberField label="Point Load P" value={span.pointLoad} onChange={(v) => update('pointLoad', v)} suffix="kN" min="0" />
        <NumberField label="Point Load Position a" value={span.pointPosition} onChange={(v) => update('pointPosition', v)} suffix="m" helper={`Distance from joint ${jointName(index)}.`} min="0" />
      </div>
    </div>
  )
}

function BeamDiagram({ result, form }) {
  const x0 = 70
  const x1 = 570
  const y = 130
  const L = result.totalLength || 1
  const mapX = (x) => x0 + (x / L) * (x1 - x0)

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-950 p-4">
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-lg font-black text-white">Continuous Beam Diagram</h3>
          <p className="mt-1 text-xs leading-5 text-slate-400">
            Beam, supports, loads and settlements used in three moment theorem.
          </p>
        </div>

        <span className="rounded-xl border border-orange-500/20 bg-orange-500/10 px-3 py-2 text-xs font-bold text-orange-200">
          Total L = {fmt(result.totalLength, 3)} m
        </span>
      </div>

      <svg viewBox="0 0 640 300" className="h-auto w-full">
        <line x1={x0} y1={y} x2={x1} y2={y} stroke="#cbd5e1" strokeWidth="7" strokeLinecap="round" />

        {result.positions.map((x, i) => {
          const sx = mapX(x)
          const isLeft = i === 0
          const isRight = i === result.spanCount
          const endType = isLeft ? form.leftEnd : isRight ? form.rightEnd : 'continuous'

          if (endType === 'fixed') {
            return (
              <g key={i}>
                <rect x={sx - 28} y={y - 58} width="24" height="116" fill="#38bdf8" opacity="0.9" />
                {[-45, -25, -5, 15, 35, 55].map((dy) => (
                  <line key={dy} x1={sx - 40} y1={y + dy + 12} x2={sx - 4} y2={y + dy - 12} stroke="#0f172a" strokeWidth="2" />
                ))}
                <text x={sx - 8} y={y + 82} fill="#e2e8f0" fontSize="12" fontWeight="900">
                  {jointName(i)}
                </text>
              </g>
            )
          }

          return (
            <g key={i}>
              <polygon points={`${sx - 18},${y + 35} ${sx + 18},${y + 35} ${sx},${y + 6}`} fill="#38bdf8" />
              <line x1={sx - 30} y1={y + 38} x2={sx + 30} y2={y + 38} stroke="#38bdf8" strokeWidth="3" />
              <text x={sx - 8} y={y + 66} fill="#e2e8f0" fontSize="12" fontWeight="900">
                {jointName(i)}
              </text>
            </g>
          )
        })}

        {result.spans.map((span, i) => {
          const start = result.positions[i]
          const end = result.positions[i + 1]
          const sx = mapX(start)
          const ex = mapX(end)
          const items = []

          if (span.udl > 0) {
            const positions = Array.from({ length: 7 }, (_, k) => sx + ((ex - sx) * k) / 6)

            items.push(
              <g key="udl">
                <line x1={sx} y1="48" x2={ex} y2="48" stroke="#f97316" strokeWidth="3" />
                {positions.map((px) => (
                  <g key={px}>
                    <line x1={px} y1="50" x2={px} y2={y - 8} stroke="#f97316" strokeWidth="2.5" />
                    <polygon points={`${px - 6},${y - 18} ${px + 6},${y - 18} ${px},${y - 6}`} fill="#f97316" />
                  </g>
                ))}
                <text x={sx + 6} y="38" fill="#fed7aa" fontSize="13" fontWeight="900">
                  w={fmt(span.udl, 1)}
                </text>
              </g>
            )
          }

          if (span.pointLoad > 0) {
            const px = mapX(start + clamp(span.pointPosition, 0, span.L))

            items.push(
              <g key="point">
                <line x1={px} y1="42" x2={px} y2={y - 8} stroke="#f97316" strokeWidth="4" />
                <polygon points={`${px - 9},${y - 18} ${px + 9},${y - 18} ${px},${y - 4}`} fill="#f97316" />
                <text x={px - 28} y="30" fill="#fed7aa" fontSize="13" fontWeight="900">
                  P={fmt(span.pointLoad, 1)}
                </text>
              </g>
            )
          }

          items.push(
            <text key="spanLabel" x={(sx + ex) / 2 - 18} y={y + 105} fill="#f97316" fontSize="13" fontWeight="900">
              {jointName(i)}{jointName(i + 1)}
            </text>
          )

          return <g key={i}>{items}</g>
        })}

        <line x1={x0} y1={y + 120} x2={x1} y2={y + 120} stroke="#64748b" strokeWidth="2" />
        <text x={(x0 + x1) / 2 - 50} y={y + 148} fill="#f97316" fontSize="14" fontWeight="900">
          Three Moment Theorem Beam
        </text>
      </svg>
    </div>
  )
}

function CurveDiagram({ result, type }) {
  const x0 = 70
  const x1 = 570
  const yBase = 115
  const amp = 65
  const L = result.totalLength || 1
  const mapX = (x) => x0 + (x / L) * (x1 - x0)

  const meta =
    type === 'sfd'
      ? {
          title: 'Shear Force Diagram',
          color: '#f97316',
          note: 'Final SFD from support reactions.',
          unit: 'kN',
          digits: 3,
          key: 'shear',
          label: 'SF',
        }
      : {
          title: 'Bending Moment Diagram',
          color: '#38bdf8',
          note: 'Final BMD from support moments and reactions.',
          unit: 'kN·m',
          digits: 3,
          key: 'moment',
          label: 'BM',
        }

  const values = result.diagramValues || []
  const getValue = (item) => item[meta.key]
  const rawMaxAbs = Math.max(...values.map((item) => Math.abs(getValue(item))), 0)
  const maxAbs = rawMaxAbs > 1e-12 ? rawMaxAbs : 1

  const points = values
    .map((item) => {
      const value = getValue(item)
      const y = type === 'sfd' ? yBase - (value / maxAbs) * amp : yBase + (value / maxAbs) * amp
      return `${mapX(item.x)},${y}`
    })
    .join(' ')

  const maxPoint = values.reduce((best, item) => (getValue(item) > getValue(best) ? item : best), values[0])
  const minPoint = values.reduce((best, item) => (getValue(item) < getValue(best) ? item : best), values[0])
  const absPoint = values.reduce((best, item) => (Math.abs(getValue(item)) > Math.abs(getValue(best)) ? item : best), values[0])

  const pointY = (item) => {
    const value = getValue(item)
    return type === 'sfd' ? yBase - (value / maxAbs) * amp : yBase + (value / maxAbs) * amp
  }

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-950 p-4">
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-lg font-black text-white">{meta.title}</h3>
          <p className="mt-1 text-xs leading-5 text-slate-400">{meta.note}</p>
        </div>

        <div className="rounded-xl border border-orange-500/20 bg-orange-500/10 px-3 py-2 text-xs font-bold text-orange-200">
          Max |{meta.label}| = {fmt(getValue(absPoint), meta.digits)} {meta.unit}
        </div>
      </div>

      <svg viewBox="0 0 640 280" className="h-auto w-full">
        <line x1={x0} y1={yBase} x2={x1} y2={yBase} stroke="#64748b" strokeWidth="2" strokeDasharray="6 6" />
        <line x1={x0} y1="30" x2={x0} y2="190" stroke="#334155" strokeWidth="2" />
        <line x1={x1} y1="30" x2={x1} y2="190" stroke="#334155" strokeWidth="2" />

        <polyline points={points} fill="none" stroke={meta.color} strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" />

        <circle cx={mapX(maxPoint.x)} cy={pointY(maxPoint)} r="4" fill="#22c55e" stroke="#020617" strokeWidth="2" />
        <circle cx={mapX(minPoint.x)} cy={pointY(minPoint)} r="4" fill="#f97316" stroke="#020617" strokeWidth="2" />

        <text x="18" y="238" fill="#94a3b8" fontSize="13">
          Max {meta.label} = {fmt(getValue(maxPoint), meta.digits)} {meta.unit} at x = {fmt(maxPoint.x, 3)} m
        </text>

        <text x="18" y="258" fill="#94a3b8" fontSize="13">
          Min {meta.label} = {fmt(getValue(minPoint), meta.digits)} {meta.unit} at x = {fmt(minPoint.x, 3)} m
        </text>

        <text x="360" y="238" fill="#facc15" fontSize="13" fontWeight="900">
          Max absolute:
        </text>

        <text x="360" y="258" fill="#facc15" fontSize="13" fontWeight="900">
          x = {fmt(absPoint.x, 3)} m, {meta.label} = {fmt(getValue(absPoint), meta.digits)} {meta.unit}
        </text>
      </svg>
    </div>
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

function EquationTable({ result }) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
      <h2 className="text-2xl font-black text-white">Three Moment Equations</h2>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-800">
        <table className="w-full min-w-[850px] border-collapse text-left">
          <thead className="bg-slate-950">
            <tr>
              <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">Condition</th>
              <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">Equation</th>
              <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">Note</th>
            </tr>
          </thead>

          <tbody>
            {result.equationRows.map((row, index) => (
              <tr key={index} className="bg-slate-900/50">
                <td className="border-b border-slate-800 px-4 py-3 text-sm font-bold text-orange-300">{row.label}</td>
                <td className="border-b border-slate-800 px-4 py-3 text-sm text-slate-300">{row.equation}</td>
                <td className="border-b border-slate-800 px-4 py-3 text-sm text-slate-400">{row.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function MomentTable({ result }) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
      <h2 className="text-2xl font-black text-white">Solved Support Moments</h2>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-800">
        <table className="w-full min-w-[720px] border-collapse text-left">
          <thead className="bg-slate-950">
            <tr>
              <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">Joint</th>
              <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">x</th>
              <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">Support Moment</th>
              <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">Settlement</th>
            </tr>
          </thead>

          <tbody>
            {result.momentRows.map((row) => (
              <tr key={row.joint} className="bg-slate-900/50">
                <td className="border-b border-slate-800 px-4 py-3 text-sm font-bold text-orange-300">M{row.joint}</td>
                <td className="border-b border-slate-800 px-4 py-3 text-sm text-slate-300">{fmt(row.x, 3)} m</td>
                <td className="border-b border-slate-800 px-4 py-3 text-sm text-slate-300">{fmt(row.moment, 3)} kN·m</td>
                <td className="border-b border-slate-800 px-4 py-3 text-sm text-slate-300">{fmt(row.settlementMm, 3)} mm</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function ReactionTable({ result }) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
      <h2 className="text-2xl font-black text-white">Support Reactions</h2>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-800">
        <table className="w-full min-w-[780px] border-collapse text-left">
          <thead className="bg-slate-950">
            <tr>
              <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">Joint</th>
              <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">x</th>
              <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">Type</th>
              <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">Vertical Reaction</th>
              <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">Moment</th>
            </tr>
          </thead>

          <tbody>
            {result.supportReactions.map((row) => (
              <tr key={row.joint} className="bg-slate-900/50">
                <td className="border-b border-slate-800 px-4 py-3 text-sm font-bold text-orange-300">{row.joint}</td>
                <td className="border-b border-slate-800 px-4 py-3 text-sm text-slate-300">{fmt(row.x, 3)} m</td>
                <td className="border-b border-slate-800 px-4 py-3 text-sm text-slate-300">{row.type}</td>
                <td className="border-b border-slate-800 px-4 py-3 text-sm text-slate-300">{fmt(row.vertical, 3)} kN</td>
                <td className="border-b border-slate-800 px-4 py-3 text-sm text-slate-300">{fmt(row.moment, 3)} kN·m</td>
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
            <div key={step} className="flex gap-4 rounded-2xl border border-slate-800 bg-slate-950 p-4">
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

export default function ThreeMomentTheoremPage() {
  const defaults = getDefaults(2)

  const [form, setForm] = useState({
    reportTitle: 'Three Moment Theorem Analysis',
    preparedBy: '',
    ...defaults,
  })

  const result = useMemo(() => solveSafely(form), [form])

  const updateForm = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const updateSpanCount = (value) => {
    const spanCount = Number(value)
    setForm((prev) => ({
      ...prev,
      spanCount,
    }))
  }

  const updateSpan = (index, key, value) => {
    setForm((prev) => ({
      ...prev,
      spans: prev.spans.map((span, i) => (i === index ? { ...span, [key]: value } : span)),
    }))
  }

  const updateSettlement = (index, value) => {
    setForm((prev) => ({
      ...prev,
      settlements: prev.settlements.map((item, i) => (i === index ? value : item)),
    }))
  }

  const resetExample = () => {
    const defaults = getDefaults(2)

    setForm({
      reportTitle: 'Three Moment Theorem Analysis',
      preparedBy: '',
      ...defaults,
    })
  }

  return (
    <main className="min-h-screen bg-[#050B1F] px-4 py-8 text-white md:px-8">
      <section className="mx-auto max-w-7xl">
        <div className="mb-8 rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 md:p-8">
          <p className="mb-3 text-sm font-extrabold uppercase tracking-widest text-orange-400">
            Structural Analysis Continuous Beam Solver
          </p>

          <h1 className="text-3xl font-black leading-tight md:text-5xl">
            Three Moment Theorem Calculator
          </h1>

          <p className="mt-4 max-w-4xl text-base leading-8 text-slate-300 md:text-lg">
            Solve continuous beams using Clapeyron’s Three Moment Theorem with support moments,
            support reactions, settlement effect, SFD, BMD, equations and exam-style solution.
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
                  placeholder="Example: Continuous Beam by Three Moment Theorem"
                />

                <TextField
                  label="Prepared By"
                  value={form.preparedBy}
                  onChange={(value) => updateForm('preparedBy', value)}
                  placeholder="Your name"
                />

                <SelectField
                  label="Number of Spans"
                  value={form.spanCount}
                  onChange={updateSpanCount}
                  helper="Supports/joints will be span count + 1."
                >
                  <option value={1}>1 Span</option>
                  <option value={2}>2 Spans</option>
                  <option value={3}>3 Spans</option>
                  <option value={4}>4 Spans</option>
                </SelectField>

                <div className="grid gap-4 sm:grid-cols-2">
                  <SelectField label="Left End Condition" value={form.leftEnd} onChange={(value) => updateForm('leftEnd', value)}>
                    <option value="pin">Pin / Roller</option>
                    <option value="fixed">Fixed</option>
                  </SelectField>

                  <SelectField label="Right End Condition" value={form.rightEnd} onChange={(value) => updateForm('rightEnd', value)}>
                    <option value="pin">Pin / Roller</option>
                    <option value="fixed">Fixed</option>
                  </SelectField>
                </div>
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
              <h2 className="text-2xl font-black text-white">Span & Load Setup</h2>

              <div className="mt-6 space-y-5">
                {form.spans.slice(0, form.spanCount).map((span, index) => (
                  <SpanEditor key={index} span={span} index={index} onChange={updateSpan} />
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
              <h2 className="text-2xl font-black text-white">Support Settlement</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Positive settlement means downward settlement. Keep 0 if settlement is not given.
              </p>

              <div className="mt-6 space-y-4">
                {Array.from({ length: Number(form.spanCount) + 1 }).map((_, index) => (
                  <NumberField
                    key={index}
                    label={`Settlement at Support ${jointName(index)}`}
                    value={form.settlements[index]}
                    onChange={(value) => updateSettlement(index, value)}
                    suffix="mm"
                    min="-999"
                  />
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
              <h2 className="text-xl font-black text-white">What This Tool Covers</h2>

              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
                <li>✓ Two, three and four span continuous beam</li>
                <li>✓ Pin and fixed end conditions</li>
                <li>✓ Different span lengths</li>
                <li>✓ Different EI factors</li>
                <li>✓ UDL and point load per span</li>
                <li>✓ Support settlement effect</li>
                <li>✓ Three moment equations</li>
                <li>✓ Support moments and reactions</li>
                <li>✓ SFD and BMD</li>
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
            <BeamDiagram result={result} form={form} />
            <EquationTable result={result} />
            <MomentTable result={result} />
            <ReactionTable result={result} />

            <div className="grid gap-6 xl:grid-cols-2">
              <CurveDiagram result={result} type="sfd" />
              <CurveDiagram result={result} type="bmd" />
            </div>

            <FormulaAndSteps result={result} />
          </section>
        </div>
      </section>
    </main>
  )
}
