export const interviewTopics = [
  {
    slug: 'fresher-civil-engineer',
    title: 'Fresher Civil Engineer Interview',
    level: 'Fresher',
    shortDesc:
      'Basic civil engineering questions for freshers, diploma students and site trainee roles.',
    tags: ['Fresher', 'Basic Civil', 'Site Trainee'],
    purpose:
      'This section helps freshers prepare basic civil engineering interview questions with simple and practical answers.',
    skills: [
      'Basic material knowledge',
      'Drawing reading basics',
      'Site execution awareness',
      'Concrete and reinforcement basics',
      'Measurement and estimation basics',
    ],
    questions: [
      {
        q: 'What is civil engineering?',
        a: 'Civil engineering is the branch of engineering that deals with planning, design, construction and maintenance of structures like buildings, roads, bridges, dams, canals and infrastructure projects.',
        keyPoints: ['Planning', 'Design', 'Construction', 'Maintenance'],
      },
      {
        q: 'What is the difference between PCC and RCC?',
        a: 'PCC means Plain Cement Concrete. It has cement, sand, aggregate and water but no reinforcement. RCC means Reinforced Cement Concrete. It contains steel reinforcement along with concrete to resist tensile forces.',
        keyPoints: ['PCC has no steel', 'RCC has reinforcement', 'RCC is structural'],
      },
      {
        q: 'What is concrete grade M20?',
        a: 'M20 means concrete having characteristic compressive strength of 20 N/mm² after 28 days of curing. It is commonly used in RCC work.',
        keyPoints: ['M means mix', '20 means strength', '28 days strength'],
      },
      {
        q: 'Why is curing required?',
        a: 'Curing maintains moisture in concrete so that cement hydration continues properly. It improves strength, durability and reduces shrinkage cracks.',
        keyPoints: ['Hydration', 'Strength gain', 'Crack control', 'Durability'],
      },
      {
        q: 'What is water-cement ratio?',
        a: 'Water-cement ratio is the ratio of weight of water to weight of cement in concrete mix. It affects workability, strength and durability of concrete.',
        keyPoints: ['Water / Cement', 'Controls strength', 'Controls workability'],
      },
      {
        q: 'What is cover in RCC?',
        a: 'Concrete cover is the distance between the outer surface of concrete and the nearest reinforcement bar. It protects steel from corrosion and fire.',
        keyPoints: ['Protects steel', 'Prevents corrosion', 'Maintains durability'],
      },
      {
        q: 'What is lap length?',
        a: 'Lap length is the overlapping length provided when two reinforcement bars are joined to transfer stress safely from one bar to another.',
        keyPoints: ['Bar joining', 'Stress transfer', 'As per design/code'],
      },
      {
        q: 'What is slump test?',
        a: 'Slump test is used to measure workability or consistency of fresh concrete before placing.',
        keyPoints: ['Fresh concrete test', 'Workability', 'Measured in mm'],
      },
    ],
    hrQuestions: [
      'Tell me about yourself.',
      'Why did you choose civil engineering?',
      'Why should we hire you as a fresher?',
      'Are you comfortable working on site?',
      'What are your strengths and weaknesses?',
    ],
  },
  {
    slug: 'site-engineer',
    title: 'Site Engineer Interview',
    level: 'Site Role',
    shortDesc:
      'Practical interview questions for building site engineer, execution engineer and junior engineer roles.',
    tags: ['Site Engineer', 'Execution', 'Quality'],
    purpose:
      'This section prepares site engineers for practical site execution, quality, safety and coordination questions.',
    skills: [
      'Drawing reading',
      'Line and level checking',
      'Material management',
      'Labour supervision',
      'Quality and safety control',
    ],
    questions: [
      {
        q: 'What are the daily responsibilities of a site engineer?',
        a: 'A site engineer checks drawings, manages labour, supervises work, checks line and level, monitors material, ensures quality and safety, and reports daily progress.',
        keyPoints: ['Supervision', 'Quality', 'Safety', 'Progress report'],
      },
      {
        q: 'What do you check before footing concrete?',
        a: 'Before footing concrete, check excavation level, PCC, footing size, reinforcement diameter and spacing, cover blocks, column starter bars, shuttering, concrete grade and site approval.',
        keyPoints: ['Level', 'Reinforcement', 'Cover', 'Starter bars', 'Concrete grade'],
      },
      {
        q: 'How do you check column verticality?',
        a: 'Column verticality can be checked using plumb bob, spirit level, line dori or total station depending on site requirement.',
        keyPoints: ['Plumb bob', 'Spirit level', 'Total station', 'Alignment'],
      },
      {
        q: 'What causes honeycombing in concrete?',
        a: 'Honeycombing happens due to poor vibration, stiff concrete mix, shuttering leakage, congested reinforcement or improper concrete placing.',
        keyPoints: ['Poor vibration', 'Low workability', 'Leakage', 'Congestion'],
      },
      {
        q: 'What is the importance of cover blocks?',
        a: 'Cover blocks maintain required concrete cover around reinforcement and protect steel from corrosion, fire and environmental exposure.',
        keyPoints: ['Maintains cover', 'Protects steel', 'Improves durability'],
      },
      {
        q: 'What checks are required before slab casting?',
        a: 'Before slab casting, check shuttering level, props, slab thickness, reinforcement spacing, cover, chairs, electrical conduits, sleeves, cleaning and concrete arrangement.',
        keyPoints: ['Shuttering', 'Rebar', 'Conduits', 'Cleaning', 'Concrete'],
      },
      {
        q: 'How do you control site material wastage?',
        a: 'Material wastage is controlled by proper storage, correct measurement, skilled labour, daily consumption tracking, avoiding rework and using BOQ-based planning.',
        keyPoints: ['Storage', 'Tracking', 'Measurement', 'Avoid rework'],
      },
      {
        q: 'How do you handle wrong work done on site?',
        a: 'First stop the work, compare with approved drawing, inform senior engineer, record the issue, decide rectification method and restart only after approval.',
        keyPoints: ['Stop work', 'Check drawing', 'Inform senior', 'Rectify'],
      },
    ],
    hrQuestions: [
      'How do you handle labour pressure on site?',
      'Can you work in outdoor site conditions?',
      'How do you report daily progress?',
      'How do you manage conflict with contractor?',
      'Are you comfortable with overtime during casting?',
    ],
  },
  {
    slug: 'qa-qc-engineer',
    title: 'QA/QC Engineer Interview',
    level: 'Quality Role',
    shortDesc:
      'Quality control questions for concrete, reinforcement, material testing and inspection roles.',
    tags: ['QA/QC', 'Testing', 'Inspection'],
    purpose:
      'This section helps prepare for quality engineer interviews covering inspection, testing, documentation and quality control.',
    skills: [
      'Material inspection',
      'Concrete testing',
      'Checklist preparation',
      'Quality documentation',
      'NCR and rectification handling',
    ],
    questions: [
      {
        q: 'What is QA and QC?',
        a: 'QA means Quality Assurance. It is process-oriented and prevents defects. QC means Quality Control. It is product-oriented and checks whether work meets required standards.',
        keyPoints: ['QA prevents defects', 'QC checks output', 'Both ensure quality'],
      },
      {
        q: 'What tests are done for fresh concrete?',
        a: 'Common fresh concrete tests include slump test, temperature check, workability check and sampling for cube test.',
        keyPoints: ['Slump', 'Temperature', 'Cube sampling', 'Workability'],
      },
      {
        q: 'What is cube test?',
        a: 'Cube test is used to determine compressive strength of hardened concrete at 7 days or 28 days.',
        keyPoints: ['Compressive strength', '7 days', '28 days', 'Concrete grade'],
      },
      {
        q: 'What is an inspection checklist?',
        a: 'Inspection checklist is a document used to verify site work before approval. It includes drawing checks, material checks, workmanship checks and safety/quality points.',
        keyPoints: ['Verification', 'Approval', 'Quality record', 'Checklist'],
      },
      {
        q: 'What is NCR?',
        a: 'NCR means Non-Conformance Report. It is issued when work or material does not meet approved drawings, specifications or quality standards.',
        keyPoints: ['Non-conformance', 'Quality issue', 'Correction needed'],
      },
      {
        q: 'How do you inspect reinforcement before concrete?',
        a: 'Check bar diameter, spacing, number of bars, lap length, development length, cover blocks, chairs, binding and cleanliness before concrete.',
        keyPoints: ['Diameter', 'Spacing', 'Lap', 'Cover', 'Cleanliness'],
      },
      {
        q: 'What causes low concrete strength?',
        a: 'Low strength may happen due to excess water, wrong mix, poor compaction, poor curing, bad materials, delayed concrete placing or testing error.',
        keyPoints: ['Excess water', 'Poor curing', 'Wrong mix', 'Testing error'],
      },
      {
        q: 'What is material approval?',
        a: 'Material approval is the process of verifying material brand, test report, specification and sample before allowing use on site.',
        keyPoints: ['Specification', 'Sample', 'Test report', 'Approval'],
      },
    ],
    hrQuestions: [
      'How do you reject poor quality work?',
      'How do you handle pressure from execution team?',
      'How do you maintain quality records?',
      'What will you do if concrete slump is not acceptable?',
      'How do you communicate NCR to contractor?',
    ],
  },
  {
    slug: 'estimation-boq',
    title: 'Estimation & BOQ Interview',
    level: 'Quantity Survey',
    shortDesc:
      'BOQ, estimation, quantity takeoff, rate analysis and billing interview questions.',
    tags: ['BOQ', 'Estimation', 'Billing'],
    purpose:
      'This section prepares civil engineers for estimation, billing, quantity survey and BOQ-related interviews.',
    skills: [
      'Quantity takeoff',
      'BOQ preparation',
      'Rate analysis',
      'Measurement sheet',
      'Contractor billing',
    ],
    questions: [
      {
        q: 'What is BOQ?',
        a: 'BOQ means Bill of Quantities. It is a document that lists construction items with description, unit, quantity, rate and amount.',
        keyPoints: ['Item description', 'Unit', 'Quantity', 'Rate', 'Amount'],
      },
      {
        q: 'What is quantity takeoff?',
        a: 'Quantity takeoff is the process of calculating construction quantities from drawings for estimation, BOQ and billing.',
        keyPoints: ['Drawing measurement', 'Quantity calculation', 'BOQ'],
      },
      {
        q: 'Which unit is used for concrete?',
        a: 'Concrete is generally measured in cubic meter, written as m³.',
        keyPoints: ['Volume item', 'm³', 'Length × Width × Depth'],
      },
      {
        q: 'Which unit is used for plaster?',
        a: 'Plaster is generally measured in square meter, written as m².',
        keyPoints: ['Area item', 'm²', 'Length × Height'],
      },
      {
        q: 'How do you calculate steel weight?',
        a: 'Steel weight can be calculated using formula D²/162 kg per meter, where D is bar diameter in mm.',
        keyPoints: ['D²/162', 'kg/m', 'Diameter in mm'],
      },
      {
        q: 'What is rate analysis?',
        a: 'Rate analysis is the calculation of item rate by considering material cost, labour cost, machinery, wastage, overhead and profit.',
        keyPoints: ['Material', 'Labour', 'Wastage', 'Overhead', 'Profit'],
      },
      {
        q: 'What is contractor running bill?',
        a: 'Running bill is a periodic bill prepared based on completed work quantity multiplied by approved BOQ rate after measurement verification.',
        keyPoints: ['Completed quantity', 'Approved rate', 'Measurement', 'Payment'],
      },
      {
        q: 'What are common BOQ mistakes?',
        a: 'Common mistakes include wrong unit, missing items, double counting, unclear description, no deduction of openings and wrong rate application.',
        keyPoints: ['Wrong unit', 'Missing item', 'Double counting', 'Wrong rate'],
      },
    ],
    hrQuestions: [
      'How do you cross-check quantities?',
      'How do you handle rate variation?',
      'How do you prepare contractor bill?',
      'Which software do you use for estimation?',
      'How do you avoid BOQ errors?',
    ],
  },
  {
    slug: 'rcc-structure',
    title: 'RCC Structure Interview',
    level: 'Structural Basics',
    shortDesc:
      'RCC beam, slab, column, footing, reinforcement and concrete interview questions.',
    tags: ['RCC', 'Reinforcement', 'Concrete'],
    purpose:
      'This section covers common RCC structure questions asked in site and design-related civil interviews.',
    skills: [
      'RCC basics',
      'Beam-column-slab understanding',
      'Reinforcement detailing',
      'Load transfer concept',
      'Concrete quality checks',
    ],
    questions: [
      {
        q: 'What is RCC?',
        a: 'RCC stands for Reinforced Cement Concrete. It is concrete combined with steel reinforcement to resist compression and tension forces.',
        keyPoints: ['Concrete resists compression', 'Steel resists tension', 'Composite action'],
      },
      {
        q: 'Why steel is used in concrete?',
        a: 'Concrete is strong in compression but weak in tension. Steel is used to resist tensile forces and improve structural strength.',
        keyPoints: ['Tension resistance', 'Ductility', 'Strength'],
      },
      {
        q: 'What is the function of stirrups in beam?',
        a: 'Stirrups resist shear force, hold main bars in position and help prevent shear cracks.',
        keyPoints: ['Shear resistance', 'Holds bars', 'Crack control'],
      },
      {
        q: 'What is one-way slab?',
        a: 'A slab is one-way when it mainly bends in one direction and load transfers to two opposite supports. Generally, if longer span/shorter span ratio is greater than 2, it acts as one-way slab.',
        keyPoints: ['One direction bending', 'Two supports', 'Ly/Lx greater than 2'],
      },
      {
        q: 'What is two-way slab?',
        a: 'A two-way slab bends in both directions and transfers load to all four supports. Generally, if longer span/shorter span ratio is less than or equal to 2, it acts as two-way slab.',
        keyPoints: ['Two direction bending', 'Four supports', 'Ly/Lx less or equal 2'],
      },
      {
        q: 'What is development length?',
        a: 'Development length is the length of reinforcement required to develop full bond stress between steel and concrete.',
        keyPoints: ['Bond', 'Anchorage', 'Stress transfer'],
      },
      {
        q: 'Why extra top bars are provided near supports?',
        a: 'Extra top bars are provided near supports to resist negative bending moment in continuous beams and slabs.',
        keyPoints: ['Negative moment', 'Support region', 'Top reinforcement'],
      },
      {
        q: 'What is punching shear?',
        a: 'Punching shear is a two-way shear failure that can occur around columns in flat slabs or footings due to concentrated load.',
        keyPoints: ['Column zone', 'Two-way shear', 'Flat slab/footing'],
      },
    ],
    hrQuestions: [
      'Are you comfortable reading structural drawings?',
      'How do you check reinforcement on site?',
      'How do you report reinforcement mismatch?',
      'What will you check before RCC casting?',
      'How do you handle urgent casting pressure?',
    ],
  },
  {
    slug: 'concrete-technology',
    title: 'Concrete Technology Interview',
    level: 'Technical',
    shortDesc:
      'Concrete mix, workability, curing, admixtures, defects and testing questions.',
    tags: ['Concrete', 'Mix Design', 'Testing'],
    purpose:
      'This section helps prepare technical concrete questions for site, QA/QC and fresher interviews.',
    skills: [
      'Concrete mix understanding',
      'Workability and slump',
      'Curing knowledge',
      'Defect identification',
      'Concrete testing',
    ],
    questions: [
      {
        q: 'What are the ingredients of concrete?',
        a: 'Concrete is made of cement, fine aggregate, coarse aggregate, water and sometimes admixtures.',
        keyPoints: ['Cement', 'Sand', 'Aggregate', 'Water', 'Admixture'],
      },
      {
        q: 'What is workability?',
        a: 'Workability is the ease with which fresh concrete can be mixed, placed, compacted and finished without segregation.',
        keyPoints: ['Ease of placing', 'Compaction', 'No segregation'],
      },
      {
        q: 'What is segregation?',
        a: 'Segregation is the separation of coarse aggregate from cement mortar due to excess water, poor handling or improper placing.',
        keyPoints: ['Separation', 'Excess water', 'Poor placing'],
      },
      {
        q: 'What is bleeding?',
        a: 'Bleeding is the upward movement of water in fresh concrete after placing and before setting.',
        keyPoints: ['Water rising', 'Fresh concrete', 'Surface weakness'],
      },
      {
        q: 'What is admixture?',
        a: 'Admixture is a material added to concrete to modify its properties like workability, setting time, strength or durability.',
        keyPoints: ['Workability', 'Setting time', 'Durability'],
      },
      {
        q: 'What is initial and final setting time of cement?',
        a: 'Initial setting time is the time when cement paste starts losing plasticity. Final setting time is when it becomes sufficiently hard. Exact values depend on cement standard and test.',
        keyPoints: ['Initial set', 'Final set', 'Cement test'],
      },
      {
        q: 'What is the effect of excess water in concrete?',
        a: 'Excess water increases workability but reduces strength, increases shrinkage, causes bleeding and reduces durability.',
        keyPoints: ['Low strength', 'Bleeding', 'Shrinkage', 'Poor durability'],
      },
      {
        q: 'What is compaction of concrete?',
        a: 'Compaction removes entrapped air from concrete and helps achieve dense concrete with better strength and durability.',
        keyPoints: ['Removes air', 'Improves density', 'Prevents honeycombing'],
      },
    ],
    hrQuestions: [
      'How do you handle low slump concrete?',
      'What will you do if concrete is delayed?',
      'How do you prevent honeycombing?',
      'How do you ensure proper curing?',
      'What concrete tests have you seen?',
    ],
  },
  {
    slug: 'safety-interview',
    title: 'Construction Safety Interview',
    level: 'Safety Basics',
    shortDesc:
      'PPE, excavation safety, work at height, electrical safety and emergency response questions.',
    tags: ['Safety', 'PPE', 'Hazard'],
    purpose:
      'This section prepares basic construction safety questions commonly asked for site roles.',
    skills: [
      'Hazard identification',
      'PPE knowledge',
      'Emergency response',
      'Safe work method',
      'Site safety awareness',
    ],
    questions: [
      {
        q: 'What is PPE?',
        a: 'PPE means Personal Protective Equipment. It includes helmet, safety shoes, gloves, goggles, reflective jacket, mask and safety harness.',
        keyPoints: ['Helmet', 'Shoes', 'Gloves', 'Harness'],
      },
      {
        q: 'What safety checks are required for excavation?',
        a: 'Check barricading, safe access ladder, soil stability, shoring or slope, dewatering, underground utilities and distance of excavated soil from trench edge.',
        keyPoints: ['Barricade', 'Access', 'Soil stability', 'Dewatering'],
      },
      {
        q: 'What is work at height safety?',
        a: 'Work at height safety includes guardrails, safety harness, lifeline, safe ladder, covered openings and fall protection system.',
        keyPoints: ['Harness', 'Guardrail', 'Lifeline', 'Fall protection'],
      },
      {
        q: 'What is unsafe act and unsafe condition?',
        a: 'Unsafe act is a risky action by worker, like not wearing helmet. Unsafe condition is a dangerous site condition, like open shaft without cover.',
        keyPoints: ['Unsafe act', 'Unsafe condition', 'Accident prevention'],
      },
      {
        q: 'What should you do in electrical shock case?',
        a: 'First switch off power supply. Do not touch the victim with bare hands while current is live. Use non-conductive support if needed and call medical help.',
        keyPoints: ['Switch off power', 'Do not touch directly', 'Medical help'],
      },
      {
        q: 'Why toolbox talk is important?',
        a: 'Toolbox talk explains daily work hazards, safety precautions, PPE and emergency actions before starting work.',
        keyPoints: ['Daily hazards', 'Safety awareness', 'PPE', 'Emergency'],
      },
      {
        q: 'What is permit to work?',
        a: 'Permit to work is a formal approval system for high-risk activities like hot work, confined space work, height work or electrical work.',
        keyPoints: ['High-risk work', 'Approval', 'Safety control'],
      },
      {
        q: 'What are common site accidents?',
        a: 'Common accidents include falls from height, electrical shock, falling material, equipment accidents, trench collapse and hand injuries.',
        keyPoints: ['Fall', 'Shock', 'Falling object', 'Trench collapse'],
      },
    ],
    hrQuestions: [
      'Will you stop work if safety rules are not followed?',
      'How do you convince workers to wear PPE?',
      'How do you report an incident?',
      'What will you do if contractor ignores safety?',
      'How do you conduct toolbox talk?',
    ],
  },
]
