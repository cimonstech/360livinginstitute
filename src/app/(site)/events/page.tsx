import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/layout/Navbar'
import EventsExperience from '@/components/events/EventsExperience'
import PastEvents from '@/components/events/PastEvents'
import EventsCTA from '@/components/events/EventsCTA'
import Footer from '@/components/layout/Footer'
import type { Event } from '@/types'

export const metadata: Metadata = {
  title: 'Events & Programs | 360 Living Institute',
  description:
    'Workshops, webinars, cohorts, and signature programs from 360 Living Institute. Join a community growing toward wholeness.',
}

export default async function EventsPage() {
  const supabase = await createClient()

  const { data: upcomingRaw } = await supabase
    .from('events')
    .select('*')
    .in('status', ['upcoming', 'ongoing'])
    .order('event_date', { ascending: true })

  const { data: pastRaw } = await supabase
    .from('events')
    .select('*')
    .eq('status', 'past')
    .order('event_date', { ascending: false })
    .limit(3)

  const upcomingEvents = (upcomingRaw as Event[]) ?? []
  const pastEvents = (pastRaw as Event[]) ?? []

  return (
    <main>
      <Navbar />
      <EventsExperience upcomingEvents={upcomingEvents} />
      <PastEvents events={pastEvents} />
      <EventsCTA />
      <Footer />
    </main>
  )
}
