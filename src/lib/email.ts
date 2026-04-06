import { createAdminClient } from '@/lib/supabase/admin'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

/** Optional: full From header, e.g. `360Living <info@360livinginstitute.com>` — overrides name/email below */
const FROM_RAW = process.env.RESEND_FROM?.trim()
const FROM_NAME = process.env.RESEND_FROM_NAME?.trim() || '360Living'
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL?.trim() || 'info@360livinginstitute.com'
export const RESEND_FROM_HEADER = FROM_RAW || `${FROM_NAME} <${FROM_EMAIL}>`
const FROM = RESEND_FROM_HEADER
export const ADMIN_NOTIFY_EMAIL = 'info@360livinginstitute.com'
const ADMIN_EMAIL = ADMIN_NOTIFY_EMAIL
export const SITE_URL_FOR_EMAIL = process.env.NEXT_PUBLIC_SITE_URL || 'https://360livinginstitute.com'
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
