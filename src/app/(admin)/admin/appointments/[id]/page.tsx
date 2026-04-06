import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Appointment, AppointmentStatus, EmailLog, Profile } from '@/types'
import AppointmentQuickActions from '@/components/admin/AppointmentQuickActions'
import AppointmentAdminNotes from '@/components/admin/AppointmentAdminNotes'
import { format, parseISO } from 'date-fns'

function time12(t: string) {
  const [h, m] = t.split(':').map(Number)
  const d = new Date(2000, 0, 1, h, m || 0)
  return format(d, 'h:mm a')
}

function statusPill(status: AppointmentStatus) {
  const base = 'text-xs font-medium px-2 py-0.5 rounded-full capitalize font-dm inline-block'
  switch (status) {
    case 'pending':
      return `${base} bg-amber-50 text-amber-700 border border-amber-200`
    case 'confirmed':
      return `${base} bg-brand-green-pale text-brand-green border border-brand-green-light`
    case 'cancelled':
      return `${base} bg-red-50 text-red-600 border border-red-200`
    default:
      return `${base} bg-charcoal-light text-charcoal-muted border border-gray-200`
  }
}

function initials(name: string) {
  const p = name.trim().split(/\s+/)
  return ((p[0]?.[0] ?? '') + (p[1]?.[0] ?? '')).toUpperCase() || '?'
}

type PageProps = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  return { title: `Appointment ${id.slice(0, 8)}… | Admin` }
}

export default async function AppointmentDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: appointment, error } = await supabase.from('appointments').select('*').eq('id', id).single()
  if (error || !appointment) notFound()

  const appt = appointment as Appointment

  const [{ data: logs }, { data: clientProfile }] = await Promise.all([
    supabase.from('email_logs').select('*').eq('appointment_id', id).order('created_at', { ascending: false }),
    appt.client_id
      ? supabase.from('profiles').select('*').eq('id', appt.client_id).single()
      : Promise.resolve({ data: null }),
  ])

  const profile = clientProfile as Profile | null
  const emailLogs = (logs as EmailLog[]) ?? []
  const date = parseISO(appt.appointment_date + 'T12:00:00')

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 flex flex-col gap-4">
        <Link href="/admin/appointments" className="text-sm text-brand-pink font-dm hover:underline w-fit">
          ← Back to Appointments
        </Link>

        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
            <h1 className="font-lora text-xl text-charcoal">{appt.service_title}</h1>
            <span className={statusPill(appt.status)}>{appt.status.replace('_', ' ')}</span>
          </div>

          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-dm">
            <div>
              <dt className="text-xs text-charcoal-muted">Date</dt>
              <dd className="text-charcoal font-medium">{format(date, 'EEEE, d MMMM yyyy')}</dd>
            </div>
            <div>
              <dt className="text-xs text-charcoal-muted">Time</dt>
              <dd className="text-charcoal font-medium">{time12(appt.appointment_time)}</dd>
            </div>
            <div>
              <dt className="text-xs text-charcoal-muted">Duration</dt>
              <dd className="text-charcoal font-medium">{appt.duration_minutes} minutes</dd>
            </div>
            <div>
              <dt className="text-xs text-charcoal-muted">Booked on</dt>
              <dd className="text-charcoal font-medium">{format(parseISO(appt.created_at), 'd MMM yyyy, h:mm a')}</dd>
            </div>
            <div>
              <dt className="text-xs text-charcoal-muted">Client name</dt>
              <dd className="text-charcoal font-medium">{appt.client_name}</dd>
            </div>
            <div>
              <dt className="text-xs text-charcoal-muted">Email</dt>
              <dd className="text-charcoal font-medium break-all">{appt.client_email}</dd>
            </div>
            <div>
              <dt className="text-xs text-charcoal-muted">Phone</dt>
              <dd className="text-charcoal font-medium">{appt.client_phone || '—'}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs text-charcoal-muted">Client notes</dt>
              <dd className="text-charcoal font-medium">{appt.notes || '—'}</dd>
            </div>
          </dl>

          <AppointmentAdminNotes key={appt.updated_at} appointment={appt} />
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h2 className="font-medium text-sm text-charcoal mb-4 font-dm">Email History</h2>
          {emailLogs.length === 0 ? (
            <p className="text-sm text-charcoal-muted font-dm">No emails logged for this booking.</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {emailLogs.map((log) => (
                <li
                  key={log.id}
                  className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-50 pb-3 last:border-0 last:pb-0"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-medium bg-brand-pink-pale text-brand-pink px-2 py-0.5 rounded-full font-dm">
                      {log.email_type.replace(/_/g, ' ')}
                    </span>
                    <span className="text-sm text-charcoal-muted font-dm">{log.recipient_email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-charcoal-muted font-dm">
                    <span
                      className={
                        log.status === 'sent'
                          ? 'text-brand-green font-medium'
                          : 'text-red-600 font-medium'
                      }
                    >
                      {log.status}
                    </span>
                    <span>{format(parseISO(log.created_at), 'd MMM yyyy, h:mm a')}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <AppointmentQuickActions appointment={appt} />

        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h2 className="font-medium text-sm text-charcoal mb-4 font-dm">Client</h2>
          {profile ? (
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-full bg-brand-pink-pale text-brand-pink text-sm font-medium flex items-center justify-center font-dm shrink-0">
                {initials(profile.full_name)}
              </div>
              <div className="min-w-0">
                <p className="font-medium text-charcoal font-dm">{profile.full_name}</p>
                <p className="text-sm text-charcoal-muted break-all font-dm">{profile.email}</p>
                {profile.phone && <p className="text-sm text-charcoal-muted font-dm mt-1">{profile.phone}</p>}
                <Link
                  href={`/admin/clients/${profile.id}`}
                  className="inline-block mt-3 text-sm text-brand-pink font-dm hover:underline"
                >
                  View Client Profile →
                </Link>
              </div>
            </div>
          ) : (
            <p className="text-sm text-charcoal-muted font-dm">
              Guest booking — no registered profile linked.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
