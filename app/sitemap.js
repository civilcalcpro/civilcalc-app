export default function sitemap() {
  const baseUrl = 'https://civilcalcpro.in'

  const pages = [
    {
      path: '',
      priority: 1.0,
      changeFrequency: 'weekly',
    },
    {
      path: '/why-civilcalc-pro',
      priority: 0.9,
      changeFrequency: 'weekly',
    },
    {
      path: '/civil-engineering-calculators',
      priority: 0.95,
      changeFrequency: 'weekly',
    },
    {
      path: '/rcc-design-calculators',
      priority: 0.9,
      changeFrequency: 'weekly',
    },
    {
      path: '/quantity-estimation-calculators',
      priority: 0.9,
      changeFrequency: 'weekly',
    },
    {
      path: '/reinforcement-calculators',
      priority: 0.9,
      changeFrequency: 'weekly',
    },
    {
      path: '/construction-material-calculators',
      priority: 0.9,
      changeFrequency: 'weekly',
    },
    {
      path: '/home-construction-cost-calculator',
      priority: 0.9,
      changeFrequency: 'weekly',
    },
    {
      path: '/boq-generator',
      priority: 0.9,
      changeFrequency: 'weekly',
    },
    {
      path: '/beam-design',
      priority: 0.9,
      changeFrequency: 'monthly',
    },
    {
      path: '/column-design',
      priority: 0.9,
      changeFrequency: 'monthly',
    },
    {
      path: '/footing-design',
      priority: 0.9,
      changeFrequency: 'monthly',
    },
    {
      path: '/one-way-slab-calculator',
      priority: 0.9,
      changeFrequency: 'monthly',
    },
    {
  path: '/structural-analysis-calculator',
  priority: 0.85,
  changeFrequency: 'monthly',
},
    {
      path: '/two-way-slab-calculator',
      priority: 0.9,
      changeFrequency: 'monthly',
    },
    {
      path: '/one-way-vs-two-way-slab',
      priority: 0.85,
      changeFrequency: 'monthly',
    },
    {
      path: '/concrete-volume-calculator',
      priority: 0.85,
      changeFrequency: 'monthly',
    },
    {
      path: '/steel-weight-calculator',
      priority: 0.85,
      changeFrequency: 'monthly',
    },
    {
      path: '/brickwork-calculator',
      priority: 0.85,
      changeFrequency: 'monthly',
    },
    {
      path: '/plaster-calculator',
      priority: 0.85,
      changeFrequency: 'monthly',
    },
    {
      path: '/excavation-calculator',
      priority: 0.85,
      changeFrequency: 'monthly',
    },
    {
      path: '/bar-bending-schedule-guide',
      priority: 0.8,
      changeFrequency: 'monthly',
    },
    {
      path: '/development-length-calculation',
      priority: 0.8,
      changeFrequency: 'monthly',
    },
    {
      path: '/lap-length-calculation',
      priority: 0.8,
      changeFrequency: 'monthly',
    },
    {
      path: '/m20-concrete-mix-ratio',
      priority: 0.8,
      changeFrequency: 'monthly',
    },
    {
      path: '/rcc-beam-design-example',
      priority: 0.8,
      changeFrequency: 'monthly',
    },
    {
      path: '/steel-weight-calculation-formula',
      priority: 0.8,
      changeFrequency: 'monthly',
    },
    {
      path: '/how-to-calculate-brickwork-quantity',
      priority: 0.75,
      changeFrequency: 'monthly',
    },
    {
      path: '/pricing',
      priority: 0.6,
      changeFrequency: 'monthly',
    },
    {
      path: '/contact-us',
      priority: 0.5,
      changeFrequency: 'yearly',
    },
    {
      path: '/privacy-policy',
      priority: 0.3,
      changeFrequency: 'yearly',
    },
    {
      path: '/terms-and-conditions',
      priority: 0.3,
      changeFrequency: 'yearly',
    },
  ]

  return pages.map((page) => ({
    url: `${baseUrl}${page.path}`,
    lastModified: new Date(),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }))
}
