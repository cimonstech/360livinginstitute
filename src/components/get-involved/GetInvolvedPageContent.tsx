'use client'

import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { getInvolved, company } from '@/data/content'
import ApplyModal from '@/components/get-involved/ApplyModal'
import PartnerModal from '@/components/get-involved/PartnerModal'
import VolunteerModal from '@/components/get-involved/VolunteerModal'
import SponsorModal from '@/components/get-involved/SponsorModal'
import Image from 'next/image'

export default function GetInvolvedPageContent() {
  const g = getInvolved
  const [applyOpen, setApplyOpen] = useState(false)
  const [partnerOpen, setPartnerOpen] = useState(false)
  const [volunteerOpen, setVolunteerOpen] = useState(false)
  const [sponsorOpen, setSponsorOpen] = useState(false)
  const [sponsorType, setSponsorType] = useState<'sponsor' | 'donate'>('sponsor')

  return (
    <>
      <section className="relative overflow-hidden bg-warm-cream py-20">
        <div className="absolute inset-0">
          <Image
            src="/images/about-hero.jpg"
            alt=""
            fill
            className="object-cover object-center opacity-55"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal/55 via-charcoal/35 to-warm-cream" />
        </div>
        <div className="relative mx-auto max-w-3xl px-6 text-center lg:px-10">
          <p className="font-dm text-xs font-medium uppercase tracking-widest text-white/90">{g.hero.eyebrow}</p>
          <h1 className="mt-4 font-lora text-4xl font-normal text-white lg:text-5xl">{g.hero.title}</h1>
          <p className="mt-4 font-dm text-sm font-light leading-relaxed text-white/80">{g.hero.intro}</p>
        </div>
      </section>

      <section id="apply" className="scroll-mt-28 border-b border-gray-100 py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <h2 className="font-lora text-2xl text-charcoal">{g.joinPrograms.title}</h2>
          <p className="mt-3 max-w-2xl font-dm text-sm font-light text-charcoal-muted">{g.joinPrograms.body}</p>
          <button
            type="button"
            onClick={() => setApplyOpen(true)}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-pink px-6 py-3 font-dm text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            {g.joinPrograms.cta.label}
            <ArrowRight size={14} aria-hidden />
          </button>
        </div>
      </section>

      <section id="partner" className="scroll-mt-28 border-b border-gray-100 bg-warm-white py-20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 lg:grid-cols-2 lg:items-center lg:px-10">
          <div>
            <h2 className="font-lora text-2xl text-charcoal">{g.partner.title}</h2>
            <p className="mt-3 font-dm text-sm text-charcoal-muted">{g.partner.intro}</p>
            <ul className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {g.partner.bullets.map((b) => (
                <li key={b} className="flex items-center gap-2 font-dm text-sm text-charcoal">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-pink" aria-hidden />
                  {b}
                </li>
              ))}
            </ul>
            <p className="mt-6 font-dm text-sm font-medium text-charcoal">{g.partner.closing}</p>
            <button
              type="button"
              onClick={() => setPartnerOpen(true)}
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-charcoal/25 px-6 py-3 font-dm text-sm text-charcoal transition-colors hover:border-brand-pink/40"
            >
              {g.partner.cta.label}
              <ArrowRight size={14} aria-hidden />
            </button>
          </div>
          <div className="relative h-64 w-full overflow-hidden rounded-2xl bg-charcoal-light sm:h-80 lg:h-[420px]">
            <Image
              src="/images/istockphot.jpg"
              alt="Partnering for community impact"
              fill
              className="object-cover object-center"
              sizes="(max-width:1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      <section id="volunteer" className="scroll-mt-28 border-b border-gray-100 py-20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 lg:grid-cols-2 lg:items-center lg:px-10">
          <div className="order-2 lg:order-1">
            <div className="relative h-64 w-full overflow-hidden rounded-2xl bg-charcoal-light sm:h-80 lg:h-[420px]">
              <Image
                src="/images/students.jpg.jpg"
                alt="Volunteers supporting youth and students"
                fill
                className="object-cover object-center"
                sizes="(max-width:1024px) 100vw, 50vw"
              />
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="font-lora text-2xl text-charcoal">{g.volunteer.title}</h2>
            <p className="mt-3 max-w-2xl font-dm text-sm font-light text-charcoal-muted">{g.volunteer.body}</p>
            <button
              type="button"
              onClick={() => setVolunteerOpen(true)}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-pink px-6 py-3 font-dm text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              {g.volunteer.cta.label}
              <ArrowRight size={14} aria-hidden />
            </button>
          </div>
        </div>
      </section>

      <section id="sponsor" className="scroll-mt-28 border-b border-gray-100 bg-warm-white py-20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 lg:grid-cols-2 lg:px-10">
          <div>
            <h2 className="font-lora text-2xl text-charcoal">{g.sponsor.title}</h2>
            <p className="mt-3 font-dm text-sm font-light text-charcoal-muted">{g.sponsor.body}</p>
            <button
              type="button"
              onClick={() => {
                setSponsorType('sponsor')
                setSponsorOpen(true)
              }}
              className="mt-8 inline-flex items-center gap-2 rounded-full border border-charcoal/25 px-6 py-3 font-dm text-sm text-charcoal transition-colors hover:border-brand-pink/40"
            >
              {g.sponsor.cta.label}
              <ArrowRight size={14} aria-hidden />
            </button>
          </div>
          <div id="donate" className="scroll-mt-28 rounded-2xl border border-gray-100 bg-white p-8">
            <h2 className="font-lora text-2xl text-charcoal">{g.donate.title}</h2>
            <p className="mt-3 font-dm text-sm font-light text-charcoal-muted">{g.donate.body}</p>
            <button
              type="button"
              onClick={() => {
                setSponsorType('donate')
                setSponsorOpen(true)
              }}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-green px-6 py-3 font-dm text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              {g.donate.cta.label}
              <ArrowRight size={14} aria-hidden />
            </button>
          </div>
        </div>
      </section>

      <section className="bg-charcoal py-16">
        <div className="mx-auto max-w-3xl px-6 text-center lg:px-10">
          <h2 className="font-lora text-2xl text-white">{g.apply.title}</h2>
          <p className="mt-3 font-dm text-sm font-light text-white/70">{g.apply.body}</p>
          <button
            type="button"
            onClick={() => setApplyOpen(true)}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-pink px-6 py-3 font-dm text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            {g.apply.primaryCta.label}
            <ArrowRight size={14} aria-hidden />
          </button>
          <p className="mt-6 font-dm text-xs text-white/50">
            {company.email} · {company.phoneDisplay}
          </p>
        </div>
      </section>

      <ApplyModal isOpen={applyOpen} onClose={() => setApplyOpen(false)} />
      <PartnerModal isOpen={partnerOpen} onClose={() => setPartnerOpen(false)} />
      <VolunteerModal isOpen={volunteerOpen} onClose={() => setVolunteerOpen(false)} />
      <SponsorModal isOpen={sponsorOpen} onClose={() => setSponsorOpen(false)} type={sponsorType} />
    </>
  )
}
