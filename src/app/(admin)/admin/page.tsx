import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import AdminStats from '@/components/admin/AdminStats'
import RecentAppointments from '@/components/admin/RecentAppointments'
import AppointmentsByService from '@/components/admin/AppointmentsByService'
import type { AppointmentWithProfile } from '@/components/admin/RecentAppointments'

export const metadata: Metadata = { title: 'Admin Overview | 360 Living Institute' }

export default async function AdminPage() {
  const supabase = await createClient()

  const [totalRes, pendingRes, confirmedRes, completedRes, eventRegRes, recentRes, allRes] = await Promise.all([
    supabase.from('appointments').select('*', { count: 'exact', head: true }),
    supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('status', 'confirmed'),
    supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('status', 'completed'),
    supabase.from('event_registrations').select('*', { count: 'exact', head: true }),
    supabase
      .from('appointments')
      .select('*, profiles(full_name, email)')
      .order('created_at', { ascending: false })
      .limit(5),
    supabase.from('appointments').select('service_title, status'),
  ])

  const stats = {
    total: totalRes.count ?? 0,
    pending: pendingRes.count ?? 0,
    confirmed: confirmedRes.count ?? 0,
    completed: completedRes.count ?? 0,
    eventRegistrations: eventRegRes.count ?? 0,
  }

  const recentAppointments = (recentRes.data as AppointmentWithProfile[]) ?? []
  const allAppointments =
    (allRes.data as { service_title: string; status: string }[]) ?? []

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-lora text-2xl font-normal text-charcoal">Good morning 👋</h1>
        <p className="text-sm text-charcoal-muted font-light mt-1 font-dm">
          Here&apos;s what&apos;s happening at 360 Living Institute today.
        </p>
      </div>
      <AdminStats stats={stats} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentAppointments appointments={recentAppointments} />
        </div>
        <div>
          <AppointmentsByService appointments={allAppointments} />
        </div>
      </div>
    </div>
  )
}
