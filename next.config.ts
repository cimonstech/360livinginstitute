import type { NextConfig } from 'next'

function r2RemotePattern(): { protocol: 'https'; hostname: string; pathname: string } | null {
  const raw = process.env.CLOUDFLARE_R2_PUBLIC_URL
  if (!raw) return null
  try {
    const host = new URL(raw).hostname
    if (host) return { protocol: 'https', hostname: host, pathname: '/**' }
  } catch {
    /* ignore */
  }
  return null
}

const r2 = r2RemotePattern()

/** Cloudflare R2 public URLs are https://pub-….r2.dev — wildcard so next/image works without env at config time */
const r2DevPattern = {
  protocol: 'https' as const,
  hostname: '**.r2.dev',
  pathname: '/**' as const,
}

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [
      r2DevPattern,
      { protocol: 'https', hostname: '*.supabase.co', pathname: '/**' },
      ...(r2 ? [r2] : []),
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
      {
        source: '/images/(.*)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ]
  },
}

export default nextConfig
