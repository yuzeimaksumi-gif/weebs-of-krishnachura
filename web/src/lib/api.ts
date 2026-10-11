// Where the API lives. In production this is set at build time (Stage 12).
const API_URL =
  (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:8787'

export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; status: number; error: string; fields?: Record<string, string> }

async function request<T>(path: string, init?: RequestInit): Promise<ApiResult<T>> {
  try {
    const res = await fetch(`${API_URL}${path}`, init)
    const json = await res.json().catch(() => ({}))
    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        error: typeof json.error === 'string' ? json.error : 'request_failed',
        fields: json.fields,
      }
    }
    return { ok: true, data: json as T }
  } catch {
    // Network error: API offline, no internet, blocked, etc.
    return { ok: false, status: 0, error: 'network' }
  }
}

export function apiGet<T>(path: string) {
  return request<T>(path)
}

export function apiPost<T>(path: string, body: unknown) {
  return request<T>(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}