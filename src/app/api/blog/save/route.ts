import { assertAdminSession } from '@/lib/assert-admin'
import { createAdminClient } from '@/lib/supabase/admin'
import { sanitizeBlogHtml } from '@/lib/purify-server'
import { sanitizeHttpsUrl, sanitizeString, sanitizeSlug } from '@/lib/sanitize'
import { NextRequest, NextResponse } from 'next/server'

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export async function POST(request: NextRequest) {
  const auth = await assertAdminSession()
  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status })
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const id = typeof body.id === 'string' ? body.id : undefined
  const raw = body as Record<string, unknown>
  const titleIn = typeof raw.title === 'string' ? raw.title : ''
  const contentHtml = sanitizeBlogHtml(raw.content)
  const slugIn = typeof raw.slug === 'string' ? sanitizeSlug(raw.slug) : ''
  const excerpt = raw.excerpt != null ? sanitizeString(raw.excerpt).slice(0, 500) || null : null
  const coverUrl = raw.cover_image_url != null ? sanitizeHttpsUrl(raw.cover_image_url) : null
  const coverAlt = raw.cover_image_alt != null ? sanitizeString(raw.cover_image_alt) || null : null
  const authorName = raw.author_name != null ? sanitizeString(raw.author_name) || 'Selasi Doku' : 'Selasi Doku'
  const tagsRaw = Array.isArray(raw.tags) ? raw.tags : []
  const tags = tagsRaw
    .filter((t): t is string => typeof t === 'string')
    .map((t) => sanitizeString(t))
    .filter(Boolean)
    .slice(0, 30)

  const data: Record<string, unknown> = {
    title: sanitizeString(titleIn),
    slug: slugIn,
    excerpt,
    content: contentHtml,
    cover_image_url: coverUrl,
    cover_image_alt: coverAlt,
    author_name: authorName,
    status: raw.status === 'published' ? 'published' : 'draft',
    featured: Boolean(raw.featured),
    tags,
    read_time_minutes: typeof raw.read_time_minutes === 'number' ? Math.min(240, Math.max(1, raw.read_time_minutes)) : 5,
  }

  if (!data.title || !String(data.title).trim()) {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 })
  }
  if (!contentHtml.trim()) {
    return NextResponse.json({ error: 'Content is required' }, { status: 400 })
  }

  if (!data.slug || String(data.slug).trim() === '') {
    data.slug = slugify(String(data.title))
  }

  if (data.status === 'published' && !raw.published_at) {
    data.published_at = new Date().toISOString()
  } else if (raw.published_at) {
    data.published_at = raw.published_at
  }

  if (!id) {
    data.author_id = auth.userId
  }

  const admin = createAdminClient()
  const result = id
    ? await admin.from('blog_posts').update(data).eq('id', id).select().single()
    : await admin.from('blog_posts').insert(data).select().single()

  if (result.error) {
    return NextResponse.json({ error: result.error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, post: result.data })
}
