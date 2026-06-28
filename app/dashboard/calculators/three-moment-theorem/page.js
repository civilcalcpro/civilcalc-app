'use client'

import { useMemo, useRef, useState } from 'react'
import {
  Activity,
  BookOpen,
  Calculator,
  Download,
  FileText,
  Plus,
  RotateCcw,
  Sigma,
  Trash2,
} from 'lucide-react'

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

const createDefaultLoad = (length = 5) => ({
  type: 'udl',
  w: 20,
  P: 50,
  a: length / 2,
  start: 0,
  end: length,
  w1: 0,
  w2: 20,
  M: 20,
  sense: 'clockwise',
})

const createInitialSpan = (length = 5) => ({
  length,
  EI: 1,
  loads: [createDefaultLoad(length)],
})

function normalizeLoads(span) {
  if (Array.isArray(span.loads)) return span.loads

  if (span.loadType === 'udl') {
    return [
      {
        type: 'udl',
        w: span.w ?? 20,
        P: 50,
        a: num(span.length, 5) / 2,
        start: 0,
        end: num(span.length, 5),
        w1: 0,
        w2: 20,
        M: 20,
        sense: 'clockwise',
      },
    ]
  }

  if (span.loadType === 'point') {
    return [
      {
        type: 'point',
        w: 20,
        P: span.P ?? 50,
        a: span.a ?? num(span.length, 5) / 2,
        start: 0,
        end: num(span.length, 5),
        w1: 0,
        w2: 20,
        M: 20,
        sense: 'clockwise',
      },
    ]
  }

  return []
}

function clampWithinSpan(value, L, fallback = 0) {
  const n = num(value, fallback)
  return Math.min(Math.max(n, 0), L)
}

function getLoadInterval(load, L) {
  let start = clampWithinSpan(load.start, L, 0)
  let end = clampWithinSpan(load.end, L, L)

  if (end < start) {
    const temp = start
    start = end
    end = temp
  }

  if (Math.abs(end - start) < 0.0001) end = Math.min(start + 0.0001, L)

  return { start, end, length: end - start }
}

function loadLabel(load, L, index = 0) {
  if (load.type === 'udl') {
    return `Load ${index + 1}: Full UDL w = ${fmt(load.w)} kN/m`
  }

  if (load.type === 'point') {
    return `Load ${index + 1}: Point load P = ${fmt(load.P)} kN at a = ${fmt(clampWithinSpan(load.a, L, L / 2))} m`
  }

  if (load.type === 'partialUdl') {
    const { start, end } = getLoadInterval(load, L)
    return `Load ${index + 1}: Partial UDL w = ${fmt(load.w)} kN/m from ${fmt(start)} m to ${fmt(end)} m`
  }

  if (load.type === 'uvl') {
    const { start, end } = getLoadInterval(load, L)
    return `Load ${index + 1}: UVL/Trapezoidal load from w1 = ${fmt(load.w1)} to w2 = ${fmt(load.w2)} kN/m between ${fmt(start)} m and ${fmt(end)} m`
  }

  if (load.type === 'moment') {
    return `Load ${index + 1}: Applied moment = ${fmt(load.M)} kNm at a = ${fmt(clampWithinSpan(load.a, L, L / 2))} m (${load.sense === 'anticlockwise' ? 'anticlockwise' : 'clockwise'})`
  }

  return `Load ${index + 1}: No load`
}

function getLoadStats(span) {
  const L = num(span.length, 1)
  const loads = normalizeLoads(span)

  return loads.reduce(
    (sum, load) => {
      if (load.type === 'udl') {
        const w = num(load.w)
        const W = w * L
        return {
          totalLoad: sum.totalLoad + W,
          momentAboutLeft: sum.momentAboutLeft + W * (L / 2),
          coupleMoment: sum.coupleMoment,
        }
      }

      if (load.type === 'point') {
        const P = num(load.P)
        const a = clampWithinSpan(load.a, L, L / 2)
        return {
          totalLoad: sum.totalLoad + P,
          momentAboutLeft: sum.momentAboutLeft + P * a,
          coupleMoment: sum.coupleMoment,
        }
      }

      if (load.type === 'partialUdl') {
        const w = num(load.w)
        const { start, end, length } = getLoadInterval(load, L)
        const W = w * length
        const xbar = (start + end) / 2
        return {
          totalLoad: sum.totalLoad + W,
          momentAboutLeft: sum.momentAboutLeft + W * xbar,
          coupleMoment: sum.coupleMoment,
        }
      }

      if (load.type === 'uvl') {
        const { start, length } = getLoadInterval(load, L)
        const w1 = num(load.w1)
        const w2 = num(load.w2)
        const W = ((w1 + w2) / 2) * length
        const momentLocal = length * length * (w1 / 2 + (w2 - w1) / 3)
        return {
          totalLoad: sum.totalLoad + W,
          momentAboutLeft: sum.momentAboutLeft + start * W + momentLocal,
          coupleMoment: sum.coupleMoment,
        }
      }

      if (load.type === 'moment') {
        const sign = load.sense === 'anticlockwise' ? -1 : 1
        const M = sign * num(load.M)
        return {
          totalLoad: sum.totalLoad,
          momentAboutLeft: sum.momentAboutLeft,
          coupleMoment: sum.coupleMoment + M,
        }
      }

      return sum
    },
    { totalLoad: 0, momentAboutLeft: 0, coupleMoment: 0 }
  )
}

