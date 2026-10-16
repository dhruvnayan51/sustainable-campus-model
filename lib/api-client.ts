import useSWR from 'swr'
const fetcher = (url: string) => fetch(url).then(async (response) => { const data = await response.json(); if (!response.ok) throw new Error(data.error || 'Request failed'); return data })
export function useOverview() { return useSWR('/api/overview', fetcher, { refreshInterval: 5000 }) }
export function useBuildings(search = '') { return useSWR(`/api/buildings${search ? `?search=${encodeURIComponent(search)}` : ''}`, fetcher) }
export function useAlerts() { return useSWR('/api/alerts', fetcher, { refreshInterval: 5000 }) }
export function useMaintenance() { return useSWR('/api/maintenance', fetcher) }
export function useSolutions() { return useSWR('/api/solutions', fetcher) }
export function useAnalytics(metric = 'energy_kwh', range = '7D') { return useSWR(`/api/analytics?metric=${encodeURIComponent(metric)}&range=${range}`, fetcher) }
export async function runDemoScenario() { return fetch('/api/scenario', { method: 'POST' }).then((r) => r.json()) }
export async function setAlertStatus(id: number, status: string) { return fetch(`/api/alerts/${id}`, { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ status }) }).then((r) => r.json()) }
export async function createTicketFromAlert(alert_id: number, title: string) { return fetch('/api/alerts', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ alert_id, title }) }).then((r) => r.json()) }
export async function updateTicket(id: number, status: string) { return fetch(`/api/maintenance/${id}`, { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ status }) }).then((r) => r.json()) }
export async function askCopilot(message: string, session_id = 'default') { return fetch('/api/copilot', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ message, session_id }) }).then((r) => r.json()) }
