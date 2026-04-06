import { createAdminClient } from '@/lib/supabase/admin'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Event, EventRegistration } from '@/types'
import StatusUpdater from '@/components/admin/events/StatusUpdater'
import RegistrationsCsvExport from '@/components/admin/events/RegistrationsCsvExport'

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    registered: 'bg-brand-green-pale text-brand-green border border-brand-green-light',
    attended: 'bg-charcoal-light text-charcoal border border-gray-200',
    cancelled: 'bg-red-50 text-red-600 border border-red-200',
    no_show: 'bg-amber-50 text-amber-700 border border-amber-200',
  }
  return (
    <span
      className={`inline-block rounded-full border px-3 py-1 font-dm text-xs font-medium capitalize ${styles[status] || styles.registered}`}
    >
      {status.replace('_', ' ')}
    </span>
  )
}

export default async function EventRegistrationsPage({
  params,
}: {
  params: Promise<{ eventId: string }>
}) {
  const { eventId } = await params
  const supabase = createAdminClient()

  const [{ data: event }, { data: registrations }] = await Promise.all([
    supabase.from('events').select('*').eq('id', eventId).single(),
    supabase
      .from('event_registrations')
      .select('*')
      .eq('event_id', eventId)
      .order('created_at', { ascending: false }),
  ])

  if (!event) notFound()

  const list = (registrations as EventRegistration[]) ?? []
  const ev = event as Event

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/events" className="font-dm text-xs text-charcoal-muted hover:text-charcoal">
          ← Back to Events
        </Link>
      </div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-lora text-2xl font-normal text-charcoal">{ev.title}</h1>
          <p className="mt-1 font-dm text-sm font-light text-charcoal-muted">
            {new Date(ev.event_date).toLocaleDateString('en-GB', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
            {' · '}
            {ev.location}
          </p>
        </div>
        <div className="rounded-xl border border-brand-pink-light bg-brand-pink-pale px-4 py-3 text-center">
          <p className="font-lora text-2xl text-brand-pink">{list.length}</p>
          <p className="mt-0.5 font-dm text-xs text-charcoal-muted">Registered</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
        <div className="flex flex-col gap-3 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-dm text-sm font-medium text-charcoal">Registrations</p>
          <RegistrationsCsvExport eventTitle={ev.title} registrations={list} />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] font-dm text-sm">
            <thead className="bg-charcoal-light text-xs font-medium uppercase tracking-wider text-charcoal-muted">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Phone</th>
                <th className="px-4 py-3 text-left">Organisation</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Registered</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {list.map((reg) => (
                <tr key={reg.id} className="hover:bg-charcoal-light/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-brand-pink-pale font-dm text-xs font-medium text-brand-pink">
                        {reg.full_name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-charcoal">{reg.full_name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-charcoal-muted">{reg.email}</td>
                  <td className="px-4 py-3 text-charcoal-muted">{reg.phone || '—'}</td>
                  <td className="px-4 py-3 text-charcoal-muted">{reg.organisation || '—'}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={reg.status} />
                  </td>
                  <td className="px-4 py-3 font-dm text-xs text-charcoal-muted">
                    {new Date(reg.created_at).toLocaleDateString('en-GB')}
                  </td>
                  <td className="px-4 py-3">
                    <StatusUpdater registrationId={reg.id} currentStatus={reg.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {list.length === 0 && (
          <p className="py-12 text-center font-dm text-sm text-charcoal-muted">No registrations yet</p>
        )}
      </div>
    </div>
  )
}
