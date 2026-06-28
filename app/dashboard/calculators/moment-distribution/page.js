'use client'

import { useMemo, useState } from 'react'

const topicCards = [
  'Fixed End Moments',
  'Distribution Factor',
  'Stiffness Factor',
  'Carry Over Factor',
  'Joint Balancing',
  'Moment Distribution Table',
  'Final End Moments',
  'Continuous Beam',
  'Fixed Beam',
  'Point Load',
  'UDL',
  'Support Reactions',
  'SFD',
  'BMD',
  'Step-by-step Solution',
  'Exam Answer',
]

const templateInfo = {
  fixed: {
    title: 'Fixed Beam',
    desc: 'Single span beam fixed at both ends.',
  },
  twoSpan: {
    title: 'Two-Span Continuous Beam',
    desc: 'Two spans with one internal continuous joint.',
  },
  threeSpan: {
    title: 'Three-Span Continuous Beam',
    desc: 'Three spans with two internal continuous joints.',
  },
  fourSpan: {
    title: 'Four-Span Continuous Beam',
    desc: 'Four spans with three internal continuous joints.',
  },
  custom: {
    title: 'Custom Continuous Beam',
    desc: 'Set number of spans, end conditions and span loads manually.',
  },
}

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

function jointName(index) {
  return String.fromCharCode(65 + index)
}

function endKey(spanIndex, end) {
  const a = jointName(spanIndex)
  const b = jointName(spanIndex + 1)
  return end === 'left' ? `${a}${b}` : `${b}${a}`
}

function getTemplateDefaults(template) {
  if (template === 'fixed') {
    return {
      template,
      spanCount: 1,
      leftEnd: 'fixed',
      rightEnd: 'fixed',
      spans: [
        { L: 6, EI: 1, udl: 5, pointLoad: 20, pointPosition: 3 },
        { L: 4, EI: 1, udl: 0, pointLoad: 0, pointPosition: 2 },
        { L: 4, EI: 1, udl: 0, pointLoad: 0, pointPosition: 2 },
        { L: 4, EI: 1, udl: 0, pointLoad: 0, pointPosition: 2 },
      ],
    }
  }

  if (template === 'threeSpan') {
    return {
      template,
      spanCount: 3,
      leftEnd: 'pin',
      rightEnd: 'pin',
      spans: [
        { L: 4, EI: 1, udl: 5, pointLoad: 0, pointPosition: 2 },
        { L: 4, EI: 1, udl: 0, pointLoad: 20, pointPosition: 2 },
        { L: 4, EI: 1, udl: 6, pointLoad: 0, pointPosition: 2 },
        { L: 4, EI: 1, udl: 0, pointLoad: 0, pointPosition: 2 },
      ],
    }
  }

  if (template === 'fourSpan') {
    return {
      template,
      spanCount: 4,
      leftEnd: 'pin',
      rightEnd: 'pin',
      spans: [
        { L: 4, EI: 1, udl: 5, pointLoad: 0, pointPosition: 2 },
        { L: 4, EI: 1, udl: 0, pointLoad: 20, pointPosition: 2 },
        { L: 4, EI: 1, udl: 6, pointLoad: 0, pointPosition: 2 },
        { L: 4, EI: 1, udl: 4, pointLoad: 0, pointPosition: 2 },
      ],
    }
  }

  return {
    template: template === 'custom' ? 'custom' : 'twoSpan',
    spanCount: 2,
    leftEnd: 'pin',
    rightEnd: 'pin',
    spans: [
      { L: 4, EI: 1, udl: 5, pointLoad: 0, pointPosition: 2 },
      { L: 4, EI: 1, udl: 0, pointLoad: 20, pointPosition: 2 },
      { L: 4, EI: 1, udl: 0, pointLoad: 0, pointPosition: 2 },
      { L: 4, EI: 1, udl: 0, pointLoad: 0, pointPosition: 2 },
    ],
  }
}

function getTotalLength(spans, spanCount) {
  return spans
    .slice(0, spanCount)
    .reduce((sum, span) => sum + Math.max(toNum(span.L, 0), 0), 0)
}

function getJointPositions(spans, spanCount) {
  const positions = [0]
  let x = 0

  for (let i = 0; i < spanCount; i += 1) {
    x += Math.max(toNum(spans[i].L, 0), 0)
    positions.push(x)
  }

  return positions
}

function isLeftExternalHinge(form, spanIndex) {
  return spanIndex === 0 && form.leftEnd === 'pin'
}

function isRightExternalHinge(form, spanIndex) {
  return spanIndex === form.spanCount - 1 && form.rightEnd === 'pin'
}

function isLeftExternalFixed(form, spanIndex) {
  return spanIndex === 0 && form.leftEnd === 'fixed'
}

function isRightExternalFixed(form, spanIndex) {
  return spanIndex === form.spanCount - 1 && form.rightEnd === 'fixed'
}

function fixedEndMomentsForSpan(span) {
  const L = Math.max(toNum(span.L, 1), 0.001)
  const w = Math.max(toNum(span.udl, 0), 0)
  const P = Math.max(toNum(span.pointLoad, 0), 0)
  const a = clamp(toNum(span.pointPosition, L / 2), 0, L)
  const b = L - a

  const udlLeft = -(w * L * L) / 12
  const udlRight = (w * L * L) / 12

  const pointLeft = P > 0 ? -(P * a * b * b) / (L * L) : 0
  const pointRight = P > 0 ? (P * a * a * b) / (L * L) : 0

  return {
    left: udlLeft + pointLeft,
    right: udlRight + pointRight,
    udlLeft,
    udlRight,
    pointLeft,
    pointRight,
  }
}

