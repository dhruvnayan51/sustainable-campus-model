import { sql, json } from '@/lib/db'
export async function GET() { try { return json({ solutions: await sql`SELECT id, category, title, description, est_savings_inr_month, est_co2_kg_month, effort, building_code FROM solutions ORDER BY category, title` }) } catch (error) { console.error('[v0] solutions failed', error); return json({ error: 'Unable to load solutions' }, { status: 500 }) } }
