// Column Buckling Analysis
// CivilCalc Pro

export function columnBuckling({
  length,
  E,
  I,
  area,
  endCondition,
  crushingStress = 0,
  rankineConstant = 1 / 7500,
}) {
  const L = Number(length) || 1
  const Eval = Number(E) || 200000
  const Ival = Number(I) || 1
  const Aval = Number(area) || 1

  const kFactors = {
    pinnedPinned: 1.0,
    fixedFixed: 0.5,
    fixedFree: 2.0,
    fixedPinned: 0.7,
  }

  const K = kFactors[endCondition] || 1.0
  const Le = K * L * 1000

  const radiusOfGyration = Math.sqrt(Ival / Aval)
  const slendernessRatio = Le / radiusOfGyration

  const eulerLoadN =
    (Math.PI * Math.PI * Eval * Ival) / (Le * Le)

  const eulerLoadKN = eulerLoadN / 1000

  const crushingLoadN =
    Number(crushingStress) > 0
      ? Number(crushingStress) * Aval
      : 0

  const rankineLoadN =
    crushingLoadN > 0
      ? crushingLoadN /
        (1 + rankineConstant * slendernessRatio * slendernessRatio)
      : 0

  const rankineLoadKN = rankineLoadN / 1000

  return {
    effectiveLengthFactor: K.toFixed(2),
    effectiveLength: (Le / 1000).toFixed(2),
    radiusOfGyration: radiusOfGyration.toFixed(2),
    slendernessRatio: slendernessRatio.toFixed(2),
    eulerLoad: eulerLoadKN.toFixed(2),
    rankineLoad: rankineLoadKN > 0 ? rankineLoadKN.toFixed(2) : 'Not calculated',
    columnType:
      slendernessRatio > 80
        ? 'Long Column'
        : slendernessRatio > 32
        ? 'Intermediate Column'
        : 'Short Column',
    formulas: {
      effectiveLength: 'Le = K × L',
      radiusOfGyration: 'r = √(I / A)',
      slendernessRatio: 'λ = Le / r',
      eulerLoad: 'Pcr = π²EI / Le²',
      rankineLoad: 'P = Pc / [1 + α(Le/r)²]',
    },
  }
}
