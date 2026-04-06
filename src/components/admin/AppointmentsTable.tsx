'use client'

import type { Appointment, AppointmentStatus } from '@/types'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { format, formatDistanceToNow, parseISO } from 'date-fns'
import { Loader2 } from 'lucide-react'

type Tab = 'all' | AppointmentStatus

const TABS: { id: Tab; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'pending', label: 'Pending' },
  { id: 'confirmed', label: 'Confirmed' },
  { id: 'completed', label: 'Completed' },
  { id: 'cancelled', label: 'Cancelled' },
  { id: 'no_show', label: 'No Show' },
]

function initials(name: string) {
  const parts = name.trim().split(/\s+/)
  return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase() || '?'
}

function time12(t: string) {
  const [h, m] = t.split(':').map(Number)
  const d = new Date(2000, 0, 1, h, m || 0)
  return format(d, 'h:mm a')
}

function statusPill(status: AppointmentStatus) {
  const base = 'text-xs font-medium px-2 py-0.5 rounded-full capitalize font-dm inline-block'
  switch (status) {
    case 'pending':
      return `${base} bg-amber-50 text-amber-700 border border-amber-200`
    case 'confirmed':
      return `${base} bg-brand-green-pale text-brand-green border border-brand-green-light`
    case 'cancelled':
      return `${base} bg-red-50 text-red-600 border border-red-200`
    case 'completed':
    case 'no_show':
      return `${base} bg-charcoal-light text-charcoal-muted border border-gray-200`
    default:
      return `${base} bg-charcoal-light text-charcoal-muted`
  }
}

function toCsv(rows: Appointment[]) {
  const headers = ['id', 'client_name', 'client_email', 'client_phone', 'service_title', 'date', 'time', 'status', 'duration']
  const lines = [headers.join(',')]
  for (const r of rows) {
    const cells = [
      r.id,
      r.client_name,
      r.client_email,
      r.client_phone ?? '',
      r.service_title,
      r.appointment_date,
      r.appointment_time,
      r.status,
      String(r.duration_minutes),
    ].map((c) => `"${String(c).replace(/"/g, '""')}"`)
    lines.push(cells.join(','))
  }
  return lines.join('\n')
}

