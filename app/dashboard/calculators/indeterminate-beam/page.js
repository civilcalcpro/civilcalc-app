'use client'

import { useMemo, useState } from 'react'

const supportTypes = [
  { value: 'free', label: 'Free' },
  { value: 'roller', label: 'Roller' },
  { value: 'pin', label: 'Pin' },
  { value: 'fixed', label: 'Fixed' },
]

const templateInfo = {
  propped: {
    title: 'Propped Cantilever',
    desc: 'Fixed support at left and roller support at right.',
  },
  fixed: {
    title: 'Fixed Beam',
    desc: 'Both ends fixed. Useful for fixed-end moment questions.',
  },
  continuous2: {
    title: 'Two-Span Continuous Beam',
    desc: 'Three supports with two spans.',
  },
  continuous3: {
    title: 'Three-Span Continuous Beam',
    desc: 'Four supports with three spans.',
  },
  custom: {
    title: 'Custom Beam',
    desc: 'Set span count, support type and loads manually.',
  },
}

const topicCards = [
  'Static Indeterminacy',
  'Kinematic Indeterminacy',
  'Released Structure',
  'Force Method Concept',
  'Consistent Deformation',
  'Propped Cantilever',
  'Fixed Beam',
  'Continuous Beam',
  'Point Load',
  'UDL',
  'Moment Load',
  'Support Settlement',
  'Support Reactions',
  'End Moments',
  'SFD',
  'BMD',
  'Deflected Shape',
  'Exam Answer',
]

