import Link from 'next/link'
import { ArrowRight, Calendar, Lock, Heart } from 'lucide-react'

export default function ServicesCTA() {
  return (
    <section className="bg-brand-pink-pale py-24">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 lg:grid-cols-2 lg:px-10">
        <div>
          <p className="font-dm text-xs font-medium uppercase tracking-widest text-brand-pink">Get Started</p>
          <h2 className="mt-3 font-lora text-3xl font-normal leading-snug text-charcoal lg:text-4xl">
            Not sure where to <em className="font-lora italic text-brand-pink">begin?</em> We&apos;ll guide you.
          </h2>
          <p className="mt-4 max-w-md font-dm text-sm font-light leading-relaxed text-charcoal-muted">
            Every journey is different. Reach out and we&apos;ll match you with the right service, therapist, and program
            for your specific needs and life stage.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/book"
              className="inline-flex items-center gap-2 rounded-full bg-brand-pink px-6 py-3 font-dm text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Book a Free Consultation
              <ArrowRight size={14} aria-hidden />
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-charcoal/25 px-6 py-3 font-dm text-sm font-normal text-charcoal transition-colors hover:border-brand-pink/40"
            >
              Speak to Us First
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-5">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-brand-pink-pale">
              <Calendar className="text-brand-pink" size={18} strokeWidth={1.75} aria-hidden />
            </div>
            <div>
              <p className="font-dm text-sm font-medium text-charcoal">Easy Booking</p>
              <p className="mt-1 font-dm text-xs leading-relaxed text-charcoal-muted">
                Schedule a session online in minutes. No referral needed.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-5">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-brand-green-pale">
              <Lock className="text-brand-green" size={18} strokeWidth={1.75} aria-hidden />
            </div>
            <div>
              <p className="font-dm text-sm font-medium text-charcoal">Fully Confidential</p>
              <p className="mt-1 font-dm text-xs leading-relaxed text-charcoal-muted">
                Everything you share stays between you and your therapist. Always.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-5">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-brand-pink-pale">
              <Heart className="text-brand-pink" size={18} strokeWidth={1.75} aria-hidden />
            </div>
            <div>
              <p className="font-dm text-sm font-medium text-charcoal">Personalised Support</p>
              <p className="mt-1 font-dm text-xs leading-relaxed text-charcoal-muted">
                We tailor every session and program to your unique needs and life stage.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
