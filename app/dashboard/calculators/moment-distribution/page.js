'use client'

import { useMemo, useState } from 'react'
import { Calculator, Plus, Trash2, RotateCcw } from 'lucide-react'

const fmt = (v, d = 3) => {
  const n = Number(v)
  if (!Number.isFinite(n)) return '0'
  return n.toFixed(d).replace(/\.?0+$/, '')
}

const jointName = (i) => String.fromCharCode(65 + i)

function fixedEndMoments(span) {
  const L = Number(span.length) || 0
  const type = span.loadType

  if (L <= 0) return { left: 0, right: 0 }

  if (type === 'udl') {
    const w = Number(span.w) || 0
    return {
      left: -(w * L * L) / 12,
      right: (w * L * L) / 12,
    }
  }

  if (type === 'point') {
    const P = Number(span.P) || 0
    let a = Number(span.a) || L / 2
    if (a <= 0) a = L / 2
    if (a >= L) a = L / 2

    const b = L - a

    return {
      left: -(P * a * b * b) / (L * L),
      right: (P * a * a * b) / (L * L),
    }
  }

  return { left: 0, right: 0 }
}

function createInitialSpan(length = 5) {
  return {
    length,
    EI: 1,
    loadType: 'udl',
    w: 20,
    P: 50,
    a: length / 2,
  }
}

function runMomentDistribution(spans, joints, maxIterations = 20, tolerance = 0.001) {
  const n = spans.length

  let moments = spans.map((span) => {
    const fem = fixedEndMoments(span)
    return {
      left: fem.left,
      right: fem.right,
    }
  })

  const femTable = moments.map((m, i) => ({
    span: `${jointName(i)}${jointName(i + 1)}`,
    leftJoint: jointName(i),
    rightJoint: jointName(i + 1),
    FEMLeft: m.left,
    FEMRight: m.right,
  }))

  const distributionRows = []

  const getConnectedEnds = (jointIndex) => {
    const connected = []

    if (jointIndex > 0) {
      const spanIndex = jointIndex - 1
      const span = spans[spanIndex]
      const L = Number(span.length) || 1
      const EI = Number(span.EI) || 1

      connected.push({
        spanIndex,
        end: 'right',
        farEnd: 'left',
        farJoint: jointIndex - 1,
        stiffness: (4 * EI) / L,
        label: `${jointName(spanIndex + 1)}${jointName(spanIndex)}`,
      })
    }

    if (jointIndex < n) {
      const spanIndex = jointIndex
      const span = spans[spanIndex]
      const L = Number(span.length) || 1
      const EI = Number(span.EI) || 1

      connected.push({
        spanIndex,
        end: 'left',
        farEnd: 'right',
        farJoint: jointIndex + 1,
        stiffness: (4 * EI) / L,
        label: `${jointName(spanIndex)}${jointName(spanIndex + 1)}`,
      })
    }

    return connected
  }

  for (let iteration = 1; iteration <= maxIterations; iteration++) {
    let maxUnbalance = 0

    for (let j = 0; j <= n; j++) {
      if (joints[j] === 'fixed') continue

      const connected = getConnectedEnds(j)
      if (connected.length === 0) continue

      const jointMoment = connected.reduce((sum, item) => {
        return sum + moments[item.spanIndex][item.end]
      }, 0)

      maxUnbalance = Math.max(maxUnbalance, Math.abs(jointMoment))

      if (Math.abs(jointMoment) < tolerance) continue

      const totalStiffness = connected.reduce((sum, item) => sum + item.stiffness, 0)
      if (totalStiffness <= 0) continue

      const correctionTotal = -jointMoment

      connected.forEach((item) => {
        const df = item.stiffness / totalStiffness
        const distributedMoment = correctionTotal * df
        const carryOverMoment = distributedMoment / 2

        moments[item.spanIndex][item.end] += distributedMoment
        moments[item.spanIndex][item.farEnd] += carryOverMoment

        distributionRows.push({
          iteration,
          joint: jointName(j),
          member: item.label,
          unbalancedMoment: jointMoment,
          stiffness: item.stiffness,
          distributionFactor: df,
          distributedMoment,
          carryOverMoment,
          carryTo: jointName(item.farJoint),
        })
      })
    }

    if (maxUnbalance < tolerance) break
  }

  const finalMoments = moments.map((m, i) => ({
    span: `${jointName(i)}${jointName(i + 1)}`,
    leftJoint: jointName(i),
    rightJoint: jointName(i + 1),
    leftMoment: m.left,
    rightMoment: m.right,
  }))

  const jointBalance = Array.from({ length: n + 1 }, (_, j) => {
    let balance = 0

    if (j > 0) balance += moments[j - 1].right
    if (j < n) balance += moments[j].left

    return {
      joint: jointName(j),
      type: joints[j],
      balance,
    }
  })

  return {
    femTable,
    distributionRows,
    finalMoments,
    jointBalance,
  }
}

