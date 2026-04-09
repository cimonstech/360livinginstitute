import Image from 'next/image'
import Link from 'next/link'
import { Mail, Phone, MapPin } from 'lucide-react'

export default function AboutSection() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-16 px-6 lg:grid-cols-2 lg:px-10">
        <div className="order-2 text-center lg:order-1 lg:text-left">
          <p className="font-dm text-xs font-medium uppercase tracking-widest text-brand-pink">Who We Are</p>
          <h2 className="mt-3 font-lora text-3xl font-normal leading-snug text-charcoal lg:text-4xl">
            People don&apos;t just need solutions, they need{' '}
            <em className="font-lora italic text-brand-pink">understanding.</em>
          </h2>
          <p className="mx-auto mt-4 max-w-md font-dm text-sm font-light leading-relaxed text-charcoal-muted lg:mx-0">
            <strong className="font-semibold text-charcoal">360 Living Institute</strong> is a center for professional counselling, mental well-being, and personal development institute committed to transforming lives, by offering personalized psychological insight services to individuals, Teams of organisations, communities and families through evidence-based psychological practice, life strategies, and human-centered interventions.
            <br />
            <br />
            Rooted in counselling psychology and preventive mental health, the Institute provides holistic, culturally responsive, and ethically grounded services that address emotional well-being, life transitions, leadership effectiveness, and sustainable personal growth.
            <br />
            <br />
            At 360 Living Institute, we believe that{' '}
            <strong className="font-semibold text-charcoal">
              mental well-being is foundational to productivity, healthy relationships, leadership, and national development
            </strong>
            . Our work integrates psychological science, practical life skills, and value-based approaches to help individuals and institutions thrive across all stages of life.
          </p>

          <div className="mx-auto mt-6 flex max-w-md flex-col gap-2 lg:mx-0">
            <div className="flex items-center justify-center gap-2 font-dm text-sm text-charcoal-muted lg:justify-start">
              <Mail className="h-3.5 w-3.5 flex-shrink-0 text-brand-green" strokeWidth={1.75} aria-hidden />
              <a href="mailto:info@360livinginstitute.com" className="transition-colors hover:text-charcoal">
                info@360livinginstitute.com
              </a>
            </div>
            <div className="flex items-center justify-center gap-2 font-dm text-sm text-charcoal-muted lg:justify-start">
              <Phone className="h-3.5 w-3.5 flex-shrink-0 text-brand-green" strokeWidth={1.75} aria-hidden />
              <a href="tel:0538045503" className="transition-colors hover:text-charcoal">
                0538045503
              </a>
            </div>
            <div className="flex items-center justify-center gap-2 font-dm text-sm text-charcoal-muted lg:justify-start">
              <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-brand-green" strokeWidth={1.75} aria-hidden />
              <span>31 Awudome Roundabout, Awudome, Accra</span>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
            <Link
              href="/about"
              className="rounded-full bg-brand-pink px-6 py-3 font-dm text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Our Full Story
            </Link>
            <Link
              href="/team"
              className="rounded-full border border-charcoal/25 px-6 py-3 font-dm text-sm font-normal text-charcoal transition-colors hover:border-brand-pink/40"
            >
              Meet The Board Members
            </Link>
          </div>
        </div>

        <div className="order-1 flex w-full min-w-0 flex-col gap-4 lg:order-2">
          <div className="relative hidden h-64 w-full overflow-hidden rounded-2xl lg:block">
            <Image
              src="/ladyyy.webp"
              alt="Welcoming mental health professional"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>
          <div className="relative h-[min(22rem,52vw)] w-full shrink-0 overflow-hidden rounded-2xl bg-charcoal-light lg:h-52">
            <Image
              src="/anxietypensive2-scaled.jpg"
              alt="Reflective moment — supportive mental health care"
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 50vw"
              unoptimized
            />
          </div>
        </div>
      </div>
    </section>
  )
}
