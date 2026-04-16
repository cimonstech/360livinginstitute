import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'
import { validateEnv } from '@/lib/env'
import { metadataBaseUrl, rootOpenGraphDefaults, rootTwitterDefaults } from '@/lib/seo'

validateEnv()

const defaultTitle = '360 Living Foundation'
const defaultDescription =
  'Transforming minds and empowering lives through counselling, mentorship, and life development programmes. Accra, Ghana — Heal, Grow and Rise!'

export const metadata: Metadata = {
  metadataBase: metadataBaseUrl(),
  title: defaultTitle,
  description: defaultDescription,
  keywords: [
    'mental health',
    'counselling',
    'mentorship',
    'Ghana',
    'youth development',
    'women empowerment',
    '360 Living Foundation',
  ],
  manifest: '/favicon/site.webmanifest',
  icons: {
    icon: [
      { url: '/images/logo_favicon.png', sizes: '32x32', type: 'image/png' },
      { url: '/images/logo_favicon.png', sizes: '192x192', type: 'image/png' },
    ],
    shortcut: '/images/logo_favicon.png',
    apple: '/images/logo_favicon.png',
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

const GA_MEASUREMENT_ID = 'G-93EL5VXJ3H'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
        {children}
      </body>
    </html>
  )
}
