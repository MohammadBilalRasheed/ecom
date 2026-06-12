'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { SidebarNav } from '@/components/sidebar-nav'
import type { Role } from '@/lib/auth'
import { cn } from '@/lib/utils'

export function MobileNav({
  role,
  activeAlerts,
}: {
  role: Role
  activeAlerts: number
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setOpen(true)}
        className="flex h-9 w-9 items-center justify-center rounded-md hover:bg-accent"
        aria-label="Open navigation menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setOpen(false)}
          />
          <div
            className={cn(
              'absolute left-0 top-0 h-full w-64 bg-sidebar border-r border-sidebar-border',
            )}
            onClick={() => setOpen(false)}
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute right-3 top-4 flex h-8 w-8 items-center justify-center rounded-md text-sidebar-foreground/70 hover:bg-sidebar-accent"
              aria-label="Close navigation menu"
            >
              <X className="h-4 w-4" />
            </button>
            <SidebarNav role={role} activeAlerts={activeAlerts} />
          </div>
        </div>
      )}
    </div>
  )
}