function getInitialFixedEndMoments(form) {
  const moments = []
  const femRows = []

  for (let i = 0; i < form.spanCount; i += 1) {
    const fem = fixedEndMomentsForSpan(form.spans[i])
    let left = fem.left
    let right = fem.right
    const originalLeft = left
    const originalRight = right
    let releaseNote = '-'

    if (isLeftExternalHinge(form, i)) {
      right = right - left / 2
      left = 0
      releaseNote = `${endKey(i, 'left')} hinge release applied`
    }

    if (isRightExternalHinge(form, i)) {
      left = left - right / 2
      right = 0
      releaseNote =
        releaseNote === '-'
          ? `${endKey(i, 'right')} hinge release applied`
          : `${releaseNote}, ${endKey(i, 'right')} hinge release applied`
    }

    moments.push({ left, right })

    femRows.push({
      span: `${jointName(i)}${jointName(i + 1)}`,
      L: toNum(form.spans[i].L, 0),
      w: toNum(form.spans[i].udl, 0),
      P: toNum(form.spans[i].pointLoad, 0),
      a: toNum(form.spans[i].pointPosition, 0),
      originalLeft,
      originalRight,
      finalLeft: left,
      finalRight: right,
      releaseNote,
    })
  }

  return { moments, femRows }
}

function getFarEndType(form, spanIndex, end) {
  if (end === 'left') {
    if (isRightExternalHinge(form, spanIndex)) return 'hinged'
    return 'fixed'
  }

  if (isLeftExternalHinge(form, spanIndex)) return 'hinged'
  return 'fixed'
}

function getMemberStiffness(form, spanIndex, end) {
  const L = Math.max(toNum(form.spans[spanIndex].L, 1), 0.001)
  const EI = Math.max(toNum(form.spans[spanIndex].EI, 1), 0.001)
  const far = getFarEndType(form, spanIndex, end)

  if (far === 'hinged') {
    return {
      stiffness: (3 * EI) / L,
      carryOver: 0,
      far,
    }
  }

  return {
    stiffness: (4 * EI) / L,
    carryOver: 0.5,
    far,
  }
}

function getJointEnds(form, jointIndex) {
  const ends = []

  if (jointIndex > 0) {
    const spanIndex = jointIndex - 1
    const stiffness = getMemberStiffness(form, spanIndex, 'right')

    ends.push({
      spanIndex,
      end: 'right',
      key: endKey(spanIndex, 'right'),
      farKey: endKey(spanIndex, 'left'),
      stiffness: stiffness.stiffness,
      carryOver: stiffness.carryOver,
      far: stiffness.far,
    })
  }

  if (jointIndex < form.spanCount) {
    const spanIndex = jointIndex
    const stiffness = getMemberStiffness(form, spanIndex, 'left')

    ends.push({
      spanIndex,
      end: 'left',
      key: endKey(spanIndex, 'left'),
      farKey: endKey(spanIndex, 'right'),
      stiffness: stiffness.stiffness,
      carryOver: stiffness.carryOver,
      far: stiffness.far,
    })
  }

  return ends
}

function getDistributionJoints(form) {
  const joints = []

  for (let j = 1; j < form.spanCount; j += 1) {
    const ends = getJointEnds(form, j)
    const stiffnessSum = ends.reduce((sum, item) => sum + item.stiffness, 0)

    joints.push({
      jointIndex: j,
      joint: jointName(j),
      ends: ends.map((item) => ({
        ...item,
        df: stiffnessSum > 0 ? item.stiffness / stiffnessSum : 0,
      })),
      stiffnessSum,
    })
  }

  return joints
}

function getCurrentValue(current, spanIndex, end) {
  return current[spanIndex][end]
}

function addCurrentValue(current, spanIndex, end, value) {
  current[spanIndex][end] += value
}

function snapshotMoments(form, current) {
  const map = {}

  for (let i = 0; i < form.spanCount; i += 1) {
    map[endKey(i, 'left')] = current[i].left
    map[endKey(i, 'right')] = current[i].right
  }

  return map
}

function momentMapFromChanges(form, changes) {
  const map = {}

  for (let i = 0; i < form.spanCount; i += 1) {
    map[endKey(i, 'left')] = changes[endKey(i, 'left')] || 0
    map[endKey(i, 'right')] = changes[endKey(i, 'right')] || 0
  }

  return map
}

