'use server'

import { db } from '@/lib/db'
import { user } from '@/lib/db/schema'
import { requireRole } from '@/lib/session'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

const ROLES = ['admin', 'operator', 'viewer']

export async function updateUserRole(userId: string, role: string) {
  const current = await requireRole(['admin'])
  if (!ROLES.includes(role)) throw new Error('Invalid role')
  // Prevent an admin from demoting themselves (avoids lockout).
  if (current.id === userId && role !== 'admin') {
    throw new Error('You cannot change your own admin role')
  }
  await db.update(user).set({ role }).where(eq(user.id, userId))
  revalidatePath('/team')
}
