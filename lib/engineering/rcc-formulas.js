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
    // Singly reinforced
    const R = moment * 1000000 / (1000 * effectiveDepth * effectiveDepth)
    const k = Math.sqrt(1 + 4.6 * R / fck) - 1
    steelRequired = (0.87 * fy * k * 1000 * effectiveDepth) / (2.3 * fy)
  } else {
    // Need compression steel (not typical for slabs)
    steelRequired = 0.002 * 1000 * D // Minimum steel
  }
  
  // Minimum and maximum steel
  const minSteel = 0.0012 * 1000 * D
  const maxSteel = 0.04 * 1000 * D
  const Ast = Math.max(steelRequired, minSteel)
  
  // Bar spacing
  const barDia = 8
  const barArea = Math.PI * barDia * barDia / 4
  const spacing = Math.floor((barArea * 1000) / Ast)
  const providedSpacing = Math.min(spacing, 300) // Max 300mm
  const finalSpacing = [100, 125, 150, 175, 200, 250, 300].find(s => s >= providedSpacing) || 300
  
  const providedAst = (barArea * 1000) / finalSpacing
  
  // Distribution steel (0.12% of gross area)
  const distSteel = 0.0012 * 1000 * D
  const distBarDia = 8
  const distBarArea = Math.PI * distBarDia * distBarDia / 4
  const distSpacing = Math.floor((distBarArea * 1000) / distSteel)
  const finalDistSpacing = Math.min(distSpacing, 450, 5 * D) // Max 450mm or 5D
  
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
      mainSteel: `${barDia}mm Ø @ ${finalSpacing}mm c/c`,
      distributionSteel: `${distBarDia}mm Ø @ ${finalDistSpacing}mm c/c`,
    },
    shear: {
      shearForce: shearForce.toFixed(2),
      nominalShear: nominalShear.toFixed(3),
      permissibleShear: tauC.toFixed(3),
      safe: shearSafe,
    },
    isDesignSafe: shearSafe && moment <= MuLim * 1.1,
  }
}

// Beam Design
export function designBeam(params) {
  const { span, width, depth, deadLoad, liveLoad, grade, steelGrade } = params
  
  const effectiveSpan = span
  const b = width
  const D = depth
  const d = D - 50 // Assuming 50mm effective cover
  
  // Loads (kN/m)
  const selfWeight = (b / 1000) * (D / 1000) * 25
  const totalDL = selfWeight + deadLoad
  const totalLoad = totalDL + liveLoad
  const factoredLoad = 1.5 * totalLoad
  
  // Bending Moment
  const moment = (factoredLoad * effectiveSpan * effectiveSpan) / 8
  
  const fck = MATERIAL_PROPERTIES.concrete[grade].fck
  const fy = MATERIAL_PROPERTIES.steel[steelGrade].fy
  
  // Check for singly or doubly reinforced
  const xuMax = 0.48 * d
  const MuLim = 0.36 * fck * b * xuMax * (d - 0.42 * xuMax) / 1000000
  
  let Ast, compressionSteel = 0
  if (moment <= MuLim) {
    // Singly reinforced
    const R = moment * 1000000 / (b * d * d)
    const k = Math.sqrt(1 + 4.6 * R / fck) - 1
    Ast = (0.87 * fy * k * b * d) / (2.3 * fy)
  } else {
    // Doubly reinforced
    Ast = 0.04 * b * D // Simplified - use max steel
    compressionSteel = (moment - MuLim) * 1000000 / (0.87 * fy * (d - 50))
  }
  
  // Minimum steel
  const minSteel = 0.85 * b * d / fy
  Ast = Math.max(Ast, minSteel)
  
  // Number of bars (assuming 20mm dia)
  const barDia = 20
  const barArea = Math.PI * barDia * barDia / 4
  const numBars = Math.ceil(Ast / barArea)
  const providedAst = numBars * barArea
  
  // Shear design
  const shearForce = (factoredLoad * effectiveSpan) / 2
  const nominalShear = shearForce / (b * d / 1000)
  const pt = (providedAst * 100) / (b * d)
  const tauC = 0.85 * Math.sqrt(0.8 * fck) * (Math.sqrt(1 + 5 * pt) - 1) / (6 * pt)
  
  // Stirrups
  const Vus = shearForce - tauC * b * d / 1000
  const stirrupDia = 8
  const stirrupArea = 2 * Math.PI * stirrupDia * stirrupDia / 4 // 2-legged
  const stirrupSpacing = Vus > 0 ? Math.floor((0.87 * fy * stirrupArea * d) / (Vus * 1000)) : 300
  const finalStirrupSpacing = Math.min(stirrupSpacing, 300, 0.75 * d)
  
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
      maximumMoment: moment.toFixed(2),
      limitingMoment: MuLim.toFixed(2),
      type: moment <= MuLim ? 'Singly Reinforced' : 'Doubly Reinforced',
    },
    steel: {
      requiredAst: Ast.toFixed(0),
      providedAst: providedAst.toFixed(0),
      reinforcement: `${numBars}-${barDia}mm Ø bars`,
      compressionSteel: compressionSteel > 0 ? compressionSteel.toFixed(0) : 'Not Required',
    },
    shear: {
      maxShear: shearForce.toFixed(2),
      nominalShear: nominalShear.toFixed(3),
      permissibleShear: tauC.toFixed(3),
      stirrups: `${stirrupDia}mm Ø 2-legged @ ${Math.floor(finalStirrupSpacing)}mm c/c`,
    },
    isDesignSafe: nominalShear < (tauC + 2),
  }
}

