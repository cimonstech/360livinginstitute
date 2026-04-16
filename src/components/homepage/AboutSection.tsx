import Link from 'next/link'
import { Sparkles } from 'lucide-react'
import { homepage, institute } from '@/data/content'
import PublicImageJpgFallback from '@/components/ui/PublicImageJpgFallback'

export default function AboutSection() {
  const { whoWeAre, aboutSnippet, aboutVisual } = homepage
  return (
    <section className="bg-white py-24">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-16 px-6 lg:grid-cols-2 lg:px-10">
        <div className="order-2 text-center lg:order-1 lg:text-left">
          <p className="font-dm text-xs font-medium uppercase tracking-widest text-brand-green">{whoWeAre.eyebrow}</p>
          <h2 className="mt-3 font-lora text-3xl font-normal leading-snug text-charcoal lg:text-4xl">
            {whoWeAre.titleLine1}{' '}
            <em className="font-lora italic text-brand-pink">{whoWeAre.titleEmphasis}</em>
          </h2>
          <div className="mx-auto mt-4 max-w-md font-dm text-sm font-light leading-relaxed text-charcoal-muted lg:mx-0">
            {whoWeAre.paragraphs.map((p) => (
              <p key={p} className="mb-4 last:mb-0">
                {p}
              </p>
            ))}
          </div>

          <p className="mx-auto mt-8 font-dm text-xs font-medium uppercase tracking-widest text-brand-pink lg:mx-0">
            {aboutSnippet.eyebrow}
          </p>
          <div className="mx-auto mt-3 max-w-md font-dm text-sm font-light leading-relaxed text-charcoal-muted lg:mx-0">
            {aboutSnippet.paragraphs.map((p) => (
              <p key={p} className="mb-4 last:mb-0">
                {p}
              </p>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
            <Link
              href="/about"
              className="rounded-full bg-brand-pink px-6 py-3 font-dm text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Learn More About Us
            </Link>
            <Link
              href={institute.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border-2 border-brand-green px-6 py-3 font-dm text-sm font-medium text-brand-green transition-colors hover:bg-brand-green-pale"
            >
              {institute.name} ↗
            </Link>
          </div>
        </div>

        <div className="order-1 w-full min-w-0 lg:order-2">
          <div className="relative overflow-hidden rounded-3xl shadow-lg ring-1 ring-charcoal/10">
            <div className="relative aspect-[4/3] w-full sm:aspect-[4/3]">
              <PublicImageJpgFallback
                basename="/images/togetherness"
                alt={aboutVisual.imageAlt}
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
            <div className="absolute bottom-4 left-4 right-4 max-w-sm rounded-2xl border border-white/60 bg-white/95 p-4 shadow-md backdrop-blur-sm sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-xs">
              <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-brand-green/15 text-brand-green">
                <Sparkles size={18} strokeWidth={1.75} aria-hidden />
              </div>
              <p className="font-lora text-base font-medium text-charcoal">{aboutVisual.cardTitle}</p>
              <p className="mt-1 font-dm text-xs leading-relaxed text-charcoal-muted">{aboutVisual.cardBody}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
