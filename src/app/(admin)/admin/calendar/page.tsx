import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import AdminCalendar from '@/components/admin/AdminCalendar'
import type { Appointment, BlackoutDate } from '@/types'

export const metadata: Metadata = { title: 'Calendar | Admin' }

export default async function CalendarPage() {
  const supabase = await createClient()

  const [{ data: appointments }, { data: blackoutDates }] = await Promise.all([
    supabase
      .from('appointments')
      .select('*')
      .in('status', ['pending', 'confirmed'])
      .order('appointment_date', { ascending: true }),
    supabase.from('blackout_dates').select('*'),
  ])

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-lora text-2xl font-normal text-charcoal">Calendar</h1>
      <AdminCalendar
        appointments={(appointments as Appointment[]) ?? []}
        blackoutDates={(blackoutDates as BlackoutDate[]) ?? []}
      />
    </div>
  )
}
