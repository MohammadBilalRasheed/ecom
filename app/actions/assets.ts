'use server'

import { db } from '@/lib/db'
import { devices, readings, sites } from '@/lib/db/schema'
import { requireRole } from '@/lib/session'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export async function createSite(input: {
  name: string
  location: string
  timezone: string
  capacityKw: number
}) {
  await requireRole(['admin', 'operator'])
  await db.insert(sites).values({
    name: input.name,
    location: input.location,
    timezone: input.timezone || 'UTC',
    capacityKw: input.capacityKw || 0,
    status: 'active',
  })
  revalidatePath('/sites')
  revalidatePath('/')
}

export async function updateSiteStatus(id: number, status: string) {
  await requireRole(['admin', 'operator'])
  await db.update(sites).set({ status }).where(eq(sites.id, id))
  revalidatePath('/sites')
}

export async function deleteSite(id: number) {
  await requireRole(['admin'])
  await db.delete(readings).where(eq(readings.siteId, id))
  await db.delete(devices).where(eq(devices.siteId, id))
  await db.delete(sites).where(eq(sites.id, id))
  revalidatePath('/sites')
  revalidatePath('/devices')
  revalidatePath('/')
}

export async function createDevice(input: {
  siteId: number
  name: string
  type: string
  model: string
  capacityKw: number
}) {
  await requireRole(['admin', 'operator'])
  await db.insert(devices).values({
    siteId: input.siteId,
    name: input.name,
    type: input.type,
    model: input.model || null,
    capacityKw: input.capacityKw || 0,
    status: 'online',
  })
  revalidatePath('/devices')
  revalidatePath('/')
}

export async function updateDeviceStatus(id: number, status: string) {
  await requireRole(['admin', 'operator'])
  await db.update(devices).set({ status }).where(eq(devices.id, id))
  revalidatePath('/devices')
  revalidatePath('/')
}

export async function deleteDevice(id: number) {
  await requireRole(['admin', 'operator'])
  await db.delete(readings).where(eq(readings.deviceId, id))
  await db.delete(devices).where(eq(devices.id, id))
  revalidatePath('/devices')
  revalidatePath('/')
}
