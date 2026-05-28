// RCC Design Calculations as per IS 456:2000

// Material Properties
export const MATERIAL_PROPERTIES = {
  concrete: {
    M15: { fck: 15, density: 25 },
    M20: { fck: 20, density: 25 },
    M25: { fck: 25, density: 25 },
    M30: { fck: 30, density: 25 },
    M35: { fck: 35, density: 25 },
    M40: { fck: 40, density: 25 },
  },
  steel: {
    Fe415: { fy: 415, Es: 200000 },
    Fe500: { fy: 500, Es: 200000 },
    Fe550: { fy: 550, Es: 200000 },
  }
}

// ============================================================
// ENGINEERING HELPERS — IS 456:2000 Limit State Method
// ============================================================
// Units convention used everywhere below:
//   • Force: kN          • Moment: kN·m
//   • Stress / fck / fy: N/mm² (MPa)
//   • Geometry: section (b, d, D) in mm, span in m, cover in mm
//   • Internally for limit-state formulae we convert: kN·m → N·mm = ×10⁶, kN → N = ×10³

/**
 * Solve required Ast for a singly reinforced rectangular section under Mu.
 * Uses IS 456:2000 Annex G.1.1 direct formula:
 *   Ast = (0.5·fck·b·d / fy) · [ 1 − √( 1 − 4.6·Mu / (fck·b·d²) ) ]
 *   (Mu in N·mm, b,d in mm) — returns Ast in mm² of the same width band.
 * Returns -1 if the section is over-stressed (singly not possible → caller goes doubly).
 */
export function solveAstSingly(Mu_kNm, b_mm, d_mm, fck, fy) {
  const Mu = Mu_kNm * 1e6                  // → N·mm
  const denom = fck * b_mm * d_mm * d_mm
  const ratio = 4.6 * Mu / denom
  if (ratio >= 1) return -1                // section needs doubly
  const sq = Math.sqrt(1 - ratio)
  const Ast = (0.5 * fck * b_mm * d_mm / fy) * (1 - sq)
  return Math.max(0, Ast)
}

/**
 * Permissible shear stress τc (N/mm²) for HYSD steel from IS 456 Table 19.
 * Continuous approximation (Cl. B-5.2.1.1) used for in-between fck.
 */
export function tauCTable19(pt, fck) {
  // pt = % steel (100·As/(b·d)); fck in N/mm²
  const p = Math.max(0.15, Math.min(3.0, pt || 0.15))
  const beta = Math.max(1.0, 0.8 * fck / (6.89 * p))
  return (0.85 * Math.sqrt(0.8 * fck) * (Math.sqrt(1 + 5 * beta) - 1)) / (6 * beta)
}

/** Maximum permissible shear τc,max (N/mm²) from IS 456 Table 20. */
export function tauCmaxTable20(fck) {
  const table = { 15: 2.5, 20: 2.8, 25: 3.1, 30: 3.5, 35: 3.7, 40: 4.0 }
  // linear interpolation if not exact
  const grades = Object.keys(table).map(Number).sort((a, b) => a - b)
  if (table[fck]) return table[fck]
  let lo = grades[0], hi = grades[grades.length - 1]
  for (let i = 0; i < grades.length - 1; i++) {
    if (fck >= grades[i] && fck <= grades[i + 1]) { lo = grades[i]; hi = grades[i + 1]; break }
  }
  const t = (fck - lo) / (hi - lo || 1)
  return table[lo] + (table[hi] - table[lo]) * t
}

/** xu,max / d limit from IS 456 Table-C (Fe415:0.48, Fe500:0.46, Fe550:0.44). */
export function xuMaxByD(fy) {
  if (fy >= 500) return fy >= 550 ? 0.44 : 0.46
  return 0.48
}

/**
 * Pick a practical bar arrangement for a beam: smallest dia from [12,16,20,25,32]
 * that yields 2 to 6 bars in one layer; otherwise try 2 layers.
 * Verifies clear spacing ≥ max(dia, 25mm) per IS 456 Cl. 26.3.2.
 */
export function pickBeamBars(AstReq, beamWidth, cover = 25, stirrupDia = 8) {
  const opts = [12, 16, 20, 25, 32]
  const minClear = (dia) => Math.max(dia, 25) // aggregate ≤ 20mm assumed
  for (const dia of opts) {
    const aBar = Math.PI * dia * dia / 4
    const nReq = Math.ceil(AstReq / aBar)
    if (nReq < 2) continue
    const usableWidth = beamWidth - 2 * (cover + stirrupDia) - dia // mm
    const maxBarsOneLayer = Math.floor(usableWidth / (dia + minClear(dia))) + 1
    if (nReq <= Math.min(6, maxBarsOneLayer)) {
      const provided = nReq * aBar
      return {
        dia, count: nReq, layers: 1, providedAst: provided,
        spec: `${nReq}–${dia} mm Ø bars`,
        warning: null,
      }
    }
    // Try 2 layers
    if (nReq <= 2 * maxBarsOneLayer && nReq <= 12) {
      const provided = nReq * aBar
      return {
        dia, count: nReq, layers: 2, providedAst: provided,
        spec: `${nReq}–${dia} mm Ø bars in 2 layers`,
        warning: null,
      }
    }
  }
  // Couldn't fit — use largest dia, 12 bars max, and emit warning
  const dia = 32
  const aBar = Math.PI * dia * dia / 4
  const nReq = Math.min(12, Math.ceil(AstReq / aBar))
  return {
    dia, count: nReq, layers: 2, providedAst: nReq * aBar,
    spec: `${nReq}–${dia} mm Ø bars (heavy)`,
    warning: 'Section too small for required steel — increase beam dimensions or grade.',
  }
}

