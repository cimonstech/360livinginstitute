'use client'

import type { Availability } from '@/types'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const SLOT_OPTIONS = [30, 45, 60, 90]

function normalizeTime(t: string) {
  if (t.length <= 5) return t.length === 5 ? `${t}:00` : t
  return t.slice(0, 8)
}

function toInputTime(t: string) {
  return t.slice(0, 5)
}

type Row = Availability

export default function AvailabilitySettings({ availability }: { availability: Availability[] }) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)

  const initialRows = useMemo(() => {
    return [0, 1, 2, 3, 4, 5, 6].map((dow) => {
      const found = availability.find((a) => a.day_of_week === dow)
      if (found) {
        return {
          ...found,
          start_time: toInputTime(found.start_time),
          end_time: toInputTime(found.end_time),
        }
      }
      return {
        id: '',
        day_of_week: dow,
        start_time: '09:00',
        end_time: '17:00',
        slot_duration_minutes: 60,
        is_active: dow !== 0,
      } as Row
    })
  }, [availability])

  const [rows, setRows] = useState<Row[]>(initialRows)

  useEffect(() => {
    setRows(initialRows)
  }, [initialRows])

  function updateRow(dow: number, patch: Partial<Row>) {
    setRows((prev) => prev.map((r) => (r.day_of_week === dow ? { ...r, ...patch } : r)))
  }

  async function save() {
    setSaving(true)
    const supabase = createClient()
    const payload = rows.map((r) => ({
      ...(r.id ? { id: r.id } : {}),
      day_of_week: r.day_of_week,
      start_time: normalizeTime(r.start_time),
      end_time: normalizeTime(r.end_time),
      slot_duration_minutes: r.slot_duration_minutes,
      is_active: r.is_active,
    }))
    const { error } = await supabase.from('availability').upsert(payload, { onConflict: 'day_of_week' })
    setSaving(false)
    if (!error) router.refresh()
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <h2 className="font-lora text-lg text-charcoal mb-5">Working Hours</h2>
      <div className="flex flex-col">
        {rows.map((row) => (
          <div
            key={row.day_of_week}
            className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 py-3 border-b border-gray-50 last:border-0"
          >
            <span className="w-28 text-sm font-medium text-charcoal font-dm shrink-0">
              {DAY_NAMES[row.day_of_week]}
            </span>
            <label className="flex items-center gap-2 text-sm text-charcoal-muted font-dm shrink-0">
              <input
                type="checkbox"
                checked={row.is_active}
                onChange={(e) => updateRow(row.day_of_week, { is_active: e.target.checked })}
                className="rounded border-gray-300 accent-[#E8007D]"
              />
              Active
            </label>
            {row.is_active && (
              <div className="flex flex-wrap items-center gap-2 flex-1">
                <input
                  type="time"
                  value={row.start_time.slice(0, 5)}
                  onChange={(e) => updateRow(row.day_of_week, { start_time: e.target.value })}
                  className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm font-dm"
                />
                <span className="text-xs text-charcoal-muted font-dm">to</span>
                <input
                  type="time"
                  value={row.end_time.slice(0, 5)}
                  onChange={(e) => updateRow(row.day_of_week, { end_time: e.target.value })}
                  className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm font-dm"
                />
                <select
                  value={row.slot_duration_minutes}
                  onChange={(e) =>
                    updateRow(row.day_of_week, { slot_duration_minutes: Number(e.target.value) })
                  }
                  className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm font-dm ml-auto"
                >
                  {SLOT_OPTIONS.map((m) => (
                    <option key={m} value={m}>
                      {m} min slots
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        ))}
      </div>
      <button
        type="button"
        disabled={saving}
        onClick={save}
        className="mt-6 rounded-full bg-brand-pink text-white px-6 py-2.5 text-sm font-dm inline-flex items-center gap-2 disabled:opacity-50"
      >
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        Save Changes
      </button>
    </div>
  )
}
