'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Menu, X, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import TopContactBar from '@/components/layout/TopContactBar'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Programs', href: '/programs' },
  { label: 'Get Involved', href: '/get-involved' },
  { label: 'Resources', href: '/resources' },
  { label: 'Contact', href: '/contact' },
]

function pathMatchesNav(pathname: string, href: string) {
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(`${href}/`)
}

const linkBase = 'font-dm text-sm transition-colors'
const linkInactive = `${linkBase} text-charcoal-muted hover:text-charcoal`
const linkActive = `${linkBase} text-charcoal underline decoration-brand-green decoration-2 underline-offset-[6px]`

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [menuMounted, setMenuMounted] = useState(false)

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

  useEffect(() => {
    setMenuMounted(true)
  }, [])

  const mobileMenu = menuMounted
    ? createPortal(
        <div className="lg:hidden" aria-hidden={!open}>
          <button
            type="button"
            tabIndex={open ? 0 : -1}
            className={cn(
              'fixed bottom-0 left-0 right-0 top-16 z-[500] bg-charcoal/40 transition-opacity duration-300',
              open ? 'opacity-100' : 'pointer-events-none opacity-0'
            )}
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          />
          <aside
            id="mobile-nav-drawer"
            className={cn(
              'fixed bottom-0 right-0 top-16 z-[510] flex w-[min(20rem,calc(100vw-2rem))] max-w-full flex-col bg-white shadow-[-4px_0_24px_rgba(61,61,61,0.12)] transition-transform duration-300 ease-out motion-reduce:transition-none',
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
                <Link
                  href="/get-involved#apply"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-pink py-3 font-dm text-sm font-medium text-white"
                >
                  Apply Now
                  <ArrowRight size={14} aria-hidden />
                </Link>
              </div>
            </div>
          </aside>
        </div>,
        document.body
      )
    : null

  return (
    <>
      <header className="sticky top-0 z-[520] lg:z-[100]">
        <TopContactBar />
        <nav className="border-b border-brand-green/15 bg-white">
        <div className="relative mx-auto flex h-16 max-w-7xl items-center gap-4 px-6 lg:px-10">
          <Link href="/" className="relative h-9 w-[140px] flex-shrink-0">
            <Image
              src="/images/Logo-1.png"
              alt="360 Living Foundation"
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
              href="/get-involved#apply"
              className="inline-flex items-center gap-2 rounded-full bg-brand-pink px-5 py-2 font-dm text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Apply Now
              <ArrowRight size={14} aria-hidden />
            </Link>
          </div>

          <button
            type="button"
            className="relative ml-auto flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg text-charcoal-muted touch-manipulation transition-colors hover:bg-charcoal-light hover:text-charcoal active:bg-charcoal-light lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav-drawer"
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            {open ? <X size={22} strokeWidth={2} /> : <Menu size={22} strokeWidth={2} />}
          </button>
        </div>
        </nav>
      </header>

      {mobileMenu}
    </>
  )
}
