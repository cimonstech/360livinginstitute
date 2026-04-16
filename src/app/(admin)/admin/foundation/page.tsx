import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function FoundationAdminPage() {
  const supabase = await createClient()
  const [{ count: applications }, { count: partners }, { count: volunteers }, { count: sponsors }] = await Promise.all([
    supabase.from('foundation_applications').select('*', { count: 'exact', head: true }).eq('status', 'new'),
    supabase.from('foundation_partners').select('*', { count: 'exact', head: true }).eq('status', 'new'),
    supabase.from('foundation_volunteers').select('*', { count: 'exact', head: true }).eq('status', 'new'),
    supabase.from('foundation_sponsors').select('*', { count: 'exact', head: true }).eq('status', 'new'),
  ])

  const sections = [
    { label: 'New Applications', count: applications || 0, href: '/admin/foundation/applications', color: 'text-brand-pink' },
    { label: 'Partner Requests', count: partners || 0, href: '/admin/foundation/partners', color: 'text-brand-green' },
    { label: 'Volunteer Signups', count: volunteers || 0, href: '/admin/foundation/volunteers', color: 'text-brand-pink' },
    { label: 'Sponsor / Donations', count: sponsors || 0, href: '/admin/foundation/sponsors', color: 'text-brand-green' },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-lora text-2xl font-normal text-charcoal">Foundation Overview</h1>
        <p className="mt-1 font-dm text-sm font-light text-charcoal-muted">
          New submissions from the 360 Living Foundation site.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {sections.map((s) => (
          <Link key={s.href} href={s.href} className="rounded-2xl border border-gray-100 bg-white p-6 transition-colors hover:border-brand-pink">
            <p className="mb-3 font-dm text-xs font-medium uppercase tracking-wider text-charcoal-muted">{s.label}</p>
            <p className={`font-lora text-3xl font-normal ${s.color}`}>{s.count}</p>
            <p className="mt-1 font-dm text-xs text-charcoal-muted">Awaiting review</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
