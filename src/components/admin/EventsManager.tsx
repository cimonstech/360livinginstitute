'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Upload, X } from 'lucide-react'
import type { Event } from '@/types'

const CATEGORIES = [
  'Workshop',
  'Webinar',
  'Cohort',
  'Leadership',
  'Women',
  'Parenting',
  'Youth',
  'Other',
] as const

const STATUSES = ['upcoming', 'ongoing', 'past', 'cancelled'] as const

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

type FormState = {
  id?: string
  title: string
  slug: string
  category: string
  description: string
  long_description: string
  event_date: string
  event_time: string
  end_time: string
  location: string
  is_online: boolean
  online_link: string
  audience: string
  cover_image_url: string
  status: (typeof STATUSES)[number]
  is_featured: boolean
  registration_link: string
}

function emptyForm(): FormState {
  return {
    title: '',
    slug: '',
    category: 'Workshop',
    description: '',
    long_description: '',
    event_date: '',
    event_time: '',
    end_time: '',
    location: 'Accra, Ghana',
    is_online: false,
    online_link: '',
    audience: '',
    cover_image_url: '',
    status: 'upcoming',
    is_featured: false,
    registration_link: '',
  }
}

function eventToForm(ev: Event): FormState {
  return {
    id: ev.id,
    title: ev.title,
    slug: ev.slug,
    category: ev.category,
    description: ev.description ?? '',
    long_description: ev.long_description ?? '',
    event_date: ev.event_date,
    event_time: ev.event_time?.slice(0, 5) ?? '',
    end_time: ev.end_time?.slice(0, 5) ?? '',
    location: ev.location,
    is_online: ev.is_online,
    online_link: ev.online_link ?? '',
    audience: ev.audience ?? '',
    cover_image_url: ev.cover_image_url ?? '',
    status: ev.status,
    is_featured: ev.is_featured,
    registration_link: ev.registration_link ?? '',
  }
}

