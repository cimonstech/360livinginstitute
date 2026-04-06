'use client'

import type { Appointment, AppointmentStatus, DashboardEventRegistration, Profile } from '@/types'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { format, parseISO } from 'date-fns'
import { CheckCircle2, X } from 'lucide-react'

type Tab = 'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'events'

const TABS: { id: Tab; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'pending', label: 'Pending' },
  { id: 'confirmed', label: 'Confirmed' },
  { id: 'completed', label: 'Completed' },
  { id: 'cancelled', label: 'Cancelled' },
  { id: 'events', label: 'Events' },
]

function formatTime12(time: string) {
  const [h, m] = time.split(':').map(Number)
  const d = new Date(2000, 0, 1, h, m || 0)
  return format(d, 'h:mm a')
}

function statusBadgeClass(status: AppointmentStatus) {
  switch (status) {
    case 'pending':
      return 'bg-amber-50 text-amber-700 border border-amber-200'
    case 'confirmed':
      return 'bg-brand-green-pale text-brand-green border border-brand-green-light'
    case 'cancelled':
      return 'bg-red-50 text-red-600 border border-red-200'
    case 'completed':
    case 'no_show':
      return 'bg-charcoal-light text-charcoal-muted border border-gray-200'
    default:
      return 'bg-charcoal-light text-charcoal-muted border border-gray-200'
  }
}

type Props = {
  profile: Profile
  appointments: Appointment[]
  eventRegistrations: DashboardEventRegistration[]
}

function eventRegStatusClass(status: string) {
  switch (status) {
    case 'registered':
      return 'bg-brand-green-pale text-brand-green border border-brand-green-light'
    case 'attended':
      return 'bg-charcoal-light text-charcoal border border-gray-200'
    case 'cancelled':
      return 'bg-red-50 text-red-600 border border-red-200'
    case 'no_show':
      return 'bg-amber-50 text-amber-700 border border-amber-200'
    default:
      return 'bg-charcoal-light text-charcoal-muted border border-gray-200'
  }
}

