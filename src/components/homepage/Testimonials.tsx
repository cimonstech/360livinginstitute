import Image from 'next/image'
import Link from 'next/link'
import { homepage } from '@/data/content'

export default function Testimonials() {
  const { eyebrow, items, sidebarQuote } = homepage.testimonials
  return (
    <section className="bg-surface-dark py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2">
          <div>
            <p className="font-dm text-xs font-medium uppercase tracking-widest text-white/40">{eyebrow}</p>
            <div className="mt-6 flex flex-col gap-4">
              {items.map((t) => (
                <article key={t.quote} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <p className="font-lora text-base font-normal italic leading-relaxed text-white/80">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="mt-4">
                    <p className="font-dm text-xs text-white/50">— {t.attribution}</p>
                  </div>
                </article>
              ))}
              <p className="font-dm text-xs text-white/40">
                More stories will be shared here as they become available.{' '}
                <Link href="/success-stories" className="text-brand-green-light hover:underline">
                  Success Stories
                </Link>
              </p>
            </div>
          </div>

          <div>
            <div className="relative">
              <Image
                src="/anxietydisorder.jpeg"
                alt="Community and well-being"
                width={800}
                height={640}
                className="h-80 w-full rounded-2xl object-cover object-center"
              />
            </div>
            <article className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="font-dm text-xs text-white/50">Reflection</p>
              <p className="mt-3 font-lora text-sm font-normal italic leading-relaxed text-white/80">
                &ldquo;{sidebarQuote.quote}&rdquo;
              </p>
              <p className="mt-3 font-dm text-xs text-white/50">— {sidebarQuote.attribution}</p>
            </article>
          </div>
        </div>
      </div>
    </section>
  )
}
