'use client'

import { useMemo, useState } from 'react'

const templates = [
  { key: 'triangular', label: 'Triangular Truss' },
  { key: 'kingpost', label: 'King Post Truss' },
  { key: 'warren', label: 'Warren Truss' },
  { key: 'pratt', label: 'Pratt Truss' },
]

const topicCards = [
  '2D Pin-Jointed Truss',
  'Support Reactions',
  'Member Forces',
  'Tension / Compression',
  'Zero Force Members',
  'Determinacy Check',
  'Joint Displacement',
  'Stress & Strain',
  'Truss Diagram',
  'Copy Solution',
  'Print / Save PDF',
  'Exam Answer',
]

function uid(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function toNum(value, fallback = 0) {
  const n = Number(value)
  return Number.isFinite(n) ? n : fallback
}

function fmt(value, digits = 3) {
  const n = Number(value)
  if (!Number.isFinite(n)) return '0'
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
    const joints = [
      { id: 'A', name: 'A', x: 0, y: 0, support: 'pin' },
      { id: 'B', name: 'B', x: 6, y: 0, support: 'rollerY' },
      { id: 'C', name: 'C', x: 3, y: 3, support: 'none' },
      { id: 'D', name: 'D', x: 3, y: 0, support: 'none' },
    ]

    return {
      reportTitle: 'King Post Truss Analysis',
      preparedBy: '',
      template: key,
      selectedMember: 'AC',
      joints,
      members: [
        { id: 'AD', start: 'A', end: 'D', area: 500, E: 200 },
        { id: 'DB', start: 'D', end: 'B', area: 500, E: 200 },
        { id: 'AC', start: 'A', end: 'C', area: 500, E: 200 },
        { id: 'CB', start: 'C', end: 'B', area: 500, E: 200 },
        { id: 'CD', start: 'C', end: 'D', area: 500, E: 200 },
      ],
      loads: [
        { id: 'L1', joint: 'D', Fx: 0, Fy: -20 },
      ],
    }
  }

  if (key === 'warren') {
    const joints = [
      { id: 'A', name: 'A', x: 0, y: 0, support: 'pin' },
      { id: 'B', name: 'B', x: 3, y: 3, support: 'none' },
      { id: 'C', name: 'C', x: 6, y: 0, support: 'none' },
      { id: 'D', name: 'D', x: 9, y: 3, support: 'none' },
      { id: 'E', name: 'E', x: 12, y: 0, support: 'rollerY' },
    ]

    return {
      reportTitle: 'Warren Truss Analysis',
      preparedBy: '',
      template: key,
      selectedMember: 'AB',
      joints,
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
    const joints = [
      { id: 'A', name: 'A', x: 0, y: 0, support: 'pin' },
      { id: 'B', name: 'B', x: 3, y: 0, support: 'none' },
      { id: 'C', name: 'C', x: 6, y: 0, support: 'none' },
      { id: 'D', name: 'D', x: 9, y: 0, support: 'rollerY' },
      { id: 'E', name: 'E', x: 3, y: 3, support: 'none' },
      { id: 'F', name: 'F', x: 6, y: 3, support: 'none' },
    ]

    return {
      reportTitle: 'Pratt Truss Analysis',
      preparedBy: '',
      template: key,
      selectedMember: 'AE',
      joints,
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

  const joints = [
    { id: 'A', name: 'A', x: 0, y: 0, support: 'pin' },
    { id: 'B', name: 'B', x: 4, y: 0, support: 'rollerY' },
    { id: 'C', name: 'C', x: 2, y: 3, support: 'none' },
  ]

  return {
    reportTitle: 'Triangular Truss Analysis',
    preparedBy: '',
    template: 'triangular',
    selectedMember: 'AC',
    joints,
    members: [
      { id: 'AB', start: 'A', end: 'B', area: 500, E: 200 },
      { id: 'AC', start: 'A', end: 'C', area: 500, E: 200 },
      { id: 'BC', start: 'B', end: 'C', area: 500, E: 200 },
    ],
    loads: [
      { id: 'L1', joint: 'C', Fx: 0, Fy: -20 },
    ],
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
        error: 'The stiffness matrix is singular. The truss may be unstable, under-supported, or a mechanism.',
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
          reason: `Joint ${joint.name} has two non-collinear members and no external load/support.`,
        })
        zero.push({
          memberId: m2.id,
          reason: `Joint ${joint.name} has two non-collinear members and no external load/support.`,
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
                reason: `Joint ${joint.name} has three members, two are collinear and no external load/support.`,
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
    if (seen.has(item.memberId)) return
    seen.add(item.memberId)
    unique.push(item)
  })

  return unique
}

function getMemberVectorFromJoint(joint, member, joints) {
  const otherId = member.start === joint.id ? member.end : member.start
  const other = joints.find((j) => j.id === otherId)

  if (!other) return { x: 0, y: 0 }

  return {
    x: other.x - joint.x,
    y: other.y - joint.y,
  }
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

  let determinacyStatus = 'Statically determinate by count'

  if (determinacyValue > 0) {
    determinacyStatus = `Statically indeterminate by count, degree = ${determinacyValue}`
  } else if (determinacyValue < 0) {
    determinacyStatus = `Unstable by count, deficiency = ${Math.abs(determinacyValue)}`
  }

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

  members.forEach((member) => {
    const startInfo = jointMap.get(member.start)
    const endInfo = jointMap.get(member.end)

    if (!startInfo || !endInfo) return

    const xi = startInfo.joint.x
    const yi = startInfo.joint.y
    const xj = endInfo.joint.x
    const yj = endInfo.joint.y

    const dx = xj - xi
    const dy = yj - yi
    const length = Math.sqrt(dx * dx + dy * dy)

    if (length <= 1e-9) return

    const c = dx / length
    const s = dy / length
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
  })

  const fixed = Array(dof).fill(false)

  joints.forEach((joint, index) => {
    const dofs = supportDofs(joint.support)

    if (dofs.includes('x')) fixed[2 * index] = true
    if (dofs.includes('y')) fixed[2 * index + 1] = true
  })

  const freeDofs = []
  const fixedDofs = []

  fixed.forEach((isFixed, index) => {
    if (isFixed) fixedDofs.push(index)
    else freeDofs.push(index)
  })

  const Kff = freeDofs.map((row) => freeDofs.map((col) => K[row][col]))
  const Ff = freeDofs.map((index) => F[index])

  const solution = solveLinearSystem(Kff, Ff)

  if (solution.error) {
    return {
      error: solution.error,
      joints,
      members,
      loads,
      memberResults: [],
      reactions: [],
      displacements: [],
      zeroForceMembers: getZeroForceMembersByRules(joints, members, loads),
      determinacy: {
        m,
        r,
        j,
        value: determinacyValue,
        status: 'Unstable / mechanism likely',
      },
      summary: [
        { label: 'Joints', value: `${j}` },
        { label: 'Members', value: `${m}` },
        { label: 'Reaction Components', value: `${r}` },
        { label: 'Status', value: 'Unstable' },
      ],
      finalAnswer: solution.error,
      steps: [
        `Number of joints j = ${j}.`,
        `Number of members m = ${m}.`,
        `Reaction components r = ${r}.`,
        `Check m + r - 2j = ${m} + ${r} - ${2 * j} = ${determinacyValue}.`,
        solution.error,
      ],
    }
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
      type:
        Math.abs(force) < 0.001
          ? 'Zero'
          : force > 0
            ? 'Tension'
            : 'Compression',
    }
  })

  const reactions = []

  joints.forEach((joint, index) => {
    const dofs = supportDofs(joint.support)

    if (dofs.includes('x')) {
      reactions.push({
        joint,
        component: 'Rx',
        value: R[2 * index],
      })
    }

    if (dofs.includes('y')) {
      reactions.push({
        joint,
        component: 'Ry',
        value: R[2 * index + 1],
      })
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
    if (!zeroMap.has(item.memberId)) {
      zeroMap.set(item.memberId, item)
    }
  })

  const zeroForceMembers = [...zeroMap.values()]

  const finalAnswer = `The truss has ${joints.length} joints, ${members.length} members and ${r} reaction components. ${determinacyStatus}. Maximum member force is ${fmt(maxForce.force)} kN in member ${maxForce.name}, which is ${maxForce.force >= 0 ? 'tension' : 'compression'}. Maximum joint displacement is ${fmt(maxDisp.totalMm)} mm at joint ${maxDisp.joint.name}.`

  return {
    error: '',
    joints,
    members,
    loads,
    memberResults,
    reactions,
    displacements,
    zeroForceMembers,
    determinacy: {
      m,
      r,
      j,
      value: determinacyValue,
      status: determinacyStatus,
    },
    summary: [
      { label: 'Joints', value: `${j}` },
      { label: 'Members', value: `${m}` },
      { label: 'Reaction Components', value: `${r}` },
      { label: 'Max Member Force', value: `${fmt(maxForce.force)} kN` },
    ],
    finalAnswer,
    steps: [
      `Number of joints j = ${j}.`,
      `Number of members m = ${m}.`,
      `Reaction components r = ${r}.`,
      `Determinacy check: m + r - 2j = ${m} + ${r} - ${2 * j} = ${determinacyValue}.`,
      `Global stiffness matrix is assembled using each member stiffness AE/L.`,
      `Support boundary conditions are applied based on pin and roller supports.`,
      `Joint displacements are solved from [K]{d} = {F}.`,
      `Member axial force is calculated using N = AE/L × member axial deformation.`,
      `Positive force is reported as tension. Negative force is reported as compression.`,
    ],
  }
}

function buildPlainReport(result, form) {
  const reactionText = result.reactions
    .map((reaction) => `${reaction.joint.name}${reaction.component} = ${fmt(reaction.value)} kN`)
    .join('\n')

  const memberText = result.memberResults
    .map(
      (item) =>
        `${item.name}: ${fmt(item.force)} kN (${item.type}), Stress = ${fmt(item.stress)} MPa, Elongation = ${fmt(item.elongationMm)} mm`
    )
    .join('\n')

  const zeroText = result.zeroForceMembers.length
    ? result.zeroForceMembers
        .map((item) => {
          const member = result.members.find((m) => m.id === item.memberId)
          return `${member ? memberName(member, result.joints) : item.memberId}: ${item.reason}`
        })
        .join('\n')
    : 'No zero-force member detected.'

  return `
${form.reportTitle || 'Truss Analysis Report'}
Prepared By: ${form.preparedBy || '-'}

DETERMINACY CHECK
m = ${result.determinacy?.m}
r = ${result.determinacy?.r}
j = ${result.determinacy?.j}
m + r - 2j = ${result.determinacy?.value}
Status: ${result.determinacy?.status}

SUPPORT REACTIONS
${reactionText || '-'}

MEMBER FORCES
${memberText || '-'}

ZERO FORCE MEMBERS
${zeroText}

STEP-BY-STEP SOLUTION
${result.steps.map((step, index) => `${index + 1}. ${step}`).join('\n')}

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
  const memberRows = result.memberResults
    .map(
      (item) => `
        <tr>
          <td>${cleanHtml(item.name)}</td>
          <td>${fmt(item.length)} m</td>
          <td>${fmt(item.force)} kN</td>
          <td>${cleanHtml(item.type)}</td>
          <td>${fmt(item.stress)} MPa</td>
          <td>${fmt(item.elongationMm)} mm</td>
        </tr>
      `
    )
    .join('')

  const reactionRows = result.reactions
    .map(
      (item) => `
        <tr>
          <td>${cleanHtml(item.joint.name)}</td>
          <td>${cleanHtml(item.component)}</td>
          <td>${fmt(item.value)} kN</td>
        </tr>
      `
    )
    .join('')

  const displacementRows = result.displacements
    .map(
      (item) => `
        <tr>
          <td>${cleanHtml(item.joint.name)}</td>
          <td>${fmt(item.uxMm)} mm</td>
          <td>${fmt(item.uyMm)} mm</td>
          <td>${fmt(item.totalMm)} mm</td>
        </tr>
      `
    )
    .join('')

  const steps = result.steps
    .map((step, index) => `<li><strong>Step ${index + 1}:</strong> ${cleanHtml(step)}</li>`)
    .join('')

  return `
<!doctype html>
<html>
<head>
  <title>${cleanHtml(form.reportTitle || 'Truss Analysis Report')}</title>
  <meta charset="utf-8" />
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 28px;
      color: #111827;
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

    h2 {
      margin-top: 28px;
      border-left: 5px solid #f97316;
      padding-left: 10px;
      color: #0f172a;
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
    }

    .answer {
      background: #fff7ed;
      border: 1px solid #fdba74;
      border-radius: 10px;
      padding: 14px;
      line-height: 1.7;
      font-weight: 600;
    }

    li {
      margin-bottom: 8px;
      line-height: 1.6;
    }

    .sub {
      margin-top: 8px;
      color: #475569;
      font-size: 14px;
      line-height: 1.6;
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
      <h1>${cleanHtml(form.reportTitle || 'Truss Analysis Report')}</h1>
      <div class="sub">
        Prepared By: ${cleanHtml(form.preparedBy || '-')}<br/>
        Generated using CivilCalc Pro Truss Analysis Solver
      </div>
    </div>

    <h2>Determinacy Check</h2>
    <table>
      <tr><td>Members m</td><td>${result.determinacy?.m}</td></tr>
      <tr><td>Reaction components r</td><td>${result.determinacy?.r}</td></tr>
      <tr><td>Joints j</td><td>${result.determinacy?.j}</td></tr>
      <tr><td>m + r - 2j</td><td>${result.determinacy?.value}</td></tr>
      <tr><td>Status</td><td>${cleanHtml(result.determinacy?.status)}</td></tr>
    </table>

    <h2>Support Reactions</h2>
    <table>
      <thead>
        <tr><th>Joint</th><th>Component</th><th>Reaction</th></tr>
      </thead>
      <tbody>${reactionRows}</tbody>
    </table>

    <h2>Member Forces</h2>
    <table>
      <thead>
        <tr>
          <th>Member</th>
          <th>Length</th>
          <th>Force</th>
          <th>Type</th>
          <th>Stress</th>
          <th>Elongation</th>
        </tr>
      </thead>
      <tbody>${memberRows}</tbody>
    </table>

    <h2>Joint Displacements</h2>
    <table>
      <thead>
        <tr><th>Joint</th><th>Ux</th><th>Uy</th><th>Total</th></tr>
      </thead>
      <tbody>${displacementRows}</tbody>
    </table>

    <h2>Step-by-Step Solution</h2>
    <ol>${steps}</ol>

    <h2>Final Answer</h2>
    <div class="answer">${cleanHtml(result.finalAnswer)}</div>

    <div class="footer">Generated using CivilCalc Pro.</div>
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

function TextField({ label, value, onChange, helper, placeholder }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-300">{label}</span>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-500"
      />
      {helper && <p className="mt-2 text-xs leading-5 text-slate-500">{helper}</p>}
    </label>
  )
}

function NumberField({ label, value, onChange, suffix, helper, min = undefined }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-300">{label}</span>

      <div className="flex overflow-hidden rounded-xl border border-slate-700 bg-slate-950">
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
        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none"
      >
        {children}
      </select>
      {helper && <p className="mt-2 text-xs leading-5 text-slate-500">{helper}</p>}
    </label>
  )
}

function JointEditor({ joint, onChange, onDelete }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
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
        <TextField
          label="Joint Name"
          value={joint.name}
          onChange={(value) => onChange(joint.id, 'name', value)}
          placeholder="A"
        />

        <SelectField
          label="Support Type"
          value={joint.support}
          onChange={(value) => onChange(joint.id, 'support', value)}
        >
          <option value="none">No Support</option>
          <option value="pin">Pin Support</option>
          <option value="rollerY">Roller Support Vertical</option>
          <option value="rollerX">Roller Support Horizontal</option>
        </SelectField>

        <NumberField
          label="x Coordinate"
          value={joint.x}
          onChange={(value) => onChange(joint.id, 'x', value)}
          suffix="m"
        />

        <NumberField
          label="y Coordinate"
          value={joint.y}
          onChange={(value) => onChange(joint.id, 'y', value)}
          suffix="m"
        />
      </div>
    </div>
  )
}

