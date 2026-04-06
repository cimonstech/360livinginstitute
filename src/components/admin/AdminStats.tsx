import { cn } from '@/lib/utils'

type Stats = {
  total: number
  pending: number
  confirmed: number
  completed: number
  eventRegistrations: number
}

const cards: { key: keyof Stats; label: string; sub: string; color: string }[] = [
  { key: 'total', label: 'Total Bookings', sub: 'All time', color: 'text-charcoal' },
  { key: 'pending', label: 'Pending', sub: 'Awaiting approval', color: 'text-amber-600' },
  { key: 'confirmed', label: 'Confirmed', sub: 'Upcoming sessions', color: 'text-brand-green' },
  { key: 'completed', label: 'Completed', sub: 'Sessions done', color: 'text-charcoal-muted' },
  { key: 'eventRegistrations', label: 'Event Registrations', sub: 'Total signups', color: 'text-brand-green' },
]

export default function AdminStats({ stats }: { stats: Stats }) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
      {cards.map(({ key, label, sub, color }) => (
        <div key={key} className="bg-white rounded-2xl p-5 border border-gray-100">
          <p className="text-xs font-medium text-charcoal-muted uppercase tracking-wider mb-3 font-dm">{label}</p>
          <p className={cn('font-lora text-3xl font-normal', color)}>{stats[key] as number}</p>
          <p className="text-xs text-charcoal-muted mt-1 font-dm">{sub}</p>
        </div>
      ))}
    </div>
  )
}
