import { GraduationCap, Shield, Globe, Heart } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

const cells: { title: string; desc: string; Icon: LucideIcon; tone: 'pink' | 'green' }[] = [
  {
    title: 'Fully Accredited',
    desc: 'All practitioners hold recognised professional qualifications and memberships.',
    Icon: GraduationCap,
    tone: 'pink',
  },
  {
    title: 'Ethically Bound',
    desc: 'We operate under strict ethical guidelines and professional codes of conduct.',
    Icon: Shield,
    tone: 'green',
  },
  {
    title: 'Culturally Sensitive',
    desc: 'We understand the Ghanaian and African context — our approach reflects your reality.',
    Icon: Globe,
    tone: 'pink',
  },
  {
    title: 'Genuinely Caring',
    desc: "We don't just treat symptoms — we walk with you through the whole journey.",
    Icon: Heart,
    tone: 'green',
  },
]

export default function TeamValues() {
  return (
    <section className="bg-charcoal py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <p className="font-dm text-xs font-medium uppercase tracking-widest text-brand-pink-light">Why Our Team</p>
        <h2 className="mt-2 font-lora text-3xl font-normal text-white lg:text-4xl">
          What sets our practitioners apart
        </h2>
        <p className="mb-12 mt-3 max-w-xl font-dm text-sm font-light text-white/60">
          Every member of the 360 Living team is trained, accredited, and deeply committed to ethical, compassionate
          practice.
        </p>

        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-2 lg:grid-cols-4">
          {cells.map(({ title, desc, Icon, tone }) => (
            <div key={title} className="bg-charcoal p-8 transition-colors hover:bg-[#2C2C2C]">
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
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
