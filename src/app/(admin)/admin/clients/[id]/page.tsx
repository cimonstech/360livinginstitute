import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Appointment, AppointmentStatus, Profile } from '@/types'
import { format, parseISO } from 'date-fns'

function initials(name: string) {
  const p = name.trim().split(/\s+/)
  return ((p[0]?.[0] ?? '') + (p[1]?.[0] ?? '')).toUpperCase() || '?'
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

type PageProps = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  return { title: `Client ${id.slice(0, 8)}… | Admin` }
}

export default async function ClientDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: profile, error } = await supabase.from('profiles').select('*').eq('id', id).single()
  if (error || !profile || profile.role !== 'client') notFound()

  const p = profile as Profile

  const { data: appointments } = await supabase
    .from('appointments')
    .select('*')
    .eq('client_id', id)
    .order('appointment_date', { ascending: false })

  const list = (appointments as Appointment[]) ?? []
  const total = list.length
  const pending = list.filter((a) => a.status === 'pending').length
  const completed = list.filter((a) => a.status === 'completed' || a.status === 'no_show').length

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 flex flex-col gap-6">
        <Link href="/admin/clients" className="text-sm text-brand-pink font-dm hover:underline w-fit">
          ← Back to Clients
        </Link>

        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-brand-pink-pale text-brand-pink text-lg font-medium flex items-center justify-center font-dm shrink-0">
              {initials(p.full_name)}
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="font-lora text-2xl text-charcoal">{p.full_name}</h1>
              <p className="text-sm text-charcoal-muted break-all font-dm mt-1">{p.email}</p>
              {p.phone && <p className="text-sm text-charcoal-muted font-dm mt-1">{p.phone}</p>}
              <p className="text-xs text-charcoal-muted font-dm mt-3">
                Joined {format(parseISO(p.created_at), 'd MMMM yyyy')}
              </p>
              <span
                className={`inline-block mt-3 text-xs font-medium px-2 py-0.5 rounded-full font-dm ${
                  p.email_verified ? 'bg-brand-green-pale text-brand-green' : 'bg-charcoal-light text-charcoal-muted'
                }`}
              >
                {p.email_verified ? 'Email verified' : 'Email not verified'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden overflow-x-auto">
          <div className="p-5 border-b border-gray-100">
            <h2 className="font-medium text-sm text-charcoal font-dm">Appointment history</h2>
          </div>
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="bg-charcoal-light text-xs font-medium text-charcoal-muted uppercase tracking-wider font-dm">
                <th className="px-4 py-3 text-left">Service</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {list.map((a) => (
                <tr key={a.id} className="border-b border-gray-50 hover:bg-charcoal-light/30">
                  <td className="px-4 py-3 text-sm text-charcoal font-dm">{a.service_title}</td>
                  <td className="px-4 py-3 text-sm text-charcoal-muted font-dm">
                    {format(parseISO(a.appointment_date + 'T12:00:00'), 'd MMM yyyy')}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className={statusPill(a.status)}>{a.status.replace('_', ' ')}</span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <Link href={`/admin/appointments/${a.id}`} className="text-brand-pink text-sm font-dm hover:underline">
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {list.length === 0 && (
            <p className="text-center py-12 text-charcoal-muted text-sm font-dm">No appointments yet</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h2 className="font-medium text-sm text-charcoal mb-4 font-dm">Stats</h2>
          <dl className="space-y-3 text-sm font-dm">
            <div className="flex justify-between">
              <dt className="text-charcoal-muted">Total sessions</dt>
              <dd className="font-medium text-charcoal">{total}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-charcoal-muted">Pending</dt>
              <dd className="font-medium text-charcoal">{pending}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-charcoal-muted">Completed</dt>
              <dd className="font-medium text-charcoal">{completed}</dd>
            </div>
          </dl>
        </div>
        <Link
          href="/book"
          className="inline-flex items-center justify-center rounded-full bg-brand-pink text-white px-5 py-2.5 text-sm font-medium font-dm hover:opacity-90"
        >
          Book a Session for Client
        </Link>
      </div>
    </div>
  )
}
