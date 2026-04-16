'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Download, ExternalLink, FileText, Image as ImageIcon } from 'lucide-react'
import type { BlogPost, Resource } from '@/types'
import { formatBlogDate } from '@/lib/format-display'

type ActiveType = 'all' | 'articles' | 'pdfs' | 'infographics'
type ActiveCategory =
  | 'all'
  | 'mental-health'
  | 'life-transitions'
  | 'youth'
  | 'women'
  | 'relationships'
  | 'wellness'
  | 'leadership'
  | 'community'

type ResourceItem =
  | { kind: 'article'; data: BlogPost }
  | { kind: 'pdf'; data: Resource }
  | { kind: 'infographic'; data: Resource }

const categoryOptions: { value: ActiveCategory; label: string }[] = [
  { value: 'all', label: 'All Categories' },
  { value: 'mental-health', label: 'Mental Health' },
  { value: 'life-transitions', label: 'Life Transitions' },
  { value: 'youth', label: 'Youth' },
  { value: 'women', label: 'Women' },
  { value: 'relationships', label: 'Relationships' },
  { value: 'wellness', label: 'Wellness' },
  { value: 'leadership', label: 'Leadership' },
  { value: 'community', label: 'Community' },
]

async function bumpDownload(id: string) {
  try {
    await fetch(`/api/resources/${id}/download`, { method: 'POST' })
  } catch {
    // fire-and-forget
  }
}

