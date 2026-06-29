function makeMaterial({
  slug,
  title,
  shortDesc,
  intro,
  types,
  uses,
  isCodes,
  relatedTools = [
    {
      name: 'BOQ Generator',
      href: '/dashboard/calculators/boq-generator',
    },
  ],
}) {
  return {
    slug,
    title,
    shortDesc,
    intro,
    types,
    properties: [
      'Good quality material improves strength and durability.',
      'Material should be clean and suitable for the selected construction work.',
      'Quality should be checked before use on site.',
      'Storage condition directly affects material performance.',
    ],
    uses,
    advantages: [
      'Improves construction quality when selected properly.',
      'Helps achieve better strength and durability.',
      'Useful for residential and commercial construction.',
    ],
    disadvantages: [
      'Poor quality material can reduce strength.',
      'Wrong storage may damage the material.',
      'Improper use can increase cost and defects.',
    ],
    storage: [
      'Store material on a clean and level surface.',
      'Protect from moisture and contamination where required.',
      'Keep different materials separately.',
      'Follow first-in-first-out method where applicable.',
    ],
    qualityChecks: [
      'Check supplier and material source.',
      'Check physical condition before use.',
      'Check size, grade or type as per requirement.',
      'Check test certificate where required.',
    ],
    labTests: [
      'Strength test',
      'Specific gravity test',
      'Water absorption test',
      'Fineness or grading test where applicable.',
    ],
    fieldTests: [
      'Visual inspection',
      'Size or quantity check',
      'Moisture check',
      'Basic site quality check',
    ],
    isCodes,
    commonMistakes: [
      'Using material without checking quality.',
      'Mixing contaminated material with fresh material.',
      'Ignoring storage conditions.',
      'Using wrong material type for the work.',
    ],
    faqs: [
      {
        q: `Why is ${title} quality checking important?`,
        a: `${title} quality checking is important because poor material quality can reduce strength, durability and finishing quality.`,
      },
      {
        q: `Can ${title} be used without testing?`,
        a: `For small work, basic field checks are common. For important structural work, proper testing and approved specifications should be followed.`,
      },
    ],
    relatedTools,
  }
}

