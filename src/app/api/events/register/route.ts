import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Resend } from 'resend'
import { createAdminClient } from '@/lib/supabase/admin'
import { ADMIN_NOTIFY_EMAIL, RESEND_FROM_HEADER, SITE_URL_FOR_EMAIL } from '@/lib/email'
import { validateOrigin } from '@/lib/csrf'
import { silentRejectSpam, stripPublicFormMeta } from '@/lib/public-form-guard'
import { sanitizeEmail, sanitizeLongText, sanitizePhone, sanitizeString, sanitizeUuid } from '@/lib/sanitize'

const resend = new Resend(process.env.RESEND_API_KEY)

async function getServerUser() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          } catch {
            /* Server Component / Route may not allow cookie set */
          }
        },
      },
    }
  )
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

export async function POST(request: NextRequest) {
  if (!(await validateOrigin())) {
    return NextResponse.json({ error: 'Invalid request origin' }, { status: 403 })
  }

  const admin = createAdminClient()
  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 })
  }

  const spam = silentRejectSpam(body)
  if (spam) return spam

  const cleaned = stripPublicFormMeta(body)

  const event_id = sanitizeUuid(cleaned.event_id)
  const full_name_raw = sanitizeString(cleaned.full_name)
  const email_raw = sanitizeEmail(cleaned.email)
  const phone = sanitizePhone(cleaned.phone) || null
  const organisation = sanitizeString(cleaned.organisation) || null
  const notes = sanitizeLongText(cleaned.notes) || null

  if (!event_id || !full_name_raw || !email_raw) {
    return NextResponse.json({ error: 'Event, name, and email are required.' }, { status: 400 })
  }

  const sessionUser = await getServerUser()
  let user_id: string | null = null
  let is_guest = true
  let full_name = full_name_raw
  let email = email_raw

  if (sessionUser) {
    const { data: profile } = await admin.from('profiles').select('id, full_name, email').eq('id', sessionUser.id).single()
    if (profile) {
      user_id = profile.id
      is_guest = false
      full_name = profile.full_name?.trim() ? sanitizeString(profile.full_name) : full_name_raw
      email = sanitizeEmail(profile.email) || email_raw
    }
  }

  const { data: existing } = await admin
    .from('event_registrations')
    .select('id')
    .eq('event_id', event_id)
    .eq('email', email)
    .maybeSingle()

  if (existing) {
    return NextResponse.json({ error: 'You are already registered for this event.' }, { status: 409 })
  }

  const { data: event, error: eventErr } = await admin.from('events').select('*').eq('id', event_id).single()

  if (eventErr || !event) {
    return NextResponse.json({ error: 'Event not found.' }, { status: 404 })
  }

  const { data: registration, error } = await admin
    .from('event_registrations')
    .insert({
      event_id,
      user_id,
      full_name,
      email,
      phone,
      organisation,
      notes,
      is_guest,
      status: 'registered',
    })
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'You are already registered for this event.' }, { status: 409 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const eventDateStr = new Date(event.event_date).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  try {
    await resend.emails.send({
      from: RESEND_FROM_HEADER,
      to: email,
      subject: `Registration Confirmed — ${event.title}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #3D3D3D;">
          <h1 style="font-size: 22px; font-weight: 400; color: #E8007D; margin: 0 0 24px;">360 Living Institute</h1>
          <div style="background: #EEF7F0; border-radius: 12px; padding: 16px 20px; margin-bottom: 24px;">
            <p style="margin: 0; font-weight: 500; color: #2D7A3A;">You're registered, ${full_name}!</p>
          </div>
          <p style="font-size: 14px; color: #6B6B6B; margin-bottom: 20px;">
            Your registration for <strong>${event.title}</strong> has been confirmed.
          </p>
          <div style="background: #FDF0F7; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
            <p style="margin: 0 0 8px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; color: #E8007D; font-weight: 500;">Event Details</p>
            <p style="margin: 4px 0; font-size: 14px;"><strong>Event:</strong> ${event.title}</p>
            <p style="margin: 4px 0; font-size: 14px;"><strong>Date:</strong> ${eventDateStr}</p>
            ${event.event_time ? `<p style="margin: 4px 0; font-size: 14px;"><strong>Time:</strong> ${event.event_time}</p>` : ''}
            <p style="margin: 4px 0; font-size: 14px;"><strong>Location:</strong> ${event.location}</p>
          </div>
          <p style="font-size: 13px; color: #6B6B6B; line-height: 1.7;">
            We will send you more details closer to the date. If you have any questions, contact us at
            <a href="mailto:info@360livinginstitute.com" style="color: #E8007D;">info@360livinginstitute.com</a>.
          </p>
          <hr style="border: none; border-top: 1px solid #F5A0CE; margin: 32px 0;">
          <p style="font-size: 11px; color: #aaa; text-align: center;">31 Awudome Roundabout, Awudome, Accra · 0538045503</p>
        </div>
      `,
    })
  } catch (emailError) {
    console.error('Failed to send registration email:', emailError)
  }

  try {
    await resend.emails.send({
      from: RESEND_FROM_HEADER,
      to: ADMIN_NOTIFY_EMAIL,
      subject: `New Event Registration — ${event.title}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <h2 style="color: #E8007D;">New Event Registration</h2>
          <p><strong>Event:</strong> ${event.title}</p>
          <p><strong>Name:</strong> ${full_name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
          <p><strong>Organisation:</strong> ${organisation || 'Not provided'}</p>
          <a href="${SITE_URL_FOR_EMAIL}/admin/events/registrations/${event_id}"
             style="display: inline-block; background: #E8007D; color: white; padding: 12px 24px; border-radius: 100px; text-decoration: none; font-size: 14px; margin-top: 16px;">
            View Registrations →
          </a>
        </div>
      `,
    })
  } catch (e) {
    console.error('Admin notification failed:', e)
  }

  return NextResponse.json({ success: true, registration })
}