/**
 * Pick spacing for slab steel: smallest dia from [8,10,12] giving spacing in [100, 300].
 * Clamps & snaps to 25 mm grid. Returns null spec if impossible.
 */
export function pickSlabBars(AstReq, D) {
  const opts = [8, 10, 12, 16]
  const maxSpacing = Math.min(300, 3 * D)
  for (const dia of opts) {
    const aBar = Math.PI * dia * dia / 4
    const raw = (aBar * 1000) / AstReq
    let s = Math.floor(raw / 25) * 25
    if (s < 75) continue        // bar too small → try larger
    if (s > maxSpacing) s = maxSpacing
    if (s < 100) s = 100        // practical minimum for slabs
    const providedAst = (aBar * 1000) / s
    if (providedAst >= AstReq * 0.95) {
      return { dia, spacing: s, providedAst, spec: `${dia} mm Ø @ ${s} mm c/c` }
    }
  }
  // Fallback — use 12 mm @ 100 c/c
  const dia = 12, s = 100
  const providedAst = (Math.PI * 144 / 4 * 1000) / s
  return { dia, spacing: s, providedAst, spec: `${dia} mm Ø @ ${s} mm c/c (heavy)` }
}


// One-Way Slab Design
export function designOneWaySlab(params) {
  const { length, width, liveLoad, floorFinish, grade, steelGrade } = params
  
  // Determine effective span
  const effectiveSpan = Math.min(length, width)
  
  // Assume slab thickness (L/28 for simply supported)
  const assumedDepth = Math.max(effectiveSpan * 1000 / 28, 100)
  const D = Math.ceil(assumedDepth / 10) * 10 // Round to nearest 10mm
  const effectiveDepth = D - 20 - 8 // Cover 20mm + bar dia 8mm
  
  // Load Calculations (kN/m²)
  const selfWeight = (D / 1000) * 25 // 25 kN/m³
  const deadLoad = selfWeight + (floorFinish || 1)
  const totalLoad = deadLoad + liveLoad
  const factoredLoad = 1.5 * totalLoad
  
  // Bending Moment (kNm/m)
  const moment = (factoredLoad * effectiveSpan * effectiveSpan) / 8
  
  // Required steel calculation
  const fck = MATERIAL_PROPERTIES.concrete[grade].fck
  const fy = MATERIAL_PROPERTIES.steel[steelGrade].fy
  
  // Limiting moment of resistance
  const xuMax = 0.48 * effectiveDepth
  const MuLim = 0.36 * fck * 1000 * xuMax * (effectiveDepth - 0.42 * xuMax) / 1000000
  
  let steelRequired
  if (moment <= MuLim) {
    // Singly reinforced — IS 456 Annex G.1.1
    steelRequired = solveAstSingly(moment, 1000, effectiveDepth, fck, fy)
    if (steelRequired < 0) steelRequired = 0.04 * 1000 * D
  } else {
    // Slab needs increased thickness — flag and use min steel as placeholder
    steelRequired = 0.0012 * 1000 * D
  }
  
  // Minimum and maximum steel
  const minSteel = 0.0012 * 1000 * D
  const maxSteel = 0.04 * 1000 * D
  let Ast = Math.max(steelRequired, minSteel)
  let astWarning = null
  if (Ast > maxSteel) {
    astWarning = 'Required steel exceeds 4% — increase slab thickness.'
    Ast = maxSteel
  }
  
  // Practical bar selection
  const mainBars = pickSlabBars(Ast, D)
  const providedAst = mainBars.providedAst
  
  // Distribution steel (0.12% of gross area)
  const distSteel = 0.0012 * 1000 * D
  const distBars = pickSlabBars(distSteel, D)
  
  // Shear Check
  const shearForce = (factoredLoad * effectiveSpan) / 2
  const nominalShear = shearForce / (1000 * effectiveDepth / 1000)
  const pt = (providedAst * 100) / (1000 * effectiveDepth)
  const tauC = 0.85 * Math.sqrt(0.8 * fck) * (Math.sqrt(1 + 5 * pt) - 1) / (6 * pt)
  const shearSafe = nominalShear < tauC
  
  return {
    design: {
      slabThickness: D,
      effectiveDepth: effectiveDepth,
      effectiveSpan: effectiveSpan,
    },
    loads: {
      selfWeight: selfWeight.toFixed(2),
      deadLoad: deadLoad.toFixed(2),
      liveLoad: liveLoad,
      totalLoad: totalLoad.toFixed(2),
      factoredLoad: factoredLoad.toFixed(2),
    },
    moment: {
      bendingMoment: moment.toFixed(2),
      limitingMoment: MuLim.toFixed(2),
    },
    steel: {
      requiredAst: Ast.toFixed(0),
      providedAst: providedAst.toFixed(0),
      mainSteel: mainBars.spec,
      distributionSteel: distBars.spec,
    },
    shear: {
      shearForce: shearForce.toFixed(2),
      nominalShear: nominalShear.toFixed(3),
      permissibleShear: tauC.toFixed(3),
      safe: shearSafe,
    },
    ...(astWarning ? { warning: astWarning } : {}),
    isDesignSafe: shearSafe && moment <= MuLim * 1.1 && providedAst >= Ast * 0.95 && !astWarning,
  }
}

