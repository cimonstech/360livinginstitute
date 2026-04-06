import { NextRequest, NextResponse } from 'next/server'
import { assertAdminSession } from '@/lib/assert-admin'
import { sendBookingReceived, sendAdminNewBooking } from '@/lib/email'
import { sanitizeEmail, sanitizeLongText, sanitizePhone, sanitizeString, sanitizeUuid } from '@/lib/sanitize'

export async function POST(request: NextRequest) {
  const auth = await assertAdminSession()
  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status })
  }

  try {
    const body = (await request.json()) as Record<string, unknown>
    const type = sanitizeString(body.type)
    if (type === 'new_booking') {
      const appointmentId = sanitizeUuid(body.appointmentId)
      const clientName = sanitizeString(body.clientName)
      const clientEmail = sanitizeEmail(body.clientEmail)
      const clientPhone = sanitizePhone(body.clientPhone)
      const serviceName = sanitizeString(body.serviceName)
      const date = sanitizeString(body.date)
      const time = sanitizeString(body.time)
      const notes = body.notes != null ? sanitizeLongText(body.notes) : undefined

      if (appointmentId && clientName && clientEmail && serviceName && date && time) {
        await sendBookingReceived({
          appointmentId,
          clientName,
          clientEmail,
          serviceName,
          date,
          time,
        })
        await sendAdminNewBooking({
          appointmentId,
          clientName,
          clientEmail,
          clientPhone: clientPhone || undefined,
          serviceName,
          date,
          time,
          notes,
        })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Email notification error:', error)
    return NextResponse.json({ error: 'Failed to send notifications' }, { status: 500 })
  }
}
