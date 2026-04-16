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
  title: 'About Us | 360 Living Foundation',
  description:
    'Learn about 360 Living Foundation — the social impact arm of the 360 Living Institute. Counselling, mentorship, and life development in Accra, Ghana.',
  alternates: canonicalPath('/about'),
  openGraph: {
    ...rootOpenGraphDefaults,
    title: 'About Us | 360 Living Foundation',
    description:
      'Vision, mission, and story — accessible mental health support and community programmes.',
    url: '/about',
  },
  twitter: {
    ...rootTwitterDefaults,
    title: 'About Us | 360 Living Foundation',
    description:
      'Vision, mission, and story — accessible mental health support and community programmes.',
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
