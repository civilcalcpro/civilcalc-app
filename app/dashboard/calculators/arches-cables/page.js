'use client'

import { useMemo, useState } from 'react'

const topicCards = [
  'Three-Hinged Arch',
  'Two-Hinged Arch',
  'Fixed Arch Basic',
  'Parabolic Arch',
  'Circular Arch',
  'Cable Under UDL',
  'Cable Under Point Loads',
  'Pinned / Hinged Support',
  'Roller Support',
  'Fixed Support',
  'Cable Anchorage',
  'Horizontal Thrust',
  'Support Reactions',
  'Bending Moment',
  'Normal Thrust',
  'Radial Shear',
  'Cable Sag',
  'Cable Tension',
  'Maximum Tension',
  'Step-by-step Solution',
]

const modeInfo = {
  threeHingedArch: {
    title: 'Three-Hinged Arch',
    desc: 'Best for exam questions. Crown hinge condition gives H = M₀c / yc.',
    recommendedSupport: 'threeHinged',
  },
  twoHingedArch: {
    title: 'Two-Hinged Arch',
    desc: 'Horizontal thrust by elastic method using numerical integration.',
    recommendedSupport: 'twoHinged',
  },
  fixedArchBasic: {
    title: 'Fixed Arch Basic',
    desc: 'Advanced fixed-fixed arch by compatibility using H, MA and MB as redundants.',
    recommendedSupport: 'fixedFixed',
  },
  cableUdl: {
    title: 'Cable under UDL',
    desc: 'Cable sag, horizontal tension and maximum tension for UDL.',
    recommendedSupport: 'cableAnchorage',
  },
  cablePointLoads: {
    title: 'Cable under Point Loads',
    desc: 'Cable polygon, horizontal tension and segment tension using known sag.',
    recommendedSupport: 'cableAnchorage',
  },
}

