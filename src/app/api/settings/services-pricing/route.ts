import { assertAdminSession } from '@/lib/assert-admin'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'

type ServicePricingRow = {
  id: string
  use_global_price: boolean
  price_override_ghs: number | null
}

export async function POST(request: NextRequest) {
  const auth = await assertAdminSession()
  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status })
  }

  let body: { services?: ServicePricingRow[] }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const services = body.services
  if (!Array.isArray(services)) {
    return NextResponse.json({ error: 'services array required' }, { status: 400 })
  }

  const admin = createAdminClient()
  for (const s of services) {
    if (!s?.id) continue
    const { error } = await admin
      .from('services')
      .update({
        use_global_price: s.use_global_price,
        price_override_ghs: s.price_override_ghs,
      })
      .eq('id', s.id)
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  }

  return NextResponse.json({ success: true })
}
