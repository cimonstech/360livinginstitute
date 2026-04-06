import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const services = [
  {
    slug: 'individual-counselling',
    title: 'Individual Counselling',
    summary: 'Support for personal clarity, healing, and growth.',
  },
  {
    slug: 'corporate-mental-health',
    title: 'Corporate Mental Health & Wellness',
    summary: 'Building mentally healthy and high-performing workplaces.',
  },
  {
    slug: 'entrepreneur-wellness',
    title: 'Entrepreneur Wellness & Performance',
    summary: 'Specialised support for founders and business leaders.',
  },
  {
    slug: 'life-transition-counselling',
    title: 'Life Transition Counselling',
    summary: "Guiding you through life's turning points.",
  },
  {
    slug: 'family-relationship-counselling',
    title: 'Family & Relationship Counselling',
    summary: 'Enhancing relationships and promoting harmony.',
  },
  {
    slug: 'psychoeducation-training',
    title: 'Psychoeducation & Training',
    summary: 'Equipping individuals and groups with mental health knowledge.',
  },
]

export default function Services() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mb-14 grid grid-cols-1 items-end gap-8 lg:mb-16 lg:grid-cols-2">
          <div>
            <p className="font-dm text-xs font-medium uppercase tracking-widest text-brand-pink">Our Services</p>
            <h2 className="mt-3 font-lora text-3xl font-normal text-charcoal lg:text-4xl">What We Do</h2>
            <p className="mt-4 max-w-xl font-dm text-sm font-light leading-relaxed text-charcoal-muted">
              Helping you understand your life so you can transform it. We combine counselling psychology, life
              transition insight, and innovative mental health approaches.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-start gap-3 lg:justify-end">
            <Link
              href="/book"
              className="inline-flex items-center gap-2 rounded-full bg-brand-pink px-5 py-2.5 font-dm text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Get Started
              <ArrowRight size={14} aria-hidden />
            </Link>
            <Link
              href="/book"
              className="font-dm text-sm text-charcoal-muted transition-colors hover:text-brand-pink"
            >
              Book a Session →
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <article
              key={service.slug}
              className="flex flex-col rounded-2xl border border-gray-100 bg-white p-6 transition-all hover:border-brand-pink hover:shadow-sm"
            >
              <h3 className="mb-2 font-lora text-lg font-medium text-charcoal">{service.title}</h3>
              <p className="mb-4 flex-1 font-dm text-sm font-light leading-relaxed text-charcoal-muted">
                {service.summary}
              </p>
              <Link
                href={`/services/${service.slug}`}
                className="font-dm text-sm font-medium text-brand-pink transition-colors hover:underline"
              >
                Learn more →
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
