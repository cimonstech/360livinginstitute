import type { Metadata } from 'next'
import { Suspense } from 'react'
import { canonicalPath, privatePageRobots } from '@/lib/seo'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import DashboardClient from '@/components/dashboard/DashboardClient'
import Footer from '@/components/layout/Footer'
import type { Appointment, DashboardEventRegistration, Profile } from '@/types'
import { ensureProfileRowForUser } from '@/lib/profile-bootstrap'

export const metadata: Metadata = {
  title: 'My Bookings | 360 Living Institute',
  description: 'View and manage your appointments at 360 Living Institute.',
  ...privatePageRobots(),
  alternates: canonicalPath('/dashboard'),
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login?redirect=/dashboard')

  let { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle()

  if (!profile || (profile as Profile).role !== 'admin') {
    const repaired = await ensureProfileRowForUser(user.id)
    if (repaired) profile = repaired as Profile
  }

  if (profile && (profile as Profile).role === 'admin') {
    redirect('/admin')
  }

  const { data: appointments } = await supabase
    .from('appointments')
    .select('*, services(*)')
    .eq('client_id', user.id)
    .order('appointment_date', { ascending: false })

  const { data: eventRegistrations } = await supabase
    .from('event_registrations')
    .select('*, events(title, event_date, event_time, location)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (!profile) {
    return (
      <main>
        <Navbar />
        <div className="min-h-screen bg-warm-cream flex items-center justify-center p-8 font-dm text-charcoal-muted text-center">
          Your profile could not be loaded. Please contact us at info@360livinginstitute.com.
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main>
      <Navbar />
      <Suspense fallback={<div className="min-h-[40vh] bg-warm-cream" />}>
        <DashboardClient
          profile={profile as Profile}
          appointments={(appointments as Appointment[]) ?? []}
          eventRegistrations={(eventRegistrations as DashboardEventRegistration[]) ?? []}
        />
      </Suspense>
      <Footer />
    </main>
  )
}
