import { cn } from '@/lib/utils'

const STATUS_STYLES: Record<string, string> = {
  online: 'bg-success/15 text-success border-success/30',
  active: 'bg-success/15 text-success border-success/30',
  offline: 'bg-muted text-muted-foreground border-border',
  fault: 'bg-destructive/15 text-destructive border-destructive/30',
  maintenance: 'bg-warning/15 text-warning border-warning/30',
}

const SEVERITY_STYLES: Record<string, string> = {
  critical: 'bg-destructive/15 text-destructive border-destructive/30',
  warning: 'bg-warning/15 text-warning border-warning/30',
  info: 'bg-primary/15 text-primary border-primary/30',
  acknowledged: 'bg-muted text-muted-foreground border-border',
  resolved: 'bg-success/15 text-success border-success/30',
}

export function StatusBadge({
  status,
  kind = 'status',
}: {
  status: string
  kind?: 'status' | 'severity'
}) {
  const map = kind === 'severity' ? SEVERITY_STYLES : STATUS_STYLES
  const cls = map[status] ?? 'bg-muted text-muted-foreground border-border'
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium capitalize',
        cls,
      )}
    >
      <span
        className={cn(
          'h-1.5 w-1.5 rounded-full',
          status === 'online' || status === 'active'
            ? 'bg-success'
            : status === 'fault' || status === 'critical'
              ? 'bg-destructive'
              : status === 'maintenance' || status === 'warning'
                ? 'bg-warning'
                : status === 'info'
                  ? 'bg-primary'
                  : 'bg-muted-foreground',
        )}
      />
      {status}
    </span>
  )
}
