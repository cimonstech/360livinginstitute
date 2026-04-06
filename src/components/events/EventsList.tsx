'use client'

import { MapPin, Clock, Users } from 'lucide-react'
import type { Event } from '@/types'
import { formatEventDay, formatEventMonthYear, formatTimeFromDb } from '@/lib/format-display'

function buildTimeRange(ev: Event) {
  const start = formatTimeFromDb(ev.event_time)
  const end = formatTimeFromDb(ev.end_time)
  if (start && end) return `${start} – ${end}`
  if (start) return start
  if (ev.is_online && ev.online_link) return 'Online'
  return 'Time TBC'
}

/** Only absolute http(s) URLs use an external link; `/contact` and empty values open the in-site registration modal. */
function isExternalRegistrationUrl(link?: string | null) {
  const t = link?.trim()
  if (!t) return false
  return /^https?:\/\//i.test(t)
}

export default function EventsList({
  events,
  onRegisterClick,
}: {
  events: Event[]
  onRegisterClick: (ev: Event) => void
}) {
  const list = events.filter((e) => e.status === 'upcoming' || e.status === 'ongoing')

  return (
    <section id="events-list" className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <p className="font-dm text-xs font-medium uppercase tracking-widest text-brand-pink">Upcoming Programs</p>
        <h2 className="mt-2 font-lora text-3xl font-normal text-charcoal lg:text-4xl">Join a program. Grow together.</h2>
        <p className="mb-12 mt-3 max-w-xl font-dm text-sm font-light text-charcoal-muted">
          All programs are led by licensed practitioners and designed to create lasting impact through community, insight,
          and practical tools.
        </p>

        {list.length === 0 ? (
          <p className="py-16 text-center font-dm text-sm text-charcoal-muted">
            No upcoming programs listed yet. Check back soon or contact us for custom workshops.
          </p>
        ) : (
          <div>
            {list.map((ev) => (
              <div
                key={ev.id}
                className="grid grid-cols-1 items-start gap-6 border-b border-gray-100 py-10 lg:grid-cols-12"
              >
                <div className="lg:col-span-2">
                  <p className="font-lora text-3xl font-normal text-brand-pink">{formatEventDay(ev.event_date)}</p>
                  <p className="font-dm text-xs uppercase tracking-wider text-charcoal-muted">
                    {formatEventMonthYear(ev.event_date)}
                  </p>
                </div>
                <div className="lg:col-span-4">
                  <span className="mb-3 inline-block rounded-full bg-brand-pink-pale px-3 py-1 font-dm text-xs font-medium text-brand-pink">
                    {ev.category}
                  </span>
                  <h3 className="font-lora text-xl font-normal text-charcoal">{ev.title}</h3>
                  {ev.description && (
                    <p className="mt-2 font-dm text-sm font-light leading-relaxed text-charcoal-muted">{ev.description}</p>
                  )}
                </div>
                <div className="flex flex-col gap-2 lg:col-span-3">
                  <div className="flex items-start gap-2">
                    <MapPin className="mt-0.5 flex-shrink-0 text-brand-green" size={14} strokeWidth={1.75} aria-hidden />
                    <span className="font-dm text-xs text-charcoal-muted">
                      {ev.is_online ? (ev.online_link ? 'Online' : 'Online event') : ev.location}
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock className="mt-0.5 flex-shrink-0 text-brand-green" size={14} strokeWidth={1.75} aria-hidden />
                    <span className="font-dm text-xs text-charcoal-muted">{buildTimeRange(ev)}</span>
                  </div>
                  {ev.audience && (
                    <div className="flex items-start gap-2">
                      <Users className="mt-0.5 flex-shrink-0 text-brand-green" size={14} strokeWidth={1.75} aria-hidden />
                      <span className="font-dm text-xs text-charcoal-muted">{ev.audience}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-start justify-start lg:col-span-3 lg:justify-end">
                  {isExternalRegistrationUrl(ev.registration_link) ? (
                    <a
                      href={ev.registration_link!.trim()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full bg-brand-pink px-4 py-2 font-dm text-xs font-medium text-white transition-opacity hover:opacity-90"
                    >
                      Register →
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onRegisterClick(ev)}
                      className="rounded-full bg-brand-pink px-4 py-2 font-dm text-xs font-medium text-white transition-opacity hover:opacity-90"
                    >
                      Register →
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
