import { NextRequest, NextResponse } from 'next/server'
import { assertAdminSession } from '@/lib/assert-admin'
import { createAdminClient } from '@/lib/supabase/admin'
import { sanitizeUuid } from '@/lib/sanitize'

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await assertAdminSession()
  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status })
  }

  const { id } = await params
  const safeId = sanitizeUuid(id)
  if (!safeId) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })

  const supabase = createAdminClient()
  const { error } = await supabase.from('resources').delete().eq('id', safeId)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}

