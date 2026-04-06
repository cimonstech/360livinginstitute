import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const memberAvatars = [1, 2, 3, 4, 5] as const

export default function Hero() {
  return (
    <section className="relative min-h-[92vh] w-full">
      <Image
        src="/images/african-psychologist.webp"
        alt="Professional psychological care and counselling"
        fill
        className="z-0 object-cover object-top"
        sizes="100vw"
        priority
      />
      <div
        className="absolute inset-0 z-10 bg-gradient-to-r from-black/70 via-black/40 to-transparent"
        aria-hidden
      />

      <div className="relative z-20 mx-auto flex h-full min-h-[92vh] max-w-7xl flex-col justify-between px-6 py-10 lg:px-10">
        <div className="max-w-2xl pt-8 lg:pt-12">
          <h1 className="font-lora text-4xl font-normal leading-tight text-white lg:text-6xl">
            Understanding Life
            <br />
            Transitions — The
            <br />
            <em className="font-lora text-brand-pink not-italic">Hidden Key</em> to
            <br />
            Well-being.
          </h1>
          <p className="mt-4 max-w-md font-dm text-sm font-light text-white/80">
            At 360 Living Institute, we help individuals, families, and organisations understand life transitions, build
            resilience, and thrive mentally, emotionally, socially and economically.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/book"
              className="inline-flex items-center gap-2 rounded-full bg-brand-pink px-6 py-3 font-dm text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Book a Session
              <ArrowRight size={14} aria-hidden />
            </Link>
            <Link
              href="/services"
              className="rounded-full border border-white/50 px-6 py-3 font-dm text-sm font-light text-white transition-colors hover:bg-white/10"
            >
              Explore Programs
            </Link>
          </div>
        </div>

        <div className="mb-8 flex flex-col items-stretch gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="inline-flex max-w-xs items-center gap-4 rounded-2xl bg-white px-5 py-4 shadow-sm">
            <div className="flex items-center pl-1">
              {memberAvatars.map((n, i) => (
                <div
                  key={n}
                  className={cnAvatar(i)}
                >
                  <Image
                    src={`/images/members/person${n}.webp`}
                    alt=""
                    width={32}
                    height={32}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
            <div>
              <p className="font-dm text-sm font-medium text-charcoal">500+</p>
              <p className="font-dm text-xs text-charcoal-muted">Lives supported globally</p>
            </div>
          </div>

          <div className="max-w-xs rounded-2xl bg-white px-5 py-4 shadow-sm lg:ml-auto">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-brand-pink-pale px-3 py-1 font-dm text-xs font-medium text-brand-pink">
                Therapy
              </span>
              <span className="rounded-full bg-brand-pink-pale px-3 py-1 font-dm text-xs font-medium text-brand-pink">
                Counselling
              </span>
              <span className="rounded-full bg-brand-pink-pale px-3 py-1 font-dm text-xs font-medium text-brand-pink">
                Life Transitions
              </span>
            </div>
            <p className="mt-2 font-dm text-xs text-charcoal-muted">Expert-led support for all stages of life</p>
            <p className="mt-1 font-dm text-xs font-medium text-charcoal-muted">Confidential & judgment-free</p>
          </div>
        </div>
      </div>
    </section>
  )
}

function cnAvatar(index: number) {
  const base =
    'relative h-8 w-8 overflow-hidden rounded-full border-2 border-white bg-charcoal-light'
  const overlap = index === 0 ? '' : '-ml-2'
  return `${base} ${overlap}`
}
