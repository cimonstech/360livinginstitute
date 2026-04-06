'use client'

import type { Profile } from '@/types'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { format, parseISO } from 'date-fns'

type ClientWithSessions = Profile & {
  appointments?: { count: number }[] | null
}

function initials(name: string) {
  const p = name.trim().split(/\s+/)
  return ((p[0]?.[0] ?? '') + (p[1]?.[0] ?? '')).toUpperCase() || '?'
}

function sessionCount(row: ClientWithSessions) {
  const agg = row.appointments?.[0]
  return typeof agg?.count === 'number' ? agg.count : 0
}

export default function ClientsTable({ clients }: { clients: ClientWithSessions[] }) {
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return clients
    return clients.filter(
      (c) =>
        c.full_name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.phone?.toLowerCase().includes(q) ?? false)
    )
  }, [clients, search])

  return (
    <div>
      <input
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search clients..."
        className="w-full max-w-xs border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-pink font-dm mb-5"
      />

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden overflow-x-auto">
        <table className="w-full min-w-[720px]">
          <thead>
            <tr className="bg-charcoal-light text-xs font-medium text-charcoal-muted uppercase tracking-wider font-dm">
              <th className="px-4 py-3 text-left">Client</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Phone</th>
              <th className="px-4 py-3 text-left">Sessions</th>
              <th className="px-4 py-3 text-left">Joined</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="border-b border-gray-50 hover:bg-charcoal-light/30 transition-colors">
                <td className="px-4 py-3 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-brand-pink-pale text-brand-pink text-xs font-medium flex items-center justify-center font-dm shrink-0">
                      {initials(c.full_name)}
                    </div>
                    <span className="text-charcoal font-dm font-medium">{c.full_name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-charcoal-muted break-all font-dm">{c.email}</td>
                <td className="px-4 py-3 text-sm text-charcoal-muted font-dm">{c.phone || '—'}</td>
                <td className="px-4 py-3 text-sm text-charcoal font-dm">{sessionCount(c)}</td>
                <td className="px-4 py-3 text-sm text-charcoal-muted font-dm">
                  {format(parseISO(c.created_at), 'd MMM yyyy')}
                </td>
                <td className="px-4 py-3 text-sm">
                  <Link href={`/admin/clients/${c.id}`} className="text-brand-pink text-sm font-dm hover:underline">
                    View Profile →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="text-center py-16 text-charcoal-muted text-sm font-dm">No clients found</p>
        )}
      </div>
    </div>
  )
}
