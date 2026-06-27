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
    desc: 'Point load placed at distance a from left support.',
  },
  {
    value: 'ss_udl',
    label: 'Simply Supported Beam + UDL',
    desc: 'Uniformly distributed load over full span.',
  },
  {
    value: 'cantilever_point',
    label: 'Cantilever Beam + Point Load at Free End',
    desc: 'Point load acting downward at free end.',
  },
  {
    value: 'cantilever_udl',
    label: 'Cantilever Beam + UDL',
    desc: 'Uniformly distributed load over full cantilever span.',
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

function solveBeam(form) {
  const caseType = form.caseType
  const L = Math.max(toNum(form.L, 1), 0.1)
  const P = Math.max(toNum(form.P, 0), 0)
  const w = Math.max(toNum(form.w, 0), 0)

  let a = toNum(form.a, L / 2)
  let warning = ''

  if (caseType === 'ss_point') {
    const originalA = a
    a = clamp(a, 0.01, L - 0.01)

    if (originalA !== a) {
      warning = `Load distance a must be between 0 and L. For calculation, a is adjusted to ${fmt(
        a
      )} m.`
    }

    const b = L - a
    const RA = (P * b) / L
    const RB = (P * a) / L
    const Mmax = RA * a
    const check = RA + RB

    return {
      caseType,
      title: 'Simply Supported Beam with Point Load',
      L,
      P,
      w,
      a,
      b,
      RA,
      RB,
      W: P,
      Mmax,
      xMaxMoment: a,
      zeroShear: a,
      warning,
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
        `Given span L = ${fmt(L)} m, point load P = ${fmt(P)} kN, distance a = ${fmt(
          a
        )} m.`,
        `Distance from load to right support: b = L - a = ${fmt(L)} - ${fmt(
          a
        )} = ${fmt(b)} m.`,
        `Taking moment about A: RB × L = P × a.`,
        `RB = (P × a) / L = (${fmt(P)} × ${fmt(a)}) / ${fmt(L)} = ${fmt(
          RB
        )} kN.`,
        `Taking vertical force equilibrium: RA + RB = P.`,
        `RA = P - RB = ${fmt(P)} - ${fmt(RB)} = ${fmt(RA)} kN.`,
        `Maximum bending moment occurs under the point load.`,
        `Mmax = RA × a = ${fmt(RA)} × ${fmt(a)} = ${fmt(Mmax)} kN·m.`,
        `Check: RA + RB = ${fmt(RA)} + ${fmt(RB)} = ${fmt(
          check
        )} kN, which is equal to total load P = ${fmt(P)} kN.`,
      ],
      examAnswer: `Hence, the support reactions are RA = ${fmt(
        RA
      )} kN and RB = ${fmt(
        RB
      )} kN. The maximum bending moment occurs below the point load at ${fmt(
        a
      )} m from support A, and Mmax = ${fmt(Mmax)} kN·m.`,
    }
  }
function getSectionValues(result, sectionX) {
  const L = result.L || 1
  const x = clamp(toNum(sectionX, L / 2), 0, L)
  const tol = 0.000001

  if (result.caseType === 'ss_point') {
    const isAtLoad = Math.abs(x - result.a) < tol
    const moment = result.RA * x - result.P * Math.max(0, x - result.a)

    if (isAtLoad) {
      return {
        x,
        shear: `Left: +${fmt(result.RA)} kN, Right: -${fmt(result.RB)} kN`,
        moment: `${fmt(moment)} kN·m`,
        note:
          'At the point load location, shear force changes suddenly. Bending moment is maximum at this point.',
      }
    }

    const shear = x < result.a ? result.RA : result.RA - result.P

    return {
      x,
      shear: `${fmt(shear)} kN`,
      moment: `${fmt(moment)} kN·m`,
      note:
        x < result.a
          ? 'This section is before the point load, so shear force is equal to RA.'
          : 'This section is after the point load, so shear force is RA - P.',
    }
  }

  if (result.caseType === 'ss_udl') {
    const shear = result.RA - result.w * x
    const moment = result.RA * x - (result.w * x * x) / 2

    return {
      x,
      shear: `${fmt(shear)} kN`,
      moment: `${fmt(moment)} kN·m`,
      note:
        Math.abs(shear) < 0.01
          ? 'Shear force is nearly zero here, so bending moment is maximum near this section.'
          : 'For UDL, shear force changes linearly and bending moment changes parabolically.',
    }
  }

  if (result.caseType === 'cantilever_point') {
    const moment = -result.P * (L - x)

    return {
      x,
      shear:
        Math.abs(x - L) < tol
          ? `-${fmt(result.P)} kN just before free-end load`
          : `-${fmt(result.P)} kN`,
      moment: `${fmt(moment)} kN·m`,
      note:
        'For cantilever with point load at free end, shear force is constant and bending moment is maximum at fixed support.',
    }
  }

  const shear = -result.w * (L - x)
  const moment = -(result.w * Math.pow(L - x, 2)) / 2

  return {
    x,
    shear: `${fmt(shear)} kN`,
    moment: `${fmt(moment)} kN·m`,
    note:
      'For cantilever with UDL, shear force and bending moment are maximum at fixed support and zero at free end.',
  }
}

function getSfdBmdRows(result) {
  if (result.caseType === 'ss_point') {
    return [
      {
        point: 'At support A',
        x: '0',
        shear: `+${fmt(result.RA)} kN`,
        moment: '0 kN·m',
        remark: 'Reaction starts the SFD upward.',
      },
      {
        point: 'Just left of point load',
        x: `${fmt(result.a)}⁻`,
        shear: `+${fmt(result.RA)} kN`,
        moment: `${fmt(result.Mmax)} kN·m`,
        remark: 'BM reaches maximum near the load.',
      },
      {
        point: 'Just right of point load',
        x: `${fmt(result.a)}⁺`,
        shear: `-${fmt(result.RB)} kN`,
        moment: `${fmt(result.Mmax)} kN·m`,
        remark: 'Shear jumps downward by P.',
      },
      {
        point: 'At support B',
        x: `${fmt(result.L)}`,
        shear: '0 after RB',
        moment: '0 kN·m',
        remark: 'BM is zero at simple support.',
      },
    ]
  }

  if (result.caseType === 'ss_udl') {
    return [
      {
        point: 'At support A',
        x: '0',
        shear: `+${fmt(result.RA)} kN`,
        moment: '0 kN·m',
        remark: 'SFD starts from positive reaction.',
      },
      {
        point: 'At mid-span',
        x: `${fmt(result.L / 2)}`,
        shear: '0 kN',
        moment: `${fmt(result.Mmax)} kN·m`,
        remark: 'Maximum BM occurs where SF becomes zero.',
      },
      {
        point: 'Just before support B',
        x: `${fmt(result.L)}⁻`,
        shear: `-${fmt(result.RB)} kN`,
        moment: '0 kN·m',
        remark: 'SFD reaches negative value before support B.',
      },
      {
        point: 'At support B',
        x: `${fmt(result.L)}`,
        shear: '0 after RB',
        moment: '0 kN·m',
        remark: 'Support reaction closes the SFD.',
      },
    ]
  }

  if (result.caseType === 'cantilever_point') {
    return [
      {
        point: 'At fixed support',
        x: '0',
        shear: `-${fmt(result.P)} kN`,
        moment: `-${fmt(result.Mmax)} kN·m`,
        remark: 'Maximum hogging moment occurs at fixed end.',
      },
      {
        point: 'At mid-span',
        x: `${fmt(result.L / 2)}`,
        shear: `-${fmt(result.P)} kN`,
        moment: `-${fmt(result.P * (result.L / 2))} kN·m`,
        remark: 'BM reduces linearly towards free end.',
      },
      {
        point: 'Just before free-end load',
        x: `${fmt(result.L)}⁻`,
        shear: `-${fmt(result.P)} kN`,
        moment: '0 kN·m',
        remark: 'Moment is zero at free end.',
      },
      {
        point: 'After free-end load',
        x: `${fmt(result.L)}`,
        shear: '0 kN',
        moment: '0 kN·m',
        remark: 'Load closes the SFD at free end.',
      },
    ]
  }

  return [
    {
      point: 'At fixed support',
      x: '0',
      shear: `-${fmt(result.W)} kN`,
      moment: `-${fmt(result.Mmax)} kN·m`,
      remark: 'Maximum SF and BM occur at fixed end.',
    },
    {
      point: 'At mid-span',
      x: `${fmt(result.L / 2)}`,
      shear: `-${fmt(result.W / 2)} kN`,
      moment: `-${fmt((result.w * result.L * result.L) / 8)} kN·m`,
      remark: 'SFD is linear and BMD is parabolic.',
    },
    {
      point: 'At free end',
      x: `${fmt(result.L)}`,
      shear: '0 kN',
      moment: '0 kN·m',
      remark: 'Both SF and BM become zero at free end.',
    },
  ]
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
      L,
      P,
      w,
      a: L / 2,
      b: L / 2,
      RA,
      RB,
      W,
      Mmax,
      xMaxMoment: L / 2,
      zeroShear,
      warning,
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
        `For a simply supported beam with full-span UDL, reactions are equal.`,
        `RA = RB = W / 2 = ${fmt(W)} / 2 = ${fmt(RA)} kN.`,
        `Maximum bending moment occurs at mid-span where shear force becomes zero.`,
        `Mmax = wL² / 8 = ${fmt(w)} × ${fmt(L)}² / 8 = ${fmt(
          Mmax
        )} kN·m.`,
        `Zero shear point is at L / 2 = ${fmt(L)} / 2 = ${fmt(zeroShear)} m from A.`,
      ],
      examAnswer: `Hence, the total load is ${fmt(W)} kN. The support reactions are RA = RB = ${fmt(
        RA
      )} kN. The maximum bending moment occurs at mid-span and Mmax = ${fmt(
        Mmax
      )} kN·m.`,
    }
  }

  if (caseType === 'cantilever_point') {
    const R = P
    const Mmax = P * L

    return {
      caseType,
      title: 'Cantilever Beam with Point Load at Free End',
      L,
      P,
      w,
      a: L,
      b: 0,
      RA: R,
      RB: 0,
      W: P,
      Mmax,
      xMaxMoment: 0,
      zeroShear: null,
      warning,
      summary: [
        { label: 'Fixed Reaction', value: `${fmt(R)} kN` },
        { label: 'Fixed End Moment', value: `${fmt(Mmax)} kN·m` },
        { label: 'Maximum BM Location', value: 'At fixed support' },
        { label: 'Shear Force', value: `${fmt(P)} kN constant` },
      ],
      formulas: [
        'Vertical reaction at fixed support = P',
        'Fixed end moment = P × L',
        'Maximum BM occurs at fixed support',
        'BM at free end = 0',
      ],
      steps: [
        `Given cantilever span L = ${fmt(L)} m and point load P = ${fmt(
          P
        )} kN at free end.`,
        `Taking vertical equilibrium, fixed support reaction R = P = ${fmt(P)} kN.`,
        `Fixed end moment is caused by the load acting at distance L from fixed support.`,
        `M = P × L = ${fmt(P)} × ${fmt(L)} = ${fmt(Mmax)} kN·m.`,
        `Maximum bending moment occurs at the fixed support.`,
        `Bending moment at the free end is zero.`,
      ],
      examAnswer: `Hence, the fixed support reaction is ${fmt(
        R
      )} kN and the fixed end moment is ${fmt(
        Mmax
      )} kN·m. Maximum bending moment occurs at the fixed support.`,
    }
  }

  const W = w * L
  const R = W
  const Mmax = (w * L * L) / 2

  return {
    caseType: 'cantilever_udl',
    title: 'Cantilever Beam with UDL',
    L,
    P,
    w,
    a: L,
    b: 0,
    RA: R,
    RB: 0,
    W,
    Mmax,
    xMaxMoment: 0,
    zeroShear: null,
    warning,
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
      `Fixed end moment M = wL² / 2 = ${fmt(w)} × ${fmt(L)}² / 2 = ${fmt(
        Mmax
      )} kN·m.`,
      `Maximum bending moment occurs at the fixed support.`,
      `Bending moment at the free end is zero.`,
    ],
    examAnswer: `Hence, the total load is ${fmt(
      W
    )} kN, fixed support reaction is ${fmt(
      R
    )} kN, and fixed end moment is ${fmt(
      Mmax
    )} kN·m. Maximum bending moment occurs at the fixed support.`,
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
  const isSimply = result.caseType.startsWith('ss')
  const isPoint = result.caseType.includes('point')
  const isUDL = result.caseType.includes('udl')
  const loadX = isSimply ? mapX(result.a) : x1

  const udlPositions = Array.from({ length: 9 }, (_, i) => x0 + 35 + i * 54)

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-lg font-bold text-white">Beam Loading Diagram</h3>
        <span className="rounded-full bg-orange-500/10 px-3 py-1 text-xs font-bold text-orange-300">
          Dynamic SVG
        </span>
      </div>

      <svg viewBox="0 0 640 220" className="h-auto w-full">
        <line x1={x0} y1={y} x2={x1} y2={y} stroke="#cbd5e1" strokeWidth="7" strokeLinecap="round" />

        {isSimply && (
          <>
            <polygon points={`${x0 - 18},${y + 35} ${x0 + 18},${y + 35} ${x0},${y + 6}`} fill="#38bdf8" />
            <line x1={x0 - 30} y1={y + 38} x2={x0 + 30} y2={y + 38} stroke="#38bdf8" strokeWidth="3" />
            <text x={x0 - 7} y={y + 65} fill="#e2e8f0" fontSize="14" fontWeight="700">A</text>

            <circle cx={x1} cy={y + 24} r="12" fill="none" stroke="#38bdf8" strokeWidth="3" />
            <line x1={x1 - 30} y1={y + 38} x2={x1 + 30} y2={y + 38} stroke="#38bdf8" strokeWidth="3" />
            <text x={x1 - 7} y={y + 65} fill="#e2e8f0" fontSize="14" fontWeight="700">B</text>

            <line x1={x0} y1={y + 90} x2={x1} y2={y + 90} stroke="#64748b" strokeWidth="2" />
            <line x1={x0} y1={y + 82} x2={x0} y2={y + 98} stroke="#64748b" strokeWidth="2" />
            <line x1={x1} y1={y + 82} x2={x1} y2={y + 98} stroke="#64748b" strokeWidth="2" />
            <text x={(x0 + x1) / 2 - 18} y={y + 112} fill="#f97316" fontSize="14" fontWeight="700">
              L = {fmt(result.L)} m
            </text>
          </>
        )}

        {!isSimply && (
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

            <line x1={x0} y1={y + 90} x2={x1} y2={y + 90} stroke="#64748b" strokeWidth="2" />
            <line x1={x0} y1={y + 82} x2={x0} y2={y + 98} stroke="#64748b" strokeWidth="2" />
            <line x1={x1} y1={y + 82} x2={x1} y2={y + 98} stroke="#64748b" strokeWidth="2" />
            <text x={(x0 + x1) / 2 - 18} y={y + 112} fill="#f97316" fontSize="14" fontWeight="700">
              L = {fmt(result.L)} m
            </text>
          </>
        )}

        {isPoint && (
          <>
            <line x1={loadX} y1="35" x2={loadX} y2={y - 8} stroke="#f97316" strokeWidth="4" />
            <polygon points={`${loadX - 9},${y - 18} ${loadX + 9},${y - 18} ${loadX},${y - 4}`} fill="#f97316" />
            <text x={loadX - 22} y="26" fill="#fed7aa" fontSize="14" fontWeight="800">
              P = {fmt(result.P)} kN
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

        {result.caseType === 'ss_point' && (
          <>
            <line x1={x0} y1={y + 67} x2={loadX} y2={y + 67} stroke="#94a3b8" strokeWidth="2" />
            <line x1={loadX} y1={y + 67} x2={x1} y2={y + 67} stroke="#94a3b8" strokeWidth="2" />
            <text x={(x0 + loadX) / 2 - 15} y={y + 58} fill="#bfdbfe" fontSize="13" fontWeight="700">
              a = {fmt(result.a)} m
            </text>
            <text x={(loadX + x1) / 2 - 15} y={y + 58} fill="#bfdbfe" fontSize="13" fontWeight="700">
              b = {fmt(result.b)} m
            </text>
          </>
        )}

        <text x="18" y="205" fill="#94a3b8" fontSize="13">
          Diagram is educational and scaled according to input span and load position.
        </text>
      </svg>
    </div>
  )
}

