import type { Metadata } from 'next'
import SignupForm from '@/components/auth/SignupForm'
import { canonicalPath, privatePageRobots } from '@/lib/seo'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Create Account | 360 Living Institute',
  description: 'Create your 360 Living Institute account to book sessions and access your client portal.',
  ...privatePageRobots(),
  alternates: canonicalPath('/signup'),
}

export default function SignupPage() {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <div className="flex flex-col justify-center px-8 lg:px-16 py-16">
        <Link href="/" className="mb-12">
          <Image src="/images/logo.png" alt="360 Living Institute" width={120} height={40} className="h-10 w-auto" />
        </Link>
        <p className="text-xs font-medium tracking-widest uppercase text-brand-pink mb-2">Get started</p>
        <h1 className="font-lora text-3xl font-normal text-charcoal mb-2">Create your account</h1>
        <p className="text-sm font-light text-charcoal-muted mb-8">
          Already have an account?{' '}
          <Link href="/login" className="text-brand-pink hover:underline">
            Sign in
          </Link>
        </p>
        <SignupForm />
      </div>
      <div className="hidden lg:block relative min-h-screen bg-brand-pink-pale">
        <Image src="/images/portrait-gorgeous.avif" alt="" fill className="object-cover object-top opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-br from-brand-pink/20 to-transparent" />
      </div>
    </div>
  )
}
