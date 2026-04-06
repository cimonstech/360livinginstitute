'use client'

import { useEffect } from 'react'

/** Remove ?error=&&reason= from the address bar after the server-rendered banner is shown. */
export default function StripAuthErrorQuery() {
  useEffect(() => {
    const url = new URL(window.location.href)
    if (!url.searchParams.has('error') && !url.searchParams.has('reason')) return
    url.searchParams.delete('error')
    url.searchParams.delete('reason')
    const qs = url.searchParams.toString()
    window.history.replaceState(null, '', `${url.pathname}${qs ? `?${qs}` : ''}${url.hash}`)
  }, [])
  return null
}
