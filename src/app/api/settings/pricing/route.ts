import { assertAdminSession } from '@/lib/assert-admin'
import { createAdminClient } from '@/lib/supabase/admin'
import { sanitizeLongText, sanitizeString } from '@/lib/sanitize'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(request: NextRequest) {
  const auth = await assertAdminSession()
  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status })
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const allowed = ['global_price_ghs', 'show_prices', 'payment_instructions', 'momo_number', 'momo_name'] as const
  const patch: Record<string, unknown> = {}
  for (const key of allowed) {
    if (!(key in body)) continue
    const v = body[key]
    if (key === 'global_price_ghs') {
      if (typeof v === 'number' && Number.isFinite(v)) patch[key] = v
      continue
    }
    if (key === 'show_prices') {
      patch[key] = Boolean(v)
      continue
    }
    if (key === 'payment_instructions') {
      patch[key] = v != null ? sanitizeLongText(v) || null : null
      continue
    }
    if (key === 'momo_number' || key === 'momo_name') {
      patch[key] = v != null ? sanitizeString(v) : null
      continue
    }
    patch[key] = v
  }

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: 'No valid fields' }, { status: 400 })
  }

  const admin = createAdminClient()
  const { data: rows } = await admin.from('pricing_settings').select('id').limit(1)
  const rowId = rows?.[0]?.id as string | undefined

  if (!rowId) {
    return NextResponse.json({ error: 'Pricing settings row missing' }, { status: 500 })
  }

  const { data, error } = await admin.from('pricing_settings').update(patch).eq('id', rowId).select().single()
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, pricing: data })
}