function SFDDiagram({ result }) {
  const x0 = 70
  const x1 = 570
  const yBase = 110
  const amp = 58
  const L = result.L || 1
  const mapX = (x) => x0 + (x / L) * (x1 - x0)

  let diagram = null

  if (result.caseType === 'ss_point') {
    const xp = mapX(result.a)
    diagram = (
      <>
        <path
          d={`M ${x0} ${yBase} L ${x0} ${yBase - amp} L ${xp} ${yBase - amp} L ${xp} ${
            yBase + amp
          } L ${x1} ${yBase + amp} L ${x1} ${yBase} Z`}
          fill="rgba(249,115,22,0.18)"
          stroke="#f97316"
          strokeWidth="3"
        />
        <text x={x0 + 10} y={yBase - amp - 10} fill="#fed7aa" fontSize="13" fontWeight="700">
          +RA = {fmt(result.RA)} kN
        </text>
        <text x={xp + 10} y={yBase + amp + 22} fill="#fed7aa" fontSize="13" fontWeight="700">
          -RB = -{fmt(result.RB)} kN
        </text>
      </>
    )
  }

  if (result.caseType === 'ss_udl') {
    diagram = (
      <>
        <path
          d={`M ${x0} ${yBase} L ${x0} ${yBase - amp} L ${x1} ${yBase + amp} L ${x1} ${yBase} Z`}
          fill="rgba(249,115,22,0.18)"
          stroke="#f97316"
          strokeWidth="3"
        />
        <circle cx={(x0 + x1) / 2} cy={yBase} r="5" fill="#38bdf8" />
        <text x={x0 + 10} y={yBase - amp - 10} fill="#fed7aa" fontSize="13" fontWeight="700">
          +{fmt(result.RA)} kN
        </text>
        <text x={x1 - 90} y={yBase + amp + 22} fill="#fed7aa" fontSize="13" fontWeight="700">
          -{fmt(result.RB)} kN
        </text>
        <text x={(x0 + x1) / 2 + 10} y={yBase - 8} fill="#bfdbfe" fontSize="13" fontWeight="700">
          V = 0 at L/2
        </text>
      </>
    )
  }

  if (result.caseType === 'cantilever_point') {
    diagram = (
      <>
        <path
          d={`M ${x0} ${yBase} L ${x0} ${yBase + amp} L ${x1} ${yBase + amp} L ${x1} ${yBase} Z`}
          fill="rgba(249,115,22,0.18)"
          stroke="#f97316"
          strokeWidth="3"
        />
        <text x={x0 + 15} y={yBase + amp + 22} fill="#fed7aa" fontSize="13" fontWeight="700">
          V = -P = -{fmt(result.P)} kN
        </text>
      </>
    )
  }

  if (result.caseType === 'cantilever_udl') {
    diagram = (
      <>
        <path
          d={`M ${x0} ${yBase} L ${x0} ${yBase + amp} L ${x1} ${yBase} Z`}
          fill="rgba(249,115,22,0.18)"
          stroke="#f97316"
          strokeWidth="3"
        />
        <text x={x0 + 15} y={yBase + amp + 22} fill="#fed7aa" fontSize="13" fontWeight="700">
          Vmax = -wL = -{fmt(result.W)} kN
        </text>
        <text x={x1 - 85} y={yBase - 10} fill="#bfdbfe" fontSize="13" fontWeight="700">
          V = 0
        </text>
      </>
    )
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
      <h3 className="mb-3 text-lg font-bold text-white">Shear Force Diagram</h3>

      <svg viewBox="0 0 640 220" className="h-auto w-full">
        <line x1={x0} y1={yBase} x2={x1} y2={yBase} stroke="#64748b" strokeWidth="2" strokeDasharray="6 6" />
        <line x1={x0} y1="38" x2={x0} y2="182" stroke="#334155" strokeWidth="2" />
        <line x1={x1} y1="38" x2={x1} y2="182" stroke="#334155" strokeWidth="2" />

        {diagram}

        <text x={x0 - 10} y="202" fill="#cbd5e1" fontSize="13" fontWeight="700">A / Fixed</text>
        <text x={x1 - 16} y="202" fill="#cbd5e1" fontSize="13" fontWeight="700">B / Free</text>
        <text x="18" y="24" fill="#94a3b8" fontSize="13">
          SFD shows variation of shear force along the beam.
        </text>
      </svg>
    </div>
  )
}

