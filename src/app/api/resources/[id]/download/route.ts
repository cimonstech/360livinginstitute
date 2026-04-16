import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sanitizeUuid } from '@/lib/sanitize'

export async function POST(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const safeId = sanitizeUuid(id)
  if (!safeId) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
  }
  const supabase = createAdminClient()
  const { error } = await supabase.rpc('increment_download_count', { resource_id: safeId })
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ success: true })
}

