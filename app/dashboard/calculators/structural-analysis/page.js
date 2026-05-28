'use client'

import { useMemo, useState } from 'react'
import { Calculator, Download, Plus, Trash2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function StructuralAnalysisPage() {
  const [structureType, setStructureType] = useState('simply-supported')
  const [span, setSpan] = useState(6)
  const [width, setWidth] = useState(300)
  const [depth, setDepth] = useState(450)
  const [E, setE] = useState(200000)
  const [I, setI] = useState(0)

  const [pointLoads, setPointLoads] = useState([
    { id: 1, P: 20, x: 3 },
  ])

  const [udls, setUdls] = useState([
    { id: 1, w: 5, start: 0, end: 6 },
  ])

  const [moments, setMoments] = useState([
    { id: 1, M: 0, x: 3 },
  ])

  const result = useMemo(() => {
    const L = Number(span) || 1
    const b = Number(width) || 300
    const D = Number(depth) || 450
    const EVal = Number(E) || 200000

    const Icalc =
      Number(I) > 0
        ? Number(I)
        : (b * Math.pow(D, 3)) / 12

    let totalLoad = 0
    let momentAboutA = 0

    pointLoads.forEach((load) => {
      const P = Number(load.P) || 0
      const x = Number(load.x) || 0
      totalLoad += P
      momentAboutA += P * x
    })

    udls.forEach((load) => {
      const w = Number(load.w) || 0
      const start = Number(load.start) || 0
      const end = Number(load.end) || 0
      const length = Math.max(end - start, 0)
      const W = w * length
      const centroid = start + length / 2

      totalLoad += W
      momentAboutA += W * centroid
    })

    moments.forEach((m) => {
      momentAboutA += Number(m.M) || 0
    })

    let RA = 0
    let RB = 0
    let fixedMoment = 0

    if (structureType === 'cantilever') {
      RA = totalLoad
      RB = 0
      fixedMoment = momentAboutA
    } else {
      RB = momentAboutA / L
      RA = totalLoad - RB
    }

    const points = []
    const n = 120

    for (let i = 0; i <= n; i++) {
      const x = (L * i) / n
      let V = RA
      let M = structureType === 'cantilever' ? -fixedMoment + RA * x : RA * x

      pointLoads.forEach((load) => {
        const P = Number(load.P) || 0
        const a = Number(load.x) || 0

        if (x >= a) {
          V -= P
          M -= P * (x - a)
        }
      })

      udls.forEach((load) => {
        const w = Number(load.w) || 0
        const start = Number(load.start) || 0
        const end = Number(load.end) || 0

        if (x > start) {
          const loadedLength = Math.min(x, end) - start

          if (loadedLength > 0) {
            V -= w * loadedLength
            M -= w * loadedLength * (x - (start + loadedLength / 2))
          }
        }
      })

      moments.forEach((moment) => {
        const M0 = Number(moment.M) || 0
        const a = Number(moment.x) || 0

        if (x >= a) {
          M += M0
        }
      })

      points.push({ x, V, M })
    }

    const maxShear = Math.max(...points.map((p) => p.V))
    const minShear = Math.min(...points.map((p) => p.V))
    const maxMoment = Math.max(...points.map((p) => p.M))
    const minMoment = Math.min(...points.map((p) => p.M))

    const criticalMomentPoint = points.reduce((a, b) =>
      Math.abs(b.M) > Math.abs(a.M) ? b : a
    )

    const maxReaction = Math.max(Math.abs(RA), Math.abs(RB))

    const totalUDL = udls.reduce((sum, load) => {
      const w = Number(load.w) || 0
      const length = Math.max((Number(load.end) || 0) - (Number(load.start) || 0), 0)
      return sum + w * length
    }, 0)

    const pointDeflection = pointLoads.reduce((sum, load) => {
      const P = Number(load.P) || 0
      const a = Number(load.x) || 0
      const mmL = L * 1000
      const mma = a * 1000
      const mmb = mmL - mma

      if (structureType === 'cantilever') {
        return sum + (P * 1000 * Math.pow(mma, 2) * (3 * mmL - mma)) / (6 * EVal * Icalc)
      }

      return sum + (P * 1000 * mma * mmb * Math.sqrt(Math.max((mmL * mmL) - (mma * mma) - (mmb * mmb), 0))) / (9 * Math.sqrt(3) * EVal * Icalc)
    }, 0)

    const udlDeflection = totalUDL
      ? (5 * (totalUDL / L) * Math.pow(L * 1000, 4)) / (384 * EVal * Icalc)
      : 0

    const maxDeflection = Math.abs(pointDeflection + udlDeflection)

    return {
      L,
      b,
      D,
      Icalc,
      totalLoad,
      RA,
      RB,
      fixedMoment,
      points,
      maxShear,
      minShear,
      maxMoment,
      minMoment,
      criticalMomentPoint,
      maxReaction,
      maxDeflection,
    }
  }, [structureType, span, width, depth, E, I, pointLoads, udls, moments])

  const addPointLoad = () => {
    setPointLoads((prev) => [
      ...prev,
      { id: Date.now(), P: 10, x: span / 2 },
    ])
  }

  const addUDL = () => {
    setUdls((prev) => [
      ...prev,
      { id: Date.now(), w: 5, start: 0, end: span },
    ])
  }

  const addMoment = () => {
    setMoments((prev) => [
      ...prev,
      { id: Date.now(), M: 10, x: span / 2 },
    ])
  }

  const updatePointLoad = (id, key, value) => {
    setPointLoads((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [key]: value } : item
      )
    )
  }

  const updateUDL = (id, key, value) => {
    setUdls((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [key]: value } : item
      )
    )
  }

  const updateMoment = (id, key, value) => {
    setMoments((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [key]: value } : item
      )
    )
  }

  const removePointLoad = (id) => {
    setPointLoads((prev) => prev.filter((item) => item.id !== id))
  }

  const removeUDL = (id) => {
    setUdls((prev) => prev.filter((item) => item.id !== id))
  }

  const removeMoment = (id) => {
    setMoments((prev) => prev.filter((item) => item.id !== id))
  }

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center text-xs uppercase tracking-wider text-orange-400 font-semibold mb-2">
          <Calculator className="h-3 w-3 mr-1.5" />
          Structural Analysis
        </div>

        <h1 className="text-3xl lg:text-4xl font-bold text-white">
          Advanced Beam Analysis
        </h1>

        <p className="text-slate-400 mt-2">
          Reactions, SFD, BMD, approximate deflection, diagrams and step-by-step exam solution.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="bg-slate-900/50 border-slate-800 p-6 lg:col-span-1">
          <h2 className="text-xl font-bold text-white mb-5">
            Inputs
          </h2>

          <div className="space-y-4">
            <div>
              <Label className="text-slate-400">Structure Type</Label>
              <Select value={structureType} onValueChange={setStructureType}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700 text-white">
                  <SelectItem value="simply-supported">Simply Supported Beam</SelectItem>
                  <SelectItem value="cantilever">Cantilever Beam</SelectItem>
                  <SelectItem value="overhanging">Overhanging Beam Basic</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-slate-400">Span Length L (m)</Label>
              <Input
                type="number"
                value={span}
                onChange={(e) => setSpan(Number(e.target.value))}
                className="bg-slate-800 border-slate-700 text-white mt-2"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-slate-400">Width b (mm)</Label>
                <Input
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(Number(e.target.value))}
                  className="bg-slate-800 border-slate-700 text-white mt-2"
                />
              </div>

              <div>
                <Label className="text-slate-400">Depth D (mm)</Label>
                <Input
                  type="number"
                  value={depth}
                  onChange={(e) => setDepth(Number(e.target.value))}
                  className="bg-slate-800 border-slate-700 text-white mt-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-slate-400">E (N/mm²)</Label>
                <Input
                  type="number"
                  value={E}
                  onChange={(e) => setE(Number(e.target.value))}
                  className="bg-slate-800 border-slate-700 text-white mt-2"
                />
              </div>

              <div>
                <Label className="text-slate-400">I override</Label>
                <Input
                  type="number"
                  value={I}
                  onChange={(e) => setI(Number(e.target.value))}
                  className="bg-slate-800 border-slate-700 text-white mt-2"
                />
              </div>
            </div>

            <LoadSection
              title="Point Loads"
              onAdd={addPointLoad}
            >
              {pointLoads.map((load) => (
                <div key={load.id} className="bg-slate-800/60 rounded-xl p-3 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="number"
                      value={load.P}
                      onChange={(e) => updatePointLoad(load.id, 'P', Number(e.target.value))}
                      placeholder="Load kN"
                      className="bg-slate-900 border-slate-700 text-white"
                    />

                    <Input
                      type="number"
                      value={load.x}
                      onChange={(e) => updatePointLoad(load.id, 'x', Number(e.target.value))}
                      placeholder="Position m"
                      className="bg-slate-900 border-slate-700 text-white"
                    />
                  </div>

                  <RemoveButton onClick={() => removePointLoad(load.id)} />
                </div>
              ))}
            </LoadSection>

            <LoadSection
              title="UDL Loads"
              onAdd={addUDL}
            >
              {udls.map((load) => (
                <div key={load.id} className="bg-slate-800/60 rounded-xl p-3 space-y-2">
                  <Input
                    type="number"
                    value={load.w}
                    onChange={(e) => updateUDL(load.id, 'w', Number(e.target.value))}
                    placeholder="UDL kN/m"
                    className="bg-slate-900 border-slate-700 text-white"
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="number"
                      value={load.start}
                      onChange={(e) => updateUDL(load.id, 'start', Number(e.target.value))}
                      placeholder="Start m"
                      className="bg-slate-900 border-slate-700 text-white"
                    />

                    <Input
                      type="number"
                      value={load.end}
                      onChange={(e) => updateUDL(load.id, 'end', Number(e.target.value))}
                      placeholder="End m"
                      className="bg-slate-900 border-slate-700 text-white"
                    />
                  </div>

                  <RemoveButton onClick={() => removeUDL(load.id)} />
                </div>
              ))}
            </LoadSection>

            <LoadSection
              title="Applied Moments"
              onAdd={addMoment}
            >
              {moments.map((moment) => (
                <div key={moment.id} className="bg-slate-800/60 rounded-xl p-3 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="number"
                      value={moment.M}
                      onChange={(e) => updateMoment(moment.id, 'M', Number(e.target.value))}
                      placeholder="Moment kNm"
                      className="bg-slate-900 border-slate-700 text-white"
                    />

                    <Input
                      type="number"
                      value={moment.x}
                      onChange={(e) => updateMoment(moment.id, 'x', Number(e.target.value))}
                      placeholder="Position m"
                      className="bg-slate-900 border-slate-700 text-white"
                    />
                  </div>

                  <RemoveButton onClick={() => removeMoment(moment.id)} />
                </div>
              ))}
            </LoadSection>

            <Button
              onClick={() => window.print()}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600"
            >
              <Download className="h-4 w-4 mr-2" />
              Export / Print PDF
            </Button>
          </div>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-slate-900/50 border-slate-800 p-6">
            <h2 className="text-xl font-bold text-white mb-4">
              Structure Diagram
            </h2>

            <BeamDiagram
              L={result.L}
              structureType={structureType}
              pointLoads={pointLoads}
              udls={udls}
              moments={moments}
            />
          </Card>

          <div className="grid md:grid-cols-4 gap-4">
            <SummaryCard label="RA" value={`${result.RA.toFixed(2)} kN`} />
            <SummaryCard label="RB" value={`${result.RB.toFixed(2)} kN`} />
            <SummaryCard label="Max BM" value={`${Math.max(Math.abs(result.maxMoment), Math.abs(result.minMoment)).toFixed(2)} kNm`} />
            <SummaryCard label="Deflection" value={`${result.maxDeflection.toFixed(2)} mm`} />
          </div>

          <Card className="bg-slate-900/50 border-slate-800 p-6">
            <h2 className="text-xl font-bold text-white mb-4">
              Shear Force Diagram
            </h2>

            <Diagram points={result.points} type="V" label="SFD" />
          </Card>

          <Card className="bg-slate-900/50 border-slate-800 p-6">
            <h2 className="text-xl font-bold text-white mb-4">
              Bending Moment Diagram
            </h2>

            <Diagram points={result.points} type="M" label="BMD" />
          </Card>

          <Card className="bg-slate-900/50 border-slate-800 p-6">
            <h2 className="text-xl font-bold text-white mb-4">
              Deflection Curve
            </h2>

            <DeflectionCurve points={result.points} />
          </Card>
        </div>
      </div>

      <section className="mt-10 grid lg:grid-cols-2 gap-6">
        <Card className="bg-slate-900/50 border-slate-800 p-6">
          <h2 className="text-xl font-bold text-white mb-4">
            Step-by-Step Calculations
          </h2>

          <div className="space-y-4 text-slate-300 leading-7">
            <p>Total load: <b className="text-orange-400">ΣW = {result.totalLoad.toFixed(2)} kN</b></p>
            <p>Equilibrium: <b className="text-orange-400">ΣFy = 0 → RA + RB = ΣW</b></p>
            <p>Moment about A: <b className="text-orange-400">ΣMA = 0</b></p>
            <p>Right reaction: <b className="text-orange-400">RB = {result.RB.toFixed(2)} kN</b></p>
            <p>Left reaction: <b className="text-orange-400">RA = {result.RA.toFixed(2)} kN</b></p>
            <p>Maximum shear: <b className="text-orange-400">{result.maxShear.toFixed(2)} kN</b></p>
            <p>Minimum shear: <b className="text-orange-400">{result.minShear.toFixed(2)} kN</b></p>
            <p>Critical section: <b className="text-orange-400">x = {result.criticalMomentPoint.x.toFixed(2)} m</b></p>
            <p>Maximum moment: <b className="text-orange-400">{result.criticalMomentPoint.M.toFixed(2)} kNm</b></p>
            <p>Approx. maximum deflection: <b className="text-orange-400">{result.maxDeflection.toFixed(2)} mm</b></p>
          </div>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800 p-6">
          <h2 className="text-xl font-bold text-white mb-4">
            Theory Explanation
          </h2>

          <div className="space-y-4 text-slate-300 leading-7">
            <p>
              Support reactions occur because the beam must satisfy vertical
              force equilibrium and moment equilibrium.
            </p>

            <p>
              Shear force changes suddenly at a point load and changes linearly
              under a uniformly distributed load.
            </p>

            <p>
              Bending moment is maximum where shear force becomes zero or changes sign.
            </p>

            <p>
              Deflection occurs because the beam bends under load. It depends
              on load, span, Young’s modulus and moment of inertia.
            </p>

            <p>
              Positive bending moment indicates sagging, while negative bending
              moment indicates hogging.
            </p>
          </div>
        </Card>
      </section>
    </div>
  )
}

