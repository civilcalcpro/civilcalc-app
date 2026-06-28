'use client'

import { useMemo, useState } from 'react'

const supportOptions = [
  { value: 'fixed', label: 'Fixed' },
  { value: 'hinge', label: 'Hinged' },
  { value: 'roller', label: 'Roller' },
]

const loadOptions = [
  { value: 'none', label: 'No Load' },
  { value: 'point', label: 'Point Load at Any Distance' },
  { value: 'udl', label: 'UDL Full Span' },
  { value: 'uvl_inc', label: 'UVL Increasing 0 to w' },
  { value: 'uvl_dec', label: 'UVL Decreasing w to 0' },
  { value: 'trapezoidal', label: 'Trapezoidal Load w1 to w2' },
  { value: 'end_moment', label: 'Applied End Moments' },
]

const templates = {
  fixedBeam: {
    name: 'Both End Fixed Beam',
    joints: [
      { name: 'A', support: 'fixed' },
      { name: 'B', support: 'fixed' },
    ],
    members: [
      {
        id: 1,
        left: 'A',
        right: 'B',
        length: 6,
        eiMode: 'relative',
        eiMultiplier: 1,
        actualEI: 1,
        E: 1,
        I: 1,
        settlement: 0,
        loadType: 'udl',
        P: 0,
        a: 3,
        w: 10,
        w1: 0,
        w2: 0,
        endMomentLeft: 0,
        endMomentRight: 0,
      },
    ],
  },

  fixedHinged: {
    name: 'One End Fixed Other Hinged',
    joints: [
      { name: 'A', support: 'fixed' },
      { name: 'B', support: 'hinge' },
    ],
    members: [
      {
        id: 1,
        left: 'A',
        right: 'B',
        length: 6,
        eiMode: 'relative',
        eiMultiplier: 1,
        actualEI: 1,
        E: 1,
        I: 1,
        settlement: 0,
        loadType: 'point',
        P: 40,
        a: 3,
        w: 0,
        w1: 0,
        w2: 0,
        endMomentLeft: 0,
        endMomentRight: 0,
      },
    ],
  },

  continuous2: {
    name: 'Continuous Beam - 2 Spans',
    joints: [
      { name: 'A', support: 'fixed' },
      { name: 'B', support: 'roller' },
      { name: 'C', support: 'hinge' },
    ],
    members: [
      {
        id: 1,
        left: 'A',
        right: 'B',
        length: 4,
        eiMode: 'relative',
        eiMultiplier: 2,
        actualEI: 1,
        E: 1,
        I: 1,
        settlement: 0,
        loadType: 'point',
        P: 40,
        a: 2,
        w: 0,
        w1: 0,
        w2: 0,
        endMomentLeft: 0,
        endMomentRight: 0,
      },
      {
        id: 2,
        left: 'B',
        right: 'C',
        length: 4,
        eiMode: 'relative',
        eiMultiplier: 1,
        actualEI: 1,
        E: 1,
        I: 1,
        settlement: 0,
        loadType: 'udl',
        P: 0,
        a: 2,
        w: 10,
        w1: 0,
        w2: 0,
        endMomentLeft: 0,
        endMomentRight: 0,
      },
    ],
  },

  continuous3: {
    name: 'Continuous Beam - 3 Spans',
    joints: [
      { name: 'A', support: 'fixed' },
      { name: 'B', support: 'roller' },
      { name: 'C', support: 'roller' },
      { name: 'D', support: 'hinge' },
    ],
    members: [
      {
        id: 1,
        left: 'A',
        right: 'B',
        length: 4,
        eiMode: 'relative',
        eiMultiplier: 2,
        actualEI: 1,
        E: 1,
        I: 1,
        settlement: 0,
        loadType: 'point',
        P: 30,
        a: 2,
        w: 0,
        w1: 0,
        w2: 0,
        endMomentLeft: 0,
        endMomentRight: 0,
      },
      {
        id: 2,
        left: 'B',
        right: 'C',
        length: 3,
        eiMode: 'relative',
        eiMultiplier: 3,
        actualEI: 1,
        E: 1,
        I: 1,
        settlement: 0,
        loadType: 'udl',
        P: 0,
        a: 1.5,
        w: 20,
        w1: 0,
        w2: 0,
        endMomentLeft: 0,
        endMomentRight: 0,
      },
      {
        id: 3,
        left: 'C',
        right: 'D',
        length: 3,
        eiMode: 'relative',
        eiMultiplier: 4,
        actualEI: 1,
        E: 1,
        I: 1,
        settlement: 0,
        loadType: 'uvl_inc',
        P: 0,
        a: 1.5,
        w: 15,
        w1: 0,
        w2: 0,
        endMomentLeft: 0,
        endMomentRight: 0,
      },
    ],
  },
}

function n(value, fallback = 0) {
  const x = Number(value)
  return Number.isFinite(x) ? x : fallback
}

function round(value, digits = 3) {
  const x = Number(value)
  if (!Number.isFinite(x)) return '0'
  return x.toFixed(digits).replace(/\.?0+$/, '')
}

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj))
}

function getEI(member) {
  if (member.eiMode === 'actual') return Math.max(n(member.actualEI, 1), 0.000001)
  if (member.eiMode === 'separate') return Math.max(n(member.E, 1) * n(member.I, 1), 0.000001)
  return Math.max(n(member.eiMultiplier, 1), 0.000001)
}

function getEIFullText(member) {
  if (member.eiMode === 'actual') return `${round(member.actualEI)} kN·m²`
  if (member.eiMode === 'separate') return `E × I = ${round(member.E)} × ${round(member.I)}`
  return `${round(member.eiMultiplier)}I`
}

