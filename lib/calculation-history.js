export async function saveCalculationHistory(authFetch, type, inputs, results) {
  try {
    if (!authFetch) return null

    const response = await authFetch('/api/calculations/save', {
      method: 'POST',
      body: JSON.stringify({
        type,
        inputs,
        results,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Calculation history save failed:', data)
      return null
    }

    return data?.calculationId || null
  } catch (error) {
    console.error('Calculation history error:', error)
    return null
  }
}
