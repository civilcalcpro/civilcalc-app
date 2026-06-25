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
import { momentAreaAnalysis } from '@/lib/engineering/moment-area'
export default function StructuralAnalysisPage() {
  const [activeModule, setActiveModule] = useState('beam')
const [columnLength, setColumnLength] = useState(3)
const [columnSectionType, setColumnSectionType] = useState('rectangular')
const [columnWidth, setColumnWidth] = useState(300)
const [columnDepth, setColumnDepth] = useState(450)
const [columnDiameter, setColumnDiameter] = useState(300)
const [columnMaterial, setColumnMaterial] = useState('rcc')
const [columnEndCondition, setColumnEndCondition] = useState('pinnedPinned')
const [columnAppliedLoad, setColumnAppliedLoad] = useState(500)
  const [momentAreaSpan, setMomentAreaSpan] = useState(6)
const [momentAreaE, setMomentAreaE] = useState(200000)
const [momentAreaI, setMomentAreaI] = useState(300000000)
const [momentAreaPointLoad, setMomentAreaPointLoad] = useState(20)
const [momentAreaPointPosition, setMomentAreaPointPosition] = useState(3)
const [momentAreaUDL, setMomentAreaUDL] = useState(0)
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
  const L = Number(columnLength) || 1
  const b = Number(columnWidth) || 300
  const d = Number(columnDepth) || 450
  const dia = Number(columnDiameter) || 300
  const appliedLoad = Number(columnAppliedLoad) || 0

  const isRectangular = columnSectionType === 'rectangular'

  const area = isRectangular
    ? b * d
    : (Math.PI * dia * dia) / 4

  const I = isRectangular
    ? (b * Math.pow(d, 3)) / 12
    : (Math.PI * Math.pow(dia, 4)) / 64

  const E = columnMaterial === 'steel' ? 200000 : 25000
  const crushingStress = columnMaterial === 'steel' ? 250 : 25
  const rankineConstant = columnMaterial === 'steel' ? 1 / 7500 : 1 / 1600

  const result = columnBuckling({
    length: L,
    E,
    I,
    area,
    endCondition: columnEndCondition,
    crushingStress,
    rankineConstant,
  })

  const safeLoad =
    result.rankineLoad !== 'Not calculated'
      ? Number(result.rankineLoad)
      : Number(result.eulerLoad)

  return {
    ...result,
    area: area.toFixed(2),
    momentOfInertia: I.toFixed(2),
    material: columnMaterial === 'steel' ? 'Steel' : 'RCC',
    appliedLoad: appliedLoad.toFixed(2),
    safeLoad: safeLoad.toFixed(2),
    safetyStatus: appliedLoad <= safeLoad ? 'Safe' : 'Unsafe',
  }
}, [
  columnLength,
  columnSectionType,
  columnWidth,
  columnDepth,
  columnDiameter,
  columnMaterial,
  columnEndCondition,
  columnAppliedLoad,
])
  const momentAreaResult = useMemo(() => {
  return momentAreaAnalysis({
    span: momentAreaSpan,
    E: momentAreaE,
    I: momentAreaI,
    pointLoads: [
      {
        P: momentAreaPointLoad,
        x: momentAreaPointPosition,
      },
    ],
    udls:
      Number(momentAreaUDL) > 0
        ? [
            {
              w: momentAreaUDL,
              start: 0,
              end: momentAreaSpan,
            },
          ]
        : [],
  })
}, [
  momentAreaSpan,
  momentAreaE,
  momentAreaI,
  momentAreaPointLoad,
  momentAreaPointPosition,
  momentAreaUDL,
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
    const n = 400

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

    const deflectionData = calculateBeamDeflectionFromMomentDiagram({
      points,
      E: EVal,
      I: Icalc,
      structureType,
    })

    const maxDeflection = deflectionData.maxDeflection

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
      deflectionLocation: deflectionData.location,
      deflectionCurve: deflectionData.curve,
      deflectionMethod: deflectionData.method,
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
    <Button
  onClick={() => setActiveModule('moment-area')}
  className={
    activeModule === 'moment-area'
      ? 'bg-orange-500 hover:bg-orange-600'
      : 'bg-slate-800 hover:bg-slate-700'
  }
>
  Moment Area
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
  columnSectionType={columnSectionType}
  setColumnSectionType={setColumnSectionType}
  columnWidth={columnWidth}
  setColumnWidth={setColumnWidth}
  columnDepth={columnDepth}
  setColumnDepth={setColumnDepth}
  columnDiameter={columnDiameter}
  setColumnDiameter={setColumnDiameter}
  columnMaterial={columnMaterial}
  setColumnMaterial={setColumnMaterial}
  columnEndCondition={columnEndCondition}
  setColumnEndCondition={setColumnEndCondition}
  columnAppliedLoad={columnAppliedLoad}
  setColumnAppliedLoad={setColumnAppliedLoad}
/>
)}
    {activeModule === 'moment-area' && (
  <MomentAreaModule
    result={momentAreaResult}
    span={momentAreaSpan}
    setSpan={setMomentAreaSpan}
    E={momentAreaE}
    setE={setMomentAreaE}
    I={momentAreaI}
    setI={setMomentAreaI}
    pointLoad={momentAreaPointLoad}
    setPointLoad={setMomentAreaPointLoad}
    pointPosition={momentAreaPointPosition}
    setPointPosition={setMomentAreaPointPosition}
    udl={momentAreaUDL}
    setUDL={setMomentAreaUDL}
  />
)}
    </div>
  )
}


function roundValue(value, decimals = 2) {
  const number = Number(value)

  if (!Number.isFinite(number)) return '0.00'

  return number.toFixed(decimals)
}

function getNumber(value, fallback = 0) {
  const number = Number(value)
  return Number.isFinite(number) ? number : fallback
}

function cloneBeamResult(result) {
  return {
    ...result,
    points: result.points.map((point) => ({ ...point })),
    criticalMomentPoint: { ...result.criticalMomentPoint },
    deflectionCurve: result.deflectionCurve?.map((point) => ({ ...point })) || [],
  }
}

