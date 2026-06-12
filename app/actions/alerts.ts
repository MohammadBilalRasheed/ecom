'use server'

import { db } from '@/lib/db'
import { alerts } from '@/lib/db/schema'
import { requireRole } from '@/lib/session'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export async function acknowledgeAlert(id: number) {
  const user = await requireRole(['admin', 'operator'])
  await db
    .update(alerts)
    .set({
      status: 'acknowledged',
      acknowledgedBy: user.name,
      acknowledgedAt: new Date(),
    })
    .where(eq(alerts.id, id))
  revalidatePath('/alerts')
  revalidatePath('/')
}

export async function resolveAlert(id: number) {
  await requireRole(['admin', 'operator'])
  await db
    .update(alerts)
    .set({ status: 'resolved', resolvedAt: new Date() })
    .where(eq(alerts.id, id))
  revalidatePath('/alerts')
  revalidatePath('/')
}
