import { sql, json, requireWriteKey, badRequest } from '@/lib/db'

export async function GET() { try { return json({ alerts: await sql`SELECT id, type, severity, building_code, title, detail, status, created_at, updated_at FROM alerts ORDER BY created_at DESC` }) } catch (error) { console.error('[v0] alerts failed', error); return json({ error: 'Unable to load alerts' }, { status: 500 }) } }
export async function POST(request: Request) {
  const denied = requireWriteKey(request); if (denied) return denied
  try { const body = await request.json(); if (!body.alert_id || typeof body.title !== 'string') return badRequest('alert_id and title are required'); const [ticket] = await sql`INSERT INTO tickets (title, description, building_code, priority, alert_id) SELECT ${body.title}, ${body.description || null}, building_code, ${body.priority || 'medium'}, id FROM alerts WHERE id = ${Number(body.alert_id)} RETURNING *`; return ticket ? json({ ticket }, { status: 201 }) : json({ error: 'Alert not found' }, { status: 404 }) } catch (error) { console.error('[v0] create ticket failed', error); return json({ error: 'Unable to create ticket' }, { status: 500 }) }
}
