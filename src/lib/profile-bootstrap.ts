import { createAdminClient } from '@/lib/supabase/admin'

/**
 * Emails that should receive `admin` when the profile row is created or repaired
 * server-side (e.g. after auth exists but `profiles` was missing). Override with
 * `ADMIN_BOOTSTRAP_EMAILS` (comma-separated) in production if needed.
 */
function staffAdminEmails(): Set<string> {
  const raw = process.env.ADMIN_BOOTSTRAP_EMAILS?.trim()
  if (raw) {
    return new Set(raw.split(/[,;]+/).map((e) => e.trim().toLowerCase()).filter(Boolean))
  }
  return new Set([
    'batista.simons1@gmail.com',
    '360livinginstitute@gmail.com',
  ].map((e) => e.toLowerCase()))
}

type ProfileRow = {
  id: string
  full_name: string
  email: string
  role: string
  phone?: string | null
  email_verified?: boolean
  avatar_url?: string | null
  created_at?: string
  updated_at?: string
}

/**
 * When a session exists in Auth but `public.profiles` has no row, create one using
 * the service role (bypasses RLS). Safe `app_metadata.role === 'admin'` from the
 * Auth user is respected; otherwise staff emails get admin per staffAdminEmails().
 */
export async function ensureProfileRowForUser(userId: string): Promise<ProfileRow | null> {
  const admin = createAdminClient()
  const { data: bundle, error: authErr } = await admin.auth.admin.getUserById(userId)
  if (authErr || !bundle?.user) {
    console.error('[ensureProfileRowForUser] getUserById', authErr)
    return null
  }

  const u = bundle.user
  const email = (u.email ?? '').trim()
  if (!email) return null

  const fullName =
    (typeof u.user_metadata?.full_name === 'string' && u.user_metadata.full_name.trim()) ||
    email.split('@')[0] ||
    'User'

  const appRole = u.app_metadata?.role
  const allowlist = staffAdminEmails()
  let role: 'admin' | 'client' = 'client'
  if (appRole === 'admin') role = 'admin'
  else if (allowlist.has(email.toLowerCase())) role = 'admin'

  const { data: row, error: upsertErr } = await admin
    .from('profiles')
    .upsert(
      {
        id: userId,
        full_name: fullName,
        email,
        role,
      },
      { onConflict: 'id' }
    )
    .select('*')
    .single()

  if (upsertErr || !row) {
    console.error('[ensureProfileRowForUser] upsert', upsertErr)
    return null
  }

  return row as ProfileRow
}
