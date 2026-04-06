import Link from 'next/link'

export default function EventsCTA() {
  return (
    <section className="bg-brand-pink-pale py-24">
      <div className="mx-auto max-w-7xl px-6 text-center lg:px-10">
        <p className="font-dm text-xs font-medium uppercase tracking-widest text-brand-pink">Bring Us To You</p>
        <h2 className="mx-auto mt-3 max-w-2xl font-lora text-3xl font-normal text-charcoal lg:text-4xl">
          Want us to speak at your event or run a program for your organisation?
        </h2>
        <p className="mx-auto mt-4 max-w-lg font-dm text-sm font-light text-charcoal-muted">
          We offer keynote speaking, corporate wellness workshops, school programs, and custom events. Let&apos;s create
          something meaningful together.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/contact#speak"
            className="rounded-full bg-brand-pink px-7 py-3 font-dm text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Invite Us to Speak
          </Link>
          <Link
            href="/contact#sponsor"
            className="rounded-full border border-charcoal/25 px-7 py-3 font-dm text-sm font-normal text-charcoal transition-colors hover:border-brand-pink/40"
          >
            Sponsor a Program
          </Link>
        </div>
      </div>
    </section>
  )
}
