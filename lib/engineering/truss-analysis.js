// 2D Truss Analysis Engine
// Units:
// - Coordinates: m
// - Loads: kN
// - Area: mm²
// - E: N/mm²
// Output force: kN

export function analyzeTruss(params) {
  const {
    joints = [],
    members = [],
    supports = [],
    loads = [],
    defaultE = 200000,
    defaultArea = 1000,
  } = params

  const jointCount = joints.length
  const memberCount = members.length

  const reactionCount = supports.reduce((sum, s) => {
    if (s.type === 'pin') return sum + 2
    if (s.type === 'roller-x') return sum + 1
    if (s.type === 'roller-y') return sum + 1
    return sum
  }, 0)

  const determinacyValue = memberCount + reactionCount - 2 * jointCount

  let determinacy = 'Statically Determinate'
  if (determinacyValue < 0) determinacy = 'Unstable'
  if (determinacyValue > 0) determinacy = 'Statically Indeterminate'

  if (jointCount < 2 || memberCount < 1) {
    return errorResult({
      joints,
      members,
      supports,
      loads,
      determinacy,
      determinacyValue,
      message: 'Minimum 2 joints and 1 member are required.',
    })
  }

  const dof = jointCount * 2
  const K = createMatrix(dof, dof)
  const F = Array(dof).fill(0)

  const jointIndex = new Map()
  joints.forEach((joint, index) => {
    jointIndex.set(joint.id, index)
  })

  for (const load of loads) {
    const index = jointIndex.get(load.joint)
    if (index === undefined) continue

    F[2 * index] += Number(load.fx || 0)
    F[2 * index + 1] += Number(load.fy || 0)
  }

  const memberData = []

  for (const member of members) {
    const start = joints[jointIndex.get(member.start)]
    const end = joints[jointIndex.get(member.end)]

    if (!start || !end) {
      return errorResult({
        joints,
        members,
        supports,
        loads,
        determinacy,
        determinacyValue,
        message: `Invalid member joint reference in member ${member.id}.`,
      })
    }

    const dx = Number(end.x) - Number(start.x)
    const dy = Number(end.y) - Number(start.y)
    const L = Math.sqrt(dx * dx + dy * dy)

    if (L <= 0) {
      return errorResult({
        joints,
        members,
        supports,
        loads,
        determinacy,
        determinacyValue,
        message: `Member ${member.id} has zero length.`,
      })
    }

    const c = dx / L
    const s = dy / L
    const A = Number(member.area || defaultArea)
    const E = Number(member.E || defaultE)

    // Convert AE/L:
    // A mm² × E N/mm² = N
    // L m = 1000L mm
    // stiffness = N/mm
    const k = (A * E) / (L * 1000)

    const local = [
      [c * c, c * s, -c * c, -c * s],
      [c * s, s * s, -c * s, -s * s],
      [-c * c, -c * s, c * c, c * s],
      [-c * s, -s * s, c * s, s * s],
    ].map((row) => row.map((v) => v * k))

    const i = jointIndex.get(member.start)
    const j = jointIndex.get(member.end)

    const map = [2 * i, 2 * i + 1, 2 * j, 2 * j + 1]

    for (let r = 0; r < 4; r++) {
      for (let col = 0; col < 4; col++) {
        K[map[r]][map[col]] += local[r][col]
      }
    }

    memberData.push({
      ...member,
      startJoint: start,
      endJoint: end,
      length: L,
      c,
      s,
      A,
      E,
      map,
    })
  }

  const restrained = new Set()

  for (const support of supports) {
    const index = jointIndex.get(support.joint)
    if (index === undefined) continue

    if (support.type === 'pin') {
      restrained.add(2 * index)
      restrained.add(2 * index + 1)
    }

    if (support.type === 'roller-x') {
      restrained.add(2 * index)
    }

    if (support.type === 'roller-y') {
      restrained.add(2 * index + 1)
    }
  }

  const free = []
  for (let i = 0; i < dof; i++) {
    if (!restrained.has(i)) free.push(i)
  }

  if (free.length === 0) {
    return errorResult({
      joints,
      members,
      supports,
      loads,
      determinacy,
      determinacyValue,
      message: 'All degrees of freedom are restrained.',
    })
  }

  const Kff = subMatrix(K, free, free)
  const Ff = free.map((i) => F[i])

  let Uf

  try {
    Uf = solveLinearSystem(Kff, Ff)
  } catch (error) {
    return errorResult({
      joints,
      members,
      supports,
      loads,
      determinacy,
      determinacyValue,
      message:
        'Truss is unstable or stiffness matrix is singular. Check supports and member arrangement.',
    })
  }

  const U = Array(dof).fill(0)
  free.forEach((globalDof, index) => {
    U[globalDof] = Uf[index]
  })

  const KU = multiplyMatrixVector(K, U)
  const reactionsRaw = KU.map((v, i) => v - F[i])

  const reactions = []

  for (const support of supports) {
    const index = jointIndex.get(support.joint)
    if (index === undefined) continue

    if (support.type === 'pin') {
      reactions.push({
        joint: support.joint,
        direction: 'Rx',
        value: toFixed(reactionsRaw[2 * index] / 1000),
        unit: 'kN',
      })

      reactions.push({
        joint: support.joint,
        direction: 'Ry',
        value: toFixed(reactionsRaw[2 * index + 1] / 1000),
        unit: 'kN',
      })
    }

    if (support.type === 'roller-x') {
      reactions.push({
        joint: support.joint,
        direction: 'Rx',
        value: toFixed(reactionsRaw[2 * index] / 1000),
        unit: 'kN',
      })
    }

    if (support.type === 'roller-y') {
      reactions.push({
        joint: support.joint,
        direction: 'Ry',
        value: toFixed(reactionsRaw[2 * index + 1] / 1000),
        unit: 'kN',
      })
    }
  }

  const memberForces = memberData.map((member) => {
    const [ux1, uy1, ux2, uy2] = member.map.map((i) => U[i])
    const axialExtension =
      -member.c * ux1 -
      member.s * uy1 +
      member.c * ux2 +
      member.s * uy2

    const forceN = ((member.A * member.E) / (member.length * 1000)) * axialExtension
    const forcekN = forceN / 1000

    return {
      member: member.id,
      start: member.start,
      end: member.end,
      length: toFixed(member.length),
      angle: toFixed(Math.atan2(member.s, member.c) * (180 / Math.PI)),
      force: toFixed(forcekN),
      nature:
        forcekN > 0.001
          ? 'Tension'
          : forcekN < -0.001
            ? 'Compression'
            : 'Zero Force',
      stress: toFixed(forceN / member.A),
      formula: 'F = AE/L × ΔL',
    }
  })

  const displacements = joints.map((joint, index) => ({
    joint: joint.id,
    ux: toFixed(U[2 * index]),
    uy: toFixed(U[2 * index + 1]),
    unit: 'mm',
  }))

  const steps = [
    `Number of joints, j = ${jointCount}`,
    `Number of members, m = ${memberCount}`,
    `Number of reaction components, r = ${reactionCount}`,
    `Determinacy check: m + r - 2j = ${determinacyValue}`,
    `Structure type: ${determinacy}`,
    'Global stiffness matrix [K] is assembled using each member stiffness AE/L.',
    'Support restraints are applied to remove fixed degrees of freedom.',
    'Joint displacement vector is solved from [K]{u} = {F}.',
    'Member axial force is calculated using F = AE/L × ΔL.',
    'Positive force means tension and negative force means compression.',
  ]

  return {
    ok: true,

    summary: {
      joints: jointCount,
      members: memberCount,
      reactions: reactionCount,
      determinacy,
      determinacyValue,
    },

    equilibrium: {
      totalHorizontalLoad: toFixed(
        loads.reduce((sum, load) => sum + Number(load.fx || 0), 0)
      ),
      totalVerticalLoad: toFixed(
        loads.reduce((sum, load) => sum + Number(load.fy || 0), 0)
      ),
      equationX: 'ΣFx = 0',
      equationY: 'ΣFy = 0',
    },

    reactions,
    displacements,
    memberForces,

    formulas: {
      determinacy: 'm + r = 2j',
      jointEquilibriumX: 'ΣFx = 0',
      jointEquilibriumY: 'ΣFy = 0',
      stiffnessEquation: '[K]{u} = {F}',
      memberForce: 'F = AE/L × ΔL',
      memberStress: 'σ = P / A',
    },

    steps,

    note:
      'This truss solver uses the 2D stiffness method. Results are for educational use and should be verified before professional design.',
  }
}

