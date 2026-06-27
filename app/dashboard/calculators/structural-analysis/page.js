'use client'

import { useMemo, useState } from 'react'

const topicCards = [
  'Support Reactions',
  'Point Loads',
  'UDL Loads',
  'UVL / Trapezoidal Loads',
  'Moment Loads',
  'Combined Loading',
  'SFD',
  'BMD',
  'Section Values',
  'Free Body Diagram',
  'Sign Convention',
  'Exam Solution',
]

const defaultLoads = [
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

function createLoad(type) {
  return {
    id: `load-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    type,
    P: type === 'point' ? 20 : 10,
    x: 2,
    w: 5,
    w1: type === 'uvl' ? 0 : 5,
    w2: type === 'uvl' ? 10 : 5,
    start: 0,
    end: 6,
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
      label: `Point load ${fmt(load.P)} kN at x = ${fmt(load.x)} m`,
    }
  }

  if (load.type === 'udl') {
    const W = load.w * load.length
    const xBar = load.start + load.length / 2

    return {
      W,
      xBar,
      label: `UDL ${fmt(load.w)} kN/m from ${fmt(load.start)} m to ${fmt(load.end)} m`,
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
      label: `UVL/Trapezoidal load ${fmt(load.w1)} to ${fmt(load.w2)} kN/m from ${fmt(load.start)} m to ${fmt(load.end)} m`,
    }
  }

  const signedMoment = getMomentSign(load) * load.M

  return {
    W: 0,
    xBar: load.x,
    signedMoment,
    label: `${load.direction === 'clockwise' ? 'Clockwise' : 'Anticlockwise'} moment ${fmt(load.M)} kN·m at x = ${fmt(load.x)} m`,
  }
}

function partialDistributedLoad(load, fromX, toX) {
  const a = clamp(fromX, load.start, load.end)
  const b = clamp(toX, load.start, load.end)

  if (b <= a) {
    return { W: 0, firstMoment: 0 }
  }

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

    const W = integrateLoad(b) - integrateLoad(a)
    const firstMoment = integrateMoment(b) - integrateMoment(a)

    return { W, firstMoment }
  }

  return { W: 0, firstMoment: 0 }
}

function shearMomentAt(result, rawX, side = 'right') {
  const L = result.L
  const x = clamp(rawX, 0, L)
  const eps = 0.000001
  const checkX = side === 'left' ? Math.max(0, x - eps) : Math.min(L, x + eps)

  if (result.beamType === 'simple') {
    let V = result.RA
    let M = result.RA * x

    result.loads.forEach((load) => {
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
        if (checkX >= load.x) {
          M += getMomentSign(load) * load.M
        }
      }
    })

    return { shear: V, moment: M }
  }

  let V = 0
  let M = 0

  result.loads.forEach((load) => {
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
      if (checkX <= load.x) {
        M -= getMomentSign(load) * load.M
      }
    }
  })

  return { shear: V, moment: M }
}

function solveBeam(form) {
  const L = Math.max(toNum(form.L, 6), 0.1)
  const beamType = form.beamType === 'cantilever' ? 'cantilever' : 'simple'
  const loads = form.loads.map((load) => normalizeLoad(load, L))

  const resultants = loads.map((load) => ({
    load,
    ...getLoadResultant(load),
  }))

  const verticalResultants = resultants.filter((item) => item.load.type !== 'moment')
  const momentResultants = resultants.filter((item) => item.load.type === 'moment')

  const totalLoad = verticalResultants.reduce((sum, item) => sum + item.W, 0)
  const loadMomentAboutA = verticalResultants.reduce((sum, item) => sum + item.W * item.xBar, 0)
  const appliedMomentSum = momentResultants.reduce(
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

  const baseResult = {
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

  const sampleXs = []
  for (let i = 0; i <= 260; i += 1) {
    sampleXs.push((L * i) / 260)
  }

  loads.forEach((load) => {
    if (load.type === 'point' || load.type === 'moment') {
      sampleXs.push(load.x)
    }

    if (load.type === 'udl' || load.type === 'uvl') {
      sampleXs.push(load.start, load.end, (load.start + load.end) / 2)
    }
  })

  const uniqueXs = [...new Set(sampleXs.map((x) => Number(clamp(x, 0, L).toFixed(6))))].sort((a, b) => a - b)

  const values = uniqueXs.map((x) => ({
    x,
    ...shearMomentAt(baseResult, x),
  }))

  const maxPositiveBM = values.reduce((best, item) => (item.moment > best.moment ? item : best), values[0])
  const maxNegativeBM = values.reduce((best, item) => (item.moment < best.moment ? item : best), values[0])
  const maxAbsBM = values.reduce((best, item) => (Math.abs(item.moment) > Math.abs(best.moment) ? item : best), values[0])
  const maxAbsSF = values.reduce((best, item) => (Math.abs(item.shear) > Math.abs(best.shear) ? item : best), values[0])

  const sectionX = clamp(toNum(form.x, L / 2), 0, L)
  const section = shearMomentAt(baseResult, sectionX)

  const warnings = []

  loads.forEach((load, index) => {
    if ((load.type === 'udl' || load.type === 'uvl') && load.length <= 0) {
      warnings.push(`Load ${index + 1}: start and end position cannot be same.`)
    }
  })

  if (beamType === 'simple' && (RA < 0 || RB < 0)) {
    warnings.push('One support reaction is negative. This means uplift may occur for the given loading.')
  }

  return {
    ...baseResult,
    values,
    maxPositiveBM,
    maxNegativeBM,
    maxAbsBM,
    maxAbsSF,
    sectionX,
    section,
    warnings,
    summary:
      beamType === 'simple'
        ? [
            { label: 'Total Downward Load', value: `${fmt(totalLoad)} kN` },
            { label: 'Left Reaction RA', value: `${fmt(RA)} kN` },
            { label: 'Right Reaction RB', value: `${fmt(RB)} kN` },
            { label: 'Max |BM|', value: `${fmt(maxAbsBM?.moment || 0)} kN·m` },
          ]
        : [
            { label: 'Total Downward Load', value: `${fmt(totalLoad)} kN` },
            { label: 'Fixed Reaction', value: `${fmt(RA)} kN` },
            { label: 'Fixed End Moment', value: `${fmt(fixedMoment)} kN·m` },
            { label: 'Max |BM|', value: `${fmt(maxAbsBM?.moment || 0)} kN·m` },
          ],
    formulas:
      beamType === 'simple'
        ? [
            'Resultant of UDL = w × loaded length',
            'Resultant of UVL/trapezoidal load = (w1 + w2) × loaded length / 2',
            'Centroid of UVL from start = Lload × (w1 + 2w2) / [3(w1 + w2)]',
            'Taking moment about A: RB × L = Σ(W × x̄) + ΣMclockwise',
            'RA = ΣW - RB',
            'At any section x: SF = RA - loads acting before x',
            'At any section x: BM = RA × x - moment of loads before x ± applied moments',
          ]
        : [
            'Fixed reaction = ΣW',
            'Fixed end moment = Σ(W × x̄) + ΣMclockwise',
            'For cantilever section x: SF = loads acting on right side of section',
            'For cantilever section x: BM = moment of loads acting on right side of section',
            'UDL resultant = w × loaded length',
            'UVL/trapezoidal resultant = (w1 + w2) × loaded length / 2',
          ],
    steps: [
      `Beam type selected: ${beamType === 'simple' ? 'Simply Supported Beam' : 'Cantilever Beam'}.`,
      `Beam span L = ${fmt(L)} m.`,
      `Total downward vertical load ΣW = ${fmt(totalLoad)} kN.`,
      `Moment of vertical loads about left/fixed support = Σ(W × x̄) = ${fmt(loadMomentAboutA)} kN·m.`,
      `Net applied moment using clockwise positive convention = ${fmt(appliedMomentSum)} kN·m.`,
      beamType === 'simple'
        ? `Right reaction RB = [Σ(W × x̄) + ΣMclockwise] / L = ${fmt(RB)} kN.`
        : `Fixed end moment = Σ(W × x̄) + ΣMclockwise = ${fmt(fixedMoment)} kN·m.`,
      beamType === 'simple'
        ? `Left reaction RA = ΣW - RB = ${fmt(RA)} kN.`
        : `Fixed vertical reaction = ΣW = ${fmt(RA)} kN.`,
      `At selected section x = ${fmt(sectionX)} m, SF = ${fmt(section.shear)} kN and BM = ${fmt(section.moment)} kN·m.`,
      `Maximum absolute bending moment from sampled diagram = ${fmt(maxAbsBM?.moment || 0)} kN·m at x = ${fmt(maxAbsBM?.x || 0)} m.`,
    ],
    examAnswer:
      beamType === 'simple'
        ? `For the given combined loading, total downward load is ${fmt(totalLoad)} kN. Support reactions are RA = ${fmt(RA)} kN and RB = ${fmt(RB)} kN. At x = ${fmt(sectionX)} m, shear force is ${fmt(section.shear)} kN and bending moment is ${fmt(section.moment)} kN·m. Maximum absolute bending moment is ${fmt(maxAbsBM?.moment || 0)} kN·m at x = ${fmt(maxAbsBM?.x || 0)} m.`
        : `For the given cantilever loading, fixed vertical reaction is ${fmt(RA)} kN and fixed end moment is ${fmt(fixedMoment)} kN·m. At x = ${fmt(sectionX)} m from fixed support, shear force is ${fmt(section.shear)} kN and bending moment is ${fmt(section.moment)} kN·m. Maximum absolute bending moment is ${fmt(maxAbsBM?.moment || 0)} kN·m at x = ${fmt(maxAbsBM?.x || 0)} m.`,
  }
}

function getKeyRows(result) {
  const xs = [0, result.sectionX, result.L]

  result.loads.forEach((load) => {
    if (load.type === 'point' || load.type === 'moment') {
      xs.push(load.x)
    }

    if (load.type === 'udl' || load.type === 'uvl') {
      xs.push(load.start, (load.start + load.end) / 2, load.end)
    }
  })

  const uniqueXs = [...new Set(xs.map((x) => Number(clamp(x, 0, result.L).toFixed(6))))].sort((a, b) => a - b)

  return uniqueXs.map((x) => {
    const value = shearMomentAt(result, x)
    return {
      x,
      shear: value.shear,
      moment: value.moment,
      point:
        x === 0
          ? result.beamType === 'simple'
            ? 'Support A'
            : 'Fixed Support'
          : x === result.L
            ? result.beamType === 'simple'
              ? 'Support B'
              : 'Free End'
            : Math.abs(x - result.sectionX) < 0.000001
              ? 'Selected Section'
              : 'Load / Key Point',
    }
  })
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
  const update = (key, value) => {
    onChange(load.id, key, value)
  }

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
              helper="Downward concentrated load."
              min="0"
            />

            <NumberField
              label="Position x"
              value={load.x}
              onChange={(value) => update('x', value)}
              suffix="m"
              helper={`Position from left/fixed support. Keep between 0 and ${fmt(L)} m.`}
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
              helper="Uniform load intensity."
              min="0"
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <NumberField
                label="Start Position"
                value={load.start}
                onChange={(value) => update('start', value)}
                suffix="m"
                helper="Load start from support."
                min="0"
              />

              <NumberField
                label="End Position"
                value={load.end}
                onChange={(value) => update('end', value)}
                suffix="m"
                helper="Load end from support."
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
                helper="Intensity at start."
                min="0"
              />

              <NumberField
                label="End Intensity w2"
                value={load.w2}
                onChange={(value) => update('w2', value)}
                suffix="kN/m"
                helper="Intensity at end."
                min="0"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <NumberField
                label="Start Position"
                value={load.start}
                onChange={(value) => update('start', value)}
                suffix="m"
                helper="UVL start position."
                min="0"
              />

              <NumberField
                label="End Position"
                value={load.end}
                onChange={(value) => update('end', value)}
                suffix="m"
                helper="UVL end position."
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
              helper="Applied concentrated moment."
              min="0"
            />

            <NumberField
              label="Position x"
              value={load.x}
              onChange={(value) => update('x', value)}
              suffix="m"
              helper="Moment position from left/fixed support."
              min="0"
            />

            <SelectField
              label="Moment Direction"
              value={load.direction}
              onChange={(value) => update('direction', value)}
              helper="Clockwise is taken as positive for reaction calculation."
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

function BeamSketch({ result }) {
  const x0 = 70
  const x1 = 570
  const y = 125
  const L = result.L || 1
  const mapX = (x) => x0 + (x / L) * (x1 - x0)
  const isSimple = result.beamType === 'simple'

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-950 p-4">
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-black text-white">Combined Beam Loading Diagram</h3>
        <span className="rounded-full bg-orange-500/10 px-3 py-1 text-xs font-bold text-orange-300">
          Dynamic load builder
        </span>
      </div>

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
            <text x={x0 - 45} y={y + 82} fill="#e2e8f0" fontSize="14" fontWeight="700">
              Fixed
            </text>
          </>
        )}

        {result.loads.map((load, index) => {
          if (load.type === 'point') {
            const lx = mapX(load.x)
            return (
              <g key={load.id}>
                <line x1={lx} y1="38" x2={lx} y2={y - 8} stroke="#f97316" strokeWidth="4" />
                <polygon points={`${lx - 9},${y - 18} ${lx + 9},${y - 18} ${lx},${y - 4}`} fill="#f97316" />
                <text x={lx - 28} y="28" fill="#fed7aa" fontSize="13" fontWeight="800">
                  P{index + 1}={fmt(load.P)}
                </text>
                <text x={lx - 20} y={y + 92} fill="#bfdbfe" fontSize="12" fontWeight="700">
                  x={fmt(load.x)}
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
                <rect x={sx} y="48" width={Math.max(ex - sx, 0)} height={y - 58} fill="rgba(249,115,22,0.08)" />
                <line x1={sx} y1="48" x2={ex} y2="48" stroke="#f97316" strokeWidth="3" />
                {positions.map((px) => (
                  <g key={px}>
                    <line x1={px} y1="50" x2={px} y2={y - 8} stroke="#f97316" strokeWidth="2.5" />
                    <polygon points={`${px - 6},${y - 18} ${px + 6},${y - 18} ${px},${y - 6}`} fill="#f97316" />
                  </g>
                ))}
                <text x={sx + 6} y="38" fill="#fed7aa" fontSize="13" fontWeight="800">
                  UDL {fmt(load.w)} kN/m
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
            const positions = Array.from({ length: 7 }, (_, i) => {
              const ratio = i / 6
              return {
                px: sx + (ex - sx) * ratio,
                h: h1 + (h2 - h1) * ratio,
              }
            })

            return (
              <g key={load.id}>
                <polygon
                  points={`${sx},${y - 8} ${sx},${y - h1} ${ex},${y - h2} ${ex},${y - 8}`}
                  fill="rgba(249,115,22,0.12)"
                  stroke="#f97316"
                  strokeWidth="2"
                />
                {positions.map((item) => (
                  <g key={item.px}>
                    <line x1={item.px} y1={y - item.h} x2={item.px} y2={y - 8} stroke="#f97316" strokeWidth="2.5" />
                    <polygon points={`${item.px - 6},${y - 18} ${item.px + 6},${y - 18} ${item.px},${y - 6}`} fill="#f97316" />
                  </g>
                ))}
                <text x={sx + 6} y="35" fill="#fed7aa" fontSize="13" fontWeight="800">
                  UVL {fmt(load.w1)}→{fmt(load.w2)}
                </text>
              </g>
            )
          }

          const lx = mapX(load.x)
          const clockwise = load.direction === 'clockwise'

          return (
            <g key={load.id}>
              <path
                d={
                  clockwise
                    ? `M ${lx - 25} ${y - 35} A 26 26 0 1 1 ${lx + 20} ${y - 15}`
                    : `M ${lx + 25} ${y - 35} A 26 26 0 1 0 ${lx - 20} ${y - 15}`
                }
                fill="none"
                stroke="#a78bfa"
                strokeWidth="4"
              />
              <polygon
                points={
                  clockwise
                    ? `${lx + 15},${y - 5} ${lx + 30},${y - 12} ${lx + 18},${y - 22}`
                    : `${lx - 15},${y - 5} ${lx - 30},${y - 12} ${lx - 18},${y - 22}`
                }
                fill="#a78bfa"
              />
              <text x={lx - 32} y={y - 55} fill="#ddd6fe" fontSize="13" fontWeight="800">
                M={fmt(load.M)}
              </text>
            </g>
          )
        })}

        <line x1={x0} y1={y + 105} x2={x1} y2={y + 105} stroke="#64748b" strokeWidth="2" />
        <line x1={x0} y1={y + 97} x2={x0} y2={y + 113} stroke="#64748b" strokeWidth="2" />
        <line x1={x1} y1={y + 97} x2={x1} y2={y + 113} stroke="#64748b" strokeWidth="2" />
        <text x={(x0 + x1) / 2 - 20} y={y + 130} fill="#f97316" fontSize="14" fontWeight="800">
          L = {fmt(result.L)} m
        </text>

        <text x="18" y="245" fill="#94a3b8" fontSize="13">
          Point load, UDL, UVL/trapezoidal load and moment load can act together.
        </text>
      </svg>
    </div>
  )
}

function Diagram({ result, type }) {
  const x0 = 70
  const x1 = 570
  const yBase = 110
  const amp = 72
  const L = result.L || 1
  const mapX = (x) => x0 + (x / L) * (x1 - x0)

  const values = result.values || []
  const maxAbs = Math.max(...values.map((item) => Math.abs(type === 'sfd' ? item.shear : item.moment)), 1)

  const points = values
    .map((item) => {
      const value = type === 'sfd' ? item.shear : item.moment
      const y = type === 'sfd' ? yBase - (value / maxAbs) * amp : yBase + (value / maxAbs) * amp
      return `${mapX(item.x)},${y}`
    })
    .join(' ')

  const title = type === 'sfd' ? 'Shear Force Diagram' : 'Bending Moment Diagram'
  const color = type === 'sfd' ? '#f97316' : '#38bdf8'

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-950 p-4">
      <h3 className="mb-3 text-lg font-black text-white">{title}</h3>

      <svg viewBox="0 0 640 240" className="h-auto w-full">
        <line x1={x0} y1={yBase} x2={x1} y2={yBase} stroke="#64748b" strokeWidth="2" strokeDasharray="6 6" />
        <line x1={x0} y1="30" x2={x0} y2="190" stroke="#334155" strokeWidth="2" />
        <line x1={x1} y1="30" x2={x1} y2="190" stroke="#334155" strokeWidth="2" />

        <polyline points={points} fill="none" stroke={color} strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" />

        {result.loads.map((load) => {
          if (load.type === 'point' || load.type === 'moment') {
            return (
              <line
                key={load.id}
                x1={mapX(load.x)}
                y1="34"
                x2={mapX(load.x)}
                y2="190"
                stroke="#475569"
                strokeWidth="1.5"
                strokeDasharray="5 5"
              />
            )
          }

          return (
            <g key={load.id}>
              <line x1={mapX(load.start)} y1="34" x2={mapX(load.start)} y2="190" stroke="#475569" strokeWidth="1.2" strokeDasharray="5 5" />
              <line x1={mapX(load.end)} y1="34" x2={mapX(load.end)} y2="190" stroke="#475569" strokeWidth="1.2" strokeDasharray="5 5" />
            </g>
          )
        })}

        <text x={x0 - 10} y="212" fill="#cbd5e1" fontSize="13" fontWeight="700">
          {result.beamType === 'simple' ? 'A' : 'Fixed'}
        </text>
        <text x={x1 - 16} y="212" fill="#cbd5e1" fontSize="13" fontWeight="700">
          {result.beamType === 'simple' ? 'B' : 'Free'}
        </text>

        <text x="18" y="22" fill="#94a3b8" fontSize="13">
          {type === 'sfd'
            ? 'SFD is generated by sampling combined loading along the beam.'
            : 'BMD is generated by sampling combined loading along the beam.'}
        </text>
      </svg>
    </div>
  )
}

function LoadSummaryTable({ result }) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
      <h2 className="text-2xl font-black text-white">Load Resultant Summary</h2>
      <p className="mt-2 text-sm leading-6 text-slate-400">
        Every distributed load is converted into an equivalent resultant for reaction calculation.
      </p>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-800">
        <table className="w-full min-w-[760px] border-collapse text-left">
          <thead className="bg-slate-950">
            <tr>
              <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">Load</th>
              <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">Resultant W</th>
              <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">Location x̄</th>
              <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">Moment About A/Fixed</th>
            </tr>
          </thead>

          <tbody>
            {result.resultants.map((item, index) => (
              <tr key={item.load.id} className="bg-slate-900/50">
                <td className="border-b border-slate-800 px-4 py-3 text-sm font-bold text-slate-200">
                  {index + 1}. {item.label}
                </td>
                <td className="border-b border-slate-800 px-4 py-3 text-sm text-orange-300">
                  {item.load.type === 'moment' ? '-' : `${fmt(item.W)} kN`}
                </td>
                <td className="border-b border-slate-800 px-4 py-3 text-sm text-slate-300">
                  {fmt(item.xBar)} m
                </td>
                <td className="border-b border-slate-800 px-4 py-3 text-sm text-slate-300">
                  {item.load.type === 'moment'
                    ? `${fmt(getMomentSign(item.load) * item.load.M)} kN·m`
                    : `${fmt(item.W * item.xBar)} kN·m`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function KeyValuesTable({ result }) {
  const rows = getKeyRows(result)

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-2xl font-black text-white">SFD & BMD Key Values</h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Important values at supports, load positions, distributed load boundaries and selected section.
          </p>
        </div>

        <div className="rounded-2xl border border-orange-500/30 bg-orange-500/10 px-4 py-3 text-sm leading-6 text-orange-100">
          Clockwise moment is taken positive for reaction calculation.
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
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr key={`${row.x}-${row.point}`} className="bg-slate-900/50">
                <td className="border-b border-slate-800 px-4 py-3 text-sm font-bold text-slate-200">{row.point}</td>
                <td className="border-b border-slate-800 px-4 py-3 text-sm text-orange-300">{fmt(row.x)} m</td>
                <td className="border-b border-slate-800 px-4 py-3 text-sm text-slate-300">{fmt(row.shear)} kN</td>
                <td className="border-b border-slate-800 px-4 py-3 text-sm text-slate-300">{fmt(row.moment)} kN·m</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 rounded-2xl border border-sky-500/30 bg-sky-500/10 p-5">
        <h3 className="text-xl font-black text-white">Selected Section x = {fmt(result.sectionX)} m</h3>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
            <p className="text-sm text-slate-400">Shear Force at Section</p>
            <p className="mt-2 text-2xl font-black text-sky-300">{fmt(result.section.shear)} kN</p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
            <p className="text-sm text-slate-400">Bending Moment at Section</p>
            <p className="mt-2 text-2xl font-black text-sky-300">{fmt(result.section.moment)} kN·m</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function FormulaLibrary() {
  const formulas = [
    ['Equilibrium', 'ΣV = 0, ΣM = 0'],
    ['Point load', 'W = P at given x'],
    ['UDL resultant', 'W = w × loaded length, x̄ = mid-point'],
    ['UVL / trapezoidal resultant', 'W = (w1 + w2)L/2'],
    ['UVL centroid', 'x̄ from start = L(w1 + 2w2) / [3(w1 + w2)]'],
    ['Simply supported reaction', 'RB = [Σ(Wx̄) + ΣMclockwise] / L'],
    ['Left reaction', 'RA = ΣW - RB'],
    ['Cantilever reaction', 'R = ΣW'],
    ['Cantilever fixed moment', 'Mfixed = Σ(Wx̄) + ΣMclockwise'],
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
    beamType: 'simple',
    L: 6,
    x: 3,
    loads: defaultLoads,
  })

  const result = useMemo(() => solveBeam(form), [form])

  const updateForm = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const addLoad = (type) => {
    setForm((prev) => ({
      ...prev,
      loads: [...prev.loads, createLoad(type)],
    }))
  }

  const updateLoad = (id, key, value) => {
    setForm((prev) => ({
      ...prev,
      loads: prev.loads.map((load) =>
        load.id === id
          ? {
              ...load,
              [key]: value,
            }
          : load
      ),
    }))
  }

  const deleteLoad = (id) => {
    setForm((prev) => ({
      ...prev,
      loads: prev.loads.length > 1 ? prev.loads.filter((load) => load.id !== id) : prev.loads,
    }))
  }

  const reset = () => {
    setForm({
      beamType: 'simple',
      L: 6,
      x: 3,
      loads: defaultLoads,
    })
  }

  return (
    <main className="min-h-screen bg-[#050B1F] px-4 py-8 text-white md:px-8">
      <section className="mx-auto max-w-7xl">
        <div className="mb-8 rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 md:p-8">
          <p className="mb-3 text-sm font-extrabold uppercase tracking-widest text-orange-400">
            Civil Engineering Beam Solver
          </p>

          <h1 className="text-3xl font-black leading-tight md:text-5xl">
            Structural Analysis Combined Load Calculator
          </h1>

          <p className="mt-4 max-w-4xl text-base leading-8 text-slate-300 md:text-lg">
            Add point loads, UDL, UVL/trapezoidal loads and moment loads together on one beam. Get support reactions, loading diagram, SFD, BMD, section values, formulas and exam-style solution.
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
              <h2 className="text-2xl font-black text-white">Beam Setup</h2>

              <div className="mt-6 space-y-5">
                <SelectField
                  label="Beam Type"
                  value={form.beamType}
                  onChange={(value) => updateForm('beamType', value)}
                  helper="Simply supported beam gives RA and RB. Cantilever gives fixed reaction and fixed end moment."
                >
                  <option value="simple">Simply Supported Beam</option>
                  <option value="cantilever">Cantilever Beam</option>
                </SelectField>

                <NumberField
                  label="Beam Span L"
                  value={form.L}
                  onChange={(value) => updateForm('L', value)}
                  suffix="m"
                  helper="Total length of beam."
                  min="0.1"
                />

                <NumberField
                  label={form.beamType === 'simple' ? 'Section x from Support A' : 'Section x from Fixed Support'}
                  value={form.x}
                  onChange={(value) => updateForm('x', value)}
                  suffix="m"
                  helper="Enter any section between 0 and L to get SF and BM."
                  min="0"
                />
              </div>

              {result.warnings.length > 0 && (
                <div className="mt-5 space-y-2">
                  {result.warnings.map((warning) => (
                    <div key={warning} className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-4 text-sm leading-6 text-yellow-100">
                      {warning}
                    </div>
                  ))}
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
              <h2 className="text-2xl font-black text-white">Load Builder</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Add multiple loads on the same beam. All loads are solved together.
              </p>

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

            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
              <h2 className="text-xl font-black text-white">What This Tool Solves</h2>

              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
                <li>✓ Simply supported beam</li>
                <li>✓ Cantilever beam</li>
                <li>✓ Multiple point loads</li>
                <li>✓ Partial and full-span UDL</li>
                <li>✓ UVL increasing / decreasing</li>
                <li>✓ Trapezoidal load using w1 and w2</li>
                <li>✓ Moment loads</li>
                <li>✓ Combined support reactions</li>
                <li>✓ SFD and BMD diagrams</li>
                <li>✓ SF and BM at any section x</li>
              </ul>
            </div>
          </aside>

          <section className="space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
              <h2 className="text-2xl font-black text-white">
                {result.beamType === 'simple' ? 'Simply Supported Beam Result' : 'Cantilever Beam Result'}
              </h2>

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

            <KeyValuesTable result={result} />

            <LoadSummaryTable result={result} />

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
