'use client'

import type { EventRegistration } from '@/types'

function csvEscape(value: string) {
  if (/[",\n\r]/.test(value)) return `"${value.replace(/"/g, '""')}"`
  return value
}

export default function RegistrationsCsvExport({
  eventTitle,
  registrations,
}: {
  eventTitle: string
  registrations: EventRegistration[]
}) {
  function exportCsv() {
    const rows: string[][] = [
      ['Name', 'Email', 'Phone', 'Organisation', 'Status', 'Registered At'],
      ...registrations.map((r) => [
        r.full_name,
        r.email,
        r.phone || '',
        r.organisation || '',
        r.status,
        new Date(r.created_at).toLocaleString(),
      ]),
    ]
    const csv = rows.map((row) => row.map((cell) => csvEscape(cell)).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    const safe = eventTitle.replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-') || 'event'
    a.download = `${safe}-registrations.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <button
      type="button"
      onClick={exportCsv}
      className="rounded-full border border-gray-200 px-4 py-2 font-dm text-xs text-charcoal-muted transition-colors hover:bg-charcoal-light"
    >
      Export CSV
    </button>
  )
}
