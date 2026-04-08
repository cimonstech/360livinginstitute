import Image from 'next/image'
import Link from 'next/link'
import type { BlogPost } from '@/types'
import { formatBlogDate } from '@/lib/format-display'

function TagPills({ tags }: { tags: string[] | null | undefined }) {
  if (!tags?.length) return null
  return (
    <div className="flex flex-wrap gap-2">
      {tags.slice(0, 4).map((t) => (
        <span
          key={t}
          className="rounded-full bg-brand-pink-pale px-2.5 py-0.5 font-dm text-xs font-medium text-brand-pink"
        >
          {t}
        </span>
      ))}
    </div>
  )
}

function AuthorLine({
  authorName,
  date,
  readMins,
}: {
  authorName: string
  date: string
  readMins: number
}) {
  const initials = authorName
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
  return (
    <div className="mt-4 flex flex-wrap items-center gap-2 font-dm text-xs text-charcoal-muted">
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-pink-pale text-[10px] font-medium text-brand-pink">
        {initials}
      </span>
      <span>{authorName}</span>
      <span aria-hidden>·</span>
      <span>{date}</span>
      <span aria-hidden>·</span>
      <span>{readMins} min read</span>
    </div>
  )
}

function PostCard({ post }: { post: BlogPost }) {
  const date = formatBlogDate(post.published_at || post.created_at)
  return (
    <article className="overflow-hidden rounded-2xl border border-gray-100 bg-white transition-shadow hover:shadow-md">
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="relative h-48 w-full bg-brand-pink-pale">
          {post.cover_image_url ? (
            <Image
              src={post.cover_image_url}
              alt={post.cover_image_alt || post.title}
              fill
              className="object-cover"
              sizes="(max-width:768px) 100vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center font-lora text-sm text-brand-pink/40">360</div>
          )}
        </div>
        <div className="p-5">
          <TagPills tags={post.tags} />
          <h3 className="mt-2 font-lora text-lg font-normal text-charcoal">{post.title}</h3>
          {post.excerpt && (
            <p className="mt-2 line-clamp-3 font-dm text-sm font-light leading-relaxed text-charcoal-muted">
              {post.excerpt}
            </p>
          )}
          <AuthorLine authorName={post.author_name} date={date} readMins={post.read_time_minutes} />
          <p className="mt-3 font-dm text-xs font-medium text-brand-pink">Read more →</p>
        </div>
      </Link>
    </article>
  )
}

export default function BlogList({
  featured,
  posts,
}: {
  featured: BlogPost | null | undefined
  posts: BlogPost[]
}) {
  return (
    <div className="bg-white">
      <section className="mx-auto max-w-7xl bg-warm-cream px-6 py-24 lg:px-10">
        <p className="font-dm text-xs font-medium uppercase tracking-widest text-brand-pink">Live Life Well</p>
        <h1 className="mt-2 max-w-3xl font-lora text-4xl font-normal leading-tight text-charcoal lg:text-5xl">
          Insights for a <em className="italic">Whole</em> Life
        </h1>
        <p className="mt-4 max-w-2xl font-dm text-sm font-light leading-relaxed text-charcoal-muted">
          Mental health guidance, life transition insights, and practical tools from our team of licensed practitioners.
        </p>

        {featured && (
          <div className="mt-12 grid grid-cols-1 gap-8 overflow-hidden rounded-2xl border border-gray-100 bg-white lg:grid-cols-2">
            <div className="relative h-72 min-h-[18rem] w-full bg-brand-pink-pale lg:h-auto lg:min-h-[20rem]">
              {featured.cover_image_url ? (
                <Image
                  src={featured.cover_image_url}
                  alt={featured.cover_image_alt || featured.title}
                  fill
                  className="object-cover"
                  sizes="(max-width:1024px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className="flex h-full items-center justify-center font-lora text-2xl text-brand-pink/30">360</div>
              )}
            </div>
            <div className="flex flex-col justify-center p-8">
              <span className="inline-flex w-fit rounded-full bg-brand-pink px-3 py-1 font-dm text-xs text-white">
                Featured
              </span>
              <div className="mt-4">
                <TagPills tags={featured.tags} />
              </div>
              <h2 className="mt-3 font-lora text-2xl font-normal text-charcoal">{featured.title}</h2>
              {featured.excerpt && (
                <p className="mt-3 font-dm text-sm font-light leading-relaxed text-charcoal-muted">{featured.excerpt}</p>
              )}
              <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                <AuthorLine
                  authorName={featured.author_name}
                  date={formatBlogDate(featured.published_at || featured.created_at)}
                  readMins={featured.read_time_minutes}
                />
                <Link
                  href={`/blog/${featured.slug}`}
                  className="font-dm text-sm font-medium text-brand-pink hover:underline"
                >
                  Read Article →
                </Link>
              </div>
            </div>
          </div>
        )}

        {!featured && posts.length === 0 && (
          <p className="py-24 text-center font-dm text-charcoal-muted">No articles published yet. Check back soon.</p>
        )}

        {posts.length > 0 && (
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
