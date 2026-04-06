import Image from 'next/image'
import Link from 'next/link'

export default function AboutCTA() {
  return (
    <section className="bg-charcoal py-24">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 lg:grid-cols-2 lg:px-10">
        <div>
          <p className="font-dm text-xs font-medium uppercase tracking-widest text-brand-pink">Work With Us</p>
          <h2 className="mt-3 font-lora text-3xl font-normal leading-snug text-white lg:text-4xl">
            Your next level begins with <em className="font-lora italic text-brand-pink">understanding</em> your current
            season.
          </h2>
          <p className="mt-4 max-w-md font-dm text-sm font-light text-white/60">
            Take the first step toward clarity and transformation. No referral needed — just reach out.
          </p>
          <div className="mt-8 grid max-w-sm grid-cols-2 gap-3">
            <Link
              href="/book"
              className="rounded-full bg-brand-pink px-5 py-2.5 text-center font-dm text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Book a Session
            </Link>
            <Link
              href="/contact#partner"
              className="rounded-full border border-white px-5 py-2.5 text-center font-dm text-sm font-normal text-white transition-colors hover:bg-white/10"
            >
              Partner With Us
            </Link>
            <Link
              href="/contact#speak"
              className="rounded-full border border-white px-5 py-2.5 text-center font-dm text-sm font-normal text-white transition-colors hover:bg-white/10"
            >
              Invite Us to Speak
            </Link>
            <Link
              href="/contact#sponsor"
              className="rounded-full border border-white px-5 py-2.5 text-center font-dm text-sm font-normal text-white transition-colors hover:bg-white/10"
            >
              Sponsor a Program
            </Link>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl">
          <Image
            src="/images/happy-young-man.jpg"
            alt="Wellness and care at 360 Living Institute"
            width={800}
            height={800}
            className="h-[400px] w-full object-cover object-top"
          />
          <div className="absolute bottom-4 left-4 right-4 rounded-xl border border-white/20 bg-white/10 p-5 backdrop-blur-sm">
            <p className="font-lora text-sm italic text-white">
              &ldquo;At 360 Living Institute, transformation is not an event; it is a process we walk with you, step by
              step.&rdquo;
            </p>
            <p className="mt-3 font-dm text-xs text-white/60">— Selasi Doku, Executive Director</p>
          </div>
        </div>
      </div>
    </section>
  )
}