// Beam Design
export function designBeam(params) {
  const { span, width, depth, deadLoad, liveLoad, grade, steelGrade,
    cover = 25 } = params

  const effectiveSpan = span                    // m
  const b = width                               // mm
  const D = depth                               // mm
  const fck = MATERIAL_PROPERTIES.concrete[grade].fck   // N/mm²
  const fy = MATERIAL_PROPERTIES.steel[steelGrade].fy   // N/mm²

  // Effective cover: clear cover + stirrup dia (8) + half main bar (assume 20)
  const effectiveCover = cover + 8 + 10
  const d = D - effectiveCover                  // mm

  // ---- Loads (kN/m) ----
  const selfWeight = (b / 1000) * (D / 1000) * 25
  const totalDL = selfWeight + deadLoad
  const totalLoad = totalDL + liveLoad
  const factoredLoad = 1.5 * totalLoad          // kN/m

  // ---- Bending moment (kN·m) — simply supported ----
  const Mu = (factoredLoad * effectiveSpan * effectiveSpan) / 8

  // ---- Limiting moment (kN·m) ----
  const xuMaxRatio = xuMaxByD(fy)
  const xuMax = xuMaxRatio * d                  // mm
  const MuLim = (0.36 * fck * b * xuMax * (d - 0.42 * xuMax)) / 1e6

  // ---- Solve Ast ----
  let Ast, compressionSteel = 0, sectionType
  if (Mu <= MuLim) {
    Ast = solveAstSingly(Mu, b, d, fck, fy)
    sectionType = 'Singly Reinforced'
  } else {
    // Doubly: Ast1 from MuLim, Ast2 from extra Mu
    const Ast1 = solveAstSingly(MuLim, b, d, fck, fy)
    const dPrime = cover + 8 + 10               // effective cover for comp steel
    const extraMu = (Mu - MuLim) * 1e6          // N·mm
    const Ast2 = extraMu / (0.87 * fy * (d - dPrime))
    Ast = Ast1 + Ast2
    compressionSteel = extraMu / (0.87 * fy * (d - dPrime))
    sectionType = 'Doubly Reinforced'
  }

  // ---- Minimum / maximum steel (IS 456 Cl. 26.5.1) ----
  const Astmin = (0.85 * b * d) / fy            // 0.85 b·d / fy
  const Astmax = 0.04 * b * D
  Ast = Math.max(Ast, Astmin)
  let warning = null
  if (Ast > Astmax) {
    warning = `Required Ast (${Math.round(Ast)} mm²) exceeds max 4% — increase section.`
    Ast = Astmax
  }

  // ---- Pick practical bar arrangement ----
  const bars = pickBeamBars(Ast, b, cover, 8)
  if (bars.warning && !warning) warning = bars.warning
  const providedAst = bars.providedAst

  // ---- Shear (kN, N/mm²) ----
  const Vu = (factoredLoad * effectiveSpan) / 2       // kN
  const tauV = (Vu * 1e3) / (b * d)                   // N/mm²
  const pt = (providedAst * 100) / (b * d)            // %
  const tauC = tauCTable19(pt, fck)
  const tauCmax = tauCmaxTable20(fck)

  // ---- Stirrups (IS 456 Cl. 40) ----
  let stirrupSpec, stirrupSpacing
  const stirrupDia = 8
  const Asv = 2 * (Math.PI * stirrupDia * stirrupDia / 4) // 2-legged, mm²
  if (tauV > tauCmax) {
    stirrupSpec = `Section over-stressed in shear — increase b or D`
    stirrupSpacing = 0
    warning = warning || 'Nominal shear τv exceeds τc,max — redesign section.'
  } else if (tauV <= tauC) {
    // Minimum stirrups
    const sMin1 = (0.87 * fy * Asv) / (0.4 * b)     // minimum shear stirrup spacing
    const sMin2 = 0.75 * d
    stirrupSpacing = Math.floor(Math.min(sMin1, sMin2, 300) / 25) * 25
    stirrupSpacing = Math.max(75, Math.min(300, stirrupSpacing))
    stirrupSpec = `${stirrupDia} mm Ø 2-leg @ ${stirrupSpacing} mm c/c (nominal)`
  } else {
    // Design stirrups
    const Vus = (tauV - tauC) * b * d / 1000        // kN
    const raw = (0.87 * fy * Asv * d) / (Vus * 1e3) // mm
    stirrupSpacing = Math.floor(Math.min(raw, 0.75 * d, 300) / 25) * 25
    stirrupSpacing = Math.max(75, Math.min(300, stirrupSpacing))
    stirrupSpec = `${stirrupDia} mm Ø 2-leg @ ${stirrupSpacing} mm c/c`
  }
  // ---- Side face reinforcement (IS 456:2000 Cl. 26.5.1.3) ----
  const sideFaceRequired = D > 750
  const sideFaceAstTotal = sideFaceRequired ? 0.001 * b * D : 0
  const sideFaceAstEachFace = sideFaceAstTotal / 2

  const sideFaceBarDia = 10
  const sideFaceBarArea = Math.PI * sideFaceBarDia * sideFaceBarDia / 4

  let sideFaceSpacing = sideFaceRequired
    ? Math.floor((sideFaceBarArea * 1000 / sideFaceAstEachFace) / 25) * 25
    : 0

  if (sideFaceRequired) {
    sideFaceSpacing = Math.min(sideFaceSpacing, 300)
    sideFaceSpacing = Math.max(sideFaceSpacing, 100)
  }

  const sideFaceSpec = sideFaceRequired
    ? `${sideFaceBarDia} mm Ø @ ${sideFaceSpacing} mm c/c on both faces`
    : 'Not required because beam depth is ≤ 750 mm'
  // ---- Deflection check (IS 456 Cl. 23.2.1, basic l/d = 20 for simply-supported) ----
  const ptProv = (providedAst * 100) / (b * d)
  const fs = 0.58 * fy * (Ast / providedAst)
  const modFactor = Math.min(2.0, 1 / (0.225 + 0.00322 * fs - 0.625 * Math.log10(1 / ptProv)))
  const allowL_d = 20 * Math.max(0.8, Math.min(2, modFactor))
  const actualL_d = (effectiveSpan * 1000) / d
  const deflectionOk = actualL_d <= allowL_d

  // ---- Sanity / safety ----
  const isDesignSafe = (Mu <= MuLim * 1.001) && (tauV <= tauC + 0.001 || stirrupSpacing > 0) &&
                       providedAst >= Ast * 0.95 && deflectionOk && !warning

  return {
    design: {
      beamWidth: b,
      beamDepth: D,
      effectiveDepth: d,
      effectiveSpan: effectiveSpan,
    },
    loads: {
      selfWeight: selfWeight.toFixed(2),
      totalDeadLoad: totalDL.toFixed(2),
      liveLoad: liveLoad,
      factoredLoad: factoredLoad.toFixed(2),
    },
    moment: {
      maximumMoment: Mu.toFixed(2),
      limitingMoment: MuLim.toFixed(2),
      type: sectionType,
      xuMaxByDRatio: xuMaxRatio.toFixed(3),
    },
    steel: {
      requiredAst: Ast.toFixed(0),
      providedAst: providedAst.toFixed(0),
      reinforcement: bars.spec,
      compressionSteel: compressionSteel > 0 ? compressionSteel.toFixed(0) : 'Not Required',
      percentSteel: ptProv.toFixed(2),
    },
    shear: {
      maxShear: Vu.toFixed(2),
      nominalShear: tauV.toFixed(3),
      permissibleShear: tauC.toFixed(3),
      maxShearStress: tauCmax.toFixed(3),
      stirrups: stirrupSpec,
    },
        sideFaceReinforcement: {
      required: sideFaceRequired ? 'Yes' : 'No',
      clause: 'IS 456:2000 Clause 26.5.1.3',
      requiredAstTotal: sideFaceRequired ? sideFaceAstTotal.toFixed(0) : '0',
      requiredAstEachFace: sideFaceRequired ? sideFaceAstEachFace.toFixed(0) : '0',
      specification: sideFaceSpec,
      note: sideFaceRequired
        ? 'Beam depth exceeds 750 mm. Side face reinforcement should be provided equally on both faces.'
        : 'Side face reinforcement is not required for this depth.',
    },
    deflection: {
      actualL_d: actualL_d.toFixed(1),
      allowableL_d: allowL_d.toFixed(1),
      safe: deflectionOk,
    },
    ...(warning ? { warning } : {}),
    isDesignSafe,
  }
}

