import Link from 'next/link'
import type { Appointment, AppointmentStatus } from '@/types'
import { format, parseISO } from 'date-fns'

export type AppointmentWithProfile = Appointment & {
  profiles?: { full_name: string; email: string } | null
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/)
  const a = parts[0]?.[0] ?? ''
  const b = parts[1]?.[0] ?? ''
  return (a + b).toUpperCase() || '?'
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
    case 'completed':
    case 'no_show':
      return `${base} bg-charcoal-light text-charcoal-muted border border-gray-200`
    default:
      return `${base} bg-charcoal-light text-charcoal-muted`
  }
}

export default function RecentAppointments({ appointments }: { appointments: AppointmentWithProfile[] }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="p-5 border-b border-gray-100 flex items-center justify-between">
        <span className="font-medium text-sm text-charcoal font-dm">Recent Bookings</span>
        <Link href="/admin/appointments" className="text-xs text-brand-pink hover:underline font-dm">
          View all →
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-charcoal-light text-xs font-medium text-charcoal-muted uppercase tracking-wider font-dm">
              <th className="px-4 py-3 text-left">Client</th>
              <th className="px-4 py-3 text-left">Service</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((a) => {
              const name = a.profiles?.full_name ?? a.client_name
              const email = a.profiles?.email ?? a.client_email
              const date = parseISO(a.appointment_date + 'T12:00:00')
              return (
                <tr key={a.id} className="border-b border-gray-50 hover:bg-charcoal-light/50 transition-colors">
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-brand-pink-pale text-brand-pink text-xs font-medium flex items-center justify-center font-dm shrink-0">
                        {initials(name)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-charcoal font-dm truncate">{name}</p>
                        <p className="text-xs text-charcoal-muted truncate font-dm">{email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-charcoal font-dm">{a.service_title}</td>
                  <td className="px-4 py-3 text-sm text-charcoal-muted font-dm">{format(date, 'd MMM yyyy')}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={statusPill(a.status)}>{a.status.replace('_', ' ')}</span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <Link href={`/admin/appointments/${a.id}`} className="text-brand-pink text-sm font-dm hover:underline">
                      View →
                    </Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {appointments.length === 0 && (
          <p className="text-center py-10 text-charcoal-muted text-sm font-dm">No bookings yet</p>
        )}
      </div>
    </div>
  )
}
