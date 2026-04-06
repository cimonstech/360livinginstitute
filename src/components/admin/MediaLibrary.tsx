'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
import type { Media } from '@/types'

const FILTERS = ['all', 'blog', 'event', 'general'] as const

export default function MediaLibrary({ media: initial }: { media: Media[] }) {
  const router = useRouter()
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('all')
  const [uploadingCount, setUploadingCount] = useState(0)
  const [toast, setToast] = useState<string | null>(null)

  const filtered =
    filter === 'all'
      ? initial
      : initial.filter((m) => (m.used_in || 'general').toLowerCase() === filter)

  const showToast = useCallback((msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2000)
  }, [])

  async function uploadFiles(files: FileList | null) {
    if (!files?.length) return
    setUploadingCount((c) => c + files.length)
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData()
        fd.append('file', file)
        fd.append('used_in', 'general')
        const res = await fetch('/api/media/upload', { method: 'POST', body: fd })
        const j = await res.json()
        if (!res.ok) throw new Error(j.error || 'Upload failed')
      }
      router.refresh()
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Upload failed')
    } finally {
      setUploadingCount((c) => Math.max(0, c - (files?.length ?? 0)))
    }
  }

  async function copyUrl(url: string) {
    try {
      await navigator.clipboard.writeText(url)
      showToast('Copied!')
    } catch {
      showToast('Copy failed')
    }
  }

  async function remove(id: string) {
    if (!confirm('Delete this file from the library and storage?')) return
    const res = await fetch(`/api/media/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      const j = await res.json()
      alert(j.error || 'Delete failed')
      return
    }
    router.refresh()
  }

  return (
    <div>
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 rounded-full bg-charcoal px-4 py-2 font-dm text-xs text-white shadow-lg">
          {toast}
        </div>
      )}
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`rounded-full px-4 py-2 font-dm text-xs font-medium capitalize ${
                filter === f ? 'bg-brand-pink text-white' : 'border border-gray-200 text-charcoal-muted'
              }`}
            >
              {f === 'all' ? 'All' : f}
            </button>
          ))}
        </div>
        <label className="inline-flex cursor-pointer">
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              void uploadFiles(e.target.files)
              e.target.value = ''
            }}
          />
          <span className="rounded-full bg-brand-pink px-5 py-2 font-dm text-sm text-white">Upload</span>
        </label>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
        {uploadingCount > 0 &&
          Array.from({ length: uploadingCount }).map((_, i) => (
            <div key={`sk-${i}`} className="aspect-square animate-pulse rounded-xl bg-charcoal-light" />
          ))}
        {filtered.map((m) => (
          <div
            key={m.id}
            className="group relative aspect-square cursor-pointer overflow-hidden rounded-xl bg-charcoal-light"
          >
            <Image src={m.file_url} alt={m.alt_text || m.file_name} fill className="object-cover" sizes="200px" />
            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
              <button
                type="button"
                onClick={() => copyUrl(m.file_url)}
                className="rounded-full bg-white px-3 py-1.5 font-dm text-xs text-charcoal"
              >
                Copy URL
              </button>
              <button
                type="button"
                onClick={() => remove(m.id)}
                className="rounded-full bg-red-600 px-3 py-1.5 font-dm text-xs text-white"
              >
                Delete
              </button>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-1">
              <p className="truncate font-dm text-xs text-white">{m.file_name}</p>
            </div>
          </div>
        ))}
      </div>
      {filtered.length === 0 && uploadingCount === 0 && (
        <p className="py-12 text-center font-dm text-sm text-charcoal-muted">No media yet. Upload images to get started.</p>
      )}
    </div>
  )
}
