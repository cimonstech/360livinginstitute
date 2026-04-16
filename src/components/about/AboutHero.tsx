import Image from 'next/image'
import Link from 'next/link'
import { Network } from 'lucide-react'
import { about, institute } from '@/data/content'

export default function AboutHero() {
  const { eyebrow, titleLines, lead, heroImageSrc, heroImageAlt, floatingCard } = about.hero
  return (
    <section className="bg-warm-cream">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 py-16 lg:grid-cols-2 lg:gap-16 lg:px-10 lg:py-24">
        <div>
          <p className="font-dm text-xs font-medium uppercase tracking-widest text-brand-green">{eyebrow}</p>
          <h1 className="mt-4 font-lora text-4xl font-normal leading-tight tracking-tight text-charcoal lg:text-5xl">
            {titleLines.map((line, i) => (
              <span key={line}>
                {i > 0 ? <br /> : null}
                {i === titleLines.length - 1 ? (
                  <em className="font-lora italic text-brand-pink">{line}</em>
                ) : (
                  line
                )}
              </span>
            ))}
          </h1>
          <p className="mt-6 max-w-lg font-dm text-base font-light leading-relaxed text-charcoal-muted">{lead}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/get-involved#apply"
              className="rounded-full bg-brand-pink px-6 py-3 font-dm text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Apply for a Program
            </Link>
            <Link
              href="/programs"
              className="rounded-full border border-charcoal/25 px-6 py-3 font-dm text-sm font-normal text-charcoal transition-colors hover:border-brand-pink/40"
            >
              View Programs
            </Link>
            <Link
              href={institute.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-charcoal/15 px-6 py-3 font-dm text-sm text-charcoal-muted transition-colors hover:border-brand-pink/40"
            >
              {institute.name} ↗
            </Link>
          </div>
        </div>

        <div className="relative mx-auto flex w-full max-w-lg flex-col items-center justify-center lg:max-w-none">
          <div className="relative w-full pb-28 pt-2 sm:pb-24 sm:pt-4">
            <div className="relative mx-auto flex aspect-square w-[min(100%,320px)] items-center justify-center sm:w-[min(100%,380px)]">
              <div className="relative h-full w-full overflow-hidden rounded-full border border-charcoal/10 bg-white shadow-lg ring-1 ring-black/5">
                <Image
                  src={heroImageSrc}
                  alt={heroImageAlt}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 90vw, 380px"
                  priority
                />
              </div>
            </div>

            <div className="pointer-events-none absolute bottom-2 left-4 right-4 z-20 flex justify-center sm:left-auto sm:bottom-6 sm:right-4 sm:justify-end">
              <div className="pointer-events-auto max-w-[240px] rounded-2xl border border-charcoal/10 bg-white p-4 shadow-lg">
                <div className="mb-2 flex items-center gap-2 text-brand-green">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-green/15">
                    <Network size={16} strokeWidth={1.75} aria-hidden />
                  </span>
                  <span className="font-dm text-[10px] font-semibold uppercase tracking-wider text-charcoal-muted">
                    Foundation
                  </span>
                </div>
                <p className="font-lora text-lg font-medium leading-snug text-charcoal">{floatingCard.title}</p>
                <p className="mt-1 font-dm text-xs leading-relaxed text-charcoal-muted">{floatingCard.subtitle}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
