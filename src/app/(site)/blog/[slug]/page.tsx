import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { canonicalPath, DEFAULT_OG_IMAGE, rootOpenGraphDefaults, rootTwitterDefaults } from '@/lib/seo'
import { notFound } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import BlogPostView from '@/components/blog/BlogPost'
import Footer from '@/components/layout/Footer'
import type { BlogPost } from '@/types'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data: post } = await supabase
    .from('blog_posts')
    .select('title, excerpt, cover_image_url, cover_image_alt')
    .eq('slug', slug)
    .eq('status', 'published')
    .in('publish_to', ['institute', 'both'])
    .maybeSingle()

  const path = `/blog/${slug}`
  if (!post) {
    return {
      title: 'Article | 360 Living Institute',
      alternates: canonicalPath(path),
      robots: { index: false, follow: true },
    }
  }

  const title = `${post.title} | 360 Living Institute`
  const description = post.excerpt ?? undefined
  const cover = post.cover_image_url?.trim()
  const ogImage = cover
    ? [{ url: cover, alt: post.cover_image_alt ?? post.title }]
    : rootOpenGraphDefaults.images

  return {
    title,
    description,
    alternates: canonicalPath(path),
    openGraph: {
      ...rootOpenGraphDefaults,
      title,
      description,
      url: path,
      type: 'article',
      images: ogImage,
    },
    twitter: {
      ...rootTwitterDefaults,
      title,
      description,
      images: cover ? [cover] : [DEFAULT_OG_IMAGE],
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .in('publish_to', ['institute', 'both'])
    .single()

  if (!post) notFound()

  const { data: relatedPosts } = await supabase
    .from('blog_posts')
    .select('id, title, slug, excerpt, cover_image_url, published_at, read_time_minutes, author_name')
    .eq('status', 'published')
    .in('publish_to', ['institute', 'both'])
    .neq('id', post.id)
    .order('published_at', { ascending: false })
    .limit(3)

  return (
    <main>
      <Navbar />
      <BlogPostView post={post as BlogPost} relatedPosts={(relatedPosts ?? []) as BlogPost[]} />
      <Footer />
    </main>
  )
}