function MemberEditor({ member, joints, onChange, onDelete }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
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
        <SelectField
          label="Start Joint"
          value={member.start}
          onChange={(value) => onChange(member.id, 'start', value)}
        >
          {joints.map((joint) => (
            <option key={joint.id} value={joint.id}>
              {joint.name}
            </option>
          ))}
        </SelectField>

        <SelectField
          label="End Joint"
          value={member.end}
          onChange={(value) => onChange(member.id, 'end', value)}
        >
          {joints.map((joint) => (
            <option key={joint.id} value={joint.id}>
              {joint.name}
            </option>
          ))}
        </SelectField>

        <NumberField
          label="Area A"
          value={member.area}
          onChange={(value) => onChange(member.id, 'area', value)}
          suffix="mm²"
          min="0.001"
        />

        <NumberField
          label="Modulus E"
          value={member.E}
          onChange={(value) => onChange(member.id, 'E', value)}
          suffix="GPa"
          min="0.001"
        />
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
        <SelectField
          label="Load Joint"
          value={load.joint}
          onChange={(value) => onChange(load.id, 'joint', value)}
        >
          {joints.map((joint) => (
            <option key={joint.id} value={joint.id}>
              {joint.name}
            </option>
          ))}
        </SelectField>

        <NumberField
          label="Fx"
          value={load.Fx}
          onChange={(value) => onChange(load.id, 'Fx', value)}
          suffix="kN"
          helper="+ve right, -ve left"
        />

        <NumberField
          label="Fy"
          value={load.Fy}
          onChange={(value) => onChange(load.id, 'Fy', value)}
          suffix="kN"
          helper="+ve upward, -ve downward"
        />
      </div>
    </div>
  )
}

