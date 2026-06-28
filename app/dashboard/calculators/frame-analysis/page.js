'use client'

import { useMemo, useState } from 'react'

const topicCards = [
  '2D Frame Stiffness',
  'Portal Frame',
  'Fixed Base',
  'Pin Base',
  'One Storey Frame',
  'Two Storey Frame',
  'Joint Loads',
  'Beam UDL',
  'Beam Point Load',
  'Support Reactions',
  'Joint Displacements',
  'Member End Forces',
  'Axial Force',
  'Shear Force',
  'Bending Moment',
  'Deflected Shape',
]

const templateInfo = {
  fixedPortal: {
    title: 'Fixed Base Portal Frame',
    desc: 'Single bay, single storey portal frame with fixed bases.',
  },
  pinPortal: {
    title: 'Pin Base Portal Frame',
    desc: 'Single bay, single storey portal frame with pin bases.',
  },
  horizontalLoad: {
    title: 'Portal Frame with Horizontal Load',
    desc: 'Useful for sway and lateral load frame questions.',
  },
  beamUdl: {
    title: 'Portal Frame with UDL on Beam',
    desc: 'Beam carrying UDL with portal frame supports.',
  },
  beamPoint: {
    title: 'Portal Frame with Point Load on Beam',
    desc: 'Beam carrying point load at selected position.',
  },
  twoStorey: {
    title: 'Two Storey Frame Basic',
    desc: 'Two storey single bay frame with storey beam loads.',
  },
  custom: {
    title: 'Custom Frame',
    desc: 'Change geometry, supports, properties and loads manually.',
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

function nodeName(index) {
  return `J${index + 1}`
}

function memberName(index) {
  return `M${index + 1}`
}

function getTemplateDefaults(template) {
  const base = {
    template,
    storeys: 1,
    bayWidth: 6,
    storeyHeight: 4,
    leftBase: 'fixed',
    rightBase: 'fixed',

    columnE: 25,
    columnA: 2500,
    columnI: 850,
    beamE: 25,
    beamA: 2200,
    beamI: 650,

    loadJoint: 'topRight',
    horizontalLoad: 30,
    verticalJointLoad: 0,
    jointMoment: 0,
    jointMomentDirection: 'clockwise',

    beamLoads: [
      { udl: 20, pointLoad: 0, pointPosition: 3 },
      { udl: 0, pointLoad: 0, pointPosition: 3 },
    ],
  }

  if (template === 'pinPortal') {
    return {
      ...base,
      leftBase: 'pin',
      rightBase: 'pin',
      horizontalLoad: 20,
      beamLoads: [
        { udl: 15, pointLoad: 0, pointPosition: 3 },
        { udl: 0, pointLoad: 0, pointPosition: 3 },
      ],
    }
  }

  if (template === 'horizontalLoad') {
    return {
      ...base,
      horizontalLoad: 50,
      beamLoads: [
        { udl: 0, pointLoad: 0, pointPosition: 3 },
        { udl: 0, pointLoad: 0, pointPosition: 3 },
      ],
    }
  }

  if (template === 'beamUdl') {
    return {
      ...base,
      horizontalLoad: 0,
      beamLoads: [
        { udl: 25, pointLoad: 0, pointPosition: 3 },
        { udl: 0, pointLoad: 0, pointPosition: 3 },
      ],
    }
  }

  if (template === 'beamPoint') {
    return {
      ...base,
      horizontalLoad: 0,
      beamLoads: [
        { udl: 0, pointLoad: 80, pointPosition: 3 },
        { udl: 0, pointLoad: 0, pointPosition: 3 },
      ],
    }
  }

  if (template === 'twoStorey') {
    return {
      ...base,
      storeys: 2,
      horizontalLoad: 40,
      beamLoads: [
        { udl: 15, pointLoad: 0, pointPosition: 3 },
        { udl: 20, pointLoad: 0, pointPosition: 3 },
      ],
    }
  }

  return base
}

function zeros(n, m = null) {
  if (m === null) return Array(n).fill(0)
  return Array.from({ length: n }, () => Array(m).fill(0))
}

function transpose(A) {
  return A[0].map((_, j) => A.map((row) => row[j]))
}

function matMul(A, B) {
  const rows = A.length
  const cols = B[0].length
  const inner = B.length
  const C = zeros(rows, cols)

  for (let i = 0; i < rows; i += 1) {
    for (let j = 0; j < cols; j += 1) {
      let sum = 0
      for (let k = 0; k < inner; k += 1) {
        sum += A[i][k] * B[k][j]
      }
      C[i][j] = sum
    }
  }

  return C
}

function matVec(A, x) {
  return A.map((row) => row.reduce((sum, value, i) => sum + value * x[i], 0))
}

function gaussianSolve(A, b) {
  const n = A.length
  const M = A.map((row, i) => [...row, b[i]])

  for (let k = 0; k < n; k += 1) {
    let pivot = k

    for (let i = k + 1; i < n; i += 1) {
      if (Math.abs(M[i][k]) > Math.abs(M[pivot][k])) pivot = i
    }

    if (Math.abs(M[pivot][k]) < 1e-12) {
      throw new Error('Frame is unstable or support conditions are insufficient.')
    }

    if (pivot !== k) {
      const temp = M[k]
      M[k] = M[pivot]
      M[pivot] = temp
    }

    const div = M[k][k]

    for (let j = k; j <= n; j += 1) M[k][j] /= div

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

function localFrameStiffness(EA, EI, L) {
  const a = EA / L
  const b = (12 * EI) / Math.pow(L, 3)
  const c = (6 * EI) / Math.pow(L, 2)
  const d = (4 * EI) / L
  const e = (2 * EI) / L

  return [
    [a, 0, 0, -a, 0, 0],
    [0, b, c, 0, -b, c],
    [0, c, d, 0, -c, e],
    [-a, 0, 0, a, 0, 0],
    [0, -b, -c, 0, b, -c],
    [0, c, e, 0, -c, d],
  ]
}

function transformationMatrix(c, s) {
  return [
    [c, s, 0, 0, 0, 0],
    [-s, c, 0, 0, 0, 0],
    [0, 0, 1, 0, 0, 0],
    [0, 0, 0, c, s, 0],
    [0, 0, 0, -s, c, 0],
    [0, 0, 0, 0, 0, 1],
  ]
}

function beamEquivalentLoadLocal(L, load) {
  const f = [0, 0, 0, 0, 0, 0]
  const w = Math.max(toNum(load.udl, 0), 0)
  const P = Math.max(toNum(load.pointLoad, 0), 0)
  const a = clamp(toNum(load.pointPosition, L / 2), 0, L)
  const xi = L > 0 ? a / L : 0

  if (w > 0) {
    const q = -w
    f[1] += (q * L) / 2
    f[2] += (q * L * L) / 12
    f[4] += (q * L) / 2
    f[5] += -(q * L * L) / 12
  }

  if (P > 0) {
    const F = -P
    const N1 = 1 - 3 * xi * xi + 2 * xi * xi * xi
    const N2 = L * (xi - 2 * xi * xi + xi * xi * xi)
    const N3 = 3 * xi * xi - 2 * xi * xi * xi
    const N4 = L * (-xi * xi + xi * xi * xi)

    f[1] += F * N1
    f[2] += F * N2
    f[4] += F * N3
    f[5] += F * N4
  }

  return f
}

function getEA(EGPa, Acm2) {
  return Math.max(toNum(EGPa, 25), 0.001) * Math.max(toNum(Acm2, 1), 0.001) * 100
}

function getEI(EGPa, I10e6mm4) {
  return Math.max(toNum(EGPa, 25), 0.001) * Math.max(toNum(I10e6mm4, 1), 0.001)
}

function buildFrameModel(form) {
  const storeys = clamp(toNum(form.storeys, 1), 1, 2)
  const W = Math.max(toNum(form.bayWidth, 6), 0.001)
  const H = Math.max(toNum(form.storeyHeight, 4), 0.001)
  const nodes = []

  for (let level = 0; level <= storeys; level += 1) {
    nodes.push({ id: nodes.length, label: nodeName(nodes.length), x: 0, y: level * H, level, side: 'left' })
    nodes.push({ id: nodes.length, label: nodeName(nodes.length), x: W, y: level * H, level, side: 'right' })
  }

  const members = []

  for (let level = 0; level < storeys; level += 1) {
    members.push({
      id: members.length,
      type: 'column',
      label: memberName(members.length),
      i: level * 2,
      j: (level + 1) * 2,
      level: level + 1,
      side: 'left',
    })

    members.push({
      id: members.length,
      type: 'column',
      label: memberName(members.length),
      i: level * 2 + 1,
      j: (level + 1) * 2 + 1,
      level: level + 1,
      side: 'right',
    })
  }

  for (let level = 1; level <= storeys; level += 1) {
    members.push({
      id: members.length,
      type: 'beam',
      label: memberName(members.length),
      i: level * 2,
      j: level * 2 + 1,
      level,
      side: 'beam',
    })
  }

  return {
    storeys,
    W,
    H,
    totalHeight: storeys * H,
    nodes,
    members,
  }
}

function getJointLoadNode(form, model) {
  const topLevel = model.storeys
  if (form.loadJoint === 'topLeft') return topLevel * 2
  return topLevel * 2 + 1
}

function getSupportRestraints(support) {
  if (support === 'fixed') return [true, true, true]
  if (support === 'pin') return [true, true, false]
  if (support === 'roller') return [false, true, false]
  return [false, false, false]
}

function solveFrame(form) {
  const model = buildFrameModel(form)
  const ndof = model.nodes.length * 3
  const K = zeros(ndof, ndof)
  const F = zeros(ndof)
  const memberRecords = []

  model.members.forEach((member) => {
    const ni = model.nodes[member.i]
    const nj = model.nodes[member.j]
    const dx = nj.x - ni.x
    const dy = nj.y - ni.y
    const L = Math.sqrt(dx * dx + dy * dy)

    if (L <= 0) throw new Error('Member length cannot be zero.')

    const c = dx / L
    const s = dy / L
    const isBeam = member.type === 'beam'

    const EA = isBeam ? getEA(form.beamE, form.beamA) : getEA(form.columnE, form.columnA)
    const EI = isBeam ? getEI(form.beamE, form.beamI) : getEI(form.columnE, form.columnI)

    const kLocal = localFrameStiffness(EA, EI, L)
    const T = transformationMatrix(c, s)
    const kGlobal = matMul(transpose(T), matMul(kLocal, T))
    const dofs = [
      member.i * 3,
      member.i * 3 + 1,
      member.i * 3 + 2,
      member.j * 3,
      member.j * 3 + 1,
      member.j * 3 + 2,
    ]

    const load = isBeam ? form.beamLoads[member.level - 1] || { udl: 0, pointLoad: 0, pointPosition: L / 2 } : null
    const fLocal = isBeam ? beamEquivalentLoadLocal(L, load) : [0, 0, 0, 0, 0, 0]
    const fGlobal = matVec(transpose(T), fLocal)

    for (let a = 0; a < 6; a += 1) {
      F[dofs[a]] += fGlobal[a]

      for (let b = 0; b < 6; b += 1) {
        K[dofs[a]][dofs[b]] += kGlobal[a][b]
      }
    }

    memberRecords.push({
      ...member,
      ni,
      nj,
      L,
      c,
      s,
      EA,
      EI,
      kLocal,
      kGlobal,
      T,
      fLocal,
      fGlobal,
      dofs,
      load,
    })
  })

  const jointLoadNode = getJointLoadNode(form, model)
  const horizontalLoad = toNum(form.horizontalLoad, 0)
  const verticalJointLoad = Math.max(toNum(form.verticalJointLoad, 0), 0)
  const jointMoment = Math.max(toNum(form.jointMoment, 0), 0)

  F[jointLoadNode * 3] += horizontalLoad
  F[jointLoadNode * 3 + 1] += -verticalJointLoad
  F[jointLoadNode * 3 + 2] += form.jointMomentDirection === 'anticlockwise' ? jointMoment : -jointMoment

  const known = []
  const leftRestraints = getSupportRestraints(form.leftBase)
  const rightRestraints = getSupportRestraints(form.rightBase)

  leftRestraints.forEach((restrained, i) => {
    if (restrained) known.push(i)
  })

  rightRestraints.forEach((restrained, i) => {
    if (restrained) known.push(3 + i)
  })

  const knownSet = new Set(known)
  const free = Array.from({ length: ndof }, (_, i) => i).filter((dof) => !knownSet.has(dof))

  if (!known.length) throw new Error('At least one support restraint is required.')

  const Kff = free.map((i) => free.map((j) => K[i][j]))
  const Ff = free.map((i) => F[i])
  const df = gaussianSolve(Kff, Ff)
  const D = zeros(ndof)

  free.forEach((dof, index) => {
    D[dof] = df[index]
  })

  const KD = matVec(K, D)
  const R = KD.map((value, i) => value - F[i])

  const supportReactions = [
    {
      node: model.nodes[0],
      support: form.leftBase,
      Rx: R[0],
      Ry: R[1],
      Mz: R[2],
    },
    {
      node: model.nodes[1],
      support: form.rightBase,
      Rx: R[3],
      Ry: R[4],
      Mz: R[5],
    },
  ]

  const jointDisplacements = model.nodes.map((node) => ({
    ...node,
    ux: D[node.id * 3],
    uy: D[node.id * 3 + 1],
    rz: D[node.id * 3 + 2],
  }))

  const memberForces = memberRecords.map((member) => {
    const dGlobal = member.dofs.map((dof) => D[dof])
    const dLocal = matVec(member.T, dGlobal)
    const kd = matVec(member.kLocal, dLocal)
    const qLocal = kd.map((value, i) => value - member.fLocal[i])

    return {
      id: member.id,
      label: member.label,
      type: member.type,
      level: member.level,
      from: model.nodes[member.i].label,
      to: model.nodes[member.j].label,
      length: member.L,
      axialStart: qLocal[0],
      shearStart: qLocal[1],
      momentStart: qLocal[2],
      axialEnd: qLocal[3],
      shearEnd: qLocal[4],
      momentEnd: qLocal[5],
      dLocal,
      qLocal,
      member,
    }
  })

  const maxUx = jointDisplacements.reduce((best, node) => (Math.abs(node.ux) > Math.abs(best.ux) ? node : best), jointDisplacements[0])
  const maxUy = jointDisplacements.reduce((best, node) => (Math.abs(node.uy) > Math.abs(best.uy) ? node : best), jointDisplacements[0])

  const maxEndMoment = memberForces.reduce((best, member) => {
    const maxMemberMoment = Math.max(Math.abs(member.momentStart), Math.abs(member.momentEnd))
    return maxMemberMoment > best.value
      ? {
          value: maxMemberMoment,
          member,
        }
      : best
  }, { value: 0, member: memberForces[0] })

  const maxAxial = memberForces.reduce((best, member) => {
    const maxMemberAxial = Math.max(Math.abs(member.axialStart), Math.abs(member.axialEnd))
    return maxMemberAxial > best.value
      ? {
          value: maxMemberAxial,
          member,
        }
      : best
  }, { value: 0, member: memberForces[0] })

  const maxShear = memberForces.reduce((best, member) => {
    const maxMemberShear = Math.max(Math.abs(member.shearStart), Math.abs(member.shearEnd))
    return maxMemberShear > best.value
      ? {
          value: maxMemberShear,
          member,
        }
      : best
  }, { value: 0, member: memberForces[0] })

  const restrainedDofs = known.length
  const freeDofs = free.length

  const summary = [
    { label: 'Frame Type', value: templateInfo[form.template]?.title || 'Custom Frame' },
    { label: 'Free DOF', value: `${freeDofs}` },
    { label: 'Restrained DOF', value: `${restrainedDofs}` },
    { label: 'Max Lateral Displacement', value: `${fmt(maxUx.ux * 1000, 4)} mm at ${maxUx.label}` },
    { label: 'Max Vertical Displacement', value: `${fmt(maxUy.uy * 1000, 4)} mm at ${maxUy.label}` },
    { label: 'Max |End Moment|', value: `${fmt(maxEndMoment.value, 3)} kN·m` },
  ]

  const formulas = [
    'Each frame joint has 3 degrees of freedom: horizontal displacement u, vertical displacement v and rotation θ.',
    '2D frame element stiffness matrix includes axial stiffness EA/L and flexural stiffness EI.',
    'Local stiffness matrix is transformed to global coordinates using transformation matrix [T].',
    'Global stiffness equation: [K]{D} = {F}.',
    'Unknown joint displacements are solved after applying support restraints.',
    'Support reactions are recovered from {R} = [K]{D} - {F}.',
    'Member end forces are calculated from {q} = [k]{d} - {f}.',
    'Beam UDL and point load are converted into equivalent fixed-end nodal loads.',
  ]

  const steps = [
    `Frame template selected: ${templateInfo[form.template]?.title || 'Custom Frame'}.`,
    `Frame geometry: bay width = ${fmt(model.W, 3)} m, storey height = ${fmt(model.H, 3)} m, storeys = ${model.storeys}.`,
    `Total joints = ${model.nodes.length} and total members = ${model.members.length}.`,
    `Each joint has 3 DOF, so total DOF = ${ndof}.`,
    `Support restraints are applied at left and right base supports.`,
    `Column properties: E = ${fmt(form.columnE, 3)} GPa, A = ${fmt(form.columnA, 3)} cm², I = ${fmt(form.columnI, 3)} ×10⁶ mm⁴.`,
    `Beam properties: E = ${fmt(form.beamE, 3)} GPa, A = ${fmt(form.beamA, 3)} cm², I = ${fmt(form.beamI, 3)} ×10⁶ mm⁴.`,
    `Member stiffness matrices are assembled into global stiffness matrix [K].`,
    `Joint loads and beam equivalent nodal loads are added into global load vector {F}.`,
    `Unknown displacements are solved from [K]{D} = {F}.`,
    `Support reactions and member end forces are calculated.`,
    `Maximum lateral displacement = ${fmt(maxUx.ux * 1000, 4)} mm at ${maxUx.label}.`,
    `Maximum end moment = ${fmt(maxEndMoment.value, 3)} kN·m in ${maxEndMoment.member?.label || '-'}.`,
  ]

  const finalAnswer = `Using 2D frame stiffness method, maximum lateral displacement is ${fmt(maxUx.ux * 1000, 4)} mm at ${maxUx.label}, maximum vertical displacement is ${fmt(maxUy.uy * 1000, 4)} mm at ${maxUy.label}, maximum end moment is ${fmt(maxEndMoment.value, 3)} kN·m, maximum axial force is ${fmt(maxAxial.value, 3)} kN and maximum shear force is ${fmt(maxShear.value, 3)} kN. Support reactions and member end forces are shown in the result tables.`

  return {
    model,
    K,
    F,
    D,
    R,
    supportReactions,
    jointDisplacements,
    memberForces,
    maxUx,
    maxUy,
    maxEndMoment,
    maxAxial,
    maxShear,
    summary,
    formulas,
    steps,
    finalAnswer,
  }
}

function solveSafely(form) {
  try {
    return solveFrame(form)
  } catch (error) {
    const model = buildFrameModel(form)

    return {
      error: error.message || 'Unable to solve frame.',
      model,
      supportReactions: [],
      jointDisplacements: model.nodes.map((node) => ({ ...node, ux: 0, uy: 0, rz: 0 })),
      memberForces: [],
      summary: [
        { label: 'Status', value: 'Check Input' },
        { label: 'Issue', value: error.message || 'Unable to solve' },
      ],
      formulas: ['Check supports, geometry, material properties and loads.'],
      steps: ['Correct the input values and try again.'],
      finalAnswer: 'Unable to solve this frame with the current input.',
    }
  }
}

function buildPlainReport(result, form) {
  const reactions = result.supportReactions
    .map(
      (r) =>
        `${r.node.label} (${r.support}): Rx=${fmt(r.Rx, 3)} kN, Ry=${fmt(r.Ry, 3)} kN, Mz=${fmt(r.Mz, 3)} kN·m`
    )
    .join('\n')

  const joints = result.jointDisplacements
    .map(
      (j) =>
        `${j.label}: ux=${fmt(j.ux * 1000, 4)} mm, uy=${fmt(j.uy * 1000, 4)} mm, θ=${fmt(j.rz, 6)} rad`
    )
    .join('\n')

  const members = result.memberForces
    .map(
      (m) =>
        `${m.label} ${m.from}-${m.to}: N1=${fmt(m.axialStart, 3)} kN, V1=${fmt(m.shearStart, 3)} kN, M1=${fmt(m.momentStart, 3)} kN·m, N2=${fmt(m.axialEnd, 3)} kN, V2=${fmt(m.shearEnd, 3)} kN, M2=${fmt(m.momentEnd, 3)} kN·m`
    )
    .join('\n')

  return `
${form.reportTitle || 'Frame Analysis Report'}
Prepared By: ${form.preparedBy || '-'}
Method: 2D Matrix Stiffness Method

RESULT SUMMARY
${result.summary.map((item) => `${item.label}: ${item.value}`).join('\n')}

SUPPORT REACTIONS
${reactions || '-'}

JOINT DISPLACEMENTS
${joints || '-'}

MEMBER END FORCES
${members || '-'}

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

  const reactionRows = result.supportReactions
    .map(
      (r) => `
        <tr>
          <td>${cleanHtml(r.node.label)}</td>
          <td>${cleanHtml(r.support)}</td>
          <td>${fmt(r.Rx, 3)} kN</td>
          <td>${fmt(r.Ry, 3)} kN</td>
          <td>${fmt(r.Mz, 3)} kN·m</td>
        </tr>
      `
    )
    .join('')

  const jointRows = result.jointDisplacements
    .map(
      (j) => `
        <tr>
          <td>${cleanHtml(j.label)}</td>
          <td>${fmt(j.x, 3)} m</td>
          <td>${fmt(j.y, 3)} m</td>
          <td>${fmt(j.ux * 1000, 4)} mm</td>
          <td>${fmt(j.uy * 1000, 4)} mm</td>
          <td>${fmt(j.rz, 6)} rad</td>
        </tr>
      `
    )
    .join('')

  const memberRows = result.memberForces
    .map(
      (m) => `
        <tr>
          <td>${cleanHtml(m.label)}</td>
          <td>${cleanHtml(m.from)}-${cleanHtml(m.to)}</td>
          <td>${cleanHtml(m.type)}</td>
          <td>${fmt(m.axialStart, 3)}</td>
          <td>${fmt(m.shearStart, 3)}</td>
          <td>${fmt(m.momentStart, 3)}</td>
          <td>${fmt(m.axialEnd, 3)}</td>
          <td>${fmt(m.shearEnd, 3)}</td>
          <td>${fmt(m.momentEnd, 3)}</td>
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
  <title>${cleanHtml(form.reportTitle || 'Frame Analysis Report')}</title>
  <meta charset="utf-8" />
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 28px; color: #111827; background: #fff; }
    .page { max-width: 1080px; margin: 0 auto; }
    .header { border-bottom: 4px solid #f97316; padding-bottom: 16px; margin-bottom: 24px; }
    h1 { margin: 0; color: #0f172a; font-size: 30px; }
    .sub { margin-top: 8px; color: #475569; font-size: 14px; line-height: 1.6; }
    h2 { margin-top: 28px; border-left: 5px solid #f97316; padding-left: 10px; color: #0f172a; font-size: 20px; }
    table { width: 100%; border-collapse: collapse; font-size: 12px; margin-top: 12px; }
    td, th { padding: 9px; border: 1px solid #cbd5e1; text-align: left; }
    th { background: #0f172a; color: white; }
    li { margin-bottom: 8px; line-height: 1.6; }
    .answer { background: #fff7ed; border: 1px solid #fdba74; border-radius: 10px; padding: 14px; line-height: 1.7; font-weight: 600; }
    .footer { margin-top: 30px; padding-top: 12px; border-top: 1px solid #cbd5e1; color: #64748b; font-size: 12px; }
  </style>
</head>
<body>
  <div class="page">
    <div class="header">
      <h1>${cleanHtml(form.reportTitle || 'Frame Analysis Report')}</h1>
      <div class="sub">
        Prepared By: ${cleanHtml(form.preparedBy || '-')}<br/>
        Method: 2D Matrix Stiffness Method<br/>
        Generated using CivilCalc Pro
      </div>
    </div>

    <h2>Result Summary</h2>
    <table><tbody>${summaryRows}</tbody></table>

    <h2>Support Reactions</h2>
    <table>
      <thead>
        <tr><th>Node</th><th>Support</th><th>Rx</th><th>Ry</th><th>Mz</th></tr>
      </thead>
      <tbody>${reactionRows}</tbody>
    </table>

    <h2>Joint Displacements</h2>
    <table>
      <thead>
        <tr><th>Joint</th><th>x</th><th>y</th><th>ux</th><th>uy</th><th>θ</th></tr>
      </thead>
      <tbody>${jointRows}</tbody>
    </table>

    <h2>Member End Forces</h2>
    <table>
      <thead>
        <tr>
          <th>Member</th><th>End</th><th>Type</th><th>N1</th><th>V1</th><th>M1</th><th>N2</th><th>V2</th><th>M2</th>
        </tr>
      </thead>
      <tbody>${memberRows}</tbody>
    </table>

    <h2>Formulas Used</h2>
    <ol>${formulas}</ol>

    <h2>Step-by-Step Solution</h2>
    <ol>${steps}</ol>

    <h2>Final Answer</h2>
    <div class="answer">${cleanHtml(result.finalAnswer)}</div>

    <div class="footer">Generated using CivilCalc Pro Frame Analysis Calculator.</div>
  </div>
</body>
</html>
`
}

function printReport(result, form) {
  if (typeof window === 'undefined') return

  const reportWindow = window.open('', '_blank', 'width=1100,height=800')

  if (!reportWindow) {
    alert('Popup blocked. Please allow popups and try again.')
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

function BeamLoadEditor({ loads, storeys, onChange }) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
      <h2 className="text-2xl font-black text-white">Beam Member Loads</h2>
      <p className="mt-2 text-sm leading-6 text-slate-400">
        UDL and point load are applied on each floor beam. Point load position is measured from left joint.
      </p>

      <div className="mt-6 space-y-5">
        {loads.slice(0, storeys).map((load, index) => (
          <div key={index} className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
            <p className="mb-4 font-black text-orange-300">Beam at Storey {index + 1}</p>

            <div className="grid gap-4 sm:grid-cols-2">
              <NumberField
                label="UDL on Beam"
                value={load.udl}
                onChange={(value) => onChange(index, 'udl', value)}
                suffix="kN/m"
                min="0"
              />

              <NumberField
                label="Point Load"
                value={load.pointLoad}
                onChange={(value) => onChange(index, 'pointLoad', value)}
                suffix="kN"
                min="0"
              />

              <NumberField
                label="Point Load Position"
                value={load.pointPosition}
                onChange={(value) => onChange(index, 'pointPosition', value)}
                suffix="m"
                min="0"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function FrameDiagram({ result, form }) {
  const { model, jointDisplacements } = result
  const x0 = 95
  const y0 = 260
  const plotW = 440
  const plotH = 190
  const W = Math.max(model.W, 0.001)
  const H = Math.max(model.totalHeight, 0.001)

  const mapX = (x) => x0 + (x / W) * plotW
  const mapY = (y) => y0 - (y / H) * plotH

  const maxDisp = Math.max(
    ...jointDisplacements.map((node) => Math.sqrt(node.ux * node.ux + node.uy * node.uy)),
    0
  )

  const visualScale = maxDisp > 1e-12 ? Math.min((Math.max(W, H) * 0.18) / maxDisp, 1200) : 1

  const getDef = (node) => {
    const disp = jointDisplacements.find((item) => item.id === node.id) || { ux: 0, uy: 0 }
    return {
      x: node.x + disp.ux * visualScale,
      y: node.y + disp.uy * visualScale,
    }
  }

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-950 p-4">
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-lg font-black text-white">Frame Diagram & Deflected Shape</h3>
          <p className="mt-1 text-xs leading-5 text-slate-400">
            Grey = original frame, orange = amplified deflected shape.
          </p>
        </div>

        <span className="rounded-xl border border-orange-500/20 bg-orange-500/10 px-3 py-2 text-xs font-bold text-orange-200">
          Deflection scale ≈ {fmt(visualScale, 1)}×
        </span>
      </div>

      <svg viewBox="0 0 640 320" className="h-auto w-full">
        {model.members.map((member) => {
          const ni = model.nodes[member.i]
          const nj = model.nodes[member.j]

          return (
            <line
              key={`orig-${member.id}`}
              x1={mapX(ni.x)}
              y1={mapY(ni.y)}
              x2={mapX(nj.x)}
              y2={mapY(nj.y)}
              stroke="#94a3b8"
              strokeWidth="6"
              strokeLinecap="round"
            />
          )
        })}

        {model.members.map((member) => {
          const ni = model.nodes[member.i]
          const nj = model.nodes[member.j]
          const di = getDef(ni)
          const dj = getDef(nj)

          return (
            <line
              key={`def-${member.id}`}
              x1={mapX(di.x)}
              y1={mapY(di.y)}
              x2={mapX(dj.x)}
              y2={mapY(dj.y)}
              stroke="#f97316"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="8 6"
            />
          )
        })}

        {model.nodes.map((node) => (
          <g key={node.id}>
            <circle cx={mapX(node.x)} cy={mapY(node.y)} r="6" fill="#38bdf8" />
            <text x={mapX(node.x) + 8} y={mapY(node.y) - 8} fill="#e2e8f0" fontSize="12" fontWeight="900">
              {node.label}
            </text>
          </g>
        ))}

        {model.members.map((member) => {
          const ni = model.nodes[member.i]
          const nj = model.nodes[member.j]

          return (
            <text
              key={`label-${member.id}`}
              x={(mapX(ni.x) + mapX(nj.x)) / 2 + 6}
              y={(mapY(ni.y) + mapY(nj.y)) / 2 - 6}
              fill="#facc15"
              fontSize="12"
              fontWeight="900"
            >
              {member.label}
            </text>
          )
        })}

        <text x="18" y="294" fill="#94a3b8" fontSize="12">
          Left Base: {form.leftBase} | Right Base: {form.rightBase}
        </text>

        <text x="360" y="294" fill="#f97316" fontSize="12" fontWeight="900">
          Width = {fmt(model.W, 2)} m, Height = {fmt(model.totalHeight, 2)} m
        </text>
      </svg>
    </div>
  )
}

function ResultTable({ title, children }) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
      <h2 className="text-2xl font-black text-white">{title}</h2>
      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-800">{children}</div>
    </div>
  )
}

function SupportReactionTable({ result }) {
  return (
    <ResultTable title="Support Reactions">
      <table className="w-full min-w-[780px] border-collapse text-left">
        <thead className="bg-slate-950">
          <tr>
            <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">Node</th>
            <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">Support</th>
            <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">Rx</th>
            <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">Ry</th>
            <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">Mz</th>
          </tr>
        </thead>

        <tbody>
          {result.supportReactions.map((row) => (
            <tr key={row.node.label} className="bg-slate-900/50">
              <td className="border-b border-slate-800 px-4 py-3 text-sm font-bold text-orange-300">{row.node.label}</td>
              <td className="border-b border-slate-800 px-4 py-3 text-sm text-slate-300">{row.support}</td>
              <td className="border-b border-slate-800 px-4 py-3 text-sm text-slate-300">{fmt(row.Rx, 3)} kN</td>
              <td className="border-b border-slate-800 px-4 py-3 text-sm text-slate-300">{fmt(row.Ry, 3)} kN</td>
              <td className="border-b border-slate-800 px-4 py-3 text-sm text-slate-300">{fmt(row.Mz, 3)} kN·m</td>
            </tr>
          ))}
        </tbody>
      </table>
    </ResultTable>
  )
}

function JointDisplacementTable({ result }) {
  return (
    <ResultTable title="Joint Displacements">
      <table className="w-full min-w-[850px] border-collapse text-left">
        <thead className="bg-slate-950">
          <tr>
            <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">Joint</th>
            <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">x</th>
            <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">y</th>
            <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">ux</th>
            <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">uy</th>
            <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">Rotation θ</th>
          </tr>
        </thead>

        <tbody>
          {result.jointDisplacements.map((row) => (
            <tr key={row.label} className="bg-slate-900/50">
              <td className="border-b border-slate-800 px-4 py-3 text-sm font-bold text-orange-300">{row.label}</td>
              <td className="border-b border-slate-800 px-4 py-3 text-sm text-slate-300">{fmt(row.x, 3)} m</td>
              <td className="border-b border-slate-800 px-4 py-3 text-sm text-slate-300">{fmt(row.y, 3)} m</td>
              <td className="border-b border-slate-800 px-4 py-3 text-sm text-slate-300">{fmt(row.ux * 1000, 4)} mm</td>
              <td className="border-b border-slate-800 px-4 py-3 text-sm text-slate-300">{fmt(row.uy * 1000, 4)} mm</td>
              <td className="border-b border-slate-800 px-4 py-3 text-sm text-slate-300">{fmt(row.rz, 6)} rad</td>
            </tr>
          ))}
        </tbody>
      </table>
    </ResultTable>
  )
}

function MemberForceTable({ result }) {
  return (
    <ResultTable title="Member End Forces">
      <table className="w-full min-w-[1100px] border-collapse text-left">
        <thead className="bg-slate-950">
          <tr>
            <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">Member</th>
            <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">End</th>
            <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">Type</th>
            <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">N Start</th>
            <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">V Start</th>
            <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">M Start</th>
            <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">N End</th>
            <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">V End</th>
            <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">M End</th>
          </tr>
        </thead>

        <tbody>
          {result.memberForces.map((row) => (
            <tr key={row.label} className="bg-slate-900/50">
              <td className="border-b border-slate-800 px-4 py-3 text-sm font-bold text-orange-300">{row.label}</td>
              <td className="border-b border-slate-800 px-4 py-3 text-sm text-slate-300">{row.from}-{row.to}</td>
              <td className="border-b border-slate-800 px-4 py-3 text-sm text-slate-300">{row.type}</td>
              <td className="border-b border-slate-800 px-4 py-3 text-sm text-slate-300">{fmt(row.axialStart, 3)} kN</td>
              <td className="border-b border-slate-800 px-4 py-3 text-sm text-slate-300">{fmt(row.shearStart, 3)} kN</td>
              <td className="border-b border-slate-800 px-4 py-3 text-sm text-slate-300">{fmt(row.momentStart, 3)} kN·m</td>
              <td className="border-b border-slate-800 px-4 py-3 text-sm text-slate-300">{fmt(row.axialEnd, 3)} kN</td>
              <td className="border-b border-slate-800 px-4 py-3 text-sm text-slate-300">{fmt(row.shearEnd, 3)} kN</td>
              <td className="border-b border-slate-800 px-4 py-3 text-sm text-slate-300">{fmt(row.momentEnd, 3)} kN·m</td>
            </tr>
          ))}
        </tbody>
      </table>
    </ResultTable>
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

export default function FrameAnalysisPage() {
  const [form, setForm] = useState({
    reportTitle: 'Frame Analysis Report',
    preparedBy: '',
    ...getTemplateDefaults('fixedPortal'),
  })

  const result = useMemo(() => solveSafely(form), [form])

  const updateForm = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
      template: key === 'template' ? value : prev.template,
    }))
  }

  const applyTemplate = (template) => {
    setForm((prev) => ({
      ...prev,
      ...getTemplateDefaults(template),
      template,
    }))
  }

  const updateBeamLoad = (index, key, value) => {
    setForm((prev) => ({
      ...prev,
      template: 'custom',
      beamLoads: prev.beamLoads.map((load, i) =>
        i === index
          ? {
              ...load,
              [key]: value,
            }
          : load
      ),
    }))
  }

  const updateCustom = (key, value) => {
    setForm((prev) => ({
      ...prev,
      template: 'custom',
      [key]: value,
    }))
  }

  const resetExample = () => {
    setForm({
      reportTitle: 'Frame Analysis Report',
      preparedBy: '',
      ...getTemplateDefaults('fixedPortal'),
    })
  }

  return (
    <main className="min-h-screen bg-[#050B1F] px-4 py-8 text-white md:px-8">
      <section className="mx-auto max-w-7xl">
        <div className="mb-8 rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 md:p-8">
          <p className="mb-3 text-sm font-extrabold uppercase tracking-widest text-orange-400">
            Structural Analysis Frame Solver
          </p>

          <h1 className="text-3xl font-black leading-tight md:text-5xl">
            Frame Analysis Calculator
          </h1>

          <p className="mt-4 max-w-4xl text-base leading-8 text-slate-300 md:text-lg">
            Solve portal frames and two-storey frames using 2D matrix stiffness method with support reactions,
            joint displacements, axial force, shear force, bending moment and deflected shape.
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
                  placeholder="Example: Fixed Portal Frame Analysis"
                />

                <TextField
                  label="Prepared By"
                  value={form.preparedBy}
                  onChange={(value) => updateForm('preparedBy', value)}
                  placeholder="Your name"
                />

                <SelectField
                  label="Frame Template"
                  value={form.template}
                  onChange={applyTemplate}
                  helper={templateInfo[form.template]?.desc}
                >
                  <option value="fixedPortal">Fixed Base Portal Frame</option>
                  <option value="pinPortal">Pin Base Portal Frame</option>
                  <option value="horizontalLoad">Portal Frame with Horizontal Load</option>
                  <option value="beamUdl">Portal Frame with UDL on Beam</option>
                  <option value="beamPoint">Portal Frame with Point Load on Beam</option>
                  <option value="twoStorey">Two Storey Frame Basic</option>
                  <option value="custom">Custom Frame</option>
                </SelectField>

                <SelectField
                  label="Number of Storeys"
                  value={form.storeys}
                  onChange={(value) => updateCustom('storeys', Number(value))}
                >
                  <option value={1}>1 Storey</option>
                  <option value={2}>2 Storeys</option>
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
              <h2 className="text-2xl font-black text-white">Geometry</h2>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <NumberField
                  label="Bay Width"
                  value={form.bayWidth}
                  onChange={(value) => updateCustom('bayWidth', value)}
                  suffix="m"
                  min="0.1"
                />

                <NumberField
                  label="Storey Height"
                  value={form.storeyHeight}
                  onChange={(value) => updateCustom('storeyHeight', value)}
                  suffix="m"
                  min="0.1"
                />
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
              <h2 className="text-2xl font-black text-white">Supports</h2>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <SelectField label="Left Base" value={form.leftBase} onChange={(value) => updateCustom('leftBase', value)}>
                  <option value="fixed">Fixed</option>
                  <option value="pin">Pin</option>
                  <option value="roller">Roller</option>
                </SelectField>

                <SelectField label="Right Base" value={form.rightBase} onChange={(value) => updateCustom('rightBase', value)}>
                  <option value="fixed">Fixed</option>
                  <option value="pin">Pin</option>
                  <option value="roller">Roller</option>
                </SelectField>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
              <h2 className="text-2xl font-black text-white">Member Properties</h2>

              <div className="mt-6 space-y-6">
                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                  <p className="mb-4 font-black text-orange-300">Columns</p>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <NumberField label="E" value={form.columnE} onChange={(v) => updateCustom('columnE', v)} suffix="GPa" min="0.001" />
                    <NumberField label="Area A" value={form.columnA} onChange={(v) => updateCustom('columnA', v)} suffix="cm²" min="0.001" />
                    <NumberField label="Inertia I" value={form.columnI} onChange={(v) => updateCustom('columnI', v)} suffix="×10⁶ mm⁴" min="0.001" />
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                  <p className="mb-4 font-black text-orange-300">Beams</p>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <NumberField label="E" value={form.beamE} onChange={(v) => updateCustom('beamE', v)} suffix="GPa" min="0.001" />
                    <NumberField label="Area A" value={form.beamA} onChange={(v) => updateCustom('beamA', v)} suffix="cm²" min="0.001" />
                    <NumberField label="Inertia I" value={form.beamI} onChange={(v) => updateCustom('beamI', v)} suffix="×10⁶ mm⁴" min="0.001" />
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
              <h2 className="text-2xl font-black text-white">Joint Loads</h2>

              <div className="mt-6 space-y-5">
                <SelectField label="Load Joint" value={form.loadJoint} onChange={(value) => updateCustom('loadJoint', value)}>
                  <option value="topLeft">Top Left Joint</option>
                  <option value="topRight">Top Right Joint</option>
                </SelectField>

                <NumberField
                  label="Horizontal Load"
                  value={form.horizontalLoad}
                  onChange={(value) => updateCustom('horizontalLoad', value)}
                  suffix="kN"
                  helper="Positive means load acting toward right."
                  min="-999999"
                />

                <NumberField
                  label="Vertical Joint Load"
                  value={form.verticalJointLoad}
                  onChange={(value) => updateCustom('verticalJointLoad', value)}
                  suffix="kN"
                  helper="Positive input is treated as downward."
                  min="0"
                />

                <NumberField
                  label="Joint Moment"
                  value={form.jointMoment}
                  onChange={(value) => updateCustom('jointMoment', value)}
                  suffix="kN·m"
                  min="0"
                />

                <SelectField
                  label="Joint Moment Direction"
                  value={form.jointMomentDirection}
                  onChange={(value) => updateCustom('jointMomentDirection', value)}
                >
                  <option value="clockwise">Clockwise</option>
                  <option value="anticlockwise">Anticlockwise</option>
                </SelectField>
              </div>
            </div>

            <BeamLoadEditor loads={form.beamLoads} storeys={Number(form.storeys)} onChange={updateBeamLoad} />
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
            <FrameDiagram result={result} form={form} />
            <SupportReactionTable result={result} />
            <JointDisplacementTable result={result} />
            <MemberForceTable result={result} />
            <FormulaAndSteps result={result} />
          </section>
        </div>
      </section>
    </main>
  )
}
