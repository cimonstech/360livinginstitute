import type { Metadata } from 'next'
import ResetPasswordForm from '@/components/auth/ResetPasswordForm'
import { canonicalPath, privatePageRobots } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Set New Password | 360 Living Institute',
  description: 'Choose a new password for your 360 Living Institute account.',
  ...privatePageRobots(),
  alternates: canonicalPath('/auth/reset-password'),
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-6 bg-warm-cream">
      <div className="w-full max-w-md bg-white rounded-2xl p-10 border border-gray-100">
        <h1 className="font-lora text-2xl font-normal text-charcoal mb-2">Set a new password</h1>
        <p className="text-sm font-light text-charcoal-muted mb-8">Choose a strong password for your account.</p>
        <ResetPasswordForm />
      </div>
    </div>
  )
}
