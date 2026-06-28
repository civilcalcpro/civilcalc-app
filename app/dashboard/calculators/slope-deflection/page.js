'use client'

import { useMemo, useState } from 'react'

const topicCards = [
  'Support Reactions',
  'Loading Diagram',
  'SFD',
  'BMD',
  'M/EI Concept',
  'Slope Curve',
  'Deflection Curve',
  'Moment Area Method',
  'Conjugate Beam Concept',
  'Combined Loads',
  'Maximum Deflection',
  'Exam Answer',
]

const defaultLoads = [
  {
    id: 'load-1',
    type: 'point',
    P: 20,
    x: 2,
    w: 5,
    w1: 0,
    w2: 10,
    start: 0,
    end: 6,
    M: 10,
    direction: 'clockwise',
  },
  {
    id: 'load-2',
    type: 'udl',
    P: 10,
    x: 3,
    w: 5,
    w1: 0,
    w2: 10,
    start: 2,
    end: 5,
    M: 10,
    direction: 'clockwise',
  },
]

function toNum(value, fallback = 0) {
  const n = Number(value)
  return Number.isFinite(n) ? n : fallback
}

function fmt(value, digits = 4) {
  const n = Number(value)
  if (!Number.isFinite(n)) return '0'
  const fixed = n.toFixed(digits)
  return fixed.replace(/\.?0+$/, '')
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function createLoad(type, L = 6) {
  return {
    id: `load-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    type,
    P: type === 'point' ? 20 : 10,
    x: L / 2,
    w: 5,
    w1: type === 'uvl' ? 0 : 5,
    w2: type === 'uvl' ? 10 : 5,
    start: 0,
    end: L,
    M: 10,
    direction: 'clockwise',
  }
}

function normalizeLoad(load, L) {
  const x = clamp(toNum(load.x, 0), 0, L)
  const startRaw = clamp(toNum(load.start, 0), 0, L)
  const endRaw = clamp(toNum(load.end, L), 0, L)
  const start = Math.min(startRaw, endRaw)
  const end = Math.max(startRaw, endRaw)
  const length = Math.max(end - start, 0)

  return {
    ...load,
    P: Math.max(toNum(load.P, 0), 0),
    x,
    w: Math.max(toNum(load.w, 0), 0),
    w1: Math.max(toNum(load.w1, 0), 0),
    w2: Math.max(toNum(load.w2, 0), 0),
    start,
    end,
    length,
    M: Math.max(toNum(load.M, 0), 0),
    direction: load.direction === 'anticlockwise' ? 'anticlockwise' : 'clockwise',
  }
}

function getMomentSign(load) {
  return load.direction === 'clockwise' ? 1 : -1
}

function getLoadResultant(load) {
  if (load.type === 'point') {
    return {
      W: load.P,
      xBar: load.x,
      label: `Point load ${fmt(load.P, 2)} kN at x = ${fmt(load.x, 2)} m`,
    }
  }

  if (load.type === 'udl') {
    const W = load.w * load.length
    const xBar = load.start + load.length / 2

    return {
      W,
      xBar,
      label: `UDL ${fmt(load.w, 2)} kN/m from ${fmt(load.start, 2)} m to ${fmt(load.end, 2)} m`,
    }
  }

  if (load.type === 'uvl') {
    const W = ((load.w1 + load.w2) / 2) * load.length
    const localX =
      load.w1 + load.w2 === 0
        ? load.length / 2
        : (load.length * (load.w1 + 2 * load.w2)) / (3 * (load.w1 + load.w2))
    const xBar = load.start + localX

    return {
      W,
      xBar,
      label: `UVL/trapezoidal load ${fmt(load.w1, 2)} to ${fmt(load.w2, 2)} kN/m from ${fmt(load.start, 2)} m to ${fmt(load.end, 2)} m`,
    }
  }

  return {
    W: 0,
    xBar: load.x,
    signedMoment: getMomentSign(load) * load.M,
    label: `${load.direction === 'clockwise' ? 'Clockwise' : 'Anticlockwise'} moment ${fmt(load.M, 2)} kN·m at x = ${fmt(load.x, 2)} m`,
  }
}

function partialDistributedLoad(load, fromX, toX) {
  const a = clamp(fromX, load.start, load.end)
  const b = clamp(toX, load.start, load.end)

  if (b <= a) return { W: 0, firstMoment: 0 }

  if (load.type === 'udl') {
    const W = load.w * (b - a)
    const xBar = (a + b) / 2

    return {
      W,
      firstMoment: W * xBar,
    }
  }

  if (load.type === 'uvl') {
    const length = load.length || 0.000001
    const slope = (load.w2 - load.w1) / length

    const integrateLoad = (x) => {
      const u = x - load.start
      return load.w1 * u + (slope * u * u) / 2
    }

    const integrateMoment = (x) => {
      const u = x - load.start

      return (
        load.start * (load.w1 * u + (slope * u * u) / 2) +
        (load.w1 * u * u) / 2 +
        (slope * u * u * u) / 3
      )
    }

    const W = integrateLoad(b) - integrateLoad(a)
    const firstMoment = integrateMoment(b) - integrateMoment(a)

    return { W, firstMoment }
  }

  return { W: 0, firstMoment: 0 }
}

function shearMomentAt(result, rawX, side = 'right') {
  const L = result.L
  const x = clamp(rawX, 0, L)
  const eps = 0.000001
  const checkX = side === 'left' ? Math.max(0, x - eps) : Math.min(L, x + eps)

  if (result.beamType === 'simple') {
    let V = result.RA
    let M = result.RA * x

    result.loads.forEach((load) => {
      if (load.type === 'point') {
        if (checkX >= load.x) V -= load.P
        if (x >= load.x) M -= load.P * (x - load.x)
      }

      if (load.type === 'udl' || load.type === 'uvl') {
        const shearPart = partialDistributedLoad(load, load.start, Math.min(checkX, load.end))
        V -= shearPart.W

        const momentPart = partialDistributedLoad(load, load.start, Math.min(x, load.end))
        M -= momentPart.W * x - momentPart.firstMoment
      }

      if (load.type === 'moment') {
        if (checkX >= load.x) {
          M += getMomentSign(load) * load.M
        }
      }
    })

    return { shear: V, moment: M }
  }

  let V = 0
  let M = 0

  result.loads.forEach((load) => {
    if (load.type === 'point') {
      if (checkX <= load.x) V -= load.P
      if (x <= load.x) M -= load.P * (load.x - x)
    }

    if (load.type === 'udl' || load.type === 'uvl') {
      const rightStart = Math.max(x, load.start)
      const rightEnd = load.end

      if (rightEnd > rightStart) {
        const part = partialDistributedLoad(load, rightStart, rightEnd)
        V -= part.W
        M -= part.firstMoment - part.W * x
      }
    }

    if (load.type === 'moment') {
      if (checkX <= load.x) {
        M -= getMomentSign(load) * load.M
      }
    }
  })

  return { shear: V, moment: M }
}

function buildSampleXs(L, loads, sectionX) {
  const xs = []

  for (let i = 0; i <= 420; i += 1) {
    xs.push((L * i) / 420)
  }

  xs.push(sectionX, 0, L)

  loads.forEach((load) => {
    if (load.type === 'point' || load.type === 'moment') {
      xs.push(load.x)
    }

    if (load.type === 'udl' || load.type === 'uvl') {
      xs.push(load.start, load.end, (load.start + load.end) / 2)
    }
  })

  return [...new Set(xs.map((x) => Number(clamp(x, 0, L).toFixed(6))))].sort((a, b) => a - b)
}

function computeSlopeDeflection(baseResult, xs, EI) {
  const curvature = xs.map((x) => {
    const M = shearMomentAt(baseResult, x).moment

    if (baseResult.beamType === 'cantilever') {
      return -M / EI
    }

    return M / EI
  })

  const slopeBase = Array(xs.length).fill(0)
  const defBase = Array(xs.length).fill(0)

  for (let i = 1; i < xs.length; i += 1) {
    const dx = xs[i] - xs[i - 1]

    slopeBase[i] =
      slopeBase[i - 1] + 0.5 * (curvature[i - 1] + curvature[i]) * dx

    defBase[i] =
      defBase[i - 1] + 0.5 * (slopeBase[i - 1] + slopeBase[i]) * dx
  }

  let slopeCorrection = 0

  if (baseResult.beamType === 'simple') {
    slopeCorrection = -defBase[defBase.length - 1] / baseResult.L
  }

  return xs.map((x, index) => {
    const slope = slopeBase[index] + slopeCorrection
    const deflection = defBase[index] + slopeCorrection * x

    return {
      x,
      curvature: curvature[index],
      slope,
      deflection,
      deflectionMm: deflection * 1000,
    }
  })
}

function solveBeam(form) {
  const L = Math.max(toNum(form.L, 6), 0.1)
  const sectionX = clamp(toNum(form.x, L / 2), 0, L)
  const beamType = form.beamType === 'cantilever' ? 'cantilever' : 'simple'

  const E = Math.max(toNum(form.E, 200), 0.001)
  const I = Math.max(toNum(form.I, 300), 0.001)
  const EI = E * I

  const loads = form.loads.map((load) => normalizeLoad(load, L))

  const resultants = loads.map((load) => ({
    load,
    ...getLoadResultant(load),
  }))

  const verticalResultants = resultants.filter((item) => item.load.type !== 'moment')
  const momentResultants = resultants.filter((item) => item.load.type === 'moment')

  const totalLoad = verticalResultants.reduce((sum, item) => sum + item.W, 0)
  const loadMomentAboutA = verticalResultants.reduce((sum, item) => sum + item.W * item.xBar, 0)
  const appliedMomentSum = momentResultants.reduce(
    (sum, item) => sum + getMomentSign(item.load) * item.load.M,
    0
  )

  let RA = 0
  let RB = 0
  let fixedMoment = 0

  if (beamType === 'simple') {
    RB = (loadMomentAboutA + appliedMomentSum) / L
    RA = totalLoad - RB
  } else {
    RA = totalLoad
    fixedMoment = loadMomentAboutA + appliedMomentSum
  }

  const baseResult = {
    beamType,
    L,
    loads,
    resultants,
    totalLoad,
    loadMomentAboutA,
    appliedMomentSum,
    RA,
    RB,
    fixedMoment,
    E,
    I,
    EI,
    sectionX,
  }

  const xs = buildSampleXs(L, loads, sectionX)

  const curve = computeSlopeDeflection(baseResult, xs, EI)

  const values = xs.map((x, index) => {
    const sm = shearMomentAt(baseResult, x)
    const def = curve[index]

    return {
      x,
      shear: sm.shear,
      moment: sm.moment,
      curvature: def.curvature,
      slope: def.slope,
      deflection: def.deflection,
      deflectionMm: def.deflectionMm,
    }
  })

  const closestToSection = values.reduce((best, item) =>
    Math.abs(item.x - sectionX) < Math.abs(best.x - sectionX) ? item : best
  )

  const maxAbsDeflection = values.reduce((best, item) =>
    Math.abs(item.deflectionMm) > Math.abs(best.deflectionMm) ? item : best
  )

  const maxAbsSlope = values.reduce((best, item) =>
    Math.abs(item.slope) > Math.abs(best.slope) ? item : best
  )

  const maxAbsBM = values.reduce((best, item) =>
    Math.abs(item.moment) > Math.abs(best.moment) ? item : best
  )

  const warnings = []

  loads.forEach((load, index) => {
    if ((load.type === 'udl' || load.type === 'uvl') && load.length <= 0) {
      warnings.push(`Load ${index + 1}: start and end position cannot be same.`)
    }
  })

  if (beamType === 'simple' && (RA < 0 || RB < 0)) {
    warnings.push('One support reaction is negative. Uplift may occur for the given loading.')
  }

  return {
    ...baseResult,
    values,
    section: closestToSection,
    maxAbsDeflection,
    maxAbsSlope,
    maxAbsBM,
    warnings,
    summary:
      beamType === 'simple'
        ? [
            { label: 'Left Reaction RA', value: `${fmt(RA, 3)} kN` },
            { label: 'Right Reaction RB', value: `${fmt(RB, 3)} kN` },
            { label: 'Slope at x', value: `${fmt(closestToSection.slope, 6)} rad` },
            { label: 'Deflection at x', value: `${fmt(closestToSection.deflectionMm, 4)} mm` },
          ]
        : [
            { label: 'Fixed Reaction', value: `${fmt(RA, 3)} kN` },
            { label: 'Fixed End Moment', value: `${fmt(fixedMoment, 3)} kN·m` },
            { label: 'Slope at x', value: `${fmt(closestToSection.slope, 6)} rad` },
            { label: 'Deflection at x', value: `${fmt(closestToSection.deflectionMm, 4)} mm` },
          ],
    formulas: [
      'Support reactions are calculated using ΣV = 0 and ΣM = 0',
      'Bending moment function M(x) is generated from combined loads',
      'Moment-curvature relation: EI × d²y/dx² = M(x)',
      'Slope θ is obtained by integrating M/EI once',
      'Deflection y is obtained by integrating M/EI twice',
      'Simply supported beam boundary conditions: y(0) = 0 and y(L) = 0',
      'Cantilever beam boundary conditions: θ(0) = 0 and y(0) = 0',
      'Maximum deflection is found from the generated elastic curve',
    ],
    steps: [
      `Beam type selected: ${beamType === 'simple' ? 'Simply Supported Beam' : 'Cantilever Beam'}.`,
      `Beam span L = ${fmt(L, 3)} m.`,
      `Modulus of elasticity E = ${fmt(E, 3)} GPa and moment of inertia I = ${fmt(I, 3)} ×10⁶ mm⁴.`,
      `Equivalent EI = E × I = ${fmt(EI, 3)} kN·m².`,
      `Total downward load from all vertical loads = ${fmt(totalLoad, 3)} kN.`,
      `Moment of all vertical loads about reference support = ${fmt(loadMomentAboutA, 3)} kN·m.`,
      `Net applied moment using clockwise positive convention = ${fmt(appliedMomentSum, 3)} kN·m.`,
      beamType === 'simple'
        ? `Support reactions: RA = ${fmt(RA, 3)} kN and RB = ${fmt(RB, 3)} kN.`
        : `Fixed reaction = ${fmt(RA, 3)} kN and fixed end moment = ${fmt(fixedMoment, 3)} kN·m.`,
      `Bending moment values are calculated along the beam and converted into curvature using M/EI.`,
      `Curvature is integrated once to obtain slope curve and twice to obtain deflection curve.`,
      `At selected section x = ${fmt(sectionX, 3)} m, slope = ${fmt(closestToSection.slope, 6)} rad and deflection = ${fmt(closestToSection.deflectionMm, 4)} mm.`,
      `Maximum absolute deflection = ${fmt(maxAbsDeflection.deflectionMm, 4)} mm at x = ${fmt(maxAbsDeflection.x, 3)} m.`,
    ],
    examAnswer:
      beamType === 'simple'
        ? `For the given simply supported beam, support reactions are RA = ${fmt(RA, 3)} kN and RB = ${fmt(RB, 3)} kN. At x = ${fmt(sectionX, 3)} m, slope is ${fmt(closestToSection.slope, 6)} rad and deflection is ${fmt(closestToSection.deflectionMm, 4)} mm. Maximum absolute deflection is ${fmt(maxAbsDeflection.deflectionMm, 4)} mm at x = ${fmt(maxAbsDeflection.x, 3)} m.`
        : `For the given cantilever beam, fixed reaction is ${fmt(RA, 3)} kN and fixed end moment is ${fmt(fixedMoment, 3)} kN·m. At x = ${fmt(sectionX, 3)} m from fixed support, slope is ${fmt(closestToSection.slope, 6)} rad and deflection is ${fmt(closestToSection.deflectionMm, 4)} mm. Maximum absolute deflection is ${fmt(maxAbsDeflection.deflectionMm, 4)} mm at x = ${fmt(maxAbsDeflection.x, 3)} m.`,
  }
}

function getKeyRows(result) {
  const xs = [0, result.sectionX, result.L, result.maxAbsDeflection.x, result.maxAbsBM.x]

  result.loads.forEach((load) => {
    if (load.type === 'point' || load.type === 'moment') {
      xs.push(load.x)
    }

    if (load.type === 'udl' || load.type === 'uvl') {
      xs.push(load.start, (load.start + load.end) / 2, load.end)
    }
  })

  const uniqueXs = [...new Set(xs.map((x) => Number(clamp(x, 0, result.L).toFixed(6))))].sort((a, b) => a - b)

  return uniqueXs.map((x) => {
    const nearest = result.values.reduce((best, item) =>
      Math.abs(item.x - x) < Math.abs(best.x - x) ? item : best
    )

    return {
      point:
        x === 0
          ? result.beamType === 'simple'
            ? 'Support A'
            : 'Fixed Support'
          : x === result.L
            ? result.beamType === 'simple'
              ? 'Support B'
              : 'Free End'
            : Math.abs(x - result.sectionX) < 0.000001
              ? 'Selected Section'
              : Math.abs(x - result.maxAbsDeflection.x) < 0.000001
                ? 'Max Deflection Point'
                : 'Load / Key Point',
      x,
      shear: nearest.shear,
      moment: nearest.moment,
      slope: nearest.slope,
      deflectionMm: nearest.deflectionMm,
    }
  })
}

function cleanHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function buildPlainReport(result, form) {
  const keyRows = getKeyRows(result)

  const loadSummary = result.resultants
    .map((item, index) => {
      const W = item.load.type === 'moment' ? '-' : `${fmt(item.W, 3)} kN`
      const moment =
        item.load.type === 'moment'
          ? `${fmt(getMomentSign(item.load) * item.load.M, 3)} kN·m`
          : `${fmt(item.W * item.xBar, 3)} kN·m`

      return `${index + 1}. ${item.label}
   Resultant W: ${W}
   Location x̄: ${fmt(item.xBar, 3)} m
   Moment: ${moment}`
    })
    .join('\n\n')

  const keyValues = keyRows
    .map(
      (row) =>
        `${row.point} | x = ${fmt(row.x, 3)} m | SF = ${fmt(row.shear, 3)} kN | BM = ${fmt(row.moment, 3)} kN·m | Slope = ${fmt(row.slope, 6)} rad | Deflection = ${fmt(row.deflectionMm, 4)} mm`
    )
    .join('\n')

  return `
${form.reportTitle || 'Slope & Deflection Report'}
Prepared By: ${form.preparedBy || '-'}
Beam Type: ${result.beamType === 'simple' ? 'Simply Supported Beam' : 'Cantilever Beam'}
Span L: ${fmt(result.L, 3)} m
E: ${fmt(result.E, 3)} GPa
I: ${fmt(result.I, 3)} ×10⁶ mm⁴

RESULT SUMMARY
${result.summary.map((item) => `${item.label}: ${item.value}`).join('\n')}
Maximum Deflection: ${fmt(result.maxAbsDeflection.deflectionMm, 4)} mm at x = ${fmt(result.maxAbsDeflection.x, 3)} m
Maximum Slope: ${fmt(result.maxAbsSlope.slope, 6)} rad at x = ${fmt(result.maxAbsSlope.x, 3)} m

LOAD RESULTANT SUMMARY
${loadSummary}

KEY VALUES
${keyValues}

FORMULAS USED
${result.formulas.map((formula, index) => `${index + 1}. ${formula}`).join('\n')}

STEP-BY-STEP SOLUTION
${result.steps.map((step, index) => `${index + 1}. ${step}`).join('\n')}

FINAL ANSWER
${result.examAnswer}
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
  const keyRows = getKeyRows(result)

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

  const loadRows = result.resultants
    .map((item, index) => {
      const W = item.load.type === 'moment' ? '-' : `${fmt(item.W, 3)} kN`
      const moment =
        item.load.type === 'moment'
          ? `${fmt(getMomentSign(item.load) * item.load.M, 3)} kN·m`
          : `${fmt(item.W * item.xBar, 3)} kN·m`

      return `
        <tr>
          <td>${index + 1}. ${cleanHtml(item.label)}</td>
          <td>${cleanHtml(W)}</td>
          <td>${fmt(item.xBar, 3)} m</td>
          <td>${cleanHtml(moment)}</td>
        </tr>
      `
    })
    .join('')

  const keyRowsHtml = keyRows
    .map(
      (row) => `
        <tr>
          <td>${cleanHtml(row.point)}</td>
          <td>${fmt(row.x, 3)} m</td>
          <td>${fmt(row.shear, 3)} kN</td>
          <td>${fmt(row.moment, 3)} kN·m</td>
          <td>${fmt(row.slope, 6)} rad</td>
          <td>${fmt(row.deflectionMm, 4)} mm</td>
        </tr>
      `
    )
    .join('')

  const formulasHtml = result.formulas.map((formula) => `<li>${cleanHtml(formula)}</li>`).join('')
  const stepsHtml = result.steps.map((step, index) => `<li><strong>Step ${index + 1}:</strong> ${cleanHtml(step)}</li>`).join('')

  return `
<!doctype html>
<html>
<head>
  <title>${cleanHtml(form.reportTitle || 'Slope & Deflection Report')}</title>
  <meta charset="utf-8" />
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 28px;
      color: #111827;
      background: #ffffff;
    }

    .page {
      max-width: 980px;
      margin: 0 auto;
    }

    .header {
      border-bottom: 4px solid #f97316;
      padding-bottom: 16px;
      margin-bottom: 24px;
    }

    h1 {
      margin: 0;
      color: #0f172a;
      font-size: 30px;
    }

    .sub {
      margin-top: 8px;
      color: #475569;
      font-size: 14px;
      line-height: 1.6;
    }

    h2 {
      margin-top: 28px;
      border-left: 5px solid #f97316;
      padding-left: 10px;
      color: #0f172a;
      font-size: 20px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
      margin-top: 12px;
    }

    th {
      background: #0f172a;
      color: #fff;
      padding: 10px;
      text-align: left;
      border: 1px solid #cbd5e1;
    }

    td {
      padding: 10px;
      border: 1px solid #cbd5e1;
      vertical-align: top;
    }

    li {
      margin-bottom: 8px;
      line-height: 1.6;
    }

    .answer {
      background: #fff7ed;
      border: 1px solid #fdba74;
      border-radius: 10px;
      padding: 14px;
      line-height: 1.7;
      font-weight: 600;
    }

    .footer {
      margin-top: 30px;
      padding-top: 12px;
      border-top: 1px solid #cbd5e1;
      color: #64748b;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="page">
    <div class="header">
      <h1>${cleanHtml(form.reportTitle || 'Slope & Deflection Report')}</h1>
      <div class="sub">
        Prepared By: ${cleanHtml(form.preparedBy || '-')}<br/>
        Beam Type: ${result.beamType === 'simple' ? 'Simply Supported Beam' : 'Cantilever Beam'}<br/>
        Span L: ${fmt(result.L, 3)} m<br/>
        E = ${fmt(result.E, 3)} GPa, I = ${fmt(result.I, 3)} ×10⁶ mm⁴
      </div>
    </div>

    <h2>Result Summary</h2>
    <table><tbody>${summaryRows}</tbody></table>

    <h2>Load Resultant Summary</h2>
    <table>
      <thead>
        <tr>
          <th>Load</th>
          <th>Resultant W</th>
          <th>Location x̄</th>
          <th>Moment About Reference</th>
        </tr>
      </thead>
      <tbody>${loadRows}</tbody>
    </table>

    <h2>SFD, BMD, Slope & Deflection Key Values</h2>
    <table>
      <thead>
        <tr>
          <th>Point</th>
          <th>x</th>
          <th>SF</th>
          <th>BM</th>
          <th>Slope</th>
          <th>Deflection</th>
        </tr>
      </thead>
      <tbody>${keyRowsHtml}</tbody>
    </table>

    <h2>Formulas Used</h2>
    <ol>${formulasHtml}</ol>

    <h2>Step-by-Step Solution</h2>
    <ol>${stepsHtml}</ol>

    <h2>Final Answer</h2>
    <div class="answer">${cleanHtml(result.examAnswer)}</div>

    <div class="footer">Generated using CivilCalc Pro Slope & Deflection Calculator.</div>
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

function TextField({ label, value, onChange, helper, placeholder }) {
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

function LoadEditor({ load, index, L, onChange, onDelete }) {
  const update = (key, value) => onChange(load.id, key, value)

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-black text-orange-300">Load {index + 1}</p>
          <h3 className="mt-1 text-lg font-black text-white">
            {load.type === 'point' && 'Point Load'}
            {load.type === 'udl' && 'UDL'}
            {load.type === 'uvl' && 'UVL / Trapezoidal Load'}
            {load.type === 'moment' && 'Moment Load'}
          </h3>
        </div>

        <button
          type="button"
          onClick={() => onDelete(load.id)}
          className="rounded-lg border border-red-500/30 px-3 py-2 text-xs font-bold text-red-300 hover:bg-red-500/10"
        >
          Delete
        </button>
      </div>

      <SelectField label="Load Type" value={load.type} onChange={(value) => update('type', value)}>
        <option value="point">Point Load</option>
        <option value="udl">UDL</option>
        <option value="uvl">UVL / Trapezoidal</option>
        <option value="moment">Moment Load</option>
      </SelectField>

      <div className="mt-4 space-y-4">
        {load.type === 'point' && (
          <>
            <NumberField
              label="Point Load P"
              value={load.P}
              onChange={(value) => update('P', value)}
              suffix="kN"
              helper="Downward concentrated load."
              min="0"
            />

            <NumberField
              label="Position x"
              value={load.x}
              onChange={(value) => update('x', value)}
              suffix="m"
              helper={`Position from left/fixed support. Keep between 0 and ${fmt(L, 2)} m.`}
              min="0"
            />
          </>
        )}

        {load.type === 'udl' && (
          <>
            <NumberField
              label="UDL Intensity w"
              value={load.w}
              onChange={(value) => update('w', value)}
              suffix="kN/m"
              helper="Uniform load intensity."
              min="0"
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <NumberField
                label="Start Position"
                value={load.start}
                onChange={(value) => update('start', value)}
                suffix="m"
                helper="Load start from support."
                min="0"
              />

              <NumberField
                label="End Position"
                value={load.end}
                onChange={(value) => update('end', value)}
                suffix="m"
                helper="Load end from support."
                min="0"
              />
            </div>
          </>
        )}

        {load.type === 'uvl' && (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <NumberField
                label="Start Intensity w1"
                value={load.w1}
                onChange={(value) => update('w1', value)}
                suffix="kN/m"
                helper="Intensity at start."
                min="0"
              />

              <NumberField
                label="End Intensity w2"
                value={load.w2}
                onChange={(value) => update('w2', value)}
                suffix="kN/m"
                helper="Intensity at end."
                min="0"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <NumberField
                label="Start Position"
                value={load.start}
                onChange={(value) => update('start', value)}
                suffix="m"
                helper="UVL start position."
                min="0"
              />

              <NumberField
                label="End Position"
                value={load.end}
                onChange={(value) => update('end', value)}
                suffix="m"
                helper="UVL end position."
                min="0"
              />
            </div>
          </>
        )}

        {load.type === 'moment' && (
          <>
            <NumberField
              label="Moment M"
              value={load.M}
              onChange={(value) => update('M', value)}
              suffix="kN·m"
              helper="Applied concentrated moment."
              min="0"
            />

            <NumberField
              label="Position x"
              value={load.x}
              onChange={(value) => update('x', value)}
              suffix="m"
              helper="Moment position from left/fixed support."
              min="0"
            />

            <SelectField
              label="Moment Direction"
              value={load.direction}
              onChange={(value) => update('direction', value)}
              helper="Clockwise is taken as positive for reaction calculation."
            >
              <option value="clockwise">Clockwise</option>
              <option value="anticlockwise">Anticlockwise</option>
            </SelectField>
          </>
        )}
      </div>
    </div>
  )
}

function BeamSketch({ result }) {
  const x0 = 70
  const x1 = 570
  const y = 125
  const L = result.L || 1
  const mapX = (x) => x0 + (x / L) * (x1 - x0)
  const isSimple = result.beamType === 'simple'

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-950 p-4">
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-black text-white">Beam Loading Diagram</h3>
        <span className="rounded-full bg-orange-500/10 px-3 py-1 text-xs font-bold text-orange-300">
          Combined loads
        </span>
      </div>

      <svg viewBox="0 0 640 260" className="h-auto w-full">
        <line x1={x0} y1={y} x2={x1} y2={y} stroke="#cbd5e1" strokeWidth="7" strokeLinecap="round" />

        {isSimple ? (
          <>
            <polygon points={`${x0 - 18},${y + 35} ${x0 + 18},${y + 35} ${x0},${y + 6}`} fill="#38bdf8" />
            <line x1={x0 - 30} y1={y + 38} x2={x0 + 30} y2={y + 38} stroke="#38bdf8" strokeWidth="3" />
            <text x={x0 - 7} y={y + 65} fill="#e2e8f0" fontSize="14" fontWeight="700">A</text>

            <circle cx={x1} cy={y + 24} r="12" fill="none" stroke="#38bdf8" strokeWidth="3" />
            <line x1={x1 - 30} y1={y + 38} x2={x1 + 30} y2={y + 38} stroke="#38bdf8" strokeWidth="3" />
            <text x={x1 - 7} y={y + 65} fill="#e2e8f0" fontSize="14" fontWeight="700">B</text>
          </>
        ) : (
          <>
            <rect x={x0 - 32} y={y - 58} width="28" height="116" fill="#38bdf8" opacity="0.9" />
            {[-45, -25, -5, 15, 35, 55].map((dy) => (
              <line
                key={dy}
                x1={x0 - 44}
                y1={y + dy + 12}
                x2={x0 - 4}
                y2={y + dy - 12}
                stroke="#0f172a"
                strokeWidth="2"
              />
            ))}
            <text x={x0 - 45} y={y + 82} fill="#e2e8f0" fontSize="14" fontWeight="700">
              Fixed
            </text>
          </>
        )}

        {result.loads.map((load, index) => {
          if (load.type === 'point') {
            const lx = mapX(load.x)

            return (
              <g key={load.id}>
                <line x1={lx} y1="38" x2={lx} y2={y - 8} stroke="#f97316" strokeWidth="4" />
                <polygon points={`${lx - 9},${y - 18} ${lx + 9},${y - 18} ${lx},${y - 4}`} fill="#f97316" />
                <text x={lx - 28} y="28" fill="#fed7aa" fontSize="13" fontWeight="800">
                  P{index + 1}={fmt(load.P, 1)}
                </text>
              </g>
            )
          }

          if (load.type === 'udl') {
            const sx = mapX(load.start)
            const ex = mapX(load.end)
            const positions = Array.from({ length: 7 }, (_, i) => sx + ((ex - sx) * i) / 6)

            return (
              <g key={load.id}>
                <rect x={sx} y="48" width={Math.max(ex - sx, 0)} height={y - 58} fill="rgba(249,115,22,0.08)" />
                <line x1={sx} y1="48" x2={ex} y2="48" stroke="#f97316" strokeWidth="3" />
                {positions.map((px) => (
                  <g key={px}>
                    <line x1={px} y1="50" x2={px} y2={y - 8} stroke="#f97316" strokeWidth="2.5" />
                    <polygon points={`${px - 6},${y - 18} ${px + 6},${y - 18} ${px},${y - 6}`} fill="#f97316" />
                  </g>
                ))}
                <text x={sx + 6} y="38" fill="#fed7aa" fontSize="13" fontWeight="800">
                  UDL {fmt(load.w, 1)}
                </text>
              </g>
            )
          }

          if (load.type === 'uvl') {
            const sx = mapX(load.start)
            const ex = mapX(load.end)
            const maxW = Math.max(load.w1, load.w2, 0.001)
            const h1 = 18 + (load.w1 / maxW) * 70
            const h2 = 18 + (load.w2 / maxW) * 70
            const positions = Array.from({ length: 7 }, (_, i) => {
              const ratio = i / 6
              return {
                px: sx + (ex - sx) * ratio,
                h: h1 + (h2 - h1) * ratio,
              }
            })

            return (
              <g key={load.id}>
                <polygon
                  points={`${sx},${y - 8} ${sx},${y - h1} ${ex},${y - h2} ${ex},${y - 8}`}
                  fill="rgba(249,115,22,0.12)"
                  stroke="#f97316"
                  strokeWidth="2"
                />
                {positions.map((item) => (
                  <g key={item.px}>
                    <line x1={item.px} y1={y - item.h} x2={item.px} y2={y - 8} stroke="#f97316" strokeWidth="2.5" />
                    <polygon points={`${item.px - 6},${y - 18} ${item.px + 6},${y - 18} ${item.px},${y - 6}`} fill="#f97316" />
                  </g>
                ))}
                <text x={sx + 6} y="35" fill="#fed7aa" fontSize="13" fontWeight="800">
                  UVL {fmt(load.w1, 1)}→{fmt(load.w2, 1)}
                </text>
              </g>
            )
          }

          const lx = mapX(load.x)
          const clockwise = load.direction === 'clockwise'

          return (
            <g key={load.id}>
              <path
                d={
                  clockwise
                    ? `M ${lx - 25} ${y - 35} A 26 26 0 1 1 ${lx + 20} ${y - 15}`
                    : `M ${lx + 25} ${y - 35} A 26 26 0 1 0 ${lx - 20} ${y - 15}`
                }
                fill="none"
                stroke="#a78bfa"
                strokeWidth="4"
              />
              <polygon
                points={
                  clockwise
                    ? `${lx + 15},${y - 5} ${lx + 30},${y - 12} ${lx + 18},${y - 22}`
                    : `${lx - 15},${y - 5} ${lx - 30},${y - 12} ${lx - 18},${y - 22}`
                }
                fill="#a78bfa"
              />
              <text x={lx - 32} y={y - 55} fill="#ddd6fe" fontSize="13" fontWeight="800">
                M={fmt(load.M, 1)}
              </text>
            </g>
          )
        })}

        <line x1={x0} y1={y + 105} x2={x1} y2={y + 105} stroke="#64748b" strokeWidth="2" />
        <line x1={x0} y1={y + 97} x2={x0} y2={y + 113} stroke="#64748b" strokeWidth="2" />
        <line x1={x1} y1={y + 97} x2={x1} y2={y + 113} stroke="#64748b" strokeWidth="2" />
        <text x={(x0 + x1) / 2 - 20} y={y + 130} fill="#f97316" fontSize="14" fontWeight="800">
          L = {fmt(result.L, 2)} m
        </text>

        <text x="18" y="245" fill="#94a3b8" fontSize="13">
          Load diagram used to generate SFD, BMD, slope and deflection curve.
        </text>
      </svg>
    </div>
  )
}

function CurveDiagram({ result, type }) {
  const x0 = 70
  const x1 = 570
  const yBase = 110
  const amp = 72
  const L = result.L || 1
  const mapX = (x) => x0 + (x / L) * (x1 - x0)

 const getValue = (item) => {
  if (type === 'sfd') return item.shear
  if (type === 'bmd') return item.moment
  if (type === 'mei') return item.curvature
  if (type === 'slope') return item.slope
  return item.deflectionMm
}
  const values = result.values || []
  const maxAbs = Math.max(...values.map((item) => Math.abs(getValue(item))), 1)

  const points = values
    .map((item) => {
      const value = getValue(item)
      const y =
       type === 'bmd' || type === 'mei' || type === 'deflection'
          ? yBase + (value / maxAbs) * amp
          : yBase - (value / maxAbs) * amp

      return `${mapX(item.x)},${y}`
    })
    .join(' ')

  const meta = {
  sfd: ['Shear Force Diagram', '#f97316', 'SF values along beam.'],
  bmd: ['Bending Moment Diagram', '#38bdf8', 'BM values used for M/EI calculation.'],
  mei: ['M/EI Diagram', '#eab308', 'M/EI diagram represents curvature of the beam.'],
  slope: ['Slope Curve', '#a78bfa', 'Slope curve obtained by integrating M/EI once.'],
  deflection: ['Deflection / Elastic Curve', '#22c55e', 'Deflection curve obtained by integrating M/EI twice.'],
}[type]

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-950 p-4">
      <h3 className="mb-3 text-lg font-black text-white">{meta[0]}</h3>

      <svg viewBox="0 0 640 240" className="h-auto w-full">
        <line x1={x0} y1={yBase} x2={x1} y2={yBase} stroke="#64748b" strokeWidth="2" strokeDasharray="6 6" />
        <line x1={x0} y1="30" x2={x0} y2="190" stroke="#334155" strokeWidth="2" />
        <line x1={x1} y1="30" x2={x1} y2="190" stroke="#334155" strokeWidth="2" />

        <polyline points={points} fill="none" stroke={meta[1]} strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" />

        <line
          x1={mapX(result.sectionX)}
          y1="34"
          x2={mapX(result.sectionX)}
          y2="190"
          stroke="#eab308"
          strokeWidth="1.5"
          strokeDasharray="5 5"
        />

        <text x={x0 - 10} y="212" fill="#cbd5e1" fontSize="13" fontWeight="700">
          {result.beamType === 'simple' ? 'A' : 'Fixed'}
        </text>
        <text x={x1 - 16} y="212" fill="#cbd5e1" fontSize="13" fontWeight="700">
          {result.beamType === 'simple' ? 'B' : 'Free'}
        </text>

        <text x="18" y="22" fill="#94a3b8" fontSize="13">
          {meta[2]}
        </text>
      </svg>
    </div>
  )
}

function KeyValuesTable({ result }) {
  const rows = getKeyRows(result)

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
      <h2 className="text-2xl font-black text-white">Key Values Table</h2>
      <p className="mt-2 text-sm leading-6 text-slate-400">
        Important values at supports, load points, selected section and maximum deflection point.
      </p>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-800">
        <table className="w-full min-w-[900px] border-collapse text-left">
          <thead className="bg-slate-950">
            <tr>
              <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">Point</th>
              <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">x</th>
              <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">SF</th>
              <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">BM</th>
              <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">Slope</th>
              <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">Deflection</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => {
  const isSelected = Math.abs(row.x - result.sectionX) < 0.000001

  return (
    <tr
      key={`${row.point}-${row.x}`}
      className={isSelected ? 'bg-sky-500/10' : 'bg-slate-900/50'}
    >
                <td className="border-b border-slate-800 px-4 py-3 text-sm font-bold text-slate-200">{row.point}</td>
                <td className="border-b border-slate-800 px-4 py-3 text-sm text-orange-300">{fmt(row.x, 3)} m</td>
                <td className="border-b border-slate-800 px-4 py-3 text-sm text-slate-300">{fmt(row.shear, 3)} kN</td>
                <td className="border-b border-slate-800 px-4 py-3 text-sm text-slate-300">{fmt(row.moment, 3)} kN·m</td>
                <td className="border-b border-slate-800 px-4 py-3 text-sm text-slate-300">{fmt(row.slope, 6)} rad</td>
                <td className="border-b border-slate-800 px-4 py-3 text-sm text-slate-300">{fmt(row.deflectionMm, 4)} mm</td>
                 </tr>
  )
})}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function LoadSummaryTable({ result }) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
      <h2 className="text-2xl font-black text-white">Load Resultant Summary</h2>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-800">
        <table className="w-full min-w-[760px] border-collapse text-left">
          <thead className="bg-slate-950">
            <tr>
              <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">Load</th>
              <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">Resultant W</th>
              <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">Location x̄</th>
              <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">Moment About Reference</th>
            </tr>
          </thead>

          <tbody>
            {result.resultants.map((item, index) => (
              <tr key={item.load.id} className="bg-slate-900/50">
                <td className="border-b border-slate-800 px-4 py-3 text-sm font-bold text-slate-200">
                  {index + 1}. {item.label}
                </td>
                <td className="border-b border-slate-800 px-4 py-3 text-sm text-orange-300">
                  {item.load.type === 'moment' ? '-' : `${fmt(item.W, 3)} kN`}
                </td>
                <td className="border-b border-slate-800 px-4 py-3 text-sm text-slate-300">{fmt(item.xBar, 3)} m</td>
                <td className="border-b border-slate-800 px-4 py-3 text-sm text-slate-300">
                  {item.load.type === 'moment'
                    ? `${fmt(getMomentSign(item.load) * item.load.M, 3)} kN·m`
                    : `${fmt(item.W * item.xBar, 3)} kN·m`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
            onClick={() => copyToClipboard(result.examAnswer, 'Final answer copied.')}
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
function MethodExplanationPanel() {
  const steps = [
    {
      title: '1. Load Diagram',
      text: 'All point loads, UDL, UVL/trapezoidal loads and moment loads are placed on the beam.',
    },
    {
      title: '2. Support Reactions',
      text: 'Reactions are calculated using equilibrium equations ΣV = 0 and ΣM = 0.',
    },
    {
      title: '3. SFD and BMD',
      text: 'Shear force and bending moment values are generated along the beam length.',
    },
    {
      title: '4. M/EI Diagram',
      text: 'Bending moment values are divided by EI to obtain curvature of the beam.',
    },
    {
      title: '5. Slope Curve',
      text: 'Slope is obtained by integrating the M/EI diagram once.',
    },
    {
      title: '6. Deflection Curve',
      text: 'Deflection is obtained by integrating the slope curve once more.',
    },
  ]

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-2xl font-black text-white">Method Used</h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            This follows the same concept used in moment area method and conjugate beam method.
          </p>
        </div>

        <div className="rounded-2xl border border-sky-500/30 bg-sky-500/10 px-4 py-3 text-sm leading-6 text-sky-100">
          Negative deflection means downward deflection.
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {steps.map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-slate-800 bg-slate-950 p-4"
          >
            <p className="font-black text-orange-300">{item.title}</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">{item.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-2xl border border-orange-500/20 bg-orange-500/10 p-4 text-sm leading-7 text-slate-300">
        Moment area method relation: change in slope equals area of the M/EI diagram,
        and deflection is obtained from the first moment of that M/EI area. This tool
        uses numerical integration so combined loading cases can also be solved.
      </div>
    </div>
  )
}
function FormulaLibrary() {
  const formulas = [
    ['Moment-curvature relation', 'EI × d²y/dx² = M(x)'],
    ['Slope', 'θ = ∫ M/EI dx'],
    ['Deflection', 'y = ∫∫ M/EI dx dx'],
    ['Simply supported BC', 'y(0) = 0, y(L) = 0'],
    ['Cantilever BC', 'θ(0) = 0, y(0) = 0'],
    ['Moment area concept', 'Change in slope = area of M/EI diagram'],
    ['Tangential deviation', 'Deviation = first moment of M/EI area'],
    ['Conjugate beam concept', 'M/EI diagram acts as load on conjugate beam'],
  ]

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
      <h2 className="text-2xl font-black text-white">Formula Library</h2>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {formulas.map((item) => (
          <div key={item[0]} className="rounded-2xl border border-orange-500/20 bg-orange-500/10 p-4">
            <p className="font-black text-white">{item[0]}</p>
            <p className="mt-2 text-sm font-bold text-orange-200">{item[1]}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function SlopeDeflectionPage() {
  const [form, setForm] = useState({
    reportTitle: 'Slope & Deflection Analysis',
    preparedBy: '',
    beamType: 'simple',
    L: 6,
    x: 3,
    E: 200,
    I: 300,
    loads: defaultLoads,
  })

  const result = useMemo(() => solveBeam(form), [form])

  const updateForm = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const addLoad = (type) => {
    setForm((prev) => ({
      ...prev,
      loads: [...prev.loads, createLoad(type, toNum(prev.L, 6))],
    }))
  }

  const updateLoad = (id, key, value) => {
    setForm((prev) => ({
      ...prev,
      loads: prev.loads.map((load) =>
        load.id === id
          ? {
              ...load,
              [key]: value,
            }
          : load
      ),
    }))
  }

  const deleteLoad = (id) => {
    setForm((prev) => ({
      ...prev,
      loads: prev.loads.length > 1 ? prev.loads.filter((load) => load.id !== id) : prev.loads,
    }))
  }

  const reset = () => {
    setForm({
      reportTitle: 'Slope & Deflection Analysis',
      preparedBy: '',
      beamType: 'simple',
      L: 6,
      x: 3,
      E: 200,
      I: 300,
      loads: defaultLoads,
    })
  }

  return (
    <main className="min-h-screen bg-[#050B1F] px-4 py-8 text-white md:px-8">
      <section className="mx-auto max-w-7xl">
        <div className="mb-8 rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 md:p-8">
          <p className="mb-3 text-sm font-extrabold uppercase tracking-widest text-orange-400">
            Civil Engineering Beam Deflection Solver
          </p>

          <h1 className="text-3xl font-black leading-tight md:text-5xl">
            Slope & Deflection Calculator
          </h1>

          <p className="mt-4 max-w-4xl text-base leading-8 text-slate-300 md:text-lg">
            Calculate support reactions, SFD, BMD, slope curve and deflection curve for simply supported and cantilever beams with point loads, UDL, UVL/trapezoidal loads and moment loads.
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
              <h2 className="text-2xl font-black text-white">Beam Setup</h2>

              <div className="mt-6 space-y-5">
                <TextField
                  label="Question / Report Title"
                  value={form.reportTitle}
                  onChange={(value) => updateForm('reportTitle', value)}
                  placeholder="Example: Deflection of Beam"
                  helper="This title appears in print/PDF report."
                />

                <TextField
                  label="Prepared By"
                  value={form.preparedBy}
                  onChange={(value) => updateForm('preparedBy', value)}
                  placeholder="Your name"
                  helper="Optional."
                />

                <SelectField
                  label="Beam Type"
                  value={form.beamType}
                  onChange={(value) => updateForm('beamType', value)}
                  helper="Simply supported: y(0)=0, y(L)=0. Cantilever: slope and deflection at fixed end are zero."
                >
                  <option value="simple">Simply Supported Beam</option>
                  <option value="cantilever">Cantilever Beam</option>
                </SelectField>

                <NumberField
                  label="Beam Span L"
                  value={form.L}
                  onChange={(value) => updateForm('L', value)}
                  suffix="m"
                  helper="Total length of beam."
                  min="0.1"
                />

                <NumberField
                  label={form.beamType === 'simple' ? 'Section x from Support A' : 'Section x from Fixed Support'}
                  value={form.x}
                  onChange={(value) => updateForm('x', value)}
                  suffix="m"
                  helper="Enter any section between 0 and L to get slope and deflection."
                  min="0"
                />

                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                  <h3 className="font-black text-white">Material & Section</h3>

                  <div className="mt-4 space-y-4">
                    <NumberField
                      label="Modulus of Elasticity E"
                      value={form.E}
                      onChange={(value) => updateForm('E', value)}
                      suffix="GPa"
                      helper="Example: Steel ≈ 200 GPa."
                      min="0.001"
                    />

                    <NumberField
                      label="Moment of Inertia I"
                      value={form.I}
                      onChange={(value) => updateForm('I', value)}
                      suffix="×10⁶ mm⁴"
                      helper="Enter I in million mm⁴. Example: 300 means 300×10⁶ mm⁴."
                      min="0.001"
                    />
                  </div>
                </div>
              </div>

              {result.warnings.length > 0 && (
                <div className="mt-5 space-y-2">
                  {result.warnings.map((warning) => (
                    <div key={warning} className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-4 text-sm leading-6 text-yellow-100">
                      {warning}
                    </div>
                  ))}
                </div>
              )}

              <button
                type="button"
                onClick={reset}
                className="mt-6 w-full rounded-xl border border-slate-700 px-5 py-3 font-bold text-slate-200 transition hover:border-orange-400 hover:text-orange-300"
              >
                Reset Example
              </button>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
              <h2 className="text-2xl font-black text-white">Load Builder</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Add multiple loads on the same beam. The tool solves combined slope and deflection.
              </p>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <button type="button" onClick={() => addLoad('point')} className="rounded-xl bg-orange-500 px-4 py-3 text-sm font-black text-white hover:bg-orange-600">
                  + Point
                </button>
                <button type="button" onClick={() => addLoad('udl')} className="rounded-xl bg-orange-500 px-4 py-3 text-sm font-black text-white hover:bg-orange-600">
                  + UDL
                </button>
                <button type="button" onClick={() => addLoad('uvl')} className="rounded-xl bg-orange-500 px-4 py-3 text-sm font-black text-white hover:bg-orange-600">
                  + UVL
                </button>
                <button type="button" onClick={() => addLoad('moment')} className="rounded-xl bg-orange-500 px-4 py-3 text-sm font-black text-white hover:bg-orange-600">
                  + Moment
                </button>
              </div>

              <div className="mt-6 space-y-5">
                {form.loads.map((load, index) => (
                  <LoadEditor
                    key={load.id}
                    load={load}
                    index={index}
                    L={toNum(form.L, 6)}
                    onChange={updateLoad}
                    onDelete={deleteLoad}
                  />
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
              <h2 className="text-xl font-black text-white">What This Tool Solves</h2>

              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
                <li>✓ Simply supported beam</li>
                <li>✓ Cantilever beam</li>
                <li>✓ Point load, UDL, UVL and moment load</li>
                <li>✓ Combined loading</li>
                <li>✓ SFD and BMD</li>
                <li>✓ Slope at any section x</li>
                <li>✓ Deflection at any section x</li>
                <li>✓ Maximum deflection and location</li>
                <li>✓ Slope curve and elastic curve</li>
                <li>✓ Copy / Print / Save PDF</li>
              </ul>
            </div>
          </aside>

          <section className="space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
              <h2 className="text-2xl font-black text-white">
                {result.beamType === 'simple' ? 'Simply Supported Beam Result' : 'Cantilever Beam Result'}
              </h2>

              <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {result.summary.map((item) => (
                  <div key={item.label} className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                    <p className="text-sm text-slate-400">{item.label}</p>
                    <p className="mt-2 text-xl font-black text-orange-300">{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border border-sky-500/30 bg-sky-500/10 p-4">
                  <p className="text-sm text-slate-300">Maximum Deflection</p>
                  <p className="mt-2 text-xl font-black text-sky-300">{fmt(result.maxAbsDeflection.deflectionMm, 4)} mm</p>
                </div>

                <div className="rounded-2xl border border-sky-500/30 bg-sky-500/10 p-4">
                  <p className="text-sm text-slate-300">Max Deflection Location</p>
                  <p className="mt-2 text-xl font-black text-sky-300">{fmt(result.maxAbsDeflection.x, 3)} m</p>
                </div>

                <div className="rounded-2xl border border-sky-500/30 bg-sky-500/10 p-4">
                  <p className="text-sm text-slate-300">Maximum Slope</p>
                  <p className="mt-2 text-xl font-black text-sky-300">{fmt(result.maxAbsSlope.slope, 6)} rad</p>
                </div>

                <div className="rounded-2xl border border-sky-500/30 bg-sky-500/10 p-4">
                  <p className="text-sm text-slate-300">Max |BM|</p>
                  <p className="mt-2 text-xl font-black text-sky-300">{fmt(result.maxAbsBM.moment, 3)} kN·m</p>
                </div>
              </div>
            </div>

          <ActionButtons result={result} form={form} />

<MethodExplanationPanel />

<BeamSketch result={result} />
           <div className="grid gap-6 xl:grid-cols-2">
  <CurveDiagram result={result} type="sfd" />
  <CurveDiagram result={result} type="bmd" />
</div>

<div className="grid gap-6 xl:grid-cols-2">
  <CurveDiagram result={result} type="mei" />
  <CurveDiagram result={result} type="slope" />
</div>

<CurveDiagram result={result} type="deflection" />
            <KeyValuesTable result={result} />

            <LoadSummaryTable result={result} />

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
                  {result.examAnswer}
                </p>

                <div className="mt-5 rounded-2xl border border-sky-500/20 bg-sky-500/10 p-4 text-sm leading-7 text-slate-300">
                  This tool uses moment-curvature relation and numerical integration, which is useful for combined loading cases.
                </div>
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

            <FormulaLibrary />
          </section>
        </div>
      </section>
    </main>
  )
}
