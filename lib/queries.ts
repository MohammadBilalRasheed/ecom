import 'server-only'

import { db } from '@/lib/db'
import { alerts, devices, readings, sites } from '@/lib/db/schema'
import { and, count, desc, eq, gte, sql } from 'drizzle-orm'

export type SiteRow = typeof sites.$inferSelect
export type DeviceRow = typeof devices.$inferSelect
export type AlertRow = typeof alerts.$inferSelect

// ---- Sites ----------------------------------------------------------------

export async function getSites() {
  return db.select().from(sites).orderBy(sites.name)
}

export async function getSiteById(id: number) {
  const [row] = await db.select().from(sites).where(eq(sites.id, id)).limit(1)
  return row ?? null
}

// ---- Devices --------------------------------------------------------------

export async function getDevices() {
  return db.select().from(devices).orderBy(devices.siteId, devices.name)
}

export async function getDevicesForSite(siteId: number) {
  return db
    .select()
    .from(devices)
    .where(eq(devices.siteId, siteId))
    .orderBy(devices.name)
}

// ---- Live metrics (latest reading per device) -----------------------------

export type LiveDevice = {
  id: number
  name: string
  type: string
  status: string
  siteId: number
  siteName: string
  capacityKw: number
  powerKw: number
  voltage: number
  currentA: number
  powerFactor: number
  frequencyHz: number
  ts: Date | null
}

export async function getLiveDevices(): Promise<LiveDevice[]> {
  const rows = await db.execute(sql`
    SELECT d.id, d.name, d.type, d.status, d.site_id AS "siteId",
           s.name AS "siteName", d.capacity_kw AS "capacityKw",
           COALESCE(r.power_kw, 0) AS "powerKw",
           COALESCE(r.voltage, 0) AS "voltage",
           COALESCE(r.current_a, 0) AS "currentA",
           COALESCE(r.power_factor, 0) AS "powerFactor",
           COALESCE(r.frequency_hz, 0) AS "frequencyHz",
           r.ts AS "ts"
    FROM devices d
    JOIN sites s ON s.id = d.site_id
    LEFT JOIN LATERAL (
      SELECT power_kw, voltage, current_a, power_factor, frequency_hz, ts
      FROM readings rr
      WHERE rr.device_id = d.id
      ORDER BY rr.ts DESC
      LIMIT 1
    ) r ON true
    ORDER BY s.name, d.name
  `)
  return (rows.rows as any[]).map((r) => ({
    ...r,
    powerKw: Number(r.powerKw),
    voltage: Number(r.voltage),
    currentA: Number(r.currentA),
    powerFactor: Number(r.powerFactor),
    frequencyHz: Number(r.frequencyHz),
    capacityKw: Number(r.capacityKw),
    ts: r.ts ? new Date(r.ts) : null,
  })) as LiveDevice[]
}

// ---- Dashboard KPIs --------------------------------------------------------

export type DashboardKpis = {
  totalPowerKw: number
  totalCapacityKw: number
  energyTodayKwh: number
  siteCount: number
  deviceCount: number
  onlineCount: number
  offlineCount: number
  activeAlerts: number
  criticalAlerts: number
}

export async function getDashboardKpis(): Promise<DashboardKpis> {
  const live = await getLiveDevices()
  const totalPowerKw = live.reduce((s, d) => s + d.powerKw, 0)
  const totalCapacityKw = live.reduce((s, d) => s + d.capacityKw, 0)
  const onlineCount = live.filter((d) => d.status === 'online').length
  const offlineCount = live.filter(
    (d) => d.status === 'offline' || d.status === 'fault',
  ).length

  const [{ value: siteCount }] = await db
    .select({ value: count() })
    .from(sites)

  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)
  const [energyRow] = await db
    .select({ total: sql<number>`COALESCE(SUM(${readings.energyKwh}), 0)` })
    .from(readings)
    .where(gte(readings.ts, todayStart))

  const [{ value: activeAlerts }] = await db
    .select({ value: count() })
    .from(alerts)
    .where(eq(alerts.status, 'active'))

  const [{ value: criticalAlerts }] = await db
    .select({ value: count() })
    .from(alerts)
    .where(and(eq(alerts.status, 'active'), eq(alerts.severity, 'critical')))

  return {
    totalPowerKw,
    totalCapacityKw,
    energyTodayKwh: Number(energyRow?.total ?? 0),
    siteCount: Number(siteCount),
    deviceCount: live.length,
    onlineCount,
    offlineCount,
    activeAlerts: Number(activeAlerts),
    criticalAlerts: Number(criticalAlerts),
  }
}

// ---- Time series (aggregated power over time) ------------------------------

export type SeriesPoint = { ts: string; powerKw: number; energyKwh: number }

