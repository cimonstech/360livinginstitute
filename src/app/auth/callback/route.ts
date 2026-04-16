import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const tokenHash = searchParams.get('token_hash')
  const type = searchParams.get('type')
  const next = searchParams.get('next') ?? '/admin'

  const redirectToConfirmed = (base: string) => {
    const url = new URL('/auth/confirmed', base)
    url.searchParams.set('next', next)
    return url.toString()
  }

  if (code) {
    let response = NextResponse.redirect(redirectToConfirmed(origin))
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options)
            })
          },
        },
      }
    )
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) {
      const url = new URL('/login', origin)
      url.searchParams.set('error', 'auth_failed')
      url.searchParams.set('reason', error.message)
      return NextResponse.redirect(url)
    }
    const {
      data: { user },
    } = await supabase.auth.getUser()
    let destination = next.startsWith('/') ? next : `/${next}`
    if (user) {
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
      if (profile?.role === 'admin' && !destination.startsWith('/admin')) {
        destination = '/admin'
      }
    }
    // Return the same response instance so any auth cookies set by Supabase
    // remain attached to the redirect response.
    return response
  }

  if (tokenHash && type) {
    const verifiedRedirect = new URL('/auth/confirmed', origin)
    verifiedRedirect.searchParams.set('next', next)

    let response = NextResponse.redirect(verifiedRedirect)
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options)
            })
          },
        },
      }
    )
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: type as any,
    })
    if (!error) {
      return response
    }
  }

  const fallback = new URL('/login', origin)
  fallback.searchParams.set('error', 'verification_failed')
  if (type) fallback.searchParams.set('type', type)
  return NextResponse.redirect(fallback)
}
