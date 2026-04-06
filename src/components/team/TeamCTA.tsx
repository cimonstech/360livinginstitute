import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function TeamCTA() {
  return (
    <section className="bg-brand-pink-pale py-24">
      <div className="mx-auto max-w-7xl px-6 text-center lg:px-10">
        <p className="font-dm text-xs font-medium uppercase tracking-widest text-brand-pink">Join The Journey</p>
        <h2 className="mx-auto mt-3 max-w-2xl font-lora text-3xl font-normal leading-snug text-charcoal lg:text-4xl">
          Ready to work with a practitioner who truly <em className="font-lora italic text-brand-pink">understands</em>{' '}
          you?
        </h2>
        <p className="mx-auto mt-4 max-w-lg font-dm text-sm font-light leading-relaxed text-charcoal-muted">
          No referral needed. Book a session today and we&apos;ll match you with the right practitioner for your specific
          needs and life stage.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/book"
            className="inline-flex items-center gap-2 rounded-full bg-brand-pink px-7 py-3 font-dm text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Book a Session
            <ArrowRight size={14} aria-hidden />
          </Link>
          <Link
            href="/contact"
            className="rounded-full border border-charcoal/25 px-7 py-3 font-dm text-sm font-normal text-charcoal transition-colors hover:border-brand-pink/40"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  )
}
