// Truss Analysis Engine
// Method: basic determinacy + joint equilibrium helper
// Units: force in kN, length in m

export function analyzeTruss(params) {
  const {
    joints = [],
    members = [],
    supports = [],
    loads = [],
  } = params

  const j = joints.length
  const m = members.length
  const r = supports.reduce((sum, support) => {
    if (support.type === 'pin') return sum + 2
    if (support.type === 'roller') return sum + 1
    return sum
  }, 0)

  const determinacyValue = m + r - 2 * j

  let determinacy = 'Statically Determinate'
  if (determinacyValue < 0) determinacy = 'Unstable'
  if (determinacyValue > 0) determinacy = 'Statically Indeterminate'

  const totalFx = loads.reduce((sum, load) => sum + Number(load.fx || 0), 0)
  const totalFy = loads.reduce((sum, load) => sum + Number(load.fy || 0), 0)

  const supportSummary = supports.map((support) => ({
    joint: support.joint,
    type: support.type,
    reactions:
      support.type === 'pin'
        ? 'Horizontal + Vertical reaction'
        : 'Vertical reaction only',
  }))

  const memberForces = members.map((member) => {
    const start = joints.find((joint) => joint.id === member.start)
    const end = joints.find((joint) => joint.id === member.end)

    if (!start || !end) {
      return {
        member: member.id,
        status: 'Invalid joint reference',
        force: 0,
        nature: 'Unknown',
        length: 0,
        angle: 0,
      }
    }

    const dx = end.x - start.x
    const dy = end.y - start.y
    const length = Math.sqrt(dx * dx + dy * dy)
    const angle = Math.atan2(dy, dx) * (180 / Math.PI)

    return {
      member: member.id,
      start: member.start,
      end: member.end,
      length: Number(length.toFixed(3)),
      angle: Number(angle.toFixed(2)),
      force: 0,
      nature: 'To be solved by joint equilibrium',
      formula: 'ΣFx = 0, ΣFy = 0',
    }
  })

  const steps = [
    `Number of joints, j = ${j}`,
    `Number of members, m = ${m}`,
    `Number of reaction components, r = ${r}`,
    `Determinacy check: m + r = ${m + r}`,
    `2j = ${2 * j}`,
    `m + r - 2j = ${determinacyValue}`,
    `Structure type: ${determinacy}`,
    'At each joint use equilibrium equations: ΣFx = 0 and ΣFy = 0',
    'Positive member force indicates tension.',
    'Negative member force indicates compression.',
  ]

  return {
    summary: {
      joints: j,
      members: m,
      reactions: r,
      determinacy,
      determinacyValue,
    },

    equilibrium: {
      totalHorizontalLoad: Number(totalFx.toFixed(2)),
      totalVerticalLoad: Number(totalFy.toFixed(2)),
      equationX: 'ΣFx = 0',
      equationY: 'ΣFy = 0',
    },

    supports: supportSummary,

    memberForces,

    formulas: {
      determinacy: 'm + r = 2j',
      jointEquilibriumX: 'ΣFx = 0',
      jointEquilibriumY: 'ΣFy = 0',
      memberStress: 'σ = P / A',
    },

    steps,

    note:
      'This module performs truss geometry, determinacy and setup for method of joints. Full numeric member-force solving can be added after UI input is connected.',
  }
}
