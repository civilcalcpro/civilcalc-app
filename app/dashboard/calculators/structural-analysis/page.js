'use client'

import { useMemo, useState } from 'react'

const topicCards = [
  'Static Equilibrium',
  'Free Body Diagram',
  'Support Reactions',
  'SFD & BMD',
  'Slope & Deflection',
  'Conjugate Beam Method',
  'Moment Area Method',
  'Truss Analysis',
  'Energy Methods',
  'Indeterminate Structures',
  'Influence Lines',
  'Arches & Cables',
]

const caseOptions = [
  {
    value: 'ss_point',
    label: 'Simply Supported Beam + Point Load',
    desc: 'Single point load placed at distance a from left support.',
  },
  {
    value: 'ss_central_point',
    label: 'Simply Supported Beam + Central Point Load',
    desc: 'Point load acting at mid-span. Common exam case.',
  },
  {
    value: 'ss_two_point',
    label: 'Simply Supported Beam + Two Point Loads',
    desc: 'Two point loads placed at different distances from left support.',
  },
  {
    value: 'ss_udl',
    label: 'Simply Supported Beam + UDL',
    desc: 'Uniformly distributed load acting over full span.',
  },
  {
    value: 'cantilever_point_end',
    label: 'Cantilever Beam + Point Load at Free End',
    desc: 'Point load acting downward at free end.',
  },
  {
    value: 'cantilever_point_any',
    label: 'Cantilever Beam + Point Load at Any Distance',
    desc: 'Point load placed at distance a from fixed support.',
  },
  {
    value: 'cantilever_udl',
    label: 'Cantilever Beam + UDL',
    desc: 'Uniformly distributed load acting over full cantilever span.',
  },
]

function toNum(value, fallback = 0) {
  const n = Number(value)
  return Number.isFinite(n) ? n : fallback
}

