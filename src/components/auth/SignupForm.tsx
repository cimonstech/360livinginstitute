'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Eye, EyeOff, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react'

export default function SignupForm() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleSignup() {
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, phone, role: 'client' },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }
    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div className="max-w-sm">
        <div className="flex items-center gap-3 mb-4">
          <CheckCircle2 size={32} className="text-brand-green flex-shrink-0" />
          <h2 className="font-lora text-xl text-charcoal">Check your email!</h2>
        </div>
        <p className="text-sm font-light text-charcoal-muted leading-relaxed">
          We sent a verification link to <strong>{email}</strong>. Click the link to verify your account and get started.
        </p>
      </div>
    )
  }

  return (
    <form
      className="flex flex-col gap-4 max-w-sm"
      onSubmit={(e) => {
        e.preventDefault()
        if (loading || !fullName || !email || !password || !confirmPassword) return
        void handleSignup()
      }}
    >
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>
      )}
      <div>
        <label className="text-xs font-medium text-charcoal block mb-1.5">Full Name *</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Your full name"
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-charcoal focus:outline-none focus:border-brand-pink transition-colors placeholder:text-charcoal-muted/50"
        />
      </div>
      <div>
        <label className="text-xs font-medium text-charcoal block mb-1.5">Email Address *</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-charcoal focus:outline-none focus:border-brand-pink transition-colors placeholder:text-charcoal-muted/50"
        />
      </div>
      <div>
        <label className="text-xs font-medium text-charcoal block mb-1.5">Phone Number</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="0XX XXX XXXX"
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-charcoal focus:outline-none focus:border-brand-pink transition-colors placeholder:text-charcoal-muted/50"
        />
      </div>
      <div>
        <label className="text-xs font-medium text-charcoal block mb-1.5">Password *</label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Min. 8 characters"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-11 text-sm text-charcoal focus:outline-none focus:border-brand-pink transition-colors placeholder:text-charcoal-muted/50"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-muted"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>
      <div>
        <label className="text-xs font-medium text-charcoal block mb-1.5">Confirm Password *</label>
        <div className="relative">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repeat password"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-11 text-sm text-charcoal focus:outline-none focus:border-brand-pink transition-colors placeholder:text-charcoal-muted/50"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-muted"
          >
            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>
      <p className="text-xs text-charcoal-muted -mt-2">
        By creating an account, you agree that your information is handled confidentially.
      </p>
      <button
        type="submit"
        disabled={loading || !fullName || !email || !password || !confirmPassword}
        className="bg-brand-pink text-white rounded-full px-6 py-3 text-sm font-medium inline-flex items-center justify-center gap-2 hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
      >
        {loading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <>
            <span>Create Account</span>
            <ArrowRight size={14} />
          </>
        )}
      </button>
    </form>
  )
}