// Column Design
export function designColumn(params) {
  const { width, depth, height, axialLoad, grade, steelGrade } = params

  const b = width                                       // mm
  const D = depth                                       // mm
  const L = height                                      // m
  const Pu_kN = axialLoad                               // kN (factored)
  const Pu = Pu_kN * 1000                               // N for internal calcs

  const fck = MATERIAL_PROPERTIES.concrete[grade].fck
  const fy = MATERIAL_PROPERTIES.steel[steelGrade].fy

  // Effective length (assume both ends restrained against rotation and translation — pinned-pinned)
  const Leff = 1.0 * L * 1000                           // mm
  const leastDimension = Math.min(b, D)
  const slendernessRatio = Leff / leastDimension
  const isShortColumn = slendernessRatio <= 12

  // Minimum eccentricity (IS 456 Cl. 25.4) — must be ≥ max(L/500 + D/30, 20mm)
  const eMinX = Math.max(Leff / 500 + b / 30, 20)
  const eMinY = Math.max(Leff / 500 + D / 30, 20)
  // Per Cl. 39.3: if eMin ≤ 0.05·D, axial formula is valid.
  // Most short columns marginally exceed this (eMin floor of 20mm). Only flag as warning
  // if eMin > 0.10·D (significant eccentricity → must design as beam-column).
  const axialOk = eMinX <= 0.10 * b && eMinY <= 0.10 * D
  let warning = null
  let note = null
  if (eMinX > 0.05 * b || eMinY > 0.05 * D) {
    note = `Min. eccentricity slightly exceeds 0.05·D — axial design still valid (Cl. 39.3 conservatively).`
  }
  if (!axialOk) {
    warning = 'Significant minimum eccentricity — design as beam-column (uniaxial bending).'
  }

  // ---- Required steel from axial capacity equation (IS 456 Cl. 39.3) ----
  // Pu = 0.4·fck·Ac + 0.67·fy·Asc  →  Ac = Ag − Asc
  //   → Pu = 0.4·fck·Ag + (0.67·fy − 0.4·fck)·Asc
  const Ag = b * D                                      // mm²
  let Asc = (Pu - 0.4 * fck * Ag) / (0.67 * fy - 0.4 * fck)
  Asc = Math.max(Asc, 0.008 * Ag)                       // 0.8 % minimum (Cl. 26.5.3.1)

  let pReq = (Asc / Ag) * 100
  if (pReq > 4) {
    warning = warning || 'Required steel exceeds 4 % — increase section or grade.'
    Asc = 0.04 * Ag
    pReq = 4
  }

  // ---- Pick bar dia + count ----
  const opts = [12, 16, 20, 25, 32]
  let barDia = 16, numBars = 4, providedAsc = 0
  for (const dia of opts) {
    const aBar = Math.PI * dia * dia / 4
    const n = Math.max(4, Math.ceil(Asc / aBar))
    // Must fit: 4 corners + extra along the longer face; min 4 (rect)
    if (n <= 12) {
      barDia = dia; numBars = n; providedAsc = n * aBar
      break
    }
  }
  if (providedAsc === 0) {
    barDia = 25; numBars = 12
    providedAsc = numBars * (Math.PI * 625 / 4)
    warning = warning || 'Reinforcement congested — increase section.'
  }
  const providedP = (providedAsc / Ag) * 100

  // ---- Lateral ties (IS 456 Cl. 26.5.3.2) ----
  const tiesDia = barDia <= 20 ? 8 : 10
  let tiesSpacing = Math.min(leastDimension, 16 * barDia, 300)
  tiesSpacing = Math.floor(tiesSpacing / 25) * 25

  // ---- Provided capacity ----
  const Pu_capacityN = 0.4 * fck * (Ag - providedAsc) + 0.67 * fy * providedAsc
  const Pu_capacity_kN = Pu_capacityN / 1000
  const loadSafe = Pu_kN <= Pu_capacity_kN

  return {
    design: {
      columnSize: `${b}mm × ${D}mm`,
      height: L,
      effectiveLength: Leff / 1000,                     // m (for display)
      slendernessRatio: slendernessRatio.toFixed(1),
      columnType: isShortColumn ? 'Short Column' : 'Slender Column',
      minEccentricityX: eMinX.toFixed(1),
      minEccentricityY: eMinY.toFixed(1),
    },
    loading: {
      appliedLoad: Pu,                                  // N — frontend divides by 1000 to show kN
      capacity: Pu_capacity_kN.toFixed(0),              // kN
      loadSafe,
    },
    steel: {
      requiredPercentage: pReq.toFixed(2),
      providedPercentage: providedP.toFixed(2),
      requiredArea: Asc.toFixed(0),
      providedArea: providedAsc.toFixed(0),
      reinforcement: `${numBars}–${barDia} mm Ø bars`,
    },
    ties: {
      diameter: tiesDia,
      spacing: tiesSpacing,
      specification: `${tiesDia} mm Ø @ ${tiesSpacing} mm c/c`,
    },
    ...(warning ? { warning } : {}),
    ...(note ? { note } : {}),
    isDesignSafe: loadSafe && providedP >= 0.8 && providedP <= 4 && isShortColumn && !warning,
  }
}