// Column Design
export function designColumn(params) {
  const { width, depth, height, axialLoad, grade, steelGrade } = params
  
  const b = width
  const D = depth
  const L = height
  const Pu = axialLoad * 1000 // Convert to kN
  
  const fck = MATERIAL_PROPERTIES.concrete[grade].fck
  const fy = MATERIAL_PROPERTIES.steel[steelGrade].fy
  
  // Effective length (assuming hinged both ends)
  const Leff = 1.0 * L
  
  // Slenderness check
  const leastDimension = Math.min(b, D)
  const slendernessRatio = Leff / leastDimension
  const isShortColumn = slendernessRatio <= 12
  
  // Steel percentage (assume 1-4%)
  let p = 1.5 // Start with 1.5%
  
  // Capacity of column
  const Ag = b * D
  const Pu_calculated = 0.4 * fck * Ag + (0.67 * fy - 0.4 * fck) * (p / 100) * Ag
  
  // Adjust steel percentage if needed
  if (Pu > Pu_calculated) {
    p = ((Pu - 0.4 * fck * Ag) * 100) / ((0.67 * fy - 0.4 * fck) * Ag)
    p = Math.min(Math.max(p, 0.8), 4) // Between 0.8% and 4%
  }
  
  const Asc = (p / 100) * Ag
  
  // Number of bars (assuming 16mm dia)
  const barDia = 16
  const barArea = Math.PI * barDia * barDia / 4
  const numBars = Math.ceil(Asc / barArea)
  const providedAsc = numBars * barArea
  const providedP = (providedAsc * 100) / Ag
  
  // Lateral ties
  const tiesDia = 8
  const tiesSpacing = Math.min(leastDimension, 16 * barDia, 300)
  
  // Final capacity
  const Pu_final = 0.4 * fck * Ag + (0.67 * fy - 0.4 * fck) * providedAsc
  
  return {
    design: {
      columnSize: `${b}mm x ${D}mm`,
      height: L,
      effectiveLength: Leff,
      slendernessRatio: slendernessRatio.toFixed(1),
      columnType: isShortColumn ? 'Short Column' : 'Slender Column',
    },
    loading: {
      appliedLoad: Pu.toFixed(0),
      capacity: (Pu_final / 1000).toFixed(0),
      loadSafe: Pu <= Pu_final,
    },
    steel: {
      requiredPercentage: p.toFixed(2),
      providedPercentage: providedP.toFixed(2),
      requiredArea: Asc.toFixed(0),
      providedArea: providedAsc.toFixed(0),
      reinforcement: `${numBars}-${barDia}mm Ø bars`,
    },
    ties: {
      diameter: tiesDia,
      spacing: Math.floor(tiesSpacing),
      specification: `${tiesDia}mm Ø @ ${Math.floor(tiesSpacing)}mm c/c`,
    },
    isDesignSafe: Pu <= Pu_final && providedP >= 0.8 && providedP <= 4,
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
    const R = M * 1e6 / (1000 * d * d)
    const k = Math.sqrt(Math.max(0, 1 + 4.6 * R / fck)) - 1
    return Math.max((0.87 * fy * k * 1000 * d) / (2.3 * fy), 0.0012 * 1000 * D)
  }
  const Astx = steelFor(Mux, dx)
  const Asty = steelFor(Muy, dy)

  function spacingFor(Ast) {
    const barArea = Math.PI * barDia * barDia / 4
    const raw = Math.floor((barArea * 1000) / Ast)
    const opts = [100, 125, 150, 175, 200, 225, 250, 300]
    return opts.find((s) => s <= Math.min(raw, 300)) || 300
  }
  const spX = spacingFor(Astx), spY = spacingFor(Asty)
  const barArea = Math.PI * barDia * barDia / 4
  const providedAstx = (barArea * 1000) / spX
  const providedAsty = (barArea * 1000) / spY

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
      shortSpanSpec: `${barDia}mm Ø @ ${spX}mm c/c`,
      longSpanSpec: `${barDia}mm Ø @ ${spY}mm c/c`,
    },
    isDesignSafe: ratio <= 2 && providedAstx >= Astx && providedAsty >= Asty,
  }
}

