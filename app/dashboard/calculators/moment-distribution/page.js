'use client'

import { useMemo, useRef, useState } from 'react'
import { Calculator, Plus, Trash2, RotateCcw, Activity } from 'lucide-react'

const fmt = (v, d = 3) => {
  const n = Number(v)
  if (!Number.isFinite(n)) return '0'
  return n.toFixed(d).replace(/\.?0+$/, '')
}

const num = (v, fallback = 0) => {
  const n = Number(v)
  return Number.isFinite(n) ? n : fallback
}

const jointName = (i) => String.fromCharCode(65 + i)
const isSimpleSupport = (type) => type === 'pin' || type === 'roller'
const createInitialSpan = (length = 5) => ({
  length,
  EI: 1,
  loadType: 'udl',
  w: 20,
  P: 50,
  a: length / 2,
})

function fixedEndMoments(span) {
  const L = num(span.length)
  if (L <= 0) return { left: 0, right: 0 }

  if (span.loadType === 'udl') {
    const w = num(span.w)
    return {
      left: -(w * L * L) / 12,
      right: (w * L * L) / 12,
    }
  }

  if (span.loadType === 'point') {
    const P = num(span.P)
    let a = num(span.a, L / 2)

    if (a <= 0 || a >= L) a = L / 2

    const b = L - a

    return {
      left: -(P * a * b * b) / (L * L),
      right: (P * a * a * b) / (L * L),
    }
  }

  return { left: 0, right: 0 }
}

function loadSummary(span) {
  const L = num(span.length)
  if (L <= 0) return { totalLoad: 0, momentAboutLeft: 0 }

  if (span.loadType === 'udl') {
    const w = num(span.w)
    return {
      totalLoad: w * L,
      momentAboutLeft: (w * L * L) / 2,
    }
  }

  if (span.loadType === 'point') {
    const P = num(span.P)
    let a = num(span.a, L / 2)

    if (a <= 0 || a >= L) a = L / 2

    return {
      totalLoad: P,
      momentAboutLeft: P * a,
    }
  }

  return { totalLoad: 0, momentAboutLeft: 0 }
}

function isActualPinEnd(jointIndex, totalSpans, joints) {
  const isEndJoint = jointIndex === 0 || jointIndex === totalSpans
  return isEndJoint && isSimpleSupport(joints[jointIndex])
}

function shearAt(span, RA, x) {
  if (span.loadType === 'udl') {
    return RA - num(span.w) * x
  }

  if (span.loadType === 'point') {
    const L = num(span.length)
    let a = num(span.a, L / 2)

    if (a <= 0 || a >= L) a = L / 2

    return x >= a ? RA - num(span.P) : RA
  }

  return RA
}

function momentAt(span, RA, leftMoment, x) {
  if (span.loadType === 'udl') {
    return leftMoment + RA * x - (num(span.w) * x * x) / 2
  }

  if (span.loadType === 'point') {
    const L = num(span.length)
    let a = num(span.a, L / 2)

    if (a <= 0 || a >= L) a = L / 2

    const loadMoment = x >= a ? num(span.P) * (x - a) : 0
    return leftMoment + RA * x - loadMoment
  }

  return leftMoment + RA * x
}

function createStations(span, RA, leftMoment) {
  const L = num(span.length, 1)
  const stations = []

  for (let i = 0; i <= 60; i++) {
    stations.push((L * i) / 60)
  }

  if (span.loadType === 'udl') {
    const w = num(span.w)
    if (w !== 0) {
      const zeroShearX = RA / w
      if (zeroShearX > 0 && zeroShearX < L) stations.push(zeroShearX)
    }
  }

  if (span.loadType === 'point') {
    let a = num(span.a, L / 2)
    if (a > 0 && a < L) stations.push(a)
  }

  const unique = [...new Set(stations.map((x) => Number(x.toFixed(4))))].sort(
    (a, b) => a - b
  )

  return unique.map((x) => ({
    x,
    shear: shearAt(span, RA, x),
    moment: momentAt(span, RA, leftMoment, x),
  }))
}

