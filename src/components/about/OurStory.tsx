import Image from 'next/image'
import { about } from '@/data/content'

export default function OurStory() {
  const { heading, subheading, paragraphs, quote } = about.story
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          <div>
            <p className="font-dm text-xs font-medium uppercase tracking-widest text-brand-green">{heading}</p>
            <h2 className="mt-3 font-lora text-3xl font-normal leading-snug text-charcoal lg:text-4xl">{subheading}</h2>
            <div className="mt-6 flex flex-col gap-4 font-dm text-sm font-light leading-relaxed text-charcoal-muted">
              {paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <blockquote className="mt-8 border-l-4 border-brand-pink py-2 pl-5">
              <p className="font-lora text-base italic text-brand-pink">&ldquo;{quote}&rdquo;</p>
            </blockquote>
          </div>

          <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
            <div className="flex items-start justify-center gap-4 sm:gap-6">
              <div className="w-1/2 max-w-[280px] shrink-0 pt-12 sm:pt-16 lg:pt-20">
                <Image
                  src="/images/mentalhealth1.jpg"
                  alt="Collaboration and mentorship in a supportive setting"
                  width={560}
                  height={700}
                  className="aspect-[4/5] w-full rounded-2xl object-cover object-center shadow-lg ring-1 ring-charcoal/10"
                />
              </div>
              <div className="w-1/2 max-w-[280px] shrink-0 -translate-y-2 sm:-translate-y-3">
                <Image
                  src="/images/mentalhealth2.jpg"
                  alt="Mindfulness and emotional wellbeing outdoors"
                  width={560}
                  height={700}
                  className="aspect-[4/5] w-full rounded-2xl object-cover object-center shadow-lg ring-1 ring-charcoal/10"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
