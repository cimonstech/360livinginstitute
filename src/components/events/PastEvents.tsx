import Image from 'next/image'
import type { Event } from '@/types'
import { formatEventMonthYear } from '@/lib/format-display'

const FALLBACK_IMAGES = [
  '/images/portrait-gorgeous.avif',
  '/images/smilingclient.webp',
  '/images/beautiful-african-woman.jpg',
] as const

export default function PastEvents({ events }: { events: Event[] }) {
  const list = events.slice(0, 3)

  return (
    <section className="bg-warm-cream py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <p className="font-dm text-xs font-medium uppercase tracking-widest text-brand-pink">Past Highlights</p>
        <h2 className="mt-2 font-lora text-3xl font-normal text-charcoal">Where we&apos;ve been</h2>
        <p className="mb-12 mt-3 font-dm text-sm font-light text-charcoal-muted">
          A glimpse at some of our previous programs and community experiences.
        </p>

        {list.length === 0 ? (
          <p className="py-12 text-center font-dm text-sm text-charcoal-muted">Past programs will appear here soon.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {list.map((item, i) => (
              <article key={item.id} className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
                <div className="relative h-48 w-full bg-charcoal-light">
                  {item.cover_image_url ? (
                    <Image
                      src={item.cover_image_url}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="(max-width:768px) 100vw, 33vw"
                    />
                  ) : (
                    <Image
                      src={FALLBACK_IMAGES[i % FALLBACK_IMAGES.length]}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="(max-width:768px) 100vw, 33vw"
                    />
                  )}
                </div>
                <div className="p-5">
                  <p className="mb-1 font-dm text-xs text-charcoal-muted">{formatEventMonthYear(item.event_date)}</p>
                  <h3 className="font-lora text-base font-medium text-charcoal">{item.title}</h3>
                  {item.description && (
                    <p className="mt-1 font-dm text-xs font-light text-charcoal-muted">{item.description}</p>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
