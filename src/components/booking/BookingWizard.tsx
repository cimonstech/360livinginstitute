'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import type { BookingFormData, PricingSettings, Service } from '@/types'
import { createClient } from '@/lib/supabase/client'
import StepService from '@/components/booking/StepService'
import StepDateTime from '@/components/booking/StepDateTime'
import StepDetails from '@/components/booking/StepDetails'
import StepConfirm from '@/components/booking/StepConfirm'
import { HONEYPOT_FIELD } from '@/lib/honeypot'
import { ArrowRight, Check, Loader2, CheckCircle2, Mail } from 'lucide-react'

const STEPS = [
  { n: 1, label: 'Service' },
  { n: 2, label: 'Date & Time' },
  { n: 3, label: 'Your Details' },
  { n: 4, label: 'Confirm' },
] as const

export default function BookingWizard() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<Partial<BookingFormData>>({})
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [dashboardAvailable, setDashboardAvailable] = useState(false)
  const [sessionInfo, setSessionInfo] = useState<{ name: string } | null>(null)
  const [pricingSettings, setPricingSettings] = useState<PricingSettings | null>(null)
  const [appointmentId, setAppointmentId] = useState<string | null>(null)
  const [accountCreated, setAccountCreated] = useState(false)
  const [formLoadedAt, setFormLoadedAt] = useState(() => Date.now())
  const [honeypot, setHoneypot] = useState('')

  const prefillDoneRef = useRef(false)

  function sessionPriceGhs(service: Service | null, pricing: PricingSettings | null): number | null {
    if (!pricing?.show_prices) return null
    if (!service) return Number(pricing.global_price_ghs)
    const useGlobal = service.use_global_price !== false
    if (useGlobal) return Number(pricing.global_price_ghs)
    const o = service.price_override_ghs
    if (o == null || Number.isNaN(Number(o))) return Number(pricing.global_price_ghs)
    return Number(o)
  }

  const mergeFormData = useCallback((patch: Partial<BookingFormData>) => {
    setFormData((prev) => ({ ...prev, ...patch }))
  }, [])

  useEffect(() => {
    ;(async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', user.id).single()
      if (profile?.full_name) setSessionInfo({ name: profile.full_name })
    })()
  }, [])

  useEffect(() => {
    ;(async () => {
      const supabase = createClient()
      const { data } = await supabase.from('pricing_settings').select('*').limit(1).maybeSingle()
      setPricingSettings((data as PricingSettings) ?? null)
    })()
  }, [])

  useEffect(() => {
    if (step !== 3 || prefillDoneRef.current) return
    prefillDoneRef.current = true
    ;(async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (!profile) return
      setFormData((p) => ({
        ...p,
        client_name: p.client_name?.trim() ? p.client_name : profile.full_name,
        client_email: p.client_email?.trim() ? p.client_email : profile.email,
        client_phone: p.client_phone?.trim() ? p.client_phone : profile.phone ?? undefined,
      }))
    })()
  }, [step])

  const selectService = (s: Service) => {
    setSelectedService(s)
    mergeFormData({
      service_id: s.id,
      service_title: s.title,
      duration_minutes: s.duration_minutes,
    })
  }

  const onDateTimeSelect = (date: string, time: string) => {
    mergeFormData({
      appointment_date: date,
      appointment_time: time,
    })
  }

  function validateStep(current: number): string | null {
    if (current === 1) {
      if (!selectedService) return 'Please select a service.'
    }
    if (current === 2) {
      if (!formData.appointment_date) return 'Please select a date.'
      if (!formData.appointment_time) return 'Please select a time.'
    }
    if (current === 3) {
      if (!formData.client_name?.trim()) return 'Please enter your full name.'
      if (!formData.client_email?.trim()) return 'Please enter your email.'
      if (formData.create_account) {
        if (!formData.password || formData.password.length < 8) return 'Password must be at least 8 characters.'
        if (formData.password !== formData.confirm_password) return 'Passwords do not match.'
      }
    }
    return null
  }

  function goNext() {
    const msg = validateStep(step)
    if (msg) {
      setError(msg)
      return
    }
    setError('')
    setStep((s) => Math.min(4, s + 1))
  }

  function goBack() {
    setError('')
    setStep((s) => Math.max(1, s - 1))
  }

  async function handleSubmit() {
    const msg = validateStep(3)
    if (msg) {
      setError(msg)
      return
    }
    if (honeypot.trim().length > 0) {
      setSuccess(true)
      return
    }
    if (Date.now() - formLoadedAt < 3000) {
      setSuccess(true)
      return
    }
    setLoading(true)
    setError('')
    setAccountCreated(false)

    try {
      const supabase = createClient()
      const { data: { user: userBefore } } = await supabase.auth.getUser()
      const hadUserBefore = !!userBefore

      if (formData.create_account && formData.password) {
        const { error: authError } = await supabase.auth.signUp({
          email: formData.client_email!,
          password: formData.password,
          options: {
            data: { full_name: formData.client_name, role: 'client' },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        })
        if (authError) throw authError
        setAccountCreated(true)
      }

      const duration =
        formData.duration_minutes ?? selectedService?.duration_minutes ?? 60

      const res = await fetch('/api/appointments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          client_name: formData.client_name!,
          client_email: formData.client_email!,
          client_phone: formData.client_phone || null,
          service_id: formData.service_id!,
          service_title: formData.service_title!,
          appointment_date: formData.appointment_date!,
          appointment_time: formData.appointment_time!,
          duration_minutes: duration,
          notes: formData.notes || null,
          [HONEYPOT_FIELD]: honeypot,
          form_loaded_at: formLoadedAt,
          form_submitted_at: Date.now(),
        }),
      })

      const payload = (await res.json()) as {
        error?: string
        linkedToUser?: boolean
        appointment?: { id: string }
      }

      if (!res.ok) {
        throw new Error(payload.error || `Booking failed (${res.status})`)
      }

      setAppointmentId(payload.appointment?.id ?? null)
      setDashboardAvailable(Boolean(hadUserBefore || payload.linkedToUser))
      setSuccess(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function resetWizard() {
    setStep(1)
    setFormData({})
    setSelectedService(null)
    setSuccess(false)
    setError('')
    setDashboardAvailable(false)
    setAppointmentId(null)
    setAccountCreated(false)
    prefillDoneRef.current = false
    setFormLoadedAt(Date.now())
    setHoneypot('')
  }

  if (success) {
    return (
      <section className="min-h-screen bg-warm-cream py-16 px-6 lg:px-10">
        <div className="max-w-4xl mx-auto text-center py-16">
          <CheckCircle2 className="mx-auto mb-6 text-brand-green" size={64} aria-hidden />
          <h1 className="font-lora text-3xl text-charcoal">Booking Received!</h1>
          {accountCreated && formData.client_email && (
            <div className="mt-6 max-w-md mx-auto text-left bg-brand-green-pale border border-brand-green-light rounded-2xl p-4 flex items-start gap-3">
              <Mail className="text-brand-green flex-shrink-0 mt-0.5" size={18} aria-hidden />
              <div>
                <p className="font-medium text-sm text-charcoal font-dm">Verify your email to activate your account</p>
                <p className="text-xs text-charcoal-muted leading-relaxed mt-1 font-dm">
                  We sent a verification link to {formData.client_email}. Click the link in the email to activate your
                  account, then sign in to track your bookings.
                </p>
                <Link
                  href="/login"
                  className="text-xs text-brand-pink mt-2 block font-dm font-medium hover:underline"
                >
                  Sign in to your account →
                </Link>
              </div>
            </div>
          )}
          <p className="text-sm text-charcoal-muted mt-3 max-w-md mx-auto leading-relaxed font-dm">
            Thank you {formData.client_name}. We&apos;ve received your booking request and will confirm it within 24 hours.
            Check your email for details.
          </p>
          {!accountCreated && !dashboardAvailable && (
            <p className="text-xs text-charcoal-muted mt-3 text-center max-w-md mx-auto font-dm leading-relaxed">
              Booked as a guest.{' '}
              <Link href="/signup" className="text-brand-pink font-medium hover:underline">
                Create an account
              </Link>{' '}
              to track your sessions.
            </p>
          )}
          {appointmentId && (
            <div className="bg-brand-pink-pale rounded-2xl p-5 mt-6 max-w-md mx-auto text-center">
              <p className="text-xs text-charcoal-muted mb-1 font-dm">Your Booking Reference</p>
              <p className="font-mono text-lg font-medium text-brand-pink tracking-wider">
                {appointmentId.slice(0, 8).toUpperCase()}
              </p>
              <p className="text-xs text-charcoal-muted mt-2 font-dm">Use this as your MoMo payment reference</p>
            </div>
          )}
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <button
              type="button"
              onClick={resetWizard}
              className="rounded-full border border-gray-200 text-charcoal-muted px-6 py-2.5 text-sm font-dm"
            >
              Book Another Session
            </button>
            {dashboardAvailable && (
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-full bg-brand-pink text-white px-6 py-2.5 text-sm font-medium font-dm"
              >
                Go to Dashboard
              </Link>
            )}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="min-h-screen bg-warm-cream py-16 px-6 lg:px-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-0 sm:gap-2">
          {STEPS.map((s, i) => (
            <div key={s.n} className="flex flex-1 items-center min-w-0">
              <div className="flex w-full flex-col items-center">
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 text-xs font-dm font-medium transition-colors ${
                    step > s.n
                      ? 'border-brand-pink bg-brand-pink text-white'
                      : step === s.n
                        ? 'border-brand-pink bg-brand-pink text-white'
                        : 'border-gray-300 bg-white text-charcoal-muted'
                  }`}
                >
                  {step > s.n ? <Check size={16} strokeWidth={2.5} /> : s.n}
                </div>
                <span className="font-dm text-xs text-charcoal-muted mt-2 text-center leading-tight px-0.5">
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`mx-1 h-0.5 min-w-[12px] flex-1 self-start mt-[18px] ${step > s.n ? 'bg-brand-pink' : 'bg-gray-200'}`}
                  aria-hidden
                />
              )}
            </div>
          ))}
        </div>

        <div className="relative bg-white rounded-2xl p-8 mt-8 border border-gray-100">
          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 font-dm">
              {error}
            </div>
          )}

          <div
            className="absolute -left-[9999px] h-0 overflow-hidden opacity-0"
            aria-hidden="true"
          >
            <label htmlFor="booking-website-url">Website</label>
            <input
              type="text"
              id="booking-website-url"
              name={HONEYPOT_FIELD}
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          {step === 1 && <StepService onSelect={selectService} selected={selectedService} />}
          {step === 2 && selectedService && (
            <StepDateTime
              service={selectedService}
              onSelect={onDateTimeSelect}
              selectedDate={formData.appointment_date ?? ''}
              selectedTime={formData.appointment_time ?? ''}
            />
          )}
          {step === 3 && (
            <StepDetails
              formData={formData}
              onChange={mergeFormData}
              isLoggedIn={!!sessionInfo}
              sessionName={sessionInfo?.name}
            />
          )}
          {step === 4 && (
            <StepConfirm
              formData={formData}
              pricing={pricingSettings}
              sessionPriceGhs={sessionPriceGhs(selectedService, pricingSettings)}
            />
          )}

          <div className="flex flex-wrap items-center justify-between gap-4 mt-10 pt-6 border-t border-gray-100">
            {step > 1 ? (
              <button
                type="button"
                onClick={goBack}
                className="rounded-full border border-gray-200 text-charcoal-muted px-6 py-2.5 text-sm font-dm"
              >
                Back
              </button>
            ) : (
              <span />
            )}
            {step < 4 ? (
              <button
                type="button"
                onClick={goNext}
                disabled={
                  (step === 1 && !selectedService) ||
                  (step === 2 && (!formData.appointment_date || !formData.appointment_time))
                }
                className="ml-auto inline-flex items-center gap-2 rounded-full bg-brand-pink px-6 py-2.5 text-sm font-medium text-white font-dm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ArrowRight size={16} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="ml-auto inline-flex items-center gap-2 rounded-full bg-brand-pink px-6 py-2.5 text-sm font-medium text-white font-dm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : 'Confirm Booking'}
                {!loading && <ArrowRight size={16} />}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
