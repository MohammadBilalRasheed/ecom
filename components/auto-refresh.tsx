'use client'

import { useEffect, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'

export function AutoRefresh({
  intervalMs = 15000,
  showButton = true,
}: {
  intervalMs?: number
  showButton?: boolean
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [enabled, setEnabled] = useState(true)

  useEffect(() => {
    if (!enabled) return
    const id = setInterval(() => {
      startTransition(() => router.refresh())
    }, intervalMs)
    return () => clearInterval(id)
  }, [enabled, intervalMs, router])

  if (!showButton) return null

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => startTransition(() => router.refresh())}
        aria-label="Refresh data"
      >
        <RefreshCw className={cn('h-4 w-4', isPending && 'animate-spin')} />
        Refresh
      </Button>
      <Button
        variant={enabled ? 'secondary' : 'ghost'}
        size="sm"
        onClick={() => setEnabled((v) => !v)}
        aria-pressed={enabled}
      >
        <span
          className={cn(
            'mr-1 h-2 w-2 rounded-full',
            enabled ? 'bg-primary animate-pulse' : 'bg-muted-foreground',
          )}
        />
        {enabled ? 'Live' : 'Paused'}
      </Button>
    </div>
  )
}
