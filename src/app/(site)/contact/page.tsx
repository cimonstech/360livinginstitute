import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import ContactHero from '@/components/contact/ContactHero'
import ContactForm from '@/components/contact/ContactForm'
import ContactInfo from '@/components/contact/ContactInfo'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Contact Us | 360 Living Institute',
  description:
    'Get in touch with 360 Living Institute. Book a session, partner with us, invite us to speak, or simply reach out.',
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