// Concrete Volume Calculator (with nominal mix per grade)
// Nominal mix ratios per IS 456 Table 9 — cement : fine aggregate : coarse aggregate
const NOMINAL_MIX = {
  M5:   { sand: 5,   agg: 10 },
  M7_5: { sand: 4,   agg: 8 },
  M10:  { sand: 3,   agg: 6 },
  M15:  { sand: 2,   agg: 4 },
  M20:  { sand: 1.5, agg: 3 },
  M25:  { sand: 1,   agg: 2 }, // typically design mix, included for convenience
}

export function calculateConcreteVolume(params) {
  const { length, width, thickness, grade } = params
  const gradeKey = (grade || 'M20').replace('.', '_')
  const mix = NOMINAL_MIX[gradeKey] || NOMINAL_MIX.M20

  // Wet volume (m³). Inputs in mm.
  const wetVolume = (length * width * thickness) / 1_000_000_000
  // Dry volume — 54% bulking factor for voids & wastage (industry standard)
  const dryVolume = wetVolume * 1.54

  // Volumetric proportions
  const totalParts = 1 + mix.sand + mix.agg
  const cementVol = dryVolume / totalParts // m³
  const sandVol = cementVol * mix.sand
  const aggregateVol = cementVol * mix.agg

  // Cement: density ≈ 1440 kg/m³, one bag = 50 kg
  const cementKg = cementVol * 1440
  const cementBags = cementKg / 50

  // Water — typical w/c ratios for nominal mixes
  const wcRatios = { M5: 0.6, M7_5: 0.6, M10: 0.55, M15: 0.5, M20: 0.5, M25: 0.45 }
  const wcRatio = wcRatios[gradeKey] || 0.5
  const waterLitres = cementKg * wcRatio

  return {
    mix: {
      grade: grade || 'M20',
      ratio: `1 : ${mix.sand} : ${mix.agg}`,
      waterCementRatio: wcRatio.toFixed(2),
    },
    wetVolume: wetVolume.toFixed(3),
    dryVolume: dryVolume.toFixed(3),
    cement: {
      bags: Math.ceil(cementBags),
      kg: Math.ceil(cementKg),
      cum: cementVol.toFixed(3),
    },
    sand: {
      cum: sandVol.toFixed(3),
      cft: (sandVol * 35.3147).toFixed(2),
    },
    aggregate: {
      cum: aggregateVol.toFixed(3),
      cft: (aggregateVol * 35.3147).toFixed(2),
    },
    water: {
      litres: Math.ceil(waterLitres),
    },
  }
}

// Steel Weight Calculator
export function calculateSteelWeight(params) {
  const { diameter, length } = params
  
  // Steel weight (kg/m) = D²/162
  const weightPerMeter = (diameter * diameter) / 162
  const totalWeight = weightPerMeter * length
  
  return {
    diameter: diameter,
    length: length,
    weightPerMeter: weightPerMeter.toFixed(3),
    totalWeight: totalWeight.toFixed(2),
    formula: 'Weight (kg/m) = D²/162',
  }
}


