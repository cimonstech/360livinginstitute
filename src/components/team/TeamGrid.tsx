'use client'

import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { boardMembers, type BoardMember } from '@/data/board-members'

function memberFromHash(hash: string): BoardMember | null {
  if (!hash || hash === '#') return null
  const id = hash.startsWith('#') ? hash.slice(1) : hash
  return boardMembers.find((m) => m.id === id) ?? null
}

export default function TeamGrid() {
  const [modalMember, setModalMember] = useState<BoardMember | null>(null)

  const syncHash = useCallback(() => {
    setModalMember(memberFromHash(window.location.hash))
  }, [])

  useEffect(() => {
    syncHash()
    window.addEventListener('hashchange', syncHash)
    return () => window.removeEventListener('hashchange', syncHash)
  }, [syncHash])

  const closeModal = useCallback(() => {
    setModalMember(null)
    const path = window.location.pathname + window.location.search
    window.history.replaceState(null, '', path)
  }, [])

  useEffect(() => {
    if (!modalMember) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [modalMember, closeModal])

  const openProfile = (id: string) => {
    window.location.hash = id
  }

  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <p className="font-dm text-xs font-medium uppercase tracking-widest text-brand-pink">Board</p>
        <h2 className="mt-2 font-lora text-3xl font-normal text-charcoal">Meet Our Board Members</h2>
        <p className="mb-16 mt-2 max-w-xl font-dm text-sm font-light text-charcoal-muted">
          A dedicated leadership team guiding the Institute’s mission, governance, and growth.
        </p>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {boardMembers.map((member) => (
            <article
              id={member.id}
              key={member.id}
              className="scroll-mt-28 overflow-hidden rounded-2xl border border-gray-100 bg-white transition-shadow hover:shadow-md"
            >
              <div className="relative h-72 w-full overflow-hidden">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width:768px) 100vw, 33vw"
                />
                <div
                  className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 to-transparent"
                  aria-hidden
                />
                <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 font-dm text-xs font-medium text-charcoal">
                  {member.role}
                </span>
              </div>
              <div className="p-6">
                <h3 className="font-lora text-xl font-normal text-charcoal">{member.name}</h3>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {member.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-charcoal-light px-2 py-0.5 font-dm text-xs text-charcoal-muted"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <p className="mt-3 font-dm text-xs font-light leading-relaxed text-charcoal-muted">{member.bioFirst}</p>
                {member.photoSoon ? (
                  <span className="mt-3 inline-block rounded-full bg-charcoal-light px-2 py-1 font-dm text-xs text-charcoal-muted">
                    Photo coming soon
                  </span>
                ) : null}
                <button
                  type="button"
                  onClick={() => openProfile(member.id)}
                  className="mt-4 font-dm text-xs font-medium text-brand-pink transition-colors hover:underline"
                >
                  View profile →
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      {modalMember ? (
        <div
          className="fixed inset-0 z-[600] flex items-end justify-center sm:items-center sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="board-profile-title"
        >
          <button
            type="button"
            className="absolute inset-0 bg-charcoal/50 backdrop-blur-[2px]"
            aria-label="Close profile"
            onClick={closeModal}
          />
          <div className="relative z-10 flex max-h-[min(90vh,820px)] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl border border-gray-100 bg-white shadow-xl sm:rounded-2xl">
            <button
              type="button"
              onClick={closeModal}
              className="absolute right-3 top-3 z-20 rounded-full border border-gray-100 bg-white p-2 text-charcoal shadow-sm transition-colors hover:bg-gray-50"
              aria-label="Close"
            >
              <X size={18} />
            </button>
            <div className="min-h-0 flex-1 overflow-y-auto p-6 pt-14 sm:p-8 sm:pt-16">
              {modalMember.id !== 'seyram-mankra' && modalMember.role ? (
                <p className="font-dm text-xs font-medium uppercase tracking-widest text-brand-pink">{modalMember.role}</p>
              ) : null}
              <h3 id="board-profile-title" className="mt-2 font-lora text-2xl font-normal text-charcoal sm:text-[1.65rem]">
                {modalMember.name}
              </h3>
              {modalMember.headline ? (
                <p className="mt-2 font-dm text-sm font-normal text-charcoal/90">{modalMember.headline}</p>
              ) : null}
              <div className="mt-5 space-y-4">
                {modalMember.modalParagraphs.map((p, i) => (
                  <p key={i} className="font-dm text-sm font-light leading-relaxed text-charcoal-muted">
                    {p}
                  </p>
                ))}
              </div>
              {modalMember.modalFocusTitle && modalMember.modalFocusItems?.length ? (
                <div className="mt-6 border-t border-gray-100 pt-6">
                  <p className="font-dm text-xs font-semibold uppercase tracking-wider text-charcoal">
                    {modalMember.modalFocusTitle}
                  </p>
                  <ul className="mt-3 list-disc space-y-2 pl-5 font-dm text-sm font-light leading-relaxed text-charcoal-muted">
                    {modalMember.modalFocusItems.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  )
}
