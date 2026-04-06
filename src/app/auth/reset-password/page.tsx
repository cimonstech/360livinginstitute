import ResetPasswordForm from '@/components/auth/ResetPasswordForm'

export const metadata = { title: 'Set New Password | 360 Living Institute' }

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