function solveMomentDistribution(form) {
  const iterations = clamp(toNum(form.iterations, 8), 1, 20)
  const tolerance = Math.max(toNum(form.tolerance, 0.0001), 0.000001)
  const spanCount = clamp(toNum(form.spanCount, 2), 1, 4)
  const totalLength = getTotalLength(form.spans, spanCount)

  const workingForm = {
    ...form,
    spanCount,
  }

  const { moments: initialMoments, femRows } = getInitialFixedEndMoments(workingForm)
  const joints = getDistributionJoints(workingForm)
  const current = initialMoments.map((item) => ({ ...item }))
  const endKeys = []

  for (let i = 0; i < spanCount; i += 1) {
    endKeys.push(endKey(i, 'left'), endKey(i, 'right'))
  }

  const distributionRows = [
    {
      label: 'Fixed End Moments',
      type: 'initial',
      values: snapshotMoments(workingForm, current),
    },
  ]

  const operationRows = []

  for (let cycle = 1; cycle <= iterations; cycle += 1) {
    let maxUnbalanced = 0

    joints.forEach((joint) => {
      const unbalanced = joint.ends.reduce(
        (sum, item) => sum + getCurrentValue(current, item.spanIndex, item.end),
        0
      )

      maxUnbalanced = Math.max(maxUnbalanced, Math.abs(unbalanced))

      if (Math.abs(unbalanced) < tolerance) return

      const changes = {}

      joint.ends.forEach((item) => {
        const distributed = -unbalanced * item.df
        addCurrentValue(current, item.spanIndex, item.end, distributed)
        changes[item.key] = (changes[item.key] || 0) + distributed

        const carry = distributed * item.carryOver

        if (Math.abs(carry) > 0) {
          const farEnd = item.end === 'left' ? 'right' : 'left'
          addCurrentValue(current, item.spanIndex, farEnd, carry)
          changes[item.farKey] = (changes[item.farKey] || 0) + carry
        }
      })

      operationRows.push({
        cycle,
        joint: joint.joint,
        unbalanced,
        changes: momentMapFromChanges(workingForm, changes),
      })

      distributionRows.push({
        label: `Cycle ${cycle}: Balance Joint ${joint.joint}`,
        type: 'operation',
        values: snapshotMoments(workingForm, current),
      })
    })

    if (maxUnbalanced < tolerance) break
  }

  distributionRows.push({
    label: 'Final End Moments',
    type: 'final',
    values: snapshotMoments(workingForm, current),
  })

  const finalMoments = current.map((item, index) => ({
    spanIndex: index,
    span: `${jointName(index)}${jointName(index + 1)}`,
    leftKey: endKey(index, 'left'),
    rightKey: endKey(index, 'right'),
    left: item.left,
    right: item.right,
  }))

  const jointRows = []

  joints.forEach((joint) => {
    joint.ends.forEach((item) => {
      jointRows.push({
        joint: joint.joint,
        memberEnd: item.key,
        stiffness: item.stiffness,
        stiffnessSum: joint.stiffnessSum,
        df: item.df,
        carryOver: item.carryOver,
        farEnd: item.farKey,
        farType: item.far,
      })
    })
  })

  const spanReactions = finalMoments.map((momentRow, index) => {
    const span = workingForm.spans[index]
    const L = Math.max(toNum(span.L, 1), 0.001)
    const w = Math.max(toNum(span.udl, 0), 0)
    const P = Math.max(toNum(span.pointLoad, 0), 0)
    const a = clamp(toNum(span.pointPosition, L / 2), 0, L)
    const totalLoad = w * L + P
    const momentOfLoadsAboutLeft = w * L * (L / 2) + P * a

    const rightReaction =
      (momentOfLoadsAboutLeft - momentRow.left - momentRow.right) / L
    const leftReaction = totalLoad - rightReaction

    return {
      span: momentRow.span,
      spanIndex: index,
      L,
      w,
      P,
      a,
      leftMoment: momentRow.left,
      rightMoment: momentRow.right,
      leftReaction,
      rightReaction,
      totalLoad,
    }
  })

  const jointPositions = getJointPositions(workingForm.spans, spanCount)
  const supportReactions = Array.from({ length: spanCount + 1 }, (_, index) => ({
    joint: jointName(index),
    x: jointPositions[index],
    vertical: 0,
    moment: 0,
    type:
      index === 0
        ? workingForm.leftEnd
        : index === spanCount
          ? workingForm.rightEnd
          : 'continuous',
  }))

  spanReactions.forEach((span) => {
    supportReactions[span.spanIndex].vertical += span.leftReaction
    supportReactions[span.spanIndex + 1].vertical += span.rightReaction
  })

  finalMoments.forEach((moment, index) => {
    if (index === 0 && workingForm.leftEnd === 'fixed') {
      supportReactions[0].moment = moment.left
    }

    if (index === spanCount - 1 && workingForm.rightEnd === 'fixed') {
      supportReactions[spanCount].moment = moment.right
    }
  })

  const diagramValues = []
  let globalStart = 0

  spanReactions.forEach((span, index) => {
    const samples = 120

    for (let i = 0; i <= samples; i += 1) {
      const x = (span.L * i) / samples
      const shear = span.leftReaction - span.w * x - (x >= span.a ? span.P : 0)
      const loadMoment =
        span.w * x * (x / 2) + (x >= span.a ? span.P * (x - span.a) : 0)

      const moment = span.leftMoment + span.leftReaction * x - loadMoment

      diagramValues.push({
        x: globalStart + x,
        localX: x,
        spanIndex: index,
        shear,
        moment,
      })
    }

    globalStart += span.L
  })

  const maxBM = diagramValues.reduce((best, item) =>
    Math.abs(item.moment) > Math.abs(best.moment) ? item : best
  )

  const maxSF = diagramValues.reduce((best, item) =>
    Math.abs(item.shear) > Math.abs(best.shear) ? item : best
  )

  const staticIndeterminacy =
    workingForm.leftEnd === 'fixed' && workingForm.rightEnd === 'fixed'
      ? spanCount + 1
      : spanCount

  const summary = [
    { label: 'Spans', value: `${spanCount}` },
    { label: 'Distribution Joints', value: `${joints.length}` },
    { label: 'Max |SF|', value: `${fmt(maxSF.shear, 3)} kN` },
    { label: 'Max |BM|', value: `${fmt(maxBM.moment, 3)} kN·m` },
    { label: 'Iterations Used', value: `${operationRows.at(-1)?.cycle || 0}` },
    { label: 'Method', value: 'Moment Distribution' },
  ]

  const formulas = [
    'Fixed end moment for UDL: FEM_AB = -wL²/12 and FEM_BA = +wL²/12',
    'Fixed end moment for point load: FEM_AB = -Pab²/L² and FEM_BA = +Pa²b/L²',
    'Member stiffness when far end fixed: K = 4EI/L',
    'Member stiffness when far end hinged: K = 3EI/L',
    'Distribution factor: DF = K / ΣK at joint',
    'Distributed moment: -Unbalanced moment × DF',
    'Carry-over moment: distributed moment × 1/2 when far end is fixed',
    'Final end moments are obtained after repeated joint balancing',
  ]

  const steps = [
    `Selected template: ${templateInfo[workingForm.template]?.title || 'Custom Beam'}.`,
    `Total beam length = ${fmt(totalLength, 3)} m with ${spanCount} span(s).`,
    `Fixed end moments are calculated for UDL and point load on each span.`,
    `External hinged ends are released so end moment becomes zero at pin/roller end.`,
    `Member stiffness values are calculated using 4EI/L or 3EI/L depending on far-end condition.`,
    `Distribution factors are calculated at each continuous joint.`,
    `Unbalanced moments are distributed to connected members according to distribution factors.`,
    `Carry-over moments are transferred to far ends where applicable.`,
    `Final end moments are obtained after ${operationRows.at(-1)?.cycle || 0} cycle(s).`,
    `Support reactions, SFD and BMD are calculated using final end moments.`,
    `Maximum bending moment = ${fmt(maxBM.moment, 3)} kN·m at x = ${fmt(maxBM.x, 3)} m.`,
  ]

  const finalAnswer = `Using moment distribution method, final end moments have been calculated after balancing the continuous joints. Maximum bending moment is ${fmt(maxBM.moment, 3)} kN·m at x = ${fmt(maxBM.x, 3)} m and maximum shear force is ${fmt(maxSF.shear, 3)} kN. Final end moments, distribution table, support reactions, SFD and BMD are shown in the results.`

  return {
    title: `${templateInfo[workingForm.template]?.title || 'Custom Beam'} Result`,
    spanCount,
    totalLength,
    endKeys,
    femRows,
    jointRows,
    operationRows,
    distributionRows,
    finalMoments,
    spanReactions,
    supportReactions,
    diagramValues,
    maxBM,
    maxSF,
    summary,
    formulas,
    steps,
    finalAnswer,
    workingForm,
  }
}

