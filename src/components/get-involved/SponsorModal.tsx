'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { createPortal } from 'react-dom'
import { CheckCircle2, Info, Loader2, X } from 'lucide-react'
import { HONEYPOT_FIELD } from '@/lib/honeypot'
import { programOptions } from '@/components/get-involved/programOptions'

type Props = {
  isOpen: boolean
  onClose: () => void
  type?: 'sponsor' | 'donate'
}

export default function SponsorModal({ isOpen, onClose, type = 'sponsor' }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [honeypot, setHoneypot] = useState('')
  const [formLoadedAt, setFormLoadedAt] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    organisation: '',
    programInterest: '',
    message: '',
  })

  useEffect(() => {
    if (!isOpen) return
    setLoading(false)
    setError('')
    setSuccess(false)
    setHoneypot('')
    setFormLoadedAt(Date.now())
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      organisation: '',
      programInterest: '',
      message: '',
    })
  }, [isOpen, type])

  useEffect(() => {
    if (!isOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/foundation/sponsor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          organisation: formData.organisation,
          inquiry_type: type,
          program_interest: formData.programInterest,
          message: formData.message,
          [HONEYPOT_FIELD]: honeypot,
          form_loaded_at: formLoadedAt ?? undefined,
          form_submitted_at: Date.now(),
        }),
      })
      const data = (await res.json()) as { error?: string }
      if (!res.ok) throw new Error(data.error || 'Failed to submit inquiry.')
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit inquiry.')
    } finally {
      setLoading(false)
    }
  }

  const heading = type === 'sponsor' ? 'Sponsor a Programme' : 'Make a Donation'
  const subheading =
    type === 'sponsor'
      ? 'Support individuals who need access to transformation opportunities'
      : 'Support the transformation of lives and communities'

  if (!isOpen || typeof document === 'undefined') return null

  return createPortal(
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm" onClick={onClose}>
      <div className="h-full w-full overflow-y-auto rounded-none bg-white shadow-2xl md:h-auto md:max-h-[90vh] md:max-w-lg md:rounded-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="border-b border-gray-100 p-6">
          <p className="font-dm text-xs font-medium uppercase tracking-widest text-brand-pink">{type === 'sponsor' ? 'Sponsor a Programme' : 'Donate'}</p>
          <h2 className="mt-1 font-lora text-xl text-charcoal">{heading}</h2>
          <p className="mt-1 font-dm text-xs text-charcoal-muted">{subheading}</p>
          <button type="button" onClick={onClose} className="absolute right-5 top-5 rounded-full p-1 text-charcoal-muted hover:bg-charcoal-light" aria-label="Close modal">
            <X size={18} />
          </button>
        </div>
        {success ? (
          <div className="p-6 text-center">
            <CheckCircle2 className="mx-auto text-brand-green" size={48} strokeWidth={1.5} />
            <h3 className="mt-4 font-lora text-2xl text-charcoal">Thank you, {formData.fullName}!</h3>
            <p className="mt-3 font-dm text-sm text-charcoal-muted">
              {type === 'sponsor'
                ? "Thank you for your generous support! We'll reach out within 1-2 business days to discuss your sponsorship."
                : "Thank you for your generosity! We'll be in touch soon with details on how to proceed with your donation."}
            </p>
            <button type="button" onClick={onClose} className="mt-6 rounded-full bg-brand-pink px-6 py-2.5 font-dm text-sm font-medium text-white hover:opacity-90">Close</button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="relative flex flex-col gap-4 p-6">
            <div style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0, overflow: 'hidden' }} aria-hidden="true">
              <input type="text" name={HONEYPOT_FIELD} value={honeypot} onChange={(e) => setHoneypot(e.target.value)} tabIndex={-1} autoComplete="nope" />
            </div>
            <label className="font-dm text-sm text-charcoal">Full Name *<input required type="text" value={formData.fullName} onChange={(e) => setFormData((f) => ({ ...f, fullName: e.target.value }))} className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:border-brand-pink focus:outline-none" /></label>
            <label className="font-dm text-sm text-charcoal">Email Address *<input required type="email" value={formData.email} onChange={(e) => setFormData((f) => ({ ...f, email: e.target.value }))} className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:border-brand-pink focus:outline-none" /></label>
            <label className="font-dm text-sm text-charcoal">Phone Number<input type="tel" value={formData.phone} onChange={(e) => setFormData((f) => ({ ...f, phone: e.target.value }))} className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:border-brand-pink focus:outline-none" /></label>
            <label className="font-dm text-sm text-charcoal">Organisation (optional)<input type="text" value={formData.organisation} onChange={(e) => setFormData((f) => ({ ...f, organisation: e.target.value }))} className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:border-brand-pink focus:outline-none" /></label>
            {type === 'sponsor' ? (
              <label className="font-dm text-sm text-charcoal">Programme of interest<select value={formData.programInterest} onChange={(e) => setFormData((f) => ({ ...f, programInterest: e.target.value }))} className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:border-brand-pink focus:outline-none"><option value="">Select a programme...</option><option value="general">General / Any Programme</option>{Object.entries(programOptions).filter(([key]) => key !== 'general').map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></label>
            ) : null}
            <label className="font-dm text-sm text-charcoal">Message<textarea rows={3} placeholder={type === 'sponsor' ? "Tell us how you'd like to support..." : 'Any message or dedication...'} value={formData.message} onChange={(e) => setFormData((f) => ({ ...f, message: e.target.value }))} className="mt-1 w-full resize-y rounded-xl border border-gray-200 px-4 py-2.5 focus:border-brand-pink focus:outline-none" /></label>

            <div className="mt-2 rounded-xl bg-brand-green-pale p-4">
              <p className="flex items-start gap-2 font-dm text-xs text-charcoal-muted">
                <Info className="mt-0.5 shrink-0 text-brand-green" size={14} />
                After submitting, our team will reach out to discuss the details of your support and how to proceed with the transfer.
              </p>
            </div>

            {error ? <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 font-dm text-sm text-red-700">{error}</p> : null}
            <button type="submit" disabled={loading} className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-pink px-6 py-3 font-dm text-sm font-medium text-white hover:opacity-90 disabled:opacity-60">{loading ? <Loader2 className="animate-spin" size={16} /> : null}{type === 'sponsor' ? 'Submit Sponsorship Inquiry' : 'Submit Donation Inquiry'}</button>
          </form>
        )}
      </div>
    </div>,
    document.body
  )
}
