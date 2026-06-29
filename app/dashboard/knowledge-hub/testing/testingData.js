export const tests = [
  {
    slug: 'slump-test',
    title: 'Slump Test',
    level: 'Basic',
    shortDesc:
      'Fresh concrete workability test used before concrete placing on site.',
    tags: ['Concrete', 'Workability', 'Site Test', 'Fresh Concrete'],
    purpose:
      'Slump test is used to check the workability and consistency of fresh concrete before placing.',
    whereUsed: [
      'RCC slab casting',
      'Beam and column casting',
      'Footing concrete',
      'Ready mix concrete receiving',
      'Site concrete quality control',
    ],
    apparatus: [
      'Slump cone',
      'Tamping rod',
      'Base plate',
      'Measuring scale',
      'Fresh concrete sample',
    ],
    procedure: [
      'Place slump cone on a clean and level base plate.',
      'Fill concrete in 3 equal layers.',
      'Tamp each layer 25 times using tamping rod.',
      'Remove extra concrete from top surface.',
      'Lift the cone vertically and slowly.',
      'Measure the subsidence of concrete in mm.',
    ],
    observations: [
      'True slump indicates normal workable concrete.',
      'Shear slump indicates lack of cohesion.',
      'Collapse slump indicates very high workability or excess water.',
    ],
    result:
      'Slump value is measured in mm. The required slump depends on type of work and project specification.',
    commonMistakes: [
      'Cone not placed on level surface.',
      'Improper tamping.',
      'Lifting cone too fast.',
      'Using delayed concrete sample.',
      'Adding water on site without approval.',
    ],
    safety: [
      'Wear gloves while handling concrete.',
      'Avoid direct skin contact with cement slurry.',
      'Keep testing area clean and safe.',
    ],
  },
  {
    slug: 'cube-test',
    title: 'Concrete Cube Test',
    level: 'Basic to Intermediate',
    shortDesc:
      'Compressive strength test for hardened concrete cubes after curing.',
    tags: ['Concrete', 'Strength', 'Lab Test', 'Cube'],
    purpose:
      'Cube test is used to determine compressive strength of concrete at 7 days, 14 days or 28 days.',
    whereUsed: [
      'RCC work quality approval',
      'Concrete grade verification',
      'Ready mix concrete quality control',
      'Structural concrete testing',
    ],
    apparatus: [
      'Cube mould',
      'Tamping rod or vibrator',
      'Compression testing machine',
      'Curing tank',
      'Concrete sample',
    ],
    procedure: [
      'Clean and oil the cube mould properly.',
      'Fill concrete in layers.',
      'Compact each layer properly.',
      'Finish the top surface level.',
      'Demould cube after required initial setting period.',
      'Cure cubes in water tank.',
      'Test cube in compression testing machine.',
    ],
    observations: [
      'Check cube identification mark.',
      'Check age of cube before testing.',
      'Check failure pattern after test.',
      'Record maximum load at failure.',
    ],
    result:
      'Compressive strength = Failure load / Loaded area of cube.',
    commonMistakes: [
      'Improper compaction inside mould.',
      'Wrong cube identification.',
      'Poor curing.',
      'Testing cube before required age.',
      'Damaged cube edges before testing.',
    ],
    safety: [
      'Use gloves while handling moulds.',
      'Operate compression testing machine carefully.',
      'Keep hands away from loading plates during testing.',
    ],
  },
  {
    slug: 'sieve-analysis',
    title: 'Sieve Analysis',
    level: 'Intermediate',
    shortDesc:
      'Particle size distribution test for fine and coarse aggregates.',
    tags: ['Aggregate', 'Sand', 'Grading', 'Lab Test'],
    purpose:
      'Sieve analysis is used to determine grading and particle size distribution of sand or aggregate.',
    whereUsed: [
      'Concrete mix design',
      'Aggregate quality control',
      'Sand quality checking',
      'Road construction material testing',
    ],
    apparatus: [
      'Set of IS sieves',
      'Weighing balance',
      'Sieve shaker',
      'Oven dried sample',
      'Pan and brush',
    ],
    procedure: [
      'Take representative dry sample.',
      'Arrange sieves in descending order of size.',
      'Place sample on top sieve.',
      'Shake manually or using sieve shaker.',
      'Weigh material retained on each sieve.',
      'Calculate percentage retained and passing.',
    ],
    observations: [
      'Check retained weight on each sieve.',
      'Calculate cumulative percentage retained.',
      'Calculate fineness modulus if required.',
    ],
    result:
      'Result gives grading zone or particle size distribution of aggregate.',
    commonMistakes: [
      'Using wet sample.',
      'Not taking representative sample.',
      'Improper sieve cleaning.',
      'Wrong weighing.',
      'Loss of material during sieving.',
    ],
    safety: [
      'Wear mask if dust is high.',
      'Handle sieves carefully.',
      'Keep lab area clean.',
    ],
  },
  {
    slug: 'core-test',
    title: 'Concrete Core Test',
    level: 'Advanced',
    shortDesc:
      'In-situ concrete strength assessment by extracting concrete cores.',
    tags: ['Concrete', 'NDT', 'Core', 'Strength'],
    purpose:
      'Core test is used to assess actual in-situ concrete strength when cube results are doubtful or structure needs investigation.',
    whereUsed: [
      'Existing building assessment',
      'Doubtful concrete strength cases',
      'Quality audit',
      'Structural repair investigation',
    ],
    apparatus: [
      'Core cutting machine',
      'Diamond core bit',
      'Water supply',
      'Compression testing machine',
      'Measuring tools',
    ],
    procedure: [
      'Select core location carefully.',
      'Avoid cutting reinforcement if possible.',
      'Extract core using core cutting machine.',
      'Measure diameter and length of core.',
      'Prepare core ends properly.',
      'Test core in compression testing machine.',
    ],
    observations: [
      'Check core diameter and length.',
      'Check cracks or damage in core.',
      'Record failure load.',
      'Apply correction factors if required by standard.',
    ],
    result:
      'Core compressive strength helps estimate in-situ concrete strength.',
    commonMistakes: [
      'Selecting wrong core location.',
      'Damaging core during extraction.',
      'Ignoring reinforcement location.',
      'Testing damaged core without correction.',
      'Not sealing core hole after extraction.',
    ],
    safety: [
      'Use eye protection.',
      'Use proper electrical safety during core cutting.',
      'Barricade testing area.',
    ],
  },
  {
    slug: 'rebound-hammer-test',
    title: 'Rebound Hammer Test',
    level: 'Intermediate',
    shortDesc:
      'Non-destructive test used to estimate surface hardness of concrete.',
    tags: ['NDT', 'Concrete', 'Surface Hardness', 'Site Test'],
    purpose:
      'Rebound hammer test gives an approximate indication of concrete surface hardness and uniformity.',
    whereUsed: [
      'Existing concrete assessment',
      'Concrete uniformity checking',
      'Quick site investigation',
      'Preliminary strength estimation',
    ],
    apparatus: [
      'Rebound hammer',
      'Grinding stone',
      'Measuring grid',
      'Concrete surface',
    ],
    procedure: [
      'Select smooth and clean test surface.',
      'Remove loose particles or plaster.',
      'Hold hammer perpendicular to surface.',
      'Take multiple readings at different points.',
      'Discard abnormal readings.',
      'Calculate average rebound number.',
    ],
    observations: [
      'Record rebound number.',
      'Check surface condition.',
      'Compare readings at different locations.',
    ],
    result:
      'Higher rebound number generally indicates harder concrete surface.',
    commonMistakes: [
      'Testing on rough or plastered surface.',
      'Taking only one reading.',
      'Ignoring carbonation effect.',
      'Using hammer at wrong angle.',
      'Considering rebound hammer as final strength test.',
    ],
    safety: [
      'Wear eye protection.',
      'Use stable platform at height.',
      'Do not test on loose or damaged surface.',
    ],
  },
  {
    slug: 'upv-test',
    title: 'Ultrasonic Pulse Velocity Test',
    level: 'Advanced',
    shortDesc:
      'NDT test used to assess concrete quality, cracks and uniformity.',
    tags: ['NDT', 'Concrete', 'UPV', 'Quality'],
    purpose:
      'UPV test checks concrete quality by measuring travel time of ultrasonic pulse through concrete.',
    whereUsed: [
      'Concrete quality assessment',
      'Crack detection support',
      'Uniformity checking',
      'Existing structure evaluation',
    ],
    apparatus: [
      'UPV machine',
      'Transducers',
      'Coupling gel',
      'Measuring tape',
      'Clean concrete surface',
    ],
    procedure: [
      'Clean test surface.',
      'Apply coupling gel on transducers.',
      'Place transducers on selected points.',
      'Measure pulse travel time.',
      'Calculate velocity using path length and time.',
      'Compare velocity with quality criteria.',
    ],
    observations: [
      'Record path length.',
      'Record travel time.',
      'Calculate pulse velocity.',
      'Check variations between locations.',
    ],
    result:
      'Higher pulse velocity usually indicates better concrete quality and uniformity.',
    commonMistakes: [
      'Poor contact between transducer and surface.',
      'Wrong path length measurement.',
      'Testing on dirty surface.',
      'Ignoring cracks and reinforcement effect.',
      'Using single reading only.',
    ],
    safety: [
      'Use stable access arrangement.',
      'Keep electronic equipment safe from water.',
      'Follow manufacturer instructions.',
    ],
  },
  {
    slug: 'plate-load-test',
    title: 'Plate Load Test',
    level: 'Advanced',
    shortDesc:
      'Field test used to estimate soil bearing capacity and settlement behavior.',
    tags: ['Soil', 'Bearing Capacity', 'Field Test', 'Foundation'],
    purpose:
      'Plate load test is used to estimate bearing capacity and settlement of soil at foundation level.',
    whereUsed: [
      'Foundation design support',
      'Soil bearing capacity verification',
      'Field geotechnical investigation',
      'Important structural projects',
    ],
    apparatus: [
      'Steel plate',
      'Hydraulic jack',
      'Reaction frame or loaded platform',
      'Dial gauges',
      'Loading arrangement',
    ],
    procedure: [
      'Prepare test pit at foundation level.',
      'Place steel plate on level surface.',
      'Set hydraulic jack and reaction system.',
      'Apply load in increments.',
      'Record settlement at each load increment.',
      'Plot load-settlement curve.',
    ],
    observations: [
      'Load increment values.',
      'Settlement readings.',
      'Time interval readings.',
      'Load-settlement behavior.',
    ],
    result:
      'Result gives safe bearing capacity and settlement characteristics of soil.',
    commonMistakes: [
      'Testing at wrong depth.',
      'Poor plate seating.',
      'Incorrect settlement reading.',
      'Unstable reaction system.',
      'Not maintaining proper loading interval.',
    ],
    safety: [
      'Keep people away from reaction loading area.',
      'Check hydraulic jack stability.',
      'Use proper barricading around test pit.',
    ],
  },
  {
    slug: 'field-density-test',
    title: 'Field Density Test',
    level: 'Intermediate',
    shortDesc:
      'Field test used to check soil compaction quality at site.',
    tags: ['Soil', 'Compaction', 'Density', 'Field Test'],
    purpose:
      'Field density test checks whether compacted soil layer has achieved required density.',
    whereUsed: [
      'Road subgrade compaction',
      'Backfilling work',
      'Embankment construction',
      'Foundation filling',
    ],
    apparatus: [
      'Sand replacement apparatus or core cutter',
      'Weighing balance',
      'Metal tray',
      'Moisture container',
      'Dry sand or core cutter tools',
    ],
    procedure: [
      'Select test location.',
      'Prepare test surface.',
      'Collect soil sample using selected method.',
      'Measure volume of hole or cutter.',
      'Determine wet density.',
      'Find moisture content and calculate dry density.',
    ],
    observations: [
      'Wet weight of soil.',
      'Volume of sample or hole.',
      'Moisture content.',
      'Dry density.',
    ],
    result:
      'Dry density is compared with maximum dry density to determine compaction percentage.',
    commonMistakes: [
      'Testing loose or disturbed location.',
      'Wrong volume measurement.',
      'Moisture content not checked.',
      'Improper sand calibration.',
      'Not comparing with MDD.',
    ],
    safety: [
      'Keep test pit area safe.',
      'Use gloves while handling tools.',
      'Avoid testing near moving machinery.',
    ],
  },
]
