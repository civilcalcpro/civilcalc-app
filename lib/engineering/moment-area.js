// Moment Area Method Engine
// Units:
// span: m
// loads: kN, kN/m
// E: N/mm²
// I: mm⁴
// Output deflection: mm, slope: rad

export function momentAreaAnalysis({
  span = 6,
  E = 200000,
  I = 300000000,
  pointLoads = [],
  udls = [],
}) {
  const L = Number(span) || 1
  const EVal = Number(E) || 200000
  const IVal = Number(I) || 300000000

  const n = 200
  const dx = L / n

  const points = []

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
    const end = Number(load.end) || L
    const length = Math.max(end - start, 0)
    const W = w * length
    const centroid = start + length / 2

    totalLoad += W
    momentAboutA += W * centroid
  })

  const RB = momentAboutA / L
  const RA = totalLoad - RB

  for (let i = 0; i <= n; i++) {
    const x = i * dx
    let M = RA * x

    pointLoads.forEach((load) => {
      const P = Number(load.P) || 0
      const a = Number(load.x) || 0

      if (x >= a) {
        M -= P * (x - a)
      }
    })

    udls.forEach((load) => {
      const w = Number(load.w) || 0
      const start = Number(load.start) || 0
      const end = Number(load.end) || L

      if (x > start) {
        const loadedLength = Math.min(x, end) - start

        if (loadedLength > 0) {
          M -= w * loadedLength * (x - (start + loadedLength / 2))
        }
      }
    })

    const M_Nmm = M * 1000000
    const curvature = M_Nmm / (EVal * IVal)

    points.push({
      x,
      M,
      curvature,
    })
  }

  let areaMEI = 0
  let firstMomentMEI = 0

  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1]
    const curr = points[i]

    const avgCurvature = (prev.curvature + curr.curvature) / 2
    const segmentLengthMm = dx * 1000

    const segmentArea = avgCurvature * segmentLengthMm
    const centroidX = ((prev.x + curr.x) / 2) * 1000

    areaMEI += segmentArea
    firstMomentMEI += segmentArea * centroidX
  }

  const slopeDifference = areaMEI
  const tangentialDeviationBfromA = firstMomentMEI

  const deflectionPoints = []
  let slope = 0
  let deflection = 0

  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1]
    const curr = points[i]
    const segmentLengthMm = dx * 1000
    const avgCurvature = (prev.curvature + curr.curvature) / 2

    slope += avgCurvature * segmentLengthMm
    deflection += slope * segmentLengthMm

    deflectionPoints.push({
      x: curr.x,
      slope,
      deflection,
    })
  }

  const maxDeflectionPoint = deflectionPoints.reduce(
    (max, point) =>
      Math.abs(point.deflection) > Math.abs(max.deflection)
        ? point
        : max,
    { x: 0, slope: 0, deflection: 0 }
  )

  const maxMomentPoint = points.reduce((max, point) =>
    Math.abs(point.M) > Math.abs(max.M) ? point : max
  )

  return {
    reactions: {
      RA: round(RA),
      RB: round(RB),
    },
    summary: {
      totalLoad: round(totalLoad),
      maxMoment: round(maxMomentPoint.M),
      maxMomentLocation: round(maxMomentPoint.x),
      slopeDifference: round(slopeDifference, 6),
      tangentialDeviation: round(tangentialDeviationBfromA),
      maxDeflection: round(maxDeflectionPoint.deflection),
      maxDeflectionLocation: round(maxDeflectionPoint.x),
    },
    points,
    deflectionPoints,
    formulas: {
      theorem1: 'Change in slope = Area of M/EI diagram',
      theorem2:
        'Tangential deviation = First moment of area of M/EI diagram',
      curvature: 'Curvature = M / EI',
      deflection: 'Deflection is obtained by integrating slope',
    },
    steps: [
      'Calculate support reactions using equilibrium equations.',
      'Generate bending moment M at small intervals along the beam.',
      'Convert bending moment diagram into M/EI diagram.',
      'Apply Moment Area Theorem 1: change in slope equals area of M/EI diagram.',
      'Apply Moment Area Theorem 2: tangential deviation equals first moment of M/EI area.',
      'Numerically integrate curvature to estimate slope and deflection.',
      'Identify maximum deflection and its location.',
    ],
    note:
      'Moment Area Method results are approximate numerical values for educational and preliminary design use.',
  }
}

function round(value, digits = 3) {
  const num = Number(value)
  if (!Number.isFinite(num)) return 0
  return Number(num.toFixed(digits))
}
