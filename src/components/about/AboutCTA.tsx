import Image from 'next/image'
import Link from 'next/link'
import { about } from '@/data/content'

export default function AboutCTA() {
  const { eyebrow, title, intro, actions } = about.cta
  return (
    <section className="bg-charcoal py-24">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 lg:grid-cols-2 lg:px-10">
        <div>
          <p className="font-dm text-xs font-medium uppercase tracking-widest text-brand-green">{eyebrow}</p>
          <h2 className="mt-3 font-lora text-3xl font-normal leading-snug text-white lg:text-4xl">{title}</h2>
          <p className="mt-4 max-w-md font-dm text-sm font-light text-white/60">{intro}</p>
          <div className="mt-8 grid max-w-lg grid-cols-2 gap-3">
            {actions.map((a) => (
              <Link
                key={a.href}
                href={a.href}
                className="rounded-full border border-white/25 px-4 py-2.5 text-center font-dm text-sm text-white transition-colors hover:bg-white/10"
              >
                {a.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl">
          <Image
            src="/images/accessible-mental-health-support.jpg"
            alt="Accessible mental health support"
            width={800}
            height={800}
            className="h-[400px] w-full object-cover object-top"
          />
          <div className="absolute bottom-4 left-4 right-4 rounded-xl border border-white/20 bg-charcoal/70 p-5 backdrop-blur-sm">
            <p className="font-lora text-sm italic text-white">
              &ldquo;{about.story.quote}&rdquo;
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
