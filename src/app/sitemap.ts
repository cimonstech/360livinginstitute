import type { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

function baseUrl() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  return raw && raw.startsWith('http') ? raw.replace(/\/+$/, '') : 'https://360livingfoundation.org'
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = baseUrl()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${site}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${site}/about`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${site}/programs`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${site}/get-involved`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${site}/resources`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${site}/blog`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${site}/events`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${site}/team`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${site}/success-stories`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${site}/contact`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${site}/privacy`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${site}/terms`, changeFrequency: 'yearly', priority: 0.3 },
  ]

  try {
    const supabase = await createClient()
    const { data: posts } = await supabase
      .from('blog_posts')
      .select('slug, updated_at, published_at, created_at')
      .eq('status', 'published')
      .in('publish_to', ['foundation', 'both'])
      .order('published_at', { ascending: false })

    const dynamicBlog =
      posts?.map((p) => ({
        url: `${site}/blog/${p.slug}`,
        lastModified: new Date(p.updated_at || p.published_at || p.created_at),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      })) ?? []

    return [...staticRoutes, ...dynamicBlog]
  } catch {
    // If Supabase is unavailable at build/runtime, still emit static routes.
    return staticRoutes
  }
}

