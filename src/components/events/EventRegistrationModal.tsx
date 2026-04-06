'use client'

import { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { format, parseISO } from 'date-fns'
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Loader2,
  MapPin,
  User,
  X,
} from 'lucide-react'
import Link from 'next/link'
import { HONEYPOT_FIELD } from '@/lib/honeypot'
import { createClient } from '@/lib/supabase/client'
import type { Event } from '@/types'
import { formatTimeFromDb } from '@/lib/format-display'

interface Props {
  event: Event
  isOpen: boolean
  onClose: () => void
}

function formatHeaderDate(dateStr: string) {
  try {
    return format(parseISO(dateStr + 'T12:00:00'), 'EEEE, d MMMM yyyy')
  } catch {
    return dateStr
  }
}

function buildTimeRange(ev: Event) {
  const start = formatTimeFromDb(ev.event_time)
  const end = formatTimeFromDb(ev.end_time)
  if (start && end) return `${start} – ${end}`
  if (start) return start
  if (ev.is_online && ev.online_link) return 'Online'
  return 'Time TBC'
}

export default function EventRegistrationModal({ event, isOpen, onClose }: Props) {
  const [step, setStep] = useState<'form' | 'success'>('form')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [alreadyRegistered, setAlreadyRegistered] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    organisation: '',
    notes: '',
  })
  const [honeypot, setHoneypot] = useState('')
  const [formLoadedAt, setFormLoadedAt] = useState<number | null>(null)

  const resetState = useCallback(() => {
    setStep('form')
    setError('')
    setAlreadyRegistered(false)
    setLoading(false)
  }, [])

  useEffect(() => {
    if (!isOpen) {
      resetState()
      return
    }
    resetState()
    setFormData({ full_name: '', email: '', phone: '', organisation: '', notes: '' })
    setUserId(null)
    setHoneypot('')
    setFormLoadedAt(Date.now())

    const supabase = createClient()
    void supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session?.user) return

      const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single()

      if (profile) {
        setUserId(session.user.id)
        setFormData({
          full_name: profile.full_name || '',
          email: profile.email || '',
          phone: profile.phone || '',
          organisation: '',
          notes: '',
        })

        const emailCheck = (profile.email || '').trim().toLowerCase()
        if (emailCheck) {
          const { data: existing } = await supabase
            .from('event_registrations')
            .select('id')
            .eq('event_id', event.id)
            .eq('email', emailCheck)
            .maybeSingle()
          if (existing) setAlreadyRegistered(true)
        }
      }
    })
  }, [event.id, isOpen, resetState])

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  async function handleRegister() {
    setError('')
    if (honeypot.trim().length > 0) {
      setStep('success')
      return
    }
    if (formLoadedAt != null && Date.now() - formLoadedAt < 3000) {
      setStep('success')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/events/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          event_id: event.id,
          full_name: formData.full_name,
          email: formData.email,
          phone: formData.phone,
          organisation: formData.organisation,
          notes: formData.notes,
          [HONEYPOT_FIELD]: honeypot,
          form_loaded_at: formLoadedAt ?? undefined,
          form_submitted_at: Date.now(),
        }),
      })

      const data = (await response.json()) as { error?: string }

      if (!response.ok) {
        if (response.status === 409) {
          setAlreadyRegistered(true)
          return
        }
        throw new Error(data.error || 'Registration failed')
      }

      setStep('success')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null
  if (typeof document === 'undefined') return null

  const locationLabel = event.is_online ? (event.online_link ? 'Online' : 'Online event') : event.location

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center sm:px-4"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="flex max-h-[100dvh] w-full flex-col overflow-hidden bg-white sm:max-h-[90vh] sm:max-w-lg sm:rounded-2xl sm:shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="event-registration-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-start justify-between border-b border-gray-100 p-6">
          <div className="min-w-0 pr-4">
            <p className="font-dm text-xs font-medium uppercase tracking-wider text-brand-pink">Register for Event</p>
            <h2 id="event-registration-title" className="mt-1 font-lora text-xl font-normal text-charcoal">
              {event.title}
            </h2>
            <div className="mt-2 flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
              <div className="flex items-center gap-2">
                <Calendar className="shrink-0 text-brand-green" size={14} strokeWidth={1.75} aria-hidden />
                <span className="font-dm text-xs text-charcoal-muted">{formatHeaderDate(event.event_date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="shrink-0 text-brand-green" size={14} strokeWidth={1.75} aria-hidden />
                <span className="font-dm text-xs text-charcoal-muted">{locationLabel}</span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-full p-1 text-charcoal-muted transition-colors hover:bg-charcoal-light hover:text-charcoal"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {alreadyRegistered ? (
            <div className="p-8 text-center">
              <CheckCircle2 className="mx-auto mb-4 text-brand-green" size={48} strokeWidth={1.5} aria-hidden />
              <p className="font-lora text-xl text-charcoal">You&apos;re already registered!</p>
              <p className="mt-2 font-dm text-sm leading-relaxed text-charcoal-muted">
                You have already registered for this event. We&apos;ll be in touch with details closer to the date.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-6 rounded-full border border-charcoal/20 px-6 py-2.5 font-dm text-sm text-charcoal transition-colors hover:bg-charcoal-light"
              >
                Close
              </button>
            </div>
          ) : step === 'success' ? (
            <div className="p-8 text-center">
              <CheckCircle2 className="mx-auto mb-4 text-brand-green" size={48} strokeWidth={1.5} aria-hidden />
              <p className="font-lora text-xl text-charcoal">You&apos;re registered!</p>
              <p className="mx-auto mt-2 max-w-sm font-dm text-sm leading-relaxed text-charcoal-muted">
                Thank you {formData.full_name}! Your registration for {event.title} has been confirmed. We&apos;ll send
                details to {formData.email} closer to the event date.
              </p>
              <div className="mt-5 rounded-xl bg-brand-pink-pale p-4 text-left font-dm text-sm text-charcoal">
                <p className="text-charcoal-muted">
                  <span className="font-medium text-charcoal">{formatHeaderDate(event.event_date)}</span>
                  {buildTimeRange(event) ? ` · ${buildTimeRange(event)}` : ''}
                </p>
                <p className="mt-1 text-charcoal-muted">{locationLabel}</p>
              </div>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full border border-charcoal/20 px-5 py-2.5 font-dm text-sm text-charcoal hover:bg-charcoal-light"
                >
                  Close
                </button>
                {!userId && (
                  <Link
                    href="/signup"
                    className="inline-flex items-center justify-center rounded-full bg-brand-pink px-5 py-2.5 font-dm text-sm font-medium text-white hover:opacity-90"
                  >
                    Create Account
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <div className="relative p-6">
              {userId && (
                <div className="mb-5 flex items-center gap-2 rounded-xl border border-brand-green-light bg-brand-green-pale p-3">
                  <User className="shrink-0 text-brand-green" size={14} aria-hidden />
                  <p className="font-dm text-xs text-charcoal-muted">
                    Registering as {formData.full_name || 'your account'} — your details have been pre-filled
                  </p>
                </div>
              )}

              <div className="relative flex flex-col gap-4">
                <label className="flex flex-col gap-1.5 font-dm text-sm">
                  <span className="text-charcoal">
                    Full Name <span className="text-brand-pink">*</span>
                  </span>
                  <input
                    type="text"
                    required
                    disabled={!!userId}
                    value={formData.full_name}
                    onChange={(e) => setFormData((f) => ({ ...f, full_name: e.target.value }))}
                    className="rounded-xl border border-gray-200 px-4 py-2.5 text-charcoal focus:border-brand-pink focus:outline-none disabled:bg-charcoal-light/50"
                  />
                </label>
                <label className="flex flex-col gap-1.5 font-dm text-sm">
                  <span className="text-charcoal">
                    Email Address <span className="text-brand-pink">*</span>
                  </span>
                  <input
                    type="email"
                    required
                    disabled={!!userId}
                    value={formData.email}
                    onChange={(e) => setFormData((f) => ({ ...f, email: e.target.value }))}
                    className="rounded-xl border border-gray-200 px-4 py-2.5 text-charcoal focus:border-brand-pink focus:outline-none disabled:bg-charcoal-light/50"
                  />
                </label>
                <label className="flex flex-col gap-1.5 font-dm text-sm">
                  <span className="text-charcoal">Phone Number</span>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData((f) => ({ ...f, phone: e.target.value }))}
                    className="rounded-xl border border-gray-200 px-4 py-2.5 text-charcoal focus:border-brand-pink focus:outline-none"
                  />
                </label>
                <label className="flex flex-col gap-1.5 font-dm text-sm">
                  <span className="text-charcoal">Organisation (optional)</span>
                  <input
                    type="text"
                    placeholder="Your company or school (optional)"
                    value={formData.organisation}
                    onChange={(e) => setFormData((f) => ({ ...f, organisation: e.target.value }))}
                    className="rounded-xl border border-gray-200 px-4 py-2.5 text-charcoal placeholder:text-charcoal-muted/70 focus:border-brand-pink focus:outline-none"
                  />
                </label>
                <label className="flex flex-col gap-1.5 font-dm text-sm">
                  <span className="text-charcoal">Notes (optional)</span>
                  <textarea
                    rows={2}
                    placeholder="Any questions or special requirements?"
                    value={formData.notes}
                    onChange={(e) => setFormData((f) => ({ ...f, notes: e.target.value }))}
                    className="resize-none rounded-xl border border-gray-200 px-4 py-2.5 text-charcoal placeholder:text-charcoal-muted/70 focus:border-brand-pink focus:outline-none"
                  />
                </label>
                <div
                  className="absolute -left-[9999px] h-0 overflow-hidden opacity-0"
                  aria-hidden="true"
                >
                  <label htmlFor="ev-reg-website">Website</label>
                  <input
                    type="text"
                    id="ev-reg-website"
                    name={HONEYPOT_FIELD}
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>
              </div>

              {error && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 font-dm text-sm text-red-700">
                  {error}
                </div>
              )}

              <button
                type="button"
                disabled={loading || !formData.full_name.trim() || !formData.email.trim()}
                onClick={() => void handleRegister()}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-pink py-3 font-dm text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={18} aria-hidden />
                ) : (
                  <>
                    Confirm Registration
                    <ArrowRight size={14} aria-hidden />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  )
}
