import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import BlogEditor from '@/components/admin/blog/BlogEditor'
import type { BlogPost } from '@/types'

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  return { title: `Edit post ${id.slice(0, 8)}… | Admin` }
}

export default async function AdminBlogEditPage({ params }: Props) {
  const { id } = await params
  const supabase = createAdminClient()
  const { data: post } = await supabase.from('blog_posts').select('*').eq('id', id).single()

  if (!post) notFound()

  return <BlogEditor post={post as BlogPost} />
}