function calculateBeamDeflectionFromMomentDiagram({
  points,
  E,
  I,
  structureType,
}) {
  if (!points?.length || !Number(E) || !Number(I)) {
    return {
      maxDeflection: 0,
      location: 0,
      curve: [],
      method: 'Deflection not calculated because E or I is missing.',
    }
  }

  const xs = points.map((point) => getNumber(point.x) * 1000)
  const curvature = points.map((point) => {
    const momentNmm = getNumber(point.M) * 1000000
    return momentNmm / (Number(E) * Number(I))
  })

  const rawSlope = [0]
  const rawDeflection = [0]

  for (let index = 1; index < points.length; index++) {
    const dx = xs[index] - xs[index - 1]
    const averageCurvature = (curvature[index - 1] + curvature[index]) / 2

    rawSlope[index] = rawSlope[index - 1] + averageCurvature * dx
    rawDeflection[index] =
      rawDeflection[index - 1] + ((rawSlope[index - 1] + rawSlope[index]) / 2) * dx
  }

  let deflections = rawDeflection

  if (structureType !== 'cantilever') {
    const totalLength = xs[xs.length - 1] || 1
    const endDeflection = rawDeflection[rawDeflection.length - 1] || 0

    deflections = rawDeflection.map(
      (value, index) => value - (endDeflection * xs[index]) / totalLength
    )
  }

  const curve = points.map((point, index) => ({
    x: point.x,
    y: deflections[index] || 0,
  }))

  const criticalPoint = curve.reduce((best, item) =>
    Math.abs(item.y) > Math.abs(best.y) ? item : best
  )

  return {
    maxDeflection: Math.abs(criticalPoint.y),
    location: criticalPoint.x,
    curve,
    method:
      structureType === 'cantilever'
        ? 'Numerical integration of M/EI with fixed-end slope and deflection as zero.'
        : 'Numerical integration of M/EI with support deflection at A and B as zero.',
  }
}

function validateBeamInputs({
  structureType,
  span,
  E,
  Icalc,
  pointLoads,
  udls,
  moments,
}) {
  const L = Number(span)

  if (!Number.isFinite(L) || L <= 0) {
    return 'Span length L must be greater than 0.'
  }

  if (!Number.isFinite(Number(E)) || Number(E) <= 0) {
    return 'Elastic modulus E must be greater than 0.'
  }

  if (!Number.isFinite(Number(Icalc)) || Number(Icalc) <= 0) {
    return 'Moment of inertia I must be greater than 0. Add valid section size or I override.'
  }

  if (!['simply-supported', 'cantilever'].includes(structureType)) {
    return 'For zero-error student output, this version supports Simply Supported Beam and Cantilever Beam only.'
  }

  for (const load of pointLoads) {
    const P = Number(load.P)
    const x = Number(load.x)

    if (!Number.isFinite(P) || P < 0) {
      return 'Point load value must be 0 or positive. Use positive value for downward load.'
    }

    if (!Number.isFinite(x) || x < 0 || x > L) {
      return `Point load position must be between 0 and ${roundValue(L)} m.`
    }
  }

  for (const load of udls) {
    const w = Number(load.w)
    const start = Number(load.start)
    const end = Number(load.end)

    if (!Number.isFinite(w) || w < 0) {
      return 'UDL value must be 0 or positive. Use positive value for downward UDL.'
    }

    if (
      !Number.isFinite(start) ||
      !Number.isFinite(end) ||
      start < 0 ||
      end > L ||
      start >= end
    ) {
      return `UDL start/end must be valid and inside the beam span 0 to ${roundValue(L)} m.`
    }
  }

  for (const moment of moments) {
    const M = Number(moment.M)
    const x = Number(moment.x)

    if (!Number.isFinite(M)) {
      return 'Applied moment value must be a valid number.'
    }

    if (!Number.isFinite(x) || x < 0 || x > L) {
      return `Applied moment position must be between 0 and ${roundValue(L)} m.`
    }
  }

  const activeVerticalLoads =
    pointLoads.filter((load) => Number(load.P) > 0).length +
    udls.filter((load) => Number(load.w) > 0).length

  const activeMoments = moments.filter((moment) => Number(moment.M) !== 0).length

  if (activeVerticalLoads + activeMoments === 0) {
    return 'Add at least one point load, UDL, or applied moment before calculating.'
  }

  return ''
}

function getBeamInputSignature({
  structureType,
  span,
  width,
  depth,
  E,
  I,
  pointLoads,
  udls,
  moments,
}) {
  return JSON.stringify({
    structureType,
    span: getNumber(span),
    width: getNumber(width),
    depth: getNumber(depth),
    E: getNumber(E),
    I: getNumber(I),
    pointLoads: pointLoads.map((load) => ({
      P: getNumber(load.P),
      x: getNumber(load.x),
    })),
    udls: udls.map((load) => ({
      w: getNumber(load.w),
      start: getNumber(load.start),
      end: getNumber(load.end),
    })),
    moments: moments.map((moment) => ({
      M: getNumber(moment.M),
      x: getNumber(moment.x),
    })),
  })
}

function getBeamLoadRows({ pointLoads, udls, moments }) {
  const rows = []

  pointLoads.forEach((load, index) => {
    const P = getNumber(load.P)
    const x = getNumber(load.x)

    if (P > 0) {
      rows.push({
        label: `Point Load ${index + 1}`,
        load: `${roundValue(P)} kN`,
        position: `${roundValue(x)} m from A`,
        moment: `${roundValue(P * x)} kNm`,
      })
    }
  })

  udls.forEach((load, index) => {
    const w = getNumber(load.w)
    const start = getNumber(load.start)
    const end = getNumber(load.end)
    const length = Math.max(end - start, 0)

    if (w > 0 && length > 0) {
      const W = w * length
      const centroid = start + length / 2

      rows.push({
        label: `UDL ${index + 1}`,
        load: `${roundValue(w)} kN/m × ${roundValue(length)} m = ${roundValue(W)} kN`,
        position: `Centroid at ${roundValue(centroid)} m from A`,
        moment: `${roundValue(W * centroid)} kNm`,
      })
    }
  })

  moments.forEach((moment, index) => {
    const M = getNumber(moment.M)
    const x = getNumber(moment.x)

    if (M !== 0) {
      rows.push({
        label: `Applied Moment ${index + 1}`,
        load: `${roundValue(M)} kNm`,
        position: `${roundValue(x)} m from A`,
        moment: `${roundValue(M)} kNm`,
      })
    }
  })

  return rows
}

