import { assertAdminSession } from '@/lib/assert-admin'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { sanitizeUuid } from '@/lib/sanitize'

const BodySchema = z.object({
  services: z.array(
    z.object({
      id: z.string().min(1),
      use_global_price: z.boolean(),
      price_override_ghs: z.number().finite().nullable(),
    })
  ),
})

export async function POST(request: NextRequest) {
  const auth = await assertAdminSession()
  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status })
  }

  let raw: unknown
  try {
    raw = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = BodySchema.safeParse(raw)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid services payload' }, { status: 400 })
  }
  const services = parsed.data.services

  const admin = createAdminClient()
  for (const s of services) {
    const id = sanitizeUuid(s.id)
    if (!id) continue
    const { error } = await admin
      .from('services')
      .update({
        use_global_price: s.use_global_price,
        price_override_ghs: s.price_override_ghs,
      })
      .eq('id', id)
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  }

  return NextResponse.json({ success: true })
}
