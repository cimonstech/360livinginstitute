import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { about } from '@/data/content'

export default function TeamPreview() {
  const { eyebrow, title, body, cta } = about.institutePartnership
  return (
    <section className="bg-brand-pink-pale py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <p className="font-dm text-xs font-medium uppercase tracking-widest text-brand-green">{eyebrow}</p>
        <h2 className="mt-3 font-lora text-3xl font-normal text-charcoal lg:text-4xl">{title}</h2>
        <p className="mb-10 mt-3 max-w-xl font-dm text-sm font-light text-charcoal-muted">{body}</p>
        <Link
          href={cta.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-brand-pink px-6 py-3 font-dm text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          {cta.label}
          <ArrowRight size={14} aria-hidden />
        </Link>
      </div>
    </section>
  )
}
