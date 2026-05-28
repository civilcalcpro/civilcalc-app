import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
)

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

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
    })

    const result = await model.generateContent(`
You are CivilCalc AI.

You are an expert civil structural engineer.

Answer clearly for:
- RCC Design
- IS Codes
- Structural Analysis
- Estimation
- Beam Design
- Slab Design
- Footing
- Concrete Mix
- Steel Design

Explain step-by-step.

User question:
${prompt}
`)

    const response = await result.response
    const text = response.text()

    return Response.json({
      reply: text,
    })
  } catch (error) {
    console.error(error)

    return Response.json(
      {
        error: 'AI generation failed',
      },
      { status: 500 }
    )
  }
}
