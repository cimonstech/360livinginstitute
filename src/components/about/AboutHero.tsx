import Image from 'next/image'
import Link from 'next/link'
import { Users } from 'lucide-react'

export default function AboutHero() {
  return (
    <section className="bg-warm-cream">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 py-24 lg:grid-cols-2 lg:px-10">
        <div>
          <p className="font-dm text-xs font-medium uppercase tracking-widest text-brand-pink">About Us</p>
          <h1 className="mt-4 font-lora text-4xl font-normal leading-tight tracking-tight text-charcoal lg:text-5xl">
            A Center for
            <br />
            Psychological
            <br />
            Insight &amp; <em className="font-lora italic text-brand-pink">Life Development</em>
          </h1>
          <p className="mt-6 max-w-lg font-dm text-base font-light leading-relaxed text-charcoal-muted">
            <strong className="font-semibold text-charcoal">360 Living Institute</strong> is a center for professional
            counselling, mental well-being, and personal development institute committed to transforming lives, by
            offering personalized psychological insight services to individuals, Teams of organisations, communities and
            families through evidence-based psychological practice, life strategies, and human-centered interventions.
            <br />
            <br />
            Rooted in counselling psychology and preventive mental health, the Institute provides holistic, culturally
            responsive, and ethically grounded services that address emotional well-being, life transitions, leadership
            effectiveness, and sustainable personal growth.
            <br />
            <br />
            At 360 Living Institute, we believe that{' '}
            <strong className="font-semibold text-charcoal">
              mental well-being is foundational to productivity, healthy relationships, leadership, and national
              development
            </strong>
            . Our work integrates psychological science, practical life skills, and value-based approaches to help
            individuals and institutions thrive across all stages of life.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/book"
              className="rounded-full bg-brand-pink px-6 py-3 font-dm text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Book a Session
            </Link>
            <Link
              href="/services"
              className="rounded-full border border-charcoal/25 px-6 py-3 font-dm text-sm font-normal text-charcoal transition-colors hover:border-brand-pink/40"
            >
              Our Services
            </Link>
          </div>
        </div>

        <div className="relative">
          <Image
            src="/images/portrait-gorgeous.avif"
            alt="360 Living Institute"
            width={800}
            height={960}
            className="h-[480px] w-full rounded-2xl object-cover object-top"
          />
          {/* <div className="absolute right-4 top-4 rounded-full border border-brand-green-light bg-white px-3 py-1.5 text-xs font-medium text-brand-green shadow-sm">
            Est. 2020
          </div> */}
          <div className="absolute bottom-4 left-4 flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <Users className="text-brand-green" size={18} strokeWidth={1.75} aria-hidden />
            <div>
              <p className="font-lora text-2xl font-medium text-brand-pink">500+</p>
              <p className="font-dm text-xs text-charcoal-muted">Lives Impacted</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
