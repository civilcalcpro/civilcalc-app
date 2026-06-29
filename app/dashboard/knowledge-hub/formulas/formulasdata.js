export const formulaCategories = [
  {
    slug: 'rcc',
    title: 'RCC Formulas',
    level: 'Basic to Advanced',
    shortDesc:
      'Beam, slab, column, footing, development length, lap length and reinforcement formulas.',
    tags: ['Beam', 'Slab', 'Column', 'Footing'],
    formulas: [
      'Moment of resistance',
      'Development length',
      'Lap length',
      'Minimum reinforcement',
      'Shear stress',
      'Effective depth',
    ],
    relatedTools: [
      {
        name: 'RCC Beam Design',
        href: '/dashboard/calculators/beam',
      },
      {
        name: 'Development Length',
        href: '/dashboard/calculators/development-length',
      },
    ],
  },
  {
    slug: 'concrete',
    title: 'Concrete Formulas',
    level: 'Basic',
    shortDesc:
      'Concrete volume, dry volume, mix ratio, cement bags, sand and aggregate quantity formulas.',
    tags: ['Volume', 'Mix Ratio', 'Cement', 'Aggregate'],
    formulas: [
      'Wet volume',
      'Dry volume',
      'Cement quantity',
      'Sand quantity',
      'Aggregate quantity',
      'Water-cement ratio',
    ],
    relatedTools: [
      {
        name: 'Concrete Calculator',
        href: '/dashboard/calculators/concrete-volume',
      },
      {
        name: 'Home Cost Calculator',
        href: '/dashboard/calculators/home-construction-cost',
      },
    ],
  },
  {
    slug: 'steel',
    title: 'Steel Formulas',
    level: 'Basic to Advanced',
    shortDesc:
      'Steel weight, cutting length, bend deduction, hook length and bar bending formulas.',
    tags: ['Steel Weight', 'BBS', 'Cutting Length', 'Hooks'],
    formulas: [
      'Steel weight = D²/162',
      'Cutting length',
      'Bend deduction',
      'Hook length',
      'Lap length',
      'Development length',
    ],
    relatedTools: [
      {
        name: 'Steel Weight Calculator',
        href: '/dashboard/calculators/steel-weight',
      },
      {
        name: 'BBS Generator',
        href: '/dashboard/calculators/bbs-generator',
      },
    ],
  },
  {
    slug: 'estimation',
    title: 'Estimation Formulas',
    level: 'Basic to Advanced',
    shortDesc:
      'Quantity estimation formulas for brickwork, plaster, concrete, excavation, flooring and painting.',
    tags: ['Quantity', 'BOQ', 'Rate', 'Material'],
    formulas: [
      'Brickwork volume',
      'Plaster area',
      'Excavation volume',
      'Flooring area',
      'Paint area',
      'BOQ amount',
    ],
    relatedTools: [
      {
        name: 'BOQ Generator',
        href: '/dashboard/calculators/boq-generator',
      },
      {
        name: 'Brickwork Calculator',
        href: '/dashboard/calculators/brickwork',
      },
    ],
  },
  {
    slug: 'soil',
    title: 'Soil Mechanics Formulas',
    level: 'Intermediate',
    shortDesc:
      'Bearing capacity, void ratio, porosity, water content, density and compaction formulas.',
    tags: ['Soil', 'Bearing', 'Density', 'Compaction'],
    formulas: [
      'Water content',
      'Void ratio',
      'Porosity',
      'Degree of saturation',
      'Dry density',
      'Bearing capacity',
    ],
    relatedTools: [
      {
        name: 'Footing Design',
        href: '/dashboard/calculators/footing',
      },
    ],
  },
  {
    slug: 'surveying',
    title: 'Surveying Formulas',
    level: 'Intermediate',
    shortDesc:
      'Levelling, bearings, area calculation, traverse correction and surveying formulas.',
    tags: ['Level', 'Area', 'Bearing', 'Traverse'],
    formulas: [
      'Rise and fall method',
      'Height of instrument method',
      'Bearing conversion',
      'Area by coordinates',
      'Trapezoidal rule',
      'Simpson rule',
    ],
    relatedTools: [
      {
        name: 'CivilCalc Dashboard',
        href: '/dashboard',
      },
    ],
  },
  {
    slug: 'hydraulics',
    title: 'Hydraulics Formulas',
    level: 'Intermediate',
    shortDesc:
      'Discharge, velocity, pressure, pipe flow, open channel flow and hydraulic formulas.',
    tags: ['Flow', 'Velocity', 'Pressure', 'Pipe'],
    formulas: [
      'Discharge Q = A × V',
      'Continuity equation',
      'Bernoulli equation',
      'Manning formula',
      'Hydraulic radius',
      'Head loss',
    ],
    relatedTools: [
      {
        name: 'CivilCalc Dashboard',
        href: '/dashboard',
      },
    ],
  },
  {
    slug: 'transportation',
    title: 'Transportation Formulas',
    level: 'Intermediate',
    shortDesc:
      'Highway engineering formulas for camber, gradient, sight distance and road quantities.',
    tags: ['Highway', 'Camber', 'Gradient', 'Road'],
    formulas: [
      'Stopping sight distance',
      'Overtaking sight distance',
      'Camber calculation',
      'Gradient',
      'Road earthwork quantity',
      'Superelevation',
    ],
    relatedTools: [
      {
        name: 'Excavation Calculator',
        href: '/dashboard/calculators/excavation',
      },
    ],
  },
  {
    slug: 'structural-analysis',
    title: 'Structural Analysis Formulas',
    level: 'Advanced',
    shortDesc:
      'SFD, BMD, slope, deflection, truss, moment distribution and structural analysis formulas.',
    tags: ['SFD', 'BMD', 'Deflection', 'Truss'],
    formulas: [
      'Shear force',
      'Bending moment',
      'Maximum bending moment',
      'Deflection formulas',
      'Slope formulas',
      'Truss equilibrium',
    ],
    relatedTools: [
      {
        name: 'Structural Analysis',
        href: '/dashboard/calculators/structural-analysis',
      },
      {
        name: 'Moment Distribution',
        href: '/dashboard/calculators/moment-distribution',
      },
    ],
  },
]
