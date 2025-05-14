import { format } from 'date-fns'

export function formatDate(date: Date | string | null | undefined) {
  if (!date) return ''
  const dateObj = date instanceof Date ? date : new Date(date)
  return format(dateObj, 'MMM d, yyyy h:mm a')
}