// ============ Isolated Footing Design (IS 456 Cl. 34) ============
export function designFooting(params) {
  const { columnLoad, sbc, footingDepth = 1.5, grade = 'M25', steelGrade = 'Fe500',
    columnSize = 400 } = params
  const fck = MATERIAL_PROPERTIES.concrete[grade].fck
  const fy = MATERIAL_PROPERTIES.steel[steelGrade].fy

  // Working load (assume already factored = 1.5 × service load)
  const Pservice = columnLoad / 1.5 // working load in kN
  const Pcol = columnLoad // factored load
  // 10% extra for footing self-weight
  const Pdesign = Pservice * 1.10

  // Required area
  const areaReq = Pdesign / sbc // m²
  const side = Math.sqrt(areaReq)
  // Round up to nearest 100mm
  const B = Math.ceil(side * 10) / 10 // m
  const actualArea = B * B
  const netUpwardPressure = Pcol / actualArea // kN/m² (factored)

  // Bending — critical section at face of column
  const cantilever = (B - columnSize / 1000) / 2 // m
  const Mu = (netUpwardPressure * cantilever * cantilever) / 2 // kNm/m

  // Effective depth — by one-way shear or moment, take larger
  // Try d from moment: Mu = 0.138 fck b d²  (Mu_lim for Fe415); use 0.133 for Fe500
  const Rlim = steelGrade === 'Fe500' ? 0.133 : 0.138
  const dMoment = Math.sqrt((Mu * 1e6) / (Rlim * fck * 1000))
  // d from one-way shear (assume τc ≈ 0.36 N/mm²)
  const tauC = 0.36
  const Vu = netUpwardPressure * (cantilever - 0.3) * 1000 // approx, kN/m
  const dShear = (Vu * 1000) / (tauC * 1000)
  let d = Math.max(dMoment, dShear, 200)
  d = Math.ceil(d / 25) * 25
  const D = d + 75 // cover + bar dia

  // Steel
  const R = Mu * 1e6 / (1000 * d * d)
  const k = Math.sqrt(Math.max(0, 1 + 4.6 * R / fck)) - 1
  let Ast = (0.87 * fy * k * 1000 * d) / (2.3 * fy)
  const Astmin = 0.0012 * 1000 * D
  Ast = Math.max(Ast, Astmin)
  const barDia = 16
  const barArea = Math.PI * barDia * barDia / 4
  const numBars = Math.ceil((Ast * B) / barArea)
  const spacing = Math.floor(((B - 0.1) * 1000) / (numBars - 1))

  // Steel weight estimate
  const barLength = B - 0.1 // approx
  const totalLength = numBars * barLength * 2 // both directions
  const steelKg = (barDia * barDia / 162) * totalLength

  return {
    design: {
      footingSize: `${B.toFixed(2)} × ${B.toFixed(2)} m`,
      footingDepth: D,
      effectiveDepth: d,
      columnSize: `${columnSize} × ${columnSize} mm`,
    },
    bearing: {
      appliedLoad: columnLoad,
      designLoad: Pdesign.toFixed(0),
      requiredArea: areaReq.toFixed(2),
      providedArea: actualArea.toFixed(2),
      bearingPressure: (Pservice / actualArea).toFixed(0),
      sbc,
      safe: (Pservice / actualArea) <= sbc,
    },
    bending: {
      cantileverProjection: (cantilever * 1000).toFixed(0),
      netUpwardPressure: netUpwardPressure.toFixed(1),
      bendingMoment: Mu.toFixed(2),
    },
    reinforcement: {
      requiredAst: Ast.toFixed(0),
      barDiameter: barDia,
      numberOfBars: numBars,
      spacing: spacing,
      specification: `${numBars}-${barDia}mm Ø @ ${spacing}mm c/c both ways`,
      steelWeight: steelKg.toFixed(1),
    },
    isDesignSafe: (Pservice / actualArea) <= sbc,
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
