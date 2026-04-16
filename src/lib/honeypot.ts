/** Field name — looks innocuous to bots but has no recognised HTML autofill token. */
// Deliberately NOT a standard contact field name (name/email/tel/fax/address etc.)
// so browsers do not try to autofill it even when autoComplete="off" is ignored.
export const HONEYPOT_FIELD = '_extra'

export function isBot(formData: Record<string, unknown>): boolean {
  const honeypotValue = formData[HONEYPOT_FIELD]
  return !!(honeypotValue && String(honeypotValue).trim().length > 0)
}

export function isTooFast(submittedAt: number, loadedAt: number): boolean {
  // Some legitimate users can complete short forms quickly (especially with autofill).
  // Keep a small timing floor mainly to catch scripted posts.
  return submittedAt - loadedAt < 800
}