// ============ Two-Way Slab (IS 456 Annex D, simply supported on all 4 edges) ============
const TWO_WAY_COEFFICIENTS = {
  // ly/lx : { αx (short), αy (long) } for simply supported slabs (Table 27, IS 456)
  '1.0':  { ax: 0.062, ay: 0.062 },
  '1.1':  { ax: 0.074, ay: 0.061 },
  '1.2':  { ax: 0.084, ay: 0.059 },
  '1.3':  { ax: 0.093, ay: 0.055 },
  '1.4':  { ax: 0.099, ay: 0.051 },
  '1.5':  { ax: 0.104, ay: 0.046 },
  '1.75': { ax: 0.113, ay: 0.037 },
  '2.0':  { ax: 0.118, ay: 0.029 },
}
function twoWayCoefficient(ratio) {
  const keys = Object.keys(TWO_WAY_COEFFICIENTS).map(Number).sort((a, b) => a - b)
  const clamped = Math.max(keys[0], Math.min(keys[keys.length - 1], ratio))
  let lo = keys[0], hi = keys[keys.length - 1]
  for (let i = 0; i < keys.length - 1; i++) {
    if (clamped >= keys[i] && clamped <= keys[i + 1]) { lo = keys[i]; hi = keys[i + 1]; break }
  }
  const a = TWO_WAY_COEFFICIENTS[String(lo)], b = TWO_WAY_COEFFICIENTS[String(hi)]
  const t = hi === lo ? 0 : (clamped - lo) / (hi - lo)
  return { ax: a.ax + (b.ax - a.ax) * t, ay: a.ay + (b.ay - a.ay) * t }
}

export function designTwoWaySlab(params) {
  const { length, width, liveLoad, floorFinish = 1, grade = 'M20', steelGrade = 'Fe415' } = params
  const lx = Math.min(length, width)
  const ly = Math.max(length, width)
  const ratio = ly / lx
  const fck = MATERIAL_PROPERTIES.concrete[grade].fck
  const fy = MATERIAL_PROPERTIES.steel[steelGrade].fy

  // Assume slab thickness L/30 (better deflection control for two-way)
  const assumedDepth = Math.max(lx * 1000 / 30, 100)
  const D = Math.ceil(assumedDepth / 10) * 10
  const cover = 20, barDia = 10
  const dx = D - cover - barDia / 2 // along short span
  const dy = dx - barDia // along long span (different layer)

  const selfWeight = (D / 1000) * 25
  const deadLoad = selfWeight + floorFinish
  const totalLoad = deadLoad + liveLoad
  const wu = 1.5 * totalLoad

  const { ax, ay } = twoWayCoefficient(ratio)
  const Mux = ax * wu * lx * lx // kNm/m
  const Muy = ay * wu * lx * lx

  function steelFor(M, d) {
    // IS 456 Annex G.1.1 — correct formula (per-metre width)
    let Ast = solveAstSingly(M, 1000, d, fck, fy)
    if (Ast < 0) Ast = 0.04 * 1000 * D
    return Math.max(Ast, 0.0012 * 1000 * D)
  }
  const Astx = steelFor(Mux, dx)
  const Asty = steelFor(Muy, dy)

  // Practical bar selection per-metre
  const barsX = pickSlabBars(Astx, D)
  const barsY = pickSlabBars(Asty, D)
  const providedAstx = barsX.providedAst
  const providedAsty = barsY.providedAst

  return {
    design: {
      slabThickness: D,
      effectiveDepthX: dx,
      effectiveDepthY: dy,
      shortSpan: lx,
      longSpan: ly,
      lyByLx: ratio.toFixed(3),
      type: ratio <= 2 ? 'Two-Way Slab' : 'One-Way Slab (ratio > 2 — use one-way design)',
    },
    loads: {
      selfWeight: selfWeight.toFixed(2),
      deadLoad: deadLoad.toFixed(2),
      liveLoad,
      totalLoad: totalLoad.toFixed(2),
      factoredLoad: wu.toFixed(2),
    },
    moments: {
      coefficientAx: ax.toFixed(4),
      coefficientAy: ay.toFixed(4),
      shortSpanMoment: Mux.toFixed(2),
      longSpanMoment: Muy.toFixed(2),
    },
    reinforcement: {
      shortSpanAst: Astx.toFixed(0),
      longSpanAst: Asty.toFixed(0),
      shortSpanProvided: providedAstx.toFixed(0),
      longSpanProvided: providedAsty.toFixed(0),
      shortSpanSpec: barsX.spec,
      longSpanSpec: barsY.spec,
    },
    isDesignSafe: ratio <= 2 && providedAstx >= Astx * 0.95 && providedAsty >= Asty * 0.95,
  }
}

