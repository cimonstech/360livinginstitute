'use client'

import { useState } from 'react'
import { Loader2, Save } from 'lucide-react'
import { useRouter } from 'next/navigation'

type Props = {
  table: 'applications' | 'partners' | 'volunteers' | 'sponsors'
  id: string
  currentStatus: string
  statusOptions: string[]
  currentNotes?: string | null
}

export default function FoundationSubmissionActions({
  table,
  id,
  currentStatus,
  statusOptions,
  currentNotes,
}: Props) {
  const router = useRouter()
  const [status, setStatus] = useState(currentStatus)
  const [notes, setNotes] = useState(currentNotes ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function save() {
    setSaving(true)
    setError('')
    try {
      const res = await fetch(`/api/foundation/${table}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, admin_notes: notes }),
      })
      const data = (await res.json()) as { error?: string }
      if (!res.ok) throw new Error(data.error || 'Failed to update.')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex min-w-[240px] flex-col gap-2">
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="rounded-lg border border-gray-200 px-2 py-1 font-dm text-xs text-charcoal focus:border-brand-pink focus:outline-none"
      >
        {statusOptions.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <textarea
        rows={2}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Add note..."
        className="resize-y rounded-lg border border-gray-200 px-2 py-1 font-dm text-xs text-charcoal focus:border-brand-pink focus:outline-none"
      />
      <button
        type="button"
        onClick={() => void save()}
        disabled={saving}
        className="inline-flex items-center justify-center gap-1 rounded-lg bg-charcoal px-2 py-1.5 font-dm text-xs text-white hover:bg-charcoal/90 disabled:opacity-60"
      >
        {saving ? <Loader2 size={12} className="animate-spin" aria-hidden /> : <Save size={12} aria-hidden />}
        Save
      </button>
      {error ? <p className="font-dm text-[11px] text-red-600">{error}</p> : null}
    </div>
  )
}