export async function getPowerSeries(
  hours: number,
  siteId?: number,
): Promise<SeriesPoint[]> {
  const bucket = hours <= 48 ? '1 hour' : '1 day'
  const since = sql`now() - (${hours} || ' hours')::interval`
  const where = siteId
    ? sql`r.ts >= ${since} AND r.site_id = ${siteId}`
    : sql`r.ts >= ${since}`

  const rows = await db.execute(sql`
    SELECT date_trunc(${bucket === '1 hour' ? 'hour' : 'day'}, r.ts) AS bucket,
           SUM(r.power_kw) / GREATEST(COUNT(DISTINCT r.device_id), 1) * COUNT(DISTINCT r.device_id) AS power_kw,
           SUM(r.energy_kwh) AS energy_kwh
    FROM readings r
    WHERE ${where}
    GROUP BY bucket
    ORDER BY bucket
  `)
  return (rows.rows as any[]).map((r) => ({
    ts: new Date(r.bucket).toISOString(),
    powerKw: Number(r.power_kw),
    energyKwh: Number(r.energy_kwh),
  }))
}

// ---- Energy by site (for breakdown charts) ---------------------------------

export type SiteEnergy = { siteId: number; siteName: string; energyKwh: number }

export async function getEnergyBySite(hours = 24): Promise<SiteEnergy[]> {
  const rows = await db.execute(sql`
    SELECT s.id AS "siteId", s.name AS "siteName",
           COALESCE(SUM(r.energy_kwh), 0) AS "energyKwh"
    FROM sites s
    LEFT JOIN readings r
      ON r.site_id = s.id AND r.ts >= now() - (${hours} || ' hours')::interval
    GROUP BY s.id, s.name
    ORDER BY "energyKwh" DESC
  `)
  return (rows.rows as any[]).map((r) => ({
    siteId: Number(r.siteId),
    siteName: r.siteName,
    energyKwh: Number(r.energyKwh),
  }))
}

// ---- Device detail series --------------------------------------------------

export async function getDeviceSeries(deviceId: number, hours = 48) {
  const rows = await db.execute(sql`
    SELECT date_trunc('hour', ts) AS bucket,
           AVG(power_kw) AS power_kw,
           AVG(voltage) AS voltage,
           AVG(power_factor) AS power_factor
    FROM readings
    WHERE device_id = ${deviceId}
      AND ts >= now() - (${hours} || ' hours')::interval
    GROUP BY bucket
    ORDER BY bucket
  `)
  return (rows.rows as any[]).map((r) => ({
    ts: new Date(r.bucket).toISOString(),
    powerKw: Number(r.power_kw),
    voltage: Number(r.voltage),
    powerFactor: Number(r.power_factor),
  }))
}

// ---- Alerts ----------------------------------------------------------------

export type AlertWithContext = AlertRow & {
  siteName: string | null
  deviceName: string | null
}

export async function getAlerts(
  status?: 'active' | 'acknowledged' | 'resolved',
): Promise<AlertWithContext[]> {
  const rows = await db.execute(sql`
    SELECT a.*, s.name AS "siteName", d.name AS "deviceName"
    FROM alerts a
    LEFT JOIN sites s ON s.id = a.site_id
    LEFT JOIN devices d ON d.id = a.device_id
    ${status ? sql`WHERE a.status = ${status}` : sql``}
    ORDER BY
      CASE a.severity WHEN 'critical' THEN 0 WHEN 'warning' THEN 1 ELSE 2 END,
      a.created_at DESC
  `)
  return (rows.rows as any[]).map((r) => ({
    id: Number(r.id),
    deviceId: r.device_id ? Number(r.device_id) : null,
    siteId: Number(r.site_id),
    severity: r.severity,
    type: r.type,
    message: r.message,
    status: r.status,
    acknowledgedBy: r.acknowledged_by,
    acknowledgedAt: r.acknowledged_at ? new Date(r.acknowledged_at) : null,
    resolvedAt: r.resolved_at ? new Date(r.resolved_at) : null,
    createdAt: new Date(r.created_at),
    siteName: r.siteName,
    deviceName: r.deviceName,
  })) as AlertWithContext[]
}

export async function getRecentAlerts(limit = 6) {
  return (await getAlerts('active')).slice(0, limit)
}

// ---- Users (admin) ---------------------------------------------------------

export async function getAllUsers() {
  const rows = await db.execute(sql`
    SELECT id, name, email, role, "createdAt"
    FROM "user"
    ORDER BY "createdAt" ASC
  `)
  return (rows.rows as any[]).map((r) => ({
    id: r.id,
    name: r.name,
    email: r.email,
    role: r.role as string,
    createdAt: new Date(r.createdAt),
  }))
}
