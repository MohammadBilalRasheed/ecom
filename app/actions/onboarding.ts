'use server'

import { promoteFirstUserToAdmin } from '@/lib/session'

/**
 * Called right after a successful sign-up. If this is the first user in the
 * system, they become the admin. Returns the resulting role.
 */
export async function finalizeSignup(userId: string) {
  const role = await promoteFirstUserToAdmin(userId)
  return { role }
}
