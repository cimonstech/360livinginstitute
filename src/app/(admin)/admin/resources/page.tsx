import type { Metadata } from 'next'
import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import ResourcesTable from '@/components/admin/resources/ResourcesTable'
import type { Resource } from '@/types'

export const metadata: Metadata = { title: 'Resources | Admin' }

export default async function ResourcesPage() {
  const supabase = createAdminClient()
  const { data: resources } = await supabase.from('resources').select('*').order('created_at', { ascending: false })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-lora text-2xl font-normal text-charcoal">Resources</h1>
          <p className="text-sm text-charcoal-muted font-light mt-1">
            Standalone PDFs and infographics for the Foundation resources page.
          </p>
        </div>
        <Link
          href="/admin/resources/new"
          className="bg-brand-pink text-white text-sm font-medium px-5 py-2.5 rounded-full inline-flex items-center gap-2"
        >
          + Add Resource
        </Link>
      </div>
      <ResourcesTable resources={(resources as Resource[]) ?? []} />
    </div>
  )
}

