import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import { canonicalPath, rootOpenGraphDefaults, rootTwitterDefaults } from '@/lib/seo'
import ServicesHero from '@/components/services/ServicesHero'
import ServicesAccordion from '@/components/services/ServicesAccordion'
import ServicesCTA from '@/components/services/ServicesCTA'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Our Programs | 360 Living Foundation',
  description:
    'Thrive360 Experience, 360 Transformation Lab, Thrive360 Accelerator, and community outreach — counselling, mentorship, and life development in Ghana.',
  alternates: canonicalPath('/programs'),
  openGraph: {
    ...rootOpenGraphDefaults,
    title: 'Our Programs | 360 Living Foundation',
    description:
      'Structured programmes for growth — from inspiration to transformation to acceleration. Accra, Ghana.',
    url: '/programs',
  },
  twitter: {
    ...rootTwitterDefaults,
    title: 'Our Programs | 360 Living Foundation',
    description:
      'Structured programmes for growth — from inspiration to transformation to acceleration. Accra, Ghana.',
  },
}

export default function ProgramsPage() {
  return (
    <main>
      <Navbar />
      <ServicesHero />
      <ServicesAccordion />
      <ServicesCTA />
      <Footer />
    </main>
  )
}
