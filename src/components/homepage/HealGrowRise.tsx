import { Heart, Sprout, Rocket } from 'lucide-react'
import { homepage } from '@/data/content'

const pillarIcons = [Heart, Sprout, Rocket] as const

export default function HealGrowRise() {
  const { eyebrow, title, pillars } = homepage.healGrowRise
  return (
    <section className="bg-gradient-to-b from-brand-green-pale/40 via-white to-brand-green-pale/30 py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-dm text-xs font-medium uppercase tracking-widest text-brand-green">{eyebrow}</p>
          <h2 className="mt-3 font-lora text-3xl font-normal text-charcoal lg:text-4xl">{title}</h2>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          {pillars.map((p, i) => {
            const Icon = pillarIcons[i] ?? Heart
            const isGrow = i === 1
            return (
              <article
                key={p.title}
                className={
                  isGrow
                    ? 'rounded-2xl border border-brand-green/20 bg-brand-green p-8 shadow-md transition-colors'
                    : 'rounded-2xl border border-brand-green/15 bg-white p-8 shadow-sm transition-colors hover:border-brand-green/40'
                }
              >
                <div
                  className={
                    isGrow
                      ? 'mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-white'
                      : 'mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-brand-green/10 text-brand-green'
                  }
                >
                  <Icon size={22} strokeWidth={1.75} aria-hidden />
                </div>
                <h3
                  className={
                    isGrow
                      ? 'font-lora text-xl font-medium text-white'
                      : 'font-lora text-xl font-medium text-brand-green'
                  }
                >
                  {p.title}
                </h3>
                <p
                  className={
                    isGrow
                      ? 'mt-4 font-dm text-sm font-light leading-relaxed text-white/90'
                      : 'mt-4 font-dm text-sm font-light leading-relaxed text-charcoal-muted'
                  }
                >
                  {p.body}
                </p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
