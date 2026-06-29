export const isCodeCategories = [
  'Concrete & RCC',
  'Loads & Earthquake',
  'Steel Structures',
  'Soil & Foundation',
  'Materials & Testing',
  'Masonry',
  'Construction Practice',
]

export const isCodes = [
  {
    slug: 'is-456',
    code: 'IS 456:2000',
    title: 'Plain and Reinforced Concrete — Code of Practice',
    category: 'Concrete & RCC',
    level: 'Core RCC Code',
    verifiedFromUpload: true,
    shortDesc:
      'Main Indian code for plain concrete, reinforced concrete, materials, workmanship, durability, design and construction practice.',
    purpose:
      'IS 456 is the primary Indian Standard used for plain and reinforced concrete design and construction. It covers materials, concrete quality, workmanship, durability, structural design, reinforcement, serviceability and site execution requirements.',
    whereUsed: [
      'RCC beam, slab, column and footing design',
      'Concrete quality and workmanship checking',
      'Durability requirement selection',
      'Reinforcement detailing reference',
      'Concrete production, placing, compaction and curing checks',
      'Acceptance and inspection of concrete work',
    ],
    importantTopics: [
      'Concrete materials and workmanship',
      'Grades and properties of concrete',
      'Workability and durability of concrete',
      'Concrete mix proportioning',
      'Formwork, reinforcement assembly and curing',
      'Limit state design philosophy',
      'Design of beams, slabs, columns and footings',
      'Serviceability, deflection and cracking control',
    ],
    practicalUse: [
      'Use for RCC design basics and concrete construction quality control.',
      'Use while checking cover, durability, concrete grade and workmanship.',
      'Use with IS 10262 for concrete mix proportioning.',
      'Use with IS 13920 and IS 1893 for seismic RCC structures.',
    ],
    relatedTools: [
      { name: 'RCC Beam Design', href: '/dashboard/calculators/beam' },
      { name: 'Column Design', href: '/dashboard/calculators/column' },
      { name: 'Footing Design', href: '/dashboard/calculators/footing' },
      { name: 'Slab Design', href: '/dashboard/calculators/slab' },
      { name: 'Concrete Calculator', href: '/dashboard/calculators/concrete-volume' },
    ],
    commonMistakes: [
      'Using only thumb rules without checking code requirements.',
      'Ignoring durability requirements for exposure condition.',
      'Providing insufficient concrete cover.',
      'Poor curing and compaction on site.',
      'Not coordinating RCC design with seismic detailing requirements.',
    ],
    note:
      'For final design, exact clauses, tables and values must be checked from the official/latest BIS standard.',
  },
  {
    slug: 'is-10262',
    code: 'IS 10262:2019',
    title: 'Concrete Mix Proportioning — Guidelines',
    category: 'Concrete & RCC',
    level: 'Mix Design Code',
    verifiedFromUpload: true,
    shortDesc:
      'Guideline for proportioning concrete mixes for required strength, workability and durability.',
    purpose:
      'IS 10262 provides guidelines for concrete mix proportioning using concrete-making materials and supplementary cementitious materials. It is used to prepare trial mixes and finalize mix proportions for required strength, workability and durability.',
    whereUsed: [
      'Concrete mix design for site and RMC plant',
      'M20, M25, M30 and higher grade concrete proportioning',
      'Trial mix preparation',
      'Selection of water-cement or water-cementitious material ratio',
      'Adjustment for aggregate moisture and admixtures',
      'Concrete quality control documentation',
    ],
    importantTopics: [
      'Initial data required for mix proportioning',
      'Target mean strength concept',
      'Water-cement ratio and durability requirements',
      'Water content and aggregate proportion selection',
      'Chemical and mineral admixture consideration',
      'Trial mix correction and final mix proportion',
      'High strength concrete, SCC and mass concrete provisions',
    ],
    practicalUse: [
      'Use this code with IS 456 durability limits.',
      'Use trial mixes before finalizing concrete proportions.',
      'Adjust mix based on workability, aggregate condition and site control.',
      'Use for RMC mix review and site concrete approval.',
    ],
    relatedTools: [
      { name: 'Concrete Mix Calculator', href: '/dashboard/calculators/concrete-volume' },
      { name: 'BOQ Generator', href: '/dashboard/calculators/boq-generator' },
      { name: 'Material Guide', href: '/dashboard/knowledge-hub/materials' },
    ],
    commonMistakes: [
      'Treating nominal mix as proper design mix for all works.',
      'Ignoring actual aggregate moisture.',
      'Not doing trial mixes.',
      'Selecting water content only for workability and ignoring durability.',
      'Not checking compatibility of admixture with cement.',
    ],
    note:
      'This page gives practical summary only. For exact mix design procedure, always refer official IS 10262 and project specifications.',
  },
  {
    slug: 'is-13920',
    code: 'IS 13920:1993',
    title: 'Ductile Detailing of Reinforced Concrete Structures Subjected to Seismic Forces',
    category: 'Loads & Earthquake',
    level: 'Seismic Detailing',
    verifiedFromUpload: true,
    shortDesc:
      'Ductile detailing code for RCC structures subjected to earthquake forces.',
    purpose:
      'IS 13920 provides ductile detailing requirements for reinforced concrete structures in seismic regions. It focuses on detailing beams, columns, beam-column joints and shear walls so that RCC structures can dissipate seismic energy safely.',
    whereUsed: [
      'Earthquake-resistant RCC building detailing',
      'Beam and column reinforcement detailing',
      'Special confining reinforcement in columns',
      'Shear wall reinforcement detailing',
      'Beam-column joint detailing',
      'Seismic detailing review before construction',
    ],
    importantTopics: [
      'Ductile detailing philosophy',
      'Beam reinforcement and transverse reinforcement',
      'Column detailing and special confining reinforcement',
      'Lap splice and anchorage detailing',
      'Design shear force considerations',
      'Shear wall detailing',
      'Ductility and seismic energy dissipation',
    ],
    practicalUse: [
      'Use with IS 456 and IS 1893 for RCC seismic design.',
      'Use while checking beam and column reinforcement drawings.',
      'Use before casting columns, beams and beam-column joints.',
      'Use for earthquake-prone regions and ductile detailing requirement.',
    ],
    relatedTools: [
      { name: 'RCC Beam Design', href: '/dashboard/calculators/beam' },
      { name: 'Column Design', href: '/dashboard/calculators/column' },
      { name: 'Structural Analysis', href: '/dashboard/calculators/structural-analysis' },
    ],
    commonMistakes: [
      'Providing normal RCC detailing in seismic zone without ductile detailing.',
      'Incorrect stirrup spacing near beam-column joints.',
      'Wrong lap splice location in columns.',
      'Missing special confining reinforcement.',
      'Ignoring shear wall boundary detailing.',
    ],
    note:
      'Check latest applicable BIS revision and project requirement before final design/detailing.',
  },
  {
    slug: 'is-1893-part-1',
    code: 'IS 1893 Part 1:2025',
    title: 'Design Earthquake Hazard and Criteria for Earthquake-Resistant Design — General Provisions',
    category: 'Loads & Earthquake',
    level: 'Earthquake Design',
    verifiedFromUpload: true,
    shortDesc:
      'General provisions for earthquake hazard and earthquake-resistant design criteria.',
    purpose:
      'IS 1893 Part 1 gives general earthquake hazard and earthquake-resistant design criteria for structures. It includes earthquake ground shaking, design earthquake forces, analysis approach, geotechnical aspects and architectural elements/utilities protection.',
    whereUsed: [
      'Earthquake-resistant structural design',
      'Seismic hazard and zone consideration',
      'Design earthquake force calculation',
      'Earthquake load combinations',
      'Soil and liquefaction considerations',
      'Protection of architectural elements and utilities',
    ],
    importantTopics: [
      'Earthquake hazard and ground shaking',
      'Structural configuration and performance expectation',
      'Design earthquake forces',
      'Seismic weight and importance factor concept',
      'Methods of earthquake analysis',
      'Load combinations for earthquake effects',
      'Soil-structure interaction and liquefaction aspects',
      'Architectural elements and utilities safety',
    ],
    practicalUse: [
      'Use for seismic design basis and load combinations.',
      'Use with IS 456 and IS 13920 for RCC buildings.',
      'Use with relevant IS 1893 parts for specific structure type.',
      'Use during design review for earthquake-prone sites.',
    ],
    relatedTools: [
      { name: 'Structural Analysis', href: '/dashboard/calculators/structural-analysis' },
      { name: 'RCC Beam Design', href: '/dashboard/calculators/beam' },
      { name: 'Column Design', href: '/dashboard/calculators/column' },
    ],
    commonMistakes: [
      'Ignoring earthquake load in seismic regions.',
      'Using old seismic assumptions without checking latest standard.',
      'Ignoring architectural elements and utilities safety.',
      'Poor structural configuration causing irregular seismic behavior.',
      'Not coordinating seismic design with ductile detailing.',
    ],
    note:
      'Earthquake design is high-risk structural work. Final design must be done by qualified structural engineer using latest official BIS standard.',
  },
  {
    slug: 'is-875-part-1',
    code: 'IS 875 Part 1:1987',
    title: 'Design Loads for Buildings and Structures — Dead Loads',
    category: 'Loads & Earthquake',
    level: 'Loading Code',
    verifiedFromUpload: true,
    shortDesc:
      'Code for dead loads and unit weights of building materials and stored materials.',
    purpose:
      'IS 875 Part 1 is used to determine dead loads in buildings and structures using unit weights of building materials and stored materials.',
    whereUsed: [
      'Dead load calculation',
      'Slab load calculation',
      'Wall load calculation',
      'Floor finish load estimation',
      'Structural analysis load input',
      'BOQ and quantity estimation cross-checking',
    ],
    importantTopics: [
      'Dead load concept',
      'Unit weights of building materials',
      'Stored material weights',
      'Self weight of structural and non-structural elements',
      'Load calculation for analysis and design',
    ],
    practicalUse: [
      'Use while preparing structural analysis load cases.',
      'Use for calculating self-weight and dead loads.',
      'Use with IS 875 other parts for imposed load and wind load.',
      'Use with IS 456/IS 800 design checks.',
    ],
    relatedTools: [
      { name: 'Structural Analysis', href: '/dashboard/calculators/structural-analysis' },
      { name: 'BOQ Generator', href: '/dashboard/calculators/boq-generator' },
      { name: 'Slab Design', href: '/dashboard/calculators/slab' },
    ],
    commonMistakes: [
      'Ignoring floor finish load.',
      'Using random unit weights without checking standard/project data.',
      'Missing wall load on beams.',
      'Mixing dead load and imposed load incorrectly.',
      'Not considering stored material load where applicable.',
    ],
    note:
      'Exact unit weights should be taken from official IS 875 Part 1 tables or project specifications.',
  },

  {
    slug: 'is-875-part-2',
    code: 'IS 875 Part 2',
    title: 'Design Loads — Imposed Loads',
    category: 'Loads & Earthquake',
    level: 'Loading Code',
    verifiedFromUpload: false,
    shortDesc:
      'Used for imposed/live loads on floors, roofs and building occupancy areas.',
    purpose:
      'This part is generally used to select live loads based on occupancy and use of building areas.',
    whereUsed: [
      'Floor live load selection',
      'Residential and commercial building design',
      'Roof live load checks',
      'Staircase and corridor loading',
    ],
    importantTopics: [
      'Imposed load concept',
      'Occupancy-based floor loading',
      'Roof loading',
      'Load reduction where applicable',
    ],
    practicalUse: [
      'Use with IS 875 Part 1 for gravity load cases.',
      'Use in structural analysis model load definition.',
    ],
    relatedTools: [
      { name: 'Structural Analysis', href: '/dashboard/calculators/structural-analysis' },
      { name: 'Slab Design', href: '/dashboard/calculators/slab' },
    ],
    commonMistakes: [
      'Using same live load for all room types.',
      'Ignoring staircase and corridor loading.',
      'Not checking building occupancy.',
    ],
    note: 'PDF/source not added yet. Add official PDF later for more accurate summary.',
  },
  {
    slug: 'is-875-part-3',
    code: 'IS 875 Part 3',
    title: 'Design Loads — Wind Loads',
    category: 'Loads & Earthquake',
    level: 'Wind Load Code',
    verifiedFromUpload: false,
    shortDesc:
      'Used for wind load calculation on buildings and structures.',
    purpose:
      'This code is used to calculate design wind pressure and wind effects on buildings and structures.',
    whereUsed: [
      'Tall building wind load',
      'Industrial shed design',
      'Roof sheet and cladding design',
      'Tower and frame lateral load checks',
    ],
    importantTopics: [
      'Basic wind speed',
      'Risk and terrain factors',
      'Design wind pressure',
      'Pressure coefficients',
      'Cladding and roof wind effects',
    ],
    practicalUse: [
      'Use for lateral load calculation in structural analysis.',
      'Use with IS 800 for steel structures and IS 456 for RCC structures.',
    ],
    relatedTools: [
      { name: 'Structural Analysis', href: '/dashboard/calculators/structural-analysis' },
    ],
    commonMistakes: [
      'Ignoring terrain and height effects.',
      'Not checking cladding pressure.',
      'Using wind load only for main frame and ignoring roof sheets.',
    ],
    note: 'PDF/source not added yet. Add official PDF later for detailed summary.',
  },
  {
    slug: 'is-800',
    code: 'IS 800',
    title: 'General Construction in Steel — Code of Practice',
    category: 'Steel Structures',
    level: 'Steel Design Code',
    verifiedFromUpload: false,
    shortDesc:
      'Primary Indian code for steel structure design and construction.',
    purpose:
      'IS 800 is used for steel member design, connections and structural steel construction practice.',
    whereUsed: [
      'Steel beam and column design',
      'Industrial shed design',
      'Truss and gantry structure design',
      'Steel connection design',
    ],
    importantTopics: [
      'Limit state design of steel structures',
      'Tension and compression members',
      'Flexural members',
      'Connections',
      'Serviceability and stability',
    ],
    practicalUse: [
      'Use for industrial steel structures and steel frames.',
      'Use with IS 875 for loads.',
    ],
    relatedTools: [
      { name: 'Steel Weight Calculator', href: '/dashboard/calculators/steel-weight' },
      { name: 'Truss Analysis', href: '/dashboard/calculators/truss-analysis' },
    ],
    commonMistakes: [
      'Ignoring buckling in compression members.',
      'Incorrect connection assumptions.',
      'Not checking serviceability.',
    ],
    note: 'PDF/source not added yet.',
  },
  {
    slug: 'is-1786',
    code: 'IS 1786',
    title: 'High Strength Deformed Steel Bars and Wires for Concrete Reinforcement',
    category: 'Materials & Testing',
    level: 'Steel Material Code',
    verifiedFromUpload: false,
    shortDesc:
      'Specification for reinforcement steel bars used in RCC work.',
    purpose:
      'This code is used for reinforcement bar material specification and quality checking.',
    whereUsed: [
      'Rebar procurement',
      'Steel quality checking',
      'RCC reinforcement work',
      'Material test report review',
    ],
    importantTopics: [
      'Reinforcement grade',
      'Mechanical properties',
      'Bar marking and identification',
      'Testing and acceptance',
    ],
    practicalUse: [
      'Use while approving steel reinforcement on site.',
      'Use with BBS and RCC design drawings.',
    ],
    relatedTools: [
      { name: 'Steel Weight Calculator', href: '/dashboard/calculators/steel-weight' },
      { name: 'BBS Generator', href: '/dashboard/calculators/bbs-generator' },
    ],
    commonMistakes: [
      'Using unapproved steel grade.',
      'No test certificate checking.',
      'Mixing different steel grades without approval.',
    ],
    note: 'PDF/source not added yet.',
  },
  {
    slug: 'is-2502',
    code: 'IS 2502',
    title: 'Bending and Fixing of Bars for Concrete Reinforcement',
    category: 'Construction Practice',
    level: 'Rebar Practice',
    verifiedFromUpload: false,
    shortDesc:
      'Guide for bending and fixing reinforcement bars in concrete construction.',
    purpose:
      'This code is used for reinforcement bar bending, fixing and detailing practice on site.',
    whereUsed: [
      'BBS preparation',
      'Bar bending schedule checking',
      'Rebar cutting and bending',
      'Site reinforcement fixing',
    ],
    importantTopics: [
      'Bar bending practice',
      'Hook and bend detailing',
      'Fixing reinforcement',
      'Bar scheduling basics',
    ],
    practicalUse: [
      'Use with BBS Generator and structural drawings.',
      'Use before reinforcement fabrication at site.',
    ],
    relatedTools: [
      { name: 'BBS Generator', href: '/dashboard/calculators/bbs-generator' },
      { name: 'Development Length Calculator', href: '/dashboard/calculators/development-length' },
      { name: 'Lap Length Calculator', href: '/dashboard/calculators/lap-length' },
    ],
    commonMistakes: [
      'Wrong bend shape.',
      'Incorrect cutting length.',
      'No allowance for bends/hooks.',
      'Poor bar fixing on site.',
    ],
    note: 'PDF/source not added yet.',
  },
  {
    slug: 'is-383',
    code: 'IS 383',
    title: 'Coarse and Fine Aggregates for Concrete',
    category: 'Materials & Testing',
    level: 'Aggregate Code',
    verifiedFromUpload: false,
    shortDesc:
      'Specification for coarse and fine aggregates used in concrete.',
    purpose:
      'This code is used to check aggregate quality, grading and suitability for concrete.',
    whereUsed: [
      'Aggregate approval',
      'Concrete mix design',
      'Site material testing',
      'RMC quality control',
    ],
    importantTopics: [
      'Fine aggregate requirements',
      'Coarse aggregate requirements',
      'Aggregate grading',
      'Deleterious material control',
    ],
    practicalUse: [
      'Use with IS 10262 during concrete mix proportioning.',
      'Use while approving sand and aggregate on site.',
    ],
    relatedTools: [
      { name: 'Concrete Mix Calculator', href: '/dashboard/calculators/concrete-volume' },
      { name: 'Testing Guide', href: '/dashboard/knowledge-hub/testing' },
    ],
    commonMistakes: [
      'Using poor quality sand.',
      'Ignoring aggregate grading.',
      'Not checking silt/impurities.',
    ],
    note: 'PDF/source not added yet.',
  },
  {
    slug: 'is-516',
    code: 'IS 516',
    title: 'Methods of Tests for Strength of Concrete',
    category: 'Materials & Testing',
    level: 'Concrete Testing',
    verifiedFromUpload: false,
    shortDesc:
      'Used for concrete strength testing methods such as cube/compression testing.',
    purpose:
      'This standard is used for testing concrete strength and interpreting concrete test results.',
    whereUsed: [
      'Cube test',
      'Compressive strength testing',
      'Concrete quality control',
      'Lab testing',
    ],
    importantTopics: [
      'Concrete specimen testing',
      'Compressive strength test',
      'Testing procedure and reporting',
    ],
    practicalUse: [
      'Use for QA/QC concrete strength verification.',
      'Use with site cube sampling and lab testing.',
    ],
    relatedTools: [
      { name: 'Testing Guide', href: '/dashboard/knowledge-hub/testing' },
    ],
    commonMistakes: [
      'Improper cube curing.',
      'Wrong cube identification.',
      'Testing damaged samples.',
    ],
    note: 'PDF/source not added yet.',
  },
  {
    slug: 'is-1199',
    code: 'IS 1199',
    title: 'Methods of Sampling and Analysis of Concrete',
    category: 'Materials & Testing',
    level: 'Fresh Concrete Testing',
    verifiedFromUpload: false,
    shortDesc:
      'Used for fresh concrete sampling and workability-related testing.',
    purpose:
      'This standard is used for sampling and testing fresh concrete on site/lab.',
    whereUsed: [
      'Slump test',
      'Fresh concrete sampling',
      'Workability checking',
      'Concrete acceptance support',
    ],
    importantTopics: [
      'Sampling fresh concrete',
      'Workability tests',
      'Site concrete checks',
    ],
    practicalUse: [
      'Use during concrete receiving and casting.',
      'Use with cube sampling and slump testing.',
    ],
    relatedTools: [
      { name: 'Testing Guide', href: '/dashboard/knowledge-hub/testing' },
    ],
    commonMistakes: [
      'Testing delayed sample.',
      'Adding water before slump test without approval.',
      'Improper sampling from mixer/transit mixer.',
    ],
    note: 'PDF/source not added yet.',
  },
  {
    slug: 'is-1904',
    code: 'IS 1904',
    title: 'Design and Construction of Foundations in Soils',
    category: 'Soil & Foundation',
    level: 'Foundation Code',
    verifiedFromUpload: false,
    shortDesc:
      'Foundation design and construction practice for soil-supported foundations.',
    purpose:
      'This code is used for general foundation design and construction considerations based on soil conditions.',
    whereUsed: [
      'Shallow foundation design',
      'Foundation construction checks',
      'Soil condition review',
      'Settlement and bearing consideration',
    ],
    importantTopics: [
      'Foundation type selection',
      'Bearing capacity consideration',
      'Settlement consideration',
      'Foundation construction practice',
    ],
    practicalUse: [
      'Use with soil investigation report.',
      'Use before finalizing foundation type and depth.',
    ],
    relatedTools: [
      { name: 'Footing Design', href: '/dashboard/calculators/footing' },
      { name: 'Construction Process', href: '/dashboard/knowledge-hub/construction-process' },
    ],
    commonMistakes: [
      'Foundation design without soil data.',
      'Ignoring water table and settlement.',
      'Wrong foundation depth selection.',
    ],
    note: 'PDF/source not added yet.',
  },
  {
    slug: 'is-2911',
    code: 'IS 2911',
    title: 'Design and Construction of Pile Foundations',
    category: 'Soil & Foundation',
    level: 'Pile Foundation',
    verifiedFromUpload: false,
    shortDesc:
      'Used for design and construction of pile foundations.',
    purpose:
      'This standard series is used for pile foundation design, execution and load testing reference.',
    whereUsed: [
      'Pile foundation design',
      'Bored cast-in-situ piles',
      'Driven piles',
      'Pile load test planning',
      'Deep foundation projects',
    ],
    importantTopics: [
      'Pile types',
      'Pile capacity',
      'Construction methods',
      'Pile group action',
      'Pile testing',
    ],
    practicalUse: [
      'Use for deep foundation projects.',
      'Use with geotechnical investigation report.',
    ],
    relatedTools: [
      { name: 'Footing Design', href: '/dashboard/calculators/footing' },
    ],
    commonMistakes: [
      'Ignoring geotechnical report.',
      'No pile integrity/load testing plan.',
      'Poor pile verticality control.',
    ],
    note: 'PDF/source not added yet.',
  },
  {
    slug: 'is-2720',
    code: 'IS 2720',
    title: 'Methods of Test for Soils',
    category: 'Soil & Foundation',
    level: 'Soil Testing',
    verifiedFromUpload: false,
    shortDesc:
      'Series of standards for soil testing methods.',
    purpose:
      'IS 2720 series is used for soil testing such as moisture content, density, compaction, shear strength and classification.',
    whereUsed: [
      'Soil investigation',
      'Field density testing',
      'Compaction control',
      'Foundation design input',
      'Road and earthwork quality control',
    ],
    importantTopics: [
      'Moisture content',
      'Specific gravity',
      'Atterberg limits',
      'Compaction test',
      'Field density test',
      'Shear strength tests',
    ],
    practicalUse: [
      'Use with geotechnical report and field quality control.',
      'Use for road, filling and foundation work.',
    ],
    relatedTools: [
      { name: 'Testing Guide', href: '/dashboard/knowledge-hub/testing' },
    ],
    commonMistakes: [
      'Using soil values without test reports.',
      'Poor sampling.',
      'Ignoring moisture-density relationship.',
    ],
    note: 'PDF/source not added yet.',
  },
  {
    slug: 'is-1077',
    code: 'IS 1077',
    title: 'Common Burnt Clay Building Bricks',
    category: 'Masonry',
    level: 'Brick Material Code',
    verifiedFromUpload: false,
    shortDesc:
      'Specification for common burnt clay building bricks.',
    purpose:
      'This code is used for brick classification and quality requirements in building work.',
    whereUsed: [
      'Brick approval',
      'Brickwork construction',
      'Material testing',
      'Masonry quality control',
    ],
    importantTopics: [
      'Brick classification',
      'Dimensional tolerance',
      'Strength and water absorption requirements',
      'Visual quality requirements',
    ],
    practicalUse: [
      'Use before approving bricks on site.',
      'Use with brickwork checklist and testing guide.',
    ],
    relatedTools: [
      { name: 'Brickwork Calculator', href: '/dashboard/calculators/brickwork' },
      { name: 'Testing Guide', href: '/dashboard/knowledge-hub/testing' },
    ],
    commonMistakes: [
      'Using overburnt or underburnt bricks.',
      'No water absorption/strength check.',
      'Poor brick storage.',
    ],
    note: 'PDF/source not added yet.',
  },
  {
    slug: 'is-3495',
    code: 'IS 3495',
    title: 'Methods of Tests of Burnt Clay Building Bricks',
    category: 'Materials & Testing',
    level: 'Brick Testing',
    verifiedFromUpload: false,
    shortDesc:
      'Used for testing burnt clay bricks such as compressive strength and water absorption.',
    purpose:
      'This standard is used for brick testing and quality verification.',
    whereUsed: [
      'Brick compressive strength test',
      'Water absorption test',
      'Efflorescence test',
      'Brick quality approval',
    ],
    importantTopics: [
      'Compressive strength testing',
      'Water absorption',
      'Efflorescence checking',
      'Dimensional checks',
    ],
    practicalUse: [
      'Use for brick procurement and site quality control.',
    ],
    relatedTools: [
      { name: 'Brickwork Calculator', href: '/dashboard/calculators/brickwork' },
      { name: 'Testing Guide', href: '/dashboard/knowledge-hub/testing' },
    ],
    commonMistakes: [
      'Approving bricks only visually.',
      'Ignoring efflorescence.',
      'Not testing water absorption.',
    ],
    note: 'PDF/source not added yet.',
  },
]