function TrussDiagram({ result }) {
  const width = 720
  const height = 460
  const pad = 80

  const xs = result.joints.map((joint) => joint.x)
  const ys = result.joints.map((joint) => joint.y)

  const minX = Math.min(...xs, 0)
  const maxX = Math.max(...xs, 1)
  const minY = Math.min(...ys, 0)
  const maxY = Math.max(...ys, 1)

  const dx = Math.max(maxX - minX, 1)
  const dy = Math.max(maxY - minY, 1)
  const scale = Math.min((width - 2 * pad) / dx, (height - 2 * pad) / dy)

  const sx = (x) => pad + (x - minX) * scale
  const sy = (y) => height - pad - (y - minY) * scale

  const memberMap = new Map(result.memberResults.map((item) => [item.member.id, item]))
  const reactionMap = result.reactions || []

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-950 p-4">
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-black text-white">Truss Diagram</h3>
        <span className="rounded-full bg-orange-500/10 px-3 py-1 text-xs font-bold text-orange-300">
          Tension / Compression Visual
        </span>
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full">
        <defs>
          <marker id="loadArrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
            <path d="M0,0 L0,6 L9,3 z" fill="#f97316" />
          </marker>
          <marker id="reactionArrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
            <path d="M0,0 L0,6 L9,3 z" fill="#22c55e" />
          </marker>
        </defs>

        {result.members.map((member) => {
          const a = result.joints.find((joint) => joint.id === member.start)
          const b = result.joints.find((joint) => joint.id === member.end)
          const res = memberMap.get(member.id)

          if (!a || !b) return null

          let color = '#64748b'
          let strokeWidth = 4

          if (res) {
            if (Math.abs(res.force) < 0.001) {
              color = '#64748b'
              strokeWidth = 3
            } else if (res.force > 0) {
              color = '#38bdf8'
              strokeWidth = 5
            } else {
              color = '#f97316'
              strokeWidth = 5
            }
          }

          const mx = (sx(a.x) + sx(b.x)) / 2
          const my = (sy(a.y) + sy(b.y)) / 2

          return (
            <g key={member.id}>
              <line
                x1={sx(a.x)}
                y1={sy(a.y)}
                x2={sx(b.x)}
                y2={sy(b.y)}
                stroke={color}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
              />
              <text
                x={mx + 6}
                y={my - 6}
                fill="#e2e8f0"
                fontSize="13"
                fontWeight="800"
              >
                {memberName(member, result.joints)}
              </text>
            </g>
          )
        })}

        {result.loads.map((load) => {
          const joint = result.joints.find((j) => j.id === load.joint)
          if (!joint) return null

          const mag = Math.sqrt(load.Fx ** 2 + load.Fy ** 2)
          if (mag < 1e-9) return null

          const ux = load.Fx / mag
          const uy = -load.Fy / mag
          const length = 48
          const px = sx(joint.x)
          const py = sy(joint.y)

          return (
            <g key={load.id}>
              <line
                x1={px - ux * length}
                y1={py - uy * length}
                x2={px + ux * 12}
                y2={py + uy * 12}
                stroke="#f97316"
                strokeWidth="4"
                markerEnd="url(#loadArrow)"
              />
              <text
                x={px + ux * 18 + 6}
                y={py + uy * 18}
                fill="#fed7aa"
                fontSize="13"
                fontWeight="800"
              >
                {fmt(mag)} kN
              </text>
            </g>
          )
        })}

        {reactionMap.map((reaction) => {
          if (Math.abs(reaction.value) < 0.001) return null

          const px = sx(reaction.joint.x)
          const py = sy(reaction.joint.y)
          const dir = reaction.value >= 0 ? 1 : -1

          const x2 = reaction.component === 'Rx' ? px + dir * 44 : px
          const y2 = reaction.component === 'Ry' ? py - dir * 44 : py

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
              <text
                x={x2 + 6}
                y={y2 - 4}
                fill="#bbf7d0"
                fontSize="12"
                fontWeight="800"
              >
                {reaction.component} {fmt(reaction.value)}
              </text>
            </g>
          )
        })}

        {result.joints.map((joint) => {
          const px = sx(joint.x)
          const py = sy(joint.y)

          return (
            <g key={joint.id}>
              {joint.support === 'pin' && (
                <>
                  <polygon
                    points={`${px - 17},${py + 32} ${px + 17},${py + 32} ${px},${py + 8}`}
                    fill="#22c55e"
                    opacity="0.9"
                  />
                  <line x1={px - 26} y1={py + 34} x2={px + 26} y2={py + 34} stroke="#22c55e" strokeWidth="3" />
                </>
              )}

              {joint.support === 'rollerY' && (
                <>
                  <circle cx={px} cy={py + 22} r="10" fill="none" stroke="#22c55e" strokeWidth="3" />
                  <line x1={px - 26} y1={py + 34} x2={px + 26} y2={py + 34} stroke="#22c55e" strokeWidth="3" />
                </>
              )}

              {joint.support === 'rollerX' && (
                <>
                  <circle cx={px - 22} cy={py} r="10" fill="none" stroke="#22c55e" strokeWidth="3" />
                  <line x1={px - 34} y1={py - 26} x2={px - 34} y2={py + 26} stroke="#22c55e" strokeWidth="3" />
                </>
              )}

              <circle cx={px} cy={py} r="8" fill="#0f172a" stroke="#e2e8f0" strokeWidth="3" />
              <text x={px + 10} y={py - 10} fill="#ffffff" fontSize="15" fontWeight="900">
                {joint.name}
              </text>
            </g>
          )
        })}

        <text x="18" y="430" fill="#94a3b8" fontSize="13">
          Blue = tension, orange = compression, gray = zero/nearly zero force.
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
            Copy final answer, copy full solution or print/save the report as PDF.
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

