export const defects = [
  {
    slug: 'honeycombing',
    title: 'Honeycombing in Concrete',
    level: 'Critical',
    image: '/defects/honeycombing.png',
    shortDesc:
      'Voids and cavities in concrete surface due to poor compaction, congested reinforcement or improper concrete placement.',
    tags: ['Concrete', 'RCC', 'Compaction', 'Vibration'],
    whatIsIt:
      'Honeycombing is a concrete defect where voids, holes or exposed aggregate appear on the surface after deshuttering.',
    causes: [
      'Poor vibration during concrete placing.',
      'Concrete mix too stiff or low workability.',
      'Congested reinforcement area.',
      'Improper concrete pouring method.',
      'Shuttering leakage causing cement paste loss.',
      'Concrete dropped from excessive height.',
    ],
    prevention: [
      'Use proper concrete workability as per member requirement.',
      'Use needle vibrator correctly.',
      'Avoid concrete segregation during placing.',
      'Seal shuttering joints properly.',
      'Pour concrete in layers.',
      'Pay extra attention near beam-column joints.',
    ],
    repair: [
      'Remove loose concrete from affected area.',
      'Clean the surface properly.',
      'Apply bonding agent if required.',
      'Fill minor honeycombing with polymer modified mortar.',
      'For deep honeycombing, consult structural engineer.',
      'Do not hide serious honeycombing with plaster directly.',
    ],
    severity:
      'Minor surface honeycombing can be repaired, but deep honeycombing near reinforcement or structural zones is serious.',
  },
  {
    slug: 'concrete-cracks',
    title: 'Cracks in Concrete',
    level: 'Critical',
    image: '/defects/concrete-cracks.png',
    shortDesc:
      'Cracks in RCC members due to shrinkage, settlement, overload, poor curing or structural movement.',
    tags: ['Concrete', 'Cracks', 'RCC', 'Durability'],
    whatIsIt:
      'Concrete cracks are visible separations or lines in concrete caused by tensile stress, shrinkage, movement or poor workmanship.',
    causes: [
      'Plastic shrinkage in fresh concrete.',
      'Drying shrinkage due to water loss.',
      'Poor curing after casting.',
      'Overloading of structural member.',
      'Settlement of foundation or support.',
      'Thermal movement.',
      'Corrosion of reinforcement.',
    ],
    prevention: [
      'Maintain proper water-cement ratio.',
      'Start curing on time.',
      'Provide control joints where required.',
      'Avoid excess water in concrete.',
      'Use proper reinforcement detailing.',
      'Do not remove shuttering or props early.',
    ],
    repair: [
      'Identify whether crack is structural or non-structural.',
      'For hairline cracks, use crack filler or sealant.',
      'For active cracks, monitor movement first.',
      'For structural cracks, use epoxy injection under expert guidance.',
      'Repair cause before covering the crack.',
    ],
    severity:
      'Hairline shrinkage cracks may be minor, but wide, deep or active cracks can indicate structural issues.',
  },
  {
    slug: 'segregation',
    title: 'Concrete Segregation',
    level: 'High',
    image: '/defects/segregation.png',
    shortDesc:
      'Separation of cement paste, sand and aggregate due to poor handling, excess water or improper placing.',
    tags: ['Concrete', 'Mixing', 'Placement', 'Quality'],
    whatIsIt:
      'Segregation occurs when coarse aggregate separates from mortar or cement paste, causing weak and non-uniform concrete.',
    causes: [
      'Excess water in concrete.',
      'Dropping concrete from excessive height.',
      'Improper mix proportion.',
      'Poor transportation of concrete.',
      'Over vibration.',
      'Concrete mix with very high workability.',
    ],
    prevention: [
      'Control water-cement ratio.',
      'Avoid free fall of concrete from large height.',
      'Use chute or tremie where required.',
      'Use proper mix design.',
      'Avoid over vibration.',
      'Place concrete near final position.',
    ],
    repair: [
      'Remove weak segregated concrete if accessible.',
      'Patch repair using suitable repair mortar.',
      'For structural members, get engineer approval.',
      'Do not continue casting if segregation is observed repeatedly.',
    ],
    severity:
      'Segregation reduces concrete strength and durability and should be controlled immediately during casting.',
  },
  {
    slug: 'bleeding',
    title: 'Bleeding in Concrete',
    level: 'Medium',
    image: '',
    shortDesc:
      'Water rising to concrete surface after placing due to excess water or poor mix design.',
    tags: ['Concrete', 'Water', 'Fresh Concrete', 'Surface'],
    whatIsIt:
      'Bleeding is the upward movement of water in freshly placed concrete before setting.',
    causes: [
      'Excess water in mix.',
      'Poor aggregate grading.',
      'Low cement content.',
      'Improper mix design.',
      'Over vibration.',
    ],
    prevention: [
      'Use controlled water-cement ratio.',
      'Use well graded aggregates.',
      'Avoid excessive vibration.',
      'Use proper concrete mix design.',
      'Use admixture carefully if required.',
    ],
    repair: [
      'Do not finish surface while bleed water is present.',
      'Wait until bleed water evaporates.',
      'Improve mix design for future pours.',
      'Avoid adding dry cement on bleeding surface.',
    ],
    severity:
      'Bleeding can create weak surface layer and reduce bond with finishing material.',
  },
  {
    slug: 'efflorescence',
    title: 'Efflorescence',
    level: 'Medium',
    image: '',
    shortDesc:
      'White salt deposits on brickwork, plaster or concrete surface due to moisture movement.',
    tags: ['Brickwork', 'Plaster', 'Moisture', 'Salt'],
    whatIsIt:
      'Efflorescence is white powdery salt deposit appearing on masonry, plaster or concrete surfaces.',
    causes: [
      'Soluble salts in bricks, sand, cement or water.',
      'Moisture movement through wall.',
      'Poor waterproofing.',
      'Dampness in masonry.',
      'Use of salty water or contaminated material.',
    ],
    prevention: [
      'Use good quality bricks and sand.',
      'Avoid saline water.',
      'Provide proper damp proof course.',
      'Prevent water leakage.',
      'Protect masonry from rain during construction.',
    ],
    repair: [
      'Brush dry salt deposits from surface.',
      'Do not wash heavily without stopping moisture source.',
      'Fix leakage or dampness source first.',
      'Use suitable surface treatment after drying.',
    ],
    severity:
      'Efflorescence is usually non-structural, but it indicates moisture movement that should be corrected.',
  },
  {
    slug: 'dampness',
    title: 'Dampness in Walls',
    level: 'High',
    image: '/defects/dampness.png',
    shortDesc:
      'Moisture patches on walls due to leakage, capillary rise, poor waterproofing or plumbing defects.',
    tags: ['Wall', 'Moisture', 'Leakage', 'Waterproofing'],
    whatIsIt:
      'Dampness is the presence of moisture in walls, floors or ceilings causing stains, paint peeling and unhealthy indoor conditions.',
    causes: [
      'No proper damp proof course.',
      'Water leakage from plumbing lines.',
      'Terrace or bathroom waterproofing failure.',
      'Capillary rise from ground.',
      'Cracks allowing rainwater entry.',
      'Poor external plaster or paint protection.',
    ],
    prevention: [
      'Provide proper DPC at plinth level.',
      'Use good waterproofing in wet areas.',
      'Check plumbing pressure before closing walls.',
      'Provide proper slope on terrace and balcony.',
      'Seal external cracks.',
    ],
    repair: [
      'Identify moisture source first.',
      'Repair plumbing leakage if present.',
      'Treat cracks and waterproofing failure.',
      'Remove damaged plaster if required.',
      'Replaster and repaint after surface dries.',
    ],
    severity:
      'Dampness can damage finishes, reduce durability and create long-term maintenance problems.',
  },
  {
    slug: 'plaster-cracks',
    title: 'Plaster Cracks',
    level: 'Medium',
    image: '/defects/plaster-cracks.png',
    shortDesc:
      'Cracks in plaster due to shrinkage, poor curing, no chicken mesh, thick plaster or weak mortar.',
    tags: ['Plaster', 'Cracks', 'Finish', 'Wall'],
    whatIsIt:
      'Plaster cracks are visible cracks on plastered surfaces due to shrinkage, movement or poor workmanship.',
    causes: [
      'Poor curing of plaster.',
      'Excess cement or poor mortar ratio.',
      'No chicken mesh at RCC and masonry junction.',
      'Thick plaster in one coat.',
      'Poor surface preparation.',
      'Movement between different materials.',
    ],
    prevention: [
      'Fix chicken mesh at RCC-masonry junctions.',
      'Prepare surface properly.',
      'Maintain correct mortar ratio.',
      'Avoid excessive plaster thickness.',
      'Cure plaster properly.',
    ],
    repair: [
      'Open crack slightly and clean it.',
      'Fill with suitable crack filler.',
      'For repeated cracks, check joint movement.',
      'Use mesh treatment for junction cracks.',
      'Repaint only after repair and drying.',
    ],
    severity:
      'Most plaster cracks are non-structural, but repeated or wide cracks need investigation.',
  },
  {
    slug: 'hollowness-in-plaster',
    title: 'Hollowness in Plaster',
    level: 'Medium',
    image: '',
    shortDesc:
      'Hollow sound in plaster due to poor bonding, dusty surface or improper curing.',
    tags: ['Plaster', 'Bonding', 'Finish', 'Quality'],
    whatIsIt:
      'Plaster hollowness occurs when plaster loses bond with background surface and produces hollow sound when tapped.',
    causes: [
      'Dusty wall surface before plastering.',
      'No proper wetting before plaster.',
      'Poor mortar bonding.',
      'Thick plaster layer.',
      'Poor curing.',
      'Smooth RCC surface without hacking.',
    ],
    prevention: [
      'Clean and wet surface before plastering.',
      'Hack RCC surface properly.',
      'Use bonding treatment where required.',
      'Maintain proper mortar ratio.',
      'Cure plaster adequately.',
    ],
    repair: [
      'Mark hollow areas by tapping.',
      'Remove hollow plaster patches.',
      'Clean surface and replaster.',
      'Use bonding agent if required.',
    ],
    severity:
      'Hollow plaster may fall or crack later and should be repaired before painting.',
  },
  {
    slug: 'tile-debonding',
    title: 'Tile Debonding',
    level: 'Medium',
    image: '',
    shortDesc:
      'Tiles coming loose due to poor adhesive, hollow bedding, surface dust, movement or water leakage.',
    tags: ['Tiles', 'Flooring', 'Debonding', 'Finish'],
    whatIsIt:
      'Tile debonding occurs when tiles lose adhesion with the base surface and sound hollow or come out.',
    causes: [
      'Poor tile adhesive or mortar application.',
      'Dusty or uneven base surface.',
      'No proper tile soaking where required.',
      'Hollow spots below tiles.',
      'Thermal expansion without joints.',
      'Water leakage below tiles.',
    ],
    prevention: [
      'Prepare clean and level base.',
      'Use proper adhesive as per tile type.',
      'Apply adhesive with correct trowel method.',
      'Provide movement joints where required.',
      'Check hollow sound during laying.',
    ],
    repair: [
      'Remove loose tiles carefully.',
      'Clean old adhesive/mortar.',
      'Fix leakage if present.',
      'Relay tile with proper adhesive.',
      'Fill joints properly.',
    ],
    severity:
      'Tile debonding affects finishing quality and can become a safety issue if tiles loosen completely.',
  },
  {
    slug: 'paint-peeling',
    title: 'Paint Peeling',
    level: 'Low to Medium',
    image: '',
    shortDesc:
      'Paint layer peeling due to dampness, poor surface preparation, no primer or painting on wet plaster.',
    tags: ['Paint', 'Finish', 'Moisture', 'Surface'],
    whatIsIt:
      'Paint peeling is the separation of paint film from wall surface, usually due to moisture or poor surface preparation.',
    causes: [
      'Painting on damp wall.',
      'No primer before paint.',
      'Dust or loose particles on surface.',
      'Poor quality paint.',
      'Water seepage behind paint.',
      'Insufficient drying time between coats.',
    ],
    prevention: [
      'Ensure plaster surface is dry.',
      'Use proper primer.',
      'Clean surface before painting.',
      'Fix dampness before paint.',
      'Follow recommended drying time.',
    ],
    repair: [
      'Scrape loose paint.',
      'Fix dampness source.',
      'Apply putty/primer as required.',
      'Repaint after surface is dry.',
    ],
    severity:
      'Paint peeling is mostly a finishing defect, but it often indicates moisture problem behind the surface.',
  },
  {
    slug: 'corrosion-of-reinforcement',
    title: 'Corrosion of Reinforcement',
    level: 'Critical',
    image: '/defects/corrosion-of-reinforcement.png',
    shortDesc:
      'Rusting of steel reinforcement due to moisture, chloride attack, carbonation or insufficient cover.',
    tags: ['Steel', 'RCC', 'Corrosion', 'Durability'],
    whatIsIt:
      'Reinforcement corrosion occurs when steel bars inside concrete rust, expand and cause cracking or spalling.',
    causes: [
      'Insufficient concrete cover.',
      'Water leakage reaching reinforcement.',
      'Carbonation of concrete.',
      'Chloride attack.',
      'Poor concrete quality.',
      'Cracks exposing steel to moisture.',
    ],
    prevention: [
      'Provide proper cover blocks.',
      'Use dense and durable concrete.',
      'Control cracks and leakage.',
      'Avoid chloride contaminated materials.',
      'Ensure proper compaction and curing.',
    ],
    repair: [
      'Remove loose and damaged concrete.',
      'Clean rust from reinforcement.',
      'Apply anti-corrosion coating if specified.',
      'Restore section with repair mortar.',
      'Investigate durability cause before repair.',
    ],
    severity:
      'Corrosion is a serious durability defect and can reduce structural capacity if ignored.',
  },
  {
    slug: 'spalling-of-concrete',
    title: 'Spalling of Concrete',
    level: 'Critical',
    image: '/defects/spalling-of-concrete.png',
    shortDesc:
      'Breaking or falling of concrete cover due to corrosion, fire damage, impact or poor concrete quality.',
    tags: ['Concrete', 'RCC', 'Cover', 'Repair'],
    whatIsIt:
      'Spalling is the breaking, chipping or falling off of concrete from the surface, often exposing reinforcement.',
    causes: [
      'Reinforcement corrosion expansion.',
      'Poor concrete cover.',
      'Fire exposure.',
      'Impact damage.',
      'Freeze-thaw action in cold regions.',
      'Weak or porous concrete.',
    ],
    prevention: [
      'Provide adequate concrete cover.',
      'Prevent water leakage.',
      'Use durable concrete mix.',
      'Repair cracks early.',
      'Protect concrete from aggressive exposure.',
    ],
    repair: [
      'Remove loose concrete.',
      'Clean exposed reinforcement.',
      'Treat steel corrosion.',
      'Apply bonding agent.',
      'Patch with repair mortar or micro-concrete.',
    ],
    severity:
      'Spalling is serious when reinforcement is exposed or structural section is reduced.',
  },
  {
    slug: 'settlement-cracks',
    title: 'Settlement Cracks',
    level: 'Critical',
    image: '',
    shortDesc:
      'Cracks due to foundation settlement, weak soil, poor compaction or differential movement.',
    tags: ['Foundation', 'Cracks', 'Soil', 'Settlement'],
    whatIsIt:
      'Settlement cracks occur when one part of the structure settles more than another part.',
    causes: [
      'Weak bearing soil.',
      'Differential foundation settlement.',
      'Poor backfill compaction.',
      'Water softening the soil.',
      'Nearby excavation.',
      'Improper foundation design or construction.',
    ],
    prevention: [
      'Conduct proper soil investigation.',
      'Compact filling properly.',
      'Avoid water accumulation near foundation.',
      'Design foundation as per soil capacity.',
      'Monitor nearby excavation impact.',
    ],
    repair: [
      'Monitor crack width and movement.',
      'Identify settlement source.',
      'Consult structural/geotechnical engineer.',
      'Use underpinning or grouting if required.',
      'Repair cracks only after movement is controlled.',
    ],
    severity:
      'Settlement cracks can be structural and should not be ignored, especially if cracks are wide or increasing.',
  },
  {
    slug: 'leakage-from-slab',
    title: 'Leakage from Slab',
    level: 'High',
    image: '/defects/leakage-from-slab.png',
    shortDesc:
      'Water leakage through slab due to cracks, poor waterproofing, pipe leakage or terrace slope failure.',
    tags: ['Leakage', 'Slab', 'Waterproofing', 'Crack'],
    whatIsIt:
      'Slab leakage is water seepage through roof slab, bathroom slab, balcony slab or terrace slab.',
    causes: [
      'Waterproofing failure.',
      'No proper terrace slope.',
      'Cracks in slab.',
      'Pipe penetration leakage.',
      'Poor drainage outlet treatment.',
      'Damaged waterproofing during finishing.',
    ],
    prevention: [
      'Provide proper slope towards drain.',
      'Treat pipe penetrations carefully.',
      'Use good waterproofing system.',
      'Conduct ponding test.',
      'Protect waterproofing layer after application.',
    ],
    repair: [
      'Identify leakage source.',
      'Check terrace slope and drain points.',
      'Repair cracks and joints.',
      'Redo waterproofing if system failed.',
      'Conduct ponding test after repair.',
    ],
    severity:
      'Slab leakage can damage reinforcement, plaster, paint and interior finishes if not treated.',
  },
  {
    slug: 'uneven-flooring',
    title: 'Uneven Flooring',
    level: 'Uneven',
    image: '/defects/uneven-flooring.png',
    shortDesc:
      'Floor surface level variation due to poor screed level, tile laying mistake or improper base preparation.',
    tags: ['Flooring', 'Level', 'Finishing', 'Tiles'],
    whatIsIt:
      'Uneven flooring means floor surface has level difference, slope error, lippage or poor finishing alignment.',
    causes: [
      'Improper level marking.',
      'Poor base preparation.',
      'Uneven screed thickness.',
      'Tile lippage.',
      'No level checking during laying.',
      'Poor workmanship.',
    ],
    prevention: [
      'Mark finished floor level clearly.',
      'Use level instrument or laser level.',
      'Prepare uniform base.',
      'Use tile spacers and leveling tools.',
      'Check slope in wet areas.',
    ],
    repair: [
      'Minor lippage can be ground if material allows.',
      'Remove and relay badly affected tiles.',
      'Correct base level before relaying.',
      'Check final level before grouting.',
    ],
    severity:
      'Uneven flooring affects appearance, usability and drainage in wet areas.',
  },
]
