import type { Metadata } from 'next'
import { createAdminClient } from '@/lib/supabase/admin'
import EventsManager from '@/components/admin/EventsManager'
import type { Event } from '@/types'

export const metadata: Metadata = { title: 'Events | Admin' }

export default async function AdminEventsPage() {
  const supabase = createAdminClient()
  const { data: events } = await supabase
    .from('events')
    .select('*, event_registrations(count)')
    .order('event_date', { ascending: true })

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-lora text-2xl font-normal text-charcoal">Events</h1>
        <p className="mt-1 font-dm text-sm text-charcoal-muted">Manage public programs and workshops.</p>
      </div>
      <EventsManager events={(events as Event[]) ?? []} />
    </div>
  )
}
