import Link from 'next/link'
import { Mail, Phone, MapPin, HeartHandshake, HandHelping, Gift, Heart, Wallet } from 'lucide-react'
import { contactPage, company } from '@/data/content'

const iconFor = (title: string) => {
  if (title.includes('Partner')) return HeartHandshake
  if (title.includes('Volunteer')) return HandHelping
  if (title.includes('Sponsor')) return Gift
  if (title.includes('Donate')) return Wallet
  return Heart
}

export default function ContactHero() {
  const { titleLines, intro } = contactPage.hero
  const intents = [...contactPage.intents]
  return (
    <section className="bg-charcoal py-20">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 lg:grid-cols-2 lg:px-10">
        <div>
          <p className="font-dm text-xs font-medium uppercase tracking-widest text-brand-pink-light">Contact</p>
          <h1 className="mt-4 font-lora text-4xl font-normal leading-tight text-white lg:text-5xl">
            {titleLines.map((line, i) => (
              <span key={line}>
                {i > 0 ? <br /> : null}
                {i === titleLines.length - 1 ? (
                  <em className="font-lora italic text-brand-pink">{line}</em>
                ) : (
                  line
                )}
              </span>
            ))}
          </h1>
          <p className="mt-5 max-w-md font-dm text-sm font-light leading-relaxed text-white/70">{intro}</p>
          <div className="mt-8 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Mail className="text-brand-pink" size={16} strokeWidth={1.75} aria-hidden />
              <a href={`mailto:${company.email}`} className="font-dm text-sm text-white/80 hover:text-white">
                {company.email}
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="text-brand-pink" size={16} strokeWidth={1.75} aria-hidden />
              <a href={`tel:${company.phone}`} className="font-dm text-sm text-white/80 hover:text-white">
                {company.phoneDisplay}
              </a>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="text-brand-pink" size={16} strokeWidth={1.75} aria-hidden />
              <span className="font-dm text-sm text-white/80">{company.address}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
          {intents.map(({ href, title, desc }) => {
            const Icon = iconFor(title)
            const tone =
              title.includes('Partner') || title.includes('Sponsor') || title.includes('Donate') ? 'green' : 'pink'
            return (
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
            )
          })}
        </div>
      </div>
    </section>
  )
}
