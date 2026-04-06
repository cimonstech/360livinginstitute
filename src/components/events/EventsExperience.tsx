'use client'

import { useState } from 'react'
import type { Event } from '@/types'
import EventsHero from '@/components/events/EventsHero'
import EventsList from '@/components/events/EventsList'
import EventRegistrationModal from '@/components/events/EventRegistrationModal'

export default function EventsExperience({ upcomingEvents }: { upcomingEvents: Event[] }) {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  function openRegister(ev: Event) {
    setSelectedEvent(ev)
    setModalOpen(true)
  }

  return (
    <>
      <EventsHero previewEvents={upcomingEvents.slice(0, 3)} onRegisterClick={openRegister} />
      <EventsList events={upcomingEvents} onRegisterClick={openRegister} />
      {selectedEvent && (
        <EventRegistrationModal
          event={selectedEvent}
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false)
            setSelectedEvent(null)
          }}
        />
      )}
    </>
  )
}
