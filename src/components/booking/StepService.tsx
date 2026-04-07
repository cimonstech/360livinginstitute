'use client'

import { useCallback, useEffect, useState } from 'react'
import type { PricingSettings, Service } from '@/types'
import { CheckCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { PostgrestError } from '@supabase/supabase-js'

type Props = {
  onSelect: (service: Service) => void
  selected: Service | null
}

type ErrorFields = { message: string; details?: string; hint?: string; code?: string }

function parseSupabaseQueryError(err: unknown): ErrorFields {
  if (err == null) return { message: String(err) }
  if (typeof err !== 'object') return { message: String(err) }

  if (err instanceof PostgrestError) {
    return {
      message: err.message || '(empty message)',
      details: err.details || undefined,
      hint: err.hint || undefined,
      code: err.code || undefined,
    }
  }

  if (err instanceof Error) {
    return { message: err.message || err.name || '(empty Error.message)' }
  }

  const o = err as Record<string, unknown>
  const message =
    typeof o.message === 'string' && o.message.length > 0
      ? o.message
      : '(no message on error object)'
  return {
    message,
    details: typeof o.details === 'string' ? o.details : undefined,
    hint: typeof o.hint === 'string' ? o.hint : undefined,
    code: typeof o.code === 'string' ? o.code : undefined,
  }
}

/** Next.js dev overlay often renders `console.error('…', object)` as `{}` — log one string instead. */
function logSupabaseError(prefix: string, err: unknown, fields: ErrorFields) {
  const parts = [
    `${prefix} ${fields.message}`,
    fields.code && `code=${fields.code}`,
    fields.details && `details=${fields.details}`,
    fields.hint && `hint=${fields.hint}`,
  ].filter(Boolean)
  console.error(parts.join(' | '))
  if (process.env.NODE_ENV === 'development') {
    console.error(`${prefix} (raw typeof)`, typeof err, err)
  }
}

function servicePriceLabel(service: Service, pricing: PricingSettings | null) {
  return null
}

function displayServiceTitle(service: Service) {
  if (service.slug === 'life-transition-counselling') return '360 Transition Reset Program'
  return service.title
}

export default function StepService({ onSelect, selected }: Props) {
  const [services, setServices] = useState<Service[]>([])
  const [pricing, setPricing] = useState<PricingSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [showError, setShowError] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const loadServices = useCallback(async () => {
    setLoading(true)
    setShowError(false)
    setErrorMessage(null)

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()

    if (!url || !key) {
      console.error(
        '[StepService] Missing Supabase env: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is empty or not set. Add them to .env.local and restart the dev server.'
      )
      console.log('[StepService] services query', { data: null, error: { message: 'Missing env vars' } })
      setServices([])
      setShowError(true)
      setErrorMessage('Missing Supabase URL or anon key in environment variables.')
      setLoading(false)
      return
    }

    const supabase = createClient()
    const [servicesRes, pricingRes] = await Promise.all([
      supabase.from('services').select('*').eq('is_active', true).order('sort_order'),
      supabase.from('pricing_settings').select('*').limit(1).maybeSingle(),
    ])

    const { data, error } = servicesRes
    if (pricingRes.data) {
      setPricing(pricingRes.data as PricingSettings)
    } else {
      setPricing(null)
    }

    const errorFields = error ? parseSupabaseQueryError(error) : null
    console.log(
      '[StepService] services query',
      JSON.stringify({ dataCount: data?.length ?? 0, error: errorFields }, null, 2)
    )

    if (error && errorFields) {
      logSupabaseError('[StepService] Supabase error —', error, errorFields)
      setServices([])
      setShowError(true)
      const parts = [errorFields.message, errorFields.details, errorFields.hint].filter(Boolean)
      setErrorMessage(parts.join(' — ') || 'Request failed.')
      setLoading(false)
      return
    }

    const list = (data as Service[]) ?? []
    if (list.length === 0) {
      console.warn(
        '[StepService] No active services returned. Check that public.services has rows with is_active = true and that RLS allows select for anon (see schema "Anyone can view active services").'
      )
      setServices([])
      setShowError(true)
      setErrorMessage(null)
    } else {
      setServices(list)
      setShowError(false)
      setErrorMessage(null)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    void loadServices()
  }, [loadServices])

  return (
    <div>
      <h2 className="font-lora text-xl text-charcoal mb-1">Choose a service</h2>
      <p className="font-dm text-sm text-charcoal-muted font-light mb-6">
        Select the session type that best fits your needs.
      </p>

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" aria-busy="true" aria-label="Loading services">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="bg-charcoal-light animate-pulse rounded-2xl h-24" />
          ))}
        </div>
      )}

      {!loading && showError && (
        <div className="rounded-2xl border border-gray-200 bg-white px-6 py-8 text-center">
          <p className="text-sm text-charcoal-muted font-dm mb-4">
            Unable to load services. Please try again.
          </p>
          {errorMessage && (
            <p className="text-xs text-red-600 font-dm mb-4 max-w-lg mx-auto text-left break-words">
              {errorMessage}
            </p>
          )}
          <p className="text-xs text-charcoal-muted/80 font-dm mb-4 max-w-md mx-auto">
            If this keeps happening, confirm <code className="text-charcoal">.env.local</code> has{' '}
            <code className="text-charcoal">NEXT_PUBLIC_SUPABASE_URL</code> and{' '}
            <code className="text-charcoal">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>, and that the{' '}
            <code className="text-charcoal">services</code> table exists (run <code className="text-charcoal">supabase/schema.sql</code> in the
            Supabase SQL editor).
          </p>
          <button
            type="button"
            onClick={() => void loadServices()}
            className="rounded-full bg-brand-pink text-white px-6 py-2.5 text-sm font-medium font-dm hover:opacity-90"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !showError && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map((service) => {
            const isSelected = selected?.id === service.id
            const priceLabel = servicePriceLabel(service, pricing)
            return (
              <button
                key={service.id}
                type="button"
                onClick={() => onSelect(service)}
                className={`relative rounded-2xl p-5 text-left cursor-pointer transition-all ${
                  isSelected
                    ? 'border-2 border-brand-pink bg-brand-pink-pale'
                    : 'border border-gray-200 bg-white hover:border-brand-pink-light'
                }`}
              >
                {isSelected && (
                  <CheckCircle2 className="absolute top-4 right-4 text-brand-pink" size={16} aria-hidden />
                )}
                <div className="flex items-start justify-between gap-3 pr-6">
                  <span className="font-lora text-base font-medium text-charcoal">{displayServiceTitle(service)}</span>
                  <div className="flex flex-shrink-0 flex-col items-end gap-1">
                    {priceLabel && (
                      <span className="font-lora text-lg font-medium text-brand-pink">{priceLabel}</span>
                    )}
                  </div>
                </div>
                {service.description && (
                  <p className="text-sm font-light text-charcoal-muted mt-1 font-dm leading-relaxed">{service.description}</p>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
