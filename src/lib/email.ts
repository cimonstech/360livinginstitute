import { createAdminClient } from '@/lib/supabase/admin'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

/** Optional: full From header, e.g. `360Living <info@360livinginstitute.com>` — overrides name/email below */
const FROM_RAW = process.env.RESEND_FROM?.trim()
const FROM_NAME = process.env.RESEND_FROM_NAME?.trim() || '360Living'
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL?.trim() || 'info@360livingfoundation.org'
export const RESEND_FROM_HEADER = FROM_RAW || `${FROM_NAME} <${FROM_EMAIL}>`
const FROM = RESEND_FROM_HEADER
export const ADMIN_NOTIFY_EMAIL = 'info@360livingfoundation.org'
const ADMIN_EMAIL = ADMIN_NOTIFY_EMAIL
export const SITE_URL_FOR_EMAIL = process.env.NEXT_PUBLIC_SITE_URL || 'https://360livingfoundation.org'
const SITE_URL = SITE_URL_FOR_EMAIL

async function logEmail({
  appointmentId,
  recipientEmail,
  emailType,
  subject,
  resendId,
  status,
}: {
  appointmentId?: string
  recipientEmail: string
  emailType: string
  subject: string
  resendId?: string
  status: 'sent' | 'failed'
}) {
  try {
    const supabase = createAdminClient()
    await supabase.from('email_logs').insert({
      appointment_id: appointmentId,
      recipient_email: recipientEmail,
      email_type: emailType,
      subject,
      resend_id: resendId,
      status,
    })
  } catch {
    // Avoid breaking sends when logging fails (RLS, missing table, etc.)
  }
}

export async function sendBookingReceived({
  appointmentId,
  clientName,
  clientEmail,
  serviceName,
  date,
  time,
}: {
  appointmentId: string
  clientName: string
  clientEmail: string
  serviceName: string
  date: string
  time: string
}) {
  const subject = `Booking Received — ${serviceName}`
  try {
    const { data } = await resend.emails.send({
      from: FROM,
      to: clientEmail,
      subject,
      html: `
        <div style="font-family: DM Sans, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #3D3D3D;">
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="font-size: 24px; font-weight: 400; color: #E8007D; margin: 0;">360 Living Institute</h1>
            <p style="font-size: 12px; color: #6B6B6B; margin-top: 4px;">Transforming Lives Through Psychological Insight</p>
          </div>
          <h2 style="font-size: 20px; font-weight: 500; margin-bottom: 8px;">Booking Received, ${clientName}!</h2>
          <p style="font-size: 14px; color: #6B6B6B; line-height: 1.7; margin-bottom: 24px;">
            Thank you for reaching out. We have received your booking request and will confirm it within 24 hours.
          </p>
          <div style="background: #FDF0F7; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
            <p style="margin: 0 0 8px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; color: #E8007D; font-weight: 500;">Booking Details</p>
            <p style="margin: 4px 0; font-size: 14px;"><strong>Service:</strong> ${serviceName}</p>
            <p style="margin: 4px 0; font-size: 14px;"><strong>Date:</strong> ${date}</p>
            <p style="margin: 4px 0; font-size: 14px;"><strong>Time:</strong> ${time}</p>
            <p style="margin: 4px 0; font-size: 14px;"><strong>Status:</strong> <span style="color: #D97706; font-weight: 500;">Pending Confirmation</span></p>
          </div>
          <p style="font-size: 13px; color: #6B6B6B; line-height: 1.7;">
            You will receive a confirmation email once your booking is approved. If you have any questions, contact us at <a href="mailto:info@360livinginstitute.com" style="color: #E8007D;">info@360livinginstitute.com</a> or call 0538045503.
          </p>
          <hr style="border: none; border-top: 1px solid #F5A0CE; margin: 32px 0;">
          <p style="font-size: 11px; color: #aaa; text-align: center;">31 Awudome Roundabout, Awudome, Accra · 0538045503</p>
        </div>
      `,
    })
    await logEmail({ appointmentId, recipientEmail: clientEmail, emailType: 'booking_received', subject, resendId: data?.id, status: 'sent' })
  } catch {
    await logEmail({ appointmentId, recipientEmail: clientEmail, emailType: 'booking_received', subject, status: 'failed' })
  }
}

