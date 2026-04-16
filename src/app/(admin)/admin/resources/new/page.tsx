import type { Metadata } from 'next'
import ResourceEditor from '@/components/admin/resources/ResourceEditor'

export const metadata: Metadata = { title: 'New Resource | Admin' }

export default function NewResourcePage() {
  return <ResourceEditor />
}

