import {
  pgTable,
  text,
  timestamp,
  boolean,
  serial,
  bigserial,
  integer,
  doublePrecision,
} from 'drizzle-orm/pg-core'

// --- Better Auth required tables -------------------------------------------
// Column names are camelCase to match Better Auth's defaults. Do not rename.

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image: text('image'),
  // EMS role: 'admin' | 'operator' | 'viewer'
  role: text('role').notNull().default('viewer'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expiresAt').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
  refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
})

// --- App tables ------------------------------------------------------------
// EMS data is shared across the organization (not per-user). Authorization is
// governed by the user's `role`, not by row ownership.

export const sites = pgTable('sites', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  location: text('location').notNull(),
  timezone: text('timezone').notNull().default('UTC'),
  capacityKw: doublePrecision('capacity_kw').notNull().default(0),
  status: text('status').notNull().default('active'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const devices = pgTable('devices', {
  id: serial('id').primaryKey(),
  siteId: integer('site_id').notNull(),
  name: text('name').notNull(),
  type: text('type').notNull(),
  model: text('model'),
  capacityKw: doublePrecision('capacity_kw').notNull().default(0),
  status: text('status').notNull().default('online'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const readings = pgTable('readings', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  deviceId: integer('device_id').notNull(),
  siteId: integer('site_id').notNull(),
  ts: timestamp('ts').notNull().defaultNow(),
  powerKw: doublePrecision('power_kw').notNull().default(0),
  energyKwh: doublePrecision('energy_kwh').notNull().default(0),
  voltage: doublePrecision('voltage').notNull().default(0),
  currentA: doublePrecision('current_a').notNull().default(0),
  powerFactor: doublePrecision('power_factor').notNull().default(0),
  frequencyHz: doublePrecision('frequency_hz').notNull().default(0),
})

export const alerts = pgTable('alerts', {
  id: serial('id').primaryKey(),
  deviceId: integer('device_id'),
  siteId: integer('site_id').notNull(),
  severity: text('severity').notNull().default('warning'),
  type: text('type').notNull(),
  message: text('message').notNull(),
  status: text('status').notNull().default('active'),
  acknowledgedBy: text('acknowledged_by'),
  acknowledgedAt: timestamp('acknowledged_at'),
  resolvedAt: timestamp('resolved_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})