export const materials = [
  makeMaterial({
    slug: 'cement',
    title: 'Cement',
    shortDesc:
      'Cement types, uses, storage, quality checks, lab tests and common site mistakes.',
    intro:
      'Cement is a binding material used in concrete, mortar, plaster and many construction works. It reacts with water and binds fine and coarse aggregates together.',
    types: [
      'Ordinary Portland Cement',
      'Portland Pozzolana Cement',
      'Portland Slag Cement',
      'Rapid Hardening Cement',
      'Sulphate Resisting Cement',
      'White Cement',
    ],
    uses: [
      'RCC work',
      'PCC work',
      'Brick masonry mortar',
      'Plastering work',
      'Flooring and repair work',
    ],
    isCodes: [
      'IS 269 - Ordinary Portland Cement',
      'IS 1489 - Portland Pozzolana Cement',
      'IS 455 - Portland Slag Cement',
      'IS 4031 - Cement testing methods',
    ],
    relatedTools: [
      {
        name: 'Concrete Calculator',
        href: '/dashboard/calculators/concrete-volume',
      },
      {
        name: 'BOQ Generator',
        href: '/dashboard/calculators/boq-generator',
      },
    ],
  }),

  makeMaterial({
    slug: 'steel',
    title: 'Steel',
    shortDesc:
      'Steel reinforcement guide for RCC, bar types, storage, tests and site checks.',
    intro:
      'Steel reinforcement is used in RCC to resist tensile stresses. Concrete is strong in compression, while steel helps in tension and bending resistance.',
    types: [
      'Mild steel bars',
      'HYSD bars',
      'TMT bars',
      'Structural steel sections',
      'Prestressing steel',
    ],
    uses: [
      'RCC beams',
      'RCC columns',
      'Slabs',
      'Footings',
      'Staircases',
      'Retaining walls',
    ],
    isCodes: [
      'IS 1786 - High strength deformed steel bars and wires',
      'IS 800 - General construction in steel',
      'IS 432 - Mild steel and medium tensile steel bars',
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
  }),

  makeMaterial({
    slug: 'sand',
    title: 'Sand',
    shortDesc:
      'Sand types, silt check, bulking, uses, storage and quality control.',
    intro:
      'Sand is a fine aggregate used in concrete, mortar, plaster and flooring work. Its grading, cleanliness and silt content directly affect construction quality.',
    types: ['River sand', 'M-sand', 'Pit sand', 'Plaster sand'],
    uses: [
      'Concrete production',
      'Brickwork mortar',
      'Plastering',
      'Flooring bedding',
      'PCC and masonry work',
    ],
    isCodes: [
      'IS 383 - Coarse and fine aggregate for concrete',
      'IS 2386 - Aggregate testing methods',
    ],
  }),

  makeMaterial({
    slug: 'aggregate',
    title: 'Aggregate',
    shortDesc:
      'Coarse aggregate guide, grading, size, quality checks and tests.',
    intro:
      'Aggregate is used as a major volume component in concrete. Proper aggregate size, shape and grading improve concrete strength, workability and durability.',
    types: [
      '10 mm aggregate',
      '20 mm aggregate',
      '40 mm aggregate',
      'Crushed stone aggregate',
      'Gravel aggregate',
    ],
    uses: [
      'RCC concrete',
      'PCC work',
      'Road construction',
      'Drainage layer',
      'Mass concrete',
    ],
    isCodes: [
      'IS 383 - Coarse and fine aggregate for concrete',
      'IS 2386 - Aggregate testing methods',
    ],
  }),

  makeMaterial({
    slug: 'bricks',
    title: 'Bricks',
    shortDesc:
      'Brick types, uses, field tests, storage and common masonry mistakes.',
    intro:
      'Bricks are masonry units used in walls, partitions and building construction. Good bricks should be uniform, hard, well burnt and free from cracks.',
    types: [
      'First class bricks',
      'Second class bricks',
      'Fly ash bricks',
      'AAC blocks',
      'Concrete blocks',
    ],
    uses: [
      'Load bearing walls',
      'Partition walls',
      'Boundary walls',
      'Masonry work',
      'Architectural work',
    ],
    isCodes: [
      'IS 1077 - Common burnt clay building bricks',
      'IS 3495 - Tests for burnt clay building bricks',
      'IS 12894 - Fly ash lime bricks',
    ],
  }),

  makeMaterial({
    slug: 'blocks',
    title: 'Blocks',
    shortDesc:
      'AAC blocks, concrete blocks, uses, checks and construction mistakes.',
    intro:
      'Blocks are larger masonry units used for faster wall construction. AAC blocks and concrete blocks are common alternatives to traditional clay bricks.',
    types: [
      'AAC blocks',
      'Solid concrete blocks',
      'Hollow concrete blocks',
      'Fly ash blocks',
    ],
    uses: [
      'Partition walls',
      'External walls',
      'Residential buildings',
      'Commercial buildings',
      'Boundary walls',
    ],
    isCodes: [
      'IS 2185 - Concrete masonry units',
      'IS 2185 Part 3 - Autoclaved cellular aerated concrete blocks',
    ],
  }),

  makeMaterial({
    slug: 'concrete',
    title: 'Concrete',
    shortDesc:
      'Concrete grades, properties, uses, tests, curing and common problems.',
    intro:
      'Concrete is a composite material made from cement, sand, aggregate and water. It is used in RCC, PCC and many structural and non-structural works.',
    types: [
      'PCC',
      'RCC',
      'Ready mix concrete',
      'High strength concrete',
      'Self compacting concrete',
    ],
    uses: [
      'Footings',
      'Columns',
      'Beams',
      'Slabs',
      'Pavements',
      'Retaining walls',
    ],
    isCodes: [
      'IS 456 - Plain and reinforced concrete',
      'IS 10262 - Concrete mix proportioning',
      'IS 1199 - Fresh concrete tests',
      'IS 516 - Strength tests of concrete',
    ],
  }),

  makeMaterial({
    slug: 'fly-ash',
    title: 'Fly Ash',
    shortDesc:
      'Fly ash use in concrete, bricks, advantages, tests and precautions.',
    intro:
      'Fly ash is a pozzolanic material used in cement, concrete and fly ash bricks. It can improve workability and durability when used properly.',
    types: ['Class F fly ash', 'Class C fly ash'],
    uses: [
      'PPC cement',
      'Concrete mineral admixture',
      'Fly ash bricks',
      'Road embankments',
      'Soil stabilization',
    ],
    isCodes: ['IS 3812 - Pulverized fuel ash specification'],
  }),

  makeMaterial({
    slug: 'admixture',
    title: 'Admixture',
    shortDesc:
      'Concrete admixtures, uses, advantages, precautions and quality checks.',
    intro:
      'Admixtures are materials added to concrete before or during mixing to modify properties like workability, setting time, strength and durability.',
    types: [
      'Plasticizer',
      'Superplasticizer',
      'Retarder',
      'Accelerator',
      'Air entraining admixture',
      'Waterproofing admixture',
    ],
    uses: [
      'Ready mix concrete',
      'High strength concrete',
      'Hot weather concreting',
      'Mass concrete',
      'Waterproof concrete',
    ],
    isCodes: ['IS 9103 - Concrete admixtures'],
  }),

  makeMaterial({
    slug: 'waterproofing',
    title: 'Waterproofing',
    shortDesc:
      'Waterproofing materials, uses, checks, methods and common mistakes.',
    intro:
      'Waterproofing is used to prevent water leakage and dampness in basements, terraces, bathrooms, water tanks and other exposed areas.',
    types: [
      'Cementitious waterproofing',
      'Liquid membrane waterproofing',
      'Bituminous coating',
      'PU waterproofing',
      'Crystalline waterproofing',
      'APP membrane',
    ],
    uses: [
      'Terrace',
      'Bathroom',
      'Basement',
      'Water tank',
      'Retaining wall',
      'Balcony',
    ],
    isCodes: [
      'Use relevant product standard and manufacturer technical datasheet for project-specific waterproofing system',
    ],
  }),
]
