import { GoogleGenerativeAI } from '@google/generative-ai'
import { KNOWLEDGE_BASE } from '@/lib/civil-knowledge'
const TOOLS = [
  {
    keywords: [
      'house cost',
      'construction cost',
      'ghar banane',
      'ghar ka kharcha',
      'building cost',
      'estimate cost',
      '1200 sq ft'
    ],
    title: 'Construction Cost Calculator',
    url: '/dashboard/calculators/house-construction-cost'
  },

  {
    keywords: [
      'brick quantity',
      'eent',
      'bricks',
      'brick calculation',
      'wall brick'
    ],
    title: 'Brickwork Calculator',
    url: '/dashboard/calculators/brickwork'
  },

  {
    keywords: [
      'concrete quantity',
      'rcc quantity',
      'concrete calculation'
    ],
    title: 'Concrete Calculator',
    url: '/dashboard/calculators/concrete-volume'
  },

  {
    keywords: [
      'steel quantity',
      'steel weight',
      'bar weight',
      'rebar'
    ],
    title: 'Steel Calculator',
    url: '/dashboard/calculators/steel-weight'
  },

  {
    keywords: [
      'beam design',
      'beam reinforcement',
      'beam steel'
    ],
    title: 'Beam Design Tool',
    url: '/dashboard/calculators/beam'
  },

  {
    keywords: [
      'column design',
      'column reinforcement',
      'column steel'
    ],
    title: 'Column Design Tool',
    url: '/dashboard/calculators/column'
  },

  {
    keywords: [
      'footing design',
      'foundation design',
      'isolated footing'
    ],
    title: 'Footing Design Tool',
    url: '/dashboard/calculators/footing'
  },

  {
    keywords: [
      'boq',
      'bill of quantities',
      'quantity takeoff'
    ],
    title: 'BOQ Generator',
    url: '/dashboard/calculators/boq-generator'
  }
]

function findTool(prompt) {
  const q = prompt.toLowerCase()

  return TOOLS.find(tool =>
    tool.keywords.some(k =>
      q.includes(k.toLowerCase())
    )
  )
}

function searchKnowledge(query) {
  const q = query.toLowerCase()

  let bestMatch = null
  let highestScore = 0

  for (const item of KNOWLEDGE_BASE) {
    let score = 0

    for (const keyword of item.keywords) {
      if (q.includes(keyword.toLowerCase())) {
        score++
      }
    }

    if (score > highestScore) {
      highestScore = score
      bestMatch = item
    }
  }

  return bestMatch?.answer || null
}
function fallbackAnswer(prompt) {
  const tool = findTool(prompt)

  if (tool) {
    return `
For accurate results, please use:

${tool.title}

Tool Link:
${tool.url}

CivilCalc Pro provides dedicated calculations and reports for this requirement.
`
  }

  const kb = searchKnowledge(prompt)

  if (kb) {
    return kb
  }

  return `
AI service is currently unavailable.

Please use CivilCalc Pro Engineering Tools for calculations, design, estimation and analysis.
`
}

export async function POST(req) {
  try {
    const body = await req.json()
    const prompt = body.prompt

    if (!prompt) {
      return Response.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    if (!process.env.GEMINI_API_KEY) {
      return Response.json({
        reply: fallbackAnswer(prompt),
      })
    }

    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

      const model = genAI.getGenerativeModel({
  model: 'gemini-2.5-flash',
      })

      const result = await model.generateContent(`
You are CivilCalc AI, an expert civil engineering assistant.

Help with:
- RCC Design
- Beam Design
- Slab Design
- Column Design
- Footing Design
- Structural Analysis
- IS 456
- IS 875
- Estimation
- Concrete Mix
- Steel Calculation
- Site Engineering

Rules:
- Explain step-by-step.
- Use formulas when needed.
- Keep answers simple and practical.
- Mention IS codes when relevant.
- Warn users to verify structural safety with a licensed engineer.

User Question:
${prompt}
`)

      const response = await result.response
      const text = response.text()

      return Response.json({
        reply: text || fallbackAnswer(prompt),
      })
    } catch (geminiError) {
      console.error('Gemini quota/API error:', geminiError)

      return Response.json({
        reply: fallbackAnswer(prompt),
      })
    }
  } catch (error) {
    console.error('AI route error:', error)

    return Response.json(
      {
        error: 'AI request failed',
      },
      { status: 500 }
    )
  }
}
