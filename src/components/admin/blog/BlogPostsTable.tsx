'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { BlogPost } from '@/types'
import { formatBlogDate } from '@/lib/format-display'

export default function BlogPostsTable({ posts }: { posts: BlogPost[] }) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function remove(id: string) {
    if (!confirm('Delete this post permanently?')) return
    setDeletingId(id)
    try {
      const res = await fetch(`/api/blog/${id}`, { method: 'DELETE' })
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
      <table className="w-full min-w-[720px] text-left font-dm text-sm">
        <thead className="border-b border-gray-100 bg-charcoal-light/50 text-xs text-charcoal-muted">
          <tr>
            <th className="px-4 py-3 font-medium">Cover</th>
            <th className="px-4 py-3 font-medium">Title</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Author</th>
            <th className="px-4 py-3 font-medium">Date</th>
            <th className="px-4 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((p) => (
            <tr key={p.id} className="border-b border-gray-50 last:border-0">
              <td className="px-4 py-3">
                <div className="relative h-12 w-16 overflow-hidden rounded-lg bg-brand-pink-pale">
                  {p.cover_image_url ? (
                    <Image src={p.cover_image_url} alt="" fill className="object-cover" sizes="64px" />
                  ) : null}
                </div>
              </td>
              <td className="px-4 py-3 font-medium text-charcoal max-w-[200px] truncate">{p.title}</td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    p.status === 'published' ? 'bg-brand-green-pale text-brand-green' : 'bg-amber-50 text-amber-800'
                  }`}
                >
                  {p.status}
                </span>
              </td>
              <td className="px-4 py-3 text-charcoal-muted">{p.author_name}</td>
              <td className="px-4 py-3 text-charcoal-muted">
                {formatBlogDate(p.published_at || p.created_at)}
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex flex-wrap justify-end gap-2">
                  <Link
                    href={`/admin/blog/${p.id}/edit`}
                    className="rounded-full border border-gray-200 px-3 py-1 text-xs text-charcoal hover:border-brand-pink"
                  >
                    Edit
                  </Link>
                  {p.status === 'published' && (
                    <a
                      href={`/blog/${p.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full border border-gray-200 px-3 py-1 text-xs text-charcoal hover:border-brand-pink"
                    >
                      View
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => remove(p.id)}
                    disabled={deletingId === p.id}
                    className="rounded-full border border-red-200 px-3 py-1 text-xs text-red-600 hover:bg-red-50 disabled:opacity-50"
                  >
                    {deletingId === p.id ? '…' : 'Delete'}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {posts.length === 0 && (
        <p className="p-8 text-center text-sm text-charcoal-muted">No posts yet. Create your first article.</p>
      )}
    </div>
  )
}
