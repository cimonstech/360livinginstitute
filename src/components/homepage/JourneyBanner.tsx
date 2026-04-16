'use client'

import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { homepage } from '@/data/content'
import ApplyModal from '@/components/get-involved/ApplyModal'
import PartnerModal from '@/components/get-involved/PartnerModal'

export default function JourneyBanner() {
  const { title, ctas } = homepage.journeyBanner
  const [applyOpen, setApplyOpen] = useState(false)
  const [partnerOpen, setPartnerOpen] = useState(false)
  return (
    <section className="bg-gradient-to-r from-brand-green from-10% via-brand-green/95 via-45% to-brand-pink to-95% py-14">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 text-center lg:flex-row lg:px-10 lg:text-left">
        <h2 className="max-w-2xl font-lora text-2xl font-normal text-white lg:text-3xl">{title}</h2>
        <div className="flex flex-wrap justify-center gap-3 lg:justify-end">
          {ctas.map((cta, i) => (
            <button
              key={cta.href}
              type="button"
              onClick={() => (i === 0 ? setApplyOpen(true) : setPartnerOpen(true))}
              className={
                i === 0
                  ? 'inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-dm text-sm font-medium text-brand-green shadow-sm transition-opacity hover:opacity-95'
                  : 'inline-flex items-center gap-2 rounded-full border-2 border-white/80 px-6 py-3 font-dm text-sm font-medium text-white transition-colors hover:bg-white/15'
              }
            >
              {cta.label}
              {i === 0 ? <ArrowRight size={14} aria-hidden /> : null}
            </button>
          ))}
        </div>
      </div>
      <ApplyModal isOpen={applyOpen} onClose={() => setApplyOpen(false)} />
      <PartnerModal isOpen={partnerOpen} onClose={() => setPartnerOpen(false)} />
    </section>
  )
}
