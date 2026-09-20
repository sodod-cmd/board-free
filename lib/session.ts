import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  accessSecret,
  accessTtl,
  refreshSecret,
  refreshTtl,
  signToken,
  verifyToken,
  type TokenPayload,
} from '@/lib/auth'

type SessionUser = { sub: string; username: string; name?: string }

const baseCookie = {
  httpOnly: true,
  sameSite: 'lax' as const,
  path: '/',
  secure: process.env.NODE_ENV === 'production',
}

/** Нэвтэрсэн админд access + refresh cookie олгоно. */
export async function attachAuthCookies(res: NextResponse, user: SessionUser) {
  const access = await signToken(user, accessSecret(), accessTtl())
  const refresh = await signToken(user, refreshSecret(), refreshTtl())
  res.cookies.set(ACCESS_COOKIE, access, { ...baseCookie, maxAge: accessTtl() })
  res.cookies.set(REFRESH_COOKIE, refresh, { ...baseCookie, maxAge: refreshTtl() })
  return res
}

export function clearAuthCookies(res: NextResponse) {
  res.cookies.set(ACCESS_COOKIE, '', { ...baseCookie, maxAge: 0 })
  res.cookies.set(REFRESH_COOKIE, '', { ...baseCookie, maxAge: 0 })
  return res
}

/** Одоогийн хүсэлтийн нэвтэрсэн админыг буцаана (эсвэл null). */
export async function getCurrentAdmin(): Promise<TokenPayload | null> {
  const store = await cookies()
  const payload = await verifyToken(store.get(ACCESS_COOKIE)?.value, accessSecret())
  if (payload) return payload
  // Access хугацаа нь дууссан бол refresh-ээр шалгана (шинэ cookie-г /api/auth/refresh олгоно).
  return verifyToken(store.get(REFRESH_COOKIE)?.value, refreshSecret())
}

/** API маршрутад ашиглах хамгаалалт. */
export async function requireAdmin(): Promise<
  { ok: true; admin: TokenPayload } | { ok: false; response: NextResponse }
> {
  const admin = await getCurrentAdmin()
  if (!admin) {
    return {
      ok: false,
      response: NextResponse.json({ error: 'Нэвтрэх шаардлагатай.' }, { status: 401 }),
    }
  }
  return { ok: true, admin }
}
