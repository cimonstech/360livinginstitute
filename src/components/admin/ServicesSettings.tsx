'use client'

import type { Service } from '@/types'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'

type LocalRow = Service & { isNew?: boolean; markDelete?: boolean }

function slugify(title: string) {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  return `${base || 'service'}-${Math.random().toString(36).slice(2, 8)}`
}

export default function ServicesSettings({ services }: { services: Service[] }) {
  const router = useRouter()
  const [rows, setRows] = useState<LocalRow[]>(services)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setRows(services.map((s) => ({ ...s })))
  }, [services])

  function addRow() {
    const nextOrder = rows.length ? Math.max(...rows.map((r) => r.sort_order)) + 1 : 0
    setRows((prev) => [
      ...prev,
      {
        id: `new-${crypto.randomUUID()}`,
        slug: '',
        title: 'New service',
        description: '',
        duration_minutes: 60,
        price_ghs: undefined,
        is_active: true,
        sort_order: nextOrder,
        created_at: new Date().toISOString(),
        isNew: true,
      },
    ])
  }

  function updateRow(id: string, patch: Partial<LocalRow>) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)))
  }

  function requestDelete(id: string) {
    if (!window.confirm('Delete this service? This cannot be undone.')) return
    const row = rows.find((r) => r.id === id)
    if (row?.isNew) {
      setRows((prev) => prev.filter((r) => r.id !== id))
    } else {
      setRows((prev) => prev.map((r) => (r.id === id ? { ...r, markDelete: true } : r)))
    }
  }

  async function saveAll() {
    setSaving(true)
    const supabase = createClient()
    try {
      for (const r of rows) {
        if (r.markDelete && !r.isNew) {
          await supabase.from('services').delete().eq('id', r.id)
        }
      }
      const active = rows.filter((r) => !r.markDelete)
      for (const r of active) {
        if (r.isNew) {
          await supabase.from('services').insert({
            slug: slugify(r.title),
            title: r.title,
            description: r.description || null,
            duration_minutes: r.duration_minutes,
            price_ghs: r.price_ghs ?? null,
            is_active: r.is_active,
            sort_order: r.sort_order,
          })
        } else {
          await supabase
            .from('services')
            .update({
              title: r.title,
              description: r.description || null,
              duration_minutes: r.duration_minutes,
              price_ghs: r.price_ghs ?? null,
              is_active: r.is_active,
              sort_order: r.sort_order,
            })
            .eq('id', r.id)
        }
      }
      router.refresh()
    } finally {
      setSaving(false)
    }
  }

  const visible = rows.filter((r) => !r.markDelete)

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <h2 className="font-lora text-lg text-charcoal">Services</h2>
        <button
          type="button"
          onClick={addRow}
          className="rounded-full border-2 border-brand-pink text-brand-pink px-4 py-2 text-sm font-dm hover:bg-brand-pink-pale"
        >
          Add Service
        </button>
      </div>

      <div className="overflow-x-auto border border-gray-100 rounded-xl">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="bg-charcoal-light text-xs font-medium text-charcoal-muted uppercase tracking-wider font-dm">
            <tr>
              <th className="px-3 py-2 text-left">Title</th>
              <th className="px-3 py-2 text-left">Duration (min)</th>
              <th className="px-3 py-2 text-left">Active</th>
              <th className="px-3 py-2 text-left">Delete</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((r) => (
              <tr key={r.id} className="border-t border-gray-50">
                <td className="px-3 py-2">
                  <input
                    value={r.title}
                    onChange={(e) => updateRow(r.id, { title: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm font-dm"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    min={15}
                    step={5}
                    value={r.duration_minutes}
                    onChange={(e) => updateRow(r.id, { duration_minutes: Number(e.target.value) })}
                    className="w-24 border border-gray-200 rounded-lg px-2 py-1.5 text-sm font-dm"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="checkbox"
                    checked={r.is_active}
                    onChange={(e) => updateRow(r.id, { is_active: e.target.checked })}
                    className="accent-[#E8007D]"
                  />
                </td>
                <td className="px-3 py-2">
                  <button
                    type="button"
                    onClick={() => requestDelete(r.id)}
                    className="text-red-600 text-xs font-dm hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        type="button"
        disabled={saving}
        onClick={saveAll}
        className="mt-6 rounded-full bg-brand-pink text-white px-6 py-2.5 text-sm font-dm inline-flex items-center gap-2 disabled:opacity-50"
      >
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        Save All
      </button>
    </div>
  )
}