function buildPlainReport(result, form) {
  const finalMoments = result.finalMoments
    .map(
      (item) =>
        `${item.span}: ${item.leftKey} = ${fmt(item.left, 3)} kN·m, ${item.rightKey} = ${fmt(item.right, 3)} kN·m`
    )
    .join('\n')

  const reactions = result.supportReactions
    .map(
      (item) =>
        `${item.joint} at x=${fmt(item.x, 3)} m | V=${fmt(item.vertical, 3)} kN | M=${fmt(item.moment, 3)} kN·m`
    )
    .join('\n')

  return `
${form.reportTitle || 'Moment Distribution Report'}
Prepared By: ${form.preparedBy || '-'}
Template: ${templateInfo[form.template]?.title || 'Custom Beam'}

RESULT SUMMARY
${result.summary.map((item) => `${item.label}: ${item.value}`).join('\n')}

FINAL END MOMENTS
${finalMoments}

SUPPORT REACTIONS
${reactions}

FORMULAS USED
${result.formulas.map((item, index) => `${index + 1}. ${item}`).join('\n')}

STEP-BY-STEP SOLUTION
${result.steps.map((item, index) => `${index + 1}. ${item}`).join('\n')}

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

  const momentRows = result.finalMoments
    .map(
      (item) => `
        <tr>
          <td>${cleanHtml(item.span)}</td>
          <td>${cleanHtml(item.leftKey)}</td>
          <td>${fmt(item.left, 3)} kN·m</td>
          <td>${cleanHtml(item.rightKey)}</td>
          <td>${fmt(item.right, 3)} kN·m</td>
        </tr>
      `
    )
    .join('')

  const reactionRows = result.supportReactions
    .map(
      (item) => `
        <tr>
          <td>${cleanHtml(item.joint)}</td>
          <td>${fmt(item.x, 3)} m</td>
          <td>${cleanHtml(item.type)}</td>
          <td>${fmt(item.vertical, 3)} kN</td>
          <td>${fmt(item.moment, 3)} kN·m</td>
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
  <title>${cleanHtml(form.reportTitle || 'Moment Distribution Report')}</title>
  <meta charset="utf-8" />
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 28px;
      color: #111827;
      background: #ffffff;
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
      <h1>${cleanHtml(form.reportTitle || 'Moment Distribution Report')}</h1>
      <div class="sub">
        Prepared By: ${cleanHtml(form.preparedBy || '-')}<br/>
        Template: ${cleanHtml(templateInfo[form.template]?.title || 'Custom Beam')}<br/>
        Method: Moment Distribution Method
      </div>
    </div>

    <h2>Result Summary</h2>
    <table><tbody>${summaryRows}</tbody></table>

    <h2>Final End Moments</h2>
    <table>
      <thead>
        <tr>
          <th>Span</th>
          <th>Left End</th>
          <th>Moment</th>
          <th>Right End</th>
          <th>Moment</th>
        </tr>
      </thead>
      <tbody>${momentRows}</tbody>
    </table>

    <h2>Support Reactions</h2>
    <table>
      <thead>
        <tr>
          <th>Joint</th>
          <th>x</th>
          <th>Type</th>
          <th>Vertical Reaction</th>
          <th>Moment Reaction</th>
        </tr>
      </thead>
      <tbody>${reactionRows}</tbody>
    </table>

    <h2>Formulas Used</h2>
    <ol>${formulas}</ol>

    <h2>Step-by-Step Solution</h2>
    <ol>${steps}</ol>

    <h2>Final Answer</h2>
    <div class="answer">${cleanHtml(result.finalAnswer)}</div>

    <div class="footer">Generated using CivilCalc Pro Moment Distribution Solver.</div>
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

function SpanEditor({ span, index, onChange }) {
  const update = (key, value) => onChange(index, key, value)

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
      <p className="mb-4 font-black text-orange-300">
        Span {index + 1}: {jointName(index)}{jointName(index + 1)}
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <NumberField
          label="Span Length L"
          value={span.L}
          onChange={(value) => update('L', value)}
          suffix="m"
          min="0.1"
        />

        <NumberField
          label="EI Factor"
          value={span.EI}
          onChange={(value) => update('EI', value)}
          suffix="EI"
          helper="Use 1 if EI is same for all spans."
          min="0.001"
        />

        <NumberField
          label="UDL w"
          value={span.udl}
          onChange={(value) => update('udl', value)}
          suffix="kN/m"
          min="0"
        />

        <NumberField
          label="Point Load P"
          value={span.pointLoad}
          onChange={(value) => update('pointLoad', value)}
          suffix="kN"
          min="0"
        />

        <NumberField
          label="Point Load Position a"
          value={span.pointPosition}
          onChange={(value) => update('pointPosition', value)}
          suffix="m"
          helper={`Distance from ${jointName(index)}.`}
          min="0"
        />
      </div>
    </div>
  )
}