export default function EventsManager({ events }: { events: Event[] }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<FormState>(emptyForm())
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)

  function openNew() {
    setForm(emptyForm())
    setOpen(true)
  }

  function openEdit(ev: Event) {
    setForm(eventToForm(ev))
    setOpen(true)
  }

  async function uploadCover(file: File) {
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('used_in', 'event')
      const res = await fetch('/api/media/upload', { method: 'POST', body: fd })
      const j = await res.json()
      if (!res.ok) throw new Error(j.error || 'Upload failed')
      setForm((f) => ({ ...f, cover_image_url: j.media?.file_url ?? '' }))
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  async function save() {
    setSaving(true)
    try {
      const body: Record<string, unknown> = {
        title: form.title.trim(),
        slug: form.slug.trim() || slugify(form.title),
        category: form.category,
        description: form.description.trim() || null,
        long_description: form.long_description.trim() || null,
        event_date: form.event_date,
        event_time: form.event_time || null,
        end_time: form.end_time || null,
        location: form.location.trim(),
        is_online: form.is_online,
        online_link: form.online_link.trim() || null,
        audience: form.audience.trim() || null,
        cover_image_url: form.cover_image_url || null,
        status: form.status,
        is_featured: form.is_featured,
        registration_link: form.registration_link.trim() || null,
      }
      if (form.id) body.id = form.id

      const res = await fetch('/api/events/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const j = await res.json()
      if (!res.ok) throw new Error(j.error || 'Save failed')
      setOpen(false)
      router.refresh()
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  async function remove(id: string) {
    if (!confirm('Delete this event?')) return
    const res = await fetch(`/api/events/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      const j = await res.json()
      alert(j.error || 'Delete failed')
      return
    }
    router.refresh()
  }

  return (
    <div>
      <div className="mb-6 flex justify-end">
        <button
          type="button"
          onClick={openNew}
          className="rounded-full bg-brand-pink px-5 py-2.5 font-dm text-sm font-medium text-white"
        >
          + Add Event
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white">
        <table className="w-full min-w-[900px] text-left font-dm text-sm">
          <thead className="border-b border-gray-100 bg-charcoal-light/50 text-xs text-charcoal-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Location</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Featured</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((ev) => (
              <tr key={ev.id} className="border-b border-gray-50 last:border-0">
                <td className="px-4 py-3 font-medium text-charcoal">{ev.title}</td>
                <td className="px-4 py-3 text-charcoal-muted">{ev.category}</td>
                <td className="px-4 py-3 text-charcoal-muted">{ev.event_date}</td>
                <td className="px-4 py-3 text-charcoal-muted">{ev.is_online ? 'Online' : ev.location}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                      ev.status === 'upcoming' || ev.status === 'ongoing'
                        ? 'bg-brand-green-pale text-brand-green'
                        : ev.status === 'cancelled'
                          ? 'bg-red-50 text-red-700'
                          : 'bg-charcoal-light text-charcoal-muted'
                    }`}
                  >
                    {ev.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-charcoal-muted">{ev.is_featured ? 'Yes' : '—'}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => openEdit(ev)}
                    className="mr-2 rounded-full border border-gray-200 px-3 py-1 text-xs"
                  >
                    Edit
                  </button>
                  <Link
                    href={`/admin/events/registrations/${ev.id}`}
                    className="mr-2 inline-block font-dm text-xs font-medium text-brand-green hover:underline"
                  >
                    Registrations ({ev.event_registrations?.[0]?.count ?? 0})
                  </Link>
                  <button
                    type="button"
                    onClick={() => remove(ev.id)}
                    className="rounded-full border border-red-200 px-3 py-1 text-xs text-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {events.length === 0 && (
          <p className="p-8 text-center text-sm text-charcoal-muted">No events yet. Add your first program.</p>
        )}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/30" aria-hidden onClick={() => setOpen(false)} />
      )}
      {open && (
        <div className="fixed right-0 top-0 z-[51] flex h-full w-full max-w-lg flex-col overflow-y-auto bg-white p-8 shadow-2xl">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-lora text-xl text-charcoal">{form.id ? 'Edit event' : 'New event'}</h2>
            <button type="button" onClick={() => setOpen(false)} className="rounded-full p-2 hover:bg-charcoal-light" aria-label="Close">
              <X size={20} />
            </button>
          </div>

          <div className="flex flex-col gap-4 font-dm text-sm">
            <label className="flex flex-col gap-1">
              <span className="text-xs text-charcoal-muted">Title</span>
              <input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                onBlur={() => {
                  if (!form.slug && form.title) setForm((f) => ({ ...f, slug: slugify(f.title) }))
                }}
                className="rounded-xl border border-gray-200 px-3 py-2"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs text-charcoal-muted">Slug</span>
              <input
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                className="rounded-xl border border-gray-200 px-3 py-2"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs text-charcoal-muted">Category</span>
              <select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className="rounded-xl border border-gray-200 px-3 py-2"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs text-charcoal-muted">Description</span>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                className="rounded-xl border border-gray-200 px-3 py-2"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs text-charcoal-muted">Long description</span>
              <textarea
                rows={6}
                value={form.long_description}
                onChange={(e) => setForm((f) => ({ ...f, long_description: e.target.value }))}
                className="rounded-xl border border-gray-200 px-3 py-2"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs text-charcoal-muted">Event date</span>
              <input
                type="date"
                value={form.event_date}
                onChange={(e) => setForm((f) => ({ ...f, event_date: e.target.value }))}
                className="rounded-xl border border-gray-200 px-3 py-2"
              />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-1">
                <span className="text-xs text-charcoal-muted">Start time</span>
                <input
                  type="time"
                  value={form.event_time}
                  onChange={(e) => setForm((f) => ({ ...f, event_time: e.target.value }))}
                  className="rounded-xl border border-gray-200 px-3 py-2"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-xs text-charcoal-muted">End time</span>
                <input
                  type="time"
                  value={form.end_time}
                  onChange={(e) => setForm((f) => ({ ...f, end_time: e.target.value }))}
                  className="rounded-xl border border-gray-200 px-3 py-2"
                />
              </label>
            </div>
            <label className="flex flex-col gap-1">
              <span className="text-xs text-charcoal-muted">Location</span>
              <input
                value={form.location}
                onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                className="rounded-xl border border-gray-200 px-3 py-2"
              />
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.is_online}
                onChange={(e) => setForm((f) => ({ ...f, is_online: e.target.checked }))}
              />
              <span>Online event</span>
            </label>
            {form.is_online && (
              <label className="flex flex-col gap-1">
                <span className="text-xs text-charcoal-muted">Online link</span>
                <input
                  value={form.online_link}
                  onChange={(e) => setForm((f) => ({ ...f, online_link: e.target.value }))}
                  className="rounded-xl border border-gray-200 px-3 py-2"
                />
              </label>
            )}
            <label className="flex flex-col gap-1">
              <span className="text-xs text-charcoal-muted">Audience</span>
              <input
                value={form.audience}
                onChange={(e) => setForm((f) => ({ ...f, audience: e.target.value }))}
                className="rounded-xl border border-gray-200 px-3 py-2"
              />
            </label>
            <div>
              <p className="mb-2 text-xs text-charcoal-muted">Cover image</p>
              {form.cover_image_url ? (
                <div className="space-y-2">
                  <div className="relative h-36 w-full overflow-hidden rounded-xl bg-charcoal-light">
                    <Image src={form.cover_image_url} alt="" fill className="object-cover" sizes="400px" />
                  </div>
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, cover_image_url: '' }))}
                    className="rounded-full border border-gray-200 px-3 py-1 text-xs"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <label className="flex h-36 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 hover:border-brand-pink">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploading}
                    onChange={(e) => {
                      const f = e.target.files?.[0]
                      if (f) void uploadCover(f)
                      e.target.value = ''
                    }}
                  />
                  <Upload className="text-charcoal-muted" size={22} />
                  <span className="mt-2 text-xs text-charcoal-muted">{uploading ? 'Uploading…' : 'Upload cover'}</span>
                </label>
              )}
            </div>
            <label className="flex flex-col gap-1">
              <span className="text-xs text-charcoal-muted">Status</span>
              <select
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as FormState['status'] }))}
                className="rounded-xl border border-gray-200 px-3 py-2"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.is_featured}
                onChange={(e) => setForm((f) => ({ ...f, is_featured: e.target.checked }))}
              />
              <span>Featured</span>
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs text-charcoal-muted">Registration link (optional)</span>
              <input
                value={form.registration_link}
                onChange={(e) => setForm((f) => ({ ...f, registration_link: e.target.value }))}
                className="rounded-xl border border-gray-200 px-3 py-2"
              />
            </label>
          </div>

          <button
            type="button"
            disabled={saving}
            onClick={() => void save()}
            className="mt-8 rounded-full bg-brand-pink py-3 font-dm text-sm font-medium text-white disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save event'}
          </button>
        </div>
      )}
    </div>
  )
}