const defaultLoads = [
  {
    id: 'load-1',
    type: 'point',
    P: 20,
    x: 3,
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
    start: 0,
    end: 6,
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

function cleanHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function roundKey(value) {
  return Number(value.toFixed(6))
}

function makeZeroMatrix(n, m) {
  return Array.from({ length: n }, () => Array(m).fill(0))
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

function getTemplateDefaults(template) {
  if (template === 'fixed') {
    return {
      template,
      spanCount: 1,
      spans: [6, 6, 6, 6],
      supports: ['fixed', 'fixed', 'free', 'free', 'free'],
      settlements: [0, 0, 0, 0, 0],
    }
  }

  if (template === 'continuous2') {
    return {
      template,
      spanCount: 2,
      spans: [4, 4, 6, 6],
      supports: ['pin', 'roller', 'roller', 'free', 'free'],
      settlements: [0, 0, 0, 0, 0],
    }
  }

  if (template === 'continuous3') {
    return {
      template,
      spanCount: 3,
      spans: [4, 4, 4, 6],
      supports: ['pin', 'roller', 'roller', 'roller', 'free'],
      settlements: [0, 0, 0, 0, 0],
    }
  }

  if (template === 'custom') {
    return {
      template,
      spanCount: 2,
      spans: [4, 4, 6, 6],
      supports: ['pin', 'roller', 'roller', 'free', 'free'],
      settlements: [0, 0, 0, 0, 0],
    }
  }

  return {
    template: 'propped',
    spanCount: 1,
    spans: [6, 6, 6, 6],
    supports: ['fixed', 'roller', 'free', 'free', 'free'],
    settlements: [0, 0, 0, 0, 0],
  }
}

function getTotalLength(form) {
  return form.spans
    .slice(0, form.spanCount)
    .reduce((sum, span) => sum + Math.max(toNum(span, 0), 0), 0)
}

function getOriginalSupportNodes(form) {
  const nodes = []
  let x = 0

  for (let i = 0; i <= form.spanCount; i += 1) {
    if (i > 0) {
      x += Math.max(toNum(form.spans[i - 1], 0), 0.001)
    }

    nodes.push({
      originalIndex: i,
      x: roundKey(x),
      support: form.supports[i] || 'free',
      settlementMm: toNum(form.settlements[i], 0),
    })
  }

  return nodes
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

function getLoadLabel(load) {
  if (load.type === 'point') {
    return `Point load ${fmt(load.P, 2)} kN at x = ${fmt(load.x, 2)} m`
  }

  if (load.type === 'udl') {
    return `UDL ${fmt(load.w, 2)} kN/m from ${fmt(load.start, 2)} m to ${fmt(load.end, 2)} m`
  }

  if (load.type === 'uvl') {
    return `UVL/trapezoidal ${fmt(load.w1, 2)} to ${fmt(load.w2, 2)} kN/m from ${fmt(load.start, 2)} m to ${fmt(load.end, 2)} m`
  }

  return `${load.direction === 'clockwise' ? 'Clockwise' : 'Anticlockwise'} moment ${fmt(load.M, 2)} kN·m at x = ${fmt(load.x, 2)} m`
}

function getDistributedIntensity(load, x) {
  if (load.type === 'udl') return load.w

  if (load.type === 'uvl') {
    if (load.length <= 0) return 0
    const ratio = (x - load.start) / load.length
    return load.w1 + (load.w2 - load.w1) * ratio
  }

  return 0
}

function isElementInsideLoad(load, xa, xb) {
  const mid = (xa + xb) / 2
  return mid >= load.start - 1e-8 && mid <= load.end + 1e-8
}

function localBeamStiffness(EI, L) {
  const c = EI / Math.pow(L, 3)

  return [
    [12 * c, 6 * L * c, -12 * c, 6 * L * c],
    [6 * L * c, 4 * L * L * c, -6 * L * c, 2 * L * L * c],
    [-12 * c, -6 * L * c, 12 * c, -6 * L * c],
    [6 * L * c, 2 * L * L * c, -6 * L * c, 4 * L * L * c],
  ]
}

function shapeFunctions(xi, L) {
  return [
    1 - 3 * xi * xi + 2 * xi * xi * xi,
    L * (xi - 2 * xi * xi + xi * xi * xi),
    3 * xi * xi - 2 * xi * xi * xi,
    L * (-xi * xi + xi * xi * xi),
  ]
}

function distributedEquivalentLoad(load, xa, xb) {
  const L = xb - xa
  const f = [0, 0, 0, 0]
  const n = 12
  const h = 1 / n

  for (let i = 0; i <= n; i += 1) {
    const xi = i * h
    const coeff = i === 0 || i === n ? 1 : i % 2 === 0 ? 2 : 4
    const x = xa + xi * L
    const w = getDistributedIntensity(load, x)
    const q = -w
    const N = shapeFunctions(xi, L)
    const factor = (h / 3) * L * coeff

    for (let j = 0; j < 4; j += 1) {
      f[j] += N[j] * q * factor
    }
  }

  return f
}

function gaussianSolve(A, b) {
  const n = A.length
  const M = A.map((row, i) => [...row, b[i]])

  for (let k = 0; k < n; k += 1) {
    let pivot = k

    for (let i = k + 1; i < n; i += 1) {
      if (Math.abs(M[i][k]) > Math.abs(M[pivot][k])) {
        pivot = i
      }
    }

    if (Math.abs(M[pivot][k]) < 1e-10) {
      throw new Error('The beam is unstable or support conditions are insufficient.')
    }

    if (pivot !== k) {
      const temp = M[k]
      M[k] = M[pivot]
      M[pivot] = temp
    }

    const pivotValue = M[k][k]

    for (let j = k; j <= n; j += 1) {
      M[k][j] /= pivotValue
    }

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

function multiplyMatrixVector(A, x) {
  return A.map((row) => row.reduce((sum, value, i) => sum + value * x[i], 0))
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

    return {
      W: integrateLoad(b) - integrateLoad(a),
      firstMoment: integrateMoment(b) - integrateMoment(a),
    }
  }

  return { W: 0, firstMoment: 0 }
}

function buildMesh(form, loads) {
  const supportNodes = getOriginalSupportNodes(form)
  const L = getTotalLength(form)

  const points = [0, L]

  supportNodes.forEach((node) => points.push(node.x))

  loads.forEach((load) => {
    if (load.type === 'point' || load.type === 'moment') {
      points.push(load.x)
    }

    if (load.type === 'udl' || load.type === 'uvl') {
      points.push(load.start, load.end)
    }
  })

  const uniquePoints = [...new Set(points.map((x) => roundKey(clamp(x, 0, L))))].sort((a, b) => a - b)

  const supportMap = new Map()

  supportNodes.forEach((node) => {
    supportMap.set(roundKey(node.x), node)
  })

  const nodes = uniquePoints.map((x, index) => {
    const supportData = supportMap.get(roundKey(x))

    return {
      id: index,
      x,
      support: supportData?.support || 'free',
      settlementMm: supportData?.settlementMm || 0,
      isOriginalSupport: Boolean(supportData),
      originalIndex: supportData?.originalIndex ?? null,
    }
  })

  const elements = []

  for (let i = 0; i < nodes.length - 1; i += 1) {
    const length = nodes[i + 1].x - nodes[i].x

    if (length > 1e-8) {
      elements.push({
        id: i,
        i,
        j: i + 1,
        xa: nodes[i].x,
        xb: nodes[i + 1].x,
        L: length,
      })
    }
  }

  return { nodes, elements, supportNodes, L }
}

function solveIndeterminateBeam(form) {
  const totalLength = getTotalLength(form)

  if (totalLength <= 0) {
    throw new Error('Total beam length must be greater than zero.')
  }

  const loads = form.loads.map((load) => normalizeLoad(load, totalLength))
  const E = Math.max(toNum(form.E, 200), 0.001)
  const I = Math.max(toNum(form.I, 300), 0.001)
  const EI = E * I

  const mesh = buildMesh(form, loads)
  const { nodes, elements, L } = mesh
  const ndof = nodes.length * 2

  const K = makeZeroMatrix(ndof, ndof)
  const F = Array(ndof).fill(0)
  const elementRecords = []

  elements.forEach((element) => {
    const kLocal = localBeamStiffness(EI, element.L)
    const fLocal = [0, 0, 0, 0]

    loads.forEach((load) => {
      if ((load.type === 'udl' || load.type === 'uvl') && isElementInsideLoad(load, element.xa, element.xb)) {
        const fDist = distributedEquivalentLoad(load, element.xa, element.xb)

        for (let a = 0; a < 4; a += 1) {
          fLocal[a] += fDist[a]
        }
      }
    })

    const dofs = [2 * element.i, 2 * element.i + 1, 2 * element.j, 2 * element.j + 1]

    for (let a = 0; a < 4; a += 1) {
      F[dofs[a]] += fLocal[a]

      for (let b = 0; b < 4; b += 1) {
        K[dofs[a]][dofs[b]] += kLocal[a][b]
      }
    }

    elementRecords.push({
      ...element,
      kLocal,
      fLocal,
      dofs,
    })
  })

  loads.forEach((load) => {
    if (load.type !== 'point' && load.type !== 'moment') return

    const nodeIndex = nodes.findIndex((node) => Math.abs(node.x - load.x) < 1e-6)

    if (nodeIndex < 0) return

    if (load.type === 'point') {
      F[2 * nodeIndex] += -load.P
    }

    if (load.type === 'moment') {
      F[2 * nodeIndex + 1] += load.direction === 'clockwise' ? -load.M : load.M
    }
  })

  const known = []
  const knownValues = {}
  let reactionCount = 0

  nodes.forEach((node) => {
    const vDof = 2 * node.id
    const tDof = 2 * node.id + 1

    if (node.support === 'roller' || node.support === 'pin') {
      known.push(vDof)
      knownValues[vDof] = -node.settlementMm / 1000
      reactionCount += 1
    }

    if (node.support === 'fixed') {
      known.push(vDof, tDof)
      knownValues[vDof] = -node.settlementMm / 1000
      knownValues[tDof] = 0
      reactionCount += 2
    }
  })

  const knownSet = new Set(known)
  const free = Array.from({ length: ndof }, (_, i) => i).filter((dof) => !knownSet.has(dof))

  if (free.length === ndof) {
    throw new Error('At least one support is required.')
  }

  const d = Array(ndof).fill(0)

  known.forEach((dof) => {
    d[dof] = knownValues[dof] || 0
  })

  const Kff = free.map((i) => free.map((j) => K[i][j]))
  const rhs = free.map((i) => {
    const knownEffect = known.reduce((sum, j) => sum + K[i][j] * d[j], 0)
    return F[i] - knownEffect
  })

  const df = gaussianSolve(Kff, rhs)

  free.forEach((dof, index) => {
    d[dof] = df[index]
  })

  const Kd = multiplyMatrixVector(K, d)
  const R = Kd.map((value, index) => value - F[index])

  const reactions = nodes
    .filter((node) => node.support !== 'free')
    .map((node) => {
      const vDof = 2 * node.id
      const tDof = 2 * node.id + 1

      return {
        node: node.id + 1,
        support: node.support,
        x: node.x,
        vertical: node.support === 'roller' || node.support === 'pin' || node.support === 'fixed' ? R[vDof] : 0,
        moment: node.support === 'fixed' ? R[tDof] : 0,
        settlementMm: node.settlementMm,
      }
    })

  const elementForces = elementRecords.map((element) => {
    const dLocal = element.dofs.map((dof) => d[dof])
    const kd = element.kLocal.map((row) => row.reduce((sum, value, i) => sum + value * dLocal[i], 0))
    const qLocal = kd.map((value, i) => value - element.fLocal[i])

    return {
      id: element.id + 1,
      from: nodes[element.i].id + 1,
      to: nodes[element.j].id + 1,
      xa: element.xa,
      xb: element.xb,
      length: element.L,
      shearLeft: qLocal[0],
      momentLeft: qLocal[1],
      shearRight: qLocal[2],
      momentRight: qLocal[3],
    }
  })

  const diagramAt = (rawX) => {
    const x = clamp(rawX, 0, L)
    let shear = 0
    let moment = 0

    reactions.forEach((reaction) => {
      if (x >= reaction.x - 1e-8) {
        shear += reaction.vertical
        moment += reaction.vertical * (x - reaction.x)
        moment += -reaction.moment
      }
    })

    loads.forEach((load) => {
      if (load.type === 'point' && x >= load.x - 1e-8) {
        shear -= load.P
        moment -= load.P * (x - load.x)
      }

      if ((load.type === 'udl' || load.type === 'uvl') && x > load.start) {
        const part = partialDistributedLoad(load, load.start, Math.min(x, load.end))
        shear -= part.W
        moment -= part.W * x - part.firstMoment
      }

      if (load.type === 'moment' && x >= load.x - 1e-8) {
        moment += getMomentSign(load) * load.M
      }
    })

    return { shear, moment }
  }

  const displacementAt = (rawX) => {
    const x = clamp(rawX, 0, L)
    let element = elements.find((item) => x >= item.xa - 1e-8 && x <= item.xb + 1e-8)

    if (!element) {
      element = elements[elements.length - 1]
    }

    const xi = element.L <= 0 ? 0 : (x - element.xa) / element.L
    const N = shapeFunctions(xi, element.L)
    const dLocal = [d[2 * element.i], d[2 * element.i + 1], d[2 * element.j], d[2 * element.j + 1]]
    const vUp = N.reduce((sum, value, i) => sum + value * dLocal[i], 0)

    return {
      vUp,
      deflectionMm: -vUp * 1000,
    }
  }

  const diagramValues = []

  for (let i = 0; i <= 520; i += 1) {
    const x = (L * i) / 520
    const sm = diagramAt(x)
    const disp = displacementAt(x)

    diagramValues.push({
      x,
      shear: sm.shear,
      moment: sm.moment,
      deflectionMm: disp.deflectionMm,
    })
  }

  nodes.forEach((node) => {
    const sm = diagramAt(node.x)
    const disp = displacementAt(node.x)

    diagramValues.push({
      x: node.x,
      shear: sm.shear,
      moment: sm.moment,
      deflectionMm: disp.deflectionMm,
    })
  })

  const sortedValues = diagramValues
    .sort((a, b) => a.x - b.x)
    .filter((item, index, arr) => index === 0 || Math.abs(item.x - arr[index - 1].x) > 1e-6)

  const maxBM = sortedValues.reduce((best, item) =>
    Math.abs(item.moment) > Math.abs(best.moment) ? item : best
  )

  const maxSF = sortedValues.reduce((best, item) =>
    Math.abs(item.shear) > Math.abs(best.shear) ? item : best
  )

  const maxDeflection = sortedValues.reduce((best, item) =>
    Math.abs(item.deflectionMm) > Math.abs(best.deflectionMm) ? item : best
  )

  const staticIndeterminacy = Math.max(0, reactionCount - 2)
  const kinematicIndeterminacy = free.length

  const loadLabels = loads.map((load, index) => `${index + 1}. ${getLoadLabel(load)}`)

  const summary = [
    { label: 'Static Indeterminacy', value: `${staticIndeterminacy}` },
    { label: 'Kinematic Indeterminacy', value: `${kinematicIndeterminacy}` },
    { label: 'Max |SF|', value: `${fmt(maxSF.shear, 3)} kN` },
    { label: 'Max |BM|', value: `${fmt(maxBM.moment, 3)} kN·m` },
    { label: 'Max Deflection', value: `${fmt(maxDeflection.deflectionMm, 4)} mm` },
    { label: 'Total Nodes', value: `${nodes.length}` },
  ]

  const formulas = [
    'Beam element stiffness method: {F} = [K]{d} + {FEM}',
    'Each beam node has two degrees of freedom: vertical displacement v and rotation θ',
    'Fixed support restrains v and θ',
    'Pin/Roller support restrains v and allows θ',
    'Static indeterminacy for vertical beam problems: Ds = r - 2',
    'Kinematic indeterminacy equals number of unknown joint displacement degrees of freedom',
    'Support reactions are calculated from R = [K]{d} - {F}',
    'SFD and BMD are generated using final support reactions and applied loads',
  ]

  const steps = [
    `Selected template: ${templateInfo[form.template]?.title || 'Custom Beam'}.`,
    `Total beam length = ${fmt(L, 3)} m with ${form.spanCount} span(s).`,
    `E = ${fmt(E, 3)} GPa and I = ${fmt(I, 3)} ×10⁶ mm⁴, so EI = ${fmt(EI, 3)} kN·m².`,
    `Supports are converted into restrained and free degrees of freedom.`,
    `Loads are converted into equivalent nodal loads and fixed-end actions.`,
    `Global stiffness matrix [K] is assembled from beam elements.`,
    `Unknown displacements are solved using [Kff]{df} = {Ff} - [Kfk]{dk}.`,
    `Support reactions are recovered from R = [K]{d} - {F}.`,
    `Degree of static indeterminacy = ${staticIndeterminacy}.`,
    `Maximum bending moment = ${fmt(maxBM.moment, 3)} kN·m at x = ${fmt(maxBM.x, 3)} m.`,
    `Maximum deflection = ${fmt(maxDeflection.deflectionMm, 4)} mm at x = ${fmt(maxDeflection.x, 3)} m.`,
  ]

  const finalAnswer = `For the selected indeterminate beam, degree of static indeterminacy is ${staticIndeterminacy}. Maximum bending moment is ${fmt(maxBM.moment, 3)} kN·m at x = ${fmt(maxBM.x, 3)} m and maximum deflection is ${fmt(maxDeflection.deflectionMm, 4)} mm at x = ${fmt(maxDeflection.x, 3)} m. Final reactions and member end moments are shown in the result tables.`

  return {
    error: null,
    template: form.template,
    title: `${templateInfo[form.template]?.title || 'Custom Beam'} Result`,
    L,
    E,
    I,
    EI,
    loads,
    nodes,
    elements,
    supports: getOriginalSupportNodes(form),
    reactions,
    elementForces,
    diagramValues: sortedValues,
    maxBM,
    maxSF,
    maxDeflection,
    staticIndeterminacy,
    kinematicIndeterminacy,
    summary,
    formulas,
    steps,
    finalAnswer,
    loadLabels,
  }
}

function solveSafely(form) {
  try {
    return solveIndeterminateBeam(form)
  } catch (error) {
    return {
      error: error.message || 'Unable to solve this beam.',
      title: 'Unable to Solve',
      summary: [
        { label: 'Status', value: 'Check Input' },
        { label: 'Issue', value: error.message || 'Invalid beam model' },
      ],
      formulas: [
        'A stable beam model needs sufficient supports.',
        'Pin/Roller support restrains vertical displacement.',
        'Fixed support restrains vertical displacement and rotation.',
      ],
      steps: [
        'Check support conditions.',
        'Avoid all-free structures.',
        'Make sure total beam length is greater than zero.',
        'Use at least one stable support arrangement.',
      ],
      finalAnswer: 'The beam could not be solved with the current input. Please check supports, span length and loading.',
      diagramValues: [],
      loads: [],
      nodes: [],
      reactions: [],
      elementForces: [],
    }
  }
}

function buildPlainReport(result, form) {
  const reactionText = result.reactions
    .map(
      (r) =>
        `Node ${r.node} at x=${fmt(r.x, 3)} m | ${r.support} | V=${fmt(r.vertical, 3)} kN | M=${fmt(r.moment, 3)} kN·m`
    )
    .join('\n')

  const elementText = result.elementForces
    .map(
      (e) =>
        `Element ${e.id} (${fmt(e.xa, 3)} m to ${fmt(e.xb, 3)} m) | M left=${fmt(e.momentLeft, 3)} kN·m | M right=${fmt(e.momentRight, 3)} kN·m`
    )
    .join('\n')

  return `
${form.reportTitle || 'Indeterminate Beam Report'}
Prepared By: ${form.preparedBy || '-'}
Template: ${templateInfo[form.template]?.title || 'Custom Beam'}

RESULT SUMMARY
${result.summary.map((item) => `${item.label}: ${item.value}`).join('\n')}

LOADS
${result.loadLabels?.join('\n') || '-'}

SUPPORT REACTIONS
${reactionText || '-'}

MEMBER END FORCES
${elementText || '-'}

FORMULAS USED
${result.formulas.map((formula, index) => `${index + 1}. ${formula}`).join('\n')}

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

  const reactionRows = result.reactions
    .map(
      (r) => `
        <tr>
          <td>Node ${r.node}</td>
          <td>${fmt(r.x, 3)} m</td>
          <td>${cleanHtml(r.support)}</td>
          <td>${fmt(r.vertical, 3)} kN</td>
          <td>${fmt(r.moment, 3)} kN·m</td>
        </tr>
      `
    )
    .join('')

  const elementRows = result.elementForces
    .map(
      (e) => `
        <tr>
          <td>Element ${e.id}</td>
          <td>${fmt(e.xa, 3)} m - ${fmt(e.xb, 3)} m</td>
          <td>${fmt(e.momentLeft, 3)} kN·m</td>
          <td>${fmt(e.momentRight, 3)} kN·m</td>
        </tr>
      `
    )
    .join('')

  const formulas = result.formulas.map((item) => `<li>${cleanHtml(item)}</li>`).join('')
  const steps = result.steps.map((item, index) => `<li><strong>Step ${index + 1}:</strong> ${cleanHtml(item)}</li>`).join('')

  return `
<!doctype html>
<html>
<head>
  <title>${cleanHtml(form.reportTitle || 'Indeterminate Beam Report')}</title>
  <meta charset="utf-8" />
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 28px;
      color: #111827;
      background: #fff;
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

    td, th {
      padding: 10px;
      border: 1px solid #cbd5e1;
      text-align: left;
    }

    th {
      background: #0f172a;
      color: white;
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
      <h1>${cleanHtml(form.reportTitle || 'Indeterminate Beam Report')}</h1>
      <div class="sub">
        Prepared By: ${cleanHtml(form.preparedBy || '-')}<br/>
        Template: ${cleanHtml(templateInfo[form.template]?.title || 'Custom Beam')}<br/>
        Method: Beam stiffness method with indeterminacy explanation
      </div>
    </div>

    <h2>Result Summary</h2>
    <table><tbody>${summaryRows}</tbody></table>

    <h2>Support Reactions</h2>
    <table>
      <thead>
        <tr>
          <th>Node</th>
          <th>x</th>
          <th>Support</th>
          <th>Vertical Reaction</th>
          <th>Moment Reaction</th>
        </tr>
      </thead>
      <tbody>${reactionRows}</tbody>
    </table>

    <h2>Member End Moments</h2>
    <table>
      <thead>
        <tr>
          <th>Element</th>
          <th>Range</th>
          <th>Left End Moment</th>
          <th>Right End Moment</th>
        </tr>
      </thead>
      <tbody>${elementRows}</tbody>
    </table>

    <h2>Formulas Used</h2>
    <ol>${formulas}</ol>

    <h2>Step-by-Step Solution</h2>
    <ol>${steps}</ol>

    <h2>Final Answer</h2>
    <div class="answer">${cleanHtml(result.finalAnswer)}</div>

    <div class="footer">Generated using CivilCalc Pro Indeterminate Beam Solver.</div>
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
            {load.type === 'uvl' && 'UVL / Trapezoidal'}
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
              helper="Downward point load."
              min="0"
            />

            <NumberField
              label="Position x"
              value={load.x}
              onChange={(value) => update('x', value)}
              suffix="m"
              helper={`Position from left support. Keep between 0 and ${fmt(L, 2)} m.`}
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
              min="0"
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <NumberField
                label="Start Position"
                value={load.start}
                onChange={(value) => update('start', value)}
                suffix="m"
                min="0"
              />

              <NumberField
                label="End Position"
                value={load.end}
                onChange={(value) => update('end', value)}
                suffix="m"
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
                min="0"
              />

              <NumberField
                label="End Intensity w2"
                value={load.w2}
                onChange={(value) => update('w2', value)}
                suffix="kN/m"
                min="0"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <NumberField
                label="Start Position"
                value={load.start}
                onChange={(value) => update('start', value)}
                suffix="m"
                min="0"
              />

              <NumberField
                label="End Position"
                value={load.end}
                onChange={(value) => update('end', value)}
                suffix="m"
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
              min="0"
            />

            <NumberField
              label="Position x"
              value={load.x}
              onChange={(value) => update('x', value)}
              suffix="m"
              min="0"
            />

            <SelectField
              label="Moment Direction"
              value={load.direction}
              onChange={(value) => update('direction', value)}
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

function BeamLoadingDiagram({ result }) {
  if (result.error) return null

  const x0 = 70
  const x1 = 570
  const y = 130
  const L = result.L || 1
  const mapX = (x) => x0 + (x / L) * (x1 - x0)

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-950 p-4">
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-lg font-black text-white">Beam Loading Diagram</h3>
          <p className="mt-1 text-xs leading-5 text-slate-400">
            Supports, loads and span positions used for stiffness analysis.
          </p>
        </div>

        <span className="rounded-xl border border-orange-500/20 bg-orange-500/10 px-3 py-2 text-xs font-bold text-orange-200">
          L = {fmt(result.L, 3)} m
        </span>
      </div>

      <svg viewBox="0 0 640 290" className="h-auto w-full">
        <line x1={x0} y1={y} x2={x1} y2={y} stroke="#cbd5e1" strokeWidth="7" strokeLinecap="round" />

        {result.nodes
          .filter((node) => node.support !== 'free')
          .map((node) => {
            const sx = mapX(node.x)

            if (node.support === 'fixed') {
              return (
                <g key={node.id}>
                  <rect x={sx - 28} y={y - 58} width="24" height="116" fill="#38bdf8" opacity="0.9" />
                  {[-45, -25, -5, 15, 35, 55].map((dy) => (
                    <line
                      key={dy}
                      x1={sx - 40}
                      y1={y + dy + 12}
                      x2={sx - 4}
                      y2={y + dy - 12}
                      stroke="#0f172a"
                      strokeWidth="2"
                    />
                  ))}
                  <text x={sx - 28} y={y + 82} fill="#e2e8f0" fontSize="12" fontWeight="800">
                    Fixed
                  </text>
                </g>
              )
            }

            if (node.support === 'pin') {
              return (
                <g key={node.id}>
                  <polygon points={`${sx - 18},${y + 35} ${sx + 18},${y + 35} ${sx},${y + 6}`} fill="#38bdf8" />
                  <line x1={sx - 30} y1={y + 38} x2={sx + 30} y2={y + 38} stroke="#38bdf8" strokeWidth="3" />
                  <text x={sx - 15} y={y + 66} fill="#e2e8f0" fontSize="12" fontWeight="800">
                    Pin
                  </text>
                </g>
              )
            }

            return (
              <g key={node.id}>
                <circle cx={sx} cy={y + 24} r="12" fill="none" stroke="#38bdf8" strokeWidth="3" />
                <line x1={sx - 30} y1={y + 38} x2={sx + 30} y2={y + 38} stroke="#38bdf8" strokeWidth="3" />
                <text x={sx - 20} y={y + 66} fill="#e2e8f0" fontSize="12" fontWeight="800">
                  Roller
                </text>
              </g>
            )
          })}

        {result.loads.map((load, index) => {
          if (load.type === 'point') {
            const lx = mapX(load.x)

            return (
              <g key={load.id}>
                <line x1={lx} y1="42" x2={lx} y2={y - 8} stroke="#f97316" strokeWidth="4" />
                <polygon points={`${lx - 9},${y - 18} ${lx + 9},${y - 18} ${lx},${y - 4}`} fill="#f97316" />
                <text x={lx - 28} y="30" fill="#fed7aa" fontSize="13" fontWeight="900">
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
                <line x1={sx} y1="48" x2={ex} y2="48" stroke="#f97316" strokeWidth="3" />
                {positions.map((px) => (
                  <g key={px}>
                    <line x1={px} y1="50" x2={px} y2={y - 8} stroke="#f97316" strokeWidth="2.5" />
                    <polygon points={`${px - 6},${y - 18} ${px + 6},${y - 18} ${px},${y - 6}`} fill="#f97316" />
                  </g>
                ))}
                <text x={sx + 6} y="38" fill="#fed7aa" fontSize="13" fontWeight="900">
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

            return (
              <g key={load.id}>
                <polygon
                  points={`${sx},${y - 8} ${sx},${y - h1} ${ex},${y - h2} ${ex},${y - 8}`}
                  fill="rgba(249,115,22,0.12)"
                  stroke="#f97316"
                  strokeWidth="2"
                />
                <text x={sx + 6} y="35" fill="#fed7aa" fontSize="13" fontWeight="900">
                  UVL {fmt(load.w1, 1)}→{fmt(load.w2, 1)}
                </text>
              </g>
            )
          }

          const lx = mapX(load.x)

          return (
            <g key={load.id}>
              <path
                d={`M ${lx - 25} ${y - 35} A 26 26 0 1 1 ${lx + 20} ${y - 15}`}
                fill="none"
                stroke="#a78bfa"
                strokeWidth="4"
              />
              <text x={lx - 32} y={y - 55} fill="#ddd6fe" fontSize="13" fontWeight="900">
                M={fmt(load.M, 1)}
              </text>
            </g>
          )
        })}

        <line x1={x0} y1={y + 105} x2={x1} y2={y + 105} stroke="#64748b" strokeWidth="2" />
        <line x1={x0} y1={y + 97} x2={x0} y2={y + 113} stroke="#64748b" strokeWidth="2" />
        <line x1={x1} y1={y + 97} x2={x1} y2={y + 113} stroke="#64748b" strokeWidth="2" />

        <text x={(x0 + x1) / 2 - 20} y={y + 130} fill="#f97316" fontSize="14" fontWeight="900">
          Total length = {fmt(result.L, 2)} m
        </text>
      </svg>
    </div>
  )
}

function CurveDiagram({ result, type }) {
  if (result.error || !result.diagramValues?.length) return null

  const x0 = 70
  const x1 = 570
  const yBase = 115
  const amp = 65
  const L = result.L || 1
  const mapX = (x) => x0 + (x / L) * (x1 - x0)

  const meta = {
    sfd: {
      title: 'Shear Force Diagram',
      color: '#f97316',
      note: 'Final SFD using solved support reactions.',
      unit: 'kN',
      digits: 3,
      key: 'shear',
      label: 'SF',
    },
    bmd: {
      title: 'Bending Moment Diagram',
      color: '#38bdf8',
      note: 'Final BMD including end moments and continuity effects.',
      unit: 'kN·m',
      digits: 3,
      key: 'moment',
      label: 'BM',
    },
    deflection: {
      title: 'Deflected Shape',
      color: '#22c55e',
      note: 'Positive value is shown as downward deflection.',
      unit: 'mm',
      digits: 4,
      key: 'deflectionMm',
      label: 'y',
    },
  }[type]

  const values = result.diagramValues
  const getValue = (item) => item[meta.key]
  const rawMaxAbs = Math.max(...values.map((item) => Math.abs(getValue(item))))
  const maxAbs = rawMaxAbs > 1e-12 ? rawMaxAbs : 1

  const points = values
    .map((item) => {
      const value = getValue(item)
      const y =
        type === 'sfd'
          ? yBase - (value / maxAbs) * amp
          : yBase + (value / maxAbs) * amp

      return `${mapX(item.x)},${y}`
    })
    .join(' ')

  const maxPoint = values.reduce((best, item) => (getValue(item) > getValue(best) ? item : best))
  const minPoint = values.reduce((best, item) => (getValue(item) < getValue(best) ? item : best))
  const maxAbsPoint = values.reduce((best, item) =>
    Math.abs(getValue(item)) > Math.abs(getValue(best)) ? item : best
  )

  const pointY = (item) => {
    const value = getValue(item)
    return type === 'sfd' ? yBase - (value / maxAbs) * amp : yBase + (value / maxAbs) * amp
  }

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-950 p-4">
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-lg font-black text-white">{meta.title}</h3>
          <p className="mt-1 text-xs leading-5 text-slate-400">{meta.note}</p>
        </div>

        <div className="rounded-xl border border-orange-500/20 bg-orange-500/10 px-3 py-2 text-xs font-bold text-orange-200">
          Max |{meta.label}| = {fmt(getValue(maxAbsPoint), meta.digits)} {meta.unit}
        </div>
      </div>

      <svg viewBox="0 0 640 280" className="h-auto w-full">
        <line x1={x0} y1={yBase} x2={x1} y2={yBase} stroke="#64748b" strokeWidth="2" strokeDasharray="6 6" />
        <line x1={x0} y1="30" x2={x0} y2="190" stroke="#334155" strokeWidth="2" />
        <line x1={x1} y1="30" x2={x1} y2="190" stroke="#334155" strokeWidth="2" />

        <polyline
          points={points}
          fill="none"
          stroke={meta.color}
          strokeWidth="4"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        <circle cx={mapX(maxPoint.x)} cy={pointY(maxPoint)} r="4" fill="#22c55e" stroke="#020617" strokeWidth="2" />
        <circle cx={mapX(minPoint.x)} cy={pointY(minPoint)} r="4" fill="#f97316" stroke="#020617" strokeWidth="2" />

        <text x={x0 - 10} y="214" fill="#cbd5e1" fontSize="13" fontWeight="800">
          0
        </text>

        <text x={x1 - 18} y="214" fill="#cbd5e1" fontSize="13" fontWeight="800">
          L
        </text>

        <text x="18" y="238" fill="#94a3b8" fontSize="13">
          Max {meta.label} = {fmt(getValue(maxPoint), meta.digits)} {meta.unit} at x = {fmt(maxPoint.x, 3)} m
        </text>

        <text x="18" y="258" fill="#94a3b8" fontSize="13">
          Min {meta.label} = {fmt(getValue(minPoint), meta.digits)} {meta.unit} at x = {fmt(minPoint.x, 3)} m
        </text>

        <text x="360" y="238" fill="#facc15" fontSize="13" fontWeight="900">
          Max absolute point:
        </text>

        <text x="360" y="258" fill="#facc15" fontSize="13" fontWeight="900">
          x = {fmt(maxAbsPoint.x, 3)} m, {meta.label} = {fmt(getValue(maxAbsPoint), meta.digits)} {meta.unit}
        </text>
      </svg>
    </div>
  )
}

function MethodPanel({ result }) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
      <h2 className="text-2xl font-black text-white">Method Used</h2>
      <p className="mt-2 text-sm leading-6 text-slate-400">
        This solver uses beam stiffness method internally and explains the same concept using force method,
        released structure and consistent deformation.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {[
          ['1. Indeterminacy', 'Count support restraints and compare with equilibrium equations.'],
          ['2. Released Structure', 'Extra restraints are conceptually released to form a determinate basic structure.'],
          ['3. Compatibility', 'Displacement at redundant restraint must satisfy support condition.'],
          ['4. Stiffness Matrix', 'Beam elements are assembled into global [K].'],
          ['5. Reactions', 'Final reactions are recovered after solving joint displacements.'],
          ['6. SFD/BMD', 'Final diagrams are generated using solved reactions and applied loads.'],
        ].map((item) => (
          <div key={item[0]} className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
            <p className="font-black text-orange-300">{item[0]}</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">{item[1]}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-2xl border border-sky-500/20 bg-sky-500/10 p-4 text-sm leading-7 text-slate-300">
        Static indeterminacy = {result.staticIndeterminacy ?? '-'} and kinematic indeterminacy ={' '}
        {result.kinematicIndeterminacy ?? '-'}. For exam presentation, you can write the force-method concept
        first and then use stiffness-based final reactions for accurate result checking.
      </div>
    </div>
  )
}

function ReactionTable({ result }) {
  if (result.error) return null

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
      <h2 className="text-2xl font-black text-white">Support Reactions</h2>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-800">
        <table className="w-full min-w-[820px] border-collapse text-left">
          <thead className="bg-slate-950">
            <tr>
              <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">Node</th>
              <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">x</th>
              <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">Support</th>
              <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">Vertical Reaction</th>
              <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">Moment Reaction</th>
              <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">Settlement</th>
            </tr>
          </thead>

          <tbody>
            {result.reactions.map((reaction) => (
              <tr key={`${reaction.node}-${reaction.x}`} className="bg-slate-900/50">
                <td className="border-b border-slate-800 px-4 py-3 text-sm font-bold text-slate-200">
                  Node {reaction.node}
                </td>
                <td className="border-b border-slate-800 px-4 py-3 text-sm text-orange-300">
                  {fmt(reaction.x, 3)} m
                </td>
                <td className="border-b border-slate-800 px-4 py-3 text-sm text-slate-300">
                  {reaction.support}
                </td>
                <td className="border-b border-slate-800 px-4 py-3 text-sm text-slate-300">
                  {fmt(reaction.vertical, 3)} kN
                </td>
                <td className="border-b border-slate-800 px-4 py-3 text-sm text-slate-300">
                  {fmt(reaction.moment, 3)} kN·m
                </td>
                <td className="border-b border-slate-800 px-4 py-3 text-sm text-slate-300">
                  {fmt(reaction.settlementMm, 3)} mm
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function ElementForceTable({ result }) {
  if (result.error) return null

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
      <h2 className="text-2xl font-black text-white">Member End Forces</h2>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-800">
        <table className="w-full min-w-[900px] border-collapse text-left">
          <thead className="bg-slate-950">
            <tr>
              <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">Element</th>
              <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">Range</th>
              <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">Left Shear</th>
              <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">Left Moment</th>
              <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">Right Shear</th>
              <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">Right Moment</th>
            </tr>
          </thead>

          <tbody>
            {result.elementForces.map((element) => (
              <tr key={element.id} className="bg-slate-900/50">
                <td className="border-b border-slate-800 px-4 py-3 text-sm font-bold text-slate-200">
                  Element {element.id}
                </td>
                <td className="border-b border-slate-800 px-4 py-3 text-sm text-orange-300">
                  {fmt(element.xa, 3)} m to {fmt(element.xb, 3)} m
                </td>
                <td className="border-b border-slate-800 px-4 py-3 text-sm text-slate-300">
                  {fmt(element.shearLeft, 3)} kN
                </td>
                <td className="border-b border-slate-800 px-4 py-3 text-sm text-slate-300">
                  {fmt(element.momentLeft, 3)} kN·m
                </td>
                <td className="border-b border-slate-800 px-4 py-3 text-sm text-slate-300">
                  {fmt(element.shearRight, 3)} kN
                </td>
                <td className="border-b border-slate-800 px-4 py-3 text-sm text-slate-300">
                  {fmt(element.momentRight, 3)} kN·m
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

function FormulaAndFinal({ result }) {
  return (
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

        <div className="mt-5 rounded-2xl border border-sky-500/20 bg-sky-500/10 p-4 text-sm leading-7 text-slate-300">
          Note: This tool solves the final values using stiffness method. The explanation panel connects it with force method and consistent deformation.
        </div>
      </div>
    </div>
  )
}

function StepByStep({ result }) {
  return (
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
  )
}

export default function IndeterminateBeamPage() {
  const defaults = getTemplateDefaults('propped')

  const [form, setForm] = useState({
    reportTitle: 'Indeterminate Beam Analysis',
    preparedBy: '',
    ...defaults,
    E: 200,
    I: 300,
    loads: defaultLoads,
  })

  const result = useMemo(() => solveSafely(form), [form])

  const totalLength = getTotalLength(form)

  const updateForm = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const applyTemplate = (template) => {
    const next = getTemplateDefaults(template)

    setForm((prev) => ({
      ...prev,
      ...next,
      loads: prev.loads.map((load) => {
        const L = next.spans.slice(0, next.spanCount).reduce((sum, span) => sum + span, 0)

        if (load.type === 'udl' || load.type === 'uvl') {
          return {
            ...load,
            start: 0,
            end: L,
          }
        }

        return {
          ...load,
          x: Math.min(toNum(load.x, L / 2), L),
        }
      }),
    }))
  }

  const updateSpanCount = (value) => {
    const spanCount = Number(value)

    setForm((prev) => ({
      ...prev,
      template: 'custom',
      spanCount,
      supports: prev.supports.map((support, index) => (index <= spanCount ? support : 'free')),
    }))
  }

  const updateSpan = (index, value) => {
    setForm((prev) => ({
      ...prev,
      template: 'custom',
      spans: prev.spans.map((span, i) => (i === index ? value : span)),
    }))
  }

  const updateSupport = (index, value) => {
    setForm((prev) => ({
      ...prev,
      template: 'custom',
      supports: prev.supports.map((support, i) => (i === index ? value : support)),
    }))
  }

  const updateSettlement = (index, value) => {
    setForm((prev) => ({
      ...prev,
      template: 'custom',
      settlements: prev.settlements.map((settlement, i) => (i === index ? value : settlement)),
    }))
  }

  const addLoad = (type) => {
    setForm((prev) => ({
      ...prev,
      loads: [...prev.loads, createLoad(type, getTotalLength(prev))],
    }))
  }

  const updateLoad = (id, key, value) => {
    setForm((prev) => ({
      ...prev,
      loads: prev.loads.map((load) => (load.id === id ? { ...load, [key]: value } : load)),
    }))
  }

  const deleteLoad = (id) => {
    setForm((prev) => ({
      ...prev,
      loads: prev.loads.length > 1 ? prev.loads.filter((load) => load.id !== id) : prev.loads,
    }))
  }

  const resetExample = () => {
    const next = getTemplateDefaults('propped')

    setForm({
      reportTitle: 'Indeterminate Beam Analysis',
      preparedBy: '',
      ...next,
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
            Structural Analysis Indeterminate Beam Solver
          </p>

          <h1 className="text-3xl font-black leading-tight md:text-5xl">
            Indeterminate Beam Solver
          </h1>

          <p className="mt-4 max-w-4xl text-base leading-8 text-slate-300 md:text-lg">
            Solve propped cantilever, fixed beam and continuous beam problems using beam stiffness method with support reactions, end moments, SFD, BMD, deflected shape and exam-style steps.
          </p>
        </div>

        <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
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
                  placeholder="Example: Propped Cantilever Analysis"
                />

                <TextField
                  label="Prepared By"
                  value={form.preparedBy}
                  onChange={(value) => updateForm('preparedBy', value)}
                  placeholder="Your name"
                />

                <SelectField
                  label="Beam Template"
                  value={form.template}
                  onChange={applyTemplate}
                  helper={templateInfo[form.template]?.desc}
                >
                  <option value="propped">Propped Cantilever</option>
                  <option value="fixed">Fixed Beam</option>
                  <option value="continuous2">Two-Span Continuous Beam</option>
                  <option value="continuous3">Three-Span Continuous Beam</option>
                  <option value="custom">Custom Beam</option>
                </SelectField>

                <SelectField
                  label="Number of Spans"
                  value={form.spanCount}
                  onChange={updateSpanCount}
                  helper="Custom mode supports 1 to 4 spans."
                >
                  <option value={1}>1 Span</option>
                  <option value={2}>2 Spans</option>
                  <option value={3}>3 Spans</option>
                  <option value={4}>4 Spans</option>
                </SelectField>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
              <h2 className="text-2xl font-black text-white">Span Setup</h2>

              <div className="mt-6 space-y-5">
                {Array.from({ length: form.spanCount }).map((_, index) => (
                  <NumberField
                    key={index}
                    label={`Span ${index + 1} Length`}
                    value={form.spans[index]}
                    onChange={(value) => updateSpan(index, value)}
                    suffix="m"
                    min="0.1"
                  />
                ))}

                <div className="rounded-2xl border border-orange-500/20 bg-orange-500/10 p-4 text-sm font-bold text-orange-200">
                  Total Length = {fmt(totalLength, 3)} m
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
              <h2 className="text-2xl font-black text-white">Support Setup</h2>

              <div className="mt-6 space-y-5">
                {Array.from({ length: form.spanCount + 1 }).map((_, index) => (
                  <div key={index} className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                    <p className="mb-4 font-black text-orange-300">Node {index + 1}</p>

                    <div className="space-y-4">
                      <SelectField
                        label="Support Type"
                        value={form.supports[index]}
                        onChange={(value) => updateSupport(index, value)}
                      >
                        {supportTypes.map((support) => (
                          <option key={support.value} value={support.value}>
                            {support.label}
                          </option>
                        ))}
                      </SelectField>

                      <NumberField
                        label="Support Settlement"
                        value={form.settlements[index]}
                        onChange={(value) => updateSettlement(index, value)}
                        suffix="mm"
                        helper="Positive value means downward settlement."
                        min="-999"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
              <h2 className="text-2xl font-black text-white">Material & Section</h2>

              <div className="mt-6 space-y-5">
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
                  helper="Example: 300 means 300×10⁶ mm⁴."
                  min="0.001"
                />
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
              <h2 className="text-2xl font-black text-white">Load Builder</h2>

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
                    L={totalLength}
                    onChange={updateLoad}
                    onDelete={deleteLoad}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={resetExample}
                className="mt-6 w-full rounded-xl border border-slate-700 px-5 py-3 font-bold text-slate-200 transition hover:border-orange-400 hover:text-orange-300"
              >
                Reset Example
              </button>
            </div>
          </aside>

          <section className="space-y-6">
            {result.error && (
              <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-6">
                <h2 className="text-2xl font-black text-red-200">Input Error</h2>
                <p className="mt-3 leading-7 text-red-100">{result.error}</p>
              </div>
            )}

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
            <MethodPanel result={result} />
            <BeamLoadingDiagram result={result} />

            <div className="grid gap-6 xl:grid-cols-2">
              <CurveDiagram result={result} type="sfd" />
              <CurveDiagram result={result} type="bmd" />
            </div>

            <CurveDiagram result={result} type="deflection" />

            <ReactionTable result={result} />
            <ElementForceTable result={result} />
            <FormulaAndFinal result={result} />
            <StepByStep result={result} />
          </section>
        </div>
      </section>
    </main>
  )
}
