/** Field name — looks innocuous to bots */
export const HONEYPOT_FIELD = 'website_url'

export function isBot(formData: Record<string, unknown>): boolean {
  const honeypotValue = formData[HONEYPOT_FIELD]
  return !!(honeypotValue && String(honeypotValue).trim().length > 0)
}

export function isTooFast(submittedAt: number, loadedAt: number): boolean {
  return submittedAt - loadedAt < 3000
}
