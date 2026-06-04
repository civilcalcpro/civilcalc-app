'use client'

import { useMemo, useState } from 'react'
import {
  Calculator,
  Download,
  Plus,
  Trash2,
  Triangle,
} from 'lucide-react'

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

import { analyzeTruss } from '@/lib/engineering/truss-analysis'
import { columnBuckling } from '@/lib/engineering/column-buckling'
export default function StructuralAnalysisPage() {
  const [activeModule, setActiveModule] = useState('beam')
const [columnLength, setColumnLength] = useState(3)
const [columnE, setColumnE] = useState(200000)
const [columnI, setColumnI] = useState(133333333)
const [columnArea, setColumnArea] = useState(40000)
const [columnEndCondition, setColumnEndCondition] = useState('pinnedPinned')
const [columnCrushingStress, setColumnCrushingStress] = useState(0)
const [columnRankineConstant, setColumnRankineConstant] = useState(1 / 7500)
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

  const [trussData, setTrussData] = useState({
  joints: [
    { id: 'A', x: 0, y: 0 },
    { id: 'B', x: 4, y: 0 },
    { id: 'C', x: 2, y: 3 },
  ],
  members: [
    { id: 'AB', start: 'A', end: 'B', area: 1000, E: 200000 },
    { id: 'AC', start: 'A', end: 'C', area: 1000, E: 200000 },
    { id: 'BC', start: 'B', end: 'C', area: 1000, E: 200000 },
  ],
  supports: [
    { joint: 'A', type: 'pin' },
    { joint: 'B', type: 'roller-y' },
  ],
  loads: [
    { joint: 'C', fx: 0, fy: -20 },
  ],
})

const updateTrussJoint = (index, field, value) => {
  setTrussData((prev) => ({
    ...prev,
    joints: prev.joints.map((joint, i) =>
      i === index
        ? {
            ...joint,
            [field]: field === 'id' ? value.toUpperCase() : Number(value),
          }
        : joint
    ),
  }))
}

const addTrussJoint = () => {
  const nextId = String.fromCharCode(65 + trussData.joints.length)

  setTrussData((prev) => ({
    ...prev,
    joints: [
      ...prev.joints,
      { id: nextId, x: 0, y: 0 },
    ],
  }))
}

const removeTrussJoint = (index) => {
  if (trussData.joints.length <= 2) return

  const removedJoint = trussData.joints[index]?.id

  setTrussData((prev) => ({
    ...prev,
    joints: prev.joints.filter((_, i) => i !== index),
    members: prev.members.filter(
      (member) =>
        member.start !== removedJoint && member.end !== removedJoint
    ),
    supports: prev.supports.filter(
      (support) => support.joint !== removedJoint
    ),
    loads: prev.loads.filter((load) => load.joint !== removedJoint),
  }))
}

const updateTrussMember = (index, field, value) => {
  setTrussData((prev) => ({
    ...prev,
    members: prev.members.map((member, i) =>
      i === index
        ? {
            ...member,
            [field]:
              field === 'area' || field === 'E'
                ? Number(value)
                : value,
          }
        : member
    ),
  }))
}

const addTrussMember = () => {
  const firstJoint = trussData.joints[0]?.id || 'A'
  const secondJoint = trussData.joints[1]?.id || 'B'

  setTrussData((prev) => ({
    ...prev,
    members: [
      ...prev.members,
      {
        id: `M${prev.members.length + 1}`,
        start: firstJoint,
        end: secondJoint,
        area: 1000,
        E: 200000,
      },
    ],
  }))
}

const removeTrussMember = (index) => {
  setTrussData((prev) => ({
    ...prev,
    members: prev.members.filter((_, i) => i !== index),
  }))
}

const updateTrussSupport = (index, field, value) => {
  setTrussData((prev) => ({
    ...prev,
    supports: prev.supports.map((support, i) =>
      i === index ? { ...support, [field]: value } : support
    ),
  }))
}

const addTrussSupport = () => {
  setTrussData((prev) => ({
    ...prev,
    supports: [
      ...prev.supports,
      {
        joint: prev.joints[0]?.id || 'A',
        type: 'roller-y',
      },
    ],
  }))
}

const removeTrussSupport = (index) => {
  setTrussData((prev) => ({
    ...prev,
    supports: prev.supports.filter((_, i) => i !== index),
  }))
}

const updateTrussLoad = (index, field, value) => {
  setTrussData((prev) => ({
    ...prev,
    loads: prev.loads.map((load, i) =>
      i === index
        ? {
            ...load,
            [field]:
              field === 'fx' || field === 'fy'
                ? Number(value)
                : value,
          }
        : load
    ),
  }))
}

const addTrussLoad = () => {
  setTrussData((prev) => ({
    ...prev,
    loads: [
      ...prev.loads,
      {
        joint: prev.joints[0]?.id || 'A',
        fx: 0,
        fy: -10,
      },
    ],
  }))
}

const removeTrussLoad = (index) => {
  setTrussData((prev) => ({
    ...prev,
    loads: prev.loads.filter((_, i) => i !== index),
  }))
}

  const trussResult = useMemo(() => {
    return analyzeTruss(trussData)
  }, [trussData])
const columnResult = useMemo(() => {
  return columnBuckling({
    length: columnLength,
    E: columnE,
    I: columnI,
    area: columnArea,
    endCondition: columnEndCondition,
    crushingStress: columnCrushingStress,
    rankineConstant: columnRankineConstant,
  })
}, [
  columnLength,
  columnE,
  columnI,
  columnArea,
  columnEndCondition,
  columnCrushingStress,
  columnRankineConstant,
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
      let M =
        structureType === 'cantilever'
          ? -fixedMoment + RA * x
          : RA * x

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
      const length = Math.max(
        (Number(load.end) || 0) - (Number(load.start) || 0),
        0
      )

      return sum + w * length
    }, 0)

    const pointDeflection = pointLoads.reduce((sum, load) => {
      const P = Number(load.P) || 0
      const a = Number(load.x) || 0
      const mmL = L * 1000
      const mma = a * 1000
      const mmb = mmL - mma

      if (structureType === 'cantilever') {
        return (
          sum +
          (P * 1000 * Math.pow(mma, 2) * (3 * mmL - mma)) /
            (6 * EVal * Icalc)
        )
      }

      return (
        sum +
        (P *
          1000 *
          mma *
          mmb *
          Math.sqrt(
            Math.max(mmL * mmL - mma * mma - mmb * mmb, 0)
          )) /
          (9 * Math.sqrt(3) * EVal * Icalc)
      )
    }, 0)

    const udlDeflection = totalUDL
      ? (5 * (totalUDL / L) * Math.pow(L * 1000, 4)) /
        (384 * EVal * Icalc)
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
          Structural Analysis Suite
        </h1>

        <p className="text-slate-400 mt-2">
          Beam analysis, reactions, SFD, BMD, deflection and truss analysis setup.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button
            onClick={() => setActiveModule('beam')}
            className={
              activeModule === 'beam'
                ? 'bg-orange-500 hover:bg-orange-600'
                : 'bg-slate-800 hover:bg-slate-700'
            }
          >
            <Calculator className="h-4 w-4 mr-2" />
            Beam Analysis
          </Button>

          <Button
            onClick={() => setActiveModule('truss')}
            className={
              activeModule === 'truss'
                ? 'bg-orange-500 hover:bg-orange-600'
                : 'bg-slate-800 hover:bg-slate-700'
            }
          >
            <Triangle className="h-4 w-4 mr-2" />
            Truss Analysis
          </Button>
              <Button
  onClick={() => setActiveModule('column')}
  className={
    activeModule === 'column'
      ? 'bg-orange-500 hover:bg-orange-600'
      : 'bg-slate-800 hover:bg-slate-700'
  }
>
  Column Buckling
</Button>
        </div>
      </div>

      {activeModule === 'beam' && (
        <BeamModule
          structureType={structureType}
          setStructureType={setStructureType}
          span={span}
          setSpan={setSpan}
          width={width}
          setWidth={setWidth}
          depth={depth}
          setDepth={setDepth}
          E={E}
          setE={setE}
          I={I}
          setI={setI}
          pointLoads={pointLoads}
          udls={udls}
          moments={moments}
          result={result}
          addPointLoad={addPointLoad}
          addUDL={addUDL}
          addMoment={addMoment}
          updatePointLoad={updatePointLoad}
          updateUDL={updateUDL}
          updateMoment={updateMoment}
          removePointLoad={removePointLoad}
          removeUDL={removeUDL}
          removeMoment={removeMoment}
        />
      )}

      {activeModule === 'truss' && (
        <TrussModule
  trussData={trussData}
  trussResult={trussResult}
  updateTrussJoint={updateTrussJoint}
  addTrussJoint={addTrussJoint}
  removeTrussJoint={removeTrussJoint}
  updateTrussMember={updateTrussMember}
  addTrussMember={addTrussMember}
  removeTrussMember={removeTrussMember}
  updateTrussSupport={updateTrussSupport}
  addTrussSupport={addTrussSupport}
  removeTrussSupport={removeTrussSupport}
  updateTrussLoad={updateTrussLoad}
  addTrussLoad={addTrussLoad}
  removeTrussLoad={removeTrussLoad}
/>
      )}
    {activeModule === 'column' && (
  <ColumnBucklingModule
  columnResult={columnResult}
  columnLength={columnLength}
  setColumnLength={setColumnLength}
  columnE={columnE}
  setColumnE={setColumnE}
  columnI={columnI}
  setColumnI={setColumnI}
  columnArea={columnArea}
  setColumnArea={setColumnArea}
  columnEndCondition={columnEndCondition}
  setColumnEndCondition={setColumnEndCondition}
  columnCrushingStress={columnCrushingStress}
  setColumnCrushingStress={setColumnCrushingStress}
  columnRankineConstant={columnRankineConstant}
  setColumnRankineConstant={setColumnRankineConstant}
/>
)}
    </div>
  )
}

