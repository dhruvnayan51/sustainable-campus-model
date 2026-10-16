import { neon } from '@neondatabase/serverless'

export const sql = neon(process.env.DATABASE_URL!)

export function requireWriteKey(request: Request) {
  const configured = process.env.API_KEY
  if (configured && request.headers.get('x-api-key') !== configured) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'content-type': 'application/json' } })
  }
  return null
}

export function json(data: unknown, init?: ResponseInit) {
  return Response.json(data, { headers: { 'cache-control': 'no-store' }, ...init })
}

export function parseId(value: string) {
  const id = Number(value)
  return Number.isSafeInteger(id) && id > 0 ? id : null
}

export function badRequest(message: string) { return json({ error: message }, { status: 400 }) }
export function notFound(message = 'Not found') { return json({ error: message }, { status: 404 }) }
