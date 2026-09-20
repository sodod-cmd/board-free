/**
 * Нэвтрэлтийн үндсэн функцууд.
 * Зөвхөн Web Crypto ашигласан тул Node болон Edge (middleware) хоёулд ажиллана.
 */

const enc = new TextEncoder()

/* ---------------- base64url ---------------- */

function bytesToB64url(bytes: Uint8Array): string {
  let bin = ''
  for (const b of bytes) bin += String.fromCharCode(b)
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function b64urlToBytes(str: string): Uint8Array {
  const b64 = str.replace(/-/g, '+').replace(/_/g, '/')
  const bin = atob(b64 + '='.repeat((4 - (b64.length % 4)) % 4))
  const out = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i)
  return out
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

/* ---------------- Нууц үгийн хэш (PBKDF2-SHA256) ---------------- */

const PBKDF2_ITERATIONS = 100_000

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const key = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, [
    'deriveBits',
  ])
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
    key,
    256,
  )
  return `pbkdf2$${PBKDF2_ITERATIONS}$${bytesToB64url(salt)}$${bytesToB64url(new Uint8Array(bits))}`
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const parts = stored?.split('$')
  if (!parts || parts.length !== 4 || parts[0] !== 'pbkdf2') return false
  const iterations = Number(parts[1])
  const salt = b64urlToBytes(parts[2])
  if (!Number.isFinite(iterations) || iterations <= 0) return false

  const key = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, [
    'deriveBits',
  ])
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations, hash: 'SHA-256' },
    key,
    256,
  )
  return timingSafeEqual(bytesToB64url(new Uint8Array(bits)), parts[3])
}

/* ---------------- JWT (HS256) ---------------- */

export type TokenPayload = {
  sub: string
  username: string
  name?: string
  iat: number
  exp: number
}

async function hmacKey(secret: string) {
  return crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  )
}

/** "7d", "15m", "1h", "45s" эсвэл секундийн тоо. */
export function parseExpiry(value: string | undefined, fallbackSeconds: number): number {
  if (!value) return fallbackSeconds
  const m = /^(\d+)\s*([smhd])?$/i.exec(value.trim())
  if (!m) return fallbackSeconds
  const n = Number(m[1])
  const unit = (m[2] || 's').toLowerCase()
  const mult = unit === 'd' ? 86400 : unit === 'h' ? 3600 : unit === 'm' ? 60 : 1
  return n * mult
}

export async function signToken(
  payload: { sub: string; username: string; name?: string },
  secret: string,
  expiresInSeconds: number,
): Promise<string> {
  const now = Math.floor(Date.now() / 1000)
  const header = { alg: 'HS256', typ: 'JWT' }
  const body: TokenPayload = { ...payload, iat: now, exp: now + expiresInSeconds }
  const head = bytesToB64url(enc.encode(JSON.stringify(header)))
  const data = bytesToB64url(enc.encode(JSON.stringify(body)))
  const signingInput = `${head}.${data}`
  const sig = await crypto.subtle.sign('HMAC', await hmacKey(secret), enc.encode(signingInput))
  return `${signingInput}.${bytesToB64url(new Uint8Array(sig))}`
}

export async function verifyToken(
  token: string | undefined | null,
  secret: string,
): Promise<TokenPayload | null> {
  if (!token) return null
  const parts = token.split('.')
  if (parts.length !== 3) return null
  try {
    const ok = await crypto.subtle.verify(
      'HMAC',
      await hmacKey(secret),
      b64urlToBytes(parts[2]),
      enc.encode(`${parts[0]}.${parts[1]}`),
    )
    if (!ok) return null
    const payload = JSON.parse(new TextDecoder().decode(b64urlToBytes(parts[1]))) as TokenPayload
    if (typeof payload.exp !== 'number' || payload.exp < Math.floor(Date.now() / 1000)) return null
    return payload
  } catch {
    return null
  }
}

/* ---------------- Cookie тохиргоо ---------------- */

export const ACCESS_COOKIE = 'board_access'
export const REFRESH_COOKIE = 'board_refresh'

export const accessSecret = () => process.env.JWT_ACCESS_SECRET || 'dev-access-secret'
export const refreshSecret = () => process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret'
export const accessTtl = () => parseExpiry(process.env.ACCESS_TOKEN_EXPIRY, 7 * 86400)
export const refreshTtl = () => parseExpiry(process.env.REFRESH_TOKEN_EXPIRY, 7 * 86400)
