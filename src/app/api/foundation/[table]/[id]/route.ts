import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { assertAdminSession } from '@/lib/assert-admin'
import { sanitizeLongText, sanitizeString, sanitizeUuid } from '@/lib/sanitize'

const TABLES = {
  applications: {
    table: 'foundation_applications',
    statuses: ['new', 'reviewing', 'accepted', 'waitlisted', 'rejected'],
  },
  partners: {
    table: 'foundation_partners',
    statuses: ['new', 'reviewing', 'active', 'declined'],
  },
  volunteers: {
    table: 'foundation_volunteers',
    statuses: ['new', 'reviewing', 'active', 'inactive'],
  },
  sponsors: {
    table: 'foundation_sponsors',
    statuses: ['new', 'contacted', 'confirmed', 'declined'],
  },
} as const

type TableKey = keyof typeof TABLES

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ table: string; id: string }> }
) {
  const auth = await assertAdminSession()
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status })

  const { table, id } = await params
  if (!(table in TABLES)) {
    return NextResponse.json({ error: 'Invalid table' }, { status: 400 })
  }

  const cleanId = sanitizeUuid(id)
  if (!cleanId) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 })
  }

  const config = TABLES[table as TableKey]
  const updates: Record<string, unknown> = {}
  if (typeof body.status === 'string') {
    const status = sanitizeString(body.status)
    if (!(config.statuses as readonly string[]).includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }
    updates.status = status
  }
  if (typeof body.admin_notes === 'string' || body.admin_notes === null) {
    updates.admin_notes = body.admin_notes === null ? null : sanitizeLongText(body.admin_notes)
  }
  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update.' }, { status: 400 })
  }

  const supabase = createAdminClient()
  const { error } = await supabase.from(config.table).update(updates).eq('id', cleanId)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}
