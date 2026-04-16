import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { canonicalPath, rootOpenGraphDefaults, rootTwitterDefaults } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Terms of Service | 360 Living Foundation',
  description: 'Terms of service for the 360 Living Foundation website.',
  alternates: canonicalPath('/terms'),
  openGraph: {
    ...rootOpenGraphDefaults,
    title: 'Terms of Service | 360 Living Foundation',
    description: 'Terms of service — content coming soon.',
    url: '/terms',
  },
  twitter: {
    ...rootTwitterDefaults,
    title: 'Terms of Service | 360 Living Foundation',
    description: 'Terms of service — content coming soon.',
  },
}

export default function TermsPage() {
  return (
    <main className="min-h-[50vh] bg-white">
      <Navbar />
      <div className="mx-auto max-w-3xl px-6 py-20 lg:px-10">
        <h1 className="font-lora text-3xl text-charcoal">Terms of Service</h1>
        <p className="mt-4 font-dm text-sm text-charcoal-muted">
          This page will be updated with the full terms of service. For questions, contact us at{' '}
          <a href="mailto:info@360livingfoundation.org" className="text-brand-pink hover:underline">
            info@360livingfoundation.org
          </a>
          .
        </p>
      </div>
      <Footer />
    </main>
  )
}
