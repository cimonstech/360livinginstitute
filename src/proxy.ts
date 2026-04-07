import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

function rateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): { allowed: boolean; remaining: number } {
  const now = Date.now()
  const record = rateLimitMap.get(key)

  if (!record || now > record.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs })
    return { allowed: true, remaining: maxRequests - 1 }
  }

  if (record.count >= maxRequests) {
    return { allowed: false, remaining: 0 }
  }

  record.count++
  return { allowed: true, remaining: maxRequests - record.count }
}

setInterval(() => {
  const now = Date.now()
  for (const [key, value] of rateLimitMap.entries()) {
    if (now > value.resetTime) rateLimitMap.delete(key)
  }
}, 5 * 60 * 1000)

function buildContentSecurityPolicy(): string {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || ''
  const r2 = process.env.CLOUDFLARE_R2_PUBLIC_URL?.trim() || ''
  const extras: string[] = ['https://*.supabase.co', 'https://*.r2.dev']
  try {
    if (supabaseUrl) extras.push(new URL(supabaseUrl).origin)
  } catch {
    /* ignore */
  }
  try {
    if (r2) extras.push(new URL(r2).origin)
  } catch {
    /* ignore */
  }
  const imgExtra = extras.length ? ` ${extras.join(' ')}` : ''

  return [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    `img-src 'self' data: blob: https:${imgExtra}`,
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
    "frame-src https://www.google.com https://*.google.com",
    "frame-ancestors 'none'",
  ].join('; ')
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'

  const rateLimits: Record<string, { max: number; window: number }> = {
    '/api/appointments/create': { max: 5, window: 60 * 1000 },
    '/api/appointments/notify': { max: 10, window: 60 * 1000 },
    '/api/events/register': { max: 10, window: 60 * 1000 },
    '/api/blog/save': { max: 20, window: 60 * 1000 },
    '/api/media/upload': { max: 10, window: 60 * 1000 },
    '/api/contact': { max: 3, window: 60 * 1000 },
  }

  for (const [route, limit] of Object.entries(rateLimits)) {
    if (pathname.startsWith(route)) {
      const key = `${route}:${ip}`
      const { allowed } = rateLimit(key, limit.max, limit.window)
      if (!allowed) {
        return new NextResponse(JSON.stringify({ error: 'Too many requests. Please try again later.' }), {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': '60',
            'X-RateLimit-Remaining': '0',
          },
        })
      }
      break
    }
  }

  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // Never mutate request.cookies in middleware; set on response only.
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (pathname.startsWith('/admin')) {
    if (!user) {
      return NextResponse.redirect(new URL('/login?redirect=/admin', request.url))
    }
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()

    if (!profile || profile.role !== 'admin') {
      const url = new URL('/', request.url)
      url.searchParams.set('error', 'unauthorized')
      url.searchParams.set('reason', !profile ? 'no_profile' : 'not_admin')
      return NextResponse.redirect(url)
    }
  }

  if (pathname.startsWith('/dashboard')) {
    if (!user) {
      return NextResponse.redirect(new URL('/login?redirect=/dashboard', request.url))
    }
  }

  supabaseResponse.headers.set('X-Frame-Options', 'DENY')
  supabaseResponse.headers.set('X-Content-Type-Options', 'nosniff')
  supabaseResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  supabaseResponse.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  supabaseResponse.headers.set('Content-Security-Policy', buildContentSecurityPolicy())

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
