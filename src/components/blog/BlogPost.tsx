import Image from 'next/image'
import Link from 'next/link'
import type { BlogPost } from '@/types'
import { formatBlogDate } from '@/lib/format-display'

type Related = Pick<
  BlogPost,
  'id' | 'title' | 'slug' | 'excerpt' | 'cover_image_url' | 'published_at' | 'read_time_minutes' | 'author_name'
>

function TagPills({ tags }: { tags: string[] | null | undefined }) {
  if (!tags?.length) return null
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {tags.map((t) => (
        <span
          key={t}
          className="rounded-full bg-brand-pink-pale px-3 py-1 font-dm text-xs font-medium text-brand-pink"
        >
          {t}
        </span>
      ))}
    </div>
  )
}

function MiniCard({ post }: { post: Related }) {
  const date = formatBlogDate(post.published_at)
  return (
    <article className="overflow-hidden rounded-2xl border border-gray-100 bg-white transition-shadow hover:shadow-md">
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="relative h-40 w-full bg-brand-pink-pale">
          {post.cover_image_url ? (
            <Image
              src={post.cover_image_url}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width:768px) 100vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center font-lora text-brand-pink/30">360</div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-lora text-base font-normal text-charcoal">{post.title}</h3>
          {post.excerpt && (
            <p className="mt-2 line-clamp-2 font-dm text-xs font-light text-charcoal-muted">{post.excerpt}</p>
          )}
          <p className="mt-2 font-dm text-[10px] text-charcoal-muted">
            {post.author_name} · {date} · {post.read_time_minutes} min
          </p>
        </div>
      </Link>
    </article>
  )
}

export default function BlogPostView({
  post,
  relatedPosts,
}: {
  post: BlogPost
  relatedPosts: Related[]
}) {
  const date = formatBlogDate(post.published_at || post.created_at)
  const initials = post.author_name
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="bg-white">
      <section className="mx-auto max-w-4xl bg-warm-cream px-6 py-16 text-center lg:px-10">
        <TagPills tags={post.tags} />
        <h1 className="mx-auto mt-4 max-w-3xl font-lora text-3xl font-normal leading-tight text-charcoal lg:text-5xl">
          {post.title}
        </h1>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 font-dm text-sm text-charcoal-muted">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-pink-pale text-xs font-medium text-brand-pink">
            {initials}
          </span>
          <span>{post.author_name}</span>
          <span aria-hidden>·</span>
          <span>{date}</span>
          <span aria-hidden>·</span>
          <span>{post.read_time_minutes} min read</span>
        </div>
        <div className="relative mx-auto mt-10 h-80 max-w-4xl overflow-hidden rounded-2xl bg-brand-pink-pale">
          {post.cover_image_url ? (
            <Image
              src={post.cover_image_url}
              alt={post.cover_image_alt || post.title}
              fill
              className="object-cover"
              sizes="(max-width:896px) 100vw, 896px"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center font-lora text-3xl text-brand-pink/25">360 Living</div>
          )}
        </div>
      </section>

      <article className="mx-auto max-w-3xl px-6 py-16">
        <div
          className="prose prose-lg max-w-none font-dm leading-relaxed text-charcoal prose-headings:font-lora prose-headings:font-normal prose-headings:text-charcoal prose-p:font-light prose-p:text-charcoal-muted prose-a:text-brand-pink prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-brand-pink prose-blockquote:text-brand-pink prose-blockquote:italic prose-strong:font-medium prose-strong:text-charcoal prose-img:w-full prose-img:rounded-xl"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>

      {relatedPosts.length > 0 && (
        <section className="bg-warm-cream px-6 py-16 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <h2 className="font-lora text-2xl font-normal text-charcoal">More Articles</h2>
            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
              {relatedPosts.map((p) => (
                <MiniCard key={p.id} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