export async function sendAdminNewBooking({
  appointmentId,
  clientName,
  clientEmail,
  clientPhone,
  serviceName,
  date,
  time,
  notes,
}: {
  appointmentId: string
  clientName: string
  clientEmail: string
  clientPhone?: string
  serviceName: string
  date: string
  time: string
  notes?: string
}) {
  const subject = `New Booking Request — ${clientName}`
  const adminUrl = `${SITE_URL}/admin/appointments/${appointmentId}`
  try {
    const { data } = await resend.emails.send({
      from: FROM,
      to: ADMIN_EMAIL,
      subject,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #3D3D3D;">
          <h2 style="font-size: 20px; font-weight: 500; margin-bottom: 16px; color: #E8007D;">New Booking Request</h2>
          <div style="background: #F5F5F5; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
            <p style="margin: 4px 0; font-size: 14px;"><strong>Client:</strong> ${clientName}</p>
            <p style="margin: 4px 0; font-size: 14px;"><strong>Email:</strong> ${clientEmail}</p>
            <p style="margin: 4px 0; font-size: 14px;"><strong>Phone:</strong> ${clientPhone || 'Not provided'}</p>
            <p style="margin: 4px 0; font-size: 14px;"><strong>Service:</strong> ${serviceName}</p>
            <p style="margin: 4px 0; font-size: 14px;"><strong>Date:</strong> ${date}</p>
            <p style="margin: 4px 0; font-size: 14px;"><strong>Time:</strong> ${time}</p>
            ${notes ? `<p style="margin: 4px 0; font-size: 14px;"><strong>Notes:</strong> ${notes}</p>` : ''}
          </div>
          <a href="${adminUrl}" style="display: inline-block; background: #E8007D; color: white; padding: 12px 24px; border-radius: 100px; text-decoration: none; font-size: 14px; font-weight: 500;">Review Booking →</a>
        </div>
      `,
    })
    await logEmail({ appointmentId, recipientEmail: ADMIN_EMAIL, emailType: 'booking_received', subject, resendId: data?.id, status: 'sent' })
  } catch {
    await logEmail({ appointmentId, recipientEmail: ADMIN_EMAIL, emailType: 'booking_received', subject, status: 'failed' })
  }
}

export async function sendBookingConfirmed({
  appointmentId,
  clientName,
  clientEmail,
  serviceName,
  date,
  time,
}: {
  appointmentId: string
  clientName: string
  clientEmail: string
  serviceName: string
  date: string
  time: string
}) {
  const subject = `Booking Confirmed — ${serviceName} on ${date}`
  try {
    const { data } = await resend.emails.send({
      from: FROM,
      to: clientEmail,
      subject,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #3D3D3D;">
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="font-size: 24px; font-weight: 400; color: #E8007D; margin: 0;">360 Living Institute</h1>
          </div>
          <div style="background: #EEF7F0; border-radius: 12px; padding: 16px 20px; margin-bottom: 24px; display: flex; align-items: center; gap: 12px;">
            <span style="font-size: 24px;">✓</span>
            <div>
              <p style="margin: 0; font-weight: 500; font-size: 15px; color: #2D7A3A;">Your session is confirmed!</p>
              <p style="margin: 0; font-size: 13px; color: #6B6B6B;">We look forward to seeing you, ${clientName}.</p>
            </div>
          </div>
          <div style="background: #FDF0F7; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
            <p style="margin: 0 0 8px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; color: #E8007D; font-weight: 500;">Session Details</p>
            <p style="margin: 4px 0; font-size: 14px;"><strong>Service:</strong> ${serviceName}</p>
            <p style="margin: 4px 0; font-size: 14px;"><strong>Date:</strong> ${date}</p>
            <p style="margin: 4px 0; font-size: 14px;"><strong>Time:</strong> ${time}</p>
            <p style="margin: 4px 0; font-size: 14px;"><strong>Location:</strong> 31 Awudome Roundabout, Awudome, Accra</p>
          </div>
          <p style="font-size: 13px; color: #6B6B6B; line-height: 1.7;">
            Please arrive 5–10 minutes early. If you need to reschedule or cancel, contact us at least 24 hours in advance at <a href="mailto:info@360livinginstitute.com" style="color: #E8007D;">info@360livinginstitute.com</a>.
          </p>
          <hr style="border: none; border-top: 1px solid #F5A0CE; margin: 32px 0;">
          <p style="font-size: 11px; color: #aaa; text-align: center;">31 Awudome Roundabout, Awudome, Accra · 0538045503</p>
        </div>
      `,
    })
    await logEmail({ appointmentId, recipientEmail: clientEmail, emailType: 'booking_confirmed', subject, resendId: data?.id, status: 'sent' })
  } catch {
    await logEmail({ appointmentId, recipientEmail: clientEmail, emailType: 'booking_confirmed', subject, status: 'failed' })
  }
}