function simpleReactions(span) {
  const L = num(span.length, 1)
  const { totalLoad, momentAboutLeft, coupleMoment } = getLoadStats(span)
  const RB = (momentAboutLeft + coupleMoment) / L
  const RA = totalLoad - RB
  return { RA, RB, totalLoad, momentAboutLeft, coupleMoment }
}

function loadMomentContribution(load, x, L) {
  if (load.type === 'udl') {
    const w = num(load.w)
    return (w * x * x) / 2
  }

  if (load.type === 'point') {
    const P = num(load.P)
    const a = clampWithinSpan(load.a, L, L / 2)
    return x >= a ? P * (x - a) : 0
  }

  if (load.type === 'partialUdl') {
    const w = num(load.w)
    const { start, end, length } = getLoadInterval(load, L)

    if (x <= start) return 0

    if (x < end) {
      const t = x - start
      return (w * t * t) / 2
    }

    return w * length * (x - (start + end) / 2)
  }

  if (load.type === 'uvl') {
    const { start, end, length } = getLoadInterval(load, L)
    const w1 = num(load.w1)
    const w2 = num(load.w2)
    const k = (w2 - w1) / length

    if (x <= start) return 0

    if (x < end) {
      const t = x - start
      return (w1 * t * t) / 2 + (k * t * t * t) / 6
    }

    const W = ((w1 + w2) / 2) * length
    const momentLocal = length * length * (w1 / 2 + (w2 - w1) / 3)
    const xbar = W === 0 ? start + length / 2 : start + momentLocal / W
    return W * (x - xbar)
  }

  if (load.type === 'moment') {
    const a = clampWithinSpan(load.a, L, L / 2)
    const sign = load.sense === 'anticlockwise' ? -1 : 1
    return x >= a ? sign * num(load.M) : 0
  }

  return 0
}

function simpleMomentAt(span, x) {
  const L = num(span.length, 1)
  const loads = normalizeLoads(span)
  const { RA } = simpleReactions(span)

  const loadMoment = loads.reduce((sum, load) => {
    return sum + loadMomentContribution(load, x, L)
  }, 0)

  return RA * x - loadMoment
}

function actualMomentAt(span, supportMomentLeft, supportMomentRight, x) {
  const L = num(span.length, 1)
  return supportMomentLeft * (1 - x / L) + supportMomentRight * (x / L) + simpleMomentAt(span, x)
}

function loadShearLeft(span, x) {
  const L = num(span.length, 1)
  const loads = normalizeLoads(span)

  return loads.reduce((sum, load) => {
    if (load.type === 'udl') {
      return sum + num(load.w) * x
    }

    if (load.type === 'point') {
      const a = clampWithinSpan(load.a, L, L / 2)
      return x >= a ? sum + num(load.P) : sum
    }

    if (load.type === 'partialUdl') {
      const { start, end } = getLoadInterval(load, L)
      const w = num(load.w)
      if (x <= start) return sum
      if (x < end) return sum + w * (x - start)
      return sum + w * (end - start)
    }

    if (load.type === 'uvl') {
      const { start, end, length } = getLoadInterval(load, L)
      const w1 = num(load.w1)
      const w2 = num(load.w2)
      const k = (w2 - w1) / length

      if (x <= start) return sum
      if (x < end) {
        const t = x - start
        return sum + w1 * t + (k * t * t) / 2
      }
      return sum + ((w1 + w2) / 2) * length
    }

    return sum
  }, 0)
}

function actualShearAt(span, RA, x) {
  return RA - loadShearLeft(span, x)
}

function integrateFreeBMD(span) {
  const L = num(span.length, 1)
  const steps = 360
  let area = 0
  let firstMoment = 0

  for (let i = 0; i < steps; i++) {
    const x1 = (L * i) / steps
    const x2 = (L * (i + 1)) / steps
    const xm = (x1 + x2) / 2
    const dx = x2 - x1
    const m = simpleMomentAt(span, xm)
    area += m * dx
    firstMoment += m * xm * dx
  }

  const centroid = Math.abs(area) > 1e-9 ? firstMoment / area : L / 2

  return {
    area,
    centroid,
    centroidFromRight: L - centroid,
  }
}

function solveLinearSystem(A, b) {
  const n = A.length
  const M = A.map((row, i) => [...row.map(Number), Number(b[i])])

  for (let col = 0; col < n; col++) {
    let pivot = col
    for (let r = col + 1; r < n; r++) {
      if (Math.abs(M[r][col]) > Math.abs(M[pivot][col])) pivot = r
    }

    if (Math.abs(M[pivot][col]) < 1e-12) {
      return Array(n).fill(0)
    }

    if (pivot !== col) {
      const temp = M[pivot]
      M[pivot] = M[col]
      M[col] = temp
    }

    const divisor = M[col][col]
    for (let c = col; c <= n; c++) M[col][c] /= divisor

    for (let r = 0; r < n; r++) {
      if (r === col) continue
      const factor = M[r][col]
      for (let c = col; c <= n; c++) M[r][c] -= factor * M[col][c]
    }
  }

  return M.map((row) => row[n])
}

