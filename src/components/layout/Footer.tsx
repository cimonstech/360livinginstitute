import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Camera, Link2, MessageCircle } from 'lucide-react'

const quickLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Our Team', href: '/team' },
  { label: 'Blog', href: '/blog' },
  { label: 'Events', href: '/events' },
  { label: 'Resources', href: '/resources' },
  { label: 'Contact', href: '/contact' },
]

const companyLinks = [
  { label: 'About Us', href: '/about' },
  { label: 'Our Mission', href: '/about#mission' },
  { label: 'Our Team', href: '/team' },
  { label: 'Blog', href: '/blog' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Therapy Guide', href: '/resources' },
]

export default function Footer() {
  return (
    <footer className="bg-charcoal pb-8 pt-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-4">
          <div>
            <div className="relative h-20 w-[240px]">
              <Image
                src="/images/logo2.png"
                alt="360 Living Institute"
                fill
                className="object-contain object-left brightness-0 invert"
                sizes="240px"
              />
            </div>
            <p className="mt-3 max-w-xs font-dm text-xs leading-relaxed text-white/50">
              Transforming Lives Through Psychological Insight & Life Development.
            </p>
            <Link
              href="/book"
              className="mt-6 inline-block rounded-full border border-white/20 px-5 py-2.5 font-dm text-sm text-white transition-colors hover:bg-white/10"
            >
              Book Appointment
            </Link>
          </div>

          <div>
            <p className="mb-4 font-dm text-xs uppercase tracking-widest text-white/40">Quick Links</p>
            <nav className="flex flex-col gap-2">
              {quickLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="font-dm text-sm text-white/60 transition-colors hover:text-white"
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
                  className="font-dm text-sm text-white/60 transition-colors hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <p className="mb-4 font-dm text-xs uppercase tracking-widest text-white/40">Support</p>
            <div className="flex flex-col gap-2 font-dm text-sm text-white/60">
              <p>0538045503</p>
              <a href="mailto:info@360livinginstitute.com" className="transition-colors hover:text-white">
                info@360livinginstitute.com
              </a>
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-white/40" strokeWidth={1.75} aria-hidden />
                <span>31 Awudome Roundabout, Awudome, Accra</span>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <span
                className="rounded-full border border-white/20 p-2 text-white/60 transition-colors hover:text-white"
                title="Instagram"
                aria-label="Instagram"
              >
                <Camera className="h-4 w-4" strokeWidth={1.5} aria-hidden />
              </span>
              <span
                className="rounded-full border border-white/20 p-2 text-white/60 transition-colors hover:text-white"
                title="LinkedIn"
                aria-label="LinkedIn"
              >
                <Link2 className="h-4 w-4" strokeWidth={1.5} aria-hidden />
              </span>
              <span
                className="rounded-full border border-white/20 p-2 text-white/60 transition-colors hover:text-white"
                title="Facebook"
                aria-label="Facebook"
              >
                <MessageCircle className="h-4 w-4" strokeWidth={1.5} aria-hidden />
              </span>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-12 flex max-w-7xl flex-col items-center justify-between gap-2 border-t border-white/10 pt-6 md:flex-row">
          <p className="font-dm text-xs text-white/40">© 2025 360 Living Institute. All rights reserved.</p>
          <p className="font-dm text-xs text-white/40">Powered by Cimons Technologies</p>
        </div>
      </div>
    </footer>
  )
}
