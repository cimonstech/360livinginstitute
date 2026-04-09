export default function MissionVision() {
  return (
    <section className="bg-charcoal py-24">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 lg:grid-cols-2 lg:px-10">
        <div className="rounded-2xl bg-brand-pink p-10">
          <p className="font-dm text-2xl font-semibold uppercase tracking-widest text-white">Our Vision</p>
          <div className="my-6 border-t border-white/30" />
          <p className="font-dm text-sm font-light leading-relaxed text-white/80">
            To be a <strong className="font-semibold text-white">leading mental well-being and counselling institute</strong>, influencing individuals,
            organisations, and public systems toward healthier minds, resilient lives, and purposeful societies.
          </p>
        </div>

        <div className="rounded-2xl bg-brand-green p-10">
          <p className="font-dm text-2xl font-semibold uppercase tracking-widest text-white">Our Mission</p>
          <div className="my-6 border-t border-white/25" />
          <p className="font-dm text-sm font-light leading-relaxed text-white/90">
            To deliver{' '}
            <strong className="font-semibold text-white">
              accessible, ethical, and impactful counselling and mental well-being solutions
            </strong>{' '}
            that empower people to understand themselves, navigate life transitions effectively, and live balanced,
            productive lives.
          </p>
        </div>
      </div>
    </section>
  )
}
