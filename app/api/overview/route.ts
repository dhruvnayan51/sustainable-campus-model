import { sql, json } from '@/lib/db'
import { maybeTick } from '@/lib/sim'

export async function GET() {
  try {
    await maybeTick()
    const [buildings, alerts, metrics] = await Promise.all([
      sql`SELECT code, name, type, x, y, occupancy_pct, energy_kwh, water_l, waste_fill_pct, score, status FROM buildings ORDER BY name`,
      sql`SELECT id, type, severity, building_code, title, detail, status, created_at FROM alerts WHERE status <> 'resolved' ORDER BY CASE severity WHEN 'critical' THEN 1 WHEN 'high' THEN 2 ELSE 3 END, created_at DESC LIMIT 8`,
      sql`SELECT date, energy_kwh, water_l, co2_avoided_kg, cost_saved_inr, waste_diverted_pct FROM daily_metrics ORDER BY date DESC LIMIT 30`,
    ])
    const counts = buildings.reduce((result: Record<string, number>, building: any) => { result[building.status] = (result[building.status] || 0) + 1; return result }, {})
    return json({ system: { synced_at: new Date().toISOString() }, kpis: { monitored: buildings.length, normal: counts.normal || 0, warning: counts.warning || 0, critical: counts.critical || 0 }, buildings, alerts, metrics })
  } catch (error) { console.error('[v0] overview failed', error); return json({ error: 'Unable to load overview' }, { status: 500 }) }
}
