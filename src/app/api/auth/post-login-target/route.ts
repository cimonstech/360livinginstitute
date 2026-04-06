import { createClient } from '@/lib/supabase/server'
import { ensureProfileRowForUser } from '@/lib/profile-bootstrap'
import { NextRequest, NextResponse } from 'next/server'

/** After browser sign-in, session is in cookies — resolve role server-side for reliable redirect. */
export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const rawRedirect = request.nextUrl.searchParams.get('redirect')?.trim() || '/dashboard'
  const safeRedirect = rawRedirect.startsWith('/') && !rawRedirect.startsWith('//') ? rawRedirect : '/dashboard'

  let { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
  if (!profile || profile.role !== 'admin') {
    const repaired = await ensureProfileRowForUser(user.id)
    if (repaired) profile = { role: repaired.role }
  }
  const role = profile?.role ?? null
  const target = role === 'admin' ? '/admin' : safeRedirect

  return NextResponse.json({ target, role })
}
