const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ?? ''

type ApiFetchOptions = RequestInit & {
  json?: unknown
}

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const { json, headers, ...init } = options
  const apiPath = path.startsWith('/') ? path : `/${path}`

  const response = await fetch(`${API_BASE_URL}${apiPath}`, {
    ...init,
    headers: {
      ...(json === undefined ? {} : { 'Content-Type': 'application/json' }),
      ...headers,
    },
    body: json === undefined ? init.body : JSON.stringify(json),
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(data?.error ?? `Request failed with ${response.status}`)
  }

  return data as T
}