function getBeamKeyTable({ result, pointLoads, udls, moments }) {
  const keyLocations = [
    0,
    result.L,
    result.criticalMomentPoint?.x || 0,
    result.deflectionLocation || 0,
    ...pointLoads.map((load) => getNumber(load.x)),
    ...udls.flatMap((load) => [getNumber(load.start), getNumber(load.end)]),
    ...moments.map((moment) => getNumber(moment.x)),
  ]

  const uniqueLocations = Array.from(
    new Set(
      keyLocations
        .filter((x) => Number.isFinite(x) && x >= 0 && x <= result.L)
        .map((x) => Number(x.toFixed(3)))
    )
  ).sort((a, b) => a - b)

  return uniqueLocations.map((x) => {
    const nearest = result.points.reduce((best, point) =>
      Math.abs(point.x - x) < Math.abs(best.x - x) ? point : best
    )

    return {
      x,
      shear: nearest.V,
      moment: nearest.M,
    }
  })
}

function getBeamSpecialCase({ structureType, result, pointLoads, udls, moments }) {
  const activePointLoads = pointLoads.filter((load) => Number(load.P) > 0)
  const activeUdls = udls.filter((load) => Number(load.w) > 0)
  const activeMoments = moments.filter((moment) => Number(moment.M) !== 0)

  if (activeMoments.length > 0) {
    return {
      title: 'General loading with applied moment',
      note: 'Reactions, SFD and BMD are calculated by equilibrium and section method.',
      deflectionNote: result.deflectionMethod,
    }
  }

  if (structureType === 'simply-supported') {
    if (activePointLoads.length === 1 && activeUdls.length === 0) {
      const P = getNumber(activePointLoads[0].P)
      const a = getNumber(activePointLoads[0].x)
      const b = result.L - a

      return {
        title: 'Simply supported beam with one point load',
        note: `Exact reaction formulas used: RA = Wb/L and RB = Wa/L. Here a = ${roundValue(a)} m and b = ${roundValue(b)} m.`,
        deflectionNote:
          Math.abs(a - result.L / 2) < 0.001
            ? 'For central point load, exact formula is δmax = PL³ / 48EI.'
            : result.deflectionMethod,
      }
    }

    if (
      activePointLoads.length === 0 &&
      activeUdls.length === 1 &&
      getNumber(activeUdls[0].start) === 0 &&
      Math.abs(getNumber(activeUdls[0].end) - result.L) < 0.001
    ) {
      return {
        title: 'Simply supported beam with full span UDL',
        note: 'Exact formulas used: RA = RB = wL/2 and Mmax = wL²/8.',
        deflectionNote: 'Exact formula for full span UDL is δmax = 5wL⁴ / 384EI.',
      }
    }
  }

  if (structureType === 'cantilever') {
    if (
      activePointLoads.length === 1 &&
      activeUdls.length === 0 &&
      Math.abs(getNumber(activePointLoads[0].x) - result.L) < 0.001
    ) {
      return {
        title: 'Cantilever beam with point load at free end',
        note: 'Exact formulas used: V = P and Mfixed = PL.',
        deflectionNote: 'Exact free-end deflection formula is δ = PL³ / 3EI.',
      }
    }

    if (
      activePointLoads.length === 0 &&
      activeUdls.length === 1 &&
      getNumber(activeUdls[0].start) === 0 &&
      Math.abs(getNumber(activeUdls[0].end) - result.L) < 0.001
    ) {
      return {
        title: 'Cantilever beam with full span UDL',
        note: 'Exact formulas used: V = wL and Mfixed = wL²/2.',
        deflectionNote: 'Exact free-end deflection formula is δ = wL⁴ / 8EI.',
      }
    }
  }

  return {
    title: 'General beam loading',
    note: 'Reactions, SFD and BMD are calculated using equilibrium and section-wise force summation.',
    deflectionNote: result.deflectionMethod,
  }
}

function buildBeamStepSolution({
  structureType,
  result,
  pointLoads,
  udls,
  moments,
}) {
  const loadRows = getBeamLoadRows({ pointLoads, udls, moments })
  const beamName =
    structureType === 'cantilever'
      ? 'Cantilever beam'
      : 'Simply supported beam'

  return [
    `Given beam type: ${beamName}.`,
    `Span length, L = ${roundValue(result.L)} m.`,
    `Total vertical load, ΣW = ${roundValue(result.totalLoad)} kN.`,
    ...loadRows.map(
      (row) =>
        `${row.label}: Load = ${row.load}, position = ${row.position}, moment about A = ${row.moment}.`
    ),
    structureType === 'cantilever'
      ? `For cantilever beam, vertical reaction at fixed support A = total downward load = ${roundValue(result.RA)} kN.`
      : `Taking moment about support A: RB × L = Σ(W × x) + ΣM, therefore RB = ${roundValue(result.RB)} kN.`,
    structureType === 'cantilever'
      ? `Fixed end moment at A = Σ(W × x) + ΣM = ${roundValue(result.fixedMoment)} kNm.`
      : `Using vertical equilibrium ΣFy = 0: RA + RB = ΣW, therefore RA = ${roundValue(result.RA)} kN.`,
    `Maximum shear force from SFD = ${roundValue(
      Math.max(Math.abs(result.maxShear), Math.abs(result.minShear))
    )} kN.`,
    `Maximum bending moment occurs near x = ${roundValue(
      result.criticalMomentPoint.x
    )} m.`,
    `Maximum bending moment = ${roundValue(
      Math.abs(result.criticalMomentPoint.M)
    )} kNm.`,
    `Maximum deflection = ${roundValue(result.maxDeflection)} mm at x = ${roundValue(
      result.deflectionLocation
    )} m.`,
  ]
}