export async function sendBookingCancelled({
  appointmentId,
  clientName,
  clientEmail,
  serviceName,
  date,
  reason,
}: {
  appointmentId: string
  clientName: string
  clientEmail: string
  serviceName: string
  date: string
  reason?: string
}) {
  const subject = `Booking Cancelled — ${serviceName}`
  try {
    const { data } = await resend.emails.send({
      from: FROM,
      to: clientEmail,
      subject,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #3D3D3D;">
          <h1 style="font-size: 24px; font-weight: 400; color: #E8007D; margin: 0 0 24px;">360 Living Institute</h1>
          <h2 style="font-size: 18px; font-weight: 500;">Your booking has been cancelled</h2>
          <p style="font-size: 14px; color: #6B6B6B; margin: 8px 0 24px;">Hi ${clientName}, your booking for <strong>${serviceName}</strong> on <strong>${date}</strong> has been cancelled.</p>
          ${reason ? `<div style="background: #F5F5F5; border-radius: 12px; padding: 16px 20px; margin-bottom: 24px;"><p style="margin: 0; font-size: 13px; color: #6B6B6B;"><strong>Reason:</strong> ${reason}</p></div>` : ''}
          <p style="font-size: 13px; color: #6B6B6B; line-height: 1.7;">To rebook or if you have questions, please contact us at <a href="mailto:info@360livinginstitute.com" style="color: #E8007D;">info@360livinginstitute.com</a> or call 0538045503.</p>
          <hr style="border: none; border-top: 1px solid #F5A0CE; margin: 32px 0;">
          <p style="font-size: 11px; color: #aaa; text-align: center;">31 Awudome Roundabout, Awudome, Accra</p>
        </div>
      `,
    })
    await logEmail({ appointmentId, recipientEmail: clientEmail, emailType: 'booking_cancelled', subject, resendId: data?.id, status: 'sent' })
  } catch {
    await logEmail({ appointmentId, recipientEmail: clientEmail, emailType: 'booking_cancelled', subject, status: 'failed' })
  }
}

export async function sendBookingReminder({
  appointmentId,
  clientName,
  clientEmail,
  serviceName,
  date,
  time,
}: {
  appointmentId: string
  clientName: string
  clientEmail: string
  serviceName: string
  date: string
  time: string
}) {
  const subject = `Reminder: Your session tomorrow — ${serviceName}`
  try {
    const { data } = await resend.emails.send({
      from: FROM,
      to: clientEmail,
      subject,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #3D3D3D;">
          <h1 style="font-size: 24px; font-weight: 400; color: #E8007D; margin: 0 0 24px;">360 Living Institute</h1>
          <h2 style="font-size: 18px; font-weight: 500;">Your session is tomorrow, ${clientName}</h2>
          <div style="background: #FDF0F7; border-radius: 12px; padding: 20px; margin: 20px 0;">
            <p style="margin: 4px 0; font-size: 14px;"><strong>Service:</strong> ${serviceName}</p>
            <p style="margin: 4px 0; font-size: 14px;"><strong>Date:</strong> ${date}</p>
            <p style="margin: 4px 0; font-size: 14px;"><strong>Time:</strong> ${time}</p>
            <p style="margin: 4px 0; font-size: 14px;"><strong>Location:</strong> 31 Awudome Roundabout, Awudome, Accra</p>
          </div>
          <p style="font-size: 13px; color: #6B6B6B;">Please arrive 5–10 minutes early. See you tomorrow!</p>
          <hr style="border: none; border-top: 1px solid #F5A0CE; margin: 32px 0;">
          <p style="font-size: 11px; color: #aaa; text-align: center;">31 Awudome Roundabout, Awudome, Accra · 0538045503</p>
        </div>
      `,
    })
    await logEmail({ appointmentId, recipientEmail: clientEmail, emailType: 'booking_reminder', subject, resendId: data?.id, status: 'sent' })
  } catch {
    await logEmail({ appointmentId, recipientEmail: clientEmail, emailType: 'booking_reminder', subject, status: 'failed' })
  }
}

