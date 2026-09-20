/** Админы клиент талын fetch туслахууд. */

export type ApiError = { error: string }

async function parse(res: Response) {
  const text = await res.text()
  try {
    return text ? JSON.parse(text) : {}
  } catch {
    return { error: text || 'Тодорхойгүй алдаа.' }
  }
}

export async function api<T = any>(
  url: string,
  options: RequestInit & { json?: unknown } = {},
): Promise<T> {
  const { json, headers, ...rest } = options
  const res = await fetch(url, {
    ...rest,
    headers: {
      ...(json !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
    body: json !== undefined ? JSON.stringify(json) : rest.body,
    cache: 'no-store',
  })

  const data = await parse(res)
  if (!res.ok) throw new Error((data as ApiError).error || `Алдаа гарлаа (${res.status})`)
  return data as T
}

/** Зургийг S3 руу байршуулж, CloudFront URL-ыг буцаана. */
export async function uploadImage(file: File, folder = 'uploads'): Promise<string> {
  const form = new FormData()
  form.append('file', file)
  form.append('folder', folder)
  const res = await fetch('/api/upload', { method: 'POST', body: form })
  const data = await parse(res)
  if (!res.ok) throw new Error((data as ApiError).error || 'Зураг байршуулж чадсангүй.')
  return (data as { url: string }).url
}
