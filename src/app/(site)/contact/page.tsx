import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import { canonicalPath, rootOpenGraphDefaults, rootTwitterDefaults } from '@/lib/seo'
import ContactHero from '@/components/contact/ContactHero'
import ContactForm from '@/components/contact/ContactForm'
import ContactInfo from '@/components/contact/ContactInfo'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Contact Us | 360 Living Foundation',
  description:
    'Reach the 360 Living Foundation in Accra, Ghana. Email info@360livingfoundation.org or call 0264589293.',
  alternates: canonicalPath('/contact'),
  openGraph: {
    ...rootOpenGraphDefaults,
    title: 'Contact Us | 360 Living Foundation',
    description: 'We would love to hear from you — programmes, partnerships, and more.',
    url: '/contact',
  },
  twitter: {
    ...rootTwitterDefaults,
    title: 'Contact Us | 360 Living Foundation',
    description: 'We would love to hear from you — programmes, partnerships, and more.',
  },
}

export default function ContactPage() {
  return (
    <main>
      <Navbar />
      <ContactHero />
      <ContactForm />
      <ContactInfo />
      <Footer />
    </main>
  )
}
