import { GoogleGenerativeAI } from '@google/generative-ai'

export async function POST(req) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return Response.json(
        {
          error:
            'GEMINI_API_KEY is missing in Vercel environment variables',
        },
        { status: 500 }
      )
    }

    const body = await req.json()
    const prompt = body.prompt

    if (!prompt) {
      return Response.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    const genAI = new GoogleGenerativeAI(
      process.env.GEMINI_API_KEY
    )

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash-8b',
    })

    const result = await model.generateContent(`
You are CivilCalc AI.

You are an expert civil engineering assistant.

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
- Explain step-by-step
- Use formulas when needed
- Keep answers simple and practical
- Mention IS codes when relevant
- Warn users to verify structural safety with a licensed engineer

User Question:
${prompt}
`)

    const response = await result.response

    const text = response.text()

    return Response.json({
      reply: text,
    })
  } catch (error) {
    console.error('Gemini Error:', error)

    return Response.json(
      {
        error:
          error?.message ||
          'AI generation failed',
      },
      { status: 500 }
    )
  }
}
