'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { homepage, institute } from '@/data/content'
import PublicImageJpgFallback from '@/components/ui/PublicImageJpgFallback'
import ApplyModal from '@/components/get-involved/ApplyModal'
import PartnerModal from '@/components/get-involved/PartnerModal'

export default function Hero() {
  const { headlineLines, supporting, ctas, joinMovement } = homepage.hero
  const [applyOpen, setApplyOpen] = useState(false)
  const [partnerOpen, setPartnerOpen] = useState(false)

  return (
    <section className="relative min-h-[92vh] w-full">
      <PublicImageJpgFallback
        basename="/images/ladytraining"
        alt="Community-centred mental well-being and mentorship"
        fill
        className="z-0 object-cover object-top"
        sizes="100vw"
        priority
      />
      <div
        className="absolute inset-0 z-10 bg-gradient-to-r from-black/75 via-[#142924]/60 to-transparent"
        aria-hidden
      />

      <div className="relative z-20 mx-auto flex h-full min-h-[92vh] max-w-7xl flex-col px-6 py-10 pb-16 lg:px-10 lg:pb-24">
        <div className="max-w-2xl pt-8 lg:pt-12">
          <h1 className="font-lora text-4xl font-normal leading-tight text-white lg:text-6xl">
            {headlineLines.map((line, i) => (
              <span key={line}>
                {i > 0 ? <br /> : null}
                {line}
              </span>
            ))}
          </h1>
          <p className="mt-4 max-w-md font-dm text-sm font-light text-white/80">{supporting}</p>
          <p className="mt-3 font-dm text-xs font-medium uppercase tracking-widest text-white/60">{joinMovement}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            {ctas.map((cta) =>
              cta.href.includes('partner') ? (
                <button
                  key={cta.href}
                  type="button"
                  onClick={() => setPartnerOpen(true)}
                  className="rounded-full border-2 border-brand-green bg-brand-green/20 px-6 py-3 font-dm text-sm font-medium text-white shadow-sm backdrop-blur-sm transition-colors hover:bg-brand-green/35"
                >
                  {cta.label}
                </button>
              ) : (
                <button
                  key={cta.href}
                  type="button"
                  onClick={() => setApplyOpen(true)}
                  className="inline-flex items-center gap-2 rounded-full bg-brand-pink px-6 py-3 font-dm text-sm font-medium text-white transition-opacity hover:opacity-90"
                >
                  {cta.label}
                  <ArrowRight size={14} aria-hidden />
                </button>
              )
            )}
            <Link
              href={institute.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border-2 border-brand-green/70 bg-brand-green/15 px-6 py-3 font-dm text-sm font-medium text-white/95 transition-colors hover:bg-brand-green/30"
            >
              {institute.name} ↗
            </Link>
          </div>
        </div>
      </div>
      <ApplyModal isOpen={applyOpen} onClose={() => setApplyOpen(false)} />
      <PartnerModal isOpen={partnerOpen} onClose={() => setPartnerOpen(false)} />
    </section>
  )
}
