import { assertAdminSession } from '@/lib/assert-admin'
import { createAdminClient } from '@/lib/supabase/admin'
import { sanitizeHttpsUrl, sanitizeLongText, sanitizeString, sanitizeSlug } from '@/lib/sanitize'
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
  const title = sanitizeString(raw.title)
  const slugIn = typeof raw.slug === 'string' ? sanitizeSlug(raw.slug) : ''
  const data: Record<string, unknown> = {
    title,
    slug: slugIn,
    description: raw.description != null ? sanitizeString(raw.description) || null : null,
    long_description: raw.long_description != null ? sanitizeLongText(raw.long_description) || null : null,
    category: sanitizeString(raw.category) || 'Workshop',
    event_date: typeof raw.event_date === 'string' ? raw.event_date.trim().slice(0, 32) : '',
    event_time: raw.event_time != null ? sanitizeString(raw.event_time).slice(0, 16) || null : null,
    end_time: raw.end_time != null ? sanitizeString(raw.end_time).slice(0, 16) || null : null,
    location: sanitizeString(raw.location) || 'Accra, Ghana',
    is_online: Boolean(raw.is_online),
    online_link: raw.online_link != null ? sanitizeHttpsUrl(raw.online_link) : null,
    audience: raw.audience != null ? sanitizeString(raw.audience) || null : null,
    cover_image_url: raw.cover_image_url != null ? sanitizeHttpsUrl(raw.cover_image_url) : null,
    status: sanitizeString(raw.status) || 'upcoming',
    is_featured: Boolean(raw.is_featured),
    registration_link: raw.registration_link != null ? sanitizeHttpsUrl(raw.registration_link) : null,
  }

  if (!data.title) {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 })
  }
  if (!data.event_date) {
    return NextResponse.json({ error: 'Event date is required' }, { status: 400 })
  }

  if (!data.slug || String(data.slug).trim() === '') {
    data.slug = slugify(String(data.title))
  }

  const admin = createAdminClient()
  const result = id
    ? await admin.from('events').update(data).eq('id', id).select().single()
    : await admin.from('events').insert(data).select().single()

  if (result.error) {
    return NextResponse.json({ error: result.error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, event: result.data })
}
