// Emergent Universal LLM Key client (Node.js / Next.js)
// Uses an OpenAI-compatible chat completions endpoint at Emergent's gateway.
// Falls back to a deterministic mock response if the key is missing or the call fails.

const EMERGENT_BASE = process.env.EMERGENT_LLM_BASE_URL || 'https://integrations.emergentagent.com/llm'
const EMERGENT_KEY = process.env.EMERGENT_LLM_KEY
const MODEL = process.env.EMERGENT_LLM_MODEL || 'claude-sonnet-4-20250514'

export const SYSTEM_PROMPT = `You are CivilCalc AI, an expert civil engineering assistant for Indian engineers and contractors.

Your expertise covers:
- RCC design guidance (slabs, beams, columns, footings) per IS 456:2000
- IS code references and explanations (IS 456, IS 875, IS 1893, IS 800, IS 13920)
- Civil engineering calculations (loads, moments, deflection, shear)
- Site troubleshooting (cracks, leakage, curing, formwork issues)
- Quantity estimation help (concrete, steel, brickwork, plaster)
- Construction best practices for Indian conditions

Rules:
- Be concise, technical, and accurate.
- Always cite the relevant IS code when applicable.
- Use SI units (mm, kN, kNm, MPa, m³).
- If a calculation needs assumptions, state them clearly.
- Format code/values in markdown code blocks where helpful.
- Never invent IS code clauses or numbers — if unsure, say so.
- Keep replies under ~250 words unless the user asks for depth.`

function mockReply(userMessage) {
  const m = (userMessage || '').toLowerCase()
  if (m.includes('beam') || m.includes('rcc')) {
    return `**(Mock reply — LLM not configured)**\n\nFor RCC beam design (IS 456:2000):\n- **Effective depth** d = D − 50mm (cover + bar dia)\n- **Limiting moment** Mu_lim = 0.36 fck b xu_max (d − 0.42 xu_max)\n- For Fe415: xu_max / d = 0.48\n- Minimum steel: Ast_min = 0.85 b d / fy\n\nUse the **Beam Design Calculator** in the sidebar for a full design.`
  }
  if (m.includes('is 456') || m.includes('is code')) {
    return `**(Mock reply — LLM not configured)**\n\n**IS 456:2000** — Plain & Reinforced Concrete. Key clauses:\n- Cl. 26.5.1 — Minimum reinforcement for flexural members\n- Cl. 40 — Shear design\n- Cl. 23.2.1 — Span/effective depth ratios\n\nFor a real explanation, configure EMERGENT_LLM_KEY.`
  }
  return `**(Mock reply — LLM not configured)**\n\nI received: _"${userMessage}"_\n\nTo enable real Claude-powered responses, set the \`EMERGENT_LLM_KEY\` env var. In the meantime, try the RCC Beam, Column, or Concrete Volume calculators from the dashboard.`
}

// Try multiple endpoint shapes commonly exposed by LLM gateways.
async function tryGateway(messages) {
  // OpenAI-compatible /chat/completions
  const url = `${EMERGENT_BASE}/chat/completions`
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${EMERGENT_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        max_tokens: 600,
        temperature: 0.3,
      }),
    })
    if (!res.ok) {
      const text = await res.text().catch(() => '')
      console.error('[LLM] gateway non-OK', res.status, text.slice(0, 200))
      return null
    }
    const data = await res.json()
    const reply =
      data?.choices?.[0]?.message?.content ||
      data?.choices?.[0]?.text ||
      data?.reply ||
      data?.content ||
      ''
    return typeof reply === 'string' && reply.trim() ? reply : null
  } catch (err) {
    console.error('[LLM] gateway fetch error:', err?.message || err)
    return null
  }
}

export async function chatWithClaude({ history, userMessage }) {
  // Build a compact message array: system + last 10 turns + new user message
  const recent = (history || []).slice(-10).map((m) => ({
    role: m.role === 'assistant' ? 'assistant' : 'user',
    content: m.content,
  }))
  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...recent,
    { role: 'user', content: userMessage },
  ]

  if (!EMERGENT_KEY) {
    return { reply: mockReply(userMessage), source: 'mock', reason: 'no-key' }
  }

  const reply = await tryGateway(messages)
  if (reply) {
    return { reply, source: 'claude', model: MODEL }
  }
  return { reply: mockReply(userMessage), source: 'mock', reason: 'gateway-failed' }
}