function ResultTables({ result, form, updateForm }) {
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
              {result.reactions.map((reaction) => (
                <tr key={`${reaction.joint.id}-${reaction.component}`} className="bg-slate-900/50">
                  <td className="border-b border-slate-800 px-4 py-3 text-slate-200">{reaction.joint.name}</td>
                  <td className="border-b border-slate-800 px-4 py-3 text-orange-300">{reaction.component}</td>
                  <td className="border-b border-slate-800 px-4 py-3 text-slate-300">{fmt(reaction.value)} kN</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
        <h2 className="text-2xl font-black text-white">Member Force Results</h2>

        <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-800">
          <table className="w-full min-w-[820px] text-left text-sm">
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
              {result.memberResults.map((item) => (
                <tr key={item.member.id} className="bg-slate-900/50">
                  <td className="border-b border-slate-800 px-4 py-3 font-bold text-slate-200">{item.name}</td>
                  <td className="border-b border-slate-800 px-4 py-3 text-slate-300">{fmt(item.length)} m</td>
                  <td className="border-b border-slate-800 px-4 py-3 text-orange-300">{fmt(item.force)} kN</td>
                  <td className="border-b border-slate-800 px-4 py-3 text-slate-300">{item.type}</td>
                  <td className="border-b border-slate-800 px-4 py-3 text-slate-300">{fmt(item.stress)} MPa</td>
                  <td className="border-b border-slate-800 px-4 py-3 text-slate-300">{fmt(item.elongationMm)} mm</td>
                </tr>
              ))}
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

          <p className="mt-5 leading-8 text-slate-300">
            Positive axial force means tension. Negative axial force means compression.
            This selected member result can be used directly in method of sections type questions.
          </p>
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
                <p className="mt-2 text-sm leading-6 text-slate-300">{item.reason}</p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function TrussAnalysisPage() {
  const [form, setForm] = useState(getTemplate('triangular'))
  const result = useMemo(() => analyzeTruss(form), [form])

  const updateForm = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const applyTemplate = (key) => {
    setForm(getTemplate(key))
  }

  const updateJoint = (id, key, value) => {
    setForm((prev) => ({
      ...prev,
      joints: prev.joints.map((joint) => (joint.id === id ? { ...joint, [key]: value } : joint)),
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
          name: `J${prev.joints.length + 1}`,
          x: prev.joints.length + 1,
          y: 0,
          support: 'none',
        },
      ],
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
        members: [
          ...prev.members,
          {
            id,
            start,
            end,
            area: 500,
            E: 200,
          },
        ],
      }
    })
  }

  const deleteMember = (id) => {
    setForm((prev) => ({
      ...prev,
      members: prev.members.length > 1 ? prev.members.filter((member) => member.id !== id) : prev.members,
    }))
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
          joint: prev.joints[0]?.id || '',
          Fx: 0,
          Fy: -10,
        },
      ],
    }))
  }

  const deleteLoad = (id) => {
    setForm((prev) => ({
      ...prev,
      loads: prev.loads.length > 1 ? prev.loads.filter((load) => load.id !== id) : prev.loads,
    }))
  }

  return (
    <main className="min-h-screen bg-[#050B1F] px-4 py-8 text-white md:px-8">
      <section className="mx-auto max-w-7xl">
        <div className="mb-8 rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 md:p-8">
          <p className="mb-3 text-sm font-extrabold uppercase tracking-widest text-orange-400">
            Civil Engineering Truss Solver
          </p>

          <h1 className="text-3xl font-black leading-tight md:text-5xl">
            Truss Analysis Solver
          </h1>

          <p className="mt-4 max-w-4xl text-base leading-8 text-slate-300 md:text-lg">
            Analyze 2D pin-jointed trusses with templates, custom joints, members, supports,
            joint loads, member forces, tension/compression results, zero-force members,
            stress, strain and displacement.
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
              <h2 className="text-2xl font-black text-white">Report Setup</h2>

              <div className="mt-6 space-y-5">
                <TextField
                  label="Report Title"
                  value={form.reportTitle}
                  onChange={(value) => updateForm('reportTitle', value)}
                  placeholder="Example: Roof Truss Analysis"
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
                  label="Focus Member"
                  value={form.selectedMember}
                  onChange={(value) => updateForm('selectedMember', value)}
                  helper="Selected member detail is shown separately for exam-style member force questions."
                >
                  {form.members.map((member) => (
                    <option key={member.id} value={member.id}>
                      {memberName(member, form.joints)}
                    </option>
                  ))}
                </SelectField>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
              <h2 className="text-2xl font-black text-white">Quick Templates</h2>

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
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-2xl font-black text-white">Joints</h2>
                <button
                  type="button"
                  onClick={addJoint}
                  className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-black text-white hover:bg-orange-600"
                >
                  + Joint
                </button>
              </div>

              <div className="mt-5 space-y-5">
                {form.joints.map((joint) => (
                  <JointEditor
                    key={joint.id}
                    joint={joint}
                    onChange={updateJoint}
                    onDelete={deleteJoint}
                  />
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-2xl font-black text-white">Members</h2>
                <button
                  type="button"
                  onClick={addMember}
                  className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-black text-white hover:bg-orange-600"
                >
                  + Member
                </button>
              </div>

              <div className="mt-5 space-y-5">
                {form.members.map((member) => (
                  <MemberEditor
                    key={member.id}
                    member={member}
                    joints={form.joints}
                    onChange={updateMember}
                    onDelete={deleteMember}
                  />
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-2xl font-black text-white">Joint Loads</h2>
                <button
                  type="button"
                  onClick={addLoad}
                  className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-black text-white hover:bg-orange-600"
                >
                  + Load
                </button>
              </div>

              <div className="mt-5 space-y-5">
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

          <section className="space-y-6">
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

              {result.error && (
                <div className="mt-5 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm leading-7 text-red-100">
                  {result.error}
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

            <TrussDiagram result={result} />

            {!result.error && (
              <>
                <ResultTables result={result} form={form} updateForm={updateForm} />
                <ZeroForcePanel result={result} />
              </>
            )}

            <div className="grid gap-6 lg:grid-cols-2">
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

              <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
                <h2 className="text-2xl font-black text-white">Exam-Style Final Answer</h2>

                <p className="mt-5 rounded-2xl border border-slate-800 bg-slate-950 p-5 leading-8 text-slate-200">
                  {result.finalAnswer}
                </p>

                <div className="mt-5 rounded-2xl border border-sky-500/20 bg-sky-500/10 p-4 text-sm leading-7 text-slate-300">
                  Internal calculation uses the 2D truss stiffness method, while the output is shown in student-friendly member force format.
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  )
}
