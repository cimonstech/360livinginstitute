import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { privatePageRobots } from '@/lib/seo'
import { ensureProfileRowForUser } from '@/lib/profile-bootstrap'
import { redirect } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminTopbar from '@/components/admin/AdminTopbar'
import type { Profile } from '@/types'

export const metadata: Metadata = {
  title: 'Admin | 360 Living Institute',
  ...privatePageRobots(),
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login?redirect=/admin')

  let { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()

  if (profileError) {
    console.error('[admin layout] profiles select', profileError)
  }

  if (!profile || profile.role !== 'admin') {
    const repaired = await ensureProfileRowForUser(user.id)
    if (repaired) profile = repaired as Profile
  }

  if (!profile || profile.role !== 'admin') {
    const q = new URLSearchParams({ error: 'unauthorized' })
    if (!profile) q.set('reason', 'no_profile')
    else q.set('reason', 'not_admin')
    redirect(`/?${q.toString()}`)
  }

  return (
    <div className="min-h-screen bg-charcoal-light flex font-dm">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopbar profile={profile as Profile} />
        <main className="flex-1 p-6 lg:p-8 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