function runMomentDistribution(spans, joints, maxIterations = 20, tolerance = 0.001) {
  const totalSpans = spans.length

  let moments = spans.map((span) => {
    const fem = fixedEndMoments(span)
    return {
      left: fem.left,
      right: fem.right,
    }
  })

  const femTable = moments.map((m, i) => ({
    span: `${jointName(i)}${jointName(i + 1)}`,
    FEMLeft: m.left,
    FEMRight: m.right,
  }))

  const distributionRows = []

  const getConnectedEnds = (jointIndex) => {
    const connected = []

    if (jointIndex > 0) {
      const spanIndex = jointIndex - 1
      const span = spans[spanIndex]
      const L = num(span.length, 1)
      const EI = num(span.EI, 1)
      const farJoint = jointIndex - 1
      const farIsPinEnd = isActualPinEnd(farJoint, totalSpans, joints)

      connected.push({
        spanIndex,
        end: 'right',
        farEnd: 'left',
        farJoint,
        stiffness: farIsPinEnd ? (3 * EI) / L : (4 * EI) / L,
        carryOverFactor: farIsPinEnd ? 0 : 0.5,
        label: `${jointName(jointIndex)}${jointName(farJoint)}`,
      })
    }

    if (jointIndex < totalSpans) {
      const spanIndex = jointIndex
      const span = spans[spanIndex]
      const L = num(span.length, 1)
      const EI = num(span.EI, 1)
      const farJoint = jointIndex + 1
      const farIsPinEnd = isActualPinEnd(farJoint, totalSpans, joints)

      connected.push({
        spanIndex,
        end: 'left',
        farEnd: 'right',
        farJoint,
        stiffness: farIsPinEnd ? (3 * EI) / L : (4 * EI) / L,
        carryOverFactor: farIsPinEnd ? 0 : 0.5,
        label: `${jointName(jointIndex)}${jointName(farJoint)}`,
      })
    }
const stepSolution = []

stepSolution.push({
  title: 'Step 1: Given Data',
  lines: spans.map((span, index) => {
    const spanName = `${jointName(index)}${jointName(index + 1)}`
    if (span.loadType === 'udl') {
      return `${spanName}: L = ${fmt(span.length)} m, EI = ${fmt(span.EI)}, UDL w = ${fmt(span.w)} kN/m`
    }
    if (span.loadType === 'point') {
      return `${spanName}: L = ${fmt(span.length)} m, EI = ${fmt(span.EI)}, Point Load P = ${fmt(span.P)} kN at a = ${fmt(span.a)} m from left support`
    }
    return `${spanName}: L = ${fmt(span.length)} m, EI = ${fmt(span.EI)}, No external load`
  }),
})

stepSolution.push({
  title: 'Step 2: Fixed End Moments',
  lines: femTable.map((row) => {
    return `${row.span}: FEM Left = ${fmt(row.FEMLeft)} kNm, FEM Right = ${fmt(row.FEMRight)} kNm`
  }),
})

stepSolution.push({
  title: 'Step 3: Distribution Factors',
  lines: Array.from({ length: totalSpans + 1 }, (_, j) => {
    if (joints[j] === 'fixed') {
      return `Joint ${jointName(j)} is fixed, so distribution is not required at this joint.`
    }

    const connected = getConnectedEnds(j)

    if (!connected.length) {
      return `Joint ${jointName(j)} has no connected member.`
    }

    const totalStiffness = connected.reduce((sum, item) => sum + item.stiffness, 0)

    const dfText = connected
      .map((item) => {
        const df = totalStiffness > 0 ? item.stiffness / totalStiffness : 0
        return `${item.member || item.label}: K = ${fmt(item.stiffness)}, DF = ${fmt(df)}`
      })
      .join('; ')

    return `At Joint ${jointName(j)}: ${dfText}`
  }),
})

stepSolution.push({
  title: 'Step 4: Moment Distribution and Carry Over',
  lines:
    distributionRows.length > 0
      ? distributionRows.slice(0, 25).map((row) => {
          return `Iteration ${row.iteration}, Joint ${row.joint}, Member ${row.member}: Unbalanced Moment = ${fmt(row.unbalancedMoment)} kNm, DF = ${fmt(row.distributionFactor)}, Distributed Moment = ${fmt(row.distributedMoment)} kNm, Carry Over to ${row.carryTo} = ${fmt(row.carryOverMoment)} kNm`
        })
      : ['No moment distribution is required because all joints are already balanced.'],
})

stepSolution.push({
  title: 'Step 5: Final Member End Moments',
  lines: finalMoments.map((row) => {
    return `${row.span}: Moment at ${row.leftJoint} = ${fmt(row.leftMoment)} kNm, Moment at ${row.rightJoint} = ${fmt(row.rightMoment)} kNm`
  }),
})

stepSolution.push({
  title: 'Step 6: Support Reactions',
  lines: supportReactions.map((row) => {
    return `Joint ${row.joint}: Vertical Reaction = ${fmt(row.verticalReaction)} kN, Moment Reaction = ${fmt(row.momentReaction)} kNm`
  }),
})

stepSolution.push({
  title: 'Step 7: Maximum Shear Force and Bending Moment',
  lines: spanAnalysis.map((span) => {
    return `${span.span}: Max Shear = ${fmt(span.maxShear.shear)} kN at x = ${fmt(span.maxShear.x)} m, Max BM = ${fmt(span.maxMoment.moment)} kNm at x = ${fmt(span.maxMoment.x)} m`
  }),
})
    return connected
  }

  for (let iteration = 1; iteration <= maxIterations; iteration++) {
    let maxUnbalance = 0

    for (let j = 0; j <= totalSpans; j++) {
      if (joints[j] === 'fixed') continue

      const connected = getConnectedEnds(j)
      if (!connected.length) continue

      const jointMoment = connected.reduce((sum, item) => {
        return sum + moments[item.spanIndex][item.end]
      }, 0)

      maxUnbalance = Math.max(maxUnbalance, Math.abs(jointMoment))

      if (Math.abs(jointMoment) < tolerance) continue

      const totalStiffness = connected.reduce((sum, item) => {
        return sum + item.stiffness
      }, 0)

      if (totalStiffness <= 0) continue

      const correctionTotal = -jointMoment

      connected.forEach((item) => {
        const df = item.stiffness / totalStiffness
        const distributedMoment = correctionTotal * df
        const carryOverMoment = distributedMoment * item.carryOverFactor

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

  const jointBalance = Array.from({ length: totalSpans + 1 }, (_, j) => {
    let balance = 0

    if (j > 0) balance += moments[j - 1].right
    if (j < totalSpans) balance += moments[j].left

    return {
      joint: jointName(j),
      type: joints[j],
      balance,
    }
  })

  const spanAnalysis = spans.map((span, i) => {
    const L = num(span.length, 1)
    const { totalLoad, momentAboutLeft } = loadSummary(span)

    const leftMoment = moments[i].left
    const rightMoment = moments[i].right

    const RB = (momentAboutLeft + leftMoment + rightMoment) / L
    const RA = totalLoad - RB

    const stations = createStations(span, RA, leftMoment)

    const maxShearItem = stations.reduce((max, item) => {
      return Math.abs(item.shear) > Math.abs(max.shear) ? item : max
    }, stations[0])

    const maxMomentItem = stations.reduce((max, item) => {
      return Math.abs(item.moment) > Math.abs(max.moment) ? item : max
    }, stations[0])

    return {
      span: `${jointName(i)}${jointName(i + 1)}`,
      leftJoint: jointName(i),
      rightJoint: jointName(i + 1),
      RA,
      RB,
      totalLoad,
      leftMoment,
      rightMoment,
      bmdLeft: leftMoment,
      bmdRight: -rightMoment,
      stations,
      maxShear: maxShearItem,
      maxMoment: maxMomentItem,
    }
  })

  const supportReactions = Array.from({ length: totalSpans + 1 }, (_, j) => {
    let verticalReaction = 0

    if (j > 0) verticalReaction += spanAnalysis[j - 1].RB
    if (j < totalSpans) verticalReaction += spanAnalysis[j].RA

    return {
      joint: jointName(j),
      type: joints[j],
      verticalReaction,
      momentReaction: jointBalance[j].balance,
    }
  })

 return {
  femTable,
  distributionRows,
  finalMoments,
  jointBalance,
  spanAnalysis,
  supportReactions,
  stepSolution,
}
}

export default function MomentDistributionPage() {
  const inputDiagramRef = useRef(null)
const outputDiagramRef = useRef(null)
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

 const [joints, setJoints] = useState(['pin', 'continuous', 'roller'])
  const [maxIterations, setMaxIterations] = useState(30)
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
    setJoints((prev) => prev.map((joint, i) => (i === index ? value : joint)))
  }

  const addSpan = () => {
    setSpans((prev) => [...prev, createInitialSpan(5)])

    setJoints((prev) => {
      const updated = [...prev]
      if (updated.length > 0) updated[updated.length - 1] = 'continuous'
      return [...updated, 'roller']
    })
  }

  const removeSpan = (index) => {
    if (spans.length <= 1) return

    const newSpans = spans.filter((_, i) => i !== index)
    let newJoints = joints.filter((_, i) => i !== index + 1)

    newJoints = newJoints.slice(0, newSpans.length + 1)

    if (newJoints.length === newSpans.length + 1) {
      if (!newJoints[0]) newJoints[0] = 'pin'
      if (!newJoints[newJoints.length - 1]) {
        newJoints[newJoints.length - 1] = 'pin'
      }
    }

    setSpans(newSpans)
    setJoints(newJoints)
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
    setJoints(['pin', 'continuous', 'roller'])
    setMaxIterations(30)
    setTolerance(0.001)
  }
const downloadPDF = async () => {
  try {
    const { default: jsPDF } = await import('jspdf')
    const autoTableModule = await import('jspdf-autotable')
    const html2canvasModule = await import('html2canvas')

    const autoTable = autoTableModule.default || autoTableModule.autoTable
    const html2canvas = html2canvasModule.default

    const doc = new jsPDF('p', 'mm', 'a4')
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()

    let y = 15

    const addTitle = (title, subtitle = '') => {
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(18)
      doc.text(title, pageWidth / 2, y, { align: 'center' })

      y += 7

      if (subtitle) {
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(10)
        doc.text(subtitle, pageWidth / 2, y, { align: 'center' })
        y += 7
      }
    }

    const addSectionTitle = (title) => {
      if (y > 260) {
        doc.addPage()
        y = 15
      }

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(13)
      doc.text(title, 14, y)
      y += 6
    }

    const addCapturedElement = async (element, title) => {
      if (!element) return

      if (y > 225) {
        doc.addPage()
        y = 15
      }

      addSectionTitle(title)

      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: '#020617',
        useCORS: true,
      })

      const imgData = canvas.toDataURL('image/png')
      const imgWidth = pageWidth - 28
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      if (y + imgHeight > pageHeight - 18) {
        doc.addPage()
        y = 15
        addSectionTitle(title)
      }

      doc.addImage(
        imgData,
        'PNG',
        14,
        y,
        imgWidth,
        Math.min(imgHeight, 170)
      )

      y += Math.min(imgHeight, 170) + 8
    }

    addTitle(
      'Moment Distribution Method Report',
      'Generated by CivilCalc Pro'
    )

    await addCapturedElement(inputDiagramRef.current, '1. Input Beam Diagram')

    addSectionTitle('2. Step-by-step Solution')

    result.stepSolution.forEach((step) => {
      if (y > 250) {
        doc.addPage()
        y = 15
      }

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(11)
      doc.text(step.title, 14, y)
      y += 5

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8.5)

      step.lines.forEach((line, index) => {
        const text = `${index + 1}. ${line}`
        const splitText = doc.splitTextToSize(text, pageWidth - 28)

        if (y + splitText.length * 4 > 280) {
          doc.addPage()
          y = 15
        }

        doc.text(splitText, 14, y)
        y += splitText.length * 4 + 1
      })

      y += 4
    })

    if (y > 220) {
      doc.addPage()
      y = 15
    }

    addSectionTitle('3. Final Answer')

    autoTable(doc, {
      startY: y,
      head: [['Span', 'Left End Moment', 'Right End Moment']],
      body: result.finalMoments.map((row) => [
        row.span,
        `${fmt(row.leftMoment)} kNm`,
        `${fmt(row.rightMoment)} kNm`,
      ]),
      styles: {
        fontSize: 8,
      },
      headStyles: {
        fillColor: [255, 122, 0],
        textColor: [0, 0, 0],
      },
    })

    y = doc.lastAutoTable.finalY + 7

    autoTable(doc, {
      startY: y,
      head: [['Joint', 'Support Type', 'Vertical Reaction', 'Moment Reaction']],
      body: result.supportReactions.map((row) => [
        row.joint,
        supportLabel(row.type),
        `${fmt(row.verticalReaction)} kN`,
        `${fmt(row.momentReaction)} kNm`,
      ]),
      styles: {
        fontSize: 8,
      },
      headStyles: {
        fillColor: [255, 122, 0],
        textColor: [0, 0, 0],
      },
    })

    y = doc.lastAutoTable.finalY + 7

    autoTable(doc, {
      startY: y,
      head: [['Span', 'Max Shear', 'Location', 'Max BM', 'Location']],
      body: result.spanAnalysis.map((span) => [
        span.span,
        `${fmt(span.maxShear.shear)} kN`,
        `${fmt(span.maxShear.x)} m`,
        `${fmt(span.maxMoment.moment)} kNm`,
        `${fmt(span.maxMoment.x)} m`,
      ]),
      styles: {
        fontSize: 8,
      },
      headStyles: {
        fillColor: [255, 122, 0],
        textColor: [0, 0, 0],
      },
    })

    y = doc.lastAutoTable.finalY + 8

    await addCapturedElement(outputDiagramRef.current, '4. SFD / BMD Diagrams')

    const pageCount = doc.internal.getNumberOfPages()

    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8)
      doc.text(
        `CivilCalc Pro | Moment Distribution Method | Page ${i} of ${pageCount}`,
        pageWidth / 2,
        290,
        { align: 'center' }
      )
    }

    doc.save('moment-distribution-solution.pdf')
  } catch (error) {
    console.error(error)
    alert(
      'PDF generate nahi ho paya. Please jspdf, jspdf-autotable aur html2canvas install check karo.'
    )
  }
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
                Continuous beam ke FEM, distribution factor, carry-over moment,
                final end moment, support reaction, SFD aur BMD automatic solve karo.
              </p>
            </div>
