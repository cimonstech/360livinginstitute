import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { canonicalPath, rootOpenGraphDefaults, rootTwitterDefaults } from '@/lib/seo'
import Navbar from '@/components/layout/Navbar'
import BlogList from '@/components/blog/BlogList'
import Footer from '@/components/layout/Footer'
import type { BlogPost } from '@/types'

export const metadata: Metadata = {
  title: 'Live Life Well | 360 Living Institute',
  description:
    'Mental health insights, life transition guidance, and psychological well-being resources from the team at 360 Living Institute.',
  alternates: canonicalPath('/blog'),
  openGraph: {
    ...rootOpenGraphDefaults,
    title: 'Live Life Well | 360 Living Institute',
    description:
      'Mental health insights, life transition guidance, and psychological well-being resources from the team at 360 Living Institute.',
    url: '/blog',
  },
  twitter: {
    ...rootTwitterDefaults,
    title: 'Live Life Well | 360 Living Institute',
    description:
      'Mental health insights, life transition guidance, and psychological well-being resources from the team at 360 Living Institute.',
  },
}

export default async function BlogPage() {
  const supabase = await createClient()
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .in('publish_to', ['institute', 'both'])
    .order('published_at', { ascending: false })

  const list = (posts as BlogPost[]) ?? []
  const featured = list.find((p) => p.featured) || list[0]
  const rest = featured ? list.filter((p) => p.id !== featured.id) : []

  return (
    <main>
      <Navbar />
      <BlogList featured={featured} posts={rest} />
      <Footer />
    </main>
  )
}
