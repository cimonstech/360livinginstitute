import Link from 'next/link'
import { Mail, Phone, MapPin, Calendar, Briefcase, Mic, Gift } from 'lucide-react'

const intents = [
  {
    href: '/book',
    Icon: Calendar,
    tone: 'pink' as const,
    title: 'Book a Session',
    desc: 'Schedule individual or couples counselling',
  },
  {
    href: '/contact#partner',
    Icon: Briefcase,
    tone: 'green' as const,
    title: 'Partner With Us',
    desc: 'Corporate wellness & organisational programs',
  },
  {
    href: '/contact#speak',
    Icon: Mic,
    tone: 'pink' as const,
    title: 'Invite Us to Speak',
    desc: 'Keynotes, panels & event facilitation',
  },
  {
    href: '/contact#sponsor',
    Icon: Gift,
    tone: 'green' as const,
    title: 'Sponsor a Program',
    desc: 'Support community mental health initiatives',
  },
]

export default function ContactHero() {
  return (
    <section className="bg-charcoal py-20">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 lg:grid-cols-2 lg:px-10">
        <div>
          <p className="font-dm text-xs font-medium uppercase tracking-widest text-brand-pink-light">Contact</p>
          <h1 className="mt-4 font-lora text-4xl font-normal leading-tight text-white lg:text-5xl">
            Let&apos;s help you or
            <br />
            your <em className="font-lora italic text-brand-pink">organisation</em>
          </h1>
          <p className="mt-5 max-w-md font-dm text-sm font-light leading-relaxed text-white/70">
            Whether you&apos;re ready to book a session, explore a partnership, invite us to speak, or simply have a
            question — we&apos;d love to hear from you.
          </p>
          <div className="mt-8 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Mail className="text-brand-pink" size={16} strokeWidth={1.75} aria-hidden />
              <a href="mailto:info@360livinginstitute.com" className="font-dm text-sm text-white/80 hover:text-white">
                info@360livinginstitute.com
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="text-brand-pink" size={16} strokeWidth={1.75} aria-hidden />
              <a href="tel:0538045503" className="font-dm text-sm text-white/80 hover:text-white">
                0538045503
              </a>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="text-brand-pink" size={16} strokeWidth={1.75} aria-hidden />
              <span className="font-dm text-sm text-white/80">31 Awudome Roundabout, Awudome, Accra</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {intents.map(({ href, Icon, tone, title, desc }) => (
            <Link
              key={href}
              href={href}
              className="rounded-2xl border border-white/10 bg-white/5 p-5 transition-colors hover:bg-white/10"
            >
              <div
                className={
                  tone === 'pink'
                    ? 'mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-brand-pink/20'
                    : 'mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-brand-green/20'
                }
              >
                <Icon
                  className={tone === 'pink' ? 'text-brand-pink-light' : 'text-brand-green-light'}
                  size={18}
                  strokeWidth={1.75}
                  aria-hidden
                />
              </div>
              <p className="font-dm text-sm font-medium text-white">{title}</p>
              <p className="mt-1 font-dm text-xs text-white/50">{desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