const supportPresets = {
  auto: {
    title: 'Auto Recommended Support',
    left: 'Auto',
    right: 'Auto',
    crown: 'Based on selected problem type',
    note: 'CivilCalc will use the correct support model for the selected arch/cable problem.',
  },
  threeHinged: {
    title: 'Three-Hinged Arch Support',
    left: 'Hinge / Pin at A',
    right: 'Hinge / Pin at B',
    crown: 'Internal hinge at crown C',
    note: 'Moment at crown is zero, so horizontal thrust is obtained directly from crown moment.',
  },
  twoHinged: {
    title: 'Two-Hinged Arch Support',
    left: 'Hinge / Pin at A',
    right: 'Hinge / Pin at B',
    crown: 'No crown hinge',
    note: 'Horizontal movement is restrained. Horizontal thrust is found from elastic compatibility.',
  },
  fixedFixed: {
    title: 'Fixed-Fixed Arch Support',
    left: 'Fixed support at A',
    right: 'Fixed support at B',
    crown: 'No internal hinge',
    note: 'End rotations and horizontal displacement are restrained. Solver uses MA, MB and H as redundants.',
  },
  pinRoller: {
    title: 'Pin-Roller Reference Support',
    left: 'Pin support at A',
    right: 'Roller support at B',
    crown: 'No arch horizontal restraint',
    note: 'Useful for basic beam comparison only. Pure pin-roller is not a complete arch thrust model unless horizontal tie/anchorage exists.',
  },
  cableAnchorage: {
    title: 'Cable Anchorage Support',
    left: 'Cable anchorage / pin at A',
    right: 'Cable anchorage / pin at B',
    crown: 'Flexible cable, no bending moment',
    note: 'Cable supports provide anchorage reactions. Cable carries tension only and cannot carry bending moment.',
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

function createPointLoad(P = 40, x = 6) {
  return {
    id: `load-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    P,
    x,
  }
}

function defaultForm() {
  return {
    reportTitle: 'Arches & Cables Analysis',
    preparedBy: '',
    mode: 'threeHingedArch',
    supportSystem: 'auto',
    archType: 'parabolic',
    span: 20,
    rise: 5,
    sag: 4,
    sectionX: 8,
    udl: 10,
    EI: 1,
    sagPointX: 10,
    sagAtPoint: 4,
    showDetailedTable: true,
    pointLoads: [createPointLoad(40, 6), createPointLoad(30, 14)],
  }
}

function getEffectiveSupport(form) {
  if (form.supportSystem && form.supportSystem !== 'auto') return form.supportSystem
  return modeInfo[form.mode]?.recommendedSupport || 'auto'
}

function getSupportWarning(form) {
  const support = getEffectiveSupport(form)
  const mode = form.mode

  if ((mode === 'cableUdl' || mode === 'cablePointLoads') && support !== 'cableAnchorage') {
    return 'Cable problem me fixed/roller support physically correct nahi hota. Cable tension-only member hota hai, isliye anchorage support recommended hai.'
  }

  if (mode === 'threeHingedArch' && support !== 'threeHinged') {
    return 'Three-hinged arch ke liye A, B aur crown C par hinge condition required hoti hai. Calculation three-hinged formula se hogi.'
  }

  if (mode === 'twoHingedArch' && support !== 'twoHinged') {
    return 'Two-hinged arch ke liye dono supports hinged aur horizontal restraint required hota hai. Calculation elastic two-hinged method se hogi.'
  }

  if (mode === 'fixedArchBasic' && support !== 'fixedFixed') {
    return 'Fixed arch calculation ke liye fixed-fixed support condition required hoti hai. Calculation fixed-fixed compatibility method se hogi.'
  }

  return ''
}

function archY(L, h, x, type) {
  const safeL = Math.max(L, 0.001)
  const safeH = Math.max(h, 0.001)
  const cx = safeL / 2

  if (type === 'circular') {
    const R = (safeL * safeL) / (8 * safeH) + safeH / 2
    const cy = safeH - R
    const dx = x - cx
    const inside = Math.max(R * R - dx * dx, 0)
    return cy + Math.sqrt(inside)
  }

  return (4 * safeH * x * (safeL - x)) / (safeL * safeL)
}

function archDyDx(L, h, x, type) {
  const safeL = Math.max(L, 0.001)
  const safeH = Math.max(h, 0.001)
  const cx = safeL / 2

  if (type === 'circular') {
    const R = (safeL * safeL) / (8 * safeH) + safeH / 2
    const dx = x - cx
    const denom = Math.sqrt(Math.max(R * R - dx * dx, 0.000001))
    return -dx / denom
  }

  return (4 * safeH * (safeL - 2 * x)) / (safeL * safeL)
}

function getCleanPointLoads(pointLoads, L) {
  return pointLoads
    .map((load) => ({
      ...load,
      P: Math.max(toNum(load.P, 0), 0),
      x: clamp(toNum(load.x, 0), 0, L),
    }))
    .filter((load) => load.P > 0)
    .sort((a, b) => a.x - b.x)
}

function beamActions(L, w, pointLoads, endMomentA = 0, endMomentB = 0) {
  const safeL = Math.max(L, 0.001)
  const safeW = Math.max(w, 0)
  const loads = getCleanPointLoads(pointLoads, safeL)

  const totalPointLoad = loads.reduce((sum, load) => sum + load.P, 0)
  const totalLoad = safeW * safeL + totalPointLoad
  const momentAboutA =
    safeW * safeL * (safeL / 2) + loads.reduce((sum, load) => sum + load.P * load.x, 0)

  const VBss = momentAboutA / safeL
  const VAss = totalLoad - VBss
  const VA = VAss + (endMomentB - endMomentA) / safeL
  const VB = totalLoad - VA

  const shearAt = (xRaw) => {
    const x = clamp(xRaw, 0, safeL)
    return VA - safeW * x - loads.reduce((sum, load) => sum + (x >= load.x ? load.P : 0), 0)
  }

  const momentAt = (xRaw) => {
    const x = clamp(xRaw, 0, safeL)
    const base =
      VAss * x -
      (safeW * x * x) / 2 -
      loads.reduce((sum, load) => sum + (x >= load.x ? load.P * (x - load.x) : 0), 0)

    return base + endMomentA * (1 - x / safeL) + endMomentB * (x / safeL)
  }

  const baseMomentAt = (xRaw) => {
    const x = clamp(xRaw, 0, safeL)
    return (
      VAss * x -
      (safeW * x * x) / 2 -
      loads.reduce((sum, load) => sum + (x >= load.x ? load.P * (x - load.x) : 0), 0)
    )
  }

  const baseShearAt = (xRaw) => {
    const x = clamp(xRaw, 0, safeL)
    return VAss - safeW * x - loads.reduce((sum, load) => sum + (x >= load.x ? load.P : 0), 0)
  }

  return {
    L: safeL,
    w: safeW,
    pointLoads: loads,
    totalPointLoad,
    totalLoad,
    VA,
    VB,
    VAss,
    VBss,
    endMomentA,
    endMomentB,
    shearAt,
    momentAt,
    baseMomentAt,
    baseShearAt,
  }
}

function integrateSimpson(fn, a, b, n = 600) {
  const steps = n % 2 === 0 ? n : n + 1
  const h = (b - a) / steps
  let sum = 0

  for (let i = 0; i <= steps; i += 1) {
    const x = a + i * h
    const coeff = i === 0 || i === steps ? 1 : i % 2 === 0 ? 2 : 4
    sum += coeff * fn(x)
  }

  return (sum * h) / 3
}

function solveLinearSystem(matrix, rhs) {
  const n = rhs.length
  const a = matrix.map((row, i) => [...row, rhs[i]])

  for (let col = 0; col < n; col += 1) {
    let pivot = col
    for (let row = col + 1; row < n; row += 1) {
      if (Math.abs(a[row][col]) > Math.abs(a[pivot][col])) pivot = row
    }

    if (Math.abs(a[pivot][col]) < 1e-12) {
      throw new Error('Compatibility matrix is singular. Change geometry/load values.')
    }

    if (pivot !== col) {
      const temp = a[col]
      a[col] = a[pivot]
      a[pivot] = temp
    }

    const div = a[col][col]
    for (let j = col; j <= n; j += 1) a[col][j] /= div

    for (let row = 0; row < n; row += 1) {
      if (row === col) continue
      const factor = a[row][col]
      for (let j = col; j <= n; j += 1) a[row][j] -= factor * a[col][j]
    }
  }

  return a.map((row) => row[n])
}

function makeValidationNotes(form, L, pointLoads) {
  const notes = []
  const supportWarning = getSupportWarning(form)

  if (supportWarning) notes.push(supportWarning)
  if (L <= 0) notes.push('Span zero nahi ho sakta.')
  if ((form.mode === 'threeHingedArch' || form.mode === 'twoHingedArch' || form.mode === 'fixedArchBasic') && toNum(form.rise, 0) <= 0) {
    notes.push('Arch rise h zero se bada hona chahiye.')
  }
  if ((form.mode === 'cableUdl' || form.mode === 'cablePointLoads') && (toNum(form.sag, 0) <= 0 && toNum(form.sagAtPoint, 0) <= 0)) {
    notes.push('Cable sag zero se bada hona chahiye.')
  }
  if ((form.mode === 'threeHingedArch' || form.mode === 'twoHingedArch' || form.mode === 'fixedArchBasic') && toNum(form.udl, 0) === 0 && pointLoads.length === 0) {
    notes.push('Arch problem ke liye UDL ya point load me se kam se kam ek load add karo.')
  }
  if (form.mode === 'cablePointLoads' && pointLoads.length === 0) {
    notes.push('Cable under point loads ke liye kam se kam ek point load add karo.')
  }

  return notes
}

function solveArchCable(form) {
  const mode = form.mode
  const L = Math.max(toNum(form.span, 20), 0.001)
  const rise = Math.max(toNum(form.rise, 5), 0.001)
  const sag = Math.max(toNum(form.sag, 4), 0.001)
  const sectionX = clamp(toNum(form.sectionX, L / 2), 0, L)
  const udl = Math.max(toNum(form.udl, 0), 0)
  const EI = Math.max(toNum(form.EI, 1), 0.001)
  const pointLoads = getCleanPointLoads(form.pointLoads, L)
  const effectiveSupport = getEffectiveSupport(form)
  const supportData = supportPresets[effectiveSupport] || supportPresets.auto
  const validationNotes = makeValidationNotes(form, L, pointLoads)

  if (mode === 'cableUdl') {
    const H = udl > 0 ? (udl * L * L) / (8 * sag) : 0
    const VA = (udl * L) / 2
    const VB = VA
    const ySection = (4 * sag * sectionX * (L - sectionX)) / (L * L)
    const VSection = VA - udl * sectionX
    const tensionSection = Math.sqrt(H * H + VSection * VSection)
    const maxTension = Math.sqrt(H * H + VA * VA)
    const minTension = Math.abs(H)

    const diagramValues = Array.from({ length: 301 }, (_, i) => {
      const x = (L * i) / 300
      const y = (4 * sag * x * (L - x)) / (L * L)
      const V = VA - udl * x
      const T = Math.sqrt(H * H + V * V)
      return { x, ordinate: y, shear: V, moment: 0, beamMoment: 0, tension: T }
    })

    const summary = [
      { label: 'Support System', value: supportData.title },
      { label: 'Horizontal Tension H', value: `${fmt(H, 3)} kN` },
      { label: 'Vertical Reaction VA', value: `${fmt(VA, 3)} kN` },
      { label: 'Vertical Reaction VB', value: `${fmt(VB, 3)} kN` },
      { label: 'Tension at Section', value: `${fmt(tensionSection, 3)} kN` },
      { label: 'Maximum Tension', value: `${fmt(maxTension, 3)} kN` },
    ]

    const formulas = [
      'For cable under UDL over full span: H = wL² / 8f',
      'Vertical reactions: VA = VB = wL / 2',
      'Cable ordinate: y = 4fx(L - x) / L²',
      'Vertical component at section: Vx = VA - wx',
      'Cable tension at section: T = √(H² + Vx²)',
      'Minimum tension occurs near crown: Tmin = H',
      'Maximum tension occurs at support: Tmax = √(H² + VA²)',
    ]

    const steps = [
      `Support selected: ${supportData.title}. Cable carries tension only; bending moment is zero throughout the cable.`,
      `Given span L = ${fmt(L, 3)} m, sag f = ${fmt(sag, 3)} m and UDL w = ${fmt(udl, 3)} kN/m.`,
      `Total load W = w × L = ${fmt(udl, 3)} × ${fmt(L, 3)} = ${fmt(udl * L, 3)} kN.`,
      `Because loading is symmetrical, VA = VB = W/2 = ${fmt(VA, 3)} kN.`,
      `Horizontal tension H = wL²/8f = ${fmt(udl, 3)} × ${fmt(L, 3)}² / (8 × ${fmt(sag, 3)}) = ${fmt(H, 3)} kN.`,
      `At section x = ${fmt(sectionX, 3)} m, ordinate y = 4fx(L-x)/L² = ${fmt(ySection, 3)} m.`,
      `Vertical component Vx = VA - wx = ${fmt(VA, 3)} - ${fmt(udl, 3)} × ${fmt(sectionX, 3)} = ${fmt(VSection, 3)} kN.`,
      `Tension at section T = √(H² + Vx²) = ${fmt(tensionSection, 3)} kN.`,
      `Minimum tension = H = ${fmt(minTension, 3)} kN and maximum tension at support = ${fmt(maxTension, 3)} kN.`,
    ]

    const finalAnswer = `For cable under UDL, H = ${fmt(H, 3)} kN, VA = VB = ${fmt(VA, 3)} kN, tension at x = ${fmt(sectionX, 3)} m is ${fmt(tensionSection, 3)} kN and maximum tension is ${fmt(maxTension, 3)} kN.`

    return {
      mode,
      title: modeInfo[mode].title,
      L,
      rise: sag,
      sectionX,
      effectiveSupport,
      supportData,
      validationNotes,
      pointLoads: [],
      reactions: [
        { label: 'VA', value: VA, unit: 'kN' },
        { label: 'VB', value: VB, unit: 'kN' },
        { label: 'H', value: H, unit: 'kN' },
      ],
      sectionResults: [
        { label: 'Cable ordinate y', value: ySection, unit: 'm' },
        { label: 'Vertical component Vx', value: VSection, unit: 'kN' },
        { label: 'Tension at section', value: tensionSection, unit: 'kN' },
        { label: 'Minimum tension', value: minTension, unit: 'kN' },
        { label: 'Maximum tension', value: maxTension, unit: 'kN' },
      ],
      loadRows: [{ label: 'UDL over full span', value: `${fmt(udl, 3)} kN/m over ${fmt(L, 3)} m` }],
      segmentRows: [],
      diagramValues,
      summary,
      formulas,
      steps,
      finalAnswer,
      curveMode: 'cable',
    }
  }

  if (mode === 'cablePointLoads') {
    const beam = beamActions(L, 0, pointLoads)
    const sagPointX = clamp(toNum(form.sagPointX, L / 2), 0, L)
    const sagAtPoint = Math.max(toNum(form.sagAtPoint, sag), 0.001)
    const momentAtSagPoint = beam.baseMomentAt(sagPointX)

    if (Math.abs(momentAtSagPoint) < 1e-9) {
      throw new Error('Known sag point has zero bending moment. Sag point support par ya zero moment point par nahi hona chahiye.')
    }

    const H = momentAtSagPoint / sagAtPoint
    const keyPoints = [
      { x: 0, label: 'A' },
      ...pointLoads.map((load, index) => ({ x: load.x, label: `P${index + 1}` })),
      { x: L, label: 'B' },
    ]
      .sort((a, b) => a.x - b.x)
      .filter((item, index, arr) => index === 0 || Math.abs(item.x - arr[index - 1].x) > 1e-8)

    const ordinateAt = (x) => beam.baseMomentAt(x) / H
    const segmentRows = []

    for (let i = 0; i < keyPoints.length - 1; i += 1) {
      const a = keyPoints[i]
      const b = keyPoints[i + 1]
      const ya = ordinateAt(a.x)
      const yb = ordinateAt(b.x)
      const dx = Math.max(b.x - a.x, 0.001)
      const slope = (yb - ya) / dx
      const tension = Math.abs(H) * Math.sqrt(1 + slope * slope)
      segmentRows.push({
        segment: `${a.label}-${b.label}`,
        fromX: a.x,
        toX: b.x,
        fromY: ya,
        toY: yb,
        slope,
        tension,
      })
    }

    const maxTension = segmentRows.reduce((best, row) => (row.tension > best.tension ? row : best), segmentRows[0])
    const ySection = ordinateAt(sectionX)
    const activeSegment = segmentRows.find((row) => sectionX >= row.fromX - 1e-8 && sectionX <= row.toX + 1e-8) || segmentRows[0]
    const tensionSection = activeSegment?.tension || 0

    const diagramValues = Array.from({ length: 301 }, (_, i) => {
      const x = (L * i) / 300
      const y = ordinateAt(x)
      const active = segmentRows.find((row) => x >= row.fromX - 1e-8 && x <= row.toX + 1e-8) || segmentRows[0]
      return { x, ordinate: y, shear: beam.baseShearAt(x), moment: beam.baseMomentAt(x), beamMoment: beam.baseMomentAt(x), tension: active?.tension || 0 }
    })

    const loadRows = pointLoads.map((load, index) => ({
      label: `Point Load P${index + 1}`,
      value: `${fmt(load.P, 3)} kN at x = ${fmt(load.x, 3)} m`,
    }))

    const summary = [
      { label: 'Support System', value: supportData.title },
      { label: 'Horizontal Tension H', value: `${fmt(H, 3)} kN` },
      { label: 'VA', value: `${fmt(beam.VA, 3)} kN` },
      { label: 'VB', value: `${fmt(beam.VB, 3)} kN` },
      { label: 'Tension at Section', value: `${fmt(tensionSection, 3)} kN` },
      { label: 'Maximum Tension', value: `${fmt(maxTension.tension, 3)} kN` },
    ]

    const formulas = [
      'For cable under point loads: cable ordinate y = M₀ / H',
      'If sag is known at a point: H = M₀ / y',
      'M₀ is simply supported beam bending moment for same loading',
      'Vertical reactions are calculated by beam equilibrium',
      'Segment slope = (yb - ya) / (xb - xa)',
      'Segment tension: T = H√(1 + slope²)',
      'Maximum tension is the maximum segment tension',
    ]

    const steps = [
      `Support selected: ${supportData.title}. Cable is assumed perfectly flexible and carries tension only.`,
      `Total point load = ${fmt(pointLoads.reduce((sum, load) => sum + load.P, 0), 3)} kN.`,
      `Taking moments about A gives VB = ${fmt(beam.VB, 3)} kN, hence VA = ${fmt(beam.VA, 3)} kN.`,
      `At known sag point x = ${fmt(sagPointX, 3)} m, simply supported beam moment M₀ = ${fmt(momentAtSagPoint, 3)} kN·m.`,
      `Known sag y = ${fmt(sagAtPoint, 3)} m, so H = M₀/y = ${fmt(momentAtSagPoint, 3)} / ${fmt(sagAtPoint, 3)} = ${fmt(H, 3)} kN.`,
      `Cable ordinate at any point is calculated by y = M₀/H.`,
      `For each cable segment, slope = Δy/Δx and tension T = H√(1+slope²).`,
      `At section x = ${fmt(sectionX, 3)} m, cable ordinate = ${fmt(ySection, 3)} m and tension = ${fmt(tensionSection, 3)} kN.`,
      `Maximum tension = ${fmt(maxTension.tension, 3)} kN in segment ${maxTension.segment}.`,
    ]

    const finalAnswer = `For cable under point loads, H = ${fmt(H, 3)} kN. Support reactions are VA = ${fmt(beam.VA, 3)} kN and VB = ${fmt(beam.VB, 3)} kN. Maximum cable tension is ${fmt(maxTension.tension, 3)} kN in segment ${maxTension.segment}.`

    return {
      mode,
      title: modeInfo[mode].title,
      L,
      rise: Math.max(...diagramValues.map((item) => item.ordinate), sagAtPoint, 0.001),
      sectionX,
      effectiveSupport,
      supportData,
      validationNotes,
      pointLoads,
      reactions: [
        { label: 'VA', value: beam.VA, unit: 'kN' },
        { label: 'VB', value: beam.VB, unit: 'kN' },
        { label: 'H', value: H, unit: 'kN' },
      ],
      sectionResults: [
        { label: 'Cable ordinate y', value: ySection, unit: 'm' },
        { label: 'Tension at section', value: tensionSection, unit: 'kN' },
        { label: 'Maximum tension', value: maxTension.tension, unit: 'kN' },
        { label: 'Max tension segment', value: maxTension.segment, unit: '' },
      ],
      loadRows,
      segmentRows,
      diagramValues,
      summary,
      formulas,
      steps,
      finalAnswer,
      curveMode: 'cable',
    }
  }

  let beam = beamActions(L, udl, pointLoads)
  const yCrown = archY(L, rise, L / 2, form.archType)
  const mCrown = beam.baseMomentAt(L / 2)
  let H = 0
  let MA = 0
  let MB = 0
  let methodNote = ''
  let fixedDetails = null

  if (mode === 'threeHingedArch') {
    H = yCrown > 0 ? mCrown / yCrown : 0
    methodNote = 'H = M₀ at crown / crown ordinate because crown hinge moment is zero.'
  }

  if (mode === 'twoHingedArch') {
    const numerator = integrateSimpson((x) => {
      const y = archY(L, rise, x, form.archType)
      const dydx = archDyDx(L, rise, x, form.archType)
      const ds = Math.sqrt(1 + dydx * dydx)
      return (beam.baseMomentAt(x) * y * ds) / EI
    }, 0, L)

    const denominator = integrateSimpson((x) => {
      const y = archY(L, rise, x, form.archType)
      const dydx = archDyDx(L, rise, x, form.archType)
      const ds = Math.sqrt(1 + dydx * dydx)
      return (y * y * ds) / EI
    }, 0, L)

    H = denominator > 0 ? numerator / denominator : 0
    methodNote = 'H = ∫M₀y/EI ds ÷ ∫y²/EI ds from least work / elastic method.'
  }

  if (mode === 'fixedArchBasic') {
    const inf = [
      (x) => -archY(L, rise, x, form.archType),
      (x) => 1 - x / L,
      (x) => x / L,
    ]

    const matrix = inf.map((fi) =>
      inf.map((fj) =>
        integrateSimpson((x) => {
          const dydx = archDyDx(L, rise, x, form.archType)
          const ds = Math.sqrt(1 + dydx * dydx)
          return (fi(x) * fj(x) * ds) / EI
        }, 0, L)
      )
    )

    const rhs = inf.map((fi) =>
      -integrateSimpson((x) => {
        const dydx = archDyDx(L, rise, x, form.archType)
        const ds = Math.sqrt(1 + dydx * dydx)
        return (beam.baseMomentAt(x) * fi(x) * ds) / EI
      }, 0, L)
    )

    const solution = solveLinearSystem(matrix, rhs)
    H = solution[0]
    MA = solution[1]
    MB = solution[2]
    beam = beamActions(L, udl, pointLoads, MA, MB)
    methodNote = 'Fixed arch uses compatibility equations with H, MA and MB as redundants.'
    fixedDetails = { MA, MB }
  }

  const ySection = archY(L, rise, sectionX, form.archType)
  const dydxSection = archDyDx(L, rise, sectionX, form.archType)
  const theta = Math.atan(dydxSection)
  const beamMomentSection = beam.momentAt(sectionX)
  const baseMomentSection = beam.baseMomentAt(sectionX)
  const archMomentSection = beamMomentSection - H * ySection
  const verticalShearSection = beam.shearAt(sectionX)
  const normalThrust = H * Math.cos(theta) + verticalShearSection * Math.sin(theta)
  const radialShear = verticalShearSection * Math.cos(theta) - H * Math.sin(theta)

  const diagramValues = Array.from({ length: 351 }, (_, i) => {
    const x = (L * i) / 350
    const y = archY(L, rise, x, form.archType)
    const dydx = archDyDx(L, rise, x, form.archType)
    const angle = Math.atan(dydx)
    const V = beam.shearAt(x)
    const M0 = beam.momentAt(x)
    const M = M0 - H * y
    return {
      x,
      ordinate: y,
      shear: V,
      moment: M,
      beamMoment: M0,
      baseMoment: beam.baseMomentAt(x),
      normalThrust: H * Math.cos(angle) + V * Math.sin(angle),
      radialShear: V * Math.cos(angle) - H * Math.sin(angle),
      tension: 0,
    }
  })

  const maxBM = diagramValues.reduce((best, item) => (Math.abs(item.moment) > Math.abs(best.moment) ? item : best))
  const maxBeamBM = diagramValues.reduce((best, item) => (Math.abs(item.beamMoment) > Math.abs(best.beamMoment) ? item : best))
  const maxNormal = diagramValues.reduce((best, item) => (Math.abs(item.normalThrust) > Math.abs(best.normalThrust) ? item : best))
  const maxRadial = diagramValues.reduce((best, item) => (Math.abs(item.radialShear) > Math.abs(best.radialShear) ? item : best))

  const loadRows = [
    udl > 0 ? { label: 'UDL over full span', value: `${fmt(udl, 3)} kN/m over ${fmt(L, 3)} m` } : null,
    ...pointLoads.map((load, index) => ({ label: `Point Load P${index + 1}`, value: `${fmt(load.P, 3)} kN at x = ${fmt(load.x, 3)} m` })),
  ].filter(Boolean)

  const summary = [
    { label: 'Support System', value: supportData.title },
    { label: 'Horizontal Thrust H', value: `${fmt(H, 3)} kN` },
    { label: 'VA', value: `${fmt(beam.VA, 3)} kN` },
    { label: 'VB', value: `${fmt(beam.VB, 3)} kN` },
    ...(mode === 'fixedArchBasic'
      ? [
          { label: 'Fixed End Moment MA', value: `${fmt(MA, 3)} kN·m` },
          { label: 'Fixed End Moment MB', value: `${fmt(MB, 3)} kN·m` },
        ]
      : []),
    { label: 'BM at Section', value: `${fmt(archMomentSection, 3)} kN·m` },
    { label: 'Max |Arch BM|', value: `${fmt(maxBM.moment, 3)} kN·m` },
    { label: 'Max |Normal Thrust|', value: `${fmt(maxNormal.normalThrust, 3)} kN` },
  ]

  const formulas =
    mode === 'threeHingedArch'
      ? [
          'Three-hinged arch horizontal thrust: H = M₀c / yc',
          'Parabolic arch ordinate: y = 4hx(L - x) / L²',
          'Circular arch ordinate is calculated from circle geometry',
          'Arch bending moment: Mx = M₀x - Hy',
          'Normal thrust: N = H cosθ + V sinθ',
          'Radial shear: Q = V cosθ - H sinθ',
        ]
      : mode === 'twoHingedArch'
        ? [
            'Two-hinged arch horizontal thrust: H = ∫M₀y/EI ds ÷ ∫y²/EI ds',
            'Arch bending moment: Mx = M₀x - Hy',
            'Parabolic arch ordinate: y = 4hx(L - x) / L²',
            'Normal thrust: N = H cosθ + V sinθ',
            'Radial shear: Q = V cosθ - H sinθ',
            'Numerical Simpson integration is used for elastic method calculation',
          ]
        : [
            'Fixed arch compatibility: ∫M(∂M/∂Xi)ds/EI = 0',
            'Redundants used: H, MA and MB',
            'Fixed arch moment: Mx = M₀x - Hy + MA(1 - x/L) + MB(x/L)',
            'Influence for H: ∂M/∂H = -y',
            'Influence for MA: ∂M/∂MA = 1 - x/L',
            'Influence for MB: ∂M/∂MB = x/L',
            'Normal thrust: N = H cosθ + V sinθ',
            'Radial shear: Q = V cosθ - H sinθ',
          ]

  const steps = [
    `Support selected: ${supportData.title}. ${supportData.note}`,
    `Given span L = ${fmt(L, 3)} m and rise h = ${fmt(rise, 3)} m. Arch shape = ${form.archType}.`,
    loadRows.length ? `Applied loading: ${loadRows.map((row) => row.value).join(', ')}.` : 'No external load is applied.',
    `Simply supported reference reactions are VA₀ = ${fmt(beam.VAss, 3)} kN and VB₀ = ${fmt(beam.VBss, 3)} kN.`,
    mode === 'fixedArchBasic'
      ? `Compatibility equations are solved for redundants H, MA and MB using Simpson numerical integration with EI = ${fmt(EI, 3)}.`
      : `Horizontal thrust is calculated by: ${methodNote}`,
    mode === 'fixedArchBasic'
      ? `Solved redundants: H = ${fmt(H, 3)} kN, MA = ${fmt(MA, 3)} kN·m, MB = ${fmt(MB, 3)} kN·m.`
      : `Horizontal thrust H = ${fmt(H, 3)} kN.`,
    `At section x = ${fmt(sectionX, 3)} m, arch ordinate y = ${fmt(ySection, 3)} m.`,
    `Reference beam bending moment at section M₀x = ${fmt(baseMomentSection, 3)} kN·m.`,
    mode === 'fixedArchBasic'
      ? `Including fixed-end moments, beam-equivalent moment = ${fmt(beamMomentSection, 3)} kN·m.`
      : `Beam bending moment used in arch equation = ${fmt(beamMomentSection, 3)} kN·m.`,
    `Arch bending moment Mx = M₀x - H×y = ${fmt(archMomentSection, 3)} kN·m.`,
    `Slope angle θ is taken from dy/dx at selected section.`,
    `Normal thrust N = H cosθ + V sinθ = ${fmt(normalThrust, 3)} kN.`,
    `Radial shear Q = V cosθ - H sinθ = ${fmt(radialShear, 3)} kN.`,
    `Maximum absolute arch bending moment = ${fmt(maxBM.moment, 3)} kN·m at x = ${fmt(maxBM.x, 3)} m.`,
  ]

  const finalAnswer =
    mode === 'fixedArchBasic'
      ? `For fixed arch, H = ${fmt(H, 3)} kN, MA = ${fmt(MA, 3)} kN·m, MB = ${fmt(MB, 3)} kN·m. Vertical reactions are VA = ${fmt(beam.VA, 3)} kN and VB = ${fmt(beam.VB, 3)} kN. At x = ${fmt(sectionX, 3)} m, BM = ${fmt(archMomentSection, 3)} kN·m, normal thrust = ${fmt(normalThrust, 3)} kN and radial shear = ${fmt(radialShear, 3)} kN.`
      : `For the ${modeInfo[mode].title.toLowerCase()}, horizontal thrust H = ${fmt(H, 3)} kN. Vertical reactions are VA = ${fmt(beam.VA, 3)} kN and VB = ${fmt(beam.VB, 3)} kN. At x = ${fmt(sectionX, 3)} m, bending moment = ${fmt(archMomentSection, 3)} kN·m, normal thrust = ${fmt(normalThrust, 3)} kN and radial shear = ${fmt(radialShear, 3)} kN.`

  return {
    mode,
    title: modeInfo[mode].title,
    L,
    rise,
    sectionX,
    effectiveSupport,
    supportData,
    validationNotes,
    pointLoads,
    fixedDetails,
    reactions: [
      { label: 'VA', value: beam.VA, unit: 'kN' },
      { label: 'VB', value: beam.VB, unit: 'kN' },
      { label: 'H', value: H, unit: 'kN' },
      ...(mode === 'fixedArchBasic'
        ? [
            { label: 'MA', value: MA, unit: 'kN·m' },
            { label: 'MB', value: MB, unit: 'kN·m' },
          ]
        : []),
    ],
    sectionResults: [
      { label: 'Arch ordinate y', value: ySection, unit: 'm' },
      { label: 'Beam BM M₀', value: beamMomentSection, unit: 'kN·m' },
      { label: 'Arch BM M', value: archMomentSection, unit: 'kN·m' },
      { label: 'Normal thrust', value: normalThrust, unit: 'kN' },
      { label: 'Radial shear', value: radialShear, unit: 'kN' },
      { label: 'Max beam BM', value: maxBeamBM.beamMoment, unit: 'kN·m' },
      { label: 'Max radial shear', value: maxRadial.radialShear, unit: 'kN' },
    ],
    loadRows,
    segmentRows: [],
    diagramValues,
    summary,
    formulas,
    steps,
    finalAnswer,
    curveMode: 'arch',
  }
}

function solveSafely(form) {
  try {
    return solveArchCable(form)
  } catch (error) {
    return {
      error: error.message || 'Unable to solve.',
      title: 'Input Error',
      L: 1,
      rise: 1,
      sectionX: 0.5,
      effectiveSupport: 'auto',
      supportData: supportPresets.auto,
      validationNotes: [error.message || 'Unable to solve.'],
      pointLoads: [],
      reactions: [],
      sectionResults: [],
      loadRows: [],
      segmentRows: [],
      diagramValues: [{ x: 0, ordinate: 0, shear: 0, moment: 0, tension: 0 }],
      summary: [
        { label: 'Status', value: 'Check Input' },
        { label: 'Issue', value: error.message || 'Unable to solve' },
      ],
      formulas: ['Check span, rise/sag, support type, load position and point load values.'],
      steps: ['Correct the input values and try again.'],
      finalAnswer: 'Unable to solve this problem with the current input.',
      curveMode: 'arch',
    }
  }
}

function buildPlainReport(result, form) {
  return `
${form.reportTitle || 'Arches & Cables Report'}
Prepared By: ${form.preparedBy || '-'}
Mode: ${result.title}
Support System: ${result.supportData?.title || '-'}

INPUT DATA
Span L: ${fmt(form.span, 3)} m
Rise / Sag: ${result.curveMode === 'arch' ? `${fmt(form.rise, 3)} m` : `${fmt(form.sag || form.sagAtPoint, 3)} m`}
UDL: ${fmt(form.udl, 3)} kN/m
Section x: ${fmt(form.sectionX, 3)} m

LOAD DATA
${result.loadRows?.length ? result.loadRows.map((item) => `${item.label}: ${item.value}`).join('\n') : 'No load rows'}

RESULT SUMMARY
${result.summary.map((item) => `${item.label}: ${item.value}`).join('\n')}

SUPPORT REACTIONS
${result.reactions.map((item) => `${item.label}: ${fmt(item.value, 3)} ${item.unit}`).join('\n')}

SECTION RESULTS
${result.sectionResults.map((item) => `${item.label}: ${typeof item.value === 'number' ? fmt(item.value, 3) : item.value} ${item.unit}`).join('\n')}

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
  const simpleRows = (rows) => rows
    .map((item) => `
      <tr>
        <td>${cleanHtml(item.label)}</td>
        <td><strong>${cleanHtml(typeof item.value === 'number' ? fmt(item.value, 3) : item.value)} ${cleanHtml(item.unit || '')}</strong></td>
      </tr>
    `)
    .join('')

  const loadRows = result.loadRows?.length ? simpleRows(result.loadRows) : '<tr><td>Loads</td><td>No load rows</td></tr>'
  const formulas = result.formulas.map((item) => `<li>${cleanHtml(item)}</li>`).join('')
  const steps = result.steps.map((item, index) => `<li><strong>Step ${index + 1}:</strong> ${cleanHtml(item)}</li>`).join('')
  const warnings = result.validationNotes?.length
    ? `<h2>Input Notes</h2><ul>${result.validationNotes.map((item) => `<li>${cleanHtml(item)}</li>`).join('')}</ul>`
    : ''

  return `
<!doctype html>
<html>
<head>
  <title>${cleanHtml(form.reportTitle || 'Arches & Cables Report')}</title>
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
      <h1>${cleanHtml(form.reportTitle || 'Arches & Cables Report')}</h1>
      <div class="sub">
        Prepared By: ${cleanHtml(form.preparedBy || '-')}<br/>
        Mode: ${cleanHtml(result.title)}<br/>
        Support: ${cleanHtml(result.supportData?.title || '-')}<br/>
        Generated using CivilCalc Pro
      </div>
    </div>

    ${warnings}

    <h2>Load Data</h2>
    <table><tbody>${loadRows}</tbody></table>

    <h2>Result Summary</h2>
    <table><tbody>${simpleRows(result.summary)}</tbody></table>

    <h2>Support Reactions</h2>
    <table><tbody>${simpleRows(result.reactions)}</tbody></table>

    <h2>Section Results</h2>
    <table><tbody>${simpleRows(result.sectionResults)}</tbody></table>

    <h2>Formulas Used</h2>
    <ol>${formulas}</ol>

    <h2>Step-by-Step Solution</h2>
    <ol>${steps}</ol>

    <h2>Final Answer</h2>
    <div class="answer">${cleanHtml(result.finalAnswer)}</div>

    <div class="footer">Generated using CivilCalc Pro Arches & Cables Calculator.</div>
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
        {suffix && <span className="flex items-center border-l border-slate-700 px-4 text-sm font-bold text-orange-300">{suffix}</span>}
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
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none">
        {children}
      </select>
      {helper && <p className="mt-2 text-xs leading-5 text-slate-500">{helper}</p>}
    </label>
  )
}

function SupportPreview({ form, result }) {
  const support = result.supportData || supportPresets[getEffectiveSupport(form)] || supportPresets.auto

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
      <h2 className="text-2xl font-black text-white">Support Condition</h2>
      <div className="mt-5 grid gap-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
          <p className="text-sm text-slate-400">Selected Support</p>
          <p className="mt-1 text-lg font-black text-orange-300">{support.title}</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
            <p className="text-xs uppercase tracking-widest text-slate-500">Left Support A</p>
            <p className="mt-1 font-bold text-slate-200">{support.left}</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
            <p className="text-xs uppercase tracking-widest text-slate-500">Right Support B</p>
            <p className="mt-1 font-bold text-slate-200">{support.right}</p>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
          <p className="text-xs uppercase tracking-widest text-slate-500">Internal / Crown Condition</p>
          <p className="mt-1 font-bold text-slate-200">{support.crown}</p>
          <p className="mt-2 text-sm leading-6 text-slate-400">{support.note}</p>
        </div>
      </div>
    </div>
  )
}

function NotesBox({ notes }) {
  if (!notes?.length) return null

  return (
    <div className="rounded-3xl border border-yellow-500/30 bg-yellow-500/10 p-6">
      <h2 className="text-xl font-black text-yellow-200">Input / Support Notes</h2>
      <div className="mt-4 space-y-3">
        {notes.map((note, index) => (
          <p key={`${note}-${index}`} className="rounded-xl border border-yellow-500/20 bg-slate-950/60 px-4 py-3 text-sm leading-6 text-yellow-100">
            {note}
          </p>
        ))}
      </div>
    </div>
  )
}

function PointLoadEditor({ loads, L, onChange, onAdd, onDelete }) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black text-white">Point Loads</h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">Add multiple point loads. Position is measured from left support A.</p>
        </div>
        <button type="button" onClick={onAdd} className="rounded-xl bg-orange-500 px-4 py-3 text-sm font-black text-white hover:bg-orange-600">+ Add</button>
      </div>

      <div className="mt-6 space-y-4">
        {loads.map((load, index) => (
          <div key={load.id} className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
            <div className="mb-4 flex items-center justify-between">
              <p className="font-black text-orange-300">Load {index + 1}</p>
              <button type="button" onClick={() => onDelete(load.id)} className="rounded-lg border border-red-500/30 px-3 py-2 text-xs font-bold text-red-300 hover:bg-red-500/10">Delete</button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <NumberField label="Load P" value={load.P} onChange={(value) => onChange(load.id, 'P', value)} suffix="kN" min="0" />
              <NumberField label="Position x" value={load.x} onChange={(value) => onChange(load.id, 'x', value)} suffix="m" helper={`Keep between 0 and ${fmt(L, 2)} m.`} min="0" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ShapeDiagram({ result, form }) {
  const x0 = 70
  const x1 = 570
  const baseY = 190
  const L = result.L || 1
  const maxOrdinate = Math.max(result.rise || 1, ...result.diagramValues.map((item) => item.ordinate || 0), 0.001)
  const support = result.effectiveSupport || getEffectiveSupport(form)
  const mapX = (x) => x0 + (x / L) * (x1 - x0)
  const mapY = (y) => (result.curveMode === 'cable' ? 80 + (y / maxOrdinate) * 110 : baseY - (y / maxOrdinate) * 110)
  const shapePoints = result.diagramValues.map((item) => `${mapX(item.x)},${mapY(item.ordinate)}`).join(' ')
  const isFixed = support === 'fixedFixed'
  const isCable = result.curveMode === 'cable'

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-950 p-4">
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-lg font-black text-white">Structure Diagram</h3>
          <p className="mt-1 text-xs leading-5 text-slate-400">Shows support type, arch/cable shape, loads and selected section.</p>
        </div>
        <span className="rounded-xl border border-orange-500/20 bg-orange-500/10 px-3 py-2 text-xs font-bold text-orange-200">L = {fmt(result.L, 3)} m</span>
      </div>

      <svg viewBox="0 0 640 300" className="h-auto w-full">
        <line x1={x0} y1={baseY} x2={x1} y2={baseY} stroke="#64748b" strokeWidth="3" strokeDasharray="7 7" />
        <polyline points={shapePoints} fill="none" stroke={isCable ? '#22c55e' : '#38bdf8'} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />

        {isFixed ? (
          <>
            <rect x={x0 - 12} y={baseY - 24} width="24" height="58" fill="#38bdf8" />
            <rect x={x1 - 12} y={baseY - 24} width="24" height="58" fill="#38bdf8" />
            <line x1={x0 - 28} y1={baseY + 36} x2={x0 + 28} y2={baseY + 36} stroke="#38bdf8" strokeWidth="3" />
            <line x1={x1 - 28} y1={baseY + 36} x2={x1 + 28} y2={baseY + 36} stroke="#38bdf8" strokeWidth="3" />
          </>
        ) : isCable ? (
          <>
            <circle cx={x0} cy={baseY} r="9" fill="#22c55e" />
            <circle cx={x1} cy={baseY} r="9" fill="#22c55e" />
            <line x1={x0 - 28} y1={baseY + 30} x2={x0 + 28} y2={baseY + 30} stroke="#22c55e" strokeWidth="3" />
            <line x1={x1 - 28} y1={baseY + 30} x2={x1 + 28} y2={baseY + 30} stroke="#22c55e" strokeWidth="3" />
          </>
        ) : (
          <>
            <polygon points={`${x0 - 18},${baseY + 35} ${x0 + 18},${baseY + 35} ${x0},${baseY + 6}`} fill="#38bdf8" />
            <polygon points={`${x1 - 18},${baseY + 35} ${x1 + 18},${baseY + 35} ${x1},${baseY + 6}`} fill="#38bdf8" />
            {support === 'threeHinged' && <circle cx={mapX(L / 2)} cy={mapY(archY(L, result.rise, L / 2, form.archType))} r="7" fill="#facc15" stroke="#020617" strokeWidth="3" />}
          </>
        )}

        <circle cx={x0} cy={baseY} r="6" fill="#f97316" />
        <circle cx={x1} cy={baseY} r="6" fill="#f97316" />
        <text x={x0 - 8} y={baseY + 65} fill="#e2e8f0" fontSize="13" fontWeight="900">A</text>
        <text x={x1 - 8} y={baseY + 65} fill="#e2e8f0" fontSize="13" fontWeight="900">B</text>

        {toNum(form.udl, 0) > 0 && result.mode !== 'cablePointLoads' && (
          <g>
            <line x1={x0} y1="42" x2={x1} y2="42" stroke="#f97316" strokeWidth="3" />
            {Array.from({ length: 9 }).map((_, index) => {
              const px = x0 + ((x1 - x0) * index) / 8
              return (
                <g key={index}>
                  <line x1={px} y1="44" x2={px} y2={baseY - 28} stroke="#f97316" strokeWidth="2.5" />
                  <polygon points={`${px - 6},${baseY - 38} ${px + 6},${baseY - 38} ${px},${baseY - 26}`} fill="#f97316" />
                </g>
              )
            })}
            <text x={x0 + 8} y="30" fill="#fed7aa" fontSize="13" fontWeight="900">UDL = {fmt(form.udl, 2)} kN/m</text>
          </g>
        )}

        {result.pointLoads.map((load, index) => {
          const px = mapX(load.x)
          return (
            <g key={load.id || `${load.x}-${index}`}>
              <line x1={px} y1="45" x2={px} y2={baseY - 32} stroke="#f97316" strokeWidth="4" />
              <polygon points={`${px - 9},${baseY - 43} ${px + 9},${baseY - 43} ${px},${baseY - 28}`} fill="#f97316" />
              <text x={px - 24} y="32" fill="#fed7aa" fontSize="13" fontWeight="900">P{index + 1}</text>
            </g>
          )
        })}

        <line x1={mapX(result.sectionX)} y1="48" x2={mapX(result.sectionX)} y2="245" stroke="#facc15" strokeWidth="2" strokeDasharray="6 6" />
        <text x={mapX(result.sectionX) + 8} y="265" fill="#facc15" fontSize="13" fontWeight="900">Section x = {fmt(result.sectionX, 2)} m</text>
        <text x={(x0 + x1) / 2 - 70} y="285" fill="#f97316" fontSize="14" fontWeight="900">{result.title}</text>
      </svg>
    </div>
  )
}

function CurveDiagram({ result, type }) {
  const x0 = 70
  const x1 = 570
  const yBase = 115
  const amp = 65
  const L = result.L || 1
  const mapX = (x) => x0 + (x / L) * (x1 - x0)

  const meta = {
    moment: {
      title: result.curveMode === 'arch' ? 'Arch Bending Moment Diagram' : 'Cable Ordinate Diagram',
      key: result.curveMode === 'arch' ? 'moment' : 'ordinate',
      unit: result.curveMode === 'arch' ? 'kN·m' : 'm',
      label: result.curveMode === 'arch' ? 'BM' : 'y',
      color: '#38bdf8',
      note: result.curveMode === 'arch' ? 'Arch BM = Beam BM - H × y' : 'Cable ordinate from parabolic equation or y = M₀/H',
    },
    shear: {
      title: 'Shear / Vertical Component Diagram',
      key: 'shear',
      unit: 'kN',
      label: 'V',
      color: '#f97316',
      note: 'Vertical component variation along the span.',
    },
    thrust: {
      title: 'Normal Thrust Diagram',
      key: 'normalThrust',
      unit: 'kN',
      label: 'N',
      color: '#22c55e',
      note: 'Normal thrust variation along arch rib.',
    },
    radial: {
      title: 'Radial Shear Diagram',
      key: 'radialShear',
      unit: 'kN',
      label: 'Q',
      color: '#facc15',
      note: 'Radial shear variation along arch rib.',
    },
    tension: {
      title: 'Cable Tension Diagram',
      key: 'tension',
      unit: 'kN',
      label: 'T',
      color: '#22c55e',
      note: 'Tension variation along cable.',
    },
  }[type]

  const values = result.diagramValues || []
  const getValue = (item) => item[meta.key] || 0
  const rawMaxAbs = Math.max(...values.map((item) => Math.abs(getValue(item))), 0)
  const maxAbs = rawMaxAbs > 1e-12 ? rawMaxAbs : 1
  const points = values
    .map((item) => {
      const value = getValue(item)
      const y = type === 'tension' || type === 'thrust' ? yBase - (value / maxAbs) * amp : yBase + (value / maxAbs) * amp
      return `${mapX(item.x)},${y}`
    })
    .join(' ')

  const maxPoint = values.reduce((best, item) => (getValue(item) > getValue(best) ? item : best), values[0])
  const minPoint = values.reduce((best, item) => (getValue(item) < getValue(best) ? item : best), values[0])
  const absPoint = values.reduce((best, item) => (Math.abs(getValue(item)) > Math.abs(getValue(best)) ? item : best), values[0])
  const pointY = (item) => {
    const value = getValue(item)
    return type === 'tension' || type === 'thrust' ? yBase - (value / maxAbs) * amp : yBase + (value / maxAbs) * amp
  }

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-950 p-4">
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-lg font-black text-white">{meta.title}</h3>
          <p className="mt-1 text-xs leading-5 text-slate-400">{meta.note}</p>
        </div>
        <div className="rounded-xl border border-orange-500/20 bg-orange-500/10 px-3 py-2 text-xs font-bold text-orange-200">Max |{meta.label}| = {fmt(getValue(absPoint), 3)} {meta.unit}</div>
      </div>

      <svg viewBox="0 0 640 280" className="h-auto w-full">
        <line x1={x0} y1={yBase} x2={x1} y2={yBase} stroke="#64748b" strokeWidth="2" strokeDasharray="6 6" />
        <line x1={x0} y1="30" x2={x0} y2="190" stroke="#334155" strokeWidth="2" />
        <line x1={x1} y1="30" x2={x1} y2="190" stroke="#334155" strokeWidth="2" />
        <polyline points={points} fill="none" stroke={meta.color} strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" />
        <circle cx={mapX(maxPoint.x)} cy={pointY(maxPoint)} r="4" fill="#22c55e" stroke="#020617" strokeWidth="2" />
        <circle cx={mapX(minPoint.x)} cy={pointY(minPoint)} r="4" fill="#f97316" stroke="#020617" strokeWidth="2" />
        <text x="18" y="238" fill="#94a3b8" fontSize="13">Max {meta.label} = {fmt(getValue(maxPoint), 3)} {meta.unit} at x = {fmt(maxPoint.x, 3)} m</text>
        <text x="18" y="258" fill="#94a3b8" fontSize="13">Min {meta.label} = {fmt(getValue(minPoint), 3)} {meta.unit} at x = {fmt(minPoint.x, 3)} m</text>
        <text x="360" y="238" fill="#facc15" fontSize="13" fontWeight="900">Max absolute:</text>
        <text x="360" y="258" fill="#facc15" fontSize="13" fontWeight="900">x = {fmt(absPoint.x, 3)} m, {meta.label} = {fmt(getValue(absPoint), 3)} {meta.unit}</text>
      </svg>
    </div>
  )
}

function ResultTable({ title, rows }) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
      <h2 className="text-2xl font-black text-white">{title}</h2>
      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-800">
        <table className="w-full min-w-[620px] border-collapse text-left">
          <thead className="bg-slate-950">
            <tr>
              <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">Parameter</th>
              <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">Value</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="bg-slate-900/50">
                <td className="border-b border-slate-800 px-4 py-3 text-sm font-bold text-orange-300">{row.label}</td>
                <td className="border-b border-slate-800 px-4 py-3 text-sm text-slate-300">{typeof row.value === 'number' ? fmt(row.value, 4) : row.value} {row.unit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function LoadTable({ result }) {
  if (!result.loadRows?.length) return null
  return <ResultTable title="Load Data" rows={result.loadRows} />
}

function SegmentTable({ result }) {
  if (!result.segmentRows?.length) return null

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
      <h2 className="text-2xl font-black text-white">Cable Segment Tension Table</h2>
      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-800">
        <table className="w-full min-w-[900px] border-collapse text-left">
          <thead className="bg-slate-950">
            <tr>
              <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">Segment</th>
              <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">From x</th>
              <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">To x</th>
              <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">From y</th>
              <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">To y</th>
              <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">Slope</th>
              <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">Tension</th>
            </tr>
          </thead>
          <tbody>
            {result.segmentRows.map((row) => (
              <tr key={row.segment} className="bg-slate-900/50">
                <td className="border-b border-slate-800 px-4 py-3 text-sm font-bold text-orange-300">{row.segment}</td>
                <td className="border-b border-slate-800 px-4 py-3 text-sm text-slate-300">{fmt(row.fromX, 3)} m</td>
                <td className="border-b border-slate-800 px-4 py-3 text-sm text-slate-300">{fmt(row.toX, 3)} m</td>
                <td className="border-b border-slate-800 px-4 py-3 text-sm text-slate-300">{fmt(row.fromY, 3)} m</td>
                <td className="border-b border-slate-800 px-4 py-3 text-sm text-slate-300">{fmt(row.toY, 3)} m</td>
                <td className="border-b border-slate-800 px-4 py-3 text-sm text-slate-300">{fmt(row.slope, 4)}</td>
                <td className="border-b border-slate-800 px-4 py-3 text-sm text-slate-300">{fmt(row.tension, 3)} kN</td>
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
              <div key={formula} className="rounded-xl border border-orange-500/20 bg-orange-500/10 px-4 py-3 text-sm font-bold text-orange-200">{formula}</div>
            ))}
          </div>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
          <h2 className="text-2xl font-black text-white">Exam-Style Final Answer</h2>
          <p className="mt-5 rounded-2xl border border-slate-800 bg-slate-950 p-5 leading-8 text-slate-200">{result.finalAnswer}</p>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
        <h2 className="text-2xl font-black text-white">Step-by-Step Solution</h2>
        <div className="mt-6 space-y-4">
          {result.steps.map((step, index) => (
            <div key={`${step}-${index}`} className="flex gap-4 rounded-2xl border border-slate-800 bg-slate-950 p-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-500 text-sm font-black text-white">{index + 1}</div>
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
          <p className="mt-2 text-sm leading-6 text-slate-400">Copy final answer, copy full solution, or print/save the report as PDF.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <button type="button" onClick={() => copyToClipboard(result.finalAnswer, 'Final answer copied.')} className="rounded-xl border border-sky-500/30 bg-sky-500/10 px-4 py-3 text-sm font-black text-sky-200 hover:bg-sky-500/20">Copy Answer</button>
          <button type="button" onClick={() => copyToClipboard(plainReport, 'Full solution copied.')} className="rounded-xl border border-orange-500/30 bg-orange-500/10 px-4 py-3 text-sm font-black text-orange-200 hover:bg-orange-500/20">Copy Solution</button>
          <button type="button" onClick={() => printReport(result, form)} className="rounded-xl bg-orange-500 px-4 py-3 text-sm font-black text-white hover:bg-orange-600">Print / Save PDF</button>
        </div>
      </div>
    </div>
  )
}

export default function ArchesCablesPage() {
  const [form, setForm] = useState(defaultForm)
  const result = useMemo(() => solveSafely(form), [form])

  const updateForm = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const updateMode = (value) => {
    setForm((prev) => ({
      ...prev,
      mode: value,
      supportSystem: 'auto',
      sectionX: clamp(toNum(prev.sectionX, toNum(prev.span, 20) / 2), 0, toNum(prev.span, 20)),
    }))
  }

  const updatePointLoad = (id, key, value) => {
    setForm((prev) => ({
      ...prev,
      pointLoads: prev.pointLoads.map((load) => (load.id === id ? { ...load, [key]: value } : load)),
    }))
  }

  const addPointLoad = () => {
    setForm((prev) => ({
      ...prev,
      pointLoads: [...prev.pointLoads, createPointLoad(20, Math.max(toNum(prev.span, 20) / 2, 1))],
    }))
  }

  const deletePointLoad = (id) => {
    setForm((prev) => ({
      ...prev,
      pointLoads: prev.pointLoads.length > 1 ? prev.pointLoads.filter((load) => load.id !== id) : prev.pointLoads,
    }))
  }

  const resetExample = () => setForm(defaultForm())

  const showArchInputs = form.mode === 'threeHingedArch' || form.mode === 'twoHingedArch' || form.mode === 'fixedArchBasic'
  const showCableUdlInputs = form.mode === 'cableUdl'
  const showCablePointInputs = form.mode === 'cablePointLoads'
  const showPointLoads = form.mode !== 'cableUdl'
  const showUdl = showArchInputs || showCableUdlInputs

  return (
    <main className="min-h-screen bg-[#050B1F] px-4 py-8 text-white md:px-8">
      <section className="mx-auto max-w-7xl">
        <div className="mb-8 rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 md:p-8">
          <p className="mb-3 text-sm font-extrabold uppercase tracking-widest text-orange-400">Structural Analysis Arch & Cable Solver</p>
          <h1 className="text-3xl font-black leading-tight md:text-5xl">Arches & Cable Structures Calculator</h1>
          <p className="mt-4 max-w-4xl text-base leading-8 text-slate-300 md:text-lg">
            Solve three-hinged arches, two-hinged arches, fixed arches, cables under UDL and cables under point loads with support reactions, horizontal thrust, bending moment, normal thrust, radial shear, sag, tension, diagrams and detailed exam-style solution.
          </p>
        </div>

        <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
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
                <TextField label="Question / Report Title" value={form.reportTitle} onChange={(value) => updateForm('reportTitle', value)} placeholder="Example: Three Hinged Arch Analysis" />
                <TextField label="Prepared By" value={form.preparedBy} onChange={(value) => updateForm('preparedBy', value)} placeholder="Your name" />
                <SelectField label="Problem Type" value={form.mode} onChange={updateMode} helper={modeInfo[form.mode]?.desc}>
                  <option value="threeHingedArch">Three-Hinged Arch</option>
                  <option value="twoHingedArch">Two-Hinged Arch</option>
                  <option value="fixedArchBasic">Fixed Arch Basic</option>
                  <option value="cableUdl">Cable under UDL</option>
                  <option value="cablePointLoads">Cable under Point Loads</option>
                </SelectField>
                <SelectField label="Support System" value={form.supportSystem} onChange={(value) => updateForm('supportSystem', value)} helper="Auto recommended rakhoge toh selected problem ke hisab se correct support apply hoga.">
                  <option value="auto">Auto Recommended</option>
                  <option value="threeHinged">Three-Hinged: Hinge A + Hinge B + Crown Hinge</option>
                  <option value="twoHinged">Two-Hinged: Hinge A + Hinge B</option>
                  <option value="fixedFixed">Fixed-Fixed Arch</option>
                  <option value="pinRoller">Pin-Roller Reference</option>
                  <option value="cableAnchorage">Cable Anchorage / Pin Ends</option>
                </SelectField>
              </div>
              <button type="button" onClick={resetExample} className="mt-6 w-full rounded-xl border border-slate-700 px-5 py-3 font-bold text-slate-200 transition hover:border-orange-400 hover:text-orange-300">Reset Example</button>
            </div>

            <SupportPreview form={form} result={result} />

            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
              <h2 className="text-2xl font-black text-white">Geometry</h2>
              <div className="mt-6 space-y-5">
                <NumberField label="Span L" value={form.span} onChange={(value) => updateForm('span', value)} suffix="m" min="0.1" />

                {showArchInputs && (
                  <>
                    <NumberField label="Rise h" value={form.rise} onChange={(value) => updateForm('rise', value)} suffix="m" min="0.1" />
                    <SelectField label="Arch Shape" value={form.archType} onChange={(value) => updateForm('archType', value)} helper="Parabolic is most common in exam questions.">
                      <option value="parabolic">Parabolic Arch</option>
                      <option value="circular">Circular Arch Basic</option>
                    </SelectField>
                  </>
                )}

                {showCableUdlInputs && <NumberField label="Cable Sag f" value={form.sag} onChange={(value) => updateForm('sag', value)} suffix="m" min="0.1" />}

                {showCablePointInputs && (
                  <>
                    <NumberField label="Known Sag Point x" value={form.sagPointX} onChange={(value) => updateForm('sagPointX', value)} suffix="m" min="0" />
                    <NumberField label="Known Sag y" value={form.sagAtPoint} onChange={(value) => updateForm('sagAtPoint', value)} suffix="m" min="0.1" />
                  </>
                )}

                <NumberField label="Section x" value={form.sectionX} onChange={(value) => updateForm('sectionX', value)} suffix="m" helper="Section where BM, thrust, shear or tension will be calculated." min="0" />
              </div>
            </div>

            {showUdl && (
              <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
                <h2 className="text-2xl font-black text-white">UDL Load</h2>
                <div className="mt-6 space-y-5">
                  <NumberField label="UDL w" value={form.udl} onChange={(value) => updateForm('udl', value)} suffix="kN/m" min="0" />
                  {(form.mode === 'twoHingedArch' || form.mode === 'fixedArchBasic') && (
                    <NumberField label="EI Factor" value={form.EI} onChange={(value) => updateForm('EI', value)} suffix="EI" helper="Use 1 if EI is constant. Numerical integration uses this factor." min="0.001" />
                  )}
                </div>
              </div>
            )}

            {showPointLoads && (
              <PointLoadEditor loads={form.pointLoads} L={toNum(form.span, 20)} onChange={updatePointLoad} onAdd={addPointLoad} onDelete={deletePointLoad} />
            )}
          </aside>

          <section className="space-y-6">
            {result.error && (
              <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-6">
                <h2 className="text-2xl font-black text-red-200">Input Error</h2>
                <p className="mt-3 leading-7 text-red-100">{result.error}</p>
              </div>
            )}

            <NotesBox notes={result.validationNotes} />

            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
              <h2 className="text-2xl font-black text-white">{result.title}</h2>
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
            <ShapeDiagram result={result} form={form} />
            <LoadTable result={result} />

            <div className="grid gap-6 xl:grid-cols-2">
              <CurveDiagram result={result} type="moment" />
              <CurveDiagram result={result} type="shear" />
            </div>

            {result.curveMode === 'arch' && (
              <div className="grid gap-6 xl:grid-cols-2">
                <CurveDiagram result={result} type="thrust" />
                <CurveDiagram result={result} type="radial" />
              </div>
            )}

            {result.curveMode === 'cable' && <CurveDiagram result={result} type="tension" />}

            <ResultTable title="Support Reactions / Horizontal Thrust" rows={result.reactions} />
            <ResultTable title="Section Results" rows={result.sectionResults} />
            <SegmentTable result={result} />
            <FormulaAndSteps result={result} />
          </section>
        </div>
      </section>
    </main>
  )
}
