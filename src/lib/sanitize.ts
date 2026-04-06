export function sanitizeString(input: unknown): string {
  if (typeof input !== 'string') return ''
  return input
    .trim()
    .slice(0, 1000)
    .replace(/<[^>]*>/g, '')
    .replace(/[<>'"]/g, '')
}

export function sanitizeEmail(input: unknown): string {
  if (typeof input !== 'string') return ''
  const email = input.trim().toLowerCase().slice(0, 254)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) ? email : ''
}

export function sanitizePhone(input: unknown): string {
  if (typeof input !== 'string') return ''
  return input.trim().replace(/[^0-9+\s\-()]/g, '').slice(0, 20)
}

export function sanitizeLongText(input: unknown): string {
  if (typeof input !== 'string') return ''
  return input.trim().slice(0, 5000).replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
}

/** UUID v4 only (empty if invalid). */
export function sanitizeUuid(input: unknown): string {
  if (typeof input !== 'string') return ''
  const s = input.trim().toLowerCase()
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(s)) {
    return ''
  }
  return s
}

export function sanitizeSlug(input: unknown): string {
  if (typeof input !== 'string') return ''
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 200)
}

/** Optional URL: allow https only, limited length. */
export function sanitizeHttpsUrl(input: unknown): string | null {
  if (typeof input !== 'string') return null
  const s = input.trim().slice(0, 2000)
  if (!s) return null
  try {
    const u = new URL(s)
    if (u.protocol !== 'https:' && u.protocol !== 'http:') return null
    return u.toString()
  } catch {
    return null
  }
}
