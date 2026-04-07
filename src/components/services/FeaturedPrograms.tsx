import Link from 'next/link'
import {
  Sparkles,
  Monitor,
  Users,
  Circle,
  Baby,
  GraduationCap,
  Heart,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/server'
import type { Event } from '@/types'

type ProgramCard = {
  id: string
  title: string
  desc: string
  Icon?: LucideIcon
  tone: 'pink' | 'green'
}

function iconForCategory(category?: string | null): LucideIcon | undefined {
  switch ((category || '').toLowerCase()) {
    case 'workshop':
      return Sparkles
    case 'webinar':
      return Monitor
    case 'cohort':
      return Users
    case 'leadership':
      return Circle
    case 'parenting':
      return Baby
    case 'youth':
      return GraduationCap
    case 'women':
      return Heart
    default:
      return undefined
  }
}

function toneForCategory(category?: string | null): 'pink' | 'green' {
  const c = (category || '').toLowerCase()
  return c === 'webinar' || c === 'leadership' || c === 'youth' ? 'green' : 'pink'
}

export default async function FeaturedPrograms() {
  const supabase = await createClient()
  const { data: raw } = await supabase
    .from('events')
    .select('*')
    .in('status', ['upcoming', 'ongoing'])
    .order('event_date', { ascending: true })
    .limit(6)

  const events = (raw as Event[]) ?? []

  const programs: ProgramCard[] = events.map((ev) => ({
    id: ev.id,
    title: ev.title,
    desc: ev.description?.trim() || 'Join us for a guided experience designed to support growth and well-being.',
    Icon: iconForCategory(ev.category),
    tone: toneForCategory(ev.category),
  }))

  if (programs.length === 0) return null

  return (
    <section className="bg-charcoal py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="font-dm text-xs font-medium uppercase tracking-widest text-brand-pink-light">
              Featured Programs
            </p>
            <h2 className="mt-2 font-lora text-3xl font-normal text-white lg:text-4xl">
              Beyond Sessions — Our Signature Programs
            </h2>
            <p className="mt-3 max-w-lg font-dm text-sm font-light text-white/60">
              Immersive experiences, group cohorts, and community programs designed for deeper transformation.
            </p>
          </div>
          <Link
            href="/events"
            className="flex-shrink-0 rounded-full border border-white/30 px-5 py-2.5 font-dm text-sm font-normal text-white transition-colors hover:bg-white/10"
          >
            View All Events →
          </Link>
        </div>

        <div className="mt-2 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-2 lg:grid-cols-3">
          {programs.map((program) => {
            const { Icon, tone, title, desc, id } = program
            return (
              <div
                key={id}
                className="bg-charcoal p-7 transition-colors hover:bg-[#2C2C2C]"
              >
                {Icon ? (
                  <div
                    className={cn(
                      'mb-5 flex h-10 w-10 items-center justify-center rounded-full',
                      tone === 'pink' ? 'bg-brand-pink/20' : 'bg-brand-green/20'
                    )}
                  >
                    <Icon
                      className={tone === 'pink' ? 'text-brand-pink-light' : 'text-brand-green-light'}
                      size={18}
                      strokeWidth={1.75}
                      aria-hidden
                    />
                  </div>
                ) : null}
                <h3 className="mb-2 font-lora text-base font-normal text-white">{title}</h3>
                <p className="font-dm text-xs font-light leading-relaxed text-white/50">{desc}</p>
                <Link
                  href="/events#events-list"
                  className="mt-4 block font-dm text-xs text-brand-pink transition-colors hover:underline"
                >
                  Learn more →
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