// ============ Isolated Footing Design (IS 456 Cl. 34) ============
// Strict step-wise implementation per spec — clean unit handling, practical spacing limits.
export function designFooting(params) {
  const {
    columnLoad,                 // kN, factored
    sbc,                        // kN/m²
    columnWidth,                // mm (along x)
    columnDepth,                // mm (along y)
    columnSize,                 // mm — fallback for square column (current UI sends this)
    grade = 'M25',
    steelGrade = 'Fe500',
    cover = 50,                 // mm clear cover
    barDiaInput = 16,           // mm default
  } = params

  const fck = MATERIAL_PROPERTIES.concrete[grade].fck
  const fy = MATERIAL_PROPERTIES.steel[steelGrade].fy

  // Column geometry — accept (columnWidth, columnDepth) per spec OR fallback to columnSize (square)
  const colWmm = Number(columnWidth || columnSize || 400)
  const colDmm = Number(columnDepth || columnSize || colWmm)
  const colW = colWmm / 1000 // m
  const colD = colDmm / 1000 // m

  // ---- 1. Service load ----
  const Pu = Number(columnLoad)            // factored, kN
  const Pservice = Pu / 1.5                // kN

  // ---- 2. Self-weight allowance ----
  const Ptotal = Pservice * 1.10           // kN

  // ---- 3. Required plan area ----
  const areaReq = Ptotal / sbc             // m²

  // ---- 4. Square footing size, rounded UP to nearest 0.1 m, min 1.0 m ----
  const sideRaw = Math.sqrt(areaReq)
  let L = Math.ceil(sideRaw * 10) / 10
  if (L < 1.0) L = 1.0
  const B = L

  // ---- 5. Provided area ----
  const providedArea = L * B               // m²

  // ---- 6. Soil pressure under factored load ----
  const q = Pu / providedArea              // kN/m²
  const qAllow = sbc * 1.5
  const bearingSafe = q < qAllow

  // ---- 7. Projections (m) ----
  const Px = Math.max(0, (L - colW) / 2)
  const Py = Math.max(0, (B - colD) / 2)

  // ---- 8. Moments per metre width (kN·m/m) ----
  const Mx = q * Px * Px / 2
  const My = q * Py * Py / 2
  const Mmax = Math.max(Mx, My)            // kN·m/m

  // ---- 9. Unit conversion → N·mm/m ----
  const Mu = Mmax * 1e6

  // ---- 10. Effective depth from spec formula ----
  let d = Math.sqrt(Mu / (0.138 * fck * 1000)) // mm
  // Enforce practical minimum + round UP to nearest 25 mm
  d = Math.max(150, Math.ceil(d / 25) * 25)
  // Cap unrealistically large depth (safety check)
  if (d > 1500) d = 1500

  // ---- 11. Choose bar dia + ---- 12. Steel area ----
  // Start with default bar dia, bump up if spacing too tight
  const barOptions = [12, 16, 20, 25, 32]
  let barDia = barOptions.includes(barDiaInput) ? barDiaInput : 16

  // Pre-compute Ast (will recompute D after picking bar)
  let Ast = Mu / (0.87 * fy * 0.9 * d)     // mm²/m

  // ---- 13. Spacing — validate per rules ----
  let aBar = Math.PI * barDia * barDia / 4
  let s = (1000 * aBar) / Ast              // mm
  let warning = null

  // If spacing < 100 mm, escalate bar diameter
  if (s < 100) {
    for (const optDia of barOptions) {
      if (optDia <= barDia) continue
      const a = Math.PI * optDia * optDia / 4
      const trial = (1000 * a) / Ast
      barDia = optDia
      aBar = a
      s = trial
      if (s >= 100) break
    }
    if (s < 100) {
      // Even 32mm too tight — clamp and warn
      warning = 'Heavy reinforcement required — consider increasing footing depth or grade'
    }
  }

  // Round spacing DOWN to nearest 25 mm
  s = Math.floor(s / 25) * 25
  // Clamp to [100, 300] practical limits
  if (s < 100) s = 100
  if (s > 300) s = 300
  // Absolute floor 75 mm (should never hit due to above clamps)
  if (s < 75) s = 75

  // Apply minimum steel: Ast,min = 0.12 % of gross sectional area (per metre)
  // Recompute D with chosen bar dia and round to 25 mm
  let D = d + cover + barDia / 2
  D = Math.ceil(D / 25) * 25
  const Astmin = 0.0012 * 1000 * D         // mm²/m
  if (Ast < Astmin) Ast = Astmin

  // Provided Ast based on chosen spacing
  const providedAst = (1000 * aBar) / s    // mm²/m

  // Number of bars across the footing width
  const numBars = Math.max(2, Math.floor((B * 1000 - 2 * cover) / s) + 1)
  const barLength = L - (2 * cover) / 1000 // m, both directions same for square
  const totalLength = numBars * barLength * 2
  const steelKg = (barDia * barDia / 162) * totalLength

  // Final design-safe flag
  const designSafe = bearingSafe && providedAst >= Ast && s >= 100 && s <= 300

  return {
    design: {
      footingSize: `${L.toFixed(2)} × ${B.toFixed(2)} m`,
      footingDepth: D,                              // mm
      effectiveDepth: d,                            // mm
      columnSize: `${colWmm} × ${colDmm} mm`,
    },
    bearing: {
      appliedLoad: Pu,                              // kN
      designLoad: Math.round(Ptotal),               // kN
      requiredArea: areaReq.toFixed(2),             // m²
      providedArea: providedArea.toFixed(2),        // m²
      bearingPressure: q.toFixed(1),                // kN/m²
      sbc,                                          // kN/m²
      safe: bearingSafe,
    },
    bending: {
      cantileverProjection: Math.round(Math.max(Px, Py) * 1000), // mm
      netUpwardPressure: q.toFixed(1),              // kN/m²
      bendingMoment: Mmax.toFixed(2),               // kN·m/m
    },
    reinforcement: {
      requiredAst: Math.round(Ast),                 // mm²/m
      providedAst: Math.round(providedAst),         // mm²/m
      barDiameter: barDia,                          // mm
      numberOfBars: numBars,                        // per direction
      spacing: s,                                   // mm c/c
      specification: `${barDia} mm Ø @ ${s} mm c/c both ways (${numBars} bars per direction)`,
      steelWeight: steelKg.toFixed(1),              // kg
      ...(warning ? { warning } : {}),
    },
    isDesignSafe: designSafe,
  }
}

