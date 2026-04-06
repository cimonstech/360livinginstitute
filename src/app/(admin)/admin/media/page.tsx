import type { Metadata } from 'next'
import { createAdminClient } from '@/lib/supabase/admin'
import MediaLibrary from '@/components/admin/MediaLibrary'
import type { Media } from '@/types'

export const metadata: Metadata = { title: 'Media Library | Admin' }

export default async function AdminMediaPage() {
  const supabase = createAdminClient()
  const { data: media } = await supabase.from('media').select('*').order('created_at', { ascending: false })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-lora text-2xl font-normal text-charcoal">Media Library</h1>
        <p className="font-dm text-sm text-charcoal-muted">{media?.length ?? 0} files</p>
      </div>
      <MediaLibrary media={(media as Media[]) ?? []} />
    </div>
  )
}
