import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import ServicesHero from '@/components/services/ServicesHero'
import ServicesAccordion from '@/components/services/ServicesAccordion'
import FeaturedPrograms from '@/components/services/FeaturedPrograms'
import ServicesCTA from '@/components/services/ServicesCTA'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Our Services | 360 Living Institute',
  description:
    'Counselling, corporate wellness, life transition support, and more. Explore all services offered by 360 Living Institute in Accra, Ghana.',
}

export default function ServicesPage() {
  return (
    <main>
      <Navbar />
      <ServicesHero />
      <ServicesAccordion />
      <FeaturedPrograms />
      <ServicesCTA />
      <Footer />
    </main>
  )
}