function buildBeamFormulaList({ structureType, result, pointLoads, udls, moments }) {
  const specialCase = getBeamSpecialCase({
    structureType,
    result,
    pointLoads,
    udls,
    moments,
  })

  const formulas = [
    {
      title: 'Vertical equilibrium',
      formula: 'ΣFy = 0',
      meaning: 'Total upward reactions must balance total downward loads.',
    },
    {
      title: 'Moment equilibrium',
      formula: 'ΣMA = 0',
      meaning: 'Moment of all forces about support A is used to find the second reaction.',
    },
    {
      title: 'Point load reaction',
      formula: 'RA = Wb/L, RB = Wa/L',
      meaning: 'For a simply supported beam with one point load W at distance a from A and b from B.',
    },
    {
      title: 'UDL equivalent load',
      formula: 'W = w × l',
      meaning: 'UDL is converted into an equivalent point load at its centroid.',
    },
    {
      title: 'Bending moment at section',
      formula: 'Mx = RA × x - ΣP(x-a) - Σw·l(x-x̄) ± ΣM',
      meaning: 'Moment is calculated from all loads on the left side of the section.',
    },
    {
      title: 'Shear force at section',
      formula: 'Vx = RA - ΣP - Σw·l',
      meaning: 'Shear force is the algebraic sum of vertical forces on one side of the section.',
    },
    {
      title: 'Beam curvature',
      formula: 'EI d²y/dx² = M',
      meaning: specialCase.deflectionNote,
    },
  ]

  if (structureType === 'cantilever') {
    formulas.push({
      title: 'Cantilever fixed end moment',
      formula: 'MA = Σ(W × x) + ΣM',
      meaning: 'Fixed support carries vertical reaction and resisting moment.',
    })
  }

  return {
    specialCase,
    formulas,
  }
}

