import type { Metadata } from 'next'
import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import BlogPostsTable from '@/components/admin/blog/BlogPostsTable'
import type { BlogPost } from '@/types'

export const metadata: Metadata = { title: 'Blog Posts | Admin' }

export default async function AdminBlogPage() {
  const supabase = createAdminClient()
  const { data: posts } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-lora text-2xl font-normal text-charcoal">Blog Posts</h1>
          <p className="mt-1 font-dm text-sm font-light text-charcoal-muted">{posts?.length ?? 0} posts</p>
        </div>
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-pink px-5 py-2.5 font-dm text-sm font-medium text-white"
        >
          + New Post
        </Link>
      </div>
      <BlogPostsTable posts={(posts as BlogPost[]) ?? []} />
    </div>
  )
}
