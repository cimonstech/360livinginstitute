'use client'

import { useState, type FormEvent } from 'react'
import { HONEYPOT_FIELD } from '@/lib/honeypot'
import Image from 'next/image'
import { Loader2, CheckCircle2 } from 'lucide-react'

export default function CTASection() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
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
          message,
          intent: 'Homepage contact form',
          source: 'homepage',
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
      setMessage('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <p className="font-dm text-xs font-medium uppercase tracking-widest text-brand-pink">Contact</p>
        <div className="mt-4 grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          <div>
            <h2 className="font-lora text-3xl font-normal text-charcoal lg:text-4xl">Ready To Begin Your Journey?</h2>
            <p className="mt-3 font-dm text-sm font-light text-charcoal-muted">
              Take the first step. Reach out to us and we&apos;ll guide you to the right support.
            </p>

            {sent ? (
              <div className="mt-8 rounded-2xl border border-brand-green-light bg-brand-green-pale p-5">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 shrink-0 text-brand-green" aria-hidden />
                  <div>
                    <p className="font-dm text-sm font-medium text-charcoal">Message sent</p>
                    <p className="mt-1 font-dm text-sm text-charcoal-muted">
                      Thank you — we&apos;ll get back to you soon.
                    </p>
                    <button
                      type="button"
                      onClick={() => setSent(false)}
                      className="mt-3 font-dm text-xs font-medium text-brand-pink hover:underline"
                    >
                      Send another message
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="relative mt-8 flex flex-col gap-4">
                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 font-dm text-sm text-red-700">
                    {error}
                  </div>
                )}
                <label className="sr-only" htmlFor="cta-name">
                  Your Name
                </label>
                <input
                  id="cta-name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name*"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 font-dm text-sm focus:border-brand-pink focus:outline-none"
                />
                <label className="sr-only" htmlFor="cta-email">
                  Your Email
                </label>
                <input
                  id="cta-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your Email*"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 font-dm text-sm focus:border-brand-pink focus:outline-none"
                />
                <label className="sr-only" htmlFor="cta-message">
                  Message
                </label>
                <textarea
                  id="cta-message"
                  name="message"
                  required
                  placeholder="Message"
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full resize-y rounded-xl border border-gray-200 px-4 py-3 font-dm text-sm focus:border-brand-pink focus:outline-none"
                />
                <div
                  className="absolute -left-[9999px] h-0 overflow-hidden opacity-0"
                  aria-hidden="true"
                >
                  <label htmlFor="cta-website-url">Website</label>
                  <input
                    type="text"
                    id="cta-website-url"
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
                  className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-pink px-8 py-3 font-dm text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                >
                  {loading ? <Loader2 size={18} className="animate-spin" aria-hidden /> : null}
                  Send Message
                </button>
              </form>
            )}
            <p className="mt-3 font-dm text-xs text-charcoal-muted">Or call us directly: 0538045503</p>
          </div>

          <div className="relative">
            <Image
              src="/images/happy-young-man.jpg"
              alt="Supportive care"
              width={800}
              height={960}
              className="h-[480px] w-full rounded-2xl object-cover object-top"
            />
            <div className="absolute bottom-4 left-4 right-4 rounded-xl bg-white p-4 shadow-sm">
              <p className="font-lora text-sm italic text-charcoal">
                &ldquo;The most courageous thing you can do is ask for help. We are here.&rdquo;
              </p>
              <div className="mt-3 flex items-center gap-2">
                <Image
                  src="/images/members/person4.webp"
                  alt=""
                  width={32}
                  height={32}
                  className="h-8 w-8 rounded-full object-cover"
                />
                <div>
                  <p className="font-dm text-sm font-medium text-charcoal">Maame Warren</p>
                  <p className="font-dm text-xs text-charcoal-muted">Wellness Client</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
