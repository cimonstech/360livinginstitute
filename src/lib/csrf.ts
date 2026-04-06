import { headers } from 'next/headers'

function siteOrigin(): string | null {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (!raw) return null
  try {
    return new URL(raw.replace(/\/$/, '')).origin
  } catch {
    return null
  }
}

/**
 * Restrict public POSTs to same-site origins. Allows missing Origin when
 * Referer matches or Sec-Fetch-Site is same-origin (typical for same-origin fetch).
 */
export async function validateOrigin(): Promise<boolean> {
  const expected = siteOrigin()
  if (!expected) return true

  const headersList = await headers()
  const origin = headersList.get('origin')
  if (origin) {
    try {
      return new URL(origin).origin === expected
    } catch {
      return false
    }
  }

  const referer = headersList.get('referer')
  if (referer) {
    try {
      return new URL(referer).origin === expected
    } catch {
      return false
    }
  }

  if (headersList.get('sec-fetch-site') === 'same-origin') return true

  return process.env.NODE_ENV !== 'production'
}
