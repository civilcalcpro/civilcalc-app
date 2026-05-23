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

// Concrete Volume Calculator
export function calculateConcreteVolume(params) {
  const { length, width, thickness } = params
  
  // Wet volume (m³)
  const wetVolume = (length * width * thickness) / 1000000
  
  // Dry volume (accounting for voids and wastage)
  const dryVolume = wetVolume * 1.54
  
  // Material quantities (1:1.5:3 ratio for M20)
  const cementBags = (dryVolume * 7) // 7 bags per cum for M20
  const sand = dryVolume * 0.42 // cum
  const aggregate = dryVolume * 0.84 // cum
  
  return {
    wetVolume: wetVolume.toFixed(3),
    dryVolume: dryVolume.toFixed(3),
    cement: {
      bags: Math.ceil(cementBags),
      kg: Math.ceil(cementBags * 50),
    },
    sand: {
      cum: sand.toFixed(3),
      cft: (sand * 35.31).toFixed(2),
    },
    aggregate: {
      cum: aggregate.toFixed(3),
      cft: (aggregate * 35.31).toFixed(2),
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