function calculateFEM(member) {
  const L = Math.max(n(member.length, 1), 0.000001)
  const type = member.loadType
  let femLeft = 0
  let femRight = 0
  let formula = 'No load: FEM = 0'

  if (type === 'point') {
    const P = n(member.P)
    const a = Math.min(Math.max(n(member.a), 0), L)
    const b = L - a

    femLeft = -(P * a * b * b) / (L * L)
    femRight = (P * a * a * b) / (L * L)
    formula = `Point Load: FEM_left = -Pab²/L², FEM_right = +Pa²b/L²`
  }

  if (type === 'udl') {
    const w = n(member.w)
    femLeft = -(w * L * L) / 12
    femRight = (w * L * L) / 12
    formula = `UDL: FEM_left = -wL²/12, FEM_right = +wL²/12`
  }

  if (type === 'uvl_inc') {
    const w = n(member.w)
    femLeft = -(w * L * L) / 30
    femRight = (w * L * L) / 20
    formula = `UVL Increasing: FEM_left = -wL²/30, FEM_right = +wL²/20`
  }

  if (type === 'uvl_dec') {
    const w = n(member.w)
    femLeft = -(w * L * L) / 20
    femRight = (w * L * L) / 30
    formula = `UVL Decreasing: FEM_left = -wL²/20, FEM_right = +wL²/30`
  }

  if (type === 'trapezoidal') {
    const w1 = n(member.w1)
    const w2 = n(member.w2)
    const wMin = Math.min(w1, w2)
    const diff = Math.abs(w2 - w1)

    let left = -(wMin * L * L) / 12
    let right = (wMin * L * L) / 12

    if (w2 > w1) {
      left += -(diff * L * L) / 30
      right += (diff * L * L) / 20
    } else if (w1 > w2) {
      left += -(diff * L * L) / 20
      right += (diff * L * L) / 30
    }

    femLeft = left
    femRight = right
    formula = `Trapezoidal Load: UDL part + triangular UVL part`
  }

  if (type === 'end_moment') {
    femLeft = n(member.endMomentLeft)
    femRight = n(member.endMomentRight)
    formula = `Applied End Moments used directly as FEM values`
  }

  return {
    femLeft,
    femRight,
    formula,
  }
}

function momentExpression(member, end, unknownMap) {
  const L = Math.max(n(member.length, 1), 0.000001)
  const EI = getEI(member)
  const settlement = n(member.settlement)
  const psi = settlement / L
  const fem = calculateFEM(member)
  const coeffs = {}
  let constant = end === 'left' ? fem.femLeft : fem.femRight

  constant += (2 * EI / L) * (-3 * psi)

  const leftUnknown = unknownMap[member.left]
  const rightUnknown = unknownMap[member.right]

  if (end === 'left') {
    if (leftUnknown !== undefined) coeffs[leftUnknown] = (coeffs[leftUnknown] || 0) + (4 * EI / L)
    if (rightUnknown !== undefined) coeffs[rightUnknown] = (coeffs[rightUnknown] || 0) + (2 * EI / L)
  } else {
    if (rightUnknown !== undefined) coeffs[rightUnknown] = (coeffs[rightUnknown] || 0) + (4 * EI / L)
    if (leftUnknown !== undefined) coeffs[leftUnknown] = (coeffs[leftUnknown] || 0) + (2 * EI / L)
  }

  return {
    coeffs,
    constant,
  }
}

function addExpr(target, expr) {
  Object.entries(expr.coeffs).forEach(([key, value]) => {
    target.coeffs[key] = (target.coeffs[key] || 0) + value
  })
  target.constant += expr.constant
}

function solveLinear(A, b) {
  const m = A.length
  if (m === 0) return []

  const M = A.map((row, i) => [...row, b[i]])

  for (let col = 0; col < m; col++) {
    let pivot = col

    for (let row = col + 1; row < m; row++) {
      if (Math.abs(M[row][col]) > Math.abs(M[pivot][col])) pivot = row
    }

    if (Math.abs(M[pivot][col]) < 1e-10) {
      throw new Error('Equations are singular. Please check support conditions.')
    }

    const temp = M[col]
    M[col] = M[pivot]
    M[pivot] = temp

    const div = M[col][col]
    for (let k = col; k <= m; k++) M[col][k] /= div

    for (let row = 0; row < m; row++) {
      if (row === col) continue
      const factor = M[row][col]
      for (let k = col; k <= m; k++) {
        M[row][k] -= factor * M[col][k]
      }
    }
  }

  return M.map(row => row[m])
}

function expressionToText(expr, unknownNames) {
  const parts = []

  Object.entries(expr.coeffs).forEach(([key, value]) => {
    const name = unknownNames[Number(key)] || `θ${Number(key) + 1}`
    const sign = value >= 0 ? '+' : '-'
    parts.push(`${sign} ${round(Math.abs(value))}${name}`)
  })

  if (Math.abs(expr.constant) > 1e-9) {
    const sign = expr.constant >= 0 ? '+' : '-'
    parts.push(`${sign} ${round(Math.abs(expr.constant))}`)
  }

  const text = parts.join(' ').trim()
  return text.startsWith('+') ? text.slice(1).trim() : text || '0'
}

