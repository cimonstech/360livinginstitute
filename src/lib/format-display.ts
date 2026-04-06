import { format, parseISO } from 'date-fns'

export function formatBlogDate(iso?: string | null) {
  if (!iso) return ''
  try {
    return format(parseISO(iso), 'd MMM yyyy')
  } catch {
    return ''
  }
}

export function formatTimeFromDb(t?: string | null) {
  if (!t) return ''
  const parts = t.split(':')
  const h = Number(parts[0])
  const m = Number(parts[1] ?? 0)
  if (Number.isNaN(h)) return t
  const d = new Date(2000, 0, 1, h, m)
  return format(d, 'h:mm a')
}

export function formatEventDay(dateStr: string) {
  try {
    return format(parseISO(dateStr + 'T12:00:00'), 'd')
  } catch {
    return ''
  }
}

export function formatEventMonthYear(dateStr: string) {
  try {
    return format(parseISO(dateStr + 'T12:00:00'), 'MMMM yyyy')
  } catch {
    return ''
  }
}