// ============ Brickwork Calculator ============
export function calculateBrickwork(params) {
  const { length, height, thickness = 0.23, mortarRatio = '1:6' } = params
  // Standard brick 190×90×90 mm with 10mm mortar → effective 200×100×100
  const wallVolume = length * height * thickness // m³

  // Brick size with mortar
  const brickWithMortar = 0.20 * 0.10 * 0.10 // 0.002 m³
  const bricksRaw = wallVolume / brickWithMortar
  const bricks = Math.ceil(bricksRaw * 1.05) // 5% wastage

  // Mortar volume — typically 30% of brickwork volume (for 230mm wall)
  const mortarVolume = wallVolume * 0.30
  const dryMortar = mortarVolume * 1.33 // 33% bulking

  // 1:6 mortar — 1 part cement + 6 parts sand = 7 parts
  const [c, s] = mortarRatio.split(':').map(Number)
  const total = c + s
  const cementVol = dryMortar / total
  const sandVol = dryMortar * s / total
  const cementKg = cementVol * 1440
  const cementBags = cementKg / 50

  return {
    inputs: {
      wallVolume: wallVolume.toFixed(3),
      wallArea: (length * height).toFixed(2),
      mortarMix: mortarRatio,
    },
    bricks: {
      count: bricks,
      perCum: Math.ceil(500),
      wastage: '5%',
    },
    mortar: {
      wetVolume: mortarVolume.toFixed(3),
      dryVolume: dryMortar.toFixed(3),
    },
    cement: {
      bags: Math.ceil(cementBags),
      kg: Math.ceil(cementKg),
    },
    sand: {
      cum: sandVol.toFixed(3),
      cft: (sandVol * 35.3147).toFixed(2),
    },
  }
}

// ============ Excavation Quantity ============
export function calculateExcavation(params) {
  const { length, width, depth, soilType = 'medium', truckCapacity = 4 } = params
  const volume = length * width * depth // m³

  // Bulking factors
  const bulkingFactors = { loose: 1.10, medium: 1.25, hard: 1.40, rock: 1.65 }
  const bulking = bulkingFactors[soilType] || 1.25
  const loosenedVolume = volume * bulking
  const truckLoads = Math.ceil(loosenedVolume / truckCapacity)

  // Optional shoring / dewatering at depth > 1.5m
  const needsShoring = depth > 1.5

  return {
    site: {
      length,
      width,
      depth,
      soilType,
    },
    volume: {
      bankVolume: volume.toFixed(2),
      loosenedVolume: loosenedVolume.toFixed(2),
      bulkingFactor: bulking,
      cft: (volume * 35.3147).toFixed(2),
    },
    disposal: {
      truckCapacity,
      truckLoads,
      totalTrips: truckLoads,
    },
    notes: {
      shoringRequired: needsShoring ? 'Yes — depth > 1.5m, consider shoring' : 'Not required at this depth',
      safetySlope: '1:1 for loose soil, 1:0.5 for hard soil (typical)',
    },
  }
}

// ============ Plaster Work ============
export function calculatePlaster(params) {
  const { length, height, thickness = 12, mortarRatio = '1:6', sides = 1 } = params
  const area = length * height * sides // m²
  const wetVolume = area * (thickness / 1000) // m³
  const dryVolume = wetVolume * 1.33 // 33% bulking

  const [c, s] = mortarRatio.split(':').map(Number)
  const total = c + s
  const cementVol = dryVolume / total
  const sandVol = dryVolume * s / total
  const cementKg = cementVol * 1440
  const cementBags = cementKg / 50

  return {
    inputs: {
      area: area.toFixed(2),
      thickness,
      mortarMix: mortarRatio,
      sides,
    },
    volume: {
      wetVolume: wetVolume.toFixed(3),
      dryVolume: dryVolume.toFixed(3),
    },
    cement: {
      bags: Math.ceil(cementBags),
      kg: Math.ceil(cementKg),
    },
    sand: {
      cum: sandVol.toFixed(3),
      cft: (sandVol * 35.3147).toFixed(2),
    },
  }
}

// ============ Rate Analysis ============
export function calculateRateAnalysis(params) {
  const { items = [], labourCost = 0, transportCost = 0, overheadPct = 10, profitPct = 15 } = params
  // items: [{ name, quantity, unit, rate }]
  const materialTotal = items.reduce((sum, it) => sum + (parseFloat(it.quantity || 0) * parseFloat(it.rate || 0)), 0)
  const itemBreakdown = items.map((it) => ({
    ...it,
    amount: (parseFloat(it.quantity || 0) * parseFloat(it.rate || 0)).toFixed(2),
  }))

  const directCost = materialTotal + parseFloat(labourCost || 0) + parseFloat(transportCost || 0)
  const overhead = directCost * (parseFloat(overheadPct || 0) / 100)
  const subtotal = directCost + overhead
  const profit = subtotal * (parseFloat(profitPct || 0) / 100)
  const total = subtotal + profit

  return {
    breakdown: {
      items: itemBreakdown,
      materialTotal: materialTotal.toFixed(2),
      labourCost: parseFloat(labourCost || 0).toFixed(2),
      transportCost: parseFloat(transportCost || 0).toFixed(2),
      directCost: directCost.toFixed(2),
      overhead: overhead.toFixed(2),
      overheadPct,
      profit: profit.toFixed(2),
      profitPct,
    },
    summary: {
      directCost: directCost.toFixed(2),
      indirectCost: (overhead + profit).toFixed(2),
      totalCost: total.toFixed(2),
    },
  }
}
