import { Heart, ShieldCheck, Sprout } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { about } from '@/data/content'

const icons: LucideIcon[] = [Heart, ShieldCheck, Sprout]

export default function OurValues() {
  const { eyebrow, title, intro } = about.beliefsSection
  return (
    <section className="bg-warm-cream py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <p className="font-dm text-xs font-medium uppercase tracking-widest text-brand-green">{eyebrow}</p>
        <h2 className="mt-3 font-lora text-3xl font-normal text-charcoal lg:text-4xl">{title}</h2>
        <p className="mb-12 mt-3 max-w-xl font-dm text-sm font-light text-charcoal-muted">{intro}</p>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {about.beliefs.map(({ title: beliefTitle, desc }, i) => {
            const Icon = icons[i] ?? Heart
            const tone = i % 2 === 0 ? 'pink' : 'green'
            const isMiddle = i === 1
            return (
              <article
                key={beliefTitle}
                className={
                  isMiddle
                    ? 'rounded-2xl border border-brand-green/20 bg-brand-green p-6 shadow-md transition-colors'
                    : 'rounded-2xl border border-gray-100 bg-white p-6 transition-colors hover:border-brand-pink'
                }
              >
                <div
                  className={cn(
                    'mb-4 flex h-10 w-10 items-center justify-center rounded-full',
                    isMiddle
                      ? 'bg-white/20'
                      : tone === 'pink'
                        ? 'bg-brand-pink-pale'
                        : 'bg-brand-green-pale'
                  )}
                >
                  <Icon
                    className={
                      isMiddle ? 'text-white' : tone === 'pink' ? 'text-brand-pink' : 'text-brand-green'
                    }
                    size={18}
                    strokeWidth={1.75}
                    aria-hidden
                  />
                </div>
                <h3
                  className={
                    isMiddle
                      ? 'mb-2 font-lora text-base font-medium text-white'
                      : 'mb-2 font-lora text-base font-medium text-charcoal'
                  }
                >
                  {beliefTitle}
                </h3>
                <p
                  className={
                    isMiddle
                      ? 'font-dm text-xs font-light leading-relaxed text-white/90'
                      : 'font-dm text-xs font-light leading-relaxed text-charcoal-muted'
                  }
                >
                  {desc}
                </p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
