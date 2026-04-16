import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { company, homepage } from '@/data/content'

export default function CTASection() {
  const { eyebrow, title, intro, primaryCta, phoneNotePrefix } = homepage.ctaSection
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <p className="font-dm text-xs font-medium uppercase tracking-widest text-brand-green">{eyebrow}</p>
        <div className="mt-4 max-w-xl">
          <h2 className="font-lora text-3xl font-normal text-charcoal lg:text-4xl">{title}</h2>
          <p className="mt-3 font-dm text-sm font-light text-charcoal-muted">{intro}</p>
          <Link
            href={primaryCta.href}
            className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-pink px-8 py-3 font-dm text-sm font-medium text-white transition-opacity hover:opacity-90 sm:w-auto"
          >
            {primaryCta.label}
            <ArrowRight size={14} aria-hidden />
          </Link>
          <p className="mt-4 font-dm text-xs text-charcoal-muted">
            {phoneNotePrefix}{' '}
            <a href={`tel:${company.phone.replace(/\s/g, '')}`} className="font-medium text-charcoal hover:text-brand-green">
              {company.phoneDisplay}
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