function BeamModule({
  structureType,
  setStructureType,
  span,
  setSpan,
  width,
  setWidth,
  depth,
  setDepth,
  E,
  setE,
  I,
  setI,
  pointLoads,
  udls,
  moments,
  result,
  addPointLoad,
  addUDL,
  addMoment,
  updatePointLoad,
  updateUDL,
  updateMoment,
  removePointLoad,
  removeUDL,
  removeMoment,
}) {
  return (
    <>
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
                  <SelectItem value="simply-supported">
                    Simply Supported Beam
                  </SelectItem>
                  <SelectItem value="cantilever">
                    Cantilever Beam
                  </SelectItem>
                  <SelectItem value="overhanging">
                    Overhanging Beam Basic
                  </SelectItem>
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

            <LoadSection title="Point Loads" onAdd={addPointLoad}>
              {pointLoads.map((load) => (
                <div
                  key={load.id}
                  className="bg-slate-800/60 rounded-xl p-3 space-y-2"
                >
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="number"
                      value={load.P}
                      onChange={(e) =>
                        updatePointLoad(load.id, 'P', Number(e.target.value))
                      }
                      placeholder="Load kN"
                      className="bg-slate-900 border-slate-700 text-white"
                    />

                    <Input
                      type="number"
                      value={load.x}
                      onChange={(e) =>
                        updatePointLoad(load.id, 'x', Number(e.target.value))
                      }
                      placeholder="Position m"
                      className="bg-slate-900 border-slate-700 text-white"
                    />
                  </div>

                  <RemoveButton onClick={() => removePointLoad(load.id)} />
                </div>
              ))}
            </LoadSection>

            <LoadSection title="UDL Loads" onAdd={addUDL}>
              {udls.map((load) => (
                <div
                  key={load.id}
                  className="bg-slate-800/60 rounded-xl p-3 space-y-2"
                >
                  <Input
                    type="number"
                    value={load.w}
                    onChange={(e) =>
                      updateUDL(load.id, 'w', Number(e.target.value))
                    }
                    placeholder="UDL kN/m"
                    className="bg-slate-900 border-slate-700 text-white"
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="number"
                      value={load.start}
                      onChange={(e) =>
                        updateUDL(load.id, 'start', Number(e.target.value))
                      }
                      placeholder="Start m"
                      className="bg-slate-900 border-slate-700 text-white"
                    />

                    <Input
                      type="number"
                      value={load.end}
                      onChange={(e) =>
                        updateUDL(load.id, 'end', Number(e.target.value))
                      }
                      placeholder="End m"
                      className="bg-slate-900 border-slate-700 text-white"
                    />
                  </div>

                  <RemoveButton onClick={() => removeUDL(load.id)} />
                </div>
              ))}
            </LoadSection>

            <LoadSection title="Applied Moments" onAdd={addMoment}>
              {moments.map((moment) => (
                <div
                  key={moment.id}
                  className="bg-slate-800/60 rounded-xl p-3 space-y-2"
                >
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="number"
                      value={moment.M}
                      onChange={(e) =>
                        updateMoment(moment.id, 'M', Number(e.target.value))
                      }
                      placeholder="Moment kNm"
                      className="bg-slate-900 border-slate-700 text-white"
                    />

                    <Input
                      type="number"
                      value={moment.x}
                      onChange={(e) =>
                        updateMoment(moment.id, 'x', Number(e.target.value))
                      }
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
            <SummaryCard
              label="Max BM"
              value={`${Math.max(
                Math.abs(result.maxMoment),
                Math.abs(result.minMoment)
              ).toFixed(2)} kNm`}
            />
            <SummaryCard
              label="Deflection"
              value={`${result.maxDeflection.toFixed(2)} mm`}
            />
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
            <p>
              Total load:{' '}
              <b className="text-orange-400">
                ΣW = {result.totalLoad.toFixed(2)} kN
              </b>
            </p>
            <p>
              Equilibrium:{' '}
              <b className="text-orange-400">
                ΣFy = 0 → RA + RB = ΣW
              </b>
            </p>
            <p>
              Moment about A:{' '}
              <b className="text-orange-400">ΣMA = 0</b>
            </p>
            <p>
              Right reaction:{' '}
              <b className="text-orange-400">
                RB = {result.RB.toFixed(2)} kN
              </b>
            </p>
            <p>
              Left reaction:{' '}
              <b className="text-orange-400">
                RA = {result.RA.toFixed(2)} kN
              </b>
            </p>
            <p>
              Maximum shear:{' '}
              <b className="text-orange-400">
                {result.maxShear.toFixed(2)} kN
              </b>
            </p>
            <p>
              Minimum shear:{' '}
              <b className="text-orange-400">
                {result.minShear.toFixed(2)} kN
              </b>
            </p>
            <p>
              Critical section:{' '}
              <b className="text-orange-400">
                x = {result.criticalMomentPoint.x.toFixed(2)} m
              </b>
            </p>
            <p>
              Maximum moment:{' '}
              <b className="text-orange-400">
                {result.criticalMomentPoint.M.toFixed(2)} kNm
              </b>
            </p>
            <p>
              Approx. maximum deflection:{' '}
              <b className="text-orange-400">
                {result.maxDeflection.toFixed(2)} mm
              </b>
            </p>
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
              Bending moment is maximum where shear force becomes zero or
              changes sign.
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
    </>
  )
}

function TrussModule({
  trussData,
  trussResult,
  updateTrussJoint,
  addTrussJoint,
  removeTrussJoint,
  updateTrussMember,
  addTrussMember,
  removeTrussMember,
  updateTrussSupport,
  addTrussSupport,
  removeTrussSupport,
  updateTrussLoad,
  addTrussLoad,
  removeTrussLoad,
}) {
  const jointOptions = trussData.joints.map((joint) => joint.id)

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <Card className="bg-slate-900/50 border-slate-800 p-6 lg:col-span-1">
        <h2 className="text-xl font-bold text-white mb-5">
          Truss Inputs
        </h2>

        <div className="space-y-6 text-sm text-slate-300">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-orange-400">
                Joints
              </h3>

              <Button
                size="sm"
                onClick={addTrussJoint}
                className="bg-orange-500 hover:bg-orange-600"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>

            <div className="space-y-3">
              {trussData.joints.map((joint, index) => (
                <div
                  key={index}
                  className="bg-slate-800/60 rounded-xl p-3 space-y-2"
                >
                  <div className="grid grid-cols-3 gap-2">
                    <Input
                      value={joint.id}
                      onChange={(e) =>
                        updateTrussJoint(index, 'id', e.target.value)
                      }
                      placeholder="Joint"
                      className="bg-slate-900 border-slate-700 text-white"
                    />

                    <Input
                      type="number"
                      value={joint.x}
                      onChange={(e) =>
                        updateTrussJoint(index, 'x', e.target.value)
                      }
                      placeholder="x m"
                      className="bg-slate-900 border-slate-700 text-white"
                    />

                    <Input
                      type="number"
                      value={joint.y}
                      onChange={(e) =>
                        updateTrussJoint(index, 'y', e.target.value)
                      }
                      placeholder="y m"
                      className="bg-slate-900 border-slate-700 text-white"
                    />
                  </div>

                  <RemoveButton onClick={() => removeTrussJoint(index)} />
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-orange-400">
                Members
              </h3>

              <Button
                size="sm"
                onClick={addTrussMember}
                className="bg-orange-500 hover:bg-orange-600"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>

            <div className="space-y-3">
              {trussData.members.map((member, index) => (
                <div
                  key={index}
                  className="bg-slate-800/60 rounded-xl p-3 space-y-2"
                >
                  <Input
                    value={member.id}
                    onChange={(e) =>
                      updateTrussMember(index, 'id', e.target.value)
                    }
                    placeholder="Member ID"
                    className="bg-slate-900 border-slate-700 text-white"
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <Select
                      value={member.start}
                      onValueChange={(value) =>
                        updateTrussMember(index, 'start', value)
                      }
                    >
                      <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
                        <SelectValue placeholder="Start joint" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-slate-700 text-white">
                        {jointOptions.map((joint) => (
                          <SelectItem key={joint} value={joint}>
                            {joint}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={member.end}
                      onValueChange={(value) =>
                        updateTrussMember(index, 'end', value)
                      }
                    >
                      <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
                        <SelectValue placeholder="End joint" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-slate-700 text-white">
                        {jointOptions.map((joint) => (
                          <SelectItem key={joint} value={joint}>
                            {joint}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="number"
                      value={member.area || 1000}
                      onChange={(e) =>
                        updateTrussMember(index, 'area', e.target.value)
                      }
                      placeholder="Area mm²"
                      className="bg-slate-900 border-slate-700 text-white"
                    />

                    <Input
                      type="number"
                      value={member.E || 200000}
                      onChange={(e) =>
                        updateTrussMember(index, 'E', e.target.value)
                      }
                      placeholder="E N/mm²"
                      className="bg-slate-900 border-slate-700 text-white"
                    />
                  </div>

                  <RemoveButton onClick={() => removeTrussMember(index)} />
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-orange-400">
                Supports
              </h3>

              <Button
                size="sm"
                onClick={addTrussSupport}
                className="bg-orange-500 hover:bg-orange-600"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>

            <div className="space-y-3">
              {trussData.supports.map((support, index) => (
                <div
                  key={index}
                  className="bg-slate-800/60 rounded-xl p-3 space-y-2"
                >
                  <div className="grid grid-cols-2 gap-2">
                    <Select
                      value={support.joint}
                      onValueChange={(value) =>
                        updateTrussSupport(index, 'joint', value)
                      }
                    >
                      <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
                        <SelectValue placeholder="Joint" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-slate-700 text-white">
                        {jointOptions.map((joint) => (
                          <SelectItem key={joint} value={joint}>
                            {joint}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={support.type}
                      onValueChange={(value) =>
                        updateTrussSupport(index, 'type', value)
                      }
                    >
                      <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
                        <SelectValue placeholder="Support" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-slate-700 text-white">
                        <SelectItem value="pin">Pin</SelectItem>
                        <SelectItem value="roller-y">Roller Vertical</SelectItem>
                        <SelectItem value="roller-x">Roller Horizontal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <RemoveButton onClick={() => removeTrussSupport(index)} />
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-orange-400">
                Loads
              </h3>

              <Button
                size="sm"
                onClick={addTrussLoad}
                className="bg-orange-500 hover:bg-orange-600"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>

            <div className="space-y-3">
              {trussData.loads.map((load, index) => (
                <div
                  key={index}
                  className="bg-slate-800/60 rounded-xl p-3 space-y-2"
                >
                  <Select
                    value={load.joint}
                    onValueChange={(value) =>
                      updateTrussLoad(index, 'joint', value)
                    }
                  >
                    <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
                      <SelectValue placeholder="Load Joint" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700 text-white">
                      {jointOptions.map((joint) => (
                        <SelectItem key={joint} value={joint}>
                          {joint}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="number"
                      value={load.fx}
                      onChange={(e) =>
                        updateTrussLoad(index, 'fx', e.target.value)
                      }
                      placeholder="Fx kN"
                      className="bg-slate-900 border-slate-700 text-white"
                    />

                    <Input
                      type="number"
                      value={load.fy}
                      onChange={(e) =>
                        updateTrussLoad(index, 'fy', e.target.value)
                      }
                      placeholder="Fy kN"
                      className="bg-slate-900 border-slate-700 text-white"
                    />
                  </div>

                  <RemoveButton onClick={() => removeTrussLoad(index)} />
                </div>
              ))}
            </div>
          </div>

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
            Truss Diagram
          </h2>

          <TrussDiagram trussData={trussData} />
        </Card>

        {!trussResult.ok && (
          <Card className="bg-red-950/40 border-red-800 p-5">
            <h3 className="text-red-300 font-semibold mb-2">
              Analysis Error
            </h3>
            <p className="text-red-200 text-sm">
              {trussResult.error}
            </p>
          </Card>
        )}

        <div className="grid md:grid-cols-4 gap-4">
          <SummaryCard label="Joints" value={trussResult.summary.joints} />
          <SummaryCard label="Members" value={trussResult.summary.members} />
          <SummaryCard label="Reactions" value={trussResult.summary.reactions} />
          <SummaryCard label="Type" value={trussResult.summary.determinacy} />
        </div>

        {trussResult.reactions?.length > 0 && (
          <Card className="bg-slate-900/50 border-slate-800 p-6">
            <h2 className="text-xl font-bold text-white mb-4">
              Support Reactions
            </h2>

            <div className="grid md:grid-cols-3 gap-3">
              {trussResult.reactions.map((reaction, index) => (
                <div
                  key={index}
                  className="bg-slate-800/60 rounded-xl p-4"
                >
                  <div className="text-slate-400 text-xs uppercase">
                    Joint {reaction.joint} · {reaction.direction}
                  </div>
                  <div className="text-white font-bold text-lg mt-1">
                    {reaction.value} {reaction.unit}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        <Card className="bg-slate-900/50 border-slate-800 p-6">
          <h2 className="text-xl font-bold text-white mb-4">
            Member Force Table
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-slate-300">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="text-left py-3">Member</th>
                  <th className="text-left py-3">Start</th>
                  <th className="text-left py-3">End</th>
                  <th className="text-left py-3">Length</th>
                  <th className="text-left py-3">Angle</th>
                  <th className="text-left py-3">Force</th>
                  <th className="text-left py-3">Nature</th>
                  <th className="text-left py-3">Stress</th>
                </tr>
              </thead>

              <tbody>
                {trussResult.memberForces.map((member) => (
                  <tr
                    key={member.member}
                    className="border-b border-slate-800/70"
                  >
                    <td className="py-3 font-semibold text-orange-400">
                      {member.member}
                    </td>
                    <td className="py-3">{member.start}</td>
                    <td className="py-3">{member.end}</td>
                    <td className="py-3">{member.length} m</td>
                    <td className="py-3">{member.angle}°</td>
                    <td className="py-3">{member.force} kN</td>
                    <td
                      className={
                        member.nature === 'Tension'
                          ? 'py-3 text-green-400 font-semibold'
                          : member.nature === 'Compression'
                            ? 'py-3 text-red-400 font-semibold'
                            : 'py-3 text-slate-400 font-semibold'
                      }
                    >
                      {member.nature}
                    </td>
                    <td className="py-3">{member.stress} N/mm²</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {trussResult.displacements?.length > 0 && (
          <Card className="bg-slate-900/50 border-slate-800 p-6">
            <h2 className="text-xl font-bold text-white mb-4">
              Joint Displacements
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-slate-300">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="text-left py-3">Joint</th>
                    <th className="text-left py-3">Ux</th>
                    <th className="text-left py-3">Uy</th>
                    <th className="text-left py-3">Unit</th>
                  </tr>
                </thead>

                <tbody>
                  {trussResult.displacements.map((item) => (
                    <tr
                      key={item.joint}
                      className="border-b border-slate-800/70"
                    >
                      <td className="py-3 font-semibold text-orange-400">
                        {item.joint}
                      </td>
                      <td className="py-3">{item.ux}</td>
                      <td className="py-3">{item.uy}</td>
                      <td className="py-3">{item.unit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        <Card className="bg-slate-900/50 border-slate-800 p-6">
          <h2 className="text-xl font-bold text-white mb-4">
            Step-by-Step Truss Solution
          </h2>

          <div className="space-y-3 text-slate-300 leading-7">
            {trussResult.steps.map((step, index) => (
              <p key={index}>
                <span className="text-orange-400 font-semibold">
                  Step {index + 1}:
                </span>{' '}
                {step}
              </p>
            ))}
          </div>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800 p-6">
          <h2 className="text-xl font-bold text-white mb-4">
            Formula Panel
          </h2>

          <div className="space-y-3 text-slate-300">
            <p>
              Determinacy:{' '}
              <b className="text-orange-400">
                {trussResult.formulas.determinacy}
              </b>
            </p>
            <p>
              Joint equilibrium X:{' '}
              <b className="text-orange-400">
                {trussResult.formulas.jointEquilibriumX}
              </b>
            </p>
            <p>
              Joint equilibrium Y:{' '}
              <b className="text-orange-400">
                {trussResult.formulas.jointEquilibriumY}
              </b>
            </p>
            <p>
              Stiffness equation:{' '}
              <b className="text-orange-400">
                {trussResult.formulas.stiffnessEquation}
              </b>
            </p>
            <p>
              Member force:{' '}
              <b className="text-orange-400">
                {trussResult.formulas.memberForce}
              </b>
            </p>
            <p>
              Member stress:{' '}
              <b className="text-orange-400">
                {trussResult.formulas.memberStress}
              </b>
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
function ColumnBucklingModule({
  columnResult,
  columnLength,
  setColumnLength,
  columnE,
  setColumnE,
  columnI,
  setColumnI,
  columnArea,
  setColumnArea,
  columnEndCondition,
  setColumnEndCondition,
  columnCrushingStress,
  setColumnCrushingStress,
  columnRankineConstant,
  setColumnRankineConstant,
}) {
  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <Card className="bg-slate-900/50 border-slate-800 p-6 lg:col-span-1">
        <h2 className="text-xl font-bold text-white mb-5">
          Column Buckling Inputs
        </h2>

        <div className="space-y-4">
          <div>
            <Label className="text-slate-400">Length L (m)</Label>
            <Input
              type="number"
              value={columnLength}
              onChange={(e) => setColumnLength(Number(e.target.value))}
              className="bg-slate-800 border-slate-700 text-white mt-2"
            />
          </div>

          <div>
            <Label className="text-slate-400">Young’s Modulus E (N/mm²)</Label>
            <Input
              type="number"
              value={columnE}
              onChange={(e) => setColumnE(Number(e.target.value))}
              className="bg-slate-800 border-slate-700 text-white mt-2"
            />
          </div>

          <div>
            <Label className="text-slate-400">Moment of Inertia I (mm⁴)</Label>
            <Input
              type="number"
              value={columnI}
              onChange={(e) => setColumnI(Number(e.target.value))}
              className="bg-slate-800 border-slate-700 text-white mt-2"
            />
          </div>

          <div>
            <Label className="text-slate-400">Area A (mm²)</Label>
            <Input
              type="number"
              value={columnArea}
              onChange={(e) => setColumnArea(Number(e.target.value))}
              className="bg-slate-800 border-slate-700 text-white mt-2"
            />
          </div>

          <div>
            <Label className="text-slate-400">End Condition</Label>
            <Select
              value={columnEndCondition}
              onValueChange={setColumnEndCondition}
            >
              <SelectTrigger className="bg-slate-800 border-slate-700 text-white mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-700 text-white">
                <SelectItem value="pinnedPinned">Pinned - Pinned</SelectItem>
                <SelectItem value="fixedFixed">Fixed - Fixed</SelectItem>
                <SelectItem value="fixedFree">Fixed - Free</SelectItem>
                <SelectItem value="fixedPinned">Fixed - Pinned</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-slate-400">
              Crushing Stress Pc/A (N/mm²)
            </Label>
            <Input
              type="number"
              value={columnCrushingStress}
              onChange={(e) =>
                setColumnCrushingStress(Number(e.target.value))
              }
              className="bg-slate-800 border-slate-700 text-white mt-2"
            />
          </div>

          <div>
            <Label className="text-slate-400">Rankine Constant α</Label>
            <Input
              type="number"
              step="0.000001"
              value={columnRankineConstant}
              onChange={(e) =>
                setColumnRankineConstant(Number(e.target.value))
              }
              className="bg-slate-800 border-slate-700 text-white mt-2"
            />
          </div>
        </div>

        <Button
          onClick={() => window.print()}
          className="w-full mt-6 bg-gradient-to-r from-orange-500 to-orange-600"
        >
          <Download className="h-4 w-4 mr-2" />
          Export / Print PDF
        </Button>
      </Card>

      <div className="lg:col-span-2 space-y-6">
        <div className="grid md:grid-cols-4 gap-4">
          <SummaryCard
            label="K Factor"
            value={columnResult.effectiveLengthFactor}
          />
          <SummaryCard
            label="Effective Length"
            value={`${columnResult.effectiveLength} m`}
          />
          <SummaryCard
            label="Slenderness"
            value={columnResult.slendernessRatio}
          />
          <SummaryCard
            label="Column Type"
            value={columnResult.columnType}
          />
        </div>

        <Card className="bg-slate-900/50 border-slate-800 p-6">
          <h2 className="text-xl font-bold text-white mb-4">
            Buckling Results
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <ResultRow
              label="Radius of Gyration"
              value={`${columnResult.radiusOfGyration} mm`}
            />
            <ResultRow
              label="Euler Critical Load"
              value={`${columnResult.eulerLoad} kN`}
            />
            <ResultRow
              label="Rankine Load"
              value={`${columnResult.rankineLoad} kN`}
            />
            <ResultRow
              label="Classification"
              value={columnResult.columnType}
            />
          </div>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800 p-6">
          <h2 className="text-xl font-bold text-white mb-4">
            Formula Panel
          </h2>

          <div className="space-y-3 text-slate-300">
            <p>
              Effective length:{' '}
              <b className="text-orange-400">
                {columnResult.formulas.effectiveLength}
              </b>
            </p>
            <p>
              Radius of gyration:{' '}
              <b className="text-orange-400">
                {columnResult.formulas.radiusOfGyration}
              </b>
            </p>
            <p>
              Slenderness ratio:{' '}
              <b className="text-orange-400">
                {columnResult.formulas.slendernessRatio}
              </b>
            </p>
            <p>
              Euler load:{' '}
              <b className="text-orange-400">
                {columnResult.formulas.eulerLoad}
              </b>
            </p>
            <p>
              Rankine load:{' '}
              <b className="text-orange-400">
                {columnResult.formulas.rankineLoad}
              </b>
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
function ResultRow({ label, value }) {
  return (
    <div className="bg-slate-800/60 rounded-xl p-4">
      <div className="text-xs uppercase tracking-wider text-slate-400 mb-1">
        {label}
      </div>
      <div className="text-lg font-bold text-white">
        {value}
      </div>
    </div>
  )
}
function TrussDiagram({ trussData }) {
  const width = 760
  const height = 300
  const padding = 80

  const xs = trussData.joints.map((joint) => joint.x)
  const ys = trussData.joints.map((joint) => joint.y)

  const minX = Math.min(...xs)
  const maxX = Math.max(...xs)
  const minY = Math.min(...ys)
  const maxY = Math.max(...ys)

  const scaleX = (x) =>
    padding +
    ((x - minX) / Math.max(maxX - minX, 1)) *
      (width - 2 * padding)

  const scaleY = (y) =>
    height -
    padding -
    ((y - minY) / Math.max(maxY - minY, 1)) *
      (height - 2 * padding)

  const getJoint = (id) => trussData.joints.find((joint) => joint.id === id)

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full bg-slate-950 rounded-xl border border-slate-800"
    >
      {trussData.members.map((member) => {
        const start = getJoint(member.start)
        const end = getJoint(member.end)

        if (!start || !end) return null

        return (
          <line
            key={member.id}
            x1={scaleX(start.x)}
            y1={scaleY(start.y)}
            x2={scaleX(end.x)}
            y2={scaleY(end.y)}
            stroke="#f97316"
            strokeWidth="5"
            strokeLinecap="round"
          />
        )
      })}

      {trussData.joints.map((joint) => (
        <g key={joint.id}>
          <circle
            cx={scaleX(joint.x)}
            cy={scaleY(joint.y)}
            r="13"
            fill="#1e293b"
            stroke="#f97316"
            strokeWidth="3"
          />
          <text
            x={scaleX(joint.x) - 5}
            y={scaleY(joint.y) + 5}
            fill="#ffffff"
            fontSize="13"
            fontWeight="700"
          >
            {joint.id}
          </text>
        </g>
      ))}

      {trussData.loads.map((load, index) => {
        const joint = getJoint(load.joint)
        if (!joint) return null

        const x = scaleX(joint.x)
        const y = scaleY(joint.y)

        return (
          <g key={index}>
            <line
              x1={x}
              y1={y - 55}
              x2={x}
              y2={y - 18}
              stroke="#ef4444"
              strokeWidth="3"
              markerEnd="url(#trussLoadArrow)"
            />
            <text x={x + 10} y={y - 40} fill="#fca5a5">
              {Math.abs(load.fy)} kN
            </text>
          </g>
        )
      })}

      <defs>
        <marker
          id="trussLoadArrow"
          markerWidth="10"
          markerHeight="10"
          refX="5"
          refY="5"
          orient="auto"
        >
          <path d="M0,0 L10,5 L0,10 Z" fill="#ef4444" />
        </marker>
      </defs>
    </svg>
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

      <div className="space-y-3">{children}</div>
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
  const svgWidth = 760
  const svgHeight = 210
  const x0 = 70
  const x1 = 690
  const y = 105
  const scale = (x) => x0 + (x / L) * (x1 - x0)

  return (
    <svg
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      className="w-full bg-slate-950 rounded-xl border border-slate-800"
    >
      <line x1={x0} y1={y} x2={x1} y2={y} stroke="#f97316" strokeWidth="6" />

      {structureType === 'cantilever' ? (
        <rect x={x0 - 15} y={y - 45} width="18" height="90" fill="#94a3b8" />
      ) : (
        <>
          <polygon
            points={`${x0 - 15},${y + 35} ${x0 + 15},${y + 35} ${x0},${y}`}
            fill="#94a3b8"
          />
          <circle cx={x1} cy={y + 22} r="12" fill="#94a3b8" />
        </>
      )}

      <text x={x0 - 10} y={y + 65} fill="#cbd5e1">
        A
      </text>
      <text x={x1 - 10} y={y + 65} fill="#cbd5e1">
        B
      </text>
      <text x={(x0 + x1) / 2 - 25} y={185} fill="#cbd5e1">
        L = {L} m
      </text>

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
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full bg-slate-950 rounded-xl border border-slate-800"
    >
      <line
        x1={padding}
        y1={height / 2}
        x2={width - padding}
        y2={height / 2}
        stroke="#64748b"
      />
      <path d={path} fill="none" stroke="#f97316" strokeWidth="3" />

      <text x={20} y={25} fill="#cbd5e1">
        {label}
      </text>
      <text x={20} y={50} fill="#94a3b8">
        Max: {Math.max(...values).toFixed(2)}
      </text>
      <text x={20} y={70} fill="#94a3b8">
        Min: {Math.min(...values).toFixed(2)}
      </text>
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
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full bg-slate-950 rounded-xl border border-slate-800"
    >
      <line
        x1={padding}
        y1={65}
        x2={width - padding}
        y2={65}
        stroke="#64748b"
        strokeDasharray="6 6"
      />
      <path d={path} fill="none" stroke="#38bdf8" strokeWidth="3" />
      <text x={20} y={25} fill="#cbd5e1">
        Deflected Shape
      </text>
    </svg>
  )
}