export default function DashboardClient({ profile, appointments, eventRegistrations }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const verified = searchParams.get('verified')
  const [verifiedBannerDismissed, setVerifiedBannerDismissed] = useState(false)
  const showVerifiedBanner = verified === 'true' && !verifiedBannerDismissed

  const [tab, setTab] = useState<Tab>('all')
  const [confirmCancelId, setConfirmCancelId] = useState<string | null>(null)
  const [cancelling, setCancelling] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState(profile.full_name)
  const [editPhone, setEditPhone] = useState(profile.phone ?? '')
  const [savingProfile, setSavingProfile] = useState(false)

  const firstName = profile.full_name.split(/\s+/)[0] ?? profile.full_name

  const todayStr = format(new Date(), 'yyyy-MM-dd')

  const stats = useMemo(() => {
    const total = appointments.length
    const upcoming = appointments.filter(
      (a) => a.status === 'confirmed' && a.appointment_date >= todayStr
    ).length
    const completed = appointments.filter((a) => a.status === 'completed').length
    return { total, upcoming, completed }
  }, [appointments, todayStr])

  const filtered = useMemo(() => {
    if (tab === 'events') return []
    if (tab === 'all') return appointments
    if (tab === 'completed')
      return appointments.filter((a) => a.status === 'completed' || a.status === 'no_show')
    return appointments.filter((a) => a.status === tab)
  }, [appointments, tab])

  async function signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  async function cancelAppointment(id: string) {
    setCancelling(true)
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return
    const { error } = await supabase
      .from('appointments')
      .update({
        status: 'cancelled',
        cancelled_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('client_id', user.id)
    setCancelling(false)
    setConfirmCancelId(null)
    if (!error) router.refresh()
  }

  async function saveProfile() {
    setSavingProfile(true)
    const supabase = createClient()
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: editName.trim(),
        phone: editPhone.trim() || null,
      })
      .eq('id', profile.id)
    setSavingProfile(false)
    if (!error) {
      setEditing(false)
      router.refresh()
    }
  }

  const emptyLabel =
    tab === 'events'
      ? 'event registrations yet'
      : tab === 'all'
        ? 'appointments yet'
        : tab === 'completed'
          ? 'completed appointments'
          : `${tab} appointments`

  function dismissVerifiedBanner() {
    setVerifiedBannerDismissed(true)
    router.replace('/dashboard')
  }

  return (
    <section className="min-h-screen bg-warm-cream py-16 px-6 lg:px-10 max-w-5xl mx-auto">
      {showVerifiedBanner && (
        <div className="mb-6 flex items-center justify-between gap-4 rounded-2xl border border-brand-green-light bg-brand-green-pale p-4">
          <div className="flex items-center gap-3 min-w-0">
            <CheckCircle2 className="h-[18px] w-[18px] flex-shrink-0 text-brand-green" aria-hidden />
            <p className="font-dm text-sm text-charcoal">Email verified! Your account is now active.</p>
          </div>
          <button
            type="button"
            onClick={dismissVerifiedBanner}
            className="flex-shrink-0 rounded-full p-1 text-charcoal-muted transition-colors hover:bg-white/80 hover:text-charcoal"
            aria-label="Dismiss"
          >
            <X size={18} />
          </button>
        </div>
      )}

      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between mb-10">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-brand-pink font-dm mb-1">My Portal</p>
          <h1 className="font-lora text-3xl text-charcoal">Welcome back, {firstName}</h1>
          <p className="text-sm text-charcoal-muted font-light font-dm mt-1">Manage your sessions and account details</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/book"
            className="inline-flex items-center justify-center rounded-full bg-brand-pink px-5 py-2.5 text-sm font-medium text-white font-dm hover:opacity-90"
          >
            Book New Session
          </Link>
          <button
            type="button"
            onClick={signOut}
            className="inline-flex items-center justify-center rounded-full border border-charcoal/20 px-5 py-2.5 text-sm text-charcoal font-dm hover:bg-white"
          >
            Sign Out
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <p className="font-lora text-3xl text-brand-pink">{stats.total}</p>
          <p className="text-xs text-charcoal-muted mt-1 font-dm">Total Sessions</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <p className="font-lora text-3xl text-brand-pink">{stats.upcoming}</p>
          <p className="text-xs text-charcoal-muted mt-1 font-dm">Upcoming</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <p className="font-lora text-3xl text-brand-pink">{stats.completed}</p>
          <p className="text-xs text-charcoal-muted mt-1 font-dm">Completed</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1 mb-6 bg-white rounded-full p-1 border border-gray-100 w-fit max-w-full">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`rounded-full px-4 py-1.5 text-sm font-dm transition-colors ${
              tab === t.id
                ? 'bg-brand-pink text-white font-medium'
                : 'text-charcoal-muted hover:bg-charcoal-light'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        {tab === 'events' ? (
          eventRegistrations.length === 0 ? (
            <div className="py-12 text-center font-dm text-sm text-charcoal-muted">
              <p>No {emptyLabel}.</p>
              <Link href="/events" className="mt-4 inline-block text-brand-pink hover:underline">
                Browse Events
              </Link>
            </div>
          ) : (
            eventRegistrations.map((reg) => {
              const ev = reg.events
              const date = ev?.event_date
                ? parseISO(ev.event_date + 'T12:00:00')
                : parseISO(reg.created_at)
              const timeLine = ev?.event_time ? formatTime12(ev.event_time.slice(0, 5)) : null
              return (
                <div key={reg.id} className="rounded-2xl border border-gray-100 bg-white p-6">
                  <div className="grid grid-cols-1 items-center gap-4 lg:grid-cols-3">
                    <div>
                      <p className="font-lora text-2xl text-brand-green">{format(date, 'd')}</p>
                      <p className="font-dm text-xs uppercase text-charcoal-muted">{format(date, 'MMM yyyy')}</p>
                      {timeLine && <p className="mt-1 font-dm text-sm text-charcoal-muted">{timeLine}</p>}
                    </div>
                    <div>
                      <p className="font-dm text-sm font-medium text-charcoal">{ev?.title ?? 'Event'}</p>
                      <p className="mt-1 font-dm text-xs text-charcoal-muted">
                        {ev?.location ? ev.location : '—'}
                      </p>
                    </div>
                    <div className="lg:text-right">
                      <span
                        className={`inline-block rounded-full px-3 py-1 font-dm text-xs font-medium capitalize ${eventRegStatusClass(reg.status)}`}
                      >
                        {reg.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })
          )
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center font-dm text-sm text-charcoal-muted">
            <p>No {emptyLabel}.</p>
            <Link href="/book" className="mt-4 inline-block text-brand-pink hover:underline">
              Book a Session
            </Link>
          </div>
        ) : (
          filtered.map((appt) => {
            const date = parseISO(appt.appointment_date + 'T12:00:00')
            const canCancel = appt.status === 'pending' || appt.status === 'confirmed'
            return (
              <div key={appt.id} className="bg-white rounded-2xl p-6 border border-gray-100">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-center">
                  <div>
                    <p className="font-lora text-2xl text-brand-pink">{format(date, 'd')}</p>
                    <p className="text-xs text-charcoal-muted uppercase font-dm">{format(date, 'MMM yyyy')}</p>
                    <p className="text-sm text-charcoal-muted font-dm mt-1">{formatTime12(appt.appointment_time)}</p>
                  </div>
                  <div>
                    <p className="font-medium text-sm text-charcoal font-dm">{appt.service_title}</p>
                    <p className="text-xs text-charcoal-muted mt-1 font-dm">{appt.duration_minutes} minutes</p>
                  </div>
                  <div>
                    <span
                      className={`inline-block text-xs font-medium px-3 py-1 rounded-full capitalize font-dm ${statusBadgeClass(appt.status)}`}
                    >
                      {appt.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="lg:text-right">
                    {canCancel &&
                      (confirmCancelId === appt.id ? (
                        <div className="flex flex-col items-start lg:items-end gap-2">
                          <span className="text-xs text-charcoal-muted font-dm">Are you sure?</span>
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              disabled={cancelling}
                              onClick={() => cancelAppointment(appt.id)}
                              className="text-xs text-red-500 border border-red-200 rounded-full px-3 py-1.5 hover:bg-red-50 font-dm"
                            >
                              Yes, cancel
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmCancelId(null)}
                              className="text-xs text-charcoal-muted border border-gray-200 rounded-full px-3 py-1.5 hover:bg-charcoal-light font-dm"
                            >
                              No
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmCancelId(appt.id)}
                          className="text-xs text-red-500 border border-red-200 rounded-full px-3 py-1.5 hover:bg-red-50 font-dm"
                        >
                          Cancel
                        </button>
                      ))}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      <div className="mt-10 bg-white rounded-2xl p-6 border border-gray-100">
        <h2 className="font-lora text-xl text-charcoal mb-5">Account Details</h2>

        {!editing ? (
          <>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-dm text-sm mb-6">
              <div>
                <dt className="text-xs text-charcoal-muted">Full Name</dt>
                <dd className="text-charcoal font-medium mt-0.5">{profile.full_name}</dd>
              </div>
              <div>
                <dt className="text-xs text-charcoal-muted">Email</dt>
                <dd className="text-charcoal font-medium mt-0.5 break-all">{profile.email}</dd>
              </div>
              <div>
                <dt className="text-xs text-charcoal-muted">Phone</dt>
                <dd className="text-charcoal font-medium mt-0.5">{profile.phone || '—'}</dd>
              </div>
              <div>
                <dt className="text-xs text-charcoal-muted">Member since</dt>
                <dd className="text-charcoal font-medium mt-0.5">
                  {format(parseISO(profile.created_at), 'd MMMM yyyy')}
                </dd>
              </div>
            </dl>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => {
                  setEditName(profile.full_name)
                  setEditPhone(profile.phone ?? '')
                  setEditing(true)
                }}
                className="rounded-full border border-gray-200 px-5 py-2 text-sm text-charcoal font-dm hover:bg-charcoal-light"
              >
                Edit Profile
              </button>
              <Link
                href="/forgot-password"
                className="inline-flex items-center rounded-full border border-gray-200 px-5 py-2 text-sm text-charcoal font-dm hover:bg-charcoal-light"
              >
                Change Password
              </Link>
            </div>
          </>
        ) : (
          <div className="space-y-4 max-w-md">
            <div>
              <label className="text-xs font-medium text-charcoal block mb-1.5 font-dm">Full Name</label>
              <input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-charcoal focus:outline-none focus:border-brand-pink font-dm"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-charcoal block mb-1.5 font-dm">Phone</label>
              <input
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-charcoal focus:outline-none focus:border-brand-pink font-dm"
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                disabled={savingProfile || !editName.trim()}
                onClick={saveProfile}
                className="rounded-full bg-brand-pink text-white px-5 py-2 text-sm font-medium font-dm disabled:opacity-50"
              >
                {savingProfile ? 'Saving…' : 'Save'}
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="rounded-full border border-gray-200 px-5 py-2 text-sm text-charcoal font-dm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
