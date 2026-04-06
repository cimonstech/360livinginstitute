import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import TeamHero from '@/components/team/TeamHero'
import TeamGrid from '@/components/team/TeamGrid'
import TeamValues from '@/components/team/TeamValues'
import TeamCTA from '@/components/team/TeamCTA'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Our Team | 360 Living Institute',
  description:
    'Meet the licensed practitioners and leaders behind 360 Living Institute — dedicated to transforming lives through psychological insight and life development.',
}

export default function TeamPage() {
  return (
    <main>
      <Navbar />
      <TeamHero />
      <TeamGrid />
      <TeamValues />
      <TeamCTA />
      <Footer />
    </main>
  )
}
