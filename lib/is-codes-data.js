// Curated subset of common Indian Standard codes for the searchable library.
// Sources are the published IS codes themselves; only short, factual excerpts
// are reproduced for reference. Engineers must verify against the original IS
// publications for any structural design work.

export const IS_CODES = [
  // ============ IS 456:2000 ============
  {
    code: 'IS 456:2000',
    family: 'IS 456',
    section: 'Cl. 5.2',
    title: 'Concrete — Grades',
    summary:
      'Concrete is designated into grades from M10 to M80 based on characteristic compressive strength (fck) of 150mm cubes at 28 days. For RCC, the minimum grade is M20 in ordinary, M25 in moderate, M30 in severe and M35 in extreme exposure.',
    tags: ['concrete', 'grade', 'fck'],
  },
  {
    code: 'IS 456:2000',
    family: 'IS 456',
    section: 'Cl. 23.2.1',
    title: 'Span / Effective-Depth Ratios for Beams',
    summary:
      'Basic l/d ratios for control of deflection without explicit check: cantilever 7, simply supported 20, continuous 26. Modify for tension steel (Fig. 4), compression steel (Fig. 5) and flanged beams.',
    tags: ['deflection', 'span', 'beam'],
  },
  {
    code: 'IS 456:2000',
    family: 'IS 456',
    section: 'Cl. 26.2.1',
    title: 'Development Length',
    summary:
      'Ld = (φ × σs) / (4 × τbd). For Fe415 in M20: Ld ≈ 47φ (tension), 38φ (compression). τbd values (Tab. 6.2) are increased by 60% for deformed bars and 25% for compression.',
    tags: ['bond', 'anchorage', 'development length'],
  },
  {
    code: 'IS 456:2000',
    family: 'IS 456',
    section: 'Cl. 26.5.1.1',
    title: 'Minimum Tension Reinforcement in Beams',
    summary:
      'As,min / (b·d) = 0.85 / fy. The maximum tension reinforcement shall not exceed 0.04 b·D. Reinforcement should be distributed within the tensile zone.',
    tags: ['reinforcement', 'minimum steel', 'beam'],
  },
  {
    code: 'IS 456:2000',
    family: 'IS 456',
    section: 'Cl. 26.5.2',
    title: 'Minimum Reinforcement in Slabs',
    summary:
      'Mild steel slabs: 0.15% of total cross-section. HYSD bars and welded mesh: 0.12% of total cross-section. Maximum diameter ≤ D/8. Maximum spacing: main 3d or 300mm (whichever is less); distribution 5d or 450mm.',
    tags: ['slab', 'reinforcement', 'minimum steel'],
  },
  {
    code: 'IS 456:2000',
    family: 'IS 456',
    section: 'Cl. 26.5.3',
    title: 'Reinforcement Limits in Columns',
    summary:
      'Longitudinal reinforcement: minimum 0.8% and maximum 6% of gross cross-section (4% in normal practice). Minimum 4 bars in rectangular and 6 bars in circular sections. Lateral ties: dia ≥ φ/4 or 6mm; spacing ≤ 16φ, least dimension, or 300mm.',
    tags: ['column', 'reinforcement', 'ties'],
  },
  {
    code: 'IS 456:2000',
    family: 'IS 456',
    section: 'Cl. 26.4',
    title: 'Nominal Cover for Durability',
    summary:
      'Mild: 20mm, Moderate: 30mm, Severe: 45mm, Very Severe: 50mm, Extreme: 75mm. Slab: 20–30mm. Beam: 25–40mm. Column: 40mm. Footing: 50mm. Cover protects steel from corrosion and provides fire resistance.',
    tags: ['cover', 'durability', 'exposure'],
  },
  {
    code: 'IS 456:2000',
    family: 'IS 456',
    section: 'Cl. 38.1',
    title: 'Limit State of Collapse — Flexure',
    summary:
      'Stress block: rectangular with compressive stress 0.36 fck up to 0.42 xu from extreme compression fibre. xu,max / d: Fe250 = 0.531, Fe415 = 0.479, Fe500 = 0.456. Mu,lim = 0.36 fck b xu,max (d − 0.42 xu,max).',
    tags: ['limit state', 'flexure', 'Mu,lim'],
  },
  {
    code: 'IS 456:2000',
    family: 'IS 456',
    section: 'Cl. 40',
    title: 'Shear Design',
    summary:
      'Nominal shear stress τv = Vu / (b·d). Compare with τc (Table 19, depends on % steel and concrete grade) and τc,max (Table 20). If τv ≤ τc: minimum stirrups. τc < τv ≤ τc,max: design shear reinforcement. τv > τc,max: redesign section.',
    tags: ['shear', 'stirrups', 'τv'],
  },
  {
    code: 'IS 456:2000',
    family: 'IS 456',
    section: 'Cl. 6.2.3',
    title: 'Workability of Concrete',
    summary:
      'Slump ranges — lightly reinforced sections (mass concrete): 25–75mm; heavily reinforced sections in slabs/beams/walls/columns: 50–100mm; slipform/vibrated concrete: 10–40mm. Workability should be such that concrete reaches all corners and fully embeds reinforcement.',
    tags: ['workability', 'slump'],
  },

  // ============ IS 875 ============
  {
    code: 'IS 875 (Part 1):1987',
    family: 'IS 875',
    section: 'Sec. 2',
    title: 'Dead Loads — Unit Weights of Materials',
    summary:
      'Plain concrete: 24 kN/m³. RCC: 25 kN/m³. Brick masonry: 19–20 kN/m³. Cement plaster: 20.4 kN/m³. Floor finish (terrazzo/tile): 0.6–1.2 kN/m². Used for self-weight calculations of structural members.',
    tags: ['dead load', 'unit weight'],
  },
  {
    code: 'IS 875 (Part 2):1987',
    family: 'IS 875',
    section: 'Sec. 3',
    title: 'Imposed (Live) Loads on Floors',
    summary:
      'Residential: 2.0 kN/m². Office (general): 2.5–3.0 kN/m². Classrooms: 3.0 kN/m². Retail / assembly with fixed seating: 4.0 kN/m². Storage warehouses: 7.5–10 kN/m². Stairs / corridors / lobbies: 3.0–5.0 kN/m².',
    tags: ['live load', 'imposed', 'occupancy'],
  },
  {
    code: 'IS 875 (Part 3):2015',
    family: 'IS 875',
    section: 'Cl. 6.2',
    title: 'Wind — Basic Wind Speed Vb',
    summary:
      'Basic wind speed for 50-year return at 10m height. Six wind zones across India: 33, 39, 44, 47, 50, 55 m/s. Design wind speed Vz = Vb × k1 × k2 × k3 × k4. Design wind pressure pz = 0.6 Vz².',
    tags: ['wind', 'basic wind speed'],
  },
  {
    code: 'IS 875 (Part 5):1987',
    family: 'IS 875',
    section: 'Sec. 3',
    title: 'Load Combinations',
    summary:
      'Working stress: DL+LL, DL+LL+WL, DL+LL+EL with permissible stress increase 25%/33%. Limit state (per IS 456): 1.5(DL+LL), 1.2(DL+LL+WL), 1.5(DL+WL), 0.9DL+1.5WL, similar for EL.',
    tags: ['combinations', 'load factor'],
  },

  // ============ IS 1893 ============
  {
    code: 'IS 1893 (Part 1):2016',
    family: 'IS 1893',
    section: 'Cl. 6.4',
    title: 'Seismic Zones of India',
    summary:
      'Four zones with zone factor Z: II (low, Z=0.10), III (moderate, Z=0.16), IV (severe, Z=0.24), V (very severe, Z=0.36). Z is the expected effective PGA at the soil surface for the considered seismicity.',
    tags: ['seismic', 'zone factor', 'Z'],
  },
  {
    code: 'IS 1893 (Part 1):2016',
    family: 'IS 1893',
    section: 'Cl. 7.5',
    title: 'Design Horizontal Seismic Coefficient',
    summary:
      'Ah = (Z/2) · (Sa/g) · (I/R), where I = importance factor (1.0–1.5), R = response reduction factor (3–5 typically), Sa/g from response spectrum based on soil type and fundamental period T.',
    tags: ['Ah', 'response reduction', 'importance'],
  },
  {
    code: 'IS 1893 (Part 1):2016',
    family: 'IS 1893',
    section: 'Cl. 7.6',
    title: 'Fundamental Natural Period Ta',
    summary:
      'For RC moment-resisting frame without infill walls: Ta = 0.075 h^0.75. With infill walls: Ta = 0.09 h / √d. For steel moment frame: Ta = 0.085 h^0.75. h = total building height in m, d = base dimension along seismic direction.',
    tags: ['period', 'Ta', 'natural period'],
  },
  {
    code: 'IS 1893 (Part 1):2016',
    family: 'IS 1893',
    section: 'Cl. 7.7',
    title: 'Base Shear & Vertical Distribution',
    summary:
      'VB = Ah · W (seismic weight). Distribute as Qi = VB · (Wi·hi²) / Σ(Wj·hj²). Seismic weight = full DL + percentage of LL (25–50% based on intensity).',
    tags: ['base shear', 'vertical distribution'],
  },

  // ============ IS 13920 ============
  {
    code: 'IS 13920:2016',
    family: 'IS 13920',
    section: 'Cl. 6.2',
    title: 'Ductile Detailing — Material Requirements',
    summary:
      'Minimum concrete grade M20 (M25 for 15-storey+ structures in zone IV/V). Reinforcement: HYSD only — minimum Fe415, with elongation ≥ 14.5%. Yield ratio (actual fy / specified fy) ≤ 1.25.',
    tags: ['ductile detailing', 'materials'],
  },
  {
    code: 'IS 13920:2016',
    family: 'IS 13920',
    section: 'Cl. 7.2',
    title: 'Ductile Beams — Reinforcement',
    summary:
      'Minimum two bars top & bottom, full length. ρmin = 0.24 √fck/fy, ρmax = 2.5%. Compression steel at any section ≥ half of tension steel. Hoops: 8mm minimum, spacing in plastic hinge zone ≤ d/4 or 8φ.',
    tags: ['beam', 'ductile', 'hoops'],
  },
  {
    code: 'IS 13920:2016',
    family: 'IS 13920',
    section: 'Cl. 8',
    title: 'Ductile Columns',
    summary:
      'Minimum dimension 300mm. Slenderness ratio le/D ≤ 12. Longitudinal steel 0.8% – 4%. Special confining reinforcement at member ends over length ≥ D, h/6, or 450mm. Hoops at ≤ 6φ or 100mm spacing.',
    tags: ['column', 'confining', 'plastic hinge'],
  },
]

export const IS_FAMILIES = ['All', 'IS 456', 'IS 875', 'IS 1893', 'IS 13920']
