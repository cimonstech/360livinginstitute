import type { Metadata } from 'next'
import './globals.css'
import { validateEnv } from '@/lib/env'
import { metadataBaseUrl, rootOpenGraphDefaults, rootTwitterDefaults } from '@/lib/seo'

validateEnv()

const defaultTitle = '360 Living Institute'
const defaultDescription =
  'Transforming Lives Through Psychological Insight & Life Development. Counselling, life transition support, and corporate wellness in Accra, Ghana.'

export const metadata: Metadata = {
  metadataBase: metadataBaseUrl(),
  title: defaultTitle,
  description: defaultDescription,
  keywords: ['counselling', 'psychology', 'mental health', 'life transitions', 'Accra', 'Ghana'],
  manifest: '/favicon/site.webmanifest',
  icons: {
    icon: [
      { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: '/favicon/favicon.ico',
    apple: '/favicon/apple-touch-icon.png',
  },
  openGraph: {
    ...rootOpenGraphDefaults,
    title: defaultTitle,
    description: defaultDescription,
    url: '/',
  },
  twitter: {
    ...rootTwitterDefaults,
    title: defaultTitle,
    description: defaultDescription,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