export default function MomentDistributionPage() {
  const [spans, setSpans] = useState([
    createInitialSpan(6),
    {
      length: 5,
      EI: 1,
      loadType: 'point',
      w: 20,
      P: 60,
      a: 2.5,
    },
  ])

  const [joints, setJoints] = useState(['rotating', 'rotating', 'rotating'])
  const [maxIterations, setMaxIterations] = useState(20)
  const [tolerance, setTolerance] = useState(0.001)

  const result = useMemo(() => {
    return runMomentDistribution(spans, joints, maxIterations, tolerance)
  }, [spans, joints, maxIterations, tolerance])

  const updateSpan = (index, key, value) => {
    setSpans((prev) =>
      prev.map((span, i) =>
        i === index
          ? {
              ...span,
              [key]: value,
            }
          : span
      )
    )
  }

  const updateJoint = (index, value) => {
    setJoints((prev) => prev.map((j, i) => (i === index ? value : j)))
  }

  const addSpan = () => {
    setSpans((prev) => [...prev, createInitialSpan(5)])

    setJoints((prev) => {
      const last = prev[prev.length - 1] || 'rotating'
      return [...prev.slice(0, -1), 'rotating', last]
    })
  }

  const removeSpan = (index) => {
    if (spans.length <= 1) return

    setSpans((prev) => prev.filter((_, i) => i !== index))
    setJoints((prev) => prev.slice(0, -1))
  }

  const resetExample = () => {
    setSpans([
      createInitialSpan(6),
      {
        length: 5,
        EI: 1,
        loadType: 'point',
        w: 20,
        P: 60,
        a: 2.5,
      },
    ])
    setJoints(['rotating', 'rotating', 'rotating'])
    setMaxIterations(20)
    setTolerance(0.001)
  }

  return (
    <div className="min-h-screen bg-[#050B1F] text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="rounded-3xl border border-orange-500/20 bg-gradient-to-br from-slate-900 via-slate-950 to-black p-6 shadow-2xl shadow-orange-500/10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-orange-300 text-sm mb-4">
                <Calculator size={16} />
                Structural Analysis Tool
              </div>

              <h1 className="text-3xl md:text-5xl font-black tracking-tight">
                Moment Distribution Method
              </h1>

              <p className="text-slate-400 mt-3 max-w-3xl">
                Continuous beam ke fixed end moments, distribution factors,
                carry-over moments aur final end moments automatic calculate karo.
              </p>
            </div>

            <button
              onClick={resetExample}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-200 hover:bg-slate-800"
            >
              <RotateCcw size={18} />
              Reset Example
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
              <div className="flex items-center justify-between gap-3 mb-5">
                <div>
                  <h2 className="text-xl font-bold">Span Input</h2>
                  <p className="text-slate-400 text-sm">
                    Har span ka length, relative EI aur load type enter karo.
                  </p>
                </div>

                <button
                  onClick={addSpan}
                  className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2 font-semibold text-black hover:bg-orange-400"
                >
                  <Plus size={18} />
                  Add Span
                </button>
              </div>

              <div className="space-y-4">
                {spans.map((span, index) => (
                  <div
                    key={index}
                    className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-orange-300">
                        Span {jointName(index)}
                        {jointName(index + 1)}
                      </h3>

                      <button
                        onClick={() => removeSpan(index)}
                        disabled={spans.length <= 1}
                        className="inline-flex items-center gap-2 rounded-lg border border-red-500/30 px-3 py-2 text-red-300 disabled:opacity-40"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>

                    <div className="grid md:grid-cols-4 gap-4">
                      <div>
                        <label className="text-sm text-slate-400">
                          Length L / लंबाई
                        </label>
                        <input
                          type="number"
                          value={span.length}
                          onChange={(e) =>
                            updateSpan(index, 'length', e.target.value)
                          }
                          className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 p-3 text-white outline-none focus:border-orange-500"
                        />
                      </div>

                      <div>
                        <label className="text-sm text-slate-400">
                          Relative EI
                        </label>
                        <input
                          type="number"
                          value={span.EI}
                          onChange={(e) =>
                            updateSpan(index, 'EI', e.target.value)
                          }
                          className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 p-3 text-white outline-none focus:border-orange-500"
                        />
                      </div>

                      <div>
                        <label className="text-sm text-slate-400">
                          Load Type
                        </label>
                        <select
                          value={span.loadType}
                          onChange={(e) =>
                            updateSpan(index, 'loadType', e.target.value)
                          }
                          className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 p-3 text-white outline-none focus:border-orange-500"
                        >
                          <option value="none">No Load</option>
                          <option value="udl">UDL</option>
                          <option value="point">Point Load</option>
                        </select>
                      </div>

                      {span.loadType === 'udl' && (
                        <div>
                          <label className="text-sm text-slate-400">
                            UDL w
                          </label>
                          <input
                            type="number"
                            value={span.w}
                            onChange={(e) =>
                              updateSpan(index, 'w', e.target.value)
                            }
                            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 p-3 text-white outline-none focus:border-orange-500"
                          />
                        </div>
                      )}

                      {span.loadType === 'point' && (
                        <>
                          <div>
                            <label className="text-sm text-slate-400">
                              Point Load P
                            </label>
                            <input
                              type="number"
                              value={span.P}
                              onChange={(e) =>
                                updateSpan(index, 'P', e.target.value)
                              }
                              className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 p-3 text-white outline-none focus:border-orange-500"
                            />
                          </div>

                          <div>
                            <label className="text-sm text-slate-400">
                              Distance a from left
                            </label>
                            <input
                              type="number"
                              value={span.a}
                              onChange={(e) =>
                                updateSpan(index, 'a', e.target.value)
                              }
                              className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 p-3 text-white outline-none focus:border-orange-500"
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
              <h2 className="text-xl font-bold mb-2">Joint / Support Type</h2>
              <p className="text-slate-400 text-sm mb-5">
                Fixed joint par distribution nahi hoga. Rotating support par
                moment distribute hoga.
              </p>

              <div className="grid md:grid-cols-4 gap-4">
                {joints.map((type, index) => (
                  <div key={index}>
                    <label className="text-sm text-slate-400">
                      Joint {jointName(index)}
                    </label>
                    <select
                      value={type}
                      onChange={(e) => updateJoint(index, e.target.value)}
                      className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 p-3 text-white outline-none focus:border-orange-500"
                    >
                      <option value="rotating">Rotating / Pin / Roller</option>
                      <option value="fixed">Fixed</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-orange-500/20 bg-orange-500/10 p-5 sticky top-4">
              <h2 className="text-xl font-bold text-orange-300">
                Solver Settings
              </h2>

              <div className="mt-5 space-y-4">
                <div>
                  <label className="text-sm text-slate-300">
                    Maximum Iterations
                  </label>
                  <input
                    type="number"
                    value={maxIterations}
                    onChange={(e) => setMaxIterations(Number(e.target.value))}
                    className="mt-2 w-full rounded-xl border border-orange-500/30 bg-slate-950 p-3 text-white outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="text-sm text-slate-300">
                    Tolerance
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={tolerance}
                    onChange={(e) => setTolerance(Number(e.target.value))}
                    className="mt-2 w-full rounded-xl border border-orange-500/30 bg-slate-950 p-3 text-white outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950 p-4">
                <p className="text-sm text-slate-400">Sign Convention</p>
                <p className="text-sm text-slate-200 mt-2">
                  UDL ke liye FEM: left end negative, right end positive.
                  Final answer me sign ke sath moments show honge.
                </p>
              </div>
            </div>
          </div>
        </div>

        <ResultSection title="1. Fixed End Moments">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="p-3 text-left">Span</th>
                  <th className="p-3 text-right">FEM Left</th>
                  <th className="p-3 text-right">FEM Right</th>
                </tr>
              </thead>
              <tbody>
                {result.femTable.map((row, i) => (
                  <tr key={i} className="border-b border-slate-800/60">
                    <td className="p-3 font-semibold text-orange-300">
                      {row.span}
                    </td>
                    <td className="p-3 text-right">{fmt(row.FEMLeft)}</td>
                    <td className="p-3 text-right">{fmt(row.FEMRight)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ResultSection>

        <ResultSection title="2. Moment Distribution Table">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="p-3 text-left">Iter.</th>
                  <th className="p-3 text-left">Joint</th>
                  <th className="p-3 text-left">Member</th>
                  <th className="p-3 text-right">Unbalanced</th>
                  <th className="p-3 text-right">DF</th>
                  <th className="p-3 text-right">Distributed</th>
                  <th className="p-3 text-right">Carry Over</th>
                  <th className="p-3 text-left">Carry To</th>
                </tr>
              </thead>
              <tbody>
                {result.distributionRows.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="p-5 text-center text-slate-400">
                      No distribution required.
                    </td>
                  </tr>
                ) : (
                  result.distributionRows.slice(0, 120).map((row, i) => (
                    <tr key={i} className="border-b border-slate-800/60">
                      <td className="p-3">{row.iteration}</td>
                      <td className="p-3 text-orange-300 font-semibold">
                        {row.joint}
                      </td>
                      <td className="p-3">{row.member}</td>
                      <td className="p-3 text-right">
                        {fmt(row.unbalancedMoment)}
                      </td>
                      <td className="p-3 text-right">
                        {fmt(row.distributionFactor)}
                      </td>
                      <td className="p-3 text-right">
                        {fmt(row.distributedMoment)}
                      </td>
                      <td className="p-3 text-right">
                        {fmt(row.carryOverMoment)}
                      </td>
                      <td className="p-3">{row.carryTo}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </ResultSection>

        <ResultSection title="3. Final Member End Moments">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {result.finalMoments.map((row, i) => (
              <div
                key={i}
                className="rounded-2xl border border-slate-800 bg-slate-950 p-5"
              >
                <h3 className="text-lg font-bold text-orange-300 mb-4">
                  Span {row.span}
                </h3>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">
                      Moment at {row.leftJoint}
                    </span>
                    <span className="font-bold">{fmt(row.leftMoment)} kNm</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">
                      Moment at {row.rightJoint}
                    </span>
                    <span className="font-bold">{fmt(row.rightMoment)} kNm</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ResultSection>

        <ResultSection title="4. Joint Balance Check">
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
            {result.jointBalance.map((row, i) => (
              <div
                key={i}
                className="rounded-2xl border border-slate-800 bg-slate-950 p-5"
              >
                <p className="text-slate-400 text-sm">Joint {row.joint}</p>
                <p className="text-2xl font-black mt-2">
                  {fmt(row.balance)} kNm
                </p>
                <p className="text-xs text-slate-500 mt-2">
                  {row.type === 'fixed'
                    ? 'Fixed joint: balance moment resisted by support'
                    : 'Rotating joint: balance should be nearly zero'}
                </p>
              </div>
            ))}
          </div>
        </ResultSection>
      </div>
    </div>
  )
}

function ResultSection({ title, children }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
      <h2 className="text-xl font-bold mb-5">{title}</h2>
      {children}
    </div>
  )
}
