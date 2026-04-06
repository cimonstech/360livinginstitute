import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import AvailabilitySettings from '@/components/admin/AvailabilitySettings'
import ServicesSettings from '@/components/admin/ServicesSettings'
import PricingSettings from '@/components/admin/PricingSettings'
import type { Availability, PricingSettings as PricingSettingsType, Service } from '@/types'

export const metadata: Metadata = { title: 'Settings | Admin' }

export default async function SettingsPage() {
  const supabase = await createClient()
  const [{ data: availability }, { data: services }, pricingRes] = await Promise.all([
    supabase.from('availability').select('*').order('day_of_week'),
    supabase.from('services').select('*').order('sort_order'),
    supabase.from('pricing_settings').select('*').limit(1).maybeSingle(),
  ])

  const pricing = (pricingRes.data as PricingSettingsType) ?? null

  return (
    <div className="flex flex-col gap-8">
      <h1 className="font-lora text-2xl font-normal text-charcoal">Settings</h1>
      <AvailabilitySettings availability={(availability as Availability[]) ?? []} />
      <ServicesSettings services={(services as Service[]) ?? []} />
      <PricingSettings pricing={pricing} services={(services as Service[]) ?? []} />
    </div>
  )
}