function BeamDiagram({ result }) {
  const x0 = 70
  const x1 = 570
  const y = 130
  const L = result.totalLength || 1
  const mapX = (x) => x0 + (x / L) * (x1 - x0)
  const jointPositions = getJointPositions(result.workingForm.spans, result.spanCount)

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-950 p-4">
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-lg font-black text-white">Continuous Beam Diagram</h3>
          <p className="mt-1 text-xs leading-5 text-slate-400">
            Beam template, support condition and span loads used in moment distribution.
          </p>
        </div>

        <span className="rounded-xl border border-orange-500/20 bg-orange-500/10 px-3 py-2 text-xs font-bold text-orange-200">
          Total L = {fmt(result.totalLength, 3)} m
        </span>
      </div>

      <svg viewBox="0 0 640 295" className="h-auto w-full">
        <line x1={x0} y1={y} x2={x1} y2={y} stroke="#cbd5e1" strokeWidth="7" strokeLinecap="round" />

        {jointPositions.map((x, index) => {
          const sx = mapX(x)
          const isLeft = index === 0
          const isRight = index === result.spanCount
          const endType = isLeft ? result.workingForm.leftEnd : isRight ? result.workingForm.rightEnd : 'continuous'

          if (endType === 'fixed') {
            return (
              <g key={index}>
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
                  {jointName(index)}
                </text>
              </g>
            )
          }

          if (endType === 'continuous') {
            return (
              <g key={index}>
                <polygon points={`${sx - 18},${y + 35} ${sx + 18},${y + 35} ${sx},${y + 6}`} fill="#38bdf8" />
                <line x1={sx - 30} y1={y + 38} x2={sx + 30} y2={y + 38} stroke="#38bdf8" strokeWidth="3" />
                <text x={sx - 8} y={y + 66} fill="#e2e8f0" fontSize="12" fontWeight="800">
                  {jointName(index)}
                </text>
              </g>
            )
          }

          return (
            <g key={index}>
              <circle cx={sx} cy={y + 24} r="12" fill="none" stroke="#38bdf8" strokeWidth="3" />
              <line x1={sx - 30} y1={y + 38} x2={sx + 30} y2={y + 38} stroke="#38bdf8" strokeWidth="3" />
              <text x={sx - 8} y={y + 66} fill="#e2e8f0" fontSize="12" fontWeight="800">
                {jointName(index)}
              </text>
            </g>
          )
        })}

        {result.workingForm.spans.slice(0, result.spanCount).map((span, index) => {
          const start = jointPositions[index]
          const end = jointPositions[index + 1]
          const sx = mapX(start)
          const ex = mapX(end)
          const items = []

          if (toNum(span.udl, 0) > 0) {
            const positions = Array.from({ length: 7 }, (_, i) => sx + ((ex - sx) * i) / 6)

            items.push(
              <g key="udl">
                <line x1={sx} y1="48" x2={ex} y2="48" stroke="#f97316" strokeWidth="3" />
                {positions.map((px) => (
                  <g key={px}>
                    <line x1={px} y1="50" x2={px} y2={y - 8} stroke="#f97316" strokeWidth="2.5" />
                    <polygon points={`${px - 6},${y - 18} ${px + 6},${y - 18} ${px},${y - 6}`} fill="#f97316" />
                  </g>
                ))}
                <text x={sx + 6} y="38" fill="#fed7aa" fontSize="13" fontWeight="900">
                  w={fmt(span.udl, 1)}
                </text>
              </g>
            )
          }

          if (toNum(span.pointLoad, 0) > 0) {
            const px = mapX(start + clamp(toNum(span.pointPosition, 0), 0, toNum(span.L, 0)))

            items.push(
              <g key="point">
                <line x1={px} y1="42" x2={px} y2={y - 8} stroke="#f97316" strokeWidth="4" />
                <polygon points={`${px - 9},${y - 18} ${px + 9},${y - 18} ${px},${y - 4}`} fill="#f97316" />
                <text x={px - 28} y="30" fill="#fed7aa" fontSize="13" fontWeight="900">
                  P={fmt(span.pointLoad, 1)}
                </text>
              </g>
            )
          }

          items.push(
            <text key="label" x={(sx + ex) / 2 - 18} y={y + 104} fill="#f97316" fontSize="13" fontWeight="900">
              {jointName(index)}{jointName(index + 1)}
            </text>
          )

          return <g key={index}>{items}</g>
        })}

        <line x1={x0} y1={y + 118} x2={x1} y2={y + 118} stroke="#64748b" strokeWidth="2" />
        <text x={(x0 + x1) / 2 - 30} y={y + 145} fill="#f97316" fontSize="14" fontWeight="900">
          Moment Distribution Beam
        </text>
      </svg>
    </div>
  )
}

