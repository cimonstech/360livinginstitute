export function generateSlots(startTime: string, endTime: string, durationMinutes: number): string[] {
  const slots: string[] = []
  const [startH, startM] = startTime.split(':').map(Number)
  const [endH, endM] = endTime.split(':').map(Number)
  let current = startH * 60 + startM
  const end = endH * 60 + endM
  while (current + durationMinutes <= end) {
    const h = Math.floor(current / 60)
    const m = current % 60
    slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`)
    current += durationMinutes
  }
  return slots
}

export function timeToMinutes(t: string): number {
  const parts = t.split(':')
  const h = Number(parts[0])
  const m = Number(parts[1] ?? 0)
  return h * 60 + m
}

export function slotOverlapsBooking(
  slotStart: string,
  durationMinutes: number,
  bookingTime: string,
  bookingDuration: number
): boolean {
  const a0 = timeToMinutes(slotStart)
  const a1 = a0 + durationMinutes
  const b0 = timeToMinutes(bookingTime)
  const b1 = b0 + bookingDuration
  return a0 < b1 && a1 > b0
}
