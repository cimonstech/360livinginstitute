'use client'

import type { Appointment } from '@/types'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'

export default function AppointmentAdminNotes({ appointment }: { appointment: Appointment }) {
  const router = useRouter()
  const [notes, setNotes] = useState(appointment.admin_notes ?? '')
  const [saving, setSaving] = useState(false)

  async function save() {
    setSaving(true)
    try {
      const res = await fetch(`/api/appointments/${appointment.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ admin_notes: notes }),
      })
      if (res.ok) router.refresh()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mt-6">
      <label className="text-xs font-medium text-charcoal-muted uppercase tracking-wider font-dm block mb-2">
        Admin notes
      </label>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={4}
        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-dm mb-3"
        placeholder="Internal notes (not visible to client)"
      />
      <button
        type="button"
        disabled={saving}
        onClick={save}
        className="rounded-full bg-brand-pink text-white px-5 py-2 text-sm font-dm inline-flex items-center gap-2 disabled:opacity-50"
      >
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        Save notes
      </button>
    </div>
  )
}