<button
  onClick={downloadPDF}
  className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 font-bold text-black hover:bg-orange-400"
>
  <Download size={18} />
  Download PDF
</button>
            <button
              onClick={resetExample}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-200 hover:bg-slate-800"
            >
              <RotateCcw size={18} />
              Reset Example
            </button>
          </div>
        </div>
<div ref={inputDiagramRef}>
 <div ref={inputDiagramRef}>
  <BeamInputDiagram spans={spans} joints={joints} />
</div>
</div>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
              <div className="flex items-center justify-between gap-3 mb-5">
                <div>
                  <h2 className="text-xl font-bold">Span Input</h2>
                  <p className="text-slate-400 text-sm">
                    Length, relative EI aur load type enter karo.
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
                      <Field
                        label="Length L"
                        value={span.length}
                        onChange={(value) => updateSpan(index, 'length', value)}
                      />

                      <Field
                        label="Relative EI"
                        value={span.EI}
                        onChange={(value) => updateSpan(index, 'EI', value)}
                      />

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
                        <Field
                          label="UDL w"
                          value={span.w}
                          onChange={(value) => updateSpan(index, 'w', value)}
                        />
                      )}

                      {span.loadType === 'point' && (
                        <>
                          <Field
                            label="Point Load P"
                            value={span.P}
                            onChange={(value) => updateSpan(index, 'P', value)}
                          />

                          <Field
                            label="Distance a from left"
                            value={span.a}
                            onChange={(value) => updateSpan(index, 'a', value)}
                          />
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
                End support ke liye Pin/Roller use karo. Internal support ke liye Continuous Joint use karo.
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
                     <option value="pin">Pin Support</option>
<option value="roller">Roller Support</option>
<option value="continuous">Continuous Joint</option>
<option value="fixed">Fixed Support</option>
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
                <Field
                  label="Maximum Iterations"
                  value={maxIterations}
                  onChange={(value) => setMaxIterations(Number(value))}
                />

                <Field
                  label="Tolerance"
                  value={tolerance}
                  step="0.0001"
                  onChange={(value) => setTolerance(Number(value))}
                />
              </div>

              <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950 p-4">
                <p className="text-sm text-slate-400">Sign Convention</p>
                <p className="text-sm text-slate-200 mt-2">
                  Member end moment convention use kiya gaya hai. BMD ke right end par sign converted form me show hota hai.
                </p>
              </div>
            </div>
          </div>
        </div>
<ResultSection title="Step-by-step Solution">
  <div className="space-y-5">
    {result.stepSolution.map((step, index) => (
      <div
        key={index}
        className="rounded-2xl border border-slate-800 bg-slate-950 p-5"
      >
        <h3 className="text-lg font-bold text-orange-300 mb-3">
          {step.title}
        </h3>

        <div className="space-y-2">
          {step.lines.map((line, i) => (
            <p key={i} className="text-sm leading-6 text-slate-300">
              {i + 1}. {line}
            </p>
          ))}
        </div>
      </div>
    ))}
  </div>
</ResultSection>
        <ResultSection title="1. Fixed End Moments">
          <Table
            headers={['Span', 'FEM Left', 'FEM Right']}
            rows={result.femTable.map((row) => [
              row.span,
              `${fmt(row.FEMLeft)} kNm`,
              `${fmt(row.FEMRight)} kNm`,
            ])}
          />
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
                  <th className="p-3 text-right">Stiffness</th>
                  <th className="p-3 text-right">DF</th>
                  <th className="p-3 text-right">Distributed</th>
                  <th className="p-3 text-right">Carry Over</th>
                  <th className="p-3 text-left">Carry To</th>
                </tr>
              </thead>

              <tbody>
                {result.distributionRows.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="p-5 text-center text-slate-400">
                      No distribution required.
                    </td>
                  </tr>
                ) : (
                  result.distributionRows.slice(0, 150).map((row, i) => (
                    <tr key={i} className="border-b border-slate-800/60">
                      <td className="p-3">{row.iteration}</td>
                      <td className="p-3 text-orange-300 font-semibold">{row.joint}</td>
                      <td className="p-3">{row.member}</td>
                      <td className="p-3 text-right">{fmt(row.unbalancedMoment)}</td>
                      <td className="p-3 text-right">{fmt(row.stiffness)}</td>
                      <td className="p-3 text-right">{fmt(row.distributionFactor)}</td>
                      <td className="p-3 text-right">{fmt(row.distributedMoment)}</td>
                      <td className="p-3 text-right">{fmt(row.carryOverMoment)}</td>
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
              <InfoCard
                key={i}
                title={`Span ${row.span}`}
                rows={[
                  [`Moment at ${row.leftJoint}`, `${fmt(row.leftMoment)} kNm`],
                  [`Moment at ${row.rightJoint}`, `${fmt(row.rightMoment)} kNm`],
                ]}
              />
            ))}
          </div>
        </ResultSection>

        <ResultSection title="4. Support Reactions">
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
            {result.supportReactions.map((row, i) => (
              <InfoCard
                key={i}
                title={`Joint ${row.joint}`}
                rows={[
                  ['Support Type', supportLabel(row.type)],
                  ['Vertical Reaction', `${fmt(row.verticalReaction)} kN`],
                  ['Moment Reaction', `${fmt(row.momentReaction)} kNm`],
                ]}
              />
            ))}
          </div>
        </ResultSection>

      <div ref={outputDiagramRef}>
  <ResultSection title="SFD / BMD Diagrams">
    <div className="grid lg:grid-cols-2 gap-5">
            {result.spanAnalysis.map((span, i) => (
              <div
                key={i}
                className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-5"
              >
                <div className="flex items-center gap-2">
                  <Activity className="text-orange-300" size={20} />
                  <h3 className="text-lg font-bold text-orange-300">
                    Span {span.span}
                  </h3>
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                  <MiniStat label={`Reaction at ${span.leftJoint}`} value={`${fmt(span.RA)} kN`} />
                  <MiniStat label={`Reaction at ${span.rightJoint}`} value={`${fmt(span.RB)} kN`} />
                  <MiniStat label="Max Shear" value={`${fmt(span.maxShear.shear)} kN at ${fmt(span.maxShear.x)} m`} />
                  <MiniStat label="Max BM" value={`${fmt(span.maxMoment.moment)} kNm at ${fmt(span.maxMoment.x)} m`} />
                </div>

                <div>
                  <p className="text-sm text-slate-400 mb-2">SFD</p>
                  <MiniDiagram points={span.stations} valueKey="shear" />
                </div>

                <div>
                  <p className="text-sm text-slate-400 mb-2">BMD</p>
                  <MiniDiagram points={span.stations} valueKey="moment" />
                </div>
              </div>
            ))}
          </div>
        </ResultSection>

        <ResultSection title="6. Joint Balance Check">
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
                    ? 'Fixed support moment reaction.'
                    : 'Balanced joint value should be close to zero.'}
                </p>
              </div>
            ))}
          </div>
        </ResultSection>
      </div>
    </div>
  )
}