function createStations(span, supportMomentLeft, supportMomentRight, RA) {
  const L = num(span.length, 1)
  const stations = []

  for (let i = 0; i <= 120; i++) stations.push((L * i) / 120)

  normalizeLoads(span).forEach((load) => {
    if (load.type === 'point' || load.type === 'moment') {
      const a = clampWithinSpan(load.a, L, L / 2)
      if (a > 0 && a < L) stations.push(a)
    }

    if (load.type === 'partialUdl' || load.type === 'uvl') {
      const { start, end } = getLoadInterval(load, L)
      if (start > 0 && start < L) stations.push(start)
      if (end > 0 && end < L) stations.push(end)
    }
  })

  for (let i = 0; i <= 120; i++) {
    const x = (L * i) / 120
    const v1 = actualShearAt(span, RA, x)
    const v2 = actualShearAt(span, RA, Math.min(L, x + L / 120))
    if (v1 === 0 || v1 * v2 < 0) stations.push(x)
  }

  const unique = [...new Set(stations.map((x) => Number(x.toFixed(5))))].sort((a, b) => a - b)

  return unique.map((x) => ({
    x,
    shear: actualShearAt(span, RA, x),
    moment: actualMomentAt(span, supportMomentLeft, supportMomentRight, x),
  }))
}

function runThreeMoment(spans) {
  const totalSpans = spans.length
  const totalJoints = totalSpans + 1
  const freeBmd = spans.map((span) => integrateFreeBMD(span))
  const knownMoments = Array(totalJoints).fill(null)
  knownMoments[0] = 0
  knownMoments[totalJoints - 1] = 0

  const unknownJoints = Array.from({ length: Math.max(totalJoints - 2, 0) }, (_, i) => i + 1)
  const equations = []
  const A = []
  const b = []

  for (let eqIndex = 0; eqIndex < totalSpans - 1; eqIndex++) {
    const leftJoint = eqIndex
    const midJoint = eqIndex + 1
    const rightJoint = eqIndex + 2

    const spanLeft = spans[eqIndex]
    const spanRight = spans[eqIndex + 1]

    const L1 = num(spanLeft.length, 1)
    const L2 = num(spanRight.length, 1)
    const EI1 = num(spanLeft.EI, 1)
    const EI2 = num(spanRight.EI, 1)

    const fb1 = freeBmd[eqIndex]
    const fb2 = freeBmd[eqIndex + 1]

    const cLeft = L1 / EI1
    const cMid = 2 * (L1 / EI1 + L2 / EI2)
    const cRight = L2 / EI2

    const rhs = -6 * ((fb1.area * fb1.centroid) / (L1 * EI1) + (fb2.area * fb2.centroidFromRight) / (L2 * EI2))

    const row = Array(unknownJoints.length).fill(0)
    let adjustedRhs = rhs

    ;[
      { joint: leftJoint, coefficient: cLeft },
      { joint: midJoint, coefficient: cMid },
      { joint: rightJoint, coefficient: cRight },
    ].forEach((item) => {
      const unknownIndex = unknownJoints.indexOf(item.joint)
      if (unknownIndex >= 0) {
        row[unknownIndex] += item.coefficient
      } else {
        adjustedRhs -= item.coefficient * (knownMoments[item.joint] || 0)
      }
    })

    equations.push({
      equationNo: eqIndex + 1,
      joints: `${jointName(leftJoint)}-${jointName(midJoint)}-${jointName(rightJoint)}`,
      leftJoint: jointName(leftJoint),
      midJoint: jointName(midJoint),
      rightJoint: jointName(rightJoint),
      L1,
      L2,
      EI1,
      EI2,
      A1: fb1.area,
      xbar1: fb1.centroid,
      A2: fb2.area,
      xbar2Right: fb2.centroidFromRight,
      cLeft,
      cMid,
      cRight,
      rhs,
      adjustedRhs,
      coefficients: row,
    })

    A.push(row)
    b.push(adjustedRhs)
  }

  const unknownValues = unknownJoints.length ? solveLinearSystem(A, b) : []
  const supportMoments = Array(totalJoints).fill(0)
  unknownJoints.forEach((joint, index) => {
    supportMoments[joint] = unknownValues[index] || 0
  })

  const spanAnalysis = spans.map((span, i) => {
    const L = num(span.length, 1)
    const leftMoment = supportMoments[i]
    const rightMoment = supportMoments[i + 1]
    const { totalLoad, momentAboutLeft, coupleMoment } = getLoadStats(span)

    const RB = (momentAboutLeft + coupleMoment + leftMoment - rightMoment) / L
    const RA = totalLoad - RB
    const stations = createStations(span, leftMoment, rightMoment, RA)

    const maxShear = stations.reduce((max, item) => {
      return Math.abs(item.shear) > Math.abs(max.shear) ? item : max
    }, stations[0])

    const maxMoment = stations.reduce((max, item) => {
      return Math.abs(item.moment) > Math.abs(max.moment) ? item : max
    }, stations[0])

    return {
      span: `${jointName(i)}${jointName(i + 1)}`,
      leftJoint: jointName(i),
      rightJoint: jointName(i + 1),
      leftMoment,
      rightMoment,
      RA,
      RB,
      totalLoad,
      stations,
      maxShear,
      maxMoment,
      freeArea: freeBmd[i].area,
      freeCentroid: freeBmd[i].centroid,
    }
  })

  const supportReactions = Array.from({ length: totalJoints }, (_, j) => {
    let verticalReaction = 0
    if (j > 0) verticalReaction += spanAnalysis[j - 1].RB
    if (j < totalSpans) verticalReaction += spanAnalysis[j].RA

    return {
      joint: jointName(j),
      verticalReaction,
      supportMoment: supportMoments[j],
    }
  })

  const stepSolution = []

  stepSolution.push({
    title: 'Step 1: Given data',
    lines: spans.map((span, index) => {
      const L = num(span.length, 1)
      const loads = normalizeLoads(span)
      const loadText = loads.length ? loads.map((load, loadIndex) => loadLabel(load, L, loadIndex)).join('; ') : 'No external load'
      return `Span ${jointName(index)}${jointName(index + 1)}: L = ${fmt(span.length)} m, EI = ${fmt(span.EI)}, ${loadText}`
    }),
  })

  stepSolution.push({
    title: 'Step 2: Area and centroid of free bending moment diagram',
    lines: spans.map((span, index) => {
      const data = freeBmd[index]
      return `Span ${jointName(index)}${jointName(index + 1)}: A = ${fmt(data.area)} kNm², x̄ from left = ${fmt(data.centroid)} m, x̄ from right = ${fmt(data.centroidFromRight)} m`
    }),
  })

  stepSolution.push({
    title: 'Step 3: Three Moment equations',
    lines: equations.map((eq) => {
      return `${eq.joints}: (${fmt(eq.cLeft)})M${eq.leftJoint} + (${fmt(eq.cMid)})M${eq.midJoint} + (${fmt(eq.cRight)})M${eq.rightJoint} = ${fmt(eq.rhs)}`
    }),
  })

  stepSolution.push({
    title: 'Step 4: Solved support moments',
    lines: supportMoments.map((moment, index) => {
      return `M${jointName(index)} = ${fmt(moment)} kNm`
    }),
  })

  stepSolution.push({
    title: 'Step 5: Support reactions',
    lines: supportReactions.map((row) => {
      return `Joint ${row.joint}: Vertical reaction = ${fmt(row.verticalReaction)} kN, support moment = ${fmt(row.supportMoment)} kNm`
    }),
  })

  stepSolution.push({
    title: 'Step 6: Maximum shear force and bending moment',
    lines: spanAnalysis.map((span) => {
      return `${span.span}: Max shear = ${fmt(span.maxShear.shear)} kN at x = ${fmt(span.maxShear.x)} m, Max BM = ${fmt(span.maxMoment.moment)} kNm at x = ${fmt(span.maxMoment.x)} m`
    }),
  })

  return {
    freeBmd,
    equations,
    supportMoments,
    supportReactions,
    spanAnalysis,
    stepSolution,
  }
}

