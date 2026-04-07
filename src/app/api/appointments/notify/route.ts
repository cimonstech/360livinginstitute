import { NextRequest, NextResponse } from 'next/server'
import { assertAdminSession } from '@/lib/assert-admin'
import { sendBookingReceived, sendAdminNewBooking } from '@/lib/email'
import { sanitizeEmail, sanitizeLongText, sanitizePhone, sanitizeString, sanitizeUuid } from '@/lib/sanitize'
import { z } from 'zod'

const NotifySchema = z.object({
  type: z.string(),
  appointmentId: z.string().optional(),
  clientName: z.string().optional(),
  clientEmail: z.string().optional(),
  clientPhone: z.string().optional().nullable(),
  serviceName: z.string().optional(),
  date: z.string().optional(),
  time: z.string().optional(),
  notes: z.string().optional().nullable(),
})

export async function POST(request: NextRequest) {
  const auth = await assertAdminSession()
  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status })
  }

  try {
    let raw: unknown
    try {
      raw = await request.json()
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
    }

    const parsed = NotifySchema.safeParse(raw)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    const body = parsed.data
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

      if (!appointmentId || !clientName || !clientEmail || !serviceName || !date || !time) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
      }

      {
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