function solveSlopeDeflection(joints, members) {
  function loadResultantAndMoment(member) {
  const L = Math.max(n(member.length, 1), 0.000001)
  const type = member.loadType

  if (type === 'point') {
    const P = n(member.P)
    const a = Math.min(Math.max(n(member.a), 0), L)
    return {
      totalLoad: P,
      momentAboutLeft: P * a,
      centroid: a,
    }
  }

  if (type === 'udl') {
    const w = n(member.w)
    return {
      totalLoad: w * L,
      momentAboutLeft: w * L * L / 2,
      centroid: L / 2,
    }
  }

  if (type === 'uvl_inc') {
    const w = n(member.w)
    const W = w * L / 2
    return {
      totalLoad: W,
      momentAboutLeft: W * (2 * L / 3),
      centroid: 2 * L / 3,
    }
  }

  if (type === 'uvl_dec') {
    const w = n(member.w)
    const W = w * L / 2
    return {
      totalLoad: W,
      momentAboutLeft: W * (L / 3),
      centroid: L / 3,
    }
  }

  if (type === 'trapezoidal') {
    const w1 = n(member.w1)
    const w2 = n(member.w2)
    const W = L * (w1 + w2) / 2
    const M = (w1 * L * L / 2) + ((w2 - w1) * L * L / 3)

    return {
      totalLoad: W,
      momentAboutLeft: M,
      centroid: W === 0 ? L / 2 : M / W,
    }
  }

  return {
    totalLoad: 0,
    momentAboutLeft: 0,
    centroid: L / 2,
  }
}

function loadBeforeSection(member, x) {
  const L = Math.max(n(member.length, 1), 0.000001)
  const type = member.loadType
  const xx = Math.min(Math.max(x, 0), L)

  if (type === 'point') {
    const P = n(member.P)
    const a = Math.min(Math.max(n(member.a), 0), L)
    return xx >= a ? P : 0
  }

  if (type === 'udl') {
    const w = n(member.w)
    return w * xx
  }

  if (type === 'uvl_inc') {
    const w = n(member.w)
    return (w * xx * xx) / (2 * L)
  }

  if (type === 'uvl_dec') {
    const w = n(member.w)
    return w * (xx - (xx * xx) / (2 * L))
  }

  if (type === 'trapezoidal') {
    const w1 = n(member.w1)
    const w2 = n(member.w2)
    return (w1 * xx) + ((w2 - w1) * xx * xx) / (2 * L)
  }

  return 0
}

function loadMomentBeforeSection(member, x) {
  const L = Math.max(n(member.length, 1), 0.000001)
  const type = member.loadType
  const xx = Math.min(Math.max(x, 0), L)

  if (type === 'point') {
    const P = n(member.P)
    const a = Math.min(Math.max(n(member.a), 0), L)
    return xx >= a ? P * (xx - a) : 0
  }

  if (type === 'udl') {
    const w = n(member.w)
    return (w * xx * xx) / 2
  }

  if (type === 'uvl_inc') {
    const w = n(member.w)
    return (w * xx * xx * xx) / (6 * L)
  }

  if (type === 'uvl_dec') {
    const w = n(member.w)
    return (w * xx * xx / 2) - (w * xx * xx * xx / (6 * L))
  }

  if (type === 'trapezoidal') {
    const w1 = n(member.w1)
    const w2 = n(member.w2)
    return (w1 * xx * xx / 2) + ((w2 - w1) * xx * xx * xx / (6 * L))
  }

  return 0
}

function calculateMemberSfdBmd(member, endMomentRow) {
  const L = Math.max(n(member.length, 1), 0.000001)

  const MLeft = n(endMomentRow?.Mleft)
  const MRightClockwise = n(endMomentRow?.Mright)

  const load = loadResultantAndMoment(member)

  // BMD convention:
  // Left end ordinate = M_AB
  // Right end ordinate = -M_BA
  const RA = ((-MRightClockwise - MLeft) + load.momentAboutLeft) / L
  const RB = load.totalLoad - RA

  const points = []
  const divisions = 50

  for (let i = 0; i <= divisions; i++) {
    const x = (L * i) / divisions
    const V = RA - loadBeforeSection(member, x)
    const M = MLeft + RA * x - loadMomentBeforeSection(member, x)

    points.push({
      x,
      shear: V,
      moment: M,
    })
  }

  const shears = points.map(p => p.shear)
  const moments = points.map(p => p.moment)

  return {
    member: `${member.left}${member.right}`,
    leftJoint: member.left,
    rightJoint: member.right,
    L,
    RA,
    RB,
    totalLoad: load.totalLoad,
    loadCentroid: load.centroid,
    points,
    maxShear: Math.max(...shears),
    minShear: Math.min(...shears),
    maxMoment: Math.max(...moments),
    minMoment: Math.min(...moments),
  }
}

function SfdBmdDiagrams({ members, endMoments }) {
  const spanData = members.map(member => {
    const row = endMoments.find(item => item.member === `${member.left}${member.right}`)
    return calculateMemberSfdBmd(member, row)
  })

  const totalLength = spanData.reduce((sum, span) => sum + span.L, 0)

  const allShear = spanData.flatMap(span => span.points.map(p => p.shear))
  const allMoment = spanData.flatMap(span => span.points.map(p => p.moment))

  const maxAbsShear = Math.max(1, ...allShear.map(v => Math.abs(v)))
  const maxAbsMoment = Math.max(1, ...allMoment.map(v => Math.abs(v)))

  const width = 940
  const diagramWidth = 780
  const startX = 80
  const endX = startX + diagramWidth

  const sfdZeroY = 130
  const bmdZeroY = 390
  const scaleShear = 85 / maxAbsShear
  const scaleMoment = 100 / maxAbsMoment

  let cumulative = 0
  const spansWithPosition = spanData.map(span => {
    const start = cumulative
    cumulative += span.L
    return {
      ...span,
      globalStart: start,
      globalEnd: cumulative,
    }
  })

  const mapX = globalX => startX + (globalX / totalLength) * diagramWidth

  const sfdY = value => sfdZeroY - value * scaleShear

  // BMD positive sagging downward
  const bmdY = value => bmdZeroY + value * scaleMoment

  const makePolyline = (span, type) => {
    return span.points.map(point => {
      const gx = span.globalStart + point.x
      const y = type === 'sfd' ? sfdY(point.shear) : bmdY(point.moment)
      return `${mapX(gx)},${y}`
    }).join(' ')
  }

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-950 p-5">
      <div className="mb-4">
        <h2 className="text-2xl font-black text-orange-300">
          Step 5: SFD & BMD Diagrams
        </h2>
        <p className="mt-2 text-slate-300">
          Shear Force Diagram and Bending Moment Diagram are generated span-wise using final end moments from slope deflection.
        </p>
      </div>

      <div className="w-full overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900 p-3">
        <svg width={width} height="560" viewBox={`0 0 ${width} 560`} className="min-w-[880px]">
          <text x="30" y="35" fill="#f8fafc" fontSize="20" fontWeight="800">
            Shear Force Diagram
          </text>

          <line x1={startX} y1={sfdZeroY} x2={endX} y2={sfdZeroY} stroke="#64748b" strokeWidth="2" />
          <text x={endX + 10} y={sfdZeroY + 5} fill="#94a3b8" fontSize="13">
            Zero
          </text>

          {spansWithPosition.map(span => (
            <g key={`sfd-${span.member}`}>
              <line
                x1={mapX(span.globalStart)}
                y1={sfdZeroY - 105}
                x2={mapX(span.globalStart)}
                y2={sfdZeroY + 105}
                stroke="#334155"
                strokeWidth="1"
              />

              <polyline
                points={makePolyline(span, 'sfd')}
                fill="none"
                stroke="#38bdf8"
                strokeWidth="4"
                strokeLinejoin="round"
                strokeLinecap="round"
              />

              <text
                x={(mapX(span.globalStart) + mapX(span.globalEnd)) / 2 - 18}
                y={sfdZeroY + 128}
                fill="#cbd5e1"
                fontSize="14"
                fontWeight="700"
              >
                {span.member}
              </text>

              <text
                x={(mapX(span.globalStart) + mapX(span.globalEnd)) / 2 - 42}
                y={sfdZeroY - 112}
                fill="#38bdf8"
                fontSize="12"
              >
                Vmax {round(span.maxShear)} kN
              </text>

              <text
                x={(mapX(span.globalStart) + mapX(span.globalEnd)) / 2 - 42}
                y={sfdZeroY + 112}
                fill="#38bdf8"
                fontSize="12"
              >
                Vmin {round(span.minShear)} kN
              </text>
            </g>
          ))}

          <line x1={endX} y1={sfdZeroY - 105} x2={endX} y2={sfdZeroY + 105} stroke="#334155" strokeWidth="1" />

          <text x="30" y="300" fill="#f8fafc" fontSize="20" fontWeight="800">
            Bending Moment Diagram
          </text>

          <line x1={startX} y1={bmdZeroY} x2={endX} y2={bmdZeroY} stroke="#64748b" strokeWidth="2" />
          <text x={endX + 10} y={bmdZeroY + 5} fill="#94a3b8" fontSize="13">
            Zero
          </text>

          <text x={startX} y={bmdZeroY + 135} fill="#94a3b8" fontSize="13">
            Positive sagging shown downward
          </text>

          {spansWithPosition.map(span => (
            <g key={`bmd-${span.member}`}>
              <line
                x1={mapX(span.globalStart)}
                y1={bmdZeroY - 125}
                x2={mapX(span.globalStart)}
                y2={bmdZeroY + 125}
                stroke="#334155"
                strokeWidth="1"
              />

              <polyline
                points={makePolyline(span, 'bmd')}
                fill="none"
                stroke="#f97316"
                strokeWidth="4"
                strokeLinejoin="round"
                strokeLinecap="round"
              />

              <text
                x={(mapX(span.globalStart) + mapX(span.globalEnd)) / 2 - 18}
                y={bmdZeroY + 158}
                fill="#cbd5e1"
                fontSize="14"
                fontWeight="700"
              >
                {span.member}
              </text>

              <text
                x={(mapX(span.globalStart) + mapX(span.globalEnd)) / 2 - 48}
                y={bmdZeroY - 132}
                fill="#fb923c"
                fontSize="12"
              >
                Mmin {round(span.minMoment)} kNm
              </text>

              <text
                x={(mapX(span.globalStart) + mapX(span.globalEnd)) / 2 - 48}
                y={bmdZeroY + 128}
                fill="#fb923c"
                fontSize="12"
              >
                Mmax {round(span.maxMoment)} kNm
              </text>
            </g>
          ))}

          <line x1={endX} y1={bmdZeroY - 125} x2={endX} y2={bmdZeroY + 125} stroke="#334155" strokeWidth="1" />
        </svg>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[850px] border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-800 text-slate-300">
              <th className="p-3">Member</th>
              <th className="p-3">Left Reaction</th>
              <th className="p-3">Right Reaction</th>
              <th className="p-3">Total Load</th>
              <th className="p-3">Max SF</th>
              <th className="p-3">Min SF</th>
              <th className="p-3">Max BM</th>
              <th className="p-3">Min BM</th>
            </tr>
          </thead>
          <tbody>
            {spanData.map(span => (
              <tr key={span.member} className="border-b border-slate-800">
                <td className="p-3 font-bold text-white">{span.member}</td>
                <td className="p-3 text-sky-300">R{span.leftJoint} = {round(span.RA)} kN</td>
                <td className="p-3 text-sky-300">R{span.rightJoint} = {round(span.RB)} kN</td>
                <td className="p-3 text-slate-300">{round(span.totalLoad)} kN</td>
                <td className="p-3 text-slate-300">{round(span.maxShear)} kN</td>
                <td className="p-3 text-slate-300">{round(span.minShear)} kN</td>
                <td className="p-3 text-orange-300">{round(span.maxMoment)} kNm</td>
                <td className="p-3 text-orange-300">{round(span.minMoment)} kNm</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900 p-4 text-sm text-slate-300">
        <p>
          Note: BMD is generated using final end moments from slope deflection. Positive bending moment is shown downward as sagging.
        </p>
      </div>
    </div>
  )
}
  
  const unknownJoints = joints
    .filter(j => j.support !== 'fixed')
    .map(j => j.name)

  const unknownMap = {}
  unknownJoints.forEach((name, index) => {
    unknownMap[name] = index
  })

  const equations = []
  const equationTexts = []

  unknownJoints.forEach(jointName => {
    const connected = members.filter(m => m.left === jointName || m.right === jointName)
    const eq = { coeffs: {}, constant: 0 }

    connected.forEach(member => {
      const end = member.left === jointName ? 'left' : 'right'
      addExpr(eq, momentExpression(member, end, unknownMap))
    })

    equations.push(eq)
    equationTexts.push({
      joint: jointName,
      text: `At joint ${jointName}: ΣM = ${expressionToText(eq, unknownJoints)} = 0`,
    })
  })

  const size = unknownJoints.length
  const A = equations.map(eq => {
    const row = new Array(size).fill(0)
    Object.entries(eq.coeffs).forEach(([key, value]) => {
      row[Number(key)] = value
    })
    return row
  })
  const b = equations.map(eq => -eq.constant)

  const solved = solveLinear(A, b)

  const rotations = {}
  joints.forEach(j => {
    rotations[j.name] = j.support === 'fixed' ? 0 : solved[unknownMap[j.name]]
  })

  const endMoments = members.map(member => {
    const L = Math.max(n(member.length, 1), 0.000001)
    const EI = getEI(member)
    const fem = calculateFEM(member)
    const settlement = n(member.settlement)
    const psi = settlement / L

    const thetaLeft = rotations[member.left] || 0
    const thetaRight = rotations[member.right] || 0

    const Mleft = fem.femLeft + (2 * EI / L) * (2 * thetaLeft + thetaRight - 3 * psi)
    const Mright = fem.femRight + (2 * EI / L) * (2 * thetaRight + thetaLeft - 3 * psi)

    return {
      member: `${member.left}${member.right}`,
      leftJoint: member.left,
      rightJoint: member.right,
      Mleft,
      Mright,
      femLeft: fem.femLeft,
      femRight: fem.femRight,
      femFormula: fem.formula,
      EI,
      L,
      eiText: getEIFullText(member),
      loadType: member.loadType,
    }
  })

  return {
    unknownJoints,
    unknownMap,
    equations: equationTexts,
    rotations,
    endMoments,
  }
}

function SupportSymbol({ type, x, y }) {
  if (type === 'fixed') {
    return (
      <g>
        <rect x={x - 6} y={y - 38} width="12" height="76" fill="#f97316" />
        {[0, 1, 2, 3, 4].map(i => (
          <line
            key={i}
            x1={x - 18}
            y1={y - 30 + i * 15}
            x2={x - 6}
            y2={y - 38 + i * 15}
            stroke="#fb923c"
            strokeWidth="2"
          />
        ))}
      </g>
    )
  }

  if (type === 'hinge') {
    return (
      <g>
        <polygon points={`${x},${y} ${x - 18},${y + 30} ${x + 18},${y + 30}`} fill="#38bdf8" />
        <line x1={x - 28} y1={y + 30} x2={x + 28} y2={y + 30} stroke="#38bdf8" strokeWidth="3" />
      </g>
    )
  }

  return (
    <g>
      <polygon points={`${x},${y} ${x - 18},${y + 26} ${x + 18},${y + 26}`} fill="#22c55e" />
      <circle cx={x - 10} cy={y + 34} r="5" fill="#22c55e" />
      <circle cx={x + 10} cy={y + 34} r="5" fill="#22c55e" />
      <line x1={x - 30} y1={y + 40} x2={x + 30} y2={y + 40} stroke="#22c55e" strokeWidth="3" />
    </g>
  )
}

function BeamDiagram({ joints, members }) {
  const width = 920
  const height = 330
  const startX = 80
  const endX = 840
  const beamY = 160
  const totalLength = members.reduce((sum, m) => sum + Math.max(n(m.length, 1), 0.000001), 0)

  const jointPositions = {}
  let currentX = startX
  jointPositions[joints[0]?.name || 'A'] = currentX

  members.forEach(member => {
    const spanW = (n(member.length, 1) / totalLength) * (endX - startX)
    currentX += spanW
    jointPositions[member.right] = currentX
  })

  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-slate-700 bg-slate-950 p-3">
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="min-w-[850px]">
        <defs>
          <marker id="arrow" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
            <path d="M0,0 L10,5 L0,10 Z" fill="#f97316" />
          </marker>
        </defs>

        <text x="30" y="35" fill="#f8fafc" fontSize="20" fontWeight="700">
          Beam Diagram
        </text>

        <line x1={startX} y1={beamY} x2={endX} y2={beamY} stroke="#e2e8f0" strokeWidth="8" strokeLinecap="round" />

        {members.map(member => {
          const x1 = jointPositions[member.left]
          const x2 = jointPositions[member.right]
          const mid = (x1 + x2) / 2
          const L = n(member.length, 1)

          return (
            <g key={member.id}>
              <line x1={x1} y1={beamY + 82} x2={x2} y2={beamY + 82} stroke="#64748b" strokeWidth="2" />
              <line x1={x1} y1={beamY + 74} x2={x1} y2={beamY + 90} stroke="#64748b" strokeWidth="2" />
              <line x1={x2} y1={beamY + 74} x2={x2} y2={beamY + 90} stroke="#64748b" strokeWidth="2" />
              <text x={mid - 18} y={beamY + 108} fill="#cbd5e1" fontSize="15">
                {round(L)} m
              </text>

              <text x={mid - 22} y={beamY + 132} fill="#fbbf24" fontSize="14">
                EI: {getEIFullText(member)}
              </text>

              {member.loadType === 'point' && (
                <g>
                  <line
                    x1={x1 + ((n(member.a, L / 2) / L) * (x2 - x1))}
                    y1={beamY - 88}
                    x2={x1 + ((n(member.a, L / 2) / L) * (x2 - x1))}
                    y2={beamY - 15}
                    stroke="#f97316"
                    strokeWidth="4"
                    markerEnd="url(#arrow)"
                  />
                  <text
                    x={x1 + ((n(member.a, L / 2) / L) * (x2 - x1)) - 22}
                    y={beamY - 98}
                    fill="#fb923c"
                    fontSize="14"
                    fontWeight="700"
                  >
                    {round(member.P)} kN
                  </text>
                </g>
              )}

              {member.loadType === 'udl' && (
                <g>
                  {[0, 1, 2, 3, 4, 5].map(i => {
                    const x = x1 + ((i + 0.5) / 6) * (x2 - x1)
                    return (
                      <line
                        key={i}
                        x1={x}
                        y1={beamY - 75}
                        x2={x}
                        y2={beamY - 15}
                        stroke="#f97316"
                        strokeWidth="3"
                        markerEnd="url(#arrow)"
                      />
                    )
                  })}
                  <line x1={x1 + 12} y1={beamY - 75} x2={x2 - 12} y2={beamY - 75} stroke="#f97316" strokeWidth="3" />
                  <text x={mid - 35} y={beamY - 90} fill="#fb923c" fontSize="14" fontWeight="700">
                    {round(member.w)} kN/m
                  </text>
                </g>
              )}

              {member.loadType === 'uvl_inc' && (
                <g>
                  {[0, 1, 2, 3, 4, 5].map(i => {
                    const ratio = (i + 1) / 6
                    const x = x1 + ratio * (x2 - x1)
                    const top = beamY - 25 - ratio * 60
                    return (
                      <line key={i} x1={x} y1={top} x2={x} y2={beamY - 15} stroke="#f97316" strokeWidth="3" markerEnd="url(#arrow)" />
                    )
                  })}
                  <line x1={x1 + 12} y1={beamY - 25} x2={x2 - 12} y2={beamY - 85} stroke="#f97316" strokeWidth="3" />
                  <text x={mid - 45} y={beamY - 100} fill="#fb923c" fontSize="14" fontWeight="700">
                    UVL 0 to {round(member.w)}
                  </text>
                </g>
              )}

              {member.loadType === 'uvl_dec' && (
                <g>
                  {[0, 1, 2, 3, 4, 5].map(i => {
                    const ratio = (i + 1) / 6
                    const x = x1 + ratio * (x2 - x1)
                    const top = beamY - 85 + ratio * 60
                    return (
                      <line key={i} x1={x} y1={top} x2={x} y2={beamY - 15} stroke="#f97316" strokeWidth="3" markerEnd="url(#arrow)" />
                    )
                  })}
                  <line x1={x1 + 12} y1={beamY - 85} x2={x2 - 12} y2={beamY - 25} stroke="#f97316" strokeWidth="3" />
                  <text x={mid - 45} y={beamY - 100} fill="#fb923c" fontSize="14" fontWeight="700">
                    UVL {round(member.w)} to 0
                  </text>
                </g>
              )}

              {member.loadType === 'trapezoidal' && (
                <g>
                  {[0, 1, 2, 3, 4, 5].map(i => {
                    const ratio = (i + 1) / 6
                    const x = x1 + ratio * (x2 - x1)
                    const intensity = n(member.w1) + (n(member.w2) - n(member.w1)) * ratio
                    const maxW = Math.max(n(member.w1), n(member.w2), 1)
                    const top = beamY - 25 - (intensity / maxW) * 60
                    return (
                      <line key={i} x1={x} y1={top} x2={x} y2={beamY - 15} stroke="#f97316" strokeWidth="3" markerEnd="url(#arrow)" />
                    )
                  })}
                  <line
                    x1={x1 + 12}
                    y1={beamY - 25 - (n(member.w1) / Math.max(n(member.w1), n(member.w2), 1)) * 60}
                    x2={x2 - 12}
                    y2={beamY - 25 - (n(member.w2) / Math.max(n(member.w1), n(member.w2), 1)) * 60}
                    stroke="#f97316"
                    strokeWidth="3"
                  />
                  <text x={mid - 55} y={beamY - 100} fill="#fb923c" fontSize="14" fontWeight="700">
                    {round(member.w1)} to {round(member.w2)} kN/m
                  </text>
                </g>
              )}
            </g>
          )
        })}

        {joints.map(joint => {
          const x = jointPositions[joint.name] || startX
          return (
            <g key={joint.name}>
              <SupportSymbol type={joint.support} x={x} y={beamY + 8} />
              <circle cx={x} cy={beamY} r="8" fill="#f8fafc" />
              <text x={x - 7} y={beamY - 18} fill="#f8fafc" fontSize="18" fontWeight="700">
                {joint.name}
              </text>
              <text x={x - 22} y={beamY + 70} fill="#cbd5e1" fontSize="13">
                {joint.support}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

function Input({ label, value, onChange, type = 'number', step = 'any', placeholder = '' }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-300">{label}</span>
      <input
        type={type}
        step={step}
        value={value}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-3 text-white outline-none transition focus:border-orange-500"
      />
    </label>
  )
}

function Select({ label, value, onChange, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-300">{label}</span>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-3 text-white outline-none transition focus:border-orange-500"
      >
        {children}
      </select>
    </label>
  )
}

export default function StructuralAnalysisPage() {
  const [problemName, setProblemName] = useState('Slope Deflection Method')
  const [templateName, setTemplateName] = useState('continuous3')
  const [joints, setJoints] = useState(deepClone(templates.continuous3.joints))
  const [members, setMembers] = useState(deepClone(templates.continuous3.members))
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const canAddMember = members.length < 5

  const applyTemplate = key => {
    setTemplateName(key)
    setJoints(deepClone(templates[key].joints))
    setMembers(deepClone(templates[key].members))
    setResult(null)
    setError('')
  }

  const updateJoint = (index, key, value) => {
    const copy = [...joints]
    copy[index] = { ...copy[index], [key]: value }
    setJoints(copy)
    setResult(null)
  }

  const updateMember = (index, key, value) => {
    const copy = [...members]
    copy[index] = { ...copy[index], [key]: value }
    setMembers(copy)
    setResult(null)
  }

  const addSpan = () => {
    if (!canAddMember) return

    const lastJoint = joints[joints.length - 1]
    const nextName = String.fromCharCode(65 + joints.length)

    setJoints([...joints, { name: nextName, support: 'roller' }])
    setMembers([
      ...members,
      {
        id: Date.now(),
        left: lastJoint.name,
        right: nextName,
        length: 4,
        eiMode: 'relative',
        eiMultiplier: 1,
        actualEI: 1,
        E: 1,
        I: 1,
        settlement: 0,
        loadType: 'none',
        P: 0,
        a: 2,
        w: 0,
        w1: 0,
        w2: 0,
        endMomentLeft: 0,
        endMomentRight: 0,
      },
    ])
    setResult(null)
  }

  const removeLastSpan = () => {
    if (members.length <= 1) return
    setMembers(members.slice(0, -1))
    setJoints(joints.slice(0, -1))
    setResult(null)
  }

  const calculate = () => {
    setError('')

    try {
      if (members.length < 1) {
        setError('At least one span is required.')
        return
      }

      const fixedCount = joints.filter(j => j.support === 'fixed').length
      if (fixedCount === 0 && joints.length === 2) {
        setError('Single span mechanism detected. Please keep at least one end fixed for slope deflection.')
        return
      }

      const solved = solveSlopeDeflection(joints, members)
      setResult(solved)
    } catch (err) {
      setError(err.message || 'Calculation failed. Please check input values.')
      setResult(null)
    }
  }

  const totalLength = useMemo(() => {
    return members.reduce((sum, m) => sum + n(m.length), 0)
  }, [members])

  return (
    <main className="min-h-screen bg-[#050B1F] px-4 py-8 text-white md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 rounded-3xl border border-orange-500/20 bg-gradient-to-br from-slate-950 via-slate-900 to-[#050B1F] p-6 shadow-2xl shadow-orange-500/10">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-orange-400">
                CivilCalc Pro
              </p>
              <h1 className="text-3xl font-black md:text-5xl">
                Structural Analysis Solver
              </h1>
              <p className="mt-3 max-w-3xl text-slate-300">
                Slope Deflection Method calculator for fixed beam, propped beam and continuous beam with automatic diagram, FEM, equations, rotations and final end moments.
              </p>
            </div>

            <button
              onClick={calculate}
              className="rounded-2xl bg-orange-500 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-orange-500/30 transition hover:bg-orange-600"
            >
              Calculate Now
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
          <section className="space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-950 p-5">
              <h2 className="mb-4 text-xl font-bold">Problem Setup</h2>

              <div className="space-y-4">
                <Input
                  label="Problem Name"
                  type="text"
                  value={problemName}
                  onChange={setProblemName}
                />

                <Select label="Ready Made Template" value={templateName} onChange={applyTemplate}>
                  {Object.entries(templates).map(([key, t]) => (
                    <option key={key} value={key}>{t.name}</option>
                  ))}
                </Select>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={addSpan}
                    disabled={!canAddMember}
                    className="rounded-xl border border-orange-500/40 bg-orange-500/10 px-4 py-3 font-semibold text-orange-300 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    + Add Span
                  </button>
                  <button
                    onClick={removeLastSpan}
                    disabled={members.length <= 1}
                    className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 font-semibold text-red-300 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Remove Span
                  </button>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 text-sm text-slate-300">
                  <p>Total Spans: <b className="text-white">{members.length}</b></p>
                  <p>Total Length: <b className="text-white">{round(totalLength)} m</b></p>
                  <p>Sign Convention: <b className="text-white">Clockwise end moment positive</b></p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-950 p-5">
              <h2 className="mb-4 text-xl font-bold">Joint Supports</h2>

              <div className="space-y-4">
                {joints.map((joint, index) => (
                  <div key={joint.name} className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
                    <div className="mb-3 text-lg font-bold text-orange-300">Joint {joint.name}</div>
                    <Select
                      label="Support Type"
                      value={joint.support}
                      onChange={value => updateJoint(index, 'support', value)}
                    >
                      {supportOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </Select>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-950 p-5">
              <h2 className="mb-4 text-xl font-bold">Span / Member Data</h2>

              <div className="space-y-5">
                {members.map((member, index) => (
                  <div key={member.id} className="rounded-3xl border border-slate-800 bg-slate-900 p-5">
                    <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                      <h3 className="text-xl font-black text-orange-300">
                        Member {member.left}{member.right}
                      </h3>
                      <span className="rounded-full bg-slate-800 px-4 py-2 text-sm text-slate-300">
                        {getEIFullText(member)}
                      </span>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                      <Input
                        label="Length L (m)"
                        value={member.length}
                        onChange={value => updateMember(index, 'length', value)}
                      />

                      <Select
                        label="EI Input Type"
                        value={member.eiMode}
                        onChange={value => updateMember(index, 'eiMode', value)}
                      >
                        <option value="relative">Relative EI / I Multiplier</option>
                        <option value="actual">Actual EI</option>
                        <option value="separate">E × I</option>
                      </Select>

                      <Input
                        label="Support Settlement Δ (m)"
                        value={member.settlement}
                        onChange={value => updateMember(index, 'settlement', value)}
                      />
                    </div>

                    <div className="mt-4 grid gap-4 md:grid-cols-3">
                      {member.eiMode === 'relative' && (
                        <Input
                          label="EI Multiplier, e.g. 2 for 2I"
                          value={member.eiMultiplier}
                          onChange={value => updateMember(index, 'eiMultiplier', value)}
                        />
                      )}

                      {member.eiMode === 'actual' && (
                        <Input
                          label="Actual EI (kN·m²)"
                          value={member.actualEI}
                          onChange={value => updateMember(index, 'actualEI', value)}
                        />
                      )}

                      {member.eiMode === 'separate' && (
                        <>
                          <Input
                            label="E"
                            value={member.E}
                            onChange={value => updateMember(index, 'E', value)}
                          />
                          <Input
                            label="I"
                            value={member.I}
                            onChange={value => updateMember(index, 'I', value)}
                          />
                        </>
                      )}
                    </div>

                    <div className="mt-5 grid gap-4 md:grid-cols-3">
                      <Select
                        label="Load Type"
                        value={member.loadType}
                        onChange={value => updateMember(index, 'loadType', value)}
                      >
                        {loadOptions.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </Select>

                      {member.loadType === 'point' && (
                        <>
                          <Input
                            label="Point Load P (kN)"
                            value={member.P}
                            onChange={value => updateMember(index, 'P', value)}
                          />
                          <Input
                            label="Distance a from Left (m)"
                            value={member.a}
                            onChange={value => updateMember(index, 'a', value)}
                          />
                        </>
                      )}

                      {member.loadType === 'udl' && (
                        <Input
                          label="UDL w (kN/m)"
                          value={member.w}
                          onChange={value => updateMember(index, 'w', value)}
                        />
                      )}

                      {(member.loadType === 'uvl_inc' || member.loadType === 'uvl_dec') && (
                        <Input
                          label="Maximum UVL w (kN/m)"
                          value={member.w}
                          onChange={value => updateMember(index, 'w', value)}
                        />
                      )}

                      {member.loadType === 'trapezoidal' && (
                        <>
                          <Input
                            label="w1 at Left (kN/m)"
                            value={member.w1}
                            onChange={value => updateMember(index, 'w1', value)}
                          />
                          <Input
                            label="w2 at Right (kN/m)"
                            value={member.w2}
                            onChange={value => updateMember(index, 'w2', value)}
                          />
                        </>
                      )}

                      {member.loadType === 'end_moment' && (
                        <>
                          <Input
                            label="Left End Moment (kNm)"
                            value={member.endMomentLeft}
                            onChange={value => updateMember(index, 'endMomentLeft', value)}
                          />
                          <Input
                            label="Right End Moment (kNm)"
                            value={member.endMomentRight}
                            onChange={value => updateMember(index, 'endMomentRight', value)}
                          />
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <BeamDiagram joints={joints} members={members} />

            {error && (
              <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-4 text-red-200">
                {error}
              </div>
            )}

            {result && (
              <div className="space-y-6">
                <div className="rounded-3xl border border-slate-800 bg-slate-950 p-5">
                  <h2 className="mb-4 text-2xl font-black text-orange-300">Step 1: Fixed End Moments</h2>

                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[720px] border-collapse text-left">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-300">
                          <th className="p-3">Member</th>
                          <th className="p-3">Load</th>
                          <th className="p-3">Formula</th>
                          <th className="p-3">FEM Left</th>
                          <th className="p-3">FEM Right</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.endMoments.map(row => (
                          <tr key={row.member} className="border-b border-slate-800">
                            <td className="p-3 font-bold text-white">{row.member}</td>
                            <td className="p-3 text-slate-300">{row.loadType}</td>
                            <td className="p-3 text-slate-300">{row.femFormula}</td>
                            <td className="p-3 text-orange-300">{round(row.femLeft)} kNm</td>
                            <td className="p-3 text-orange-300">{round(row.femRight)} kNm</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-800 bg-slate-950 p-5">
                  <h2 className="mb-4 text-2xl font-black text-orange-300">Step 2: Slope Deflection Equations</h2>

                  <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 text-slate-200">
                    <p className="font-bold text-white">Formula Used:</p>
                    <p className="mt-2">M_AB = FEM_AB + (2EI/L)(2θ_A + θ_B - 3Δ/L)</p>
                    <p>M_BA = FEM_BA + (2EI/L)(2θ_B + θ_A - 3Δ/L)</p>
                  </div>

                  <div className="mt-4 space-y-3">
                    {result.equations.map(eq => (
                      <div key={eq.joint} className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
                        <p className="font-semibold text-slate-200">{eq.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-800 bg-slate-950 p-5">
                  <h2 className="mb-4 text-2xl font-black text-orange-300">Step 3: Solved Rotations</h2>

                  <div className="grid gap-4 md:grid-cols-3">
                    {Object.entries(result.rotations).map(([joint, value]) => (
                      <div key={joint} className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
                        <p className="text-sm text-slate-400">Rotation at Joint {joint}</p>
                        <p className="mt-2 text-2xl font-black text-white">θ{joint} = {round(value, 5)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-800 bg-slate-950 p-5">
                  <h2 className="mb-4 text-2xl font-black text-orange-300">Step 4: Final End Moments</h2>

                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[760px] border-collapse text-left">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-300">
                          <th className="p-3">Member</th>
                          <th className="p-3">EI</th>
                          <th className="p-3">Length</th>
                          <th className="p-3">Left End Moment</th>
                          <th className="p-3">Right End Moment</th>
                          <th className="p-3">Remark</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.endMoments.map(row => (
                          <tr key={row.member} className="border-b border-slate-800">
                            <td className="p-3 font-bold text-white">{row.member}</td>
                            <td className="p-3 text-slate-300">{row.eiText}</td>
                            <td className="p-3 text-slate-300">{round(row.L)} m</td>
                            <td className="p-3 font-bold text-orange-300">
                              M{row.leftJoint}{row.rightJoint} = {round(row.Mleft)} kNm
                            </td>
                            <td className="p-3 font-bold text-orange-300">
                              M{row.rightJoint}{row.leftJoint} = {round(row.Mright)} kNm
                            </td>
                            <td className="p-3 text-slate-300">
                              {row.Mleft < 0 || row.Mright < 0 ? 'Hogging/Sagging possible' : 'Positive end moments'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <SfdBmdDiagrams members={members} endMoments={result.endMoments} />
                          
                <div className="rounded-3xl border border-orange-500/30 bg-orange-500/10 p-5">
                  <h2 className="mb-3 text-2xl font-black text-orange-300">Exam Style Final Answer</h2>
                  <p className="text-slate-200">
                    Using slope deflection method, fixed end moments were calculated first. Then joint equilibrium equations were formed at all non-fixed joints. After solving rotations, final end moments are obtained as shown in the table above.
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}
