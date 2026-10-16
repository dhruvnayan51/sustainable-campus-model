import { sql, json } from '@/lib/db'
import { maybeTick } from '@/lib/sim'

export async function GET(request: Request) {
  try {
    await maybeTick()
    const url = new URL(request.url), code = url.searchParams.get('code'), search = url.searchParams.get('search')
    if (code) {
      const [building] = await sql`SELECT code, name, type, x, y, occupancy_pct, energy_kwh, water_l, waste_fill_pct, score, status FROM buildings WHERE code = ${code}`
      if (!building) return json({ error: 'Building not found' }, { status: 404 })
      const [history, alerts, tickets] = await Promise.all([
        sql`SELECT ts, energy_kwh, water_l, occupancy_pct, waste_fill_pct FROM telemetry WHERE building_code = ${code} ORDER BY ts DESC LIMIT 100`,
        sql`SELECT id, severity, title, detail, status, created_at FROM alerts WHERE building_code = ${code} ORDER BY created_at DESC LIMIT 25`,
        sql`SELECT id, title, priority, status, assignee, created_at, updated_at FROM tickets WHERE building_code = ${code} ORDER BY created_at DESC LIMIT 25`,
      ])
      return json({ building, history, alerts, tickets })
    }
    const buildings = search ? await sql`SELECT * FROM buildings WHERE name ILIKE ${`%${search}%`} OR code ILIKE ${`%${search}%`} ORDER BY name` : await sql`SELECT * FROM buildings ORDER BY name`
    return json({ buildings })
  } catch (error) { console.error('[v0] buildings failed', error); return json({ error: 'Unable to load buildings' }, { status: 500 }) }
}
