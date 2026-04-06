import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import ClientsTable from '@/components/admin/ClientsTable'
import type { Profile } from '@/types'

export const metadata: Metadata = { title: 'Clients | Admin' }

type ClientWithSessions = Profile & {
  appointments?: { count: number }[] | null
}

export default async function ClientsPage() {
  const supabase = await createClient()

  let clients: ClientWithSessions[] | null = null

  const withCount = await supabase
    .from('profiles')
    .select(
      'id, full_name, email, phone, role, created_at, updated_at, email_verified, avatar_url, appointments(count)'
    )
    .eq('role', 'client')
    .order('created_at', { ascending: false })

  if (withCount.error) {
    const simple = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'client')
      .order('created_at', { ascending: false })
    clients = (simple.data as Profile[])?.map((p) => ({ ...p, appointments: [{ count: 0 }] })) ?? []
  } else {
    clients = (withCount.data as ClientWithSessions[]) ?? []
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-lora text-2xl font-normal text-charcoal">Clients</h1>
        <p className="text-sm text-charcoal-muted font-light mt-1 font-dm">
          {clients?.length ?? 0} registered clients
        </p>
      </div>
      <ClientsTable clients={clients ?? []} />
    </div>
  )
}
