import { homepage } from '@/data/content'

export default function ImpactGoals() {
  const { eyebrow, title, items } = homepage.impactGoals
  return (
    <section className="bg-charcoal py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-dm text-xs font-medium uppercase tracking-widest text-brand-green-light">{eyebrow}</p>
          <h2 className="mt-3 font-lora text-3xl font-normal text-white lg:text-4xl">{title}</h2>
        </div>
        <ul className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-3 sm:grid-cols-2">
          {items.map((item) => (
            <li
              key={item}
              className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-dm text-sm font-light text-white/80"
            >
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-green-light" aria-hidden />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
