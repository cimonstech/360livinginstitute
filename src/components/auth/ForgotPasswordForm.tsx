'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ArrowRight, Loader2, CheckCircle2 } from 'lucide-react'

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  async function handleReset() {
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })
    if (resetError) {
      setError(resetError.message)
      setLoading(false)
      return
    }
    setSent(true)
    setLoading(false)
  }

  if (sent) {
    return (
      <div className="flex items-start gap-3">
        <CheckCircle2 size={20} className="text-brand-green flex-shrink-0 mt-0.5" />
        <p className="text-sm font-light text-charcoal-muted leading-relaxed">
          Reset link sent to <strong>{email}</strong>. Check your inbox and follow the instructions.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>
      )}
      <div>
        <label className="text-xs font-medium text-charcoal block mb-1.5">Email Address</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-charcoal focus:outline-none focus:border-brand-pink transition-colors placeholder:text-charcoal-muted/50"
        />
      </div>
      <button
        type="button"
        onClick={handleReset}
        disabled={loading || !email}
        className="bg-brand-pink text-white rounded-full px-6 py-3 text-sm font-medium inline-flex items-center justify-center gap-2 hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <>
            <span>Send Reset Link</span>
            <ArrowRight size={14} />
          </>
        )}
      </button>
    </div>
  )
}
