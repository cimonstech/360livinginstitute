import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { RESEND_FROM_HEADER } from '@/lib/email'
import { validateOrigin } from '@/lib/csrf'
import { silentRejectSpam, stripPublicFormMeta } from '@/lib/public-form-guard'
import { sanitizeEmail, sanitizeLongText, sanitizePhone, sanitizeString } from '@/lib/sanitize'

const resend = new Resend(process.env.RESEND_API_KEY)

/** Inbox for all website contact form submissions */
const CONTACT_INBOX = process.env.CONTACT_FORM_EMAIL?.trim() || 'info@360livingfoundation.org'

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export async function POST(request: NextRequest) {
  if (!(await validateOrigin())) {
    return NextResponse.json({ error: 'Invalid request origin' }, { status: 403 })
  }

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: 'Email service is not configured.' }, { status: 503 })
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 })
  }

  const spam = silentRejectSpam(body)
  if (spam) return spam

  const cleaned = stripPublicFormMeta(body)

  const name = sanitizeString(cleaned.name)
  const email = sanitizeEmail(cleaned.email)
  const message = sanitizeLongText(cleaned.message)
  const phone = sanitizePhone(cleaned.phone)
  const organisation = sanitizeString(cleaned.organisation)
  const intent =
    typeof cleaned.intent === 'string' && cleaned.intent.trim()
      ? sanitizeString(cleaned.intent)
      : typeof cleaned.source === 'string' && cleaned.source === 'homepage'
        ? 'Homepage contact form'
        : 'General enquiry'
  const source = sanitizeString(cleaned.source) || 'contact'

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Name, email, and message are required.' }, { status: 400 })
  }

  if (!email) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
  }

  const safe = {
    name: escapeHtml(name),
    email: escapeHtml(email),
    phone: escapeHtml(phone),
    organisation: escapeHtml(organisation),
    message: escapeHtml(message).replace(/\n/g, '<br/>'),
    intent: escapeHtml(intent),
    source: escapeHtml(source),
  }

  try {
    await resend.emails.send({
      from: RESEND_FROM_HEADER,
      to: CONTACT_INBOX,
      replyTo: email,
      subject: `[360 Living] ${intent} — ${name}`,
      html: `
        <div style="font-family: DM Sans, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #3D3D3D;">
          <p style="margin: 0 0 8px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; color: #E8007D;">New website message</p>
          <p style="margin: 0 0 16px; font-size: 14px;"><strong>Source:</strong> ${safe.source}</p>
          <p style="margin: 0 0 8px; font-size: 14px;"><strong>Intent / topic:</strong> ${safe.intent}</p>
          <p style="margin: 0 0 8px; font-size: 14px;"><strong>Name:</strong> ${safe.name}</p>
          <p style="margin: 0 0 8px; font-size: 14px;"><strong>Email:</strong> <a href="mailto:${safe.email}">${safe.email}</a></p>
          ${phone ? `<p style="margin: 0 0 8px; font-size: 14px;"><strong>Phone:</strong> ${safe.phone}</p>` : ''}
          ${organisation ? `<p style="margin: 0 0 8px; font-size: 14px;"><strong>Organisation:</strong> ${safe.organisation}</p>` : ''}
          <div style="margin-top: 20px; padding: 16px; background: #F7F7F7; border-radius: 12px; border-left: 4px solid #E8007D;">
            <p style="margin: 0 0 8px; font-size: 12px; font-weight: 600; color: #6B6B6B;">Message</p>
            <p style="margin: 0; font-size: 14px; line-height: 1.6;">${safe.message}</p>
          </div>
        </div>
      `,
    })
  } catch (e) {
    console.error('[api/contact]', e)
    return NextResponse.json({ error: 'Failed to send message. Please try again or email us directly.' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