function ArticleCard({ post }: { post: BlogPost }) {
  const date = formatBlogDate(post.published_at || post.created_at)
  const attachmentKind = (() => {
    if (!post.attachment_url) return null
    if (post.resource_type === 'infographic') return 'infographic'
    if (post.resource_type === 'pdf') return 'pdf'
    const url = post.attachment_url.toLowerCase()
    const name = (post.attachment_name || '').toLowerCase()
    return url.endsWith('.pdf') || name.endsWith('.pdf') ? 'pdf' : 'infographic'
  })()
  return (
    <article className="overflow-hidden rounded-2xl border border-gray-100 bg-white transition-shadow hover:shadow-md">
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="relative h-40 w-full bg-brand-pink-pale">
          {post.cover_image_url ? (
            <Image
              src={post.cover_image_url}
              alt={post.cover_image_alt || post.title}
              fill
              className="object-cover"
              sizes="(max-width:768px) 100vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center font-lora text-sm text-brand-pink/40">360</div>
          )}
        </div>
        <div className="p-5">
          <div className="flex flex-wrap items-center gap-2">
            {post.category ? (
              <span className="rounded-full bg-charcoal-light px-2.5 py-0.5 font-dm text-[11px] font-medium text-charcoal">
                {post.category}
              </span>
            ) : null}
            <span className="rounded-full bg-brand-pink-pale px-2.5 py-0.5 font-dm text-[11px] font-medium text-brand-pink">
              Article
            </span>
          </div>
          <h3 className="mt-2 font-lora text-lg font-normal text-charcoal">{post.title}</h3>
          {post.excerpt ? (
            <p className="mt-2 line-clamp-3 font-dm text-sm font-light leading-relaxed text-charcoal-muted">
              {post.excerpt}
            </p>
          ) : null}
          <p className="mt-4 font-dm text-xs text-charcoal-muted">
            {post.author_name} · {date} · {post.read_time_minutes} min
          </p>
        </div>
      </Link>

      {post.attachment_url && attachmentKind ? (
        <div className="px-5 pb-5">
          <a
            href={post.attachment_url}
            download={post.attachment_name || undefined}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-2.5 font-dm text-sm font-medium text-white ${
              attachmentKind === 'pdf' ? 'bg-brand-green' : 'bg-brand-pink'
            }`}
          >
            {attachmentKind === 'pdf' ? (
              <>
                <FileText size={14} aria-hidden /> Download PDF →
              </>
            ) : (
              <>
                <ExternalLink size={14} aria-hidden /> View Infographic →
              </>
            )}
          </a>
        </div>
      ) : null}
    </article>
  )
}

function PdfCard({ r }: { r: Resource }) {
  const date = formatBlogDate(r.published_at || r.created_at)
  return (
    <article className="overflow-hidden rounded-2xl border border-gray-100 bg-white transition-shadow hover:shadow-md">
      <div className="relative h-40 w-full bg-brand-green-pale">
        {r.cover_image_url ? (
          <Image src={r.cover_image_url} alt="" fill className="object-cover" sizes="(max-width:768px) 100vw, 33vw" />
        ) : (
          <div className="flex h-full items-center justify-center">
            <FileText className="text-brand-green opacity-30" size={56} aria-hidden />
          </div>
        )}
      </div>
      <div className="p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-brand-green-pale px-3 py-1 font-dm text-xs font-medium text-brand-green">
            PDF Guide
          </span>
          {r.category ? (
            <span className="rounded-full bg-charcoal-light px-3 py-1 font-dm text-xs font-medium text-charcoal">
              {r.category}
            </span>
          ) : null}
        </div>
        <h3 className="mt-2 font-lora text-lg font-normal text-charcoal">{r.title}</h3>
        {r.description ? (
          <p className="mt-2 line-clamp-2 font-dm text-sm font-light text-charcoal-muted">{r.description}</p>
        ) : null}
        <p className="mt-4 font-dm text-xs text-charcoal-muted">
          {r.author_name} · {date}
        </p>
        {r.file_url ? (
          <a
            href={r.file_url}
            download={r.file_name || undefined}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => void bumpDownload(r.id)}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-green py-2.5 font-dm text-sm font-medium text-white"
          >
            <Download size={14} aria-hidden /> Download PDF
          </a>
        ) : null}
      </div>
    </article>
  )
}

function InfographicCard({ r }: { r: Resource }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-gray-100 bg-white transition-shadow hover:shadow-md">
      <div className="relative h-64 w-full bg-charcoal-light">
        {r.image_url ? (
          <Image
            src={r.image_url}
            alt={r.image_alt || r.title}
            fill
            className="object-contain"
            sizes="(max-width:768px) 100vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <ImageIcon className="text-brand-pink opacity-25" size={56} aria-hidden />
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-brand-pink-pale px-3 py-1 font-dm text-xs font-medium text-brand-pink">
            Infographic
          </span>
          {r.category ? (
            <span className="rounded-full bg-charcoal-light px-3 py-1 font-dm text-xs font-medium text-charcoal">
              {r.category}
            </span>
          ) : null}
        </div>
        <h3 className="mt-2 font-lora text-base font-normal text-charcoal">{r.title}</h3>
        {r.description ? <p className="mt-1 text-xs text-charcoal-muted">{r.description}</p> : null}
        {r.image_url ? (
          <a
            href={r.image_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => void bumpDownload(r.id)}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-pink py-2.5 font-dm text-sm font-medium text-white"
          >
            <ExternalLink size={14} aria-hidden /> View Full Size
          </a>
        ) : null}
      </div>
    </article>
  )
}

export default function ResourcesGrid({
  articles,
  resources,
}: {
  articles: BlogPost[]
  resources: Resource[]
}) {
  const [activeType, setActiveType] = useState<ActiveType>('all')
  const [activeCategory, setActiveCategory] = useState<ActiveCategory>('all')

  const allItems = useMemo(() => {
    const items: ResourceItem[] = [
      ...articles.map((a) => ({ kind: 'article' as const, data: a })),
      ...resources.map((r) => ({ kind: r.resource_type as 'pdf' | 'infographic', data: r })),
    ]
    return items.sort((a, b) => {
      const dateA = (a.data as any).published_at || (a.data as any).created_at
      const dateB = (b.data as any).published_at || (b.data as any).created_at
      return new Date(dateB).getTime() - new Date(dateA).getTime()
    })
  }, [articles, resources])

  const filtered = useMemo(() => {
    return allItems.filter((item) => {
      const typeMatch =
        activeType === 'all' ||
        (activeType === 'articles' && item.kind === 'article') ||
        (activeType === 'pdfs' && item.kind === 'pdf') ||
        (activeType === 'infographics' && item.kind === 'infographic')

      const cat = (item.data as any).category as string | null | undefined
      const catMatch = activeCategory === 'all' || cat === activeCategory
      return typeMatch && catMatch
    })
  }, [allItems, activeType, activeCategory])

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mb-8 flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            {(
              [
                ['all', 'All'] as const,
                ['articles', 'Articles'] as const,
                ['pdfs', 'PDFs'] as const,
                ['infographics', 'Infographics'] as const,
              ] satisfies [ActiveType, string][]
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setActiveType(key)}
                className={`rounded-full px-4 py-2 text-xs font-medium font-dm border transition-colors ${
                  activeType === key ? 'bg-brand-pink text-white border-brand-pink' : 'bg-white text-charcoal-muted border-gray-200 hover:border-brand-pink'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {categoryOptions.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => setActiveCategory(c.value)}
                className={`rounded-full px-3 py-1.5 text-[11px] font-medium font-dm border transition-colors ${
                  activeCategory === c.value ? 'bg-charcoal text-white border-charcoal' : 'bg-white text-charcoal-muted border-gray-200 hover:border-charcoal/30'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <p className="font-dm text-sm text-charcoal-muted">
              No resources found in this category yet. Check back soon.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item) => {
              if (item.kind === 'article') return <ArticleCard key={`a:${item.data.id}`} post={item.data} />
              if (item.kind === 'pdf') return <PdfCard key={`r:${item.data.id}`} r={item.data} />
              return <InfographicCard key={`r:${item.data.id}`} r={item.data} />
            })}
          </div>
        )}
      </div>
    </section>
  )
}

