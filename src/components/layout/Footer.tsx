import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Camera, Link2, MessageCircle } from 'lucide-react'
import { company, institute } from '@/data/content'

const quickLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Programs', href: '/programs' },
  { label: 'Get Involved', href: '/get-involved' },
  { label: 'Resources', href: '/resources' },
  { label: 'Success Stories', href: '/success-stories' },
  { label: 'Contact', href: '/contact' },
]

const companyLinks = [
  { label: 'About Us', href: '/about' },
  { label: 'Vision & Mission', href: '/about#mission' },
  { label: 'Our Programs', href: '/programs' },
  { label: institute.name, href: institute.url },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
]

export default function Footer() {
  return (
    <footer className="border-t-4 border-brand-green bg-charcoal pb-8 pt-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-4">
          <div>
            <div className="relative h-20 w-[240px]">
              <Image
                src="/images/Logo-1.png"
                alt="360 Living Foundation"
                fill
                className="object-contain object-left brightness-0 invert"
                sizes="240px"
              />
            </div>
            <p className="mt-3 max-w-xs font-dm text-xs leading-relaxed text-white/50">
              {company.tagline} Bridging potential and reality through counselling, mentorship, and life development.
            </p>
            <Link
              href="/get-involved#apply"
              className="mt-6 inline-block rounded-full border-2 border-brand-green/60 px-5 py-2.5 font-dm text-sm text-white transition-colors hover:bg-brand-green/25"
            >
              Apply Now
            </Link>
          </div>

          <div>
            <p className="mb-4 font-dm text-xs uppercase tracking-widest text-white/40">Quick Links</p>
            <nav className="flex flex-col gap-2">
              {quickLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="font-dm text-sm text-white/60 transition-colors hover:text-brand-green-light"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <p className="mb-4 font-dm text-xs uppercase tracking-widest text-white/40">Company</p>
            <nav className="flex flex-col gap-2">
              {companyLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  {...(item.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="font-dm text-sm text-white/60 transition-colors hover:text-brand-green-light"
                >
                  {item.label}
                  {item.href.startsWith('http') ? ' ↗' : ''}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <p className="mb-4 font-dm text-xs uppercase tracking-widest text-white/40">Support</p>
            <div className="flex flex-col gap-2 font-dm text-sm text-white/60">
              <a href={`tel:${company.phone}`} className="transition-colors hover:text-brand-green-light">
                {company.phoneDisplay}
              </a>
              <a href={`mailto:${company.email}`} className="transition-colors hover:text-brand-green-light">
                {company.email}
              </a>
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-brand-green-light/80" strokeWidth={1.75} aria-hidden />
                <span>{company.address}</span>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <span
                className="rounded-full border border-white/20 p-2 text-white/60 transition-colors hover:border-brand-green/50 hover:text-brand-green-light"
                title="Instagram"
                aria-label="Instagram"
              >
                <Camera className="h-4 w-4" strokeWidth={1.5} aria-hidden />
              </span>
              <span
                className="rounded-full border border-white/20 p-2 text-white/60 transition-colors hover:border-brand-green/50 hover:text-brand-green-light"
                title="LinkedIn"
                aria-label="LinkedIn"
              >
                <Link2 className="h-4 w-4" strokeWidth={1.5} aria-hidden />
              </span>
              <span
                className="rounded-full border border-white/20 p-2 text-white/60 transition-colors hover:border-brand-green/50 hover:text-brand-green-light"
                title="Facebook"
                aria-label="Facebook"
              >
                <MessageCircle className="h-4 w-4" strokeWidth={1.5} aria-hidden />
              </span>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-12 flex max-w-7xl flex-col items-center justify-between gap-2 border-t border-white/10 pt-6 md:flex-row">
          <p className="font-dm text-xs text-white/40">© {new Date().getFullYear()} {company.name}. All rights reserved.</p>
          <p className="font-dm text-xs text-white/40">Powered by Cimons Technologies</p>
        </div>
      </div>
    </footer>
  )
}
