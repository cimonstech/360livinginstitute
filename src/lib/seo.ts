import type { Metadata } from 'next'

/** Default share image — resolved against `metadataBase` in root layout */
export const DEFAULT_OG_IMAGE = '/images/african-psychologist.webp' as const

const OG_IMAGE_ALT =
  'Professional psychological care and counselling — 360 Living Institute, Accra, Ghana'

export function publicSiteOrigin(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (configured) return configured.replace(/\/$/, '')
  const vercel = process.env.VERCEL_URL?.trim()
  if (vercel) return `https://${vercel.replace(/\/$/, '')}`
  return 'http://localhost:3000'
}

export function metadataBaseUrl(): URL {
  return new URL(`${publicSiteOrigin()}/`)
}

export const rootOpenGraphDefaults = {
  type: 'website' as const,
  locale: 'en_GH',
  siteName: '360 Living Institute',
  images: [
    {
      url: DEFAULT_OG_IMAGE,
      alt: OG_IMAGE_ALT,
    },
  ],
}

export const rootTwitterDefaults = {
  card: 'summary_large_image' as const,
  images: [DEFAULT_OG_IMAGE],
}

/** Use under `alternates` — paths are resolved relative to root `metadataBase` */
export function canonicalPath(path: string): Metadata['alternates'] {
  const p = path === '/' ? '/' : path.startsWith('/') ? path : `/${path}`
  return { canonical: p }
}

export function privatePageRobots(): Pick<Metadata, 'robots'> {
  return { robots: { index: false, follow: false } }
}
