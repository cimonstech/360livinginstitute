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
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/dashboard'

  async function handleLogin() {
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password })
    if (signInError) {
      setError(signInError.message)
      setLoading(false)
      return
    }
    await supabase.auth.getSession()

    const safe = redirect.startsWith('/') && !redirect.startsWith('//') ? redirect : '/dashboard'
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
