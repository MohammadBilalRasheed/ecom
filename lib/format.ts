export function formatKw(value: number): string {
  if (Math.abs(value) >= 1000) {
    return `${(value / 1000).toFixed(2)} MW`
  }
  return `${value.toFixed(1)} kW`
}

export function formatKwh(value: number): string {
  if (Math.abs(value) >= 1000) {
    return `${(value / 1000).toFixed(2)} MWh`
  }
  return `${value.toFixed(0)} kWh`
}

export function formatNumber(value: number, digits = 0): string {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })
}

export function timeAgo(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const seconds = Math.floor((Date.now() - d.getTime()) / 1000)
  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export const SEVERITY_ORDER: Record<string, number> = {
  critical: 0,
  warning: 1,
  info: 2,
}

export const DEVICE_TYPES = [
  'meter',
  'load',
  'solar',
  'battery',
  'generator',
] as const

export const SITE_STATUSES = ['active', 'maintenance', 'offline'] as const
export const DEVICE_STATUSES = [
  'online',
  'offline',
  'fault',
  'maintenance',
] as const