const FOUNDATION_ADMIN_EMAIL =
  process.env.FOUNDATION_EMAIL?.trim() ||
  process.env.FOUNDATION_ADMIN_NOTIFY_EMAIL?.trim() ||
  process.env.ADMIN_NOTIFY_EMAIL?.trim() ||
  'info@360livingfoundation.org'

const FOUNDATION_FROM_EMAIL = 'info@360livinginstitute.com'
const FOUNDATION_FROM_NAME = process.env.FOUNDATION_FROM_NAME?.trim() || '360L-foundation'
const FOUNDATION_FROM_HEADER = `${FOUNDATION_FROM_NAME} <${FOUNDATION_FROM_EMAIL}>`

async function sendFoundationEmail({
  to,
  subject,
  html,
}: {
  to: string | string[]
  subject: string
  html: string
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: FOUNDATION_FROM_HEADER,
      to,
      subject,
      html,
    })
    if (error) {
      console.error('[Foundation Email] Resend API error:', error)
      throw new Error(typeof error === 'object' && error && 'message' in error ? String(error.message) : 'Unknown Resend error')
    }
    console.log('[Foundation Email] Sent to:', to, 'ID:', data?.id)
    return data?.id
  } catch (err) {
    console.error('[Foundation Email] Failed:', err)
    return undefined
  }
}

const foundationFooter = `
  <hr style="border:none;border-top:1px solid #F5A0CE;margin:32px 0;">
  <div style="text-align:center;">
    <p style="font-size:12px;color:#E8007D;font-weight:500;margin:0;">360 Living Foundation</p>
    <p style="font-size:11px;color:#aaa;margin:4px 0;">Accra, Ghana · 0264589293</p>
    <p style="font-size:11px;color:#aaa;margin:0;">info@360livingfoundation.org · 360livingfoundation.org</p>
  </div>
`

const foundationBrandHeader = `
  <div style="text-align:center;margin-bottom:32px;padding:20px 0;border-bottom:2px solid #F5A0CE;">
    <h1 style="font-size:22px;font-weight:400;color:#E8007D;margin:0;">360 Living Foundation</h1>
    <p style="font-size:12px;color:#2D7A3A;margin-top:4px;font-weight:500;">Heal, Grow and Rise!</p>
    <p style="font-size:11px;color:#6B6B6B;margin-top:2px;">The social impact arm of 360 Living Institute</p>
  </div>
`

