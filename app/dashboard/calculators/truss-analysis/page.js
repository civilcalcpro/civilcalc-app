'use client'

import { useMemo, useState, useEffect, useRef, useCallback } from 'react'

const templates = [
  { key: 'triangular', label: 'Triangular Truss' },
  { key: 'kingpost', label: 'King Post Truss' },
  { key: 'warren', label: 'Warren Truss' },
  { key: 'pratt', label: 'Pratt Truss' },
]

const topicCards = [
  '2D Pin-Jointed Truss',
  'Interactive CAD Canvas',
  'Support Reactions',
  'Member Forces',
  'Tension / Compression',
  'Zero Force Members',
  'Determinacy Check',
  'Joint Displacement',
  'Stress & Strain',
  'Copy Solution',
  'Print / Save PDF',
  'Exam Answer',
]

function uid(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`
}

function toNum(value, fallback = 0) {
  if (value === '' || value === null || value === undefined) return fallback
  const n = Number(value)
  return Number.isFinite(n) ? n : fallback
}

function fmt(value, digits = 3) {
  const n = Number(value)
  if (!Number.isFinite(n)) return '0'
  if (Math.abs(n) < 1e-9) return '0'
  const fixed = n.toFixed(digits)
  return fixed.replace(/\.?0+$/, '')
}

function cleanHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function supportDofs(type) {
  if (type === 'pin') return ['x', 'y']
  if (type === 'rollerY') return ['y']
  if (type === 'rollerX') return ['x']
  return []
}

function getTemplate(key) {
  if (key === 'kingpost') {
    return {
      reportTitle: 'King Post Truss Analysis',
      preparedBy: '',
      template: key,
      selectedMember: 'AC',
      joints: [
        { id: 'A', name: 'A', x: 0, y: 0, support: 'pin' },
        { id: 'B', name: 'B', x: 6, y: 0, support: 'rollerY' },
        { id: 'C', name: 'C', x: 3, y: 3, support: 'none' },
        { id: 'D', name: 'D', x: 3, y: 0, support: 'none' },
      ],
      members: [
        { id: 'AD', start: 'A', end: 'D', area: 500, E: 200 },
        { id: 'DB', start: 'D', end: 'B', area: 500, E: 200 },
        { id: 'AC', start: 'A', end: 'C', area: 500, E: 200 },
        { id: 'CB', start: 'C', end: 'B', area: 500, E: 200 },
        { id: 'CD', start: 'C', end: 'D', area: 500, E: 200 },
      ],
      loads: [{ id: 'L1', joint: 'D', Fx: 0, Fy: -20 }],
    }
  }

  if (key === 'warren') {
    return {
      reportTitle: 'Warren Truss Analysis',
      preparedBy: '',
      template: key,
      selectedMember: 'AB',
      joints: [
        { id: 'A', name: 'A', x: 0, y: 0, support: 'pin' },
        { id: 'B', name: 'B', x: 3, y: 3, support: 'none' },
        { id: 'C', name: 'C', x: 6, y: 0, support: 'none' },
        { id: 'D', name: 'D', x: 9, y: 3, support: 'none' },
        { id: 'E', name: 'E', x: 12, y: 0, support: 'rollerY' },
      ],
      members: [
        { id: 'AB', start: 'A', end: 'B', area: 500, E: 200 },
        { id: 'BC', start: 'B', end: 'C', area: 500, E: 200 },
        { id: 'CD', start: 'C', end: 'D', area: 500, E: 200 },
        { id: 'DE', start: 'D', end: 'E', area: 500, E: 200 },
        { id: 'AC', start: 'A', end: 'C', area: 500, E: 200 },
        { id: 'CE', start: 'C', end: 'E', area: 500, E: 200 },
        { id: 'BD', start: 'B', end: 'D', area: 500, E: 200 },
      ],
      loads: [
        { id: 'L1', joint: 'C', Fx: 0, Fy: -30 },
        { id: 'L2', joint: 'B', Fx: 0, Fy: -10 },
        { id: 'L3', joint: 'D', Fx: 0, Fy: -10 },
      ],
    }
  }

  if (key === 'pratt') {
    return {
      reportTitle: 'Pratt Truss Analysis',
      preparedBy: '',
      template: key,
      selectedMember: 'AE',
      joints: [
        { id: 'A', name: 'A', x: 0, y: 0, support: 'pin' },
        { id: 'B', name: 'B', x: 3, y: 0, support: 'none' },
        { id: 'C', name: 'C', x: 6, y: 0, support: 'none' },
        { id: 'D', name: 'D', x: 9, y: 0, support: 'rollerY' },
        { id: 'E', name: 'E', x: 3, y: 3, support: 'none' },
        { id: 'F', name: 'F', x: 6, y: 3, support: 'none' },
      ],
      members: [
        { id: 'AB', start: 'A', end: 'B', area: 500, E: 200 },
        { id: 'BC', start: 'B', end: 'C', area: 500, E: 200 },
        { id: 'CD', start: 'C', end: 'D', area: 500, E: 200 },
        { id: 'EF', start: 'E', end: 'F', area: 500, E: 200 },
        { id: 'AE', start: 'A', end: 'E', area: 500, E: 200 },
        { id: 'BE', start: 'B', end: 'E', area: 500, E: 200 },
        { id: 'BF', start: 'B', end: 'F', area: 500, E: 200 },
        { id: 'CF', start: 'C', end: 'F', area: 500, E: 200 },
        { id: 'FD', start: 'F', end: 'D', area: 500, E: 200 },
      ],
      loads: [
        { id: 'L1', joint: 'B', Fx: 0, Fy: -20 },
        { id: 'L2', joint: 'C', Fx: 0, Fy: -20 },
      ],
    }
  }

  return {
    reportTitle: 'Triangular Truss Analysis',
    preparedBy: '',
    template: 'triangular',
    selectedMember: 'AC',
    joints: [
      { id: 'A', name: 'A', x: 0, y: 0, support: 'pin' },
      { id: 'B', name: 'B', x: 4, y: 0, support: 'rollerY' },
      { id: 'C', name: 'C', x: 2, y: 3, support: 'none' },
    ],
    members: [
      { id: 'AB', start: 'A', end: 'B', area: 500, E: 200 },
      { id: 'AC', start: 'A', end: 'C', area: 500, E: 200 },
      { id: 'BC', start: 'B', end: 'C', area: 500, E: 200 },
    ],
    loads: [{ id: 'L1', joint: 'C', Fx: 0, Fy: -20 }],
  }
}

function memberName(member, joints) {
  const a = joints.find((j) => j.id === member.start)
  const b = joints.find((j) => j.id === member.end)
  return `${a?.name || member.start}${b?.name || member.end}`
}

function loadAtJoint(loads, jointId) {
  return loads.reduce(
    (sum, load) => {
      if (load.joint !== jointId) return sum
      return {
        Fx: sum.Fx + toNum(load.Fx),
        Fy: sum.Fy + toNum(load.Fy),
      }
    },
    { Fx: 0, Fy: 0 }
  )
}

function solveLinearSystem(A, b) {
  const n = b.length
  if (n === 0) return { error: '', solution: [] }
  const M = A.map((row, index) => [...row, b[index]])

  for (let col = 0; col < n; col += 1) {
    let pivot = col
    for (let row = col + 1; row < n; row += 1) {
      if (Math.abs(M[row][col]) > Math.abs(M[pivot][col])) {
        pivot = row
      }
    }

    if (Math.abs(M[pivot][col]) < 1e-10) {
      return {
        error:
          'Unstable truss geometry (singular stiffness matrix). Ensure all joints are triangulated and at least 3 non-concurrent support reactions exist (e.g., 1 Pin + 1 Roller).',
        solution: null,
      }
    }

    if (pivot !== col) {
      const temp = M[col]
      M[col] = M[pivot]
      M[pivot] = temp
    }

    const pivotValue = M[col][col]
    for (let j = col; j <= n; j += 1) {
      M[col][j] /= pivotValue
    }

    for (let row = 0; row < n; row += 1) {
      if (row === col) continue
      const factor = M[row][col]
      for (let j = col; j <= n; j += 1) {
        M[row][j] -= factor * M[col][j]
      }
    }
  }

  return {
    error: '',
    solution: M.map((row) => row[n]),
  }
}

function getMemberVectorFromJoint(joint, member, joints) {
  const otherId = member.start === joint.id ? member.end : member.start
  const other = joints.find((j) => j.id === otherId)
  if (!other) return { x: 0, y: 0 }
  return {
    x: toNum(other.x) - toNum(joint.x),
    y: toNum(other.y) - toNum(joint.y),
  }
}

function getZeroForceMembersByRules(joints, members, loads) {
  const zero = []

  joints.forEach((joint) => {
    const jointLoad = loadAtJoint(loads, joint.id)
    const hasExternalLoad = Math.abs(jointLoad.Fx) > 1e-9 || Math.abs(jointLoad.Fy) > 1e-9
    const hasSupport = joint.support !== 'none'
    if (hasExternalLoad || hasSupport) return

    const connected = members.filter((member) => member.start === joint.id || member.end === joint.id)

    if (connected.length === 2) {
      const [m1, m2] = connected
      const v1 = getMemberVectorFromJoint(joint, m1, joints)
      const v2 = getMemberVectorFromJoint(joint, m2, joints)
      if (Math.abs(v1.x * v2.y - v1.y * v2.x) > 1e-6) {
        zero.push({
          memberId: m1.id,
          reason: `Joint ${joint.name} has 2 non-collinear members and no external load/support.`,
        })
        zero.push({
          memberId: m2.id,
          reason: `Joint ${joint.name} has 2 non-collinear members and no external load/support.`,
        })
      }
    }

    if (connected.length === 3) {
      for (let i = 0; i < 3; i += 1) {
        for (let j = i + 1; j < 3; j += 1) {
          const m1 = connected[i]
          const m2 = connected[j]
          const v1 = getMemberVectorFromJoint(joint, m1, joints)
          const v2 = getMemberVectorFromJoint(joint, m2, joints)
          if (Math.abs(v1.x * v2.y - v1.y * v2.x) < 1e-6) {
            const third = connected.find((m) => m.id !== m1.id && m.id !== m2.id)
            if (third) {
              zero.push({
                memberId: third.id,
                reason: `Joint ${joint.name} has 3 members (2 collinear) and no external load/support.`,
              })
            }
          }
        }
      }
    }
  })

  const unique = []
  const seen = new Set()
  zero.forEach((item) => {
    if (!seen.has(item.memberId)) {
      seen.add(item.memberId)
      unique.push(item)
    }
  })
  return unique
}

function analyzeTruss(form) {
  const joints = form.joints.map((joint) => ({
    ...joint,
    x: toNum(joint.x),
    y: toNum(joint.y),
    support: joint.support || 'none',
  }))

  const jointMap = new Map(joints.map((joint, index) => [joint.id, { joint, index }]))

  const members = form.members
    .map((member) => ({
      ...member,
      area: Math.max(toNum(member.area, 500), 0.001),
      E: Math.max(toNum(member.E, 200), 0.001),
    }))
    .filter((member) => jointMap.has(member.start) && jointMap.has(member.end) && member.start !== member.end)

  const loads = form.loads
    .map((load) => ({
      ...load,
      Fx: toNum(load.Fx),
      Fy: toNum(load.Fy),
    }))
    .filter((load) => jointMap.has(load.joint))

  const j = joints.length
  const m = members.length
  const r = joints.reduce((sum, joint) => sum + supportDofs(joint.support).length, 0)
  const determinacyValue = m + r - 2 * j

  let determinacyStatus = 'Statically determinate by count (m + r = 2j)'
  if (determinacyValue > 0) {
    determinacyStatus = `Statically indeterminate by count, degree = ${determinacyValue}`
  } else if (determinacyValue < 0) {
    determinacyStatus = `Unstable by count, deficiency = ${Math.abs(determinacyValue)}`
  }

  const emptyResult = (errorMsg, warningMsg = '') => ({
    error: errorMsg,
    warning: warningMsg,
    joints,
    members,
    loads,
    memberResults: [],
    reactions: [],
    displacements: [],
    zeroForceMembers: getZeroForceMembersByRules(joints, members, loads),
    determinacy: { m, r, j, value: determinacyValue, status: determinacyStatus },
    summary: [
      { label: 'Joints', value: `${j}` },
      { label: 'Members', value: `${m}` },
      { label: 'Reactions', value: `${r}` },
      { label: 'Status', value: 'Needs Fix' },
    ],
    finalAnswer: errorMsg,
    steps: [errorMsg],
  })

  if (j < 2) return emptyResult('Add at least 2 joints to analyze the truss.')
  if (m < 1) return emptyResult('Add at least 1 member connecting two joints.')
  if (r < 3) return emptyResult(`Add supports so total reaction components r ≥ 3 (currently r = ${r}). Example: 1 Pin (r=2) + 1 Roller (r=1).`)

  // Check for orphan joints (joints with 0 connected members) so they don't break [K]
  const connectedJointIds = new Set()
  members.forEach((mem) => {
    connectedJointIds.add(mem.start)
    connectedJointIds.add(mem.end)
  })

  const orphanJoints = joints.filter((jt) => !connectedJointIds.has(jt.id))
  const warningMsg =
    orphanJoints.length > 0
      ? `Note: Joint(s) ${orphanJoints.map((o) => o.name).join(', ')} have no members attached and were excluded from stiffness assembly.`
      : ''

  const dof = 2 * joints.length
  const K = Array.from({ length: dof }, () => Array(dof).fill(0))
  const F = Array(dof).fill(0)
  const memberGeometry = []

  loads.forEach((load) => {
    const info = jointMap.get(load.joint)
    if (!info) return
    F[2 * info.index] += load.Fx
    F[2 * info.index + 1] += load.Fy
  })

  for (const member of members) {
    const startInfo = jointMap.get(member.start)
    const endInfo = jointMap.get(member.end)
    if (!startInfo || !endInfo) continue

    const dx = endInfo.joint.x - startInfo.joint.x
    const dy = endInfo.joint.y - startInfo.joint.y
    const length = Math.sqrt(dx * dx + dy * dy)

    if (length <= 1e-6) {
      return emptyResult(`Member ${memberName(member, joints)} has zero length. Move one of its joints.`)
    }

    const c = dx / length
    const s = dy / length
    // E (GPa = 10^9 N/m^2) * A (mm^2 = 10^-6 m^2) / L (m) => 10^3 N/m = kN/m
    const AEoverL = (member.E * member.area) / length

    const k = [
      [c * c, c * s, -c * c, -c * s],
      [c * s, s * s, -c * s, -s * s],
      [-c * c, -c * s, c * c, c * s],
      [-c * s, -s * s, c * s, s * s],
    ]

    const indices = [
      2 * startInfo.index,
      2 * startInfo.index + 1,
      2 * endInfo.index,
      2 * endInfo.index + 1,
    ]

    for (let row = 0; row < 4; row += 1) {
      for (let col = 0; col < 4; col += 1) {
        K[indices[row]][indices[col]] += AEoverL * k[row][col]
      }
    }

    memberGeometry.push({
      member,
      length,
      c,
      s,
      AEoverL,
      startIndex: startInfo.index,
      endIndex: endInfo.index,
    })
  }

  const fixed = Array(dof).fill(false)

  joints.forEach((joint, index) => {
    // Lock orphan joints so zero-rows don't cause false singularity
    if (!connectedJointIds.has(joint.id)) {
      fixed[2 * index] = true
      fixed[2 * index + 1] = true
      return
    }
    const dofs = supportDofs(joint.support)
    if (dofs.includes('x')) fixed[2 * index] = true
    if (dofs.includes('y')) fixed[2 * index + 1] = true
  })

  const freeDofs = []
  fixed.forEach((isFixed, index) => {
    if (!isFixed) freeDofs.push(index)
  })

  const Kff = freeDofs.map((row) => freeDofs.map((col) => K[row][col]))
  const Ff = freeDofs.map((index) => F[index])

  const solution = solveLinearSystem(Kff, Ff)

  if (solution.error) {
    const errResult = emptyResult(solution.error, warningMsg)
    errResult.determinacy.status = 'Unstable / mechanism detected'
    errResult.steps = [
      `Number of joints j = ${j}.`,
      `Number of members m = ${m}.`,
      `Reaction components r = ${r}.`,
      `Check m + r - 2j = ${m} + ${r} - ${2 * j} = ${determinacyValue}.`,
      solution.error,
    ]
    return errResult
  }

  const U = Array(dof).fill(0)
  freeDofs.forEach((dofIndex, index) => {
    U[dofIndex] = solution.solution[index]
  })

  const KU = K.map((row) => row.reduce((sum, value, index) => sum + value * U[index], 0))
  const R = KU.map((value, index) => value - F[index])

  const displacements = joints.map((joint, index) => ({
    joint,
    uxM: U[2 * index],
    uyM: U[2 * index + 1],
    uxMm: U[2 * index] * 1000,
    uyMm: U[2 * index + 1] * 1000,
    totalMm: Math.sqrt(U[2 * index] ** 2 + U[2 * index + 1] ** 2) * 1000,
  }))

  const memberResults = memberGeometry.map((item) => {
    const ui = U[2 * item.startIndex]
    const vi = U[2 * item.startIndex + 1]
    const uj = U[2 * item.endIndex]
    const vj = U[2 * item.endIndex + 1]

    const extensionM = -item.c * ui - item.s * vi + item.c * uj + item.s * vj
    const force = item.AEoverL * extensionM
    const stress = (force * 1000) / item.member.area
    const strain = stress / (item.member.E * 1000)
    const elongationMm = extensionM * 1000

    return {
      member: item.member,
      name: memberName(item.member, joints),
      length: item.length,
      force,
      stress,
      strain,
      elongationMm,
      type: Math.abs(force) < 0.001 ? 'Zero' : force > 0 ? 'Tension' : 'Compression',
    }
  })

  const reactions = []
  joints.forEach((joint, index) => {
    const dofs = supportDofs(joint.support)
    if (dofs.includes('x')) {
      reactions.push({ joint, component: 'Rx', value: R[2 * index] })
    }
    if (dofs.includes('y')) {
      reactions.push({ joint, component: 'Ry', value: R[2 * index + 1] })
    }
  })

  const maxForce = memberResults.reduce(
    (best, item) => (Math.abs(item.force) > Math.abs(best.force) ? item : best),
    memberResults[0] || { force: 0, name: '-' }
  )

  const maxDisp = displacements.reduce(
    (best, item) => (item.totalMm > best.totalMm ? item : best),
    displacements[0] || { totalMm: 0, joint: { name: '-' } }
  )

  const zeroByRules = getZeroForceMembersByRules(joints, members, loads)
  const zeroByForce = memberResults
    .filter((item) => Math.abs(item.force) < 0.001)
    .map((item) => ({
      memberId: item.member.id,
      reason: 'Calculated axial force is approximately zero.',
    }))

  const zeroMap = new Map()
  zeroByRules.concat(zeroByForce).forEach((item) => {
    if (!zeroMap.has(item.memberId)) zeroMap.set(item.memberId, item)
  })
  const zeroForceMembers = [...zeroMap.values()]

  const finalAnswer = `The truss has ${joints.length} joints, ${members.length} members, and ${r} reaction components. ${determinacyStatus}. Maximum member force is ${fmt(Math.abs(maxForce.force))} kN (${maxForce.force >= 0 ? 'Tension' : 'Compression'}) in member ${maxForce.name}. Maximum joint displacement is ${fmt(maxDisp.totalMm)} mm at joint ${maxDisp.joint.name}.`

  return {
    error: '',
    warning: warningMsg,
    joints,
    members,
    loads,
    memberResults,
    reactions,
    displacements,
    zeroForceMembers,
    determinacy: { m, r, j, value: determinacyValue, status: determinacyStatus },
    summary: [
      { label: 'Joints', value: `${j}` },
      { label: 'Members', value: `${m}` },
      { label: 'Reaction Components', value: `${r}` },
      { label: 'Max Member Force', value: `${fmt(maxForce.force)} kN` },
    ],
    finalAnswer,
    steps: [
      `Number of joints j = ${j}, members m = ${m}, and support reaction components r = ${r}.`,
      `Determinacy check: m + r - 2j = ${m} + ${r} - ${2 * j} = ${determinacyValue} (${determinacyStatus}).`,
      `Global stiffness matrix [K] is assembled from individual member stiffness matrices (AE/L).`,
      `Boundary conditions applied at supported joints (${reactions.map((rc) => `${rc.joint.name}${rc.component}`).join(', ')}).`,
      `Support reactions solved: ${reactions.map((rc) => `${rc.joint.name}${rc.component} = ${fmt(rc.value)} kN`).join(', ')}.`,
      `Joint displacements solved from [K]{d} = {F}; max displacement = ${fmt(maxDisp.totalMm)} mm at Joint ${maxDisp.joint.name}.`,
      `Member axial forces computed via N = (AE/L)·ΔL (+ve = Tension, -ve = Compression).`,
    ],
  }
}

/* ---------------- INTERACTIVE CAD DIAGRAM COMPONENT ---------------- */

function InteractiveTrussDiagram({
  result,
  form,
  selectedEntity,
  setSelectedEntity,
  onMoveJoint,
  onAddJointAt,
  onToggleSupport,
  onAddMemberBetween,
  onDeleteSelected,
  onSelectMember,
}) {
  const svgRef = useRef(null)
  const [toolMode, setToolMode] = useState('select') // 'select' | 'addJoint' | 'addMember' | 'support'
  const [snapGrid, setSnapGrid] = useState(0.5)
  const [memberStartJoint, setMemberStartJoint] = useState(null)
  const [draggingJointId, setDraggingJointId] = useState(null)
  const [cursorWorld, setCursorWorld] = useState(null)

  const width = 760
  const height = 480
  const pad = 75

  // Compute bounding box with margin so users have empty workspace to click/drag into
  const bounds = useMemo(() => {
    const xs = result.joints.map((j) => j.x)
    const ys = result.joints.map((j) => j.y)
    const minX = Math.min(...xs, 0) - 1
    const maxX = Math.max(...xs, 6) + 1
    const minY = Math.min(...ys, 0) - 1
    const maxY = Math.max(...ys, 4) + 1
    const dx = Math.max(maxX - minX, 2)
    const dy = Math.max(maxY - minY, 2)
    const scale = Math.min((width - 2 * pad) / dx, (height - 2 * pad) / dy)
    return { minX, maxX, minY, maxY, scale }
  }, [result.joints])

  const toScreenX = useCallback((x) => pad + (x - bounds.minX) * bounds.scale, [bounds])
  const toScreenY = useCallback((y) => height - pad - (y - bounds.minY) * bounds.scale, [bounds])

  const toWorld = useCallback(
    (clientX, clientY) => {
      const svg = svgRef.current
      if (!svg) return { x: 0, y: 0 }
      const rect = svg.getBoundingClientRect()
      const svgX = ((clientX - rect.left) / rect.width) * width
      const svgY = ((clientY - rect.top) / rect.height) * height
      let wx = bounds.minX + (svgX - pad) / bounds.scale
      let wy = bounds.minY + (height - pad - svgY) / bounds.scale
      if (snapGrid > 0) {
        wx = Math.round(wx / snapGrid) * snapGrid
        wy = Math.round(wy / snapGrid) * snapGrid
      }
      return { x: Number(wx.toFixed(3)), y: Number(wy.toFixed(3)) }
    },
    [bounds, snapGrid]
  )

  // Keyboard shortcuts when canvas or wrapper is focused
  const handleKeyDown = (e) => {
    if (['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)) return

    if (e.key === 'Escape') {
      setMemberStartJoint(null)
      setToolMode('select')
      setSelectedEntity(null)
      return
    }

    if (e.key === 'Delete' || e.key === 'Backspace') {
      if (selectedEntity) {
        e.preventDefault()
        onDeleteSelected(selectedEntity)
      }
      return
    }

    // Tool hotkeys
    if (e.key.toLowerCase() === 'v') setToolMode('select')
    if (e.key.toLowerCase() === 'j') setToolMode('addJoint')
    if (e.key.toLowerCase() === 'm') setToolMode('addMember')
    if (e.key.toLowerCase() === 's') setToolMode('support')

    // Arrow keys nudge selected joint
    if (selectedEntity?.type === 'joint' && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      e.preventDefault()
      const step = e.shiftKey ? 0.1 : snapGrid || 0.5
      const jt = form.joints.find((j) => j.id === selectedEntity.id)
      if (!jt) return
      let nx = toNum(jt.x)
      let ny = toNum(jt.y)
      if (e.key === 'ArrowLeft') nx -= step
      if (e.key === 'ArrowRight') nx += step
      if (e.key === 'ArrowUp') ny += step
      if (e.key === 'ArrowDown') ny -= step
      onMoveJoint(jt.id, Number(nx.toFixed(3)), Number(ny.toFixed(3)))
    }
  }

  const handleSvgPointerMove = (e) => {
    const worldPt = toWorld(e.clientX, e.clientY)
    setCursorWorld(worldPt)
    if (draggingJointId) {
      onMoveJoint(draggingJointId, worldPt.x, worldPt.y)
    }
  }

  const handleSvgPointerUp = () => {
    setDraggingJointId(null)
  }

  const handleSvgClick = (e) => {
    if (toolMode === 'addJoint') {
      const worldPt = toWorld(e.clientX, e.clientY)
      onAddJointAt(worldPt.x, worldPt.y)
    } else if (e.target === svgRef.current || e.target.dataset.bg === 'true') {
      setMemberStartJoint(null)
      setSelectedEntity(null)
    }
  }

  const handleJointClick = (e, joint) => {
    e.stopPropagation()
    setSelectedEntity({ type: 'joint', id: joint.id })

    if (toolMode === 'support') {
      onToggleSupport(joint.id)
      return
    }

    if (toolMode === 'addMember') {
      if (!memberStartJoint) {
        setMemberStartJoint(joint.id)
      } else if (memberStartJoint !== joint.id) {
        onAddMemberBetween(memberStartJoint, joint.id)
        setMemberStartJoint(joint.id) // Chain drawing! Press Esc to stop
      }
    }
  }

  const handleMemberClick = (e, member) => {
    e.stopPropagation()
    setSelectedEntity({ type: 'member', id: member.id })
    onSelectMember(member.id)
  }

  const memberMap = new Map(result.memberResults.map((item) => [item.member.id, item]))
  const reactionMap = result.reactions || []

  // Generate grid lines
  const gridStep = snapGrid >= 0.5 ? snapGrid : 0.5
  const xTicks = []
  for (let x = Math.ceil(bounds.minX / gridStep) * gridStep; x <= bounds.maxX; x += gridStep) {
    xTicks.push(Number(x.toFixed(2)))
  }
  const yTicks = []
  for (let y = Math.ceil(bounds.minY / gridStep) * gridStep; y <= bounds.maxY; y += gridStep) {
    yTicks.push(Number(y.toFixed(2)))
  }

  return (
    <div
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="rounded-3xl border border-slate-800 bg-slate-950 p-4 outline-none focus:border-orange-500/60"
    >
      {/* CAD Toolbar */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'select', label: 'Select / Drag (V)' },
            { id: 'addJoint', label: '+ Joint (J)' },
            { id: 'addMember', label: '+ Member (M)' },
            { id: 'support', label: 'Cycle Support (S)' },
          ].map((tool) => (
            <button
              key={tool.id}
              type="button"
              onClick={() => {
                setToolMode(tool.id)
                setMemberStartJoint(null)
              }}
              className={`rounded-xl px-3 py-1.5 text-xs font-extrabold transition ${
                toolMode === tool.id
                  ? 'bg-orange-500 text-white'
                  : 'border border-slate-700 bg-slate-900 text-slate-300 hover:border-orange-400'
              }`}
            >
              {tool.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>Grid Snap:</span>
          <select
            value={snapGrid}
            onChange={(e) => setSnapGrid(Number(e.target.value))}
            className="rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-white"
          >
            <option value={0.1}>0.1 m</option>
            <option value={0.25}>0.25 m</option>
            <option value={0.5}>0.5 m</option>
            <option value={1}>1.0 m</option>
            <option value={0}>Off</option>
          </select>

          {selectedEntity && (
            <button
              type="button"
              onClick={() => onDeleteSelected(selectedEntity)}
              className="rounded-lg border border-red-500/40 bg-red-500/10 px-2.5 py-1 font-bold text-red-300 hover:bg-red-500/20"
            >
              Delete (Del)
            </button>
          )}
        </div>
      </div>

      {/* Contextual Hint Bar */}
      <div className="mb-2 flex flex-wrap items-center justify-between text-xs text-slate-400">
        <span>
          {toolMode === 'select' && 'Tip: Drag any joint to reshape truss, or click a joint/member & use Arrow keys or Delete.'}
          {toolMode === 'addJoint' && 'Click anywhere on the grid to place a new joint.'}
          {toolMode === 'addMember' &&
            (memberStartJoint
              ? 'Click the second joint to connect member (press Esc to finish).'
              : 'Click the starting joint for the new member.')}
          {toolMode === 'support' && 'Click any joint to cycle: None → Pin → Roller Y → Roller X.'}
        </span>
        {cursorWorld && (
          <span className="font-mono text-orange-300">
            x: {cursorWorld.x}m, y: {cursorWorld.y}m
          </span>
        )}
      </div>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        onPointerMove={handleSvgPointerMove}
        onPointerUp={handleSvgPointerUp}
        onPointerLeave={handleSvgPointerUp}
        onClick={handleSvgClick}
        className={`h-auto w-full select-none rounded-2xl bg-[#040919] ${
          toolMode === 'addJoint' ? 'cursor-crosshair' : 'cursor-default'
        }`}
      >
        <defs>
          <marker id="loadArrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
            <path d="M0,0 L0,6 L9,3 z" fill="#f97316" />
          </marker>
          <marker id="reactionArrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
            <path d="M0,0 L0,6 L9,3 z" fill="#22c55e" />
          </marker>
        </defs>

        <rect x="0" y="0" width={width} height={height} fill="transparent" data-bg="true" />

        {/* Coordinate Grid */}
        {xTicks.map((gx) => (
          <g key={`gx-${gx}`}>
            <line
              x1={toScreenX(gx)}
              y1={pad / 2}
              x2={toScreenX(gx)}
              y2={height - pad / 2}
              stroke={gx === 0 ? '#334155' : '#0f172a'}
              strokeWidth={gx === 0 ? 1.5 : 1}
            />
            {Number.isInteger(gx) && (
              <text x={toScreenX(gx)} y={height - 18} fill="#475569" fontSize="10" textAnchor="middle">
                {gx}m
              </text>
            )}
          </g>
        ))}

        {yTicks.map((gy) => (
          <g key={`gy-${gy}`}>
            <line
              x1={pad / 2}
              y1={toScreenY(gy)}
              x2={width - pad / 2}
              y2={toScreenY(gy)}
              stroke={gy === 0 ? '#334155' : '#0f172a'}
              strokeWidth={gy === 0 ? 1.5 : 1}
            />
            {Number.isInteger(gy) && (
              <text x={22} y={toScreenY(gy) + 3} fill="#475569" fontSize="10" textAnchor="middle">
                {gy}m
              </text>
            )}
          </g>
        ))}

        {/* Preview rubber-band line when adding a member */}
        {toolMode === 'addMember' && memberStartJoint && cursorWorld && (() => {
          const startJt = result.joints.find((j) => j.id === memberStartJoint)
          if (!startJt) return null
          return (
            <line
              x1={toScreenX(startJt.x)}
              y1={toScreenY(startJt.y)}
              x2={toScreenX(cursorWorld.x)}
              y2={toScreenY(cursorWorld.y)}
              stroke="#fb923c"
              strokeWidth="3"
              strokeDasharray="6 4"
            />
          )
        })()}

        {/* Truss Members */}
        {result.members.map((member) => {
          const a = result.joints.find((joint) => joint.id === member.start)
          const b = result.joints.find((joint) => joint.id === member.end)
          const res = memberMap.get(member.id)
          if (!a || !b) return null

          const isSelected = selectedEntity?.type === 'member' && selectedEntity.id === member.id
          let color = '#64748b'
          let strokeWidth = 4

          if (res) {
            if (Math.abs(res.force) < 0.001) {
              color = '#64748b'
              strokeWidth = 3.5
            } else if (res.force > 0) {
              color = '#38bdf8'
              strokeWidth = 5
            } else {
              color = '#f97316'
              strokeWidth = 5
            }
          }

          const mx = (toScreenX(a.x) + toScreenX(b.x)) / 2
          const my = (toScreenY(a.y) + toScreenY(b.y)) / 2

          return (
            <g
              key={member.id}
              onClick={(e) => handleMemberClick(e, member)}
              className="cursor-pointer"
            >
              {/* Invisible thick hit target for easy clicking */}
              <line
                x1={toScreenX(a.x)}
                y1={toScreenY(a.y)}
                x2={toScreenX(b.x)}
                y2={toScreenY(b.y)}
                stroke="transparent"
                strokeWidth="18"
              />
              {isSelected && (
                <line
                  x1={toScreenX(a.x)}
                  y1={toScreenY(a.y)}
                  x2={toScreenX(b.x)}
                  y2={toScreenY(b.y)}
                  stroke="#facc15"
                  strokeWidth={strokeWidth + 6}
                  strokeLinecap="round"
                  opacity="0.5"
                />
              )}
              <line
                x1={toScreenX(a.x)}
                y1={toScreenY(a.y)}
                x2={toScreenX(b.x)}
                y2={toScreenY(b.y)}
                stroke={color}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
              />
              <text x={mx + 6} y={my - 6} fill="#e2e8f0" fontSize="12" fontWeight="800">
                {memberName(member, result.joints)}
              </text>
              {res && Math.abs(res.force) >= 0.001 && (
                <text x={mx + 6} y={my + 11} fill={color} fontSize="11" fontWeight="700">
                  {fmt(res.force, 2)} kN
                </text>
              )}
            </g>
          )
        })}

        {/* External Loads */}
        {result.loads.map((load) => {
          const joint = result.joints.find((j) => j.id === load.joint)
          if (!joint) return null
          const mag = Math.sqrt(load.Fx ** 2 + load.Fy ** 2)
          if (mag < 1e-9) return null

          const ux = load.Fx / mag
          const uy = -load.Fy / mag
          const length = 48
          const px = toScreenX(joint.x)
          const py = toScreenY(joint.y)

          const tailX = px - ux * length
          const tailY = py - uy * length
          const headX = px - ux * 11
          const headY = py - uy * 11

          return (
            <g key={load.id}>
              <line
                x1={tailX}
                y1={tailY}
                x2={headX}
                y2={headY}
                stroke="#f97316"
                strokeWidth="3.5"
                markerEnd="url(#loadArrow)"
              />
              <text
                x={tailX - ux * 10}
                y={tailY - uy * 10}
                fill="#fed7aa"
                fontSize="12"
                fontWeight="800"
                textAnchor="middle"
              >
                {fmt(mag)} kN
              </text>
            </g>
          )
        })}

        {/* Support Reactions */}
        {reactionMap.map((reaction) => {
          if (Math.abs(reaction.value) < 0.001) return null
          const px = toScreenX(reaction.joint.x)
          const py = toScreenY(reaction.joint.y)
          const dir = reaction.value >= 0 ? 1 : -1
          const x2 = reaction.component === 'Rx' ? px + dir * 42 : px
          const y2 = reaction.component === 'Ry' ? py - dir * 42 : py

          return (
            <g key={`${reaction.joint.id}-${reaction.component}`}>
              <line
                x1={px}
                y1={py}
                x2={x2}
                y2={y2}
                stroke="#22c55e"
                strokeWidth="3"
                markerEnd="url(#reactionArrow)"
              />
              <text x={x2 + 6} y={y2 - 4} fill="#bbf7d0" fontSize="11" fontWeight="800">
                {reaction.component} {fmt(reaction.value)}
              </text>
            </g>
          )
        })}

        {/* Joints & Supports */}
        {result.joints.map((joint) => {
          const px = toScreenX(joint.x)
          const py = toScreenY(joint.y)
          const isSelected = selectedEntity?.type === 'joint' && selectedEntity.id === joint.id
          const isMemberStart = memberStartJoint === joint.id

          return (
            <g
              key={joint.id}
              onPointerDown={(e) => {
                if (toolMode === 'select') {
                  e.stopPropagation()
                  setSelectedEntity({ type: 'joint', id: joint.id })
                  setDraggingJointId(joint.id)
                }
              }}
              onClick={(e) => handleJointClick(e, joint)}
              className="cursor-pointer"
            >
              {joint.support === 'pin' && (
                <>
                  <polygon
                    points={`${px - 15},${py + 28} ${px + 15},${py + 28} ${px},${py + 8}`}
                    fill="#22c55e"
                    opacity="0.9"
                  />
                  <line x1={px - 22} y1={py + 30} x2={px + 22} y2={py + 30} stroke="#22c55e" strokeWidth="3" />
                </>
              )}

              {joint.support === 'rollerY' && (
                <>
                  <circle cx={px} cy={py + 19} r="9" fill="none" stroke="#22c55e" strokeWidth="3" />
                  <line x1={px - 22} y1={py + 30} x2={px + 22} y2={py + 30} stroke="#22c55e" strokeWidth="3" />
                </>
              )}

              {joint.support === 'rollerX' && (
                <>
                  <circle cx={px - 19} cy={py} r="9" fill="none" stroke="#22c55e" strokeWidth="3" />
                  <line x1={px - 30} y1={py - 22} x2={px - 30} y2={py + 22} stroke="#22c55e" strokeWidth="3" />
                </>
              )}

              {(isSelected || isMemberStart) && (
                <circle
                  cx={px}
                  cy={py}
                  r="14"
                  fill="none"
                  stroke={isMemberStart ? '#fb923c' : '#facc15'}
                  strokeWidth="2.5"
                  strokeDasharray={isMemberStart ? '3 2' : 'none'}
                />
              )}

              <circle cx={px} cy={py} r="8" fill="#0f172a" stroke="#e2e8f0" strokeWidth="3" />
              <text x={px + 11} y={py - 10} fill="#ffffff" fontSize="14" fontWeight="900">
                {joint.name}
              </text>
            </g>
          )
        })}

        <text x="16" y={height - 4} fill="#94a3b8" fontSize="11">
          Blue = Tension | Orange = Compression | Gray = Zero-Force | Green = Supports & Reactions
        </text>
      </svg>
    </div>
  )
}

/* ---------------- FORM FIELDS & EDITORS ---------------- */

function TextField({ label, value, onChange, helper, placeholder }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-300">{label}</span>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-orange-400"
      />
      {helper && <p className="mt-2 text-xs leading-5 text-slate-500">{helper}</p>}
    </label>
  )
}

function NumberField({ label, value, onChange, suffix, helper, min = undefined }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-300">{label}</span>
      <div className="flex overflow-hidden rounded-xl border border-slate-700 bg-slate-950 focus-within:border-orange-400">
        <input
          type="number"
          min={min}
          step="any"
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

function SelectField({ label, value, onChange, children, helper }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-300">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-orange-400"
      >
        {children}
      </select>
      {helper && <p className="mt-2 text-xs leading-5 text-slate-500">{helper}</p>}
    </label>
  )
}

function JointEditor({ joint, onChange, onDelete, isHighlighted }) {
  return (
    <div
      className={`rounded-2xl border p-4 transition ${
        isHighlighted ? 'border-yellow-400 bg-slate-900' : 'border-slate-800 bg-slate-950'
      }`}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="font-black text-white">Joint {joint.name}</h3>
        <button
          type="button"
          onClick={() => onDelete(joint.id)}
          className="rounded-lg border border-red-500/30 px-3 py-2 text-xs font-bold text-red-300 hover:bg-red-500/10"
        >
          Delete
        </button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label="Joint Name" value={joint.name} onChange={(v) => onChange(joint.id, 'name', v)} placeholder="A" />
        <SelectField label="Support Type" value={joint.support} onChange={(v) => onChange(joint.id, 'support', v)}>
          <option value="none">No Support</option>
          <option value="pin">Pin Support (Rx, Ry)</option>
          <option value="rollerY">Roller Vertical (Ry)</option>
          <option value="rollerX">Roller Horizontal (Rx)</option>
        </SelectField>
        <NumberField label="x Coordinate" value={joint.x} onChange={(v) => onChange(joint.id, 'x', v)} suffix="m" />
        <NumberField label="y Coordinate" value={joint.y} onChange={(v) => onChange(joint.id, 'y', v)} suffix="m" />
      </div>
    </div>
  )
}

function MemberEditor({ member, joints, onChange, onDelete, isHighlighted }) {
  return (
    <div
      className={`rounded-2xl border p-4 transition ${
        isHighlighted ? 'border-yellow-400 bg-slate-900' : 'border-slate-800 bg-slate-950'
      }`}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="font-black text-white">Member {memberName(member, joints)}</h3>
        <button
          type="button"
          onClick={() => onDelete(member.id)}
          className="rounded-lg border border-red-500/30 px-3 py-2 text-xs font-bold text-red-300 hover:bg-red-500/10"
        >
          Delete
        </button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField label="Start Joint" value={member.start} onChange={(v) => onChange(member.id, 'start', v)}>
          {joints.map((j) => (
            <option key={j.id} value={j.id}>{j.name}</option>
          ))}
        </SelectField>
        <SelectField label="End Joint" value={member.end} onChange={(v) => onChange(member.id, 'end', v)}>
          {joints.map((j) => (
            <option key={j.id} value={j.id}>{j.name}</option>
          ))}
        </SelectField>
        <NumberField label="Area A" value={member.area} onChange={(v) => onChange(member.id, 'area', v)} suffix="mm²" min="0.001" />
        <NumberField label="Modulus E" value={member.E} onChange={(v) => onChange(member.id, 'E', v)} suffix="GPa" min="0.001" />
      </div>
    </div>
  )
}

function LoadEditor({ load, joints, onChange, onDelete }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="font-black text-white">Joint Load</h3>
        <button
          type="button"
          onClick={() => onDelete(load.id)}
          className="rounded-lg border border-red-500/30 px-3 py-2 text-xs font-bold text-red-300 hover:bg-red-500/10"
        >
          Delete
        </button>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <SelectField label="Load Joint" value={load.joint} onChange={(v) => onChange(load.id, 'joint', v)}>
          {joints.map((j) => (
            <option key={j.id} value={j.id}>{j.name}</option>
          ))}
        </SelectField>
        <NumberField label="Fx" value={load.Fx} onChange={(v) => onChange(load.id, 'Fx', v)} suffix="kN" helper="+ve right" />
        <NumberField label="Fy" value={load.Fy} onChange={(v) => onChange(load.id, 'Fy', v)} suffix="kN" helper="-ve down" />
      </div>
    </div>
  )
}

/* ---------------- EXPORT & TABLES ---------------- */

function buildPlainReport(result, form) {
  const reactionText = result.reactions
    .map((r) => `${r.joint.name}${r.component} = ${fmt(r.value)} kN`)
    .join('\n')

  const memberText = result.memberResults
    .map((m) => `${m.name}: ${fmt(m.force)} kN (${m.type}), Stress = ${fmt(m.stress)} MPa, Elongation = ${fmt(m.elongationMm)} mm`)
    .join('\n')

  return `${form.reportTitle || 'Truss Analysis Report'}
Prepared By: ${form.preparedBy || '-'}

DETERMINACY CHECK
m = ${result.determinacy?.m}, r = ${result.determinacy?.r}, j = ${result.determinacy?.j}
m + r - 2j = ${result.determinacy?.value} (${result.determinacy?.status})

SUPPORT REACTIONS
${reactionText || '-'}

MEMBER FORCES
${memberText || '-'}

FINAL ANSWER
${result.finalAnswer}`.trim()
}

function copyToClipboard(text, message) {
  if (typeof window === 'undefined') return
  navigator.clipboard?.writeText(text).then(() => alert(message)).catch(() => alert('Copy failed.'))
}

function printReport(result, form) {
  if (typeof window === 'undefined') return
  const win = window.open('', '_blank', 'width=1000,height=800')
  if (!win) return alert('Popup blocked. Please allow popups.')
  win.document.write(`<pre style="font-family:sans-serif;white-space:pre-wrap;padding:24px;">${cleanHtml(buildPlainReport(result, form))}</pre>`)
  win.document.close()
  setTimeout(() => { win.focus(); win.print() }, 300)
}

function ActionButtons({ result, form }) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-black text-white">Export & Share</h2>
          <p className="mt-1 text-sm text-slate-400">Copy final answer, full solution, or print PDF report.</p>
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
            onClick={() => copyToClipboard(buildPlainReport(result, form), 'Full solution copied.')}
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

function ResultTables({ result, form }) {
  const selected = result.memberResults.find((item) => item.member.id === form.selectedMember) || result.memberResults[0]

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
        <h2 className="text-2xl font-black text-white">Support Reactions</h2>
        <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-800">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead className="bg-slate-950">
              <tr>
                <th className="border-b border-slate-800 px-4 py-3 text-white">Joint</th>
                <th className="border-b border-slate-800 px-4 py-3 text-white">Component</th>
                <th className="border-b border-slate-800 px-4 py-3 text-white">Reaction</th>
              </tr>
            </thead>
            <tbody>
              {result.reactions.length === 0 ? (
                <tr><td colSpan={3} className="px-4 py-6 text-center text-slate-400">No support reactions calculated.</td></tr>
              ) : (
                result.reactions.map((r) => (
                  <tr key={`${r.joint.id}-${r.component}`} className="bg-slate-900/50">
                    <td className="border-b border-slate-800 px-4 py-3 text-slate-200">{r.joint.name}</td>
                    <td className="border-b border-slate-800 px-4 py-3 text-orange-300">{r.component}</td>
                    <td className="border-b border-slate-800 px-4 py-3 text-slate-300">{fmt(r.value)} kN</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
        <h2 className="text-2xl font-black text-white">Member Force Results</h2>
        <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-800">
          <table className="w-full min-w-[780px] text-left text-sm">
            <thead className="bg-slate-950">
              <tr>
                <th className="border-b border-slate-800 px-4 py-3 text-white">Member</th>
                <th className="border-b border-slate-800 px-4 py-3 text-white">Length</th>
                <th className="border-b border-slate-800 px-4 py-3 text-white">Force</th>
                <th className="border-b border-slate-800 px-4 py-3 text-white">Type</th>
                <th className="border-b border-slate-800 px-4 py-3 text-white">Stress</th>
                <th className="border-b border-slate-800 px-4 py-3 text-white">Elongation</th>
              </tr>
            </thead>
            <tbody>
              {result.memberResults.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-6 text-center text-slate-400">No member results available.</td></tr>
              ) : (
                result.memberResults.map((item) => (
                  <tr key={item.member.id} className="bg-slate-900/50">
                    <td className="border-b border-slate-800 px-4 py-3 font-bold text-slate-200">{item.name}</td>
                    <td className="border-b border-slate-800 px-4 py-3 text-slate-300">{fmt(item.length)} m</td>
                    <td className="border-b border-slate-800 px-4 py-3 text-orange-300">{fmt(item.force)} kN</td>
                    <td className="border-b border-slate-800 px-4 py-3 text-slate-300">{item.type}</td>
                    <td className="border-b border-slate-800 px-4 py-3 text-slate-300">{fmt(item.stress)} MPa</td>
                    <td className="border-b border-slate-800 px-4 py-3 text-slate-300">{fmt(item.elongationMm)} mm</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <div className="rounded-3xl border border-sky-500/30 bg-sky-500/10 p-6">
          <h2 className="text-2xl font-black text-white">Selected Member Detail</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
              <p className="text-sm text-slate-400">Member</p>
              <p className="mt-2 text-xl font-black text-sky-300">{selected.name}</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
              <p className="text-sm text-slate-400">Force</p>
              <p className="mt-2 text-xl font-black text-sky-300">{fmt(selected.force)} kN</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
              <p className="text-sm text-slate-400">Nature</p>
              <p className="mt-2 text-xl font-black text-sky-300">{selected.type}</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
              <p className="text-sm text-slate-400">Stress</p>
              <p className="mt-2 text-xl font-black text-sky-300">{fmt(selected.stress)} MPa</p>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
        <h2 className="text-2xl font-black text-white">Joint Displacements</h2>
        <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-800">
          <table className="w-full min-w-[620px] text-left text-sm">
            <thead className="bg-slate-950">
              <tr>
                <th className="border-b border-slate-800 px-4 py-3 text-white">Joint</th>
                <th className="border-b border-slate-800 px-4 py-3 text-white">Ux</th>
                <th className="border-b border-slate-800 px-4 py-3 text-white">Uy</th>
                <th className="border-b border-slate-800 px-4 py-3 text-white">Total</th>
              </tr>
            </thead>
            <tbody>
              {result.displacements.map((item) => (
                <tr key={item.joint.id} className="bg-slate-900/50">
                  <td className="border-b border-slate-800 px-4 py-3 font-bold text-slate-200">{item.joint.name}</td>
                  <td className="border-b border-slate-800 px-4 py-3 text-slate-300">{fmt(item.uxMm)} mm</td>
                  <td className="border-b border-slate-800 px-4 py-3 text-slate-300">{fmt(item.uyMm)} mm</td>
                  <td className="border-b border-slate-800 px-4 py-3 text-orange-300">{fmt(item.totalMm)} mm</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function ZeroForcePanel({ result }) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
      <h2 className="text-2xl font-black text-white">Zero Force Members</h2>
      {result.zeroForceMembers.length === 0 ? (
        <p className="mt-4 rounded-2xl border border-slate-800 bg-slate-950 p-4 text-slate-300">
          No zero-force member detected for the current truss.
        </p>
      ) : (
        <div className="mt-5 space-y-3">
          {result.zeroForceMembers.map((item) => {
            const member = result.members.find((m) => m.id === item.memberId)
            return (
              <div key={item.memberId} className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                <p className="font-black text-orange-300">
                  {member ? memberName(member, result.joints) : item.memberId}
                </p>
                <p className="mt-1 text-sm text-slate-300">{item.reason}</p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

/* ---------------- MAIN PAGE ---------------- */

export default function TrussAnalysisPage() {
  const [form, setForm] = useState(getTemplate('triangular'))
  const [selectedEntity, setSelectedEntity] = useState(null)
  const result = useMemo(() => analyzeTruss(form), [form])

  useEffect(() => {
    if (form.members.length === 0) return
    const exists = form.members.some((m) => m.id === form.selectedMember)
    if (!exists) {
      setForm((prev) => ({ ...prev, selectedMember: prev.members[0]?.id || '' }))
    }
  }, [form.members, form.selectedMember])

  const updateForm = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))
  const applyTemplate = (key) => {
    setSelectedEntity(null)
    setForm(getTemplate(key))
  }

  const getNextJointName = (existingJoints) => {
    const used = new Set(existingJoints.map((j) => j.name))
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    for (const ch of alphabet) {
      if (!used.has(ch)) return ch
    }
    return `J${existingJoints.length + 1}`
  }

  const updateJoint = (id, key, value) => {
    setForm((prev) => ({
      ...prev,
      joints: prev.joints.map((joint) => (joint.id === id ? { ...joint, [key]: value } : joint)),
    }))
  }

  const moveJoint = (id, x, y) => {
    setForm((prev) => ({
      ...prev,
      joints: prev.joints.map((joint) => (joint.id === id ? { ...joint, x, y } : joint)),
    }))
  }

  const addJoint = () => {
    const id = uid('J')
    setForm((prev) => ({
      ...prev,
      joints: [
        ...prev.joints,
        {
          id,
          name: getNextJointName(prev.joints),
          x: prev.joints.length + 1,
          y: 0,
          support: 'none',
        },
      ],
    }))
  }

  const addJointAt = (x, y) => {
    const id = uid('J')
    setForm((prev) => ({
      ...prev,
      joints: [
        ...prev.joints,
        {
          id,
          name: getNextJointName(prev.joints),
          x,
          y,
          support: 'none',
        },
      ],
    }))
    setSelectedEntity({ type: 'joint', id })
  }

  const toggleSupport = (jointId) => {
    const cycle = ['none', 'pin', 'rollerY', 'rollerX']
    setForm((prev) => ({
      ...prev,
      joints: prev.joints.map((j) => {
        if (j.id !== jointId) return j
        const nextSupport = cycle[(cycle.indexOf(j.support) + 1) % cycle.length]
        return { ...j, support: nextSupport }
      }),
    }))
  }

  const deleteJoint = (id) => {
    setForm((prev) => {
      if (prev.joints.length <= 2) return prev
      return {
        ...prev,
        joints: prev.joints.filter((joint) => joint.id !== id),
        members: prev.members.filter((member) => member.start !== id && member.end !== id),
        loads: prev.loads.filter((load) => load.joint !== id),
      }
    })
    if (selectedEntity?.id === id) setSelectedEntity(null)
  }

  const updateMember = (id, key, value) => {
    setForm((prev) => ({
      ...prev,
      members: prev.members.map((member) => (member.id === id ? { ...member, [key]: value } : member)),
    }))
  }

  const addMember = () => {
    setForm((prev) => {
      const start = prev.joints[0]?.id
      const end = prev.joints[1]?.id
      if (!start || !end) return prev
      const id = uid('M')
      return {
        ...prev,
        selectedMember: prev.selectedMember || id,
        members: [...prev.members, { id, start, end, area: 500, E: 200 }],
      }
    })
  }

  const addMemberBetween = (startId, endId) => {
    if (startId === endId) return
    setForm((prev) => {
      // Prevent duplicate members between same two joints
      const exists = prev.members.some(
        (m) => (m.start === startId && m.end === endId) || (m.start === endId && m.end === startId)
      )
      if (exists) return prev
      const id = uid('M')
      return {
        ...prev,
        selectedMember: id,
        members: [...prev.members, { id, start: startId, end: endId, area: 500, E: 200 }],
      }
    })
  }

  const deleteMember = (id) => {
    setForm((prev) => ({
      ...prev,
      members: prev.members.length > 1 ? prev.members.filter((member) => member.id !== id) : prev.members,
      selectedMember:
        prev.selectedMember === id ? prev.members.find((m) => m.id !== id)?.id || '' : prev.selectedMember,
    }))
    if (selectedEntity?.id === id) setSelectedEntity(null)
  }

  const deleteSelected = (entity) => {
    if (!entity) return
    if (entity.type === 'joint') deleteJoint(entity.id)
    if (entity.type === 'member') deleteMember(entity.id)
  }

  const updateLoad = (id, key, value) => {
    setForm((prev) => ({
      ...prev,
      loads: prev.loads.map((load) => (load.id === id ? { ...load, [key]: value } : load)),
    }))
  }

  const addLoad = () => {
    setForm((prev) => ({
      ...prev,
      loads: [
        ...prev.loads,
        {
          id: uid('L'),
          joint: selectedEntity?.type === 'joint' ? selectedEntity.id : prev.joints[0]?.id || '',
          Fx: 0,
          Fy: -10,
        },
      ],
    }))
  }

  const deleteLoad = (id) => {
    setForm((prev) => ({
      ...prev,
      loads: prev.loads.filter((load) => load.id !== id),
    }))
  }

  const startFreshTruss = () => {
    setSelectedEntity(null)
    setForm({
      reportTitle: 'Custom Truss Analysis',
      preparedBy: form.preparedBy,
      template: 'custom',
      selectedMember: 'M1',
      joints: [
        { id: 'A', name: 'A', x: 0, y: 0, support: 'pin' },
        { id: 'B', name: 'B', x: 4, y: 0, support: 'rollerY' },
      ],
      members: [{ id: 'M1', start: 'A', end: 'B', area: 500, E: 200 }],
      loads: [],
    })
  }

  return (
    <main className="min-h-screen bg-[#050B1F] px-4 py-8 text-white md:px-8">
      <section className="mx-auto max-w-7xl">
        <div className="mb-8 rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 md:p-8">
          <p className="mb-3 text-sm font-extrabold uppercase tracking-widest text-orange-400">
            CivilCalc Pro • Interactive Structural Solver
          </p>
          <h1 className="text-3xl font-black leading-tight md:text-5xl">2D Truss Analysis Solver</h1>
          <p className="mt-4 max-w-4xl text-base leading-8 text-slate-300 md:text-lg">
            Build or edit any 2D pin-jointed truss directly on the interactive CAD diagram using your mouse and keyboard, or configure exact coordinates and loads in the inspector.
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
          {/* LEFT SIDEBAR */}
          <aside className="space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-white">Templates</h2>
                <button
                  type="button"
                  onClick={startFreshTruss}
                  className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs font-bold text-orange-300 hover:border-orange-400"
                >
                  + Blank Base
                </button>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                {templates.map((template) => (
                  <button
                    key={template.key}
                    type="button"
                    onClick={() => applyTemplate(template.key)}
                    className={`rounded-xl border px-4 py-3 text-sm font-black transition ${
                      form.template === template.key
                        ? 'border-orange-500 bg-orange-500 text-white'
                        : 'border-slate-700 bg-slate-950 text-slate-200 hover:border-orange-400 hover:text-orange-300'
                    }`}
                  >
                    {template.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
              <h2 className="text-2xl font-black text-white">Report Setup</h2>
              <div className="mt-5 space-y-4">
                <TextField
                  label="Report Title"
                  value={form.reportTitle}
                  onChange={(value) => updateForm('reportTitle', value)}
                  placeholder="Example: Roof Truss Analysis"
                />
                <TextField
                  label="Prepared By"
                  value={form.preparedBy}
                  onChange={(value) => updateForm('preparedBy', value)}
                  placeholder="Your name"
                />
                <SelectField
                  label="Focus Member"
                  value={form.selectedMember}
                  onChange={(value) => updateForm('selectedMember', value)}
                >
                  {form.members.length === 0 && <option value="">No members</option>}
                  {form.members.map((member) => (
                    <option key={member.id} value={member.id}>
                      {memberName(member, form.joints)}
                    </option>
                  ))}
                </SelectField>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-2xl font-black text-white">Joints ({form.joints.length})</h2>
                <button
                  type="button"
                  onClick={addJoint}
                  className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-black text-white hover:bg-orange-600"
                >
                  + Joint
                </button>
              </div>
              <div className="mt-5 space-y-4">
                {form.joints.map((joint) => (
                  <JointEditor
                    key={joint.id}
                    joint={joint}
                    onChange={updateJoint}
                    onDelete={deleteJoint}
                    isHighlighted={selectedEntity?.type === 'joint' && selectedEntity.id === joint.id}
                  />
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-2xl font-black text-white">Members ({form.members.length})</h2>
                <button
                  type="button"
                  onClick={addMember}
                  className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-black text-white hover:bg-orange-600"
                >
                  + Member
                </button>
              </div>
              <div className="mt-5 space-y-4">
                {form.members.map((member) => (
                  <MemberEditor
                    key={member.id}
                    member={member}
                    joints={form.joints}
                    onChange={updateMember}
                    onDelete={deleteMember}
                    isHighlighted={selectedEntity?.type === 'member' && selectedEntity.id === member.id}
                  />
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-2xl font-black text-white">Joint Loads ({form.loads.length})</h2>
                <button
                  type="button"
                  onClick={addLoad}
                  className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-black text-white hover:bg-orange-600"
                >
                  + Load
                </button>
              </div>
              <div className="mt-5 space-y-4">
                {form.loads.length === 0 && (
                  <p className="rounded-2xl border border-slate-800 bg-slate-950 p-4 text-sm text-slate-400">
                    No loads added. Click "+ Load" to apply forces to a joint.
                  </p>
                )}
                {form.loads.map((load) => (
                  <LoadEditor
                    key={load.id}
                    load={load}
                    joints={form.joints}
                    onChange={updateLoad}
                    onDelete={deleteLoad}
                  />
                ))}
              </div>
            </div>
          </aside>

          {/* RIGHT RESULTS & CAD VIEWPORT */}
          <section className="space-y-6">
            <InteractiveTrussDiagram
              result={result}
              form={form}
              selectedEntity={selectedEntity}
              setSelectedEntity={setSelectedEntity}
              onMoveJoint={moveJoint}
              onAddJointAt={addJointAt}
              onToggleSupport={toggleSupport}
              onAddMemberBetween={addMemberBetween}
              onDeleteSelected={deleteSelected}
              onSelectMember={(memberId) => updateForm('selectedMember', memberId)}
            />

            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
              <h2 className="text-2xl font-black text-white">Truss Result Summary</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {result.summary.map((item) => (
                  <div key={item.label} className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                    <p className="text-sm text-slate-400">{item.label}</p>
                    <p className="mt-2 text-xl font-black text-orange-300">{item.value}</p>
                  </div>
                ))}
              </div>

              {result.warning && (
                <div className="mt-5 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200">
                  {result.warning}
                </div>
              )}

              {result.error && (
                <div className="mt-5 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm leading-7 text-red-100">
                  ⚠️ {result.error}
                </div>
              )}
            </div>

            <ActionButtons result={result} form={form} />

            <div className="rounded-3xl border border-orange-500/20 bg-orange-500/10 p-6">
              <h2 className="text-2xl font-black text-white">Determinacy & Stability Check</h2>
              <div className="mt-5 grid gap-4 md:grid-cols-4">
                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                  <p className="text-sm text-slate-400">Members m</p>
                  <p className="mt-2 text-xl font-black text-orange-300">{result.determinacy?.m}</p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                  <p className="text-sm text-slate-400">Reactions r</p>
                  <p className="mt-2 text-xl font-black text-orange-300">{result.determinacy?.r}</p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                  <p className="text-sm text-slate-400">Joints j</p>
                  <p className="mt-2 text-xl font-black text-orange-300">{result.determinacy?.j}</p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                  <p className="text-sm text-slate-400">m + r - 2j</p>
                  <p className="mt-2 text-xl font-black text-orange-300">{result.determinacy?.value}</p>
                </div>
              </div>
              <p className="mt-5 rounded-2xl border border-slate-800 bg-slate-950 p-4 leading-7 text-slate-300">
                {result.determinacy?.status}
              </p>
            </div>

            <ResultTables result={result} form={form} />
            <ZeroForcePanel result={result} />

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
                <h2 className="text-2xl font-black text-white">Step-by-Step Solution</h2>
                <div className="mt-6 space-y-4">
                  {result.steps.map((step, index) => (
                    <div key={`step-${index}`} className="flex gap-4 rounded-2xl border border-slate-800 bg-slate-950 p-4">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-500 text-sm font-black text-white">
                        {index + 1}
                      </div>
                      <p className="leading-8 text-slate-300">{step}</p>
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
          </section>
        </div>
      </section>
    </main>
  )
}
