import { GoogleGenerativeAI } from '@google/generative-ai'

export async function POST(req) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return Response.json(
        { error: 'GEMINI_API_KEY is missing in Vercel environment variables' },
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

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

    const model = genAI.getGenerativeModel({
      model: 'gemini-pro',
    })

    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `
You are CivilCalc AI, an expert civil engineering assistant.

Answer for civil engineering students and site engineers.

Focus on:
- RCC design
- IS 456
- IS 875
- structural analysis
- beam design
- slab design
- footing design
- concrete mix
- steel weight
- estimation
- construction site problems

Rules:
- Explain step-by-step.
- Use simple language.
- Mention formulas when useful.
- Warn users to verify final structural design with a qualified engineer.

User question:
${prompt}
              `,
            },
          ],
        },
      ],
    })

    const response = await result.response
    const text = response.text()

    return Response.json({
      reply: text || 'No response generated',
    })
  } catch (error) {
    console.error('Gemini API error:', error)

    return Response.json(
      {
        error:
          error?.message ||
          'AI generation failed. Check Gemini API key, quota, and model access.',
      },
      { status: 500 }
    )
  }
}
