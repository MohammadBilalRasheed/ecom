import type { ReactNode } from 'react'
import { requireUser } from '@/lib/session'
import { getDashboardKpis } from '@/lib/queries'
import { SidebarNav } from '@/components/sidebar-nav'
import { MobileNav } from '@/components/mobile-nav'
import { UserMenu } from '@/components/user-menu'
import { LiveClock } from '@/components/live-clock'
import type { Role } from '@/lib/auth'

export default async function AppLayout({
  children,
}: {
  children: ReactNode
}) {
  const user = await requireUser()
  const kpis = await getDashboardKpis()
  const role = user.role as Role

  return (
    <div className="min-h-svh bg-background">
      <div className="flex">
        {/* Desktop sidebar */}
        <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-sidebar border-r border-sidebar-border">
          <SidebarNav role={role} activeAlerts={kpis.activeAlerts} />
        </aside>

        <div className="flex-1 lg:pl-64 min-w-0">
          <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur lg:px-6">
            <MobileNav role={role} activeAlerts={kpis.activeAlerts} />
            <LiveClock />
            <div className="ml-auto flex items-center gap-3">
              <UserMenu name={user.name} email={user.email} role={role} />
            </div>
          </header>

          <main className="px-4 py-6 lg:px-6 lg:py-8 max-w-[1600px] mx-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
