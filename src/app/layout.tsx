import type { Metadata } from 'next'
import './globals.css'
import { validateEnv } from '@/lib/env'

validateEnv()

export const metadata: Metadata = {
  title: '360 Living Institute',
  description:
    'Transforming Lives Through Psychological Insight & Life Development. Counselling, life transition support, and corporate wellness in Accra, Ghana.',
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
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
