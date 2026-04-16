'use client'

import { useEffect, useMemo, useState } from 'react'
import NextImage from 'next/image'
import { FileText, Loader2, X } from 'lucide-react'
import type { Media } from '@/types'

export default function MediaPickerModal({
  isOpen,
  onClose,
  onSelect,
  type,
}: {
  isOpen: boolean
  onClose: () => void
  onSelect: (url: string, name: string, size?: number | null) => void
  type: 'image' | 'pdf'
}) {
  const [loading, setLoading] = useState(false)
  const [media, setMedia] = useState<Media[]>([])
  const [query, setQuery] = useState('')

  useEffect(() => {
    if (!isOpen) return
    setLoading(true)
    setQuery('')
    ;(async () => {
      try {
        const qs = new URLSearchParams()
        qs.set('used_in', 'all')
        qs.set('limit', '200')
        const res = await fetch(`/api/media/list?${qs.toString()}`)
        const j = (await res.json()) as { error?: string; media?: Media[] }
        if (!res.ok) throw new Error(j.error || 'Failed to load media')
        setMedia(j.media ?? [])
      } catch (e) {
        console.error('[MediaPickerModal] load', e)
        setMedia([])
      } finally {
        setLoading(false)
      }
    })()
  }, [isOpen])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return media
      .filter((m) => {
        const mt = (m.mime_type || '').toLowerCase()
        if (type === 'pdf') return mt === 'application/pdf' || m.file_url.toLowerCase().endsWith('.pdf')
        return mt.startsWith('image/')
      })
      .filter((m) => {
        if (!q) return true
        return m.file_name.toLowerCase().includes(q) || (m.alt_text || '').toLowerCase().includes(q)
      })
  }, [media, query, type])

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 z-[60] bg-black/40" aria-hidden onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 z-[61] w-[min(920px,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <div>
            <p className="font-dm text-xs font-medium uppercase tracking-wider text-charcoal-muted">Media Library</p>
            <p className="font-lora text-lg text-charcoal">{type === 'pdf' ? 'Select a PDF' : 'Select an image'}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-gray-200 bg-white p-2 hover:bg-charcoal-light"
            aria-label="Close"
          >
            <X size={16} className="text-charcoal-muted" />
          </button>
        </div>

        <div className="flex items-center gap-3 border-b border-gray-100 bg-charcoal-light/40 px-5 py-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
            className="w-full rounded-full border border-gray-200 bg-white px-4 py-2 font-dm text-xs text-charcoal focus:border-brand-pink focus:outline-none"
          />
        </div>

        <div className="max-h-[70vh] overflow-y-auto p-5">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-charcoal-muted">
              <Loader2 className="animate-spin" size={18} aria-hidden />
            </div>
          ) : filtered.length === 0 ? (
            <p className="py-10 text-center font-dm text-sm text-charcoal-muted">No matching media found.</p>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
              {filtered.map((m) => {
                const isPdf =
                  (m.mime_type || '').toLowerCase() === 'application/pdf' || m.file_url.toLowerCase().endsWith('.pdf')
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => onSelect(m.file_url, m.file_name, m.file_size ?? null)}
                    className="group relative aspect-square overflow-hidden rounded-xl border border-gray-100 bg-charcoal-light text-left hover:border-brand-pink"
                    title="Select"
                  >
                    {isPdf ? (
                      <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-brand-green-pale">
                        <FileText className="text-brand-green" size={22} aria-hidden />
                        <p className="px-2 text-center font-dm text-[11px] text-charcoal-muted line-clamp-2">
                          {m.file_name}
                        </p>
                      </div>
                    ) : (
                      <>
                        <NextImage src={m.file_url} alt={m.alt_text || m.file_name} fill className="object-cover" sizes="200px" />
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-1">
                          <p className="truncate font-dm text-[11px] text-white">{m.file_name}</p>
                        </div>
                      </>
                    )}
                    <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" aria-hidden />
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

