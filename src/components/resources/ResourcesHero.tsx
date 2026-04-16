import { resourcesPage } from '@/data/content'

export default function ResourcesHero() {
  const r = resourcesPage
  return (
    <section className="bg-warm-cream py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="max-w-3xl">
          <p className="font-dm text-xs font-medium uppercase tracking-widest text-brand-pink">{r.eyebrow}</p>
          <h1 className="mt-4 font-lora text-4xl font-normal text-charcoal lg:text-5xl">{r.title}</h1>
          <p className="mt-4 font-dm text-sm font-light leading-relaxed text-charcoal-muted">{r.intro}</p>
        </div>
      </div>
    </section>
  )
}

