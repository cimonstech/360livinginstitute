import { homepage } from '@/data/content'
import PublicImageJpgFallback from '@/components/ui/PublicImageJpgFallback'

export default function OurApproach() {
  const { eyebrow, title, intro, bullets } = homepage.approach
  return (
    <section className="relative overflow-hidden border-y border-brand-green/10 py-24">
      <div className="pointer-events-none absolute inset-0">
        <PublicImageJpgFallback
          basename="/images/helpinghand"
          alt=""
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority={false}
        />
      </div>
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-charcoal/60 via-charcoal/45 to-charcoal/55"
        aria-hidden
      />
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-dm text-xs font-medium uppercase tracking-widest text-white/85">{eyebrow}</p>
          <h2 className="mt-3 font-lora text-3xl font-normal text-white lg:text-4xl">{title}</h2>
          <p className="mt-4 font-dm text-sm font-light leading-relaxed text-white/90">{intro}</p>
        </div>
        <ul className="mx-auto mt-10 flex max-w-2xl flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
          {bullets.map((b) => (
            <li
              key={b}
              className="rounded-full border border-white/40 bg-white/15 px-4 py-2 font-dm text-sm text-white backdrop-blur-sm transition-colors duration-200 hover:border-brand-green hover:bg-brand-green hover:text-white"
            >
              {b}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
