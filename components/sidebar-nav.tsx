'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  MapPin,
  Cpu,
  Bell,
  LineChart,
  Users,
  Zap,
} from 'lucide-react'
import type { Role } from '@/lib/auth'

const NAV = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/sites', label: 'Sites', icon: MapPin },
  { href: '/devices', label: 'Devices', icon: Cpu },
  { href: '/alerts', label: 'Alerts', icon: Bell },
  { href: '/reports', label: 'Reports', icon: LineChart },
  { href: '/team', label: 'Team', icon: Users, adminOnly: true },
]

export function SidebarNav({
  role,
  activeAlerts,
}: {
  role: Role
  activeAlerts: number
}) {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col gap-1 px-3 py-4" aria-label="Primary">
      <Link
        href="/"
        className="flex items-center gap-2 px-2 py-2 mb-4"
        aria-label="Voltreon EMS home"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
          <Zap className="h-4 w-4" />
        </div>
        <span className="text-sm font-semibold tracking-tight text-sidebar-foreground">
          Voltreon <span className="text-muted-foreground">EMS</span>
        </span>
      </Link>

      {NAV.map((item) => {
        if (item.adminOnly && role !== 'admin') return null
        const active =
          item.href === '/'
            ? pathname === '/'
            : pathname.startsWith(item.href)
        const Icon = item.icon
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
              active
                ? 'bg-sidebar-primary/15 text-sidebar-primary'
                : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground',
            )}
            aria-current={active ? 'page' : undefined}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span className="flex-1">{item.label}</span>
            {item.href === '/alerts' && activeAlerts > 0 && (
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1.5 text-xs font-semibold text-destructive-foreground">
                {activeAlerts}
              </span>
            )}
          </Link>
        )
      })}
    </nav>
  )
}