export default function AppointmentsTable({ appointments }: { appointments: Appointment[] }) {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState<Tab>('all')
  const [patchingId, setPatchingId] = useState<string | null>(null)
  const [cancelModeId, setCancelModeId] = useState<string | null>(null)
  const [cancelReason, setCancelReason] = useState('')

  const filtered = useMemo(() => {
    let list = appointments
    if (tab !== 'all') list = list.filter((a) => a.status === tab)
    const q = search.trim().toLowerCase()
    if (q) {
      list = list.filter(
        (a) =>
          a.client_name.toLowerCase().includes(q) ||
          a.client_email.toLowerCase().includes(q) ||
          a.service_title.toLowerCase().includes(q) ||
          (a.client_phone?.toLowerCase().includes(q) ?? false)
      )
    }
    return list
  }, [appointments, tab, search])

  async function patch(id: string, body: Record<string, unknown>) {
    setPatchingId(id)
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        console.error(j.error || res.statusText)
      } else {
        router.refresh()
        setCancelModeId(null)
        setCancelReason('')
      }
    } finally {
      setPatchingId(null)
    }
  }

  function exportCsv() {
    const blob = new Blob([toCsv(filtered)], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `appointments-${format(new Date(), 'yyyy-MM-dd')}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, service..."
          className="flex-1 min-w-[200px] max-w-xs border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-pink font-dm"
        />
        <div className="flex flex-wrap gap-1 bg-white rounded-full p-1 border border-gray-100">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`rounded-full px-3 py-1.5 text-xs font-dm transition-colors ${
                tab === t.id
                  ? 'bg-brand-pink text-white font-medium'
                  : 'text-charcoal-muted hover:bg-charcoal-light'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={exportCsv}
          className="border border-gray-200 text-charcoal-muted text-xs px-4 py-2 rounded-full font-dm hover:bg-white"
        >
          Export CSV
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="bg-charcoal-light text-xs font-medium text-charcoal-muted uppercase tracking-wider font-dm">
              <th className="px-4 py-3 text-left">#</th>
              <th className="px-4 py-3 text-left">Client</th>
              <th className="px-4 py-3 text-left">Service</th>
              <th className="px-4 py-3 text-left">Date &amp; Time</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Booked</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((a) => {
              const busy = patchingId === a.id
              const date = parseISO(a.appointment_date + 'T12:00:00')
              return (
                <tr key={a.id} className="border-b border-gray-50 hover:bg-charcoal-light/30 transition-colors">
                  <td className="px-4 py-3 text-xs text-charcoal-muted font-mono font-dm">{a.id.slice(-6)}</td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-brand-pink-pale text-brand-pink text-xs font-medium flex items-center justify-center font-dm shrink-0">
                        {initials(a.client_name)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-charcoal font-dm truncate">{a.client_name}</p>
                        <p className="text-xs text-charcoal-muted truncate font-dm">{a.client_email}</p>
                        {a.client_phone && <p className="text-xs text-charcoal-muted font-dm">{a.client_phone}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <p className="text-charcoal font-dm">{a.service_title}</p>
                    <span className="inline-block mt-1 text-xs bg-charcoal-light text-charcoal-muted px-2 py-0.5 rounded-full font-dm">
                      {a.duration_minutes} min
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <p className="font-medium text-sm text-charcoal font-dm">{format(date, 'EEE, d MMM yyyy')}</p>
                    <p className="text-xs text-charcoal-muted font-dm">{time12(a.appointment_time)}</p>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className={statusPill(a.status)}>{a.status.replace('_', ' ')}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-charcoal-muted font-dm whitespace-nowrap">
                    {formatDistanceToNow(parseISO(a.created_at), { addSuffix: true })}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex flex-col items-start gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        {a.status === 'pending' && (
                          <>
                            <button
                              type="button"
                              disabled={busy}
                              onClick={() => patch(a.id, { status: 'confirmed' })}
                              className="bg-brand-green text-white text-xs px-3 py-1.5 rounded-full font-dm inline-flex items-center gap-1 disabled:opacity-50"
                            >
                              {busy ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
                              Confirm ✓
                            </button>
                            <button
                              type="button"
                              disabled={busy}
                              onClick={() => {
                                setCancelModeId(a.id)
                                setCancelReason('')
                              }}
                              className="bg-red-50 text-red-600 text-xs px-3 py-1.5 rounded-full border border-red-200 font-dm"
                            >
                              Cancel ✗
                            </button>
                          </>
                        )}
                        {a.status === 'confirmed' && (
                          <>
                            <button
                              type="button"
                              disabled={busy}
                              onClick={() => patch(a.id, { status: 'completed' })}
                              className="bg-charcoal-light text-charcoal text-xs px-3 py-1.5 rounded-full font-dm inline-flex items-center gap-1 disabled:opacity-50"
                            >
                              {busy ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
                              Complete
                            </button>
                            <button
                              type="button"
                              disabled={busy}
                              onClick={() => {
                                setCancelModeId(a.id)
                                setCancelReason('')
                              }}
                              className="bg-red-50 text-red-600 text-xs px-3 py-1.5 rounded-full border border-red-200 font-dm"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                        <Link
                          href={`/admin/appointments/${a.id}`}
                          className="text-brand-pink text-xs font-dm hover:underline"
                        >
                          View →
                        </Link>
                      </div>
                      {cancelModeId === a.id && (
                        <div className="flex flex-col gap-2 w-full max-w-xs">
                          <input
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                            placeholder="Cancellation reason"
                            className="border border-gray-200 rounded-xl px-3 py-2 text-xs font-dm"
                          />
                          <div className="flex gap-2">
                            <button
                              type="button"
                              disabled={busy || !cancelReason.trim()}
                              onClick={() => patch(a.id, { status: 'cancelled', cancellation_reason: cancelReason })}
                              className="bg-red-600 text-white text-xs px-3 py-1.5 rounded-full font-dm disabled:opacity-50"
                            >
                              Confirm Cancel
                            </button>
                            <button
                              type="button"
                              onClick={() => setCancelModeId(null)}
                              className="text-xs text-charcoal-muted px-2 font-dm"
                            >
                              Dismiss
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="text-center py-16 text-charcoal-muted text-sm font-dm">No appointments found</p>
        )}
      </div>
    </div>
  )
}
