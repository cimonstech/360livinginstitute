import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { homepage } from '@/data/content'

export default function PurposeSection() {
  const { eyebrow, body, ctas } = homepage.purpose
  return (
    <section className="bg-warm-cream py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-dm text-xs font-medium uppercase tracking-widest text-brand-green">{eyebrow}</p>
          <p className="mt-4 font-dm text-base font-light leading-relaxed text-charcoal-muted">{body}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {ctas.map((cta, i) => (
              <Link
                key={cta.href}
                href={cta.href}
                className={
                  i === 0
                    ? 'inline-flex items-center gap-2 rounded-full bg-brand-pink px-6 py-3 font-dm text-sm font-medium text-white transition-opacity hover:opacity-90'
                    : 'rounded-full border-2 border-brand-green px-6 py-3 font-dm text-sm font-medium text-brand-green transition-colors hover:bg-brand-green-pale'
                }
              >
                {cta.label}
                {i === 0 ? <ArrowRight size={14} aria-hidden /> : null}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