export default function ThreeMomentTheoremPage() {
  const inputDiagramRef = useRef(null)
  const outputDiagramRef = useRef(null)

  const [spans, setSpans] = useState([
    createInitialSpan(6),
    {
      length: 5,
      EI: 1,
      loads: [
        {
          ...createDefaultLoad(5),
          type: 'point',
          P: 60,
          a: 2.5,
        },
      ],
    },
  ])

  const result = useMemo(() => runThreeMoment(spans), [spans])

  const updateSpan = (spanIndex, key, value) => {
    setSpans((prev) =>
      prev.map((span, i) =>
        i === spanIndex
          ? {
              ...span,
              [key]: value,
            }
          : span
      )
    )
  }

  const updateLoad = (spanIndex, loadIndex, key, value) => {
    setSpans((prev) =>
      prev.map((span, i) => {
        if (i !== spanIndex) return span

        const loads = normalizeLoads(span).map((load, j) =>
          j === loadIndex
            ? {
                ...load,
                [key]: value,
              }
            : load
        )

        return {
          ...span,
          loads,
        }
      })
    )
  }

  const addLoadToSpan = (spanIndex) => {
    setSpans((prev) =>
      prev.map((span, i) => {
        if (i !== spanIndex) return span
        return {
          ...span,
          loads: [...normalizeLoads(span), createDefaultLoad(num(span.length, 5))],
        }
      })
    )
  }

  const removeLoadFromSpan = (spanIndex, loadIndex) => {
    setSpans((prev) =>
      prev.map((span, i) => {
        if (i !== spanIndex) return span
        return {
          ...span,
          loads: normalizeLoads(span).filter((_, j) => j !== loadIndex),
        }
      })
    )
  }

  const addSpan = () => {
    setSpans((prev) => [...prev, createInitialSpan(5)])
  }

  const removeSpan = (spanIndex) => {
    if (spans.length <= 2) return
    setSpans((prev) => prev.filter((_, i) => i !== spanIndex))
  }

  const resetExample = () => {
    setSpans([
      createInitialSpan(6),
      {
        length: 5,
        EI: 1,
        loads: [
          {
            ...createDefaultLoad(5),
            type: 'point',
            P: 60,
            a: 2.5,
          },
        ],
      },
    ])
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
        if (y > 220) {
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
        const imgHeight = Math.min((canvas.height * imgWidth) / canvas.width, 165)

        if (y + imgHeight > pageHeight - 18) {
          doc.addPage()
          y = 15
          addSectionTitle(title)
        }

        doc.addImage(imgData, 'PNG', 14, y, imgWidth, imgHeight)
        y += imgHeight + 8
      }

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(18)
      doc.text('Three Moment Theorem Report', pageWidth / 2, y, { align: 'center' })
      y += 7
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(10)
      doc.text('Generated by CivilCalc Pro', pageWidth / 2, y, { align: 'center' })
      y += 8

      await addCapturedElement(inputDiagramRef.current, '1. Input beam diagram')

      addSectionTitle('2. Step-by-step solution')
      result.stepSolution.forEach((step) => {
        if (y > 250) {
          doc.addPage()
          y = 15
        }
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(10.5)
        doc.text(step.title, 14, y)
        y += 5
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(8.2)

        step.lines.forEach((line, index) => {
          const text = `${index + 1}. ${line}`
          const splitText = doc.splitTextToSize(text, pageWidth - 28)
          if (y + splitText.length * 4 > 282) {
            doc.addPage()
            y = 15
          }
          doc.text(splitText, 14, y)
          y += splitText.length * 4 + 1
        })
        y += 3
      })

      if (y > 220) {
        doc.addPage()
        y = 15
      }

      addSectionTitle('3. Final answer')
      autoTable(doc, {
        startY: y,
        head: [['Joint', 'Support moment', 'Vertical reaction']],
        body: result.supportReactions.map((row) => [
          row.joint,
          `${fmt(row.supportMoment)} kNm`,
          `${fmt(row.verticalReaction)} kN`,
        ]),
        styles: { fontSize: 8 },
        headStyles: { fillColor: [255, 122, 0], textColor: [0, 0, 0] },
      })
      y = doc.lastAutoTable.finalY + 7

      autoTable(doc, {
        startY: y,
        head: [['Span', 'Left moment', 'Right moment', 'RA', 'RB', 'Max SF', 'Max BM']],
        body: result.spanAnalysis.map((span) => [
          span.span,
          `${fmt(span.leftMoment)} kNm`,
          `${fmt(span.rightMoment)} kNm`,
          `${fmt(span.RA)} kN`,
          `${fmt(span.RB)} kN`,
          `${fmt(span.maxShear.shear)} kN`,
          `${fmt(span.maxMoment.moment)} kNm`,
        ]),
        styles: { fontSize: 7.5 },
        headStyles: { fillColor: [255, 122, 0], textColor: [0, 0, 0] },
      })
      y = doc.lastAutoTable.finalY + 8

      await addCapturedElement(outputDiagramRef.current, '4. SFD / BMD diagrams')

      const pageCount = doc.internal.getNumberOfPages()
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(8)
        doc.text(
          `CivilCalc Pro | Three Moment Theorem | Page ${i} of ${pageCount}`,
          pageWidth / 2,
          290,
          { align: 'center' }
        )
      }

      doc.save('three-moment-theorem-solution.pdf')
    } catch (error) {
      console.error(error)
      alert('PDF generate nahi ho paya. Please html2canvas, jspdf and jspdf-autotable install check karo.')
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
                Three Moment Theorem
              </h1>

              <p className="text-slate-400 mt-3 max-w-3xl">
                Continuous beam ko Clapeyron Three Moment Theorem se solve karo — multiple spans, multiple loads, support moments, reactions, SFD/BMD aur PDF report ke saath.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
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
        </div>

        <div ref={inputDiagramRef}>
          <BeamInputDiagram spans={spans} />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
                <div>
                  <h2 className="text-xl font-bold">Span and Load Input</h2>
                  <p className="text-slate-400 text-sm">
                    Har span ke length, EI aur multiple load combination enter karo.
                  </p>
                </div>

                <button
                  onClick={addSpan}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-2 font-semibold text-black hover:bg-orange-400"
                >
                  <Plus size={18} />
                  Add Span
                </button>
              </div>

              <div className="space-y-4">
                {spans.map((span, spanIndex) => (
                  <div key={spanIndex} className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                      <h3 className="font-bold text-orange-300">
                        Span {jointName(spanIndex)}{jointName(spanIndex + 1)}
                      </h3>

                      <button
                        onClick={() => removeSpan(spanIndex)}
                        disabled={spans.length <= 2}
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-500/30 px-3 py-2 text-red-300 disabled:opacity-40"
                      >
                        <Trash2 size={16} />
                        Delete Span
                      </button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <Field
                        label="Length L (m)"
                        value={span.length}
                        onChange={(value) => updateSpan(spanIndex, 'length', value)}
                      />

                      <Field
                        label="Relative EI"
                        value={span.EI}
                        onChange={(value) => updateSpan(spanIndex, 'EI', value)}
                      />
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                        <div>
                          <h4 className="font-bold">Loads on this span</h4>
                          <p className="text-xs text-slate-400">
                            Full UDL, point load, partial UDL, UVL/trapezoidal aur applied moment add kar sakte ho.
                          </p>
                        </div>

                        <button
                          onClick={() => addLoadToSpan(spanIndex)}
                          className="rounded-xl bg-orange-500 px-3 py-2 text-sm font-bold text-black hover:bg-orange-400"
                        >
                          + Add Load
                        </button>
                      </div>

                      <div className="space-y-3">
                        {normalizeLoads(span).length === 0 ? (
                          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-sm text-slate-400">
                            No load added. Add Load button se load add karo.
                          </div>
                        ) : (
                          normalizeLoads(span).map((load, loadIndex) => (
                            <LoadInputCard
                              key={loadIndex}
                              load={load}
                              spanLength={num(span.length, 1)}
                              loadIndex={loadIndex}
                              onChange={(key, value) => updateLoad(spanIndex, loadIndex, key, value)}
                              onDelete={() => removeLoadFromSpan(spanIndex, loadIndex)}
                            />
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-orange-500/20 bg-orange-500/10 p-5 sticky top-4">
              <h2 className="text-xl font-bold text-orange-300 flex items-center gap-2">
                <Sigma size={20} /> Solver Summary
              </h2>

              <div className="mt-5 space-y-3 text-sm">
                <SummaryRow label="Total spans" value={spans.length} />
                <SummaryRow label="Total joints" value={spans.length + 1} />
                <SummaryRow label="Unknown moments" value={Math.max(spans.length - 1, 0)} />
                <SummaryRow label="Method" value="Clapeyron" />
              </div>

              <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950 p-4 text-sm text-slate-300">
                End supports A and last joint are treated as simple supports with zero end moment. Internal supports are continuous.
              </div>
            </div>
          </div>
        </div>

        <ResultSection title="Step-by-step Solution" icon={<BookOpen size={20} />}>
          <div className="space-y-5">
            {result.stepSolution.map((step, index) => (
              <div key={index} className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
                <h3 className="text-lg font-bold text-orange-300 mb-3">{step.title}</h3>
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

        <ResultSection title="Three Moment Equations" icon={<FileText size={20} />}>
          <Table
            headers={['Equation', 'Joints', 'A1', 'x̄1', 'A2', 'x̄2 from right', 'RHS']}
            rows={result.equations.map((eq) => [
              eq.equationNo,
              eq.joints,
              fmt(eq.A1),
              fmt(eq.xbar1),
              fmt(eq.A2),
              fmt(eq.xbar2Right),
              fmt(eq.rhs),
            ])}
          />
        </ResultSection>

        <ResultSection title="Final Support Moments and Reactions" icon={<Calculator size={20} />}>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {result.supportReactions.map((row) => (
              <InfoCard
                key={row.joint}
                title={`Joint ${row.joint}`}
                rows={[
                  ['Support moment', `${fmt(row.supportMoment)} kNm`],
                  ['Vertical reaction', `${fmt(row.verticalReaction)} kN`],
                ]}
              />
            ))}
          </div>
        </ResultSection>

        <div ref={outputDiagramRef}>
          <ResultSection title="SFD / BMD Diagrams" icon={<Activity size={20} />}>
            <div className="grid lg:grid-cols-2 gap-5">
              {result.spanAnalysis.map((span) => (
                <div key={span.span} className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-5">
                  <h3 className="text-lg font-bold text-orange-300">Span {span.span}</h3>

                  <div className="grid md:grid-cols-2 gap-3">
                    <MiniStat label={`Reaction at ${span.leftJoint}`} value={`${fmt(span.RA)} kN`} />
                    <MiniStat label={`Reaction at ${span.rightJoint}`} value={`${fmt(span.RB)} kN`} />
                    <MiniStat label="Max shear" value={`${fmt(span.maxShear.shear)} kN at ${fmt(span.maxShear.x)} m`} />
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
        </div>
      </div>
    </div>
  )
}

function LoadInputCard({ load, spanLength, loadIndex, onChange, onDelete }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
      <div className="grid md:grid-cols-4 gap-4">
        <div>
          <label className="text-sm text-slate-400">Load Type</label>
          <select
            value={load.type}
            onChange={(e) => onChange('type', e.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 p-3 text-white outline-none focus:border-orange-500"
          >
            <option value="udl">Full UDL</option>
            <option value="point">Point Load</option>
            <option value="partialUdl">Partial UDL</option>
            <option value="uvl">UVL / Trapezoidal</option>
            <option value="moment">Applied Moment</option>
          </select>
        </div>

        {load.type === 'udl' && (
          <Field label="UDL w (kN/m)" value={load.w} onChange={(value) => onChange('w', value)} />
        )}

        {load.type === 'point' && (
          <>
            <Field label="Point load P (kN)" value={load.P} onChange={(value) => onChange('P', value)} />
            <Field label={`Distance a (0-${fmt(spanLength)} m)`} value={load.a} onChange={(value) => onChange('a', value)} />
          </>
        )}

        {load.type === 'partialUdl' && (
          <>
            <Field label="UDL w (kN/m)" value={load.w} onChange={(value) => onChange('w', value)} />
            <Field label="Start x (m)" value={load.start} onChange={(value) => onChange('start', value)} />
            <Field label="End x (m)" value={load.end} onChange={(value) => onChange('end', value)} />
          </>
        )}

        {load.type === 'uvl' && (
          <>
            <Field label="w1 (kN/m)" value={load.w1} onChange={(value) => onChange('w1', value)} />
            <Field label="w2 (kN/m)" value={load.w2} onChange={(value) => onChange('w2', value)} />
            <Field label="Start x (m)" value={load.start} onChange={(value) => onChange('start', value)} />
            <Field label="End x (m)" value={load.end} onChange={(value) => onChange('end', value)} />
          </>
        )}

        {load.type === 'moment' && (
          <>
            <Field label="Moment M (kNm)" value={load.M} onChange={(value) => onChange('M', value)} />
            <Field label={`Distance a (0-${fmt(spanLength)} m)`} value={load.a} onChange={(value) => onChange('a', value)} />
            <div>
              <label className="text-sm text-slate-400">Sense</label>
              <select
                value={load.sense || 'clockwise'}
                onChange={(e) => onChange('sense', e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 p-3 text-white outline-none focus:border-orange-500"
              >
                <option value="clockwise">Clockwise</option>
                <option value="anticlockwise">Anticlockwise</option>
              </select>
            </div>
          </>
        )}

        <div className="flex items-end">
          <button
            onClick={onDelete}
            className="w-full rounded-xl border border-red-500/30 px-3 py-3 text-sm font-semibold text-red-300 hover:bg-red-500/10"
          >
            Delete Load {loadIndex + 1}
          </button>
        </div>
      </div>
    </div>
  )
}

function BeamInputDiagram({ spans }) {
  const width = 900
  const height = 350
  const padding = 70
  const beamY = 150
  const supportY = 188
  const loadTopY = 52
  const dimY = 250

  const lengths = spans.map((span) => Math.max(num(span.length, 1), 0.1))
  const totalLength = lengths.reduce((sum, length) => sum + length, 0) || 1
  const beamWidth = width - padding * 2
  const jointXs = [padding]

  lengths.reduce((sum, length) => {
    const next = sum + length
    jointXs.push(padding + (next / totalLength) * beamWidth)
    return next
  }, 0)

  const renderSupport = (x, index) => {
    const isEnd = index === 0 || index === jointXs.length - 1
    const label = isEnd ? (index === 0 ? 'Pin' : 'Roller') : 'Continuous'

    return (
      <g key={`support-${index}`}>
        <path
          d={`M ${x} ${beamY + 8} L ${x - 24} ${supportY} L ${x + 24} ${supportY} Z`}
          fill="#0f172a"
          stroke="#f97316"
          strokeWidth="2"
        />
        {!isEnd || label === 'Roller' ? (
          <>
            <circle cx={x - 12} cy={supportY + 8} r="4" fill="#94a3b8" />
            <circle cx={x + 12} cy={supportY + 8} r="4" fill="#94a3b8" />
            <line x1={x - 32} y1={supportY + 14} x2={x + 32} y2={supportY + 14} stroke="#64748b" strokeWidth="2" />
          </>
        ) : (
          <line x1={x - 32} y1={supportY + 8} x2={x + 32} y2={supportY + 8} stroke="#64748b" strokeWidth="2" />
        )}
        <text x={x} y={supportY + 34} textAnchor="middle" fontSize="12" fill="#cbd5e1">
          {label}
        </text>
      </g>
    )
  }

  const renderLoads = (span, index) => {
    const x1 = jointXs[index]
    const x2 = jointXs[index + 1]
    const spanWidth = x2 - x1
    const midX = (x1 + x2) / 2
    const L = num(span.length, 1)
    const loads = normalizeLoads(span)

    if (!loads.length) {
      return (
        <text key={`empty-${index}`} x={midX} y={beamY - 30} textAnchor="middle" fontSize="12" fill="#64748b">
          No Load
        </text>
      )
    }

    return (
      <g key={`loads-${index}`}>
        {loads.map((load, loadIndex) => {
          const yTop = loadTopY + loadIndex * 27

          if (load.type === 'udl' || load.type === 'partialUdl' || load.type === 'uvl') {
            let startX = x1 + 12
            let endX = x2 - 12
            let label = ''

            if (load.type === 'udl') {
              label = `${fmt(load.w)} kN/m`
            } else {
              const { start, end } = getLoadInterval(load, L)
              startX = x1 + (start / L) * spanWidth
              endX = x1 + (end / L) * spanWidth
              label = load.type === 'partialUdl' ? `${fmt(load.w)} kN/m` : `${fmt(load.w1)}→${fmt(load.w2)} kN/m`
            }

            const arrowCount = Math.max(3, Math.min(8, Math.floor((endX - startX) / 40)))

            return (
              <g key={`load-${index}-${loadIndex}`}>
                <line x1={startX} y1={yTop} x2={endX} y2={yTop} stroke="#fb923c" strokeWidth="3" />
                {Array.from({ length: arrowCount }).map((_, arrowIndex) => {
                  const x = startX + (arrowIndex * (endX - startX)) / Math.max(arrowCount - 1, 1)
                  return (
                    <line
                      key={arrowIndex}
                      x1={x}
                      y1={yTop}
                      x2={x}
                      y2={beamY - 10}
                      stroke="#fb923c"
                      strokeWidth="2.5"
                      markerEnd="url(#arrowHead)"
                    />
                  )
                })}
                <text x={(startX + endX) / 2} y={yTop - 7} textAnchor="middle" fontSize="11" fontWeight="700" fill="#fed7aa">
                  L{loadIndex + 1}: {label}
                </text>
              </g>
            )
          }

          if (load.type === 'point' || load.type === 'moment') {
            const a = clampWithinSpan(load.a, L, L / 2)
            const px = x1 + (a / L) * spanWidth

            if (load.type === 'point') {
              return (
                <g key={`load-${index}-${loadIndex}`}>
                  <line x1={px} y1={yTop} x2={px} y2={beamY - 10} stroke="#fb923c" strokeWidth="4" markerEnd="url(#arrowHead)" />
                  <text x={px} y={yTop - 8} textAnchor="middle" fontSize="11" fontWeight="700" fill="#fed7aa">
                    P{loadIndex + 1} = {fmt(load.P)} kN
                  </text>
                </g>
              )
            }

            return (
              <g key={`load-${index}-${loadIndex}`}>
                <path
                  d={`M ${px - 18} ${beamY - 18} C ${px - 30} ${beamY - 48}, ${px + 30} ${beamY - 48}, ${px + 18} ${beamY - 18}`}
                  fill="none"
                  stroke="#fb923c"
                  strokeWidth="3"
                  markerEnd="url(#arrowHead)"
                />
                <text x={px} y={beamY - 58} textAnchor="middle" fontSize="11" fontWeight="700" fill="#fed7aa">
                  M{loadIndex + 1} = {fmt(load.M)} kNm
                </text>
              </g>
            )
          }

          return null
        })}
      </g>
    )
  }

  return (
    <div className="rounded-2xl border border-orange-500/20 bg-slate-900/70 p-5">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
        <div>
          <h2 className="text-xl font-bold">Input Beam Diagram</h2>
          <p className="text-sm text-slate-400">Live visual layout with spans, supports, multiple loads, length and EI.</p>
        </div>
        <div className="rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-sm text-orange-300">
          Auto updates with input
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-[#020617] p-3">
        <svg viewBox={`0 0 ${width} ${height}`} className="min-w-[850px] w-full h-auto">
          <defs>
            <marker id="arrowHead" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
              <path d="M 0 0 L 8 4 L 0 8 Z" fill="#fb923c" />
            </marker>
          </defs>

          <line x1={padding} y1={beamY} x2={width - padding} y2={beamY} stroke="#e2e8f0" strokeWidth="8" strokeLinecap="round" />

          {spans.map((span, index) => renderLoads(span, index))}

          {jointXs.map((x, index) => (
            <g key={`joint-${index}`}>
              <circle cx={x} cy={beamY} r="8" fill="#f97316" stroke="#fed7aa" strokeWidth="2" />
              <text x={x} y={beamY - 18} textAnchor="middle" fontSize="14" fontWeight="800" fill="#ffffff">
                {jointName(index)}
              </text>
            </g>
          ))}

          {jointXs.map((x, index) => renderSupport(x, index))}

          {spans.map((span, index) => {
            const x1 = jointXs[index]
            const x2 = jointXs[index + 1]
            const midX = (x1 + x2) / 2
            return (
              <g key={`dim-${index}`}>
                <line x1={x1} y1={dimY} x2={x2} y2={dimY} stroke="#64748b" strokeWidth="2" />
                <line x1={x1} y1={dimY - 8} x2={x1} y2={dimY + 8} stroke="#64748b" strokeWidth="2" />
                <line x1={x2} y1={dimY - 8} x2={x2} y2={dimY + 8} stroke="#64748b" strokeWidth="2" />
                <text x={midX} y={dimY + 22} textAnchor="middle" fontSize="13" fill="#cbd5e1">
                  Span {jointName(index)}{jointName(index + 1)} = {fmt(span.length)} m
                </text>
                <text x={midX} y={dimY + 42} textAnchor="middle" fontSize="12" fill="#94a3b8">
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

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950 p-3">
      <span className="text-slate-400">{label}</span>
      <span className="font-bold text-white">{value}</span>
    </div>
  )
}

function ResultSection({ title, icon, children }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
      <h2 className="text-xl font-bold mb-5 flex items-center gap-2 text-white">
        {icon ? <span className="text-orange-300">{icon}</span> : null}
        {title}
      </h2>
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
              <th key={header} className="p-3 text-left whitespace-nowrap">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-slate-800/60">
              {row.map((cell, j) => (
                <td key={j} className={`p-3 whitespace-nowrap ${j === 0 ? 'font-semibold text-orange-300' : ''}`}>
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
    return <div className="h-40 rounded-xl border border-slate-800 bg-slate-900" />
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
  const mapY = (y) => height - padding - ((y - minY) / yRange) * (height - padding * 2)
  const polyline = points.map((p) => `${mapX(p.x)},${mapY(p[valueKey])}`).join(' ')
  const zeroY = mapY(0)

  return (
    <div className="w-full overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-44">
        <line x1={padding} x2={width - padding} y1={zeroY} y2={zeroY} className="stroke-slate-600" strokeWidth="1" />
        <polyline points={polyline} fill="none" className="stroke-orange-400" strokeWidth="3" />
        <circle cx={mapX(points[0].x)} cy={mapY(points[0][valueKey])} r="4" className="fill-orange-300" />
        <circle cx={mapX(points[points.length - 1].x)} cy={mapY(points[points.length - 1][valueKey])} r="4" className="fill-orange-300" />
      </svg>
    </div>
  )
}