function BMDDiagram({ result }) {
  const x0 = 70
  const x1 = 570
  const yBase = 90
  const amp = 75
  const L = result.L || 1
  const mapX = (x) => x0 + (x / L) * (x1 - x0)

  let diagram = null

  if (result.caseType === 'ss_point') {
    const xp = mapX(result.a)
    diagram = (
      <>
        <path
          d={`M ${x0} ${yBase} L ${xp} ${yBase + amp} L ${x1} ${yBase} Z`}
          fill="rgba(56,189,248,0.16)"
          stroke="#38bdf8"
          strokeWidth="3"
        />
        <text x={xp - 45} y={yBase + amp + 22} fill="#bfdbfe" fontSize="13" fontWeight="700">
          Mmax = {fmt(result.Mmax)} kN·m
        </text>
      </>
    )
  }
function DiagramValuesTable({ result, sectionX }) {
  const rows = getSfdBmdRows(result)
  const section = getSectionValues(result, sectionX)

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-2xl font-black text-white">
            SFD & BMD Key Values
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Important values required to draw shear force and bending moment diagrams.
          </p>
        </div>

        <div className="rounded-2xl border border-orange-500/30 bg-orange-500/10 px-4 py-3 text-sm leading-6 text-orange-100">
          Sign convention: +BM = sagging, -BM = hogging
        </div>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-800">
        <table className="w-full min-w-[760px] border-collapse text-left">
          <thead className="bg-slate-950">
            <tr>
              <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">
                Point
              </th>
              <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">
                x Location
              </th>
              <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">
                Shear Force
              </th>
              <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">
                Bending Moment
              </th>
              <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">
                Remark
              </th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr key={`${row.point}-${row.x}`} className="bg-slate-900/50">
                <td className="border-b border-slate-800 px-4 py-3 text-sm font-bold text-slate-200">
                  {row.point}
                </td>
                <td className="border-b border-slate-800 px-4 py-3 text-sm text-orange-300">
                  {row.x}
                </td>
                <td className="border-b border-slate-800 px-4 py-3 text-sm text-slate-300">
                  {row.shear}
                </td>
                <td className="border-b border-slate-800 px-4 py-3 text-sm text-slate-300">
                  {row.moment}
                </td>
                <td className="border-b border-slate-800 px-4 py-3 text-sm leading-6 text-slate-400">
                  {row.remark}
                </td>
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
            <p className="mt-2 text-2xl font-black text-sky-300">
              {section.shear}
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
            <p className="text-sm text-slate-400">Bending Moment at Section</p>
            <p className="mt-2 text-2xl font-black text-sky-300">
              {section.moment}
            </p>
          </div>
        </div>

        <p className="mt-4 leading-7 text-slate-300">{section.note}</p>
      </div>
    </div>
  )
}
  if (result.caseType === 'ss_udl') {
    const points = Array.from({ length: 35 }, (_, i) => {
      const x = (L * i) / 34
      const M = result.RA * x - (result.w * x * x) / 2
      const ratio = result.Mmax ? M / result.Mmax : 0
      return `${mapX(x)},${yBase + ratio * amp}`
    }).join(' ')

    diagram = (
      <>
        <path
          d={`M ${x0} ${yBase} L ${points} L ${x1} ${yBase} Z`}
          fill="rgba(56,189,248,0.16)"
          stroke="#38bdf8"
          strokeWidth="3"
        />
        <text x={(x0 + x1) / 2 - 65} y={yBase + amp + 22} fill="#bfdbfe" fontSize="13" fontWeight="700">
          Mmax = {fmt(result.Mmax)} kN·m at L/2
        </text>
      </>
    )
  }

  if (result.caseType === 'cantilever_point') {
    diagram = (
      <>
        <path
          d={`M ${x0} ${yBase} L ${x0} ${yBase - amp} L ${x1} ${yBase} Z`}
          fill="rgba(56,189,248,0.16)"
          stroke="#38bdf8"
          strokeWidth="3"
        />
        <text x={x0 + 15} y={yBase - amp - 12} fill="#bfdbfe" fontSize="13" fontWeight="700">
          Hogging M = {fmt(result.Mmax)} kN·m
        </text>
      </>
    )
  }

  if (result.caseType === 'cantilever_udl') {
    const points = Array.from({ length: 35 }, (_, i) => {
      const x = (L * i) / 34
      const M = (result.w * Math.pow(L - x, 2)) / 2
      const ratio = result.Mmax ? M / result.Mmax : 0
      return `${mapX(x)},${yBase - ratio * amp}`
    }).join(' ')

    diagram = (
      <>
        <path
          d={`M ${x0} ${yBase} L ${points} L ${x1} ${yBase} Z`}
          fill="rgba(56,189,248,0.16)"
          stroke="#38bdf8"
          strokeWidth="3"
        />
        <text x={x0 + 15} y={yBase - amp - 12} fill="#bfdbfe" fontSize="13" fontWeight="700">
          Hogging Mmax = {fmt(result.Mmax)} kN·m
        </text>
      </>
    )
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
      <h3 className="mb-3 text-lg font-bold text-white">Bending Moment Diagram</h3>

      <svg viewBox="0 0 640 220" className="h-auto w-full">
        <line x1={x0} y1={yBase} x2={x1} y2={yBase} stroke="#64748b" strokeWidth="2" strokeDasharray="6 6" />
        <line x1={x0} y1="22" x2={x0} y2="180" stroke="#334155" strokeWidth="2" />
        <line x1={x1} y1="22" x2={x1} y2="180" stroke="#334155" strokeWidth="2" />

        {diagram}

        <text x={x0 - 10} y="202" fill="#cbd5e1" fontSize="13" fontWeight="700">A / Fixed</text>
        <text x={x1 - 16} y="202" fill="#cbd5e1" fontSize="13" fontWeight="700">B / Free</text>
        <text x="18" y="18" fill="#94a3b8" fontSize="13">
          BMD shows bending moment variation. Sagging is shown below axis, hogging above axis.
        </text>
      </svg>
    </div>
  )
}