function buildExamAnswerText({
  structureType,
  result,
  pointLoads,
  udls,
  moments,
}) {
  const beamName =
    structureType === 'cantilever'
      ? 'cantilever beam'
      : 'simply supported beam'
  const loadRows = getBeamLoadRows({ pointLoads, udls, moments })
  const lines = [
    `Q. Analyze the given ${beamName} and find support reactions, shear force, bending moment and maximum deflection.`,
    '',
    'Given:',
    `Span, L = ${roundValue(result.L)} m`,
    ...loadRows.map((row) => `${row.label}: ${row.load} at ${row.position}`),
    '',
    'To Find:',
    '1. Support reactions',
    '2. Maximum shear force',
    '3. Maximum bending moment',
    '4. Maximum deflection',
    '',
    'Solution:',
    `Total load, ΣW = ${roundValue(result.totalLoad)} kN`,
  ]

  if (structureType === 'cantilever') {
    lines.push(
      `Vertical reaction at fixed support A = ${roundValue(result.RA)} kN`,
      `Fixed end moment at A = ${roundValue(result.fixedMoment)} kNm`
    )
  } else {
    lines.push(
      'Taking moment about support A:',
      `RB × ${roundValue(result.L)} = Σ(W × x) + ΣM`,
      `RB = ${roundValue(result.RB)} kN`,
      '',
      'Using vertical equilibrium:',
      'RA + RB = ΣW',
      `RA = ${roundValue(result.RA)} kN`
    )
  }

  lines.push(
    '',
    `Maximum shear force = ${roundValue(
      Math.max(Math.abs(result.maxShear), Math.abs(result.minShear))
    )} kN`,
    `Maximum bending moment = ${roundValue(
      Math.abs(result.criticalMomentPoint.M)
    )} kNm at x = ${roundValue(result.criticalMomentPoint.x)} m`,
    `Maximum deflection = ${roundValue(result.maxDeflection)} mm at x = ${roundValue(
      result.deflectionLocation
    )} m`,
    '',
    'Final Answer:',
    `RA = ${roundValue(result.RA)} kN`,
    structureType === 'cantilever'
      ? `Fixed moment = ${roundValue(result.fixedMoment)} kNm`
      : `RB = ${roundValue(result.RB)} kN`,
    `Max SF = ${roundValue(
      Math.max(Math.abs(result.maxShear), Math.abs(result.minShear))
    )} kN`,
    `Max BM = ${roundValue(Math.abs(result.criticalMomentPoint.M))} kNm`,
    `Max deflection = ${roundValue(result.maxDeflection)} mm`
  )

  return lines.join('\n')
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
  const [calculatedResult, setCalculatedResult] = useState(null)
  const [calculatedSignature, setCalculatedSignature] = useState('')
  const [activeOutputTab, setActiveOutputTab] = useState('final')
  const [validationError, setValidationError] = useState('')
  const [copyStatus, setCopyStatus] = useState('')

  const currentSignature = useMemo(
    () =>
      getBeamInputSignature({
        structureType,
        span,
        width,
        depth,
        E,
        I,
        pointLoads,
        udls,
        moments,
      }),
    [structureType, span, width, depth, E, I, pointLoads, udls, moments]
  )

  const hasCalculated = Boolean(calculatedResult)
  const isOutdated = hasCalculated && calculatedSignature !== currentSignature
  const displayResult = calculatedResult

  const handleCalculate = () => {
    const error = validateBeamInputs({
      structureType,
      span,
      E,
      Icalc: result.Icalc,
      pointLoads,
      udls,
      moments,
    })

    if (error) {
      setValidationError(error)
      setCalculatedResult(null)
      return
    }

    setValidationError('')
    setCopyStatus('')
    setCalculatedResult(cloneBeamResult(result))
    setCalculatedSignature(currentSignature)
    setActiveOutputTab('final')
  }

  const handleCopyExamAnswer = async () => {
    if (!displayResult) return

    const examAnswer = buildExamAnswerText({
      structureType,
      result: displayResult,
      pointLoads,
      udls,
      moments,
    })

    try {
      await navigator.clipboard.writeText(examAnswer)
      setCopyStatus('Exam answer copied.')
    } catch {
      setCopyStatus('Copy failed. You can select and copy manually.')
    }
  }

  return (
    <>
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="bg-slate-900/50 border-slate-800 p-6 lg:col-span-1">
          <div className="flex items-start justify-between gap-3 mb-5">
            <div>
              <h2 className="text-xl font-bold text-white">
                Student Inputs
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                Enter data first, then click Calculate Result.
              </p>
            </div>
            <span className="text-xs bg-orange-500/15 text-orange-300 border border-orange-500/30 px-3 py-1 rounded-full">
              Student Mode
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="text-slate-400">Structure Type</Label>
              <Select
                value={structureType}
                onValueChange={(value) => {
                  setStructureType(value)
                  setValidationError('')
                }}
              >
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
                </SelectContent>
              </Select>
              <p className="text-xs text-slate-500 mt-2">
                Exact student output is enabled for simply supported and cantilever beams.
              </p>
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
                <Label className="text-slate-400">I override (mm⁴)</Label>
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
                    <div>
                      <Label className="text-slate-500 text-xs">
                        Load P (kN)
                      </Label>
                      <Input
                        type="number"
                        value={load.P}
                        onChange={(e) =>
                          updatePointLoad(load.id, 'P', Number(e.target.value))
                        }
                        placeholder="Load kN"
                        className="bg-slate-900 border-slate-700 text-white mt-1"
                      />
                    </div>

                    <div>
                      <Label className="text-slate-500 text-xs">
                        Position x (m)
                      </Label>
                      <Input
                        type="number"
                        value={load.x}
                        onChange={(e) =>
                          updatePointLoad(load.id, 'x', Number(e.target.value))
                        }
                        placeholder="Position m"
                        className="bg-slate-900 border-slate-700 text-white mt-1"
                      />
                    </div>
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
                  <div>
                    <Label className="text-slate-500 text-xs">
                      UDL w (kN/m)
                    </Label>
                    <Input
                      type="number"
                      value={load.w}
                      onChange={(e) =>
                        updateUDL(load.id, 'w', Number(e.target.value))
                      }
                      placeholder="UDL kN/m"
                      className="bg-slate-900 border-slate-700 text-white mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-slate-500 text-xs">
                        Start (m)
                      </Label>
                      <Input
                        type="number"
                        value={load.start}
                        onChange={(e) =>
                          updateUDL(load.id, 'start', Number(e.target.value))
                        }
                        placeholder="Start m"
                        className="bg-slate-900 border-slate-700 text-white mt-1"
                      />
                    </div>

                    <div>
                      <Label className="text-slate-500 text-xs">
                        End (m)
                      </Label>
                      <Input
                        type="number"
                        value={load.end}
                        onChange={(e) =>
                          updateUDL(load.id, 'end', Number(e.target.value))
                        }
                        placeholder="End m"
                        className="bg-slate-900 border-slate-700 text-white mt-1"
                      />
                    </div>
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
                    <div>
                      <Label className="text-slate-500 text-xs">
                        Moment M (kNm)
                      </Label>
                      <Input
                        type="number"
                        value={moment.M}
                        onChange={(e) =>
                          updateMoment(moment.id, 'M', Number(e.target.value))
                        }
                        placeholder="Moment kNm"
                        className="bg-slate-900 border-slate-700 text-white mt-1"
                      />
                    </div>

                    <div>
                      <Label className="text-slate-500 text-xs">
                        Position x (m)
                      </Label>
                      <Input
                        type="number"
                        value={moment.x}
                        onChange={(e) =>
                          updateMoment(moment.id, 'x', Number(e.target.value))
                        }
                        placeholder="Position m"
                        className="bg-slate-900 border-slate-700 text-white mt-1"
                      />
                    </div>
                  </div>

                  <RemoveButton onClick={() => removeMoment(moment.id)} />
                </div>
              ))}
            </LoadSection>

            {validationError && (
              <div className="bg-red-950/40 border border-red-800 rounded-xl p-4 text-red-200 text-sm">
                {validationError}
              </div>
            )}

            {isOutdated && (
              <div className="bg-yellow-950/40 border border-yellow-700 rounded-xl p-4 text-yellow-200 text-sm">
                Inputs changed after calculation. Click Calculate Result again to update the output.
              </div>
            )}

            <Button
              onClick={handleCalculate}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold"
            >
              <Calculator className="h-4 w-4 mr-2" />
              Calculate Result
            </Button>

            <Button
              onClick={() => window.print()}
              className="w-full bg-slate-800 hover:bg-slate-700"
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

          {!hasCalculated ? (
            <Card className="bg-slate-900/50 border-slate-800 p-8 text-center">
              <div className="mx-auto w-14 h-14 rounded-2xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center mb-4">
                <Calculator className="h-7 w-7 text-orange-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">
                Enter inputs and calculate
              </h2>
              <p className="text-slate-400 mt-2 max-w-xl mx-auto">
                Result cards, SFD/BMD data, formula used and exam-style answer will appear after calculation.
              </p>
            </Card>
          ) : (
            <>
              <div className="grid md:grid-cols-4 gap-4">
                <SummaryCard label="RA" value={`${roundValue(displayResult.RA)} kN`} />
                <SummaryCard label="RB / Fixed M" value={
                  structureType === 'cantilever'
                    ? `${roundValue(displayResult.fixedMoment)} kNm`
                    : `${roundValue(displayResult.RB)} kN`
                } />
                <SummaryCard
                  label="Max BM"
                  value={`${roundValue(
                    Math.max(
                      Math.abs(displayResult.maxMoment),
                      Math.abs(displayResult.minMoment)
                    )
                  )} kNm`}
                />
                <SummaryCard
                  label="Deflection"
                  value={`${roundValue(displayResult.maxDeflection)} mm`}
                />
              </div>

              <Card className="bg-slate-900/50 border-slate-800 p-5">
                <div className="flex flex-wrap gap-2">
                  <OutputTabButton
                    active={activeOutputTab === 'final'}
                    onClick={() => setActiveOutputTab('final')}
                  >
                    Final Output
                  </OutputTabButton>
                  <OutputTabButton
                    active={activeOutputTab === 'solution'}
                    onClick={() => setActiveOutputTab('solution')}
                  >
                    Step-by-Step Solution
                  </OutputTabButton>
                  <OutputTabButton
                    active={activeOutputTab === 'formula'}
                    onClick={() => setActiveOutputTab('formula')}
                  >
                    Formula Used
                  </OutputTabButton>
                  <OutputTabButton
                    active={activeOutputTab === 'exam'}
                    onClick={() => setActiveOutputTab('exam')}
                  >
                    Exam Answer Format
                  </OutputTabButton>
                  <OutputTabButton
                    active={activeOutputTab === 'data'}
                    onClick={() => setActiveOutputTab('data')}
                  >
                    SFD / BMD Data
                  </OutputTabButton>
                </div>
              </Card>

              {activeOutputTab === 'final' && (
                <BeamFinalOutput
                  result={displayResult}
                  structureType={structureType}
                  pointLoads={pointLoads}
                  udls={udls}
                  moments={moments}
                />
              )}

              {activeOutputTab === 'solution' && (
                <BeamStepSolution
                  result={displayResult}
                  structureType={structureType}
                  pointLoads={pointLoads}
                  udls={udls}
                  moments={moments}
                />
              )}

              {activeOutputTab === 'formula' && (
                <FormulaUsedSection
                  result={displayResult}
                  structureType={structureType}
                  pointLoads={pointLoads}
                  udls={udls}
                  moments={moments}
                />
              )}

              {activeOutputTab === 'exam' && (
                <ExamAnswerSection
                  result={displayResult}
                  structureType={structureType}
                  pointLoads={pointLoads}
                  udls={udls}
                  moments={moments}
                  copyStatus={copyStatus}
                  onCopy={handleCopyExamAnswer}
                />
              )}

              {activeOutputTab === 'data' && (
                <SfdBmdDataSection
                  result={displayResult}
                  pointLoads={pointLoads}
                  udls={udls}
                  moments={moments}
                />
              )}

              <Card className="bg-slate-900/50 border-slate-800 p-6">
                <h2 className="text-xl font-bold text-white mb-4">
                  Shear Force Diagram
                </h2>

                <Diagram points={displayResult.points} type="V" label="SFD" />
              </Card>

              <Card className="bg-slate-900/50 border-slate-800 p-6">
                <h2 className="text-xl font-bold text-white mb-4">
                  Bending Moment Diagram
                </h2>

                <Diagram points={displayResult.points} type="M" label="BMD" />
              </Card>

              <Card className="bg-slate-900/50 border-slate-800 p-6">
                <h2 className="text-xl font-bold text-white mb-4">
                  Deflection Curve
                </h2>

                <DeflectionCurve points={displayResult.deflectionCurve || []} />
              </Card>
            </>
          )}
        </div>
      </div>
    </>
  )
}

