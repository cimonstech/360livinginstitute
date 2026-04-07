'use client'

import type { BookingFormData, PricingSettings } from '@/types'
import { format, parseISO } from 'date-fns'
import { Lock, Phone } from 'lucide-react'

type Props = {
  formData: Partial<BookingFormData>
  pricing: PricingSettings | null
  /** Resolved session price in GHS, or null when hidden */
  sessionPriceGhs: number | null
}

function formatTime12(time: string) {
  const [h, m] = time.split(':').map(Number)
  const d = new Date(2000, 0, 1, h, m || 0)
  return format(d, 'h:mm a')
}

export default function StepConfirm({ formData, pricing, sessionPriceGhs }: Props) {
  const dateStr = formData.appointment_date
  const formattedDate = dateStr
    ? format(parseISO(dateStr + 'T12:00:00'), 'EEEE, d MMMM yyyy')
    : '—'

  const instructions =
    pricing?.payment_instructions ??
    'Payment is made via Mobile Money (MoMo). Use your Booking ID as the payment reference. Send payment to: 0538045503 (Selasi Doku). Once payment is made, your session will be confirmed.'
  const momoNumber = pricing?.momo_number ?? '0538045503'
  const momoName = pricing?.momo_name ?? 'Selasi Doku'

  return (
    <div>
      <h2 className="font-lora text-xl text-charcoal mb-1">Confirm your booking</h2>
      <p className="font-dm text-sm text-charcoal-muted font-light mb-6">
        Please review your details before submitting your request.
      </p>

      <div className="bg-brand-pink-pale rounded-2xl p-6 mb-6">
        <p className="text-xs font-medium uppercase tracking-wider text-brand-pink font-dm mb-4">Booking Summary</p>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 font-dm text-sm">
          <div>
            <dt className="text-charcoal-muted text-xs">Service</dt>
            <dd className="text-charcoal font-medium">{formData.service_title ?? '—'}</dd>
          </div>
          <div>
            <dt className="text-charcoal-muted text-xs">Date</dt>
            <dd className="text-charcoal font-medium">{formattedDate}</dd>
          </div>
          <div>
            <dt className="text-charcoal-muted text-xs">Time</dt>
            <dd className="text-charcoal font-medium">
              {formData.appointment_time ? formatTime12(formData.appointment_time) : '—'}
            </dd>
          </div>
          <div>
            <dt className="text-charcoal-muted text-xs">Name</dt>
            <dd className="text-charcoal font-medium">{formData.client_name ?? '—'}</dd>
          </div>
          <div>
            <dt className="text-charcoal-muted text-xs">Email</dt>
            <dd className="text-charcoal font-medium break-all">{formData.client_email ?? '—'}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-charcoal-muted text-xs">Phone</dt>
            <dd className="text-charcoal font-medium">{formData.client_phone?.trim() ? formData.client_phone : 'Not provided'}</dd>
          </div>
        </dl>
        {formData.notes?.trim() && (
          <p className="text-sm text-charcoal-muted italic mt-3 font-dm leading-relaxed">&ldquo;{formData.notes}&rdquo;</p>
        )}
      </div>

      <div className="bg-brand-green-pale border border-brand-green-light rounded-2xl p-6 mt-4">
        <div className="flex items-start gap-3 mb-4">
          <Phone size={16} className="text-brand-green flex-shrink-0 mt-0.5" aria-hidden />
          <div>
            <p className="text-sm font-medium text-charcoal font-dm">Payment via Mobile Money (MoMo)</p>
            <p className="text-xs text-charcoal-muted mt-1 leading-relaxed font-dm font-light">{instructions}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs text-charcoal-muted font-dm">Send payment to</p>
            <p className="font-medium text-sm text-charcoal mt-0.5 font-dm">{momoNumber}</p>
            <p className="text-xs text-charcoal-muted font-dm">{momoName}</p>
          </div>
          {sessionPriceGhs != null && (
            <div className="text-left sm:text-right">
              <p className="text-xs text-charcoal-muted font-dm">Amount</p>
              <p className="font-lora text-xl font-medium text-brand-pink mt-0.5">
                GHS {sessionPriceGhs.toFixed(2)}
              </p>
            </div>
          )}
        </div>
        <p className="text-xs text-charcoal-muted mt-3 text-center font-dm font-light">
          Your Booking ID will be shown after confirmation — use it as your payment reference.
        </p>
      </div>

      <div className="bg-brand-green-pale rounded-xl p-4 flex items-start gap-3 mt-4">
        <Lock className="text-brand-green flex-shrink-0 mt-0.5" size={16} aria-hidden />
        <p className="text-xs text-charcoal-muted leading-relaxed font-light font-dm">
          Your booking information is completely confidential. Only our licensed practitioners and admin team will have access to your details.
        </p>
      </div>
    </div>
  )
}
