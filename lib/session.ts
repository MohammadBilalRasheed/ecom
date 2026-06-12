import 'server-only'

import { auth, type Role } from '@/lib/auth'
import { db } from '@/lib/db'
import { user } from '@/lib/db/schema'
import { count, eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export type SessionUser = {
  id: string
  name: string
  email: string
  role: Role
}

/**
 * Returns the current session user (with role), or null if not signed in.
 * Reads the role directly from the DB so it is always authoritative.
 */
export async function getSessionUser(): Promise<SessionUser | null> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return null

  const [row] = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    })
    .from(user)
    .where(eq(user.id, session.user.id))
    .limit(1)

  if (!row) return null
  return { ...row, role: (row.role as Role) ?? 'viewer' }
}

/** Use in protected pages. Redirects to /sign-in when unauthenticated. */
export async function requireUser(): Promise<SessionUser> {
  const u = await getSessionUser()
  if (!u) redirect('/sign-in')
  return u
}

/** Throws in server actions when the user lacks one of the allowed roles. */
export async function requireRole(allowed: Role[]): Promise<SessionUser> {
  const u = await getSessionUser()
  if (!u) throw new Error('Unauthorized')
  if (!allowed.includes(u.role)) {
    throw new Error('You do not have permission to perform this action')
  }
  return u
}

export function canManage(role: Role) {
  return role === 'admin' || role === 'operator'
}

/**
 * Promotes the very first registered user to admin. Better Auth creates the
 * user row on sign-up; we flip the role to admin if they are the only user.
 */
export async function promoteFirstUserToAdmin(userId: string) {
  const [{ value }] = await db.select({ value: count() }).from(user)
  if (value === 1) {
    await db.update(user).set({ role: 'admin' }).where(eq(user.id, userId))
    return 'admin' as Role
  }
  return 'viewer' as Role
}
