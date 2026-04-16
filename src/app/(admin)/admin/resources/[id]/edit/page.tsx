import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import ResourceEditor from '@/components/admin/resources/ResourceEditor'
import type { Resource } from '@/types'

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  return { title: `Edit resource ${id.slice(0, 8)}… | Admin` }
}

export default async function EditResourcePage({ params }: Props) {
  const { id } = await params
  const supabase = createAdminClient()
  const { data } = await supabase.from('resources').select('*').eq('id', id).single()
  if (!data) notFound()
  return <ResourceEditor resource={data as Resource} />
}

