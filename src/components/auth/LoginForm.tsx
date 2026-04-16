'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [needsEmailVerify, setNeedsEmailVerify] = useState(false)
  const [resending, setResending] = useState(false)
  const [resendMsg, setResendMsg] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/admin'

  async function handleResend() {
    if (!email) return
    setResending(true)
    setResendMsg('')
    setError('')
    const supabase = createClient()
    const { error: resendError } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    })
    if (resendError) {
      setError(resendError.message)
      setResending(false)
      return
    }
    setResendMsg('Verification email sent. Please check your inbox (and spam).')
    setResending(false)
  }

  async function handleLogin() {
    setLoading(true)
    setError('')
    setResendMsg('')
    setNeedsEmailVerify(false)
    const supabase = createClient()
    const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password })
    if (signInError) {
      setError(signInError.message)
      const msg = signInError.message.toLowerCase()
      if (msg.includes('email') && (msg.includes('confirm') || msg.includes('verify') || msg.includes('verified'))) {
        setNeedsEmailVerify(true)
      }
      setLoading(false)
      return
    }
    await supabase.auth.getSession()

    const safe = redirect.startsWith('/') && !redirect.startsWith('//') ? redirect : '/admin'
    const params = new URLSearchParams({ redirect: safe })
    let target = safe
    for (let attempt = 0; attempt < 5; attempt++) {
      const res = await fetch(`/api/auth/post-login-target?${params}`, {
        credentials: 'same-origin',
        cache: 'no-store',
      })
      if (res.ok) {
        const body = (await res.json()) as { target?: string }
        if (typeof body.target === 'string' && body.target.startsWith('/')) {
          target = body.target
        }
        break
      }
      await new Promise((r) => setTimeout(r, 120 * (attempt + 1)))
    }

    await router.refresh()
    router.replace(target)
    setLoading(false)
  }

  return (
    <form
      className="flex flex-col gap-4 max-w-sm"
      onSubmit={(e) => {
        e.preventDefault()
        if (loading || !email || !password) return
        void handleLogin()
      }}
    >
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>
      )}
      {needsEmailVerify && (
        <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-charcoal">
          <p className="font-dm text-sm text-charcoal">
            Your email isn’t verified yet. Please check your inbox for the confirmation link.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => void handleResend()}
              disabled={resending || !email}
              className="inline-flex items-center justify-center rounded-full border border-gray-200 px-4 py-2 text-xs font-dm text-charcoal-muted hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resending ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Resending…</span>
                </>
              ) : (
                'Resend confirmation email'
              )}
            </button>
            {resendMsg && <span className="text-xs text-brand-green font-dm">{resendMsg}</span>}
          </div>
        </div>
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
      <div>
        <label className="text-xs font-medium text-charcoal block mb-1.5">Password</label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-11 text-sm text-charcoal focus:outline-none focus:border-brand-pink transition-colors placeholder:text-charcoal-muted/50"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-muted hover:text-charcoal"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        <div className="flex justify-end mt-1.5">
          <Link href="/forgot-password" className="text-xs text-brand-pink hover:underline">
            Forgot password?
          </Link>
        </div>
      </div>
      <button
        type="submit"
        disabled={loading || !email || !password}
        className="bg-brand-pink text-white rounded-full px-6 py-3 text-sm font-medium inline-flex items-center justify-center gap-2 hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
      >
        {loading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <>
            <span>Sign In</span>
            <ArrowRight size={14} />
          </>
        )}
      </button>
    </form>
  )
}