export default function StructuralAnalysisPage() {
const [form, setForm] = useState({
  caseType: 'ss_point',
  L: 6,
  P: 20,
  a: 2,
  w: 5,
  x: 3,
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
  a: 2,
  w: 5,
  x: 3,
})
  }

  const isPointCase = form.caseType.includes('point')
  const isUDLCase = form.caseType.includes('udl')
  const isSimplyPoint = form.caseType === 'ss_point'

  return (
    <main className="min-h-screen bg-[#050B1F] px-4 py-8 text-white md:px-8">
      <section className="mx-auto max-w-7xl">
        <div className="mb-8 rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="mb-3 text-sm font-extrabold uppercase tracking-widest text-orange-400">
                Semester 3 Civil Engineering
              </p>

              <h1 className="text-3xl font-black leading-tight md:text-5xl">
                Structural Analysis Solver for Civil Engineering Students
              </h1>

              <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300 md:text-lg">
      Solve structural analysis problems with beam diagrams, support reactions,
SFD, BMD, formulas, step-by-step solution and exam-style final answer.
              </p>
            </div>

            
          </div>
        </div>

        <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {topicCards.map((topic) => (
            <div
              key={topic}
              className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4"
            >
              <p className="text-sm font-bold text-slate-200">{topic}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-[430px_1fr]">
          <aside className="space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
              <h2 className="text-2xl font-black text-white">Input Panel</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Select beam case and enter values. Diagrams update automatically.
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

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  {selectedCase?.desc}
                </p>
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
  label={
    form.caseType.startsWith('ss')
      ? 'Section x from Support A'
      : 'Section x from Fixed Support'
  }
  value={form.x}
  onChange={(value) => update('x', value)}
  suffix="m"
  helper="Enter any section between 0 and L to get SF and BM at that point."
  min="0"
/>

                {isPointCase && (
                  <NumberField
                    label="Point Load P"
                    value={form.P}
                    onChange={(value) => update('P', value)}
                    suffix="kN"
                    helper="Downward concentrated load."
                    min="0"
                  />
                )}

                {isSimplyPoint && (
                  <NumberField
                    label="Distance a from Left Support"
                    value={form.a}
                    onChange={(value) => update('a', value)}
                    suffix="m"
                    helper="Load position measured from support A."
                    min="0"
                  />
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
                <li>✓ Point load and UDL cases</li>
                <li>✓ Support reaction calculation</li>
                <li>✓ SFD and BMD educational diagrams</li>
                <li>✓ Formula and step-by-step solution</li>
                  <li>✓ SFD and BMD key values table</li>
<li>✓ Shear force and bending moment at any section x</li>
              </ul>

              <div className="mt-5 rounded-2xl border border-orange-500/20 bg-orange-500/10 p-4 text-sm leading-6 text-slate-300">
Useful for semester exams, assignments, practice questions and quick concept revision.              </div>
            </div>
          </aside>

          <section className="space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
              <h2 className="text-2xl font-black text-white">{result.title}</h2>

              <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {result.summary.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-slate-800 bg-slate-950 p-4"
                  >
                    <p className="text-sm text-slate-400">{item.label}</p>
                    <p className="mt-2 text-xl font-black text-orange-300">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <BeamSketch result={result} />

            <div className="grid gap-6 xl:grid-cols-2">
              <SFDDiagram result={result} />
              <BMDDiagram result={result} />
            </div>
                  <DiagramValuesTable result={result} sectionX={form.x} />

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
                <h2 className="text-2xl font-black text-white">Formula Used</h2>

                <div className="mt-5 space-y-3">
                  {result.formulas.map((formula) => (
                    <div
                      key={formula}
                      className="rounded-xl border border-orange-500/20 bg-orange-500/10 px-4 py-3 text-sm font-bold text-orange-200"
                    >
                      {formula}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
                <h2 className="text-2xl font-black text-white">
                  Exam-Style Final Answer
                </h2>

                <p className="mt-5 rounded-2xl border border-slate-800 bg-slate-950 p-5 leading-8 text-slate-200">
                  {result.examAnswer}
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
              <h2 className="text-2xl font-black text-white">
                Step-by-Step Solution
              </h2>

              <div className="mt-6 space-y-4">
                {result.steps.map((step, index) => (
                  <div
                    key={step}
                    className="flex gap-4 rounded-2xl border border-slate-800 bg-slate-950 p-4"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-500 text-sm font-black text-white">
                      {index + 1}
                    </div>
                    <p className="leading-8 text-slate-300">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            
          </section>
        </div>
      </section>
    </main>
  )
}
