import { NextResponse } from 'next/server'
import { HONEYPOT_FIELD, isBot, isTooFast } from '@/lib/honeypot'

const INTERNAL_KEYS = new Set([HONEYPOT_FIELD, 'form_loaded_at', 'form_submitted_at'])

/** Strip anti-spam metadata before persistence / email. */
export function stripPublicFormMeta<T extends Record<string, unknown>>(body: T): T {
  const out = { ...body }
  for (const k of INTERNAL_KEYS) {
    delete out[k]
  }
  return out
}

function readTiming(body: Record<string, unknown>): { tooFast: boolean } {
  const loaded = body.form_loaded_at
  const submitted = body.form_submitted_at
  if (typeof loaded !== 'number' || typeof submitted !== 'number') return { tooFast: false }
  return { tooFast: isTooFast(submitted, loaded) }
}

/**
 * @returns JSON success response if the request should be dropped (bot / too fast), otherwise null.
 */
export function silentRejectSpam(body: Record<string, unknown>): NextResponse | null {
  if (isBot(body)) {
    console.warn('[PublicFormGuard] Dropped submission (honeypot filled).')
    return NextResponse.json({ success: true })
  }
  if (readTiming(body).tooFast) {
    const loaded = body.form_loaded_at
    const submitted = body.form_submitted_at
    if (typeof loaded === 'number' && typeof submitted === 'number') {
      console.warn('[PublicFormGuard] Dropped submission (too fast):', submitted - loaded, 'ms')
    } else {
      console.warn('[PublicFormGuard] Dropped submission (too fast).')
    }
    return NextResponse.json({ success: true })
  }
  return null
}