export async function sendApplicationReceived({
  name,
  email,
  programTitle,
}: {
  name: string
  email: string
  programTitle: string
}) {
  const clientSubject = `Application Received — ${programTitle}`
  const clientHtml = `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:40px 20px;color:#3D3D3D;">
        ${foundationBrandHeader}
        <div style="background:#EEF7F0;border-radius:12px;padding:16px 20px;margin-bottom:24px;">
          <p style="margin:0;font-weight:500;color:#2D7A3A;">Application received, ${name}!</p>
        </div>
        <p style="font-size:14px;color:#6B6B6B;line-height:1.7;margin-bottom:20px;">
          Thank you for applying for <strong>${programTitle}</strong>. We have received your application and will be in touch within 1-2 days.
        </p>
        <div style="background:#FDF0F7;border-radius:12px;padding:20px;margin-bottom:24px;">
          <p style="margin:0 0 8px;font-size:12px;text-transform:uppercase;letter-spacing:0.1em;color:#E8007D;font-weight:500;">What happens next?</p>
          <p style="margin:4px 0;font-size:14px;">1. Our team reviews your application</p>
          <p style="margin:4px 0;font-size:14px;">2. We reach out to discuss the programme</p>
          <p style="margin:4px 0;font-size:14px;">3. You receive your onboarding details</p>
        </div>
        <p style="font-size:13px;color:#6B6B6B;line-height:1.7;">
          Questions? Email us at <a href="mailto:info@360livingfoundation.org" style="color:#E8007D;">info@360livingfoundation.org</a> or call 0264589293.
        </p>
        ${foundationFooter}
      </div>
    `
  console.log('[Foundation Email] Sending to client:', email, clientSubject)
  try {
    const result = await sendFoundationEmail({ to: email, subject: clientSubject, html: clientHtml })
    console.log('[Foundation Email] Result:', result)
    console.log('[Foundation Email] Client email sent:', result)
  } catch (err) {
    console.error('[Foundation Email] Client email FAILED:', err)
  }

  await sendFoundationEmail({
    to: FOUNDATION_ADMIN_EMAIL,
    subject: `New Program Application — ${name} (${programTitle})`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:40px 20px;">
        <h2 style="color:#E8007D;">New Programme Application</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Programme:</strong> ${programTitle}</p>
        <a href="${SITE_URL_FOR_EMAIL}/admin/foundation/applications"
           style="display:inline-block;background:#E8007D;color:white;padding:12px 24px;border-radius:100px;text-decoration:none;font-size:14px;margin-top:16px;">
          View Application →
        </a>
      </div>
    `,
  })
}

export async function sendPartnerRequestReceived({
  contactName,
  email,
  orgName,
}: {
  contactName: string
  email: string
  orgName: string
}) {
  const clientSubject = 'Partnership Enquiry Received — 360 Living Foundation'
  const clientHtml = `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:40px 20px;color:#3D3D3D;">
        ${foundationBrandHeader}
        <h2 style="font-size:18px;font-weight:500;">Thank you, ${contactName}!</h2>
        <p style="font-size:14px;color:#6B6B6B;line-height:1.7;margin:12px 0 24px;">
          We have received your partnership enquiry from <strong>${orgName}</strong> and will be in touch within 1–2 business days to explore how we can work together.
        </p>
        <p style="font-size:13px;color:#6B6B6B;">
          Questions? Reach us at <a href="mailto:info@360livingfoundation.org" style="color:#E8007D;">info@360livingfoundation.org</a>.
        </p>
        ${foundationFooter}
      </div>
    `
  console.log('[Foundation Email] Sending to client:', email, clientSubject)
  try {
    const result = await sendFoundationEmail({ to: email, subject: clientSubject, html: clientHtml })
    console.log('[Foundation Email] Result:', result)
    console.log('[Foundation Email] Client email sent:', result)
  } catch (err) {
    console.error('[Foundation Email] Client email FAILED:', err)
  }

  await sendFoundationEmail({
    to: FOUNDATION_ADMIN_EMAIL,
    subject: `New Partner Request — ${orgName}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:40px 20px;">
        <h2 style="color:#E8007D;">New Partnership Request</h2>
        <p><strong>Organisation:</strong> ${orgName}</p>
        <p><strong>Contact:</strong> ${contactName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <a href="${SITE_URL_FOR_EMAIL}/admin/foundation/partners"
           style="display:inline-block;background:#E8007D;color:white;padding:12px 24px;border-radius:100px;text-decoration:none;font-size:14px;margin-top:16px;">
          View Request →
        </a>
      </div>
    `,
  })
}

export async function sendVolunteerSignupReceived({
  name,
  email,
}: {
  name: string
  email: string
}) {
  const clientSubject = 'Volunteer Signup Received — 360 Living Foundation'
  const clientHtml = `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:40px 20px;color:#3D3D3D;">
        ${foundationBrandHeader}
        <h2 style="font-size:18px;font-weight:500;">Welcome to the movement, ${name}!</h2>
        <p style="font-size:14px;color:#6B6B6B;line-height:1.7;margin:12px 0 24px;">
          Thank you for signing up to volunteer with 360 Living Foundation. We are excited to have you join us. Our team will be in touch with next steps and opportunities to get involved.
        </p>
        ${foundationFooter}
      </div>
    `
  console.log('[Foundation Email] Sending to client:', email, clientSubject)
  try {
    const result = await sendFoundationEmail({ to: email, subject: clientSubject, html: clientHtml })
    console.log('[Foundation Email] Result:', result)
    console.log('[Foundation Email] Client email sent:', result)
  } catch (err) {
    console.error('[Foundation Email] Client email FAILED:', err)
  }

  await sendFoundationEmail({
    to: FOUNDATION_ADMIN_EMAIL,
    subject: `New Volunteer Signup — ${name}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:40px 20px;">
        <h2 style="color:#2D7A3A;">New Volunteer Signup</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <a href="${SITE_URL_FOR_EMAIL}/admin/foundation/volunteers"
           style="display:inline-block;background:#2D7A3A;color:white;padding:12px 24px;border-radius:100px;text-decoration:none;font-size:14px;margin-top:16px;">
          View Volunteers →
        </a>
      </div>
    `,
  })
}

export async function sendSponsorInquiryReceived({
  name,
  email,
  type,
}: {
  name: string
  email: string
  type: 'sponsor' | 'donate'
}) {
  const label = type === 'sponsor' ? 'sponsorship' : 'donation'
  const clientSubject = `${type === 'sponsor' ? 'Sponsorship' : 'Donation'} Enquiry Received — 360 Living Foundation`
  const clientHtml = `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:40px 20px;color:#3D3D3D;">
        ${foundationBrandHeader}
        <h2 style="font-size:18px;font-weight:500;">Thank you, ${name}!</h2>
        <p style="font-size:14px;color:#6B6B6B;line-height:1.7;margin:12px 0 24px;">
          We have received your ${label} enquiry and are truly grateful for your support. Our team will reach out within 1–2 business days with details on how to proceed.
        </p>
        ${foundationFooter}
      </div>
    `
  console.log('[Foundation Email] Sending to client:', email, clientSubject)
  try {
    const result = await sendFoundationEmail({ to: email, subject: clientSubject, html: clientHtml })
    console.log('[Foundation Email] Result:', result)
    console.log('[Foundation Email] Client email sent:', result)
  } catch (err) {
    console.error('[Foundation Email] Client email FAILED:', err)
  }

  await sendFoundationEmail({
    to: FOUNDATION_ADMIN_EMAIL,
    subject: `New ${type === 'sponsor' ? 'Sponsor' : 'Donor'} Inquiry — ${name}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:40px 20px;">
        <h2 style="color:#E8007D;">New ${type === 'sponsor' ? 'Sponsorship' : 'Donation'} Inquiry</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Type:</strong> ${type}</p>
        <a href="${SITE_URL_FOR_EMAIL}/admin/foundation/sponsors"
           style="display:inline-block;background:#E8007D;color:white;padding:12px 24px;border-radius:100px;text-decoration:none;font-size:14px;margin-top:16px;">
          View Inquiry →
        </a>
      </div>
    `,
  })
}
