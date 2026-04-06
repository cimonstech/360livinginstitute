import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import AppointmentsTable from '@/components/admin/AppointmentsTable'
import type { Appointment } from '@/types'

export const metadata: Metadata = { title: 'Appointments | Admin' }

export default async function AppointmentsPage() {
  const supabase = await createClient()

  const { data: appointments } = await supabase
    .from('appointments')
    .select('*')
    .order('appointment_date', { ascending: true })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-lora text-2xl font-normal text-charcoal">Appointments</h1>
          <p className="text-sm text-charcoal-muted font-light mt-1 font-dm">
            {appointments?.length ?? 0} total records
          </p>
        </div>
      </div>
      <AppointmentsTable appointments={(appointments as Appointment[]) ?? []} />
    </div>
  )
}
