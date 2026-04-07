import { assertAdminSession } from '@/lib/assert-admin'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const auth = await assertAdminSession()
  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status })
  }

  const { searchParams } = new URL(request.url)
  const usedIn = searchParams.get('used_in')?.trim().toLowerCase() || 'all'
  const limitParam = searchParams.get('limit')
  const limit = Math.min(200, Math.max(1, Number(limitParam || 60) || 60))

  const admin = createAdminClient()
  let q = admin.from('media').select('*').order('created_at', { ascending: false }).limit(limit)
  if (usedIn !== 'all') q = q.eq('used_in', usedIn)

  const { data, error } = await q
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true, media: data ?? [] })
}

