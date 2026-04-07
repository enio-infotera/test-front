const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333"

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly statusText: string,
    message?: string
  ) {
    super(message ?? `API Error ${status}: ${statusText}`)
    this.name = "ApiError"
  }

  get isNotFound() {
    return this.status === 404
  }

  get isServerError() {
    return this.status >= 500
  }
}

type RequestOptions = Omit<RequestInit, "body"> & {
  params?: Record<string, string | number | boolean | undefined>
  body?: unknown
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { params, body, ...init } = options

  let url = `${API_BASE_URL}${path}`

  if (params) {
    const searchParams = new URLSearchParams()
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        searchParams.set(key, String(value))
      }
    }
    const qs = searchParams.toString()
    if (qs) url += `?${qs}`
  }

  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init.headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    throw new ApiError(response.status, response.statusText)
  }

  return response.json() as Promise<T>
}

export const api = {
  get: <T>(path: string, params?: RequestOptions["params"]) =>
    request<T>(path, { method: "GET", params }),
  post: <T>(path: string, body: unknown) => request<T>(path, { method: "POST", body }),
}
