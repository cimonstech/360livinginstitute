import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { sendAdminNewBooking, sendBookingReceived } from '@/lib/email'
import { NextRequest, NextResponse } from 'next/server'
import { validateOrigin } from '@/lib/csrf'
import { silentRejectSpam, stripPublicFormMeta } from '@/lib/public-form-guard'
import { sanitizeEmail, sanitizeLongText, sanitizePhone, sanitizeString, sanitizeUuid } from '@/lib/sanitize'

type Body = {
  client_name: string
  client_email: string
  client_phone?: string | null
  service_id: string
  service_title: string
  appointment_date: string
  appointment_time: string
  duration_minutes: number
  notes?: string | null
}

function validateBody(b: unknown): b is Body {
  if (!b || typeof b !== 'object') return false
  const o = b as Record<string, unknown>
  return (
    typeof o.client_name === 'string' &&
    o.client_name.trim().length > 0 &&
    typeof o.client_email === 'string' &&
    o.client_email.includes('@') &&
    typeof o.service_id === 'string' &&
    typeof o.service_title === 'string' &&
    typeof o.appointment_date === 'string' &&
    typeof o.appointment_time === 'string' &&
    typeof o.duration_minutes === 'number' &&
    o.duration_minutes > 0
  )
}

export async function POST(request: NextRequest) {
  try {
    if (!(await validateOrigin())) {
      return NextResponse.json({ error: 'Invalid request origin' }, { status: 403 })
    }

    const json = (await request.json()) as Record<string, unknown>
    const spam = silentRejectSpam(json)
    if (spam) return spam

    const stripped = stripPublicFormMeta(json)
    if (!validateBody(stripped)) {
      return NextResponse.json({ error: 'Invalid booking payload' }, { status: 400 })
    }

    const serviceId = sanitizeUuid(stripped.service_id)
    if (!serviceId) {
      return NextResponse.json({ error: 'Invalid service' }, { status: 400 })
    }

    const clientName = sanitizeString(stripped.client_name)
    const clientEmail = sanitizeEmail(stripped.client_email)
    const clientPhone = sanitizePhone(stripped.client_phone ?? '')
    const notes = sanitizeLongText(stripped.notes ?? '')
    const serviceTitle = sanitizeString(stripped.service_title)
    const appointmentDate = stripped.appointment_date.trim().slice(0, 32)
    const appointmentTime = stripped.appointment_time.trim().slice(0, 16)

    if (!clientName || !clientEmail) {
      return NextResponse.json({ error: 'Name and valid email are required' }, { status: 400 })
    }

    const body: Body = {
      client_name: clientName,
      client_email: clientEmail,
      client_phone: clientPhone || null,
      service_id: serviceId,
      service_title: serviceTitle,
      appointment_date: appointmentDate,
      appointment_time: appointmentTime,
      duration_minutes: stripped.duration_minutes,
      notes: notes || null,
    }

    const cookieSupabase = await createClient()
    const {
      data: { user },
    } = await cookieSupabase.auth.getUser()

    const client_id = user?.id ?? null
    const is_guest = !client_id

    const admin = createAdminClient()
    const { data: appointment, error: insertError } = await admin
      .from('appointments')
      .insert({
        client_id,
        client_name: body.client_name,
        client_email: body.client_email,
        client_phone: body.client_phone,
        service_id: body.service_id,
        service_title: body.service_title,
        appointment_date: body.appointment_date,
        appointment_time: body.appointment_time,
        duration_minutes: body.duration_minutes,
        notes: body.notes,
        is_guest,
        status: 'pending',
      })
      .select()
      .single()

    if (insertError) {
      console.error('[api/appointments/create] insert', insertError)
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    try {
      await sendBookingReceived({
        appointmentId: appointment.id,
        clientName: body.client_name,
        clientEmail: body.client_email,
        serviceName: body.service_title,
        date: body.appointment_date,
        time: body.appointment_time,
      })
      await sendAdminNewBooking({
        appointmentId: appointment.id,
        clientName: body.client_name,
        clientEmail: body.client_email,
        clientPhone: body.client_phone ?? undefined,
        serviceName: body.service_title,
        date: body.appointment_date,
        time: body.appointment_time,
        notes: body.notes ?? undefined,
      })
    } catch (emailErr) {
      console.error('[api/appointments/create] email', emailErr)
    }

    return NextResponse.json({
      success: true,
      appointment,
      linkedToUser: Boolean(user),
    })
  } catch (e) {
    console.error('[api/appointments/create]', e)
    return NextResponse.json({ error: 'Booking failed' }, { status: 500 })
  }
}
