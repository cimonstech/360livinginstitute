import Link from 'next/link'
import { Mail, MapPin, Phone } from 'lucide-react'
import { company } from '@/data/content'

export default function TopContactBar() {
  const tel = company.phone.replace(/\s/g, '')
  return (
    <div
      className="border-y border-black px-4 py-2 text-[11px] font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] sm:text-xs"
      style={{
        background: 'linear-gradient(90deg, #E8007D 0%, #2D7D5E 45%, #3a3248 100%)',
      }}
    >
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-2 sm:flex-row sm:flex-wrap sm:justify-between sm:gap-x-6 sm:gap-y-1 lg:px-10">
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 sm:justify-start">
          <Link
            href={`tel:${tel}`}
            className="inline-flex items-center gap-1.5 text-white/95 transition-opacity hover:opacity-90"
          >
            <Phone className="h-3.5 w-3.5 shrink-0 opacity-90" strokeWidth={2} aria-hidden />
            <span className="font-dm tabular-nums">{company.phoneDisplay}</span>
          </Link>
          <Link
            href={`mailto:${company.email}`}
            className="inline-flex items-center gap-1.5 text-white/95 transition-opacity hover:opacity-90"
          >
            <Mail className="h-3.5 w-3.5 shrink-0 opacity-90" strokeWidth={2} aria-hidden />
            <span className="font-dm break-all">{company.email}</span>
          </Link>
        </div>
        <p className="inline-flex items-center justify-center gap-1.5 text-center text-white/95 sm:justify-end">
          <MapPin className="h-3.5 w-3.5 shrink-0 opacity-90" strokeWidth={2} aria-hidden />
          <span className="font-dm">{company.address}</span>
        </p>
      </div>
    </div>
  )
}
