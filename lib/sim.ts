import { sql } from './db'

let lastTick = 0
export async function maybeTick() {
  if (Date.now() - lastTick < 4000) return
  lastTick = Date.now()
  await sql`INSERT INTO telemetry (building_code, energy_kwh, water_l, occupancy_pct, waste_fill_pct) SELECT code, energy_kwh, water_l, occupancy_pct, waste_fill_pct FROM buildings ON CONFLICT DO NOTHING`
}
