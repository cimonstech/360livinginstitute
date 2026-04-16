import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/layout/Navbar'
import ResourcesHero from '@/components/resources/ResourcesHero'
import ResourcesGrid from '@/components/resources/ResourcesGrid'
import Footer from '@/components/layout/Footer'
import { canonicalPath, rootOpenGraphDefaults, rootTwitterDefaults } from '@/lib/seo'
import type { BlogPost, Resource } from '@/types'

export const metadata: Metadata = {
  title: 'Resources | 360 Living Foundation',
  description:
    'Insights for everyday living — mental health, personal development, relationships, and life transitions.',
  alternates: canonicalPath('/resources'),
  openGraph: {
    ...rootOpenGraphDefaults,
    title: 'Resources | 360 Living Foundation',
    description: 'Articles and tools on mental health, growth, and relationships — coming soon.',
    url: '/resources',
  },
  twitter: {
    ...rootTwitterDefaults,
    title: 'Resources | 360 Living Foundation',
    description: 'Articles and tools on mental health, growth, and relationships — coming soon.',
  },
}

export default async function ResourcesPage() {
  const supabase = await createClient()

  const { data: articles } = await supabase
    .from('blog_posts')
    .select(
      'id, title, slug, excerpt, cover_image_url, cover_image_alt, published_at, read_time_minutes, author_name, category, tags, attachment_url, attachment_name, resource_type, created_at, updated_at'
    )
    .eq('status', 'published')
    .in('publish_to', ['foundation', 'both'])
    .order('published_at', { ascending: false })

  const { data: resources } = await supabase
    .from('resources')
    .select('*')
    .eq('status', 'published')
    .in('publish_to', ['foundation', 'both'])
    .order('published_at', { ascending: false })

  return (
    <main className="bg-white">
      <Navbar />
      <ResourcesHero />
      <ResourcesGrid articles={((articles ?? []) as BlogPost[]) ?? []} resources={((resources ?? []) as Resource[]) ?? []} />
      <Footer />
    </main>
  )
}
