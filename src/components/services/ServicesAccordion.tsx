'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Plus, Minus, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

type Service = {
  num: string
  title: string
  tag: string
  tagColor: 'pink' | 'green'
  image: string
  body: string
  bullets: string[]
  cta: { label: string; href: string }
}

const services: Service[] = [
  {
    num: '01',
    title: 'Individual Counselling',
    tag: 'Personal',
    tagColor: 'pink',
    image: '/images/portrait-gorgeous.avif',
    body: 'We provide support for personal clarity, healing, and growth — assisting individuals in navigating anxiety, emotional overwhelm, self-discovery, life direction, and personal challenges.',
    bullets: [
      'Anxiety & emotional overwhelm',
      'Self-discovery & life direction',
      'Personal challenges & resilience building',
      'Grief, loss & identity shifts',
    ],
    cta: { label: 'Book a Session', href: '/book' },
  },
  {
    num: '02',
    title: 'Corporate Mental Health & Wellness',
    tag: 'Corporate',
    tagColor: 'green',
    image: '/images/warrengoldswain.jpg',
    body: 'We partner with organisations to improve employee well-being, increase productivity and focus, reduce burnout and absenteeism, and build psychologically safe environments.',
    bullets: [
      'Workplace counselling support',
      'Mental health workshops & seminars',
      'Psychological safety & first aid',
      'Wellness in the board',
    ],
    cta: { label: 'Partner With Us', href: '/contact#partner' },
  },
  {
    num: '03',
    title: 'Entrepreneur Wellness & Performance',
    tag: 'Business',
    tagColor: 'pink',
    image: '/images/portrait-handsome.avif',
    body: 'Entrepreneurs and business leaders encounter specific psychological challenges including burnout, decision fatigue, leadership pressure, emotional isolation, and work-life imbalance.',
    bullets: [
      'Executive counselling sessions',
      'Founder wellness programs',
      'Mental resilience training',
      'Business-life alignment coaching',
    ],
    cta: { label: 'Book a Session', href: '/book' },
  },
  {
    num: '04',
    title: 'Life Transition Counselling',
    tag: 'Transitions',
    tagColor: 'green',
    image: '/images/beautiful-african-woman.jpg',
    body: 'Life transitions often create confusion and emotional strain. We support you through major shifts so you can move forward with clarity and purpose.',
    bullets: [
      'Career changes & reinvention',
      'Marriage & parenting transitions',
      'Loss, grief & bereavement',
      'Identity shifts & personal reinvention',
    ],
    cta: { label: 'Book a Session', href: '/book' },
  },
  {
    num: '05',
    title: 'Family & Relationship Counselling',
    tag: 'Family',
    tagColor: 'pink',
    image: '/images/portrait-father.avif',
    body: 'We address issues related to couples, parenting, family dynamics, communication, and conflict resolution to foster healthier, more connected relationships.',
    bullets: [
      'Couples counselling & communication',
      'Parenting & family dynamics',
      'Conflict resolution strategies',
      'Rebuilding trust & connection',
    ],
    cta: { label: 'Book a Session', href: '/book' },
  },
  {
    num: '06',
    title: 'Psychoeducation & Training',
    tag: 'Training',
    tagColor: 'green',
    image: '/images/smilingclient.webp',
    body: 'We offer workshops, seminars, and educational programs designed to build mental health literacy and practical psychological skills for individuals and groups.',
    bullets: [
      'Mental health workshops',
      'Seminars & educational programs',
      'Emotional intelligence training',
      'Invite us to speak at your event',
    ],
    cta: { label: 'Invite Us to Speak', href: '/contact#speak' },
  },
]

export default function ServicesAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index))
  }

  return (
    <section className="bg-white py-4">
      <div className="mx-auto max-w-7xl divide-y divide-gray-100 px-6 lg:px-10">
        {services.map((service, index) => {
          const isOpen = openIndex === index
          return (
            <div key={service.num}>
              <button
                type="button"
                onClick={() => toggle(index)}
                className="group flex w-full cursor-pointer items-center gap-4 py-6 text-left"
              >
                <span className="font-lora text-sm font-medium text-brand-pink">{service.num}</span>
                <span className="flex-1 font-lora text-xl font-normal text-charcoal transition-colors group-hover:text-brand-pink">
                  {service.title}
                </span>
                <span
                  className={cn(
                    'flex-shrink-0 rounded-full px-3 py-1 font-dm text-xs font-medium',
                    service.tagColor === 'pink'
                      ? 'bg-brand-pink-pale text-brand-pink'
                      : 'bg-brand-green-pale text-brand-green'
                  )}
                >
                  {service.tag}
                </span>
                <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl">
                  <Image
                    src={service.image}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                </div>
                <span className="flex-shrink-0 text-charcoal-muted" aria-hidden>
                  {isOpen ? <Minus className="text-brand-pink" size={18} /> : <Plus size={18} />}
                </span>
              </button>

              {isOpen ? (
                <div className="grid grid-cols-1 gap-8 pb-10 pt-2 lg:grid-cols-2">
                  <div>
                    <p className="font-dm text-sm font-light leading-relaxed text-charcoal-muted">{service.body}</p>
                    <ul className="mt-4 flex flex-col gap-2">
                      {service.bullets.map((b) => (
                        <li key={b} className="flex items-start gap-2 font-dm text-sm font-light text-charcoal-muted">
                          <span
                            className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-pink"
                            aria-hidden
                          />
                          {b}
                        </li>
                      ))}
                    </ul>
                    <Link
                      href={service.cta.href}
                      className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-pink px-6 py-2.5 font-dm text-sm font-medium text-white transition-opacity hover:opacity-90"
                    >
                      {service.cta.label}
                      <ArrowRight size={14} aria-hidden />
                    </Link>
                  </div>
                  <div className="relative h-72 w-full overflow-hidden rounded-2xl">
                    <Image
                      src={service.image}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="(max-width:1024px) 100vw, 50vw"
                    />
                    <div className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 font-dm text-xs font-medium text-charcoal">
                      {service.tag}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          )
        })}
      </div>
    </section>
  )
}
