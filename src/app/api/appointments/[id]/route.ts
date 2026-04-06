import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { assertAdminSession } from '@/lib/assert-admin'
import { NextRequest, NextResponse } from 'next/server'
import { sendBookingConfirmed, sendBookingCancelled } from '@/lib/email'
import { sanitizeLongText, sanitizeString, sanitizeUuid } from '@/lib/sanitize'

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

  const body = (await request.json()) as Record<string, unknown>
  const status = body.status !== undefined ? sanitizeString(body.status) : undefined
  const admin_notes = body.admin_notes !== undefined ? sanitizeLongText(body.admin_notes) || null : undefined
  const cancellation_reason =
    body.cancellation_reason !== undefined ? sanitizeLongText(body.cancellation_reason) || null : undefined

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
