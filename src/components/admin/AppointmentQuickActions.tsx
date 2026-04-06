'use client'

import type { Appointment } from '@/types'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'

export default function AppointmentQuickActions({ appointment }: { appointment: Appointment }) {
  const router = useRouter()
  const [patching, setPatching] = useState(false)
  const [cancelReason, setCancelReason] = useState('')
  const [showCancel, setShowCancel] = useState(false)

  async function patch(body: Record<string, unknown>) {
    setPatching(true)
    try {
      const res = await fetch(`/api/appointments/${appointment.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (res.ok) {
        router.refresh()
        setShowCancel(false)
        setCancelReason('')
      }
    } finally {
      setPatching(false)
    }
  }

  const btn =
    'w-full rounded-full text-sm font-medium font-dm py-2.5 transition-opacity disabled:opacity-50 inline-flex items-center justify-center gap-2'

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100">
      <h2 className="font-medium text-sm text-charcoal mb-4 font-dm">Actions</h2>
      <div className="flex flex-col gap-2">
        {appointment.status === 'pending' && (
          <button
            type="button"
            disabled={patching}
            onClick={() => patch({ status: 'confirmed' })}
            className={`${btn} bg-brand-green text-white`}
          >
            {patching ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Confirm Booking
          </button>
        )}
        {appointment.status === 'confirmed' && (
          <button
            type="button"
            disabled={patching}
            onClick={() => patch({ status: 'completed' })}
            className={`${btn} bg-charcoal-light text-charcoal border border-gray-200`}
          >
            {patching ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Mark as Completed
          </button>
        )}
        {(appointment.status === 'pending' || appointment.status === 'confirmed') && (
          <>
            {!showCancel ? (
              <button
                type="button"
                onClick={() => setShowCancel(true)}
                className={`${btn} border-2 border-red-200 text-red-600 bg-white hover:bg-red-50`}
              >
                Cancel Booking
              </button>
            ) : (
              <div className="flex flex-col gap-2">
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Reason for cancellation"
                  rows={3}
                  className="border border-gray-200 rounded-xl px-3 py-2 text-sm font-dm"
                />
                <button
                  type="button"
                  disabled={patching || !cancelReason.trim()}
                  onClick={() => patch({ status: 'cancelled', cancellation_reason: cancelReason })}
                  className={`${btn} bg-red-600 text-white`}
                >
                  Confirm Cancel
                </button>
                <button type="button" onClick={() => setShowCancel(false)} className="text-xs text-charcoal-muted font-dm">
                  Dismiss
                </button>
              </div>
            )}
          </>
        )}
        {appointment.client_id && (
          <Link
            href={`/admin/clients/${appointment.client_id}`}
            className={`${btn} border border-gray-200 text-brand-pink justify-center`}
          >
            View Client Profile →
          </Link>
        )}
      </div>
    </div>
  )
}
