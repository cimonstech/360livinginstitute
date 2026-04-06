'use client'

import type { Appointment, AppointmentStatus, BlackoutDate } from '@/types'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  addMonths,
  format,
  getDay,
  isSameMonth,
  parseISO,
  startOfMonth,
  subMonths,
} from 'date-fns'
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'

type Props = {
  appointments: Appointment[]
  blackoutDates: BlackoutDate[]
}

function statusPill(status: AppointmentStatus) {
  const base = 'text-xs font-medium px-2 py-0.5 rounded-full capitalize font-dm'
  if (status === 'pending') return `${base} bg-amber-50 text-amber-700`
  return `${base} bg-brand-green-pale text-brand-green`
}

function time12(t: string) {
  const [h, m] = t.split(':').map(Number)
  const d = new Date(2000, 0, 1, h, m || 0)
  return format(d, 'h:mm a')
}

export default function AdminCalendar({ appointments, blackoutDates }: Props) {
  const router = useRouter()
  const [monthCursor, setMonthCursor] = useState(() => startOfMonth(new Date()))
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [blackoutInput, setBlackoutInput] = useState('')
  const [blackoutReason, setBlackoutReason] = useState('')
  const [savingBlackout, setSavingBlackout] = useState(false)

  const blackoutSet = useMemo(() => new Set(blackoutDates.map((b) => b.date.slice(0, 10))), [blackoutDates])

  const byDate = useMemo(() => {
    const m = new Map<string, Appointment[]>()
    for (const a of appointments) {
      const d = a.appointment_date.slice(0, 10)
      if (!m.has(d)) m.set(d, [])
      m.get(d)!.push(a)
    }
    return m
  }, [appointments])

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

  const dayAppointments = selectedDate ? byDate.get(selectedDate) ?? [] : []

  async function addBlackout() {
    if (!blackoutInput) return
    setSavingBlackout(true)
    const supabase = createClient()
    const { error } = await supabase.from('blackout_dates').insert({
      date: blackoutInput,
      reason: blackoutReason.trim() || null,
    })
    setSavingBlackout(false)
    if (!error) {
      setBlackoutInput('')
      setBlackoutReason('')
      router.refresh()
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={() => setMonthCursor((m) => subMonths(m, 1))}
            className="rounded-full p-2 text-charcoal-muted hover:bg-charcoal-light"
            aria-label="Previous month"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="font-dm text-sm font-medium text-charcoal">{format(monthCursor, 'MMMM yyyy')}</span>
          <button
            type="button"
            onClick={() => setMonthCursor((m) => addMonths(m, 1))}
            className="rounded-full p-2 text-charcoal-muted hover:bg-charcoal-light"
            aria-label="Next month"
          >
            <ChevronRight size={20} />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-xs text-charcoal-muted font-dm mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((cell, i) => {
            if (!cell) return <div key={`e-${i}`} className="aspect-square min-h-[72px]" />
            const key = format(cell.date, 'yyyy-MM-dd')
            const list = byDate.get(key) ?? []
            const isBlackout = blackoutSet.has(key)
            const selected = selectedDate === key
            const inMonth = isSameMonth(cell.date, monthCursor)
            return (
              <button
                key={key}
                type="button"
                disabled={!inMonth}
                onClick={() => inMonth && setSelectedDate(key)}
                className={`aspect-square min-h-[72px] rounded-lg p-1 text-left text-sm font-dm transition-colors flex flex-col ${
                  !inMonth
                    ? 'opacity-0 pointer-events-none'
                    : isBlackout
                      ? 'bg-red-50 border border-red-100'
                      : selected
                        ? 'bg-brand-pink text-white'
                        : 'hover:bg-brand-pink-pale border border-transparent'
                }`}
              >
                <span className="font-medium">{cell.day}</span>
                <div className="flex flex-wrap gap-0.5 mt-auto justify-center">
                  {list.slice(0, 3).map((a) => (
                    <span
                      key={a.id}
                      className={`h-1.5 w-1.5 rounded-full ${selected ? 'bg-white' : 'bg-brand-pink'}`}
                      aria-hidden
                    />
                  ))}
                  {list.length > 3 && (
                    <span className={`text-[10px] leading-none ${selected ? 'text-white' : 'text-brand-pink'}`}>
                      +{list.length - 3}
                    </span>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 min-h-[200px]">
          <h2 className="font-medium text-sm text-charcoal mb-4 font-dm">
            {selectedDate
              ? format(parseISO(selectedDate + 'T12:00:00'), 'EEEE, d MMMM yyyy')
              : 'Select a day'}
          </h2>
          {!selectedDate ? (
            <p className="text-sm text-charcoal-muted font-dm">Click a date on the calendar.</p>
          ) : dayAppointments.length === 0 ? (
            <p className="text-sm text-charcoal-muted font-dm">No sessions scheduled.</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {dayAppointments.map((a) => (
                <li key={a.id} className="border border-gray-100 rounded-xl p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-sm font-medium text-charcoal font-dm">{time12(a.appointment_time)}</span>
                    <span className={statusPill(a.status)}>{a.status}</span>
                  </div>
                  <p className="text-sm text-charcoal font-dm mt-1">{a.client_name}</p>
                  <p className="text-xs text-charcoal-muted font-dm">{a.service_title}</p>
                  <Link
                    href={`/admin/appointments/${a.id}`}
                    className="inline-block mt-2 text-xs text-brand-pink font-dm hover:underline"
                  >
                    Open appointment →
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-medium text-sm text-charcoal mb-3 font-dm">Add Blackout Date</h2>
          <div className="flex flex-col gap-3">
            <input
              type="date"
              value={blackoutInput}
              onChange={(e) => setBlackoutInput(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm font-dm"
            />
            <input
              type="text"
              value={blackoutReason}
              onChange={(e) => setBlackoutReason(e.target.value)}
              placeholder="Reason (optional)"
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm font-dm"
            />
            <button
              type="button"
              disabled={savingBlackout || !blackoutInput}
              onClick={addBlackout}
              className="rounded-full bg-brand-pink text-white px-5 py-2.5 text-sm font-dm inline-flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {savingBlackout ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Save blackout
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
