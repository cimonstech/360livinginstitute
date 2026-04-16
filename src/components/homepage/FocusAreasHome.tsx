import { homepage } from '@/data/content'

export default function FocusAreasHome() {
  const { eyebrow, title, areas } = homepage.focusAreas
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-dm text-xs font-medium uppercase tracking-widest text-brand-green">{eyebrow}</p>
          <h2 className="mt-3 font-lora text-3xl font-normal text-charcoal lg:text-4xl">{title}</h2>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          {areas.map((area) => (
            <article
              key={area.title}
              className="rounded-2xl border border-brand-green/10 bg-warm-white p-8 transition-colors hover:border-brand-green/35"
            >
              <h3 className="font-lora text-xl font-medium text-charcoal">{area.title}</h3>
              <p className="mt-2 font-dm text-xs font-medium uppercase tracking-wide text-brand-green">
                {area.subtitle}
              </p>
              <ul className="mt-4 flex flex-col gap-2">
                {area.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2 font-dm text-sm font-light text-charcoal-muted">
                    <span className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-brand-green" aria-hidden />
                    {b}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
