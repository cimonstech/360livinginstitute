'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { Resource } from '@/types'
import { formatBlogDate } from '@/lib/format-display'

function badgeClasses(kind: 'pdf' | 'infographic') {
  return kind === 'pdf'
    ? 'bg-brand-green-pale text-brand-green'
    : 'bg-brand-pink-pale text-brand-pink'
}

function publishBadge(publishTo: Resource['publish_to']) {
  if (publishTo === 'foundation') return 'bg-brand-pink-pale text-brand-pink'
  if (publishTo === 'both') return 'bg-brand-green-pale text-brand-green'
  return 'bg-charcoal-light text-charcoal'
}

export default function ResourcesTable({ resources }: { resources: Resource[] }) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function remove(id: string) {
    if (!confirm('Delete this resource permanently?')) return
    setDeletingId(id)
    try {
      const res = await fetch(`/api/resources/${id}`, { method: 'DELETE' })
      if (!res.ok) {
        const j = await res.json()
        throw new Error(j.error || 'Delete failed')
      }
      router.refresh()
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Delete failed')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white">
      <table className="w-full min-w-[1100px] text-left font-dm text-sm">
        <thead className="border-b border-gray-100 bg-charcoal-light/50 text-xs text-charcoal-muted">
          <tr>
            <th className="px-4 py-3 font-medium">Cover</th>
            <th className="px-4 py-3 font-medium">Title</th>
            <th className="px-4 py-3 font-medium">Type</th>
            <th className="px-4 py-3 font-medium">Category</th>
            <th className="px-4 py-3 font-medium">Publish To</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Downloads</th>
            <th className="px-4 py-3 font-medium">Date</th>
            <th className="px-4 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {resources.map((r) => (
            <tr key={r.id} className="border-b border-gray-50 last:border-0">
              <td className="px-4 py-3">
                <div className="relative h-12 w-16 overflow-hidden rounded-lg bg-charcoal-light">
                  {r.cover_image_url ? (
                    <Image src={r.cover_image_url} alt="" fill className="object-cover" sizes="64px" />
                  ) : null}
                </div>
              </td>
              <td className="px-4 py-3 max-w-[260px] truncate font-medium text-charcoal">{r.title}</td>
              <td className="px-4 py-3">
                <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${badgeClasses(r.resource_type)}`}>
                  {r.resource_type.toUpperCase()}
                </span>
              </td>
              <td className="px-4 py-3 text-charcoal-muted">{r.category || '—'}</td>
              <td className="px-4 py-3">
                <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${publishBadge(r.publish_to)}`}>
                  {r.publish_to}
                </span>
              </td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    r.status === 'published' ? 'bg-brand-green-pale text-brand-green' : 'bg-amber-50 text-amber-800'
                  }`}
                >
                  {r.status}
                </span>
              </td>
              <td className="px-4 py-3 text-charcoal-muted tabular-nums">{r.download_count ?? 0}</td>
              <td className="px-4 py-3 text-charcoal-muted">
                {formatBlogDate(r.published_at || r.created_at)}
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex flex-wrap justify-end gap-2">
                  <Link
                    href={`/admin/resources/${r.id}/edit`}
                    className="rounded-full border border-gray-200 px-3 py-1 text-xs text-charcoal hover:border-brand-pink"
                  >
                    Edit
                  </Link>
                  {r.status === 'published' && (
                    <a
                      href={r.resource_type === 'pdf' ? r.file_url || undefined : r.image_url || undefined}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full border border-gray-200 px-3 py-1 text-xs text-charcoal hover:border-brand-pink"
                    >
                      View
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => remove(r.id)}
                    disabled={deletingId === r.id}
                    className="rounded-full border border-red-200 px-3 py-1 text-xs text-red-600 hover:bg-red-50 disabled:opacity-50"
                  >
                    {deletingId === r.id ? '…' : 'Delete'}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {resources.length === 0 && (
        <p className="p-8 text-center text-sm text-charcoal-muted">No resources yet. Add your first PDF or infographic.</p>
      )}
    </div>
  )
}

