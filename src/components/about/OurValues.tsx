import { Lock, Heart, Lightbulb, Sparkles, RefreshCw } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

const values: {
  title: string
  desc: string
  Icon: LucideIcon
  tone: 'pink' | 'green'
}[] = [
  {
    title: 'Confidentiality',
    desc: 'Your privacy is sacred. Everything you share stays protected within a safe and secure environment.',
    Icon: Lock,
    tone: 'pink',
  },
  {
    title: 'Empathy',
    desc: 'We meet you where you are, without judgment. Your experience is heard, respected, and valued.',
    Icon: Heart,
    tone: 'green',
  },
  {
    title: 'Insight',
    desc: 'We go beyond symptoms to help you understand the root of your challenges and life patterns.',
    Icon: Lightbulb,
    tone: 'pink',
  },
  {
    title: 'Innovation',
    desc: 'We use evidence-based, forward-thinking approaches to deliver effective and lasting support.',
    Icon: Sparkles,
    tone: 'green',
  },
  {
    title: 'Transformation',
    desc: 'We walk with you through lasting, meaningful change — step by step, season by season.',
    Icon: RefreshCw,
    tone: 'pink',
  },
]

export default function OurValues() {
  return (
    <section className="bg-warm-cream py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <p className="font-dm text-xs font-medium uppercase tracking-widest text-brand-pink">Our Values</p>
        <h2 className="mt-3 font-lora text-3xl font-normal text-charcoal lg:text-4xl">
          The Principles That Guide Everything We Do
        </h2>
        <p className="mb-12 mt-3 max-w-xl font-dm text-sm font-light text-charcoal-muted">
          Through a foundation built on these values, we create a space where people can safely explore their thoughts,
          understand their emotions, and rediscover their direction in life.
        </p>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {values.map(({ title, desc, Icon, tone }) => (
            <article
              key={title}
              className="rounded-2xl border border-gray-100 bg-white p-6 transition-colors hover:border-brand-pink"
            >
              <div
                className={cn(
                  'mb-4 flex h-10 w-10 items-center justify-center rounded-full',
                  tone === 'pink' ? 'bg-brand-pink-pale' : 'bg-brand-green-pale'
                )}
              >
                <Icon
                  className={tone === 'pink' ? 'text-brand-pink' : 'text-brand-green'}
                  size={18}
                  strokeWidth={1.75}
                  aria-hidden
                />
              </div>
              <h3 className="mb-2 font-lora text-base font-medium text-charcoal">{title}</h3>
              <p className="font-dm text-xs font-light leading-relaxed text-charcoal-muted">{desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
