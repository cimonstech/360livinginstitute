'use client'

import type { BookingFormData } from '@/types'

type Props = {
  formData: Partial<BookingFormData>
  onChange: (data: Partial<BookingFormData>) => void
  isLoggedIn: boolean
  sessionName?: string
}

export default function StepDetails({ formData, onChange, isLoggedIn, sessionName }: Props) {
  const inputClass =
    'w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-charcoal focus:outline-none focus:border-brand-pink transition-colors placeholder:text-charcoal-muted/50 font-dm'

  return (
    <div>
      <h2 className="font-lora text-xl text-charcoal mb-1">Your details</h2>
      <p className="font-dm text-sm text-charcoal-muted font-light mb-6">
        Tell us how to reach you. Everything you share is kept confidential.
      </p>

      {isLoggedIn && sessionName && (
        <p className="text-xs text-brand-green font-dm mb-6">✓ Booking as {sessionName}</p>
      )}

      <div className="flex flex-col gap-4">
        <div>
          <label className="text-xs font-medium text-charcoal block mb-1.5 font-dm">Full Name *</label>
          <input
            type="text"
            value={formData.client_name ?? ''}
            onChange={(e) => onChange({ client_name: e.target.value })}
            className={inputClass}
            placeholder="Your full name"
            required
          />
        </div>
        <div>
          <label className="text-xs font-medium text-charcoal block mb-1.5 font-dm">Email Address *</label>
          <input
            type="email"
            value={formData.client_email ?? ''}
            onChange={(e) => onChange({ client_email: e.target.value })}
            className={inputClass}
            placeholder="your@email.com"
            required
          />
        </div>
        <div>
          <label className="text-xs font-medium text-charcoal block mb-1.5 font-dm">Phone Number</label>
          <input
            type="tel"
            value={formData.client_phone ?? ''}
            onChange={(e) => onChange({ client_phone: e.target.value })}
            className={inputClass}
            placeholder="0XX XXX XXXX"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-charcoal block mb-1.5 font-dm">Notes / What brings you here?</label>
          <textarea
            rows={4}
            value={formData.notes ?? ''}
            onChange={(e) => onChange({ notes: e.target.value })}
            className={inputClass}
            placeholder="Optional — share anything that helps us prepare for your session."
          />
        </div>

        {!isLoggedIn && (
          <>
            <hr className="border-gray-100 my-2" />
            <p className="text-xs font-medium text-charcoal uppercase tracking-wider font-dm">Account (Optional)</p>
            <label className="flex items-start gap-3 mt-2 cursor-pointer">
              <input
                type="checkbox"
                checked={!!formData.create_account}
                onChange={(e) =>
                  onChange({
                    create_account: e.target.checked,
                    ...(!e.target.checked ? { password: undefined, confirm_password: undefined } : {}),
                  })
                }
                className="mt-1 rounded border-gray-300 accent-[#E8007D]"
              />
              <span className="text-sm text-charcoal-muted font-light font-dm leading-relaxed">
                Create an account to track your bookings and manage appointments
              </span>
            </label>
            {formData.create_account && (
              <div className="flex flex-col gap-4 mt-2">
                <div>
                  <label className="text-xs font-medium text-charcoal block mb-1.5 font-dm">Password *</label>
                  <input
                    type="password"
                    value={formData.password ?? ''}
                    onChange={(e) => onChange({ password: e.target.value })}
                    className={inputClass}
                    placeholder="Min. 8 characters"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-charcoal block mb-1.5 font-dm">Confirm Password *</label>
                  <input
                    type="password"
                    value={formData.confirm_password ?? ''}
                    onChange={(e) => onChange({ confirm_password: e.target.value })}
                    className={inputClass}
                    placeholder="Repeat password"
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
