import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { REFRESH_COOKIE, refreshSecret, verifyToken } from '@/lib/auth'
import { attachAuthCookies, clearAuthCookies } from '@/lib/session'

export const dynamic = 'force-dynamic'

export async function POST() {
  const store = await cookies()
  const payload = await verifyToken(store.get(REFRESH_COOKIE)?.value, refreshSecret())
  if (!payload) {
    return clearAuthCookies(
      NextResponse.json({ error: 'Дахин нэвтэрнэ үү.' }, { status: 401 }),
    )
  }

  const user = { sub: payload.sub, username: payload.username, name: payload.name }
  return attachAuthCookies(NextResponse.json({ admin: user }), user)
}
