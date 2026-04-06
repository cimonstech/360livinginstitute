'use client'

import type { Profile } from '@/types'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { format } from 'date-fns'

const crumbs: { prefix: string; label: string }[] = [
  { prefix: '/admin/settings', label: 'Settings' },
  { prefix: '/admin/emails', label: 'Email Logs' },
  { prefix: '/admin/calendar', label: 'Calendar' },
  { prefix: '/admin/clients', label: 'Clients' },
  { prefix: '/admin/appointments', label: 'Appointments' },
  { prefix: '/admin', label: 'Overview' },
]

function breadcrumbLabel(pathname: string): string {
  if (pathname === '/admin') return 'Overview'
  const match = crumbs.find((c) => pathname.startsWith(c.prefix))
  return match?.label ?? 'Admin'
}

type Props = { profile: Profile }

export default function AdminTopbar({ profile }: Props) {
  const pathname = usePathname()
  const router = useRouter()
  const initial = profile.full_name?.charAt(0)?.toUpperCase() ?? '?'
  const today = format(new Date(), 'EEEE, d MMMM yyyy')

  async function signOut() {
    await createClient().auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <header className="h-14 bg-white border-b border-gray-100 px-6 flex items-center justify-between flex-shrink-0">
      <span className="text-sm font-medium text-charcoal font-dm">{breadcrumbLabel(pathname)}</span>
      <div className="flex items-center gap-4">
        <span className="text-xs text-charcoal-muted font-dm hidden sm:inline">{today}</span>
        <div
          className="w-8 h-8 rounded-full bg-brand-pink flex items-center justify-center text-white text-xs font-medium font-dm"
          aria-hidden
        >
          {initial}
        </div>
        <button
          type="button"
          onClick={signOut}
          className="text-xs text-charcoal-muted hover:text-charcoal font-dm"
        >
          Sign out
        </button>
      </div>
    </header>
  )
}
