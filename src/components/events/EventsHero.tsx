'use client'

import Link from 'next/link'
import { format, parseISO } from 'date-fns'
import type { Event } from '@/types'

const PREVIEW_ACCENTS = ['bg-brand-pink', 'bg-brand-green', 'bg-white/10'] as const

function previewDateBox(ev: Event) {
  try {
    const d = parseISO(ev.event_date + 'T12:00:00')
    return { mon: format(d, 'MMM').toUpperCase(), day: format(d, 'd') }
  } catch {
    return { mon: '—', day: '—' }
  }
}

export default function EventsHero({
  previewEvents,
  onRegisterClick,
}: {
  previewEvents: Event[]
  onRegisterClick: (ev: Event) => void
}) {
  return (
    <section className="bg-charcoal py-24">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 lg:grid-cols-2 lg:px-10">
        <div>
          <p className="font-dm text-xs font-medium uppercase tracking-widest text-brand-pink-light">
            Events & Programs
          </p>
          <h1 className="mt-4 font-lora text-4xl font-normal leading-tight text-white lg:text-5xl">
            Experiences designed
            <br />
            for <em className="font-lora italic text-brand-pink">deeper</em>
            <br />
            transformation.
          </h1>
          <p className="mt-5 max-w-lg font-dm text-sm font-light leading-relaxed text-white/70">
            Beyond one-on-one sessions, our signature programs, webinars, and cohorts bring people together for shared
            growth, learning, and community healing.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/events#events-list"
              className="rounded-full bg-brand-pink px-6 py-3 font-dm text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Register for an Event
            </Link>
            <Link
              href="/contact#speak"
              className="rounded-full border border-white px-6 py-3 font-dm text-sm font-normal text-white transition-colors hover:bg-white/10"
            >
              Invite Us to Speak
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {previewEvents.length === 0 ? (
            <p className="rounded-2xl border border-white/10 bg-white/5 p-5 font-dm text-sm text-white/60">
              Upcoming programs are listed below — pick one and tap Register.
            </p>
          ) : (
            previewEvents.map((ev, i) => {
              const { mon, day } = previewDateBox(ev)
              const subtitle = ev.is_online
                ? ev.online_link
                  ? 'Online'
                  : 'Online event'
                : ev.location
              return (
                <div key={ev.id} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-5">
                  <div
                    className={`flex-shrink-0 rounded-xl px-3 py-2 text-center ${PREVIEW_ACCENTS[i % PREVIEW_ACCENTS.length]}`}
                  >
                    <p className="font-dm text-xs font-medium text-white">{mon}</p>
                    <p className="font-lora text-xl text-white">{day}</p>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-dm text-sm font-medium text-white">{ev.title}</p>
                    <p className="mt-0.5 font-dm text-xs text-white/50">
                      {ev.category} · {subtitle}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRegisterClick(ev)}
                    className="flex-shrink-0 font-dm text-xs font-medium text-brand-pink hover:underline"
                  >
                    Register →
                  </button>
                </div>
              )
            })
          )}
        </div>
      </div>
    </section>
  )
}
