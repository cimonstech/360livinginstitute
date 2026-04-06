type Row = { service_title: string; status: string }

export default function AppointmentsByService({ appointments }: { appointments: Row[] }) {
  const map = new Map<string, number>()
  for (const a of appointments) {
    const t = a.service_title || 'Unknown'
    map.set(t, (map.get(t) ?? 0) + 1)
  }
  const entries = [...map.entries()].sort((a, b) => b[1] - a[1])
  const total = appointments.length || 1

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <h2 className="font-medium text-sm text-charcoal mb-5 font-dm">Bookings by Service</h2>
      {entries.length === 0 ? (
        <p className="text-sm text-charcoal-muted font-dm">No data yet</p>
      ) : (
        entries.map(([name, count]) => (
          <div key={name} className="flex flex-col gap-1 mb-4 last:mb-0">
            <div className="flex justify-between text-xs text-charcoal-muted font-dm">
              <span className="truncate pr-2">{name}</span>
              <span className="shrink-0">{count}</span>
            </div>
            <div className="h-1.5 bg-charcoal-light rounded-full w-full overflow-hidden">
              <div
                className="h-full bg-brand-pink rounded-full transition-all"
                style={{ width: `${Math.max(4, (count / total) * 100)}%` }}
              />
            </div>
          </div>
        ))
      )}
    </div>
  )
}
