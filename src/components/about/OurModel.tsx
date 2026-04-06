import Image from 'next/image'

export default function OurModel() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          <div className="relative">
            <Image
              src="/images/portrait-handsome.avif"
              alt="Professional care at 360 Living Institute"
              width={800}
              height={920}
              className="h-[460px] w-full rounded-2xl object-cover object-top"
            />
            <div className="absolute bottom-4 right-4 max-w-[200px] rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
              <p className="font-dm text-xs text-charcoal-muted">Our Approach</p>
              <p className="mt-1 font-lora text-lg font-medium text-charcoal">RNCC Model</p>
              <p className="mt-1 font-dm text-xs leading-relaxed text-charcoal-muted">
                Three integrated counselling approaches
              </p>
            </div>
          </div>

          <div>
            <p className="font-dm text-xs font-medium uppercase tracking-widest text-brand-pink">Our Approach</p>
            <h2 className="mt-3 font-lora text-3xl font-normal leading-snug text-charcoal lg:text-4xl">
              The Integrated <em className="font-lora italic text-brand-pink">RNCC Model</em> for Whole-Person Healing
            </h2>
            <p className="mt-4 font-dm text-sm font-light leading-relaxed text-charcoal-muted">
              Utilizing our integrated RNCC model, we combine three counselling approaches to foster emotional
              intelligence, resilience, and purposeful living.
            </p>
            <p className="mt-4 font-dm text-sm font-light leading-relaxed text-charcoal-muted">
              At the Institute, we provide individuals and organisations with practical tools, insights, and systems to
              enhance well-being, productivity, and sustainable growth. We position mental health as a key driver for
              personal, organisational, and national development.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <span className="rounded-full bg-brand-pink-pale px-4 py-2 font-dm text-xs font-medium text-brand-pink">
                Relational Therapy
              </span>
              <span className="rounded-full bg-brand-green-pale px-4 py-2 font-dm text-xs font-medium text-brand-green">
                Narrative Counselling
              </span>
              <span className="rounded-full bg-charcoal-light px-4 py-2 font-dm text-xs font-medium text-charcoal">
                Cognitive Coaching
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
