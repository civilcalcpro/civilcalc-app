import { GoogleGenerativeAI } from '@google/generative-ai'

function fallbackAnswer(prompt) {
  return `
CivilCalc AI fallback response:

Your question:
${prompt}

Gemini free quota is temporarily exceeded, so here is a basic civil engineering guidance response.

For structural/civil engineering problems, use this method:

1. Identify the problem type
- RCC design
- Load calculation
- Steel estimation
- Concrete quantity
- Slab/beam/column/footing design

2. Write given data
- Dimensions
- Loads
- Material grade
- Support condition
- IS code reference

3. Apply formulas
Examples:
- Concrete volume = Length × Width × Depth
- Steel weight = D² / 162 kg/m
- Beam moment for simply supported UDL = wL² / 8
- Beam reaction for symmetric UDL = wL / 2

4. Check safety
Always verify results using IS codes and a qualified structural engineer before site execution.

Note:
Live AI quota is currently exceeded. Try again after some time for a full AI-generated explanation.
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
        model: 'gemini-2.0-flash',
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
