'use client'

import { useState, type FormEvent } from 'react'
import { HONEYPOT_FIELD } from '@/lib/honeypot'
import { Send, Phone, Mail, Loader2, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { company } from '@/data/content'

const intents = [
  'General Enquiry',
  'Apply for a Program',
  'Partner With Us',
  'Volunteer',
  'Sponsor a Program',
  'Donate',
] as const

/** Accra, Ghana */
const MAP_EMBED_SRC =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127066.23476553749!2d-0.30213969999999997!3d5.591289699999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf90882d9177b7%3A0x63be902517e5f9e!2sAccra!5e0!3m2!1sen!2sgh!4v1700000000000!5m2!1sen!2sgh'

export default function ContactForm() {
  const [intent, setIntent] = useState<(typeof intents)[number]>('General Enquiry')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [organisation, setOrganisation] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)
  const [formLoadedAt] = useState(() => Date.now())
  const [honeypot, setHoneypot] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (honeypot.trim().length > 0) {
      setSent(true)
      return
    }
    if (Date.now() - formLoadedAt < 3000) {
      setSent(true)
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          organisation,
          message,
          intent,
          source: 'contact',
          [HONEYPOT_FIELD]: honeypot,
          form_loaded_at: formLoadedAt,
          form_submitted_at: Date.now(),
        }),
      })
      const data = (await res.json()) as { error?: string }
      if (!res.ok) throw new Error(data.error || 'Something went wrong')
      setSent(true)
      setName('')
      setEmail('')
      setPhone('')
      setOrganisation('')
      setMessage('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="bg-white py-24">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-16 px-6 lg:grid-cols-2 lg:px-10">
        <div>
          <p className="font-dm text-xs font-medium uppercase tracking-widest text-brand-pink">Send a Message</p>
          <h2 className="mt-2 font-lora text-3xl font-normal text-charcoal">We&apos;d love to hear from you</h2>
          <p className="mb-8 mt-2 font-dm text-sm font-light text-charcoal-muted">
            Fill in the form and we&apos;ll get back to you within 24 hours.
          </p>

          {sent ? (
            <div className="rounded-2xl border border-brand-green-light bg-brand-green-pale p-6">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 shrink-0 text-brand-green" aria-hidden />
                <div>
                  <p className="font-dm text-sm font-medium text-charcoal">Message sent</p>
                  <p className="mt-1 font-dm text-sm text-charcoal-muted">
                    Thank you — we&apos;ve received your enquiry and will respond soon.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSent(false)}
                    className="mt-4 font-dm text-xs font-medium text-brand-pink hover:underline"
                  >
                    Send another message
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="relative flex flex-col gap-4">
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 font-dm text-sm text-red-700">
                  {error}
                </div>
              )}
              <div className="mb-2 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {intents.map((label) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setIntent(label)}
                    className={cn(
                      'cursor-pointer rounded-full border px-4 py-2 text-center font-dm text-xs font-medium transition-colors',
                      intent === label
                        ? 'border-brand-pink bg-brand-pink text-white'
                        : 'border-gray-200 bg-white text-charcoal-muted hover:border-charcoal/20'
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div>
                <label className="mb-1.5 block font-dm text-xs font-medium text-charcoal" htmlFor="cf-name">
                  Full Name *
                </label>
                <input
                  id="cf-name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 font-dm text-sm font-light text-charcoal transition-colors placeholder:text-charcoal-muted/50 focus:border-brand-pink focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1.5 block font-dm text-xs font-medium text-charcoal" htmlFor="cf-email">
                  Email Address *
                </label>
                <input
                  id="cf-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 font-dm text-sm font-light text-charcoal transition-colors placeholder:text-charcoal-muted/50 focus:border-brand-pink focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1.5 block font-dm text-xs font-medium text-charcoal" htmlFor="cf-phone">
                  Phone Number
                </label>
                <input
                  id="cf-phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0XX XXX XXXX"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 font-dm text-sm font-light text-charcoal transition-colors placeholder:text-charcoal-muted/50 focus:border-brand-pink focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1.5 block font-dm text-xs font-medium text-charcoal" htmlFor="cf-org">
                  Organisation <span className="font-normal text-charcoal-muted">(optional)</span>
                </label>
                <input
                  id="cf-org"
                  name="organisation"
                  type="text"
                  value={organisation}
                  onChange={(e) => setOrganisation(e.target.value)}
                  placeholder="Your company or organisation"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 font-dm text-sm font-light text-charcoal transition-colors placeholder:text-charcoal-muted/50 focus:border-brand-pink focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1.5 block font-dm text-xs font-medium text-charcoal" htmlFor="cf-message">
                  Message *
                </label>
                <textarea
                  id="cf-message"
                  name="message"
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us how we can help you..."
                  className="w-full resize-y rounded-xl border border-gray-200 px-4 py-3 font-dm text-sm font-light text-charcoal transition-colors placeholder:text-charcoal-muted/50 focus:border-brand-pink focus:outline-none"
                />
              </div>

              <div
                className="absolute -left-[9999px] h-0 overflow-hidden opacity-0"
                aria-hidden="true"
              >
                <label htmlFor="website_url">Website</label>
                <input
                  type="text"
                  id="website_url"
                  name={HONEYPOT_FIELD}
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-pink px-8 py-3.5 font-dm text-sm font-medium text-white transition-colors hover:opacity-90 disabled:opacity-60"
              >
                {loading ? <Loader2 size={16} className="animate-spin" aria-hidden /> : <Send size={14} aria-hidden />}
                Send Message
              </button>
              <p className="mt-3 text-center font-dm text-xs text-charcoal-muted">
                We typically respond within 24 hours · All enquiries are confidential
              </p>
            </form>
          )}
        </div>

        <div>
          <div className="overflow-hidden rounded-2xl ring-1 ring-gray-100">
            <iframe
              src={MAP_EMBED_SRC}
              title="Accra, Ghana — approximate location"
              width={600}
              height={450}
              className="h-64 w-full border-0 sm:h-72 lg:h-80"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
          <div className="mt-4 rounded-2xl bg-brand-pink-pale p-6">
            <p className="font-lora text-lg font-normal text-charcoal">Visit Us</p>
            <p className="mt-2 font-dm text-sm font-light leading-relaxed text-charcoal-muted">{company.address}</p>
            <div className="mt-4 border-t border-brand-pink-light pt-4">
              <p className="font-lora text-base font-normal text-charcoal">Quick Connect</p>
              <div className="mt-3 flex flex-col gap-2">
                <a
                  href={`tel:${company.phone}`}
                  className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2.5 font-dm text-xs font-medium text-charcoal transition-colors hover:border-brand-green/40"
                >
                  <Phone className="text-brand-green" size={14} strokeWidth={1.75} aria-hidden />
                  Call: {company.phoneDisplay}
                </a>
                <a
                  href={`mailto:${company.email}`}
                  className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2.5 font-dm text-xs font-medium text-charcoal transition-colors hover:border-brand-pink/40"
                >
                  <Mail className="text-brand-pink" size={14} strokeWidth={1.75} aria-hidden />
                  Email: {company.email}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
