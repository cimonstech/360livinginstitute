import { Target, Globe } from 'lucide-react'

export default function MissionVision() {
  return (
    <section className="bg-charcoal py-24">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 lg:grid-cols-2 lg:px-10">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-10">
          <p className="font-dm text-xs font-medium uppercase tracking-widest text-brand-pink">Our Mission</p>
          <h2 className="mt-2 font-lora text-2xl font-normal leading-snug text-white">
            Accessible Psychological Support for All
          </h2>
          <div className="my-6 border-t border-white/10" />
          <p className="font-dm text-sm font-light leading-relaxed text-white/70">
            To offer accessible psychological support, insights, and tools that assist individuals, families, and
            organisations in effectively navigating life.
          </p>
          <Target className="mt-6 text-brand-pink" size={32} strokeWidth={1.25} aria-hidden />
        </div>

        <div className="rounded-2xl bg-brand-pink p-10">
          <p className="font-dm text-xs font-medium uppercase tracking-widest text-white">Our Vision</p>
          <h2 className="mt-2 font-lora text-2xl font-normal leading-snug text-white">
            A Leading Global Center for Life Transition Psychology
          </h2>
          <div className="my-6 border-t border-white/30" />
          <p className="font-dm text-sm font-light leading-relaxed text-white/80">
            To become a leading global center for life transition psychology, counselling, and human development.
          </p>
          <Globe className="mt-6 text-white/60" size={32} strokeWidth={1.25} aria-hidden />
        </div>
      </div>
    </section>
  )
}
