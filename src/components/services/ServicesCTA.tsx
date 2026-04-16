import Link from 'next/link'
import { ArrowRight, HeartHandshake, Mail, Sparkles } from 'lucide-react'
import { programsPage } from '@/data/content'

export default function ServicesCTA() {
  const { eyebrow, title, intro, primary, secondary, cards } = programsPage.cta
  const icons = [Sparkles, HeartHandshake, Mail] as const
  return (
    <section className="bg-brand-pink-pale py-24">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 lg:grid-cols-2 lg:px-10">
        <div>
          <p className="font-dm text-xs font-medium uppercase tracking-widest text-brand-green">{eyebrow}</p>
          <h2 className="mt-3 font-lora text-3xl font-normal leading-snug text-charcoal lg:text-4xl">{title}</h2>
          <p className="mt-4 max-w-md font-dm text-sm font-light leading-relaxed text-charcoal-muted">{intro}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={primary.href}
              className="inline-flex items-center gap-2 rounded-full bg-brand-pink px-6 py-3 font-dm text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              {primary.label}
              <ArrowRight size={14} aria-hidden />
            </Link>
            <Link
              href={secondary.href}
              className="rounded-full border border-charcoal/25 px-6 py-3 font-dm text-sm font-normal text-charcoal transition-colors hover:border-brand-pink/40"
            >
              {secondary.label}
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {cards.map((card, i) => {
            const Icon = icons[i] ?? Sparkles
            return (
              <div key={card.title} className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-5">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-brand-pink-pale">
                  <Icon className="text-brand-pink" size={18} strokeWidth={1.75} aria-hidden />
                </div>
                <div>
                  <p className="font-dm text-sm font-medium text-charcoal">{card.title}</p>
                  <p className="mt-1 font-dm text-xs leading-relaxed text-charcoal-muted">{card.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
