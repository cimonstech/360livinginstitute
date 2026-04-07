'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import {
  LayoutDashboard,
  Calendar,
  Users,
  CalendarDays,
  Settings,
  BarChart2,
  Globe,
  FileText,
  Image as ImageIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const nav: {
  href: string
  label: string
  icon: typeof LayoutDashboard
  exact?: boolean
}[] = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/admin/appointments', label: 'Appointments', icon: Calendar },
  { href: '/admin/clients', label: 'Clients', icon: Users },
  { href: '/admin/calendar', label: 'Calendar', icon: Calendar },
  { href: '/admin/blog', label: 'Blog Posts', icon: FileText },
  { href: '/admin/media', label: 'Media', icon: ImageIcon },
  { href: '/admin/events', label: 'Events', icon: CalendarDays },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

const secondary = [
  { href: '/admin/emails', label: 'Email Logs', icon: BarChart2 },
] as const

export default function AdminSidebar() {
  const pathname = usePathname()
  const [email, setEmail] = useState('')

  useEffect(() => {
    createClient()
      .auth.getUser()
      .then(({ data: { user } }) => setEmail(user?.email ?? ''))
  }, [])

  function active(href: string, exact?: boolean) {
    if (exact) return pathname === href
    return pathname === href || pathname.startsWith(href + '/')
  }

  return (
    <aside className="w-64 bg-charcoal min-h-screen flex flex-col flex-shrink-0">
      <div className="p-6 border-b border-white/10">
        <Link href="/admin" className="block">
          <Image
            src="/images/logo2.png"
            alt="360 Living Institute"
            width={100}
            height={34}
            className="brightness-0 invert h-8 w-auto"
          />
        </Link>
        <p className="text-xs text-white/40 mt-1 font-dm">Admin Panel</p>
      </div>

      <nav className="flex flex-col gap-1 p-4 flex-1">
        {nav.map(({ href, label, icon: Icon, exact }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-colors font-dm',
              active(href, exact)
                ? 'bg-brand-pink text-white'
                : 'text-white/60 hover:bg-white/5 hover:text-white'
            )}
          >
            <Icon size={18} aria-hidden />
            {label}
          </Link>
        ))}

        <div className="border-t border-white/10 mx-0 my-2" />

        {secondary.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-colors font-dm',
              active(href)
                ? 'bg-brand-pink text-white'
                : 'text-white/60 hover:bg-white/5 hover:text-white'
            )}
          >
            <Icon size={18} aria-hidden />
            {label}
          </Link>
        ))}

        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-white/60 hover:bg-white/5 hover:text-white transition-colors font-dm"
        >
          <Globe size={18} aria-hidden />
          View Website
        </a>
      </nav>

      <div className="p-4 border-t border-white/10">
        <p className="text-xs text-white/40 font-dm">Signed in as</p>
        <p className="text-sm text-white/80 font-medium font-dm truncate">{email || '—'}</p>
      </div>
    </aside>
  )
}
