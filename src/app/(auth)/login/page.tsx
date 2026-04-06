import type { Metadata } from 'next'
import { Suspense } from 'react'
import LoginForm from '@/components/auth/LoginForm'
import { canonicalPath, privatePageRobots } from '@/lib/seo'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Sign In | 360 Living Institute',
  description: 'Sign in to your 360 Living Institute account to manage bookings and access your dashboard.',
  ...privatePageRobots(),
  alternates: canonicalPath('/login'),
}

export default function LoginPage() {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <div className="flex flex-col justify-center px-8 lg:px-16 py-16">
        <Link href="/" className="mb-12">
          <Image src="/images/logo.png" alt="360 Living Institute" width={120} height={40} className="h-10 w-auto" />
        </Link>
        <p className="text-xs font-medium tracking-widest uppercase text-brand-pink mb-2">Welcome back</p>
        <h1 className="font-lora text-3xl font-normal text-charcoal mb-2">Sign in to your account</h1>
        <p className="text-sm font-light text-charcoal-muted mb-8">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-brand-pink hover:underline">
            Create one
          </Link>
        </p>
        <Suspense fallback={<div className="max-w-sm h-56 rounded-xl bg-charcoal-light/60 animate-pulse" />}>
          <LoginForm />
        </Suspense>
      </div>
      <div className="hidden lg:block relative min-h-screen bg-brand-pink-pale">
        <Image src="/anxietydisorder.jpeg" alt="" fill className="object-cover object-center opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-br from-brand-pink/30 to-transparent" />
        <div className="absolute bottom-12 left-12 right-12">
          <p className="font-lora text-2xl italic text-charcoal leading-snug">
            &ldquo;Transformation is not an event — it is a process we walk with you, step by step.&rdquo;
          </p>
          <p className="text-sm text-charcoal-muted mt-3">— Selasi Doku, Executive Director</p>
        </div>
      </div>
    </div>
  )
}
