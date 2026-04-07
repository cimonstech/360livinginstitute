import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { assertAdminSession } from '@/lib/assert-admin'
import { NextRequest, NextResponse } from 'next/server'
import { sendBookingConfirmed, sendBookingCancelled } from '@/lib/email'
import { sanitizeLongText, sanitizeString, sanitizeUuid } from '@/lib/sanitize'
import { z } from 'zod'

const PatchSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'cancelled', 'completed', 'no_show']).optional(),
  admin_notes: z.string().nullable().optional(),
  cancellation_reason: z.string().nullable().optional(),
})

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await assertAdminSession()
  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status })
  }

  const { id: rawId } = await params
  const id = sanitizeUuid(rawId)
  if (!id) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
  }

  let raw: unknown
  try {
    raw = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = PatchSchema.safeParse(raw)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid patch payload' }, { status: 400 })
  }

  const status = parsed.data.status !== undefined ? sanitizeString(parsed.data.status) : undefined
  const admin_notes =
    parsed.data.admin_notes !== undefined ? sanitizeLongText(parsed.data.admin_notes) || null : undefined
  const cancellation_reason =
    parsed.data.cancellation_reason !== undefined
      ? sanitizeLongText(parsed.data.cancellation_reason) || null
      : undefined

  const supabase = await createClient()
  const { data: appointment } = await supabase.from('appointments').select('*').eq('id', id).single()
  if (!appointment) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const updates: Record<string, unknown> = {}
  if (status !== undefined) updates.status = status
  if (admin_notes !== undefined) updates.admin_notes = admin_notes
  if (status === 'confirmed') updates.confirmed_at = new Date().toISOString()
  if (status === 'cancelled') {
    updates.cancelled_at = new Date().toISOString()
    if (cancellation_reason !== undefined) updates.cancellation_reason = cancellation_reason
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
  }

  const admin = createAdminClient()
  const { data: updated, error } = await admin.from('appointments').update(updates).eq('id', id).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  if (status === 'confirmed') {
    await sendBookingConfirmed({
      appointmentId: id,
      clientName: appointment.client_name,
      clientEmail: appointment.client_email,
      serviceName: appointment.service_title,
      date: appointment.appointment_date,
      time: appointment.appointment_time,
    })
  }

  if (status === 'cancelled') {
    await sendBookingCancelled({
      appointmentId: id,
      clientName: appointment.client_name,
      clientEmail: appointment.client_email,
      serviceName: appointment.service_title,
      date: appointment.appointment_date,
      reason: cancellation_reason ?? undefined,
    })
  }

  return NextResponse.json({ success: true, appointment: updated })
}