function fmt(value, digits = 2) {
  const n = Number(value)
  if (!Number.isFinite(n)) return '0'
  const fixed = n.toFixed(digits)
  return fixed.replace(/\.?0+$/, '')
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function uniqueSorted(values) {
  return [...new Set(values.map((v) => Number(v.toFixed(6))))].sort((a, b) => a - b)
}

function getCaseTitle(caseType) {
  const item = caseOptions.find((option) => option.value === caseType)
  return item?.label || 'Structural Analysis Solver'
}

function shearMomentAt(result, sectionX, side = 'right') {
  const L = result.L || 1
  const x = clamp(sectionX, 0, L)
  const eps = 0.000001
  const testX = side === 'left' ? Math.max(0, x - eps) : Math.min(L, x + eps)

  if (result.supportType === 'simple') {
    let V = result.RA
    let M = result.RA * x

    if (result.loadType === 'udl') {
      V -= result.w * testX
      M -= (result.w * x * x) / 2
    }

    if (result.loads?.length) {
      result.loads.forEach((load) => {
        if (testX >= load.x) V -= load.P
        if (x >= load.x) M -= load.P * (x - load.x)
      })
    }

    return { shear: V, moment: M }
  }

  if (result.supportType === 'cantilever') {
    let V = 0
    let M = 0

    if (result.loadType === 'udl') {
      V = -result.w * (L - x)
      M = -(result.w * Math.pow(L - x, 2)) / 2
      return { shear: V, moment: M }
    }

    result.loads.forEach((load) => {
      if (testX < load.x) V -= load.P
      if (x <= load.x) M -= load.P * (load.x - x)
    })

    return { shear: V, moment: M }
  }

  return { shear: 0, moment: 0 }
}

function solveBeam(form) {
  const caseType = form.caseType
  const L = Math.max(toNum(form.L, 1), 0.1)
  const P = Math.max(toNum(form.P, 0), 0)
  const P2 = Math.max(toNum(form.P2, 0), 0)
  const w = Math.max(toNum(form.w, 0), 0)

  let a = toNum(form.a, L / 2)
  let a2 = toNum(form.a2, (2 * L) / 3)
  let warning = ''

  const addWarning = (text) => {
    warning = warning ? `${warning} ${text}` : text
  }

  if (caseType === 'ss_point' || caseType === 'ss_central_point') {
    const originalA = a
    a = caseType === 'ss_central_point' ? L / 2 : clamp(a, 0.01, L - 0.01)

    if (caseType === 'ss_point' && originalA !== a) {
      addWarning(`Load distance a must be between 0 and L. For calculation, a is adjusted to ${fmt(a)} m.`)
    }

    const b = L - a
    const RA = (P * b) / L
    const RB = (P * a) / L
    const Mmax = RA * a

    return {
      caseType,
      title: caseType === 'ss_central_point' ? 'Simply Supported Beam with Central Point Load' : 'Simply Supported Beam with Point Load',
      supportType: 'simple',
      loadType: 'point',
      L,
      P,
      P2,
      w,
      a,
      a2,
      b,
      RA,
      RB,
      W: P,
      Mmax,
      xMaxMoment: a,
      zeroShear: a,
      warning,
      loads: [{ label: 'P', P, x: a }],
      summary: [
        { label: 'Left Reaction RA', value: `${fmt(RA)} kN` },
        { label: 'Right Reaction RB', value: `${fmt(RB)} kN` },
        { label: 'Maximum BM', value: `${fmt(Mmax)} kN·m` },
        { label: 'Max BM Location', value: `${fmt(a)} m from A` },
      ],
      formulas: [
        'b = L - a',
        'RA = P × b / L',
        'RB = P × a / L',
        'Maximum BM = RA × a = RB × b',
        'Check: RA + RB = P',
      ],
      steps: [
        `Given span L = ${fmt(L)} m, point load P = ${fmt(P)} kN, and load position a = ${fmt(a)} m from support A.`,
        `Distance from load to right support: b = L - a = ${fmt(L)} - ${fmt(a)} = ${fmt(b)} m.`,
        `Taking moment about A: RB × L = P × a.`,
        `RB = (P × a) / L = (${fmt(P)} × ${fmt(a)}) / ${fmt(L)} = ${fmt(RB)} kN.`,
        `Using vertical equilibrium: RA + RB = P.`,
        `RA = P - RB = ${fmt(P)} - ${fmt(RB)} = ${fmt(RA)} kN.`,
        `Maximum bending moment occurs under the point load.`,
        `Mmax = RA × a = ${fmt(RA)} × ${fmt(a)} = ${fmt(Mmax)} kN·m.`,
      ],
      examAnswer: `Hence, RA = ${fmt(RA)} kN and RB = ${fmt(RB)} kN. Maximum bending moment occurs below the point load at ${fmt(a)} m from A, and Mmax = ${fmt(Mmax)} kN·m.`,
    }
  }

  if (caseType === 'ss_two_point') {
    const originalA = a
    const originalA2 = a2
    a = clamp(a, 0.01, L - 0.01)
    a2 = clamp(a2, 0.01, L - 0.01)

    if (originalA !== a) addWarning(`First load distance adjusted to ${fmt(a)} m.`)
    if (originalA2 !== a2) addWarning(`Second load distance adjusted to ${fmt(a2)} m.`)

    const loads = [
      { label: 'P1', P, x: a },
      { label: 'P2', P: P2, x: a2 },
    ].sort((l1, l2) => l1.x - l2.x)

    const W = P + P2
    const RB = (P * a + P2 * a2) / L
    const RA = W - RB

    const candidateXs = uniqueSorted([0, L, ...loads.map((load) => load.x)])
    const moments = candidateXs.map((x) => ({ x, M: shearMomentAt({ supportType: 'simple', loadType: 'points', L, RA, RB, loads }, x).moment }))
    const maxItem = moments.reduce((best, item) => (item.M > best.M ? item : best), moments[0])
    const Mmax = maxItem?.M || 0
    const xMaxMoment = maxItem?.x || 0

    return {
      caseType,
      title: 'Simply Supported Beam with Two Point Loads',
      supportType: 'simple',
      loadType: 'points',
      L,
      P,
      P2,
      w,
      a,
      a2,
      b: L - a,
      RA,
      RB,
      W,
      Mmax,
      xMaxMoment,
      zeroShear: xMaxMoment,
      warning,
      loads,
      summary: [
        { label: 'Total Load', value: `${fmt(W)} kN` },
        { label: 'Left Reaction RA', value: `${fmt(RA)} kN` },
        { label: 'Right Reaction RB', value: `${fmt(RB)} kN` },
        { label: 'Maximum BM', value: `${fmt(Mmax)} kN·m` },
      ],
      formulas: [
        'Total load W = P1 + P2',
        'Taking moment about A: RB × L = P1 × a1 + P2 × a2',
        'RB = (P1a1 + P2a2) / L',
        'RA = W - RB',
        'BM at section x = RA × x - Σ(P × distance from load to section)',
      ],
      steps: [
        `Given L = ${fmt(L)} m, P1 = ${fmt(P)} kN at ${fmt(a)} m from A, and P2 = ${fmt(P2)} kN at ${fmt(a2)} m from A.`,
        `Total load W = P1 + P2 = ${fmt(P)} + ${fmt(P2)} = ${fmt(W)} kN.`,
        `Taking moment about A: RB × L = P1 × a1 + P2 × a2.`,
        `RB = (${fmt(P)} × ${fmt(a)} + ${fmt(P2)} × ${fmt(a2)}) / ${fmt(L)} = ${fmt(RB)} kN.`,
        `RA = W - RB = ${fmt(W)} - ${fmt(RB)} = ${fmt(RA)} kN.`,
        `Bending moment is checked at load points because maximum BM usually occurs where shear force changes sign.`,
        `Maximum bending moment = ${fmt(Mmax)} kN·m at x = ${fmt(xMaxMoment)} m from A.`,
      ],
      examAnswer: `Hence, RA = ${fmt(RA)} kN and RB = ${fmt(RB)} kN. Maximum bending moment is ${fmt(Mmax)} kN·m at x = ${fmt(xMaxMoment)} m from support A.`,
    }
  }

  if (caseType === 'ss_udl') {
    const W = w * L
    const RA = W / 2
    const RB = W / 2
    const Mmax = (w * L * L) / 8
    const zeroShear = L / 2

    return {
      caseType,
      title: 'Simply Supported Beam with UDL',
      supportType: 'simple',
      loadType: 'udl',
      L,
      P,
      P2,
      w,
      a: L / 2,
      a2,
      b: L / 2,
      RA,
      RB,
      W,
      Mmax,
      xMaxMoment: L / 2,
      zeroShear,
      warning,
      loads: [],
      summary: [
        { label: 'Total Load W', value: `${fmt(W)} kN` },
        { label: 'Left Reaction RA', value: `${fmt(RA)} kN` },
        { label: 'Right Reaction RB', value: `${fmt(RB)} kN` },
        { label: 'Maximum BM', value: `${fmt(Mmax)} kN·m` },
      ],
      formulas: [
        'Total load W = w × L',
        'RA = RB = W / 2',
        'RA = RB = wL / 2',
        'Maximum BM = wL² / 8',
        'Maximum BM occurs at mid-span',
      ],
      steps: [
        `Given span L = ${fmt(L)} m and UDL w = ${fmt(w)} kN/m.`,
        `Total load W = w × L = ${fmt(w)} × ${fmt(L)} = ${fmt(W)} kN.`,
        `For full-span UDL on a simply supported beam, reactions are equal.`,
        `RA = RB = W / 2 = ${fmt(W)} / 2 = ${fmt(RA)} kN.`,
        `Maximum bending moment occurs at mid-span where shear force becomes zero.`,
        `Mmax = wL² / 8 = ${fmt(w)} × ${fmt(L)}² / 8 = ${fmt(Mmax)} kN·m.`,
      ],
      examAnswer: `Hence, total load W = ${fmt(W)} kN, RA = RB = ${fmt(RA)} kN, and maximum bending moment at mid-span is ${fmt(Mmax)} kN·m.`,
    }
  }

  if (caseType === 'cantilever_point_end' || caseType === 'cantilever_point_any') {
    const originalA = a
    a = caseType === 'cantilever_point_end' ? L : clamp(a, 0.01, L)

    if (caseType === 'cantilever_point_any' && originalA !== a) {
      addWarning(`Load distance a must be between 0 and L. For calculation, a is adjusted to ${fmt(a)} m.`)
    }

    const R = P
    const Mmax = P * a

    return {
      caseType,
      title: caseType === 'cantilever_point_end' ? 'Cantilever Beam with Point Load at Free End' : 'Cantilever Beam with Point Load at Any Distance',
      supportType: 'cantilever',
      loadType: 'point',
      L,
      P,
      P2,
      w,
      a,
      a2,
      b: L - a,
      RA: R,
      RB: 0,
      W: P,
      Mmax,
      xMaxMoment: 0,
      zeroShear: null,
      warning,
      loads: [{ label: 'P', P, x: a }],
      summary: [
        { label: 'Fixed Reaction', value: `${fmt(R)} kN` },
        { label: 'Fixed End Moment', value: `${fmt(Mmax)} kN·m` },
        { label: 'Load Position', value: `${fmt(a)} m from fixed end` },
        { label: 'Maximum BM Location', value: 'At fixed support' },
      ],
      formulas: [
        'Vertical reaction at fixed support = P',
        'Fixed end moment = P × a',
        'For free-end point load, a = L',
        'Maximum BM occurs at fixed support',
      ],
      steps: [
        `Given cantilever span L = ${fmt(L)} m and point load P = ${fmt(P)} kN at a = ${fmt(a)} m from fixed support.`,
        `Using vertical equilibrium, fixed support reaction R = P = ${fmt(P)} kN.`,
        `Fixed end moment is caused by the load acting at distance a from the fixed support.`,
        `M = P × a = ${fmt(P)} × ${fmt(a)} = ${fmt(Mmax)} kN·m.`,
        `Maximum bending moment occurs at the fixed support.`,
      ],
      examAnswer: `Hence, fixed support reaction = ${fmt(R)} kN and fixed end moment = ${fmt(Mmax)} kN·m. Maximum bending moment occurs at the fixed support.`,
    }
  }

  const W = w * L
  const R = W
  const Mmax = (w * L * L) / 2

  return {
    caseType: 'cantilever_udl',
    title: 'Cantilever Beam with UDL',
    supportType: 'cantilever',
    loadType: 'udl',
    L,
    P,
    P2,
    w,
    a: L,
    a2,
    b: 0,
    RA: R,
    RB: 0,
    W,
    Mmax,
    xMaxMoment: 0,
    zeroShear: null,
    warning,
    loads: [],
    summary: [
      { label: 'Total Load W', value: `${fmt(W)} kN` },
      { label: 'Fixed Reaction', value: `${fmt(R)} kN` },
      { label: 'Fixed End Moment', value: `${fmt(Mmax)} kN·m` },
      { label: 'Maximum BM Location', value: 'At fixed support' },
    ],
    formulas: [
      'Total load W = w × L',
      'Vertical reaction at fixed support = W',
      'Fixed end moment = wL² / 2',
      'Maximum BM occurs at fixed support',
    ],
    steps: [
      `Given cantilever span L = ${fmt(L)} m and UDL w = ${fmt(w)} kN/m.`,
      `Total load W = w × L = ${fmt(w)} × ${fmt(L)} = ${fmt(W)} kN.`,
      `The fixed support carries the complete vertical load.`,
      `Fixed reaction R = W = ${fmt(W)} kN.`,
      `Fixed end moment M = wL² / 2 = ${fmt(w)} × ${fmt(L)}² / 2 = ${fmt(Mmax)} kN·m.`,
      `Maximum bending moment occurs at the fixed support.`,
    ],
    examAnswer: `Hence, total load W = ${fmt(W)} kN, fixed support reaction = ${fmt(R)} kN, and fixed end moment = ${fmt(Mmax)} kN·m.`,
  }
}

function getSectionValues(result, sectionX) {
  const L = result.L || 1
  const x = clamp(toNum(sectionX, L / 2), 0, L)
  const eps = 0.000001
  const nearLoad = result.loads?.find((load) => Math.abs(x - load.x) < eps)

  if (nearLoad) {
    const left = shearMomentAt(result, x, 'left')
    const right = shearMomentAt(result, x, 'right')
    return {
      x,
      shear: `Left: ${fmt(left.shear)} kN, Right: ${fmt(right.shear)} kN`,
      moment: `${fmt(left.moment)} kN·m`,
      note: `At ${nearLoad.label}, shear force jumps suddenly by ${fmt(nearLoad.P)} kN. Bending moment remains continuous.`,
    }
  }

  const value = shearMomentAt(result, x)

  return {
    x,
    shear: `${fmt(value.shear)} kN`,
    moment: `${fmt(value.moment)} kN·m`,
    note:
      result.loadType === 'udl'
        ? 'For UDL, shear force changes linearly and bending moment changes parabolically.'
        : 'For point loads, shear force remains constant between loads and bending moment changes linearly between loads.',
  }
}

function getSfdBmdRows(result) {
  const rows = []

  const addRow = (point, x, remark, side = 'right') => {
    const value = shearMomentAt(result, x, side)
    rows.push({
      point,
      x: `${fmt(x)} m`,
      shear: `${fmt(value.shear)} kN`,
      moment: `${fmt(value.moment)} kN·m`,
      remark,
    })
  }

  if (result.supportType === 'simple') {
    addRow('At support A', 0, 'BM is zero at simple support.')

    if (result.loadType === 'udl') {
      addRow('At mid-span', result.L / 2, 'Shear force is zero and BM is maximum.')
      addRow('Just before support B', result.L, 'SFD reaches negative reaction before RB.', 'left')
      rows.push({
        point: 'After support B',
        x: `${fmt(result.L)} m`,
        shear: '0 kN',
        moment: '0 kN·m',
        remark: 'Support reaction closes the SFD.',
      })
      return rows
    }

    result.loads.forEach((load) => {
      const left = shearMomentAt(result, load.x, 'left')
      const right = shearMomentAt(result, load.x, 'right')
      rows.push({
        point: `Just left of ${load.label}`,
        x: `${fmt(load.x)}⁻ m`,
        shear: `${fmt(left.shear)} kN`,
        moment: `${fmt(left.moment)} kN·m`,
        remark: 'Value just before point load.',
      })
      rows.push({
        point: `Just right of ${load.label}`,
        x: `${fmt(load.x)}⁺ m`,
        shear: `${fmt(right.shear)} kN`,
        moment: `${fmt(right.moment)} kN·m`,
        remark: `Shear jumps downward by ${fmt(load.P)} kN.`,
      })
    })

    addRow('Just before support B', result.L, 'BM is zero at simple support.', 'left')
    rows.push({
      point: 'After support B',
      x: `${fmt(result.L)} m`,
      shear: '0 kN',
      moment: '0 kN·m',
      remark: 'Support reaction closes the SFD.',
    })
    return rows
  }

  addRow('At fixed support', 0, 'Maximum hogging BM occurs at fixed end.')

  if (result.loadType === 'udl') {
    addRow('At mid-span', result.L / 2, 'SFD is linear and BMD is parabolic.')
    addRow('At free end', result.L, 'Both SF and BM become zero at free end.')
    return rows
  }

  result.loads.forEach((load) => {
    addRow(`Just before ${load.label}`, load.x, 'Loaded region ends here.', 'left')
    addRow(`Just after ${load.label}`, load.x, 'After point load, SF becomes zero if no load exists to the right.', 'right')
  })

  addRow('At free end', result.L, 'Free end moment is zero.')
  return rows
}

function deflectionAtX(result, xM, E_GPa, I_millionMm4) {
  const E = Math.max(E_GPa, 0.001) * 1000
  const I = Math.max(I_millionMm4, 0.001) * 1000000
  const L = result.L * 1000
  const x = clamp(xM, 0, result.L) * 1000

  let y = 0

  if (result.supportType === 'simple') {
    if (result.loadType === 'udl') {
      const w = result.w
      y += (w * x * (Math.pow(L, 3) - 2 * L * x * x + Math.pow(x, 3))) / (24 * E * I)
    }

    result.loads.forEach((load) => {
      const P = load.P * 1000
      const a = load.x * 1000
      const b = L - a

      if (x <= a) {
        y += (P * b * x * (Math.pow(L, 2) - Math.pow(b, 2) - Math.pow(x, 2))) / (6 * L * E * I)
      } else {
        y += (P * a * (L - x) * (Math.pow(L, 2) - Math.pow(a, 2) - Math.pow(L - x, 2))) / (6 * L * E * I)
      }
    })

    return y
  }

  if (result.supportType === 'cantilever') {
    if (result.loadType === 'udl') {
      const w = result.w
      y += (w * x * x * (6 * L * L - 4 * L * x + x * x)) / (24 * E * I)
    }

    result.loads.forEach((load) => {
      const P = load.P * 1000
      const a = load.x * 1000

      if (x <= a) {
        y += (P * x * x * (3 * a - x)) / (6 * E * I)
      } else {
        y += (P * a * a * (3 * x - a)) / (6 * E * I)
      }
    })

    return y
  }

  return 0
}

function getDeflectionResult(result, form) {
  const E = Math.max(toNum(form.E, 200), 0.001)
  const I = Math.max(toNum(form.I, 300), 0.001)
  const x = clamp(toNum(form.x, result.L / 2), 0, result.L)
  const yAtX = deflectionAtX(result, x, E, I)

  const samples = Array.from({ length: 201 }, (_, index) => {
    const sx = (result.L * index) / 200
    return {
      x: sx,
      y: deflectionAtX(result, sx, E, I),
    }
  })

  const maxItem = samples.reduce((best, item) => (Math.abs(item.y) > Math.abs(best.y) ? item : best), samples[0])

  const h = Math.max(result.L / 10000, 0.0001)
  const xLeft = clamp(x - h, 0, result.L)
  const xRight = clamp(x + h, 0, result.L)
  const yLeft = deflectionAtX(result, xLeft, E, I)
  const yRight = deflectionAtX(result, xRight, E, I)
  const slope = (yRight - yLeft) / ((xRight - xLeft) * 1000 || 1)

  return {
    E,
    I,
    x,
    yAtX,
    slope,
    maxDeflection: maxItem.y,
    maxX: maxItem.x,
  }
}

function NumberField({ label, value, onChange, suffix, helper, min = 0, step = 'any' }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-300">
        {label}
      </span>

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

function BeamSketch({ result }) {
  const x0 = 70
  const x1 = 570
  const y = 115
  const L = result.L || 1
  const mapX = (x) => x0 + (x / L) * (x1 - x0)
  const isSimply = result.supportType === 'simple'
  const isUDL = result.loadType === 'udl'
  const udlPositions = Array.from({ length: 9 }, (_, i) => x0 + 35 + i * 54)

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-lg font-bold text-white">Beam Loading Diagram</h3>
        <span className="rounded-full bg-orange-500/10 px-3 py-1 text-xs font-bold text-orange-300">
          Dynamic SVG
        </span>
      </div>

      <svg viewBox="0 0 640 230" className="h-auto w-full">
        <line x1={x0} y1={y} x2={x1} y2={y} stroke="#cbd5e1" strokeWidth="7" strokeLinecap="round" />

        {isSimply ? (
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
            <rect x={x0 - 32} y={y - 55} width="28" height="110" fill="#38bdf8" opacity="0.9" />
            {[-42, -22, -2, 18, 38].map((dy) => (
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
            <text x={x0 - 45} y={y + 76} fill="#e2e8f0" fontSize="14" fontWeight="700">
              Fixed
            </text>
          </>
        )}

        {isUDL && (
          <>
            <line x1={x0} y1="48" x2={x1} y2="48" stroke="#f97316" strokeWidth="3" />
            {udlPositions.map((x) => (
              <g key={x}>
                <line x1={x} y1="50" x2={x} y2={y - 8} stroke="#f97316" strokeWidth="3" />
                <polygon points={`${x - 7},${y - 18} ${x + 7},${y - 18} ${x},${y - 5}`} fill="#f97316" />
              </g>
            ))}
            <text x={(x0 + x1) / 2 - 45} y="35" fill="#fed7aa" fontSize="14" fontWeight="800">
              w = {fmt(result.w)} kN/m
            </text>
          </>
        )}

        {result.loads?.map((load) => {
          const loadX = mapX(load.x)
          return (
            <g key={`${load.label}-${load.x}`}>
              <line x1={loadX} y1="35" x2={loadX} y2={y - 8} stroke="#f97316" strokeWidth="4" />
              <polygon points={`${loadX - 9},${y - 18} ${loadX + 9},${y - 18} ${loadX},${y - 4}`} fill="#f97316" />
              <text x={loadX - 30} y="26" fill="#fed7aa" fontSize="14" fontWeight="800">
                {load.label} = {fmt(load.P)} kN
              </text>
              <line x1={x0} y1={y + 67} x2={loadX} y2={y + 67} stroke="#94a3b8" strokeWidth="2" />
              <text x={(x0 + loadX) / 2 - 20} y={y + 58} fill="#bfdbfe" fontSize="13" fontWeight="700">
                x = {fmt(load.x)} m
              </text>
            </g>
          )
        })}

        <line x1={x0} y1={y + 95} x2={x1} y2={y + 95} stroke="#64748b" strokeWidth="2" />
        <line x1={x0} y1={y + 87} x2={x0} y2={y + 103} stroke="#64748b" strokeWidth="2" />
        <line x1={x1} y1={y + 87} x2={x1} y2={y + 103} stroke="#64748b" strokeWidth="2" />
        <text x={(x0 + x1) / 2 - 18} y={y + 118} fill="#f97316" fontSize="14" fontWeight="700">
          L = {fmt(result.L)} m
        </text>

        <text x="18" y="215" fill="#94a3b8" fontSize="13">
          Diagram is educational and scaled according to input span and load position.
        </text>
      </svg>
    </div>
  )
}

function Diagram({ result, type }) {
  const x0 = 70
  const x1 = 570
  const yBase = 105
  const amp = 70
  const L = result.L || 1
  const mapX = (x) => x0 + (x / L) * (x1 - x0)

  const baseXs = Array.from({ length: 81 }, (_, i) => (L * i) / 80)
  const extraXs = []

  result.loads?.forEach((load) => {
    extraXs.push(clamp(load.x - 0.0001, 0, L), load.x, clamp(load.x + 0.0001, 0, L))
  })

  if (result.zeroShear !== null && result.zeroShear !== undefined) extraXs.push(result.zeroShear)
  if (result.xMaxMoment !== null && result.xMaxMoment !== undefined) extraXs.push(result.xMaxMoment)

  const xs = uniqueSorted([...baseXs, ...extraXs])
  const values = xs.map((x) => {
    const value = shearMomentAt(result, x)
    return type === 'sfd' ? value.shear : value.moment
  })

  const maxAbs = Math.max(...values.map((v) => Math.abs(v)), 1)

  const points = xs
    .map((x, index) => {
      const value = values[index]
      const y =
        type === 'sfd'
          ? yBase - (value / maxAbs) * amp
          : yBase + (value / maxAbs) * amp
      return `${mapX(x)},${y}`
    })
    .join(' ')

  const title = type === 'sfd' ? 'Shear Force Diagram' : 'Bending Moment Diagram'
  const color = type === 'sfd' ? '#f97316' : '#38bdf8'

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
      <h3 className="mb-3 text-lg font-bold text-white">{title}</h3>

      <svg viewBox="0 0 640 230" className="h-auto w-full">
        <line x1={x0} y1={yBase} x2={x1} y2={yBase} stroke="#64748b" strokeWidth="2" strokeDasharray="6 6" />
        <line x1={x0} y1="28" x2={x0} y2="185" stroke="#334155" strokeWidth="2" />
        <line x1={x1} y1="28" x2={x1} y2="185" stroke="#334155" strokeWidth="2" />

        <polyline points={points} fill="none" stroke={color} strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" />

        {result.loads?.map((load) => (
          <line
            key={load.label}
            x1={mapX(load.x)}
            y1="35"
            x2={mapX(load.x)}
            y2="185"
            stroke="#475569"
            strokeWidth="1.5"
            strokeDasharray="5 5"
          />
        ))}

        <text x={x0 - 10} y="207" fill="#cbd5e1" fontSize="13" fontWeight="700">
          {result.supportType === 'simple' ? 'A' : 'Fixed'}
        </text>
        <text x={x1 - 16} y="207" fill="#cbd5e1" fontSize="13" fontWeight="700">
          {result.supportType === 'simple' ? 'B' : 'Free'}
        </text>

        <text x="18" y="20" fill="#94a3b8" fontSize="13">
          {type === 'sfd'
            ? 'Positive shear is shown above the axis; negative shear below the axis.'
            : 'Positive BM is shown below the axis; negative/hogging BM above the axis.'}
        </text>
      </svg>
    </div>
  )
}

function DiagramValuesTable({ result, sectionX }) {
  const rows = getSfdBmdRows(result)
  const section = getSectionValues(result, sectionX)

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-2xl font-black text-white">SFD & BMD Key Values</h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Important ordinates required to draw shear force and bending moment diagrams.
          </p>
        </div>

        <div className="rounded-2xl border border-orange-500/30 bg-orange-500/10 px-4 py-3 text-sm leading-6 text-orange-100">
          +BM = sagging, -BM = hogging
        </div>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-800">
        <table className="w-full min-w-[760px] border-collapse text-left">
          <thead className="bg-slate-950">
            <tr>
              <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">Point</th>
              <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">x Location</th>
              <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">Shear Force</th>
              <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">Bending Moment</th>
              <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">Remark</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr key={`${row.point}-${row.x}`} className="bg-slate-900/50">
                <td className="border-b border-slate-800 px-4 py-3 text-sm font-bold text-slate-200">{row.point}</td>
                <td className="border-b border-slate-800 px-4 py-3 text-sm text-orange-300">{row.x}</td>
                <td className="border-b border-slate-800 px-4 py-3 text-sm text-slate-300">{row.shear}</td>
                <td className="border-b border-slate-800 px-4 py-3 text-sm text-slate-300">{row.moment}</td>
                <td className="border-b border-slate-800 px-4 py-3 text-sm leading-6 text-slate-400">{row.remark}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 rounded-2xl border border-sky-500/30 bg-sky-500/10 p-5">
        <h3 className="text-xl font-black text-white">
          Section Value at x = {fmt(section.x)} m
        </h3>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
            <p className="text-sm text-slate-400">Shear Force at Section</p>
            <p className="mt-2 text-2xl font-black text-sky-300">{section.shear}</p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
            <p className="text-sm text-slate-400">Bending Moment at Section</p>
            <p className="mt-2 text-2xl font-black text-sky-300">{section.moment}</p>
          </div>
        </div>

        <p className="mt-4 leading-7 text-slate-300">{section.note}</p>
      </div>
    </div>
  )
}

function DeflectionPanel({ result, form }) {
  const def = getDeflectionResult(result, form)

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
      <h2 className="text-2xl font-black text-white">Slope & Deflection</h2>
      <p className="mt-2 text-sm leading-6 text-slate-400">
        Deflection is calculated using standard elastic beam formulas. Downward deflection is shown as positive.
      </p>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
          <p className="text-sm text-slate-400">Deflection at selected x</p>
          <p className="mt-2 text-xl font-black text-orange-300">{fmt(def.yAtX, 4)} mm</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
          <p className="text-sm text-slate-400">Maximum deflection</p>
          <p className="mt-2 text-xl font-black text-orange-300">{fmt(def.maxDeflection, 4)} mm</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
          <p className="text-sm text-slate-400">Max deflection location</p>
          <p className="mt-2 text-xl font-black text-orange-300">{fmt(def.maxX)} m</p>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950 p-4">
        <p className="text-sm text-slate-400">Approx. slope at selected x</p>
        <p className="mt-2 text-xl font-black text-sky-300">{fmt(def.slope, 6)} rad</p>
      </div>
    </div>
  )
}

function FormulaLibrary() {
  const formulas = [
    ['Equilibrium', 'ΣV = 0, ΣH = 0, ΣM = 0'],
    ['Simply supported point load', 'RA = Pb/L, RB = Pa/L, Mmax = Pab/L'],
    ['Simply supported UDL', 'RA = RB = wL/2, Mmax = wL²/8'],
    ['Cantilever point load', 'R = P, Mfixed = Pa'],
    ['Cantilever UDL', 'R = wL, Mfixed = wL²/2'],
    ['Steel beam deflection note', 'Deflection depends on E, I, load and span.'],
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

export default function StructuralAnalysisPage() {
  const [form, setForm] = useState({
    caseType: 'ss_point',
    L: 6,
    P: 20,
    P2: 10,
    a: 2,
    a2: 4,
    w: 5,
    x: 3,
    E: 200,
    I: 300,
  })

  const selectedCase = caseOptions.find((item) => item.value === form.caseType)
  const result = useMemo(() => solveBeam(form), [form])

  const update = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const reset = () => {
    setForm({
      caseType: 'ss_point',
      L: 6,
      P: 20,
      P2: 10,
      a: 2,
      a2: 4,
      w: 5,
      x: 3,
      E: 200,
      I: 300,
    })
  }

  const isUDLCase = form.caseType.includes('udl')
  const isTwoPoint = form.caseType === 'ss_two_point'
  const isSinglePoint =
    form.caseType === 'ss_point' ||
    form.caseType === 'ss_central_point' ||
    form.caseType === 'cantilever_point_end' ||
    form.caseType === 'cantilever_point_any'
  const needsA = form.caseType === 'ss_point' || form.caseType === 'cantilever_point_any'

  return (
    <main className="min-h-screen bg-[#050B1F] px-4 py-8 text-white md:px-8">
      <section className="mx-auto max-w-7xl">
        <div className="mb-8 rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 md:p-8">
          <p className="mb-3 text-sm font-extrabold uppercase tracking-widest text-orange-400">
            Semester 3 Civil Engineering
          </p>

          <h1 className="text-3xl font-black leading-tight md:text-5xl">
            Structural Analysis Solver for Civil Engineering Students
          </h1>

          <p className="mt-4 max-w-4xl text-base leading-8 text-slate-300 md:text-lg">
            Solve beam reactions, SFD, BMD, slope, deflection and exam-style structural analysis problems with diagrams and step-by-step solution.
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
              <h2 className="text-2xl font-black text-white">Input Panel</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Select problem type and enter values. Diagrams and answers update automatically.
              </p>

              <label className="mt-6 block">
                <span className="mb-2 block text-sm font-semibold text-slate-300">
                  Select Problem Type
                </span>

                <select
                  value={form.caseType}
                  onChange={(e) => update('caseType', e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none"
                >
                  {caseOptions.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>

                <p className="mt-2 text-xs leading-5 text-slate-500">{selectedCase?.desc}</p>
              </label>

              <div className="mt-6 space-y-5">
                <NumberField
                  label="Beam Span L"
                  value={form.L}
                  onChange={(value) => update('L', value)}
                  suffix="m"
                  helper="Total length of beam."
                  min="0.1"
                />

                <NumberField
                  label={result.supportType === 'simple' ? 'Section x from Support A' : 'Section x from Fixed Support'}
                  value={form.x}
                  onChange={(value) => update('x', value)}
                  suffix="m"
                  helper="Enter any section between 0 and L to get SF, BM, slope and deflection."
                  min="0"
                />

                {isSinglePoint && (
                  <NumberField
                    label="Point Load P"
                    value={form.P}
                    onChange={(value) => update('P', value)}
                    suffix="kN"
                    helper="Downward concentrated load."
                    min="0"
                  />
                )}

                {needsA && (
                  <NumberField
                    label={form.caseType === 'cantilever_point_any' ? 'Load Distance a from Fixed Support' : 'Load Distance a from Support A'}
                    value={form.a}
                    onChange={(value) => update('a', value)}
                    suffix="m"
                    helper="Load position measured from the reference support."
                    min="0"
                  />
                )}

                {isTwoPoint && (
                  <>
                    <NumberField
                      label="Point Load P1"
                      value={form.P}
                      onChange={(value) => update('P', value)}
                      suffix="kN"
                      helper="First downward point load."
                      min="0"
                    />

                    <NumberField
                      label="Distance a1 from Support A"
                      value={form.a}
                      onChange={(value) => update('a', value)}
                      suffix="m"
                      helper="Position of first point load."
                      min="0"
                    />

                    <NumberField
                      label="Point Load P2"
                      value={form.P2}
                      onChange={(value) => update('P2', value)}
                      suffix="kN"
                      helper="Second downward point load."
                      min="0"
                    />

                    <NumberField
                      label="Distance a2 from Support A"
                      value={form.a2}
                      onChange={(value) => update('a2', value)}
                      suffix="m"
                      helper="Position of second point load."
                      min="0"
                    />
                  </>
                )}

                {isUDLCase && (
                  <NumberField
                    label="UDL Intensity w"
                    value={form.w}
                    onChange={(value) => update('w', value)}
                    suffix="kN/m"
                    helper="Uniform load acting over full beam span."
                    min="0"
                  />
                )}

                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                  <h3 className="font-black text-white">Deflection Inputs</h3>
                  <div className="mt-4 space-y-4">
                    <NumberField
                      label="Modulus of Elasticity E"
                      value={form.E}
                      onChange={(value) => update('E', value)}
                      suffix="GPa"
                      helper="Example: Steel ≈ 200 GPa, RCC often lower depending on grade."
                      min="0.001"
                    />

                    <NumberField
                      label="Moment of Inertia I"
                      value={form.I}
                      onChange={(value) => update('I', value)}
                      suffix="×10⁶ mm⁴"
                      helper="Use section moment of inertia for deflection calculation."
                      min="0.001"
                    />
                  </div>
                </div>
              </div>

              {result.warning && (
                <div className="mt-5 rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-4 text-sm leading-6 text-yellow-100">
                  {result.warning}
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
              <h2 className="text-xl font-black text-white">What This Tool Solves</h2>

              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
                <li>✓ Free body diagram style beam sketch</li>
                <li>✓ Simply supported and cantilever cases</li>
                <li>✓ Single point load, central point load and two point loads</li>
                <li>✓ UDL on full span</li>
                <li>✓ Support reaction calculation</li>
                <li>✓ SFD and BMD diagrams</li>
                <li>✓ SFD and BMD key values table</li>
                <li>✓ Shear force and bending moment at any section x</li>
                <li>✓ Slope and deflection calculation</li>
                <li>✓ Formula and step-by-step solution</li>
              </ul>

              <div className="mt-5 rounded-2xl border border-orange-500/20 bg-orange-500/10 p-4 text-sm leading-6 text-slate-300">
                Useful for semester exams, assignments, practice questions and quick concept revision.
              </div>
            </div>
          </aside>

          <section className="space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
              <h2 className="text-2xl font-black text-white">{result.title}</h2>

              <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {result.summary.map((item) => (
                  <div key={item.label} className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                    <p className="text-sm text-slate-400">{item.label}</p>
                    <p className="mt-2 text-xl font-black text-orange-300">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <BeamSketch result={result} />

            <div className="grid gap-6 xl:grid-cols-2">
              <Diagram result={result} type="sfd" />
              <Diagram result={result} type="bmd" />
            </div>

            <DiagramValuesTable result={result} sectionX={form.x} />

            <DeflectionPanel result={result} form={form} />

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
