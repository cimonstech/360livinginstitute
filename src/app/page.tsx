import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Hero from '@/components/homepage/Hero'
import TrustBar from '@/components/homepage/TrustBar'
import AboutSection from '@/components/homepage/AboutSection'
import Services from '@/components/homepage/Services'
import MeetExperts from '@/components/homepage/MeetExperts'
import Testimonials from '@/components/homepage/Testimonials'
import CTASection from '@/components/homepage/CTASection'
import Footer from '@/components/layout/Footer'
import StripAuthErrorQuery from '@/components/homepage/StripAuthErrorQuery'
import Link from 'next/link'
import { canonicalPath, rootOpenGraphDefaults, rootTwitterDefaults } from '@/lib/seo'

export const metadata: Metadata = {
  title: '360 Living Institute',
  description:
    'Transforming Lives Through Psychological Insight & Life Development. Counselling, life transition support, and corporate wellness in Accra, Ghana.',
  alternates: canonicalPath('/'),
  openGraph: {
    ...rootOpenGraphDefaults,
    title: '360 Living Institute',
    description:
      'Transforming Lives Through Psychological Insight & Life Development. Counselling, life transition support, and corporate wellness in Accra, Ghana.',
    url: '/',
  },
  twitter: {
    ...rootTwitterDefaults,
    title: '360 Living Institute',
    description:
      'Transforming Lives Through Psychological Insight & Life Development. Counselling, life transition support, and corporate wellness in Accra, Ghana.',
  },
}

type HomeProps = {
  searchParams: Promise<{ error?: string; reason?: string }>
}

export default async function HomePage({ searchParams }: HomeProps) {
  const { error, reason } = await searchParams
  const showUnauthorized = error === 'unauthorized'

  return (
    <main className="bg-white">
      {showUnauthorized && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-950 px-4 py-3 text-sm text-center font-dm">
          <StripAuthErrorQuery />
          <p className="max-w-2xl mx-auto">
            {reason === 'no_profile'
              ? 'We couldn’t finish setting up your account yet. Please try signing in again in a few minutes, or contact support if this keeps happening.'
              : reason === 'not_admin'
                ? 'This area is for staff only. If you need access, please speak to your site administrator.'
                : 'You don’t have permission to open the admin area. Sign in with the account you were given for staff access, or contact us if you need help.'}{' '}
            <Link href="/login?redirect=/admin" className="text-brand-pink font-medium underline underline-offset-2">
              Back to sign in
            </Link>
          </p>
        </div>
      )}
      <Navbar />
      <Hero />
      <TrustBar />
      <AboutSection />
      <Services />
      <MeetExperts />
      <Testimonials />
      <CTASection />
      <Footer />
    </main>
  )
}
