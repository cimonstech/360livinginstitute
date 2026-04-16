'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { createPortal } from 'react-dom'
import { CheckCircle2, Loader2, X } from 'lucide-react'
import { HONEYPOT_FIELD } from '@/lib/honeypot'

type Props = { isOpen: boolean; onClose: () => void }

const availabilityOptions = ['Weekdays', 'Weekends', 'Both', 'Flexible'] as const

export default function VolunteerModal({ isOpen, onClose }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [honeypot, setHoneypot] = useState('')
  const [formLoadedAt, setFormLoadedAt] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    occupation: '',
    skills: '',
    availability: '',
    motivation: '',
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
      occupation: '',
      skills: '',
      availability: '',
      motivation: '',
    })
  }, [isOpen])

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
      const res = await fetch('/api/foundation/volunteer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          occupation: formData.occupation,
          skills: formData.skills,
          availability: formData.availability,
          motivation: formData.motivation,
          [HONEYPOT_FIELD]: honeypot,
          form_loaded_at: formLoadedAt ?? undefined,
          form_submitted_at: Date.now(),
        }),
      })
      const data = (await res.json()) as { error?: string }
      if (!res.ok) throw new Error(data.error || 'Failed to submit volunteer signup.')
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit volunteer signup.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen || typeof document === 'undefined') return null

  return createPortal(
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm" onClick={onClose}>
      <div className="h-full w-full overflow-y-auto rounded-none bg-white shadow-2xl md:h-auto md:max-h-[90vh] md:max-w-lg md:rounded-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="border-b border-gray-100 p-6">
          <p className="font-dm text-xs font-medium uppercase tracking-widest text-brand-pink">Volunteer With Us</p>
          <h2 className="mt-1 font-lora text-xl text-charcoal">Be part of a movement changing lives</h2>
          <button type="button" onClick={onClose} className="absolute right-5 top-5 rounded-full p-1 text-charcoal-muted hover:bg-charcoal-light" aria-label="Close modal">
            <X size={18} />
          </button>
        </div>
        {success ? (
          <div className="p-6 text-center">
            <CheckCircle2 className="mx-auto text-brand-green" size={48} strokeWidth={1.5} />
            <h3 className="mt-4 font-lora text-2xl text-charcoal">Welcome to the movement, {formData.fullName}!</h3>
            <p className="mt-3 font-dm text-sm text-charcoal-muted">
              We&apos;re excited to have you with us. We&apos;ll reach out soon with volunteer opportunities.
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
            <label className="font-dm text-sm text-charcoal">Occupation<input type="text" value={formData.occupation} onChange={(e) => setFormData((f) => ({ ...f, occupation: e.target.value }))} className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:border-brand-pink focus:outline-none" /></label>
            <label className="font-dm text-sm text-charcoal">Skills or areas you can contribute<textarea rows={2} placeholder="e.g. counselling, event coordination, social media, teaching..." value={formData.skills} onChange={(e) => setFormData((f) => ({ ...f, skills: e.target.value }))} className="mt-1 w-full resize-y rounded-xl border border-gray-200 px-4 py-2.5 focus:border-brand-pink focus:outline-none" /></label>
            <label className="font-dm text-sm text-charcoal">Availability<select value={formData.availability} onChange={(e) => setFormData((f) => ({ ...f, availability: e.target.value }))} className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:border-brand-pink focus:outline-none"><option value="">Select availability...</option>{availabilityOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}</select></label>
            <label className="font-dm text-sm text-charcoal">Why do you want to volunteer?<textarea rows={3} value={formData.motivation} onChange={(e) => setFormData((f) => ({ ...f, motivation: e.target.value }))} className="mt-1 w-full resize-y rounded-xl border border-gray-200 px-4 py-2.5 focus:border-brand-pink focus:outline-none" /></label>
            {error ? <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 font-dm text-sm text-red-700">{error}</p> : null}
            <button type="submit" disabled={loading} className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-pink px-6 py-3 font-dm text-sm font-medium text-white hover:opacity-90 disabled:opacity-60">{loading ? <Loader2 className="animate-spin" size={16} /> : null}Submit Volunteer Signup</button>
          </form>
        )}
      </div>
    </div>,
    document.body
  )
}
