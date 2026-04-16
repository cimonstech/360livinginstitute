import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { assertAdminSession } from '@/lib/assert-admin'
import { sanitizeHttpsUrl, sanitizeSlug, sanitizeString } from '@/lib/sanitize'

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
  const title = sanitizeString(body.title)
  const slug = typeof body.slug === 'string' ? sanitizeSlug(body.slug) : ''

  const resourceType = body.resource_type === 'infographic' ? 'infographic' : 'pdf'
  const publishTo =
    body.publish_to === 'foundation' || body.publish_to === 'both' || body.publish_to === 'institute'
      ? body.publish_to
      : 'foundation'
  const status = body.status === 'published' ? 'published' : 'draft'

  const data: Record<string, unknown> = {
    title,
    slug: slug || slugify(title),
    description: body.description != null ? sanitizeString(body.description) || null : null,
    resource_type: resourceType,
    publish_to: publishTo,
    category: body.category != null ? sanitizeString(body.category) || null : null,
    file_url: body.file_url != null ? sanitizeHttpsUrl(body.file_url) : null,
    file_name: body.file_name != null ? sanitizeString(body.file_name) || null : null,
    file_size: typeof body.file_size === 'number' ? Math.max(0, Math.floor(body.file_size)) : null,
    image_url: body.image_url != null ? sanitizeHttpsUrl(body.image_url) : null,
    image_alt: body.image_alt != null ? sanitizeString(body.image_alt) || null : null,
    cover_image_url: body.cover_image_url != null ? sanitizeHttpsUrl(body.cover_image_url) : null,
    author_name: body.author_name != null ? sanitizeString(body.author_name) || 'Selasi Doku' : 'Selasi Doku',
    tags: Array.isArray(body.tags)
      ? body.tags.filter((t): t is string => typeof t === 'string').map((t) => sanitizeString(t)).filter(Boolean)
      : [],
    featured: Boolean(body.featured),
    status,
  }

  if (!data.title || !String(data.title).trim()) {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 })
  }

  if (status === 'published' && !body.published_at) {
    data.published_at = new Date().toISOString()
  } else if (body.published_at) {
    data.published_at = body.published_at
  }

  const supabase = createAdminClient()
  const result = id
    ? await supabase.from('resources').update(data).eq('id', id).select().single()
    : await supabase.from('resources').insert(data).select().single()

  if (result.error) return NextResponse.json({ error: result.error.message }, { status: 500 })
  return NextResponse.json({ success: true, resource: result.data })
}

