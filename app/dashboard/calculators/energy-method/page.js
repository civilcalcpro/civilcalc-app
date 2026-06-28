'use client'

import { useMemo, useState } from 'react'

const defaultBeamLoads = [
  {
    id: 'load-1',
    type: 'point',
    P: 20,
    x: 2,
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
    start: 2,
    end: 5,
    M: 10,
    direction: 'clockwise',
  },
]

const defaultTrussMembers = [
  { id: 'm1', name: 'AB', F: 20, f: 0.5, L: 3, A: 500, E: 200 },
  { id: 'm2', name: 'BC', F: -15, f: -0.3, L: 4, A: 500, E: 200 },
  { id: 'm3', name: 'AC', F: 25, f: 0.7, L: 5, A: 600, E: 200 },
]

const defaultSuperRows = [
  { id: 's1', name: 'Load Case 1', deflection: 4.2 },
  { id: 's2', name: 'Load Case 2', deflection: -1.4 },
  { id: 's3', name: 'Load Case 3', deflection: 2.1 },
]

const topicCards = [
  'Unit Load Method',
  'Virtual Work',
  'Strain Energy',
  'Castigliano Theorem',
  'Beam Deflection',
  'Truss Deflection',
  'Axial Energy',
  'Bending Energy',
  'Superposition',
  'Maxwell Theorem',
  'Betti Theorem',
  'Exam Answer',
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

function getLoadResultant(load) {
  if (load.type === 'point') {
    return {
      W: load.P,
      xBar: load.x,
      label: `Point load ${fmt(load.P, 2)} kN at x = ${fmt(load.x, 2)} m`,
    }
  }

  if (load.type === 'udl') {
    const W = load.w * load.length
    const xBar = load.start + load.length / 2

    return {
      W,
      xBar,
      label: `UDL ${fmt(load.w, 2)} kN/m from ${fmt(load.start, 2)} m to ${fmt(load.end, 2)} m`,
    }
  }

  if (load.type === 'uvl') {
    const W = ((load.w1 + load.w2) / 2) * load.length
    const localX =
      load.w1 + load.w2 === 0
        ? load.length / 2
        : (load.length * (load.w1 + 2 * load.w2)) / (3 * (load.w1 + load.w2))
    const xBar = load.start + localX

    return {
      W,
      xBar,
      label: `UVL/trapezoidal ${fmt(load.w1, 2)} to ${fmt(load.w2, 2)} kN/m from ${fmt(load.start, 2)} m to ${fmt(load.end, 2)} m`,
    }
  }

  return {
    W: 0,
    xBar: load.x,
    signedMoment: getMomentSign(load) * load.M,
    label: `${load.direction === 'clockwise' ? 'Clockwise' : 'Anticlockwise'} moment ${fmt(load.M, 2)} kN·m at x = ${fmt(load.x, 2)} m`,
  }
}

function partialDistributedLoad(load, fromX, toX) {
  const a = clamp(fromX, load.start, load.end)
  const b = clamp(toX, load.start, load.end)

  if (b <= a) return { W: 0, firstMoment: 0 }

  if (load.type === 'udl') {
    const W = load.w * (b - a)
    const xBar = (a + b) / 2
    return { W, firstMoment: W * xBar }
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

function solveBeamSystem(beamType, L, rawLoads) {
  const loads = rawLoads.map((load) => normalizeLoad(load, L))
  const resultants = loads.map((load) => ({ load, ...getLoadResultant(load) }))
  const vertical = resultants.filter((item) => item.load.type !== 'moment')
  const moments = resultants.filter((item) => item.load.type === 'moment')

  const totalLoad = vertical.reduce((sum, item) => sum + item.W, 0)
  const loadMomentAboutA = vertical.reduce((sum, item) => sum + item.W * item.xBar, 0)
  const appliedMomentSum = moments.reduce(
    (sum, item) => sum + getMomentSign(item.load) * item.load.M,
    0
  )

  let RA = 0
  let RB = 0
  let fixedMoment = 0

  if (beamType === 'simple') {
    RB = (loadMomentAboutA + appliedMomentSum) / L
    RA = totalLoad - RB
  } else {
    RA = totalLoad
    fixedMoment = loadMomentAboutA + appliedMomentSum
  }

  return {
    beamType,
    L,
    loads,
    resultants,
    totalLoad,
    loadMomentAboutA,
    appliedMomentSum,
    RA,
    RB,
    fixedMoment,
  }
}

function shearMomentAt(system, rawX, side = 'right') {
  const L = system.L
  const x = clamp(rawX, 0, L)
  const eps = 0.000001
  const checkX = side === 'left' ? Math.max(0, x - eps) : Math.min(L, x + eps)

  if (system.beamType === 'simple') {
    let V = system.RA
    let M = system.RA * x

    system.loads.forEach((load) => {
      if (load.type === 'point') {
        if (checkX >= load.x) V -= load.P
        if (x >= load.x) M -= load.P * (x - load.x)
      }

      if (load.type === 'udl' || load.type === 'uvl') {
        const shearPart = partialDistributedLoad(load, load.start, Math.min(checkX, load.end))
        V -= shearPart.W

        const momentPart = partialDistributedLoad(load, load.start, Math.min(x, load.end))
        M -= momentPart.W * x - momentPart.firstMoment
      }

      if (load.type === 'moment') {
        if (checkX >= load.x) M += getMomentSign(load) * load.M
      }
    })

    return { shear: V, moment: M }
  }

  let V = 0
  let M = 0

  system.loads.forEach((load) => {
    if (load.type === 'point') {
      if (checkX <= load.x) V -= load.P
      if (x <= load.x) M -= load.P * (load.x - x)
    }

    if (load.type === 'udl' || load.type === 'uvl') {
      const rightStart = Math.max(x, load.start)
      const rightEnd = load.end

      if (rightEnd > rightStart) {
        const part = partialDistributedLoad(load, rightStart, rightEnd)
        V -= part.W
        M -= part.firstMoment - part.W * x
      }
    }

    if (load.type === 'moment') {
      if (checkX <= load.x) M -= getMomentSign(load) * load.M
    }
  })

  return { shear: V, moment: M }
}

function sampleXs(L, loads, xTarget) {
  const xs = []

  for (let i = 0; i <= 420; i += 1) {
    xs.push((L * i) / 420)
  }

  xs.push(0, L, xTarget)

  loads.forEach((load) => {
    if (load.type === 'point' || load.type === 'moment') xs.push(load.x)
    if (load.type === 'udl' || load.type === 'uvl') {
      xs.push(load.start, load.end, (load.start + load.end) / 2)
    }
  })

  return [...new Set(xs.map((x) => Number(clamp(x, 0, L).toFixed(6))))].sort((a, b) => a - b)
}

function trapz(xs, ys) {
  let total = 0
  for (let i = 1; i < xs.length; i += 1) {
    const dx = xs[i] - xs[i - 1]
    total += 0.5 * (ys[i - 1] + ys[i]) * dx
  }
  return total
}

function solveBeamUnitMethod(form) {
  const L = Math.max(toNum(form.L, 6), 0.1)
  const xTarget = clamp(toNum(form.x, L / 2), 0, L)
  const beamType = form.beamType === 'cantilever' ? 'cantilever' : 'simple'
  const E = Math.max(toNum(form.E, 200), 0.001)
  const I = Math.max(toNum(form.I, 300), 0.001)
  const EI = E * I

  const realSystem = solveBeamSystem(beamType, L, form.loads)

  const virtualLoad =
    form.targetType === 'rotation'
      ? [
          {
            id: 'unit-moment',
            type: 'moment',
            M: 1,
            x: xTarget,
            direction: 'clockwise',
            P: 0,
            w: 0,
            w1: 0,
            w2: 0,
            start: 0,
            end: L,
          },
        ]
      : [
          {
            id: 'unit-load',
            type: 'point',
            P: 1,
            x: xTarget,
            w: 0,
            w1: 0,
            w2: 0,
            start: 0,
            end: L,
            M: 0,
            direction: 'clockwise',
          },
        ]

  const virtualSystem = solveBeamSystem(beamType, L, virtualLoad)
  const xs = sampleXs(L, realSystem.loads.concat(virtualSystem.loads), xTarget)

  const values = xs.map((x) => {
    const real = shearMomentAt(realSystem, x)
    const unit = shearMomentAt(virtualSystem, x)
    const product = (real.moment * unit.moment) / EI

    return {
      x,
      shear: real.shear,
      M: real.moment,
      m: unit.moment,
      product,
    }
  })

  const answer = trapz(
    values.map((item) => item.x),
    values.map((item) => item.product)
  )

  const answerText =
    form.targetType === 'rotation'
      ? `${fmt(answer, 6)} rad`
      : `${fmt(answer * 1000, 4)} mm`

  const maxM = values.reduce((best, item) => (Math.abs(item.M) > Math.abs(best.M) ? item : best), values[0])
  const maxProduct = values.reduce((best, item) => (Math.abs(item.product) > Math.abs(best.product) ? item : best), values[0])

  return {
    kind: 'beam_unit',
    title: 'Beam Deflection by Unit Load Method',
    modeTitle: 'Beam Unit Load Method',
    realSystem,
    virtualSystem,
    values,
    L,
    xTarget,
    E,
    I,
    EI,
    targetType: form.targetType,
    answer,
    answerText,
    maxM,
    maxProduct,
    summary: [
      { label: beamType === 'simple' ? 'RA' : 'Fixed Reaction', value: `${fmt(realSystem.RA, 3)} kN` },
      { label: beamType === 'simple' ? 'RB' : 'Fixed Moment', value: beamType === 'simple' ? `${fmt(realSystem.RB, 3)} kN` : `${fmt(realSystem.fixedMoment, 3)} kN·m` },
      { label: form.targetType === 'rotation' ? 'Rotation' : 'Deflection', value: answerText },
      { label: 'Max |M|', value: `${fmt(maxM.M, 3)} kN·m` },
    ],
    formulas: [
      'Unit load method: δ = ∫ M m / EI dx',
      'M = bending moment due to real loads',
      'm = bending moment due to unit load/unit moment',
      'For deflection, apply unit load at the required point',
      'For rotation, apply unit moment at the required point',
    ],
    steps: [
      `Beam type: ${beamType === 'simple' ? 'Simply Supported Beam' : 'Cantilever Beam'}.`,
      `Span L = ${fmt(L, 3)} m, target section x = ${fmt(xTarget, 3)} m.`,
      `E = ${fmt(E, 3)} GPa and I = ${fmt(I, 3)} ×10⁶ mm⁴, so EI = ${fmt(EI, 3)} kN·m².`,
      `Support reactions are calculated for the real loading system.`,
      form.targetType === 'rotation'
        ? `A unit moment is applied at x = ${fmt(xTarget, 3)} m to get virtual moment diagram m.`
        : `A unit load is applied at x = ${fmt(xTarget, 3)} m to get virtual moment diagram m.`,
      `The value of M × m / EI is generated along the beam.`,
      `The required ${form.targetType === 'rotation' ? 'rotation' : 'deflection'} is obtained by numerical integration of ∫Mm/EI dx.`,
      `Final value = ${answerText}.`,
    ],
    finalAnswer:
      form.targetType === 'rotation'
        ? `Using unit load method, rotation at x = ${fmt(xTarget, 3)} m is ${answerText}.`
        : `Using unit load method, deflection at x = ${fmt(xTarget, 3)} m is ${answerText}. Positive value is in the direction of the applied unit load.`,
  }
}

function solveTrussUnitMethod(form) {
  const rows = form.trussMembers.map((row) => {
    const F = toNum(row.F, 0)
    const f = toNum(row.f, 0)
    const L = Math.max(toNum(row.L, 1), 0.001)
    const A = Math.max(toNum(row.A, 500), 0.001)
    const E = Math.max(toNum(row.E, 200), 0.001)
    const AE = A * E
    const contributionM = (F * f * L) / AE
    const contributionMm = contributionM * 1000
    const energy = (F * F * L) / (2 * AE)

    return {
      ...row,
      F,
      f,
      L,
      A,
      E,
      AE,
      contributionM,
      contributionMm,
      energy,
    }
  })

  const totalDeflectionMm = rows.reduce((sum, row) => sum + row.contributionMm, 0)
  const totalEnergy = rows.reduce((sum, row) => sum + row.energy, 0)
  const maxContribution = rows.reduce(
    (best, row) => (Math.abs(row.contributionMm) > Math.abs(best.contributionMm) ? row : best),
    rows[0] || { name: '-', contributionMm: 0 }
  )

  return {
    kind: 'truss_unit',
    title: 'Truss Deflection by Unit Load Method',
    modeTitle: 'Truss Unit Load Method',
    rows,
    totalDeflectionMm,
    totalEnergy,
    maxContribution,
    summary: [
      { label: 'Members Used', value: `${rows.length}` },
      { label: 'Total Deflection', value: `${fmt(totalDeflectionMm, 4)} mm` },
      { label: 'Total Strain Energy', value: `${fmt(totalEnergy, 6)} kN·m` },
      { label: 'Max Contribution', value: `${maxContribution.name}` },
    ],
    formulas: [
      'Truss deflection by unit load method: δ = Σ(F f L / AE)',
      'F = member force due to real loading',
      'f = member force due to unit load at required joint/direction',
      'A = area of member, E = modulus of elasticity',
      'Positive contribution means displacement in the direction of unit load',
    ],
    steps: [
      `Real member forces F are entered from truss analysis.`,
      `Virtual member forces f are entered after applying unit load at required joint/direction.`,
      `For each member, contribution = F × f × L / AE.`,
      `All member contributions are added algebraically.`,
      `Total deflection = ${fmt(totalDeflectionMm, 4)} mm.`,
    ],
    finalAnswer: `Using unit load method for truss, total joint deflection is ${fmt(totalDeflectionMm, 4)} mm. Positive value means displacement is in the direction of the applied unit load.`,
  }
}

function solveAxialEnergy(form) {
  const P = Math.max(toNum(form.axial.P, 100), 0)
  const L = Math.max(toNum(form.axial.L, 3), 0.001)
  const A = Math.max(toNum(form.axial.A, 500), 0.001)
  const E = Math.max(toNum(form.axial.E, 200), 0.001)
  const AE = A * E
  const U = (P * P * L) / (2 * AE)
  const deltaM = (P * L) / AE
  const deltaMm = deltaM * 1000
  const stress = (P * 1000) / A
  const strain = stress / (E * 1000)

  return {
    kind: 'axial_energy',
    title: 'Axial Bar Strain Energy',
    modeTitle: 'Axial Strain Energy',
    P,
    L,
    A,
    E,
    AE,
    U,
    deltaMm,
    stress,
    strain,
    summary: [
      { label: 'Strain Energy U', value: `${fmt(U, 6)} kN·m` },
      { label: 'Elongation δ', value: `${fmt(deltaMm, 4)} mm` },
      { label: 'Stress', value: `${fmt(stress, 3)} MPa` },
      { label: 'Strain', value: `${fmt(strain, 8)}` },
    ],
    formulas: [
      'Axial strain energy: U = P²L / 2AE',
      'Axial deformation: δ = PL / AE',
      'Stress: σ = P / A',
      'Strain: ε = σ / E',
    ],
    steps: [
      `Given axial load P = ${fmt(P, 3)} kN, length L = ${fmt(L, 3)} m.`,
      `Area A = ${fmt(A, 3)} mm² and E = ${fmt(E, 3)} GPa.`,
      `AE = ${fmt(AE, 3)} kN.`,
      `Strain energy U = P²L / 2AE = ${fmt(U, 6)} kN·m.`,
      `Axial deformation δ = PL / AE = ${fmt(deltaMm, 4)} mm.`,
    ],
    finalAnswer: `Axial strain energy is ${fmt(U, 6)} kN·m and axial deformation is ${fmt(deltaMm, 4)} mm.`,
  }
}

function solveBeamEnergy(form) {
  const L = Math.max(toNum(form.L, 6), 0.1)
  const beamType = form.beamType === 'cantilever' ? 'cantilever' : 'simple'
  const E = Math.max(toNum(form.E, 200), 0.001)
  const I = Math.max(toNum(form.I, 300), 0.001)
  const EI = E * I
  const system = solveBeamSystem(beamType, L, form.loads)
  const xs = sampleXs(L, system.loads, toNum(form.x, L / 2))

  const values = xs.map((x) => {
    const sm = shearMomentAt(system, x)
    return {
      x,
      M: sm.moment,
      energyDensity: (sm.moment * sm.moment) / (2 * EI),
    }
  })

  const U = trapz(
    values.map((item) => item.x),
    values.map((item) => item.energyDensity)
  )

  const maxM = values.reduce((best, item) => (Math.abs(item.M) > Math.abs(best.M) ? item : best), values[0])

  return {
    kind: 'beam_energy',
    title: 'Beam Strain Energy due to Bending',
    modeTitle: 'Beam Bending Energy',
    system,
    values,
    L,
    E,
    I,
    EI,
    U,
    maxM,
    summary: [
      { label: beamType === 'simple' ? 'RA' : 'Fixed Reaction', value: `${fmt(system.RA, 3)} kN` },
      { label: beamType === 'simple' ? 'RB' : 'Fixed Moment', value: beamType === 'simple' ? `${fmt(system.RB, 3)} kN` : `${fmt(system.fixedMoment, 3)} kN·m` },
      { label: 'Strain Energy U', value: `${fmt(U, 6)} kN·m` },
      { label: 'Max |M|', value: `${fmt(maxM.M, 3)} kN·m` },
    ],
    formulas: [
      'Beam bending strain energy: U = ∫ M² / 2EI dx',
      'M = bending moment due to real loading',
      'EI = flexural rigidity',
      'The area under M²/2EI diagram gives strain energy',
    ],
    steps: [
      `Support reactions are calculated first from equilibrium.`,
      `Bending moment M is generated along the beam length.`,
      `Energy density M²/2EI is calculated at each section.`,
      `Numerical integration gives U = ${fmt(U, 6)} kN·m.`,
    ],
    finalAnswer: `The strain energy stored in the beam due to bending is ${fmt(U, 6)} kN·m.`,
  }
}

function solveCastigliano(form) {
  const c = form.cast
  const caseType = c.caseType
  const P = Math.max(toNum(c.P, 20), 0)
  const w = Math.max(toNum(c.w, 5), 0)
  const L = Math.max(toNum(c.L, 3), 0.001)
  const E = Math.max(toNum(c.E, 200), 0.001)
  const I = Math.max(toNum(c.I, 300), 0.001)
  const A = Math.max(toNum(c.A, 500), 0.001)
  const EI = E * I
  const AE = E * A

  let U = 0
  let delta = 0
  let rotation = 0
  let title = ''
  let formula = ''

  if (caseType === 'axial') {
    title = 'Castigliano for Axial Bar'
    U = (P * P * L) / (2 * AE)
    delta = (P * L) / AE
    formula = 'U = P²L/2AE, δ = ∂U/∂P = PL/AE'
  } else if (caseType === 'cantilever_point') {
    title = 'Castigliano for Cantilever with End Point Load'
    U = (P * P * Math.pow(L, 3)) / (6 * EI)
    delta = (P * Math.pow(L, 3)) / (3 * EI)
    rotation = (P * L * L) / (2 * EI)
    formula = 'U = P²L³/6EI, δ = ∂U/∂P = PL³/3EI'
  } else if (caseType === 'ss_central_point') {
    title = 'Castigliano for Simply Supported Beam with Central Point Load'
    U = (P * P * Math.pow(L, 3)) / (96 * EI)
    delta = (P * Math.pow(L, 3)) / (48 * EI)
    rotation = (P * L * L) / (16 * EI)
    formula = 'U = P²L³/96EI, δmax = PL³/48EI'
  } else {
    title = 'Castigliano for Cantilever with UDL'
    U = (w * w * Math.pow(L, 5)) / (40 * EI)
    delta = (w * Math.pow(L, 4)) / (8 * EI)
    rotation = (w * Math.pow(L, 3)) / (6 * EI)
    formula = 'U = w²L⁵/40EI, δfree = wL⁴/8EI'
  }

  return {
    kind: 'castigliano',
    title,
    modeTitle: 'Castigliano Theorem',
    caseType,
    P,
    w,
    L,
    E,
    I,
    A,
    EI,
    AE,
    U,
    deltaMm: delta * 1000,
    rotation,
    formula,
    summary: [
      { label: 'Strain Energy U', value: `${fmt(U, 6)} kN·m` },
      { label: 'Deflection', value: `${fmt(delta * 1000, 4)} mm` },
      { label: 'Rotation', value: `${fmt(rotation, 6)} rad` },
      { label: 'Method', value: '∂U/∂Load' },
    ],
    formulas: [
      'Castigliano theorem: deflection δ = ∂U / ∂P',
      'Rotation θ = ∂U / ∂M',
      formula,
      'U is strain energy stored in the structure',
    ],
    steps: [
      `Selected case: ${title}.`,
      `Calculate strain energy U from load and structural stiffness.`,
      `Differentiate strain energy with respect to the applied load.`,
      `Deflection = ${fmt(delta * 1000, 4)} mm.`,
      `Rotation = ${fmt(rotation, 6)} rad.`,
    ],
    finalAnswer: `Using Castigliano’s theorem, strain energy U = ${fmt(U, 6)} kN·m, deflection = ${fmt(delta * 1000, 4)} mm and rotation = ${fmt(rotation, 6)} rad.`,
  }
}

function solveSuperposition(form) {
  const rows = form.superRows.map((row) => ({
    ...row,
    deflection: toNum(row.deflection, 0),
  }))

  const total = rows.reduce((sum, row) => sum + row.deflection, 0)

  return {
    kind: 'superposition',
    title: 'Method of Superposition',
    modeTitle: 'Superposition Method',
    rows,
    total,
    summary: [
      { label: 'Load Cases', value: `${rows.length}` },
      { label: 'Total Deflection', value: `${fmt(total, 4)} mm` },
      { label: 'Positive Direction', value: 'Downward' },
      { label: 'Method', value: 'Algebraic Sum' },
    ],
    formulas: [
      'Superposition principle: total deflection = sum of deflections due to individual loads',
      'δtotal = δ1 + δ2 + δ3 + ...',
      'Valid for linear elastic structures',
      'Signs must be considered carefully',
    ],
    steps: [
      `Calculate deflection due to each load case separately.`,
      `Assign sign convention: positive downward, negative upward.`,
      `Add all deflections algebraically.`,
      `Total deflection = ${fmt(total, 4)} mm.`,
    ],
    finalAnswer: `By the method of superposition, total deflection is ${fmt(total, 4)} mm.`,
  }
}

function solveTheoryNotes() {
  return {
    kind: 'theory',
    title: 'Maxwell, Betti and Virtual Work Theory',
    modeTitle: 'Theory Notes',
    summary: [
      { label: 'Maxwell Theorem', value: 'Reciprocal deflection' },
      { label: 'Betti Theorem', value: 'Reciprocal work' },
      { label: 'Virtual Work', value: 'δ = internal virtual work' },
      { label: 'Use', value: 'Exam theory' },
    ],
    formulas: [
      'Maxwell reciprocal theorem: δAB = δBA',
      'Betti theorem: ΣP₁δ₂ = ΣP₂δ₁',
      'Virtual work: external virtual work = internal virtual work',
      'For beams: δ = ∫Mm/EI dx',
      'For trusses: δ = ΣFfL/AE',
    ],
    steps: [
      `Maxwell theorem states that displacement at A due to load at B equals displacement at B due to same load at A.`,
      `Betti theorem states that work done by system 1 through displacements of system 2 equals work done by system 2 through displacements of system 1.`,
      `Virtual work method applies a unit virtual load at the point and direction where displacement is required.`,
      `Internal virtual work is evaluated using beam or truss strain energy expressions.`,
    ],
    finalAnswer: `Maxwell theorem, Betti theorem and virtual work are energy-based principles used to calculate displacement and establish reciprocal relationships in linear elastic structures.`,
  }
}

function solveCurrent(form) {
  if (form.mode === 'beam_unit') return solveBeamUnitMethod(form)
  if (form.mode === 'truss_unit') return solveTrussUnitMethod(form)
  if (form.mode === 'axial_energy') return solveAxialEnergy(form)
  if (form.mode === 'beam_energy') return solveBeamEnergy(form)
  if (form.mode === 'castigliano') return solveCastigliano(form)
  if (form.mode === 'superposition') return solveSuperposition(form)
  return solveTheoryNotes()
}

function buildPlainReport(result, form) {
  return `
${form.reportTitle || 'Energy Method Report'}
Prepared By: ${form.preparedBy || '-'}
Mode: ${result.modeTitle}

RESULT SUMMARY
${result.summary.map((item) => `${item.label}: ${item.value}`).join('\n')}

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

  const formulas = result.formulas.map((item) => `<li>${cleanHtml(item)}</li>`).join('')
  const steps = result.steps.map((item, index) => `<li><strong>Step ${index + 1}:</strong> ${cleanHtml(item)}</li>`).join('')

  return `
<!doctype html>
<html>
<head>
  <title>${cleanHtml(form.reportTitle || 'Energy Method Report')}</title>
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
      max-width: 900px;
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
      <h1>${cleanHtml(form.reportTitle || 'Energy Method Report')}</h1>
      <div class="sub">
        Prepared By: ${cleanHtml(form.preparedBy || '-')}<br/>
        Mode: ${cleanHtml(result.modeTitle)}
      </div>
    </div>

    <h2>Result Summary</h2>
    <table><tbody>${summaryRows}</tbody></table>

    <h2>Formulas Used</h2>
    <ol>${formulas}</ol>

    <h2>Step-by-Step Solution</h2>
    <ol>${steps}</ol>

    <h2>Final Answer</h2>
    <div class="answer">${cleanHtml(result.finalAnswer)}</div>

    <div class="footer">Generated using CivilCalc Pro Energy Method Calculator.</div>
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
            {load.type === 'uvl' && 'UVL / Trapezoidal Load'}
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
              helper={`Position from left/fixed support. Keep between 0 and ${fmt(L, 2)} m.`}
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

function TrussMemberEditor({ row, index, onChange, onDelete }) {
  const update = (key, value) => onChange(row.id, key, value)

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-black text-orange-300">Member {index + 1}</p>
          <h3 className="mt-1 text-lg font-black text-white">{row.name}</h3>
        </div>

        <button
          type="button"
          onClick={() => onDelete(row.id)}
          className="rounded-lg border border-red-500/30 px-3 py-2 text-xs font-bold text-red-300 hover:bg-red-500/10"
        >
          Delete
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label="Member Name" value={row.name} onChange={(value) => update('name', value)} />
        <NumberField label="Real Force F" value={row.F} onChange={(value) => update('F', value)} suffix="kN" helper="+ tension, - compression" />
        <NumberField label="Unit Load Force f" value={row.f} onChange={(value) => update('f', value)} suffix="" helper="Member force due to unit load" />
        <NumberField label="Length L" value={row.L} onChange={(value) => update('L', value)} suffix="m" min="0.001" />
        <NumberField label="Area A" value={row.A} onChange={(value) => update('A', value)} suffix="mm²" min="0.001" />
        <NumberField label="Modulus E" value={row.E} onChange={(value) => update('E', value)} suffix="GPa" min="0.001" />
      </div>
    </div>
  )
}

function SuperRowEditor({ row, index, onChange, onDelete }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-black text-orange-300">Case {index + 1}</p>
          <h3 className="mt-1 text-lg font-black text-white">{row.name}</h3>
        </div>

        <button
          type="button"
          onClick={() => onDelete(row.id)}
          className="rounded-lg border border-red-500/30 px-3 py-2 text-xs font-bold text-red-300 hover:bg-red-500/10"
        >
          Delete
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label="Load Case Name" value={row.name} onChange={(value) => onChange(row.id, 'name', value)} />
        <NumberField label="Deflection" value={row.deflection} onChange={(value) => onChange(row.id, 'deflection', value)} suffix="mm" helper="+ downward, - upward" />
      </div>
    </div>
  )
}

function BeamDiagram({ result }) {
  const system = result.realSystem || result.system
  if (!system) return null

  const x0 = 70
  const x1 = 570
  const y = 125
  const L = system.L || 1
  const mapX = (x) => x0 + (x / L) * (x1 - x0)
  const isSimple = system.beamType === 'simple'

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-950 p-4">
      <h3 className="mb-3 text-lg font-black text-white">Beam / Real Loading Diagram</h3>

      <svg viewBox="0 0 640 260" className="h-auto w-full">
        <line x1={x0} y1={y} x2={x1} y2={y} stroke="#cbd5e1" strokeWidth="7" strokeLinecap="round" />

        {isSimple ? (
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
            <rect x={x0 - 32} y={y - 58} width="28" height="116" fill="#38bdf8" opacity="0.9" />
            {[-45, -25, -5, 15, 35, 55].map((dy) => (
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
            <text x={x0 - 45} y={y + 82} fill="#e2e8f0" fontSize="14" fontWeight="700">Fixed</text>
          </>
        )}

        {system.loads.map((load, index) => {
          if (load.type === 'point') {
            const lx = mapX(load.x)
            return (
              <g key={load.id}>
                <line x1={lx} y1="38" x2={lx} y2={y - 8} stroke="#f97316" strokeWidth="4" />
                <polygon points={`${lx - 9},${y - 18} ${lx + 9},${y - 18} ${lx},${y - 4}`} fill="#f97316" />
                <text x={lx - 28} y="28" fill="#fed7aa" fontSize="13" fontWeight="800">
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
                <text x={sx + 6} y="38" fill="#fed7aa" fontSize="13" fontWeight="800">
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
                <text x={sx + 6} y="35" fill="#fed7aa" fontSize="13" fontWeight="800">
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
              <text x={lx - 32} y={y - 55} fill="#ddd6fe" fontSize="13" fontWeight="800">
                M={fmt(load.M, 1)}
              </text>
            </g>
          )
        })}

        {result.kind === 'beam_unit' && (
          <g>
            <line
              x1={mapX(result.xTarget)}
              y1={y + 95}
              x2={mapX(result.xTarget)}
              y2={y + 20}
              stroke="#22c55e"
              strokeWidth="3"
              strokeDasharray="5 5"
            />
            <text x={mapX(result.xTarget) + 8} y={y + 88} fill="#bbf7d0" fontSize="13" fontWeight="800">
              unit action
            </text>
          </g>
        )}

        <line x1={x0} y1={y + 105} x2={x1} y2={y + 105} stroke="#64748b" strokeWidth="2" />
        <line x1={x0} y1={y + 97} x2={x0} y2={y + 113} stroke="#64748b" strokeWidth="2" />
        <line x1={x1} y1={y + 97} x2={x1} y2={y + 113} stroke="#64748b" strokeWidth="2" />
        <text x={(x0 + x1) / 2 - 20} y={y + 130} fill="#f97316" fontSize="14" fontWeight="800">
          L = {fmt(system.L, 2)} m
        </text>

        <text x="18" y="245" fill="#94a3b8" fontSize="13">
          Diagram shows real loads. Green dashed line shows unit action point where applicable.
        </text>
      </svg>
    </div>
  )
}

function CurveDiagram({ result, type }) {
  let values = []
  let valueKey = 'M'
  let title = ''
  let color = '#38bdf8'
  let note = ''

  if (result.kind === 'beam_unit') {
    values = result.values
    if (type === 'realM') {
      valueKey = 'M'
      title = 'Real Moment Diagram M'
      color = '#38bdf8'
      note = 'M is due to real loading.'
    } else if (type === 'unitM') {
      valueKey = 'm'
      title = 'Unit Moment Diagram m'
      color = '#22c55e'
      note = 'm is due to unit load/unit moment.'
    } else {
      valueKey = 'product'
      title = 'M × m / EI Diagram'
      color = '#f97316'
      note = 'Area under this diagram gives deflection/rotation.'
    }
  } else if (result.kind === 'beam_energy') {
    values = result.values
    if (type === 'realM') {
      valueKey = 'M'
      title = 'Bending Moment Diagram M'
      color = '#38bdf8'
      note = 'M is due to real loading.'
    } else {
      valueKey = 'energyDensity'
      title = 'M² / 2EI Energy Density Diagram'
      color = '#f97316'
      note = 'Area under this diagram gives bending strain energy.'
    }
  } else {
    return null
  }

  const x0 = 70
  const x1 = 570
  const yBase = 110
  const amp = 72
  const L = result.L || 1
  const mapX = (x) => x0 + (x / L) * (x1 - x0)
  const maxAbs = Math.max(...values.map((item) => Math.abs(item[valueKey])), 1)

  const points = values
    .map((item) => {
      const y = yBase + (item[valueKey] / maxAbs) * amp
      return `${mapX(item.x)},${y}`
    })
    .join(' ')

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-950 p-4">
      <h3 className="mb-3 text-lg font-black text-white">{title}</h3>

      <svg viewBox="0 0 640 240" className="h-auto w-full">
        <line x1={x0} y1={yBase} x2={x1} y2={yBase} stroke="#64748b" strokeWidth="2" strokeDasharray="6 6" />
        <line x1={x0} y1="30" x2={x0} y2="190" stroke="#334155" strokeWidth="2" />
        <line x1={x1} y1="30" x2={x1} y2="190" stroke="#334155" strokeWidth="2" />
        <polyline points={points} fill="none" stroke={color} strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" />

        <text x="18" y="22" fill="#94a3b8" fontSize="13">
          {note}
        </text>
      </svg>
    </div>
  )
}

function TrussContributionDiagram({ result }) {
  if (result.kind !== 'truss_unit') return null

  const rows = result.rows
  const maxAbs = Math.max(...rows.map((row) => Math.abs(row.contributionMm)), 1)
  const width = 640
  const rowHeight = 42
  const height = Math.max(160, 70 + rows.length * rowHeight)
  const axisX = 310

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-950 p-4">
      <h3 className="mb-3 text-lg font-black text-white">Truss Member Contribution Diagram</h3>

      <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full">
        <line x1={axisX} y1="35" x2={axisX} y2={height - 20} stroke="#64748b" strokeWidth="2" strokeDasharray="6 6" />

        {rows.map((row, index) => {
          const y = 58 + index * rowHeight
          const bar = (Math.abs(row.contributionMm) / maxAbs) * 210
          const positive = row.contributionMm >= 0
          const x = positive ? axisX : axisX - bar

          return (
            <g key={row.id}>
              <text x="25" y={y + 5} fill="#e2e8f0" fontSize="13" fontWeight="800">
                {row.name}
              </text>
              <rect
                x={x}
                y={y - 13}
                width={bar}
                height="22"
                rx="8"
                fill={positive ? '#38bdf8' : '#f97316'}
                opacity="0.85"
              />
              <text
                x={positive ? axisX + bar + 8 : axisX - bar - 88}
                y={y + 5}
                fill="#cbd5e1"
                fontSize="12"
                fontWeight="800"
              >
                {fmt(row.contributionMm, 4)} mm
              </text>
            </g>
          )
        })}

        <text x="18" y={height - 4} fill="#94a3b8" fontSize="13">
          Blue = positive contribution, orange = negative contribution.
        </text>
      </svg>
    </div>
  )
}

function ConceptDiagram({ result }) {
  if (!['axial_energy', 'castigliano', 'superposition', 'theory'].includes(result.kind)) return null

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-950 p-4">
      <h3 className="mb-3 text-lg font-black text-white">Concept Diagram</h3>

      <svg viewBox="0 0 640 240" className="h-auto w-full">
        {result.kind === 'axial_energy' && (
          <>
            <line x1="110" y1="120" x2="530" y2="120" stroke="#cbd5e1" strokeWidth="18" strokeLinecap="round" />
            <line x1="70" y1="120" x2="105" y2="120" stroke="#f97316" strokeWidth="4" />
            <polygon points="105,120 90,112 90,128" fill="#f97316" />
            <line x1="570" y1="120" x2="535" y2="120" stroke="#f97316" strokeWidth="4" />
            <polygon points="535,120 550,112 550,128" fill="#f97316" />
            <text x="245" y="92" fill="#fed7aa" fontSize="16" fontWeight="900">Axial member under P</text>
            <text x="235" y="160" fill="#94a3b8" fontSize="14">U = P²L / 2AE</text>
          </>
        )}

        {result.kind === 'castigliano' && (
          <>
            <rect x="80" y="60" width="480" height="105" rx="20" fill="rgba(249,115,22,0.12)" stroke="#f97316" />
            <text x="140" y="100" fill="#ffffff" fontSize="20" fontWeight="900">Castigliano’s Theorem</text>
            <text x="145" y="135" fill="#fed7aa" fontSize="18" fontWeight="800">δ = ∂U / ∂P</text>
            <text x="330" y="135" fill="#fed7aa" fontSize="18" fontWeight="800">θ = ∂U / ∂M</text>
          </>
        )}

        {result.kind === 'superposition' && (
          <>
            {[0, 1, 2].map((i) => (
              <g key={i}>
                <rect x={70 + i * 155} y="70" width="120" height="70" rx="14" fill="rgba(56,189,248,0.12)" stroke="#38bdf8" />
                <text x={92 + i * 155} y="112" fill="#bfdbfe" fontSize="16" fontWeight="900">δ{i + 1}</text>
              </g>
            ))}
            <text x="520" y="112" fill="#fed7aa" fontSize="20" fontWeight="900">= δtotal</text>
            <text x="150" y="180" fill="#94a3b8" fontSize="14">Total response = algebraic sum of individual responses</text>
          </>
        )}

        {result.kind === 'theory' && (
          <>
            <circle cx="190" cy="115" r="55" fill="rgba(56,189,248,0.12)" stroke="#38bdf8" strokeWidth="3" />
            <circle cx="450" cy="115" r="55" fill="rgba(249,115,22,0.12)" stroke="#f97316" strokeWidth="3" />
            <path d="M 250 105 C 310 60, 340 60, 390 105" fill="none" stroke="#22c55e" strokeWidth="4" />
            <path d="M 390 128 C 340 175, 310 175, 250 128" fill="none" stroke="#22c55e" strokeWidth="4" />
            <text x="160" y="122" fill="#bfdbfe" fontSize="16" fontWeight="900">A</text>
            <text x="420" y="122" fill="#fed7aa" fontSize="16" fontWeight="900">B</text>
            <text x="215" y="205" fill="#94a3b8" fontSize="14">Reciprocal displacement / reciprocal work</text>
          </>
        )}
      </svg>
    </div>
  )
}

function ResultTables({ result }) {
  if (result.kind === 'truss_unit') {
    return (
      <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
        <h2 className="text-2xl font-black text-white">Truss Unit Load Table</h2>

        <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-800">
          <table className="w-full min-w-[900px] border-collapse text-left">
            <thead className="bg-slate-950">
              <tr>
                <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">Member</th>
                <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">F</th>
                <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">f</th>
                <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">L</th>
                <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">AE</th>
                <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">Contribution</th>
              </tr>
            </thead>

            <tbody>
              {result.rows.map((row) => (
                <tr key={row.id} className="bg-slate-900/50">
                  <td className="border-b border-slate-800 px-4 py-3 text-sm font-bold text-slate-200">{row.name}</td>
                  <td className="border-b border-slate-800 px-4 py-3 text-sm text-slate-300">{fmt(row.F, 3)} kN</td>
                  <td className="border-b border-slate-800 px-4 py-3 text-sm text-slate-300">{fmt(row.f, 4)}</td>
                  <td className="border-b border-slate-800 px-4 py-3 text-sm text-slate-300">{fmt(row.L, 3)} m</td>
                  <td className="border-b border-slate-800 px-4 py-3 text-sm text-slate-300">{fmt(row.AE, 3)} kN</td>
                  <td className="border-b border-slate-800 px-4 py-3 text-sm text-orange-300">{fmt(row.contributionMm, 4)} mm</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  if (result.kind === 'beam_unit') {
    const rows = result.values.filter((_, index) => index % 70 === 0)

    return (
      <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
        <h2 className="text-2xl font-black text-white">Beam Unit Load Key Values</h2>

        <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-800">
          <table className="w-full min-w-[900px] border-collapse text-left">
            <thead className="bg-slate-950">
              <tr>
                <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">x</th>
                <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">M</th>
                <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">m</th>
                <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">Mm/EI</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row) => (
                <tr key={row.x} className="bg-slate-900/50">
                  <td className="border-b border-slate-800 px-4 py-3 text-sm text-orange-300">{fmt(row.x, 3)} m</td>
                  <td className="border-b border-slate-800 px-4 py-3 text-sm text-slate-300">{fmt(row.M, 3)} kN·m</td>
                  <td className="border-b border-slate-800 px-4 py-3 text-sm text-slate-300">{fmt(row.m, 3)}</td>
                  <td className="border-b border-slate-800 px-4 py-3 text-sm text-slate-300">{fmt(row.product, 8)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  return null
}

function ActionButtons({ result, form }) {
  const plainReport = buildPlainReport(result, form)

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-black text-white">Export & Share</h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Copy answer, copy full solution, or print/save the report as PDF.
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

function FormulaAndSteps({ result }) {
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
      </div>
    </div>
  )
}

export default function EnergyMethodPage() {
  const [form, setForm] = useState({
    reportTitle: 'Energy Method Analysis',
    preparedBy: '',
    mode: 'beam_unit',
    beamType: 'simple',
    targetType: 'deflection',
    L: 6,
    x: 3,
    E: 200,
    I: 300,
    loads: defaultBeamLoads,
    trussMembers: defaultTrussMembers,
    axial: {
      P: 100,
      L: 3,
      A: 500,
      E: 200,
    },
    cast: {
      caseType: 'cantilever_point',
      P: 20,
      w: 5,
      L: 3,
      E: 200,
      I: 300,
      A: 500,
    },
    superRows: defaultSuperRows,
  })

  const result = useMemo(() => solveCurrent(form), [form])

  const updateForm = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const updateNested = (group, key, value) => {
    setForm((prev) => ({
      ...prev,
      [group]: {
        ...prev[group],
        [key]: value,
      },
    }))
  }

  const addLoad = (type) => {
    setForm((prev) => ({
      ...prev,
      loads: [...prev.loads, createLoad(type, toNum(prev.L, 6))],
    }))
  }

  const updateLoad = (id, key, value) => {
    setForm((prev) => ({
      ...prev,
      loads: prev.loads.map((load) =>
        load.id === id ? { ...load, [key]: value } : load
      ),
    }))
  }

  const deleteLoad = (id) => {
    setForm((prev) => ({
      ...prev,
      loads: prev.loads.length > 1 ? prev.loads.filter((load) => load.id !== id) : prev.loads,
    }))
  }

  const addTrussMember = () => {
    setForm((prev) => ({
      ...prev,
      trussMembers: [
        ...prev.trussMembers,
        {
          id: `m-${Date.now()}`,
          name: `M${prev.trussMembers.length + 1}`,
          F: 10,
          f: 0.2,
          L: 3,
          A: 500,
          E: 200,
        },
      ],
    }))
  }

  const updateTrussMember = (id, key, value) => {
    setForm((prev) => ({
      ...prev,
      trussMembers: prev.trussMembers.map((row) =>
        row.id === id ? { ...row, [key]: value } : row
      ),
    }))
  }

  const deleteTrussMember = (id) => {
    setForm((prev) => ({
      ...prev,
      trussMembers: prev.trussMembers.length > 1 ? prev.trussMembers.filter((row) => row.id !== id) : prev.trussMembers,
    }))
  }

  const addSuperRow = () => {
    setForm((prev) => ({
      ...prev,
      superRows: [
        ...prev.superRows,
        {
          id: `s-${Date.now()}`,
          name: `Load Case ${prev.superRows.length + 1}`,
          deflection: 0,
        },
      ],
    }))
  }

  const updateSuperRow = (id, key, value) => {
    setForm((prev) => ({
      ...prev,
      superRows: prev.superRows.map((row) =>
        row.id === id ? { ...row, [key]: value } : row
      ),
    }))
  }

  const deleteSuperRow = (id) => {
    setForm((prev) => ({
      ...prev,
      superRows: prev.superRows.length > 1 ? prev.superRows.filter((row) => row.id !== id) : prev.superRows,
    }))
  }

  return (
    <main className="min-h-screen bg-[#050B1F] px-4 py-8 text-white md:px-8">
      <section className="mx-auto max-w-7xl">
        <div className="mb-8 rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 md:p-8">
          <p className="mb-3 text-sm font-extrabold uppercase tracking-widest text-orange-400">
            Structural Analysis Energy Methods
          </p>

          <h1 className="text-3xl font-black leading-tight md:text-5xl">
            Energy Method & Unit Load Method Calculator
          </h1>

          <p className="mt-4 max-w-4xl text-base leading-8 text-slate-300 md:text-lg">
            Solve beam deflection, truss deflection, axial strain energy, beam bending energy,
            Castigliano theorem, Maxwell/Betti concepts and superposition method with diagrams and exam-style solution.
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
                  placeholder="Example: Beam Deflection by Unit Load Method"
                />

                <TextField
                  label="Prepared By"
                  value={form.preparedBy}
                  onChange={(value) => updateForm('preparedBy', value)}
                  placeholder="Your name"
                />

                <SelectField
                  label="Problem Type"
                  value={form.mode}
                  onChange={(value) => updateForm('mode', value)}
                  helper="Select the energy method topic you want to solve."
                >
                  <option value="beam_unit">Beam Deflection by Unit Load Method</option>
                  <option value="truss_unit">Truss Deflection by Unit Load Method</option>
                  <option value="axial_energy">Axial Bar Strain Energy</option>
                  <option value="beam_energy">Beam Bending Strain Energy</option>
                  <option value="castigliano">Castigliano’s Theorem</option>
                  <option value="superposition">Method of Superposition</option>
                  <option value="theory">Maxwell / Betti / Virtual Work Notes</option>
                </SelectField>
              </div>
            </div>

            {(form.mode === 'beam_unit' || form.mode === 'beam_energy') && (
              <>
                <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
                  <h2 className="text-2xl font-black text-white">Beam Setup</h2>

                  <div className="mt-6 space-y-5">
                    <SelectField label="Beam Type" value={form.beamType} onChange={(value) => updateForm('beamType', value)}>
                      <option value="simple">Simply Supported Beam</option>
                      <option value="cantilever">Cantilever Beam</option>
                    </SelectField>

                    {form.mode === 'beam_unit' && (
                      <SelectField label="Find" value={form.targetType} onChange={(value) => updateForm('targetType', value)}>
                        <option value="deflection">Deflection using Unit Load</option>
                        <option value="rotation">Rotation using Unit Moment</option>
                      </SelectField>
                    )}

                    <NumberField label="Beam Span L" value={form.L} onChange={(value) => updateForm('L', value)} suffix="m" min="0.1" />

                    {form.mode === 'beam_unit' && (
                      <NumberField label="Target Section x" value={form.x} onChange={(value) => updateForm('x', value)} suffix="m" min="0" />
                    )}

                    <NumberField label="Modulus E" value={form.E} onChange={(value) => updateForm('E', value)} suffix="GPa" min="0.001" />

                    <NumberField label="Moment of Inertia I" value={form.I} onChange={(value) => updateForm('I', value)} suffix="×10⁶ mm⁴" min="0.001" />
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
                  <h2 className="text-2xl font-black text-white">Beam Load Builder</h2>

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
                        L={toNum(form.L, 6)}
                        onChange={updateLoad}
                        onDelete={deleteLoad}
                      />
                    ))}
                  </div>
                </div>
              </>
            )}

            {form.mode === 'truss_unit' && (
              <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-2xl font-black text-white">Truss Members</h2>
                  <button type="button" onClick={addTrussMember} className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-black text-white hover:bg-orange-600">
                    + Member
                  </button>
                </div>

                <div className="mt-6 space-y-5">
                  {form.trussMembers.map((row, index) => (
                    <TrussMemberEditor
                      key={row.id}
                      row={row}
                      index={index}
                      onChange={updateTrussMember}
                      onDelete={deleteTrussMember}
                    />
                  ))}
                </div>
              </div>
            )}

            {form.mode === 'axial_energy' && (
              <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
                <h2 className="text-2xl font-black text-white">Axial Bar Inputs</h2>

                <div className="mt-6 space-y-5">
                  <NumberField label="Axial Load P" value={form.axial.P} onChange={(value) => updateNested('axial', 'P', value)} suffix="kN" min="0" />
                  <NumberField label="Length L" value={form.axial.L} onChange={(value) => updateNested('axial', 'L', value)} suffix="m" min="0.001" />
                  <NumberField label="Area A" value={form.axial.A} onChange={(value) => updateNested('axial', 'A', value)} suffix="mm²" min="0.001" />
                  <NumberField label="Modulus E" value={form.axial.E} onChange={(value) => updateNested('axial', 'E', value)} suffix="GPa" min="0.001" />
                </div>
              </div>
            )}

            {form.mode === 'castigliano' && (
              <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
                <h2 className="text-2xl font-black text-white">Castigliano Inputs</h2>

                <div className="mt-6 space-y-5">
                  <SelectField label="Case" value={form.cast.caseType} onChange={(value) => updateNested('cast', 'caseType', value)}>
                    <option value="axial">Axial Bar</option>
                    <option value="cantilever_point">Cantilever with End Point Load</option>
                    <option value="ss_central_point">Simply Supported Beam with Central Point Load</option>
                    <option value="cantilever_udl">Cantilever with UDL</option>
                  </SelectField>

                  <NumberField label="Point Load P" value={form.cast.P} onChange={(value) => updateNested('cast', 'P', value)} suffix="kN" min="0" />
                  <NumberField label="UDL w" value={form.cast.w} onChange={(value) => updateNested('cast', 'w', value)} suffix="kN/m" min="0" />
                  <NumberField label="Length L" value={form.cast.L} onChange={(value) => updateNested('cast', 'L', value)} suffix="m" min="0.001" />
                  <NumberField label="Modulus E" value={form.cast.E} onChange={(value) => updateNested('cast', 'E', value)} suffix="GPa" min="0.001" />
                  <NumberField label="Moment of Inertia I" value={form.cast.I} onChange={(value) => updateNested('cast', 'I', value)} suffix="×10⁶ mm⁴" min="0.001" />
                  <NumberField label="Area A" value={form.cast.A} onChange={(value) => updateNested('cast', 'A', value)} suffix="mm²" min="0.001" />
                </div>
              </div>
            )}

            {form.mode === 'superposition' && (
              <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-2xl font-black text-white">Load Cases</h2>
                  <button type="button" onClick={addSuperRow} className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-black text-white hover:bg-orange-600">
                    + Case
                  </button>
                </div>

                <div className="mt-6 space-y-5">
                  {form.superRows.map((row, index) => (
                    <SuperRowEditor
                      key={row.id}
                      row={row}
                      index={index}
                      onChange={updateSuperRow}
                      onDelete={deleteSuperRow}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
              <h2 className="text-xl font-black text-white">What This Tool Covers</h2>

              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
                <li>✓ Beam unit load method</li>
                <li>✓ Truss unit load method</li>
                <li>✓ Axial strain energy</li>
                <li>✓ Beam bending strain energy</li>
                <li>✓ Castigliano theorem</li>
                <li>✓ Maxwell and Betti theorem notes</li>
                <li>✓ Superposition method</li>
                <li>✓ Diagrams and contribution charts</li>
                <li>✓ Copy / Print / Save PDF</li>
              </ul>
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

            <ActionButtons result={result} form={form} />

            {(result.kind === 'beam_unit' || result.kind === 'beam_energy') && (
              <>
                <BeamDiagram result={result} />

                <div className="grid gap-6 xl:grid-cols-2">
                  <CurveDiagram result={result} type="realM" />
                  {result.kind === 'beam_unit' ? (
                    <CurveDiagram result={result} type="unitM" />
                  ) : (
                    <CurveDiagram result={result} type="energyDensity" />
                  )}
                </div>

                {result.kind === 'beam_unit' && <CurveDiagram result={result} type="product" />}
              </>
            )}

            <TrussContributionDiagram result={result} />
            <ConceptDiagram result={result} />
            <ResultTables result={result} />

            <FormulaAndSteps result={result} />

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
          </section>
        </div>
      </section>
    </main>
  )
}
