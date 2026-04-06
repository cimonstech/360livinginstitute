import { assertAdminSession } from '@/lib/assert-admin'
import { createAdminClient } from '@/lib/supabase/admin'
import { deleteFromR2 } from '@/lib/r2'
import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await assertAdminSession()
  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status })
  }

  const { id } = await params
  const admin = createAdminClient()
  const { data: row, error: fetchError } = await admin.from('media').select('file_url').eq('id', id).maybeSingle()

  if (fetchError || !row) {
    return NextResponse.json({ error: fetchError?.message || 'Not found' }, { status: fetchError ? 500 : 404 })
  }

  try {
    await deleteFromR2(row.file_url)
  } catch (e) {
    console.error('[api/media/[id]] R2 delete', e)
    // Continue to remove DB row so library stays consistent if object already gone
  }

  const { error: delError } = await admin.from('media').delete().eq('id', id)
  if (delError) {
    return NextResponse.json({ error: delError.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
