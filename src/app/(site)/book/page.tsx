import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import { canonicalPath, rootOpenGraphDefaults, rootTwitterDefaults } from '@/lib/seo'
import BookingWizard from '@/components/booking/BookingWizard'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Book a Session | 360 Living Institute',
  description:
    'Book a counselling session with 360 Living Institute. Choose your service, pick a time, and take the first step.',
  alternates: canonicalPath('/book'),
  openGraph: {
    ...rootOpenGraphDefaults,
    title: 'Book a Session | 360 Living Institute',
    description:
      'Book a counselling session with 360 Living Institute. Choose your service, pick a time, and take the first step.',
    url: '/book',
  },
  twitter: {
    ...rootTwitterDefaults,
    title: 'Book a Session | 360 Living Institute',
    description:
      'Book a counselling session with 360 Living Institute. Choose your service, pick a time, and take the first step.',
  },
}

export default function BookPage() {
  return (
    <main>
      <Navbar />
      <BookingWizard />
      <Footer />
    </main>
  )
}