function CurveDiagram({ result, type }) {
  const x0 = 70
  const x1 = 570
  const yBase = 115
  const amp = 65
  const L = result.totalLength || 1
  const mapX = (x) => x0 + (x / L) * (x1 - x0)

  const meta = {
    sfd: {
      title: 'Shear Force Diagram',
      color: '#f97316',
      note: 'Final SFD calculated from final span reactions.',
      unit: 'kN',
      digits: 3,
      key: 'shear',
      label: 'SF',
    },
    bmd: {
      title: 'Bending Moment Diagram',
      color: '#38bdf8',
      note: 'Final BMD calculated from final end moments and loads.',
      unit: 'kN·m',
      digits: 3,
      key: 'moment',
      label: 'BM',
    },
  }[type]

  const values = result.diagramValues || []
  const getValue = (item) => item[meta.key]
  const rawMaxAbs = Math.max(...values.map((item) => Math.abs(getValue(item))), 0)
  const maxAbs = rawMaxAbs > 1e-12 ? rawMaxAbs : 1

  const points = values
    .map((item) => {
      const value = getValue(item)
      const y = type === 'sfd' ? yBase - (value / maxAbs) * amp : yBase + (value / maxAbs) * amp
      return `${mapX(item.x)},${y}`
    })
    .join(' ')

  const maxPoint = values.reduce((best, item) => (getValue(item) > getValue(best) ? item : best), values[0])
  const minPoint = values.reduce((best, item) => (getValue(item) < getValue(best) ? item : best), values[0])
  const absPoint = values.reduce((best, item) => (Math.abs(getValue(item)) > Math.abs(getValue(best)) ? item : best), values[0])

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
          Max |{meta.label}| = {fmt(getValue(absPoint), meta.digits)} {meta.unit}
        </div>
      </div>

      <svg viewBox="0 0 640 280" className="h-auto w-full">
        <line x1={x0} y1={yBase} x2={x1} y2={yBase} stroke="#64748b" strokeWidth="2" strokeDasharray="6 6" />
        <line x1={x0} y1="30" x2={x0} y2="190" stroke="#334155" strokeWidth="2" />
        <line x1={x1} y1="30" x2={x1} y2="190" stroke="#334155" strokeWidth="2" />

        <polyline points={points} fill="none" stroke={meta.color} strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" />

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
          Max absolute:
        </text>

        <text x="360" y="258" fill="#facc15" fontSize="13" fontWeight="900">
          x = {fmt(absPoint.x, 3)} m, {meta.label} = {fmt(getValue(absPoint), meta.digits)} {meta.unit}
        </text>
      </svg>
    </div>
  )
}

