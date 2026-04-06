import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import { canonicalPath, rootOpenGraphDefaults, rootTwitterDefaults } from '@/lib/seo'
import AboutHero from '@/components/about/AboutHero'
import OurStory from '@/components/about/OurStory'
import MissionVision from '@/components/about/MissionVision'
import OurValues from '@/components/about/OurValues'
import OurModel from '@/components/about/OurModel'
import TeamPreview from '@/components/about/TeamPreview'
import AboutCTA from '@/components/about/AboutCTA'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'About Us | 360 Living Institute',
  description:
    'Learn about 360 Living Institute — a center for psychological insight, counselling, and life development in Accra, Ghana.',
  alternates: canonicalPath('/about'),
  openGraph: {
    ...rootOpenGraphDefaults,
    title: 'About Us | 360 Living Institute',
    description:
      'Learn about 360 Living Institute — a center for psychological insight, counselling, and life development in Accra, Ghana.',
    url: '/about',
  },
  twitter: {
    ...rootTwitterDefaults,
    title: 'About Us | 360 Living Institute',
    description:
      'Learn about 360 Living Institute — a center for psychological insight, counselling, and life development in Accra, Ghana.',
  },
}

export default function AboutPage() {
  return (
    <main>
      <Navbar />
      <AboutHero />
      <OurStory />
      <MissionVision />
      <OurValues />
      <OurModel />
      <TeamPreview />
      <AboutCTA />
      <Footer />
    </main>
  )
}