function LoadSection({ title, onAdd, children }) {
  return (
    <div className="pt-4 border-t border-slate-800">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-white">{title}</h3>

        <Button
          size="sm"
          onClick={onAdd}
          className="bg-orange-500 hover:bg-orange-600"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add
        </Button>
      </div>

      <div className="space-y-3">
        {children}
      </div>
    </div>
  )
}

function RemoveButton({ onClick }) {
  return (
    <Button
      size="sm"
      variant="ghost"
      onClick={onClick}
      className="text-red-400 hover:text-red-300"
    >
      <Trash2 className="h-4 w-4 mr-1" />
      Remove
    </Button>
  )
}

function SummaryCard({ label, value }) {
  return (
    <Card className="bg-slate-900/50 border-slate-800 p-5">
      <div className="text-xs uppercase tracking-wider text-slate-500 mb-2">
        {label}
      </div>

      <div className="text-xl font-bold text-white">
        {value}
      </div>
    </Card>
  )
}

function BeamDiagram({ L, structureType, pointLoads, udls, moments }) {
  const width = 760
  const height = 210
  const x0 = 70
  const x1 = 690
  const y = 105
  const scale = (x) => x0 + (x / L) * (x1 - x0)

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full bg-slate-950 rounded-xl border border-slate-800">
      <line x1={x0} y1={y} x2={x1} y2={y} stroke="#f97316" strokeWidth="6" />

      {structureType === 'cantilever' ? (
        <rect x={x0 - 15} y={y - 45} width="18" height="90" fill="#94a3b8" />
      ) : (
        <>
          <polygon points={`${x0 - 15},${y + 35} ${x0 + 15},${y + 35} ${x0},${y}`} fill="#94a3b8" />
          <circle cx={x1} cy={y + 22} r="12" fill="#94a3b8" />
        </>
      )}

      <text x={x0 - 10} y={y + 65} fill="#cbd5e1">A</text>
      <text x={x1 - 10} y={y + 65} fill="#cbd5e1">B</text>
      <text x={(x0 + x1) / 2 - 25} y={185} fill="#cbd5e1">L = {L} m</text>

      {udls.map((load) => {
        const xs = scale(Number(load.start) || 0)
        const xe = scale(Number(load.end) || 0)

        return (
          <g key={load.id}>
            <line x1={xs} y1={35} x2={xe} y2={35} stroke="#38bdf8" strokeWidth="3" />

            {Array.from({ length: 8 }).map((_, i) => {
              const x = xs + ((xe - xs) * i) / 7

              return (
                <line
                  key={i}
                  x1={x}
                  y1={35}
                  x2={x}
                  y2={88}
                  stroke="#38bdf8"
                  strokeWidth="2"
                  markerEnd="url(#blueArrow)"
                />
              )
            })}

            <text x={(xs + xe) / 2 - 25} y={25} fill="#38bdf8">
              {load.w} kN/m
            </text>
          </g>
        )
      })}

      {pointLoads.map((load) => {
        const x = scale(Number(load.x) || 0)

        return (
          <g key={load.id}>
            <line
              x1={x}
              y1={25}
              x2={x}
              y2={88}
              stroke="#ef4444"
              strokeWidth="3"
              markerEnd="url(#redArrow)"
            />

            <text x={x - 22} y={20} fill="#fca5a5">
              {load.P} kN
            </text>
          </g>
        )
      })}

      {moments.map((moment) => {
        const x = scale(Number(moment.x) || 0)

        return (
          <g key={moment.id}>
            <path
              d={`M ${x - 18} ${y - 28} A 22 22 0 1 1 ${x + 18} ${y - 28}`}
              fill="none"
              stroke="#a78bfa"
              strokeWidth="3"
            />

            <text x={x - 20} y={y - 45} fill="#c4b5fd">
              {moment.M} kNm
            </text>
          </g>
        )
      })}

      <defs>
        <marker id="redArrow" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
          <path d="M0,0 L10,5 L0,10 Z" fill="#ef4444" />
        </marker>

        <marker id="blueArrow" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
          <path d="M0,0 L10,5 L0,10 Z" fill="#38bdf8" />
        </marker>
      </defs>
    </svg>
  )
}