function OutputTabButton({ active, onClick, children }) {
  return (
    <Button
      onClick={onClick}
      className={
        active
          ? 'bg-orange-500 hover:bg-orange-600'
          : 'bg-slate-800 hover:bg-slate-700'
      }
    >
      {children}
    </Button>
  )
}

function BeamFinalOutput({
  result,
  structureType,
  pointLoads,
  udls,
  moments,
}) {
  const specialCase = getBeamSpecialCase({
    structureType,
    result,
    pointLoads,
    udls,
    moments,
  })

  return (
    <Card className="bg-slate-900/50 border-slate-800 p-6">
      <h2 className="text-xl font-bold text-white mb-4">
        Final Output
      </h2>

      <div className="grid md:grid-cols-2 gap-4">
        <ResultRow label="Beam Case" value={specialCase.title} />
        <ResultRow label="Total Load" value={`${roundValue(result.totalLoad)} kN`} />
        <ResultRow label="Left Reaction RA" value={`${roundValue(result.RA)} kN`} />
        <ResultRow
          label={structureType === 'cantilever' ? 'Fixed End Moment' : 'Right Reaction RB'}
          value={
            structureType === 'cantilever'
              ? `${roundValue(result.fixedMoment)} kNm`
              : `${roundValue(result.RB)} kN`
          }
        />
        <ResultRow
          label="Maximum Shear Force"
          value={`${roundValue(
            Math.max(Math.abs(result.maxShear), Math.abs(result.minShear))
          )} kN`}
        />
        <ResultRow
          label="Maximum Bending Moment"
          value={`${roundValue(Math.abs(result.criticalMomentPoint.M))} kNm`}
        />
        <ResultRow
          label="Critical Section"
          value={`x = ${roundValue(result.criticalMomentPoint.x)} m`}
        />
        <ResultRow
          label="Maximum Deflection"
          value={`${roundValue(result.maxDeflection)} mm at x = ${roundValue(
            result.deflectionLocation
          )} m`}
        />
      </div>

      <div className="mt-5 bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-slate-300 leading-7">
        <p>
          <b className="text-orange-400">Student Tip:</b> {specialCase.note}
        </p>
        <p className="mt-2">
          <b className="text-orange-400">Deflection:</b> {specialCase.deflectionNote}
        </p>
      </div>
    </Card>
  )
}

function BeamStepSolution({
  result,
  structureType,
  pointLoads,
  udls,
  moments,
}) {
  const steps = buildBeamStepSolution({
    structureType,
    result,
    pointLoads,
    udls,
    moments,
  })

  return (
    <Card className="bg-slate-900/50 border-slate-800 p-6">
      <h2 className="text-xl font-bold text-white mb-4">
        Step-by-Step Solution
      </h2>

      <div className="space-y-3 text-slate-300 leading-7">
        {steps.map((step, index) => (
          <div
            key={index}
            className="bg-slate-800/50 border border-slate-700 rounded-xl p-4"
          >
            <span className="text-orange-400 font-semibold">
              Step {index + 1}:
            </span>{' '}
            {step}
          </div>
        ))}
      </div>
    </Card>
  )
}