function errorResult({
  joints,
  members,
  supports,
  loads,
  determinacy,
  determinacyValue,
  message,
}) {
  return {
    ok: false,
    error: message,

    summary: {
      joints: joints.length,
      members: members.length,
      reactions: supports.length,
      determinacy,
      determinacyValue,
    },

    equilibrium: {
      totalHorizontalLoad: toFixed(
        loads.reduce((sum, load) => sum + Number(load.fx || 0), 0)
      ),
      totalVerticalLoad: toFixed(
        loads.reduce((sum, load) => sum + Number(load.fy || 0), 0)
      ),
      equationX: 'ΣFx = 0',
      equationY: 'ΣFy = 0',
    },

    reactions: [],
    displacements: [],
    memberForces: [],
    formulas: {
      determinacy: 'm + r = 2j',
      jointEquilibriumX: 'ΣFx = 0',
      jointEquilibriumY: 'ΣFy = 0',
      stiffnessEquation: '[K]{u} = {F}',
      memberForce: 'F = AE/L × ΔL',
      memberStress: 'σ = P / A',
    },
    steps: [message],
    note: message,
  }
}

function createMatrix(rows, cols) {
  return Array.from({ length: rows }, () => Array(cols).fill(0))
}

function subMatrix(matrix, rowIndexes, colIndexes) {
  return rowIndexes.map((r) => colIndexes.map((c) => matrix[r][c]))
}

function multiplyMatrixVector(matrix, vector) {
  return matrix.map((row) =>
    row.reduce((sum, value, index) => sum + value * vector[index], 0)
  )
}

function solveLinearSystem(A, b) {
  const n = A.length
  const M = A.map((row, i) => [...row, b[i]])

  for (let i = 0; i < n; i++) {
    let maxRow = i

    for (let k = i + 1; k < n; k++) {
      if (Math.abs(M[k][i]) > Math.abs(M[maxRow][i])) {
        maxRow = k
      }
    }

    if (Math.abs(M[maxRow][i]) < 1e-12) {
      throw new Error('Singular matrix')
    }

    const temp = M[i]
    M[i] = M[maxRow]
    M[maxRow] = temp

    const pivot = M[i][i]

    for (let j = i; j <= n; j++) {
      M[i][j] /= pivot
    }

    for (let k = 0; k < n; k++) {
      if (k === i) continue

      const factor = M[k][i]

      for (let j = i; j <= n; j++) {
        M[k][j] -= factor * M[i][j]
      }
    }
  }

  return M.map((row) => row[n])
}

function toFixed(value, digits = 3) {
  const num = Number(value)

  if (!Number.isFinite(num)) return 0

  return Number(num.toFixed(digits))
}