function Field({ label, value, onChange, step = 'any' }) {
  return (
    <div>
      <label className="text-sm text-slate-400">{label}</label>
      <input
        type="number"
        step={step}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 p-3 text-white outline-none focus:border-orange-500"
      />
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

function Table({ headers, rows }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-800 text-slate-400">
            {headers.map((header) => (
              <th key={header} className="p-3 text-left">
                {header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-slate-800/60">
              {row.map((cell, j) => (
                <td
                  key={j}
                  className={`p-3 ${j === 0 ? 'font-semibold text-orange-300' : ''}`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function InfoCard({ title, rows }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
      <h3 className="text-lg font-bold text-orange-300 mb-4">{title}</h3>

      <div className="space-y-3">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between gap-3">
            <span className="text-slate-400 text-sm">{label}</span>
            <span className="font-bold text-right">{value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function MiniStat({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="text-lg font-black mt-1">{value}</p>
    </div>
  )
}

function MiniDiagram({ points, valueKey }) {
  if (!points || points.length < 2) {
    return (
      <div className="h-40 rounded-xl border border-slate-800 bg-slate-900" />
    )
  }

  const width = 700
  const height = 170
  const padding = 18

  const xValues = points.map((p) => p.x)
  const yValues = points.map((p) => p[valueKey])

  const minX = Math.min(...xValues)
  const maxX = Math.max(...xValues)
  const minY = Math.min(...yValues, 0)
  const maxY = Math.max(...yValues, 0)

  const xRange = maxX - minX || 1
  const yRange = maxY - minY || 1

  const mapX = (x) => padding + ((x - minX) / xRange) * (width - padding * 2)
  const mapY = (y) =>
    height - padding - ((y - minY) / yRange) * (height - padding * 2)

  const polyline = points
    .map((p) => `${mapX(p.x)},${mapY(p[valueKey])}`)
    .join(' ')

  const zeroY = mapY(0)

  return (
    <div className="w-full overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-44">
        <line
          x1={padding}
          x2={width - padding}
          y1={zeroY}
          y2={zeroY}
          className="stroke-slate-600"
          strokeWidth="1"
        />

        <polyline
          points={polyline}
          fill="none"
          className="stroke-orange-400"
          strokeWidth="3"
        />

        <circle
          cx={mapX(points[0].x)}
          cy={mapY(points[0][valueKey])}
          r="4"
          className="fill-orange-300"
        />

        <circle
          cx={mapX(points[points.length - 1].x)}
          cy={mapY(points[points.length - 1][valueKey])}
          r="4"
          className="fill-orange-300"
        />
      </svg>
    </div>
  )
}
function BeamInputDiagram({ spans, joints }) {
  const width = 900
  const height = 280
  const padding = 70
  const beamY = 130
  const supportY = 165
  const loadTopY = 42
  const dimY = 215

  const lengths = spans.map((span) => Math.max(num(span.length, 1), 0.1))
  const totalLength = lengths.reduce((sum, length) => sum + length, 0) || 1
  const beamWidth = width - padding * 2

  const jointXs = [padding]

  lengths.reduce((sum, length) => {
    const next = sum + length
    jointXs.push(padding + (next / totalLength) * beamWidth)
    return next
  }, 0)

  const renderSupport = (type, x, index) => {
    if (type === 'fixed') {
      return (
        <g key={`support-${index}`}>
          <rect
            x={x - 8}
            y={beamY - 38}
            width="16"
            height="76"
            rx="2"
            fill="#334155"
            stroke="#64748b"
            strokeWidth="2"
          />

          {[0, 1, 2, 3, 4].map((i) => (
            <line
              key={i}
              x1={x - 18}
              y1={beamY - 32 + i * 16}
              x2={x - 8}
              y2={beamY - 42 + i * 16}
              stroke="#64748b"
              strokeWidth="2"
            />
          ))}

          <text
            x={x}
            y={supportY + 34}
            textAnchor="middle"
            fontSize="12"
            fill="#cbd5e1"
          >
            Fixed
          </text>
        </g>
      )
    }

    if (type === 'continuous') {
      return (
        <g key={`support-${index}`}>
          <path
            d={`M ${x} ${beamY + 8} L ${x - 24} ${supportY} L ${x + 24} ${supportY} Z`}
            fill="#0f172a"
            stroke="#f97316"
            strokeWidth="2"
          />

          <circle cx={x - 12} cy={supportY + 8} r="4" fill="#94a3b8" />
          <circle cx={x + 12} cy={supportY + 8} r="4" fill="#94a3b8" />

          <line
            x1={x - 32}
            y1={supportY + 14}
            x2={x + 32}
            y2={supportY + 14}
            stroke="#64748b"
            strokeWidth="2"
          />

          <text
            x={x}
            y={supportY + 34}
            textAnchor="middle"
            fontSize="12"
            fill="#cbd5e1"
          >
            Continuous
          </text>
        </g>
      )
    }

    return (
      <g key={`support-${index}`}>
        <path
          d={`M ${x} ${beamY + 8} L ${x - 24} ${supportY} L ${x + 24} ${supportY} Z`}
          fill="#0f172a"
          stroke="#f97316"
          strokeWidth="2"
        />

        <line
          x1={x - 32}
          y1={supportY + 8}
          x2={x + 32}
          y2={supportY + 8}
          stroke="#64748b"
          strokeWidth="2"
        />

        <text
          x={x}
          y={supportY + 34}
          textAnchor="middle"
          fontSize="12"
          fill="#cbd5e1"
        >
          Pin/Roller
        </text>
      </g>
    )
  }

  const renderSpanLoad = (span, index) => {
    const x1 = jointXs[index]
    const x2 = jointXs[index + 1]
    const spanWidth = x2 - x1
    const midX = (x1 + x2) / 2
    const L = num(span.length, 1)

    if (span.loadType === 'udl') {
      const arrowCount = Math.max(4, Math.min(10, Math.floor(spanWidth / 45)))

      return (
        <g key={`load-${index}`}>
          <line
            x1={x1 + 12}
            y1={loadTopY}
            x2={x2 - 12}
            y2={loadTopY}
            stroke="#fb923c"
            strokeWidth="3"
          />

          {Array.from({ length: arrowCount }).map((_, i) => {
            const x =
              x1 + 18 + (i * (spanWidth - 36)) / Math.max(arrowCount - 1, 1)

            return (
              <line
                key={i}
                x1={x}
                y1={loadTopY}
                x2={x}
                y2={beamY - 10}
                stroke="#fb923c"
                strokeWidth="2.5"
                markerEnd="url(#arrowHead)"
              />
            )
          })}

          <text
            x={midX}
            y={loadTopY - 10}
            textAnchor="middle"
            fontSize="13"
            fontWeight="700"
            fill="#fed7aa"
          >
            UDL w = {fmt(span.w)} kN/m
          </text>
        </g>
      )
    }

    if (span.loadType === 'point') {
      let a = num(span.a, L / 2)
      if (a <= 0 || a >= L) a = L / 2

      const px = x1 + (a / L) * spanWidth

      return (
        <g key={`load-${index}`}>
          <line
            x1={px}
            y1={loadTopY}
            x2={px}
            y2={beamY - 10}
            stroke="#fb923c"
            strokeWidth="4"
            markerEnd="url(#arrowHead)"
          />

          <text
            x={px}
            y={loadTopY - 10}
            textAnchor="middle"
            fontSize="13"
            fontWeight="700"
            fill="#fed7aa"
          >
            P = {fmt(span.P)} kN
          </text>

          <text
            x={px}
            y={beamY - 22}
            textAnchor="middle"
            fontSize="11"
            fill="#cbd5e1"
          >
            a = {fmt(a)} m
          </text>
        </g>
      )
    }

    return (
      <text
        key={`load-${index}`}
        x={midX}
        y={beamY - 30}
        textAnchor="middle"
        fontSize="12"
        fill="#64748b"
      >
        No Load
      </text>
    )
  }

  return (
    <div className="rounded-2xl border border-orange-500/20 bg-slate-900/70 p-5">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
        <div>
          <h2 className="text-xl font-bold">Input Beam Diagram</h2>
          <p className="text-sm text-slate-400">
            Span, support, load, length aur EI ka live visual layout.
          </p>
        </div>

        <div className="rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-sm text-orange-300">
          Auto updates with input
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-[#020617] p-3">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="min-w-[850px] w-full h-auto"
        >
          <defs>
            <marker
              id="arrowHead"
              markerWidth="8"
              markerHeight="8"
              refX="4"
              refY="4"
              orient="auto"
            >
              <path d="M 0 0 L 8 4 L 0 8 Z" fill="#fb923c" />
            </marker>
          </defs>

          <line
            x1={padding}
            y1={beamY}
            x2={width - padding}
            y2={beamY}
            stroke="#e2e8f0"
            strokeWidth="8"
            strokeLinecap="round"
          />

          {spans.map((span, index) => renderSpanLoad(span, index))}

          {jointXs.map((x, index) => (
            <g key={`joint-${index}`}>
              <circle
                cx={x}
                cy={beamY}
                r="8"
                fill="#f97316"
                stroke="#fed7aa"
                strokeWidth="2"
              />

              <text
                x={x}
                y={beamY - 18}
                textAnchor="middle"
                fontSize="14"
                fontWeight="800"
                fill="#ffffff"
              >
                {jointName(index)}
              </text>
            </g>
          ))}

          {joints.map((type, index) => renderSupport(type, jointXs[index], index))}

          {spans.map((span, index) => {
            const x1 = jointXs[index]
            const x2 = jointXs[index + 1]
            const midX = (x1 + x2) / 2
if (type === 'pin') {
  return (
    <g key={`support-${index}`}>
      <path
        d={`M ${x} ${beamY + 8} L ${x - 24} ${supportY} L ${x + 24} ${supportY} Z`}
        fill="#0f172a"
        stroke="#f97316"
        strokeWidth="2"
      />

      <line
        x1={x - 32}
        y1={supportY + 8}
        x2={x + 32}
        y2={supportY + 8}
        stroke="#64748b"
        strokeWidth="2"
      />

      <text
        x={x}
        y={supportY + 34}
        textAnchor="middle"
        fontSize="12"
        fill="#cbd5e1"
      >
        Pin
      </text>
    </g>
  )
}

if (type === 'roller') {
  return (
    <g key={`support-${index}`}>
      <path
        d={`M ${x} ${beamY + 8} L ${x - 24} ${supportY} L ${x + 24} ${supportY} Z`}
        fill="#0f172a"
        stroke="#f97316"
        strokeWidth="2"
      />

      <circle cx={x - 12} cy={supportY + 8} r="4" fill="#94a3b8" />
      <circle cx={x + 12} cy={supportY + 8} r="4" fill="#94a3b8" />

      <line
        x1={x - 32}
        y1={supportY + 14}
        x2={x + 32}
        y2={supportY + 14}
        stroke="#64748b"
        strokeWidth="2"
      />

      <text
        x={x}
        y={supportY + 34}
        textAnchor="middle"
        fontSize="12"
        fill="#cbd5e1"
      >
        Roller
      </text>
    </g>
  )
}
            return (
              <g key={`span-label-${index}`}>
                <line
                  x1={x1}
                  y1={dimY}
                  x2={x2}
                  y2={dimY}
                  stroke="#64748b"
                  strokeWidth="2"
                />

                <line
                  x1={x1}
                  y1={dimY - 8}
                  x2={x1}
                  y2={dimY + 8}
                  stroke="#64748b"
                  strokeWidth="2"
                />

                <line
                  x1={x2}
                  y1={dimY - 8}
                  x2={x2}
                  y2={dimY + 8}
                  stroke="#64748b"
                  strokeWidth="2"
                />

                <text
                  x={midX}
                  y={dimY + 22}
                  textAnchor="middle"
                  fontSize="13"
                  fill="#cbd5e1"
                >
                  Span {jointName(index)}
                  {jointName(index + 1)} = {fmt(span.length)} m
                </text>

                <text
                  x={midX}
                  y={dimY + 42}
                  textAnchor="middle"
                  fontSize="12"
                  fill="#94a3b8"
                >
                  Relative EI = {fmt(span.EI)}
                </text>
              </g>
            )
          })}
        </svg>
      </div>
    </div>
  )
}
function supportLabel(type) {
  if (type === 'pin') return 'Pin Support'
  if (type === 'roller') return 'Roller Support'
  if (type === 'fixed') return 'Fixed Support'
  return 'Continuous Joint'
}