function FormulaUsedSection({
  result,
  structureType,
  pointLoads,
  udls,
  moments,
}) {
  const { specialCase, formulas } = buildBeamFormulaList({
    structureType,
    result,
    pointLoads,
    udls,
    moments,
  })

  return (
    <Card className="bg-slate-900/50 border-slate-800 p-6">
      <h2 className="text-xl font-bold text-white mb-4">
        Formula Used
      </h2>

      <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 text-orange-100 mb-5">
        <b>Detected case:</b> {specialCase.title}
      </div>

      <div className="space-y-4">
        {formulas.map((item, index) => (
          <div
            key={index}
            className="bg-slate-800/50 border border-slate-700 rounded-xl p-4"
          >
            <div className="text-white font-semibold">
              {index + 1}. {item.title}
            </div>
            <div className="text-orange-400 font-bold mt-1">
              {item.formula}
            </div>
            <div className="text-slate-400 text-sm mt-2">
              {item.meaning}
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

function ExamAnswerSection({
  result,
  structureType,
  pointLoads,
  udls,
  moments,
  copyStatus,
  onCopy,
}) {
  const examAnswer = buildExamAnswerText({
    structureType,
    result,
    pointLoads,
    udls,
    moments,
  })

  return (
    <Card className="bg-slate-900/50 border-slate-800 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h2 className="text-xl font-bold text-white">
          Exam Answer Format
        </h2>

        <Button
          onClick={onCopy}
          className="bg-orange-500 hover:bg-orange-600"
        >
          Copy Exam Answer
        </Button>
      </div>

      {copyStatus && (
        <div className="mb-4 text-sm text-green-300 bg-green-950/30 border border-green-800 rounded-xl p-3">
          {copyStatus}
        </div>
      )}

      <pre className="bg-slate-950 border border-slate-800 rounded-xl p-5 text-slate-200 whitespace-pre-wrap leading-7 overflow-x-auto">
        {examAnswer}
      </pre>
    </Card>
  )
}

function SfdBmdDataSection({ result, pointLoads, udls, moments }) {
  const rows = getBeamKeyTable({ result, pointLoads, udls, moments })

  return (
    <Card className="bg-slate-900/50 border-slate-800 p-6">
      <h2 className="text-xl font-bold text-white mb-4">
        SFD / BMD Key Data
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-slate-300">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400">
              <th className="text-left py-3">Point</th>
              <th className="text-left py-3">Distance x</th>
              <th className="text-left py-3">Shear Force</th>
              <th className="text-left py-3">Bending Moment</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row, index) => (
              <tr
                key={`${row.x}-${index}`}
                className="border-b border-slate-800/70"
              >
                <td className="py-3 font-semibold text-orange-400">
                  {index + 1}
                </td>
                <td className="py-3">{roundValue(row.x)} m</td>
                <td className="py-3">{roundValue(row.shear)} kN</td>
                <td className="py-3">{roundValue(row.moment)} kNm</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-slate-500 text-xs mt-4">
        Table shows support, load, UDL boundary, critical moment and deflection locations.
      </p>
    </Card>
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
  <div>
    <Label className="text-slate-400 text-xs">
      Area A (mm²)
    </Label>
    <Input
      type="number"
      value={member.area || 1000}
      onChange={(e) =>
        updateTrussMember(index, 'area', e.target.value)
      }
      placeholder="Area mm²"
      className="bg-slate-900 border-slate-700 text-white mt-1"
    />
  </div>

  <div>
    <Label className="text-slate-400 text-xs">
      Elastic Modulus E (N/mm²)
    </Label>
    <Input
      type="number"
      value={member.E || 200000}
      onChange={(e) =>
        updateTrussMember(index, 'E', e.target.value)
      }
      placeholder="E N/mm²"
      className="bg-slate-900 border-slate-700 text-white mt-1"
    />
  </div>
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
  <div>
    <Label className="text-slate-400 text-xs">
      Horizontal Load Fx (kN)
    </Label>
    <Input
      type="number"
      value={load.fx}
      onChange={(e) =>
        updateTrussLoad(index, 'fx', e.target.value)
      }
      placeholder="Right + / Left -"
      className="bg-slate-900 border-slate-700 text-white mt-1"
    />
  </div>

  <div>
    <Label className="text-slate-400 text-xs">
      Vertical Load Fy (kN)
    </Label>
    <Input
      type="number"
      value={load.fy}
      onChange={(e) =>
        updateTrussLoad(index, 'fy', e.target.value)
      }
      placeholder="Up + / Down -"
      className="bg-slate-900 border-slate-700 text-white mt-1"
    />
  </div>
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
  columnSectionType,
  setColumnSectionType,
  columnWidth,
  setColumnWidth,
  columnDepth,
  setColumnDepth,
  columnDiameter,
  setColumnDiameter,
  columnMaterial,
  setColumnMaterial,
  columnEndCondition,
  setColumnEndCondition,
  columnAppliedLoad,
  setColumnAppliedLoad,
}) {
  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <Card className="bg-slate-900/50 border-slate-800 p-6 lg:col-span-1">
        <h2 className="text-xl font-bold text-white mb-5">Column Buckling Inputs</h2>

        <div className="space-y-4">
          <InputBox label="Length L (m)" value={columnLength} setValue={setColumnLength} />

          <div>
            <Label className="text-slate-400">Section Type</Label>
            <Select value={columnSectionType} onValueChange={setColumnSectionType}>
              <SelectTrigger className="bg-slate-800 border-slate-700 text-white mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-700 text-white">
                <SelectItem value="rectangular">Rectangular</SelectItem>
                <SelectItem value="circular">Circular</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {columnSectionType === 'rectangular' ? (
            <>
              <InputBox label="Width b (mm)" value={columnWidth} setValue={setColumnWidth} />
              <InputBox label="Depth d (mm)" value={columnDepth} setValue={setColumnDepth} />
            </>
          ) : (
            <InputBox label="Diameter D (mm)" value={columnDiameter} setValue={setColumnDiameter} />
          )}

          <div>
            <Label className="text-slate-400">Material</Label>
            <Select value={columnMaterial} onValueChange={setColumnMaterial}>
              <SelectTrigger className="bg-slate-800 border-slate-700 text-white mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-700 text-white">
                <SelectItem value="steel">Steel</SelectItem>
                <SelectItem value="rcc">RCC</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-slate-400">End Condition</Label>
            <Select value={columnEndCondition} onValueChange={setColumnEndCondition}>
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

          <InputBox label="Applied Load (kN)" value={columnAppliedLoad} setValue={setColumnAppliedLoad} />
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
          <SummaryCard label="Effective Length" value={`${columnResult.effectiveLength} m`} />
          <SummaryCard label="Area" value={`${columnResult.area} mm²`} />
          <SummaryCard label="Moment of Inertia" value={`${columnResult.momentOfInertia} mm⁴`} />
          <SummaryCard label="Status" value={columnResult.safetyStatus} />
        </div>

        <Card className="bg-slate-900/50 border-slate-800 p-6">
          <h2 className="text-xl font-bold text-white mb-4">Buckling Results</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <ResultRow label="Radius of Gyration" value={`${columnResult.radiusOfGyration} mm`} />
            <ResultRow label="Slenderness Ratio" value={columnResult.slendernessRatio} />
            <ResultRow label="Euler Load" value={`${columnResult.eulerLoad} kN`} />
            <ResultRow label="Rankine Load" value={`${columnResult.rankineLoad} kN`} />
            <ResultRow label="Applied Load" value={`${columnResult.appliedLoad} kN`} />
            <ResultRow label="Safe / Unsafe" value={columnResult.safetyStatus} />
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

function InputBox({ label, value, setValue }) {
  return (
    <div>
      <Label className="text-slate-400">{label}</Label>
      <Input
        type="number"
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="bg-slate-800 border-slate-700 text-white mt-2"
      />
    </div>
  )
}
function MomentAreaModule({
  result,
  span,
  setSpan,
  E,
  setE,
  I,
  setI,
  pointLoad,
  setPointLoad,
  pointPosition,
  setPointPosition,
  udl,
  setUDL,
}) {
  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <Card className="bg-slate-900/50 border-slate-800 p-6 lg:col-span-1">
        <h2 className="text-xl font-bold text-white mb-5">
          Moment Area Inputs
        </h2>

        <div className="space-y-4">
          <InputBox label="Span L (m)" value={span} setValue={setSpan} />
          <InputBox label="E (N/mm²)" value={E} setValue={setE} />
          <InputBox label="I (mm⁴)" value={I} setValue={setI} />
          <InputBox label="Point Load P (kN)" value={pointLoad} setValue={setPointLoad} />
          <InputBox label="Point Load Position x (m)" value={pointPosition} setValue={setPointPosition} />
          <InputBox label="UDL w (kN/m)" value={udl} setValue={setUDL} />
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
          <SummaryCard label="RA" value={`${result.reactions.RA} kN`} />
          <SummaryCard label="RB" value={`${result.reactions.RB} kN`} />
          <SummaryCard label="Max Moment" value={`${result.summary.maxMoment} kNm`} />
          <SummaryCard label="Max Deflection" value={`${result.summary.maxDeflection} mm`} />
        </div>

        <Card className="bg-slate-900/50 border-slate-800 p-6">
          <h2 className="text-xl font-bold text-white mb-4">
            Moment Area Results
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <ResultRow label="Total Load" value={`${result.summary.totalLoad} kN`} />
            <ResultRow label="Max Moment Location" value={`${result.summary.maxMomentLocation} m`} />
            <ResultRow label="Slope Difference" value={`${result.summary.slopeDifference} rad`} />
            <ResultRow label="Tangential Deviation" value={`${result.summary.tangentialDeviation} mm`} />
            <ResultRow label="Max Deflection Location" value={`${result.summary.maxDeflectionLocation} m`} />
            <ResultRow label="Maximum Deflection" value={`${result.summary.maxDeflection} mm`} />
          </div>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800 p-6">
          <h2 className="text-xl font-bold text-white mb-4">
            Step-by-Step Moment Area Solution
          </h2>

          <div className="space-y-3 text-slate-300 leading-7">
            {result.steps.map((step, index) => (
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
            <p><b className="text-orange-400">Theorem 1:</b> {result.formulas.theorem1}</p>
            <p><b className="text-orange-400">Theorem 2:</b> {result.formulas.theorem2}</p>
            <p><b className="text-orange-400">Curvature:</b> {result.formulas.curvature}</p>
            <p><b className="text-orange-400">Deflection:</b> {result.formulas.deflection}</p>
          </div>
        </Card>
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

  const fx = Number(load.fx) || 0
  const fy = Number(load.fy) || 0

  return (
    <g key={index}>
      {fx !== 0 && (
        <g>
          <line
            x1={fx > 0 ? x - 60 : x + 60}
            y1={y}
            x2={fx > 0 ? x - 18 : x + 18}
            y2={y}
            stroke="#ef4444"
            strokeWidth="3"
            markerEnd="url(#trussLoadArrow)"
          />
          <text
            x={fx > 0 ? x - 68 : x + 25}
            y={y - 10}
            fill="#fca5a5"
            fontSize="12"
          >
            Fx {fx} kN
          </text>
        </g>
      )}

      {fy !== 0 && (
        <g>
          <line
            x1={x}
            y1={fy > 0 ? y + 60 : y - 60}
            x2={x}
            y2={fy > 0 ? y + 18 : y - 18}
            stroke="#ef4444"
            strokeWidth="3"
            markerEnd="url(#trussLoadArrow)"
          />
          <text
            x={x + 10}
            y={fy > 0 ? y + 55 : y - 45}
            fill="#fca5a5"
            fontSize="12"
          >
            Fy {fy} kN
          </text>
        </g>
      )}
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
