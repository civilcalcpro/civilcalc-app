export const formulaCategories = [
  {
    slug: 'rcc',
    title: 'RCC Formulas',
    level: 'Basic to Advanced',
    shortDesc:
      'Important RCC formulas for beam, slab, column, footing, reinforcement, development length and shear design.',
    tags: ['Beam', 'Slab', 'Column', 'Footing'],
    formulas: [
      {
        name: 'Moment of Resistance',
        formula: 'Mu = 0.87 × fy × Ast × d × [1 - (Ast × fy) / (fck × b × d)]',
        explanation:
          'Moment of resistance is the bending moment capacity of an RCC section. It shows how much bending moment a beam or slab section can safely resist.',
        variables:
          'Mu = ultimate moment, fy = steel yield strength, Ast = area of steel, d = effective depth, fck = concrete grade, b = width of section.',
        unit: 'Mu in Nmm or kNm, fy and fck in N/mm², Ast in mm², dimensions in mm.',
        example:
          'Used in RCC beam design to check whether provided reinforcement can resist the applied bending moment.',
      },
      {
        name: 'Development Length',
        formula: 'Ld = (ϕ × σs) / (4 × τbd)',
        explanation:
          'Development length is the minimum embedded length required for a steel bar to develop its full stress through bond with concrete.',
        variables:
          'Ld = development length, ϕ = bar diameter, σs = stress in steel, τbd = design bond stress.',
        unit: 'Ld and ϕ in mm, σs and τbd in N/mm².',
        example:
          'For beam-column junctions and footing bars, enough development length must be provided to safely transfer stress.',
      },
      {
        name: 'Lap Length',
        formula: 'Lap length ≈ 50d for tension bars and 40d for compression bars',
        explanation:
          'Lap length is provided when two reinforcement bars need to be joined because one bar length is not sufficient.',
        variables:
          'd = diameter of reinforcement bar.',
        unit: 'Lap length in mm.',
        example:
          'For 12 mm bar in tension zone, approximate lap length = 50 × 12 = 600 mm.',
      },
      {
        name: 'Minimum Tension Reinforcement in Beam',
        formula: 'Ast / (b × d) = 0.85 / fy',
        explanation:
          'Minimum reinforcement is required to prevent sudden failure and control cracking in RCC beams.',
        variables:
          'Ast = area of tension steel, b = beam width, d = effective depth, fy = yield strength of steel.',
        unit: 'Ast in mm², b and d in mm, fy in N/mm².',
        example:
          'Used when designing lightly loaded RCC beams to ensure minimum steel is provided.',
      },
      {
        name: 'Nominal Shear Stress',
        formula: 'τv = Vu / (b × d)',
        explanation:
          'Nominal shear stress is used to check whether the RCC section is safe against shear failure.',
        variables:
          'τv = nominal shear stress, Vu = factored shear force, b = width, d = effective depth.',
        unit: 'τv in N/mm², Vu in N, dimensions in mm.',
        example:
          'Used in beam design to decide whether shear stirrups are required.',
      },
      {
        name: 'Effective Depth',
        formula: 'd = D - cover - ϕ/2',
        explanation:
          'Effective depth is the distance from the top compression face to the centroid of tension reinforcement.',
        variables:
          'd = effective depth, D = overall depth, cover = clear cover, ϕ = bar diameter.',
        unit: 'All dimensions in mm.',
        example:
          'For a 450 mm deep beam with 25 mm cover and 16 mm bar, d = 450 - 25 - 8 = 417 mm.',
      },
      {
        name: 'Area of One Steel Bar',
        formula: 'Area = π × d² / 4',
        explanation:
          'This formula calculates the cross-sectional area of a reinforcement bar.',
        variables:
          'd = diameter of bar.',
        unit: 'Area in mm², diameter in mm.',
        example:
          'Area of 12 mm bar = π × 12² / 4 = 113 mm² approximately.',
      },
      {
        name: 'Steel Percentage',
        formula: 'Pt = (Ast / (b × d)) × 100',
        explanation:
          'Steel percentage shows how much reinforcement is provided in the RCC section.',
        variables:
          'Pt = percentage of steel, Ast = area of steel, b = width, d = effective depth.',
        unit: 'Pt in %, Ast in mm², dimensions in mm.',
        example:
          'Used to compare provided steel with minimum and maximum reinforcement limits.',
      },
      {
        name: 'Factored Load',
        formula: 'Wu = 1.5 × W',
        explanation:
          'Factored load is used in limit state design by applying safety factor on service load.',
        variables:
          'Wu = factored load, W = service load.',
        unit: 'kN, kN/m or kN/m² depending on load type.',
        example:
          'If service load is 20 kN/m, factored load = 1.5 × 20 = 30 kN/m.',
      },
      {
        name: 'One Way Slab Condition',
        formula: 'Ly / Lx > 2',
        explanation:
          'If longer span divided by shorter span is greater than 2, slab behaves as one way slab.',
        variables:
          'Ly = longer span, Lx = shorter span.',
        unit: 'Both spans in m or mm.',
        example:
          'If Ly = 6 m and Lx = 2.5 m, Ly/Lx = 2.4, so slab is one way.',
      },
    ],
  },

  {
    slug: 'concrete',
    title: 'Concrete Formulas',
    level: 'Basic',
    shortDesc:
      'Concrete quantity formulas for wet volume, dry volume, cement, sand, aggregate, water and mix design basics.',
    tags: ['Volume', 'Mix Ratio', 'Cement', 'Aggregate'],
    formulas: [
      {
        name: 'Concrete Wet Volume',
        formula: 'Wet Volume = Length × Width × Depth',
        explanation:
          'Wet volume is the actual volume of concrete required for a structural member.',
        variables:
          'Length, width and depth are dimensions of slab, beam, footing or PCC work.',
        unit: 'm³ or ft³.',
        example:
          'For slab 5 m × 4 m × 0.125 m, wet volume = 2.5 m³.',
      },
      {
        name: 'Dry Volume of Concrete',
        formula: 'Dry Volume = Wet Volume × 1.54',
        explanation:
          'Dry volume is increased volume used for material calculation because cement, sand and aggregate have voids.',
        variables:
          'Wet volume = actual concrete volume.',
        unit: 'm³.',
        example:
          'If wet volume is 2.5 m³, dry volume = 2.5 × 1.54 = 3.85 m³.',
      },
      {
        name: 'Cement Volume in Mix',
        formula: 'Cement Volume = Dry Volume × Cement Ratio / Total Ratio',
        explanation:
          'This formula calculates cement proportion from nominal concrete mix ratio.',
        variables:
          'Dry volume, cement ratio and total ratio of mix.',
        unit: 'm³.',
        example:
          'For 1:2:4 mix, total ratio = 7. Cement volume = dry volume × 1/7.',
      },
      {
        name: 'Cement Bags',
        formula: 'Cement Bags = Cement Volume / 0.0347',
        explanation:
          'One cement bag of 50 kg has approximate volume of 0.0347 m³.',
        variables:
          'Cement volume in m³.',
        unit: 'Bags.',
        example:
          'If cement volume is 0.55 m³, bags = 0.55 / 0.0347 = 15.85 bags.',
      },
      {
        name: 'Sand Quantity',
        formula: 'Sand Volume = Dry Volume × Sand Ratio / Total Ratio',
        explanation:
          'This calculates sand quantity from concrete mix proportion.',
        variables:
          'Dry volume, sand ratio and total mix ratio.',
        unit: 'm³ or cft.',
        example:
          'For 1:2:4 mix, sand volume = dry volume × 2/7.',
      },
      {
        name: 'Aggregate Quantity',
        formula: 'Aggregate Volume = Dry Volume × Aggregate Ratio / Total Ratio',
        explanation:
          'This calculates coarse aggregate quantity from nominal concrete mix.',
        variables:
          'Dry volume, aggregate ratio and total mix ratio.',
        unit: 'm³ or cft.',
        example:
          'For 1:2:4 mix, aggregate volume = dry volume × 4/7.',
      },
      {
        name: 'Water Cement Ratio',
        formula: 'W/C Ratio = Weight of Water / Weight of Cement',
        explanation:
          'Water-cement ratio controls strength, workability and durability of concrete.',
        variables:
          'Weight of water and weight of cement.',
        unit: 'No unit.',
        example:
          'If water = 25 kg and cement = 50 kg, W/C ratio = 0.5.',
      },
      {
        name: 'Concrete Density',
        formula: 'Density = Mass / Volume',
        explanation:
          'Density is used to estimate self weight of concrete.',
        variables:
          'Mass and volume of concrete.',
        unit: 'kg/m³.',
        example:
          'RCC density is commonly taken around 25 kN/m³ for structural load calculation.',
      },
    ],
  },

  {
    slug: 'steel',
    title: 'Steel Formulas',
    level: 'Basic to Advanced',
    shortDesc:
      'Steel weight, cutting length, bend deduction, hook length, lap length and BBS formulas.',
    tags: ['Steel Weight', 'BBS', 'Cutting Length', 'Hooks'],
    formulas: [
      {
        name: 'Steel Weight Per Meter',
        formula: 'Weight = D² / 162',
        explanation:
          'This is the most commonly used formula to calculate reinforcement bar weight per meter.',
        variables:
          'D = diameter of bar in mm.',
        unit: 'kg/m.',
        example:
          'For 12 mm bar, weight = 12² / 162 = 0.889 kg/m.',
      },
      {
        name: 'Total Steel Weight',
        formula: 'Total Weight = Length × Weight per meter × Number of bars',
        explanation:
          'Used to calculate total steel quantity for beams, slabs, columns and footings.',
        variables:
          'Length of bar, unit weight and number of bars.',
        unit: 'kg.',
        example:
          '10 bars of 12 mm dia and 6 m length = 6 × 0.889 × 10 = 53.34 kg.',
      },
      {
        name: 'Hook Length',
        formula: 'Hook Length = 9d for one hook',
        explanation:
          'Hook length is extra length provided at bar end for anchorage.',
        variables:
          'd = bar diameter.',
        unit: 'mm.',
        example:
          'For 10 mm bar, one hook length = 9 × 10 = 90 mm.',
      },
      {
        name: 'Bend Deduction 45 Degree',
        formula: 'Bend Deduction = 1d',
        explanation:
          'Bend deduction is subtracted while calculating cutting length of bent bars.',
        variables:
          'd = bar diameter.',
        unit: 'mm.',
        example:
          'For 12 mm bar, 45° bend deduction = 12 mm.',
      },
      {
        name: 'Bend Deduction 90 Degree',
        formula: 'Bend Deduction = 2d',
        explanation:
          'For 90 degree bends, deduction is usually taken as 2 times bar diameter.',
        variables:
          'd = bar diameter.',
        unit: 'mm.',
        example:
          'For 16 mm bar, 90° bend deduction = 32 mm.',
      },
      {
        name: 'Bend Deduction 135 Degree',
        formula: 'Bend Deduction = 3d',
        explanation:
          '135 degree bend deduction is commonly used in stirrups and ties.',
        variables:
          'd = bar diameter.',
        unit: 'mm.',
        example:
          'For 8 mm stirrup bar, deduction = 3 × 8 = 24 mm.',
      },
      {
        name: 'Stirrup Cutting Length',
        formula:
          'CL = 2 × (A + B) + Hook Length - Bend Deduction',
        explanation:
          'Used to calculate cutting length of rectangular stirrups.',
        variables:
          'A and B = internal dimensions of stirrup, hook length and bend deduction depend on bar diameter.',
        unit: 'mm.',
        example:
          'Used in beam and column stirrup BBS calculation.',
      },
      {
        name: 'Number of Bars',
        formula: 'No. of Bars = (Length / Spacing) + 1',
        explanation:
          'Used to calculate number of bars in slab, footing or distribution reinforcement.',
        variables:
          'Length = distribution length, spacing = center to center spacing.',
        unit: 'Number.',
        example:
          'For 3000 mm length and 150 mm spacing, bars = 3000/150 + 1 = 21 bars.',
      },
    ],
  },

  {
    slug: 'estimation',
    title: 'Estimation Formulas',
    level: 'Basic to Advanced',
    shortDesc:
      'Quantity formulas for excavation, concrete, brickwork, plaster, flooring, painting and BOQ amount.',
    tags: ['Quantity', 'BOQ', 'Rate', 'Material'],
    formulas: [
      {
        name: 'Excavation Volume',
        formula: 'Volume = Length × Width × Depth',
        explanation:
          'Used to calculate earthwork excavation quantity for footing, trench or pit.',
        variables: 'Length, width and depth of excavation.',
        unit: 'm³.',
        example:
          'For footing pit 2 m × 2 m × 1.5 m, excavation = 6 m³.',
      },
      {
        name: 'Brickwork Volume',
        formula: 'Volume = Length × Height × Thickness',
        explanation:
          'Used to calculate masonry quantity before deducting openings.',
        variables: 'Wall length, wall height and wall thickness.',
        unit: 'm³.',
        example:
          'For wall 5 m × 3 m × 0.23 m, volume = 3.45 m³.',
      },
      {
        name: 'Plaster Area',
        formula: 'Area = Length × Height',
        explanation:
          'Used to calculate plaster quantity for walls and ceilings.',
        variables: 'Length and height of plaster surface.',
        unit: 'm².',
        example:
          'Wall plaster for 5 m × 3 m wall = 15 m².',
      },
      {
        name: 'Flooring Area',
        formula: 'Area = Length × Width',
        explanation:
          'Used for tile, marble, granite or flooring quantity.',
        variables: 'Room length and room width.',
        unit: 'm² or sq ft.',
        example:
          'Room 12 ft × 10 ft has flooring area = 120 sq ft.',
      },
      {
        name: 'Painting Area',
        formula: 'Paint Area = Wall Area - Openings',
        explanation:
          'Used to calculate wall painting quantity after deducting door and window openings.',
        variables: 'Wall area, door area and window area.',
        unit: 'm² or sq ft.',
        example:
          'If wall area is 100 m² and openings are 12 m², paint area = 88 m².',
      },
      {
        name: 'BOQ Amount',
        formula: 'Amount = Quantity × Rate',
        explanation:
          'Basic formula used in BOQ and rate estimation.',
        variables: 'Quantity and rate per unit.',
        unit: '₹.',
        example:
          'If plaster quantity = 100 m² and rate = ₹180/m², amount = ₹18,000.',
      },
      {
        name: 'Cement Mortar Dry Volume',
        formula: 'Dry Volume = Wet Volume × 1.33',
        explanation:
          'Mortar dry volume is calculated to estimate cement and sand quantity.',
        variables: 'Wet mortar volume.',
        unit: 'm³.',
        example:
          'If wet mortar volume is 1 m³, dry volume = 1.33 m³.',
      },
      {
        name: 'Number of Bricks',
        formula: 'Bricks = Brickwork Volume / Volume of one brick with mortar',
        explanation:
          'Used to estimate number of bricks required in masonry.',
        variables: 'Brickwork volume and standard brick volume with mortar.',
        unit: 'Number of bricks.',
        example:
          'Common thumb rule: around 500 bricks per 1 m³ of brickwork.',
      },
    ],
  },

  {
    slug: 'structural-analysis',
    title: 'Structural Analysis Formulas',
    level: 'Advanced',
    shortDesc:
      'Beam reactions, SFD, BMD, slope, deflection, truss and moment distribution formulas.',
    tags: ['SFD', 'BMD', 'Deflection', 'Truss'],
    formulas: [
      {
        name: 'Simply Supported Beam Reaction for Central Point Load',
        formula: 'RA = RB = W / 2',
        explanation:
          'For a simply supported beam with central point load, both supports share equal reaction.',
        variables: 'W = point load, RA and RB = support reactions.',
        unit: 'kN or N.',
        example:
          'If W = 20 kN, RA = RB = 10 kN.',
      },
      {
        name: 'Maximum BM for Central Point Load',
        formula: 'Mmax = W × L / 4',
        explanation:
          'Maximum bending moment occurs at mid span for a central point load.',
        variables: 'W = load, L = span.',
        unit: 'kNm or Nmm.',
        example:
          'For W = 20 kN and L = 6 m, Mmax = 30 kNm.',
      },
      {
        name: 'Maximum BM for UDL on Simply Supported Beam',
        formula: 'Mmax = w × L² / 8',
        explanation:
          'For UDL over full span, maximum BM occurs at mid span.',
        variables: 'w = UDL, L = span.',
        unit: 'kNm.',
        example:
          'For w = 10 kN/m and L = 6 m, Mmax = 45 kNm.',
      },
      {
        name: 'Reaction for Full Span UDL',
        formula: 'RA = RB = wL / 2',
        explanation:
          'For simply supported beam with UDL over full span, reactions are equal.',
        variables: 'w = load per meter, L = span.',
        unit: 'kN.',
        example:
          'If w = 10 kN/m and L = 6 m, each reaction = 30 kN.',
      },
      {
        name: 'Cantilever End Moment with Point Load',
        formula: 'M = W × L',
        explanation:
          'For cantilever with point load at free end, maximum moment occurs at fixed support.',
        variables: 'W = point load, L = cantilever length.',
        unit: 'kNm.',
        example:
          'For W = 5 kN and L = 2 m, fixed end moment = 10 kNm.',
      },
      {
        name: 'Cantilever End Moment with UDL',
        formula: 'M = w × L² / 2',
        explanation:
          'For cantilever with UDL over full length, maximum moment occurs at fixed support.',
        variables: 'w = UDL, L = length.',
        unit: 'kNm.',
        example:
          'For w = 4 kN/m and L = 3 m, moment = 18 kNm.',
      },
      {
        name: 'Deflection of Simply Supported Beam with Central Point Load',
        formula: 'δmax = W × L³ / (48 × E × I)',
        explanation:
          'This gives maximum deflection at mid span under central point load.',
        variables: 'W = load, L = span, E = modulus of elasticity, I = moment of inertia.',
        unit: 'mm.',
        example:
          'Used to check serviceability of beams.',
      },
      {
        name: 'Deflection of Cantilever with End Load',
        formula: 'δmax = W × L³ / (3 × E × I)',
        explanation:
          'Maximum deflection occurs at free end of cantilever beam.',
        variables: 'W = end load, L = length, E = modulus of elasticity, I = moment of inertia.',
        unit: 'mm.',
        example:
          'Used for cantilever balconies, projections and brackets.',
      },
    ],
  },
]
