import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

export function KpiCard({
  label,
  value,
  unit,
  icon: Icon,
  hint,
  accent = 'primary',
}: {
  label: string
  value: string
  unit?: string
  icon: LucideIcon
  hint?: string
  accent?: 'primary' | 'success' | 'warning' | 'destructive'
}) {
  const accentMap = {
    primary: 'bg-primary/15 text-primary',
    success: 'bg-success/15 text-success',
    warning: 'bg-warning/15 text-warning',
    destructive: 'bg-destructive/15 text-destructive',
  }
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight tabular-nums text-card-foreground">
            {value}
            {unit && (
              <span className="ml-1 text-base font-normal text-muted-foreground">
                {unit}
              </span>
            )}
          </p>
        </div>
        <div
          className={cn(
            'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
            accentMap[accent],
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {hint && <p className="mt-3 text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}
