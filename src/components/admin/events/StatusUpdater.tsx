'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function StatusUpdater({
  registrationId,
  currentStatus,
}: {
  registrationId: string
  currentStatus: string
}) {
  const [status, setStatus] = useState(currentStatus)

  useEffect(() => {
    setStatus(currentStatus)
  }, [currentStatus])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function updateStatus(newStatus: string) {
    setLoading(true)
    const supabase = createClient()
    await supabase.from('event_registrations').update({ status: newStatus }).eq('id', registrationId)
    setStatus(newStatus)
    setLoading(false)
    router.refresh()
  }

  return (
    <select
      value={status}
      onChange={(e) => void updateStatus(e.target.value)}
      disabled={loading}
      className="rounded-lg border border-gray-200 px-2 py-1 font-dm text-xs text-charcoal focus:border-brand-pink focus:outline-none"
    >
      <option value="registered">Registered</option>
      <option value="attended">Attended</option>
      <option value="no_show">No Show</option>
      <option value="cancelled">Cancelled</option>
    </select>
  )
}
