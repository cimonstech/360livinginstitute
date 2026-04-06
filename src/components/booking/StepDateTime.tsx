'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Availability, Service } from '@/types'
import { createClient } from '@/lib/supabase/client'
import { generateSlots, slotOverlapsBooking } from '@/lib/booking-slots'
import {
  addMonths,
  format,
  getDay,
  isBefore,
  isSameMonth,
  startOfDay,
  startOfMonth,
  startOfToday,
  subMonths,
} from 'date-fns'
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'

type Props = {
  service: Service
  onSelect: (date: string, time: string) => void
  selectedDate: string
  selectedTime: string
}

type BookingRow = {
  appointment_time: string
  duration_minutes: number
}

function normalizeTimeForSlots(t: string): string {
  const [h, m] = t.split(':')
  return `${String(Number(h)).padStart(2, '0')}:${String(Number(m)).padStart(2, '0')}`
}

export default function StepDateTime({ service, onSelect, selectedDate, selectedTime }: Props) {
  const [monthCursor, setMonthCursor] = useState(() => startOfMonth(new Date()))
  const [blackoutSet, setBlackoutSet] = useState<Set<string>>(new Set())
  const [availabilityByDow, setAvailabilityByDow] = useState<Map<number, Availability>>(new Map())
  const [bookedRows, setBookedRows] = useState<BookingRow[]>([])
  const [loadingMeta, setLoadingMeta] = useState(true)
  const [loadingSlots, setLoadingSlots] = useState(false)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const supabase = createClient()
      const [blackoutRes, availRes] = await Promise.all([
        supabase.from('blackout_dates').select('date'),
        supabase.from('availability').select('*'),
      ])
      if (cancelled) return
      const dates = new Set<string>()
      for (const row of blackoutRes.data ?? []) {
        const d = (row as { date: string }).date
        dates.add(d.slice(0, 10))
      }
      setBlackoutSet(dates)
      const map = new Map<number, Availability>()
      for (const row of (availRes.data as Availability[]) ?? []) {
        map.set(row.day_of_week, row)
      }
      setAvailabilityByDow(map)
      setLoadingMeta(false)
    })()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!selectedDate) {
      setBookedRows([])
      return
    }
    let cancelled = false
    setLoadingSlots(true)
    ;(async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('appointments')
        .select('appointment_time, duration_minutes, status')
        .eq('appointment_date', selectedDate)
        .in('status', ['pending', 'confirmed'])
      if (cancelled) return
      setBookedRows(
        (data as { appointment_time: string; duration_minutes: number }[] | null)?.map((r) => ({
          appointment_time: r.appointment_time,
          duration_minutes: r.duration_minutes,
        })) ?? []
      )
      setLoadingSlots(false)
    })()
    return () => {
      cancelled = true
    }
  }, [selectedDate])

  const calendarDays = useMemo(() => {
    const start = startOfMonth(monthCursor)
    const year = start.getFullYear()
    const mon = start.getMonth()
    const lastDay = new Date(year, mon + 1, 0).getDate()
    const firstWeekday = getDay(new Date(year, mon, 1))
    const cells: ({ day: number; date: Date } | null)[] = []
    for (let i = 0; i < firstWeekday; i++) cells.push(null)
    for (let d = 1; d <= lastDay; d++) {
      cells.push({ day: d, date: new Date(year, mon, d) })
    }
    return cells
  }, [monthCursor])

  const dowAvailable = useCallback(
    (date: Date) => {
      const row = availabilityByDow.get(getDay(date))
      return !!(row && row.is_active)
    },
    [availabilityByDow]
  )

  const slots = useMemo(() => {
    if (!selectedDate) return []
    const d = new Date(selectedDate + 'T12:00:00')
    const row = availabilityByDow.get(getDay(d))
    if (!row || !row.is_active) return []
    const startT = normalizeTimeForSlots(row.start_time)
    const endT = normalizeTimeForSlots(row.end_time)
    return generateSlots(startT, endT, service.duration_minutes)
  }, [selectedDate, availabilityByDow, service.duration_minutes])

  const slotBooked = useCallback(
    (slot: string) => {
      return bookedRows.some((b) =>
        slotOverlapsBooking(slot, service.duration_minutes, b.appointment_time, b.duration_minutes)
      )
    },
    [bookedRows, service.duration_minutes]
  )

  return (
    <div>
      <h2 className="font-lora text-xl text-charcoal mb-1">Pick a date &amp; time</h2>
      <p className="font-dm text-sm text-charcoal-muted font-light mb-6">
        Choose when you would like to meet with us.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={() => setMonthCursor((m) => subMonths(m, 1))}
              className="rounded-full p-2 text-charcoal-muted hover:bg-charcoal-light transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="font-dm text-sm font-medium text-charcoal">{format(monthCursor, 'MMMM yyyy')}</span>
            <button
              type="button"
              onClick={() => setMonthCursor((m) => addMonths(m, 1))}
              className="rounded-full p-2 text-charcoal-muted hover:bg-charcoal-light transition-colors"
              aria-label="Next month"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {loadingMeta ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-brand-pink" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-7 gap-1 text-center font-dm text-xs text-charcoal-muted mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                  <div key={d}>{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((cell, i) => {
                  if (!cell) return <div key={`e-${i}`} className="aspect-square" />
                  const { date } = cell
                  const key = format(date, 'yyyy-MM-dd')
                  const isPast = isBefore(startOfDay(date), startOfToday())
                  const isBlackout = blackoutSet.has(key)
                  const dowOk = dowAvailable(date)
                  const unavailable = isPast || isBlackout || !dowOk
                  const selected = selectedDate === key
                  const inMonth = isSameMonth(date, monthCursor)

                  let dayCls =
                    'aspect-square rounded-lg font-dm text-sm transition-colors '
                  if (!inMonth) dayCls += 'opacity-0 pointer-events-none'
                  else if (isBlackout) dayCls += 'opacity-30 cursor-not-allowed bg-red-50'
                  else if (isPast || !dowOk) dayCls += 'opacity-30 cursor-not-allowed'
                  else if (selected) dayCls += 'bg-brand-pink text-white'
                  else dayCls += 'hover:bg-brand-pink-pale hover:text-brand-pink cursor-pointer'

                  return (
                    <button
                      key={key}
                      type="button"
                      disabled={unavailable || !inMonth}
                      onClick={() => {
                        if (unavailable || !inMonth) return
                        onSelect(key, '')
                      }}
                      className={dayCls}
                    >
                      {cell.day}
                    </button>
                  )
                })}
              </div>
            </>
          )}
        </div>

        <div>
          {!selectedDate ? (
            <p className="text-sm text-charcoal-muted text-center py-8 font-dm">Select a date to see available times</p>
          ) : loadingSlots ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-brand-pink" />
            </div>
          ) : (
            <>
              <p className="text-sm font-medium text-charcoal mb-4 font-dm">
                Available times for {format(new Date(selectedDate + 'T12:00:00'), 'EEEE, d MMMM yyyy')}
              </p>
              {slots.length === 0 ? (
                <p className="text-sm text-charcoal-muted font-dm py-4">No times available for this day.</p>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {slots.map((slot) => {
                    const booked = slotBooked(slot)
                    const selected = selectedTime === slot
                    return (
                      <button
                        key={slot}
                        type="button"
                        disabled={booked}
                        onClick={() => !booked && onSelect(selectedDate, slot)}
                        className={`rounded-xl py-2.5 text-center text-sm font-dm transition-all ${
                          booked
                            ? 'bg-charcoal-light text-charcoal-muted/50 cursor-not-allowed opacity-50'
                            : selected
                              ? 'bg-brand-pink text-white'
                              : 'border border-gray-200 cursor-pointer hover:border-brand-pink hover:bg-brand-pink-pale'
                        }`}
                      >
                        {format(new Date(`2000-01-01T${slot}:00`), 'h:mm a')}
                      </button>
                    )
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
