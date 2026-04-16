import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { homepage } from '@/data/content'

export default function Services() {
  const { eyebrow, title, intro, items, ctas } = homepage.programsPreview
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mb-14 grid grid-cols-1 items-end gap-8 lg:mb-16 lg:grid-cols-2">
          <div>
            <p className="font-dm text-xs font-medium uppercase tracking-widest text-brand-green">{eyebrow}</p>
            <h2 className="mt-3 font-lora text-3xl font-normal text-charcoal lg:text-4xl">{title}</h2>
            <p className="mt-4 max-w-xl font-dm text-sm font-light leading-relaxed text-charcoal-muted">{intro}</p>
          </div>
          <div className="flex flex-wrap items-center justify-start gap-3 lg:justify-end">
            {ctas.map((cta, i) => (
              <Link
                key={cta.href}
                href={cta.href}
                className={
                  i === 0
                    ? 'inline-flex items-center gap-2 rounded-full bg-brand-pink px-5 py-2.5 font-dm text-sm font-medium text-white transition-opacity hover:opacity-90'
                    : 'font-dm text-sm font-medium text-brand-green transition-colors hover:text-brand-green/80'
                }
              >
                {cta.label}
                {i === 0 ? <ArrowRight size={14} aria-hidden /> : <span aria-hidden> →</span>}
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((program) => (
            <article
              key={program.slug}
              className="group flex flex-col rounded-2xl border border-gray-100 bg-white p-6 transition-all duration-200 hover:border-brand-green hover:bg-brand-green hover:shadow-md"
            >
              <h3 className="mb-2 font-lora text-lg font-medium text-charcoal transition-colors group-hover:text-white">
                {program.title}
              </h3>
              <p className="mb-4 flex-1 font-dm text-sm font-light leading-relaxed text-charcoal-muted transition-colors group-hover:text-white/90">
                {program.summary}
              </p>
              <Link
                href={`/programs#${program.slug}`}
                className="font-dm text-sm font-medium text-brand-green transition-colors group-hover:text-white group-hover:underline"
              >
                Learn more →
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
