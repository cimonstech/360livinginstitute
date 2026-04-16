import { about } from '@/data/content'

export default function MissionVision() {
  const { vision, mission } = about
  return (
    <section id="mission" className="scroll-mt-28 bg-charcoal py-24">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 lg:grid-cols-2 lg:px-10">
        <div className="rounded-2xl bg-brand-pink p-10">
          <p className="font-dm text-2xl font-semibold uppercase tracking-widest text-white">Our Vision</p>
          <div className="my-6 border-t border-white/30" />
          <p className="font-dm text-sm font-light leading-relaxed text-white/90">{vision}</p>
        </div>

        <div className="rounded-2xl bg-brand-green p-10">
          <p className="font-dm text-2xl font-semibold uppercase tracking-widest text-white">Our Mission</p>
          <div className="my-6 border-t border-white/25" />
          <p className="font-dm text-sm font-light leading-relaxed text-white/90">{mission}</p>
        </div>
      </div>
    </section>
  )
}
