import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { canonicalPath, rootOpenGraphDefaults, rootTwitterDefaults } from '@/lib/seo'
import GetInvolvedPageContent from '@/components/get-involved/GetInvolvedPageContent'

export const metadata: Metadata = {
  title: 'Get Involved | 360 Living Foundation',
  description:
    'Apply for a programme, partner with us, volunteer, sponsor, or donate — join the movement for mental empowerment in Ghana.',
  alternates: canonicalPath('/get-involved'),
  openGraph: {
    ...rootOpenGraphDefaults,
    title: 'Get Involved | 360 Living Foundation',
    description: 'Apply, partner, volunteer, sponsor, or donate.',
    url: '/get-involved',
  },
  twitter: {
    ...rootTwitterDefaults,
    title: 'Get Involved | 360 Living Foundation',
    description: 'Apply, partner, volunteer, sponsor, or donate.',
  },
}

export default function GetInvolvedPage() {
  return (
    <main className="bg-white">
      <Navbar />
      <GetInvolvedPageContent />

      <Footer />
    </main>
  )
}