function MethodPanel() {
  const steps = [
    ['1. Fixed End Moments', 'Calculate FEM for UDL and point load on each span.'],
    ['2. End Release', 'If external end is hinged, release end moment and carry correction to far end.'],
    ['3. Stiffness', 'Calculate member stiffness as 4EI/L or 3EI/L.'],
    ['4. Distribution Factor', 'DF = member stiffness / total stiffness at joint.'],
    ['5. Joint Balancing', 'Distribute negative of unbalanced moment at each joint.'],
    ['6. Carry Over', 'Carry half of distributed moment to far end when far end is fixed.'],
  ]

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
      <h2 className="text-2xl font-black text-white">Method Used</h2>
      <p className="mt-2 text-sm leading-6 text-slate-400">
        This follows the exam-style Moment Distribution Method: FEM → DF → distribution → carry-over → final end moments.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {steps.map((item) => (
          <div key={item[0]} className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
            <p className="font-black text-orange-300">{item[0]}</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">{item[1]}</p>
          </div>
        ))}
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

function FixedEndMomentTable({ result }) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
      <h2 className="text-2xl font-black text-white">Fixed End Moment Table</h2>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-800">
        <table className="w-full min-w-[950px] border-collapse text-left">
          <thead className="bg-slate-950">
            <tr>
              <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">Span</th>
              <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">L</th>
              <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">UDL</th>
              <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">Point Load</th>
              <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">Original FEM Left</th>
              <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">Original FEM Right</th>
              <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">Used FEM Left</th>
              <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">Used FEM Right</th>
              <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">Note</th>
            </tr>
          </thead>

          <tbody>
            {result.femRows.map((row) => (
              <tr key={row.span} className="bg-slate-900/50">
                <td className="border-b border-slate-800 px-4 py-3 text-sm font-bold text-slate-200">{row.span}</td>
                <td className="border-b border-slate-800 px-4 py-3 text-sm text-orange-300">{fmt(row.L, 3)} m</td>
                <td className="border-b border-slate-800 px-4 py-3 text-sm text-slate-300">{fmt(row.w, 3)} kN/m</td>
                <td className="border-b border-slate-800 px-4 py-3 text-sm text-slate-300">{fmt(row.P, 3)} kN at {fmt(row.a, 3)} m</td>
                <td className="border-b border-slate-800 px-4 py-3 text-sm text-slate-300">{fmt(row.originalLeft, 3)}</td>
                <td className="border-b border-slate-800 px-4 py-3 text-sm text-slate-300">{fmt(row.originalRight, 3)}</td>
                <td className="border-b border-slate-800 px-4 py-3 text-sm text-orange-300">{fmt(row.finalLeft, 3)}</td>
                <td className="border-b border-slate-800 px-4 py-3 text-sm text-orange-300">{fmt(row.finalRight, 3)}</td>
                <td className="border-b border-slate-800 px-4 py-3 text-sm text-slate-300">{row.releaseNote}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function DistributionFactorTable({ result }) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
      <h2 className="text-2xl font-black text-white">Stiffness & Distribution Factor Table</h2>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-800">
        <table className="w-full min-w-[850px] border-collapse text-left">
          <thead className="bg-slate-950">
            <tr>
              <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">Joint</th>
              <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">Member End</th>
              <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">Stiffness K</th>
              <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">ΣK</th>
              <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">DF</th>
              <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">COF</th>
              <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">Far End</th>
            </tr>
          </thead>

          <tbody>
            {result.jointRows.length === 0 && (
              <tr className="bg-slate-900/50">
                <td colSpan={7} className="border-b border-slate-800 px-4 py-4 text-sm text-slate-300">
                  No internal distribution joint for this template.
                </td>
              </tr>
            )}

            {result.jointRows.map((row) => (
              <tr key={`${row.joint}-${row.memberEnd}`} className="bg-slate-900/50">
                <td className="border-b border-slate-800 px-4 py-3 text-sm font-bold text-slate-200">{row.joint}</td>
                <td className="border-b border-slate-800 px-4 py-3 text-sm text-orange-300">{row.memberEnd}</td>
                <td className="border-b border-slate-800 px-4 py-3 text-sm text-slate-300">{fmt(row.stiffness, 4)}</td>
                <td className="border-b border-slate-800 px-4 py-3 text-sm text-slate-300">{fmt(row.stiffnessSum, 4)}</td>
                <td className="border-b border-slate-800 px-4 py-3 text-sm text-orange-300">{fmt(row.df, 4)}</td>
                <td className="border-b border-slate-800 px-4 py-3 text-sm text-slate-300">{fmt(row.carryOver, 3)}</td>
                <td className="border-b border-slate-800 px-4 py-3 text-sm text-slate-300">{row.farEnd} ({row.farType})</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function MomentDistributionTable({ result }) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
      <h2 className="text-2xl font-black text-white">Moment Distribution Table</h2>
      <p className="mt-2 text-sm leading-6 text-slate-400">
        This table shows cumulative moment values after each joint balancing operation.
      </p>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-800">
        <table className="w-full min-w-[950px] border-collapse text-left">
          <thead className="bg-slate-950">
            <tr>
              <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">Step</th>
              {result.endKeys.map((key) => (
                <th key={key} className="border-b border-slate-800 px-4 py-3 text-sm text-white">
                  {key}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {result.distributionRows.map((row, index) => (
              <tr
                key={`${row.label}-${index}`}
                className={row.type === 'final' ? 'bg-orange-500/10' : 'bg-slate-900/50'}
              >
                <td className="border-b border-slate-800 px-4 py-3 text-sm font-bold text-slate-200">{row.label}</td>
                {result.endKeys.map((key) => (
                  <td key={key} className="border-b border-slate-800 px-4 py-3 text-sm text-slate-300">
                    {fmt(row.values[key], 3)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function FinalMomentsTable({ result }) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
      <h2 className="text-2xl font-black text-white">Final End Moments</h2>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-800">
        <table className="w-full min-w-[750px] border-collapse text-left">
          <thead className="bg-slate-950">
            <tr>
              <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">Span</th>
              <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">Left End</th>
              <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">Moment</th>
              <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">Right End</th>
              <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">Moment</th>
            </tr>
          </thead>

          <tbody>
            {result.finalMoments.map((row) => (
              <tr key={row.span} className="bg-slate-900/50">
                <td className="border-b border-slate-800 px-4 py-3 text-sm font-bold text-slate-200">{row.span}</td>
                <td className="border-b border-slate-800 px-4 py-3 text-sm text-orange-300">{row.leftKey}</td>
                <td className="border-b border-slate-800 px-4 py-3 text-sm text-slate-300">{fmt(row.left, 3)} kN·m</td>
                <td className="border-b border-slate-800 px-4 py-3 text-sm text-orange-300">{row.rightKey}</td>
                <td className="border-b border-slate-800 px-4 py-3 text-sm text-slate-300">{fmt(row.right, 3)} kN·m</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function ReactionTable({ result }) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
      <h2 className="text-2xl font-black text-white">Support Reactions</h2>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-800">
        <table className="w-full min-w-[780px] border-collapse text-left">
          <thead className="bg-slate-950">
            <tr>
              <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">Joint</th>
              <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">x</th>
              <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">Type</th>
              <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">Vertical Reaction</th>
              <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">Moment Reaction</th>
            </tr>
          </thead>

          <tbody>
            {result.supportReactions.map((row) => (
              <tr key={row.joint} className="bg-slate-900/50">
                <td className="border-b border-slate-800 px-4 py-3 text-sm font-bold text-slate-200">{row.joint}</td>
                <td className="border-b border-slate-800 px-4 py-3 text-sm text-orange-300">{fmt(row.x, 3)} m</td>
                <td className="border-b border-slate-800 px-4 py-3 text-sm text-slate-300">{row.type}</td>
                <td className="border-b border-slate-800 px-4 py-3 text-sm text-slate-300">{fmt(row.vertical, 3)} kN</td>
                <td className="border-b border-slate-800 px-4 py-3 text-sm text-slate-300">{fmt(row.moment, 3)} kN·m</td>
              </tr>
            ))}
          </tbody>
        </table>
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

export default function MomentDistributionPage() {
  const defaults = getTemplateDefaults('twoSpan')

  const [form, setForm] = useState({
    reportTitle: 'Moment Distribution Analysis',
    preparedBy: '',
    ...defaults,
    iterations: 8,
    tolerance: 0.0001,
  })

  const result = useMemo(() => solveMomentDistribution(form), [form])

  const updateForm = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const applyTemplate = (template) => {
    const defaults = getTemplateDefaults(template)

    setForm((prev) => ({
      ...prev,
      ...defaults,
    }))
  }

  const updateSpanCount = (value) => {
    setForm((prev) => ({
      ...prev,
      template: 'custom',
      spanCount: Number(value),
    }))
  }

  const updateSpan = (index, key, value) => {
    setForm((prev) => ({
      ...prev,
      template: prev.template === 'custom' ? 'custom' : prev.template,
      spans: prev.spans.map((span, i) =>
        i === index
          ? {
              ...span,
              [key]: value,
            }
          : span
      ),
    }))
  }

  const resetExample = () => {
    const defaults = getTemplateDefaults('twoSpan')

    setForm({
      reportTitle: 'Moment Distribution Analysis',
      preparedBy: '',
      ...defaults,
      iterations: 8,
      tolerance: 0.0001,
    })
  }

  return (
    <main className="min-h-screen bg-[#050B1F] px-4 py-8 text-white md:px-8">
      <section className="mx-auto max-w-7xl">
        <div className="mb-8 rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 md:p-8">
          <p className="mb-3 text-sm font-extrabold uppercase tracking-widest text-orange-400">
            Structural Analysis Continuous Beam Solver
          </p>

          <h1 className="text-3xl font-black leading-tight md:text-5xl">
            Moment Distribution Solver
          </h1>

          <p className="mt-4 max-w-4xl text-base leading-8 text-slate-300 md:text-lg">
            Calculate fixed end moments, stiffness, distribution factors, carry-over moments, final end moments,
            support reactions, SFD and BMD for fixed and continuous beams.
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
                  placeholder="Example: Two Span Continuous Beam"
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
                  <option value="fixed">Fixed Beam</option>
                  <option value="twoSpan">Two-Span Continuous Beam</option>
                  <option value="threeSpan">Three-Span Continuous Beam</option>
                  <option value="fourSpan">Four-Span Continuous Beam</option>
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

                <div className="grid gap-4 sm:grid-cols-2">
                  <SelectField
                    label="Left End"
                    value={form.leftEnd}
                    onChange={(value) => updateForm('leftEnd', value)}
                  >
                    <option value="pin">Pin / Roller</option>
                    <option value="fixed">Fixed</option>
                  </SelectField>

                  <SelectField
                    label="Right End"
                    value={form.rightEnd}
                    onChange={(value) => updateForm('rightEnd', value)}
                  >
                    <option value="pin">Pin / Roller</option>
                    <option value="fixed">Fixed</option>
                  </SelectField>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <NumberField
                    label="Iterations"
                    value={form.iterations}
                    onChange={(value) => updateForm('iterations', value)}
                    suffix="cycles"
                    min="1"
                  />

                  <NumberField
                    label="Tolerance"
                    value={form.tolerance}
                    onChange={(value) => updateForm('tolerance', value)}
                    suffix=""
                    min="0.000001"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={resetExample}
                className="mt-6 w-full rounded-xl border border-slate-700 px-5 py-3 font-bold text-slate-200 transition hover:border-orange-400 hover:text-orange-300"
              >
                Reset Example
              </button>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
              <h2 className="text-2xl font-black text-white">Span & Load Setup</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Add UDL and point load span-wise. Point load position is measured from left joint of that span.
              </p>

              <div className="mt-6 space-y-5">
                {form.spans.slice(0, form.spanCount).map((span, index) => (
                  <SpanEditor key={index} span={span} index={index} onChange={updateSpan} />
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
              <h2 className="text-xl font-black text-white">What This Tool Covers</h2>

              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
                <li>✓ Fixed end moments</li>
                <li>✓ UDL and point load per span</li>
                <li>✓ Fixed beam</li>
                <li>✓ Two/three/four-span continuous beam</li>
                <li>✓ Different EI per span</li>
                <li>✓ Distribution factors</li>
                <li>✓ Carry-over moments</li>
                <li>✓ Moment distribution table</li>
                <li>✓ Final end moments</li>
                <li>✓ Support reactions</li>
                <li>✓ SFD and BMD</li>
                <li>✓ Copy / Print / Save PDF</li>
              </ul>
            </div>
          </aside>

          <section className="space-y-6">
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
            <MethodPanel />
            <BeamDiagram result={result} />

            <div className="grid gap-6 xl:grid-cols-2">
              <CurveDiagram result={result} type="sfd" />
              <CurveDiagram result={result} type="bmd" />
            </div>

            <FixedEndMomentTable result={result} />
            <DistributionFactorTable result={result} />
            <MomentDistributionTable result={result} />
            <FinalMomentsTable result={result} />
            <ReactionTable result={result} />
            <FormulaAndFinal result={result} />
            <StepByStep result={result} />
          </section>
        </div>
      </section>
    </main>
  )
}
