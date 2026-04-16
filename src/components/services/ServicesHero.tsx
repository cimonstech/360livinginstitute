import Image from 'next/image'
import { programsPage } from '@/data/content'

export default function ServicesHero() {
  const { eyebrow, titleLines, intro } = programsPage.hero
  return (
    <section className="relative overflow-hidden py-20">
      <Image
        src="/images/structured-programs.jpg"
        alt="Structured programmes overview"
        fill
        className="object-cover object-center"
        sizes="100vw"
        priority
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-white via-white/88 to-white/25 lg:via-white/80 lg:to-white/15"
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-charcoal/10" aria-hidden />
      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-end gap-12 px-6 lg:grid-cols-2 lg:px-10">
        <div className="relative max-w-xl rounded-2xl border border-white/50 bg-white/82 p-6 shadow-md shadow-charcoal/5 backdrop-blur-md sm:p-7 lg:p-8">
          <p className="font-dm text-xs font-medium uppercase tracking-widest text-brand-green">{eyebrow}</p>
          <h1 className="mt-4 font-lora text-4xl font-normal leading-tight tracking-tight text-charcoal lg:max-w-xl lg:text-5xl">
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
          <p className="mt-5 max-w-lg font-dm text-sm font-normal leading-relaxed text-charcoal/90 lg:text-[0.95rem]">
            {intro}
          </p>
        </div>
      </div>
    </section>
  )
}
