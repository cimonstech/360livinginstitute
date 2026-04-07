import type { Metadata } from 'next'
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm'
import { canonicalPath, privatePageRobots } from '@/lib/seo'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Reset Password | 360 Living Institute',
  description: 'Request a link to reset your 360 Living Institute account password.',
  ...privatePageRobots(),
  alternates: canonicalPath('/forgot-password'),
}

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-6 bg-warm-cream">
      <div className="w-full max-w-md bg-white rounded-2xl p-10 border border-gray-100">
        <Link href="/" className="block mb-8">
          <Image src="/images/logo2.png" alt="360 Living Institute" width={100} height={34} className="h-8 w-auto" />
        </Link>
        <p className="text-xs font-medium tracking-widest uppercase text-brand-pink mb-2">Account Recovery</p>
        <h1 className="font-lora text-2xl font-normal text-charcoal mb-2">Reset your password</h1>
        <p className="text-sm font-light text-charcoal-muted mb-8">
          Enter your email and we&apos;ll send you a reset link.
        </p>
        <ForgotPasswordForm />
        <p className="text-center mt-6 text-xs text-charcoal-muted">
          Remember your password?{' '}
          <Link href="/login" className="text-brand-pink hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
