import { createClient } from '@/lib/supabase/server'

export type AdminAuthResult =
  | { ok: true; userId: string }
  | { ok: false; status: 401 | 403; message: string }

export async function assertAdminSession(): Promise<AdminAuthResult> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { ok: false, status: 401, message: 'Unauthorized' }
  }
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
  if (profile?.role !== 'admin') {
    return { ok: false, status: 403, message: 'Forbidden' }
  }
  return { ok: true, userId: user.id }
}
