import 'server-only'

import { db } from '@/lib/db'
import { sql } from 'drizzle-orm'

/**
 * Appends a fresh simulated reading for every active device when the most
 * recent reading is older than `staleSeconds`. This keeps the dashboard's
 * live data flowing in the demo environment. In a real deployment these rows
 * would come from device telemetry / an ingestion pipeline instead.
 */
export async function ingestLiveTick(staleSeconds = 20) {
  await db.execute(sql`
    INSERT INTO readings (device_id, site_id, ts, power_kw, energy_kwh, voltage, current_a, power_factor, frequency_hz)
    SELECT
      d.id,
      d.site_id,
      now(),
      GREATEST(0, d.capacity_kw * (0.5 + 0.3 * sin(extract(epoch from now())/3600.0 * (2*pi()/24)) + (random()-0.5)*0.18)),
      GREATEST(0, d.capacity_kw * (0.5 + 0.3 * sin(extract(epoch from now())/3600.0 * (2*pi()/24))) / 60.0),
      480 + (random()-0.5)*9,
      d.capacity_kw * (0.4 + random()*0.3) / 0.48 / 1.732,
      0.86 + random()*0.12,
      59.96 + random()*0.08
    FROM devices d
    WHERE (d.status = 'online' OR d.type = 'solar')
      AND NOT EXISTS (
        SELECT 1 FROM readings r
        WHERE r.device_id = d.id
          AND r.ts > now() - (${staleSeconds} || ' seconds')::interval
      )
  `)
}