function Diagram({ points, type, label }) {
  const width = 760
  const height = 240
  const padding = 45
  const values = points.map((p) => p[type])
  const maxAbs = Math.max(...values.map((v) => Math.abs(v)), 1)

  const xScale = (i) =>
    padding + (i / (points.length - 1)) * (width - 2 * padding)

  const yScale = (v) =>
    height / 2 - (v / maxAbs) * (height / 2 - padding)

  const path = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${xScale(i)} ${yScale(p[type])}`)
    .join(' ')

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full bg-slate-950 rounded-xl border border-slate-800">
      <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="#64748b" />
      <path d={path} fill="none" stroke="#f97316" strokeWidth="3" />

      <text x={20} y={25} fill="#cbd5e1">{label}</text>
      <text x={20} y={50} fill="#94a3b8">Max: {Math.max(...values).toFixed(2)}</text>
      <text x={20} y={70} fill="#94a3b8">Min: {Math.min(...values).toFixed(2)}</text>
    </svg>
  )
}

function DeflectionCurve({ points }) {
  const width = 760
  const height = 160
  const padding = 45

  const path = points
    .map((p, i) => {
      const x = padding + (i / (points.length - 1)) * (width - 2 * padding)
      const y = 65 + 35 * Math.sin((Math.PI * i) / (points.length - 1))
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
    })
    .join(' ')

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full bg-slate-950 rounded-xl border border-slate-800">
      <line x1={padding} y1={65} x2={width - padding} y2={65} stroke="#64748b" strokeDasharray="6 6" />
      <path d={path} fill="none" stroke="#38bdf8" strokeWidth="3" />
      <text x={20} y={25} fill="#cbd5e1">Deflected Shape</text>
    </svg>
  )
}
