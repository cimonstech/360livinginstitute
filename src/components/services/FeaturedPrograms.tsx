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

const programs: {
  title: string
  desc: string
  Icon: LucideIcon
  tone: 'pink' | 'green'
}[] = [
  {
    title: 'Thrive360 Experience',
    desc: 'A holistic mental well-being experience for whole-person transformation.',
    Icon: Sparkles,
    tone: 'pink',
  },
  {
    title: 'Complete Living Series Webinar',
    desc: 'Online sessions exploring life development themes and practical tools.',
    Icon: Monitor,
    tone: 'green',
  },
  {
    title: 'Personal Development Cohorts',
    desc: 'Growth through shared learning and meaningful connection.',
    Icon: Users,
    tone: 'pink',
  },
  {
    title: 'Leadership Circles',
    desc: 'Peer learning and reflection spaces for leaders and executives.',
    Icon: Circle,
    tone: 'green',
  },
  {
    title: 'Parenthood Transitions Masterclass',
    desc: 'Navigating the psychological shifts and demands of parenthood.',
    Icon: Baby,
    tone: 'pink',
  },
  {
    title: 'Adolescence Transitions Program',
    desc: 'Supporting young people through identity, growth, and change.',
    Icon: GraduationCap,
    tone: 'green',
  },
  {
    title: 'The 360Living Woman Code',
    desc: 'A dedicated program celebrating and empowering the journey of women.',
    Icon: Heart,
    tone: 'pink',
  },
]

export default function FeaturedPrograms() {
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
            const { Icon, tone, title, desc } = program
            return (
              <div
                key={title}
                className="bg-charcoal p-7 transition-colors hover:bg-[#2C2C2C]"
              >
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
                <h3 className="mb-2 font-lora text-base font-normal text-white">{title}</h3>
                <p className="font-dm text-xs font-light leading-relaxed text-white/50">{desc}</p>
                <Link
                  href="/events"
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
