'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Menu, X, ArrowRight } from 'lucide-react'
import type { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Our Team', href: '/team' },
  { label: 'Blog', href: '/blog' },
  { label: 'Events', href: '/events' },
  { label: 'Contact', href: '/contact' },
]

function pathMatchesNav(pathname: string, href: string) {
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(`${href}/`)
}

const linkBase = 'font-dm text-sm transition-colors'
const linkInactive = `${linkBase} text-charcoal-muted hover:text-charcoal`
const linkActive = `${linkBase} text-charcoal underline decoration-brand-pink decoration-2 underline-offset-[6px]`

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  /** Loaded after session — admins should not be steered to the client bookings area only */
  const [portalRole, setPortalRole] = useState<'admin' | 'client' | null>(null)

  async function signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    setOpen(false)
  }

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!user) {
      setPortalRole(null)
      return
    }
    const supabase = createClient()
    void supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        setPortalRole(data?.role === 'admin' ? 'admin' : 'client')
      })
  }, [user])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <>
      <nav className="sticky top-0 z-[100] border-b border-charcoal/10 bg-white">
        <div className="relative z-[110] mx-auto flex h-16 max-w-7xl items-center gap-4 px-6 lg:px-10">
          <Link href="/" className="relative h-9 w-[140px] flex-shrink-0">
            <Image
              src="/images/logo.png"
              alt="360 Living Institute"
              fill
              className="object-contain object-left"
              sizes="140px"
              priority
            />
          </Link>

          <ul className="mx-auto hidden list-none items-center justify-center gap-8 lg:flex">
            {navLinks.map((link) => {
              const active = pathMatchesNav(pathname, link.href)
              return (
                <li key={link.href}>
                  <Link href={link.href} className={active ? linkActive : linkInactive} aria-current={active ? 'page' : undefined}>
                    {link.label}
                  </Link>
                </li>
              )
            })}
          </ul>

          <div className="ml-auto hidden items-center gap-4 lg:flex">
            <Link
              href="https://360livingfoundation.org"
              target="_blank"
              rel="noopener noreferrer"
              className="font-dm text-xs text-charcoal-muted/50 transition-colors hover:text-charcoal-muted"
            >
              360Living Foundation ↗
            </Link>
            {user ? (
              <>
                {portalRole === null ? (
                  <span className="font-dm text-sm text-charcoal-muted tabular-nums w-[5.5rem] text-center" aria-label="Loading menu">
                    ···
                  </span>
                ) : portalRole === 'admin' ? (
                  <Link
                    href="/admin"
                    className={pathMatchesNav(pathname, '/admin') ? linkActive : linkInactive}
                    aria-current={pathMatchesNav(pathname, '/admin') ? 'page' : undefined}
                  >
                    Admin
                  </Link>
                ) : (
                  <Link
                    href="/dashboard"
                    className={pathMatchesNav(pathname, '/dashboard') ? linkActive : linkInactive}
                    aria-current={pathMatchesNav(pathname, '/dashboard') ? 'page' : undefined}
                  >
                    My Bookings
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => void signOut()}
                  className="font-dm rounded-full border border-gray-200 px-4 py-2 text-sm text-charcoal-muted transition-colors hover:bg-charcoal-light"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className={pathname.startsWith('/login') ? linkActive : linkInactive}
                  aria-current={pathname.startsWith('/login') ? 'page' : undefined}
                >
                  Sign In
                </Link>
                <Link
                  href="/book"
                  className="inline-flex items-center gap-2 rounded-full bg-brand-pink px-5 py-2 font-dm text-sm font-medium text-white transition-opacity hover:opacity-90"
                >
                  Book Appointment
                  <ArrowRight size={14} aria-hidden />
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            className="relative z-[120] ml-auto flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg text-charcoal-muted touch-manipulation transition-colors hover:bg-charcoal-light hover:text-charcoal active:bg-charcoal-light lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav-drawer"
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            {open ? <X size={22} strokeWidth={2} /> : <Menu size={22} strokeWidth={2} />}
          </button>
        </div>
      </nav>

      {/* Mobile: backdrop + drawer (slides in from the right) */}
      <div className="lg:hidden" aria-hidden={!open}>
        <button
          type="button"
          tabIndex={open ? 0 : -1}
          className={cn(
            'fixed inset-0 z-[115] bg-charcoal/40 transition-opacity duration-300',
            open ? 'opacity-100' : 'pointer-events-none opacity-0'
          )}
          onClick={() => setOpen(false)}
          aria-label="Close menu"
        />
        <aside
          id="mobile-nav-drawer"
          className={cn(
            'fixed bottom-0 right-0 top-16 z-[120] flex w-[min(20rem,calc(100vw-2rem))] max-w-full flex-col bg-white shadow-[-4px_0_24px_rgba(61,61,61,0.12)] transition-transform duration-300 ease-out motion-reduce:transition-none',
            open ? 'translate-x-0' : 'translate-x-full pointer-events-none'
          )}
        >
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-4">
            <ul className="flex list-none flex-col border-b border-charcoal/10 pb-4">
              {navLinks.map((link) => {
                const active = pathMatchesNav(pathname, link.href)
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={cn('block py-3', active ? linkActive : linkInactive)}
                      aria-current={active ? 'page' : undefined}
                    >
                      {link.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
            <div className="flex flex-col gap-3 pt-4">
              {user ? (
                <>
                  {portalRole === null ? (
                    <span className="block py-2 font-dm text-sm text-charcoal-muted">Loading…</span>
                  ) : portalRole === 'admin' ? (
                    <Link
                      href="/admin"
                      onClick={() => setOpen(false)}
                      className={cn(
                        'block py-3',
                        pathMatchesNav(pathname, '/admin') ? linkActive : linkInactive
                      )}
                      aria-current={pathMatchesNav(pathname, '/admin') ? 'page' : undefined}
                    >
                      Admin
                    </Link>
                  ) : (
                    <Link
                      href="/dashboard"
                      onClick={() => setOpen(false)}
                      className={cn(
                        'block py-3',
                        pathMatchesNav(pathname, '/dashboard') ? linkActive : linkInactive
                      )}
                      aria-current={pathMatchesNav(pathname, '/dashboard') ? 'page' : undefined}
                    >
                      My Bookings
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={() => void signOut()}
                    className="font-dm w-full rounded-full border border-gray-200 px-4 py-3 text-sm text-charcoal-muted transition-colors hover:bg-charcoal-light"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className={cn('block py-3', pathname.startsWith('/login') ? linkActive : linkInactive)}
                    aria-current={pathname.startsWith('/login') ? 'page' : undefined}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/book"
                    onClick={() => setOpen(false)}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-pink py-3 font-dm text-sm font-medium text-white"
                  >
                    Book Appointment
                    <ArrowRight size={14} aria-hidden />
                  </Link>
                </>
              )}
              <Link
                href="https://360livingfoundation.org"
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 text-center font-dm text-xs text-charcoal-muted/50"
              >
                360Living Foundation ↗
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </>
  )
}
